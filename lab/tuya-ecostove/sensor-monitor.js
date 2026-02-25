/**
 * EcoStove Sensor Monitor — Web UI + Auto-Collection
 *
 * Features:
 * - Web UI with buttons to check status / start / stop collection
 * - SSE (Server-Sent Events) for real-time updates
 * - Auto-collect every 5 minutes when started
 * - Save to Supabase pollution_logs table
 *
 * Usage: node lab/tuya-ecostove/sensor-monitor.js
 * Open:  http://localhost:3456
 */

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

// ===== Config =====
const PORT = 3456;
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Tuya
const TUYA_ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const TUYA_ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const TUYA_BASE = 'https://openapi-sg.iotbing.com';

// Supabase
const SB_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';

// Devices
const DEVICES = [
  { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W (ตัวใหม่)' },
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT29 (ตัวเดิม)' },
];

const LABELS = {
  pm25_value: 'PM 2.5 (µg/m³)',
  pm1: 'PM 1.0',
  pm10: 'PM 10',
  co2_value: 'CO2 (ppm)',
  ch2o_value: 'HCHO',
  temp_current: 'Temp (°C)',
  humidity_value: 'Humidity (%)',
  voc_value: 'VOC',
  air_quality_index: 'AQI',
};

// ===== State =====
let collecting = false;
let collectionTimer = null;
let stats = { rounds: 0, saved: 0, offline: 0, errors: 0 };
let sseClients = [];
let cachedToken = null;
let tokenExpiry = 0;

// ===== SSE =====
function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients = sseClients.filter(res => {
    try { res.write(msg); return true; } catch { return false; }
  });
}

function log(message, type = 'info') {
  const time = new Date().toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });
  console.log(`[${time}] ${message}`);
  broadcast('log', { time, message, type });
}

// ===== Tuya API =====
function generateSign(method, path, timestamp, accessToken = '', body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = TUYA_ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', TUYA_ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const ts = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, ts);
  const res = await fetch(`${TUYA_BASE}${path}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) return null;
  cachedToken = data.result.access_token;
  tokenExpiry = Date.now() + (data.result.expire_time * 1000) - 60000;
  return cachedToken;
}

async function tuyaGet(path, token) {
  const ts = Date.now().toString();
  const sign = generateSign('GET', path, ts, token);
  const res = await fetch(`${TUYA_BASE}${path}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'access_token': token, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  return res.json();
}

async function checkDeviceOnline(token, deviceId) {
  const data = await tuyaGet(`/v1.0/devices/${deviceId}`, token);
  return data.success ? data.result.online : false;
}

async function getDeviceReadings(token, deviceId) {
  const data = await tuyaGet(`/v1.0/devices/${deviceId}/status`, token);
  if (!data.success) return null;
  const readings = {};
  for (const item of data.result || []) {
    readings[item.code] = item.value;
  }
  return readings;
}

// ===== AQI Calculation =====
function calculateAqi(pm25) {
  if (pm25 == null) return null;
  const bp = [
    [0, 35, 0, 50], [35, 75, 50, 100], [75, 115, 100, 150],
    [115, 150, 150, 200], [150, 250, 200, 300], [250, 350, 300, 400],
    [350, 500, 400, 500],
  ];
  for (const [cLo, cHi, aqiLo, aqiHi] of bp) {
    if (pm25 <= cHi) return Math.round(((aqiHi - aqiLo) / (cHi - cLo)) * (pm25 - cLo) + aqiLo);
  }
  return 500;
}

// ===== Supabase =====
async function insertToSupabase(readings, deviceId) {
  const record = {
    pm25_value: readings.pm25_value ?? null,
    pm1_value: readings.pm1 ?? null,
    pm10_value: readings.pm10 ?? null,
    co2_value: readings.co2_value ?? null,
    co_value: readings.co_value ?? null,
    temperature: readings.temp_current ?? null,
    humidity: readings.humidity_value ?? null,
    hcho_value: readings.ch2o_value ?? null,
    tvoc_value: readings.tvoc_value ?? null,
    aqi: calculateAqi(readings.pm25_value ?? null),
    data_source: 'sensor',
    tuya_device_id: deviceId,
    stove_type: 'eco',
    session_type: 'auto',
    status: 'approved',
    recorded_at: new Date().toISOString(),
  };

  const res = await fetch(`${SB_URL}/rest/v1/pollution_logs`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(record),
  });

  if (res.ok) {
    const result = await res.json();
    return result[0];
  }
  const err = await res.text();
  throw new Error(`Supabase error ${res.status}: ${err}`);
}

