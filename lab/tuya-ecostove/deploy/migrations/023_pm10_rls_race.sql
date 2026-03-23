-- Migration 023: PM10 columns + RLS lockdown + race condition guard
-- Date: 2026-03-23

-- ===== 1. PM10 columns on sessions (S-H3) =====
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS avg_pm10 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS baseline_avg_pm10 REAL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS adjusted_avg_pm10 REAL;

-- ===== 2. Unique index to prevent race condition (S-C1) =====
-- Only one active (baseline/collecting) session per device per session_number
CREATE UNIQUE INDEX IF NOT EXISTS sessions_device_slot_active
ON sessions (device_id, session_number)
WHERE session_status IN ('baseline', 'collecting');

-- ===== 3. RLS lockdown (V-C1) =====
-- Drop ALL existing permissive policies (from migrations 001-014)
-- Using IF EXISTS so it won't error if policy doesn't exist

-- pollution_logs
DROP POLICY IF EXISTS "pollution_logs_anon_select" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_write" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_anon_insert" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_admin_insert" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_admin_update" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_admin_delete" ON pollution_logs;
DROP POLICY IF EXISTS "anon_read_pollution_logs" ON pollution_logs;
DROP POLICY IF EXISTS "anon_write_pollution_logs" ON pollution_logs;

-- sessions
DROP POLICY IF EXISTS "sessions_anon_select" ON sessions;
DROP POLICY IF EXISTS "sessions_write" ON sessions;
DROP POLICY IF EXISTS "sessions_admin_insert" ON sessions;
DROP POLICY IF EXISTS "sessions_admin_update" ON sessions;
DROP POLICY IF EXISTS "sessions_admin_delete" ON sessions;
DROP POLICY IF EXISTS "anon_read_sessions" ON sessions;
DROP POLICY IF EXISTS "anon_write_sessions" ON sessions;

-- daily_summaries
DROP POLICY IF EXISTS "daily_summaries_anon_select" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_write" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_admin_insert" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_admin_update" ON daily_summaries;
DROP POLICY IF EXISTS "anon_read_daily_summaries" ON daily_summaries;
DROP POLICY IF EXISTS "anon_write_daily_summaries" ON daily_summaries;

-- admin_users
DROP POLICY IF EXISTS "admin_users_select" ON admin_users;
DROP POLICY IF EXISTS "admin_users_write" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete" ON admin_users;
DROP POLICY IF EXISTS "anon_read_admin_users" ON admin_users;
DROP POLICY IF EXISTS "anon_write_admin_users" ON admin_users;

-- admin_activity_logs
DROP POLICY IF EXISTS "admin_activity_logs_select" ON admin_activity_logs;
DROP POLICY IF EXISTS "admin_activity_logs_write" ON admin_activity_logs;
DROP POLICY IF EXISTS "admin_activity_logs_insert" ON admin_activity_logs;
DROP POLICY IF EXISTS "anon_read_admin_activity_logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "anon_write_admin_activity_logs" ON admin_activity_logs;

-- tvoc_active_sessions
DROP POLICY IF EXISTS "tvoc_active_sessions_select" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "tvoc_active_sessions_write" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "tvoc_active_sessions_insert" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "tvoc_active_sessions_update" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "tvoc_active_sessions_delete" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "anon_read_tvoc" ON tvoc_active_sessions;
DROP POLICY IF EXISTS "anon_write_tvoc" ON tvoc_active_sessions;

-- subjects
DROP POLICY IF EXISTS "subjects_select" ON subjects;
DROP POLICY IF EXISTS "subjects_write" ON subjects;
DROP POLICY IF EXISTS "anon_read_subjects" ON subjects;
DROP POLICY IF EXISTS "anon_write_subjects" ON subjects;

-- devices
DROP POLICY IF EXISTS "devices_select" ON devices;
DROP POLICY IF EXISTS "devices_write" ON devices;
DROP POLICY IF EXISTS "anon_read_devices" ON devices;
DROP POLICY IF EXISTS "anon_write_devices" ON devices;

-- registered_sensors
DROP POLICY IF EXISTS "registered_sensors_select" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_write" ON registered_sensors;
DROP POLICY IF EXISTS "anon_read_registered_sensors" ON registered_sensors;
DROP POLICY IF EXISTS "anon_write_registered_sensors" ON registered_sensors;

-- collection_periods
DROP POLICY IF EXISTS "collection_periods_select" ON collection_periods;
DROP POLICY IF EXISTS "collection_periods_write" ON collection_periods;
DROP POLICY IF EXISTS "anon_read_collection_periods" ON collection_periods;
DROP POLICY IF EXISTS "anon_write_collection_periods" ON collection_periods;

