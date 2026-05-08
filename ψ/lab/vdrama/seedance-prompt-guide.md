# Seedance 2.0 — Prompt Guide (DewS + WEnDyS)

**Updated**: 2026-04-04
**Project**: Dragon Game Cutscene (Fortal)
**Source**: Session learnings จากการทำจริง ไม่ใช่ทฤษฎี

## Quick Start
DewS สั่ง: **"มังกร"** หรือ **"Seedance"**
→ WEnDyS อ่านไฟล์นี้ + `seedance-cinematic-cutscene-research.md` แล้วพร้อมทำงานทันที

**API สั่ง**: **"xskill"** หรือ **"ยิง API"**
→ WEnDyS อ่าน `xskill-seedance-api.md` แล้วยิง API สร้างวิดีโอผ่าน xSkill.ai ได้เลย (ไม่ต้องเปิด Dreamina/Jimeng)

**กฎ**:
- **ใช้ภาษาอังกฤษแล้ว** (เปลี่ยนจากจีน, 2026-04-21) — ผ่าน Dreamina web UI
- ใช้ @[label] เมื่อแนบรูป reference — Dreamina จะ generate @ tag ให้
- แก้เป็นพาร์ทๆ ได้ (DewS อ่านอังกฤษออก ไม่ต้องให้ทั้งก้อนเหมือนตอนจีน)
- **Prompt format**: (1) ขึ้นชื่อ shot ก่อนเสมอ เช่น `## Shot 2_MD` (2) เว้นบรรทัดแบ่งโซน (3) ref ต้องมีคำอธิบายรูป เช่น `@รูป A — character sheet มังกร`
- Platform: **dreamina.capcut.com** — ใช้ Seedance 2.0 engine เดิม
- **Dreamina Plan**: ชั้นสูง (Advanced) รายปี ✅ — "AI" label มุมซ้ายบนปิดไม่ได้ (regulatory) → crop ใน post
- **ทุก prompt ต้องมี**: `No background music. Only diegetic sounds — dragon roars, wing beats, fire, wind, debris.` — ห้ามมี BGM เด็ดขาด, SFX มังกร/สิ่งแวดล้อมทำได้

---

## 1. Prompt Structure Template

```
[Style keywords — 1 บรรทัด]

[@ References — starting frame, video, character sheet]
[Camera lock level — เลือกระดับ]
[Handheld description]

[Character description — ต้นๆ prompt เสมอ!]
[Character expression/life]

[Action by timestamp — 0:00-0:02, 0:02-0:04...]

[Atmosphere — smoke, dust, particles, heat]
[Environment ref]

[Film look — DOF, motion blur, grain, ARRI, vignette]
```

### Word Count
- **Sweet spot: 30-100 คำจีน**
- เกิน 150 คำ → model สับสน
- ภาษาจีนทำงานดีกว่าภาษาอังกฤษ

---

## 2. Camera Lock Levels (สำคัญมาก!)

| ระดับ | คำจีน | ใช้เมื่อไหร่ | ผลลัพธ์ |
|-------|-------|-------------|---------|
| **90% lock** | 完全复制...仅允许改变：云雾形态、光影质感、手持摄影晃动 | ต้องการตรง playblast เกือบหมด | เหมือน preview + เพิ่ม cinematic |
| **Strict** | 严格参考...主体位置、大小和运动轨迹 | ล็อคแอคชั่น ปล่อยบรรยากาศ | ตำแหน่ง/ทิศทางตรง ref |
| **Medium** | 仅参考...构图和主体位置，不跟随镜头运动 | ต้องการ framing ใกล้เคียง แต่อิสระ motion | มุมกล้องคล้าย แต่ movement อิสระ |
| **Loose** | 松散参考...大致构图，不严格跟随 | อิสระมาก ref แค่คร่าวๆ | Seedance สร้างเกือบเอง |
| **No ref** | ลบ video ref ออก | ไม่ต้องการ playblast เลย | อิสระ 100% |

### เลือกยังไง
- มังกรพุ่งผิดทิศ? → เพิ่ม lock ขึ้น
- กล้องนิ่งเกินไป/ไม่มี handheld? → ลด lock ลง
- เหมือน preview เกินไป ไม่มี cinematic? → ลด lock ลง + เพิ่ม style keywords

