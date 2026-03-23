-- Migration 019: Add avg_co to sessions + daily_summaries
-- CO is stored in pollution_logs but wasn't aggregated into summaries
-- This allows the dashboard fast path (Phase 1) to display CO without raw data

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_co REAL;
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS avg_co REAL;
