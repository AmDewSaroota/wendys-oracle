/**
 * POST /api/admin/register
 * Self-register a new admin with invite code + personal PIN
 *
 * Body: { name, email, inviteCode, pin }
 * Auth: invite code (no login required)
 */

const { hashPin, generateRecoveryCode, corsHeaders, sbHeaders } = require('./_auth');

module.exports = async function handler(req, res) {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, inviteCode, pin } = req.body || {};

  if (!name || !email || !inviteCode || !pin) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ: ชื่อ, อีเมล, รหัสเชิญ, PIN' });
  }

  if (pin.length < 4) {
    return res.status(400).json({ error: 'PIN ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const headers = sbHeaders(sbKey);

  // Validate invite code — check DB first, fallback to env var
  let validCode = process.env.ADMIN_INVITE_CODE;
  try {
    const settingsRes = await fetch(
      sbUrl + '/rest/v1/app_settings?key=eq.invite_code&select=value',
      { headers }
    );
    if (settingsRes.ok) {
      const rows = await settingsRes.json();
      if (rows.length && rows[0].value) validCode = rows[0].value;
    }
  } catch (_) { /* fallback to env */ }
  if (!validCode || inviteCode !== validCode) {
    return res.status(403).json({ error: 'รหัสเชิญไม่ถูกต้อง' });
  }

  try {
    // Check duplicate email (normalized to lowercase)
    const normalizedEmail = email.toLowerCase().trim();
    const checkRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=eq.' + encodeURIComponent(normalizedEmail) + '&select=id',
      { headers }
    );
    const existing = checkRes.ok ? await checkRes.json() : [];
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email นี้ลงทะเบียนแล้ว' });
    }

    // Insert with hashed PIN + recovery code
    const recoveryCode = generateRecoveryCode();
    const insertRes = await fetch(sbUrl + '/rest/v1/admin_users', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, email: normalizedEmail, role: 'admin', pin_hash: hashPin(pin), recovery_code: recoveryCode }),
    });

    if (!insertRes.ok) {
      return res.status(500).json({ error: 'Failed to register' });
    }

    return res.status(200).json({
      success: true,
      recoveryCode,
      message: 'เพิ่ม ' + name + ' เป็น Admin สำเร็จ',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
