# Seedance Cheat Sheet

**Distilled from**: `ψ/lab/vdrama/seedance-prompt-guide.md` (32KB master guide)
**By**: DewS + WEnDyS · 2026-05-06

---

## 1. ภาพรวม (เข้าใจสถาปัตยกรรมก่อน)

```
[คุณ] → [Oracle] → [prompt ภาษาอังกฤษ] → [Dreamina (web)] → [Seedance model] → [คลิป]
                                              ↑
                              Jimeng (จีน) ก็ส่งเข้า Seedance ตัวเดียวกัน
```

- **Seedance** = AI model ที่สร้างคลิป (engine)
- **Dreamina** / **Jimeng** = ที่ที่คุณไปกดสั่ง (เลือก provider)
- **Oracle** = AI ผู้ช่วยที่ช่วยเขียน prompt + จำผลงานเก่า

---

## 2. โครงสร้าง Prompt (5 ส่วน)

```
[Style keywords — 1 บรรทัด]               ← เปิดด้วย mood

@[ref ที่ต้องแนบ] — Role. Description.    ← refs รวมข้างบน

[Character description ต้นๆ เสมอ!]        ← Seedance อ่านต้นๆ ก่อน

[Action — สั้น attitude-driven]            ← "like a raptor diving"

[Atmosphere + film look]                   ← DOF, motion blur, grain

[Sound direction — ระบุตาม project ของคุณ]
```

**กฎเหล็ก**: 30-100 คำ · เกิน 150 คำ model สับสน

---

## 3. Camera Lock — Concept สำคัญที่สุด

| ระดับ | เมื่อไหร่ใช้ | ผลลัพธ์ |
|-------|-------------|---------|
| **90% Lock** | ต้องการตรง playblast | เหมือน preview + cinematic |
| **Strict** | ล็อคแอคชั่น ปล่อยบรรยากาศ | ตำแหน่ง/ทิศตรง |
| **Medium** | ต้องการ framing คล้าย | มุมคล้าย แต่ motion อิสระ |
| **Loose / No ref** | อิสระ | Seedance สร้างเอง |

**กฎ**: Video ref = all-or-nothing — ลด lock = ลดทุกอย่าง · อยากเปลี่ยนแค่จุดเดียว → strict lock + `唯一修改` *("เปลี่ยนแค่...")* `[จุดที่เปลี่ยน]`

> 📖 **Real story (dragon project)**: เราล็อคพรีวิวเพื่อเอา **มุมกล้อง + แอคชั่นมังกร** → AI ล็อคทุกอย่างรวม **ตึกล้มอิงกัน** (ตามพรีวิว ไม่ได้ถล่มจริง) → ลอง **ลด lock** ให้ตึกถล่มได้จริง → **มุมกล้อง+มังกรเพี้ยนหมด** → บทเรียน: **video ref = all-or-nothing แยกล็อคไม่ได้** · ทางแก้ในงานจริง: **เปลี่ยนสคริปต์ ใช้ไฟ+ควันกลืนตึกแทน**

> ⚠️ **ความจริงที่ต้องรู้**: ทริค `唯一修改` **ไม่ได้ผลเสมอไป** — AI gen ใหม่ **100% ทุกรอบ** · อยากแก้แค่จุดเดียว แต่ผลคือ **เปลี่ยนทั้งคลิปก็มี** · ทำใจไว้ + เก็บคลิปที่ดีรอบก่อนสำรองไว้เสมอ

---

## 4. @ References

| Type | ใช้เมื่อ | 💡 คำแนะนำ | ตัวอย่าง |
|------|---------|-----------|---------|
| **Character sheet** | ล็อคหน้าตา | 🟢 **ใช้เลย** | `@[มังกร charsheet] — Dragon character sheet, strictly reference for appearance.` |
| **Atmosphere** | ล็อค mood/สี | 🟢 **ใช้เลย** | `@[บรรยากาศเมฆ] — Atmosphere reference. Dark storm clouds.` |
| **Composition** | ล็อค framing | 🟡 **ใช้ได้ ระวัง** | `@[เฟรมแรก สีส้ม] — Composition reference. Low angle, dark sky.` |
| **Starting / End frame** | ล็อคเฟรมแรก/ท้าย | 🟡 **ใช้ได้ ระวัง** | `@[เฟรมแรก Shot07] — Starting frame.` · `@[เฟรมท้าย Shot07] — Loose guide for near-end framing only.` |
| **Video (playblast)** | มี silhouette + bg ที่เข้าใจได้ | 🔴 **ผันผวน** | ใช้ตอนต้องล็อคกล้อง+แอคชั่น |

