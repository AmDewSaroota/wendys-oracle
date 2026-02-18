const PptxGenJS = require("./node_modules/pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// ========== Design Tokens ==========
const C = {
  bg: "0A192F",
  bgLight: "112240",
  accent: "64FFDA",
  accentDim: "2D8B7A",
  white: "E6F1FF",
  gray: "8892B0",
  orange: "F59E0B",
  red: "EF4444",
  gold: "FFD700",
};

const FONT = "Segoe UI";
const FONT_THAI = "Tahoma";

// ========== Helpers ==========
function addBgAndDecor(slide) {
  slide.background = { color: C.bg };
  // Top accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.04,
    fill: { color: C.accent },
  });
  // Bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: 13.33, h: 0.3,
    fill: { color: C.bgLight },
  });
  // Footer text
  slide.addText("NDF Co., Ltd.  |  Smart Tourism Web Application", {
    x: 0.5, y: 7.22, w: 12, h: 0.25,
    fontSize: 8, color: C.gray, fontFace: FONT,
  });
}

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x || 0.7, y: opts.y || 0.3, w: opts.w || 12, h: 0.6,
    fontSize: opts.size || 28, fontFace: FONT_THAI,
    color: C.accent, bold: true,
  });
}

function addSubtitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x || 0.7, y: opts.y || 0.95, w: opts.w || 11, h: 0.35,
    fontSize: 14, fontFace: FONT_THAI,
    color: C.gray, italic: true,
  });
}

function addBullets(slide, items, opts = {}) {
  const textItems = items.map((item) => ({
    text: item,
    options: {
      fontSize: opts.fontSize || 14,
      fontFace: FONT_THAI,
      color: C.white,
      bullet: { type: "number", color: C.accent },
      paraSpaceAfter: 6,
    },
  }));
  slide.addText(textItems, {
    x: opts.x || 0.7, y: opts.y || 1.5, w: opts.w || 11.5, h: opts.h || 5,
    valign: "top",
  });
}

function addCard(slide, x, y, w, h, title, body, icon) {
  // Card background
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: C.bgLight },
    rectRadius: 0.1,
    shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.3 },
  });
  // Icon circle
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
    fill: { color: C.accentDim },
  });
  slide.addText(icon, {
    x: x + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
    fontSize: 14, align: "center", valign: "middle", color: C.white,
  });
  // Title
  slide.addText(title, {
    x: x + 0.7, y: y + 0.15, w: w - 0.9, h: 0.4,
    fontSize: 12, fontFace: FONT_THAI, color: C.accent, bold: true,
  });
  // Body
  slide.addText(body, {
    x: x + 0.15, y: y + 0.65, w: w - 0.3, h: h - 0.8,
    fontSize: 10, fontFace: FONT_THAI, color: C.gray, valign: "top",
  });
}

function addTable(slide, headers, rows, opts = {}) {
  const tableRows = [];
  // Header row
  tableRows.push(
    headers.map((h) => ({
      text: h,
      options: {
        fill: { color: C.accentDim },
        color: C.white,
        fontSize: 11,
        fontFace: FONT_THAI,
        bold: true,
        align: "center",
        border: { type: "solid", color: C.bgLight, pt: 0.5 },
      },
    }))
  );
  // Data rows
  rows.forEach((row, i) => {
    tableRows.push(
      row.map((cell) => ({
        text: cell,
        options: {
          fill: { color: i % 2 === 0 ? C.bg : C.bgLight },
          color: C.white,
          fontSize: 10,
          fontFace: FONT_THAI,
          border: { type: "solid", color: C.bgLight, pt: 0.5 },
          align: "center",
        },
      }))
    );
  });
  slide.addTable(tableRows, {
    x: opts.x || 0.7,
    y: opts.y || 2.5,
    w: opts.w || 11.5,
    colW: opts.colW,
    rowH: 0.4,
  });
}

