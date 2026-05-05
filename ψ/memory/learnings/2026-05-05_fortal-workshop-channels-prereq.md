# Lesson: Fortal Workshop + Claude Code Channels Prerequisites

**Date**: 2026-05-05
**Source**: rrr: fortal-workshop-skills-sync
**Tags**: #oracle-skills #direnv #channels #version

## Patterns

1. **Simplify first**: When DewS asks about technical topics, start with simple analogies (e.g. direnv = auto WiFi by location). Only go technical if she asks for more detail.

2. **Oracle Skills CLI redirect**: The GitHub repo was renamed. API calls to `Soul-Brews-Studio/oracle-skills-cli` redirect to `Soul-Brews-Studio/arra-oracle-skills-cli`. Must use `-L` flag with curl or use repo ID `1136784451` directly.

3. **Claude Code Channels**: Requires Claude Code v2.1.80+. Current version on this machine is v2.1.51. Need `npm install -g @anthropic-ai/claude-code@latest` before setting up Discord bridge.

4. **Version scheme change**: Oracle Skills CLI changed from semver (v1.5.x) to date-based versioning (v26.4.18 = 2026, April, patch 18). Don't be alarmed by large version jumps.

## Context

DewS attended Fortal Workshop #3 by Nat (Soul-Brews-Studio). Workshop teaches direnv for per-project env management and Oracle ecosystem setup.
