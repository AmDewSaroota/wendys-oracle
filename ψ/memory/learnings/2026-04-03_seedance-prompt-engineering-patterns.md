# Seedance Prompt Engineering Patterns

**Date**: 2026-04-03
**Source**: Dragon cutscene prompt iteration (Fortal project)
**Confidence**: High (verified through 20+ iterations with real output)

## Key Patterns

### 1. Visual Input > Text Always
- Video reference overrides text description 100% of the time
- If playblast has artifacts (rig lines, wrong fire shape) → fix at source, not in prompt
- Starting frame sets the color/tone expectation — grey Maya render = grey output

### 2. Camera Lock is a Spectrum
- 5 levels from "完全复制" (90% copy) to no ref at all
- Too strict = looks like preview, no cinematic feel
- Too loose = dragon goes wrong direction
- Sweet spot per shot — need to find through iteration

### 3. Positive > Negative
- "火焰翻卷扩散如瀑布" (fire rolls like waterfall) works
- "不得变形" (don't deform) wastes words
- Exception: specific negatives work ("绝非圆柱光束", "不是螺旋旋转")

### 4. Seedance Can't Do Physics Destruction
- Buildings can't break/shatter/crumble — only lean
- Workaround: fire consumes buildings + thick smoke hides them
- Or: handle destruction in post-production

### 5. Character Description Position Matters
- Put character description EARLY in prompt (lines 3-5)
- Seedance weighs beginning text more than end
- Dragon came out wrong color when description was at bottom

### 6. Full Prompt Always for Non-Chinese Readers
- DewS can't read Chinese → always provide complete prompt
- Never say "change line 3" — risk of copy errors
- Use @[Thai labels] so DewS knows which image to attach

## Anti-Patterns (Don't Do)
- Render engine terms (parallax, skybox, PBR, subsurface scattering)
- Long lists of "forbidden" rules (不得/禁止/不允许)
- Ground contact constraints for flying creatures
- Prompts over 150 Chinese words
