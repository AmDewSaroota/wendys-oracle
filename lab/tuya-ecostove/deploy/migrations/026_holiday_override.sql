-- 026: Holiday Override — allow admin to enable collection on rest days (one-day only)
-- Date: 2026-04-25

ALTER TABLE sync_config
  ADD COLUMN IF NOT EXISTS override_date DATE,
  ADD COLUMN IF NOT EXISTS override_by TEXT,
  ADD COLUMN IF NOT EXISTS override_reason TEXT;

-- override_date = Thai date (YYYY-MM-DD) when override is active
-- If today matches override_date → skip active_days + holiday checks
-- Auto-expires: next day the date won't match → no cron needed
