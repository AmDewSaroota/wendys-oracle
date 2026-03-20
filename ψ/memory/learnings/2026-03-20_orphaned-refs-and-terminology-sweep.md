# Orphaned Element References & Terminology Sweep

**Date**: 2026-03-20
**Source**: rrr: ecostove-dashboard-polish-7items
**Context**: EcoStove Dashboard index.html

## Pattern: Orphaned JS→HTML References

When HTML elements are removed during refactoring, their `document.getElementById()` calls in JS survive silently until real data triggers the code path.

**Example**: `updateBeforeAfter()` referenced `basic-eco-pm25`, `basic-old-pm25`, `basic-reduction` — elements removed in a prior session. With no data, the function never ran. With mock data, it ran → null crash → killed entire `updateBasicView()` chain.

**Fix**: Always null-guard getElementById calls in large single-file apps, or better — search for removed IDs across the file before committing.

**Search pattern**: After removing an HTML element with `id="foo"`, run:
```
grep -n "foo" index.html
```

## Pattern: Terminology Change = Expensive Sweep

Changing one user-visible term ("Baseline" → "Ambient"/"Benchmark") required edits at 15+ locations:
- HTML labels (hero, cards, badges)
- i18n translation keys
- Info popup content strings
- Admin panel badge titles
- Export function replace strings
- Methodology panel text

**Lesson**: If terminology lives in i18n keys, the change is 1-2 edits. If it's hardcoded in HTML/JS strings everywhere, it's a full sweep. Centralizing user-visible text in i18n pays off.

## Pattern: Date Format Helper Centralization

Created `fmtDateDMY()` and `fmtDateTimeDMY()` helpers and replaced all `toLocaleDateString()` / `toLocaleString()` calls for date display. One source of truth for date formatting.

**Tags**: #refactoring #single-file-app #i18n #null-safety #ecostove