> ⚖️ **🟡 Composition / Starting / End frame Tradeoff**:
> - **Strict มาก** → เฟรมตรง แต่ action อาจ **ค้าง / ลอย / ช้า / ขัดธรรมชาติ**
> - **ปล่อยหลวม** → action สวยขึ้น แต่เฟรมไม่ตรง 100%
> - **ปกติปล่อยหลวม ผลออกมาสวยกว่า**

> 📖 **ทำไมแต่ละแบบเป็นแบบนี้**:
> - 🟢 **Character sheet + Atmosphere** — AI gen ตามอิสระได้ ผลเสถียร
> - 🟡 **Composition / Frame** — อยู่ที่ความ strict (ดู Tradeoff ด้านบน)
> - 🔴 **Video ref** — ผันผวนตามคุณภาพ playblast (silhouette ชัด vs abstract)

---

## 5. ทำได้ดี vs Tradeoff ที่ต้องเลือก

**ไม่มี "ทำไม่ได้" จริงๆ — เกือบทั้งหมดคือ tradeoff**

| ✅ ทำได้ดีเลย | ⚖️ Tradeoff (ของในพรีวิวจะติดมา) |
|---------------|------------------------------------|
| ไฟ, ควัน, เถ้า, particles | ตึกล้มอิงกัน (พรีวิวล้มแค่อิง ไม่ถล่มจริง) |
| DOF, motion blur, film grain | Geometry mockup → ไฟกลายเป็นแท่ง / รูปทรงประหลาด |
| แสง/เงาตอบสนองกับไฟ | Rig artifact (เส้น rig จาก Maya) |
| เมฆเคลื่อนที่ | ของไม่ตั้งใจอื่นๆ ในพรีวิว |
| สีหน้า/กระพริบตา | |
| Handheld camera feel | |

> **หลักการ Tradeoff**: Strict lock → ของในพรีวิวมาทั้งหมด (ดี+เสีย) · ลด lock → ของเสียหาย แต่ไม่ตรง preview เหมือนกัน → **ทางแก้จริง: แก้ที่ source (Maya) ก่อนใช้เป็น ref**

> 📖 **บทเรียน — ใช้ภาษาหนัง ไม่ใช่ภาษา Render Engine**:
> - ✅ ใช้: **DOF, motion blur, ARRI, handheld tremor, film grain** (cinematography vocab)
> - ❌ ห้ามใช้: **parallax, PBR, billboard, skybox** (3D engine vocab) → ทำให้ผล **แข็ง ไม่สมูท ไม่เหมือนหนัง**
> - **Why**: Seedance เทรนกับหนัง ไม่ใช่ game engine — พูดภาษาเดียวกับมัน

---

## 6. 🎬 Cinematography Vocab — ภาษาที่ Seedance ฟังรู้เรื่อง

### 📷 Cameras & Brands
- **ARRI ALEXA** — กล้อง Hollywood (80%+ หนังใหญ่)
- **ARRI tone / ARRI color** — สี Hollywood (warm skin, teal shadows, golden highlights)
- **Kodak film stock** — สีฟิล์มอบอุ่น contrast แรง
- **Fuji film stock** — สีฟิล์ม pastel นุ่ม

### 🔭 Lens & Look
- **Anamorphic lens** — wide cinematic + bokeh ขอบยืด (เลนส์ widescreen หนัง)
- **Cooke S4 / vintage glass** — ผิวนุ่ม retro
- **Shallow depth of field** — ชัดตื้น (DOF — โฟกัสเฉพาะจุด, bg เบลอ)
- **Wide-angle distortion** — มุมกว้างผิดส่วน drama
- **35mm lens / 85mm prime** — focal length เฉพาะ (cinematic feel)

