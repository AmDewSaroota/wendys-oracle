# Lesson: Verify Production State Before Modifying

**Date**: 2026-03-04
**Source**: EcoStove LINE OA incident
**Severity**: Critical
**Tags**: production, memory, deployment, verification

## What Happened

Memory said "LINE OA ยังไม่ได้ implement" but it had been deployed and sending daily LINE messages for 5 days. Based on this stale memory, I:
1. Removed working Vercel Cron jobs from vercel.json
2. Added auth middleware that blocked Vercel's internal cron calls
3. Effectively broke a working production notification system

## Root Cause

- Memory was written at a point in time and never updated after deployment
- No verification step before making changes to production configuration
- Incorrect assumption about Vercel Hobby plan cron limitations

## The Rule

**Before modifying ANY production system:**
1. Check live deployment status (is it actually running?)
2. Test live endpoints (are they responding?)
3. Read deployment logs (what's the recent activity?)
4. Ask the user if unsure ("Is this currently in use?")

**Memory is a cache, not truth.** Always cross-reference with actual state.

## Technical Notes

- Vercel Hobby plan supports 2 cron jobs (not "วันละครั้ง" as previously recorded)
- Vercel Cron calls endpoints directly without custom headers — don't add auth to cron endpoints
- `echo "value"` adds trailing newline — use `printf "value"` for env vars
