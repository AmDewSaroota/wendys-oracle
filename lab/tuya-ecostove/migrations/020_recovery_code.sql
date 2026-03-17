-- 020: Switch from OTP to personal recovery code
-- Each admin gets a unique recovery code at registration
-- Used for self-service PIN reset (no email sending needed)

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS recovery_code TEXT;
ALTER TABLE admin_users DROP COLUMN IF EXISTS recovery_otp;
ALTER TABLE admin_users DROP COLUMN IF EXISTS recovery_otp_expires_at;
ALTER TABLE admin_users DROP COLUMN IF EXISTS recovery_attempts;
