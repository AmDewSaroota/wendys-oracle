# Handoff: EcoStove AQI Fix + Sensor Comparison Charts

**Date**: 2026-02-18 21:56
**Context**: 40%

## What We Did
- Fixed AQI calculation: Tuya returns `"level_1"` (category), not actual AQI number. Replaced `parseAqi()` with `calculateAqiFromPm25()` using Chinese AQI standard (HJ 633-2012)
- Replaced history data table on summary page with 4 line charts comparing 2 sensors:
  - PM2.5, CO2, Temperature, AQI
  - Sensor 1 (MT13W) orange vs Sensor 2 (ZN-MT29) blue
  - Time range selector: 24h / 3d / 7d / 30d / all
- Raw data table kept in Admin "ฐานข้อมูล" tab only
- Added `chartjs-adapter-date-fns` for time-axis support
- Deployed Edge Function + Frontend to production

## Previous Session (same day, earlier)
- Full end-to-end flow tested: MT13W -> Tuya -> Edge Function -> Supabase -> Frontend
- Created auto_sync_mt13w.js for 2 sensors (every 5 min)
- Fixed multiple Edge Function bugs (house_id, tuya_device_id, status)
- Fixed critical frontend JOIN bug (no FK relationship)
- Cleaned admin data explorer, added device name mapping

## Pending
- [ ] Old AQI data in DB still shows 1 — need backfill or recalculate
- [ ] Move auto-fetch from local script to Supabase Cron (24/7)
- [ ] Implement stove_type auto-tagging by date period
- [ ] Add AIR_DETECTOR (3rd sensor) when ready
- [ ] Add HCHO to frontend charts
- [ ] Data export (CSV/Excel) for researchers

## Next Session
- [ ] Backfill AQI values for existing records (SQL UPDATE using PM2.5)
- [ ] Set up Supabase Cron for cloud-based auto-fetch
- [ ] Test chart display with real accumulated data
- [ ] Review if chart time ranges work correctly with multi-day data

## Key Files
- `lab/tuya-ecostove/supabase/functions/fetch-sensor/index.ts` — Edge Function (AQI fix)
- `lab/tuya-ecostove/ecostove-with-sensor.html` — Frontend (charts)
- `lab/tuya-ecostove/deploy/index.html` — Vercel deploy copy
- `lab/tuya-ecostove/auto_sync_mt13w.js` — Local auto-sync script

## AQI Formula Reference (Chinese Standard HJ 633-2012)
```
PM2.5 (µg/m³) → AQI
0-35    → 0-50
35-75   → 50-100
75-115  → 100-150
115-150 → 150-200
150-250 → 200-300
250-350 → 300-400
350-500 → 400-500
```
