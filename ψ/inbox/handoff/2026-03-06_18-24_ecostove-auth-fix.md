# Handoff: EcoStove Dashboard — Auth Session Fix

**Date**: 2026-03-06 18:24
**Context**: 40%

## What We Did
- ดำเนินการตาม plan จาก session ก่อน (fix auth + data loading)
- **Step 1**: เอา DEBUG bypass ออกจาก `promptAdmin()` (ทำใน session ก่อน)
- **Step 2**: เปลี่ยน DOMContentLoaded auth check จาก `getUser()` → `refreshSession()`
  - ถ้า refresh สำเร็จ → ใช้ token ใหม่ + checkAdminRole
  - ถ้า refresh fail → signOut + clearSupabaseSession (ล้าง localStorage)
  - ผลลัพธ์: หลัง refresh browser → token ใหม่ทำงาน หรือ fallback เป็น anon ได้ปกติ
- **Step 3**: แก้ `loginAdmin()` — เอา signOut ก่อน signIn ออก (ทำให้ onAuthStateChange race)
  - ใช้ `clearSupabaseSession()` ล้าง localStorage แทน (ไม่ trigger event)
  - เพิ่ม timeout 10 วินาที ป้องกัน signIn hang
  - ถ้า login fail → clearSupabaseSession ล้างให้สะอาด
- **Step 4**: Deploy สำเร็จ → `biomassstove.vercel.app` (live)
- แก้ `logoutAdmin()` เพิ่ม clearSupabaseSession fallback

## Pending
- [ ] **ทดสอบกับ DewS** — ยังไม่ได้ทดสอบจริง (DewS ต้องลอง login, refresh, Guest mode)
- [ ] **Chrome ที่เคยพัง** — DewS ต้องล้าง cache แล้วทดสอบใหม่
- [ ] **Admin panel data** — tabs subjects/volunteers/devices/projects อาจยังไม่แสดงถ้า login ไม่ผ่าน RLS
- [ ] **ปัญหา RLS INSERT** — ถ้า login สำเร็จแต่ INSERT ยังพัง ต้องตรวจว่า admin_users มี record ตรงกับ auth_id ของ DewS

## Next Session
- [ ] ให้ DewS ทดสอบ 4 กรณี: Chrome Guest, Chrome ปกติ (ล้าง cache), Edge, login→refresh
- [ ] ถ้า login ยังไม่ได้ → debug ด้วย dev-browser หรือ console log
- [ ] ถ้า admin panel data ไม่แสดง → ตรวจ `loadAdminData()` + `switchAdminTab()` logic
- [ ] ถ้า INSERT fail → verify `admin_users` table มี auth_id = `d8360959-e28d-4514-a4b2-98d49e7f67d5`

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — dashboard (changed: lines ~660, ~1417-1443, ~1446-1451, ~3619-3632)
- `lab/tuya-ecostove/migrations/006_auth.sql` — RLS policies (reference)
- `ψ/inbox/handoff/2026-03-06_17-00_ecostove-dashboard-debug.md` — previous handoff

## Changes Summary
| Location | Before | After |
|----------|--------|-------|
| DOMContentLoaded auth | `getUser()` | `refreshSession()` + clearSupabaseSession fallback |
| loginAdmin() | `signOut()` then `signIn` | `clearSupabaseSession()` then `signIn` + 10s timeout |
| logoutAdmin() | just `signOut()` | `signOut()` + `clearSupabaseSession()` |
