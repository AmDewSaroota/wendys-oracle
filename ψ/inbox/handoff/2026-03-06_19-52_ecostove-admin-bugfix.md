# Handoff: EcoStove Admin Bugfix + Auth Issues

**Date**: 2026-03-06 19:52
**Context**: ~40%

## What We Did
- Found site URL is `biomassstove.vercel.app` (NOT ecostove-cmru)
- Verified **map popups** work — 4 markers show house name + sensor/stove info
- Found critical bug: `s.device.slice(-6)` crashes when `tuya_device_id` is null → admin data loading fails → "บ้านกลุ่มตัวอย่าง" tab empty
- Fixed null safety in 5 places: `(x || 'unknown').slice()`
- Fixed auth race condition: `promptAdmin()` now checks `getSession()` before showing login modal
- Removed `clearSupabaseSession()` call before login (was destroying valid tokens)
- Increased login timeout from 10s to 15s
- Deployed 2 times to `biomassstove.vercel.app`

## Known Issue: Supabase Auth Rate Limit
- Dev browser made ~10+ login attempts → triggered Supabase Auth rate limit
- After rate limit: login timeout, data doesn't load on refresh
- **This is temporary** — rate limit resets after ~1 hour
- DewS should test in **Incognito window** or run `localStorage.clear(); location.reload();` in console

## Pending
- [ ] **Verify admin fixes** — wait for rate limit reset, then test:
  - บ้านกลุ่มตัวอย่าง tab should show 4 houses
  - has_sensor toggle on house cards
  - Sensor swap dropdown on house cards
- [ ] **Session Timeline** — verify displays latest day only
- [ ] **Daily Summary upsert bug** — unique constraint + null house_id
- [ ] **คู่มือ** — ยังไม่ได้ทำ
- [ ] **Sensor always-online** — WiFi houses → sensor online 24h → discuss with อ.แก้ว

## Next Session
- [ ] Test all 4 features after rate limit resets (login in incognito first)
- [ ] Fix daily summary upsert (check unique constraint on daily_summary table)
- [ ] Consider simplifying auth (simple password vs Supabase Auth) for small team
- [ ] Deploy final version after all fixes verified

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — main dashboard (all fixes here)
- `lab/tuya-ecostove/deploy/api/sync.js` — data sync endpoint
- Deploy URL: `https://biomassstove.vercel.app/`
- Vercel project: `ecostove-cmru` (team: `dewss-projects-137fa2e4`)
