/**
 * GET/PUT /api/admin/settings
 * GET: อ่าน app_settings (ต้อง login)
 * PUT: แก้ setting (Super Admin เท่านั้น)
 *
 * PUT Body: { key, value }
 * Headers: X-Admin-ID, X-Admin-PIN
 */

const crypto = require('crypto');

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-ID, X-Admin-PIN');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) return res.status(500).json({ error: 'Server misconfigured' });

  const headers = {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };

  // GET — read all settings (any logged-in admin)
  if (req.method === 'GET') {
    const adminId = req.headers['x-admin-id'];
    const pin = req.headers['x-admin-pin'];
    if (!adminId || !pin) return res.status(401).json({ error: 'กรุณา login ก่อน' });

    // Verify admin
    const verifyRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + adminId + '&select=id,pin_hash',
      { headers }
    );
    const admins = verifyRes.ok ? await verifyRes.json() : [];
    if (!admins.length || admins[0].pin_hash !== hashPin(pin)) {
      return res.status(401).json({ error: 'PIN ไม่ถูกต้อง' });
    }

    const settingsRes = await fetch(sbUrl + '/rest/v1/app_settings?select=key,value,updated_at,updated_by', { headers });
    const settings = settingsRes.ok ? await settingsRes.json() : [];
    return res.status(200).json({ settings });
  }

  // PUT — update a setting (Super Admin only)
  if (req.method === 'PUT') {
    const adminId = req.headers['x-admin-id'];
    const pin = req.headers['x-admin-pin'];
    if (!adminId || !pin) return res.status(401).json({ error: 'กรุณา login ก่อน' });

    const { key, value } = req.body || {};
    if (!key || value === undefined) return res.status(400).json({ error: 'ต้องระบุ key และ value' });

    // Verify super_admin
    const verifyRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + adminId + '&select=id,email,role,pin_hash',
      { headers }
    );
    const admins = verifyRes.ok ? await verifyRes.json() : [];
    if (!admins.length || admins[0].pin_hash !== hashPin(pin)) {
      return res.status(401).json({ error: 'PIN ไม่ถูกต้อง' });
    }
    if (admins[0].role !== 'super_admin') {
      return res.status(403).json({ error: 'เฉพาะ Super Admin เท่านั้น' });
    }

    // Upsert setting
    const upsertRes = await fetch(sbUrl + '/rest/v1/app_settings', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString(), updated_by: admins[0].email }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      return res.status(500).json({ error: 'Failed: ' + errText });
    }

    const result = await upsertRes.json();
    return res.status(200).json({ success: true, setting: result[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
