/**
 * POST /api/admin/regenerate-recovery
 * Generate a new personal recovery code (must be logged in)
 *
 * Body: (none)
 * Auth: X-Admin-ID + X-Admin-PIN headers
 * Returns: { recoveryCode } — shown once, user must save it
 */

const { generateRecoveryCode, corsHeaders, sbHeaders, verifyAdmin } = require('./_auth');

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

  try {
    const newCode = generateRecoveryCode();
    const headers = sbHeaders(sbKey);

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
    return res.status(500).json({ error: 'Server error' });
  }
};
