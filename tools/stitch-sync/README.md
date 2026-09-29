# Google Stitch Synchronization Toolchain

Automated CLI utility to manage, validate, and rebuild Google Stitch design screens inside the CoBuild PropTech platform repository.

---

## 🛠️ Usage

### 1. Verify Status of All Screens on Disk
```powershell
python tools/stitch-sync/stitch_sync.py --status
```
Checks all 27 screens in `stitch-screens/manifest.json` against `stitch-screens/screens/` and `stitch-screens/screenshots/`.

### 2. Rebuild Gallery Viewer
```powershell
python tools/stitch-sync/stitch_sync.py --rebuild-gallery
```
Re-injects updated screen metadata into `stitch-screens/index.html` and recalculates filter counts.

---

## 📂 Catalog Assets
- **HTML Screens**: `stitch-screens/screens/` (Standalone, responsive, RTL/LTR compatible)
- **High-Res Screenshots**: `stitch-screens/screenshots/` (PNG renders)
- **Manifest**: `stitch-screens/manifest.json` (Structured JSON catalog)
