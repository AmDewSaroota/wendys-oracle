# Handoff: SWT Feature Slides Expanded (5 → 12 slides)

**Date**: 2026-02-25 00:10
**Context**: ~70%

## What We Did
1. Analyzed all 7 SWT features for feasibility — what we can build vs what needs SRT data/API
2. Expanded PPTX from 5 → 12 slides by adding 7 individual feature slides with mockups:
   - Slide 3: Smart Routing — phone mockup with direct + hub connection route results
   - Slide 4: Availability-First — phone mockup with interactive seat map grid
   - Slide 5: Real-time Status — phone mockup with train tracking timeline + delay
   - Slide 6: Tourism — phone mockup with 3 tour package cards
   - Slide 7: RailBot AI — phone mockup with chat conversation + quick replies
   - Slide 8: Loyalty System — phone mockup with Gold tier + rewards catalog
   - Slide 9: Station Map — browser mockup with floor plan + navigation
3. Added Slide 10: "Implementation Readiness" feasibility table (✅ พร้อม / ⚡ ต้องข้อมูล / 🔗 ต้อง API)
4. Each feature slide has consistent layout: left = 4 bullets + pain→solution, right = mockup

## Pending (Interrupted)
- [ ] Slide 10 title change to English — edit was interrupted, need to re-read and apply:
  - Change: `"สิ่งที่ต้องการจาก รฟท."` → `"Implementation Readiness"`
  - Change: subtitle → `"Ready to Build vs Data Required from SRT"`
  - The Edit was attempted but file was modified — needs re-read then edit
- [ ] DewS hasn't reviewed the 12-slide PPTX yet
- [ ] Slide 3 "ตัวอย่างหน้าจอ" (overview mockups) was removed — may want it back
- [ ] Footer text on Comparison slide: removed "NDF" per DewS request, now says "SWT — Smart Tourism Platform สำหรับการรถไฟแห่งประเทศไทย"

## Next Session
- [ ] Fix slide 10 title to English (re-read file, apply edit, regenerate)
- [ ] DewS review PPTX — adjust layout/content per feedback
- [ ] Consider adding the overview mockup slide back (Web + Mobile + Dashboard on one page)
- [ ] May need to adjust font sizes or spacing if content overflows in Google Slides
- [ ] Update `ψ/inbox/focus.md` with current SWT slides status

## Key Files
- `lab/swt-slides/generate-pptx.js` — PPTX generator (12 slides)
- `lab/swt-slides/pain-solution.pptx` — Generated output
- `lab/swt-slides/package.json` — Dependencies (pptxgenjs ^4.0.1)

## Feasibility Summary (for reference)
| Feature | Status |
|---------|--------|
| RailBot AI | ✅ พร้อมพัฒนาทันที |
| Tourism | ✅ พร้อมพัฒนาทันที |
| Smart Routing | ⚡ ต้องการ Timetable Data จาก รฟท. |
| Station Map | ⚡ ต้องการ Floor Plan จาก รฟท. |
| Availability-First | 🔗 ต้องการ D-Ticket API (ยังไม่มี Public API) |
| Real-time Status | 🔗 ต้องการ GPS Tracking จากตัวรถ |
| Loyalty System | 🔗 ต้องการข้อตกลงธุรกิจ + D-Ticket API |
