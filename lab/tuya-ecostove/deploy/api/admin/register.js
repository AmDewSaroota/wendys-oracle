/**
 * POST /api/admin/register
 * Self-register a new admin with invite code + personal PIN
 *
 * Body: { name, email, inviteCode, pin }
 * Auth: invite code (ไม่ต้อง login — ลงทะเบียนเองได้)
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

  const { name, email, inviteCode, pin } = req.body || {};

  if (!name || !email || !inviteCode || !pin) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ: ชื่อ, อีเมล, รหัสเชิญ, PIN' });
  }

  if (pin.length < 4) {
    return res.status(400).json({ error: 'PIN ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  // Validate invite code
  const validCode = process.env.ADMIN_INVITE_CODE;
  if (!validCode || inviteCode !== validCode) {
    return res.status(403).json({ error: 'รหัสเชิญไม่ถูกต้อง' });
  }

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

  try {
    // Check duplicate email
    const checkRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(email) + '&select=id',
      { headers }
    );
    const existing = checkRes.ok ? await checkRes.json() : [];
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email นี้ลงทะเบียนแล้ว' });
    }

    // Insert with hashed PIN
    const insertRes = await fetch(sbUrl + '/rest/v1/admin_users', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, email, role: 'admin', pin_hash: hashPin(pin) }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      return res.status(500).json({ error: 'Failed to insert: ' + errText });
    }

    return res.status(200).json({
      success: true,
      message: 'เพิ่ม ' + name + ' เป็น Admin สำเร็จ',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
