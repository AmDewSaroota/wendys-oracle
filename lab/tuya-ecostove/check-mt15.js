const crypto = require('crypto');
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const ACCESS_ID = '8grdqadptymnyeqdduxx';
const ACCESS_SECRET = '66a9cdc052ef49e7b41ce7a3ac5fa9ab';
const MT15_ID = 'a31aff2ac0acbbf911cee3';
const APP_USER_UID = 'sg1769167214791wrqoV';

function generateSign(accessId, secret, method, path, timestamp, accessToken, body) {
  accessToken = accessToken || '';
  body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = accessId + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();
}

async function getToken() {
  const ts = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign(ACCESS_ID, ACCESS_SECRET, 'GET', path, ts);
  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: ACCESS_ID, sign, t: ts, sign_method: 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) throw new Error('Token failed: ' + JSON.stringify(data));
  return data.result.access_token;
}

async function apiCall(token, method, path) {
  const ts = Date.now().toString();
  const sign = generateSign(ACCESS_ID, ACCESS_SECRET, method, path, ts, token);
  const res = await fetch(TUYA_BASE_URL + path, {
    method,
    headers: { client_id: ACCESS_ID, access_token: token, sign, t: ts, sign_method: 'HMAC-SHA256' }
  });
  return res.json();
}

async function run() {
  const token = await getToken();

  console.log('=== MT15 CHECK — ALL APPROACHES ===\n');

  // 1. Try v2.0 API first (v1.0 permission deny since 2026-03-31)
  console.log('--- /v2.0/cloud/thing/device (v2.0 API) ---');
  const v2devices = await apiCall(token, 'GET', '/v2.0/cloud/thing/device?page_size=50');
  console.log('v2.0 result:', JSON.stringify(v2devices, null, 2).substring(0, 500));

  // 2. Smart Home API — list ALL devices
  console.log('\n--- /v1.0/users/{uid}/devices (Smart Home API) ---');
  const allDevices = await apiCall(token, 'GET', '/v1.0/users/' + APP_USER_UID + '/devices');
  if (allDevices.success) {
    console.log('Total devices in account: ' + allDevices.result.length);
    for (const d of allDevices.result) {
      const isMT15 = d.id === MT15_ID ? ' ★ MT15' : '';
      console.log('  ' + d.id.substring(0, 12) + '... ' + (d.name || 'no-name').padEnd(15) + ' online=' + d.online + ' category=' + d.category + isMT15);
    }

    // Find MT15 specifically
    const mt15 = allDevices.result.find(d => d.id === MT15_ID);
    if (mt15) {
      console.log('\n★ MT15 FOUND!');
      console.log('  Name: ' + mt15.name);
      console.log('  Online: ' + mt15.online);
      console.log('  Category: ' + mt15.category);
      console.log('  Product ID: ' + mt15.product_id);
      console.log('  Model: ' + (mt15.model || 'N/A'));
    } else {
      console.log('\n✗ MT15 NOT found in this account!');
      console.log('  Device ID: ' + MT15_ID);
      console.log('  → อาจ pair อยู่ใน Tuya Smart App account อื่น');
    }
  } else {
    console.log('Failed: ' + allDevices.code + ' ' + allDevices.msg);
  }

  // 2. Try direct status anyway
  console.log('\n--- /v1.0/devices/{MT15}/status (direct) ---');
  const s1 = await apiCall(token, 'GET', '/v1.0/devices/' + MT15_ID + '/status');
  if (s1.success) {
    console.log('Data points: ' + s1.result.length);
    for (const item of s1.result) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
  } else {
    console.log('Status failed: ' + s1.code + ' ' + s1.msg);
  }
}

run().catch(e => console.error('ERROR:', e.message));
