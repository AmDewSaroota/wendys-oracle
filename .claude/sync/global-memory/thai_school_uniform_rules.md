---
name: thai-school-uniform-hair-rules-ai-image-gen
description: กฎเครื่องแบบ + ทรงผม นักเรียนไทยตามระดับชั้น (ม.ต้น/ม.ปลาย) — ห้ามผสม ถ้า AI gen ผิดจะดู unrealistic
metadata: 
  node_type: memory
  type: reference
  originSessionId: c751f317-8a08-49b0-9ffd-0433e4233257
---

เวลาเขียน prompt character นักเรียนไทยให้ AI gen (Higgsfield/Dreamina/Seedance) ต้อง **decide ระดับชั้นก่อน** แล้ว match ทรงผม + ชุด ให้ตรง — ห้ามผสม

## เด็กชาย

**กางเกง = ขาสั้น สี khaki ทั้ง ม.ต้น และ ม.ปลาย** (เครื่องแบบมัธยมไทยส่วนใหญ่)
ความต่างหลัก = **ทรงผม** ตามระดับชั้น

| ระดับ | ทรงผม | กางเกง | เสื้อ | รองเท้า |
|---|---|---|---|---|
| **ม.ต้น** (12-15) | **รองทรงสั้น (crew cut)** ข้างเกรียน · ห้ามยาว/ผมตั้ง | กางเกงขาสั้น สี khaki | เสื้อเชิ้ตขาวแขนสั้น + emblem โรงเรียน | รองเท้าหนังดำ + ถุงเท้าขาว |
| **ม.ปลาย** (15-17) | สั้นเรียบ ยาวกว่า ม.ต้น เล็กน้อย (ผมหน้านิดหน่อยได้) · ยัง short conservative | กางเกงขาสั้น สี khaki | เสื้อเชิ้ตขาวแขนสั้น | รองเท้าหนังดำ |

## เด็กหญิง

| ระดับ | ทรงผม | กระโปรง | เสื้อ | รองเท้า |
|---|---|---|---|---|
| **ม.ต้น** | ผมสั้นเหนือไหล่ หรือรัดหางม้า | กระโปรงน้ำเงินจีบ | เสื้อเชิ้ตขาวคอบัว | รองเท้าหนังดำ |
| **ม.ปลาย** | ผมยาวรัดได้ | กระโปรงน้ำเงินจีบ | เสื้อเชิ้ตขาว + เนคไท | รองเท้าหนังดำ |

## English keywords (สำหรับ prompt)

### Boy ม.ต้น
- Hair: `short crew cut, shaved sides, neat military-style trim`
- ห้าม: `messy hair`, `swept across forehead`, `tousled`, `long`, `spiky`
- Pants: `khaki short trousers (above knee), light tan khaki color`

### Boy ม.ปลาย
- Hair: `short tidy hair, slight fringe possible, conservative school style` (ยาวกว่า ม.ต้น เล็กน้อย แต่ยังเรียบ)
- ห้าม: `long hair`, `messy`, `spiky`
- Pants: **`khaki short trousers`** (เหมือน ม.ต้น — ไม่ใช่ขายาว)

### Girl ม.ต้น/ม.ปลาย
- Skirt: `dark navy pleated knee-length skirt`
- ม.ต้น hair: `shoulder-length black hair, neat ponytail`
- ม.ปลาย hair: `long black hair tied back`

## Why

DewS ทักวันที่ 2026-05-24 — AI gen เด็ก ม.ต้น แต่ทำผม "messy/long" + กางเกง "khaki shorts" ทั้งคู่ → ขัดกฎจริง ม.ต้นไทย (ต้องรองทรงสั้น)

ถ้าจะใส่ทรงผมยาวขึ้น = ม.ปลาย → กางเกงต้องเปลี่ยนเป็นขายาวสีเข้มด้วย ห้ามมิกซ์

## How to apply

- **ก่อนเขียน character prompt** → ถาม DewS: "ม.ต้น หรือ ม.ปลาย"
- Lock ทั้งทรงผม + กางเกง/กระโปรง ให้ตรงระดับเดียวกัน
- เก็บ description นี้ copy-paste ทุก shot — ห้ามแก้
