const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// ─── In-memory follower store (demo only, use DB for production) ───
// Vercel serverless = stateless, so this resets on cold start
// For real use: store in Supabase
const followers = global._followers || (global._followers = new Map());

// ─── LINE API ───
function replyMessage(replyToken, messages) {
  return linePost('/v2/bot/message/reply', { replyToken, messages });
}

function linePost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const r = https.request({
      hostname: 'api.line.me', path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    r.on('error', reject);
    r.write(data);
    r.end();
  });
}

// ─── Get body ───
function getBody(req) {
  if (req.body) return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

// ─── Handle events ───
async function handleEvent(event) {
  const userId = event.source?.userId;

  // Follow — save follower
  if (event.type === 'follow' && userId) {
    followers.set(userId, { joinedAt: new Date().toISOString() });
    return replyMessage(event.replyToken, [{
      type: 'text',
      text: [
        'ยินดีต้อนรับสู่ EcoStove!',
        '',
        'บัญชีนี้ใช้แจ้งเตือนการเก็บข้อมูลคุณภาพอากาศ',
        '',
        'คุณจะได้รับ:',
        '- แจ้งงานประจำวัน',
        '- สรุปผลการเก็บข้อมูล',
        '- เตือนเมื่อมีปัญหา',
      ].join('\n'),
    }]);
  }

  // Unfollow — remove follower
  if (event.type === 'unfollow' && userId) {
    followers.delete(userId);
    return;
  }

  // Text message — minimal responses
  if (event.type === 'message' && event.message?.type === 'text') {
    // Save userId on any message (in case we missed the follow event)
    if (userId && !followers.has(userId)) {
      followers.set(userId, { joinedAt: new Date().toISOString() });
    }

    const text = event.message.text.trim();

    if (text === 'สรุป' || text === 'summary') {
      return replyMessage(event.replyToken, [{
        type: 'text',
        text: 'สรุปจะถูกส่งจากระบบอัตโนมัติค่ะ\nรอรับแจ้งเตือนได้เลย',
      }]);
    }

    // Default — don't spam, just a short note
    return replyMessage(event.replyToken, [{
      type: 'text',
      text: 'EcoStove Bot รับทราบค่ะ\nบัญชีนี้ใช้แจ้งเตือนจากระบบ',
    }]);
  }
}

// ─── Main handler ───
module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      bot: 'EcoStove',
      followers: followers.size,
    });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await getBody(req);
  const events = body.events || [];

  for (const event of events) {
    try { await handleEvent(event); }
    catch (err) { console.error('Event error:', err.message); }
  }

  return res.status(200).json({ ok: true });
};
