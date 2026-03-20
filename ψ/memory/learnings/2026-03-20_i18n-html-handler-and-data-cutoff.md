# i18n innerHTML Handler & Data Cutoff Design

**Date**: 2026-03-20
**Source**: rrr: ecostove-i18n-and-bug-fixes
**Context**: EcoStove Dashboard index.html

## Pattern: data-i18n vs data-i18n-html

When building an i18n system with `data-i18n` attributes:
- `data-i18n` → sets `textContent` (strips HTML, safe for plain text)
- `data-i18n-html` → sets `innerHTML` (preserves bold, spans, links)

Use `data-i18n-html` for:
- Scenario bars with `<b>` tags
- Notes with `<b>หมายเหตุ:</b>` formatting
- Any translatable text that contains HTML markup

**Handler code**:
```javascript
document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const val = t(key);
    if (val !== key) el.innerHTML = val;
});
```

**Gotcha**: Don't put `data-i18n-html` on a parent element that contains child elements with onclick handlers or other attributes — innerHTML replacement destroys those children. Instead, use `data-i18n` on inner text-only spans and leave structural elements alone.

## Pattern: Data Cutoff Must Match Project Timeline

Hardcoding `60 * 24 * 60 * 60 * 1000` (60 days) as data cutoff works for real-time monitoring but fails for research projects with sequential phases:
- Phase 1: 60+ days of traditional stove data
- Phase 2: 60+ days of biomass stove data

The cutoff must cover both phases or the comparison breaks. 180 days is a reasonable compromise for projects with known ~4-month timelines.

**Better approach**: Calculate cutoff from the earliest data in the dataset, or use `daily_summaries` table which is much lighter.

## Pattern: Performance Budget for Dashboard Load

| Records | API Calls (1000/page) | Approx Load Time |
|---------|----------------------|-------------------|
| 5,000 | 5 | ~2s |
| 20,000 | 20 | ~8s |
| 65,000 | 65 | ~30s |

Rules of thumb:
- `select('*')` → `select(specific_columns)` = ~30% faster
- Pre-aggregated tables (daily_summaries) = 15-20x fewer records
- Acceptable dashboard load: < 5 seconds

**Tags**: #i18n #performance #data-pipeline #ecostove
