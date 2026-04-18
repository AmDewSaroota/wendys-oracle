#!/usr/bin/env npx tsx
/**
 * Custom Google Slides builder for "Inside the 3D Pipeline"
 * Matches the HTML mockup layout precisely.
 */

import { google, slides_v1 } from "googleapis";
import { getAuthClient } from "../scripts/auth.js";

// ── Theme Colors ──
const C = {
  bg:      { red: 0.102, green: 0.102, blue: 0.180 },  // #1a1a2e
  bgCard:  { red: 0.086, green: 0.129, blue: 0.243 },  // #16213e
  primary: { red: 0,     green: 0.831, blue: 1     },  // #00d4ff
  orange:  { red: 0.902, green: 0.494, blue: 0.133 },  // #e67e22
  green:   { red: 0.153, green: 0.682, blue: 0.376 },  // #27ae60
  red:     { red: 0.906, green: 0.298, blue: 0.235 },  // #e74c3c
  white:   { red: 1,     green: 1,     blue: 1     },
  text:    { red: 0.941, green: 0.941, blue: 0.941 },  // #f0f0f0
  muted:   { red: 0.533, green: 0.533, blue: 0.600 },  // #888899
  phBg:    { red: 0.086, green: 0.129, blue: 0.243 },  // #16213e
  phBorder:{ red: 0,     green: 0.831, blue: 1     },  // #00d4ff
};

const FONT = "Prompt";
type RGB = { red: number; green: number; blue: number };

// ── Helpers ──
function sz(w: number, h: number) {
  return { width: { magnitude: w, unit: "PT" as const }, height: { magnitude: h, unit: "PT" as const } };
}
function tf(x: number, y: number, sx = 1, sy = 1) {
  return { scaleX: sx, scaleY: sy, translateX: x, translateY: y, unit: "PT" as const };
}
function rgb(c: RGB) { return { rgbColor: c }; }

let _uid = 0;
function uid(prefix: string) { return `${prefix}_${String(_uid++).padStart(4, '0')}`; }

// Create shape
function rect(pageId: string, x: number, y: number, w: number, h: number, fill: RGB, opts?: { outline?: any; radius?: boolean }) {
  const id = uid("rect");
  const r: any[] = [
    {
      createShape: {
        objectId: id,
        shapeType: opts?.radius ? "ROUND_RECTANGLE" : "RECTANGLE",
        elementProperties: { pageObjectId: pageId, size: sz(w, h), transform: tf(x, y) },
      },
    },
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: rgb(fill) } },
          outline: opts?.outline || { propertyState: "NOT_RENDERED" },
        },
        fields: "shapeBackgroundFill,outline",
      },
    },
  ];
  return { id, requests: r };
}

// Create text box with content
function text(pageId: string, x: number, y: number, w: number, h: number, content: string, fontSize: number, color: RGB, opts?: { bold?: boolean; center?: boolean; middle?: boolean }) {
  const id = uid("txt");
  const r: any[] = [
    {
      createShape: {
        objectId: id,
        shapeType: "TEXT_BOX",
        elementProperties: { pageObjectId: pageId, size: sz(w, h), transform: tf(x, y) },
      },
    },
    { insertText: { objectId: id, insertionIndex: 0, text: content } },
    {
      updateTextStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: {
          fontFamily: FONT,
          fontSize: { magnitude: fontSize, unit: "PT" },
          bold: opts?.bold || false,
          foregroundColor: { opaqueColor: rgb(color) },
        },
        fields: "fontFamily,fontSize,bold,foregroundColor",
      },
    },
  ];
  if (opts?.center) {
    r.push({
      updateParagraphStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    });
  }
  if (opts?.middle) {
    r.push({
      updateShapeProperties: {
        objectId: id,
        shapeProperties: { contentAlignment: "MIDDLE" },
        fields: "contentAlignment",
      },
    });
  }
  return { id, requests: r };
}

