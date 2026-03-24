# Lesson: Read-Only Overview Tables Reduce User Confusion

**Date**: 2026-03-25
**Source**: DewS feedback on EcoStove dashboard
**Context**: Overview table had editable dropdowns for sensor + volunteer assignment

## Pattern

When the same data can be edited from multiple places (overview table dropdown AND dedicated management tab), users get confused about where to make changes. This is especially true for non-technical users like field volunteers.

## Solution

- **Overview/dashboard pages = read-only display** — show data, don't allow inline editing
- **Dedicated management tabs = edit via explicit actions** (buttons like "แก้ไข", modals)
- This creates a clear mental model: "overview = see, management tab = change"

## Application

- `renderOverviewTable()`: sensor + volunteer columns changed from `<select>` to `<span>` text display
- `renderSubjectsList()`: sensor column changed from `<select>` to `<span>` text display
- Edit functionality preserved via "แก้ไข" button → edit modal

## Broader Principle

**"Where should changes be made?" is a UX question, not a convenience question.** More editing surfaces ≠ better UX. Clear, singular editing points = less confusion.
