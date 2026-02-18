const mqtt = require("./node_modules/mqtt");
const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "wendys-slides-" + Date.now(),
});

const slidePrompt = `สร้าง Google Slides ให้หน่อย 12 สไลด์ หัวข้อ Smart Tourism Web Application สำหรับ NDF Co., Ltd.

ออกแบบให้สวยงาม professional ใช้โทนสี dark blue + green

Slide 1 — Title: Smart Tourism Web Application / ระบบบริหารจัดการพื้นที่เชิงพาณิชย์อัจฉริยะ / Core Dashboard | Kiosk Display | Web Application / Powered by DeepTrack Sensor Technology / NDF Co., Ltd.

Slide 2 — System Overview: ข้อมูล → การวิเคราะห์ → การตัดสินใจ / 3 ส่วน: Input (Sensor System), Process (Core Dashboard), Output (Kiosk & Web App)

Slide 3 — Core Dashboard ภาพรวม: 7 modules - User Management, Space Management, Booth Management, Heatmap+Tracking, Revenue & Billing, Report Module, Notification System

Slide 4 — Space Management: Floor Plan ดิจิทัล, Heatmap ซ้อนทับ, แบ่งโซนราคา (Premium/Gold/Standard/Economy), Tourism Carrying Capacity

Slide 5 — Booth Management: จัดวางบูท, กำหนดราคาตาม Heatmap, ติดตามสถานะ real-time, จัดการสัญญา / ตัวอย่าง: Zone 13 traffic 8,000-11,000 คน/วัน = Premium 25,000-37,500 บาท/เดือน

Slide 6 — Heatmap & Analytics: DeepTrack วิเคราะห์ Unique Devices, Peak Hours, Movement Flow, Dwell Time / แสดงผล Daily Heatmap, Weekly Report, Sankey Diagram

Slide 7 — Revenue & Billing: Revenue Dashboard, Billing อัตโนมัติ, Occupancy Rate, Revenue Forecast / รวม 18 บูท = 315,600 บาท/เดือน

Slide 8 — Kiosk & Web App ภาพรวม: 2 ช่องทาง - ตู้ Kiosk (ติดตั้งในพื้นที่) + Web App (เข้าถึงทุกที่)

Slide 9 — Kiosk: แผนผัง Interactive, ข้อมูลร้านค้า, Wayfinding, ข้อมูลความพลุกพล่าน

Slide 10 — Web App: สำหรับ Admin (Dashboard+จัดการ), ผู้เช่า (สถิติ+บิล), ผู้บริหาร (Executive Dashboard)

Slide 11 — Data Flow: Sensor → Heatmap → Booth Pricing → Revenue → Output / ทุกขั้นตอนอัตโนมัติ

Slide 12 — สรุป: Core Dashboard, Heatmap Analytics, Kiosk System, Web App, Revenue Optimization / ขั้นตอนถัดไป: Scope → UX/UI → พัฒนา → Go Live`;

client.on("connect", () => {
  client.subscribe("claude/browser/response");

  const cmd = {
    action: "chat",
    tabId: 544080899,
    text: slidePrompt,
    id: "slides_" + Date.now(),
  };
  client.publish("claude/browser/command", JSON.stringify(cmd));
  console.log("Sent slide prompt to Gemini (" + slidePrompt.length + " chars)");
});

client.on("message", (topic, msg) => {
  const data = JSON.parse(msg.toString());
  console.log("Response:", data.success ? "SUCCESS" : "FAILED", data.error || "");
  client.end();
});

setTimeout(() => {
  console.log("Done");
  client.end();
}, 10000);
