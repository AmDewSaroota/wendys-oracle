/**
 * EcoStove API — List Tuya Cloud Devices
 * Admin-only endpoint: discovers all sensors from Tuya Cloud account
 *
 * Auth: PIN via X-Admin-PIN header
 * Tuya: /v1.0/users/{uid}/devices
 */

const crypto = require('crypto');

const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';

// ===== Tuya Auth =====
function generateSign(accessId, secret, method, path, timestamp, accessToken, body) {
  accessToken = accessToken || '';
  body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = accessId + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken(accessId, secret) {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign(accessId, secret, 'GET', path, timestamp);

  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: accessId, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });
  const data = await res.json();
  return data.success ? data.result.access_token : null;
}

// ===== Admin Auth Check (personal PIN from admin_users) =====
const crypto = require('crypto');
async function validatePin(req) {
  const adminId = req.headers['x-admin-id'] || '';
  const pin = req.headers['x-admin-pin'] || '';
  if (!adminId || !pin) return false;
  try {
    const sbUrl = process.env.SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
    if (!sbUrl || !sbKey) return false;
    const r = await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + adminId + '&select=id,role,pin_hash&limit=1', {
      headers: { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey },
    });
    const users = r.ok ? await r.json() : [];
    if (!users.length || !users[0].pin_hash) return false;
    const hash = crypto.createHash('sha256').update(pin).digest('hex');
    if (hash !== users[0].pin_hash) return false;
    return users[0].role;
  } catch (_) { return false; }
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Admin-PIN, X-Admin-ID, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const tuyaId = process.env.TUYA_ACCESS_ID;
  const tuyaSecret = process.env.TUYA_ACCESS_SECRET;
  const tuyaAppUserUid = (process.env.TUYA_APP_USER_UID || '').trim();

  if (!tuyaId || !tuyaSecret || !tuyaAppUserUid) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  // Validate admin PIN
  const role = await validatePin(req);
  if (!role) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Get Tuya token
  const token = await getTuyaToken(tuyaId, tuyaSecret);
  if (!token) {
    return res.status(502).json({ error: 'Failed to authenticate with Tuya Cloud' });
  }

  // List all devices under the app user
  const timestamp = Date.now().toString();
  const path = '/v1.0/users/' + tuyaAppUserUid + '/devices';
  const sign = generateSign(tuyaId, tuyaSecret, 'GET', path, timestamp, token);

  try {
    const devRes = await fetch(TUYA_BASE_URL + path, {
      headers: {
        client_id: tuyaId,
        access_token: token,
        sign,
        t: timestamp,
        sign_method: 'HMAC-SHA256',
      },
    });
    const data = await devRes.json();

    if (!data.success) {
      return res.status(502).json({ error: 'Tuya API error: ' + (data.msg || data.code) });
    }

    const devices = (data.result || []).map(d => ({
      id: d.id,
      name: d.name,
      online: d.online,
      model: d.model || d.product_name || '',
      category: d.category || '',
    }));

    return res.status(200).json({ devices });
  } catch (err) {
    return res.status(502).json({ error: 'Tuya fetch error: ' + err.message });
  }
};
