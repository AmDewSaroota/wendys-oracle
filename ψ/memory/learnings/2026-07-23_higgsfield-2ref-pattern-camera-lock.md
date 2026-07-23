---
name: higgsfield-2ref-pattern-camera-lock
description: Higgsfield 2-ref pattern (char vs framing) + ถามก่อนว่ากล้องหรือตัวละครที่เคลื่อน
metadata:
  type: feedback
---

## Higgsfield 2-Ref Pattern

เมื่อต้องการ composition ใหม่จากหลาย refs ใน Higgsfield ให้แยก ref ชัดเจน:
- Ref 1 = CHARACTER ref → ระบุ "Match dragon EXACTLY: scales/color/expression"
- Ref 2 = FRAMING ref → ระบุ "FRAMING ONLY — ignore dragon design and color, use ONLY wing span / composition"

ถ้าไม่ label ชัด Higgsfield จะ mix ทั้ง character AND framing จาก ref เดียวกัน ทำให้ design drift

**Why:** พบปัญหา Shot02-MD — Higgsfield ใช้ design มังกรจาก Shot02_MD_First (น้ำตาล) แทนที่จะใช้จาก MD_05_00000 (charcoal gray)

**How to apply:** ทุกครั้งที่ Higgsfield ใช้ ref มากกว่า 1 รูป ให้ label role ใน prompt

---

## Camera Lock vs Character Move (Video Prompts)

ก่อนเขียน video prompt ทุกครั้ง ถามตัวเองหรือ DewS ว่า: **"กล้องเคลื่อน หรือตัวละครเคลื่อน?"**

Camera push-in ≠ Character lean-in — Dreamina interpret ต่างกันมาก
- Camera push-in: viewer perspective เข้าใกล้
- Character move toward camera: ตัวละคร threatening มากกว่า เหมือนมันมาหาคุณ

**Why:** DewS แก้ Shot02-MD prompt — ฉัน assume camera push-in แต่จริงๆ camera ล็อค มังกรโน้มตัวลงเอง

**How to apply:** ถ้า brief ไม่ระบุ ถามก่อน อย่า assume จาก cinematography convention
