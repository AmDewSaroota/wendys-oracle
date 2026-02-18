# Handoff: Gemini Proxy + Google Slides Creation

**Date**: 2026-02-18 16:54
**Machine**: DewSPC (Windows 11)

## What We Did

### 1. Sync Pull
- `/sync pull` ดึง skills + memory จาก repo มา DewSPC สำเร็จ
- Global memory synced เรียบร้อย
- Global skills ต้อง copy manual (bash limitation — เฉพาะ `git` กับ `node` ที่ทำงานได้)

### 2. Gemini Proxy System — Built from Scratch
สร้าง infrastructure ทั้งหมดบน DewSPC:

- **Mosquitto broker** — TCP:1883 + WebSocket:9001
- **Bridge** (`lab/gemini-proxy/bridge.js`) — Node.js แปลง MQTT ↔ plain WebSocket
- **Chrome Extension** (`lab/gemini-proxy/extension/`) — Manifest V3 + plain WebSocket to bridge
- **Content Script** — Inject text + click send ใน Gemini tab
- **CLI tools** — `chat.js`, `read-page.js`, `get-response.js`, `send-slides.js`

**Architecture**: `Claude → MQTT(1883) → Bridge(8765) → WebSocket → Extension → Gemini`

Pipeline ทำงานได้สมบูรณ์: ส่งข้อความถึง Gemini + อ่าน response กลับมาได้

### 3. Google Slides Attempt — FAILED
- ส่ง SWT 12-slide prompt ไป Gemini → ได้แค่ outline + pptx ธรรมดา
- DewS reject PPTX: "แย่มาก ไม่ต่างจากโครงร่าง"
- DewS ต้องการ Google Slides จริงๆ เพราะ beautify ได้, ใส่รูปได้, theme สวย
- Gemini บอกไม่สามารถใช้ "Create in Slides" tool ได้ใน session นั้น

## Pending

- [ ] **Global skills copy** — ยังไม่ได้ copy 32 skills ไป `~/.claude/skills/` (ต้องทำ manual ด้วย PowerShell)
- [ ] **Google Slides สำเร็จ** — ยังไม่ได้ Google Slides ที่สวยงาม
- [ ] `try-slides.js` — Script เปิด new tab + ส่ง prompt ใหม่ (เขียนแล้วแต่ยังไม่ได้ run)

## Next Session

- [ ] **ลอง new Gemini tab**: เปิด tab ใหม่แล้วส่ง prompt ภาษาอังกฤษที่ชัดเจนว่าต้องการ "Create in Google Slides" (ไม่ใช่ PPTX)
- [ ] **ลอง Gemini model ต่างๆ**: อาจต้องใช้ Gemini Pro หรือ model ที่มี tool access
- [ ] **Alternative approach**: ถ้า Gemini ยังสร้าง Google Slides ไม่ได้ → ลองใช้ Google Slides API โดยตรง + ใช้ Gemini แค่สร้าง content
- [ ] **Manual fallback**: DewS เปิด Gemini เอง + พิมพ์ "Create a Google Slides presentation about..." → แล้วให้ WEnDyS ช่วย refine

## Key Files

| File | Purpose |
|------|---------|
| `lab/gemini-proxy/bridge.js` | MQTT ↔ WebSocket bridge (CRITICAL) |
| `lab/gemini-proxy/extension/background.js` | Extension service worker |
| `lab/gemini-proxy/extension/content.js` | Gemini page interaction |
| `lab/gemini-proxy/mosquitto.conf` | Broker config |
| `lab/gemini-proxy/chat.js` | CLI chat sender |
| `lab/gemini-proxy/read-page.js` | Read Gemini response |
| `lab/gemini-proxy/try-slides.js` | New tab + slides (incomplete) |
| `lab/gemini-proxy/create-slides.js` | PPTX creator (REJECTED) |
| `ψ/active/swt-presentation-slides.md` | 12-slide content (source) |

## Technical Notes

- **Bash broken on DewSPC**: Shell builtins (echo, ls, pwd) all exit code 1. Only `git` and `node` work.
- **mqtt.js incompatible with service workers**: Must use bridge architecture with plain WebSocket
- **Mosquitto needs manual restart**: ไม่มี daemon mode บน Windows, ใช้ Node.js spawn detached
- **Extension v1.0.0**: ต้อง load ผ่าน chrome://extensions → Developer mode → Load unpacked
- **Gemini "Create in Slides"**: Feature อาจ session/model dependent — ไม่ได้มีทุก conversation
