#!/usr/bin/env python3
"""
Asset Synchronisation Script for Cloudflare R2

Collects all Live2D model assets and audio files from the filesystem,
validates them, and prepares them for upload to Cloudflare R2.

Generates output files:
    src/lib/data/variants.json       Model variant lookup table (shipped with code)
    static/assets/              Copy of all assets (--copy mode only)

Modes:
  --copy:   Copy all assets to tmp/ directory (for local testing)
  --upload: Upload to R2 bucket
  (default) Dry-run: Just print inventory

Usage:
    uv run scripts/sync-assets-r2.py [--copy] [--upload]

Environment Variables (from .env):
    R2_ACCOUNT_ID       Cloudflare R2 account ID
    R2_ACCESS_KEY       R2 API access key
    R2_SECRET           R2 API secret key
    R2_BUCKET           R2 bucket name (required)
    R2_ENDPOINT         R2 endpoint URL (auto-derived from account ID)
    ASSETS_CDN_URL      Public CDN URL for assets (e.g., https://cdn.example.com)
"""

import os
import sys
import json
import hashlib
import shutil
from pathlib import Path
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass, asdict
from collections import defaultdict

from paths import DATA_DIR, GUN_LIVE2D, ROOT, SOUNDS_DIR

try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    boto3 = None
    ClientError = None


def load_env_file(env_path: Path) -> None:
    """Load environment variables from .env file."""
    if not env_path.exists():
        return

    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())


@dataclass
class AssetFile:
    """Represents a single asset file with metadata."""
    path: str  # Relative path from project root
    size_bytes: int
    file_type: str  # 'model', 'motion', 'audio', 'texture'
    category: str  # 'live2d_models' or 'audio'
    model_id: str = ''  # For models: {model_code}_{variant}
    hash_md5: str = ''


