/**
 * POST /api/admin/forgot-pin
 * Reset PIN using personal recovery code
 *
 * Body: { email, recoveryCode, newPin }
 * No auth required (user forgot their PIN)
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

  const { email, recoveryCode, newPin } = req.body || {};
  if (!email || !recoveryCode || !newPin) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
  }
  if (newPin.length < 4) {
    return res.status(400).json({ error: 'PIN ใหม่ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  try {
    // Look up admin by email
    const userRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=ilike.' + encodeURIComponent(email) + '&select=id,name,email,recovery_code&limit=1',
      { headers }
    );
    const users = userRes.ok ? await userRes.json() : [];

    if (users.length === 0) {
      return res.status(401).json({ error: 'ไม่พบ Email นี้ในระบบ' });
    }

    const admin = users[0];

    if (!admin.recovery_code) {
      return res.status(400).json({ error: 'ยังไม่มี Recovery Code — กรุณาติดต่อ Super Admin' });
    }

    // Compare recovery code (case-insensitive)
    if (recoveryCode.trim().toUpperCase() !== admin.recovery_code.toUpperCase()) {
      return res.status(401).json({ error: 'Recovery Code ไม่ถูกต้อง' });
    }

    // Update PIN
    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ pin_hash: hashPin(newPin) }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to update PIN' });
    }

    // Log activity
    await fetch(sbUrl + '/rest/v1/admin_activity_logs', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        admin_id: admin.id,
        action: 'รีเซ็ต PIN ด้วย Recovery Code',
        details: { method: 'recovery_code', email: admin.email },
      }),
    });

    return res.status(200).json({
      success: true,
      message: 'ตั้ง PIN ใหม่สำเร็จ กรุณา Login ด้วย PIN ใหม่',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
