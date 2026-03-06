# Handoff: EcoStove — Refresh Hang Fix

**Date**: 2026-03-06 23:30
**Context**: ~30% (continued from compacted session)

## What We Did
- Verified all 4 features from previous session (map popups, subjects tab, sensor swap, session timeline) — all working
- Backfilled `daily_summaries` stale data (null house_id) — 12/14 entries now correct
- **Fixed critical bug: page hangs on refresh** — root cause was Supabase SDK v2 internal session lock blocking ALL queries during token refresh
- Fix #1: Save/clear auth tokens BEFORE `createClient()` → data loads instantly
- Fix #2: Auth restoration changed from `await setSession()` to fire-and-forget (`.then()`)
- Fix #3: `promptAdmin()` now has 3-second timeout on `getSession()` + `checkAdminRole()` — falls through to login modal if SDK still blocked
- Deployed to `biomassstove.vercel.app`

## Pending
- [ ] **Verify refresh fix** — DewS needs to test: login → refresh → data loads → click "จัดการระบบ"
- [ ] **Daily summary upsert** — unique constraint works, but need to verify no more null house_id on new data
- [ ] **คู่มือ** — admin guide not yet created
- [ ] **Sensor always-online** — WiFi houses discussion with อ.แก้ว

## Next Session
- [ ] Open dev browser and test the full flow: login → refresh → admin access
- [ ] If refresh fix doesn't work, consider simplifying: skip auto-restore, just re-login after refresh
- [ ] Check if `onAuthStateChange` SIGNED_IN event fires after fire-and-forget `setSession()` completes
- [ ] Consider auth simplification if Supabase Auth continues causing issues
- [ ] Start on admin คู่มือ if all bugs resolved

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Main dashboard (all changes here)
  - Line ~659: Save/clear auth tokens before createClient
  - Line ~1339: promptAdmin() with 3s timeout
  - Line ~3644: Fire-and-forget auth restore in DOMContentLoaded
- `lab/tuya-ecostove/deploy/api/sync.js` — Data sync endpoint

## Technical Notes
- **Supabase SDK v2 gotcha**: `createClient()` auto-detects tokens in localStorage and calls internal `_recoverAndRefresh()` which blocks ALL `.from()` queries with an internal mutex/lock until refresh completes or fails
- **Workaround pattern**: Save tokens → clear localStorage → create client (clean) → load data → restore session async
- Shell was down in latter half of session — couldn't use dev browser for verification
