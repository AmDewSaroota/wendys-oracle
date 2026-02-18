# Follow-up Prompts สำหรับ Gemini — เพิ่มภาพที่ขาด

## สถานะปัจจุบัน
- Gemini สร้าง 21 สไลด์แล้วใน Canvas mode
- แต่ **ภาพไม่ครบ** เพราะ Gemini มี upload limit
- ต้องตรวจสอบว่าสไลด์ไหนขาดภาพ แล้วอัพโหลดเพิ่ม

---

## ขั้นตอนที่ 1: ตรวจสอบสถานะสไลด์

Copy prompt นี้ paste ใน Gemini (ในแชทเดิมที่มี Canvas อยู่):

```
ช่วยบอกหน่อยว่า ในสไลด์ 21 สไลด์ที่สร้างไว้ สไลด์ไหนมีภาพประกอบแล้ว และสไลด์ไหนยังไม่มีภาพ?

กรุณาตอบเป็นตารางแบบนี้:
| สไลด์ | หัวข้อ | มีภาพหรือไม่ | ชื่อไฟล์ภาพที่ต้องใช้ |
```

---

## ขั้นตอนที่ 2: อัพโหลดภาพเพิ่ม (แบ่งเป็น 3 ชุด)

เนื่องจาก Gemini มี limit การอัพโหลดภาพ ให้แบ่งอัพโหลดเป็นชุดๆ:

### ชุด 1: Kiosk (7 ภาพ)
อัพโหลดไฟล์จาก `screenshots/`:
- kiosk-01-main.png
- kiosk-02-train-schedule.png
- kiosk-03-map.png
- kiosk-04-floorplan.png
- kiosk-05-shops.png
- kiosk-07-chat.png

แล้ว paste prompt:
```
นี่คือภาพเพิ่มเติมสำหรับสไลด์ส่วน Kiosk
ช่วยอัพเดตสไลด์เหล่านี้ใน Canvas ให้ใส่ภาพประกอบด้วย:

- สไลด์ 3 (Kiosk หน้าหลัก): ใช้ kiosk-01-main.png
- สไลด์ 4 (ตารางรถไฟ): ใช้ kiosk-02-train-schedule.png
- สไลด์ 5 (แผนที่ & แผนผัง): ใช้ kiosk-03-map.png + kiosk-04-floorplan.png
- สไลด์ 6 (ร้านค้า & แชท): ใช้ kiosk-05-shops.png + kiosk-07-chat.png
```

### ชุด 2: Kiosk Admin + Core Dashboard (14 ภาพ)
อัพโหลดไฟล์จาก `screenshots/`:
- kiosk-admin-02-dashboard.png
- kiosk-admin-03-popup.png
- kiosk-admin-04-kiosk-ma.png
- kiosk-admin-05-analytics.png
- kiosk-admin-06-livewalk.png
- kiosk-admin-07-walkpath.png
- core-01-main.png
- core-02-users.png
- core-03-roles.png
- core-04-report.png
- core-04b-report-traffic.png
- core-04c-report-revenue.png
- core-05-alert.png
- core-06-settings.png

แล้ว paste prompt:
```
นี่คือภาพเพิ่มเติมสำหรับสไลด์ส่วน Kiosk Admin และ Core Dashboard
ช่วยอัพเดตสไลด์เหล่านี้ใน Canvas ให้ใส่ภาพประกอบด้วย:

Kiosk Admin:
- สไลด์ 7 (Kiosk Management): ใช้ kiosk-admin-02-dashboard.png + kiosk-admin-03-popup.png
- สไลด์ 8 (Kiosk MA & Analytics): ใช้ kiosk-admin-04-kiosk-ma.png + kiosk-admin-05-analytics.png
- สไลด์ 9 (LiveWalk Heat Map): ใช้ kiosk-admin-06-livewalk.png
- สไลด์ 10 (Walk Path): ใช้ kiosk-admin-07-walkpath.png

Core Dashboard:
- สไลด์ 16 (Overview): ใช้ core-01-main.png
- สไลด์ 17 (Users & Roles): ใช้ core-02-users.png + core-03-roles.png
- สไลด์ 18 (Executive Report): ใช้ core-04-report.png
- สไลด์ 19 (Traffic & Revenue): ใช้ core-04b-report-traffic.png + core-04c-report-revenue.png
- สไลด์ 20 (Alert & Settings): ใช้ core-05-alert.png + core-06-settings.png
```

### ชุด 3: Mobile Web App (8 ภาพ)
อัพโหลดไฟล์จาก `screenshots/`:
- webapp-01-main.png
- webapp-02-home.png
- webapp-03-schedule.png
- webapp-04-booking.png
- webapp-05-history.png
- webapp-06-rewards.png
- webapp-07-tours.png
- webapp-08-navigation.png
- webapp-09-favorites.png

แล้ว paste prompt:
```
นี่คือภาพเพิ่มเติมสำหรับสไลด์ส่วน Mobile Web App
ช่วยอัพเดตสไลด์เหล่านี้ใน Canvas ให้ใส่ภาพประกอบด้วย:

- สไลด์ 11 (Login & Home): ใช้ webapp-01-main.png + webapp-02-home.png
- สไลด์ 12 (ตารางเดินรถ & จองตั๋ว): ใช้ webapp-03-schedule.png + webapp-04-booking.png
- สไลด์ 13 (ประวัติ & Point): ใช้ webapp-05-history.png + webapp-06-rewards.png
- สไลด์ 14 (ทัวร์ & รายการโปรด): ใช้ webapp-07-tours.png + webapp-09-favorites.png
- สไลด์ 15 (ผังสถานี): ใช้ webapp-08-navigation.png
```

---

## ขั้นตอนที่ 3: ตรวจสอบเนื้อหาสุดท้าย

หลังจากอัพเดตภาพครบแล้ว ให้ paste:

```
ช่วยตรวจสอบสไลด์ทั้ง 21 สไลด์ให้หน่อยว่า:
1. เนื้อหาครบถ้วนตามโครงสร้างที่กำหนดไว้หรือไม่
2. ทุกสไลด์มีภาพประกอบหรือยัง
3. ธีมสีน้ำเงินเข้ม/ทอง สอดคล้องกันทุกสไลด์หรือไม่

ถ้ามีอะไรขาดช่วยเพิ่มให้ด้วย
```

---

## ขั้นตอนที่ 4: Export

เมื่อสไลด์ครบแล้ว กด **"Export to Slides"** ที่มุมบนขวาของ Canvas เพื่อส่งออกเป็น Google Slides

---

## หมายเหตุ
- ถ้า Gemini ไม่ยอมใส่ภาพ: อาจต้องขอให้ "วางรูปประกอบไว้ในสไลด์" หรือ "embed the uploaded image"
- ถ้า Canvas ไม่ตอบสนอง: ลองพิมพ์ "อัพเดตสไลด์ใน Canvas" เพื่อกลับเข้าโหมด Canvas
- ถ้าต้องการเริ่มใหม่: ใช้ prompt จาก gemini-prompt.md แต่แบ่งภาพเป็นชุด
