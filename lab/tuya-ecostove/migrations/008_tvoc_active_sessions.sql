-- ============================================================
-- EcoStove Migration 008: TVOC Active Sessions (Live Tracking)
-- Run in Supabase SQL Editor
-- Date: 2026-03-07
-- ============================================================

-- Ephemeral table: tracks who is currently recording TVOC
-- Rows are inserted on session start, pinged every 60s, deleted on end
-- Stale entries (no ping >3 min) are considered inactive

CREATE TABLE tvoc_active_sessions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  house_id      BIGINT NOT NULL,
  house_name    TEXT,
  volunteer_name TEXT,
  browser_id    TEXT NOT NULL,
  stove_type    TEXT DEFAULT 'eco',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_ping_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tvoc_active_house ON tvoc_active_sessions (house_id);
CREATE INDEX idx_tvoc_active_browser ON tvoc_active_sessions (browser_id);

-- Permissive RLS: anyone can read/write (ephemeral data, no security concern)
ALTER TABLE tvoc_active_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tvoc_active_anon_select" ON tvoc_active_sessions FOR SELECT USING (true);
CREATE POLICY "tvoc_active_anon_insert" ON tvoc_active_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "tvoc_active_anon_update" ON tvoc_active_sessions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "tvoc_active_anon_delete" ON tvoc_active_sessions FOR DELETE USING (true);
