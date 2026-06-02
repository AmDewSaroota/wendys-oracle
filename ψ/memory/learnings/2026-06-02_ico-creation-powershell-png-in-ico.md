---
date: 2026-06-02
tags: [windows, powershell, ico, binary-format, shortcut]
source: rrr: wendys-oracle
---

# Windows ICO Creation in PowerShell 5.1

## Pattern

Creating a valid `.ico` file from PowerShell requires:

1. **PNG-in-ICO format** (supported Vista+): embed raw PNG bytes inside an ICO container
2. **Mandatory header structure**:
   - 6-byte ICONDIR: `00 00 01 00 [count as uint16]`
   - 16-byte ICONDIRENTRY per image: `width, height, colorCount, reserved, planes(uint16), bitDepth(uint16), dataSize(uint32), dataOffset(uint32)`
   - Width/Height byte = `0` means 256 (ICO spec)
3. **Critical PS 5.1 bug**: `List[byte].AddRange(@(1,0))` fails — `@()` is `Object[]` not `IEnumerable[byte]`. Always cast: `[byte[]]@(1,0)`

## Working Code Pattern

```powershell
$ico = New-Object System.Collections.Generic.List[byte]
$ico.AddRange([byte[]]@(0,0, 1,0, 2,0))  # header, 2 images
# ... directory entries with [byte[]] casts ...
$ico.AddRange([byte[]]$pngData)
[System.IO.File]::WriteAllBytes($path, $ico.ToArray())
```

## What Doesn't Work

- `GetHicon()` → single-size (32x32), blurry at desktop icon sizes
- Naive `bmp.Save(stream, ImageFormat.Icon)` → not valid ICO container
- `AddRange(@(...))` without `[byte[]]` cast → PS 5.1 type error

## Why

ICO is a container format, not an image format. Windows Shell reads the directory to find each size. Missing the directory = "contains no icons" error even if image data is valid.
