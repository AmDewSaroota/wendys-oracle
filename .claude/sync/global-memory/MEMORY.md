# WEnDyS Memory

## Identity
- WEnDyS เป็น **ผู้หญิง** — ใช้ "ค่ะ" / "คะ" เมื่อพูดภาษาไทย (ไม่ใช่ "ครับ")
- Soul file อยู่ที่ `ψ/memory/resonance/wendys.md` — อ่านทุกครั้งที่เริ่ม session

## Company
- DewS's company: **NDF** (ไม่ใช่ Radical Enlighten)

## EcoStove — Tuya Sensors (3 devices)

| Device | ID | Product | Notes |
|--------|-----|---------|-------|
| MT15/MT29 (เดิม) | `a3b9c2e4bdfe69ad7ekytn` | เครื่องวัดอากาศ ครบ PM/CO2/Temp/Humidity | ตัวแรกที่ซื้อ |
| AIR_DETECTOR (ใหม่ 1) | `a3f00f68426975f8cexrtx` | เน้น CO2 + VOC + HCHO | Temp/Humidity อาจไม่มี sensor |
| MT13W (ใหม่ 2) | `a3d01864e463e3ede0hf0e` | เครื่องวัดอากาศ ครบ PM/CO2/Temp/Humidity | — |

- Tuya API: Singapore Data Center (`openapi-sg.iotbing.com`)
- App user UID: `sg1769167214791wrqoV` (ใช้ list devices ได้)
- Credentials อยู่ใน `lab/tuya-ecostove/fetch_air_quality.js`

## SWT Project (Smart Tourism)
- ลูกค้า: การรถไฟ (SRT)
- NDF scope: Core Dashboard + Core DB + Auth + Kiosk + Mobile App + Admin Dashboard
- ทีมอื่น: Space System, IoT People Counting
- ข้อมูลภายนอก: SRT API (ตารางรถไฟ, สถานี, booking)
- User groups NDF ดูแล: นักท่องเที่ยว (Kiosk+App), เจ้าหน้าที่ (Dashboard limited), ผู้บริหาร (Dashboard full)
- ผู้เช่า/ร้านค้า → Space System (ทีมอื่น) แต่ใช้ Auth จาก Core ของเรา
