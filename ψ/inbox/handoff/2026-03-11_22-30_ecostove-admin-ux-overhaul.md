# Handoff: EcoStove Admin Dashboard UX Overhaul

**Date**: 2026-03-11 22:30
**Context**: ~40%

## What We Did

### Bug Fixes
- **Auth lock fix** — ลบ block ที่ clear localStorage ก่อน createClient (ต้นเหตุ auth lock 5s + ปุ่มกดไม่ได้)
- **406 error fix** — `.single()` → `.maybeSingle()` ใน loadSyncConfig
- **Retry logic** — เพิ่ม retry 3 ชั้น (loadData 3s, onAuthStateChange 3s, fallback 8s)
- **Lock steal ลบออก** — เคยลอง navigator.locks.request steal แต่มันไปทำลาย Supabase auth ทำให้แย่ลง → ลบออกหมดแล้ว

### Tab Restructure
- "เครื่องวัด" → **"อุปกรณ์"** (ชัดเจนกว่า)
- รวม "เซนเซอร์" + "TVOC" → **"ข้อมูล"** (sub-tab: อัตโนมัติ | TVOC)
- แท็บใหม่ **"กำหนดการ"** — ย้าย API quota + sync schedule มาจาก devices tab
- ลบปุ่ม "ลงทะเบียนเซนเซอร์ใหม่" (ใช้ Tuya Cloud discovery แทน)
- "เพิ่มเครื่องวัด" → **"ผูกเซนเซอร์กับบ้าน"**
- ลบ stove_type จาก sensor registration

### Houses UX (ล่าสุด - just deployed)
- จำนวนรวมบ้าน `(N)` ในหัวแท็บ
- ฟิลเตอร์ 3 ตัว: โครงการ / อำเภอ / สถานะเซนเซอร์
- จำกัดจังหวัดเหลือ 9 จังหวัดภาคเหนือ
- ซ่อนบ้านที่ผูกเซนเซอร์แล้วจาก dropdown (1 บ้าน = 1 เซนเซอร์)

## Pending
- [ ] DewS กำลังทดสอบกรอกข้อมูลจริง — อาจมี feedback เพิ่ม
- [ ] ยังไม่ได้ commit โค้ดลง git (deploy ไป Vercel แล้วแต่ยังไม่ commit)
- [ ] อาจต้องเพิ่มฟิลเตอร์ในแท็บอื่นๆ ด้วย (อาสา, อุปกรณ์)
- [ ] Tailwind CDN warning — ยังใช้ CDN อยู่ ไม่เร่งด่วน

## Next Session
- [ ] รอ DewS feedback จากการทดสอบ — แก้ไขตามที่พบ
- [ ] อาจต้องเพิ่ม: ฟิลเตอร์ในแท็บอาสา, ภาพรวม overview ที่ดีขึ้น
- [ ] เตรียม volunteer guide (คู่มืออาสา) — ยังไม่ได้เริ่ม
- [ ] LINE OA cron — ตรวจสอบว่าสรุปเที่ยง/2ทุ่ม ทำงานถูกต้อง

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — ไฟล์เดียวทั้งหมด (~5000 lines)
- Production: https://biomassstove.vercel.app
- Vercel project: ecostove-cmru (team: dewss-projects-137fa2e4)

## Lessons Learned
- **navigator.locks.request({ steal: true })** ห้ามใช้ร่วมกับ Supabase createClient — มันไปแย่ง lock จาก SDK เอง ทำให้ auth พังเงียบ
- **ลบ localStorage ก่อน createClient** คือต้นเหตุ auth lock — SDK จัดการ session เอง อย่ายุ่ง
- **Deploy ทีละน้อย** — ถ้า deploy แล้วพัง จะรู้ว่าอะไรเปลี่ยน