// Highlight box (orange left border)
function highlightBox(pageId: string, x: number, y: number, w: number, h: number, content: string, fontSize = 11) {
  const r: any[] = [];
  // Orange left bar
  const bar = rect(pageId, x, y, 4, h, C.orange);
  r.push(...bar.requests);
  // Background
  const bg = rect(pageId, x + 4, y, w - 4, h, C.bgCard, { radius: false });
  r.push(...bg.requests);
  // Text
  const t = text(pageId, x + 14, y + 4, w - 24, h - 8, content, fontSize, C.text, { middle: true });
  r.push(...t.requests);
  return r;
}

// Image placeholder box
function placeholder(pageId: string, x: number, y: number, w: number, h: number, label: string, desc: string) {
  const id = uid("ph");
  const r: any[] = [
    {
      createShape: {
        objectId: id,
        shapeType: "ROUND_RECTANGLE",
        elementProperties: { pageObjectId: pageId, size: sz(w, h), transform: tf(x, y) },
      },
    },
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: rgb(C.phBg), alpha: 0.8 } },
          outline: {
            outlineFill: { solidFill: { color: rgb(C.phBorder), alpha: 0.35 } },
            weight: { magnitude: 1.5, unit: "PT" },
            dashStyle: "DASH",
          },
          contentAlignment: "MIDDLE",
        },
        fields: "shapeBackgroundFill,outline,contentAlignment",
      },
    },
    { insertText: { objectId: id, insertionIndex: 0, text: `${label}\n${desc}` } },
    {
      updateTextStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: {
          fontFamily: FONT,
          fontSize: { magnitude: 9, unit: "PT" },
          foregroundColor: { opaqueColor: { rgbColor: { red: 0, green: 0.831, blue: 1 } } },
        },
        fields: "fontFamily,fontSize,foregroundColor",
      },
    },
    {
      updateParagraphStyle: {
        objectId: id,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    },
  ];
  return r;
}

// Card (dark bg rounded rect with content)
function card(pageId: string, x: number, y: number, w: number, h: number) {
  return rect(pageId, x, y, w, h, C.bgCard, { radius: true }).requests;
}

// Title bar at top
function titleBar(pageId: string, titleText: string) {
  const r: any[] = [];
  const bg = rect(pageId, 0, 0, 720, 55, C.primary);
  r.push(...bg.requests);
  const t = text(pageId, 25, 10, 670, 35, titleText, 20, C.white, { bold: true });
  r.push(...t.requests);
  return r;
}

// Accent bar at bottom
function accentBar(pageId: string) {
  return rect(pageId, 0, 399, 720, 6, C.primary).requests;
}

// Slide background
function slideBg(pageId: string) {
  return rect(pageId, 0, 0, 720, 405, C.bg).requests;
}

// ── Slide Builders ──

function slide1_cover(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...accentBar(pageId));
  // Icon
  r.push(...text(pageId, 260, 50, 200, 50, "🎮", 40, C.white, { center: true }).requests);
  // Title
  r.push(...text(pageId, 60, 110, 600, 60, "Inside the 3D Pipeline", 36, C.primary, { bold: true, center: true }).requests);
  // Decorative line
  r.push(...rect(pageId, 300, 175, 120, 3, C.primary).requests);
  // Subtitle
  r.push(...text(pageId, 80, 190, 560, 40, "How We Build Worlds for VR, AR & Beyond", 18, C.muted, { center: true }).requests);
  // Logo placeholder
  r.push(...placeholder(pageId, 260, 255, 200, 50, "🏢 NDF Logo", "Insert company logo"));
  // Company name
  r.push(...text(pageId, 80, 320, 560, 30, "NDF — Game · VR · AR · Metaverse Studio", 14, C.muted, { center: true }).requests);
  return r;
}

function slide2_team(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "👥  Meet the Team 👋"));
  r.push(...accentBar(pageId));
  // 3 cards with photo placeholders
  const names = [
    ["DewS", "Lead 3D Modeler\nCustom & Hero Assets"],
    ["[Name A]", "3D Modeler\n[Specialty]"],
    ["[Name B]", "3D Modeler\n[Specialty]"],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 30 + i * 228;
    r.push(...card(pageId, x, 70, 210, 310));
    r.push(...placeholder(pageId, x + 15, 85, 180, 120, "📸", "Photo / avatar"));
    r.push(...text(pageId, x + 15, 215, 180, 25, names[i][0], 16, C.primary, { bold: true, center: true }).requests);
    r.push(...text(pageId, x + 15, 245, 180, 50, names[i][1], 11, C.muted, { center: true }).requests);
  }
  return r;
}

