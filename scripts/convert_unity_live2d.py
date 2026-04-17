#!/usr/bin/env python3
"""
Convert Unity Live2D assets to Cubism 3 model3.json format.
Extracts MOC3 binaries from .asset files and converts animations.
"""

import json
import math
import re
import sys
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from yamlium import parse as yamlium_parse

from paths import GUN_LIVE2D


def parse_anim_yaml(anim_path: str) -> Optional[Dict[str, Any]]:
    """Parse Unity .anim YAML, strip directives and tags, return AnimationClip data"""
    try:
        anim_file = Path(anim_path)
        file_size_mb = anim_file.stat().st_size / (1024 * 1024)
        relative_path = '/'.join(anim_file.parts[-4:-1])

        t0 = time.time()
        with open(anim_path, 'r', encoding='utf-8') as f:
            content = f.read()
        t_read = time.time() - t0

        t0 = time.time()
        # Strip YAML directives and Unity type tags to avoid parser errors
        cleaned = re.sub(r'^%.*\n', '', content, flags=re.MULTILINE)
        cleaned = re.sub(r'^--- !u!\d+\s+&\d+\n', '--- \n', cleaned, flags=re.MULTILINE)
        t_clean = time.time() - t0

        t0 = time.time()
        parsed = yamlium_parse(cleaned)
        data = parsed.to_dict() if hasattr(parsed, 'to_dict') else dict(parsed)
        t_parse = time.time() - t0

        print(f"{relative_path}/{anim_file.name} ({file_size_mb:.2f}MB): read={t_read*1000:.1f}ms clean={t_clean*1000:.1f}ms parse={t_parse*1000:.1f}ms")

        if not isinstance(data, dict):
            return None

        anim_clip = data.get('AnimationClip')
        if not anim_clip:
            for value in data.values():
                if isinstance(value, dict) and 'm_FloatCurves' in value:
                    anim_clip = value
                    break

        return {'AnimationClip': anim_clip} if anim_clip else None

    except Exception as e:
        print(f"[Warning] Error parsing {Path(anim_path).name}: {e}")
        return None


def extract_animation_curves(anim_clip: Dict) -> Dict[str, List[Dict]]:
    """Extract parameter curves from AnimationClip"""
    if not isinstance(anim_clip, dict):
        return {}

    float_curves = anim_clip.get('m_FloatCurves', [])
    if not isinstance(float_curves, list):
        return {}

    curves = {}
    for curve_entry in float_curves:
        if not isinstance(curve_entry, dict):
            continue

        param_path = curve_entry.get('path', '')
        param_id = param_path.split('/')[-1] if param_path else None
        if not param_id:
            continue

        curve_data = curve_entry.get('curve', {})
        keyframes_list = curve_data.get('m_Curve', []) if isinstance(curve_data, dict) else []
        if not keyframes_list:
            continue

        keyframes = []
        for kf in keyframes_list:
            if isinstance(kf, dict):
                try:
                    in_slope = float(kf.get('inSlope', 0))
                    out_slope = float(kf.get('outSlope', 0))
                    # Flag infinite tangents (stepped animations) for special handling
                    keyframes.append({
                        'time': float(kf.get('time', 0)),
                        'value': float(kf.get('value', 0)),
                        'inTangent': in_slope,
                        'outTangent': out_slope,
                        'isInfinity': math.isinf(in_slope) or math.isinf(out_slope)
                    })
                except (TypeError, ValueError):
                    continue

        if keyframes:
            curves[param_id] = keyframes

    return curves


