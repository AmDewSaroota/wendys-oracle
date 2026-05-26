const fs = require('fs');
const logoH = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-h.txt', 'utf-8').trim();
const logoF = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-f.txt', 'utf-8').trim();
const sig = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-sig.txt', 'utf-8').trim();
const fontRegular = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-regular-b64.txt', 'utf-8').trim();
const fontSemiBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-semibold-b64.txt', 'utf-8').trim();
const fontBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-bold-b64.txt', 'utf-8').trim();

const BASE_STYLE = `
  @font-face { font-family:'Sarabun'; font-weight:400; src:url(data:font/ttf;base64,${fontRegular}) format('truetype'); }
  @font-face { font-family:'Sarabun'; font-weight:600; src:url(data:font/ttf;base64,${fontSemiBold}) format('truetype'); }
  @font-face { font-family:'Sarabun'; font-weight:700; src:url(data:font/ttf;base64,${fontBold}) format('truetype'); }
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Sarabun',sans-serif!important;}
  @page{size:A4;margin:18mm 18mm 12mm 18mm;}
  body{font-family:'Sarabun',sans-serif!important;font-size:10pt;color:#222;background:#fff;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{max-width:210mm;margin:0 auto;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;}
  .header-left{display:flex;align-items:flex-start;gap:12px;flex:1;margin-right:16px;}
  .logo-img{width:95px;min-width:95px;padding-top:2px;}
  .logo-img img{width:95px;height:auto;}
  .company-info{font-size:8pt;line-height:1.55;color:#333;flex:1;}
  .company-info .th{font-size:10.5pt;font-weight:700;color:#1a3f6f;line-height:1.3;white-space:nowrap;}
  .company-info .en{font-size:8.5pt;color:#555;}
  .header-right{text-align:right;white-space:nowrap;padding-top:8px;min-width:190px;}
  .qt-title{font-size:15pt;font-weight:700;color:#1a3f6f;line-height:1.1;}
  .qt-sub{font-size:5.5pt;color:#aaa;font-weight:400;}
  .blue-line{height:3px;background:#1a3f6f;margin:10px 0 16px 0;}
  .info-row{display:flex;justify-content:space-between;margin-bottom:16px;}
  .info-left{width:56%;}.info-right{width:40%;}
  .info-label{font-size:9.5pt;font-weight:700;color:#1a3f6f;text-decoration:underline;margin-bottom:3px;}
  .info-body{font-size:10pt;line-height:1.55;}
  .blank{display:inline-block;border-bottom:1px solid #aaa;min-width:200px;height:14px;}
  .doc-line{font-size:10pt;line-height:1.6;}
  .doc-line .lbl{color:#555;}
  .doc-line .val{font-weight:700;}
  .blank-val{display:inline-block;border-bottom:1px solid #aaa;min-width:130px;height:14px;vertical-align:bottom;}
  table.items{width:100%;border-collapse:collapse;font-size:9.5pt;}
  table.items thead th{background:#3d4f6f;color:#fff;padding:6px 8px;font-size:9pt;font-weight:600;text-align:center;border:none;}
  table.items thead th:first-child{border-radius:4px 0 0 0;}
  table.items thead th:last-child{border-radius:0 4px 0 0;}
  table.items thead th:nth-child(2){text-align:left;}
  table.items tbody td{padding:6px 8px;vertical-align:top;border-bottom:1px solid #e8e8e8;font-size:9.5pt;}
  table.items tbody td:nth-child(1){text-align:center;width:5%;}
  table.items tbody td:nth-child(2){width:49%;}
  table.items tbody td:nth-child(3){text-align:center;width:10%;}
  table.items tbody td:nth-child(4){text-align:right;width:16%;}
  table.items tbody td:nth-child(5){text-align:right;width:20%;}
  .item-name{font-weight:700;font-size:9.5pt;}
  .item-desc{font-size:8pt;color:#666;line-height:1.4;margin-top:1px;}
  .totals-row{display:flex;justify-content:space-between;align-items:flex-start;border-top:2px solid #3d4f6f;padding-top:8px;margin-top:4px;}
  .total-words{background:#edf1f7;border-radius:0 4px 4px 0;border-left:3px solid #1a3f6f;padding:6px 10px;max-width:300px;}
  .total-words .lbl{font-size:7.5pt;color:#777;}
  .total-words .txt{font-size:9.5pt;font-weight:700;color:#1a3f6f;text-decoration:underline;}
  .total-nums{text-align:right;font-size:9.5pt;line-height:1.7;}
  .total-nums .row{display:flex;justify-content:flex-end;gap:18px;}
  .total-nums .row .lbl{color:#555;text-align:right;min-width:145px;}
  .total-nums .row .val{min-width:90px;text-align:right;}
  .total-nums .grand{font-weight:700;font-size:11pt;color:#1a3f6f;border-top:1px solid #ccc;padding-top:2px;margin-top:2px;}
  .addons-box{border:1px dashed #3d4f6f;border-radius:4px;padding:8px 12px;margin-top:12px;font-size:8.5pt;color:#444;}
  .addons-box .title{font-weight:700;color:#1a3f6f;margin-bottom:4px;font-size:9pt;}
  .addons-box table{width:100%;font-size:8.5pt;border-collapse:collapse;}
  .addons-box table td{padding:2px 6px;}
  .addons-box table td:first-child{width:60%;color:#333;}
  .addons-box table td:last-child{text-align:right;color:#1a3f6f;font-weight:600;}
  .conditions-box{border:1px solid #e0a800;border-left:4px solid #e0a800;border-radius:4px;padding:8px 12px;margin-top:12px;font-size:8.5pt;background:#fffdf0;}
  .conditions-box .title{font-weight:700;color:#b8860b;margin-bottom:4px;font-size:9pt;}
  .conditions-box table{width:100%;font-size:8.5pt;border-collapse:collapse;}
  .conditions-box table td{padding:2px 6px;vertical-align:top;}
  .conditions-box table td:first-child{width:35%;font-weight:600;color:#555;}
  .payment{border:1px solid #ccc;border-radius:4px;padding:8px 12px;margin-top:12px;font-size:9.5pt;line-height:1.55;}
  .payment .title{font-weight:700;color:#1a3f6f;text-decoration:underline;margin-bottom:2px;}
  .payment .body{color:#444;}
  .payment .body b{color:#222;}
  .sig-row{display:flex;justify-content:space-between;margin-top:24px;}
  .sig-box{width:42%;text-align:center;}
  .sig-line-area{height:55px;display:flex;align-items:flex-end;justify-content:center;}
  .sig-line-area img{height:55px;display:block;margin:0 auto 3px;}
  .sig-line{border:none;border-top:2px solid #555;width:100%;margin:0;padding:0;}
  .sig-label{padding-top:3px;font-size:9pt;color:#444;white-space:nowrap;}
  .sig-date{font-size:8pt;color:#888;margin-top:1px;}
  .sig-logo{margin-top:10px;}
  .sig-logo img{height:65px;}
  .validity{text-align:center;font-size:8.5pt;color:#aaa;margin-top:8px;padding-top:5px;border-top:1px solid #ddd;}
  @media print{body{background:#fff;}.page{max-width:none;padding:0;}}
`;

