// Migrate AQI values from US EPA to Thai PCD standard
// Recalculates AQI from pm25_value for all pollution_logs

require('./_env');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function thaiAqi(pm25) {
  if (pm25 == null || pm25 < 0) return null;
  const bp = [
    { lo: 0, hi: 15, aqiLo: 0, aqiHi: 25 },
    { lo: 15.1, hi: 25, aqiLo: 26, aqiHi: 50 },
    { lo: 25.1, hi: 37.5, aqiLo: 51, aqiHi: 100 },
    { lo: 37.6, hi: 75, aqiLo: 101, aqiHi: 200 },
    { lo: 75.1, hi: 150, aqiLo: 201, aqiHi: 300 },
  ];
  for (const b of bp) {
    if (pm25 >= b.lo && pm25 <= b.hi)
      return Math.round((b.aqiHi - b.aqiLo) / (b.hi - b.lo) * (pm25 - b.lo) + b.aqiLo);
  }
  return pm25 > 150 ? 300 : null;
}

async function main() {
  // Fetch all records with pm25_value
  const res = await fetch(
    SUPABASE_URL + '/rest/v1/pollution_logs?select=id,pm25_value,aqi&pm25_value=not.is.null&order=id.asc',
    { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
  );
  const data = await res.json();
  console.log('Total records with PM2.5:', data.length);

  // Preview
  console.log('\nSample before/after:');
  data.slice(0, 5).forEach(r => {
    console.log(`  id=${r.id} pm25=${r.pm25_value} old_aqi=${r.aqi} → new_aqi=${thaiAqi(r.pm25_value)}`);
  });

  // Update each record
  let updated = 0, errors = 0;
  for (const r of data) {
    const newAqi = thaiAqi(r.pm25_value);
    if (newAqi === r.aqi) continue; // already correct

    const patchRes = await fetch(
      SUPABASE_URL + '/rest/v1/pollution_logs?id=eq.' + r.id,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ aqi: newAqi }),
      }
    );
    if (patchRes.ok) {
      updated++;
    } else {
      errors++;
      console.error(`  Error updating id=${r.id}: ${patchRes.status}`);
    }
  }

  console.log(`\nDone: ${updated} updated, ${data.length - updated - errors} unchanged, ${errors} errors`);

  // Verify
  const verify = await fetch(
    SUPABASE_URL + '/rest/v1/pollution_logs?select=id,pm25_value,aqi&pm25_value=not.is.null&order=id.asc&limit=5',
    { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
  );
  const check = await verify.json();
  console.log('\nVerification (first 5):');
  check.forEach(r => console.log(`  id=${r.id} pm25=${r.pm25_value} aqi=${r.aqi} (expected: ${thaiAqi(r.pm25_value)})`));
}

main().catch(console.error);
