# Handoff: EcoStove Bugfix Sprint + Dynamic Sensors + Multi-Project Schema

**Date**: 2026-03-06
**Context**: Continued from previous session (context compacted)

## What We Did

### Timeline & Planning
- Created 3-week timeline for EcoStove delivery (due ~March 26)
- Comprehensive audit found 14 pending items, prioritized by criticality
- DewS may take leave March 23-25, so front-loaded Week 3 work into Week 2

### Level 1 BLOCKERS Fixed
- **#12** `upsertDailySummary` — `Math.max(...[])` returning `-Infinity` when all pm25 null
- **#8** Replaced hardcoded `SENSORS` array with `loadSensors()` querying `registered_sensors` + `devices`

### Deep Code Review Fixes (sync.js)
- **insertLog missing session_id** — baseline queries always returned 0 results, baseline never worked
- **closeSession imprecise query** — now uses session_id with fallback to time-range + upper bound
- **Removed dead code** — `getDeviceInfo`, `getDeviceStatus`, `parseReadings` (30 lines)
- **Cached active sessions** — Phase 1 caches in `cachedSessions` map, reduces redundant DB queries
- **Baseline transition fallback** — PATCH with baseline columns, fallback to core fields if schema mismatch

### #4 Multi-Project Schema
- Created `lab/tuya-ecostove/migrations/003_projects.sql`
- Tables: `projects`, `subject_projects` (many-to-many junction)
- Added `project_id` to `sessions` and `daily_summaries`
- Seeded 3 placeholder projects

### #9 Dashboard Dynamic Sensors (index.html)
- Chart function: hardcoded 2 datasets → dynamic `sensorGroups` from `KNOWN_SENSORS`
- Session filter dropdown: hardcoded `<option>` → `populateSensorDropdowns()` from DB
- Sensor data filter: same treatment
- Pending approval sensor name: ternary chain → `DEVICE_NAMES[s.device]` lookup

## Pending

### Needs Discussion with DewS
- [ ] **#1 #2 Baseline / Subtraction logic** — how to calculate/subtract baseline from readings

### Week 2 Tasks (from timeline)
- [ ] **#5 Form update** — add project dropdown, lat/lng, address breakdown (ตำบล/อำเภอ/จังหวัด)
- [ ] **#6 Dashboard per project** — filter and display results by project + combined view
- [ ] **#11 Sensor management UI** — admin register + assign sensors easily

### Week 3 Tasks
- [ ] **#7 LINE OA multi-project** — update LINE summaries per-project
- [ ] **#14 Always-online solution** — DewS + WEnDyS design together, propose to อ.แก้ว
- [ ] **#3, #10, #13** Testing — baseline flow, sensor swap, map

### Not Yet Run
- [ ] Run `003_projects.sql` in Supabase SQL Editor
- [ ] Deploy updated sync.js + index.html to Vercel
- [ ] Test dynamic sensor loading end-to-end

## Next Session
- [ ] Discuss Baseline/Subtraction approach with DewS (#1 #2)
- [ ] Run migration 003 in Supabase
- [ ] Deploy and verify all fixes
- [ ] Start #5 Form update (project dropdown + address fields)
- [ ] Start #6 Dashboard per-project filtering

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — heavily modified (loadSensors, insertLog, closeSession, baseline fallback)
- `lab/tuya-ecostove/deploy/index.html` — chart + dropdowns + sensor name now dynamic
- `lab/tuya-ecostove/migrations/003_projects.sql` — NEW, not yet run
- `lab/tuya-ecostove/migrations/002_registered_sensors.sql` — reference
- `lab/tuya-ecostove/supabase/supabase/migrations/20260226102323_sessions.sql` — reference

## Important Notes
- DewS is **ผู้หญิง** — use ค่ะ/คะ not ครับ
- "ดูเองได้ ทำไมต้องถามฉันอ่ะ" — be autonomous, search codebase before asking
- Don't mention "deploy" in timeline communications (buying time)
- Baseline/Subtraction = between DewS and WEnDyS, not อ.แก้ว
- Always-online = DewS + WEnDyS figure out first, then propose to อ.แก้ว
