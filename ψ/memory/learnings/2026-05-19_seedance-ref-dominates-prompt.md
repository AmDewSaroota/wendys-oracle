# Seedance: Ref Image Dominates Text Prompt

**Date**: 2026-05-19
**Project**: NDF Promo

## Pattern

Ref image มีอำนาจเหนือ text prompt มาก — ถ้า ref เป็น forest Seedance จะ gen forest เสมอ ต่อให้ negative prompt ชัดแค่ไหนก็ตาม

## วิธีแก้

**เปลี่ยน ref** ก่อนเป็นอันดับแรก ไม่ใช่แค่เพิ่ม negative prompt

ลำดับความสำคัญ: ref image > negative prompt > text description

## Real Footage Style

"ดูเหมือนถ่ายจากมือถือจริง" = credibility + copyright safety ในครั้งเดียว:
- ใช้ `手持摄像，真实记录风格，轻微自然抖动` แทน cinematic drone
- ไม่ต้องพยายามทำ set ให้ต่างจาก real มากเพราะ context จริงอยู่แล้ว
- แค่เปลี่ยน IP content (ตัวละคร, โลโก้) ไม่ต้องเปลี่ยนทุกอย่าง

## Hex Code = On-Screen Text

ห้ามใช้ `#FF6B00` หรือ hex code ใดๆ ใน Seedance prompt
Seedance render ตัวอักษรนั้นบนผนัง/พื้นผิวในวิดีโอ
ใช้ชื่อสีแทนเสมอ: 橙色, 青色, 深海蓝
