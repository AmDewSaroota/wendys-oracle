# Deploy Edge Function - วิธีติดตั้ง

## สิ่งที่ต้องทำ

1. ติดตั้ง Supabase CLI
2. Deploy Edge Function
3. ตั้งค่า Environment Variables
4. เพิ่มปุ่มในเว็บ

---

## Step 1: ติดตั้ง Supabase CLI

```bash
# ใช้ npm
npm install -g supabase

# หรือใช้ bun
bun install -g supabase
```

---

## Step 2: Login และ Link Project

```bash
# Login
supabase login

# Link กับ project (ใช้ project ref จาก dashboard)
cd lab/tuya-ecostove
supabase link --project-ref zijybzjstjlqvhmckgor
```

---

## Step 3: ตั้งค่า Secrets (Tuya API Keys)

```bash
# ตั้งค่า Tuya credentials — อ่านค่าจริงจาก .env (ห้าม hardcode ในไฟล์นี้!)
supabase secrets set TUYA_ACCESS_ID=<ใส่ค่าจาก .env>
supabase secrets set TUYA_ACCESS_SECRET=<ใส่ค่าจาก .env>
```

> ⚠️ **ห้ามเขียนค่าจริงลงไฟล์นี้** — repo `wendys-oracle` เป็น **public**
> ค่าจริงอยู่ที่ `.env` และ `config.json` (ทั้งคู่อยู่ใน `.gitignore` แล้ว)
>
> ค่าที่เคยถูก hardcode ไว้ตรงนี้ (โปรเจกต์ Tuya เก่าส่วนตัว `7dudg…`) ถือว่า **หลุดสู่สาธารณะแล้ว**
> ต้อง revoke/rotate — ดู `E:\01_Work\_NDF\Test_WebAPP\_HANDOFF\04_ACTION_ITEMS.md`

---

## Step 4: Deploy Function

```bash
supabase functions deploy fetch-sensor
```

---

## Step 5: เพิ่มปุ่มในเว็บ

Copy โค้ดจาก `web-snippet.html` ไปวางในเว็บ biomassstove

---

## ทดสอบ

```bash
# ทดสอบ function
curl -X POST https://zijybzjstjlqvhmckgor.supabase.co/functions/v1/fetch-sensor \
  -H "Content-Type: application/json" \
  -d '{"device_id": "a3b9c2e4bdfe69ad7ekytn"}'
```

---

## Files

| ไฟล์ | คำอธิบาย |
|------|----------|
| `supabase/functions/fetch-sensor/index.ts` | Edge Function |
| `web-snippet.html` | โค้ด HTML สำหรับเว็บ |
| `DEPLOY.md` | คู่มือนี้ |
