# VDrama — Style Reference

**Source**: Facebook Reel `https://www.facebook.com/reel/1306144098064210`
**Analyzed by**: Gemini (2026-04-01)
**Note**: ลูกค้าชอบสไตล์นี้ — ใช้เป็น reference หลักสำหรับโปรเจค

---

## 1. โทนสี (Color Grading)

- **Film Look** — Color Palette เลียนแบบฟิล์ม เน้น **Teal & Orange** บางๆ
  - Shadow → สีฟ้าอมเขียว
  - Skin tone → สีส้ม
  - ภาพดูมีมิติและคลาสสิก
- **Greenish/Muted Tone** — โทนเขียวอมเหลืองจางๆ → ความทรงจำ/Nostalgia อบอุ่นปนเศร้า
- **High Contrast & Soft Highlight** — แสงเงาชัด แต่ highlight นุ่มนวล ไม่แข็ง

### Seedance Keywords
- `电影胶片质感` (film texture)
- `青橙色调` (teal & orange)
- `柔和高光` (soft highlight)
- `怀旧色彩` (nostalgic color)

---

## 2. มุมกล้อง (Camera Angles) & เลนส์

- **Eye Level & Low Angle** — กล้องระดับสายตาหรือต่ำกว่า → เข้าถึงมุมมองตัวละคร
- **Shallow Depth of Field** — รูรับแสงกว้าง (F-stop ต่ำ) → ฉากหลังละลาย (Bokeh) → ดึงความสนใจไปที่ตัวละคร
- **Macro/Close-up** — เจาะนิ้วมือ แววตา → ถ่ายทอดอารมณ์ละเอียด

### Seedance Keywords
- `85mm镜头` / `100mm微距` (macro)
- `浅景深` (shallow DOF)
- `平视角度` (eye level)
- `低角度` (low angle)

---

## 3. การเคลื่อนกล้อง (Camera Movement)

- **Static** (นิ่ง) — เป็นหลัก เน้นอารมณ์ตัวละคร
- **Slow Push-in** — ค่อยๆ เคลื่อนเข้าหาตัวละคร → เพิ่มความกดดัน/สำคัญ
- **Tracking Shot** — กล้องเคลื่อนตาม (follow) ไปด้านข้าง
- **Handheld/Organic Motion** — เคลื่อนไหวธรรมชาติเล็กน้อย ดูเหมือนเรื่องจริง

### Seedance Keywords
- `固定镜头` (static)
- `缓慢推进` (slow push-in)
- `跟拍` (tracking)
- `手持摄影轻微晃动` (handheld organic motion)

---

## 4. จังหวะตัดต่อ (Cutting Rhythm) & Transition

- **Slow Pacing** — จังหวะช้า ปล่อยภาพเล่าอารมณ์ (let the shot breathe)
- **Hard Cut** — ตัดตรงไปตรงมาเป็นหลัก
- **Match Cut (Thematic)** — ตัดสลับสิ่งของที่เชื่อมโยงเชิงสัญลักษณ์

### สำหรับพร้อมท์ Seedance
- ใช้ Hard Cut เป็นหลัก ไม่ต้อง dissolve/fade
- ถ้ามี symbolic connection ระหว่าง 2 ช็อต → ตัดสลับเหมือน match cut

---

## 4.1 Prompt Format — Timestamp (มาตรฐานล่าสุด)

ใช้ format timestamp-based แยกช็อตตามเวลา (เรียนรู้จาก Friday Oracle):

```
这是角色位置、场景和接下来将要发生的事件的参考

0:00-0:04 : @REF_ID(ชื่อ – action ภาษาไทย) [lens] [shot type]，[action จีน] "[บทพูดไทย]"

0:04-0:06 : @REF_ID(ชื่อ – action) → (ชื่อ2 – action) [lens] [shot type]，[action จีน]

...

no background music
no grid lines
no overlay
no mesh
cinematic professional camera language
```

### กฎ Format:
1. **เปิดด้วย** `这是角色位置、场景和接下来将要发生的事件的参考` (บอก Seedance ว่านี่คือ ref ของตำแหน่ง/ฉาก/เหตุการณ์)
2. **Scene ref** ใส่บรรทัดถัดมา `@SCENE_REF นี่คือ ref ของ [คำอธิบายฉาก]` — อัพรูปฉากแยกต่างหาก
3. **แต่ละ shot** = 1 บรรทัด มี timestamp `0:00-0:04`
4. **Ref ตัวละคร** = `@UUID(ชื่อENG – action ไทย)` — UUID จะได้ตอนอัพรูปใน Seedance
5. **เปลี่ยนตัวละคร** ในช็อตเดียว ใช้ `→`
6. **เลนส์ + shot type** ระบุต่อจาก ref
7. **บทพูดไทย** ใส่ในเครื่องหมาย `""`
8. **Negative prompts** แยกบรรทัดละคำที่ท้ายสุด
9. **ไม่ใช้** `切换`/`切回`/`最后` — timestamp ทำหน้าที่แทนแล้ว

---

## 5. แสง (Lighting)

- **Naturalistic Light** — แสงธรรมชาติ ส่องจากหน้าต่าง/ประตู
- **Golden Hour** — แสงอุ่นจากดวงอาทิตย์ยามเย็น → ความหวัง/เริ่มต้นใหม่
- **Chiaroscuro** (Light & Shadow) — มืดสว่างตัดกันชัด → บรรยากาศขลัง มีความเป็นมนุษย์

