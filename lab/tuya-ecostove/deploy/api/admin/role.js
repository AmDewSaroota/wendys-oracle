/**
 * POST /api/admin/role
 * Super admin promotes/demotes another admin
 *
 * Body: { adminId, newRole }  — newRole: 'super' | 'admin'
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

  const { adminId, newRole } = req.body || {};
  if (!adminId || !['super', 'admin'].includes(newRole)) {
    return res.status(400).json({ error: 'Missing adminId or invalid newRole' });
  }

  const headers = sbHeaders(sbKey);

  // A-H5: Prevent demoting last super admin
  if (newRole === 'admin') {
    const countRes = await fetch(
      sbUrl + '/rest/v1/admin_users?role=eq.super&select=id',
      { headers }
    );
    const supers = countRes.ok ? await countRes.json() : [];
    if (supers.length <= 1) {
      return res.status(400).json({ error: 'ไม่สามารถลดขั้นได้ — ต้องมี Super Admin อย่างน้อย 1 คน' });
    }
  }

  try {
    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + adminId,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ role: newRole }),
      }
    );
    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to update role' });
    }

    return res.status(200).json({
      success: true,
      message: newRole === 'super' ? 'เลื่อนขั้นเป็น Super Admin สำเร็จ' : 'ลดขั้นเป็น Admin สำเร็จ',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
