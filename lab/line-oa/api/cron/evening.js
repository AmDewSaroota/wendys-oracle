const https = require('https');

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

const MAX_SESSIONS = 2;
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

// Cron: 8 PM Thai (20:00 = 13:00 UTC) — สรุปการเก็บข้อมูลทั้งวัน
module.exports = async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric', month: 'long',
  });

  // Query all sessions for today (use and() to avoid duplicate param issue)
  const tomorrow = new Date(new Date(today + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0];
  const sessions = await supabaseGet(
    `/rest/v1/sessions?and=(started_at.gte.${today}T00:00:00Z,started_at.lt.${tomorrow}T00:00:00Z)&select=id,device_id,session_status,readings_count,avg_pm25,started_at,ended_at,notes`
  );

  // Query pending logs count
  const pendingLogs = await supabaseGet(
    `/rest/v1/pollution_logs?status=eq.pending&select=id`
  );
  const pendingCount = (pendingLogs || []).length;

  const lines = [`สรุปเก็บข้อมูลประจำวัน (${dateStr})`, ''];

  let totalReadings = 0;
  let missingDevices = [];

  for (const dev of DEVICES) {
    const devSessions = (sessions || []).filter(s => s.device_id === dev.id);
    const completed = devSessions.filter(s => s.session_status === 'complete');
    const incomplete = devSessions.filter(s => s.session_status === 'incomplete');
    const collecting = devSessions.filter(s => s.session_status === 'collecting' || s.session_status === 'baseline');
    const total = completed.length + incomplete.length + collecting.length;

    const readings = devSessions.reduce((sum, s) => sum + (s.readings_count || 0), 0);
    totalReadings += readings;

    if (completed.length >= MAX_SESSIONS) {
      const pm25Vals = completed.map(s => s.avg_pm25).filter(v => v != null);
      const avgPm25 = pm25Vals.length ? (pm25Vals.reduce((a, b) => a + b, 0) / pm25Vals.length).toFixed(1) : '-';
      lines.push(`✅ ${dev.name} — ครบ ${completed.length}/${MAX_SESSIONS} เซสชัน (${readings} รายการ, PM2.5 ${avgPm25})`);
    } else if (total > 0) {
      const detail = [];
      if (completed.length > 0) detail.push(`${completed.length} สำเร็จ`);
      if (incomplete.length > 0) detail.push(`${incomplete.length} ไม่ครบ`);
      if (collecting.length > 0) detail.push(`${collecting.length} กำลังเก็บ`);
      lines.push(`⚠️ ${dev.name} — ${total}/${MAX_SESSIONS} เซสชัน (${detail.join(', ')}, ${readings} รายการ)`);
      missingDevices.push(dev.name);
    } else {
      lines.push(`❌ ${dev.name} — ไม่ได้เก็บข้อมูลวันนี้`);
      missingDevices.push(dev.name);
    }
  }

  lines.push('', `รวม: ${totalReadings} รายการ จาก ${(sessions || []).length} เซสชัน`);

  if (missingDevices.length > 0) {
    lines.push('', `บ้านที่ยังเก็บไม่ครบ: ${missingDevices.join(', ')}`, 'กรุณาติดตามกับอาสาค่ะ');
  } else {
    lines.push('', 'ทุกบ้านเก็บข้อมูลครบถ้วนค่ะ');
  }

  if (pendingCount > 0) {
    lines.push('', `มี ${pendingCount} รายการรออนุมัติ`, 'กรุณาเข้า Dashboard เพื่ออนุมัติข้อมูลค่ะ');
  }

  const result = await lineBroadcast(lines.join('\n'));
  return res.status(200).json({ ok: true, sessions: (sessions || []).length, totalReadings, result });
};
