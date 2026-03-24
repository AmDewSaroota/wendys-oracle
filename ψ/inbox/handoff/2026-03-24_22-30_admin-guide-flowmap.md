# Handoff: Admin Guide + Flow Map

**Date**: 2026-03-24 22:30
**Context**: ~100 turns

## What We Did

### Guide & Documentation
- Fixed FAQ entry "ยังไม่มีข้อมูลเตาชีวมวล" — clarified it's **normal status** (phase 1 = old stove, phase 2 = eco), not an error to fix
- Fixed print CSS — search box hidden, reduced padding so first section shows on page 1
- Changed "ปิดทั้งหมด" → "พับทั้งหมด" button label
- Added **synonym search** (15 groups) — Thai/English keywords both work: "พิน"→PIN, "เซนเซ่อ"→sensor, "อาสา"→volunteer, etc.
- Expanded search placeholder with more keyword examples

### Flow Map (NEW — `guide-flowmap.html`)
- Created standalone **Flow Map page** with 9 admin workflows
- Each flow has: step diagram + **realistic mockup** matching dashboard UI
- Mockups use real dashboard colors (#064e3b nav, glass cards, Chakra Petch, real badge styles)
- Fixed volunteer + device mockups from table → **card layout** to match actual UI
- Deployed to: `https://biomassstove.vercel.app/guide-flowmap.html`

### Previous Session (carried over)
- Committed P2 code review fixes
- Tested all APIs on production (sync, admin auth, role guard, CORS)
- Added admin guide content to dashboard (A0-A6 sections)
- Deployed everything to Vercel

## Pending

- [ ] **Collection Period mockup** — DewS noticed mockup uses table but real UI uses card-group-by-house. She thinks table format might be easier → **decision pending** whether to change real UI (layout-locked page!)
- [ ] **Commit this session's work** — index.html changes + guide-flowmap.html (uncommitted)
- [ ] DewS to **set collection periods** via dashboard batch setup (old stove, 2026-03-30 → 3 months)
- [ ] DewS to **clear test data** from Supabase before admin team joins
- [ ] **UAT next week** — professor confirmed

## Next Session

- [ ] Get DewS decision on collection period UI (keep card or switch to table)
- [ ] If changing: update `renderPeriodsList()` in index.html — **reminder: layout-locked page**
- [ ] Update flowmap mockup for collection period to match whichever decision
- [ ] Commit + deploy all pending changes
- [ ] Pre-UAT checklist: verify all 12 sensors responsive, test volunteer page e2e
- [ ] Any final tweaks from DewS reviewing the flow map

## Key Files

- `lab/tuya-ecostove/deploy/index.html` — main dashboard (guide content, search, print CSS)
- `lab/tuya-ecostove/deploy/guide-flowmap.html` — **NEW** flow map page (9 flows + mockups)
- `lab/tuya-ecostove/deploy/guide-volunteer.html` — volunteer guide (reference style)

## Decision Log

- **Collection Period UI**: DewS said mockup table looks easier than real card layout → needs decision before changing (layout-locked page)
- **Recovery Code**: one-time use, nullified after PIN reset, must regenerate manually
- **Sensor saturation**: fixed by calibrating 3 times (all 8 recovered)
