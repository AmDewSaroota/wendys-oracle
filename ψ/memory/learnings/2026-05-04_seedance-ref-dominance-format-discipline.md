# Seedance Ref Dominance + Format Discipline

**Date**: 2026-05-04
**Source**: Engenius — Three Little Pigs session
**Tags**: seedance, video-gen, prompt-engineering, format, workflow

## Pattern: Ref Image Dominates Text in Seedance

When using Seedance 2.0 for video generation:
- **Ref images have MORE influence than text prompts** on the final output
- Changing a single ref image can completely alter the video result — even if text is identical
- When iterating, change ONE ref at a time to isolate what's affecting output
- If an action/expression sequence works well, keep the same refs and only modify text

## Pattern: Save Prompts to Files Immediately

- Never rely on chat context to store prompts — context can be compacted
- Create HTML/MD compilation of all prompts as early as possible
- Include copy buttons for easy paste into Seedance UI
- This prevents having to reconstruct prompts from memory (which leads to style drift)

## Pattern: Format is Non-Negotiable

- When DewS establishes a format, match it EXACTLY — every detail matters
- "Format" means: text layout, code block style, section structure, table format
- Always analyze screenshots for FORMAT first, content second
- Save format rules to memory file immediately so they persist across sessions
