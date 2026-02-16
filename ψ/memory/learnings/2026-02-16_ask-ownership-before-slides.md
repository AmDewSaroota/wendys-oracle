# Lesson Learned: Ask Who Owns What Before Making Slides

**Date**: 2026-02-16
**Context**: SWT Presentation — assumed single-team ownership, had to rewrite everything

---

## The Mistake

Read the SWT architecture chart and created 12+ slides treating ALL modules (Core Dashboard, Space Management, IoT, Kiosk, Web App) as one team's work.

DewS corrected: "3 บริษัททำ" — only Core DB + Kiosk/WebApp is our team. Space Management and IoT are other companies.

Had to rewrite the entire PPTX from scratch.

## The Pattern

When creating presentations about multi-stakeholder projects:

1. **Always ask**: "ใครรับผิดชอบส่วนไหน?" (Who owns which part?)
2. **Before writing slides**: Confirm scope boundaries
3. **Architecture charts often show the full system** — doesn't mean one team builds everything
4. **Our team's scope** defines what goes in the presentation; other teams' parts are shown as context/integration points only

## Related Lesson

Also applies to architecture diagrams, cost estimations, and demo decks. Always clarify team boundaries first.

## Trigger

When DewS says "ทำ slides" or "ทำ presentation" for a multi-team project → FIRST ask about team ownership boundaries before creating content.
