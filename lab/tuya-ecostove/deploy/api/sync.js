/**
 * Biomass Stove Sync — Vercel Serverless Function
 * Fetches sensor data from Tuya Cloud → inserts to Supabase + manages sessions
 *
 * Env vars required (set in Vercel dashboard):
 *   TUYA_ACCESS_ID, TUYA_ACCESS_SECRET, TUYA_APP_USER_UID
 *   SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY
 *   CRON_SECRET  (ป้องกันไม่ให้คนอื่นเรียก)
 */

const crypto = require('crypto');

// Thai timezone helper — returns YYYY-MM-DD in Bangkok time (UTC+7)
function getThaiDate() {
  const d = new Date(Date.now() + 7 * 3600000);
  return d.toISOString().slice(0, 10);
}

// Convert Thai date to UTC boundary for DB queries
// Thai midnight = previous day 17:00 UTC (e.g. Thai 2026-03-23 00:00 = 2026-03-22T17:00:00Z)
function thaiDayStartUTC(thaiDate) {
  return new Date(thaiDate + 'T00:00:00+07:00').toISOString();
}
function thaiDayEndUTC(thaiDate) {
  return new Date(new Date(thaiDate + 'T00:00:00+07:00').getTime() + 86400000).toISOString();
}

// D-M01: Safe max/min — avoids stack overflow with large arrays
function safeMax(arr) { if (!arr.length) return null; let m = arr[0]; for (let i = 1; i < arr.length; i++) { if (arr[i] > m) m = arr[i]; } return m; }
function safeMin(arr) { if (!arr.length) return null; let m = arr[0]; for (let i = 1; i < arr.length; i++) { if (arr[i] < m) m = arr[i]; } return m; }

const TUYA_BASE_URL = 'https://openapi-sg.iotbing.com';
// S-M3: Import constants from sync-logic.js (single source of truth)
const {
  SESSION_MAX_MINUTES,
  SESSION_COOLDOWN_MINUTES,
  MAX_SESSIONS_PER_DAY,
  MONTHLY_API_LIMIT,
  BASELINE_MINUTES,
} = require('./sync-logic');

// SENSORS loaded dynamically from Supabase (registered_sensors + devices)
async function loadSensors(sbUrl, sbKey) {
  // S-M6: Queries 1-3 in parallel (independent), then query 4 (needs deviceMap)
  const [sensorsRes, devicesRes, spRes] = await Promise.all([
    fetch(sbUrl + '/rest/v1/registered_sensors?select=tuya_device_id,name', { headers: sbHeaders(sbKey) }),
    fetch(sbUrl + '/rest/v1/devices?is_active=eq.true&select=tuya_device_id,subject_id', { headers: sbHeaders(sbKey) }),
    fetch(sbUrl + '/rest/v1/subject_projects?select=subject_id,project_id', { headers: sbHeaders(sbKey) }).catch(err => {
      console.error('loadSensors: subject_projects error:', err.message);
      return { ok: false };
    }),
  ]);

  if (!sensorsRes.ok) return [];
  const sensors = await sensorsRes.json();

  const deviceMap = {};
  if (devicesRes.ok) {
    const devices = await devicesRes.json();
    for (const d of devices) {
      if (d.tuya_device_id) deviceMap[d.tuya_device_id] = d.subject_id;
    }
  }

  const projectMap = {};
  if (spRes.ok) {
    const spData = await spRes.json();
    for (const sp of spData) {
      projectMap[sp.subject_id] = sp.project_id;
    }
  }

  // 4. Get active collection periods per house (needs deviceMap from query 2)
  const periodMap = {};
  try {
    const today = getThaiDate();
    const subjectIds = [...new Set(Object.values(deviceMap).filter(Boolean))];
    if (subjectIds.length > 0) {
      const periodsRes = await fetch(
        sbUrl + '/rest/v1/collection_periods'
        + '?subject_id=in.(' + subjectIds.join(',') + ')'
        + '&starts_at=lte.' + today
        + '&or=(ends_at.is.null,ends_at.gte.' + today + ')'
        + '&select=subject_id,stove_type'
        + '&order=starts_at.desc',
        { headers: sbHeaders(sbKey) }
      );
      if (periodsRes.ok) {
        const periods = await periodsRes.json();
        for (const p of periods) {
          if (!periodMap[p.subject_id]) periodMap[p.subject_id] = p.stove_type;
        }
      } else {
        console.error('loadSensors: collection_periods query failed, status=' + periodsRes.status);
      }
    }
  } catch (err) {
    console.error('loadSensors: collection_periods error:', err.message);
  }

  // 5. Build SENSORS array — stoveType from collection_period only
  return sensors.map(s => {
    const houseId = deviceMap[s.tuya_device_id] || null;
    const resolvedStoveType = (houseId && periodMap[houseId])
      ? periodMap[houseId]
      : null;
    return {
      id: s.tuya_device_id,
      name: s.name,
      stoveType: resolvedStoveType,
      houseId,
      projectId: houseId ? (projectMap[houseId] || null) : null,
    };
  });
}

// ===== Token Cache (in-memory, survives Vercel warm starts) =====
let _cachedToken = null;
let _tokenExpiresAt = 0;

async function getCachedToken(accessId, secret) {
  if (_cachedToken && Date.now() < _tokenExpiresAt) {
    return { token: _cachedToken, cached: true };
  }
  const token = await getTuyaToken(accessId, secret);
  if (token) {
    _cachedToken = token;
    _tokenExpiresAt = Date.now() + 7000 * 1000; // ~1h56m (2hr minus 4min buffer)
  }
  return { token, cached: false };
}

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

