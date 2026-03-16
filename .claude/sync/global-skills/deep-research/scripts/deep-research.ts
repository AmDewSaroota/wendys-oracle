#!/usr/bin/env npx tsx
/**
 * Deep Research Automation Script (dev-browser version)
 *
 * Uses dev-browser (Playwright) instead of MQTT for reliable browser control.
 * Requires dev-browser extension server running.
 *
 * Run from dev-browser directory:
 *   cd skills/dev-browser && npx tsx ../deep-research/scripts/deep-research.ts "<topic>"
 */

import { connect, waitForPageLoad } from "@/client.js";
import * as fs from "fs";
import * as path from "path";

const topic = process.argv.slice(2).join(" ");

if (!topic) {
  console.log("Usage: deep-research.ts <topic>");
  console.log('Example: deep-research.ts compare yeast S-33 vs T-58');
  process.exit(1);
}

async function main() {
  console.log(`\n🔬 Deep Research: ${topic}\n`);

  // Step 1: Connect to dev-browser
  console.log("1️⃣ Connecting to dev-browser...");
  const client = await connect();

  const info = await client.getServerInfo();
  if (info.mode === "extension" && !info.extensionConnected) {
    console.error("❌ Extension not connected. Please activate the dev-browser extension in Chrome.");
    process.exit(1);
  }
  console.log(`   ✓ Connected (${info.mode} mode)`);

  // Step 2: Open Gemini
  console.log("2️⃣ Opening Gemini...");
  const page = await client.page("gemini-research", {
    viewport: { width: 1280, height: 900 },
  });

  await page.goto("https://gemini.google.com/app");
  await waitForPageLoad(page, { timeout: 15000 });
  console.log("   ✓ Gemini loaded");

  // Step 3: Select Deep Research mode
  console.log("3️⃣ Selecting Deep Research mode...");
  await sleep(2000);

  const snapshot = await client.getAISnapshot("gemini-research");
  let deepResearchClicked = false;

  // Strategy 1: Click "Tools" button → menu → "Deep Research" menuitemcheckbox
  // ARIA snapshot shows: generic [ref=eXXX]: Tools
  let toolsClicked = false;
  for (const line of snapshot.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.endsWith(": Tools") && !trimmed.toLowerCase().includes("tap to use")) {
      const ref = line.match(/\[ref=(e\d+)\]/)?.[1];
      if (ref) {
        try {
          console.log("   → Found Tools button, clicking...");
          const el = await client.selectSnapshotRef("gemini-research", ref);
          if (el) { await el.click(); toolsClicked = true; }
        } catch (e: any) { console.log("   → Tools click error:", e.message); }
        break; // Only try the first Tools match
      }
    }
  }

  // After Tools menu opens, find and click "Deep Research"
  if (toolsClicked) {
    await sleep(2500); // Wait for menu animation
    const menuSnap = await client.getAISnapshot("gemini-research");

    for (const line of menuSnap.split("\n")) {
      if (line.toLowerCase().includes("deep research")) {
        const ref = line.match(/\[ref=(e\d+)\]/)?.[1];
        if (ref) {
          try {
            console.log("   → Found Deep Research in menu, clicking...");
            const el = await client.selectSnapshotRef("gemini-research", ref);
            if (el) { await el.click(); deepResearchClicked = true; break; }
          } catch (e: any) { console.log("   → Deep Research click error:", e.message); }
        }
      }
    }
  }

  // Strategy 2: Direct text match fallback
  if (!deepResearchClicked) {
    try {
      const btn = await page.$('text="Deep Research"');
      if (btn) { await btn.click(); deepResearchClicked = true; }
    } catch {}
  }

  console.log(deepResearchClicked
    ? "   ✓ Deep Research selected"
    : "   ⚠ Could not find Deep Research button - you may need to select it manually");

  await sleep(1500);

  // Step 4: Type research prompt
  console.log("4️⃣ Sending research prompt...");

  const snap3 = await client.getAISnapshot("gemini-research");
  let promptSent = false;

  // Find textbox in ARIA snapshot
  for (const line of snap3.split("\n")) {
    if ((line.includes("textbox") || line.includes("textarea")) && !line.includes("Search")) {
      const ref = line.match(/\[ref=(e\d+)\]/)?.[1];
      if (ref) {
        const el = await client.selectSnapshotRef("gemini-research", ref);
        if (el) {
          await el.click();
          await sleep(300);
          await page.keyboard.type(topic, { delay: 10 });
          promptSent = true;
          break;
        }
      }
    }
  }

  // Fallback: known Gemini selectors
  if (!promptSent) {
    try {
      const input = await page.$('[contenteditable="true"], .ql-editor, textarea, .text-input-field');
      if (input) {
        await input.click();
        await sleep(300);
        await page.keyboard.type(topic, { delay: 10 });
        promptSent = true;
      }
    } catch {}
  }

  if (!promptSent) {
    console.error("   ❌ Could not find input area");
    await client.disconnect();
    process.exit(1);
  }

  console.log("   ✓ Prompt typed");
  await sleep(500);
  await page.keyboard.press("Enter");
  console.log("   ✓ Prompt sent");

  // Step 5: Click "Start research"
  // Gemini needs time to generate the research plan before showing the button
  console.log("5️⃣ Waiting for research plan...");
  await sleep(5000);

  let started = false;
  for (let i = 0; i < 10 && !started; i++) {
    const snap4 = await client.getAISnapshot("gemini-research");

    // Look for "start research" button in ARIA snapshot
    for (const line of snap4.split("\n")) {
      if (line.toLowerCase().includes("start research")) {
        const ref = line.match(/\[ref=(e\d+)\]/)?.[1];
        if (ref) {
          try {
            console.log("   → Found 'Start research' button, clicking...");
            const el = await client.selectSnapshotRef("gemini-research", ref);
            if (el) { await el.click(); started = true; break; }
          } catch {}
        }
      }
    }
    if (started) break;

    // Check if research already started (look for progress indicators)
    const hasProgress = snap4.split("\n").some((l: string) =>
      l.toLowerCase().includes("searching") ||
      l.toLowerCase().includes("reading") ||
      l.toLowerCase().includes("analyzing") ||
      l.toLowerCase().includes("research complete")
    );
    if (hasProgress) {
      console.log("   → Research appears to have auto-started");
      started = true;
      break;
    }

    console.log(`   ... waiting for research plan (attempt ${i + 1}/10)`);
    await sleep(3000);
  }

  console.log(started
    ? "   ✓ Research started!"
    : '   ⚠ "Start research" button not found - Gemini may have started automatically');

  // Step 6: Wait for research to complete and extract results
  console.log("6️⃣ Waiting for research to complete (this may take 5-15 minutes)...");

  let resultText = "";
  const maxWaitMs = 20 * 60 * 1000; // 20 minutes max
  const pollIntervalMs = 15_000; // check every 15s
  const startTime = Date.now();
  let complete = false;

  while (Date.now() - startTime < maxWaitMs) {
    const snap = await client.getAISnapshot("gemini-research");
    const lines = snap.split("\n");

    // Check for completion indicators
    const hasExportBtn = lines.some((l: string) =>
      l.toLowerCase().includes("export to doc") ||
      l.toLowerCase().includes("share & export")
    );
    const hasComplete = lines.some((l: string) =>
      l.toLowerCase().includes("research complete") ||
      l.toLowerCase().includes("deep research is done")
    );
    // Check for the response content area (long text block after research finishes)
    const hasCopyResponse = lines.some((l: string) =>
      l.toLowerCase().includes("copy response") ||
      l.toLowerCase().includes("copy")
    );
    // Still working indicators
    const stillWorking = lines.some((l: string) =>
      l.toLowerCase().includes("searching") ||
      l.toLowerCase().includes("reading") ||
      l.toLowerCase().includes("analyzing") ||
      l.toLowerCase().includes("browsing") ||
      l.toLowerCase().includes("generating research plan")
    );

    const elapsed = Math.round((Date.now() - startTime) / 1000);

    if ((hasExportBtn || hasComplete) && !stillWorking) {
      console.log(`   ✓ Research complete! (${elapsed}s)`);
      complete = true;

      // Extract the result text from the page
      await sleep(2000);
      try {
        // Get full text from the response area
        const fullSnap = await client.getAISnapshot("gemini-research");
        // Parse the ARIA snapshot to extract text content (skip UI elements)
        const textLines: string[] = [];
        let inResponse = false;
        for (const line of fullSnap.split("\n")) {
          const t = line.trim();
          // Start capturing after the user's prompt
          if (t.includes("Copy prompt")) { inResponse = true; continue; }
          if (!inResponse) continue;
          // Stop at bottom toolbar
          if (t.includes("textbox") || t.includes("Upload") || t.includes("Open upload")) break;
          // Extract text content: lines like "- generic: Some text" or "- text: Some text"
          const textMatch = t.match(/^-?\s*(?:generic|text|paragraph|heading|listitem)(?:\s*\[.*?\])*:\s*(.+)/);
          if (textMatch) {
            textLines.push(textMatch[1]);
          } else if (t.startsWith("- StaticText:") || t.startsWith("StaticText:")) {
            textLines.push(t.replace(/^-?\s*StaticText:\s*/, ""));
          } else if (!t.startsWith("-") && !t.includes("[ref=") && t.length > 2 && !t.includes("button") && !t.includes("link")) {
            // Plain text lines
            textLines.push(t);
          }
        }
        resultText = textLines.join("\n");
      } catch (e: any) {
        console.log("   ⚠ Could not extract via ARIA, trying innerText...");
      }

      // Fallback: get innerText from the page
      if (!resultText || resultText.length < 100) {
        try {
          resultText = await page.evaluate(() => {
            // Find the response container (usually the last large text block)
            const containers = document.querySelectorAll('[class*="response"], [class*="message"], .model-response-text, article');
            if (containers.length > 0) {
              const last = containers[containers.length - 1] as HTMLElement;
              return last.innerText || last.textContent || "";
            }
            // Fallback: get main content area
            const main = document.querySelector('main') || document.querySelector('[role="main"]');
            return main?.innerText || document.body.innerText || "";
          }) as string;
        } catch {}
      }

      break;
    }

    if (stillWorking) {
      console.log(`   ... researching (${elapsed}s elapsed)`);
    } else if (hasCopyResponse && elapsed > 60) {
      // Has copy button but no explicit "complete" — might be done
      console.log(`   → Response detected, checking if complete...`);
      await sleep(5000);
      continue;
    } else {
      console.log(`   ... waiting (${elapsed}s elapsed)`);
    }

    await sleep(pollIntervalMs);
  }

  if (!complete) {
    console.log("   ⚠ Timed out waiting for research (20 min). Extracting current content...");
    try {
      resultText = await page.evaluate(() => {
        const main = document.querySelector('main') || document.querySelector('[role="main"]');
        return main?.innerText || document.body.innerText || "";
      }) as string;
    } catch {}
  }

  // Step 7: Save results to file
  if (resultText && resultText.length > 50) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const slug = topic.slice(0, 50).replace(/[^a-zA-Z0-9ก-๙]/g, "-").replace(/-+/g, "-");
    // dev-browser cwd is .claude/sync/global-skills/dev-browser — go up 4 levels to repo root
    const outDir = path.resolve(process.cwd(), "../../../../ψ/active");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `deep-research-${slug}-${timestamp}.md`);

    const content = `# Deep Research: ${topic}\n\n_Generated: ${new Date().toLocaleString()}_\n\n---\n\n${resultText}\n`;
    fs.writeFileSync(outFile, content, "utf-8");

    console.log(`\n📄 Results saved to: ${outFile}`);
    console.log(`   (${resultText.length} characters)\n`);

    // Also output to stdout for piping
    console.log("=== RESEARCH RESULT ===");
    console.log(resultText);
    console.log("=== END RESULT ===");
  } else {
    console.log("\n⚠ Could not extract research results. Please check the Gemini tab manually.\n");
  }

  await client.disconnect();
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  console.error("\nMake sure dev-browser extension server is running:");
  console.error("  cd skills/dev-browser && npm run start-extension");
  process.exit(1);
});
