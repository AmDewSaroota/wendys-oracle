/**
 * POST /api/admin/change-pin
 * Change personal PIN
 *
 * Mode 1 (self): { newPin } — admin changes own PIN
 * Mode 2 (reset): { targetAdminId, newPin } — super admin resets another's PIN
 * Auth: X-Admin-ID + X-Admin-PIN headers
 */

const { hashPin, corsHeaders, sbHeaders, verifyAdmin } = require('./_auth');

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

  const auth = await verifyAdmin(sbUrl, sbKey, callerId, callerPin);
  if (!auth.ok) return res.status(403).json({ error: auth.error });

  const { newPin, targetAdminId } = req.body || {};
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'PIN ใหม่ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  try {
    let targetId = callerId;
    let msg = 'เปลี่ยน PIN สำเร็จ';

    if (targetAdminId && String(targetAdminId) !== String(callerId)) {
      if (auth.admin.role !== 'super') {
        return res.status(403).json({ error: 'เฉพาะ Super Admin ที่รีเซ็ต PIN คนอื่นได้' });
      }
      targetId = targetAdminId;
      msg = 'รีเซ็ต PIN สำเร็จ';
    }

    // A-H4: Use return=representation to verify row was updated
    const headers = sbHeaders(sbKey);
    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + targetId,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({ pin_hash: hashPin(newPin) }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to update PIN' });
    }
    const updated = await updateRes.json();
    if (!updated.length) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    return res.status(200).json({ success: true, message: msg });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
