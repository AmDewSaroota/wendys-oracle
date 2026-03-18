-- ============================================================
-- Biomass Stove Migration 006: Admin Auth + RLS Lockdown
-- Run in Supabase SQL Editor AFTER 005_indexes.sql
-- Date: 2026-03-06
--
-- IMPORTANT: Run Step 2 (sync.js service_role key) BEFORE this!
-- Otherwise sync.js will lose write access.
-- ============================================================

-- ============================================================
-- PART 1: admin_users table
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  auth_id    UUID NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_read" ON admin_users FOR SELECT USING (true);
-- No INSERT/UPDATE/DELETE policy = only service_role can write

-- ============================================================
-- PART 2: is_admin() helper function
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE auth_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PART 3: Lock down RLS — SELECT stays public, writes need admin
-- ============================================================

-- Helper: For tables that might not have RLS enabled yet
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_quota ENABLE ROW LEVEL SECURITY;

-- ---- sessions ----
DROP POLICY IF EXISTS "sessions_anon_insert" ON sessions;
DROP POLICY IF EXISTS "sessions_anon_update" ON sessions;
DROP POLICY IF EXISTS "sessions_anon_delete" ON sessions;
CREATE POLICY "sessions_admin_insert" ON sessions FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "sessions_admin_update" ON sessions FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "sessions_admin_delete" ON sessions FOR DELETE USING (is_admin());

-- ---- daily_summaries ----
DROP POLICY IF EXISTS "daily_summaries_anon_insert" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_anon_update" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_anon_delete" ON daily_summaries;
CREATE POLICY "daily_summaries_admin_insert" ON daily_summaries FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "daily_summaries_admin_update" ON daily_summaries FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "daily_summaries_admin_delete" ON daily_summaries FOR DELETE USING (is_admin());

-- ---- registered_sensors ----
DROP POLICY IF EXISTS "registered_sensors_anon_insert" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_anon_update" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_anon_delete" ON registered_sensors;
CREATE POLICY "registered_sensors_admin_insert" ON registered_sensors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "registered_sensors_admin_update" ON registered_sensors FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "registered_sensors_admin_delete" ON registered_sensors FOR DELETE USING (is_admin());

-- ---- projects ----
DROP POLICY IF EXISTS "projects_anon_insert" ON projects;
DROP POLICY IF EXISTS "projects_anon_update" ON projects;
DROP POLICY IF EXISTS "projects_anon_delete" ON projects;
CREATE POLICY "projects_admin_insert" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "projects_admin_update" ON projects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "projects_admin_delete" ON projects FOR DELETE USING (is_admin());

-- ---- subject_projects ----
DROP POLICY IF EXISTS "subject_projects_anon_insert" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_anon_update" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_anon_delete" ON subject_projects;
CREATE POLICY "subject_projects_admin_insert" ON subject_projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "subject_projects_admin_update" ON subject_projects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "subject_projects_admin_delete" ON subject_projects FOR DELETE USING (is_admin());

-- ---- subjects ----
DROP POLICY IF EXISTS "subjects_anon_insert" ON subjects;
DROP POLICY IF EXISTS "subjects_anon_update" ON subjects;
DROP POLICY IF EXISTS "subjects_anon_delete" ON subjects;
-- Ensure SELECT exists
DO $$ BEGIN
  CREATE POLICY "subjects_read" ON subjects FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE POLICY "subjects_admin_insert" ON subjects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "subjects_admin_update" ON subjects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "subjects_admin_delete" ON subjects FOR DELETE USING (is_admin());

-- ---- volunteers ----
DROP POLICY IF EXISTS "volunteers_anon_insert" ON volunteers;
DROP POLICY IF EXISTS "volunteers_anon_update" ON volunteers;
DROP POLICY IF EXISTS "volunteers_anon_delete" ON volunteers;
DO $$ BEGIN
  CREATE POLICY "volunteers_read" ON volunteers FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE POLICY "volunteers_admin_insert" ON volunteers FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "volunteers_admin_update" ON volunteers FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "volunteers_admin_delete" ON volunteers FOR DELETE USING (is_admin());

-- ---- devices ----
DROP POLICY IF EXISTS "devices_anon_insert" ON devices;
DROP POLICY IF EXISTS "devices_anon_update" ON devices;
DROP POLICY IF EXISTS "devices_anon_delete" ON devices;
DO $$ BEGIN
  CREATE POLICY "devices_read" ON devices FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE POLICY "devices_admin_insert" ON devices FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "devices_admin_update" ON devices FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "devices_admin_delete" ON devices FOR DELETE USING (is_admin());

-- ---- pollution_logs ----
DROP POLICY IF EXISTS "pollution_logs_anon_insert" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_anon_update" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_anon_delete" ON pollution_logs;
-- Keep existing SELECT if any, add if missing
DO $$ BEGIN
  CREATE POLICY "pollution_logs_read" ON pollution_logs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE POLICY "pollution_logs_admin_insert" ON pollution_logs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "pollution_logs_admin_update" ON pollution_logs FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "pollution_logs_admin_delete" ON pollution_logs FOR DELETE USING (is_admin());

-- ---- api_quota ----
DROP POLICY IF EXISTS "api_quota_anon_insert" ON api_quota;
DROP POLICY IF EXISTS "api_quota_anon_update" ON api_quota;
DROP POLICY IF EXISTS "api_quota_anon_delete" ON api_quota;
DO $$ BEGIN
  CREATE POLICY "api_quota_read" ON api_quota FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE POLICY "api_quota_admin_insert" ON api_quota FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "api_quota_admin_update" ON api_quota FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "api_quota_admin_delete" ON api_quota FOR DELETE USING (is_admin());

-- ============================================================
-- DONE! Next steps:
-- 1. Add SUPABASE_SERVICE_KEY to Vercel env vars
-- 2. Deploy sync.js (uses service_role key, bypasses RLS)
-- 3. Create admin users in Supabase Auth dashboard
-- 4. INSERT admin records into admin_users table
-- ============================================================