class AssetCollector:
    """Collects and validates all deployable assets."""

    # File extensions/patterns to collect
    COLLECT_PATTERNS = {'.model3.json', '.motion3.json', '.moc3', '.png', '.ogg'}

    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.assets_root = project_root / 'Assets'  # kept for relative_to() calls below
        self.files: List[AssetFile] = []
        self.stats = {
            'total_files': 0,
            'total_size_mb': 0.0,
            'by_category': defaultdict(lambda: {'count': 0, 'size_mb': 0.0}),
            'by_type': defaultdict(lambda: {'count': 0, 'size_mb': 0.0}),
        }

    def collect_models(self) -> List[Path]:
        """Collect all Live2D model files."""
        gun_path = GUN_LIVE2D
        if not gun_path.exists():
            print(f"WARNING: Gun models directory not found: {gun_path}")
            return []

        model_files = []
        for filepath in gun_path.rglob('*'):
            if not filepath.is_file():
                continue

            # Check if file matches any pattern
            name = filepath.name
            if (name.endswith('.model3.json') or
                name.endswith('.motion3.json') or
                filepath.suffix in {'.moc3', '.png'}):
                model_files.append(filepath)

        return model_files

    def collect_audio(self) -> List[Path]:
        """Collect all audio files from extracted sounds."""
        if not SOUNDS_DIR.exists():
            print(f"WARNING: Audio directory not found: {SOUNDS_DIR}")
            return []
        return [f for f in SOUNDS_DIR.rglob('*') if f.is_file() and f.suffix == '.ogg']

    def get_file_type(self, filepath: Path) -> str:
        """Determine file type from extension."""
        name = filepath.name

        # Check compound extensions first
        if name.endswith('.model3.json'):
            return 'model'
        elif name.endswith('.motion3.json'):
            return 'motion'

        # Then check single extensions
        ext = filepath.suffix
        if ext == '.moc3':
            return 'binary'
        elif ext == '.png':
            return 'texture'
        elif ext == '.ogg':
            return 'audio'
        return 'unknown'

    def get_model_id(self, filepath: Path) -> str:
        """Extract model ID from filepath."""
        try:
            # Path: live2dnew/gun/{model_id}/{variant}/...
            parts = filepath.parts
            if 'gun' in parts:
                gun_idx = parts.index('gun')
                if gun_idx + 1 < len(parts):
                    return parts[gun_idx + 1]
        except:
            pass
        return ''

    def compute_hash(self, filepath: Path) -> str:
        """Compute MD5 hash of file (to match S3 ETag)."""
        md5_hash = hashlib.md5()
        try:
            with open(filepath, 'rb') as f:
                for byte_block in iter(lambda: f.read(4096), b''):
                    md5_hash.update(byte_block)
            return md5_hash.hexdigest()
        except Exception as e:
            print(f"WARNING: Failed to hash {filepath}: {e}")
            return ''

    def process_files(self, filepaths: List[Path], category: str) -> None:
        """Process list of files and add to inventory."""
        for filepath in filepaths:
            try:
                size_bytes = filepath.stat().st_size
                file_type = self.get_file_type(filepath)
                model_id = self.get_model_id(filepath) if category == 'live2d_models' else ''

                # Relative path from project root - convert backslashes for consistency
                relative_path = str(filepath.relative_to(self.project_root)).replace('\\', '/')

                asset_file = AssetFile(
                    path=relative_path,
                    size_bytes=size_bytes,
                    file_type=file_type,
                    category=category,
                    model_id=model_id,
                    hash_md5=self.compute_hash(filepath),
                )

                self.files.append(asset_file)

                # Update stats
                size_mb = size_bytes / (1024 * 1024)
                self.stats['total_files'] += 1
                self.stats['total_size_mb'] += size_mb
                self.stats['by_category'][category]['count'] += 1
                self.stats['by_category'][category]['size_mb'] += size_mb
                self.stats['by_type'][file_type]['count'] += 1
                self.stats['by_type'][file_type]['size_mb'] += size_mb

            except Exception as e:
                print(f"ERROR: Failed to process {filepath}: {e}")

    def collect_all(self) -> None:
        """Collect all assets."""
        print("Collecting Live2D model assets...")
        models = self.collect_models()
        self.process_files(models, 'live2d_models')
        print(f"  Found {len(models)} model files")

        print("Collecting audio assets...")
        audio = self.collect_audio()
        self.process_files(audio, 'audio')
        print(f"  Found {len(audio)} audio files")

    def validate_coverage(self) -> Tuple[bool, List[str]]:
        """Validate that all essential file types are present."""
        issues = []
        by_type = self.stats['by_type']

        # Check for model definitions
        if by_type['model']['count'] == 0:
            issues.append("No .model3.json files found")

        # Check for binaries
        if by_type['binary']['count'] == 0:
            issues.append("No .moc3 binary files found")

        # Check for textures
        if by_type['texture']['count'] == 0:
            issues.append("No texture (.png) files found")

        # Check for motions
        if by_type['motion']['count'] == 0:
            issues.append("No .motion3.json motion files found")

        # Check for audio
        if by_type['audio']['count'] == 0:
            issues.append("No .ogg audio files found")

        return len(issues) == 0, issues

    def print_summary(self) -> None:
        """Print collection summary."""
        print("\n" + "=" * 80)
        print("ASSET COLLECTION SUMMARY")
        print("=" * 80)

        print(f"\nTotal Files:  {self.stats['total_files']}")
        print(f"Total Size:   {self.stats['total_size_mb']:.1f} MB")

        print("\nBreakdown by Category:")
        for category in sorted(self.stats['by_category'].keys()):
            stats = self.stats['by_category'][category]
            print(f"  {category:20} {stats['count']:6} files  {stats['size_mb']:10.1f} MB")

        print("\nBreakdown by File Type:")
        for file_type in sorted(self.stats['by_type'].keys()):
            stats = self.stats['by_type'][file_type]
            print(f"  {file_type:20} {stats['count']:6} files  {stats['size_mb']:10.1f} MB")

        # Validate coverage
        valid, issues = self.validate_coverage()
        print("\nValidation:")
        if valid:
            print("  ✓ All essential file types present")
        else:
            print("  ✗ Coverage issues found:")
            for issue in issues:
                print(f"    - {issue}")

    def build_variants_manifest(self) -> Dict[str, List[str]]:
        """Build {model_id: [variant, ...]} from the live2d gun directory."""
        variants = defaultdict(set)

        models_path = GUN_LIVE2D

        if not models_path.exists():
            print(f"WARNING: No models directory found at {models_path}")
            return {}

        for model_dir in models_path.iterdir():
            if not model_dir.is_dir():
                continue

            model_id = model_dir.name
            for variant_dir in model_dir.iterdir():
                if variant_dir.is_dir():
                    variants[model_id].add(variant_dir.name)

        # Convert sets to sorted lists
        return {model_id: sorted(list(variant_list)) for model_id, variant_list in variants.items()}

    def copy_to_tmp(self, tmp_root: Path) -> None:
        """Copy all collected assets to tmp/ for local testing via SvelteKit static serving."""
        print("\n" + "=" * 80)
        print("COPYING ASSETS TO STATIC/ASSETS/TMP/")
        print("=" * 80)

        if tmp_root.exists():
            print("Cleaning existing tmp/ directory...")
            shutil.rmtree(tmp_root)

        tmp_models = tmp_root / 'models'
        tmp_audio = tmp_root / 'audio'
        tmp_models.mkdir(parents=True, exist_ok=True)
        tmp_audio.mkdir(parents=True, exist_ok=True)

        if GUN_LIVE2D.exists():
            for src_file in GUN_LIVE2D.rglob('*'):
                if not src_file.is_file():
                    continue
                name = src_file.name
                if not (name.endswith('.model3.json') or name.endswith('.motion3.json')
                        or src_file.suffix in {'.moc3', '.png'}):
                    continue
                dst_file = tmp_models / src_file.relative_to(GUN_LIVE2D)
                dst_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_file, dst_file)

        if SOUNDS_DIR.exists():
            for src_file in SOUNDS_DIR.rglob('*.ogg'):
                if not src_file.is_file():
                    continue
                dst_file = tmp_audio / src_file.relative_to(SOUNDS_DIR)
                dst_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_file, dst_file)

        print(f"Assets copied to: {tmp_root}")

    def generate_manifest_json(self, output_path: Path, skip_write: bool = False) -> None:
        """Generate a lightweight variants JSON for the frontend."""
        # Output simple dictionary: { modelId: [variant1, variant2, ...] }
        data = self.build_variants_manifest()

        if not skip_write:
            with open(output_path, 'w') as f:
                json.dump(data, f, indent=2, sort_keys=True)

            print(f"\nVariants manifest saved to: {output_path}")

        print(f"  Models: {len(data)}")
        print(f"  Total variants: {sum(len(v) for v in data.values())}")

    def filter_live2d_json(self) -> None:
        """Filter live2d.json to only entries whose asset directory exists on disk."""
        print("\n" + "=" * 80)
        print("FILTERING LIVE2D.JSON TO MATCH FILESYSTEM")
        print("=" * 80)

        existing_model_dirs = set(self.build_variants_manifest().keys())
        live2d_path = DATA_DIR / 'live2d.json'

        try:
            with open(live2d_path, 'r') as f:
                all_models = json.load(f)
        except Exception as e:
            print(f"ERROR: Could not read live2d.json: {e}")
            return

        filtered_models = [
            m for m in all_models
            if m.get('directory') and m['directory'].lower() in existing_model_dirs
        ]
        removed_count = len(all_models) - len(filtered_models)

        print(f"\nOriginal models: {len(all_models)}")
        print(f"With existing directories: {len(filtered_models)}")
        print(f"Removed (no assets): {removed_count}")

        with open(live2d_path, 'w') as f:
            json.dump(filtered_models, f, indent=2)

        print(f"\nFiltered live2d.json saved to: {live2d_path}")

    def print_file_listing(self) -> None:
        """Print detailed file listing grouped by category."""
        print("\n" + "=" * 80)
        print("DETAILED FILE LISTING")
        print("=" * 80)

        # Group by category
        by_category = defaultdict(list)
        for asset_file in self.files:
            by_category[asset_file.category].append(asset_file)

        for category in sorted(by_category.keys()):
            files = by_category[category]
            print(f"\n{category.upper()}")
            print("-" * 80)

            # Group by type within category
            by_type = defaultdict(list)
            for asset_file in files:
                by_type[asset_file.file_type].append(asset_file)

            for file_type in sorted(by_type.keys()):
                type_files = by_type[file_type]
                print(f"\n  {file_type.upper()} ({len(type_files)} files)")

                # Show first 10 and last 5 files as sample
                if len(type_files) <= 15:
                    for asset_file in type_files:
                        size_kb = asset_file.size_bytes / 1024
                        print(f"    {asset_file.path:70} {size_kb:10.1f} KB")
                else:
                    for asset_file in type_files[:10]:
                        size_kb = asset_file.size_bytes / 1024
                        print(f"    {asset_file.path:70} {size_kb:10.1f} KB")
                    print(f"    ... ({len(type_files) - 15} more files) ...")
                    for asset_file in type_files[-5:]:
                        size_kb = asset_file.size_bytes / 1024
                        print(f"    {asset_file.path:70} {size_kb:10.1f} KB")


