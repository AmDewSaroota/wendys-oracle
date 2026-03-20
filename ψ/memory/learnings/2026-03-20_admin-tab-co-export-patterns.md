# Lesson: Admin Tab Patterns — CO Dual-Source + Export Consistency

**Date**: 2026-03-20
**Source**: rrr: wendys-oracle
**Tags**: ecostove, admin, export, co-sensor, ui-pattern

## Pattern

When a data field comes from multiple sources (automatic sensor + manual input), both sources should be visible in their respective tables. Don't hide sensor CO just because it's often null — showing "-" is informative (tells the user the sensor didn't detect it at that concentration).

## Export Consistency

All export buttons should follow the same pattern:
1. Show date range modal with quick buttons (today, 7d, 30d, all)
2. Offer both Excel and CSV formats
3. Log the export action to admin_activity_logs
4. Use consistent file naming: `biomass_stove_{type}_{daterange}.{ext}`

## Mock Data Strategy

When real data is too messy for UI finalization, switching entirely to generated mock data is the right call. The mock data generator should create the complete data chain: subjects → projects → volunteers → sensors → devices → sessions → logs → summaries.

## i18n Sync Rule

When renaming UI text, always update BOTH:
1. The HTML default text (what shows before JS runs)
2. The i18n dictionary entry (what JS applies)

If they're out of sync, the UI flickers between old and new text on language switch.
