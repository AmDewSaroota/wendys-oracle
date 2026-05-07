# Lesson — Re-sync Global Memory Before Commit

**Date**: 2026-05-07
**Source**: Sped-up Sim build session — needed two `/sync push` because memory edit between commits

## What Happened

ระหว่าง session ที่ build sped-up sim:
1. แก้ memory file (`workshop_pending_tasks.md`) เพื่ออัปเดต task progress
2. ทำ `/sync push` ครั้งแรก (commit `af43e0d`)
3. หลังจากนั้นแก้ memory file อีกรอบ (Response Form ✅ ส่งแล้ว)
4. คิดว่า push ครบแล้ว → DewS ถาม "ส่งครบยัง"
5. เช็ค `git status` → memory file ใหม่ยังไม่อยู่ใน repo sync folder
6. ต้องทำ `/sync push` รอบ 2 (commit `e581b0b`) — re-copy + commit

## Why It Happened

`/sync push` skill copy global memory → repo sync folder ครั้งเดียวที่ start of push
แต่ถ้าแก้ global memory **หลัง copy** ในระหว่าง session นั้น → diff เห็นใน global file แต่ไม่เห็นใน repo

`git status` แสดงเฉพาะการเปลี่ยนแปลงใน working tree (= repo sync folder) → คิดว่า "ไม่มีอะไรค้าง"

## The Rule

**ก่อน commit ใน /sync push เสมอ — re-run global → repo copy step**

Pattern:
```bash
# 1. Always copy first (idempotent)
Copy-Item -Recurse -Force <global> <repo-sync>
# 2. Then check git status
git status
# 3. Then add + commit
```

ถ้าจะแก้ skill: เพิ่ม implicit re-copy step ก่อน git add

## How to Apply

- ก่อน commit ทุกครั้งใน sync flow → re-run copy step ไม่ต้องเชื่อ git status เพียว
- ถ้า session มีการแก้ memory หลายรอบ → re-copy หลายรอบ
- **อย่าทึกทักว่า "ก็ push ไปแล้ว"** — ตรวจ `git log origin/main..HEAD` กับ `git status` ทั้งคู่
