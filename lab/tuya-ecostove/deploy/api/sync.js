/**
 * EcoStove Sync — Vercel Serverless Function
 * Fetches sensor data from Tuya Cloud → inserts to Supabase + manages sessions
 *
 * Env vars required (set in Vercel dashboard):
 *   TUYA_ACCESS_ID, TUYA_ACCESS_SECRET
 *   SUPABASE_URL, SUPABASE_KEY
 *   CRON_SECRET  (ป้องกันไม่ให้คนอื่นเรียก)
 */

const crypto = require('crypto');

const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
const SESSION_GAP_MINUTES = 30; // gap > 30 min = close old session, start new
const SESSION_MAX_MINUTES = 130; // auto-close after 2h10m
const SESSION_COOLDOWN_MINUTES = 300; // 5hr cooldown before next session
const MAX_SESSIONS_PER_DAY = 2; // limit per device per day

const SENSORS = [
  { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT29 (เดิม)', stoveType: 'old' },
  { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W (ใหม่)', stoveType: 'eco' },
];

// ===== Tuya =====
function generateSign(accessId, secret, method, path, timestamp, accessToken, body) {
  accessToken = accessToken || '';
  body = body || '';
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const stringToSign = [method.toUpperCase(), contentHash, '', path].join('\n');
  const signStr = accessId + accessToken + timestamp + stringToSign;
  return crypto.createHmac('sha256', secret).update(signStr).digest('hex').toUpperCase();
}

async function getTuyaToken(accessId, secret) {
  const timestamp = Date.now().toString();
  const path = '/v1.0/token?grant_type=1';
  const sign = generateSign(accessId, secret, 'GET', path, timestamp);

  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: accessId, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });
  const data = await res.json();
  return data.success ? data.result.access_token : null;
}

async function getDeviceInfo(accessId, secret, token, deviceId) {
  const timestamp = Date.now().toString();
  const path = '/v1.0/devices/' + deviceId;
  const sign = generateSign(accessId, secret, 'GET', path, timestamp, token);

  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: accessId, access_token: token, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });
  return res.json();
}

async function getDeviceStatus(accessId, secret, token, deviceId) {
  const timestamp = Date.now().toString();
  const path = '/v1.0/devices/' + deviceId + '/status';
  const sign = generateSign(accessId, secret, 'GET', path, timestamp, token);

  const res = await fetch(TUYA_BASE_URL + path, {
    headers: { client_id: accessId, access_token: token, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });
  return res.json();
}

function parseReadings(data) {
  if (!data.success) return null;
  const readings = {};
  for (const item of data.result || []) {
    readings[item.code] = item.value;
  }
  return readings;
}

// Calculate AQI from PM2.5 using US EPA breakpoints
function calculateAqiFromPm25(pm25) {
  if (pm25 == null || isNaN(pm25) || pm25 < 0) return null;
  const bp = [
    { lo: 0,     hi: 12.0,   aqiLo: 0,   aqiHi: 50 },
    { lo: 12.1,  hi: 35.4,   aqiLo: 51,  aqiHi: 100 },
    { lo: 35.5,  hi: 55.4,   aqiLo: 101, aqiHi: 150 },
    { lo: 55.5,  hi: 150.4,  aqiLo: 151, aqiHi: 200 },
    { lo: 150.5, hi: 250.4,  aqiLo: 201, aqiHi: 300 },
    { lo: 250.5, hi: 500.4,  aqiLo: 301, aqiHi: 500 },
  ];
  for (const b of bp) {
    if (pm25 >= b.lo && pm25 <= b.hi) {
      return Math.round((b.aqiHi - b.aqiLo) / (b.hi - b.lo) * (pm25 - b.lo) + b.aqiLo);
    }
  }
  return pm25 > 500.4 ? 500 : null;
}

// ===== Supabase helpers =====
function sbHeaders(sbKey) {
  return {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };
}

async function insertLog(sbUrl, sbKey, readings, deviceId, stoveType) {
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
    aqi: calculateAqiFromPm25(readings.pm25_value),
    data_source: 'sensor',
    tuya_device_id: deviceId,
    stove_type: stoveType || 'eco',
    status: 'pending',
    recorded_at: new Date().toISOString(),
  };

  const res = await fetch(sbUrl + '/rest/v1/pollution_logs', {
    method: 'POST',
    headers: { ...sbHeaders(sbKey), 'Prefer': 'return=representation' },
    body: JSON.stringify(record),
  });

  if (res.ok) {
    const result = await res.json();
    return result[0];
  }
  return null;
}

