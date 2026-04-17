#!/usr/bin/env python3
"""
Verification script to check extraction completeness from Unity prefabs.
Identifies what data exists in Unity assets vs what we extract to model3.json.
"""

import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Set

from paths import GUN_LIVE2D

# Known Live2D Cubism Unity SDK script GUIDs
KNOWN_SCRIPT_GUIDS = {
    '7c00800aeb4472810a5b5fa56c0f90ab': 'CubismModel',
    'fac830b28b5ff3ef207a1a8bbe990da6': 'CubismRenderController',
    '3ae1aa4b2ad8f83ba984f2d55eca4aba': 'CubismMouthController',
    '1628dd00e51c62db6c51cd623c04d138': 'CubismEyeBlinkController',
    '45232841fd7e338827ea8562486ebf19': 'CubismAutoEyeBlinkInput',
    '8b76b7db00c210132ccdd54b4b1fd418': 'CubismPoseController',
    '95b377f126bdabe8e887589afbd60742': 'CubismPhysicsController',
    '6ec702c83c90dcb00d82b7bb17ca205d': 'CubismFadeMotionController',
    '17bab5d04e832863afadb0f1ade6cd40': 'CubismExpressionController',
    'bf7a842694b708386775bb51009fb9b3': 'CubismLookController',
    '2575e4e61ed1f2bcda175b58efd39599': 'CubismLookParameter',
    'ff7c32cfcafba4ca17786589701359f8': 'CubismParameter',
    '2180e8078bb21223d623e15d74cc0e62': 'CubismRaycast',
    'e5325a4c46a265fd1ebff5fb8d5b9102': 'CubismDynamicDrawableItem',
    '788efea05e2b264e3f5ef794fbfa5863': 'CubismDrawable',
    'e0498f1e35760c634fed375e24d48033': 'CubismPart',
}

# Cubism 3 file types and what they contain
CUBISM_FILE_TYPES = {
    'physics3.json': 'Physical simulation (hair, cloth physics)',
    'pose3.json': 'Default pose configuration',
    'cdi3.json': 'Display info (canvas size, camera settings)',
    'userdata3.json': 'Custom metadata tags',
    'exp3.json': 'Facial expression presets',
    'motionsync3.json': 'Advanced motion synchronization',
}


def scan_prefab(prefab_path: Path) -> Dict:
    """Scan prefab file for component GUIDs and structure"""
    result = {
        'scripts': defaultdict(int),
        'parameters': [],
        'drawables': [],
        'parts': [],
        'has_physics': False,
        'has_expressions': False,
        'has_pose': False,
        'has_fade_motion': False,
    }

    try:
        content = prefab_path.read_text(encoding='utf-8')

        # Find all script GUIDs
        for match in re.finditer(r'm_Script:.*?guid:\s*([a-f0-9]+)', content):
            guid = match.group(1)
            result['scripts'][guid] += 1

        # Check for specific controller presences
        result['has_physics'] = '95b377f126bdabe8e887589afbd60742' in result['scripts']
        result['has_expressions'] = '17bab5d04e832863afadb0f1ade6cd40' in result['scripts']
        result['has_pose'] = '8b76b7db00c210132ccdd54b4b1fd418' in result['scripts']
        result['has_fade_motion'] = '6ec702c83c90dcb00d82b7bb17ca205d' in result['scripts']

        # Extract parameter names
        for match in re.finditer(r'm_Name:\s+(Param\w+)', content):
            param_name = match.group(1)
            if param_name not in result['parameters']:
                result['parameters'].append(param_name)

    except Exception as e:
        print(f"Error scanning {prefab_path}: {e}")

    return result


