# Handoff: SWT Pain-Solution PPTX Slides

**Date**: 2026-02-24 22:00
**Context**: ~60%

## What We Did
- Created `lab/swt-slides/pain-solution.html` — 5-slide HTML deck (Pain Points, Solution, Mockups, Comparison, Live Demo)
- DewS couldn't copy HTML into Google Slides → pivoted to generating `.pptx` with PptxGenJS
- Created `lab/swt-slides/generate-pptx.js` — generates `pain-solution.pptx` with:
  - Shape-based browser frames (traffic lights, URL bar) + phone frames (notch, header)
  - Slide 3 has mixed mockups: 1 large browser (Web Platform), 2 phones (Mobile App + RailBot Chat), 1 small browser (Stats Dashboard)
  - Shortened all titles per DewS request
- Fact-checked tourism pain point against actual SRT websites:
  - railway.co.th HAS "ท่องเที่ยวริมทางรถไฟ" section
  - D-Ticket HAS tour booking (confirmed by DewS: expensive, no details)
  - Corrected text: "มีทัวร์จัดเฉพาะ แต่ราคาสูง ขาดรายละเอียด"
- Added `WebFetch` and `Task` to `.claude/settings.local.json` allow list

## Pending
- [ ] DewS hasn't reviewed the final PPTX output yet
- [ ] Other pain points (ticketing, data) haven't been fact-checked yet
- [ ] HTML version still has old tourism text (not priority — PPTX is the focus)
- [ ] May need design tweaks after DewS opens in Google Slides

## Next Session
- [ ] Wait for DewS feedback on PPTX quality/layout in Google Slides
- [ ] Adjust mockup sizing, colors, or content per feedback
- [ ] Fact-check remaining pain points if DewS flags inaccuracies
- [ ] Consider adding more slides if needed (e.g., architecture, timeline)

## Key Files
- `lab/swt-slides/generate-pptx.js` — PPTX generator script
- `lab/swt-slides/pain-solution.pptx` — Generated output
- `lab/swt-slides/pain-solution.html` — Original HTML version
- `lab/swt-slides/package.json` — Dependencies (pptxgenjs ^4.0.1)
