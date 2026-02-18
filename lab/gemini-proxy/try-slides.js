const mqtt = require("./node_modules/mqtt");
const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "wendys-newslides-" + Date.now(),
});

// Step 1: Create new tab
// Step 2: Wait for load
// Step 3: Send prompt

client.on("connect", () => {
  client.subscribe("claude/browser/response");

  // Create new Gemini tab
  const cmd = { action: "create_tab", id: "newtab_" + Date.now() };
  client.publish("claude/browser/command", JSON.stringify(cmd));
  console.log("Creating new Gemini tab...");
});

let step = 0;
let newTabId = null;

client.on("message", (topic, msg) => {
  const data = JSON.parse(msg.toString());

  if (step === 0 && data.tabId) {
    newTabId = data.tabId;
    console.log("New tab created:", newTabId);
    console.log("Waiting 5s for page to load...");

    setTimeout(() => {
      step = 1;
      const prompt = `Create a Google Slides presentation about "Smart Tourism Web Application" for NDF Co., Ltd.

The presentation should have 12 slides:
1. Title slide - "Smart Tourism Web Application" - ระบบบริหารจัดการพื้นที่เชิงพาณิชย์อัจฉริยะ
2. System Overview - Input (Sensors) → Process (Dashboard) → Output (Kiosk & Web App)
3. Core Dashboard - 7 modules overview
4. Space Management - Digital Floor Plan with Heatmap
5. Booth Management - Dynamic pricing based on traffic data
6. Heatmap Analytics - DeepTrack sensor analysis
7. Revenue & Billing - Total 18 booths = 315,600 THB/month
8. Kiosk & Web App overview - 2 channels
9. Kiosk details - Interactive map, wayfinding
10. Web App - Role-based access for Admin, Tenants, Executives
11. Data Flow automation - Sensor to Revenue pipeline
12. Summary & Next Steps

Please create this directly in Google Slides with a professional dark theme design. Use the "Create in Slides" feature.`;

      const chatCmd = {
        action: "chat",
        tabId: newTabId,
        text: prompt,
        id: "slides2_" + Date.now(),
      };
      client.publish("claude/browser/command", JSON.stringify(chatCmd));
      console.log("Sent slides prompt to new tab");
    }, 5000);
  }

  if (step === 1 && data.action === "chat") {
    console.log("Chat sent:", data.success ? "OK" : "FAILED");
    client.end();
  }
});

setTimeout(() => {
  console.log("Done");
  client.end();
}, 20000);
