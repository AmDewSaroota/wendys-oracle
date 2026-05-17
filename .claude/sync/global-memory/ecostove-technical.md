# EcoStove Technical Reference

Extracted from MEMORY.md (2026-04-27) to reduce bloat. This file contains detailed technical specifics for the EcoStove project.

---

## Map & Export

- Both maps (Basic + Deep Insights) now use **OSM tiles** (`{s}.tile.openstreetmap.org`) — เปลี่ยนจาก CARTO Voyager (2026-04-27)
- สาเหตุที่เคยใช้ CARTO: คิดว่า OSM มีปัญหา CORS กับ html2canvas แต่จริงๆไม่มี
- **Triangle markers ใช้ SVG** (ไม่ใช่ CSS clip-path) เพราะ html2canvas ไม่รองรับ clip-path → export ออกมาเป็นสี่เหลี่ยม
- Export ใช้ html2canvas with `useCORS: true`
- Aspect ratio dropdown: auto, 1:1, 3:4, 16:9
- Marker shapes: triangle(SVG)=sensor, circle(CSS)=household, square(CSS)=SME
- Colors: blue=#3b82f6(sensor), green=#10b981(freq>=15), orange=#f97316(freq 5-14), red=#ef4444(freq 0-4), purple=#a855f7(SME)

---

## Guide & Documentation

- DewS ต้องการ **CSS mockups ที่ตรงกับ UI จริง** — ห้ามใช้ screenshot (ไม่ชัด)
- Frequency mockup ต้องแสดงเป็น**ส่วนหนึ่งของ subjects tab** ไม่ใช่แยก standalone (DewS บอกว่า misleading)
- Guide อยู่ใน index.html section A2.x — มี TH + EN
- Report อยู่ที่ `deploy/docs/report-stovetype-feature.html`
- Mockup CSS classes: guide-mock, guide-mock-nav, guide-mock-tabs, guide-mock-body, guide-mock-table, guide-mock-modal

---

## Tuya Sensors

| Device | ID | Product | Battery | Notes |
|--------|-----|---------|---------|-------|
| **MT15 (หลัก)** | `a31aff2ac0acbbf911cee3` | PM2.5/PM10/CO2/CO/HCHO/Temp/Humidity/AQI | **2000mAh** | **Laser Scattering** — PM ไว, BS 001-012 |
| MT13W (เดิม) | `a3d01864e463e3ede0hf0e` | PM2.5/PM10/CO2/CO/HCHO/Temp/Humidity/AQI (**ไม่ส่ง TVOC**) | **2000mAh** | **IR sensor** — ไม่ใช่ตัวหลักแล้ว |
| PV28 Air Detector | `a39e1d85867b719abc10av` | CO2/PM2.5/VOC/HCHO/Temp/Humidity | **800mAh** | **Laser Scattering**, ไม่มี CO/PM10 |

### PV28 vs MT13W — Data Point Mapping
- **MT13W ไม่ส่ง TVOC ขึ้น cloud** → ถึงต้องกรอกมือ, PV28 ส่ง `voc_value` ได้จริง (ข้อดีหลัก)
- PV28 ไม่มี: `co_value`, `pm10`, `pm1`, `air_quality_index`
- HCHO scale **เดียวกัน** (ยืนยัน 2026-03-31: PV28=4, MT13W=3 ห้องเดียวกัน)
- Tuya API v1.0 `/v1.0/users/{uid}/devices` → **permission deny แล้ว (2026-03-31)** ต้องใช้ v2.0 `/v2.0/cloud/thing/device`

### MT15 Sensor Settings (ปุ่มกดบนตัวเครื่อง)
- **กด 1 ครั้ง** → เปลี่ยนหน่วยอุณหภูมิ C/F
- **กด 2 ครั้ง** → ปิด/เปิดเสียง
- **กด 3 ครั้ง** → เปลี่ยนหน้าจอ (display toggle)
- **กด 4 ครั้ง** → **Calibrate เซนเซอร์** (รอ 120 วินาที) — ใช้ตอนค่าค้าง
- **กด 5 ครั้ง** → จับคู่ WiFi (pairing mode)
- **เปิดเครื่อง**: กดค้าง 3 วินาที → นับถอยหลัง 60 วินาที → เริ่มแสดงค่า
- MT13W ต่างกัน: กด 3 ครั้ง = Calibrate (ไม่มี display toggle / WiFi pairing แยก)

