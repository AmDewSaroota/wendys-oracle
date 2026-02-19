# Lesson: Supabase RLS Pattern for Public Dashboards

**Date**: 2026-02-19
**Source**: EcoStove — RLS security warning fix

---

## Pattern: Reference Table on Public Dashboard

When a Supabase table is:
- A **reference/lookup table** (areas, categories, etc.)
- Used by a **public dashboard** (no auth required)
- Exposed via PostgREST (in `public` schema)

Apply this pattern:

```sql
-- 1. Enable RLS (required to activate security)
ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;

-- 2. Public read only
CREATE POLICY "Public can read {table}"
  ON public.{table}
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policy needed
-- RLS blocks all writes by default when no policy matches
```

## Why No Write Policy?

RLS without a policy = **deny all** for that operation.
So enabling RLS + SELECT policy automatically blocks all public writes.
Service role (used in Edge Functions) bypasses RLS by default.

## When to Audit

If one table has RLS disabled → check ALL tables in the same Supabase project.
They were likely all created at the same time with the same defaults.

## Supabase RLS Quick Audit SQL

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

`rowsecurity = false` → needs RLS enabled.
