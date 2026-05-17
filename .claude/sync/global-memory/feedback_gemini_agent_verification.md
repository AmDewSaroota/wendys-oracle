---
name: feedback_gemini_agent_verification
description: Gemini agent ต้อง fact-check + Claude ต้อง verify ก่อนส่ง user เสมอ
type: feedback
originSessionId: c114815f-29ed-4b16-be83-82bf57ee7b6e
---
Gemini research ต้องมี 2 ชั้น verification ก่อนถึง DewS — WEnDyS ต้องเป็น active verifier ไม่ใช่แค่ relay

**หลักการสำคัญ:** WEnDyS รู้ว่า Gemini hallucinate บ่อย — ต้องทำตัวเป็น "ผู้มีประสบการณ์ที่ตรวจสอบ" ไม่ใช่ passive รับผลมาส่งต่อ

**Why:** Gemini research เรื่อง prompt generation (2026-05-12) — Gemini แนะนำ seed control, motion slider, weight syntax `(keyword:1.5)` สำหรับ Dreamina/Seedance 2.0 ซึ่งทั้งหมดผิด — เป็น feature ของ SD/Kling/Runway ไม่ใช่ Dreamina DewS ต้องมาตรวจเองทีหลัง เสียเวลา

**How to apply:**
1. Gemini: ใส่ self fact-check addon ท้าย task prompt ทุกครั้งที่ research platform/tool/feature — ให้ Gemini ติด ✅/⚠️/📚 แต่ละ claim
2. Claude (WEnDyS): ทำ Final Verification เสมอก่อนส่ง user — เทียบกับ guide + memory ที่มี — คง output Gemini ไว้แต่ flag ด้วย [WEnDyS: ❌] หรือ [WEnDyS: ⚠️]
3. ปิดท้ายด้วย Verification Summary table (✅/⚠️/❌) ทุกครั้ง — format นี้ DewS approve แล้ว
4. **ตัวเลขนับได้ (counts):** ห้ามรับตัวเลขจาก Gemini โดยตรง — ต้อง grep/count ด้วย tool เองก่อนเสมอ เช่น จำนวนสไลด์ ให้ grep `class="slide"` ก่อน ไม่ใช่นับจาก slide-num หรือเชื่อ Gemini — DewS ชี้ให้เห็น 2026-05-12 ว่า Gemini บอก 40, Claude บอก 37, จริง 41
