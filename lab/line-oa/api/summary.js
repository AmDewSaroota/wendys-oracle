const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const PUSH_SECRET = process.env.PUSH_SECRET || 'ecostove-dev-2026';
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

// ─── Supabase query helper ───
function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SB_URL);
    const r = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve([]); }
      });
    });
    r.on('error', reject);
    r.end();
  });
}

// ─── LINE push ───
function lineBroadcast(text) {
  return linePost('/v2/bot/message/broadcast', {
    messages: [{ type: 'text', text }],
  });
}

function linePush(to, text) {
  return linePost('/v2/bot/message/push', {
    to, messages: [{ type: 'text', text }],
  });
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

// ─── Build summary from Supabase data ───
async function buildSummary() {
  const today = new Date().toISOString().split('T')[0];

  // Get today's pollution logs
  const logs = await supabaseGet(
    `/rest/v1/pollution_logs?recorded_at=gte.${today}T00:00:00&order=recorded_at.desc`
  );

  if (!logs || logs.length === 0) {
    return { text: 'ไม่มีข้อมูลวันนี้ค่ะ', stats: null };
  }

  const pending = logs.filter(l => l.status === 'pending');
  const approved = logs.filter(l => l.status === 'approved');

  // Calculate averages from all logs
  const avgPM25 = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + (l.pm25_value || 0), 0) / logs.length)
    : 0;
  const avgCO2 = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + (l.co2_value || 0), 0) / logs.length)
    : 0;
  const avgTemp = logs.length > 0
    ? (logs.reduce((s, l) => s + (l.temperature || 0), 0) / logs.length).toFixed(1)
    : 0;

  // Unique devices
  const devices = [...new Set(logs.map(l => l.tuya_device_id))];

  const stats = {
    total: logs.length,
    pending: pending.length,
    approved: approved.length,
    avgPM25,
    avgCO2,
    avgTemp,
    devices: devices.length,
  };

  const lines = [
    `สรุป EcoStove (${today})`,
    '',
    `ข้อมูลทั้งหมด: ${stats.total} รายการ`,
    `อนุมัติแล้ว: ${stats.approved} | รออนุมัติ: ${stats.pending}`,
    '',
    `PM2.5 เฉลี่ย: ${stats.avgPM25} ug/m3`,
    `CO2 เฉลี่ย: ${stats.avgCO2} ppm`,
    `อุณหภูมิเฉลี่ย: ${stats.avgTemp} C`,
    '',
    `เซนเซอร์ที่ส่งข้อมูล: ${stats.devices} ตัว`,
  ];

  if (stats.pending > 0) {
    lines.push('', `มี ${stats.pending} รายการรออนุมัติ`, 'กรุณาเข้า Dashboard เพื่ออนุมัติข้อมูล');
  }

  return { text: lines.join('\n'), stats };
}

// ─── Handler ───
// GET  /api/summary         → view today's summary (no push)
// POST /api/summary         → build & push summary via LINE
// POST /api/summary?to=xxx  → push to specific user
module.exports = async function handler(req, res) {
  // GET = preview summary without sending
  if (req.method === 'GET') {
    try {
      const { text, stats } = await buildSummary();
      return res.status(200).json({ preview: true, text, stats });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check
  const secret = req.headers['x-push-secret'];
  if (secret !== PUSH_SECRET) {
    return res.status(401).json({ error: 'Invalid push secret' });
  }

  try {
    const { text, stats } = await buildSummary();
    const to = req.query?.to || new URL(req.url, 'http://localhost').searchParams.get('to');

    let result;
    if (to) {
      result = await linePush(to, text);
    } else {
      result = await lineBroadcast(text);
    }

    return res.status(200).json({ ok: true, stats, result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
