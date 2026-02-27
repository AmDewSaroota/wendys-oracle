/**
 * EcoStove Sensor Monitor v2 — Session-Based Collection
 *
 * Features:
 * - Per-device session state machine (idle → baseline → collecting → cooldown)
 * - Auto-detect device online → start session
 * - Auto-cutoff at 2h10m, cooldown 5hr, max 2 sessions/day
 * - Offline tolerance: < 10 min = resume, >= 10 min = cancel/incomplete
 * - Session + daily summary persistence to Supabase
 * - Web UI with SSE real-time updates
 *
 * Usage: node lab/tuya-ecostove/sensor-monitor.js
 * Open:  http://localhost:3456
 */

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ===== Load Config =====
const CONFIG_PATH = path.join(__dirname, 'config.json');
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('ERROR: config.json not found!');
  console.error('Copy config.example.json to config.json and fill in your credentials.');
  process.exit(1);
}
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const PORT = CONFIG.port || 3456;
const COLLECTION_INTERVAL_MS = (CONFIG.intervalMinutes || 5) * 60 * 1000;

// Session config
const SC = CONFIG.session || {};
const BASELINE_MS = (SC.baselineMinutes || 10) * 60 * 1000;
const COLLECTION_MS = (SC.collectionMinutes || 120) * 60 * 1000;
const COOLDOWN_MS = (SC.cooldownHours || 5) * 60 * 60 * 1000;
const OFFLINE_TOLERANCE_MS = (SC.offlineToleranceMinutes || 10) * 60 * 1000;
const IDLE_SCAN_MS = (SC.idleScanMinutes || 30) * 60 * 1000;
const MAX_SESSIONS_PER_DAY = SC.maxSessionsPerDay || 2;

// Tuya
const TUYA_ACCESS_ID = CONFIG.tuya.accessId;
const TUYA_ACCESS_SECRET = CONFIG.tuya.accessSecret;
const TUYA_BASE = CONFIG.tuya.baseUrl;

// Supabase
const SB_URL = CONFIG.supabase.url;
const SB_KEY = CONFIG.supabase.anonKey;

// Devices — mutable, can be refreshed from Supabase
let DEVICES = CONFIG.devices;
let lastDeviceRefresh = 0;
const DEVICE_REFRESH_MS = 10 * 60 * 1000; // refresh device list every 10 minutes

// ===== Per-Device Session State =====
const deviceSessions = new Map();

function initDeviceState(deviceId) {
  return {
    state: 'idle',
    sessionId: null,
    sessionStartedAt: null,
    baselineEndAt: null,
    collectionEndAt: null,
    cooldownEndAt: null,
    lastOnlineAt: null,
    lastOfflineAt: null,
    lastIdleScanAt: 0,
    readingsInSession: 0,
    sessionsToday: 0,
    todayDate: getTodayStr(),
  };
}

async function refreshDevicesFromSupabase() {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/devices?is_active=eq.true&select=id,tuya_device_id,name,subject_id`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` },
    });
    if (!res.ok) return;
    const dbDevices = await res.json();
    if (dbDevices && dbDevices.length > 0) {
      const newDevices = dbDevices.map(d => ({ id: d.tuya_device_id, name: d.name, houseId: d.subject_id }));
      // Add session state for new devices
      for (const dev of newDevices) {
        if (!deviceSessions.has(dev.id)) {
          deviceSessions.set(dev.id, initDeviceState(dev.id));
        }
      }
      // Remove session state for removed devices (only if idle)
      const newIds = new Set(newDevices.map(d => d.id));
      for (const [id, ds] of deviceSessions) {
        if (!newIds.has(id) && ds.state === 'idle') {
          deviceSessions.delete(id);
        }
      }
      DEVICES = newDevices;
      log(`[Config] Loaded ${DEVICES.length} devices from Supabase`, 'success');
    }
  } catch (err) {
    log(`[Config] Supabase device refresh failed, using local config: ${err.message}`, 'warning');
  }
  lastDeviceRefresh = Date.now();
}

for (const dev of DEVICES) {
  deviceSessions.set(dev.id, initDeviceState(dev.id));
}

// Global
let running = false;
let mainLoopTimer = null;
let stats = { rounds: 0, saved: 0, offline: 0, errors: 0, sessions: 0 };
let sseClients = [];
let cachedToken = null;
let tokenExpiry = 0;

function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

// ===== SSE =====
function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients = sseClients.filter(res => {
    try { res.write(msg); return true; } catch { return false; }
  });
}

