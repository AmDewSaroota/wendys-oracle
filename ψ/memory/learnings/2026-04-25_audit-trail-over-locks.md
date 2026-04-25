# Audit Trails Beat Input Locks

**Date**: 2026-04-25
**Context**: EcoStove frequency input — should admin be limited to 1 entry/month?
**Source**: rrr: wendys-oracle

## Pattern

When building admin data-entry forms, the instinct is to "lock" inputs after first save to prevent accidental overwrites. This creates a worse problem:

- Typos become permanent (need Super Admin DB intervention)
- Multiple admins can't correct each other
- Creates support burden for simple fixes

## Better Approach

**Editable always + visible audit trail:**
- Allow overwrite anytime (upsert pattern)
- Show who last saved and when (badge under input)
- Keep it lightweight: `✅ name dd/mm` — no modal, no history table needed
- `updated_at` column + `created_by` (overwritten by upsert) = minimal schema change

## Key Insight

Data integrity comes from **visibility** (everyone sees who changed what), not from **restriction** (nobody can change). Restrictions create friction; visibility creates accountability.

## Tags

`admin-ux`, `data-entry`, `audit-trail`, `upsert-pattern`, `ecostove`
