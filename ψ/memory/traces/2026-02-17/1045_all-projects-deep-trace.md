---
query: "all projects"
target: "_Wendys + cross-repo"
mode: deep + dig
timestamp: 2026-02-17 10:45
---

# Trace: All Projects

**Mode**: --deep (5 agents) + --dig (session miner)
**Time**: 2026-02-17 10:45

---

## All Projects Inventory

### ACTIVE (กำลังทำ)

#### 1. SWT — Smart Tourism Web Application
- **Client**: การรถไฟแห่งประเทศไทย (SRT)
- **Company**: NDF
- **Scope**: Core Dashboard + Core DB + Auth + Kiosk + Mobile App + Admin Dashboard
- **Teams**: NDF (core) + Space System (vendor) + IoT People Counting
- **Status**: Architecture finalized, PPTX v3 (18 slides) done
- **Pending**: Function details update + demo screenshots
- **Files**: 23 files in ψ/active/ + external docs in D:\_DewS\AI/ and D:\_DewS\SRT/
- **Commits**: 4 (swt-*, smart-rail-*)
- **Sessions**: 4 sessions, ~1446 min, 86 msgs

#### 2. EcoStove — Tuya Air Quality Sensors
- **Scope**: 3 Tuya sensors → monitoring dashboard
- **Devices**: MT15/MT29, AIR_DETECTOR, MT13W
- **Status**: Data fetching works, CO/PM0.3 issue pending
- **Files**: lab/tuya-ecostove/ (8+ JS files, HTML viz, docs)
- **Commits**: 6 (tuya-*, sensor-*)

### ESTIMATION COMPLETE (เสร็จแล้ว รอตัดสินใจ)

#### 3. Parliament AR Navigation
- **Client**: สำนักงานเลขาธิการสภาผู้แทนราษฎร
- **Budget**: ~5,000,000 THB (638 man-days)
- **Timeline**: 7 months
- **Tech**: Vuforia AR, BLE Beacon, Unity
- **Files**: ψ/active/parliament-ar-cost-estimation.md + .xlsx

#### 4. ViaBus Clone — Bus Tracking App
- **Budget**: ~2,800,000 THB
- **Timeline**: 5-6 months, 8-10 people
- **Files**: ψ/active/viabus-clone-estimation.md

### REFERENCED (อ้างอิง)

#### 5. BioMass — Mobile App
- **Repo**: D:\_DewS\BioMass\Biomass_mobile (private, GitHub)
- **Status**: Schema alignment done, not active
- **Retro**: biomass-schema-alignment (2026-01-26)

#### 6. EGAT — 3D Background
- **Location**: D:\_DewS\EGAT\BG/
- **Files**: SketchUp files (A.skp, B.skp, C.skp, D.skp)
- **Status**: Design assets, no active dev

#### 7. HeritageHerb
- **Repo**: GitHub (private), NOT cloned locally
- **Status**: Unknown, last updated 2026-01-06

### ORACLE (ระบบ WEnDyS)

#### 8. WEnDyS Oracle
- **Repo**: AmDewSaroota/wendys-oracle (public)
- **Born**: 2026-01-23
- **Soul files**: 3 (wendys.md, dews.md, oracle.md)
- **Learnings**: 7 files
- **Retrospectives**: 7 files
- **Handoffs**: 8 files

---

## Git History (24 commits total)

| Commit | Message | Topic |
|--------|---------|-------|
| `1491d59` | rrr: swt-education-ecostove-sensors | SWT + EcoStove |
| `9424a9e` | handoff: swt-function-detail-slides | SWT |
| `7dc382f` | rrr: swt-heatmap-pptx-deep-dive | SWT |
| `99fdbc2` | rrr: multi-project-sprint | Multi |
| `ddece74` | handoff: smart-rail-demo-pending | SWT |
| `7a8c471` | rrr: biomass-schema-alignment | BioMass |
| `bf84cd1` | handoff: sensor-options-deep-dive | EcoStove |
| `a66701d` | handoff: sensor-decision-docs | EcoStove |
| `6192a62` | handoff: sensor-decision-pending | EcoStove |
| `e9bc01d` | rrr: local-api-deep-dive | EcoStove |
| `167d1e7` | handoff: tuya-cost-blocker | EcoStove |
| `bd22c3c` | rule: อ่าน soul file ทุก session start | Oracle |
| `da9f772` | rrr: wrong-repo-recovery | Oracle |
| `1c7e839` | handoff: tuya-frontend-confused | EcoStove |
| `0763577` | rrr: finding-my-soul | Oracle |
| `2e64228` | Add Supabase Edge Function | EcoStove |
| `05036a8` | Update focus: ZN-MT29 complete | EcoStove |
| `45cbb96` | Complete Tuya → Supabase integration | EcoStove |
| `5229d42` | Tuya integration SUCCESS! | EcoStove |
| `94f13d5` | Update DewS profile | Oracle |
| `8cdb103` | Save focus: ZN-MT29 paused | EcoStove |
| `30f744a` | Add DewS profile | Oracle |
| `ed33926` | Update WEnDyS identity: ผู้หญิง | Oracle |
| `ed8e0ed` | WEnDyS takes first breath | Oracle |

