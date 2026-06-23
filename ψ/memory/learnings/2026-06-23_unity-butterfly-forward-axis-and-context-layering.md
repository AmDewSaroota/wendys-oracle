# Unity Butterfly — Forward Axis + Context Layering

**Date**: 2026-06-23
**Source**: butterfly-unity-port session

## Pattern: Forward Axis คือ root cause ของ TOP view bug

ถ้า butterfly มองเห็นแค่ด้านบนปีก (TOP view) แม้จะ LookRotation ถูกต้องแล้ว — สาเหตุคือ mesh หน้าไปทาง +Y แทน +Z ใน Unity convention วิธีแก้: หมุน root object ใน prefab 90° บน X-axis ก่อน apply script ใดๆ

## Pattern: AE wiggle() seed vs Unity explicit seed

AE `wiggle()` randomize seed ให้ทุก layer อัตโนมัติ ใน Unity ต้องทำ explicit:
```csharp
float seed = Random.value * 1000f; // ใน Start()
```
ถ้าไม่ทำ ทุกตัวจะ wiggle พร้อมกัน

## Pattern: Context ไหลออกทีละชั้น → ถาม clarifying ก่อน

เมื่อ DewS บอกงานแค่คร่าวๆ → ถามว่า "use case คืออะไร / สำหรับใคร / ส่วนไหนทำแล้ว" ก่อน assume approach และตอบเลย — ป้องกันการอธิบายสิ่งที่ไม่ได้ใช้จริง
