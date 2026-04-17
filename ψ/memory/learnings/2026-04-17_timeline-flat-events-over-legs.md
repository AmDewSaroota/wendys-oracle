# Timeline as Flat Events, Not Data Records

**Date**: 2026-04-17
**Context**: TravPlan trip planner — Journey Map ordering
**Source**: rrr: wendys-oracle

## Pattern

When building a timeline/itinerary view from structured data:
- A single data record (e.g., round-trip flight) can produce **multiple timeline events** at different positions
- The timeline should be a **flat list of events** sorted by user-defined order, not a direct mapping of data records
- Each event needs: reference to source record + part identifier (e.g., `legId + 'outbound'` vs `legId + 'return'`)
- Order values live on the source record but with separate fields per part (`planOrder`, `returnPlanOrder`)

## Also Learned

- Price fields should always have explicit "per unit" vs "total" basis — never assume
- Default to what users naturally enter (usually total, not per-night)
- When items lack date precision (only HH:MM, no dates), manual ordering beats auto-sorting

## Tags

`timeline`, `data-modeling`, `ux`, `trip-planner`, `pricing`
