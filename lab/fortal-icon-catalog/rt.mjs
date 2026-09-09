import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
const url = (readFileSync('.env.local','utf8').match(/^DATABASE_URL="?([^"\r\n]+)"?/m)||[])[1];
const sql = neon(url);
const ok = (n,c)=>console.log((c?'PASS':'FAIL')+' — '+n);

const id='__selftest__', who='ตรวจระบบ', mail='test@local';
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>';
const data='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const now=Date.now();

// 1 อัปโหลด (คำสั่งเดียวกับ /api/action)
await sql`insert into slots (id,filename,mime,data,uploaded_by,uploaded_mail,uploaded_at,status,review_by,review_mail,review_at)
 values (${id},'t.svg','image/svg+xml',${data},${who},${mail},${now},'submitted',null,null,null)
 on conflict (id) do update set filename=excluded.filename, data=excluded.data, uploaded_at=excluded.uploaded_at, status='submitted'`;
await sql`insert into events (t,who,mail,action,slot,th,filename) values (${now},${who},${mail},'up',${id},'ทดสอบ','t.svg')`;
let r=(await sql`select * from slots where id=${id}`)[0];
ok('อัปโหลด — บันทึกไฟล์ + ชื่อคน + เวลา', r && r.filename==='t.svg' && r.uploaded_by===who && Number(r.uploaded_at)===now);
ok('ไฟล์ถอดกลับเป็น SVG เดิมได้', Buffer.from(String(r.data).split(',')[1],'base64').toString()===svg);

// 2 รีวิว
const t2=Date.now();
await sql`update slots set status='approved', review_by=${'พี่กี๋'}, review_mail=${mail}, review_at=${t2} where id=${id}`;
await sql`insert into events (t,who,mail,action,slot,th) values (${t2},${'พี่กี๋'},${mail},'ok',${id},'ทดสอบ')`;
r=(await sql`select * from slots where id=${id}`)[0];
ok('กดผ่าน — เก็บสถานะ + ชื่อคนรีวิว + เวลา', r.status==='approved' && r.review_by==='พี่กี๋' && Number(r.review_at)===t2);

// 3 หมายเหตุ
const t3=Date.now();
await sql`update slots set note=${'เส้นหนาไป'}, note_by=${who}, note_at=${t3} where id=${id}`;
r=(await sql`select * from slots where id=${id}`)[0];
ok('หมายเหตุ — เก็บข้อความ + คนเขียน', r.note==='เส้นหนาไป' && r.note_by===who);

// 4 ลบ แล้วประวัติต้องยังอยู่
await sql`delete from slots where id=${id}`;
await sql`insert into events (t,who,mail,action,slot,th,filename) values (${Date.now()},${who},${mail},'del',${id},'ทดสอบ','t.svg')`;
const gone=(await sql`select 1 from slots where id=${id}`).length===0;
const hist=await sql`select action from events where slot=${id} order by t`;
ok('ลบไฟล์ออกจากช่องได้', gone);
ok('ลบแล้วประวัติยังอยู่ครบ 3 รายการ (up→ok→del)', hist.map(x=>x.action).join('>')==='up>ok>del');

// เก็บกวาด
await sql`delete from events where slot=${id}`;
const left=await sql`select count(*)::int c from events where slot=${id}`;
ok('ล้างข้อมูลทดสอบออกหมด', left[0].c===0);
