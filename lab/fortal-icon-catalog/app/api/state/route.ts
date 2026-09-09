import { auth, isReviewer } from "@/auth";
import { ensure, sql, num } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const me = session?.user;
  if (!me?.email) return Response.json({ error: "unauthorized" }, { status: 401 });

  await ensure();
  const [slots, events, comments] = await Promise.all([
    sql`select id, filename, mime, uploaded_by, uploaded_mail, uploaded_at,
               status, review_by, review_mail, review_at, note, note_by, note_at, alias_of
        from slots`,
    sql`select t, who, mail, action, slot, th, filename from events order by t desc limit 10`,
    sql`select id, target, t, who, text, resolved, resolved_by, resolved_at
        from comments order by t asc limit 800`,
  ]);

  const map: Record<string, unknown> = {};
  for (const r of slots as Record<string, unknown>[]) {
    map[r.id as string] = {
      name: r.filename,
      mime: r.mime,
      by: r.uploaded_by,
      byMail: r.uploaded_mail,
      at: num(r.uploaded_at),
      status: r.status,
      reviewBy: r.review_by,
      reviewAt: num(r.review_at),
      aliasOf: r.alias_of || null,
      note: r.note || "",
      noteBy: r.note_by,
      noteAt: num(r.note_at),
    };
  }

  return Response.json({
    me: { name: me.name || me.email, email: me.email, image: me.image || null,
          reviewer: isReviewer(me.email) },
    slots: map,
    events: (events as Record<string, unknown>[]).map((e) => ({
      t: num(e.t), u: e.who, a: e.action, slot: e.slot, th: e.th, f: e.filename,
    })),
    comments: (comments as Record<string, unknown>[]).map((c) => ({
      id: Number(c.id), target: c.target, t: num(c.t), u: c.who, text: c.text,
      done: !!c.resolved, doneBy: c.resolved_by, doneAt: num(c.resolved_at),
    })),
  });
}
