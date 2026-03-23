# RLS Must Match Actual Architecture

**Date**: 2026-03-24
**Source**: EcoStove code review P0+P1 fixes
**Tags**: #security #rls #supabase #architecture

## Pattern

When applying Row Level Security (RLS) policies, the policies must match the **actual** authentication architecture, not the **ideal** one.

## Context

Migration 023 locked all tables to SELECT-only for anon role. This is textbook correct — anon shouldn't write to sensitive tables. But the EcoStove dashboard uses the Supabase **anon key** for ALL operations (reads AND writes), with admin authentication handled at the application layer (API endpoints with service key for admin_users only).

Result: admin couldn't register sensors, update devices, or manage any data. Production break.

## Fix

Migration 024 re-allowed writes (INSERT/UPDATE/DELETE) for all admin-managed tables while keeping `admin_users` locked (no anon access). The critical table with sensitive data (pin_hash, recovery_code) stays protected.

## Rule

Before writing RLS policies:
1. Trace every CRUD operation in the app
2. Identify which Supabase key is used (anon vs service)
3. Only restrict operations that genuinely go through a different auth path
4. If in doubt, check the frontend code — it's the source of truth for which key is used

## Related

- Migration 023: `023_pm10_rls_race.sql`
- Migration 024: `024_fix_rls_admin_writes.sql`
- admin_users → always via API endpoints (service key) → safe to lock anon
- All other tables → dashboard uses anon key → must allow anon writes
