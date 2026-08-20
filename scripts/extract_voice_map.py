#!/usr/bin/env python3
"""
Extract motion-to-voice mappings with captions from STC 5037 binary + NewCharacterVoice.txt.

Parses STC 5037 binary directly to extract:
- Motion file paths
- Voice key strings (GUN|CHARACTER|VOICE_KEY)
- Touch areas

Then matches with:
- NewCharacterVoice.txt for captions
- Live2D model files for folder structure
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional

sys.path.insert(0, str(Path(__file__).parent.parent / "gfl-data-miner-python"))
from utils.format_stc import format_stc

from paths import DATA_DIR, PROFILE_CONFIG, ROOT, stc

STC_MAPPING_DIR = ROOT / "gfl-data-miner-python" / "dataminer" / "stc-mapping" / "3081"


def parse_stc_5037(binary_path: Path) -> List[Dict]:
    """Parse STC 5037 (Live2D Motions) via gfl-data-miner-python's header-driven format_stc."""
    if not binary_path.exists():
        print(f"[Error] {binary_path} not found")
        return []

    _, raw_records = format_stc(str(binary_path), str(STC_MAPPING_DIR / "5037.json"), long=True)

    records = []
    for r in raw_records:
        records.append({
            "motion_id": r["id"],
            "motion_type": r["type"],
            "motion_file": r["motion_name"],
            "touch_area": r["touch_area"],
            "hold_time": r["hold_time"],
            "probability": r["probability"],
            "voice_string": r["voice"],
            "identifier": r["name"],
            "motion_category": r["camera"],
            "is_hurt": r["is_hurt"],
            "delay": r["delay"],
            "voice_code": r["voice_code"],
            "is_interrupt": r["is_interrupt"],
            "next_motions": r["next_motions"],
        })

    print(f"[Success] Parsed {len(records)} motion records from STC 5037")
    return records


def load_voice_captions() -> Dict[str, Dict[str, str]]:
    """Load voice captions from NewCharacterVoice.txt (CHARACTER_ID|VOICE_KEY|CAPTION)."""
    voice_file = PROFILE_CONFIG / "NewCharacterVoice.txt"

    if not voice_file.exists():
        print(f"[Error] {voice_file} not found")
        return {}

    voice_map: Dict[str, Dict[str, str]] = {}

    with open(voice_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            # Split on first 2 pipes only; caption may itself contain pipes
            parts = line.split("|", 2)
            if len(parts) < 3:
                continue
            char_id, voice_key, caption = parts
            voice_map.setdefault(char_id, {})[voice_key] = caption

    print(f"[Success] Loaded {len(voice_map)} characters with voice captions from NewCharacterVoice.txt")
    return voice_map


def build_mappings(stc_records: List[Dict], voice_map: Dict) -> Dict:
    """Build motion -> voice_key -> caption mappings relying only on STC and NewCharacterVoice.txt."""
    print(f"[Info] Building mappings from {len(stc_records)} STC records and {len(voice_map)} voice map entries")

    # STC voice_string format: GUN|CODE|VOICE_KEY (e.g., GUN|88type_1809|DIALOGUE1)
    # char_code is authoritative for distinguishing skins (e.g. "98K" vs "98K_4301")
    char_groups: Dict[str, Dict] = {}

    for record in stc_records:
        voice_string = record.get("voice_string")
        motion_file = record.get("motion_file")
        motion_id = record.get("motion_id")

        if not voice_string:
            continue

        if "|" not in voice_string:
            raise ValueError(f"Invalid voice string format in record {motion_id}: '{voice_string}'")

        parts = voice_string.split("|")
        if len(parts) < 3:
            raise ValueError(f"Invalid voice string segments in record {motion_id}: '{voice_string}'")

        char_code = parts[1]
        voice_key = parts[2]

        if char_code not in char_groups:
            char_groups[char_code] = {
                "character": char_code,
                "voice_id": char_code,
                "motions": {},
                "motion_ids": set(),
            }

        if motion_file:
            caption = voice_map.get(char_code, {}).get(voice_key, "")
            char_groups[char_code]["motions"][motion_file] = {
                "voice_key": voice_key,
                "caption": caption,
            }

        if motion_id:
            char_groups[char_code]["motion_ids"].add(motion_id)

    for group in char_groups.values():
        group["motion_ids"] = sorted(group["motion_ids"])

    print(f"[Info] Extracted {len(char_groups)} characters from STC data")
    return char_groups


def save_output(stc_records: List[Dict], voice_map: Dict) -> None:
    """Save outputs:
    1. motions.json (StcLive2d_motions.json equivalent)
    2. voice.json (Motion ID -> Voice Mapping for direct O(1) lookup)
    """
    output_dir = DATA_DIR
    output_dir.mkdir(parents=True, exist_ok=True)

    motions_list = []
    for record in stc_records:
        motion_id = record.get("motion_id")
        if not motion_id:
            continue
        motions_list.append({
            "id": motion_id,
            "type": record.get("motion_type"),
            "motion_name": record.get("motion_file", ""),
            "touch_area": record.get("touch_area", ""),
            "hold_time": record.get("hold_time", ""),
            "probability": record.get("probability", 1.0),
            "voice": record.get("voice_string", ""),
            "text": record.get("voice_string", ""),
            "expression": "",
            "face_motion": "",
            "name": record.get("identifier", ""),
            "camera": record.get("motion_category", 0),
            "is_hurt": record.get("is_hurt", 0),
            "level": 0,
            "is_interrupt": record.get("is_interrupt", 0),
            "delay": record.get("delay", 0),
            "voice_code": record.get("voice_code", ""),
            "next_motions": record.get("next_motions", ""),
        })

    with open(output_dir / "motions.json", "w", encoding="utf-8") as f:
        json.dump(motions_list, f, ensure_ascii=False, indent=4)
    print(f"[Success] Saved {len(motions_list)} motion entries to motions.json")

    # voice.json: array of { id: motion_id, voice_key, caption } for O(1) lookup by motion id
    voice_list = []
    for record in stc_records:
        motion_id = record.get("motion_id")
        if not motion_id:
            continue

        voice_string = record.get("voice_string", "")
        voice_key = ""
        caption = ""

        if voice_string:
            parts = voice_string.split("|")
            if len(parts) >= 3:
                char_code = parts[1]
                voice_key = parts[2]
                caption = voice_map.get(char_code, {}).get(voice_key, "")

        voice_list.append({"id": motion_id, "voice_key": voice_key, "caption": caption})

    with open(output_dir / "voice.json", "w", encoding="utf-8") as f:
        json.dump(voice_list, f, ensure_ascii=False, indent=4)
    print(f"[Success] Saved {len(voice_list)} motion voice mappings to voice.json")


def main():
    print("[Step 1] Parsing STC 5037 binary...")
    stc_records = parse_stc_5037(stc(5037))
    if not stc_records:
        print("[Error] Failed to parse STC 5037")
        return

    print("[Step 2] Loading voice captions from NewCharacterVoice.txt...")
    voice_map = load_voice_captions()
    if not voice_map:
        print("[Error] Failed to load voice captions")
        return

    print("[Step 3] Building motion -> voice_key -> caption mappings...")
    mappings = build_mappings(stc_records, voice_map)
    if not mappings:
        print("[Error] Failed to build mappings")
        return

    print("[Step 4] Saving output...")
    save_output(stc_records, voice_map)
    print("[Done]")


if __name__ == "__main__":
    main()
