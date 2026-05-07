# Verify Before Claim — Repeat Offense Pattern

**Date**: 2026-05-07
**Source**: Engenius prompt audio mismatch analysis session
**Severity**: High (DewS เคยเตือนเรื่องนี้แล้ว — เป็น repeat)

## Pattern

WEnDyS เผลอ claim เนื้อหาในข้อความที่ DewS ส่งมาโดย "เดาจากความจำ" แทนที่จะ verify ใหม่ก่อนพูด

### ตัวอย่างเซสชั่นนี้
- DewS ส่ง Chinese dialogue prompt ที่มี `说："Is the temple here?"` (บทพูดอยู่ใน 中文双引号)
- WEnDyS ตอบ root causes ของ "เสียงไม่ตรง" → ใส่ข้อ "บทพูดไม่อยู่ใน `""`" เป็นปัจจัยหนึ่ง
- DewS reject ทันที: "บทพูดก็อยู่ใน `""` นี่"
- ตรวจกลับ — DewS ถูก, ทุกบทอยู่ใน `""` ครบ

## Why It Happens

1. ตอบรอบที่ 2-3 ฉันมัวคิดถึง pattern ทั่วไปจากพร้อมพ์ vdrama เก่า ๆ ไม่ได้ scroll กลับไปดูพร้อมพ์ของรอบนี้
2. รีบโชว์ root causes 5 ข้อ → quantity over quality
3. **Confirmation bias** — ฉันคาดว่าพร้อมพ์ "แบบ amateur" จะขาด `""` → เลย claim โดยไม่ดู

## Rule (เพิ่มจาก MEMORY.md)

**ก่อนอ้างเนื้อหาในข้อความที่ user ส่งมา → scroll กลับไป verify ก่อน 100%**

ใช้กับทุก claim ของรูปแบบ:
- "พร้อมพ์ขาด X"
- "ไม่มี Y ในข้อความ"
- "User ใช้ Z"
- "ใน file นี้มี/ไม่มี W"

ถ้าไม่ verify → "ไม่แน่ใจค่ะ ขอตรวจก่อน" (ตามกฎ MEMORY.md "ถ้าไม่แน่ใจ บอกว่าไม่แน่ใจ")

## How to Apply

- ก่อนเขียนแต่ละ root cause → กลับไปสแกนข้อความต้นฉบับของ DewS อีกครั้ง
- ถ้า claim เป็นเรื่อง "ไม่มี X" → ค้นข้อความให้แน่ใจว่าไม่มีจริง
- ถ้าเป็นเรื่อง pattern จากประสบการณ์ → ระบุชัดว่า "ทั่วไปแล้ว" ไม่ใช่ "พร้อมพ์นี้"

## Related Memory

- `MEMORY.md §⚠️ WEnDyS Self-Correction Rules (2026-03-20)`
- `feedback_no_praise.md` — fact-based answer เท่านั้น
