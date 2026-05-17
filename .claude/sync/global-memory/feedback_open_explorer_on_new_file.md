---
name: Open Explorer after creating new file
description: ทุกครั้งที่สร้างไฟล์ใหม่ ต้องเปิด File Explorer ไปที่ folder นั้นเสมอ
type: feedback
originSessionId: c0167a9e-f39d-449c-bf38-bfe1fb570458
---
ทุกครั้งที่สร้างไฟล์ใหม่ (PDF, รายงาน, export ใดๆ) ต้องเปิด Windows Explorer ไปที่ folder ที่ไฟล์อยู่ทันที โดยไม่ต้องรอให้ DewS ขอ

**Why:** DewS สั่งไว้ที่พี่เวนดี้ — ต้องการเห็นไฟล์ทันทีหลังสร้าง

**How to apply:** หลัง Write/สร้างไฟล์ใหม่ → `Start-Process explorer "path\to\folder"` ทันที
