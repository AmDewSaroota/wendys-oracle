# EXAT Talking Avatar — Viseme Lip-Sync

อวาตาร์พูดได้แบบ real-time สำหรับ EXAT virtual ambassador — เทคนิค **viseme sprite-swap** (สลับรูปปากตามเสียง) + layer ตา (กะพริบ) + sway + สมอง/เสียงจาก Gemini

## ไฟล์
- `index.html` — แอปหลัก (เปิดในเบราว์เซอร์ได้เลย)
- `assets.js` — รูปอวาตาร์ 14 ท่า (ปาก 12 + ตา 2) ฝัง base64 (ย่อ 640px JPEG) โหลดอัตโนมัติ
- `mouths/` — รูปต้นฉบับ + README สเปกชื่อไฟล์

## สถาปัตยกรรม
```
พิมพ์/พูด → Gemini (gemini-3.6-flash) → คำตอบ → Gemini TTS → เสียงไทย
                                                    ↓
                        text→viseme → สลับรูปปาก (crossfade+feather) ตามจังหวะเสียง
                        + ตากะพริบอัตโนมัติ + ขยับหัวเบาๆ
```

## Viseme set (12 ปาก)
rest · PP(ม บ ป) · AA(อา) · E(เอ) · EE(อี) · O(โอ) · UU(อู ว) · FF(ฟ) · TH(ธ) · L(ล) · CH(ช) · DD(ด ต ก น ส)
ตา: `eyes_closed` · `eyes_half`

## การใช้งาน
1. เปิด `index.html` (Edge/Chrome) — รูปโหลดเอง
2. กำหนดโซนปาก/ตา (ลากกรอบ → บันทึก) ครั้งเดียว
3. พิมพ์ไทย → ▶ อ่านออกเสียง / ✨ ถาม Gemini (ใส่ API key ก่อน) / 🎤 พูด
4. ปรับ เฟดปาก / จังหวะปาก / ขอบฟุ้ง ให้เนียนตามใจ

## สถานะ (2026-08-20)
- ✅ lip sync + ตากะพริบ + sway + crossfade/feather
- ✅ Gemini text (gemini-3.6-flash) + Gemini TTS (gemini-2.5-flash-preview-tts)
- ⏸ เสียง: Gemini TTS มีดีเลย์ + quota ฟรีจำกัด → กำลังติดตั้ง voice ไทยใน Windows เป็นทางเลือกเสียงในเครื่อง
- 🔜 phoneme ไทยจริง (ตอนนี้ map จากตัวอักษร) เพื่อปากตรงเสียงแม่นขึ้น
