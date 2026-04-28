-- 027: Subject type (household/SME) + Stoves table + Monthly usage frequency
-- Date: 2026-04-25
-- REQ: อ.แก้ว/ทีม (2026-04-20)

-- 1. Add subject_type to subjects
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS subject_type TEXT DEFAULT 'household';
-- Values: 'household' (ครัวเรือน — เตาเล็ก 1-2 ตัว, ใช้เกือบทุกวัน)
--         'sme' (SME — เตาใหญ่ 1-10 ตัว, ใช้ 2-4 ครั้ง/เดือน)

-- 2. Stoves table — แอดมินแอดเตาเอง
CREATE TABLE IF NOT EXISTS stoves (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT,
  stove_size TEXT DEFAULT 'small',  -- 'small' (ครัวเรือน) / 'large' (SME)
  stove_fuel TEXT DEFAULT 'biomass',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Monthly usage frequency — ความถี่ใช้เตา/เดือน (batch input)
CREATE TABLE IF NOT EXISTS monthly_usage (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  month TEXT NOT NULL,            -- 'YYYY-MM'
  usage_count INTEGER DEFAULT 0,  -- จำนวนครั้งที่ใช้เตาในเดือนนั้น
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(subject_id, month)
);

-- 4. RLS
ALTER TABLE stoves ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY stoves_public ON stoves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY monthly_usage_public ON monthly_usage FOR ALL USING (true) WITH CHECK (true);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_stoves_subject ON stoves(subject_id);
CREATE INDEX IF NOT EXISTS idx_monthly_usage_subject_month ON monthly_usage(subject_id, month);
