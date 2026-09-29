#!/usr/bin/env python3
"""
CoBuild PropTech — Google Stitch Screen Synchronization CLI Utility
Preserves and automates the full workflow for fetching, validating, and updating
Google Stitch UI screens and high-resolution assets into the platform repository.
"""

import os
import sys
import json
import re
import urllib.request
import argparse

sys.stdout.reconfigure(encoding='utf-8')

API_KEY = os.environ.get("STITCH_API_KEY", "")
HEADERS = {
    "X-Goog-Api-Key": API_KEY,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CoBuild/2.0"
}
DEFAULT_PROJECT_ID = "10617388055527102029"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STITCH_DIR = os.path.join(REPO_ROOT, "stitch-screens")
SCREENS_DIR = os.path.join(STITCH_DIR, "screens")
SCREENSHOTS_DIR = os.path.join(STITCH_DIR, "screenshots")
MANIFEST_PATH = os.path.join(STITCH_DIR, "manifest.json")
INDEX_PATH = os.path.join(STITCH_DIR, "index.html")
README_PATH = os.path.join(STITCH_DIR, "README.md")


def check_status():
    """Verify that all manifest screens exist on disk with valid byte sizes."""
    if not os.path.exists(MANIFEST_PATH):
        print(f"Error: manifest.json not found at {MANIFEST_PATH}")
        return False

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    screens = manifest.get("screens", [])
    print(f"=================================================================")
    print(f" CoBuild PropTech — Google Stitch Screen Status Check")
    print(f" Manifest: {len(screens)} screens registered")
    print(f"=================================================================")

    missing = 0
    for s in screens:
        idx = s.get("catalog_index", 0)
        title = s.get("title", "")
        html_f = s.get("html_file")
        img_f = s.get("img_file")

        html_ok = True
        img_ok = True

        if html_f:
            h_path = os.path.join(STITCH_DIR, html_f)
            html_ok = os.path.exists(h_path) and os.path.getsize(h_path) > 0

        if img_f:
            i_path = os.path.join(STITCH_DIR, img_f)
            img_ok = os.path.exists(i_path) and os.path.getsize(i_path) > 0

        if html_ok and img_ok:
            print(f"  [OK] #{idx:02d} | {title[:48]}...")
        else:
            print(f"  [MISSING] #{idx:02d} | {title} (HTML={html_ok}, PNG={img_ok})")
            missing += 1

    print(f"-----------------------------------------------------------------")
    if missing == 0:
        print(f"SUCCESS: All {len(screens)} screens are present and verified on disk!")
        return True
    else:
        print(f"WARNING: {missing} screens have missing or empty assets.")
        return False


def rebuild_gallery():
    """Rebuild stitch-screens/index.html and README.md from manifest.json."""
    if not os.path.exists(MANIFEST_PATH):
        print("Error: manifest.json not found.")
        return False

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    screens = manifest.get("screens", [])
    screens.sort(key=lambda s: s.get("catalog_index", 0))

    ui_count = sum(1 for s in screens if s.get("is_ui_screen") and s.get("has_html"))
    total_count = len(screens)
    screens_json = json.dumps(screens, ensure_ascii=False)

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        gallery = f.read()

    gallery = re.sub(r"const screens = \[.*?\];", f"const screens = {screens_json};", gallery, flags=re.DOTALL)
    gallery = re.sub(r'<button class="filter-btn active" data-filter="all">All \(\d+\)</button>', f'<button class="filter-btn active" data-filter="all">All ({total_count})</button>', gallery)
    gallery = re.sub(r'<button class="filter-btn" data-filter="ui">\d+ UI Screens</button>', f'<button class="filter-btn" data-filter="ui">{ui_count} UI Screens</button>', gallery)
    gallery = re.sub(r'<span class="value">\d+ Screens</span>', f'<span class="value">{total_count} Screens</span>', gallery)
    gallery = re.sub(r'<span class="value">\d+ Web Pages</span>', f'<span class="value">{ui_count} Web Pages</span>', gallery)

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(gallery)

    print(f"Gallery index.html successfully rebuilt: {total_count} screens ({ui_count} interactive UI screens).")
    return True


def main():
    parser = argparse.ArgumentParser(description="CoBuild PropTech Stitch Screen Tool")
    parser.add_argument("--status", action="store_true", help="Check status of all screens on disk")
    parser.add_argument("--rebuild-gallery", action="store_true", help="Rebuild gallery index.html from manifest")

    args = parser.parse_args()

    if args.status:
        check_status()
    elif args.rebuild-gallery:
        rebuild_gallery()
    else:
        check_status()


if __name__ == "__main__":
    main()
