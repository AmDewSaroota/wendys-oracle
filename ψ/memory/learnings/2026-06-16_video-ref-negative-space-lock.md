# Dreamina — Video Ref ล็อค Negative Space

**Date**: 2026-06-16
**Project**: Fortal Dragon Shot 10 iteration
**Source**: 6-round iteration, discovery when switching video → image ref

---

## Pattern: Video Ref ล็อค "สิ่งที่ไม่มี" ด้วย

**Rule**: ถ้า previs ไม่มีคน/object ใดใน frame → Dreamina จะไม่ gen สิ่งนั้นแม้ prompt บอกชัดเจน

**ทำไม**: Video ref lock ไม่ใช่แค่ position/composition — มัน lock density ของ elements ทั้งหมดด้วย รวมถึง "ความว่าง" ในส่วนที่ previs ว่าง

**Applies to**: คน, prop, VFX ใดก็ตามที่ไม่มีใน previs แต่ต้องการใน gen จริง

**Fix**: เปลี่ยนจาก video ref → image keyframe จาก previs
- ยังได้ composition/framing เดิม
- แต่ Dreamina มีอิสระ gen elements ใหม่จาก prompt

---

## Pattern: Camera Past Zenith (ผ่าน 90° ต่อเนื่อง)

**สูตรที่ใช้ได้จริง**:
```
镜头猛然上扬，跟随飞龙越过头顶继续后仰——
飞龙越过镜头正上方，向身后上空全速飞去，
镜头越过天顶继续后仰追踪，直到飞龙完全消失于身后天际。
飞龙全程速度不减，绝无减速，绝无慢动作，绝无缓出。
镜头跟随速度不减，直到飞龙彻底消失，不提前停止。
```

**Keywords สำคัญ**:
- `越过天顶继续后仰` — ผ่าน zenith แล้วเอนต่อ
- `绝无缓出` — ไม่ ease-out
- `不提前停止` — ห้ามหยุดก่อนมังกรหาย

