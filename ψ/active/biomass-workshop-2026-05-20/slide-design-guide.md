# Slide Design Guide — WEnDyS Self-Reference

> ทบทวนก่อนสร้างหรือแก้สไลด์ทุกครั้ง

---

## กฎหลัก (ห้ามละเมิด)

| # | กฎ | ทำไม |
|---|----|----|
| 1 | **ไม่มี scrollbar เด็ดขาด** | ถ้าล้น = ดูไม่รู้เรื่อง ผู้ชมไม่ follow |
| 2 | **ภาพเด่น ข้อความน้อย** | คนจำภาพได้ดีกว่า bullet list |
| 3 | **1 slide = 1 idea** | อย่า pack เนื้อหามากเกิน |
| 4 | **Hierarchy ชัด** | ชื่อ > subtitle > body — ขนาดต่างกัน อย่า uniform |

---

## Visual Hierarchy

### ขนาด (Size)
- ใหญ่กว่า = สำคัญกว่า — สมองอ่านแบบนี้โดยอัตโนมัติ
- **Headline: 28–36px** / Body: 15–18px / Caption: 12–13px
- อย่าให้ทุก element มีขนาดเท่ากัน → ดูเหมือนรายการซักผ้า

### สี (Color)
- ใช้สีเน้นแค่ 1–2 จุดต่อ slide
- สีเด่น → ข้อมูลที่ผู้ฟังต้องจำ / สีรอง → context
- ห้าม rainbow — ทุกสีเด่น = ไม่มีสีเด่น

### ตำแหน่ง (Position)
- สายตาอ่าน **บนซ้าย → ล่างขวา** เสมอ
- ข้อมูลสำคัญอยู่ **บน** และ **ซ้าย**
- Image ที่ต้องการให้คนสังเกตเห็น → อย่าซุกไว้มุม

---

## Layout Patterns

### เมื่อ slide มีรูป + ข้อความ
```
[ข้อความ]   [📷 รูปใหญ่]    ← photo-layout: text left, portrait photo right
```
- ข้อความ: callout 2 อัน max — ถ้า 3 อัน มักล้น
- รูป: portrait (3:4) fill height เต็มความสูง

### เมื่อ slide มีรูปเยอะ (2+ รูป)
```
[📷 รูป 1 landscape]        ← img-row-stack: stacked vertically
[📷 รูป 2 landscape]
```
- ใช้ `img-row-stack` (flex column) เมื่อต้องการให้รูปเต็มความสูง
- ใช้ `img-row` (grid side-by-side) เมื่อรูปขนาด 16:9 วางคู่กัน

### เมื่อต้องการ annotate รูป
```
[label ←]  [📷 รูป]  [→ label]   ← annotate: 3-column grid
```
- Text labels อยู่ซ้าย/ขวา — connector line ชี้ไปที่รูป
- รูปอยู่ตรงกลาง เต็มความสูง

### เมื่อมี specs/cards หลายช่อง
- Compact: h4 + 1 บรรทัด note — อย่าใส่ bullet list ยาว
- Grid 2×2 ไม่ควรเกิน ~180px รวม (ถ้าสูงกว่า → รูปด้านล่างล้น)

---

## Content Rules

### ข้อความ
- **Callout** = highlight ข้อมูลสำคัญ — max 2–3 บรรทัด
- **Bullet list** = ใช้เมื่อจำเป็นจริงๆ — max 3 bullets, 1 บรรทัดต่อ bullet
- ถ้าต้องอธิบานยาว → แบ่งเป็น 2 slides ดีกว่า

### รูปภาพ
- 1 รูป dominant > 2 รูปเล็กๆ เสมอ
- รูปควร **fill พื้นที่ที่ให้** ไม่ใช่ลอยอยู่กลาง
- Portrait (3:4) → ใช้กับมือถือ / หน้าจออุปกรณ์
- Landscape (16:9) → ใช้กับ dashboard / กราฟ / การเปรียบเทียบ
- Square (1:1) หรือ 4:3 → ใช้กับของจริง / วัตถุ

---

## Checklist ก่อนเสร็จ

- [ ] เปิด slide ที่ 100% viewport — มี scrollbar มั้ย?
- [ ] รูปใหญ่พอ? หรือลอยอยู่แค่ครึ่งหน้า?
- [ ] ข้อความอ่านได้จากระยะ 3 เมตรมั้ย?
- [ ] 1 slide = 1 ใจความชัดเจนมั้ย?
- [ ] มี element ที่ตัดออกได้มั้ย? → ตัดเลย

---

## CSS Patterns สำหรับ workshop-slides.html

```css
/* รูปเต็มความสูง (portrait) */
.container { display: flex; align-items: stretch; }
.img-placeholder { height: 100%; width: auto; aspect-ratio: 3/4; }

/* รูป 2 อัน stacked เต็ม height */
.img-row-stack { display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 10px; }
.img-row-stack .img-placeholder { flex: 1; min-height: 0; height: 100%; width: auto; aspect-ratio: 16/9; }

/* image container ต้องมีเสมอ */
flex: 1; min-height: 0;  /* ← ขาดอันนี้ = ล้น */
overflow: hidden;         /* ← safety net */
```

---

*อัปเดต: 2026-05-09 | ใช้กับ biomass workshop slides*
