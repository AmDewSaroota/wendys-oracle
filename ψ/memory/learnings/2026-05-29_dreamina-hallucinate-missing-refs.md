---
date: 2026-05-29
tags: [dreamina, video-prompt, props, uniform, screen-sync]
project: ndf-promo-doe-vr
---

# Dreamina hallucinate ทุก element ที่ขาด ref

## กฎ

Dreamina จะ "fill in" ทุกอย่างที่ไม่มี ref หรือไม่ได้ระบุชัดเจน — กางเกง, props, background, วัตถุดิบ — มัน hallucinate ขึ้นมาเองเสมอ

## ที่มา

Session 2026-05-29:
- ShotChef_ref.png ตัดที่อกบน กางเกงอยู่นอก frame → Dreamina gen กางเกงขายาวเอง
- Cooking action → Dreamina gen กระทะ/วัตถุดิบขึ้นมาแม้จะบอกห้ามแล้ว
- Chef ref ไม่ครอบคลุม props zone → มีของกระเด็นออกมาจาก controller

## How to apply

1. **ทุก element ต้องมี ref หรือ negative prompt** — uniform, shoes, props, background
2. **ถ้า ref ตัด body part ออก** → เพิ่ม ref ที่เห็น body part นั้น (เช่น Shot3b_ref1 สำหรับ khaki shorts)
3. **Cooking actions trigger cooking props เสมอ** → ใช้ abstract motion แทน (stirring in air, circular wrist motion)
4. **Screen sync** = ทำได้แต่ไม่ 100% — เตรียม AE composite เป็น plan B
