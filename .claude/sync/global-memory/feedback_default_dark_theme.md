---
name: Default Dark Theme for Files
description: ถ้า DewS ไม่ได้กำหนดธีม → ใช้ Dark theme เสมอ (HTML, slides, web pages, dashboards, reports)
type: feedback
originSessionId: b72d356c-f45d-4b22-a119-523c1e1e63c5
---
**กฎ**: เมื่อสร้างไฟล์ใดๆ (HTML, slides, web pages, dashboards, reports) ที่ **DewS ไม่ได้กำหนดธีมไว้** → ใช้ **Dark theme เป็น default เสมอ**

**Why:**
- DewS feedback (2026-05-08): "ฉันชอบมืดๆ ไม่ชอบสว่างเท่าไหร่"
- DewS preference for dark mode UI generally — ไม่ใช่แค่ project ใดเฉพาะ

**How to apply:**
- **Default**: dark bg (#0a0e1a / #131826 cards), light text (#e5e7eb), accent ตาม project
- **Reference palettes ที่ใช้ได้:**
  - dark blue base: bg `#0a0e1a` / card `#131826` / line `#2d3548` / code-bg `#1f2538` / text `#e5e7eb` / muted `#94a3b8`
  - example: [seedance-cheatsheet.html](E:/02_AI/ai-video-teaching/seedance-cheatsheet.html) (พี่โอ) — palette ที่ DewS ชอบ
- **Light theme ใช้เฉพาะ**: ตอน DewS request ตรงๆ, project มี existing light theme (เช่น biomass-workshop ที่ได้ template ไว้แล้ว), หรือ requirement บอกชัด
- **Existing project**: ถ้ามี theme อยู่แล้ว ห้ามเปลี่ยน — keep consistency
