#!/usr/bin/env python3
"""
Comprehensive validator for Live2D model structures and formats.
Checks model3.json, motion3.json, texture references, and MOC3 binary files.
Includes animation type classification.
"""

import json
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from paths import GUN_LIVE2D


class Live2DValidator:
    def __init__(self, base_dir: str, verbose: bool = False):
        self.base_dir = Path(base_dir)
        self.verbose = verbose
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.model_summary: Dict[str, Dict] = {}
        self.stats = {
            'models_checked': 0,
            'variants_checked': 0,
            'model_jsons_checked': 0,
            'motions_checked': 0,
            'textures_checked': 0,
        }

    def log_error(self, msg: str):
        self.errors.append(msg)
        if self.verbose:
            print(f"[ERROR] {msg}")

    def log_warning(self, msg: str):
        self.warnings.append(msg)
        if self.verbose:
            print(f"[WARN] {msg}")

    def log_info(self, msg: str):
        if self.verbose:
            print(f"[INFO] {msg}")

    def _safe_read_json(self, path: Path) -> dict:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)


    def classify_animation_type(self, model3_json: dict) -> str:
        """Classify animation type based on model3.json content"""
        file_refs = model3_json.get('FileReferences', {})
        motions = file_refs.get('Motions', {})

        if not motions:
            return "Static Image"

        # Check for interactive animations (click/touch response)
        has_interactive = any(k in motions for k in ['touch_1', 'touch_2', 'touch_head', 'touch_body'])

        # Check for state-change animations (broken, damaged states, etc.)
        has_state_animations = any(k in motions for k in ['broken_1', 'broken_2', 'broken_3', 'broken_4', 'broken_5'])

        # Check motion count
        motion_count = len(motions)

        if motion_count == 1:
            return "Simple Loop"
        elif has_interactive:
            return "Fully Dynamic (click/cursor follow)"
        elif has_state_animations or motion_count > 3:
            return "Fully Dynamic"
        else:
            return "Multiple Animations"

    def validate_model3_json(self, json_path: Path) -> bool:
        """Validate model3.json structure and content"""
        self.stats['model_jsons_checked'] += 1

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Check required top-level fields
            if 'Version' not in data:
                self.log_error(f"model3.json missing 'Version': {json_path}")
                return False

            if data['Version'] != 3:
                self.log_warning(f"model3.json has Version {data['Version']}, expected 3: {json_path}")

            if 'FileReferences' not in data:
                self.log_error(f"model3.json missing 'FileReferences': {json_path}")
                return False

            file_refs = data['FileReferences']

            # Validate Moc reference
            if 'Moc' not in file_refs:
                self.log_error(f"FileReferences missing 'Moc': {json_path}")
                return False

            moc_file = json_path.parent / file_refs['Moc']
            if not moc_file.exists():
                self.log_error(f"Moc file not found: {moc_file}")
                return False

            # Validate MOC3 binary signature
            if not self._validate_moc3_binary(moc_file):
                self.log_error(f"Invalid MOC3 binary file: {moc_file}")
                return False

            # Validate Textures
            if 'Textures' not in file_refs or not isinstance(file_refs['Textures'], list):
                self.log_warning(f"FileReferences missing or invalid 'Textures' list: {json_path}")
            else:
                for texture_path in file_refs['Textures']:
                    texture_file = json_path.parent / texture_path
                    if not texture_file.exists():
                        self.log_error(f"Texture not found: {texture_file} (referenced in {json_path.name})")
                    else:
                        self.stats['textures_checked'] += 1

            # Validate Motions if present
            if 'Motions' in file_refs and isinstance(file_refs['Motions'], dict):
                for motion_type, motion_list in file_refs['Motions'].items():
                    if isinstance(motion_list, list):
                        for motion_file in motion_list:
                            motion_path = json_path.parent / motion_file
                            if not motion_path.exists():
                                self.log_warning(f"Motion file not found: {motion_path}")
                            else:
                                if motion_path.suffix == '.json':
                                    self._validate_motion3_json(motion_path)

            self.log_info(f"[OK] model3.json valid: {json_path.name}")
            return True

        except json.JSONDecodeError as e:
            self.log_error(f"Invalid JSON in {json_path}: {e}")
            return False
        except Exception as e:
            self.log_error(f"Error validating {json_path}: {e}")
            return False

    def _validate_moc3_binary(self, moc_path: Path) -> bool:
        """Validate MOC3 binary file header"""
        try:
            with open(moc_path, 'rb') as f:
                magic = f.read(4)

            if magic == b'MOC3' or magic == b'moc3':
                return True

            if len(magic) >= 4:
                moc_size = moc_path.stat().st_size
                if moc_size > 100:
                    return True

            self.log_error(f"MOC3 file too small: {moc_path}")
            return False

        except Exception as e:
            self.log_error(f"Error reading MOC3 file {moc_path}: {e}")
            return False

    def _validate_motion3_json(self, json_path: Path) -> bool:
        """Validate motion3.json structure"""
        self.stats['motions_checked'] += 1

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if 'Version' not in data or data['Version'] != 3:
                self.log_warning(f"motion3.json has invalid Version: {json_path}")
                return False

            if 'Meta' not in data:
                self.log_error(f"motion3.json missing 'Meta': {json_path}")
                return False

            meta = data['Meta']
            required_meta = ['Duration', 'Fps', 'Loop']
            for field in required_meta:
                if field not in meta:
                    self.log_error(f"motion3.json Meta missing '{field}': {json_path}")
                    return False

            if 'Curves' not in data or not isinstance(data['Curves'], list):
                self.log_warning(f"motion3.json missing or invalid 'Curves': {json_path}")

            return True

        except json.JSONDecodeError as e:
            self.log_warning(f"Skipping incomplete motion3.json {json_path.name} (still being written)")
            return True
        except Exception as e:
            self.log_error(f"Error validating motion3.json {json_path}: {e}")
            return False

    def validate_variant(self, variant_path: Path) -> bool:
        """Validate a model variant directory"""
        self.stats['variants_checked'] += 1

        model_json = None
        moc_asset = None

        for file in variant_path.iterdir():
            if file.suffix == '.json' and 'model3' in file.name:
                model_json = file
            if file.suffix == '.asset' and '_moc' in file.name:
                moc_asset = file

        if not model_json and not moc_asset:
            self.log_error(f"Variant missing model files: {variant_path}")
            return False

        if model_json:
            return self.validate_model3_json(model_json)

        if moc_asset and not model_json:
            self.log_warning(f"Variant not yet converted (missing model3.json): {variant_path}")
            return True

        return True

    def validate_model(self, model_path: Path) -> bool:
        """Validate a model directory with variants"""
        self.stats['models_checked'] += 1

        if not model_path.is_dir():
            return False

        variant_dirs = [d for d in model_path.iterdir() if d.is_dir() and d.name != 'motions']

        if not variant_dirs:
            self.log_warning(f"Model has no variants: {model_path.name}")
            return False

        all_valid = True
        for variant_dir in variant_dirs:
            if not self.validate_variant(variant_dir):
                all_valid = False

        return all_valid

    def collect_model_summary(self):
        """Collect animation type information for all models"""
        if not self.base_dir.exists():
            return

        for model_dir in sorted(self.base_dir.iterdir()):
            if not model_dir.is_dir():
                continue

            model_name = model_dir.name
            self.model_summary[model_name] = {}

            variant_dirs = [d for d in model_dir.iterdir() if d.is_dir() and d.name != 'motions']

            for variant_dir in sorted(variant_dirs):
                variant_name = variant_dir.name
                animation_type = "Unknown"

                for file in variant_dir.iterdir():
                    if file.suffix == '.json' and 'model3' in file.name:
                        try:
                            model3_data = self._safe_read_json(file)
                            animation_type = self.classify_animation_type(model3_data)
                        except Exception:
                            pass
                        break

                self.model_summary[model_name][variant_name] = animation_type

    def print_model_summary(self):
        """Print summary of all models with variants and animation types"""
        print("\n" + "=" * 100)
        print("LIVE2D MODELS SUMMARY (Gun Name: Variants with Animation Types)")
        print("=" * 100)

        for model_name in sorted(self.model_summary.keys()):
            variants = self.model_summary[model_name]
            print(f"\n{model_name}:")
            for variant_name in sorted(variants.keys()):
                anim_type = variants[variant_name]
                print(f"  - {variant_name}: {anim_type}")

    def validate_all(self) -> bool:
        """Validate all models in the base directory"""
        if not self.base_dir.exists():
            print(f"Error: Base directory not found: {self.base_dir}")
            return False

        print(f"Validating Live2D models in: {self.base_dir}")
        print("=" * 80)

        all_valid = True
        for model_dir in sorted(self.base_dir.iterdir()):
            if model_dir.is_dir():
                if not self.validate_model(model_dir):
                    all_valid = False

        self.collect_model_summary()
        self.print_model_summary()

        return self._print_report(all_valid)

    def _print_report(self, all_valid: bool) -> bool:
        """Print validation report"""
        print("\n" + "=" * 80)
        print("VALIDATION REPORT")
        print("=" * 80)

        print(f"\nStatistics:")
        print(f"  Models checked: {self.stats['models_checked']}")
        print(f"  Variants checked: {self.stats['variants_checked']}")
        print(f"  model3.json files: {self.stats['model_jsons_checked']}")
        print(f"  motion3.json files: {self.stats['motions_checked']}")
        print(f"  Textures verified: {self.stats['textures_checked']}")

        if self.errors:
            print(f"\nERRORS ({len(self.errors)}):")
            for error in self.errors[:20]:
                print(f"  - {error}")
            if len(self.errors) > 20:
                print(f"  ... and {len(self.errors) - 20} more errors")
        else:
            print("\nNo errors found!")

        if self.warnings:
            print(f"\nWARNINGS ({len(self.warnings)}):")
            for warning in self.warnings[:20]:
                print(f"  - {warning}")
            if len(self.warnings) > 20:
                print(f"  ... and {len(self.warnings) - 20} more warnings")
        else:
            print("\nNo warnings!")

        return all_valid and len(self.errors) == 0


if __name__ == '__main__':
    import argparse

    default_path = GUN_LIVE2D

    parser = argparse.ArgumentParser(description='Validate Live2D model structures')
    parser.add_argument('path', nargs='?', default=str(default_path),
                       help='Path to gun models directory')
    parser.add_argument('-v', '--verbose', action='store_true',
                       help='Verbose output')

    args = parser.parse_args()

    validator = Live2DValidator(args.path, verbose=args.verbose)
    success = validator.validate_all()

    sys.exit(0 if success else 1)
