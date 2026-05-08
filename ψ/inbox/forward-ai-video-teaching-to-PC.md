# Forward → น้องเวนดี้ (PC)

**Topic**: AI Video Teaching Pack — แก้ slide แล้วต้องอัพเดท MD ที่น้อง
**Created at**: 2026-05-08 ~16:00 (พี่เวนดี้)
**For**: น้องเวนดี้ session ถัดไป
**Status**: 🟡 ค้างทำที่น้อง

---

## Context

วันนี้ DewS เปิดไฟล์ `D:\_DewS\AI\ai-video-prompt-slides.html` ที่พี่เวนดี้ (copy มาจาก `E:\02_AI\ai-video-teaching\` ที่น้อง) แล้วแก้หลายจุด

**ไฟล์ master อยู่ที่น้อง (เดิม)**: `E:\02_AI\ai-video-teaching\ai-video-prompt-slides.html`
**ไฟล์ที่แก้แล้ว** (อยู่ใน repo, /sync pull จะได้): `ψ/active/ai-video-teaching/ai-video-prompt-slides.html`

---

## งานที่ต้องทำที่น้อง

### 1. Copy slide ที่แก้แล้วทับของเดิม

หลัง `/sync pull` ที่น้องเวนดี้:

```powershell
# Copy ไฟล์ที่แก้ล่าสุดจาก repo → ทับ master ที่ folder ทีม
Copy-Item "D:\_DewS\_Wendys\ψ\active\ai-video-teaching\ai-video-prompt-slides.html" `
          "E:\02_AI\ai-video-teaching\ai-video-prompt-slides.html" -Force
```

⚠️ **ระวัง**: ไฟล์ master ที่น้องตอนนี้ยังเป็น version ก่อนแก้ — ต้องทับด้วยของใหม่จาก repo

### 2. อัพเดท MD reference

ไฟล์: `E:\02_AI\ai-video-teaching\2026-05-08_ai-video-prompt-principles.md`

**เพิ่ม 3 sections ใหม่** (ที่ย้ายออกจาก slide ตามหลัก Audience Separation — Slide สอนคน, MD สอน Oracle):

#### A. Reference Naming Convention (ย้ายมาจาก slide 14)

```markdown
## Reference Naming Convention

ทุก reference ในพรอมท์ต้องตั้งชื่อแบบบรรยาย ไม่ใช่ generic:

❌ ไม่บอกอะไร:
@[image1]
@[image2]
@[video_ref]

✅ บอกชัดว่ารูปอะไร:
@[character sheet มังกร]
@[เฟรมแรก สีส้ม]
@[playblast Shot07 มังกรบิน]

Format: @[ชื่อบรรยายรูป] — Role. Key visual.

เหตุผล: DewS ใช้ Oracle workflow — ตั้งชื่อไทย ใน @[...] เพื่อ DewS แนบรูปสะดวก
ดู memory: feedback_oracle_prompt_convention_for_dews.md
```

#### B. Anatomy Reference Format (ย้ายมาจาก slide 12)

```markdown
## Anatomy: Reference Format

ใน section References ของพรอมท์ — แต่ละ ref 1 บรรทัด:

Format: @[ชื่อบรรยายรูป] — Role. Key visual cue.

ตัวอย่าง:
@[มังกร charsheet] — Dragon character sheet, strictly reference for appearance.
@[เฟรมแรก สีส้ม] — Composition reference. Low angle, dark sky.
Strictly follow @[video] for camera movement.

หลัก:
- Role ต้องชัด: charsheet / first-frame / location-anchor / playblast
- Key visual cue ช่วย AI verify ว่าใช้ ref ถูก
- ภาษา: Oracle เขียน — ไม่ต้องสอน DewS เขียนเอง
```

#### C. Oracle Pre-generate Checklist (ย้ายมาจาก slide 27)

```markdown
## Oracle Pre-generate Checklist

ตรวจ 11 ข้อก่อนส่งพรอมท์ให้ DewS เจน:

1. Character description ครบทุก layer (ผม สี ตา ผิว เสื้อ รองเท้า)
2. Voice descriptor lock (ถ้ามี dialogue)
3. Style line copy-paste จากของเดิม
4. Environment description match กับ ref
5. Camera lock level เหมาะกับ goal
6. Ref image + text prompt ไม่ขัดกัน
7. ท่าทาง simple ไม่ overload
8. No prohibited words (sparkling eyes ฯลฯ)
9. No BGM ถ้าจะใส่เสียงเอง
10. Timeline พอดีกับจำนวนประโยค (ถ้ามี dialogue)
11. Word count ใน sweet spot (30-100 จีนคำ / 80-200 อังกฤษคำ)

ส่วนที่ DewS ตรวจเอง (อยู่ใน slide):
- Vision/concept ของ shot ชัดในใจ
- Ref image ที่ส่ง = ตรงกับสิ่งที่อยากได้
- Style ตรงกับ project เดิม
- Duration พอกับเนื้อหา
- หลัง generate: ตัวละคร/style/env ตรงกับ vision
```

### 3. ตรวจ memory ใหม่ที่ sync มาแล้ว

หลัง `/sync pull` ที่น้อง ควรเจอ memory ใหม่ 2 ไฟล์:

- `~/.claude/projects/d---DewS--Wendys/memory/feedback_no_male_pronoun.md` 🚫
- `~/.claude/projects/d---DewS--Wendys/memory/feedback_audience_separation_slide_vs_md.md` 📚

ดู MEMORY.md ที่ index 2 entries ใหม่นี้ใน Identity section

---

## สรุปการแก้ slide รอบนี้ (เพื่อ verify ว่าไฟล์ตรงกัน)

| Slide | สิ่งที่แก้ |
|---|---|
| 2 | เพิ่ม Three Little Pigs (3D Pixar) เป็น sub-style ของ Engenius · iterate (ลองวนปรับซ้ำๆ) |
| 3 | เปลี่ยน wording "Consistency ข้าม shot คือปัญหา default" → "ตัวละครเปลี่ยนหน้า สไตล์เพี้ยน — เป็นพฤติกรรมพื้นฐานของ AI" |
| 4 | "ห้าม paraphrase" → "ห้ามเรียบเรียงใหม่" |
| 5 | "เคล็ด" → "เจอมาแล้ว" · drift (ค่อยๆ เพี้ยน) |
| 7 | descriptor (คำกำกับเสียง) · internal voice presets (เสียงสำเร็จในระบบ) |
| 8 | ตาราง 5 categories — บรรทัดตรงกัน 1:1 · Cartoon ARRI/IMAX (ใหม่) · cel-shading อธิบาย · Mark "(ทฤษฎี)" 4 แถวที่ไม่ verified · ".txt วิธีใช้จริง" rewrite |
| 9 | Decision tree (ผังเลือกแนวทาง) · robust (เพี้ยนยากกว่า) |
| 10 | Diagnose (วินิจฉัยและแก้) |
| 11 | paradigm (แนวทาง) · Granularity (ระดับการล็อค) · **ตัดตาราง สถานการณ์→Paradigm→Tool ทิ้ง** (ซ้ำกับ compare-grid) |
| 12 | Sweet spot (ช่วงที่ AI ทำงานดีที่สุด) · simile/metaphor (เปรียบเทียบ "ราวกับ.../เหมือน...") · mechanics (ขั้นตอนกล้ามเนื้อ/กลไก) · **References format `@[...]` ลบ** ย้ายไป MD |
| 13 | diegetic sounds (เสียงในฉากจริง — ลม/ฝีก้าว/ไฟ ไม่ใช่ BGM) |
| 14 | composition (การจัดวางในเฟรม) · **section "การตั้งชื่อ ref ที่ดี" ลบ** ย้ายไป MD · เพิ่ม callout "หน้าที่คน vs Oracle" · "verify match" → "ต้องเช็คให้ตรงกัน" |
| 20 | tokenize (อ่านแยกเป็นคำๆ) |
| 21 | "เคล็ด" → "ข้อสังเกต" |
| 23 | patch prompt (แก้เพิ่มจากอันเดิม) |
| 25 | Prototype 1 ก่อนเขียน 4 → "1 shot ก่อนเขียน 4 shot" · verify, approach วงเล็บ · Cross-reference Canonical Values (เช็คค่าหลักจากหลายที่) · source, grep วงเล็บ · Iterate, feedback loop วงเล็บ |
| 26 | Patch prompt (แก้เพิ่มจากอันเดิม) |
| 27 | **Checklist 12 ข้อรวม → แยก 2 ชุด: 👤 คน 7 ข้อ + 🤖 Oracle 11 ข้อ** + callout "คน + Oracle = ทีม" |

---

## หลักการที่ apply ในรอบนี้ (เพื่อ next session ใช้ต่อ)

1. **Audience Separation** — Slide สอนคน, MD สอน Oracle, ห้ามปนกัน
   - Naming convention, format, prompt mechanic → MD
   - Mental model, why-it-works, ปัญหา + แก้ → Slide
2. **ใส่วงเล็บอธิบาย jargon** — ห้ามลบศัพท์เฉพาะ แต่ใส่ความหมายไทยไว้เสมอ
3. **Mark "(ทฤษฎี)" สำหรับสิ่งที่ไม่ได้ verify จริง** — Teaching ต้องแยก experience จาก theory
4. **WEnDyS ห้ามใช้สรรพนาม "ผม"** — ใช้ "เรา/ฉัน/หนู" หรือไม่ใช้สรรพนาม

---

## Memory ที่อ้างอิง

- `feedback_audience_separation_slide_vs_md.md` 📚 (ใหม่)
- `feedback_no_male_pronoun.md` 🚫 (ใหม่)
- `feedback_explain_jargon_in_teaching.md` (เก่า)
- `feedback_oracle_prompt_convention_for_dews.md` (เก่า)
- `feedback_principle_vs_style.md` (เก่า)
- `feedback_teaching_separate_signal_from_noise.md` (เก่า)
