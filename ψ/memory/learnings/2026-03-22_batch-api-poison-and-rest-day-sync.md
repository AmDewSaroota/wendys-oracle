# Batch API Poisoning & Rest Day Sync

**Date**: 2026-03-22
**Source**: EcoStove real sensor integration
**Tags**: tuya, api, batch, line-oa, cron, schedule

## Pattern: Batch API Poison

When calling Tuya's batch device API (`/v1.0/iot-03/devices?device_ids=X,Y,Z`), if ANY device ID is invalid (e.g. `MOCK-ES-01`), the entire batch returns "permission deny". The API doesn't gracefully skip unknown IDs.

**Fix**: Only send validated, real device IDs. When migrating from mock to real data, update ALL entries — not just one — before triggering the batch API.

## Pattern: Schedule-Aware Notifications

If the data collection system has rest days (active_days config), ALL downstream systems must also respect that schedule:
- sync.js ✅ checks active_days
- LINE OA morning cron ❌ was NOT checking → sent "no data" reports on rest days
- LINE OA evening cron ❌ was NOT checking → sent "no data" reports on rest days

**Rule**: When adding schedule/quiet-hours to any pipeline component, audit all downstream consumers (notifications, reports, dashboards) to ensure they're also aware.

## Pattern: Mock-to-Real Migration Needs a Plan

Mock data (MOCK-ES-XX device IDs, [MOCK] house names) served well during development, but the transition to real data had no migration path. Each table had to be updated manually via API calls.

**Better approach**: Build an admin function "Import from Tuya Cloud" that:
1. Lists all real devices from Tuya API
2. Shows which ones are already registered
3. Lets admin assign new ones to ES-XX names and houses
