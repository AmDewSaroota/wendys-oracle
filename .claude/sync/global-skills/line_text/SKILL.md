---
name: line_text
description: Analyze LINE chat export .txt files and produce summary .md + .html reports. Use when user says "/line_text", "analyze LINE chat", "summarize LINE export", or "parse LINE conversation".
user-invocable: true
argument-hint: [path/to/export.txt]
allowed-tools: Read, Write, Bash
---

# /line_text — LINE Chat Analyzer

Read a LINE .txt chat export and produce a structured summary in both `.md` and `.html` formats.

## Step 0: Resolve Paths

Parse `$ARGUMENTS` to get the input file path. Run Bash to derive the output path:

```bash
INPUT="$ARGUMENTS"
DIR=$(dirname "$INPUT")
BASENAME=$(basename "$INPUT" .txt)
echo "INPUT=$INPUT"
echo "OUTPUT_MD=$DIR/$BASENAME.md"
echo "OUTPUT_HTML=$DIR/$BASENAME.html"
```

Store INPUT, OUTPUT_MD, and OUTPUT_HTML paths for later.

## Step 1: Read the File

Use the Read tool to read the full file at the INPUT path.

If the file does not exist or is empty, STOP and tell the user:
```
ไม่พบไฟล์ค่ะ: [path]
กรุณาตรวจสอบ path อีกครั้งนะคะ
```

## Step 2: Parse Header

Extract from the first 3-5 lines:

**Group/Contact Name** — from either format:
- English: `[LINE] Chat history with <NAME>`
- Thai: `[LINE] ประวัติการสนทนากับ <NAME>`

**Export Date** — from either:
- English: `Saved on: YYYY/MM/DD HH:MM`
- Thai: `บันทึกวันที่: YYYY/MM/DD HH:MM`

If no header found, set Name = "Unknown" and Export Date = "Unknown".

## Step 3: Parse All Messages

Scan every line. Identify these patterns:

### Date Header
Pattern: `YYYY/MM/DD(Day)` or `YYYY.MM.DD Day`
Examples: `2024/01/15(Mon)`, `2024.01.15 Monday`
Action: Update current date context.

### Message Line
Pattern: `HH:MM\t<Sender>\t<Text>` (tab-separated, 3 fields)
Action: Record { date, time, sender, text, type }

Classify message **type** by text content:
- `[Photo]` or `[ภาพ]` → photo
- `[Video]` or `[วิดีโอ]` → video
- `[Sticker]` or `[สติกเกอร์]` → sticker
- `[File]` or `[ไฟล์]` → file
- `[Voice message]` or `[ข้อความเสียง]` → voice
- `[Location]` or `[ตำแหน่ง]` → location
- `[Contact]` or `[ผู้ติดต่อ]` → contact
- `[Poll]` or `[โหวต]` → poll
- Starts with `☎` → call
- Empty sender + contains "unsent a message" or "ยกเลิกการส่งข้อความ" → unsent
- Otherwise → text

### Continuation Line
Pattern: No `HH:MM\t` prefix at start, follows a message line.
Action: Append to the previous message's text (multi-line message). Do NOT count as a separate message.

### System Event
Pattern: No tab structure, freeform text like "joined the group", "left the group", "เข้าร่วมกลุ่ม", "ออกจากกลุ่ม"
Action: Note as system event in timeline. Do not count as participant message.

### Empty Line
Action: Skip (day boundary marker).

## Step 4: Build Statistics

From all parsed messages, compute:

1. **Participants**: Unique sender names (exclude empty/system)
2. **Message count per participant**: text + media messages per sender
3. **Date range**: First date → last date
4. **Total active days**: Count of unique dates with messages
5. **Media counts**: photos, videos, stickers, files, voice, calls (each type)
6. **Most active day**: Date with highest message count
7. **Busiest hour**: Group messages by HH (24h), find peak
8. **Peak time window**: Classify peak hour into:
   - เช้า (Morning) 06:00-11:59
   - บ่าย (Afternoon) 12:00-17:59
   - เย็น/ค่ำ (Evening) 18:00-21:59
   - ดึก (Night) 22:00-05:59

## Step 5: Build Timeline

Group messages by date. For each date, note:
- Total message count
- Active senders
- Key moments: first message, media shared, long messages (>100 chars), system events

Flag "high activity" days (more than 2x the daily average).

**If more than 50 active dates**: Show only the 50 most significant days (highest activity + first/last). Note the truncation.

