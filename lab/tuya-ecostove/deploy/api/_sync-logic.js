/**
 * sync-logic.js — Pure business logic extracted from sync.js
 * No I/O, no DB, no Tuya API — testable offline
 */

// ===== Constants =====
const SESSION_MAX_MINUTES = 130;
const SESSION_COOLDOWN_MINUTES = 300;
const MAX_SESSIONS_PER_DAY = 2;
const BASELINE_MINUTES = 10;
const MONTHLY_API_LIMIT = 24000;
const MIN_COMPLETE_READINGS = 24;

// ===== Thai Timezone =====
function getThaiDate(now) {
  const d = new Date((now || new Date()).getTime() + 7 * 3600000);
  return d.toISOString().slice(0, 10);
}

function getThaiHHMM(now) {
  const d = new Date((now || new Date()).getTime() + 7 * 3600000);
  return d.toISOString().slice(11, 16);
}

function getMonthKey(now) {
  return getThaiDate(now).slice(0, 7);
}

// ===== Schedule Checks =====
function isInQuietHours(hhmm, start, end) {
  if (!start || !end) return false;
  if (start <= end) {
    return hhmm >= start && hhmm < end;
  }
  // Wraparound (e.g. 22:00-04:00)
  return hhmm >= start || hhmm < end;
}

function isActiveDay(jsDay, activeDaysStr) {
  if (!activeDaysStr) return true;
  const isoDay = jsDay === 0 ? 7 : jsDay;
  const activeDays = activeDaysStr.split(',').map(d => parseInt(d.trim(), 10));
  return activeDays.includes(isoDay);
}

function isHoliday(todayStr, holidays) {
  if (!holidays || holidays.length === 0) return null;
  return holidays.find(h => h.holiday_date === todayStr) || null;
}

function shouldSkipSync(config, holidays, now) {
  // 'now' is a UTC Date — getThaiHHMM/getThaiDate add +7 internally
  const thaiShifted = new Date((now || new Date()).getTime() + 7 * 3600000);
  const hhmm = thaiShifted.toISOString().slice(11, 16);
  const todayStr = thaiShifted.toISOString().slice(0, 10);

  // 1. Quiet hours
  if (config && config.quiet_hours_enabled) {
    if (isInQuietHours(hhmm, config.quiet_hours_start, config.quiet_hours_end)) {
      return { reason: 'quiet_hours', detail: config.quiet_hours_start + '-' + config.quiet_hours_end };
    }
  }

  // 2. Day-of-week (reuse thaiShifted — no double-offset)
  if (config && config.active_days) {
    const jsDay = thaiShifted.getUTCDay();
    if (!isActiveDay(jsDay, config.active_days)) {
      return { reason: 'rest_day', detail: jsDay };
    }
  }

  // 3. Holiday
  if (holidays && holidays.length > 0) {
    const holiday = isHoliday(todayStr, holidays);
    if (holiday) {
      return { reason: 'holiday', detail: holiday.reason || todayStr };
    }
  }

  return null; // proceed with sync
}

// ===== Session Timing =====
function getSessionAge(startedAt, now) {
  return (now.getTime() - new Date(startedAt).getTime()) / 60000;
}

function shouldCloseSession(sessionAge) {
  return sessionAge >= SESSION_MAX_MINUTES;
}

function shouldTransitionBaseline(status, sessionAge) {
  return status === 'baseline' && sessionAge >= BASELINE_MINUTES;
}

// ===== Cooldown =====
function isCooldownActive(lastEndedAt, now) {
  if (!lastEndedAt) return { active: false, minutesLeft: 0 };
  const sinceEnded = (now.getTime() - new Date(lastEndedAt).getTime()) / 60000;
  if (sinceEnded < SESSION_COOLDOWN_MINUTES) {
    return { active: true, minutesLeft: Math.round(SESSION_COOLDOWN_MINUTES - sinceEnded) };
  }
  return { active: false, minutesLeft: 0 };
}

// ===== Daily Limit =====
function isDailyLimitReached(countToday) {
  return countToday >= MAX_SESSIONS_PER_DAY;
}

