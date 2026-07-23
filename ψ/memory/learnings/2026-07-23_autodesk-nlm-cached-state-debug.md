# Autodesk License Debug: nlm-server-info.json คือ root cause

**Date**: 2026-07-23
**Source**: rrr: lbe-3d-character-3dsmax-setup

## Pattern

เมื่อ 3ds Max (หรือ Autodesk product อื่น) install ไม่ได้ด้วย error "Network License Manager version does not meet minimum requirements" — แม้จะ remove NLM แล้ว ให้เช็คตามลำดับนี้:

1. `%ProgramData%\Autodesk\AdskLicensingService\nlm-server-info.json` — ลบออก (cached NLM entry, version = 0.0.0.0)
2. `%ProgramData%\Autodesk\AdskLicensingService\*\licpath.lic` — ล้างให้ว่าง (SERVER localhost entry)
3. `%PROGRAMFILES(X86)%\Common Files\Autodesk Shared\Network License Manager\licenses.lic` — ลบออก (NLM license file)
4. Registry: `HKLM\SOFTWARE\FLEXlm License Manager` และ WOW6432Node — ลบออก

## Key Insight

nlm-server-info.json เก็บ cached state ว่า "เคยมี NLM ที่ localhost และ version ของมันคือ 0.0.0.0" — installer อ่านไฟล์นี้แล้วตรวจสอบ version ทำให้ fail แม้ NLM จะถูก remove ไปแล้ว

## Command (Admin PowerShell)

```powershell
Get-ChildItem "$env:ProgramData\Autodesk\AdskLicensingService" -Recurse -Filter "nlm-server-info.json" | Remove-Item -Force
```