function log(message, type = 'info') {
  const time = new Date().toLocaleTimeString('th-TH', { timeZone: 'Asia/Bangkok' });
  console.log(`[${time}] ${message}`);
  broadcast('log', { time, message, type });
}

// ===== Tuya API =====
function generateSign(method, apiPath, timestamp, accessToken = '', body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', apiPath].join('\n');
  const signStr = TUYA_ACCESS_ID + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', TUYA_ACCESS_SECRET).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const ts = Date.now().toString();
  const apiPath = '/v1.0/token?grant_type=1';
  const sign = generateSign('GET', apiPath, ts);
  const res = await fetch(`${TUYA_BASE}${apiPath}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  const data = await res.json();
  if (!data.success) return null;
  cachedToken = data.result.access_token;
  tokenExpiry = Date.now() + (data.result.expire_time * 1000) - 60000;
  return cachedToken;
}

async function tuyaGet(apiPath, token) {
  const ts = Date.now().toString();
  const sign = generateSign('GET', apiPath, ts, token);
  const res = await fetch(`${TUYA_BASE}${apiPath}`, {
    headers: { 'client_id': TUYA_ACCESS_ID, 'access_token': token, 'sign': sign, 't': ts, 'sign_method': 'HMAC-SHA256' }
  });
  return res.json();
}

async function isDeviceOnline(token, deviceId) {
  const data = await tuyaGet(`/v1.0/devices/${deviceId}`, token);
  return data.success && data.result && data.result.online === true;
}

async function getDeviceReadings(token, deviceId) {
  // First check if device is truly online (not just cached data)
  const deviceOnline = await isDeviceOnline(token, deviceId);
  if (!deviceOnline) return null;

  const data = await tuyaGet(`/v1.0/devices/${deviceId}/status`, token);
  if (!data.success) return null;
  const readings = {};
  for (const item of data.result || []) {
    readings[item.code] = item.value;
  }
  return readings;
}

// ===== AQI Calculation =====
function calculateAqi(pm25) {
  if (pm25 == null) return null;
  const bp = [
    [0, 35, 0, 50], [35, 75, 50, 100], [75, 115, 100, 150],
    [115, 150, 150, 200], [150, 250, 200, 300], [250, 350, 300, 400],
    [350, 500, 400, 500],
  ];
  for (const [cLo, cHi, aqiLo, aqiHi] of bp) {
    if (pm25 <= cHi) return Math.round(((aqiHi - aqiLo) / (cHi - cLo)) * (pm25 - cLo) + aqiLo);
  }
  return 500;
}

// ===== Supabase: pollution_logs =====
async function insertToSupabase(readings, deviceId, sessionId = null) {
  const record = {
    pm25_value: readings.pm25_value ?? null,
    pm1_value: readings.pm1 ?? null,
    pm10_value: readings.pm10 ?? null,
    co2_value: readings.co2_value ?? null,
    co_value: readings.co_value ?? null,
    temperature: readings.temp_current ?? null,
    humidity: readings.humidity_value ?? null,
    hcho_value: readings.ch2o_value ?? null,
    tvoc_value: readings.tvoc_value ?? null,
    aqi: calculateAqi(readings.pm25_value ?? null),
    data_source: 'sensor',
    tuya_device_id: deviceId,
    stove_type: 'eco',
    session_type: sessionId ? 'session' : 'auto',
    session_id: sessionId,
    status: 'pending',
    recorded_at: new Date().toISOString(),
  };

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/pollution_logs`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(record),
      });

      if (res.ok) {
        const result = await res.json();
        return result[0];
      }
      const err = await res.text();
      throw new Error(`Supabase error ${res.status}: ${err}`);
    } catch (err) {
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        log(`[Supabase] Retry ${attempt}/${maxRetries} in ${delay/1000}s: ${err.message}`, 'warning');
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

// ===== Supabase: sessions =====
async function createSession(deviceId, houseId) {
  const record = {
    device_id: deviceId,
    house_id: houseId || null,
    session_status: 'baseline',
    stove_type: 'eco',
    started_at: new Date().toISOString(),
  };

  const res = await fetch(`${SB_URL}/rest/v1/sessions`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(record),
  });

  if (res.ok) {
    const result = await res.json();
    return result[0];
  }
  const err = await res.text();
  throw new Error(`Create session failed ${res.status}: ${err}`);
}

