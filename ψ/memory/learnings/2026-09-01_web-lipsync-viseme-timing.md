# Lesson: Web Avatar Lip-sync = Viseme TIMING, not audio amplitude

**Date**: 2026-09-01
**Context**: CC Avatar web demo (three.js) — DewS ปฏิเสธ lip-sync ที่ "พะงาบตามความดัง"

## Pattern
มืออาชีพขับปาก 3D avatar ด้วย **viseme timing** (รู้ว่าออกเสียงพยางค์อะไร ตอนไหน) ไม่ใช่วิเคราะห์คลื่นเสียง real-time:
- **Azure Neural TTS** ยิง `VisemeReceived` event = viseme ID (0-21) + audio offset (timestamp) → map เข้า morph ตามเวลา · **th-TH รองรับ** (ยืนยัน 26 events/ประโยค) · ให้ ARKit blendshapes 55 ค่า @60fps ได้ด้วย · free tier F0 500k ตัว/เดือน
- Amazon Polly speech marks (viseme) ก็คล้ายกัน
- text→phoneme→viseme (TalkingHead.js) — แต่ไม่มีโมดูลไทย

วิเคราะห์ amplitude/formant real-time (uLipSync/wawa-lipsync/ที่เวนดี้ทำเอง) = เพดานต่ำ ดูพะงาบ เพราะเดารูปปากจากเสียง ไม่รู้พยางค์จริง.

## Key implementation
- server ออก short-lived token (key ไม่โผล่ browser) · browser SDK `SpeechConfig.fromAuthorizationToken`
- crossfade ระหว่าง viseme ติดกัน + smoothstep = ไม่ robotic
- **articulate ลิ้น+ฟันต่อพยางค์** (L=แตะเพดาน, TH=Tongue_Out แลบ, K/G=โคนยก, R=ม้วน) ไม่ใช่ปากอย่างเดียว = "ตรง" ขึ้นมาก
- lead ~90ms ให้ viseme นำเสียง (คนขยับปากก่อนเสียงออก + ชดเชย smoothing lag)

## Meta-lesson (สำคัญกว่า)
**เจอ solved problem ที่มีเครื่องมือมาตรฐาน → รีเสิร์ชก่อน hack.** เวนดี้เผาเวลาจูน param เองก่อนถามว่า "เขาทำกันยังไง" — DewS ต้องสั่งให้รีเสิร์ช. "ลองก่อน วิเคราะห์ทีหลัง" เหมาะ exploration ไม่ใช่ปัญหาที่โลกแก้ไปแล้ว.

Tags: lip-sync, azure-viseme, web-avatar, three.js, research-before-hack
