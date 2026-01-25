# Tuya Sensor + Mobile Hotspot Method

> เอกสารสรุปวิธีเก็บข้อมูลจาก Sensor โดยใช้ Hotspot มือถืออาสา
>
> สร้าง: 2026-01-25
> โปรเจค: EcoStove - เตาชีวมวล 9 จังหวัดภาคเหนือ

---

## ทำไมเลือกวิธีนี้

### ปัญหาที่เจอ

| วิธี | ปัญหา |
|------|-------|
| **Cloud API (Tuya)** | มี rate limit, Developer Trial ฟรีแต่จำกัด |
| **Local API ตรง** | ต้องมี WiFi ทุกบ้าน + ล่าม (server) ทุกจุด |
| **กรอกมือ** | Human error สูง, เก็บข้อมูลนาน หลายตัวแปร |

### ทำไม Hotspot ถึงเหมาะ

- ไม่ต้องติดตั้ง WiFi ทุกบ้าน
- ไม่ต้องกรอกมือ (ลด Human Error)
- อาสาต้องไปเยี่ยมบ้านอยู่แล้ว
- ค่าใช้จ่าย = 0 บาท (ใช้เน็ตมือถืออาสาที่มีอยู่)

---

## หลักการทำงาน

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🔑 กุญแจสำคัญ: ทุก Sensor จำชื่อ WiFi เดียวกัน            │
│                                                             │
│   Config ครั้งเดียวตอนแจก Sensor:                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  WiFi Name: ECOSTOVE                                │   │
│   │  Password:  ecostove2024                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   พออาสาเปิด Hotspot ชื่อ "ECOSTOVE"                        │
│   → Sensor เจอชื่อคุ้นเคย → เชื่อมต่ออัตโนมัติ!             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### เปรียบเทียบ Cloud vs Local vs Hotspot

```
Cloud API (ตอนนี้):
📱 Web → ☁️ Supabase → ☁️ Tuya Cloud → 📡 Sensor
         (Edge Function)   (Internet)
⚠️ มี rate limit

Local API (ต้องมี WiFi ประจำ):
📱 Web → 💻 Local Server → 📡 Sensor
         (Raspberry Pi)    (LAN)
⚠️ ต้องมี server ทุกจุด

Hotspot Method (ที่จะใช้):
📱 Web → 📱 Hotspot อาสา → 📡 Sensor
         (มือถือ)          (WiFi ชั่วคราว)
✅ ไม่มี limit, ไม่ต้องติดตั้งอะไร
```

---

## Flow การใช้งาน

### อาสาถึงบ้านกลุ่มตัวอย่าง

```
①  เปิด Hotspot มือถือ
    ┌────────────────────┐
    │ 📱 Hotspot         │
    │ Name: ECOSTOVE     │
    │ Pass: ecostove2024 │
    │ [เปิด ✓]           │
    └────────────────────┘
               │
               ▼ รอ 10-30 วินาที

②  Sensor เชื่อมต่ออัตโนมัติ
    ┌────────────────────┐
    │ 📡 Sensor          │
    │ WiFi: Connected ✓  │  ← ไฟเขียวติด / สัญลักษณ์ WiFi
    └────────────────────┘
               │
               ▼

③  เปิดเว็บ กดดึงค่า
    ┌────────────────────┐
    │ 📱 Browser         │
    │ [ดึงค่า Sensor]    │
    │                    │
    │ PM2.5: 45 ✓        │
    │ CO2: 823 ✓         │
    │ บันทึกแล้ว!        │
    └────────────────────┘
               │
               ▼

④  ปิด Hotspot → ไปบ้านต่อไป
```

---

## สิ่งที่ต้องเตรียม

### ทำครั้งเดียว (Admin)

| # | งาน | รายละเอียด |
|---|-----|-----------|
| 1 | กำหนด WiFi กลาง | ชื่อ: `ECOSTOVE` / รหัส: `ecostove2024` |
| 2 | Config Sensor ทุกเครื่อง | ให้จำ WiFi ชื่อ ECOSTOVE |
| 3 | ทำคู่มืออาสา | วิธีตั้ง Hotspot บน Android/iPhone |
| 4 | แก้โค้ดเว็บ | ให้เรียก Local API แทน Cloud API |

