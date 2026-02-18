/**
 * Deep scan all 3 devices — find every available data code
 * bun deep_scan.js
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

async function apiGet(path, token) {
  const ts = Date.now().toString();
  const sign = generateSign('GET', path, ts, token);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'access_token': token, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  return res.json();
}

async function getToken() {
  const ts = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', path, ts);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'client_id': ACCESS_ID, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  const d = await res.json();
  return d.success ? d.result.access_token : null;
}

async function main() {
  const token = await getToken();
  if (!token) { console.log('Token failed'); return; }

  const devices = [
    { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT15/MT29' },
    { id: 'a3f00f68426975f8cexrtx', name: 'AIR_DETECTOR' },
    { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W' },
  ];

  for (const dev of devices) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`${dev.name} (${dev.id})`);
    console.log('='.repeat(60));

    // Device info
    const info = await apiGet(`/v1.0/devices/${dev.id}`, token);
    if (info.success) {
      console.log(`Product: ${info.result.product_name} | Category: ${info.result.category} | Online: ${info.result.online}`);
    }

    // Specifications — all registered data points
    const spec = await apiGet(`/v1.0/devices/${dev.id}/specifications`, token);
    if (spec.success) {
      console.log('\n[Spec - Status codes (read-only)]');
      for (const st of spec.result.status || []) {
        console.log(`  ${st.code.padEnd(25)} type=${st.type}`);
      }
      console.log('\n[Spec - Function codes (read/write)]');
      for (const fn of spec.result.functions || []) {
        console.log(`  ${fn.code.padEnd(25)} type=${fn.type}`);
      }
    }

    // Current status — actual values right now
    const status = await apiGet(`/v1.0/devices/${dev.id}/status`, token);
    if (status.success) {
      console.log('\n[Current values]');
      for (const item of status.result || []) {
        console.log(`  ${item.code.padEnd(25)} = ${item.value}`);
      }
    }

    // Device logs — last 24 hours, find ALL unique codes
    const now = Date.now();
    const dayAgo = now - 86400000;
    const logs = await apiGet(`/v1.0/devices/${dev.id}/logs?type=7&start_time=${dayAgo}&end_time=${now}&size=100`, token);
    if (logs.success && logs.result && logs.result.logs && logs.result.logs.length > 0) {
      const allLogs = logs.result.logs;
      const codeMap = {};
      for (const l of allLogs) {
        if (!codeMap[l.code]) codeMap[l.code] = [];
        codeMap[l.code].push(l.value);
      }
      console.log(`\n[Logs - unique codes in last 24h] (${allLogs.length} entries)`);
      for (const [code, values] of Object.entries(codeMap)) {
        const latest = values[0];
        console.log(`  ${code.padEnd(25)} latest=${latest}  (${values.length} entries)`);
      }

      // Check specifically for CO-related codes
      const coRelated = Object.keys(codeMap).filter(k =>
        k.includes('co') && k !== 'co2_value' && k !== 'co2_state'
      );
      if (coRelated.length > 0) {
        console.log('\n  >>> CO-related codes found: ' + coRelated.join(', '));
      }
    } else {
      console.log('\n[Logs] No data or error');
    }

    // Try report-type logs (type 1-9)
    for (const logType of [1, 2, 3, 4, 5, 6, 8, 9]) {
      const tLogs = await apiGet(`/v1.0/devices/${dev.id}/logs?type=${logType}&start_time=${dayAgo}&end_time=${now}&size=20`, token);
      if (tLogs.success && tLogs.result && tLogs.result.logs && tLogs.result.logs.length > 0) {
        const codes = [...new Set(tLogs.result.logs.map(l => l.code))];
        const hasCo = codes.filter(c => c.includes('co') && c !== 'co2_value' && c !== 'co2_state');
        if (hasCo.length > 0) {
          console.log(`\n  >>> [Log type ${logType}] CO codes: ${hasCo.join(', ')}`);
          for (const l of tLogs.result.logs.filter(l => hasCo.includes(l.code)).slice(0, 3)) {
            console.log(`      ${l.code} = ${l.value} @ ${new Date(l.event_time).toLocaleString('th-TH')}`);
          }
        }
      }
    }
  }
}

main().catch(console.error);
