# `vercel env pull` คืนค่าว่าง ไม่ได้แปลว่า env ไม่ได้ตั้ง

**วันที่**: 2026-09-09
**บริบท**: วินิจฉัยว่าทำไม API ของ CO Footprint ตอบ 500 ทุก endpoint

## อาการ

```
GET https://co-footprint-hu9q.vercel.app/api/profiles → 500
{"error":"[db-supabase] getProfiles: TypeError: fetch failed"}
```

`vercel env pull` และ `.env.production` ในโปรเจกต์ต่างแสดง `SUPABASE_URL=""` (ว่างเปล่า)

**สรุปแรก (ผิด):** env ไม่ได้ตั้ง → ไปตั้งค่าบน Vercel แล้ว redeploy

## ทำไมถึงผิด

ตัวแปรที่ตั้งเป็น **Sensitive** บน Vercel **อ่านค่ากลับไม่ได้ตามการออกแบบ** — `vercel env pull`
จะคืนค่าว่างเสมอ ทั้งที่ตอน runtime มีค่าจริง

หลักฐานที่ชี้ขาดอยู่ในโค้ดเอง (`server/db.cjs` บรรทัด 2):

```js
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  module.exports = require('./db-supabase.cjs');
}
```

error message ขึ้นว่า `[db-supabase] getProfiles` → แปลว่าโค้ด**เข้า branch นี้ได้**
→ ตัวแปรทั้งสองต้องมีค่าจริง ไม่งั้นจะ fallback ไป SQLite แทน

**สาเหตุจริง:** `fetch failed` = ต่อ Supabase ไม่ได้ระดับ network
→ `npx supabase projects list` → project `COfootprint` สถานะ **INACTIVE** = ถูก auto-pause
(Supabase free tier หลับเองหลังไม่มีกิจกรรม ~7 วัน · โปรเจกต์นี้เงียบมา 2 เดือน)

**วิธีแก้จริง:** กด Restore ใน Supabase Dashboard — ไม่ต้องแตะ env เลย

## บทเรียน

**1. อ่าน error message ให้ตรงตัว**
`TypeError: fetch failed` = เชื่อมต่อไม่ได้ ไม่ใช่ config หาย
ถ้า config หายจริง โค้ดนี้จะ throw คนละข้อความ

**2. ให้พฤติกรรมของโค้ดที่รันจริงเป็นตัวตัดสิน ไม่ใช่ไฟล์ config ที่อ่านได้**
"โค้ดเข้า branch ไหน" เป็นหลักฐานที่แข็งกว่า "ไฟล์ที่ pull มาแสดงอะไร"

**3. รวบรวมหลักฐานให้ครบก่อนประกาศข้อสรุป**
session นี้เวนดี้พลิกข้อสรุป 3 รอบในเทิร์นเดียวต่อหน้าผู้ใช้ ถ้าอ่าน `db.cjs` ก่อนอีก 30 วินาที
ก็จะพูดครั้งเดียวจบ **การแก้ไขตัวเองไม่ผิด แต่การประกาศก่อนหลักฐานครบทำให้ผู้ใช้สับสน**

## เช็คลิสต์เวลาเจอ API 500 บน Vercel + Supabase

```bash
# 1) ฐานข้อมูลหลับอยู่ไหม (สาเหตุที่พบบ่อยที่สุดของโปรเจกต์ที่เงียบไปนาน)
npx supabase projects list     # ดู status: ACTIVE_HEALTHY vs INACTIVE

# 2) โค้ดเลือก db engine ไหน — อ่าน logic จริง อย่าเดาจากไฟล์ env
grep -n "process.env" server/db.cjs

# 3) ถ้า env ดูว่าง ให้เช็คว่าถูกตั้งเป็น Sensitive หรือเปล่า
vercel env ls                  # ดูว่ามีชื่อตัวแปรอยู่ไหม (ค่าจะขึ้น Encrypted)
```

## เกี่ยวข้อง

- `2026-09-09_scope-given-is-not-scope-real.md` — บทเรียนคู่กันเรื่องสรุปเร็วเกินไป
