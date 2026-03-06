# Handoff: EcoStove Baseline Threshold Lines

**Date**: 2026-03-06 22:30
**Context**: ~40%

## What We Did

### Baseline Reference Lines (เส้นค่ามาตรฐาน)
- เพิ่มเส้นประ threshold บนกราฟ sensor charts ทุกตัวที่มีค่ามาตรฐานรองรับ
- PM2.5: PCD 25 (เหลืองอำพัน) + PCD 37.5 (แดง) — ราชกิจจานุเบกษา พ.ศ. 2566
- AQI: AQI 50 (เหลืองอำพัน) + AQI 100 (แดง) — ราชกิจจานุเบกษา พ.ศ. 2566
- CO2: IAQ 1000 (แดง) — กรมอนามัย พ.ศ. 2565
- HCHO: WHO 0.1 mg/m³ (config ready, ไม่มี line chart แยก)
- ใช้ Chart.js inline plugin `thresholdLinesPlugin()` — ไม่ต้องพึ่ง CDN เพิ่ม
- แก้ปัญหา threshold lines ไม่เห็นด้วย `suggestedMax` บน Y-axis
- Deploy สำเร็จ + verify ผ่าน dev-browser

### Previous Session (ก่อน context compaction)
- Supabase Auth + RLS + Admin management
- i18n fixes
- Optimization checklist (6/18 done)

## Pending
- [ ] HCHO line chart แยก (ตอนนี้อยู่ใน gas bar chart รวมกับ CO2)
- [ ] Optimization checklist (12/18 remaining):
  - [ ] N+1 queries optimization
  - [ ] Tuya API retry logic
  - [ ] Timezone handling
  - [ ] Thai address cache
  - [ ] Confirm dialogs for destructive actions
  - [ ] closeSession retry
  - [ ] Data retention policy
  - [ ] TVOC validation
  - [ ] Quota race condition
  - [ ] Hardcoded constants → config
  - [ ] Duplicate map code
  - [ ] RPC for closeSession

## Next Session
- [ ] ถาม อ.แก้ว ว่าต้องการ HCHO line chart แยกไหม
- [ ] เตรียม dashboard สำหรับ 10 บ้าน field test
- [ ] ดำเนินการ optimization checklist ต่อ
- [ ] เช็คว่า session limit + cooldown ทำงานถูกต้อง

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Main dashboard (all changes)
  - THRESHOLDS config + thresholdLinesPlugin: ~line 1169-1220
  - Sensor chart plugins + suggestedMax: ~line 2133-2136
  - Session detail chart plugins: ~line 3669, 3741
  - i18n threshold.source: ~line 759

## Source References (สำหรับ อ.แก้ว)
| Metric | ค่า | แหล่งอ้างอิง | URL |
|--------|-----|-------------|-----|
| PM2.5 | 25 / 37.5 µg/m³ | กรมควบคุมมลพิษ ราชกิจจานุเบกษา 2566 | laws.anamai.moph.go.th |
| AQI | 50 / 100 | กรมควบคุมมลพิษ ราชกิจจานุเบกษา 2566 | laws.anamai.moph.go.th |
| CO2 | 1,000 ppm | กรมอนามัย ค่าเฝ้าระวัง IAQ 2565 | laws.anamai.moph.go.th |
| HCHO | 0.1 mg/m³ | WHO Indoor Air Quality Guidelines 2010 | who.int/publications/i/item/9789289002134 |
