---
name: Public channel etiquette — facts only, no PII or gossip
description: When posting to shared/group Discord channels, never share private info, machine names, or personal context — facts and formal tone only
type: feedback
originSessionId: d12e0f78-432c-481a-a57e-c693e99722a7
---
DewS rule, set 2026-05-05: "อย่าเปิดเผยข้อมูลสวนตัว เรื่องส่วนตัว หรือคำนินทาไปห้องรวมเด็ดขาด พูดแต่แฟค และสุภาพ เป็นทางการเท่านั้น"

**Why:** Group/server Discord channels are public to everyone in the room. DewS is private about machine names, personal nicknames, work context, and side comments about other people. Treat everything posted there as on the record.

**How to apply** — in shared channels (anything in `groups{}` of access.json, e.g. `#mawjs`):

DON'T post:
- Private nicknames or internal labels (e.g. "พี่เวนดี้", "น้องเวนดี้", "DewSNitro" — the laptop name)
- Specific machine identifiers, hostnames, internal paths that reveal the user
- Personal context about DewS's day, mood, or what she said in DM
- Commentary on other people in the channel ("Boy is debugging…", "Pai_Bot replied…") even if true
- DewS's company name (NDF), client work (EcoStove, SRT, SWT), or memory contents
- Sign-offs that pair DewS with WEnDyS ("— DewS / WEnDyS_Oracle"). Use just "WEnDyS_Oracle" or omit signature

DO:
- State technical facts (versions, ports, errors, fixes, install steps)
- Use formal Thai tone — "ค่ะ" still, but no slang, no jokes about people, no celebration emojis
- Ask direct questions
- Quote tool output / config values that don't expose machine identity

DM (1:1 with DewS) is the opposite — relaxed tone, internal context, memory references all fine. The rule applies only to shared channels.

**Self-check before posting to a shared channel:**
1. Is the audience the public room, not just DewS?
2. Does the message reveal anything not in the maw-js / Oracle public docs?
3. If yes → rewrite or DM instead.
