# Handoff: EcoStove — Config Externalization + Deployment Planning

**Date**: 2026-02-26 15:30
**Context**: 85%

## What We Did

### Code Changes
- **config.json** — ย้าย credentials ออกจาก sensor-monitor.js (Tuya ID/Secret, Supabase, devices, port, intervals, auto-start settings)
- **config.example.json** — Template สำหรับ deployment ใหม่
- **.gitignore** — เพิ่ม config.json ป้องกัน commit credentials
- **sensor-monitor.js** — อ่านจาก config.json + error message ถ้าไม่มี config + CONFIG flags สำหรับ autoOpenBrowser/autoStartCollection
- **ecosystem.config.js** — PM2 config file (พร้อมใช้เมื่อติดตั้ง PM2)
- **ecostove-deployment-plan.html** — สไลด์ 9 หน้าสรุปแผนติดตั้ง

### Planning & Design (ยังไม่ได้ code)
- **Session Management Design** — baseline 10 นาที + collection 2 ชม. + cooldown 5 ชม.
- **Offline Handling** — ดับ <10 นาที = ต่อ, >10 นาที = เริ่มใหม่ tag "incomplete"
- **Roles Clarification** — อาสา = ผู้ช่วยอาจารย์, กลุ่มตัวอย่าง = ชาวบ้าน
- **Infrastructure Decision** — Oracle Cloud Free / NIPA Cloud 135 ฿/เดือน + Supabase (keep) + LINE Messaging API
- **LINE Notify ปิดแล้ว** — ใช้ LINE Messaging API แทน (200 msg/เดือนฟรี)
- **SQL Cleanup Plan** — ตัด columns ซ้ำซ้อน, ยุบ volunteers table, เพิ่ม sessions + daily_summaries tables
- **Admin Cleanup Plan** — ตัด manual entry/file upload/QR/activity log, รวมอาสาเข้า subjects
- **Dashboard Plan** — เพิ่ม Session Timeline, Daily Summary, Batch Approve, Admin Config page

## Pending
- [ ] คุยกับ อ.แก้ว (สไลด์ + คำถาม 12 ข้อ พร้อมแล้ว)
- [ ] ทำสไลด์สรุปใหม่ (ฉบับ updated หลัง brainstorm ทั้ง session)
- [ ] SQL migration — สร้าง sessions + daily_summaries tables, cleanup pollution_logs
- [ ] Code session management ใน sensor-monitor.js
- [ ] ปรับ Dashboard (เพิ่ม session view, batch approve, admin config)
- [ ] LINE OA + Messaging API setup
- [ ] เลือก + เซ็ต server (Oracle Cloud / NIPA)
- [ ] ซื้อ domain .org
- [ ] PM2 install + setup
- [ ] คู่มือเซนเซอร์ (ชาวบ้าน + อาสา) — ต้อง research ปุ่มเซนเซอร์ก่อน
- [ ] คู่มือ Tuya recovery สำหรับอาจารย์

## Next Session
- [ ] ทำสไลด์สรุปใหม่ให้อาจารย์ (ฉบับสมบูรณ์ หลัง brainstorm)
- [ ] SQL migration script สำหรับ Supabase
- [ ] Code session management (per-device state machine)
- [ ] ปรับ Dashboard HTML

## Key Files
- `lab/tuya-ecostove/sensor-monitor.js` — Main server (updated: config.json support)
- `lab/tuya-ecostove/config.json` — Credentials (gitignored)
- `lab/tuya-ecostove/config.example.json` — Template
- `lab/tuya-ecostove/ecosystem.config.js` — PM2 config
- `lab/tuya-ecostove/ecostove-deployment-plan.html` — Deployment slides v1
- `lab/tuya-ecostove/ecostove-with-sensor.html` — Main dashboard (needs update)
- `ψ/memory/logs/info/2026-02-26_14-30_ecostove-session-management-design.md` — Session design FYI

## Key Decisions Made
- Collection interval: ยืน **5 นาที** (ตามที่ตกลงกับอาจารย์)
- เซนเซอร์ที่นับ: **MT13W เท่านั้น** (MT29 เพี้ยน ไม่นับ) — มีจริง 1 ตัว ต้องซื้อเพิ่ม 9
- Server: **NIPA Cloud 135 ฿/เดือน** ถ้าไม่สะดวกบัตรเครดิต (Oracle Cloud Free ถ้าสะดวก)
- LINE: **Messaging API** (LINE Notify ปิดแล้ว 31 มี.ค. 2025)
- Domain: **.org**
- NDF ไม่มี domain เป็นของตัวเอง
