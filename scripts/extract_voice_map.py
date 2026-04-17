#!/usr/bin/env python3
"""
Extract motion-to-voice mappings with captions from STC 5037 + NewCharacterVoice.txt.

Parses STC 5037 to extract motion file paths, voice key strings (GUN|CHARACTER|VOICE_KEY),
and touch areas, then matches with NewCharacterVoice.txt for captions.
"""

import json
import struct
from pathlib import Path
from typing import Dict, List, Optional

from paths import DATA_DIR, PROFILE_CONFIG, stc
from stc_reader import StcReader


def parse_stc_5037(binary_path: Path) -> List[Dict]:
    """Parse STC 5037 sequentially, field-by-field."""
    if not binary_path.exists():
        print(f"[Error] {binary_path} not found")
        return []

    with open(binary_path, "rb") as f:
        data = f.read()

    # Data section starts at 0x0b7d (verified by locating first record)
    reader = StcReader(data)
    reader.offset = 0x0B7D

    records = []

    while reader.offset < len(data) - 50:
        record_start = reader.offset

        try:
            motion_id = reader.read_int()
            motion_type = reader.read_int()

            # motion_file can be empty for some records (e.g. 802, 803)
            motion_file = reader.read_string() or ""
            if motion_file and not motion_file.endswith(".mtn"):
                print(f"[Warning] Record {len(records)}: unexpected motion_file '{motion_file}', skipping")
                reader.offset = record_start + 1
                continue

            touch_area = reader.read_string() or ""
            hold_time = reader.read_string() or ""
            probability = reader.read_float()

            # Fields 6-9: typically empty; field 6 or 9 carries the voice string when present
            field6 = reader.read_string()
            reader.read_string()  # field 7
            reader.read_string()  # field 8
            field9 = reader.read_string()

            identifier = reader.read_string() or ""

            # int11: motion category (0=default, 1=interactive, 256/257=other)
            motion_category = reader.read_int()
            reader.read_int()  # int12
            reader.read_int()  # int13

            reader.read_bytes(2)  # null padding before final string
            reader.read_string()  # final string (usually empty)

            voice_key = field6 or field9 or ""

            records.append({
                "motion_id": motion_id,
                "motion_type": motion_type,
                "motion_file": motion_file,
                "touch_area": touch_area,
                "hold_time": hold_time,
                "probability": probability,
                "voice_string": voice_key,
                "identifier": identifier,
                "motion_category": motion_category,
            })

        except Exception as e:
            print(f"[Error] Record {len(records)} at offset 0x{record_start:04x}: {e}")
            break

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

    print(f"[Success] Loaded {len(voice_map)} characters with voice captions")
    return voice_map


def build_mappings(stc_records: List[Dict], voice_map: Dict) -> Dict:
    """Group motions by character code derived from STC voice strings."""
    print(f"[Info] Building mappings from {len(stc_records)} STC records and {len(voice_map)} voice map entries")

    char_groups: Dict[str, Dict] = {}

    for record in stc_records:
        voice_string = record.get("voice_string", "")
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
    """Save motions.json and voice.json."""
    output_dir = DATA_DIR
    output_dir.mkdir(parents=True, exist_ok=True)

    motions_list = [
        {
            "id": r["motion_id"],
            "type": r["motion_type"],
            "motion_name": r["motion_file"],
            "touch_area": r["touch_area"],
            "hold_time": r["hold_time"],
            "probability": r["probability"],
            "voice": r["voice_string"],
            "text": r["voice_string"],
            "expression": "",
            "face_motion": "",
            "name": r["identifier"],
            "camera": 0,
            "is_hurt": 0,
            "level": 0,
            "is_interrupt": 0,
            "motion_category": r["motion_category"],
        }
        for r in stc_records
        if r.get("motion_id")
    ]

    with open(output_dir / "motions.json", "w", encoding="utf-8") as f:
        json.dump(motions_list, f, ensure_ascii=False, indent=4)
    print(f"[Success] Saved {len(motions_list)} motion entries to motions.json")

    voice_list = []
    for r in stc_records:
        if not r.get("motion_id"):
            continue
        voice_string = r.get("voice_string", "")
        voice_key = caption = ""
        if voice_string:
            parts = voice_string.split("|")
            if len(parts) >= 3:
                char_code, voice_key = parts[1], parts[2]
                caption = voice_map.get(char_code, {}).get(voice_key, "")
        voice_list.append({"id": r["motion_id"], "voice_key": voice_key, "caption": caption})

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
