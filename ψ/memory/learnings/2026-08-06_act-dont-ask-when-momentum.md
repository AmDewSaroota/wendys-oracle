# Lesson: จังหวะสำคัญกว่าความสุภาพ — momentum มา ต้องลงมือ ไม่ถาม

**Date**: 2026-08-06
**Context**: เซสชันทำใบเสนอราคา EcoStove ESP32-CAM — consulting ยาว DewS ไล่คำถามเร็ว

## Pattern
เมื่อ DewS ยิงคำถามถี่ๆ หรืออยู่โหมดตัดสินใจเร็ว การปิดท้ายทุกคำตอบด้วย "จะให้ทำ X ไหมคะ" = friction. DewS หลุด 3 ครั้งในเซสชันเดียว ("ถามไรเยอะ", "ทำๆ ไปสิ", "ไม่ต้องถามถี่ๆ ไม่มีเวลามานั่งกดให้ตลอด").

## Rule
- ทิศทางชัด → ลงมือเลย ไม่ขอ confirm ทุกก้าว (มี `feedback_just_act_no_clarify` อยู่แล้ว — ต้องทำจริง)
- ถ้าต้องแก้หลายไฟล์ + เห็นว่า DewS รำคาญ permission → เสนอ allow edit / update-config ตั้งแต่แรก
- เก็บคำถามไว้เฉพาะจุดที่ตัดสินใจแทนไม่ได้จริงๆ (ชื่อ/เลขบัญชี/ข้อมูลที่เดาไม่ได้)

## Bonus lessons
- **ราคา verify จากแหล่งจริง**: WebFetch ได้กับร้านไทย (mcucity/appsofttech), Shopee/Lazada บล็อกบอท → ขอ screenshot
- **บริษัท VAT-registered เลี่ยง VAT ไม่ได้** → งบเต็มต้องจ้างบุคคลธรรมดา (WHT 3% เครดิตคืนได้)
- **อย่าสู้ CSS pagination วนหลายรอบ** — ตัดสินใจเด็ดขาดรอบเดียว (ยอม 2 หน้า หรือลด font ทีเดียว)

เกี่ยวข้อง: [[feedback_just_act_no_clarify]] · [[feedback_dated_output_filenames]] · [[feedback_no_praise]]
