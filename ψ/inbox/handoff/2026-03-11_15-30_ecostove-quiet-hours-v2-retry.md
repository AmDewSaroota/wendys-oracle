# Handoff: EcoStove Quiet Hours v2 + Tuya Retry + 10-device Ready

**Date**: 2026-03-11 15:30
**Context**: ~85%

## What We Did

### Quiet Hours v2 (Full Schedule System)
- **Migration 012** — `active_days` column + `sync_holidays` table (RUN on Supabase)
- **sync.js Phase 0.5** — เช็ค 3 เงื่อนไข: quiet hours / day-of-week / holiday
- **Admin UI** — ปฏิทินเดือน, checkboxes วัน จ-อา, เพิ่ม/ลบวันหยุดพิเศษ, Projected Quota live
- **Quota warning** — `quota_warning: true` ใน response ถ้า >= 80%

### Bug Fixes
- **Logout ค้าง** — force clear state + switchView หลัง signOut (onAuthStateChange ไม่ fire)
- **confirm() → showConfirm()** — เปลี่ยน browser dialog เป็น custom modal
- **Input เวลาแคบ** — w-24 → w-36

### Tuya Reliability
- **Retry logic** — `tuyaFetchWithRetry()` retry 1 ครั้ง รอ 3 วินาที สำหรับทั้ง getBatchDeviceInfo + getBatchDeviceStatus
- นับ API calls ตาม attempts จริง

### 10-Device Ready
- **Batch Phase 1** — 3 Supabase calls แทน 30+ (getBatchActiveSessions, getBatchLastClosedSessions, getBatchSessionCountToday)
- **maxDuration 30→60s** — เผื่อ 10 เครื่อง + retry

### Slides & Branding
- เพิ่มการ์ด "ตารางเก็บข้อมูล" ใน slide 5
- อัพเดท slide 11 — จากคำถามเป็น "✅ ตั้งค่าได้แล้ว"
- เปลี่ยน logo ทุกจุด (slides + volunteer) ใช้ logo.png เหมือน dashboard

## Pending
- [ ] ทดสอบ sync.js วันเสาร์ → ต้องได้ `rest day`
- [ ] เพิ่มวันหยุดทดสอบ → เรียก sync → ต้องได้ `holiday`
- [ ] พิจารณาเพิ่ม 300 บ้านในสไลด์ (DewS ถามแต่ยังไม่ตัดสินใจ)
- [ ] ตรวจสอบ retry ลด Tuya error จริงมั้ย (ดู session ถัดไป)
- [ ] ทดสอบ 10 เครื่องจริง (รอเซนเซอร์มาถึง)

## Next Session
- [ ] ติดตาม Tuya retry — session ใหม่มี error น้อยลงมั้ย
- [ ] อัพเดทสไลด์เรื่อง 300 บ้าน (ถ้า DewS ต้องการ)
- [ ] เตรียมระบบรับ 10 เซนเซอร์ — ลงทะเบียน + จับคู่บ้าน

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — retry + batch Phase 1 + schedule check
- `lab/tuya-ecostove/deploy/index.html` — Quiet Hours v2 UI + logout fix
- `lab/tuya-ecostove/deploy/slides.html` — การ์ดใหม่ + logo
- `lab/tuya-ecostove/deploy/volunteer.html` — logo update
- `lab/tuya-ecostove/deploy/vercel.json` — maxDuration 60s
- `lab/tuya-ecostove/migrations/012_sync_schedule.sql` — active_days + sync_holidays
