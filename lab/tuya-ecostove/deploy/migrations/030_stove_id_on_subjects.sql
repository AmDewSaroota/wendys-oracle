-- 030: Move stove linking from stoves.subject_id → subjects.stove_id
-- Reason: 1 stove type can be assigned to MANY houses (many:1, not 1:1)
-- Date: 2026-04-25

-- 1. Add stove_id to subjects (many houses can reference same stove type)
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS stove_id INTEGER REFERENCES stoves(id);

-- 2. Migrate existing links (stoves.subject_id → subjects.stove_id)
UPDATE subjects s
SET stove_id = st.id
FROM stoves st
WHERE st.subject_id = s.id
  AND s.stove_id IS NULL;

-- 3. Index for performance
CREATE INDEX IF NOT EXISTS idx_subjects_stove ON subjects(stove_id);