// ========== SLIDE 1: Title ==========
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  // Decorative circles
  s.addShape(pptx.ShapeType.ellipse, {
    x: -1, y: -1, w: 4, h: 4,
    fill: { type: "solid", color: C.bgLight }, line: { color: C.accentDim, width: 1 },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: 10, y: 5, w: 5, h: 5,
    fill: { type: "solid", color: C.bgLight }, line: { color: C.accentDim, width: 1 },
  });
  // Top accent
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.06,
    fill: { color: C.accent },
  });
  // Main title
  s.addText("Smart Tourism\nWeb Application", {
    x: 1, y: 1.2, w: 11, h: 2,
    fontSize: 48, fontFace: FONT, color: C.accent, bold: true,
    lineSpacingMultiple: 1.1,
  });
  // Thai subtitle
  s.addText("ระบบบริหารจัดการพื้นที่เชิงพาณิชย์อัจฉริยะ", {
    x: 1, y: 3.2, w: 11, h: 0.6,
    fontSize: 20, fontFace: FONT_THAI, color: C.white,
  });
  // Feature badges
  const badges = ["Core Dashboard", "Kiosk Display", "Web Application"];
  badges.forEach((b, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 1 + i * 3.2, y: 4.2, w: 2.8, h: 0.5,
      fill: { color: C.bgLight },
      line: { color: C.accent, width: 1 },
      rectRadius: 0.15,
    });
    s.addText(b, {
      x: 1 + i * 3.2, y: 4.2, w: 2.8, h: 0.5,
      fontSize: 12, fontFace: FONT, color: C.accent, align: "center", valign: "middle",
    });
  });
  // Powered by
  s.addText("Powered by DeepTrack Sensor Technology", {
    x: 1, y: 5.2, w: 11, h: 0.4,
    fontSize: 13, fontFace: FONT, color: C.gray, italic: true,
  });
  // Company
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 6.5, w: 13.33, h: 0.7,
    fill: { color: C.bgLight },
  });
  s.addText("NDF Co., Ltd.", {
    x: 1, y: 6.5, w: 11, h: 0.7,
    fontSize: 18, fontFace: FONT, color: C.white, bold: true, valign: "middle",
  });
}

// ========== SLIDE 2: System Overview ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "System Overview");
  addSubtitle(s, "ข้อมูล → การวิเคราะห์ → การตัดสินใจ");

  // 3 columns: Input → Process → Output
  const cols = [
    { title: "INPUT", sub: "Sensor System", desc: "เซนเซอร์ DeepTrack\nตรวจจับอุปกรณ์มือถือ\nสร้าง Floor Plan + Heatmap\nแบบ Real-time", icon: "S", color: "3B82F6" },
    { title: "PROCESS", sub: "Core Dashboard", desc: "ประมวลผลข้อมูล\nจัดการพื้นที่ & บูท\nบริหารรายได้\nสร้างรายงาน", icon: "D", color: C.accent },
    { title: "OUTPUT", sub: "Kiosk & Web App", desc: "แสดงผลให้ผู้เช่า\nผู้บริหาร ผู้ใช้ทั่วไป\nเข้าถึงได้ทุกที่", icon: "K", color: C.orange },
  ];

  cols.forEach((col, i) => {
    const x = 0.7 + i * 4.2;
    // Card bg
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.7, w: 3.8, h: 4.5,
      fill: { color: C.bgLight }, rectRadius: 0.15,
      shadow: { type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.3 },
    });
    // Icon circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 1.3, y: 2.0, w: 1.2, h: 1.2,
      fill: { color: col.color },
    });
    s.addText(col.icon, {
      x: x + 1.3, y: 2.0, w: 1.2, h: 1.2,
      fontSize: 28, color: C.bg, align: "center", valign: "middle", bold: true,
    });
    // Title
    s.addText(col.title, {
      x, y: 3.4, w: 3.8, h: 0.4,
      fontSize: 16, fontFace: FONT, color: col.color, align: "center", bold: true,
    });
    s.addText(col.sub, {
      x, y: 3.8, w: 3.8, h: 0.35,
      fontSize: 12, fontFace: FONT_THAI, color: C.white, align: "center",
    });
    // Description
    s.addText(col.desc, {
      x: x + 0.3, y: 4.3, w: 3.2, h: 2,
      fontSize: 11, fontFace: FONT_THAI, color: C.gray, valign: "top",
      lineSpacingMultiple: 1.4,
    });
    // Arrow between
    if (i < 2) {
      s.addText("→", {
        x: x + 3.8, y: 3.2, w: 0.4, h: 0.8,
        fontSize: 30, color: C.accent, align: "center", valign: "middle",
      });
    }
  });
}

