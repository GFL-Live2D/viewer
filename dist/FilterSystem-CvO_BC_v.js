import { D as e, F as t, I as n, d as r, f as i, h as a, k as o, l as s, m as c, t as l } from "./adapter-DdgmR4Id.js";
import { T as u, _ as d, a as f, i as p, s as m, t as h, u as g, w as _, x as ee } from "./Ticker-CsadseLF.js";
import { r as te, t as ne } from "./canvasUtils-5xQy9vIG.js";
import { n as v, t as y } from "./Cache-NfeSQYWG.js";
import { t as b } from "./path-Bujoe2Qb.js";
import { S as re, c as ie, l as ae, m as oe, t as se, u as ce } from "./Geometry-CASa6bwq.js";
import { t as le } from "./Filter-DNPtpZTY.js";
import { t as ue } from "./CanvasPool-D-H2NTfo.js";
//#region node_modules/pixi.js/lib/rendering/mask/utils/addMaskBounds.mjs
var de = new r();
function x(e, t, n) {
	let r = de;
	e.measurable = !0, ee(e, n, r), t.addBoundsMask(r), e.measurable = !1;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/utils/addMaskLocalBounds.mjs
function S(e, t, n) {
	let r = _.get();
	e.measurable = !0;
	let i = u.get().identity(), a = C(e, n, i);
	d(e, r, a), e.measurable = !1, t.addBoundsMask(r), u.return(i), _.return(r);
}
function C(e, t, n) {
	return e ? (e !== t && (C(e.parent, t, n), e.updateLocalTransform(), n.append(e.localTransform)), n) : (s("Mask bounds, renderable is not inside the root container"), n);
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/alpha/AlphaMask.mjs
var w = class {
	constructor(e) {
		this.priority = 0, this.inverse = !1, this.channel = "red", this.pipe = "alphaMask", e?.mask && this.init(e.mask);
	}
	init(e) {
		this.mask = e, this.renderMaskToTexture = !(e instanceof f), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
	}
	reset() {
		this.mask !== null && (this.mask.measurable = !0, this.mask = null);
	}
	addBounds(e, t) {
		this.inverse || x(this.mask, e, t);
	}
	addLocalBounds(e, t) {
		S(this.mask, e, t);
	}
	containsPoint(e, t) {
		let n = this.mask;
		return t(n, e);
	}
	destroy() {
		this.reset();
	}
	static test(e) {
		return e instanceof f;
	}
};
w.extension = t.MaskEffect;
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/color/ColorMask.mjs
var T = class {
	constructor(e) {
		this.priority = 0, this.pipe = "colorMask", e?.mask && this.init(e.mask);
	}
	init(e) {
		this.mask = e;
	}
	destroy() {}
	static test(e) {
		return typeof e == "number";
	}
};
T.extension = t.MaskEffect;
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/stencil/StencilMask.mjs
var E = class {
	constructor(e) {
		this.priority = 0, this.pipe = "stencilMask", e?.mask && this.init(e.mask);
	}
	init(e) {
		this.mask = e, this.mask.includeInBuild = !1, this.mask.measurable = !1;
	}
	reset() {
		this.mask !== null && (this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null);
	}
	addBounds(e, t) {
		x(this.mask, e, t);
	}
	addLocalBounds(e, t) {
		S(this.mask, e, t);
	}
	containsPoint(e, t) {
		let n = this.mask;
		return t(n, e);
	}
	destroy() {
		this.reset();
	}
	static test(e) {
		return e instanceof m;
	}
};
E.extension = t.MaskEffect;
//#endregion
//#region node_modules/pixi.js/lib/utils/browser/detectVideoAlphaMode.mjs
var D;
async function O() {
	return D ??= (async () => {
		let e = l.get().createCanvas(1, 1).getContext("webgl");
		if (!e) return "premultiply-alpha-on-upload";
		let t = await new Promise((e) => {
			let t = document.createElement("video");
			t.onloadeddata = () => e(t), t.onerror = () => e(null), t.autoplay = !1, t.crossOrigin = "anonymous", t.preload = "auto", t.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", t.load();
		});
		if (!t) return "premultiply-alpha-on-upload";
		let n = e.createTexture();
		e.bindTexture(e.TEXTURE_2D, n);
		let r = e.createFramebuffer();
		e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, n, 0), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.NONE), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t);
		let i = /* @__PURE__ */ new Uint8Array(4);
		return e.readPixels(0, 0, 1, 1, e.RGBA, e.UNSIGNED_BYTE, i), e.deleteFramebuffer(r), e.deleteTexture(n), e.getExtension("WEBGL_lose_context")?.loseContext(), i[0] <= i[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
	})(), D;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/texture/sources/VideoSource.mjs
var k = class e extends a {
	constructor(t) {
		super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
			...e.defaultOptions,
			...t
		}, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), this._onLoadedMetadata = this._onLoadedMetadata.bind(this), t.autoLoad !== !1 && this.load();
	}
	/** Update the video frame if the source is not destroyed and meets certain conditions. */
	updateFrame() {
		if (!this.destroyed) {
			if (this._updateFPS) {
				let e = h.shared.elapsedMS * this.resource.playbackRate;
				this._msToNextUpdate = Math.floor(this._msToNextUpdate - e);
			}
			(!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
		}
	}
	/** Callback to update the video frame and potentially request the next frame update. */
	_videoFrameRequestCallback() {
		this.updateFrame(), this._videoFrameRequestCallbackHandle = this.destroyed ? null : this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback);
	}
	/**
	* Checks if the resource has valid dimensions.
	* @returns {boolean} True if width and height are set, otherwise false.
	*/
	get isValid() {
		return !!this.resource.videoWidth && !!this.resource.videoHeight;
	}
	/**
	* Start preloading the video resource.
	* @returns {Promise<this>} Handle the validate event
	*/
	async load() {
		if (this._load) return this._load;
		let e = this.resource, t = this.options;
		return (e.readyState === e.HAVE_ENOUGH_DATA || e.readyState === e.HAVE_FUTURE_DATA) && e.width && e.height && (e.complete = !0), e.addEventListener("play", this._onPlayStart), e.addEventListener("pause", this._onPlayStop), e.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (t.preload || e.addEventListener("canplay", this._onCanPlay), e.addEventListener("canplaythrough", this._onCanPlayThrough), e.addEventListener("error", this._onError, !0)), this.isValid || e.addEventListener("loadedmetadata", this._onLoadedMetadata), this.alphaMode = await O(), this._load = new Promise((n, r) => {
			this.isValid ? n(this) : (this._resolve = n, this._reject = r, t.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
				this._onError(new ErrorEvent(`Preload exceeded timeout of ${t.preloadTimeoutMs}ms`));
			})), e.load());
		}), this._load;
	}
	/**
	* Handle video error events.
	* @param event - The error event
	*/
	_onError(e) {
		this.resource.removeEventListener("error", this._onError, !0), this.emit("error", e), this._reject && (this._reject(e), this._reject = null, this._resolve = null);
	}
	/**
	* Checks if the underlying source is playing.
	* @returns True if playing.
	*/
	_isSourcePlaying() {
		let e = this.resource;
		return !e.paused && !e.ended;
	}
	/**
	* Checks if the underlying source is ready for playing.
	* @returns True if ready.
	*/
	_isSourceReady() {
		return this.resource.readyState > 2;
	}
	/** Runs the update loop when the video is ready to play. */
	_onPlayStart() {
		this._configureAutoUpdate();
	}
	/** Stops the update loop when a pause event is triggered. */
	_onPlayStop() {
		this._configureAutoUpdate();
	}
	/** Handles behavior when the video completes seeking to the current playback position. */
	_onSeeked() {
		this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
	}
	/** When intrinsic size becomes known after play / canplay (common with MediaStream). */
	_onLoadedMetadata() {
		this.isValid && this._mediaReady();
	}
	_onCanPlay() {
		this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
	}
	_onCanPlayThrough() {
		this.resource.removeEventListener("canplaythrough", this._onCanPlayThrough), this._preloadTimeout &&= (clearTimeout(this._preloadTimeout), void 0), this._mediaReady();
	}
	/** Fired when the video is loaded and ready to play. */
	_mediaReady() {
		let e = this.resource;
		this.isValid && (this.isReady = !0, this.resize(e.videoWidth, e.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && this.isValid && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
	}
	/** Cleans up resources and event listeners associated with this texture. */
	destroy() {
		this._configureAutoUpdate();
		let e = this.resource;
		e && (e.removeEventListener("play", this._onPlayStart), e.removeEventListener("pause", this._onPlayStop), e.removeEventListener("seeked", this._onSeeked), e.removeEventListener("canplay", this._onCanPlay), e.removeEventListener("canplaythrough", this._onCanPlayThrough), e.removeEventListener("loadedmetadata", this._onLoadedMetadata), e.removeEventListener("error", this._onError, !0), e.pause(), e.src = "", e.load()), super.destroy();
	}
	/** Should the base texture automatically update itself, set to true by default. */
	get autoUpdate() {
		return this._autoUpdate;
	}
	set autoUpdate(e) {
		e !== this._autoUpdate && (this._autoUpdate = e, this._configureAutoUpdate());
	}
	/**
	* How many times a second to update the texture from the video.
	* Leave at 0 to update at every render.
	* A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
	*/
	get updateFPS() {
		return this._updateFPS;
	}
	set updateFPS(e) {
		e !== this._updateFPS && (this._updateFPS = e, this._configureAutoUpdate());
	}
	/**
	* Configures the updating mechanism based on the current state and settings.
	*
	* This method decides between using the browser's native video frame callback or a custom ticker
	* for updating the video frame. It ensures optimal performance and responsiveness
	* based on the video's state, playback status, and the desired frames-per-second setting.
	*
	* - If `_autoUpdate` is enabled and the video source is playing:
	*   - It will prefer the native video frame callback if available and no specific FPS is set.
	*   - Otherwise, it will use a custom ticker for manual updates.
	* - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
	*/
	_configureAutoUpdate() {
		this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (h.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (h.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (h.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
	}
	static test(e) {
		return globalThis.HTMLVideoElement && e instanceof HTMLVideoElement;
	}
};
/**
* Map of video MIME types that can't be directly derived from file extensions.
* @readonly
*/
k.extension = t.TextureSource, k.defaultOptions = {
	...a.defaultOptions,
	/** If true, the video will start loading immediately. */
	autoLoad: !0,
	/** If true, the video will start playing as soon as it is loaded. */
	autoPlay: !0,
	/** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
	updateFPS: 0,
	/** If true, the video will be loaded with the `crossorigin` attribute. */
	crossorigin: !0,
	/** If true, the video will loop when it ends. */
	loop: !1,
	/** If true, the video will be muted. */
	muted: !0,
	/** If true, the video will play inline. */
	playsinline: !0,
	/** If true, the video will be preloaded. */
	preload: !1
}, k.MIME_TYPES = {
	ogv: "video/ogg",
	mov: "video/quicktime",
	m4v: "video/mp4"
};
var A = k, j = [];
n.handleByList(t.TextureSource, j);
function fe(e = {}) {
	return M(e);
}
function M(e = {}) {
	let t = e && e.resource, n = t ? e.resource : e, r = t ? e : { resource: e };
	for (let e = 0; e < j.length; e++) {
		let t = j[e];
		if (t.test(n)) return new t(r);
	}
	throw Error(`Could not find a source type for resource: ${r.resource}`);
}
function N(e = {}, t = !1) {
	let n = e && e.resource, r = n ? e.resource : e, a = n ? e : { resource: e };
	if (!t && y.has(r)) return y.get(r);
	let o = new i({ source: M(a) });
	return o.on("destroy", () => {
		y.has(r) && y.remove(r);
	}), t || y.set(r, o), o;
}
function P(e, t = !1) {
	return typeof e == "string" ? y.get(e) : e instanceof a ? new i({ source: e }) : N(e, t);
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/init.mjs
i.from = P, a.from = M, n.add(w, T, E, A, te, p, c);
//#endregion
//#region node_modules/pixi.js/lib/assets/loader/parsers/LoaderParser.mjs
var F = /* @__PURE__ */ ((e) => (e[e.Low = 0] = "Low", e[e.Normal = 1] = "Normal", e[e.High = 2] = "High", e))(F || {});
//#endregion
//#region node_modules/pixi.js/lib/assets/utils/createStringVariations.mjs
function pe(e, t, n, r, i) {
	let a = t[n];
	for (let o = 0; o < a.length; o++) {
		let s = a[o];
		n < t.length - 1 ? pe(e.replace(r[n], s), t, n + 1, r, i) : i.push(e.replace(r[n], s));
	}
}
function I(e) {
	let t = e.match(/\{(.*?)\}/g), n = [];
	if (t) {
		let r = [];
		t.forEach((e) => {
			let t = e.substring(1, e.length - 1).split(",");
			r.push(t);
		}), pe(e, r, 0, t, n);
	} else n.push(e);
	return n;
}
//#endregion
//#region node_modules/pixi.js/lib/assets/utils/isSingleItem.mjs
var L = (e) => !Array.isArray(e), R = class {
	constructor() {
		this._defaultBundleIdentifierOptions = {
			connector: "-",
			createBundleAssetId: (e, t) => `${e}${this._bundleIdConnector}${t}`,
			extractAssetIdFromBundle: (e, t) => t.replace(`${e}${this._bundleIdConnector}`, "")
		}, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
	}
	/**
	* Override how the resolver deals with generating bundle ids.
	* must be called before any bundles are added
	* @param bundleIdentifier - the bundle identifier options
	*/
	setBundleIdentifier(e) {
		if (this._bundleIdConnector = e.connector ?? this._bundleIdConnector, this._createBundleAssetId = e.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = e.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") throw Error("[Resolver] GenerateBundleAssetId are not working correctly");
	}
	/**
	* Let the resolver know which assets you prefer to use when resolving assets.
	* Multiple prefer user defined rules can be added.
	* @example
	* resolver.prefer({
	*     // first look for something with the correct format, and then then correct resolution
	*     priority: ['format', 'resolution'],
	*     params:{
	*         format:'webp', // prefer webp images
	*         resolution: 2, // prefer a resolution of 2
	*     }
	* })
	* resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
	* resolver.resolveUrl('foo') // => 'bar@2x.webp'
	* @param preferOrders - the prefer options
	*/
	prefer(...e) {
		e.forEach((e) => {
			this._preferredOrder.push(e), e.priority ||= Object.keys(e.params);
		}), this._resolverHash = {};
	}
	/**
	* Set the base path to prepend to all urls when resolving
	* @example
	* resolver.basePath = 'https://home.com/';
	* resolver.add('foo', 'bar.ong');
	* resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
	* @param basePath - the base path to use
	*/
	set basePath(e) {
		this._basePath = e;
	}
	get basePath() {
		return this._basePath;
	}
	/**
	* Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
	* default value for browsers is `window.location.origin`
	* @example
	* // Application hosted on https://home.com/some-path/index.html
	* resolver.basePath = 'https://home.com/some-path/';
	* resolver.rootPath = 'https://home.com/';
	* resolver.add('foo', '/bar.png');
	* resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
	* @param rootPath - the root path to use
	*/
	set rootPath(e) {
		this._rootPath = e;
	}
	get rootPath() {
		return this._rootPath;
	}
	/**
	* All the active URL parsers that help the parser to extract information and create
	* an asset object-based on parsing the URL itself.
	*
	* Can be added using the extensions API
	* @example
	* resolver.add('foo', [
	*     {
	*         resolution: 2,
	*         format: 'png',
	*         src: 'image@2x.png',
	*     },
	*     {
	*         resolution:1,
	*         format:'png',
	*         src: 'image.png',
	*     },
	* ]);
	*
	* // With a url parser the information such as resolution and file format could extracted from the url itself:
	* extensions.add({
	*     extension: ExtensionType.ResolveParser,
	*     test: loadTextures.test, // test if url ends in an image
	*     parse: (value: string) =>
	*     ({
	*         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
	*         format: value.split('.').pop(),
	*         src: value,
	*     }),
	* });
	*
	* // Now resolution and format can be extracted from the url
	* resolver.add('foo', [
	*     'image@2x.png',
	*     'image.png',
	* ]);
	*/
	get parsers() {
		return this._parsers;
	}
	/** Used for testing, this resets the resolver to its initial state */
	reset() {
		this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
	}
	/**
	* Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
	* @param searchParams - the default url parameters to append when resolving urls
	*/
	setDefaultSearchParams(e) {
		if (typeof e == "string") this._defaultSearchParams = e;
		else {
			let t = e;
			this._defaultSearchParams = Object.keys(t).map((e) => `${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`).join("&");
		}
	}
	/**
	* Returns the aliases for a given asset
	* @param asset - the asset to get the aliases for
	*/
	getAlias(e) {
		let { alias: t, src: n } = e;
		return v(t || n, (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => e?.src ?? e) : e?.src ? e.src : e, !0);
	}
	/**
	* Removes the specified alias for an asset.
	*
	* This only removes the alias mapping. It does **not** remove, unload, or destroy the
	* underlying asset. If the asset is already cached, it stays in memory until you call
	* `Assets.unload`.
	*
	* If `asset` is provided, the alias is only removed when the resolver's current mapping for
	* that alias matches the given `ResolvedAsset`. This lets you avoid accidentally removing an
	* alias that has been reassigned.
	*
	* Silently returns if the alias does not exist or the asset does not match.
	* @param alias - the alias to remove
	* @param asset - only remove the alias if it is currently assigned to this asset
	* @example
	* ```ts
	* resolver.add({ alias: 'hero', src: 'hero.png' });
	*
	* // Simple removal
	* resolver.removeAlias('hero');
	*
	* // Conditional removal — only if alias currently maps to a specific asset
	* const resolved = resolver.resolve('hero');
	* resolver.removeAlias('hero', resolved);
	* ```
	*/
	removeAlias(e, t) {
		this._assetMap[e] && (t && t !== this._resolverHash[e] || (delete this._resolverHash[e], delete this._assetMap[e]));
	}
	/**
	* Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
	* generally a manifest would be built using a tool.
	* @param manifest - the manifest to add to the resolver
	*/
	addManifest(e) {
		this._manifest && s("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = e, e.bundles.forEach((e) => {
			this.addBundle(e.name, e.assets);
		});
	}
	/**
	* This adds a bundle of assets in one go so that you can resolve them as a group.
	* For example you could add a bundle for each screen in you pixi app
	* @example
	* resolver.addBundle('animals', [
	*  { alias: 'bunny', src: 'bunny.png' },
	*  { alias: 'chicken', src: 'chicken.png' },
	*  { alias: 'thumper', src: 'thumper.png' },
	* ]);
	* // or
	* resolver.addBundle('animals', {
	*     bunny: 'bunny.png',
	*     chicken: 'chicken.png',
	*     thumper: 'thumper.png',
	* });
	*
	* const resolvedAssets = await resolver.resolveBundle('animals');
	* @param bundleId - The id of the bundle to add
	* @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
	*/
	addBundle(e, t) {
		let n = [], r = t;
		Array.isArray(t) || (r = Object.entries(t).map(([e, t]) => typeof t == "string" || Array.isArray(t) ? {
			alias: e,
			src: t
		} : {
			alias: e,
			...t
		})), r.forEach((t) => {
			let r = t.src, i = t.alias, a;
			if (typeof i == "string") {
				let t = this._createBundleAssetId(e, i);
				n.push(t), a = [i, t];
			} else {
				let t = i.map((t) => this._createBundleAssetId(e, t));
				n.push(...t), a = [...i, ...t];
			}
			this.add({
				...t,
				alias: a,
				src: r
			});
		}), this._bundles[e] = n;
	}
	/**
	* Tells the resolver what keys are associated with witch asset.
	* The most important thing the resolver does
	* @example
	* // Single key, single asset:
	* resolver.add({alias: 'foo', src: 'bar.png');
	* resolver.resolveUrl('foo') // => 'bar.png'
	*
	* // Multiple keys, single asset:
	* resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
	* resolver.resolveUrl('foo') // => 'bar.png'
	* resolver.resolveUrl('boo') // => 'bar.png'
	*
	* // Multiple keys, multiple assets:
	* resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
	* resolver.resolveUrl('foo') // => 'bar.png'
	*
	* // Add custom data attached to the resolver
	* Resolver.add({
	*     alias: 'bunnyBooBooSmooth',
	*     src: 'bunny{png,webp}',
	*     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
	* });
	*
	* resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
	* @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
	*/
	add(e) {
		let t = [];
		Array.isArray(e) ? t.push(...e) : t.push(e);
		let n = (e) => {
			this.hasKey(e) && s(`[Resolver] already has key: ${e} overwriting`);
		};
		v(t).forEach((e) => {
			let { src: t } = e, { data: r, format: i, loadParser: a, parser: o } = e, s = v(t).map((e) => typeof e == "string" ? I(e) : Array.isArray(e) ? e : [e]), c = this.getAlias(e);
			Array.isArray(c) ? c.forEach(n) : n(c);
			let l = [], u = (e) => ({
				src: e,
				...this._parsers.find((t) => t.test(e))?.parse(e)
			});
			s.forEach((t) => {
				t.forEach((t) => {
					let n = {};
					if (typeof t == "object" ? (r = t.data ?? r, i = t.format ?? i, (t.loadParser || t.parser) && (a = t.loadParser ?? a, o = t.parser ?? o), n = {
						...u(t.src),
						...t
					}) : n = u(t), !c) throw Error(`[Resolver] alias is undefined for this asset: ${n.src}`);
					n = this._buildResolvedAsset(n, {
						aliases: c,
						data: r,
						format: i,
						loadParser: a,
						parser: o,
						progressSize: e.progressSize
					}), l.push(n);
				});
			}), c.forEach((e) => {
				this._assetMap[e] = l;
			});
		});
	}
	/**
	* If the resolver has had a manifest set via setManifest, this will return the assets urls for
	* a given bundleId or bundleIds.
	* @example
	* // Manifest Example
	* const manifest = {
	*     bundles: [
	*         {
	*             name: 'load-screen',
	*             assets: [
	*                 {
	*                     alias: 'background',
	*                     src: 'sunset.png',
	*                 },
	*                 {
	*                     alias: 'bar',
	*                     src: 'load-bar.{png,webp}',
	*                 },
	*             ],
	*         },
	*         {
	*             name: 'game-screen',
	*             assets: [
	*                 {
	*                     alias: 'character',
	*                     src: 'robot.png',
	*                 },
	*                 {
	*                     alias: 'enemy',
	*                     src: 'bad-guy.png',
	*                 },
	*             ],
	*         },
	*     ]
	* };
	*
	* resolver.setManifest(manifest);
	* const resolved = resolver.resolveBundle('load-screen');
	* @param bundleIds - The bundle ids to resolve
	* @returns All the bundles assets or a hash of assets for each bundle specified
	*/
	resolveBundle(e) {
		let t = L(e);
		e = v(e);
		let n = {};
		return e.forEach((e) => {
			let t = this._bundles[e];
			if (t) {
				let r = this.resolve(t), i = {};
				for (let t in r) {
					let n = r[t];
					i[this._extractAssetIdFromBundle(e, t)] = n;
				}
				n[e] = i;
			}
		}), t ? n[e[0]] : n;
	}
	/**
	* Does exactly what resolve does, but returns just the URL rather than the whole asset object
	* @param key - The key or keys to resolve
	* @returns - The URLs associated with the key(s)
	*/
	resolveUrl(e) {
		let t = this.resolve(e);
		if (typeof e != "string") {
			let e = {};
			for (let n in t) e[n] = t[n].src;
			return e;
		}
		return t.src;
	}
	resolve(e) {
		let t = L(e);
		e = v(e);
		let n = {};
		return e.forEach((e) => {
			if (!this._resolverHash[e]) {
				if (this._assetMap[e]) {
					let t = this._assetMap[e], n = this._getPreferredOrder(t);
					n?.priority.forEach((e) => {
						n.params[e].forEach((n) => {
							let r = t.filter((t) => t[e] ? t[e] === n : !1);
							r.length && (t = r);
						});
					}), this._resolverHash[e] = t[0];
				} else this._resolverHash[e] = this._buildResolvedAsset({
					alias: [e],
					src: e
				}, {});
			}
			n[e] = this._resolverHash[e];
		}), t ? n[e[0]] : n;
	}
	/**
	* Checks if an asset with a given key exists in the resolver
	* @param key - The key of the asset
	*/
	hasKey(e) {
		return !!this._assetMap[e];
	}
	/**
	* Checks if a bundle with the given key exists in the resolver
	* @param key - The key of the bundle
	*/
	hasBundle(e) {
		return !!this._bundles[e];
	}
	/**
	* Internal function for figuring out what prefer criteria an asset should use.
	* @param assets
	*/
	_getPreferredOrder(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t], r = this._preferredOrder.find((e) => e.params.format.includes(n.format));
			if (r) return r;
		}
		return this._preferredOrder[0];
	}
	/**
	* Appends the default url parameters to the url
	* @param url - The url to append the default parameters to
	* @returns - The url with the default parameters appended
	*/
	_appendDefaultSearchParams(e) {
		return this._defaultSearchParams ? `${e}${/\?/.test(e) ? "&" : "?"}${this._defaultSearchParams}` : e;
	}
	_buildResolvedAsset(e, t) {
		let { aliases: n, data: r, loadParser: i, parser: a, format: o, progressSize: s } = t;
		return (this._basePath || this._rootPath) && (e.src = b.toAbsolute(e.src, this._basePath, this._rootPath)), e.alias = n ?? e.alias ?? [e.src], e.src = this._appendDefaultSearchParams(e.src), e.data = {
			...r || {},
			...e.data
		}, e.loadParser = i ?? e.loadParser, e.parser = a ?? e.parser, e.format = o ?? e.format ?? z(e.src), s !== void 0 && (e.progressSize = s), e;
	}
};
/**
* The prefix that denotes a URL is for a retina asset.
* @default /@([0-9\.]+)x/
* @example `@2x`
*/
R.RETINA_PREFIX = /@([0-9\.]+)x/;
function z(e) {
	return e.split(".").pop().split("?").shift().split("#").shift();
}
//#endregion
//#region node_modules/pixi.js/lib/assets/utils/copySearchParams.mjs
var B = (e, t) => {
	let n = t.split("?")[1];
	return n && (e += `?${n}`), e;
}, V = class t {
	constructor(e, t) {
		/** For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on. */
		this.linkedSheets = [];
		let n = e;
		e?.source instanceof a && (n = {
			texture: e,
			data: t
		});
		let { texture: r, data: o, cachePrefix: s = "" } = n;
		this.cachePrefix = s, this._texture = r instanceof i ? r : null, this.textureSource = r.source, this.textures = {}, this.animations = {}, this.data = o;
		let c = parseFloat(o.meta.scale);
		c ? (this.resolution = c, r.source.resolution = this.resolution) : this.resolution = r.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
	}
	/**
	* Parse spritesheet from loaded data. This is done asynchronously
	* to prevent creating too many Texture within a single process.
	*/
	parse() {
		return new Promise((e) => {
			this._callback = e, this._batchIndex = 0, this._frameKeys.length <= t.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
		});
	}
	/**
	* Parse spritesheet from loaded data. This is done synchronously
	* and is only suitable for smaller spritesheets (less than ~1000 frames)
	* or may cause too many Texture within a single process. However, synchronous parsing may be
	* more convenient since the called does not need to be asynchronous and is safe for
	* small-to-medium sized spritesheets.
	*
	* Other than being synchronous, `parseSync` is otherwise identical to `.parse()`.
	*/
	parseSync() {
		return this._processFrames(0, !0), this._processAnimations(), this.textures;
	}
	/**
	* Process a batch of frames
	* @param initialFrameIndex - The index of frame to start.
	* @param processAll - if true will process all frames in a single batch, ignoring BATCH_SIZE - this
	* is used for synchronous parsing.
	*/
	_processFrames(n, r = !1) {
		let a = n, o = r ? Infinity : t.BATCH_SIZE;
		for (; a - n < o && a < this._frameKeys.length;) {
			let t = this._frameKeys[a], n = this._frames[t], r = n.frame;
			if (r) {
				let a = null, o = null, s = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, c = new e(0, 0, Math.floor(s.w) / this.resolution, Math.floor(s.h) / this.resolution);
				a = n.rotated ? new e(Math.floor(r.x) / this.resolution, Math.floor(r.y) / this.resolution, Math.floor(r.h) / this.resolution, Math.floor(r.w) / this.resolution) : new e(Math.floor(r.x) / this.resolution, Math.floor(r.y) / this.resolution, Math.floor(r.w) / this.resolution, Math.floor(r.h) / this.resolution), n.trimmed !== !1 && n.spriteSourceSize && (o = new e(Math.floor(n.spriteSourceSize.x) / this.resolution, Math.floor(n.spriteSourceSize.y) / this.resolution, Math.floor(r.w) / this.resolution, Math.floor(r.h) / this.resolution)), this.textures[t] = new i({
					source: this.textureSource,
					frame: a,
					orig: c,
					trim: o,
					rotate: n.rotated ? 2 : 0,
					defaultAnchor: n.anchor,
					defaultBorders: n.borders,
					label: t.toString()
				});
			}
			a++;
		}
	}
	/** Parse animations config. */
	_processAnimations() {
		let e = this.data.animations || {};
		for (let t in e) {
			this.animations[t] = [];
			for (let n = 0; n < e[t].length; n++) {
				let r = e[t][n];
				this.animations[t].push(this.textures[r]);
			}
		}
	}
	/** The parse has completed. */
	_parseComplete() {
		let e = this._callback;
		this._callback = null, this._batchIndex = 0, e.call(this, this.textures);
	}
	/** Begin the next batch of textures. */
	_nextBatch() {
		this._processFrames(this._batchIndex * t.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
			this._batchIndex * t.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
		}, 0);
	}
	/**
	* Destroy Spritesheet and don't use after this.
	* @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
	*/
	destroy(e = !1) {
		for (let e in this.textures) this.textures[e].destroy();
		this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, e && (this._texture?.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
	}
};
/**
* The maximum number of Textures to build per process.
* @advanced
*/
V.BATCH_SIZE = 1e3;
var H = V, me = [
	"jpg",
	"png",
	"jpeg",
	"avif",
	"webp",
	"basis",
	"etc2",
	"bc7",
	"bc6h",
	"bc5",
	"bc4",
	"bc3",
	"bc2",
	"bc1",
	"eac",
	"astc"
];
function U(e, t, n) {
	let r = {};
	if (e.forEach((e) => {
		r[e] = t;
	}), Object.keys(t.textures).forEach((e) => {
		r[`${t.cachePrefix}${e}`] = t.textures[e];
	}), !n) {
		let n = b.dirname(e[0]);
		t.linkedSheets.forEach((e, i) => {
			let a = U([`${n}/${t.data.meta.related_multi_packs[i]}`], e, !0);
			Object.assign(r, a);
		});
	}
	return r;
}
var W = {
	extension: t.Asset,
	/** Handle the caching of the related Spritesheet Textures */
	cache: {
		test: (e) => e instanceof H,
		getCacheableAssets: (e, t) => U(e, t, !1)
	},
	/** Resolve the resolution of the asset. */
	resolver: {
		extension: {
			type: t.ResolveParser,
			name: "resolveSpritesheet"
		},
		test: (e) => {
			let t = e.split("?")[0].split("."), n = t.pop(), r = t.pop();
			return n === "json" && me.includes(r);
		},
		parse: (e) => {
			let t = e.split(".");
			return {
				resolution: parseFloat(R.RETINA_PREFIX.exec(e)?.[1] ?? "1"),
				format: t[t.length - 2],
				src: e
			};
		}
	},
	/**
	* Loader plugin that parses sprite sheets!
	* once the JSON has been loaded this checks to see if the JSON is spritesheet data.
	* If it is, we load the spritesheets image and parse the data into Spritesheet
	* All textures in the sprite sheet are then added to the cache
	*/
	loader: {
		/** used for deprecation purposes */
		name: "spritesheetLoader",
		id: "spritesheet",
		extension: {
			type: t.LoadParser,
			priority: F.Normal,
			name: "spritesheetLoader"
		},
		async testParse(e, t) {
			return b.extname(t.src).toLowerCase() === ".json" && !!e.frames;
		},
		async parse(e, t, n) {
			let { texture: r, imageFilename: a, textureOptions: o, cachePrefix: s } = t?.data ?? {}, c = b.dirname(t.src);
			c && c.lastIndexOf("/") !== c.length - 1 && (c += "/");
			let l;
			if (r instanceof i) l = r;
			else {
				let r = B(c + (a ?? e.meta.image), t.src);
				l = (await n.load([{
					src: r,
					data: o
				}]))[r];
			}
			let u = new H({
				texture: l.source,
				data: e,
				cachePrefix: s
			});
			await u.parse();
			let d = e?.meta?.related_multi_packs;
			if (Array.isArray(d)) {
				let e = [];
				for (let r of d) {
					if (typeof r != "string") continue;
					let i = c + r;
					t.data?.ignoreMultiPack || (i = B(i, t.src), e.push(n.load({
						src: i,
						data: {
							textureOptions: o,
							ignoreMultiPack: !0
						}
					})));
				}
				let r = await Promise.all(e);
				u.linkedSheets = r, r.forEach((e) => {
					e.linkedSheets = [u].concat(u.linkedSheets.filter((t) => t !== e));
				});
			}
			return u;
		},
		async unload(e, t, n) {
			await n.unload(e.textureSource._sourceOrigin), e.destroy(!1);
		}
	}
};
//#endregion
//#region node_modules/pixi.js/lib/spritesheet/init.mjs
n.add(W);
//#endregion
//#region node_modules/pixi.js/lib/scene/container/bounds/getRenderableBounds.mjs
var G = new o();
function K(e, t) {
	t.clear();
	let n = t.matrix;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		if (r.globalDisplayStatus < 7) continue;
		let i = r.renderGroup ?? r.parentRenderGroup;
		t.matrix = i?.isCachedAsTexture ? G.copyFrom(i.textureOffsetInverseTransform).append(r.worldTransform) : i?._parentCacheAsTextureRenderGroup ? G.copyFrom(i._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(r.groupTransform) : r.worldTransform, t.addBounds(r.bounds);
	}
	return t.matrix = n, t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/utils/getPo2TextureFromSource.mjs
var he = new r();
function q(e, t, n, r, i = !1) {
	let a = he;
	a.minX = 0, a.minY = 0, a.maxX = e.width / r | 0, a.maxY = e.height / r | 0;
	let o = g.getOptimalTexture(a.width, a.height, r, !1, i);
	return o.source.uploadMethodId = "image", o.source.resource = e, o.source.alphaMode = "premultiply-alpha-on-upload", o.frame.width = t / r, o.frame.height = n / r, o.source.emit("update", o.source), o.updateUvs(), o;
}
//#endregion
//#region node_modules/pixi.js/lib/filters/CanvasFilterSystem.mjs
function J(e) {
	return typeof e.getCanvasFilterString == "function";
}
var ge = class {
	constructor() {
		this.skip = !1, this.useClip = !1, this.filters = null, this.container = null, this.bounds = new r(), this.cssFilterString = "";
	}
}, Y = class {
	/**
	* @param renderer - The Canvas renderer
	* @param renderer.canvasContext
	* @param renderer.canvasContext.activeContext
	* @param renderer.canvasContext.activeResolution
	*/
	constructor(e) {
		this._filterStack = [], this._filterStackIndex = 0, this._savedStates = [], this._alphaMultiplier = 1, this._warnedFilterTypes = /* @__PURE__ */ new Set(), this.renderer = e;
	}
	/**
	* Push a filter instruction onto the stack.
	* Called when entering a filtered container.
	* @param instruction - The filter instruction from FilterPipe
	*/
	push(e) {
		let t = this._pushFilterFrame(), n = e.filterEffect.filters;
		if (t.skip = !1, t.useClip = !1, t.filters = n, t.container = e.container, t.cssFilterString = "", n.every((e) => !e.enabled)) {
			t.skip = !0;
			return;
		}
		let r = [];
		for (let e of n) {
			if (!e.enabled) continue;
			if (!J(e)) {
				this._warnUnsupportedFilter(e);
				continue;
			}
			let t = e.getCanvasFilterString();
			if (t === null) {
				this._warnUnsupportedFilter(e);
				continue;
			}
			t && r.push(t);
		}
		if (r.length === 0) {
			t.skip = !0;
			return;
		}
		t.cssFilterString = r.join(" "), this._calculateFilterArea(e, t.bounds), t.useClip = !!e.filterEffect.filterArea;
		let i = this.renderer.canvasContext.activeContext, a = i.filter || "none";
		if (this._savedStates.push({
			filter: a,
			alphaMultiplier: this._alphaMultiplier
		}), t.useClip && Number.isFinite(t.bounds.width) && Number.isFinite(t.bounds.height) && t.bounds.width > 0 && t.bounds.height > 0) {
			let e = this.renderer.canvasContext.activeResolution || 1;
			i.save(), i.setTransform(1, 0, 0, 1, 0, 0), i.beginPath(), i.rect(t.bounds.x * e, t.bounds.y * e, t.bounds.width * e, t.bounds.height * e), i.clip();
		} else t.useClip = !1;
		t.cssFilterString && (i.filter = a === "none" ? t.cssFilterString : `${a} ${t.cssFilterString}`);
	}
	/** Pop a filter from the stack. Called when exiting a filtered container. */
	pop() {
		let e = this._popFilterFrame();
		if (e.skip) return;
		let t = this._savedStates.pop();
		if (!t) return;
		let n = this.renderer.canvasContext.activeContext;
		e.useClip ? n.restore() : n.filter = t.filter, this._alphaMultiplier = t.alphaMultiplier;
	}
	/**
	* Applies supported filters to a texture and returns a new texture.
	* Unsupported filters are skipped with a warn-once message.
	* @param params - The parameters for applying filters.
	* @param params.texture
	* @param params.filters
	* @returns The resulting texture after filters are applied.
	*/
	generateFilteredTexture({ texture: e, filters: t }) {
		if (!t?.length || t.every((e) => !e.enabled)) return e;
		let n = [];
		for (let e of t) {
			if (!e.enabled) continue;
			if (!J(e)) {
				this._warnUnsupportedFilter(e);
				continue;
			}
			let t = e.getCanvasFilterString();
			if (t === null) {
				this._warnUnsupportedFilter(e);
				continue;
			}
			t && n.push(t);
		}
		if (n.length === 0) return e;
		let r = ne.getCanvasSource(e);
		if (!r) return e;
		let i = e.frame, a = e.source._resolution ?? e.source.resolution ?? 1, o = i.width, s = i.height, { canvas: c, context: l } = ue.getOptimalCanvasAndContext(o, s, a);
		l.setTransform(1, 0, 0, 1, 0, 0), l.clearRect(0, 0, c.width, c.height), n.length && (l.filter = n.join(" "));
		let u = i.x * a, d = i.y * a, f = o * a, p = s * a;
		return l.drawImage(r, u, d, f, p, 0, 0, f, p), l.filter = "none", l.globalAlpha = 1, q(c, o, s, a);
	}
	/**
	* Calculate the filter area bounds.
	* @param instruction - Filter instruction
	* @param bounds - Bounds object to populate
	*/
	_calculateFilterArea(e, t) {
		if (e.renderables ? K(e.renderables, t) : e.filterEffect.filterArea ? (t.clear(), t.addRect(e.filterEffect.filterArea), t.applyMatrix(e.container.worldTransform)) : e.container.getFastGlobalBounds(!0, t), e.container) {
			let n = (e.container.renderGroup || e.container.parentRenderGroup)?.cacheToLocalTransform;
			n && t.applyMatrix(n);
		}
	}
	_warnUnsupportedFilter(e) {
		let t = e?.constructor?.name || "Filter";
		this._warnedFilterTypes.has(t) || (this._warnedFilterTypes.add(t), console.warn(`CanvasRenderer: filter "${t}" is not supported in Canvas2D and will be skipped.`));
	}
	get alphaMultiplier() {
		return this._alphaMultiplier;
	}
	_pushFilterFrame() {
		let e = this._filterStack[this._filterStackIndex];
		return e ||= this._filterStack[this._filterStackIndex] = new ge(), this._filterStackIndex++, e;
	}
	_popFilterFrame() {
		return this._filterStackIndex <= 0 ? this._filterStack[0] : (this._filterStackIndex--, this._filterStack[this._filterStackIndex]);
	}
	/** Destroys the system */
	destroy() {
		this._filterStack = null, this._savedStates = null, this._warnedFilterTypes = null, this._alphaMultiplier = 1;
	}
};
/** @ignore */
Y.extension = {
	type: [t.CanvasSystem],
	name: "filter"
};
//#endregion
//#region node_modules/pixi.js/lib/filters/defaults/defaultFilter.vert.mjs
var X = "in vec2 aPosition;\nout vec2 vTextureCoord;\n\nuniform vec4 uInputSize;\nuniform vec4 uOutputFrame;\nuniform vec4 uOutputTexture;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\n    \n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n", Z = "in vec2 vTextureCoord;\nout vec4 finalColor;\nuniform sampler2D uTexture;\nvoid main() {\n    finalColor = texture(uTexture, vTextureCoord);\n}\n", Q = "struct GlobalFilterUniforms {\n  uInputSize: vec4<f32>,\n  uInputPixel: vec4<f32>,\n  uInputClamp: vec4<f32>,\n  uOutputFrame: vec4<f32>,\n  uGlobalFrame: vec4<f32>,\n  uOutputTexture: vec4<f32>,\n};\n\n@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\n@group(0) @binding(2) var uSampler: sampler;\n\nstruct VSOutput {\n  @builtin(position) position: vec4<f32>,\n  @location(0) uv: vec2<f32>\n};\n\nfn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>\n{\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\n\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nfn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>\n{\n    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\n}\n\n@vertex\nfn mainVertex(\n  @location(0) aPosition: vec2<f32>,\n) -> VSOutput {\n  return VSOutput(\n   filterVertexPosition(aPosition),\n   filterTextureCoord(aPosition)\n  );\n}\n\n@fragment\nfn mainFragment(\n  @location(0) uv: vec2<f32>,\n) -> @location(0) vec4<f32> {\n    return textureSample(uTexture, uSampler, uv);\n}\n", _e = class extends le {
	constructor() {
		let e = oe.from({
			vertex: {
				source: Q,
				entryPoint: "mainVertex"
			},
			fragment: {
				source: Q,
				entryPoint: "mainFragment"
			},
			name: "passthrough-filter"
		}), t = re.from({
			vertex: X,
			fragment: Z,
			name: "passthrough-filter"
		});
		super({
			gpuProgram: e,
			glProgram: t
		});
	}
}, ve = class {
	constructor(e) {
		this._renderer = e;
	}
	push(e, t, n) {
		this._renderer.renderPipes.batch.break(n), n.add({
			renderPipeId: "filter",
			canBundle: !1,
			action: "pushFilter",
			container: t,
			filterEffect: e
		});
	}
	pop(e, t, n) {
		this._renderer.renderPipes.batch.break(n), n.add({
			renderPipeId: "filter",
			action: "popFilter",
			canBundle: !1
		});
	}
	execute(e) {
		e.action === "pushFilter" ? this._renderer.filter.push(e) : e.action === "popFilter" && this._renderer.filter.pop();
	}
	destroy() {
		this._renderer = null;
	}
};
ve.extension = {
	type: [
		t.WebGLPipes,
		t.WebGPUPipes,
		t.CanvasPipes
	],
	name: "filter"
};
//#endregion
//#region node_modules/pixi.js/lib/filters/FilterSystem.mjs
var ye = new se({
	attributes: { aPosition: {
		buffer: new Float32Array([
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			1
		]),
		format: "float32x2",
		stride: 8,
		offset: 0
	} },
	indexBuffer: new Uint32Array([
		0,
		1,
		2,
		0,
		2,
		3
	])
}), be = class {
	constructor() {
		/** The last enabled filter index in the current filter list. */
		this.skip = !1, this.inputTexture = null, this.backTexture = null, this.filters = null, this.bounds = new r(), this.container = null, this.blendRequired = !1, this.outputRenderSurface = null, this.globalFrame = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}, this.firstEnabledIndex = -1, this.lastEnabledIndex = -1;
	}
}, $ = class {
	constructor(e) {
		this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new ce({
			uInputSize: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uInputPixel: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uInputClamp: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uOutputFrame: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uGlobalFrame: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uOutputTexture: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			}
		}), this._globalFilterBindGroup = new ae({}), this.renderer = e;
	}
	/**
	* The back texture of the currently active filter. Requires the filter to have `blendRequired` set to true.
	* @readonly
	*/
	get activeBackTexture() {
		return this._activeFilterData?.backTexture;
	}
	/**
	* Pushes a filter instruction onto the filter stack.
	* @param instruction - The instruction containing the filter effect and container.
	* @internal
	*/
	push(e) {
		let t = this.renderer, n = e.filterEffect.filters, r = this._pushFilterData();
		r.skip = !1, r.filters = n, r.container = e.container, r.outputRenderSurface = t.renderTarget.renderSurface;
		let i = t.renderTarget.renderTarget.colorTexture.source, a = i.resolution, o = i.antialias;
		if (n.every((e) => !e.enabled)) {
			r.skip = !0;
			return;
		}
		let s = r.bounds;
		if (this._calculateFilterArea(e, s), this._calculateFilterBounds(r, t.renderTarget.rootViewPort, o, a, 1), r.skip) return;
		let c = this._getPreviousFilterData(), l = this._findFilterResolution(a), u = 0, d = 0;
		c && (u = c.bounds.minX, d = c.bounds.minY), this._calculateGlobalFrame(r, u, d, l, i.width, i.height), this._setupFilterTextures(r, s, t, c);
	}
	/**
	* Applies filters to a texture.
	*
	* This method takes a texture and a list of filters, applies the filters to the texture,
	* and returns the resulting texture.
	* @param {object} params - The parameters for applying filters.
	* @param {Texture} params.texture - The texture to apply filters to.
	* @param {Filter[]} params.filters - The filters to apply.
	* @returns {Texture} The resulting texture after all filters have been applied.
	* @example
	*
	* ```ts
	* // Create a texture and a list of filters
	* const texture = new Texture(...);
	* const filters = [new BlurFilter(), new ColorMatrixFilter()];
	*
	* // Apply the filters to the texture
	* const resultTexture = filterSystem.applyToTexture({ texture, filters });
	*
	* // Use the resulting texture
	* sprite.texture = resultTexture;
	* ```
	*
	* Key Points:
	* 1. padding is not currently supported here - so clipping may occur with filters that use padding.
	* 2. If all filters are disabled or skipped, the original texture is returned.
	*/
	generateFilteredTexture({ texture: e, filters: t }) {
		let n = this._pushFilterData();
		this._activeFilterData = n, n.skip = !1, n.filters = t;
		let r = e.source, a = r.resolution, o = r.antialias;
		if (t.every((e) => !e.enabled)) return n.skip = !0, e;
		let s = n.bounds;
		if (s.addRect(e.frame), this._calculateFilterBounds(n, s.rectangle, o, a, 0), n.skip) return e;
		let c = a;
		this._calculateGlobalFrame(n, 0, 0, c, r.width, r.height), n.outputRenderSurface = g.getOptimalTexture(s.width, s.height, n.resolution, n.antialias), n.backTexture = i.EMPTY, n.inputTexture = e, this.renderer.renderTarget.finishRenderPass(), this._applyFiltersToTexture(n, !0);
		let l = n.outputRenderSurface;
		return l.source.alphaMode = "premultiplied-alpha", l;
	}
	/** @internal */
	pop() {
		let e = this.renderer, t = this._popFilterData();
		t.skip || (e.globalUniforms.pop(), e.renderTarget.finishRenderPass(), this._activeFilterData = t, this._applyFiltersToTexture(t, !1), t.blendRequired && g.returnTexture(t.backTexture), g.returnTexture(t.inputTexture));
	}
	/**
	* Copies the last render surface to a texture.
	* @param lastRenderSurface - The last render surface to copy from.
	* @param bounds - The bounds of the area to copy.
	* @param previousBounds - The previous bounds to use for offsetting the copy.
	*/
	getBackTexture(e, t, n) {
		let r = e.colorTexture.source._resolution, i = g.getOptimalTexture(t.width, t.height, r, !1), a = t.minX, o = t.minY;
		n && (a -= n.minX, o -= n.minY), a = Math.floor(a * r), o = Math.floor(o * r);
		let s = Math.ceil(t.width * r), c = Math.ceil(t.height * r);
		return this.renderer.renderTarget.copyToTexture(e, i, {
			x: a,
			y: o
		}, {
			width: s,
			height: c
		}, {
			x: 0,
			y: 0
		}), i;
	}
	/**
	* Applies a filter to a texture.
	* @param filter - The filter to apply.
	* @param input - The input texture.
	* @param output - The output render surface.
	* @param clear - Whether to clear the output surface before applying the filter.
	*/
	applyFilter(e, t, n, r) {
		let i = this.renderer, a = this._activeFilterData, o = a.outputRenderSurface === n, s = i.renderTarget.rootRenderTarget.colorTexture.source._resolution, c = this._findFilterResolution(s), l = 0, u = 0;
		if (o) {
			let e = this._findPreviousFilterOffset();
			l = e.x, u = e.y;
		}
		this._updateFilterUniforms(t, n, a, l, u, c, o, r);
		let d = e.enabled ? e : this._getPassthroughFilter();
		this._setupBindGroupsAndRender(d, t, i);
	}
	/**
	* Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
	*
	* Use `outputMatrix * vTextureCoord` in the shader.
	* @param outputMatrix - The matrix to output to.
	* @param {Sprite} sprite - The sprite to map to.
	* @returns The mapped matrix.
	*/
	calculateSpriteMatrix(e, t) {
		let n = this._activeFilterData, r = e.set(n.inputTexture._source.width, 0, 0, n.inputTexture._source.height, n.bounds.minX, n.bounds.minY), i = t.worldTransform.copyTo(o.shared), a = t.renderGroup || t.parentRenderGroup;
		return a && a.cacheToLocalTransform && i.prepend(a.cacheToLocalTransform), i.invert(), r.prepend(i), r.scale(1 / t.texture.orig.width, 1 / t.texture.orig.height), r.translate(t.anchor.x, t.anchor.y), r;
	}
	destroy() {
		this._passthroughFilter?.destroy(!0), this._passthroughFilter = null;
	}
	_getPassthroughFilter() {
		return this._passthroughFilter ??= new _e(), this._passthroughFilter;
	}
	/**
	* Sets up the bind groups and renders the filter.
	* @param filter - The filter to apply
	* @param input - The input texture
	* @param renderer - The renderer instance
	*/
	_setupBindGroupsAndRender(e, t, n) {
		if (n.renderPipes.uniformBatch) {
			let e = n.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);
			this._globalFilterBindGroup.setResource(e, 0);
		} else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms, 0);
		this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, n.encoder.draw({
			geometry: ye,
			shader: e,
			state: e._state,
			topology: "triangle-list"
		}), n.type === ie.WEBGL && n.renderTarget.finishRenderPass();
	}
	/**
	* Sets up the filter textures including input texture and back texture if needed.
	* @param filterData - The filter data to update
	* @param bounds - The bounds for the texture
	* @param renderer - The renderer instance
	* @param previousFilterData - The previous filter data for back texture calculation
	*/
	_setupFilterTextures(e, t, n, r) {
		if (e.backTexture = i.EMPTY, e.inputTexture = g.getOptimalTexture(t.width, t.height, e.resolution, e.antialias), e.blendRequired) {
			n.renderTarget.finishRenderPass();
			let i = n.renderTarget.getRenderTarget(e.outputRenderSurface);
			e.backTexture = this.getBackTexture(i, t, r?.bounds);
		}
		n.renderTarget.bind({
			target: e.inputTexture,
			clear: !0
		}), n.globalUniforms.push({ offset: t });
	}
	/**
	* Calculates and sets the global frame for the filter.
	* @param filterData - The filter data to update
	* @param offsetX - The X offset
	* @param offsetY - The Y offset
	* @param globalResolution - The global resolution
	* @param sourceWidth - The source texture width
	* @param sourceHeight - The source texture height
	*/
	_calculateGlobalFrame(e, t, n, r, i, a) {
		let o = e.globalFrame;
		o.x = t * r, o.y = n * r, o.width = i * r, o.height = a * r;
	}
	/**
	* Updates the filter uniforms with the current filter state.
	* @param input - The input texture
	* @param output - The output render surface
	* @param filterData - The current filter data
	* @param offsetX - The X offset for positioning
	* @param offsetY - The Y offset for positioning
	* @param resolution - The current resolution
	* @param isFinalTarget - Whether this is the final render target
	* @param clear - Whether to clear the output surface
	*/
	_updateFilterUniforms(e, t, n, r, a, o, s, c) {
		let l = this._filterGlobalUniforms.uniforms, u = l.uOutputFrame, d = l.uInputSize, f = l.uInputPixel, p = l.uInputClamp, m = l.uGlobalFrame, h = l.uOutputTexture;
		s ? (u[0] = n.bounds.minX - r, u[1] = n.bounds.minY - a) : (u[0] = 0, u[1] = 0), u[2] = e.frame.width, u[3] = e.frame.height, d[0] = e.source.width, d[1] = e.source.height, d[2] = 1 / d[0], d[3] = 1 / d[1], f[0] = e.source.pixelWidth, f[1] = e.source.pixelHeight, f[2] = 1 / f[0], f[3] = 1 / f[1], p[0] = .5 * f[2], p[1] = .5 * f[3], p[2] = e.frame.width * d[2] - .5 * f[2], p[3] = e.frame.height * d[3] - .5 * f[3];
		let g = this.renderer.renderTarget.rootRenderTarget.colorTexture;
		m[0] = r * o, m[1] = a * o, m[2] = g.source.width * o, m[3] = g.source.height * o, t instanceof i && (t.source.resource = null);
		let _ = this.renderer.renderTarget.getRenderTarget(t);
		this.renderer.renderTarget.bind({
			target: t,
			clear: !!c
		}), t instanceof i ? (h[0] = t.frame.width, h[1] = t.frame.height) : (h[0] = _.width, h[1] = _.height), h[2] = _.isRoot ? -1 : 1, this._filterGlobalUniforms.update();
	}
	/**
	* Finds the correct resolution by looking back through the filter stack.
	* @param rootResolution - The fallback root resolution to use
	* @returns The resolution from the previous filter or root resolution
	*/
	_findFilterResolution(e) {
		let t = this._filterStackIndex - 1;
		for (; t > 0 && this._filterStack[t].skip;) --t;
		return t > 0 && this._filterStack[t].inputTexture ? this._filterStack[t].inputTexture.source._resolution : e;
	}
	/**
	* Finds the offset from the previous non-skipped filter in the stack.
	* @returns The offset coordinates from the previous filter
	*/
	_findPreviousFilterOffset() {
		let e = 0, t = 0, n = this._filterStackIndex;
		for (; n > 0;) {
			n--;
			let r = this._filterStack[n];
			if (!r.skip) {
				e = r.bounds.minX, t = r.bounds.minY;
				break;
			}
		}
		return {
			x: e,
			y: t
		};
	}
	/**
	* Calculates the filter area bounds based on the instruction type.
	* @param instruction - The filter instruction
	* @param bounds - The bounds object to populate
	*/
	_calculateFilterArea(e, t) {
		if (e.renderables ? K(e.renderables, t) : e.filterEffect.filterArea ? (t.clear(), t.addRect(e.filterEffect.filterArea), t.applyMatrix(e.container.worldTransform)) : e.container.getFastGlobalBounds(!0, t), e.container) {
			let n = (e.container.renderGroup || e.container.parentRenderGroup).cacheToLocalTransform;
			n && t.applyMatrix(n);
		}
	}
	_applyFiltersToTexture(e, t) {
		let n = e.inputTexture, r = e.bounds, i = e.filters, a = e.firstEnabledIndex, o = e.lastEnabledIndex;
		if (this._globalFilterBindGroup.setResource(n.source.style, 2), this._globalFilterBindGroup.setResource(e.backTexture.source, 3), a === o) i[a].apply(this, n, e.outputRenderSurface, t);
		else {
			let n = e.inputTexture, s = g.getOptimalTexture(r.width, r.height, n.source._resolution, !1), c = s;
			for (let e = a; e < o; e++) {
				let t = i[e];
				if (!t.enabled) continue;
				t.apply(this, n, c, !0);
				let r = n;
				n = c, c = r;
			}
			i[o].apply(this, n, e.outputRenderSurface, t), g.returnTexture(s);
		}
	}
	_calculateFilterBounds(e, t, n, r, i) {
		let a = this.renderer, o = e.bounds, c = e.filters, l = Infinity, u = 0, d = !0, f = !1, p = !1, m = !0, h = -1, g = -1;
		for (let e = 0; e < c.length; e++) {
			let t = c[e];
			if (t.enabled) {
				if (h === -1 && (h = e), g = e, l = Math.min(l, t.resolution === "inherit" ? r : t.resolution), u += t.padding, t.antialias === "off" ? d = !1 : t.antialias === "inherit" && (d &&= n), t.clipToViewport || (m = !1), !(t.compatibleRenderers & a.type)) {
					p = !1;
					break;
				}
				if (t.blendRequired && !(a.backBuffer?.useBackBuffer ?? !0)) {
					s("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), p = !1;
					break;
				}
				p = !0, f ||= t.blendRequired;
			}
		}
		if (!p) {
			e.skip = !0;
			return;
		}
		if (m && o.fitBounds(0, t.width / r, 0, t.height / r), o.scale(l).ceil().scale(1 / l).pad((u | 0) * i), !o.isPositive) {
			e.skip = !0;
			return;
		}
		e.antialias = d, e.resolution = l, e.blendRequired = f, e.firstEnabledIndex = h, e.lastEnabledIndex = g;
	}
	_popFilterData() {
		return this._filterStackIndex--, this._filterStack[this._filterStackIndex];
	}
	_getPreviousFilterData() {
		let e, t = this._filterStackIndex - 1;
		for (; t > 0 && (t--, e = this._filterStack[t], e.skip););
		return e;
	}
	_pushFilterData() {
		let e = this._filterStack[this._filterStackIndex];
		return e ||= this._filterStack[this._filterStackIndex] = new be(), this._filterStackIndex++, e;
	}
};
/** @ignore */
$.extension = {
	type: [t.WebGLSystem, t.WebGPUSystem],
	name: "filter"
};
//#endregion
export { O as C, S as D, w as E, x as O, A as S, T, I as _, Z as a, N as b, J as c, W as d, H as f, L as g, z as h, Q as i, q as l, R as m, ve as n, X as o, B as p, _e as r, Y as s, $ as t, K as u, F as v, E as w, P as x, fe as y };
