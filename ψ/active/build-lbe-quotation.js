const fs = require('fs');
const logoH = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-h.txt', 'utf-8').trim();
const logoF = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-f.txt', 'utf-8').trim();
const sig = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-sig.txt', 'utf-8').trim();
const fontRegular = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-regular-b64.txt', 'utf-8').trim();
const fontSemiBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-semibold-b64.txt', 'utf-8').trim();
const fontBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-bold-b64.txt', 'utf-8').trim();

const BASE_STYLE = `
  @font-face{font-family:'Sarabun';font-weight:400;src:url(data:font/ttf;base64,${fontRegular}) format('truetype');}
  @font-face{font-family:'Sarabun';font-weight:600;src:url(data:font/ttf;base64,${fontSemiBold}) format('truetype');}
  @font-face{font-family:'Sarabun';font-weight:700;src:url(data:font/ttf;base64,${fontBold}) format('truetype');}
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
  .qt-plan{font-size:8pt;font-weight:600;margin-top:4px;padding:2px 8px;border-radius:3px;display:inline-block;}
  .qt-plan.ssa{color:#1a3f6f;background:#e8f0fb;}
  .qt-plan.marker{color:#2e7d32;background:#e8f5e9;}
  .blue-line{height:3px;background:#1a3f6f;margin:10px 0 16px 0;}
  .info-row{display:flex;justify-content:space-between;margin-bottom:14px;}
  .info-left{width:56%;}.info-right{width:40%;}
  .info-label{font-size:9.5pt;font-weight:700;color:#1a3f6f;text-decoration:underline;margin-bottom:3px;}
  .info-body{font-size:10pt;line-height:1.55;}
  .blank{display:inline-block;border-bottom:1px solid #aaa;min-width:200px;height:14px;}
  .doc-line{font-size:10pt;line-height:1.6;}
  .doc-line .lbl{color:#555;}
  .doc-line .val{font-weight:700;}
  .blank-val{display:inline-block;border-bottom:1px solid #aaa;min-width:130px;height:14px;vertical-align:bottom;}
  .scope-note{background:#f5f7fa;border-radius:4px;padding:6px 12px;margin-bottom:10px;font-size:8.5pt;color:#555;border-left:3px solid #a0b0c8;}
  .scope-note b{color:#3d4f6f;}
  table.items{width:100%;border-collapse:collapse;font-size:9.5pt;}
  table.items thead th{background:#3d4f6f;color:#fff;padding:6px 8px;font-size:9pt;font-weight:600;text-align:center;border:none;}
  table.items thead th:first-child{border-radius:4px 0 0 0;}
  table.items thead th:last-child{border-radius:0 4px 0 0;}
  table.items thead th:nth-child(2){text-align:left;}
  table.items tbody td{padding:5px 8px;vertical-align:top;border-bottom:1px solid #e8e8e8;font-size:9.5pt;}
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
  .demo-box{border:1px dashed #c0870a;border-radius:4px;padding:7px 12px;margin-top:10px;font-size:8.5pt;color:#444;background:#fffcf0;}
  .demo-box .title{font-weight:700;color:#c0870a;margin-bottom:4px;font-size:9pt;}
  .demo-box table{width:100%;font-size:8.5pt;border-collapse:collapse;}
  .demo-box table td{padding:2px 6px;}
  .demo-box table td:first-child{width:55%;color:#333;}
  .demo-box table td:nth-child(2){text-align:center;color:#555;width:22%;}
  .demo-box table td:last-child{text-align:right;color:#c0870a;font-weight:600;}
  .demo-box .total-row td{font-weight:700;border-top:1px solid #e8c87a;padding-top:4px;}
  .conditions-box{border:1px solid #e0a800;border-left:4px solid #e0a800;border-radius:4px;padding:7px 12px;margin-top:10px;font-size:8.5pt;background:#fffdf0;}
  .conditions-box .title{font-weight:700;color:#b8860b;margin-bottom:4px;font-size:9pt;}
  .conditions-box table{width:100%;font-size:8.5pt;border-collapse:collapse;}
  .conditions-box table td{padding:2px 6px;vertical-align:top;}
  .conditions-box table td:first-child{width:28%;font-weight:600;color:#555;}
  .payment{border:1px solid #ccc;border-radius:4px;padding:8px 12px;margin-top:10px;font-size:9.5pt;line-height:1.55;}
  .payment .title{font-weight:700;color:#1a3f6f;text-decoration:underline;margin-bottom:2px;}
  .payment .body{color:#444;}
  .payment .body b{color:#222;}
  .sig-row{display:flex;justify-content:space-between;margin-top:22px;}
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

function makeHeader(planLabel, planClass) {
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
      <div class="qt-plan ${planClass}">${planLabel}</div>
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
      <div class="doc-line"><span class="lbl">วันที่:</span> <span class="val">22/05/2569</span></div>
      <div class="doc-line"><span class="lbl">มีผลถึง:</span> <span class="val">21/06/2569</span></div>
      <div class="doc-line"><span class="lbl">ระยะเวลา:</span> <span class="val">~10 สัปดาห์ *</span></div>
    </div>
  </div>
  <div style="text-align:right;font-size:7.5pt;color:#888;margin-top:-10px;margin-bottom:8px;">* target POC เสร็จสิ้นเดือนกรกฎาคม 2569 (นับจากวันเซ็นสัญญา)</div>
  <div class="scope-note">
    <b>ขอบเขต NDF:</b> LBE Technology System — ระบบ tracking ตำแหน่ง, sync อุปกรณ์, Game Integration API
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <b>ไม่รวม:</b> พัฒนาเกม (scope ของลูกค้า) และ XR hardware/headsets
  </div>
`;
}

