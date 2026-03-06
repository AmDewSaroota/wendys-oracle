# Handoff: EcoStove Dashboard — Map Icons + Form UX + Auth Loading Fix

**Date**: 2026-03-06 22:30
**Context**: 45%

## What We Did

### 1. Map Icon Enhancement
- บ้านไม่มีเซนเซอร์ เปลี่ยนจากจุดส้มเล็ก 12px เป็นวงกลม 24px + emoji 🔥
- ทั้ง basic map และ deep map
- Legend อัพเดทให้ขนาดจุดตรงกัน + มี emoji

### 2. Form UX — Conditional Sensor Fields
- ฟอร์มเพิ่ม/แก้ไขบ้าน: ย้าย checkbox "มีเซนเซอร์" ขึ้นก่อน
- ติ๊กเลือกแล้วค่อยโผล่ฟิลด์ Connectivity (WiFi/Hotspot) + เลือกอาสา
- ทั้ง showAddSubjectModal + editSubject

### 3. Loading Overlay Fix
- ห่อ init ด้วย try/finally — hideLoading ถูกเรียกเสมอ
- showLoading เรียก hideLoading ก่อน ป้องกัน overlay ซ้อน
- Safety timeout 5 วินาที — overlay auto-hide

### 4. Performance — Parallel Queries
- Init: loadRegisteredSensors + loadData ทำพร้อมกัน
- loadAdminData: devices, volunteers, subjects, projects, subject_projects query พร้อมกัน (จากเดิม sequential)

### 5. Auth Token Refresh Handler
- เพิ่ม onAuthStateChange → reload data ตอน TOKEN_REFRESHED / SIGNED_IN
- เพื่อแก้ปัญหาข้อมูลไม่ขึ้นหลัง refresh page ตอน logged in

## Pending
- [ ] **BUG: ข้อมูลไม่ขึ้นหลัง refresh ตอน logged in** — ยังไม่แก้ 100%
  - สาเหตุ: Supabase client ส่ง expired JWT ตอนโหลดหน้า → query ถูก reject
  - onAuthStateChange + TOKEN_REFRESHED reload อาจช่วยได้ — ยังไม่ได้ทดสอบ
  - ถ้ายังไม่ได้: ต้อง handle ที่ loadData → ถ้า error เป็น JWT → retry โดยไม่ส่ง auth
- [ ] ปุ่มเพิ่มบ้านกลุ่มตัวอย่าง — DewS รายงาน "กดไม่ไป" (อาจเกี่ยวกับ overlay ค้าง ต้องเทสอีกที)

## Next Session
- [ ] ทดสอบ login → refresh → ข้อมูลขึ้นมั้ย (หลังเพิ่ม TOKEN_REFRESHED handler)
- [ ] ถ้ายังพัง: implement retry logic ใน loadData — ถ้า error มี "JWT" → sign out แล้ว retry
- [ ] ทดสอบปุ่มเพิ่มบ้านกลุ่มตัวอย่าง
- [ ] Deploy ตัวสุดท้ายที่ work

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard หลัก (แก้ทุกอย่างในไฟล์นี้)
- `lab/tuya-ecostove/migrations/006_auth.sql` — RLS policies (SELECT = USING(true) ทุกตาราง)

## Technical Notes
- **ห้าม signOut() ใน init** — ทำให้ล็อกอินไม่ได้ (เรียน session นี้)
- Supabase getSession() อาจ return expired JWT โดยไม่ refresh ทันที
- onAuthStateChange event: INITIAL_SESSION, TOKEN_REFRESHED, SIGNED_IN, SIGNED_OUT
- dataLoaded flag ใช้เช็คว่าเคยโหลดแล้วหรือยัง ก่อน reload
