// Read Gemini page text via inject script
const mqtt = require("./node_modules/mqtt");

const tabId = parseInt(process.argv[2]) || 544080899;

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: "wendys-read-" + Date.now(),
});

client.on("connect", () => {
  client.subscribe("claude/browser/response");

  // Use inject_badge action but repurpose to extract text
  // Actually, let's send a custom execute command
  const cmd = {
    action: "execute",
    tabId,
    id: "exec_" + Date.now(),
    code: "document.body.innerText.substring(0, 8000)",
  };
  client.publish("claude/browser/command", JSON.stringify(cmd));
  console.log("Requesting page text...");
});

client.on("message", (topic, msg) => {
  const data = JSON.parse(msg.toString());
  if (data.result) {
    console.log(data.result);
  } else if (data.error) {
    console.log("Error:", data.error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
  client.end();
});

setTimeout(() => {
  console.log("Timeout");
  client.end();
}, 8000);
