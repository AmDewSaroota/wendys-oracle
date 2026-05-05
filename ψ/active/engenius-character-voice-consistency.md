# Engenius — เทคนิคให้เสียงตัวละครคงที่ทุกคลิป

## หลักการสำคัญ

> AI ไม่มีความจำข้ามคลิป — มัน generate ใหม่ทุกครั้ง
> ดังนั้นต้อง **lock ทุกอย่าง** แล้ว copy-paste ซ้ำทุก prompt ทุก shot

---

## 1. Lock Character Description

ทุกคลิปต้องคัดลอก description เดิมใส่ซ้ำ — ห้ามย่อ ห้ามเปลี่ยนคำ

```
Shinji — curly black hair, big blue eyes, freckles,
green t-shirt, navy shorts, orange shoes

Leah — curly magenta-pink hair, yellow hair clip,
big pink eyes, rosy cheeks, yellow overalls, white shirt
```

ใส่ซ้ำทุก shot ทุก scene ทุก episode

---

## 2. Ref Image + Text ใช้คู่กัน

- **Ref image** ที่ generate ออกมาดีแล้ว = ตัวยึดหลัก (กำหนดหน้าตาแม่นกว่า text)
- **Text description** = safety net กันกรณี AI ตีความ ref ผิด
- ใช้ทั้งสองอย่างพร้อมกันเสมอ

---

## 3. Lock สีตา + ทรงผม อย่างชัดเจน

AI drift ตรงนี้มากที่สุด:

| ถูก | ผิด |
|-----|------|
| `big blue eyes` | `big eyes` (ไม่ระบุสี) |
| `curly magenta-pink hair with yellow clip` | `pink hair` (ขาดรายละเอียด) |
| `round face, rosy cheeks` | `sparkling eyes` (ทำตาผิดรูป) |

**ห้ามใช้คำว่า "sparkling eyes"** — AI จะทำให้ตาบวมหรือผิดรูป

---

## 4. Style Lock — ใช้ Style เดิมซ้ำ

Copy-paste ท่อนนี้ทุกครั้ง:

```
Flat 2D cartoon style, NO line art, NO outlines,
only soft flat color shapes with smooth gradients
```

ห้ามเขียนใหม่ ห้ามใช้คำอื่นแทน เพราะ AI จะตีความต่างกัน

---

## 5. Video Prompt ต้อง Match Ref Image

- ถ้าภาพ ref ตัวละครชี้มือซ้าย → video prompt ต้องบอกว่าชี้มือซ้าย
- ห้ามให้ video prompt ขัดกับสิ่งที่เห็นใน ref
- ถ้าขัดกัน → ตัวละครจะกระตุก/เปลี่ยนรูประหว่างคลิป

---

## 6. เปลี่ยน Concept = เริ่ม Prompt ใหม่ทั้งหมด

ถ้าต้องเปลี่ยนฉาก/มุมกล้อง/ท่าทางหนักๆ:
- **เขียน prompt ใหม่จาก blank** (อย่า patch prompt เก่า)
- แต่ยังคง character description + style description เดิมไว้
- AI จะสับสนถ้าเห็น prompt เก่าที่ถูกแก้ครึ่งๆ กลางๆ

---

## 7. ท่าทางต้อง Simple

| ทำได้ดี | หลีกเลี่ยง |
|---------|-----------|
| ชี้, ยิ้ม, โบกมือ, ตบมือ | ถือของหลายชิ้นพร้อมกัน |
| มองกล้อง, หันหน้า | ท่าซับซ้อน + props เยอะ |
| ยืนตรง, นั่ง | กระโดด + หมุนตัว |

ท่ายิ่ง simple → ตัวละครยิ่งไม่ drift

---

## Checklist ก่อน Generate ทุกครั้ง

- [ ] Character description ครบ (ผม, ตา, เสื้อผ้า, รองเท้า)
- [ ] Style description copy-paste มาแล้ว
- [ ] Ref image ตรงกับ video prompt
- [ ] ท่าทาง simple ไม่ซับซ้อน
- [ ] ไม่มีคำต้องห้าม (sparkling eyes, etc.)
- [ ] ถ้าเปลี่ยน concept → เขียนใหม่จาก blank

---

## สรุปสั้น

**Lock → Copy → Paste → ซ้ำ** ทุก prompt ทุกคลิป
ยิ่ง consistent ในการเขียน → AI ยิ่ง consistent ในการ generate

---

*สรุปจากประสบการณ์ทำ Engenius 2D Animation หลาย episode*
*WEnDyS — 2026-05-05*