// ========== SLIDE 3: Core Dashboard Overview ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Core Dashboard: 7 Modules");
  addSubtitle(s, "ศูนย์กลางการบริหาร — ทุกอย่างอยู่ที่เดียว");

  const modules = [
    { name: "User Management", desc: "จัดการผู้ใช้ สิทธิ์ Authentication", icon: "U" },
    { name: "Space Management", desc: "จัดการโซน พื้นที่ Floor Plan", icon: "S" },
    { name: "Booth Management", desc: "จัดการบูท ขนาด ตำแหน่ง สถานะ", icon: "B" },
    { name: "Heatmap + Tracking", desc: "แสดง Heatmap ความหนาแน่นผู้คน", icon: "H" },
    { name: "Revenue & Billing", desc: "คำนวณค่าเช่า ออกบิล ติดตามรายได้", icon: "R" },
    { name: "Report Module", desc: "รายงานสรุปรายวัน/สัปดาห์/เดือน", icon: "P" },
    { name: "Notification", desc: "แจ้งเตือนเมื่อมีเหตุการณ์สำคัญ", icon: "N" },
  ];

  // 2 rows: 4 + 3
  modules.forEach((m, i) => {
    const row = i < 4 ? 0 : 1;
    const col = row === 0 ? i : i - 4;
    const totalInRow = row === 0 ? 4 : 3;
    const cardW = 2.8;
    const startX = (13.33 - totalInRow * (cardW + 0.2)) / 2;
    const x = startX + col * (cardW + 0.2);
    const y = 1.7 + row * 2.7;

    addCard(s, x, y, cardW, 2.2, m.name, m.desc, m.icon);
  });
}

// ========== SLIDE 4: Space Management ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Space Management");
  addSubtitle(s, "จัดการพื้นที่อย่างชาญฉลาด — ข้อมูลจริงจากเซนเซอร์");

  const features = [
    { title: "Floor Plan ดิจิทัล", desc: "นำเข้าแผนผังอาคาร\nแบ่งโซนได้ตามต้องการ", icon: "F" },
    { title: "Heatmap ซ้อนทับ", desc: "เห็นความหนาแน่นจริง\nบน Floor Plan", icon: "H" },
    { title: "แบ่งโซนราคา", desc: "Premium / Gold\nStandard / Economy", icon: "Z" },
    { title: "Carrying Capacity", desc: "คำนวณจำนวนคนสูงสุด\nที่รองรับได้ต่อโซน", icon: "C" },
  ];

  features.forEach((f, i) => {
    const x = 0.5 + i * 3.15;
    addCard(s, x, 1.8, 2.9, 3.2, f.title, f.desc, f.icon);
  });

  // Problem → Solution bar
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 5.5, w: 11.9, h: 1.2,
    fill: { color: C.bgLight }, rectRadius: 0.1,
    line: { color: C.accentDim, width: 1 },
  });
  s.addText("ปัญหาเดิม: ไม่รู้ว่าพื้นที่ไหนคนเดินผ่านเยอะ → กำหนดราคาไม่ตรงกับความจริง", {
    x: 1, y: 5.55, w: 11, h: 0.45,
    fontSize: 12, fontFace: FONT_THAI, color: C.orange,
  });
  s.addText("ด้วยระบบนี้: ข้อมูลจากเซนเซอร์ถูกแปลงเป็นข้อมูลเชิงธุรกิจทันที — ไม่ต้องรอรายงานรายเดือน", {
    x: 1, y: 6.05, w: 11, h: 0.45,
    fontSize: 12, fontFace: FONT_THAI, color: C.accent,
  });
}

// ========== SLIDE 5: Booth Management ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Booth Management & Dynamic Pricing");
  addSubtitle(s, "บริหารบูทตั้งแต่วางแผนจนถึงเก็บเงิน");

  addTable(
    s,
    ["ฟังก์ชัน", "รายละเอียด"],
    [
      ["จัดวางบูท", "ลากวางตำแหน่งบนแผนผัง กำหนดขนาด (S / M / L)"],
      ["กำหนดราคา", "ราคาอิงจาก Heatmap density — พื้นที่คนเยอะ = ราคาสูงกว่า"],
      ["ติดตามสถานะ", "ว่าง / จอง / ใช้งาน / หมดสัญญา — Real-time"],
      ["จัดการสัญญา", "ระยะเวลาเช่า, เงื่อนไข, ต่อสัญญาอัตโนมัติ"],
    ],
    { y: 1.7, colW: [3, 8.5] }
  );

  // Example highlight
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 4.2, w: 11.9, h: 1.8,
    fill: { color: C.bgLight }, rectRadius: 0.1,
    line: { color: C.gold, width: 1.5 },
  });
  s.addText("ตัวอย่างจริง", {
    x: 1, y: 4.35, w: 3, h: 0.35,
    fontSize: 13, fontFace: FONT_THAI, color: C.gold, bold: true,
  });

  addTable(
    s,
    ["Zone", "Traffic (คน/วัน)", "Grade", "ราคา (บาท/เดือน)"],
    [
      ["Zone 13 Open Area", "8,000 - 11,000", "Premium", "25,000 - 37,500"],
      ["Zone 7 Corridor", "4,000 - 6,000", "Gold", "15,300"],
      ["Zone 2 Side Area", "1,500 - 3,000", "Standard", "10,200"],
    ],
    { y: 4.8, colW: [3.5, 2.5, 2, 3.5] }
  );
}

