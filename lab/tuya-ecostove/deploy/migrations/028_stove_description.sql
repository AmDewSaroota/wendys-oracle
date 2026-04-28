-- 028: Add description to stoves + make subject_id nullable (link later like projects)
-- Date: 2026-04-25

ALTER TABLE stoves ADD COLUMN IF NOT EXISTS description TEXT;
