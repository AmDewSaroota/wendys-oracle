# Gmail Suspension Does Not Cascade to Tuya IoT

**Date**: 2026-03-17
**Source**: rrr: wendys-oracle
**Concepts**: tuya, gmail, ecostove, credentials, independence

## Pattern

When a Gmail account (`biomassstove.cmru@gmail.com`) gets suspended by Google, the Tuya IoT Platform account linked to that email **continues to work independently**. Tuya has its own authentication layer — Gmail suspension does not trigger Tuya account suspension.

## Implication

- Cron 502 errors were NOT caused by Tuya account suspension
- The likely cause: Vercel env vars still pointing to old Tuya credentials (`7dudg9tg3cwvrf8dx9na`) after sensor migration to new project account (`8grdqadptymnyeqdduxx`)
- sync.js has exactly ONE 502 source: line 856 `Cannot get Tuya token` — always check credentials first

## Action

When investigating Tuya API failures:
1. Check which Access ID Vercel is using (old vs new)
2. Verify token generation works with those credentials
3. Don't assume platform cascading — each service has independent auth