### Sensor Reliability Issue (DewS ทดสอบ, 2026-03-20)
- ทดสอบ 10 เครื่องกับท่อไอเสียมอเตอร์ไซค์ → **8/10 เครื่องค่าค้าง**
- สาเหตุ: semiconductor sensor saturation จากค่ามลพิษสูงเกิน
- **แก้แล้ว (2026-03-24)**: กด calibrate แล้วหายทุกตัว — ไม่ต้อง power cycle/รอ
- สำหรับ MT15: ถ้าค่าค้าง → **กด 4 ครั้ง** (Calibrate, รอ 120 วิ)

### CO Sensor Findings (DewS ทดสอบ, 2026-03-20)
- Tuya sensor (MT13W) **วัด CO ได้จริง** — แต่ต้องค่าสูงมาก
- เทียน = ไม่ขึ้น, ท่อไอเสียมอเตอร์ไซค์ = ขึ้น
- CO เริ่มขึ้นตอน CO2 ใกล้ 5000 ppm → ค่า CO หลักหน่วย ถึง ~300 ppm
- แต่ละเครื่องตอบสนองเร็ว/ช้าต่างกัน
- CO เข้า DB 2 ทาง: อัตโนมัติ (sync.js จาก Tuya) + กรอกมือ (volunteer page)

### Sensor Procurement Issue (2026-04-30)
- สั่ง MT15 ไป **11 เครื่อง** → ได้มาแค่ **5 เครื่อง**
- สั่งเพิ่มจาก **AliExpress อีก 6 เครื่อง** ทดแทน
- ผู้ขายบอกส่งทัน 24 เม.ย. → **สิ้นเดือนแล้วยังไม่มา**
- Tracking: `AETH0000376123DY` — ออกจากจีน 18 เม.ย. แต่ไม่มี update หลังจากนั้น
- DewS รายงาน อ.แก้วแล้ว → **เดดไลน์โครงการ 20 พ.ค. 2026**
- **10 พ.ค. = ต้องได้ของ** เพราะต้อง pair/ติดตั้ง/ทดสอบก่อน 20 พ.ค.
- AliExpress ประเมินส่งถึง 24 พ.ค. → ไม่ทัน ถ้า 10 พ.ค. ไม่มาต้องสั่งจากในไทย
- ⚠️ **จุดตัดสินใจ 10 พ.ค.** — สั่งจากในไทยทดแทน + รอ dispute AliExpress หลัง 24 พ.ค.

### Sensor Naming
- Convention: **BS XXX** (BS 001 ถึง BS 012)
- BS = Biomass Stove, ไม่ผูกรุ่น/บ้าน → ย้ายเครื่องได้
- BS number = **MT15** number (1:1 mapping, ตาม Tuya Device ID)
- ใช้ใน `devices.name` + `registered_sensors.name`
- Sticker generator: `lab/tuya-ecostove/deploy/stickers.html`
- QR บนสติกเกอร์ → `biomassstove.vercel.app/volunteer.html` (URL เดียวทุกตัว, GPS detect บ้าน)
- สติกเกอร์แปะได้เลย — Tuya Device ID เป็น hardware-level ไม่เปลี่ยนแม้ wipe data

### Standard Hotspot (สำหรับ pair เซนเซอร์)
- ชื่อ Hotspot: **`Biomass`** / รหัสผ่าน: **`Biomass2026`**
- ย่านความถี่: **2.4 GHz เท่านั้น** (ห้าม 5GHz)
- เซนเซอร์ pair ครั้งเดียว → อาสาเปิด Hotspot ชื่อเดียวกัน เชื่อมต่อเองอัตโนมัติ

---

## Sync & API

- sync.js ใช้ Smart Home API `/v1.0/users/{uid}/devices` — 1 call ได้ทุกเครื่อง
- sync.js ต้องการ env: `TUYA_APP_USER_UID`
- **Session limit: MAX 2 sessions/device/day** — ห้ามเกิน! ประหยัด API quota
- Flow: Session 1 (2h10m) → cooldown 5h → Session 2 (2h10m) → daily-limit → หยุด
- sync.js เช็ค: online check → session limit → cooldown → ถึงค่อย collect
- ห้าม insert log ตอน cooldown/cutoff/daily-limit
- **Cron**: cron-job.org ทุก 5 นาที (ไม่ใช่ Vercel Cron)
  - URL: `https://biomassstove.vercel.app/api/sync?secret=ecostove-sync-2026`
  - CRON_SECRET: `ecostove-sync-2026`
  - Vercel อยู่ Hobby plan → cron ได้แค่วันละครั้ง ใช้ไม่ได้
