# Dreamina — Ref Camera Lock & Direction Control

**Date**: 2026-06-11
**Project**: Fortal Dragon Shot 15 iteration
**Source**: 8-round iteration session, Shot 15 v8–v15

---

## Pattern 1: Ref Image = Camera Angle Lock

**Rule**: ทุก image ที่แนบเป็น ref → Dreamina lock camera angle ของภาพนั้นทันที

**Applies to**: แม้แต่ ref ที่ตั้งใจใช้เป็น "silhouette reference" หรือ "action reference" — ถ้ามีกล้อง implicit ใน ref Dreamina จะ copy มัน

**Fix**: ถ้าต้องการ action/silhouette จาก ref แต่ไม่ต้องการ camera angle → **บรรยาย text อย่างเดียว** อย่าแนบ ref นั้น

---

## Pattern 2: Dome = Gothic Default

**Rule**: เมื่อ prompt มีคำว่า "dome" หรือ "cathedral" → Dreamina เพิ่ม Gothic elements โดยอัตโนมัติ

**Symptoms**: flying buttresses, ribbed tracery, pointed arches, pinnacles, spires

**Fix**: explicit negative list ทุกครั้ง:
```
ZERO Gothic elements: no flying buttresses, no ribbed tracery, no pointed arches, no cathedral windows, no pinnacles, no spires whatsoever.
```

---

## Pattern 3: Direction Flip (Ascend vs Descend)

**Rule**: Dreamina สลับทิศการบินของมังกรได้ — ถ้า camera trailing from below → dragon อาจ ascend แทน descend

**Fix**: บอกทิศด้วยหลายภาษาพร้อมกัน:
```
Dragon travels from TOP of frame to BOTTOM of frame.
The dome is BELOW the dragon and the dragon is approaching it from ABOVE.
Dragon loses altitude every frame. NOT rising. NOT ascending. FALLING DOWN.
Fire streams DOWNWARD from its mouth, hitting the dome surface below.
```

---

## Pattern 4: ภาพ Ref จาก DewS ≠ Camera Angle สำหรับ shot นั้น

**Rule**: เมื่อ DewS ส่งภาพมาระหว่าง iteration อาจเป็น:
- Camera angle reference
- Action/movement reference
- Architecture/detail reference
- **Continuity reference** (ภาพจาก shot อื่นเพื่อบอกว่าต้อง consistent)

**Fix**: ถาม หรือ read context ก่อน assume — อย่า map ภาพ → camera angle โดยอัตโนมัติ

---

## Pattern 5: Top-Down Chase Camera = "above and behind, angled down"

**Confirmed working angle for Shot 15**: 
Camera above and behind the dragon, angled down — we see dragon's spine/dorsal wings from above as it dives.
Trigger phrase: "chase camera aligned with dragon body axis" → Dreamina interpreted as top-down dorsal view ✅

