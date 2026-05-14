---
name: 3D preview keyframes ดึง gray aesthetic เสมอ
description: Seedance/Higgsfield จะดึงสีเทาจาก 3D preview frames แม้ enhanced สีแล้ว
type: feedback
---

3D preview keyframe refs (แม้ enhance สีใน Higgsfield แล้ว) ยังทำให้ผลออกมาแย่กว่า free-text prompt ที่ไม่มี keyframe refs

**Why:** Model ดึง gray/CG aesthetic จาก preview geometry และ lighting ที่ baked เข้าไปในรูป

**How to apply:** ถ้า playblast เป็น gray 3D preview → อย่าใช้เป็น video/image ref ใน Seedance → ใช้ text + final art ref แทน
