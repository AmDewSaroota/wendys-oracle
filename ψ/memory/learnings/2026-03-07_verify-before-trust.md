# Lesson: Verify Before Trust

**Date**: 2026-03-07
**Source**: rrr: wendys-oracle
**Tags**: #verification #subagents #api-analysis

## Pattern

When subagents report file existence/absence or when estimating resource usage (API quotas, costs):

1. **Don't trust subagent file existence claims** — verify with a quick `Glob` or `Read`. An explore agent reported cron files "don't exist yet" when they did exist.

2. **Read the actual implementation before estimating resource usage** — I assumed per-device API calls when sync.js uses batch endpoints. The batch design means 2 calls per sync regardless of device count, not N*3 calls.

3. **DewS's memory of past decisions is reliable** — when she says "we calculated this already," go back and verify against the code rather than re-deriving from wrong assumptions.

## Rule

> Verify claims against the file system. Read code before estimating. Trust DewS's recall of past decisions.
