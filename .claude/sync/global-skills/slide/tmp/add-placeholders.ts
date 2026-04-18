#!/usr/bin/env npx tsx
/**
 * Add visual image placeholders to existing Google Slides presentation.
 * Creates colored rectangles with labels showing where to insert images.
 */

import { google } from "googleapis";
import { getAuthClient } from "../scripts/auth.js";

const PRESENTATION_ID = "1TlifYkZf2Fim5f35ZYt62bVkFACMAFyLE0IDMZeJcjA";

function pt(w: number, h: number) {
  return { width: { magnitude: w, unit: "PT" }, height: { magnitude: h, unit: "PT" } };
}

function tf(x: number, y: number) {
  return { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: "PT" };
}

function placeholderBox(
  id: string,
  pageId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  desc: string
) {
  return [
    // Rectangle shape
    {
      createShape: {
        objectId: id,
        shapeType: "ROUND_RECTANGLE",
        elementProperties: {
          pageObjectId: pageId,
          size: pt(w, h),
          transform: tf(x, y),
        },
      },
    },
    // Style: dark fill with dashed border
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: { rgbColor: { red: 0.086, green: 0.129, blue: 0.243 } }, // #16213e
              alpha: 0.8,
            },
          },
          outline: {
            outlineFill: {
              solidFill: {
                color: { rgbColor: { red: 0, green: 0.831, blue: 1 } }, // #00d4ff
                alpha: 0.4,
              },
            },
            weight: { magnitude: 1.5, unit: "PT" },
            dashStyle: "DASH",
          },
        },
        fields: "shapeBackgroundFill,outline",
      },
    },
    // Add label text
    {
      insertText: {
        objectId: id,
        insertionIndex: 0,
        text: `${label}\n${desc}`,
      },
    },
    // Style text
    {
      updateTextStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: {
          fontFamily: "Prompt",
          fontSize: { magnitude: 10, unit: "PT" },
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0, green: 0.831, blue: 1 } }, // #00d4ff
          },
        },
        fields: "fontFamily,fontSize,foregroundColor",
      },
    },
    // Center text
    {
      updateParagraphStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    },
    // Vertical center
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          contentAlignment: "MIDDLE",
        },
        fields: "contentAlignment",
      },
    },
  ];
}

// Define all placeholders: [slideIndex, x, y, w, h, emoji+label, description]
const placeholders: [number, number, number, number, number, string, string][] = [
  // Slide 1 (Cover) - NDF Logo
  [0, 260, 280, 200, 60, "🏢 NDF Logo", "Insert company logo"],

  // Slide 2 (Meet the Team) - 3 team photos
  [1, 40, 120, 190, 130, "📸 DewS Photo", "Photo or avatar"],
  [1, 265, 120, 190, 130, "📸 Junior A Photo", "Photo or avatar"],
  [1, 490, 120, 190, 130, "📸 Junior B Photo", "Photo or avatar"],

  // Slide 3 (What We Build) - 4 project screenshots
  [2, 40, 200, 150, 100, "🥽 VR Project", "e.g. JobVR Barista"],
  [2, 200, 200, 150, 100, "📱 AR Project", "e.g. AR experience"],
  [2, 360, 200, 150, 100, "🎮 Game", "e.g. Flora Park"],
  [2, 520, 200, 150, 100, "🌐 Web/App", "e.g. 3D on web"],

  // Slide 5 (Pipeline Relay) - 3 pipeline stages
  [4, 40, 120, 200, 120, "🧊 Wireframe Mesh", "Your clean model"],
  [4, 260, 120, 200, 120, "🎨 Textured Model", "After 2D artist"],
  [4, 480, 120, 200, 120, "🦴 Rigged/Animated", "After animator"],

  // Slide 6 (Handoff) - Outliner screenshot
  [5, 390, 120, 280, 250, "🗂️ Maya Outliner", "Clean naming vs messy naming\nside by side"],

  // Slide 7 (Naming) - Bad vs Good examples
  [6, 40, 200, 310, 150, "😱 Bad Naming Screenshot", "Real outliner with messy names"],
  [6, 370, 200, 310, 150, "✨ Good Naming Screenshot", "Real outliner with clean names"],

  // Slide 9 (Client Chaos) - Meme
  [8, 400, 120, 270, 230, "😅 Meme / Funny Visual", "Client revision meme\nor before/after model"],

  // Slide 10 (AI Good) - AI concept art
  [9, 390, 120, 280, 230, "🎨 AI Concept Art", "Midjourney/SD output\nused as reference"],

  // Slide 11 (AI Pretty Lie) - 4 comparison images
  [10, 40, 120, 160, 120, "🤖 AI Render", "Looks amazing!"],
  [10, 40, 250, 160, 120, "💀 AI Wireframe", "Topology disaster"],
  [10, 380, 120, 160, 120, "🧑‍🎨 Hand Render", "Maybe less flashy"],
  [10, 380, 250, 160, 120, "✨ Hand Wireframe", "Clean topology!"],

  // Slide 12 (Junior A Project) - 4 process images
  [11, 40, 120, 310, 120, "📸 Reference / Concept", "What they started with"],
  [11, 370, 120, 310, 120, "📦 Blockout / Early Stage", "The ugly beginning"],
  [11, 40, 260, 310, 120, "🧊 Wireframe View", "Show the topology"],
  [11, 370, 260, 310, 120, "✨ Final Shaded Model", "The finished mesh"],

  // Slide 14 (Junior B Project) - 4 process images
  [13, 40, 120, 310, 120, "📸 Reference / Concept", "What they started with"],
  [13, 370, 120, 310, 120, "📦 Blockout / Early Stage", "The ugly beginning"],
  [13, 40, 260, 310, 120, "🧊 Wireframe View", "Show the topology"],
  [13, 370, 260, 310, 120, "✨ Final Shaded Model", "The finished mesh"],

  // Slide 16 (Mistakes) - Funny fail
  [15, 400, 120, 270, 230, "😂 Funny Fail", "Wrong scale, broken normals,\nmessy outliner, etc."],

  // Slide 18 (Q&A) - Team photo
  [17, 400, 120, 270, 230, "📸 Team Photo", "Casual team photo or\nbehind-the-scenes shot"],

  // Slide 19 (Thank You) - NDF Logo
  [18, 260, 230, 200, 60, "🏢 NDF Logo", "Insert company logo"],
];

async function main() {
  const auth = await getAuthClient();
  const slides = google.slides({ version: "v1", auth });

  // Get slide object IDs
  const pres = await slides.presentations.get({ presentationId: PRESENTATION_ID });
  const slideIds = pres.data.slides!.map((s) => s.objectId!);

  console.log(`Adding ${placeholders.length} image placeholders to ${slideIds.length} slides...`);

  const requests: any[] = [];

  for (let i = 0; i < placeholders.length; i++) {
    const [slideIdx, x, y, w, h, label, desc] = placeholders[i];
    const pageId = slideIds[slideIdx];
    const boxId = `ph_${slideIdx}_${i}`;

    requests.push(...placeholderBox(boxId, pageId, x, y, w, h, label, desc));
  }

  // Batch update
  await slides.presentations.batchUpdate({
    presentationId: PRESENTATION_ID,
    requestBody: { requests },
  });

  console.log(`Done! ${placeholders.length} placeholders added.`);
  console.log(`URL: https://docs.google.com/presentation/d/${PRESENTATION_ID}/edit`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  if (err.errors) for (const e of err.errors) console.error("  -", e.message);
  process.exit(1);
});
