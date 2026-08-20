#!/usr/bin/env python3
"""
Extract Live2D character definitions from STC 5014 binary.
Generates live2d.json.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent / "gfl-data-miner-python"))
from utils.format_stc import format_stc

from paths import DATA_DIR, GUN_LIVE2D, ROOT, stc

STC_MAPPING_DIR = ROOT / "gfl-data-miner-python" / "dataminer" / "stc-mapping" / "3081"


def parse_stc_5014(binary_path: Path) -> List[Dict]:
    """Parse STC 5014 (Live2D Info) via gfl-data-miner-python's header-driven format_stc."""
    if not binary_path.exists():
        print(f"[Error] {binary_path} not found")
        return []

    _, entries = format_stc(str(binary_path), str(STC_MAPPING_DIR / "5014.json"), long=True)

    if len(entries) < 10:
        raise ValueError(f"Parsed only {len(entries)} records. Parsing logic likely incorrect.")

    print(f"[Success] Parsed {len(entries)} records from STC 5014")
    return [dict(e) for e in entries]


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

    # fit_gun -1 marks NPC-only skins with no equippable gun (e.g. NPC_Kalina_*)
    unfit_entries = [e for e in entries if e.get("fit_gun") == -1]
    if unfit_entries:
        print(f"[Info] Filtered out {len(unfit_entries)} entries with fit_gun -1:")
        for entry in unfit_entries:
            print(f"  - {entry.get('code', 'UNKNOWN')} (fit_gun -1)")
    entries = [e for e in entries if e.get("fit_gun") != -1]

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
