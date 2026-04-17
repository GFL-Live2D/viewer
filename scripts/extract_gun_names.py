#!/usr/bin/env python3
"""
Extract gun display names from STC 5005 binary.

Maps gun IDs to display names:
  fit_gun (from live2d.json) -> en_name (from STC 5005)

Example mapping:
  104 -> "G36C"
  197 -> "Carcano M1891"
"""

import json
import struct
from pathlib import Path
from typing import Dict

from paths import DATA_DIR, stc
from stc_reader import StcReader

OVERRIDE = {
    "95": {"en_name": "Hanyang Type 88", "code": "88type"},
    "238": {"en_name": "QJY-88", "code": "QJY88"},
    "337": {"en_name": "De Lisle", "code": "Delisle"},
    "20095": {"en_name": "Hanyang Type 88", "code": "88type"},
    "114": {"en_name": "Welrod MkII", "code": "Welrod"},
}


def parse_stc_5005(binary_path: Path) -> Dict[int, Dict]:
    """Parse STC 5005 to extract gun name, en_name, and code fields."""
    if not binary_path.exists():
        print(f"[Error] {binary_path} not found")
        return {}

    with open(binary_path, "rb") as f:
        data = f.read()

    guns = {}
    current_offset = 0x24A  # First gun record

    try:
        while current_offset < len(data) - 100:
            try:
                gun_id = struct.unpack_from("<i", data, current_offset)[0]
            except struct.error:
                break

            if gun_id <= 0 or gun_id > 100000:
                break

            if current_offset + 4 >= len(data) or data[current_offset + 4] != 0x01:
                break

            reader = StcReader(data)
            reader.offset = current_offset
            gun_id_read = reader.read_int()
            gun_name = reader.read_string()
            en_name = reader.read_string()
            code = reader.read_string()

            # gun_name format is always "gun-XXXXXXXX" (12 chars)
            if not (gun_name and gun_name.startswith("gun-") and len(gun_name) == 12):
                break

            # Skip records where en_name/code are back-references rather than display values
            is_ref = lambda s: s and s.startswith("gun-")
            if not is_ref(en_name) and not is_ref(code) and gun_id_read not in guns:
                guns[gun_id_read] = {"__0": gun_name, "__1": en_name, "__2": code}

            # Scan forward for the next valid gun record
            search_offset = current_offset + 8
            found_next = False

            while search_offset < len(data) - 100:
                try:
                    next_id = struct.unpack_from("<i", data, search_offset)[0]
                    if 1 <= next_id <= 100000 and data[search_offset + 4] == 0x01:
                        tr = StcReader(data)
                        tr.offset = search_offset
                        t_id = tr.read_int()
                        t_name = tr.read_string()
                        t_en = tr.read_string()
                        t_code = tr.read_string()
                        if (t_name and t_name.startswith("gun-") and len(t_name) == 12
                                and t_en and not t_en.startswith("gun-")
                                and t_code and not t_code.startswith("gun-")):
                            current_offset = search_offset
                            found_next = True
                            break
                except Exception:
                    pass
                search_offset += 1

            if not found_next:
                break

    except Exception as e:
        print(f"[Error] Failed to parse STC 5005: {e}")

    print(f"[Success] Parsed {len(guns)} gun records from STC 5005")
    return guns


def build_gun_names() -> Dict:
    print("[Step 1] Loading live2d.json...")
    with open(DATA_DIR / "live2d.json", "r", encoding="utf-8") as f:
        live2d = json.load(f)

    print("[Step 2] Parsing STC 5005 binary...")
    gun_map = parse_stc_5005(stc(5005))

    print(f"[Step 3] Building mappings from {len(live2d)} models...")
    gun_names = {}
    missing_ids = set()

    for model in live2d:
        fit_gun = model.get("fit_gun")
        if not fit_gun or fit_gun in gun_names:
            continue
        if fit_gun in gun_map:
            d = gun_map[fit_gun]
            gun_names[fit_gun] = {"en_name": d.get("__1", ""), "code": d.get("__2", "")}
        else:
            missing_ids.add(fit_gun)

    if missing_ids:
        print(f"[Warning] {len(missing_ids)} fit_gun IDs not found: {sorted(missing_ids)[:10]}")

    print("[Step 4] Applying overrides...")
    overridden = added = 0
    for gun_id_str, override_data in OVERRIDE.items():
        gun_id_int = int(gun_id_str)
        if gun_id_int in gun_names:
            gun_names[gun_id_int].update(override_data)
            overridden += 1
        else:
            gun_names[gun_id_int] = override_data.copy()
            added += 1

    if overridden or added:
        print(f"[Success] Applied {overridden} overrides, added {added} new entries")

    return gun_names


def save_output(gun_names: Dict):
    output_path = DATA_DIR / "names.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sorted_names = {str(k): v for k, v in sorted(gun_names.items())}
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(sorted_names, f, ensure_ascii=False, indent=2)
    print(f"[Success] Saved {len(gun_names)} gun name mappings to {output_path}")


def main():
    gun_names = build_gun_names()
    save_output(gun_names)


if __name__ == "__main__":
    main()
