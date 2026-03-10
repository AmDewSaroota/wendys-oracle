# Brainstorm Mode + Human Constraints

**Date**: 2026-03-10
**Source**: EcoStove internet options brainstorm with DewS
**Tags**: #brainstorm #ux #fieldwork #thai-language

## Pattern: Default to Discussion, Not Deliverables

When DewS is exploring options and hasn't decided yet, she wants conversational brainstorming — not polished slide content. The signal: she shares rough notes and asks to discuss.

**Trigger**: "ช่วยลิสต์ข้อดีข้อเสีย" + rough notes = brainstorm mode
**Anti-pattern**: Immediately producing formatted tables and recommendation boxes
**Correct**: Discuss trade-offs conversationally, ask follow-up questions, share concerns

## Pattern: Human Constraints > Technical Constraints

The single-SIM phone problem was invisible from a technical perspective but immediately obvious to DewS who thinks about field deployment. When designing for volunteers/non-technical users:

1. **Phone SIM slots** — Can volunteers use their personal phone? What happens to their regular number?
2. **Device management** — Who charges/maintains shared devices?
3. **Social friction** — Does the solution require asking people to change their daily routine?

## Pattern: Thai Academic Register

- "วิจัย" = formal academic research (implies methodology, IRB, publication)
- "การศึกษา" = study/investigation (appropriate for feasibility, field analysis)
- Use "การศึกษา" when presenting to academics about practical/applied work

## Pattern: Verify APIs Empirically

Code analysis of `sync.js` showed `tvoc_value` in the schema → looked like system collected TVOC. But running actual Tuya API showed neither sensor returns TVOC. Code can mislead; live data is truth.
