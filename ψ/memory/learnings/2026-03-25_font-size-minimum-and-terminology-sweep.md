# Lesson: Font Size Minimum Policy & Terminology Sweep

**Date**: 2026-03-25
**Source**: EcoStove dashboard guide polish session
**Tags**: #ui #accessibility #terminology #css

## Pattern

When establishing a minimum font size for a project:
1. Set the rule early — retrofitting is expensive (261 changes this time)
2. Use `replace_all` confidently for small increments (1-2px won't break layouts)
3. Check with `grep text-\[([0-9]|1[01])px\]` pattern to verify nothing slips through

## Terminology Sweep Method

For comprehensive term replacement across a large file:
1. Deploy parallel Explore agents with different angles (terminology, UI labels, spelling)
2. Fix translation keys (i18n) first — they cascade to all UI
3. Then fix hardcoded strings in JS logic
4. Then fix guide/documentation text
5. Finally verify with grep that nothing remains

## CSS Positioning Lesson

When adding interactive indicators (👆, arrows) to point at specific text:
- **Don't**: Position from a distant container using calculated offsets (`right:38px`)
- **Do**: Put the indicator inside the target element with `position:relative` on parent + `position:absolute` on indicator
- This is self-contained and works regardless of container width or text alignment

## Key Decision

**EcoStove minimum font size: 12px** (text-[12px] / text-xs)
- No text-[8px], text-[9px], text-[10px], or text-[11px] allowed
- Tailwind `text-xs` (12px) is the floor
