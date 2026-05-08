# Focus: EcoStove UI — Volunteer Session Flow

**Date**: 2026-05-09
**Status**: 🔄 บางส่วนเสร็จ, รอ DewS verify

---

## ✅ ทำเสร็จแล้ว (2026-05-09)

- [x] CO/TVOC input: side-by-side, CO ก่อน → `volunteer.html`
- [x] Start button loading state: สีเทา + ⏳ → `volunteer.html`
- [x] Countdown localStorage persist (รีเฟรชไม่รีเซ็ต) → `volunteer.html`
- [x] อัพเดท mockup → `guide-volunteer.html` (คู่มืออาสา PDF)
- [x] อัพเดท mockup → `index.html` admin guide tab (B4 section)
- [x] `system-demo.html`: ลบระบบเร่งเวลาออก, ทุกปุ่มกดได้จริง
- [x] `system-demo.html`: แก้บัก "ไม่เก็บ TVOC" ไปผิด step
- [x] `system-demo.html`: CO/TVOC side-by-side, fix gray button (inline style)
- [x] Deploy Vercel (`volunteer.html`, `guide-volunteer.html`, `index.html`)

---

## ⏳ รอทำ / ค้างไว้

- [ ] **DewS ยังไม่ได้ตรวจ UI ใหม่** ใน `volunteer.html`, `guide-volunteer.html`, `index.html` (ตรวจแค่ system-demo) → **เตือน DewS ให้ตรวจก่อนทำต่อ**
- [ ] `system-demo.html` vstep-2: เพิ่ม simulated dropdown เลือกบ้าน (เปลี่ยน/ยืนยัน)
- [ ] `volunteer.html`: แก้ conflict "quiet period banner + countdown active พร้อมกัน" → ซ่อน quiet banner ถ้า session กำลังวิ่ง (approach ตกลงแล้ว, ยังไม่ implement)

---

## Context

- Quiet period แก้ UI เท่านั้น — ไม่กระทบ quota calculation (server-side)
- Session ที่เริ่มก่อน 00:00 ใช้ quota ไปแล้ว → ไม่เพิ่ม usage ใหม่
- Sensors: MT15 x11 ติดตั้งครบแล้ว (BS 001–011 + BS 012–018 ที่เหลือ)
