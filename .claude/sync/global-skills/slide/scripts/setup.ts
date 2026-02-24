#!/usr/bin/env npx tsx
/**
 * One-time OAuth setup for Google Slides API.
 * Opens a browser window for Google account authorization.
 */

import { getAuthClient, CONFIG_DIR, CREDENTIALS_PATH, TOKEN_PATH } from "./auth.js";
import * as fs from "fs";

async function main() {
  console.log("\n=== WEnDyS Slide — Google API Setup ===\n");

  // Check credentials
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.log("Credentials file not found.");
    console.log(`\nPlease place your OAuth credentials at:\n  ${CREDENTIALS_PATH}\n`);
    console.log("How to get credentials:");
    console.log("1. Go to https://console.cloud.google.com/");
    console.log("2. Create or select a project");
    console.log("3. Go to APIs & Services > Library");
    console.log("4. Enable 'Google Slides API' and 'Google Drive API'");
    console.log("5. Go to APIs & Services > Credentials");
    console.log("6. Create Credentials > OAuth Client ID > Desktop App");
    console.log("7. Download JSON and save as:");
    console.log(`   ${CREDENTIALS_PATH}\n`);

    // Create config dir if needed
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    console.log(`Config directory created: ${CONFIG_DIR}`);
    process.exit(1);
  }

  console.log(`Credentials found: ${CREDENTIALS_PATH}`);

  // Authenticate
  console.log("\nOpening browser for Google authorization...");
  const auth = await getAuthClient();

  if (auth) {
    console.log("\nAuthentication successful!");
    console.log(`Token saved: ${TOKEN_PATH}`);
    console.log("\nYou're all set! The /slide skill is ready to use.\n");
  }
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  process.exit(1);
});
