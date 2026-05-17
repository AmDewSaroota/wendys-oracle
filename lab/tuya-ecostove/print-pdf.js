const { chromium } = require('./deploy/tests/node_modules/playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = path.resolve(__dirname, 'deploy/guide-volunteer.html');
  await page.goto('file:///' + filePath.replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  await page.pdf({
    path: path.resolve(__dirname, 'VoluteerManual_11May2026.pdf'),
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '10mm', right: '0', bottom: '10mm', left: '0' }
  });
  await browser.close();
  console.log('Done');
})();
