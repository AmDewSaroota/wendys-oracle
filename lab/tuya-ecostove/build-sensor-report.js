#!/usr/bin/env node
/**
 * Build sensor-comparison-report.html with embedded base64 screenshots
 * Usage: node build-sensor-report.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const imgs = JSON.parse(fs.readFileSync(path.join(dir, 'screenshots-b64.json'), 'utf8'));

// Helper: create data URI
const uri = (key) => `data:image/png;base64,${imgs[key]}`;

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>เปรียบเทียบเซนเซอร์ 3 รุ่น — PV28 vs MT15 vs MT13W</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap');

  :root {
    --dark-green: #064e3b;
    --green: #059669;
    --light-green: #d1fae5;
    --bg-tint: #f0f7f4;
    --navy: #0f172a;
    --orange: #fb923c;
    --orange-dark: #ea580c;
    --red: #dc2626;
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-400: #94a3b8;
    --gray-500: #64748b;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1e293b;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Chakra Petch', sans-serif; background: var(--bg-tint); color: var(--navy); }

  .slide {
    width: 100vw; min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 40px 60px;
    border-bottom: 4px solid var(--light-green);
    position: relative;
  }

  .slide-num {
    position: absolute; top: 20px; right: 30px;
    font-size: 14px; color: var(--gray-400); font-weight: 300;
  }

  /* Slide themes */
  .s-title {
    background: linear-gradient(135deg, var(--dark-green) 0%, #0a7c5a 50%, var(--dark-green) 100%);
    color: white;
    border-bottom: 6px solid var(--orange);
  }
  .s-data { background: var(--bg-tint); }
  .s-summary {
    background: linear-gradient(135deg, var(--dark-green) 0%, #0a7c5a 100%);
    color: white;
    border-bottom: 6px solid var(--orange);
  }

  h1 { font-size: 42px; font-weight: 700; margin-bottom: 10px; }
  h2 { font-size: 30px; font-weight: 600; margin-bottom: 24px; color: var(--dark-green); }
  h3 { font-size: 22px; font-weight: 500; margin-bottom: 16px; color: var(--gray-600); }

  .s-title h2, .s-summary h2 { color: white; }
  .s-title h3, .s-summary h3 { color: rgba(255,255,255,0.8); }
  .s-title .slide-num, .s-summary .slide-num { color: rgba(255,255,255,0.4); }

  .subtitle { font-size: 18px; color: var(--gray-500); font-weight: 300; margin-bottom: 30px; }
  .s-title .subtitle { color: rgba(255,255,255,0.7); }

  .accent { color: var(--dark-green); }
  .green { color: var(--green); }
  .orange { color: var(--orange-dark); }
  .red { color: var(--red); }
  .dim { color: var(--gray-500); }

  .badge {
    display: inline-block; padding: 4px 14px; border-radius: 20px;
    font-size: 13px; font-weight: 500; margin: 0 4px;
  }
  .badge-green { background: var(--light-green); border: 1px solid var(--green); color: var(--dark-green); }
  .badge-orange { background: #fff7ed; border: 1px solid var(--orange); color: var(--orange-dark); }
  .badge-red { background: #fef2f2; border: 1px solid #fca5a5; color: var(--red); }
  .badge-blue { background: #eff6ff; border: 1px solid #93c5fd; color: #1d4ed8; }
  .badge-white { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4); color: white; }

  table {
    border-collapse: collapse; width: 100%; max-width: 1000px;
    margin: 16px 0; font-size: 15px;
    background: white; border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  th {
    background: var(--dark-green); padding: 12px 16px; text-align: left;
    font-weight: 500; color: white; border-bottom: 3px solid var(--orange);
  }
  td {
    padding: 10px 16px; border-bottom: 1px solid var(--gray-200);
  }
  tr:hover td { background: var(--bg-tint); }

  .card-row {
    display: flex; gap: 20px; flex-wrap: wrap;
    justify-content: center; max-width: 1100px; width: 100%;
  }
  .card {
    flex: 1; min-width: 280px; max-width: 500px;
    background: white; border-radius: 16px; padding: 24px;
    border: none; border-bottom: 4px solid var(--orange);
    box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12); }
  .card h3 { margin-bottom: 12px; }

  .callout {
    background: white;
    padding: 16px 24px; border-radius: 16px;
    border-left: 4px solid var(--dark-green);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .callout-orange {
    background: white;
    padding: 16px 24px; border-radius: 16px;
    border-left: 4px solid var(--orange);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .callout-summary {
    background: rgba(255,255,255,0.1);
    padding: 24px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.2);
  }

  ul { list-style: none; padding: 0; }
  ul li { padding: 6px 0; font-size: 16px; }
  ul li::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 10px; }
  ul.green-list li::before { background: var(--green); }
  ul.orange-list li::before { background: var(--orange); }
  ul.red-list li::before { background: var(--red); }

  /* Chart grid: 3 columns on desktop, 1 on mobile */
  .chart-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 1200px;
    width: 100%;
  }
  .chart-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
    border-bottom: 4px solid var(--orange);
    transition: transform 0.3s ease;
  }
  .chart-card:hover { transform: translateY(-3px); }
  .chart-card img {
    width: 100%; height: auto; display: block;
  }
  .chart-card .caption {
    padding: 14px 18px; font-size: 15px; color: var(--gray-600);
    line-height: 1.6;
  }
  .chart-card .caption strong { color: var(--navy); }

  /* 2-column grid for Tab 2 */
  .chart-grid-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 900px;
    width: 100%;
  }

  @media (min-width: 900px) {
    .chart-grid {
      grid-template-columns: repeat(3, 1fr);
      max-width: 1200px;
    }
    .chart-grid-2 {
      grid-template-columns: repeat(2, 1fr);
      max-width: 900px;
    }
    .chart-card .caption {
      padding: 12px 16px; font-size: 13px;
    }
  }

  /* Decision matrix */
  .decision-card {
    background: white; border-radius: 16px; padding: 28px;
    box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08);
    border-top: 5px solid var(--dark-green);
    flex: 1; min-width: 320px; max-width: 500px;
  }
  .decision-card h3 { font-size: 20px; margin-bottom: 16px; }
  .decision-card ul { margin: 0; }
  .decision-card ul li { padding: 5px 0; font-size: 15px; line-height: 1.5; }
  .decision-card ul li::before { display: none; }

  .note-box {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 20px;
    max-width: 1060px;
    width: 100%;
  }
  .note-box p { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.7; }
  .note-box strong { color: white; }

  @media (max-width: 600px) {
    .slide { padding: 24px 20px; }
    h1 { font-size: 28px; }
    h2 { font-size: 22px; }
    .subtitle { font-size: 15px; }
    .decision-card { min-width: 100%; }
  }

  @media print {
    .slide { page-break-after: always; }
  }
