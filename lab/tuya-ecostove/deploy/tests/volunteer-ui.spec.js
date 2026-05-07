// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const VOLUNTEER_URL = 'http://localhost:3000/volunteer.html';

// ── Mock API responses ──────────────────────────────────────
const HOUSE = { id: 1, full_name: 'บ้านทดสอบ', gps_lat: 18.79, gps_long: 98.98, volunteer_id: null };
const DEVICE = { id: 1, tuya_device_id: 'TEST-001', subject_id: 1, name: 'BS-001', is_active: true };
const SESSION = { id: 'sess-001', session_status: 'baseline', device_id: 'TEST-001', started_at: new Date().toISOString() };

async function mockAPIs(page) {
  // Supabase: subjects near GPS
  await page.route('**/rest/v1/subjects*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([HOUSE]) });
  });

  // Supabase: devices for house
  await page.route('**/rest/v1/devices*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([DEVICE]) });
  });

  // Supabase: sessions (no active session initially)
  await page.route('**/rest/v1/sessions*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  // Supabase: volunteer lock (no lock)
  await page.route('**/rest/v1/tvoc_active_sessions*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  // Supabase: daily summaries
  await page.route('**/rest/v1/daily_summaries*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  // API: ping-sensor → sensor ready
  await page.route('**/api/volunteer?action=ping-sensor*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, online: true, ready: true }) });
  });

  // API: start-session → session created
  await page.route('**/api/volunteer?action=start-session*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, sessionCreated: true }) });
  });

  // API: status → baseline phase
  await page.route('**/api/volunteer?action=status*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, session: SESSION, phase: 'baseline', readingsCount: 3 }) });
  });

  // API: cooking-start
  await page.route('**/api/volunteer?action=cooking-start*', async route => {
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, action: 'cooking' }) });
  });
}

// ── GPS mock ────────────────────────────────────────────────
async function mockGPS(page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success) => success({
          coords: { latitude: 18.79, longitude: 98.98, accuracy: 10 }
        }),
        watchPosition: () => 1,
        clearWatch: () => {},
      }
    });
  });
}

// ────────────────────────────────────────────────────────────
// TEST SUITE
// ────────────────────────────────────────────────────────────

