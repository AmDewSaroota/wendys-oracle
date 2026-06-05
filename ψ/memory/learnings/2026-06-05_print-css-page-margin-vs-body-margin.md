# Print CSS: @page margin vs body margin

**Date**: 2026-06-05
**Context**: Midwinter pricing calculator print layout

## บทเรียน

`@page { margin: X }` และ `body { margin: X }` ทำงานต่างกันในบริบท print:

- **`@page { margin }`** — กำหนด margin ที่ทุก page boundary (รวม page break กลางเอกสาร) → เนื้อหาจะมีช่องว่างจากขอบทุกหน้า
- **`body { margin }`** — กำหนด margin บน element body เท่านั้น → ช่วยแค่ top ของหน้าแรก + bottom ของหน้าสุดท้าย ไม่ช่วย page break กลางเอกสาร

**กฎ**: ถ้าต้องการ breathing room ทุกหน้า → ใช้ `@page { margin }` เสมอ

## Side effect

`@page { margin: 0 }` → browser ซ่อน header/footer text (filename, date, URL)  
`@page { margin: 12mm }` → browser แสดง header/footer text → ต้องให้ user ปิดใน print dialog

## วิธีแนะนำลูกค้า

ปุ่ม Print → เพิ่ม note: "Chrome: ปิด Headers and footers ใน print dialog" พร้อม class `no-print` hide ตอน print จริง
