# Focus

## Current State

**Status**: EcoStove Daemon + SRT Slides Scripting
**Date**: 2026-02-23

---

## EcoStove

### สำเร็จแล้ว
1. ✅ Daemon ดึงข้อมูล 2 sensors ทุก 5 นาที (`sync_to_supabase.js`)
2. ✅ Web dashboard แก้ bug admin tabs ไม่โหลด (premature return)
3. ✅ Filter dropdown แยก sensor ในตาราง
4. ✅ CRUD toggle/delete สำหรับ devices, volunteers, subjects
5. ✅ ลบแท็ปบันทึกข้อมูล (ไม่ใช้แล้ว)

### ยังค้าง
- [ ] Dashboard data boxes เพี้ยน (ไม่ครบ)
- [ ] PM2 auto-launch สำหรับ daemon

### วิธีรัน Daemon
```bash
cd lab/tuya-ecostove
node sync_to_supabase.js          # loop ทุก 5 นาที
node sync_to_supabase.js --once   # ครั้งเดียว
```

---

## SRT Slides

### บทพูด (draft)
- System Architecture ✅ — ภาษาคน
- Kiosk Pain Points + Solution ✅
- Kiosk Admin Pain Points + Solution ✅
- Mobile App ✅ — ยกระดับ D-ticket
- Data Flow ✅ — ภาษาคน
- Timeline ✅ — Gantt chart (`lab/swt-slides/timeline.html`)

### ยังค้าง
- [ ] แก้สไลด์จริงตามบทพูดใหม่
- [ ] เช็ค timeline.html พอดีจอหรือยัง

---

## Reminder (2026-02-20)

**Supabase RLS Fix — EcoStove**

รัน SQL นี้ใน [Supabase SQL Editor](https://supabase.com/dashboard/project/zijybzjstjlqvhmckgor/sql/new):

```sql
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read areas"
  ON public.areas
  FOR SELECT
  USING (true);
```

*Added: 2026-02-19*
