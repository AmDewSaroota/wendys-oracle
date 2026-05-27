# NDF Promo — DOE JOB VR

**Project**: NDF Promotional Video (showcase งาน NDF Dev)
**Shot ที่กำลังทำ**: Shot สุดท้าย (5/5) — **DOE JOB เรียนรู้อาชีพ VR**
**Client (project)**: กรมการจัดหางาน กระทรวงแรงงาน
**Brand ที่ promote**: บริษัทใหม่ (logo จะใส่ตอน post)
**Style**: Real footage commercial / cinematic live-action

**Total duration**: 30 วินาที
**Total shots**: 8 (Act 1: setup · Act 2: discovery · Act 3: resolution)
**Tool stack**: Higgsfield (storyboard still) → Dreamina/Jimeng + Seedance (video)

---

## Story Arc

| Act | Shots | Purpose |
|---|---|---|
| **1. Setup** | 1 | ปูปัญหา — เด็กชายสับสนเลือกอาชีพ |
| **2. Discovery** | 2-6 | เจอ booth VR · สวม headset · ลอง 7 อาชีพ · ตื่นเต้น |
| **3. Resolution** | 7-8 | ครอบครัวยิ้ม · end card (logo placeholder) |

---

## Shot List

| # | Time | Duration | Setting | Subject + Key Visual | Mood | Camera | Status |
|---|---|---|---|---|---|---|---|
| 1 | 0-4s | 4s | ห้องนอนเด็กที่บ้าน · โต๊ะริมหน้าต่าง · แสงเย็นบ่าย | เด็กชาย ม.ปลาย (~16) ชุดนักเรียน · นั่งหลังค่อม flip โบรชัวร์อาชีพ · sigh | melancholy, lost | Medium close-up · slow push-in | ✅ Storyboard + video prompt done |
| 2 | 4-7s | 3s | Hall นิทรรศการ Career Fair · crowd + booths | เด็กเดินผ่านคน · booth DOE JOB VR เด่นในระยะกลาง · มี VR headset display | curious, drawn-in | Tracking shot จากด้านหลังเด็ก · slight side angle | ✅ Storyboard prompt done |
| 3 | 7-10s | 3s | หน้า booth DOE JOB VR | เด็กยก VR headset ขึ้นใส่ · มือ + headset เด่น | anticipation, wonder | Close-up face/hands | ⏳ Pending |
| 4 | 10-12s | 2s | Transition | Light flash · fade to VR world | magical transition | Whip pan / fade effect | ⏳ Pending |
| 5 | 12-22s | 10s | ใน VR worlds (3 อาชีพ · 4 clips) | 5A: Drone briefing room · 5B: Drone fly POV · 5C: Doctor hospital room · 5D: Chef kitchen prep — ~2.5s/clip | dynamic, exciting, vibrant | Quick cuts · POV/medium | ✅ Storyboard done (5A=DronePilotRefF 5B=DronePilotRefE 5C=DoctorRefA 5D=ChefRefA) |
| 6 | 22-25s | 3s | กลับมา booth | เด็กยังใส่ headset · ใบหน้าเห็นรอยยิ้ม · ดวงตาประกาย | hopeful, inspired | Extreme close-up face | ⏳ Pending |
| 7 | 25-28s | 3s | หน้า booth | เด็กถอด headset · หันยิ้มให้ครู/พ่อแม่ที่ยืนข้างๆ · พวกเขายิ้มตอบ | warm relief, connection | Medium two-shot | ⏳ Pending |
| 8 | 28-30s | 2s | End card | **พื้นที่เบลอๆ รอ logo** + tagline placeholder · พื้นหลัง bokeh นิทรรศการ | confident close | Static | ⏳ Pending |

**Total**: 30 วินาที ✅

---

## Style Template (extracted จาก shot ก่อนของ project NDF Promo)

```
Style line:  Real handheld footage, warm golden afternoon light.
Naming:      @[CharXxxX], @[REFYyy], @[ShotN_ref]
Cultural:    Thai school uniform — ม.ปลาย (ตามกฎ thai_school_uniform_rules.md)
Focus rule:  Subject sharp · background soft bokeh (เสมอ)
Camera:      Slow drift / push-in / tracking
Film look:   ARRI tone, warm gold, vignette, 35mm
Sound:       No background music. Only diegetic sounds — [...]
Length tgt:  4 sec/clip, sweet spot 150-200 words EN
```

