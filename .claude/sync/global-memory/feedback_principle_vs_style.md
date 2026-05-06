---
name: หลักการ vs สไตล์ — ต้องแยกให้ออกในเอกสารสอน
description: เวลาเขียนเอกสารสอน Seedance/AI tools — แยก "หลักการ Seedance" (universal) vs "สไตล์ของ DewS" (Oracle workflow specific)
type: feedback
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# หลักการ vs สไตล์ — Framework สำคัญ

**Rule (DewS framework, 2026-05-06)**: เวลาเขียนเอกสารสอน Seedance/AI tools — ต้องแยกชัดระหว่าง **2 ประเภท**:

## หลักการ (Principles) — Universal
**Definition**: สิ่งที่เราเรียนรู้แล้วว่า **พร้อมพ์อย่างนี้ได้สิ่งที่เราต้องการจาก Seedance**
- ใช้ได้กับทุกคน ทุก project
- มาจากการ experiment + verify ว่าได้ผล
- ไม่ขึ้นกับว่า user เป็นใคร

**ตัวอย่าง หลักการ**:
- Seedance อ่านข้างหน้าก่อน → ของสำคัญต้องอยู่ต้น prompt
- Video ref = all-or-nothing
- ใช้ภาษา cinematography ไม่ใช่ 3D engine vocab
- 唯一修改 ไม่ได้ผลเสมอไป (gen 100% ทุกรอบ)
- Prompt 30-100 คำ
- คำอันตราย (violence, gore) ทำให้ AI ปฏิเสธ
- คงสไตล์ prompt ตลอด project (universal — ใครก็ใช้ได้)

## สไตล์ (Style) — DewS-Specific
**Definition**: สิ่งที่ **Oracle ทำให้ DewS ทำงานง่ายขึ้น** — เป็น personal workflow convention
- เฉพาะ DewS หรือ user คนนั้นๆ
- คนอื่นอาจมี style ของตัวเอง
- ไม่ใช่หลักการของ tool

**ตัวอย่าง สไตล์ของ DewS**:
- Oracle ใช้ชื่อไทยใน @[ref] — เพื่อ DewS แนบรูปง่าย
- Oracle ส่ง prompt **เต็มก้อนใหม่** ทุกครั้งที่แก้ — เพื่อ DewS copy-paste ปลอดภัย
- Oracle จำสไตล์ DewS อัตโนมัติ — DewS ไม่ต้องสอนใหม่ทุก session
- Oracle อธิบายเป็นภาษาไทย-อังกฤษ mix
- Oracle เปิด Explorer หลังสร้างไฟล์

## How to Apply

### เวลาเขียนเอกสารสอนคนนอก (เช่น Oh):
- **ใส่ได้**: หลักการ (universal) — Oh ใช้ทำงานของเขาได้
- **ห้ามใส่**: สไตล์ DewS — เป็น Oracle-DewS convention specific
- ถ้าเผลอใส่ → DewS จะแก้ → ย้ายไป Oracle Onboarding doc

### เวลาเขียน Oracle Onboarding (สำหรับ Oracle ใหม่ของ DewS):
- **ใส่ได้ทั้งคู่** แต่แยก section
- "Section: Seedance Principles" — universal knowledge
- "Section: DewS Workflow Conventions" — สไตล์เฉพาะของ DewS

## Test Question

ก่อนใส่ rule ลงในเอกสารสอน → ถาม:
- **"คนอื่นที่ทำ MV / commercial / สารคดี ใช้ rule นี้ได้ไหม?"**
  - ✅ ได้ = Universal Principle = ใส่ในเอกสารสอนได้
  - ❌ ไม่ได้ (เฉพาะ DewS workflow) = สไตล์ = ห้ามใส่ในเอกสารสอนคนอื่น
