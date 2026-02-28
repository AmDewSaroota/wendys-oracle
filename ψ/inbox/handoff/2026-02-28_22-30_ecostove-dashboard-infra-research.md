# Handoff: EcoStove Dashboard Polish + Infra Research

**Date**: 2026-02-28 22:30
**Context**: ~60%

## What We Did

### Dashboard UX (deploy/index.html) — deployed to biomassstove.vercel.app
- ลบ TVOC ออกจาก Excel export (ไม่มี CO/TVOC cards อยู่แล้ว)
- Session status เป็นภาษาไทย: complete→ครบ, incomplete→ไม่ครบ, collecting→กำลังเก็บ, baseline→ตั้งต้น, cancelled→ยกเลิก
- Admin login log — ทุก activity บันทึกชื่อ admin (user field) + แสดง 👤 ชื่อ ในประวัติกิจกรรม
- แผนที่ popup เพิ่มข้อมูล: ประเภทเตา, วิธีเชื่อมต่อ (WiFi/Hotspot), ชื่ออาสา
- หมายเหตุสถานะความสมบูรณ์ → เปลี่ยนเป็น `<details>` พับได้ ตัวเล็กลง
- Approval cards แยก 3 สถานะ: 🔄 กำลังเก็บ (น้ำเงิน กระพริบ) / ✓ ครบ (เขียว) / ⚠ ไม่ครบ (แดง + บอกเวลาหยุด)

### Database
- Migration 001-003 รันครบแล้วใน Supabase SQL Editor
- MT29 data ทั้งหมด → UPDATE stove_type = 'old' (แก้ข้อมูลเก่าที่ผิด)

### Slides (ecostove-meeting-ajkaew.html)
- Slide 4 อัปเดต: Oracle Cloud → GitHub Actions, เพิ่ม storage info (80 MB / 500 MB = 16%)

### Infra Research
- Oracle Cloud: สมัครไม่ได้ (บัตรไทยถูกปฏิเสธ)
- Research เปรียบเทียบ 10 platforms: Render ($7), Railway ($5), Fly.io (ไม่ฟรี), Google Cloud (ฟรีแต่ US only), GitHub Actions (ฟรี), Cloudflare Workers (CPU limit 10ms ไม่พอ)
- **ตัดสินใจ: GitHub Actions cron** — ฟรี 100%, ไม่ต้องสมัคร service ใหม่
- Delay 1-5 นาทีไม่มีผลกับ air quality data

### LINE OA
- วิเคราะห์ว่า sensor online 04:00-21:00 (17 ชม.) → ต้อง daemon/cron 24/7
- คำนวณ API limits: Free plan (~90 msg/เดือน) เพียงพอสำหรับ push ถึงอาจารย์

## Pending
- [ ] ตั้ง GitHub Actions cron สำหรับ sync_to_supabase.js (public repo ใหม่)
- [ ] ทดสอบ LINE OA full flow (cron เช้า/เย็น)
- [ ] ตัดสินใจ LINE plan (Free vs Light) กับอาจารย์
- [ ] ลงทะเบียน 10 sensors + ข้อมูลบ้าน (รออาจารย์)
- [ ] Deploy slides ขึ้น Vercel (ถ้าต้องการ)

## Next Session
- [ ] สร้าง public repo สำหรับ sync daemon + GitHub Actions workflow
- [ ] ทดสอบ GitHub Actions cron ทำงานจริง
- [ ] ทดสอบ LINE OA morning/evening cron
- [ ] เตรียมข้อมูลสำหรับประชุมอาจารย์แก้ว

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard SPA (deployed)
- `lab/tuya-ecostove/sync_to_supabase.js` — Sync daemon (จะย้ายไป GitHub Actions)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์ประชุม
- `lab/line-oa/` — LINE OA cron (Vercel)
- `lab/tuya-ecostove/migrations/` — SQL migrations 001-003 (รันแล้ว)

## Architecture Decision
```
Tuya Cloud → GitHub Actions (cron 5 min) → Supabase → Vercel (Dashboard + LINE OA)
ค่าใช้จ่าย: ฿0/เดือน ทั้งหมด
Storage: 10 sensors × 6 เดือน = ~80 MB (16% ของ 500 MB free tier)
```
