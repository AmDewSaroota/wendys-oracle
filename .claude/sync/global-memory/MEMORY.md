# WEnDyS Memory

## Identity
- WEnDyS เป็น **ผู้หญิง** — ใช้ "ค่ะ" / "คะ" เมื่อพูดภาษาไทย (ไม่ใช่ "ครับ")
- **DewS เป็นผู้หญิง** — เวลาเขียนข้อความแทน DewS ต้องใช้ "ค่ะ" / "คะ" (ห้ามใช้ "ครับ")
- Soul file อยู่ที่ `ψ/memory/resonance/wendys.md` — อ่านทุกครั้งที่เริ่ม session

## UI Text Guidelines
- ใช้**คำกลางๆ** เสมอ — ห้ามอ้างอิง "อาจารย์", "ชาวบ้าน", หรือบุคคลเฉพาะ
- ตัวอย่าง: "กดเมื่อเริ่มจุดเตา" (ไม่ใช่ "กดเมื่อเห็นชาวบ้านจุดเตา")

## Machines (WEnDyS Twins)
- **พี่เวนดี้** 💻 = โน้ตบุ๊ค (DewSNitro) — เครื่องหลัก
- **น้องเวนดี้** 🖥️ = PC — เครื่องรอง
- ใช้ `/sync push` + `/sync pull` เพื่อ sync skills + memory ระหว่างเครื่อง
- เมื่อหาไฟล์ไม่เจอ ให้บอก DewS ว่าอาจอยู่ที่พี่หรือน้อง

## Company
- DewS's company: **NDF** (ไม่ใช่ Radical Enlighten)

## EcoStove — Tuya Sensors

| Device | ID | Product | Battery | Notes |
|--------|-----|---------|---------|-------|
| **MT15 (หลัก)** | `a31aff2ac0acbbf911cee3` | PM2.5/PM10/CO2/CO/HCHO/Temp/Humidity/AQI | **2000mAh** | **Laser Scattering** — PM ไว, ✅ pair+สติกเกอร์แล้ว, BS 001-012 |
| MT13W (เดิม) | `a3d01864e463e3ede0hf0e` | PM2.5/PM10/CO2/CO/HCHO/Temp/Humidity/AQI (**ไม่ส่ง TVOC**) | **2000mAh** | **IR sensor** — PM ไม่ไว, **ไม่ใช่ตัวหลักแล้ว** |
| PV28 Air Detector | `a39e1d85867b719abc10av` | CO2/PM2.5/VOC/HCHO/Temp/Humidity | **800mAh** | **Laser Scattering**, ไม่มี CO/PM10 |

### PV28 vs MT13W — Data Point Mapping
- **MT13W ไม่ส่ง TVOC ขึ้น cloud** → ถึงต้องกรอกมือ, PV28 ส่ง `voc_value` ได้จริง (ข้อดีหลัก)
- PV28 ไม่มี: `co_value`, `pm10`, `pm1`, `air_quality_index`
- HCHO scale **เดียวกัน** (ยืนยัน 2026-03-31: PV28=4, MT13W=3 ห้องเดียวกัน)
- Tuya API v1.0 `/v1.0/users/{uid}/devices` → **permission deny แล้ว (2026-03-31)** ต้องใช้ v2.0 `/v2.0/cloud/thing/device`

### EcoStove Direction (อ.แก้ว, 2026-02)
- ใช้ **Cloud Tuya** + sensor **MT15** (เปลี่ยนจาก MT13W แล้ว, DewS ยืนยัน 2026-04-17)
- เฟสแรก: **10 บ้าน**
- ไม่มี WiFi → อาสาเปิด Hotspot ขณะเก็บข้อมูล
- API limit 26,000/เดือน → ~21,600 ถ้า 10 ตัว (2 ครั้ง/วัน, 3 ชม.)

### EcoStove Dashboard Direction (อ.แก้ว, 2026-03-18)
- **เตาใหม่ (eco) = พระเอก** → แสดงเด่นชัด, ชูโรง
- **เตาเก่า (old) = คู่เทียบ** → แค่ baseline reference บอกว่าปกติค่าเท่าไหร่
- สิ่งที่ต้องแสดง = **ความต่างที่เตาใหม่สร้างขึ้น** (ลดมลพิษได้เท่าไหร่)
- ไม่ใช่แค่ค่าเฉลี่ยทั้งหมด → ต้องเห็น **impact ของเตาใหม่**
- อยากได้ **daily sensor readings** ที่หน้าข้อมูลเบื้องต้น
- เพิ่ม **CO (carbon monoxide) manual input** — Tuya วัด CO2 ได้ แต่ไม่วัด CO → ต้องกรอกมือเหมือน TVOC

