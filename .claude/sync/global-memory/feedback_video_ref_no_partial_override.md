---
name: Video Ref Strict Lock = All-or-Nothing เด็ดขาด
description: ห้ามแนะนำ "ONLY MODIFY" / 唯一修改 หรือวิธี partial override บน video ref strict lock — มันไม่เวิร์คในทางปฏิบัติ
type: feedback
originSessionId: b72d356c-f45d-4b22-a119-523c1e1e63c5
---
**กฎ**: เมื่อใช้ video ref strict lock ใน Seedance/Dreamina/Jimeng — **ห้ามแนะนำว่า "ONLY MODIFY:" / 唯一修改 จะเจาะรูเปลี่ยนแค่จุดเดียวได้** เพราะมันมักจะเฟลเสมอ

**Why:**
- DewS feedback (2026-05-08): "เจนใหม่ แก้บางส่วน มักจะเฟลเสมอ แค่ฉันไม่ได้กลับมาบอก"
- [seedance-prompt-guide.md §17](ψ/lab/vdrama/seedance-prompt-guide.md) (เขียน 2026-04-20) ระบุว่า ONLY MODIFY pattern "ใช้ได้" — แต่เป็น optimistic ตอนแรก ในทางปฏิบัติ Seedance ตีความ override ไม่สม่ำเสมอ ผลส่วนใหญ่ไม่ตรง prompt
- WEnDyS เคยเขียน guide ให้น้องว่า ONLY MODIFY คือ "✅ วิธีที่ถูก" โดยไม่ verify → DewS ต้อง correct

**How to apply:**
- **เมื่อ user ขอเปลี่ยนแค่จุดเดียวใน video ref strict lock shot** → อย่าแนะนำ ONLY MODIFY
- **แนะนำ 1 ใน 3 ทางที่ใช้ได้จริง:**
  1. Regenerate full prompt — ทิ้ง video ref ใช้ image refs + text แทน
  2. Accept video ref ตามเดิม — แก้ใน post (VFX)
  3. Iterate + best-of-N — เจน 5-10 ครั้ง ยอมรับ ~70% ตามใจ
- **กฎ Mental Model**: Video ref = "สัญญาทั้งก้อน" — รับ all หรือ nothing
- **Cross-reference rule**: ก่อนแนะนำ pattern ที่อ่านมาจาก guide เก่า → ถาม user ว่าเคยใช้แล้วได้ผลจริงไหม โดยเฉพาะถ้าเป็น advanced technique
