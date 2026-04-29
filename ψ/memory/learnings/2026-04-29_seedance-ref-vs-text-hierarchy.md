# Seedance: Image Ref Dominates Text — Always

**Date**: 2026-04-29
**Source**: Fortal Dragon Cutscene iteration (Shot 7, 9)
**Confidence**: High (verified across 10+ generation rounds)

## Pattern

Seedance prioritizes visual references over text instructions. When image ref shows a gliding dragon and text says "powerful wing beats", Seedance will glide.

## Rules Discovered

1. **Image ref > text** — Always. No amount of text can override what the model sees in the reference image
2. **Starting frame locks pose** — If starting frame shows wings spread flat (glide), the dragon will glide the entire shot
3. **Near-end ref causes deceleration** — Seedance slows down/pauses to transition to the near-end position
4. **Conflicting instructions = unpredictable** — "Camera locked + body moves violently" → Seedance moves the dragon OUT of frame
5. **Video ref locks everything** — Camera, pose, speed, background. Can only override with 唯一修改 pattern for ONE thing
6. **Previs geometry is poison** — 3D mockup buildings, spheres, cylinders get copied literally
7. **Gentle words = gentle motion** — "sways, rocks, rolls" ≠ violent. Use "THRASHES, JERKS, CRACKS"
8. **Best fix for motion style**: Use a PREVIOUS good output as video ref, then override one specific element

## Action

Before writing any Seedance prompt:
1. Check ALL image refs — do they show the pose/action you want?
2. If ref contradicts desired action → change ref first, not text
3. Keep prompt under 150 words
4. Don't use near-end ref if you need constant speed
5. Never put conflicting instructions (still camera + violent movement)