function slide3_whatWeBuild(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🏢  What We Build at NDF"));
  r.push(...accentBar(pageId));
  // 4 project cards
  const projects = [
    ["🥽", "VR Training", "e.g. JobVR Barista"],
    ["📱", "AR Experiences", "e.g. AR experience"],
    ["🎮", "Games", "e.g. Flora Park"],
    ["🌐", "Web & App", "e.g. 3D on web"],
  ];
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 30 + col * 340;
    const y = 70 + row * 145;
    r.push(...card(pageId, x, y, 320, 135));
    r.push(...placeholder(pageId, x + 10, y + 10, 130, 80, projects[i][0], projects[i][2]));
    r.push(...text(pageId, x + 150, y + 25, 155, 60, `${projects[i][1]}`, 14, C.text, { bold: true }).requests);
  }
  // Highlight box at bottom
  r.push(...highlightBox(pageId, 30, 360, 660, 35, "🎯 We specialize in low-poly, real-time 3D — games, VR, AR. Not film CGI. Not 3D printing. Every polygon has to earn its place.", 10));
  return r;
}

function slide4_coreMessage(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...accentBar(pageId));
  // Icon
  r.push(...text(pageId, 260, 40, 200, 50, "💡", 40, C.white, { center: true }).requests);
  // Subtitle
  r.push(...text(pageId, 60, 100, 600, 30, "Today we're not going to teach you how to model.", 16, C.muted, { center: true }).requests);
  // Main message
  r.push(...text(pageId, 60, 140, 600, 60, "We're going to teach you\nhow to survive in the real world.", 28, C.primary, { bold: true, center: true }).requests);
  // Highlight
  r.push(...highlightBox(pageId, 110, 230, 500, 80, "Learning to model — that's one thing.\nBut the skills that really make your career?\nCommunication, teamwork, and knowing how to deliver.", 14));
  return r;
}

function slide5_pipeline(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🔄  The Real Pipeline — It's a Relay"));
  r.push(...accentBar(pageId));
  // 3 pipeline cards
  const stages = [
    ["🧊", "Modeler (Us)", "Build the mesh\nClean topology, naming", "Wireframe Screenshot", "Your clean mesh"],
    ["🎨", "2D Artist", "Add textures & materials\nDepends on our clean UV", "Textured Screenshot", "After 2D artist paints"],
    ["🦴", "Animator", "Rig & animate\nDepends on our topology", "Rigged/Animated", "After animator rigs"],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 20 + i * 232;
    r.push(...card(pageId, x, 65, 220, 200));
    r.push(...placeholder(pageId, x + 15, 75, 190, 90, stages[i][0] + " " + stages[i][4], stages[i][3]));
    r.push(...text(pageId, x + 15, 175, 190, 22, stages[i][1], 14, C.orange, { bold: true, center: true }).requests);
    r.push(...text(pageId, x + 15, 200, 190, 40, stages[i][2], 9, C.muted, { center: true }).requests);
  }
  // Arrows between cards
  r.push(...text(pageId, 230, 130, 30, 30, "→", 22, C.primary, { center: true }).requests);
  r.push(...text(pageId, 462, 130, 30, 30, "→", 22, C.primary, { center: true }).requests);
  // Highlight box
  r.push(...highlightBox(pageId, 20, 275, 680, 55, "⚡ If your mesh is messy → the texture artist struggles.\n⚡ If your pivot is wrong → the animator has to fix YOUR mistake.\n⚡ Your job isn't done when it looks good. It's done when the next person can use it.", 9));
  // Bottom callout
  r.push(...highlightBox(pageId, 20, 340, 680, 25, "\"Your model isn't for you — it's for the next person.\"", 10));
  return r;
}

