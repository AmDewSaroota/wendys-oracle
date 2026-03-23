/**
 * Biomass Stove Volunteer API
 * Handles volunteer actions: cooking-start, status, ping-sensor
 *
 * Env vars (same as sync.js):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY (or SUPABASE_KEY)
 *   TUYA_ACCESS_ID, TUYA_ACCESS_SECRET, TUYA_APP_USER_UID  (for ping-sensor)
 */

const crypto = require('crypto');
const TUYA_BASE = 'https://openapi-sg.iotbing.com';
const MAX_SESSIONS_PER_DAY = 2;
const SESSION_COOLDOWN_MINUTES = 300;

function sbHeaders(key) {
  return {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
  };
}

// Tuya auth (same logic as sync.js)
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
  const res = await fetch(TUYA_BASE + path, {
    headers: { client_id: accessId, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
  });
  const data = await res.json();
  return data.success ? data.result.access_token : null;
}

function getThaiDate() {
  return new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ ok: false, error: 'Server config missing' });
  }

  const action = req.query.action;

  // ========================================
  // ACTION: cooking-start
  // Volunteer marks "เริ่มจุดเตาแล้ว"
  // → Compute baseline from logs collected so far
  // → Transition session from baseline → collecting
  // ========================================
  if (action === 'cooking-start') {
    const sessionId = req.query.session_id;
    const houseId = req.query.house_id;
    const gpsLat = req.query.gps_lat || null;
    const gpsLng = req.query.gps_lng || null;

    if (!sessionId) {
      return res.json({ ok: false, error: 'session_id required' });
    }

    try {
      // 1. Get the session
      const sessRes = await fetch(
        sbUrl + '/rest/v1/sessions?id=eq.' + sessionId + '&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      if (!sessRes.ok) {
        return res.json({ ok: false, error: 'Failed to fetch session: ' + sessRes.status });
      }
      const sessions = await sessRes.json();
      if (!sessions.length) {
        return res.json({ ok: false, error: 'Session not found' });
      }

      const session = sessions[0];

      // Already collecting? Handle retroactive cooking-start
      if (session.session_status === 'collecting') {
        // If auto-transitioned and no manual mark yet, save actual cooking time
        if (session.baseline_transition === 'auto') {
          const now = new Date().toISOString();
          const thaiTimeStr = new Date(Date.now() + 7 * 3600000).toISOString().slice(11, 16);
          const gpsNote = (gpsLat && gpsLng) ? ' GPS:' + gpsLat + ',' + gpsLng : '';
          const retroUpdate = {
            baseline_transition: 'manual-retroactive',
            notes: ((session.notes || '') + ' อาสากดจุดเตาย้อนหลัง ' + thaiTimeStr + ' น.' + gpsNote).trim(),
            updated_at: now,
          };

          const patchRes = await fetch(
            sbUrl + '/rest/v1/sessions?id=eq.' + sessionId,
            {
              method: 'PATCH',
              headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal' },
              body: JSON.stringify(retroUpdate),
            }
          );

          if (!patchRes.ok) {
            const errText = await patchRes.text();
            console.error('Retroactive cooking-start patch failed:', patchRes.status, errText);
            return res.json({ ok: false, error: 'Update failed: ' + patchRes.status });
          }

          console.log('Retroactive cooking mark for session', sessionId, 'at', thaiTimeStr);
          return res.json({ ok: true, retroactive: true, baseline_readings: session.baseline_readings_count || 0 });
        }

        // Already manually transitioned — nothing to do
        return res.json({ ok: true, message: 'Session already collecting', baseline_readings: session.baseline_readings_count || 0 });
      }

      // Only transition from baseline
      if (session.session_status !== 'baseline') {
        return res.json({ ok: false, error: 'Session is ' + session.session_status + ', cannot transition' });
      }

      // 2. Fetch all pollution_logs for this session (= baseline data)
      const logsRes = await fetch(
        sbUrl + '/rest/v1/pollution_logs?session_id=eq.' + sessionId + '&order=recorded_at.asc',
        { headers: sbHeaders(sbKey) }
      );
      const logs = logsRes.ok ? await logsRes.json() : [];

      // 3. Compute baseline averages
      const avg = (arr, field) => {
        const vals = arr.map(r => r[field]).filter(v => v != null && !isNaN(v));
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      };

      const now = new Date().toISOString();
      const thaiTimeStr = new Date(Date.now() + 7 * 3600000).toISOString().slice(11, 16);
      const gpsNote = (gpsLat && gpsLng) ? ' GPS:' + gpsLat + ',' + gpsLng : '';
      const update = {
        session_status: 'collecting',
        baseline_ended_at: now,
        baseline_transition: 'manual',
        baseline_avg_pm25: avg(logs, 'pm25_value'),
        baseline_avg_co2: avg(logs, 'co2_value'),
        baseline_avg_temperature: avg(logs, 'temperature'),
        baseline_avg_humidity: avg(logs, 'humidity'),
        baseline_avg_tvoc: avg(logs, 'tvoc_value'),
        baseline_avg_co: avg(logs, 'co_value'),
        baseline_readings_count: logs.length,
        notes: ((session.notes || '') + ' อาสากดเริ่มจุดเตา ' + thaiTimeStr + ' น.' + gpsNote).trim(),
        updated_at: now,
      };

      // 4. Patch the session
      const patchRes = await fetch(
        sbUrl + '/rest/v1/sessions?id=eq.' + sessionId,
        {
          method: 'PATCH',
          headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal' },
          body: JSON.stringify(update),
        }
      );

      if (!patchRes.ok) {
        const errText = await patchRes.text();
        console.error('Cooking-start patch failed:', patchRes.status, errText);
        return res.json({ ok: false, error: 'Update failed: ' + patchRes.status });
      }

      console.log('Cooking started for session', sessionId,
        '| baseline readings:', logs.length,
        '| pm25:', update.baseline_avg_pm25,
        '| co2:', update.baseline_avg_co2);

      return res.json({
        ok: true,
        baseline_readings: logs.length,
        baseline_avg_pm25: update.baseline_avg_pm25,
        baseline_avg_co2: update.baseline_avg_co2,
      });
    } catch (e) {
      console.error('cooking-start error:', e);
      return res.json({ ok: false, error: e.message });
    }
  }

  // ========================================
  // ACTION: status
  // Get current session status for a house
  // ========================================
  if (action === 'status') {
    const houseId = req.query.house_id;
    if (!houseId) {
      return res.json({ ok: false, error: 'house_id required' });
    }

    try {
      // Find device for house
      const devRes = await fetch(
        sbUrl + '/rest/v1/devices?subject_id=eq.' + houseId + '&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      const devices = devRes.ok ? await devRes.json() : [];
      if (!devices.length) {
        return res.json({ ok: true, device: null, session: null });
      }

      const device = devices[0];

      // Find active session
      const sessRes = await fetch(
        sbUrl + '/rest/v1/sessions?device_id=eq.' + device.tuya_device_id +
          '&session_status=in.(baseline,collecting)&order=started_at.desc&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      const sessions = sessRes.ok ? await sessRes.json() : [];

      return res.json({
        ok: true,
        device: { id: device.id, tuya_device_id: device.tuya_device_id },
        session: sessions.length ? sessions[0] : null,
      });
    } catch (e) {
      return res.json({ ok: false, error: e.message });
    }
  }

  // ========================================
  // ACTION: ping-sensor
  // Check Tuya if sensor is online, create session if needed
  // Called by volunteer page when searching for sensor (no session found)
  // ========================================
  if (action === 'ping-sensor') {
    const houseId = req.query.house_id;
    if (!houseId) return res.json({ ok: false, error: 'house_id required' });

    try {
      // 1. Find device for house
      const devRes = await fetch(
        sbUrl + '/rest/v1/devices?subject_id=eq.' + houseId + '&is_active=eq.true&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      const devices = devRes.ok ? await devRes.json() : [];
      if (!devices.length) return res.json({ ok: true, online: false, reason: 'no-device' });
      const device = devices[0];
      const deviceId = device.tuya_device_id;

      // 2. Already has active session? No need to ping Tuya
      const sessRes = await fetch(
        sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
          '&session_status=in.(baseline,collecting)&order=started_at.desc&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      const sessions = sessRes.ok ? await sessRes.json() : [];
      if (sessions.length) return res.json({ ok: true, online: true, hasSession: true });

      // 3. Check Tuya online status
      const tuyaId = process.env.TUYA_ACCESS_ID;
      const tuyaSecret = process.env.TUYA_ACCESS_SECRET;
      if (!tuyaId || !tuyaSecret) return res.json({ ok: true, online: null, reason: 'tuya-config' });

      const token = await getTuyaToken(tuyaId, tuyaSecret);
      if (!token) return res.json({ ok: true, online: null, reason: 'tuya-token' });

      const timestamp = Date.now().toString();
      const devPath = '/v1.0/devices/' + deviceId;
      const sign = generateSign(tuyaId, tuyaSecret, 'GET', devPath, timestamp, token);
      const tuyaRes = await fetch(TUYA_BASE + devPath, {
        headers: { client_id: tuyaId, access_token: token, sign, t: timestamp, sign_method: 'HMAC-SHA256' },
      });
      const tuyaData = await tuyaRes.json();

      if (!tuyaData.success) {
        console.error('[ping-sensor] Tuya error:', tuyaData.msg || tuyaData.code);
        return res.json({ ok: true, online: false, reason: 'tuya-error', msg: tuyaData.msg });
      }

      const isOnline = tuyaData.result?.online || false;
      if (!isOnline) return res.json({ ok: true, online: false });

      // 4. Online! Check session limits
      const thaiDate = getThaiDate();
      const dayStart = new Date(thaiDate + 'T00:00:00+07:00').toISOString();
      const dayEnd = new Date(new Date(thaiDate + 'T00:00:00+07:00').getTime() + 86400000).toISOString();

      const countRes = await fetch(
        sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
          '&started_at=gte.' + dayStart + '&started_at=lt.' + dayEnd + '&select=id',
        { headers: sbHeaders(sbKey) }
      );
      const todaySessions = countRes.ok ? await countRes.json() : [];
      if (todaySessions.length >= MAX_SESSIONS_PER_DAY) {
        return res.json({ ok: true, online: true, reason: 'daily-limit' });
      }

      // Check cooldown from last closed session
      const lastRes = await fetch(
        sbUrl + '/rest/v1/sessions?device_id=eq.' + deviceId +
          '&session_status=in.(complete,incomplete,cancelled)&order=ended_at.desc&limit=1',
        { headers: sbHeaders(sbKey) }
      );
      const lastSessions = lastRes.ok ? await lastRes.json() : [];
      if (lastSessions.length && lastSessions[0].ended_at) {
        const elapsed = (Date.now() - new Date(lastSessions[0].ended_at).getTime()) / 60000;
        if (elapsed < SESSION_COOLDOWN_MINUTES) {
          return res.json({ ok: true, online: true, reason: 'cooldown', minutesLeft: Math.ceil(SESSION_COOLDOWN_MINUTES - elapsed) });
        }
      }

      // 5. Get stove_type + project_id for session
      let stoveType = null;
      try {
        const cpRes = await fetch(
          sbUrl + '/rest/v1/collection_periods?subject_id=eq.' + houseId +
            '&starts_at=lte.' + thaiDate +
            '&or=(ends_at.is.null,ends_at.gte.' + thaiDate + ')' +
            '&select=stove_type&order=starts_at.desc&limit=1',
          { headers: sbHeaders(sbKey) }
        );
        const cpData = cpRes.ok ? await cpRes.json() : [];
        if (cpData.length) stoveType = cpData[0].stove_type;
      } catch (_) {}

      let projectId = null;
      try {
        const spRes = await fetch(
          sbUrl + '/rest/v1/subject_projects?subject_id=eq.' + houseId + '&select=project_id&limit=1',
          { headers: sbHeaders(sbKey) }
        );
        const spData = spRes.ok ? await spRes.json() : [];
        if (spData.length) projectId = spData[0].project_id;
      } catch (_) {}

      // 6. Create session
      const newSession = {
        device_id: deviceId,
        session_status: 'baseline',
        session_number: todaySessions.length + 1,
        stove_type: stoveType,
        house_id: parseInt(houseId),
        project_id: projectId,
        started_at: new Date().toISOString(),
        readings_count: 0,
      };

      const createRes = await fetch(sbUrl + '/rest/v1/sessions', {
        method: 'POST',
        headers: { ...sbHeaders(sbKey), 'Prefer': 'return=representation' },
        body: JSON.stringify(newSession),
      });

      if (!createRes.ok) {
        console.error('[ping-sensor] session create failed:', createRes.status);
        return res.json({ ok: true, online: true, reason: 'session-create-failed' });
      }

      const created = (await createRes.json())[0];

      // 7. Fetch first sensor reading and insert log
      try {
        const ts2 = Date.now().toString();
        const statusPath = '/v1.0/devices/' + deviceId + '/status';
        const sign2 = generateSign(tuyaId, tuyaSecret, 'GET', statusPath, ts2, token);
        const statusRes = await fetch(TUYA_BASE + statusPath, {
          headers: { client_id: tuyaId, access_token: token, sign: sign2, t: ts2, sign_method: 'HMAC-SHA256' },
        });
        const statusData = await statusRes.json();
        if (statusData.success && statusData.result) {
          const readings = {};
          for (const item of statusData.result) readings[item.code] = item.value;
          const log = {
            pm25_value: readings.pm25_value ?? null,
            pm10_value: readings.pm10 ?? null,
            co2_value: readings.co2_value ?? null,
            co_value: readings.co_value ?? null,
            temperature: readings.temp_current ?? null,
            humidity: readings.humidity_value ?? null,
            hcho_value: readings.ch2o_value ?? null,
            tvoc_value: readings.tvoc_value ?? null,
            data_source: 'sensor',
            tuya_device_id: deviceId,
            stove_type: stoveType,
            status: 'pending',
            recorded_at: new Date().toISOString(),
            session_id: created.id,
          };
          await fetch(sbUrl + '/rest/v1/pollution_logs', {
            method: 'POST',
            headers: { ...sbHeaders(sbKey), 'Prefer': 'return=minimal' },
            body: JSON.stringify(log),
          });
          // Update session readings_count
          await fetch(sbUrl + '/rest/v1/sessions?id=eq.' + created.id, {
            method: 'PATCH',
            headers: sbHeaders(sbKey),
            body: JSON.stringify({ readings_count: 1, updated_at: new Date().toISOString() }),
          });
        }
      } catch (e) {
        console.warn('[ping-sensor] first reading insert failed:', e.message);
        // Non-fatal — session is created, sync.js will collect data next cycle
      }

      console.log('[ping-sensor] session created for', deviceId, 'house', houseId);
      return res.json({ ok: true, online: true, sessionCreated: true });
    } catch (e) {
      console.error('[ping-sensor] error:', e);
      return res.json({ ok: false, error: e.message });
    }
  }

  // ========================================
  // Unknown action
  // ========================================
  return res.json({ ok: false, error: 'Unknown action. Use: cooking-start, status, ping-sensor' });
};
