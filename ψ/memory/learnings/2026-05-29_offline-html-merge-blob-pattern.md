# Offline HTML Merge — Blob URL + iframe Overlay Pattern

**Date**: 2026-05-29
**Source**: EcoStove workshop slides session

## Pattern

ต้องการรวม 2 HTML ไฟล์ (slides + web app) เป็นไฟล์เดียวที่ทำงาน offline ได้:

1. **Inline ทุก external dep** ใน app HTML:
   - `<script src="CDN">` → `<script>` + download content inline
   - `<link href="CDN">` → `<style>` + download content inline
   - CSS ที่มี `url(images/...)` → replace ด้วย base64 data URI
   - Google Fonts → remove (fallback sans-serif เพียงพอ)

2. **Base64 encode** app HTML ทั้งก้อน:
   ```powershell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($html))
   ```

3. **Embed ใน slides** ผ่าน blob URL + iframe overlay:
   ```js
   const _DEMO_B64 = "...base64...";
   let _demoBlobUrl = null;
   function openDemo() {
     if (!_demoBlobUrl) {
       const html = decodeURIComponent(escape(atob(_DEMO_B64)));
       const blob = new Blob([html], {type:'text/html'});
       _demoBlobUrl = URL.createObjectURL(blob);
       document.getElementById('demo-frame').src = _demoBlobUrl;
     }
     document.getElementById('demo-overlay').style.display = 'flex';
   }
   ```

4. **Overlay div** (fullscreen, fixed):
   ```html
   <div id="demo-overlay" style="display:none;position:fixed;inset:0;z-index:9999">
     <button onclick="closeDemo()">◀ กลับ</button>
     <iframe id="demo-frame" style="flex:1;width:100%;border:none"></iframe>
   </div>
   ```

## Notes
- Tailwind CDN play script ทำงานได้ใน blob URL context (JIT ยังทำงาน)
- OSM map tiles ยังต้องการ internet — จะเป็นสีเทาเมื่อ offline แต่ไม่พัง
- ขนาดไฟล์ final ~9-10MB สมเหตุสมผลสำหรับ fully self-contained presentation
- ควร grep หา local file ก่อนถาม user เสมอ
