# Handoff: EcoStove Daily Summary Fix & System Audit

**Date**: 2026-03-04 15:46 (Bangkok)
**Context**: ~60%

## What We Did

### 1. Fixed Daily Summary vs Sessions Conflict
- **Problem**: Sessions showed 2 complete sessions for MT13W, but daily summary showed 0/0 "ไม่ได้เปิดเซนเซอร์"
- **Root Cause**: `upsertDailySummary()` used duplicate `started_at` query params in PostgREST URL — Supabase may overwrite first filter with second
- **Fix**: Changed to PostgREST `and=(...)` operator syntax + added logging
- **File**: `lab/tuya-ecostove/deploy/api/sync.js` line 322-337
- **Deployed**: ✅ to `biomassstove.vercel.app`

### 2. Added Incomplete Session Warning on Approve All
- **Problem**: "อนุมัติทั้งหมด" button only warned about `collecting` sessions, not `incomplete` ones
- **Fix**: Added query for incomplete sessions + warning in confirm dialog
- **File**: `lab/tuya-ecostove/deploy/index.html` line 1931-1974
- **Deployed**: ✅

### 3. System Audit — Slides vs Reality
Compared `ecostove-meeting-ajkaew.html` (13 slides) against deployed code. Found:

| Item | Slide Status | Reality |
|------|-------------|---------|
| Session Management | ✅ ทำแล้ว | ✅ ถูกต้อง |
| Dashboard + Approve | ✅ ทำแล้ว | ✅ ถูกต้อง |
| Offline Handling | ✅ ทำแล้ว | ✅ ถูกต้อง |
| **LINE OA Notifications** | **✅ ทำแล้ว** | **❌ ยังไม่มี code** |
| Vercel Cron | อ้างถึง | ใช้ cron-job.org (external) ไม่ใช่ Vercel Cron |

## Pending
- [ ] **LINE OA Notification** — ไม่ยาก แต่ยังไม่ได้ทำ
  - ต้องมี: LINE Channel Access Token
  - สร้าง `api/line-notify.js` + query sessions + broadcast
  - เพิ่ม 2 cron jobs บน cron-job.org (เที่ยง + 2ทุ่ม)
  - Skeleton อยู่ที่ `lab/line-oa/` (แค่ package.json)
- [ ] **อัพเดทสไลด์** — แก้ tag LINE OA จาก "✅ ทำแล้ว" → ยังไม่ทำ (หรือ implement ก่อน)
- [ ] **Verify daily summary fix** — ดู Vercel logs รอบถัดไปว่า upsertDailySummary log ออกมาถูกต้อง

## Next Session
- [ ] Implement LINE OA broadcast (สรุปเที่ยง + 2ทุ่ม)
- [ ] อัพเดทสไลด์ให้ตรงกับ reality
- [ ] ตรวจสอบว่า daily summary fix ทำงานถูกต้อง (ดู logs + dashboard)

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — sync + session management (แก้ upsertDailySummary)
- `lab/tuya-ecostove/deploy/index.html` — dashboard (แก้ batchApproveAll)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ อ.แก้ว (ต้องอัพเดท)
- `lab/line-oa/` — LINE OA skeleton (ยังไม่มี code)

## Notes
- cron-job.org ใช้แผนฟรี เรียก `/api/sync` ทุก 5 นาที — ไม่มีค่าใช้จ่าย
- Vercel อยู่ Hobby plan → cron ได้แค่วันละครั้ง จึงใช้ external
- API quota limit ตั้งไว้ 24,000/เดือน (26,000 ลบ buffer 2,000)
