# SSA vs Marker-based: เลือกตาม mobility requirement

**Date**: 2026-05-22
**Project**: LBE Game Room (Sci Museum)

## Pattern
SSA (Shared Spatial Anchors) ผูกกับ "visual fingerprint" ของสถานที่ — ย้ายที่ = map ใช้ไม่ได้, ต้อง internet
Marker-based ผูกกับ "marker set" — ย้ายที่ได้ทันที, offline ได้ 100%

## Rule
ถ้า client requirements มี 2 ข้อนี้พร้อมกัน → Marker-based เสมอ:
1. Offline / no internet dependency
2. Portable / venue changes frequently

## Bonus
Azure Spatial Anchors ประกาศ Sunset Nov 2024 → ถ้าลูกค้าถาม SSA ต้องแจ้งก่อนเสมอ

## Scope Boundary
LBE system = tracking + sync + API เท่านั้น
ไม่รวม: เกม, hardware (Quest/server), source code → ส่งมอบแค่ SDK + API docs
