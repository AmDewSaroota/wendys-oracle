# NDF Quotation Format (ใบเสนอราคา)

## Template Location
- Build script: `ψ/active/build-quotation.js`
- Assets: `ψ/active/` (b64-logo-h.txt, b64-logo-f.txt, b64-sig.txt, sarabun-*-b64.txt)
- Original template: `E:\01_Work\_NDF\_Doc\QT202604020001 - ใบเสนอราคา.pdf`

## Key Specs
- **Font**: Sarabun (Regular 400, SemiBold 600, Bold 700) — embedded as base64 @font-face
- **Page**: A4, margins `18mm 18mm 12mm 18mm`
- **Colors**: Navy `#1a3f6f`, Dark navy `#3d4f6f`, Body `#222`
- **PDF generation**: Edge headless `--headless=new --no-pdf-header-footer`

## Layout Structure
1. **Header**: NDF logo (95px) + company info | "ใบเสนอราคา" (15pt) + "Quotation" (5.5pt)
2. **Blue line**: 3px solid `#1a3f6f`
3. **Customer/Doc info**: Left (56%) customer name+address | Right (40%) doc number, date, validity
4. **Items table**: Dark header `#3d4f6f`, columns: ลำดับ(6%), รายละเอียด(47%), จำนวน(10%), ราคา/หน่วย(16%), จำนวนเงิน(21%)
5. **Totals row**: Left = amount in words box (gray bg `#edf1f7` + navy left border 3px) | Right = subtotal/VAT/grand total
6. **Payment info**: Bordered box with bank details (TTB, account 485-2-75921-8)
7. **Signature**: Two boxes side-by-side (42% each) — left=customer, right=boss with signature image
8. **NDF footer logo**: Under boss's signature (NOT centered on page)
9. **Validity text**: Centered, small gray text

## Important Rules
- เส้นรองลายเซ็น (sig-line) ต้องเป็นเส้นต่อเนื่อง ห้ามขาด — ใช้ `<div class="sig-line">` แยกจากข้อความ
- โลโก้ NDF อยู่ใต้ชื่อเจ้านาย (ภิญโญ ตัณรัตนมณฑล) ไม่ใช่ตรงกลางหน้า
- Font ต้องเป็น Sarabun ทั้งหมด ห้ามมี Tahoma — ใช้ `!important` บน `*` selector
- Company name: บริษัท เอ็นดีเอฟ เอ็กซ์ อินเทอร์แอคทีฟ จำกัด (สำนักงานใหญ่)
- Tax ID: 0505568003055
- Boss name: ภิญโญ ตัณรัตนมณฑล (สะกดให้ถูก!)

## Doc Number Format
- Pattern: `QT{YYYY}{MM}{DD}{NNNN}` e.g. QT202604080002
- Date format: DD/MM/YYYY

## How to Generate
```bash
cd ψ/active && node build-quotation.js
"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --print-to-pdf="ψ/active/srt-quotation-ndf.pdf" --no-pdf-header-footer "file:///.../%CF%88/active/srt-quotation-ndf.html"
```