function makeHeader(duration) {
  return `
  <div class="header">
    <div class="header-left">
      <div class="logo-img"><img src="${logoH}" alt="NDF"></div>
      <div class="company-info">
        <div class="th">บริษัท เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ จำกัด (สำนักงานใหญ่)</div>
        <div class="en">NDF X Interactive Co., Ltd. (Head Office)</div>
        <div>191/11 พฤกษ์สราญ สารภี หมู่ 3 ต.หนองผึ้ง อ.สารภี จ.เชียงใหม่ 50140</div>
        <div>เลขประจำตัวผู้เสียภาษี: 0505568003055</div>
      </div>
    </div>
    <div class="header-right">
      <div class="qt-title">ใบเสนอราคา</div>
      <div class="qt-sub">Quotation</div>
    </div>
  </div>
  <div class="blue-line"></div>
  <div class="info-row">
    <div class="info-left">
      <div class="info-label">ลูกค้า / CUSTOMER</div>
      <div class="info-body">
        <div><span class="blank" style="min-width:220px;"></span></div>
        <div><span class="blank" style="min-width:240px;margin-top:4px;"></span></div>
        <div><span class="blank" style="min-width:180px;margin-top:4px;"></span></div>
      </div>
    </div>
    <div class="info-right">
      <div class="info-label">เอกสาร / DOCUMENT</div>
      <div class="doc-line"><span class="lbl">เลขที่:</span> <span class="blank-val"></span></div>
      <div class="doc-line"><span class="lbl">วันที่:</span> <span class="val">21/05/2569</span></div>
      <div class="doc-line"><span class="lbl">มีผลถึง:</span> <span class="val">20/06/2569</span></div>
      <div class="doc-line"><span class="lbl">ระยะเวลา:</span> <span class="val">${duration} *</span></div>
    </div>
  </div>
  <div style="text-align:right;font-size:7.5pt;color:#888;margin-top:-10px;margin-bottom:10px;">* นับจากวันที่ได้รับ Resource ครบ (Asset มาสคอต + ข้อมูล MRT)</div>
`;};

