---
name: slide
description: Create presentations as Google Slides. Use when user says "slide", "presentation", "make slides", "create slides", or needs to build a slide deck. Outputs editable Google Slides that can be opened directly in the browser.
user-invocable: true
argument-hint: <topic or content description>
---

# /slide

Create professional presentations and push them to Google Slides for editing.

## Usage

```bash
/slide <topic or content description>
```

## Examples

```bash
/slide NDF Smart Tourism Platform overview for SRT
/slide EcoStove air quality monitoring — 10 slides, Thai
/slide company intro presentation, dark theme, English
```

## Workflow

### Step 1: Gather Requirements

Use `AskUserQuestion` to ask (skip if user already specified):

1. **Theme**: `ndf` (navy/blue/orange), `dark` (gold/blue on dark), `light` (blue/green on light), or custom colors?
2. **Language**: Thai (`th`), English (`en`), or mixed?
3. **Slide count**: How many slides? (suggest 8-15 for most topics)
4. **Font**: Default is `Prompt` (supports Thai). Other options: `Sarabun`, `IBM Plex Sans Thai`, `Noto Sans Thai`

### Step 2: Design Slide Structure

Create a JSON file following the `SlideDeck` format. Write it to `.claude/sync/global-skills/slide/tmp/slides-<timestamp>.json`.

**Available layouts:**

| Layout | Use for |
|--------|---------|
| `title` | Cover slide — big title + subtitle + optional icon |
| `content` | Title bar + bullet points with emoji icons |
| `two-column` | Side-by-side comparison (left/right columns) |
| `image-text` | Image + text (specify imagePosition: left/right) |
| `blank` | Thank you / section divider |

**JSON structure:**

```json
{
  "title": "Presentation Title",
  "theme": "ndf",
  "language": "th",
  "font": "Prompt",
  "slides": [
    {
      "layout": "title",
      "title": "Main Title",
      "subtitle": "Subtitle text",
      "icon": "🚀"
    },
    {
      "layout": "content",
      "title": "Section Title",
      "icon": "📊",
      "bullets": [
        { "text": "First point", "icon": "✅" },
        { "text": "Second point", "icon": "🔧", "sub": ["Detail A", "Detail B"] }
      ]
    },
    {
      "layout": "two-column",
      "title": "Comparison",
      "left": {
        "heading": "Before",
        "icon": "❌",
        "bullets": [{ "text": "Old way" }]
      },
      "right": {
        "heading": "After",
        "icon": "✅",
        "bullets": [{ "text": "New way" }]
      }
    },
    {
      "layout": "blank",
      "content": "Thank You 🙏"
    }
  ]
}
```

**Design tips:**
- Use emoji icons generously (flat, colorful style)
- Keep bullets concise — 3-6 per slide
- Vary layouts to keep it interesting (don't use all `content`)
- Start with `title`, end with `blank` (thank you)
- Use `two-column` for before/after, pros/cons, comparison
- Add `notes` field for speaker notes

### Step 3: HTML Preview (Optional)

Generate an HTML preview for quick review before creating Google Slides:

```bash
cd .claude/sync/global-skills/slide && npx tsx scripts/preview-html.ts tmp/slides-<timestamp>.json
```

This creates an HTML file that can be opened in dev-browser. Show it to the user if they want to review before creating Google Slides.

### Step 4: Create Google Slides

```bash
cd .claude/sync/global-skills/slide && npx tsx scripts/create-slides.ts tmp/slides-<timestamp>.json
```

The script outputs:
```
=== RESULT ===
{"presentationId":"...","url":"https://docs.google.com/presentation/d/.../edit","title":"...","slideCount":10}
=== END ===
```

### Step 5: Open in Browser

Use dev-browser to open the Google Slides URL:

```bash
cd .claude/sync/global-skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("slides");
await page.goto("GOOGLE_SLIDES_URL_HERE");
await waitForPageLoad(page);
console.log({ title: await page.title(), url: page.url() });
await client.disconnect();
EOF
```

Tell the user the Google Slides is open and ready for editing.

## Theme Presets

| Theme | Primary | Secondary | Accent | Background |
|-------|---------|-----------|--------|------------|
| `ndf` | navy #1a3f6f | blue #2e74b5 | orange #e67e22 | white #ffffff |
| `dark` | gold #d4a843 | blue #2e74b5 | orange #e67e22 | dark navy #0d1b3e |
| `light` | blue #2e74b5 | teal #3a7ca5 | green #27ae60 | light gray #f0f4f8 |

Custom theme: pass an object with `primary`, `secondary`, `accent`, `background`, `text`, `muted` (all hex colors).

## First-Time Setup

If `create-slides.ts` fails with auth errors, run setup:

```bash
cd .claude/sync/global-skills/slide && npm install && npx tsx scripts/setup.ts
```

This requires:
1. Google Cloud project with **Slides API** and **Drive API** enabled
2. OAuth 2.0 credentials (Desktop App) saved to `~/.config/wendys-slide/credentials.json`
3. Browser authorization (one-time)

Guide user through setup if credentials are missing.

## Architecture

```
.claude/sync/global-skills/slide/
  SKILL.md           ← Source skill definition
  scripts/
    types.ts         ← TypeScript interfaces (SlideDeck, SlideSpec, etc.)
    themes.ts        ← 3 presets (ndf, dark, light) + custom theme support
    layouts.ts       ← Google Slides API request builders (5 layouts)
    auth.ts          ← OAuth helper (credentials + token management)
    setup.ts         ← One-time OAuth setup (interactive)
    create-slides.ts ← JSON → Google Slides API (main script)
    preview-html.ts  ← JSON → HTML preview (standalone)
  tmp/               ← Generated files (gitignored)
  package.json       ← Dependencies: googleapis, @google-cloud/local-auth
```

## Requirements

- Node.js 18+
- `npm install` in `.claude/sync/global-skills/slide/`
- Google Cloud credentials (for Google Slides creation)
- dev-browser running (for opening slides in Chrome)
