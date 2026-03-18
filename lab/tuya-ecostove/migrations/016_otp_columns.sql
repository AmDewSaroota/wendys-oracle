-- Migration 016: Add OTP columns to sync_config
-- Used for 2-step verification when changing Super PIN

ALTER TABLE sync_config ADD COLUMN IF NOT EXISTS otp_code TEXT;
ALTER TABLE sync_config ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ;