---

## 3. สิ่งที่บอกชัดว่าเปลี่ยนได้

ถ้าใช้ 90% lock ต้องบอกชัดว่า **อะไรเปลี่ยนได้**:

```
仅允许改变：云雾形态、光影质感、手持摄影晃动。
```

ปรับตามชอท เช่น:
- เปลี่ยนเมฆ: 云雾形态
- เปลี่ยนแสง/texture: 光影质感
- เพิ่ม handheld: 手持摄影晃动
- เปลี่ยนไฟ: 火焰形态
- เพิ่ม FG particles: 前景粒子效果

---

## 4. Cinematic Elements Checklist

### DOF (ชัดตื้นชัดลึก)
| ระดับ | คำจีน |
|-------|-------|
| เบา | 浅景深 |
| หนัก | 极浅景深 |
| BG เบลอหนัก | 背景严重虚化几乎不可辨认 |
| เฉพาะจุด | 焦点仅锁定飞龙头部 (โฟกัสแค่หัวมังกร) |
| FG เบลอ | 前景龙翼大幅虚化为柔和色块 |

### Rack Focus (เปลี่ยนจุดโฟกัส)
```
0:00-0:02 聚焦飞龙
0:02-0:04 焦点猛烈拉至骑士铠甲细节，飞龙完全虚化为焦外光斑
0:04-0:06 焦点回到远去的飞龙
```
- ใช้ 焦点猛烈拉至 (ดึงโฟกัสแรง) ไม่ใช่แค่ 焦点转移 (เลื่อนโฟกัส)
- ต้องมี timestamp ชัดเจน

### Handheld
| ระดับ | คำจีน |
|-------|-------|
| เบา | 手持摄影轻微晃动 |
| ชัด | 手持摄影明显晃动，镜头呼吸感强烈 |
| ตามอารมณ์ | 镜头模拟恐惧的摄影师手持拍摄 |
| ตามระยะ | 飞龙远处时镜头平稳，飞龙逼近时镜头剧烈颤抖，飞龙远去后颤抖逐渐平息 |
| ห้ามนิ่ง | 绝非平滑稳定的CG摄影机 |

### Motion Blur
| ส่วน | คำจีน |
|------|-------|
| ทั้งตัว | 全身带有明显动态模糊 |
| ปลายปีก+หาง | 翼尖和尾部模糊最强 |
| ลำตัวด้วย | 躯干轮廓也带运动拖影 |
| ห้ามชัดนิ่ง | 绝非静止清晰的CG模型——必须像真实高速摄影捕捉到的运动物体 |
| ตึกถล่ม | 所有倒塌碎片带强烈动态模糊 |

### Film Look
```
胶片颗粒加重，ARRI色调，暗部深青蓝，火光浓烈暖橙，
镜头沾染烟灰微粒，画面边缘暗角。
```
- 胶片颗粒 = film grain (加重 = หนักขึ้น)
- ARRI色调 = ARRI color science
- 暗部深青蓝 = shadows เป็น teal
- 火光浓烈暖橙 = fire light เป็น warm orange
- 镜头沾染烟灰 = เลนส์เปื้อนเขม่า
- 画面边缘暗角 = vignette

### Atmosphere / FG
| Effect | คำจีน |
|--------|-------|
| ควันหนา | 浓烟弥漫遮挡视线 |
| เถ้า+ลูกไฟ | 火星余烬密集飘满画面 |
| ฝุ่นบังเลนส์ | 灰烬碎片紧贴镜头飞过，部分遮挡画面 |
| ความร้อนบิดอากาศ | 空气因高温扭曲变形，热浪蒸汽升腾 |
| เมฆบาง FG (วัดความเร็ว) | 前景始终有稀薄云雾丝带快速飘过镜头前方 |

---

## 5. Character Description Rules

### ตำแหน่งใน Prompt — ต้องอยู่ต้นๆ!
Seedance ให้ความสำคัญกับข้อความต้นๆ มากกว่าท้ายๆ
ถ้าใส่ description มังกรไว้ท้าย → model อาจไม่เห็น → ได้มังกรผิด