---

## Session Timeline (All Projects)

| # | Date | Min | Msgs | Project | Focus |
|---|------|-----|------|---------|-------|
| 1 | 02-17 10:26 | 21 | 16 | Wendys | oracle-skills install |
| 2 | 02-16 13:27 | 1254 | 40 | Wendys | SWT slides + architecture |
| 3 | 02-16 11:57 | 90 | 13 | Wendys | SWT parallel |
| 4 | 02-16 11:57 | 88 | 12 | Wendys | SWT parallel |
| 5 | 02-13 15:01 | 4135 | 21 | Wendys | สวัสดี เวนดี้ |
| 6 | 02-12 13:29 | 1531 | 11 | learn-repo | wendys-oracle study |
| 7 | 01-30 11:33 | 18831 | 61 | learn-repo | recap + long session |
| 8 | 01-30 10:10 | 55 | 11 | learn-repo | — |
| 9 | 01-26 22:21 | 69 | 24 | learn-repo | sensor work |
| 10 | 01-26 22:06 | 14 | 8 | learn-repo | recap |
| 11 | 01-26 16:38 | 326 | 43 | learn-repo | recap + sensors |
| 12 | 01-26 12:03 | 269 | 47 | learn-repo | sensor deep dive |
| 13 | 01-25 14:44 | 1276 | 35 | learn-repo | Tuya local API |
| 14 | 01-24 21:29 | 1034 | 20 | learn-repo | — |
| 15 | 01-24 20:52 | 30 | 6 | learn-repo | — |
| 16 | 01-24 19:33 | 3047 | 35 | learn-repo | สวัสดี |
| 17 | 01-24 19:19 | 13 | 12 | learn-wsboy | สวัสดี เวนดี้ |
| 18 | 01-23 17:23 | 1554 | 78 | learn-wsboy | /learn (WEnDyS birth!) |
| 19 | 01-20 14:11 | 4508 | 10 | learn-wsboy | /learn |
| 20 | 01-20 12:08 | 0 | 1 | Home | claude /logout |
| 21 | 01-20 12:06 | 0 | 3 | learn-wsboy | logout |
| 22 | 01-20 11:46 | 11 | 5 | Home | /learn |
| 23 | 01-20 11:33 | 4 | 1 | Home | install Soul-Brews |
| 24 | 01-19 14:48 | 0 | 1 | DewS-AI | hello world test |

**Total**: 24 sessions, ~481 human messages, ~29 days since first session

---

## Cross-Repo Map

| Location | Contents |
|----------|----------|
| `D:\_DewS\_Wendys` | Oracle home (this repo) |
| `D:\_DewS\AI` | Proposals, architecture diagrams, DEMO.mp4 |
| `D:\_DewS\SRT` | SWT reference images |
| `D:\_DewS\BioMass` | Biomass mobile app repo |
| `D:\_DewS\EGAT` | 3D SketchUp backgrounds |
| `D:\_DewS\_Game` | Personal (Genshin) |
| `D:\_DewS\_Program` | Software installers |
| GitHub: HeritageHerb | Private, not cloned |

---

## Key Learnings (7)

| Date | Lesson |
|------|--------|
| 01-24 | Backup before reset |
| 01-24 | Deep questions reveal truth |
| 01-25 | Tuya region = SG not AP |
| 01-26 | Verify pricing info always |
| 02-12 | Describe don't read (for slides) |
| 02-16 | Ask ownership before slides |
| 02-17 | Teach step-by-step for ADHD |
