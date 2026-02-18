// Reusable chat sender
const mqtt = require("./node_modules/mqtt");

const text = process.argv[2];
if (!text) {
  console.error("Usage: node chat.js <message>");
  process.exit(1);
}

const tabId = parseInt(process.argv[3]) || 544080899;

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "wendys-chat-" + Date.now(),
});

client.on("connect", () => {
  client.subscribe("claude/browser/response");
  const cmd = { action: "chat", tabId, text, id: "chat_" + Date.now() };
  client.publish("claude/browser/command", JSON.stringify(cmd));
  console.log("Sent to Gemini (tab " + tabId + ")");
});

client.on("message", (topic, msg) => {
  const data = JSON.parse(msg.toString());
  console.log(data.success ? "OK" : "FAILED: " + data.error);
  client.end();
});

setTimeout(() => client.end(), 8000);
