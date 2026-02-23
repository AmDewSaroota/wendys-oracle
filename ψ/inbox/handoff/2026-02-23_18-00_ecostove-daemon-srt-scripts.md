# Handoff: EcoStove Daemon + SRT Presentation Scripts

**Date**: 2026-02-23 18:00
**Context**: ~40%

## What We Did

### EcoStove
1. **Fixed admin tabs bug** — `loadAdminData()` had premature `return` when no pending logs, causing devices/volunteers/subjects to never load. Changed to `else` block. Deployed to Vercel.
2. **Upgraded sync script to daemon mode** — `sync_to_supabase.js` now:
   - Supports both sensors (MT29 + MT13W)
   - Uses `node` (CommonJS) instead of `bun`
   - Runs as continuous loop every 5 minutes
   - `--once` flag for single run
   - Includes `tuya_device_id` in each record
3. **Successfully synced both sensors** — data flowing into Supabase (IDs 73, 74+)
4. **DewS noted**: dashboard data boxes look off ("เพี้ยนๆ ไม่ครบ") — deferred for now

### SRT Presentation
5. **Wrote presentation scripts** for multiple slides:
   - System Architecture — with plain Thai terms (no technical jargon)
   - Kiosk Pain Points + Solution
   - Kiosk Admin Pain Points + Solution
   - Mobile Web App — **reframed**: ไม่แข่งกับ D-ticket แต่ "ยกระดับ" เป็น Smart Tourism App
   - Data Flow diagram — translated technical terms to plain Thai
6. **Created timeline.html** — Gantt chart style, changed from phased-feature to phased-development-stages (Requirement→Design→Dev→Test→UAT→Deploy) because client wants ALL features delivered, not phased rollout
7. **Strategic advice captured**:
   - Avoid mentioning ThaiID, ชำระเงิน, Time-Series DB (scope creep risks)
   - D-ticket strategy: "ยกระดับ" not "ทดแทน" in wording, but functionally replace
   - Embedding = "แปลงคำถามเป็นรหัสตัวเลข เพื่อให้ระบบค้นหาข้อมูลที่ตรงกัน"

## Pending
- [ ] EcoStove dashboard data boxes เพี้ยน — ยังไม่ได้แก้
- [ ] SRT slides: ยังไม่ได้แก้ลงไฟล์สไลด์จริง (แค่ draft ข้อความ)
- [ ] SRT slides: System Architecture — เปลี่ยนศัพท์เทคนิคเป็นภาษาคน
- [ ] SRT slides: Mobile App — ปรับ Pain Points + Solution ตามแนว "ยกระดับ D-ticket"
- [ ] SRT slides: Data Flow — ปรับศัพท์เทคนิคเป็นภาษาคน
- [ ] SRT slides: timeline.html ตกขอบสไลด์ — แก้แล้ว แต่ยังไม่ได้เช็คว่าพอดีหรือยัง
- [ ] EcoStove Daemon: ยังไม่ได้ตั้ง PM2 auto-launch

## Next Session
- [ ] เช็ค timeline.html ว่าพอดีหรือยัง
- [ ] แก้สไลด์จริง (ตัว HTML ที่ deploy) ทั้ง Architecture, Mobile App, Data Flow
- [ ] EcoStove: ตรวจ dashboard data boxes ที่เพี้ยน
- [ ] EcoStove: ตั้ง PM2 สำหรับ daemon auto-launch
- [ ] ซ้อมพูด presentation scripts ถ้า DewS ต้องการ

## Key Files
- `lab/tuya-ecostove/sync_to_supabase.js` — Daemon (ปรับใหม่ทั้งหมด)
- `lab/tuya-ecostove/ecostove-with-sensor.html` — Web dashboard (fixed loadAdminData)
- `lab/tuya-ecostove/deploy/index.html` — Vercel deploy copy
- `lab/swt-slides/timeline.html` — Gantt chart timeline (ใหม่)
- `lab/swt-slides/connected-ecosystem.html` — Connected Ecosystem diagram

## EcoStove Daemon Status
- Daemon was running during session (synced both sensors successfully)
- DewS may have stopped it — need to restart if needed
- Command: `cd lab/tuya-ecostove && node sync_to_supabase.js`
