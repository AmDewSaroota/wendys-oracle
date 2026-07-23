# Lesson: Template-lock skills + verify company data before official docs

**Date**: 2026-07-23
**Context**: ทำใบเสนอราคางาน 3D Character (คุณพิม) → ต่อยอดเป็น skill /quota

## Pattern discovered

### 1. เอกสารทางการต้องใช้ template ที่ lock ไว้ ห้าม improvise
ทุกครั้งที่สร้างใบเสนอราคาใหม่จากศูนย์ → หน้าตาไม่เหมือนกัน → DewS ต้องแก้ซ้ำ = waste
**วิธีแก้:** แยก data (JSON) ออกจาก presentation (template ที่ lock) — build script รับแค่ data
โลโก้/ลายเซ็น/ฟอนต์/สี/layout = constant ในสคริปต์ เปลี่ยนไม่ได้

### 2. ห้ามเดาข้อมูลบริษัทลงเอกสารทางการ
เดา NDF = "Natural Digital Future" ผิด (จริง = เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ)
ทั้งที่ memory มีข้อมูลอยู่แล้ว → ต้อง grep memory ก่อนกรอกข้อมูลบริษัท/ตัวเลข/ชื่อเสมอ

### 3. รู้ convention ของประเภทเอกสาร
ใบเสนอราคา = รายการ + ราคา + เงื่อนไขชำระ + ลายเซ็น เท่านั้น
Production Timeline / Gantt = เอกสารคนละใบ ห้ามยัดรวม

### 4. งานซ้ำ + user หงุดหงิดเรื่องความไม่สม่ำเสมอ = สัญญาณสร้าง skill
เมื่อ DewS พูด "ทำไมทำให้เหมือนกันทุกครั้งไม่ได้" = ถึงเวลา lock เป็น skill

## Artifact
- Skill: `.claude/skills/quota/` (build-quotation.js + skill.md + assets)
- Trigger: "quota", "ทำใบเสนอราคา", "quotation", "ใบประเมินราคา"
