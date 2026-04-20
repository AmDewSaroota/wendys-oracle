# Seedance Lock Level — All-or-Nothing Rule

**Date**: 2026-04-20
**Source**: rrr: wendys-oracle
**Tags**: seedance, prompt-engineering, video-ref, lock-level

## Pattern

Seedance video ref lock ไม่มี partial override — เมื่อลด lock level จะลดทุกอย่างพร้อมกัน (กล้อง, ท่า, ฉากหลัง, composition)

## Wrong Approach
```
参考...但不严格跟随主体动作
```
→ หวังว่า text จะ override แค่แอคชั่น แต่ Seedance เปลี่ยนมุมกล้อง + ฉากหลังด้วย

## Correct Approach
```
严格模仿...的全部镜头运动和时间节奏
唯一修改——[เฉพาะส่วนที่ต้องเปลี่ยน]：[description]
```
→ Lock แน่นสุด แล้วเจาะรูเฉพาะจุดด้วย "唯一修改"

## Bonus: Intensity Scale

Seedance ตอบสนองต่อ intensity ต่ำกว่ามนุษย์:
- "แรง" ในภาษามนุษย์ (爆发式) → Seedance ทำแค่ smooth
- ต้องเขียน extreme: 猛然炸开 + 急停顿挫 + 空气被撕裂 + 冲击力震散
- กฎ: ถ้าอยากได้ 7/10 ต้องเขียน 10/10
