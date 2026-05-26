const fs = require('fs');
const logoH = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-h.txt', 'utf-8').trim();
const fontRegular = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-regular-b64.txt', 'utf-8').trim();
const fontSemiBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-semibold-b64.txt', 'utf-8').trim();
const fontBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-bold-b64.txt', 'utf-8').trim();

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>Technical Architecture — Interactive AI Mascot MRT Kiosk</title>
<style>
  @font-face { font-family:'Sarabun'; font-weight:400; src:url(data:font/ttf;base64,${fontRegular}) format('truetype'); }
  @font-face { font-family:'Sarabun'; font-weight:600; src:url(data:font/ttf;base64,${fontSemiBold}) format('truetype'); }
  @font-face { font-family:'Sarabun'; font-weight:700; src:url(data:font/ttf;base64,${fontBold}) format('truetype'); }
  * { margin:0; padding:0; box-sizing:border-box; font-family:'Sarabun',sans-serif!important; }
  @page { size:A4; margin:18mm 18mm 12mm 18mm; }
  body { font-size:9.5pt; color:#222; background:#fff; line-height:1.55; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page { max-width:210mm; margin:0 auto; }

  .doc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .doc-header img { width:80px; }
  .doc-title { font-size:13pt; font-weight:700; color:#1a3f6f; }
  .doc-sub { font-size:8pt; color:#888; margin-top:2px; text-align:right; }
  .blue-line { height:3px; background:#1a3f6f; margin:8px 0 14px 0; }

  h2 { font-size:10.5pt; font-weight:700; color:#1a3f6f; margin:14px 0 5px 0; border-left:4px solid #1a3f6f; padding-left:8px; }
  h3 { font-size:9.5pt; font-weight:600; color:#3d4f6f; margin:8px 0 3px 0; }
  p { font-size:9.5pt; color:#333; margin-bottom:5px; }
  ul { padding-left:16px; margin-bottom:6px; }
  li { font-size:9.5pt; color:#333; margin-bottom:1px; }
  b { color:#222; }

  .flow { display:flex; align-items:center; flex-wrap:wrap; gap:0; margin:8px 0; }
  .flow-box { background:#edf1f7; border:1px solid #c0ccdd; border-radius:5px; padding:5px 8px; font-size:8pt; font-weight:600; color:#1a3f6f; text-align:center; min-width:72px; }
  .flow-box.hi { background:#1a3f6f; color:#fff; border-color:#1a3f6f; }
  .arr { font-size:12pt; color:#3d4f6f; padding:0 3px; }

  .arch-grid { display:flex; gap:8px; margin:8px 0; }
  .arch-layer { flex:1; border:1px solid #c0ccdd; border-radius:5px; overflow:hidden; }
  .arch-head { background:#3d4f6f; color:#fff; padding:4px 8px; font-size:8pt; font-weight:700; text-align:center; }
  .arch-body { padding:7px 9px; font-size:8.5pt; line-height:1.5; color:#333; }
  .arch-body .t { font-weight:700; color:#1a3f6f; }

  .clip-grid { display:flex; gap:8px; margin:8px 0; }
  .clip-col { flex:1; }
  .clip-head { background:#edf1f7; border:1px solid #c0ccdd; border-radius:5px 5px 0 0; padding:4px 10px; font-size:8.5pt; font-weight:700; color:#1a3f6f; }
  .clip-body { border:1px solid #c0ccdd; border-top:none; border-radius:0 0 5px 5px; padding:7px 10px; }
  .clip-item { display:flex; gap:6px; margin-bottom:3px; font-size:8.5pt; }
  .clip-tag { background:#1a3f6f; color:#fff; border-radius:3px; padding:0 5px; font-size:7pt; font-weight:700; white-space:nowrap; align-self:flex-start; margin-top:2px; }
  .clip-tag.loop { background:#27ae60; }
  .clip-tag.one { background:#7f8c8d; }

  .compare-grid { display:flex; gap:8px; margin:8px 0; }
  .compare-box { flex:1; border-radius:5px; padding:8px 10px; font-size:8.5pt; }
  .compare-box.bad { background:#fdf0f0; border:1px solid #e8b4b4; }
  .compare-box.good { background:#f0fdf4; border:1px solid #a8d5b5; }
  .compare-box .head { font-weight:700; margin-bottom:5px; font-size:9pt; }
  .compare-box.bad .head { color:#c0392b; }
  .compare-box.good .head { color:#1e8449; }
  .compare-box li { margin-bottom:2px; }

  table.risk { width:100%; border-collapse:collapse; font-size:8.5pt; margin:6px 0; }
  table.risk thead th { background:#3d4f6f; color:#fff; padding:5px 8px; font-weight:600; text-align:left; }
  table.risk tbody td { padding:5px 8px; border-bottom:1px solid #eee; vertical-align:top; }
  table.risk tbody td:first-child { width:32%; font-weight:600; }
  table.risk tbody td:nth-child(2) { width:13%; text-align:center; }
  .badge { display:inline-block; padding:1px 7px; border-radius:10px; font-size:7.5pt; font-weight:700; }
  .bh { background:#fde8e8; color:#c0392b; }
  .bm { background:#fef3cd; color:#b7770a; }
  .bl { background:#e8f5e9; color:#27ae60; }

  .poc-box { border:2px solid #1a3f6f; border-radius:5px; padding:9px 12px; margin:8px 0; background:#f5f8ff; }
  .poc-box .title { font-weight:700; color:#1a3f6f; font-size:9.5pt; margin-bottom:5px; }
  .poc-item { display:flex; gap:8px; margin-bottom:3px; font-size:9pt; }
  .poc-num { background:#1a3f6f; color:#fff; border-radius:50%; width:17px; height:17px; display:flex; align-items:center; justify-content:center; font-size:7pt; font-weight:700; flex-shrink:0; margin-top:2px; }

  .stack-wrap { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0; }
  .stack-item { background:#edf1f7; border:1px solid #c0ccdd; border-radius:4px; padding:4px 9px; font-size:8pt; color:#1a3f6f; font-weight:600; }

  .note { background:#fffdf0; border-left:3px solid #e0a800; padding:5px 9px; font-size:8.5pt; color:#555; margin:6px 0; border-radius:0 4px 4px 0; }
  .doc-footer { margin-top:16px; padding-top:7px; border-top:1px solid #ddd; font-size:7.5pt; color:#aaa; text-align:center; }
  @media print { body{background:#fff;} .page{max-width:none;} }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <img src="${logoH}" alt="NDF">
    <div>
      <div class="doc-title">Technical Architecture Document</div>
      <div class="doc-sub">Interactive AI Mascot — MRT Kiosk &nbsp;|&nbsp; 21/05/2569</div>
    </div>
  </div>
  <div class="blue-line"></div>

  <!-- 1. OVERVIEW -->
  <h2>1. ภาพรวมระบบ</h2>
  <p>ผู้ใช้พูดคุยกับมาสคอตผ่าน Kiosk ด้วยภาษาไทย/อังกฤษ ระบบ AI ตอบสนองพร้อมเสียงและขยับปากตามเสียงจริง โดยใช้วิดีโอคลิปที่เตรียมไว้ล่วงหน้าแทนการสร้างภาพเคลื่อนไหวแบบ real-time</p>

  <!-- 2. DATA FLOW -->
  <h2>2. ลำดับการทำงาน</h2>
  <div class="flow">
    <div class="flow-box">ผู้ใช้<br>พูด/พิมพ์</div><div class="arr">→</div>
    <div class="flow-box">แปลงเสียง<br>เป็นข้อความ</div><div class="arr">→</div>
    <div class="flow-box hi">AI คิด<br>+ ค้นข้อมูล</div><div class="arr">→</div>
    <div class="flow-box">แปลงข้อความ<br>เป็นเสียง</div><div class="arr">→</div>
    <div class="flow-box">เลือก<br>คลิปปาก</div><div class="arr">→</div>
    <div class="flow-box">มาสคอต<br>พูด + ขยับ</div>
  </div>

  <!-- 3. ARCHITECTURE -->
  <h2>3. โครงสร้างระบบ</h2>
  <div class="arch-grid">
    <div class="arch-layer">
      <div class="arch-head">🎭 แสดงผล</div>
      <div class="arch-body">
        <div><span class="t">ท่าทาง</span> — วิดีโอ 2 ชั้นสลับกันแสดง แทบไม่มีความล่าช้า</div>
        <br>
        <div><span class="t">ปาก</span> — สลับคลิปรูปปากตามเสียงที่พูดออกมา (ดูข้อ 4)</div>
      </div>
    </div>
    <div class="arch-layer">
      <div class="arch-head">⚙️ ควบคุม</div>
      <div class="arch-body">
        <div><span class="t">กำหนดการขยับปาก</span> — รับสัญญาณจาก Azure TTS แล้วสลับคลิปปากให้ตรงเวลา</div>
        <br>
        <div><span class="t">ควบคุมท่าทาง</span> — จัดการการเปลี่ยนสถานะ: รอ → ได้ยิน → กำลังพูด → รอ</div>
        <br>
        <div><span class="t">วิเคราะห์คำตอบ</span> — อ่านคำตอบจาก AI แล้วเลือกท่าทางที่เหมาะ</div>
      </div>
    </div>
    <div class="arch-layer">
      <div class="arch-head">🧠 AI และเสียง</div>
      <div class="arch-body">
        <div><span class="t">ระบบ AI</span> — Claude/GPT + ฐานข้อมูล MRT</div>
        <br>
        <div><span class="t">แปลงข้อความเป็นเสียง</span> — Azure TTS เสียงไทย/อังกฤษ พร้อมสัญญาณรูปปาก 22 แบบ</div>
        <br>
        <div><span class="t">รับเสียงผู้ใช้</span> — ผ่าน browser (Plan A) / Whisper API (Plan B)</div>
      </div>
    </div>
  </div>

  <!-- 4. CLIPS -->
  <h2>4. วิดีโอคลิปของมาสคอต</h2>
  <div class="clip-grid">
    <div class="clip-col">
      <div class="clip-head">คลิปท่าทาง</div>
      <div class="clip-body">
        <div class="clip-item"><span class="clip-tag loop">LOOP</span><span><b>Idle</b> — ยืนพัก กะพริบตา</span></div>
        <div class="clip-item"><span class="clip-tag loop">LOOP</span><span><b>Talking</b> — ตัวโยกขณะออกเสียง</span></div>
        <div class="clip-item"><span class="clip-tag loop">LOOP</span><span><b>Thinking</b> — เกาหัว/มองขึ้น ขณะ AI ประมวลผล</span></div>
        <div class="clip-item"><span class="clip-tag one">ONE</span><span><b>Greeting</b> — โบกมือต้อนรับ</span></div>
        <div class="clip-item"><span class="clip-tag one">ONE</span><span><b>Pointing</b> — ชี้ทิศทาง/แผนที่</span></div>
        <div class="clip-item"><span class="clip-tag one">ONE</span><span><b>Happy</b> — พยักหน้า ยิ้ม</span></div>
        <div class="clip-item"><span class="clip-tag one">ONE</span><span><b>Sorry</b> — ส่ายหัว ยกมือ</span></div>
        <div class="clip-item"><span class="clip-tag one">ONE</span><span><b>Goodbye</b> — โบกมือลา</span></div>
      </div>
    </div>
    <div class="clip-col">
      <div class="clip-head">คลิปรูปปาก (ฝังในคลิปล่วงหน้า)</div>
      <div class="clip-body">
        <p style="font-size:8.5pt;color:#555;margin-bottom:6px;">Azure TTS บอกได้ว่าแต่ละช่วงเวลาปากอยู่ท่าไหน — เจนคลิปแยก 4 ท่าปาก <b>ฝังเข้าไปในคลิปตั้งแต่ต้น</b> ให้ตัวขยับและปากอยู่ในวิดีโอเดียวกัน</p>
        <div class="clip-item"><span class="clip-tag" style="background:#8e44ad;">M</span><span><b>mouth-open</b> — เสียง อา โอ</span></div>
        <div class="clip-item"><span class="clip-tag" style="background:#8e44ad;">M</span><span><b>mouth-mid</b> — เสียง เอ อี</span></div>
        <div class="clip-item"><span class="clip-tag" style="background:#8e44ad;">M</span><span><b>mouth-small</b> — เสียง อู</span></div>
        <div class="clip-item"><span class="clip-tag" style="background:#8e44ad;">M</span><span><b>mouth-closed</b> — เสียง ม พ บ หรือเงียบ</span></div>
        <p style="font-size:8pt;color:#888;margin-top:6px;">สลับคลิปตามสัญญาณจาก Azure — ตัวมาสคอตขยับได้ปกติเพราะปากฝังอยู่ในคลิปแล้ว</p>
      </div>
    </div>
  </div>

  <!-- WHY PRE-BAKE -->
  <h3>ทำไมถึงฝังรูปปากในคลิปแทนการวาดทับหน้าจอ?</h3>
  <div class="compare-grid">
    <div class="compare-box bad">
      <div class="head">❌ วาดปากทับหน้าจอ (ไม่เลือกใช้)</div>
      <ul>
        <li>วาดปากทับที่ตำแหน่งตายตัวบนหน้าจอ</li>
        <li>ถ้าตัวมาสคอตขยับ → ปากลอยออกจากหน้า</li>
        <li>ต้องคำนวณตำแหน่งปากทุก frame — ซับซ้อนมาก</li>
        <li>อาจมีความล่าช้าระหว่างตัวและปาก</li>
      </ul>
    </div>
    <div class="compare-box good">
      <div class="head">✅ ฝังรูปปากในคลิปตั้งแต่ต้น (เลือกใช้)</div>
      <ul>
        <li>รูปปากอยู่ในวิดีโอแล้ว ไม่ต้องคำนวณเพิ่ม</li>
        <li>ตัวขยับได้อิสระ ปากติดหน้าเสมอ</li>
        <li>สลับระหว่าง 4–6 คลิปตามสัญญาณเสียง</li>
        <li>ผลลัพธ์ไหลลื่นกว่า ไม่มีความล่าช้า</li>
      </ul>
    </div>
  </div>
  <div class="note">⚠️ เสียงภาษาไทยบางเสียงอาจไม่ตรงกับรูปปากที่ Azure กำหนดไว้ 100% ความแม่นยำต้องทดสอบก่อนนำไปใช้จริง</div>

  <!-- 5. TECH STACK -->
  <h2>5. Technology Stack</h2>
  <div class="stack-wrap">
    <div class="stack-item">Azure Cognitive Services TTS</div>
    <div class="stack-item">Claude API / GPT-4o</div>
    <div class="stack-item">Web Speech API / Whisper</div>
    <div class="stack-item">HTML5 Video (Double Buffer)</div>
    <div class="stack-item">requestVideoFrameCallback</div>
    <div class="stack-item">Electron (Kiosk Mode)</div>
    <div class="stack-item">Node.js Backend</div>
    <div class="stack-item">WebM/VP9 with Alpha</div>
  </div>

  <!-- 6. API USAGE -->
  <h2>6. ค่าใช้จ่าย API และข้อจำกัด</h2>

  <h3>Azure TTS — Text-to-Speech (เสียงมาสคอต)</h3>
  <div style="display:flex;gap:8px;margin:6px 0;">
    <div style="flex:1;background:#f0fdf4;border:1px solid #a8d5b5;border-radius:5px;padding:8px 10px;">
      <div style="font-weight:700;color:#1e8449;font-size:9pt;margin-bottom:4px;">✅ Free Tier (F0)</div>
      <ul style="font-size:8.5pt;color:#333;padding-left:14px;">
        <li><b>500,000 ตัวอักษร/เดือน ฟรี</b></li>
        <li>≈ มาสคอตพูดได้ประมาณ <b>3,000–5,000 ประโยค/เดือน</b></li>
        <li>งานนิทรรศการไม่กี่วัน — <b>น่าจะไม่เกิน free tier</b></li>
        <li>1 Azure account สร้าง free Speech resource ได้ 1 ตัว</li>
      </ul>
    </div>
    <div style="flex:1;background:#fdf8f0;border:1px solid #e8d5a8;border-radius:5px;padding:8px 10px;">
      <div style="font-weight:700;color:#b7770a;font-size:9pt;margin-bottom:4px;">⚡ เมื่อเกิน Free Tier (S0)</div>
      <ul style="font-size:8.5pt;color:#333;padding-left:14px;">
        <li>คิดเงินเฉพาะ <b>ส่วนที่เกิน</b> — ระบบไม่หยุดทำงาน</li>
        <li>อัตรา <b>$16 / 1,000,000 ตัวอักษร</b> (~540 บาท)</li>
        <li>ใช้งาน production รายเดือน ≈ <b>500–2,000 บาท/เดือน</b></li>
      </ul>
    </div>
  </div>
  <div class="note" style="margin-bottom:8px;">📍 เลือก Region: <b>Southeast Asia (Singapore)</b> — ใกล้ไทยที่สุด เสียงออกเร็วกว่าเลือก US หรือ Europe</div>

  <h3>LLM API — ระบบ AI ตอบคำถาม</h3>
  <div style="display:flex;gap:8px;margin:6px 0 10px 0;">
    <div style="flex:1;background:#edf1f7;border:1px solid #c0ccdd;border-radius:5px;padding:8px 10px;font-size:8.5pt;color:#333;">
      <div style="font-weight:700;color:#1a3f6f;margin-bottom:3px;">Plan A — งานนิทรรศการ</div>
      traffic น้อย ประมาณการค่า LLM ไม่เกิน <b>500–1,500 บาท/เดือน</b>
    </div>
    <div style="flex:1;background:#edf1f7;border:1px solid #c0ccdd;border-radius:5px;padding:8px 10px;font-size:8.5pt;color:#333;">
      <div style="font-weight:700;color:#1a3f6f;margin-bottom:3px;">Plan B — Production</div>
      ใช้งานระยะยาว ประมาณการค่า API รวม <b>3,000–8,000 บาท/เดือน</b>
    </div>
  </div>

  <!-- 7. RISK -->
  <h2>7. ความเสี่ยงและแนวทางลด</h2>
  <table class="risk">
    <thead><tr><th>ความเสี่ยง</th><th>ระดับ</th><th>แนวทาง</th></tr></thead>
    <tbody>
      <tr><td>เสียงกับปากไม่ตรงกันเมื่อใช้งานนาน</td><td><span class="badge bh">สูง</span></td><td>ตรวจสอบตำแหน่งเสียงแบบ real-time แทนการนับเวลาตายตัว</td></tr>
      <tr><td>ต้องมีอินเทอร์เน็ตตลอดเวลา</td><td><span class="badge bh">สูง</span></td><td>เตรียมเสียงบันทึกไว้ล่วงหน้าสำหรับคำตอบพื้นฐาน พร้อมแจ้งผู้ใช้เมื่อเน็ตหลุด</td></tr>
      <tr><td>รูปปากภาษาไทยอาจไม่แม่นเท่าภาษาอังกฤษ</td><td><span class="badge bm">กลาง</span></td><td>ทดสอบก่อน — ถ้าไม่ผ่านให้ขยับปากตามความดังเสียงแทน</td></tr>
      <tr><td>ระบบทำงานหนักขึ้นเมื่อเปิดทิ้งไว้นาน</td><td><span class="badge bm">กลาง</span></td><td>นำวิดีโอเดิมกลับมาใช้ซ้ำ ไม่สร้างใหม่ทุกครั้ง</td></tr>
      <tr><td>รับเสียงผิดพลาดในสภาพแวดล้อมที่เสียงดัง</td><td><span class="badge bm">กลาง</span></td><td>Plan B ใช้ Whisper API ซึ่งแม่นยำกว่าในที่เสียงรบกวน</td></tr>
      <tr><td>Kiosk ไม่ยอมเล่นวิดีโออัตโนมัติ</td><td><span class="badge bl">ต่ำ</span></td><td>ตั้งค่า Electron ให้อนุญาตการเล่นอัตโนมัติ</td></tr>
    </tbody>
  </table>

  <!-- 8. POC -->
  <h2>8. การทดสอบความเป็นไปได้ (POC) — 2–3 วันก่อนเริ่มโครงการ</h2>
  <div class="poc-box">
    <div class="title">3 สิ่งที่ต้องทดสอบก่อนยืนยัน scope</div>
    <div class="poc-item"><div class="poc-num">1</div><div><b>คุณภาพรูปปากภาษาไทย</b> — ทดสอบว่า Azure TTS ส่งสัญญาณรูปปากภาษาไทยได้แม่นและตรงเวลาพอสำหรับการขยับปาก</div></div>
    <div class="poc-item"><div class="poc-num">2</div><div><b>การสลับคลิปปาก</b> — ทดสอบความลื่นของการสลับคลิปบน hardware kiosk จริง</div></div>
    <div class="poc-item"><div class="poc-num">3</div><div><b>แผนสำรอง</b> — ถ้าสัญญาณปากไม่ดีพอ ให้ขยับปากตามความดังเสียงแทน — ง่ายกว่าและไม่ต้องรอสัญญาณ</div></div>
  </div>
  <div class="note">ราคาในใบเสนอราคาอ้างอิงจากวิธีการที่วางแผนไว้ข้างต้น หากผลการทดสอบพบว่าต้องปรับวิธีอย่างมีนัยสำคัญ ผู้รับจ้างจะแจ้งให้ทราบก่อนดำเนินการต่อ</div>

  <div class="doc-footer">บริษัท เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ จำกัด &nbsp;|&nbsp; เอกสารประกอบใบเสนอราคาเท่านั้น &nbsp;|&nbsp; 21 พฤษภาคม 2569</div>

</div>
</body>
</html>`;

fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/mrt-mascot-tech-doc.html', html, 'utf-8');
console.log('Tech doc HTML written:', html.length, 'bytes');
