// Fix AQI values — recalculate from PM2.5 using US EPA breakpoints
const SUPABASE_URL = 'https://zijybzjstjlqvhmckgor.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA';

function calculateAqi(pm25) {
  if (pm25 == null || isNaN(pm25) || pm25 < 0) return null;
  const bp = [
    [0, 12.0, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500.4, 301, 500],
  ];
  for (const [cLo, cHi, aqiLo, aqiHi] of bp) {
    if (pm25 <= cHi) return Math.round(((aqiHi - aqiLo) / (cHi - cLo)) * (pm25 - cLo) + aqiLo);
  }
  return pm25 > 500.4 ? 500 : null;
}

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  // Get all records with PM2.5 values
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pollution_logs?select=id,pm25_value,aqi&limit=5000`,
    { headers }
  );
  const logs = await res.json();
  console.log(`Found ${logs.length} records`);

  let fixed = 0;
  let skipped = 0;

  for (const log of logs) {
    const correctAqi = calculateAqi(log.pm25_value);
    if (correctAqi === log.aqi) {
      skipped++;
      continue;
    }

    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/pollution_logs?id=eq.${log.id}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ aqi: correctAqi }),
      }
    );
    if (patchRes.ok) {
      fixed++;
      if (fixed % 50 === 0) console.log(`  Fixed ${fixed} records...`);
    } else {
      console.error(`  Failed to update id=${log.id}:`, await patchRes.text());
    }
  }

  console.log(`\nDone! Fixed: ${fixed}, Already correct: ${skipped}, Total: ${logs.length}`);

  // Show sample of corrected values
  const sample = await fetch(
    `${SUPABASE_URL}/rest/v1/pollution_logs?select=id,pm25_value,aqi&order=id.desc&limit=5`,
    { headers }
  );
  const sampleData = await sample.json();
  console.log('\nSample (latest 5):');
  sampleData.forEach(d => console.log(`  PM2.5=${d.pm25_value} → AQI=${d.aqi}`));
}

main().catch(console.error);
