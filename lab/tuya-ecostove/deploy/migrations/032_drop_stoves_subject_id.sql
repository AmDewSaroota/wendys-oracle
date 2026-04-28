-- 032: Cleanup — drop stoves.subject_id (เก่า, ไม่ใช้แล้ว)
-- ตอนนี้ใช้ subjects.stove_id แทน (many:1)
-- ⚠️ ต้องรัน migration 030 ก่อน!

-- Drop index ก่อน (ถ้ามี)
DROP INDEX IF EXISTS idx_stoves_subject;

-- Drop column
ALTER TABLE stoves DROP COLUMN IF EXISTS subject_id;
