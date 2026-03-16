-- Migration 017: Personal PIN per admin + DB-backed Activity Log
-- เปลี่ยนจาก shared PIN → personal PIN ต่อคน
-- เปลี่ยน Activity log จาก localStorage → DB table

-- 1. Personal PIN column on admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS pin_hash TEXT;

-- 2. Activity log table (append-only — ไม่มี UPDATE/DELETE policy)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id    BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_name  TEXT NOT NULL,
  action      TEXT NOT NULL,
  detail      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_read" ON admin_activity_logs FOR SELECT USING (true);
CREATE POLICY "activity_logs_write" ON admin_activity_logs FOR INSERT WITH CHECK (true);

-- 3. Index for fast queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON admin_activity_logs(created_at DESC);

-- 4. Seed DewS personal PIN (sha256 of 'admin2026')
CREATE EXTENSION IF NOT EXISTS pgcrypto;
UPDATE admin_users
SET pin_hash = encode(digest('admin2026', 'sha256'), 'hex')
WHERE email = 'dews.cnx@gmail.com';