</style>
</head>
<body>

<!-- ===================== SLIDE 1: Title ===================== -->
<div class="slide s-title">
  <div class="slide-num">1 / 6</div>
  <div style="font-size: 60px; margin-bottom: 20px;">&#x1F50D;</div>
  <h1>&#x2696;&#xFE0F; เปรียบเทียบเซนเซอร์ 3 รุ่น</h1>
  <h3>PV28 vs MT15 vs MT13W &mdash; ผลทดสอบจริง 6 เมษายน 2569</h3>
  <p class="subtitle">ข้อมูลจาก Dashboard จริง &mdash; ช่วงเวลาเดียวกัน ~08:55&ndash;11:10 น.</p>
  <div style="margin-top: 30px;">
    <span class="badge badge-white">3 Sensors</span>
    <span class="badge badge-white">Same Time Window</span>
    <span class="badge badge-white">Dashboard Charts</span>
  </div>
</div>

<!-- ===================== SLIDE 2: Sensor Specs Table ===================== -->
<div class="slide s-data">
  <div class="slide-num">2 / 6</div>
  <h2>&#x1F4CB; เปรียบเทียบ Spec &mdash; 3 รุ่น</h2>

  <table style="max-width: 1000px;">
    <thead>
      <tr>
        <th style="width:180px;">Spec</th>
        <th style="text-align:center;">PV28 <span class="badge badge-white" style="font-size:11px;">Air Detector</span></th>
        <th style="text-align:center;">MT15 <span class="badge badge-white" style="font-size:11px;">001</span></th>
        <th style="text-align:center;">MT13W <span class="badge badge-white" style="font-size:11px;">BS 003</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>&#x1F4CA; PM2.5</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
      </tr>
      <tr style="background:#fff7ed;">
        <td><strong>&#x1F4CA; PM10</strong></td>
        <td style="text-align:center;" class="red">&#x274C; ไม่มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
      </tr>
      <tr>
        <td>&#x1F4CA; CO2</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
      </tr>
      <tr style="background:#fef2f2;">
        <td><strong>&#x26A0;&#xFE0F; CO</strong></td>
        <td style="text-align:center;" class="red">&#x274C; ไม่มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
      </tr>
      <tr>
        <td>&#x1F9EA; HCHO</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
        <td style="text-align:center;" class="green">&#x2705; มี</td>
      </tr>
      <tr style="background:var(--light-green);">
        <td><strong>&#x1F33F; TVOC ขึ้น Cloud</strong></td>
        <td style="text-align:center;" class="green"><strong>&#x2705; อัตโนมัติ</strong></td>
        <td style="text-align:center;" class="red"><strong>&#x274C; ไม่ส่ง</strong></td>
        <td style="text-align:center;" class="red"><strong>&#x274C; ไม่ส่ง</strong></td>
      </tr>
      <tr>
        <td>&#x1F50B; แบตเตอรี่</td>
        <td style="text-align:center;" class="orange"><strong>800 mAh</strong></td>
        <td style="text-align:center;" class="green"><strong>2,000 mAh</strong></td>
        <td style="text-align:center;" class="green"><strong>2,000 mAh</strong></td>
      </tr>
      <tr>
        <td>&#x1F50C; เสียบชาร์จขณะใช้</td>
        <td style="text-align:center;" class="green">&#x2705;</td>
        <td style="text-align:center;" class="green">&#x2705;</td>
        <td style="text-align:center;" class="green">&#x2705;</td>
      </tr>
      <tr style="background:var(--light-green);">
        <td><strong>&#x1F504; เซนเซอร์ค้าง</strong></td>
        <td style="text-align:center;" class="green"><strong>&#x2705; ไม่ค้าง</strong></td>
        <td style="text-align:center;" class="orange"><strong>&#x26A0;&#xFE0F; เคยค้าง</strong></td>
        <td style="text-align:center;" class="orange"><strong>&#x26A0;&#xFE0F; เคยค้าง</strong></td>
      </tr>
      <tr>
        <td>&#x2601;&#xFE0F; Cloud Data Points</td>
        <td style="text-align:center;">6</td>
        <td style="text-align:center;">8</td>
        <td style="text-align:center;">8</td>
      </tr>
    </tbody>
  </table>

  <div class="callout-orange" style="margin-top: 20px; max-width: 1000px;">
    <p><strong>&#x1F4DD; หมายเหตุ:</strong> MT15 = MT13W &mdash; เป็น<strong>รุ่นเดียวกัน</strong> hardware เหมือนกันทุกอย่าง<br>
    ยืนยันจาก Tuya API: 11 data points เหมือนกัน &mdash; ไม่จำเป็นต้องสั่ง MT15 แยก</p>
  </div>