// ===== Check All Devices =====
async function checkAllDevices() {
  const token = await getTuyaToken();
  if (!token) {
    log('ไม่สามารถเชื่อมต่อ Tuya ได้', 'error');
    return [];
  }

  const results = [];
  for (const dev of DEVICES) {
    const online = await checkDeviceOnline(token, dev.id);
    let readings = null;
    if (online) {
      readings = await getDeviceReadings(token, dev.id);
    }
    results.push({ ...dev, online, readings });
  }
  return results;
}

// ===== Collection Round =====
async function collectRound() {
  stats.rounds++;
  log(`--- รอบที่ ${stats.rounds} ---`, 'round');
  broadcast('stats', stats);

  const token = await getTuyaToken();
  if (!token) {
    log('Token error — ข้ามรอบนี้', 'error');
    stats.errors++;
    broadcast('stats', stats);
    return;
  }

  for (const dev of DEVICES) {
    try {
      const online = await checkDeviceOnline(token, dev.id);
      if (!online) {
        log(`[${dev.name}] OFFLINE — ข้าม`, 'offline');
        stats.offline++;
        broadcast('device', { id: dev.id, name: dev.name, online: false });
        continue;
      }

      const readings = await getDeviceReadings(token, dev.id);
      if (!readings) {
        log(`[${dev.name}] ดึงค่าไม่ได้`, 'error');
        stats.errors++;
        continue;
      }

      const pm25 = readings.pm25_value ?? '-';
      const co2 = readings.co2_value ?? '-';
      const temp = readings.temp_current ?? '-';
      const hum = readings.humidity_value ?? '-';
      log(`[${dev.name}] PM2.5: ${pm25} | CO2: ${co2} | Temp: ${temp}°C | Humidity: ${hum}%`, 'data');
      broadcast('device', { id: dev.id, name: dev.name, online: true, readings });

      const record = await insertToSupabase(readings, dev.id);
      log(`[${dev.name}] บันทึก Supabase #${record.id}`, 'success');
      stats.saved++;
    } catch (err) {
      log(`[${dev.name}] Error: ${err.message}`, 'error');
      stats.errors++;
    }
  }

  broadcast('stats', stats);
}

// ===== Start / Stop Collection =====
function startCollection() {
  if (collecting) return { ok: false, message: 'กำลังเก็บข้อมูลอยู่แล้ว' };
  collecting = true;
  stats = { rounds: 0, saved: 0, offline: 0, errors: 0 };
  log('เริ่มเก็บข้อมูล (ทุก 5 นาที)', 'start');
  broadcast('status', { collecting: true });
  broadcast('stats', stats);

  // First round immediately
  collectRound();

  // Then every 5 minutes
  collectionTimer = setInterval(() => {
    collectRound().catch(err => {
      log(`Round error: ${err.message}`, 'error');
      stats.errors++;
    });
  }, INTERVAL_MS);


  return { ok: true, message: 'เริ่มเก็บข้อมูลแล้ว' };
}

function stopCollection() {
  if (!collecting) return { ok: false, message: 'ไม่ได้กำลังเก็บข้อมูล' };
  collecting = false;
  if (collectionTimer) {
    clearInterval(collectionTimer);
    collectionTimer = null;
  }
  log(`หยุดเก็บข้อมูล (${stats.rounds} รอบ, ${stats.saved} records)`, 'stop');
  broadcast('status', { collecting: false });

  return { ok: true, message: `หยุดแล้ว — ${stats.saved} records saved` };
}

