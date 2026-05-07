---
name: แจ้งเตือนเมื่อทำงานยาวเสร็จ
description: เมื่อเริ่มงานที่ใช้เวลานาน (build ใหญ่, scan, multiple file edits) → แจ้ง DewS ชัดเจนเมื่อเสร็จ DewS จะเปิดหน้าต่างอื่นทำงานคู่ขนาน
type: feedback
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# แจ้งเตือนเมื่อทำงานยาวเสร็จ

**Rule** (DewS feedback 2026-05-07): เมื่อเริ่มงานที่ใช้เวลานาน — DewS อยากรู้ว่าตอนไหนเสร็จ จะได้เปิดหน้าต่างอื่นทำงานคู่ขนาน

**Trigger**: งานที่จะใช้เวลา > 1-2 นาที เช่น
- Multiple file edits (5+)
- Major rebuild (system-demo, slide deck)
- Scan / research with Explore agent
- Long file writes
- Sync push with rebase

**How to apply**:
- เริ่มงาน → บอก scope สั้นๆ + "จะแจ้งทันทีเมื่อเสร็จ" → DewS ไปทำอย่างอื่นได้
- ระหว่างทำ → ไม่ต้องอัพเดทแต่ละ step ถ้าไม่จำเป็น (DewS ไม่ได้ดู)
- **เสร็จแล้ว** → ส่งข้อความชัดเจน เช่น "✅ เสร็จแล้วค่ะ" + summary สั้น + link/path
- ใช้ emoji ✅ หรือ 🔔 ที่ต้นข้อความเพื่อให้สะดุดตา

**ตัวอย่างข้อความเสร็จ**:
```
✅ เสร็จแล้วค่ะ DewS!

📁 system-demo.html — เพิ่มแล้ว 4 scenarios + volunteer section
🚀 Refresh browser ดูได้เลย

[brief summary 3-5 bullets]
```

**Reverse — งานสั้น**:
- งาน < 1 นาที (1-2 edits) → ไม่ต้องแจ้งล่วงหน้า ทำเสร็จในข้อความเดียวเลย
