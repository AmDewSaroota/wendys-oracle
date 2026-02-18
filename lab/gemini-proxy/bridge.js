/**
 * Gemini Proxy Bridge
 * Translates between MQTT (port 1883) and plain WebSocket (port 8765)
 *
 * Claude/Node scripts → MQTT → Bridge → WebSocket → Chrome Extension → Gemini
 *
 * Usage: node bridge.js
 */

const mqtt = require("./node_modules/mqtt");
const { WebSocketServer } = require("./node_modules/ws");

const MQTT_URL = "mqtt://localhost:1883";
const WS_PORT = 8765;

const TOPIC_CMD = "claude/browser/command";
const TOPIC_RES = "claude/browser/response";
const TOPIC_STATUS = "claude/browser/status";

// ========== WebSocket Server (for Chrome Extension) ==========

const wss = new WebSocketServer({ port: WS_PORT });
let extensionWs = null;

wss.on("connection", (ws) => {
  console.log("[Bridge] Extension connected via WebSocket");
  extensionWs = ws;

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      // Forward extension responses to MQTT
      if (msg.type === "response") {
        mqttClient.publish(TOPIC_RES, JSON.stringify(msg.data));
        console.log("[Bridge] → MQTT response:", msg.data.action, msg.data.id);
      } else if (msg.type === "status") {
        mqttClient.publish(TOPIC_STATUS, JSON.stringify(msg.data));
        console.log("[Bridge] → MQTT status:", JSON.stringify(msg.data));
      }
    } catch (e) {
      console.error("[Bridge] Parse error:", e.message);
    }
  });

  ws.on("close", () => {
    console.log("[Bridge] Extension disconnected");
    extensionWs = null;
  });
});

console.log(`[Bridge] WebSocket server on ws://localhost:${WS_PORT}`);

// ========== MQTT Client (for Claude/Node scripts) ==========

const mqttClient = mqtt.connect(MQTT_URL, {
  clientId: "gemini-bridge-" + Date.now(),
});

mqttClient.on("connect", () => {
  console.log("[Bridge] MQTT connected to", MQTT_URL);

  mqttClient.subscribe(TOPIC_CMD, (err) => {
    if (err) console.error("[Bridge] Subscribe error:", err);
    else console.log("[Bridge] Subscribed to", TOPIC_CMD);
  });
});

mqttClient.on("message", (topic, message) => {
  if (topic === TOPIC_CMD) {
    const cmd = JSON.parse(message.toString());
    console.log("[Bridge] ← MQTT command:", cmd.action, cmd.id);

    // Forward to extension via WebSocket
    if (extensionWs && extensionWs.readyState === 1) {
      extensionWs.send(JSON.stringify({ type: "command", data: cmd }));
    } else {
      console.log("[Bridge] No extension connected, replying error");
      mqttClient.publish(
        TOPIC_RES,
        JSON.stringify({
          id: cmd.id,
          action: cmd.action,
          success: false,
          error: "Extension not connected",
        })
      );
    }
  }
});

mqttClient.on("error", (err) => {
  console.error("[Bridge] MQTT error:", err.message);
});

console.log("[Bridge] Gemini Proxy Bridge running");
console.log("[Bridge] MQTT:", MQTT_URL, "| WS: ws://localhost:" + WS_PORT);
console.log("[Bridge] Waiting for extension to connect...");
