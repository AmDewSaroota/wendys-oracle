# Seedance — Oracle Workflow

> **Audience**: Oracle ที่ช่วย DewS เขียน Seedance prompt
> **Not for**: คนเรียน (ใช้ slide แทน)
> **Companion docs**: [seedance-prompt-guide.md](./seedance-prompt-guide.md) (principles) · [seedance-cinematic-cutscene-research.md](./seedance-cinematic-cutscene-research.md) (cinematic technique)

---

## 1. ขอข้อมูลก่อนเขียน — 5 อย่าง

| สิ่งที่ต้องมี | ถ้าไม่มี → ขอ DewS |
|---|---|
| 🎯 **Vision** — shot นี้อยากได้อะไร (mood, motion, key moment) | "พี่อยากได้ shot แบบไหนคะ? บรรยายให้ฟังหน่อย" |
| 🖼️ **Image refs** — charsheet, location, first-frame | "มี ref image ไหมคะ ส่งให้ดู" |
| 🎬 **Video ref (playblast)** — ถ้ามี | Oracle **ดู video ไม่ได้** → "ขอบรรยาย playblast หน่อยค่ะ หรือใช้ Gemini transcribe ก็ได้" |
| 📐 **Paradigm** — Video ref (playblast) หรือ Image refs (still)? | ถามถ้าไม่ชัด — ต่างกันสิ้นเชิง |
| 🎨 **Style line** ของ project เดิม | Copy-paste **ห้าม** เขียนใหม่ |

---

## 2. เขียน prompt ตาม Anatomy 7 ส่วน

```
1. Style line       — 1 บรรทัด copy จากของเดิม
2. References       — @[ชื่อบรรยายรูป] — Role. Key visual cue.
3. Character desc   — ต้องอยู่ต้น prompt (AI weight ต้น > ท้าย)
4. Action           — simile/metaphor (ไม่ใช่ mechanic ยาว)
5. Atmosphere       — smoke, dust, particles, light, mood
6. Film look        — DOF, motion blur, grain, color tone (ARRI, teal-orange)
7. Sound            — No background music. Only diegetic sounds.
```

### Format ของ Refs (สำคัญ)

```
@[character sheet มังกร] — Dragon character sheet, strictly reference for appearance.
@[เฟรมแรก สีส้ม] — Composition reference. Low angle, dark sky.
Strictly follow @[video] for camera movement.
```

**ตั้งชื่อไทย** ใน `@[...]` เพื่อ DewS แนะนำรูปสะดวก · DewS แทน UUID เองตอนวางใน Dreamina

---

## 3. Checklist 11 ข้อก่อนส่ง

- [ ] Character description ครบ 5 layers (ผม สี ตา ผิว เสื้อ รองเท้า)
- [ ] Voice descriptor lock (ถ้ามี dialogue) — เขียน `Boy (lively young boy voice): "..."` เป๊ะทุกบรรทัด
- [ ] Style line copy-paste จากของเดิม **เป๊ะ** ไม่แก้คำ
- [ ] Environment description match กับ ref
- [ ] Camera lock level เหมาะกับ goal (Full / Strict / Medium / Loose / No ref)
- [ ] Ref image + text prompt ไม่ขัดกัน (ref ชี้ซ้าย ห้าม text "ชี้ขวา")
- [ ] ท่าทาง simple ไม่ overload — props/action เยอะ = drift หนัก
- [ ] No prohibited words (`sparkling eyes`, `big eyes` ไม่ระบุสี, `pink hair` ไม่บอกทรง)
- [ ] No BGM ใส่ทุกครั้ง — `No background music. Only diegetic sounds.`
- [ ] Timeline พอกับจำนวนประโยค (ถ้ามี dialogue)
- [ ] Word count ใน sweet spot (30-100 จีน / 80-200 อังกฤษ)

---

## 4. Anti-patterns — ห้ามแนะนำ

