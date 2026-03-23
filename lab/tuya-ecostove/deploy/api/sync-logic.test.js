const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  getThaiDate, getThaiHHMM, getMonthKey,
  isInQuietHours, isActiveDay, isHoliday, shouldSkipSync,
  getSessionAge, shouldCloseSession, shouldTransitionBaseline,
  isCooldownActive, isDailyLimitReached,
  computeBaselineAvg, computeAdjustedAvg,
  isSessionComplete, isQuotaExceeded,
  isCollectionPeriodActive, buildPeriodMap, buildSensorList,
  SESSION_MAX_MINUTES, SESSION_COOLDOWN_MINUTES, MAX_SESSIONS_PER_DAY,
  BASELINE_MINUTES, MONTHLY_API_LIMIT, MIN_COMPLETE_READINGS,
} = require('./sync-logic.js');

// Helper: create UTC date
const utc = (str) => new Date(str + 'Z');

// ==================== A. Thai Timezone ====================
describe('getThaiDate', () => {
  it('UTC 17:00 → Thai midnight (next day)', () => {
    assert.equal(getThaiDate(utc('2026-03-20T17:00:00')), '2026-03-21');
  });
  it('UTC 16:59 → still same Thai day', () => {
    assert.equal(getThaiDate(utc('2026-03-20T16:59:59')), '2026-03-20');
  });
  it('UTC 00:00 → Thai 07:00 same day', () => {
    assert.equal(getThaiDate(utc('2026-03-21T00:00:00')), '2026-03-21');
  });
  it('New Year boundary: UTC 2026-12-31 17:00 → Thai 2027-01-01', () => {
    assert.equal(getThaiDate(utc('2026-12-31T17:00:00')), '2027-01-01');
  });
});

describe('getThaiHHMM', () => {
  it('UTC 17:00 → Thai 00:00', () => {
    assert.equal(getThaiHHMM(utc('2026-03-20T17:00:00')), '00:00');
  });
  it('UTC 23:00 → Thai 06:00', () => {
    assert.equal(getThaiHHMM(utc('2026-03-20T23:00:00')), '06:00');
  });
  it('UTC 05:30 → Thai 12:30', () => {
    assert.equal(getThaiHHMM(utc('2026-03-20T05:30:00')), '12:30');
  });
});

describe('getMonthKey', () => {
  it('returns YYYY-MM in Thai time', () => {
    assert.equal(getMonthKey(utc('2026-03-20T10:00:00')), '2026-03');
  });
  it('month boundary: UTC Dec 31 17:00 → Thai Jan', () => {
    assert.equal(getMonthKey(utc('2026-12-31T17:00:00')), '2027-01');
  });
});

// ==================== B. Quiet Hours ====================
describe('isInQuietHours', () => {
  describe('normal range 00:00-06:00', () => {
    it('03:00 → in quiet', () => {
      assert.equal(isInQuietHours('03:00', '00:00', '06:00'), true);
    });
    it('00:00 (exact start) → in quiet', () => {
      assert.equal(isInQuietHours('00:00', '00:00', '06:00'), true);
    });
    it('06:00 (exact end) → NOT in quiet', () => {
      assert.equal(isInQuietHours('06:00', '00:00', '06:00'), false);
    });
    it('05:59 → in quiet', () => {
      assert.equal(isInQuietHours('05:59', '00:00', '06:00'), true);
    });
    it('23:00 → NOT in quiet', () => {
      assert.equal(isInQuietHours('23:00', '00:00', '06:00'), false);
    });
    it('12:00 → NOT in quiet', () => {
      assert.equal(isInQuietHours('12:00', '00:00', '06:00'), false);
    });
  });

  describe('wraparound range 22:00-04:00', () => {
    it('23:00 → in quiet', () => {
      assert.equal(isInQuietHours('23:00', '22:00', '04:00'), true);
    });
    it('22:00 (exact start) → in quiet', () => {
      assert.equal(isInQuietHours('22:00', '22:00', '04:00'), true);
    });
    it('03:00 → in quiet', () => {
      assert.equal(isInQuietHours('03:00', '22:00', '04:00'), true);
    });
    it('03:59 → in quiet', () => {
      assert.equal(isInQuietHours('03:59', '22:00', '04:00'), true);
    });
    it('04:00 (exact end) → NOT in quiet', () => {
      assert.equal(isInQuietHours('04:00', '22:00', '04:00'), false);
    });
    it('21:59 → NOT in quiet', () => {
      assert.equal(isInQuietHours('21:59', '22:00', '04:00'), false);
    });
    it('12:00 → NOT in quiet', () => {
      assert.equal(isInQuietHours('12:00', '22:00', '04:00'), false);
    });
  });

  describe('edge cases', () => {
    it('null start/end → false', () => {
      assert.equal(isInQuietHours('03:00', null, null), false);
    });
  });
});

