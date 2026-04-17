"""Shared path constants for all extraction scripts."""

from pathlib import Path

ROOT = Path(__file__).parent.parent

ASSETS = ROOT / "Assets"
STREAMING_ASSETS = ASSETS / "StreamingAssets" / "Res" / "Pc"
GUN_LIVE2D = ASSETS / "Resources" / "dabao" / "live2dnew" / "gun"
TABLE = ASSETS / "Resources" / "dabao" / "table"
PROFILE_CONFIG = ASSETS / "Resources" / "dabao" / "profilesconfig"

DATA_DIR = ROOT / "src" / "lib" / "data"
SOUNDS_DIR = ROOT / "static" / "assets" / "sounds"


def stc(file_id: int) -> Path:
    return STREAMING_ASSETS / "stc" / f"{file_id}.stc"
