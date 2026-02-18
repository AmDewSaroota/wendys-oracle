/**
 * List all Tuya devices under this account
 * วิธีใช้: bun list_devices.js
 */

import crypto from 'crypto';

const ACCESS_ID = '7dudg9tg3cwvrf8dx9na';
const ACCESS_SECRET = 'f51fa230ddf343478ae5616c52b51111';
const BASE_URL = 'https://openapi-sg.iotbing.com';

function generateSign(method, path, timestamp, accessToken = '', body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function getToken() {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, timestamp);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'sign': sign, 't': timestamp, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) { console.error('Token error:', data.msg); return null; }
  return { token: data.result.access_token, uid: data.result.uid };
}

async function apiGet(path, token) {
  const timestamp = Date.now().toString();
  const sign = generateSign('GET', path, timestamp, token);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'access_token': token, 'sign': sign, 't': timestamp, 'sign_method': 'HMAC-SHA256' }
  });
  return res.json();
}

async function main() {
  console.log('Connecting to Tuya...');
  const auth = await getToken();
  if (!auth) return;
  console.log('Connected! UID:', auth.uid);
  console.log();

  // Try multiple approaches to find devices
  const approaches = [
    { name: 'Device info (known)', path: `/v1.0/devices/a3b9c2e4bdfe69ad7ekytn` },
    { name: 'Devices by UID', path: `/v1.0/users/${auth.uid}/devices` },
    { name: 'Device list v1.3', path: `/v1.3/iot-03/devices?source_type=tuyaUser&source_id=${auth.uid}` },
    { name: 'Device list v2.0', path: `/v2.0/cloud/thing?page_no=1&page_size=20` },
  ];

  for (const { name, path } of approaches) {
    console.log(`\n--- ${name} ---`);
    console.log(`Path: ${path}`);
    const res = await apiGet(path, auth.token);
    if (res.success) {
      console.log('SUCCESS!');
      console.log(JSON.stringify(res.result, null, 2));
    } else {
      console.log(`Error: ${res.msg} (${res.code})`);
    }
  }

  // Try with owner_id and different UID from device info
  const extraPaths = [
    { name: 'By app user (sg UID)', path: `/v1.0/users/sg1769167214791wrqoV/devices` },
    { name: 'By product_id', path: `/v1.0/products/9f8pjxsmaqnk2tzr/devices?page_no=0&page_size=20` },
    { name: 'Device factory infos', path: `/v1.0/devices/factory-infos?device_ids=a3b9c2e4bdfe69ad7ekytn` },
  ];

  for (const { name, path } of extraPaths) {
    console.log(`\n--- ${name} ---`);
    const res = await apiGet(path, auth.token);
    if (res.success) {
      console.log('SUCCESS!');
      console.log(JSON.stringify(res.result, null, 2));
    } else {
      console.log(`Error: ${res.msg} (${res.code})`);
    }
  }
}

main().catch(console.error);