### มังกรตัวเดียว
```
画面中仅一条飞龙 (มีมังกรแค่ตัวเดียว)
```
ถ้าไม่ใส่ → Seedance อาจ gen มังกรซ้ำ 2 ตัว

### Character Sheet Reference
ถ้า character sheet เป็นรูปเดียวหลายมุม:
```
外观严格参考 @[character sheet มังกร]，保持一致。
```

ถ้าแยกเป็นหลายรูป:
```
外观严格参考 @[มังกร 1] 和 @[มังกร 2]：
```

### สีหน้า / ความมีชีวิต
```
飞龙有生命感——偶尔眨眼，喷火时眉骨紧皱，双眼凶狠怒视，
鼻孔扩张喷出热气，展现凶猛攻击性表情。
```

---

## 6. สิ่งที่ Seedance ทำไม่ได้ / ทำได้ไม่ดี

### ทำไม่ได้
| สิ่ง | ปัญหา | ทางออก |
|------|-------|--------|
| **ตึกหัก/แตก/ถล่ม** | ได้แค่ล้มพิงกัน | ให้ไฟ+ควันกลืนตึกแทน หรือทำ VFX ใน post |
| **ลบ artifact จาก playblast** (เส้น rig) | text สู้ video ref ไม่ได้ | แก้ที่ Maya — ซ่อน rig แล้ว export ใหม่ |
| **ศัพท์ render engine** | parallax, skybox, billboard, PBR, subsurface | ใช้คำ visual description แทน |

### ทำได้ดี
- ไฟ, ควัน, เถ้า, ฝุ่น, particles
- DOF, motion blur, film grain
- แสง/เงาตอบสนองกับไฟ
- เมฆเคลื่อนที่
- สีหน้า/กระพริบตา
- Handheld camera feel

### แทนตึกถล่ม ใช้:
```
建筑被烈焰完全吞噬，整片区域淹没在冲天火海中，
浓烟从火海中猛烈翻涌升腾，遮挡大半个画面，
建筑轮廓在火焰和浓烟中逐渐消失不见。
```
(ตึกถูกไฟกลืนหายไปในควัน แทนที่จะพังทลาย)

---

## 7. @ Reference — Thai Label Format

**ทำไมต้องใช้ภาษาไทย**: DewS อ่านจีนไม่ออก ใช้ @[ภาษาไทย] เพื่อให้รู้ว่าต้องแนบรูปอะไร

### ตัวอย่าง
```
@[วิดีโอ playblast] — วิดีโอ Maya camera path
@[character sheet มังกร] — รูปมังกรหลายมุม พื้นขาว
@[Image3.jpeg — ฉากท้องฟ้าเมฆครึ้ม] — ภาพเมฆ+ภูเขา
@[รูปเมืองไฟไหม้] — ref ฉากเมือง medieval ตอนไฟไหม้
@[เฟรมแรก] — ภาพที่อยากให้วิดีโอเริ่มต้นด้วย
```

### วิธีใช้ใน Seedance
1. พิมพ์ `@` ในช่อง prompt
2. Dropdown จะขึ้นมาให้เลือก asset (视频1, 图片1, 图片2...)
3. เลือกรูป/วิดีโอที่ตรงกับ label ไทย
4. Seedance จะใส่ UUID ให้อัตโนมัติ

### แปลชื่อจีนใน UI
- 视频 = Video
- 图片 = Image (รูป)
- ตัวเลข = ลำดับที่อัพโหลด

---

## 8. Common Problems & Solutions

