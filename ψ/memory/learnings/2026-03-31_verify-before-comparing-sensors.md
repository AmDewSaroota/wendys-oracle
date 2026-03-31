# Lesson: Verify Before Comparing Sensors

**Date**: 2026-03-31
**Source**: rrr — PV28 Air Detector audit session
**Tags**: #ecostove #sensor #verification #self-correction

## Pattern

เวลาเทียบค่าเซนเซอร์ 2 เครื่อง ต้องทำ 3 ขั้นตอนก่อนสรุป:

### 1. เช็คว่าเครื่องปกติหรือค่าค้าง
- ดู CO2 ในสภาพแวดล้อมปัจจุบัน (ออฟฟิศ ~400-600 ppm)
- ถ้า CO2 สูงผิดปกติ (>1000 ในออฟฟิศ) → ค่าอาจค้างจากการทดสอบ → ห้ามเอาไปเทียบ

### 2. เช็ค session data จริง ไม่ใช่แค่ status endpoint
- Tuya status endpoint อาจ list code ที่เครื่อง "รองรับ" แต่ไม่ได้ส่งค่าจริงขึ้น cloud
- ต้องดู pollution_logs ว่ามีค่าจริงหรือเป็น null ทุกแถว
- ตัวอย่าง: MT13W list `tvoc_value` ใน status แต่ค่าจริงเป็น null ทุก session

### 3. อ่าน memory ก่อนพูดเรื่อง hardware spec
- Battery, sensor capability ถูกบันทึกไว้แล้ว
- ห้ามเดาหรือพูดจากความจำลอยๆ

## Anti-pattern

- เห็นค่าต่างกัน 50x → สรุปทันทีว่า "scale ต่าง" โดยไม่เช็คว่าเครื่องปกติไหม
- เห็น code ใน API response → สรุปว่า "วัดได้" โดยไม่เช็คว่าส่งค่าจริงไหม
- พูดเรื่อง spec จากความจำโดยไม่อ่าน memory file
