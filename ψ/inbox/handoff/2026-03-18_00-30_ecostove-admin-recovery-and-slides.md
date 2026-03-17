# Handoff: EcoStove Admin Recovery + Slides for อาจารย์

**Date**: 2026-03-18 00:30
**Context**: ~40%

## What We Did
- แก้ GitHub Secret Alert (browser-data committed) — `.gitignore` + git rm
- สร้าง handoff-form.html สำหรับอาจารย์กรอกข้อมูลโครงการ
- วิเคราะห์ระบบ Admin Auth → ตัดสินใจเพิ่ม PIN recovery
- เริ่มจาก OTP email → เปลี่ยนเป็น **Personal Recovery Code** (ไม่ต้องใช้ Resend)
- สร้าง recovery code system ครบ:
  - `forgot-pin.js` — reset PIN ด้วย email + recovery code
  - `regenerate-recovery.js` — สร้าง code ใหม่ (ต้อง login อยู่)
  - `register.js` — สร้าง recovery code ตอนสมัคร + แสดงครั้งเดียว
  - Migration 019 (OTP columns) + 020 (recovery_code column) — รันแล้ว
- แก้ admin list: ซ่อนปุ่มจัดการตัวเอง, ใช้ text i18n แทน emoji, compact layout
- ลบไฟล์เก่า: `reset-pin.js`, `request-otp.js` (OTP email flow ไม่ใช้แล้ว)
- Deploy ทั้งหมดขึ้น Vercel แล้ว

## DewS Recovery Code
- `XT6Y-FQN4` — DewS สร้างไว้แล้วตอนนี้

## Pending
- [ ] สไลด์ Flow ระบบ Login/Auth สำหรับนำเสนอทีมอาจารย์
  - Flow login, สมัคร, recovery, invite code
  - รหัสที่ใช้แต่ละอัน ใช้ยังไง กรณีไหน
  - แนบคำถามจาก handoff-form.html ท้ายสไลด์
- [ ] Google Account `biomassstove.cmru@gmail.com` ถูก disable — รอ appeal หรือสร้างใหม่
- [ ] ย้าย Vercel/Supabase/Tuya ออกจาก account ส่วนตัว DewS (blocked จน account กลับมา)
- [ ] เบอร์โทร recovery — ใช้เบอร์ DewS ช่วงทดสอบ เปลี่ยนตอนส่งมอบจริง

## Next Session
- [ ] สร้างสไลด์ HTML: Admin Auth Flow (login → register → forgot PIN → recovery code → role management)
- [ ] ใส่คำถามจาก handoff-form.html ต่อท้ายสไลด์ (ให้ทีมอาจารย์ตอบ)
- [ ] ติดตาม Google Account appeal → วาง Plan B ถ้าไม่คืน
- [ ] ทดสอบ forgot-pin flow end-to-end (DewS ลอง logout แล้ว reset ด้วย recovery code)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — main dashboard + admin UI
- `lab/tuya-ecostove/deploy/api/admin/forgot-pin.js` — PIN reset with recovery code
- `lab/tuya-ecostove/deploy/api/admin/regenerate-recovery.js` — regenerate recovery code
- `lab/tuya-ecostove/deploy/api/admin/register.js` — registration with recovery code
- `lab/tuya-ecostove/deploy/handoff-form.html` — form for อาจารย์
- `lab/tuya-ecostove/migrations/020_recovery_code.sql` — recovery_code column
