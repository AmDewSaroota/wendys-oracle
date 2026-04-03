# Lesson: Seedance Video Ref Has Hard Limits

**Date**: 2026-04-04
**Source**: rrr: wendys-oracle
**Context**: Dragon cutscene prompt engineering for Fortal project

## Pattern

Seedance 2.0 video ref (playblast) only works when the playblast has clear, recognizable visual elements. When the playblast is abstract (plain sky, geometric mockups), Seedance either:
1. Does a raw style transfer (fades preview into cinematic look) — losing the dragon
2. Copies geometric shapes literally (spheres become spherical fire, cylinders become cylindrical fire)
3. Copies ugly cloud geometry along with the dragon motion (can't separate them)

## Rules Discovered

1. **Playblast needs landmarks** — buildings, ground, recognizable objects as reference points
2. **Geometry mockups are poison** — they infect the entire clip, even elements that were working before
3. **Video ref locks everything together** — can't lock dragon motion while freeing cloud appearance
4. **Image ref can replace video ref** — a single good reference image communicates composition, pose, and atmosphere better than an abstract playblast
5. **Prompt elements must not contradict** — `完全复制` + `明显晃动` = conflict. Must check for internal consistency

## Concepts

- seedance, video-ref, playblast, prompt-engineering, geometry-mockup, conflict-detection
