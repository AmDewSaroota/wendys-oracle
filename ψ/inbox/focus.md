# Focus

## Current State

**Status**: ZN-MT29 Integration COMPLETE!
**Date**: 2026-01-24

---

## โปรเจค ZN-MT29 → EcoStove: สำเร็จแล้ว!

### สิ่งที่ทำสำเร็จ
1. ✅ เชื่อมต่อ Tuya API (Singapore Data Center)
2. ✅ ดึงข้อมูลจากเครื่อง ZN-MT29
3. ✅ ส่งข้อมูลเข้า Supabase (pollution_logs)
4. ✅ เว็บ EcoStove แสดงผลได้

### ไฟล์ที่สร้าง
- `lab/tuya-ecostove/sync_to_supabase.js` — ดึง Tuya + ส่ง Supabase
- `lab/tuya-ecostove/fetch_air_quality.js` — ดึง Tuya อย่างเดียว

### วิธีใช้
```bash
cd lab/tuya-ecostove
bun sync_to_supabase.js
```

---

## ขั้นตอนถัดไป (ถ้าต้องการ)

- [ ] ตั้ง auto-sync ทุก 5 นาที
- [ ] เพิ่ม device_id ใน Supabase
- [ ] รองรับหลายเครื่องวัด

---

*Updated: 2026-01-24*
