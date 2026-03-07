const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

const DEVICES = [
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT29 (ตัวเดิม)' },
  { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W (ตัวใหม่)' },
];

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

function lineBroadcast(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ messages: [{ type: 'text', text }] });
    const r = https.request({
      hostname: 'api.line.me',
      path: '/v2/bot/message/broadcast',
      method: 'POST',
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

// Cron: noon Thai (12:00 = 05:00 UTC) — สรุปการเก็บข้อมูลช่วงเช้า
module.exports = async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric', month: 'long',
  });

  // Query sessions for today (use and() to avoid duplicate param issue)
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${today}T00:00:00Z,started_at.lt.${tomorrow}T00:00:00Z)&select=id,device_id,session_status,readings_count,avg_pm25,started_at,ended_at,notes`
  );

  const lines = [`สรุปเก็บข้อมูลเช้า (${dateStr})`, ''];

  let allCollected = true;

  for (const dev of DEVICES) {
    const devSessions = (sessions || []).filter(s => s.device_id === dev.id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');

    if (completed.length > 0) {
      const s = completed[0];
      const readings = s.readings_count || 0;
      const pm25 = s.avg_pm25 != null ? s.avg_pm25.toFixed(1) : '-';
      lines.push(`✅ ${dev.name} — เก็บแล้ว (${readings} รายการ, PM2.5 เฉลี่ย ${pm25})`);
    } else if (collecting.length > 0) {
      const s = collecting[0];
      lines.push(`🔄 ${dev.name} — กำลังเก็บ (${s.readings_count || 0} รายการ)`);
    } else if (incomplete.length > 0) {
      const s = incomplete[0];
      const readings = s.readings_count || 0;
      const pm25 = s.avg_pm25 != null ? s.avg_pm25.toFixed(1) : '-';
      const reason = s.notes ? `\n   → สาเหตุ: ${s.notes}` : '';
      lines.push(`⚠️ ${dev.name} — เก็บไม่ครบ (${readings}/26 รายการ, PM2.5 ${pm25})${reason}`);
      allCollected = false;
    } else {
      lines.push(`❌ ${dev.name} — ยังไม่ได้เปิดเซนเซอร์`);
      allCollected = false;
    }
  }

  if (!allCollected) {
    lines.push('', 'กรุณาแจ้งเตือนบ้านที่ยังไม่เปิดเซนเซอร์ค่ะ');
  }

  const result = await lineBroadcast(lines.join('\n'));
  return res.status(200).json({ ok: true, sessions: (sessions || []).length, result });
};
