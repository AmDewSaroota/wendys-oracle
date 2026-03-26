# Fail Closed on Query Errors

**Date**: 2026-03-26
**Source**: Field test — device lock bypassed on mobile
**Tags**: security, error-handling, mobile, supabase, defensive-programming

## Pattern

Any check that gates access (lock, auth, permission) must **fail closed** — if the check itself fails (network error, timeout, query error), deny access rather than allow it.

## Anti-pattern

```js
const { data } = await sb.from('locks').select('*').eq('id', x);
if (!data || data.length === 0) return { allowed: true };  // BUG: treats error as "no lock"
```

## Correct pattern

```js
const { data, error } = await sb.from('locks').select('*').eq('id', x);
if (error) return { allowed: false, reason: 'query_error' };  // fail closed
if (!data || data.length === 0) return { allowed: true };
```

## Why it matters

- Desktop networks rarely fail → bug stays hidden during dev/testing
- Mobile networks fail often (4G drops, timeouts) → bug surfaces in the field
- One-directional failure: PC blocks correctly (stable network finds phone's lock), phone allows incorrectly (query fails → "no lock found")
- Result: false sense of security — lock "works" in testing but fails for half the users in production

## Broader principle

**Security checks that fail open are worse than no checks at all** — they create false confidence. Always destructure `error` from Supabase/API calls and handle it explicitly.
