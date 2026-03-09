# Slide Number Renaming — Collision Avoidance Pattern

**Date**: 2026-03-09
**Context**: EcoStove weekly update slides, multiple delete/merge rounds (15→13→12→9)

## Pattern

เมื่อต้อง rename slide numbers หลังจาก delete/merge slides ใน HTML:

**ห้ามทำ**: replace_all ทั้งหมดในครั้งเดียว → เกิด collision (เช่น "5/9" มีสองอัน)

**ทำแบบนี้**:
1. Fix เลขที่ "unique" และ "ต่างจาก target" ก่อน — ทำทีละตัวเรียงจาก largest ลงมา
2. replace_all `/ old_total` → `/ new_total` ทีหลัง เพื่อจัดการที่เหลือที่ไม่ conflict

## Example

จาก 12 → 9 slides (ลบ slides 4, 6, 7 ย้าย 8):
```
Fix specific first:
  12/12 → 9/9   (unique)
  11/12 → 7/9   (unique)
  10/12 → 6/9   (unique)
   9/12 → 5/9   (unique)
   8/12 → 8/9   (unique)
   5/12 → 4/9   (unique)

Then replace_all:
  / 12  → / 9   (handles remaining: 1,2,3)
```

## Related

- ควรถาม "ซ่อน vs ลบ" ก่อน — HTML comment out หรือ delete จริง?
- เมื่อ merge slides และ trim content ควรแจ้ง DewS ว่า trim อะไรออก
