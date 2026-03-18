# PostgreSQL NULL + LIKE Trap in Supabase

**Date**: 2026-03-18
**Context**: EcoStove mock data deletion failed to remove TVOC entries with NULL device IDs

## Pattern
In PostgreSQL (and Supabase PostgREST):
- `NULL LIKE 'MOCK-%'` → `NULL` (not FALSE)
- `NULL NOT LIKE 'MOCK-%'` → `NULL` (not TRUE)
- Therefore rows with NULL values **escape both** `.like()` and `.not('col', 'like', 'pattern')`

## Fix
Always include explicit NULL handling:
```javascript
// BAD — misses NULL rows
.delete().not('tuya_device_id', 'like', 'MOCK-%')

// GOOD — catches NULL rows too
.delete().or('tuya_device_id.not.like.MOCK-%,tuya_device_id.is.null')
```

## Lesson
Whenever using `.like()` or `.not('col', 'like', ...)` in Supabase, ask:
"Can this column be NULL? If yes, do I need those rows too?"

## Tags
`supabase` `postgresql` `null-handling` `deletion` `postrest`
