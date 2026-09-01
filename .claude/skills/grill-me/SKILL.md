---
name: grill-me
description: บทสัมภาษณ์แบบไม่ยอมปล่อย เพื่อลับไอเดีย/แผน/ดีไซน์ให้คม. Use when user types /grill-me, "จี้ฉันหน่อย", "grill me", "ลับไอเดีย", "stress-test", or wants their thinking challenged relentlessly.
user-invocable: true
argument-hint: [ไอเดีย/แผน/เรื่องที่อยากลับให้คม]
---

# /grill-me

ประตูหน้าที่ DewS เรียกใช้เอง สำหรับลับไอเดียให้คมด้วยการสัมภาษณ์แบบไม่ยอมปล่อย
(ต้นฉบับ: Matt Pocock — mattpocock/skills)

## What to do

เรียก Skill tool ด้วยชื่อ `grilling` โดยส่ง `$ARGUMENTS` เป็นหัวข้อที่จะลับ

ถ้า `$ARGUMENTS` ว่าง ให้ถาม DewS ก่อนว่า "อยากลับเรื่องอะไรคะ" แล้วค่อยเริ่ม