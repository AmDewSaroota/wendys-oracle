-- ============================================================
-- Biomass Stove Migration 004: Structured Address Fields
-- Run in Supabase SQL Editor AFTER 003_projects.sql
-- Date: 2026-03-06
-- ============================================================

-- Add structured address columns to subjects (houses)
-- Keeps existing `address` field as free-text (บ้านเลขที่ ซอย ถนน)
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS province TEXT;      -- จังหวัด
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS district TEXT;      -- อำเภอ
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS subdistrict TEXT;   -- ตำบล
