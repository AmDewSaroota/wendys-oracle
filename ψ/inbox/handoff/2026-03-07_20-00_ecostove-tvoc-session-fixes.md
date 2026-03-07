# Handoff: EcoStove TVOC Session + Dashboard Fixes

**Date**: 2026-03-07 20:00
**Machine**: น้องเวนดี้ 🖥️

## What We Did

### Bug Fixes
- **Session badge threshold**: แก้จาก `>= 10` เป็น `>= 26` — sessions 16 รายการเคยแสดง "✅ เก็บเสร็จ" ตอนนี้แสดง "⚠️ เก็บไม่ครบ" ถูกต้องแล้ว
- **Badge สีใหม่**: incomplete = amber (ไม่ใช่ red) + แสดง "เก็บได้ X/26 รายการ"
- **LINE OA**: morning.js + evening.js แก้ให้เช็ค `incomplete` sessions + แสดง reason จาก notes
- **sync.js closeReason**: ใส่สาเหตุปิด session ("ออฟไลน์เกิน X นาที" / "ครบเวลา X นาที") ลง notes

### TVOC Fixes
- **หน่วย**: เปลี่ยน "ppb" → **"mg/m³"** ทั้งหมด (form, charts, stats, export, reference table)
- **Threshold**: 300/500 ppb → **0.3/0.5 mg/m³** (WHO Indoor Air Quality)
- **ทศนิยม**: TVOC แสดง **3 ตำแหน่ง** (0.025 mg/m³) ทุกจุด
- **Reduction table**: เพิ่ม `dec` property — TVOC/HCHO=3, PM=2, CO2/AQI=0

### Concurrent TVOC Recording (A+B) — เสร็จแล้ว
- **Part A**: checkRecentRecords() — เช็คค่า TVOC ล่าสุด 30 นาที
- **Part B**: tvoc_active_sessions table (migration 008) — register/ping/remove
- **Browser ID**: crypto.randomUUID() stored in localStorage
- **Warnings**: amber (active session by someone else), blue (recent records)
- **Admin live status**: "🔴 กำลังบันทึกอยู่ตอนนี้" ในหน้าอนุมัติ

### Dashboard UX
- **Tab rename**: "ข้อมูลจากเซนเซอร์" → "ตารางข้อมูล"
- **Volunteer name**: แหล่งข้อมูลแสดงชื่ออาสาแทน "manual"
- **เอา "ค่าล่าสุดจาก Sensor" ออก** → แทนด้วย "เก็บข้อมูลวันนี้" ขยาย:
  - Per-house breakdown (sensor + TVOC)
  - Status icons: ✅ ครบ / ⚠️ ไม่ครบ / 🔄 กำลังเก็บ / ❌ ยังไม่เปิด
  - TVOC manual readings per house
  - Live TVOC recording status

## Pending
- [ ] ทดสอบ session TVOC จริง (เปิด session → กรอกค่า → จบ session → approve)
- [ ] Records TVOC เก่าถูก rejected (ข้อมูลผิด ไม่ได้ผ่าน session) — ทิ้งได้
- [ ] LINE OA deploy (morning.js + evening.js แก้แล้วใน repo แต่ยังไม่ deploy ไป line-oa project)
- [ ] Plan เดิม Step 4.8: getFilteredData() ให้ include manual records ที่มี house_id (done แล้วในโค้ดแต่ยังไม่ได้ทดสอบกับ data จริง)

## Next Session
- [ ] Deploy LINE OA updates (morning.js + evening.js)
- [ ] ทดสอบ TVOC session flow end-to-end กับ DewS
- [ ] ตรวจสอบ "เก็บข้อมูลวันนี้" expanded card ว่าแสดงถูกต้อง
- [ ] อาจต้องเพิ่ม: TVOC data ใน daily_summaries (ปัจจุบันเฉพาะ sensor)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (single-file)
- `lab/tuya-ecostove/deploy/api/sync.js` — Sync API (closeReason)
- `lab/tuya-ecostove/migrations/008_tvoc_active_sessions.sql` — Migration (รันแล้ว)
- `lab/line-oa/api/cron/morning.js` — LINE cron เช้า (แก้แล้ว)
- `lab/line-oa/api/cron/evening.js` — LINE cron เย็น (แก้แล้ว)
