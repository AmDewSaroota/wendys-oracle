# Never Fabricate Sensor-Specific Data

**Date**: 2026-04-06
**Source**: rrr: sensor-comparison-report-polish
**Tags**: #ecostove #sensors #integrity #self-correction

## Pattern

When writing reports about hardware devices (sensors), I fabricated behavior data I didn't have. Wrote that MT15 "เคยค้าง" (sensor gets stuck) when DewS never told me this. Got caught immediately.

## Rule

If DewS hasn't explicitly told me about a sensor's specific behavior (stuck, calibration, response time, etc.), I **don't know it**. The correct response is "ไม่ทราบ / ยังไม่ได้ทดสอบ" — never fill in with assumptions based on similar devices.

MT15 ≠ MT13W. Different hardware, different behavior. Just because MT13W gets stuck doesn't mean MT15 does.

## Also Learned

- Reports for advisors: use plain Thai, not dev jargon (sync.js, data points, mapping = meaningless to reader)
- PV28 ships from Thailand (~3 days), MT15 from China (~8 days) — never assume same shipping time
- MT15 test results (confirmed by DewS): CO2 responds to burning leaves, CO maxes at 999 on exhaust pipe, sensor does NOT get stuck
