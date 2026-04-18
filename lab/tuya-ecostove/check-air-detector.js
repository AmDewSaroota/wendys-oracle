const crypto = require('crypto');
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const ACCESS_ID = '8grdqadptymnyeqdduxx';
const ACCESS_SECRET = '66a9cdc052ef49e7b41ce7a3ac5fa9ab';
const DEVICE_ID = 'a39e1d85867b719abc10av';

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
  console.log('=== PV28 — DEEP SEARCH FOR ALL DATA POINTS ===\n');

  // 1. v1.0 status (baseline)
  console.log('--- /v1.0/devices/{id}/status ---');
  const s1 = await apiCall(token, 'GET', '/v1.0/devices/' + DEVICE_ID + '/status');
  if (s1.success) {
    console.log('Data points returned: ' + s1.result.length);
    for (const item of s1.result) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
    // Check specifically for PM codes
    const pmCodes = s1.result.filter(i => i.code.includes('pm'));
    console.log('\nPM-related codes found: ' + (pmCodes.length > 0 ? pmCodes.map(p => p.code).join(', ') : 'ONLY pm25_value'));
  }

  // 2. Try device logs with v1.0 (different sign method)
  console.log('\n--- /v1.0/devices/{id}/logs (last 24h) ---');
  const endTime = Date.now();
  const startTime = endTime - 86400000;
  const logPath = '/v1.0/devices/' + DEVICE_ID + '/logs?start_time=' + startTime + '&end_time=' + endTime + '&type=7&size=50';
  const s2 = await apiCall(token, 'GET', logPath);
  if (s2.success) {
    const logs = s2.result.logs || [];
    console.log('Total log entries: ' + logs.length);
    const codes = {};
    for (const log of logs) {
      if (!codes[log.code]) codes[log.code] = log.value;
    }
    console.log('All unique codes in logs:');
    for (const [code, val] of Object.entries(codes)) {
      console.log('  ' + code.padEnd(25) + ' = ' + val);
    }
  } else {
    console.log('Failed: code=' + s2.code + ' msg=' + s2.msg);
  }

  // 3. Try product schema
  console.log('\n--- /v2.0/cloud/thing/{id} (full device info) ---');
  const s3 = await apiCall(token, 'GET', '/v2.0/cloud/thing/' + DEVICE_ID);
  if (s3.success) {
    const d = s3.result;
    console.log('Product ID: ' + d.product_id);
    console.log('Product Name: ' + d.product_name);

    // Get product data points using product_id
    console.log('\n--- /v2.0/cloud/thing/product/' + d.product_id + '/data-points ---');
    const s4 = await apiCall(token, 'GET', '/v2.0/cloud/thing/product/' + d.product_id);
    if (s4.success) {
      console.log(JSON.stringify(s4.result, null, 2));
    } else {
      console.log('Failed: ' + s4.code + ' ' + s4.msg);
    }
  }

  // 4. Compare: what does MT13W send for PM?
  console.log('\n--- MT13W comparison (PM-related codes) ---');
  const mt = await apiCall(token, 'GET', '/v1.0/devices/a3d01864e463e3ede0hf0e/status');
  if (mt.success) {
    const pmItems = mt.result.filter(i => i.code.includes('pm') || i.code.includes('PM'));
    console.log('MT13W PM codes:');
    for (const item of pmItems) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
    console.log('\nMT13W ALL codes:');
    for (const item of mt.result) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
  } else {
    console.log('MT13W offline, trying MT13W 8...');
    const mt2 = await apiCall(token, 'GET', '/v1.0/devices/a38d2927decbfa80c9ozdg/status');
    if (mt2.success) {
      console.log('MT13W 8 ALL codes:');
      for (const item of mt2.result) {
        console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
      }
    }
  }
}

run().catch(e => console.error('ERROR:', e.message));
