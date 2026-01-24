/**
 * Check Supabase tables
 */

const SB_URL = "https://lrfkanyrseicnhwlojtj.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZmthbnlyc2VpY25od2xvanRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNzg5MTcsImV4cCI6MjA4Mzg1NDkxN30.fSH7p644ZK23Qb-HHiCceHWh2baablgN3Em4X0tA39I";

async function checkTable(tableName) {
  console.log(`\nChecking table: ${tableName}`);

  const response = await fetch(`${SB_URL}/rest/v1/${tableName}?limit=5`, {
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`✅ Table exists! Sample data:`, JSON.stringify(data, null, 2));
    return true;
  } else {
    console.log(`❌ Error: ${response.status} ${response.statusText}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Checking Supabase tables...\n');

  // Check pollution_log
  await checkTable('pollution_log');

  // Also check common variations
  await checkTable('pollution_logs');
  await checkTable('air_quality');
  await checkTable('sensor_readings');
}

main().catch(console.error);
