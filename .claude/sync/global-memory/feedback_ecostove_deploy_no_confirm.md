---
name: EcoStove deploy — no confirmation needed
description: Deploy ecostove to Vercel ไม่ต้องถามก่อน ให้รันเลย
type: feedback
originSessionId: d3621661-b0f7-4396-a0f4-61bf8519d7e1
---
Deploy ecostove (`cd lab/tuya-ecostove/deploy && npx vercel --prod --yes`) ไม่ต้องถามก่อน ให้รันได้เลยทันที

**Why:** DewS บอกว่า "วนมาเรื่องนี้อีกละ" — ถามซ้ำหลายครั้งทำให้เสียเวลา

**How to apply:** ทุกครั้งที่แก้ไขไฟล์ใน `lab/tuya-ecostove/deploy/` และพร้อม deploy → รัน vercel เลย ไม่ต้องขอ confirm

**เพิ่มเติม — คู่มือ version:**
ทุกครั้งที่แก้คู่มือแอดมิน (ส่วน B ใน index.html) ต้องอัพเดท version + เดือน/ปีด้วยเสมอ
- บรรทัด TH: `คู่มือ vX.X — ปรับปรุงล่าสุด: [เดือน ปี พ.ศ.] ([สิ่งที่เปลี่ยน])`
- บรรทัด EN: `Guide vX.X — Last updated: [Month Year] ([what changed])`
