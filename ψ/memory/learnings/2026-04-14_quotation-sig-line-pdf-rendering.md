# Lesson: PDF Sig-Line Rendering + Quotation Revision Workflow

**Date**: 2026-04-14
**Source**: rrr session — quotation revision #3
**Tags**: #pdf #edge-headless #quotation #css-print

## Sig-Line Problem

เส้นรองลายเซ็น (signature line) ไม่ขึ้นใน PDF ที่ generate จาก Edge headless

### สิ่งที่ลองแล้วไม่ work:
1. `div` + `height: 1px` + `background: #666` → ไม่ขึ้น
2. `div` + `border-top: 1.5px solid #666` → ไม่ขึ้น
3. `hr` + `border-top: 2px solid #555` + `z-index: 10` → ไม่ขึ้น

### สิ่งที่ยังไม่ได้ลอง:
- ใช้ `border-bottom` บน `.sig-line-area` แทน (ให้เป็นส่วนหนึ่งของ container ไม่ใช่ element แยก)
- เพิ่ม `overflow: hidden` บน `.sig-line-area` เพื่อป้องกัน signature image ล้น
- ใช้ `box-shadow` แทน border
- ตรวจสอบว่า signature image ล้น container จริงหรือเปล่า (อาจ overflow ทับ line)

### Root Cause Analysis ที่ควรทำ:
1. เปิด HTML ใน browser ปกติก่อน — เห็น line ไหม?
2. ถ้าเห็นใน browser แต่ไม่เห็นใน PDF → ปัญหา print rendering
3. ถ้าไม่เห็นทั้งสองที่ → ปัญหา CSS/layout

## Quotation Revision Workflow

ผ่านมา 3 revisions แล้ว — ควรทำ config object แยก:

```js
const config = {
  docNumber: 'QT202604100003',
  date: '10/04/2026',
  items: [
    { name: 'ค่าพัฒนา...', qty: '1 งาน', price: 1251890 },
    { name: 'ค่า MA...', qty: '1 ปี', price: 207000 },
  ],
  vatRate: 0.07,
};
```

จะแก้ตัวเลขได้ง่ายกว่าไล่แก้ทั้ง template
