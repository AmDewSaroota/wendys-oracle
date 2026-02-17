# Soul Brews Landing Page — Architecture

## Overview

A **zero-dependency static landing page** for Soul Brews — a community combining open-source software, AI design collaboration, and craft beer brewing. No build tools, no frameworks, no npm. Pure HTML + CSS + vanilla JS.

## Directory Structure

```
landing-page/
├── index.html              # Single-page HTML (all markup)
├── styles/
│   └── main.css            # All styles (178 lines)
├── scripts/
│   └── main.js             # All behavior (174 lines)
├── assets/
│   ├── logo.svg            # Brand logo (header + footer)
│   ├── favicon.svg         # Browser tab icon
│   └── og.png              # Open Graph social preview image
└── README.md               # Project documentation
```

**Total codebase**: ~520 lines (HTML: 168, CSS: 178, JS: 174)

## Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| HTML | `index.html` | All markup, meta tags, semantic structure |
| CSS | `styles/main.css` | Loaded via `<link>` in `<head>` |
| JS | `scripts/main.js` | Loaded via `<script defer>` in `<head>` |

No build step. No bundler. Files are served as-is.

## Page Sections (DOM Architecture)

```
<body>
  ├── <a.skip-link>                    # Accessibility: skip to content
  ├── <header.site-header>             # Sticky/fixed nav bar
  │     ├── .brand (logo + name)
  │     ├── .nav-toggle (hamburger)
  │     └── <nav#site-nav>             # Links + lang toggle
  ├── <main#main>
  │     ├── <section#hero>             # Hero: headline + mock UI card
  │     ├── <section#join.features>    # 3 cards: Code, Prompts, Brew Nights
  │     └── <section#roadmap.features> # 3 cards: Tools, Gather, Space
  └── <footer.site-footer>             # Brand, links, contact, year
```

## Core Abstractions

### 1. CSS Design Token System
All visual values in `:root` CSS custom properties:
- **Colors**: `--cream`, `--ink`, `--stone`, `--amber`, `--green`, `--foam`, `--bg`
- **Layout**: `--header-h` (64px), `--safe-bottom`
- **Decoration**: `--radius`, `--radius-sm`, `--shadow-1`, `--shadow-2`

### 2. Grid Layout System
- **Hero**: `grid-template-columns: 1.08fr .92fr` (asymmetric)
- **Features**: `.grid-3` = `repeat(3, 1fr)` (collapses to 1fr on mobile)
- **Footer**: `1.2fr 1fr 1fr` (collapses progressively)

### 3. Component Classes
- `.card` — White box with border, shadow, hover lift
- `.btn` / `.btn-outline` / `.btn-amber` — Button variants via CSS custom properties
- `.reveal` / `.is-visible` — Scroll-triggered fade-in animation
- `.mock-ui` — Dark-themed mock interface in hero

### 4. i18n System
- Dictionary object in JS (`I18N.en`, `I18N.th`)
- HTML elements use `data-i18n="key"` attributes
- `setLang()` function iterates all `[data-i18n]` elements and swaps text
- Language persisted in `localStorage`
- Button shows the *other* language (toggle behavior)

### 5. Intersection Observer (Scroll Reveal)
- Elements with `.reveal` class start invisible + shifted down
- Observer fires once at 12% visibility threshold
- Adds `.is-visible` class → CSS transition handles animation
- Observer unsubscribes after triggering (performance)

## Dependencies

**Zero external dependencies.** No npm, no package.json.

| Resource | Type | Source |
|----------|------|--------|
| Inter font | Web font | Google Fonts CDN |
| Playfair Display font | Web font | Google Fonts CDN |

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|---------------|
| > 960px | Full desktop: hero grid, 3-col features, 3-col footer |
| 761-960px | Hero collapses to 1 column, footer to 2 columns |
| < 760px | Everything single column, hamburger nav appears |

**Desktop (761px+)**: Header is `position: fixed`, body gets `padding-top: var(--header-h)`
**Mobile (< 760px)**: Header is `position: sticky`, nav becomes dropdown panel

## Deployment Architecture

Designed for **Cloudflare Pages**:
- No build command needed
- Output directory: `/` (root)
- All files served as static assets
- Can also be deployed anywhere static files are hosted

## Asset Footprint

| Asset | Size | Type |
|-------|------|------|
| index.html | 8.9 KB | HTML |
| styles/main.css | 6 KB | CSS |
| scripts/main.js | 6 KB | JavaScript |
| logo.svg | 1.2 KB | SVG |
| favicon.svg | 611 B | SVG |
| og.png | 711 KB | PNG |
| **Total (HTML/CSS/JS)** | **~21 KB** | |

Optimizations: `defer` on script, font `preconnect`, SVG assets, single CSS file (no waterfall), no third-party trackers.

## Git History

```
d55eb92  new og
9ee9e4a  Refresh OG preview with gradient, glows, and UI card
80cbfc3  Add Open Graph; EN-first copy; TH toggle; new sections
e002b80  landing page
3c57b4e  initial commit
```

## Design Decisions

1. **No framework** — Simple landing page doesn't need React/Vue/etc.
2. **No build tools** — No Vite, Webpack, etc. Reduces complexity to zero.
3. **CSS custom properties over Sass** — Native browser support, no compilation.
4. **Single HTML file** — Everything in one page, no routing needed.
5. **IntersectionObserver over scroll listeners** — Better performance, cleaner code.
6. **localStorage for i18n** — Language preference persists without server/cookies.
7. **Glassmorphism header** — Modern aesthetic with `backdrop-filter: blur()`.
8. **Semantic HTML** — `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` with ARIA attributes.
