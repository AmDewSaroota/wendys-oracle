-- Migration 022: Track sensor online/offline status from Tuya Cloud
-- sync.js writes these values every run so the dashboard can show accurate status

ALTER TABLE registered_sensors ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE registered_sensors ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;