def keyframes_to_segments(keyframes: List[Dict]) -> List[float]:
    """Convert keyframe data to Cubism motion3 segment format"""
    if not keyframes:
        return []

    sorted_keys = sorted(keyframes, key=lambda k: k['time'])

    segments = []
    segments.extend([sorted_keys[0]['time'], sorted_keys[0]['value']])

    for i in range(len(sorted_keys) - 1):
        k0 = sorted_keys[i]
        k1 = sorted_keys[i + 1]

        dt = k1['time'] - k0['time']
        if dt <= 0:
            continue

        has_infinity = k0.get('isInfinity', False) or k1.get('isInfinity', False)

        if has_infinity:
            # Type 2: stepped segment (instant jump, no interpolation)
            segments.extend([2, k1['time'], k1['value']])
        elif abs(k0['outTangent']) < 0.0001 and abs(k1['inTangent']) < 0.0001:
            # Type 0: linear segment
            segments.extend([0, k1['time'], k1['value']])
        else:
            # Type 1: cubic Bezier with tangent-derived control points
            p1_v = k0['value'] + k0['outTangent'] * (dt / 3.0)
            p2_v = k1['value'] - k1['inTangent'] * (dt / 3.0)
            segments.extend([
                1,
                k0['time'] + dt / 3.0, p1_v,
                k0['time'] + 2.0 * dt / 3.0, p2_v,
                k1['time'], k1['value']
            ])

    return segments


def convert_anim_to_motion3(anim_path: str) -> Optional[Dict]:
    """Convert .anim file to motion3.json format"""
    anim_data = parse_anim_yaml(anim_path)
    if not anim_data:
        return None

    anim_clip = anim_data['AnimationClip']

    fps = float(anim_clip.get('m_SampleRate', 30))
    settings = anim_clip.get('m_AnimationClipSettings', {})
    duration = float(settings.get('m_StopTime', 0)) if isinstance(settings, dict) else 0
    loop = bool(settings.get('m_Loop', True)) if isinstance(settings, dict) else True

    curves_dict = extract_animation_curves(anim_clip)
    if duration == 0 and curves_dict:
        duration = max(
            max((kf['time'] for kf in keyframes), default=0)
            for keyframes in curves_dict.values()
        )
    if duration == 0:
        duration = 1.0

    motion3_curves = []
    for param_id, keyframes in curves_dict.items():
        segments = keyframes_to_segments(keyframes)
        if segments:
            motion3_curves.append({
                "Target": "Parameter",
                "Id": param_id,
                "Segments": segments
            })

    return {
        "Version": 3,
        "Meta": {
            "Duration": duration,
            "Fps": fps,
            "Loop": loop,
            "AreBeziersRestricted": True,
            "CurveCount": len(motion3_curves),
            "TotalSegmentCount": sum(len(c["Segments"]) for c in motion3_curves),
            "TotalPointCount": sum(len(c["Segments"]) for c in motion3_curves)
        },
        "Curves": motion3_curves
    }


def extract_moc3_from_asset(asset_path: str) -> Optional[bytes]:
    """Extract binary MOC3 data from .asset file"""
    try:
        with Path(asset_path).open('r', encoding='utf-8') as f:
            for line in f:
                if '_bytes:' in line:
                    hex_str = line.split('_bytes:')[1].strip()
                    return bytes.fromhex(hex_str)
    except Exception as e:
        print(f"[Warning] Error extracting MOC3: {e}")
    return None


