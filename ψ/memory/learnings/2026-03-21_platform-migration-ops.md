# Platform Migration Ops — Lessons from EcoStove

**Date**: 2026-03-21
**Context**: Migrated EcoStove from DewS personal accounts to project account
**Tags**: #ops #migration #supabase #vercel #cron

## Key Patterns

### 1. Supabase Transfer Project = Zero Downtime
- Transfer Project feature moves everything (DB, auth, storage) to new org
- URL and API keys **do not change** — no code changes needed
- Prerequisite: target account must be **member of both orgs** (source and target)
- Much simpler than export/import which risks data loss

### 2. Vercel Project Transfer via Delete + Redeploy
- Can't directly transfer a project between accounts
- Flow: delete old project → create new project on target account → deploy → add custom domain
- Domain (e.g., `biomassstove.vercel.app`) becomes available immediately after deleting old project
- Must `rm -r .vercel` locally and `vercel link` to new project before deploying

### 3. Always Verify Auth in Recreated Endpoints
- When recreating a cron job or webhook, **read the source code** to find all auth parameters
- Don't rely on memory — sync.js needed `?secret=ecostove-sync-2026` in URL
- Pattern: check both header auth (`Authorization: Bearer`) and query param auth (`?secret=`)

### 4. Clean Env Vars During Migration
- Use migration as opportunity to audit and remove unused env vars
- Grep codebase for each var to verify it's still referenced
- ADMIN_PIN and SUPER_PIN had zero code references → safely removed

### 5. Field-Facing Documentation Needs Physical Domain Expert
- AI cannot know: device has battery (not USB-only), button behaviors, sensor quirks
- Every detail in a volunteer guide must be verified by someone who held the device
- Corrections are not bugs — they're essential domain knowledge transfer
