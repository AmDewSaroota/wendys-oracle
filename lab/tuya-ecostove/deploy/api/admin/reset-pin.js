/**
 * POST /api/admin/reset-pin
 * Verify OTP and set new PIN (forgot-pin flow)
 *
 * Body: { email, otp, newPin }
 * No auth required (user forgot their PIN)
 * Max 3 wrong attempts per OTP — then must request new OTP
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

  const { email, otp, newPin } = req.body || {};
  if (!email || !otp || !newPin) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
  }
  if (newPin.length < 4) {
    return res.status(400).json({ error: 'PIN ใหม่ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  try {
    // Look up admin by email
    const userRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=ilike.' + encodeURIComponent(email) + '&select=id,name,email,recovery_otp,recovery_otp_expires_at,recovery_attempts&limit=1',
      { headers }
    );
    const users = userRes.ok ? await userRes.json() : [];

    if (users.length === 0) {
      return res.status(400).json({ error: 'ไม่พบข้อมูล กรุณาขอ OTP ใหม่' });
    }

    const admin = users[0];

    // Check if OTP exists
    if (!admin.recovery_otp || !admin.recovery_otp_expires_at) {
      return res.status(400).json({ error: 'ยังไม่ได้ขอ OTP กรุณาขอ OTP ก่อน' });
    }

    // Check expiry
    if (new Date() > new Date(admin.recovery_otp_expires_at)) {
      // Clear expired OTP
      await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ recovery_otp: null, recovery_otp_expires_at: null, recovery_attempts: 0 }),
      });
      return res.status(400).json({ error: 'OTP หมดอายุแล้ว กรุณาขอใหม่' });
    }

    // Check max attempts (3)
    if ((admin.recovery_attempts || 0) >= 3) {
      // Clear OTP — force request new one
      await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ recovery_otp: null, recovery_otp_expires_at: null, recovery_attempts: 0 }),
      });
      return res.status(429).json({ error: 'กรอก OTP ผิดเกินจำนวนครั้ง กรุณาขอ OTP ใหม่' });
    }

    // Verify OTP
    if (otp.trim() !== admin.recovery_otp) {
      // Increment attempts
      const newAttempts = (admin.recovery_attempts || 0) + 1;
      await fetch(sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ recovery_attempts: newAttempts }),
      });
      const remaining = 3 - newAttempts;
      return res.status(401).json({
        error: 'OTP ไม่ถูกต้อง' + (remaining > 0 ? ' (เหลือ ' + remaining + ' ครั้ง)' : ''),
      });
    }

    // OTP correct — update PIN and clear recovery fields
    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          pin_hash: hashPin(newPin),
          recovery_otp: null,
          recovery_otp_expires_at: null,
          recovery_attempts: 0,
        }),
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
        action: 'รีเซ็ต PIN ผ่านอีเมล OTP',
        details: { method: 'email_otp', email: admin.email },
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
