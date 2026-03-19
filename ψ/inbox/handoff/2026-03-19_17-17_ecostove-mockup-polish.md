# Handoff: EcoStove Mockup Polish & Finalization

**Date**: 2026-03-19 17:17
**Context**: ~85%

## What We Did
- เปลี่ยน "พื้นฐาน" → "Baseline" ทั้งหมดใน mockup
- แยก Ambient Baseline เป็น 2 ค่า (old/eco) — สะท้อนว่าเก็บข้อมูลคนละวัน อาจมีไฟป่าวันไหนวันนึงได้
- ขยาย Deep Insights จาก 2 กราฟ (PM2.5, CO2) → 6 กราฟ (PM2.5, PM10, CO2, CO, HCHO, TVOC) ในกริด 2×3 จัดกลุ่มตามประเภท
- เปลี่ยน date filter จาก dropdown+วันเดียว → date range picker + quick buttons (7/30/60 วัน)
- ลบจุดจากกราฟ (pointRadius: 0) ให้ดูสะอาด
- สร้างระบบ info popup (คลิก i ขึ้น popup อธิบาย) — ใช้เวลาปรับ styling 4 รอบตาม feedback
- เพิ่มขนาด group labels (ฝุ่นละออง / ก๊าซคาร์บอน / สารระเหย) ให้เด่นขึ้น
- เปลี่ยน font จาก Prompt → Chakra Petch (ให้ตรงกับ dashboard จริง)

## Pending
- [ ] รอ feedback จากอาจารย์แก้ว (ประชุม 2026-03-20) เรื่อง mockup narrative
- [ ] หลัง approve → implement narrative design เข้า `index.html` (dashboard จริง)
- [ ] Plan อยู่แล้ว: Daily Aggregation → Chart Redesign → Drill-down → Performance (plan file: `optimized-wiggling-blanket.md`)
- [ ] Push 2 commits ที่ยัง ahead of origin

## Next Session
- [ ] ดู feedback จากอาจารย์แก้ว → ปรับ mockup ตามที่ขอ (ถ้ามี)
- [ ] เริ่ม implement plan `optimized-wiggling-blanket.md` ใส่ `index.html` จริง
  - Task 1: Daily Aggregation Layer
  - Task 2: Redesign Sensor Charts (Daily Avg default)
  - Task 3: Drill-down + House Toggle + Date Picker
  - Task 4: Performance fixes (admin tabs, chart rendering)
- [ ] Commit + deploy `mockup-narrative.html` (ยังไม่ได้ commit)

## Key Files
- `lab/tuya-ecostove/deploy/mockup-narrative.html` — mockup หลัก (3 scenarios)
- `lab/tuya-ecostove/deploy/index.html` — dashboard จริง (จะแก้ตาม plan)
- `lab/tuya-ecostove/deploy/index-backup-20260319.html` — backup ก่อนแก้
- Plan: `C:\Users\CPL\.claude\plans\optimized-wiggling-blanket.md`
