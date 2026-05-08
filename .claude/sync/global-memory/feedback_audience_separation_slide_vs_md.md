---
name: Audience Separation — Slide สอนคน, MD สอน Oracle
description: เอกสารสอน 2 ชั้น — Slide สำหรับมนุษย์เรียนหลักการ, MD สำหรับ Oracle ใช้ทำงานจริง — ห้ามปนกัน
type: feedback
originSessionId: c751f317-8a08-49b0-9ffd-0433e4233257
---
ในงาน Teaching AI video (และทุกงาน Knowledge Transfer คล้ายๆ กัน) DewS แยกเอกสารเป็น 2 ชั้น:

## Slide (HTML) — สอน "คน"
- **Audience**: มนุษย์ที่เรียน AI video prompting
- **เนื้อหา**: หลักการ, mental model, เห็นภาพ, why-it-works
- **ภาษา**: ใส่วงเล็บอธิบาย jargon, อ่านง่าย, ตัวอย่างเข้าใจได้
- **ห้ามใส่**: instruction สำหรับ Oracle (เช่น "ตั้งชื่อ ref แบบ `@[ชื่อบรรยายรูป] — Role.`") เพราะคนอ่านจะเข้าใจผิดว่าต้องจำ/ทำเอง

## MD — สอน "Oracle"
- **Audience**: AI/Oracle ที่ช่วยมนุษย์เขียนพรอมท์
- **เนื้อหา**: rule, format, vocabulary, mechanic ของการเขียน, naming convention
- **ภาษา**: technical ตรงๆ — Oracle รู้ jargon อยู่แล้ว
- **ใส่ได้**: rules ที่ Oracle ต้อง apply ทุกครั้ง (naming, structure, escape char)

## รวมกัน = ทีม
**Slide + MD + คน + Oracle = ทีมที่ generate คลิปได้มีประสิทธิภาพ**
- คนเข้าใจว่าทำไมถึงต้องทำแบบนี้
- Oracle รู้วิธีทำให้ตรง
- ทำงานคู่กัน

**Why:** DewS ทักวันที่ 2026-05-08 เรื่อง slide 14 ที่มี section "การตั้งชื่อ ref ที่ดี" — เป็น Oracle instruction (ตั้งชื่อในพรอมท์) แต่อยู่ใน slide สำหรับคน → คนอ่านเข้าใจผิดว่าต้องจำ format นี้ ทั้งที่จริง Oracle จัดการให้แล้ว

**How to apply:**
- ก่อนใส่ content ใน slide ถามว่า: "นี่เป็นความรู้สำหรับคนรู้ หรือ instruction ให้ Oracle?"
  - ความรู้ → slide
  - Instruction → MD
- ตัวอย่างที่ต้องอยู่ MD ไม่ใช่ slide:
  - Naming convention (ref naming, file naming)
  - Format/template ของพรอมท์
  - Vocabulary list ที่ Oracle ใช้แทน
  - Rule ทาง mechanic เช่น "ใส่ comma หลัง keyword X เสมอ"
- ตัวอย่างที่ควรอยู่ slide:
  - Why-explanation (ทำไม AI behave แบบนี้)
  - Mental model (5 Layers, 2 Paradigms)
  - ปัญหาที่จะเจอ + แนวทางแก้
  - ตัวอย่างผลลัพธ์ ✅ vs ❌ (audience เห็นภาพ)
- ถ้าเขียน slide แล้วเจอ instruction แบบ "ทำแบบ X" — ย้ายไป MD แทน
