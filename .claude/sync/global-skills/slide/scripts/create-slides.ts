#!/usr/bin/env npx tsx
/**
 * Create Google Slides presentation from JSON spec.
 *
 * Usage: npx tsx scripts/create-slides.ts <path-to-slides.json>
 *
 * Output: JSON with { presentationId, url, title, slideCount }
 */

import { google } from "googleapis";
import * as fs from "fs";
import { getAuthClient } from "./auth.js";
import { resolveTheme } from "./themes.js";
import { generateSlideRequests } from "./layouts.js";
import type { SlideDeck } from "./types.js";

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Usage: npx tsx scripts/create-slides.ts <slides.json>");
  process.exit(1);
}

async function main() {
  // 1. Read slide spec
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const deck: SlideDeck = JSON.parse(raw);
  const font = deck.font || "Prompt";
  const theme = resolveTheme(deck.theme);

  console.log(`Creating presentation: "${deck.title}" (${deck.slides.length} slides)`);

  // 2. Authenticate
  const auth = await getAuthClient();
  const slides = google.slides({ version: "v1", auth });

  // 3. Create empty presentation
  const createRes = await slides.presentations.create({
    requestBody: { title: deck.title },
  });

  const presentationId = createRes.data.presentationId!;
  const defaultSlideId = createRes.data.slides?.[0]?.objectId;

  console.log(`  Presentation created: ${presentationId}`);

  // 4. Build all slide requests
  const allRequests: any[] = [];

  for (let i = 0; i < deck.slides.length; i++) {
    const slideRequests = generateSlideRequests(deck.slides[i], i, theme, font);
    allRequests.push(...slideRequests);
  }

  // Delete the default blank slide (created with the presentation)
  if (defaultSlideId) {
    allRequests.push({ deleteObject: { objectId: defaultSlideId } });
  }

  // 5. Execute batch update
  if (allRequests.length > 0) {
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: allRequests },
    });
    console.log(`  Applied ${allRequests.length} requests`);
  }

  // 6. Output result
  const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  const result = {
    presentationId,
    url,
    title: deck.title,
    slideCount: deck.slides.length,
  };

  console.log(`\n  URL: ${url}`);
  console.log(`  Slides: ${deck.slides.length}\n`);

  // Output JSON for script consumption
  console.log("=== RESULT ===");
  console.log(JSON.stringify(result));
  console.log("=== END ===");
}

main().catch((err) => {
  console.error("\nError creating slides:", err.message);
  if (err.errors) {
    for (const e of err.errors) console.error("  -", e.message);
  }
  process.exit(1);
});
