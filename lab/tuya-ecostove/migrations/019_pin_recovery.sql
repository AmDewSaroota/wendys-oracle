-- 019: Add PIN recovery via email OTP
-- Allows admins to reset forgotten PIN using email verification

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS recovery_otp TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS recovery_otp_expires_at TIMESTAMPTZ;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS recovery_attempts SMALLINT DEFAULT 0;
