-- 029: Add updated_at to monthly_usage for audit trail
-- Date: 2026-04-25

ALTER TABLE monthly_usage ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
