# ประเมินราคาโครงการ Bus Tracking App (แบบ ViaBus)

**วันที่ประเมิน:** 2026-02-04
**จัดทำโดย:** WEnDyS for DewS
**อ้างอิง:** ViaBus - Live Transit & Map

---

## 1. Feature List สำหรับทำ Slide

### 1.1 User App (iOS + Android)

| # | Feature | รายละเอียด | ความซับซ้อน |
|---|---------|-----------|:-----------:|
| 1 | **Real-time Tracking** | แสดงตำแหน่งรถบนแผนที่แบบ Real-time | 🔴 สูง |
| 2 | **Route Display** | แสดงเส้นทางและป้ายรถทั้งหมด | 🟡 กลาง |
| 3 | **ETA (Estimated Time)** | คำนวณเวลารถถึงป้าย | 🔴 สูง |
| 4 | **Station Search** | ค้นหาป้าย/สถานี ใกล้ตัว | 🟡 กลาง |
| 5 | **Route Finder** | ค้นหาเส้นทางจาก A ไป B | 🔴 สูง |
| 6 | **Favorites** | บันทึกสถานที่โปรด (บ้าน, ที่ทำงาน) | 🟢 ต่ำ |
| 7 | **Alert/Notification** | แจ้งเตือนเมื่อรถใกล้ถึง | 🟡 กลาง |
| 8 | **Filter** | กรองรถแอร์/รถร้อน, รองรับ wheelchair | 🟢 ต่ำ |
| 9 | **Multi-language** | รองรับหลายภาษา (TH/EN) | 🟢 ต่ำ |
| 10 | **Offline Mode** | ดูเส้นทางได้แม้ไม่มี internet | 🟡 กลาง |

### 1.2 Backend System

| # | Feature | รายละเอียด | ความซับซ้อน |
|---|---------|-----------|:-----------:|
| 1 | **GPS Data Ingestion** | รับข้อมูล GPS จาก Hardware บนรถ | 🔴 สูง |
| 2 | **Real-time Processing** | ประมวลผลตำแหน่ง + คำนวณ ETA | 🔴 สูง |
| 3 | **Route Engine** | คำนวณเส้นทางที่ดีที่สุด | 🔴 สูง |
| 4 | **Push Notification** | ส่ง alert ไปยัง user | 🟡 กลาง |
| 5 | **API Gateway** | API สำหรับ Mobile App | 🟡 กลาง |
| 6 | **Database** | เก็บข้อมูลเส้นทาง, ป้าย, ประวัติ | 🟡 กลาง |

### 1.3 Admin Dashboard (Web)

| # | Feature | รายละเอียด | ความซับซ้อน |
|---|---------|-----------|:-----------:|
| 1 | **Route Management** | จัดการเส้นทาง เพิ่ม/ลบ/แก้ไข | 🟡 กลาง |
| 2 | **Station Management** | จัดการป้าย/สถานี | 🟡 กลาง |
| 3 | **Vehicle Management** | จัดการข้อมูลรถ | 🟡 กลาง |
| 4 | **Live Monitor** | ดูตำแหน่งรถทั้งหมดแบบ Real-time | 🟡 กลาง |
| 5 | **Analytics Dashboard** | สถิติการใช้งาน, ความตรงเวลา | 🟡 กลาง |
| 6 | **User Management** | จัดการ admin users | 🟢 ต่ำ |

---

## 2. สมมติฐาน

| รายการ | สมมติฐาน |
|--------|---------|
| Hardware GPS | **มีอยู่แล้ว** — ติดตั้งบนรถเรียบร้อย |
| จำนวนรถ | ~100-500 คัน |
| จำนวนเส้นทาง | ~20-50 เส้นทาง |
| พื้นที่ให้บริการ | 1 จังหวัด (ขยายได้ภายหลัง) |
| Platform | iOS + Android (React Native / Flutter) |
| อัตราค่าแรง | 5,000 บาท / คน / วัน |

---

## 3. ประเมินค่าใช้จ่าย

### 3.1 ค่าแรงตาม Phase

