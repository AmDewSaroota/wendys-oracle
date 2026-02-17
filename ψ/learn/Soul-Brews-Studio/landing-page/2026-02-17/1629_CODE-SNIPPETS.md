# Soul Brews Landing Page — Code Snippets

## 1. Main Entry Point

**File**: `scripts/main.js`

The entire app is a single IIFE — no build tools, no frameworks:

```javascript
(function () {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  // ... all logic here
})();
```

Two utility helpers (`qs`, `qsa`) reduce `document.querySelector` boilerplate everywhere.

## 2. Mobile Navigation Toggle

**File**: `scripts/main.js:7-27`

```javascript
const toggle = qs('.nav-toggle');
const nav = qs('#site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close on link click (mobile)
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
```

Pattern: Event delegation on the nav — one listener handles all link clicks. ARIA-expanded is kept in sync.

## 3. Scroll Reveal with IntersectionObserver

**File**: `scripts/main.js:44-52`

```javascript
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);  // Fire once, then stop watching
    }
  });
}, { threshold: 0.12 });
qsa('.reveal').forEach((el) => io.observe(el));
```

**CSS counterpart** (`styles/main.css:141-142`):
```css
.reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
```

Pattern: Elements start invisible + shifted down. When 12% visible, they fade in + slide up. Observer is unsubscribed after triggering (fire-once).

## 4. Lightweight i18n System (EN/TH)

**File**: `scripts/main.js:61-171`

```javascript
const I18N = {
  meta: { en: { title: '...', description: '...' }, th: { ... } },
  en: { nav_join: 'Join', hero_title: 'Code, build AI, and brew together', ... },
  th: { nav_join: 'เข้าร่วม', hero_title: 'โค้ด สร้าง AI และชงเบียร์ไปด้วยกัน', ... }
};

function setLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang === 'th' ? 'th' : 'en';
  // Update meta tags
  const meta = I18N.meta[lang] || I18N.meta.en;
  document.title = meta.title;
  // Update all data-i18n elements
  qsa('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (typeof value === 'string') el.textContent = value;
  });
  // Toggle button shows OTHER language
  const btn = qs('.lang-toggle');
  if (btn) btn.textContent = lang === 'th' ? 'EN' : 'TH';
  localStorage.setItem('lang', lang);
}
```

**HTML usage**:
```html
<h1 data-i18n="hero_title">Code, build AI, and brew together</h1>
```

Pattern: No library needed — `data-i18n` attributes map to dictionary keys. English is the HTML default (works without JS). Language preference persists via `localStorage`.

## 5. CSS Design Token System

**File**: `styles/main.css:2-18`

```css
:root {
  --cream: #fefae0;
  --ink: #181818;
  --stone: #3b3b3b;
  --amber: #dda15e;
  --amber-700: #bc6c25;
  --green: #3a5a40;
  --foam: #ffffff;
  --bg: #0f0e0a;
  --header-h: 64px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --radius: 14px;
  --radius-sm: 10px;
  --shadow-1: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-2: 0 20px 40px rgba(0, 0, 0, 0.18);
}
```

Color palette: warm cream background, amber accents, green for nature theme, ink for text. All spacing and shadows are tokens.

## 6. Glassmorphism Sticky Header

**File**: `styles/main.css:47-52`

```css
.site-header {
  position: sticky; top: 0; z-index: 40;
  background: linear-gradient(180deg, rgba(254,250,224,0.95), rgba(254,250,224,0.8));
  backdrop-filter: saturate(1.1) blur(8px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
```

Pattern: Semi-transparent gradient + `backdrop-filter` blur = glassmorphism effect. Content bleeds through the header subtly.

## 7. Hero Section Radial Gradients

**File**: `styles/main.css:70-76`

```css
.section-hero {
  background: radial-gradient(1200px 600px at 110% -10%, rgba(61, 94, 64, 0.18), transparent 60%),
              radial-gradient(800px 400px at -10% 0%, rgba(221, 161, 94, 0.26), transparent 60%),
              var(--cream);
  padding: 6rem 0 4rem;
}
```

Two layered radial gradients create a subtle green (top-right) and amber (top-left) glow. No images needed.

## 8. Responsive Mobile Nav Animation

**File**: `styles/main.css:165-166`

```css
.site-nav {
  position: absolute; top: 64px; right: 0;
  transform-origin: top right;
  transform: scale(.98); opacity: 0;
  pointer-events: none;
  transition: transform .16s ease, opacity .16s ease;
}
.site-nav.open { opacity: 1; transform: none; pointer-events: auto; }
```

Pattern: Nav panel scales + fades from top-right corner. `pointer-events: none` prevents ghost clicks when closed.

## 9. Button Component System

**File**: `styles/main.css:134-138`

```css
.btn {
  --bg: var(--ink); --fg: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  padding: .7rem .9rem; border-radius: 12px;
  font-weight: 600; cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-1); }
.btn-amber { --bg: var(--amber); --fg: #1b1205; }
.btn-outline { background: transparent; color: var(--ink); border: 1px solid rgba(0,0,0,.2); }
```

Pattern: CSS custom property variants — override `--bg` and `--fg` for different button styles. Subtle lift on hover.

## 10. Accessible Skip Link

**File**: `index.html:35` + `styles/main.css:41-42`

```html
<a class="skip-link" href="#main">Skip to content</a>
```
```css
.skip-link { position: absolute; left: -9999px; top: auto; }
.skip-link:focus { left: 1rem; top: 1rem; background: var(--foam); padding: .5rem .75rem; border-radius: 8px; }
```

Hidden off-screen but appears on Tab focus — accessibility best practice.
