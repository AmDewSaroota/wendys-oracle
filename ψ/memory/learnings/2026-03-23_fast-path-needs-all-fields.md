# Lesson: Fast Path Needs All Display Fields

**Date**: 2026-03-23
**Source**: EcoStove CO card "--" debugging
**Concepts**: two-phase-loading, daily-summaries, fast-path, stat-cards

## Pattern

When using a **summary table as a fast path** (Phase 1) to render stat cards quickly before raw data loads (Phase 2):

1. **Every field displayed on Phase 1 must exist in the summary table**
2. Fields only in raw data → invisible until Phase 2 completes
3. Phase 2 background load MUST trigger a re-render, otherwise the UI never updates

## Anti-Pattern

Treating some fields as "raw data only" (CO, HCHO, TVOC) while showing their stat cards on the fast-path page. Users see "--" and think data is missing.

## The Fix Pattern

```
Summary table: ADD COLUMN avg_co
Sync logic: COMPUTE avg_co when writing summaries
Dashboard fieldMap: ADD co_value → avg_co mapping
Background load: .then(() => updateView()) after completion
```

## Memory Staleness Corollary

If DewS says she already did something → update MEMORY.md immediately. Don't wait. Every "I already told you" = trust erosion.