const PAYMENT_SIG = `
  <div class="payment">
    <div class="title">ช่องทางชำระเงิน / Payment Information</div>
    <div class="body">
      ธนาคาร: <b>ธนาคารทหารไทยธนชาติ จำกัด (มหาชน)</b> สาขาบิ๊กซี เชียงใหม่<br>
      ชื่อบัญชี: บริษัท เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ จำกัด<br>
      ประเภท: ออมทรัพย์ | เลขที่บัญชี: <b>485-2-75921-8</b>
    </div>
  </div>
  <div class="sig-row">
    <div class="sig-box">
      <div class="sig-line-area"></div>
      <hr class="sig-line">
      <div class="sig-label">ผู้อนุมัติ / ลูกค้า</div>
      <div class="sig-date">วันที่ ____/____/________</div>
    </div>
    <div class="sig-box">
      <div class="sig-line-area"><img src="${sig}" alt="signature"></div>
      <hr class="sig-line">
      <div class="sig-label">ผู้เสนอราคา / ภิญโญ ตัณรัตนมณฑล</div>
      <div class="sig-date">วันที่ 21/05/2569</div>
      <div class="sig-logo"><img src="${logoF}" alt="NDF"></div>
    </div>
  </div>
  <div class="validity">ใบเสนอราคานี้มีผลถึงวันที่ 20 มิถุนายน 2569</div>
`;

function makeAddons(planA) {
  const apiNote = planA
    ? `ค่าบริการ API รายเดือน (Azure TTS + AI) ประมาณ <b>500–1,500 บาท/เดือน</b> สำหรับการใช้งานในงานนิทรรศการ — ไม่รวมในราคาข้างต้น`
    : `ค่าบริการ API รายเดือน (Azure TTS + AI) ประมาณ <b>3,000–8,000 บาท/เดือน</b> สำหรับการใช้งานระยะยาว — ไม่รวมในราคาข้างต้น`;
  return `
  <div class="addons-box">
    <div class="title">⭐ บริการเสริม (Add-ons) — ราคาและระยะเวลาไม่รวมในข้างต้น</div>
    <table>
      <thead style="color:#555;font-weight:600;font-size:8pt;">
        <tr>
          <td>รายการ</td>
          <td style="text-align:center;">ระยะเวลาเพิ่มเติม</td>
          <td style="text-align:right;">ราคาเพิ่มเติม</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Offline Audio Fallback (เสียงสำรองกรณีอินเทอร์เน็ตขัดข้อง)</td>
          <td style="text-align:center;color:#555;">+2–3 สัปดาห์</td>
          <td>+80,000 – 120,000 บาท</td>
        </tr>
        <tr>
          <td>Custom AI Voice (เสียงเฉพาะมาสคอต)</td>
          <td style="text-align:center;color:#555;">+2–3 สัปดาห์</td>
          <td>+120,000 – 200,000 บาท</td>
        </tr>
        <tr>
          <td>MRT Real-time API Integration (ข้อมูล live)</td>
          <td style="text-align:center;color:#555;">+3–4 สัปดาห์</td>
          <td>+150,000 – 250,000 บาท</td>
        </tr>
        <tr>
          <td>เพิ่มภาษา (จีน / ญี่ปุ่น / อื่นๆ)</td>
          <td style="text-align:center;color:#555;">+2–3 สัปดาห์ / ภาษา</td>
          <td>+100,000 – 150,000 บาท / ภาษา</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top:8px;padding-top:6px;border-top:1px dashed #c0ccdd;font-size:8pt;color:#555;">
      💡 ${apiNote}
    </div>
  </div>
`;}
const ADDONS_A = makeAddons(true);
const ADDONS_B = makeAddons(false);

