# PostgreSQL IMMUTABLE Index on TIMESTAMPTZ

**Date**: 2026-02-26
**Source**: EcoStove migration — sessions table
**Context**: Creating a composite index with date extraction from TIMESTAMPTZ column

## The Problem

```sql
-- This FAILS:
CREATE INDEX idx ON sessions (device_id, (started_at::date));
-- ERROR: functions in index expression must be marked IMMUTABLE
```

## Why It Fails

`TIMESTAMPTZ::date` is not IMMUTABLE because:
- The result depends on the session's `timezone` setting
- Same TIMESTAMPTZ value → different dates depending on timezone
- PostgreSQL requires index expressions to always produce the same output for the same input

## The Fix

```sql
-- Explicit timezone conversion IS immutable:
CREATE INDEX idx ON sessions (device_id, ((started_at AT TIME ZONE 'UTC')::date));
```

`AT TIME ZONE 'UTC'` converts TIMESTAMPTZ → TIMESTAMP (timezone-naive) using a fixed timezone, making the expression deterministic and IMMUTABLE.

## Rule of Thumb

When indexing on date parts of TIMESTAMPTZ columns, always use `AT TIME ZONE 'zone_name'` to make the expression IMMUTABLE.

## Tags
`postgresql`, `index`, `immutable`, `timestamptz`, `supabase`
