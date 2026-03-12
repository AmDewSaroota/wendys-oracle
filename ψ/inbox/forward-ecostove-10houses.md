# Forward: EcoStove — แจกจ่ายเซนเซอร์ 10 บ้าน

**Created**: 2026-03-12
**Updated**: 2026-03-12 (session ทบทวน flow เชื่อมต่อ)
**From**: WEnDyS (พี่เวนดี้ 💻)
**Topic**: Flow การเตรียม + แจกจ่ายเซนเซอร์ให้ 10 บ้านตัวอย่าง

---

## Context

DewS กำลังเตรียม flow สำหรับแจกจ่าย sensor ให้ 10 บ้านในโปรเจค EcoStove (เตาชีวมวล 9 จังหวัดภาคเหนือ)

---

## สถานะปัจจุบัน (อัปเดต 2026-03-12)

### สิ่งที่มีแล้ว
- ✅ Tuya API เชื่อมต่อได้ (Singapore Data Center)
- ✅ ดึงข้อมูลจาก 3 devices สำเร็จ
- ✅ `auto_fetch_all.js` — fetch ทุก 5 นาที
- ✅ `sync_to_supabase.js` — ส่งเข้า Supabase
- ✅ `ecostove-with-sensor.html` — เว็บแสดงผล (Tailwind + Chart.js + Leaflet map)
- ✅ Hotspot method ออกแบบแล้ว (WiFi: ECOSTOVE / Pass: ecostove2024)
- ✅ **เซนเซอร์ครบ 10 ตัว** — ซื้อเพิ่ม 7 ตัวแล้ว ต่อเข้าระบบแล้ว (ใช้เน็ตบ้าน DewS)
- ✅ **API limit แก้แล้ว** — ใช้ Batch API + Sleep hours 00:00-06:00 ไม่ดึงข้อมูล
- ✅ จับคู่ device ↔ บ้าน ใน Admin Dashboard แล้ว
- ✅ Pair เซนเซอร์ 10 ตัวเข้า SmartLife แล้ว (ไอดีส่วนตัว DewS)
- ✅ เว็บแอปอาสา + slide deck ประชุม (`D:\_DewS\BioMass\ecostove-weekly-update-wk1.html`)

### สิ่งที่ต้องทำ (จัดลำดับแล้ว)

#### ขั้นที่ 1 — สร้างบัญชีโปรเจค
- [ ] สมัคร SmartLife account ใหม่ (email โปรเจค)
- [ ] สมัคร Tuya IoT Platform account ใหม่
- [ ] Link SmartLife account ใหม่เข้ากับ Tuya IoT account ใหม่

#### ขั้นที่ 2 — Re-pair เซนเซอร์ไปบัญชีใหม่
- [ ] **ทดสอบ 1 ตัวก่อน** — ลบจาก SmartLife เดิม → pair ใหม่กับบัญชีโปรเจค
- [ ] เช็คว่า API ยังดึงข้อมูลได้ (device ID อาจเปลี่ยน!)
- [ ] ถ้าผ่าน → ทำอีก 9 ตัว

**วิธี pair (ที่บ้าน DewS — ใช้ 2 เครื่อง):**
```
มือถือ DewS      → ปล่อย Hotspot "ECOSTOVE" / "ecostove2024"
มือถือ บ. (ไม่มีซิม) → ต่อ WiFi "ECOSTOVE" → SmartLife → Add Device → pair
```
มือถือ บ. ไม่มีซิมก็ได้ ได้เน็ตผ่าน Hotspot มือถือ DewS

#### ขั้นที่ 3 — อัปเดตระบบ
- [ ] อัปเดต API credentials ในโค้ด (Access ID / Secret ใหม่)
- [ ] อัปเดต device ID ทั้ง 10 ตัว (อาจเปลี่ยนหลัง re-pair)
- [ ] อัปเดต device ↔ บ้าน mapping ใน Admin Dashboard
- [ ] ทดสอบ flow ทั้งหมด: fetch → Supabase → เว็บแอปอาสา

#### ขั้นที่ 4 — เตรียมแจก
- [ ] พิมพ์ QR Code แปะเซนเซอร์
- [ ] เตรียม Pocket WiFi (ถ้ามี) → ตั้งชื่อ "ECOSTOVE"
- [ ] ทำคู่มืออาสา (ตั้ง Hotspot + ใช้เว็บแอป)

