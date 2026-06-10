# Dreamina Narrative Bias & Tempo Control

**Date**: 2026-06-10
**Project**: Fortal Dragon cutscene (Shots 11-15)
**Source**: Full iteration session — multiple shots, 20+ prompt revisions

---

## Core Insight

Dreamina มี **narrative bias** จาก Hollywood training data — default behavior คือ buildup → pause → action เสมอ ทุก shot ต้องต่อสู้กับ bias นี้อย่าง explicit ใน prompt

---

## Patterns & Fixes

### 1. Anti-Ease-In (บังคับทุก shot ที่ต้องการความเร็ว)
```
No ease-in. No ease-out. Constant velocity throughout. No speed ramping.
We cut INTO this shot mid-action. Frame one: [action] already at maximum velocity, already happening. No buildup. No acceleration. The camera arrives late — everything already underway. Every frame identical tempo.
```

### 2. Phase Structure → ห้ามใช้เด็ดขาด
```
❌ Phase 1: ... Phase 2: ... Phase 3: ...
```
Dreamina หยุดระหว่าง phase → action ไม่ต่อเนื่อง แทนด้วย unified single-action description

### 3. Time Allocation (5s min clip)
```
The dragon is visible for about 2 seconds of the clip. The remaining 3 seconds: camera continues [action] alone.
```

### 4. Speed Calibration
| ผล | ปัญหา | แก้ |
|----|-------|-----|
| Glide (ช้าเกิน) | ภาษา gentle เกิน | `detonates / there and gone before the eye registers` |
| Warp (เร็วเกิน) | `under one second / cannot track` | `visible for 2 seconds, shape readable but smeared` |
| **Bullet (ถูก)** | — | `fast enough to catch briefly, slow enough to register as a creature` |

### 5. Obstacle Removal Language (สำหรับ "พุ่งทะลุ")
แทนที่จะบอก "ทะลุหลังคา" (Dreamina จะสร้าง dramatic pause):
```
The roof is not an obstacle — it is already nothing. Dragon makes the hole by being there.
No sequence. No phases. One action: a force going through a surface that cannot stop it.
```

### 6. Dorsal View (เห็นหลังมังกร)
บินอิสระ → Dreamina ให้ side profile เสมอ
บังคับ dorsal: บินขนานตามกำแพง
```
Dragon ascends along the outer castle wall face — body nearly parallel to the stone surface, back facing outward toward camera. Dorsal view: spine ridge, back surface of wings, tail. NOT side profile.
```

### 7. Maya Playblast = Color Contamination
Maya preview refs มีสี flat / material ไม่ realistic → Dreamina ดูด color เข้า output
Rule: ใช้เฉพาะ **photorealistic refs** เท่านั้น — ห้ามใช้ Maya playblast เป็น ref สี

---

## Dragon & Knight Language Templates

**Dragon Speed Block:**
```
Dragon moves at full hunting velocity — wings don't glide, they hammer the air like pistons. Body rigid, cutting through smoke. Not flying — a predator at full sprint.
```

**Knight Panic:**
```
Not a warrior right now — a man in armored terror. Scrambling, lurching, stumbling — body language of someone who has already accepted death. Not brave. Alive only by accident.
```

---

## All patterns documented in `/shot` skill.md
Section: "Dreamina — Tempo & Speed Control (2026-06-10)"
