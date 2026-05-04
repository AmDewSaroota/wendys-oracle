# EcoStove Volunteer Guide — Flow Reference

> สำหรับทำคู่มืออาสาสมัครในอนาคต

## ไฟล์ที่เกี่ยวข้อง
- Volunteer UI: `lab/tuya-ecostove/deploy/volunteer.html`
- Volunteer API: `lab/tuya-ecostove/deploy/api/volunteer.js`
- Sync (cron): `lab/tuya-ecostove/deploy/api/sync.js`
- Dashboard: `lab/tuya-ecostove/deploy/index.html`

## Flow อาสาสมัคร

### ขั้นตอนร่วม (ทุกคน)
1. เปิดหน้า Volunteer → อนุญาต GPS
2. เลือกบ้าน (house_id)
3. เปิดเซนเซอร์ + เปิด Hotspot
4. กด **"เริ่ม Session"** → ระบบเริ่มเก็บ baseline (~10 นาที)
5. จุดเตาเสร็จ → กด **"เริ่มจุดเตาแล้ว"** → ระบบคำนวณ baseline averages แล้วเปลี่ยนเป็น collecting
6. ระบบถาม **"วันนี้ต้องเก็บ TVOC มั้ย?"**

### Flow A: ไม่เก็บ TVOC (กด ❌)
- เห็นข้อความ: "✅ เซนเซอร์เก็บข้อมูลอัตโนมัติ — ปิดหน้าจอได้เลยค่ะ"
- **ปิดหน้าจอไปได้เลย** — ไม่ต้องกลับมากด "จบ Session"
- เซนเซอร์เก็บข้อมูลต่อผ่าน cron (ทุก 5 นาที)
- Session auto-close ที่ 130 นาที โดย sync.js

### Flow B: เก็บ TVOC (กด ✅)
- เห็น TVOC form + countdown 5 นาที
- ทุก 5 นาที: แจ้งเตือน Browser Notification + เสียง beep + สั่น
- อาสาอ่านค่า TVOC จากหน้าจอเซนเซอร์ → กรอกในฟอร์ม → กด submit
- Countdown รีเซ็ตเป็น 5:00 หลัง submit
- ปุ่ม **"จบ Session"** จะโผล่ตอน **100 นาที** (30 นาทีก่อน auto-close)
- ถ้าไม่กด → session auto-close ที่ 130 นาทีเช่นกัน

## Session Lifecycle (Technical)
```
baseline (10 min)
  → อาสากดจุดเตา → API cooking-start → คำนวณ baseline avg
  → collecting (สูงสุด 130 min จาก started_at)
  → auto-cutoff โดย sync.js
  → cooldown 5 ชม.
  → session ถัดไป (MAX 2 sessions/device/day)
```

## ข้อสำคัญ
- **ปุ่ม "จบ Session"** เป็นแค่ปิด UI ฝั่ง client — ไม่ปิด session ใน Supabase
- sync.js เป็นตัวจัดการ session lifecycle จริงๆ (เปิด/ปิด/cutoff)
- TVOC เป็นการ **สุ่มเก็บ** (sampling) ตามที่ อ.แก้ว กำหนด ไม่ได้เก็บทุกรายการ
- Browser Notification ต้องขอ permission ครั้งแรก (อาสาต้องกด "อนุญาต")
- ถ้าอาสาปิด/สลับหน้าจอ → notification ยังทำงาน (background tab)

## Dashboard Features (Admin)
- Auto-refresh ทุก 1 นาที พร้อม countdown แบบเห็น
- Pulse dot: สีเทา = รอเซนเซอร์, สีน้ำเงิน = กำลังเก็บ
- แสดง last check timestamp
- Session card: progress bar + house breakdown + baseline/collecting status

---
*บันทึก: 2026-03-09*
