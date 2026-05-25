---
name: ai-video-image-tool-stack-dews
description: "DewS ใช้ Higgsfield สำหรับ storyboard (still images), Dreamina/Jimeng สำหรับ video (Seedance engine) — workflow Paradigm 2 (image refs)"
metadata: 
  node_type: memory
  type: reference
  originSessionId: c751f317-8a08-49b0-9ffd-0433e4233257
---

DewS แยก tool ตามขั้นตอนงาน:

## Stack

| ขั้นตอน | Tool | Output |
|---|---|---|
| **Storyboard** | **Higgsfield** | Still images (เฟรมนิ่งของแต่ละ shot) |
| **Video generation** | Dreamina (dreamina.capcut.com) / Jimeng (即梦) | Video clips |
| **Engine (video)** | Seedance (ByteDance) | — |

## Workflow ปกติ (Paradigm 2 — Image refs)

1. **Storyboard pass** — เจนภาพ still ด้วย Higgsfield ทีละ shot
2. **Approve storyboard** — DewS เลือก frame ที่ใช่
3. **Video pass** — ใช้ storyboard image เป็น ref ในพรอมต์ Dreamina/Jimeng
4. Animate from still → video clip
5. Edit ต่อใน post (Premiere/AE)

## Implications สำหรับ Oracle

- **Image prompts** (Higgsfield) — เน้น composition, pose, lighting, lens — ไม่มี motion/sound
- **Video prompts** (Seedance/Dreamina) — เพิ่ม camera move, action, sound, atmosphere
- **อย่ารวม shots** ใน prompt เดียว — แยกทีละ shot
- **อย่าข้ามขั้น** — storyboard ก่อน video เสมอ (DewS confirm 2026-05-24)

## Why

DewS ทำ commercial-style video ที่ต้อง consistent character/style ข้าม shot
→ Higgsfield ทำ still ที่ใช้เป็น "anchor" ทำให้ video เจนตามได้นิ่งกว่า เริ่ม video เปล่าๆ

## How to apply

- ขั้นแรกของทุก video project → ทำ storyboard prompt (Higgsfield) ก่อน ห้ามข้ามไป video prompt เลย
- Image prompt structure: Style line · Refs · Composition · Pose · Lighting · Mood · Lens
- ตัด: camera move (slow drift), motion (slowly flipping), sound (diegetic)