---

## Refs Library (Higgsfield, generated)

### CharBoyA — เด็กชาย ม.ปลาย
- **File**: `D:\_DewS\NDF Promo\Boy.png`
- **Status**: ✅ Approved
- **Prompt**: see `prompts/char-boy-a.md`

### REFBedroom — ห้องนอนเด็กที่บ้าน
- **File**: `D:\_DewS\NDF Promo\Bedroom.png`
- **Status**: ✅ Approved (wide-angle, มีตู้)
- **Prompt**: see `prompts/ref-bedroom.md`

### Shot1_ref — Storyboard frame Shot 1
- **File**: `D:\_DewS\NDF Promo\Shot1_ref.png`
- **Status**: ✅ Approved
- **Prompt**: see `prompts/shot-01-storyboard.md`

### Pending refs
- `REFExhibition` — Hall นิทรรศการ (Shot 2, 7)
- `REFVRBooth` — Booth DOE JOB VR (Shot 2, 3, 6, 7)
- `REFVR_*` — 7 VR worlds (Shot 5) — แยก 7 fields
- `CharTeacherParent` (optional Shot 7)

---

## Mood Mapping (sound design hint สำหรับตอน video prompt)

| Shot | Diegetic sounds |
|---|---|
| 1 | paper rustling, distant traffic, soft afternoon ambience |
| 2 | crowd chatter, exhibition murmur, soft footsteps |
| 3 | velcro/strap sound of headset, anticipatory silence |
| 4 | electronic chime, soft whoosh |
| 5 | varies per profession: coffee steam · sizzling pan · jet engine · drone hum · electric hum · brush stroke · heartbeat monitor |
| 6 | (muffled VR audio in background) · soft breath |
| 7 | warm chatter, family laugh, headset removal |
| 8 | crowd ambience fading · soft music swell (post) |

---

## Prompts ที่ทำแล้ว

ดูแยกใน `prompts/` folder:

- [char-boy-a.md](./prompts/char-boy-a.md) — CharBoyA reference (v3 final)
- [ref-bedroom.md](./prompts/ref-bedroom.md) — REFBedroom (wide-angle v2)
- [shot-01-storyboard.md](./prompts/shot-01-storyboard.md) — Shot 1 Higgsfield still
- [shot-01-video.md](./prompts/shot-01-video.md) — Shot 1 Dreamina/Seedance video
- [shot-02-storyboard.md](./prompts/shot-02-storyboard.md) — Shot 2 Higgsfield still

---

## Workflow (per shot)

```
1. Storyboard prompt (Higgsfield)  → still keyshot
2. DewS approve keyshot
3. Video prompt (Dreamina/Jimeng → Seedance) → ใช้ keyshot เป็น single ref
4. DewS approve clip
5. Next shot
```

⚠️ **Reminders**:
- ห้ามรวม shot ใน prompt เดียว
- ห้ามข้ามไป video prompt โดยไม่มี storyboard ก่อน
- Keyshot ครอบคลุม char + env แล้ว → ไม่ต้องแนบ @[CharBoyA] / @[REFBedroom] ซ้ำใน video prompt
- Logo บริษัทใส่ตอน post — prompt ใส่ "blurred placeholder" / "generic abstract booth signage"
- **ทุก prompt ต้องระบุ tool ที่ใช้เจนในหัวข้อเสมอ** — format: `Shot X — [ประเภท] (Tool)` เช่น `Shot 3a — Storyboard (Higgsfield)` / `Shot 1 — Video (Dreamina)` / `REFBooth — Setting ref (Higgsfield)`

---

## Related memories

- `ai_video_tool_stack.md` — Higgsfield (still) vs Dreamina (video) workflow
- `thai_school_uniform_rules.md` — เด็กชายไทย ม.ปลาย ขาสั้น khaki + ทรงผมสั้นเรียบ
- `feedback_video_ref_no_partial_override.md` — Video ref strict lock = all-or-nothing
- `ψ/lab/vdrama/seedance-oracle-workflow.md` — Oracle workflow doc