def parse_unity_yaml(file_path: str) -> List[Dict]:
    """Parse Unity YAML file, stripping Unity-specific tags and returning documents"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Strip Unity YAML directives and type tags to avoid parser errors
        cleaned = re.sub(r'^%.*\n', '', content, flags=re.MULTILINE)
        cleaned = re.sub(r'^--- !u!\d+\s+&\d+\n', '--- \n', cleaned, flags=re.MULTILINE)

        return list(yaml.safe_load_all(cleaned))
    except Exception as e:
        print(f"[Warning] Error parsing Unity YAML {file_path}: {e}")
        return []


def find_textures(variant_dir: str) -> List[str]:
    """Find all texture files in variant directory"""
    textures = []
    variant_path = Path(variant_dir)
    try:
        for tex_dir in variant_path.iterdir():
            if tex_dir.is_dir():
                for file in tex_dir.iterdir():
                    if file.suffix == '.png':
                        textures.append(f"{tex_dir.name}/{file.name}")
    except Exception:
        pass
    return textures


def extract_layout_from_prefab(prefab_path: str) -> Dict:
    """Extract scale and position from prefab using YAML parsing"""
    layout = {
        "CenterX": 0.0,
        "CenterY": 0.0,
        "Width": 1.0,
        "Height": 1.0
    }

    documents = parse_unity_yaml(prefab_path)
    if not documents:
        return layout

    try:
        # Find the root Transform component with the model's scale/position
        for doc in documents:
            if not isinstance(doc, dict):
                continue

            transform = doc.get('Transform')
            if transform and isinstance(transform, dict):
                local_scale = transform.get('m_LocalScale')
                if local_scale and isinstance(local_scale, dict) and 'Scale' not in layout:
                    scale_x = local_scale.get('x')
                    if scale_x is not None:
                        layout["Scale"] = float(scale_x)

                local_pos = transform.get('m_LocalPosition')
                if local_pos and isinstance(local_pos, dict):
                    pos_x = local_pos.get('x')
                    pos_y = local_pos.get('y')
                    if pos_x is not None and 'X' not in layout:
                        layout["X"] = float(pos_x)
                    if pos_y is not None and 'Y' not in layout:
                        layout["Y"] = float(pos_y)

                if 'Scale' in layout and 'X' in layout:
                    break

    except Exception as e:
        print(f"[Warning] Error extracting layout from {prefab_path}: {e}")

    return layout


def extract_hit_areas_from_prefab(prefab_path: str) -> List[Dict]:
    """Extract hit area definitions from prefab using YAML parsing"""
    hit_areas = []

    documents = parse_unity_yaml(prefab_path)
    if not documents:
        return hit_areas

    try:
        seen_hit_areas = set()
        for doc in documents:
            if not isinstance(doc, dict):
                continue

            game_object = doc.get('GameObject')
            if game_object and isinstance(game_object, dict):
                obj_name = game_object.get('m_Name', '')
                if obj_name and isinstance(obj_name, str) and obj_name.startswith('HitArea'):
                    suffix = obj_name[len('HitArea'):]
                    if suffix and suffix not in seen_hit_areas:
                        seen_hit_areas.add(suffix)
                        hit_areas.append({
                            "Id": obj_name,
                            "Name": suffix.lower()
                        })

    except Exception as e:
        print(f"[Warning] Error extracting hit areas from {prefab_path}: {e}")

    return hit_areas


def extract_parameters_from_prefab(prefab_path: str) -> Dict[str, List[str]]:
    """Extract parameter names from prefab's Parameters hierarchy using YAML parsing"""
    param_groups = {
        'LipSync': [],
        'EyeBlink': []
    }

    documents = parse_unity_yaml(prefab_path)
    if not documents:
        return param_groups

    try:
        parameter_names = []

        for doc in documents:
            if not isinstance(doc, dict):
                continue

            game_object = doc.get('GameObject')
            if game_object and isinstance(game_object, dict):
                obj_name = game_object.get('m_Name', '')
                if obj_name and isinstance(obj_name, str) and obj_name.startswith('Param'):
                    parameter_names.append(obj_name)

        for param_name in parameter_names:
            param_lower = param_name.lower()
            if any(x in param_lower for x in ['mouth', 'lip']):
                if any(x in param_lower for x in ['mouthopen', 'mouthform']):
                    param_groups['LipSync'].append(param_name)
            elif 'eye' in param_lower and 'open' in param_lower:
                param_groups['EyeBlink'].append(param_name)

        param_groups['LipSync'] = list(dict.fromkeys(param_groups['LipSync']))
        param_groups['EyeBlink'] = list(dict.fromkeys(param_groups['EyeBlink']))

    except Exception as e:
        print(f"[Warning] Error extracting parameters from {prefab_path}: {e}")

    return param_groups


def _convert_animation_worker(anim_path: str) -> tuple[str, int, bool, str]:
    """Convert single animation and return (filename, curve_count, success, timing_info)"""
    try:
        anim_file = Path(anim_path)
        file_size_mb = anim_file.stat().st_size / (1024 * 1024)
        relative_path = '/'.join(anim_file.parts[-4:-1])

        t0 = time.time()
        motion3_data = convert_anim_to_motion3(anim_path)
        t_total = time.time() - t0

        if motion3_data and motion3_data['Curves']:
            motion3_path = anim_file.parent / anim_file.name.replace('.anim', '.motion3.json')
            json_str = json.dumps(motion3_data, indent=2)
            json_str = json_str.replace('Infinity', 'null').replace('-Infinity', 'null')
            motion3_path.write_text(json_str, encoding='utf-8', newline='\n')
            timing = f"{relative_path}/{anim_file.name} ({file_size_mb:.2f}MB, {t_total*1000:.1f}ms)"
            return (anim_file.name, len(motion3_data['Curves']), True, timing)
        return (anim_file.name, 0, False, "")
    except Exception:
        return (Path(anim_path).name, 0, False, "")