const DEMO_ADDON = `
  <div class="demo-box">
    <div class="title">🎮 บริการเสริม: เดโม่เกม POC — สำหรับกรณีทีมลูกค้าพัฒนาเกม POC ไม่ทัน (ไม่รวมในราคาข้างต้น)</div>
    <table>
      <thead style="color:#777;font-weight:600;font-size:8pt;">
        <tr><td>รายการ</td><td style="text-align:center;">ระยะเวลาเพิ่มเติม</td><td style="text-align:right;">ราคาเพิ่มเติม</td></tr>
      </thead>
      <tbody>
        <tr>
          <td>POC Demo Game Development (1 demo game สำหรับ POC — content ตามที่ตกลงร่วมกัน)</td>
          <td style="text-align:center;">+3–4 สัปดาห์</td>
          <td>+180,000 บาท</td>
        </tr>
        <tr>
          <td>Game–LBE System Integration & Testing</td>
          <td style="text-align:center;">(รวมใน 3–4 สัปดาห์)</td>
          <td>+70,000 บาท</td>
        </tr>
        <tr class="total-row">
          <td style="color:#c0870a;">รวมบริการเสริมเดโม่เกม (ไม่รวม VAT)</td>
          <td style="text-align:center;color:#c0870a;">+3–4 สัปดาห์</td>
          <td style="color:#c0870a;">+250,000 บาท</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top:5px;font-size:7.5pt;color:#999;">หมายเหตุ: เดโม่เกม = prototype level, gameplay กึ่งเรียนรู้ รอบ 15 นาที, 1–10 ผู้เล่น — content/asset ใช้สิ่งที่มีอยู่หรือตามที่ตกลงร่วมกัน ไม่ใช่ production game</div>
  </div>
`;

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
      <div class="sig-date">วันที่ 22/05/2569</div>
      <div class="sig-logo"><img src="${logoF}" alt="NDF"></div>
    </div>
  </div>
  <div class="validity">ใบเสนอราคานี้มีผลถึงวันที่ 21 มิถุนายน 2569</div>
