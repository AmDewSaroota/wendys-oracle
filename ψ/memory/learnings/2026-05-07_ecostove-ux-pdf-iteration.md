# Lessons: EcoStove UX + PDF Iteration

**Date**: 2026-05-07
**Source**: rrr: ecostove-start-button-guide-pdf

## touch-action: manipulation
เพิ่มใน CSS `button, [onclick] { touch-action: manipulation; }` แก้ 300ms click delay บน Chrome Android/iOS
แม้จะมี `user-scalable=no` แล้ว บาง browser ยังมี delay — touch-action ที่ element level แก้ได้ชัวร์

## Emoji color = OS-dependent
▶️ → Samsung เหลือง, Windows ฟ้า, iOS ฟ้าเข้ม
ใช้ ▶ (ไม่มี variation selector U+FE0F) เพื่อ render เป็น text symbol ไม่มีกรอบสี
หรือใช้ geometric emoji เช่น 🟡 🟢 ที่ consistent ทุก platform

## activePollFn pattern
ถ้าต้องการ call function ที่อยู่ใน closure ภายนอก → expose ที่ module level
```js
let activePollFn = null;
// ใน startPolling(): activePollFn = pollFn;
// ที่อื่น: if (activePollFn) activePollFn();
```

## Supabase fake data injection
ทดสอบ edge case (cooldown/daily-limit) โดย POST โดยตรงผ่าน REST API + service_role key
ไม่ต้องรอ real scenario — inject แล้วทดสอบทันที แล้วลบทิ้งหลังเสร็จ

## Edge headless PDF
```
msedge.exe --headless=new --print-to-pdf="path.pdf" --no-pdf-header-footer URL
```
ใช้ URL จริง (production) ไม่ใช่ local file เพราะ Tailwind CDN + fonts ต้องการ network
