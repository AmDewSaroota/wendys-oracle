# Handoff: EcoStove — Sensors Arrived + Setup

**Date**: 2026-03-11 21:00
**Context**: 70%

## What We Did

### Sensor Naming Convention
- ออกแบบระบบชื่อ: **ES-01 ถึง ES-10** (EcoStove + ลำดับ)
- ไม่ผูกรุ่น ไม่ผูกบ้าน — ย้ายเครื่องได้

### Sticker Generator
- สร้าง `lab/tuya-ecostove/deploy/stickers.html`
- สติกเกอร์ 80×28mm ติดด้านบนเซนเซอร์ (ด้านหน้า=จอ, ข้าง=ช่องอากาศ, หลัง=ลำโพง)
- QR code → volunteer page (GPS detect บ้านอัตโนมัติ)
- ปุ่ม print สำหรับ A4 sticker sheet

### Tuya Integration Fixes
- ย้าย `TUYA_APP_USER_UID` จาก hardcode → env var (เตรียม handoff ให้อาจารย์)
- เพิ่ม env var บน Vercel (`TUYA_APP_USER_UID=sg1769167214791wrqoV`)
- แก้ sign invalid error (whitespace ใน env var)

### Dashboard Fixes (deployed 4 ครั้ง)
- แก้ปุ่มลงทะเบียนเซนเซอร์ กดแล้วนิ่ง → เพิ่ม try-catch + error toast
- เพิ่ม `refreshDiscoveryStatus()` — Tuya Cloud list อัปเดตหลังลงทะเบียน
- เอา dropdown เตาเก่า/เตาใหม่ ออกจากฟอร์มลงทะเบียน (default eco)

### Presentation Slide
- เพิ่ม slide 12/13 ใน slides.html: "การย้ายบัญชี Tuya Cloud"
- สิ่งที่ต้องการจากอาจารย์: email, มือถือ+TuyaApp, แอดมินเทคนิค

### Design Decisions (ยังไม่ implement)
- **Phase Schedule** — แยกเตาเก่า/ใหม่ด้วยช่วงเวลา ไม่ใช่ sensor tag
  - Phase 1 (เมษา–มิถุนา): เตาเก่า
  - Phase 2 (กค.–กย.): เตาใหม่
  - end_date nullable, ยืดหยุ่น
- stove_type ยังอยู่ใน DB (default 'eco') แค่ซ่อนจาก UI

## Pending
- [ ] DewS กำลังลงทะเบียนเซนเซอร์ 10 ตัว (MT13W 2–12) บน Dashboard
- [ ] สร้างบ้าน (subjects) 10 หลัง + พิกัด GPS
- [ ] ผูกเครื่อง ↔ บ้าน (devices table)
- [ ] ทดสอบ sync 10 ตัวพร้อมกัน
- [ ] สร้าง experiment_phases table + ผูกเข้า sync.js
- [ ] คู่มืออาสาสมัคร (ยังไม่สร้าง)
- [ ] Tuya account handoff → อาจารย์

## Next Session
- [ ] ตรวจสอบว่าลงทะเบียน 10 ตัวครบหรือยัง
- [ ] สร้างบ้าน + ผูกเครื่อง
- [ ] ทดสอบ sync 10 ตัว (เปิดเซนเซอร์ + hotspot)
- [ ] ถ้า sync ผ่าน → implement Phase Schedule (migration + sync.js + admin UI)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (modified: registration, discovery refresh)
- `lab/tuya-ecostove/deploy/api/tuya-devices.js` — TUYA_APP_USER_UID → env var
- `lab/tuya-ecostove/deploy/stickers.html` — Sticker generator (new)
- `lab/tuya-ecostove/deploy/slides.html` — Slide 12: Tuya handoff (new slide)
- `lab/tuya-ecostove/migrations/012_sync_schedule.sql` — Active days + holidays (ran)
