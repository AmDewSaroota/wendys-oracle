# Handoff: EcoStove Dashboard Polish (Session 2)

**Date**: 2026-03-02 ~14:30
**Context**: ~85%

---

## What We Did

### Dashboard UI (deploy/index.html)
- **Approval cards redesign**: ชื่อบ้าน + เซนเซ่อ + ช่วงเวลาจริง (HH:MM–HH:MM) + status badge + peak/avg PM2.5+CO2 พร้อมเวลา + ปุ่ม 📊 ดูรายละเอียด
- **Chart modal**: `showLogsChart(sKey)` ใช้ pre-loaded logs, ไฮไลท์จุดพีคสีแดง
- **Chart x-axis**: ย้าย `stepSize: 30` ไปอยู่ใน `ticks` (ถูก) ไม่ใช่ใน `time` (ผิด)
- **Export dialog**: ถ้า filter sensor อยู่ → popup ถาม export เฉพาะ หรือทั้งหมด
- **Map fallback**: แสดงข้อความ "ยังไม่มีพิกัด GPS" กลางแผนที่แทนที่จะว่างเปล่า
- **Approve/Reject disable**: ปุ่มเทาและ disabled ขณะสถานะ "กำลังเก็บ"
- **Label**: "อุ่นเครื่อง" → "เตรียมเก็บข้อมูล"
- **Removed**: ปุ่ม Force Collect [test] + ปุ่ม 🎭 ดูตัวอย่างกราฟ

### Bug Fixes
- `addSubject()`: `record.connectivity` → `record.connectivity_mode` (column name mismatch)
- `deleteVolunteer/deleteSubject`: เพิ่ม error toast เมื่อ Supabase reject
- Supabase RLS: แนะนำ `DISABLE ROW LEVEL SECURITY` บน 4 tables สำหรับ dev → user ทำแล้ว

### GitHub Actions Status
- Cron ทำงาน ✅ แต่ **ไม่ได้รันทุก 15 นาที** — GitHub throttle เหลือ ~ทุก 1 ชั่วโมง
- Latest run: 2026-03-02T06:37Z (success)

---

## Pending

- [ ] **Deploy ยังไม่เสร็จ** — สุดท้ายถูก reject ก่อน deploy (ปุ่มลบ + proper auth อธิบาย)
- [ ] **Proper Supabase Auth** — ยังอธิบายไม่ครบ (user ถาม "ทำอะไรอ่ะ")
- [ ] **GPS subjects หายไป** — bug connectivity_mode fix แล้ว แต่ existing subjects ที่ insert ผ่าน web อาจ fail ไปแล้ว ต้องเพิ่มใหม่
- [ ] **isStillCollecting threshold** — ตอนนี้ 10 นาที แต่ GitHub Actions cron รันทุก ~1 ชม. → ทุก session จะแสดงเป็น "หยุดเก็บ" เสมอ → ควรแยก logic หรือเพิ่ม threshold
- [ ] **ความสมบูรณ์ข้อมูล widget** — ยัง pull จาก `daily_summaries` ที่ GitHub Actions cron ไม่ได้ update → ตัวเลขไม่ตรง
- [ ] **GitHub Actions cron** — ควรเปลี่ยน schedule หรือหา workaround สำหรับ GitHub throttling

---

## Next Session

- [ ] Deploy changes ที่ pending อยู่ใน `lab/tuya-ecostove/deploy/index.html`
- [ ] อธิบาย/ทำ Supabase proper auth ถ้า user ต้องการ
- [ ] ให้ user ทดสอบ CRUD หลัง RLS fix + connectivity_mode fix
- [ ] ปรับ `isStillCollecting` threshold: 10 min → 90 min (รองรับ cron hourly)
- [ ] อัปเดต `daily_summaries` ให้ถูกต้อง หรือเปลี่ยน compliance widget ไปใช้ `pollution_logs` แทน

---

## Key Files

- `lab/tuya-ecostove/deploy/index.html` — main dashboard (unstaged changes)
- `.github/workflows/ecostove-sync.yml` — GitHub Actions cron (every 15min, but throttled)
- `lab/tuya-ecostove/sync_to_supabase.js` — Tuya→Supabase sync script

## Supabase Tables (RLS disabled for dev)
- `volunteers`, `subjects`, `devices`, `registered_sensors` — DISABLE RLS แล้ว
- `pollution_logs` — pending approval data
- `daily_summaries` — NOT updated by GitHub Actions cron

## GitHub Actions
- Repo: `AmDewSaroota/wendys-oracle`
- Workflow: `ecostove-sync.yml`
- Runs at: `*/15 * * * *` (configured) → จริงๆ ~ทุก 1 ชม. (GitHub throttle)
- Last run: 2026-03-02T06:37Z ✅
