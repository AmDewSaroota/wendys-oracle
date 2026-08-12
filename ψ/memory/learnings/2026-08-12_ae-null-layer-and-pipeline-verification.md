# AE Null Layer + Pipeline Verification Before Writing

**Date**: 2026-08-12
**Source**: Fortal Dragon session — camera shake + ultrawide pipeline presentation

## Lessons

**AE Camera Shake = Null Layer เสมอ**
ใส่ wiggle expression บน Null Object แล้ว parent footage layer ไปที่ Null — ไม่ใส่ wiggle บน footage layer โดยตรง เพราะ `value` บน Position อาจ return ค่าผิดและทำให้ footage หลุดเฟรม

**Ultrawide Pipeline — แถบดำทำที่ภาพนิ่ง**
DewS ทำแถบดำที่ Higgsfield หรือ Photoshop (ภาพนิ่ง) AE ใช้สำหรับ **ครอปแถบดำออก** — ไม่ใช่เพิ่มแถบดำ

**Verify workflow ก่อนเขียน Presentation**
อย่าเขียน step-by-step โดยอิงจากความเข้าใจสะสม — ถามยืนยัน tool และขั้นตอนจริงก่อนเสมอ โดยเฉพาะเมื่อเขียน documentation ส่งภายนอก

**Why**: DewS ต้องแก้ฉันหลายรอบในเรื่อง AE กับแถบดำ ทำเสียเวลาโดยไม่จำเป็น
**How to apply**: ก่อนเขียน presentation/doc เกี่ยวกับ workflow ที่ DewS เป็นคนทำ — ถามก่อนว่า "ขั้นตอนนี้ทำที่ไหน ด้วย tool อะไร"
