// Mock manual TVOC/CO data for MT15 001 — uses raw fetch (no supabase-js needed)
const SUPABASE_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU2MTE5NiwiZXhwIjoyMDg0MTM3MTk2fQ.AGXPjdjfSzg5ZmUVNuTu4Vab6JLMH9P_RwXpfXFrkac';
const MT15_DEVICE_ID = 'a31aff2ac0acbbf911cee3';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

async function sbGet(table, params) {
  const url = SUPABASE_URL + '/rest/v1/' + table + '?' + params;
  const res = await fetch(url, { headers });
  return res.json();
}

async function sbPost(table, body) {
  const url = SUPABASE_URL + '/rest/v1/' + table;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Insert failed: ' + res.status + ' ' + text);
  }
  return true;
}

async function run() {
  // Find MT15 001 sessions
  const sessions = await sbGet('sessions', 'device_id=eq.' + MT15_DEVICE_ID + '&order=started_at.desc&limit=5&select=id,device_id,started_at,session_status,readings_count');

  console.log('MT15 001 sessions:');
  for (const s of sessions) {
    console.log('  ID=' + s.id + ' | ' + (s.started_at || '').slice(0, 16) + ' | status=' + s.session_status + ' | readings=' + s.readings_count);
  }

  const target = sessions.find(s => s.readings_count > 5);
  if (!target) { console.log('No suitable session'); return; }

  console.log('\nTarget: session ' + target.id);

  // Get sensor logs time range
  const logs = await sbGet('pollution_logs', 'session_id=eq.' + target.id + '&data_source=eq.sensor&order=recorded_at.asc&select=recorded_at,house_id,tuya_device_id,stove_type&limit=500');
  console.log('Sensor logs: ' + logs.length);
  if (!logs.length) return;

  console.log('Time: ' + logs[0].recorded_at.slice(11, 16) + ' -> ' + logs[logs.length - 1].recorded_at.slice(11, 16));

  // Check if manual already exists
  const existing = await sbGet('pollution_logs', 'session_id=eq.' + target.id + '&data_source=eq.manual&select=id&limit=1');
  if (existing.length > 0) {
    console.log('Already has manual entries — skipping');
    return;
  }

  // Build mock entries every 10 min
  const sample = logs[0];
  const startMs = new Date(logs[0].recorded_at).getTime();
  const endMs = new Date(logs[logs.length - 1].recorded_at).getTime();
  const entries = [];

  for (let t = startMs + 5 * 60000; t < endMs; t += 10 * 60000) {
    const tvoc = +(0.05 + Math.random() * 0.25).toFixed(3);
    const co = +(Math.random() * 12).toFixed(1);
    entries.push({
      session_id: target.id,
      house_id: sample.house_id,
      tuya_device_id: sample.tuya_device_id,
      stove_type: sample.stove_type,
      data_source: 'manual',
      status: 'pending',
      recorded_at: new Date(t).toISOString(),
      tvoc_value: tvoc,
      co_value: co,
      // volunteer_id left null for mock data (delete by: data_source=manual AND session_id=target.id)
    });
  }

  console.log('\nInserting ' + entries.length + ' mock manual entries:');
  for (const e of entries) {
    console.log('  ' + e.recorded_at.slice(11, 16) + ' | TVOC=' + e.tvoc_value + ' mg/m³ | CO=' + e.co_value + ' ppm');
  }

  await sbPost('pollution_logs', entries);
  console.log('\nDone! ลบได้ด้วย: volunteer_id = "mock-test"');
}

run().catch(e => console.error('ERROR:', e.message));
