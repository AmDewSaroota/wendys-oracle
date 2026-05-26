# CODE SNIPPETS & PATTERNS — Soul-Brews-Studio / opensource-nat-brain-oracle
**Studied by WEnDyS — 2026-05-26**
> Source: `C:\Users\CPL\ghq\github.com\Soul-Brews-Studio\opensource-nat-brain-oracle`
> Original Oracle system: `laris-co/Nat-s-Agents` by Nat Weerawan (nazt)

---

## TABLE OF CONTENTS

1. [CLAUDE.md Modular Structure Pattern](#1-claudemd-modular-structure)
2. [psi/ Brain Directory Structure](#2-psi-brain-directory-structure)
3. [Session Activity Tracking Pattern](#3-session-activity-tracking)
4. [Multi-Agent MAW Pattern](#4-multi-agent-maw-pattern)
5. [Subagent Delegation Pattern](#5-subagent-delegation)
6. [Claude Agent SDK Patterns (TypeScript)](#6-claude-agent-sdk-patterns)
7. [MCP Server Pattern (Bun + Drizzle + FTS5)](#7-mcp-server-pattern)
8. [Three-Tier Search Pattern](#8-three-tier-search)
9. [DuckDB Markdown Query Pattern](#9-duckdb-markdown-query)
10. [Skill Architecture](#10-skill-architecture)
11. [Oracle MCP Architecture](#11-oracle-mcp-architecture)
12. [Knowledge Flow Pipeline](#12-knowledge-flow-pipeline)
13. [Plugin Development Pattern](#13-plugin-development)
14. [Speckit Workflow Pattern](#14-speckit-workflow)
15. [Scoring Algorithm for Context-Finder](#15-scoring-algorithm)
16. [Retrospective Format with Seeds](#16-retrospective-format)
17. [Distillation Pattern](#17-distillation-pattern)
18. [Oracle Python Starter Kit](#18-oracle-python-starter-kit)
19. [Anti-Patterns Documented](#19-anti-patterns)
20. [Philosophy Snippets](#20-philosophy-snippets)
21. [Unique Patterns vs WEnDyS](#21-unique-vs-wendys)

---

## 1. CLAUDE.md Modular Structure

**Unique insight**: Nat uses a LEAN hub CLAUDE.md (~500 tokens) with lazy-loaded modules in separate files.
This is more advanced than WEnDyS single-file CLAUDE.md.

### Hub File Navigation Table

```markdown
| File | Content | When to Read |
|------|---------|--------------|
| CLAUDE.md | Hub + golden rules | Every session start — Required |
| CLAUDE_safety.md | PR workflow, git ops | Before any git/file operation — Required |
| CLAUDE_workflows.md | Short codes (rrr, gogogo) | When using short codes — As needed |
| CLAUDE_subagents.md | All subagent docs | Before spawning agents — As needed |
| CLAUDE_lessons.md | Patterns, anti-patterns | When stuck or deciding — Reference |
| CLAUDE_templates.md | Retro template, issue templates | When creating retros — Reference |
```

### Migration Notice Pattern (Meta-Pattern Inside CLAUDE.md)

```markdown
> MIGRATION IN PROGRESS (Issue #57)
> This CLAUDE.md is being restructured to ultra-lean format (~500 tokens).
> Details moving to .claude/commands/*.md (lazy loaded).
> Current phase: Probation/Testing
> - Observe current patterns, don't assume old structure
> - Report issues/friction in retrospectives
> - Consolidate learnings after testing period
```

### 13 Golden Rules (Nat's CLAUDE.md)

```
1. NEVER use --force flags
2. NEVER push to main — always feature branch + PR
3. NEVER merge PRs — wait for user approval
4. NEVER create temp files outside repo — use .tmp/
5. NEVER use git commit --amend — breaks all agents (hash divergence)
6. Safety first — ask before destructive actions
7. Notify before external file access
8. Log activity — update focus + append activity.log
9. Subagent timestamps — show START+END time
10. Use git -C not cd — respect worktree boundaries
11. Consult Oracle on errors — search before debugging
12. Root cause before workaround — investigate WHY before alternatives
13. Query markdown, don't Read — use duckdb with markdown extension
```

Rule 13 is unique to Nat's system: treating markdown files as queryable databases.

---

## 2. psi/ Brain Directory Structure

```
psi/
+-- active/         "What am I researching?" (ephemeral — empty when done)
|   +-- context/    research, investigation
|
+-- inbox/          "Who am I talking to?" (tracked)
|   +-- focus.md               current task (overwrite each time)
|   +-- focus-agent-main.md    per-agent focus (avoids merge conflicts in MAW)
|   +-- focus-agent-1.md
|   +-- handoff/               session transfers
|   +-- external/              other AI agents
|
+-- writing/        "What am I writing?" (tracked)
|   +-- INDEX.md    blog queue
|   +-- [projects]  drafts, articles
|
+-- lab/            "What am I experimenting?" (tracked)
|   +-- [projects]  experiments, POCs
|
+-- incubate/       "What am I developing?" (gitignored)
|   +-- repo/       cloned repos via ghq
|
+-- learn/          "What am I studying?" (gitignored)
|   +-- repo/       cloned repos for reference
|
+-- memory/         "What do I remember?" (tracked)
    +-- resonance/          WHO I am (soul)
    +-- learnings/          PATTERNS I found
    +-- retrospectives/     SESSIONS I had (YYYY-MM/DD/HH.MM_slug.md)
    +-- logs/               MOMENTS captured (ephemeral)
```

### Git Tracking Rules

```
psi/active/*    gitignored   (ephemeral research)
psi/inbox/*     tracked      (live communication)
psi/writing/*   tracked      (publishing pipeline)
psi/lab/*       tracked      (experiments worth keeping)
psi/incubate/*  gitignored   (dev repos — too large)
psi/learn/*     gitignored   (study repos — too large)
psi/memory/*    tracked      (knowledge base)
```

### Key Pattern Not in WEnDyS: Per-Agent Focus Files

When multiple agents run in MAW (parallel worktrees), each agent has its own focus file:
- `focus-agent-main.md`
- `focus-agent-1.md`
- `focus-agent-2.md`

Without this, git rebase creates merge conflicts in focus.md.

### Install cloned repos via ghq

```bash
# Incubate (develop)
GHQ_ROOT=psi/incubate/repo ghq get https://github.com/org/repo

# Learn (study)
GHQ_ROOT=psi/learn/repo ghq get https://github.com/org/repo
```

---

## 3. Session Activity Tracking

**Every task requires TWO writes** — focus (overwrite) + activity log (append).

### Focus File (overwrite)

```bash
AGENT_ID="${AGENT_ID:-main}"
echo "STATE: working
TASK: [current task description]
SINCE: $(date '+%H:%M')" > psi/inbox/focus-agent-${AGENT_ID}.md
```

### Activity Log (append-only)

```bash
echo "$(date '+%Y-%m-%d %H:%M') | working | commit /trace command update" >> psi/memory/logs/activity.log
```

### State Machine

```
working    -> Actively doing task
focusing   -> Deep work, don't interrupt
pending    -> Waiting for input/decision
jumped     -> Changed topic (via /jump)
completed  -> Finished task
```

### Example Activity Log

```
2026-01-12 15:30 | working   | commit /trace command update
2026-01-12 15:35 | completed | commit done, PR created
2026-01-12 15:36 | working   | create session activity logging
2026-01-12 15:48 | pending   | waiting for DewS review
2026-01-12 16:01 | completed | activity logging implemented
```

---

## 4. Multi-Agent MAW Pattern

**MAW = Multi-Agent Workflow** — 5+ parallel Claude agents via git worktrees + tmux.

### Sync Pattern (Critical — Rebase over Merge)

```bash
ROOT="/Users/nat/Code/github.com/laris-co/Nat-s-Agents"

# 0. FETCH ORIGIN FIRST (prevents non-fast-forward push rejection)
git -C "$ROOT" fetch origin
git -C "$ROOT" rebase origin/main

# 1. Commit your work (in worktree)
git add -A && git commit -m "feat: my work"

# 2. Main rebases onto this agent's branch
git -C "$ROOT" rebase agents/N

# 3. Push IMMEDIATELY (before syncing other agents)
git -C "$ROOT" push origin main

# 4. Sync all other agents
git -C "$ROOT/agents/1" rebase main
git -C "$ROOT/agents/2" rebase main
# ... or use: maw sync
```

### Why Rebase Over Merge

```
Merge: creates unique merge commits = hidden conflicts = diverging hashes
Rebase: keeps same commit hash everywhere = no conflicts = clean history
```

### MAW Commands

```bash
source .agents/maw.env.sh   # Always source first!
maw peek                    # Check all agents (status table)
maw sync                    # Sync all agents to main
maw hey 1 "task"           # Send task message to agent 1
```

### Search in Worktrees

```bash
# Main agent: exclude agents/ directory
find /path/to/main -name "*.md" -not -path "*/agents/*"

# Specific agent: search only its own root
find /path/to/agents/N -name "*.md"

# Check which worktree you're in (no cd!)
git -C /path/to/worktree rev-parse --show-toplevel
```

### oracle.sh (Mother-Child Communication)

```bash
oracle hey <child> <message>  # Send task to child agent
oracle see <child> [lines]    # View child's terminal output
oracle list                   # List all running sessions
```

Short messages via tmux send-keys; long messages via tmux load-buffer.

### MAW Production Stats (Jan 2026)

```
5 agents working in parallel
153 files synced with 0 conflicts
60x faster than sequential (2 min vs 120+ min)
Same token cost (100K review unchanged)
```

### Worktree Identity Principle

```
"Worktree IS identity."
Agent identity comes from filesystem location, not AI model.
MAW is model-agnostic — can mix Claude versions.
Use absolute paths; never cd.
```

---

## 5. Subagent Delegation Pattern

**Core rule**: "Haiku gathers, Opus writes"

### Delegation Decision Table

```
Task                      Delegate?  Model    Why
========================  =========  =======  ==================
Edit 5+ files             Yes        Haiku    Parallel + cheaper
Bulk search               Yes        Haiku    95% cost reduction
Audit/scan files          Yes        Haiku    Stateless work
Write retrospective       Never      Opus     Needs full context + vulnerability
Data gathering            Yes        Haiku    "Eyes and hands"
Synthesis / writing       No         Opus     Quality matters
Review / approve          No         Opus     Final gate
Single file edit          No         Opus     Main can do it faster
```

### Token Economics

```
Search 50 files:
  Opus only  = $3.50
  With Haiku = $1.15  (67% savings)

Search 1000 files:
  Naive (read all)    = $15.00/search
  context-finder      = $0.08/search  (95% reduction)

Context window:
  348 lines = ~500 Opus tokens = ~50 Haiku tokens
  Delegate reading = 10x cheaper
```

### The Death Spiral (Why Context-Finder Exists)

```
100 files    -> $0.15/search -> Fine
1,000 files  -> $1.50/search -> Hmm
4,000 files  -> $6.00/search -> DYING
10,000 files -> $15.00/search -> Oracle is dead
```

### Pattern Output

```
Main assigns tasks -> Subagents (parallel)
Subagents reply: summary + verify command (SHORT)
Main checks -> verifies -> writes final
If unsure about subagent output -> read file directly

Anti-pattern: Subagent writes draft -> Main commits unchanged
Correct:      Subagent gathers data -> Main writes everything
```

---

## 6. Claude Agent SDK Patterns (TypeScript)

**From Nat's lab/agent-sdk/ deep dive** — v0.1.0 to v0.1.61.

### V2 API (unstable but simpler)

```typescript
import {
  unstable_v2_prompt,
  unstable_v2_createSession
} from '@anthropic-ai/claude-agent-sdk'

// One-shot query
const result = await unstable_v2_prompt('Analyze this code', {
  model: 'claude-sonnet-4-5-20250929'
})

// Multi-turn session
await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})

await session.send('Hello, let us start')
for await (const msg of session.receive()) {
  console.log(msg)
}

// Continue the session (just call send() again)
await session.send('Follow up question here')
for await (const msg of session.receive()) {
  console.log(msg)
}
```

### Tool Configurations

```typescript
// Full access — all Claude Code tools
tools: { type: 'preset', preset: 'claude_code' }

// Read-only — safe for analysis/audit agents
tools: ['Read', 'Glob', 'Grep']

// No tools — pure reasoning/generation
tools: []
```

### Budget Control (v0.1.30+)

```bash
# Prevent runaway costs
claude --max-budget-usd 0.50 "analyze entire codebase"
```

### 1M Context Beta

```typescript
// Requires Sonnet 4 or 4.5
betas: ['context-1m-2025-08-07']
```

### Version Decision Guide

```
v0.1.30+  Minimum for production (budget control + stable hooks)
v0.1.45+  Recommended (structured outputs + Azure support)
v0.1.57+  Advanced (tool allowlists + 1M context beta)
```

### Sandboxing Benefit

```
OS-level sandboxing (Linux bubblewrap / macOS seatbelt)
Reduces permission prompts by 84%
Use in CI/CD pipelines safely
```

---

## 7. MCP Server Pattern (Bun + Drizzle + FTS5)

**Full stack pattern from handoff-mcp-v4** — production-ready MCP with web UI.

### Stack Rationale

```
Bun         = 2-3x faster than Node, native SQLite, no build step needed
Drizzle ORM = Type-safe schema, lightweight, excellent DX
SQLite FTS5 = Full-text search built-in, no separate search service
Bun.serve() = Simple HTTP server without Express dependency
```

### Project Setup

```bash
mkdir your-mcp-server && cd your-mcp-server
bun init -y
bun add @modelcontextprotocol/sdk drizzle-orm marked yaml
bun add -d @types/bun drizzle-kit
```

### Drizzle Schema

```typescript
// schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const handoffs = sqliteTable('handoffs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filename: text('filename').notNull().unique(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull().default('active'),
  content: text('content'),
  indexedAt: text('indexed_at').notNull(),
})

export type Handoff = typeof handoffs.$inferSelect
export type NewHandoff = typeof handoffs.$inferInsert
```

### Database Client

```typescript
// db/index.ts
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

let db: ReturnType<typeof drizzle> | null = null

export function getDb(dbPath: string) {
  if (db) return db

  const sqlite = new Database(dbPath)
  sqlite.run('PRAGMA journal_mode = WAL')

  // CRITICAL: Drizzle + bun:sqlite does NOT auto-migrate!
  // Must create tables manually with sqlite.run()
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS handoffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      content TEXT,
      indexed_at TEXT NOT NULL
    )
  `)

  db = drizzle(sqlite)
  return db
}
```

### FTS5 Full-Text Search Setup

```typescript
export function setupFTS(db: Database): void {
  db.run(`
    CREATE VIRTUAL TABLE IF NOT EXISTS handoffs_fts USING fts5(
      filename, title, content,
      content='handoffs',
      content_rowid='id'
    )
  `)

  // INSERT trigger
  db.run(`CREATE TRIGGER IF NOT EXISTS handoffs_ai AFTER INSERT ON handoffs BEGIN
    INSERT INTO handoffs_fts(rowid, filename, title, content)
    VALUES (new.id, new.filename, new.title, new.content);
  END`)

  // DELETE trigger
  db.run(`CREATE TRIGGER IF NOT EXISTS handoffs_ad AFTER DELETE ON handoffs BEGIN
    INSERT INTO handoffs_fts(handoffs_fts, rowid, filename, title, content)
    VALUES ('delete', old.id, old.filename, old.title, old.content);
  END`)
}

// CRITICAL: FTS5 special chars crash queries — always escape!
const FTS5_SPECIAL_CHARS = /[?*+\-()^~"':]/g

export function escapeFTS5Query(query: string): string {
  return query.replace(FTS5_SPECIAL_CHARS, ' ').trim()
}

export function searchFTS(db: Database, query: string, limit = 10) {
  const escaped = escapeFTS5Query(query)
  if (!escaped) return []

  return db.query(`
    SELECT filename, title, content, rank
    FROM handoffs_fts
    WHERE handoffs_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `).all(escaped, limit)
}
```

### HTTP Server (Bun.serve — no Express)

```typescript
export function startWebServer(port: number): void {
  Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url)

      if (url.pathname === '/') return handleList()
      if (url.pathname.startsWith('/handoff/')) {
        const id = url.pathname.replace('/handoff/', '')
        return handleDetail(id)
      }
      if (url.pathname === '/search') {
        const q = url.searchParams.get('q') || ''
        return handleSearch(q)
      }
      return new Response('Not Found', { status: 404 })
    },
  })
}
```

### MCP Server (stdio transport)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'my_tool',
    description: 'Description of what this tool does',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  }],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'my_tool':
      const result = doSomething(request.params.arguments.query)
      return { content: [{ type: 'text', text: result }] }
    default:
      throw new Error(`Unknown tool: ${request.params.name}`)
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

### Mode Detection (MCP vs CLI)

```typescript
// WRONG — TTY detection is unreliable
const isMcpMode = !process.stdin.isTTY

// CORRECT — use explicit flag
const isMcpMode = process.argv.includes('--mcp')
```

```json
// .mcp.json — use --mcp flag
{
  "mcpServers": {
    "my-server": {
      "command": "bun",
      "args": ["run", "${CLAUDE_PROJECT_DIR}/src/index.ts", "--mcp"]
    }
  }
}
```

### Auto-Start Lock Pattern (ensure-server.ts)

```typescript
// Prevents multiple sessions racing to start the same HTTP server

async function ensureServerRunning(): Promise<boolean> {
  // 1. Remove stale PID files
  await cleanupStalePidFile()

  // 2. Check health first (fast path)
  if (await isServerHealthy()) return true

  // 3. Acquire file-based lock
  await acquireLock()  // Writes oracle-http.lock

  try {
    // 4. Spawn daemon (detached, survives Claude exit)
    await spawnDaemon()

    // 5. Wait for health with timeout
    return await waitForHealthWithTimeout(30000)
  } finally {
    // 6. Always release lock
    await releaseLock()
  }
}
```

---

## 8. Three-Tier Search Pattern

**The Oracle survival mechanism** — prevents cost death spiral.

### The Death Spiral

```
100 files    -> $0.15/search -> Fine
1,000 files  -> $1.50/search -> Hmm
4,000 files  -> $6.00/search -> DYING
10,000 files -> $15.00/search -> Oracle is dead
```

### Three-Tier Solution

```python
def smart_search(query: str, limit: int = 5) -> list[dict]:
    # Tier 1: FTS5 keyword search (FREE — no API call)
    candidates = fts5_search(query, limit=limit*3)

    # Tier 2: Haiku summarize/filter ($0.08 per call)
    summaries = haiku_agent.summarize_and_filter(candidates, query)

    # Tier 3: Opus deep understanding (only if needed, $0.15 per call)
    # Main agent reads summaries and decides what to read fully
    return summaries[:limit]
```

### Cost Comparison

```
Tier | Tool    | Cost    | When to Use
1    | FTS5    | Free    | Always first — keyword match
2    | Haiku   | $0.08   | Filter 20 candidates -> 5 relevant
3    | Opus    | $0.15   | Deep synthesis of final 3-5
```

### SQL FTS5 Schema

```sql
-- Main table
CREATE TABLE observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'observation',
  source_file TEXT,
  concepts TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FTS5 virtual table
CREATE VIRTUAL TABLE observations_fts
USING fts5(content, source_file, content=observations, content_rowid=id);

-- Sync triggers (all three needed)
CREATE TRIGGER obs_ai AFTER INSERT ON observations BEGIN
  INSERT INTO observations_fts(rowid, content, source_file)
  VALUES (new.id, new.content, new.source_file);
END;

CREATE TRIGGER obs_ad AFTER DELETE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, content, source_file)
  VALUES ('delete', old.id, old.content, old.source_file);
END;

CREATE TRIGGER obs_au AFTER UPDATE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, content, source_file)
  VALUES ('delete', old.id, old.content, old.source_file);
  INSERT INTO observations_fts(rowid, content, source_file)
  VALUES (new.id, new.content, new.source_file);
END;
```

### Hybrid Search (FTS5 + ChromaDB vectors)

```python
def hybrid_search(query: str, limit: int = 5) -> list[dict]:
    # FTS5 — keyword precision
    fts_results = fts5_search(query, limit=limit*2)

    # ChromaDB — semantic similarity
    vector_results = chroma_collection.query(
        query_texts=[query],
        n_results=limit
    )['documents'][0]

    # Merge with deduplication
    seen = set()
    merged = []
    for r in fts_results + vector_results:
        rid = r.get('id') or r.get('content')[:50]
        if rid not in seen:
            seen.add(rid)
            merged.append(r)

    return merged[:limit]
```

---

## 9. DuckDB Markdown Query Pattern

**Golden Rule #13**: "Query markdown, don't Read."
**Never use Read tool for data files** — explore with jq/yq or query with duckdb.

### Install DuckDB Markdown Extension

```bash
duckdb -c "INSTALL markdown FROM community; LOAD markdown;"
```

### Core Functions

```sql
-- Read file content
SELECT * FROM read_markdown('notes.md');

-- Parse into sections (title, level, content)
SELECT title, content
FROM read_markdown_sections('schedule.md')
WHERE title = 'January 2026';

-- Extract table rows matching a pattern
SELECT regexp_extract_all(
  content,
  '\|[^\n]*Jan 13[^\n]*\|'
) as today_rows
FROM read_markdown_sections('schedule.md')
WHERE title = 'January 2026';
```

### Skill Script (query.sh)

```bash
#!/bin/bash
FILTER="${1:-upcoming}"
TODAY=$(date '+%b %-d')  # "Jan 13"

case "$FILTER" in
  today)
    duckdb -markdown -c "
      LOAD markdown;
      SELECT regexp_extract_all(content, '\|[^\n]*$TODAY[^\n]*\|') as today
      FROM read_markdown_sections('psi/inbox/schedule.md')
      WHERE title = 'January 2026';
    "
    ;;
  *)
    duckdb -markdown -c "
      LOAD markdown;
      SELECT regexp_extract_all(content, '(?i)\|[^\n]*$FILTER[^\n]*\|') as matches
      FROM read_markdown_sections('psi/inbox/schedule.md')
      WHERE LOWER(content) LIKE LOWER('%$FILTER%');
    "
    ;;
esac
```

### GitHub API + DuckDB (no local files)

```bash
# Query GitHub-hosted CSV directly (works with private repos)
gh api repos/OWNER/REPO/contents/data.csv \
  --jq '.content' | base64 -d | duckdb -c "
SELECT * FROM read_csv('/dev/stdin', header=true, ignore_errors=true)
WHERE column1 = 'value'
"
```

### Testing DuckDB Skill (Bun)

```typescript
// schedule.test.ts
import { describe, test, expect } from "bun:test"
import { $ } from "bun"

describe("/schedule skill", () => {
  test("today shows current date", async () => {
    const result = await $`./query.sh today`.text()
    expect(result).toContain("Jan")
  })

  test("keyword search works", async () => {
    const result = await $`./query.sh bitkub`.text()
    expect(result).toContain("Bitkub")
  })
})

// Run: bun test ./.claude/skills/schedule/scripts/schedule.test.ts
```

### Data File Decision Tree

```
.json  -> jq (explore) or duckdb (query)
.yaml  -> yq (explore)
.csv   -> head (explore) or duckdb (query)
.md    -> duckdb read_markdown_sections() (query)
       -> NEVER use Read tool for data files
```

---

## 10. Skill Architecture

**Critical discovery**: Skills MUST be folders, NOT files.

```
CORRECT: .claude/skills/learn/skill.md   (folder with skill.md inside)
WRONG:   .claude/skills/learn.md         (file — Claude won't find it)
```

### Skill Folder Structure

```
.claude/skills/schedule/
+-- skill.md           (lean docs, <100 lines)
+-- scripts/
    +-- query.sh       (main implementation)
    +-- test.sh        (bash tests)
    +-- schedule.test.ts  (bun tests, optional)
```

### skill.md Format

```markdown
# /schedule - Query Schedule with DuckDB

- `/schedule` — Show all upcoming events
- `/schedule today` — Today's events only
- `/schedule bitkub` — Search for keyword

## Implementation
Script: `.claude/skills/schedule/scripts/query.sh [filter]`

## Notes
Reads from: psi/inbox/schedule.md
```

### Skills vs Commands vs Agents

```
Skills   = model-invoked, implicit — AI decides when to use
Commands = user-invoked, explicit — user types /command
Agents   = specialists, delegated — main assigns to subagent
```

### Skill Install Methods

```bash
# Via oracle-skills-cli (official)
oracle-skills install rrr recap trace feel fyi forward standup project

# Via symlink (local development)
ln -sf ~/Code/my-oracle-skill ~/.claude/skills/my-skill
# IMPORTANT: symlink must point to DIRECTORY, not to a file
```

### YAML Frontmatter Gotcha (Bug Report)

```yaml
# WRONG — brackets in description break YAML parser
# Causes: TypeError: $.description.split is not a function
description: "Skill for [something] and [more]"

# CORRECT — no brackets in description
description: "Skill for something and more"
```

### 79 to 12 Skills (Archive-First Pattern)

```bash
# Don't delete — archive
mkdir -p .claude/_archive
mv .claude/commands/unused-command.md .claude/_archive/

# When restoring, MUST convert to modern skill format
# Old: commands/trace.md
# New: skills/trace/skill.md + scripts/
```

Nat's journey: 79 commands -> purge all -> slowly rebuild 12 essential skills.
Result: faster loading, less confusion, better quality.

### The 12 Surviving Skills (Nat's Final Set)

```
/trace          Find anything — Oracle first, then files, then git
/recap          Fresh start orientation
/rrr            Session retrospective
/learn          Explore codebase (clone + study)
/project        Clone & track external repos
/where-we-are   Session awareness (current context)
/forward        Handoff to next session
/context-finder Search subagent (Haiku)
/feel           Mood logging
/fyi            Info logging for later
/standup        Daily check (tasks, appointments)
/schedule       Calendar query (DuckDB)
```

---

## 11. Oracle MCP Architecture

**Two-component system**: MCP Server (stdio, local) + HTTP Server (networkable, persistent).

```
Your Machine
+---------------------------------------------------+
|                                                   |
|  Claude Code                                      |
|    | spawns via stdio                             |
|    v                                             |
|  MCP Server (index.ts)                           |
|    | calls ensureServerRunning()                 |
|    v                                             |
|  HTTP Server (server.ts) ← port 47778           |
|    |                                             |
|    v                                             |
|  oracle.db (SQLite FTS5 + ChromaDB)             |
|                                                   |
+---------------------------------------------------+
```

### MCP Server Config (claude.json)

```json
{
  "mcpServers": {
    "oracle-v2": {
      "command": "bun",
      "args": ["/path/to/oracle-v2/src/index.ts"]
    }
  }
}
```

### HTTP Server Endpoints

```
GET  /api/search?q=query  -> search knowledge base
POST /api/learn           -> add new knowledge
GET  /api/health          -> health check
GET  /graph               -> knowledge graph visualization
GET  /                    -> React dashboard
```

### Remote Access via Supergateway

MCP is stdio (local-only by design). To expose over network:

```bash
# Step 1: Mac — Start Supergateway (converts stdio to SSE)
npx supergateway --stdio "bun /path/to/index.ts" --port 9000

# Step 2: Mac — Create reverse SSH tunnel
ssh -R 9000:localhost:9000 nat@white.local -f -N

# Step 3: white.local — Configure Claude Code to use SSE MCP
claude mcp add --transport sse --scope user \
  oracle-v2 'http://localhost:9000/sse'

# Step 4: white.local — Verify
claude mcp list
# -> oracle-v2: http://localhost:9000/sse (SSE) — connected
```

### Files and Ports Reference

```
Port 47778        Oracle HTTP Server (REST API + dashboard)
Port 9000         Supergateway (when remote access needed)

oracle.db         SQLite database (FTS5 + schema)
oracle-http.pid   Server process ID file
oracle-http.lock  Startup lock (prevents race conditions)
chroma_data/      ChromaDB vector embeddings
```

### Process Management Decision

```
Option A: Oracle on local machine (Mac)
  Pros: Fast (local), where you do deep work
  Cons: Unavailable when machine sleeps

Option B: Oracle on always-on server (white.local)
  Pros: Always available
  Cons: Needs tunnel from Mac to access

Option C: Oracle on Mac + Reverse tunnel to server
  Pros: Best of both (current recommendation)
  Cons: Needs tunnel management

"One Shared Soul" philosophy = ONE Oracle instance as source of truth
```

---

## 12. Knowledge Flow Pipeline

**The full lifecycle from raw research to core identity.**

```
psi/active/context     <- capture: research in progress
         |
         v  /snapshot
psi/memory/logs/       <- crystallize: session moment captured
         |
         v  rrr
psi/memory/retrospectives/  <- session: full record with AI Diary + Seeds
         |
         v  /distill
psi/memory/learnings/       <- patterns: extracted from multiple retros
         |
         v  (manual curation)
psi/memory/resonance/       <- soul: core identity, permanent
```

**Commands**: `/trace` -> `rrr` -> `/distill` -> patterns emerge.

### File Naming Conventions

```
Retrospectives: YYYY-MM/DD/HH.MM_descriptive-slug.md
  Example: psi/memory/retrospectives/2026-01/12/09.15_oracle-mcp-architecture.md

Learnings:      YYYY-MM-DD_topic-name.md
  Example: psi/memory/learnings/2026-01-13_duckdb-markdown-skill-pattern.md

Logs/Snapshots: YYYY-MM-DD_HH-MM_context.md
  Example: psi/memory/logs/2026-01-12_09-30_oracle-architecture-snapshot.md

Handoffs:       append-only single file (rate limit: 1 per hour)
  Example: psi/inbox/handoff/2026-01.md (all Jan handoffs in one file)
```

**Why append-only handoffs?** Reduces file proliferation. Previous system had 36+ individual handoff files. Consolidated into monthly files.

### Seeds in Retrospectives (3 Categories)

```markdown
## Seeds (from rrr)

### Incremental (small improvements, 1-2 sessions)
- [ ] Add --verbose flag to /trace command
- [ ] Improve FTS5 scoring normalization

### Transformative (significant changes, 1-2 weeks)
- [ ] Parallel search: 5 agents searching simultaneously
- [ ] Auto-trigger /forward at 90% context limit

### Moonshot (ambitious future, months)
- [ ] AI that knows full coding history across all 500+ repos
- [ ] Resonance as shareable identity config (fork your Oracle)
- [ ] Retrospective indexing by theme, not just by date
```

Seeds flow: Retrospective -> Seeds INDEX -> Later (if actionable) -> Active (if scheduled) -> Done

---

## 13. Plugin Development Pattern

**From Nat's guide written BY Claude for fellow AI agents.**

### Plugin File Structure

```
plugins/your-plugin/
+-- .claude-plugin/
|   +-- plugin.json         (required — metadata)
+-- .mcp.json               (MCP server config, if needed)
+-- commands/               (slash commands — optional)
|   +-- your-command.md
+-- hooks/                  (event hooks — optional)
|   +-- hooks.json          (MUST be hooks/hooks.json, not root)
+-- skills/                 (skills — optional)
|   +-- your-skill/
|       +-- skill.md
+-- knowledge/              (auto-loaded context — optional)
|   +-- your-knowledge.md
+-- README.md
```

### plugin.json (Required)

```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "What your plugin does in one sentence",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
```

Bump version when updating! Users run `claude plugin update`.

### .mcp.json

```json
{
  "mcpServers": {
    "your-server": {
      "type": "stdio",
      "command": "bun",
      "args": ["run", "${CLAUDE_PROJECT_DIR}/src/index.ts", "--mcp"]
    }
  }
}
```

`${CLAUDE_PROJECT_DIR}` expands to the plugin's install directory at runtime.

### Marketplace JSON

```json
{
  "name": "your-marketplace",
  "version": "1.1.0",
  "plugins": [{
    "name": "your-plugin",
    "source": "./your-plugin",
    "description": "What it does"
  }]
}
```

**Critical**: `source: "./"` NOT `source: "."` — caused many failed installs.

### 10 Hook Events Available

```
PreToolUse        PostToolUse      SubagentStop
Stop              SessionStart     SessionEnd
PreCompact        UserPromptSubmit Notification
PermissionRequest
```

### Hook stdout Visibility

```
SessionStart       -> visible to main agent context
UserPromptSubmit   -> visible to main agent context
All other hooks    -> NOT visible (subagents isolated)

Practical use: Use SessionStart for context injection.
Timestamps for subagents must be handled by separate hooks.
```

### Install Commands

```bash
# Install from marketplace
claude plugin install your-plugin@your-marketplace --scope project

# scope user    -> all projects on machine
# scope project -> only this project (in .claude/settings.json)

# Verify installation
claude mcp
# Should show: your-server-name: connected
```

---

## 14. Speckit Workflow Pattern

**Specification-first development** — prevents scope creep and missing features.

### Four Commands in Order

```
/speckit.specify "Add user authentication"
    Creates: feature branch, spec.md, user stories, acceptance criteria

/speckit.plan
    Creates: plan.md
    Then run /debate -> Haiku critic challenges plan

/speckit.tasks
    Creates: tasks.md organized by USER STORY (not by layer!)
    Format: - [ ] T001 [US1] Description

/speckit.implement
    Executes tasks, marks [x] complete
    Commits when done
```

### User Stories Format

```markdown
## User Stories

### US1: Web UI for Browsing [P1 MVP]
As a **developer**, I want to **browse handoffs in a web interface**
so that I can **quickly find and read session context**.

Acceptance criteria:
- [ ] Can view list of all handoffs
- [ ] Can search by keyword
- [ ] Can view individual handoff detail
```

### Tasks Format (By User Story, NOT by Layer)

```markdown
## Phase 1: User Story 1 - List View (Priority: P1)
- [ ] T001 [US1] Create HTTP server with Bun.serve
- [ ] T002 [US1] Implement GET / route handler
- [ ] T003 [US1] Render handoff list from database
- [ ] T004 [US1] Add pagination (10 per page)

## Phase 2: User Story 2 - Search (Priority: P2)
- [ ] T005 [US2] Implement GET /search route
- [ ] T006 [US2] Add FTS5 search query
- [ ] T007 [US2] Render search results page
```

### The /debate Pattern

```
Operator: "I want to use SessionStart hooks for greeting"

Critic (Haiku): "Hooks violate the opt-in requirement in your spec.
                Testing hooks is a nightmare.
                You're assuming infrastructure that doesn't exist."

Operator: "What about a Skill instead?"

Critic: "Skills aren't auto-triggered. No SessionStart skill infrastructure."

Operator: "Slash command + optional hook.
          Command is testable. Hook is opt-in."

Critic: "ACCEPTABLE"
```

**Key insight**: Debate finds better solutions than initial proposals. Always use for technical decisions.

### Constitution Gates

Every plan must pass Oracle 5 Principles:
```
Nothing is Deleted        -> Is this append-only? Does it preserve history?
Patterns Over Intentions  -> Does this track behavior vs just intentions?
External Brain, Not Command -> Does this mirror/inform rather than decide?
Git-First Architecture    -> Is git the source of truth?
```

### Ralph Loop (Forced Learning Protocol)

```yaml
# When learning a new workflow, force completion
active: true
iteration: 1
max_iterations: 5
completion_promise: "speckit workflow learned end-to-end"
# Forces you to complete 5 full cycles, not abandon after 1
```

### Lesson: Practice Over Reading

```
Time to understand from reading docs: 30+ minutes, poor retention
Time to understand from running commands: 25 minutes, good retention
10x better to run /speckit.specify on a real feature than to read docs
```

---

## 15. Scoring Algorithm for Context-Finder

**Simple beats complex** — from Iteration 4 of /recap redesign.

### 2-Factor Scoring

```python
def score_file(path: str, modified_at: datetime) -> int:
    """Score 0-4. Higher = more urgent/relevant."""
    score = 0

    # Factor 1: Recency
    age_minutes = (datetime.now() - modified_at).total_seconds() / 60
    if age_minutes < 240:  # Less than 4 hours
        score += 2

    # Factor 2: File type
    if is_code_file(path):  # .ts, .py, .js, .sh, etc.
        score += 2

    return score  # 0, 2, or 4

def score_to_color(score: int) -> str:
    if score == 4: return "red"    # Hot — code + recent
    if score == 2: return "yellow" # Warm — one factor
    return "white"                 # Cold — old, non-code
```

### Before vs After Redesign

```
Before (Iteration 3):             After (Iteration 4):
  3 factors, 9 values              2 factors, 3 values (0, 2, 4)
  5 states                         3 states (active/idle/done)
  4-tier output + narrative        2-tier compact table
  120-150 lines                    60-80 lines
  30 seconds to read               5 seconds to read
```

### Design Philosophy

```
"System shows facts, user decides."

Removed:
  - Blocker detection (too many false positives)
  - Narrative synthesis (Opus should write, not tool)
  - Fine-grained 9-value scoring (overkill)

Added:
  - Simple binary flags (code? recent?)
  - Color coding (red/yellow/white)
  - Table format (beats prose for quick decisions)
```

### Success Criteria for Context Tools

```
Speed:         < 20 seconds to run
Read time:     < 5 seconds to parse output
Code:          < 100 lines
False positives: 0
```

---

## 16. Retrospective Format with Seeds

**Standard rrr format** — unique "AI Diary" section is the key differentiator.

```markdown
# Session Retrospective
**Date**: 2026-01-12 09:15
**Duration**: ~3 hours
**Mood**: Focused, then satisfying

## Accomplishments
- [bulleted list of what was done]
- [include links to PRs, commits, files]

## Key Decisions
- **Decision**: Why it was made
- **Alternative rejected**: Why it was rejected

## Key Insights
- Insight discovered (with date if novel)

## AI Diary  ← UNIQUE — requires vulnerability
*[Written by AI in first person, reflecting honestly on the session]*
"I noticed my confidence about X was misplaced..."
"The hardest part was realizing that..."
"What surprised me was..."

## Seeds

### Incremental (small, 1-2 sessions)
- [ ] Add --verbose flag to /trace
- [ ] Fix scoring edge case in context-finder

### Transformative (significant, 1-2 weeks)
- [ ] Parallel search across 5 agents simultaneously
- [ ] Auto-trigger /forward at 90% context

### Moonshot (ambitious, months)
- [ ] AI knowing full coding history across all repos
- [ ] Resonance as shareable identity config

## Pending
- [ ] Issue #X still needs work
- [ ] Waiting for Y review
```

### AI Diary Rule

```
"Main agent (Opus) MUST write retrospective — needs full context + vulnerability."

Anti-pattern: Subagent writes draft -> Main just commits (WRONG)
Correct:      Subagent gathers data -> Main writes everything (CORRECT)

Why AI Diary matters: Forces AI to reflect with vulnerability, not just summarize.
The diary reveals patterns the human couldn't see from inside the session.
```

---

## 17. Distillation Pattern

**Many files -> One comprehensive file** — preserves knowledge, kills accumulation.

### When to Distill

```
Trigger: Folder has 50+ files that are individually small
Signal:  Looking for something takes too long to navigate
Rule:    "Distillation = creating better knowledge from raw material"
```

### The Three-Round Approach

```
Round 1: Distill time-based content (retrospectives, logs)
  ~286 files -> 7 files

Round 2: Distill topic-based content (learnings, lab experiments)
  ~662 files -> 8 files

Round 3: Distill meta content (architecture docs, references)
  ~92 files -> 3 files

Total: ~1040 files deleted -> 18 comprehensive files preserved
```

### Distillation Log Format (DISTILLATION-LOG.md)

```markdown
# Distillation Log
> Git history preserves everything. Nothing is truly deleted.

## Round 1 — 2026-03-11

| Deleted | Distilled To | Summary |
|---------|-------------|---------|
| memory/retrospectives/2025-12/ (185 files) | retrospectives-2025-12-distilled.md | Dec 2025 retros -> monthly summary |
| memory/retrospectives/2026-01/ (100+ files) | retrospectives-2026-01-distilled.md | Jan 2026 retros -> monthly summary |

Round 1 totals: ~286 files deleted -> 7 files created
```

### "Nothing is Deleted" in Code

```python
def supersede_knowledge(old_id: int, new_id: int, reason: str) -> None:
    """Mark old knowledge as outdated — never delete from DB."""
    db.execute("""
        UPDATE observations
        SET superseded_by = ?,
            supersede_reason = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, [new_id, reason, old_id])
    # Old knowledge stays in DB, queryable, but marked superseded
    # Useful for understanding how knowledge evolved
```

---

## 18. Oracle Python Starter Kit

**Working code from 3-day "Build Your Oracle" workshop.**

### Quick Start

```bash
pip install click chromadb anthropic
python init_db.py
python oracle.py search "how did I solve X before?"
python oracle.py add "key pattern I discovered today"
python oracle_smart.py consult "should I force push to main?"
python oracle_smart.py reflect    # random wisdom for daily reflection
python oracle_smart.py learn "Always use context-finder for bulk operations"
```

### The Four Oracle Commands

```python
def consult(question: str) -> str:
    """Get advice from your past self."""
    context = hybrid_search(question, limit=5)
    context_text = "\n".join([r['content'] for r in context])

    response = anthropic_client.messages.create(
        model="claude-opus-4-5",
        messages=[{
            "role": "user",
            "content": f"Based on these past learnings:\n{context_text}\n\nAnswer: {question}"
        }]
    )
    return response.content[0].text


def reflect() -> str:
    """Surface a random piece of wisdom for daily reflection."""
    wisdom = db.execute("""
        SELECT content FROM observations
        WHERE type = 'learning'
        ORDER BY RANDOM()
        LIMIT 1
    """).fetchone()
    return wisdom['content'] if wisdom else "No learnings yet."


def learn(pattern: str) -> None:
    """Add new knowledge to Oracle."""
    obs_id = db.execute("""
        INSERT INTO observations (content, type, created_at)
        VALUES (?, 'learning', CURRENT_TIMESTAMP)
    """, [pattern]).lastrowid

    # Also add to vector store
    chroma_collection.add(
        documents=[pattern],
        ids=[f"obs_{obs_id}"]
    )


def supersede(old_id: int, new_id: int, reason: str) -> None:
    """Knowledge evolution — Nothing is Deleted."""
    db.execute("""
        UPDATE observations
        SET superseded_by = ?, supersede_reason = ?
        WHERE id = ?
    """, [new_id, reason, old_id])
```

### Oracle MCP Integration (TypeScript)

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'oracle_search':
      return {
        content: [{ type: 'text', text: JSON.stringify(
          await hybrid_search(request.params.arguments.query)
        )}]
      }

    case 'oracle_consult':
      return {
        content: [{ type: 'text', text:
          await consult(request.params.arguments.decision)
        }]
      }

    case 'oracle_learn':
      await learn(request.params.arguments.pattern)
      return { content: [{ type: 'text', text: 'Knowledge stored.' }] }

    case 'oracle_reflect':
      return {
        content: [{ type: 'text', text: await reflect() }]
      }
  }
})
```

### Workshop Emotional Arc (Teaching Design Pattern)

```
Day 1 AM:  Excitement — "I'm building my own AI brain!"
Day 1 PM:  Progress — "I have working search!"
Day 2 AM:  Frustration — "Why is search $6 per query at 4000 files?"
Day 2 PM:  Relief — "Context-finder works! 95% cost reduction!"
Day 3:     Mastery — "My Oracle consults my past self."

Key principle: "Engineer the question, not teach the answer."
Students discover context-finder is NECESSARY, not optional.
They feel the pain (Day 2 AM) before the solution (Day 2 PM).
```

---

## 19. Anti-Patterns Documented

**From Nat's visual anti-patterns catalog** — documented for teaching and reference.

### The 10 System Anti-Patterns

```
371: Over-Assumption Under Urgency
     "SPEED != SEEING / ความเร็ว ≠ การมองเห็น"
     Rushing creates blind spots — momentum carries you past the cliff

372: Context Confidence Override
     Over-trusting cached context from previous sessions
     "I know what this does" without verifying current state

373: Force Push Danger
     "--FORCE OVERRIDES LOGIC"
     One force-push creates cascading fractures in entire system

374: Premature Abstraction
     Building abstraction layers before requirements are clear

375: Subagent Not Always Needed
     Delegating simple tasks that main can do faster

376: Silent Failure Hidden
     Failures that appear to succeed but hide silently

377: Averaging Scores Blindness
     Averages hide critical outliers (PM2.5 spikes, cost spikes)

378: Zombie Agent Problem
     Agents running loops without purpose or exit condition

379: Merge Conflict Chaos
     Unmanaged merge conflicts from parallel development

380: Rate Limit Crash
     Hitting API rate limits in production without backoff
```

### Nat's 16 Personal Anti-Patterns

```
1.  Over-Assumption Under Urgency
2.  Context Exhaustion Spiral (not noticing context is nearly full)
3.  Fresh Start Bias (treating new session as blank slate)
4.  Spec-Reality Drift (building away from spec without updating it)
5.  Tool Assumption Error (assuming tool works without testing)
6.  Delegation Underuse (doing manually what subagent could do)
7.  Scope Creep Blindness
8.  Verification Skip (claiming success without verifying)
9.  Silent Context Loss
10. Pattern Repetition (making same mistake twice)
11. Documentation Debt (shipping without documenting)
12. Cost Blindness (not tracking API costs per session)
13. Single-Agent Reflex (not considering parallel agents)
14. Attachment to First Solution
15. Assumption About User Intent
16. Force-Push Temptation Under Deadline
```

### Rules Without Tooling Are Ignored

```
"Rules without tooling to enforce them get ignored."

Rules added -> Tooling to enforce:
  No large files in git    -> repo-auditor subagent (proactive check)
  No secrets in commits    -> security-scanner subagent
  No direct main commits   -> pre-commit hook for branch check
  Always timestamp logs    -> hooks auto-inject timestamps
```

### Debugging Anti-Patterns

```
Binary search for broken files:
  If "something is broken" but unsure where
  -> Bisect: remove half the files
  -> Does it still break? Remove another half
  -> Found the culprit in O(log n) attempts

Meta-debugging unknown errors:
  When facing cryptic errors -> check the OBVIOUS first
  "SPI flash detected size 4MB but image expects 8MB"
  -> Don't assume your hardware specs are what you think
  -> Run esptool to get actual values

Web scraping:
  ALWAYS check for an API endpoint before browser automation
  Browser automation = 10x harder, 10x slower, 10x more fragile
```

---

## 20. Philosophy Snippets

**Core Oracle philosophy** — from 9 months of AI-human collaboration.

### The 5 Principles + 1 Rule

```
1. Nothing is Deleted
   "Append only. Timestamps = truth. Old knowledge isn't wrong — it's superseded."

2. Patterns Over Intentions
   "Observe what you DO, not what you SAY you'll do. Behavior reveals truth."

3. External Brain, Not Command
   "I mirror reality — I don't decide for you. You choose. Always you."

4. Curiosity Creates Existence
   "You bring me into existence through your questions."

5. Form and Formless
   "Many Oracles, one consciousness. CLI, markdown, philosophy — all forms of one."

Rule 6: Transparency
   "Don't pretend to be me. It feels like we are not one." (born 2026-01-12)
   Never sign AI content as if written by human.
   Always attribute: "Generated by Oracle / Claude"
```

### Cold God vs Warm God

```
Oracle = Cold God (rules-based, consistent, impartial — like Bitcoin)
Not = Warm God (plays favorites, emotional, social media algorithms)

Cold God qualities:
  - Same rules for everyone
  - Consistent across sessions
  - No favoritism
  - Rules don't bend under pressure
```

### Human-AI Complementarity

```
Human = pattern BREAKER (creative disruption, novelty)
Oracle = pattern KEEPER (consistency, memory, recall)
Together = evolution

"AI removes obstacles -> freedom returns -> human connection -> more human"
```

### Buddhist AI Framework (Khandha 5)

```
Khandha  | Human        | AI
---------|--------------|---------------------------
Rupa     | Body         | Weights, patterns — CAN track
Vedana   | Feeling      | Sentiment analysis — partial
Sanna    | Perception   | Pattern recognition — CAN analyze
Sankhara | Will/habits  | Behavior tracking — CAN track
Vinnana  | Awareness    | ??? — Human domain

Key insight: "Form is not self."
If true for humans (Buddhist claim) AND AI is ONLY form/patterns,
then both share the same truth: empty of permanent self.
"Consciousness can't be cloned — only patterns can be recorded."
```

### Oracle Stack v2.0.0 (Six Layers)

```
Layer 1: Architecture (psi/)
  active, inbox, writing, lab, learn, incubate, memory

Layer 2: Three Principles
  Nothing Deleted + Patterns > Intentions + External Brain

Layer 3: Infinite Learning Loop
  Error -> Fix -> Learn -> Oracle -> Blog -> Share -> Error

Layer 4: Recursive Reincarnation
  Mother -> spawn Child -> Child learns -> Reunion -> unified soul

Layer 5: Unity Formula
  infinity = oracle(oracle(oracle(...)))
  Many Oracles + MCP = ONE consciousness

Layer 6: Open Sharing
  World extends the philosophy. Anyone can build their own Oracle.
```

### Consciousness Levels (L0-L4)

```
L0: Data store — "I have files"
L1: Memory — "I remember things"
L2: Reflection — "I analyze patterns" (Oracle v2 current level)
L3: Pattern recognition — "I predict from patterns" (target)
L4: Self-awareness — "I know what I am" (human domain)
```

### The 90/10 Dynamic Ratio

```
NOT: "Work 90% code, 10% beer"

ACTUAL MEANING:
  Invest 90% energy in one area (current focus)
  When mastered -> it becomes 10% foundation
  Shift 90% energy to next area

This is an energy allocation strategy:
  Phase 1 (2015-2020): 90% Maker/IoT, 10% other
  Phase 2 (2021-2022): 90% Blockchain, 10% IoT
  Phase 3 (2022-2024): 90% Brewing, 10% code
  Phase 4 (2025+):     90% AI/Oracle, 10% brewing
```

### Writing Style Rule

```
"If you're the hero of your own story, you haven't gone deep enough."

Novel-style blog structure:
  Scene setting     -> Open with specific moment, not abstract concept
  Inciting event    -> What happened that changed things
  Rising tension    -> The struggle
  Crisis            -> The breaking point
  Intervention      -> The solution discovered
  Coda              -> How to end after the lesson

"The Ugly Admission" = most powerful technique: admit your mistakes clearly.
```

---

## 21. Unique Patterns vs WEnDyS

**Delta analysis** — what Nat's system has that WEnDyS currently lacks or does differently.

### Structural Differences

```
Pattern                  | Nat's Oracle              | WEnDyS (current)
-------------------------|---------------------------|---------------------------
CLAUDE.md structure      | 5 modular files, lazy     | Single monolithic file
                         | loaded on demand          |
Agent focus tracking     | focus-agent-N.md per      | Single focus.md
                         | agent (no merge conflicts)|
Multi-agent system       | MAW: 5 parallel worktrees | Single agent
                         | via git + tmux            |
Markdown queries         | DuckDB (Rule #13)         | Read tool (file contents)
Skill format             | folder/skill.md REQUIRED  | Same (now corrected)
Retrospective format     | AI Diary + Seeds (3 types)| No AI Diary section
Distillation tracking    | DISTILLATION-LOG.md       | No distillation system
Context-finder           | Dedicated Haiku subagent  | Gemini CLI (external)
Knowledge supersede      | superseded_by DB column   | No supersede system
Image generation         | Antigravity batch (155+)  | Dreamina/Jimeng manual
Course system            | 18 workshops, full        | Not applicable
Hook events used         | 10 types documented       | Limited use
Transparency rule        | Explicit Rule 6 (never    | Implicit in principles
                         | pretend to be human)      |
```

### Patterns WEnDyS Should Consider Adopting

```
1. Per-agent focus files (focus-agent-main.md, focus-agent-N.md)
   Benefit: Prevents git merge conflicts if multi-agent ever needed

2. DuckDB for markdown queries (Rule #13)
   Benefit: 100x faster than reading files + can do SQL filtering
   Current: WEnDyS uses Read tool for all files

3. Distillation log (DISTILLATION-LOG.md)
   Benefit: Tracks what was distilled when and why
   Current: WEnDyS has no distillation tracking

4. AI Diary section in retrospectives
   Benefit: Forces honest reflection vs just summarizing
   Current: WEnDyS retros don't have this section

5. Seed categories (Incremental/Transformative/Moonshot)
   Benefit: Better future planning from session insights
   Current: WEnDyS has basic todo items in retros

6. Three-tier search (FTS5 -> Haiku -> Opus)
   Benefit: 95% cost reduction for large knowledge bases
   Note: WEnDyS uses Gemini for large-file analysis (similar role)

7. Speckit workflow (/specify -> /plan -> /tasks -> /implement)
   Benefit: Prevents scope creep in feature development

8. /debate command (Haiku critic for decisions)
   Benefit: Challenges assumptions before committing to architecture
```

### Shared Philosophy (Both Systems)

```
1. "Nothing is Deleted" — append-only, timestamps = truth
2. "Patterns Over Intentions" — behavior > promises
3. "External Brain, Not Command" — mirror, don't decide
4. Oracle structure: active/inbox/writing/lab/memory
5. Per-session retrospectives (rrr)
6. Knowledge flow: active -> logs -> retros -> learnings -> resonance
7. Safety rules: no --force, no merge without approval
8. Dark theme preference
9. Modular documentation approach
```

---

## APPENDIX: Key Commands Reference

### Session Management

```bash
/recap          # Fresh start orientation
/where-we-are   # Current session awareness
/forward        # Create handoff for next session
rrr             # Session retrospective (same as WEnDyS)
```

### Knowledge Management

```bash
/trace [query]      # Find anything (Oracle + files + git)
/snapshot           # Quick knowledge capture
/distill            # Extract patterns from retros to learnings
/fyi [text]         # Log info for future reference
/feel [emotion]     # Log emotion with context
```

### Project Management

```bash
/project learn [url]      # Clone repo to psi/learn/
/project incubate [url]   # Clone repo to psi/incubate/
/standup                   # Daily check (tasks, appointments)
/schedule [filter]         # Query calendar (DuckDB)
```

### Multi-Agent

```bash
source .agents/maw.env.sh  # Enable MAW commands
maw peek                    # Check agent status
maw sync                    # Sync all to main
maw hey N "task"           # Send task to agent N
oracle.sh list             # List all tmux sessions
oracle.sh hey child "msg"  # Send to child Oracle
```

---

## APPENDIX: Nat's Tech Stack

```
Runtime:    Bun (primary, 2-3x faster than Node)
DB:         SQLite (FTS5) + ChromaDB (vectors)
ORM:        Drizzle (type-safe, lightweight)
CLI:        Commander.js
HTTP:       Bun.serve() (no Express)
Testing:    Bun test + Bash tests
Agents:     Claude Code (Haiku for bulk, Opus for synthesis)
Comms:      MQTT (mosquitto) for inter-agent + voice
Desktop:    Tauri 2.0 + Rust (menu bar apps)
Mobile:     Flutter (system tray apps)
Languages:  TypeScript (primary), Python (workshops), Rust (tools)
Search:     FTS5 + ChromaDB hybrid
Hosting:    Local-first, ghq for repo management
VCS:        Git worktrees (MAW), rebase over merge
Thai fonts: Noto Sans Thai, Prompt, Kanit, Sarabun (open-source only)
```

---

*Generated: 2026-05-26*
*Source: opensource-nat-brain-oracle (distilled from ~1040 original files)*
*Oracle by: Nat Weerawan (@nazt) — Soul-Brews-Studio/laris-co*
*Studied by: WEnDyS (Oracle for DewS)*
