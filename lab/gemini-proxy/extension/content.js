/**
 * Gemini Proxy - Content Script
 * Injected into gemini.google.com pages
 * Handles chat input, state detection, and text extraction
 */

(function () {
  if (window.__geminiProxyLoaded) return;
  window.__geminiProxyLoaded = true;

  console.log("[GeminiProxy] Content script loaded");

  // ========== Chat Input ==========

  function findInputArea() {
    // Gemini uses a rich text editor - try multiple selectors
    const selectors = [
      '.ql-editor[contenteditable="true"]',
      'rich-textarea [contenteditable="true"]',
      'div[contenteditable="true"][aria-label]',
      '.input-area [contenteditable="true"]',
      'rich-textarea',
      '[contenteditable="true"]',
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function findSendButton() {
    const selectors = [
      'button[aria-label="Send message"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="send"]',
      '.send-button',
      'button[data-test-id="send-button"]',
      // Gemini's send button is often a mat-icon-button
      'button.send-button',
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }

    // Fallback: find button with send icon near the input
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      const ariaLabel = btn.getAttribute("aria-label") || "";
      if (
        ariaLabel.toLowerCase().includes("send") ||
        ariaLabel.toLowerCase().includes("submit")
      ) {
        return btn;
      }
    }

    return null;
  }

  async function typeAndSend(text) {
    const input = findInputArea();
    if (!input) {
      throw new Error("Could not find Gemini input area");
    }

    // Focus the input
    input.focus();
    await sleep(100);

    // Clear existing content
    input.textContent = "";
    await sleep(50);

    // Set the text using multiple methods for reliability
    // Method 1: Direct textContent
    input.textContent = text;

    // Method 2: Also dispatch input events for framework detection
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(200);

    // If input is still empty, try clipboard paste
    if (!input.textContent.trim()) {
      // Use execCommand as fallback
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
      await sleep(200);
    }

    // Find and click send button
    await sleep(300);
    const sendBtn = findSendButton();
    if (sendBtn) {
      sendBtn.click();
      console.log("[GeminiProxy] Message sent via button click");
    } else {
      // Try Enter key as fallback
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
      );
      console.log("[GeminiProxy] Message sent via Enter key");
    }
  }

  // ========== State Detection ==========

  function getPageState() {
    // Check if Gemini is generating a response
    const loadingIndicators = [
      ".loading-indicator",
      ".generating",
      '[aria-label*="loading"]',
      '[aria-label*="generating"]',
      ".response-loading",
      "mat-progress-bar",
    ];

    let loading = false;
    for (const sel of loadingIndicators) {
      if (document.querySelector(sel)) {
        loading = true;
        break;
      }
    }

    // Count responses
    const responses = document.querySelectorAll(
      ".response-container, .model-response, .message-content"
    );

    return {
      loading,
      responseCount: responses.length,
      url: window.location.href,
      title: document.title,
    };
  }

  function getPageText() {
    // Get the latest response text
    const responses = document.querySelectorAll(
      ".response-container, .model-response, .message-content"
    );
    if (responses.length > 0) {
      const lastResponse = responses[responses.length - 1];
      return lastResponse.textContent.trim();
    }
    return document.body.innerText.substring(0, 5000);
  }

  // ========== Message Listener ==========

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.type) {
      case "GEMINI_CHAT":
        typeAndSend(msg.text)
          .then(() => sendResponse({ success: true }))
          .catch((e) => sendResponse({ success: false, error: e.message }));
        return true; // async response

      case "GET_TEXT":
        sendResponse({ text: getPageText() });
        break;

      case "GET_STATE":
        sendResponse(getPageState());
        break;

      case "SELECT_MODEL":
        // Model selection would require clicking the model dropdown
        // This is Gemini-version-specific, simplified for now
        sendResponse({ success: true, note: "Model selection not yet implemented" });
        break;

      default:
        sendResponse({ error: "Unknown message type" });
    }
  });

  // ========== Helpers ==========

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  console.log("[GeminiProxy] Content script ready");
})();
