# Lesson: Use session_id for Grouping, Not Time Gaps

**Date**: 2026-03-26
**Source**: TVOC approval bug — manual records showing as separate cards
**Tags**: #data-modeling #grouping #session #approval

## Problem

Manual TVOC/CO records from the same cooking session appeared as 3 separate cards in the approval tab. Root cause: grouping used `house_id + date + 30min time gaps` instead of the `session_id` foreign key that already linked them.

A volunteer who enters values at 12:16, 12:52, and 13:34 (gaps > 30 min) gets 3 cards instead of 1.

## Solution

1. **Group by `session_id` first** — records with the same session_id always become one card, regardless of time gaps
2. **Fallback to time gaps** only for records where `session_id` is null (legacy data)

```javascript
// Records WITH session_id → one card per session_id
// Records WITHOUT session_id → fallback to house_id + date + 30min gaps
```

## Companion Fix: TVOC Question Persistence

The TVOC question ("วันนี้ต้องกรอกค่าด้วยมือมั้ย?") used an in-memory flag `tvocQuestionAnswered` that reset on page refresh. If the user answered "ไม่เก็บ" (no records saved), on refresh: no records found → flag stays false → question reappears.

Fix: `sessionStorage.setItem('tvoc_answered_' + houseId, '1'|'0')` — persists across refresh, clears on tab close.

## Principle

**When a foreign key exists, always prefer it over heuristics.** Time-gap grouping is a guess; session_id is a fact. Use facts first, heuristics as fallback only.
