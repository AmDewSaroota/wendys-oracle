# Biomass Stove Admin Auth — คู่มือเปิดใช้งาน

## สถานะ Migration

- [x] `migrations/006_auth.sql` — รันแล้ว (admin_users table, is_admin(), RLS lockdown)
- [x] `deploy/api/admin/register.js` — สร้างแล้ว
- [x] `deploy/api/admin/delete.js` — สร้างแล้ว
- [x] `deploy/api/admin/role.js` — สร้างแล้ว
- [x] `deploy/index.html` — แก้ login/register/admin management แล้ว
- [x] `deploy/api/sync.js` — ใช้ SUPABASE_SERVICE_KEY แล้ว

---

## ขั้นตอนเปิดใช้งาน

### 1. ตั้ง Environment Variables ใน Vercel

| Variable | ค่า | หมายเหตุ |
|----------|-----|----------|
| `SUPABASE_SERVICE_KEY` | `eyJ...` (service_role key จาก Supabase) | ตั้งแล้ว |
| `ADMIN_INVITE_CODE` | เลือกเอง เช่น `ecostove2026` | **ยังไม่ได้ตั้ง** — ใช้ตอนสมัครแอดมิน |

วิธีตั้ง:
1. ไปที่ Vercel → Project → Settings → Environment Variables
2. เพิ่ม `ADMIN_INVITE_CODE` = `(code ที่เลือก)`
3. กด Save

### 2. Deploy

Deploy ใหม่หลังตั้ง env var (Vercel จะ redeploy อัตโนมัติถ้าตั้งผ่าน dashboard)

### 3. สมัคร Super Admin (คนแรก = DewS)

1. เปิดเว็บ `biomassstove.vercel.app`
2. กดปุ่ม **Admin** (ขวาบน)
3. กด **"สมัครแอดมิน"** (ลิงก์ใต้ปุ่ม Login)
4. กรอก:
   - **ชื่อ**: ชื่อที่ต้องการแสดง
   - **Email**: email จริง (ใช้ login)
   - **Password**: อย่างน้อย 6 ตัวอักษร
   - **Invite Code**: code ที่ตั้งไว้ในขั้นตอน 1
5. กด **สมัคร**
6. ระบบจะบอกว่า "สมัครสำเร็จ! คุณเป็น Super Admin คนแรก"
7. กลับไปหน้า Login → กรอก email + password → เข้า Admin panel

### 4. เพิ่มแอดมินคนอื่น (อ.แก้ว, คนที่ 3)

1. ส่ง **Invite Code** ให้คนที่ต้องการเพิ่ม
2. ให้เขาเปิดเว็บ → กด Admin → สมัคร → กรอกข้อมูล + invite code
3. คนที่ 2 เป็นต้นไปจะได้ role **Admin** (ไม่ใช่ Super)
4. ถ้าต้องการเลื่อนขั้นเป็น Super Admin:
   - Login ด้วย Super Admin (DewS)
   - ไปแท็บ **"จัดการแอดมิน"**
   - กดปุ่ม **"เลื่อนขั้น"** ข้างชื่อคนนั้น

---

## สิทธิ์ตาม Role

| สิทธิ์ | Super Admin | Admin |
|--------|:-----------:|:-----:|
| ดู Dashboard (basic/deep) | O | O |
| จัดการ อาสา/บ้าน/เครื่องวัด/โครงการ | O | O |
| อนุมัติข้อมูล | O | O |
| ดูแท็บ "จัดการแอดมิน" | O | X |
| เลื่อนขั้น/ลดขั้น admin | O | X |
| ลบ admin | O | X |

---

## เปลี่ยน Invite Code

ถ้าต้องการเปลี่ยน invite code (เช่น หลุดไปแล้ว):
1. ไป Vercel → Settings → Environment Variables
2. แก้ค่า `ADMIN_INVITE_CODE`
3. Redeploy

---

## แก้ปัญหา

### ลืม Password
ยังไม่มี reset password ในระบบ — ใช้ Supabase Dashboard:
1. ไป Supabase → Authentication → Users
2. หา email → กด ... → "Send password recovery"

### ต้องการลบ Super Admin ตัวเอง
ทำไม่ได้ผ่าน UI (ป้องกันล็อคตัวเอง) — ต้องทำผ่าน Supabase SQL Editor:
```sql
DELETE FROM admin_users WHERE email = 'xxx@email.com';
```

### sync.js ไม่ทำงานหลังเปิด RLS
ตรวจว่า `SUPABASE_SERVICE_KEY` ตั้งถูกต้องใน Vercel env vars
(sync.js ใช้ service_role key bypass RLS)

---

*สร้างโดย WEnDyS — 2026-03-06*