def convert_animations(variant_dir: str, parallel: bool = True) -> None:
    """Convert all .anim files in motions directory"""
    motions_dir = Path(variant_dir) / 'motions'
    if not motions_dir.is_dir():
        return

    anim_paths = list(motions_dir.glob('*.anim'))
    if not anim_paths:
        return

    if parallel:
        try:
            with ProcessPoolExecutor(max_workers=cpu_count()) as executor:
                futures = {executor.submit(_convert_animation_worker, str(path)): path for path in anim_paths}
                for future in as_completed(futures):
                    try:
                        filename, curve_count, success, timing = future.result(timeout=30)
                        if success:
                            print(f"{timing} -> {curve_count} curves")
                    except Exception as e:
                        print(f"[Warning] {e}")
        except KeyboardInterrupt:
            print("Animation conversion interrupted by user")
            raise
    else:
        for anim_path in anim_paths:
            try:
                filename, curve_count, success, timing = _convert_animation_worker(str(anim_path))
                if success:
                    print(f"{timing} -> {curve_count} curves")
            except Exception as e:
                print(f"[Warning] {e}")


def distribute_tap_animations(tap_files: List[Path], hit_area_names: List[str]) -> Dict[str, List[str]]:
    """Distribute tap animations across hitbox groups matching actual hit areas with exact naming"""
    if not tap_files:
        return {}

    tap_files_sorted = sorted(tap_files, key=lambda f: f.name)
    result = {}

    if hit_area_names:
        tap_group_names = [f"Tap{name[0].upper()}{name[1:]}" if name else "Tap" for name in hit_area_names]

        if len(tap_files_sorted) <= len(tap_group_names):
            for i, tap_file in enumerate(tap_files_sorted):
                group_name = tap_group_names[i] if i < len(tap_group_names) else f"Tap{i}"
                result[group_name] = [tap_file.name]
                print(f"Mapped {tap_file.name} to motion group {group_name}")
        else:
            # Distribute excess animations evenly; remainder assigned to first groups
            per_group = len(tap_files_sorted) // len(tap_group_names)
            remainder = len(tap_files_sorted) % len(tap_group_names)

            start_idx = 0
            for i, group_name in enumerate(tap_group_names):
                count = per_group + (1 if i < remainder else 0)
                anim_files = [tap_files_sorted[j].name for j in range(start_idx, start_idx + count)]
                result[group_name] = anim_files
                print(f"Mapped {count} animations to motion group {group_name}: {anim_files}")
                start_idx += count
    else:
        if len(tap_files_sorted) == 1:
            result['Tap'] = [tap_files_sorted[0].name]
        else:
            for i, tap_file in enumerate(tap_files_sorted):
                result[f'Tap{i}'] = [tap_file.name]

    return result


def find_motions(variant_dir: str, hit_area_names: List[str] = None, parallel: bool = True) -> Dict[str, Any]:
    """Find motion3.json files and categorize by animation type, with smart tap distribution based on hit areas"""
    motions: Dict[str, Any] = {}
    motions_path = Path(variant_dir) / 'motions'
    if not motions_path.is_dir():
        return motions

    convert_animations(variant_dir, parallel)

    tap_files = []

    try:
        for file in motions_path.glob('*.motion3.json'):
            name = file.stem.lower()

            if any(x in name for x in ['idle', 'daiji', 'stand']):
                key = 'Idle'
            elif any(x in name for x in ['touch', 'tap']):
                tap_files.append(file)
                continue
            elif 'wait' in name:
                key = 'Wait'
            elif any(x in name for x in ['shake', 'sway']):
                key = 'Shake'
            elif any(x in name for x in ['wedding', 'special']):
                key = 'Special'
            else:
                key = name.replace('.motion3', '').replace('_', '').capitalize()

            motion_entry = {"File": f"motions/{file.name}"}
            motions.setdefault(key, []).append(motion_entry)

        if tap_files:
            tap_distribution = distribute_tap_animations(tap_files, hit_area_names or [])
            for tap_group, tap_file_names in tap_distribution.items():
                entries = [{"File": f"motions/{name}"} for name in tap_file_names]
                motions[tap_group] = entries
                print(f"Categorized {len(entries)} animations as {tap_group}")

    except Exception as e:
        print(f"[Warning] Error scanning motions: {e}")

    return motions