async function updateSession(sessionId, updates) {
  updates.updated_at = new Date().toISOString();

  const res = await fetch(`${SB_URL}/rest/v1/sessions?id=eq.${sessionId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(updates),
  });

  if (res.ok) return (await res.json())[0];
  const err = await res.text();
  throw new Error(`Update session failed ${res.status}: ${err}`);
}

async function computeSessionAggregates(sessionId) {
  const res = await fetch(
    `${SB_URL}/rest/v1/pollution_logs?session_id=eq.${sessionId}&select=pm25_value,pm10_value,co2_value,temperature,humidity`,
    { headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` } }
  );

  if (!res.ok) return null;
  const logs = await res.json();
  if (!logs.length) return null;

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const pm25s = logs.map(l => l.pm25_value).filter(v => v != null);
  const pm10s = logs.map(l => l.pm10_value).filter(v => v != null);
  const co2s = logs.map(l => l.co2_value).filter(v => v != null);
  const temps = logs.map(l => l.temperature).filter(v => v != null);
  const hums = logs.map(l => l.humidity).filter(v => v != null);

  return {
    readings_count: logs.length,
    avg_pm25: avg(pm25s),
    max_pm25: pm25s.length ? Math.max(...pm25s) : null,
    min_pm25: pm25s.length ? Math.min(...pm25s) : null,
    avg_pm10: avg(pm10s),
    avg_co2: avg(co2s),
    avg_temperature: avg(temps),
    avg_humidity: avg(hums),
  };
}

