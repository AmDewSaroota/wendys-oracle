-- ============================================================
-- Biomass Stove Migration 001: Session Management Tables
-- Run in Supabase SQL Editor
-- Date: 2026-02-26
-- ============================================================

-- 1. sessions table — track each collection session per device
CREATE TABLE sessions (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id       TEXT NOT NULL,
  house_id        BIGINT,
  session_number  INT DEFAULT 1,

  -- Timestamps
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  baseline_ended_at   TIMESTAMPTZ,
  collection_ended_at TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,

  -- Status
  session_status TEXT NOT NULL DEFAULT 'baseline'
    CHECK (session_status IN ('baseline', 'collecting', 'complete', 'incomplete', 'cancelled')),

  -- Aggregates (computed when session completes)
  readings_count    INT DEFAULT 0,
  avg_pm25          REAL,
  avg_pm10          REAL,
  avg_co2           REAL,
  avg_temperature   REAL,
  avg_humidity      REAL,
  max_pm25          REAL,
  min_pm25          REAL,

  -- Metadata
  stove_type    TEXT DEFAULT 'eco',
  cancel_reason TEXT,
  notes         TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_device_status ON sessions (device_id, session_status);
CREATE INDEX idx_sessions_started_at ON sessions (started_at);
CREATE INDEX idx_sessions_device_date ON sessions (device_id, ((started_at AT TIME ZONE 'UTC')::date));

-- 2. daily_summaries table — aggregate per device per day
CREATE TABLE daily_summaries (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  summary_date        DATE NOT NULL,
  device_id           TEXT NOT NULL,
  house_id            BIGINT,

  -- Session counts
  sessions_completed  INT DEFAULT 0,
  sessions_incomplete INT DEFAULT 0,
  sessions_cancelled  INT DEFAULT 0,
  total_readings      INT DEFAULT 0,

  -- Air quality averages
  avg_pm25        REAL,
  max_pm25        REAL,
  min_pm25        REAL,
  avg_pm10        REAL,
  avg_co2         REAL,
  avg_temperature REAL,
  avg_humidity    REAL,

  -- Compliance
  compliance_status TEXT DEFAULT 'pending'
    CHECK (compliance_status IN ('pending', 'partial', 'complete', 'missed')),

  stove_type TEXT DEFAULT 'eco',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (summary_date, device_id)
);

CREATE INDEX idx_daily_summaries_date ON daily_summaries (summary_date);
CREATE INDEX idx_daily_summaries_device ON daily_summaries (device_id);

-- 3. Add session_id to pollution_logs
ALTER TABLE pollution_logs
  ADD COLUMN IF NOT EXISTS session_id BIGINT REFERENCES sessions(id);

CREATE INDEX IF NOT EXISTS idx_pollution_logs_session ON pollution_logs (session_id);

-- 4. RLS policies (match existing pollution_logs pattern)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_anon_select" ON sessions FOR SELECT USING (true);
CREATE POLICY "sessions_anon_insert" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_anon_update" ON sessions FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_summaries_anon_select" ON daily_summaries FOR SELECT USING (true);
CREATE POLICY "daily_summaries_anon_insert" ON daily_summaries FOR INSERT WITH CHECK (true);
CREATE POLICY "daily_summaries_anon_update" ON daily_summaries FOR UPDATE USING (true) WITH CHECK (true);