def scan_variant_directory(variant_dir: Path) -> Dict:
    """Scan variant directory for all asset files"""
    result = {
        'prefab': None,
        'moc_asset': None,
        'fade_assets': [],
        'fade_motion_list': None,
        'animations': [],
        'textures': [],
        'generated_files': {
            'moc3': None,
            'model3_json': None,
            'motion3_jsons': [],
        }
    }

    try:
        for file in variant_dir.iterdir():
            if file.is_file():
                if file.suffix == '.prefab':
                    result['prefab'] = file.name
                elif file.name.endswith('_moc.asset'):
                    result['moc_asset'] = file.name
                elif file.name.endswith('.fade.asset'):
                    result['fade_assets'].append(file.name)
                elif file.name.endswith('.fadeMotionList.asset'):
                    result['fade_motion_list'] = file.name
                elif file.suffix == '.moc3':
                    result['generated_files']['moc3'] = file.name
                elif file.name.endswith('.model3.json'):
                    result['generated_files']['model3_json'] = file.name

        # Scan motions directory
        motions_dir = variant_dir / 'motions'
        if motions_dir.is_dir():
            for file in motions_dir.iterdir():
                if file.suffix == '.anim':
                    result['animations'].append(file.name)
                elif file.name.endswith('.motion3.json'):
                    result['generated_files']['motion3_jsons'].append(file.name)

        # Scan texture directories
        for subdir in variant_dir.iterdir():
            if subdir.is_dir() and 'model.' in subdir.name:
                for file in subdir.iterdir():
                    if file.suffix == '.png':
                        result['textures'].append(f"{subdir.name}/{file.name}")

    except Exception as e:
        print(f"Error scanning directory {variant_dir}: {e}")

    return result


def analyze_model3_json(model3_path: Path) -> Dict:
    """Analyze generated model3.json for completeness"""
    result = {
        'has_groups': False,
        'has_hit_areas': False,
        'has_layout': False,
        'has_physics': False,
        'has_expressions': False,
        'has_pose': False,
        'group_types': [],
        'motion_groups': [],
        'missing_optional_fields': [],
    }

    try:
        data = json.loads(model3_path.read_text(encoding='utf-8'))

        # Check top-level optional fields
        result['has_groups'] = bool(data.get('Groups'))
        result['has_hit_areas'] = bool(data.get('HitAreas'))

        if result['has_groups']:
            result['group_types'] = [g['Name'] for g in data['Groups']]

        # Check FileReferences
        file_refs = data.get('FileReferences', {})
        result['has_layout'] = bool(file_refs.get('Layout'))
        result['has_physics'] = bool(file_refs.get('Physics'))
        result['has_expressions'] = bool(file_refs.get('Expressions'))
        result['has_pose'] = bool(file_refs.get('Pose'))

        motions = file_refs.get('Motions', {})
        result['motion_groups'] = list(motions.keys()) if motions else []

        # Identify missing optional Cubism 3 fields
        optional_file_refs = ['Physics', 'UserData', 'Pose', 'DisplayInfo', 'MotionSync', 'Expressions']
        for field in optional_file_refs:
            if field not in file_refs:
                result['missing_optional_fields'].append(field)

    except Exception as e:
        print(f"Error analyzing {model3_path}: {e}")

    return result


