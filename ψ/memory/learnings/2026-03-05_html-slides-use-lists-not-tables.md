# Lesson: HTML Slides — Use Lists Not Tables

**Date**: 2026-03-05
**Source**: EcoStove slides editing session
**Tags**: html, slides, presentation, css

## What Happened

Added a `<table>` element to the EcoStove presentation slide to show LINE OA message quota calculations. The table rendered empty — no data visible. DewS reported "ตารางว่าง ไม่เห็นมีข้อมูลเลย".

## Why

The slide CSS (custom styles in `ecostove-meeting-ajkaew.html`) doesn't include table styling. Without explicit `border`, `color`, or layout rules, table cells render invisible or collapse.

## The Rule

**In HTML presentation slides: always use `<ul>/<li>` bullet lists instead of `<table>`.**

- Bullet lists inherit existing CSS styles (font, color, spacing)
- Tables need explicit styling that slide CSS rarely includes
- Lists are more compact and fit slide layouts better
- If tabular data is needed, use flexbox/grid with divs instead

## Also Learned

- LINE OA Thailand pricing (2025): Free 300 msg, Basic 1,280 ฿ (15,000 msg), Pro 1,780 ฿ (35,000 msg)
- "Light" plan no longer exists — was replaced by Basic
- LINE broadcast counts = 1 msg × number of followers
- LINE push (targeted) = 1 msg per recipient — different quota calc from broadcast
