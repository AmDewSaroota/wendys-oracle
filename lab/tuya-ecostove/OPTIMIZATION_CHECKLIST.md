# Biomass Stove Optimization Checklist

**รีวิวโดย**: WEnDyS
**วันที่**: 2026-03-06
**สถานะ**: In Progress

---

## CRITICAL — ทำทันที

- [x] **~~Admin password hardcoded ใน frontend~~** (done 2026-03-06)
  - ~~แก้: เปลี่ยนเป็น Supabase Auth (email+password) — `migrations/006_auth.sql`~~
  - **ขั้นตอนเปิดใช้งาน:** ตั้ง `SUPABASE_SERVICE_KEY` ใน Vercel → รัน 006 → สร้าง admin users

- [x] **~~RLS policies เปิด `USING (true)` ทุก table~~** (done 2026-03-06)
  - ~~แก้: `migrations/006_auth.sql` — DROP permissive write policies, CREATE admin-only policies~~
  - ~~sync.js ใช้ service_role key (bypass RLS)~~
  - Effort: 2 ชม.

- [x] **~~Missing indexes บน `pollution_logs`~~** (done 2026-03-06)
  - ~~ไฟล์: Supabase SQL Editor~~
  - ~~แก้: `migrations/005_indexes.sql` — session_id, (device_id, recorded_at), status~~

---

## HIGH — ลด cost + เพิ่ม performance

- [x] **~~loadData() โหลด pollution_logs ทั้งหมดไม่ filter~~** (done 2026-03-06)
  - ~~แก้: เพิ่ม `.gte('recorded_at', 30 days ago).limit(10000)`~~

- [x] **~~Auto-refresh ไม่หยุดเมื่อ tab hidden~~** (done 2026-03-06)
  - ~~แก้: เพิ่ม `visibilitychange` listener หยุด/เริ่ม interval~~

- [ ] **N+1 queries Phase 1 ใน sync.js**
  - ไฟล์: `deploy/api/sync.js` ~line 559-602
  - ปัญหา: วนลูป sensor แต่ละตัว query 3 ครั้ง (active session, last closed, count today)
  - ขนาดปัญหา: 10 sensors × 3 queries = 30 serial queries ต่อ sync
  - แก้: batch fetch sessions ทั้งหมดใน 1-2 queries แล้ว map ตาม device_id
  - ประหยัด: ~233,000 REST queries/เดือน (10 sensors)
  - Effort: 3 ชม.

- [x] **~~Session creation race condition — daily limit ไม่มี lock~~** (done 2026-03-06)
  - ~~แก้: pre-check + post-check (optimistic lock) ใน `createSession()`~~
  - ~~ถ้า post-check เกิน MAX → rollback session ที่เพิ่งสร้าง~~

- [ ] **ไม่มี retry Tuya API**
  - ไฟล์: `deploy/api/sync.js` ~line 641-654
  - ปัญหา: transient error = เสีย data ทั้ง sync cycle ไม่มีโอกาสลองใหม่
  - แก้: เพิ่ม retry 2 ครั้ง + exponential backoff
  - Effort: 2 ชม.

---

## MEDIUM — ปรับปรุงเมื่อมีเวลา

- [ ] **Timezone implicit UTC**
  - ไฟล์: `deploy/api/sync.js` ~line 211, 343
  - ปัญหา: daily summary ใช้ UTC date แต่ข้อมูลเก็บเวลาไทย (UTC+7) — ~5% sessions อาจผิดวัน
  - แก้: ใช้ `Asia/Bangkok` timezone ในการคำนวณ "วันนี้"
  - Effort: 1 ชม.

- [ ] **Thai address data ไม่ cache**
  - ไฟล์: `deploy/index.html` ~line 659
  - ปัญหา: โหลด 200KB จาก GitHub CDN ทุก page load
  - แก้: cache ใน `localStorage` — refresh ทุก 7 วัน
  - Effort: 1 ชม.

- [ ] **ไม่มี confirm dialog ก่อน delete**
  - ไฟล์: `deploy/index.html` — deleteDevice, deleteProject, deleteSubject
  - ปัญหา: กดลบแล้วลบเลย ไม่ถามยืนยัน
  - แก้: เพิ่ม `confirm()` ก่อนทุก delete operation
  - Effort: 30 นาที

- [ ] **closeSession silent failure**
  - ไฟล์: `deploy/api/sync.js` ~line 283-293
  - ปัญหา: ถ้า logs query fail → mark "incomplete" โดยไม่ retry → เสีย aggregates
  - แก้: เพิ่ม retry 1 ครั้งก่อน mark incomplete
  - Effort: 1 ชม.

- [ ] **Data retention policy (ยังไม่มี)**
  - ปัญหา: `pollution_logs` โตไม่หยุด — 300 บ้าน (sensor หมุนเวียน) ยังไม่วิกฤต แต่ควรวางแผนไว้
  - แก้: archive ข้อมูลเก่ากว่า 6 เดือน หรือ partition table
  - Effort: 4-8 ชม.

- [ ] **TVOC manual input ไม่ validate**
  - ไฟล์: `deploy/index.html` ~line 1296
  - ปัญหา: ใส่ค่าลบหรือ 999999 ได้
  - แก้: เพิ่ม range check (0-500 µg/m³)
  - Effort: 15 นาที

- [ ] **Monthly quota race condition**
  - ไฟล์: `deploy/api/sync.js` ~line 620-698
  - ปัญหา: quota check ก่อน Tuya call แต่ update หลัง — concurrent runs อาจเกิน limit
  - แก้: update quota ทันทีหลังแต่ละ Tuya call
  - Effort: 1 ชม.

---

## LOW — Nice-to-have

- [ ] **Hardcoded constants ใน sync.js**
  - ปัญหา: เปลี่ยน SESSION_GAP_MINUTES ต้อง redeploy
  - แก้: ย้ายไป env vars
  - Effort: 1 ชม.

- [ ] **Duplicate map code (basic + deep)**
  - ปัญหา: `loadBasicMapMarkers()` กับ `loadSubjectMarkers()` เหมือนกัน 95%
  - แก้: refactor เป็น shared function
  - Effort: 1 ชม.

- [ ] **ใช้ RPC แทน JS aggregation ใน closeSession**
  - ปัญหา: ดึง raw logs ทั้งหมดมาคำนวณ avg ใน JS แทนที่จะให้ DB ทำ
  - แก้: สร้าง stored procedure `compute_session_summary()`
  - ประหยัด: ลด bandwidth 98% ต่อ closeSession call
  - Effort: 2 ชม.

---

## สรุป Progress

| ระดับ | ทั้งหมด | เสร็จ | เหลือ |
|-------|---------|-------|-------|
| CRITICAL | 3 | 3 | 0 |
| HIGH | 5 | 3 | 2 |
| MEDIUM | 7 | 0 | 7 |
| LOW | 3 | 0 | 3 |
| **รวม** | **18** | **6** | **12** |

---

*อัปเดตล่าสุด: 2026-03-06 โดย WEnDyS*
