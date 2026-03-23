# EcoStove Full Code Review

**Date:** 2026-03-23
**Reviewer:** WEnDyS (4 parallel review agents)
**Scope:** Entire EcoStove codebase
**Files:** index.html (8,492 lines), sync.js (1,061 lines), sync-logic.js (225 lines), volunteer.html (1,456 lines), volunteer.js (183 lines), 9 admin API files

---

## Summary

| Severity | Dashboard | Sync API | Volunteer | Admin APIs | **Total** |
|----------|-----------|----------|-----------|------------|-----------|
| CRITICAL | 1 | 4 | 4 | 4 | **13** |
| HIGH | 5 | 5 | 4 | 5 | **19** |
| MEDIUM | 7 | 8 | 7 | 8 | **30** |
| LOW | 6 | 6 | 7 | 7 | **26** |
| INFO | 4 | 6 | 7 | 6 | **23** |
| **Total** | **23** | **29** | **29** | **30** | **111** |

---

## Action Priority

### P0 — ต้องแก้ก่อน UAT (ข้อมูลผิด / ถูกทำลายได้)

| ID | Area | Issue | Impact |
|----|------|-------|--------|
| V-C1 | Volunteer | **RLS เปิดกว้าง — anon key ลบข้อมูลทั้ง DB ได้** | ใครก็ DELETE pollution_logs/sessions ได้ |
| A-C4 | Admin | **Client ส่ง hash เป็น credential — hash = password** | ได้ hash = login ได้เลย ไม่ต้องรู้ PIN |
| A-C3 | Admin | **Recovery code ไม่ถูกยกเลิกหลังใช้** | ใช้ซ้ำได้ตลอด reset PIN ซ้ำๆ |
| S-C1 | Sync | **Race condition: createSession ไม่ atomic** | อาจได้ 3+ session/วัน (เกิน limit 2) |
| S-C2 | Sync | **readings_count เกิน 1 ตอน baseline→collecting** | จำนวน log ไม่ตรงกับ readings_count |
| S-C4 | Sync | **completeness นับรวม baseline readings** | session ถูก mark complete เร็วเกินจริง |
| D-H01 | Dashboard | **Timezone: getThaiToday() ไม่ consistent** | ข้อมูลวันผิดช่วงเที่ยงคืน-ตี 7 |

### P1 — ควรแก้ก่อน field deployment

| ID | Area | Issue | Impact |
|----|------|-------|--------|
| V-C2 | Volunteer | **volunteer.js ไม่มี auth เลย** | ใครก็เรียก cooking-start ได้ |
| A-C1 | Admin | **PIN comparison ไม่ timing-safe** | timing attack เดา hash ได้ |
| A-C2 | Admin | **Recovery code เก็บ plaintext** | DB leak = ได้ recovery code ทุกคน |
| A-H1 | Admin | **CORS: `*` ทุก endpoint** | เว็บไหนก็เรียก admin API ได้ |
| A-H2 | Admin | **ไม่มี rate limiting** | brute-force PIN 4 หลัก = 10,000 ครั้ง |
| A-H3 | Admin | **Error message บอกว่า email มีหรือไม่มี** | enumerate admin emails ได้ |
| A-M3 | Admin | **`ilike` ใน email lookup** | `email=%` = match admin คนแรก |
| S-C3 | Sync | **Adjusted humidity clamp ที่ 0** | ค่าลดลงจริงหายไป |
| S-H3 | Sync | **PM10 ไม่ถูกคำนวณใน closeSession** | avg_pm10 = null ตลอด |
| V-H3 | Volunteer | **GPS accuracy ไม่ถูก validate** | อาจจับคู่บ้านผิด |
| V-H5 | Volunteer | **session_id ไม่ validate กับ house_id** | transition session บ้านอื่นได้ |
| D-C01 | Dashboard | **XSS ใน admin list (name ไม่ escape)** | register ชื่อ XSS → โจมตี super admin |

### P2 — ควรแก้ (code quality / performance)