class R2Config:
    """R2 configuration from environment variables."""

    def __init__(self):
        self.account_id = os.getenv('R2_ACCOUNT_ID', '')
        self.access_key = os.getenv('R2_ACCESS_KEY', '')
        self.secret = os.getenv('R2_SECRET', '')
        self.bucket = os.getenv('R2_BUCKET', '')
        self.endpoint_url = os.getenv(
            'R2_ENDPOINT',
            f'https://{self.account_id}.r2.cloudflarestorage.com' if self.account_id else '',
        )
        self.cdn_url = os.getenv('ASSETS_CDN_URL', '')

    def validate(self) -> Tuple[bool, List[str]]:
        """Validate R2 configuration."""
        issues = []

        if not self.account_id:
            issues.append("R2_ACCOUNT_ID not set in .env")
        if not self.access_key:
            issues.append("R2_ACCESS_KEY not set in .env")
        if not self.secret:
            issues.append("R2_SECRET not set in .env")
        if not self.bucket:
            issues.append("R2_BUCKET not set in .env")
        if not self.cdn_url:
            issues.append("ASSETS_CDN_URL not set in .env")

        return len(issues) == 0, issues

    def print_config(self) -> None:
        """Print configuration (with secrets masked)."""
        print("\nR2 Configuration:")
        print(f"  Account ID:      {self.account_id}")
        print(f"  Bucket:          {self.bucket}")
        print(f"  Endpoint:        {self.endpoint_url}")
        print(f"  CDN URL:         {self.cdn_url}")
        print(f"  Access Key:      {self.access_key[:10]}...")
        print(f"  Secret:          {'*' * 10}")

    def upload_to_r2(self, collector: 'AssetCollector') -> bool:
        """Upload collected assets to R2 bucket, skipping unchanged files."""
        if not boto3:
            print("ERROR: boto3 not installed. Run: uv add boto3")
            return False

        try:
            s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret,
                region_name='auto',
            )

            print(f"\nProcessing {len(collector.files)} files for R2...")
            uploaded = 0
            skipped = 0
            failed = 0

            for asset_file in collector.files:
                file_path = Path(asset_file.path)

                # Flatten path for R2: strip project structure prefixes
                if 'live2dnew/gun' in asset_file.path:
                    # Models: Assets/Resources/dabao/live2dnew/gun/ak12/normal/... -> models/ak12/normal/...
                    r2_key = 'models/' + asset_file.path.split('live2dnew/gun/')[-1]
                elif 'sounds/' in asset_file.path:
                    # Audio: static/assets/sounds/M950A/... -> audio/M950A/...
                    r2_key = 'audio/' + asset_file.path.split('sounds/')[-1]
                else:
                    r2_key = asset_file.path

                try:
                    # Check if file exists in R2 and compare hash
                    try:
                        response = s3_client.head_object(
                            Bucket=self.bucket,
                            Key=r2_key,
                        )
                        # S3 ETag is quoted, strip quotes
                        remote_etag = response['ETag'].strip('"')
                        
                        # If ETag matches our hash, skip
                        if remote_etag == asset_file.hash_md5:
                            skipped += 1
                            continue
                    except ClientError as e:
                        # 404 means file doesn't exist, which is fine - we'll upload it
                        if e.response['Error']['Code'] != '404':
                            raise

                    # Upload file with flattened key
                    s3_client.upload_file(
                        str(file_path),
                        self.bucket,
                        r2_key,
                    )
                    uploaded += 1
                    if (uploaded + skipped) % 50 == 0:
                        print(f"  Processed {uploaded + skipped}/{len(collector.files)} files (uploaded: {uploaded}, skipped: {skipped})...")
                except Exception as e:
                    print(f"  ERROR uploading {asset_file.path}: {e}")
                    failed += 1

            print(f"\nUpload complete: {uploaded} uploaded, {skipped} skipped, {failed} failed")
            return failed == 0

        except Exception as e:
            print(f"ERROR: Failed to connect to R2: {e}")
            return False


