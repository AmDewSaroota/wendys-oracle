import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
const url=(readFileSync('.env.local','utf8').match(/^DATABASE_URL="?([^"\r\n]+)"?/m)||[])[1];
const sql=neon(url);
const ok=(n,c,x='')=>console.log((c?'PASS':'FAIL')+' — '+n+(x?'  ['+x+']':''));
const r=(await sql`select * from slots`)[0];
if(!r){console.log('ไม่มีแถวเลย');process.exit(0);}
const th=(t)=>new Date(Number(t)).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});
console.log('ช่อง:',r.id,'| ไฟล์:',r.filename,'| ชนิด:',r.mime);
ok('บันทึกคนอัปโหลด', !!r.uploaded_by, r.uploaded_by);
ok('บันทึกอีเมลคนอัปโหลด', !!r.uploaded_mail, r.uploaded_mail);
ok('บันทึกเวลาอัปโหลด', Number(r.uploaded_at)>0, th(r.uploaded_at));
ok('สถานะเป็น approved หลังกดผ่าน', r.status==='approved', r.status);
ok('บันทึกคนรีวิว + เวลารีวิว', !!r.review_by && Number(r.review_at)>0, r.review_by+' · '+th(r.review_at));
ok('บันทึกหมายเหตุ + คนเขียน + เวลา', !!r.note && !!r.note_by && Number(r.note_at)>0, JSON.stringify(r.note)+' โดย '+r.note_by);
const b=Buffer.from(String(r.data).split(',')[1],'base64');
const png = b[0]===0x89 && b.toString('latin1',1,4)==='PNG';
ok('ไฟล์ที่เก็บเป็นรูปจริง อ่านกลับได้', r.mime==='image/png' ? png : b.length>0, r.mime+' · '+Math.round(b.length/1024)+' KB');
ok('เวลาเรียงถูก อัปโหลด → รีวิว → หมายเหตุ',
   Number(r.uploaded_at)<=Number(r.review_at) && Number(r.review_at)<=Number(r.note_at));
const e=await sql`select action,who,t from events where slot=${r.id} order by t`;
ok('ประวัติครบ 3 จังหวะ up→ok→note', e.map(x=>x.action).join('>')==='up>ok>note', e.map(x=>x.action).join(' > '));
ok('ทุกรายการมีชื่อคนกำกับ', e.every(x=>!!x.who), e[0].who);
