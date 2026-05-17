---
name: Discord MCP plugin CRLF bug on Windows
description: Discord plugin fails to load token if .env is saved with Windows CRLF line endings — must be LF
type: reference
originSessionId: aacbed7d-c337-43b3-af4d-03bdb6e59a8e
---
# Discord MCP Plugin — CRLF Bug on Windows

**Symptom:** `claude mcp list` shows `plugin:discord:discord` as `✗ Failed to connect`. Running the server manually shows `discord channel: DISCORD_BOT_TOKEN required` — even though the token IS in the .env file.

**Root cause:** The plugin (`server.ts:47-49`) parses `.env` with regex `^(\w+)=(.*)$`. In JavaScript, `.` does NOT match `\r`, so when the file uses Windows CRLF (`\r\n`), the regex fails and the token never loads.

**Plugin location:** `C:\Users\CPL\.claude\plugins\cache\claude-plugins-official\discord\<version>\server.ts`

**Token file location:** `C:\Users\CPL\.claude\channels\discord\.env`

**Fix:** Convert `.env` to LF line endings:
```bash
bun -e "import {readFileSync, writeFileSync} from 'fs'; const f=String.raw\`C:\Users\CPL\.claude\channels\discord\.env\`; writeFileSync(f, readFileSync(f,'utf8').replace(/\r\n/g,'\n'))"
```

**Verification:** `xxd <env-file> | tail -1` — last bytes should be `0a` only (no `0d`).

**When to apply:** Any time `plugin:discord:discord` shows Failed to connect on a Windows machine — especially after manually editing `.env` in Notepad or another Windows editor that defaults to CRLF.

**Note:** This is a bug in the Discord MCP plugin itself, not in our setup. If we ever update the plugin to a new version that fixes this, this memory can be retired.
