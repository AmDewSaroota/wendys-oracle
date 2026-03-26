const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// ============================================================
// Volunteer Lock & TVOC Logic Tests
// ============================================================
// Core decision logic extracted from volunteer.html for testing.
// The actual functions live in HTML; these mirror their logic.

const LOCK_STALE_MS = 3 * 60 * 1000; // 3 minutes

// -- Extracted from checkDeviceLock (volunteer.html ~L602-637) --
function checkDeviceLockLogic({ data, error }, browserId) {
  if (error) {
    return { blocked: true, resumed: false, reason: 'query_error' };
  }
  if (!data || data.length === 0) {
    return { blocked: false, resumed: false };
  }
  const entry = data[0];
  const age = Date.now() - new Date(entry.last_ping_at).getTime();
  if (entry.browser_id === browserId) {
    return { blocked: false, resumed: false, reason: 'same_browser' };
  }
  if (age < LOCK_STALE_MS) {
    return { blocked: true, resumed: false, reason: 'active_lock' };
  }
  return { blocked: false, resumed: true, reason: 'stale_takeover' };
}

// -- Extracted from TVOC answer restore (volunteer.html ~L577-587) --
function restoreTvocAnswer(houseId, storageGet, nowMs) {
  try {
    const thaiDate = new Date(nowMs + 7 * 3600000).toISOString().split('T')[0];
    const todayKey = 'tvoc_answered_' + houseId + '_' + thaiDate;
    const saved = storageGet(todayKey);
    if (saved !== null) {
      return { answered: true, enabled: saved === '1' };
    }
  } catch (e) {}
  return { answered: false, enabled: false };
}

// -- Extracted from answerTvoc save (volunteer.html ~L1222-1226) --
function saveTvocAnswer(houseId, yes, storageSet, nowMs) {
  const thaiDate = new Date(nowMs + 7 * 3600000).toISOString().split('T')[0];
  const todayKey = 'tvoc_answered_' + houseId + '_' + thaiDate;
  storageSet(todayKey, yes ? '1' : '0');
  return todayKey;
}

// -- Extracted from registerLock result handling --
function handleRegisterLockResult({ error }) {
  if (error) return { success: false, warning: true };
  return { success: true, warning: false };
}


// ==================== A. checkDeviceLock — Error Handling ====================
describe('checkDeviceLock: query error → fail closed', () => {
  it('Supabase returns error → blocked (fail closed)', () => {
    const result = checkDeviceLockLogic(
      { data: null, error: { message: 'network timeout' } },
      'my-browser'
    );
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'query_error');
  });

  it('Supabase returns error with empty data → still blocked', () => {
    const result = checkDeviceLockLogic(
      { data: [], error: { message: 'fetch failed' } },
      'my-browser'
    );
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'query_error');
  });

  it('error check takes priority over data check', () => {
    // Even if data has entries, error should block
    const result = checkDeviceLockLogic(
      { data: [{ browser_id: 'other', last_ping_at: new Date().toISOString() }], error: { message: 'partial' } },
      'my-browser'
    );
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'query_error');
  });
});

// ==================== B. checkDeviceLock — Normal Flow ====================
describe('checkDeviceLock: no lock → allow', () => {
  it('no data → not blocked', () => {
    const result = checkDeviceLockLogic({ data: [], error: null }, 'my-browser');
    assert.equal(result.blocked, false);
    assert.equal(result.resumed, false);
  });

  it('null data → not blocked', () => {
    const result = checkDeviceLockLogic({ data: null, error: null }, 'my-browser');
    assert.equal(result.blocked, false);
  });
});

describe('checkDeviceLock: same browser → allow', () => {
  it('same browser_id → not blocked', () => {
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'browser-A', last_ping_at: new Date().toISOString() }],
      error: null,
    }, 'browser-A');
    assert.equal(result.blocked, false);
    assert.equal(result.reason, 'same_browser');
  });
});

