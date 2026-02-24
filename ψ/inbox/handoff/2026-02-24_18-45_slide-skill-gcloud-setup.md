# Handoff: /slide Skill Registration + Google Cloud API Setup

**Date**: 2026-02-24 18:45
**Context**: 70%

## What We Did
- Registered `/slide` skill in `.claude/skills/slide/SKILL.md` with `user-invocable: true` — ใช้ `/slide` ได้แล้ว
- Committed slide skill source to `.claude/sync/global-skills/slide/` (scripts, themes, layouts, auth, types)
- Created 14-slide JSON for "NDF Smart Tourism Platform for SRT" (NDF theme, mixed TH/EN)
- Generated HTML preview: `.claude/sync/global-skills/slide/tmp/preview-2026-02-24T07-38-56.html`
- **Google Cloud setup via dev-browser (Extension Mode) — COMPLETED**:
  - Created project "WEnDyS Slide" (`wendys-slide`)
  - Enabled Google Slides API
  - Enabled Google Drive API
  - Created OAuth consent screen (External, testing)
  - Created OAuth client (Desktop): `294497083571-26mvr2caehuedn49jprm79srdin1oh9d.apps.googleusercontent.com`
  - Extracted client secret, wrote `~/.config/wendys-slide/credentials.json`
  - Added `dews.cnx@gmail.com` as test user
- Ran `setup.ts` — waiting for OAuth browser consent (DewS needs to click "Allow" in Chrome)

## Pending
- [ ] Complete OAuth authorization — DewS ต้องกด Allow ใน Chrome ที่ popup ขึ้นมา (หรือ re-run `npx tsx scripts/setup.ts` ใน `.claude/sync/global-skills/slide/`)
- [ ] **แก้สไลด์หน้า 37-41** ของ `1dVI8UzR5DgMtvJeNw4neUfIwyCWSZ8IacM-8xP21Nhs` — Mobile Web App ข้อดีเทียบ D-Ticket
- [ ] Push 2 commits ที่ ahead (c795833, cc36b99)

## Next Session
- [ ] Re-run `cd .claude/sync/global-skills/slide && npx tsx scripts/setup.ts` → authorize in browser
- [ ] View slides 37-41 of existing presentation to understand current layout
- [ ] Design 5 new slides (37-41) based on DewS's content brief:
  1. **Unified Experience** — Smart Routing + Connecting Train
  2. **Speed & Reliability** — Guest-First Access + One-Click Booking
  3. **Real-time Transparency** — Punctuality Status + Live Tracker
  4. **Spatial Intelligence** — Platform Navigator + Distance Indicator
  5. (Cover/summary for the section)
- [ ] Use Google Slides API to update the presentation
- [ ] Open slides in browser for DewS
- [ ] Demo URLs to reference: https://swt-mobile.vercel.app/ (mobile) + https://thai-rail-web-repo.vercel.app/ (web)

## Key Files
- `.claude/skills/slide/SKILL.md` — registered skill (user-invocable)
- `.claude/sync/global-skills/slide/` — skill source code
- `.claude/sync/global-skills/slide/tmp/slides-20260224.json` — NDF SRT slides JSON
- `~/.config/wendys-slide/credentials.json` — Google OAuth credentials
- Presentation: `https://docs.google.com/presentation/d/1dVI8UzR5DgMtvJeNw4neUfIwyCWSZ8IacM-8xP21Nhs/edit`

## DewS Notes
- DewS รู้สึกมึนระหว่าง session แล้วกลับมาต่อ
- ต้องการระบบ fully automated — เวนดี้ทำทุกอย่างให้ พอ DewS มาดูเห็น Google Slides เปิดรออยู่แล้ว
- Extension Mode (dev-browser) ทำงานได้ดีกว่า Standalone สำหรับ Google services (เพราะ login อยู่แล้ว)
