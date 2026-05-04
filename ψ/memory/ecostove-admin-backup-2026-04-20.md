# EcoStove Admin Backup — 2026-04-20

> สำรองจาก screenshot หน้าจัดการแอดมิน (biomassstove.vercel.app)
> ห้ามลบข้อมูลแอดมินเด็ดขาด — ถ้าต้อง wipe DB ให้ restore จากนี้

## Admin List

| # | ชื่อ | Email | Role | สมัครเมื่อ |
|---|------|-------|------|-----------|
| 1 | DewS | dews.cnx@gmail.com | Super Admin | 06/03/2026 |
| 2 | Tusemi Vosadrau Jnr | samrositalei@gmail.com | Admin | 20/04/2026 |
| 3 | มงคล ชาวตระการ | pkpiyd13@gmail.com | Super Admin | 20/04/2026 |
| 4 | สุรชัย ณรัฐ จันทร์ศรี | surachai_nar@g.cmru.ac.th | Super Admin | 20/04/2026 |
| 5 | กรวิชณ์ นิปุณะ | korawitnipuna2003@gmail.com | Admin | 20/04/2026 |

## Restore Plan

ถ้าต้อง wipe DB แล้ว restore แอดมิน:
- ใช้ SQL INSERT ตรงเข้า `admin_users` table ใน Supabase
- ต้องตั้ง PIN ใหม่ให้ (hash ด้วย SHA-256)
- เฉพาะ DewS + WEnDyS เท่านั้นที่ทำได้ (ต้องมี Supabase access)

## Note

- PIN hash + Recovery Code ไม่ได้สำรองไว้ที่นี่ (ไม่ปลอดภัย)
- ถ้า restore → ต้องตั้ง PIN ใหม่ + แจ้งแอดมินแต่ละคน