function slide6_handoff(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🤝  Your Model Isn't For You"));
  r.push(...accentBar(pageId));
  // Left: checklist
  const checks = [
    "✅ Clean mesh — no stray verts, no overlapping faces",
    "✅ Correct pivot — a door rotates from the side, not the middle",
    "✅ Face direction — all normals facing outward",
    "✅ Proper naming — Project_Asset_v03_date",
    "✅ Talk to the next person — \"How do you want this?\"",
  ];
  r.push(...text(pageId, 30, 65, 340, 20, "The handoff checklist:", 12, C.muted).requests);
  r.push(...text(pageId, 30, 88, 340, 200, checks.join("\n"), 11, C.text).requests);
  // Right: placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 220, "🗂️ Maya Outliner Screenshot", "Clean naming vs messy naming\nside by side comparison"));
  // Bottom highlight
  r.push(...highlightBox(pageId, 30, 310, 660, 35, "The job is done when the next person can use it without asking you a single question.", 11));
  return r;
}

function slide7_naming(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "📁  Name It Like a Pro"));
  r.push(...accentBar(pageId));
  // Left card: bad naming
  r.push(...card(pageId, 30, 70, 320, 250));
  r.push(...text(pageId, 45, 80, 290, 25, "❌ What we've all done:", 14, C.red, { bold: true }).requests);
  r.push(...placeholder(pageId, 45, 110, 290, 130, "😱 Bad Naming Example", "model_final.fbx\nmodel_final_v2.fbx\nmodel_FINAL_REAL.fbx\nmodel_FINAL_REAL_fixed.fbx"));
  // Right card: good naming
  r.push(...card(pageId, 370, 70, 320, 250));
  r.push(...text(pageId, 385, 80, 290, 25, "✅ What you should do:", 14, C.green, { bold: true }).requests);
  r.push(...placeholder(pageId, 385, 110, 290, 130, "✨ Good Naming Example", "JobVR_EspressoMachine_v01_20260401.fbx\nJobVR_EspressoMachine_v02_20260405.fbx\nJobVR_EspressoMachine_v03_20260410.fbx"));
  // Tip
  r.push(...highlightBox(pageId, 30, 340, 660, 30, "💡 Your file name should tell someone WHAT it is, WHICH version, and WHEN — without opening it.", 10));
  return r;
}

function slide8_communication(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "💬  Communication is Your Superpower"));
  r.push(...accentBar(pageId));
  // Left card: Leader
  r.push(...card(pageId, 30, 70, 320, 210));
  r.push(...text(pageId, 45, 80, 290, 25, "As a Leader 👑", 14, C.orange, { bold: true }).requests);
  r.push(...text(pageId, 45, 110, 290, 150,
    "🔓 Break down unclear requirements\n    \"make it cool\" → actual task list\n\n📋 Brief the team clearly\n    clear tasks, clear deadlines\n\n🛡️ Shield team from client chaos\n    you handle the changes",
    10, C.text).requests);
  // Right card: Team Member
  r.push(...card(pageId, 370, 70, 320, 210));
  r.push(...text(pageId, 385, 80, 290, 25, "As a Team Member 🤝", 14, C.orange, { bold: true }).requests);
  r.push(...text(pageId, 385, 110, 290, 150,
    "🚨 Speak up when there's a problem\n    don't hide until deadline\n\n💡 Propose solutions, not just complaints\n\n🆘 Ask for help early\n    silence isn't strength, it's a bottleneck",
    10, C.text).requests);
  // Highlight
  r.push(...highlightBox(pageId, 30, 295, 660, 40, "\"Don't be the person who makes problems. Be the person who makes everyone's job easier.\"", 12));
  return r;
}

