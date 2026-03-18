/**
 * EcoStove — Insert mock pollution_logs for testing LINE OA flow
 * Run: node scripts/seed-mock-data.js
 * Clean: node scripts/seed-mock-data.js --clean
 */

const SB_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';

async function sbFetch(path, method = 'GET', body = null) {
  const url = SB_URL + path;
  const opts = {
    method,
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

function rand(min, max) { return Math.round(min + Math.random() * (max - min)); }

function makeReading(sensor, recordedAt) {
  const isEco = sensor.stoveType === 'eco';
  return {
    tuya_device_id: sensor.id,
    stove_type: sensor.stoveType,
    pm25_value: isEco ? rand(15, 50) : rand(40, 120),
    pm1_value: isEco ? rand(10, 35) : rand(30, 90),
    pm10_value: isEco ? rand(20, 60) : rand(50, 150),
    co2_value: isEco ? rand(400, 700) : rand(600, 1200),
    co_value: isEco ? rand(0, 2) : rand(1, 8),
    temperature: rand(25, 35),
    humidity: rand(50, 80),
    hcho_value: isEco ? rand(1, 30) / 1000 : rand(20, 80) / 1000,
    tvoc_value: isEco ? rand(50, 200) : rand(150, 500),
    aqi: isEco ? rand(20, 60) : rand(50, 150),
    recorded_at: recordedAt,
    data_source: 'mock',
    status: 'pending',
  };
}

async function seedMockData() {
  const today = new Date().toISOString().split('T')[0];
  const records = [];

  const sensorEco = { id: 'a3d01864e463e3ede0hf0e', name: 'MT13W', stoveType: 'eco' };
  const sensorOld = { id: 'a3b9c2e4bdfe69ad7ekytn', name: 'MT29', stoveType: 'old' };

  // ─── Case 1: MT13W — เก็บครบ 20 readings (7:00-16:30) ───
  for (let hour = 7; hour <= 16; hour++) {
    for (const min of [0, 30]) {
      const t = `${today}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00+07:00`;
      records.push(makeReading(sensorEco, t));
    }
  }
  console.log(`MT13W: ${20} readings (เก็บครบ)`);

  // ─── Case 2: MT29 — เก็บได้แค่ 3 readings แล้วเน็ตหลุด ───
  for (const [hour, min] of [[7, 0], [7, 30], [8, 0]]) {
    const t = `${today}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00+07:00`;
    records.push(makeReading(sensorOld, t));
  }
  console.log(`MT29:  ${3} readings (เน็ตหลุด)`);

  console.log(`\nInserting ${records.length} mock records...`);
  const result = await sbFetch('/rest/v1/pollution_logs', 'POST', records);

  if (Array.isArray(result)) {
    console.log(`Inserted ${result.length} records`);
  } else {
    console.log('Result:', result);
  }
}

async function cleanMockData() {
  console.log('Cleaning mock data (data_source=mock)...');
  const result = await sbFetch(
    `/rest/v1/pollution_logs?data_source=eq.mock`,
    'DELETE'
  );
  console.log('Cleaned:', result || 'done');
}

// ─── Main ───
const arg = process.argv[2];
if (arg === '--clean') {
  cleanMockData().catch(console.error);
} else {
  seedMockData().catch(console.error);
}