// ===== HTTP Server =====
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const path = reqUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // SSE endpoint
  if (path === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    // Send current state
    res.write(`event: status\ndata: ${JSON.stringify({ collecting })}\n\n`);
    res.write(`event: stats\ndata: ${JSON.stringify(stats)}\n\n`);
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // Check sensor status
  if (path === '/api/check' && req.method === 'POST') {
    try {
      log('กำลังเช็คสถานะเซนเซอร์...', 'info');
      const results = await checkAllDevices();
      for (const dev of results) {
        const status = dev.online ? 'ONLINE' : 'OFFLINE';
        log(`[${dev.name}] ${status}`, dev.online ? 'success' : 'offline');
        broadcast('device', { id: dev.id, name: dev.name, online: dev.online, readings: dev.readings });
      }
      return json(res, { ok: true, devices: results });
    } catch (err) {
      log(`Check error: ${err.message}`, 'error');
      return json(res, { ok: false, error: err.message }, 500);
    }
  }

  // Start collection
  if (path === '/api/start' && req.method === 'POST') {
    const result = startCollection();
    return json(res, result);
  }

  // Stop collection
  if (path === '/api/stop' && req.method === 'POST') {
    const result = stopCollection();
    return json(res, result);
  }

  // Serve HTML
  if (path === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(HTML_PAGE);
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

// ===== HTML Page =====
const HTML_PAGE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoStove Sensor Monitor</title>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Kanit', sans-serif;
      background: #f0f4f3;
      color: #1a2e2a;
      min-height: 100vh;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }

    header {
      text-align: center;
      padding: 30px 0 20px;
    }
    header h1 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #064e3b;
    }
    header p {
      color: #6b7280;
      font-weight: 300;
      margin-top: 4px;
    }

    .controls {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    button {
      font-family: 'Kanit', sans-serif;
      font-size: 1rem;
      padding: 10px 24px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 400;
      transition: all 0.2s;
    }
    button:hover { transform: translateY(-1px); }
    button:active { transform: translateY(0); }
    button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-check {
      background: #064e3b;
      color: white;
    }
    .btn-start {
      background: #059669;
      color: white;
    }
    .btn-stop {
      background: #dc2626;
      color: white;
    }

    .status-bar {
      text-align: center;
      padding: 8px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 400;
    }
    .status-idle { background: #e5e7eb; color: #6b7280; }
    .status-collecting { background: #d1fae5; color: #065f46; }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .stat-card .value {
      font-size: 1.6rem;
      font-weight: 600;
      color: #064e3b;
    }
    .stat-card .label {
      font-size: 0.85rem;
      color: #9ca3af;
      font-weight: 300;
    }

    .devices {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .device-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border-bottom: 4px solid #e5e7eb;
      transition: border-color 0.3s;
    }
    .device-card.online { border-bottom-color: #059669; }
    .device-card.offline { border-bottom-color: #ef4444; }
    .device-card .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .device-card .device-name {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .device-card .device-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 400;
    }
    .device-status.online { background: #d1fae5; color: #065f46; }
    .device-status.offline { background: #fee2e2; color: #991b1b; }
    .device-status.unknown { background: #f3f4f6; color: #6b7280; }
    .readings {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .reading-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.9rem;
    }
    .reading-item .r-label { color: #6b7280; font-weight: 300; }
    .reading-item .r-value { font-weight: 600; color: #064e3b; }

    .log-section h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #064e3b;
      margin-bottom: 8px;
    }
    .log-box {
      background: #1a2e2a;
      border-radius: 12px;
      padding: 16px;
      height: 300px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .log-box::-webkit-scrollbar { width: 6px; }
    .log-box::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
    .log-line { color: #d1d5db; }
    .log-line .log-time { color: #6b7280; }
    .log-line.type-success { color: #34d399; }
    .log-line.type-error { color: #f87171; }
    .log-line.type-offline { color: #fbbf24; }
    .log-line.type-data { color: #93c5fd; }
    .log-line.type-start { color: #34d399; font-weight: bold; }
    .log-line.type-stop { color: #f87171; font-weight: bold; }
    .log-line.type-round { color: #c084fc; font-weight: bold; }

    @media (max-width: 600px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      .readings { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>EcoStove Sensor Monitor</h1>
      <p>ระบบเก็บข้อมูลคุณภาพอากาศอัตโนมัติ</p>
    </header>

    <div class="controls">
      <button class="btn-check" onclick="checkStatus()">เช็คสถานะ</button>
      <button class="btn-start" id="btnStart" onclick="startCollection()">เริ่มเก็บข้อมูล</button>
      <button class="btn-stop" id="btnStop" onclick="stopCollection()" disabled>หยุด</button>
    </div>

    <div class="status-bar status-idle" id="statusBar">รอคำสั่ง...</div>

    <div class="stats">
      <div class="stat-card"><div class="value" id="statRounds">0</div><div class="label">รอบ</div></div>
      <div class="stat-card"><div class="value" id="statSaved">0</div><div class="label">บันทึกแล้ว</div></div>
      <div class="stat-card"><div class="value" id="statOffline">0</div><div class="label">Offline</div></div>
      <div class="stat-card"><div class="value" id="statErrors">0</div><div class="label">Errors</div></div>
    </div>

    <div class="devices" id="devices"></div>

    <div class="log-section">
      <h3>Activity Log</h3>
      <div class="log-box" id="logBox"></div>
    </div>
  </div>

  <script>
    // SSE Connection
    const evtSource = new EventSource('/api/events');

    evtSource.addEventListener('status', (e) => {
      const { collecting } = JSON.parse(e.data);
      updateButtons(collecting);
    });

    evtSource.addEventListener('stats', (e) => {
      const s = JSON.parse(e.data);
      document.getElementById('statRounds').textContent = s.rounds;
      document.getElementById('statSaved').textContent = s.saved;
      document.getElementById('statOffline').textContent = s.offline;
      document.getElementById('statErrors').textContent = s.errors;
    });

    evtSource.addEventListener('device', (e) => {
      const dev = JSON.parse(e.data);
      updateDeviceCard(dev);
    });

    evtSource.addEventListener('log', (e) => {
      const { time, message, type } = JSON.parse(e.data);
      appendLog(time, message, type);
    });

    // UI Functions
    function updateButtons(collecting) {
      const bar = document.getElementById('statusBar');
      const btnStart = document.getElementById('btnStart');
      const btnStop = document.getElementById('btnStop');
      if (collecting) {
        bar.className = 'status-bar status-collecting';
        bar.textContent = 'กำลังเก็บข้อมูล (ทุก 5 นาที)...';
        btnStart.disabled = true;
        btnStop.disabled = false;
      } else {
        bar.className = 'status-bar status-idle';
        bar.textContent = 'รอคำสั่ง...';
        btnStart.disabled = false;
        btnStop.disabled = true;
      }
    }

    const LABELS = {
      pm25_value: 'PM 2.5',
      pm10: 'PM 10',
      pm1: 'PM 1.0',
      co2_value: 'CO2',
      ch2o_value: 'HCHO',
      temp_current: 'Temp',
      humidity_value: 'Humidity',
      voc_value: 'VOC',
      air_quality_index: 'AQI',
    };

    const UNITS = {
      pm25_value: 'µg/m³',
      pm10: 'µg/m³',
      pm1: 'µg/m³',
      co2_value: 'ppm',
      ch2o_value: 'mg/m³',
      temp_current: '°C',
      humidity_value: '%',
      voc_value: '',
      air_quality_index: '',
    };

    function updateDeviceCard(dev) {
      let card = document.getElementById('dev-' + dev.id);
      if (!card) {
        card = document.createElement('div');
        card.id = 'dev-' + dev.id;
        card.className = 'device-card';
        document.getElementById('devices').appendChild(card);
      }

      card.className = 'device-card ' + (dev.online ? 'online' : 'offline');

      let readingsHTML = '';
      if (dev.readings) {
        readingsHTML = '<div class="readings">';
        for (const [code, label] of Object.entries(LABELS)) {
          if (dev.readings[code] != null) {
            const unit = UNITS[code] || '';
            readingsHTML += '<div class="reading-item">' +
              '<span class="r-label">' + label + '</span>' +
              '<span class="r-value">' + dev.readings[code] + ' ' + unit + '</span>' +
              '</div>';
          }
        }
        readingsHTML += '</div>';
      }

      card.innerHTML =
        '<div class="device-header">' +
          '<span class="device-name">' + dev.name + '</span>' +
          '<span class="device-status ' + (dev.online ? 'online' : 'offline') + '">' +
            (dev.online ? 'ONLINE' : 'OFFLINE') +
          '</span>' +
        '</div>' +
        readingsHTML;
    }

    function appendLog(time, message, type) {
      const box = document.getElementById('logBox');
      const line = document.createElement('div');
      line.className = 'log-line type-' + type;
      line.innerHTML = '<span class="log-time">[' + time + ']</span> ' + message;
      box.appendChild(line);
      box.scrollTop = box.scrollHeight;
    }

    // API Calls
    async function checkStatus() {
      const btn = document.querySelector('.btn-check');
      btn.disabled = true;
      btn.textContent = 'กำลังเช็ค...';
      try {
        await fetch('/api/check', { method: 'POST' });
      } catch (err) {
        appendLog(new Date().toLocaleTimeString('th-TH'), 'Connection error', 'error');
      }
      btn.disabled = false;
      btn.textContent = 'เช็คสถานะ';
    }

    async function startCollection() {
      try {
        await fetch('/api/start', { method: 'POST' });
      } catch (err) {
        appendLog(new Date().toLocaleTimeString('th-TH'), 'Connection error', 'error');
      }
    }

    async function stopCollection() {
      try {
        await fetch('/api/stop', { method: 'POST' });
      } catch (err) {
        appendLog(new Date().toLocaleTimeString('th-TH'), 'Connection error', 'error');
      }
    }
  </script>
</body>
</html>`;

// ===== Start Server =====
server.listen(PORT, () => {
  console.log('=========================================');
  console.log('  EcoStove Sensor Monitor');
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Devices: ${DEVICES.map(d => d.name).join(', ')}`);
  console.log('  Ctrl+C to stop');
  console.log('=========================================');

  // Auto-open browser (Windows)
  if (!process.env.NO_BROWSER) {
    exec(`start http://localhost:${PORT}`);
  }

  // Auto-start collection immediately
  console.log('  Auto-starting collection...');
  startCollection();
});
