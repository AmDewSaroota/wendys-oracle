---
title: Oracle v2 MCP Installation & First 25 Days Patterns
tags: [oracle-v2, mcp, windows, tuya, iot, supabase, memory, infrastructure]
created: 2026-02-17
source: rrr --deep: wendys-oracle
---

# Oracle v2 MCP Installation & First 25 Days Patterns

## Pattern 1: Infrastructure Before Content

Installing Oracle v2 (searchable memory layer) before writing learnings makes every future pattern capture more valuable. The order matters:
1. Build memory structure (ψ/)
2. Install search infrastructure (Oracle v2 MCP)
3. Then start recording learnings
4. Each learning is immediately searchable

**Confidence**: High — validated by this session.

## Pattern 2: Windows is Always the Edge Case

Every developer tool assumes Unix. On Windows + Git Bash:
- `better-sqlite3` native module fails in Bun → use `bun:sqlite` instead
- `uvx` (Python) unavailable → ChromaDB vector search disabled, FTS5 fallback works
- `claude mcp add` can't run inside Claude Code session → edit `~/.claude.json` directly
- Frontend `dist/` ships without compiled assets → must `bun run build` manually
- Path separators need forward slashes in config even on Windows

**Reusable fix**: Always test on Windows before declaring "installation complete."

## Pattern 3: Multi-Language Implementation Reveals Truth

Building the same Tuya integration in 3 languages (Python, JS, TypeScript):
- Python: Good for exploration and debugging API responses
- JavaScript (Bun): Good for local automation scripts
- TypeScript (Deno): Good for serverless Edge Functions

Each caught different edge cases. The HMAC-SHA256 signing logic was verified correct when all three produced identical results.

**Reusable**: When uncertain about API behavior, implement in 2+ languages to cross-verify.

## Pattern 4: Append-Only Philosophy Scales

After 25 days and 9 commits:
- 1,387 lines added, only 31 deleted
- Zero data loss
- Context preserved across 10.5-hour and 25-day gaps
- Commit messages serve as emotional bookmarks ("SUCCESS!", "Complete!")

The "Nothing is Deleted" principle isn't just philosophy — it's a working data architecture.

## Pattern 5: Celebration Markers in Git History

DewS uses exclamation marks in commit messages to mark breakthroughs:
- "Tuya integration SUCCESS!"
- "Complete Tuya → Supabase integration!"

These serve as emotional waypoints when scanning `git log`. Future retrospectives can identify moments of joy, not just code changes.

## Pattern 6: Secrets Management Evolution

Observed progression:
1. Hardcoded in source code (bad but fast)
2. Moved to `.env` files (better, local only)
3. Platform environment variables (best — Supabase Edge Functions)

**Learning**: Start with platform env vars from day one. The "quick hardcode" always persists longer than expected.

## Pattern 7: Oracle v2 MCP Gives 19 Tools

Tools available after installation:
- Search & Discovery: `oracle_search`, `oracle_list`, `oracle_concepts`, `oracle_stats`
- Guidance: `oracle_consult`, `oracle_reflect`
- Learning: `oracle_learn`, `oracle_supersede`
- Forum: `oracle_thread`, `oracle_threads`, `oracle_thread_read`, `oracle_thread_update`
- Decisions: `oracle_decisions_create/list/get/update`
- Traces: `oracle_trace`, `oracle_trace_list/get/link/unlink/chain`

Indexed 38 documents from 3 resonance files. FTS5 keyword search works without vector DB.

## Connection to Past Learnings

This is the first learning file for WEnDyS. No past learnings exist to connect to. This file establishes the baseline.

---
*Added via Oracle Learn (rrr --deep)*
