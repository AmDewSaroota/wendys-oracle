# Handoff: EcoStove Dashboard i18n Complete

**Date**: 2026-03-18 14:47
**Context**: ~15%

## What We Did
- Completed full i18n translation of EcoStove admin dashboard (`index.html`)
- Added 100+ translation keys to T dictionary covering all tabs and modals
- Created `translateNote()` — regex-based translation of session notes (Thai→English)
- Created `translateAction()` + `ACTION_MAP` — translates 17 activity log action names
- Created `DEVICE_HOUSE` map (tuya_device_id → subject_id) for house filter fallback
- Created `formatLocaleDate()` — locale-aware date formatting
- Made calendar month labels locale-aware (Thai Buddhist year vs Gregorian)
- Removed sensor filter dropdown (DewS: useless, shows no data)
- Split `populateHouseDropdowns()` — sensor tab shows only houses with sensors, TVOC shows all
- Removed stove column from data table, changed sensor column to house name
- Enhanced `toggleLang()` to re-render calendar, periods, and data table on language switch
- Translated: data tab, TVOC tab, activity log, schedule/periods, period modal, batch modal, holidays, quota summary, export daily, validation messages
- 4 successful deploys to Vercel

## Pending
- [ ] Verify session split issue (12:45-13:30 → 14:00 gap) — likely SESSION_GAP_MINUTES=30
- [ ] Tuya project migration: pair sensors to biomassstove.cmru account, update Vercel env vars
- [ ] Create volunteer guide (memory/ecostove-volunteer-guide.md)
- [ ] LINE OA cron testing (morning/evening summaries)

## Next Session
- [ ] Test i18n on live data with DewS — verify all translations look correct
- [ ] Any remaining DewS feedback on translation quality
- [ ] Tuya migration — pair ES-01~ES-10 sensors to project account
- [ ] Volunteer guide if อ.แก้ว requests

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Main dashboard (all i18n changes)
- `lab/tuya-ecostove/deploy/api/sync.js` — Session logic (SESSION_GAP_MINUTES)