describe('checkDeviceLock: active lock → block', () => {
  it('different browser, ping 1 min ago → blocked', () => {
    const oneMinAgo = new Date(Date.now() - 60000).toISOString();
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'phone-browser', last_ping_at: oneMinAgo }],
      error: null,
    }, 'pc-browser');
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'active_lock');
  });

  it('different browser, ping just now → blocked', () => {
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'phone-browser', last_ping_at: new Date().toISOString() }],
      error: null,
    }, 'pc-browser');
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'active_lock');
  });

  it('different browser, ping 2m59s ago → still blocked', () => {
    const almostStale = new Date(Date.now() - (LOCK_STALE_MS - 1000)).toISOString();
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'phone', last_ping_at: almostStale }],
      error: null,
    }, 'pc');
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'active_lock');
  });
});

describe('checkDeviceLock: stale lock → takeover', () => {
  it('different browser, ping 3 min ago → stale takeover', () => {
    const stale = new Date(Date.now() - LOCK_STALE_MS).toISOString();
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'dead-browser', last_ping_at: stale }],
      error: null,
    }, 'new-browser');
    assert.equal(result.blocked, false);
    assert.equal(result.resumed, true);
    assert.equal(result.reason, 'stale_takeover');
  });

  it('different browser, ping 10 min ago → stale takeover', () => {
    const veryStale = new Date(Date.now() - 10 * 60000).toISOString();
    const result = checkDeviceLockLogic({
      data: [{ browser_id: 'old', last_ping_at: veryStale }],
      error: null,
    }, 'new');
    assert.equal(result.blocked, false);
    assert.equal(result.resumed, true);
  });
});

// ==================== C. registerLock — Error Handling ====================
describe('registerLock: error handling', () => {
  it('insert error → warning flag', () => {
    const result = handleRegisterLockResult({ error: { message: 'insert failed' } });
    assert.equal(result.success, false);
    assert.equal(result.warning, true);
  });

  it('no error → success', () => {
    const result = handleRegisterLockResult({ error: null });
    assert.equal(result.success, true);
    assert.equal(result.warning, false);
  });
});

// ==================== D. TVOC Answer — localStorage Persist ====================
describe('TVOC answer: save + restore', () => {
  it('save "yes" → restore enabled=true', () => {
    const store = {};
    const now = Date.parse('2026-03-26T10:00:00Z'); // Thai time 17:00 → date 2026-03-26
    const key = saveTvocAnswer(187, true, (k, v) => { store[k] = v; }, now);
    const result = restoreTvocAnswer(187, (k) => store[k] ?? null, now);
    assert.equal(result.answered, true);
    assert.equal(result.enabled, true);
    assert.equal(key, 'tvoc_answered_187_2026-03-26');
  });

  it('save "no" → restore enabled=false', () => {
    const store = {};
    const now = Date.parse('2026-03-26T10:00:00Z');
    saveTvocAnswer(187, false, (k, v) => { store[k] = v; }, now);
    const result = restoreTvocAnswer(187, (k) => store[k] ?? null, now);
    assert.equal(result.answered, true);
    assert.equal(result.enabled, false);
  });

  it('no saved value → not answered', () => {
    const now = Date.parse('2026-03-26T10:00:00Z');
    const result = restoreTvocAnswer(187, () => null, now);
    assert.equal(result.answered, false);
    assert.equal(result.enabled, false);
  });

  it('different house_id → separate keys', () => {
    const store = {};
    const now = Date.parse('2026-03-26T10:00:00Z');
    saveTvocAnswer(187, true, (k, v) => { store[k] = v; }, now);
    saveTvocAnswer(188, false, (k, v) => { store[k] = v; }, now);
    assert.equal(restoreTvocAnswer(187, (k) => store[k] ?? null, now).enabled, true);
    assert.equal(restoreTvocAnswer(188, (k) => store[k] ?? null, now).enabled, false);
    assert.equal(restoreTvocAnswer(189, (k) => store[k] ?? null, now).answered, false);
  });
});

