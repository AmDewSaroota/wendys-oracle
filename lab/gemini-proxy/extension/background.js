/**
 * Gemini Proxy Extension - Background Service Worker
 * Connects to Bridge via plain WebSocket (no MQTT library needed)
 */

const BRIDGE_URL = "ws://localhost:8765";
let ws = null;
let connected = false;
let reconnectTimer = null;
let geminiTabs = new Map();

// ========== WebSocket Connection to Bridge ==========

function connectBridge() {
  console.log("[GeminiProxy] Connecting to bridge...", BRIDGE_URL);

  try {
    ws = new WebSocket(BRIDGE_URL);

    ws.onopen = () => {
      connected = true;
      console.log("[GeminiProxy] Connected to bridge!");

      ws.send(JSON.stringify({
        type: "status",
        data: { online: true, version: "1.0.0", timestamp: Date.now() }
      }));

      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
      scanGeminiTabs();
    };

    ws.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === "command") {
          console.log("[GeminiProxy] Command:", msg.data.action);
          handleCommand(msg.data);
        }
      } catch (e) {
        console.error("[GeminiProxy] Parse error:", e);
      }
    };

    ws.onclose = () => {
      connected = false;
      console.log("[GeminiProxy] Disconnected from bridge");
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
      scheduleReconnect();
    };

    ws.onerror = () => {
      console.error("[GeminiProxy] WebSocket error");
      connected = false;
    };
  } catch (e) {
    console.error("[GeminiProxy] Connection failed:", e);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    console.log("[GeminiProxy] Reconnecting...");
    connectBridge();
  }, 3000);
}

function sendResponse(data) {
  if (ws && connected) {
    ws.send(JSON.stringify({ type: "response", data }));
  }
}

// ========== Tab Management ==========

async function scanGeminiTabs() {
  const tabs = await chrome.tabs.query({ url: "https://gemini.google.com/*" });
  geminiTabs.clear();
  tabs.forEach(t => geminiTabs.set(t.id, { url: t.url, title: t.title }));
  console.log("[GeminiProxy] Found", geminiTabs.size, "Gemini tabs");
}

chrome.tabs.onUpdated.addListener((tabId, _ci, tab) => {
  if (tab.url && tab.url.includes("gemini.google.com")) {
    geminiTabs.set(tabId, { url: tab.url, title: tab.title });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => geminiTabs.delete(tabId));

// ========== Command Handler ==========

async function handleCommand(cmd) {
  const { action, id } = cmd;
  let response = { id, action, success: true };

  try {
    switch (action) {
      case "list_tabs": {
        await scanGeminiTabs();
        const tabs = [];
        geminiTabs.forEach((info, tabId) => tabs.push({ tabId, ...info }));
        response.tabs = tabs;
        response.count = tabs.length;
        break;
      }

      case "create_tab": {
        const tab = await chrome.tabs.create({
          url: "https://gemini.google.com/app",
          active: true,
        });
        geminiTabs.set(tab.id, { url: tab.url, title: tab.title });
        response.tabId = tab.id;
        break;
      }

      case "focus_tab": {
        if (cmd.tabId) {
          await chrome.tabs.update(cmd.tabId, { active: true });
          const tab = await chrome.tabs.get(cmd.tabId);
          await chrome.windows.update(tab.windowId, { focused: true });
        }
        break;
      }

      case "chat": {
        if (!cmd.text) {
          response.success = false;
          response.error = "No text provided";
          break;
        }

        let targetTabId = cmd.tabId;
        if (!targetTabId) {
          await scanGeminiTabs();
          const firstKey = geminiTabs.keys().next().value;
          if (!firstKey) {
            const newTab = await chrome.tabs.create({
              url: "https://gemini.google.com/app",
              active: true,
            });
            targetTabId = newTab.id;
            geminiTabs.set(newTab.id, { url: newTab.url, title: newTab.title });
            await new Promise(r => setTimeout(r, 4000));
          } else {
            targetTabId = firstKey;
          }
        }

        try {
          await chrome.tabs.sendMessage(targetTabId, {
            type: "GEMINI_CHAT",
            text: cmd.text,
          });
          response.tabId = targetTabId;
        } catch (e) {
          await chrome.scripting.executeScript({
            target: { tabId: targetTabId },
            files: ["content.js"],
          });
          await new Promise(r => setTimeout(r, 500));
          await chrome.tabs.sendMessage(targetTabId, {
            type: "GEMINI_CHAT",
            text: cmd.text,
          });
          response.tabId = targetTabId;
        }
        break;
      }

      case "get_url": {
        if (cmd.tabId) {
          const tab = await chrome.tabs.get(cmd.tabId);
          response.url = tab.url;
          response.title = tab.title;
        }
        break;
      }

      case "get_text": {
        if (cmd.tabId) {
          try {
            const result = await chrome.tabs.sendMessage(cmd.tabId, { type: "GET_TEXT" });
            response.text = result.text;
          } catch (e) {
            // Fallback: inject script to get text directly
            const [res] = await chrome.scripting.executeScript({
              target: { tabId: cmd.tabId },
              func: () => document.body.innerText.substring(0, 10000),
            });
            response.text = res.result;
          }
        }
        break;
      }

      case "execute": {
        if (cmd.tabId && cmd.code) {
          const [res] = await chrome.scripting.executeScript({
            target: { tabId: cmd.tabId },
            func: new Function("return (" + cmd.code + ")"),
          });
          response.result = res.result;
        }
        break;
      }

      case "get_state": {
        if (cmd.tabId) {
          const result = await chrome.tabs.sendMessage(cmd.tabId, { type: "GET_STATE" });
          Object.assign(response, result);
        }
        break;
      }

      case "inject_badge": {
        if (cmd.tabId) {
          await chrome.scripting.executeScript({
            target: { tabId: cmd.tabId },
            func: (text) => {
              let badge = document.getElementById("claude-proxy-badge");
              if (!badge) {
                badge = document.createElement("div");
                badge.id = "claude-proxy-badge";
                badge.style.cssText = "position:fixed;top:8px;right:8px;z-index:99999;background:#22c55e;color:white;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.2);";
                document.body.appendChild(badge);
              }
              badge.textContent = text;
              setTimeout(() => badge.remove(), 5000);
            },
            args: [cmd.text || "CLAUDE"],
          });
          response.injected = true;
        }
        break;
      }

      default:
        response.success = false;
        response.error = "Unknown action: " + action;
    }
  } catch (e) {
    response.success = false;
    response.error = e.message;
  }

  sendResponse(response);
  console.log("[GeminiProxy] Response:", action, response.success);
}

// ========== Start ==========

connectBridge();
console.log("[GeminiProxy] Extension loaded v1.0.0");
