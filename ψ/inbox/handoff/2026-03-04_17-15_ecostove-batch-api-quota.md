# Handoff: EcoStove Batch API + Quota Tracking

**Date**: 2026-03-04 17:15
**Context**: 85%

## What We Did

### sync.js — Major Refactor (3 critical improvements)
1. **Online check bug fix**: ย้าย online check ไว้ก่อนสร้าง session → ไม่มี session ผีอีก
2. **Batch API**: เปลี่ยนจากเรียก Tuya ทีละตัว → batch ทีเดียว (`/v1.0/iot-03/devices` + `/v1.0/iot-03/devices/status`)
3. **Token caching**: In-memory cache, token ใช้ซ้ำ ~2 ชม. (ลด 96% ของ token calls)
4. **Conditional batch**: Supabase pre-check ก่อน → skip Tuya ถ้าไม่มี sensor ต้องเก็บ
5. **Skip batchStatus**: ถ้าไม่มี sensor online ไม่ต้องดึงค่า sensor
6. **API quota tracking**: นับ calls ต่อเดือน ใน `api_quota` table → หยุดอัตโนมัติถ้าเกิน 24,000

### Dashboard (index.html)
- CSV export (alongside Excel)
- Status wording: "ไม่ได้เปิดเซนเซอร์" vs "ไม่ครบ"
- API usage bar ใน admin panel (เขียว/เหลือง/แดง)

### Slides (ecostove-meeting-ajkaew.html)
- แก้ cost slide, LINE timing, Tuya pricing, CSV/Excel mention, metadata wording
- เพิ่ม dashboard link ที่ slide 12

### Debugging
- พบ CRON_SECRET ไม่ตรง (.env.local vs production) → production ใช้ `ecostove-sync-2026`
- พบ session ผีของ MT29 (จาก code เก่า) → ทำให้ cooldown ค้าง
- Vercel Hobby plan ไม่รองรับ cron ถี่ → ใช้ cron-job.org (external)

## Pending

- [ ] **DewS สร้างตาราง `api_quota`** ใน Supabase SQL Editor:
  ```sql
  CREATE TABLE api_quota (
    month TEXT PRIMARY KEY,
    tuya_calls INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE api_quota ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Allow all for anon" ON api_quota FOR ALL USING (true) WITH CHECK (true);
  ```
- [ ] ทดสอบวันพรุ่งนี้ (5 มี.ค.) — วันแรก code ใหม่ทำงานเต็มวัน ไม่มี session ผี
- [ ] ประชุม อ.แก้ว 10 โมง (5 มี.ค.) — demo dashboard + slides
- [ ] ทดสอบ Batch API endpoint ทำงานถูกต้อง (ดูจาก `tuya_calls` ใน response)
- [ ] Tuya Message Service research (ระยะยาว — push-based, ลด 99%)
- [ ] LINE notification สรุปผล (เที่ยง + 2 ทุ่ม)

## Next Session
- [ ] เช็คผลเก็บข้อมูลพรุ่งนี้เช้า — ไม่มี session ผี, Batch API ทำงาน
- [ ] สรุปผลหลังประชุม อ.แก้ว — feedback อะไรบ้าง
- [ ] ถ้า api_quota table พร้อม → ทดสอบ quota tracking ทำงาน
- [ ] เริ่ม LINE notification system (ถ้า อ.แก้ว approve timing)

## Key Files
- `lab/tuya-ecostove/deploy/api/sync.js` — Core sync (batch API + quota + token cache)
- `lab/tuya-ecostove/deploy/index.html` — Dashboard (CSV export + API usage bar)
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — Meeting slides
- `lab/tuya-ecostove/deploy/vercel.json` — Vercel config (maxDuration: 30)

## API Call Budget (10 เครื่อง)

| วิธี | Calls/เดือน |
|------|------------|
| เดิม (per-device) | ~32,500 ❌ |
| Batch API | ~4,700 |
| + Token cache | ~3,800 |
| + Conditional batch | **~2,500** ✅ |
| Quota limit | 26,000 (buffer 24,000) |

## System Architecture

```
cron-job.org (5 min) → Vercel /api/sync → Tuya Batch API → Supabase
                                        → api_quota tracking
Dashboard ← Supabase (direct read)
```

## Important Notes
- Production CRON_SECRET: `ecostove-sync-2026`
- Vercel Hobby plan: cron วันละ 1 ครั้งเท่านั้น → ต้องใช้ cron-job.org
- MCP Vercel tools ใช้ไม่ได้ (account ไม่ตรง) → ใช้ CLI แทน