| ปัญหา | สาเหตุ | แก้ |
|-------|--------|-----|
| มังกรพุ่งผิดทิศ/มาหน้าตรง | camera lock หลวมเกินไป | เพิ่ม lock: 严格参考 หรือ 完全复制 |
| เหมือน preview เป๊ะ ไม่มี cinematic | lock แน่นเกินไป (完全复制零偏差) | ลด lock + เพิ่ม 仅允许改变 |
| มังกรสีเทาแบนๆ | starting frame เป็น Maya render สีเทา | ลบ starting frame หรือใช้ภาพ stylized |
| ไฟเป็นทรงกระบอก | ตาม playblast + ไม่ได้บอกชัด | 火焰翻卷扩散如瀑布倾泻，绝非圆柱光束 |
| มังกรซ้ำ 2 ตัว | ไม่ได้จำกัด | 画面中仅一条飞龙 |
| เส้น rig ติดมา | อยู่ใน playblast | แก้ที่ Maya ซ่อน rig |
| เมฆหมุน spiral เหมือนน้ำ | ตาม playblast | 不是螺旋旋转——而是被冲击力撕开的真实云雾 |
| ทุกอย่างชัดหมด ไม่มี depth | ไม่ได้บอก DOF | 极浅景深 + FG/BG 虚化 |
| ไม่มี motion blur | ไม่ได้บอก | 全身带有明显动态模糊 |
| handheld ไม่รู้สึก | lock แน่นเกินไป ขัดกับ handheld | ลบ 镜头锁定 + เพิ่ม 明显晃动 |
| กล้อง burst zoom | ไม่ได้ห้าม | 镜头全程匀速平滑移动，禁止突然变速或急速推拉 |

---

## 9. Style Keywords (บรรทัดแรกของ prompt)

### Game Cinematic
```
游戏CG过场动画，电影级真实感，史诗黑暗奇幻。
```

### Transform จาก 3D Preview
```
将3D预览转化为照片级电影画面。
```
(ใช้เมื่อ output ออกมาเหมือน preview เกินไป — แต่อาจกินคำเปล่าๆ ถ้ามี style keywords แล้ว)

---

## 10. Negative Prompts / ห้าม

### ใช้แบบ positive ดีกว่า negative
- **ไม่ดี**: 不得变形，不得滑动，不得漂浮 (ห้ามนู่นห้ามนี่)
- **ดี**: 保持一致 (รักษาความสม่ำเสมอ) — บอกสิ่งที่อยากได้

### ยกเว้นบางอันที่ต้องห้ามตรงๆ
- 绝非圆柱光束 (ไฟห้ามเป็นแท่ง) — ได้ผลเพราะเป็นปัญหาเฉพาะ
- 不是螺旋旋转 (เมฆห้ามหมุน spiral) — ได้ผลเพราะชี้เฉพาะ
- 绝非平滑稳定的CG摄影机 (ห้ามกล้องนิ่งเหมือน CG) — ได้ผล

### สิ่งที่เขียน "ห้าม" แล้วไม่ได้ผล
- ห้ามมีเส้น rig → ไม่ได้ผล (ต้องแก้ที่ source)
- ห้ามตึกล้มเฉยๆ → ไม่ได้ผล (Seedance ทำ destruction ไม่ได้)

---

## 11. ให้ Prompt เต็มเสมอ!

**DewS อ่านจีนไม่ออก** → ทุกครั้งที่แก้ prompt ต้องเอา **prompt เต็มทั้งก้อน** มาให้
ห้ามบอกแค่ "เปลี่ยนบรรทัดที่ 3" เพราะเสี่ยงก๊อปผิด

---

## 12. Video Ref — เมื่อไหร่ใช้ได้ / ใช้ไม่ได้ (Session 2026-04-04)

### ❌ Playblast ที่ใช้เป็น video ref ไม่ได้
| ลักษณะ | ปัญหา | ทางออก |
|--------|-------|--------|
| **พื้นหลังเรียบ/ฟ้าเปล่า** | Seedance ไม่รู้ว่ากล้องอยู่ไหน มังกรทำอะไร | ทิ้ง video ref → ใช้ text + image ref แทน |
| **มี geometry mockup** (ลูกกลม/แท่ง) | Seedance ก๊อป geometry มาเป็นไฟ | เพิ่ม `视频中所有球形和柱形色块均为火焰特效占位，必须全部转化为真实自然的火焰，不保留任何几何形状` |
| **เมฆเป็น geometry** | ล็อคมังกร = ได้เมฆ geometry ติดมา | ทิ้ง video ref → ปล่อย Seedance ทำเมฆเอง |

