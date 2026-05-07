// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npx serve .. -p 3000 -n',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
