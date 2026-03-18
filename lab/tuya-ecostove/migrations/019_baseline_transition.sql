-- Migration 019: Add baseline_transition flag
-- Track whether baseline was ended by volunteer (manual) or auto (sync.js timeout)
-- Used to monitor volunteer engagement and send reminders

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS baseline_transition TEXT DEFAULT NULL;

-- Values: 'manual' (volunteer clicked), 'auto' (sync.js 10min timeout), NULL (not yet transitioned)

COMMENT ON COLUMN public.sessions.baseline_transition IS 'How baseline ended: manual (volunteer), auto (10min timeout), NULL (still in baseline or legacy)';
