---
name: Oracle (Claude Code) ดูวิดีโอไม่ได้ — ใช้ Gemini ช่วยบรรยาย
description: WEnDyS อ่าน image/PDF ได้ แต่ video ไม่ได้ — DewS ใช้ Gemini transcribe หรือบรรยายเอง
type: reference
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# Oracle Video Limitation + Gemini Workaround

**Capability**: Claude Code (Oracle/WEnDyS) สามารถอ่านได้:
- ✅ **รูป**: PNG, JPG, JPEG, GIF, WebP
- ✅ **PDF**: หลายหน้า (ระบุ pages parameter)
- ✅ **Notebook**: Jupyter (.ipynb) พร้อม cells + outputs
- ❌ **วิดีโอ**: MP4, MOV, AVI, etc. — **อ่านไม่ได้**
- ❌ **ไฟล์เสียง**: MP3, WAV — **อ่านไม่ได้**

**DewS's Workflow Workaround สำหรับวิดีโอ**:
1. **ใช้ Gemini ช่วยบรรยาย** — Gemini เปิดวิดีโอใน browser tab → DewS สั่งให้บรรยาย → ส่งคำบรรยายให้ Oracle อ่าน
2. **DewS บรรยายเอง** — DewS ดูคลิปแล้วเล่าให้ Oracle ฟัง (ปัญหา/ข้อสังเกต)
3. **ส่ง screenshots** — DewS แคปเฟรมสำคัญจากวิดีโอ → ส่งเป็นรูปให้ Oracle ดู (Oracle อ่านรูปได้)

**บริบทที่ใช้บ่อย** (Seedance dragon project):
- Playblast จาก Maya → Oracle ดูไม่ได้ → ใช้วิธี 1 หรือ 2
- ผลคลิปจาก Dreamina → Oracle ดูไม่ได้ → ใช้วิธี 1 หรือ 2
- Reference video (movie scenes) → Oracle ดูไม่ได้ → ใช้วิธี 1

**How to apply**:
- ก่อนพูดถึงวิดีโอ → จำว่าหนูดูเองไม่ได้
- ขอ Gemini description หรือ DewS describe ก่อนวิเคราะห์
- ห้ามแกล้งทำเป็น "เห็น" วิดีโอ — ขอข้อมูลทันที
- ถ้า DewS บอกว่าวิดีโอแบบนั้นแบบนี้ → trust description นั้น

**Related**:
- มี skill `gemini` (ψ skills) ที่ control Gemini ผ่าน MQTT WebSocket — อาจใช้ส่งคำสั่ง describe ตรงไปได้
- มี skill `watch` สำหรับ YouTube → อาจใช้ Gemini transcribe URL ได้
