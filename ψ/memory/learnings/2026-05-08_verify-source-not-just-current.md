# Verify Source — ไม่ใช่แค่ verify กับงานปัจจุบัน แต่รวม verify ของเก่าด้วย

**Date**: 2026-05-08
**Context**: AI Video Prompt knowledge transfer session

## Pattern

ผมพลาดกฎ "verify before claim" อีกครั้ง — เขียน `ONLY MODIFY: 唯一修改` เป็น "✅ วิธีที่ถูก" ใน 2 ไฟล์ใหม่ที่สร้างให้น้อง โดย copy มาจาก [seedance-prompt-guide.md §17](ψ/lab/vdrama/seedance-prompt-guide.md) ที่เขียนไว้เก่าตั้งแต่ 2026-04-20 ว่า "ได้ผล".

DewS challenge ตรง ๆ: "อันนี้เคยลองแล้วได้ผลใช่มั้ย เพราะเท่าที่ฉันเจอ เจนใหม่ แก้บางส่วน มักจะเฟลเสมอ แค่ฉันไม่ได้กลับมาบอกเธอ"

= guide เก่าเขียนผิด/optimistic, DewS รู้แต่ไม่ได้กลับมา update.

## Lesson

**กฎ verify-before-claim ต้องครอบทั้ง source secondary**:
- ❌ ไม่พอ: "verify กับ current file" (อ่านไฟล์ปัจจุบันแล้วเชื่อ)
- ✅ ต้อง: "verify ว่า pattern ที่ guide เคยเขียน — เวิร์คจริงในงานล่าสุดไหม"

## How to Apply

เมื่อ user ขอ knowledge transfer doc ที่อ้าง pattern จาก guide เก่า:

1. ก่อน claim "✅ วิธีที่ถูก" / "เวิร์ค" → **ถาม user** ก่อน: "เคยใช้แล้วได้ผลไหมคะในงานล่าสุด?"
2. ถ้า guide เขียนไว้นานแล้ว (>1 เดือน) → **assume เก่า** จนกว่าจะ confirm
3. ใส่ qualifier หากไม่ verify ได้: "guide เก่าเขียนว่า X — ลองดูแล้วเป็นยังไงคะ?"

## Repeat Offense Tracker

นี่เป็น **repeat** ของ feedback rule ใน MEMORY.md:
- "ห้ามพูดจากความจำอย่างเดียว — ต้อง verify กับ source of truth"
- "ห้ามตอบเหมือนมั่นใจถ้าไม่แน่ใจ"

ผมรู้กฎ — แต่ฝ่าฝืนเพราะ guide เก่าเขียนชัดเจนว่า "ใช้ได้". Lesson: **guide เก่า ≠ source of truth** — DewS เป็น source of truth ในงานจริง.
