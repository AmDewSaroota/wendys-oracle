/**
 * Biomass Stove Volunteer API
 * Handles volunteer actions: cooking-start (baseline transition), session status
 *
 * Env vars (same as sync.js):
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY (or SUPABASE_KEY)
 */

function sbHeaders(key) {
  return {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
  };
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

      // Already collecting? Just note it
      if (session.session_status === 'collecting') {
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
  // Unknown action
  // ========================================
  return res.json({ ok: false, error: 'Unknown action. Use: cooking-start, status' });
};
