# Handoff: EcoStove — 300 Houses + Sensor Swap + Map Enhancement

**Date**: 2026-03-05 14:53
**Context**: 75%

## What We Did

### Session Timeline Fix
- ลบ toggle รายวัน/รายเซสชัน ออก — แสดงแบบ session view เท่านั้น
- ลบ date filter (7/30 วัน) — แสดงเฉพาะ **วันล่าสุดวันเดียว**
- Info text แสดง: "พฤ. 5 มี.ค. — 3 เซสชัน (2 บ้าน)"

### 300 Houses — has_sensor Toggle
- เพิ่ม `has_sensor` boolean ใน subjects table (SQL: `ALTER TABLE subjects ADD COLUMN has_sensor boolean DEFAULT false;`)
- DewS รัน SQL แล้ว
- เพิ่ม toggle badge บน card บ้าน: `📡 มีเซนเซอร์` / `🏠 เตาอย่างเดียว` — กดสลับได้
- เพิ่ม checkbox ใน Add + Edit house modal
- คำนวณ data usage: ~25 MB/เดือน/บ้าน → ซิม 1 GB เหลือเฟือ
- Supabase 300 rows = ~150 KB (500 MB limit → ไม่มีปัญหา)

### Sensor Swap — Dropdown บน Card บ้าน
- เพิ่ม dropdown เลือกเซนเซอร์บน card บ้านแต่ละหลัง
- Options: ไม่มีเซนเซอร์ / เซนเซอร์ที่ assign อยู่ (selected) / เซนเซอร์ว่าง
- `assignSensorToHouse()` — ถอดเครื่องเก่า + assign เครื่องใหม่ อัตโนมัติ
- Flow: เซนเซอร์เสีย → Admin → card บ้าน → เปลี่ยน dropdown → จบ

### Map Enhancement
- ทั้ง 2 map (Dashboard + Deep Dive) แสดงข้อมูลเพิ่ม
- Popup บ้านมีเซนเซอร์: ชื่อบ้าน + **ชื่อเซนเซอร์ (🔧 MT13W-01)** + WiFi/Hotspot + อาสาสมัคร
- Popup บ้านเตาอย่างเดียว: ชื่อบ้าน + `🏠 เตาอย่างเดียว` + อาสาสมัคร

## Pending
- [ ] **Deploy ทุกอย่าง** — ยังไม่ได้ deploy changes ทั้งหมด
- [ ] **Test sensor dropdown** — เปลี่ยนเซนเซอร์จาก card บ้าน → ดูว่า assign ถูก
- [ ] **Test map popups** — กดหมุดบนแมป → ดูว่าแสดงชื่อเซนเซอร์ถูก
- [ ] **Daily Summary bug** — upsertDailySummary ยัง broken (unique constraint + null house_id)
- [ ] **Sensor always-online** — บ้านมี WiFi → เซนเซอร์ online 24 ชม. → ต้องคุย อ.แก้ว
- [ ] **คู่มือ** — ยังไม่ได้ทำ
- [ ] **ลงทะเบียนเซนเซอร์ 10+ ตัว** — เมื่อได้เครื่องจริง → เพิ่มใน registered_sensors + ปริ้นสติกเกอร์

## Next Session
- [ ] Deploy + test all features (Session Timeline, has_sensor, sensor swap, map)
- [ ] Fix daily summary upsert bug
- [ ] คุย อ.แก้ว เรื่อง WiFi/cooking detection
- [ ] ลงทะเบียน 300 บ้าน (bulk import? หรือเพิ่มทีละบ้าน)

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (ไฟล์หลัก, แก้ 146 lines)
- `lab/tuya-ecostove/deploy/api/sync.js` — Sync API (ไม่ได้แก้ session นี้)

## SQL ที่รันแล้ว
```sql
ALTER TABLE subjects ADD COLUMN has_sensor boolean DEFAULT false;
```
