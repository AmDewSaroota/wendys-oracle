/**
 * Biomass Stove Daemon - Sync Tuya → Supabase (2 sensors)
 * รันค้างไว้ ลูปดึงข้อมูลทุก 5 นาที
 *
 * วิธีใช้:
 *   node sync_to_supabase.js          # รันแบบ daemon (ลูปทุก 5 นาที)
 *   node sync_to_supabase.js --once   # รันครั้งเดียวแล้วจบ
 */

require('./_env');
const crypto = require('crypto');

// ===== Config (from .env) =====
const INTERVAL_MS = 5 * 60 * 1000; // 5 นาที

const TUYA_ACCESS_ID     = process.env.TUYA_ACCESS_ID;
const TUYA_ACCESS_SECRET = process.env.TUYA_ACCESS_SECRET;
const TUYA_BASE_URL      = process.env.TUYA_BASE_URL || 'https://openapi-sg.iotbing.com';

const SENSORS = [
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT29 (เดิม)', stoveType: 'old' },
  { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W (ใหม่)', stoveType: 'eco' },
];

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

// ===== Tuya Functions =====
function generateSign(method, path, timestamp, accessToken, body) {
  accessToken = accessToken || '';
  body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = TUYA_ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', TUYA_ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken() {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, timestamp);

  const response = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: TUYA_ACCESS_ID, sign: sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });

  const data = await response.json();
  return data.success ? data.result.access_token : null;
}

async function getDeviceStatus(token, deviceId, retries) {
  retries = retries || 3;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const timestamp = Date.now().toString();
      const path = '/v1.0/devices/' + deviceId + '/status';
      const sign = generateSign('GET', path, timestamp, token);

      const response = await fetch(TUYA_BASE_URL + path, {
        headers: { client_id: TUYA_ACCESS_ID, access_token: token, sign: sign, t: timestamp, sign_method: 'HMAC-SHA256' },
      });

      return response.json();
    } catch (err) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 3000));
      } else {
        throw err;
      }
    }
  }
}

function parseReadings(data) {
  if (!data.success) return null;
  const readings = {};
  for (const item of data.result || []) {
    readings[item.code] = item.value;
  }
  return readings;
}

function parseAqi(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.startsWith('level_')) {
    return parseInt(value.replace('level_', '')) || null;
  }
  return null;
}

// ===== Supabase Functions =====
async function insertPollutionLog(readings, deviceId, stoveType) {
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
    aqi: parseAqi(readings.air_quality_index),
    data_source: 'sensor',
    tuya_device_id: deviceId,
    stove_type: stoveType || 'eco',
    status: 'pending',
    recorded_at: new Date().toISOString(),
  };

  const response = await fetch(SB_URL + '/rest/v1/pollution_logs', {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(record),
  });

  if (response.ok) {
    const result = await response.json();
    return result[0];
  } else {
    const error = await response.text();
    console.error('  Error:', response.status, error);
    return null;
  }
}

// ===== Sync Round =====
let roundNumber = 0;

async function syncOnce() {
  roundNumber++;
  const time = new Date().toLocaleString('th-TH');
  console.log('\n--- Round ' + roundNumber + ' | ' + time + ' ---');

  // Get token (fresh each round — Tuya tokens expire after ~2 hours)
  const token = await getTuyaToken();
  if (!token) {
    console.log('FAIL: Cannot get Tuya token');
    return 0;
  }

  let successCount = 0;
  for (let i = 0; i < SENSORS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 2000)); // 2s delay between sensors
    const sensor = SENSORS[i];
    try {
      const rawData = await getDeviceStatus(token, sensor.id);
      const readings = parseReadings(rawData);

      if (!readings) {
        console.log('  [' + sensor.name + '] offline');
        continue;
      }

      console.log('  [' + sensor.name + '] PM2.5:' + readings.pm25_value + ' CO2:' + readings.co2_value + ' T:' + readings.temp_current + ' H:' + readings.humidity_value);

      const result = await insertPollutionLog(readings, sensor.id, sensor.stoveType);
      if (result) {
        successCount++;
      } else {
        console.log('  [' + sensor.name + '] insert failed');
      }
    } catch (err) {
      console.log('  [' + sensor.name + '] error: ' + err.message);
    }
  }

  console.log('  -> ' + successCount + '/' + SENSORS.length + ' OK');
  return successCount;
}

// ===== Main =====
const runOnce = process.argv.includes('--once');

async function main() {
  console.log('Biomass Stove Daemon');
  console.log('Sensors: ' + SENSORS.map(s => s.name).join(', '));
  console.log('Mode: ' + (runOnce ? 'single run' : 'loop every ' + (INTERVAL_MS / 1000) + 's'));
  console.log('='.repeat(50));

  // First sync immediately
  await syncOnce();

  if (runOnce) {
    console.log('\nDone (--once mode)');
    return;
  }

  // Loop
  console.log('\nNext sync in ' + (INTERVAL_MS / 1000) + ' seconds... (Ctrl+C to stop)');
  setInterval(async () => {
    try {
      await syncOnce();
      console.log('Next sync in ' + (INTERVAL_MS / 1000) + ' seconds...');
    } catch (err) {
      console.log('Round error: ' + err.message);
    }
  }, INTERVAL_MS);
}

main().catch(console.error);
