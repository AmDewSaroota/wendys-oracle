-- ============================================================
-- Biomass Stove Migration 007: Add role column to admin_users
-- Run in Supabase SQL Editor AFTER 006_auth.sql
-- Date: 2026-03-06
--
-- เหตุผล: 006 รันไปแล้วก่อนเพิ่ม role column
-- ============================================================

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'
CHECK (role IN ('super', 'admin'));
