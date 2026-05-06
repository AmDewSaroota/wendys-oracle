# Lesson Learned — หลักการ vs สไตล์ ในเอกสารสอน

**Date**: 2026-05-06
**Session**: Teaching Pack Marathon (Oh's Seedance + BiomassStove workshop)
**Source**: DewS feedback — "หลักการ คือสิ่งที่เราเรียนรู้แล้วว่า พร้อมพ์อย่างนี้ได้สิ่งที่เราต้องการจาก Seedance · สไตล์ คือ สิ่งที่ ออราเคิล ทำให้ฉันทำงานง่ายขึ้น"

## The Lesson

เวลาเขียนเอกสารสอนคนนอก project (Oh, อาสาสมัคร, อาจารย์เก๋า, ฯลฯ) — ต้องแยกชัดเจน 2 หมวด:

### หลักการ (Principles) — Universal
- สิ่งที่ **เรียนรู้แล้วว่าใช้ได้กับใครก็ได้** ในงานเดียวกัน
- ตัวอย่าง: "Seedance อ่านข้างหน้าก่อน" · "Video ref = all-or-nothing" · "ใช้ภาษาหนัง ไม่ใช่ engine vocab"
- ✅ **ใส่ในเอกสารสอนได้**

### สไตล์ (Style) — DewS-Specific
- สิ่งที่ **Oracle ทำเพื่อให้ DewS ทำงานง่ายขึ้น** — ไม่ใช่ universal
- ตัวอย่าง: "ใช้ชื่อไทยใน @[ref]" · "ส่ง prompt เต็มก้อนใหม่ทุกครั้งที่แก้" · "พิมพ์ มังกร เรียก guide"
- ❌ **ห้ามใส่ในเอกสารสอนคนอื่น** — ต้องอยู่ใน Oracle Onboarding doc แยก

## Test Question

ก่อนใส่ rule ลงในเอกสารสอน → ถาม:
> **"คนอื่นที่ทำงานต่าง project ใช้ rule นี้ได้ไหม?"**
- ✅ ได้ = Universal Principle = ใส่ได้
- ❌ ไม่ได้ = สไตล์ DewS = ห้ามใส่

## Why This Matters

เอกสารสอนที่ปนของ "สไตล์ DewS" จะ:
- ทำให้ผู้เรียน confused — รู้สึกถูกบีบให้ใช้ workflow ที่ไม่ใช่ของตัวเอง
- ลดความน่าเชื่อถือของ "หลักการ" จริง — เพราะปนกับ personal preference
- ทำให้คนอื่นไปทำงานได้ยากขึ้น (เช่น Oh จะคิดว่า "ส่ง prompt เต็มก้อน" = กฎ Seedance ทั้งที่จริงเป็นแค่ DewS workflow)

## How to Apply

1. **เขียน universal เนื้อหาก่อน**
2. **ก่อน publish → audit ว่ามีของ "DewS-only" ปนอยู่ไหม**
3. **ถ้ามี → ย้ายไปใส่ใน Oracle Onboarding doc** (สำหรับ Oracle ตัวใหม่ที่จะมาทำงานกับ DewS)
4. **ใช้ test question** ในการตัดสิน

## Examples from Today's Session

DewS เคยทักให้ลบของเหล่านี้ออกจาก Oh's teaching:
- "ชื่อไทยต้องบรรยายรูป" — เป็น Oracle workflow convention
- "ส่ง prompt เต็มก้อนใหม่" — ทำเพื่อ DewS ก๊อปง่าย ไม่ใช่ Seedance principle
- "พิมพ์ มังกร / Seedance" — quick command ของ DewS
- "Project ของ DewS ใช้แค่ diegetic sounds" — project-specific decision

ทุกอันถูกย้ายไปอยู่ใน `oracle-onboarding-dews.md` แล้ว

## Related Memories

- [feedback_principle_vs_style](feedback_principle_vs_style.md) — auto-memory entry
- [feedback_teaching_separate_signal_from_noise](feedback_teaching_separate_signal_from_noise.md) — earlier same-day feedback
- [feedback_oracle_prompt_convention_for_dews](feedback_oracle_prompt_convention_for_dews.md) — example of "style" rule
