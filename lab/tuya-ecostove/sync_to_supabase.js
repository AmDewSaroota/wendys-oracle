/**
 * EcoStove - Sync Tuya → Supabase
 * ดึงข้อมูลจาก ZN-MT29 แล้วส่งเข้า pollution_logs
 *
 * วิธีใช้: bun sync_to_supabase.js
 */

import crypto from 'crypto';

// ===== Tuya Config =====
const TUYA_ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const TUYA_ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const TUYA_DEVICE_ID = 'a3b9c2e4bdfe69ad7ekytn';
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';

// ===== Supabase Config =====
const SB_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';

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
    headers: {
      'client_id': TUYA_ACCESS_ID,
      'sign': sign,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
    },
  });

  const data = await response.json();
  return data.success ? data.result.access_token : null;
}

async function getDeviceStatus(token) {
  const timestamp = Date.now().toString();
  const path = `/v1.0/devices/${TUYA_DEVICE_ID}/status`;
  const sign = generateSign('GET', path, timestamp, token);

  const response = await fetch(`${TUYA_BASE_URL}${path}`, {
    headers: {
      'client_id': TUYA_ACCESS_ID,
      'access_token': token,
      'sign': sign,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
    },
  });

  return response.json();
}

function parseReadings(data) {
  if (!data.success) return null;

  const readings = {};
  for (const item of data.result || []) {
    readings[item.code] = item.value;
  }
  return readings;
}

// ===== Supabase Functions =====
async function insertPollutionLog(readings) {
  // Map Tuya readings to pollution_logs columns
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
    stove_type: 'eco',  // default, can be changed
    recorded_at: new Date().toISOString(),
  };

  console.log('📤 Sending to Supabase:', record);

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
    console.log('✅ Inserted! ID:', result[0]?.id);
    return result;
  } else {
    const error = await response.text();
    console.error('❌ Error:', response.status, error);
    return null;
  }
}

function parseAqi(value) {
  // Convert "level_1", "level_2", etc. to numeric
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.startsWith('level_')) {
    return parseInt(value.replace('level_', '')) || null;
  }
  return null;
}

// ===== Main =====
async function main() {
  console.log('🌬️  EcoStove - Tuya → Supabase Sync');
  console.log('='.repeat(45));
  console.log();

  // Step 1: Get Tuya token
  console.log('1️⃣  เชื่อมต่อ Tuya...');
  const token = await getTuyaToken();
  if (!token) {
    console.log('❌ ไม่สามารถเชื่อมต่อ Tuya ได้');
    return;
  }
  console.log('✅ เชื่อมต่อ Tuya สำเร็จ');

  // Step 2: Get device readings
  console.log('\n2️⃣  ดึงข้อมูลจากเครื่องวัด...');
  const rawData = await getDeviceStatus(token);
  const readings = parseReadings(rawData);

  if (!readings) {
    console.log('❌ ดึงข้อมูลไม่สำเร็จ');
    return;
  }

  console.log('📊 ค่าที่วัดได้:');
  console.log('   PM2.5:', readings.pm25_value);
  console.log('   CO2:', readings.co2_value);
  console.log('   Temp:', readings.temp_current);
  console.log('   Humidity:', readings.humidity_value);

  // Step 3: Insert to Supabase
  console.log('\n3️⃣  ส่งข้อมูลเข้า Supabase...');
  const result = await insertPollutionLog(readings);

  if (result) {
    console.log('\n✅ สำเร็จ! ข้อมูลถูกบันทึกเข้า pollution_logs แล้ว');
  } else {
    console.log('\n❌ ไม่สามารถบันทึกข้อมูลได้');
  }
}

main().catch(console.error);