| ID | Area | Issue | Impact |
|----|------|-------|--------|
| S-H1 | Sync | **Batch status calls ไม่มี rate limit** | Tuya อาจ throttle |
| S-H2 | Sync | **Token retry ไม่ clear cache เมื่อ auth fail** | Tuya token หมดอายุ → retry ใช้ token เดิม |
| S-M3 | Sync | **Constants ซ้ำระหว่าง sync.js กับ sync-logic.js** | เปลี่ยนที่เดียว อีกที่ไม่เปลี่ยนตาม |
| S-M6 | Sync | **loadSensors ทำ 4 queries แบบ sequential** | ช้ากว่าที่ควร |
| S-M7 | Sync | **ไม่มี timeout บน fetch calls** | Tuya/Supabase hang = function timeout |
| D-H02 | Dashboard | **XSS ใน showInfo popup** | innerHTML ไม่ escape |
| D-H03 | Dashboard | **XSS ใน Leaflet map popups** | house name ไม่ escape |
| D-H05 | Dashboard | **XSS ใน showConfirm** | message ไม่ escape |
| D-M01 | Dashboard | **Math.max(...array) stack overflow risk** | crash เมื่อข้อมูลเยอะ |
| V-M1 | Volunteer | **Poll ทุก 15 วินาที — เยอะเกินไป** | เปลือง data มือถือ |
| A-L1 | Admin | **Auth logic ซ้ำทุกไฟล์** | แก้ security fix ต้องแก้ 7+ ไฟล์ |
| A-M4 | Admin | **Supabase error text ส่งกลับ client** | เปิดเผย schema |
| A-H4 | Admin | **PATCH ไม่เช็คว่า update จริงหรือเปล่า** | success แม้ไม่มี row ถูก update |
| A-H5 | Admin | **Super admin ถูก demote ได้** | อาจไม่เหลือ super admin |
| V-C4 | Volunteer | **Race condition ใน session lock** | 2 browser ล็อคพร้อมกันได้ |

### P3 — Nice-to-have / Post-UAT

| ID | Area | Issue | Impact |
|----|------|-------|--------|
| S-H4 | Sync | **stove_type อาจ stale หลังเปลี่ยน period** | daily summary ใช้ค่าเก่า |
| S-M1 | Sync | **Manual UTC+7 offset แทน Intl API** | ใช้ได้แต่ fragile |
| S-M2 | Sync | **_debug field expose device IDs** | ข้อมูลไม่ควรอยู่ใน response |
| S-M5 | Sync | **upsertDailySummary ทำทุก sensor แม้ idle** | เปลืองเรียก Supabase |
| V-H2 | Volunteer | **ไม่มี offline retry queue** | ข้อมูลหายเมื่อ hotspot หลุด |
| V-L1 | Volunteer | **Dead code: submitTvoc, updateTvocList, etc.** | สะอาดขึ้นถ้าลบ |
| V-L7 | Volunteer | **CDN Tailwind (ไม่ optimize)** | +300KB สำหรับมือถือ |
| D-M05 | Dashboard | **i18n ไม่ครบ — ~40 strings hardcode ภาษาไทย** | English mode แสดงไทยปน |
| D-M06 | Dashboard | **Single file 8,492 lines** | maintain ยาก |
| D-L02 | Dashboard | **CSV export logic ซ้ำ 3 ที่** | maintain ยาก |
| A-L6 | Admin | **ไม่มี activity log สำหรับ role/delete/PIN** | ตรวจสอบย้อนหลังไม่ได้ |
| A-M6 | Admin | **ไม่มีทางสร้าง super admin คนแรกจาก UI** | ต้อง INSERT ใน DB ตรงๆ |
| A-I1 | Admin | **SHA-256 ไม่เหมาะกับ password hashing** | ควรใช้ bcrypt |
| S-I1 | Sync | **ไม่มี integration tests** | ทดสอบ state machine ไม่ได้ |
| V-I1 | Volunteer | **ควรมี navigator.onLine detection** | UX ดีขึ้นเมื่อ offline |
| V-I4 | Volunteer | **ควรมี service worker** | page ใช้ได้เมื่อ offline |

---

## Detailed Findings

