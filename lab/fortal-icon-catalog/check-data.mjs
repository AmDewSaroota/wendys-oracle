import { readFileSync } from 'node:fs';
const D = JSON.parse(readFileSync('public/data.json','utf8'));
let pass=0, fail=0;
const ok=(n,c,x='')=>{ c?pass++:fail++; console.log((c?'PASS':'FAIL')+' — '+n+(x?'  ['+x+']':'')); };

const slots = D.flatMap(g => g.slots.map(s => ({...s, g})));
ok('จำนวนช่องรวม 141', slots.length===141, String(slots.length));
ok('จำนวนกลุ่มไอคอน 95', D.length===95, String(D.length));

const ids = slots.map(s=>s.id);
const dup = ids.filter((v,i)=>ids.indexOf(v)!==i);
ok('รหัสช่องไม่ซ้ำกัน', dup.length===0, dup.slice(0,3).join(','));

const badId = ids.filter(i=>!/^[A-Za-z0-9._~:@+-]{1,120}$/.test(i));
ok('รหัสช่องใช้ได้ทั้งกับฐานข้อมูลและชื่อไฟล์', badId.length===0, badId.slice(0,3).join(','));
ok('รหัสช่องไม่ยาวเกิน 120 ตัว', Math.max(...ids.map(i=>i.length))<=120, 'ยาวสุด '+Math.max(...ids.map(i=>i.length)));

const norm = s => String(s).toLowerCase().replace(/\.[a-z0-9]+$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const n = ids.map(norm);
const ndup = n.filter((v,i)=>n.indexOf(v)!==i);
ok('ลากหลายไฟล์แล้วจับคู่ไม่กำกวม (ชื่อย่อไม่ชนกัน)', ndup.length===0, ndup.slice(0,3).join(','));

ok('ทุกช่องมีชื่อไทย', slots.every(s=>s.th && s.th.trim()));
ok('ทุกช่องมีชื่ออังกฤษ', slots.every(s=>s.en && s.en.trim()),
   slots.filter(s=>!s.en).map(s=>s.id).slice(0,3).join(','));
ok('ทุกช่องบอกหน้าที่มันอยู่', slots.every(s=>s.route && s.route.trim()));
ok('ทุกช่องบอกป้าย aria-label หรือระบุว่าไม่มี', slots.every(s=>s.label && s.label.trim()));
ok('ประเภทของทุกช่องถูกต้อง 4 แบบ', slots.every(s=>['ok','dup','wrong','new'].includes(s.kind)),
   [...new Set(slots.map(s=>s.kind))].join(','));

ok('จำนวนช่องในกลุ่มตรงกับเลข n ที่เขียนไว้', D.every(g=>g.slots.length===g.n),
   D.filter(g=>g.slots.length!==g.n).map(g=>g.icon).join(','));
ok('ทุกกลุ่มที่มีไอคอนเดิม มีภาพ SVG แนบมา', D.filter(g=>g.icon!=='__new__').every(g=>g.svg && g.svg.includes('<svg')));
ok('SVG ทุกดวงปิดแท็กครบ', D.filter(g=>g.svg).every(g=>g.svg.trim().endsWith('</svg>')));

const dupSlots = D.filter(g=>g.n>1 && g.icon!=='__new__').reduce((a,g)=>a+g.n,0);
ok('ช่องที่ใช้ไอคอนซ้ำ = 65', dupSlots===65, String(dupSlots));
const newSlots = D.filter(g=>g.icon==='__new__').reduce((a,g)=>a+g.n,0);
ok('ช่องที่ยังไม่มีไอคอน = 4', newSlots===4, String(newSlots));

// อักขระที่อาจพังเวลาแสดงผล
const risky = slots.filter(s=>/[<>&"]/.test(s.th+s.en+s.route+s.label+(s.note||'')));
ok('ไม่มีอักขระที่ทำให้หน้าเว็บเพี้ยน (< > & ")', risky.length===0, risky.map(s=>s.id).slice(0,3).join(','));

console.log('\nสรุป: ผ่าน '+pass+' · ไม่ผ่าน '+fail);