// ===== Tuya Batch API (reduces N calls → 1 call) =====
async function tuyaFetchWithRetry(url, headers, label) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // S-M7: 8s timeout on Tuya fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success) return { ok: true, data, attempts: attempt + 1 };
      // S-H2: Clear token cache on auth failure so next retry gets fresh token
      if (data.code === 1010 || data.code === 1004) {
        _cachedToken = null;
        _tokenExpiresAt = 0;
        console.warn(label + ': token expired (code=' + data.code + '), cache cleared');
      }
      if (attempt === 0) {
        console.warn(label + ': attempt 1 failed (code=' + data.code + '), retrying in 3s...');
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return { ok: false, data, attempts: 2 };
    } catch (err) {
      if (attempt === 0) {
        const errMsg = err.name === 'AbortError' ? 'timeout' : err.message;
        console.warn(label + ': fetch error (' + errMsg + '), retrying in 3s...');
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return { ok: false, error: err, attempts: 2 };
    }
  }
}

// Smart Home API: /v1.0/users/{uid}/devices — gets ALL devices in 1 call
// (replaces Industry batch API that requires "Industry General Device Management" subscription)
async function getBatchDeviceInfo(accessId, secret, token, deviceIds, appUserUid) {
  if (!appUserUid) {
    console.error('getBatchDeviceInfo: TUYA_APP_USER_UID not set');
    return { _apiError: true, _errorMsg: 'TUYA_APP_USER_UID not configured', _attempts: 0 };
  }

  const timestamp = Date.now().toString();
  const path = '/v1.0/users/' + appUserUid + '/devices';
  const sign = generateSign(accessId, secret, 'GET', path, timestamp, token);

  const result = await tuyaFetchWithRetry(
    TUYA_BASE_URL + path,
    { client_id: accessId, access_token: token, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
    'getBatchDeviceInfo'
  );

  if (!result.ok) {
    const msg = result.error ? 'fetch: ' + result.error.message : 'Tuya API: ' + (result.data?.msg || result.data?.code || 'unknown');
    console.error('getBatchDeviceInfo: failed — ' + msg);
    return { _apiError: true, _errorMsg: msg, _attempts: result.attempts };
  }

  const map = { _attempts: result.attempts };
  const deviceSet = new Set(deviceIds);
  const tuyaDevices = result.data.result || [];
  // DEBUG: log what Tuya returned vs what we're looking for
  map._debug = {
    tuyaReturned: tuyaDevices.length,
    tuyaIds: tuyaDevices.map(d => d.id + ':' + (d.online ? 'ON' : 'OFF') + ':' + (d.name || '')),
    lookingFor: deviceIds,
    matched: 0,
  };
  for (const device of tuyaDevices) {
    if (deviceSet.has(device.id)) {
      map[device.id] = device;
      map._debug.matched++;
    }
  }
  return map;
}

// S-H1: Chunked status calls (3 at a time with 500ms delay to avoid Tuya throttling)
async function getBatchDeviceStatus(accessId, secret, token, deviceIds) {
  const CHUNK_SIZE = 3;
  const CHUNK_DELAY_MS = 500;

  const fetchOne = async (deviceId) => {
    const timestamp = Date.now().toString();
    const path = '/v1.0/devices/' + deviceId + '/status';
    const sign = generateSign(accessId, secret, 'GET', path, timestamp, token);
    try {
      // S-M7: 8s timeout on Tuya fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(TUYA_BASE_URL + path, {
        headers: { client_id: accessId, access_token: token, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success && data.result) {
        const readings = {};
        for (const item of data.result) {
          readings[item.code] = item.value;
        }
        return { id: deviceId, readings };
      }
      return { id: deviceId, error: data.msg || 'unknown' };
    } catch (err) {
      return { id: deviceId, error: err.name === 'AbortError' ? 'timeout' : err.message };
    }
  };

  const map = { _attempts: deviceIds.length };
  for (let i = 0; i < deviceIds.length; i += CHUNK_SIZE) {
    const chunk = deviceIds.slice(i, i + CHUNK_SIZE);
    const results = await Promise.all(chunk.map(id => fetchOne(id)));
    for (const r of results) {
      if (r.readings) map[r.id] = r.readings;
    }
    if (i + CHUNK_SIZE < deviceIds.length) {
      await new Promise(r => setTimeout(r, CHUNK_DELAY_MS));
    }
  }
  return map;
}

// Calculate AQI from PM2.5 using Thai PCD breakpoints (กรมควบคุมมลพิษ พ.ศ.2566)
function calculateAqiFromPm25(pm25) {
  if (pm25 == null || isNaN(pm25) || pm25 < 0) return null;
  const bp = [
    { lo: 0,    hi: 15,   aqiLo: 0,   aqiHi: 25 },
    { lo: 15.1, hi: 25,   aqiLo: 26,  aqiHi: 50 },
    { lo: 25.1, hi: 37.5, aqiLo: 51,  aqiHi: 100 },
    { lo: 37.6, hi: 75,   aqiLo: 101, aqiHi: 200 },
    { lo: 75.1, hi: 150,  aqiLo: 201, aqiHi: 300 },
  ];
  for (const b of bp) {
    if (pm25 >= b.lo && pm25 <= b.hi) {
      return Math.round((b.aqiHi - b.aqiLo) / (b.hi - b.lo) * (pm25 - b.lo) + b.aqiLo);
    }
  }
  return pm25 > 150 ? 300 : null;
}

// ===== Supabase helpers =====
function sbHeaders(sbKey) {
  return {
    'apikey': sbKey,
    'Authorization': 'Bearer ' + sbKey,
    'Content-Type': 'application/json',
  };
}

async function insertLog(sbUrl, sbKey, readings, deviceId, stoveType, sessionId) {
  // Dedup: skip if last log for this device was < 4.5 min ago (prevents cron jitter duplicates)
  try {
    const lastRes = await fetch(
      sbUrl + '/rest/v1/pollution_logs?tuya_device_id=eq.' + deviceId + '&data_source=eq.sensor&order=recorded_at.desc&limit=1&select=recorded_at',
      { headers: sbHeaders(sbKey) }
    );
    if (lastRes.ok) {
      const lastData = await lastRes.json();
      if (lastData.length > 0) {
        const lastAge = (Date.now() - new Date(lastData[0].recorded_at).getTime()) / 60000;
        if (lastAge < 4.5) {
          console.log('insertLog dedup: skipping ' + deviceId + ', last log ' + lastAge.toFixed(1) + ' min ago');
          return 'dedup';
        }
      }
    }
  } catch (_) {} // fail-open: insert if dedup check fails

  const record = {
    pm25_value: readings.pm25_value ?? null,
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
    stove_type: stoveType || null,
    status: 'pending',
    recorded_at: new Date().toISOString(),
    session_id: sessionId || null,
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
  // Log why insert failed
  try {
    const errText = await res.text();
    console.error('insertLog FAILED for', deviceId, '| status:', res.status, '| body:', errText);
  } catch (_) {
    console.error('insertLog FAILED for', deviceId, '| status:', res.status);
  }
  return null;
}

// ===== Session Management =====
async function getSessionCountToday(sbUrl, sbKey, deviceId) {
  const today = getThaiDate();
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
    '&started_at=gte.' + encodeURIComponent(thaiDayStartUTC(today)) + '&select=id',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data.length;
}

async function getActiveSession(sbUrl, sbKey, deviceId) {
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId + '&session_status=in.(baseline,collecting)&order=started_at.desc&limit=1',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

// Batch: load all active sessions for multiple devices in 1 call
async function getBatchActiveSessions(sbUrl, sbKey, deviceIds) {
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=in.(' + deviceIds.join(',') + ')&session_status=in.(baseline,collecting)&order=started_at.desc',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return {};
  const data = await res.json();
  const map = {}; // deviceId → latest active session
  for (const s of data) {
    if (!map[s.device_id]) map[s.device_id] = s; // first = latest (desc order)
  }
  return map;
}

// Batch: load last closed session for multiple devices in 1 call
async function getBatchLastClosedSessions(sbUrl, sbKey, deviceIds) {
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=in.(' + deviceIds.join(',') + ')&session_status=in.(complete,incomplete,cancelled)&order=ended_at.desc',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return {};
  const data = await res.json();
  const map = {};
  for (const s of data) {
    if (!map[s.device_id]) map[s.device_id] = s;
  }
  return map;
}

// Batch: count today's sessions for multiple devices in 1 call
async function getBatchSessionCountToday(sbUrl, sbKey, deviceIds) {
  const today = getThaiDate();
  const res = await fetch(
    sbUrl + '/rest/v1/sessions?device_id=in.(' + deviceIds.join(',') + ')&started_at=gte.' + encodeURIComponent(thaiDayStartUTC(today)) + '&select=id,device_id',
    { headers: sbHeaders(sbKey) }
  );
  if (!res.ok) return {};
  const data = await res.json();
  const map = {};
  for (const s of data) {
    map[s.device_id] = (map[s.device_id] || 0) + 1;
  }
  return map;
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

async function createSession(sbUrl, sbKey, deviceId, stoveType, houseId, projectId) {
  // Pre-check: guard against race condition (2 cron calls at same time)
  const countToday = await getSessionCountToday(sbUrl, sbKey, deviceId);
  if (countToday >= MAX_SESSIONS_PER_DAY) {
    console.log('[createSession] blocked — already', countToday, 'sessions today for', deviceId);
    return null;
  }
  const record = {
    device_id: deviceId,
    session_status: 'baseline',
    session_number: countToday + 1,
    stove_type: stoveType || null,
    house_id: houseId || null,
    project_id: projectId || null,
    started_at: new Date().toISOString(),
    readings_count: 1,
  };
  const res = await fetch(sbUrl + '/rest/v1/sessions', {
    method: 'POST',
    headers: { ...sbHeaders(sbKey), 'Prefer': 'return=representation' },
    body: JSON.stringify(record),
  });
  if (!res.ok) {
    const errText = await res.text();
    // Unique constraint violation = race condition blocked at DB level
    if (errText.includes('duplicate') || errText.includes('unique') || errText.includes('23505')) {
      console.log('[createSession] duplicate blocked by constraint for', deviceId);
      return null;
    }
    console.error('[createSession] insert failed:', errText);
    return null;
  }
  {
    const result = await res.json();
    const created = result[0];
    // Post-check: if another cron snuck in, rollback this session
    const recheck = await getSessionCountToday(sbUrl, sbKey, deviceId);
    if (recheck > MAX_SESSIONS_PER_DAY && created) {
      console.log('[createSession] race detected — rolling back session', created.id);
      await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + created.id, {
        method: 'DELETE', headers: sbHeaders(sbKey),
      });
      return null;
    }
    return created;
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

async function closeSession(sbUrl, sbKey, session, closeReason) {
  try {
    // Query pollution_logs for this session — sensor only (exclude manual TVOC/CO entries)
    const logSelect = 'pm25_value,pm10_value,co2_value,co_value,temperature,humidity,recorded_at';
    const logsUrl = session.id
      ? sbUrl + '/rest/v1/pollution_logs?session_id=eq.' + session.id + '&data_source=eq.sensor&select=' + logSelect
      : sbUrl + '/rest/v1/pollution_logs?tuya_device_id=eq.' + session.device_id +
        '&recorded_at=gte.' + encodeURIComponent(session.started_at) +
        '&recorded_at=lte.' + encodeURIComponent(new Date().toISOString()) +
        '&data_source=eq.sensor&select=' + logSelect;
    const logs = await fetch(logsUrl, { headers: sbHeaders(sbKey) });
    if (!logs.ok) {
      console.error('closeSession: failed to fetch logs for session ' + session.id + ', status=' + logs.status);
      // Still close the session even if we can't compute averages
      await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + session.id, {
        method: 'PATCH', headers: sbHeaders(sbKey),
        body: JSON.stringify({ session_status: 'incomplete', ended_at: new Date().toISOString(), notes: closeReason || null, updated_at: new Date().toISOString() }),
      });
      await upsertDailySummary(sbUrl, sbKey, session.device_id, session.stove_type, session.project_id);
      return;
    }
    const data = await logs.json();

    // Compute aggregates
    const vals = (field) => data.map(d => d[field]).filter(v => v != null);
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const pm25s = vals('pm25_value');
    const pm10s = vals('pm10_value');
    const co2s = vals('co2_value');
    const cos = vals('co_value');
    const temps = vals('temperature');
    const hums = vals('humidity');

    // Compute baseline-adjusted averages (cooking phase only, minus baseline)
    let adjustedPm25 = null, adjustedPm10 = null, adjustedCo2 = null, adjustedTemp = null, adjustedHum = null;
    if (session.baseline_ended_at) {
      const cookingData = data.filter(d => d.recorded_at && d.recorded_at >= session.baseline_ended_at);
      if (cookingData.length > 0) {
        const cookPm25 = avg(cookingData.map(d => d.pm25_value).filter(v => v != null));
        const cookPm10 = avg(cookingData.map(d => d.pm10_value).filter(v => v != null));
        const cookCo2 = avg(cookingData.map(d => d.co2_value).filter(v => v != null));
        const cookTemp = avg(cookingData.map(d => d.temperature).filter(v => v != null));
        const cookHum = avg(cookingData.map(d => d.humidity).filter(v => v != null));
        adjustedPm25 = cookPm25 != null && session.baseline_avg_pm25 != null ? Math.max(0, cookPm25 - session.baseline_avg_pm25) : cookPm25;
        adjustedPm10 = cookPm10 != null && session.baseline_avg_pm10 != null ? Math.max(0, cookPm10 - session.baseline_avg_pm10) : cookPm10;
        adjustedCo2 = cookCo2 != null && session.baseline_avg_co2 != null ? Math.max(0, cookCo2 - session.baseline_avg_co2) : cookCo2;
        adjustedTemp = cookTemp != null && session.baseline_avg_temperature != null ? Math.max(0, cookTemp - session.baseline_avg_temperature) : cookTemp;
        adjustedHum = cookHum != null && session.baseline_avg_humidity != null ? Math.max(0, cookHum - session.baseline_avg_humidity) : cookHum;
      }
    }

    // S-C4 fix: count only post-baseline readings for completeness
    const postBaselineData = session.baseline_ended_at
      ? data.filter(d => d.recorded_at && d.recorded_at >= session.baseline_ended_at)
      : data;
    const isComplete = postBaselineData.length >= 22;

    // Check if Tuya API errors were tracked during this session
    const tuyaErrorMatch = ((session.notes || '').match(/tuya_api_errors:(\d+)/) || []);
    const tuyaErrorCount = parseInt(tuyaErrorMatch[1] || '0');

    // Build descriptive notes with cause
    let finalNotes = null;
    if (!isComplete) {
      let reason = closeReason || 'readings ไม่ถึง 24';
      if (tuyaErrorCount > 0) {
        reason += ' (Tuya Cloud ขัดข้อง ' + tuyaErrorCount + ' ครั้ง — ปัญหาจากระบบ Cloud)';
      }
      finalNotes = reason;
    } else if (tuyaErrorCount > 0) {
      // Complete but had errors — note it anyway
      finalNotes = 'ครบ แต่ Tuya Cloud ขัดข้อง ' + tuyaErrorCount + ' ครั้ง';
    }

    const update = {
      session_status: isComplete ? 'complete' : 'incomplete',
      ended_at: new Date().toISOString(),
      collection_ended_at: new Date().toISOString(),
      readings_count: postBaselineData.length,
      avg_pm25: avg(pm25s),
      max_pm25: pm25s.length ? safeMax(pm25s) : null,
      min_pm25: pm25s.length ? safeMin(pm25s) : null,
      avg_pm10: avg(pm10s),
      avg_co2: avg(co2s),
      avg_co: avg(cos),
      avg_temperature: avg(temps),
      avg_humidity: avg(hums),
      adjusted_avg_pm25: adjustedPm25,
      adjusted_avg_pm10: adjustedPm10,
      adjusted_avg_co2: adjustedCo2,
      adjusted_avg_temperature: adjustedTemp,
      adjusted_avg_humidity: adjustedHum,
      notes: finalNotes,
      updated_at: new Date().toISOString(),
    };

    const patchRes = await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + session.id, {
      method: 'PATCH', headers: sbHeaders(sbKey), body: JSON.stringify(update),
    });
    if (!patchRes.ok) {
      console.error('closeSession: failed to patch session ' + session.id + ', status=' + patchRes.status);
    }

    // Update daily summary after closing session
    await upsertDailySummary(sbUrl, sbKey, session.device_id, session.stove_type, session.project_id);
  } catch (err) {
    console.error('closeSession error for session ' + session.id + ':', err.message);
    // Attempt to at least mark session as incomplete + update daily summary
    try {
      await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + session.id, {
        method: 'PATCH', headers: sbHeaders(sbKey),
        body: JSON.stringify({ session_status: 'incomplete', ended_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
      });
      await upsertDailySummary(sbUrl, sbKey, session.device_id, session.stove_type, session.project_id);
    } catch (_) {}
  }
}

async function upsertDailySummary(sbUrl, sbKey, deviceId, stoveType, projectId) {
  try {
    const today = getThaiDate();
    // Use Thai timezone-aware UTC boundaries (Thai midnight = prev day 17:00 UTC)
    const dayStart = thaiDayStartUTC(today);
    const dayEnd = thaiDayEndUTC(today);
    const res = await fetch(
      sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
      '&and=(started_at.gte.' + encodeURIComponent(dayStart) + ',started_at.lt.' + encodeURIComponent(dayEnd) + ')',
      { headers: sbHeaders(sbKey) }
    );
    if (!res.ok) {
      console.error('upsertDailySummary: query failed for ' + deviceId + ', status=' + res.status);
      return;
    }
    const sessions = await res.json();
    console.log('upsertDailySummary: ' + deviceId + ' found ' + sessions.length + ' sessions, completed=' + sessions.filter(s => s.session_status === 'complete').length);

    const completed = sessions.filter(s => s.session_status === 'complete');
    const incomplete = sessions.filter(s => s.session_status === 'incomplete');
    const cancelled = sessions.filter(s => s.session_status === 'cancelled');
    // Use all valid sessions (complete + incomplete) for readings & averages
    // Incomplete sessions still have real data — hiding them is misleading
    const validSessions = sessions.filter(s => s.session_status === 'complete' || s.session_status === 'incomplete');
    const totalReadings = validSessions.reduce((sum, s) => sum + (s.readings_count || 0), 0);

    const avgOf = (arr, key) => {
      const vals = arr.map(s => s[key]).filter(v => v != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };

    const houseId = sessions.length > 0 ? sessions[0].house_id : null;

    const pm25Maxes = validSessions.map(c => c.max_pm25).filter(v => v != null);
    const pm25Mins = validSessions.map(c => c.min_pm25).filter(v => v != null);

    const summary = {
      summary_date: today,
      device_id: deviceId,
      house_id: houseId,
      sessions_completed: completed.length,
      sessions_incomplete: incomplete.length,
      sessions_cancelled: cancelled.length,
      total_readings: totalReadings,
      avg_pm25: avgOf(validSessions, 'avg_pm25'),
      max_pm25: pm25Maxes.length > 0 ? safeMax(pm25Maxes) : null,
      min_pm25: pm25Mins.length > 0 ? safeMin(pm25Mins) : null,
      avg_pm10: avgOf(validSessions, 'avg_pm10'),
      avg_co2: avgOf(validSessions, 'avg_co2'),
      avg_co: avgOf(validSessions, 'avg_co'),
      avg_temperature: avgOf(validSessions, 'avg_temperature'),
      avg_humidity: avgOf(validSessions, 'avg_humidity'),
      adjusted_avg_pm25: avgOf(validSessions, 'adjusted_avg_pm25'),
      adjusted_avg_co2: avgOf(validSessions, 'adjusted_avg_co2'),
      adjusted_avg_temperature: avgOf(validSessions, 'adjusted_avg_temperature'),
      adjusted_avg_humidity: avgOf(validSessions, 'adjusted_avg_humidity'),
      stove_type: stoveType || null,
      project_id: projectId || null,
      updated_at: new Date().toISOString(),
    };

    const upsertRes = await fetch(sbUrl + '/rest/v1/daily_summaries?on_conflict=summary_date,device_id', {
      method: 'POST',
      headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify(summary),
    });
    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error('upsertDailySummary: POST failed for ' + deviceId + ', status=' + upsertRes.status + ', body=' + errText);
    }
  } catch (e) {
    console.error('upsertDailySummary: exception for ' + deviceId + ':', e.message || e);
  }
}

// ===== API Quota Tracking =====
async function getMonthlyQuota(sbUrl, sbKey) {
  try {
    const month = getThaiDate().slice(0, 7); // '2026-03'
    const res = await fetch(
      sbUrl + '/rest/v1/api_quota?month=eq.' + month + '&limit=1',
      { headers: sbHeaders(sbKey) }
    );
    if (!res.ok) return null; // table may not exist yet
    const data = await res.json();
    return data.length > 0 ? data[0] : { month, tuya_calls: 0 };
  } catch (_) {
    return null; // graceful fallback
  }
}

async function updateMonthlyQuota(sbUrl, sbKey, callsToAdd) {
  if (callsToAdd <= 0) return;
  try {
    const month = getThaiDate().slice(0, 7);
    const current = await getMonthlyQuota(sbUrl, sbKey);
    if (!current) return; // table doesn't exist, skip
    const newTotal = (current.tuya_calls || 0) + callsToAdd;
    await fetch(sbUrl + '/rest/v1/api_quota', {
      method: 'POST',
      headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify({ month, tuya_calls: newTotal, updated_at: new Date().toISOString() }),
    });
  } catch (_) {
    // non-critical
  }
}

// ===== Sync Schedule (Quiet Hours + Day-of-week + Holidays) =====
async function loadSyncSchedule(sbUrl, sbKey) {
  try {
    const [configRes, holidayRes] = await Promise.all([
      fetch(sbUrl + '/rest/v1/sync_config?limit=1', { headers: sbHeaders(sbKey) }),
      fetch(sbUrl + '/rest/v1/sync_holidays?select=holiday_date,reason', { headers: sbHeaders(sbKey) }),
    ]);
    const config = configRes.ok ? await configRes.json() : [];
    const holidays = holidayRes.ok ? await holidayRes.json() : [];
    return {
      config: config.length > 0 ? config[0] : null,
      holidays, // [{holiday_date: '2026-03-15', reason: 'สงกรานต์'}, ...]
    };
  } catch (_) {
    return { config: null, holidays: [] }; // fail-open
  }
}

async function manageSession(sbUrl, sbKey, deviceId, stoveType, isOnline, houseId, cachedActive, projectId, cachedLastClosed, cachedCountToday) {
  try {
    const active = cachedActive !== undefined ? cachedActive : await getActiveSession(sbUrl, sbKey, deviceId);

    if (active) {
      const sessionAge = (Date.now() - new Date(active.started_at).getTime()) / 60000;

      if (sessionAge >= SESSION_MAX_MINUTES) {
        // Session reached 2h10m — close, do NOT start new
        await closeSession(sbUrl, sbKey, active, 'ครบเวลา ' + Math.round(sessionAge) + ' นาที');
        return { action: 'auto-cutoff', sessionId: active.id, minutes: Math.round(sessionAge) };
      } else if (!isOnline) {
        // Device offline mid-session — skip this tick, don't inflate readings_count
        return { action: 'device-offline', sessionId: active.id };
      } else if (active.session_status === 'baseline' && sessionAge >= BASELINE_MINUTES) {
        // Baseline phase complete — compute baseline averages and transition to collecting
        const baselineRes = await fetch(
          sbUrl + '/rest/v1/pollution_logs?session_id=eq.' + active.id + '&order=recorded_at.asc',
          { headers: sbHeaders(sbKey) }
        );
        const baselineLogs = baselineRes.ok ? await baselineRes.json() : [];
        const blAvg = (arr, field) => { const vals = arr.map(r => r[field]).filter(v => v != null); return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null; };
        const update = {
          session_status: 'collecting',
          baseline_ended_at: new Date().toISOString(),
          baseline_transition: 'auto',
          baseline_avg_pm25: blAvg(baselineLogs, 'pm25_value'),
          baseline_avg_co2: blAvg(baselineLogs, 'co2_value'),
          baseline_avg_temperature: blAvg(baselineLogs, 'temperature'),
          baseline_avg_humidity: blAvg(baselineLogs, 'humidity'),
          baseline_avg_tvoc: blAvg(baselineLogs, 'tvoc_value'),
          baseline_avg_co: blAvg(baselineLogs, 'co_value'),
          baseline_readings_count: baselineLogs.length,
          readings_count: (active.readings_count || 0) + 1,
          updated_at: new Date().toISOString(),
        };
        const patchRes = await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + active.id, {
          method: 'PATCH', headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal' },
          body: JSON.stringify(update),
        });
        if (!patchRes.ok) {
          console.error('Baseline transition failed for session ' + active.id + ', status=' + patchRes.status + ', body=' + await patchRes.text());
          // Fallback: transition without baseline columns so session doesn't get stuck
          await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + active.id, {
            method: 'PATCH', headers: sbHeaders(sbKey),
            body: JSON.stringify({ session_status: 'collecting', baseline_ended_at: new Date().toISOString(), readings_count: (active.readings_count || 0) + 1, updated_at: new Date().toISOString() }),
          });
        }
        console.log('Baseline ended for session ' + active.id + ': pm25=' + update.baseline_avg_pm25 + ', co2=' + update.baseline_avg_co2 + ', readings=' + baselineLogs.length);
        return { action: 'baseline-ended', sessionId: active.id, baselineReadings: baselineLogs.length };
      } else {
        // Continue session (baseline or collecting) — device is online and within time window
        const gapMin = active.updated_at ? Math.round((Date.now() - new Date(active.updated_at).getTime()) / 60000) : 0;
        if (gapMin > 10) {
          // Device was offline — append gap note + update count in one PATCH
          const thaiTime = new Date(Date.now() + 7 * 3600000).toISOString().slice(11, 16);
          const gapNote = ' ⚠️ เซนเซอร์ออฟไลน์ ~' + gapMin + ' นาที กลับมา ' + thaiTime + ' น.';
          await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + active.id, {
            method: 'PATCH', headers: sbHeaders(sbKey),
            body: JSON.stringify({ readings_count: (active.readings_count || 0) + 1, updated_at: new Date().toISOString(), notes: ((active.notes || '') + gapNote).trim() }),
          });
        } else {
          await updateSessionCount(sbUrl, sbKey, active.id, (active.readings_count || 0) + 1);
        }
        return { action: active.session_status === 'baseline' ? 'baseline' : 'continued', sessionId: active.id, gapMinutes: gapMin > 10 ? gapMin : undefined };
      }
    } else {
      // No active session — check cooldown from last closed session (use cached if available)
      const last = cachedLastClosed !== undefined ? cachedLastClosed : await getLastClosedSession(sbUrl, sbKey, deviceId);
      if (last && last.ended_at) {
        const sinceEnded = (Date.now() - new Date(last.ended_at).getTime()) / 60000;
        if (sinceEnded < SESSION_COOLDOWN_MINUTES) {
          return { action: 'cooldown', minutesLeft: Math.round(SESSION_COOLDOWN_MINUTES - sinceEnded) };
        }
      }
      // Daily limit check (use cached if available)
      const countToday = cachedCountToday !== undefined ? cachedCountToday : await getSessionCountToday(sbUrl, sbKey, deviceId);
      if (countToday >= MAX_SESSIONS_PER_DAY) {
        return { action: 'daily-limit', sessionsToday: countToday };
      }
      // Online check — don't create phantom session if device is offline
      if (!isOnline) {
        return { action: 'device-offline' };
      }
      const newSession = await createSession(sbUrl, sbKey, deviceId, stoveType, houseId, projectId);
      return { action: 'new', sessionId: newSession?.id };
    }
  } catch (err) {
    return { action: 'error', message: err.message };
  }
}

// ===== Handler =====
module.exports = async function handler(req, res) {
  // Auth check — fail-closed: MUST have CRON_SECRET set
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'CRON_SECRET not configured' });
  }
  const auth = req.headers['authorization'];
  const query = req.query?.secret;
  if (auth !== 'Bearer ' + secret && query !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const accessId = process.env.TUYA_ACCESS_ID;
  const accessSecret = process.env.TUYA_ACCESS_SECRET;
  const appUserUid = (process.env.TUYA_APP_USER_UID || '').trim();
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  if (!accessId || !accessSecret || !sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const results = [];
  let tuyaCalls = 0;

  try {
    // ===== Phase 0: Load sensors from Supabase (dynamic) =====
    const SENSORS = await loadSensors(sbUrl, sbKey);
    if (SENSORS.length === 0) {
      return res.status(200).json({ success: true, synced: '0/0', skipped: 'no registered sensors', time: new Date().toISOString(), tuya_calls: 0 });
    }

    // ===== Phase 0.5: Check schedule — quiet hours / day-of-week / holidays (0 Tuya calls) =====
    const schedule = await loadSyncSchedule(sbUrl, sbKey);
    const quietConfig = schedule.config;
    const thaiNow = new Date(Date.now() + 7 * 3600000);

    // 0.5a: Quiet hours (time range)
    if (quietConfig && quietConfig.quiet_hours_enabled) {
      const hhmm = thaiNow.toISOString().slice(11, 16); // "HH:MM"
      const start = quietConfig.quiet_hours_start;
      const end = quietConfig.quiet_hours_end;
      const inQuiet = start <= end
        ? (hhmm >= start && hhmm < end)
        : (hhmm >= start || hhmm < end);
      if (inQuiet) {
        return res.status(200).json({
          success: true, synced: '0/' + SENSORS.length,
          skipped: 'quiet hours (' + start + '-' + end + ' Thai time)',
          quiet_hours: true, tuya_calls: 0, time: new Date().toISOString(),
        });
      }
    }

    // 0.5b: Day-of-week check (1=จ, 2=อ, ..., 7=อา)
    if (quietConfig && quietConfig.active_days) {
      const jsDay = thaiNow.getUTCDay(); // 0=Sun, 1=Mon, ...
      const isoDay = jsDay === 0 ? 7 : jsDay; // 7=อา
      const activeDays = quietConfig.active_days.split(',').map(d => parseInt(d.trim(), 10));
      if (!activeDays.includes(isoDay)) {
        const dayNames = ['', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
        return res.status(200).json({
          success: true, synced: '0/' + SENSORS.length,
          skipped: 'rest day (วัน' + dayNames[isoDay] + ')',
          rest_day: true, tuya_calls: 0, time: new Date().toISOString(),
        });
      }
    }

    // 0.5c: Holiday check
    if (schedule.holidays.length > 0) {
      const todayStr = thaiNow.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const holiday = schedule.holidays.find(h => h.holiday_date === todayStr);
      if (holiday) {
        return res.status(200).json({
          success: true, synced: '0/' + SENSORS.length,
          skipped: 'holiday (' + (holiday.reason || todayStr) + ')',
          holiday: true, tuya_calls: 0, time: new Date().toISOString(),
        });
      }
    }

    // ===== Phase 1: Supabase pre-checks — BATCH (0 Tuya calls, 3 Supabase calls) =====
    const sensorsNeedingTuya = [];
    const cachedSessions = {};
    const allIds = SENSORS.map(s => s.id);

    // 3 batch queries instead of N×3 sequential queries
    const [activeMap, closedMap, countMap] = await Promise.all([
      getBatchActiveSessions(sbUrl, sbKey, allIds),
      getBatchLastClosedSessions(sbUrl, sbKey, allIds),
      getBatchSessionCountToday(sbUrl, sbKey, allIds),
    ]);

    for (const sensor of SENSORS) {
      try {
        const active = activeMap[sensor.id] || null;

        if (active) {
          const sessionAge = (Date.now() - new Date(active.started_at).getTime()) / 60000;

          if (sessionAge >= SESSION_MAX_MINUTES) {
            await closeSession(sbUrl, sbKey, active, 'ครบเวลา ' + Math.round(sessionAge) + ' นาที');
            results.push({ sensor: sensor.name, status: 'skipped', reason: 'auto-cutoff', session: { action: 'auto-cutoff', sessionId: active.id, minutes: Math.round(sessionAge) } });
            continue;
          }
          // gap-based closing removed — session stays open until 130 min timer
          cachedSessions[sensor.id] = active;
          sensorsNeedingTuya.push(sensor);
        } else {
          const last = closedMap[sensor.id] || null;
          if (last && last.ended_at) {
            const sinceEnded = (Date.now() - new Date(last.ended_at).getTime()) / 60000;
            if (sinceEnded < SESSION_COOLDOWN_MINUTES) {
              results.push({ sensor: sensor.name, status: 'skipped', reason: 'cooldown', session: { action: 'cooldown', minutesLeft: Math.round(SESSION_COOLDOWN_MINUTES - sinceEnded) } });
              continue;
            }
          }
          const countToday = countMap[sensor.id] || 0;
          if (countToday >= MAX_SESSIONS_PER_DAY) {
            results.push({ sensor: sensor.name, status: 'skipped', reason: 'daily-limit', session: { action: 'daily-limit', sessionsToday: countToday } });
            continue;
          }
          cachedSessions[sensor.id] = null;
          sensorsNeedingTuya.push(sensor);
        }
      } catch (err) {
        results.push({ sensor: sensor.name, status: 'error', message: err.message });
      }
    }

    // ===== Phase 2: Early exit if no sensor needs Tuya =====
    if (sensorsNeedingTuya.length === 0) {
      // Still update online/offline status from Tuya (1 API call)
      try {
        const { token: t2 } = await getCachedToken(accessId, accessSecret);
        if (t2) {
          const infoMap = await getBatchDeviceInfo(accessId, accessSecret, t2, allIds, appUserUid);
          tuyaCalls += infoMap._attempts || 1;
          if (!infoMap._apiError) {
            const nowISO = new Date().toISOString();
            await Promise.all(SENSORS.map(s => fetch(sbUrl + '/rest/v1/registered_sensors?tuya_device_id=eq.' + s.id, {
              method: 'PATCH', headers: sbHeaders(sbKey),
              body: JSON.stringify({ is_online: !!(infoMap[s.id] && infoMap[s.id].online), last_checked_at: nowISO }),
            })));
          }
        }
      } catch (_) {}
      for (const sensor of SENSORS) {
        try { await upsertDailySummary(sbUrl, sbKey, sensor.id, sensor.stoveType, sensor.projectId); } catch (_) {}
      }
      await updateMonthlyQuota(sbUrl, sbKey, tuyaCalls);
      return res.status(200).json({
        success: true,
        synced: '0/' + SENSORS.length,
        skipped: 'all sensors idle',
        time: new Date().toISOString(),
        tuya_calls: tuyaCalls,
        results,
      });
    }

    // ===== Phase 2.5: Check monthly API quota =====
    const quota = await getMonthlyQuota(sbUrl, sbKey);
    if (quota && quota.tuya_calls >= MONTHLY_API_LIMIT) {
      return res.status(200).json({
        success: true,
        synced: '0/' + SENSORS.length,
        skipped: 'monthly API quota exceeded (' + quota.tuya_calls + '/' + MONTHLY_API_LIMIT + ')',
        quota_exceeded: true,
        tuya_calls: 0,
        time: new Date().toISOString(),
      });
    }

    // ===== Phase 3: Get Tuya token (cached = 0 calls, fresh = 1 call) =====
    const { token, cached: tokenCached } = await getCachedToken(accessId, accessSecret);
    if (!token) {
      return res.status(502).json({ error: 'Cannot get Tuya token' });
    }
    if (!tokenCached) tuyaCalls++;

    // ===== Phase 4: Device info — online check (1 Smart Home API call for ALL sensors) =====
    const deviceInfoMap = await getBatchDeviceInfo(accessId, accessSecret, token, allIds, appUserUid);
    tuyaCalls += deviceInfoMap._attempts || 1;

    // If Tuya API itself failed, track error count in session notes
    if (deviceInfoMap._apiError) {
      console.error('Phase 4: Tuya API failed — ' + deviceInfoMap._errorMsg + '. Keeping sessions alive.');
      for (const sensor of sensorsNeedingTuya) {
        const cached = cachedSessions[sensor.id];
        if (cached) {
          // Track error count in session notes — append, don't overwrite
          const existingNotes = (cached.notes || '').replace(/\s*tuya_api_errors:\d+/, '').trim();
          const existingErrors = parseInt(((cached.notes || '').match(/tuya_api_errors:(\d+)/) || [])[1] || '0');
          const newErrors = existingErrors + 1;
          const updatedNotes = (existingNotes ? existingNotes + ' ' : '') + 'tuya_api_errors:' + newErrors;
          await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + cached.id, {
            method: 'PATCH', headers: sbHeaders(sbKey),
            body: JSON.stringify({ updated_at: new Date().toISOString(), notes: updatedNotes }),
          });
        }
        results.push({ sensor: sensor.name, status: 'tuya_api_error', reason: deviceInfoMap._errorMsg });
      }
      await updateMonthlyQuota(sbUrl, sbKey, tuyaCalls);
      return res.status(200).json({ success: true, synced: '0/' + SENSORS.length, tuya_api_error: deviceInfoMap._errorMsg, time: new Date().toISOString(), tuya_calls: tuyaCalls, results });
    }

    // ===== Phase 4.5: Write online/offline status for ALL sensors =====
    const nowISO = new Date().toISOString();
    await Promise.all(SENSORS.map(s => fetch(sbUrl + '/rest/v1/registered_sensors?tuya_device_id=eq.' + s.id, {
      method: 'PATCH', headers: sbHeaders(sbKey),
      body: JSON.stringify({ is_online: !!(deviceInfoMap[s.id] && deviceInfoMap[s.id].online), last_checked_at: nowISO }),
    })));

    // ===== Phase 5: Device status — ONLY if any sensor is online (N parallel calls) =====
    const onlineSensors = sensorsNeedingTuya.filter(s => {
      const info = deviceInfoMap[s.id];
      return info && info.online;
    });

    let deviceStatusMap = {};
    if (onlineSensors.length > 0) {
      const onlineIds = onlineSensors.map(s => s.id);
      deviceStatusMap = await getBatchDeviceStatus(accessId, accessSecret, token, onlineIds);
      tuyaCalls += deviceStatusMap._attempts || 1;
    }

    // ===== Phase 6: Process each sensor with batch results =====
    for (const sensor of sensorsNeedingTuya) {
      try {
        const isOnline = deviceInfoMap[sensor.id] && deviceInfoMap[sensor.id].online;

        const session = await manageSession(sbUrl, sbKey, sensor.id, sensor.stoveType, isOnline, sensor.houseId, cachedSessions[sensor.id], sensor.projectId, closedMap[sensor.id] || null, countMap[sensor.id] || 0);
        const skipActions = ['cooldown', 'cooldown (after close)', 'auto-cutoff', 'daily-limit', 'device-offline'];

        if (skipActions.includes(session.action)) {
          results.push({ sensor: sensor.name, status: session.action === 'device-offline' ? 'offline' : 'skipped', reason: session.action, session });
          continue;
        }

        const readings = deviceStatusMap[sensor.id];
        if (!readings) {
          results.push({ sensor: sensor.name, status: 'no_data' });
          continue;
        }

        const inserted = await insertLog(sbUrl, sbKey, readings, sensor.id, sensor.stoveType, session.sessionId);

        results.push({
          sensor: sensor.name,
          status: inserted === 'dedup' ? 'dedup' : (inserted ? 'ok' : 'insert_failed'),
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

    // Always recalculate daily summaries
    for (const sensor of SENSORS) {
      try { await upsertDailySummary(sbUrl, sbKey, sensor.id, sensor.stoveType, sensor.projectId); } catch (_) {}
    }

    // Track API usage for this month
    await updateMonthlyQuota(sbUrl, sbKey, tuyaCalls);

    const ok = results.filter(r => r.status === 'ok').length;
    const quotaAfter = quota ? (quota.tuya_calls || 0) + tuyaCalls : null;
    const quotaPct = quotaAfter !== null ? Math.round(quotaAfter / MONTHLY_API_LIMIT * 100) : null;
    if (quotaPct !== null && quotaPct >= 80) {
      console.warn('QUOTA WARNING: ' + quotaPct + '% used (' + quotaAfter + '/' + MONTHLY_API_LIMIT + ')');
    }
    return res.status(200).json({
      success: true,
      synced: ok + '/' + SENSORS.length,
      time: new Date().toISOString(),
      tuya_calls: tuyaCalls,
      quota: quotaAfter !== null ? { used: quotaAfter, limit: MONTHLY_API_LIMIT, pct: quotaPct } : null,
      quota_warning: quotaPct !== null && quotaPct >= 80,
      _debug: deviceInfoMap._debug || null,
      results,
    });
  } catch (err) {
    console.error('sync handler error:', err.message, err.stack);
    return res.status(500).json({ error: 'Internal sync error' });
  }
};