- **Tuya API**: Singapore Data Center (`openapi-sg.iotbing.com`)
- Tuya โครงการ (ใหม่): Access ID `8grdqadptymnyeqdduxx` — บัญชี biomassstove.cmru@gmail.com
- Tuya ส่วนตัว DewS (เก่า): Access ID `7dudg9tg3cwvrf8dx9na` — จะ phase out
- API limit 26,000/เดือน → ~21,600 ถ้า 10 ตัว (2 ครั้ง/วัน, 3 ชม.)
- **Tuya "permission deny" fix (2026-03-23)**: โปรเจคใหม่สร้างแบบ Smart Home → ไม่มีสิทธิ์ Industry API → เปลี่ยนใช้ Smart Home API
- **บทเรียน**: ห้ามเดาชื่อ API product ของ Tuya — ต้อง verify จากหน้าจอจริง

### Tuya IoT Core Renewal
- **หมดอายุ: 2026-10-17** — ต้อง extend ก่อน! (extend ครั้งล่าสุด 2026-04-17)
- ไปที่ www.tuya.com/vas/user/service → Extend Trial Period
- Login: `biomassstove.cmru@gmail.com`
- **เตือน DewS ตั้งแต่ session แรกของเดือนตุลาคม 2026**

---

## DB Schema (key tables)

- **subjects**: id, full_name, gps_lat, gps_long, status, subject_type, stove_id, connectivity
- **devices**: id, subject_id, name, tuya_device_id
- **stoves**: id, subject_id (deprecated), name, description
- **monthly_usage**: id, subject_id, month, usage_count, created_by, updated_at
- **admin_users**: email, pin_hash, role, recovery_code_hash

### Completed Migrations (reference)
- 005: indexes
- 006: auth + RLS
- 007: role column
- 017: personal PIN + activity_logs
- 028: stoves.description (DewS confirmed 2026-04-27)
- 029: monthly_usage.updated_at (DewS confirmed 2026-04-27)
- 030: stove_id on subjects — many-to-one link (DewS confirmed 2026-04-27)
- 031: mock stove types data (DewS confirmed 2026-04-27)
- 032: drop stoves.subject_id cleanup

---

## LINE OA

- **Deploy แล้ว** → `line-oa-inky.vercel.app` (Vercel project แยก)
- Bot: "EcoStove Test" (`@711vcedr`)
- Endpoints: webhook, push/broadcast, summary preview, debug
- **ใช้ Vercel Cron** (ไม่ใช่ cron-job.org) — Hobby plan รองรับ 2 cron/project
  - morning: 05:00 UTC (เที่ยงไทย) — สรุป session เช้า
  - evening: 13:00 UTC (2ทุ่มไทย) — สรุปทั้งวัน
- Cron endpoints ไม่มี auth (Vercel cron เรียกภายใน)
- PUSH_SECRET: `ecostove-line-2026` (สำหรับ /api/push)
- Env vars: LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, SUPABASE_URL, SUPABASE_KEY, CRON_SECRET, PUSH_SECRET
- LINE notification: ไม่ส่ง reminder เปิดเซนเซอร์ → ส่งเฉพาะ **สรุปผลเก็บข้อมูล**
  - เที่ยง: สรุป session เช้า (บ้านไหนไม่ได้เปิด)
  - 2 ทุ่ม: สรุป session เย็น (บ้านไหนไม่ได้เปิด)

---

## Deploy

- **Vercel auto-deploy ไม่ทำงาน** — ต้อง deploy มือทุกครั้ง
- EcoStove: `cd lab/tuya-ecostove/deploy && npx vercel --prod --yes`
- LINE OA: `cd lab/line-oa && npx vercel --prod --yes`
- หลัง git push ต้องรัน deploy เองเสมอ
- Vercel CLI ต้อง login เป็น account โครงการ (`biomassstove.cmru@gmail.com`) ไม่ใช่ DewS ส่วนตัว

---

## Platform Migration (2026-03-21) — All Complete

- cron-job.org → `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`
- Vercel (ecostove-cmru + line-oa) → account `biomassstove.cmru@gmail.com`
  - ecostove-cmru: `biomassstove.vercel.app`
  - line-oa: `line-oa-inky.vercel.app`
- Supabase → transfer ไป BioMassStove's Org (URL/key ไม่เปลี่ยน)
- Tuya IoT → ย้ายแล้ว (2026-03-18)
- Tuya Migration: pair เซนเซอร์แล้ว + เปลี่ยน env บน Vercel แล้ว
- **ยังรอ**: LINE Dev (รออาจารย์แก้ว) + Google Account recovery (เปลี่ยน recovery email + เบอร์ ตอนส่งมอบ)

