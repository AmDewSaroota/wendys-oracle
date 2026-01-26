# Lesson Learned: Always Verify Pricing/Policy Information

**Date:** 2026-01-26
**Context:** EcoStove project cost analysis
**Severity:** Medium

---

## What Happened

ฉันบอก DewS ว่า Tuya IoT Cloud API มี "Free Development Tier ฟรีตลอด" โดยอ้างอิงจาก web search ที่พบว่ามี 1 million API calls/month

แต่ DewS ไปเช็คเองแล้วพบว่า:
- **ไม่ใช่ฟรีตลอด** — ต้องขอต่ออายุ Trial ทุก 6 เดือน
- ต้องให้เหตุผลว่ายังพัฒนาอยู่
- ถ้าไม่ผ่านอนุมัติ → API ถูกระงับ

## Root Cause

1. **Overconfidence in search results** — เชื่อ search result แรกโดยไม่ verify
2. **Misinterpretation** — "Development tier" ≠ "Free forever"
3. **Didn't cross-check** — ควร search หลาย sources + ดู official docs

## Impact

- ถ้า DewS เชื่อข้อมูลผิดนี้ อาจวางแผนงบประมาณผิดพลาด
- โปรเจคอาจหยุดชะงักถ้า Tuya ไม่ต่อ trial โดยไม่มีแผนสำรอง

## Prevention

### Do
- บอก **confidence level** เมื่อให้ข้อมูลราคา/policy
- แนะนำให้ user **verify ด้วยตัวเอง** สำหรับข้อมูลสำคัญ
- ค้นหา **หลาย sources** + **official documentation**
- ระบุ **date** ของข้อมูลที่พบ (pricing เปลี่ยนบ่อย)

### Don't
- อย่าบอก "ฟรีตลอด" ถ้าไม่แน่ใจ 100%
- อย่าเชื่อ community posts โดยไม่เช็ค official source
- อย่า assume ว่า "trial" = "free forever"

## Template Response

```
ข้อมูลราคาที่ฉันพบ: [X]
ที่มา: [URL]
Confidence: [High/Medium/Low]
หมายเหตุ: ราคาอาจเปลี่ยนแปลง แนะนำให้เช็ค official pricing page โดยตรง
```

---

*"Confident but wrong" is worse than "uncertain but honest"*