### 🎨 Color & Grade
- **Teal & orange** — สี blockbuster ปัจจุบัน (เงาฟ้าเขียว, highlights ส้ม)
- **Bleach bypass** — desaturated (Saving Private Ryan look)
- **Day-for-night** — กลางวันแต่งให้เป็นคืน
- **Golden hour** — แสงทองชั่วโมง sunset/sunrise
- **Blue hour** — แสงน้ำเงินก่อนพระอาทิตย์ขึ้น/ตก

### 🎥 Camera Movement
- **Handheld tremor** — กล้องสั่นเหมือนถือ
- **Steadicam float** — ลื่นไหลไม่สั่น
- **Dolly push-in / pull-out** — เลื่อนเข้า/ออก object
- **Whip pan** — กวาดเร็วแบบเบลอ
- **Crane shot** — มุมสูงเลื่อนลง
- **Tracking shot** — ตามเคลื่อนที่ของ subject
- **Low-angle / high-angle** — มุมต่ำ/สูง

### 💡 Lighting Style
- **Practical light** — แสงจากของในฉาก (โคมไฟ, ไฟถนน, เปลวไฟ)
- **Motivated light** — แสงมีที่มาในเรื่อง
- **Chiaroscuro** — แสงเงาเข้ม contrast แรง (Caravaggio style)
- **Rim light** — แสงขอบหลังแยกตัวจาก background
- **Low-key / High-key** — มืดเข้ม / สว่างนุ่ม
- **Soft key light at 5600K** — แสงนุ่มอุณหภูมิสีเหมือน daylight

### 🎞️ Film Texture
- **16mm grain** — เกรนหยาบ retro
- **35mm fine grain** — เกรนละเอียด หนังโรง
- **Heavy film grain** — เกรนหนัก vintage
- **Halation** — ขอบไฟเบลอเป็น halo
- **Lens flare** — แสงสะท้อนเลนส์
- **Volumetric dust / fog** — ฝุ่นลอย หมอกในแสง

### 🎭 Director / Cinematographer Style (Advanced)
- **Roger Deakins style** — natural light, careful composition (1917, Blade Runner 2049)
- **Wes Anderson style** — symmetrical, locked frame, pastel palette
- **Christopher Doyle style** — handheld dreamy, neon (Wong Kar-wai films)
- **Emmanuel Lubezki style** — long takes, natural light (Birdman, The Revenant)

### 🚫 ห้ามใช้ภาษา 3D Engine
- `parallax`, `PBR`, `billboard`, `skybox`, `subsurface scattering`, `frustum`, `viewport`, `FOV`, `rig / joint / IK` → ทำให้ผลแข็ง CG ไม่เหมือนหนัง

> 📚 **Glossary เต็ม + research เพิ่มเติม**: ดู `ψ/memory/learnings/ai-video-teaching/cinematography-vocab.md`

---

## 7. Top 5 ปัญหา + วิธีแก้

| ปัญหา | แก้ |
|-------|-----|
| มังกรพุ่งผิดทิศ | เพิ่ม lock: `严格参考` *(strict reference)* |
| เหมือน preview ไม่มี cinematic | ลด lock + เพิ่ม style keywords |
| ทุกอย่างชัดหมด | `极浅景深` *(DOF ตื้นมาก)* + FG/BG เบลอ |
| ไม่มี motion blur | `全身带有明显动态模糊` *(ทั้งตัวมี motion blur ชัด)* |
| handheld ไม่รู้สึก | ลบ camera lock + `明显晃动` *(เขย่าชัด)* |

> 🚫 **คำอันตราย — AI อาจปฏิเสธไม่ Generate**:
> - **ห้ามใช้**: ความรุนแรงโจ่งแจ้ง, เลือดสาด, ระเบิดอย่างเลวร้าย (gore, brutal death, graphic violence, blood splatter, catastrophic explosion)
> - **ใช้คำอ้อมแทน**: `intense action`, `fierce battle`, `dragon's destruction`, `smoke and chaos`, `devastation`
> - Why: Seedance มี content filter — คำที่ "เห็นชัดเกินไป" จะถูก block

---

## 8. Mindset — สำคัญที่สุด

1. **Iteration คือเรื่องปกติ** — Shot 1 ของ dragon ใช้ ~20 รอบกว่าจะได้ · งบ Dreamina ~2,600 credits
2. **Seedance อ่านข้างหน้าก่อน** — ของสำคัญต้องอยู่ต้น prompt
3. **เขียนเกินจริง** — อยาก 7/10 ต้องเขียน 10/10
4. **Attitude > Mechanics** — "like a raptor diving" ดีกว่า "wings flap up and down"

