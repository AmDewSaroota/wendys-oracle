---
name: ถามก่อนปิดถ้า decision บล็อก next step
description: ถ้ามี decision ค้างที่บล็อก next step ทั้ง session ต้องถาม DewS ก่อนปิด
type: feedback
---

ถ้ามี decision ค้างอยู่ที่บล็อก next step ทั้งหมด (เช่น ยังไม่เลือก projection theme ทำให้เจน storyboard ไม่ได้) — ให้ถาม DewS ก่อนปิดเซสชั่น ไม่ใช่ทิ้งค้างไว้

**Why:** DewS ต้องกลับมา context switch ใหม่ทั้งหมดในเซสชั่นถัดไป เสียเวลาเปล่า

**How to apply:** ก่อน rrr เช็ค pending decisions ใน storyboard/plan file — ถ้ามีอะไรค้างที่บล็อก next action ให้ flag ทันที
