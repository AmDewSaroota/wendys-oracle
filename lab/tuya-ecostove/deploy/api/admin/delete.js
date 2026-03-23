/**
 * POST /api/admin/delete
 * Super admin deletes another admin
 *
 * Body: { adminId }
 * Auth: X-Admin-ID + X-Admin-PIN headers (caller must be super)
 */

const { corsHeaders, sbHeaders, verifyAdmin } = require('./_auth');

module.exports = async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const callerId = req.headers['x-admin-id'];
  const callerPin = req.headers['x-admin-pin'];
  if (!callerId || !callerPin) {
    return res.status(403).json({ error: 'Missing auth headers' });
  }

  const auth = await verifyAdmin(sbUrl, sbKey, callerId, callerPin, { requireSuper: true });
  if (!auth.ok) return res.status(403).json({ error: auth.error });

  const { adminId } = req.body || {};
  if (!adminId) {
    return res.status(400).json({ error: 'Missing adminId' });
  }

  const headers = sbHeaders(sbKey);

  // Prevent deleting super admin
  const targetRes = await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + adminId + '&select=role,name', { headers });
  const targetData = targetRes.ok ? await targetRes.json() : [];
  if (!targetData.length) return res.status(404).json({ error: 'Admin not found' });
  if (targetData[0].role === 'super') {
    return res.status(403).json({ error: 'Cannot delete super admin' });
  }

  try {
    const delRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + adminId,
      { method: 'DELETE', headers: { ...headers, 'Prefer': 'return=minimal' } }
    );
    if (!delRes.ok) {
      return res.status(500).json({ error: 'Failed to delete' });
    }

    return res.status(200).json({
      success: true,
      message: 'ลบ ' + targetData[0].name + ' สำเร็จ',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