test.describe('Volunteer UI Flow', () => {

  test.beforeEach(async ({ page }) => {
    await mockGPS(page);
    await mockAPIs(page);
  });

  // ── T1: หน้าโหลดได้ ──────────────────────────────────────
  test('T1: โหลดหน้า volunteer ได้', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    await expect(page).toHaveTitle(/อาสา|Volunteer|Biomass/i);
  });

  // ── T2: แสดงบ้านจาก GPS ──────────────────────────────────
  test('T2: ระบบจับบ้านจาก GPS อัตโนมัติ', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    // รอ house confirm UI
    await expect(page.locator('#matched-house-name')).toBeVisible({ timeout: 8000 });
  });

  // ── T3: ยืนยันบ้าน → ค้นหาเซนเซอร์ ──────────────────────
  test('T3: กดยืนยันบ้าน → ระบบค้นหาเซนเซอร์', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });

    await page.locator('[data-testid="confirm-matched-house"]').click();

    // ping-sensor เสร็จ → sensor-status-text ต้องบอกว่าพร้อม
    await expect(page.locator('#sensor-status-text'))
      .toContainText('พร้อม', { timeout: 10000 });
  });

  // ── T4: ปุ่มเริ่มเก็บข้อมูลปรากฏ ────────────────────────
  test('T4: ปุ่ม "เริ่มเก็บข้อมูล" ขึ้นหลัง sensor ready', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="confirm-matched-house"]').click();

    await expect(page.locator('#start-collection-btn')).toBeVisible({ timeout: 10000 });
  });

  // ── T5: กดเริ่มเก็บข้อมูล → เรียก start-session API + เข้า baseline ─────
  test('T5: กดเริ่มเก็บข้อมูล → ยิง start-session API และแสดง Baseline', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="confirm-matched-house"]').click();

    const startBtn = page.locator('#start-collection-btn');
    await startBtn.waitFor({ timeout: 10000 });

    // Verify API contract: start-session ต้องถูกยิงด้วย POST + house_id ใน body
    const reqPromise = page.waitForRequest(req =>
      req.url().includes('/api/volunteer') &&
      req.url().includes('action=start-session') &&
      req.method() === 'POST',
      { timeout: 10000 }
    );
    await startBtn.click();
    const req = await reqPromise;

    // Verify house_id ใน body (ป้องกัน CSRF/prefetch + สร้าง session ที่ถูกบ้าน)
    const payload = req.postDataJSON();
    expect(payload).toMatchObject({ house_id: expect.anything() });

    // UI ต้องเข้า session view
    await expect(page.locator('#step-session')).toBeVisible({ timeout: 8000 });
  });

  // ── T6: ปุ่มจุดเตาปรากฏหลัง baseline ────────────────────
  test('T6: ปุ่ม "เริ่มจุดเตาแล้ว" ปรากฏหลัง Baseline', async ({ page }) => {
    // Stateful mock: sessions returns [] before start, SESSION after
    let sessionStarted = false;
    await page.route('**/rest/v1/sessions*', async route => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify(sessionStarted ? [SESSION] : []) });
    });
    await page.route('**/api/volunteer?action=start-session*', async route => {
      sessionStarted = true;
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, sessionCreated: true }) });
    });

    // Supabase sends HEAD request for count=exact — Playwright route.fulfill() doesn't
    // reliably return Content-Range headers for HEAD. Override fetch directly instead.
    // Note: '*/2' = count of 2, matches MIN_BASELINE_READINGS in volunteer.html.
    // If MIN_BASELINE_READINGS changes, update this number.
    await page.addInitScript(() => {
      const origFetch = window.fetch;
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input
          : (input instanceof Request ? input.url : '');
        const method = (init?.method
          || (input instanceof Request ? input.method : 'GET')).toUpperCase();
        if (url.includes('pollution_logs') && method === 'HEAD') {
          return new Response(null, {
            status: 200,
            headers: { 'content-range': '*/2', 'content-type': 'application/json' }
          });
        }
        return origFetch.call(this, input, init);
      };
    });

    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="confirm-matched-house"]').click();

    const startBtn = page.locator('#start-collection-btn');
    await startBtn.waitFor({ timeout: 10000 });
    await startBtn.click();

    // ปุ่มจุดเตาต้องปรากฏ (wrap unhidden)
    await expect(page.locator('#cooking-btn-wrap')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#cooking-btn')).toBeVisible();
  });

  // ── T7: ไม่มี session → ต้องกดปุ่ม ไม่ auto-start ──────
  test('T7: ระบบไม่ auto-start session (waiting-for-start)', async ({ page }) => {
    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="confirm-matched-house"]').click();

    // รอ sensor พร้อม
    await expect(page.locator('#sensor-status-text'))
      .toContainText('พร้อม', { timeout: 10000 });

    // baseline progress ต้องยังซ่อนอยู่ (ไม่ auto-start)
    await expect(page.locator('#baseline-progress')).not.toBeVisible();
    // start button ต้องโชว์ (รอกด)
    await expect(page.locator('#start-collection-btn')).toBeVisible();
  });

  // ── T8: daily limit → แสดงข้อความ quota ────────────────
  test('T8: ครบ quota วันนี้ → แสดงข้อความครบ quota', async ({ page }) => {
    await page.route('**/api/volunteer?action=ping-sensor*', async route => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, online: true, ready: false,
          reason: 'daily-limit', sessionsToday: 2 }) });
    });

    await page.goto(VOLUNTEER_URL);
    await page.locator('#matched-house-name').waitFor({ timeout: 8000 });
    await page.locator('[data-testid="confirm-matched-house"]').click();

    // ต้องบอกชัดว่าครบ quota — ไม่ใช่แค่ visible
    await expect(page.locator('#sensor-status-text'))
      .toContainText(/ครบ.*session|ครบ.*รอบ|quota/i, { timeout: 10000 });
    // start button ต้องไม่โชว์
    await expect(page.locator('#start-collection-btn')).not.toBeVisible();
  });

});
