#!/usr/bin/env python3
"""
Deep analysis of Live2D gun model formats.
Identifies conversion status, missing files, and format variations.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List
from collections import defaultdict

from paths import GUN_LIVE2D

# UTF-8 output needed on Windows for model names with non-ASCII characters
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')


def analyze_model_structure(model_dir: Path) -> Dict[str, Any]:
    """Analyze a complete model's structure"""
    analysis = {
        'model_name': model_dir.name,
        'variants': {},
        'summary': {
            'total_variants': 0,
            'converted_variants': 0,
            'unconverted_variants': 0,
            'texture_resolutions': set(),
            'motion_types': set(),
        }
    }

    for variant_dir in sorted(model_dir.iterdir()):
        if not variant_dir.is_dir() or variant_dir.name == 'motions':
            continue

        variant_analysis = analyze_variant(variant_dir)
        analysis['variants'][variant_dir.name] = variant_analysis

        # Update summary
        analysis['summary']['total_variants'] += 1
        if variant_analysis['is_converted']:
            analysis['summary']['converted_variants'] += 1
        else:
            analysis['summary']['unconverted_variants'] += 1

        # Collect texture resolutions
        for res in variant_analysis['texture_resolutions']:
            analysis['summary']['texture_resolutions'].add(res)

        # Collect motion types
        for motion_type in variant_analysis['motion_types']:
            analysis['summary']['motion_types'].add(motion_type)

    analysis['summary']['texture_resolutions'] = sorted(list(analysis['summary']['texture_resolutions']))
    analysis['summary']['motion_types'] = sorted(list(analysis['summary']['motion_types']))

    return analysis


def analyze_variant(variant_dir: Path) -> Dict[str, Any]:
    """Analyze a single variant's file structure and conversion status"""
    analysis = {
        'variant_name': variant_dir.name,
        'files': defaultdict(list),
        'is_converted': False,
        'conversion_status': None,
        'texture_resolutions': [],
        'texture_formats': set(),
        'motion_types': [],
        'missing_conversions': [],
        'size_bytes': 0,
    }

    files = list(variant_dir.iterdir())

    # Categorize files
    model3_json = None
    moc_asset = None
    prefab = None
    textures_by_resolution = defaultdict(list)
    motions = []
    other = []

    for file in files:
        if file.is_dir():
            # Handle texture directories (e.g., model.2048, model.1024)
            if file.name.startswith('model.'):
                resolution = file.name.replace('model.', '')
                analysis['texture_resolutions'].append(resolution)

                # Count PNG files in this resolution
                png_files = list(file.glob('*.png'))
                textures_by_resolution[resolution] = len(png_files)
                for png in png_files:
                    analysis['texture_formats'].add(png.suffix)
                    analysis['size_bytes'] += png.stat().st_size

        elif file.suffix == '.json':
            if 'model3' in file.name:
                model3_json = file
                analysis['files']['model3_json'].append(file.name)
                # Parse model3.json to get motion types
                try:
                    with open(file, 'r') as f:
                        model3_data = json.load(f)
                        if 'FileReferences' in model3_data and 'Motions' in model3_data['FileReferences']:
                            motions_dict = model3_data['FileReferences']['Motions']
                            if isinstance(motions_dict, dict):
                                analysis['motion_types'] = list(motions_dict.keys())
                except Exception as e:
                    analysis['missing_conversions'].append(f"Error parsing {file.name}: {e}")
            else:
                analysis['files']['other_json'].append(file.name)
        elif file.suffix == '.asset':
            if '_moc' in file.name:
                moc_asset = file
                analysis['files']['moc_asset'].append(file.name)
                analysis['size_bytes'] += file.stat().st_size
            else:
                analysis['files']['other_asset'].append(file.name)
        elif file.suffix == '.moc3':
            analysis['files']['moc3_binary'].append(file.name)
            analysis['size_bytes'] += file.stat().st_size
        elif file.suffix == '.prefab':
            prefab = file
            analysis['files']['prefab'].append(file.name)
            analysis['size_bytes'] += file.stat().st_size
        elif file.suffix == '.anim':
            analysis['files']['anim_files'].append(file.name)
        else:
            other.append(file.name)

    # Determine conversion status
    if model3_json:
        analysis['is_converted'] = True
        analysis['conversion_status'] = 'CONVERTED'

        # Check if MOC3 binary exists
        if not any(f.endswith('.moc3') for f in analysis['files']['moc3_binary']):
            analysis['conversion_status'] = 'CONVERTED (missing MOC3 binary)'
            analysis['missing_conversions'].append('MOC3 binary file missing')
    else:
        analysis['is_converted'] = False
        analysis['conversion_status'] = 'UNCONVERTED'

        # Check what conversion steps are needed
        if moc_asset:
            analysis['missing_conversions'].append('Has _moc.asset (need MOC3 extraction)')
        if prefab:
            analysis['missing_conversions'].append('Has .prefab (need model3.json generation)')

    analysis['texture_formats'] = sorted(list(analysis['texture_formats']))
    analysis['size_bytes'] += sum(f.stat().st_size for f in files if f.is_file())

    return analysis


