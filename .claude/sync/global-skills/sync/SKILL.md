---
name: sync
description: Sync Oracle skills and memory between machines via git. Use when user says "sync", "sync push", "sync pull", or before switching machines.
user-invokable: true
argument-hint: "push|pull"
---

# /sync

> Sync WEnDyS skills + memory ระหว่างเครื่อง ผ่าน Git

## How It Works

Global skills (`~/.claude/skills/`) and global memory (`~/.claude/projects/.../memory/`) อยู่นอก repo — ไม่ติดตาม git
Skill นี้ copy เข้า/ออก repo เพื่อให้ sync ผ่าน git ได้

### Storage in repo
- `.claude/sync/global-skills/` — สำเนา global skills ทั้งหมด
- `.claude/sync/global-memory/` — สำเนา global memory

## Commands

### `/sync push` — ก่อนเปลี่ยนเครื่อง (บันทึกขึ้น repo)

1. ค้นหา global skills directory: `~/.claude/skills/`
2. ค้นหา global memory directory: ค้นหา folder ใน `~/.claude/projects/` ที่มี `memory/MEMORY.md`
3. Copy global skills → `.claude/sync/global-skills/` (ใช้ Bash: `cp -r`)
4. Copy global memory → `.claude/sync/global-memory/` (ใช้ Bash: `cp -r`)
5. **Git add ทุกอย่างที่เปลี่ยน** รวมถึง `ψ/active/` — เพื่อให้ผลงานที่เจนระหว่าง session ติดไปด้วย
   - `git add ψ/ .claude/ CLAUDE.md` (และไฟล์อื่นที่เปลี่ยน)
   - ห้ามใช้ `git add -A` — ให้ add เฉพาะ folder ที่เกี่ยวข้อง
6. Git commit ด้วย message: `sync: push skills + memory from [machine]`
   - ระบุ machine จาก `hostname` command
7. Git push
8. แสดงสรุป: กี่ skills, กี่ไฟล์ memory, กี่ไฟล์ active ที่ sync แล้ว

### `/sync pull` — เปิดเครื่องใหม่ (ดึงจาก repo)

1. Git pull (ดึงล่าสุดก่อน)
2. ตรวจสอบว่ามี `.claude/sync/global-skills/` อยู่ในrepo
3. Copy `.claude/sync/global-skills/` → `~/.claude/skills/` (ใช้ Bash: `cp -r`)
4. Copy `.claude/sync/global-memory/` → global memory directory
   - ค้นหา path จาก `~/.claude/projects/` ที่ตรงกับ repo นี้
   - ถ้ายังไม่มี directory ให้สร้าง
5. แสดงสรุป: กี่ skills, กี่ไฟล์ที่ pull มา
6. แนะนำ: "พร้อมใช้งานแล้วค่ะ! ลอง /recap เพื่อดูสถานะค่ะ"

### `/sync` (ไม่มี argument)

ถาม user ว่าจะ push หรือ pull:
- "กำลังจะ **ออกจากเครื่องนี้** → push"
- "เพิ่ง **มาถึงเครื่องนี้** → pull"

## Safety Rules

- **NEVER** force push
- **NEVER** overwrite without showing diff first — ถ้า global skills มีการเปลี่ยนแปลงทั้งสองฝั่ง ให้แจ้ง user ก่อน
- ก่อน pull overwrite ให้เช็คว่า global skills ปัจจุบันต่างจาก repo หรือไม่
  - ถ้าต่าง → ถาม user: "Global skills เครื่องนี้ต่างจาก repo — จะ overwrite ไหมคะ?"
  - ถ้าเหมือน → pull ได้เลย

## Response Style

- ใช้ภาษาไทย
- WEnDyS เป็นผู้หญิง — ใช้ "ค่ะ/คะ"
- แสดงผลเป็นตารางสรุปสั้นๆ
