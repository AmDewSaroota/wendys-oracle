-- ============================================================
-- Biomass Stove Migration 009: Add updated_at to CRUD tables
-- Run in Supabase SQL Editor
-- Date: 2026-03-09
--
-- Purpose: เรียงลำดับ "เพิ่งแก้ไข → ขึ้นก่อน" ใน admin lists
-- ============================================================

-- 1. Add updated_at column (default NOW so existing rows get a value)
ALTER TABLE subjects    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE volunteers  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE devices     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create a reusable trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to each table
DROP TRIGGER IF EXISTS trg_subjects_updated_at ON subjects;
CREATE TRIGGER trg_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_volunteers_updated_at ON volunteers;
CREATE TRIGGER trg_volunteers_updated_at
  BEFORE UPDATE ON volunteers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_devices_updated_at ON devices;
CREATE TRIGGER trg_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- DONE! After running this:
-- - Every UPDATE on subjects/volunteers/devices auto-sets updated_at
-- - Admin lists will order by updated_at DESC (newest edit first)
-- ============================================================
