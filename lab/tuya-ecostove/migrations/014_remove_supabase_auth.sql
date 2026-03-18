-- ============================================================
-- Biomass Stove Migration 014: ลบ Supabase Auth → เปลี่ยนเป็น PIN
-- รัน Supabase SQL Editor ได้เลย
-- Date: 2026-03-12
--
-- สิ่งที่ทำ:
-- 1. Drop is_admin() function (ไม่ต้องใช้ JWT อีกแล้ว)
-- 2. เปลี่ยน RLS write policies ทั้งหมดเป็น true
-- 3. Drop auth_id column จาก admin_users
-- ============================================================

-- ============================================================
-- PART 1: RLS — ลบ policies เก่าที่ใช้ is_admin() ก่อน แล้วสร้างใหม่เป็น true
-- (ต้องลบ policies ก่อน ไม่งั้น DROP FUNCTION จะพัง)
-- ============================================================

-- ---- sessions ----
DROP POLICY IF EXISTS "sessions_admin_insert" ON sessions;
DROP POLICY IF EXISTS "sessions_admin_update" ON sessions;
DROP POLICY IF EXISTS "sessions_admin_delete" ON sessions;
DROP POLICY IF EXISTS "sessions_write" ON sessions;
DROP POLICY IF EXISTS "sessions_update" ON sessions;
DROP POLICY IF EXISTS "sessions_delete" ON sessions;
CREATE POLICY "sessions_write" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "sessions_update" ON sessions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sessions_delete" ON sessions FOR DELETE USING (true);

-- ---- daily_summaries ----
DROP POLICY IF EXISTS "daily_summaries_admin_insert" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_admin_update" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_admin_delete" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_write" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_update" ON daily_summaries;
DROP POLICY IF EXISTS "daily_summaries_delete" ON daily_summaries;
CREATE POLICY "daily_summaries_write" ON daily_summaries FOR INSERT WITH CHECK (true);
CREATE POLICY "daily_summaries_update" ON daily_summaries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "daily_summaries_delete" ON daily_summaries FOR DELETE USING (true);

-- ---- registered_sensors ----
DROP POLICY IF EXISTS "registered_sensors_admin_insert" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_admin_update" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_admin_delete" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_write" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_update" ON registered_sensors;
DROP POLICY IF EXISTS "registered_sensors_delete" ON registered_sensors;
CREATE POLICY "registered_sensors_write" ON registered_sensors FOR INSERT WITH CHECK (true);
CREATE POLICY "registered_sensors_update" ON registered_sensors FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "registered_sensors_delete" ON registered_sensors FOR DELETE USING (true);

-- ---- projects ----
DROP POLICY IF EXISTS "projects_admin_insert" ON projects;
DROP POLICY IF EXISTS "projects_admin_update" ON projects;
DROP POLICY IF EXISTS "projects_admin_delete" ON projects;
DROP POLICY IF EXISTS "projects_write" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;
DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_write" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (true);

-- ---- subject_projects ----
DROP POLICY IF EXISTS "subject_projects_admin_insert" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_admin_update" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_admin_delete" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_write" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_update" ON subject_projects;
DROP POLICY IF EXISTS "subject_projects_delete" ON subject_projects;
CREATE POLICY "subject_projects_write" ON subject_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "subject_projects_update" ON subject_projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "subject_projects_delete" ON subject_projects FOR DELETE USING (true);

-- ---- subjects ----
DROP POLICY IF EXISTS "subjects_admin_insert" ON subjects;
DROP POLICY IF EXISTS "subjects_admin_update" ON subjects;
DROP POLICY IF EXISTS "subjects_admin_delete" ON subjects;
DROP POLICY IF EXISTS "subjects_write" ON subjects;
DROP POLICY IF EXISTS "subjects_update" ON subjects;
DROP POLICY IF EXISTS "subjects_delete" ON subjects;
CREATE POLICY "subjects_write" ON subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "subjects_update" ON subjects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "subjects_delete" ON subjects FOR DELETE USING (true);

-- ---- volunteers ----
DROP POLICY IF EXISTS "volunteers_admin_insert" ON volunteers;
DROP POLICY IF EXISTS "volunteers_admin_update" ON volunteers;
DROP POLICY IF EXISTS "volunteers_admin_delete" ON volunteers;
DROP POLICY IF EXISTS "volunteers_write" ON volunteers;
DROP POLICY IF EXISTS "volunteers_update" ON volunteers;
DROP POLICY IF EXISTS "volunteers_delete" ON volunteers;
CREATE POLICY "volunteers_write" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "volunteers_update" ON volunteers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "volunteers_delete" ON volunteers FOR DELETE USING (true);

