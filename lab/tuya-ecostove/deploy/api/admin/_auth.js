/**
 * _auth.js — Shared authentication module for admin APIs
 * Centralizes: hashPin, timingSafeCompare, CORS, verifyAdmin
 */

const crypto = require('crypto');

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function generateRecoveryCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code.slice(0, 4) + '-' + code.slice(4);
}

function corsHeaders(res) {
  const origin = process.env.CORS_ORIGIN || 'https://biomassstove.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-PIN, X-Admin-ID');
}

function sbHeaders(sbKey) {
  return {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };
}

/**
 * Verify admin identity from X-Admin-ID + X-Admin-PIN headers.
 * @param {string} sbUrl
 * @param {string} sbKey - service key (bypasses RLS)
 * @param {string} callerId
 * @param {string} callerPin - SHA-256 hash from client
 * @param {{ requireSuper?: boolean }} opts
 * @returns {{ ok: boolean, error?: string, admin?: Object }}
 */
async function verifyAdmin(sbUrl, sbKey, callerId, callerPin, opts) {
  const headers = sbHeaders(sbKey);
  const res = await fetch(
    sbUrl + '/rest/v1/admin_users?id=eq.' + callerId + '&select=id,name,email,role,pin_hash&limit=1',
    { headers }
  );
  const admins = res.ok ? await res.json() : [];
  if (!admins.length) return { ok: false, error: 'Admin not found' };
  if (!timingSafeCompare(callerPin, admins[0].pin_hash)) {
    return { ok: false, error: 'PIN ไม่ถูกต้อง' };
  }
  if (opts && opts.requireSuper && admins[0].role !== 'super') {
    return { ok: false, error: 'เฉพาะ Super Admin เท่านั้น' };
  }
  return { ok: true, admin: admins[0] };
}

module.exports = {
  hashPin,
  timingSafeCompare,
  generateRecoveryCode,
  corsHeaders,
  sbHeaders,
  verifyAdmin,
};
