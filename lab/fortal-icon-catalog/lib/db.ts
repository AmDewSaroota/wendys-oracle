import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;
let client: Sql | null = null;

/** ต่อฐานข้อมูลตอนถูกเรียกจริง ไม่ใช่ตอน build (ตอน build ยังไม่มี env) */
function client_(): Sql {
  if (client) return client;
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    "";
  if (!url) throw new Error("ยังไม่ได้ตั้งค่า DATABASE_URL บนโปรเจกต์นี้");
  client = neon(url);
  return client;
}

export const sql: Sql = ((strings: TemplateStringsArray, ...vals: unknown[]) =>
  (client_() as unknown as (s: TemplateStringsArray, ...v: unknown[]) => unknown)(
    strings,
    ...vals,
  )) as unknown as Sql;

let ready: Promise<void> | null = null;

/** สร้างตารางครั้งแรกที่ถูกเรียก (ปลอดภัยถ้าเรียกซ้ำ) */
export function ensure() {
  if (!ready) {
    ready = (async () => {
      await sql`
        create table if not exists slots (
          id            text primary key,
          filename      text,
          mime          text,
          data          text,
          uploaded_by   text,
          uploaded_mail text,
          uploaded_at   bigint,
          status        text not null default 'submitted',
          review_by     text,
          review_mail   text,
          review_at     bigint,
          note          text not null default '',
          note_by       text,
          note_at       bigint
        )`;
      await sql`
        create table if not exists events (
          id       bigserial primary key,
          t        bigint not null,
          who      text not null,
          mail     text,
          action   text not null,
          slot     text not null,
          th       text,
          filename text
        )`;
      await sql`alter table slots add column if not exists alias_of text`;
      await sql`create index if not exists events_t_idx on events (t desc)`;
      await sql`
        create table if not exists comments (
          id          bigserial primary key,
          target      text not null,
          t           bigint not null,
          who         text not null,
          mail        text,
          text        text not null,
          resolved    boolean not null default false,
          resolved_by text,
          resolved_at bigint
        )`;
      await sql`create index if not exists comments_target_idx on comments (target, t)`;
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

export type SlotRow = {
  id: string;
  filename: string | null;
  mime: string | null;
  uploaded_by: string | null;
  uploaded_mail: string | null;
  uploaded_at: string | number | null;
  status: string;
  review_by: string | null;
  review_mail: string | null;
  review_at: string | number | null;
  note: string;
  note_by: string | null;
  note_at: string | number | null;
};

export const num = (v: unknown) => (v == null ? 0 : Number(v));

export async function logEvent(e: {
  who: string;
  mail?: string | null;
  action: string;
  slot: string;
  th?: string | null;
  filename?: string | null;
}) {
  await sql`
    insert into events (t, who, mail, action, slot, th, filename)
    values (${Date.now()}, ${e.who}, ${e.mail || null}, ${e.action}, ${e.slot},
            ${e.th || null}, ${e.filename || null})`;
}