---

## 9. 🎨 คงสไตล์ Prompt ตลอด Project (ห้ามเปลี่ยนข้ามเซสชั่น)

> **"สไตล์" ในที่นี้คืออะไร**: วิธีเขียน prompt — โครงสร้าง, สำนวน action, ระดับรายละเอียด, ภาษา (อังกฤษล้วน vs mix จีน) **ไม่ใช่**สไตล์หนัง

### ❌ ตัวอย่างที่ไม่ควรทำ — Shot 1 vs Shot 2 ต่างสไตล์

```
Shot 1: "Dragon swoops down like a hawk diving on prey"
        → สั้น, attitude-driven, simile

Shot 2: "The dragon descends at high speed toward the village,
         wings beating rapidly to maintain altitude..."
        → ยาว, mechanical, descriptive
```

→ AI ตีความ 2 แบบ → ผลออกมาคนละหนัง

### ✅ คงสไตล์เดิมตลอด project

```
Shot 1: "Dragon swoops down like a hawk diving on prey"
Shot 2: "Dragon banks left like a fighter jet breaking formation"
Shot 3: "Dragon climbs vertically like a rocket shedding its first stage"
```

→ สไตล์เดียว → ผลออกมา continuity ตัดต่อรวมกันได้

### 3 เหตุผลที่ต้องคงสไตล์

1. **Iterate ได้** — เห็นชัดว่าอะไรทำงาน อะไรไม่ทำงาน → debug ง่าย
2. **Visual continuity** — ทุก shot มี aesthetic ใกล้เคียง → ตัดเป็นหนังเรื่องเดียวได้
3. **Iteration tracking** — เปรียบเทียบ A/B test ได้ ต้องการตัวแปรเดียวเปลี่ยน

> ⚠️ **ถ้าจะเปลี่ยนสไตล์**: ต้องเปลี่ยน **ทั้ง project** — ไม่ใช่แค่ shot เดียว · ถ้าเปลี่ยนแค่บาง shot = ไม่ continuity ตัดต่อไม่เข้ากัน

---

## 10. Workflow ที่ DewS ใช้จริง

```
1. Vision     → DewS บอก Oracle ว่าอยากได้ shot อะไร
2. Refs       → DewS ส่งรูปให้ Oracle ดู (Oracle ดูรูปได้)
                ⚠️ สำหรับวิดีโอ playblast → Oracle ดูไม่ได้ ต้อง:
                · ใช้ Gemini ช่วยบรรยาย แล้วส่งให้ Oracle อ่าน หรือ
                · DewS บรรยายเองให้ Oracle ฟัง
3. Prompt     → Oracle เขียน prompt เต็มก้อน (อังกฤษ + จีน mix ตามจุด)
4. Generate   → DewS วาง prompt ใน Dreamina + แทน @ref ด้วย UUID จริง
5. Evaluate   → DewS ดูคลิป → บรรยาย/ใช้ Gemini ช่วยให้ Oracle รู้ว่าอะไรดี/ไม่ดี
6. Iterate    → Oracle แก้ prompt → กลับไป step 4
```

> ⚠️ **Oracle ดูวิดีโอไม่ได้**: Claude Code อ่าน **รูป (PNG/JPG/PDF)** ได้ แต่ **วิดีโอไม่ได้** · workaround:
> - ใช้ **Gemini** transcribe/describe video → ส่งคำบรรยายให้ Oracle อ่าน
> - หรือ DewS บรรยายเอง (เห็นปัญหาแล้วเล่าให้ฟัง)

---

---

## 🎬 พร้อมทำคลิปแรกแล้ว!

3 สิ่งที่ต้องจำ:
1. 📐 **ยึดโครงสร้าง 5 ส่วน** — style → refs → char → action → atmosphere
2. 🎬 **ใช้ภาษาหนัง** — ARRI, DOF, motion blur (ไม่ใช่ engine vocab)
3. 🔁 **Iterate คือเรื่องปกติ** — ผลแรกไม่เป็นใจ ก็แก้ prompt + ลองใหม่

**Cinema คือ language** — ขอให้สนุกกับการสร้างคลิปแรกของคุณ 🐉
