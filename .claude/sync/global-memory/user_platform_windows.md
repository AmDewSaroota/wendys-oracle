---
name: DewS uses Windows primarily, not Mac
description: Both WEnDyS twin machines run Windows — never assume Mac/Linux paths or POSIX-only tooling without flagging the Windows alternative
type: user
originSessionId: d12e0f78-432c-481a-a57e-c693e99722a7
---
DewS confirmed 2026-05-05: "ฉันส่วนใหญ่ใช้วินโดว์นะ ไม่ใช่ MAC"

Both machines run Windows:
- พี่เวนดี้ 💻 = โน้ตบุ๊ค (DewSNitro)
- น้องเวนดี้ 🖥️ = PC

**Implications when recommending tools / install paths:**

- Default to PowerShell or cross-platform commands. Bash/zsh examples need a "if you're on Windows" alternative.
- Watch for POSIX-only assumptions: `~/`, `/usr/local`, symlinks, tmux, fork(), case-sensitive paths.
- WSL is **not** installed by default. Don't assume `wsl` works — verify first.
- Tools that require tmux (e.g. maw swarm, maw t) won't run natively. Either install WSL+tmux or skip.
- Path separators and quoting differ: `C:\Users\CPL\...` (PS) vs `/c/Users/CPL/...` (Bash). Be explicit.
- File line endings: Windows defaults to CRLF — known to break some POSIX tools (see `memory/discord-mcp-crlf-bug.md`).
- When a guide is Mac-first, surface the Windows path before having DewS run anything irreversible.

If a tool genuinely requires a non-Windows runtime, say so upfront so DewS can decide whether to install WSL or skip — don't lead her through the install only to hit a Windows wall at the end (lesson from the maw-js workshop).
