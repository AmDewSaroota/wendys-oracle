-- Migration 024: Fix RLS — allow anon writes for admin-managed tables
-- Date: 2026-03-23
-- Reason: Dashboard uses anon key for all table writes.
--         Migration 023 locked to SELECT-only, breaking admin operations.
--         admin_users remains locked (no anon access) — that's the critical table.

-- ===== Tables that dashboard writes to =====

-- pollution_logs: needs UPDATE (approve/reject)
CREATE POLICY "pl_anon_update" ON pollution_logs FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- sessions: needs UPDATE (manual close, status change)
CREATE POLICY "sess_anon_update" ON sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- devices: needs INSERT + UPDATE + DELETE
CREATE POLICY "dev_anon_insert" ON devices FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "dev_anon_update" ON devices FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "dev_anon_delete" ON devices FOR DELETE TO anon USING (true);

-- registered_sensors: needs INSERT + DELETE
CREATE POLICY "rs_anon_insert" ON registered_sensors FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "rs_anon_delete" ON registered_sensors FOR DELETE TO anon USING (true);

-- collection_periods: needs INSERT + UPDATE + DELETE
CREATE POLICY "cp_anon_insert" ON collection_periods FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "cp_anon_update" ON collection_periods FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "cp_anon_delete" ON collection_periods FOR DELETE TO anon USING (true);

-- sync_holidays: needs INSERT + UPDATE + DELETE (upsert + delete)
CREATE POLICY "sh_anon_insert" ON sync_holidays FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sh_anon_update" ON sync_holidays FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "sh_anon_delete" ON sync_holidays FOR DELETE TO anon USING (true);

-- sync_config: needs INSERT + UPDATE (upsert)
CREATE POLICY "sc_anon_insert" ON sync_config FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sc_anon_update" ON sync_config FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- projects: needs INSERT + UPDATE + DELETE
CREATE POLICY "proj_anon_insert" ON projects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "proj_anon_update" ON projects FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "proj_anon_delete" ON projects FOR DELETE TO anon USING (true);

-- volunteers: needs INSERT + UPDATE + DELETE
CREATE POLICY "vol_anon_insert" ON volunteers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "vol_anon_update" ON volunteers FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "vol_anon_delete" ON volunteers FOR DELETE TO anon USING (true);

-- subjects: needs INSERT + UPDATE + DELETE
CREATE POLICY "sub_anon_insert" ON subjects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sub_anon_update" ON subjects FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "sub_anon_delete" ON subjects FOR DELETE TO anon USING (true);

-- subject_projects: needs INSERT + DELETE
CREATE POLICY "sp_anon_insert" ON subject_projects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sp_anon_delete" ON subject_projects FOR DELETE TO anon USING (true);

-- daily_summaries: needs INSERT + UPDATE (sync.js uses service key, but just in case)
CREATE POLICY "ds_anon_insert" ON daily_summaries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "ds_anon_update" ON daily_summaries FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- api_quota: needs UPDATE (sync.js uses service key, but dashboard may read/write)
CREATE POLICY "aq_anon_insert" ON api_quota FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "aq_anon_update" ON api_quota FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- app_settings: needs SELECT only (already has it), but admin may update via API
CREATE POLICY "as_anon_update" ON app_settings FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ===== admin_users: STAYS LOCKED — no anon access =====
-- This is the only table with sensitive data (pin_hash, recovery_code)
-- All admin_users operations go through /api/admin/* endpoints with service key
