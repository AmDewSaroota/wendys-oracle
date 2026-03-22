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

// Cron: 8 PM Thai (20:00 = 13:00 UTC) — สรุปการเก็บข้อมูลทั้งวัน
module.exports = async function handler(req, res) {
  const thaiNow = new Date(Date.now() + 7 * 3600000);
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric', month: 'long',
  });

  // Check rest day from sync_config — skip notification entirely
  const configs = await supabaseGet('/rest/v1/sync_config?select=active_days&limit=1');
  if (configs && configs.length > 0 && configs[0].active_days) {
    const jsDay = thaiNow.getUTCDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    const activeDays = configs[0].active_days.split(',').map(d => parseInt(d.trim(), 10));
    if (!activeDays.includes(isoDay)) {
      return res.status(200).json({ ok: true, rest_day: true, skipped: 'rest day notification already sent in morning' });
    }
  }

  // Load active devices with house names from DB
  const devices = await supabaseGet(
    `/rest/v1/devices?is_active=eq.true&select=tuya_device_id,subject_id,subjects(full_name)`
  );
  if (!devices || devices.length === 0) {
    return res.status(200).json({ ok: true, message: 'No active devices' });
  }

  // Query all sessions for today
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${today}T00:00:00Z,started_at.lt.${tomorrow}T00:00:00Z)&select=id,device_id,session_status,readings_count,avg_pm25,started_at,ended_at,notes`
  );

  // Categorize devices
  let totalReadings = 0;
  const stats = { full: 0, partial: [], noData: [] };

  for (const dev of devices) {
    const name = dev.subjects?.full_name || dev.tuya_device_id.slice(-6);
    const devSessions = (sessions || []).filter(s => s.device_id === dev.tuya_device_id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');
    const total = completed.length + incomplete.length + collecting.length;
    const readings = devSessions.reduce((sum, s) => sum + (s.readings_count || 0), 0);
    totalReadings += readings;

    if (completed.length >= MAX_SESSIONS) {
      stats.full++;
    } else if (total > 0) {
      const detail = [];
      if (completed.length > 0) detail.push(`${completed.length} สำเร็จ`);
      if (incomplete.length > 0) {
        const tuyaCount = incomplete.filter(s => (s.notes || '').includes('Tuya') || (s.notes || '').includes('tuya_api')).length;
        const offlineCount = incomplete.filter(s => (s.notes || '').includes('ออฟไลน์')).length;
        let cause = '';
        if (tuyaCount > 0) cause = ' [Tuya ขัดข้อง]';
        else if (offlineCount > 0) cause = ' [ออฟไลน์]';
        detail.push(`${incomplete.length} ไม่ครบ${cause}`);
      }
      if (collecting.length > 0) detail.push(`${collecting.length} กำลังเก็บ`);
      stats.partial.push({ name, total, detail: detail.join(', ') });
    } else {
      stats.noData.push(name);
    }
  }

  // Build compact summary
  const lines = [`สรุปประจำวัน (${dateStr})`, ''];
  const parts = [];
  if (stats.full > 0) parts.push(`✅ ครบ ${stats.full}`);
  if (stats.partial.length > 0) parts.push(`⚠️ ไม่ครบ ${stats.partial.length}`);
  if (stats.noData.length > 0) parts.push(`❌ ไม่มีข้อมูล ${stats.noData.length}`);
  lines.push(parts.join(' · '));
  lines.push(`รวม ${totalReadings.toLocaleString()} รายการ จาก ${(sessions || []).length} session`);

  if (stats.partial.length > 0) {
    lines.push('', `⚠️ ไม่ครบ (${stats.partial.length}):`);
    stats.partial.forEach(h => lines.push(`- ${h.name} — ${h.total}/${MAX_SESSIONS} session (${h.detail})`));
  }
  if (stats.noData.length > 0) {
    lines.push('', `❌ ไม่มีข้อมูล (${stats.noData.length}):`);
    lines.push(stats.noData.join(', '));
  }

  if (stats.full === devices.length) {
    lines.push('', 'ทุกบ้านเก็บข้อมูลครบถ้วนค่ะ');
  }

  const result = await lineBroadcast(lines.join('\n'));
  return res.status(200).json({ ok: true, devices: devices.length, fullHouses: stats.full, totalReadings, sessions: (sessions || []).length, result });
};
