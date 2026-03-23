-- Migration 021: Add baseline TVOC/CO averages to sessions
-- Allows comparing ambient TVOC/CO levels (before cooking) vs cooking levels
-- TVOC/CO baseline data comes from manual volunteer input during baseline phase

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_tvoc REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_co REAL;
