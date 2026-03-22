# Lesson: Visual Debug — Verify Before Theorize

**Date**: 2026-03-22
**Source**: EcoStove chart band/mean debugging
**Concepts**: debugging, charts, visual-verification, mock-data

## Pattern

When a user reports a visual issue in a chart/UI:

1. **Ask them to hover/interact** to get tooltip/data values FIRST
2. **Identify which dataset** each visual element belongs to
3. THEN form theories about why the data looks wrong

## Anti-Pattern

Theorizing from code alone → multiple rounds of "maybe it's X" → user loses confidence → eventual tooltip proves the first theory wrong anyway.

## Mock Data Caveat

`applyBaselineSubtraction()` requires `session_id` in records. Mock data without sessions → function returns data unchanged → "net" = "raw". Any fix targeting baseline subtraction has ZERO effect on mock data.

## Chart.js Visibility

- `fill` opacity 8% on white = effectively invisible for wide bands
- 15%+ opacity needed for bands to be clearly visible
- Gray-on-gray (dashed mean inside gray band) = invisible — use darker gray (#6b7280) and thicker line (2px+)
