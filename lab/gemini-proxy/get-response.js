const mqtt = require("./node_modules/mqtt");
const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "wendys-read-" + Date.now(),
});

client.on("connect", () => {
  client.subscribe("claude/browser/response");

  const cmd = {
    action: "get_text",
    tabId: 544080899,
    id: "read_" + Date.now(),
  };
  client.publish("claude/browser/command", JSON.stringify(cmd));
  console.log("Requesting Gemini response text...");
});

client.on("message", (topic, msg) => {
  const data = JSON.parse(msg.toString());
  if (data.text) {
    console.log("=== Gemini Response ===");
    console.log(data.text);
    console.log("=== End ===");
  } else {
    console.log("Response:", JSON.stringify(data, null, 2));
  }
  client.end();
});

setTimeout(() => {
  console.log("Timeout");
  client.end();
}, 8000);
