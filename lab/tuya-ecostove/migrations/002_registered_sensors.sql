-- ============================================================
-- EcoStove Migration 002: Registered Sensors
-- Run in Supabase SQL Editor
-- Date: 2026-02-27
-- ============================================================

-- Registered sensors — admin can register new Tuya sensors
-- without needing a developer to edit code
CREATE TABLE registered_sensors (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tuya_device_id  TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  stove_type      TEXT DEFAULT 'eco' CHECK (stove_type IN ('eco', 'old')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Seed with existing sensors
INSERT INTO registered_sensors (tuya_device_id, name, stove_type) VALUES
  ('a3d01864e463e3ede0hf0e', 'MT13W-01', 'eco'),
  ('a3b9c2e4bdfe69ad7ekytn', 'MT29-01', 'old');

-- RLS policies (match existing pattern — anon access)
ALTER TABLE registered_sensors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registered_sensors_anon_select" ON registered_sensors FOR SELECT USING (true);
CREATE POLICY "registered_sensors_anon_insert" ON registered_sensors FOR INSERT WITH CHECK (true);
CREATE POLICY "registered_sensors_anon_update" ON registered_sensors FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "registered_sensors_anon_delete" ON registered_sensors FOR DELETE USING (true);
