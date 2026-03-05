# Handoff: EcoStove Dashboard Fixes + Slides Update for Demo

**Date**: 2026-03-05 09:45
**Context**: 60%

## What We Did

### Session 1 (เมื่อคืน ~21:00-00:07)
- อัพเดทสไลด์ EcoStove ทั้งหมดให้ตรง reality
  - LINE OA pricing: Light plan ไม่มีแล้ว → Basic 1,280 ฿ (15,000 msg)
  - Free plan: 200 → 300 msg/เดือน
  - เพิ่มค่าโดเมน .org (~350-500 ฿/ปี)
  - แก้ สถานการณ์ 5: "Vercel Cron" → "cron-job.org"
  - เพิ่ม Batch Approve warning, ซ่อนคู่มือ, ลบ ~8,000 บาท จากหน้าแรก
  - เพิ่มคำนวณ LINE push อาสา (miss ≤3 บ้าน → แผนฟรีพอ)
- LINE OA code fixes (env vars, query fix, crons restored)

### Session 2 (เช้านี้ ~09:15-09:45)
- **พบปัญหาใหญ่**: เซนเซอร์ที่ "ปิด" ยังเก็บข้อมูลได้ (ปิดหน้าจอ ≠ offline)
- **Session cooldown blocking**: MT29 เก็บไปรอบนึงตอน 07:00 โดยไม่ได้สั่ง → cooldown 5 ชม.
- สร้าง session "collecting" ใหม่ตรงใน DB เพื่อ demo
- **แก้ "ไม่ระบุบ้าน"**: sessions ไม่มี house_id → patch ทุก session + fix sync.js ให้ใส่ house_id อัตโนมัติ
- **แก้ house_name ใน Dashboard**: pollution_logs ไม่มี house_name → สร้าง HOUSE_NAMES lookup จาก devices→subjects
- **ซ่อนสรุปรายวัน**: daily_summaries 0/0 (bug ยังไม่แก้) → ซ่อนจาก Dashboard ก่อน
- **Approve modal**: เปลี่ยน browser confirm → full-screen modal

## Pending

- [ ] **Daily Summary bug** — upsertDailySummary ไม่ update ตั้งแต่ 4 มี.ค. (query `and()` ทำงาน แต่ upsert อาจ fail — unique constraint + null house_id?)
- [ ] **Sensor always-online problem** — ถ้าบ้านมี WiFi เซนเซอร์ online 24 ชม. ไม่รู้ว่าตอนไหนทำอาหาร → ต้องคุยกับ อ.แก้ว เรื่อง research methodology (LINE button? Smart plug? Spike detection?)
- [ ] **sync.js house_id** — deployed แล้ว แต่ยังไม่ได้ test session ใหม่ที่มี house_id
- [ ] **คู่มือ** — ซ่อนจากสไลด์แล้ว แต่ต้องทำจริง
- [ ] **LINE push อาสา** — ยังไม่ได้ implement (เป็น future feature)

## Next Session

- [ ] Debug daily summary upsert — เช็ค unique constraint ใน Supabase, ลอง upsert ด้วย house_id
- [ ] ทำคู่มือ (ถ้า อ.แก้ว ต้องการ)
- [ ] คุย อ.แก้ว เรื่อง WiFi + cooking detection
- [ ] Test session ใหม่ว่า house_id ถูกต้อง

## Key Files

- `lab/tuya-ecostove/deploy/api/sync.js` — sync + session management + daily summary
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (hidden daily summary, approve modal, HOUSE_NAMES lookup)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ (13 หน้า, updated LINE pricing + cron)
- `lab/line-oa/` — LINE OA project (Vercel Cron, morning/evening summaries)

## Known Issues

1. **Daily Summary**: upsert ทำงานถึง 3 มี.ค. แต่หลังจากนั้นไม่ update (0/0) — ซ่อนไว้ก่อน
2. **Sensor always-on**: เซนเซอร์ที่ต่อ WiFi บ้าน online ตลอด → เก็บข้อมูล ambient ปนกับ cooking → ปัญหา research methodology
3. **Cooldown bypass**: ต้อง manual insert session ใน DB ถ้าต้องการ demo ขณะอยู่ใน cooldown
