/**
 * Biomass Stove - Tuya Air Quality Fetcher
 * ดึงข้อมูลจากเครื่อง ZN-MT29 ผ่าน Tuya API
 *
 * วิธีใช้: bun fetch_air_quality.js
 */

import crypto from 'crypto';

// Credentials (from .env — bun auto-loads)
const ACCESS_ID = process.env.TUYA_ACCESS_ID;
const ACCESS_SECRET = process.env.TUYA_ACCESS_SECRET;
const DEVICE_ID = 'a3b9c2e4bdfe69ad7ekytn';
const BASE_URL = process.env.TUYA_BASE_URL || 'https://openapi-sg.iotbing.com';

/**
 * สร้าง signature สำหรับ Tuya API (v2.0 method)
 */
function generateSign(method, path, timestamp, accessToken = '', body = '') {
  // Content hash
  const contentHash = crypto
    .createHash('sha256')
    .update(body)
    .digest('hex');

  // String to sign
  const stringToSign = [
    method.toUpperCase(),
    contentHash,
    '',  // headers (empty for simple requests)
    path,
  ].join('\n');

  // Sign string
  const signStr = ACCESS_ID + accessToken + timestamp + stringToSign;

  const sign = crypto
    .createHmac('sha256', ACCESS_SECRET)
    .update(signStr)
    .digest('hex')
    .toUpperCase();

  return sign;
}

/**
 * ขอ access token จาก Tuya
 */
async function getToken() {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, timestamp);

  const headers = {
    'client_id': ACCESS_ID,
    'sign': sign,
    't': timestamp,
    'sign_method': 'HMAC-SHA256',
  };

  console.log('Request headers:', headers);

  const response = await fetch(`${BASE_URL}${path}`, { headers });
  const data = await response.json();

  console.log('Token response:', JSON.stringify(data, null, 2));

  if (data.success) {
    return data.result.access_token;
  } else {
    console.error('Error getting token:', data.msg, data.code);
    return null;
  }
}

/**
 * ดึงข้อมูลจากเครื่องวัด
 */
async function getDeviceStatus(token) {
  const timestamp = Date.now().toString();
  const path = `/v1.0/devices/${DEVICE_ID}/status`;
  const sign = generateSign('GET', path, timestamp, token);

  const headers = {
    'client_id': ACCESS_ID,
    'access_token': token,
    'sign': sign,
    't': timestamp,
    'sign_method': 'HMAC-SHA256',
  };

  const response = await fetch(`${BASE_URL}${path}`, { headers });
  return response.json();
}

/**
 * Main
 */
async function main() {
  console.log('🌬️  Biomass Stove Air Quality Monitor');
  console.log('='.repeat(40));
  console.log(`Device ID: ${DEVICE_ID}`);
  console.log(`Endpoint: ${BASE_URL}`);
  console.log();

  // ขอ token
  console.log('กำลังเชื่อมต่อ Tuya...');
  const token = await getToken();

  if (!token) {
    console.log('❌ เชื่อมต่อไม่สำเร็จ');
    return;
  }

  console.log('✅ เชื่อมต่อสำเร็จ!');
  console.log();

  // ดึงข้อมูล
  console.log('กำลังดึงข้อมูลคุณภาพอากาศ...');
  const rawData = await getDeviceStatus(token);

  if (!rawData.success) {
    console.log('❌ ดึงข้อมูลไม่สำเร็จ');
    console.log('Response:', JSON.stringify(rawData, null, 2));
    return;
  }

  // แสดงผล
  console.log();
  console.log('📊 ค่าที่วัดได้:');
  console.log('-'.repeat(40));

  const labels = {
    pm25_value: 'PM 2.5',
    pm10_value: 'PM 10',
    pm1_value: 'PM 1.0',
    co2_value: 'CO2',
    co_value: 'CO',
    ch2o_value: 'Formaldehyde',
    tvoc_value: 'TVOC',
    temp_current: 'Temperature',
    humidity_value: 'Humidity',
    air_quality_index: 'AQI',
  };

  for (const item of rawData.result || []) {
    const label = labels[item.code] || item.code;
    console.log(`  ${label}: ${item.value}`);
  }

  console.log();
  console.log('✅ เสร็จสิ้น!');
}

main().catch(console.error);
