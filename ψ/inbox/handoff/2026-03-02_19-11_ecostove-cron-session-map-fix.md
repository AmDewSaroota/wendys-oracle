# Handoff: EcoStove — Cron Session Management + Map Fix + CRUD Polish

**Date**: 2026-03-02 19:11
**Context**: continued from previous session (compacted)

## What We Did

### Data Collection Migration
- Moved from GitHub Actions cron to **Vercel Serverless** (`/api/sync.js`) + **cron-job.org** (every 5 min)
- GitHub Actions workflow disabled (kept `workflow_dispatch` only)
- Vercel env vars set: `TUYA_CLIENT_ID`, `TUYA_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_KEY`, `SYNC_SECRET`

### Auto-Session Management (NEW — `/api/sync.js`)
- Stateless session lifecycle: each cron invocation manages sessions
- Finds active session (`collecting`) for device
- Gap < 30 min → increment `readings_count` + update `updated_at`
- Gap >= 30 min → close old session (compute aggregates) + create new one
- No active session → create new session
- Close session: queries `pollution_logs` in range → computes avg/max/min PM2.5, CO2

### Session Timeline UI
- Added **date separator rows** (full date header between groups)
- Added **session numbering** per day per device (#1, #2, #3)
- Shows time-only (not full datetime) since date is in separator
- Removed alternating background colors (user preference)

### Map Fix (Critical)
- `subjects` table has NO `stove_type` column — both map queries selected it → silent Supabase error → no markers
- Fixed `loadBasicMapMarkers()` and `loadSubjectMarkers()`: removed `stove_type`, use `connectivity` instead
- Popup now shows connectivity (WiFi/Hotspot) instead of stove type

### CRUD Polish
- Added **edit volunteer** modal + save function
- Added **edit subject** modal + save function (name, address, lat/lng, volunteer, connectivity)
- Added **toggle subject status** (active/inactive)
- Fixed `connectivity_mode` → `connectivity` column name in 3 places
- Removed emoji icons → SVG gear icon for admin nav

## Pending
- [ ] **Uncommitted changes** — All work deployed to Vercel but NOT committed to git yet
  - `lab/tuya-ecostove/deploy/index.html` (modified)
  - `lab/tuya-ecostove/deploy/api/sync.js` (new, untracked)
  - `lab/tuya-ecostove/deploy/.gitignore` (modified)
  - `.github/workflows/ecostove-sync.yml` (modified — disabled cron)
- [ ] User needs to **shut down local `sensor-monitor.js`** to prevent duplicate sessions
- [ ] Clean up old incomplete sessions (#3 entries at 21:34) created by local Node.js
- [ ] Verify map markers display correctly after fix

## Next Session
- [ ] Commit all EcoStove changes to git
- [ ] Verify cron-job.org is creating sessions consistently
- [ ] Consider: cleanup script for orphaned/incomplete sessions
- [ ] Consider: session auto-close if no new data for >30 min (background cleanup)
- [ ] Field deployment prep for 10-house pilot (อ.แก้ว direction)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Main dashboard (single-file app ~2400 lines)
- `lab/tuya-ecostove/deploy/api/sync.js` — Vercel serverless: Tuya→Supabase sync + session management
- `lab/tuya-ecostove/deploy/vercel.json` — Vercel config (maxDuration: 30)
- `.github/workflows/ecostove-sync.yml` — Disabled cron, kept workflow_dispatch

## Deployment
- **URL**: https://biomassstove.vercel.app
- **Sync endpoint**: `https://biomassstove.vercel.app/api/sync?secret=ecostove-sync-2026`
- **Vercel project**: `ecostove-cmru` on team `dewss-projects-137fa2e4`
- **Cron**: cron-job.org calling sync endpoint every 5 minutes