### Seedance Keywords
- `自然光线` (natural light)
- `窗户光` (window light)
- `黄金时刻` (golden hour)
- `明暗对比` (chiaroscuro)

---

## 6. Mood & Tone

- **Bittersweet** — เศร้าที่งดงาม (สูญเสีย + ความเมตตา)
- **Innocence** — ความไร้เดียงสา
- **Nostalgic & Emotional** — ทรงจำ อารมณ์ลึก

### Seedance Keywords
- `电影级氛围` (cinematic atmosphere)
- `情感细腻` (delicate emotion)
- `温暖又忧伤` (warm yet melancholic)

---

## 7. ปรับจาก Reference → สไตล์ VDrama (ดราม่าน้ำเน่า)

| สไตล์ Reference (หนังสั้นซึ้ง) | ปรับสำหรับ VDrama |
|:---|:---|
| Slow Pacing ตัดช้า ปล่อยซึมซับ | **ตัดเร็วกว่า** — ดราม่าต้อง pace เร็ว ตรึงคนดูไว้ ไม่งั้นปัดผ่าน |
| Bittersweet เศร้านุ่มนวล | **อารมณ์จัดกว่า** — ตกใจ เจ็บ โกรธ ดูถูก ต้องชัดเจน |
| Static นิ่งเป็นหลัก | **เคลื่อนกล้องมากกว่า** — tracking / push-in เร็วขึ้น สร้าง tension |
| Muted/Nostalgic โทนจางๆ | **คอนทราสต์สูงกว่า** — หรูต้องหรูจัด จนต้องจน ชัดเจน |

**สิ่งที่เก็บไว้ใช้ได้เลย:** Shallow DOF 85mm, Teal & Orange, Hard Cut, Chiaroscuro

---

## 8. ข้อห้าม — CU ที่ลูกค้าไม่ชอบ (สำคัญมาก!)

**ลูกค้า reject CU แบบนี้แล้ว:**
- หน้าเต็มเฟรม เหมือนถ่ายพาสปอร์ต/ถ่ายบัตรประชาชน
- กล้องนิ่งตาย ไม่มีชีวิตชีวา
- ไม่มี headroom (ที่ว่างเหนือหัว)
- ไม่เห็นบรรยากาศรอบตัวเลย
- ดู AI-generated ชัดเจน

**CU ที่ถูกต้อง — ต้องเหมือนคนจริงถ่าย:**
- เห็น**ไหล่/คอ/บ่า**ด้วย ไม่ใช่แค่หน้า
- มี **headroom** (ที่ว่างเหนือหัว)
- ตัวละคร **เยื้องจากกึ่งกลาง** (rule of thirds)
- พื้นหลัง **เบลอแต่ยังเห็นบรรยากาศ** (โบเก้ไม่ blur สนิท)
- กล้อง **ไหวนิดๆ** ตามธรรมชาติ (handheld organic)
- แสง **ตกกระทบข้างเดียว** ไม่ใช่สว่างเท่ากันทั้งหน้า

### Seedance Keywords สำหรับ CU ที่ถูกต้อง
- `半身特写` (half-body close-up — เห็นไหล่)
- `三分构图` (rule of thirds)
- `头部留白` (headroom)
- `背景虚化但可见环境` (background blurred but environment visible)
- `手持摄影轻微晃动` (handheld slight motion)
- `侧面光线` (side lighting)
- `真实电影摄影风格` (realistic cinematography style)

---

## สรุป — สไตล์หลักที่ต้องใช้ในพร้อมท์

```
cinematic live-action video，Netflix 原创剧集质量，
电影胶片质感，青橙色调，浅景深，
自然光线，明暗对比，情感细腻，
```

ใส่ต้นทุกพร้อมท์เพื่อให้ได้โทนตาม reference นี้

### Negative Prompt — ใส่ท้ายทุกพร้อมท์เสมอ!

```
no background music no grid lines no overlay no mesh cinematic professional camera language
```

ป้องกัน: เพลงประกอบที่ไม่ต้องการ, เส้นกริด, overlay ซ้อนทับ, mesh/ตาราง

---

## 9. Visual Motif — น้ำท่วมขัง/โคลน (สำคัญมาก!)

ชื่อเรื่อง **"วิวาห์โคลน"** — น้ำท่วมขังเป็น key visual ของเรื่อง ต้องมีทุกฉากนอกบ้าน

**ต้องเขียนในพร้อมท์ทุกช็อตที่เห็นพื้น:**
- `地面大面积积水` (พื้นน้ำท่วมขังเป็นวงกว้าง)
- `积水反射灯光和人影` (น้ำสะท้อนแสงไฟ+เงาคน)
- `雨水不断落在积水上形成涟漪` (ฝนตกลงบนน้ำขังเป็นระลอกคลื่น)
- `泥泞地面` (พื้นเฉอะแฉะ/โคลน) — ใช้ในฉากที่ต้องการ

**เหตุผลเชิงเรื่อง:** น้ำขัง/โคลน = สัญลักษณ์ของชีวิตสิงหาที่ถูกเหยียดหยาม ยิ่งน้ำเยอะยิ่งเน้นความต่างชนชั้น

---

## Reference Video
- URL: https://www.facebook.com/reel/1306144098064210
- แนว: Cinematic Storytelling / Nostalgic & Emotional
- เหมาะกับ: งานโฆษณา CSR / หนังสั้นเรียกน้ำตา
- เรฟเป็นกล้องแนวนอน — โปรเจค vdrama ต้องทำเป็น**แนวตั้ง 9:16**
