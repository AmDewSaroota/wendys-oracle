/**
 * GET/PUT /api/admin/settings
 * GET: read app_settings (must be logged in)
 * PUT: update a setting (Super Admin only)
 *
 * PUT Body: { key, value }
 * Headers: X-Admin-ID, X-Admin-PIN
 */

const { corsHeaders, sbHeaders, verifyAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) return res.status(500).json({ error: 'Server misconfigured' });

  const headers = sbHeaders(sbKey);

  // GET — read all settings (any logged-in admin)
  if (req.method === 'GET') {
    const adminId = req.headers['x-admin-id'];
    const pin = req.headers['x-admin-pin'];
    if (!adminId || !pin) return res.status(401).json({ error: 'กรุณา login ก่อน' });

    const auth = await verifyAdmin(sbUrl, sbKey, adminId, pin);
    if (!auth.ok) return res.status(401).json({ error: auth.error });

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

    const auth = await verifyAdmin(sbUrl, sbKey, adminId, pin, { requireSuper: true });
    if (!auth.ok) return res.status(auth.error === 'เฉพาะ Super Admin เท่านั้น' ? 403 : 401).json({ error: auth.error });

    const upsertRes = await fetch(sbUrl + '/rest/v1/app_settings', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString(), updated_by: auth.admin.email }),
    });

    if (!upsertRes.ok) {
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    const result = await upsertRes.json();
    return res.status(200).json({ success: true, setting: result[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
