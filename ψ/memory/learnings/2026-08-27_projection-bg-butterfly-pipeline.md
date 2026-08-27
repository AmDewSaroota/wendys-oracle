# Learning: Projection BG + Butterfly Footage Pipeline (+ AI tool ceilings)

**Date**: 2026-08-27
**Context**: Butterfly Game — interactive projection BG (12×3m, 4:1) + glowing butterfly footage for AE overlay. Client cancelled, but pipeline + know-how are reusable for future projection/interactive pitches.

## AI Tool Ceilings (prompt can't fix — escalate faster)
- **Higgsfield outpaint/expand = ALWAYS rescales the placed image.** Cannot "keep small original, fill only black at native res." → use fresh wide gen, or composite in post. Don't loop prompts.
- **Seedance/Dreamina image-to-video = auto-exposure flicker** on dark scenes with bright glow points (whole-frame brightness pulsing = "disco/flash"). Prompt guards don't fully fix. → Fix in post: **Flicker Free (Digital Anarchy)** plugin, or animate motion manually in AE. Try low motion-strength + reseed first.
- **Reference image carries LAYOUT, not just style.** A ref sheet of butterflies → model copies the grid/cluster arrangement. → "use ref for appearance ONLY, not positions" or describe from scratch.

## Composition rules learned
- **"Far + small" erases scene identity** (identity lives in mid/foreground). To keep 3 distinct scenes distinct even when zoomed out, give each a differentiator that survives distance: e.g. V1 jungle = canopy roofs the top of frame; V2/V3 = open sky (split by warm/cool + water/grass).
- **V-shape / funnel composition** comes from prompting "open dark center + foliage framing both sides + bright center reflection." Kill it with: flat continuous horizon, even distribution, off-center light, explicit `no V/funnel/tunnel/vignette`.
- **Human-scale lock** for projection: state frame = real meters (e.g. 12×3m), horizon %, "a 1.65m adult reaches ~55% up", grass at knee height, tree trunks exit top. Verify by overlaying a scaled human silhouette in PS after gen.
- **Video flicker words to avoid**: pulse / twinkle / shimmer / glow / firefly. Strip light language, keep only physical motion (mist, sway, ripple) + guard "all lighting stays constant, no flicker."

## Butterfly footage → AE
- Overlay on black: **Screen/Add** blend (glow-friendly) or **Unmult** (keeps solid butterfly color). Levels to crush residual grey halo.
- AE rig: wing flap = keyframe spacing OR `Math.sin(time*freq*Math.PI*2)*amp` (freq = speed, mirror -amp for other wing). Position drift = `wiggle(freq, amp, 1)` — **octaves=1 = smooth, default 2 = jitter**.
- Glow = precompose butterfly (Body+WingL+WingR) → **Glow** effect, or duplicate+Fill+blur for colored aura. Trail = **Echo** (negative time, Screen operator) applied BEFORE Glow.
- Animating a busy static composite (30+ tiny butterflies) via image-to-video = unreliable (frozen wings, backward flight). → generate in small batches (8-12) and stack layers, or rig in AE.

## Quotation angle (interactive projection, rental)
- Split quote: dev (one-time, reusable) vs equipment rental (per-event) vs art (separate). LiDAR sensors rarely day-rentable → vendor usually owns; flag as cost driver.
