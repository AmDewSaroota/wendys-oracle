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

// Cron: noon Thai (12:00 = 05:00 UTC) — สรุป session เช้าวันนี้
module.exports = async function handler(req, res) {
  const thaiNow = new Date(Date.now() + 7 * 3600000);
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric', month: 'short',
  });

  // Check rest day
  const configs = await supabaseGet('/rest/v1/sync_config?select=active_days&limit=1');
  if (configs && configs.length > 0 && configs[0].active_days) {
    const jsDay = thaiNow.getUTCDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    const activeDays = configs[0].active_days.split(',').map(d => parseInt(d.trim(), 10));
    if (!activeDays.includes(isoDay)) {
      const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
      const msg = `📅 วัน${dayNames[jsDay]} ${dateStr} — วันหยุด\nไม่มีการเก็บข้อมูลวันนี้ค่ะ`;
      const result = await lineBroadcast(msg);
      return res.status(200).json({ ok: true, rest_day: true, result });
    }
  }

  // Load active devices with house names
  const devices = await supabaseGet(
    `/rest/v1/devices?is_active=eq.true&select=tuya_device_id,subject_id,subjects(full_name)`
  );
  if (!devices || devices.length === 0) {
    return res.status(200).json({ ok: true, message: 'No active devices' });
  }

  // Query sessions for today
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${today}T00:00:00Z,started_at.lt.${tomorrow}T00:00:00Z)&select=id,device_id,session_status,readings_count,started_at,ended_at,notes`
  );

  // Build per-device status lines (Format C)
  const lines = [];

  const sorted = devices.slice().sort((a, b) => {
    const na = a.subjects?.full_name || '';
    const nb = b.subjects?.full_name || '';
    return na.localeCompare(nb, 'th');
  });

  for (const dev of sorted) {
    const name = dev.subjects?.full_name || dev.tuya_device_id.slice(-6);
    const devSessions = (sessions || []).filter(s => s.device_id === dev.tuya_device_id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');

    if (completed.length > 0) {
      lines.push(`✅ ${name}`);
    } else if (collecting.length > 0) {
      lines.push(`🔄 ${name}`);
    } else if (incomplete.length > 0) {
      let cause = '';
      const tuyaIssue = incomplete.some(s => (s.notes || '').includes('Tuya') || (s.notes || '').includes('tuya_api'));
      const offlineIssue = incomplete.some(s => (s.notes || '').includes('ออฟไลน์'));
      if (tuyaIssue) cause = ' [Tuya]';
      else if (offlineIssue) cause = ' [ออฟไลน์]';
      lines.push(`⚠️ ${name}${cause}`);
    } else {
      lines.push(`❌ ${name}`);
    }
  }

  const header = `📊 เช้า ${dateStr} (${devices.length} บ้าน)`;
  const msg = [header, '', ...lines].join('\n');

  const result = await lineBroadcast(msg);
  return res.status(200).json({ ok: true, devices: devices.length, sessions: (sessions || []).length, result });
};
