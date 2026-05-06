---
name: ไม่มี "Seedance ทำไม่ได้" — มีแต่ tradeoff
description: ปัญหาเกือบทั้งหมดของ Seedance คือ tradeoff ระหว่าง strict (faithful to preview) vs loose (free) ไม่ใช่ limitation
type: feedback
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# ไม่มี "Seedance ทำไม่ได้" — มีแต่ Tradeoff

**Rule (สำคัญมาก)**: ก่อนเขียน "Seedance ทำ X ไม่ได้" → หยุดก่อน — มันน่าจะเป็น **tradeoff** ไม่ใช่ limitation

**Why** (DewS feedback 2026-05-06):
- หนูเขียน list "❌ ทำไม่ได้": ตึกถล่ม, rig artifact, render jargon, geometry pollution
- DewS แก้: **"พวกนี้ไม่ใช่ทำไม่ได้ แต่ถ้าตั้งสตริคมาก จะออกมาตามพรีวิวเป๊ะ แต่ถ้าไม่สตริค จะหายไป แต่ก็จะไม่ตรง"**
- = ทุกอย่างคือ tradeoff ของ Camera Lock (สไลด์ 3) — ไม่ใช่ model limitation

**หลักการ Tradeoff**:
| ตั้ง Lock | ผลที่ได้ |
|-----------|---------|
| **Strict มาก** | ของในพรีวิวมาทั้งหมด (ดี+เสีย — รวม rig, geometry mockup, ตึกล้มอิงกัน) |
| **ไม่ Strict** | ของเสียหายไป แต่ก็ไม่ตรง preview ในส่วนที่อยากตรง |

**ทางแก้ที่แท้จริง**: **แก้ที่ source (Maya) ก่อนใช้เป็น ref** — ไม่ใช่พยายาม override ใน prompt

**ปัญหาที่ดูเหมือน "ทำไม่ได้" แต่จริงๆ เป็น tradeoff**:
- ตึกถล่มไม่จริง = พรีวิวมีตึกล้มอิงกัน + ล็อค strict
- Geometry mockup เป็นพิษ = พรีวิวมี geometry + ล็อค strict
- Rig artifact ติดมา = พรีวิวมี rig + ล็อค strict
- ศัพท์ render engine ไม่ทำงาน = AI ไม่เข้าใจ jargon (อันนี้เป็น translation issue ไม่ใช่ lock)

**limitation ที่เป็นจริงของ model**:
- **Consistency ข้ามรอบ** — gen ใหม่ 100% ทุกครั้ง (deterministic output ไม่ได้)

**บทเรียนการเลือกภาษา (ไม่ใช่ limitation แต่สำคัญมาก)**:
- DewS เรียนรู้เอง: คนทำก่อนหน้าใช้ศัพท์ **ไม่ใช่ภาษาหนัง** → ผลออกมา **แข็ง ไม่สมูท ไม่เหมือนหนัง**
- ✅ ใช้: cinematography vocab — DOF, motion blur, ARRI, handheld tremor, film grain, rack focus
- ❌ ห้ามใช้: 3D engine vocab — parallax, PBR, billboard, skybox, subsurface
- **Why**: Seedance เทรนกับ video/movie data ไม่ใช่ game engine output → พูดภาษาหนัง = ได้ผลหนัง

**How to apply**:
- ก่อนใส่อะไรใน "ทำไม่ได้" list → ถาม 2 ข้อ:
  1. **ถ้าไม่ใช้ video ref ทำได้ไหม?** → ถ้าได้ = ไม่ใช่ limitation = tradeoff
  2. **ถ้าแก้ที่ source แล้วใช้ ref ทำได้ไหม?** → ถ้าได้ = ไม่ใช่ limitation = source-side fix
- ใช้คำ "Tradeoff" / "ต้องตัดสินใจ" / "แก้ที่ source" แทน "ทำไม่ได้"
- เก็บ "ทำไม่ได้" ไว้ใช้แค่กับ true limitations (consistency ข้ามรอบ, jargon translation)
