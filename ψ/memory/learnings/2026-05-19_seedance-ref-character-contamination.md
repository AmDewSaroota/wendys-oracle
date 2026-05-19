# Seedance Ref Character Contamination

## Pattern
ทุก ref image ที่มี character/person อยู่ในนั้น จะ leak character นั้นเข้า video generation

## Evidence
- UI1-4.png มีพี่เหลือง (yellow shirt) เป็น main character → Seedance เอาพี่เหลืองมาเป็น protagonist ทุกครั้ง
- Game1.png มีตัวละคร 3D rounded → Seedance gen ออกมา 3D rounded แม้จะบอกว่าต้อง flat boxy

## Rule
ก่อนแนบ ref ใดก็ตาม ต้องถามว่า "ref นี้มี character อยู่มั้ย?" ถ้ามี → เตือน DewS ก่อนเสมอว่า character จะ contaminate

## Fix
- ถ้าต้องใช้ ref ที่มี character: บอกชัดว่า "character style ONLY, ignore character appearance from this ref"
- ถ้า character ใน ref ไม่ใช่ที่ต้องการ: หา ref ที่ไม่มี character แทน หรือบรรยายเป็นคำ