def generate_report(model_dir: Path):
    """Generate comprehensive extraction verification report"""
    print(f"\n{'='*80}")
    print(f"EXTRACTION VERIFICATION REPORT: {model_dir.name}")
    print(f"{'='*80}\n")

    variants = [d for d in model_dir.iterdir() if d.is_dir()]

    for variant_dir in sorted(variants):
        print(f"\n{'-'*80}")
        print(f"Variant: {variant_dir.name}")
        print(f"{'-'*80}")

        # Scan variant directory structure
        dir_scan = scan_variant_directory(variant_dir)

        # Scan prefab if exists
        prefab_data = {}
        if dir_scan['prefab']:
            prefab_path = variant_dir / dir_scan['prefab']
            prefab_data = scan_prefab(prefab_path)

        # Analyze generated model3.json if exists
        model3_data = {}
        if dir_scan['generated_files']['model3_json']:
            model3_path = variant_dir / dir_scan['generated_files']['model3_json']
            model3_data = analyze_model3_json(model3_path)

        # Report Unity Asset Files
        print("\n[Unity Asset Files]")
        print(f"  Prefab: {dir_scan['prefab']}")
        print(f"  MOC Asset: {dir_scan['moc_asset']}")
        print(f"  Fade Motion List: {dir_scan['fade_motion_list']}")
        print(f"  Individual Fade Assets: {len(dir_scan['fade_assets'])}")
        print(f"  Animations: {len(dir_scan['animations'])}")
        print(f"  Textures: {len(dir_scan['textures'])}")

        # Report Prefab Components
        if prefab_data:
            print("\n[Prefab Components]")
            print(f"  Parameters Found: {len(prefab_data['parameters'])}")
            if prefab_data['parameters'][:10]:
                print(f"    Sample: {', '.join(prefab_data['parameters'][:10])}")

            print("\n  MonoBehaviour Scripts:")
            for guid, count in prefab_data['scripts'].items():
                script_name = KNOWN_SCRIPT_GUIDS.get(guid, f"Unknown ({guid})")
                print(f"    {script_name}: {count} instances")

            print(f"\n  Physics Controller: {'YES' if prefab_data['has_physics'] else 'NO'}")
            print(f"  Expression Controller: {'YES' if prefab_data['has_expressions'] else 'NO'}")
            print(f"  Pose Controller: {'YES' if prefab_data['has_pose'] else 'NO'}")
            print(f"  Fade Motion Controller: {'YES' if prefab_data['has_fade_motion'] else 'NO'}")

        # Report Generated Files
        print("\n[Generated Cubism Files]")
        print(f"  MOC3: {dir_scan['generated_files']['moc3']}")
        print(f"  model3.json: {dir_scan['generated_files']['model3_json']}")
        print(f"  motion3.json files: {len(dir_scan['generated_files']['motion3_jsons'])}")

        # Report model3.json Completeness
        if model3_data:
            print("\n[model3.json Completeness]")
            print(f"  Groups: {'YES' if model3_data['has_groups'] else 'NO (hardcoded [])'}")
            if model3_data['group_types']:
                print(f"    Types: {', '.join(model3_data['group_types'])}")
            print(f"  HitAreas: {'YES' if model3_data['has_hit_areas'] else 'NO'}")
            print(f"  Layout: {'YES' if model3_data['has_layout'] else 'NO'}")
            print(f"  Motion Groups: {len(model3_data['motion_groups'])}")
            if model3_data['motion_groups']:
                print(f"    Names: {', '.join(model3_data['motion_groups'])}")

            print(f"\n  Optional FileReferences:")
            print(f"    Physics: {'YES' if model3_data['has_physics'] else 'NO'}")
            print(f"    Expressions: {'YES' if model3_data['has_expressions'] else 'NO'}")
            print(f"    Pose: {'YES' if model3_data['has_pose'] else 'NO'}")

            if model3_data['missing_optional_fields']:
                print(f"\n  Missing Optional Fields: {', '.join(model3_data['missing_optional_fields'])}")

        # Report extraction gaps
        print("\n[Extraction Status]")
        gaps = []

        if prefab_data.get('has_physics') and not model3_data.get('has_physics'):
            gaps.append("Physics data exists in Unity but not extracted")

        if prefab_data.get('has_expressions') and not model3_data.get('has_expressions'):
            gaps.append("Expression controller exists but not extracted")

        if prefab_data.get('has_pose') and not model3_data.get('has_pose'):
            gaps.append("Pose controller exists but not extracted")

        if prefab_data.get('has_fade_motion') and dir_scan['fade_assets']:
            gaps.append(f"Fade motion data ({len(dir_scan['fade_assets'])} files) not extracted")

        if gaps:
            print("  ⚠ GAPS DETECTED:")
            for gap in gaps:
                print(f"    - {gap}")
        else:
            print("  ✓ All available Unity data appears to be extracted")

    print(f"\n{'='*80}\n")


def main():
    import sys

    if len(sys.argv) > 1:
        model_path = Path(sys.argv[1])
    else:
        model_path = GUN_LIVE2D / "4type_5305"

    if not model_path.exists():
        print(f"Error: Path not found: {model_path}")
        return

    generate_report(model_path)


if __name__ == '__main__':
    main()
