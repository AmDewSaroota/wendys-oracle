#!/usr/bin/env bun
/**
 * Deep Research Automation Script
 *
 * Workflow:
 * 1. Create new Gemini tab
 * 2. Select Deep Research mode
 * 3. Send research prompt
 * 4. Click "Start research" button
 */

const MQTT_HOST = "localhost";
const MQTT_PORT = "1883";
const MQTT_TOPIC_CMD = "claude/browser/command";
const MQTT_TOPIC_RSP = "claude/browser/response";

// Resolve mosquitto path (support Windows Program Files or PATH)
const MOSQUITTO_PUB = process.platform === "win32"
  ? "C:\\Program Files\\mosquitto\\mosquitto_pub.exe"
  : "mosquitto_pub";
const MOSQUITTO_SUB = process.platform === "win32"
  ? "C:\\Program Files\\mosquitto\\mosquitto_sub.exe"
  : "mosquitto_sub";

// Get topic from arguments
const topic = Bun.argv.slice(2).join(" ");

if (!topic) {
  console.log("Usage: deep-research.ts <topic>");
  console.log("Example: deep-research.ts compare yeast S-33 vs T-58");
  process.exit(1);
}

console.log(`\n🔬 Deep Research: ${topic}\n`);

// Helper to publish MQTT command
async function mqttPub(payload: object): Promise<void> {
  const msg = JSON.stringify(payload);
  const proc = Bun.spawn([
    MOSQUITTO_PUB, "-h", MQTT_HOST, "-p", MQTT_PORT,
    "-t", MQTT_TOPIC_CMD, "-m", msg
  ]);
  await proc.exited;
}

// Helper to subscribe and wait for response
async function mqttSubOnce(timeoutSec: number = 10): Promise<string | null> {
  const proc = Bun.spawn([
    "mosquitto_sub", "-h", MQTT_HOST, "-p", MQTT_PORT,
    "-t", MQTT_TOPIC_RSP, "-C", "1", "-W", String(timeoutSec)
  ], { stdout: "pipe" });

  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output.trim() || null;
}

const ts = () => Date.now();

// Step 1: Create new Gemini tab
console.log("1️⃣ Creating new Gemini tab...");
await mqttPub({
  id: `newtab-${ts()}`,
  action: "create_tab",
  url: "https://gemini.google.com/app",
  ts: ts()
});
await Bun.sleep(4000);
console.log("   ✓ Tab created");

// Step 2: Select Deep Research mode
console.log("2️⃣ Selecting Deep Research mode...");
await mqttPub({
  id: `mode-${ts()}`,
  action: "select_mode",
  mode: "Deep Research",
  ts: ts()
});
await Bun.sleep(2000);
console.log("   ✓ Deep Research selected");

// Step 3: Send research prompt
console.log("3️⃣ Sending research prompt...");
await mqttPub({
  id: `chat-${ts()}`,
  action: "chat",
  text: topic,
  ts: ts()
});
await Bun.sleep(3000);
console.log("   ✓ Prompt sent");

// Step 4: Click "Start research" button
console.log("4️⃣ Starting research...");
await mqttPub({
  id: `click-${ts()}`,
  action: "clickText",
  text: "Start research",
  ts: ts()
});
console.log("   ✓ Research started!");

console.log("\n🎉 Deep Research is running! Check your Gemini tab.\n");
