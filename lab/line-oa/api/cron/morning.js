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

  // Categorize devices
  const stats = { complete: 0, collecting: 0, incomplete: [], noData: [] };

  for (const dev of devices) {
    const name = dev.subjects?.full_name || dev.tuya_device_id.slice(-6);
    const devSessions = (sessions || []).filter(s => s.device_id === dev.tuya_device_id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');

    if (completed.length > 0) {
      stats.complete++;
    } else if (collecting.length > 0) {
      stats.collecting++;
    } else if (incomplete.length > 0) {
      const s = incomplete[0];
      const notes = s.notes || '';
      const isTuya = notes.includes('Tuya') || notes.includes('tuya_api');
      const isOffline = notes.includes('ออฟไลน์');
      const cause = isTuya ? ' [Tuya ขัดข้อง]' : isOffline ? ' [ออฟไลน์]' : '';
      stats.incomplete.push({ name, readings: s.readings_count || 0, cause });
    } else {
      stats.noData.push(name);
    }
  }

  // Build compact summary
  const lines = [`สรุปเก็บข้อมูลเช้า (${dateStr})`, ''];
  const parts = [];
  if (stats.complete > 0) parts.push(`✅ สำเร็จ ${stats.complete}`);
  if (stats.collecting > 0) parts.push(`🔄 กำลังเก็บ ${stats.collecting}`);
  if (stats.incomplete.length > 0) parts.push(`⚠️ ไม่ครบ ${stats.incomplete.length}`);
  if (stats.noData.length > 0) parts.push(`❌ ไม่มีข้อมูล ${stats.noData.length}`);
  lines.push(parts.join(' · '));
  lines.push(`รวม ${stats.complete + stats.collecting}/${devices.length} บ้าน`);

  if (stats.incomplete.length > 0) {
    lines.push('', `⚠️ เก็บไม่ครบ (${stats.incomplete.length}):`);
    stats.incomplete.forEach(h => lines.push(`- ${h.name} (${h.readings} รายการ)${h.cause}`));
  }
  if (stats.noData.length > 0) {
    lines.push('', `❌ ไม่มีข้อมูล (${stats.noData.length}):`);
    lines.push(stats.noData.join(', '));
  }

  if (stats.complete + stats.collecting === devices.length) {
    lines.push('', 'ทุกบ้านเก็บข้อมูลเรียบร้อยค่ะ');
  }

  const collected = stats.complete + stats.collecting;
  const result = await lineBroadcast(lines.join('\n'));
  return res.status(200).json({ ok: true, devices: devices.length, collected, sessions: (sessions || []).length, result });
};
