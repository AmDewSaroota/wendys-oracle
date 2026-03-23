/**
 * GET /api/admin/list
 * Returns admin list (id, name, email, role, created_at)
 * Does NOT expose pin_hash or recovery_code
 *
 * Auth: X-Admin-ID + X-Admin-PIN headers
 */

const { corsHeaders, sbHeaders, verifyAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) return res.status(500).json({ error: 'Server misconfigured' });

  const callerId = req.headers['x-admin-id'];
  const callerPin = req.headers['x-admin-pin'];
  if (!callerId || !callerPin) return res.status(403).json({ error: 'Missing auth headers' });

  try {
    const auth = await verifyAdmin(sbUrl, sbKey, callerId, callerPin);
    if (!auth.ok) return res.status(403).json({ error: auth.error });

    const listRes = await fetch(
      sbUrl + '/rest/v1/admin_users?select=id,name,email,role,created_at&order=created_at',
      { headers: sbHeaders(sbKey) }
    );
    const admins = listRes.ok ? await listRes.json() : [];

    return res.status(200).json({ admins });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
