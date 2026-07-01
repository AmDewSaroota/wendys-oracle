# Thai Contractor BOQ — Phonetic Spelling Traps

**Date**: 2026-07-01
**Source**: rrr: roof-boq-fixes

## Pattern

ช่างก่อสร้างไทยมักเขียน BOQ ตามเสียงที่ได้ยิน ทำให้คำศัพท์ช่างภาษาอังกฤษบิดเพี้ยน

| คำที่ช่างเขียน | คำจริง | ที่มา |
|----------------|--------|-------|
| กล้าวาไลน์ซ์ | กัลวาไนซ์ | Galvanized |
| มุ้งในลอน | มุ้งไนลอน | Nylon (mesh) |

## Rule

เมื่อ copy BOQ จากช่าง ให้ sanity-check คำศัพท์ช่างก่อน:
- ถ้าคำไม่มีความหมายชัดเจนในภาษาไทย → likely เป็น phonetic ของคำอังกฤษ
- Flag ให้ user ทราบทันที แทนที่จะรอให้ user สังเกตเอง

## Tags

`contractor` `boq` `thai` `phonetic` `typo` `construction`
