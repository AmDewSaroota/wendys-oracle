-- ============================================================
-- Biomass Stove Migration 005: Critical Indexes for pollution_logs
-- Run in Supabase SQL Editor AFTER 004_address_fields.sql
-- Date: 2026-03-06
-- ============================================================

-- 1. Index for session detail queries (closeSession aggregation, session modal)
CREATE INDEX IF NOT EXISTS idx_pollution_logs_session
  ON pollution_logs (session_id);

-- 2. Compound index for device + time range queries (sync.js closeSession, dashboard filters)
CREATE INDEX IF NOT EXISTS idx_pollution_logs_device_date
  ON pollution_logs (tuya_device_id, recorded_at DESC);

-- 3. Index for admin approval list (status = 'pending' / 'approved')
CREATE INDEX IF NOT EXISTS idx_pollution_logs_status
  ON pollution_logs (status);
