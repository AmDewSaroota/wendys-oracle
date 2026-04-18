const crypto = require('crypto');
const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const ACCESS_ID = '8grdqadptymnyeqdduxx';
const ACCESS_SECRET = '66a9cdc052ef49e7b41ce7a3ac5fa9ab';
const APP_USER_UID = 'sg1769167214791wrqoV';

// Known working device IDs
const PV28_ID = 'a39e1d85867b719abc10av';
const MT13W_ID = 'a3d01864e463e3ede0hf0e';
const MT15_ID = 'a31aff2ac0acbbf911cee3';

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
  console.log('Token UID from Tuya: ' + data.result.uid);
  return { token: data.result.access_token, uid: data.result.uid };
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
  const { token, uid: tokenUid } = await getToken();

  console.log('\n=== DEBUG: API PERMISSION ANALYSIS ===\n');
  console.log('Access ID: ' + ACCESS_ID);
  console.log('Token UID: ' + tokenUid);
  console.log('App User UID (env): ' + APP_USER_UID);
  console.log('Match: ' + (tokenUid === APP_USER_UID ? 'YES' : 'NO ← ปัญหาอาจอยู่ตรงนี้!'));

  // Test 1: /v1.0/users/{uid}/devices with env UID
  console.log('\n--- Test 1: /v1.0/users/{APP_USER_UID}/devices ---');
  const t1 = await apiCall(token, 'GET', '/v1.0/users/' + APP_USER_UID + '/devices');
  console.log('Result: ' + (t1.success ? 'SUCCESS (' + t1.result.length + ' devices)' : 'FAIL: ' + t1.code + ' ' + t1.msg));

  // Test 2: /v1.0/users/{token_uid}/devices (if different)
  if (tokenUid && tokenUid !== APP_USER_UID) {
    console.log('\n--- Test 2: /v1.0/users/{TOKEN_UID}/devices ---');
    const t2 = await apiCall(token, 'GET', '/v1.0/users/' + tokenUid + '/devices');
    console.log('Result: ' + (t2.success ? 'SUCCESS (' + t2.result.length + ' devices)' : 'FAIL: ' + t2.code + ' ' + t2.msg));
  }

  // Test 3: Direct device status (known working)
  console.log('\n--- Test 3: Direct device status (should work) ---');
  for (const [name, id] of [['PV28', PV28_ID], ['MT13W', MT13W_ID], ['MT15', MT15_ID]]) {
    const r = await apiCall(token, 'GET', '/v1.0/devices/' + id + '/status');
    console.log('  ' + name + ': ' + (r.success ? 'OK (' + r.result.length + ' points)' : 'FAIL: ' + r.code));
  }

  // Test 4: /v1.0/devices/{id} (device info - not status)
  console.log('\n--- Test 4: /v1.0/devices/{id} (device info) ---');
  const t4 = await apiCall(token, 'GET', '/v1.0/devices/' + PV28_ID);
  if (t4.success) {
    console.log('  PV28 owner_id: ' + t4.result.uid);
    console.log('  PV28 online: ' + t4.result.online);
    console.log('  → UID ตรงกับ env: ' + (t4.result.uid === APP_USER_UID ? 'YES' : 'NO → UID เปลี่ยนแล้ว!'));
  } else {
    console.log('  FAIL: ' + t4.code + ' ' + t4.msg);
  }

  // Test 5: Try with device owner UID
  if (t4.success && t4.result.uid && t4.result.uid !== APP_USER_UID) {
    const realUid = t4.result.uid;
    console.log('\n--- Test 5: /v1.0/users/{REAL_UID}/devices (UID จากเครื่อง) ---');
    console.log('  Real UID: ' + realUid);
    const t5 = await apiCall(token, 'GET', '/v1.0/users/' + realUid + '/devices');
    console.log('  Result: ' + (t5.success ? 'SUCCESS (' + t5.result.length + ' devices)' : 'FAIL: ' + t5.code + ' ' + t5.msg));
    if (t5.success) {
      console.log('\n  ★ แก้ปัญหาได้! เปลี่ยน TUYA_APP_USER_UID เป็น: ' + realUid);
      for (const d of t5.result) {
        console.log('    ' + d.id.substring(0, 12) + '... ' + (d.name || 'no-name').padEnd(15) + ' online=' + d.online);
      }
    }
  }
}

run().catch(e => console.error('ERROR:', e.message));
