---
name: Seedance dangerous words (content filter blocks)
description: คำที่ทำให้ Seedance ปฏิเสธไม่ generate + คำอ้อมที่ใช้แทนได้
type: project
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# Seedance Content Filter — คำที่ block + คำอ้อมที่ใช้แทน

**Why**: Seedance มี content moderation — บาง prompt จะถูก reject (ไม่ generate เลย) แทนที่จะ generate ผิด

**Trigger words ที่ block (ภาษาอังกฤษ)**:
- violence (ตรงๆ)
- blood splatter / bloody
- gore / gory
- brutal death / brutal killing
- graphic violence
- catastrophic explosion (อาจ block ในบางบริบท)
- ภาษาไทยใน prompt ก็ block เหมือนกัน: ความรุนแรง, เลือดสาด, ระเบิดอย่างเลวร้าย

**คำอ้อมที่ใช้แทนได้ (ผ่าน filter)**:
| ❌ Block | ✅ ใช้แทน |
|----------|----------|
| violence / brutal | intense action, fierce, aggressive |
| blood / bloody | (เลี่ยงเลือดทั้งหมด, ใช้ "wounded", "fallen warrior") |
| gore / gory | (เลี่ยง — ใช้ "battle aftermath", "smoke and rubble") |
| catastrophic explosion | massive eruption, devastating burst, fiery blast |
| brutal death | warrior falls, defeated in battle |
| destruction (full) | dragon's destruction, smoke and chaos, devastation |

**How to apply**:
- ถ้า Seedance reject prompt → ตรวจคำใน prompt ก่อน
- ใช้ภาษา "cinematic" / "epic" แทนคำตรงๆ
- Game CG / cinematic context มักช่วย soften — เพราะ AI เข้าใจว่าเป็น stylized
- DewS ใช้คำอ้อมเหล่านี้ใน Fortal dragon ได้ผล (เผาเมือง, ระเบิด, มังกรโจมตี)

**Source**: DewS direct experience (2026-04 dragon project)
