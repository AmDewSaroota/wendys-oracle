# Lessons: Dome Architecture + Tool Mapping

**Date**: 2026-08-10
**Source**: Fortal Shot 15 castle dome iteration session

## Lesson 1 — Gothic-Romanesque Dome Apex

ยอดโดมที่ถูกต้องสำหรับยุค Gothic-Romanesque = **lantern** (โคมหินทรงกระบอกเตี้ยๆ บนยอด มีหลังคาโค้งเล็กๆ)
- ❌ Spire/needle = ยอดหอคอย Gothic ไม่ใช่ยอดโดม
- ❌ Oculus กว้าง = Roman Pantheon — คนละยุค
- ✅ Lantern + stone ribs = Florence Cathedral, Gothic-Romanesque ถูกต้อง

**Why:** prompt ที่บอก "solid stone cap pointed" → AI แปลงเป็น spire แทน lantern ต้องระบุ "lantern" ชัดเจน

## Lesson 2 — Seedream = img2img tool ของ DewS

DewS ใช้ **Seedream 5.0 Pro** สำหรับ img2img — ไม่มี strength/denoise slider
- ❌ ห้ามบอก "ตั้ง strength ~0.2–0.3"
- ✅ ควบคุมด้วย prompt language เท่านั้น ("keep exactly as-is", "enhance only")

**Why:** DewS แก้ไขให้ 2 ครั้งในวันเดียวกัน

## Lesson 3 — Shot Continuity: Track Mouth State

เวลา connect shots ต้อง track state ปลายทางของ shot ก่อนหน้า:
- 02-MD จบ: jaw open → 03 ต้น: roar → 03 ปลาย: jaw closed → 04: ร่อนปกติ
- Chain นี้ทำให้ sequence ดูเป็นหนึ่งเดียว ไม่ตัดกัน
