/**
 * Check Supabase tables
 */

const SB_URL = "https://zijybzjstjlqvhmckgor.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanliempzdGpscXZobWNrZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NjExOTYsImV4cCI6MjA4NDEzNzE5Nn0.XE3_EsMWsJ71T71JTURuVIHrFz7J7I2kfJb4zIcSeoA";

async function checkTable(tableName) {
  console.log(`\nChecking table: ${tableName}`);

  const response = await fetch(`${SB_URL}/rest/v1/${tableName}?order=recorded_at.desc&limit=5`, {
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
  console.log('🔍 ข้อมูลล่าสุดใน pollution_logs\n');
  await checkTable('pollution_logs');
}

main().catch(console.error);
