# Edge Headless PDF Rendering Gotchas

**Date**: 2026-04-09
**Source**: NDF Quotation PDF generation session

## Empty Div Border Collapse
- Empty `<div>` with only `border-top: 1px solid #666` gets **collapsed** by Edge headless
- Fix: Use `height: 1px; background: #666; width: 100%` instead
- This is reliable across both `--headless` and `--headless=new` modes

## Font Loading in Headless Mode
- `--headless=new` renders embedded fonts better than old `--headless`
- For @font-face with base64 data URIs, use MIME type `application/x-font-ttf` (not `font/truetype`)
- TrueType files start with magic bytes `00 01 00 00` — verify format before declaring
- Google Fonts with minimal User-Agent may return TTF (not woff2) despite URL extension

## PDF Generation Command
```bash
msedge.exe --headless=new --disable-gpu \
  --print-to-pdf="output.pdf" \
  --no-pdf-header-footer \
  "file:///path/to/input.html"
```

## Path Encoding
- ψ character in file paths must be URL-encoded as `%CF%88` for `file:///` URLs
- Edge headless returns exit code 2 even on success — check for "bytes written" in stderr
