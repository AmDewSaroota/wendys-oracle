# Seedance: Restriction Words Kill Entire Motion

**Date**: 2026-04-09
**Context**: Dragon cutscene Shot 9 — trying to reduce head sway

## Pattern

Adding restriction/constraint words to Seedance prompts doesn't isolate to the specified body part — it freezes the **entire subject**.

**What happened:**
- Dragon's head was swaying too much in Shot 9
- Added line: `飞龙颈部保持基本朝前` (dragon neck stays basically forward)
- Result: Dragon became completely static — hovering in place, no wing flapping, no movement at all

**Why:**
Seedance interprets prompts holistically, not per-body-part. Words like:
- `保持` (maintain/keep) → interpreted as "don't change/move"
- `朝前` (forward-facing) → interpreted as "stay fixed in orientation"

Combined effect: the entire creature stops animating.

## Rule

**Never use restriction/constraint words** (`保持`, `不要`, `避免`, `固定`) for body parts in Seedance. It has no body part isolation — any constraint applies globally.

**Instead:**
- Accept natural motion as part of the style
- Generate multiple takes and pick the best one
- If motion is truly excessive, try adding *positive* motion descriptions for other parts (e.g., emphasize wing flapping) to "dilute" the unwanted motion

## Also Learned This Session

- **Ending frame = teleport**: Using both starting + ending frame causes Seedance to jump between them. Use only starting frame + text description for ending state
- **Previz video + simple prompt > complex text-only**: Let video ref handle camera motion, text only for style/atmosphere
- **Study previz frames carefully**: Object getting smaller = flying away, not toward camera. Always verify direction from visual evidence before writing
- **Gemini can't preserve layout when inpainting**: After 2 failed attempts with same cause, pivot to manual compositing instead of retrying
- **Highfield ≠ original Seedance**: English prompts on Highfield produce much worse results. Stick to Chinese on original platform

## Tags
`seedance`, `video-generation`, `prompt-engineering`, `restriction-words`, `previz`