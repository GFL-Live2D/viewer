# GFL Live2D Viewer

## [**Try the live demo**](https://gfl-live2d.github.io/)

[![Viewer](https://img.shields.io/badge/Viewer-gfl--live2d.github.io-2ea44f?style=for-the-badge)](https://gfl-live2d.github.io/)

Browser-based Live2D model viewer for Girls' Frontline. Built with SvelteKit 5, PixiJS 8, and [untitled-pixi-live2d-engine](https://github.com/Untitled-Story/untitled-pixi-live2d-engine).

This app is currently in beta. Assets are not included in this repository. You supply your own.

## Features

- Model browser with search, sort, variant switching.
- Focus tracking (click, hold, or touch to pull the model's gaze).
- Motion and voice playback with caption overlay.
- Pinch/scroll zoom, middle-click pan, right-click background drag.
- Background image drop/paste.
- Deep link: `?model=<gun-code>&variant=<variant-name>`, or a path route like `/pa-15/damaged`.
- Hide UI via `?ui=0`, or drop it entirely with a path route or `?only=<gun-code>`.
- Iframe-friendly: the app generates a ready embed snippet for the selected model.
- Keyboard shortcuts (M move, E focus, 0 reset background, Ctrl+V paste).

## TODO

- Multi-instance Live2D: load several models at once, control them independently, and layer them.
- Browse and pick from default static and Live2D backgrounds from the game, instead of requiring a user-supplied image.
- Reuse the renderer when switching models, instead of `resetModel` on every selection.

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

| Param         | Example            | Notes                                                                                       |
|---------------|--------------------|---------------------------------------------------------------------------------------------|
| `model`       | `?model=pa-15`     | Gun name, costume name, base code, full game code (`pa15_5802`), directory name, or alias.  |
| `only`        | `?only=pa-15`      | Display-only mode. Same matching as `model`, but a miss is an error rather than a fallback. |
| `damaged`     | `&damaged`         | `&variant=damaged` lets you specify exact variant. `damaged` maps to internal `destroy`.    |
| `ui`          | `&ui=0`            | Hide the model list and info panels on load. Ignored by `only`.                             |
| `transparent` | `&transparent`     | Transparent page background. Path routes are transparent already.                           |
| `theme`       | `&theme=paradeus`  | `sangvis` or `paradeus`. Anything else is ignored.                                          |

Multiple names may resolve to the same model for example `?model=I, am Chaos`, `?model=iamchaos` and `/I-am-Chaos`.

## Path Routes

Prerendered static pages, one per model and variant. A model answers to its gun name, costume
name, code and directory, so several paths reach the same page:

```
/pa-15
/pa-15/damaged
/shape-of-her-heart
/88type-50001/damaged
```

These serve the model on its own, like `?only=`, and are always transparent, so the embedding page
supplies whatever background it wants.

Only the slug spellings above are prerendered as files.

### Display-only mode (`only`)

`?only=<gun>` serves the viewer by itself without the control panels, the same presentation as a
path route. Both feature only click and hold for focus tracking, and tapping a hitbox to play its
motion and voice. Voice lines still play, with no caption text and no volume control.

In subdomain mode the hostname already names the model, so `?only` is written bare and the
subdomain resolves it: `https://pa15.example.com/?only&variant=damaged`. That is the one case
where `?only` is needed, since there is no path form to use; elsewhere prefer a path route.

## Embedding

The viewer is iframe-friendly. Open Direct Access, Embedding in the app: it builds a ready
snippet for the selected model and variant, with a toggle for whether the control panel comes
along. Copy that rather than writing one by hand.

The snippet already carries `style="background: transparent"`, since browsers paint an opaque
iframe background by default. Add `allowtransparency="true"` for older engines.

Everything below is for cases the panel does not cover.

### Framing headers

These control whether a third-party page may put the viewer in an iframe. They are set by whatever
serves the app, and are unrelated to CORS. Check that your deployment does **not** send:

- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self'` (or a list that excludes your embedder)

SvelteKit and `@sveltejs/adapter-node` don't set either by default, but reverse proxies often do. To
allow any origin:

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

To allow specific sites only, replace `*` with a space-separated list, e.g.
`frame-ancestors https://example.com https://*.example.org`. `X-Frame-Options` has no multi-origin
form, so drop it entirely and let `frame-ancestors` do the work.

### CORS headers

Separate problem, and it applies whether or not the viewer is embedded. When assets are served from
another origin (`PUBLIC_CDN_URL`, or the mirror a static build falls back to), the host serving
**the assets** must allow cross-origin reads. WebGL is strict here: a texture fetched without CORS
approval taints the canvas and the model fails to draw.

```nginx
# nginx, on the asset host
add_header Access-Control-Allow-Origin "*" always;
```

```caddyfile
# Caddy, on the asset host
header Access-Control-Allow-Origin "*"
```

Same-origin deployments (`/assets` under the app itself, the `adapter-node` default) need none of
this.

The copy-link button and the embed snippet's `allow="clipboard-write"` require no extra headers.

## Data Files

The viewer ships with pre-extracted JSON metadata under `src/lib/data/`:

- `live2d.json`: character metadata (id, code, skin, fit_gun)
- `motions.json`: motion lookup
- `voice.json`: voice line captions
- `variants.json`: per-model variant list
- `aliases.json`, `costumes.json`, `names.json`: alias / display-name lookups
- `live2d-overrides.json`: per-model render tweaks

To regenerate any of these from game files, see [`scripts/README.md`](scripts/README.md).

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