// ========== SLIDE 6: Heatmap & Analytics ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Heatmap & Analytics");
  addSubtitle(s, "ข้อมูลจากเซนเซอร์ → แผนภาพที่เข้าใจได้ทันที");

  // Left: DeepTrack Insights
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.6, w: 5.8, h: 5,
    fill: { color: C.bgLight }, rectRadius: 0.15,
  });
  s.addText("DeepTrack วิเคราะห์", {
    x: 0.8, y: 1.8, w: 5, h: 0.4,
    fontSize: 16, fontFace: FONT_THAI, color: C.accent, bold: true,
  });

  const insights = [
    { label: "Unique Devices", desc: "จำนวนคนที่ผ่านแต่ละจุด" },
    { label: "Peak Hours", desc: "ช่วงเวลาที่คนเยอะที่สุด" },
    { label: "Movement Flow", desc: "เส้นทางการเดิน" },
    { label: "Dwell Time", desc: "ระยะเวลาที่อยู่ในแต่ละโซน" },
  ];
  insights.forEach((item, i) => {
    const y = 2.5 + i * 1;
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.8, y, w: 0.5, h: 0.5,
      fill: { color: C.accentDim },
    });
    s.addText(String(i + 1), {
      x: 0.8, y, w: 0.5, h: 0.5,
      fontSize: 14, color: C.white, align: "center", valign: "middle", bold: true,
    });
    s.addText(item.label, {
      x: 1.5, y, w: 4.5, h: 0.25,
      fontSize: 13, fontFace: FONT, color: C.white, bold: true,
    });
    s.addText(item.desc, {
      x: 1.5, y: y + 0.25, w: 4.5, h: 0.25,
      fontSize: 11, fontFace: FONT_THAI, color: C.gray,
    });
  });

  // Right: Output types
  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.8, y: 1.6, w: 5.8, h: 5,
    fill: { color: C.bgLight }, rectRadius: 0.15,
  });
  s.addText("การแสดงผล", {
    x: 7.1, y: 1.8, w: 5, h: 0.4,
    fontSize: 16, fontFace: FONT_THAI, color: C.accent, bold: true,
  });

  const outputs = [
    { name: "Daily Heatmap", desc: "สีเขียว (น้อย) → เหลือง → แดง (เยอะมาก)", colors: ["22C55E", "F59E0B", "EF4444"] },
    { name: "Weekly/Monthly Report", desc: "แนวโน้มรายสัปดาห์ เปรียบเทียบช่วงเวลา" },
    { name: "Sankey Diagram", desc: "แสดงทิศทางการเคลื่อนที่ระหว่างโซน" },
  ];
  outputs.forEach((item, i) => {
    const y = 2.5 + i * 1.4;
    s.addText(item.name, {
      x: 7.1, y, w: 5.2, h: 0.3,
      fontSize: 14, fontFace: FONT, color: C.white, bold: true,
    });
    s.addText(item.desc, {
      x: 7.1, y: y + 0.35, w: 5.2, h: 0.4,
      fontSize: 11, fontFace: FONT_THAI, color: C.gray,
    });
    if (item.colors) {
      item.colors.forEach((c, j) => {
        s.addShape(pptx.ShapeType.ellipse, {
          x: 7.1 + j * 0.5, y: y + 0.8, w: 0.35, h: 0.35,
          fill: { color: c },
        });
      });
    }
  });
}

