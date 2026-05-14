# HTML+Screenshot ดีกว่า Inline SVG สำหรับ Diagram ซับซ้อน

**Date**: 2026-05-14
**Source**: workshop-slides slide 9 connector redesign

เมื่อ diagram มี Thai font + emoji + responsive layout + หลาย element
→ สร้าง HTML standalone + Chrome headless screenshot ดีกว่าเขียน SVG เอง

เหตุผล:
- SVG `preserveAspectRatio="none"` ทำให้ curve distort เมื่อ aspect ratio ต่างมาก
- HTML layout engine จัดการ flexbox/emoji/font ได้ถูกต้องโดยธรรมชาติ
- PNG ผลลัพธ์ crisp, portable, ไม่มี dependency

Chrome headless command (Windows):
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot="out.png" --window-size=1800,660 --hide-scrollbars "file:///path/to/file.html"
```

ถ้า DewS บอกให้ "เจนเป็นรูป" → spawn Gemini ทำ HTML+screenshot เลย อย่าฝืนเขียน SVG
