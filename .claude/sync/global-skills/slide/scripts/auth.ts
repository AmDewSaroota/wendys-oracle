import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { homedir } from "os";

const CONFIG_DIR = path.join(homedir(), ".config", "wendys-slide");
const CREDENTIALS_PATH = path.join(CONFIG_DIR, "credentials.json");
const TOKEN_PATH = path.join(CONFIG_DIR, "token.json");

const SCOPES = [
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/drive.file",
];

export { CONFIG_DIR, CREDENTIALS_PATH, TOKEN_PATH, SCOPES };

export async function getAuthClient() {
  // Check credentials exist
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`\nCredentials not found at: ${CREDENTIALS_PATH}`);
    console.error("\nSetup steps:");
    console.error("1. Go to https://console.cloud.google.com/");
    console.error("2. Create/select a project");
    console.error("3. Enable Google Slides API and Google Drive API");
    console.error("4. Create OAuth 2.0 credentials (Desktop App)");
    console.error(`5. Download and save as: ${CREDENTIALS_PATH}`);
    console.error("6. Run: npx tsx scripts/setup.ts\n");
    process.exit(1);
  }

  // Try loading saved token
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      const content = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
      const keys = JSON.parse(content);
      const key = keys.installed || keys.web;

      const auth = new google.auth.OAuth2(
        key.client_id,
        key.client_secret,
        key.redirect_uris?.[0] || "http://localhost",
      );

      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
      auth.setCredentials(token);

      // Auto-refresh token
      auth.on("tokens", (newTokens) => {
        const merged = { ...token, ...newTokens };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
      });

      return auth;
    } catch (err: any) {
      console.log("Token invalid, re-authenticating...");
    }
  }

  // Interactive OAuth flow
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Save token
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  if (auth.credentials) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2));
    console.log(`Token saved to: ${TOKEN_PATH}`);
  }

  return auth;
}
