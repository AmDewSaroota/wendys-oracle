-- ============================================================
-- EcoStove Migration 003: Add connectivity to subjects
-- Run in Supabase SQL Editor
-- Date: 2026-02-27
-- ============================================================

-- Add connectivity column: wifi or hotspot
ALTER TABLE subjects
  ADD COLUMN IF NOT EXISTS connectivity TEXT
  CHECK (connectivity IN ('wifi', 'hotspot'));

COMMENT ON COLUMN subjects.connectivity IS 'Internet connectivity type: wifi = มี WiFi, hotspot = อาสาเปิด Hotspot';
