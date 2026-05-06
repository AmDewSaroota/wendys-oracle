---
installer: oracle-skills-cli v1.5.36
name: deep-research
description: Deep Research via Gemini. Use when user says "deep research", "research this topic", or needs comprehensive analysis with sources.
alias: /gemini research
---
installer: oracle-skills-cli v1.5.36

# /deep-research

Deep Research automation via Gemini using **dev-browser** (Playwright).

Opens Gemini tab, selects Deep Research mode, sends prompt, and starts research.

## Usage

```bash
/deep-research <topic>
```

## Examples

```bash
/deep-research compare yeast S-33 vs T-58
/deep-research best practices for brewing Belgian ales
/deep-research React Server Components vs traditional SSR
```

## Workflow

1. Connect to dev-browser (Extension mode)
2. Create/get Gemini page
3. Navigate to gemini.google.com
4. Select Deep Research mode via ARIA snapshot
5. Type research prompt
6. Click "Start research" button

## Running the Script

The script must run from the **dev-browser directory** (for `@/` import alias):

```bash
cd skills/dev-browser && npx tsx ../deep-research/scripts/deep-research.ts "<topic>"
```

## Requirements

- **dev-browser extension server** running (`cd skills/dev-browser && npm run start-extension`)
- Chrome with dev-browser extension connected
- Logged into Google/Gemini in Chrome

## Architecture

```
Claude Code → dev-browser (Playwright) → Chrome Extension → Gemini Web UI
```

No MQTT or mosquitto required. Uses Playwright's ARIA snapshots for reliable element discovery.
