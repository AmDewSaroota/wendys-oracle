# Supabase SDK v2 — Internal Session Lock Blocks All Queries

**Date**: 2026-03-06
**Source**: rrr: wendys-oracle (EcoStove)
**Tags**: supabase, auth, sdk, blocking, gotcha

## Pattern

Supabase JS SDK v2 (`@supabase/supabase-js`) has an internal session lock (mutex-like mechanism). When `createClient()` detects auth tokens in localStorage, it calls `_recoverAndRefresh()` internally.

**This blocks ALL subsequent operations**:
- `.from('table').select()` — data queries blocked
- `.auth.getSession()` — auth queries blocked
- `.auth.signInWithPassword()` — login blocked
- `.auth.setSession()` — also triggers the same lock

## Symptoms

- Page loads with stale auth tokens in localStorage
- Data queries hang indefinitely (no timeout, no error)
- UI shows loading spinner forever
- Login attempts timeout

## Solution

**Simplest fix**: Clear ALL auth tokens from localStorage BEFORE calling `createClient()`.

```javascript
// Clear auth tokens before creating client
try {
    Object.keys(localStorage).forEach(k => {
        if (k.startsWith('sb-') || k.includes('supabase')) localStorage.removeItem(k);
    });
} catch (_) {}
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

User re-logins after page refresh. Acceptable UX for small teams.

## What Doesn't Work

1. **Promise.race with timeout** — SDK still blocks .from() calls regardless
2. **save/clear/restore tokens** — setSession() triggers internal refresh → same lock
3. **fire-and-forget setSession()** — lock persists, blocks subsequent signInWithPassword()

## Key Insight

For small admin teams (2-3 people), session persistence across refreshes is NOT worth fighting SDK internals. Clear state, let users re-login.
