# Lesson: Cross-Region API Calls in CI Need Retry Logic

**Date**: 2026-02-28
**Source**: rrr: ecostove-github-actions-cron
**Tags**: #ci #github-actions #tuya #retry #network

## Pattern

GitHub Actions runners are in US datacenters. When calling APIs hosted in other regions (e.g., Tuya Singapore `openapi-sg.iotbing.com`), TCP connections can fail intermittently — not rate limiting, but raw connection drops.

## Solution

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }
}
```

## Key Insight

- The first request to a regional endpoint usually succeeds (DNS cached, connection warm)
- Subsequent requests within seconds may fail (connection pool reset, routing change)
- A 2-3 second delay between retries is sufficient — no need for exponential backoff
- Also add inter-request delays when hitting the same API for multiple resources

## Also Learned

- `process.env.X || 'hardcoded'` is a clean CI/local dual-use pattern (no dotenv needed)
- `sparse-checkout` in GitHub Actions saves clone time in monorepos
