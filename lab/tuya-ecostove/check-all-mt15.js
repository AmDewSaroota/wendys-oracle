const crypto = require('crypto');
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const ACCESS_ID = '8grdqadptymnyeqdduxx';
const ACCESS_SECRET = '66a9cdc052ef49e7b41ce7a3ac5fa9ab';
const APP_USER_UID = 'sg1769167214791wrqoV';

const MT15_DEVICES = [
  { name: 'MT15 001', id: 'a31aff2ac0acbbf911cee3' },
  { name: 'MT15 002', id: 'a3c18d99f430ea7bdb85wr' },
  { name: 'MT15 003', id: 'a3d2caec3264526ddfhy5e' },
  { name: 'MT15 004', id: 'a34e0358257a24b131osvl' },
  { name: 'MT15 005', id: 'a344ae1f8a99595434i8rw' },
  { name: 'MT15 006', id: 'a3bfe47fd497c4ba7ekpzb' },
];

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
  console.log('=== CHECK ALL MT15 DEVICES ===\n');

  // 1. Try batch list all devices
  console.log('--- Batch: /v1.0/users/{uid}/devices ---');
  const allDevices = await apiCall(token, 'GET', '/v1.0/users/' + APP_USER_UID + '/devices');
  if (allDevices.success) {
    console.log('OK — Total devices: ' + allDevices.result.length);
    for (const d of allDevices.result) {
      console.log('  ' + d.id + ' | ' + (d.name || '').padEnd(15) + ' | online=' + d.online);
    }
  } else {
    console.log('FAILED: ' + allDevices.code + ' — ' + allDevices.msg);
  }

  // 2. Check each MT15 individually
  console.log('\n--- Individual Status Check ---');
  const summary = [];

  for (const device of MT15_DEVICES) {
    const status = await apiCall(token, 'GET', '/v1.0/devices/' + device.id + '/status');
    if (status.success && status.result) {
      const readings = {};
      for (const item of status.result) {
        readings[item.code] = item.value;
      }
      const codes = status.result.map(i => i.code).sort();
      console.log('\n' + device.name + ' (' + device.id + ') — OK');
      console.log('  Data points (' + codes.length + '): ' + codes.join(', '));
      console.log('  PM2.5=' + (readings.pm25_value ?? '-') +
        ' | PM10=' + (readings.pm10 ?? '-') +
        ' | CO2=' + (readings.co2_value ?? '-') +
        ' | CO=' + (readings.co_value ?? '-') +
        ' | TVOC=' + (readings.tvoc_value ?? readings.voc_value ?? '-') +
        ' | HCHO=' + (readings.ch2o_value ?? '-') +
        ' | Temp=' + (readings.temp_current ?? '-') +
        ' | Hum=' + (readings.humidity_value ?? '-') +
        ' | Batt=' + (readings.battery_percentage ?? '-') + '%');
      summary.push({ name: device.name, ok: true, points: codes.length, hasCO: !!readings.co_value, hasTVOC: !!(readings.tvoc_value || readings.voc_value) });
    } else {
      console.log('\n' + device.name + ' (' + device.id + ') — FAILED: ' + (status.code || 'unknown') + ' ' + (status.msg || ''));
      summary.push({ name: device.name, ok: false, error: status.msg || status.code });
    }
  }

  // 3. Summary
  console.log('\n=== SUMMARY ===');
  const ok = summary.filter(s => s.ok);
  const fail = summary.filter(s => !s.ok);
  console.log('OK: ' + ok.length + '/' + summary.length);
  if (fail.length > 0) {
    console.log('FAILED:');
    for (const f of fail) console.log('  ' + f.name + ': ' + f.error);
  }
  console.log('CO available: ' + ok.filter(s => s.hasCO).length + '/' + ok.length);
  console.log('TVOC available: ' + ok.filter(s => s.hasTVOC).length + '/' + ok.length);
}

run().catch(e => console.error('ERROR:', e.message));
