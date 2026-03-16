/**
 * POST /api/admin/verify-pin
 * Validate admin login — email + personal PIN
 *
 * Body: { email, pin }
 * Returns: { valid, role, adminId, adminName, adminEmail }
 */

const crypto = require('crypto');

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, pin } = req.body || {};
  if (!email || !pin) {
    return res.status(400).json({ error: 'กรุณากรอก Email และ PIN' });
  }

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Look up admin by email
    const userRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=ilike.' + encodeURIComponent(email) + '&select=id,name,email,role,pin_hash&limit=1',
      { headers: { 'apikey': sbKey, 'Authorization': 'Bearer ' + sbKey } }
    );
    const users = userRes.ok ? await userRes.json() : [];

    if (users.length === 0) {
      return res.status(401).json({ valid: false, error: 'ไม่พบ Email นี้ในระบบ' });
    }

    const admin = users[0];

    if (!admin.pin_hash) {
      return res.status(401).json({ valid: false, error: 'ยังไม่ได้ตั้ง PIN — กรุณาติดต่อ Super Admin' });
    }

    if (hashPin(pin) !== admin.pin_hash) {
      return res.status(401).json({ valid: false, error: 'PIN ไม่ถูกต้อง' });
    }

    return res.status(200).json({
      valid: true,
      role: admin.role,
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
