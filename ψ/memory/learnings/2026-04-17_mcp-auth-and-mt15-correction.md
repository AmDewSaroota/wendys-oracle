# Lessons Learned — 2026-04-17

## MCP Token Auth: Terminal First

- Google Calendar MCP token expires every 7 days when OAuth app is in "Test Mode"
- Fix: `npx @cocal/google-calendar-mcp auth` from terminal — instant re-auth
- Permanent fix: Publish app in Google Cloud Console → OAuth Consent Screen
- Config lives in `C:\Users\CPL\.claude.json` under `projects.mcpServers`, NOT in VS Code settings
- Token stored at `C:\Users\CPL\.config\google-calendar-mcp\tokens.json`

## MT15 is the Main Sensor (not MT13W)

- Switched from MT13W to MT15 as of 2026-04-17
- MT15 button mapping: 1=temp unit, 2=sound, 3=display, **4=calibrate (120s)**, 5=WiFi pair
- MT13W button mapping: 1=temp unit, 2=sound, **3=calibrate**
- CRITICAL: Don't mix these up in training docs — different hardware, different button count
- All 6 MT15 sensors already paired + stickered (BS 001-006)

## Training Context Awareness

- Empty DB tables before a training session = expected, not an error
- Don't flag "collection_periods is empty!" when the whole point is teaching admins to create them
- Always ask "what's the meeting goal?" before auditing readiness

## Tags

`mcp`, `google-calendar`, `oauth`, `mt15`, `sensor`, `calibrate`, `training`, `ecostove`
