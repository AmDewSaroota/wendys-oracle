-- 020: app_settings — key-value config ที่ Super Admin เปลี่ยนได้
-- ใช้เก็บ invite_code แทน env var เพื่อให้ทีมจัดการเองได้

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT  -- email ของคนที่แก้ล่าสุด
);

-- Seed invite code จาก env var ปัจจุบัน
INSERT INTO app_settings (key, value) VALUES ('invite_code', 'ecostove2026')
ON CONFLICT (key) DO NOTHING;

-- RLS: ทุกคนอ่านได้ (register ต้องเช็ค), เขียนได้เฉพาะ service key
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON app_settings FOR SELECT USING (true);