// ========== SLIDE 7: Revenue & Billing ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Revenue & Billing");
  addSubtitle(s, "ติดตามรายได้แบบ Real-time");

  // Feature cards row
  const features = [
    { title: "Revenue Dashboard", desc: "สรุปรายได้รวมทุกบูท\nแยกตาม Tier/โซน/ช่วงเวลา" },
    { title: "Billing อัตโนมัติ", desc: "ออกใบแจ้งหนี้ตามรอบ\nแจ้งเตือนก่อนครบกำหนด" },
    { title: "Occupancy Rate", desc: "อัตราการใช้งานพื้นที่\nกี่ % ที่มีคนเช่า" },
    { title: "Revenue Forecast", desc: "ประมาณการรายได้ล่วงหน้า\nจากแนวโน้ม Traffic" },
  ];
  features.forEach((f, i) => {
    addCard(s, 0.5 + i * 3.15, 1.6, 2.9, 2.2, f.title, f.desc, "฿");
  });

  // Revenue table
  addTable(
    s,
    ["ประเภทบูท", "จำนวน", "มูลค่า/เดือน"],
    [
      ["Premium", "5 จุด", "150,000 บาท"],
      ["Gold", "4 จุด", "61,200 บาท"],
      ["Standard", "6 จุด", "61,200 บาท"],
      ["Economy", "3 จุด", "43,200 บาท"],
    ],
    { y: 4.3, colW: [4, 3, 4.5] }
  );

  // Total highlight
  s.addShape(pptx.ShapeType.roundRect, {
    x: 3, y: 6.1, w: 7, h: 0.7,
    fill: { color: C.accentDim }, rectRadius: 0.1,
  });
  s.addText("รวม 18 จุด  =  315,600 บาท/เดือน", {
    x: 3, y: 6.1, w: 7, h: 0.7,
    fontSize: 20, fontFace: FONT_THAI, color: C.white, align: "center", valign: "middle", bold: true,
  });
}

// ========== SLIDE 8: Kiosk & Web App Overview ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Kiosk & Web App");
  addSubtitle(s, "2 ช่องทางให้บริการผู้ใช้ — เชื่อมกับ Core Dashboard ตัวเดียวกัน");

  // Left: Kiosk
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: C.bgLight }, rectRadius: 0.15,
    line: { color: "3B82F6", width: 2 },
  });
  s.addText("ตู้ Kiosk", {
    x: 0.5, y: 1.9, w: 5.8, h: 0.5,
    fontSize: 22, fontFace: FONT_THAI, color: "3B82F6", align: "center", bold: true,
  });
  s.addText("ติดตั้งในพื้นที่จริง", {
    x: 0.5, y: 2.4, w: 5.8, h: 0.3,
    fontSize: 12, fontFace: FONT_THAI, color: C.gray, align: "center",
  });
  const kioskItems = ["ผู้มาใช้บริการ, ผู้เช่าบูท", "ดูแผนที่, ค้นหาบูท", "ข้อมูลร้านค้า, Wayfinding", "Real-time จาก Core Dashboard"];
  kioskItems.forEach((item, i) => {
    s.addText("• " + item, {
      x: 1, y: 3.0 + i * 0.65, w: 5, h: 0.5,
      fontSize: 12, fontFace: FONT_THAI, color: C.white,
    });
  });

  // Right: Web App
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7, y: 1.7, w: 5.8, h: 4.8,
    fill: { color: C.bgLight }, rectRadius: 0.15,
    line: { color: C.accent, width: 2 },
  });
  s.addText("Web Application", {
    x: 7, y: 1.9, w: 5.8, h: 0.5,
    fontSize: 22, fontFace: FONT, color: C.accent, align: "center", bold: true,
  });
  s.addText("เข้าถึงจากทุกที่ผ่าน Browser", {
    x: 7, y: 2.4, w: 5.8, h: 0.3,
    fontSize: 12, fontFace: FONT_THAI, color: C.gray, align: "center",
  });
  const webItems = ["Admin, ผู้บริหาร, ผู้เช่า", "จัดการบูท, ดูรายงาน", "ตั้งค่าระบบ, Notification", "Real-time จาก Core Dashboard"];
  webItems.forEach((item, i) => {
    s.addText("• " + item, {
      x: 7.5, y: 3.0 + i * 0.65, w: 5, h: 0.5,
      fontSize: 12, fontFace: FONT_THAI, color: C.white,
    });
  });
}

