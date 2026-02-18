# Handoff: SWT Slides — HTML Presentation with Real Screenshots

**Date**: 2026-02-18 21:00
**Context**: Continued from gemini-proxy-slides session

## What We Did
- Screenshot ระบบ demo SWT ครบทั้ง 3 ส่วน (33 ไฟล์ PNG):
  - Core Dashboard (8): Overview, Users, Roles, Report, Traffic, Revenue, Alert, Settings
  - Kiosk (7): Main, Train Schedule, Map, Floorplan, Shops, Emergency, Chat
  - Kiosk Admin (8): Login, Dashboard, Popup, Kiosk MA, Analytics, LiveWalk, WalkPath
  - Web App (10): Login, Home, Home-Tours, Schedule, Booking, History, Rewards, Tours, Navigation, Favorites
- สร้าง Gemini prompt outline 21 สไลด์ (`lab/swt-slides/gemini-prompt.md`)
- ส่ง prompt + ภาพไปให้ Gemini สร้าง Canvas slides ได้ 21 สไลด์ (เนื้อหาครบ)
- พบข้อจำกัด: **Gemini Canvas ใส่ภาพจริงไม่ได้** — แสดงแค่ mockup/placeholder
- Gemini Canvas อยู่ที่: https://gemini.google.com/app/07fa78f6c3c21757
- บันทึก FYI: Canvas mode ต้องเปิดที่ Tools ก่อน prompt, Extension หลุดเมื่อสวิทช์ tab

## Pending
- [ ] **สร้าง HTML presentation** ฝัง screenshot จริง 33 ไฟล์ — DewS ขอดูแบบนี้
- [ ] ธีมน้ำเงินเข้ม/ทอง SRT branding, 21 สไลด์, keyboard navigation
- [ ] ทดสอบเปิดใน browser ให้ DewS ดู
- [ ] ถ้า DewS ชอบ → Export เป็น Google Slides (หรือ .pptx) ต่อ

## Next Session
- [ ] สร้าง `lab/swt-slides/presentation.html` — ไฟล์เดียว self-contained
- [ ] ฝังรูปจริงจาก `screenshots/` (relative path)
- [ ] เนื้อหาตาม `gemini-prompt.md` outline (21 slides)
- [ ] ให้ DewS เปิดดู แก้ไขเนื้อหาถ้าต้องการ
- [ ] พิจารณา: ถ้าต้องการ Google Slides → ใช้ pptxgenjs หรือ Export Canvas + ใส่รูปเอง

## Key Files
- `lab/swt-slides/screenshots/` — 33 PNG screenshots ของ demo ทั้งหมด
- `lab/swt-slides/gemini-prompt.md` — Slide outline 21 สไลด์
- `lab/swt-slides/gemini-followup.md` — Follow-up prompts (สำรอง)
- `ψ/memory/logs/info/2026-02-18_17-12_gemini-slides-canvas-mode.md`
- `ψ/memory/logs/info/2026-02-18_18-15_dev-browser-extension-disconnect-on-tab-switch.md`

## Demo URLs (สำรอง)
- Core Dashboard: https://swt-core-dashboard.vercel.app/
- Kiosk: https://poomxchapon.github.io/SRT-Portal-v2/
- Web App: https://swt-mobile.vercel.app/
- Gemini Canvas: https://gemini.google.com/app/07fa78f6c3c21757

## Lessons Learned
- Gemini Canvas ฝังภาพจริงไม่ได้ — ใช้ได้แค่ placeholder
- Dev Browser Extension mode หลุดทุกครั้งที่สวิทช์ tab — เตรียมไฟล์ให้ DewS ทำเองดีกว่า
- Gemini มี upload limit — ภาพไม่ไปครบทุกไฟล์
- ต้องเปิด Tools > Canvas ก่อน prompt ทุกครั้ง