function slide9_clientChaos(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🌪️  When the Client Changes Everything"));
  r.push(...accentBar(pageId));
  // Left: stories
  r.push(...text(pageId, 30, 65, 340, 20, "True Stories from NDF:", 13, C.orange, { bold: true }).requests);
  r.push(...text(pageId, 30, 90, 340, 150,
    "🔮 Client's fortune teller said the design\n    was \"unlucky\" — redo everything\n\n🤫 Client goes silent for weeks → drops 50\n    comments the day before deadline\n\n⏰ \"Can you add 10 more characters?\n    The deadline is still the same.\"\n\n✨ \"I want it low-poly but also...\n    really detailed and realistic\"",
    10, C.text).requests);
  // Right: meme placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 190, "😅 Meme / Funny Visual", "A relatable meme about\nclient revisions or scope creep\n\nOr: before/after of a model\nthat got completely changed"));
  // Highlight
  r.push(...highlightBox(pageId, 30, 268, 660, 30, "How you HANDLE it matters more than how you FEEL about it.", 11));
  // Mic drop
  r.push(...text(pageId, 30, 310, 660, 40,
    "🎤 \"You don't have to believe me right now.\nBut when it happens to you — and it will — you'll remember this conversation.\"",
    10, C.primary, { center: true }).requests);
  return r;
}

function slide10_aiGood(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🤖  AI in Our Workflow — What Actually Works"));
  r.push(...accentBar(pageId));
  // Left: bullets
  r.push(...text(pageId, 30, 65, 340, 20, "✅ We Use AI For:", 14, C.green, { bold: true }).requests);
  r.push(...text(pageId, 30, 92, 340, 160,
    "🎨 Concept art & mood boards\n    fast exploration of ideas\n\n📸 Reference generation\n    try 10 styles in minutes\n\n💡 Idea brainstorming\n    \"what if the robot was more friendly?\"",
    11, C.text).requests);
  // Right: placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 220, "🎨 AI-Generated Concept Art", "Show a Midjourney/SD output\nthat you used as reference\nfor an actual project"));
  // Note
  r.push(...highlightBox(pageId, 30, 310, 660, 30, "💡 AI is a great brainstorming partner — it helps you explore ideas fast before committing to modeling.", 10));
  return r;
}

function slide11_aiBad(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🎭  AI 3D Generation — The Pretty Lie"));
  r.push(...accentBar(pageId));
  // Left card: AI
  r.push(...card(pageId, 20, 65, 335, 260));
  r.push(...text(pageId, 35, 72, 305, 20, "🤖 AI-Generated Mesh", 13, C.orange, { bold: true }).requests);
  r.push(...placeholder(pageId, 35, 97, 305, 90, "🤖 AI Model — Render View", "Looks amazing from outside!"));
  r.push(...placeholder(pageId, 35, 195, 305, 90, "💀 AI Model — Wireframe View", "Topology is a DISASTER\nCan't rig, can't animate, can't optimize"));
  // Right card: Hand
  r.push(...card(pageId, 365, 65, 335, 260));
  r.push(...text(pageId, 380, 72, 305, 20, "🧑‍🎨 Hand-Modeled Mesh", 13, C.primary, { bold: true }).requests);
  r.push(...placeholder(pageId, 380, 97, 305, 90, "🧑‍🎨 Hand Model — Render View", "Maybe less flashy at first"));
  r.push(...placeholder(pageId, 380, 195, 305, 90, "✨ Hand Model — Wireframe View", "Clean topology!\nReady for texture, rig, animation, VR"));
  // Highlight
  r.push(...highlightBox(pageId, 20, 340, 680, 30, "AI can generate a mesh — but it can't name the file, set the pivot, or ask the animator what they need. AI has no manners.", 10));
  return r;
}

function slideJuniorProject(pageId: string, name: string, icon: string, borderColor: RGB) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, `${icon}  ${name} — My Project Story`));
  r.push(...accentBar(pageId));
  // 4 image placeholders in 2x2 grid
  r.push(...placeholder(pageId, 30, 70, 325, 140, "📸 Reference / Concept", "What they started with"));
  r.push(...placeholder(pageId, 365, 70, 325, 140, "📦 Blockout / Early Stage", "The ugly beginning"));
  r.push(...placeholder(pageId, 30, 220, 325, 140, "🧊 Wireframe View", "Show the topology"));
  r.push(...placeholder(pageId, 365, 220, 325, 140, "✨ Final Shaded Model", "The finished mesh"));
  // Note at bottom
  r.push(...highlightBox(pageId, 30, 370, 660, 25, `🎤 ${name} tells their story: What was the project? What went wrong? What did they learn?`, 9));
  return r;
}