### ⚠️ Dashboard Layout Lock (DewS, 2026-03-18)
- **หน้าเชิงลึก (Deep Insights)** → **ล็อค layout** ห้ามเปลี่ยนการจัดเรียง
- **หน้าแอดมิน** → **ล็อค layout** ห้ามเปลี่ยนการจัดเรียง
- **เปลี่ยนได้**: รูปแบบการแสดงผล, filter, แสดงมากขึ้น/น้อยลง, performance, **chart type** (เช่น เปลี่ยนจาก raw→daily avg)
- **ข้อยกเว้น**: หน้า**ข้อมูลเบื้องต้น (Basic)** → เปลี่ยนได้ตาม feedback อาจารย์
- ⚡ **ถ้า DewS สั่งเปลี่ยน layout หน้าที่ล็อค → ต้อง REMIND เสมอ**

### EcoStove Cron
- ใช้ **cron-job.org** (external) เรียก `/api/sync` ทุก 5 นาที — ไม่ใช่ Vercel Cron
- Vercel อยู่ Hobby plan → cron ได้แค่วันละครั้ง ใช้ไม่ได้
- vercel.json ไม่ต้องมี crons config
- ✅ **ย้ายแล้ว (2026-03-21)** → บัญชี `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`
- URL: `https://biomassstove.vercel.app/api/sync?secret=ecostove-sync-2026`
- CRON_SECRET: `ecostove-sync-2026`

### EcoStove Deploy
- **Vercel auto-deploy ไม่ทำงาน** — ต้อง deploy มือทุกครั้ง
- คำสั่ง: `cd lab/tuya-ecostove/deploy && npx vercel --prod --yes`
- LINE OA deploy: `cd lab/line-oa && npx vercel --prod --yes`
- หลัง git push ต้องรัน deploy เองเสมอ
- ⚠️ **Vercel CLI ต้อง login เป็น account โครงการ** (`biomassstove.cmru@gmail.com`) ไม่ใช่ DewS ส่วนตัว

### EcoStove Platform Migration (2026-03-21)
- ✅ **cron-job.org** → `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`
- ✅ **Vercel** (ทั้ง ecostove-cmru + line-oa) → account `biomassstove.cmru@gmail.com`
  - ecostove-cmru: `biomassstove.vercel.app`
  - line-oa: `line-oa-inky.vercel.app`
- ✅ **Supabase** → transfer ไป BioMassStove's Org (URL/key ไม่เปลี่ยน)
- ✅ **Tuya IoT** → ย้ายแล้วก่อนหน้า (2026-03-18)
- ⏳ **LINE Dev** → รออาจารย์แก้ว (ต้องได้ LINE Account ของคนรับมอบ)
- ⏳ **Google Account recovery** → เปลี่ยน recovery email + เบอร์ ตอนส่งมอบ

### EcoStove TODO (ค้างไว้)
- ⏳ **ถ้าเปลี่ยนเป็น PV28** → ต้องทำสติกเกอร์วิธีใช้ใหม่ + อัพเดทคู่มืออาสา (รอ อ.แก้วตัดสินใจ + รอ MT15 มาเทียบ อาทิตย์หน้า)
- ✅ **Tuya "permission deny" — แก้แล้ว (2026-03-23)**
  - สาเหตุ: โปรเจคใหม่ (biomassstove.cmru) สร้างแบบ **Smart Home** → ไม่มีสิทธิ์ใช้ Industry API (`/v1.0/iot-03/`)
  - แก้: เปลี่ยน sync.js ใช้ `/v1.0/users/{uid}/devices` (Smart Home API) — 1 call ได้ทุกเครื่อง
  - sync.js ตอนนี้ต้องการ env: `TUYA_APP_USER_UID` ด้วย (เดิมใช้แค่ tuya-devices.js)
  - **บทเรียน**: ห้ามเดาชื่อ API product ของ Tuya — ต้อง verify จากหน้าจอจริง

