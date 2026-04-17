#!/usr/bin/env python3
"""
Multithreaded audio extraction from CriWare ACB files using vgmstream-cli.
Extracts all voice/music/SFX from ACB files found in AssetRipper export.

USAGE:
  Extract all ACB files:
    uv run scripts/extract_all_audio.py

  Extract single ACB file:
    uv run scripts/extract_all_audio.py M950A
    uv run scripts/extract_all_audio.py 100S
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from multiprocessing import cpu_count
from pathlib import Path

from paths import DATA_DIR, SOUNDS_DIR, STREAMING_ASSETS

# ============================================================================
# CONFIGURATION
# ============================================================================

# Filter ACB files by matching against JSON data.
# Options: None (extract all), 'live2d', 'voice', 'motions'
FILTER_BY_JSON = 'live2d'

# Limit extraction to first N files (0 = unlimited)
EXTRACTION_LIMIT = 0

# Output format: 'wav', 'mp3', 'ogg' (mp3/ogg require ffmpeg in PATH)
AUDIO_FORMAT = 'ogg'

# ============================================================================

VGMSTREAM_CLI = "vgmstream-cli"
ASSETS_DIR = STREAMING_ASSETS

if not SOUNDS_DIR.parent.exists():
    print(f"Error: Project structure not found\nLooking for: {SOUNDS_DIR.parent}\nCurrent dir: {os.getcwd()}")
    sys.exit(1)


def load_json_keys(json_type: str) -> list:
    """Load character keys from JSON data files (sorted for deterministic output)."""
    keys = set()

    if json_type == 'live2d':
        live2d_file = DATA_DIR / "live2d.json"
        if live2d_file.exists():
            data = json.loads(live2d_file.read_text(encoding='utf-8'))
            for entry in data:
                # Strip numeric skin suffix (e.g. G36C_1202 -> g36c) to match base ACB name
                base_code = re.sub(r'_\d+$', '', entry['code'].lower())
                keys.add(base_code)
            print(f"[Filtering] Loaded {len(keys)} unique base character codes from live2d.json")

    elif json_type == 'voice':
        voice_file = DATA_DIR / "voice.json"
        if voice_file.exists():
            data = json.loads(voice_file.read_text(encoding='utf-8'))
            for char_data in data.get('characters', {}).values():
                voice_id = char_data.get('voice_id', '').lower()
                if voice_id:
                    keys.add(voice_id)
            print(f"[Filtering] Loaded {len(keys)} unique voice_ids from voice.json")

    elif json_type == 'motions':
        motions_file = DATA_DIR / "motions.json"
        if motions_file.exists():
            data = json.loads(motions_file.read_text(encoding='utf-8'))
            keys = {str(e['id']) for e in data if e.get('id')}
            print(f"[Filtering] Loaded {len(keys)} motion IDs from motions.json")

    return sorted(keys)


def get_acb_files() -> list:
    """Find all ACB files in assets directory, optionally filtered by JSON."""
    if not ASSETS_DIR.exists():
        print(f"Error: Assets directory not found: {ASSETS_DIR}")
        return []

    acb_names = sorted(f.stem.replace('.acb', '') for f in ASSETS_DIR.glob("*.acb.bytes"))

    if not FILTER_BY_JSON:
        return acb_names

    json_keys = load_json_keys(FILTER_BY_JSON)
    if not json_keys:
        return acb_names

    filtered = []
    matched_keys = []
    for acb in acb_names:
        acb_lower = acb.lower()
        for key in json_keys:
            if acb_lower == key or acb_lower.startswith(key):
                filtered.append(acb)
                matched_keys.append(key)
                break

    unmatched = [k for k in json_keys if k not in matched_keys]
    print(f"Filtering by {FILTER_BY_JSON}.json: {len(filtered)}/{len(acb_names)} ACB files match")
    if unmatched:
        print(f"\n[Unmatched {FILTER_BY_JSON} keys] {len(unmatched)} keys have no ACB file:")
        for key in unmatched[:20]:
            print(f"  - {key}")
        if len(unmatched) > 20:
            print(f"  ... and {len(unmatched) - 20} more")

    return filtered


def find_acb_file(char_id: str) -> Path | None:
    """Find ACB file for a character ID (case-insensitive, partial match fallback)."""
    if not ASSETS_DIR.exists():
        print(f"Error: Assets directory not found: {ASSETS_DIR}")
        return None

    exact = ASSETS_DIR / f"{char_id}.acb.bytes"
    if exact.exists():
        return exact

    for f in ASSETS_DIR.glob(f"{char_id}*.acb.bytes"):
        return f

    for f in ASSETS_DIR.glob("*.acb.bytes"):
        if char_id.lower() in f.stem.lower():
            return f

    return None


def fix_filenames(output_dir: Path, char_id: str):
    """Fix duplicate prefixes and double JP suffixes in extracted filenames."""
    char_upper = char_id.upper()
    for wav_file in output_dir.glob("*.wav"):
        new_name = wav_file.name
        # Remove duplicate character ID prefix (e.g. 79TYPE_79type_DIALOGUE1_JP -> 79TYPE_DIALOGUE1_JP)
        new_name = re.sub(rf'^{char_upper}_{re.escape(char_id)}_', f'{char_upper}_', new_name, flags=re.IGNORECASE)
        new_name = new_name.replace('_JP_JP.wav', '_JP.wav')
        if new_name != wav_file.name:
            new_path = output_dir / new_name
            if new_path.exists():
                new_path.unlink()
            wav_file.rename(new_path)


def convert_to_compressed(output_dir: Path):
    """Convert all WAV files in a directory to AUDIO_FORMAT using ffmpeg."""
    if AUDIO_FORMAT == 'wav':
        return
    for wav in output_dir.glob("*.wav"):
        out_file = wav.with_suffix(f'.{AUDIO_FORMAT}')
        cmd = ['ffmpeg', '-y', '-v', 'error', '-i', str(wav)]
        if AUDIO_FORMAT == 'mp3':
            cmd.extend(['-codec:a', 'libmp3lame', '-q:a', '2', str(out_file)])
        elif AUDIO_FORMAT == 'ogg':
            # Vorbis quality 4 (~128kbps)
            cmd.extend(['-codec:a', 'libvorbis', '-q:a', '4', str(out_file)])
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            wav.unlink()
        else:
            print(f"Error converting {wav.name}: {res.stderr}")


def extract_audio(char_id: str) -> dict:
    """Extract audio for a single character."""
    result = {
        'char_id': char_id,
        'status': 'pending',
        'acb_file': None,
        'output_dir': None,
        'files_created': 0,
        'error': None,
    }

    try:
        acb_file = find_acb_file(char_id)
        if not acb_file:
            result['status'] = 'skipped'
            result['error'] = f"No ACB file found for {char_id}"
            return result

        result['acb_file'] = str(acb_file)

        # vgmstream-cli doesn't recognise .acb.bytes; copy to .acb temporarily
        temp_acb = acb_file.parent / f"{acb_file.stem}.acb"
        if not temp_acb.exists():
            shutil.copy2(acb_file, temp_acb)

        output_dir = SOUNDS_DIR / char_id.upper()
        if output_dir.exists():
            shutil.rmtree(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        result['output_dir'] = str(output_dir)

        info_result = subprocess.run(
            [VGMSTREAM_CLI, "-I", str(temp_acb)],
            capture_output=True, text=True, timeout=30,
        )
        if info_result.returncode != 0:
            result['status'] = 'error'
            result['error'] = f"Failed to get info: {info_result.stderr}"
            return result

        try:
            info_data = json.loads(info_result.stdout)
            subsong_count = info_data.get('streamInfo', {}).get('total', 0)
        except Exception:
            result['status'] = 'error'
            result['error'] = "Could not parse vgmstream info"
            return result

        if subsong_count == 0:
            result['status'] = 'error'
            result['error'] = "No subsongs found in ACB"
            return result

        output_pattern = f"{output_dir}/{char_id.upper()}_?n_JP.wav"
        extract_result = subprocess.run(
            [VGMSTREAM_CLI, "-S", str(subsong_count), "-o", output_pattern, str(temp_acb)],
            capture_output=True, text=True, timeout=120,
        )
        if extract_result.returncode != 0:
            result['status'] = 'error'
            result['error'] = f"Extraction failed: {extract_result.stderr}"
            return result

        fix_filenames(output_dir, char_id)

        if AUDIO_FORMAT != 'wav':
            convert_to_compressed(output_dir)
            result['files_created'] = len(list(output_dir.glob(f"*.{AUDIO_FORMAT}")))
        else:
            result['files_created'] = len(list(output_dir.glob("*.wav")))

        result['status'] = 'success'

    except subprocess.TimeoutExpired:
        result['status'] = 'error'
        result['error'] = "Extraction timeout"
    except Exception as e:
        result['status'] = 'error'
        result['error'] = str(e)

    return result


def main():
    parser = argparse.ArgumentParser(
        description='Extract audio from GFL character ACB files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='Examples:\n  uv run scripts/extract_all_audio.py          # Extract all\n  uv run scripts/extract_all_audio.py M950A    # Extract single',
    )
    parser.add_argument('char_id', nargs='?', default=None, help='Character ID (omit to extract all)')
    args = parser.parse_args()

    print("Scanning for ACB files...")
    all_acb_chars = get_acb_files()
    if not all_acb_chars:
        print("Failed to find ACB files")
        return

    print(f"Found {len(all_acb_chars)} ACB files")

    if args.char_id:
        if not find_acb_file(args.char_id):
            print(f"Error: No ACB file found for {args.char_id}")
            return
        chars_to_extract = [args.char_id]
    else:
        chars_to_extract = all_acb_chars
        if EXTRACTION_LIMIT > 0:
            chars_to_extract = chars_to_extract[:EXTRACTION_LIMIT]
            print(f"Limited to first {EXTRACTION_LIMIT} ACB files")

    workers = cpu_count()
    print(f"Extracting {len(chars_to_extract)} characters with {min(workers, len(chars_to_extract))} workers...\n")

    results = []
    start_time = time.time()

    executor = ThreadPoolExecutor(max_workers=workers)
    try:
        futures = {executor.submit(extract_audio, cid): cid for cid in chars_to_extract}
        for i, future in enumerate(as_completed(futures), 1):
            char_id = futures[future]
            try:
                result = future.result()
                results.append(result)
                status_icon = {'success': '[OK]', 'skipped': '[-]', 'error': '[x]'}.get(result['status'], '[?]')
                if result['status'] == 'success':
                    print(f"[{i}/{len(chars_to_extract)}] {status_icon} {char_id}: {result['files_created']} files")
                else:
                    print(f"[{i}/{len(chars_to_extract)}] {status_icon} {char_id}: {result['error']}")
            except Exception as e:
                print(f"[{i}/{len(chars_to_extract)}] [!] {char_id}: Exception: {e}")
        executor.shutdown(wait=True)
    except KeyboardInterrupt:
        print("\n\nExtraction interrupted by user. Stopping...")
        executor.shutdown(wait=False, cancel_futures=True)
        os._exit(1)

    elapsed = time.time() - start_time
    successful = sum(1 for r in results if r['status'] == 'success')
    skipped = sum(1 for r in results if r['status'] == 'skipped')
    errors = sum(1 for r in results if r['status'] == 'error')

    print(f"\n{'='*60}")
    print(f"Extraction complete in {elapsed:.1f}s")
    print(f"Successful: {successful} | Skipped: {skipped} | Errors: {errors}")

    if errors > 0:
        print(f"\nErrors:")
        for r in results:
            if r['status'] == 'error':
                print(f"  {r['char_id']}: {r['error']}")


if __name__ == '__main__':
    main()
