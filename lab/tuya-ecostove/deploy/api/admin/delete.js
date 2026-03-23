/**
 * POST /api/admin/delete
 * Super admin deletes another admin
 *
 * Body: { adminId }
 * Auth: X-Admin-ID + X-Admin-PIN headers (caller must be super)
 */

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-PIN, X-Admin-ID');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  // Verify caller is super admin
  const callerId = req.headers['x-admin-id'];
  const callerPin = req.headers['x-admin-pin'];
  if (!callerId || !callerPin) {
    return res.status(403).json({ error: 'Missing auth headers' });
  }

  const headers = { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey, 'Content-Type': 'application/json' };

  const callerRes = await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + callerId + '&select=id,role,pin_hash&limit=1', { headers });
  const callers = callerRes.ok ? await callerRes.json() : [];
  if (!callers.length) return res.status(403).json({ error: 'Admin not found' });

  // X-Admin-PIN is now a SHA-256 hash from client — compare directly
  if (callerPin !== callers[0].pin_hash || callers[0].role !== 'super') {
    return res.status(403).json({ error: 'เฉพาะ Super Admin เท่านั้น' });
  }

  const { adminId } = req.body || {};
  if (!adminId) {
    return res.status(400).json({ error: 'Missing adminId' });
  }

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
      return res.status(500).json({ error: 'Failed to delete: ' + await delRes.text() });
    }

    return res.status(200).json({
      success: true,
      message: 'ลบ ' + targetData[0].name + ' สำเร็จ',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
