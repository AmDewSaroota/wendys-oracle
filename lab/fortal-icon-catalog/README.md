# แคตตาล็อกช่องไอคอน Fortal — เวอร์ชันเว็บบน Vercel

หน้าเดียว เลื่อนดูได้ทั้งหมด · 141 ช่องไอคอนที่ต้องวาดใหม่ จับกลุ่มตามไอคอนที่ใช้ซ้ำ
ผูกกับตำแหน่งจริงในเว็บ (หน้าที่มันอยู่ + `aria-label` ของปุ่มนั้น)
ดีไซเนอร์ลากไฟล์มาวาง · คนรีวิวกดผ่าน/ต้องแก้ · ดึงกลับเป็น zip พร้อม `manifest.json`

ต่างจากเวอร์ชัน Artifact ตรงที่ **ล็อกอินด้วย Google จริง** และเปิดได้จากลิงก์ธรรมดา
ไม่ต้องอยู่องค์กรเดียวกันบน claude.ai

## โครงสร้าง

| ไฟล์ | ทำอะไร |
|---|---|
| `auth.ts` | ล็อกอิน Google + รายชื่อที่เข้าได้ (`ALLOWED_EMAILS` / `ALLOWED_DOMAINS`) + ใครรีวิวได้ (`REVIEWER_EMAILS`) |
| `middleware.ts` | ไม่ล็อกอิน = เด้งไป `/signin` (ยกเว้น `/signin`, `/api/auth/*`, `/app.css`) |
| `lib/db.ts` | Neon Postgres · สร้างตาราง `slots` / `events` ให้เองครั้งแรกที่เรียก |
| `app/api/state` | อ่านสถานะทุกช่อง + ความเคลื่อนไหว 60 รายการล่าสุด |
| `app/api/action` | `upload` · `review` · `note` · `delete` — ทุกครั้งเขียนลง `events` ว่าใครทำอะไรเมื่อไหร่ |
| `app/api/file/[id]` | ส่งไฟล์ไอคอนออกมา (ต้องล็อกอินก่อน) |
| `public/app.js` · `public/app.css` | หน้าเว็บทั้งหมด |
| `public/data.json` | ทะเบียน 141 ช่อง (สร้างจาก `scratchpad/mkcatalog.py` ในโปรเจกต์ Fortal QA) |

ไฟล์ไอคอนเก็บเป็น base64 ในคอลัมน์ `slots.data` — ไฟล์ละไม่เกิน 150 KB
ทั้งชุดเต็ม 141 ช่องจึงราว 20 MB ยังอยู่ในโควตาฟรีของ Neon (0.5 GB) สบาย ๆ

## ตั้งค่าครั้งแรก (ทำครั้งเดียว)

### 1 · ล็อกอิน Vercel บนเครื่องนี้

```bash
npx vercel login
```

### 2 · ผูกโปรเจกต์ + ดีพลอยรอบแรก

```bash
cd /c/Users/CPL/wendys-oracle/lab/fortal-icon-catalog && npx vercel link --yes && npx vercel deploy --prod --yes
```

รอบแรกจะยังเข้าไม่ได้ (ยังไม่มี Google + ฐานข้อมูล) — เอาไว้เพื่อ **รู้ชื่อโดเมน** ก่อน

### 3 · ฐานข้อมูล

Vercel → โปรเจกต์นี้ → **Storage** → **Neon (Postgres)** → Create → Connect to Project
Vercel จะใส่ `DATABASE_URL` ให้เอง ไม่ต้องพิมพ์เอง

### 4 · Google OAuth

Google Cloud Console → APIs & Services

1. **OAuth consent screen** → External → ใส่ชื่อแอปกับอีเมลติดต่อ → Save
2. **Credentials** → Create credentials → **OAuth client ID** → Web application
3. **Authorized redirect URIs** ใส่:
   `https://<โดเมนจากข้อ 2>/api/auth/callback/google`
4. ได้ **Client ID** กับ **Client secret** มา

### 5 · ตัวแปรสภาพแวดล้อม

Vercel → Settings → Environment Variables (ใส่ให้ครบทั้ง Production/Preview/Development)

| ชื่อ | ค่า |
|---|---|
| `AUTH_SECRET` | สุ่มมา 32 ตัวอักษรขึ้นไป |
| `AUTH_GOOGLE_ID` | Client ID จากข้อ 4 |
| `AUTH_GOOGLE_SECRET` | Client secret จากข้อ 4 |
| `ALLOWED_EMAILS` | อีเมลที่เข้าได้ คั่นด้วยจุลภาค |
| `REVIEWER_EMAILS` | อีเมลที่กดผ่าน/ตีกลับได้ (เว้นว่าง = ทุกคนที่เข้าได้) |

