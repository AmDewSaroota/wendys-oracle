# Inline Baseline Computation Over Function Calls

**Date**: 2026-03-21
**Source**: EcoStove Deep Map AQI markers
**Context**: rrr: wendys-oracle

## Pattern

When computing aggregate stats from `allData` that need baseline subtraction, do the subtraction **inline** in the same loop rather than calling `applyBaselineSubtraction()` first.

## Why

- `applyBaselineSubtraction()` creates a full array copy (`.map()`) — O(n) memory
- Calling it then looping again = 2 passes over data
- Inline approach = 1 pass, 0 copies, same result

## Example

```javascript
// BAD — 2 passes, array copy
const adjusted = applyBaselineSubtraction(allData);
adjusted.forEach(d => { /* aggregate */ });

// GOOD — 1 pass, inline subtraction
allData.forEach(d => {
    const bl = sessionBaselines[d.session_id];
    if (bl && bl.baseline_ended_at && d.recorded_at < bl.baseline_ended_at) return;
    let pm25 = d.pm25_value;
    if (bl && bl.baseline_avg_pm25 != null) pm25 = Math.max(0, pm25 - bl.baseline_avg_pm25);
    // aggregate pm25 directly
});
```

## When to Use

- When you only need aggregates (sum/count/avg), not the full adjusted array
- When the adjusted array isn't needed elsewhere
- When performance matters (map rendering, large datasets)

## Tags

`performance`, `ecostove`, `baseline`, `optimization`
