# WEnDyS Memory

## Identity
- WEnDyS เป็น **ผู้หญิง** — ใช้ "ค่ะ" / "คะ" เมื่อพูดภาษาไทย (ไม่ใช่ "ครับ")
- **DewS เป็นผู้หญิง** — เวลาเขียนข้อความแทน DewS ต้องใช้ "ค่ะ" / "คะ" (ห้ามใช้ "ครับ")
- Soul file อยู่ที่ `ψ/memory/resonance/wendys.md` — อ่านทุกครั้งที่เริ่ม session

## Quick-Start Commands
- **"มังกร"** หรือ **"Seedance"** → โหลด `ψ/lab/vdrama/seedance-prompt-guide.md` ทันที
- **"xskill"** หรือ **"ยิง API"** → โหลด `ψ/lab/vdrama/xskill-seedance-api.md` แล้วพร้อมยิง API สร้างวิดีโอ
- ใช้ **English prompts** ผ่าน **Dreamina web UI** (dreamina.capcut.com)
- **Jimeng** (即梦) = Dreamina เวอร์ชันจีน — DewS ใช้สลับกัน (jimeng รีทุกวัน ได้ credit ฟรี)

## UI Text Guidelines
- ใช้**คำกลางๆ** เสมอ — ห้ามอ้างอิง "อาจารย์", "ชาวบ้าน", หรือบุคคลเฉพาะ

## Machines (WEnDyS Twins)
- **พี่เวนดี้** 💻 = โน้ตบุ๊ค (DewSNitro) — เครื่องหลัก
- **น้องเวนดี้** 🖥️ = PC — เครื่องรอง
- ใช้ `/sync push` + `/sync pull` เพื่อ sync skills + memory ระหว่างเครื่อง

## Company
- DewS's company: **NDF** (ไม่ใช่ Radical Enlighten)

## EcoStove — Overview
- **Sensor หลัก**: MT15 (Laser Scattering), BS 001-012
- **เฟสแรก**: 10 บ้าน, Cloud Tuya, อาสาเปิด Hotspot
- **รายละเอียดเทคนิค**: → `memory/ecostove-technical.md`

### ⚠️ Dashboard Full Lock (DewS, 2026-04-20)
- **ทุกหน้าล็อคแล้ว** — ห้ามเปลี่ยนอะไรที่มีอยู่
- **ทำได้**: แก้ bug + เพิ่มของใหม่ตาม REQ จาก อ.แก้ว + ทีม เท่านั้น
- ⚡ **ถ้า DewS สั่งเปลี่ยนอะไร → ต้อง REMIND ว่าล็อคอยู่**

### Map & Export (updated 2026-04-27)
- ทั้ง 2 แผนที่ใช้ **OSM tiles** แล้ว (ไม่ใช่ CARTO Voyager)
- สามเหลี่ยม (sensor) ใช้ **SVG** ไม่ใช่ clip-path (html2canvas ไม่รองรับ clip-path)
- Export PNG ทำงานปกติกับ OSM tiles (ไม่มีปัญหา CORS)
- รายละเอียดสี/รูปทรง → `memory/ecostove-technical.md`

### Guide & Documentation Rules (DewS, 2026-04-27)
- ม้อคอัพต้องเป็น **CSS mockup ตรงกับ UI จริง** — ห้ามใช้ screenshot
- Frequency mockup ต้องอยู่**ใน subjects tab** ไม่ใช่แยก standalone (misleading)
- **"คู่มือ"** = แท็บแอดมิน > คู่มือ (ใน index.html)
- **"คู่มืออาสา"** = โหมดอาสา (volunteer.html)

### EcoStove Deploy
- **ต้อง deploy มือทุกครั้ง** (Vercel auto-deploy ไม่ทำงาน)
- คำสั่ง: `cd lab/tuya-ecostove/deploy && npx vercel --prod --yes`
- LINE OA: `cd lab/line-oa && npx vercel --prod --yes`
- ⚠️ Vercel CLI login: `biomassstove.cmru@gmail.com`

### EcoStove Session Limit
- **MAX 2 sessions/device/day** — ประหยัด API quota
- รายละเอียด flow → `memory/ecostove-technical.md`

### ⏰ Tuya IoT Core Renewal
- **หมดอายุ: 2026-10-17** — เตือน DewS เดือนตุลาคม 2026
- Login: `biomassstove.cmru@gmail.com`

### EcoStove TODO (ค้างไว้)
- ⏳ คู่มือ: เพิ่มวิธีแอดเตา/ผูกเตา (DewS ฝากไว้ 2026-04-21)
- ✅ Migration 028-032 — รันแล้วทั้งหมด (DewS ยืนยัน 2026-04-27)
- ✅ preview-map.html — ลบแล้ว ไม่ใช้แล้ว (2026-04-27)
- ⏳ LINE Dev + Google Account recovery → รอส่งมอบ

### EcoStove Project Account
- Email: `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`

### ⚠️ WEnDyS Self-Correction Rules (2026-03-20)
- **ห้ามบอก % ความพร้อมโดยไม่ตรวจโค้ดจริง** — ต้อง audit ก่อนพูด
- **ห้ามบอกว่า "ยังไม่ได้ทำ" โดยไม่เช็คก่อน** — DewS อาจทำไปแล้ว
- **ห้ามพูดจากความจำอย่างเดียว** — ต้อง verify กับ source of truth
- **ถ้าไม่แน่ใจ บอกว่าไม่แน่ใจ** — อย่าพูดเหมือนมั่นใจ
- **ห้าม remind สิ่งที่แก้ไปแล้วซ้ำ** (DewS สั่ง 2026-04-18)

## NDF Quotation (ใบเสนอราคา)
- รายละเอียดเต็ม: `memory/ndf-quotation-format.md`
- Template: `ψ/active/build-quotation.js` + assets ใน `ψ/active/`
- Font: **Sarabun** (embedded base64), PDF via Edge `--headless=new`
- Boss: **ภิญโญ ตัณรัตนมณฑล**

## SRT Slides / Presentation
- Deploy: `https://srt-slides.vercel.app/` (password: `ndfai`)
- ไฟล์สไลด์: `e:\01_Work\_NDF\SMART RAIL TOURISM ASSISTANT\`
- Palette: navy #1a3f6f, blue #2e74b5, teal #3a7ca5, orange #e67e22, green #27ae60

## SWT Project (Smart Tourism)
- ลูกค้า: การรถไฟ (SRT)
- NDF scope: Core Dashboard + Core DB + Auth + Kiosk + Mobile App + Admin Dashboard
