# Lesson: Field UX Must Communicate System State + Sensor Hardware Literacy

**Date**: 2026-03-31
**Source**: rrr: wendys-oracle
**Tags**: #ecostove #ux #field-testing #sensors #tuya

## Pattern

When IoT systems have schedule-based restrictions (rest days, quiet hours, maintenance windows), the user-facing interface MUST communicate this BEFORE users invest time traveling to field locations with equipment.

Similarly, when selecting IoT hardware, marketing claims (especially "laser" vs "infrared") cannot be trusted at face value — direct testing against a known-good reference sensor is the only reliable verification.

## Evidence

1. DewS drove to field test location on Saturday with 3 sensors. System was silently idle because `active_days = "1,2,3,4,5"`. No warning on volunteer page.
2. Multiple Shopee/Lazada sellers claim "laser" in product descriptions but admit infrared when asked directly.
3. MT15 vs MT29: identical form factor, completely different PM2.5 sensor technology (laser vs infrared).

## Lesson

- **Field UX**: Any restriction that could waste a volunteer's time MUST be surfaced immediately on page load, not discovered after setup.
- **Sensor selection**: Always buy 1 unit first. Test against a reference instrument (SNDWAY). Check for physical indicators (fan, response speed, sensitivity spec).
- **API quota**: Understand the FULL call tree, not just the cron frequency. 1 cron ≠ 1 API call.

## Applied

- Added `checkRestDay()` to volunteer.html — shows warning and blocks session on rest days/quiet hours.
- Educated DewS on laser vs IR identification (fan, sensitivity, response speed).
