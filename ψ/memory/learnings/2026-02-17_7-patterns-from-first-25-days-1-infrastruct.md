---
title: ## 7 Patterns from First 25 Days
tags: [oracle-v2, mcp, windows, tuya, iot, supabase, memory, infrastructure, patterns]
created: 2026-02-17
source: rrr --deep: wendys-oracle
---

# ## 7 Patterns from First 25 Days

## 7 Patterns from First 25 Days

1. **Infrastructure Before Content** � Install searchable memory (Oracle v2 MCP) before writing learnings. Each future pattern becomes immediately queryable.

2. **Windows is Always the Edge Case** � Every dev tool assumes Unix. Budget extra time: better-sqlite3 fails in Bun, uvx unavailable, path separators need forward slashes.

3. **Multi-Language Implementation Reveals Truth** � Building same Tuya integration in Python/JS/TS cross-verified HMAC-SHA256 signing and caught edge cases each language missed.

4. **Append-Only Philosophy Scales** � 25 days, 9 commits, 1387 lines added, 31 deleted. Zero data loss. Context preserved across 25-day gap.

5. **Celebration Markers in Git History** � Exclamation marks in commit messages ("SUCCESS!", "Complete!") are emotional waypoints for future retrospectives.

6. **Secrets Management Evolution** � Hardcoded ? .env ? Platform env vars. Start with platform env vars from day one.

7. **Oracle v2 MCP = 19 Tools** � FTS5 keyword search works without ChromaDB. 38 docs indexed from 3 resonance files.

---
*Added via Oracle Learn*