</div>

<!-- ===================== SLIDE 3: Tab 1 Charts (PM2.5 / PM10 / CO2) ===================== -->
<div class="slide s-data">
  <div class="slide-num">3 / 6</div>
  <h2>&#x1F4CA; ผลทดสอบจริง &mdash; PM2.5 &middot; PM10 &middot; CO2</h2>
  <p class="subtitle">Dashboard Tab 1 &mdash; ช่วงเวลาเดียวกัน ~08:55&ndash;11:10 น. วันที่ 6 เม.ย. 2569</p>

  <div class="chart-grid">
    <!-- MT15 Tab 1 -->
    <div class="chart-card" style="border-bottom-color: var(--dark-green);">
      <img src="${uri('mt15_tab1')}" alt="MT15 001 Tab 1">
      <div class="caption">
        <strong style="color:var(--dark-green);">MT15 001</strong><br>
        PM2.5 peak: <strong style="color:var(--orange-dark);">73.0</strong> &micro;g/m&sup3; &nbsp; avg: <strong>53.3</strong><br>
        PM10 peak: <strong>83.0</strong> &micro;g/m&sup3;<br>
        CO2 peak: <strong>418</strong> ppm
      </div>
    </div>
    <!-- PV28 Tab 1 -->
    <div class="chart-card" style="border-bottom-color: var(--green);">
      <img src="${uri('pv28_tab1')}" alt="PV28 AIR_DETECTOR Tab 1">
      <div class="caption">
        <strong style="color:var(--green);">PV28 AIR_DETECTOR</strong><br>
        PM2.5 peak: <strong style="color:var(--orange-dark);">60.0</strong> &micro;g/m&sup3; &nbsp; avg: <strong>42.0</strong><br>
        PM10: <strong class="dim">&mdash;</strong> (ไม่มีเซนเซอร์)<br>
        CO2 peak: <strong>503</strong> ppm
      </div>
    </div>
    <!-- BS 003 Tab 1 -->
    <div class="chart-card">
      <img src="${uri('bs003_tab1')}" alt="BS 003 (MT13W) Tab 1">
      <div class="caption">
        <strong>BS 003 (MT13W)</strong><br>
        PM2.5 peak: <strong>14.0</strong> &micro;g/m&sup3; &nbsp; avg: <strong>13.5</strong><br>
        PM10 peak: <strong>20.0</strong> &micro;g/m&sup3;<br>
        CO2 peak: <strong>473</strong> ppm
      </div>
    </div>
  </div>

  <div class="callout" style="margin-top: 24px; max-width: 1200px;">
    <p><strong>&#x1F50D; Key Findings:</strong></p>
    <ul style="margin-top:8px;">
      <li style="padding:4px 0; font-size:15px;">&#x2705; <strong>MT15 วัด PM2.5 ได้ไวกว่า BS 003 (MT13W) มาก</strong> &mdash; avg 53.3 vs 13.5 &micro;g/m&sup3;</li>
      <li style="padding:4px 0; font-size:15px;">&#x2705; <strong>PV28 ก็วัดได้ไว</strong> &mdash; avg 42.0 &micro;g/m&sup3; ใกล้เคียง MT15</li>
      <li style="padding:4px 0; font-size:15px;">&#x26A0;&#xFE0F; <strong>BS 003 (MT13W) ค่าค่อนข้างนิ่ง</strong> &mdash; เซนเซอร์อาจไม่ไวพอ หรือ placement ต่างกัน</li>
    </ul>
    <p style="margin-top:8px; font-size:13px; color:var(--gray-500);">
      &#x1F4DD; หมายเหตุ: ทดสอบช่วงเวลาเดียวกัน (~08:55&ndash;11:10 น.) &mdash; ต้องยืนยันว่าวางตำแหน่งเดียวกันหรือไม่
    </p>
  </div>