// ===== Supabase: daily_summaries =====
async function upsertDailySummary(deviceId, houseId) {
  const today = getTodayStr();

  const res = await fetch(
    `${SB_URL}/rest/v1/sessions?device_id=eq.${deviceId}&started_at=gte.${today}T00:00:00Z&started_at=lt.${today}T23:59:59Z`,
    { headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` } }
  );

  if (!res.ok) return;
  const sessions = await res.json();

  const completed = sessions.filter(s => s.session_status === 'complete');
  const incomplete = sessions.filter(s => s.session_status === 'incomplete');
  const cancelled = sessions.filter(s => s.session_status === 'cancelled');

  const totalReadings = completed.reduce((sum, s) => sum + (s.readings_count || 0), 0);

  const avgOf = (arr, key) => {
    const vals = arr.map(s => s[key]).filter(v => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  let compliance = 'pending';
  if (completed.length >= 2) compliance = 'complete';
  else if (completed.length === 1) compliance = 'partial';

  const summary = {
    summary_date: today,
    device_id: deviceId,
    house_id: houseId || null,
    sessions_completed: completed.length,
    sessions_incomplete: incomplete.length,
    sessions_cancelled: cancelled.length,
    total_readings: totalReadings,
    avg_pm25: avgOf(completed, 'avg_pm25'),
    max_pm25: completed.length ? Math.max(...completed.map(c => c.max_pm25).filter(v => v != null)) : null,
    min_pm25: completed.length ? Math.min(...completed.map(c => c.min_pm25).filter(v => v != null)) : null,
    avg_co2: avgOf(completed, 'avg_co2'),
    avg_temperature: avgOf(completed, 'avg_temperature'),
    avg_humidity: avgOf(completed, 'avg_humidity'),
    compliance_status: compliance,
    stove_type: 'eco',
    updated_at: new Date().toISOString(),
  };

  await fetch(`${SB_URL}/rest/v1/daily_summaries`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation,resolution=merge-duplicates',
    },
    body: JSON.stringify(summary),
  });
}

// ===== Session State Machine =====
function resetDayCounterIfNeeded(ds) {
  const today = getTodayStr();
  if (ds.todayDate !== today) {
    ds.sessionsToday = 0;
    ds.todayDate = today;
  }
}

async function processDevice(dev, token) {
  const ds = deviceSessions.get(dev.id);
  resetDayCounterIfNeeded(ds);

  // Get readings (also serves as online check — saves 1 API call)
  let online = false;
  let readings = null;

  try {
    readings = await getDeviceReadings(token, dev.id);
    online = readings !== null;
  } catch {
    online = false;
  }

  const now = Date.now();

  if (online) {
    ds.lastOnlineAt = now;
    ds.lastOfflineAt = null;
  } else {
    if (!ds.lastOfflineAt) ds.lastOfflineAt = now;
    stats.offline++;
  }

  broadcast('device', {
    id: dev.id, name: dev.name, online, readings,
    sessionState: ds.state, sessionId: ds.sessionId,
    readingsInSession: ds.readingsInSession,
  });

  switch (ds.state) {
    case 'idle':      await handleIdle(dev, ds, online, readings, now); break;
    case 'baseline':  await handleBaseline(dev, ds, online, readings, now); break;
    case 'collecting': await handleCollecting(dev, ds, online, readings, now); break;
    case 'cooldown':  handleCooldown(dev, ds, now); break;
  }
}

async function handleIdle(dev, ds, online, readings, now) {
  if (!online) return;
  if (ds.sessionsToday >= MAX_SESSIONS_PER_DAY) return;

  try {
    const session = await createSession(dev.id, dev.houseId);
    ds.state = 'baseline';
    ds.sessionId = session.id;
    ds.sessionStartedAt = now;
    ds.baselineEndAt = now + BASELINE_MS;
    ds.collectionEndAt = now + BASELINE_MS + COLLECTION_MS;
    ds.cooldownEndAt = now + COOLDOWN_MS;
    ds.readingsInSession = 0;

    log(`[${dev.name}] SESSION #${session.id} STARTED (baseline ${SC.baselineMinutes || 10} min)`, 'start');
    broadcast('session', { deviceId: dev.id, state: 'baseline', sessionId: session.id });
    stats.sessions++;

    if (readings) await recordReading(dev, ds, readings);
  } catch (err) {
    log(`[${dev.name}] Failed to start session: ${err.message}`, 'error');
    stats.errors++;
  }
}

async function handleBaseline(dev, ds, online, readings, now) {
  if (!online && ds.lastOfflineAt && (now - ds.lastOfflineAt) >= OFFLINE_TOLERANCE_MS) {
    await cancelSession(dev, ds, 'offline_timeout_baseline');
    return;
  }

  if (online && readings) await recordReading(dev, ds, readings);

  if (now >= ds.baselineEndAt) {
    ds.state = 'collecting';
    try {
      await updateSession(ds.sessionId, {
        session_status: 'collecting',
        baseline_ended_at: new Date().toISOString(),
      });
    } catch (err) {
      log(`[${dev.name}] Failed to update baseline end: ${err.message}`, 'error');
    }
    log(`[${dev.name}] BASELINE COMPLETE — collecting for ${SC.collectionMinutes || 120} min`, 'round');
    broadcast('session', { deviceId: dev.id, state: 'collecting', sessionId: ds.sessionId });
  }
}

async function handleCollecting(dev, ds, online, readings, now) {
  if (!online && ds.lastOfflineAt && (now - ds.lastOfflineAt) >= OFFLINE_TOLERANCE_MS) {
    await endSessionIncomplete(dev, ds, 'offline_timeout_collecting');
    return;
  }

  if (online && readings) await recordReading(dev, ds, readings);

  if (now >= ds.collectionEndAt) {
    await completeSession(dev, ds);
  }
}

function handleCooldown(dev, ds, now) {
  if (now >= ds.cooldownEndAt) {
    ds.state = 'idle';
    ds.sessionId = null;
    log(`[${dev.name}] COOLDOWN COMPLETE — ready for next session`, 'info');
    broadcast('session', { deviceId: dev.id, state: 'idle' });
  }
}

async function recordReading(dev, ds, readings) {
  try {
    const record = await insertToSupabase(readings, dev.id, ds.sessionId);
    ds.readingsInSession++;
    stats.saved++;
    const pm25 = readings.pm25_value ?? '-';
    const co2 = readings.co2_value ?? '-';
    log(`[${dev.name}] #${ds.readingsInSession} PM2.5:${pm25} CO2:${co2}`, 'data');
  } catch (err) {
    log(`[${dev.name}] Save error: ${err.message}`, 'error');
    stats.errors++;
  }
}

async function cancelSession(dev, ds, reason) {
  log(`[${dev.name}] SESSION CANCELLED — ${reason}`, 'error');
  try {
    await updateSession(ds.sessionId, {
      session_status: 'cancelled',
      cancel_reason: reason,
      ended_at: new Date().toISOString(),
    });
  } catch (err) {
    log(`[${dev.name}] Failed to update cancelled session: ${err.message}`, 'error');
  }
  ds.state = 'idle';
  ds.sessionId = null;
  broadcast('session', { deviceId: dev.id, state: 'idle', reason });
}

async function endSessionIncomplete(dev, ds, reason) {
  log(`[${dev.name}] SESSION INCOMPLETE — ${reason} (${ds.readingsInSession} readings)`, 'error');
  try {
    const aggregates = await computeSessionAggregates(ds.sessionId);
    await updateSession(ds.sessionId, {
      session_status: 'incomplete',
      cancel_reason: reason,
      ended_at: new Date().toISOString(),
      collection_ended_at: new Date().toISOString(),
      ...(aggregates || {}),
    });
    await upsertDailySummary(dev.id, dev.houseId);
  } catch (err) {
    log(`[${dev.name}] Failed to finalize incomplete session: ${err.message}`, 'error');
  }
  ds.state = 'cooldown';
  ds.sessionId = null;
  broadcast('session', { deviceId: dev.id, state: 'cooldown', reason });
}

async function completeSession(dev, ds) {
  log(`[${dev.name}] SESSION COMPLETE (${ds.readingsInSession} readings)`, 'success');
  try {
    const aggregates = await computeSessionAggregates(ds.sessionId);
    await updateSession(ds.sessionId, {
      session_status: 'complete',
      ended_at: new Date().toISOString(),
      collection_ended_at: new Date().toISOString(),
      ...(aggregates || {}),
    });
    ds.sessionsToday++;
    await upsertDailySummary(dev.id, dev.houseId);
  } catch (err) {
    log(`[${dev.name}] Failed to finalize session: ${err.message}`, 'error');
  }
  ds.state = 'cooldown';
  ds.sessionId = null;
  broadcast('session', { deviceId: dev.id, state: 'cooldown' });
}

// ===== Process Restart Recovery =====
async function recoverSessions() {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/sessions?session_status=in.(baseline,collecting)&order=started_at.desc`,
      { headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` } }
    );
    if (!res.ok) return;
    const orphaned = await res.json();
    for (const s of orphaned) {
      log(`Recovering orphaned session #${s.id} (${s.device_id}) — marking incomplete`, 'info');
      const aggregates = await computeSessionAggregates(s.id);
      await updateSession(s.id, {
        session_status: 'incomplete',
        cancel_reason: 'process_restart',
        ended_at: new Date().toISOString(),
        ...(aggregates || {}),
      });
    }
    if (orphaned.length) log(`Recovered ${orphaned.length} orphaned sessions`, 'info');
  } catch (err) {
    log(`Recovery error: ${err.message}`, 'error');
  }
}

