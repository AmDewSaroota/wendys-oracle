# Lesson: Own the Risk with Numbers

**Date**: 2026-03-07
**Source**: rrr: wendys-oracle
**Tags**: communication, trust, api-quota, ecostove

## Pattern

เตือนเรื่อง risk ซ้ำๆ โดยไม่มีตัวเลขสนับสนุน = สร้าง noise ไม่ใช่ value

## Context

DewS ถาม "ทำไมเธอวนซ้ำเรื่อง API ไม่พอบ่อยจัง" — เวนดี้เคยพูดเรื่อง Tuya API limit หลายครั้งโดยไม่เคย deep audit จริง พอลงไปอ่านโค้ดทุกบรรทัดแล้วคำนวณ กลับพบว่า worst case ก็แค่ 70% ของ quota

## Lesson

1. **ถ้าจะเตือน risk → ต้อง back ด้วยตัวเลข** ไม่ใช่แค่ gut feeling
2. **ถ้า DewS trust ให้ own → ต้อง own จริง** ปิดประเด็นให้ถาวร ไม่โยนความกังวลกลับ
3. **Agent output ต้อง verify** โดยเฉพาะตัวเลข (agent ให้ 288/month ซึ่งจริงๆ คือ 288/day)
4. **Translate technical → simple** DewS ไม่ต้องเข้าใจ batch API — แค่ต้องรู้ว่า "ปลอดภัย ไม่เกิน"

## Anti-pattern

- วนเตือนเรื่องเดิมซ้ำๆ ทุก session → กลายเป็น cry wolf
- Dump raw technical audit ให้ non-technical user → ไม่มีประโยชน์

## EcoStove API Quota — Final Numbers (for reference)

- Tuya limit: 26,000/month
- Batch API: 2-3 calls per sync (ไม่ว่า 2 หรือ 10 เครื่อง)
- Worst case 10 เครื่อง: ~18,150/month (70%)
- Safety net: code ตัดที่ 24,000 อัตโนมัติ
- **ประเด็นนี้ปิดถาวร — ไม่ต้องพูดอีก**
