# Unified Helpers Over Copy-Paste Variants

**Date**: 2026-03-20
**Source**: EcoStove dashboard — `updateResearchStats()` rewrite
**Confidence**: High (verified in production)

## Pattern

When multiple UI elements follow the same logic but with different data, create a single helper function instead of separate rendering paths.

## Example

### Before (3 separate paths, ~100 lines)
- Primary fields (PM2.5, PM10, CO2, AQI) — eco vs old comparison with % change
- Secondary fields (Temp, Humidity, HCHO) — simple value display, no comparison
- TVOC — separate eco vs old comparison with special decimal formatting

### After (1 helper, ~50 lines)
```javascript
function renderStat(id, ecoAvg, oldAvg, unit, dec) {
    // Single function handles all comparison logic
}
renderStat('pm25', avg(ecoData, 'pm25_value'), avg(oldData, 'pm25_value'), 'µg/m³', 1);
renderStat('co', avg(ecoData.filter(...), 'co_value'), avg(oldData.filter(...), 'co_value'), 'ppm', 1);
```

## Why It Works

- Adding a new pollutant (CO) = 1 line instead of 30
- Bug fixes apply to all cards at once
- Decimal precision is a parameter, not hardcoded per field
- The `dec` parameter elegantly handles TVOC's 3 decimal places vs PM2.5's 1

## Related

- Same principle applies to `chartConfigs` array in `updateSensorCharts()` — config-driven chart creation
- Dynamic canvas creation in drilldown follows the same pattern

## Tags
`ui`, `refactoring`, `dashboard`, `ecostove`, `code-quality`