// ============================================================
// PLAN A
// ============================================================
const htmlA = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<title>ใบเสนอราคา แผน A — Exhibition MVP</title>
<style>${BASE_STYLE}</style></head><body><div class="page">
${makeHeader('21 วันทำการ')}
<table class="items">
  <thead>
    <tr><th>ลำดับ</th><th>รายละเอียด / Description</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>จำนวนเงิน</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><div class="item-name">AI Conversation Engine + MRT Knowledge Base</div>
          <div class="item-desc">ระบบ AI โต้ตอบภาษาไทย/อังกฤษ + ฐานข้อมูลสถานี สาย ราคา และการเชื่อมต่อ MRT</div></td>
      <td>1 งาน</td><td>120,000.00</td><td>120,000.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td><div class="item-name">Azure TTS + Viseme Lip Sync Integration</div>
          <div class="item-desc">ระบบ Text-to-Speech (ไทย/อังกฤษ) + Viseme callback สำหรับขยับปากมาสคอตตามเสียงจริง</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td><div class="item-name">Speech-to-Text (STT) Thai + English</div>
          <div class="item-desc">ระบบรับคำสั่งเสียงผู้ใช้งาน รองรับภาษาไทยและอังกฤษ</div></td>
      <td>1 งาน</td><td>40,000.00</td><td>40,000.00</td>
    </tr>
    <tr>
      <td>4</td>
      <td><div class="item-name">Mascot Video Clips — 8 States</div>
          <div class="item-desc">เจนคลิปวิดีโอมาสคอต 8 ท่าทาง: Idle / Greeting / Talking / Thinking / Pointing / Happy / Sorry / Goodbye</div></td>
      <td>8 คลิป</td><td>12,500.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>5</td>
      <td><div class="item-name">Viseme → Clip Trigger System</div>
          <div class="item-desc">ระบบ mapping Viseme ID → คลิปท่าปาก + logic trigger state ตาม intent ของ AI response</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>6</td>
      <td><div class="item-name">Kiosk Web Application Development</div>
          <div class="item-desc">พัฒนา Web App สำหรับ Kiosk: UI/UX fullscreen, idle detection, touch interaction, bilingual switcher</div></td>
      <td>1 งาน</td><td>150,000.00</td><td>150,000.00</td>
    </tr>
    <tr>
      <td>7</td>
      <td><div class="item-name">Testing + Deployment</div>
          <div class="item-desc">ทดสอบระบบ end-to-end และ deploy บน Kiosk ของผู้ว่าจ้าง</div></td>
      <td>1 งาน</td><td>60,000.00</td><td>60,000.00</td>
    </tr>
    <tr>
      <td>8</td>
      <td><div class="item-name">Project Management (21 วัน)</div>
          <div class="item-desc">บริหารโครงการ ประสานงาน และติดตามความคืบหน้า</div></td>
      <td>1 งาน</td><td>60,000.00</td><td>60,000.00</td>
    </tr>
  </tbody>
</table>

<div class="totals-row">
  <div class="total-words">
    <div class="lbl">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)</div>
    <div class="txt">เจ็ดแสนสามหมื่นแปดพันสามร้อยบาทถ้วน</div>
  </div>
  <div class="total-nums">
    <div class="row"><span class="lbl">รวมเงิน / Subtotal</span><span class="val">690,000.00</span></div>
    <div class="row"><span class="lbl">ภาษีมูลค่าเพิ่ม / VAT 7%</span><span class="val">48,300.00</span></div>
    <div class="row grand"><span class="lbl">รวมทั้งสิ้น / Grand Total</span><span class="val">738,300.00</span></div>
  </div>
