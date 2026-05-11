---
name: Context Size → AI Drift in Generative Image AI
description: ยิ่งพื้นที่ในรูปมาก context มาก AI drift มาก — crop เล็กลงก่อน edit
type: project
---

# Context Size → AI Drift

**Rule**: ใน generative image AI (Gemini, etc.) — พื้นที่ทำงานใน input ยิ่งใหญ่ context ยิ่งมาก → AI มีโอกาส reinterpret และสร้างใหม่แทนที่จะแก้เล็กน้อย

**Crop Technique**: ตัด crop พื้นที่ที่ต้องการแก้ให้เล็กลงก่อน → ส่ง crop เข้า AI → paste กลับ
- พื้นที่เล็กลง = context น้อยลง = AI drift น้อยลง = ผลแม่นขึ้น

**ค้นพบจาก**: แก้รูปกอล์ฟ (2026-05-11) — Gemini เปลี่ยนทั้งหน้าทุกรอบจนกว่าจะ crop face ลงแล้วทำงาน

**Why**: Generative AI อ่าน full image เป็น context เสมอ ยิ่งมีข้อมูลมาก โอกาสสร้างใหม่ยิ่งสูง

**How to apply**: ทุกครั้งที่แก้ generative image แล้วได้ผลที่ "เปลี่ยนทั้งหมด" — ลอง crop ก่อน แล้วค่อย edit