`;

// ============================================================
// PLAN A — SSA (Shared Spatial Anchors)
// subtotal 750,000 | VAT 52,500 | total 802,500
// ============================================================
const CONDITIONS_A = `
  <div class="conditions-box">
    <div class="title">⚠️ เงื่อนไขและข้อตกลง</div>
    <table>
      <tr><td>ขอบเขต NDF</td><td>LBE Technology System เท่านั้น — การพัฒนาเกมทั้ง 3 theme (ทะเลลึก / อวกาศ / เมืองพลังงาน) เป็น scope ของลูกค้า</td></tr>
      <tr><td>ความต้องการอินเทอร์เน็ต</td><td><b>Option A ต้องการ Wi-Fi ที่เสถียรที่สถานที่เล่น</b> — SSA ใช้ cloud anchor synchronization ไม่สามารถทำงาน offline ได้</td></tr>
      <tr><td>สถานที่ POC</td><td>ต้องล็อกและ <b>ไม่เปลี่ยน</b> สถานที่ทดสอบ POC ก่อนเริ่ม sprint 1 เพื่อทำ spatial scanning (SSA ผูกกับ feature ของสภาพแวดล้อมนั้น)</td></tr>
      <tr><td>Hardware</td><td>ลูกค้าต้องเตรียม XR devices ที่รองรับ ARCore/ARKit สำหรับ testing (ไม่รวมในราคาข้างต้น)</td></tr>
      <tr><td>Game Integration</td><td>ทีม developer ของลูกค้ารับผิดชอบ integrate ผ่าน NDF API/SDK — NDF ส่งมอบ SDK + documentation ครบถ้วน</td></tr>
      <tr><td>การตรวจรับงาน</td><td>3 วันทำการต่อ milestone หากไม่แจ้งปัญหาถือว่าตรวจรับแล้ว</td></tr>
    </table>
  </div>
`;

const htmlA = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<title>ใบเสนอราคา LBE System — แผน A: SSA</title>
<style>${BASE_STYLE}</style></head><body><div class="page">
${makeHeader('แผน A — SSA (Shared Spatial Anchors)', 'ssa')}
<table class="items">
  <thead>
    <tr><th>ลำดับ</th><th>รายละเอียด / Description</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>จำนวนเงิน</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><div class="item-name">LBE Core Engine — SSA Spatial Tracking & Multi-device Sync</div>
          <div class="item-desc">ระบบ tracking ตำแหน่งผู้เล่นด้วย Shared Spatial Anchors + sync coordinate system ระหว่างอุปกรณ์สูงสุด 10 เครื่องพร้อมกัน รองรับ Sci Museum environment</div></td>
      <td>1 งาน</td><td>230,000.00</td><td>230,000.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td><div class="item-name">Player Session Management System</div>
          <div class="item-desc">ระบบจัดการรอบการเล่น: รองรับ 1–10 ผู้เล่น, รอบ 15 นาที, join/leave ระหว่างเกม, role assignment และ state sync</div></td>
      <td>1 งาน</td><td>100,000.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td><div class="item-name">Game Integration API & SDK</div>
          <div class="item-desc">ชุด API + SDK สำหรับทีม developer ของลูกค้า: player position/rotation feed, game event bus, session lifecycle hooks พร้อม API documentation ครบถ้วน</div></td>
      <td>1 งาน</td><td>120,000.00</td><td>120,000.00</td>
    </tr>
    <tr>
      <td>4</td>
      <td><div class="item-name">Space Setup & Spatial Calibration Tool</div>
          <div class="item-desc">เครื่องมือสำหรับ operator: scan สภาพแวดล้อม, วาง spatial anchor, กำหนด play zone boundary สำหรับแต่ละ theme</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>5</td>
      <td><div class="item-name">Admin Panel — Device & Session Management</div>
          <div class="item-desc">แดชบอร์ด web-based สำหรับ operator: device pairing, monitor session status, kick/reset player, activity log</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>6</td>
      <td><div class="item-name">System Testing & POC Deployment</div>
          <div class="item-desc">ทดสอบระบบ end-to-end บน hardware จริง, deployment ที่สถานที่ POC พร้อมส่งมอบ SDK และ API documentation</div></td>
      <td>1 งาน</td><td>70,000.00</td><td>70,000.00</td>
    </tr>
    <tr>
      <td>7</td>
      <td><div class="item-name">Project Management (~10 สัปดาห์)</div>
          <div class="item-desc">sprint planning, ประสานงานทีม, รายงาน progress รายสัปดาห์, technical review และ risk management</div></td>
      <td>1 งาน</td><td>70,000.00</td><td>70,000.00</td>
    </tr>
    <tr>
      <td>8</td>
      <td><div class="item-name">Training — SDK Integration & System Operation</div>
          <div class="item-desc">อบรมทีม developer ของลูกค้า: การใช้งาน API/SDK, integration guide, session lifecycle + อบรม operator: admin panel, space setup และการจัดวาง spatial anchor</div></td>
      <td>1 งาน</td><td>50,000.00</td><td>50,000.00</td>
    </tr>
  </tbody>
</table>
<div class="totals-row">
  <div class="total-words">
    <div class="lbl">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)</div>
    <div class="txt">แปดแสนห้าหมื่นหกพันบาทถ้วน</div>
  </div>
  <div class="total-nums">
    <div class="row"><span class="lbl">รวมเงิน / Subtotal</span><span class="val">800,000.00</span></div>
    <div class="row"><span class="lbl">ภาษีมูลค่าเพิ่ม / VAT 7%</span><span class="val">56,000.00</span></div>
    <div class="row grand"><span class="lbl">รวมทั้งสิ้น / Grand Total</span><span class="val">856,000.00</span></div>
  </div>
</div>
${DEMO_ADDON}
${CONDITIONS_A}
${PAYMENT_SIG}
</div></body></html>`;

