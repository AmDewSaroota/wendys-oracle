/**
 * POST /api/admin/regenerate-recovery
 * Generate a new personal recovery code (must be logged in)
 *
 * Body: (none)
 * Auth: X-Admin-ID + X-Admin-PIN headers
 * Returns: { recoveryCode } — shown once, user must save it
 */

const crypto = require('crypto');

function generateRecoveryCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code.slice(0, 4) + '-' + code.slice(4);
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

  const headers = {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };

  // Verify caller
  const callerId = req.headers['x-admin-id'];
  const callerPin = req.headers['x-admin-pin'];
  if (!callerId || !callerPin) {
    return res.status(403).json({ error: 'Missing auth headers' });
  }

  const callerRes = await fetch(
    sbUrl + '/rest/v1/admin_users?id=eq.' + callerId + '&select=id,pin_hash&limit=1',
    { headers }
  );
  const callers = callerRes.ok ? await callerRes.json() : [];
  if (!callers.length) return res.status(403).json({ error: 'Admin not found' });

  // X-Admin-PIN is now a SHA-256 hash from client — compare directly
  if (callerPin !== callers[0].pin_hash) {
    return res.status(403).json({ error: 'PIN ไม่ถูกต้อง' });
  }

  try {
    const newCode = generateRecoveryCode();

    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + callerId,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ recovery_code: newCode }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to update recovery code' });
    }

    // Log activity
    await fetch(sbUrl + '/rest/v1/admin_activity_logs', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        admin_id: callerId,
        action: 'สร้าง Recovery Code ใหม่',
      }),
    });

    return res.status(200).json({
      success: true,
      recoveryCode: newCode,
      message: 'Recovery Code ใหม่ — กรุณาจดบันทึกไว้',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
