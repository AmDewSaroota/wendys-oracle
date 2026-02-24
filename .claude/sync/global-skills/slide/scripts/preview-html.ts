#!/usr/bin/env npx tsx
/**
 * Generate HTML preview from JSON slide spec.
 *
 * Usage: npx tsx scripts/preview-html.ts <slides.json>
 *
 * Output: HTML file path
 */

import * as fs from "fs";
import * as path from "path";
import { themeToCSS } from "./themes.js";
import type { SlideDeck, SlideSpec, BulletItem } from "./types.js";

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Usage: npx tsx scripts/preview-html.ts <slides.json>");
  process.exit(1);
}

function bulletsHTML(bullets: BulletItem[]): string {
  return bullets
    .map((b) => {
      const icon = b.icon ? `<span class="icon">${b.icon}</span> ` : "";
      const subs = b.sub
        ? `<ul>${b.sub.map((s) => `<li>${s}</li>`).join("")}</ul>`
        : "";
      return `<li>${icon}${b.text}${subs}</li>`;
    })
    .join("\n");
}

function slideHTML(slide: SlideSpec, index: number): string {
  const cls = `slide slide-${slide.layout}`;

  switch (slide.layout) {
    case "title":
      return `<div class="${cls}" data-index="${index}">
        <div class="title-content">
          ${slide.icon ? `<div class="big-icon">${slide.icon}</div>` : ""}
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="subtitle">${slide.subtitle}</p>` : ""}
        </div>
      </div>`;

    case "content":
      return `<div class="${cls}" data-index="${index}">
        <div class="slide-header">${slide.icon ? `${slide.icon} ` : ""}${slide.title}</div>
        <div class="slide-body">
          <ul>${bulletsHTML(slide.bullets)}</ul>
        </div>
      </div>`;

    case "two-column":
      return `<div class="${cls}" data-index="${index}">
        <div class="slide-header">${slide.title}</div>
        <div class="columns">
          <div class="col">
            ${slide.left.heading ? `<h3>${slide.left.icon ? `${slide.left.icon} ` : ""}${slide.left.heading}</h3>` : ""}
            <ul>${bulletsHTML(slide.left.bullets)}</ul>
          </div>
          <div class="col">
            ${slide.right.heading ? `<h3>${slide.right.icon ? `${slide.right.icon} ` : ""}${slide.right.heading}</h3>` : ""}
            <ul>${bulletsHTML(slide.right.bullets)}</ul>
          </div>
        </div>
      </div>`;

    case "image-text":
      return `<div class="${cls}" data-index="${index}">
        <div class="slide-header">${slide.title}</div>
        <div class="image-text-content ${slide.imagePosition}">
          <div class="image-side"><img src="${slide.imageUrl}" alt=""></div>
          <div class="text-side">
            <p>${slide.text}</p>
            ${slide.bullets ? `<ul>${bulletsHTML(slide.bullets)}</ul>` : ""}
          </div>
        </div>
      </div>`;

    case "blank":
      return `<div class="${cls}" data-index="${index}">
        ${slide.content ? `<div class="blank-content"><h1>${slide.content}</h1></div>` : ""}
      </div>`;
  }
}

function generateHTML(deck: SlideDeck): string {
  const c = themeToCSS(deck.theme);
  const font = deck.font || "Prompt";
  const slidesHTML = deck.slides.map((s, i) => slideHTML(s, i)).join("\n\n");

  return `<!DOCTYPE html>
<html lang="${deck.language === "th" ? "th" : deck.language === "en" ? "en" : "th"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=960">
<title>${deck.title}</title>
<link href="https://fonts.googleapis.com/css2?family=${font}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: '${font}', sans-serif; background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.container { position: relative; width: 960px; height: 540px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border-radius: 8px; }
.slide { position: absolute; top: 0; left: 0; width: 960px; height: 540px; background: ${c.background}; color: ${c.text}; display: none; flex-direction: column; padding: 0; border-bottom: 6px solid ${c.accent}; }
.slide.active { display: flex; }

/* Title layout */
.slide-title { justify-content: center; align-items: center; text-align: center; }
.slide-title .title-content { padding: 40px 80px; }
.slide-title h1 { font-size: 42px; font-weight: 700; color: ${c.primary}; margin-bottom: 16px; }
.slide-title .subtitle { font-size: 20px; color: ${c.muted}; }
.slide-title .big-icon { font-size: 48px; margin-bottom: 16px; }

/* Content layout */
.slide-header { background: ${c.primary}; color: #fff; padding: 16px 40px; font-size: 24px; font-weight: 600; }
.slide-body { padding: 24px 40px; flex: 1; overflow: auto; }
.slide-body ul { list-style: none; padding-left: 0; }
.slide-body li { padding: 6px 0; font-size: 16px; line-height: 1.5; }
.slide-body li .icon { margin-right: 8px; }
.slide-body li ul { padding-left: 28px; margin-top: 4px; }
.slide-body li ul li { font-size: 14px; color: ${c.muted}; }

/* Two-column */
.columns { display: flex; gap: 20px; padding: 24px 40px; flex: 1; }
.col { flex: 1; }
.col h3 { font-size: 18px; color: ${c.secondary}; margin-bottom: 12px; font-weight: 600; }
.col ul { list-style: none; padding-left: 0; }
.col li { padding: 4px 0; font-size: 14px; line-height: 1.4; }

/* Image-text */
.image-text-content { display: flex; gap: 20px; padding: 20px 40px; flex: 1; }
.image-text-content.left { flex-direction: row; }
.image-text-content.right { flex-direction: row-reverse; }
.image-side { flex: 1; display: flex; align-items: center; justify-content: center; }
.image-side img { max-width: 100%; max-height: 380px; border-radius: 8px; object-fit: cover; }
.text-side { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.text-side p { font-size: 15px; line-height: 1.6; margin-bottom: 12px; }

/* Blank */
.slide-blank { justify-content: center; align-items: center; text-align: center; }
.blank-content h1 { font-size: 36px; color: ${c.primary}; font-weight: 700; }

/* Navigation */
.nav { position: absolute; bottom: 12px; right: 16px; display: flex; gap: 8px; z-index: 10; }
.nav button { background: ${c.primary}; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-family: '${font}'; font-size: 13px; }
.nav button:hover { opacity: 0.85; }
.progress { position: absolute; bottom: 0; left: 0; height: 3px; background: ${c.accent}; transition: width 0.3s; z-index: 10; }
.counter { position: absolute; bottom: 14px; left: 16px; color: ${c.muted}; font-size: 13px; z-index: 10; }
</style>
</head>
<body>
<div class="container">
${slidesHTML}
<div class="nav">
  <button onclick="go(-1)">&larr; Prev</button>
  <button onclick="go(1)">Next &rarr;</button>
</div>
<div class="progress" id="progress"></div>
<div class="counter" id="counter"></div>
</div>
<script>
let current = 0;
const slides = document.querySelectorAll('.slide');
const total = slides.length;

function show(i) {
  slides.forEach(s => s.classList.remove('active'));
  current = Math.max(0, Math.min(i, total - 1));
  slides[current].classList.add('active');
  document.getElementById('progress').style.width = ((current + 1) / total * 100) + '%';
  document.getElementById('counter').textContent = (current + 1) + ' / ' + total;
}

function go(dir) { show(current + dir); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') go(1);
  if (e.key === 'ArrowLeft') go(-1);
});

show(0);
</script>
</body>
</html>`;
}

// Main
const raw = fs.readFileSync(jsonPath, "utf-8");
const deck: SlideDeck = JSON.parse(raw);

const html = generateHTML(deck);
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.dirname(jsonPath);
const outFile = path.join(outDir, `preview-${timestamp}.html`);

fs.writeFileSync(outFile, html, "utf-8");
console.log(`HTML preview: ${outFile}`);
console.log(`Slides: ${deck.slides.length}`);