def create_model_json(model_name: str, moc_file: str, variant_dir: str, parallel: bool = True) -> Dict:
    """Create model3.json for pixi-live2d-display"""
    textures = find_textures(variant_dir)

    layout = {}
    hit_areas = []
    param_groups_data = {}
    prefab_files = list(Path(variant_dir).glob('*.prefab'))
    if prefab_files:
        prefab_path = str(prefab_files[0])
        layout = extract_layout_from_prefab(prefab_path)
        hit_areas = extract_hit_areas_from_prefab(prefab_path)
        param_groups_data = extract_parameters_from_prefab(prefab_path)

    hit_area_names = [area['Name'] for area in hit_areas]
    motions = find_motions(variant_dir, hit_area_names, parallel)

    groups = []
    if param_groups_data.get('LipSync'):
        groups.append({"Target": "Parameter", "Name": "LipSync", "Ids": param_groups_data['LipSync']})
    if param_groups_data.get('EyeBlink'):
        groups.append({"Target": "Parameter", "Name": "EyeBlink", "Ids": param_groups_data['EyeBlink']})

    return {
        "Version": 3,
        "FileReferences": {
            "Moc": moc_file,
            "Textures": textures,
            "Motions": motions,
            "Layout": layout
        },
        "Groups": groups,
        "HitAreas": hit_areas
    }


def convert_variant(model_dir: str, variant: str, model_name: str, parallel: bool = True) -> bool:
    """Convert a single model variant"""
    variant_path = Path(model_dir) / variant
    if not variant_path.is_dir():
        return False

    moc_assets = list(variant_path.glob('*_moc.asset'))
    if not moc_assets:
        return False

    moc_data = extract_moc3_from_asset(str(moc_assets[0]))
    if not moc_data:
        return False

    moc_filename = f"{model_name}.moc3"
    (variant_path / moc_filename).write_bytes(moc_data)

    model_json = create_model_json(model_name, moc_filename, str(variant_path), parallel)
    (variant_path / f"{model_name}.model3.json").write_text(json.dumps(model_json, indent=2), encoding='utf-8', newline='\n')

    print(f"[OK] {model_name}/{variant}")
    return True


def _convert_variant_worker(args: tuple[str, str, str, int, int]) -> tuple[str, bool]:
    """Worker for parallel variant conversion, returns (model/variant, success)"""
    model_dir, variant, model_name, i, total = args
    print(f"[{i}/{total}] {model_name}/{variant}...")
    success = convert_variant(model_dir, variant, model_name, parallel=False)
    return (f"{model_name}/{variant}", success)


def convert_all_models(guns_dir: str) -> None:
    """Convert all gun models in directory using parallel processing"""
    guns_path = Path(guns_dir)
    if not guns_path.is_dir():
        print(f"[Error] Directory not found: {guns_dir}")
        return

    print(f"Converting Live2D models from {guns_dir}")

    try:
        model_dirs = sorted([d.name for d in guns_path.iterdir() if d.is_dir()])
    except Exception as e:
        print(f"[Error] Error listing directory: {e}")
        return

    variant_tasks = []
    for model_name in model_dirs:
        model_path = guns_path / model_name
        try:
            variants = sorted([d.name for d in model_path.iterdir() if d.is_dir()])
        except Exception:
            variants = []
        for variant in variants:
            variant_tasks.append((str(model_path), variant, model_name, None, None))

    total_variants = len(variant_tasks)
    for idx, task in enumerate(variant_tasks, 1):
        model_dir, variant, model_name, _, _ = task
        variant_tasks[idx - 1] = (model_dir, variant, model_name, idx, total_variants)

    success = fail = 0
    failed_conversions = []

    try:
        # Process pool size matches CPU cores for optimal throughput
        with ProcessPoolExecutor(max_workers=cpu_count()) as executor:
            futures = {executor.submit(_convert_variant_worker, task): task for task in variant_tasks}
            for future in as_completed(futures):
                try:
                    model_variant, success_flag = future.result(timeout=60)
                    if success_flag:
                        success += 1
                    else:
                        fail += 1
                        failed_conversions.append(model_variant)
                except Exception as e:
                    fail += 1
                    print(f"[Warning] {e}")
    except KeyboardInterrupt:
        print("Model conversion interrupted by user")
        raise

    print(f"Complete: {success} succeeded, {fail} failed")
    if failed_conversions:
        print(f"[Warning] Failed conversions: {', '.join(failed_conversions)}")


