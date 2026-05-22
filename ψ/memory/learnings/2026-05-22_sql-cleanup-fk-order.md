# SQL Cleanup: FK Order + Biomass Pending Data

**Date**: 2026-05-22
**Source**: rrr: biomass-data-cleanup

## Pattern

เมื่อต้องล้างข้อมูลหลายตารางพร้อมกัน ต้อง DELETE ตาม FK dependency order เสมอ:
child tables → parent tables

ใน Biomass system:
```
pollution_logs (child of sessions)
→ sessions (child of devices/subjects)  
→ devices (child of subjects + registered_sensors)
→ subjects (บ้าน — parent)
```

## Biomass-specific

- "รออนุมัติ" = `pollution_logs.status = 'pending'` — ไม่มี table แยก
- ล้าง pollution_logs ก่อนเสมอ ก่อน sessions
- `registered_sensors` และ `admin_users` = ไม่แตะ

## VSCode Extension

Claude Code extension 2.1.128 ไม่มี setting ปิด auto-open files
→ ตรวจ `package.json` ของ extension ก่อนให้คำแนะนำเสมอ