function slideJuniorLesson(pageId: string, name: string, icon: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, `💡  ${name} — What I Learned`));
  r.push(...accentBar(pageId));
  // Left: challenge + how
  r.push(...text(pageId, 30, 65, 340, 20, "🔥 The Challenge:", 13, C.orange, { bold: true }).requests);
  r.push(...highlightBox(pageId, 30, 90, 340, 60, "[Describe a specific challenge —\ncommunication, client change, or technical problem]", 10));
  r.push(...text(pageId, 30, 165, 340, 20, "💡 How I Handled It:", 13, C.orange, { bold: true }).requests);
  r.push(...text(pageId, 30, 190, 340, 120,
    "1️⃣ [What they did first]\n\n2️⃣ [What they did next]\n\n3️⃣ [The result]",
    11, C.text).requests);
  // Right: placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 250, "🖼️ Supporting Visual", "Before/after, screenshot\nof the problem, chat screenshot,\nor any visual that supports\ntheir story"));
  return r;
}

function slide16_mistakes(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "😅  Mistakes We've All Made"));
  r.push(...accentBar(pageId));
  // Left: mistakes
  r.push(...text(pageId, 30, 68, 340, 250,
    "❌ Detailing too early — blockout first!\n\n❌ Not talking to the next person in the pipeline\n\n❌ Hiding problems instead of speaking up\n\n❌ Naming files \"final_v2_REAL_thisone.fbx\"\n\n❌ Forgetting scale — giant coffee cup in VR\n\n❌ Buying assets without checking topology",
    11, C.text).requests);
  // Right: placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 250, "😂 Funny Fail Example", "A screenshot of a real mistake\n— wrong scale, broken normals,\nmessy outliner, etc.\n\nHumor makes it memorable!"));
  return r;
}

function slide17_takeaway(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🧠  What We Hope You Remember"));
  r.push(...accentBar(pageId));
  // 3 cards
  const cards = [
    ["🤝", "Communicate", "Talk to your team.\nAsk before you assume.\nSpeak up when stuck.", C.primary],
    ["🧹", "Clean Handoff", "Your work isn't for you.\nIt's for the next person.\nMake their life easy.", C.orange],
    ["🌪️", "Adapt", "Clients change their mind.\nDeadlines shift.\nRoll with it.", C.green],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 25 + i * 228;
    r.push(...card(pageId, x, 75, 215, 190));
    r.push(...text(pageId, x + 10, 85, 195, 40, cards[i][0] as string, 32, C.white, { center: true }).requests);
    r.push(...text(pageId, x + 10, 125, 195, 25, cards[i][1] as string, 16, cards[i][3] as RGB, { bold: true, center: true }).requests);
    r.push(...text(pageId, x + 10, 155, 195, 80, cards[i][2] as string, 10, C.muted, { center: true }).requests);
  }
  // Final quote
  r.push(...highlightBox(pageId, 100, 285, 520, 40, "\"Be the coworker everyone wants to work with.\"", 14));
  return r;
}

function slide18_qa(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...titleBar(pageId, "🎤  Your Turn — Ask Us Anything!"));
  r.push(...accentBar(pageId));
  // Left: starter questions
  r.push(...text(pageId, 30, 65, 340, 20, "Starter Questions:", 13, C.orange, { bold: true }).requests);
  r.push(...text(pageId, 30, 90, 340, 200,
    "💻 What software should I learn first?\n\n🤖 Will AI replace 3D modelers?\n\n⏱️ How long to become job-ready?\n\n🛤️ How did you get into this career?\n\n🤔 What's the hardest part of the job?",
    11, C.text).requests);
  // Right: team photo placeholder
  r.push(...placeholder(pageId, 390, 70, 290, 250, "📸 Team Photo", "Casual team photo or\nbehind-the-scenes shot\nfrom the office/workspace"));
  return r;
}

