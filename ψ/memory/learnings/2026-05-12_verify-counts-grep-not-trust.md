# Lesson: ตัวเลขนับได้ต้อง grep เองเสมอ

**Date**: 2026-05-12
**Source**: ai-video-prompt-slides session

เมื่อต้องอ้างอิงตัวเลขที่นับได้จาก file (จำนวน slides, จำนวน items, จำนวน entries) ห้าม trust ตัวเลขจากความจำหรือจาก Gemini — ต้อง grep/count ด้วย tool ก่อนเสมอ

**กรณีที่เกิดจริง:**
- Gemini บอก 40 slides (นับจาก slide-num ที่มี gaps)
- WEnDyS บอก 37 (นับจาก HTML comment ซึ่งไม่ reliable)
- จริง: 41 (grep `class="slide"`)
- ผลลัพธ์: DewS เสียความเชื่อมั่นใน verification layer

**Pattern ที่ถูก:**
```powershell
# นับ slides
Select-String -Path "file.html" -Pattern 'class="slide"' | Measure-Object | Select-Object -ExpandProperty Count

# นับ items ใน list
Select-String -Path "file.md" -Pattern '^\d+\.' | Measure-Object | Select-Object -ExpandProperty Count
```

**กฎ:** ก่อนพูดตัวเลขใดๆ ที่นับได้จาก file — run tool ก่อนเสมอ ไม่ว่าจะ "มั่นใจ" แค่ไหน
