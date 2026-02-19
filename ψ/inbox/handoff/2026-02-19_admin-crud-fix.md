# Handoff: EcoStove Web Admin — Add Fix + CRUD Pending

**Date**: 2026-02-19
**Context**: 80%

## What We Did

### Session A (previous — compacted)
- Fixed `addVolunteer()`, `addSubject()`, `addDevice()` — schema mismatch with real Supabase columns
  - `volunteers`: actual columns = `full_name`, `phone_contact` (no `name`, no `is_active`)
  - `subjects`: actual columns = `full_name`, `address`, `volunteer_id`, `status`
  - `devices`: has `is_active` (re-added), `tuya_device_id`, `name`, `subject_id`
- Added error alerts for all 3 insert functions (was silent on failure)
- Fixed all render functions to use correct field names (`full_name` not `name`, etc.)
- Discovered real schemas by querying Supabase REST API directly (PowerShell)
- Deployed 3 times to biomassstove.vercel.app

### Session B (this session)
- Fixed `loadAdminData()` premature `return` bug
  - Bug: `return;` inside `if (!data || data.length === 0)` skipped loading volunteers/subjects/devices entirely
  - Fix: changed to `if/else` so device/volunteer/subject loading always runs
- Deployed to biomassstove.vercel.app ✅
- Volunteers can now be added AND list refreshes correctly

## Current State
- **Add** works for all 3: volunteers, subjects, devices ✅
- **List** displays correctly after add ✅
- **Edit / Delete** — NOT yet implemented ❌

## Pending
- [ ] **CRUD for volunteers** — Edit (แก้ไข) + Delete (ลบ) buttons in volunteer cards
- [ ] **CRUD for subjects** — Edit + Delete for บ้านกลุ่มตัวอย่าง
- [ ] **CRUD for devices** — Edit + Delete for เครื่องวัด
- [ ] **Electron desktop app** — Windows runner: polls Tuya sensor online/offline, starts/stops data collection, reads house list from Supabase DB
- [ ] **Supabase Cron** — move auto-fetch from local script to pg_cron (24/7 without local machine)
- [ ] **stove_type auto-tagging** — determine traditional vs eco by date period
- [ ] **AQI backfill** — old records still show AQI=1, need SQL UPDATE using PM2.5

## Next Session
- [ ] Add Edit modal + Delete confirm for volunteers (`volunteers` table: `full_name`, `phone_contact`)
- [ ] Add Edit modal + Delete confirm for subjects (`subjects` table: `full_name`, `address`, `volunteer_id`, `status`)
- [ ] Add Edit modal + Delete confirm for devices (`devices` table: `name`, `tuya_device_id`, `subject_id`, `is_active`)
- [ ] Deploy after each entity's CRUD is done
- [ ] Then: plan Electron app OR Supabase Cron (ask DewS priority)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — main web app (1745 lines), deployed to biomassstove.vercel.app
- `lab/tuya-ecostove/auto_sync_mt13w.js` — local auto-sync script (2 sensors, 5 min interval)
- `lab/tuya-ecostove/supabase/functions/fetch-sensor/index.ts` — Edge Function

## Deploy Command
```bash
cd c:\Users\CPL\wendys-oracle\lab\tuya-ecostove\deploy && npx vercel deploy --prod
```

## Supabase Table Schemas (confirmed)
```
volunteers:  id, full_name, phone_contact, area_id, created_at
subjects:    id, full_name, address, device_id, volunteer_id, area_id, stove_received_date, gps_lat, gps_long, status, registered_at
devices:     id, tuya_device_id, name, description, is_active, created_at, mac_address, subject_id
areas:       id, province_name, created_at
```
