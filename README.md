# GFL Live2D Viewer

Browser-based Live2D model viewer for Girls' Frontline. Built with SvelteKit 5, PixiJS 8, and [untitled-pixi-live2d-engine](https://github.com/Untitled-Story/untitled-pixi-live2d-engine).

This app is currently in beta. Assets are not included in this repository. You supply your own.

## Features

- Model browser with search, sort, variant switching.
- Focus tracking (click, hold, or touch to pull the model's gaze).
- Motion and voice playback with caption overlay.
- Pinch/scroll zoom, middle-click pan, right-click background drag.
- Background image drop/paste.
- Deep link: `?model=<gun-code>&variant=<variant-name>`.
- Hide UI via `?ui=0` (controls reappear on hover near the top right corner).
- Iframe-friendly: the whole page is embeddable.
- Keyboard shortcuts (M move, E focus, 0 reset background, Ctrl+V paste).

## Getting Started

```bash
bun install
bun run dev
```

Open <http://localhost:5173>.

Clone with `--recurse-submodules`, or run `git submodule update --init` if you already cloned.
The `gfl-data-miner-python` submodule is only needed for the extraction scripts, not to run the viewer.

> Nothing in the codebase is bun-specific, so `pnpm`/`npm`/`yarn` should work too.

### Asset layout

The viewer expects assets under `static/assets/`:

```
static/assets/
  models/<gun-code>/<variant>/...   # Cubism 3 model files (model3.json + moc3 + textures + motion3.json)
  audio/<char-id>/*.ogg             # Voice lines (optional)
```

To point at a CDN instead, set `PUBLIC_CDN_URL` (falls back to `/assets`):

```bash
PUBLIC_CDN_URL=https://cdn.example.com
```

## URL Parameters

| Param     | Example            | Notes                                                                    |
|-----------|--------------------|--------------------------------------------------------------------------|
| `model`   | `?model=pa-15`     | Base code, full game code (`pa15_5802`), or directory name.              |
| `variant` | `&variant=damaged` | Case-insensitive. `damaged` maps to internal `destroy`. Omit for normal. |
| `ui`      | `&ui=0`            | Hide the model list and info panels on load.                             |

Invalid `model` falls back to a random gun. Missing `variant` falls back to the model's default.

## Embedding

The viewer is iframe-friendly. Typical embed with UI hidden:

```html
<iframe
    src="https://your-host/?model=pa-15&ui=0"
    width="100%" height="600"
    frameborder="0"
    allow="clipboard-write"
></iframe>
```

Hover near the bottom edge inside the iframe to reveal the controls without leaving the host page.

### CORS / iframe headers

For the viewer to render inside a third-party page, the host serving it must not block framing. Check that your deployment does **not** send:

- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self'` (or a list that excludes your embedder)

SvelteKit and `@sveltejs/adapter-node` don't set these by default, but reverse proxies often do. To allow any origin:

```nginx
# nginx
add_header Content-Security-Policy "frame-ancestors *;" always;
# and remove any `add_header X-Frame-Options ...;` line
```

```caddyfile
# Caddy
header Content-Security-Policy "frame-ancestors *;"
header -X-Frame-Options
```

To allow specific sites only, replace `*` with a space-separated list, e.g. `frame-ancestors https://example.com https://*.example.org`.

The copy-link button and embed snippet's `allow="clipboard-write"` require no extra headers.

## Data Files

The viewer ships with pre-extracted JSON metadata under `src/lib/data/`:

- `live2d.json`: character metadata (id, code, skin, fit_gun)
- `motions.json`: motion lookup
- `voice.json`: voice line captions
- `variants.json`: per-model variant list
- `aliases.json`, `costumes.json`, `names.json`: alias / display-name lookups
- `live2d-overrides.json`: per-model render tweaks

### Regenerating data from game files

Extraction scripts live in `scripts/`. They require a full Unity `Assets/` tree from GFL (drop it in at project root or symlink it) and Python 3.10+ with `uv`.

`extract_live2d.py` and `extract_voice_map.py` read STC tables through the `gfl-data-miner-python` submodule, so
initialise it first (`git submodule update --init`). Only its `utils/format_stc.py` is used and that is pure stdlib,
so the submodule's own `requirements.txt` does not need installing.

`extract_all_audio.py` uses [vgmstream](https://vgmstream.org/) to decode `.acb.bytes` voice banks.
Install the CLI and make sure `vgmstream-cli` is on `PATH`:

```bash
winget install vgmstream.vgmstream   # Windows
brew install vgmstream               # macOS
```

Other platforms: grab a build from [the releases page](https://github.com/vgmstream/vgmstream/releases).

```bash
uv run scripts/extract_live2d.py        # live2d.json
uv run scripts/extract_voice_map.py     # motions.json + voice.json
uv run scripts/extract_gun_names.py     # names.json
uv run scripts/extract_skin_names.py    # costumes.json
uv run scripts/extract_all_audio.py     # decode .acb.bytes via vgmstream-cli
uv run scripts/sync_assets_r2.py --copy # copy models+audio into static/assets/ and emit variants.json
uv run scripts/validate_live2d_models.py
uv run scripts/convert_unity_live2d.py  # converting Unity Live2D exports into Cubism 3 format.
```

## Using the Controller Standalone

`src/lib/live2d/Live2DController.svelte.ts` is a self-contained class that manages a PixiJS application and an
`untitled-pixi-live2d-engine` model. It has no dependency on SvelteKit or the viewer UI.
To use it elsewhere: create a `<canvas>`, instantiate `Live2DController`, call `loadCharacter(entry, variant, motionData, voiceData, true, assetBaseUrl)`, then drive it through its public methods (`playMotion`, `setZoom`, `setFocusPoint`, etc.).
Per-model render tweaks are read from `src/lib/data/live2d-overrides.json`, inline that data or pass your own.
The only runtime dependency besides PixiJS and `untitled-pixi-live2d-engine` is the zoom spring;
replace it with any interpolation if you are outside this project.

## Licence

MIT. See `LICENSE`.

GFL game assets are property of Sunborn / MICA Team and are not distributed here.
