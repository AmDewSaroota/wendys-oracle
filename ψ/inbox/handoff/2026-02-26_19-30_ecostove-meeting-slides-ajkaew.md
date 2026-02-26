# Handoff: EcoStove — สไลด์สรุปคุย อ.แก้ว

**Date**: 2026-02-26 19:30
**Context**: 90%

## What We Did

### สไลด์คุย อ.แก้ว (11 หน้า)
- **สร้าง `lab/tuya-ecostove/ecostove-meeting-ajkaew.html`** — สไลด์ 11 หน้าสำหรับคุยกับ อ.แก้ว
- จัดลำดับ: แจ้ง → ถาม → Next Steps
- อัปเดตราคาเซนเซอร์จาก 1,500-2,500 → **800-1,100 ฿** (ซื้อจริง 711 ฿)
- อัปเดต API calculation: 14,400 / 26,000 calls (buffer 45%) — ใช้ 1 call/poll ไม่ใช่ 3
- เพิ่มหน้า Offline Handling — 5 สถานการณ์พร้อม flow + ผลลัพธ์
- เพิ่มหน้า LINE แจ้งเตือน — แยก 3 กลุ่ม (ชาวบ้าน/อาสา/อาจารย์) + mockup
- เพิ่มหน้า Dashboard + Approve workflow — Session Timeline, Daily Summary, Export, Batch Approve, Admin Config
- แผนเก็บ 6 เดือน (3 เดือนเตาเก่า + 3 เดือน EcoStove)

### ข้อมูลสำคัญที่ clarify ระหว่าง session
- เซนเซอร์มีแบต → ไฟดับไม่ดับ แต่เราเตอร์ดับ = เน็ตหลุด
- ชาวบ้านเปิดปิดเตาเอง → ไม่สามารถกำหนดเวลาทำอาหารได้ → **ต้องคุย อ.แก้ว เรื่องวิธีจัดการ**
- อาสา นัดเวลากับชาวบ้านเอง (ไม่ใช่ระบบสั่ง)
- เซนเซอร์เสีย → ต้อง update config (map device ID ใหม่) ~10 นาที
- USB แถมมา / Adapter ต้องซื้อแยก
- วัดได้ 8 ค่า: PM2.5, PM10, PM1, CO2, HCHO, AQI, °C, %RH

## Pending
- [ ] คุยกับ อ.แก้ว (สไลด์พร้อมแล้ว)
- [ ] SQL migration (sessions + daily_summaries tables)
- [ ] Code session management (state machine)
- [ ] ปรับ Dashboard HTML ตาม plan ในสไลด์
- [ ] LINE OA + Messaging API setup
- [ ] เลือก + เซ็ต server (Oracle Cloud / NIPA)
- [ ] คู่มือเซนเซอร์ (ชาวบ้าน + อาสา)
- [ ] PM2 install + setup

## Next Session
- [ ] Review สไลด์กับ DewS อีกรอบก่อนคุย อ.แก้ว
- [ ] หลังคุย อ.แก้ว → อัปเดตคำตอบลงสไลด์/plan
- [ ] เริ่ม SQL migration ถ้าพร้อม
- [ ] เริ่ม code session management

## Key Files
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์คุย อ.แก้ว (v2, 11 หน้า)
- `lab/tuya-ecostove/ecostove-deployment-plan.html` — สไลด์ deployment v1 (9 หน้า, เก่า)
- `lab/tuya-ecostove/sensor-monitor.js` — Main server
- `lab/tuya-ecostove/config.json` — Credentials (gitignored)
- `ψ/memory/logs/info/2026-02-26_14-30_ecostove-session-management-design.md` — Session design

## Key Decisions Made This Session
- ราคาเซนเซอร์: **800-1,100 ฿** (ซื้อจริง 711 ฿ โปร)
- 2 sessions/day × 2h10m = 14,400 API calls/month (within 26,000 limit)
- เก็บข้อมูล **6 เดือน** (3 เตาเก่า + 3 EcoStove)
- วัดทุกค่าที่เซนเซอร์มี (8 ค่า)
- Dashboard: ต้องมี, real-time ถ้าได้
- เปรียบเทียบ: เตาเดิม vs EcoStove (before/after)
- Timeline: ไม่รัดตัว — เริ่มเมื่อ อ.แก้ว สะดวก
