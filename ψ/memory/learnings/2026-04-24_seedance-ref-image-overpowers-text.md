# Seedance: Reference Images Overpower Text Instructions

**Date**: 2026-04-24
**Source**: rrr: wendys-oracle
**Context**: Shot 6 — burning city appeared in background despite text saying "sky only"

## Pattern

In Seedance 2.0, **visual references (images) overpower text instructions**.

If you attach a burning city image as reference, Seedance will show a burning city in the output — even if the text prompt explicitly says "no city, no buildings, no ground visible."

### Rule
- **Remove unwanted reference images** — don't fight them with text
- This is the same principle as "geometry mockup poison" (Shot 10): visual refs contaminate the whole output
- Only attach images that match what you WANT to see

### Applied Fix
- Shot 6: removed `@[รูปเมืองไฟไหม้]` from references
- Added "sky only" text as backup, but removing the image is the primary fix

### Related Pattern
- Prompt revision: ask what's working before rewriting ("แอคชั่นโอเคอยู่แล้ว")
- Surgical additions > full rewrites — 2 targeted sentences beat a complete rewrite

## Concepts

- seedance
- reference-images
- visual-override-text
- prompt-engineering
- shot6
