---
name: word-export-css-dom-pull
description: Word .doc HTML blob ต้องดึง CSS จาก DOM ด้วย querySelectorAll('style') — ไม่ใช่ hardcode
metadata:
  type: feedback
---

เวลาสร้าง Word .doc ด้วย HTML Blob (`application/msword`) จาก JavaScript:

**ปัญหา**: ถ้า clone เฉพาะ `.page.innerHTML` แล้วแนบแค่ inline CSS เล็กน้อย — class ที่ define ใน `<style>` block ของหน้าจะหายทั้งหมด Word เห็นแค่ plain HTML ไม่มี layout

**วิธีถูก**:
```js
var existingStyles = '';
document.querySelectorAll('style').forEach(function(s){ existingStyles += s.innerHTML + '\n'; });
```
แล้วต่อด้วย light-theme override (`!important` บน background/color) เพื่อ invert dark theme

**Why**: HTML blob ที่ส่งให้ Word ต้องเป็น self-contained document — `<style>` ต้องอยู่ใน `<head>` ของ blob เอง ไม่ใช่ reference CSS จากภายนอก

**How to apply**: ทุกครั้งที่ทำ HTML→Word export จาก dark-theme page
