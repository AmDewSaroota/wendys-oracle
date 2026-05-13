# Voice Lock Brief + Permission Allowlist

**Date**: 2026-05-13
**Tags**: ai-video, voice-lock, permissions, windows

## Lessons

### Voice Lock Brief
เวลาเขียน brief ที่มี Voice Lock — ถ้าไม่มี prior scene ต้อง **นิยาม voice descriptor จาก scratch** เสมอ
ห้าม reference "scene ก่อนหน้า" ถ้า scene นั้นไม่มีอยู่ใน context — จะทำให้ Oracle สับสน

### Permission Allowlist (2026-05-13)
เพิ่มใน `.claude/settings.json`:
- `PowerShell(Start-Process explorer *)` — เปิด Explorer ไปที่ folder (ถูกถาม 13 ครั้ง)
- `mcp__plugin_discord_discord__fetch_messages` — อ่าน Discord messages (ถูกถาม 12 ครั้ง)

### Windows File Open
PowerShell `Start-Process` = วิธีเดียวที่ถูกต้องสำหรับเปิดไฟล์บน Windows
Bash `start ""` ไม่ทำงาน, `code` command อาจผิด binary — ใช้ PowerShell เสมอ