</div>

${ADDONS_A}

<div class="conditions-box">
  <div class="title">⚠️ เงื่อนไขการส่งมอบ</div>
  <table>
    <tr><td>กำหนดส่ง Asset มาสคอต</td><td>ผู้ว่าจ้างต้องส่ง source file มาสคอต (PNG/AI/PSD ความละเอียดสูง) ก่อนเริ่มนับระยะเวลาโครงการ — ทุก 1 วันที่ล่าช้า = ระยะเวลาโครงการเลื่อนออก 1 วัน</td></tr>
    <tr><td>เนื้อหา MRT Knowledge Base</td><td>ผู้ว่าจ้างต้องจัดเตรียมและตรวจสอบความถูกต้องของข้อมูล MRT ภายในสัปดาห์แรกของโครงการ</td></tr>
    <tr><td>Kiosk Hardware</td><td>ผู้ว่าจ้างต้องเตรียม hardware พร้อมสำหรับ testing ก่อนวันส่งมอบ 3 วันทำการ</td></tr>
    <tr><td>การตรวจรับงาน</td><td>ผู้ว่าจ้างมีเวลาตรวจรับ 2 วันทำการ หากไม่มีการแจ้งปัญหาถือว่าตรวจรับแล้ว</td></tr>
    <tr><td>หมายเหตุ</td><td>ราคาข้างต้นอ้างอิงจาก technical approach ที่วางแผนไว้ หากผลการทดสอบความเป็นไปได้ในสัปดาห์แรกพบว่าต้องปรับ approach ผู้รับจ้างจะแจ้งให้ทราบก่อนดำเนินการต่อ</td></tr>
  </table>
</div>