// ==================== C. Active Days ====================
describe('isActiveDay', () => {
  it('Monday (jsDay=1) with Mon-Fri → active', () => {
    assert.equal(isActiveDay(1, '1,2,3,4,5'), true);
  });
  it('Saturday (jsDay=6) with Mon-Fri → NOT active', () => {
    assert.equal(isActiveDay(6, '1,2,3,4,5'), false);
  });
  it('Sunday (jsDay=0) → ISO day 7, with Mon-Fri → NOT active', () => {
    assert.equal(isActiveDay(0, '1,2,3,4,5'), false);
  });
  it('Sunday (jsDay=0) → ISO day 7, with all days → active', () => {
    assert.equal(isActiveDay(0, '1,2,3,4,5,6,7'), true);
  });
  it('Saturday (jsDay=6) with weekend only → active', () => {
    assert.equal(isActiveDay(6, '6,7'), true);
  });
  it('Monday (jsDay=1) with weekend only → NOT active', () => {
    assert.equal(isActiveDay(1, '6,7'), false);
  });
  it('null activeDays → always active (fail-open)', () => {
    assert.equal(isActiveDay(6, null), true);
  });
  it('spaces in config handled', () => {
    assert.equal(isActiveDay(1, '1, 2, 3'), true);
    assert.equal(isActiveDay(4, '1, 2, 3'), false);
  });
});

// ==================== D. Holidays ====================
describe('isHoliday', () => {
  const holidays = [
    { holiday_date: '2026-04-13', reason: 'สงกรานต์' },
    { holiday_date: '2026-04-14', reason: 'สงกรานต์' },
    { holiday_date: '2026-04-15', reason: 'สงกรานต์' },
  ];

  it('match: returns holiday object', () => {
    const result = isHoliday('2026-04-13', holidays);
    assert.equal(result.reason, 'สงกรานต์');
  });
  it('no match: returns null', () => {
    assert.equal(isHoliday('2026-04-16', holidays), null);
  });
  it('empty holidays → null', () => {
    assert.equal(isHoliday('2026-04-13', []), null);
  });
  it('null holidays → null', () => {
    assert.equal(isHoliday('2026-04-13', null), null);
  });
});