// ===== Session Management =====
async function getSessionCountToday(sbUrl, sbKey, deviceId) {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
    '&started_at=gte.' + today + 'T00:00:00Z&select=id',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.length;
}

async function getActiveSession(sbUrl, sbKey, deviceId) {
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId + '&session_status=eq.collecting&order=started_at.desc&limit=1',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function getLastClosedSession(sbUrl, sbKey, deviceId) {
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId + '&session_status=in.(complete,incomplete,cancelled)&order=ended_at.desc&limit=1',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function createSession(sbUrl, sbKey, deviceId, stoveType) {
  const record = {
    device_id: deviceId,
    session_status: 'collecting',
    stove_type: stoveType || 'eco',
    started_at: new Date().toISOString(),
    readings_count: 1,
  };
  const res = await fetch(sbUrl + '/rest/v1/sessions', {
    method: 'POST',
    headers: { ...sbHeaders(sbKey), 'Prefer': 'return=representation' },
    body: JSON.stringify(record),
  });
  if (res.ok) {
    const result = await res.json();
    return result[0];
  }
  return null;
}

async function updateSessionCount(sbUrl, sbKey, sessionId, newCount) {
  await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + sessionId, {
    method: 'PATCH',
    headers: sbHeaders(sbKey),
    body: JSON.stringify({ readings_count: newCount, updated_at: new Date().toISOString() }),
  });
}

async function closeSession(sbUrl, sbKey, session) {
  // Query pollution_logs for this device during the session period
  const startedAt = encodeURIComponent(session.started_at);
  const logs = await fetch(
    sbUrl + '/rest/v1/pollution_logs?tuya_device_id=eq.' + session.device_id +
    '&recorded_at=gte.' + startedAt +
    '&select=pm25_value,pm10_value,co2_value,temperature,humidity',
    { headers: sbHeaders(sbKey) }
  );
  if (!logs.ok) return;
  const data = await logs.json();

  // Compute aggregates
  const vals = (field) => data.map(d => d[field]).filter(v => v != null);
  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const pm25s = vals('pm25_value');
  const co2s = vals('co2_value');
  const temps = vals('temperature');
  const hums = vals('humidity');

  const update = {
    session_status: data.length >= 3 ? 'complete' : 'incomplete',
    ended_at: new Date().toISOString(),
    collection_ended_at: new Date().toISOString(),
    readings_count: data.length,
    avg_pm25: avg(pm25s),
    max_pm25: pm25s.length ? Math.max(...pm25s) : null,
    min_pm25: pm25s.length ? Math.min(...pm25s) : null,
    avg_co2: avg(co2s),
    avg_temperature: avg(temps),
    avg_humidity: avg(hums),
    updated_at: new Date().toISOString(),
  };

  await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + session.id, {
    method: 'PATCH',
    headers: sbHeaders(sbKey),
    body: JSON.stringify(update),
  });

  // Update daily summary after closing session
  await upsertDailySummary(sbUrl, sbKey, session.device_id, session.stove_type);
}

async function upsertDailySummary(sbUrl, sbKey, deviceId, stoveType) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(
      sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
      '&started_at=gte.' + today + 'T00:00:00Z&started_at=lt.' + today + 'T23:59:59Z',
      { headers: sbHeaders(sbKey) }
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
      stove_type: stoveType || 'eco',
      updated_at: new Date().toISOString(),
    };

    await fetch(sbUrl + '/rest/v1/daily_summaries', {
      method: 'POST',
      headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify(summary),
    });
  } catch (e) {
    // non-critical — don't break the sync
  }
}

async function manageSession(sbUrl, sbKey, deviceId, stoveType) {
  try {
    const active = await getActiveSession(sbUrl, sbKey, deviceId);

    if (active) {
      const lastUpdate = new Date(active.updated_at || active.started_at);
      const minutesAgo = (Date.now() - lastUpdate.getTime()) / 60000;
      const sessionAge = (Date.now() - new Date(active.started_at).getTime()) / 60000;

      if (sessionAge >= SESSION_MAX_MINUTES) {
        // Session reached 2h10m — close, do NOT start new
        await closeSession(sbUrl, sbKey, active);
        return { action: 'auto-cutoff', sessionId: active.id, minutes: Math.round(sessionAge) };
      } else if (minutesAgo < SESSION_GAP_MINUTES) {
        // Continue session
        await updateSessionCount(sbUrl, sbKey, active.id, (active.readings_count || 0) + 1);
        return { action: 'continued', sessionId: active.id };
      } else {
        // Gap too long — close old, enter cooldown (just closed = full cooldown)
        await closeSession(sbUrl, sbKey, active);
        return { action: 'cooldown (after close)', minutesLeft: SESSION_COOLDOWN_MINUTES };
      }
    } else {
      // No active session — check cooldown from last closed session
      const last = await getLastClosedSession(sbUrl, sbKey, deviceId);
      if (last && last.ended_at) {
        const sinceEnded = (Date.now() - new Date(last.ended_at).getTime()) / 60000;
        if (sinceEnded < SESSION_COOLDOWN_MINUTES) {
          return { action: 'cooldown', minutesLeft: Math.round(SESSION_COOLDOWN_MINUTES - sinceEnded) };
        }
      }
      // Daily limit check
      const countToday = await getSessionCountToday(sbUrl, sbKey, deviceId);
      if (countToday >= MAX_SESSIONS_PER_DAY) {
        return { action: 'daily-limit', sessionsToday: countToday };
      }
      const newSession = await createSession(sbUrl, sbKey, deviceId, stoveType);
      return { action: 'new', sessionId: newSession?.id };
    }
  } catch (err) {
    return { action: 'error', message: err.message };
  }
}

