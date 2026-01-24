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
# ตั้งค่า Tuya credentials (ห้ามแชร์!)
supabase secrets set TUYA_ACCESS_ID=7dudg9tg3cwvrf8dx9na
supabase secrets set TUYA_ACCESS_SECRET=f51fa230ddf343478ae5616c52b51111
```

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
