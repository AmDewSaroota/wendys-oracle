# Seedance 2.0 — Cinematic Game Cutscene Research

**Date**: 2026-04-02
**Project**: Dragon Cutscene (มังกรพ่นไฟเผาหมู่บ้าน)
**Goal**: Consistency ทุกตัวละคร/prop/ฉาก + ใช้ 3D Maya previz เป็น guide

---

## 1. @ Reference System — หัวใจของ Consistency

Seedance 2.0 ใช้ระบบ `@Tag` เพื่อ lock identity ของตัวละคร/prop/ฉาก

### Capacity ต่อ 1 clip
| Type | Max | ใช้ทำอะไร |
|------|-----|-----------|
| **Images** | 9 | Character ref, prop ref, environment ref |
| **Videos** | 3 | Motion guide, camera movement, 3D previz |
| **Audio** | 3 | SFX, ambience |
| **รวม** | **12 assets** | ต่อ 1 generation |

### วิธีใช้ @ Tag
```
@Image1 ใช้เป็น ref ใบหน้าและชุดเกราะของมังกร
@Image2 ใช้เป็น ref หมู่บ้าน
@Video1 ใช้เป็น ref การเคลื่อนไหวมังกรและมุมกล้อง (จาก Maya previz)
```

**ต้อง explicit เสมอ** — บอกชัดว่า ref นี้ทำหน้าที่อะไร ไม่ใช่แค่แปะ

---

## 2. Character/Prop Consistency — Multi-Angle Reference

### สำหรับมังกร (ตัวเอก)
เตรียม render จาก 3D model **4 มุม**:
1. **Front view** — reference หลัก (หัว/หน้า/สีเกล็ด)
2. **3/4 profile** — สำหรับช็อตเอียง/หันหัว
3. **Side profile** — สำหรับ tracking shot
4. **Full body** — สำหรับ wide shot / action sequence (ปีกกาง/พ่นไฟ)

```
Use @Image1, @Image2, @Image3, @Image4 for the dragon's appearance from multiple angles
```

### สำหรับหมู่บ้าน / Environment
- Render **background plate** (ฉากเปล่า ไม่มีตัวละคร) จาก Maya
- Lock มุมกล้อง, แสง, time of day ให้ตรงกับ shot plan
- ใช้เป็น `@Image` ref เพื่อไม่ต้องอธิบายฉากซ้ำทุก clip

### สำหรับชาวบ้าน (ตัวประกอบ)
- ถ้ามี 3D model → render เป็น ref image
- ใช้คำอธิบายกลุ่ม (群众/村民) + ชุดเสื้อผ้าเดียวกันทุก clip
- **ห้ามสลับคำ** เช่น ใช้ "村民" ตลอด ไม่สลับกับ "百姓" / "人群"

---

## 3. 3D Maya Previz → Seedance Reference Video ⭐

### วิธี (สำคัญมาก!)
1. **Render จาก Maya เป็นวิดีโอ** — playblast หรือ render ก็ได้
2. **Export เป็น MP4** — ไม่ต้อง high quality, แค่เห็น movement + camera
3. **อัพเป็น @Video ref ใน Seedance** — บอกให้ follow motion + camera

```
Follow the dragon's flight path and camera motion from @Video1
Reference @Image1 for the dragon's appearance
```

### Best Practices สำหรับ Maya Previz
- **ความยาว 3-8 วินาที** ต่อ clip (sweet spot ของ Seedance)
- **ทำ 1 idea ต่อ clip** — กล้องเคลื่อน หรือ ตัวละครเคลื่อน (ไม่ใช่ทั้งสอง)
- **เน้น silhouette ชัด** — Seedance อ่าน shape ได้ดีกว่า detail
- **พื้นหลังเรียบ** ใน previz จะได้ผลดีกว่า (แยก motion จาก environment)
- **อย่า over-describe motion ใน text** ถ้ามี video ref แล้ว — จะ conflict กัน

### ข้อจำกัด
- Video ref ยาวเกิน ~10 วินาที → model สับสน ไม่แน่ใจจะเน้นอะไร
- สั้นกว่า 2 วินาที → ไม่พอจับ motion pattern
- ถ้ามีหลาย action ใน 1 clip → แยกเป็นหลาย previz clips

---

## 4. Multi-Clip Continuity — ต่อช็อตให้ไหลลื่น

### วิธีที่ 1: Video Extension (ต่อจาก last frame)
- Seedance สามารถ **ต่อวิดีโอจาก frame สุดท้าย** ของ clip ก่อน
- ไม่ใช่แค่ตัดต่อ — เป็น **pixel-level fusion** (แสง, พื้นหลัง, inertia ต่อเนื่อง)
- ใส่ prompt ใหม่สำหรับ action ถัดไป + ref เดิม

### วิธีที่ 2: Storyboard Workflow (Batch Generation)
1. **วางแผน shot ทั้งหมดก่อน** — เขียน shot list เหมือนผู้กำกับ
2. **เตรียม background plate** — render ฉากเปล่าจาก Maya
3. **Generate ทีละ 3-4 clips** — วางเทียบกันเช็ค consistency
4. **ตัดบน action** — ซ่อน minor inconsistency ตรงจุด cut

### วิธีที่ 3: Lens Switch (ภายใน 1 Generation)
- ใส่คำว่า **"镜头切换"** (lens switch) ใน prompt → Seedance ตัดช็อตภายใน 1 clip
- รักษา consistency ของ subject, style, scene ข้ามการ cut
- เหมาะกับช็อตที่ต่อเนื่องกัน (เช่น มังกรพุ่ง → ระเบิด → ชาวบ้านกรีดร้อง)

