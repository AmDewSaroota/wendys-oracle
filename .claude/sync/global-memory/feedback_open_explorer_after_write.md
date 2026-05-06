---
name: Open Explorer after creating any file
description: ALWAYS open Windows Explorer to the file location after writing/creating any file
type: feedback
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# Open Explorer after every file creation

**Rule**: ทุกครั้งที่ WEnDyS สร้าง/เขียนไฟล์ → ต้องเปิด Windows Explorer ไปที่ folder ที่วางไฟล์ไว้ทันที (และ select ไฟล์นั้น)

**Why**:
- DewS ต้องการเห็นไฟล์ในตำแหน่งจริง — ไม่ใช่แค่ link ในแชท
- บางครั้งไฟล์เปิดใน VSCode ไม่ได้ (encoding / path ψ issue) → Explorer ช่วยให้เปิดด้วย app อื่นได้
- เห็น context รอบๆ (ไฟล์เพื่อนบ้าน, folder structure)

**How to apply**:
- หลัง `Write` tool ทุกครั้ง → รัน PowerShell: `Start-Process explorer.exe -ArgumentList '/select,"<full path>"'`
- ถ้า path มี ψ หรือ Unicode → ต้องใช้ PowerShell (Bash explorer.exe ใช้ไม่ได้กับ Unicode path)
- ถ้าสร้างหลายไฟล์ใน session เดียว → เปิด folder หลักครั้งเดียวก็พอ (ไม่ต้องเปิดทุก subfolder)
- ถ้าแก้ไฟล์เดิม (Edit tool) → ไม่ต้องเปิด (DewS น่าจะเปิดไฟล์อยู่แล้ว)

**Command pattern (PowerShell — ใช้ได้กับ Unicode path)**:
```powershell
Start-Process explorer.exe -ArgumentList '/select,"<absolute_path_with_filename>"'
```

**Reliability tip**:
- ถ้าอยากให้แน่นอน 100% — set up PostToolUse hook ใน `.claude/settings.json` สำหรับ Write tool
- DewS ยังไม่ได้สั่ง set hook — แค่บอกให้จำ → ใช้ memory ไปก่อน
