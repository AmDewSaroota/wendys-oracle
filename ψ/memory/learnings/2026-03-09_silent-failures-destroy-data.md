# Silent Failures Destroy Data

**Date**: 2026-03-09
**Source**: EcoStove sync bug — Tuya API failure caused false "sensor offline"
**Tags**: #error-handling #api #reliability #ecostove

## Pattern

When an external API call fails and the code returns an empty/default value without logging, downstream logic cannot distinguish between "API failed" and "no data exists." This causes the system to take destructive actions (closing sessions, marking incomplete) based on wrong assumptions.

## Example

```javascript
// BAD: silent failure
async function getBatchDeviceInfo(...) {
  const data = await res.json();
  if (!data.success) return {};  // ← no log, no flag, just empty
}

// Downstream sees {} and thinks all sensors are offline
const isOnline = deviceInfoMap[sensor.id]?.online;  // undefined → false
```

## Fix

```javascript
// GOOD: explicit failure with flag + logging
if (!data.success) {
  console.error('Tuya API error — code=' + data.code + ', msg=' + data.msg);
  return { _apiError: true, _errorMsg: '...' };
}
```

## Rule

Every external API call must:
1. **Log failures** with error details
2. **Return a distinguishable error state** (not the same shape as "no data")
3. **Let callers decide** what to do with errors vs empty data
