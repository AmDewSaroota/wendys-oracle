# Character Description > Reference Image

**Date**: 2026-05-05
**Source**: Engenius 2D Classroom Scene 7 iteration
**Context**: Nanobanana Pro image generation

## Pattern

เมื่อเจนภาพ 2D ด้วย Nanobanana Pro แม้แนบ character ref image แล้ว AI อาจไม่ follow หน้าตา/เสื้อผ้า โดยเฉพาะเมื่อมีหลายตัวละครในภาพ

## Solution

ต้องเขียน **text description** ของทุกตัวละครใน prompt ด้วยเสมอ:
- สีผม + ทรงผม
- สีตา
- สีเสื้อผ้า + แบบเสื้อผ้า
- accessories (กิ๊บ, กระ, etc.)

## Also Learned

- **เปลี่ยนคอนเซ็ปต์ = เริ่ม prompt ใหม่จากศูนย์** อย่า patch prompt เดิม
- **บริบทดีกว่า description** — "ทำแบบทดสอบแล้วสงสัย" ให้ภาพที่สมเหตุสมผลกว่า "นั่งโต๊ะแล้วถาม"

## Tags
`nanobanana` `character-ref` `2d-illustration` `prompt-engineering`
