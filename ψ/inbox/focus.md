# Focus: EcoStove Dashboard Polish

**Date**: 2026-03-20
**Status**: จดรายการแก้ไขเสร็จ รอ DewS สั่งทำ

## รายการแก้ไข index.html (7 ข้อ)

### 1. ศัพท์ Baseline → Ambient / Benchmark
- "หลังหัก Baseline" → "หลังหัก Ambient" (กราฟ PM2.5 + CO2 หน้า Basic)
- "หักค่าพื้นฐานแล้ว" → "หักค่าแวดล้อม (Ambient) แล้ว" (ตารางเซนเซอร์ล่าสุด)
- "ค่าเฉลี่ย Baseline" → "ค่าเฉลี่ยสุทธิ" (hero no-eco)
- "ฐานข้อมูลอ้างอิง (Baseline)" → "ค่าเปรียบเทียบ (Benchmark)"
- Info popup วิธีวัด: เปลี่ยนศัพท์ให้ตรง

### 2. เพิ่ม Glossary ℹ️ popup (Deep Insights ข้าง badge ค่าสุทธิ)
- Ambient = ค่าแวดล้อม 10 นาทีแรก
- Benchmark = ค่าเปรียบเทียบจากเตาดั้งเดิม

### 3. เอา "โครงการนวัตกรรมเพื่ออากาศสะอาด" ออกจาก hero (3 variants)

### 4. แก้ hero meta → "ข้อมูล X วัน · Y ครัวเรือน" (JS element ID ไม่ตรง HTML)

### 5. เก็บข้อมูลวันนี้ → grid cards 5 คอลัมน์แบบ mockup

### 6. Map legend ปรับคำอธิบายให้ชัด

### 7. วันที่ทุกจุด → DD/MM/YYYY

## TODO ค้าง
- Tuya Discovery → อัปเดต TUYA_APP_USER_UID บน Vercel
- DewS ต้อง Generate mock data (mock-data.html แก้ schema เสร็จแล้ว)
