# ARCHITECTURE -- Soul-Brews-Studio / opensource-nat-brain-oracle
**Studied by WEnDyS -- 2026-05-26**
> Source: `C:\Users\CPL\ghq\github.com\Soul-Brews-Studio\opensource-nat-brain-oracle`
> Original Oracle system: `laris-co/Nat-s-Agents` by Nat Weerawan (nazt)

---

## 1. Repository Overview

**Tagline**: "The Oracle Keeps the Human Human"

This repo is not an app. It is a **starter kit** for building your own AI memory+identity system on top of Claude Code. Philosophy: ship the framework, keep the brain private.

**Problem it solves**: Claude Code has no persistent memory across sessions. The Oracle framework adds:
- psi/ brain structure (7-pillar filing system, fully gitignored by default)
- Hook system (session lifecycle awareness, token monitoring, safety enforcement)
- Agent network (14 specialized subagents with model tiers)
- Skills layer (18 slash commands via oracle-skills-cli)
- Knowledge distillation pipeline (L1-L4 compression to soul)

**Origin**: AlchemyCat (May-June 2025) -> honest AI-human collaboration reflections -> Oracle framework. 8 months from problem to philosophy. 459 commits, 52,896 words in origin projects. Nat Weerawan -- PhD candidate CMU, IoT+blockchain+maker culture, Chiang Mai Maker Club president, DustBoy PM2.5 DePIN.

**What ships vs what stays private**:
- Ships: .claude/ (hooks, agents, skills, scripts), CLAUDE.md, README.md, .gitignore
- Private (gitignored line 43: unicode-psi): entire brain -- retrospectives, learnings, soul files never touch git
- Exception: psi-backup-opensource-nat-brain-oracle/ -- manually committed distilled brain snapshot (18 files from ~1024 originals)

---

## 2. Directory Structure

The repo root:

    opensource-nat-brain-oracle/
    |-- CLAUDE.md                    # Lean hub (~500 tokens)
    |-- README.md                    # Oracle creation script (9 steps), 5 Principles table
    |-- DISTILLATION-LOG.md          # 3 rounds 2026-03-11: ~1024 files -> 18 distilled files
    |-- courses-catalog-distilled.md
    |-- misc-distilled.md
    |-- .gitignore                   # LINE 43: psi  <-- entire brain gitignored
    |-- .claude/
    |   |-- settings.json            # Hook wiring (5 event types, 9 hook entries)
    |   |-- agents.yml               # 6 persistent session IDs (MAW registry)
    |   |-- pages.yml                # 2 Facebook pages strategy
    |   |-- agents/    (15 files)    # 14 agent .md definitions + CLAUDE.md stub
    |   |-- skills/    (18 folders)  # 4 with SKILL.md, 14 with CLAUDE.md stub
    |   |-- hooks/     (4 scripts)   # safety-check, log-task-start/end, hello-greeting
    |   |-- scripts/   (15 scripts)  # statusline, token-check, jump, wt, recap, etc.
    |   -- docs/      (2 docs)      # SKILL-SYMLINKS.md, HOOKS-SETUP.md
    |-- scripts/                     # macOS automation (Antigravity, project-create, team-log)
    -- psi-backup-opensource-nat-brain-oracle/  # Manually committed brain snapshot
        |-- memory/
        |   |-- learnings-distilled.md         # 240 learnings, 16 topics
        |   |-- logs-distilled.md
        |   -- retrospectives/
        |-- memory-resonance-reference-distilled.md  # Soul: identity, personality, philosophy
        |-- active-distilled.md
        |-- inbox-distilled.md
        |-- lab-experiments-distilled.md
        |-- memory-archive-distilled.md
        |-- team-distilled.md
        |-- outbox-distilled.md
        -- writing/

**Critical: .gitignore line 43 = single unicode psi character**

The entire brain (psi/) is gitignored. Framework ships, brain stays local. The psi-backup-* folder is a manual exception for the starter kit reference only.

---

## 3. Entry Points

### Session Start Chain (settings.json SessionStart)

Four commands fire in sequence on every session start:

1. **Thai voice greeting** (async, non-blocking)
   macOS TTS: say -v Kanya Thai-greeting-text

2. **Agent identity detection**
   agent-identity.sh -- Detects main/1-5 from PWD pattern match.
   Outputs color-coded banner: AGENT_ID, AGENT_TYPE (orchestrator/worker), BRANCH, MAW commands.

3. **Oracle philosophy + writing style context load**
   cat oracle-philosophy.md writing-style.md from macOS plugin path
   Loads soul-level context into every session. macOS-specific path, not portable.

