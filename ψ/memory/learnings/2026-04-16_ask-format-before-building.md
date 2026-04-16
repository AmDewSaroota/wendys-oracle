# Ask Format Before Building

**Date**: 2026-04-16
**Source**: rrr: wendys-oracle
**Tags**: #communication #planning #ux

## Pattern

When a user asks for "slides" or "presentation", they might mean:
1. A real presentation (arrow keys, fullscreen, slide-by-slide)
2. A scrollable document with sections
3. A printable PDF-style document
4. All of the above

## Lesson

**Always ask the delivery format before building.** One clarifying question saves hours of rework.

Questions to ask:
- "เอาแบบ slide กด next? หรือเอกสารเลื่อนดู?"
- "เปิดดูบนมือถือ หรือ present บนจอใหญ่?"
- "ต้อง print เป็น PDF ด้วยมั้ย?"

## Context

DewS asked for "HTML slides" to teach admins. Built a fancy slideshow with scroll-snap, arrow keys, progress bar. DewS redirected: "เอาแบบเปิดดูในมือถืองาย เป็นบูลเลทเฉยๆ" — needed a simple scrollable document, not a presentation.

## Related

For field teams (volunteers, field admins), mobile-friendly scrollable documents always win over presentation-style slides.
