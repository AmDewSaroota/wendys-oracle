# Handoff: EcoStove — i18n, Sensor Registration, UX Polish

**Date**: 2026-02-27 13:40
**Context**: ~60%

## What We Did

### i18n System (TH/EN)
- สร้างระบบ i18n ครบ ~200+ keys ด้วย `T` object + `t(key, ...args)` helper
- ปุ่ม 🌐 สลับภาษา (desktop + mobile nav) — save ลง localStorage
- `data-i18n` attributes บน ~60+ HTML elements
- แก้ ~25+ JS functions ให้ใช้ `t()` แทน hardcoded text
- Template variable support `{0}`, `{1}` สำหรับ dynamic strings
- Locale-aware dates (th-TH / en-US)

### Sensor Registration
- สร้างตาราง `registered_sensors` (SQL migration 002)
- เปลี่ยน `const KNOWN_SENSORS` → `let` + `loadRegisteredSensors()` จาก Supabase
- Admin UI: ปุ่มสีส้ม "📡 ลงทะเบียนเซนเซอร์ใหม่" + modal กรอก Tuya ID / ชื่อ / ประเภทเตา
- Registered sensors list ใต้ devices พร้อมปุ่มลบ
- i18n keys สำหรับ registration (18 keys)

### WiFi/Hotspot for Subjects
- เพิ่ม `connectivity` column (SQL migration 003)
- Dropdown เลือก WiFi/Hotspot ตอนเพิ่มบ้าน
- Badge สีฟ้า (WiFi) / ม่วง (Hotspot) บนการ์ดบ้าน

### UX Polish
- ฟอนต์: Taviraj → **Chakra Petch** (sans-serif, อ่านสบาย)
- สี nav accent: emerald → **Muted Gold #c9a96e** (จากเปลวไฟในโลโก้)
- Subtitle opacity: 60% → 80%
- ชื่อเซนเซอร์: ใช้ชื่อบ้าน + รันเลข (แทน MT13W ตัวใหม่/เดิม)
- ย้าย Compliance Legend → สรุปรายวัน
- Session progress: จุด → progress bar
- Activity feed: แสดง meaningful text + getTimeAgo()

### Previous Session (ก่อน context ใหม่)
- ลบ CO/TVOC cards, charts, tables
- เพิ่ม map markers จาก subjects GPS
- Compliance text ภาษาไทย
- Admin login with username
- StoveType mapping

## Pending
- [ ] **Run SQL migrations** — DewS ต้อง run ใน Supabase SQL Editor:
  - `migrations/002_registered_sensors.sql`
  - `migrations/003_subjects_connectivity.sql`
- [ ] ทดสอบ sensor registration หลัง run migration
- [ ] ทดสอบ WiFi/Hotspot หลัง run migration
- [ ] ลงทะเบียนเซนเซอร์ใหม่ 10 เครื่อง (MT13W-01 ถึง MT13W-10) ตั้งชื่อตามบ้าน

## Next Session
- [ ] Run SQL migrations 002 + 003
- [ ] ทดสอบ sensor registration + WiFi/Hotspot end-to-end
- [ ] เตรียมข้อมูล 10 บ้าน (ชื่อ, ที่อยู่, GPS, อาสา, connectivity)
- [ ] ลงทะเบียน 10 เซนเซอร์ใหม่ผ่าน admin UI
- [ ] ปรับ sensor-monitor.js ให้ดึง device list จาก registered_sensors

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard SPA (~2000+ lines)
- `lab/tuya-ecostove/migrations/002_registered_sensors.sql` — Sensor registration table
- `lab/tuya-ecostove/migrations/003_subjects_connectivity.sql` — WiFi/Hotspot column
- `lab/tuya-ecostove/sensor-monitor.js` — Data sync daemon

## Deploy
- Live: https://biomassstove.vercel.app
- Vercel project: ecostove-cmru
