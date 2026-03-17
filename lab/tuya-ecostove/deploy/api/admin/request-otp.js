/**
 * POST /api/admin/request-otp
 * Generate OTP and send via email (Resend API)
 * Used for 2-step verification when changing Super PIN
 *
 * Body: { email }
 * Auth: X-Admin-PIN header (must be current SUPER_PIN)
 * Requires: RESEND_API_KEY
 */

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-PIN');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL;
  const sbServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!sbUrl || !sbServiceKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured (RESEND_API_KEY missing)' });
  }

  const serviceHeaders = {
    'apikey': sbServiceKey,
    'Authorization': 'Bearer ' + sbServiceKey,
    'Content-Type': 'application/json',
  };

  // Resolve current super PIN: DB first, env fallback
  let superPin = process.env.SUPER_PIN;
  try {
    const r = await fetch(sbUrl + '/rest/v1/sync_config?select=super_pin&limit=1', {
      headers: serviceHeaders,
    });
    if (r.ok) { const rows = await r.json(); if (rows[0]?.super_pin) superPin = rows[0].super_pin; }
  } catch (_) {}

  // Verify caller has super PIN
  const pin = req.headers['x-admin-pin'] || '';
  if (!superPin || pin !== superPin) {
    return res.status(403).json({ error: 'Only super admin can request OTP' });
  }

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'กรุณาระบุ email' });
  }

  try {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Get sync_config id
    const cfgRes = await fetch(sbUrl + '/rest/v1/sync_config?select=id&limit=1', {
      headers: serviceHeaders,
    });
    const cfgRows = cfgRes.ok ? await cfgRes.json() : [];
    if (!cfgRows.length) {
      return res.status(500).json({ error: 'sync_config not found' });
    }

    // Store OTP in DB
    const updateRes = await fetch(
      sbUrl + '/rest/v1/sync_config?id=eq.' + cfgRows[0].id,
      {
        method: 'PATCH',
        headers: { ...serviceHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ otp_code: otp, otp_expires_at: expiresAt }),
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
        to: email,
        subject: 'Biomass Stove — รหัส OTP เปลี่ยน Super PIN',
        html: [
          '<div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">',
          '<h2 style="color:#064e3b;text-align:center;margin-bottom:8px;">Biomass Stove OTP</h2>',
          '<p style="text-align:center;color:#64748b;margin-bottom:24px;">รหัสยืนยันเปลี่ยน Super Admin PIN</p>',
          '<div style="background:#064e3b;color:white;font-size:36px;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;font-family:monospace;">' + otp + '</div>',
          '<p style="text-align:center;color:#94a3b8;margin-top:16px;font-size:14px;">หมดอายุใน 10 นาที</p>',
          '</div>',
        ].join(''),
      }),
    });

    if (!emailRes.ok) {
      const errData = await emailRes.text();
      console.error('Resend error:', errData);
      return res.status(502).json({ error: 'ส่ง email ไม่สำเร็จ' });
    }

    return res.status(200).json({
      success: true,
      message: 'ส่ง OTP ไปที่ ' + email.replace(/(.{2}).*(@.*)/, '$1***$2') + ' แล้ว',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
};