</div>

<!-- ===================== SLIDE 4: Tab 2 Charts (HCHO / TVOC / CO) ===================== -->
<div class="slide s-data">
  <div class="slide-num">4 / 6</div>
  <h2>&#x1F9EA; ผลทดสอบจริง &mdash; HCHO &middot; TVOC &middot; CO</h2>
  <p class="subtitle">Dashboard Tab 2 &mdash; ช่วงเวลาเดียวกัน ~08:55&ndash;11:10 น. วันที่ 6 เม.ย. 2569</p>

  <div class="chart-grid-2">
    <!-- MT15 Tab 2 -->
    <div class="chart-card" style="border-bottom-color: var(--dark-green);">
      <img src="${uri('mt15_tab2')}" alt="MT15 001 Tab 2">
      <div class="caption">
        <strong style="color:var(--dark-green);">MT15 001</strong><br>
        HCHO avg: <strong>0.021</strong> mg/m&sup3; (sensor)<br>
        TVOC avg: <strong style="color:var(--orange-dark);">0.191</strong> (manual/mock &mdash; 13 points)<br>
        CO avg: <strong>6.5</strong> ppm (13 points)
      </div>
    </div>
    <!-- BS 003 Tab 2 -->
    <div class="chart-card">
      <img src="${uri('bs003_tab2')}" alt="BS 003 (MT13W) Tab 2">
      <div class="caption">
        <strong>BS 003 (MT13W)</strong><br>
        HCHO avg: <strong>0.006</strong> mg/m&sup3; (sensor)<br>
        TVOC: <strong class="dim">&mdash;</strong> (0 points)<br>
        CO: <strong class="dim">&mdash;</strong> (0 points)
      </div>
    </div>
  </div>

  <div class="callout-orange" style="margin-top: 20px; max-width: 900px;">
    <p><strong>&#x1F4DD; หมายเหตุ:</strong> PV28 Tab 2 ยังไม่มีข้อมูล TVOC ใน DB &mdash; เพิ่งแก้ sync.js วันนี้ ต้องรอ sync ใหม่</p>
  </div>

  <div class="callout" style="margin-top: 16px; max-width: 900px;">
    <p><strong>&#x1F50D; Key Findings:</strong></p>
    <ul style="margin-top:8px;">
      <li style="padding:4px 0; font-size:15px;">&#x2705; <strong>MT15 วัด HCHO ได้สูงกว่า BS 003</strong> (0.021 vs 0.006) &rarr; ตอบสนองต่อสภาพแวดล้อมได้ดีกว่า</li>
      <li style="padding:4px 0; font-size:15px;">&#x26A0;&#xFE0F; <strong>TVOC + CO ต้องกรอกมือ</strong>สำหรับ MT15/MT13W &rarr; PV28 ส่ง TVOC อัตโนมัติ (ลดภาระอาสา)</li>
    </ul>
  </div>
