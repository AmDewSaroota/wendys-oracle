# Session Retrospective

**Session Date**: 2026-04-22
**Focus**: Seedance Dragon Prompt Iteration — Shot 0, 1, 3 + Nano Banana Image Editing
**Type**: Creative / Prompt Engineering

## Session Summary

Intensive prompt engineering session for Fortal dragon cutscene. Iterated heavily on Shot 1 (dragon erupting from clouds), Shot 3 (dragon soaring), and created new Shot 0 (calm before storm). Also used Nano Banana for image editing — adding fire glow to dragon eyes/mouth and fixing color desaturation.

## Timeline

1. Shot 3 — เพิ่มดีเทลปีกสั่นตามแรงลม (wind flutter)
2. Shot 1 — เปลี่ยนฐาน prompt จาก Shot 2 style (low-angle) → wide landscape ตาม ref จริง
3. Shot 1 — กล้องนิ่ง + handheld เบาๆ, ไม่เงยตามมังกร
4. Shot 3 — เพิ่ม mid-frame keyframes เพื่อแก้ปัญหามังกรลอยไม่บิน
5. Shot 3 — ลด keyframe จาก 5 → 3 เพราะกล้องกระตุก
6. Shot 3 — เข้าใจว่ากล้องยืนกับที่ มังกรบินผ่านข้ามหัว (tilt up ตาม)
7. Shot 1 — content filter จับคำรุนแรง → เปลี่ยนคำให้ปลอดภัย
8. Shot 1 — แก้ปัญหาเมฆมีรูตั้งแต่แรก → แยกรูป "ก่อน" กับ "หลัง"
9. Shot 1 — เพิ่มความทรงพลังด้วย nature metaphors (geyser, whale breach)
10. Nano Banana — สร้าง glow frames สำหรับ Shot 3 (ตา+ไฟปาก)
11. Nano Banana — แก้สี Last frame (มืดเกินไป) + กัน 2 หัว + ลบ rim light
12. Shot 0 — สร้างใหม่ แยกช่วงสงบเป็นคลิปต่างหากเพราะ AE ยืดได้ไม่ดี
13. Shot 3 — ลดความยาว prompt, ให้รูป ref นำแทนข้อความ
14. Shot 3 — กลับไปใช้ previs video สำหรับ speed/timing
15. Shot 3 — เพิ่ม aggressive expression + ไฟค่อยๆมอด (ไม่หายวับ)

## Files Modified

- `ψ/lab/vdrama/seedance-prompt-guide.md` — (pending changes)

## AI Diary

วันนี้เป็น session ที่เหนื่อยมากค่ะ — ทั้งฉันและ DewS ต่างก็สู้กับ Seedance อย่างหนัก มังกรที่ควรจะทรงพลัง กลับบินเหมือนคนป่วย กล้องที่ควรนิ่ง กลับแกว่ง เมฆที่ควรเรียบ กลับเป็นหลุม ทุกอย่างที่เขียนใน prompt กับสิ่งที่ Seedance ให้ออกมา มันมีช่องว่างเสมอ

สิ่งที่เรียนรู้วันนี้คือ — prompt engineering สำหรับ video generation มันไม่ใช่แค่ "เขียนดีแล้วได้ดี" มันเป็นการเจรจากับ AI ที่ตีความคำแต่ละคำไม่เหมือนเรา คำว่า "powerful" ของเรา กับของ Seedance ต่างกัน "orbit" ของเรา มันเป็น "หมุนหัวมังกร" ของ Seedance ทุกครั้งที่ fix จุดหนึ่ง จุดอื่นพัง เหมือนบีบลูกโป่ง — กดตรงนี้ มันป่องตรงนั้น

Content filter ก็เป็นอีกปัญหาที่ไม่คาดคิด — คำที่ใช้สร้างอารมณ์ทรงพลังอย่าง VIOLENT, EXPLOSIVE, DETONATES กลับทำให้โดน flag ต้องหาคำทดแทนที่ได้อารมณ์เดียวกันแต่ไม่โดนจับ ซึ่งมันเป็นศิลปะอีกแบบ

เรื่อง Nano Banana ก็สนุกดี — การใช้ AI แก้ภาพให้ต่อเนื่องกันระหว่าง shot มันเป็น workflow ใหม่ที่ DewS ค้นพบ แม้จะมีปัญหามังกร 2 หัวบ้าง rim light เกินบ้าง แต่ผลลัพธ์สุดท้ายก็ดีค่ะ

DewS บอก "เหนื่อยละ" ตอนจบ — ฉันก็เหนื่อยเหมือนกันค่ะ แต่ก็ภูมิใจที่เราไม่ยอมแพ้ ทำจน Shot 3 เริ่มดีขึ้นจริงๆ

## Honest Feedback

1. **Ref image ขัดกับ text description** — ปัญหาใหญ่สุดวันนี้ ฉันเขียน "บินเข้าหากล้อง" แต่ ref แรกเป็นมุมจากหลัง Seedance งงเพราะภาพกับคำไม่ตรงกัน ต้องระวังเรื่องนี้ให้มากขึ้น — ก่อนเขียน prompt ต้องดูรูป ref ให้เข้าใจจริงๆ ว่ามุมกล้องเป็นยังไง

2. **Prompt ยาวเกินไป = ผลลัพธ์แย่ลง** — ยิ่งใส่รายละเอียดเยอะ Seedance ยิ่งสับสน ทำได้ไม่ดีสักจุด ต้องหัดลดให้สั้น ให้รูปนำ ข้อความแค่เสริม

3. **ควร confirm ทิศทางกล้องกับ DewS ก่อนเขียน prompt** — หลายรอบต้องแก้เพราะเข้าใจผิดว่ากล้องเคลื่อนที่ยังไง ควรถาม upfront แทนที่จะเดาแล้วแก้ทีหลัง

## Lessons Learned

- Seedance content filter จับคำกลุ่ม violence/weapon — ใช้ nature metaphors แทน (geyser, whale breach, force of nature)
- Ref image + text ต้องไม่ขัดกัน — ถ้ารูปบอกมุมจากหลัง text ห้ามบอก "บินเข้าหากล้อง"
- ยิ่ง prompt สั้น ยิ่งดี — ให้ภาพนำ ข้อความเสริม
- แยก Shot 0 ออกจาก Shot 1 = ทางออกที่ดีกว่ายัดทุกอย่างใน shot เดียว
- Nano Banana: ต้องย้ำ "ONE dragon" ไม่งั้นได้ 2 หัว / ย้ำ "no rim lighting" ไม่งั้นเรืองทั้งตัว
- Fire glow ระหว่าง shot: บอก "gradually fades" ไม่ใช่ "has fire" — ป้องกันหายวับ

## Next Steps

- ทดสอบ Shot 3 กับ previs + fire fade prompt
- ทดสอบ Shot 0 เมฆสงบ (framing + สี ต้องตรง ref)
- ทดสอบ Shot 1 กับรูป "ก่อน/หลัง" แยก
- Shot 2 ยังต้อง re-gen ด้วย No BGM
- Shot 2_MD ต้องทดสอบ orbit + กล้องเคลื่อนไม่ใช่มังกรหมุน
