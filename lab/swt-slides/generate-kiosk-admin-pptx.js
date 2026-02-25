const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pres = new PptxGenJS();

// === Theme colors ===
const NAVY = "1a3f6f";
const BLUE = "2e74b5";
const ORANGE = "e67e22";
const DEEP_ORANGE = "e65100";
const GREEN = "27ae60";
const RED = "c0392b";
const BG = "f0f2f5";
const WHITE = "FFFFFF";
const GRAY = "5a6a7a";
const LIGHT_GRAY = "8e99a4";
const LIGHT_BG = "f8f9fb";
const PURPLE = "7b1fa2";
const DEEP_PURPLE = "4a148c";
const LIGHT_PURPLE = "f3e5f5";
const WARM_BG = "fff8f0";
const WARM_ICON_BG = "fff3e0";
const PAIN_ICON_BG = "fef2f2";

// === Presentation settings ===
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "NDF";
pres.company = "NDF";
pres.subject = "SWT Kiosk Admin — Pain Points & Solution";

const TOTAL = 3;
const DARK_BG = "0d1b2a";
const SIDEBAR_BG = "1b2838";
const CARD_DARK = "243447";
const ACCENT_TEAL = "00bcd4";
const STATION_BLUE = "1565c0";
const STATION_LIGHT = "1e88e5";

