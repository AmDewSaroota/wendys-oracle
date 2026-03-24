# Simulate Before Shipping

**Date**: 2026-03-24
**Source**: rrr: wendys-oracle
**Context**: LINE OA notification redesign

## Pattern

When proposing a format/design change that affects end users, don't just show the template — **simulate multiple real scenarios** and show the output for each.

## Evidence

DewS asked to improve LINE notification format. Instead of just showing the new template, I simulated 6 scenarios:
1. Best case (all houses collected)
2. Mixed (some complete, some not)
3. Worst case (no one collected)
4. Tuya API issues
5. Morning session summary
6. Rest day

This built confidence and DewS approved immediately without follow-up questions.

## Takeaway

Simulation = confidence. Show 3-6 realistic scenarios covering happy path, edge cases, and error states. Users can evaluate a design much better when they see it "in action" rather than as an abstract template.

## Tags

`design` `communication` `user-experience` `line-oa`
