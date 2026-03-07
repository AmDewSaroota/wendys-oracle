# Handoff: EcoStove Volunteer System + Weekly Update Slides

**Date**: 2026-03-07 18:00
**Context**: ~60%

## What We Did
- Built **volunteer system** (`volunteer.html` + `api/volunteer.js`) — mobile-first page for field volunteers
  - GPS auto-detect: Haversine distance matching against `subjects.gps_lat/gps_long`
  - "เริ่มจุดเตาแล้ว" button: Transitions session from `baseline` → `collecting`, computes baseline averages
  - TVOC recording section: Writes manual readings to `pollution_logs`
  - End session + summary display
- Added **2 new slides** to weekly update deck (`ecostove-weekly-update-wk1.html`)
  - Slide 11: ระบบอาสาสมัคร (GPS, cooking button, TVOC, data integrity)
  - Slide 12: Flow อาสาบนมือถือ (flow diagram + descriptions)
  - Total slides: 11 → 13
- Added **nav links** in main dashboard (`index.html`) to volunteer page (desktop + mobile)
- **Deployed** to `biomassstove.vercel.app`

## Data Integrity Design Decisions (from DewS)
- **Sensor data = primary** (collected every session automatically)
- **TVOC = supplementary** (5-6 times/month, randomly sampled)
- GPS auto-detect prevents wrong house selection
- GPS threshold: <30m auto-confirm, >30m manual dropdown fallback

## Pending
- [ ] Test volunteer page end-to-end with actual sensor session
- [ ] Wire `applyBaselineSubtraction()` to all chart functions (renderGroupCharts, updateReductionTable, updateSensorCharts)
- [ ] Deploy LINE OA updates (morning.js + evening.js)
- [ ] Test TVOC session flow end-to-end (dashboard TVOC FAB)
- [ ] Build TVOC scheduling system (admin sets which days/houses need TVOC collection)
- [ ] Verify "เก็บข้อมูลวันนี้" expanded card displays correctly
- [ ] Consider: TVOC data in daily_summaries (currently sensor-only)

## Next Session
- [ ] Test volunteer.html on mobile with GPS (DewS in field)
- [ ] Fix baseline subtraction in charts (critical for accurate data display)
- [ ] Deploy LINE OA cron updates
- [ ] TVOC scheduling: admin interface to assign TVOC collection days per house
- [ ] Prepare for อ.แก้ว field test (10 houses)

## Key Files
- `lab/tuya-ecostove/deploy/volunteer.html` — Volunteer mobile page
- `lab/tuya-ecostove/deploy/api/volunteer.js` — Volunteer API (cooking-start, status)
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (nav links added)
- `lab/tuya-ecostove/ecostove-weekly-update-wk1.html` — Weekly update slides (13 slides)
- `lab/tuya-ecostove/deploy/api/sync.js` — Sync API (baseline/collecting flow)