// === Helper: Add slide header ===
function addSlideHeader(slide, title, subtitle, slideNum) {
  // Left accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.35, w: 0.08, h: 0.55,
    fill: { color: PURPLE }, rectRadius: 0.04,
  });
  // Title
  slide.addText(title, {
    x: 0.72, y: 0.3, w: 10, h: 0.6,
    fontSize: 28, fontFace: "Prompt", bold: true, color: NAVY,
  });
  // Subtitle badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.13 + 0.5, h: 0.35,
    fill: { color: DEEP_PURPLE }, rectRadius: 0.04,
  });
  slide.addText(subtitle, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.13 + 0.5, h: 0.35,
    fontSize: 11, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  // Corner triangle (purple)
  slide.addShape(pres.ShapeType.rtTriangle, {
    x: 12.13, y: 0, w: 1.2, h: 1.2,
    fill: { color: PURPLE }, rotate: 90, line: { color: PURPLE, width: 0 },
  });
  // Slide number
  slide.addText(`${slideNum} / ${TOTAL}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 10, fontFace: "Prompt", color: LIGHT_GRAY, align: "right",
  });
  slide.background = { fill: BG };
}

// === Helper: Pain card ===
function addPainCard(slide, x, y, w, icon, title, desc, opts = {}) {
  const { source, highlight } = opts;
  const h = source ? 1.28 : 1.1;
  const borderColor = highlight ? DEEP_ORANGE : RED;
  const cardBg = highlight ? WARM_BG : WHITE;
  const iconBg = highlight ? WARM_ICON_BG : PAIN_ICON_BG;

  // Card background
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: cardBg },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  // Left border
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.06, h: h - 0.1,
    fill: { color: borderColor },
  });
  // Icon background
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.16, y: y + 0.14, w: 0.48, h: 0.48,
    fill: { color: iconBg }, rectRadius: 0.08,
  });
  // Icon
  slide.addText(icon, {
    x: x + 0.16, y: y + 0.14, w: 0.48, h: 0.48,
    fontSize: 20, align: "center", valign: "middle",
  });
  // Title
  slide.addText(title, {
    x: x + 0.75, y: y + 0.1, w: w - 0.95, h: 0.3,
    fontSize: 12.5, fontFace: "Prompt", bold: true, color: NAVY,
  });
  // Description
  slide.addText(desc, {
    x: x + 0.75, y: y + 0.38, w: w - 0.95, h: 0.5,
    fontSize: 10, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.35, wrap: true,
  });
  // Source note
  if (source) {
    slide.addText(source, {
      x: x + 0.75, y: y + 0.9, w: w - 0.95, h: 0.25,
      fontSize: 8.5, fontFace: "Prompt", color: DEEP_ORANGE, bold: true,
    });
  }
}

// === Helper: Solution card ===
function addSolCard(slide, x, y, w, icon, title, desc, opts = {}) {
  const { featured } = opts;
  const h = 0.78;
  const borderColor = featured ? ORANGE : PURPLE;
  const cardBg = featured ? "fefbf6" : WHITE;
  const iconBgColor = featured ? WARM_ICON_BG : LIGHT_PURPLE;
  const titleColor = featured ? DEEP_ORANGE : PURPLE;

  // Card background
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: cardBg },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  // Left border
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.05, h: h - 0.1,
    fill: { color: borderColor },
  });
  // Icon background
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.14, y: y + 0.12, w: 0.44, h: 0.44,
    fill: { color: iconBgColor }, rectRadius: 0.08,
  });
  // Icon
  slide.addText(icon, {
    x: x + 0.14, y: y + 0.12, w: 0.44, h: 0.44,
    fontSize: 18, align: "center", valign: "middle",
  });
  // Title
  slide.addText(title, {
    x: x + 0.68, y: y + 0.08, w: w - 0.85, h: 0.28,
    fontSize: 11.5, fontFace: "Prompt", bold: true, color: titleColor,
  });
  // Description
  slide.addText(desc, {
    x: x + 0.68, y: y + 0.36, w: w - 0.85, h: 0.35,
    fontSize: 9.5, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.3, wrap: true,
  });
}

// ====================================================
// SLIDE 1: PAIN POINTS
// ====================================================
(function slide1_PainPoints() {
  const slide = pres.addSlide();
  addSlideHeader(slide, "Kiosk Admin: Pain Points", "Remote Management Issues", 1);

  const COL_W = 5.85;
  const LEFT = 0.5;
  const RIGHT = LEFT + COL_W + 0.3;
  const START_Y = 1.55;
  const GAP = 1.25;

  // Row 1
  addPainCard(slide, LEFT, START_Y, COL_W,
    "🧑‍🔧", "การดูแล Kiosk จำนวนมาก",
    "ตู้ Kiosk กระจายอยู่หลายสถานี แต่ละสถานีมีหลายตู้ — การตรวจสอบสถานะทั้งหมดพร้อมกันเป็นเรื่องยาก"
  );
  addPainCard(slide, RIGHT, START_Y, COL_W,
    "✏️", "การอัพเดทข้อมูล",
    "เสียเวลาและกำลังคนหากต้องลงพื้นที่เพื่อเปลี่ยนประกาศ หรืออัพเดทข้อมูลทีละตู้ ทีละสถานี"
  );

  // Row 2
  addPainCard(slide, LEFT, START_Y + GAP, COL_W,
    "🔧", "การซ่อมบำรุง",
    "ไม่ทราบทันทีเมื่อตู้ Offline หรืออุปกรณ์ขัดข้อง — ต้องรอรายงานจากเจ้าหน้าที่สถานี"
  );
  addPainCard(slide, RIGHT, START_Y + GAP, COL_W,
    "❌", "ขาดข้อมูลเชิงลึก",
    "ไม่มีข้อมูลสถิติพฤติกรรมการใช้งาน เช่น คำถามยอดนิยม ช่วงเวลาพีค จำนวนผู้ใช้ต่อตู้"
  );

  // Row 3 — NEW highlights
  addPainCard(slide, LEFT, START_Y + GAP * 2, COL_W,
    "👤", "ระบบแอดมินเดียวไม่เพียงพอ",
    "เดิมวางแผนแค่แอดมินคนเดียว แต่เมื่อมีหลายสถานี ต้องการแบ่งสิทธิ์ตามสถานี — ผู้ดูแลแต่ละสถานีควรเห็นเฉพาะตู้ของตัวเอง",
    { highlight: true, source: "📌 พบระหว่างพัฒนา Demo — ความต้องการใช้งานจริง" }
  );
  addPainCard(slide, RIGHT, START_Y + GAP * 2, COL_W,
    "🎯", "การจัดการโฆษณาข้ามสถานี",
    "เจ้าหน้าที่สถานีไม่ควรสร้างโฆษณาที่แสดงในสถานีอื่น — ต้องมีระบบ Targeting Lock ตามสิทธิ์ของแต่ละ Role",
    { highlight: true }
  );
})();

// ====================================================
// SLIDE 2: THE SOLUTION
// ====================================================
(function slide2_Solution() {
  const slide = pres.addSlide();
  addSlideHeader(slide, "Kiosk Admin: The Solution", "Centralized Control & 2-Tier Admin", 2);

  const FEAT_X = 0.5;
  const FEAT_W = 7.0;
  const FEAT_START_Y = 1.55;
  const FEAT_GAP = 0.86;

  // Feature cards (left side)
  addSolCard(slide, FEAT_X, FEAT_START_Y, FEAT_W,
    "🗄️", "Centralized Content Management",
    "เปลี่ยน Banner, Popup และข่าวสารได้ทันทีจากระบบหลังบ้าน — ไม่ต้องลงพื้นที่"
  );
  addSolCard(slide, FEAT_X, FEAT_START_Y + FEAT_GAP, FEAT_W,
    "🔃", "Real-time Status Monitoring",
    "ตรวจสอบสถานะ Online/Offline ของทุกตู้ในระบบ พร้อม Avg Uptime 98%"
  );
  addSolCard(slide, FEAT_X, FEAT_START_Y + FEAT_GAP * 2, FEAT_W,
    "📊", "LiveWalk Heatmap",
    "วิเคราะห์ความหนาแน่นของผู้คนในสถานีแบบ Real-time ด้วย DeepTrack"
  );
  addSolCard(slide, FEAT_X, FEAT_START_Y + FEAT_GAP * 3, FEAT_W,
    "🗂️", "Advanced Analytics",
    "รายงานสถิติคำถามยอดนิยม ช่วงเวลาการใช้งานสูงสุด 57,860+ interactions"
  );
  addSolCard(slide, FEAT_X, FEAT_START_Y + FEAT_GAP * 4, FEAT_W,
    "🔐", "2-Tier Admin System",
    "Super Admin ควบคุมทุกสถานี — Station Admin ดูแลเฉพาะสถานีตัวเอง แบ่งสิทธิ์อัตโนมัติตาม Login",
    { featured: true }
  );
  addSolCard(slide, FEAT_X, FEAT_START_Y + FEAT_GAP * 5, FEAT_W,
    "🎯", "Station-Targeted Ads & Popup",
    "Super Admin เลือก target ได้ทุกสถานี — Station Admin Targeting Lock เฉพาะสถานีตัวเอง",
    { featured: true }
  );

  // === Right side: Login screenshot + Role comparison ===
  const RX = 7.85;
  const RW = 5.0;

  // Login screenshot
  const imgPath = path.join(__dirname, "screenshots", "kiosk-admin-01-login.png");
  slide.addImage({
    path: imgPath,
    x: RX + 0.25, y: 1.55, w: 4.5, h: 2.7,
    rounding: true,
    shadow: { type: "outer", blur: 6, offset: 2, color: DEEP_PURPLE, opacity: 0.18 },
  });
  // Frame label
  slide.addShape(pres.ShapeType.roundRect, {
    x: RX + 0.35, y: 1.65, w: 1.55, h: 0.28,
    fill: { color: DEEP_PURPLE }, rectRadius: 0.04,
  });
  slide.addText("Admin Portal Login", {
    x: RX + 0.35, y: 1.65, w: 1.55, h: 0.28,
    fontSize: 8, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });

  // Role comparison boxes
  const BOX_Y = 4.5;
  const BOX_W = 2.15;
  const BOX_H = 2.5;
  const BOX_GAP = 0.2;

  // --- Super Admin box ---
  const SA_X = RX + 0.25;
  slide.addShape(pres.ShapeType.roundRect, {
    x: SA_X, y: BOX_Y, w: BOX_W, h: BOX_H,
    fill: { type: "solid", color: DEEP_PURPLE },
    rectRadius: 0.12,
    shadow: { type: "outer", blur: 4, offset: 2, color: "333333", opacity: 0.2 },
  });
  // Gradient overlay
  slide.addShape(pres.ShapeType.roundRect, {
    x: SA_X, y: BOX_Y, w: BOX_W, h: BOX_H * 0.35,
    fill: { color: PURPLE }, rectRadius: 0.12,
  });
  slide.addText("👑", {
    x: SA_X, y: BOX_Y + 0.08, w: BOX_W, h: 0.4,
    fontSize: 22, align: "center", valign: "middle",
  });
  slide.addText("Super Admin", {
    x: SA_X, y: BOX_Y + 0.48, w: BOX_W, h: 0.3,
    fontSize: 12, fontFace: "Prompt", bold: true, color: WHITE, align: "center",
  });
  // Credential badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: SA_X + 0.35, y: BOX_Y + 0.82, w: BOX_W - 0.7, h: 0.26,
    fill: { color: "FFFFFF", transparency: 80 }, rectRadius: 0.04,
  });
  slide.addText("admin / 1234", {
    x: SA_X + 0.35, y: BOX_Y + 0.82, w: BOX_W - 0.7, h: 0.26,
    fontSize: 9, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });
  // Bullet points
  const saItems = [
    "✓ เห็นทุกสถานี",
    "✓ จัดการ Kiosk ทั้งหมด",
    "✓ Target โฆษณาได้อิสระ",
    "✓ ดู Analytics ภาพรวม",
  ];
  saItems.forEach((txt, i) => {
    slide.addText(txt, {
      x: SA_X + 0.2, y: BOX_Y + 1.2 + i * 0.28, w: BOX_W - 0.4, h: 0.26,
      fontSize: 9.5, fontFace: "Prompt", color: WHITE, valign: "middle",
    });
  });

  // --- Station Admin box ---
  const STA_X = SA_X + BOX_W + BOX_GAP;
  slide.addShape(pres.ShapeType.roundRect, {
    x: STA_X, y: BOX_Y, w: BOX_W, h: BOX_H,
    fill: { type: "solid", color: "1565c0" },
    rectRadius: 0.12,
    shadow: { type: "outer", blur: 4, offset: 2, color: "333333", opacity: 0.2 },
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: STA_X, y: BOX_Y, w: BOX_W, h: BOX_H * 0.35,
    fill: { color: "1e88e5" }, rectRadius: 0.12,
  });
  slide.addText("🏢", {
    x: STA_X, y: BOX_Y + 0.08, w: BOX_W, h: 0.4,
    fontSize: 22, align: "center", valign: "middle",
  });
  slide.addText("Station Admin", {
    x: STA_X, y: BOX_Y + 0.48, w: BOX_W, h: 0.3,
    fontSize: 12, fontFace: "Prompt", bold: true, color: WHITE, align: "center",
  });
  // Credential badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: STA_X + 0.3, y: BOX_Y + 0.82, w: BOX_W - 0.6, h: 0.26,
    fill: { color: "FFFFFF", transparency: 80 }, rectRadius: 0.04,
  });
  slide.addText("bangkok / 1234", {
    x: STA_X + 0.3, y: BOX_Y + 0.82, w: BOX_W - 0.6, h: 0.26,
    fontSize: 9, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });
  // Bullet points
  const staItems = [
    "✓ เห็นเฉพาะสถานีตัวเอง",
    "✓ จัดการ Kiosk ของสถานี",
    "🔒 Targeting Lock สถานี",
    "✓ ดู Analytics เฉพาะสถานี",
  ];
  staItems.forEach((txt, i) => {
    slide.addText(txt, {
      x: STA_X + 0.2, y: BOX_Y + 1.2 + i * 0.28, w: BOX_W - 0.4, h: 0.26,
      fontSize: 9.5, fontFace: "Prompt", color: WHITE, valign: "middle",
    });
  });

  // Bottom label
  slide.addText("Login เดียว → ระบบแยกสิทธิ์อัตโนมัติ", {
    x: RX, y: BOX_Y + BOX_H + 0.08, w: RW, h: 0.25,
    fontSize: 10, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
  });
})();

// ====================================================
// SLIDE 3: SPLIT SCREEN — ROLE COMPARISON
// ====================================================
(function slide3_SplitScreen() {
  const slide = pres.addSlide();
  addSlideHeader(slide, "Kiosk Admin: 2-Tier Access Comparison", "Same Login Portal — Different Permissions", 3);

  // Layout constants
  const HALF_W = 5.95;
  const LEFT_X = 0.35;
  const RIGHT_X = 6.75;
  const DIVIDER_X = 6.55;

  // ---- Vertical divider ----
  slide.addShape(pres.ShapeType.rect, {
    x: DIVIDER_X, y: 1.4, w: 0.02, h: 5.8,
    fill: { color: "d0d5dd" },
  });
  slide.addText("VS", {
    x: DIVIDER_X - 0.22, y: 4.0, w: 0.46, h: 0.38,
    fontSize: 10, fontFace: "Prompt", bold: true, color: LIGHT_GRAY, align: "center", valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: DIVIDER_X - 0.22, y: 4.0, w: 0.46, h: 0.38,
    fill: { color: BG }, line: { color: "d0d5dd", width: 1 }, rectRadius: 0.06,
  });
  slide.addText("VS", {
    x: DIVIDER_X - 0.22, y: 4.0, w: 0.46, h: 0.38,
    fontSize: 10, fontFace: "Prompt", bold: true, color: LIGHT_GRAY, align: "center", valign: "middle",
  });

  // ============================================================
  //  LEFT: Super Admin
  // ============================================================
  const L = LEFT_X;

  // -- Role header badge --
  slide.addShape(pres.ShapeType.roundRect, {
    x: L, y: 1.5, w: HALF_W, h: 0.55,
    fill: { color: DEEP_PURPLE }, rectRadius: 0.08,
    shadow: { type: "outer", blur: 3, offset: 1, color: "333333", opacity: 0.15 },
  });
  slide.addText("👑  Super Admin", {
    x: L + 0.15, y: 1.5, w: 3, h: 0.55,
    fontSize: 16, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + HALF_W - 1.8, y: 1.6, w: 1.6, h: 0.35,
    fill: { color: "FFFFFF", transparency: 80 }, rectRadius: 0.04,
  });
  slide.addText("admin / 1234", {
    x: L + HALF_W - 1.8, y: 1.6, w: 1.6, h: 0.35,
    fontSize: 10, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // -- Kiosk MA browser frame (Super Admin) --
  const MA_Y = 2.25;
  const FRAME_H = 2.3;
  // Browser chrome
  slide.addShape(pres.ShapeType.roundRect, {
    x: L, y: MA_Y, w: HALF_W, h: FRAME_H,
    fill: { color: WHITE }, rectRadius: 0.1,
    line: { color: "d0d5dd", width: 1 },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.2 },
  });
  // Title bar
  slide.addShape(pres.ShapeType.rect, {
    x: L + 0.01, y: MA_Y + 0.01, w: HALF_W - 0.02, h: 0.32,
    fill: { color: "e8ebef" },
  });
  // Traffic dots
  ["ff5f57", "ffbd2e", "28c840"].forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: L + 0.12 + i * 0.16, y: MA_Y + 0.09, w: 0.13, h: 0.13,
      fill: { color: c },
    });
  });
  slide.addText("Kiosk MA — Maintenance & Availability", {
    x: L + 0.6, y: MA_Y + 0.01, w: 4, h: 0.32,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: NAVY, valign: "middle",
  });
  // Section label
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + HALF_W - 1.3, y: MA_Y + 0.06, w: 1.1, h: 0.22,
    fill: { color: PURPLE }, rectRadius: 0.04,
  });
  slide.addText("KIOSK ADMIN", {
    x: L + HALF_W - 1.3, y: MA_Y + 0.06, w: 1.1, h: 0.22,
    fontSize: 7, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // Content area
  const CY = MA_Y + 0.42;
  // Station filter dropdown
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + 0.15, y: CY + 0.05, w: 2.2, h: 0.32,
    fill: { color: LIGHT_BG }, line: { color: "d0d5dd", width: 0.75 }, rectRadius: 0.04,
  });
  slide.addText("ทุกสถานี ▼", {
    x: L + 0.25, y: CY + 0.05, w: 2, h: 0.32,
    fontSize: 9, fontFace: "Prompt", color: NAVY, valign: "middle", bold: true,
  });
  // Station buttons
  const stations = ["กรุงเทพ", "หัวหิน", "เชียงใหม่", "สุราษฎร์"];
  stations.forEach((s, i) => {
    slide.addShape(pres.ShapeType.roundRect, {
      x: L + 2.55 + i * 0.82, y: CY + 0.07, w: 0.75, h: 0.27,
      fill: { color: i === 0 ? PURPLE : "e8ebef" }, rectRadius: 0.04,
    });
    slide.addText(s, {
      x: L + 2.55 + i * 0.82, y: CY + 0.07, w: 0.75, h: 0.27,
      fontSize: 7, fontFace: "Prompt", color: i === 0 ? WHITE : GRAY, align: "center", valign: "middle", bold: i === 0,
    });
  });

  // Kiosk grid (14 kiosks)
  const GRID_Y = CY + 0.5;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 7; col++) {
      const kx = L + 0.15 + col * 0.8;
      const ky = GRID_Y + row * 0.65;
      const isOnline = !((row === 1 && col === 5) || (row === 0 && col === 3));
      const statusColor = isOnline ? GREEN : RED;
      slide.addShape(pres.ShapeType.roundRect, {
        x: kx, y: ky, w: 0.72, h: 0.55,
        fill: { color: LIGHT_BG }, rectRadius: 0.06,
        line: { color: "e0e3e8", width: 0.5 },
      });
      slide.addText("🖥️", {
        x: kx, y: ky + 0.02, w: 0.72, h: 0.25,
        fontSize: 12, align: "center",
      });
      slide.addText(`K-${String(row * 7 + col + 1).padStart(2, "0")}`, {
        x: kx, y: ky + 0.25, w: 0.72, h: 0.15,
        fontSize: 6.5, fontFace: "Prompt", color: NAVY, align: "center", bold: true,
      });
      slide.addShape(pres.ShapeType.ellipse, {
        x: kx + 0.55, y: ky + 0.04, w: 0.1, h: 0.1,
        fill: { color: statusColor },
      });
    }
  }
  // Count badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + 0.15, y: GRID_Y + 1.35, w: 1.4, h: 0.26,
    fill: { color: PURPLE }, rectRadius: 0.04,
  });
  slide.addText("14 ตู้ · ทุกสถานี", {
    x: L + 0.15, y: GRID_Y + 1.35, w: 1.4, h: 0.26,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // -- Ads Manager frame (Super Admin) --
  const ADS_Y = 5.0;
  const ADS_H = 2.1;
  slide.addShape(pres.ShapeType.roundRect, {
    x: L, y: ADS_Y, w: HALF_W, h: ADS_H,
    fill: { color: WHITE }, rectRadius: 0.1,
    line: { color: "d0d5dd", width: 1 },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.2 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: L + 0.01, y: ADS_Y + 0.01, w: HALF_W - 0.02, h: 0.32,
    fill: { color: "e8ebef" },
  });
  ["ff5f57", "ffbd2e", "28c840"].forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: L + 0.12 + i * 0.16, y: ADS_Y + 0.09, w: 0.13, h: 0.13,
      fill: { color: c },
    });
  });
  slide.addText("Ads & Popup — Banner Management", {
    x: L + 0.6, y: ADS_Y + 0.01, w: 4, h: 0.32,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: NAVY, valign: "middle",
  });

  // Ads content
  const ACY = ADS_Y + 0.42;
  // Target dropdown
  slide.addText("Target Station:", {
    x: L + 0.15, y: ACY + 0.05, w: 1.2, h: 0.28,
    fontSize: 8.5, fontFace: "Prompt", color: GRAY, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + 1.35, y: ACY + 0.05, w: 2.0, h: 0.3,
    fill: { color: LIGHT_BG }, line: { color: PURPLE, width: 1 }, rectRadius: 0.04,
  });
  slide.addText("All Stations ▼", {
    x: L + 1.45, y: ACY + 0.05, w: 1.8, h: 0.3,
    fontSize: 9, fontFace: "Prompt", bold: true, color: PURPLE, valign: "middle",
  });
  // Check badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: L + 3.5, y: ACY + 0.07, w: 1.3, h: 0.26,
    fill: { color: "e8f5e9" }, rectRadius: 0.04,
  });
  slide.addText("✓ เลือกได้อิสระ", {
    x: L + 3.5, y: ACY + 0.07, w: 1.3, h: 0.26,
    fontSize: 8, fontFace: "Prompt", bold: true, color: GREEN, align: "center", valign: "middle",
  });

  // Ad table rows
  const ads = [
    { name: "Summer Campaign", target: "ทุกสถานี", status: "Active", color: GREEN },
    { name: "Train Delay Alert", target: "กรุงเทพ", status: "Active", color: GREEN },
    { name: "Hua Hin Promo", target: "หัวหิน", status: "Draft", color: ORANGE },
  ];
  // Table header
  slide.addShape(pres.ShapeType.rect, {
    x: L + 0.15, y: ACY + 0.45, w: HALF_W - 0.3, h: 0.26,
    fill: { color: NAVY },
  });
  slide.addText("Campaign", {
    x: L + 0.2, y: ACY + 0.45, w: 2, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addText("Target", {
    x: L + 2.3, y: ACY + 0.45, w: 1.5, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addText("Status", {
    x: L + 4.0, y: ACY + 0.45, w: 1, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  // Table rows
  ads.forEach((ad, i) => {
    const ry = ACY + 0.73 + i * 0.3;
    slide.addShape(pres.ShapeType.rect, {
      x: L + 0.15, y: ry, w: HALF_W - 0.3, h: 0.28,
      fill: { color: i % 2 === 0 ? LIGHT_BG : WHITE },
    });
    slide.addText(ad.name, {
      x: L + 0.2, y: ry, w: 2, h: 0.28,
      fontSize: 8, fontFace: "Prompt", color: NAVY, valign: "middle",
    });
    slide.addText(ad.target, {
      x: L + 2.3, y: ry, w: 1.5, h: 0.28,
      fontSize: 8, fontFace: "Prompt", color: GRAY, valign: "middle",
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: L + 4.05, y: ry + 0.04, w: 0.65, h: 0.2,
      fill: { color: ad.color === GREEN ? "e8f5e9" : WARM_ICON_BG }, rectRadius: 0.03,
    });
    slide.addText(ad.status, {
      x: L + 4.05, y: ry + 0.04, w: 0.65, h: 0.2,
      fontSize: 7, fontFace: "Prompt", bold: true, color: ad.color, align: "center", valign: "middle",
    });
  });

  // ============================================================
  //  RIGHT: Station Admin
  // ============================================================
  const R = RIGHT_X;

  // -- Role header badge --
  slide.addShape(pres.ShapeType.roundRect, {
    x: R, y: 1.5, w: HALF_W, h: 0.55,
    fill: { color: "1565c0" }, rectRadius: 0.08,
    shadow: { type: "outer", blur: 3, offset: 1, color: "333333", opacity: 0.15 },
  });
  slide.addText("🏢  Station Admin", {
    x: R + 0.15, y: 1.5, w: 3, h: 0.55,
    fontSize: 16, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + HALF_W - 2.0, y: 1.6, w: 1.8, h: 0.35,
    fill: { color: "FFFFFF", transparency: 80 }, rectRadius: 0.04,
  });
  slide.addText("bangkok / 1234", {
    x: R + HALF_W - 2.0, y: 1.6, w: 1.8, h: 0.35,
    fontSize: 10, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // -- Kiosk MA browser frame (Station Admin) --
  slide.addShape(pres.ShapeType.roundRect, {
    x: R, y: MA_Y, w: HALF_W, h: FRAME_H,
    fill: { color: WHITE }, rectRadius: 0.1,
    line: { color: "d0d5dd", width: 1 },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.2 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: R + 0.01, y: MA_Y + 0.01, w: HALF_W - 0.02, h: 0.32,
    fill: { color: "e8ebef" },
  });
  ["ff5f57", "ffbd2e", "28c840"].forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: R + 0.12 + i * 0.16, y: MA_Y + 0.09, w: 0.13, h: 0.13,
      fill: { color: c },
    });
  });
  slide.addText("Kiosk MA — Maintenance & Availability", {
    x: R + 0.6, y: MA_Y + 0.01, w: 4, h: 0.32,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: NAVY, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + HALF_W - 1.3, y: MA_Y + 0.06, w: 1.1, h: 0.22,
    fill: { color: "1565c0" }, rectRadius: 0.04,
  });
  slide.addText("KIOSK ADMIN", {
    x: R + HALF_W - 1.3, y: MA_Y + 0.06, w: 1.1, h: 0.22,
    fontSize: 7, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // Station badge (locked — no dropdown)
  const RCY = MA_Y + 0.42;
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 0.15, y: RCY + 0.05, w: 2.8, h: 0.32,
    fill: { color: "e3f2fd" }, line: { color: "1565c0", width: 1 }, rectRadius: 0.04,
  });
  slide.addText("🏷️ สถานีกลางกรุงเทพ", {
    x: R + 0.25, y: RCY + 0.05, w: 2.2, h: 0.32,
    fontSize: 9, fontFace: "Prompt", color: "1565c0", valign: "middle", bold: true,
  });
  // Lock icon
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 3.1, y: RCY + 0.07, w: 0.85, h: 0.27,
    fill: { color: "fff3e0" }, rectRadius: 0.04,
  });
  slide.addText("🔒 Fixed", {
    x: R + 3.1, y: RCY + 0.07, w: 0.85, h: 0.27,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: DEEP_ORANGE, align: "center", valign: "middle",
  });

  // Kiosk grid (4 kiosks only — one row)
  const RGRID_Y = RCY + 0.5;
  for (let col = 0; col < 4; col++) {
    const kx = R + 0.15 + col * 1.0;
    const isOnline = col !== 2;
    slide.addShape(pres.ShapeType.roundRect, {
      x: kx, y: RGRID_Y, w: 0.88, h: 0.65,
      fill: { color: LIGHT_BG }, rectRadius: 0.06,
      line: { color: "e0e3e8", width: 0.5 },
    });
    slide.addText("🖥️", {
      x: kx, y: RGRID_Y + 0.02, w: 0.88, h: 0.3,
      fontSize: 14, align: "center",
    });
    slide.addText(`BKK-${String(col + 1).padStart(2, "0")}`, {
      x: kx, y: RGRID_Y + 0.32, w: 0.88, h: 0.18,
      fontSize: 7.5, fontFace: "Prompt", color: NAVY, align: "center", bold: true,
    });
    slide.addShape(pres.ShapeType.ellipse, {
      x: kx + 0.68, y: RGRID_Y + 0.05, w: 0.12, h: 0.12,
      fill: { color: isOnline ? GREEN : RED },
    });
  }
  // Empty area hint
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 4.3, y: RGRID_Y + 0.05, w: 1.5, h: 0.55,
    fill: { color: "f5f5f5" }, rectRadius: 0.06,
    line: { color: "e0e3e8", width: 0.5, dashType: "dash" },
  });
  slide.addText("สถานีอื่น\nไม่แสดง", {
    x: R + 4.3, y: RGRID_Y + 0.05, w: 1.5, h: 0.55,
    fontSize: 8, fontFace: "Prompt", color: LIGHT_GRAY, align: "center", valign: "middle",
  });
  // Count badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 0.15, y: RGRID_Y + 0.75, w: 1.8, h: 0.26,
    fill: { color: "1565c0" }, rectRadius: 0.04,
  });
  slide.addText("4 ตู้ · เฉพาะกรุงเทพ", {
    x: R + 0.15, y: RGRID_Y + 0.75, w: 1.8, h: 0.26,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
  });

  // -- Ads Manager frame (Station Admin) --
  slide.addShape(pres.ShapeType.roundRect, {
    x: R, y: ADS_Y, w: HALF_W, h: ADS_H,
    fill: { color: WHITE }, rectRadius: 0.1,
    line: { color: "d0d5dd", width: 1 },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.2 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: R + 0.01, y: ADS_Y + 0.01, w: HALF_W - 0.02, h: 0.32,
    fill: { color: "e8ebef" },
  });
  ["ff5f57", "ffbd2e", "28c840"].forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: R + 0.12 + i * 0.16, y: ADS_Y + 0.09, w: 0.13, h: 0.13,
      fill: { color: c },
    });
  });
  slide.addText("Ads & Popup — Banner Management", {
    x: R + 0.6, y: ADS_Y + 0.01, w: 4, h: 0.32,
    fontSize: 8.5, fontFace: "Prompt", bold: true, color: NAVY, valign: "middle",
  });

  // Ads content — Station Admin (locked)
  const RACY = ADS_Y + 0.42;
  slide.addText("Target Station:", {
    x: R + 0.15, y: RACY + 0.05, w: 1.2, h: 0.28,
    fontSize: 8.5, fontFace: "Prompt", color: GRAY, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 1.35, y: RACY + 0.05, w: 2.0, h: 0.3,
    fill: { color: "fff3e0" }, line: { color: DEEP_ORANGE, width: 1 }, rectRadius: 0.04,
  });
  slide.addText("🔒 กรุงเทพ", {
    x: R + 1.45, y: RACY + 0.05, w: 1.8, h: 0.3,
    fontSize: 9, fontFace: "Prompt", bold: true, color: DEEP_ORANGE, valign: "middle",
  });
  // Lock badge
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 3.5, y: RACY + 0.07, w: 1.5, h: 0.26,
    fill: { color: "fce4ec" }, rectRadius: 0.04,
  });
  slide.addText("🔒 Targeting Lock", {
    x: R + 3.5, y: RACY + 0.07, w: 1.5, h: 0.26,
    fontSize: 8, fontFace: "Prompt", bold: true, color: RED, align: "center", valign: "middle",
  });

  // Filtered ad table rows
  const rAds = [
    { name: "Summer Campaign", target: "ทุกสถานี", status: "Active", color: GREEN, note: "(includes กทม)" },
    { name: "Train Delay Alert", target: "กรุงเทพ", status: "Active", color: GREEN, note: "" },
  ];
  slide.addShape(pres.ShapeType.rect, {
    x: R + 0.15, y: RACY + 0.45, w: HALF_W - 0.3, h: 0.26,
    fill: { color: NAVY },
  });
  slide.addText("Campaign", {
    x: R + 0.2, y: RACY + 0.45, w: 2, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addText("Target", {
    x: R + 2.3, y: RACY + 0.45, w: 1.5, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  slide.addText("Status", {
    x: R + 4.0, y: RACY + 0.45, w: 1, h: 0.26,
    fontSize: 7.5, fontFace: "Prompt", bold: true, color: WHITE, valign: "middle",
  });
  rAds.forEach((ad, i) => {
    const ry = RACY + 0.73 + i * 0.3;
    slide.addShape(pres.ShapeType.rect, {
      x: R + 0.15, y: ry, w: HALF_W - 0.3, h: 0.28,
      fill: { color: i % 2 === 0 ? LIGHT_BG : WHITE },
    });
    slide.addText(ad.name, {
      x: R + 0.2, y: ry, w: 2, h: 0.28,
      fontSize: 8, fontFace: "Prompt", color: NAVY, valign: "middle",
    });
    slide.addText(ad.target, {
      x: R + 2.3, y: ry, w: 1.5, h: 0.28,
      fontSize: 8, fontFace: "Prompt", color: GRAY, valign: "middle",
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: R + 4.05, y: ry + 0.04, w: 0.65, h: 0.2,
      fill: { color: "e8f5e9" }, rectRadius: 0.03,
    });
    slide.addText(ad.status, {
      x: R + 4.05, y: ry + 0.04, w: 0.65, h: 0.2,
      fontSize: 7, fontFace: "Prompt", bold: true, color: GREEN, align: "center", valign: "middle",
    });
  });
  // "Hua Hin hidden" row
  slide.addShape(pres.ShapeType.rect, {
    x: R + 0.15, y: RACY + 1.33, w: HALF_W - 0.3, h: 0.28,
    fill: { color: "f5f5f5" },
  });
  slide.addText("Hua Hin Promo", {
    x: R + 0.2, y: RACY + 1.33, w: 2, h: 0.28,
    fontSize: 8, fontFace: "Prompt", color: LIGHT_GRAY, valign: "middle",
    strike: true,
  });
  slide.addText("หัวหิน", {
    x: R + 2.3, y: RACY + 1.33, w: 1.5, h: 0.28,
    fontSize: 8, fontFace: "Prompt", color: LIGHT_GRAY, valign: "middle",
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: R + 4.05, y: RACY + 1.37, w: 0.65, h: 0.2,
    fill: { color: "f5f5f5" }, rectRadius: 0.03,
  });
  slide.addText("Hidden", {
    x: R + 4.05, y: RACY + 1.37, w: 0.65, h: 0.2,
    fontSize: 7, fontFace: "Prompt", color: LIGHT_GRAY, align: "center", valign: "middle",
  });
})();

// === Generate ===
const outPath = path.join(__dirname, "kiosk-admin-pain-solution.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`✅ Created: ${outPath}`);
}).catch((err) => {
  console.error("❌ Error:", err);
});
