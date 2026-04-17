# Lesson: Custom Google Slides Builder vs Generic JSON Pipeline

**Date**: 2026-04-17
**Source**: 3D Pipeline presentation — 3 slide generation attempts
**Tags**: google-slides, api, presentation, layout, visual-fidelity

## Pattern

When a presentation has a specific visual mockup (HTML/Figma/etc.), the generic JSON-to-slides pipeline produces layouts that don't match. The visual disconnect makes it feel like a different presentation, even when the content is identical.

### When to use generic pipeline (`create-slides.ts`):
- Quick decks without a specific visual reference
- Content-first presentations where layout doesn't matter much
- Drafts / internal reviews

### When to build custom (`build-*.ts`):
- Presentation has an HTML/design mockup to match
- Client/presenter has already reviewed and approved a specific layout
- Visual elements like cards, highlight boxes, placeholder images matter
- High-stakes presentations (external audience, limited time)

## Technical Notes

### Google Slides API gotchas:
1. **Object IDs must be 5+ characters** — `s0` fails, use `slide_00`
2. **BLANK layout slides don't have notes shapes** — can't write to `${pageId}_notes`
3. **Speaker notes** require fetching presentation after creation to get auto-generated shape IDs
4. **Batch limit**: ~500 requests per batch is safe, split larger payloads
5. **Cards/highlight boxes don't exist as primitives** — build from: rounded rectangle (background) + rectangle (accent bar) + text box (content)

### Building visual components from API primitives:
- **Card**: `ROUND_RECTANGLE` with `#16213e` fill + `NOT_RENDERED` outline
- **Highlight box**: 4pt `RECTANGLE` (orange) + `RECTANGLE` (dark bg) + `TEXT_BOX` (content)
- **Image placeholder**: `ROUND_RECTANGLE` with dashed outline + centered text label
- **Title bar**: full-width `RECTANGLE` (primary color) + white bold text

## Anti-Pattern
- Generating slides generically, then patching with placeholder overlay script, then rebuilding from scratch = 3 attempts when 1 custom build would have sufficed
- Check visual fidelity BEFORE showing to the user
