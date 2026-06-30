# Dreamina: Static element ใน ref → static ใน output

**วันที่**: 2026-06-30

## Pattern

ถ้า starting frame ref มี element ที่ดูนิ่ง (เช่น smoke, fire, object) อยู่ในรูป Dreamina จะ treat element นั้นเป็น static background และไม่ animate มัน

## ตัวอย่าง

Shot 16 — ใช้ Shot16_1stWide_Smoke.png (มีควันนิ่ง) เป็น starting frame → Dreamina render ควันนิ่งตลอด clip แม้จะมีภาษาในพร้อมพ์บอกว่า "actively moving"

## วิธีแก้

1. **Remove element จาก ref** — ใช้ ref ที่ไม่มี element นั้น แล้วให้ text describe ให้ Dreamina generate ขึ้นมาใหม่
2. **ระบุ source ชัด** — บอกว่า smoke/fire มาจากจุดไหน เคลื่อนที่ยังไง ไม่ใช่แค่ "there is smoke"

## กฎ

> ถ้าต้องการให้ element เคลื่อนที่ → อย่าให้มันอยู่ใน starting frame ref นิ่งๆ

