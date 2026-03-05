# Plan: EcoStove — Fix Daily Summary + Cooking Detection Discussion

## Background
Session เมื่อเช้า (2026-03-05) เราแก้ Dashboard หลายจุดเพื่อ demo อ.แก้ว:
- แก้ "ไม่ระบุบ้าน" → สร้าง HOUSE_NAMES lookup จาก devices→subjects
- ซ่อน Daily Summary (0/0 bug)
- เปลี่ยน Approve popup → full-screen modal
- แก้ sync.js ให้ใส่ house_id ตอนสร้าง session
- พบปัญหาใหญ่: เซนเซอร์ online ตลอดถ้ามี WiFi → ไม่รู้ว่าตอนไหนทำอาหาร

## Pending from Last Session
- [ ] **Daily Summary bug** — upsertDailySummary ไม่ update ตั้งแต่ 4 มี.ค. (unique constraint + null house_id?)
- [ ] **Sensor always-online problem** — บ้านมี WiFi → เซนเซอร์ online 24 ชม. → ต้องคุย อ.แก้ว
- [ ] **sync.js house_id** — deployed แล้ว แต่ยังไม่ได้ test session ใหม่
- [ ] **คู่มือ** — ซ่อนจากสไลด์แล้ว แต่ต้องทำจริง
- [ ] **LINE push อาสา** — ยังไม่ได้ implement (future feature)

## Next Session Goals
1. **Debug daily summary upsert** — เช็ค unique constraint ใน Supabase, ลอง upsert ด้วย house_id
2. **Test session ใหม่** — ให้เซนเซอร์สร้าง session ใหม่แล้วเช็คว่า house_id ถูกต้อง
3. **คุย อ.แก้ว เรื่อง WiFi + cooking detection** — เตรียม options: LINE button, smart plug, spike detection
4. **ทำคู่มือ** (ถ้า อ.แก้ว ต้องการ)

## Reference
- Handoff: ψ/inbox/handoff/2026-03-05_09-45_ecostove-dashboard-slides-demo.md
- Key files: `lab/tuya-ecostove/deploy/api/sync.js`, `lab/tuya-ecostove/deploy/index.html`
