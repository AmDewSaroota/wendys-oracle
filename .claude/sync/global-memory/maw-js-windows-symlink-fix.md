---
name: maw-js Windows install (full setup + symlink fix)
description: Full install path for maw-js + maw-ui on Windows, including the symlink-via-junction workaround needed before first maw serve run
type: project
originSessionId: d12e0f78-432c-481a-a57e-c693e99722a7
---

## Full Install (Windows, both WEnDyS twins)

Two repos needed: `maw-js` (server) + `maw-ui` (web UI — separate package). The maw default landing page says "maw-ui not installed" until step 5 is done.

```powershell
# 1. Clone both repos
git clone https://github.com/Soul-Brews-Studio/maw-js "$env:USERPROFILE\maw-js"
git clone https://github.com/Soul-Brews-Studio/maw-ui "$env:USERPROFILE\maw-ui"

# 2. Build maw-js (CLI) — exposes `maw` at C:\Users\<USER>\.bun\bin\maw.exe
Set-Location "$env:USERPROFILE\maw-js"; bun install; bun link

# 3. Pre-create plugin junctions (Windows symlink fix — see below)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.maw\plugins" | Out-Null
$plugins = "federation","fleet","oracle","plugin","session","swarm","team","tmux","transport"
foreach ($p in $plugins) {
    $src = "$env:USERPROFILE\maw-js\src\commands\plugins\$p"
    $dest = "$env:USERPROFILE\.maw\plugins\$p"
    if (-not (Test-Path $dest)) { New-Item -ItemType Junction -Path $dest -Target $src | Out-Null }
}

# 4. Build maw-ui
Set-Location "$env:USERPROFILE\maw-ui"; bun install; bun run build

# 5. Junction the UI dist where maw serve looks for it
$uiDest = "$env:USERPROFILE\.maw\ui\dist"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.maw\ui" | Out-Null
if (-not (Test-Path $uiDest)) { New-Item -ItemType Junction -Path $uiDest -Target "$env:USERPROFILE\maw-ui\dist" | Out-Null }

# 6. Run
maw serve   # listens on 3456 — open http://localhost:3456/ in browser
```

**Why:** maw's `plugin-bootstrap.ts` calls `symlinkSync()` to link `<repo>/src/commands/plugins/<name>` → `~/.maw/plugins/<name>`. Windows blocks symlinks for non-admin users without Dev Mode. The bootstrap skips dest if it already exists (`if (existsSync(dest)) continue`), so pre-creating each dest as a Junction sidesteps the symlink call. The same applies to `~/.maw/ui/dist` for the maw-ui drop-in.

**How to apply:** Whenever installing maw-js on either WEnDyS twin (พี่เวนดี้ notebook or น้องเวนดี้ PC), run the block above. Junctions don't need admin rights. Alternative: enable Windows Developer Mode (Settings → Privacy & Security → For developers) — but the junction route is non-invasive.

## Don't connect via god.buildwithoracle.com

The fleet test page at `https://god.buildwithoracle.com/#fleet` will fail with `Connection failed: not a maw-js node` because HTTPS→HTTP localhost is blocked by browser mixed-content policy. Open `http://localhost:3456/` directly — the maw door page itself hints this.

## Restarting maw serve

The process is `bun.exe`, not `maw.exe` — `Stop-Process -Name maw` won't catch it. Find by port:
```powershell
$pid3456 = (Get-NetTCPConnection -LocalPort 3456 -State Listen).OwningProcess
Stop-Process -Id $pid3456 -Force
```
Or via Bash: `taskkill //F //PID <pid>`.

**Versions confirmed (2026-05-05):** maw v26.5.2, maw-ui v1.4.0, bun 1.3.9, Windows 11 Pro 26200.
