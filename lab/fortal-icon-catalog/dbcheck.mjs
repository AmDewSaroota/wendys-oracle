import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
const env = readFileSync('.env.local', 'utf8');
const url = (env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m) || [])[1];
if (!url) { console.log('ไม่พบ DATABASE_URL'); process.exit(1); }
const sql = neon(url);
const t = await sql`select table_name from information_schema.tables where table_schema='public' order by 1`;
console.log('ตาราง:', t.map(r => r.table_name).join(', ') || '(ยังไม่มี)');
if (t.some(r => r.table_name === 'slots')) {
  const s = await sql`select id, filename, status, uploaded_by, uploaded_at, review_by, note from slots order by uploaded_at desc`;
  console.log('แถวใน slots:', s.length);
  for (const r of s) console.log('  •', r.id, '|', r.filename, '|', r.status, '| โดย', r.uploaded_by, '|', new Date(Number(r.uploaded_at)).toLocaleString('th-TH'));
  const e = await sql`select t, who, action, slot, filename from events order by t desc limit 15`;
  console.log('เหตุการณ์ล่าสุด:', e.length);
  for (const r of e) console.log('  •', new Date(Number(r.t)).toLocaleString('th-TH'), '|', r.who, '|', r.action, '|', r.slot);
} else {
  console.log('ยังไม่มีตาราง — แปลว่ายังไม่มีใครเรียก API ที่เขียนข้อมูล');
}
