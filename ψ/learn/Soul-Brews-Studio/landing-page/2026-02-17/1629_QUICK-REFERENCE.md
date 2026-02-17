# Soul Brews Landing Page — Quick Reference

## What It Does

Soul Brews is a modern, responsive marketing landing page for a community-focused initiative that combines open-source software development, AI design collaboration, and craft beer brewing culture. The site introduces the Soul Brews mission, showcases how to join the "Build Crew" through code contributions, AI prompt co-design, and community brew events, and outlines a phased roadmap toward building a physical community gathering space. It's a static, no-build-required site that emphasizes visual appeal, accessibility, and bilingual support (English/Thai).

## Tech Stack

- **HTML5** — Semantic markup with accessibility features (ARIA labels, skip links, landmark roles)
- **CSS3** — Custom properties (CSS variables), CSS Grid/Flexbox, responsive design, animations & transitions
- **Vanilla JavaScript** — No frameworks; lightweight utilities for mobile nav, scroll interactions, i18n, IntersectionObserver
- **Fonts**: Playfair Display (headlines), Inter (body/UI) via Google Fonts
- **Hosting** — Designed for Cloudflare Pages (static deployment)
- **No build tool** — Pure static HTML, CSS, and JS

## Installation & Running Locally

**Option 1: Direct Browser**
```
Open index.html directly in your browser
```

**Option 2: HTTP Server**
```bash
cd landing-page
python3 -m http.server 5173
# Visit http://localhost:5173
```

No npm install required—this is a static site with no dependencies.

## Key Features

**Sections:**
1. **Header** — Sticky nav with logo, menu links (Join, Roadmap, Discord, GitHub), language toggle, mobile hamburger
2. **Hero** — Display headline, supporting text, decorative mock UI card with accent badge
3. **Join the Build Crew** — 3-column grid of cards: Contribute Code, Co-design Prompts, Brew Nights (with emoji icons, descriptions, CTAs)
4. **Roadmap** — Phase 1 (Tools), Phase 2 (Gather), Phase 3 (Space) on alternate background
5. **Footer** — Brand, links, contact info, dynamic copyright year

**Interactions:**
- Mobile nav toggle (closes on link click)
- Scroll-reveal animations (fade-in + slide-up via IntersectionObserver)
- Smooth anchor scrolling
- Language toggle (EN/TH) with localStorage persistence
- Card hover effects (lift + shadow)

**Accessibility:**
- Skip-to-content link, semantic HTML, ARIA labels, focus-visible styles, screen-reader text

## Project Structure

```
landing-page/
├── index.html              # All markup + i18n data attributes
├── styles/main.css         # Layout, animations, responsive design
├── scripts/main.js         # Nav, scroll-reveal, i18n toggle, smooth scroll
├── assets/
│   ├── logo.svg            # Brand logo
│   ├── favicon.svg         # Browser tab icon
│   └── og.png              # Social preview image
├── README.md               # Original docs
└── .git/
```

## How to Modify

**Change Copy/Text:**
- Edit directly in `index.html`
- For multi-language: update `I18N.en` and `I18N.th` dictionaries in `scripts/main.js`
- Use `data-i18n="key_name"` attributes for auto-translation via toggle

**Update Colors & Styling:**
- Modify CSS variables in `:root {}` at top of `styles/main.css`:
  - `--cream`, `--ink`, `--amber`, `--green`, `--foam`, `--bg`
  - `--radius`, `--shadow-1`, `--shadow-2`

**Add New Sections:**
1. Add `<section id="new-id">` with `.reveal` class in `index.html`
2. Style using existing patterns (`.grid-3`, `.card`, etc.) in `main.css`
3. Link in nav: `<a href="#new-id">Label</a>`
4. Add i18n keys: `data-i18n="my_key"` + translations in `main.js`

**Replace Assets:**
- `assets/logo.svg` — Brand logo
- `assets/favicon.svg` — Browser icon
- `assets/og.png` — Social preview image

## Deployment

**Cloudflare Pages:**
1. Push code to GitHub
2. Cloudflare Dashboard → Pages → Create Project
3. Connect to Git, select `main` branch
4. Build settings: Framework = None, Build command = (empty), Output = `/`
5. Live at `https://<project-name>.pages.dev`

**Wrangler CLI:**
```bash
npx wrangler pages deploy . --project-name soulbrews
```

No build step required — all files served as-is.