</div>

<!-- ===================== SLIDE 5: Decision Matrix ===================== -->
<div class="slide s-data">
  <div class="slide-num">5 / 6</div>
  <h2>&#x1F4CB; Decision Matrix &mdash; สั่งรุ่นไหนดี?</h2>

  <div class="card-row" style="max-width:1100px; align-items:flex-start;">
    <!-- MT15/MT13W -->
    <div class="decision-card" style="border-top-color: var(--navy);">
      <h3 style="color: var(--navy);">&#x1F4E6; ถ้าสั่ง MT15 (= MT13W)</h3>
      <ul>
        <li>&#x2705; แบตใหญ่ 2,000 mAh</li>
        <li>&#x2705; มี CO + PM10</li>
        <li>&#x2705; Data Points ครบ 8 ค่า</li>
        <li>&#x274C; TVOC ไม่ส่ง cloud &rarr; อาสาต้องกรอกมือทุก 5 นาที</li>
        <li>&#x26A0;&#xFE0F; เซนเซอร์อาจค้างหลังสัมผัสมลพิษสูง (calibrate แก้ได้)</li>
      </ul>
    </div>
    <!-- PV28 -->
    <div class="decision-card" style="border-top-color: var(--green);">
      <h3 style="color: var(--green);">&#x1F4E6; ถ้าสั่ง PV28</h3>
      <ul>
        <li>&#x2705; TVOC ส่ง cloud อัตโนมัติ &rarr; ลดภาระอาสามาก</li>
        <li>&#x2705; เซนเซอร์ไม่ค้าง</li>
        <li>&#x2705; PM2.5 ตอบสนองดี (avg 42.0 ใกล้เคียง MT15)</li>
        <li>&#x274C; ไม่มี CO &rarr; ยังต้องกรอกมือ</li>
        <li>&#x274C; ไม่มี PM10</li>
        <li>&#x26A0;&#xFE0F; แบต 800 mAh &rarr; ต้องเสียบชาร์จ (แต่ทำได้)</li>
      </ul>
    </div>
  </div>