// ==================== E. Combined Schedule ====================
describe('shouldSkipSync', () => {
  const config = {
    quiet_hours_enabled: true,
    quiet_hours_start: '00:00',
    quiet_hours_end: '06:00',
    active_days: '1,2,3,4,5',
  };
  const holidays = [{ holiday_date: '2026-04-13', reason: 'สงกรานต์' }];

  it('quiet hours → skip with reason', () => {
    // UTC 20:00 = Thai 03:00 (in quiet 00:00-06:00)
    const result = shouldSkipSync(config, [], utc('2026-03-20T20:00:00'));
    assert.equal(result.reason, 'quiet_hours');
  });
  it('rest day (Saturday) → skip', () => {
    // 2026-03-21 is Saturday, UTC 10:00 = Thai 17:00 (not quiet hours)
    const result = shouldSkipSync(config, [], utc('2026-03-21T10:00:00'));
    assert.equal(result.reason, 'rest_day');
  });
  it('holiday → skip', () => {
    // 2026-04-13 is Monday, UTC 10:00 = Thai 17:00
    const result = shouldSkipSync(
      { ...config, quiet_hours_enabled: false },
      holidays,
      utc('2026-04-13T10:00:00')
    );
    assert.equal(result.reason, 'holiday');
  });
  it('all pass → null (proceed)', () => {
    // 2026-03-20 is Friday, UTC 10:00 = Thai 17:00
    const result = shouldSkipSync(config, [], utc('2026-03-20T10:00:00'));
    assert.equal(result, null);
  });
  it('priority: quiet hours checked before rest day', () => {
    // Saturday + in quiet hours → should return quiet_hours (not rest_day)
    const result = shouldSkipSync(config, [], utc('2026-03-21T20:00:00'));
    assert.equal(result.reason, 'quiet_hours');
  });
  it('null config → proceed (fail-open)', () => {
    const result = shouldSkipSync(null, [], utc('2026-03-20T20:00:00'));
    assert.equal(result, null);
  });
  it('quiet disabled → skip check', () => {
    const disabledConfig = { ...config, quiet_hours_enabled: false };
    // UTC 19:00 Mar 19 = Thai 02:00 Mar 20 (Friday) — quiet disabled → check day-of-week → Friday is active → null
    const result = shouldSkipSync(disabledConfig, [], utc('2026-03-19T19:00:00'));
    assert.equal(result, null);
  });
});

// ==================== F. Session Timing ====================
describe('getSessionAge', () => {
  it('0 minutes', () => {
    const now = new Date('2026-03-20T10:00:00Z');
    assert.equal(getSessionAge('2026-03-20T10:00:00Z', now), 0);
  });
  it('10 minutes', () => {
    const now = new Date('2026-03-20T10:10:00Z');
    assert.equal(getSessionAge('2026-03-20T10:00:00Z', now), 10);
  });
  it('130 minutes', () => {
    const now = new Date('2026-03-20T12:10:00Z');
    assert.equal(getSessionAge('2026-03-20T10:00:00Z', now), 130);
  });
});

describe('shouldCloseSession', () => {
  it('129 min → false', () => assert.equal(shouldCloseSession(129), false));
  it('129.9 min → false', () => assert.equal(shouldCloseSession(129.9), false));
  it('130 min → true', () => assert.equal(shouldCloseSession(130), true));
  it('131 min → true', () => assert.equal(shouldCloseSession(131), true));
  it('200 min → true', () => assert.equal(shouldCloseSession(200), true));
  it('0 min → false', () => assert.equal(shouldCloseSession(0), false));
});

describe('shouldTransitionBaseline', () => {
  it('baseline + 9 min → false', () => {
    assert.equal(shouldTransitionBaseline('baseline', 9), false);
  });
  it('baseline + 9.9 min → false', () => {
    assert.equal(shouldTransitionBaseline('baseline', 9.9), false);
  });
  it('baseline + 10 min → true', () => {
    assert.equal(shouldTransitionBaseline('baseline', 10), true);
  });
  it('baseline + 15 min → true', () => {
    assert.equal(shouldTransitionBaseline('baseline', 15), true);
  });
  it('collecting + 15 min → false (already transitioned)', () => {
    assert.equal(shouldTransitionBaseline('collecting', 15), false);
  });
  it('complete + 10 min → false', () => {
    assert.equal(shouldTransitionBaseline('complete', 10), false);
  });
});

