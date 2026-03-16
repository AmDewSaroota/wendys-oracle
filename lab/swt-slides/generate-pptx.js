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
const GOLD = "c5973e";
const PURPLE = "8e44ad";

// === Presentation settings ===
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "NDF";
pres.company = "NDF";
pres.subject = "SWT Mobile Web App";

const TOTAL = 12;

// === Helper: Add title bar decoration ===
function addSlideHeader(slide, title, subtitle, slideNum) {
  slide.addShape(pres.ShapeType.rect, {
    x: 0.5, y: 0.35, w: 0.08, h: 0.55,
    fill: { color: BLUE }, rectRadius: 0.04,
  });
  slide.addText(title, {
    x: 0.72, y: 0.3, w: 10, h: 0.6,
    fontSize: 28, fontFace: "Prompt", bold: true, color: NAVY,
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.14 + 0.4, h: 0.35,
    fill: { color: NAVY }, rectRadius: 0.04,
  });
  slide.addText(subtitle, {
    x: 0.72, y: 0.95, w: subtitle.length * 0.14 + 0.4, h: 0.35,
    fontSize: 11, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  slide.addShape(pres.ShapeType.rtTriangle, {
    x: 12.13, y: 0, w: 1.2, h: 1.2,
    fill: { color: BLUE }, rotate: 90, line: { color: BLUE, width: 0 },
  });
  slide.addText(`${slideNum} / ${TOTAL}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 10, fontFace: "Prompt", color: LIGHT_GRAY, align: "right",
  });
  slide.background = { fill: BG };
}

// === Helper: Pain card ===
function addPainCard(slide, x, y, w, icon, title, desc, source) {
  const h = source ? 1.2 : 1.05;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.05, h: h - 0.1, fill: { color: RED },
  });
  slide.addText(icon, {
    x: x + 0.15, y: y + 0.12, w: 0.45, h: 0.45,
    fontSize: 20, align: "center", valign: "middle",
  });
  slide.addText(title, {
    x: x + 0.65, y: y + 0.08, w: w - 0.85, h: 0.3,
    fontSize: 12, fontFace: "Prompt", bold: true, color: NAVY,
  });
  slide.addText(desc, {
    x: x + 0.65, y: y + 0.35, w: w - 0.85, h: 0.45,
    fontSize: 9.5, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.3, wrap: true,
  });
  if (source) {
    slide.addText(source, {
      x: x + 0.65, y: y + 0.82, w: w - 0.85, h: 0.25,
      fontSize: 8.5, fontFace: "Prompt", color: RED, bold: true,
    });
  }
}

// === Helper: Solution card (compact for overview) ===
function addSolCard(slide, x, y, w, icon, title, desc) {
  const h = 0.7;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 3, offset: 1, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.08,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.05, h: h - 0.1, fill: { color: BLUE },
  });
  slide.addText(icon, {
    x: x + 0.12, y: y + 0.1, w: 0.4, h: 0.4,
    fontSize: 18, align: "center", valign: "middle",
  });
  slide.addText(title, {
    x: x + 0.55, y: y + 0.06, w: w - 0.7, h: 0.28,
    fontSize: 11, fontFace: "Prompt", bold: true, color: BLUE,
  });
  slide.addText(desc, {
    x: x + 0.55, y: y + 0.33, w: w - 0.7, h: 0.3,
    fontSize: 9, fontFace: "Prompt", color: GRAY, wrap: true,
  });
}

// === Helper: mini card inside mockups ===
function miniCard(slide, x, y, w, h, title, desc, borderColor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: h || 0.45,
    fill: { color: LIGHT_BG }, rectRadius: 0.04,
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

// === Helper: Feature detail — left side bullet points ===
function addFeatureBullet(slide, x, y, icon, text, color) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w: 5.6, h: 0.55,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 2, offset: 1, color: "dddddd", opacity: 0.25 },
    rectRadius: 0.06,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.04, w: 0.05, h: 0.47, fill: { color },
  });
  slide.addText(icon, {
    x: x + 0.15, y: y + 0.05, w: 0.4, h: 0.4,
    fontSize: 16, align: "center", valign: "middle",
  });
  slide.addText(text, {
    x: x + 0.6, y: y + 0.05, w: 4.85, h: 0.45,
    fontSize: 11, fontFace: "Prompt", color: NAVY, valign: "middle", wrap: true,
  });
}

// === Helper: Phone mockup frame (right side, larger for feature slides) ===
function addFeaturePhone(slide, x, y, pw, ph, headerText, headerColor, contentFn) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w: pw, h: ph,
    fill: { color: WHITE },
    line: { color: NAVY, width: 2.5 },
    rectRadius: 0.3,
    shadow: { type: "outer", blur: 8, offset: 3, color: NAVY, opacity: 0.15 },
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + (pw - 1.3) / 2, y, w: 1.3, h: 0.25,
    fill: { color: NAVY }, rectRadius: 0.08,
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.18, y: y + 0.4, w: pw - 0.36, h: 0.4,
    fill: { color: headerColor }, rectRadius: 0.08,
  });
  slide.addText(headerText, {
    x: x + 0.18, y: y + 0.4, w: pw - 0.36, h: 0.4,
    fontSize: 11, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  contentFn(slide, x + 0.18, y + 0.95, pw - 0.36, ph - 1.15);
}

// === Helper: Browser frame ===
function addBrowserFrame(slide, x, y, w, h, title, headerColor, contentFn, label, sublabel) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    line: { color: "cccccc", width: 1.5 },
    rectRadius: 0.12,
    shadow: { type: "outer", blur: 5, offset: 2, color: "999999", opacity: 0.15 },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: x + 0.01, y: y + 0.01, w: w - 0.02, h: 0.35,
    fill: { color: "e8ebef" },
  });
  const dots = ["ff5f57", "ffbd2e", "28c840"];
  dots.forEach((c, i) => {
    slide.addShape(pres.ShapeType.ellipse, {
      x: x + 0.12 + i * 0.18, y: y + 0.1, w: 0.14, h: 0.14,
      fill: { color: c },
    });
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.7, y: y + 0.07, w: w - 1.0, h: 0.22,
    fill: { color: WHITE }, line: { color: "cccccc", width: 0.5 }, rectRadius: 0.04,
  });
  slide.addText(title, {
    x: x + 0.75, y: y + 0.07, w: w - 1.1, h: 0.22,
    fontSize: 6.5, fontFace: "Prompt", color: GRAY, valign: "middle",
  });
  contentFn(slide, x + 0.1, y + 0.4, w - 0.2, h - 0.5, headerColor);
  if (label) {
    slide.addText(label, {
      x, y: y + h + 0.08, w, h: 0.25,
      fontSize: 10, fontFace: "Prompt", bold: true, color: NAVY, align: "center",
    });
  }
  if (sublabel) {
    slide.addText(sublabel, {
      x, y: y + h + 0.3, w, h: 0.2,
      fontSize: 8, fontFace: "Prompt", color: BLUE, align: "center",
    });
  }
}

// === Helper: Phone card (small) ===
function addPhoneCard(slide, x, y, w, title, desc, borderColor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.7,
    fill: { color: LIGHT_BG }, rectRadius: 0.06,
  });
  slide.addShape(pres.ShapeType.rect, {
    x, y: y + 0.05, w: 0.04, h: 0.6, fill: { color: borderColor },
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
// SLIDE 1: Pain Points
// ==========================================
const s1 = pres.addSlide();
addSlideHeader(s1, "Pain Points", "Traveler Experience Gaps", 1);

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
// SLIDE 2: Solution Overview (index)
// ==========================================
const s2 = pres.addSlide();
addSlideHeader(s2, "The Solution", "7 Core Features", 2);

const solData = [
  ["🔀", "Smart Routing", "เส้นทางตรง + เชื่อมต่อผ่าน hub อัตโนมัติ"],
  ["🎫", "Availability-First", "แสดง \"ว่าง/เต็ม\" ตั้งแต่ค้นหา"],
  ["⏱️", "Real-time Status", "ตำแหน่งจริง + ความตรงเวลา"],
  ["📌", "Tourism ในแอปเดียว", "ทัวร์ตามเส้นทาง พร้อมจอง"],
  ["🤖", "RailBot AI", "ถามได้ตลอดเส้นทาง TH/EN"],
  ["🏆", "Loyalty System", "สะสมแต้ม → ส่วนลด / อัพเกรด"],
  ["🚉", "Station Map", "SVG Map + คำนวณเวลาเดิน"],
];

solData.forEach((s, i) => {
  addSolCard(s2, 0.5, 1.5 + i * 0.78, 8.5, s[0], s[1], s[2]);
});

// Phone mockup on right (Home screen overview)
addFeaturePhone(s2, 9.6, 1.3, 3.0, 5.8, "🚂 SWT — Smart Tourism", NAVY,
  (slide, cx, cy, cw) => {
    const icons = [
      { e: "🎫", l: "จองตั๋ว" }, { e: "📋", l: "ตาราง" },
      { e: "🏖️", l: "ทัวร์" }, { e: "🏆", l: "รางวัล" },
    ];
    icons.forEach((ic, i) => {
      const ix = cx + i * 0.62;
      slide.addShape(pres.ShapeType.roundRect, {
        x: ix, y: cy, w: 0.55, h: 0.55,
        fill: { color: "eef4fb" }, rectRadius: 0.06,
      });
      slide.addText(ic.e, {
        x: ix, y: cy, w: 0.55, h: 0.35,
        fontSize: 14, align: "center", valign: "middle",
      });
      slide.addText(ic.l, {
        x: ix - 0.05, y: cy + 0.33, w: 0.65, h: 0.2,
        fontSize: 6, fontFace: "Prompt", color: NAVY, align: "center",
      });
    });
    addPhoneCard(slide, cx, cy + 0.7, cw, "🔀 กรุงเทพ → เชียงใหม่", "ด่วนพิเศษ #9 · ฿941 · 34 ที่ว่าง", BLUE);
    addPhoneCard(slide, cx, cy + 1.55, cw, "🏖️ ทัวร์หัวหิน — 1 วัน", "฿890 · ⭐ 4.8", ORANGE);
    addPhoneCard(slide, cx, cy + 2.4, cw, "🤖 RailBot พร้อมช่วยเหลือ", "ถามตาราง โปรโมชัน ทัวร์ 24 ชม.", GREEN);
    const navItems = ["🚉 แผนที่", "📊 สถิติ", "🔔 แจ้งเตือน"];
    navItems.forEach((n, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + i * 0.87, y: cy + 3.35, w: 0.8, h: 0.3,
        fill: { color: BG }, rectRadius: 0.04,
      });
      slide.addText(n, {
        x: cx + i * 0.87, y: cy + 3.35, w: 0.8, h: 0.3,
        fontSize: 6.5, fontFace: "Prompt", color: NAVY, align: "center", valign: "middle",
      });
    });
  }
);

// ==========================================
// SLIDE 3: Smart Routing
// ==========================================
const s3 = pres.addSlide();
addSlideHeader(s3, "Smart Routing", "เส้นทางอัจฉริยะ + เชื่อมต่ออัตโนมัติ", 3);

// Left side — description + bullets
s3.addText("ค้นหาเส้นทางรถไฟทั้งตรงและเชื่อมต่อ\nระบบคำนวณเส้นทางที่ดีที่สุดผ่าน Junction Hub โดยอัตโนมัติ", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s3, 0.5, 2.45, "🔀", "เส้นทางตรง + เชื่อมต่อผ่าน Hub (หาดใหญ่, ทุ่งสง, บ้านภาชี)", BLUE);
addFeatureBullet(s3, 0.5, 3.15, "⏱️", "แสดงเวลารอต่อรถที่จุดเปลี่ยนขบวน (Connection Time)", TEAL);
addFeatureBullet(s3, 0.5, 3.85, "💰", "เปรียบเทียบราคา + เวลาเดินทางทุกเส้นทางที่เป็นไปได้", ORANGE);
addFeatureBullet(s3, 0.5, 4.55, "🗺️", "แสดงแผนที่เส้นทางพร้อมจุดจอดทั้งหมด", GREEN);

// Pain vs Solution comparison at bottom
s3.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s3.addText("❌ ปัจจุบัน\nต้องค้นหาจุดต่อเองทีละสาย", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s3.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s3.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s3.addText("✅ SWT Platform\nระบบแนะนำเชื่อมต่ออัตโนมัติ", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Route search results
addFeaturePhone(s3, 7.5, 1.3, 3.5, 5.8, "🔀 ค้นหาเส้นทาง", BLUE,
  (slide, cx, cy, cw) => {
    // Search bar
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: cw, h: 0.85,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("จาก: กรุงเทพ\nถึง: สุราษฎร์ธานี\nวันที่: 28 ก.พ. 2569", {
      x: cx + 0.08, y: cy + 0.05, w: cw - 0.16, h: 0.75,
      fontSize: 8, fontFace: "Prompt", color: NAVY, lineSpacingMultiple: 1.3,
    });

    // Result 1 — Direct
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 1.0, w: cw, h: 1.0,
      fill: { color: WHITE }, rectRadius: 0.06,
      line: { color: BLUE, width: 1 },
    });
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy + 1.03, w: 0.05, h: 0.94, fill: { color: BLUE },
    });
    slide.addText("🚄 ด่วนพิเศษ #39 — ตรง", {
      x: cx + 0.12, y: cy + 1.05, w: cw - 0.2, h: 0.25,
      fontSize: 9, fontFace: "Prompt", bold: true, color: NAVY,
    });
    slide.addText("17:35 → 05:10 (+1)  ·  11 ชม. 35 นาที", {
      x: cx + 0.12, y: cy + 1.3, w: cw - 0.2, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: GRAY,
    });
    slide.addText("฿642  ·  ชั้น 2 นอน  ·  ✅ 18 ที่ว่าง", {
      x: cx + 0.12, y: cy + 1.5, w: cw - 0.2, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: BLUE, bold: true,
    });
    slide.addText("⏱️ ตรงเวลา 78%", {
      x: cx + 0.12, y: cy + 1.7, w: cw - 0.2, h: 0.2,
      fontSize: 7, fontFace: "Prompt", color: TEAL,
    });

    // Result 2 — Connection
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 2.15, w: cw, h: 1.2,
      fill: { color: WHITE }, rectRadius: 0.06,
      line: { color: ORANGE, width: 1 },
    });
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy + 2.18, w: 0.05, h: 1.14, fill: { color: ORANGE },
    });
    slide.addText("🔀 เชื่อมต่อผ่าน ชุมพร", {
      x: cx + 0.12, y: cy + 2.2, w: cw - 0.2, h: 0.25,
      fontSize: 9, fontFace: "Prompt", bold: true, color: NAVY,
    });
    slide.addText("#171 กรุงเทพ→ชุมพร  ·  7 ชม. 20 นาที", {
      x: cx + 0.12, y: cy + 2.45, w: cw - 0.2, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: GRAY,
    });
    slide.addText("⏳ รอต่อรถ 1 ชม. 15 นาที ที่ชุมพร", {
      x: cx + 0.12, y: cy + 2.65, w: cw - 0.2, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: ORANGE, bold: true,
    });
    slide.addText("#175 ชุมพร→สุราษฎร์ฯ  ·  2 ชม. 45 นาที", {
      x: cx + 0.12, y: cy + 2.85, w: cw - 0.2, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: GRAY,
    });
    slide.addText("฿498 รวม  ·  11 ชม. 20 นาที (รวมรอ)", {
      x: cx + 0.12, y: cy + 3.05, w: cw - 0.2, h: 0.2,
      fontSize: 7, fontFace: "Prompt", color: TEAL,
    });

    // Route map mini
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 3.5, w: cw, h: 0.65,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("🗺️ กรุงเทพ → บ้านภาชี → ชุมพร → สุราษฎร์ฯ", {
      x: cx + 0.08, y: cy + 3.55, w: cw - 0.16, h: 0.55,
      fontSize: 7.5, fontFace: "Prompt", color: NAVY, valign: "middle",
    });
  }
);

// ==========================================
// SLIDE 4: Availability-First
// ==========================================
const s4 = pres.addSlide();
addSlideHeader(s4, "Availability-First", "รู้ที่นั่งว่างทันที — ไม่ต้องกรอกข้อมูลก่อน", 4);

s4.addText("เห็นสถานะ \"ว่าง / เต็ม\" ตั้งแต่ตอนค้นหา\nเลือกที่นั่งแบบ Interactive บนแผนผังตู้โดยสาร", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s4, 0.5, 2.45, "🎫", "แสดงจำนวนที่ว่างทันทีตั้งแต่หน้าผลค้นหา", BLUE);
addFeatureBullet(s4, 0.5, 3.15, "💺", "เลือกที่นั่ง Interactive — คลิกที่นั่งบนแผนผัง Carriage", TEAL);
addFeatureBullet(s4, 0.5, 3.85, "🛏️", "รถนอน: เลือกเตียงบน/ล่าง ตู้หญิง/ทั่วไป แสดงชัดเจน", ORANGE);
addFeatureBullet(s4, 0.5, 4.55, "⚡", "จองได้ทันที ไม่ต้องกรอกชื่อก่อนถึงจะเห็นที่ว่าง", GREEN);

s4.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s4.addText("❌ ปัจจุบัน\nกรอกข้อมูลก่อน → ถึงรู้ว่าเต็ม", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s4.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s4.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s4.addText("✅ SWT Platform\nเห็นที่ว่างทันที → เลือก → จอง", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Seat selection
addFeaturePhone(s4, 7.5, 1.3, 3.5, 5.8, "💺 เลือกที่นั่ง", TEAL,
  (slide, cx, cy, cw) => {
    // Train info
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: cw, h: 0.55,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("🚄 ด่วนพิเศษ #9  ·  กรุงเทพ → เชียงใหม่\nชั้น 2 นั่ง  ·  ✅ 34 ที่ว่าง จาก 72", {
      x: cx + 0.08, y: cy + 0.03, w: cw - 0.16, h: 0.5,
      fontSize: 7.5, fontFace: "Prompt", color: NAVY, lineSpacingMultiple: 1.3,
    });

    // Carriage selector
    slide.addText("ตู้โดยสาร:", {
      x: cx, y: cy + 0.65, w: 0.7, h: 0.25,
      fontSize: 8, fontFace: "Prompt", bold: true, color: NAVY,
    });
    const cars = ["4", "5", "6", "7"];
    cars.forEach((c, i) => {
      const sel = i === 1;
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + 0.7 + i * 0.6, y: cy + 0.63, w: 0.5, h: 0.28,
        fill: { color: sel ? TEAL : LIGHT_BG },
        rectRadius: 0.04,
      });
      slide.addText(c, {
        x: cx + 0.7 + i * 0.6, y: cy + 0.63, w: 0.5, h: 0.28,
        fontSize: 9, fontFace: "Prompt", bold: true,
        color: sel ? WHITE : NAVY, align: "center", valign: "middle",
      });
    });

    // Seat grid — 4 columns (window-aisle | aisle-window)
    const seatY = cy + 1.05;
    slide.addText("หน้าต่าง     ทางเดิน     หน้าต่าง", {
      x: cx, y: seatY, w: cw, h: 0.2,
      fontSize: 6, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
    });
    const seatW = 0.42, seatH = 0.32, gap = 0.08;
    const colStart = cx + (cw - (4 * seatW + 3 * gap + 0.3)) / 2;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const sx = colStart + col * (seatW + gap) + (col >= 2 ? 0.3 : 0);
        const sy = seatY + 0.25 + row * (seatH + 0.06);
        const seatNum = row * 4 + col + 1;
        const taken = [2, 3, 5, 8, 9, 13, 15, 19, 21, 22].includes(seatNum);
        const selected = seatNum === 10;
        const color = selected ? BLUE : taken ? "dddddd" : "e8f5e9";
        const textColor = selected ? WHITE : taken ? LIGHT_GRAY : GREEN;
        slide.addShape(pres.ShapeType.roundRect, {
          x: sx, y: sy, w: seatW, h: seatH,
          fill: { color },
          rectRadius: 0.04,
          line: { color: selected ? BLUE : taken ? "cccccc" : "b8dfb8", width: 0.5 },
        });
        slide.addText(`${seatNum}`, {
          x: sx, y: sy, w: seatW, h: seatH,
          fontSize: 7, fontFace: "Prompt", bold: true,
          color: textColor, align: "center", valign: "middle",
        });
      }
    }

    // Legend
    const legY = seatY + 0.25 + 6 * (seatH + 0.06) + 0.1;
    const legends = [
      { c: "e8f5e9", t: "ว่าง" }, { c: "dddddd", t: "ไม่ว่าง" }, { c: BLUE, t: "เลือกแล้ว" },
    ];
    legends.forEach((l, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + i * 1.0, y: legY, w: 0.2, h: 0.2,
        fill: { color: l.c }, rectRadius: 0.03,
      });
      slide.addText(l.t, {
        x: cx + i * 1.0 + 0.25, y: legY, w: 0.65, h: 0.2,
        fontSize: 7, fontFace: "Prompt", color: GRAY, valign: "middle",
      });
    });

    // Selected info
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: legY + 0.35, w: cw, h: 0.4,
      fill: { color: BLUE }, rectRadius: 0.06,
    });
    slide.addText("ที่นั่ง #10 · ริมหน้าต่าง · ฿941\nยืนยันการจอง →", {
      x: cx + 0.1, y: legY + 0.35, w: cw - 0.2, h: 0.4,
      fontSize: 8, fontFace: "Prompt", color: WHITE, bold: true,
      align: "center", valign: "middle", lineSpacingMultiple: 1.2,
    });
  }
);

// ==========================================
// SLIDE 5: Real-time Status
// ==========================================
const s5 = pres.addSlide();
addSlideHeader(s5, "Real-time Status", "ติดตามขบวนรถแบบ Real-time", 5);

s5.addText("รู้ตำแหน่งจริงของขบวนรถ ความล่าช้า และสถิติตรงเวลา\nวางแผนต่อได้ทันที ไม่ต้องเดาจากตารางเดิม", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s5, 0.5, 2.45, "📍", "ตำแหน่งจริงของขบวนรถบนแผนที่ (GPS Tracking)", BLUE);
addFeatureBullet(s5, 0.5, 3.15, "⏱️", "แสดงเวลาล่าช้าจริง ≠ ตารางเวลาในระบบเดิม", RED);
addFeatureBullet(s5, 0.5, 3.85, "📊", "สถิติตรงเวลาเฉลี่ย (On-time Performance %)", TEAL);
addFeatureBullet(s5, 0.5, 4.55, "🔔", "แจ้งเตือนเมื่อขบวนรถเข้าใกล้สถานีปลายทาง", ORANGE);

s5.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s5.addText("❌ ปัจจุบัน\nแสดงเวลาตามตารางเดิมเท่านั้น", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s5.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s5.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s5.addText("✅ SWT Platform\nตำแหน่งจริง + delay + สถิติ", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Train tracking
addFeaturePhone(s5, 7.5, 1.3, 3.5, 5.8, "⏱️ สถานะขบวนรถ #9", BLUE,
  (slide, cx, cy, cw) => {
    // Status badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: cw, h: 0.45,
      fill: { color: "fff3e0" }, rectRadius: 0.06,
    });
    slide.addText("⚠️ กำลังเดินทาง — ล่าช้า 23 นาที", {
      x: cx + 0.08, y: cy, w: cw - 0.16, h: 0.45,
      fontSize: 9, fontFace: "Prompt", bold: true, color: ORANGE, valign: "middle",
    });

    // Timeline stops
    const stops = [
      { name: "กรุงเทพ (อภิวัฒน์)", time: "18:10", status: "departed", delay: "" },
      { name: "อยุธยา", time: "19:25", status: "departed", delay: "+12 นาที" },
      { name: "นครสวรรค์", time: "21:40", status: "current", delay: "+23 นาที" },
      { name: "พิษณุโลก", time: "00:15", status: "upcoming", delay: "~+25 นาที" },
      { name: "ลำปาง", time: "04:00", status: "upcoming", delay: "" },
      { name: "เชียงใหม่", time: "07:15", status: "upcoming", delay: "" },
    ];
    stops.forEach((s, i) => {
      const sy = cy + 0.6 + i * 0.52;
      const isCurrent = s.status === "current";
      const isPast = s.status === "departed";
      const dotColor = isCurrent ? BLUE : isPast ? GREEN : "cccccc";
      // Line
      if (i < stops.length - 1) {
        slide.addShape(pres.ShapeType.rect, {
          x: cx + 0.18, y: sy + 0.18, w: 0.04, h: 0.5,
          fill: { color: isPast ? GREEN : "e0e0e0" },
        });
      }
      // Dot
      slide.addShape(pres.ShapeType.ellipse, {
        x: cx + 0.08, y: sy + 0.05, w: 0.24, h: 0.24,
        fill: { color: dotColor },
      });
      if (isCurrent) {
        slide.addText("📍", {
          x: cx + 0.08, y: sy + 0.02, w: 0.24, h: 0.24,
          fontSize: 10, align: "center", valign: "middle",
        });
      }
      // Station name
      slide.addText(s.name, {
        x: cx + 0.4, y: sy, w: cw - 0.9, h: 0.2,
        fontSize: isCurrent ? 8.5 : 7.5, fontFace: "Prompt",
        bold: isCurrent, color: isCurrent ? NAVY : isPast ? GRAY : LIGHT_GRAY,
      });
      // Time
      slide.addText(s.time, {
        x: cx + 0.4, y: sy + 0.17, w: 0.7, h: 0.17,
        fontSize: 7, fontFace: "Prompt", color: GRAY,
      });
      // Delay
      if (s.delay) {
        slide.addText(s.delay, {
          x: cx + cw - 1.0, y: sy + 0.02, w: 0.9, h: 0.2,
          fontSize: 7, fontFace: "Prompt", color: ORANGE, bold: true, align: "right",
        });
      }
    });

    // Stats bar at bottom
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 3.8, w: cw, h: 0.45,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("📊 ตรงเวลาเฉลี่ย: 78%  ·  ล่าช้าเฉลี่ย: 18 นาที", {
      x: cx + 0.08, y: cy + 3.8, w: cw - 0.16, h: 0.45,
      fontSize: 7.5, fontFace: "Prompt", color: TEAL, valign: "middle",
    });
  }
);

// ==========================================
// SLIDE 6: Tourism
// ==========================================
const s6 = pres.addSlide();
addSlideHeader(s6, "Tourism ในแอปเดียว", "ทัวร์ตามเส้นทางรถไฟ — จองได้ทันที", 6);

s6.addText("แพ็คเกจท่องเที่ยวตามเส้นทางรถไฟ พร้อมรายละเอียด ราคา รีวิว\nจองรถไฟ + ที่พัก + กิจกรรม ในแอปเดียว", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s6, 0.5, 2.45, "🏖️", "Tour Packages ตามเส้นทาง — หัวหิน, แคว, เชียงใหม่ ฯลฯ", BLUE);
addFeatureBullet(s6, 0.5, 3.15, "💰", "ราคาชัดเจน + รายละเอียดว่าได้อะไรบ้าง + รีวิวจริง", ORANGE);
addFeatureBullet(s6, 0.5, 3.85, "📱", "จองตั๋ว + ทัวร์ในขั้นตอนเดียว ไม่ต้องสลับแอป", GREEN);
addFeatureBullet(s6, 0.5, 4.55, "📍", "สถานที่ท่องเที่ยวตามสถานี — กดดูได้ตลอดเส้นทาง", TEAL);

s6.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s6.addText("❌ ปัจจุบัน\nทัวร์ราคาสูง ไม่แสดงรายละเอียด", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s6.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s6.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s6.addText("✅ SWT Platform\nทัวร์ราคาดี + รีวิว + จองทันที", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Tour packages
addFeaturePhone(s6, 7.5, 1.3, 3.5, 5.8, "🏖️ ทัวร์แนะนำ", ORANGE,
  (slide, cx, cy, cw) => {
    // Tour card 1
    const addTourCard = (yy, name, route, price, rating, days, color) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: yy, w: cw, h: 1.15,
        fill: { color: WHITE }, rectRadius: 0.06,
        line: { color: color, width: 1 },
      });
      slide.addShape(pres.ShapeType.rect, {
        x: cx, y: yy + 0.03, w: 0.05, h: 1.09, fill: { color: color },
      });
      slide.addText(name, {
        x: cx + 0.12, y: yy + 0.05, w: cw - 0.2, h: 0.25,
        fontSize: 10, fontFace: "Prompt", bold: true, color: NAVY,
      });
      slide.addText(route, {
        x: cx + 0.12, y: yy + 0.3, w: cw - 0.2, h: 0.2,
        fontSize: 7, fontFace: "Prompt", color: GRAY,
      });
      slide.addText(`${days}  ·  ⭐ ${rating}`, {
        x: cx + 0.12, y: yy + 0.5, w: cw * 0.55, h: 0.2,
        fontSize: 7.5, fontFace: "Prompt", color: TEAL,
      });
      // Price badge
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + cw - 1.1, y: yy + 0.48, w: 1.0, h: 0.28,
        fill: { color: color }, rectRadius: 0.04,
      });
      slide.addText(price, {
        x: cx + cw - 1.1, y: yy + 0.48, w: 1.0, h: 0.28,
        fontSize: 9, fontFace: "Prompt", bold: true, color: WHITE,
        align: "center", valign: "middle",
      });
      // Details
      slide.addText("ดูรายละเอียด + จอง →", {
        x: cx + 0.12, y: yy + 0.82, w: cw - 0.2, h: 0.25,
        fontSize: 8, fontFace: "Prompt", color: color, bold: true,
      });
    };

    addTourCard(cy, "🏖️ หัวหิน — วันเดียวเที่ยวได้",
      "กรุงเทพ → หัวหิน · ตลาดโต้รุ่ง · เขาตะเกียบ",
      "฿890", "4.8", "1 วัน", ORANGE);

    addTourCard(cy + 1.3, "🌉 สะพานข้ามแม่น้ำแคว",
      "กรุงเทพ → น้ำตก · Death Railway · ถ้ำกระแซ",
      "฿2,490", "4.9", "2 วัน 1 คืน", BLUE);

    addTourCard(cy + 2.6, "🏔️ สายเหนือ — เชียงใหม่",
      "กรุงเทพ → เชียงใหม่ · ดอยสุเทพ · อุโมงค์ขุนตาน",
      "฿3,790", "4.7", "3 วัน 2 คืน", GREEN);

    // Footer
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 3.95, w: cw, h: 0.35,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("📌 รวมตั๋วรถไฟ + ที่พัก + กิจกรรม ในราคาเดียว", {
      x: cx + 0.08, y: cy + 3.95, w: cw - 0.16, h: 0.35,
      fontSize: 7.5, fontFace: "Prompt", color: NAVY, valign: "middle",
    });
  }
);

// ==========================================
// SLIDE 7: RailBot AI
// ==========================================
const s7 = pres.addSlide();
addSlideHeader(s7, "RailBot AI", "ผู้ช่วย AI ตลอดเส้นทาง TH/EN", 7);

s7.addText("AI Chatbot ตอบคำถามทันที ทั้งตาราง โปรโมชัน ทัวร์ สถานี\nรองรับภาษาไทยและอังกฤษ พร้อม Voice ในอนาคต", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s7, 0.5, 2.45, "🤖", "ถามได้ทุกเรื่อง — ตาราง, ที่นั่งว่าง, ทัวร์, สถานี, โปรโมชัน", BLUE);
addFeatureBullet(s7, 0.5, 3.15, "🌐", "รองรับ TH/EN — นักท่องเที่ยวต่างชาติใช้ได้ทันที", TEAL);
addFeatureBullet(s7, 0.5, 3.85, "📍", "Context-Aware — รู้ว่าผู้ใช้อยู่สถานีไหน กำลังนั่งขบวนอะไร", ORANGE);
addFeatureBullet(s7, 0.5, 4.55, "🎫", "สั่งจองตั๋ว ทัวร์ ผ่านแชทได้เลย ไม่ต้องสลับหน้า", GREEN);

s7.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s7.addText("❌ ปัจจุบัน\nโทร 1690 เท่านั้น", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s7.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s7.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s7.addText("✅ SWT Platform\nAI ตอบทันที 24 ชม. TH/EN", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Chat
addFeaturePhone(s7, 7.5, 1.3, 3.5, 5.8, "🤖 RailBot", BLUE,
  (slide, cx, cy, cw) => {
    const chatBot = (yy, text, h) => {
      h = h || 0.42;
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: yy, w: cw * 0.88, h,
        fill: { color: "eef4fb" }, rectRadius: 0.08,
      });
      slide.addText(text, {
        x: cx + 0.08, y: yy + 0.03, w: cw * 0.88 - 0.16, h: h - 0.06,
        fontSize: 7.5, fontFace: "Prompt", color: NAVY, wrap: true, lineSpacingMultiple: 1.2,
      });
    };
    const chatUser = (yy, text) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + cw * 0.12, y: yy, w: cw * 0.88, h: 0.32,
        fill: { color: NAVY }, rectRadius: 0.08,
      });
      slide.addText(text, {
        x: cx + cw * 0.12 + 0.08, y: yy, w: cw * 0.88 - 0.16, h: 0.32,
        fontSize: 7.5, fontFace: "Prompt", color: WHITE, valign: "middle",
      });
    };

    chatBot(cy, "สวัสดีค่ะ! ฉันคือ RailBot 🚂\nถามอะไรก็ได้เลยค่ะ — ตาราง ทัวร์\nโปรโมชัน หรือนำทางในสถานี", 0.58);
    chatUser(cy + 0.68, "ขบวน #9 ไปเชียงใหม่ตรงเวลาไหม?");
    chatBot(cy + 1.1, "📍 ขบวน #9 กำลังเดินทาง\n⏱️ ล่าช้า 12 นาที (ผ่านนครสวรรค์)\n📊 เฉลี่ยตรงเวลา 85%\nคาดถึงเชียงใหม่ 07:27", 0.7);
    chatUser(cy + 1.92, "มีทัวร์ที่เชียงใหม่ไหม?");
    chatBot(cy + 2.34, "🏔️ มีค่ะ!\n1. สายเหนือ 3 วัน — ฿3,790\n   ดอยสุเทพ + อุโมงค์ขุนตาน\n2. เชียงใหม่ 1 Day — ฿1,290\n   วัดพระธาตุ + ถนนคนเดิน\nจะจองเลยไหมคะ? 😊", 0.95);

    // Quick reply buttons
    const replies = ["จองเลย!", "ดูเพิ่ม", "ถามอื่น"];
    replies.forEach((r, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + i * 1.0, y: cy + 3.45, w: 0.9, h: 0.28,
        fill: { color: "eef4fb" },
        line: { color: BLUE, width: 0.5 },
        rectRadius: 0.12,
      });
      slide.addText(r, {
        x: cx + i * 1.0, y: cy + 3.45, w: 0.9, h: 0.28,
        fontSize: 7, fontFace: "Prompt", color: BLUE, bold: true,
        align: "center", valign: "middle",
      });
    });

    // Input bar
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 3.85, w: cw, h: 0.35,
      fill: { color: BG }, rectRadius: 0.15,
    });
    slide.addText("พิมพ์ข้อความ...  🎤", {
      x: cx + 0.1, y: cy + 3.85, w: cw - 0.2, h: 0.35,
      fontSize: 7.5, fontFace: "Prompt", color: LIGHT_GRAY, valign: "middle",
    });
  }
);

// ==========================================
// SLIDE 8: Loyalty System
// ==========================================
const s8 = pres.addSlide();
addSlideHeader(s8, "Loyalty System", "สะสมแต้ม → ส่วนลด · อัพเกรด · ตั๋วฟรี", 8);

s8.addText("ระบบสะสมแต้มจากการใช้บริการรถไฟ ทุก ฿10 = 1 แต้ม\nแลกส่วนลด อัพเกรดที่นั่ง หรือตั๋วฟรี เพิ่มแรงจูงใจกลับมาใช้", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s8, 0.5, 2.45, "🏆", "สะสมแต้ม ฿10 = 1 pt ทุกการจอง — ยิ่งใช้ยิ่งได้", GOLD);
addFeatureBullet(s8, 0.5, 3.15, "🎖️", "Tier: Bronze → Silver → Gold → Platinum สิทธิ์เพิ่มตาม level", BLUE);
addFeatureBullet(s8, 0.5, 3.85, "🎁", "แลกส่วนลดตั๋ว อัพเกรดที่นั่ง ตั๋วฟรี คูปองร้านค้าในสถานี", ORANGE);
addFeatureBullet(s8, 0.5, 4.55, "📊", "Dashboard แสดงแต้มสะสม ประวัติ รางวัลที่แลกได้", GREEN);

s8.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s8.addText("❌ ปัจจุบัน\nไม่มีระบบ Loyalty เลย", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s8.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s8.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s8.addText("✅ SWT Platform\nTier + แต้ม + รางวัล = กลับมาใช้", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Phone mockup: Loyalty dashboard
addFeaturePhone(s8, 7.5, 1.3, 3.5, 5.8, "🏆 My Rewards", GOLD,
  (slide, cx, cy, cw) => {
    // Gold tier badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w: cw, h: 0.85,
      fill: { color: "fdf6e3" }, rectRadius: 0.08,
      line: { color: GOLD, width: 1 },
    });
    slide.addText("🏅", {
      x: cx + 0.1, y: cy + 0.05, w: 0.5, h: 0.5,
      fontSize: 22, align: "center", valign: "middle",
    });
    slide.addText("Gold Member", {
      x: cx + 0.6, y: cy + 0.05, w: cw - 0.7, h: 0.3,
      fontSize: 12, fontFace: "Prompt", bold: true, color: GOLD,
    });
    slide.addText("2,450 แต้ม  ·  อีก 550 ถึง Platinum", {
      x: cx + 0.6, y: cy + 0.35, w: cw - 0.7, h: 0.2,
      fontSize: 7.5, fontFace: "Prompt", color: GRAY,
    });
    // Progress bar
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.6, y: cy + 0.58, w: cw - 0.7, h: 0.12,
      fill: { color: "e8ebef" }, rectRadius: 0.04,
    });
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.6, y: cy + 0.58, w: (cw - 0.7) * 0.82, h: 0.12,
      fill: { color: GOLD }, rectRadius: 0.04,
    });

    // Reward cards
    const rewards = [
      { icon: "🎫", title: "ส่วนลด ฿100", desc: "ใช้ 500 pt · ตั๋วทุกเส้นทาง", color: BLUE },
      { icon: "💺", title: "อัพเกรดที่นั่ง", desc: "ใช้ 1,000 pt · ชั้น 2 → ชั้น 1", color: TEAL },
      { icon: "🆓", title: "ตั๋วฟรี 1 ใบ", desc: "ใช้ 2,000 pt · เส้นทางสั้น", color: GREEN },
      { icon: "☕", title: "คูปองร้านกาแฟ", desc: "ใช้ 200 pt · ร้านค้าในสถานี", color: ORANGE },
    ];
    rewards.forEach((r, i) => {
      const ry = cy + 1.05 + i * 0.65;
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx, y: ry, w: cw, h: 0.55,
        fill: { color: WHITE }, rectRadius: 0.06,
        line: { color: r.color, width: 0.5 },
      });
      slide.addShape(pres.ShapeType.rect, {
        x: cx, y: ry + 0.04, w: 0.05, h: 0.47, fill: { color: r.color },
      });
      slide.addText(r.icon, {
        x: cx + 0.12, y: ry + 0.05, w: 0.4, h: 0.4,
        fontSize: 16, align: "center", valign: "middle",
      });
      slide.addText(r.title, {
        x: cx + 0.55, y: ry + 0.05, w: cw - 1.3, h: 0.22,
        fontSize: 9, fontFace: "Prompt", bold: true, color: NAVY,
      });
      slide.addText(r.desc, {
        x: cx + 0.55, y: ry + 0.27, w: cw - 1.3, h: 0.2,
        fontSize: 7, fontFace: "Prompt", color: GRAY,
      });
      // Redeem button
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + cw - 0.7, y: ry + 0.12, w: 0.6, h: 0.28,
        fill: { color: r.color }, rectRadius: 0.04,
      });
      slide.addText("แลก", {
        x: cx + cw - 0.7, y: ry + 0.12, w: 0.6, h: 0.28,
        fontSize: 8, fontFace: "Prompt", bold: true, color: WHITE,
        align: "center", valign: "middle",
      });
    });

    // Recent activity
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy + 3.7, w: cw, h: 0.55,
      fill: { color: "eef4fb" }, rectRadius: 0.06,
    });
    slide.addText("📋 ล่าสุด: +94 pt จากตั๋ว กรุงเทพ→เชียงใหม่\n🎉 ยินดีด้วย! เหลืออีก 550 pt ถึง Platinum", {
      x: cx + 0.08, y: cy + 3.72, w: cw - 0.16, h: 0.5,
      fontSize: 7, fontFace: "Prompt", color: NAVY, lineSpacingMultiple: 1.3,
    });
  }
);

// ==========================================
// SLIDE 9: Station Map
// ==========================================
const s9 = pres.addSlide();
addSlideHeader(s9, "Station Map", "แผนที่สถานี Interactive + นำทาง", 9);

s9.addText("แผนที่สถานีแบบ SVG แสดงชานชาลา ร้านค้า ห้องน้ำ ทางออก\nพร้อมคำนวณเวลาเดินและนำทางแบบ Step-by-Step", {
  x: 0.5, y: 1.55, w: 6.0, h: 0.7,
  fontSize: 12, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

addFeatureBullet(s9, 0.5, 2.45, "🚉", "SVG Map แสดงชานชาลา ร้านค้า ห้องน้ำ ทางออก ครบ", BLUE);
addFeatureBullet(s9, 0.5, 3.15, "🚶", "คำนวณเวลาเดินจากจุด A → B ภายในสถานี", TEAL);
addFeatureBullet(s9, 0.5, 3.85, "🔍", "ค้นหาร้านค้า/บริการ — กดแล้วนำทางไปจุดนั้นเลย", ORANGE);
addFeatureBullet(s9, 0.5, 4.55, "📱", "ใช้ได้ทั้งบนมือถือและ Kiosk หน้าสถานี", GREEN);

s9.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "fde8e8" }, rectRadius: 0.06,
});
s9.addText("❌ ปัจจุบัน\nไม่มีแผนที่สถานีเลย", {
  x: 0.65, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: RED, lineSpacingMultiple: 1.3,
});
s9.addText("→", {
  x: 3.4, y: 5.55, w: 0.4, h: 0.6,
  fontSize: 18, color: GRAY, align: "center", valign: "middle",
});
s9.addShape(pres.ShapeType.roundRect, {
  x: 3.8, y: 5.5, w: 2.8, h: 0.7,
  fill: { color: "e8f5e9" }, rectRadius: 0.06,
});
s9.addText("✅ SWT Platform\nInteractive Map + นำทาง + เวลาเดิน", {
  x: 3.95, y: 5.55, w: 2.5, h: 0.6,
  fontSize: 9, fontFace: "Prompt", color: GREEN, lineSpacingMultiple: 1.3,
});

// Right side — Browser mockup: Station map (wider for map)
addBrowserFrame(s9, 7.0, 1.3, 5.8, 5.0,
  "🚉 สถานีกรุงเทพอภิวัฒน์ — Station Map", BLUE,
  (slide, cx, cy, cw, ch) => {
    // Top bar
    slide.addShape(pres.ShapeType.rect, {
      x: cx, y: cy, w: cw, h: 0.32,
      fill: { color: NAVY },
    });
    slide.addText("🚉 สถานีกรุงเทพอภิวัฒน์   |   🔍 ค้นหา: ห้องน้ำ", {
      x: cx + 0.1, y: cy, w: cw - 0.2, h: 0.32,
      fontSize: 7.5, fontFace: "Prompt", color: WHITE, valign: "middle",
    });

    // Station floor plan (simplified rectangles)
    const mapY = cy + 0.45;
    // Main hall
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.3, y: mapY, w: 3.2, h: 1.5,
      fill: { color: "e8f0fe" },
      line: { color: BLUE, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText("โถงกลาง\n(Main Hall)", {
      x: cx + 1.2, y: mapY + 0.4, w: 1.4, h: 0.6,
      fontSize: 8, fontFace: "Prompt", color: BLUE, align: "center",
    });

    // Platforms
    for (let p = 0; p < 3; p++) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: cx + 3.7, y: mapY + p * 0.55, w: 1.5, h: 0.4,
        fill: { color: p === 0 ? "fff3e0" : "f0f0f0" },
        line: { color: p === 0 ? ORANGE : "cccccc", width: 0.5 },
        rectRadius: 0.04,
      });
      slide.addText(`🚂 ชานชาลา ${p + 1}${p === 0 ? " ★" : ""}`, {
        x: cx + 3.8, y: mapY + p * 0.55, w: 1.3, h: 0.4,
        fontSize: 7, fontFace: "Prompt", color: p === 0 ? ORANGE : GRAY,
        valign: "middle",
      });
    }

    // Facilities
    const facilities = [
      { x: cx + 0.4, y: mapY + 0.05, icon: "🚻", label: "ห้องน้ำ", color: TEAL },
      { x: cx + 0.4, y: mapY + 1.0, icon: "☕", label: "ร้านกาแฟ", color: ORANGE },
      { x: cx + 2.4, y: mapY + 0.05, icon: "🏪", label: "ร้านสะดวกซื้อ", color: GREEN },
      { x: cx + 2.4, y: mapY + 1.0, icon: "🚪", label: "ทางออก", color: RED },
    ];
    facilities.forEach(f => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: f.x, y: f.y, w: 0.8, h: 0.4,
        fill: { color: WHITE },
        line: { color: f.color, width: 0.5 },
        rectRadius: 0.04,
      });
      slide.addText(`${f.icon} ${f.label}`, {
        x: f.x + 0.03, y: f.y, w: 0.74, h: 0.4,
        fontSize: 6.5, fontFace: "Prompt", color: NAVY, align: "center", valign: "middle",
      });
    });

    // Navigation result
    const navY = mapY + 1.7;
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: navY, w: cw, h: 0.65,
      fill: { color: WHITE },
      line: { color: TEAL, width: 1 },
      rectRadius: 0.06,
    });
    slide.addText("🚶 นำทางไป: ห้องน้ำ (ชั้น 1 ฝั่งเหนือ)", {
      x: cx + 0.1, y: navY + 0.03, w: cw - 0.2, h: 0.25,
      fontSize: 8, fontFace: "Prompt", bold: true, color: NAVY,
    });
    slide.addText("ระยะทาง: 120 ม.  ·  เวลาเดิน: ~2 นาที  ·  📍 ตรงไป → เลี้ยวขวา", {
      x: cx + 0.1, y: navY + 0.3, w: cw - 0.2, h: 0.25,
      fontSize: 7.5, fontFace: "Prompt", color: TEAL,
    });

    // Legend
    slide.addText("🟦 โถง   🟧 ชานชาลาของคุณ   🚻 สิ่งอำนวยความสะดวก   🔴 ทางออก", {
      x: cx, y: navY + 0.7, w: cw, h: 0.2,
      fontSize: 6.5, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
    });
  },
  null, null
);

// ==========================================
// SLIDE 10: Feasibility — ทำได้เลย vs ต้องขอข้อมูล
// ==========================================
const s10 = pres.addSlide();
addSlideHeader(s10, "สิ่งที่ต้องการจาก รฟท.", "พร้อมพัฒนา vs ต้องการข้อมูลเพิ่มเติม", 10);

// Subtitle text
s10.addText("แต่ละฟีเจอร์ต้องการข้อมูลหรือการสนับสนุนจาก รฟท. ต่างกัน\nตารางนี้แสดงสิ่งที่พร้อมพัฒนาทันที และสิ่งที่ต้องการความร่วมมือ", {
  x: 0.5, y: 1.5, w: 12.33, h: 0.55,
  fontSize: 11, fontFace: "Prompt", color: GRAY, lineSpacingMultiple: 1.4, wrap: true,
});

const feasHeader = [
  { text: "ฟีเจอร์", options: { fill: NAVY, color: WHITE, bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "สถานะความพร้อม", options: { fill: NAVY, color: WHITE, bold: true, fontSize: 11, fontFace: "Prompt", align: "center", valign: "middle" } },
  { text: "ฝั่งแพลตฟอร์มทำได้", options: { fill: NAVY, color: "a8e6cf", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "ต้องการจาก รฟท.", options: { fill: NAVY, color: "ffccbc", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
];

const feasRows = [
  [
    { text: "🤖 RailBot AI", options: { bold: true } },
    { text: "✅ พร้อมพัฒนา", options: { color: GREEN, bold: true, align: "center" } },
    { text: "LLM + NLP + Knowledge Base\nรองรับ TH/EN + Voice" },
    { text: "FAQ / ข้อมูลโปรโมชัน\n(nice to have — ไม่จำเป็นต้องรอ)" },
  ],
  [
    { text: "📌 Tourism", options: { bold: true } },
    { text: "✅ พร้อมพัฒนา", options: { color: GREEN, bold: true, align: "center" } },
    { text: "CMS จัดการ Tour Packages\nจอง + ราคา + รีวิว ในแอป" },
    { text: "ข้อมูลสถานที่ท่องเที่ยวริมเส้นทาง\n(มีบนเว็บ รฟท. อยู่แล้ว)" },
  ],
  [
    { text: "🔀 Smart Routing", options: { bold: true } },
    { text: "⚡ ต้องการข้อมูล", options: { color: ORANGE, bold: true, align: "center" } },
    { text: "Routing Algorithm + UI\nคำนวณเส้นทางเชื่อมต่ออัตโนมัติ" },
    { text: "📋 ตารางเดินรถ (Timetable Data)\nสถานีจอด + เวลา + Junction" },
  ],
  [
    { text: "🚉 Station Map", options: { bold: true } },
    { text: "⚡ ต้องการข้อมูล", options: { color: ORANGE, bold: true, align: "center" } },
    { text: "SVG Rendering + Navigation\nคำนวณเวลาเดิน + ค้นหา" },
    { text: "📋 แผนผังสถานี (Floor Plan)\nตำแหน่งร้านค้า ห้องน้ำ ชานชาลา" },
  ],
  [
    { text: "🎫 Availability-First", options: { bold: true } },
    { text: "🔗 ต้องเชื่อมต่อระบบ", options: { color: RED, bold: true, align: "center" } },
    { text: "Seat Map UI + Interactive Selection\nแสดงผลทันทีตั้งแต่ค้นหา" },
    { text: "🔑 API ข้อมูลที่นั่งว่าง/เต็ม\nจาก D-Ticket (ปัจจุบันไม่มี Public API)" },
  ],
  [
    { text: "⏱️ Real-time Status", options: { bold: true } },
    { text: "🔗 ต้องเชื่อมต่อระบบ", options: { color: RED, bold: true, align: "center" } },
    { text: "Tracking UI + สถิติตรงเวลา\nแจ้งเตือนเมื่อใกล้ถึงสถานี" },
    { text: "🔑 GPS Tracking Data จากตัวรถ\n+ ข้อมูล delay ย้อนหลัง" },
  ],
  [
    { text: "🏆 Loyalty System", options: { bold: true } },
    { text: "🔗 ต้องเชื่อมต่อระบบ", options: { color: RED, bold: true, align: "center" } },
    { text: "Point Tracking + Reward Catalog\nTier System + Dashboard" },
    { text: "🔑 ข้อตกลงธุรกิจ (ใครจ่ายส่วนลด?)\n+ API เชื่อม D-Ticket สำหรับ Redeem" },
  ],
];

const feasFormatted = feasRows.map((row, ri) => {
  const bgColor = ri % 2 === 0 ? WHITE : LIGHT_BG;
  return row.map((cell, ci) => {
    const base = { fill: bgColor, fontSize: 9.5, fontFace: "Prompt", valign: "middle", lineSpacingMultiple: 1.2 };
    if (ci === 0) Object.assign(base, { color: NAVY, bold: true, fontSize: 10 });
    else if (ci === 2) Object.assign(base, { color: BLUE });
    else if (ci === 3) Object.assign(base, { color: GRAY });
    if (typeof cell === "string") return { text: cell, options: base };
    return { text: cell.text, options: { ...base, ...cell.options } };
  });
});

s10.addTable([feasHeader, ...feasFormatted], {
  x: 0.5, y: 2.2, w: 12.33,
  colW: [1.8, 1.8, 4.0, 4.73],
  rowH: [0.42, ...Array(7).fill(0.62)],
  border: { pt: 0.5, color: "e8ebef" },
  margin: [4, 6, 4, 6],
});

// Legend at bottom
s10.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: 6.75, w: 12.33, h: 0.45,
  fill: { color: WHITE }, rectRadius: 0.06,
});
s10.addText("✅ พร้อมพัฒนาทันที     ⚡ ต้องการข้อมูล (ขอแล้วเริ่มได้)     🔗 ต้องเชื่อมต่อระบบ รฟท. (ต้องเจรจา API / ข้อตกลง)", {
  x: 0.7, y: 6.75, w: 12.0, h: 0.45,
  fontSize: 10, fontFace: "Prompt", color: NAVY, valign: "middle",
});

// ==========================================
// SLIDE 11: Comparison Table
// ==========================================
const s11c = pres.addSlide();
addSlideHeader(s11c, "เปรียบเทียบ", "Enhancing the Passenger Experience", 11);

const cmpHeader = [
  { text: "ความต้องการ", options: { fill: NAVY, color: WHITE, bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "สถานการณ์ปัจจุบัน", options: { fill: NAVY, color: "b0c4de", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
  { text: "แพลตฟอร์ม SWT ✦", options: { fill: NAVY, color: "a8e6cf", bold: true, fontSize: 11, fontFace: "Prompt", align: "left", valign: "middle" } },
];

const cmpRows = [
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

const cmpFormatted = cmpRows.map((row, ri) => {
  const bgColor = ri % 2 === 0 ? WHITE : LIGHT_BG;
  return [
    { text: row[0], options: { fill: bgColor, color: NAVY, bold: true, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
    { text: row[1], options: { fill: bgColor, color: LIGHT_GRAY, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
    { text: row[2], options: { fill: bgColor, color: BLUE, bold: true, fontSize: 10, fontFace: "Prompt", valign: "middle" } },
  ];
});

s11c.addTable([cmpHeader, ...cmpFormatted], {
  x: 0.5, y: 1.5, w: 12.33,
  colW: [2.8, 4.2, 5.33],
  rowH: [0.45, ...Array(9).fill(0.52)],
  border: { pt: 0.5, color: "e8ebef" },
  margin: [5, 8, 5, 8],
});

s11c.addText("✦ SWT — Smart Tourism Platform สำหรับการรถไฟแห่งประเทศไทย", {
  x: 0.5, y: 6.85, w: 12.33, h: 0.3,
  fontSize: 9, fontFace: "Prompt", color: LIGHT_GRAY, align: "right",
});

// ==========================================
// SLIDE 12: Live Demo
// ==========================================
const s12 = pres.addSlide();
addSlideHeader(s12, "Live Demo", "ทดลองใช้งานจริง", 12);

function addDemoCard(slide, x, color, title, desc, url, btnLabel) {
  const y = 1.5, w = 3.7, h = 5.0;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: WHITE },
    shadow: { type: "outer", blur: 5, offset: 2, color: "cccccc", opacity: 0.3 },
    rectRadius: 0.12,
  });
  slide.addShape(pres.ShapeType.rect, {
    x: x + 0.05, y, w: w - 0.1, h: 0.06, fill: { color },
  });
  const mpx = x + 0.85, mpy = y + 0.3, mpw = 2.0, mph = 2.8;
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx, y: mpy, w: mpw, h: mph,
    fill: { color: LIGHT_BG },
    line: { color: "dddddd", width: 1.5 },
    rectRadius: 0.2,
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx + 0.55, y: mpy, w: 0.9, h: 0.15,
    fill: { color: "dddddd" }, rectRadius: 0.05,
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: mpx + 0.1, y: mpy + 0.25, w: mpw - 0.2, h: 0.28,
    fill: { color }, rectRadius: 0.05,
  });
  slide.addText(title, {
    x: mpx + 0.1, y: mpy + 0.25, w: mpw - 0.2, h: 0.28,
    fontSize: 8, fontFace: "Prompt", color: WHITE, align: "center", valign: "middle", bold: true,
  });
  slide.addText(title.replace(/[🌐📱📊]\s?/g, ""), {
    x, y: y + 3.2, w, h: 0.4,
    fontSize: 16, fontFace: "Prompt", bold: true, color: NAVY, align: "center",
  });
  slide.addText(desc, {
    x: x + 0.2, y: y + 3.6, w: w - 0.4, h: 0.5,
    fontSize: 10, fontFace: "Prompt", color: GRAY, align: "center", wrap: true,
  });
  slide.addText(url, {
    x: x + 0.2, y: y + 4.05, w: w - 0.4, h: 0.3,
    fontSize: 8, fontFace: "Prompt", color: LIGHT_GRAY, align: "center",
    hyperlink: { url: `https://${url}` },
  });
  slide.addShape(pres.ShapeType.roundRect, {
    x: x + 0.8, y: y + 4.4, w: w - 1.6, h: 0.4,
    fill: { color }, rectRadius: 0.2,
  });
  slide.addText(btnLabel, {
    x: x + 0.8, y: y + 4.4, w: w - 1.6, h: 0.4,
    fontSize: 11, fontFace: "Prompt", bold: true, color: WHITE, align: "center", valign: "middle",
    hyperlink: { url: `https://${url}` },
  });
}

addDemoCard(s12, 0.7, BLUE, "🌐 Web Platform",
  "เว็บไซต์หลัก — จองตั๋ว ตาราง ทัวร์ Reward แผนที่สถานี",
  "thai-rail-web-repo.vercel.app", "เปิดเว็บ →");

addDemoCard(s12, 4.8, ORANGE, "📱 Mobile App",
  "แอปมือถือ — ออกแบบสำหรับใช้งานระหว่างเดินทาง พร้อม AI Chat",
  "swt-mobile.vercel.app", "เปิดแอป →");

addDemoCard(s12, 8.9, GREEN, "📊 Stats Dashboard",
  "Dashboard สำหรับผู้บริหาร — Booking Revenue Heatmap Satisfaction",
  "srt-stats.vercel.app", "เปิด Dashboard →");

// === EXPORT ===
const outPath = "./pain-solution.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`✅ Created: ${outPath} (${TOTAL} slides)`);
}).catch(err => {
  console.error("Error:", err);
});