## Step 6: Extract Key Topics

Scan text-type messages only:

1. **Recurring themes**: Words/phrases appearing 3+ times across different messages
2. **Questions asked**: Messages ending with `?` or `?`
3. **Decisions/agreements**: Messages containing keywords like "ตกลง", "โอเค", "OK", "agree", "confirmed", "นัด", "เจอกัน"
4. **Links shared**: URLs (http/https)
5. **Important mentions**: Dates, places, names mentioned repeatedly

Consolidate into **top 5-10 topics** with brief descriptions.

## Step 7: Write Output .md

Use the Write tool to save to the OUTPUT_MD path from Step 0.

### Output Template:

```markdown
# LINE Chat Summary: <GroupName>

**Source**: `<filename.txt>`
**Exported**: <ExportDate>
**Analyzed**: <Today YYYY-MM-DD>

---

## Overview

| | |
|---|---|
| Chat Name | <GroupName> |
| Date Range | YYYY-MM-DD → YYYY-MM-DD |
| Days Active | N days |
| Total Messages | N |
| Participants | N people |

---

## Participants

| Name | Messages | % |
|------|----------|---|
| Alice | 142 | 45% |
| Bob | 87 | 27% |

---

## Media & Activity

| Type | Count |
|------|-------|
| Text | N |
| Photos | N |
| Videos | N |
| Stickers | N |
| Voice | N |
| Calls | N |
| Files | N |

*(Omit rows with 0 count)*

---

## Time Analysis

| | |
|---|---|
| Most Active Day | YYYY-MM-DD (N messages) |
| Busiest Hour | HH:00-HH:59 (N messages) |
| Peak Period | เช้า/บ่าย/เย็น/ดึก |

### Monthly Activity (if chat spans >1 month)

| Month | Messages |
|-------|----------|
| YYYY-MM | N |

---

## Conversation Timeline

| Date | Day | Msgs | Highlights |
|------|-----|------|------------|
| YYYY-MM-DD | Mon | 15 | Topic started, Photo shared |

*(Showing N of N active days)*

---

## Key Topics

1. **<Topic>** — <brief description with example quotes>
2. **<Topic>** — ...

---

## Links Shared

- URL (by Sender, YYYY-MM-DD)

*(Omit this section entirely if no links were shared)*

---

## Notable Moments

- **First message**: YYYY-MM-DD HH:MM — "<text>"
- **Last message**: YYYY-MM-DD HH:MM — "<text>"
- **Longest gap**: N days (YYYY-MM-DD → YYYY-MM-DD)
- **Busiest day**: YYYY-MM-DD (N messages)

---

*Generated by /line_text | WEnDyS Oracle*
```

### Important rules for output:
- Omit any section that has no data (no empty tables)
- Use Thai labels for time periods (เช้า/บ่าย/เย็น/ดึก)
- Keep the file clean and scannable

## Step 7.5: Write Output .html

Use the Write tool to save to the OUTPUT_HTML path from Step 0.

Create a standalone HTML file with **embedded CSS** (no external dependencies). The HTML report should contain the SAME data as the .md but presented as a beautiful, modern dashboard.

### HTML Design Requirements:
- **Standalone**: All CSS embedded in `<style>` tag — no CDN, no external files
- **Modern look**: Clean sans-serif font (system fonts), subtle gradients, rounded corners, card-based layout
- **Color scheme**: LINE green (`#06C755`) as primary accent, dark text on white background
- **Responsive**: Works on both desktop and mobile
- **Thai-friendly**: Use `font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif`

