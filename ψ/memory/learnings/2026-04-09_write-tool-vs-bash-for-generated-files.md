# Write Tool vs Bash for Generated Files

**Date**: 2026-04-09
**Source**: rrr skill UX fix
**Tags**: vscode, ux, file-writing, skills

## Pattern

When Claude Code's `Write` tool creates a file, VSCode automatically opens it in the editor as a new tab. This is useful for code files that need review, but disruptive for generated output files (retrospectives, reports, logs) that don't need diff viewing.

## Solution

For skills that generate output files, use Bash file writing (`cat <<'EOF' > file`) instead of the Write tool. This writes the file silently without opening any editor tabs.

## When to Use Which

| Scenario | Tool | Why |
|----------|------|-----|
| Editing existing code | Write/Edit | Need diff review |
| Creating new source code | Write | User should see what was created |
| Generated reports/logs | Bash `cat` | No review needed, don't interrupt |
| Retrospectives/learnings | Bash `cat` | Output files, user reads in chat |

## Amplifying Factor

`workbench.editor.enablePreview: false` in VSCode settings makes this worse — every file opens as a permanent tab instead of a reusable preview tab.