---

## Admin Auth (Multi-Admin — Email + Personal PIN)

- DewS login: `dews.cnx@gmail.com` / `admin2026` (Super Admin)
- Invite code: `ecostove2026` (env var `ADMIN_INVITE_CODE`)
- Auth flow: Email + Personal PIN → SHA-256 hash เทียบ `admin_users.pin_hash`
- Activity log: shared ใน DB (`admin_activity_logs` table, append-only)
- Self-registration: ใครก็ลงทะเบียนเองได้ด้วย invite code (ไม่ต้อง login ก่อน)
- **Recovery Code flow**: ใช้ Recovery Code reset PIN → code ถูกลบทันที (set null) → ต้อง login แล้วสร้างใหม่ที่ regenerate-recovery → ถ้าไม่สร้าง ลืม PIN อีกทีต้องให้ Super Admin reset

---

## Project Account

- Email: `biomassstove.cmru@gmail.com` / `BioMass@cmru2026`
- ใช้สมัครทุก platform: Tuya IoT, Tuya Smart App, Supabase, Vercel, LINE Dev
- ตอนส่งมอบโครงการ ต้องเปลี่ยน: Recovery email + เบอร์โทร recovery (ตอนนี้เป็นของ DewS)

---

## Design Decisions (confirmed by DewS, 2026-03-20)

- Stove type hardcode 'eco' → ถูกต้อง อาจารย์กำหนดเอง
- Session resume (3 min lock) → ใช้ได้สำหรับ UAT
- Offline retry queue → nice-to-have ไม่บล็อค UAT
- Dashboard (Basic + Deep Insights) → รอ feedback อาจารย์แก้วก่อน ห้ามแตะ

---

## Dashboard Direction (อ.แก้ว, 2026-03-18)

- **เตาใหม่ (eco) = พระเอก** → แสดงเด่นชัด, ชูโรง
- **เตาเก่า (old) = คู่เทียบ** → แค่ baseline reference
- สิ่งที่ต้องแสดง = **ความต่างที่เตาใหม่สร้างขึ้น** (ลดมลพิษได้เท่าไหร่)
- อยากได้ **daily sensor readings** ที่หน้าข้อมูลเบื้องต้น
- เพิ่ม **CO manual input** — Tuya วัด CO2 ได้ แต่ไม่วัด CO → ต้องกรอกมือเหมือน TVOC

### Dashboard Full Lock (DewS, 2026-04-20)
- **ทุกหน้าล็อคแล้ว** — มีแอดมินจริงเข้ามาดูแล้ว ห้ามเปลี่ยนอะไรที่มีอยู่
- **ทำได้**: แก้ bug + เพิ่มของใหม่ตาม REQ ที่ confirm แล้วว่ามาจาก อ.แก้ว + ทีม เท่านั้น
- **ห้ามทำ**: เปลี่ยน layout, แก้ UI ที่ไม่มีคำสั่ง, ปรับปรุงตามใจ WEnDyS
- ถ้า DewS สั่งเปลี่ยนอะไร → ต้อง REMIND ว่าล็อคอยู่

---

## EcoStove Direction (อ.แก้ว, 2026-02)

- ใช้ **Cloud Tuya** + sensor **MT15** (เปลี่ยนจาก MT13W แล้ว, DewS ยืนยัน 2026-04-17)
- เฟสแรก: **10 บ้าน**
- ไม่มี WiFi → อาสาเปิด Hotspot ขณะเก็บข้อมูล

---

## Volunteer Guide

- Flow reference: `memory/ecostove-volunteer-guide.md` (ยังไม่สร้าง)
- 2 flows: เก็บ TVOC/CO (ต้องอยู่กรอกทุก 5 นาที) vs ไม่เก็บ (ปิดหน้าจอไปได้เลย)

---

## TODO (ค้างไว้)

- คู่มือ: เพิ่มวิธีแอดเตา/ผูกเตา — DewS ฝากไว้ (2026-04-21)
- ถ้าเปลี่ยนเป็น PV28 → ต้องทำสติกเกอร์วิธีใช้ใหม่ + อัพเดทคู่มืออาสา
- Map + Stove Type + Frequency — deploy แล้ว (2026-04-25) แต่ DewS สั่ง recheck ทุกระบบ
  - รัน migration 028 + 029
  - Recheck: ประเภทเตา tab, stove linking, ความถี่ inline+audit, แผนที่ทั้ง 2, export