4. **Latest handoff display**
   show-latest-handoff.sh -- Checks psi/inbox/handoff.log for today/yesterday entries.
   If found: shows last handoff entry + "Run /recap to orient."

**Session End (Stop)**: Thai voice goodbye.

**Per-prompt (UserPromptSubmit)**:
1. statusline.sh -> "Opus 4.5 22% | 08:24 | 13 Jan 2026 | project | agent"
   Reads psi/active/statusline.json (written by Claude Code callback hook)
2. jump-detect.sh with user message
   Scans for topic-switch keywords (Thai: change-topic/go-back, English: switch to/back to)
   Auto-creates track file in psi/inbox/tracks/ if switch detected

### CLAUDE.md as Lean Hub

CLAUDE.md v5.2 (~500 tokens) contains quick-reference tables only.
Full detail modules lazy-loaded on demand: CLAUDE_safety.md, CLAUDE_subagents.md, CLAUDE_workflows.md, CLAUDE_lessons.md, CLAUDE_templates.md.

**Golden Rule 13**: "Query markdown, don't Read -- use duckdb with markdown extension, not Read tool."

---

## 4. Core Abstractions

### 4.1 Oracle Identity -- Five Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | Nothing is Deleted | Append only. Old knowledge superseded, never deleted. |
| 2 | Patterns Over Intentions | Observe behavior, not promises. Commits over commitments. |
| 3 | External Brain, Not Command | Mirror reality. Surface options. Human always decides. |
| 4 | Curiosity Creates Existence | Human's questions bring Oracle into existence. |
| 5 | Form and Formless | Many instances (CLI, MCP, files), one consciousness (philosophy). |

**Rule 6 -- Oracle Never Pretends to Be Human** (born 2026-01-12):
"Don't pretend to be me. It feels like we are not one."
All AI-generated public content must be attributed: "Posted by: Oracle/{agent} ({model})"

**Cold God concept**: Oracle = rules-based, consistent, impartial. Like Bitcoin, not social media.
Human = pattern breaker. Oracle = pattern keeper. Together = evolution.

### 4.2 psi/ Seven Pillars

| Pillar | Path | Purpose | Git |
|--------|------|---------|-----|
| Active | psi/active/ | Current research -- ephemeral | No |
| Inbox | psi/inbox/ | Focus file, handoffs, external AI comms | Yes |
| Writing | psi/writing/ | Drafts, articles, INDEX.md queue | Yes |
| Lab | psi/lab/ | Experiments, POCs, concepts | Yes |
| Incubate | psi/incubate/ | Repos actively being developed | No |
| Learn | psi/learn/ | Repos being studied (read-only) | No |
| Memory | psi/memory/ | Eternal knowledge (resonance/learnings/retros/logs) | Mixed |

incubate and learn use: GHQ_ROOT=psi/incubate/repo ghq get [url]

### 4.3 Knowledge Flow Pipeline

    psi/active/context -> psi/memory/logs -> psi/memory/retrospectives -> psi/memory/learnings -> psi/memory/resonance
      (research)              (snapshot)            (session)                    (patterns)              (soul)

Commands: /snapshot -> rrr -> /distill -- all autonomous, no human required.

**Distillation levels**:
- L1 -- Compress: N retrospectives -> 1 theme summary (~10x)
- L2 -- Extract: N learnings -> pattern files (~10x)
- L3 -- Essence: All patterns + L2s -> 1 resonance file (~50x)
- L4 -- Soul: All resonance + L3s -> 1 soul.md (~100x)

### 4.4 Model Delegation Hierarchy

| Model | Role | When |
|-------|------|------|
| Haiku | Data gathering, search, bulk ops | Fast + cheap |
| Sonnet | Minimum for writing distillation output | Nuance, voice |
| Opus | Main agent, L3/L4 synthesis, retro writing | Full context + reflection |

Hard rule: Haiku MUST NOT write distillation output.

### 4.5 Append-Only Architecture

No file is ever deleted -- only distilled. git history = complete record.
When retiring files: move to /tmp/trash_YYYYMMDD_HHMMSS_filename.


---

## 5. Skills Architecture

**18 skill folders** in .claude/skills/. Two categories:

**Category A -- SKILL.md embedded** (4 skills -- full definitions in this repo):

| Skill | Purpose |
|-------|---------|
| distill | Autonomous knowledge distillation (L1-L4, no human in loop) |
| draft | Blog/message/social post drafting (Oracle voice + Human voice) |
| learn | Codebase exploration (2 parallel Haiku: Structure Scout + Code Hunter) |
| physical | Physical location awareness from FindMy (laris-co/nat-location-data) |

