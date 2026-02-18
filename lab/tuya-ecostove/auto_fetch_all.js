/**
 * EcoStove — Auto Fetch All 3 Sensors (every 5 min)
 * วิธีใช้: bun auto_fetch_all.js
 * หยุด: Ctrl+C
 */

import crypto from 'crypto';

const ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const BASE_URL = 'https://openapi-sg.iotbing.com';

const DEVICES = [
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT15/MT29 (เดิม)' },
  { id: 'a3f00f68426975f8cexrtx', name: 'AIR_DETECTOR (ใหม่ 1)' },
  { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W (ใหม่ 2)' },
];

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const LABELS = {
  air_quality_index: 'AQI',
  temp_current: 'Temp (°C)',
  humidity_value: 'Humidity (%)',
  co2_value: 'CO2 (ppm)',
  co2_state: 'CO2 State',
  ch2o_value: 'HCHO',
  pm25_value: 'PM 2.5',
  pm1: 'PM 1.0',
  pm10: 'PM 10',
  voc_value: 'VOC',
  battery_percentage: 'Battery (%)',
  charge_state: 'Charging',
};

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

  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, timestamp);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'sign': sign, 't': timestamp, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) { console.error('Token error:', data.msg); return null; }

  cachedToken = data.result.access_token;
  tokenExpiry = Date.now() + (data.result.expire_time * 1000) - 60000; // refresh 1 min early
  return cachedToken;
}

async function apiGet(path, token) {
  const ts = Date.now().toString();
  const sign = generateSign('GET', path, ts, token);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'access_token': token, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  return res.json();
}

async function fetchAll() {
  const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Fetch: ${now}`);
  console.log('='.repeat(60));

  const token = await getToken();
  if (!token) { console.log('Failed to get token'); return; }

  let onlineCount = 0;

  for (const dev of DEVICES) {
    const info = await apiGet(`/v1.0/devices/${dev.id}`, token);
    const online = info.success ? info.result.online : false;

    if (online) onlineCount++;

    console.log(`\n--- ${dev.name} [${online ? 'ONLINE' : 'OFFLINE'}] ---`);

    if (!online) {
      console.log('  (skipped — device offline)');
      continue;
    }

    const status = await apiGet(`/v1.0/devices/${dev.id}/status`, token);
    if (!status.success) {
      console.log('  Error:', status.msg);
      continue;
    }

    for (const item of status.result || []) {
      const label = LABELS[item.code];
      if (label) {
        console.log(`  ${label.padEnd(15)} ${item.value}`);
      }
    }
  }

  console.log(`\nOnline: ${onlineCount}/${DEVICES.length}`);
  return onlineCount;
}

async function main() {
  console.log('EcoStove — Auto Fetch All Sensors');
  console.log(`Interval: every ${INTERVAL_MS / 60000} minutes`);
  console.log(`Devices: ${DEVICES.length}`);
  console.log('Press Ctrl+C to stop');

  // First fetch immediately
  await fetchAll();

  // Then every 5 minutes
  let round = 1;
  const timer = setInterval(async () => {
    round++;
    try {
      const onlineCount = await fetchAll();
      console.log(`\nNext fetch in 5 minutes... (round ${round})`);

      if (onlineCount === 0) {
        console.log('All devices offline. Still watching...');
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  }, INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(timer);
    console.log('\n\nStopped. Total rounds:', round);
    process.exit(0);
  });

  console.log(`\nNext fetch in 5 minutes... (round ${round})`);
}

main().catch(console.error);
