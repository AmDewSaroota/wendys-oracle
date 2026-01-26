# Handoff: Sensor Decision Pending

**Date**: 2026-01-26 12:00
**Context**: EcoStove project - ตัดสินใจเรื่อง Sensor

---

## What We Did

### Session 1 (ก่อนหน้า)
- อธิบาย Cloud API vs Local API
- ตัดสินใจใช้ Hotspot Method
- ติดตั้ง Python + tinytuya
- ได้ Local Key + DPS Mapping
- พบว่า Tuya region Singapore = `sg` ไม่ใช่ `ap`

### Session 2 (นี้)
- Research Tuya Cloud API limits:
  - Trial: 26,000 calls/เดือน, ห้ามใช้วิจัย
  - Flagship: ~$25,000/ปี
- ค้นพบข้อจำกัดสำคัญ: **MT15/MT29 ไม่มี Offline Storage**
  - ต้องมี WiFi ตลอดเวลาที่เก็บข้อมูล
  - ถ้าใช้ Hotspot = ต้องเฝ้าตลอด = ไม่ต่างจากจดมือ
- เขียนเอกสาร `sensor-limitations.md` สรุปทางเลือก
- Research sensor ที่มี SD Card storage ขายในไทย

---

## Key Discovery

```
⚠️ MT15/MT29 ไม่เหมาะกับโปรเจคที่บ้านไม่มี WiFi

เพราะ:
1. ไม่มี offline data logging
2. Tuya Cloud มี rate limit + ห้ามใช้วิจัย
3. ถ้าใช้ Hotspot ต้องเฝ้าตลอด = ไม่ต่างจากจดมือ
```

---

## Sensor Alternatives Found

| รุ่น | ราคา | มี SD Card | ซื้อในไทย |
|------|------|-----------|----------|
| **Lutron PM-1064SD** | 24,900฿ | ✅ | ✅ LEGATOOL |
| **DIGICON AQ-164SD** | ~18,000฿? | ✅ | ✅ แสงชัยมิเตอร์ |
| **AirGradient ONE** | 5,000-8,300฿ | ⚠️ API | ✅ ส่งจากไทย |
| **Temtop M2000C** | ~6,500฿ | ✅ 70k records | ⚠️ นำเข้า |

---

## Pending Decisions (สำหรับ อ.แก้ว)

- [ ] งบประมาณโปรเจคเท่าไหร่?
- [ ] กี่บ้านมี WiFi อยู่แล้ว?
- [ ] ต้องการวัดค่าอะไรบ้าง? (PM2.5+CO2 พอไหม?)
- [ ] เปลี่ยน sensor หรือติด 4G Router ทุกบ้าน?

---

## Next Session

- [ ] รอ feedback จาก อ.แก้ว เรื่องงบและทิศทาง
- [ ] ถ้าตัดสินใจใช้ sensor เดิม → ต้องติด 4G Router
- [ ] ถ้าเปลี่ยน sensor → ซื้อ Lutron มาทดสอบ
- [ ] ถ้ามี sensor อยู่ในมือ → test Local API ได้เลย

---

## Key Files

- [docs/sensor-limitations.md](lab/tuya-ecostove/docs/sensor-limitations.md) - สรุปข้อจำกัด + ทางเลือก
- [docs/hotspot-method.md](lab/tuya-ecostove/docs/hotspot-method.md) - วิธี Hotspot (ยังใช้ได้ถ้ามี WiFi ถาวร)
- [ψ/memory/learnings/2026-01-25_tuya-region-sg-not-ap.md](ψ/memory/learnings/2026-01-25_tuya-region-sg-not-ap.md) - Tuya region gotcha

---

## Device Info (เก็บไว้ใช้)

```
Device ID:  a3b9c2e4bdfe69ad7ekytn
Local Key:  UGPc7`5(&x$hr<um
Region:     sg (Singapore)
Product:    MT15/MT29
```

---

*Status: Blocked on decision from อ.แก้ว*