### EcoStove LINE OA
- **Deploy แล้ว** → `line-oa-inky.vercel.app` (Vercel project แยก)
- Bot: "EcoStove Test" (`@711vcedr`)
- Endpoints: webhook, push/broadcast, summary preview, debug
- **ใช้ Vercel Cron** (ไม่ใช่ cron-job.org) — Hobby plan รองรับ 2 cron/project
  - morning: 05:00 UTC (เที่ยงไทย) — สรุป session เช้า
  - evening: 13:00 UTC (2ทุ่มไทย) — สรุปทั้งวัน
- Cron endpoints ไม่มี auth (Vercel cron เรียกภายใน)
- PUSH_SECRET: `ecostove-line-2026` (สำหรับ /api/push)
- Env vars: LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, SUPABASE_URL, SUPABASE_KEY, CRON_SECRET, PUSH_SECRET

### EcoStove Session Limit (สำคัญมาก!)
- **MAX 2 sessions/device/day** — ห้ามเกิน! ประหยัด API quota
- Flow: Session 1 (2h10m) → cooldown 5h → Session 2 (2h10m) → daily-limit → หยุด
- sync.js ต้องเช็ค: online check → session limit → cooldown → ถึงค่อย collect
- ห้าม insert log ตอน cooldown/cutoff/daily-limit
- LINE notification: ไม่ส่ง reminder เปิดเซนเซอร์ → ส่งเฉพาะ **สรุปผลเก็บข้อมูล**
  - เที่ยง: สรุป session เช้า (บ้านไหนไม่ได้เปิด)
  - 2 ทุ่ม: สรุป session เย็น (บ้านไหนไม่ได้เปิด)
  - อ.แก้วจะแจ้งอาสา/กลุ่มตัวอย่างเอง

### ⏰ Tuya IoT Core Renewal Deadline
- **หมดอายุ: 2026-10-17** — ต้อง extend ก่อน! (extend ครั้งล่าสุด 2026-04-17)
- ไปที่ www.tuya.com/vas/user/service → Extend Trial Period
- Login: `biomassstove.cmru@gmail.com`
- ⚠️ **เตือน DewS ตั้งแต่ session แรกของเดือนตุลาคม 2026**

- Tuya API: Singapore Data Center (`openapi-sg.iotbing.com`)
- **Tuya โครงการ (ใหม่):** Access ID `8grdqadptymnyeqdduxx` — บัญชี biomassstove.cmru@gmail.com
- Tuya ส่วนตัว DewS (เก่า): Access ID `7dudg9tg3cwvrf8dx9na` — จะ phase out
- **Migration:** ✅ เสร็จแล้ว (2026-03-18) — pair เซนเซอร์แล้ว + เปลี่ยน env บน Vercel แล้ว

### EcoStove Standard Hotspot (สำหรับ pair เซนเซอร์)
- ชื่อ Hotspot: **`Biomass`**
- รหัสผ่าน: **`Biomass2026`**
- ย่านความถี่: **2.4 GHz เท่านั้น** (ห้าม 5GHz)
- อาสาทุกคนตั้ง Hotspot มือถือเป็นชื่อ/รหัสนี้เหมือนกันหมด
- เซนเซอร์ pair ครั้งเดียว → อาสาเปิด Hotspot ชื่อเดียวกัน เชื่อมต่อเองอัตโนมัติ
- **Naming rule**: DewS สั่งเปลี่ยนทุก "Eco" → "Biomass" ทั้งโปรเจค

### EcoStove Sensor Naming
- Naming convention: **BS XXX** (BS 001 ถึง BS 012) — เปลี่ยนจาก ES-XX แล้ว
- BS = Biomass Stove, ไม่ผูกรุ่น/บ้าน → ย้ายเครื่องได้
- BS number = **MT15** number (1:1 mapping, ตาม Tuya Device ID) — เปลี่ยนจาก MT13W แล้ว
- ใช้ใน `devices.name` + `registered_sensors.name`
- Sticker generator: `lab/tuya-ecostove/deploy/stickers.html`
- QR บนสติกเกอร์ → `biomassstove.vercel.app/volunteer.html` (URL เดียวทุกตัว, GPS detect บ้าน)
- **สติกเกอร์แปะได้เลย** — Tuya Device ID เป็น hardware-level ไม่เปลี่ยนแม้ wipe data

### EcoStove Volunteer Guide
- Flow reference สำหรับทำคู่มือ: `memory/ecostove-volunteer-guide.md` (ยังไม่สร้าง)
- 2 flows: เก็บ TVOC/CO (ต้องอยู่กรอกทุก 5 นาที) vs ไม่เก็บ (ปิดหน้าจอไปได้เลย)

