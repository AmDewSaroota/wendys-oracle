# Lesson: MEMORY.md เป็น stale snapshot ไม่ใช่ source of truth

**Date**: 2026-05-05
**Context**: EcoStove guide status recheck

## Pattern

เวนดี้เขียน TODO ใน MEMORY ว่า "คู่มือ + คู่มืออาสา ยังไม่ทำ" — DewS ทำเสร็จและ deploy บน Vercel ไปนานแล้ว แต่ MEMORY ไม่ถูก update เมื่อ user ถาม "งานอะไรค้างอยู่บ้าง" → relay TODO เก่ามาตอบ → user ต้องสั่ง "เช็คอีกที อย่ามั่ว" ถึงค่อยไป grep + open file → พบว่าทำแล้วจริง

## ที่ผิด

1. ใช้ TODO ใน MEMORY เป็น answer โดยไม่ verify
2. ลืมว่า DewS ทำงานต่อเองได้โดยไม่ได้บอก
3. memory ที่ตัวเองเขียน → อ่าน → ยืนยันตัวเอง = blind feedback loop

## ที่ต้องทำ

- ก่อนตอบเรื่อง status ของ deliverable (ทำ/ไม่ทำ/เสร็จ/ค้าง) → grep หรือเปิดไฟล์จริงเสมอ
- TODO ใน MEMORY ใช้เป็น **hint** ว่า "ตรงนี้น่าเช็ค" ไม่ใช่ **answer**
- หลัง verify เสร็จแล้วต้อง update MEMORY ให้ตรงทันที
- Self-Correction Rules (2026-03-20) มีอยู่แล้ว — ต้องใช้ ไม่ใช่แค่อ่าน

## Tags

memory-discipline, verify-before-claim, ecostove
