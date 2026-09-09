import { auth } from "@/auth";
import { ensure, sql, num } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) return new Response("unauthorized", { status: 401 });

  const { id } = await ctx.params;
  await ensure();
  const rows = (await sql`
    select data, mime, uploaded_at from slots where id = ${id}`) as Record<string, unknown>[];
  const row = rows[0];
  if (!row || !row.data) return new Response("not found", { status: 404 });

  const b64 = String(row.data).replace(/^data:[^,]*,/, "");
  const buf = Buffer.from(b64, "base64");
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": String(row.mime || "application/octet-stream"),
      "Cache-Control": "private, max-age=0, must-revalidate",
      ETag: '"' + num(row.uploaded_at) + '"',
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
