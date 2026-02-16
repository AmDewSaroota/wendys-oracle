# Handoff: SWT Function-Detail Slides

**Date**: 2026-02-16 11:56
**Context**: Smart Tourism Web Application — presentation for client

## What We Did
- สร้าง Dense Heatmap (572 sensors) บน floor plan `width_1600.png` — 3 iterations จน entry zones ครบ
- สร้าง PPTX 15 slides ด้วย python-pptx — เขียนใหม่ทั้งหมดหลังเข้าใจว่า 3 บริษัท
- เพิ่ม mockup placeholder slides 3 หน้า (Web App, Kiosk, Revenue/Report)
- DewS ส่ง high-res chart 3 ภาพ — อ่าน function ทุกอันได้แล้ว

## Pending
- [ ] **อัพเดท PPTX ด้วย function details ทุก module** — งานหลักที่ค้าง
- [ ] ทดสอบ PPTX ใน PowerPoint จริง (VS Code แสดงแค่ 6 slides)
- [ ] DewS จะเตรียม screenshots demo มาใส่ mockup slides

## Next Session
- [ ] อ่าน high-res chart อีกรอบ (DewS ส่ง 3 ภาพ inline ใน chat ก่อน context หมด)
- [ ] อัพเดท `generate_pptx.py` — เพิ่ม slides ที่แสดง function ทุกอันของแต่ละระบบ:
  - **Core Dashboard**: IoT Analytics, Staff & Vendor mgmt, Auth กลาง
  - **Auth Service (SSO)**: Login/Register, Token/Verify, Role Management
  - **ตู้ Kiosk Frontend**: AI Character, Voice หลายภาษา, Tourism/EVENT info, Route Finder, Emergency call, Train Sch, Station Map
  - **Kiosk API Backend**: AI/LLM Engine, Voice(STT/TTS), FAQ/Tourism Info
  - **Admin Dashboard Frontend**: Kiosk Management (Ad/Popup/MA/Analytics), LiveWalk HeatMap(IoT), Walk Path Location(IoT)
  - **Admin API Backend**: Kiosk Config, Staff Management
  - **LiveWalk API Backend**: LiveWalk HeatMap, Walk Path Location, Indoor Detect Device
  - **Mobile Web/App Frontend**: iOS/Android, ThaiD/Login, จองตั๋วรถไฟ, Train Sch, จองทัวร์, History, Mini-Chatbot, Notification, Favorites, Navigation, Point/Reward, คืนเงิน
  - **App API Backend**: Navigation, Notification, User DATA
  - **(ทีมอื่น) Space System**: Space Mgmt API, Backoffice, IFrame/Webview, Price Tier, API Static
  - **(ทีมอื่น) IoT API**: Data Ingestion, Analytics
- [ ] Regenerate PPTX and verify all slides render correctly

## Architecture (CRITICAL — 3 teams)
- **ทีมเรา (Radical Enlighten)**: Core Dashboard + Core DB + Kiosk & Web App
- **ทีมอื่น**: Space Management → feeds data to Core DB
- **ทีมอื่น**: IoT People Counting → feeds data to Core DB
- Core DB = ศูนย์กลาง, ออก Auth ให้ทุกระบบ

## Key Files
- `ψ/active/generate_pptx.py` — PPTX generator (15 slides currently)
- `ψ/active/SWT-CoreDashboard-Kiosk.pptx` — Generated presentation
- `ψ/active/generate_booth_heatmap.py` — Heatmap generator (572 sensors)
- `ψ/active/heatmap_sensor_coverage_18.png` — Clean heatmap output
- `ψ/active/SWT.png` — Architecture chart (low-res, use high-res from DewS)
- `ψ/active/width_1600.png` — Floor plan base image
- `ψ/active/swt-presentation-slides.md` — Markdown slides (outdated, PPTX is latest)

## Notes
- DewS ใช้ "ค่ะ" — WEnDyS เป็นผู้หญิง
- DewS เห็นแค่ 6 slides ใน VS Code — อาจเป็น preview limitation, เปิด PowerPoint จริงจะเห็นครบ