### ทำทุกครั้งที่เก็บข้อมูล (อาสา)

| # | งาน | เวลา |
|---|-----|------|
| 1 | เปิด Hotspot | 5 วินาที |
| 2 | รอ Sensor เชื่อมต่อ | 10-30 วินาที |
| 3 | กดดึงค่าบนเว็บ | 5 วินาที |
| 4 | ปิด Hotspot | 5 วินาที |

**รวม: ~1 นาที/บ้าน**

---

## ข้อควรระวัง

### 1. ชื่อ + รหัส Hotspot ต้องตรงกันทุกคน

```
✅ ถูก: ECOSTOVE / ecostove2024
❌ ผิด: EcoStove / ecostove2024  (ตัวพิมพ์เล็ก-ใหญ่ต่าง)
❌ ผิด: ECOSTOVE / Ecostove2024  (รหัสต่าง)
❌ ผิด: ECO STOVE / ecostove2024 (มีช่องว่าง)
```

### 2. Android vs iPhone

| ระบบ | วิธีตั้งชื่อ Hotspot |
|------|---------------------|
| **Android** | ตั้งชื่อได้อิสระ ✅ |
| **iPhone** | ชื่อ Hotspot = ชื่อเครื่อง → ต้องเปลี่ยนชื่อ iPhone เป็น "ECOSTOVE" |

### 3. Sensor ต้อง Online

- Sensor บางรุ่นต้องเปิดเครื่องใหม่ถึงจะหา WiFi ใหม่
- ถ้าไม่เชื่อมต่อภายใน 1 นาที ให้ลองปิด-เปิด Sensor

### 4. Internet บน Hotspot

- Hotspot ต้องมี Internet (เน็ตมือถือ) ด้วย
- ถ้าไม่มีเน็ต → Sensor เชื่อมต่อได้ แต่ส่งข้อมูลไป Cloud ไม่ได้
- แต่ถ้าใช้ Local API → ไม่ต้องมี Internet ก็ได้!

---

## Architecture สำหรับ Test

### ช่วง Test (ใช้ Notebook)

```
🏠 บ้านเรา (WiFi เดียวกัน)

📱 Browser ──► 💻 Notebook ──► 📡 Sensor
              (Flask Server)
              localhost:5000
```

### Production (ใช้ Hotspot)

```
🏘️ บ้านกลุ่มตัวอย่าง

📱 Browser ──► 📱 Hotspot ──► 📡 Sensor
   (บนมือถือเดียวกัน)
```

---

## ขั้นตอนถัดไป

### Phase 1: Test ที่บ้าน (Notebook)

- [ ] ติดตั้ง tinytuya + flask บน notebook
- [ ] หา Local Key ของ Sensor
- [ ] สร้าง Local Server
- [ ] แก้โค้ดเว็บให้เรียก localhost:5000
- [ ] ทดสอบดึงค่าจาก Sensor

### Phase 2: Test ด้วย Hotspot

- [ ] Config Sensor ให้จำ WiFi "ECOSTOVE"
- [ ] ทดสอบเปิด Hotspot แล้ว Sensor เชื่อมต่อได้
- [ ] ทดสอบ Flow เต็มรูปแบบ

### Phase 3: Deploy จริง

- [ ] ทำคู่มืออาสา (พร้อมรูปภาพ)
- [ ] อบรมอาสาวิธีใช้
- [ ] Config Sensor ทุกเครื่อง
- [ ] แจก Sensor ไปแต่ละบ้าน

---

## อ้างอิง

- Tuya Local API: ใช้ `tinytuya` (Python)
- Sensor Model: [ระบุรุ่น]
- Device ID: [ระบุ ID]

---

*เอกสารนี้สร้างโดย WEnDyS Oracle*
