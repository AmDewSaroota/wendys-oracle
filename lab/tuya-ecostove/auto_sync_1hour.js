/**
 * Biomass Stove - Auto Sync for 1 Hour
 * รันทุก 5 นาที เป็นเวลา 1 ชั่วโมง (12 รอบ)
 *
 * วิธีใช้: bun auto_sync_1hour.js
 * เริ่มตอน 5 โมงเย็น จะจบตอน 6 โมง
 */

import crypto from 'crypto';

// ===== Config =====
const INTERVAL_MS = 5 * 60 * 1000;  // 5 minutes
const TOTAL_RUNS = 12;               // 12 runs = 1 hour

// ===== Config (from .env — bun auto-loads) =====
const TUYA_ACCESS_ID = process.env.TUYA_ACCESS_ID;
const TUYA_ACCESS_SECRET = process.env.TUYA_ACCESS_SECRET;
const TUYA_DEVICE_ID = 'a3b9c2e4bdfe69ad7ekytn';
const TUYA_BASE_URL = process.env.TUYA_BASE_URL || 'https://openapi-sg.iotbing.com';

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_KEY;

// ===== Tuya Functions =====
function generateSign(method, path, timestamp, accessToken = '', body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = TUYA_ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', TUYA_ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken() {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, timestamp);
  const response = await fetch(`${TUYA_BASE_URL}${path}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'sign': sign, 't': timestamp, 'sign_method': 'HMAC-SHA256' },
  });
  const data = await response.json();
  return data.success ? data.result.access_token : null;
}

async function getDeviceStatus(token) {
  const timestamp = Date.now().toString();
  const path = `/v1.0/devices/${TUYA_DEVICE_ID}/status`;
  const sign = generateSign('GET', path, timestamp, token);
  const response = await fetch(`${TUYA_BASE_URL}${path}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'access_token': token, 'sign': sign, 't': timestamp, 'sign_method': 'HMAC-SHA256' },
  });
  return response.json();
}

function parseReadings(data) {
  if (!data.success) return null;
  const readings = {};
  for (const item of data.result || []) readings[item.code] = item.value;
  return readings;
}

// ===== Supabase =====
async function insertPollutionLog(readings) {
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
    stove_type: 'eco',
    recorded_at: new Date().toISOString(),
  };

  const response = await fetch(`${SB_URL}/rest/v1/pollution_logs`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(record),
  });

  if (response.ok) {
    const result = await response.json();
    return result[0]?.id;
  }
  return null;
}

function parseAqi(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.startsWith('level_')) {
    return parseInt(value.replace('level_', '')) || null;
  }
  return null;
}

// ===== Single Sync =====
async function syncOnce(runNumber) {
  const now = new Date().toLocaleTimeString('th-TH');
  console.log(`\n[${now}] รอบที่ ${runNumber}/${TOTAL_RUNS}`);

  try {
    const token = await getTuyaToken();
    if (!token) { console.log('  ❌ Tuya connection failed'); return; }

    const rawData = await getDeviceStatus(token);
    const readings = parseReadings(rawData);
    if (!readings) { console.log('  ❌ No readings'); return; }

    const id = await insertPollutionLog(readings);
    if (id) {
      console.log(`  ✅ PM2.5=${readings.pm25_value} CO2=${readings.co2_value} → ID:${id}`);
    } else {
      console.log('  ❌ Supabase insert failed');
    }
  } catch (err) {
    console.log('  ❌ Error:', err.message);
  }
}

// ===== Main Loop =====
async function main() {
  console.log('🌬️  Biomass Stove Auto-Sync (1 Hour)');
  console.log('================================');
  console.log(`Interval: ${INTERVAL_MS / 1000 / 60} minutes`);
  console.log(`Total runs: ${TOTAL_RUNS}`);
  console.log(`Started: ${new Date().toLocaleString('th-TH')}`);

  for (let i = 1; i <= TOTAL_RUNS; i++) {
    await syncOnce(i);

    if (i < TOTAL_RUNS) {
      console.log(`  ⏳ รอ 5 นาที...`);
      await new Promise(r => setTimeout(r, INTERVAL_MS));
    }
  }

  console.log('\n================================');
  console.log('✅ เสร็จสิ้น! ครบ 1 ชั่วโมงแล้ว');
}

main().catch(console.error);
