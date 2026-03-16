-- Migration 018: Collection Periods
-- กำหนดช่วงเก็บข้อมูลต่อบ้าน: เตาเก่า (old) / เตาประหยัด (eco)
-- ย้าย stove_type จากเซนเซอร์ → ผูกกับบ้าน + ช่วงวันที่
-- Date: 2026-03-16

CREATE TABLE IF NOT EXISTS collection_periods (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_id  BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  stove_type  TEXT NOT NULL CHECK (stove_type IN ('old', 'eco')),
  starts_at   DATE NOT NULL,
  ends_at     DATE,        -- NULL = ยังไม่กำหนดวันสิ้นสุด (ongoing)
  notes       TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_periods_subject ON collection_periods(subject_id);
CREATE INDEX IF NOT EXISTS idx_periods_active ON collection_periods(subject_id, starts_at, ends_at);

-- RLS
ALTER TABLE collection_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "periods_read" ON collection_periods FOR SELECT USING (true);
CREATE POLICY "periods_write" ON collection_periods FOR INSERT WITH CHECK (true);
CREATE POLICY "periods_update" ON collection_periods FOR UPDATE USING (true);
CREATE POLICY "periods_delete" ON collection_periods FOR DELETE USING (true);
