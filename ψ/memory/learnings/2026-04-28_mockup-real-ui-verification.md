# Lesson: Verify CSS Mockups Against Real UI

**Date**: 2026-04-28
**Source**: rrr: wendys-oracle
**Context**: EcoStove dashboard — report HTML mockup for stove type tab

## Pattern

CSS mockups in documentation drift from the actual UI as features evolve. The stove type mockup used a card-based layout, but the real UI had been changed to a table with columns (ชื่อ, รายละเอียด, จัดการ). DewS caught the mismatch immediately.

## Rule

Before finalizing any CSS mockup in documentation:
1. Check the actual UI code (not memory) to confirm current layout
2. Match the DOM structure — if real UI is `<table>`, mockup should be `<table>` not `<div class="card">`
3. Verify column names, button labels, and color schemes against live code
4. If updating one mockup, check if the same element appears in other sections (guide, report, training)

## Also

- When adding the same mockup in multiple places (TH, EN, guide, report), check for duplicates
- `table-layout: fixed` + `<colgroup>` fixes number alignment in mockup tables
- Print CSS (`break-inside: avoid`) should be added to every guide section by default

## Tags

`mockup`, `css`, `documentation`, `ui-verification`, `ecostove`
