# CSS Mockups in Presentation Slides

**Date**: 2026-03-17
**Context**: Building auth flow presentation for EcoStove project team

## Pattern

When creating HTML slides to explain a system's UI, build **CSS mockups** of the actual interface instead of using screenshots or generic diagrams.

## How

1. Study the real UI code — extract actual classes, colors, border-radius, spacing
2. Create simplified `.mock-*` CSS classes that mirror the real styling
3. Use a split layout: explanation/flow on left, mockup on right
4. Include realistic placeholder data (dots for PIN, sample codes, real button labels)

## Why It Works

- Scales perfectly across screen sizes (unlike screenshots)
- Matches the slide theme automatically (same font, same CSS variables)
- No browser automation or screenshot tools needed
- Editable — can adjust instantly when UI changes
- Tells the story visually — forms and buttons speak louder than bullet points

## Key Implementation

```css
.split { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
.mockup { background: #fff; border-radius: 24px; padding: 28px 24px; box-shadow: ...; }
.mock-input { border-radius: 14px; border: 1.5px solid #e2e8f0; text-align: center; }
.mock-btn { border-radius: 14px; font-weight: 700; color: #fff; }
```

## Tags

`presentation`, `css`, `mockup`, `slides`, `ui-communication`
