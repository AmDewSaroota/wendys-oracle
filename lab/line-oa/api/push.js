const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const PUSH_SECRET = process.env.PUSH_SECRET || 'ecostove-dev-2026';

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

// ─── Push API ───
// Dashboard calls this to send notifications
//
// POST /api/push
// Headers: { "x-push-secret": "ecostove-dev-2026" }
// Body:
//   Broadcast to all followers:
//     { "type": "broadcast", "message": "..." }
//
//   Push to specific user:
//     { "type": "push", "to": "userId", "message": "..." }
//
//   Send daily summary (formatted):
//     { "type": "summary", "data": { "date": "26 ก.พ.", "total": 10, "success": 8, "failed": ["บ้าน 5", "บ้าน 9"], "avgPM25": 42 } }
//
//   Send task assignment:
//     { "type": "assign", "data": { "houses": ["บ้าน 1", "บ้าน 3", "บ้าน 7"] } }

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      endpoints: ['broadcast', 'push', 'summary', 'assign'],
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check
  const secret = req.headers['x-push-secret'];
  if (secret !== PUSH_SECRET) {
    return res.status(401).json({ error: 'Invalid push secret' });
  }

  const body = await getBody(req);
  let result;

  switch (body.type) {
    // ─── Broadcast text to all followers ───
    case 'broadcast': {
      result = await linePost('/v2/bot/message/broadcast', {
        messages: [{ type: 'text', text: body.message }],
      });
      break;
    }

    // ─── Push to specific user ───
    case 'push': {
      if (!body.to) return res.status(400).json({ error: 'Missing "to" userId' });
      result = await linePost('/v2/bot/message/push', {
        to: body.to,
        messages: [{ type: 'text', text: body.message }],
      });
      break;
    }

    // ─── Daily summary (formatted) ───
    case 'summary': {
      const d = body.data || {};
      const lines = [
        `สรุปวันนี้ (${d.date || 'N/A'})`,
        '',
        `เก็บสำเร็จ: ${d.success || 0}/${d.total || 0} บ้าน`,
      ];
      if (d.failed && d.failed.length > 0) {
        lines.push(`ขาด: ${d.failed.join(', ')}`);
      }
      if (d.avgPM25 !== undefined) {
        lines.push(`PM2.5 เฉลี่ย: ${d.avgPM25} ug/m3`);
      }
      lines.push('', 'ดูเพิ่มเติมที่ Dashboard');

      result = await linePost('/v2/bot/message/broadcast', {
        messages: [{ type: 'text', text: lines.join('\n') }],
      });
      break;
    }

    // ─── Task assignment ───
    case 'assign': {
      const d = body.data || {};
      const houses = d.houses || [];
      const lines = [
        'แจ้งงานวันนี้',
        '',
        ...houses.map((h, i) => `${i + 1}. ${h}`),
        '',
        'กรุณาเปิด Hotspot ขณะเก็บข้อมูลนะคะ',
      ];

      if (body.to) {
        result = await linePost('/v2/bot/message/push', {
          to: body.to,
          messages: [{ type: 'text', text: lines.join('\n') }],
        });
      } else {
        result = await linePost('/v2/bot/message/broadcast', {
          messages: [{ type: 'text', text: lines.join('\n') }],
        });
      }
      break;
    }

    default:
      return res.status(400).json({ error: `Unknown type: ${body.type}` });
  }

  return res.status(200).json({ ok: true, result });
};
