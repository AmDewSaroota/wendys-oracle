# Handoff: BiomassStove Rename + Tuya Account Migration

**Date**: 2026-03-17 21:00
**Context**: 85%

## What We Did

### Code Review & Rename (EcoStove → BiomassStove)
- Full codebase review ด้วย 3 parallel agents — SQL migrations สะอาด 100%
- แก้ localStorage keys: `ecostove_*` → `biomass_stove_*` (index.html + volunteer.html)
- แก้ export filenames: `ecostove_*` → `biomass_stove_*` (4 instances)
- เพิ่ม cleanup lines สำหรับลบ key เก่าจาก browser ผู้ใช้

### Chart Legend ปรับใหม่ (หน้าเชิงลึก)
- Header subtitle: จากชื่อเซนเซอร์เรียงยาว → `N เซนเซอร์ · X จุดข้อมูล`
- เพิ่ม color legend strip (badges) ใต้ header — ดูจุดเดียวรู้สีทุกตัว
- ซ่อน legend ซ้ำในแต่ละ chart (tooltip ยังแสดงชื่อปกติ)
- Fix bug: `chartColors` ใช้ก่อนประกาศ → ย้ายขึ้นมาก่อน

### Stove Type Rename (ตรงกับงานวิจัย)
- เตาเดิม → **เตาดั้งเดิม** (Traditional)
- เตาประหยัด → **เตาชีวมวล** (Biomass)
- ครอบคลุม: i18n, HTML, JS strings, export headers, map labels, dropdowns

### Tuya Account Migration
- สมัคร Gmail โครงการ: `biomassstove.cmru@gmail.com`
- สมัคร Tuya IoT Platform: Access ID `8grdqadptymnyeqdduxx`
- ย้ายเซนเซอร์ทุกตัวจากบัญชีส่วนตัว DewS → บัญชีโครงการ
- เปลี่ยน `TUYA_ACCESS_ID` + `TUYA_ACCESS_SECRET` บน Vercel
- Redeploy สำเร็จ

## Pending
- [ ] เช็คว่า cron sync ทำงานปกติกับ Tuya credentials ใหม่
- [ ] Commit งานวันนี้ (ยังไม่ได้ commit)
- [ ] Invite code `ecostove2026` → เปลี่ยนเป็นชื่อใหม่มั้ย? (policy decision)
- [ ] Hotspot WiFi SSID `ECOSTOVE` → เปลี่ยนมั้ย? (ส่งผลกับเอกสารภาคสนาม)
- [ ] Local scripts (7 ไฟล์) ยังมี hardcode Tuya credentials เก่า → ย้ายไป .env
- [ ] `EcoStove Monitor.bat` / `.vbs` — rename?
- [ ] ⚠️ ตอนส่งมอบโครงการ: เปลี่ยน recovery email + เบอร์โทรใน Gmail โครงการ

## Next Session
- [ ] Verify cron sync กับ Tuya ใหม่ (ดูข้อมูลบนหน้าเว็บ)
- [ ] Commit + push งาน rename ทั้งหมด
- [ ] ตัดสินใจ invite code + hotspot SSID
- [ ] ทำความสะอาด local scripts (ย้าย credentials ไป .env)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — เปลี่ยนเยอะที่สุด (localStorage, export, labels, chart legend)
- `lab/tuya-ecostove/deploy/volunteer.html` — localStorage key rename
- Vercel env vars — TUYA_ACCESS_ID, TUYA_ACCESS_SECRET เปลี่ยนแล้ว
- Memory updated: Tuya project account credentials + handover reminder
