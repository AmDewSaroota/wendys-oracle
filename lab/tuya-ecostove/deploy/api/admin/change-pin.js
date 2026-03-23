/**
 * POST /api/admin/change-pin
 * Change personal PIN
 *
 * Mode 1 (self): { newPin } — admin changes own PIN
 * Mode 2 (reset): { targetAdminId, newPin } — super admin resets another's PIN
 * Auth: X-Admin-ID + X-Admin-PIN headers
 */

const crypto = require('crypto');

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

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

  const headers = { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey, 'Content-Type': 'application/json' };

  // Verify caller
  const callerId = req.headers['x-admin-id'];
  const callerPin = req.headers['x-admin-pin'];
  if (!callerId || !callerPin) {
    return res.status(403).json({ error: 'Missing auth headers' });
  }

  const callerRes = await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + callerId + '&select=id,role,pin_hash&limit=1', { headers });
  const callers = callerRes.ok ? await callerRes.json() : [];
  if (!callers.length) return res.status(403).json({ error: 'Admin not found' });

  // X-Admin-PIN is now a SHA-256 hash from client — compare directly
  if (callerPin !== callers[0].pin_hash) {
    return res.status(403).json({ error: 'PIN ไม่ถูกต้อง' });
  }

  const { newPin, targetAdminId } = req.body || {};
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'PIN ใหม่ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  try {
    let targetId = callerId; // default: change own PIN
    let msg = 'เปลี่ยน PIN สำเร็จ';

    // If resetting another admin's PIN, verify caller is super
    if (targetAdminId && String(targetAdminId) !== String(callerId)) {
      if (callers[0].role !== 'super') {
        return res.status(403).json({ error: 'เฉพาะ Super Admin ที่รีเซ็ต PIN คนอื่นได้' });
      }
      targetId = targetAdminId;
      msg = 'รีเซ็ต PIN สำเร็จ';
    }

    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + targetId,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ pin_hash: hashPin(newPin) }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to update PIN: ' + await updateRes.text() });
    }

    return res.status(200).json({ success: true, message: msg });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