### A. Dashboard (index.html)

#### CRITICAL

**D-C01: XSS ใน Admin Management List**
Lines 3567-3578 — `loadAdminsList()` ใส่ `a.name` และ `a.email` ใน innerHTML โดยไม่ escape ด้วย `esc()` + inject ชื่อเข้า onclick handler ด้วย single-quote interpolation
Fix: ใช้ `esc()` กับ `escAttr()` ทุกที่

#### HIGH

**D-H01: Timezone ไม่ consistent — "today" ใช้ UTC บางที่**
Line 4272 ใช้ `new Date().toISOString().slice(0,10)` (UTC) แต่ line 5208 ใช้ `+7*3600000` (ถูก)
อีก 5+ ที่ใช้ UTC: lines 5537, 6270, 6388, 6621, 7804
Fix: สร้าง `getThaiToday()` ใช้ทุกที่

**D-H02: XSS ใน showInfo popup**
Line 3041 — `title` + `content` ใส่ innerHTML ไม่ escape
Fix: `esc(title)` + `esc(l)`

**D-H03: XSS ใน Leaflet map popups**
Lines 8118-8130, 8230-8242 — `s.full_name` + `deviceName` ไม่ escape
Fix: `esc(s.full_name)`

**D-H04: Global namespace pollution ใน approval cards**
Lines 5761-5763 — เก็บข้อมูลบน `window[sKey]`
Fix: ใช้ dedicated object map

**D-H05: XSS ใน showConfirm**
Line 3851 — `message` ใส่ innerHTML ไม่ escape
Fix: `esc(message)`

#### MEDIUM

**D-M01: Math.max(...array) stack overflow risk** — 14 occurrences
**D-M02: Date constructor ambiguity** — `T12:00:00` vs `T00:00:00Z`
**D-M03: Incomplete escaping ใน onclick** — sensor name `.replace(/'/g, ...)`
**D-M04: Export pagination reuse query object** — อาจได้ duplicate rows
**D-M05: i18n ไม่ครบ ~40 strings** — English mode แสดงไทยปน
**D-M06: Single file 8,492 lines** — maintain ยาก
**D-M07: Session notes innerHTML ไม่ escape** — `translateNote()` output

#### LOW

**D-L01:** i18n dictionary inline 800 lines
**D-L02:** CSV export logic ซ้ำ 3 ที่
**D-L03:** Auto-refresh ทุกครั้งที่ focus tab (ไม่เช็ค elapsed)
**D-L04:** Error handling ไม่ consistent
**D-L05:** Export date range default ใช้ UTC
**D-L06:** Redundant Date construction in loop

---

### B. Sync API (sync.js + sync-logic.js)

#### CRITICAL

**S-C1: Race condition — createSession ไม่ atomic**
Lines 416-452 — pre-check + INSERT + post-check ไม่ atomic → 2 cron พร้อมกัน อาจได้ 3+ sessions/day
Fix: ใช้ PostgreSQL function + `SELECT FOR UPDATE` หรือ unique constraint

**S-C2: readings_count inflate +1 ตอน baseline→collecting**
Lines 731, 743, 760-762 — baseline transition increment + Phase 6 insertLog = นับซ้ำ 1 ครั้ง
Fix: ลบ increment จาก baseline transition PATCH

**S-C3: Adjusted humidity clamp ที่ 0 — ผิดทางวิทยาศาสตร์**
Line 507 — `Math.max(0, cookHum - baseline)` ทำให้ค่าลดลงหายไป
Fix: ลบ `Math.max(0, ...)`

**S-C4: completeness นับรวม baseline readings**
Lines 467-471, 511 — `data.length >= 24` รวม baseline logs → complete เร็วเกินจริง
Fix: filter เฉพาะ cooking-phase logs

#### HIGH

**S-H1: Batch status calls ไม่มี rate limit** — 10 parallel Tuya calls ทันที
**S-H2: Token retry ไม่ clear cache เมื่อ auth fail** — Tuya code 1010/1004
**S-H3: PM10 ไม่ถูกคำนวณใน closeSession** — avg_pm10 เป็น null ตลอด
**S-H4: stove_type อาจ stale หลังเปลี่ยน collection period**
**S-H5: Dedup threshold 4.5 นาทีอาจตัด reading ที่ valid** — cron jitter