### ✅ Playblast ที่ใช้เป็น video ref ได้
- มี silhouette ชัดเจน + background ที่ Seedance เข้าใจ (ตึก, ไฟ)
- ตัวอย่าง: Shot 9, 10 (มังกรบินเหนือเมือง — มีตึก ไฟ รูปปั้น เป็นจุดอ้างอิง)

### 🔑 กฎสำคัญ
- **Video ref ล็อคทุกอย่างพร้อมกัน** — แยกล็อคมังกร vs ปล่อยเมฆ ไม่ได้
- **`完全复制` บน playblast abstract = style transfer** — Seedance เอา preview มาเฟดทับ ไม่ตีความ
- **Geometry mockup เป็นพิษ** — พอมีวงกลม ไฟปากก็กลับเป็นแท่งด้วย (ลามทั้งคลิป)
- **Image ref แทน video ref ได้** — รูปเดียวบอก composition + ท่า + atmosphere ดีกว่า playblast abstract

---

## 13. Prompt Conflicts — สิ่งที่ห้ามใส่ด้วยกัน (Session 2026-04-04)

| Conflict | ทำไมตีกัน | แก้ |
|----------|-----------|-----|
| `完全复制` + `明显晃动` (handheld ชัด) | ล็อคกล้อง vs เขย่ากล้อง | ลด handheld เป็น `轻微晃动` เมื่อ lock แน่น |
| Text action + Video ref (สำหรับสิ่งเดียวกัน) | Seedance งง เลือกอันไหน | เลือกอันเดียว: text หรือ video ref |
| `极浅景深` + ไฟ/เมืองใน background | DOF เบลอจนไฟหาย | เพิ่ม `虽然虚化，但橙色火光和浓烟必须清晰可见` |
| `极浅景深` + `远景` | DOF ตื้นกับวัตถุไกลไม่เมคเซนส์ | ลบ DOF หรือเปลี่ยนระยะ |
| Camera direction text ผิดจาก ref | เขียน `仰拍` ทั้งที่ ref เป็น `水平` | ต้องดู playblast ก่อนเขียน camera direction |
| `画面边缘暗角` (vignette) | ขอบดำรอบเฟรม อาจไม่ต้องการ | ลบถ้าไม่ต้องการ |

---

## 14. เมฆ — ปล่อยอิสระดีกว่า (Session 2026-04-04)

- **Seedance ทำเมฆเองสวยกว่าบังคับ** — timestamp บรรยายเมฆคร่าวๆ พอ ไม่ต้องละเอียด
- ถ้าใช้ video ref → เมฆจะถูกก๊อปจาก playblast (ซึ่งเป็น geometry ไม่สวย)
- **วิธีที่ดีที่สุด**: ไม่มี video ref + timestamp บรรยายแค่ mood ของเมฆ + ปล่อย Seedance สร้างเอง
- ถ้าต้องการ cloud wake (เมฆถูกดึงตามมังกร) → ใช้ `身下云雾被飞行力量向上拉扯牵引`

---

## 15. ตึกไหม้/ถล่ม — เทคนิคใหม่ (Session 2026-04-04)

### ตึกไหม้เหลือโครง (ได้ผลดี!)
```
多栋建筑被烧得仅剩木质骨架，骨架在火中发光
```

### ฝุ่นจากตึกถล่ม
```
浓烟和巨大灰色尘雾从倒塌处猛烈翻涌升腾
```

### DOF + ไฟเมือง (ต้องบอกชัดว่าไฟต้องเห็น)
```
背景城市虽然虚化，但密集的橙色火光和浓烟必须清晰可见，
整个背景呈现为跳动的火焰光斑和翻滚烟雾。
```

### ระเบิด (ห้ามทรงกลม)
```
爆炸效果参考 @[ภาพระเบิดไฟแตกกระจาย]：
火焰向外猛烈扩散爆裂，碎片四处飞溅，绝非静止球形。
```

---

## 16. Shot Catalog — Fortal Dragon Cutscene

### Shot 1 — มังกรทะลุเมฆ (มุมข้าง)
- **กล้อง**: ระดับเมฆ มองด้านข้าง (水平视角远景)
- **แอคชั่น**: มังกรพุ่งตั้งตรงทะลุเมฆขึ้น อยู่ขวาภาพ
- **Video ref**: ❌ ไม่ใช้ (playblast abstract เกินไป)
- **Image ref**: ภาพบรรยากาศ + ภาพมังกรพุ่งเหนือเมฆ + character sheet
- **สถานะ**: รอทดสอบ

