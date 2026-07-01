# Chrome Headless PDF — ต้อง embed font เป็น base64 เสมอ

**Date**: 2026-07-01
**Source**: rrr: roof-contract-boq

## Pattern

Chrome headless (`--print-to-pdf`) ไม่สามารถ fetch Google Fonts CDN หรือ external URL ได้
ทำให้ฟ้อนท์ fallback เป็น Tahoma/serif แม้จะมี `<link>` tag อยู่ในหัว HTML

## Solution

1. Download TTF จาก Google Fonts CSS API:
   - `https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700` → copy URL จาก CSS ที่ return มา
   - URL pattern: `https://fonts.gstatic.com/s/sarabun/v17/DtVjJx26TKEr37c9WBI.ttf`

2. Convert to base64:
   ```powershell
   [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("sarabun-400.ttf"))
   ```

3. Embed ใน HTML:
   ```css
   @font-face {
     font-family: 'Sarabun';
     font-weight: 400;
     src: url('data:font/truetype;base64,AAAA...') format('truetype');
   }
   ```

4. ลบ `<link href="https://fonts.googleapis.com/...">` ออก

## Replace String Bug (bonus lesson)

ถ้า HTML มี repeated structure เช่น 2 party blocks ที่ใช้ placeholder เหมือนกัน
→ `String.Replace()` จะ replace ทุก occurrence
→ ต้องใช้ `IndexOf` + `Substring` เพื่อ replace เฉพาะ occurrence แรก

```powershell
$first = $content.IndexOf($placeholder)
$content = $content.Substring(0,$first) + $newValue + $content.Substring($first + $placeholder.Length)
```

## Tags

`chrome-headless` `pdf-generation` `font` `sarabun` `base64` `powershell`