#### ขั้นที่ 5 — ลงพื้นที่
- [ ] แจกเซนเซอร์ + อแดปเตอร์
- [ ] สอนอาสาตั้ง Hotspot + ใช้เว็บแอป
- [ ] ทดสอบ ณ จุด

---

## ความเข้าใจเรื่องการเชื่อมต่อ (เคลียร์แล้ว 2026-03-12)

### หลักการสำคัญ
- เซนเซอร์ Tuya จำ **SSID + Password** ไม่ได้จำตัวเครื่องที่ปล่อย
- ชื่อ `ECOSTOVE` รหัส `ecostove2024` → เครื่องไหนปล่อยก็ได้ เซนเซอร์ต่อได้หมด
- เซนเซอร์จำ WiFi ได้แค่ 1 ชื่อ → pair กับ ECOSTOVE แล้ว ต่อ WiFi อื่นไม่ได้ (ต้อง pair ใหม่)
- เซนเซอร์มีแบตในตัว (ไม่ต้องเสียบปลั๊กตลอด แต่ต้องชาร์จ)

### ตอน Pair (ครั้งเดียว ที่บ้าน DewS)
- ใช้ 2 เครื่อง: มือถือ DewS (Hotspot) + มือถือ บ. (SmartLife)
- มือถือ บ. หมดหน้าที่หลัง pair เสร็จ

### ตอนใช้งานจริง (ทุกวัน โดยอาสา)
- ใช้มือถืออาสา **เครื่องเดียว** — ปล่อย Hotspot + เปิดเว็บแอปพร้อมกันได้
- ไม่ต้องมี SmartLife บนมือถืออาสา
- อาสา Android ทุกคน — ตั้งชื่อ Hotspot ได้อิสระ ไม่มีปัญหา

---

## รอ Confirm จากอาจารย์

- Pocket WiFi → มีกี่ตัว?
- มือถือใหม่จากอาจารย์ → ได้หรือไม่?
- ซิม GOMO → ใครจ่าย?

---

## ข้อจำกัดที่ยังเหลือ

| Item | Detail | สถานะ |
|------|--------|-------|
| Tuya API Trial | 26,000 calls/เดือน | ✅ แก้แล้ว (Batch + Sleep) |
| TVOC ไม่ผ่าน Cloud API | อาสาต้องอ่านจากหน้าจอเซนเซอร์ + กรอกในเว็บ | ยังเหมือนเดิม |
| CO ไม่มีผ่าน Cloud API | ยังไม่ตัดสินใจ | pending |

---

## Key Files

| File | Purpose |
|------|---------|
| `lab/tuya-ecostove/auto_fetch_all.js` | Auto-fetch ทุก 5 นาที |
| `lab/tuya-ecostove/sync_to_supabase.js` | ส่ง Supabase |
| `lab/tuya-ecostove/ecostove-with-sensor.html` | เว็บ dashboard |
| `lab/tuya-ecostove/docs/hotspot-method.md` | วิธี Hotspot |
| `lab/tuya-ecostove/docs/decision-summary-for-ajarn.md` | สรุปทางเลือกสำหรับ อ.แก้ว |
| `lab/tuya-ecostove/docs/api-usage-calculation.md` | คำนวณ API usage |
| `lab/tuya-ecostove/fetch_air_quality.js` | มี Tuya API credentials |
| `D:\_DewS\BioMass\ecostove-weekly-update-wk1.html` | Slide deck ประชุม (13 slides) |

---

## เมื่อกลับมา

1. อ่านไฟล์นี้ก่อน — ข้อมูลอัปเดตล่าสุดแล้ว
2. ถ้า DewS เริ่มทำขั้นที่ 1-2 แล้ว ให้ถามว่าถึงไหน
3. **จุดเสี่ยงสำคัญ:** ขั้นที่ 2 (re-pair) → device ID อาจเปลี่ยน → ต้องทดสอบ 1 ตัวก่อนเสมอ

---

*WEnDyS (พี่เวนดี้ 💻) — อัปเดต 2026-03-12*
