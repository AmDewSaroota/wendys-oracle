const fs = require('fs');
const logoH = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-h.txt', 'utf-8').trim();
const logoF = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-logo-f.txt', 'utf-8').trim();
const sig = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/b64-sig.txt', 'utf-8').trim();
const fontRegular = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-regular-b64.txt', 'utf-8').trim();
const fontSemiBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-semibold-b64.txt', 'utf-8').trim();
const fontBold = fs.readFileSync('c:/Users/CPL/wendys-oracle/ψ/active/sarabun-bold-b64.txt', 'utf-8').trim();

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>ใบเสนอราคา QT202604100003 — SRT Core Dashboard</title>
<style>
  @font-face {
    font-family: 'Sarabun';
    font-weight: 400;
    font-style: normal;
    src: url(data:application/x-font-ttf;base64,${fontRegular}) format('truetype'),
         url(data:font/ttf;base64,${fontRegular}) format('truetype');
  }
  @font-face {
    font-family: 'Sarabun';
    font-weight: 600;
    font-style: normal;
    src: url(data:application/x-font-ttf;base64,${fontSemiBold}) format('truetype'),
         url(data:font/ttf;base64,${fontSemiBold}) format('truetype');
  }
  @font-face {
    font-family: 'Sarabun';
    font-weight: 700;
    font-style: normal;
    src: url(data:application/x-font-ttf;base64,${fontBold}) format('truetype'),
         url(data:font/ttf;base64,${fontBold}) format('truetype');
  }

  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Sarabun', sans-serif !important; }

  @page {
    size: A4;
    margin: 18mm 18mm 12mm 18mm;
  }

  body {
    font-family: 'Sarabun', sans-serif !important;
    font-size: 10pt;
    color: #222;
    background: #fff;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    max-width: 210mm;
    margin: 0 auto;
    padding: 0;
  }

  /* === HEADER === */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .header-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex: 1;
    margin-right: 16px;
  }
  .logo-img {
    width: 95px;
    min-width: 95px;
    padding-top: 2px;
  }
  .logo-img img {
    width: 95px;
    height: auto;
  }
  .company-info {
    font-size: 8pt;
    line-height: 1.55;
    color: #333;
    padding-top: 0;
    flex: 1;
  }
  .company-info .th {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1a3f6f;
    line-height: 1.3;
    white-space: nowrap;
  }
  .company-info .en {
    font-size: 8.5pt;
    color: #555;
  }
  .header-right {
    text-align: right;
    white-space: nowrap;
    padding-top: 8px;
    min-width: 190px;
  }
  .qt-title {
    font-size: 15pt;
    font-weight: 700;
    color: #1a3f6f;
    line-height: 1.1;
  }
  .qt-sub {
    font-size: 5.5pt;
    color: #aaa;
    font-weight: 400;
    margin-top: 0px;
  }

  /* === BLUE LINE === */
  .blue-line {
    height: 3px;
    background: #1a3f6f;
    margin: 10px 0 16px 0;
  }

  /* === CUSTOMER / DOC === */
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .info-left { width: 56%; }
  .info-right { width: 40%; }
  .info-label {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1a3f6f;
    text-decoration: underline;
    margin-bottom: 3px;
  }
  .info-body {
    font-size: 10pt;
    line-height: 1.55;
  }
  .info-body .name { font-weight: 600; }
  .doc-line {
    font-size: 10pt;
    line-height: 1.6;
  }
  .doc-line .lbl { color: #555; }
  .doc-line .val { font-weight: 700; }

  /* === TABLE === */
  table.items {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
    font-size: 10pt;
  }
  table.items thead th {
    background: #3d4f6f;
    color: #fff;
    padding: 7px 10px;
    font-size: 9.5pt;
    font-weight: 600;
    text-align: center;
    border: none;
  }
  table.items thead th:first-child { border-radius: 4px 0 0 0; }
  table.items thead th:last-child { border-radius: 0 4px 0 0; }
  table.items thead th:nth-child(2) { text-align: left; }
  table.items tbody td {
    padding: 8px 10px;
    vertical-align: top;
    border-bottom: 1px solid #e0e0e0;
  }
  table.items tbody td:nth-child(1) { text-align: center; width: 6%; }
  table.items tbody td:nth-child(2) { width: 47%; }
  table.items tbody td:nth-child(3) { text-align: center; width: 10%; }
  table.items tbody td:nth-child(4) { text-align: right; width: 16%; }
  table.items tbody td:nth-child(5) { text-align: right; width: 21%; }
  .item-name { font-weight: 700; font-size: 10pt; }
  .item-desc {
    font-size: 8.5pt;
    color: #555;
    line-height: 1.45;
    margin-top: 1px;
  }

  /* === TOTALS === */
  .totals-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-top: 2px solid #3d4f6f;
    padding-top: 8px;
  }
  .total-words {
    background: #edf1f7;
    border-radius: 0 4px 4px 0;
    border-left: 3px solid #1a3f6f;
    padding: 7px 12px;
    max-width: 320px;
  }
  .total-words .lbl {
    font-size: 7.5pt;
    color: #777;
  }
  .total-words .txt {
    font-size: 10pt;
    font-weight: 700;
    color: #1a3f6f;
    text-decoration: underline;
  }
  .total-nums {
    text-align: right;
    font-size: 10pt;
    line-height: 1.7;
  }
  .total-nums .row {
    display: flex;
    justify-content: flex-end;
    gap: 18px;
  }
  .total-nums .row .lbl { color: #555; text-align: right; min-width: 145px; }
  .total-nums .row .val { min-width: 90px; text-align: right; }
  .total-nums .grand {
    font-weight: 700;
    font-size: 11pt;
    color: #1a3f6f;
    border-top: 1px solid #ccc;
    padding-top: 2px;
    margin-top: 2px;
  }

  /* === PAYMENT === */
  .payment {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 14px;
    font-size: 9.5pt;
    line-height: 1.55;
  }
  .payment .title {
    font-weight: 700;
    color: #1a3f6f;
    text-decoration: underline;
    margin-bottom: 2px;
    font-size: 9.5pt;
  }
  .payment .body { color: #444; }
  .payment .body b { color: #222; }

  /* === SIGNATURE === */
  .sig-row {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  .sig-box {
    width: 42%;
    text-align: center;
  }
  .sig-line-area {
    height: 55px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .sig-line-area img {
    height: 55px;
    display: block;
    margin: 0 auto;
    margin-bottom: 3px;
  }
  .sig-line {
    border: none;
    border-top: 2px solid #555;
    width: 100%;
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 10;
  }
  .sig-label {
    padding-top: 3px;
    font-size: 9pt;
    color: #444;
    white-space: nowrap;
  }
  .sig-date {
    font-size: 8pt;
    color: #888;
    margin-top: 1px;
  }
  .sig-logo {
    margin-top: 10px;
  }
  .sig-logo img {
    height: 65px;
  }
  .validity {
    text-align: center;
    font-size: 8.5pt;
    color: #aaa;
    margin-top: 8px;
    padding-top: 5px;
    border-top: 1px solid #ddd;
  }

  @media print {
    body { background: #fff; }
    .page { max-width: none; padding: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="header-left">
      <div class="logo-img">
        <img src="${logoH}" alt="NDF">
      </div>
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

  <!-- CUSTOMER / DOC -->
  <div class="info-row">
    <div class="info-left">
      <div class="info-label">ลูกค้า / CUSTOMER</div>
      <div class="info-body">
        <div class="name">บริษัท วีซีเอ๊กซ์ เทคโนโลยี จำกัด</div>
        <div>15 ซอย เคหะร่มเกล้า 72 แยก 6</div>
        <div>แขวงราษฎร์พัฒนา เขตสะพานสูง กรุงเทพมหานคร 10240</div>
      </div>
    </div>
    <div class="info-right">
      <div class="info-label">เอกสาร / DOCUMENT</div>
      <div class="doc-line"><span class="lbl">เลขที่:</span> <span class="val">QT202604100003</span></div>
      <div class="doc-line"><span class="lbl">วันที่:</span> <span class="val">10/04/2026</span></div>
      <div class="doc-line"><span class="lbl">มีผลถึง:</span> <span class="val">10/05/2026</span></div>
    </div>
  </div>

  <!-- TABLE -->
  <table class="items">
    <thead>
      <tr>
        <th>ลำดับ</th>
        <th>รายละเอียด / Description</th>
        <th>จำนวน</th>
        <th>ราคา/หน่วย</th>
        <th>จำนวนเงิน</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>
          <div class="item-name">ค่าออกแบบ และพัฒนาระบบการรถไฟ (Core Dashboard)</div>
          <div class="item-desc">
            ระยะเวลาดำเนินงาน 4 เดือน<br>
            - ระบบสมัครสมาชิก และเข้าสู่ระบบกลางของการรถไฟ<br>
            - บริหารจัดการ/กำหนดสิทธิ์ผู้ใช้งาน และผู้ดูแลระบบ<br>
            &nbsp;&nbsp;ของแต่ละระบบงานย่อย<br>
            - แดชบอร์ดผู้บริหาร และรับการแจ้งเตือน<br>
            - พัฒนารองรับการทำงานในรูปแบบ Web Application
          </div>
        </td>
        <td>1 งาน</td>
        <td>1,251,890.00</td>
        <td>1,251,890.00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>
          <div class="item-name">ค่าดูแลระบบรายปี (MA Support)</div>
          <div class="item-desc">
            ระยะเวลา 1 ปี<br>
            - ดูแลและบำรุงรักษาระบบให้ทำงานได้อย่างต่อเนื่อง<br>
            - แก้ไขข้อผิดพลาด (Bug Fix) ที่เกิดจากระบบ<br>
            - อัปเดตความปลอดภัยและประสิทธิภาพ
          </div>
        </td>
        <td>1 ปี</td>
        <td>207,000.00</td>
        <td>207,000.00</td>
      </tr>
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals-row">
    <div class="total-words">
      <div class="lbl">จำนวนเงินรวมทั้งสิ้น (ตัวอักษร)</div>
      <div class="txt">หนึ่งล้านห้าแสนหกหมื่นหนึ่งพันสิบสองบาทสามสิบสตางค์</div>
    </div>
    <div class="total-nums">
      <div class="row"><span class="lbl">รวมเงิน / Subtotal</span><span class="val">1,458,890.00</span></div>
      <div class="row"><span class="lbl">ภาษีมูลค่าเพิ่ม / VAT 7%</span><span class="val">102,122.30</span></div>
      <div class="row grand"><span class="lbl">รวมทั้งสิ้น / Grand Total</span><span class="val">1,561,012.30</span></div>
    </div>
  </div>

  <!-- PAYMENT -->
  <div class="payment">
    <div class="title">ช่องทางชำระเงิน / Payment Information</div>
    <div class="body">
      ธนาคาร: <b>ธนาคารทหารไทยธนชาติ จำกัด (มหาชน)</b> สาขาบิ๊กซี เชียงใหม่<br>
      ชื่อบัญชี: บริษัท เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ จำกัด<br>
      ประเภท: ออมทรัพย์ | เลขที่บัญชี: <b>485-2-75921-8</b>
    </div>
  </div>

  <!-- SIGNATURE -->
  <div class="sig-row">
    <div class="sig-box">
      <div class="sig-line-area"></div>
      <hr class="sig-line">
      <div class="sig-label">ผู้อนุมัติ / ลูกค้า</div>
      <div class="sig-date">วันที่ ____/____/________</div>
    </div>
    <div class="sig-box">
      <div class="sig-line-area">
        <img src="${sig}" alt="signature">
      </div>
      <hr class="sig-line">
      <div class="sig-label">ผู้เสนอราคา / ภิญโญ ตัณรัตนมณฑล</div>
      <div class="sig-date">วันที่ 10/04/2026</div>
      <div class="sig-logo">
        <img src="${logoF}" alt="NDF">
      </div>
    </div>
  </div>

  <div class="validity">ใบเสนอราคานี้มีผลถึงวันที่ 10 พฤษภาคม 2569</div>

</div>
</body>
</html>`;

fs.writeFileSync('c:/Users/CPL/wendys-oracle/ψ/active/srt-quotation-ndf.html', html, 'utf-8');
console.log('HTML written:', html.length, 'bytes');
