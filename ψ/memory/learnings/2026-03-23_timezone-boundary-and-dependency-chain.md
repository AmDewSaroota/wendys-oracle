# Timezone Boundaries & Dependency Chain Verification

**Date**: 2026-03-23
**Source**: rrr: ecostove-code-review-and-critical-fixes
**Tags**: #timezone #database #security #dependency-chain

## Pattern: Thai Date to UTC Conversion

**Wrong:**
```javascript
const today = '2026-03-23'; // Thai date
const filter = 'started_at=gte.' + today + 'T00:00:00Z';
// This is UTC midnight = 07:00 Thai time, NOT Thai midnight
```

**Correct:**
```javascript
function thaiDayStartUTC(thaiDate) {
  return new Date(thaiDate + 'T00:00:00+07:00').toISOString();
  // '2026-03-23T00:00:00+07:00' → '2026-03-22T17:00:00.000Z'
}
```

**Rule**: When a function returns a local date string (like `getThaiDate()` → `'2026-03-23'`), NEVER append `T00:00:00Z` to use it as a UTC timestamp. Always use the explicit timezone offset `+07:00`.

## Pattern: Verify Dependency Chain Before Removing Features

Before removing any feature (even "insecure" ones), trace ALL callers:
1. Check code references (`grep`)
2. Check memory/docs for external service configs
3. Check environment variables
4. Test with the actual caller before deploying

**Example**: Removing `?secret=` query string auth broke cron-job.org because the external service was configured to use URL-based auth, not Bearer headers.

## Pattern: SELECT Field Completeness

When computing aggregates from query results, verify that every field referenced in the computation is included in the SELECT clause:
```javascript
// If you compute: vals('co_value')
// Then SELECT must include: co_value
const logSelect = '...co_value,...';  // Don't forget!
```