### Shot 2 — มังกรพุ่งขึ้นเหนือเมฆ (มุมแหงน)
- **กล้อง**: แหงนมองขึ้น (低角度仰拍)
- **แอคชั่น**: มังกรพุ่งขึ้นแนวตั้ง → ถึงจุดสูงสุด → เปลี่ยนท่าเป็นบินขนาน
- **Video ref**: ❌ ไม่ใช้
- **Image ref**: ภาพมังกรพุ่งเหนือเมฆ + character sheet
- **หมายเหตุ**: เฟรมสุดท้ายต้องบินขนานแล้ว เพื่อต่อ Shot 3
- **สถานะ**: ผลออกมาใช้ได้ แก้ transition แล้ว

### Shot 9 — มังกรพ่นไฟเผาเมือง (มุมหลังมังกร)
- **กล้อง**: มองข้ามหลังมังกร ลงเมือง (俯瞰)
- **แอคชั่น**: มังกรบินพ่นไฟ เห็นเมืองไหม้ข้างล่าง
- **Video ref**: ✅ ใช้ (มีตึกเป็นจุดอ้างอิง)
- **Image ref**: character sheet + เมืองไฟไหม้ 2 รูป
- **ปัญหาเดิม**: เมืองไม่ลุกไหม้พอ → แก้แล้ว
- **สถานะ**: ยืนยันแล้ว

### Shot 10 — มังกรบินผ่านรูปปั้นอัศวิน + นักรบวิ่งหนี
- **กล้อง**: ระดับพื้น มุมต่ำ
- **แอคชั่น**: มังกรพ่นไฟ → ไฟผลักรูปปั้นล้ม (rack focus) → ตึกไหม้เหลือโครง + ฝุ่น
- **Video ref**: ✅ ใช้ (Medium lock — `仅参考构图和主体位置`)
- **Image ref**: character sheet + เมืองไฟไหม้ 2 รูป + ภาพระเบิด
- **ปัญหาเดิม**: geometry mockup เป็นพิษ / ขอบดำ / ตึกล้มหาย / เกราะโลว์โพลี
- **สถานะ**: แก้แล้ว รอทดสอบ

### Shot 3-5, 7-8, 11-16
- **สถานะ**: ❌ ยังไม่ได้ทำ

### Shot 6 — มังกรร่อนลง + transform + พ่นไฟ (มุมเงย)
- **กล้อง**: เงยหน้ามองขึ้น (低角度仰拍) — ฉากหลังเป็นท้องฟ้าเมฆ ไม่ใช่เมือง
- **แอคชั่น**: มังกรร่อนลง → เกร็ง → transform จากร่างปกติ(图片4)เป็นร่างไฟ(图片1) → พ่นไฟ
- **Video ref**: ✅ ใช้ (Strict lock — `严格模仿`)
- **Image ref**: มังกรร่างปกติ + มังกรร่างไฟ + เมือง medieval
- **Client feedback (2026-04-20)**: ชอบ transformation, อยากเปลี่ยนท่าพ่นไฟจากเอียงซ้าย → โก่งคอพ่นใส่กล้อง
- **Strategy**: ใช้ `唯一修改` override เฉพาะท่าพ่นไฟ ไม่ลด lock level
- **สถานะ**: แก้ prompt แล้ว รอทดสอบ

---

## 17. Video Ref Lock = All-or-Nothing (UPDATED 2026-05-08 — เก่าผิด)

> ⚠️ **อัปเดตจากประสบการณ์จริง (DewS, 2026-05-08)**: section นี้เคยเขียนไว้ตอน 2026-04-20 ว่า `唯一修改` / `ONLY MODIFY:` "ใช้ได้" แต่**ในทางปฏิบัติมันเฟลเสมอ** — Seedance ตีความ override ไม่สม่ำเสมอ ผลส่วนใหญ่ไม่ตรง prompt
> ดู feedback memory: `memory/feedback_video_ref_no_partial_override.md`