// ===== Main Monitoring Loop =====
async function startMonitoring() {
  if (running) return { ok: false, message: 'Already running' };
  running = true;
  stats = { rounds: 0, saved: 0, offline: 0, errors: 0, sessions: 0 };

  // Load devices from Supabase on startup
  await refreshDevicesFromSupabase();

  log('Monitoring started — session-based collection', 'start');
  broadcast('status', { running: true });
  broadcast('stats', stats);

  monitorTick();

  mainLoopTimer = setInterval(() => {
    monitorTick().catch(err => {
      log(`Tick error: ${err.message}`, 'error');
      stats.errors++;
    });
  }, COLLECTION_INTERVAL_MS);

  return { ok: true, message: 'Monitoring started' };
}

function stopMonitoring() {
  if (!running) return { ok: false, message: 'Not running' };
  running = false;
  if (mainLoopTimer) {
    clearInterval(mainLoopTimer);
    mainLoopTimer = null;
  }

  log(`Monitoring stopped (${stats.saved} readings, ${stats.sessions} sessions)`, 'stop');
  broadcast('status', { running: false });
  return { ok: true, message: `Stopped — ${stats.saved} readings saved` };
}

async function monitorTick() {
  stats.rounds++;

  // Periodically refresh device list from Supabase
  if (Date.now() - lastDeviceRefresh >= DEVICE_REFRESH_MS) {
    await refreshDevicesFromSupabase();
  }

  const token = await getTuyaToken();
  if (!token) {
    log('Token error — skipping tick', 'error');
    stats.errors++;
    return;
  }

  for (const dev of DEVICES) {
    const ds = deviceSessions.get(dev.id);
    const now = Date.now();

    // Active sessions: process every tick (5 min)
    // Idle/cooldown: process only on idle scan intervals
    const isActive = ds.state === 'baseline' || ds.state === 'collecting';

    if (!isActive && (now - ds.lastIdleScanAt) < IDLE_SCAN_MS) {
      // Handle cooldown expiry even without scanning
      if (ds.state === 'cooldown') handleCooldown(dev, ds, now);
      continue;
    }

    if (!isActive) ds.lastIdleScanAt = now;

    try {
      await processDevice(dev, token);
    } catch (err) {
      log(`[${dev.name}] Process error: ${err.message}`, 'error');
      stats.errors++;
    }
  }

  broadcast('stats', stats);
}

// ===== Check All Devices (manual) =====
async function checkAllDevices() {
  const token = await getTuyaToken();
  if (!token) {
    log('Cannot connect to Tuya', 'error');
    return [];
  }

  const results = [];
  for (const dev of DEVICES) {
    const readings = await getDeviceReadings(token, dev.id);
    const online = readings !== null;
    const ds = deviceSessions.get(dev.id);
    results.push({ ...dev, online, readings, sessionState: ds.state });
  }
  return results;
}

