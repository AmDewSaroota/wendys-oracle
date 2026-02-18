/**
 * EcoStove — Auto Sync Sensors to Supabase (every 5 min)
 * เปิดเซนเซอร์ + เปิดคอม = เก็บข้อมูลอัตโนมัติ
 *
 * วิธีใช้: node auto_sync_mt13w.js
 * หยุด: Ctrl+C
 */

const crypto = require('crypto');

// ===== Tuya Config =====
const ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const TUYA_BASE = 'https://openapi-sg.iotbing.com';

// ===== Supabase Edge Function =====
const EDGE_FUNCTION_URL = 'https://zijybzjstjlqvhmckgor.supabase.co/functions/v1/fetch-sensor';
const SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';

// ===== Devices =====
const DEVICES = [
  { id: 'a3d01864e463e3ede0hf0e', name: 'Sensor 1 (MT13W)' },
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'Sensor 2 (ZN-MT29)' },
];

// ===== Settings =====
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ===== Tuya Auth =====
function generateSign(method, path, timestamp, accessToken = '', body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const ts = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, ts);
  const res = await fetch(`${TUYA_BASE}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) return null;
  cachedToken = data.result.access_token;
  tokenExpiry = Date.now() + (data.result.expire_time * 1000) - 60000;
  return cachedToken;
}

async function isDeviceOnline(token, deviceId) {
  const ts = Date.now().toString();
  const path = `/v1.0/devices/${deviceId}`;
  const sign = generateSign('GET', path, ts, token);
  const res = await fetch(`${TUYA_BASE}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'access_token': token, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  return data.success ? data.result.online : false;
}

// ===== Stats =====
let stats = { total: 0, saved: 0, offline: 0, errors: 0 };

async function syncDevice(token, device, now) {
  const online = await isDeviceOnline(token, device.id);
  if (!online) {
    console.log(`  [${device.name}] OFFLINE — skipped`);
    stats.offline++;
    return;
  }

  const res = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SB_ANON_KEY}`,
    },
    body: JSON.stringify({
      device_id: device.id,
      stove_type: 'eco',
      session_type: 'auto',
    }),
  });

  const data = await res.json();

  if (data.success) {
    const r = data.readings;
    console.log(`  [${device.name}] SAVED #${data.record_id} — PM2.5: ${r.pm25} | CO2: ${r.co2} | Temp: ${r.temperature}°C | Humidity: ${r.humidity}%`);
    stats.saved++;
  } else {
    console.log(`  [${device.name}] ERROR: ${data.error}`);
    stats.errors++;
  }
}

async function syncAll() {
  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  stats.total++;

  console.log(`\n[${now}] Round ${stats.total}`);

  const token = await getToken();
  if (!token) {
    console.log('  Token error — skipped all');
    stats.errors++;
    return;
  }

  for (const device of DEVICES) {
    try {
      await syncDevice(token, device, now);
    } catch (err) {
      console.log(`  [${device.name}] ERROR: ${err.message}`);
      stats.errors++;
    }
  }
}

async function main() {
  console.log('=========================================');
  console.log('  EcoStove Auto-Sync');
  console.log(`  Devices: ${DEVICES.map(d => d.name).join(', ')}`);
  console.log(`  Interval: every ${INTERVAL_MS / 60000} min`);
  console.log('  Ctrl+C to stop');
  console.log('=========================================');

  // First sync immediately
  await syncAll();

  // Then every 5 minutes
  const timer = setInterval(async () => {
    try {
      await syncAll();
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      stats.errors++;
    }
  }, INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(timer);
    console.log('\n\n=========================================');
    console.log('  Session Summary');
    console.log(`  Total rounds: ${stats.total}`);
    console.log(`  Saved to DB:  ${stats.saved}`);
    console.log(`  Offline skip: ${stats.offline}`);
    console.log(`  Errors:       ${stats.errors}`);
    console.log('=========================================');
    process.exit(0);
  });
}

main().catch(console.error);
