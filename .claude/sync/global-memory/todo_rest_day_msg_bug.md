---
name: TODO — Rest day message ไม่ accurate เมื่อมี session
description: ระบบแจ้ง "วันหยุดไม่มีการเก็บข้อมูล" แม้แอดมินเก็บข้อมูล test ไปแล้ว
type: project
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# TODO — Rest Day Message Bug (LINE OA notification)

**Found by DewS**: 2026-05-07
**Priority**: ไม่เร่ง (มาร์คไว้ก่อน — focus workshop ก่อน)
**Where**: LINE OA broadcast message · `lab/line-oa/`

## ปัญหา

วันที่ 3 พ.ค. — แอดมินทดลองเก็บข้อมูล 1 session
แต่ระบบ LINE ยังแจ้งว่า "วันอาทิตย์ 3 พ.ค. — วันหยุด ไม่มีการเก็บข้อมูลวันนี้ค่ะ"

→ ข้อความ inaccurate (มีข้อมูลแต่บอกว่าไม่มี)

## สาเหตุที่น่าจะเป็น

ระบบเช็ค "วันหยุด" จากตาราง schedule ก่อน → ส่งข้อความ
ไม่ได้เช็คว่ามี session เก็บได้จริงหรือไม่ในวันนั้น

## ตัวเลือกการแก้

| วิธี | ข้อดี | ข้อเสีย |
|------|-------|---------|
| **A. Real-time check** ก่อนส่ง LINE — เช็คว่ามี session record ในวันนั้นไหม → ถ้ามี ไม่ส่ง "วันหยุด" | accurate ที่สุด · auto-handle | ต้อง query DB ก่อนส่ง |
| **B. Override flag** ใน admin — toggle "force-collect" → ตัด rest-day check | controlled | manual, ต้อง remember toggle |
| **C. แยก message สำหรับ admin test** — แทนที่จะส่ง "วันหยุด" ให้ส่ง "วันนี้แอดมินทดสอบ X session" | informative | ต้องตรวจ source ของ session |

## คำแนะนำ (ปรับใหม่หลังคุยกับ DewS 2026-05-07)

**Recipient = admin team only** (ไม่ส่งให้อาสา) → ส่ง msg เพิ่มได้ (3 msg/วัน OK)

### Phase 1 (Quick fix — 5 นาที)
แก้แค่ wording ใน morning msg:
```
เก่า: "วันหยุด ไม่มีการเก็บข้อมูลวันนี้ค่ะ"
ใหม่: "วันหยุดตามตาราง — หากมีการเก็บข้อมูลพิเศษ จะแจ้งสรุปอีกครั้งตอนเย็น"
```
- ไม่ต้องแก้ logic
- evening summary จัดการความจริงเอง (อยู่แล้ว)
- ผู้รับเข้าใจว่ายังมีโอกาสเก็บข้อมูลพิเศษ

### Phase 2 (Optional — ทีหลัง)
เพิ่ม real-time admin alert เมื่อมีการเปิด session ในวันหยุด:
```
"🚨 [admin name] เพิ่งเปิด session บ้าน BS-XXX วันหยุดวันนี้ — เริ่มเก็บข้อมูล"
```
- admin คนอื่นรู้ทันที
- ต้อง implement webhook + admin action hook (effort สูงกว่า)

### Decision (DewS, 2026-05-07)
✅ Phase 1 + 2 ทั้งคู่จะทำ — แต่หลัง workshop deadline 2026-05-20 · ตอนนี้ focus workshop ก่อน

## Related Files
- `lab/line-oa/` (LINE OA Vercel project)
- Cron: morning 12:00 + evening 20:00 ไทย
- Endpoint: `/api/cron/morning` + `/api/cron/evening`

## Status
⏳ Pending — focus workshop deliverable (2026-05-20) ก่อน · กลับมาแก้หลัง
