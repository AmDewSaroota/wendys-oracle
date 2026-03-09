const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

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

  // Load active devices with house names from DB
  const devices = await supabaseGet(
    `/rest/v1/devices?is_active=eq.true&select=tuya_device_id,subject_id,subjects(full_name)`
  );
  if (!devices || devices.length === 0) {
    return res.status(200).json({ ok: true, message: 'No active devices' });
  }

  // Query sessions for today
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${today}T00:00:00Z,started_at.lt.${tomorrow}T00:00:00Z)&select=id,device_id,session_status,readings_count,avg_pm25,started_at,ended_at,notes`
  );

  const lines = [`สรุปเก็บข้อมูลเช้า (${dateStr})`, ''];
  const collected = [];
  const missing = [];

  for (const dev of devices) {
    const name = dev.subjects?.full_name || dev.tuya_device_id.slice(-6);
    const devSessions = (sessions || []).filter(s => s.device_id === dev.tuya_device_id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');

    if (completed.length > 0) {
      const s = completed[0];
      const readings = s.readings_count || 0;
      const pm25 = s.avg_pm25 != null ? s.avg_pm25.toFixed(1) : '-';
      lines.push(`✅ ${name} — เก็บแล้ว (${readings} รายการ, PM2.5 ${pm25})`);
      collected.push(name);
    } else if (collecting.length > 0) {
      const s = collecting[0];
      lines.push(`🔄 ${name} — กำลังเก็บ (${s.readings_count || 0} รายการ)`);
      collected.push(name);
    } else if (incomplete.length > 0) {
      const s = incomplete[0];
      const readings = s.readings_count || 0;
      const pm25 = s.avg_pm25 != null ? s.avg_pm25.toFixed(1) : '-';
      const notes = s.notes || '';
      const isTuya = notes.includes('Tuya') || notes.includes('tuya_api');
      const isOffline = notes.includes('ออฟไลน์');
      const cause = isTuya ? ' [Tuya Cloud ขัดข้อง]' : isOffline ? ' [เซนเซอร์ออฟไลน์]' : '';
      lines.push(`⚠️ ${name} — เก็บไม่ครบ (${readings} รายการ, PM2.5 ${pm25})${cause}`);
      missing.push(name);
    } else {
      lines.push(`❌ ${name} — ยังไม่มีข้อมูล`);
      missing.push(name);
    }
  }

  lines.push('', `เก็บได้: ${collected.length}/${devices.length} บ้าน`);

  const result = await lineBroadcast(lines.join('\n'));
  return res.status(200).json({ ok: true, devices: devices.length, collected: collected.length, sessions: (sessions || []).length, result });
};