#### MEDIUM

**S-M1:** Manual UTC+7 offset แทน Intl API
**S-M2:** _debug field expose device IDs ใน response
**S-M3:** Constants ซ้ำระหว่าง sync.js กับ sync-logic.js
**S-M4:** `new Date()` เรียกหลายครั้งใน closeSession
**S-M5:** upsertDailySummary ทำทุก sensor แม้ idle
**S-M6:** loadSensors ทำ 4 sequential queries (3 ทำ parallel ได้)
**S-M7:** ไม่มี timeout บน fetch calls
**S-M8:** manageSession รับ 10 parameters

#### LOW

**S-L1:** getActiveSession / getLastClosedSession เป็น fallback ที่แทบไม่ถูกเรียก
**S-L2:** getSessionCountToday ใช้แค่ใน createSession
**S-L3:** AQI breakpoints มี gap (15.05 ได้ null)
**S-L4:** sbHeaders สร้าง object ใหม่ทุกครั้ง
**S-L5:** Emoji ใน error message ที่เก็บ DB
**S-L6:** _attempts count misleading

---

### C. Volunteer System (volunteer.html + volunteer.js)

#### CRITICAL

**V-C1: RLS เปิดกว้าง — anon key ลบข้อมูลทั้ง DB ได้**
Migration 013 set all policies to `true` → anon key สามารถ DELETE/UPDATE ทุก table
Fix: สร้าง restrictive RLS policies — anon ได้แค่ INSERT pollution_logs

**V-C2: volunteer.js ไม่มี auth**
Line 17-22 — ไม่มี secret / token → ใครก็เรียก cooking-start ได้
Fix: เพิ่ม shared secret เหมือน CRON_SECRET

**V-C3: volunteer.js ใช้ service key bypass RLS**
Line 25 — ใช้ SUPABASE_SERVICE_KEY ไม่มี auth → full DB access
Fix: เพิ่ม auth ก่อน + validate session belongs to house

**V-C4: Race condition ใน session lock**
Lines 504-533 — TOCTOU: 2 browser check + insert พร้อมกัน
Fix: ใช้ INSERT ON CONFLICT + unique constraint

#### HIGH

**V-H2: ไม่มี offline retry queue** — manual readings หายเมื่อ hotspot หลุด
**V-H3: GPS accuracy ไม่ validate** — อาจจับคู่บ้านผิด
**V-H4: beforeunload lock removal ไม่ reliable บน mobile** — iOS Safari
**V-H5: session_id ไม่ validate กับ house_id** — transition session บ้านอื่นได้

#### MEDIUM

**V-M1:** Poll ทุก 15 วินาที เยอะเกินไปสำหรับ mobile data
**V-M2:** elapsedMin() ใช้ demo multiplier ไม่ consistent
**V-M3:** Toast messages override กัน
**V-M4:** loadPreviousTvoc ไม่ filter วันที่
**V-M5:** removeLock ไม่มี Content-Type header
**V-M6:** 130/10 minute constants hardcode ไม่ sync กับ sync.js
**V-M7:** volunteer.js query params ไม่ validate type

#### LOW

**V-L1:** Dead code: submitTvoc, updateTvocList, endVolunteerSession
**V-L2:** volunteer_name ไม่ถูก populate ใน lock
**V-L3:** stove_type hardcode 'eco' ไม่มี comment อธิบาย
**V-L4:** status: 'pending' อาจไม่ match schema
**V-L5:** Thai timezone calculation fragile
**V-L6:** pollTimer ไม่ handle error
**V-L7:** CDN Tailwind ไม่ optimize (+300KB)

---

### D. Admin APIs (9 files)

#### CRITICAL

**A-C1: PIN comparison ไม่ timing-safe**
ทุก endpoint ใช้ `!==` เทียบ hash → timing attack ได้
Fix: `crypto.timingSafeEqual()`