def main():
    """Main entry point."""
    os.chdir(ROOT)

    load_env_file(ROOT / '.env')

    print("Asset Synchronisation Script for Cloudflare R2")
    print("=" * 80)

    copy_mode = '--copy' in sys.argv
    upload_mode = '--upload' in sys.argv
    dry_run = not (copy_mode or upload_mode)

    collector = AssetCollector(ROOT)
    if not copy_mode:
        collector.collect_all()
        collector.print_summary()
        collector.print_file_listing()

    # Validate R2 configuration
    print("\n" + "=" * 80)
    print("R2 CONFIGURATION")
    print("=" * 80)

    config = R2Config()
    config.print_config()

    valid, issues = config.validate()
    if not valid:
        print("\nConfiguration Issues:")
        for issue in issues:
            print(f"  ✗ {issue}")
        print("\nAdd these variables to .env file to enable uploads.")

    if copy_mode:
        print("\n[COPY MODE] Copying assets to static/assets/ for local testing.")
        tmp_root = ROOT / 'static' / 'assets'
        collector.copy_to_tmp(tmp_root)

        # Generate variants manifest in tmp/
        manifest_path = tmp_root / 'variants.json'
        collector.generate_manifest_json(manifest_path)

        # Filter live2d.json to only include models that exist in filesystem
        collector.filter_live2d_json()

        print("\nTo test with frontend:")
        print("  1. Frontend loads live2d.json (now filtered to only existing models)")
        print("  2. Frontend calls /variants?modelId=... which reads from tmp/models/{modelId}")
        print("  3. Assets load from /assets/models and /assets/audio")
        print("  4. Verify all models load correctly from tmp/")

        manifest_path = DATA_DIR / 'variants.json'
        collector.generate_manifest_json(manifest_path)

    elif dry_run:
        print("\n[DRY RUN MODE] No files will be copied or uploaded.")
        print("To copy files to tmp/, run with: --copy")
        print("To upload files to R2, run with: --upload")

    elif upload_mode:
        if valid:
            print("\n[UPLOAD MODE] Uploading files to R2.")
            success = config.upload_to_r2(collector)

            if success:
                manifest_path = DATA_DIR / 'variants.json'
                collector.generate_manifest_json(manifest_path)
                print("\n✓ Upload successful!")
            else:
                print("\n✗ Upload failed!")
                sys.exit(1)
        else:
            print("\nCannot upload: Configuration incomplete.")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted.")
        sys.exit(1)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
