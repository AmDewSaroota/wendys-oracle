# Blender: Quad View vs 4 Separate Areas

**Date**: 2026-06-19
**Context**: Maya Config Addon — Space maximize viewport

## Pattern
Quad View (Ctrl+Alt+Q) และ 4 Separate Areas ดูเหมือนกันแต่ต่างกันพื้นฐาน

## Quad View
- 1 area เดียวแบ่งเป็น 4 regions
- Space/Maximize จะ maximize User Perspective (active region) เสมอ
- ไม่สามารถ maximize region อื่นอิสระได้
- ออกด้วย Ctrl+Alt+Q หรือ View → Area → Toggle Quad View

## 4 Separate Areas
- 4 areas แยกกันจริงๆ สร้างด้วย corner drag หรือคลิกขวาที่ border
- Space/Maximize จะ maximize area ที่ active (คลิกล่าสุด) ได้อิสระ
- Save layout ด้วย File → Defaults → Save Startup File
- แบบนี้คือที่ DewS ต้องการ (เหมือน Maya/3ds Max)

## Diagnosis question
ก่อนแนะนำ maximize viewport: ถามว่า "ใช้ Ctrl+Alt+Q toggle view อยู่มั้ย?" — ถ้าใช่ = Quad View, ต้องออกก่อน

## Tags
blender, viewport, quad-view, separate-areas, maximize, layout