-- projects
DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_write" ON projects;
DROP POLICY IF EXISTS "anon_read_projects" ON projects;
DROP POLICY IF EXISTS "anon_write_projects" ON projects;

-- volunteers
DROP POLICY IF EXISTS "volunteers_select" ON volunteers;
DROP POLICY IF EXISTS "volunteers_write" ON volunteers;
DROP POLICY IF EXISTS "anon_read_volunteers" ON volunteers;
DROP POLICY IF EXISTS "anon_write_volunteers" ON volunteers;

-- subject_projects
DROP POLICY IF EXISTS "subject_projects_select" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_write" ON subject_projects;
DROP POLICY IF EXISTS "anon_read_subject_projects" ON subject_projects;
DROP POLICY IF EXISTS "anon_write_subject_projects" ON subject_projects;

-- api_quota
DROP POLICY IF EXISTS "api_quota_select" ON api_quota;
DROP POLICY IF EXISTS "api_quota_write" ON api_quota;
DROP POLICY IF EXISTS "anon_read_api_quota" ON api_quota;
DROP POLICY IF EXISTS "anon_write_api_quota" ON api_quota;

-- app_settings
DROP POLICY IF EXISTS "app_settings_select" ON app_settings;
DROP POLICY IF EXISTS "app_settings_write" ON app_settings;
DROP POLICY IF EXISTS "anon_read_app_settings" ON app_settings;
DROP POLICY IF EXISTS "anon_write_app_settings" ON app_settings;

-- sync_config
DROP POLICY IF EXISTS "sync_config_select" ON sync_config;
DROP POLICY IF EXISTS "sync_config_write" ON sync_config;
DROP POLICY IF EXISTS "anon_read_sync_config" ON sync_config;
DROP POLICY IF EXISTS "anon_write_sync_config" ON sync_config;

-- sync_holidays
DROP POLICY IF EXISTS "sync_holidays_select" ON sync_holidays;
DROP POLICY IF EXISTS "sync_holidays_write" ON sync_holidays;
DROP POLICY IF EXISTS "anon_read_sync_holidays" ON sync_holidays;
DROP POLICY IF EXISTS "anon_write_sync_holidays" ON sync_holidays;

-- ===== Enable RLS on all tables =====
ALTER TABLE pollution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tvoc_active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_holidays ENABLE ROW LEVEL SECURITY;

-- ===== Create restrictive policies =====

-- pollution_logs: anon can INSERT + SELECT (volunteer page needs both)
CREATE POLICY "pl_anon_select" ON pollution_logs FOR SELECT TO anon USING (true);
CREATE POLICY "pl_anon_insert" ON pollution_logs FOR INSERT TO anon WITH CHECK (true);

-- sessions: anon can SELECT only (sync.js uses service key for writes)
CREATE POLICY "sess_anon_select" ON sessions FOR SELECT TO anon USING (true);

-- daily_summaries: anon can SELECT only
CREATE POLICY "ds_anon_select" ON daily_summaries FOR SELECT TO anon USING (true);

-- admin_users: NO anon access (service key only via admin APIs)
-- No policy = deny all for anon role

-- admin_activity_logs: anon can SELECT + INSERT (dashboard logActivity uses anon key)
CREATE POLICY "aal_anon_select" ON admin_activity_logs FOR SELECT TO anon USING (true);
CREATE POLICY "aal_anon_insert" ON admin_activity_logs FOR INSERT TO anon WITH CHECK (true);

-- tvoc_active_sessions: anon can ALL (browser locks, ephemeral)
CREATE POLICY "tvoc_anon_all" ON tvoc_active_sessions FOR ALL TO anon USING (true) WITH CHECK (true);

-- Reference tables: anon can SELECT only
CREATE POLICY "sub_anon_select" ON subjects FOR SELECT TO anon USING (true);
CREATE POLICY "dev_anon_select" ON devices FOR SELECT TO anon USING (true);
CREATE POLICY "rs_anon_select" ON registered_sensors FOR SELECT TO anon USING (true);
CREATE POLICY "cp_anon_select" ON collection_periods FOR SELECT TO anon USING (true);
CREATE POLICY "proj_anon_select" ON projects FOR SELECT TO anon USING (true);
CREATE POLICY "vol_anon_select" ON volunteers FOR SELECT TO anon USING (true);
CREATE POLICY "sp_anon_select" ON subject_projects FOR SELECT TO anon USING (true);
CREATE POLICY "aq_anon_select" ON api_quota FOR SELECT TO anon USING (true);
CREATE POLICY "as_anon_select" ON app_settings FOR SELECT TO anon USING (true);
CREATE POLICY "sc_anon_select" ON sync_config FOR SELECT TO anon USING (true);
CREATE POLICY "sh_anon_select" ON sync_holidays FOR SELECT TO anon USING (true);
