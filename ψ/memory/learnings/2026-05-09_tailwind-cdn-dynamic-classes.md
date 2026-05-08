# Tailwind CDN ไม่ generate dynamic classes

**Date**: 2026-05-09

Tailwind CDN (v3 Play CDN) สร้าง classes เฉพาะที่อยู่ใน initial HTML เท่านั้น — classes ที่ถูก add ผ่าน `classList.add()` ใน JavaScript จะไม่ถูก generate ให้.

**ผลลัพธ์**: `btn.classList.add('bg-gray-400')` → class ไม่มีใน stylesheet → ปุ่มยังเป็นสีเดิม

**วิธีแก้**: ใช้ inline style สำหรับ dynamic color changes เสมอ:
```js
btn.style.backgroundColor = '#9ca3af'; // แทน classList.add('bg-gray-400')
```

**กฎ**: เมื่อทำ dynamic color/style changes ใน Tailwind CDN project → default ไป inline style ก่อนเสมอ