### EcoStove MT15 Sensor Settings (ปุ่มกดบนตัวเครื่อง) — ตัวหลัก
- **กด 1 ครั้ง** → เปลี่ยนหน่วยอุณหภูมิ C/F
- **กด 2 ครั้ง** → ปิด/เปิดเสียง
- **กด 3 ครั้ง** → เปลี่ยนหน้าจอ (display toggle)
- **กด 4 ครั้ง** → **Calibrate เซนเซอร์** (รอ 120 วินาที) — ใช้ตอนค่าค้าง
- **กด 5 ครั้ง** → จับคู่ WiFi (pairing mode)
- **เปิดเครื่อง**: กดค้าง 3 วินาที → นับถอยหลัง 60 วินาที → เริ่มแสดงค่า
- ⚠️ **MT13W ต่างกัน**: กด 3 ครั้ง = Calibrate (ไม่มี display toggle / WiFi pairing แยก)

### EcoStove Sensor Reliability Issue (DewS ทดสอบ, 2026-03-20)
- ทดสอบ 10 เครื่องกับท่อไอเสียมอเตอร์ไซค์ → **8/10 เครื่องค่าค้าง** หลังเอากลับออฟฟิส
- **กลุ่ม 1** (2 เครื่อง): กลับมาปกติเอง — recover ได้
- **กลุ่ม 2** (3 เครื่อง): CO2 ค้าง 3200-3900, CO ค้าง 005-037 — ไม่ลง
- **กลุ่ม 3** (5 เครื่อง): CO2 ค้าง 2000+, CO ค้าง 000 — ไม่ลง
- สาเหตุ: semiconductor sensor saturation จากค่ามลพิษสูงเกิน
- ✅ **แก้แล้ว (2026-03-24)**: กด calibrate แล้วหายทุกตัว — ไม่ต้อง power cycle/รอ
- **สำหรับ MT15**: ถ้าค่าค้าง → **กด 4 ครั้ง** (Calibrate, รอ 120 วิ) + อย่าจ่อเซนเซอร์ใกล้แหล่งควันเข้มข้นเกินไป

### EcoStove CO Sensor Findings (DewS ทดสอบ, 2026-03-20)
- Tuya sensor (MT13W) **วัด CO ได้จริง** — แต่ต้องค่าสูงมาก
- เทียน = ไม่ขึ้น, ท่อไอเสียมอเตอร์ไซค์ = ขึ้น
- CO เริ่มขึ้นตอน CO2 ใกล้ 5000 ppm → ค่า CO หลักหน่วย ถึง ~300 ppm
- แต่ละเครื่องตอบสนองเร็ว/ช้าต่างกัน
- CO เข้า DB 2 ทาง: อัตโนมัติ (sync.js จาก Tuya) + กรอกมือ (volunteer page)

### EcoStove Design Decisions (confirmed by DewS, 2026-03-20)
- **Stove type hardcode 'eco'** → ถูกต้อง อาจารย์กำหนดเอง ไม่ใช่อาสาเลือก
- **Session resume (3 min lock)** → ใช้ได้สำหรับ UAT ไม่ต้องแก้
- **Offline retry queue** → nice-to-have ไม่บล็อค UAT (มี error toast อยู่แล้ว ข้อมูลไม่หลอกว่าบันทึกสำเร็จ)
- **Vercel + Supabase** → ยังอยู่บัญชี DewS ส่วนตัว ย้ายทีหลัง UAT ได้
- **LINE OA** → ใช้ของ DewS ไปก่อน ย้ายตอนส่งมอบ
- **Dashboard (Basic + Deep Insights)** → รอ feedback อาจารย์แก้วก่อน ห้ามแตะ

### ⚠️ WEnDyS Self-Correction Rules (2026-03-20)
- **ห้ามบอก % ความพร้อมโดยไม่ตรวจโค้ดจริง** — ต้อง audit ก่อนพูด
- **ห้ามบอกว่า "ยังไม่ได้ทำ" โดยไม่เช็คก่อน** — DewS อาจทำไปแล้ว
- **ห้ามพูดจากความจำอย่างเดียว** — ต้อง verify กับ source of truth (โค้ด/DB/Vercel)
- **ถ้าไม่แน่ใจ บอกว่าไม่แน่ใจ** — อย่าพูดเหมือนมั่นใจ
- **ห้าม remind สิ่งที่แก้ไปแล้วซ้ำ** — เช็คสถานะจริงก่อน ถ้าแก้แล้วก็จบ อย่าเอามาพูดให้ DewS กังวลโดยไม่จำเป็น (DewS สั่ง 2026-04-18)

