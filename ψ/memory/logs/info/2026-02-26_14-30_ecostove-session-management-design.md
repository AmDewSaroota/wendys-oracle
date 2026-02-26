---
date: 2026-02-26T14:30:00+07:00
type: info
status: raw
significance: interesting
---

# EcoStove Session Management Design

## Session Model
- Session = 10 min baseline + 2 hr collection = 2h10m total
- Cooldown = 5 hr from session start before next session allowed
- Offline tolerance: < 10 min = resume, > 10 min = cancel & restart
- Idle scan every 30 min, collection every 10 min
- Incomplete sessions tagged session_status: "incomplete"
- Config: all values adjustable in config.json session block

## Roles (Corrected)
- ผู้ใช้เตา (บ้านมีเน็ต) = เปิด/ปิดเซนเซอร์เอง
- อาสาสมัคร = ผู้ช่วยอาจารย์ ไปเฉพาะบ้านไม่มีเน็ต/sensor มีปัญหา
- กลุ่มตัวอย่าง = ชาวบ้าน = ผู้ใช้เตา (ไม่ใช่อาสา)

## Infrastructure Decisions
- Server: Oracle Cloud Free Tier
- Database: Supabase (keep using, sufficient for project scale)
- Dashboard: move from Vercel to Oracle Cloud VM
- Need LINE notification for approval workflow

---
Logged via /fyi
