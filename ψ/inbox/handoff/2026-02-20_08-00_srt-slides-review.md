# Handoff: SRT Slides Review & Presentation Prep

**Date**: 2026-02-20 08:00
**Context**: ~70%

## What We Did
- แก้ปัญหาเข้า serveo URL ไม่ได้บน PC (502 Bad Gateway — tunnel หลุด)
- ดึงสไลด์ Supplementary (17 หน้า) จาก MHTML cache มือถือ → แปลงเป็น standalone HTML ที่ใช้งานได้
- สร้าง `SRT Smart Hub Platform — Supplementary Slides (Fixed).html` พร้อม JS navigation
- ใช้ dev-browser เข้า Google Slides (28 หน้า) อ่านโครงสร้างทั้ง deck
- วิเคราะห์ตำแหน่งแทรก Supplementary → Google Slides (แนะนำ 2 แนวทาง)
- Review + ปรับภาษาสไลด์หลายหน้า:
  - **API Communication Flow**: อธิบาย JWT, MQTT, Stream Processor, Time-Series DB
  - **SRT BOT: How It Works**: แก้ Fine-tune → RAG, Temperature → ภาษาคน, tokens → ภาษาคน
  - **Security & PDPA**: ปรับศัพท์เทคนิค + แยกว่า Kiosk ไม่ต้อง login
  - **Offline & Fallback**: ปรับภาษาทั้งหมด + อธิบาย Cloud services
  - **KPIs**: ปรับ DAU, NPS, Uptime เป็นภาษาไทย
- เขียน presentation script สำหรับ API Flow + SRT BOT หน้า
- สร้าง **icons-collection.html** — 84 emoji ก๊อปใส่สไลด์ได้ (emoji style ตรงกับ SRT slides)
- บันทึก SRT Slides info ลง MEMORY.md

## Pending
- [ ] รวม Supplementary slides เข้า Google Slides จริง (ตัด slide 12 Timeline + slide 13 Budget)
- [ ] ย้าย Security & PDPA + Offline & Fallback ไปท้ายสุดก่อน Summary
- [ ] ปรับภาษาในสไลด์จริง (ทั้ง Google Slides + HTML) ตามที่ review ไว้
- [ ] เขียน presentation script ที่เหลือ (Security, Offline, KPI, etc.)
- [ ] หาตัวเลขรองรับ (2,000+ FAQ, 50+ สถานที่, 500 ครั้ง/วัน Kiosk)

## Next Session
- [ ] ลงมือปรับ Google Slides ตามแผน (แทรก + ย้ายลำดับ)
- [ ] เขียน presentation script ครบทุกหน้า
- [ ] ซ้อมพรีเซนต์ — ดูว่าแต่ละหน้าใช้เวลาเท่าไหร่

## Key Files
- `e:\01_Work\_NDF\SMART RAIL TOURISM ASSISTANT\SRT Smart Hub Platform — Supplementary Slides (Fixed).html`
- `e:\01_Work\_NDF\SMART RAIL TOURISM ASSISTANT\icons-collection.html`
- Google Slides: `1dVI8UzR5DgMtvJeNw4neUfIwyCWSZ8IacM-8xP21Nhs`
- Deploy: `https://srt-slides.vercel.app/` (password: ndfai)

## Key Decisions
- สไลด์ใช้ **emoji** เป็นไอคอน ไม่ใช่ SVG
- Security & PDPA + Offline ควรอยู่ท้าย deck (ครอบคลุมทุกระบบ)
- Fine-tune → เปลี่ยนเป็น RAG (ถูกต้องตาม architecture)
- ศัพท์เทคนิคทั้งหมดต้องเปลี่ยนเป็นภาษาคน (Temperature, tokens, RBAC, WAF, etc.)