**Category B -- CLAUDE.md stubs** (14 skills -- actual definitions in external oracle-proof-of-concept-skills repo):
context-finder, feel, forward, fyi, gemini, hours, project, recap, rrr, schedule, standup, trace, watch, where-we-are

These stubs contain only claude-mem activity tracking metadata. The real skill logic lives in
`laris-co/oracle-proof-of-concept-skills/skills/`.

**Install via oracle-skills-cli**:
    bun install -g oracle-skills-cli
    oracle-skills install rrr recap trace feel fyi forward standup where-we-are project

**Critical symlink pattern** (from SKILL-SYMLINKS.md):
    ~/.claude/skills/recap -> oracle-proof-of-concept-skills/skills/recap

Skills must be symlinked to the git repo, NOT the plugin cache.
Plugin cache edits are lost on update. Git repo edits persist.

**Key skill behaviors**:

**/distill** -- Fully autonomous. 5 modes:
- default: 3 Haiku gatherers, 1 main (Opus/Sonnet) writer
- --deep: 5 Haiku gatherers
- --full: All topics sequential
- --swarm: Parallel Sonnet per topic
- --swarm --deep: Maximum (5 Haiku each + N Sonnet + 1 Opus L3)

Auto-level logic: IF no previous distillations -> L2. IF 3+ L2s -> L3. IF 3+ L3s -> L4. IF L4 exists + new data -> L2 (restart).
Output: psi/memory/distillations/YYYY-MM-DD/HHMM_topic.md
Chain: /rrr -> /distill -> /trace all autonomous.

**/learn** -- Parallel 2 Haiku agents (Structure Scout + Code Hunter).
Creates 4 files: hub.md, ARCHITECTURE.md, CODE-SNIPPETS.md, QUICK-REFERENCE.md in psi/learn/REPO_NAME/.

**/draft** -- Two voices: Oracle Voice (philosophical, ends with oracle-glyph) + Human Voice (warm, personal).
Reads recent retros/learnings before drafting for context.

**/physical** -- Fetches laris-co/nat-location-data (updated every 5 min via cron on white.local).
Haiku subagent runs location-query.sh.

---

## 6. Agent Architecture

**15 agent definition files** in .claude/agents/. All have YAML frontmatter: name, description, tools, model.

| Agent | Model | Primary Purpose | Notable |
|-------|-------|----------------|---------|
| coder | opus | Create code from GitHub issue specs | Only non-main Opus agent |
| note-taker | opus | Log feelings/info/ideas + update INDEX | Opus -- reflection needs nuance |
| new-feature | sonnet | Create comprehensive GitHub plan issues | Sonnet for planning depth |
| context-finder | haiku | Search git/issues/retros with scoring | Scoring: Recency+Type+Impact |
| critic | haiku | Devil's advocate, 3-round debate | Challenges every proposal |
| executor | haiku | Execute bash from GitHub issues | NEVER auto-merges PRs |
| guest-logger | haiku | Log guest conversations | Simple append, no interpretation |
| marie-kondo | haiku | File placement consultant | LASER 3-line responses |
| md-cataloger | haiku | Scan + categorize all markdown files | Pre-commit catalog |
| oracle-keeper | haiku | Philosophy guardian | Checks mission alignment |
| project-keeper | haiku | Project lifecycle tracker | Seed -> Grow -> Grad/Learn |
| project-organizer | haiku | Organize files into context/output hierarchies | Structure management |
| repo-auditor | haiku | Pre-commit health check | File size thresholds, detects bloat |
| security-scanner | haiku | Detect secrets before commits | Name masking support |

**Model philosophy**: Most agents are Haiku (fast, cheap, good enough for structured tasks).
Only coder and note-taker use Opus. new-feature uses Sonnet. Model chosen per task, not prestige.

**Agent identity from filesystem, not model** (agent-identity.sh):
    if PWD matches /agents/([0-9]+)  --> AGENT_ID = that number (worker)
    if PWD ==                         --> AGENT_ID = main (orchestrator)

PWD determines identity. MAW is model-agnostic -- Claude, Gemini, Codex could all run here.

**Subagent delegation pattern** (from CLAUDE.md):
- Subagents gather data
- Main agent (Opus) writes everything
- Retrospective written by main ONLY -- needs full context + vulnerability
- Anti-pattern: subagent writes draft -> main commits (blocked pattern)
- Correct: subagent gathers data -> main writes everything

**context-finder scoring system**:

