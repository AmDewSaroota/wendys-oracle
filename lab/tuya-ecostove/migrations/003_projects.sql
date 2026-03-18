-- ============================================================
-- Biomass Stove Migration 003: Multi-Project Support
-- Run in Supabase SQL Editor
-- Date: 2026-03-06
-- ============================================================

-- 1. Projects table — each project อ.แก้ว runs (โครงการที่ 1, 2, 3...)
CREATE TABLE projects (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,               -- e.g. "โครงการเตาประหยัด 1"
  description TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Link subjects (houses) to projects — many-to-many
--    A house can participate in multiple projects
CREATE TABLE subject_projects (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_id  BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (subject_id, project_id)
);

CREATE INDEX idx_subject_projects_subject ON subject_projects (subject_id);
CREATE INDEX idx_subject_projects_project ON subject_projects (project_id);

-- 3. Add project_id to sessions (optional — for filtering results by project)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES projects(id);
CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions (project_id);

-- 4. Add project_id to daily_summaries (for per-project aggregation)
ALTER TABLE daily_summaries ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES projects(id);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_project ON daily_summaries (project_id);

-- 5. RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_anon_select" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_anon_insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "projects_anon_update" ON projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "projects_anon_delete" ON projects FOR DELETE USING (true);

ALTER TABLE subject_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subject_projects_anon_select" ON subject_projects FOR SELECT USING (true);
CREATE POLICY "subject_projects_anon_insert" ON subject_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "subject_projects_anon_update" ON subject_projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "subject_projects_anon_delete" ON subject_projects FOR DELETE USING (true);

-- 6. Seed with placeholder projects (อ.แก้วจะเปลี่ยนชื่อทีหลัง)
INSERT INTO projects (name, description) VALUES
  ('โครงการที่ 1', 'โครงการแรก — รอตั้งชื่อจริง'),
  ('โครงการที่ 2', 'โครงการที่สอง — รอตั้งชื่อจริง'),
  ('โครงการที่ 3', 'โครงการที่สาม — รอตั้งชื่อจริง');