-- ---- devices ----
DROP POLICY IF EXISTS "devices_admin_insert" ON devices;
DROP POLICY IF EXISTS "devices_admin_update" ON devices;
DROP POLICY IF EXISTS "devices_admin_delete" ON devices;
DROP POLICY IF EXISTS "devices_write" ON devices;
DROP POLICY IF EXISTS "devices_update" ON devices;
DROP POLICY IF EXISTS "devices_delete" ON devices;
CREATE POLICY "devices_write" ON devices FOR INSERT WITH CHECK (true);
CREATE POLICY "devices_update" ON devices FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "devices_delete" ON devices FOR DELETE USING (true);

-- ---- pollution_logs ----
DROP POLICY IF EXISTS "pollution_logs_admin_insert" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_admin_update" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_admin_delete" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_write" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_update" ON pollution_logs;
DROP POLICY IF EXISTS "pollution_logs_delete" ON pollution_logs;
CREATE POLICY "pollution_logs_write" ON pollution_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "pollution_logs_update" ON pollution_logs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "pollution_logs_delete" ON pollution_logs FOR DELETE USING (true);

-- ---- api_quota ----
DROP POLICY IF EXISTS "api_quota_admin_insert" ON api_quota;
DROP POLICY IF EXISTS "api_quota_admin_update" ON api_quota;
DROP POLICY IF EXISTS "api_quota_admin_delete" ON api_quota;
DROP POLICY IF EXISTS "api_quota_write" ON api_quota;
DROP POLICY IF EXISTS "api_quota_update" ON api_quota;
DROP POLICY IF EXISTS "api_quota_delete" ON api_quota;
CREATE POLICY "api_quota_write" ON api_quota FOR INSERT WITH CHECK (true);
CREATE POLICY "api_quota_update" ON api_quota FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "api_quota_delete" ON api_quota FOR DELETE USING (true);

-- ---- sync_config ----
DROP POLICY IF EXISTS "anon_write_sync_config" ON sync_config;
DROP POLICY IF EXISTS "anon_update_sync_config" ON sync_config;
DROP POLICY IF EXISTS "sync_config_write" ON sync_config;
DROP POLICY IF EXISTS "sync_config_update" ON sync_config;
CREATE POLICY "sync_config_write" ON sync_config FOR INSERT WITH CHECK (true);
CREATE POLICY "sync_config_update" ON sync_config FOR UPDATE USING (true) WITH CHECK (true);

-- ---- sync_holidays ----
DROP POLICY IF EXISTS "anon_write_holidays" ON sync_holidays;
DROP POLICY IF EXISTS "anon_update_holidays" ON sync_holidays;
DROP POLICY IF EXISTS "anon_delete_holidays" ON sync_holidays;
DROP POLICY IF EXISTS "sync_holidays_write" ON sync_holidays;
DROP POLICY IF EXISTS "sync_holidays_update" ON sync_holidays;
DROP POLICY IF EXISTS "sync_holidays_delete" ON sync_holidays;
CREATE POLICY "sync_holidays_write" ON sync_holidays FOR INSERT WITH CHECK (true);
CREATE POLICY "sync_holidays_update" ON sync_holidays FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sync_holidays_delete" ON sync_holidays FOR DELETE USING (true);

-- ---- admin_users ----
DROP POLICY IF EXISTS "admin_users_read" ON admin_users;
CREATE POLICY "admin_users_read" ON admin_users FOR SELECT USING (true);
CREATE POLICY "admin_users_write" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_users_update" ON admin_users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "admin_users_delete" ON admin_users FOR DELETE USING (true);

-- ============================================================
-- PART 2: Drop is_admin() function (policies ที่ depend ถูกลบไปแล้วข้างบน)
-- ============================================================
DROP FUNCTION IF EXISTS is_admin();

-- ============================================================
-- PART 3: Drop auth_id column (ไม่ต้องผูกกับ Supabase Auth อีกแล้ว)
-- ============================================================
ALTER TABLE admin_users DROP COLUMN IF EXISTS auth_id;

-- ============================================================
-- DONE! หลังรันแล้ว:
-- ✅ is_admin() function ถูกลบ
-- ✅ RLS write policies เปิดหมด (ใช้ anon key เขียนได้)
-- ✅ auth_id column ถูกลบ (ไม่ผูก Supabase Auth)
-- ✅ admin_users เหลือ: id, name, email, role, created_at
--
-- ขั้นตอนถัดไป:
-- 1. เพิ่ม ADMIN_PIN + SUPER_PIN ใน Vercel env vars
-- 2. Deploy โค้ดใหม่ (PIN auth)
-- ============================================================
