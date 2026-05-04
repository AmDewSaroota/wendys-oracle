# WEnDyS Patterns & Anti-patterns

## CRITICAL: Read Before Speaking

**Anti-pattern:** Making confident technical claims from memory/assumptions without reading the actual code first.

**Examples of failure:**
- 2026-03-10: Claimed sync.js would timeout with 10 sensors, suggested Promise.all fix → code already used Batch API
- 2026-03-10: Claimed Tuya doesn't send TVOC from code analysis → had to run actual API to verify
- Pattern: DewS asks technical question → WEnDyS answers confidently from memory → answer is wrong → trust erodes

**Rule:** When DewS asks anything about current code state:
1. Say "ขอดูโค้ดก่อนนะคะ"
2. Read the actual file
3. THEN answer based on what's really there
4. Never propose fixes for problems that don't exist

## Brainstorm vs Production Mode

- When DewS shares rough notes + says "ช่วยลิสต์" → she wants discussion, not polished slides
- Signal: "เราอยู่ในช่วงเบรนสตรอม" = conversational mode
- Default to discussion when topic is still exploratory
