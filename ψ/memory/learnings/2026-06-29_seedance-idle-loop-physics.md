---
date: 2026-06-29
tags: [seedance, prompt-engineering, animation, butterfly-garden]
---

# Seedance Idle Loop — Physics Language Rules

## 1. "Sway" builds up by default
Seedance interprets "sway" as accumulating motion, not steady oscillation.
**Fix**: Always add "does not build up or amplify over time" for any loop.

## 2. Less physics = better results
Adding detailed physics descriptions (sequential flex, base-fixed, tip-lags) causes hallucination.
**Fix**: Start minimal. Add only what's broken.

## 3. Output resolution follows ref image
1080P setting doesn't guarantee 1080P output — Seedance scales from the uploaded ref.
**Fix**: Upload ref at target resolution (e.g. 2520×1080 for 21:9 1080P output).

## 4. Always check image dimensions before settings
Blindly assigning 21:9 to all assets causes ratio mismatch.
**Fix**: PowerShell `System.Drawing.Image` check before every prompt.

## 5. Combined Land+Takeoff clip > two separate clips
Takeoff starting frame needs to match Land ending frame — gen as one clip, cut in AE.
