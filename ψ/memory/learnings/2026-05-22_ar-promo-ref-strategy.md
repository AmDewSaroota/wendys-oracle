# AR Promo Ref Strategy — STCK clip

**Date**: 2026-05-22
**Project**: NDF Promo — STCK AR Educational App

## Key Lessons

### 1. REFA ใน people shots = lock pose ทั้งหมด
แนบ ref ที่มีคนใน scene → Dreamina ลอก pose, composition, และ element จาก ref มาเป๊ะ
**Fix**: แนบเฉพาะ component ref (UI, model, card) บรรยาย setting + คนใน text

### 2. Circular Portal คือ default ของ AR UI prompt
ถ้าไม่ห้ามชัด → ได้ circular viewport แทนที่จะเป็น full camera viewfinder
**Fix**: เพิ่ม "no circular frame, no portal, no scope effect" ทุก UI prompt

### 3. AR model ลอยนอกจอเสมอ
Dreamina/Seedance default ทำ hologram ลอยในโลกจริง ไม่ใช่บนหน้าจอ
**Fix**: "NOT floating in real world — only visible on phone screen" ทุกครั้ง

### 4. Metaphor shot vs AR shot ต่างกัน
- **AR shot**: model อยู่บนหน้าจอมือถือ ตัวละครมองจอ
- **Metaphor shot**: model ลอยในฉาก ตัวละครไม่รับรู้ เพื่อสื่ออารมณ์/ความหมาย

### 5. Classroom_REF ต้องเจนแยก
ถ้าอยากได้ห้องเรียน consistent ข้าม shot ต้องมี empty classroom ref image แยกต่างหาก
ไม่ควรใช้ REFA (มี UI + การ์ดจริงของ STKC อยู่ → ดึง element ผิด)
