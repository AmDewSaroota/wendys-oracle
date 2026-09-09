import { auth, isReviewer } from "@/auth";
import { ensure, sql, logEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_B64 = 220 * 1024; // ไฟล์ดิบ 150 KB → base64 ราว 200 KB
const OK_MIME = ["image/svg+xml", "image/png", "image/webp"];

export async function POST(req: Request) {
  const session = await auth();
  const me = session?.user;
  if (!me?.email) return Response.json({ error: "unauthorized" }, { status: 401 });
  const who = me.name || me.email;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  const op = String(body.op || "");
  const id = String(body.id || "");
  const th = body.th ? String(body.th) : null;

  await ensure();

  // ---- คอมเมนต์: ผูกกับช่องไอคอน (slot:<id>) หรือหัวข้อในบรีฟ (brief:<key>) ----
  if (op === "comment" || op === "comment_del" || op === "comment_done") {
    if (op === "comment") {
      const target = String(body.target || "");
      if (!/^(slot|brief):[A-Za-z0-9._~:@+-]{1,120}$/.test(target))
        return Response.json({ error: "bad target" }, { status: 400 });
      const text = String(body.text || "").trim().slice(0, 2000);
      if (!text) return Response.json({ error: "ข้อความว่าง" }, { status: 400 });
      await sql`insert into comments (target, t, who, mail, text)
                values (${target}, ${Date.now()}, ${who}, ${me.email}, ${text})`;
      await logEvent({ who, mail: me.email, action: "cmt", slot: target, th });
      return Response.json({ ok: true });
    }
    const cid = Number(body.cid);
    if (!Number.isFinite(cid)) return Response.json({ error: "bad cid" }, { status: 400 });
    if (op === "comment_del") {
      // ลบได้เฉพาะข้อความของตัวเอง
      const rows = (await sql`select mail from comments where id = ${cid}`) as Record<string, unknown>[];
      if (!rows.length) return Response.json({ ok: true });
      if (String(rows[0].mail || "") !== me.email)
        return Response.json({ error: "ลบได้เฉพาะข้อความของตัวเอง" }, { status: 403 });
      await sql`delete from comments where id = ${cid}`;
      return Response.json({ ok: true });
    }
    // ปิด/เปิดประเด็น
    const want = body.done !== false;
    await sql`update comments set resolved = ${want},
                resolved_by = ${want ? who : null}, resolved_at = ${want ? Date.now() : null}
              where id = ${cid}`;
    return Response.json({ ok: true });
  }

  if (!id || !/^[A-Za-z0-9._~:@+-]{1,120}$/.test(id))
    return Response.json({ error: "bad id" }, { status: 400 });

  if (op === "alias") {
    const target = body.target ? String(body.target) : "";
    if (target) {
      if (target === id || !/^[A-Za-z0-9._~:@+-]{1,120}$/.test(target))
        return Response.json({ error: "ปลายทางไม่ถูกต้อง" }, { status: 400 });
      const t = (await sql`select alias_of, filename from slots where id = ${target}`) as Record<string, unknown>[];
      if (!t.length || !t[0].filename)
        return Response.json({ error: "ช่องปลายทางยังไม่มีไฟล์" }, { status: 400 });
      if (t[0].alias_of)
        return Response.json({ error: "ช่องปลายทางผูกอยู่กับช่องอื่นแล้ว" }, { status: 400 });
      await sql`update slots set alias_of = ${target} where alias_of = ${id}`;
      await sql`
        insert into slots (id, alias_of, status, filename, mime, data)
        values (${id}, ${target}, 'submitted', null, null, null)
        on conflict (id) do update set alias_of = ${target},
          filename = null, mime = null, data = null,
          uploaded_by = null, uploaded_mail = null, uploaded_at = null,
          status = 'submitted', review_by = null, review_mail = null, review_at = null`;
    } else {
      await sql`update slots set alias_of = null where id = ${id}`;
      await sql`delete from slots where id = ${id} and filename is null and alias_of is null`;
    }
    await logEvent({ who, mail: me.email, action: target ? "link" : "unlink",
                     slot: id, th, filename: target || null });
    return Response.json({ ok: true });
  }

  if (op === "upload") {
    const name = String(body.name || "").slice(0, 160);
    const mime = String(body.mime || "");
    const data = String(body.data || "");
    if (!OK_MIME.includes(mime))
      return Response.json({ error: "รับเฉพาะ SVG · PNG · WebP" }, { status: 400 });
    if (!data || data.length > MAX_B64)
      return Response.json({ error: "ไฟล์ใหญ่เกิน 150 KB" }, { status: 400 });

    const had = (await sql`select filename from slots where id = ${id}`) as unknown[];
    const now = Date.now();
    await sql`
      insert into slots (id, filename, mime, data, uploaded_by, uploaded_mail, uploaded_at,
                         status, review_by, review_mail, review_at)
      values (${id}, ${name}, ${mime}, ${data}, ${who}, ${me.email}, ${now},
              'submitted', null, null, null)
      on conflict (id) do update set
        filename = excluded.filename, mime = excluded.mime, data = excluded.data,
        uploaded_by = excluded.uploaded_by, uploaded_mail = excluded.uploaded_mail,
        uploaded_at = excluded.uploaded_at, status = 'submitted',
        review_by = null, review_mail = null, review_at = null, alias_of = null`;
    await logEvent({ who, mail: me.email, action: had.length ? "re" : "up", slot: id, th, filename: name });
    return Response.json({ ok: true });
  }

  if (op === "review") {
    if (!isReviewer(me.email))
      return Response.json({ error: "บัญชีนี้ไม่มีสิทธิ์รีวิว" }, { status: 403 });
    const want = String(body.status || "");
    if (!["approved", "revise", "submitted"].includes(want))
      return Response.json({ error: "bad status" }, { status: 400 });
    const back = want === "submitted";
    await sql`
      update slots set status = ${want},
        review_by = ${back ? null : who}, review_mail = ${back ? null : me.email},
        review_at = ${back ? null : Date.now()}
      where id = ${id}`;
    await logEvent({
      who, mail: me.email, slot: id, th,
      action: back ? "undo" : want === "approved" ? "ok" : "rev",
    });
    return Response.json({ ok: true });
  }

  if (op === "note") {
    const note = String(body.note ?? "").slice(0, 600);
    await sql`
      update slots set note = ${note}, note_by = ${who}, note_at = ${Date.now()}
      where id = ${id}`;
    await logEvent({ who, mail: me.email, action: "note", slot: id, th });
    return Response.json({ ok: true });
  }

  if (op === "delete") {
    const rows = (await sql`select filename from slots where id = ${id}`) as Record<string, unknown>[];
    if (!rows.length) return Response.json({ ok: true });
    await sql`delete from slots where id = ${id}`;
    await logEvent({
      who, mail: me.email, action: "del", slot: id, th,
      filename: (rows[0].filename as string) || null,
    });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "unknown op" }, { status: 400 });
}
