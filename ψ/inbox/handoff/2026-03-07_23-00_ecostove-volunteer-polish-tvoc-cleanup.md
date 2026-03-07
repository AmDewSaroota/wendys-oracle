# Handoff: EcoStove Volunteer Page Polish + TVOC Dashboard Cleanup

**Date**: 2026-03-07 23:00
**Context**: ~35%

## What We Did

### Volunteer Page Fixes
- **Font mismatch fixed**: Changed Prompt → Chakra Petch to match main dashboard
- **TVOC overflow on mobile fixed**: Reduced text sizes (`text-3xl` → `text-xl`), added `min-w-0` + `shrink-0` to prevent button/input overflow
- **Daily-limit detection added**: When 2 sessions completed today, shows "✅ ครบ 2 sessions แล้ววันนี้" instead of generic "รอเซนเซอร์ออนไลน์"

### Dashboard TVOC Recording Removed
- Removed TVOC FAB button, live status elements, entire TVOC recording JS (~350 lines)
- TVOC recording is now **volunteer page only** — prevents duplication
- **Kept**: TVOC charts, stats card, thresholds, export (read-only display)

### Slide Updates (Weekly Update Wk1)
- Slide 11: Added GPS 3-tier radius (<30m auto, 30-200m confirm, >200m manual)
- Slide 11: Added "ขยายพื้นที่ได้" scalability note + quota status
- Slide 12: Updated flow diagram with radius details + expansion badge

### API Quota Analysis
- Confirmed: **Batch API** — sync.js uses `/v1.0/iot-03/devices?device_ids=` (1 call all devices)
- 2 API calls per sync regardless of device count
- ~17,640 calls/month total — well within 26,000 limit for 10+ devices
- **No need to pause cron** or create new Tuya account

## Design Decisions (this session)
- TVOC recording = volunteer page only (during active cooking sessions)
- Sensor data = always collected automatically via cron
- GPS radius: 200m max for field matching
- API quota is sufficient — no changes needed

## Pending
- [ ] Test volunteer page end-to-end with active session (GPS + cooking-start + TVOC)
- [ ] Wire `applyBaselineSubtraction()` to chart functions (renderGroupCharts, updateReductionTable, updateSensorCharts)
- [ ] Deploy LINE OA updates (morning.js + evening.js)
- [ ] Build TVOC scheduling system (admin sets days/houses for TVOC collection)
- [ ] Verify "เก็บข้อมูลวันนี้" expanded cards display correctly
- [ ] Consider: TVOC data in daily_summaries (currently sensor-only)

## Next Session
- [ ] Test volunteer page on mobile with GPS (need active session — wait for morning)
- [ ] Fix baseline subtraction in charts (critical for accurate data display)
- [ ] Deploy LINE OA cron updates
- [ ] TVOC scheduling: admin interface to assign TVOC collection days per house
- [ ] Prepare for อ.แก้ว field test (10 houses)

## Key Files
- `lab/tuya-ecostove/deploy/volunteer.html` — Volunteer mobile page (font + overflow + daily-limit fixed)
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (TVOC recording removed)
- `lab/tuya-ecostove/ecostove-weekly-update-wk1.html` — Weekly slides (GPS radius + scalability added)
- `lab/tuya-ecostove/deploy/api/sync.js` — Sync API (confirmed batch API architecture)
- `lab/tuya-ecostove/deploy/api/volunteer.js` — Volunteer API
