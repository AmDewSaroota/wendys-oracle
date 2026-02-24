const PptxGenJS = require("pptxgenjs");

const pres = new PptxGenJS();

// === Theme colors ===
const NAVY = "1a3f6f";
const BLUE = "2e74b5";
const TEAL = "3a7ca5";
const ORANGE = "e67e22";
const GREEN = "27ae60";
const RED = "c0392b";
const BG = "f0f2f5";
const WHITE = "FFFFFF";
const GRAY = "5a6a7a";
const LIGHT_GRAY = "8e99a4";
const LIGHT_BG = "f8f9fb";

// === Presentation settings ===
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "NDF";
pres.company = "NDF";
pres.subject = "SWT Mobile Web App";

// === Helper: Add title bar decoration ===
function addSlideHeader(slide, title, subtitle, slideNum, total) {
  // Left blue bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.35, w: 0.08, h: 0.55,
    fill: { color: BLUE },
    rectRadius: 0.04,
  });
  // Title
  slide.addText(title, {
    x: 0.72, y: 0.3, w: 10, h: 0.6,
    fontSize: 28, fontFace: "Prompt", bold: true, color: NAVY,
  });
  // Subtitle badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.14 + 0.4, h: 0.35,
    fill: { color: NAVY },
    rectRadius: 0.04,
  });
  slide.addText(subtitle, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.14 + 0.4, h: 0.35,
    fontSize: 11, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle",
    bold: true,
  });
  // Corner decoration (top-right triangles)
  slide.addShape(pres.ShapeType.rtTriangle, {
    x: 12.13, y: 0, w: 1.2, h: 1.2,
    fill: { color: BLUE }, rotate: 90,
    line: { color: BLUE, width: 0 },
  });
  // Slide number
  slide.addText(`${slideNum} / ${total}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 10, fontFace: "Prompt", color: LIGHT_GRAY, align: "right",
  });
  // Background
  slide.background = { fill: BG };
}

// === Helper: Pain card ===
function addPainCard(slide, x, y, w, icon, title, desc, source) {
  const h = source ? 1.2 : 1.05;
  // White card bg
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  // Red left border
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.05, h: h - 0.1,
    fill: { color: RED },
  });
  // Icon
  slide.addText(icon, {
    x: x + 0.15, y: y + 0.12, w: 0.45, h: 0.45,
    fontSize: 20, align: "center", valign: "middle",
  });
  // Title
  slide.addText(title, {
    x: x + 0.65, y: y + 0.08, w: w - 0.85, h: 0.3,
    fontSize: 12, fontFace: "Prompt", bold: true, color: NAVY,
  });
  // Description
  slide.addText(desc, {
    x: x + 0.65, y: y + 0.35, w: w - 0.85, h: 0.45,
    fontSize: 9.5, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.3,
    wrap: true,
  });
  // Source
  if (source) {
    slide.addText(source, {
      x: x + 0.65, y: y + 0.82, w: w - 0.85, h: 0.25,
      fontSize: 8.5, fontFace: "Prompt", color: RED, bold: true,
    });
  }
}

// === Helper: Solution card ===
function addSolCard(slide, x, y, w, icon, title, desc) {
  const h = 0.7;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  // Blue left border
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.05, h: h - 0.1,
    fill: { color: BLUE },
  });
  // Icon
  slide.addText(icon, {
    x: x + 0.12, y: y + 0.1, w: 0.4, h: 0.4,
    fontSize: 18, align: "center", valign: "middle",
  });
  // Title
  slide.addText(title, {
    x: x + 0.55, y: y + 0.06, w: w - 0.7, h: 0.28,
    fontSize: 11, fontFace: "Prompt", bold: true, color: BLUE,
  });
  // Desc
  slide.addText(desc, {
    x: x + 0.55, y: y + 0.33, w: w - 0.7, h: 0.3,
    fontSize: 9, fontFace: "Prompt", color: GRAY, wrap: true,
  });
}

const TOTAL = 5;

// ==========================================
// SLIDE 1: Pain Points
// ==========================================
const s1 = pres.addSlide();
addSlideHeader(s1, "Pain Points", "Traveler Experience Gaps", 1, TOTAL);

const painData = [
  ["🎫", "การเดินทาง ≠ จองตั๋ว", "ระบบปัจจุบันเน้น \"ธุรกรรม\" — ซื้อตั๋วจบ แต่ผู้โดยสารยังต้องการข้อมูลระหว่างทาง ความช่วยเหลือ และวางแผนปลายทาง", null],
  ["📝", "ขั้นตอนจองซับซ้อน", "ต้องกรอกข้อมูลผู้เดินทางก่อน จึงจะทราบว่าที่นั่งว่าง — หากเต็มต้องเริ่มใหม่ทั้งหมด", "📌 ข้อมูลจากผู้ใช้จริง (Pantip, App Store)"],
  ["🔀", "เส้นทางเชื่อมต่อต้องหาเอง", "ไม่มีรถไฟตรง ผู้โดยสารต้องค้นหาจุดเปลี่ยนขบวนเองทีละสาย ไม่มีระบบแนะนำเชื่อมต่อผ่าน hub", null],
  ["⏱️", "สถานะขบวนรถไม่ทันการณ์", "รถไฟล่าช้าหลายชั่วโมง แต่แอปยังแสดงเวลาตามตารางเดิม — วางแผนต่อไม่ได้", "📌 ข้อร้องเรียนที่พบบ่อยที่สุด (App Store Reviews)"],
  ["🗺️", "ทัวร์มีแต่ขาดรายละเอียด", "มีทัวร์รถไฟจัดเฉพาะแต่ราคาสูงและไม่แสดงรายละเอียดว่าได้อะไรบ้าง — ยังไม่มีแพ็คเกจท่องเที่ยวตามเส้นทางปกติ", null],
  ["📊", "ผู้บริหารขาด Insights", "ไม่มี Dashboard แสดง Conversion Funnel, พฤติกรรมผู้ใช้ หรือความพึงพอใจ เพื่อตัดสินใจเชิงนโยบาย", null],
];

const colW = 5.95;
const startY = 1.5;
painData.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.5 + col * (colW + 0.25);
  const y = startY + row * 1.35;
  addPainCard(s1, x, y, colW, p[0], p[1], p[2], p[3]);
});

// ==========================================
// SLIDE 2: The Solution
// ==========================================
const s2 = pres.addSlide();
addSlideHeader(s2, "The Solution", "Seamless Journey on Your Hand", 2, TOTAL);

const solData = [
  ["🔀", "Smart Routing", "เส้นทางตรง + เชื่อมต่อผ่าน hub อัตโนมัติ พร้อมแสดงเวลารอต่อรถ"],
  ["🎫", "Availability-First", "แสดง \"ว่าง/เต็ม\" ตั้งแต่ค้นหา เลือกที่นั่งแบบ Interactive"],
  ["⏱️", "Real-time Status", "ตำแหน่งจริง + ความตรงเวลาเฉลี่ย + ระยะล่าช้าจริง"],
  ["📌", "Tourism ในแอปเดียว", "ทัวร์ตามเส้นทาง — หัวหิน ฿890 · สะพานข้ามแม่น้ำแคว ฿2,490"],
  ["🤖", "RailBot AI", "ถามได้ตลอดเส้นทาง TH/EN — ตาราง, โปรโมชัน, ทัวร์, สถานี"],
  ["🏆", "Loyalty System", "สะสมแต้ม ฿10 = 1 pt → ส่วนลด / อัพเกรด / ตั๋วฟรี"],
  ["🚉", "Station Map", "SVG Map — ชานชาลา ร้านค้า ห้องน้ำ พร้อมคำนวณเวลาเดิน"],
];

solData.forEach((s, i) => {
  addSolCard(s2, 0.5, 1.5 + i * 0.78, 8.5, s[0], s[1], s[2]);
});

// Phone mockup placeholder on the right
slide2PhoneMockup(s2);

function slide2PhoneMockup(slide) {
  const px = 9.6, py = 1.5, pw = 3.0, ph = 5.5;
  // Phone outer frame
  slide.addShape(pres.ShapeType.roundRect, {
    x: px, y: py, w: pw, h: ph,
    fill: { color: WHITE },
    line: { color: NAVY, width: 2.5 },
    rectRadius: 0.3,
    shadow: { type: "outer", blur: 8, offset: 3, color: NAVY, opacity: 0.15 },
  });
  // Notch
  slide.addShape(pres.ShapeType.roundRect, {
    x: px + 0.85, y: py, w: 1.3, h: 0.25,
    fill: { color: NAVY },
    rectRadius: 0.08,
  });
  // Header
  slide.addShape(pres.ShapeType.roundRect, {
    x: px + 0.2, y: py + 0.4, w: pw - 0.4, h: 0.45,
    fill: { color: NAVY },
    rectRadius: 0.08,
  });
  slide.addText("🚂 SWT — Smart Tourism", {
    x: px + 0.2, y: py + 0.4, w: pw - 0.4, h: 0.45,
    fontSize: 11, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  // Menu icons row
  const icons = [
    { e: "🎫", l: "จองตั๋ว" },
    { e: "📋", l: "ตาราง" },
    { e: "🏖️", l: "ทัวร์" },
    { e: "🏆", l: "รางวัล" },
  ];
  icons.forEach((ic, i) => {
    const ix = px + 0.25 + i * 0.64;
    slide.addShape(pres.ShapeType.roundRect, {
      x: ix, y: py + 1.0, w: 0.55, h: 0.55,
      fill: { color: "eef4fb" },
      rectRadius: 0.06,
    });
    slide.addText(ic.e, {
      x: ix, y: py + 1.0, w: 0.55, h: 0.35,
      fontSize: 14, align: "center", valign: "middle",
    });
    slide.addText(ic.l, {
      x: ix - 0.05, y: py + 1.33, w: 0.65, h: 0.2,
      fontSize: 6, fontFace: "Prompt", color: NAVY, align: "center",
    });
  });
  // Card 1: Route
  addPhoneCard(slide, px + 0.2, py + 1.7, pw - 0.4, "🔀 กรุงเทพ → เชียงใหม่", "ด่วนพิเศษ #9 · ฿941 · 34 ที่ว่าง", BLUE);
  // Card 2: Tour
  addPhoneCard(slide, px + 0.2, py + 2.55, pw - 0.4, "🏖️ ทัวร์หัวหิน — 1 วัน", "฿890 · ⭐ 4.8", ORANGE);
  // Card 3: RailBot
  addPhoneCard(slide, px + 0.2, py + 3.4, pw - 0.4, "🤖 RailBot พร้อมช่วยเหลือ", "ถามตาราง โปรโมชัน ทัวร์ 24 ชม.", GREEN);
  // Bottom nav
  const navItems = ["🚉 แผนที่", "📊 สถิติ", "🔔 แจ้งเตือน"];
  navItems.forEach((n, i) => {
    slide.addShape(pres.ShapeType.roundRect, {
      x: px + 0.2 + i * 0.87, y: py + 4.35, w: 0.8, h: 0.3,
      fill: { color: BG },
      rectRadius: 0.04,
    });
    slide.addText(n, {
      x: px + 0.2 + i * 0.87, y: py + 4.35, w: 0.8, h: 0.3,
      fontSize: 6.5, fontFace: "Prompt", color: NAVY, align: "center", valign: "middle",
    });
  });
  // Label
  slide.addText("ตัวอย่างหน้า Home", {
    x: px, y: py + ph + 0.05, w: pw, h: 0.25,
    fontSize: 9, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
  });
}

function addPhoneCard(slide, x, y, w, title, desc, borderColor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.7,
    fill: { color: LIGHT_BG },
    rectRadius: 0.06,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.04, h: 0.6,
    fill: { color: borderColor },
  });
  slide.addText(title, {
    x: x + 0.12, y, w: w - 0.2, h: 0.35,
    fontSize: 8, fontFace: "Prompt", bold: true, color: NAVY,
  });
  slide.addText(desc, {
    x: x + 0.12, y: y + 0.3, w: w - 0.2, h: 0.35,
    fontSize: 7, fontFace: "Prompt", color: GRAY,
  });
}

// ==========================================
// SLIDE 3: App Mockups — Web + Mobile + Dashboard
// ==========================================
const s3 = pres.addSlide();
addSlideHeader(s3, "ตัวอย่างหน้าจอ", "Web · Mobile · Dashboard", 3, TOTAL);

// === Helper: Browser frame (laptop/desktop) ===
function addBrowserFrame(slide, x, y, w, h, title, headerColor, contentFn, label, sublabel) {
  // Laptop body
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    line: { color: "cccccc", width: 1.5 },
    rectRadius: 0.12,
    shadow: { type: "outer", blur: 5, offset: 2, color: "999999", opacity: 0.15 },
  });
  // Browser toolbar
  slide.addShape(pres.ShapeType.rect, {
    x: x + 0.01, y: y + 0.01, w: w - 0.02, h: 0.35,
    fill: { color: "e8ebef" },
  });
  // Traffic lights
  const dots = ["ff5f57", "ffbd2e", "28c840"];
  dots.forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: x + 0.12 + i * 0.18, y: y + 0.1, w: 0.14, h: 0.14,
      fill: { color: c },
    });
  });
  // URL bar
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.7, y: y + 0.07, w: w - 1.0, h: 0.22,
    fill: { color: WHITE },
    line: { color: "cccccc", width: 0.5 },
    rectRadius: 0.04,
  });
  slide.addText(title, {
    x: x + 0.75, y: y + 0.07, w: w - 1.1, h: 0.22,
    fontSize: 6.5, fontFace: "Prompt", color: GRAY, valign: "middle",
  });
  // Content area
  contentFn(slide, x + 0.1, y + 0.4, w - 0.2, h - 0.5, headerColor);
  // Label
  slide.addText(label, {
    x, y: y + h + 0.08, w, h: 0.25,
    fontSize: 10, fontFace: "Prompt", bold: true, color: NAVY, align: "center",
  });
  slide.addText(sublabel, {
    x, y: y + h + 0.3, w, h: 0.2,
    fontSize: 8, fontFace: "Prompt", color: BLUE, align: "center",
  });
}

// === Helper: Phone frame (mobile) ===
function addMockupPhone(slide, x, y, pw, ph, title, headerColor, contentFn, label, sublabel) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w: pw, h: ph,
    fill: { color: WHITE },
    line: { color: NAVY, width: 2 },
    rectRadius: 0.22,
    shadow: { type: "outer", blur: 5, offset: 2, color: NAVY, opacity: 0.1 },
  });
  // Notch
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + (pw - 1.0) / 2, y, w: 1.0, h: 0.2,
    fill: { color: NAVY },
    rectRadius: 0.06,
  });
  // Header
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.12, y: y + 0.3, w: pw - 0.24, h: 0.32,
    fill: { color: headerColor },
    rectRadius: 0.06,
  });
  slide.addText(title, {
    x: x + 0.12, y: y + 0.3, w: pw - 0.24, h: 0.32,
    fontSize: 9, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  // Content
  contentFn(slide, x + 0.12, y + 0.72, pw - 0.24, ph - 0.9, headerColor);
  // Label
  slide.addText(label, {
    x, y: y + ph + 0.08, w: pw, h: 0.22,
    fontSize: 9, fontFace: "Prompt", bold: true, color: NAVY, align: "center",
  });
  slide.addText(sublabel, {
    x, y: y + ph + 0.28, w: pw, h: 0.18,
    fontSize: 7, fontFace: "Prompt", color: BLUE, align: "center",
  });
}

// Helper: mini card inside mockups
function miniCard(slide, x, y, w, h, title, desc, borderColor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: h || 0.45,
    fill: { color: LIGHT_BG },
    rectRadius: 0.04,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.03, w: 0.03, h: (h || 0.45) - 0.06,
    fill: { color: borderColor },
  });
  slide.addText(title, {
    x: x + 0.08, y, w: w - 0.12, h: (h || 0.45) * 0.5,
    fontSize: 7, fontFace: "Prompt", bold: true, color: NAVY,
  });
  slide.addText(desc, {
    x: x + 0.08, y: y + (h || 0.45) * 0.4, w: w - 0.12, h: (h || 0.45) * 0.5,
    fontSize: 6, fontFace: "Prompt", color: GRAY,
  });
}

// ──── 1) Web Platform (browser frame, left) ────
addBrowserFrame(s3, 0.4, 1.5, 5.5, 3.5,
  "🌐 thai-rail-web-repo.vercel.app", BLUE,
  (slide, cx, cy, cw, ch) => {
    // Nav bar
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy, w: cw, h: 0.35,
      fill: { color: NAVY },
    });
    slide.addText("🚂 SWT Web Platform      🎫 จองตั๋ว    📋 ตาราง    🏖️ ทัวร์    🏆 รางวัล    🚉 แผนที่    🤖 RailBot", {
      x: cx + 0.1, y: cy, w: cw - 0.2, h: 0.35,
      fontSize: 7.5, fontFace: "Prompt", color: WHITE, valign: "middle",
    });
    // Search section
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.1, y: cy + 0.45, w: 2.4, h: 1.1,
      fill: { color: "eef4fb" },
      rectRadius: 0.08,
    });
    slide.addText("🔀 ค้นหาเส้นทาง", {
      x: cx + 0.2, y: cy + 0.5, w: 2.2, h: 0.22,
      fontSize: 9, fontFace: "Prompt", bold: true, color: NAVY,
    });
    slide.addText("จาก: กรุงเทพ\nถึง: เชียงใหม่\nวันที่: 25 ก.พ. 2569", {
      x: cx + 0.2, y: cy + 0.7, w: 2.2, h: 0.55,
      fontSize: 7, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4,
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.2, y: cy + 1.28, w: 2.0, h: 0.22,
      fill: { color: BLUE },
      rectRadius: 0.04,
    });
    slide.addText("ค้นหา →", {
      x: cx + 0.2, y: cy + 1.28, w: 2.0, h: 0.22,
      fontSize: 7.5, fontFace: "Prompt", color: WHITE, bold: true, align: "center", valign: "middle",
    });
    // Results
    const cxr = cx + 2.7;
    miniCard(slide, cxr, cy + 0.45, 2.6, 0.5, "🚄 ด่วนพิเศษ #9 — 34 ที่ว่าง", "13:05 ชม. · ฿941 ชั้น 2 · ตรงเวลา 85%", BLUE);
    miniCard(slide, cxr, cy + 1.0, 2.6, 0.5, "🔀 เชื่อมต่อผ่าน นครสวรรค์", "#7 + #51 · 14:30 ชม. · รอ 45 นาที", ORANGE);
    // Tour section
    miniCard(slide, cx + 0.1, cy + 1.7, 2.4, 0.5, "🏖️ ทัวร์แนะนำ — หัวหิน", "1 วัน · ฿890 · ⭐ 4.8 · สถานีรถไฟหัวหิน", ORANGE);
    miniCard(slide, cx + 2.7, cy + 1.7, 2.6, 0.5, "🏆 Gold Member — 2,450 pt", "ส่วนลด ฿100 · อัพเกรดที่นั่ง · ตั๋วฟรี", GREEN);
    // RailBot floating
    slide.addShape(pres.ShapeType.ellipse, {
      x: cx + cw - 0.6, y: cy + ch - 0.6, w: 0.5, h: 0.5,
      fill: { color: BLUE },
      shadow: { type: "outer", blur: 3, offset: 1, color: "999999", opacity: 0.3 },
    });
    slide.addText("🤖", {
      x: cx + cw - 0.6, y: cy + ch - 0.6, w: 0.5, h: 0.5,
      fontSize: 16, align: "center", valign: "middle",
    });
  },
  "Web Platform", "จองตั๋ว · ตาราง · ทัวร์ · Rewards · แผนที่"
);

// ──── 2) Mobile App (phone, center) ────
addMockupPhone(s3, 6.2, 1.5, 2.2, 3.8,
  "📱 SWT Mobile", ORANGE,
  (slide, cx, cy, cw, ch) => {
    // Gold badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: cw, h: 0.5,
      fill: { color: "c5973e" },
      rectRadius: 0.06,
    });
    slide.addText("🏅 Gold · 2,450 pt", {
      x: cx, y: cy, w: cw, h: 0.5,
      fontSize: 8, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
    });
    // Cards
    miniCard(slide, cx, cy + 0.6, cw, 0.42, "🎫 จองตั๋ว", "เลือกที่นั่ง Interactive", BLUE);
    miniCard(slide, cx, cy + 1.08, cw, 0.42, "🤖 RailBot", "ถามได้ตลอด TH/EN", BLUE);
    miniCard(slide, cx, cy + 1.56, cw, 0.42, "🏖️ ทัวร์", "หัวหิน ฿890 · แคว ฿2,490", ORANGE);
    miniCard(slide, cx, cy + 2.04, cw, 0.42, "🚉 แผนที่สถานี", "นำทาง + เวลาเดิน", GREEN);
    // Bottom nav
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy + ch - 0.32, w: cw, h: 0.3,
      fill: { color: BG },
    });
    slide.addText("🏠   🎫   🤖   🏆", {
      x: cx, y: cy + ch - 0.32, w: cw, h: 0.3,
      fontSize: 10, align: "center", valign: "middle",
    });
  },
  "Mobile App", "ใช้ระหว่างเดินทาง + AI Chat"
);

// ──── 3) RailBot Chat (phone, center-right) ────
addMockupPhone(s3, 8.7, 1.5, 2.2, 3.8,
  "🤖 RailBot", BLUE,
  (slide, cx, cy, cw, ch) => {
    // Chat bubbles
    const chatBot = (yy, text) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: yy, w: cw * 0.85, h: 0.38,
        fill: { color: "eef4fb" },
        rectRadius: 0.06,
      });
      slide.addText(text, {
        x: cx + 0.05, y: yy, w: cw * 0.85 - 0.1, h: 0.38,
        fontSize: 6.5, fontFace: "Prompt", color: NAVY, wrap: true,
      });
    };
    const chatUser = (yy, text) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + cw * 0.15, y: yy, w: cw * 0.85, h: 0.28,
        fill: { color: NAVY },
        rectRadius: 0.06,
      });
      slide.addText(text, {
        x: cx + cw * 0.15 + 0.05, y: yy, w: cw * 0.85 - 0.1, h: 0.28,
        fontSize: 6.5, fontFace: "Prompt", color: WHITE,
      });
    };
    chatBot(cy + 0.05, "สวัสดีค่ะ! ฉันคือ RailBot\nถามอะไรก็ได้เลยค่ะ 🚂");
    chatUser(cy + 0.5, "ขบวน #9 ตรงเวลาไหม?");
    chatBot(cy + 0.85, "📍 กำลังเดินทาง\n⏱️ ล่าช้า 12 นาที\n📊 ตรงเวลา 85%");
    chatUser(cy + 1.4, "ทัวร์ที่เชียงใหม่?");
    chatBot(cy + 1.75, "🏖️ สายเหนือ 3 วัน ฿3,790\nอุโมงค์ขุนตาน ฿1,290\nจะจองเลยไหมคะ? 😊");
    // Input bar
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + ch - 0.35, w: cw, h: 0.3,
      fill: { color: BG },
      rectRadius: 0.12,
    });
    slide.addText("พิมพ์ข้อความ...", {
      x: cx + 0.05, y: cy + ch - 0.35, w: cw - 0.4, h: 0.3,
      fontSize: 6.5, fontFace: "Prompt", color: LIGHT_GRAY, valign: "middle",
    });
  },
  "RailBot AI Chat", "ถามได้ตลอด TH/EN"
);

// ──── 4) Stats Dashboard (browser frame, right) ────
addBrowserFrame(s3, 11.15, 1.5, 1.95, 3.5,
  "📊 srt-stats.vercel.app", GREEN,
  (slide, cx, cy, cw, ch) => {
    // Header
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy, w: cw, h: 0.3,
      fill: { color: GREEN },
    });
    slide.addText("📊 SRT Stats", {
      x: cx, y: cy, w: cw, h: 0.3,
      fontSize: 7.5, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
    });
    // KPI boxes
    const kpis = [
      { n: "281K", l: "Bookings", c: GREEN },
      { n: "฿287M", l: "Revenue", c: ORANGE },
    ];
    kpis.forEach((k, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + i * 0.85, y: cy + 0.4, w: 0.8, h: 0.5,
        fill: { color: i === 0 ? "e8f5e9" : "fff3e0" },
        rectRadius: 0.05,
      });
      slide.addText(k.n, {
        x: cx + i * 0.85, y: cy + 0.4, w: 0.8, h: 0.32,
        fontSize: 9, fontFace: "Prompt", bold: true, color: k.c, align: "center",
      });
      slide.addText(k.l, {
        x: cx + i * 0.85, y: cy + 0.68, w: 0.8, h: 0.2,
        fontSize: 5.5, fontFace: "Prompt", color: GRAY, align: "center",
      });
    });
    // Chart items
    miniCard(slide, cx, cy + 1.05, cw, 0.4, "📈 Conversion Funnel", "Search → Book → Pay", GREEN);
    miniCard(slide, cx, cy + 1.5, cw, 0.4, "🔥 Booking Heatmap", "Peak 20:00-22:00", ORANGE);
    miniCard(slide, cx, cy + 1.95, cw, 0.4, "⭐ Satisfaction", "4.6/5 (48,620 reviews)", BLUE);
  },
  "Stats Dashboard", "Booking · Revenue · Heatmap"
);

// ==========================================
// SLIDE 4: Comparison Table
// ==========================================
const s4 = pres.addSlide();
addSlideHeader(s4, "เปรียบเทียบ", "Enhancing the Passenger Experience", 4, TOTAL);

const tableHeader = [
  { text: "ความต้องการ", options: { fill: NAVY, color: WHITE, bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "สถานการณ์ปัจจุบัน", options: { fill: NAVY, color: "b0c4de", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "แพลตฟอร์ม SWT ✦", options: { fill: NAVY, color: "a8e6cf", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
];

const tableRows = [
  ["🔀 ค้นหาเส้นทาง", "เลือกได้เฉพาะเส้นทางตรง", "Smart Routing + เชื่อมต่อผ่าน hub อัตโนมัติ"],
  ["⚡ ความเร็วแสดงผล", "โหลดช้าในช่วงผู้ใช้หนาแน่น", "Edge Computing — แสดงผลเร็วสม่ำเสมอ"],
  ["💺 สถานะที่นั่ง", "กรอกข้อมูลก่อนถึงจะรู้ว่าว่าง", "Availability-First — รู้ทันทีตั้งแต่ค้นหา"],
  ["⏱️ สถานะขบวนรถ", "อ้างอิงตามตารางเวลาหลัก", "อ้างอิงตำแหน่งจริง (Real-time Tracking)"],
  ["📌 ข้อมูลท่องเที่ยว", "มีทัวร์จัดเฉพาะ แต่ราคาสูง ขาดรายละเอียด", "Tour Packages ตามเส้นทาง พร้อมราคา/รีวิว จองในแอป"],
  ["📱 ช่วยเหลือระหว่างทาง", "โทรสายด่วน 1690", "AI Chatbot (RailBot) ตอบทันที TH/EN"],
  ["🏆 แรงจูงใจกลับมาใช้", "ไม่มีระบบ Loyalty", "Gold → Platinum + แต้มสะสม + คูปอง"],
  ["🚉 นำทางในสถานี", "ไม่มีแผนที่สถานี", "Interactive Map + คำนวณระยะทาง/เวลาเดิน"],
  ["📊 ข้อมูลผู้บริหาร", "ไม่มี Analytics Dashboard", "Stats Dashboard — Booking / Revenue / Heatmap"],
];

const formattedRows = tableRows.map((row, ri) => {
  const bgColor = ri % 2 === 0 ? WHITE : LIGHT_BG;
  return [
    { text: row[0], options: { fill: bgColor, color: NAVY, bold: true, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
    { text: row[1], options: { fill: bgColor, color: LIGHT_GRAY, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
    { text: row[2], options: { fill: bgColor, color: BLUE, bold: true, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
  ];
});

s4.addTable([tableHeader, ...formattedRows], {
  x: 0.5, y: 1.5, w: 12.33,
  colW: [2.8, 4.2, 5.33],
  rowH: [0.45, ...Array(9).fill(0.52)],
  border: { pt: 0.5, color: "e8ebef" },
  margin: [5, 8, 5, 8],
});

s4.addText("✦ SWT — Smart Tourism Platform โดย NDF สำหรับการรถไฟแห่งประเทศไทย", {
  x: 0.5, y: 6.85, w: 12.33, h: 0.3,
  fontSize: 9, fontFace: "Prompt", color: LIGHT_GRAY, align: "right",
});

// ==========================================
// SLIDE 5: Live Demo
// ==========================================
const s5 = pres.addSlide();
addSlideHeader(s5, "Live Demo", "ทดลองใช้งานจริง", 5, TOTAL);

function addDemoCard(slide, x, color, title, desc, url, btnLabel) {
  const y = 1.5, w = 3.7, h = 5.0;
  // Card
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 5, offset: 2, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.12,
  });
  // Top color border
  slide.addShape(pres.ShapeType.rect, {
    x: x + 0.05, y, w: w - 0.1, h: 0.06,
    fill: { color },
  });
  // Mini phone placeholder
  const mpx = x + 0.85, mpy = y + 0.3, mpw = 2.0, mph = 2.8;
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx, y: mpy, w: mpw, h: mph,
    fill: { color: LIGHT_BG },
    line: { color: "dddddd", width: 1.5 },
    rectRadius: 0.2,
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx + 0.55, y: mpy, w: 0.9, h: 0.15,
    fill: { color: "dddddd" },
    rectRadius: 0.05,
  });
  // Mini header
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx + 0.1, y: mpy + 0.25, w: mpw - 0.2, h: 0.28,
    fill: { color },
    rectRadius: 0.05,
  });
  slide.addText(title, {
    x: mpx + 0.1, y: mpy + 0.25, w: mpw - 0.2, h: 0.28,
    fontSize: 8, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  // Title below phone
  slide.addText(title.replace(/[🌐📱📊]\s?/g, ""), {
    x, y: y + 3.2, w, h: 0.4,
    fontSize: 16, fontFace: "Prompt", bold: true, color: NAVY, align: "center",
  });
  // Desc
  slide.addText(desc, {
    x: x + 0.2, y: y + 3.6, w: w - 0.4, h: 0.5,
    fontSize: 10, fontFace: "Prompt", color: GRAY, align: "center", wrap: true,
  });
  // URL text
  slide.addText(url, {
    x: x + 0.2, y: y + 4.05, w: w - 0.4, h: 0.3,
    fontSize: 8, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
    hyperlink: { url: `https://${url}` },
  });
  // Button
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.8, y: y + 4.4, w: w - 1.6, h: 0.4,
    fill: { color },
    rectRadius: 0.2,
  });
  slide.addText(btnLabel, {
    x: x + 0.8, y: y + 4.4, w: w - 1.6, h: 0.4,
    fontSize: 11, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
    hyperlink: { url: `https://${url}` },
  });
}

addDemoCard(s5, 0.7, BLUE, "🌐 Web Platform",
  "เว็บไซต์หลัก — จองตั๋ว ตาราง ทัวร์ Reward แผนที่สถานี",
  "thai-rail-web-repo.vercel.app", "เปิดเว็บ →");

addDemoCard(s5, 4.8, ORANGE, "📱 Mobile App",
  "แอปมือถือ — ออกแบบสำหรับใช้งานระหว่างเดินทาง พร้อม AI Chat",
  "swt-mobile.vercel.app", "เปิดแอป →");

addDemoCard(s5, 8.9, GREEN, "📊 Stats Dashboard",
  "Dashboard สำหรับผู้บริหาร — Booking Revenue Heatmap Satisfaction",
  "srt-stats.vercel.app", "เปิด Dashboard →");

// === EXPORT ===
const outPath = "./pain-solution.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`✅ Created: ${outPath}`);
}).catch(err => {
  console.error("Error:", err);
});
