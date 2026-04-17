#!/usr/bin/env python3
"""
Extract Live2D character definitions from STC 5014 binary.
Generates live2d.json.
"""

import json
import struct
from pathlib import Path
from typing import Dict, List, Optional

from paths import DATA_DIR, GUN_LIVE2D, stc
from stc_reader import StcReader


def parse_stc_5014(binary_path: Path) -> List[Dict]:
    """Parse STC 5014 (Live2D character info table)."""
    if not binary_path.exists():
        print(f"[Error] {binary_path} not found")
        return []

    with open(binary_path, "rb") as f:
        data = f.read()

    reader = StcReader(data)
    reader.offset = 0xD7

    entries = []

    try:
        while reader.offset < len(data):
            if len(data) - reader.offset < 4:
                break

            id_val = reader.read_int()
            motions = reader.read_string_strict()
            code = reader.read_string_strict()
            fit_gun = reader.read_int()
            skin = reader.read_int()
            mail_offset_x = reader.read_string_strict()
            mail_offset_y = reader.read_string_strict()
            mail_scale = reader.read_string_strict()
            skin_type = reader.read_int()
            skin_logo = reader.read_int()
            fit_sangvis = reader.read_int()
            reader.read_int()  # unknown field (0x05 in header)

            if code:
                entries.append({
                    "id": id_val,
                    "motions": motions,
                    "code": code,
                    "fit_gun": fit_gun,
                    "skin": skin,
                    "mail_offset_x": mail_offset_x,
                    "mail_offset_y": mail_offset_y,
                    "mail_scale": mail_scale,
                    "skinType": skin_type,
                    "skinLogo": skin_logo,
                    "fit_sangvis": fit_sangvis,
                })

    except struct.error:
        if len(entries) > 200:
            print(f"[Warning] EOF at {reader.offset}/{len(data)} after {len(entries)} records")
        else:
            print(f"Failed at offset {reader.offset} (0x{reader.offset:x}) after {len(entries)} records")
            raise

    if len(entries) < 10:
        raise ValueError(f"Parsed only {len(entries)} records; parsing logic likely incorrect.")

    print(f"[Success] Parsed {len(entries)} records from STC 5014")
    return entries


def get_asset_directories(base_path: Path) -> Dict[str, str]:
    """Build {lowercase_name: actual_name} map from the gun assets directory."""
    if not base_path.exists():
        print(f"[Warning] Assets path {base_path} does not exist.")
        return {}
    return {item.name.lower(): item.name for item in base_path.iterdir() if item.is_dir()}


def find_matching_directory(code: str, asset_map: Dict[str, str]) -> Optional[str]:
    """
    Match a character code to an asset directory.
    Priority: exact -> base ID (strip skin suffix) -> strip Mod suffix.
    """
    code_lower = code.lower()
    if code_lower in asset_map:
        return asset_map[code_lower]

    base_id = code_lower.split("_")[0]
    if base_id in asset_map:
        return asset_map[base_id]

    if base_id.endswith("mod") and (stripped := base_id[:-3]) in asset_map:
        return asset_map[stripped]

    return None


def save_live2d_json(entries: List[Dict], filter_missing: bool = True):
    json_path = DATA_DIR / "live2d.json"
    json_path.parent.mkdir(parents=True, exist_ok=True)

    if filter_missing:
        filtered = [e for e in entries if e.get("directory")]
        removed = len(entries) - len(filtered)
        if removed > 0:
            print(f"[Info] Filtered {removed} entries without matching directories:")
            for e in entries:
                if not e.get("directory"):
                    print(f"  - {e.get('code', 'UNKNOWN')}")
        entries = filtered

    entries.sort(key=lambda x: x["id"])

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=4)

    print(f"[Success] Saved {len(entries)} entries to {json_path}")


def main():
    entries = parse_stc_5014(stc(5014))
    if not entries:
        return

    asset_map = get_asset_directories(GUN_LIVE2D)
    print(f"[Info] Found {len(asset_map)} directories in {GUN_LIVE2D}")

    matched = 0
    missing = 0

    for entry in entries:
        code = entry["code"]
        skin_id = entry.get("skin", 0)
        directory = None

        if skin_id > 0:
            skin_key = f"{code}_{skin_id}".lower()
            directory = asset_map.get(skin_key)

            if not directory:
                base_id = code.split("_")[0]
                if base_id.lower().endswith("mod"):
                    stripped_key = f"{base_id[:-3]}_{skin_id}".lower()
                    directory = asset_map.get(stripped_key)

        if not directory:
            directory = find_matching_directory(code, asset_map)

        entry["directory"] = directory
        matched += directory is not None
        missing += directory is None

        motions_str = entry.get("motions", "")
        if motions_str:
            try:
                entry["motions"] = [int(m) for m in motions_str.split(",") if m.strip()]
            except ValueError:
                entry["motions"] = []
        else:
            entry["motions"] = []

    save_live2d_json(entries)
    print(f"Matched: {matched}  Missing: {missing}")


if __name__ == "__main__":
    main()
