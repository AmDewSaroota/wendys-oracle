# Handoff: EcoStove — AQI Fix, Dashboard Polish, Slides Update

**Date**: 2026-03-03 19:51
**Context**: 15% (continued from context overflow)

## What We Did

### 1. Dashboard UI — ลบ Compliance Tracker + Activity Icons
- **ลบ "ความสมบูรณ์ของข้อมูล (7 วันล่าสุด)"** — section ที่สร้างความสับสน
  - ลบ HTML, i18n keys, JS function call, และ function body ทั้งหมด
- **Activity Log Icons** — เปลี่ยนจาก exact-match เป็น keyword matching
  - `getActionStyle()` ใช้ `includes()` รองรับ Thai + English
  - แต่ละ action มีไอคอน + สีพื้นหลังเฉพาะ (เช่น login=🔑 blue, approve=✅ green, delete=🗑️ red)
- Deploy สำเร็จ → biomassstove.vercel.app

### 2. แก้ AQI Bug — ค่าเป็น 1 ตลอดในตาราง
- **สาเหตุ**: `sync.js` (cloud) ใช้ `parseAqi(readings.air_quality_index)` → Tuya ส่ง level (1-5) ไม่ใช่ค่า AQI จริง
- **แก้ไข**: แทนที่ด้วย `calculateAqiFromPm25(readings.pm25_value)` ใช้ US EPA breakpoints
  - `sensor-monitor.js` (local) มี formula ถูกต้องอยู่แล้ว — bug เฉพาะ cloud sync
- **Backfill**: สร้าง `fix-aqi.js` แก้ข้อมูลเก่า 329 records
  - PM2.5=15 → AQI=57, PM2.5=13 → AQI=53, PM2.5=14 → AQI=55
- Deploy สำเร็จ

### 3. สไลด์คุย อ.แก้ว — อัพเดท 12→13 หน้า
- **Updated**: Slides 4, 5, 6, 7, 8, 9, 10, 13 — reflect actual implementation
  - GitHub Actions → Vercel Cron, PM2 → Vercel Serverless
  - LINE notifications: เที่ยง + 2 ทุ่ม (ไม่ใช่ reminder)
  - อ.แก้วติดตามอาสาเอง
- **NEW Slide 11**: "สิ่งที่เสร็จแล้ว" — 6 cards (Dashboard, Session Mgmt, LINE OA, DB, Data Cleaning, Deploy)
- **Slide 13**: Next Steps — column 1 crossed out completed items, columns 2-3 remaining
- เพิ่ม ✅ tags บนสไลด์ที่ implement แล้ว
- เปลี่ยนวันที่เป็น มีนาคม 2026

## Pending
- [ ] SQL migration (sessions + daily_summaries tables) — if needed beyond current schema
- [ ] LINE OA + Messaging API integration (beyond current cron)
- [ ] เลือก + เซ็ต server (Oracle Cloud / NIPA) — for production
- [ ] คู่มือเซนเซอร์ (ชาวบ้าน + อาสา)
- [ ] ซื้อเซนเซอร์ MT13W 10 ตัว + microSD
- [ ] ติดตั้งเซนเซอร์ที่บ้านกลุ่มตัวอย่าง
- [ ] Review สไลด์กับ DewS ก่อนคุย อ.แก้ว
- [ ] ลบ `fix-aqi.js` (one-time script, ทำเสร็จแล้ว)

## Next Session
- [ ] Review สไลด์ `ecostove-meeting-ajkaew.html` กับ DewS อีกรอบ
- [ ] หลังคุย อ.แก้ว → อัปเดตคำตอบลงสไลด์/plan
- [ ] Dashboard improvements ถ้ามี feedback จาก อ.แก้ว
- [ ] Production deployment planning (server choice)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (แก้ compliance + activity icons)
- `lab/tuya-ecostove/deploy/api/sync.js` — Cloud sync (แก้ AQI calculation)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ อ.แก้ว (13 หน้า)
- `lab/tuya-ecostove/fix-aqi.js` — One-time AQI fix script (ใช้แล้ว, ลบได้)
- `lab/tuya-ecostove/sensor-monitor.js` — Local sensor monitor (มี AQI formula ถูกแล้ว)
- `lab/line-oa/` — LINE OA notifications (noon + evening cron)

## Key Decisions Made This Session
- AQI ต้องคำนวณจาก PM2.5 (EPA breakpoints) ไม่ใช่ใช้ Tuya level
- ลบ compliance tracker ออกจาก dashboard — confusing UX
- Activity icons ใช้ keyword matching (includes) แทน exact match
- สไลด์เน้น "สิ่งที่ทำแล้ว" เพื่อแสดง progress ให้ อ.แก้วเห็น