def check_motion_coverage(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Check animation motion file coverage per variant"""
    coverage = {
        'model_name': analysis['model_name'],
        'variants': {},
    }

    for variant_name, variant_data in analysis['variants'].items():
        variant_coverage = {
            'is_converted': variant_data['is_converted'],
            'status': variant_data['conversion_status'],
            'motion_types': variant_data['motion_types'],
            'has_motions_folder': False,
            'motion_files': [],
            'orphaned_anim_files': [],
        }

        # Check for motions folder
        variant_dir = Path(variant_data['variant_name']).parent / variant_name if 'variant_name' in variant_data else None

        coverage['variants'][variant_name] = variant_coverage

    return coverage


def generate_format_report(gun_models_dir: Path) -> None:
    """Generate comprehensive format analysis report"""
    print("\n" + "=" * 100)
    print("LIVE2D GUN MODELS FORMAT ANALYSIS REPORT")
    print("=" * 100)

    models_analysis = []
    total_stats = {
        'total_models': 0,
        'total_variants': 0,
        'converted_variants': 0,
        'unconverted_variants': 0,
        'texture_resolutions': defaultdict(int),
        'total_size_mb': 0,
        'models_by_conversion_status': defaultdict(list),
    }

    for model_dir in sorted(gun_models_dir.iterdir()):
        if not model_dir.is_dir():
            continue

        analysis = analyze_model_structure(model_dir)
        models_analysis.append(analysis)

        # Update totals
        total_stats['total_models'] += 1
        summary = analysis['summary']
        total_stats['total_variants'] += summary['total_variants']
        total_stats['converted_variants'] += summary['converted_variants']
        total_stats['unconverted_variants'] += summary['unconverted_variants']
        total_stats['total_size_mb'] += sum(
            v.get('size_bytes', 0) for v in analysis['variants'].values()
        ) / (1024 * 1024)

        for res in summary['texture_resolutions']:
            total_stats['texture_resolutions'][res] += 1

        # Categorize by conversion status
        if summary['unconverted_variants'] > 0:
            total_stats['models_by_conversion_status']['PARTIAL'].append(model_dir.name)
        elif summary['converted_variants'] == summary['total_variants']:
            total_stats['models_by_conversion_status']['FULL'].append(model_dir.name)

    # Print summary statistics
    print("\nSUMMARY STATISTICS")
    print(f"  Total models: {total_stats['total_models']}")
    print(f"  Total variants: {total_stats['total_variants']}")
    print(f"    - Converted: {total_stats['converted_variants']}")
    print(f"    - Unconverted: {total_stats['unconverted_variants']}")
    print(f"  Total size: {total_stats['total_size_mb']:.2f} MB")

    print("\nTEXTURE RESOLUTIONS USED")
    for res, count in sorted(total_stats['texture_resolutions'].items()):
        print(f"  {res}px: {count} models")

    print("\nCONVERSION STATUS")
    for status in ['FULL', 'PARTIAL']:
        models = total_stats['models_by_conversion_status'].get(status, [])
        if models:
            print(f"  {status} conversion: {len(models)} models")
            if status == 'PARTIAL' and len(models) <= 10:
                for model in models:
                    print(f"    - {model}")

    # Detailed variant analysis for first 5 models
    print("\n" + "=" * 100)
    print("DETAILED ANALYSIS (First 5 Models)")
    print("=" * 100)

    for i, analysis in enumerate(models_analysis[:5]):
        print(f"\n{analysis['model_name']}")
        print(f"   Variants: {analysis['summary']['total_variants']} "
              f"(converted {analysis['summary']['converted_variants']}, "
              f"unconverted {analysis['summary']['unconverted_variants']})")

        for variant_name, variant_data in analysis['variants'].items():
            status_icon = "[OK]" if variant_data['is_converted'] else "[XX]"
            print(f"   {status_icon} {variant_name}: {variant_data['conversion_status']}")

            # Show texture resolutions
            if variant_data['texture_resolutions']:
                res_str = ", ".join(variant_data['texture_resolutions'])
                print(f"       Textures: {res_str}")

            # Show motion types
            if variant_data['motion_types']:
                motions_str = ", ".join(variant_data['motion_types'])
                print(f"       Motions: {motions_str}")

            # Show issues
            if variant_data['missing_conversions']:
                print(f"       Issues:")
                for issue in variant_data['missing_conversions']:
                    print(f"         - {issue}")

    print("\n" + "=" * 100)


if __name__ == '__main__':
    import argparse

    default_path = GUN_LIVE2D

    parser = argparse.ArgumentParser(description='Analyze Live2D model formats')
    parser.add_argument('path', nargs='?', default=str(default_path),
                       help='Path to gun models directory')

    args = parser.parse_args()

    gun_models_dir = Path(args.path)
    if not gun_models_dir.exists():
        print(f"Error: Directory not found: {gun_models_dir}")
        exit(1)

    generate_format_report(gun_models_dir)
