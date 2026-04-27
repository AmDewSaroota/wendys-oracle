# Lesson: Grep ALL Files When Changing Data Models

**Date**: 2026-04-27  
**Context**: EcoStove stove type relationship change (1:1 → many:1)  
**Source**: rrr: wendys-oracle

## Pattern

When changing a data model (renaming columns, changing relationships, switching query patterns), don't just fix the obvious locations. **Grep the entire codebase** for all references to the old pattern.

## Evidence

Changed `stoves.subject_id` → `subjects.stove_id` in index.html (deep map, forms, save functions). Almost missed `preview-map.html` which had an identical copy of the deep map code using the old `stoveMap[subject_id]` pattern.

## Rule

```
After any data model change:
1. Fix the known locations
2. grep -r "old_pattern" across ALL files
3. Verify grep returns ZERO matches before deploying
```

## Tags

`data-model`, `refactoring`, `regression-prevention`, `ecostove`
