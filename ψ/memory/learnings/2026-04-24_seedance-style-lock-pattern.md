# Lesson: Style Guide ต้องเขียนทันทีที่จับ pattern ได้

**Date**: 2026-04-24
**Source**: Seedance prompt session — DewS pointed out style drift
**Concepts**: prompt-engineering, style-consistency, cross-session-memory

## Pattern

AI ลืมสไตล์ทุก session ใหม่ ทำให้ user ต้อง re-train ซ้ำ:
- Prompt structure เปลี่ยน (มี timestamp / ไม่มี)
- @ ref naming เปลี่ยน (รูปภาพX / UUID / ชื่อไทย)
- Tone เปลี่ยน (mechanical / attitude-driven)
- Details level เปลี่ยน (over-describe / under-describe)

## Solution

เขียน **Style Guide section** ใน prompt guide ที่ AI อ่านทุก session:
1. โครงสร้าง (บรรทัดแรก → refs → scene → action → film → sound)
2. @ ref naming มาตรฐาน + ตัวอย่าง
3. น้ำเสียง (attitude-driven, film terms, ห้ามเฉพาะจุด)
4. ห้ามทำ (mechanics ยาว, negative ยาว, เกิน 150 คำ)
5. ตัวอย่าง ดี vs ไม่ดี

## Key Insight

ปัญหาใหญ่สุดไม่ใช่ความฉลาด แต่เป็นความจำข้ามเซสชั่น — style guide ที่ดีแก้ได้ 90%

## Related

- Camera direction: "camera catches fire" ≠ "fire aimed at camera" — Seedance ตีความตรงตัว
- Transform timing: ผูกกับ action moment ไม่ใช่แยกย่อหน้า
