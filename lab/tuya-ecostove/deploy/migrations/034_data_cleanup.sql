-- 034_data_cleanup.sql
-- Clear all operational data: houses, volunteers, stoves, sessions, pending logs
-- KEEP: registered_sensors, admin_users, admin_activity_logs, app_settings, sync_config, sync_holidays
-- Run in Supabase SQL Editor (service_role bypasses RLS automatically)

-- Step 1: Clear leaf tables first (FK children)
DELETE FROM pollution_logs;

DELETE FROM daily_summaries;

DO $$ BEGIN
  DELETE FROM tvoc_active_sessions;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Step 2: Clear sessions
DELETE FROM sessions;

-- Step 3: Clear monthly usage audit trail
DELETE FROM monthly_usage_log;

DELETE FROM frequency_locks;

DELETE FROM monthly_usage;

-- Step 4: Clear subject-related tables
DELETE FROM collection_periods;

DELETE FROM subject_projects;

-- Step 5: Clear device assignments (FK → subjects + registered_sensors)
DELETE FROM devices;

-- Step 6: Clear subjects (บ้าน)
DELETE FROM subjects;

-- Step 7: Clear volunteers (อาสา)
DELETE FROM volunteers;

-- Step 8: Clear stove types (ประเภทเตา)
DELETE FROM stoves;

-- Verify: show remaining row counts for kept tables
SELECT 'registered_sensors' AS tbl, COUNT(*) FROM registered_sensors
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'app_settings', COUNT(*) FROM app_settings;