// ========== SLIDE 9: Kiosk Details ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Kiosk: ตู้บริการข้อมูลอัจฉริยะ");
  addSubtitle(s, "สิ่งที่ผู้ใช้เห็นบนหน้าจอ Kiosk");

  const kioskFeatures = [
    { title: "แผนผัง Interactive", desc: "แตะดูตำแหน่งร้านค้า/บูท\nพร้อมสถานะว่าง/ไม่ว่าง", icon: "M" },
    { title: "ข้อมูลร้านค้า", desc: "ชื่อร้าน ประเภทสินค้า\nโปรโมชั่น เวลาเปิด-ปิด", icon: "I" },
    { title: "Wayfinding", desc: "นำทางไปยังจุดที่ต้องการ\nบูท ห้องน้ำ ทางออก", icon: "W" },
    { title: "Crowd Status", desc: "แสดงโซนที่คนเยอะ/น้อย\nณ ขณะนั้น", icon: "C" },
  ];

  kioskFeatures.forEach((f, i) => {
    addCard(s, 0.5 + i * 3.15, 1.7, 2.9, 3, f.title, f.desc, f.icon);
  });

  // Benefits bar
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 5.2, w: 11.9, h: 1.6,
    fill: { color: C.bgLight }, rectRadius: 0.1,
  });
  s.addText("ประโยชน์", {
    x: 1, y: 5.3, w: 2, h: 0.3,
    fontSize: 14, fontFace: FONT_THAI, color: C.accent, bold: true,
  });
  const benefits = [
    "ผู้เที่ยวค้นหาร้านได้ง่าย → ใช้เวลาในพื้นที่นานขึ้น",
    "กระจายคนไปโซนที่ยังไม่แน่น → ลดความแออัด",
    "เพิ่มโอกาสให้บูทที่อยู่ในจุดเข้าถึงยาก",
  ];
  benefits.forEach((b, i) => {
    s.addText("✓  " + b, {
      x: 1, y: 5.7 + i * 0.35, w: 11, h: 0.3,
      fontSize: 11, fontFace: FONT_THAI, color: C.white,
    });
  });
}

// ========== SLIDE 10: Web App ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Web App: ระบบจัดการหลายระดับ");
  addSubtitle(s, "เข้าถึงได้ทุกที่ ทุกเวลา — Role-based Access");

  const roles = [
    {
      title: "Admin / ผู้ดูแล",
      items: ["Dashboard รวม — Occupancy, Revenue, Traffic", "จัดการบูท — เพิ่ม/ลบ/แก้ไข, อนุมัติจอง", "ออกรายงาน — PDF/Excel อัตโนมัติ", "ตั้งค่า Notification"],
      color: C.accent,
    },
    {
      title: "ผู้เช่าบูท",
      items: ["ดูสถิติ Traffic หน้าร้านตัวเอง", "ดูใบแจ้งหนี้ + ชำระเงินออนไลน์", "แจ้งซ่อม / ร้องขอบริการ"],
      color: "3B82F6",
    },
    {
      title: "ผู้บริหารระดับสูง",
      items: ["Executive Dashboard — Revenue, Occupancy, Growth", "เปรียบเทียบระหว่างโซน/ช่วงเวลา", "Revenue Forecast & KPI"],
      color: C.gold,
    },
  ];

  roles.forEach((role, i) => {
    const x = 0.5 + i * 4.2;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.7, w: 3.9, h: 5,
      fill: { color: C.bgLight }, rectRadius: 0.15,
      line: { color: role.color, width: 1.5 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.7, w: 3.9, h: 0.6,
      fill: { color: role.color },
    });
    s.addText(role.title, {
      x, y: 1.7, w: 3.9, h: 0.6,
      fontSize: 15, fontFace: FONT_THAI, color: C.bg, align: "center", valign: "middle", bold: true,
    });
    role.items.forEach((item, j) => {
      s.addText("•  " + item, {
        x: x + 0.2, y: 2.6 + j * 0.8, w: 3.5, h: 0.7,
        fontSize: 11, fontFace: FONT_THAI, color: C.white, valign: "top",
      });
    });
  });
}