</div>

<!-- ===================== SLIDE 6: Recommendation / Summary ===================== -->
<div class="slide s-summary">
  <div class="slide-num">6 / 6</div>
  <h2>&#x1F4CB; สรุปและข้อเสนอแนะ</h2>

  <div class="callout-summary" style="max-width: 900px;">
    <p style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: white;">
      &#x1F3AF; ข้อสรุป: ขึ้นอยู่กับว่าอาจารย์ให้ความสำคัญกับอะไรมากกว่า
    </p>
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div style="background:rgba(255,255,255,0.08); border-radius:12px; padding:16px 20px; border-left:4px solid var(--orange);">
        <p style="font-size:16px; color:white; font-weight:500;">&#x1F4A8; ถ้าต้องการ CO + PM10</p>
        <p style="font-size:14px; color:rgba(255,255,255,0.7); margin-top:4px;">&rarr; สั่ง <strong style="color:white;">MT15 / MT13W</strong> &mdash; ได้ค่าครบ แต่อาสาต้องกรอก TVOC มือ</p>
      </div>
      <div style="background:rgba(255,255,255,0.08); border-radius:12px; padding:16px 20px; border-left:4px solid var(--green);">
        <p style="font-size:16px; color:white; font-weight:500;">&#x1F33F; ถ้าต้องการลดภาระอาสา (TVOC อัตโนมัติ)</p>
        <p style="font-size:14px; color:rgba(255,255,255,0.7); margin-top:4px;">&rarr; สั่ง <strong style="color:white;">PV28</strong> &mdash; TVOC ส่ง cloud เอง แต่ไม่มี CO และ PM10</p>
      </div>
      <div style="background:rgba(255,255,255,0.08); border-radius:12px; padding:16px 20px; border-left:4px solid white;">
        <p style="font-size:16px; color:white; font-weight:500;">&#x1F91D; ถ้าต้องการทั้งสองอย่าง</p>
        <p style="font-size:14px; color:rgba(255,255,255,0.7); margin-top:4px;">&rarr; ใช้คู่กัน <strong style="color:white;">PV28 เสริม MT13W</strong> &mdash; แต่เพิ่มต้นทุน</p>
      </div>
    </div>
  </div>

  <div class="note-box">
    <p><strong>&#x1F4DD; ย้ำ:</strong> MT15 = MT13W ทุกอย่าง &mdash; ไม่ต้องสั่ง MT15 แยก<br>
    Hardware เหมือนกัน ยืนยันจาก Tuya API (11 data points เหมือนกัน)</p>
  </div>

  <p style="margin-top: 30px; font-size: 13px; color: rgba(255,255,255,0.3);">
    Prepared by WEnDyS Oracle &nbsp; | &nbsp; Data: Tuya Cloud API + Supabase Dashboard &nbsp; | &nbsp; 6 เมษายน 2569
  </p>
</div>

</body>
</html>`;

fs.writeFileSync(path.join(dir, 'sensor-comparison-report.html'), html, 'utf8');
console.log('Done! sensor-comparison-report.html created (' + (html.length / 1024).toFixed(0) + ' KB template + embedded images)');