> ⚠️ **ถ้าเว้น `ALLOWED_EMAILS` และ `ALLOWED_DOMAINS` ว่างทั้งคู่ ใครมีบัญชี Google ก็เข้าได้**
> ต้องใส่รายชื่อก่อนเปิดใช้จริงเสมอ

### 6 · ดีพลอยอีกรอบให้ค่าใหม่มีผล

```bash
cd /c/Users/CPL/wendys-oracle/lab/fortal-icon-catalog && npx vercel deploy --prod --yes
```

## อัปเดตทะเบียนช่องไอคอน

ทะเบียนมาจากสไลด์บรีฟ (`icon-slides.tpl.html`) ในโปรเจกต์ Fortal QA
แก้ที่นั่นแล้วรัน `mkcatalog.py` ใหม่ จากนั้นก๊อป `catalog.json` มาแปลงเป็น `public/data.json`
รหัสช่อง (`slot id`) เป็นกุญแจของฐานข้อมูล — **เปลี่ยนรหัสช่อง = ไฟล์ที่ส่งไว้แล้วจะหลุดจากช่อง**

## บรีฟและคอมเมนต์ (เพิ่ม 8 ก.ย. 2026)

หน้าเว็บนี้รวมเนื้อหาจากสไลด์บรีฟมาไว้ด้วยแล้ว — ใช้หน้าเดียวจบทั้งอ่านบรีฟ ส่งงาน และคุยกัน

| ส่วน | ไฟล์ |
|---|---|
| เนื้อหาบรีฟ (โจทย์ · 4 ประเภท · พื้นที่จริง · ปมที่ต้องตัดสิน · กติกาการวาด) | `public/brief.json` |
| ภาพหน้าจอจริงจากเว็บ Fortal | `public/shots/*.jpg` |
| คอมเมนต์ | ตาราง `comments` · target เป็น `slot:<รหัสช่อง>` หรือ `brief:<รหัสหัวข้อ>` |

ตัวเลข 4 ประเภทในบรีฟ **นับสดจาก `data.json`** ไม่ใช่เลขค้างจากสไลด์ แก้ทะเบียนแล้วตัวเลขขยับตาม

สไลด์ชุดเดิมยังอยู่ในฐานะเอกสารอ่านอย่างเดียว และมีแถบบนหน้าปกชี้มาที่เว็บนี้

## สนามทดสอบ

`test-harness/index.html` จำลอง API ทั้งชุด ใช้ทดสอบพฤติกรรมหน้าเว็บโดยไม่ต้องล็อกอิน
วิธีใช้: ก๊อปไปไว้ที่ `public/harness.html` ชั่วคราว แล้วเสิร์ฟโฟลเดอร์ `public`
**อย่าลืมลบออกจาก `public/` ก่อนดีพลอย**

สคริปต์ตรวจอื่น: `check-data.mjs` (ความถูกต้องของทะเบียน) · `dbcheck.mjs` (ดูข้อมูลจริง) ·
`verify.mjs` (ตรวจฟิลด์ครบ) · `rt.mjs` (ทดสอบเขียน-อ่าน-ลบ แล้วล้างเอง)

## ชื่อสำหรับใช้ในโค้ด (เพิ่ม 9 ก.ย. 2026)

ทุกช่องมี 3 ชื่อ

| ฟิลด์ | ตัวอย่าง | ใช้ทำอะไร |
|---|---|---|
| `id` | `sparkles--credit-balance` | กุญแจของฐานข้อมูล **ห้ามเปลี่ยน** ไม่งั้นไฟล์ที่ส่งไว้จะหลุดจากช่อง |
| `comp` | `IconCreditBalance` | **ชื่อเดียวที่คนเห็น** — เป็นทั้งชื่อไฟล์ (`IconCreditBalance.svg`) และชื่อ component |
| `code` | `credit-balance` | ไม่โชว์ในหน้าเว็บแล้ว เก็บไว้ให้ค้นหาและจับคู่ชื่อไฟล์แบบเก่าได้ |

สร้างด้วย `python add-code-names.py` (อ่าน-เขียน `public/data.json` ตรง ๆ)
มีตาราง `OVERRIDE` ในสคริปต์สำหรับดวงที่กติกาอัตโนมัติตั้งชื่อได้ไม่ดี — ชื่อโมเดล ชื่อชนกัน ชื่อยาวเกิน

ตอนลากไฟล์เข้าเป็นชุด ระบบจับคู่ได้ทั้ง `code` · `comp` · และ `id`
ไฟล์ zip ที่ดาวน์โหลดใช้ `code` เป็นชื่อไฟล์ แนบ `manifest.json` และ `อ่านก่อน.txt` ไปด้วย
