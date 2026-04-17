#!/usr/bin/env python3
"""
Extract costume/skin display names from skin.txt and live2d codes.

Maps costume names to live2d codes:
  skin-10000001 (Pumpkin Mishka) -> code (gun_code_1202)

Example mapping:
  "Ode to Summer" -> "G36C_1202"
  "Narcissus" -> "95type_405"
"""

import json
from pathlib import Path
from typing import Dict

from paths import DATA_DIR, GUN_LIVE2D, TABLE


def load_skin_names() -> Dict[str, str]:
    """Load costume names from skin.txt (skin-1XXXXXXX format = name entries)."""
    skin_path = TABLE / "skin.txt"

    if not skin_path.exists():
        print(f"[Error] {skin_path} not found")
        return {}

    skin_map = {}
    with open(skin_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or "," not in line:
                continue
            parts = line.split(",", 1)
            if len(parts) != 2:
                continue
            skin_id, name = parts
            # skin-1XXXXXXX entries are display names; skin-2/3/4 are other fields
            if skin_id.startswith("skin-1") and name and not name.startswith("//"):
                skin_map[skin_id] = name

    print(f"[Success] Loaded {len(skin_map)} costume names from skin.txt")
    return skin_map


def load_skin_to_code() -> Dict[int, str]:
    """Build {numeric_skin_id: directory_name} from the gun live2d directory structure."""
    if not GUN_LIVE2D.exists():
        print(f"[Error] {GUN_LIVE2D} not found")
        return {}

    skin_to_code = {}
    for gun_dir in GUN_LIVE2D.iterdir():
        if not gun_dir.is_dir() or "_" not in gun_dir.name:
            continue
        try:
            skin_id = int(gun_dir.name.split("_")[-1])
            skin_to_code[skin_id] = gun_dir.name
        except (ValueError, IndexError):
            continue

    print(f"[Success] Loaded {len(skin_to_code)} skin-to-code mappings from live2dnew directory")
    return skin_to_code


def build_costume_names() -> Dict[str, str]:
    print("[Step 1] Loading costume names from skin.txt...")
    skin_names = load_skin_names()

    print("[Step 2] Loading skin-to-code mappings from live2dnew directory...")
    skin_to_code = load_skin_to_code()

    print("[Step 3] Building mappings...")
    costume_map = {}
    missing = []

    for skin_id, costume_name in skin_names.items():
        try:
            # skin-1NNNNNNN: strip "skin-1" to get the numeric skin ID
            skin_num = int(skin_id.replace("skin-1", ""))
            if skin_num in skin_to_code:
                code = skin_to_code[skin_num]
                if costume_name and costume_name not in costume_map:
                    costume_map[costume_name] = code
            else:
                missing.append(skin_id)
        except (ValueError, IndexError):
            continue

    if missing:
        print(f"[Warning] {len(missing)} skins not found in live2d mappings (first 10): {missing[:10]}")

    return costume_map


def save_output(costume_map: Dict[str, str]):
    output_path = DATA_DIR / "costumes.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Store as code -> name, sorted by code
    reversed_map = {code: name for name, code in costume_map.items()}
    sorted_costumes = dict(sorted(reversed_map.items()))

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(sorted_costumes, f, ensure_ascii=False, indent=4)

    print(f"[Success] Saved {len(costume_map)} code-to-costume mappings to {output_path}")


def main():
    costume_map = build_costume_names()
    save_output(costume_map)


if __name__ == "__main__":
    main()
