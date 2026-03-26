# Handoff: EcoStove Deep Insights Fixes

**Date**: 2026-03-26 22:30
**Context**: 60%

## What We Did

- **Fixed misleading PM2.5 "ดีมาก" badge** — ป้ายเทียบค่า Net (0.2) กับ WHO absolute thresholds ทำให้เข้าใจผิด → ลบป้ายออก แสดงค่า Gross แทน (Deep Insights + Basic)
- **Fixed critical cache bug** — หลัง approve/reject ข้อมูล, Deep Insights ใช้ cache เก่า (`fullDataLoaded = true` ไม่ refresh) → เพิ่ม `fullDataLoaded = false` ทุก approval/rejection function
- **Fixed sensor data invisible in charts** — sync.js ไม่ได้ set `stove_type` เมื่อไม่มี collection_period active → records มี `stove_type = NULL` → Deep Insights ข้าม → เพิ่ม `normalizeStoveType()` ที่ต้นทาง ให้ NULL = 'eco'
- **Added "วันนี้" (Today) button** — ปุ่มกดเลือกดูเฉพาะวันนี้ ลด confusion ระหว่าง quick range buttons กับ date pickers
- **Lowered session complete threshold** — จาก 24 → 22 readings (~85% coverage ตาม WHO/EPA ≥75% standard) เพราะ DewS เก็บได้ 22-23 ค่าจริงแต่โดน mark incomplete

## Pending

- [ ] **Session Timeline per-session graphs** — DewS ต้องการดูกราฟรายเซสชันย้อนหลัง, Session Timeline มีอยู่แล้วใน Deep Insights (คลิกแถว → modal PM2.5+CO2) แต่ยังไม่ได้ทดสอบว่า DewS พอใจไหม
- [ ] **Existing sessions with 22-23 readings** — ยังเป็น `incomplete` ใน DB → ต้อง UPDATE sessions SET session_status='complete' WHERE readings_count >= 22 AND session_status='incomplete'
- [ ] **collection_periods setup** — ต้นเหตุที่ stove_type เป็น NULL คือไม่มี active collection_period → ควรตั้งให้ถูกต้องในหน้า Admin
- [ ] **Raw Readings daily modal ที่งง** — DewS ไม่ชอบกราฟ "รายละเอียดวันที่" ที่รวมทุกเครื่อง → อาจต้องปรับหรือซ่อน
- [ ] **Git commit + push** — มี uncommitted changes (index.html + sync.js) + 2 unpushed commits

## Next Session

- [ ] ทดสอบ Deep Insights หลังแก้ — กดปุ่มวันนี้ ดูว่า PM2.5/CO2 ขึ้นแล้วจริงไหม
- [ ] UPDATE sessions ที่ 22-23 readings ให้เป็น complete ใน Supabase
- [ ] ตั้ง collection_periods ให้ mock devices (ป้องกัน stove_type NULL)
- [ ] ทดสอบ Session Timeline — คลิกแถวดูกราฟรายเซสชัน ตรงตามที่ DewS ต้องการไหม
- [ ] rrr retrospective

## Key Files

- `lab/tuya-ecostove/deploy/index.html` — Dashboard หลัก (แก้ badge, cache, normalize, filter UX, threshold)
- `lab/tuya-ecostove/deploy/api/sync.js` — Session complete threshold 24→22
