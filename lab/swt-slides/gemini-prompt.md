# Prompt สำหรับ Gemini — สร้างสไลด์ SWT Demo (Canvas Mode)

## วิธีใช้
1. เปิด Gemini (gemini.google.com)
2. อัพโหลดรูปทั้งหมดจากโฟลเดอร์ `screenshots/`
3. Copy prompt ด้านล่างนี้ทั้งหมด แล้ว paste ใน Gemini
4. Gemini จะสร้างสไลด์ใน Canvas mode

---

## Prompt (Copy ทั้งหมดด้านล่าง)

```
สร้างสไลด์พรีเซนเทชั่นใน Canvas mode ให้หน่อย

โปรเจกต์: SWT — Smart Tourism ระบบท่องเที่ยวอัจฉริยะสำหรับสถานีรถไฟ
ลูกค้า: การรถไฟแห่งประเทศไทย (SRT)
ทีมพัฒนา: NDF

ฉันแนบ screenshot ของ demo ระบบทั้ง 3 ส่วนมาให้ ช่วยสร้างสไลด์พรีเซนต์ฟังก์ชันทั้งหมด พร้อมใช้ screenshot เป็นภาพประกอบในแต่ละสไลด์

---

## โครงสร้างสไลด์ที่ต้องการ

### สไลด์ 1: Cover
- ชื่อ: SWT — Smart Tourism Platform
- Subtitle: ระบบท่องเที่ยวอัจฉริยะสำหรับสถานีรถไฟ
- โดย NDF สำหรับ การรถไฟแห่งประเทศไทย (SRT)

### สไลด์ 2: System Overview
- แสดงภาพรวมระบบ 3 ส่วน: Kiosk, Mobile Web App, Core Dashboard
- อธิบายว่าทุกส่วนเชื่อมกับ Core Database กลาง

---

### สไลด์ 3: Kiosk — หน้าหลัก
- ภาพ: kiosk-01-main.png
- ฟีเจอร์: AI Character (SRT BOT), รองรับ 4 ภาษา (TH/EN/CN/KR), การ์ดกิจกรรม/ท่องเที่ยว/โปรโมชั่น, คำถามยอดนิยม 6 ข้อ

### สไลด์ 4: Kiosk — ตารางรถไฟ
- ภาพ: kiosk-02-train-schedule.png
- ฟีเจอร์: แสดงตารางเดินรถ DEPARTURES แบบ real-time, เวลา/ปลายทาง/ชานชาลา/สถานะ (ตรงเวลา/ออกแล้ว)

### สไลด์ 5: Kiosk — แผนที่ท่องเที่ยว & แผนผังสถานี
- ภาพ: kiosk-03-map.png + kiosk-04-floorplan.png
- ฟีเจอร์: แผนที่สถานที่ท่องเที่ยวรอบสถานี, แผนผังสถานีพร้อมตำแหน่ง "คุณอยู่ตรงนี้", แสดง Gate 1-4, Red Line, Long Distance, Southern Line

### สไลด์ 6: Kiosk — ร้านค้า & แชท AI
- ภาพ: kiosk-05-shops.png + kiosk-07-chat.png
- ฟีเจอร์: รายการร้านค้า 5 ร้าน (Cafe Amazon, S&P, OTOP, Doi Chaang, 7-Eleven) พร้อมสถานะเปิด/ปิด, Chatbot พิมพ์ถามคำถามได้

---

### สไลด์ 7: Kiosk Admin — Kiosk Management
- ภาพ: kiosk-admin-02-dashboard.png + kiosk-admin-03-popup.png
- ฟีเจอร์: จัดการ Banner Advertisement (Campaign, Type, Status, Impressions, CTR), Popup Messages หลายภาษา (Welcome, Train Delay Alert, Emergency)

### สไลด์ 8: Kiosk Admin — Kiosk MA & Analytics
- ภาพ: kiosk-admin-04-kiosk-ma.png + kiosk-admin-05-analytics.png
- ฟีเจอร์: Kiosk Maintenance - 14 ตู้ สถานะ Online/Offline, Avg Uptime 98%, Analytics - สถิติการใช้งาน 57,860 ครั้ง, กราฟคำถามยอดนิยม, กราฟอุปกรณ์

### สไลด์ 9: Kiosk Admin — LiveWalk Heat Map
- ภาพ: kiosk-admin-06-livewalk.png
- ฟีเจอร์: DeepTrack Heatmap ความหนาแน่นรายชั่วโมง, Node สถานี 8 จุด พร้อมสถานะ Comfort/Busy/Alert, Occupancy %, Detected count

### สไลด์ 10: Kiosk Admin — Walk Path Location
- ภาพ: kiosk-admin-07-walkpath.png
- ฟีเจอร์: Node Flow Map แสดงเส้นทางการเดินภายในสถานี, สถิติ Unique Device 126,240, จำนวนเดินผ่านแต่ละ Node, กราฟเปรียบเทียบ

---

### สไลด์ 11: Mobile Web App — Login & Home
- ภาพ: webapp-01-main.png + webapp-02-home.png
- ฟีเจอร์: Login ด้วย ThaiID / Email / Guest, หน้า Home - Gold Member 2,450 คะแนน, 8 shortcuts (จองตั๋ว/ตาราง/ทัวร์/ประวัติ/Point/โค้ดลด/รายการโปรด/นำทาง), ค้นหาเที่ยวรถไฟ

### สไลด์ 12: Mobile Web App — ตารางเดินรถ & จองตั๋ว
- ภาพ: webapp-03-schedule.png + webapp-04-booking.png
- ฟีเจอร์: ตารางเดินรถ กรุงเทพ→เชียงใหม่ พร้อมราคา/ที่นั่งว่าง, จองตั๋วไป-กลับ เลือกจำนวนผู้ใหญ่/เด็ก/ชั้นที่นั่ง

### สไลด์ 13: Mobile Web App — ประวัติการจอง & Point/Reward
- ภาพ: webapp-05-history.png + webapp-06-rewards.png
- ฟีเจอร์: ประวัติการจอง - สถานะ เดินทางแล้ว/รอเดินทาง/ยกเลิก/เสร็จสิ้น, Point/Reward - Gold Member, แลกรางวัล (ส่วนลด/อัพเกรดที่นั่ง/ตั๋วฟรี/ทัวร์ฟรี)

### สไลด์ 14: Mobile Web App — ทัวร์ & รายการโปรด
- ภาพ: webapp-07-tours.png + webapp-09-favorites.png
- ฟีเจอร์: ทัวร์สถานีรถไฟ (หัวหิน ฿890, สะพานข้ามแม่น้ำแคว ฿2,490), รายการโปรด - บันทึกเส้นทาง/ทัวร์ที่ชอบ

### สไลด์ 15: Mobile Web App — ผังสถานี & นำทาง
- ภาพ: webapp-08-navigation.png
- ฟีเจอร์: ผังสถานี Interactive Map, แสดงอาคาร/จำหน่ายตั๋ว/ชานชาลา, ที่จอดรถ/สวน/ทางเข้าหลัก

---

### สไลด์ 16: Core Dashboard — Overview
- ภาพ: core-01-main.png
- ฟีเจอร์: DeepTrack Heatmap LIVE 572 Sensors, KPI - คนในสถานี 2,340 / เที่ยวรถไฟ 42 / แจ้งเหตุ 3 / บูทเปิด 8/10 / App Users 1,205, แจ้งเหตุล่าสุด

### สไลด์ 17: Core Dashboard — Users & Roles
- ภาพ: core-02-users.png + core-03-roles.png
- ฟีเจอร์: User Management - จัดการผู้ใช้ 6 คน (email, role, status, last login), 4 Roles: Admin (สิทธิ์ทั้งหมด), Executive (dashboard/users/report/alert/export), Staff (dashboard/alert), Vendor (dashboard เท่านั้น)

### สไลด์ 18: Core Dashboard — Executive Report
- ภาพ: core-04-report.png
- ฟีเจอร์: ผู้โดยสาร 3,720 / รายได้ ฿2.3M / ร้านค้า 13/25 / แจ้งเหตุ 8, สถานะ Kiosk 10 ตู้, แผนผังพื้นที่สถานี, ร้านค้าตามประเภทราคา + Occupancy Rate 50%

### สไลด์ 19: Core Dashboard — Traffic & Revenue Report
- ภาพ: core-04b-report-traffic.png + core-04c-report-revenue.png
- ฟีเจอร์: Traffic Analytics กราฟรายชั่วโมง, Revenue - รายได้ตามช่วงราคา (฿723K/฿819K/฿463K/Kiosk Ads ฿269K), Export PDF/Excel

### สไลด์ 20: Core Dashboard — Alert & Settings
- ภาพ: core-05-alert.png + core-06-settings.png
- ฟีเจอร์: จัดการแจ้งเหตุ - filter ใหม่/กำลังแก้ไข/เสร็จแล้ว, Settings - Core Config (Health Check, EFK Logging, OAuth2, Notification), Theme/ภาษา/Auto Refresh, System Status 6 services

### สไลด์ 21: Thank You / Q&A
- ขอบคุณ
- ข้อมูลติดต่อทีม NDF

---

## Style Guidelines
- ใช้ธีมสีน้ำเงินเข้ม/ทอง (สอดคล้องกับ SRT branding)
- ใส่ screenshot เป็นภาพประกอบทุกสไลด์
- ข้อความกระชับ เน้น bullet points
- ภาษาไทยเป็นหลัก คำศัพท์เทคนิคใช้ภาษาอังกฤษได้
```
