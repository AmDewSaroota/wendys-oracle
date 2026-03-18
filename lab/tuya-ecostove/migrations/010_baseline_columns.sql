-- ============================================================
-- Biomass Stove Migration 010: Add baseline columns to sessions
-- Run in Supabase SQL Editor
-- Date: 2026-03-09
--
-- Purpose: sync.js + volunteer.js เขียน baseline averages
--          แต่คอลัมน์ยังไม่มีใน sessions table → ข้อมูลหาย
-- ============================================================

-- 1. Add baseline columns
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_pm25 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_co2 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_temperature REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_humidity REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_readings_count INT DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_ended_at TIMESTAMPTZ;

-- 2. Add UNIQUE constraint on api_quota.month (needed for upsert merge-duplicates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'api_quota_month_unique'
  ) THEN
    ALTER TABLE api_quota ADD CONSTRAINT api_quota_month_unique UNIQUE (month);
  END IF;
END $$;

-- ============================================================
-- DONE! After running this:
-- - sync.js baseline transition จะบันทึกค่าเฉลี่ยได้
-- - volunteer.js cooking-start จะเก็บ baseline averages ได้
-- - api_quota upsert จะ merge ถูกต้อง ไม่สร้าง duplicate
-- ============================================================
