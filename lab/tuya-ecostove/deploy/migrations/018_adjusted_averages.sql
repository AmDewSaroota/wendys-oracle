-- Migration 018: Add baseline-adjusted averages to sessions + daily_summaries
-- These columns store cooking-phase averages with baseline subtracted
-- (same calculation as client-side applyBaselineSubtraction, but precomputed server-side)

-- Sessions: per-session adjusted averages
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS adjusted_avg_pm25 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS adjusted_avg_co2 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS adjusted_avg_temperature REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS adjusted_avg_humidity REAL;

-- Daily summaries: daily adjusted averages (averaged from session adjusted values)
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS adjusted_avg_pm25 REAL;
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS adjusted_avg_co2 REAL;
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS adjusted_avg_temperature REAL;
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS adjusted_avg_humidity REAL;
