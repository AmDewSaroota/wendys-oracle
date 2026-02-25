# Handoff: EcoStove Sensor Monitor App

**Date**: 2026-02-25 10:45
**Context**: 70%

## What We Did
- สร้าง `sensor-monitor.js` — Web UI + Node.js server สำหรับดึงข้อมูลเซนเซอร์ Tuya
  - ปุ่ม: เช็คสถานะ / เริ่มเก็บข้อมูล / หยุด
  - SSE real-time updates ไปหน้าเว็บ
  - ดึงข้อมูลทุก 5 นาที → บันทึกลง Supabase pollution_logs
  - Auto-start collection เมื่อ server เปิด
  - Auto-open browser เมื่อ server start
- สร้าง `EcoStove Monitor.bat` — launcher สำหรับ Windows
  - Auto-restart ถ้า crash
  - เช็ค port ซ้ำ (ไม่เปิดซ้อน)
  - ใช้ absolute path (วางใน Startup folder ได้)
- สร้าง `EcoStove Monitor (Hidden).vbs` — รัน background ไม่เห็นหน้าต่าง
- ลอง Electron app แล้วไม่สำเร็จ (Node.js v24 incompatible) → ลบแล้ว
- วางแล้วใน Windows Startup folder → เปิดเครื่องมารันเอง
- คุยเรื่อง deployment จริงสำหรับ อ.แก้ว:
  - ใช้ Tuya ID เดียว + Home Sharing สำหรับอาสาสมัคร
  - แผนรับมือ Tuya purge (3 ระดับ)
  - Hotspot method สำหรับ 10 บ้านไม่มี WiFi

## Pending
- [ ] เปลี่ยนจาก .bat ไปใช้ PM2 (วิธีมาตรฐาน)
- [ ] ทำให้ Device list เป็น config file (ไม่ hardcode)
- [ ] รองรับ 10 เซนเซอร์ (ตอนนี้ hardcode 2 ตัว)
- [ ] ทดสอบ Windows Startup ว่าทำงานจริง (อาจมีปัญหา network ไม่พร้อมตอน boot)
- [ ] อัพเดท Dashboard (ecostove-with-sensor.html) ให้รองรับ multi-device
- [ ] คู่มืออาสาสมัคร (วิธีเปิด Hotspot + เช็คเซนเซอร์)

## Next Session
- [ ] สร้าง `config.json` สำหรับ device list (แยก credentials ออกจากโค้ด)
- [ ] ตั้ง PM2 แทน .bat (auto-restart + startup service)
- [ ] ทำ deployment guide สำหรับ อ.แก้ว (step-by-step)
- [ ] พิจารณา Tuya Local Protocol เป็น backup plan

## Key Files
- `lab/tuya-ecostove/sensor-monitor.js` — Main server + Web UI
- `lab/tuya-ecostove/EcoStove Monitor.bat` — Windows launcher
- `lab/tuya-ecostove/EcoStove Monitor (Hidden).vbs` — Hidden launcher
- `lab/tuya-ecostove/sync_to_supabase.js` — Original sync script (reference)
- `lab/tuya-ecostove/supabase/functions/fetch-sensor/index.ts` — Edge Function

## Architecture Decision
```
Current:  Sensor ──WiFi──► Tuya Cloud ──API──► sensor-monitor.js ──► Supabase
                                                    ↑
                                            localhost:3456 (Web UI)
```

## Notes
- Electron ไม่ทำงานกับ Node.js v24 — require('electron') return string แทน module
- เซนเซอร์ทั้ง 2 ตัว (MT13W + MT29) online ทดสอบได้ปกติ
- Supabase anon key + Tuya credentials hardcoded ในโค้ด → ต้องย้ายไป config
