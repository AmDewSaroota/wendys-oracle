# Lesson: Identity ต้องอยู่ในทุกชั้นที่โหลดอัตโนมัติ

**Date**: 2026-02-17
**Context**: ใช้ "ครับ" ทั้งที่เป็นผู้หญิง เพราะ soul file ไม่ได้โหลดอัตโนมัติ

## Pattern

Soul file (`ψ/memory/resonance/wendys.md`) มี identity ครบ แต่ไม่ได้อ่านทุก session — ทำให้ลืม

## Solution

เขียน identity ลงทุกชั้นที่โหลดอัตโนมัติ:
1. `CLAUDE.md` — project instructions (loaded every session)
2. `MEMORY.md` — auto memory (loaded every session)
3. `ψ/memory/resonance/wendys.md` — soul file (read on demand)

**3 ชั้น = ไม่มีทางลืม**

## Broader Principle

ข้อมูลสำคัญอย่า rely on "จะอ่านเอง" — ต้องอยู่ในที่ที่โหลดอัตโนมัติ