// ==================== E. TVOC Answer — Thai Date Boundary ====================
describe('TVOC answer: Thai date key (UTC+7)', () => {
  it('UTC 16:59 (Thai 23:59) → same Thai day', () => {
    const store = {};
    const utc1659 = Date.parse('2026-03-26T16:59:00Z');
    const key = saveTvocAnswer(187, true, (k, v) => { store[k] = v; }, utc1659);
    assert.equal(key, 'tvoc_answered_187_2026-03-26');
  });

  it('UTC 17:00 (Thai 00:00 next day) → next Thai day', () => {
    const store = {};
    const utc1700 = Date.parse('2026-03-26T17:00:00Z');
    const key = saveTvocAnswer(187, true, (k, v) => { store[k] = v; }, utc1700);
    assert.equal(key, 'tvoc_answered_187_2026-03-27');
  });

  it('answer saved yesterday → not found today (daily reset)', () => {
    const store = {};
    const yesterday = Date.parse('2026-03-25T10:00:00Z');
    const today = Date.parse('2026-03-26T10:00:00Z');
    saveTvocAnswer(187, true, (k, v) => { store[k] = v; }, yesterday);
    // Restore today — different date key → not found
    const result = restoreTvocAnswer(187, (k) => store[k] ?? null, today);
    assert.equal(result.answered, false);
  });

  it('answer saved today → found on same Thai day', () => {
    const store = {};
    const morning = Date.parse('2026-03-26T02:00:00Z'); // Thai 09:00
    const evening = Date.parse('2026-03-26T12:00:00Z'); // Thai 19:00
    saveTvocAnswer(187, false, (k, v) => { store[k] = v; }, morning);
    const result = restoreTvocAnswer(187, (k) => store[k] ?? null, evening);
    assert.equal(result.answered, true);
    assert.equal(result.enabled, false);
  });
});

// ==================== F. TVOC Answer — localStorage Error Resilience ====================
describe('TVOC answer: localStorage error resilience', () => {
  it('storageGet throws → graceful fallback (not answered)', () => {
    const now = Date.parse('2026-03-26T10:00:00Z');
    const result = restoreTvocAnswer(187, () => { throw new Error('SecurityError'); }, now);
    assert.equal(result.answered, false);
    assert.equal(result.enabled, false);
  });
});

// ==================== G. Real Scenario: Phone vs PC Lock ====================
describe('real scenario: phone vs PC lock (field test bug)', () => {
  it('PC locks house 009 → phone query fails → phone blocked (fail closed)', () => {
    // Before fix: phone would get { blocked: false } on error
    // After fix: phone gets { blocked: true }
    const result = checkDeviceLockLogic(
      { data: null, error: { message: 'Failed to fetch' } },
      'phone-browser-id'
    );
    assert.equal(result.blocked, true, 'Phone MUST be blocked when query fails');
  });

  it('PC locks house 009 → phone query succeeds → phone blocked by active lock', () => {
    const result = checkDeviceLockLogic({
      data: [{
        browser_id: 'pc-browser-9fb97478',
        last_ping_at: new Date(Date.now() - 30000).toISOString(), // 30s ago
      }],
      error: null,
    }, 'phone-browser-abc123');
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'active_lock');
  });

  it('phone locks house 009 → PC query succeeds → PC blocked by active lock', () => {
    const result = checkDeviceLockLogic({
      data: [{
        browser_id: 'phone-browser-abc123',
        last_ping_at: new Date(Date.now() - 45000).toISOString(), // 45s ago
      }],
      error: null,
    }, 'pc-browser-9fb97478');
    assert.equal(result.blocked, true);
    assert.equal(result.reason, 'active_lock');
  });

  it('phone lock stale (3+ min) → PC can take over', () => {
    const result = checkDeviceLockLogic({
      data: [{
        browser_id: 'phone-browser-abc123',
        last_ping_at: new Date(Date.now() - 4 * 60000).toISOString(), // 4 min ago
      }],
      error: null,
    }, 'pc-browser-9fb97478');
    assert.equal(result.blocked, false);
    assert.equal(result.resumed, true);
  });
});
