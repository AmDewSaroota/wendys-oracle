# Static beats dynamic when content is fixed

**Date**: 2026-05-09
**Source**: biomass workshop slides image persistence rabbit hole

## Pattern

เมื่อ user ต้องการแสดงรูปภาพที่ไม่เปลี่ยน (static content) ในหน้า HTML — อย่า build dynamic upload system ทันที ถามก่อนว่ารูปมีอยู่แล้วไหม ถ้ามี ฝัง `<img src="./file.png">` ตรงๆ ดีกว่าเสมอ

## Why this matters

- localStorage มี 5MB quota — base64 รูปหลายรูปเกินได้ง่ายมาก และ fail silently
- IndexedDB async init ขัด synchronous slide/page initialization → break layout
- Static img src: ไม่มี quota, ไม่มี async, ไม่มี key mismatch — just works

## How to apply

1. ถามก่อน: "มีไฟล์รูปอยู่แล้วไหม หรือต้องการ upload ระหว่างใช้งาน?"
2. ถ้ามีไฟล์อยู่แล้ว → ก๊อปเข้า folder เดียวกัน + `<img src="./filename.png">`
3. ถ้าต้องการ dynamic upload (workshop, event) → ให้ user กด 💾 ทันทีหลังใส่รูป ก่อน refresh

## Related

- ปัญหา: numbered list mapping → ให้ match กับ visible label ไม่ใช่ array index
