# Print CSS: Surgical Breaks Beat Blanket Rules

**Date**: 2026-04-07
**Context**: EcoStove guide print layout — mockup images getting cut across pages

## Pattern

When fixing print layout with `break-inside: avoid`:

**Wrong approach** — Blanket rule on large containers:
```css
.guide-section { break-inside: avoid; }  /* Section too large = pushes everything to next page */
```

**Right approach** — Surgical rules on small, atomic elements:
```css
.guide-mock { break-inside: avoid; }      /* Individual mockup image */
.guide-important { break-inside: avoid; } /* Warning/tip box */
.print-mock-group { break-inside: avoid; } /* Label + mockup pair */
.guide-header { break-after: avoid; }     /* Keep header with first content */
```

## Key Insight: Sibling Elements Need Wrapping

If a label and its content are separate DOM siblings:
```html
<p>ตัวอย่างหน้าจอ:</p>  <!-- Can be on page 1 -->
<div class="mockup">...</div>  <!-- Falls to page 2 -->
```

Solution: Dynamically wrap them together before printing:
```javascript
// In printGuide(), wrap label+mockup pairs
const wrapper = document.createElement('div');
wrapper.className = 'print-mock-group';
label.parentNode.insertBefore(wrapper, label);
wrapper.appendChild(label);
wrapper.appendChild(mockup);
```

## Also Learned

- **Audit ALL DOM variants** before CSS fix — some mockups used plain `<div>` without class
- **Browser print can't do page numbers** — `@page { @bottom-center }` not supported in Chrome
- **TOC without page numbers** is still useful as a visual index for structure

## Tags
`css`, `print`, `page-break`, `break-inside`, `dom-wrapping`
