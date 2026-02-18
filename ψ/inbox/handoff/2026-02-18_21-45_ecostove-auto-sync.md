# Handoff: EcoStove Auto-Sync + Frontend Overhaul

**Date**: 2026-02-18 21:45
**Context**: 95%

## What We Did
- Tested full end-to-end flow: MT13W sensor -> Tuya Cloud API -> Supabase Edge Function -> Supabase DB -> Frontend
- Fixed Edge Function: `subject_id` -> `house_id`, added `tuya_device_id` text column, added `status: 'approved'`
- Fixed critical frontend bug: `select('*, subjects(*), volunteers(*)')` broke data loading (no FK relationship) -> changed to `select('*')`
- Created `auto_sync_mt13w.js` — auto-fetch script for 2 sensors (MT13W + ZN-MT29) every 5 minutes
- Cleaned up Admin "data explorer" tab — removed unused columns (CO, TVOC, photo, status, volunteer, house)
- Added device name mapping to frontend (shows "Sensor 1 (MT13W)" instead of "sensor")
- Deployed updated frontend to Vercel (`biomassstove.vercel.app`)
- Confirmed MT13W sensor capabilities: PM2.5, PM1, PM10, CO2, HCHO, Temp, Humidity, AQI (no TVOC, no CO)
- Added second sensor (ZN-MT29) to auto-sync script

## Supabase Schema Changes (via Dashboard SQL)
- `ALTER TABLE pollution_logs ADD COLUMN tuya_device_id text;`
- `ALTER TABLE pollution_logs ADD COLUMN status text DEFAULT 'approved';`

## Pending
- [ ] Move auto-fetch from local script to Supabase Cron (24/7 operation without local machine)
- [ ] Implement stove_type auto-tagging by date period (3 months traditional, 3 months eco)
- [ ] Add AIR_DETECTOR (3rd sensor) to auto-sync when ready
- [ ] Unify admin password (lab copy uses `admin`/`ecostove2024`, original was `1234`)
- [ ] Add data export (CSV/Excel) for researchers
- [ ] Consider adding HCHO to frontend display (MT13W supports it)

## Next Session
- [ ] Set up Supabase Cron or pg_cron for cloud-based auto-fetch (no local machine dependency)
- [ ] Add stove_type logic: `recorded_at` date determines traditional vs eco
- [ ] Review collected data quality from overnight auto-sync
- [ ] Plan deployment for field use at sample households

## Key Files
- `lab/tuya-ecostove/auto_sync_mt13w.js` — Auto-sync script (2 sensors, 5 min interval)
- `lab/tuya-ecostove/ecostove-with-sensor.html` — Frontend dashboard (deployed to Vercel)
- `lab/tuya-ecostove/supabase/functions/fetch-sensor/index.ts` — Supabase Edge Function
- `lab/tuya-ecostove/deploy/index.html` — Vercel deployment copy
- `lab/tuya-ecostove/auto_fetch_all.js` — Reference: console-only fetch for all 3 devices
- `lab/tuya-ecostove/check_supabase.js` — Utility: check Supabase data

## Sensor Reference

| Device | ID | Measures |
|--------|-----|----------|
| MT13W | `a3d01864e463e3ede0hf0e` | PM2.5, PM1, PM10, CO2, HCHO, Temp, Humidity, AQI |
| ZN-MT29 | `a3b9c2e4bdfe69ad7ekytn` | PM2.5, PM1, PM10, CO2, HCHO, Temp, Humidity, AQI |
| AIR_DETECTOR | `a3f00f68426975f8cexrtx` | CO2, VOC, HCHO (no PM, no Temp/Humidity) |