${PAYMENT_SIG}
</div></body></html>`;

// ============================================================
// PLAN B
// ============================================================
const htmlB = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<title>ใบเสนอราคา แผน B — Full Production</title>
<style>${BASE_STYLE}</style></head><body><div class="page">
${makeHeader('4–5 เดือน')}
<table class="items">
  <thead>
    <tr><th>ลำดับ</th><th>รายละเอียด / Description</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>จำนวนเงิน</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><div class="item-name">AI Conversation Engine + Knowledge Base (ขยาย)</div>
          <div class="item-desc">ระบบ AI โต้ตอบขั้นสูง รองรับ query ซับซ้อน: เส้นทาง ราคา ตารางเวลา จุดเชื่อมต่อ และ FAQ</div></td>
      <td>1 งาน</td><td>200,000.00</td><td>200,000.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td><div class="item-name">Azure TTS + Viseme Lip Sync (Production Grade)</div>
          <div class="item-desc">ระบบ TTS คุณภาพสูง + smooth viseme transition สำหรับ mouth shape animation ที่เป็นธรรมชาติ</div></td>
      <td>1 งาน</td><td>100,000.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td><div class="item-name">STT Whisper API (Noise-Robust)</div>
          <div class="item-desc">ระบบรับเสียงที่แม่นยำในสภาพแวดล้อมที่มีเสียงรบกวน เช่น งานนิทรรศการ</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>4</td>
      <td><div class="item-name">Mascot Video Clips — 16–20 States</div>
          <div class="item-desc">เจนคลิปมาสคอตครบ 16–20 ท่าทาง รวม emotion หลากหลาย, gesture และ mouth shape สำหรับ viseme</div></td>
      <td>20 คลิป</td><td>10,000.00</td><td>200,000.00</td>
    </tr>
    <tr>
      <td>5</td>
      <td><div class="item-name">Viseme → Clip System (Smooth Transition)</div>
          <div class="item-desc">ระบบ lip sync เต็มรูปแบบพร้อม smooth transition ระหว่าง mouth shape clip</div></td>
      <td>1 งาน</td><td>120,000.00</td><td>120,000.00</td>
    </tr>
    <tr>
      <td>6</td>
      <td><div class="item-name">Kiosk Web Application (Full Version)</div>
          <div class="item-desc">UI/UX polish, session management, idle timeout, multi-language switcher, error handling ครบ</div></td>
      <td>1 งาน</td><td>250,000.00</td><td>250,000.00</td>
    </tr>
    <tr>
      <td>7</td>
      <td><div class="item-name">Analytics Dashboard</div>
          <div class="item-desc">แดชบอร์ดสถิติการใช้งาน: จำนวนคำถาม คำถามยอดนิยม ภาษา และ session</div></td>
      <td>1 งาน</td><td>100,000.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>8</td>
      <td><div class="item-name">Multi-Kiosk Support</div>
          <div class="item-desc">รองรับการ deploy หลาย kiosk พร้อมกันบน network เดียว</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>9</td>
      <td><div class="item-name">Hardware Integration Testing</div>
          <div class="item-desc">ทดสอบระบบบน kiosk hardware จริงของผู้ว่าจ้าง ครอบคลุม microphone, speaker, display</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>10</td>
      <td><div class="item-name">Testing + QA + UAT</div>
          <div class="item-desc">ทดสอบระบบ end-to-end, user acceptance testing และ bug fix รอบสุดท้าย</div></td>
      <td>1 งาน</td><td>100,000.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>11</td>
      <td><div class="item-name">Project Management (4–5 เดือน)</div>
          <div class="item-desc">บริหารโครงการ ประสานงาน รายงานความคืบหน้า และ milestone review ทุกเดือน</div></td>
      <td>1 งาน</td><td>120,000.00</td><td>120,000.00</td>
    </tr>
  </tbody>
</table>

<div class="totals-row">
  <div class="total-words">
    <div class="lbl">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)</div>
    <div class="txt">หนึ่งล้านห้าแสนสามหมื่นหนึ่งร้อยบาทถ้วน</div>
  </div>
  <div class="total-nums">
    <div class="row"><span class="lbl">รวมเงิน / Subtotal</span><span class="val">1,430,000.00</span></div>
    <div class="row"><span class="lbl">ภาษีมูลค่าเพิ่ม / VAT 7%</span><span class="val">100,100.00</span></div>
    <div class="row grand"><span class="lbl">รวมทั้งสิ้น / Grand Total</span><span class="val">1,530,100.00</span></div>
  </div>
</div>

${ADDONS_B}

<div class="conditions-box">
  <div class="title">⚠️ เงื่อนไขการส่งมอบ</div>
  <table>
    <tr><td>กำหนดส่ง Asset มาสคอต</td><td>ผู้ว่าจ้างต้องส่ง source file มาสคอต (PNG/AI/PSD ความละเอียดสูง) ภายใน 2 สัปดาห์หลังเซ็นสัญญา</td></tr>
    <tr><td>เนื้อหา MRT Knowledge Base</td><td>ผู้ว่าจ้างต้องจัดเตรียมและตรวจสอบความถูกต้องของข้อมูล MRT ภายในเดือนแรกของโครงการ</td></tr>
    <tr><td>Kiosk Hardware</td><td>ผู้ว่าจ้างต้องเตรียม hardware พร้อมสำหรับ testing ก่อนเข้าสู่ phase testing อย่างน้อย 2 สัปดาห์</td></tr>
    <tr><td>การตรวจรับงาน</td><td>ผู้ว่าจ้างมีเวลาตรวจรับ 5 วันทำการต่อ milestone หากไม่มีการแจ้งปัญหาถือว่าตรวจรับแล้ว</td></tr>
    <tr><td>หมายเหตุ</td><td>ราคาข้างต้นอ้างอิงจาก technical approach ที่วางแผนไว้ หากผลการทดสอบความเป็นไปได้ในเดือนแรกพบว่าต้องปรับ approach ผู้รับจ้างจะแจ้งให้ทราบก่อนดำเนินการต่อ</td></tr>
  </table>
</div>

${PAYMENT_SIG}
</div></body></html>`;

fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/mrt-mascot-quotation-a.html', htmlA, 'utf-8');
fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/mrt-mascot-quotation-b.html', htmlB, 'utf-8');
console.log('Plan A HTML:', htmlA.length, 'bytes');
console.log('Plan B HTML:', htmlB.length, 'bytes');
