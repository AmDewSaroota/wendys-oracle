# Pre-baked Mouth Clips สำหรับ AI Mascot Lip Sync

**Date**: 2026-05-21
**Project**: MRT Bangkok AI Mascot

## Pattern

เมื่อต้องทำ lip-sync บน video mascot ที่มี body animation → ต้องใช้ pre-baked mouth clips ไม่ใช่ canvas overlay

## Canvas Overlay ล้มเหลวเพราะ

ถ้า character ขยับตัว (body animation), ปากที่วาดทับบน canvas จะลอยอยู่กับที่ ไม่ได้อยู่บนหน้า — UX แย่มาก

## วิธีที่ถูกต้อง: Pre-baked Clips

1. **Body clips (8 states)**: Idle (LOOP), Talking (LOOP), Thinking (LOOP), Greeting, Pointing, Happy, Sorry, Goodbye
2. **Mouth clips (4 states)**: mouth-open (A,O), mouth-mid (E,I), mouth-small (U), mouth-closed (M,P,B,silent)
3. **Viseme source**: Azure TTS Thai (th-TH-PremwadeeNeural) → 22 viseme IDs → map ลง 4 mouth states
4. Bake ปาก+หน้า+ตัว รวมกันใน clip เดียว → ทุกอย่างขยับพร้อมกัน

## Double Video Buffer

สลับ opacity ระหว่าง 2 `<video>` elements → ~0ms transition latency  
ห้ามทำ src swap → black flash 100-500ms

## Azure TTS Free Tier

500K chars/month ≈ 3,000-5,000 ประโยค — เพียงพอสำหรับ exhibition

## Feasibility

8/10 (Gemini research) — risky part คือ Thai viseme quality ต้องทำ POC ก่อน
