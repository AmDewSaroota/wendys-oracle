# Handoff: EcoStove — 6 Features จาก อ.แก้ว หลังพรีเซนต์

**Date**: 2026-03-05 13:27
**Context**: 45%

## What We Did

### Session (เช้า-บ่าย ~09:15-13:27)
- พรีเซนต์ อ.แก้ว เสร็จ → ได้ 6 requirements ใหม่
- แก้ **threshold >= 26** (จาก >= 3) ทั้ง sync.js + index.html
- **F6: Daily Summary Fix** — เพิ่ม house_id + on_conflict + error logging ใน upsert, unhide section, compact padding, i18n EN
- **F5: Session Timeline รายวัน** — toggle "รายวัน/รายเซสชัน" default=daily, aggregate by date+device
- **F3: AQI Reference Table** — `getPm25AqiLevel()` + badge สีข้าง PM2.5 + ℹ️ popup ตาราง AQI ไทย
- **F2: Map 300+ บ้าน** — Leaflet MarkerCluster + แยก 📡เขียว(sensor) / 🟠ส้ม(stove only) + legend + stats bar
- **F4: Baseline Subtraction** — Session เริ่ม `baseline` 10 นาที → คำนวณ avg → switch `collecting` + toggle "หักค่า Baseline" ใน Deep view
- **F1: Manual TVOC Recording** — FAB ✏️ สีม่วง → modal form กรอก TVOC + insert ผ่าน Supabase + recent readings
- **Deployed** to biomassstove.vercel.app
- **SQL migration** สำหรับ baseline columns — DewS ทำเสร็จแล้ว

## Pending

- [ ] **Test baseline flow** — รอ session ใหม่ที่จะเริ่มด้วย baseline phase 10 นาที แล้วเช็คว่า transition ไป collecting ถูกต้อง
- [ ] **Test daily summary** — เช็ควันถัดไปว่า upsert ทำงานถูกต้องแล้ว (ไม่ใช่ 0/0 อีก)
- [ ] **Test TVOC form** — ลองกรอก TVOC บนมือถือจริง
- [ ] **Map 300+ test** — เพิ่ม subjects 300+ ใน Supabase แล้วเช็ค MarkerCluster
- [ ] **Sensor always-online** — ยังไม่ได้แก้ (บ้านที่มี WiFi → เซนเซอร์ online ตลอด → เก็บ ambient ปนกับ cooking)
- [ ] **คู่มือ** — ยังต้องทำ (ซ่อนจากสไลด์แล้ว)
- [ ] **LINE push อาสา** — ยังไม่ implement

## Next Session

- [ ] Test baseline + daily summary + TVOC form ให้ครบ
- [ ] คุย อ.แก้ว เรื่อง WiFi + cooking detection (ถ้ามี feedback)
- [ ] ถ้า อ.แก้ว มี feedback จากพรีเซนต์ → แก้ตาม

## Key Files

- `lab/tuya-ecostove/deploy/api/sync.js` — baseline phase logic, session threshold >= 26, daily summary fix
- `lab/tuya-ecostove/deploy/index.html` — ทุก feature (AQI, map cluster, session daily, TVOC form, baseline toggle)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ (ไม่ได้แก้ session นี้)

## Known Issues

1. **Sensor always-online**: บ้านที่มี WiFi → เซนเซอร์ online 24 ชม. → ไม่รู้ว่าตอนไหนทำอาหาร — ต้องคุย อ.แก้ว
2. **Daily summary**: แก้ upsert แล้วแต่ยังไม่ได้ verify ว่าทำงานจริง (ต้องรอ sync cycle ถัดไป)
3. **Baseline phase**: ยังไม่ได้ test กับ session จริง (เพิ่ง deploy)
