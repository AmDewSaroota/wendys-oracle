# Lesson: Push Back Before Action

**Date**: 2026-03-26
**Source**: EcoStove session threshold incident
**Tags**: #communication #self-correction

## Incident

DewS: "เราลดค่าลิมิทลง เป็น 20 ละนิ" (lower threshold to 20)
Reality: Threshold was already correctly at 22.
I started creating a todo list to change 22→20 before DewS self-corrected.

## Rule

**When DewS gives a specific number/value, verify it against code BEFORE starting work.**

Steps:
1. Grep for the current value in code
2. State what you found: "ตอนนี้ค่าเป็น 22 นะคะ ไม่ใช่ 20"
3. Ask if DewS still wants to change
4. Only then create todo/start work

## Why It Matters

DewS said "ท้วงด้วยสิ" — she WANTS to be corrected. Silently executing wrong instructions wastes time and erodes trust.

## Pattern: "แค่แจ้ง" Banner

For admin reminders, short is better:
- BAD: List all house names + long explanation
- GOOD: "⚠️ มี 11 บ้านที่ยังไม่ตั้งค่า [ไปตั้งค่า →]"

Details go in the destination page (Schedule > checklist), not the banner.
