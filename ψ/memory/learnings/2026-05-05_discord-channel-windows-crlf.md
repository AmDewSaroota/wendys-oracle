# Lesson: Discord Channel Setup on Windows -- CRLF Trap

**Date**: 2026-05-05
**Source**: rrr: discord-channel-setup
**Tags**: #discord #channels #windows #crlf #env

## Pattern

When creating `.env` files for Claude Code plugins on Windows, the Write tool saves with CRLF line endings by default. The Discord channel plugin (and likely other Unix-oriented plugins) expects LF only. CRLF causes the bot token to include a trailing `\r` character, making authentication silently fail.

## Fix

After writing `.env` on Windows, convert to LF:
```bash
sed -i 's/\r$//' ~/.claude/channels/discord/.env
```

Or use a tool/editor that saves as LF explicitly.

## Also Learned

- Discord bot token format: `{base64_client_id}.{timestamp}.{hmac}` -- decode first segment to get client ID for invite URL
- `claude --channels plugin:discord@claude-plugins-official` must be used every session for bot to go online
- After `npm install -g @anthropic-ai/claude-code@latest`, may need to re-authenticate (OAuth flow)
- Message Content Intent must be enabled in Discord Developer Portal for bot to read messages
