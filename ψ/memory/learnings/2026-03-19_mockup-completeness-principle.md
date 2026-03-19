# Lesson: Mockup Completeness Principle

**Date**: 2026-03-19
**Context**: EcoStove dashboard mockup — scenario switcher only changed hero, not full page
**Source**: DewS feedback: "ไม่ได้ม้อคทั้งหน้าหรอ"

## Pattern

When building a mockup with interactive state switching (scenarios, tabs, filters), **every visible section must respond to the state change**. A partial mockup is worse than a static one because it creates false expectations — the viewer assumes unchanged sections are correct for the new state, when they're actually showing stale data.

## Rule

**Before delivering a scenario/state mockup, checklist every section:**
- [ ] Hero / header
- [ ] Stat cards (all rows)
- [ ] Charts / visualizations
- [ ] Data tables / readings
- [ ] Badges / status indicators
- [ ] Comparison tables
- [ ] Any section that references the switched state

## Related

- Also applies to: dark mode toggles, language switches, role-based views
- **Removal as design**: Sometimes the best addition is subtraction (baseline toggle → badge + table)
- **Port algorithms, don't reinvent**: Use the same data generation logic as the source of truth

## Tags

`mockup` `ui-design` `completeness` `ecostove` `scenario-switching`
