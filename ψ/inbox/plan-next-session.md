# Plan: EcoStove — Deploy + Test + Daily Summary Fix

## Background
Session วันนี้ (2026-03-05 บ่าย) เราเพิ่ม 4 features ใหม่:
- Session Timeline แสดงวันล่าสุดวันเดียว
- has_sensor toggle บน card บ้าน
- Sensor swap dropdown บน card บ้าน
- Map popups แสดงชื่อเซนเซอร์ + ข้อมูลเตา/เซนเซอร์

## Pending from Last Session
- [ ] **Deploy + Test** — ยังไม่ได้ deploy ทั้ง 4 features
- [ ] **Daily Summary bug** — upsertDailySummary ไม่ update (unique constraint + null house_id)
- [ ] **Sensor always-online** — บ้านมี WiFi → เซนเซอร์ online 24 ชม. → ต้องคุย อ.แก้ว
- [ ] **คู่มือ** — ยังไม่ได้ทำ
- [ ] **ลงทะเบียนเซนเซอร์** — เมื่อได้เครื่องจริง

## Next Session Goals
1. **Deploy ทุกอย่าง** → test Session Timeline, has_sensor, sensor dropdown, map
2. **Fix daily summary upsert** — เช็ค unique constraint, ลอง upsert ด้วย house_id
3. **คุย อ.แก้ว** — WiFi/cooking detection + แผนลงทะเบียน 300 บ้าน (bulk import?)
4. **ทำคู่มือ** (ถ้า อ.แก้ว ต้องการ)

## Reference
- Handoff: ψ/inbox/handoff/2026-03-05_14-53_ecostove-300houses-sensor-swap.md
- Key file: `lab/tuya-ecostove/deploy/index.html`