// ===== Baseline & Adjusted Averages =====
function computeBaselineAvg(logs, field) {
  const vals = logs.map(r => r[field]).filter(v => v != null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function computeAdjustedAvg(rawAvg, baselineAvg) {
  if (rawAvg == null) return null;
  if (baselineAvg == null) return null;
  return Math.max(0, rawAvg - baselineAvg);
}

// ===== Session Complete =====
function isSessionComplete(readingsCount) {
  return readingsCount >= MIN_COMPLETE_READINGS;
}

// ===== Monthly Quota =====
function isQuotaExceeded(tuyaCalls) {
  return tuyaCalls >= MONTHLY_API_LIMIT;
}

// ===== Collection Periods (stove_type resolution) =====

/**
 * Check if a collection period is active on a given date.
 * Active = starts_at <= today AND (ends_at is null OR ends_at >= today)
 * @param {Object} period - { starts_at, ends_at }
 * @param {string} today - 'YYYY-MM-DD'
 * @returns {boolean}
 */
function isCollectionPeriodActive(period, today) {
  if (!period || !period.starts_at) return false;
  if (period.starts_at > today) return false; // future period
  if (period.ends_at == null) return true; // open-ended
  return period.ends_at >= today;
}

/**
 * Build subject_id → stove_type map from a list of periods.
 * Periods should be pre-sorted by starts_at desc (latest first wins).
 * Only active periods (for today) are included.
 * @param {Array} periods - [{ subject_id, stove_type, starts_at, ends_at }]
 * @param {string} today - 'YYYY-MM-DD'
 * @returns {Object} { subject_id: stove_type }
 */
function buildPeriodMap(periods, today) {
  const map = {};
  if (!periods || !Array.isArray(periods)) return map;
  for (const p of periods) {
    if (!isCollectionPeriodActive(p, today)) continue;
    // First active period per subject wins (sorted desc = latest first)
    if (!map[p.subject_id]) {
      map[p.subject_id] = p.stove_type;
    }
  }
  return map;
}

/**
 * Build the final SENSORS array from DB data.
 * Matches the logic in loadSensors() of sync.js.
 * @param {Array} sensors - [{ tuya_device_id, name }]
 * @param {Object} deviceMap - { tuya_device_id: subject_id }
 * @param {Object} projectMap - { subject_id: project_id }
 * @param {Object} periodMap - { subject_id: stove_type }
 * @returns {Array} [{ id, name, stoveType, houseId, projectId }]
 */
function buildSensorList(sensors, deviceMap, projectMap, periodMap) {
  if (!sensors || !Array.isArray(sensors)) return [];
  return sensors.map(s => {
    const houseId = (deviceMap && deviceMap[s.tuya_device_id]) || null;
    const resolvedStoveType = (houseId && periodMap && periodMap[houseId])
      ? periodMap[houseId]
      : null;
    return {
      id: s.tuya_device_id,
      name: s.name,
      stoveType: resolvedStoveType,
      houseId,
      projectId: houseId ? ((projectMap && projectMap[houseId]) || null) : null,
    };
  });
}

// ===== Dedup Check =====
const DEDUP_GAP_MINUTES = 4.5;

/**
 * Check if a new data insert should be skipped (duplicate).
 * @param {string|null} lastRecordedAt - ISO timestamp of last log
 * @param {Date} now - current time
 * @param {number} [gapMinutes] - minimum gap between inserts (default 4.5)
 * @returns {{ dedup: boolean, gapMinutes: number }}
 */
function isDedupActive(lastRecordedAt, now, gapMinutes) {
  const gap = gapMinutes != null ? gapMinutes : DEDUP_GAP_MINUTES;
  if (!lastRecordedAt) return { dedup: false, gapMinutes: Infinity };
  const elapsed = ((now || new Date()).getTime() - new Date(lastRecordedAt).getTime()) / 60000;
  return { dedup: elapsed < gap, gapMinutes: Math.round(elapsed * 10) / 10 };
}

// ===== Stall Detection (Volunteer Page) =====
const STALL_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if sensor data collection has stalled.
 * @param {number} currentCount - current readings count
 * @param {number} lastCount - previous readings count (-1 = first check)
 * @param {number} stallSince - timestamp when count stopped increasing
 * @param {number} now - current timestamp (ms)
 * @param {number} [thresholdMs] - stall threshold (default 15 min)
 * @returns {{ stalled: boolean, shouldAlert: boolean, newStallSince: number, newLastCount: number }}
 */
function checkDataStall(currentCount, lastCount, stallSince, now, thresholdMs) {
  const threshold = thresholdMs != null ? thresholdMs : STALL_THRESHOLD_MS;
  if (currentCount !== lastCount) {
    // Count changed — reset stall tracking
    return { stalled: false, shouldAlert: false, newStallSince: now, newLastCount: currentCount };
  }
  // Count unchanged
  if (lastCount <= 0) {
    // No data yet — not a stall (sensor might not have started)
    return { stalled: false, shouldAlert: false, newStallSince: stallSince || now, newLastCount: lastCount };
  }
  const elapsed = now - (stallSince || now);
  const stalled = elapsed >= threshold;
  return { stalled, shouldAlert: stalled, newStallSince: stallSince || now, newLastCount: lastCount };
}

// ===== Device Online Check =====
/**
 * Resolve device online status from Tuya device info.
 * @param {Object|null} deviceInfo - Tuya device info object with .online property
 * @returns {boolean}
 */
function resolveDeviceOnline(deviceInfo) {
  return !!(deviceInfo && deviceInfo.online);
}

// ===== Session Action Resolver =====
/**
 * Determine what action to take for a sensor based on its state.
 * Pure logic version of manageSession's decision tree.
 * @param {Object} params
 * @returns {string} action name
 */
function resolveSessionAction({ hasActiveSession, sessionAge, isOnline, completedToday, cooldownMinutesLeft, isOvertime }) {
  if (hasActiveSession) {
    if (isOvertime) return 'auto-cutoff';
    if (!isOnline) return 'device-offline';
    return 'continue';
  }
  // No active session
  if (completedToday >= MAX_SESSIONS_PER_DAY) return 'daily-limit';
  if (cooldownMinutesLeft > 0) return 'cooldown';
  if (!isOnline) return 'device-offline';
  return 'new-session';
}

module.exports = {
  // Constants
  SESSION_MAX_MINUTES,
  SESSION_COOLDOWN_MINUTES,
  MAX_SESSIONS_PER_DAY,
  BASELINE_MINUTES,
  MONTHLY_API_LIMIT,
  MIN_COMPLETE_READINGS,
  DEDUP_GAP_MINUTES,
  STALL_THRESHOLD_MS,
  // Functions
  getThaiDate,
  getThaiHHMM,
  getMonthKey,
  isInQuietHours,
  isActiveDay,
  isHoliday,
  shouldSkipSync,
  getSessionAge,
  shouldCloseSession,
  shouldTransitionBaseline,
  isCooldownActive,
  isDailyLimitReached,
  computeBaselineAvg,
  computeAdjustedAvg,
  isSessionComplete,
  isQuotaExceeded,
  isCollectionPeriodActive,
  buildPeriodMap,
  buildSensorList,
  isDedupActive,
  checkDataStall,
  resolveDeviceOnline,
  resolveSessionAction,
};
