# Handoff: EcoStove — Compliance Slides + SQL/Dashboard Plan

**Date**: 2026-02-26 15:32
**Context**: 84%

## What We Did

### สไลด์คุย อ.แก้ว — เพิ่ม Compliance Management (11→12 หน้า)
- **เพิ่มสไลด์ใหม่หน้า 6** — "ชาวบ้านลืมเปิด/ปิดเซนเซอร์ — รับมืออย่างไร?"
  - ลืมปิด → ระบบตัดการดึงข้อมูลอัตโนมัติที่ 2h10m
  - ลืมเปิด → 3 ชั้นรับมือ (LINE เช้า → Midday nudge → Weekly report)
  - บ้านไม่มีเน็ต → อาสาช่วยปล่อย Hotspot (scenario แยก)
  - Compliance Target: 3,600 sessions, เป้า 70–80%
  - เหตุผลไม่บังคับเวลา (bias ข้อมูล)
- **แก้สไลด์ 5** — "ต้องคุย อ.แก้ว" → "มีแผนรับมือแล้ว ดูหน้าถัดไป"
- **แก้สไลด์ Questions** — เปลี่ยนจากถามเป็นเสนอ:
  - งบ: เสนอตัวเลข ~8,500–13,000 ฿ (ไม่ใช่ถาม)
  - อาสา: แจ้งว่าต้องมีมือถือ+เน็ต (ไม่ใช่ถาม)
  - คู่มือ: เตรียมให้พร้อมสำหรับทุกคน
  - Compliance: เสนอแผน + ถามอาจารย์เห็นด้วยไหม

### ความเข้าใจสำคัญที่ clarify
- **ชาวบ้าน** = กลุ่มตัวอย่าง = ควบคุมเซนเซอร์เอง (เปิด/ปิดได้ตลอดเวลา)
- **อาสา** = ผู้ช่วยอาจารย์ = ปล่อย Hotspot ให้บ้านที่ไม่มีเน็ต
- ปัญหาหลักคือ "ลืมเปิด/ปิดเซนเซอร์" ไม่ใช่ "ลืมเปิด Hotspot"

### Settings
- เพิ่ม `"defaultMode": "acceptEdits"` ใน `.claude/settings.local.json` — auto-approve file edits

## Pending
- [ ] SQL migration (sessions + daily_summaries tables)
- [ ] Code session management (state machine)
- [ ] ปรับ Dashboard HTML ตาม plan ในสไลด์
- [ ] LINE OA + Messaging API setup
- [ ] เลือก + เซ็ต server (Oracle Cloud / NIPA)
- [ ] คู่มือเซนเซอร์ (ชาวบ้าน + อาสา)
- [ ] PM2 install + setup

## Next Session
- [ ] **SQL migration** — สร้าง tables: sessions, daily_summaries (ใน Supabase)
- [ ] **Dashboard HTML** — ปรับตาม plan: Session Timeline, Daily Summary, Export
- [ ] Review สไลด์กับ DewS อีกรอบก่อนคุย อ.แก้ว
- [ ] หลังคุย อ.แก้ว → อัปเดตคำตอบลงสไลด์/plan

## Key Files
- `lab/tuya-ecostove/ecostove-meeting-ajkaew.html` — สไลด์คุย อ.แก้ว (v3, 12 หน้า)
- `lab/tuya-ecostove/ecostove-deployment-plan.html` — สไลด์ deployment v1 (9 หน้า, เก่า)
- `lab/tuya-ecostove/sensor-monitor.js` — Main server
- `lab/tuya-ecostove/config.json` — Credentials (gitignored)
- `ψ/memory/logs/info/2026-02-26_14-30_ecostove-session-management-design.md` — Session design
- `.claude/settings.local.json` — Permission settings (acceptEdits mode)

## Key Decisions Made This Session
- ชาวบ้านควบคุมเซนเซอร์เอง (ไม่ใช่ Hotspot)
- 3-tier compliance: LINE remind → Midday nudge → Weekly report
- Compliance target: 70–80% เพียงพอทางสถิติ
- ไม่บังคับเวลาเปิดเซนเซอร์ — เพื่อไม่ bias ข้อมูล
- อาสาช่วยเฉพาะบ้านไม่มีเน็ต + ต้องมีมือถือ+เน็ต (ใช้ LINE)
