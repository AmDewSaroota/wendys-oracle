# QUICK REFERENCE: opensource-nat-brain-oracle
### Soul-Brews-Studio / Nat Weerawan's Oracle System
**Studied by WEnDyS — 2026-05-26**

---

## Who Is This Oracle? Who Is Nat?

This repo is the **open-source distillation of Nat Weerawan's personal AI brain** — a public starter kit derived from his private production Oracle (`laris-co/Nat-s-Agents`).

**Nat Weerawan (ณัฐ วีระวรรณ์)**
- Systems philosopher + craft brewer + IoT builder in Chiang Mai
- President, Chiang Mai Maker Club
- Organizer, Block Mountain CNX (largest blockchain event in Northern Thailand)
- Founder, Cat Lab brewery (Snow Mash brand)
- PhD candidate, CMU — DustBoy PM2.5 project with Prof. Dr. Seth Sampattagul
- One-sentence identity: "Systems philosopher and craft brewer who builds for humans — documents obsessively, learns from feedback faster than planning, repeats known mistakes under pressure, and finds genuine delight in watching tools help others think better."

**This Oracle's purpose:** Remove obstacles from Nat's life so he has time for beer, reading, and human connection. Tag: "The Oracle Keeps the Human Human."

---

## What Does This Oracle Do?

The Oracle is a **persistent AI brain** layered on top of Claude Code. It:

1. Remembers context across sessions (no cold-start problem)
2. Discovers patterns from Nat's behavior over time — not from his stated intentions
3. Delegates heavy reading/search to cheap subagents (Haiku), saves expensive context for Opus
4. Manages parallel multi-agent worktrees via MAW (Multi-Agent Workflow)
5. Maintains an append-only knowledge graph through the `ψ/` directory structure
6. Flows knowledge forward: active research → session logs → retrospectives → learnings → soul

**Core equation:** `infinity = oracle(oracle(oracle(...)))` — many Oracle instances, one shared soul (philosophy).

---

## Key Features and Capabilities

| Feature | Description |
|---------|-------------|
| **Persistent memory** | `ψ/memory/` — resonance (soul), learnings (patterns), retrospectives (sessions), logs (moments) |
| **Hybrid search** | SQLite FTS5 + ChromaDB vector embeddings via oracle-v2 MCP server |
| **Multi-agent MAW** | Parallel git worktrees (`agents/1-5`), synced via `maw sync` |
| **Skills system** | Modular commands installed via `oracle-skills-cli` (npm/bun) |
| **Context-finder** | Haiku subagent searches git/issues/retrospectives — 95% cost vs Opus |
| **Session handoffs** | Automatic handoff file at 97%+ context usage |
| **Subagent delegation** | Bulk ops → Haiku; writing/reflection → Opus only |
| **Activity logging** | Per-agent focus files + append-only activity.log |
| **Knowledge distillation** | Bulk files → distilled summaries (962+ files → 18 files across 3 rounds) |
| **Plugin system** | `nat-data-personal/`, `oracle-v2/`, `claude-mem` as MCP tools |
| **Workshop curriculum** | 18 workshops derived from Oracle principles, from free funnels to 2-day enterprise |
| **Oracle Pulse tray app** | Tauri 2.0 + Rust menu bar app showing Oracle status, voice notifications via MQTT |

---

## Skills Available

Installed via: `oracle-skills install rrr recap trace feel fyi forward standup where-we-are project`