// ==================== G. Cooldown ====================
describe('isCooldownActive', () => {
  it('ended just now → active, 300 min left', () => {
    const now = new Date('2026-03-20T10:00:00Z');
    const result = isCooldownActive('2026-03-20T10:00:00Z', now);
    assert.equal(result.active, true);
    assert.equal(result.minutesLeft, 300);
  });
  it('ended 150 min ago → active, 150 min left', () => {
    const now = new Date('2026-03-20T12:30:00Z');
    const result = isCooldownActive('2026-03-20T10:00:00Z', now);
    assert.equal(result.active, true);
    assert.equal(result.minutesLeft, 150);
  });
  it('ended 299 min ago → active, 1 min left', () => {
    const now = new Date('2026-03-20T14:59:00Z');
    const result = isCooldownActive('2026-03-20T10:00:00Z', now);
    assert.equal(result.active, true);
    assert.equal(result.minutesLeft, 1);
  });
  it('ended 300 min ago → NOT active', () => {
    const now = new Date('2026-03-20T15:00:00Z');
    const result = isCooldownActive('2026-03-20T10:00:00Z', now);
    assert.equal(result.active, false);
  });
  it('ended 301 min ago → NOT active', () => {
    const now = new Date('2026-03-20T15:01:00Z');
    const result = isCooldownActive('2026-03-20T10:00:00Z', now);
    assert.equal(result.active, false);
  });
  it('null endedAt → NOT active', () => {
    const result = isCooldownActive(null, new Date());
    assert.equal(result.active, false);
  });
});

// ==================== H. Daily Limit ====================
describe('isDailyLimitReached', () => {
  it('0 sessions → false', () => assert.equal(isDailyLimitReached(0), false));
  it('1 session → false', () => assert.equal(isDailyLimitReached(1), false));
  it('2 sessions → true', () => assert.equal(isDailyLimitReached(2), true));
  it('3 sessions → true', () => assert.equal(isDailyLimitReached(3), true));
});

// ==================== I. Baseline Average ====================
describe('computeBaselineAvg', () => {
  it('normal: [10, 20, 30] → 20', () => {
    const logs = [{ pm25_value: 10 }, { pm25_value: 20 }, { pm25_value: 30 }];
    assert.equal(computeBaselineAvg(logs, 'pm25_value'), 20);
  });
  it('single value: [50] → 50', () => {
    assert.equal(computeBaselineAvg([{ pm25_value: 50 }], 'pm25_value'), 50);
  });
  it('empty array → null', () => {
    assert.equal(computeBaselineAvg([], 'pm25_value'), null);
  });
  it('all nulls → null', () => {
    const logs = [{ pm25_value: null }, { pm25_value: null }];
    assert.equal(computeBaselineAvg(logs, 'pm25_value'), null);
  });
  it('mixed null: filters out nulls', () => {
    const logs = [{ pm25_value: 10 }, { pm25_value: null }, { pm25_value: 30 }];
    assert.equal(computeBaselineAvg(logs, 'pm25_value'), 20);
  });
  it('different field: co2_value', () => {
    const logs = [{ co2_value: 400 }, { co2_value: 600 }];
    assert.equal(computeBaselineAvg(logs, 'co2_value'), 500);
  });
  it('missing field → null', () => {
    const logs = [{ pm25_value: 10 }];
    assert.equal(computeBaselineAvg(logs, 'co2_value'), null);
  });
});

// ==================== J. Adjusted Average ====================
describe('computeAdjustedAvg', () => {
  it('raw 200, baseline 50 → 150', () => {
    assert.equal(computeAdjustedAvg(200, 50), 150);
  });
  it('raw 30, baseline 50 → 0 (no negative)', () => {
    assert.equal(computeAdjustedAvg(30, 50), 0);
  });
  it('raw 100, baseline 100 → 0', () => {
    assert.equal(computeAdjustedAvg(100, 100), 0);
  });
  it('raw null → null', () => {
    assert.equal(computeAdjustedAvg(null, 50), null);
  });
  it('baseline null → null', () => {
    assert.equal(computeAdjustedAvg(100, null), null);
  });
  it('both null → null', () => {
    assert.equal(computeAdjustedAvg(null, null), null);
  });
});

// ==================== K. Session Complete ====================
describe('isSessionComplete', () => {
  it('0 readings → false', () => assert.equal(isSessionComplete(0), false));
  it('23 readings → false', () => assert.equal(isSessionComplete(23), false));
  it('24 readings → true', () => assert.equal(isSessionComplete(24), true));
  it('100 readings → true', () => assert.equal(isSessionComplete(100), true));
});