---

## 5. Prompt Strategy สำหรับ Cinematic Game Cutscene

### โครงสร้าง Prompt แนะนำ
```
[Style keywords จีน] ← สั้นๆ 10-15 คำ
[@ References] ← ระบุ role ชัดเจน
[Scene description] ← environment + lighting
[Action by timestamp] ← 0:00-0:03, 0:03-0:06...
[Negative prompts] ← no music, no grid, etc.
```

### Style Keywords สำหรับ Game Cinematic
```
游戏CG过场动画，虚幻引擎5画质，
电影级光影效果，史诗奇幻风格，
粒子特效火焰烟雾，大气透视，
```

### Prompt Length
- **30-100 คำจีน** = sweet spot (จาก field notes Feb 2026)
- ยาวเกินไป → model สับสน
- ภาษาจีน perform ดีกว่าภาษาอังกฤษ

---

## 6. Workflow แนะนำสำหรับโปรเจคมังกร

### Pre-Production
1. **Shot List** — วาง shot ทั้งหมดก่อน (มังกรพุ่ง, ทิ้งตัว, คำราม, พ่นไฟ, หมู่บ้านไฟไหม้, ชาวบ้านหนี)
2. **Maya Previz** — render แต่ละ shot เป็น 3-8 วินาที MP4
3. **3D Model Renders** — render มังกร 4 มุม (front/3-4/side/full body) เป็น PNG 16-bit
4. **Background Plates** — render ฉากหมู่บ้าน (ก่อนไฟไหม้ + ระหว่างไฟไหม้)
5. **Villager Refs** — render ชาวบ้านตัวประกอบ (ถ้ามี 3D model)

### Production (ทีละ Clip)
1. อัพ ref images (มังกร 4 มุม + ฉาก + ชาวบ้าน)
2. อัพ Maya previz video เป็น motion/camera guide
3. เขียน prompt (จีน, 30-100 คำ, timestamp format)
4. Generate → เช็ค consistency กับ clip ก่อนหน้า
5. ถ้า OK → ใช้ last frame ต่อ clip ถัดไป (video extension)
6. ถ้าไม่ OK → regenerate ด้วย ref เดิม

### Post-Production
- ตัดต่อ clips ใน CapCut / Premiere
- ตัดบน action เพื่อซ่อน minor drift
- เพิ่ม SFX / เสียงมังกร / เสียงไฟ (แยกจากการ gen)
- Color grade ให้ uniform ทั้ง sequence

---

## 7. ข้อควรระวัง

| ⚠️ ข้อควรระวัง | วิธีแก้ |
|----------------|---------|
| ตัวละครหน้าเปลี่ยนข้าม clip | ใช้ multi-angle ref (4 มุม) + คำเดิมทุก clip |
| Camera + Subject เคลื่อนพร้อมกัน | แยกเป็น 2 clips (1 = camera move, 2 = subject move) |
| Video ref ยาวเกิน 10 วิ | ตัดเป็น 3-8 วินาทีต่อ clip |
| Text ขัดกับ video ref | ถ้ามี video ref → ลด text description ลง |
| Consistency drift หลังหลาย clips | Generate batch 3-4 clips แล้วเทียบก่อนไปต่อ |
| Fire/VFX ไม่สม่ำเสมอ | ใช้ particle keywords: `粒子特效火焰烟雾` |

---

## 8. Asset Checklist สำหรับโปรเจคนี้

### จาก 3D Models (Maya)
- [ ] มังกร — 4 มุม render (front / 3-4 / side / full body + ปีกกาง)
- [ ] มังกร — action pose render (พ่นไฟ / ทิ้งตัว / คำราม)
- [ ] หมู่บ้าน — background plate (ปกติ)
- [ ] หมู่บ้าน — background plate (ไฟไหม้ + ควัน)
- [ ] ชาวบ้าน — ตัวประกอบ render (ถ้ามี model)
- [ ] Props — อาวุธ/ของใช้ ที่ต้อง consistent

### จาก Maya Animation (Previz Videos)
- [ ] Shot 1: มังกรพุ่งขึ้นฟ้า (3-8 วิ)
- [ ] Shot 2: มังกรทิ้งตัวลง (3-8 วิ)
- [ ] Shot 3: มังกรคำราม close-up (3-5 วิ)
- [ ] Shot 4: มังกรพ่นไฟ → หมู่บ้าน (3-8 วิ)
- [ ] Shot 5: หมู่บ้านไฟไหม้ + ชาวบ้านหนี (3-8 วิ)

---

## Sources

- [Seedance 2.0 Character Consistency Guide](https://10b.ai/blog/seedance-2-0-character-consistency)
- [How to Use Reference Video in Seedance 2.0](https://wavespeed.ai/blog/posts/blog-how-to-use-seedance-2-0-reference-video/)
- [Seedance 2.0 Complete Guide](https://createvision.ai/guides/seedance-20-ai-video-generator-guide)
- [Seedance 2.0 Storyboard Workflow](https://www.cutout.pro/learn/blog-seedance-2-0-storyboard-workflow-cutout-frames/)
- [Seedance 2.0 Production Pipeline (GitHub)](https://github.com/Emily2040/seedance-2.0)
- [Seedance 2.0 Official (CapCut/Dreamina)](https://dreamina.capcut.com/tools/seedance-2-0)
- [Awesome Seedance Prompts (GitHub)](https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts)