// ============================================================
// PLAN B — Marker-based
// subtotal 650,000 | VAT 45,500 | total 695,500
// ============================================================
const CONDITIONS_B = `
  <div class="conditions-box">
    <div class="title">⚠️ เงื่อนไขและข้อตกลง</div>
    <table>
      <tr><td>ขอบเขต NDF</td><td>LBE Technology System เท่านั้น — การพัฒนาเกมทั้ง 3 theme (ทะเลลึก / อวกาศ / เมืองพลังงาน) เป็น scope ของลูกค้า</td></tr>
      <tr><td>ข้อจำกัด Marker-based</td><td><b>ตำแหน่ง marker ในสถานที่จริงต้องตรงกับ layout ที่ upload ไว้ในระบบทุกครั้งที่จัดสถานที่</b> — ความคลาดเคลื่อนทำให้ตำแหน่งผิดพลาด (ลูกค้าต้องรับทราบและยอมรับข้อจำกัดนี้)</td></tr>
      <tr><td>Initialization Delay</td><td>มี delay 1–3 วินาทีในช่วงเริ่มเกมเพื่อ lock ตำแหน่ง (กล้องต้องเห็น marker ชัดเจน) — เป็นข้อจำกัดของเทคโนโลยีที่ไม่สามารถกำจัดได้</td></tr>
      <tr><td>Hardware & สภาพแวดล้อม</td><td>ลูกค้าต้องเตรียม XR devices ที่มีกล้องคุณภาพดี และสภาพแสงที่สถานที่เล่นต้องเพียงพอ (ไม่รวมในราคาข้างต้น)</td></tr>
      <tr><td>Game Integration</td><td>ทีม developer ของลูกค้ารับผิดชอบ integrate ผ่าน NDF API/SDK — NDF ส่งมอบ SDK + documentation ครบถ้วน</td></tr>
      <tr><td>การตรวจรับงาน</td><td>3 วันทำการต่อ milestone หากไม่แจ้งปัญหาถือว่าตรวจรับแล้ว</td></tr>
    </table>
  </div>
`;

