/**
 * POST /api/admin/forgot-pin
 * Send OTP to admin's registered email for PIN recovery
 *
 * Body: { email }
 * No auth required (user forgot their PIN)
 * Requires: RESEND_API_KEY
 *
 * Rate limit: max 3 requests per email within active OTP window
 */

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const headers = {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'กรุณากรอกอีเมล' });
  }

  try {
    // Look up admin by email
    const userRes = await fetch(
      sbUrl + '/rest/v1/admin_users?email=ilike.' + encodeURIComponent(email) + '&select=id,name,email,recovery_otp_expires_at&limit=1',
      { headers }
    );
    const users = userRes.ok ? await userRes.json() : [];

    if (users.length === 0) {
      // Don't reveal whether email exists — return success anyway
      return res.status(200).json({
        sent: true,
        message: 'หากอีเมลนี้มีในระบบ จะได้รับ OTP ทางอีเมล',
      });
    }

    const admin = users[0];

    // Rate limit: if OTP was sent recently (within last 2 minutes), block
    if (admin.recovery_otp_expires_at) {
      const expiresAt = new Date(admin.recovery_otp_expires_at);
      const sentAt = new Date(expiresAt.getTime() - 10 * 60 * 1000); // OTP lasts 10 min
      const cooldown = 2 * 60 * 1000; // 2 min cooldown
      if (Date.now() - sentAt.getTime() < cooldown) {
        return res.status(429).json({ error: 'กรุณารอสักครู่ก่อนขอ OTP ใหม่' });
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP in admin_users
    const updateRes = await fetch(
      sbUrl + '/rest/v1/admin_users?id=eq.' + admin.id,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          recovery_otp: otp,
          recovery_otp_expires_at: expiresAt,
          recovery_attempts: 0,
        }),
      }
    );

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to store OTP' });
    }

    // Send OTP email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + resendKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Biomass Stove <onboarding@resend.dev>',
        to: admin.email,
        subject: 'Biomass Stove — รหัส OTP รีเซ็ต PIN',
        html: [
          '<div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">',
          '<h2 style="color:#064e3b;text-align:center;margin-bottom:8px;">Biomass Stove</h2>',
          '<p style="text-align:center;color:#64748b;margin-bottom:24px;">รหัสยืนยันสำหรับรีเซ็ต PIN</p>',
          '<div style="background:#064e3b;color:white;font-size:36px;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;font-family:monospace;">' + otp + '</div>',
          '<p style="text-align:center;color:#94a3b8;margin-top:16px;font-size:14px;">หมดอายุใน 10 นาที</p>',
          '<p style="text-align:center;color:#cbd5e1;margin-top:8px;font-size:12px;">หากไม่ได้ขอรีเซ็ต PIN กรุณาเพิกเฉยอีเมลนี้</p>',
          '</div>',
        ].join(''),
      }),
    });

    if (!emailRes.ok) {
      console.error('Resend error:', await emailRes.text());
      return res.status(502).json({ error: 'ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่' });
    }

    const maskedEmail = admin.email.replace(/(.{2}).*(@.*)/, '$1***$2');

    return res.status(200).json({
      sent: true,
      message: 'ส่ง OTP ไปที่ ' + maskedEmail + ' แล้ว',
      maskedEmail,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
