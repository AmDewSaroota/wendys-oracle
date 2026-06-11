# Lesson: External AI Analysis (Elsa) as Pricing Audit Source

**Date**: 2026-06-11
**Source**: rrr: midwinter-elsa-calc-update

## Pattern

เมื่อ DewS บอกว่า "มีข้อมูลจากเอลซ่าของพี่บอย" = ให้ fetch URL ที่ได้รับ
Elsa คือ AI ของพี่บอยที่ใช้วิเคราะห์งาน NDF — output มักเป็น report/dossier ที่ deploy บน Vercel

## Pricing Calculator Insight

Calculator ที่แสดงต่อลูกค้าควรระบุให้ชัดว่า:
- ราคาเป็น **selling price** (รวม NDF margin แล้ว) ไม่ใช่ cost ล้วนๆ
- Section ที่ใช้ man-day rate = margin อยู่ใน rate แล้ว
- Section hardware = ต้องบวก markup แยก (~20% for system integrator)

## Hardware Model Check

ก่อนส่ง quote ต้องตรวจ projector model ว่า active ในตลาดไทยอยู่ไหม
PT-VZ570 เลิกผลิตปี 2019 — อยู่ในไฟล์ถึง 2026 โดยไม่มีใครสังเกต

## Verified Numbers (2026-06-11)

- Panasonic PT-VMZ51: ฿114,000/ตัว (retail Thailand)
- NDF selling price with ~21% markup: ฿141,000/ตัว
- Section B (10 tables M): ฿1.56M–1.70M
- Grand Total (10M, 1 course, A+B+C): ฿2.29M–3.14M
