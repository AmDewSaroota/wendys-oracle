# Handoff: EcoStove Slides Polish + Dashboard TVOC Tab + QR Code

**Date**: 2026-03-11 17:30
**Context**: 85%

## What We Did

### Dashboard (`deploy/index.html`) — Major Changes
1. **แยก TVOC เป็น tab ใหม่** — มี filter (บ้าน/ประเภทเตา/ช่วงวัน), stat cards, Chart.js chart, ตาราง TVOC เฉพาะ
2. **Split sensor filter** เป็น 2 dropdown (เครื่อง + บ้าน) แทน dropdown เดียว
3. **เอา TVOC column ออก** จากตารางเซนเซอร์ (ไปอยู่ tab แยก)
4. **SVG sparkline** + min/avg/max ใน pending session cards
5. **เอาไอคอนออก** จาก nav "ข้อมูลเชิงลึก", tab "เซนเซอร์", tab "TVOC" — เหลือไอคอนแค่ "📱 อาสาสมัคร"
6. **เพิ่ม nav links**: "📑 สไลด์" → `/slides.html`, "QR Code" → `/qr.html` (admin tab)

### Slides (`ecostove-weekly-update-wk1.html`) — 12 slides (was 11)
1. **เพิ่ม Slide 9** — เปรียบเทียบ Pocket WiFi (4 รุ่น) + ซิมเน็ตรายปี (4 แพ็กเกจ) จาก Google Doc research
2. **เพิ่ม Slide 8** — สเปคมือถือขั้นต่ำ + 3 รุ่นแนะนำ
3. **แก้ราคา Pocket WiFi** ตามข้อมูลล่าสุด: ~1,390–1,690 → ~990–1,490 ฿
4. **แก้ "โทร 10 นาที"** → "มีเบอร์โทร — ใช้ติดต่อประสานงานได้" (10 นาที/ปี น้อยเกินไม่ควรพูดถึง)
5. **เพิ่มข้อดีแผน A**: "✅ ใช้มือถือได้ปกติขณะปล่อย Hotspot"
6. **เอา "เน็ตประชารัฐ" ออก** จากสไลด์คำถาม
7. **แก้ "กี่หลัง eco/old"** → "3 เดือนแรกเตาเก่า → 3 เดือนหลังเตาใหม่"
8. **แก้ Baseline** จากคำถาม → "เก็บ 10 นาที ก่อนจุดเตา"
9. **แก้ตาราง session** — วันเก็บ: อาจารย์ตกลงกับอาสา / 2 session/วัน / 6 เดือน
10. **เพิ่ม Slide 4** — "ระบบรองรับ 300+ บ้าน — เฟสแรก 10 บ้าน ขยายได้ทันที"
11. **เพิ่ม Slide 5** — card "🔐 ระบบสมัครแอดมิน" + flow 3 ขั้นตอน (5 cards grid)

### QR Code System (ใหม่)
- **`deploy/qr.html`** — หน้า printable QR Code สำหรับแปะเครื่องเซนเซอร์
- **`volunteer.html`** — รองรับ `?house=ID` URL parameter (สแกน QR → เลือกบ้านอัตโนมัติ)
- QR สีเขียวเข้ม (#064e3b) match branding

### Deployed
- ทุกอย่าง deploy แล้วที่ `biomassstove.vercel.app` (ยกเว้นแก้ไขล่าสุด 2-3 จุดที่ DewS บอกรอ)

## Pending (ยังไม่ deploy)
- [ ] Slide 5: card ระบบแอดมิน (เพิ่มแล้ว ยัง re-copy + deploy ไม่ได้)
- [ ] Slide 11 คำถาม: แก้ baseline + ตาราง session + เอาเน็ตประชารัฐออก
- [ ] Slide 4: เพิ่ม 300+ บ้าน
- [ ] **ทั้งหมดแก้ใน source แล้ว** รอ DewS บอก deploy

## Pending (ยังไม่ได้ทำ)
- [ ] ทดสอบ TVOC tab + sensor filter ใหม่ใน Dashboard (DewS ยังไม่ได้ test)
- [ ] ทดสอบ QR Code page — พิมพ์จริง / สแกนจริง
- [ ] ทดสอบ volunteer.html?house=ID flow
- [ ] Git commit session นี้
- [ ] เรื่อง API quota — ยืนยันว่า sync.js เช็ค Supabase ก่อน Tuya (ประหยัด quota)

## Next Session
- [ ] DewS บอก deploy → cp slides.html + vercel --prod
- [ ] DewS ทดสอบ Dashboard TVOC tab
- [ ] DewS ทดสอบ QR page + volunteer ?house= flow
- [ ] Review สไลด์ทั้งหมดก่อนประชุมอ.แก้ว (13 มี.ค.)
- [ ] (ถ้ามีเวลา) ตรวจสอบ sync.js ว่าเช็ค session limit จาก Supabase ก่อนเรียก Tuya API จริง

## Key Files
- `lab/tuya-ecostove/ecostove-weekly-update-wk1.html` — slides source (12 slides)
- `lab/tuya-ecostove/deploy/slides.html` — deployed copy (อาจ outdated ถ้ายังไม่ re-copy)
- `lab/tuya-ecostove/deploy/index.html` — admin dashboard
- `lab/tuya-ecostove/deploy/volunteer.html` — volunteer app (+QR support)
- `lab/tuya-ecostove/deploy/qr.html` — QR code printable page (ใหม่)
- `lab/tuya-ecostove/deploy/api/sync.js` — data sync API
