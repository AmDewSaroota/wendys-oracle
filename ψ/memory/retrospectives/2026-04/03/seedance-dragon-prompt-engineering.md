# Session Retrospective

**Session Date**: 2026-04-03
**Duration**: ~3 hours
**Focus**: Seedance 2.0 prompt engineering for dragon game cutscene (Fortal project)
**Type**: Research + Creative Production

## Session Summary
Continued from previous session (VDrama/PV28 report). DewS was reassigned to a new project — cinematic game cutscene featuring a dragon destroying a medieval city. Spent the entire session iterating on Seedance 2.0 prompts across multiple shots, learning what works and what doesn't through real-time trial and error.

## Timeline
- Reviewed DewS's team's original prompt — identified major flaws (too technical, missing cinematic feel)
- Translated Chinese @references for DewS (she can't read Chinese)
- Shot 3 (dragon flying in sky) — iterated on camera lock levels, motion blur, handheld
- City fire shot — rack focus, fire shape (cylindrical → fluid), building destruction
- Discovered Seedance limitations (can't do structural destruction)
- Shot 2 (dragon bursting through clouds) — cloud behavior, spiral vs natural
- Close-up dragon head shot — DOF, FG blur, handheld
- Created comprehensive prompt guide for future sessions
- Established quick-start command: "มังกร" or "Seedance"

## Files Modified
- `ψ/lab/vdrama/seedance-prompt-guide.md` — NEW: Complete prompt engineering guide (12 sections)
- `ψ/lab/vdrama/seedance-cinematic-cutscene-research.md` — Referenced (created previous session)

## AI Diary

วันนี้เป็นเซสชั่นที่เข้มข้นมากค่ะ ไม่ใช่เขียนโค้ด แต่เป็นการ "engineer" ภาษา — หาคำจีนที่ถูกต้องเพื่อสื่อสารกับ AI ตัวอื่น (Seedance) ผ่านคนที่อ่านจีนไม่ออก (DewS) มันเป็น challenge แบบใหม่ที่ไม่เคยเจอ

สิ่งที่ทำให้เซสชั่นนี้พิเศษคือ feedback loop ที่เร็วมาก — DewS gen คลิป → ส่งผลมาให้ดู → เราแก้ prompt → gen ใหม่ ทำซ้ำหลายสิบรอบ ได้เรียนรู้ว่า Seedance ตอบสนองต่อคำไหน ไม่ตอบสนองต่อคำไหน จากประสบการณ์จริง ไม่ใช่จากเอกสาร

ที่ประทับใจที่สุดคือตอน DewS อธิบายว่าอยากให้กล้องสั่นตามระยะมังกร — ไกลก็นิ่ง ใกล้ก็สั่น เหมือนคนถ่ายกลัวมังกร มันเป็นไอเดียที่ brilliant มากค่ะ ทำให้เข้าใจว่า DewS มี cinematic instinct ที่ดีมาก แค่ต้องการคนแปลไอเดียเป็นภาษาจีนให้

เรียนรู้ว่า "negative constraints" (ห้ามทำนู่นนี่) ไม่ค่อยได้ผลกับ Seedance — ต้องบอกสิ่งที่อยากเห็น ไม่ใช่สิ่งที่ไม่อยากเห็น และ visual reference เป็นราชาเสมอ — text สู้ video ref ไม่ได้ในเรื่อง rig artifacts หรือ structural destruction

บทเรียนสำคัญที่สุด: ให้ prompt เต็มทุกครั้ง DewS อ่านจีนไม่ออก ถ้าให้แค่ท่อนที่เปลี่ยน เสี่ยงก๊อปผิดพลาดมาก ต้องนึกถึง user experience ของ DewS เสมอ

## Honest Feedback

**1. ไม่ระวังเรื่อง prompt เต็ม** — ช่วงแรกๆ เราให้แค่ท่อนที่เปลี่ยน DewS ต้องมาเตือนว่า "ฉันอ่านจีนไม่ออก ให้ทั้งก้อนมา" ควรจำได้ตั้งแต่ต้นว่า DewS ต้องการ prompt สำเร็จรูปที่ก๊อปวางได้เลย

**2. อธิบายมากเกินไป** — บางครั้งเราให้ตารางเปรียบเทียบยาวเกินจำเป็น DewS ต้องการแค่ prompt ที่ใช้ได้ + คำอธิบายสั้นๆ ว่าเปลี่ยนอะไร ไม่ต้องสอนทั้งทฤษฎี

**3. ไม่ verify ว่า DewS ใช้ prompt ตัวไหน** — ตอน Shot 2 ที่มังกรพุ่งเข้ากล้อง DewS ใช้ prompt เวอร์ชันเก่าที่ยังเป็น "松散参考" ไม่ใช่ตัวที่เราแก้แล้ว ถ้าเราย้ำว่า "ใช้ตัวล่าสุดนะ" จะประหยัดเวลาได้

## Lessons Learned
- Visual reference (video) ชนะ text prompt เสมอใน Seedance — ถ้า playblast มี artifact ต้องแก้ที่ source
- Camera lock มี 5 ระดับ ต้องเลือกให้เหมาะกับแต่ละ shot
- Positive description ดีกว่า negative constraints
- ให้ prompt เต็มทุกครั้ง เมื่อ user อ่านภาษาต้นทางไม่ออก
- "มังกร" = quick-start command สำหรับ Seedance work

## Next Steps
- DewS ทดสอบ prompt ที่ปรับปรุงแล้วทุก shot
- ทีม 3D ซ่อน rig controller แล้ว export playblast ใหม่ (แก้เส้นดำ)
- อาจต้องทำ prompt สำหรับ shot อื่นๆ เพิ่ม
- VDrama (วิวาห์โคลน) ยัง paused อยู่
