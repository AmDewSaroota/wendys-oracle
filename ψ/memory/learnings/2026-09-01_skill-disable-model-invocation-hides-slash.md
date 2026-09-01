# Lesson: `disable-model-invocation: true` ซ่อนสกิลจาก slash menu

**Date**: 2026-09-01
**Context**: ติดตั้งสกิล grill-me (Matt Pocock) เข้า repo WEnDyS แล้ว /grill-me ไม่ขึ้นใน slash menu

## Problem
ก็อป SKILL.md ต้นฉบับมาตรงๆ ซึ่งมี frontmatter:
```yaml
user-invocable: true
disable-model-invocation: true
```
ผลคือ `/grill-me` ไม่โผล่ทั้งใน available skills list และ slash menu ของ VSCode — reload window แล้วก็ยังไม่ขึ้น

## Root Cause
`disable-model-invocation: true` ใน 環境 Claude Code (VSCode extension) นี้ ทำให้สกิลถูกซ่อนจากทั้ง model skill list และ user-invocable slash registration ไม่ใช่แค่กันไม่ให้ model auto-trigger อย่างเดียวเหมือน plugin system ต้นฉบับ

## Fix
เอา `disable-model-invocation: true` ออก เหลือแค่ `user-invocable: true` → สกิลโผล่ในระบบทันทีเทิร์นเดียว (แต่ slash menu ต้อง Reload Window อีกที)

## Takeaway
- สกิล user-invocable ในโปรเจกต์นี้ ใช้ `user-invocable: true` พอ อย่าใส่ `disable-model-invocation`
- เจอสกิลไม่ขึ้น → diff frontmatter กับสกิลที่ใช้ได้ (hello-wendys) ก่อนโทษ cache
- เพิ่ม/แก้สกิลกลาง session → model-invocable เห็นทันที, slash command ต้อง Reload Window