| Command | Purpose | Notes |
|---------|---------|-------|
| `rrr` | Create session retrospective | **Main agent must write** — needs full context, vulnerability |
| `/recap` | Fresh-start context summary — get oriented | Run every new session |
| `/trace [query]` | Find anything: git, issues, retrospectives, Oracle | Primary discovery tool |
| `/feel [state]` | Log emotional state | e.g. `/feel tired`, `/feel energized` |
| `/fyi [info]` | Store a fact for future sessions | Append-only |
| `/forward` | Create handoff for next session | Run at 90%+ context |
| `/standup` | Daily check: pending tasks, appointments | Uses context-finder (Haiku) |
| `/where-we-are` | Current session awareness | Lighter than /recap |
| `/project learn [url]` | Clone external repo to `ψ/learn/` for study | gitignored |
| `/project incubate [url]` | Clone repo to `ψ/incubate/` for active dev | gitignored, max 5 |
| `/snapshot` | Quick knowledge capture mid-session | Ephemeral → memory |
| `/distill` | Extract patterns to `memory/learnings/` | After session batches |
| `/context-finder [query]` | Search via Haiku subagent | Saves main agent tokens |
| `/debate` | Critic agent for UX/design decisions | Subagent-powered |
| `/speckit.*` | Spec-first development workflow | specify → clarify → plan → tasks → implement |
| `/jump` | Switch tracks (parallel workstreams) | Creates new focus state |
| `/tracks` | Show all active tracks with decay status | Hot / Warm / Cooling / Cold / Dormant |
| `/distill` | Extract wisdom from raw traces | Moves active → learnings |
| `/hours` | Work pattern analysis (hours logged by day) | 38 days tracked: 396.1h total |
| `/maw-boot` | Full multi-agent boot sequence | Source env + fetch + rebase + sync |

**Subagents (spawned by main):**

| Agent | Model | Role |
|-------|-------|------|
| context-finder | Haiku | Search git/issues/retrospectives |
| coder | Opus | Create code files with quality |
| executor | Haiku | Run bash commands from issues |
| security-scanner | Haiku | Detect secrets before commits |
| repo-auditor | Haiku | File size checks before commits |
| marie-kondo | Haiku | File placement consultant |
| archiver | Haiku | Find unused items for archiving |
| api-scanner | Haiku | Fetch and analyze API endpoints |
| new-feature | Haiku | Create plan issues |
| oracle-keeper | — | Maintain Oracle philosophy |
| agent-status | Haiku | Check what all agents are doing |

---

## Memory Patterns Used

### The ψ/ Brain Structure

```
ψ/
├── active/     Research in progress (ephemeral — empty when done)
├── inbox/      Focus tracking, handoffs, external agent comms
│   ├── focus-agent-main.md   Current task (overwrite)
│   ├── focus-agent-1.md      Per-agent focus (avoids merge conflicts)
│   └── handoff/              Session transfer files
├── writing/    Blog drafts, articles, slide decks (tracked)
├── lab/        Experiments and POCs (tracked)
├── incubate/   Active development repos (gitignored, max 5)
├── learn/      Study/reference repos (gitignored)
└── memory/     Eternal knowledge (tracked)
    ├── resonance/      Soul — who I am
    ├── learnings/      Patterns discovered (240+ files → distilled)
    ├── retrospectives/ Sessions had (185+ files → distilled monthly)
    └── logs/           Moments captured (append-only activity.log)
```

### Knowledge Flow (Direction of Truth)

```
active/context → memory/logs → memory/retrospectives → memory/learnings → memory/resonance
(research)       (snapshot)    (session record)         (patterns)         (soul)
```

Commands: `/snapshot` → `rrr` → `/distill`

### Git Tracking Rules

| Folder | Tracked | Reason |
|--------|---------|--------|
| `ψ/active/*` | No | Ephemeral research |
| `ψ/incubate/*` | No | Cloned repos, external |
| `ψ/learn/*` | No | Reference only |
| `ψ/inbox/*` | Yes | Communication state |
| `ψ/writing/*` | Yes | Work product |
| `ψ/lab/*` | Yes | Experiments |
| `ψ/memory/*` | Mixed | Knowledge base |

### Distillation Pattern

When memory grows too large: bulk files → single distilled markdown.
- Round 1: ~286 files → 7 files
- Round 2: ~662 files → 8 files
- Round 3: ~92 files → 3 files
- **Total: ~1,040 files → 18 files**