// ==================== L. Monthly Quota ====================
describe('isQuotaExceeded', () => {
  it('0 → false', () => assert.equal(isQuotaExceeded(0), false));
  it('23999 → false', () => assert.equal(isQuotaExceeded(23999), false));
  it('24000 → true', () => assert.equal(isQuotaExceeded(24000), true));
  it('25000 → true', () => assert.equal(isQuotaExceeded(25000), true));
});

// ==================== M. Constants Sanity ====================
describe('constants', () => {
  it('SESSION_MAX_MINUTES = 130', () => assert.equal(SESSION_MAX_MINUTES, 130));
  it('SESSION_COOLDOWN_MINUTES = 300', () => assert.equal(SESSION_COOLDOWN_MINUTES, 300));
  it('MAX_SESSIONS_PER_DAY = 2', () => assert.equal(MAX_SESSIONS_PER_DAY, 2));
  it('BASELINE_MINUTES = 10', () => assert.equal(BASELINE_MINUTES, 10));
  it('MONTHLY_API_LIMIT = 24000', () => assert.equal(MONTHLY_API_LIMIT, 24000));
  it('MIN_COMPLETE_READINGS = 24', () => assert.equal(MIN_COMPLETE_READINGS, 24));
});

// ==================== N. Collection Period Active Check ====================
describe('isCollectionPeriodActive', () => {
  const today = '2026-03-23';

  describe('basic active/expired/future', () => {
    it('active: starts_at <= today, ends_at >= today', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-03-01', ends_at: '2026-04-30' }, today), true);
    });
    it('active: starts_at = today (first day)', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-03-23', ends_at: '2026-04-30' }, today), true);
    });
    it('active: ends_at = today (last day)', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-03-01', ends_at: '2026-03-23' }, today), true);
    });
    it('expired: ends_at < today', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-02-05', ends_at: '2026-03-06' }, today), false);
    });
    it('future: starts_at > today', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-04-01', ends_at: '2026-05-01' }, today), false);
    });
  });

  describe('open-ended periods (ends_at = null)', () => {
    it('open-ended + started → active', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-03-01', ends_at: null }, today), true);
    });
    it('open-ended + started today → active', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-03-23', ends_at: null }, today), true);
    });
    it('open-ended + future start → NOT active', () => {
      assert.equal(isCollectionPeriodActive({ starts_at: '2026-04-01', ends_at: null }, today), false);
    });
  });

  describe('edge cases', () => {
    it('null period → false', () => {
      assert.equal(isCollectionPeriodActive(null, today), false);
    });
    it('missing starts_at → false', () => {
      assert.equal(isCollectionPeriodActive({ ends_at: '2026-04-30' }, today), false);
    });
    it('empty object → false', () => {
      assert.equal(isCollectionPeriodActive({}, today), false);
    });
  });

  describe('real scenario: DewS test data (2026-03-23)', () => {
    it('MOCK periods expired on 2026-03-06 → NOT active', () => {
      // This is the actual bug DewS found!
      const mockPeriod = { subject_id: 179, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' };
      assert.equal(isCollectionPeriodActive(mockPeriod, '2026-03-23'), false);
    });
    it('new eco period set for UAT → active', () => {
      const ecoPeriod = { subject_id: 179, stove_type: 'eco', starts_at: '2026-03-23', ends_at: '2026-04-30' };
      assert.equal(isCollectionPeriodActive(ecoPeriod, '2026-03-23'), true);
    });
  });
});

