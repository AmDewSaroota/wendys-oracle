# Seedance Video Prompt Tactics

**Date**: 2026-04-22
**Source**: Fortal dragon cutscene — Shot 0, 1, 3 iteration

## Content Filter Workarounds
- Words that trigger filter: VIOLENT, EXPLOSIVE, DETONATES, SHATTER, rocket, missile
- Safe alternatives: BURSTS, SNAP, scatter, tremendous force, geyser, whale breach, force of nature, pressure wave
- Use nature metaphors for power — physics + scale instead of weapons

## Ref Image vs Text Conflicts
- If ref image shows dragon from behind, DON'T write "flies toward camera" — Seedance follows text over image and breaks framing
- Rule: describe what the IMAGE shows, not what you WANT to happen
- If they conflict, Seedance gets confused and output matches neither

## Prompt Length = Inverse Quality
- More constraints = more confusion for Seedance
- Shorter prompts with strong ref images = better results
- Let images carry composition/framing, text carries mood/motion

## Keyframe Count
- 5 keyframes = camera grinds/jerks between positions
- 3 keyframes (start, mid, end) = smoother
- 2 keyframes (start, end only) = can cause "floating" if no motion described

## Speed/Power Issues
- Giving timestamps makes Seedance distribute motion evenly = looks slow
- Removing timestamps and describing urgency = Seedance picks natural timing
- "ALREADY at full speed" prevents slow startup
- "constant speed — no deceleration" prevents end-of-shot slowdown

## Separate Shots > Complex Single Shot
- "Calm before storm" + "eruption" in one shot = Seedance can't do both well
- Split into Shot 0 (calm) + Shot 1 (eruption) = each does one job perfectly
- DewS can fade-blend in After Effects

## Nano Banana Gotchas
- Always say "ONE dragon" or "do not duplicate" — it may create extra heads
- "rim lighting" can become full-body glow — specify "no rim lighting" if not wanted
- For color correction: "not flat black" + "surface detail visible" works well

## Fire Glow Continuity Between Shots
- Don't just say "has fire glow" — say "gradually fades, slowly dying embers, NOT sudden disappearance"
- Specify residual state: "faint residual glow remains" at the end
