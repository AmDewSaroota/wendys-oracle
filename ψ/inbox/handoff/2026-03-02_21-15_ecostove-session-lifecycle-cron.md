# Handoff: EcoStove — Session Lifecycle + Cron-job.org + API Optimization

**Date**: 2026-03-02 21:15
**Context**: continued from ecostove-cron-session-map-fix session

## What We Did

### Session Lifecycle in sync.js (NEW)
- **Auto-cutoff at 2h10m** (130 min) — sessions close automatically, no new session created
- **5hr cooldown** — after session closes, blocks new sessions for 300 minutes
- **Cooldown pre-check** — skips Tuya API calls entirely when all sensors are in cooldown (saves ~23,000 API calls/month)

### Dashboard Improvements (index.html)
- **"อนุมัติทั้งหมด" button** — now has confirm dialog
  - Checks for active collecting sessions
  - Warns user if sessions still running
  - If confirmed: closes active sessions + approves all pending logs

### API Budget Optimization
- Before: ~25,920 Tuya calls/month (near 26,000 limit)
- After: ~2,160 calls/month (only during active sessions)
- Enables scaling to 10 devices safely

### Architecture Confirmed
- **Cron-job.org → Vercel /api/sync → Tuya + Supabase**
- GitHub Actions cron DISABLED (was running on March 1st, switched March 2nd afternoon)
- `sensor-monitor.js` (local) was managing sessions on March 1st — caused broken sessions

## Pending
- [ ] **cron-job.org NOT CONFIRMED WORKING** — DewS needs to verify job exists and is active
  - URL: `https://biomassstove.vercel.app/api/sync?secret=ecostove-sync-2026`
  - Schedule: every 5 minutes
  - Method: GET (default on free plan)
- [ ] **Uncommitted changes** — all work deployed to Vercel but NOT committed:
  - `lab/tuya-ecostove/deploy/api/sync.js` — session lifecycle (cutoff, cooldown, skip)
  - `lab/tuya-ecostove/deploy/index.html` — confirm dialog on batch approve
  - `lab/tuya-ecostove/deploy/vercel.json`
  - `.github/workflows/ecostove-sync.yml` — disabled cron
- [ ] **Dashboard not real-time** — sessions tab requires manual refresh (F5)
- [ ] **Orphan pollution_logs** — logs inserted during cooldown (no session) remain pending
- [ ] Old broken sessions from March 1st (from sensor-monitor.js) still in DB

## Next Session
- [ ] Commit all EcoStove changes to git
- [ ] Verify cron-job.org is firing every 5 minutes
- [ ] Add auto-refresh to sessions tab (every 60s when sessions are active)
- [ ] Consider: skip insertLog when in cooldown (prevent orphan logs)
- [ ] Consider: cleanup script for old broken/orphan sessions
- [ ] Consider: daily summary auto-compute trigger

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — Vercel serverless: Tuya→Supabase + session lifecycle
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (single-file ~2500 lines)
- `lab/tuya-ecostove/deploy/vercel.json` — Vercel config
- `lab/tuya-ecostove/sensor-monitor.js` — Local monitor (no longer primary, but still has session logic)

## Session Lifecycle Constants (sync.js)
```
SESSION_GAP_MINUTES = 30     // gap > 30 min → close old, start new
SESSION_MAX_MINUTES = 130    // auto-cutoff at 2h10m
SESSION_COOLDOWN_MINUTES = 300  // 5hr cooldown between sessions
```

## Deployment
- **URL**: https://biomassstove.vercel.app
- **Sync endpoint**: `https://biomassstove.vercel.app/api/sync?secret=ecostove-sync-2026`
- **Vercel project**: `ecostove-cmru` on team `dewss-projects-137fa2e4`
- **Cron**: cron-job.org (NEEDS VERIFICATION)