### ปัญหา
ต้องการเปลี่ยนแค่ 1 แอคชั่นใน shot ที่ใช้ video ref strict lock

### ❌ ทุกวิธี "เจาะรู" เฟลในทางปฏิบัติ

**❌ ลด lock level**
```
参考...但不严格跟随主体动作
```
→ Seedance เปลี่ยน**ทุกอย่าง** — มุมกล้อง ฉากหลัง composition หลุดหมด

**❌ Strict lock + 唯一修改 (เคยเขียนว่าใช้ได้ — ไม่จริง)**
```
严格模仿 @[视频] 的全部镜头运动和时间节奏。
唯一修改——[ส่วนที่เปลี่ยน]不跟随预览：[description ใหม่]
```
→ Seedance ignore override บ่อย ผลออกมาแค่ตาม video ref เฉย ๆ หรือ random

### ✅ ทางที่ใช้ได้จริง — เลือก 1 ใน 3

1. **Regenerate full prompt** — ทิ้ง video ref ใช้ image refs + text แทน → ปล่อย AI สร้างใหม่หมด
2. **Accept video ref ตามเดิม** — ทำงาน VFX/composite ใน post production
3. **Iterate + best-of-N** — เจน 5-10 ครั้ง pick ที่ดีที่สุด ยอมรับ ~70% ตามใจ

### กฎใหม่
- Video ref strict lock = **all-or-nothing เด็ดขาด** — ไม่มีทางเจาะรู
- ห้ามแนะนำ user ว่า `ONLY MODIFY:` / `唯一修改` "ได้ผล" — มันมักจะเฟล
- อยากเปลี่ยน 1 จุด → restart full prompt

---

## 18. Intensity Scale — ต้องเขียนเกินจริง (Session 2026-04-20)

Seedance ตอบสนองต่อ intensity ต่ำกว่ามนุษย์:

| อยากได้ | เขียนแล้วไม่พอ | ต้องเขียน |
|---------|---------------|-----------|
| กางปีกเร็ว+แรง | `瞬间爆发式展开` | `猛然炸开，像弹簧瞬间释放，骨架撑开时翼膜猛烈绷紧震颤` |
| มีจังหวะหยุดก่อน action | (ไม่ได้เขียน) | `急停顿挫` (หยุดชะงัก) |
| แรงกระทบ | `冲击力震散云雾` | `冲击力震散周围云雾形成可见气浪，空气被翼展撕裂` |

**กฎ: ถ้าอยากได้ 7/10 ต้องเขียน 10/10**

---

## 19. Prompt Writing Style — DewS Approved (2026-04-24)

**ทุก session ต้องเขียน prompt สไตล์นี้ ห้ามเปลี่ยน**

### โครงสร้าง
1. **บรรทัดแรก**: Style keywords 1 บรรทัด — `Game CG cutscene cinematic, photorealistic film-quality, epic dark fantasy.`
2. **@ refs รวมกลุ่มข้างบน** — แต่ละตัว 1 บรรทัด ตามรูปแบบมาตรฐาน (ดูข้างล่าง)
3. **เว้นบรรทัดแบ่งโซน** — ref / scene / action / film look / sound แยกกันชัด ไม่อัดก้อนเดียว
4. **Diegetic sounds ปิดท้ายเสมอ** — `No background music. Only diegetic sounds — [เสียงที่เข้ากับ shot]`

### @ Ref Naming — รูปแบบมาตรฐาน

**Format**: `@[ชื่อไทยบรรยาย] — [Role]. [ลักษณะสั้นๆ].`

ใช้ชื่อไทยที่อ่านปุ๊บรู้เลยว่าต้องแนบรูปอะไร — DewS แทนด้วย UUID เองตอนวางใน Dreamina