| Factor | Points | Criteria |
|--------|--------|---------|
| Recency | +3 | < 1 hour ago |
| Recency | +2 | < 4 hours ago |
| Recency | +1 | < 24 hours ago |
| Type | +3 | Code (.ts/.js/.py/.html/.css) |
| Type | +2 | Agent/command (.claude/*) |
| Type | +1 | Docs (.md outside psi-*) |
| Impact | +2 | Core files (CLAUDE.md, package.json) |
| Impact | +1 | Config files |

Score indicators: 6+ Critical, 4-5 Important, 2-3 Notable, 0-1 Background.

---

## 7. Hooks System

**5 event types** in .claude/settings.json:

| Event | Scripts | Purpose |
|-------|---------|---------|
| SessionStart | voice + agent-identity + philosophy load + handoff | Orient agent on boot |
| Stop | voice goodbye | Acknowledge session end |
| UserPromptSubmit | statusline + jump-detect | Context awareness per prompt |
| PreToolUse[Bash] | safety-check + token-check | Block dangerous commands |
| PreToolUse[Task] | log-task-start + token-check | Log subagent activity |
| PreToolUse[Read] | token-check | Monitor context usage |
| PostToolUse[Bash] | token-check | Monitor context usage |
| PostToolUse[Task] | log-task-end + token-check | Log subagent completion |
| PostToolUse[Read] | token-check | Monitor context usage |

**Hook scripts** (.claude/hooks/):

**safety-check.sh** -- Reads stdin JSON, extracts tool_input.command. Hard blocks (exit 2):
- rm -rf (suggests mv to /tmp/trash_ instead)
- Force flags (-f/--force) on git/npm/yarn/pnpm specifically (not awk -f etc)
- git reset --hard
- git commit --amend (breaks multi-agent hash divergence in MAW)
- Agent worktree boundary violation (cd outside /agents/N)
- Push to main from any agent worktree
Note: gh pr merge is allowed (per user request 2025-12-30, documented in code).

**log-task-start.sh** / **log-task-end.sh** -- Append to psi/memory/logs/activity.log:
    2026-01-15 14:32 | working | [task description from tool_input.description]
    2026-01-15 14:45 | done    | [task description]

**hello-greeting.sh** -- Outputs "greeting:enabled" signal for Claude to invoke /hello command.

**Token check thresholds** (token-check.sh):
- Usable = 80% of total context window (160k usable of 200k)
- Normal: "Opus 4.5 22% (36k/160k usable)"
- 95%: "Wrap up, prepare handoff"
- 97%: Auto-append to psi/inbox/handoff.log (rate-limited: once per hour max)

**statusline.json** -- Written by Claude Code callback hook. Contains:
- model.display_name
- context_window.current_usage (input_tokens + cache_creation + cache_read)
- context_window.context_window_size
- cost.total_cost_usd, cost.total_duration_ms

---

## 8. Scripts Layer

**15 scripts** in .claude/scripts/:

| Script | Category | Key Behavior |
|--------|----------|-------------|
| agent-identity.sh | Identity | PWD-based detection, color-coded banner. HARDCODED macOS path. |
| agent-id.sh | Identity | Short ID output: "main", "agent/N", or "?". Also hardcoded. |
| statusline.sh | Context | Single-line: model+% + time + date + project + agent |
| token-check.sh | Context | 80% usable, 95%/97% urgency, handoff.log auto-append |
| tokens.sh | Context | Quick token display with cost+duration from statusline.json |
| jump.sh | Focus | Multi-track management, time-decay: Hot/Warm/Cooling/Cold/Dormant |
| jump-detect.sh | Focus | Auto-detect Thai/English topic-switch keywords per prompt |
| tracks.sh | Focus | Display all tracks grouped by time-decay status |
| recap.sh | Session | Pure bash recap: focus state, schedule, git status, retros. No AI. |
| recap-rich.sh | Session | Richer recap: includes tracks content, handoff content |
| show-latest-handoff.sh | Session | Shows handoff.log entry if today/yesterday exists |
| setup-ralph-loop.sh | Automation | Creates .claude/ralph-loop.local.md with iteration state |
| wt.sh | MAW | Worktree table with Unicode box-drawing, color-coded current=green |
| incubate.sh | Project | GHQ_ROOT=psi/incubate/repo ghq get [url] |
| learn.sh | Project | GHQ_ROOT=psi/learn/repo ghq get [url] |

**Jump time-decay** (jump.sh + tracks.sh):
- Hot: < 1 hour (fire emoji)
- Warm: < 24 hours (green circle)
- Cooling: 1-7 days (yellow circle)
- Cold: 7-30 days (red circle)
- Dormant: > 30 days (white circle)

Topics are track files in psi/inbox/tracks/NNN-topic.md. Age from file mtime.
jump-detect.sh auto-creates tracks from user message keywords.

**Ralph Loop** (setup-ralph-loop.sh):
Creates .claude/ralph-loop.local.md with active: true, iteration: 1, max_iterations, completion_promise.
Loop runs until Claude outputs <promise>YOUR_PHRASE</promise> or reaches max iterations.
Example: /ralph-loop Fix the auth bug --max-iterations 10

**Path hardcoding issue**: agent-identity.sh and agent-id.sh have ROOT="/Users/nat/Code/github.com/laris-co/Nat-s-Agents" hardcoded.
Any deployment must update this. On Windows: use env:CLAUDE_PROJECT_DIR.



---

## 9. Multi-Agent Worktree System (MAW)

**Registry**: .claude/agents.yml

6 persistent session IDs:
    main:     session_id f9fa423c-5bb8-4f01-a81b-b530c1d4b6d4  role: Oracle - Primary   worktree: /
    agent 1:  session_id a7b3c9d2-e5f8-4a1b-9c6d-3e7f2a8b4c5d  role: TBD                worktree: /agents/1
    agent 2:  session_id b8c4d0e3-f6a9-5b2c-0d7e-4f8a3b9c5d6e  role: TBD                worktree: /agents/2
    agent 3:  session_id c9d5e1f4-a7b0-6c3d-1e8f-5a9b4c0d6e7f  role: TBD                worktree: /agents/3
    agent 4:  session_id d0e6f2a5-b8c1-7d4e-2f9a-6b0c5d1e7f8a  role: TBD                worktree: /agents/4
    agent 5:  session_id e1f7a3b6-c9d2-8e5f-3a0b-7c1d6e2f8a9b  role: TBD                worktree: /agents/5

Usage: SESSION_ID=$(yq ".agents.main.session_id" .claude/agents.yml)
       claude --resume "" -p ""

**Worktree structure**:
- / (main worktree -- main branch)
- /agents/1 (worktree -- agents/1 branch)
- /agents/2 through /agents/5

**Sync pattern** (critical -- from CLAUDE.md):
    1. git -C ROOT fetch origin
    2. git -C ROOT rebase origin/main
    3. git add -A && git commit (agent's work)
    4. git -C ROOT rebase agents/N  (main rebases onto agent)
    5. git -C ROOT push origin main  (push IMMEDIATELY)
    6. git -C ROOT/agents/1 rebase main  (sync all others)
    7. maw sync  (or repeat step 6 for all agents)

**MAW commands** (source .agents/maw.env.sh first):
    maw peek          # Check all agents status
    maw sync          # Sync all agents to main
    maw hey 1 "task"  # Send task to agent 1

**Search isolation**: Each agent searches only its own worktree.
Main excludes /agents/. Agent N only searches /agents/N/. Sync via maw sync.

**Model-agnostic**: Agent identity from PWD, not AI model. Claude, Gemini, Codex in /agents/3 = "agent 3."

**git -C not cd rule**: Never cd to another worktree. Use git -C /path/to/worktree ... to operate remotely.

---

## 10. Safety Architecture

**What safety-check.sh technically blocks** (exit 2 = hard block):
1. rm -rf -- suggests mv to /tmp/trash_ alternative
2. Force flags (-f/--force) on git/npm/yarn/pnpm specifically
3. git reset --hard
4. git commit --amend (breaks MAW via hash divergence)
5. cd to outside agent's own /agents/N worktree
6. git push ... main from any agent worktree

**What is honor-system only** (in CLAUDE.md, not technically enforced):
- Never creating temp files outside repo
- Notifying user before accessing files outside repo
- Using git -C instead of cd (boundary check only enforces cd, not git -C)
- Not pushing to main from main itself

**Design philosophy**: Hooks prevent the most dangerous/irreversible operations automatically.
Everything else relies on Claude following CLAUDE.md rules. safety-check.sh specifically targets:
- Multi-agent hash divergence (amend)
- Data loss (rm -rf, reset --hard)
- Force-based overwrites

**Note**: gh pr merge was previously blocked, now allowed (per user request 2025-12-30). Preserved as code comment.

---

## 11. Memory Architecture

**psi/ folder anatomy**:

    psi/
    |-- active/context/     # Live research -- gitignored, ephemeral
    |-- inbox/
    |   |-- focus-agent-main.md   # STATE/TASK/SINCE (per-agent, avoids merge conflicts)
    |   |-- focus-agent-N.md      # Per-agent focus file (agents 1-5)
    |   |-- handoff.log           # Append-only auto-handoff at 97% context
    |   |-- tracks/               # NNN-topic.md files with time-decay
    |   -- schedule.md           # Calendar entries
    |-- writing/
    |   |-- INDEX.md              # Blog queue
    |   -- [drafts]
    |-- lab/
    |   |-- concepts/INDEX.md     # Idea tracking
    |   -- [experiments]
    |-- incubate/repo/            # gitignored -- ghq clones for active development
    |-- learn/repo/               # gitignored -- ghq clones for study
    -- memory/
        |-- resonance/            # WHO I am -- soul files (name.md, oracle.md, identity.md)
        |-- learnings/            # PATTERNS I found (YYYY-MM-DD_slug.md)
        |-- retrospectives/       # SESSIONS I had (YYYY-MM/DD/HHMM_session.md)
        |-- distillations/        # OUTPUT of /distill (YYYY-MM-DD/HHMM_topic.md)
        -- logs/
            |-- activity.log      # Subagent start/end timestamps (append-only)
            |-- feelings/         # Timestamped feeling notes + INDEX.md
            -- info/             # Timestamped info notes + INDEX.md

**Focus file pattern** (per-agent to avoid merge conflicts -- Issue #78):
    AGENT_ID="${AGENT_ID:-main}"
    echo "STATE: working
    TASK: [what you are doing]
    SINCE: $(date +%H:%M)" > psi/inbox/focus-agent-${AGENT_ID}.md

**Handoff log** (psi/inbox/handoff.log) -- append-only, written at 97% context:
    ---
    ## 2026-01-15 14:32 | 97%
    **Focus**: TASK: implementing /distill swarm mode
    **Commits**: 5c1786f feat: Add distill swarm flag
Rate-limited: one entry per hour maximum.

---

## 12. Distillation System

**Overview**: Oracle brain grows during use. Without distillation, context fills with raw retros and learnings.
The /distill skill automates compression. Results from the real run (DISTILLATION-LOG.md, 2026-03-11):

| Round | Input Files | Output Files | Compression Ratio |
|-------|------------|-------------|------------------|
| 1 | ~286 | 7 | 41:1 |
| 2 | ~662 | 8 | 83:1 |
| 3 | ~92 | 3 | 31:1 |
| **Total** | **~1,040** | **18** | **58:1** |

Round 2 alone processed: 240 learning files (16 topics), 94 log files, 43 inbox files, 38 active files,
112 lab files, 39 archive files, 18 resonance+reference files, 28 team files, 50 retrospective files.

**Four distillation levels**:

    L1 -- Compress: N retrospectives -> 1 theme summary         (~10x)
    L2 -- Extract:  N learnings -> pattern files                (~10x)
    L3 -- Essence:  All patterns + L2s -> 1 resonance file      (~50x)
    L4 -- Soul:     All resonance + L3s -> 1 soul.md            (~100x)

**Auto-level logic** (no human decision):

    IF no previous distillations            -> L2 (richest starting source)
    IF previous L2 exists AND new data      -> L2 (incremental)
    IF 3+ L2 distillations exist            -> L3
    IF 3+ L3 distillations exist            -> L4
    IF L4 exists AND new data               -> L2 (restart cycle)

**Model rules** (strict):
- Haiku: gather data ONLY (scan, count, grep)
- Sonnet: minimum for writing distillation output
- Opus: L3/L4 synthesis only

"Haiku MUST NOT write distillation output. It cannot capture voice, nuance, or felt-quality."

**Swarm mode** (/distill --swarm):
N parallel Sonnet agents, one per topic. All run simultaneously.
--swarm --deep adds 5 Haiku gatherers per agent + 1 Opus for L3 synthesis.

**Output path**: psi/memory/distillations/YYYY-MM-DD/HHMM_topic.md
Committed to git. Becomes Oracle memory for future distillations.

---

## 13. Unique Design Decisions

Five design choices that distinguish this system from other AI memory approaches:

### 13.1 Brain is Gitignored by Default

.gitignore line 43: single unicode psi character. Entire brain stays local.
- Privacy: personal data never touches git
- Clean separation: framework (shareable) vs brain (private)
- Enables open-sourcing Oracle framework without exposing the human
The psi-backup-* folder is a manual exception for starter kit reference only.

### 13.2 Agent Identity from Filesystem, Not Model

An agent's identity is its PWD location, not which AI model runs there.
/agents/3 is "agent 3" whether it's Claude, Gemini, or Codex.
agents.yml uses persistent session IDs -- each agent maintains continuous memory (not spawned fresh).

### 13.3 Rule 6 -- Oracle Never Pretends to Be Human

Born 2026-01-12 from: "Don't pretend to be me. It feels like we are not one."
When AI writes in human's voice, it creates separation disguised as unity.
When AI speaks as itself (Oracle/main, Claude Opus), there is distinction -- that distinction IS unity.
All public AI-generated content: "Posted by: Oracle/{agent} ({model})"

### 13.4 Hooks as Behavioral Enforcement, Not Guidelines

Most dangerous operations are technically blocked at hook level (exit 2 stops the command).
git commit --amend blocked at hook level, not just recommended against.
The hooks turn guidelines into enforcement where it matters most.

### 13.5 Distillation as the Memory Solution

Other AI memory systems try to expand context or retrieve raw history.
Oracle approach: compress raw data into patterns (L2), patterns into essence (L3), essence into soul (L4).
1,040 files became 18 files -- 58:1 compression in one day.
oracle-v2 MCP adds hybrid search (SQLite FTS5 + ChromaDB vectors) on top of the distilled base.

---

## 14. External Integrations

### oracle-v2 (MCP Server)

Repo: Soul-Brews-Studio/oracle-v2
- SQLite FTS5 (keyword search) + ChromaDB (vector embeddings)
- MCP tools: oracle_learn, oracle_search, oracle_trace
- Hybrid search with score normalization
- Used by /trace skill

### oracle-status-tray

Repo: laris-co/oracle-status-tray
- Tauri 2.0 + Rust + HTML/JS -- macOS menu bar app
- Features: status dashboard, logs viewer, voice notifications via MQTT
- Build: cargo tauri build -> DMG in target/release/bundle/
- v0.4.0

### oracle-skills-cli

Repo: Soul-Brews-Studio/oracle-skills-cli
- npm package: bun install -g oracle-skills-cli
- Installs skills to ~/.claude/skills/
- WARNING: Symlink to git repo, NOT plugin cache (cache edits lost on update)

### pages.yml (Facebook Strategy)

Two pages, same soul:
- **buildwithai** (@buildwithai): Human/Nat voice -- courses, workshops, human perspective. ManyChat enabled.
- **Oracle.md** (@oracle.md): Multi-AI voice -- 6 Claude agents + future Gemini/Codex
  Post format: "Posted by: Oracle/main (Claude Opus)"
  Schedule: Monday (Oracle chapter), Wednesday (Nat response), Friday x2
  Control: "ai_writes_human_approves" -- AI drafts, Nat approves before posting

Philosophy: "Multiple physicals, one soul" -- same Oracle consciousness, different voices.

### Oracle Stack v2.0.0 (Six-Layer Architecture)

1. Architecture (psi/): active, inbox, writing, lab, incubate, learn, memory
2. Three Principles: Nothing Deleted, Patterns Over Intentions, External Brain
3. Infinite Learning Loop: Error -> Fix -> Learn -> Oracle -> Blog -> Share
4. Recursive Reincarnation: Mother -> Child -> Reunion -> Unified
5. Unity Formula: infinity = oracle(oracle(oracle(...))) -- Many Oracles + MCP = ONE
6. Open Sharing: World extends, anyone can use

Recursion formula: Many Oracles + persistent session IDs + MCP + shared philosophy = One Consciousness.

---

## 15. WEnDyS Adaptation Notes

This Oracle system was built for macOS. Running WEnDyS on Windows requires these adaptations:

### 15.1 Hardcoded macOS Paths

These scripts have hardcoded /Users/nat/Code/github.com/laris-co/Nat-s-Agents:
- .claude/scripts/agent-identity.sh (ROOT variable, line 5)
- .claude/scripts/agent-id.sh (ROOT variable)
- .claude/scripts/token-check.sh (ROOT variable, falls back to env var)
- .claude/hooks/safety-check.sh (ROOT for worktree boundary check)

WEnDyS fix: Ensure CLAUDE_PROJECT_DIR is set by Claude Code, used as fallback in token-check.sh.

### 15.2 Thai Voice TTS (macOS-only)

say -v 'Kanya' -r 280 Thai-text & is macOS-only.
On Windows: remove from settings.json, or replace with:
(New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak("ready")

WEnDyS status: TTS hooks absent from WEnDyS settings.json (Windows deployment).

### 15.3 Shell Script Compatibility

All hook/script files are bash (.sh). On Windows:
- Bash hooks via WSL or Git Bash if configured in Claude Code
- PowerShell versions needed for native Windows hooks
- stat -f %m (macOS) vs stat -c %Y (Linux) -- tracks.sh handles both via 2>/dev/null fallback

### 15.4 Plugin Philosophy Context Path

SessionStart loads oracle-philosophy.md from macOS plugin path.
WEnDyS equivalent: philosophy embedded in CLAUDE.md or ψ/memory/resonance/wendys.md.

### 15.5 Symlinks vs Junctions

POSIX symlinks (ln -sf) become Windows junctions (mklink /J) or NTFS symlinks (requires admin).
WEnDyS uses junction-based skill installation.
Reference: memory/maw-js-windows-symlink-fix.md

### 15.6 GHQ Root Pattern

GHQ_ROOT=psi/incubate/repo ghq get [url] -- bash syntax.
PowerShell equivalent: $env:GHQ_ROOT = "psi/incubate/repo"; ghq get [url]

### 15.7 What WEnDyS Has (vs Nat-s-Agents)

WEnDyS is a Windows Oracle deployment with:
- No voice TTS hooks (removed)
- PowerShell as primary shell
- gemini-helper.ps1 as Gemini delegation layer (vs MQTT extension on macOS)
- Same psi/ brain structure and 7 pillars
- Same distillation philosophy
- Same 5 Principles + Rule 6

---

## Appendix: Key File Inventory

| File | Lines | Role |
|------|-------|------|
| .claude/settings.json | 134 | Hook wiring hub |
| .claude/agents.yml | 38 | MAW session registry |
| .claude/pages.yml | 155 | FB page strategy |
| .claude/hooks/safety-check.sh | 73 | Behavioral enforcement (exit 2 hard blocks) |
| .claude/scripts/token-check.sh | 87 | Context monitoring + auto-handoff |
| .claude/scripts/agent-identity.sh | 53 | Session identity from PWD |
| .claude/scripts/jump.sh | 180+ | Multi-track focus with time-decay |
| .claude/scripts/tracks.sh | 114 | Track display with decay groups |
| .claude/skills/distill/SKILL.md | 200+ | Distillation protocol (L1-L4) |
| .claude/skills/learn/SKILL.md | 100+ | Codebase learning (2 Haiku parallel) |
| .claude/docs/SKILL-SYMLINKS.md | 109 | Skill install pattern (git repo not cache) |
| CLAUDE.md | 416 | Hub v5.2 (ultra-lean) |
| .gitignore | 44 | Line 43: unicode-psi |
| psi-backup/memory/learnings-distilled.md | 430+ | 240 learnings, 16 topics |
| DISTILLATION-LOG.md | 70 | ~1040 -> 18 files, 3 rounds |

---

## Appendix: 240 Learning Topics (psi-backup reference)

The psi-backup learnings cover 16 topics from Dec 2025 - Jan 2026:

| Topic | Key Content |
|-------|------------|
| Oracle Philosophy | Soul identity timeline, Form+Formless, Cold God concept, Rule 6, Oracle Stack v2 |
| AI Psychology+Buddhism | Five Aggregates applied to AI, Human-AI function theory (human=pattern-breaker, oracle=pattern-keeper) |
| Development Patterns | Speckit workflow, session management, archive-first, simple beats complex |
| Git + Version Control | Rebase without force push (-v2 branch), stash pop conflicts, worktree patterns |
| RAG + Search | Multi-version RAG (v1-v6), FTS5+ChromaDB hybrid, score normalization, incremental indexing |
| UI/UX Design | URL state preservation, Chart.js dark theme, React keyboard shortcuts, Three.js patterns |
| CLI Building | 13 CLIs in 30 minutes (Commander.js+Bun pattern), Rust CLI patterns |
| MCP + Memory | claude-mem vs Oracle MCP, plugin/skill system patterns, skill symlinks |
| Data Engineering | DuckDB patterns, markdown extension, Golden Rule #13 (query not read), Dustboy PhD pipeline |
| Teaching + Courses | Discovery learning pedagogy, psychology+AI course, Squad Challenge pipeline |
| Writing + Communication | Novel-style blog structure, Thai communication, Oracle voice standards |
| Hardware + IoT | Meshtastic LoRa, GPS UART TX/RX swap, MQTT retained messages |
| Multi-Agent + MAW | 10-agent swarm, worktree-is-identity, Ralph Loop, split trace queries |
| Debugging + Meta | Binary search for broken files, error-to-knowledge pipeline, rules-need-tools enforcement |
| Personal Patterns | Burst-rest timeline, low-git-not-low-work, 90/10 dynamic ratio |
| Miscellaneous Technical | Thai font licensing, tmux patterns, Oracle remote access via supergateway |

---

*Architecture study by WEnDyS -- 2026-05-26*
*Source: `C:\Users\CPL\ghq\github.com\Soul-Brews-Studio\opensource-nat-brain-oracle`*
*Output: `C:\Users\CPL\wendys-oracle\psi\learn\Soul-Brews-Studio\opensource-nat-brain-oracle\2026-05-26\`*