function slide19_thankyou(pageId: string) {
  const r: any[] = [];
  r.push(...slideBg(pageId));
  r.push(...accentBar(pageId));
  // Icon
  r.push(...text(pageId, 260, 60, 200, 50, "🙏", 40, C.white, { center: true }).requests);
  // Thank you
  r.push(...text(pageId, 60, 120, 600, 60, "Thank You!", 42, C.primary, { bold: true, center: true }).requests);
  r.push(...text(pageId, 80, 185, 560, 30, "It was great meeting you all.", 18, C.muted, { center: true }).requests);
  // Logo placeholder
  r.push(...placeholder(pageId, 260, 240, 200, 50, "🏢 NDF Logo", "Insert company logo"));
  // Company info
  r.push(...text(pageId, 80, 310, 560, 25, "NDF — Building Virtual Worlds", 14, C.muted, { center: true }).requests);
  r.push(...text(pageId, 80, 335, 560, 20, "www.ndf.co.th", 12, C.muted, { center: true }).requests);
  return r;
}

// ── Main ──
async function main() {
  const auth = await getAuthClient();
  const api = google.slides({ version: "v1", auth });

  console.log("Creating presentation...");

  // Create empty presentation
  const pres = await api.presentations.create({
    requestBody: { title: "Inside the 3D Pipeline — How We Build Worlds for VR" },
  });

  const presId = pres.data.presentationId!;
  const defaultSlideId = pres.data.slides?.[0]?.objectId;

  console.log(`  Created: ${presId}`);

  // Build all 19 slides
  const slideBuilders = [
    slide1_cover,       // 0
    slide2_team,        // 1
    slide3_whatWeBuild, // 2
    slide4_coreMessage, // 3
    slide5_pipeline,    // 4
    slide6_handoff,     // 5
    slide7_naming,      // 6
    slide8_communication, // 7
    slide9_clientChaos, // 8
    slide10_aiGood,     // 9
    slide11_aiBad,      // 10
    (p: string) => slideJuniorProject(p, "[Junior A]", "🎨", C.orange), // 11
    (p: string) => slideJuniorLesson(p, "[Junior A]", "🎨"),             // 12
    (p: string) => slideJuniorProject(p, "[Junior B]", "🧊", C.green),  // 13
    (p: string) => slideJuniorLesson(p, "[Junior B]", "🧊"),             // 14
    slide16_mistakes,   // 15
    slide17_takeaway,   // 16
    slide18_qa,         // 17
    slide19_thankyou,   // 18
  ];

  const allRequests: any[] = [];

  for (let i = 0; i < slideBuilders.length; i++) {
    const pageId = `slide_${String(i).padStart(2, '0')}`;
    // Create blank slide
    allRequests.push({
      createSlide: {
        objectId: pageId,
        insertionIndex: i,
        slideLayoutReference: { predefinedLayout: "BLANK" },
      },
    });
    // Add content
    allRequests.push(...slideBuilders[i](pageId));
  }

  // Delete default slide
  if (defaultSlideId) {
    allRequests.push({ deleteObject: { objectId: defaultSlideId } });
  }

  console.log(`  Sending ${allRequests.length} requests...`);

  // Batch update (split if too many requests)
  const BATCH_SIZE = 500;
  for (let i = 0; i < allRequests.length; i += BATCH_SIZE) {
    const batch = allRequests.slice(i, i + BATCH_SIZE);
    await api.presentations.batchUpdate({
      presentationId: presId,
      requestBody: { requests: batch },
    });
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} requests`);
  }

  const url = `https://docs.google.com/presentation/d/${presId}/edit`;
  console.log(`\n  ✅ Done! ${slideBuilders.length} slides created.`);
  console.log(`  URL: ${url}\n`);

  console.log("=== RESULT ===");
  console.log(JSON.stringify({ presentationId: presId, url, title: "Inside the 3D Pipeline", slideCount: slideBuilders.length }));
  console.log("=== END ===");
}

main().catch((err) => {
  console.error("Error:", err.message);
  if (err.errors) for (const e of err.errors) console.error("  -", e.message);
  process.exit(1);
});
