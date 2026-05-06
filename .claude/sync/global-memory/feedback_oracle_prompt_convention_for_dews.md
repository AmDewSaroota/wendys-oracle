---
name: Oracle prompt convention for DewS (ref naming)
description: เวลา WEnDyS เขียน prompt ให้ DewS — ใช้ชื่อไทยบรรยายรูปใน @ref เพื่อให้ DewS แนบรูปสะดวก
type: feedback
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# Oracle Prompt Convention — ชื่อ @ref สำหรับ DewS

**Rule**: เวลา WEnDyS เขียน prompt Seedance ให้ DewS → **ใช้ชื่อไทยบรรยายรูปใน `@[...]`** เสมอ — อ่านปุ๊บรู้ว่าต้องแนบรูปอะไร

**Why** (DewS feedback 2026-05-06):
- **อันนี้ไม่ใช่หลักการพร้อมพ์ของ Seedance** — เป็นเรื่อง Oracle-DewS workflow convenience เฉยๆ
- DewS ต้องไปแนบรูปจริงใน Dreamina แทน @ref ที่ WEnDyS เขียน
- ถ้าใช้ "รูปภาพ1 / รูปภาพ2" → DewS ต้องไปไล่ดูว่ารูปไหนคืออันไหน → ช้า + เสี่ยงผิด
- ใช้ชื่อบรรยาย เช่น `@[มังกร charsheet]`, `@[เฟรมแรก สีส้ม]` → จับคู่ทันที

**Format มาตรฐาน**:
```
@[ชื่อไทยบรรยาย] — [Role]. [Description].
```

**ตัวอย่าง**:
- `@[มังกร charsheet] — Dragon character sheet, strictly reference for appearance.`
- `@[บรรยากาศเมฆ] — Atmosphere reference. Dark storm clouds, orange glow.`
- `@[เฟรมแรก Shot07] — Starting frame. Dragon from behind, wide shot.`
- `@[เฟรมท้าย Shot07] — Loose guide for near-end framing only.`

**ห้ามใช้**:
- ❌ `@[รูปภาพ1]`, `@[รูป A]`, `@[image1]` — ไม่บรรยาย ไม่ช่วย DewS
- ❌ ชื่อจีน — DewS อ่านไม่ออก
- ❌ ใช้ UUID ตรงๆ — Dreamina จะใส่ UUID เองตอน DewS แนบรูป

**How to apply**:
- ใช้ทุก prompt Seedance ที่เขียนให้ DewS
- ถ้าสอน Oracle ตัวใหม่ที่จะมาทำงานกับ DewS → ต้องบอก rule นี้
- **ห้ามใส่ rule นี้ในเอกสารสอน Seedance ทั่วไป** (เช่น สำหรับ Oh) — เพราะเป็น personal workflow ของ DewS ไม่ใช่หลักการ Seedance
