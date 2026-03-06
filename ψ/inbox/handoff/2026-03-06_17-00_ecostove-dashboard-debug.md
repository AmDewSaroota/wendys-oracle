# Handoff: EcoStove Dashboard Debug — Auth + RLS

**Date**: 2026-03-06 17:00
**Context**: 60%

## What We Did
- วิเคราะห์ปัญหา dashboard พังหลังรีเฟรช (data ไม่แสดง, dropdown กดไม่ได้, login ไม่ได้)
- เพิ่ม `.hidden { display: none; }` CSS fallback ป้องกัน Tailwind CDN ล่ม
- เพิ่ม Supabase auth session validation (getUser แทน getSession) + signOut ถ้า token หมดอายุ
- เพิ่ม auth error recovery ใน loadData() — retry as anon ถ้า JWT error
- แก้ loginAdmin() — signOut ก่อน signIn + try-catch ป้องกัน hang
- เพิ่ม try-catch ใน onAuthStateChange + checkAdminRole
- Deploy 3 รอบ, ทดสอบกับ DewS

## Root Cause Found (ยังแก้ไม่เสร็จ)
1. **Supabase auth session + RLS** — ตัวหลัก:
   - หลัง login → token เก็บใน localStorage
   - รีเฟรช → token หมดอายุ → query ส่ง expired JWT → PostgREST return 401 (ไม่ fallback เป็น anon)
   - ทุก query ล้มเหลว → ไม่มีข้อมูลแสดง
2. **RLS INSERT policies** ต้อง `is_admin()` (auth.uid()) → bypass login ทำให้ INSERT fail
3. **Admin panel data** — tabs สำหรับ subjects/volunteers/devices/projects render จาก global variables (`devices`, `KNOWN_SENSORS`, etc.) ที่ load ตอน init → ถ้า loadData fail → ไม่มี data ให้ render

## Current State (DEBUG MODE ON)
- `promptAdmin()` มี DEBUG bypass — เข้า admin ตรงไม่ต้อง login
- **ต้องเอา DEBUG ออก** ก่อน production!

## Pending
- [ ] **แก้ root cause จริง**: Supabase auth session ต้อง refresh token ให้ถูกต้องก่อน query
- [ ] **ทางเลือก**: ล้าง Supabase localStorage ก่อน init → force fresh start ทุกครั้ง (เสีย UX แต่แก้ปัญหาได้)
- [ ] **ทางเลือกดีกว่า**: ใช้ `supabaseClient.auth.refreshSession()` ก่อน query ใดๆ
- [ ] **เอา DEBUG bypass ออก** จาก promptAdmin()
- [ ] **ทดสอบ login flow** ใน Chrome (ล้าง cache) + Guest mode + Edge
- [ ] **Admin tab data loading** — subjects/volunteers/devices ไม่โหลดใน admin panel (render functions depend on global data loaded during init)

## Key Findings
- RLS policies ถูกต้อง: SELECT = `USING (true)` ทุก table, INSERT = `is_admin()`
- `is_admin()` function ใช้ `auth.uid()` → ต้อง login จริง (ไม่ใช่ JS bypass)
- Migration files: `migrations/006_auth.sql` + `007_admin_role.sql`
- Dashboard URL: `https://biomassstove.vercel.app`
- Vercel project: `ecostove-cmru` (team: dewss-projects)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — dashboard (3535 lines, monolithic)
- `lab/tuya-ecostove/migrations/006_auth.sql` — RLS policies
- `lab/tuya-ecostove/deploy/api/sync.js` — Tuya sync (uses service_role key, bypasses RLS)

## Approach for Next Session
1. เอา DEBUG bypass ออก
2. แก้ auth flow: ก่อน `DOMContentLoaded` load data → เรียก `refreshSession()` ก่อน
3. ถ้า refresh fail → `signOut()` + clear localStorage manual
4. ถ้ายังไม่ได้ → พิจารณาใช้ service_role key ฝั่ง client สำหรับ read-only (ไม่แนะนำ security)
5. Deploy + ทดสอบกับ DewS
