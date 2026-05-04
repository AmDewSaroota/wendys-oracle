# Engenius — AI Storybook Video Project

## Overview
- สร้าง **AI animated storybook videos** สำหรับเด็ก
- สไตล์: Pixar-like 3D cartoon, baby characters, narration voiceover
- เครื่องมือ: **Nanobanana** (character/scene design) + **Seedance/Dreamina** (video gen)
- ไฟล์งาน: `E:\01_Work\_NDF\Enginius\`

## เรื่องแรก: The Three Little Pigs (~65s)
- 8 shots, narration style (คนเล่านิทาน + ภาพประกอบ)
- Seedance prompt: ภาษาจีน, No BGM, diegetic sounds only

### Characters — ครบแล้ว
| ชื่อ | บทบาท | ชุด | ตา | ไฟล์ |
|------|--------|-----|-----|------|
| Sunny | พี่คนโต | เสื้อเหลือง กางเกงส้ม หมวกฟาง | ฟ้า | `Sunny_1stpig.png` |
| Woody | พี่คนกลาง | เสื้อกั๊กเขียว กางเกงน้ำตาล ถือค้อน | เขียว | `Woody_2ndpig.png` |
| Brickie | น้องคนเล็ก | เอี๊ยมยีนส์ ผ้าพันคอแดง ถืออิฐ | น้ำตาล | `Brickie_3rdpig.png` |
| Big Bad Wolf | ตัวร้าย | เสื้อคลุมม่วงขาด ขนเทาเข้ม | เหลือง | `Big Bad Wolf.png` |
| Size Comparison | เปรียบเทียบ 3+หมาป่า | — | — | `Pig_Size comparison.png` |

### Scenes — ครบแล้ว
| # | ฉาก | ไฟล์ | หมายเหตุ |
|---|-----|------|----------|
| 1 | Countryside Road | `1stLoc_Countryside Road.png` | |
| 2 | Straw & Wood House (split) | `2ndLoc_Straw House & Wood House.png` | |
| 3 | Brick House Exterior | `3rdLoc_Brick House Exterior.png` | |
| 4 | Brick House Interior | `4thLoc_Brick House Interior.png` | |
| 5 | Master Shot 3 บ้าน (สมบูรณ์) | `5thLoc_3House.png` | ใช้เป็น position ref |
| 5u | Master Shot บ้านอิฐยังไม่เสด | `5thLoc_3House_Unfinish.png` | บ้านอิฐกำลังก่อสร้าง |
| 5f | Master Shot บ้านฟาง+ไม้พัง | `5thLoc_3House_Finished.png` | ฟาง+ไม้พัง, อิฐสมบูรณ์ |

### Shot Plan (~65s) — อัพเดทล่าสุด
| Shot | ชื่อ | เนื้อเรื่อง | วินาที | ฉากที่ใช้ | สถานะ |
|------|------|------------|--------|----------|-------|
| 1 | Shot 1 | หมู 3 ตัวออกเดินทาง | 7s | Countryside Road | ✅ prompt พร้อม |
| 2 | Shot 2 | สร้างบ้านฟาง + บ้านไม้ (finishing touches) | 10s | 3House_Unfinish | ✅ prompt พร้อม |
| 3 | Shot 3 | Brickie สร้างบ้านอิฐคนเดียว | 8s | 3House_Unfinish | ✅ prompt พร้อม |
| 3 MD | Shot 3 MD | Time lapse วัน→คืน→เช้า (transition) | 5s | 3House (สมบูรณ์) | ✅ prompt พร้อม |
| 3.5B | Shot 3.5B | หมาป่าแอบหลังต้นไม้ ย่องออกมา | 7s | 3House + ต้นไม้ | ✅ prompt พร้อม |
| 4 | Shot 4 | หมาป่าเป่า + หมูวิ่งเข้าบ้านอิฐ | 12s | 3House | ✅ prompt พร้อม |
| 5A | Shot 5A | หมาป่าเป่าบ้านอิฐไม่พัง ยอมแพ้ | 8s | 3House_Finished | ⚠️ เกือบได้ — บ้านพังยังไม่แสดง |
| 5B | Shot 5B | Happy Ending — Brickie ตรงกลาง พี่กอด | 8s | Brick House Interior | ✅ prompt พร้อม |

### Character Design Tips
- ต้องเจน **รวมแผ่นเดียว** ถ้าอยากให้สไตล์เดียวกัน
- keyword สำคัญ: `baby`, `toddler proportions`, `big head short legs`
- ผิวเรียบ: `smooth matte pink skin with no fur no hair`
- ห้าม: `medium build`, `confident smirk`, `tool belt` — ทำให้ดูแก่
- บ้านเล็ก: ใช้ `tiny`, `miniature`, `toy houses` — ห้าม `small houses` (ยังใหญ่)

### Seedance Prompt Style
- Seedance เจนได้สูงสุด **15 วินาที** ต่อคลิป
- ภาษาจีน 30-100 คำ
- เปิดด้วย style keywords: `3D卡通动画，皮克斯风格，儿童绘本，明亮日光。`
- @ ref ใช้ชื่อไทย — DewS แทน UUID เอง
- ปิดท้ายเสมอ: `无背景音乐。仅有[diegetic sounds]`

### ⚠️ Prompt Output Format (ห้ามเปลี่ยน)
- ฟอร์แมตการส่ง prompt ให้ DewS มีโครงสร้างตายตัว:

**1. คำอธิบาย** (bullet ภาษาไทย สั้นๆ ว่าเปลี่ยน/ทำอะไร)

**2. ชื่อชอท** (markdown header)

**3. Code block** — prompt พร้อมก้อป (plain text, ห้าม markdown ข้างใน)
  ```
  3D卡通动画，皮克斯风格，儿童绘本，明亮日光。
  @[เรฟไทย] — คำอธิบาย Chinese
  ...
  เนื้อหา paragraphs...
  全程明亮白天。
  无背景音乐。仅有[เสียง]。
  ```

**4. สิ่งที่แก้** — ตาราง | เดิม | ใหม่ |

**5. แนบรูป X รูป** — ตาราง | # | ไฟล์ | Role |

**6. หมายเหตุ** (ถ้ามี เช่น ชอทนี้ต่อเนื่องกับชอทไหน)

### Seedance Ref Strategy
- **Design ref**: แนบ individual character sheet + บอก `角色设计。严格参考外观。`
- **Size ref**: แนบ `Pig_Size comparison.png` + บอก `仅参考身高比例，不参考外观设计。`
- ระบุจำนวนตัวละครชัดเจนเสมอ: `画面中只有X个角色` (ป้องกัน duplicate)
- ระบุ clothing description เป็นภาษาจีนกำกับทุกตัว (ป้องกันสลับตัว)

### Seedance Lessons Learned
- **Action compression**: ใช้ `最后` (last) เพื่อให้แสดง finishing touches ไม่ใช่ full process
- **Negative instructions**: ใช้ได้กับเรื่องเฉพาะ เช่น `不是砌栅栏` / `不从侧面翻越栅栏`
- **Position matching**: ใช้ master shot ref ให้ตำแหน่งตรง หรือใช้ฉากที่มี position ในตัวอยู่แล้ว
- **Character duplication**: แก้ด้วย `画面中只有X个角色——不多不少`
- **Sky darkening**: ถ้าไม่อยากให้ฟ้ามืด ต้องบอก `全程保持明亮的白天`
- **Door animation**: ระบุให้ตัวละครเปิดประตูจากข้างใน ดีกว่าให้ประตูเปิดเอง
- **Destroyed buildings**: ต้องสร้าง ref image แยก (`5thLoc_3House_Finished.png`) ไม่ใช่แค่บอกในพรอมพ์
- **Wolf too big**: ต้องปรับใน ref image โดยตรง + บอก `严格按照此图的身高和体型比例`

## Notes
- อนาคตอาจทำเรื่องอื่นเพิ่ม
- Shot 5A: แอคชั่นหมาป่า (เป่า 2 รอบ, ท้อแท้, ถอนตัว) ดีมากแล้ว — ติดแค่บ้าน 2 หลังยังไม่พัง → แนบ `5thLoc_3House_Finished.png` แก้ได้