// ========== SLIDE 11: Data Flow ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "Data Flow: จากเซนเซอร์ถึงรายได้");
  addSubtitle(s, "ทุกขั้นตอนเป็นอัตโนมัติ — ลดงานคน เพิ่มความแม่นยำ");

  const steps = [
    { label: "DeepTrack\nSensors", desc: "ตรวจจับ\nBluetooth/Wi-Fi", color: "3B82F6" },
    { label: "Heatmap\nEngine", desc: "วิเคราะห์\nความหนาแน่น", color: "8B5CF6" },
    { label: "Space &\nBooth Mgmt", desc: "กำหนดตำแหน่ง\n+ ราคา", color: C.accent },
    { label: "Revenue\n& Billing", desc: "ออกบิล\nเก็บเงิน", color: C.gold },
    { label: "Kiosk &\nWeb App", desc: "แสดงผลให้\nผู้ใช้ทุกกลุ่ม", color: C.orange },
  ];

  steps.forEach((step, i) => {
    const x = 0.3 + i * 2.6;
    // Circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.3, y: 2.2, w: 1.8, h: 1.8,
      fill: { color: step.color },
      shadow: { type: "outer", blur: 10, offset: 3, color: "000000", opacity: 0.4 },
    });
    s.addText(String(i + 1), {
      x: x + 0.3, y: 2.2, w: 1.8, h: 1.8,
      fontSize: 36, color: C.bg, align: "center", valign: "middle", bold: true,
    });
    // Label
    s.addText(step.label, {
      x, y: 4.3, w: 2.4, h: 0.8,
      fontSize: 13, fontFace: FONT, color: C.white, align: "center", bold: true,
    });
    s.addText(step.desc, {
      x, y: 5.1, w: 2.4, h: 0.7,
      fontSize: 10, fontFace: FONT_THAI, color: C.gray, align: "center",
    });
    // Arrow
    if (i < 4) {
      s.addText("→", {
        x: x + 2.1, y: 2.7, w: 0.5, h: 0.8,
        fontSize: 28, color: C.white, align: "center", valign: "middle",
      });
    }
  });
}

// ========== SLIDE 12: Summary ==========
{
  const s = pptx.addSlide();
  addBgAndDecor(s);
  addTitle(s, "สรุป & ขั้นตอนถัดไป");

  const deliverables = [
    { title: "Core Dashboard", desc: "ศูนย์บริหารรวม — จัดการพื้นที่ บูท รายได้" },
    { title: "Heatmap Analytics", desc: "ข้อมูลจริงจากเซนเซอร์ — ตัดสินใจด้วยข้อมูล" },
    { title: "Kiosk System", desc: "ให้บริการข้อมูลผู้ใช้ — เพิ่ม Engagement" },
    { title: "Web Application", desc: "เข้าถึงได้ทุกที่ — Admin, ผู้เช่า, ผู้บริหาร" },
    { title: "Revenue Optimization", desc: "ราคาค่าเช่าอิงข้อมูลจริง — เพิ่มรายได้" },
  ];

  deliverables.forEach((d, i) => {
    const x = 0.5 + (i % 3) * 4.2;
    const y = i < 3 ? 1.5 : 3.3;
    const w = i < 3 ? 3.9 : 3.9;
    addCard(s, x, y, w, 1.5, d.title, d.desc, "✓");
  });

  // Next steps
  s.addText("ขั้นตอนถัดไป", {
    x: 0.7, y: 5.2, w: 5, h: 0.4,
    fontSize: 16, fontFace: FONT_THAI, color: C.accent, bold: true,
  });

  const nextSteps = ["ยืนยัน Scope & Requirements", "UX/UI Design & Prototype", "พัฒนาระบบ + ติดตั้งเซนเซอร์", "ทดสอบ + Go Live"];
  nextSteps.forEach((step, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7 + i * 3.1, y: 5.8, w: 2.8, h: 0.8,
      fill: { color: i === 3 ? C.accent : C.bgLight },
      line: { color: C.accent, width: 1 },
      rectRadius: 0.1,
    });
    s.addText((i + 1) + ". " + step, {
      x: 0.7 + i * 3.1, y: 5.8, w: 2.8, h: 0.8,
      fontSize: 10, fontFace: FONT_THAI,
      color: i === 3 ? C.bg : C.white,
      align: "center", valign: "middle",
    });
  });

  // Company footer
  s.addText("NDF Co., Ltd.\nSmart Tourism Solution — Powered by DeepTrack", {
    x: 3, y: 6.8, w: 7, h: 0.5,
    fontSize: 10, fontFace: FONT, color: C.gray, align: "center",
  });
}

// ========== SAVE ==========
const outPath = path.join(__dirname, "SWT-Presentation-NDF.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("Created:", outPath);
});