**A-C2: Recovery code เก็บ plaintext**
`admin_users.recovery_code` เก็บค่าจริง → DB leak = ได้ทุก code
Fix: hash ก่อนเก็บ เหมือน PIN

**A-C3: Recovery code ไม่ถูกยกเลิกหลังใช้**
forgot-pin.js lines 60-77 — ใช้แล้วยังใช้ได้อีก
Fix: set `recovery_code = null` หลังใช้

**A-C4: Client ส่ง hash เป็น credential**
ทุก endpoint เทียบ `callerPin !== pin_hash` → hash = password
Fix: ส่ง raw PIN + hash server-side หรือใช้ challenge-response

#### HIGH

**A-H1: CORS wildcard `*` ทุก endpoint**
Fix: restrict เป็น `biomassstove.vercel.app`

**A-H2: ไม่มี rate limiting**
PIN 4 หลัก = 10,000 combinations → brute-force ได้
Fix: track failed attempts + lockout

**A-H3: Email enumeration จาก error messages**
"ไม่พบ Email" vs "PIN ไม่ถูกต้อง" → บอกว่า email มีหรือไม่
Fix: ใช้ generic "Email หรือ PIN ไม่ถูกต้อง"

**A-H4: PATCH ไม่เช็คว่า update row จริง**
`return=minimal` → 204 แม้ไม่มี row ถูก update
Fix: ใช้ `return=representation` + เช็ค response

**A-H5: Super admin ถูก demote ได้ — อาจไม่เหลือ super**
role.js ไม่เช็ค last super admin
Fix: count supers ก่อน demote

#### MEDIUM

**A-M1:** adminId ไม่ validate UUID format — Supabase filter injection risk
**A-M2:** PIN length validation ไม่ consistent
**A-M3:** `ilike` ใน email lookup → `%` wildcard match ทุกคน
**A-M4:** Supabase error text leak to client
**A-M5:** ไม่มี email format validation
**A-M6:** Registration assigns 'admin' เสมอ — bootstrap first super ทำไม่ได้จาก UI
**A-M7:** Mixed hashing model (auth=hash, newPin=raw)
**A-M8:** Recovery code generation มี modular bias

#### LOW

**A-L1:** Auth logic ซ้ำ 7+ ไฟล์ → ควร extract shared module
**A-L2:** hashPin() ซ้ำ 5 ไฟล์
**A-L3:** Unused `crypto` import ใน role.js, delete.js
**A-L4:** Missing try/catch รอบ auth fetch
**A-L5:** register.js return 200 แทน 201
**A-L6:** ไม่มี activity log สำหรับ role/delete/PIN/failed login
**A-L7:** delete.js ใช้ POST แทน DELETE method

---

## Previously Fixed (Session ก่อน + Session นี้)

| Item | Status | Session |
|------|--------|---------|
| Error 500 generic (ไม่ expose err.message) | ✅ Fixed | 2026-03-23 (quick wins) |
| Duplicate thresholdLinesPlugin | ✅ Fixed | 2026-03-23 (quick wins) |
| shouldSkipSync double-offset | ✅ Fixed | 2026-03-23 (quick wins) |
| visibilitychange handler | ✅ Fixed | 2026-03-23 (quick wins) |
| Manual submit guard (double-click) | ✅ Fixed | 2026-03-23 (quick wins) |
| PIN storage (hash before sessionStorage) | ✅ Fixed | 2026-03-23 (quick wins) |
| closeSession co_value missing | ✅ Fixed | 2026-03-23 (code review) |
| Thai date boundary (midnight-7am) | ✅ Fixed | 2026-03-23 (code review) |
| XSS esc()/escAttr() helpers | ✅ Fixed | 2026-03-23 (code review) |
| Search input debounce | ✅ Fixed | 2026-03-23 (code review) |
| Query caching (closedMap/countMap) | ✅ Fixed | 2026-03-23 (code review) |
| Print fix (@media print) | ✅ Fixed | 2026-03-23 (code review) |

---

*Generated by WEnDyS — 4 parallel review agents, 2026-03-23*
