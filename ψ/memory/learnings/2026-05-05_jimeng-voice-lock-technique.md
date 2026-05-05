# Jimeng Voice Lock Technique

**Date**: 2026-05-05
**Source**: Engenius character voice consistency session
**Tags**: #jimeng #dreamina #voice #tts #consistency #engenius

## Pattern

AI voice generation (Jimeng/Dreamina) ไม่มีความจำข้ามคลิป — เหมือน image gen ทุกประการ

## Technique

ระบุ **voice descriptor เดิมซ้ำทุกบรรทัด** ทุก scene ทุก episode:

### Chinese (Jimeng)
```
男孩（活泼男童声）: "dialogue here"
女孩（开朗女童声）: "dialogue here"
```

### English (Dreamina)
```
Boy (lively young boy voice): "dialogue here"
Girl (cheerful young girl voice): "dialogue here"
```

## Why It Works

- Jimeng มี internal voice preset ที่ match กับ descriptor
- ถ้าใช้คำเดิมซ้ำ → มัน match preset เดิม → เสียงเดิม
- ถ้าเปลี่ยนคำ (เช่น "child voice" บ้าง "kid tone" บ้าง) → มัน match preset อื่น → เสียง drift

## Rules

1. **Lock คำเดิม** — ห้ามย่อ ห้ามเปลี่ยน adjective
2. **Copy-paste ทุกบรรทัด** — แม้ตัวละครเดิมพูดหลายบรรทัดรวด
3. **ใช้ทั้ง character name + voice descriptor** — ไม่ใช่แค่ชื่อ
4. **ภาษาเดียวกับ platform** — Jimeng ใช้จีน, Dreamina ใช้อังกฤษ
