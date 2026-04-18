const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  const weights = [
    ['Regular', '400'],
    ['SemiBold', '600'],
    ['Bold', '700']
  ];

  for (const [name, weight] of weights) {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Sarabun:wght@${weight}&display=swap`;
    console.log(`Fetching CSS for ${name} (${weight})...`);
    const cssData = await fetch(cssUrl);
    const css = cssData.toString();

    const match = css.match(/url\((https:\/\/[^)]+)\)/);
    if (!match) {
      console.log('  No URL found. CSS:', css.substring(0, 300));
      continue;
    }

    const fontUrl = match[1];
    console.log(`  Font URL: ${fontUrl}`);

    const fontData = await fetch(fontUrl);
    const outPath = `c:/Users/CPL/wendys-oracle/ψ/active/sarabun-${name.toLowerCase()}.woff2`;
    fs.writeFileSync(outPath, fontData);
    console.log(`  Saved: ${outPath} (${fontData.length} bytes)`);

    // Also save base64
    const b64 = fontData.toString('base64');
    fs.writeFileSync(`c:/Users/CPL/wendys-oracle/ψ/active/sarabun-${name.toLowerCase()}-b64.txt`, b64);
  }

  console.log('Done!');
}

main().catch(e => console.error(e));