// ==================== O. Build Period Map ====================
describe('buildPeriodMap', () => {
  const today = '2026-03-23';

  it('single active period → maps correctly', () => {
    const periods = [
      { subject_id: 101, stove_type: 'eco', starts_at: '2026-03-01', ends_at: '2026-04-30' },
    ];
    const map = buildPeriodMap(periods, today);
    assert.equal(map[101], 'eco');
  });

  it('expired periods → empty map', () => {
    const periods = [
      { subject_id: 179, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' },
      { subject_id: 180, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' },
    ];
    const map = buildPeriodMap(periods, today);
    assert.deepEqual(map, {});
  });

  it('multiple subjects with different stove_types', () => {
    const periods = [
      { subject_id: 101, stove_type: 'eco', starts_at: '2026-03-01', ends_at: '2026-04-30' },
      { subject_id: 102, stove_type: 'old', starts_at: '2026-03-01', ends_at: '2026-04-30' },
      { subject_id: 103, stove_type: 'eco', starts_at: '2026-03-01', ends_at: '2026-04-30' },
    ];
    const map = buildPeriodMap(periods, today);
    assert.equal(map[101], 'eco');
    assert.equal(map[102], 'old');
    assert.equal(map[103], 'eco');
  });

  it('overlapping periods: latest starts_at wins (sorted desc)', () => {
    // Sorted desc → starts_at: 2026-03-20 comes first
    const periods = [
      { subject_id: 101, stove_type: 'eco', starts_at: '2026-03-20', ends_at: '2026-04-30' },
      { subject_id: 101, stove_type: 'old', starts_at: '2026-03-01', ends_at: '2026-04-30' },
    ];
    const map = buildPeriodMap(periods, today);
    assert.equal(map[101], 'eco');  // latest period wins
  });

  it('mixed active and expired: only active counted', () => {
    const periods = [
      { subject_id: 101, stove_type: 'eco', starts_at: '2026-03-20', ends_at: '2026-04-30' },  // active
      { subject_id: 101, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' },   // expired
      { subject_id: 102, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' },   // expired
    ];
    const map = buildPeriodMap(periods, today);
    assert.equal(map[101], 'eco');
    assert.equal(map[102], undefined);  // no active period
  });

  it('open-ended period → active', () => {
    const periods = [
      { subject_id: 101, stove_type: 'eco', starts_at: '2026-03-01', ends_at: null },
    ];
    const map = buildPeriodMap(periods, today);
    assert.equal(map[101], 'eco');
  });

  it('null/empty input → empty map', () => {
    assert.deepEqual(buildPeriodMap(null, today), {});
    assert.deepEqual(buildPeriodMap([], today), {});
    assert.deepEqual(buildPeriodMap(undefined, today), {});
  });

  describe('real scenario: old→eco transition', () => {
    it('house switches from old (expired) to eco (new) → eco', () => {
      // Simulates admin updating collection_period after old phase ends
      const periods = [
        { subject_id: 179, stove_type: 'eco', starts_at: '2026-03-23', ends_at: '2026-04-30' },
        { subject_id: 179, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' },
      ];
      const map = buildPeriodMap(periods, '2026-03-23');
      assert.equal(map[179], 'eco');
    });

    it('10 houses all with expired old periods → all empty', () => {
      // This is what DewS saw: all 10 houses had expired periods
      const periods = [];
      for (let i = 179; i <= 188; i++) {
        periods.push({ subject_id: i, stove_type: 'old', starts_at: '2026-02-05', ends_at: '2026-03-06' });
      }
      const map = buildPeriodMap(periods, '2026-03-23');
      assert.deepEqual(map, {});  // all expired → no stove_type
    });

    it('10 houses: 5 eco + 5 old (both active)', () => {
      const periods = [];
      for (let i = 179; i <= 183; i++) {
        periods.push({ subject_id: i, stove_type: 'eco', starts_at: '2026-03-20', ends_at: '2026-04-30' });
      }
      for (let i = 184; i <= 188; i++) {
        periods.push({ subject_id: i, stove_type: 'old', starts_at: '2026-03-20', ends_at: '2026-04-30' });
      }
      const map = buildPeriodMap(periods, '2026-03-23');
      assert.equal(map[179], 'eco');
      assert.equal(map[183], 'eco');
      assert.equal(map[184], 'old');
      assert.equal(map[188], 'old');
    });
  });
});

// ==================== P. Build Sensor List ====================
describe('buildSensorList', () => {
  const sensors = [
    { tuya_device_id: 'dev-001', name: 'ES-01' },
    { tuya_device_id: 'dev-002', name: 'ES-02' },
    { tuya_device_id: 'dev-003', name: 'ES-03' },
  ];
  const deviceMap = {
    'dev-001': 101,  // house 101
    'dev-002': 102,  // house 102
    // dev-003 not assigned
  };
  const projectMap = { 101: 'proj-A', 102: 'proj-A' };

  it('sensor with active eco period → stoveType = eco', () => {
    const periodMap = { 101: 'eco', 102: 'old' };
    const list = buildSensorList(sensors, deviceMap, projectMap, periodMap);

    assert.equal(list[0].id, 'dev-001');
    assert.equal(list[0].stoveType, 'eco');
    assert.equal(list[0].houseId, 101);
    assert.equal(list[0].projectId, 'proj-A');
  });

  it('sensor with active old period → stoveType = old', () => {
    const periodMap = { 101: 'eco', 102: 'old' };
    const list = buildSensorList(sensors, deviceMap, projectMap, periodMap);

    assert.equal(list[1].id, 'dev-002');
    assert.equal(list[1].stoveType, 'old');
  });

  it('sensor without house assignment → stoveType = null', () => {
    const periodMap = { 101: 'eco' };
    const list = buildSensorList(sensors, deviceMap, projectMap, periodMap);

    assert.equal(list[2].id, 'dev-003');
    assert.equal(list[2].stoveType, null);
    assert.equal(list[2].houseId, null);
    assert.equal(list[2].projectId, null);
  });

  it('sensor assigned to house but no period → stoveType = null', () => {
    const periodMap = {};  // no active periods
    const list = buildSensorList(sensors, deviceMap, projectMap, periodMap);

    assert.equal(list[0].stoveType, null);  // house 101 exists but no period
    assert.equal(list[0].houseId, 101);     // house still assigned
  });

  it('empty sensors → empty list', () => {
    assert.deepEqual(buildSensorList([], {}, {}, {}), []);
  });

  it('null inputs → empty list or safe defaults', () => {
    assert.deepEqual(buildSensorList(null, {}, {}, {}), []);
    const list = buildSensorList(sensors, null, null, null);
    assert.equal(list.length, 3);
    assert.equal(list[0].stoveType, null);
    assert.equal(list[0].houseId, null);
  });

  describe('real scenario: stove_type propagation chain', () => {
    it('full chain: sensor → device → house → period → stoveType', () => {
      // Mimics complete data flow in production
      const realSensors = [
        { tuya_device_id: 'a3d01864e463e3ede0hf0e', name: 'ES-01' },
      ];
      const realDeviceMap = { 'a3d01864e463e3ede0hf0e': 179 };
      const realProjectMap = { 179: 'proj-ecostove' };
      const realPeriodMap = { 179: 'eco' };

      const list = buildSensorList(realSensors, realDeviceMap, realProjectMap, realPeriodMap);
      assert.equal(list[0].stoveType, 'eco');
      assert.equal(list[0].houseId, 179);
      assert.equal(list[0].projectId, 'proj-ecostove');
    });

    it('broken chain: device assigned but period expired → stoveType = null', () => {
      // This is what happened today: device→house OK, but period expired
      const realSensors = [
        { tuya_device_id: 'a3d01864e463e3ede0hf0e', name: 'ES-01' },
      ];
      const realDeviceMap = { 'a3d01864e463e3ede0hf0e': 179 };
      const realProjectMap = { 179: 'proj-ecostove' };
      const realPeriodMap = {};  // no active period!

      const list = buildSensorList(realSensors, realDeviceMap, realProjectMap, realPeriodMap);
      assert.equal(list[0].stoveType, null);  // ← this was the bug
      assert.equal(list[0].houseId, 179);      // house still there
    });
  });
});
