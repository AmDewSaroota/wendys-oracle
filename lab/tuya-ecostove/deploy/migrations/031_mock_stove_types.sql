-- 031: Mock data — ประเภทเตา + ผูก stove_id กับ subjects + ความถี่
-- Date: 2026-04-25
-- Purpose: ข้อมูลทดสอบ ตรวจทาน many:1 (1 ประเภทเตา → หลายบ้าน)
-- ⚠️ ต้องรัน migration 030 ก่อน!

-- ============================================================
-- 1. เพิ่มประเภทเตา (4 ชนิด)
-- ============================================================
INSERT INTO stoves (name, description, stove_size, stove_fuel, created_by) VALUES
  ('เตาชีวมวลปรับปรุง', 'เตาประสิทธิภาพสูง ลดควัน ประหยัดเชื้อเพลิง', 'small', 'biomass', 'mock-data'),
  ('เตาดั้งเดิม', 'เตาฟืน/ถ่านแบบเดิม', 'small', 'biomass', 'mock-data'),
  ('เตาชีวมวลขนาดใหญ่', 'เตาขนาดใหญ่สำหรับ SME/ร้านค้า', 'large', 'biomass', 'mock-data'),
  ('เตาแก๊สหุงต้ม', 'เตาแก๊ส LPG ทั่วไป', 'small', 'gas', 'mock-data')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. ผูก stove_id → subjects (many:1)
--    ครัวเรือน → เตาชีวมวลปรับปรุง หรือ เตาดั้งเดิม (สลับกัน)
--    SME → เตาชีวมวลขนาดใหญ่
-- ============================================================

-- ครัวเรือน: ผูกกับ "เตาชีวมวลปรับปรุง" (บ้านที่ id คี่)
UPDATE subjects
SET stove_id = (SELECT id FROM stoves WHERE name = 'เตาชีวมวลปรับปรุง' AND created_by = 'mock-data' LIMIT 1)
WHERE (subject_type IS NULL OR subject_type = 'household')
  AND stove_id IS NULL
  AND MOD(id, 2) = 1;

-- ครัวเรือน: ผูกกับ "เตาดั้งเดิม" (บ้านที่ id คู่)
UPDATE subjects
SET stove_id = (SELECT id FROM stoves WHERE name = 'เตาดั้งเดิม' AND created_by = 'mock-data' LIMIT 1)
WHERE (subject_type IS NULL OR subject_type = 'household')
  AND stove_id IS NULL
  AND MOD(id, 2) = 0;

-- SME: ผูกกับ "เตาชีวมวลขนาดใหญ่"
UPDATE subjects
SET stove_id = (SELECT id FROM stoves WHERE name = 'เตาชีวมวลขนาดใหญ่' AND created_by = 'mock-data' LIMIT 1)
WHERE subject_type = 'sme'
  AND stove_id IS NULL;

-- ============================================================
-- 3. ความถี่รายเดือน (mock data เดือน 2026-04)
-- ============================================================
INSERT INTO monthly_usage (subject_id, month, usage_count, created_by, updated_at)
SELECT s.id, '2026-04',
  CASE
    WHEN s.subject_type = 'sme' THEN (2 + MOD(s.id, 3))  -- SME: 2-4 ครั้ง/เดือน
    WHEN MOD(s.id, 3) = 0 THEN (15 + MOD(s.id, 10))      -- กลุ่ม 1: ≥15 (เขียว)
    WHEN MOD(s.id, 3) = 1 THEN (4 + MOD(s.id, 7))         -- กลุ่ม 2: 4-14 (ส้ม)
    ELSE MOD(s.id, 4)                                       -- กลุ่ม 3: 0-3 (แดง)
  END,
  'mock-data',
  now()
FROM subjects s
WHERE NOT EXISTS (
  SELECT 1 FROM monthly_usage mu WHERE mu.subject_id = s.id AND mu.month = '2026-04'
);

-- ============================================================
-- 4. ตรวจสอบผลลัพธ์
-- ============================================================
-- รันแยก:
-- SELECT s.id, s.full_name, s.subject_type, s.stove_id, st.name as stove_name
-- FROM subjects s LEFT JOIN stoves st ON st.id = s.stove_id
-- ORDER BY s.id;
