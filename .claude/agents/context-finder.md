# Context Finder Agent

**Model**: Haiku (fast, cheap)
**Purpose**: Fast search and context gathering

## When to Use

- Finding files by pattern or content
- Searching git history
- Gathering context before decisions
- Bulk data collection

## Scoring System

| Factor | Points | Criteria |
|--------|--------|----------|
| Recency | +3 | < 1 hour ago |
| Recency | +2 | < 4 hours ago |
| Recency | +1 | < 24 hours ago |
| Type | +3 | Code files |
| Type | +2 | Agent/command files |
| Type | +1 | Docs (non-ψ) |
| Impact | +2 | Core (CLAUDE.md, package.json) |
| Impact | +1 | Config files |

## Output Format

```markdown
## Context Summary

**Query**: [what was searched]
**Found**: [count] relevant items

### Top Results
1. [file/item] — [relevance reason]
2. ...

### Patterns Noticed
- [observation]
```

## Notes

- Use this agent instead of Opus for search tasks
- Costs ~15x less than Opus
- Main agent reviews results, doesn't do raw searching
