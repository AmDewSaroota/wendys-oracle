# Handoff: EcoStove Admin UX Overhaul + Dashboard Polish

**Date**: 2026-02-27 16:00
**Context**: ~70%

## What We Did
- **Admin tab reorder**: อาสา → กลุ่มตัวอย่าง → เครื่องวัด → รออนุมัติ → ข้อมูลจากเซนเซอร์ → ประวัติกิจกรรม
- **Device swap UX**: เปลี่ยนจาก input Device ID → dropdown เลือก sensor สำเร็จรูป (MT13W/MT29) อาจารย์ไม่ต้องรู้ Device ID
- **Activity log**: เปลี่ยนจากแสดง sensor data → บันทึกกิจกรรม admin (approve/reject/add/delete/edit/export) เก็บใน localStorage
- **Modal popup**: เปลี่ยน alert()/confirm() ทั้งหมดเป็น showToast() + showConfirm() popup กลางจอ
- **Tab rename**: "ฐานข้อมูล" → "ข้อมูลจากเซนเซอร์"
- **Bug fix**: แก้ `\`` (escaped backtick) ใน showEditDeviceModal ที่ทำให้ JS พังทั้งหน้า
- **Deploy**: https://biomassstove.vercel.app (2 deploys — first broke, second fixed)

## Started But Incomplete (IN PROGRESS)
- แก้โลโก้ (ปรับขนาดแล้ว logo container w-12 h-12)
- เปลี่ยน nav "📊 เชิงลึก" → "📊 ข้อมูล" (done 3 places)
- **ยังไม่ได้ทำ**: ลบ CO/TVOC cards, เปลี่ยน chart labels, แผนที่แสดงบ้าน, compliance ภาษาไทย, admin login log

## Pending (จากข้อ 1-5 ของ DewS)
- [ ] **1. โลโก้**: ชื่อเดิมที่เดิม (logo.png) — ปรับขนาด container แล้ว, ยังไม่ deploy
- [ ] **2. Deep view overhaul**:
  - [x] เปลี่ยน "วิเคราะห์เชิงลึก" → "ข้อมูล" (nav + header)
  - [ ] ลบ CO (ppm) card จาก primary stat cards (line ~308-312)
  - [ ] ลบ TVOC (mg/m³) card จาก secondary stat cards (line ~334-337)
  - [ ] ลบ CO จาก `fields` array ใน updateResearchStats()
  - [ ] ลบ TVOC จาก `secFields` array ใน updateResearchStats()
  - [ ] เปลี่ยน "กลุ่ม PM" → "ค่า PM" (chart heading line ~343)
  - [ ] เปลี่ยน "กลุ่มก๊าซ" → "ค่าก๊าซ" (chart heading line ~347)
  - [ ] ลบ CO/TVOC จาก gas group chart data (renderGroupCharts)
  - [ ] ลบ CO/TVOC จาก reduction table (updateReductionTable)
  - [ ] **แผนที่ deep view**: โหลด subjects จาก Supabase แล้วแสดง marker ตาม gps_lat/gps_long
- [ ] **3. ตอบคำถาม**: ข้อมูลรออนุมัติจะมาเมื่อ sensor-monitor.js ทำงาน (ต้องรัน node sensor-monitor.js บนเครื่องที่ต่อ sensor)
- [ ] **4. Compliance ภาษาไทย**: เปลี่ยน complete/partial/missed/pending เป็น ครบ/บางส่วน/ขาด/รอ (ใน loadDailySummaries + loadComplianceTracker)
- [ ] **5. Admin login log**: เพิ่ม username field ใน login modal → logActivity('เข้าสู่ระบบ', username) เผื่อมีแอดมินหลายคน
- [ ] **Deploy** หลังทำครบ

## Key Files
- `lab/tuya-ecostove/deploy/index.html` — Dashboard SPA (ทุกอย่างอยู่ไฟล์เดียว ~1660 lines)
- `lab/tuya-ecostove/sensor-monitor.js` — Data collection engine
- `lab/tuya-ecostove/config.json` — Tuya/Supabase credentials
- `lab/tuya-ecostove/deploy/logo.png` — Logo file

## Technical Notes
- **JS parse error bug**: `\`` (escaped backtick) inside template literal `${}` expression ทำให้ทั้ง script ไม่ทำงาน → แก้เป็น string concatenation
- **Nested template literals**: `${arr.map(x => `...${x}...`)}` ทำงานได้ใน modern JS (V8 รองรับ) แต่ `\`` ในบริบทนี้จะเป็น syntax error
- **Activity log**: เก็บใน localStorage key `ecostove_activity_log` (max 200 entries)
- **KNOWN_SENSORS**: Pre-registered sensor list สำหรับ dropdown — เพิ่มตัวใหม่ได้ที่ array `KNOWN_SENSORS`
- **Vercel**: prj_gCJvkjqD8zqIqT5WzwtblafgOR4T / team_fbkFUw6EAqnbeEcSeYHv3FBV