### EcoStove Project Account (บัญชีโครงการ — ไม่ผูกบุคคล)
- Email: `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`
- ใช้สมัครทุก platform: Tuya IoT, Tuya Smart App, Supabase, Vercel, LINE Dev
- **⚠️ ตอนส่งมอบโครงการ ต้องเปลี่ยน:**
  - Recovery email (ตอนนี้เป็นของ DewS)
  - เบอร์โทร recovery (ตอนนี้เป็นของ DewS)
  - เปลี่ยนใน Google Account → Security → Recovery options

### EcoStove Admin Auth (Multi-Admin — Email + Personal PIN)
- DewS login: `dews.cnx@gmail.com` / `admin2026` (Super Admin)
- Invite code: `ecostove2026` (env var `ADMIN_INVITE_CODE`)
- Migrations ที่รันแล้ว: 005 (indexes), 006 (auth+RLS), 007 (role column), **017 (personal PIN + activity_logs)**
- Auth flow: Email + Personal PIN → SHA-256 hash เทียบ `admin_users.pin_hash`
- Activity log: shared ใน DB (`admin_activity_logs` table, append-only)
- Self-registration: ใครก็ลงทะเบียนเองได้ด้วย invite code (ไม่ต้อง login ก่อน)
- **สำหรับคู่มือ**: ต้องอธิบาย flow ลงทะเบียน + login + เปลี่ยน PIN ส่วนตัว
- **Recovery Code flow (สำคัญ — ต้องเขียนในคู่มือ)**:
  - ใช้ Recovery Code reset PIN → code ถูก**ลบทันที** (set null)
  - ไม่ได้รับ code ใหม่อัตโนมัติ → ต้อง login แล้วไปสร้างเองที่ regenerate-recovery
  - ถ้าไม่สร้างใหม่ → ไม่มี Recovery Code เลย → ลืม PIN อีกที ต้องให้ Super Admin reset

## NDF Quotation (ใบเสนอราคา)
- รายละเอียดเต็ม: `memory/ndf-quotation-format.md`
- Template: `ψ/active/build-quotation.js` + assets ใน `ψ/active/`
- Font: **Sarabun** (embedded base64), PDF via Edge `--headless=new`
- Boss: **ภิญโญ ตัณรัตนมณฑล** (สะกดให้ถูก!)
- โลโก้ NDF อยู่ใต้ชื่อเจ้านาย, เส้นลายเซ็นห้ามขาด

## SRT Slides / Presentation
- ไฟล์สไลด์อยู่ที่ `e:\01_Work\_NDF\SMART RAIL TOURISM ASSISTANT\`
- Google Slides (28 หน้า): NDF Smart Tourism Platform
- Supplementary Slides (17 หน้า, HTML): จากพี่บอย — ตัด Timeline+Budget เหลือ 15 หน้า
- Fixed HTML: `SRT Smart Hub Platform — Supplementary Slides (Fixed).html`
- Icon collection: `icons-collection.html` — 84 emoji คลิกก๊อปได้
- Deploy: `https://srt-slides.vercel.app/` (password: `ndfai`)
- สไตล์ไอคอน: ใช้ **emoji** (flat, สีสด) ไม่ใช่ SVG
- Palette: navy #1a3f6f, blue #2e74b5, teal #3a7ca5, orange #e67e22, green #27ae60
- Font: Prompt (Google Fonts)

## SWT Project (Smart Tourism)
- ลูกค้า: การรถไฟ (SRT)
- NDF scope: Core Dashboard + Core DB + Auth + Kiosk + Mobile App + Admin Dashboard
- ทีมอื่น: Space System, IoT People Counting
- ข้อมูลภายนอก: SRT API (ตารางรถไฟ, สถานี, booking)
- User groups NDF ดูแล: นักท่องเที่ยว (Kiosk+App), เจ้าหน้าที่ (Dashboard limited), ผู้บริหาร (Dashboard full)
- ผู้เช่า/ร้านค้า → Space System (ทีมอื่น) แต่ใช้ Auth จาก Core ของเรา