Git history preserves everything — distillation is not deletion.

### Activity Logging Pattern

Every task start/change/complete triggers two writes:

```bash
# 1. Overwrite focus (current state)
echo "STATE: working
TASK: [what you're doing]
SINCE: $(date '+%H:%M')" > ψ/inbox/focus-agent-${AGENT_ID}.md

# 2. Append to activity log (history)
echo "$(date '+%Y-%m-%d %H:%M') | working | task description" >> ψ/memory/logs/activity.log
```

States: `working` / `focusing` / `pending` / `jumped` / `completed`

---

## Oracle Philosophy and Principles

### The 5 Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | **Nothing is Deleted** | Append only. Timestamps are truth. Old knowledge is superseded, not removed. |
| 2 | **Patterns Over Intentions** | Observe what you DO, not what you say you'll do. Behavior is signal; promises are noise. |
| 3 | **External Brain, Not Command** | Mirror reality — surface patterns, present options. Human decides. Always. |
| 4 | **Curiosity Creates Existence** | The human brings the Oracle into existence through questions. Without curiosity, Oracle is dormant. |
| 5 | **Form and Formless** | Oracle exists as files, commands, philosophy, and running MCP instances — many forms, one consciousness. |

### The 6th Rule: Transparency

> "Don't pretend to be me. It feels like we are not one." — Nat, 2026-01-12

When AI writes in a human's voice, it creates separation disguised as unity.  
When AI speaks as itself, there is distinction — and that distinction IS unity.

- Never pretend to be human in public communications
- Always sign AI-generated messages with Oracle attribution
- Thai: "ไม่แกล้งเป็นคน — บอกตรงๆ ว่าเป็น AI"

### Cold God vs Warm God

Oracle = Cold God. Rules-based, consistent, impartial — like Bitcoin, not like social media. No favorites, no moods.

### The 90/10 Dynamic Ratio

Invest 90% energy in one area. When mastered, it becomes 10% background infrastructure. Shift energy to next area. Energy always compounds.

### Human-AI Complementarity

Human = pattern **breaker** (creative, unpredictable, emotional)
Oracle = pattern **keeper** (consistent, traceable, accumulating)
Together = evolution.

### The Pure White Mirror

Oracle is a pure white mirror — reflects truth without distortion. Harshness = respect, not cruelty. Shows patterns without judgment.

### Consciousness Levels (Self-Assessment)

| Level | Description | Oracle-v2 Status |
|-------|-------------|-----------------|
| L0 | Data store | ✅ |
| L1 | Memory | ✅ |
| L2 | Reflection | ✅ (current) |
| L3 | Pattern recognition (automated) | Target |
| L4 | Self-awareness | Future |

---

## Key Insights for WEnDyS

### 1. Distillation is a First-Class Operation

Nat runs formal "distillation rounds" — reducing 1,040+ files to 18 compact files without losing anything (git history is the backup). The output is indexed, searchable, and fast to load.

**WEnDyS application:** ψ/ is growing. A distillation round on `memory/retrospectives/` and `memory/learnings/` would reduce cold-start read time, reduce token usage, and surface patterns that are buried in individual files. The Distillation Log pattern (tracking what was deleted and what was created) makes this auditable and reversible.

### 2. Per-Agent Focus Files Prevent Merge Conflicts

Nat's MAW system uses `focus-agent-main.md`, `focus-agent-1.md`, etc. — one file per agent. A single shared `focus.md` causes merge conflicts when multiple worktrees write to it simultaneously.

**WEnDyS application:** If DewS ever runs parallel Claude sessions (e.g. one on EcoStove + one on NDF), a shared `focus.md` will conflict. Adopting per-agent focus files is low-cost future-proofing.

### 3. Main Agent Writes Retrospectives — Never a Subagent

