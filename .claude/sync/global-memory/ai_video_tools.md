---
name: AI Video Generation Tools (Seedance/Jimeng/Dreamina)
description: Distinction between AI video model and providers DewS uses for video creation work
type: project
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# AI Video Tools — Architecture

| Layer | Name | Notes |
|-------|------|-------|
| **Model/Engine** | **Seedance** | The actual AI video generation tool/model |
| **Provider (CN)** | **Jimeng** (即梦) | Chinese consumer-facing access |
| **Provider (Intl)** | **Dreamina** | International access |

## Why this matters
- **Seedance is the tool, Jimeng + Dreamina are providers** (access points to Seedance)
- WEnDyS writes the prompts; DewS sends to Seedance via Jimeng or Dreamina
- When teaching others (e.g., Oh on 2026-05-24/25), distinguish clearly: "Seedance" = what makes the clip, "Jimeng/Dreamina" = where you go to use it

## How to apply
- Don't say "Seedance vs Jimeng vs Dreamina" — they're not alternatives
- Say "Seedance via Jimeng" or "Seedance via Dreamina"
- For teaching beginners: lead with Seedance (the tool), then explain provider choice
