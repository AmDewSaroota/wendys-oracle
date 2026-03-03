# Handoff: EcoStove — Dashboard Fixes, API Limit Planning

**Date**: 2026-03-03 23:03
**Context**: 40%

## What We Did

### 1. Daily Summary Bug — แก้ข้อมูลเก่าทุกวัน
- **สาเหตุ**: `upsertDailySummary()` ถูกเรียกแค่ใน `closeSession()` success path → ถ้า Vercel timeout = daily summary ไม่อัพเดท
- **แก้ data**: Feb 27, 28, Mar 2 — ทุกวัน sessions_completed 1→2
  - Feb 27/28: คำนวณจาก session averages (raw logs อยู่ local ไม่ได้ upload)
  - Mar 2: คำนวณจาก pollution_logs จริง
- **แก้ code**: `upsertDailySummary()` ถูกเรียก 3 ที่:
  1. ท้าย sync cycle ทุกรอบ (safety net หลัก)
  2. closeSession error/catch block
  3. closeSession fetch-logs fail path

### 2. ลบ PM 1.0 — เซนเซอร์วัดไม่ได้
- Dashboard: ลบ stats card, คอลัมน์ตาราง, กราฟ PM, reduction table, export
- sync.js: หยุด insert pm1_value
- สไลด์: "8 ค่า" → "7 ค่า", ลบ PM1 จากรายการ

### 3. Dashboard UI Fixes
- ลบปุ่ม Export จาก 📊 ข้อมูลเชิงลึก (ยังอยู่ใน Admin)
- Scroll to top ทุกครั้งที่สลับแท็บ
- Stat cards: แถวบน 4 (grid-cols-4) + แถวล่าง 3 (grid-cols-3) เต็มความกว้าง
- แถวล่างเพิ่มสีขอบ: อุณหภูมิ=rose, ความชื้น=cyan, HCHO=amber

### 4. API Limit Planning (ยังไม่ implement)
- 10 เซนเซอร์ × 2 calls/sensor × ทุก 5 นาที = ~32,760/เดือน → เกิน 26,000 limit
- ตัด `getDeviceInfo` ไม่ได้ — เพราะ Tuya cache ค่าเก่าตอนเซนเซอร์ปิด
- **Tuya Batch API** น่าจะใช่ทางแก้ — ดึง 10 เซนเซอร์ใน 1 call
- ยังไม่ได้ research → ทำ session หน้า

## Pending
- [ ] Research Tuya Batch API (`/v2.0/cloud/thing/batch` หรือ `/v1.0/devices/status`)
- [ ] Implement batch status + batch device info
- [ ] Incomplete session ไม่นับโควต้า (max 4 total, 2 complete)
- [ ] Budget counter — นับ API calls ต่อวัน
- [ ] Review สไลด์กับ DewS ก่อนคุย อ.แก้ว
- [ ] LINE OA + Messaging API integration
- [ ] เลือก server (Oracle Cloud / NIPA)
- [ ] ลบ fix-aqi.js (one-time script ใช้แล้ว)

## Next Session
- [ ] Research + implement Tuya Batch API
- [ ] Session quota logic: incomplete ไม่นับ แต่ cap ที่ 4/day
- [ ] Review สไลด์ถ้าใกล้คุย อ.แก้ว
- [ ] Future: export กราฟเป็นรูป, anomaly flag

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — Cloud sync (แก้ daily summary + ลบ pm1)
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (UI fixes)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ (ลบ PM1)

## Key Decisions
- PM 1.0 ลบออกทั้งระบบ — เซนเซอร์วัดไม่ได้
- ตัด getDeviceInfo ไม่ได้ — ต้องเช็ค online/offline ป้องกัน cached data
- Batch API เป็นทางแก้ API limit ที่ดีที่สุด
