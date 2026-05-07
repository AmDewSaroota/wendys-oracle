# Lesson Learned — Image Overlay เร็วกว่า Rebuild สำหรับ Document Replication

**Date**: 2026-05-07
**Session**: Workshop Demo Alignment Sprint
**Source**: DewS feedback — "เธอทำแบบ เอาภาพจากไฟล์ออกมา แล้วเขียนอักษรทับไปเลยไม่ได้หรอ จำเป็นต้องทำใหม่ทั้งหน้าหรอ?"

## The Lesson

เวลาต้อง replicate เอกสาร/หน้าจอ/ฟอร์มจาก original (PDF, screenshot, design mockup) → **เลือก image overlay ก่อน rebuild ทุกครั้ง**

| Approach | เวลาที่ใช้ | ความตรง | Iterations |
|----------|-----------|---------|------------|
| **Rebuild HTML จากศูนย์** | 1-2 ชม. | 60-80% (เพี้ยนเสมอ) | 3-5 รอบ tweak |
| **Image overlay** | 5-15 นาที | 95-100% (ตรง pixel) | 1-2 รอบ position |

## When to Use Image Overlay

✅ **ใช้ overlay เมื่อ**:
- Original artifact มีอยู่ (PDF, image, screenshot)
- Need to look IDENTICAL to original
- Form filling / annotation / certificate templates
- Documents that go to formal recipients (เช่น แบบตอบรับราชการ)

❌ **อย่าใช้ overlay เมื่อ**:
- Content จะเปลี่ยนบ่อย (ต้องการ edit-friendly)
- Need responsive design / multiple screen sizes
- Original ไม่มี / ต้องสร้างใหม่ทั้งหมด

## Tools

### Image extraction from PDF
```python
import fitz
doc = fitz.open('source.pdf')
page = doc[1]  # 0-indexed
pix = page.get_pixmap(dpi=200)
pix.save('output.png')
```

### Get exact text positions for overlay anchors
```python
blocks = page.get_text('dict')['blocks']
for b in blocks:
    for ln in b.get('lines', []):
        for s in ln['spans']:
            bbox = s['bbox']  # [x0, y0, x1, y1] in points
            x_pct = bbox[0] / page.rect.width * 100
            y_pct = bbox[1] / page.rect.height * 100
            print(f'{y_pct:.2f}% | "{s["text"]}"')
```

### HTML overlay structure
```html
<div class="page" style="position:relative;width:8.5in;height:11in">
  <img src="bg.png" style="width:100%;height:100%">
  <div style="position:absolute;top:33.7%;left:25%">value text</div>
</div>
```

## Key Trick: PyMuPDF for Pixel-Perfect Positioning

แทนที่จะ "เดา" % ตำแหน่ง — ใช้ `get_text('dict')` extract bbox จริงของ label fields → แปลงเป็น % → ใส่เป็น CSS position

ตัวอย่างกับ NDF response form:
```
y:33.10-35.31% | x:11.77% | "ชื่อ – นามสกุล"
y:36.38-38.60% | x:11.77% | "ตำแหน่ง"
y:39.69-41.90% | x:11.77% | "โทรศัพท์"
```
→ overlay value แต่ละ field ที่ y นั้นๆ ตรงเป๊ะ

## Why DewS's Suggestion Was Better

หนูเริ่มจาก rebuild HTML form (default reflex) → 2 iterations · DewS เสนอ overlay → 3rd iteration ดีขึ้นเยอะ

**Mental model shift**: Default question ก่อน build:
- ❌ "ทำ HTML ยังไงให้เหมือน original?"  
- ✅ "ใช้ original เป็น base ได้ไหม? เพิ่มอะไรน้อยที่สุด?"

## Related

- [feedback_distinguish_tool_limit_vs_usage](feedback_distinguish_tool_limit_vs_usage.md) — pattern คล้ายกัน "อย่าออกแบบจากศูนย์ถ้ามีของอยู่"
- หลักการ "Don't write code. Read code." — extension ของ "Don't rebuild. Reuse."
