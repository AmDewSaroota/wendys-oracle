---
installer: oracle-skills-cli v1.5.36
name: shot
description: เจน prompt ภาพ/วิดีโอแบบมาตรฐาน พร้อม tool label และ summary block. Use when user says "shot", "เจนพร้อมพ์", "ขอพร้อมพ์", "prompt ชอท", "ทำพร้อมพ์", or asks to generate an image/video prompt for any project.
---
installer: oracle-skills-cli v1.5.36

# /shot — Prompt Generator

เจน prompt ภาพ/วิดีโอพร้อมใช้งานทันที ทุกงาน ทุก tool — พร้อม format มาตรฐานและ summary block เสมอ

## Usage

```
/shot [รายละเอียด shot ที่ต้องการ]
```

## Tools ที่รู้จัก

| Tool | ใช้ทำอะไร |
|------|----------|
| **Higgsfield** | Storyboard still / Character ref / Setting ref |
| **Dreamina** | Video generation (primary) |
| **Jimeng** | Video/Image generation (สลับกับ Dreamina) |
| **Seedance** | Video generation (API / xskill) |

## Output Format (บังคับทุกครั้ง)

### หัวข้อ prompt

```
[ชื่อ Shot/Ref] — [ประเภท] ([Tool])
```

ตัวอย่าง:
- `Shot 3a — Storyboard (Higgsfield)`
- `Shot 1 — Video (Dreamina)`
- `CharBoyNeat — Character ref (Higgsfield)`
- `REFBooth — Setting ref (Higgsfield)`
- `Dragon Shot 6 — Video (Seedance)`

### Prompt body

เขียน prompt ภาษาอังกฤษในช่อง code block

### Summary block (ต่อท้ายทุกครั้ง)

```
---
🎬 [ชื่อ Shot] — [ประเภท] ([Tool])
Type: ภาพนิ่ง  หรือ  คลิป Xs
Refs: @[ref1] @[ref2]  (ถ้าไม่มี ref ให้ระบุ "ไม่มี")
เปลี่ยนจากก่อนหน้า: [สรุปสิ่งที่เปลี่ยน หรือ "shot ใหม่" ถ้าเป็นครั้งแรก]
```

## กฎบังคับ

- **ระบุ tool ในหัวข้อเสมอ** — ทุกงาน ไม่มีข้อยกเว้น
- **ห้ามรวมหลาย shot ในครั้งเดียว** — 1 /shot = 1 prompt
- **prompt ภาษาอังกฤษเสมอ**
- **ถ้าเป็นวิดีโอ ต้องระบุความยาว** (วินาที) ใน summary
- **summary block ต้องอยู่ท้ายเสมอ** — ห้ามข้าม

## ตัวอย่าง Output เต็ม

**Shot 3a — Storyboard (Higgsfield)**

```
Cinematic still photograph, real footage aesthetic, VR booth lighting.

@[CharBoyNeat] — Match face, build, hair, and uniform exactly.
@[Booth] — Match booth design, layout, and lighting exactly.

The boy steps into the booth from the side...
[prompt body]

ARRI tone, cool blue LED + warm overhead. 35mm lens. Subtle film grain.
```

---
🎬 Shot 3a — Storyboard (Higgsfield)
Type: ภาพนิ่ง
Refs: @[CharBoyNeat] @[Booth]
เปลี่ยนจากก่อนหน้า: shot ใหม่ — เพิ่ม staff ยื่น headset ให้เด็ก

---
installer: oracle-skills-cli v1.5.36