# Multi-Domain Advisory: API + Logistics + Life

**Date**: 2026-04-30
**Source**: rrr: wendys-oracle
**Tags**: #advisory #logistics #electricity #api #aliexpress

## Pattern

เมื่อ session ครอบคลุมหลาย domain ที่ไม่เกี่ยวกัน (technical, logistics, personal finance) — ควร:

1. **Ask for source data first** — อย่าคำนวณจากข้อมูลคร่าวๆ ถ้ามี official data ให้ขอก่อน
2. **Fail fast on impossible tasks** — เช่น tracking websites เป็น SPA ทุกเว็บ ควรบอกตรงๆ ว่าทำไม่ได้แทนที่จะลองหลายรอบ
3. **Context awareness** — session ยาวเกินไป = risk context compaction ควรแนะนำ DewS ให้แบ่ง session ถ้าหัวข้อต่างกันมาก

## Specific Learnings

### AliExpress Disputes
- ต้องรอจน **estimated delivery date** ผ่านก่อน ไม่งั้น platform จะ side กับ seller
- Open Dispute → seller มี 5 วันตอบ → ถ้าไม่ตอบ AliExpress ตัดสิน
- ควรมี parallel plan: สั่งจาก local source ไว้ก่อน ไม่ต้องรอ AliExpress อย่างเดียว

### Electricity Rate Structure (Thailand, June 2026)
- 3 tiers: 0-200 (3 บาท), 201-400 (3.95 บาท), 401+ (5 บาท)
- Breakeven vs old rate: ~719 หน่วย
- SEER-based AC calculation: Average Watts = BTU ÷ SEER × load factor

### API Aggregators
- xSkill.ai ทำให้ access Seedance 2.0 ง่ายขึ้นมาก — ไม่ต้องสมัคร Volcengine
- แต่เป็น third-party = risk ถ้า service ปิด หรือ price เปลี่ยน
