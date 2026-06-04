# Gemini + Maya Preview — ต้องบอก context

**Date**: 2026-06-04
**Project**: Fortal Dragon Cutscene

## Rule

เมื่อให้ Gemini วิเคราะห์ Maya playblast / 3D preview ต้องระบุใน prompt ว่า:
> "นี่คือ 3D Maya preview ไม่ใช่ real footage — lighting/color เป็น Maya material ไม่ใช่ real world"

## ทำไม

Gemini อ่าน orange Maya sky shader แล้วบรรยายว่า "พระอาทิตย์ตก" — ซึ่งผิดทั้งหมด Maya preview มี flat lighting และ placeholder materials ที่ไม่สะท้อน intent จริง

## ต้องทำ

1. บอก context ก่อนทุกครั้ง
2. ให้ DewS verify descriptions ก่อนนำไปใช้เขียน prompt
3. focus ให้ Gemini บรรยาย composition/position/action — ไม่ใช่ atmosphere/lighting