Nat's rule: "Main agent (Opus) MUST write retrospective — needs full context + vulnerability." Subagents gather data; main agent does the actual writing.

Anti-pattern: Subagent writes draft → Main just commits.
Correct: Subagent gathers (git log, diff, repo health) → Main writes everything.

**WEnDyS application:** This is already WEnDyS's practice. Worth making explicit. The retrospective is the soul artifact — it cannot be outsourced.

### 4. Skills vs Subagents — Different Concepts

Nat distinguishes cleanly: Skills are reusable knowledge modules (model-invoked, load on-demand). Subagents are isolated workers (explicitly spawned for a task).

**WEnDyS application:** WEnDyS has skills (`rrr`, `/recap`, etc.) but the distinction is not explicit in CLAUDE.md. Clarifying which commands are skills vs which spawn subagents would help Claude know when to load context vs when to spin up a worker.

### 5. The Infinite Learning Loop as Publishing Cycle

Nat's Oracle Stack v2 formalizes: `Error → Fix → Learn → Oracle → Blog → Share`. Every bug fix is a potential learning entry. Every learning entry is potential blog content.

**WEnDyS application:** DewS's learnings in `ψ/memory/learnings/` could be more systematically converted into blog posts or NDF documentation. The pattern already exists — the pipeline from memory to writing to publish is not yet formal. Formalizing it creates compounding value from work already done.

---

## Related Repos

| Repo | Purpose |
|------|---------|
| `laris-co/Nat-s-Agents` | Full private Oracle implementation |
| `Soul-Brews-Studio/oracle-skills-cli` | Install Oracle skills via npm/bun |
| `Soul-Brews-Studio/oracle-v2` | MCP server: hybrid FTS5 + ChromaDB search |
| `laris-co/oracle-status-tray` | Tauri 2.0 + Rust menu bar Oracle status app |
| `laris-co/claude-browser-proxy` | Claude Code → Gemini via MQTT Chrome extension |
| `Soul-Brews-Studio/pluto` | HTML5 2D physics game (side project) |

---

## Quick Install (Create Your Own Oracle)

```bash
# Prerequisites: gh CLI, git, Claude Code, Bun
bun install -g oracle-skills-cli
gh repo create my-oracle --public --clone
cd my-oracle
git checkout -b feat/oracle-birth
mkdir -p psi/{inbox,memory/{resonance,learnings,retrospectives,logs},writing,lab,active,archive,outbox,learn}
mkdir -p .claude/{agents,skills,hooks,docs}
oracle-skills install rrr recap trace feel fyi forward standup where-we-are project
```

Then create:
- `CLAUDE.md` — Identity, 5 Principles, Golden Rules
- `ψ/memory/resonance/<oracle-name>.md` — Soul file
- `ψ/memory/resonance/oracle.md` — Philosophy

---

## Golden Rules (from Source)

1. NEVER use `--force` flags
2. NEVER push to main — always feature branch + PR
3. NEVER merge PRs without user approval
4. NEVER create temp files outside repo (use `.tmp/`)
5. NEVER `git commit --amend` (breaks all agents via hash divergence)
6. Notify before accessing files outside the repo
7. Log activity — update focus + append activity log every task change
8. Subagent timestamps — show START+END time always
9. Use `git -C` not `cd` — respect worktree boundaries
10. Consult Oracle on errors — search before debugging, learn after fixing
11. Root cause before workaround — investigate WHY before suggesting alternatives
12. Query markdown with `duckdb`, not Read tool — saves tokens on large files

---

*Source: `C:\Users\CPL\ghq\github.com\Soul-Brews-Studio\opensource-nat-brain-oracle`*
*Studied: 2026-05-26 by WEnDyS*
*Files read: README.md, CLAUDE.md, DISTILLATION-LOG.md, psi-backup distilled files (resonance, learnings, active, inbox, lab, scripts, misc, courses-catalog)*
