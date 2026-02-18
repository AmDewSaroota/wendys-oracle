/**
 * Gemini Proxy - Popup Script
 */

async function updateStatus() {
  const dot = document.getElementById("mqttDot");
  const status = document.getElementById("mqttStatus");
  const tabList = document.getElementById("tabList");

  // Check MQTT by trying WebSocket
  try {
    const ws = new WebSocket("ws://localhost:9001", "mqtt");
    await new Promise((resolve, reject) => {
      ws.onopen = () => { resolve(); ws.close(); };
      ws.onerror = reject;
      setTimeout(reject, 2000);
    });
    dot.className = "dot on";
    status.textContent = "MQTT Connected";
  } catch (e) {
    dot.className = "dot off";
    status.textContent = "MQTT Disconnected";
  }

  // List Gemini tabs
  try {
    const tabs = await chrome.tabs.query({ url: "https://gemini.google.com/*" });
    if (tabs.length === 0) {
      tabList.textContent = "No Gemini tabs open";
    } else {
      tabList.innerHTML = tabs
        .map(t => `<div class="tab-item">${t.id}: ${t.title || 'Loading...'}</div>`)
        .join("");
    }
  } catch (e) {
    tabList.textContent = "Error: " + e.message;
  }
}

document.getElementById("refreshBtn").addEventListener("click", updateStatus);
updateStatus();