| Role (เลือก 1) | ใช้เมื่อ | ตัวอย่างเต็ม |
|----------------|---------|----------|
| **Dragon character sheet** | character sheet มังกร (ร่างเดียว) | `@[มังกร charsheet] — Dragon character sheet, strictly reference for appearance.` |
| **Dragon [FORM] form** | มี 2+ ร่าง ต้องแยก | `@[มังกรร่างไฟ] — Dragon GLOW battle form. Black scales, magma veins.` |
| **Composition reference** | ล็อค framing/มุมกล้อง | `@[เฟรมแรก สีส้ม] — Composition reference. Low angle, dark sky.` |
| **Atmosphere reference** | ล็อค mood/สี/แสง | `@[บรรยากาศเมฆ] — Atmosphere reference. Dark storm clouds, orange glow.` |
| **Starting frame** | ล็อคเฟรมแรก | `@[เฟรมแรก Shot07] — Starting frame. Dragon from behind, wide shot.` |
| **Framing guide** | ล็อคแค่ scale ไม่ล็อคมุม | `@[เฟรมมิ่ง closeup] — Framing guide only. Dragon fills frame at this scale.` |
| **Near-end reference** | แนวทางช่วงท้าย (หลวม) | `@[เฟรมท้าย Shot07] — Loose guide for near-end framing only.` |

**กฎ**:
- **ชื่อไทยต้องบรรยายรูป** — อ่านแล้วรู้ทันทีว่าแนบรูปอะไร (ห้ามใช้ รูปภาพ1, รูปภาพ2)
- ใช้ชื่อ role **เดิมทุก shot** — ห้ามสลับคำ (เช่น ห้ามเปลี่ยน "character sheet" เป็น "appearance ref")
- ถ้ามังกรมีร่างเดียว → ใช้ `Dragon character sheet` เสมอ
- ถ้ามังกรมี 2 ร่าง → ใช้ `Dragon NORMAL form` / `Dragon GLOW battle form`
- ลักษณะสั้นๆ หลัง role = **key visual cues** ไม่ใช่พรรณนายาว

### น้ำเสียง
- **Attitude-driven** — ใช้ simile/metaphor: "like a raptor diving", "like a rooster before crowing"
- **สั้น กระชับ** — ไม่ over-describe mechanics, ไม่พรรณนาทุก frame
- **Film terms ตรงๆ** — DOF, ARRI tone, handheld tremor, motion blur, film grain
- **ห้ามเฉพาะจุด** — "NOT blue sky", "NOT a solid beam" ใส่ตรงที่เกี่ยวข้อง ไม่ทำเป็นลิสต์ห้ามยาว
- **ไม่ใช้ timestamp** — ปล่อย Seedance จังหวะเอง (ยกเว้น rack focus)

### ห้ามทำ
- ❌ เขียน mechanics ยาว (กล้ามเนื้อไหล่หด ข้อศอกงอ ปลายปีกยกขึ้น...)
- ❌ ลิสต์ negative ยาวเหยียด (NEVER this, NEVER that, DO NOT...)
- ❌ ใส่ทุกรายละเอียดจนเกิน 150 คำ
- ❌ เปลี่ยนสไตล์ข้ามเซสชั่น

### ตัวอย่างที่ดี vs ไม่ดี

**ดี** (attitude-driven):
```
Dragon rushes toward the left of frame with urgent purpose — like a predator racing to its destination.
```

**ไม่ดี** (mechanical):
```
Dragon moves its wings up and down while flying horizontally toward the left side of the frame at moderate speed.
```

---

## 20. Reference Images (Fortal Project)

### Shot 3 (มังกรบินกลางฟ้า)
- `E:\01_Work\_NDF\Fortal\Shot3\Image2.png` — Character sheet มังกร
- `E:\01_Work\_NDF\Fortal\Shot3\Image3.jpeg` — ฉากท้องฟ้าเมฆครึ้ม
- `E:\01_Work\_NDF\Fortal\Shot3\Image01.png` — Final composite
- `E:\01_Work\_NDF\Fortal\Shot3\Shot3.mp4` — Playblast

### เมืองไฟไหม้
- รูปเมืองตอนไฟไหม้ (ใช้รูปนี้ ไม่ใช้รูปเมืองสงบ — เสี่ยง Seedance ทำเมืองสงบ)

### Character Sheet
- มังกรหลายมุมบนพื้นขาว (front, top, side, flying + details: head, eye, claws, wing, spines)
- สีเทาเข้ม เกล็ดเกราะ ปีกค้างคาว เส้นเลือดแดงบนปีก ตาสีอำพัน
