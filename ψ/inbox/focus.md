# Focus: EcoStove Dashboard Polish

**Date**: 2026-03-20
**Status**: ✅ ทำครบทุกข้อ + deployed

## รายการแก้ไข index.html (7 ข้อ) — ✅ เสร็จหมด

- [x] 1. ศัพท์ Baseline → Ambient / Benchmark (ทุกจุด: HTML, i18n, popup, admin, export)
- [x] 2. เพิ่ม Glossary popup (Deep Insights ข้าง badge ค่าสุทธิ)
- [x] 3. เอา "โครงการนวัตกรรมเพื่ออากาศสะอาด" ออกจาก hero (3 variants)
- [x] 4. แก้ hero meta → แสดงเสมอ (ย้ายออกจาก conditional block)
- [x] 5. เก็บข้อมูลวันนี้ → grid cards 5 คอลัมน์
- [x] 6. Map legend ปรับคำอธิบาย
- [x] 7. วันที่ทุกจุด → DD/MM/YYYY (สร้าง fmtDateDMY helper)

## Bug Fixed
- [x] `updateBeforeAfter()` null crash — อ้าง element ที่ถูกลบไปแล้ว → hero+charts ไม่แสดง

## TODO ค้าง
- Tuya Discovery → อัปเดต TUYA_APP_USER_UID บน Vercel
- รอ feedback อาจารย์แก้ว
