# Lesson: AI turnaround ภาพเดียว คุมหลายมุมไม่ได้

**Date**: 2026-08-18
**Context**: EXAT character turnaround (หน้า/ซ้าย/ขวา/หลัง) — ยิงหลายรอบเฟล DewS หงุดหงิด

## Pattern
สั่ง AI ให้ทำ turnaround หลายมุมในภาพเดียว → มันเลือกมุมเอง ไม่ฟัง (ชอบให้ 3/4 + ด้านหลัง แทนซ้าย/ขวา) + หน้า drift เปลี่ยนระหว่างมุม

**วิธีที่ได้ผลจริง:**
1. **แยกยิงทีละมุม** 1 ภาพ = 1 มุม — คุม direction ได้ (`ONE SINGLE figure, STRICT 90° LEFT/RIGHT profile, AVOID: three-quarter, back, facing [ตรงข้าม]`)
2. **แนบ 2 refs**: @Image 1 = identity (หน้า/ชุด) · @Image 2 = pose/layout ref (เช่น REF.png turnaround) → `following the layout of @Image 2`
3. best-of-N ถ้าหน้ายัง drift (งาน concept AI ไม่ต้องเป๊ะ 100%)

**อย่า**: ให้ user ลอง turnaround ภาพเดียวซ้ำๆ ทั้งที่รู้ว่าเฟล — เตือน limitation + เสนอวิธีแยกยิง/pose-ref ตั้งแต่ครั้งแรก

## Related
- [[edit-in-place-not-rebuild]] — "ขอ prompt = ให้ prompt เท่านั้น ห้ามแตะสไลด์" (ยังพลาดซ้ำ)
- เพิ่ม option ใหม่ในเด็ค → ไล่แก้ตัวเลขทั้งเล่มทันที (4→5)
- 3D จริง (CC4/iClone) งวด 2 จะแก้ปัญหา AI drift หมด