| Phase | งาน | Man-days | ราคา (บาท) |
|-------|-----|--------:|----------:|
| 1 | Requirement & Design | 40 | 200,000 |
| 2 | Backend Development | 120 | 600,000 |
| 3 | Mobile App Development | 100 | 500,000 |
| 4 | Admin Dashboard | 50 | 250,000 |
| 5 | Integration (GPS Hardware) | 30 | 150,000 |
| 6 | Testing & QA | 40 | 200,000 |
| 7 | UAT & Deployment | 20 | 100,000 |
| **รวมค่าแรง** | | **400** | **2,000,000** |

### 3.2 ค่าแรงแยกตามทีม

| ทีม | Man-days | ราคา (บาท) |
|-----|--------:|----------:|
| Project Manager | 60 | 300,000 |
| UX/UI Designer | 30 | 150,000 |
| Backend Developer | 90 | 450,000 |
| Mobile Developer (Flutter/RN) | 80 | 400,000 |
| Frontend Developer (Admin) | 40 | 200,000 |
| DevOps / Infrastructure | 30 | 150,000 |
| QA Engineer | 40 | 200,000 |
| Integration Specialist | 30 | 150,000 |
| **รวม** | **400** | **2,000,000** |

### 3.3 Infrastructure & Services (ปีแรก)

| รายการ | รายละเอียด | ราคา/ปี (บาท) |
|--------|-----------|-------------:|
| Cloud Server | AWS/GCP (Real-time processing) | 180,000 |
| Database | Managed PostgreSQL + Redis | 60,000 |
| Map API | Google Maps Platform | 120,000 |
| Push Notification | Firebase / OneSignal | 12,000 |
| SSL & Domain | Certificate + Domain | 5,000 |
| App Store | Apple + Google | 4,400 |
| **รวม Infrastructure** | | **381,400** |

### 3.4 ไม่รวมในประเมิน (ลูกค้ามีอยู่แล้ว)

| รายการ | หมายเหตุ |
|--------|---------|
| GPS Hardware | ติดตั้งบนรถแล้ว |
| SIM/Data Plan | สำหรับส่งข้อมูลจากรถ |
| Server Room | ถ้าใช้ On-premise |

---

## 4. สรุปงบประมาณ

| หมวด | ราคา (บาท) |
|------|----------:|
| ค่าแรง | 2,000,000 |
| Infrastructure ปีแรก | 381,400 |
| Contingency 10% | 238,140 |
| **รวมทั้งหมด** | **2,619,540** |
| VAT 7% | 183,368 |
| **ยอดสุทธิ** | **2,802,908** |

### สรุปแบบย่อ

| รายการ | ค่า |
|--------|----:|
| งบประมาณ (รวม VAT) | **~2.8 ล้านบาท** |
| ระยะเวลา | **5-6 เดือน** |
| ทีมงาน | **8-10 คน** |
| Man-days รวม | **400 วัน** |

---

## 5. Timeline

```
เดือน      1       2       3       4       5       6
         |-------|-------|-------|-------|-------|-------|
Phase 1  ████                                            Requirement & Design
Phase 2      ████████████████                            Backend Development
Phase 3          ████████████████                        Mobile App
Phase 4              ████████                            Admin Dashboard
Phase 5                      ████████                    GPS Integration
Phase 6                          ████████                Testing & QA
Phase 7                                  ████            UAT & Deploy
```

### รายละเอียด Timeline

| Phase | ระยะเวลา | Milestone |
|-------|---------|-----------|
| 1. Requirement & Design | 3 สัปดาห์ | Wireframe + UI Design approved |
| 2. Backend Development | 8 สัปดาห์ | API Ready + Real-time engine |
| 3. Mobile App | 8 สัปดาห์ | iOS + Android Beta |
| 4. Admin Dashboard | 4 สัปดาห์ | Admin Web Ready |
| 5. GPS Integration | 4 สัปดาห์ | Hardware connected + Data flowing |
| 6. Testing & QA | 4 สัปดาห์ | Bug fixed + Performance tested |
| 7. UAT & Deploy | 2 สัปดาห์ | App Store + Production |

---

## 6. Feature Slides (สำหรับ Presentation)

### Slide 1: Overview
```
🚌 Bus Tracking App
ติดตามรถโดยสารแบบ Real-time

• ดูตำแหน่งรถสด
• รู้เวลารถถึงป้าย
• ค้นหาเส้นทาง
• แจ้งเตือนอัตโนมัติ
```

