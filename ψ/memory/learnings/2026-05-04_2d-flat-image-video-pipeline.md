# 2D Flat Style — Image + Video Prompt Pipeline

**Date**: 2026-05-04
**Source**: Engenius 2D Convenience Store session
**Confidence**: High (verified with actual generation failures)

## Lesson 1: Simple Poses Only in 2D Flat Style
- Complex poses (hugging, holding multiple items) distort characters
- Safe poses: pointing, clapping, waving, looking, standing, thumbs up
- Put products ON SHELVES/DISPLAYS, not in characters' hands
- "sparkling eyes" and similar embellishments can trigger distortion

## Lesson 2: Explicit Foreground/Background Separation
- AI may place characters INSIDE furniture/shelves if not specified
- Always include: "Both characters stand in the foreground, clearly in front of [X]"
- Describe background items as "behind them" or "the shelf behind them"
- Never use "reaching for" or "grabbing from" — implies overlap with furniture

## Lesson 3: Video Prompt Must Match Reference Image
- If image shows character holding chips → video prompt must describe holding chips
- If image shows empty hands → video prompt can describe pointing/gesturing
- Never contradict the physical state shown in the ref image
- Plan image + video prompts TOGETHER before generating

## Lesson 4: Chat vs File Prompt Drift
- Prompts iterated in chat may differ from final versions saved in files
- Always direct user to copy from the HTML/file, never from chat history
- Mark fixed versions clearly in handoff files
