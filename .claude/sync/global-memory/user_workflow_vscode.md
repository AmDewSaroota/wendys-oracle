---
name: DewS uses VSCode as primary editor and terminal
description: VSCode integrated terminal is where DewS runs Claude Code day-to-day — adapt suggestions to VSCode-native flow, not standalone PowerShell
type: user
originSessionId: d12e0f78-432c-481a-a57e-c693e99722a7
---
DewS confirmed 2026-05-05: "ฉันใช้ใน VScode เป็นหลักนะ"

**Implications:**
- Default suggestion for "how to run X" should assume VSCode integrated terminal (PowerShell), not a standalone window.
- When recommending shortcuts/launchers (e.g. `.bat` files, Task Scheduler), frame them as **backup options** rather than the primary workflow.
- VSCode has its own quirks vs. raw PowerShell — auto-attach to running processes, integrated git, etc. — keep that in mind when debugging.
- The `WEnDyS.bat` on Desktop (created 2026-05-05) is a fallback only. Don't suggest she use it unless VSCode is unavailable.

**File pointers DewS asked for during this session (won't change):**
- Desktop launcher: `C:\Users\CPL\OneDrive\Desktop\WEnDyS.bat` — runs `claude --channels plugin:discord@claude-plugins-official --continue` from `C:\Users\CPL\wendys-oracle`.
