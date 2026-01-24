# Handoff: Tuya Frontend Integration (งง)

**Date**: 2026-01-24 22:30
**Context**: DewS งงกับไฟล์ที่มี ต้องการเริ่มใหม่

---

## What We Did

### Tuya Integration ใส่ Frontend
- DewS paste HTML มาให้ (~1400 บรรทัด) - เป็น Biomass Stove dashboard
- ฉันสร้าง `lab/tuya-ecostove/ecostove-with-sensor.html` ที่เพิ่ม:
  - ปุ่ม "📡 ดึงจาก Sensor" เป็นโหมดแรก
  - HTML section แสดงผลค่า (PM2.5, CO2, Temp, etc.)
  - JavaScript function `fetchFromSensor()` ที่เรียก Edge Function

### ปัญหา
- DewS งงว่าไฟล์อยู่ที่ไหน
- ไม่แน่ใจว่า frontend ที่ใช้จริงอยู่ที่ไหน (repo นี้? repo อื่น? hosted?)
- ไฟล์เยอะ ไม่รู้ว่าอันไหนใช้จริง

---

## สิ่งที่มีอยู่

### ทำงานได้แล้ว
- **Edge Function** `fetch-sensor` - Deploy บน Supabase แล้ว
  - URL: `https://zijybzjstjlqvhmckgor.supabase.co/functions/v1/fetch-sensor`
  - ดึงค่าจาก Tuya → บันทึกลง pollution_logs

### ไฟล์ใหม่ (ยังไม่ commit)
- `lab/tuya-ecostove/ecostove-with-sensor.html` - Frontend ที่เพิ่ม sensor button

### ไฟล์เดิม
- `lab/tuya-ecostove/fetch-sensor/index.ts` - Edge Function code
- `lab/tuya-ecostove/web-snippet.html` - Snippet สำหรับ copy
- `lab/tuya-ecostove/sync_to_supabase.js` - Script รันจาก terminal

---

## Next Session

### ต้องถาม DewS ก่อน
- [ ] Frontend ที่ใช้จริงอยู่ที่ไหน? (repo ไหน / hosted ที่ไหน)
- [ ] ต้องการแก้ไฟล์ไหน กันแน่?

### ถ้ารู้แล้ว
- [ ] ใส่ Tuya sensor button ในไฟล์ที่ถูกต้อง
- [ ] ทดสอบว่าทำงานได้จริง

---

## Architecture Diagram

```
📱 Frontend (HTML)     ☁️ Supabase          🌐 Tuya
     │                      │                  │
     │ POST /fetch-sensor   │                  │
     ├─────────────────────►│ GET device/status│
     │                      ├─────────────────►│
     │                      │◄─────────────────┤
     │                      │ save to DB       │
     │◄─────────────────────┤                  │
     │ show result          │                  │
```

---

## Key Files

| File | Purpose |
|------|---------|
| `lab/tuya-ecostove/ecostove-with-sensor.html` | Frontend ใหม่ (ยังไม่ commit) |
| `lab/tuya-ecostove/supabase/functions/fetch-sensor/index.ts` | Edge Function |
| `lab/tuya-ecostove/web-snippet.html` | Snippet สำหรับ copy |

---

*WEnDyS 💧*
