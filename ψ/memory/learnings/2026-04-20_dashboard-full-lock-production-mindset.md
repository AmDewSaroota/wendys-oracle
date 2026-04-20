# Dashboard Full Lock = Production Mindset

**Date**: 2026-04-20
**Source**: rrr: wendys-oracle
**Tags**: ecostove, production, discipline, constraints

## Pattern

When a system transitions from development to having real users watching, the rules change fundamentally:

1. **Everything is locked by default** — no changes without explicit confirmed REQs
2. **REQs must have verified origin** — from the actual stakeholder (อ.แก้ว/team), not from AI suggestions
3. **Mockup-first for new features** — build in isolation (separate HTML), review, then merge
4. **Bug fixes OK, "improvements" not OK** — if no one asked for it, don't do it

## Trigger

DewS rejected ExitPlanMode specifically to add this constraint — showing how critical it is. 5 real admins are now on the system observing every change.

## Application

- Before any change to index.html: ask "Is this a confirmed REQ from อ.แก้ว/team or a bug fix?"
- If WEnDyS thinks something would be "better": DON'T do it unless asked
- New features → separate mockup file → review → merge