// ===== Handler =====
module.exports = async function handler(req, res) {
  // Auth check
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers['authorization'];
    const query = req.query?.secret;
    if (auth !== 'Bearer ' + secret && query !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const accessId = process.env.TUYA_ACCESS_ID;
  const accessSecret = process.env.TUYA_ACCESS_SECRET;
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_KEY;

  if (!accessId || !accessSecret || !sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const results = [];

  try {
    // Pre-check: skip Tuya calls if ALL sensors are idle (cooldown or daily limit)
    let allIdle = true;
    for (const sensor of SENSORS) {
      const active = await getActiveSession(sbUrl, sbKey, sensor.id);
      if (active) {
        allIdle = false; // has active session — need to continue
        break;
      }
      // Check daily limit first
      const todayCount = await getSessionCountToday(sbUrl, sbKey, sensor.id);
      if (todayCount >= MAX_SESSIONS_PER_DAY) continue; // this sensor is done for the day
      // Check cooldown
      const last = await getLastClosedSession(sbUrl, sbKey, sensor.id);
      if (!last || !last.ended_at) {
        allIdle = false; // no history — allow new session
        break;
      }
      const sinceEnded = (Date.now() - new Date(last.ended_at).getTime()) / 60000;
      if (sinceEnded >= SESSION_COOLDOWN_MINUTES) {
        allIdle = false; // cooldown passed — allow new session
        break;
      }
    }

    if (allIdle) {
      return res.status(200).json({
        success: true,
        synced: '0/' + SENSORS.length,
        skipped: 'all sensors idle (cooldown or daily limit reached)',
        time: new Date().toISOString(),
      });
    }

    const token = await getTuyaToken(accessId, accessSecret);
    if (!token) {
      return res.status(502).json({ error: 'Cannot get Tuya token' });
    }

    for (let i = 0; i < SENSORS.length; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 1000));
      const sensor = SENSORS[i];

      try {
        // Check session state FIRST — skip Tuya API call if cooldown/cutoff
        const session = await manageSession(sbUrl, sbKey, sensor.id, sensor.stoveType);
        const skipActions = ['cooldown', 'cooldown (after close)', 'auto-cutoff', 'daily-limit'];

        if (skipActions.includes(session.action)) {
          results.push({ sensor: sensor.name, status: 'skipped', reason: session.action, session });
          continue;
        }

        // Check if device is actually online (not just cached)
        const deviceInfo = await getDeviceInfo(accessId, accessSecret, token, sensor.id);
        if (!deviceInfo.success || !deviceInfo.result || !deviceInfo.result.online) {
          results.push({ sensor: sensor.name, status: 'offline', online: false });
          continue;
        }

        const rawData = await getDeviceStatus(accessId, accessSecret, token, sensor.id);
        const readings = parseReadings(rawData);

        if (!readings) {
          results.push({ sensor: sensor.name, status: 'no_data' });
          continue;
        }

        const inserted = await insertLog(sbUrl, sbKey, readings, sensor.id, sensor.stoveType);

        results.push({
          sensor: sensor.name,
          status: inserted ? 'ok' : 'insert_failed',
          pm25: readings.pm25_value,
          co2: readings.co2_value,
          temp: readings.temp_current,
          humidity: readings.humidity_value,
          session: session,
        });
      } catch (err) {
        results.push({ sensor: sensor.name, status: 'error', message: err.message });
      }
    }

    const ok = results.filter(r => r.status === 'ok').length;
    return res.status(200).json({
      success: true,
      synced: ok + '/' + SENSORS.length,
      time: new Date().toISOString(),
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
