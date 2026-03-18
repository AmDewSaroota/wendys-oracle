-- Migration 015: เก็บ PIN ใน sync_config (เปลี่ยนจากหน้าเว็บได้)
-- Env var ยังเป็น fallback ถ้า DB ไม่มีค่า

ALTER TABLE sync_config ADD COLUMN IF NOT EXISTS admin_pin TEXT;
ALTER TABLE sync_config ADD COLUMN IF NOT EXISTS super_pin TEXT;
