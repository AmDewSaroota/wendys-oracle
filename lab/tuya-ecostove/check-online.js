const SB = 'https://zijybzjstjlqvhmckgor.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';
const h = { apikey: KEY, Authorization: 'Bearer ' + KEY };

async function run() {
  const [sensors, devices] = await Promise.all([
    fetch(SB + '/rest/v1/registered_sensors?select=tuya_device_id,name,is_online,last_checked_at&order=name.asc', { headers: h }).then(r => r.json()),
    fetch(SB + '/rest/v1/devices?select=tuya_device_id,name,is_active&order=name.asc', { headers: h }).then(r => r.json()),
  ]);

  console.log('=== registered_sensors (' + sensors.length + ' rows) ===');
  for (const s of sensors) {
    console.log('  ' + (s.name || '?').padEnd(18) + ' ...' + (s.tuya_device_id || '').slice(-8) + '  is_online=' + String(s.is_online).padEnd(6) + ' checked=' + (s.last_checked_at || 'never').slice(0, 19));
  }

  console.log('\n=== devices (' + devices.length + ' rows) ===');
  for (const d of devices) {
    console.log('  ' + (d.name || '?').padEnd(18) + ' ...' + (d.tuya_device_id || '').slice(-8) + '  active=' + d.is_active);
  }

  console.log('\n=== Match check ===');
  const sensorIds = new Set(sensors.map(s => s.tuya_device_id));
  let missingCount = 0;
  for (const d of devices) {
    if (!sensorIds.has(d.tuya_device_id)) {
      console.log('  MISSING in registered_sensors: ' + d.name + ' ' + d.tuya_device_id);
      missingCount++;
    }
  }
  if (missingCount === 0) console.log('  All devices have matching registered_sensors rows');
}

run().catch(e => console.error('ERROR:', e.message));
