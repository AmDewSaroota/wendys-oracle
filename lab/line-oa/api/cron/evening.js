const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

const MAX_SESSIONS = 2;

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

// Cron: 7 AM Thai (07:00 = 00:00 UTC) — สรุปประจำวันเมื่อวาน
module.exports = async function handler(req, res) {
  const thaiNow = new Date(Date.now() + 7 * 3600000);

  // Yesterday's date (Thai time)
  const yesterday = new Date(thaiNow.getTime() - 86400000);
  const yDate = yesterday.toISOString().split('T')[0];
  const yDateEnd = new Date(new Date(yDate + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const dateStr = yesterday.toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric', month: 'short',
  });

  // Check if yesterday was a rest day
  const configs = await supabaseGet('/rest/v1/sync_config?select=active_days&limit=1');
  if (configs && configs.length > 0 && configs[0].active_days) {
    const jsDay = yesterday.getUTCDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    const activeDays = configs[0].active_days.split(',').map(d => parseInt(d.trim(), 10));
    if (!activeDays.includes(isoDay)) {
      return res.status(200).json({ ok: true, rest_day: true, skipped: 'yesterday was rest day' });
    }
  }

  // Load active devices with house names
  const devices = await supabaseGet(
    `/rest/v1/devices?is_active=eq.true&select=tuya_device_id,subject_id,subjects(full_name)`
  );
  if (!devices || devices.length === 0) {
    return res.status(200).json({ ok: true, message: 'No active devices' });
  }

  // Query all sessions for yesterday
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${yDate}T00:00:00Z,started_at.lt.${yDateEnd}T00:00:00Z)&select=id,device_id,session_status,readings_count,started_at,ended_at,notes`
  );

  // Build per-device status lines (Format C)
  let totalReadings = 0;
  let totalSessions = 0;
  const lines = [];

  // Sort devices by house name
  const sorted = devices.slice().sort((a, b) => {
    const na = a.subjects?.full_name || '';
    const nb = b.subjects?.full_name || '';
    return na.localeCompare(nb, 'th');
  });

  for (const dev of sorted) {
    const name = dev.subjects?.full_name || dev.tuya_device_id.slice(-6);
    const devSessions = (sessions || []).filter(s => s.device_id === dev.tuya_device_id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');
    const total = devSessions.length;
    const readings = devSessions.reduce((sum, s) => sum + (s.readings_count || 0), 0);
    totalReadings += readings;
    totalSessions += total;

    if (completed.length >= MAX_SESSIONS) {
      lines.push(`✅ ${name}`);
    } else if (total > 0) {
      // Determine cause from incomplete sessions
      let cause = '';
      const tuyaIssue = incomplete.some(s => (s.notes || '').includes('Tuya') || (s.notes || '').includes('tuya_api'));
      const offlineIssue = incomplete.some(s => (s.notes || '').includes('ออฟไลน์'));
      if (tuyaIssue) cause = ' [Tuya]';
      else if (offlineIssue) cause = ' [ออฟไลน์]';
      lines.push(`⚠️ ${name} (${completed.length}/${MAX_SESSIONS})${cause}`);
    } else {
      lines.push(`❌ ${name}`);
    }
  }

  // Compose message
  const header = `📊 สรุป ${dateStr} (${devices.length} บ้าน)`;
  const stats = `${totalReadings.toLocaleString()} รายการ · ${totalSessions} sessions`;
  const msg = [header, stats, '', ...lines].join('\n');

  const result = await lineBroadcast(msg);
  return res.status(200).json({ ok: true, date: yDate, devices: devices.length, totalReadings, totalSessions, result });
};