### HTML Structure:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LINE Chat Summary: <GroupName></title>
  <style>
    /* Modern dashboard CSS */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', 'Noto Sans Thai', -apple-system, sans-serif;
      background: #f5f5f5; color: #333; line-height: 1.6;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    .header {
      background: linear-gradient(135deg, #06C755, #04a648);
      color: white; padding: 30px; border-radius: 16px;
      margin-bottom: 24px; text-align: center;
    }
    .header h1 { font-size: 1.8em; margin-bottom: 8px; }
    .header .meta { opacity: 0.9; font-size: 0.9em; }
    .card {
      background: white; border-radius: 12px; padding: 24px;
      margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card h2 {
      font-size: 1.2em; color: #06C755; margin-bottom: 16px;
      padding-bottom: 8px; border-bottom: 2px solid #e8f5e9;
    }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }
    .stat-item {
      text-align: center; padding: 16px; background: #f8faf8;
      border-radius: 8px;
    }
    .stat-item .number { font-size: 1.8em; font-weight: 700; color: #06C755; }
    .stat-item .label { font-size: 0.85em; color: #666; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8faf8; color: #555; font-weight: 600; text-align: left; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.9em; }
    tr:hover { background: #fafffe; }
    .bar {
      height: 8px; background: #06C755; border-radius: 4px;
      display: inline-block; vertical-align: middle;
    }
    .topic-tag {
      display: inline-block; background: #e8f5e9; color: #2e7d32;
      padding: 4px 12px; border-radius: 20px; margin: 4px; font-size: 0.85em;
    }
    .timeline-date { font-weight: 600; color: #06C755; }
    .timeline-highlight { color: #666; font-size: 0.85em; }
    .footer {
      text-align: center; padding: 20px; color: #999; font-size: 0.8em;
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .container { padding: 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header card with group name, date range, export info -->
    <div class="header">
      <h1>💬 <GroupName></h1>
      <div class="meta">
        <div>Date Range • Days Active</div>
        <div>Exported: date | Analyzed: today</div>
      </div>
    </div>

    <!-- Overview stats grid: Total Messages, Participants, Days Active, Most Active Day -->
    <div class="card">
      <h2>📊 Overview</h2>
      <div class="stats-grid">
        <div class="stat-item"><div class="number">N</div><div class="label">ข้อความ</div></div>
        <div class="stat-item"><div class="number">N</div><div class="label">คน</div></div>
        <div class="stat-item"><div class="number">N</div><div class="label">วัน</div></div>
        <div class="stat-item"><div class="number">HH:00</div><div class="label">ชั่วโมง peak</div></div>
      </div>
    </div>

    <!-- Participants table with bar chart visualization -->
    <div class="card">
      <h2>👥 Participants</h2>
      <table>
        <tr><th>Name</th><th>Messages</th><th>%</th><th></th></tr>
        <!-- For each participant: name, count, %, bar visualization -->
        <!-- Bar width = (participant_count / max_count) * 100% -->
      </table>
    </div>

    <!-- Media & Activity table -->
    <div class="card">
      <h2>📎 Media & Activity</h2>
      <!-- Same table as .md but only rows with count > 0 -->
    </div>

    <!-- Time Analysis -->
    <div class="card">
      <h2>⏰ Time Analysis</h2>
      <!-- Most active day, busiest hour, peak period -->
      <!-- Monthly activity table if >1 month -->
    </div>

    <!-- Timeline -->
    <div class="card">
      <h2>📅 Conversation Timeline</h2>
      <table>
        <tr><th>Date</th><th>Day</th><th>Msgs</th><th>Highlights</th></tr>
        <!-- Timeline rows -->
      </table>
    </div>

    <!-- Key Topics as tags -->
    <div class="card">
      <h2>💡 Key Topics</h2>
      <!-- Topics as .topic-tag spans -->
      <!-- Then detailed list below -->
    </div>

    <!-- Links Shared (only if links exist) -->

    <!-- Notable Moments -->
    <div class="card">
      <h2>⭐ Notable Moments</h2>
      <!-- First/last message, longest gap, busiest day -->
    </div>

    <div class="footer">
      Generated by /line_text | WEnDyS Oracle<br>
      Source: filename.txt
    </div>
  </div>
</body>
</html>
```

### Important HTML rules:
- Fill in ALL data from the parsed results — same content as the .md
- The participant bars should be proportional (widest = 100%, others scaled)
- Omit sections with no data
- Escape HTML special chars in message text (`<`, `>`, `&`)
- Use actual numbers, not placeholders

## Step 8: Confirm to User

After writing both files, respond in Thai:

```
วิเคราะห์เสร็จแล้วค่ะ 📊

<GroupName> — <DateRange>
<N> ข้อความ, <N> คน, <N> วัน

บันทึกไว้ที่:
  📄 <OUTPUT_MD path>
  🌐 <OUTPUT_HTML path>
```

If 0 messages were parsed, warn instead:
```
อ่านไฟล์ได้ แต่ไม่พบข้อความในรูปแบบ LINE ค่ะ
กรุณาตรวจสอบว่าไฟล์เป็น LINE export (.txt) ที่ถูกต้องนะคะ
```

ARGUMENTS: $ARGUMENTS
