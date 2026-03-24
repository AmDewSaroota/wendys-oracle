const https = require('https');

module.exports = async function handler(req, res) {
  // Auth check — same secret as push endpoint
  const secret = req.headers['x-push-secret'] || req.query.secret;
  if (!process.env.PUSH_SECRET || secret !== process.env.PUSH_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  // Check if token exists on Vercel
  const tokenInfo = {
    exists: !!TOKEN,
    length: TOKEN ? TOKEN.length : 0,
    first10: TOKEN ? TOKEN.substring(0, 10) + '...' : 'N/A',
  };

  // Try calling LINE API to verify token works
  const botInfo = await new Promise((resolve) => {
    const options = {
      hostname: 'api.line.me',
      path: '/v2/bot/info',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.end();
  });

  return res.status(200).json({ tokenInfo, botInfo });
};
