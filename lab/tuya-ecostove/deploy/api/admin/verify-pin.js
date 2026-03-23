/**
 * POST /api/admin/verify-pin
 * Validate admin login — email + personal PIN
 *
 * Body: { email, pin }
 * Returns: { valid, role, adminId, adminName, adminEmail }
 */

const { hashPin, timingSafeCompare, corsHeaders, sbHeaders } = require('./_auth');

module.exports = async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, pin, pinHash } = req.body || {};
  if (!email || (!pin && !pinHash)) {
    return res.status(400).json({ error: 'กรุณากรอก Email และ PIN' });
  }

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const userRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email.toLowerCase().trim()) + '&select=id,name,email,role,pin_hash&limit=1',
      { headers: sbHeaders(sbKey) }
    );
    const users = userRes.ok ? await userRes.json() : [];

    if (users.length === 0) {
      return res.status(401).json({ valid: false, error: 'Email หรือ PIN ไม่ถูกต้อง' });
    }

    const admin = users[0];

    if (!admin.pin_hash) {
      return res.status(401).json({ valid: false, error: 'ยังไม่ได้ตั้ง PIN — กรุณาติดต่อ Super Admin' });
    }

    const hash = pinHash || hashPin(pin);
    if (!timingSafeCompare(hash, admin.pin_hash)) {
      return res.status(401).json({ valid: false, error: 'Email หรือ PIN ไม่ถูกต้อง' });
    }

    return res.status(200).json({
      valid: true,
      role: admin.role,
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
    });
  } catch (err) {
    console.error('verify-pin error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