// ===== HTTP Server =====
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const urlPath = reqUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // SSE endpoint
  if (urlPath === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`event: status\ndata: ${JSON.stringify({ running })}\n\n`);
    res.write(`event: stats\ndata: ${JSON.stringify(stats)}\n\n`);
    // Send current session states
    for (const [id, ds] of deviceSessions) {
      res.write(`event: session\ndata: ${JSON.stringify({ deviceId: id, state: ds.state, sessionId: ds.sessionId, readingsInSession: ds.readingsInSession })}\n\n`);
    }
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    return;
  }

  // Check sensor status
  if (urlPath === '/api/check' && req.method === 'POST') {
    try {
      log('Checking sensors...', 'info');
      const results = await checkAllDevices();
      for (const dev of results) {
        const status = dev.online ? 'ONLINE' : 'OFFLINE';
        log(`[${dev.name}] ${status} [${dev.sessionState}]`, dev.online ? 'success' : 'offline');
        broadcast('device', { id: dev.id, name: dev.name, online: dev.online, readings: dev.readings, sessionState: dev.sessionState });
      }
      return json(res, { ok: true, devices: results });
    } catch (err) {
      log(`Check error: ${err.message}`, 'error');
      return json(res, { ok: false, error: err.message }, 500);
    }
  }

  // Start monitoring
  if (urlPath === '/api/start' && req.method === 'POST') {
    return json(res, startMonitoring());
  }

  // Stop monitoring
  if (urlPath === '/api/stop' && req.method === 'POST') {
    return json(res, stopMonitoring());
  }

  // Get session states
  if (urlPath === '/api/sessions' && req.method === 'GET') {
    const sessions = {};
    for (const [id, ds] of deviceSessions) {
      sessions[id] = {
        state: ds.state,
        sessionId: ds.sessionId,
        sessionsToday: ds.sessionsToday,
        readingsInSession: ds.readingsInSession,
        sessionStartedAt: ds.sessionStartedAt,
        baselineEndAt: ds.baselineEndAt,
        collectionEndAt: ds.collectionEndAt,
        cooldownEndAt: ds.cooldownEndAt,
      };
    }
    return json(res, { ok: true, sessions });
  }

  // Cancel a session manually
  if (urlPath === '/api/session/cancel' && req.method === 'POST') {
    const body = await parseBody(req);
    const ds = deviceSessions.get(body.deviceId);
    if (!ds) return json(res, { ok: false, message: 'Device not found' });
    if (ds.state === 'idle' || ds.state === 'cooldown') {
      return json(res, { ok: false, message: 'No active session' });
    }
    const dev = DEVICES.find(d => d.id === body.deviceId);
    await cancelSession(dev, ds, 'manual_cancel');
    return json(res, { ok: true, message: 'Session cancelled' });
  }

  // Serve HTML
  if (urlPath === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(HTML_PAGE);
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

// ===== HTML Page =====
const HTML_PAGE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoStove Sensor Monitor v2</title>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Kanit', sans-serif;
      background: #f0f4f3;
      color: #1a2e2a;
      min-height: 100vh;
    }
    .container { max-width: 960px; margin: 0 auto; padding: 20px; }

    header { text-align: center; padding: 30px 0 20px; }
    header h1 { font-size: 1.8rem; font-weight: 600; color: #064e3b; }
    header p { color: #6b7280; font-weight: 300; margin-top: 4px; }

    .controls { display: flex; gap: 12px; justify-content: center; margin: 20px 0; flex-wrap: wrap; }
    button {
      font-family: 'Kanit', sans-serif; font-size: 1rem; padding: 10px 24px;
      border: none; border-radius: 12px; cursor: pointer; font-weight: 400; transition: all 0.2s;
    }
    button:hover { transform: translateY(-1px); }
    button:active { transform: translateY(0); }
    button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-check { background: #064e3b; color: white; }
    .btn-start { background: #059669; color: white; }
    .btn-stop { background: #dc2626; color: white; }

    .status-bar { text-align: center; padding: 8px; border-radius: 8px; margin-bottom: 20px; font-weight: 400; }
    .status-idle { background: #e5e7eb; color: #6b7280; }
    .status-running { background: #d1fae5; color: #065f46; }

    .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
    .stat-card { background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .stat-card .value { font-size: 1.6rem; font-weight: 600; color: #064e3b; }
    .stat-card .label { font-size: 0.85rem; color: #9ca3af; font-weight: 300; }

    .devices { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .device-card {
      background: white; border-radius: 16px; padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-bottom: 4px solid #e5e7eb; transition: border-color 0.3s;
    }
    .device-card.online { border-bottom-color: #059669; }
    .device-card.offline { border-bottom-color: #ef4444; }
    .device-card .device-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .device-card .device-name { font-weight: 600; font-size: 1.1rem; }
    .device-card .device-status { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 400; }
    .device-status.online { background: #d1fae5; color: #065f46; }
    .device-status.offline { background: #fee2e2; color: #991b1b; }

    .session-badge {
      display: inline-block; padding: 3px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 500; margin-bottom: 8px;
    }
    .session-badge.idle { background: #f3f4f6; color: #6b7280; }
    .session-badge.baseline { background: #dbeafe; color: #1d4ed8; }
    .session-badge.collecting { background: #fef3c7; color: #92400e; }
    .session-badge.cooldown { background: #ede9fe; color: #6d28d9; }

    .readings { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .reading-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; }
    .reading-item .r-label { color: #6b7280; font-weight: 300; }
    .reading-item .r-value { font-weight: 600; color: #064e3b; }

    .log-section h3 { font-size: 1rem; font-weight: 600; color: #064e3b; margin-bottom: 8px; }
    .log-box {
      background: #1a2e2a; border-radius: 12px; padding: 16px; height: 300px; overflow-y: auto;
      font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6;
    }
    .log-box::-webkit-scrollbar { width: 6px; }
    .log-box::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
    .log-line { color: #d1d5db; }
    .log-line .log-time { color: #6b7280; }
    .log-line.type-success { color: #34d399; }
    .log-line.type-error { color: #f87171; }
    .log-line.type-offline { color: #fbbf24; }
    .log-line.type-data { color: #93c5fd; }
    .log-line.type-start { color: #34d399; font-weight: bold; }
    .log-line.type-stop { color: #f87171; font-weight: bold; }
    .log-line.type-round { color: #c084fc; font-weight: bold; }

    @media (max-width: 600px) {
      .stats { grid-template-columns: repeat(3, 1fr); }
      .readings { grid-template-columns: 1fr; }
      .devices { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>EcoStove Sensor Monitor v2</h1>
      <p>Session-based collection — baseline + collection + cooldown</p>
    </header>

    <div class="controls">
      <button class="btn-check" onclick="checkStatus()">Check Status</button>
      <button class="btn-start" id="btnStart" onclick="startMonitoring()">Start Monitor</button>
      <button class="btn-stop" id="btnStop" onclick="stopMonitoring()" disabled>Stop</button>
    </div>

    <div class="status-bar status-idle" id="statusBar">Idle</div>

    <div class="stats">
      <div class="stat-card"><div class="value" id="statRounds">0</div><div class="label">Ticks</div></div>
      <div class="stat-card"><div class="value" id="statSaved">0</div><div class="label">Saved</div></div>
      <div class="stat-card"><div class="value" id="statSessions">0</div><div class="label">Sessions</div></div>
      <div class="stat-card"><div class="value" id="statOffline">0</div><div class="label">Offline</div></div>
      <div class="stat-card"><div class="value" id="statErrors">0</div><div class="label">Errors</div></div>
    </div>

    <div class="devices" id="devices"></div>

    <div class="log-section">
      <h3>Activity Log</h3>
      <div class="log-box" id="logBox"></div>
    </div>
  </div>

  <script>
    const evtSource = new EventSource('/api/events');

    evtSource.addEventListener('status', (e) => {
      const { running } = JSON.parse(e.data);
      updateButtons(running);
    });

    evtSource.addEventListener('stats', (e) => {
      const s = JSON.parse(e.data);
      document.getElementById('statRounds').textContent = s.rounds;
      document.getElementById('statSaved').textContent = s.saved;
      document.getElementById('statSessions').textContent = s.sessions;
      document.getElementById('statOffline').textContent = s.offline;
      document.getElementById('statErrors').textContent = s.errors;
    });

    evtSource.addEventListener('device', (e) => {
      updateDeviceCard(JSON.parse(e.data));
    });

    evtSource.addEventListener('session', (e) => {
      const { deviceId, state, readingsInSession } = JSON.parse(e.data);
      const card = document.getElementById('dev-' + deviceId);
      if (card) {
        const badge = card.querySelector('.session-badge');
        if (badge) {
          badge.className = 'session-badge ' + state;
          badge.textContent = state + (readingsInSession ? ' (' + readingsInSession + ')' : '');
        }
      }
    });

    evtSource.addEventListener('log', (e) => {
      const { time, message, type } = JSON.parse(e.data);
      appendLog(time, message, type);
    });

    function updateButtons(running) {
      const bar = document.getElementById('statusBar');
      const btnStart = document.getElementById('btnStart');
      const btnStop = document.getElementById('btnStop');
      if (running) {
        bar.className = 'status-bar status-running';
        bar.textContent = 'Monitoring active';
        btnStart.disabled = true;
        btnStop.disabled = false;
      } else {
        bar.className = 'status-bar status-idle';
        bar.textContent = 'Idle';
        btnStart.disabled = false;
        btnStop.disabled = true;
      }
    }

    const LABELS = {
      pm25_value: 'PM 2.5', pm10: 'PM 10', pm1: 'PM 1.0',
      co2_value: 'CO2', ch2o_value: 'HCHO', temp_current: 'Temp',
      humidity_value: 'Humidity', voc_value: 'VOC', air_quality_index: 'AQI',
    };
    const UNITS = {
      pm25_value: 'ug/m3', pm10: 'ug/m3', pm1: 'ug/m3',
      co2_value: 'ppm', ch2o_value: 'mg/m3', temp_current: 'C',
      humidity_value: '%', voc_value: '', air_quality_index: '',
    };

    function updateDeviceCard(dev) {
      let card = document.getElementById('dev-' + dev.id);
      if (!card) {
        card = document.createElement('div');
        card.id = 'dev-' + dev.id;
        card.className = 'device-card';
        document.getElementById('devices').appendChild(card);
      }

      card.className = 'device-card ' + (dev.online ? 'online' : 'offline');

      const sessionState = dev.sessionState || 'idle';
      const readingsCount = dev.readingsInSession || 0;

      let readingsHTML = '';
      if (dev.readings) {
        readingsHTML = '<div class="readings">';
        for (const [code, label] of Object.entries(LABELS)) {
          if (dev.readings[code] != null) {
            readingsHTML += '<div class="reading-item"><span class="r-label">' + label +
              '</span><span class="r-value">' + dev.readings[code] + ' ' + (UNITS[code] || '') + '</span></div>';
          }
        }
        readingsHTML += '</div>';
      }

      card.innerHTML =
        '<div class="device-header">' +
          '<span class="device-name">' + dev.name + '</span>' +
          '<span class="device-status ' + (dev.online ? 'online' : 'offline') + '">' +
            (dev.online ? 'ONLINE' : 'OFFLINE') +
          '</span>' +
        '</div>' +
        '<div class="session-badge ' + sessionState + '">' + sessionState +
          (readingsCount ? ' (' + readingsCount + ' readings)' : '') + '</div>' +
        readingsHTML;
    }

    function appendLog(time, message, type) {
      const box = document.getElementById('logBox');
      const line = document.createElement('div');
      line.className = 'log-line type-' + type;
      line.innerHTML = '<span class="log-time">[' + time + ']</span> ' + message;
      box.appendChild(line);
      if (box.children.length > 500) box.removeChild(box.firstChild);
      box.scrollTop = box.scrollHeight;
    }

    async function checkStatus() {
      const btn = document.querySelector('.btn-check');
      btn.disabled = true; btn.textContent = 'Checking...';
      try { await fetch('/api/check', { method: 'POST' }); } catch {}
      btn.disabled = false; btn.textContent = 'Check Status';
    }

    async function startMonitoring() {
      try { await fetch('/api/start', { method: 'POST' }); } catch {}
    }

    async function stopMonitoring() {
      try { await fetch('/api/stop', { method: 'POST' }); } catch {}
    }
  </script>
</body>
</html>`;

// ===== Start Server =====
server.listen(PORT, async () => {
  console.log('=========================================');
  console.log('  EcoStove Sensor Monitor v2');
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Devices: ${DEVICES.map(d => d.name).join(', ')}`);
  console.log(`  Session: ${SC.baselineMinutes || 10}m baseline + ${SC.collectionMinutes || 120}m collection`);
  console.log(`  Cooldown: ${SC.cooldownHours || 5}h | Max: ${MAX_SESSIONS_PER_DAY}/day`);
  console.log('  Ctrl+C to stop');
  console.log('=========================================');

  // Recover orphaned sessions from previous crash
  await recoverSessions();

  // Auto-open browser (Windows)
  if (CONFIG.autoOpenBrowser !== false && !process.env.NO_BROWSER) {
    exec(`start http://localhost:${PORT}`);
  }

  // Auto-start
  if (CONFIG.autoStartCollection !== false) {
    console.log('  Auto-starting monitoring...');
    startMonitoring();
  }
});
