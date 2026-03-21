# Design for Production Scale, Not Mock Data

**Date**: 2026-03-21
**Source**: EcoStove per-stove range filter discussion
**Context**: rrr: wendys-oracle

## Pattern

When making design decisions (add/remove/simplify features), always reason from **production data scale**, not from the mock/test data you currently see.

## Why

- Mock data: 10 houses, ~60 days → "just remove the filter, not enough data to filter"
- Production data: 10 houses, 6 months (3 old + 3 eco) → filter is essential for navigation
- Wrong reasoning led to suggesting removal of a critical feature

## Corollary: Know Your Own System

If you built ambient/baseline subtraction, remember that **net values are already environment-independent**. This means:
- Cross-period comparison IS valid (net = stove emissions only)
- Seasonal/weather differences are already accounted for
- Don't re-argue "different months = incomparable data" when subtraction already handles it

## When This Applies

- Any "simplify by removing" suggestion → check if production needs it
- Any "this comparison is invalid" claim → check if preprocessing already normalizes it
- Any scale-dependent decision → ask "what's the real scale?"

## Tags

`design`, `scale`, `ecostove`, `decision-making`, `self-correction`