const htmlB = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8">
<title>ใบเสนอราคา LBE System — แผน B: Marker-based</title>
<style>${BASE_STYLE}</style></head><body><div class="page">
${makeHeader('แผน B — Marker-based Location Tracking', 'marker')}
<table class="items">
  <thead>
    <tr><th>ลำดับ</th><th>รายละเอียด / Description</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>จำนวนเงิน</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><div class="item-name">Marker Detection & Pose Estimation Engine</div>
          <div class="item-desc">ระบบตรวจจับ ArUco/AprilTag markers + คำนวณตำแหน่ง 3D ผู้เล่นแบบ real-time บน 10 อุปกรณ์พร้อมกัน รองรับ IMU fusion เพื่อลด pose jitter</div></td>
      <td>1 งาน</td><td>160,000.00</td><td>160,000.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td><div class="item-name">Offline Multi-device Coordinate Sync System</div>
          <div class="item-desc">ระบบ sync ตำแหน่งระหว่างอุปกรณ์ผ่าน LAN/Wi-Fi ท้องถิ่น ไม่ต้องการอินเทอร์เน็ต รองรับ 10 ผู้เล่นพร้อมกัน latency &lt;100ms</div></td>
      <td>1 งาน</td><td>100,000.00</td><td>100,000.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td><div class="item-name">Player Session Management System</div>
          <div class="item-desc">ระบบจัดการรอบการเล่น: รองรับ 1–10 ผู้เล่น, รอบ 15 นาที, join/leave ระหว่างเกม, role assignment และ state sync</div></td>
      <td>1 งาน</td><td>80,000.00</td><td>80,000.00</td>
    </tr>
    <tr>
      <td>4</td>
      <td><div class="item-name">Game Integration API & SDK</div>
          <div class="item-desc">ชุด API + SDK สำหรับทีม developer ของลูกค้า: player position/rotation feed, game event bus, session lifecycle hooks พร้อม API documentation ครบถ้วน</div></td>
      <td>1 งาน</td><td>90,000.00</td><td>90,000.00</td>
    </tr>
    <tr>
      <td>5</td>
      <td><div class="item-name">Space Template Upload & Marker Layout Tool</div>
          <div class="item-desc">เครื่องมือ web-based สำหรับ operator: อัพโหลดผัง marker layout, กำหนด play zone, ส่งออก marker print file (PDF พร้อม ArUco IDs)</div></td>
      <td>1 งาน</td><td>60,000.00</td><td>60,000.00</td>
    </tr>
    <tr>
      <td>6</td>
      <td><div class="item-name">Admin Panel — Device & Session Management</div>
          <div class="item-desc">แดชบอร์ด web-based สำหรับ operator: device pairing, monitor session status, kick/reset player, activity log</div></td>
      <td>1 งาน</td><td>50,000.00</td><td>50,000.00</td>
    </tr>
    <tr>
      <td>7</td>
      <td><div class="item-name">System Testing & POC Deployment</div>
          <div class="item-desc">ทดสอบระบบ end-to-end บน hardware จริง, deployment ที่สถานที่ POC พร้อมส่งมอบ SDK, API documentation และ marker print files</div></td>
      <td>1 งาน</td><td>60,000.00</td><td>60,000.00</td>
    </tr>
    <tr>
      <td>8</td>
      <td><div class="item-name">Project Management (~10 สัปดาห์)</div>
          <div class="item-desc">sprint planning, ประสานงานทีม, รายงาน progress รายสัปดาห์, technical review และ risk management</div></td>
      <td>1 งาน</td><td>50,000.00</td><td>50,000.00</td>
    </tr>
    <tr>
      <td>9</td>
      <td><div class="item-name">Training — SDK Integration & System Operation</div>
          <div class="item-desc">อบรมทีม developer ของลูกค้า: การใช้งาน API/SDK, integration guide, session lifecycle + อบรม operator: admin panel, marker layout setup และการวาง marker ให้ตรงตาม template</div></td>
      <td>1 งาน</td><td>40,000.00</td><td>40,000.00</td>
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
${DEMO_ADDON}
${CONDITIONS_B}
${PAYMENT_SIG}
</div></body></html>`;

fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/lbe-quotation-a.html', htmlA, 'utf-8');
fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/lbe-quotation-b.html', htmlB, 'utf-8');
console.log('Plan A HTML:', htmlA.length, 'bytes');
console.log('Plan B HTML:', htmlB.length, 'bytes');
