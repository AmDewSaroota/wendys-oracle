# PPTX Split Screen Dashboard Mockups

**Date**: 2026-02-25
**Source**: Kiosk Admin 2-Tier slides session
**Tags**: pptx, pptxgenjs, mockup, dashboard, presentation, role-comparison

## Pattern: Split Screen Role Comparison

When comparing two user roles in a presentation, the **side-by-side split screen** is the most effective layout:

1. **Vertical divider** with VS badge in the center
2. **Role header badges** at top of each column (color-coded: purple for Super, blue for Station)
3. **Multiple function rows** per column — same screen layout, different content
4. **Visual cues for restrictions**: dashed borders for "not available", strikethrough for hidden items, lock icons for locked fields

## Pattern: Targeting Lock UX

For multi-tenant admin dashboards:
- **Super Admin**: Dropdown with all options + "✓ เลือกได้อิสระ" badge
- **Station Admin**: Fixed badge (no dropdown) + "🔒 Fixed" indicator + "🔒 Targeting Lock" warning
- Hidden items shown as greyed-out strikethrough rows with "Hidden" status

## Technical: pptxgenjs Browser Frame

```
// Browser chrome pattern
roundRect (card) → rect (title bar, e8ebef) → 3x ellipse (traffic dots) → text (title)
```

Coordinates cheat sheet for LAYOUT_WIDE (13.33 x 7.5):
- Left column: x=0.35, w=5.95
- Right column: x=6.75, w=5.95
- Divider: x=6.55