def diagnose_model(model_path: str) -> None:
    """Diagnose positioning issues in a model"""
    path = Path(model_path).resolve()
    if not path.is_dir():
        print(f"[Error] Path not found: {path}")
        return

    print(f"=== Diagnosing {path.name} ===")

    subdirs = [d for d in path.iterdir() if d.is_dir()]
    for variant_dir in sorted(subdirs):
        variant = variant_dir.name
        prefab_path = variant_dir / 'model.prefab'
        if not prefab_path.exists():
            print(f"[Warning] No prefab found for {variant}")
            continue

        print(f"\n--- {variant} ---")
        try:
            documents = parse_unity_yaml(str(prefab_path))
            if not documents:
                print(f"[Warning] Failed to parse prefab for {variant}")
                continue

            transforms = []
            for doc in documents:
                if not isinstance(doc, dict):
                    continue
                transform = doc.get('Transform')
                if transform and isinstance(transform, dict):
                    local_pos = transform.get('m_LocalPosition', {})
                    local_scale = transform.get('m_LocalScale', {})
                    if local_pos or local_scale:
                        transforms.append({'position': local_pos, 'scale': local_scale})

            if transforms:
                print("Root Transform:")
                root = transforms[0]
                if root['position']:
                    print(f"  Position: x={root['position'].get('x', 0)}, y={root['position'].get('y', 0)}, z={root['position'].get('z', 0)}")
                if root['scale']:
                    print(f"  Scale: x={root['scale'].get('x', 1)}, y={root['scale'].get('y', 1)}, z={root['scale'].get('z', 1)}")

            print(f"Total Transforms: {len(transforms)}")

            non_zero_positions = [
                (i, t['position'])
                for i, t in enumerate(transforms[1:11], 1)
                if t['position'] and any(t['position'].get(ax, 0) != 0 for ax in ('x', 'y', 'z'))
            ]
            if non_zero_positions:
                print("[Warning] Found non-zero offsets in transforms:")
                for i, pos in non_zero_positions:
                    print(f"  [{i}] x={pos.get('x', 0)}, y={pos.get('y', 0)}, z={pos.get('z', 0)}")

        except Exception as e:
            print(f"[Error] Error reading prefab: {e}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--diagnose':
        if len(sys.argv) > 2:
            diagnose_model(sys.argv[2])
        else:
            print("[Error] --diagnose requires a model path argument")
        return

    path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else GUN_LIVE2D.resolve()

    if not path.is_dir():
        print(f"[Error] Path not found: {path}")
        return

    # Detect whether path is a single model or a collection by checking if
    # subdirectories contain asset files (variants) vs further directories (models)
    subdirs = [d for d in path.iterdir() if d.is_dir()]
    has_asset_files = any(f.name.endswith('_moc.asset') for d in subdirs for f in d.iterdir() if f.is_file())

    if has_asset_files:
        model_name = path.name
        print(f"Converting: {model_name}")
        success = fail = 0
        for variant_dir in sorted(subdirs):
            if convert_variant(str(path), variant_dir.name, model_name):
                success += 1
            else:
                fail += 1
        if success > 0 or fail > 0:
            print(f"Complete: {success} succeeded, {fail} failed")
    else:
        convert_all_models(str(path))


if __name__ == '__main__':
    main()
