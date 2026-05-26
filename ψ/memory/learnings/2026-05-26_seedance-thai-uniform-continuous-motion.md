# Seedance: Thai Uniform + Continuous Motion FG→BG

**Date**: 2026-05-26
**Source**: STKC final scene prompt iteration (Shot A)

## Patterns

### 1. Thai School Uniform — Always Specify
Seedance doesn't know Thai context. Without explicit instruction, female students get Indonesian/Filipino-style uniform (trousers).

**Formula to always include when Thai students are in shot:**
```
Thai school uniform strictly: girls wear white short-sleeve blouse and dark navy pleated skirt — NOT trousers. Boys wear white short-sleeve shirt and dark khaki trousers.
```

### 2. Continuous Motion FG→BG — Seedance Can't Do It
Action sequence "grab from FG then run to BG" creates two separate static groups instead of continuous motion. Seedance doesn't track trajectory across depth.

**Workaround**: Split into 2 shots, cut in AE.
- Shot 1: hands grab cards (product hero, FG only)
- Shot 2: kids in BG playing with cards (separate shot, no product)

### 3. Prompt Inflation = More Errors
Adding more description to fix a problem usually makes it worse. When stuck after 2 iterations → remove half the action description instead of adding.
