# Google Auth & MCP Setup on Windows

**Date**: 2026-04-17
**Source**: rrr: tuya-renewal-gcal-mcp-setup
**Tags**: google, mcp, oauth, windows, gcloud, tuya

## Lessons

### 1. Google blocks automated browser login
- Playwright/Puppeteer Chromium is detected and rejected by Google Sign-in
- "This browser or app may not be secure" error
- **Always use gcloud CLI** for Google auth instead of browser automation
- `gcloud auth login` opens user's default browser — safe and works

### 2. Windows paths in JSON — use forward slashes
- Node.js `JSON.stringify` with `\\` can silently strip backslashes
- `C:\Users\CPL\.claude\file.json` becomes `C:UsersCPL.claudefile.json`
- **Fix**: Always use forward slashes: `C:/Users/CPL/.claude/file.json`
- Windows Node.js handles forward slashes just fine

### 3. Claude Code MCP config location
- MCP servers go in `.claude.json` under `projects.{path}.mcpServers` — NOT in `settings.json`
- Use `claude mcp add` CLI command, then manually fix env if needed
- `claude mcp add-json` expects strict format — easier to add then edit

### 4. Tuya IoT Core Trial Extension
- Trial can't be "renewed" but CAN be "extended"
- Requires form: Developer Identity, Connected Devices, Project Overview
- Frame as **Individual Developer / personal smart home** (not research)
- Auto-approved instantly for 6 months
- Must repeat before each expiration
