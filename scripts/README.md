# Data Extraction Scripts

Regenerates the JSON metadata under `src/lib/data/` from game files, and validates the model set.
Paths are resolved in `paths.py` relative to the project root.

## Setup

Python 3.10+ with `uv`, plus a full Unity `Assets/` tree from GFL (drop it in at project root or
symlink it). Dependencies are declared in `pyproject.toml` and resolved from `uv.lock`, so
`uv run` installs them on first use.

`extract_live2d.py` and `extract_voice_map.py` read STC tables through the `gfl-data-miner-python`
submodule, so initialise it first (`git submodule update --init`). Only its `utils/format_stc.py` is
used and that is pure stdlib, so nothing from the submodule needs installing.

`extract_all_audio.py` uses [vgmstream](https://vgmstream.org/) to decode `.acb.bytes` voice banks.
Install the CLI and make sure `vgmstream-cli` is on `PATH`:

```bash
winget install vgmstream.vgmstream   # Windows
brew install vgmstream               # macOS
```

Other platforms: grab a build from [the releases page](https://github.com/vgmstream/vgmstream/releases).

## Full regeneration

```bash
uv run scripts/extract_live2d.py        # live2d.json
uv run scripts/extract_voice_map.py     # motions.json + voice.json
uv run scripts/extract_gun_names.py     # names.json
uv run scripts/extract_skin_names.py    # costumes.json
uv run scripts/extract_all_audio.py     # decode .acb.bytes via vgmstream-cli
uv run scripts/sync_assets_r2.py --copy # copy models+audio into static/assets/ and emit variants.json
uv run scripts/validate_live2d_models.py
uv run scripts/convert_unity_live2d.py  # convert Unity Live2D exports into Cubism 3 format
```

## Extraction

### `extract_live2d.py`

Character definitions from STC 5014. Emits `live2d.json` (id, code, skin, fit_gun).

### `extract_voice_map.py`

Motion-to-voice mappings with captions, from STC 5037 plus
`Assets/Resources/dabao/profilesconfig/NewCharacterVoice.txt`. Emits `motions.json` and `voice.json`.

### `extract_gun_names.py`

Gun display names from STC 5005, mapping `fit_gun` (from `live2d.json`) to `en_name`. Emits
`names.json`.

### `extract_skin_names.py`

Costume display names, joining `Assets/Resources/dabao/table/skin.txt` against skin IDs parsed from
directory names under `live2dnew/gun/`. Emits `costumes.json`.

Coverage is limited to skins with a directory present under `live2dnew/gun/`. Skins without a
matching Live2D asset are skipped, reported as warnings, and fall back to "Neural Upgrade" in the UI.

### `extract_all_audio.py`

Multithreaded extraction from CriWare ACB containers via `vgmstream-cli`. Takes an optional character
id to limit the run.

```bash
uv run scripts/extract_all_audio.py [CHAR_ID]
```

## Assets

### `sync_assets_r2.py`

Collects Live2D models and audio, validates them, and emits `variants.json`. With no mode flag it
runs a dry inventory.

```bash
uv run scripts/sync_assets_r2.py           # inventory only
uv run scripts/sync_assets_r2.py --copy    # copy into static/assets/
uv run scripts/sync_assets_r2.py --upload  # upload to the R2 bucket
```

`--upload` skips files already present in the bucket, so re-runs only send what changed.

Configuration comes from `.env` at project root: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY`, `R2_SECRET`,
`R2_BUCKET`, `ASSETS_CDN_URL`. `R2_ENDPOINT` is optional and defaults to the account's
`r2.cloudflarestorage.com` URL.

### `split-model-data.ts`

Emits one motion/voice file per model so a single-model page fetches only its own data. It is automatically ran before `static:build`; output is gitignored.

## Conversion and validation

### `convert_unity_live2d.py`

Converts Unity Live2D exports (`.asset`, `.prefab`, `.anim`) to Cubism 3 format: extracts the MOC3
binary, parses `.anim` YAML curves into `motion3.json` segments, and generates `model3.json` with
texture and motion references. Already done for the full gun set, kept for re-runs.

### `validate_live2d_models.py`

Checks `model3.json` structure and required fields, MOC3 existence and magic bytes, `motion3.json`
structure, and texture references. Exits 1 on failures.

```bash
uv run scripts/validate_live2d_models.py      # basic
uv run scripts/validate_live2d_models.py -v   # per-step output
uv run scripts/validate_live2d_models.py /path/to/models
```

Models are classified by animation type: simple loop (idle only), complex (multiple motion types),
interactive (has a touch motion), static (no animations).

### `analyze_gun_formats.py`

Format analysis: variant breakdown, texture resolution distribution, conversion status, animation
type coverage.

### `verify_extraction.py`

Compares what exists in the Unity prefabs against what the conversion writes to `model3.json`, to
find data the pipeline drops.

## Shared modules

`paths.py` holds the path constants every script imports. `stc_reader.py` is the binary reader for
the STC format (little-endian, length-prefixed strings).
