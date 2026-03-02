# Lesson: URL-Encode Timestamps & Never Swallow Errors Silently

**Date**: 2026-03-02
**Source**: rrr: ecostove-sync-bugfix-data-integrity
**Tags**: #supabase #url-encoding #silent-failure #serverless #data-migration

## Pattern

When constructing URLs with dynamic values (especially ISO timestamps), the `+` in timezone offsets like `+00:00` is interpreted as a space in URLs. This causes silent query failures.

## Rule

1. **Always `encodeURIComponent()` any dynamic value going into a URL query string**
2. **Never `return` silently on failure in serverless functions** — at minimum log the error
3. **When changing data classifications (e.g., stove_type labels), always backfill historical data**
4. **When migrating between architectures (local → serverless), create a feature checklist**

## Example

```js
// BAD — + in +00:00 becomes space
'&recorded_at=gte.' + session.started_at

// GOOD
'&recorded_at=gte.' + encodeURIComponent(session.started_at)
```

## Impact

This bug caused every session close to fail silently since the code was first deployed. Sessions accumulated indefinitely, aggregates were never computed, and daily summaries were never populated.