### Slide 2: Real-time Tracking
```
📍 ติดตามตำแหน่งรถแบบ Real-time

• แสดงตำแหน่งรถบนแผนที่
• อัพเดททุก 5-10 วินาที
• เห็นรถทุกคันในเส้นทาง
• แยกสีตามสถานะ (ปกติ/ช้า/เร็ว)
```

### Slide 3: ETA - เวลารถถึงป้าย
```
⏱️ คำนวณเวลารถถึงป้าย (ETA)

• AI คำนวณจากข้อมูลจริง
• คิดรวมสภาพจราจร
• แม่นยำ ±2-5 นาที
• แสดงรถ 3 คันถัดไป
```

### Slide 4: Route Finder
```
🗺️ ค้นหาเส้นทาง

• ใส่จุดเริ่ม - จุดหมาย
• แนะนำเส้นทางที่ดีที่สุด
• เปรียบเทียบหลายทางเลือก
• แสดงเวลา + ค่าโดยสาร
```

### Slide 5: Smart Alert
```
🔔 แจ้งเตือนอัจฉริยะ

• แจ้งเมื่อรถใกล้ถึงป้าย
• ตั้งเวลาออกจากบ้าน
• เตือนก่อนถึงป้ายลง
• Push notification
```

### Slide 6: Admin Dashboard
```
💻 ระบบจัดการหลังบ้าน

• Monitor รถทั้งหมด Real-time
• จัดการเส้นทาง/ป้าย
• ดูสถิติการใช้งาน
• รายงานความตรงเวลา
```

### Slide 7: Technical Architecture
```
🔧 สถาปัตยกรรมระบบ

┌─────────┐     ┌─────────┐     ┌─────────┐
│ GPS on  │ →→→ │ Backend │ →→→ │  Mobile │
│  Bus    │     │ Server  │     │   App   │
└─────────┘     └─────────┘     └─────────┘
                     ↓
              ┌─────────────┐
              │ Admin Panel │
              └─────────────┘
```

---

## 7. เงื่อนไขการชำระเงิน

| งวด | เงื่อนไข | % | จำนวน (บาท) |
|-----|---------|--:|------------:|
| 1 | เซ็นสัญญา | 30% | 840,872 |
| 2 | ส่งมอบ Design + Backend API | 30% | 840,872 |
| 3 | ส่งมอบ Mobile App + Admin | 25% | 700,727 |
| 4 | UAT ผ่าน + Go-Live | 15% | 420,437 |
| **รวม** | | **100%** | **2,802,908** |

---

## 8. ค่าบำรุงรักษารายปี

| รายการ | ราคา/ปี (บาท) |
|--------|-------------:|
| Cloud Infrastructure | 180,000 |
| Map API | 120,000 |
| App Maintenance | 150,000 |
| Bug Fix & Updates | 100,000 |
| Support | 80,000 |
| **รวม/ปี** | **630,000** |

---

## 9. ความเสี่ยงและข้อควรระวัง

| ความเสี่ยง | ระดับ | แนวทาง |
|-----------|:-----:|--------|
| GPS Hardware ไม่ compatible | 🟡 | ต้อง survey protocol ก่อน |
| Data ส่งไม่สม่ำเสมอ | 🟡 | ออกแบบ retry + offline buffer |
| Map API ค่าใช้จ่ายบาน | 🟡 | ใช้ OpenStreetMap ทดแทน |
| User Adoption ต่ำ | 🟡 | UX ต้องดี + marketing |

---

## 10. เปรียบเทียบกับ ViaBus

| Feature | ViaBus | โครงการนี้ (MVP) |
|---------|:------:|:---------------:|
| Real-time Tracking | ✅ | ✅ |
| ETA | ✅ | ✅ |
| Route Finder | ✅ | ✅ |
| Multi-transport | ✅ (รถ, เรือ, BTS) | ⭕ (รถเท่านั้น) |
| 70+ จังหวัด | ✅ | ⭕ (1 จังหวัด) |
| Alert | ✅ | ✅ |
| Offline | ✅ | ⭕ (Phase 2) |

> **หมายเหตุ:** MVP เริ่มจาก 1 จังหวัด แล้วขยายภายหลังได้

---

*อ้างอิง: ViaBus - https://www.viabus.co/*

*Created by WEnDyS — 2026-02-04*
