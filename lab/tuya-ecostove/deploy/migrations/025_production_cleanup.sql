-- ============================================================
-- 025: Production Cleanup — ล้างข้อมูลทดสอบก่อนใช้งานจริง
-- Date: 2026-04-21
-- Author: WEnDyS + DewS
--
-- ⚠️  REVIEW ก่อนรัน! ลบแล้วเอาคืนไม่ได้
-- ⚠️  รันใน Supabase SQL Editor (ใช้ service role)
-- ============================================================

-- ============================================================
-- STEP 0: สำรองจำนวน row ก่อนลบ (ดูผลใน Messages tab)
-- ============================================================
DO $$
DECLARE
  _count BIGINT;
BEGIN
  SELECT count(*) INTO _count FROM pollution_logs;
  RAISE NOTICE '📊 pollution_logs: % rows', _count;

  SELECT count(*) INTO _count FROM daily_summaries;
  RAISE NOTICE '📊 daily_summaries: % rows', _count;

  SELECT count(*) INTO _count FROM sessions;
  RAISE NOTICE '📊 sessions: % rows', _count;

  SELECT count(*) INTO _count FROM tvoc_active_sessions;
  RAISE NOTICE '📊 tvoc_active_sessions: % rows', _count;

  SELECT count(*) INTO _count FROM collection_periods;
  RAISE NOTICE '📊 collection_periods: % rows', _count;

  SELECT count(*) INTO _count FROM devices;
  RAISE NOTICE '📊 devices: % rows', _count;

  SELECT count(*) INTO _count FROM subject_projects;
  RAISE NOTICE '📊 subject_projects: % rows', _count;

  SELECT count(*) INTO _count FROM volunteers;
  RAISE NOTICE '📊 volunteers: % rows', _count;

  SELECT count(*) INTO _count FROM subjects;
  RAISE NOTICE '📊 subjects: % rows', _count;

  SELECT count(*) INTO _count FROM projects;
  RAISE NOTICE '📊 projects: % rows', _count;

  SELECT count(*) INTO _count FROM admin_activity_logs;
  RAISE NOTICE '📊 admin_activity_logs: % rows', _count;

  SELECT count(*) INTO _count FROM admin_users;
  RAISE NOTICE '📊 admin_users: % rows (จะลบเฉพาะ test)', _count;
END $$;

-- ============================================================
-- STEP 1: ล้างข้อมูลทั้งหมด (TRUNCATE CASCADE — จัดการ FK ให้อัตโนมัติ)
-- ============================================================
TRUNCATE TABLE
  pollution_logs,
  daily_summaries,
  sessions,
  tvoc_active_sessions,
  collection_periods,
  devices,
  subject_projects,
  volunteers,
  subjects,
  projects,
  admin_activity_logs
CASCADE;

-- ============================================================
-- STEP 2: ลบ test admins
-- ============================================================

-- 4.2 ลบแอดมินทดสอบ — เก็บ 5 คนจริง
DELETE FROM admin_users
WHERE email NOT IN (
  'dews.cnx@gmail.com',              -- DewS (Super Admin, 06/03/2026)
  'samrositalei@gmail.com',          -- Tusemi Vosadrau Jnr (Admin)
  'pkpiyd13@gmail.com',              -- มงคล ชาวตระการ (Super Admin)
  'surachai_nar@g.cmru.ac.th',       -- สุรชัย ณรัฐ จันทร์ศรี (Super Admin)
  'korawitnipuna2003@gmail.com'      -- กรวิชณ์ นิปุณะ (Admin)
);

-- ============================================================
-- STEP 5: ตรวจสอบหลังล้าง
-- ============================================================
DO $$
DECLARE
  _count BIGINT;
BEGIN
  SELECT count(*) INTO _count FROM pollution_logs;
  RAISE NOTICE '✅ pollution_logs: % rows', _count;

  SELECT count(*) INTO _count FROM sessions;
  RAISE NOTICE '✅ sessions: % rows', _count;

  SELECT count(*) INTO _count FROM subjects;
  RAISE NOTICE '✅ subjects: % rows', _count;

  SELECT count(*) INTO _count FROM admin_users;
  RAISE NOTICE '✅ admin_users: % rows (ควรเหลือ DewS + แอดมินใหม่)', _count;

  -- ยืนยันว่าของที่เก็บไว้ยังอยู่
  SELECT count(*) INTO _count FROM registered_sensors;
  RAISE NOTICE '🔒 registered_sensors: % rows (เก็บไว้)', _count;

  SELECT count(*) INTO _count FROM app_settings;
  RAISE NOTICE '🔒 app_settings: % rows (เก็บไว้)', _count;

  SELECT count(*) INTO _count FROM sync_config;
  RAISE NOTICE '🔒 sync_config: % rows (เก็บไว้)', _count;

  SELECT count(*) INTO _count FROM api_quota;
  RAISE NOTICE '🔒 api_quota: % rows (เก็บไว้ — ไม่ reset)', _count;
END $$;

-- ============================================================
-- ไม่แตะ (เก็บไว้ทั้งหมด):
--   ✅ registered_sensors  — BS 001-012 (MT15 sensor IDs)
--   ✅ app_settings        — invite code + config
--   ✅ sync_config         — quiet hours + active days
--   ✅ sync_holidays       — วันหยุด
--   ✅ api_quota           — quota เดือนนี้ (ใช้ไปแล้ว ไม่ reset)
-- ============================================================
