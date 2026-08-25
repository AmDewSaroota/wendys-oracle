# Lesson: ปัญหา engine-level แก้ด้วย post-process ไม่ได้ + เพดาน neural lip-sync local

**วันที่**: 2026-08-25
**บริบท**: EXAT talking avatar — หาทาง ultrareal lip-sync บน RTX 5060

## บทเรียน

### 1. Engine-level defect ≠ post-process fixable
ปาก neural lip-sync (MuseTalk) **เบลอ + สั่น (temporal jitter)** เป็นข้อจำกัดของตัว engine เอง.
- **GFPGAN/CodeFormer (face restoration per-frame) แก้ไม่ได้** — มันทำงานทีละเฟรมอิสระ → ไม่แตะ temporal jitter เลย + hallucinate หน้าเนียน = "ตุ๊กตา" ลดดีเทลมนุษย์
- คิดก่อนลอง: ถ้า defect เป็น temporal/structural → post-process ที่ไม่มี temporal awareness แก้ไม่ได้โดยนิยาม

### 2. Neural lip-sync local (2026) ชนเพดานบน GPU กลาง
- **MuseTalk**: real-time (~13fps compiled) แต่ปากเบลอ+สั่น (decode จาก latent 256px)
- **LatentSync**: 512px คมกว่า แต่ **artifact ริมฝีปาก + ยังสั่น + ช้า 37 นาที/6วิ** บน RTX 5060 (diffusion 20 steps × 10 chunks)
- ทั้งคู่ไม่ถึง "ultrareal เนียนไม่สั่น" → เพดานของ open-source local ปี 2026 บนการ์ดระดับ 5060

### 3. ทางที่เหนือกว่าสำหรับ controllable ultrareal = 3D
- **CC5 (Character Creator 5) + NVIDIA Audio2Face-3D (UE5 plugin ฟรี)**: blendshape คุม 100% → **ไม่มี artifact/jitter**, real-time จริง, ตรง TOR ราชการ (Real 3D), เล่นจุดแข็ง 3D artist
- neural = ทางลัด photoreal แต่ควบคุมไม่ได้ (black-box) · 3D = ลงแรงปั้นแต่คุมทุกอย่าง

### 4. Process
- **verify compute cost ก่อน setup หนัก**: diffusion 512px บน 5060 = ช้าเกิน interactive คาดได้ก่อนโหลด weights 5GB
- **รู้จักหยุดเมื่อชนเพดาน** — ไม่ลอง local engine ตัวที่ 3-4 วนไม่จบ ให้สรุปตรงๆ แล้วเปิดทางเลือกใหม่ (3D/commercial)

## Tags
lip-sync, neural-vs-3d, musetalk, latentsync, gfpgan, codeformer, cc5, audio2face, engine-ceiling, post-process-limits, rtx5060, blackwell
