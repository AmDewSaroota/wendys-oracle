const crypto = require('crypto');
const SB_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';
const hdrs = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };

async function q(path) {
  const res = await fetch(SB_URL + '/rest/v1/' + path, { headers: hdrs });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Supabase ' + res.status + ': ' + txt);
  }
  return res.json();
}

const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const ACCESS_ID = '8grdqadptymnyeqdduxx';
const ACCESS_SECRET = '66a9cdc052ef49e7b41ce7a3ac5fa9ab';
const PV28_ID = 'a39e1d85867b719abc10av';

function generateSign(accessId, secret, method, path, timestamp, accessToken, body) {
  accessToken = accessToken || ''; body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = accessId + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();
}

async function tuyaCall(token, path) {
  const ts = Date.now().toString();
  const sign = generateSign(ACCESS_ID, ACCESS_SECRET, 'GET', path, ts, token);
  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: ACCESS_ID, access_token: token, sign, t: ts, sign_method: 'HMAC-SHA256' }
  });
  return res.json();
}

async function run() {
  const BS004_ID = 'a34fa363efe0546f12mwpm';

  // 1. Latest sessions for BS 004
  const sessions = await q(
    'sessions?device_id=eq.' + BS004_ID
    + '&order=started_at.desc&limit=3'
    + '&select=id,started_at,ended_at,stove_type,session_status'
  );
  console.log('=== BS 004 Latest Sessions ===');
  for (const s of sessions) {
    console.log('  ' + String(s.id).slice(0, 8) + '  ' + s.started_at + '  ->  ' + (s.ended_at || 'OPEN') + '  [' + s.stove_type + '] ' + s.session_status);
  }

  if (!sessions.length) { console.log('No sessions!'); return; }
  const sid = String(sessions[0].id);

  // 2. Get pollution_logs for latest session
  const logs = await q(
    'pollution_logs?session_id=eq.' + sid
    + '&data_source=eq.sensor'
    + '&order=recorded_at.asc'
    + '&select=recorded_at,co2_value,hcho_value,pm25_value,pm10_value,temperature,humidity,tvoc_value,co_value'
  );

  console.log('\n=== BS 004 Readings (Session ' + sid.slice(0, 8) + ', ' + sessions[0].started_at + ') ===');
  console.log('Total readings: ' + logs.length + '\n');
  console.log('Time (BKK)            CO2    HCHO   PM25   PM10   Temp   Hum    TVOC   CO');
  console.log('--------------------------------------------------------------------------');
  for (const l of logs) {
    const t = new Date(l.recorded_at).toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });
    const v = (x) => x != null ? String(x) : '-';
    console.log(
      t.padEnd(22) +
      v(l.co2_value).padEnd(7) +
      v(l.hcho_value).padEnd(7) +
      v(l.pm25_value).padEnd(7) +
      v(l.pm10_value).padEnd(7) +
      v(l.temperature).padEnd(7) +
      v(l.humidity).padEnd(7) +
      v(l.tvoc_value).padEnd(7) +
      v(l.co_value)
    );
  }

  // 3. Stats
  if (logs.length > 0) {
    console.log('\n=== BS 004 Stats ===');
    for (const key of ['co2_value', 'hcho_value', 'pm25_value', 'pm10_value', 'temperature', 'humidity', 'tvoc_value', 'co_value']) {
      const vals = logs.map(l => l[key]).filter(v => v != null);
      if (vals.length > 0) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        console.log('  ' + key.padEnd(10) + ' avg=' + avg.toFixed(1).padEnd(8) + ' min=' + String(Math.min(...vals)).padEnd(6) + ' max=' + Math.max(...vals));
      }
    }
  }

  // 4. PV28 live now
  let ts = Date.now().toString();
  let path = '/v1.0/token?grant_type=1';
  let sign = generateSign(ACCESS_ID, ACCESS_SECRET, 'GET', path, ts);
  let res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: ACCESS_ID, sign, t: ts, sign_method: 'HMAC-SHA256' }
  });
  let data = await res.json();
  const token = data.result.access_token;

  console.log('\n=== PV28 LIVE NOW ===');
  const pv = await tuyaCall(token, '/v1.0/devices/' + PV28_ID + '/status');
  if (pv.success) {
    for (const item of pv.result) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
  }

  // 5. BS 004 live now
  console.log('\n=== BS 004 (MT13W) LIVE NOW ===');
  const mt = await tuyaCall(token, '/v1.0/devices/' + BS004_ID + '/status');
  if (mt.success) {
    for (const item of mt.result) {
      console.log('  ' + item.code.padEnd(25) + ' = ' + item.value);
    }
  } else {
    console.log('  BS 004 offline: ' + mt.msg);
  }

  // 6. Side by side comparison
  if (pv.success && mt.success) {
    console.log('\n=== SIDE BY SIDE (same moment) ===');
    const pvMap = {};
    for (const item of pv.result) pvMap[item.code] = item.value;
    const mtMap = {};
    for (const item of mt.result) mtMap[item.code] = item.value;

    console.log('Metric'.padEnd(20) + 'PV28'.padEnd(10) + 'BS004(MT13W)'.padEnd(15) + 'Same?');
    console.log('------------------------------------------------------');
    const pairs = [
      ['CO2', 'co2_value', 'co2_value'],
      ['CH2O/HCHO', 'ch2o_value', 'ch2o_value'],
      ['PM2.5', 'pm25_value', 'pm25_value'],
      ['PM10', null, 'pm10'],
      ['Temp', 'temp_current', 'temp_current'],
      ['Humidity', 'humidity_value', 'humidity_value'],
      ['VOC/TVOC', 'voc_value', 'tvoc_value'],
      ['CO', null, 'co_value'],
    ];
    for (const [label, pvCode, mtCode] of pairs) {
      const pvVal = pvCode ? (pvMap[pvCode] != null ? pvMap[pvCode] : 'N/A') : 'N/A';
      const mtVal = mtCode ? (mtMap[mtCode] != null ? mtMap[mtCode] : 'N/A') : 'N/A';
      console.log(label.padEnd(20) + String(pvVal).padEnd(10) + String(mtVal).padEnd(15));
    }
  }
}

run().catch(e => console.error('ERROR:', e.message));