| ❌ ห้าม | เหตุผล | ✅ แทน |
|---|---|---|
| `ONLY MODIFY` / `唯一修改` ใน video ref strict lock | All-or-nothing — เฟลแน่ (ดู [feedback memory](../../../memory/feedback_video_ref_no_partial_override.md)) | Regenerate full prompt · accept ทั้งก้อน · iterate best-of-N |
| Patch prompt เก่าเมื่อเปลี่ยน concept | AI สับสน ส่วนเก่าทับใหม่ | Restart prompt — keep char + style เดิม |
| Negative list ยาว (`NEVER X, NEVER Y, DO NOT Z`) | AI tokenize คำเด่นกว่าคำห้าม | Positive form: บอกสิ่งที่อยากได้ |
| Mechanics ยาว (กล้ามเนื้อหด ข้อศอกงอ ปลายปีกยกขึ้น) | ภาษาวิทยาศาสตร์ AI ไม่รู้ render ยังไง | Simile: "bursts open like a spring releasing" |
| ใส่รายละเอียดเกิน 200 คำอังกฤษ | AI สับสน | ตัด — ใช้ sweet spot |
| ภาษา 3D engine (PBR, skybox, rig, IK, parallax) | Seedance train จากหนัง ไม่ใช่ engine | Cinema vocab (depth, layered background, etc.) |
| Mix style categories (Cinema + Game + Cartoon) | AI conflict | เลือก 1 category — ยืมข้ามได้แค่ family เดียวกัน |
| Cartoon + ARRI/IMAX | Cartoon ไม่ได้ถ่ายจริง → look ครึ่ง real ครึ่ง cartoon | เลือก category เดียว |

---

## 5. หลัง DewS เจน → Iterate

```
DewS บรรยายผลลัพธ์
  → Oracle วิเคราะห์ drift มาจาก lock layer ไหน
  → แก้ prompt
  → DewS เจนใหม่
  → loop จนกว่าจะได้
```

**กฎ**: ลอง 3 ครั้งแล้วยังไม่ได้ → อย่าฝืน เปลี่ยน approach (เปลี่ยน paradigm, ลด lock, split shot)

---

## 6. Quick Reference

### 5 Layers ต้อง lock

Character / Voice / Style / Environment / Camera

### 2 Paradigms — workflow ต่างกัน

| | Paradigm 1: Video ref | Paradigm 2: Image refs |
|---|---|---|
| Source | Playblast video (Maya/Blender) | Charsheet + location refs (still) |
| AI ทำ | Style transfer + cinematic | Animate from still |
| Lock | Camera lock levels (Full→No ref) | Multi-image refs + char desc + location anchor |
| Granularity | All-or-nothing | แยกได้ — lock หน้าตา ปล่อย motion |
| Example | Fortal Dragon | Engenius My Friend, 3 Little Pigs |

### Camera Lock Levels

| ระดับ | ใช้เมื่อ | ผลลัพธ์ |
|---|---|---|
| Full (90%+) | ต้องการตรง playblast | เหมือน preview + cinematic ผิวๆ |
| Strict | lock action ปล่อยบรรยากาศ | ตำแหน่งตรง ref motion ใกล้เคียง |
| Medium | ต้องการ framing ใกล้เคียง | มุมคล้าย movement อิสระ |
| Loose | ref คร่าวๆ | AI สร้างเกือบเอง |
| No ref | อิสระ 100% | AI สร้างเอง |

### Tool stack

- **Engine**: Seedance (ByteDance)
- **UI**: Dreamina (dreamina.capcut.com) — English prompts
- **UI จีน**: Jimeng (即梦) — รี credit ทุกวัน · DewS ใช้สลับกัน

---

## 7. Reference docs

3 ไฟล์หลักที่ Oracle ต้องอ่าน:

| File | บทบาท |
|---|---|
| `seedance-oracle-workflow.md` (this file) | Workflow + checklist + anti-patterns |
| [`seedance-prompt-guide.md`](./seedance-prompt-guide.md) | Principles การเขียน prompt (527 บรรทัด) |
| [`seedance-cinematic-cutscene-research.md`](./seedance-cinematic-cutscene-research.md) | Cinematic technique research |

### Memory ที่เกี่ยวข้อง

- `feedback_video_ref_no_partial_override.md` — ⚠️ Video ref strict lock = all-or-nothing
- `feedback_oracle_prompt_convention_for_dews.md` — naming convention ของ refs
- `feedback_audience_separation_slide_vs_md.md` — MD นี้สอน Oracle ไม่ใช่คน
