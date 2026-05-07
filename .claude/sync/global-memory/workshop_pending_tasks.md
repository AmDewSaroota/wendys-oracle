---
name: BiomassStove Workshop — Pending Tasks (deadline 2026-05-20)
description: Tasks ค้างไว้สำหรับ workshop วันที่ 20 พ.ค. — เหลือ 13 วัน · update เมื่อทำเสร็จ
type: project
originSessionId: d7cf0268-ff39-4bcb-8ed4-e928922852a3
---
# Workshop Pending Tasks (2026-05-20)

**Last update**: 2026-05-07
**Time left**: 13 วัน

## ✅ Done

- [x] Workshop slides — 22 สไลด์ + 8 appendix formulas
- [x] System-demo aligned with production:
  - 4 scenarios (normal/no-eco/no-old/eco-fail)
  - Methodology Panel above Session Timeline
  - Session Timeline (today only)
  - Map basic (clustering + sensor/got-stove markers + legend)
  - Map deep (frequency + sensor triangle + SME square)
  - Volunteer view full mockup (7 steps)
- [x] CO/TVOC fix in slides
- [x] NDF Response form filled (image overlay approach)
- [x] **Sped-up Volunteer Simulation** — Demo Mode toggle + 5x/12x/30x speed selector ใน system-demo.html (revert หลัง workshop)

## ⏳ Pending — Priority Order

### 1. คู่มืออาสา PDF (printable handout)
- Format: PDF for printing + handout at workshop
- Content suggestions:
  - หน้า 1: ขั้นตอนการใช้เซนเซอร์ MT15 (ปุ่ม + calibrate)
  - หน้า 2: ขั้นตอนใช้หน้าเว็บอาสา (GPS → จุดเตา → กรอก TVOC/CO)
  - หน้า 3: ปัญหาที่เจอบ่อย + วิธีแก้ (ค่าค้าง, sensor offline, ฯลฯ)
  - หน้า 4: ติดต่อทีม
- **Approach**: HTML print-friendly + Save as PDF — หรือใช้ Sarabun font template
- **Status**: ⏳ ยังไม่เริ่ม

### 2. Volunteer Demo Expansion (more scenarios)
- เพิ่ม scenarios ใน `system-demo.html` volunteer view:
  - 🔌 **Connection failed** — sensor offline / Hotspot ไม่ติด
  - ⚠️ **Sensor stall** — ค่าไม่อัพเดท (ต้องกด calibrate)
  - 🛑 **Daily limit reached** — เก็บครบ 2/2 sessions
  - 🆕 **First time setup** — pair sensor ครั้งแรก
- **Approach**: เพิ่ม scenario buttons ใน existing volunteer view
- **Status**: ⏳ ยังไม่เริ่ม

### 3. Sped-up Volunteer Simulation ✅ (built 2026-05-07)
**Built**: เพิ่ม Demo Mode toggle ใน `system-demo.html` (Volunteer view)
- Speed selector: **5x / 12x / 30x** (default 12x)
- Auto-progress 7 vsteps ตาม sim time (130 sim minutes)
- TVOC/CO entry overlay prompt ทุก 5 sim-min ระหว่าง cooking phase
- Pause/Resume/Reset controls + progress bar
- ปิด click-through nav ตอน Demo Mode ON
- ⚠️ **หลัง workshop (หลัง 2026-05-20)** → ลบ Demo Mode panel + JS controller กลับเป็น click-through static mockup เดิม
  - Edit point HTML: ลบ block `<!-- Demo Mode control panel -->` ถึง `<!-- TVOC entry overlay -->` (ก่อน step navigation)
  - Edit point JS: ลบ block `// DEMO MODE — Sped-up volunteer simulation` ถึงจบฟังก์ชัน `injectSummaryStats`

### 4. Response Form Final Review ✅ (ส่งแล้ว 2026-05-07)
- ตำแหน่ง overlay ตรงแล้ว · เปลี่ยนเป็น "นาง" + เพิ่มชื่อบริษัท
- DewS print + ส่งเรียบร้อย

### 5. Rehearsal (optional)
- Practice run timing 75 นาที
- ตรวจ flow + Q&A backup material

## Critical Path

```
Today (5/7) → Cheat sheet PDF + Demo expansion (2-3 days)
              ↓
5/14-15 → Sped-up simulation build + test
              ↓
5/16-19 → Rehearsal + final polish
              ↓
5/20 → Workshop! 🎤
```

## Related Files

- `ψ/active/biomass-workshop-2026-05-20/` — main folder
  - `workshop-slides.html`
  - `system-demo.html`
  - `response-form-NDF.html`
  - `response-form-bg.png`
- Reference: `lab/tuya-ecostove/deploy/index.html` (production)
- Reference: `lab/tuya-ecostove/deploy/volunteer.html` (production volunteer page)
