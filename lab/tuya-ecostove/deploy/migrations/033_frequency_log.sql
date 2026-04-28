-- 033: Frequency audit log + month locking
-- บันทึกทุกการแก้ไขความถี่ + ล็อคเดือน

-- Log ทุกการแก้ไขค่าความถี่
CREATE TABLE IF NOT EXISTS monthly_usage_log (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    old_value INTEGER,          -- NULL = กรอกครั้งแรก
    new_value INTEGER NOT NULL,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_log_month ON monthly_usage_log(month);
CREATE INDEX IF NOT EXISTS idx_usage_log_subject ON monthly_usage_log(subject_id, month);

-- ล็อคเดือน — ป้องกันการแก้ไขหลังยืนยัน
CREATE TABLE IF NOT EXISTS frequency_locks (
    month TEXT PRIMARY KEY,
    locked_by TEXT NOT NULL,
    locked_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE monthly_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequency_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_usage_log" ON monthly_usage_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_freq_locks" ON frequency_locks FOR ALL USING (true) WITH CHECK (true);
