import { A as e, C as t, D as n, E as r, F as i, I as a, P as o, S as s, a as c, c as l, d as u, f as d, g as f, h as p, k as m, l as h, p as g, t as _, u as v } from "./adapter-DdgmR4Id.js";
import { A as y, _ as ee, a as te, b as ne, i as b, l as re, s as x, t as ie, u as S, x as ae } from "./Ticker-CsadseLF.js";
import { S as oe, c as C, l as se, m as ce, u as le } from "./Geometry-CASa6bwq.js";
import { r as ue, t as de } from "./Filter-DNPtpZTY.js";
import { F as w, n as fe } from "./GCManagedHash-EG4FSGJE.js";
//#region node_modules/pixi.js/lib/environment/autoDetectEnvironment.mjs
var T = [];
a.handleByNamedList(i.Environment, T);
async function E(e) {
	if (!e) for (let e = 0; e < T.length; e++) {
		let t = T[e];
		if (t.value.test()) {
			await t.value.load();
			return;
		}
	}
}
async function pe(e) {
	return E(!e);
}
//#endregion
//#region node_modules/pixi.js/lib/utils/browser/unsafeEvalSupported.mjs
var D;
function me() {
	if (typeof D == "boolean") return D;
	try {
		D = Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
	} catch {
		D = !1;
	}
	return D;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/const.mjs
var O = /* @__PURE__ */ ((e) => (e[e.NONE = 0] = "NONE", e[e.COLOR = 16384] = "COLOR", e[e.STENCIL = 1024] = "STENCIL", e[e.DEPTH = 256] = "DEPTH", e[e.COLOR_DEPTH = 16640] = "COLOR_DEPTH", e[e.COLOR_STENCIL = 17408] = "COLOR_STENCIL", e[e.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", e[e.ALL = 17664] = "ALL", e))(O || {}), k = class {
	/**
	* @param name - The function name that will be executed on the listeners added to this Runner.
	*/
	constructor(e) {
		this.items = [], this._name = e;
	}
	/**
	* Dispatch/Broadcast Runner to all listeners added to the queue.
	* @param {...any} params - (optional) parameters to pass to each listener
	*/
	emit(e, t, n, r, i, a, o, s) {
		let { name: c, items: l } = this;
		for (let u = 0, d = l.length; u < d; u++) l[u][c](e, t, n, r, i, a, o, s);
		return this;
	}
	/**
	* Add a listener to the Runner
	*
	* Runners do not need to have scope or functions passed to them.
	* All that is required is to pass the listening object and ensure that it has contains a function that has the same name
	* as the name provided to the Runner when it was created.
	*
	* Eg A listener passed to this Runner will require a 'complete' function.
	*
	* ```ts
	* import { Runner } from 'pixi.js';
	*
	* const complete = new Runner('complete');
	* ```
	*
	* The scope used will be the object itself.
	* @param {any} item - The object that will be listening.
	*/
	add(e) {
		return e[this._name] && (this.remove(e), this.items.push(e)), this;
	}
	/**
	* Remove a single listener from the dispatch queue.
	* @param {any} item - The listener that you would like to remove.
	*/
	remove(e) {
		let t = this.items.indexOf(e);
		return t !== -1 && this.items.splice(t, 1), this;
	}
	/**
	* Check to see if the listener is already in the Runner
	* @param {any} item - The listener that you would like to check.
	*/
	contains(e) {
		return this.items.indexOf(e) !== -1;
	}
	/** Remove all listeners from the Runner */
	removeAll() {
		return this.items.length = 0, this;
	}
	/** Remove all references, don't use after this. */
	destroy() {
		this.removeAll(), this.items = null, this._name = null;
	}
	/**
	* `true` if there are no this Runner contains no listeners
	* @readonly
	*/
	get empty() {
		return this.items.length === 0;
	}
	/**
	* The name of the runner.
	* @readonly
	*/
	get name() {
		return this._name;
	}
}, he = [
	"init",
	"destroy",
	"contextChange",
	"resolutionChange",
	"resetState",
	"renderEnd",
	"renderStart",
	"render",
	"update",
	"postrender",
	"prerender"
], ge = class e extends o {
	/**
	* Set up a system with a collection of SystemClasses and runners.
	* Systems are attached dynamically to this class when added.
	* @param config - the config for the system manager
	*/
	constructor(e) {
		super(), this.tick = 0, this.uid = r("renderer"), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = e.type, this.name = e.name, this.config = e;
		let t = [...he, ...this.config.runners ?? []];
		this._addRunners(...t), this._unsafeEvalCheck();
	}
	/**
	* Initialize the renderer.
	* @param options - The options to use to create the renderer.
	*/
	async init(t = {}) {
		await E(t.skipExtensionImports === !0 || t.manageImports === !1), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
		for (let e in this._systemsHash) t = {
			...this._systemsHash[e].constructor.defaultOptions,
			...t
		};
		t = {
			...e.defaultOptions,
			...t
		}, this._roundPixels = +!!t.roundPixels;
		for (let e = 0; e < this.runners.init.items.length; e++) await this.runners.init.items[e].init(t);
		this._initOptions = t;
	}
	render(e, n) {
		this.tick++;
		let r = e;
		if (r instanceof x && (r = { container: r }, n && (s(t, "passing a second argument is deprecated, please use render options instead"), r.target = n.renderTexture)), r.target || (r.target = this.view.renderTarget), r.target === this.view.renderTarget && (this._lastObjectRendered = r.container, r.clearColor ?? (r.clearColor = this.background.colorRgba), r.clear ?? (r.clear = this.background.clearBeforeRender)), r.clearColor) {
			let e = Array.isArray(r.clearColor) && r.clearColor.length === 4;
			r.clearColor = e ? r.clearColor : v.shared.setValue(r.clearColor).toArray();
		}
		r.transform || (r.container.updateLocalTransform(), r.transform = r.container.localTransform), r.container.visible && (r.container.enableRenderGroup(), this.runners.prerender.emit(r), this.runners.renderStart.emit(r), this.runners.render.emit(r), this.runners.renderEnd.emit(r), this.runners.postrender.emit(r));
	}
	/**
	* Resizes the WebGL view to the specified width and height.
	* @param desiredScreenWidth - The desired width of the screen.
	* @param desiredScreenHeight - The desired height of the screen.
	* @param resolution - The resolution / device pixel ratio of the renderer.
	*/
	resize(e, t, n) {
		let r = this.view.resolution;
		this.view.resize(e, t, n), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), n !== void 0 && n !== r && this.runners.resolutionChange.emit(n);
	}
	/**
	* Clears the render target.
	* @param options - The options to use when clearing the render target.
	* @param options.target - The render target to clear.
	* @param options.clearColor - The color to clear with.
	* @param options.clear - The clear mode to use.
	* @advanced
	*/
	clear(e = {}) {
		let t = this;
		e.target ||= t.renderTarget.renderTarget, e.clearColor ||= this.background.colorRgba, e.clear ??= O.ALL;
		let { clear: n, clearColor: r, target: i, mipLevel: a, layer: o } = e;
		v.shared.setValue(r ?? this.background.colorRgba), t.renderTarget.clear(i, n, v.shared.toArray(), a ?? 0, o ?? 0);
	}
	/** The resolution / device pixel ratio of the renderer. */
	get resolution() {
		return this.view.resolution;
	}
	set resolution(e) {
		this.view.resolution = e, this.runners.resolutionChange.emit(e);
	}
	/**
	* Same as view.width, actual number of pixels in the canvas by horizontal.
	* @type {number}
	* @readonly
	* @default 800
	*/
	get width() {
		return this.view.texture.frame.width;
	}
	/**
	* Same as view.height, actual number of pixels in the canvas by vertical.
	* @default 600
	*/
	get height() {
		return this.view.texture.frame.height;
	}
	/**
	* The canvas element that everything is drawn to.
	* @type {environment.ICanvas}
	*/
	get canvas() {
		return this.view.canvas;
	}
	/**
	* the last object rendered by the renderer. Useful for other plugins like interaction managers
	* @readonly
	*/
	get lastObjectRendered() {
		return this._lastObjectRendered;
	}
	/**
	* Flag if we are rendering to the screen vs renderTexture
	* @readonly
	* @default true
	*/
	get renderingToScreen() {
		return this.renderTarget.renderingToScreen;
	}
	/**
	* Measurements of the screen. (0, 0, screenWidth, screenHeight).
	*
	* Its safe to use as filterArea or hitArea for the whole stage.
	*/
	get screen() {
		return this.view.screen;
	}
	/**
	* Create a bunch of runners based of a collection of ids
	* @param runnerIds - the runner ids to add
	*/
	_addRunners(...e) {
		e.forEach((e) => {
			this.runners[e] = new k(e);
		});
	}
	_addSystems(e) {
		let t;
		for (t in e) {
			let n = e[t];
			this._addSystem(n.value, n.name);
		}
	}
	/**
	* Add a new system to the renderer.
	* @param ClassRef - Class reference
	* @param name - Property name for system, if not specified
	*        will use a static `name` property on the class itself. This
	*        name will be assigned as s property on the Renderer so make
	*        sure it doesn't collide with properties on Renderer.
	* @returns Return instance of renderer
	*/
	_addSystem(e, t) {
		let n = new e(this);
		if (this[t]) throw Error(`Whoops! The name "${t}" is already in use`);
		this[t] = n, this._systemsHash[t] = n;
		for (let e in this.runners) this.runners[e].add(n);
		return this;
	}
	_addPipes(e, t) {
		let n = t.reduce((e, t) => (e[t.name] = t.value, e), {});
		e.forEach((e) => {
			let t = e.value, r = e.name, i = n[r];
			this.renderPipes[r] = new t(this, i ? new i() : null), this.runners.destroy.add(this.renderPipes[r]);
		});
	}
	destroy(e = !1) {
		this.runners.destroy.items.reverse(), this.runners.destroy.emit(e), (e === !0 || typeof e == "object" && e.releaseGlobalResources) && l.release(), Object.values(this.runners).forEach((e) => {
			e.destroy();
		}), this._systemsHash = null, this.renderPipes = null, this.removeAllListeners();
	}
	/**
	* Generate a texture from a container.
	* @param options - options or container target to use when generating the texture
	* @returns a texture
	*/
	generateTexture(e) {
		return this.textureGenerator.generateTexture(e);
	}
	/**
	* Whether the renderer will round coordinates to whole pixels when rendering.
	* Can be overridden on a per scene item basis.
	*/
	get roundPixels() {
		return !!this._roundPixels;
	}
	/**
	* Overridable function by `pixi.js/unsafe-eval` to silence
	* throwing an error if platform doesn't support unsafe-evals.
	* @private
	* @ignore
	*/
	_unsafeEvalCheck() {
		if (!me()) throw Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
	}
	/**
	* Resets the rendering state of the renderer.
	* This is useful when you want to use the WebGL context directly and need to ensure PixiJS's internal state
	* stays synchronized. When modifying the WebGL context state externally, calling this method before the next Pixi
	* render will reset all internal caches and ensure it executes correctly.
	*
	* This is particularly useful when combining PixiJS with other rendering engines like Three.js:
	* ```js
	* // Reset Three.js state
	* threeRenderer.resetState();
	*
	* // Render a Three.js scene
	* threeRenderer.render(threeScene, threeCamera);
	*
	* // Reset PixiJS state since Three.js modified the WebGL context
	* pixiRenderer.resetState();
	*
	* // Now render Pixi content
	* pixiRenderer.render(pixiScene);
	* ```
	* @advanced
	*/
	resetState() {
		this.runners.resetState.emit();
	}
};
/** The default options for the renderer. */
ge.defaultOptions = {
	/**
	* Default resolution / device pixel ratio of the renderer.
	* @default 1
	*/
	resolution: 1,
	/**
	* Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
	* function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
	* performance issues when using WebGL.
	*
	* In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
	* scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
	* driver version blacklisted by the
	* browser.
	*
	* If your application requires high performance rendering, you may wish to set this to false.
	* We recommend one of two options if you decide to set this flag to false:
	*
	* 1: Use the Canvas renderer as a fallback in case high performance WebGL is
	*    not supported.
	*
	* 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
	*    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
	*    device & browser combination does not support high performance WebGL.
	*    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
	* @default false
	*/
	failIfMajorPerformanceCaveat: !1,
	/**
	* Should round pixels be forced when rendering?
	* @default false
	*/
	roundPixels: !1
};
var _e = ge, ve = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i, A = "8.20.1", ye = class {
	static init() {
		globalThis.__PIXI_APP_INIT__?.(this, A);
	}
	static destroy() {}
};
/** @ignore */
ye.extension = i.Application;
var j = class {
	constructor(e) {
		this._renderer = e;
	}
	init() {
		globalThis.__PIXI_RENDERER_INIT__?.(this._renderer, A);
	}
	destroy() {
		this._renderer = null;
	}
};
/** @ignore */
j.extension = {
	type: [i.WebGLSystem, i.WebGPUSystem],
	name: "initHook",
	priority: -10
};
//#endregion
//#region node_modules/pixi.js/lib/filters/mask/mask.frag.mjs
var be = "in vec2 vMaskCoord;\nin vec2 vTextureCoord;\n\nuniform sampler2D uTexture;\nuniform sampler2D uMaskTexture;\n\nuniform float uAlpha;\nuniform vec4 uMaskClamp;\nuniform float uInverse;\nuniform float uChannel;\n\nout vec4 finalColor;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(uMaskClamp.x, vMaskCoord.x) +\n        step(uMaskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, uMaskClamp.z) +\n        step(vMaskCoord.y, uMaskClamp.w));\n\n    // TODO look into why this is needed\n    float npmAlpha = uAlpha;\n    vec4 original = texture(uTexture, vTextureCoord);\n    vec4 masky = texture(uMaskTexture, vMaskCoord);\n\n    float a;\n    if (uChannel == 1.0) {\n        a = masky.a * npmAlpha * clip;\n    } else {\n        float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n        a = alphaMul * masky.r * npmAlpha * clip;\n    }\n\n    if (uInverse == 1.0) {\n        a = 1.0 - a;\n    }\n\n    finalColor = original * a;\n}\n", xe = "in vec2 aPosition;\n\nout vec2 vTextureCoord;\nout vec2 vMaskCoord;\n\n\nuniform vec4 uInputSize;\nuniform vec4 uOutputFrame;\nuniform vec4 uOutputTexture;\nuniform mat3 uFilterMatrix;\n\nvec4 filterVertexPosition(  vec2 aPosition )\n{\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\n       \n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord(  vec2 aPosition )\n{\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\n}\n\nvec2 getFilterCoord( vec2 aPosition )\n{\n    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;\n}   \n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition(aPosition);\n    vTextureCoord = filterTextureCoord(aPosition);\n    vMaskCoord = getFilterCoord(aPosition);\n}\n", M = "struct GlobalFilterUniforms {\n  uInputSize:vec4<f32>,\n  uInputPixel:vec4<f32>,\n  uInputClamp:vec4<f32>,\n  uOutputFrame:vec4<f32>,\n  uGlobalFrame:vec4<f32>,\n  uOutputTexture:vec4<f32>,\n};\n\nstruct MaskUniforms {\n  uFilterMatrix:mat3x3<f32>,\n  uMaskClamp:vec4<f32>,\n  uAlpha:f32,\n  uInverse:f32,\n  uChannel:f32,\n};\n\n@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\n@group(0) @binding(2) var uSampler : sampler;\n\n@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;\n@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;\n\nstruct VSOutput {\n    @builtin(position) position: vec4<f32>,\n    @location(0) uv : vec2<f32>,\n    @location(1) filterUv : vec2<f32>,\n};\n\nfn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>\n{\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\n\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\n    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\n\n    return vec4(position, 0.0, 1.0);\n}\n\nfn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\n{\n    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\n}\n\nfn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\n{\n  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);\n}\n\nfn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>\n{\n  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;\n}\n\nfn getSize() -> vec2<f32>\n{\n  return gfu.uGlobalFrame.zw;\n}\n\n@vertex\nfn mainVertex(\n  @location(0) aPosition : vec2<f32>,\n) -> VSOutput {\n  return VSOutput(\n   filterVertexPosition(aPosition),\n   filterTextureCoord(aPosition),\n   getFilterCoord(aPosition)\n  );\n}\n\n@fragment\nfn mainFragment(\n  @location(0) uv: vec2<f32>,\n  @location(1) filterUv: vec2<f32>,\n  @builtin(position) position: vec4<f32>\n) -> @location(0) vec4<f32> {\n\n    var maskClamp = filterUniforms.uMaskClamp;\n    var uAlpha = filterUniforms.uAlpha;\n\n    var clip = step(3.5,\n      step(maskClamp.x, filterUv.x) +\n      step(maskClamp.y, filterUv.y) +\n      step(filterUv.x, maskClamp.z) +\n      step(filterUv.y, maskClamp.w));\n\n    var mask = textureSample(uMaskTexture, uSampler, filterUv);\n    var source = textureSample(uTexture, uSampler, uv);\n\n    var a: f32;\n    if (filterUniforms.uChannel == 1.0) {\n        a = mask.a * uAlpha * clip;\n    } else {\n        var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);\n        a = alphaMul * mask.r * uAlpha * clip;\n    }\n\n    if (filterUniforms.uInverse == 1.0) {\n        a = 1.0 - a;\n    }\n\n    return source * a;\n}\n", Se = class extends de {
	constructor(e) {
		let { sprite: t, ...n } = e, r = new g(t.texture), i = new le({
			uFilterMatrix: {
				value: new m(),
				type: "mat3x3<f32>"
			},
			uMaskClamp: {
				value: r.uClampFrame,
				type: "vec4<f32>"
			},
			uAlpha: {
				value: 1,
				type: "f32"
			},
			uInverse: {
				value: +!!e.inverse,
				type: "f32"
			},
			uChannel: {
				value: +(e.channel === "alpha"),
				type: "f32"
			}
		}), a = ce.from({
			vertex: {
				source: M,
				entryPoint: "mainVertex"
			},
			fragment: {
				source: M,
				entryPoint: "mainFragment"
			}
		}), o = oe.from({
			vertex: xe,
			fragment: be,
			name: "mask-filter"
		});
		super({
			...n,
			gpuProgram: a,
			glProgram: o,
			clipToViewport: !1,
			resources: {
				filterUniforms: i,
				uMaskTexture: t.texture.source
			}
		}), this.sprite = t, this._textureMatrix = r;
	}
	/**
	* Rebinds the filter to a new mask sprite, moving the texture-matrix `update`
	* listener and the bind group's `change` subscription over to the new sprite's
	* texture. `apply` refreshes the same bindings on every use — this method exists
	* to release the previous sprite's texture immediately, without waiting for
	* (or requiring) another `apply`.
	* @param sprite - the sprite to mask with from now on.
	*/
	setSprite(e) {
		this.sprite = e;
		let t = this._getSafeTexture();
		this._textureMatrix.texture = t, this.resources.uMaskTexture = t.source;
	}
	set inverse(e) {
		this.resources.filterUniforms.uniforms.uInverse = +!!e;
	}
	get inverse() {
		return this.resources.filterUniforms.uniforms.uInverse === 1;
	}
	set channel(e) {
		this.resources.filterUniforms.uniforms.uChannel = +(e === "alpha");
	}
	get channel() {
		return this.resources.filterUniforms.uniforms.uChannel === 1 ? "alpha" : "red";
	}
	apply(e, t, n, r) {
		let i = this._getSafeTexture();
		this._textureMatrix.texture = i, e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix, this.sprite).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = i.source, e.applyFilter(this, t, n, r);
	}
	/**
	* The sprite's texture, or `Texture.EMPTY` when that texture has been destroyed —
	* a destroyed texture has no source left to sample, so the mask degrades to empty
	* rather than crashing the render.
	*/
	_getSafeTexture() {
		let e = this.sprite.texture;
		return e.destroyed || !e.source || e.source.destroyed ? (h("[MaskFilter] The mask texture was destroyed while the mask is still in use. Remove the mask before destroying its texture."), d.EMPTY) : e;
	}
	destroy(e = !1) {
		this._textureMatrix.destroy(), super.destroy(e);
	}
};
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/gpu/colorToUniform.mjs
function Ce(e, t, n, r) {
	n[r++] = (e >> 16 & 255) / 255, n[r++] = (e >> 8 & 255) / 255, n[r++] = (e & 255) / 255, n[r++] = t;
}
function we(e, t, n) {
	let r = (e >> 24 & 255) / 255;
	t[n++] = (e & 255) / 255 * r, t[n++] = (e >> 8 & 255) / 255 * r, t[n++] = (e >> 16 & 255) / 255 * r, t[n++] = r;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/sprite/BatchableSprite.mjs
var N = class {
	constructor() {
		this.batcherName = "default", this.topology = "triangle-list", this.attributeSize = 4, this.indexSize = 6, this.packAsQuad = !0, this.roundPixels = 0, this._attributeStart = 0, this._batcher = null, this._batch = null;
	}
	get blendMode() {
		return this.renderable.groupBlendMode;
	}
	get color() {
		return this.renderable.groupColorAlpha;
	}
	reset() {
		this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.bounds = null;
	}
	destroy() {
		this.reset();
	}
}, P = class e {
	constructor(e, t) {
		this.state = ue.for2d(), this._batchersByInstructionSet = /* @__PURE__ */ Object.create(null), this._activeBatches = /* @__PURE__ */ Object.create(null), this.renderer = e, this._adaptor = t, this._adaptor.init?.(this);
	}
	static getBatcher(e, t) {
		return new this._availableBatchers[e]({ maxTextures: t });
	}
	buildStart(e) {
		let t = this._batchersByInstructionSet[e.uid];
		t || (t = this._batchersByInstructionSet[e.uid] = /* @__PURE__ */ Object.create(null), t.default || (t.default = new fe({ maxTextures: this.renderer.limits.maxBatchableTextures }))), this._activeBatches = t, this._activeBatch = this._activeBatches.default;
		for (let e in this._activeBatches) this._activeBatches[e].begin();
	}
	addToBatch(t, n) {
		if (this._activeBatch.name !== t.batcherName) {
			this._activeBatch.break(n);
			let r = this._activeBatches[t.batcherName];
			r || (r = this._activeBatches[t.batcherName] = e.getBatcher(t.batcherName, this.renderer.limits.maxBatchableTextures), r.begin()), this._activeBatch = r;
		}
		this._activeBatch.add(t);
	}
	break(e) {
		this._activeBatch.break(e);
	}
	buildEnd(e) {
		this._activeBatch.break(e);
		let t = this._activeBatches;
		for (let e in t) {
			let n = t[e], r = n.geometry;
			r.indexBuffer.setDataWithSize(n.indexBuffer, n.indexSize, !0), r.buffers[0].setDataWithSize(n.attributeBuffer.float32View, n.attributeSize, !1);
		}
	}
	upload(e) {
		let t = this._batchersByInstructionSet[e.uid];
		for (let e in t) {
			let n = t[e], r = n.geometry;
			n.dirty && (n.dirty = !1, r.buffers[0].update(n.attributeSize * 4));
		}
	}
	execute(e) {
		if (e.action === "startBatch") {
			let t = e.batcher, n = t.geometry, r = t.shader;
			this._adaptor.start(this, n, r);
		}
		this._adaptor.execute(this, e);
	}
	destroy() {
		this.state = null, this.renderer = null, this._adaptor = null;
		for (let e in this._activeBatches) this._activeBatches[e].destroy();
		this._activeBatches = null;
	}
};
P.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "batch"
}, P._availableBatchers = /* @__PURE__ */ Object.create(null);
var F = P;
a.handleByMap(i.Batcher, F._availableBatchers), a.add(fe);
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/alpha/AlphaMaskPipe.mjs
var Te = new u(), Ee = class extends y {
	constructor() {
		super(), this._placeholderSprite = new te(d.EMPTY), this.filters = [new Se({
			sprite: this._placeholderSprite,
			inverse: !1,
			resolution: "inherit",
			antialias: "inherit"
		})];
	}
	get sprite() {
		return this.filters[0].sprite;
	}
	set sprite(e) {
		this.filters[0].setSprite(e);
	}
	get inverse() {
		return this.filters[0].inverse;
	}
	set inverse(e) {
		this.filters[0].inverse = e;
	}
	get channel() {
		return this.filters[0].channel;
	}
	set channel(e) {
		this.filters[0].channel = e;
	}
	/**
	* Called by {@link BigPool} when the pipe returns the effect: parks the filter
	* on the empty placeholder so a pooled effect keeps no bindings to the last
	* mask it applied. Without this, the pooled filter pins the mask sprite and
	* its texture for as long as the effect sits in the pool, and destroying that
	* texture's source hits a bind group subscription the user cannot release.
	*/
	reset() {
		this._placeholderSprite.texture = d.EMPTY, this.sprite = this._placeholderSprite;
	}
}, I = class {
	constructor(e) {
		this._activeMaskStage = [], this._usedEffects = [], this._renderer = e, e.runners.postrender.add(this);
	}
	push(e, t, n) {
		let r = this._renderer;
		if (r.renderPipes.batch.break(n), n.add({
			renderPipeId: "alphaMask",
			action: "pushMaskBegin",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1,
			maskedContainer: t
		}), e.inverse = t._maskOptions.inverse, e.channel = t._maskOptions.channel ?? "red", e.renderMaskToTexture) {
			let t = e.mask;
			t.includeInBuild = !0, t.collectRenderables(n, r, null), t.includeInBuild = !1;
		}
		r.renderPipes.batch.break(n), n.add({
			renderPipeId: "alphaMask",
			action: "pushMaskEnd",
			mask: e,
			maskedContainer: t,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
	}
	pop(e, t, n) {
		this._renderer.renderPipes.batch.break(n), n.add({
			renderPipeId: "alphaMask",
			action: "popMaskEnd",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
	}
	execute(e) {
		let t = this._renderer, n = e.mask.renderMaskToTexture;
		if (e.action === "pushMaskBegin") {
			let r = c.get(Ee);
			if (r.inverse = e.inverse, r.channel = e.mask.channel, n) {
				e.mask.mask.measurable = !0;
				let n = ae(e.mask.mask, !0, Te);
				e.mask.mask.measurable = !1, n.ceil();
				let i = t.renderTarget.renderTarget.colorTexture.source, a = S.getOptimalTexture(n.width, n.height, i._resolution, i.antialias);
				t.renderTarget.push({
					target: a,
					clear: !0
				}), t.globalUniforms.push({
					offset: n,
					worldColor: 4294967295
				});
				let o = r.sprite;
				o.texture = a, o.worldTransform.tx = n.minX, o.worldTransform.ty = n.minY, this._activeMaskStage.push({
					filterEffect: r,
					maskedContainer: e.maskedContainer,
					filterTexture: a
				});
			} else r.sprite = e.mask.mask, this._activeMaskStage.push({
				filterEffect: r,
				maskedContainer: e.maskedContainer
			});
		} else if (e.action === "pushMaskEnd") {
			let e = this._activeMaskStage[this._activeMaskStage.length - 1];
			n && (t.type === C.WEBGL && t.renderTarget.finishRenderPass(), t.renderTarget.pop(), t.globalUniforms.pop()), t.filter.push({
				renderPipeId: "filter",
				action: "pushFilter",
				container: e.maskedContainer,
				filterEffect: e.filterEffect,
				canBundle: !1
			});
		} else if (e.action === "popMaskEnd") {
			t.filter.pop();
			let e = this._activeMaskStage.pop();
			n && S.returnTexture(e.filterTexture), this._usedEffects.push(e.filterEffect);
		}
	}
	postrender() {
		let e = this._usedEffects;
		for (let t = 0; t < e.length; t++) c.return(e[t]);
		e.length = 0;
	}
	destroy() {
		this.postrender(), this._renderer.runners.postrender.remove(this), this._renderer = null, this._activeMaskStage = null, this._usedEffects = null;
	}
};
/** @ignore */
I.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "alphaMask"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/color/ColorMaskPipe.mjs
var L = class {
	constructor(e) {
		this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = e;
	}
	buildStart() {
		this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
	}
	push(e, t, n) {
		this._renderer.renderPipes.batch.break(n);
		let r = this._colorStack;
		r[this._colorStackIndex] = r[this._colorStackIndex - 1] & e.mask;
		let i = this._colorStack[this._colorStackIndex];
		i !== this._currentColor && (this._currentColor = i, n.add({
			renderPipeId: "colorMask",
			colorMask: i,
			canBundle: !1
		})), this._colorStackIndex++;
	}
	pop(e, t, n) {
		this._renderer.renderPipes.batch.break(n);
		let r = this._colorStack;
		this._colorStackIndex--;
		let i = r[this._colorStackIndex - 1];
		i !== this._currentColor && (this._currentColor = i, n.add({
			renderPipeId: "colorMask",
			colorMask: i,
			canBundle: !1
		}));
	}
	execute(e) {
		this._renderer.colorMask.setMask(e.colorMask);
	}
	destroy() {
		this._renderer = null, this._colorStack = null;
	}
};
/** @ignore */
L.extension = {
	type: [i.WebGLPipes, i.WebGPUPipes],
	name: "colorMask"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/stencil/StencilMaskPipe.mjs
var R = class {
	constructor(e) {
		this._maskStackHash = {}, this._maskHash = /* @__PURE__ */ new WeakMap(), this._renderer = e;
	}
	push(e, t, n) {
		var r;
		let i = e, a = this._renderer;
		a.renderPipes.batch.break(n), a.renderPipes.blendMode.setBlendMode(i.mask, "none", n), n.add({
			renderPipeId: "stencilMask",
			action: "pushMaskBegin",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
		let o = i.mask;
		o.includeInBuild = !0, this._maskHash.has(i) || this._maskHash.set(i, {
			instructionsStart: 0,
			instructionsLength: 0
		});
		let s = this._maskHash.get(i);
		s.instructionsStart = n.instructionSize, o.collectRenderables(n, a, null), o.includeInBuild = !1, a.renderPipes.batch.break(n), n.add({
			renderPipeId: "stencilMask",
			action: "pushMaskEnd",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		}), s.instructionsLength = n.instructionSize - s.instructionsStart - 1;
		let c = a.renderTarget.renderTarget.uid;
		(r = this._maskStackHash)[c] ?? (r[c] = 0);
	}
	pop(e, t, n) {
		let r = e, i = this._renderer;
		i.renderPipes.batch.break(n), i.renderPipes.blendMode.setBlendMode(r.mask, "none", n), n.add({
			renderPipeId: "stencilMask",
			action: "popMaskBegin",
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
		let a = this._maskHash.get(e);
		for (let e = 0; e < a.instructionsLength; e++) n.instructions[n.instructionSize++] = n.instructions[a.instructionsStart++];
		n.add({
			renderPipeId: "stencilMask",
			action: "popMaskEnd",
			canBundle: !1
		});
	}
	execute(e) {
		var t;
		let n = this._renderer, r = n, i = n.renderTarget.renderTarget.uid, a = (t = this._maskStackHash)[i] ?? (t[i] = 0);
		e.action === "pushMaskBegin" ? (r.renderTarget.ensureDepthStencil(), r.stencil.setStencilMode(w.RENDERING_MASK_ADD, a), a++, r.colorMask.setMask(0)) : e.action === "pushMaskEnd" ? (e.inverse ? r.stencil.setStencilMode(w.INVERSE_MASK_ACTIVE, a) : r.stencil.setStencilMode(w.MASK_ACTIVE, a), r.colorMask.setMask(15)) : e.action === "popMaskBegin" ? (r.colorMask.setMask(0), a === 0 ? (r.renderTarget.clear(null, O.STENCIL), r.stencil.setStencilMode(w.DISABLED, a)) : r.stencil.setStencilMode(w.RENDERING_MASK_REMOVE, a), a--) : e.action === "popMaskEnd" && (e.inverse ? r.stencil.setStencilMode(w.INVERSE_MASK_ACTIVE, a) : r.stencil.setStencilMode(w.MASK_ACTIVE, a), r.colorMask.setMask(15)), this._maskStackHash[i] = a;
	}
	destroy() {
		this._renderer = null, this._maskStackHash = null, this._maskHash = null;
	}
};
R.extension = {
	type: [i.WebGLPipes, i.WebGPUPipes],
	name: "stencilMask"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/CustomRenderPipe.mjs
var z = class {
	constructor(e) {
		this._renderer = e;
	}
	updateRenderable() {}
	destroyRenderable() {}
	validateRenderable() {
		return !1;
	}
	addRenderable(e, t) {
		this._renderer.renderPipes.batch.break(t), t.add(e);
	}
	execute(e) {
		e.isRenderable && e.render(this._renderer);
	}
	destroy() {
		this._renderer = null;
	}
};
z.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "customRender"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/executeInstructions.mjs
function B(e, t) {
	let n = e.instructionSet, r = n.instructions;
	for (let e = 0; e < n.instructionSize; e++) {
		let n = r[e];
		t[n.renderPipeId].execute(n);
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/RenderGroupPipe.mjs
var V = class {
	constructor(e) {
		this._renderer = e;
	}
	addRenderGroup(e, t) {
		e.isCachedAsTexture ? this._addRenderableCacheAsTexture(e, t) : this._addRenderableDirect(e, t);
	}
	execute(e) {
		e.isRenderable && (e.isCachedAsTexture ? this._executeCacheAsTexture(e) : this._executeDirect(e));
	}
	destroy() {
		this._renderer = null;
	}
	_addRenderableDirect(e, t) {
		this._renderer.renderPipes.batch.break(t), e._batchableRenderGroup &&= (c.return(e._batchableRenderGroup), null), t.add(e);
	}
	_addRenderableCacheAsTexture(e, t) {
		let n = e._batchableRenderGroup ??= c.get(N);
		n.renderable = e.root, n.transform = e.root.relativeGroupTransform, n.texture = e.texture, n.bounds = e._textureBounds, t.add(e), this._renderer.renderPipes.blendMode.pushBlendMode(e, e.root.groupBlendMode, t), this._renderer.renderPipes.batch.addToBatch(n, t), this._renderer.renderPipes.blendMode.popBlendMode(t);
	}
	_executeCacheAsTexture(e) {
		if (e.textureNeedsUpdate) {
			e.textureNeedsUpdate = !1;
			let t = new m().translate(-e._textureBounds.x, -e._textureBounds.y);
			this._renderer.renderTarget.push({
				target: e.texture,
				clear: !0,
				frame: e.texture.frame
			}), this._renderer.globalUniforms.push({
				worldTransformMatrix: t,
				worldColor: 4294967295,
				offset: {
					x: 0,
					y: 0
				}
			}), B(e, this._renderer.renderPipes), this._renderer.renderTarget.finishRenderPass(), this._renderer.renderTarget.pop(), this._renderer.globalUniforms.pop();
		}
		e._batchableRenderGroup._batcher.updateElement(e._batchableRenderGroup), e._batchableRenderGroup._batcher.geometry.buffers[0].update();
	}
	_executeDirect(e) {
		this._renderer.globalUniforms.push({
			worldTransformMatrix: e.inverseParentTextureTransform,
			worldColor: e.worldColorAlpha
		}), B(e, this._renderer.renderPipes), this._renderer.globalUniforms.pop();
	}
};
V.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "renderGroup"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/sprite/SpritePipe.mjs
var H = class {
	constructor(e) {
		this._renderer = e;
	}
	addRenderable(e, t) {
		let n = this._getGpuSprite(e);
		e.didViewUpdate && this._updateBatchableSprite(e, n), this._renderer.renderPipes.batch.addToBatch(n, t);
	}
	updateRenderable(e) {
		let t = this._getGpuSprite(e);
		e.didViewUpdate && this._updateBatchableSprite(e, t), t._batcher.updateElement(t);
	}
	validateRenderable(e) {
		let t = this._getGpuSprite(e);
		return !t._batcher.checkAndUpdateTexture(t, e._texture);
	}
	_updateBatchableSprite(e, t) {
		t.bounds = e.visualBounds, t.texture = e._texture;
	}
	_getGpuSprite(e) {
		return e._gpuData[this._renderer.uid] || this._initGPUSprite(e);
	}
	_initGPUSprite(e) {
		let t = new N();
		return t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.bounds = e.visualBounds, t.roundPixels = this._renderer._roundPixels | e._roundPixels, e._gpuData[this._renderer.uid] = t, t;
	}
	destroy() {
		this._renderer = null;
	}
};
/** @ignore */
H.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "sprite"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/blendModes/BlendModePipe.mjs
var U = {};
a.handle(i.BlendMode, (e) => {
	if (!e.name) throw Error("BlendMode extension must have a name property");
	U[e.name] = e.ref;
}, (e) => {
	delete U[e.name];
});
var W = class {
	constructor(e) {
		this._blendModeStack = [], this._isAdvanced = !1, this._filterHash = /* @__PURE__ */ Object.create(null), this._renderer = e, this._renderer.runners.prerender.add(this);
	}
	prerender() {
		this._activeBlendMode = "normal", this._isAdvanced = !1;
	}
	/**
	* Push a blend mode onto the internal stack and apply it to the instruction set if needed.
	* @param renderable - The renderable or {@link RenderGroup} associated with the change.
	* @param blendMode - The blend mode to activate.
	* @param instructionSet - The instruction set being built.
	*/
	pushBlendMode(e, t, n) {
		this._blendModeStack.push(t), this.setBlendMode(e, t, n);
	}
	/**
	* Pop the last blend mode from the stack and apply the new top-of-stack mode.
	* @param instructionSet - The instruction set being built.
	*/
	popBlendMode(e) {
		this._blendModeStack.pop();
		let t = this._blendModeStack[this._activeBlendMode.length - 1] ?? "normal";
		this.setBlendMode(null, t, e);
	}
	/**
	* Ensure a blend mode switch is added to the instruction set when the mode changes.
	* If an advanced blend mode is active, subsequent renderables will be collected so they can be
	* rendered within a single filter pass.
	* @param renderable - The renderable or {@link RenderGroup} to associate with the change, or null when unwinding.
	* @param blendMode - The target blend mode.
	* @param instructionSet - The instruction set being built.
	*/
	setBlendMode(e, t, n) {
		let r = e instanceof re;
		if (this._activeBlendMode === t) {
			this._isAdvanced && e && !r && this._renderableList?.push(e);
			return;
		}
		this._isAdvanced && this._endAdvancedBlendMode(n), this._activeBlendMode = t, e && (this._isAdvanced = !!U[t], this._isAdvanced && this._beginAdvancedBlendMode(e, n));
	}
	_beginAdvancedBlendMode(e, t) {
		this._renderer.renderPipes.batch.break(t);
		let n = this._activeBlendMode;
		if (!U[n]) {
			h(`Unable to assign BlendMode: '${n}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
			return;
		}
		let r = this._ensureFilterEffect(n), i = e instanceof re, a = {
			renderPipeId: "filter",
			action: "pushFilter",
			filterEffect: r,
			renderables: i ? null : [e],
			container: i ? e.root : null,
			canBundle: !1
		};
		this._renderableList = a.renderables, t.add(a);
	}
	_ensureFilterEffect(e) {
		let t = this._filterHash[e];
		return t || (t = this._filterHash[e] = new y(), t.filters = [new U[e]()]), t;
	}
	_endAdvancedBlendMode(e) {
		this._isAdvanced = !1, this._renderableList = null, this._renderer.renderPipes.batch.break(e), e.add({
			renderPipeId: "filter",
			action: "popFilter",
			canBundle: !1
		});
	}
	/**
	* called when the instruction build process is starting this will reset internally to the default blend mode
	* @internal
	*/
	buildStart() {
		this._isAdvanced = !1;
	}
	/**
	* called when the instruction build process is finished, ensuring that if there is an advanced blend mode
	* active, we add the final render instructions added to the instruction set
	* @param instructionSet - The instruction set we are adding to
	* @internal
	*/
	buildEnd(e) {
		this._isAdvanced && this._endAdvancedBlendMode(e);
	}
	/** @internal */
	destroy() {
		this._renderer = null, this._renderableList = null;
		for (let e in this._filterHash) this._filterHash[e].destroy();
		this._filterHash = null;
	}
};
/** @ignore */
W.extension = {
	type: [
		i.WebGLPipes,
		i.WebGPUPipes,
		i.CanvasPipes
	],
	name: "blendMode"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/clearList.mjs
function G(e, t) {
	t ||= 0;
	for (let n = t; n < e.length && e[n]; n++) e[n] = null;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/updateRenderGroupTransforms.mjs
var De = new x(), Oe = 7;
function K(e, t = !1) {
	ke(e);
	let n = e.childrenToUpdate, r = e.updateTick++;
	for (let t in n) {
		let i = Number(t), a = n[t], o = a.list, s = a.index;
		for (let t = 0; t < s; t++) {
			let n = o[t];
			n.parentRenderGroup === e && n.relativeRenderGroupDepth === i && q(n, r, 0);
		}
		G(o, s), a.index = 0;
	}
	if (t) for (let n = 0; n < e.renderGroupChildren.length; n++) K(e.renderGroupChildren[n], t);
}
function ke(e) {
	let t = e.root, n;
	if (e.renderGroupParent) {
		let r = e.renderGroupParent;
		e.worldTransform.appendFrom(t.relativeGroupTransform, r.worldTransform), e.worldColor = ne(t.groupColor, r.worldColor), n = t.groupAlpha * r.worldAlpha;
	} else e.worldTransform.copyFrom(t.localTransform), e.worldColor = t.localColor, n = t.localAlpha;
	n = n < 0 ? 0 : n > 1 ? 1 : n, e.worldAlpha = n, e.worldColorAlpha = e.worldColor + ((n * 255 | 0) << 24);
}
function q(e, t, n) {
	if (t === e.updateTick) return;
	e.updateTick = t, e.didChange = !1;
	let r = e.localTransform;
	e.updateLocalTransform();
	let i = e.parent;
	if (i && !i.renderGroup ? (n |= e._updateFlags, e.relativeGroupTransform.appendFrom(r, i.relativeGroupTransform), n & Oe && Ae(e, i, n)) : (n = e._updateFlags, e.relativeGroupTransform.copyFrom(r), n & Oe && Ae(e, De, n)), !e.renderGroup) {
		let r = e.children, i = r.length;
		for (let e = 0; e < i; e++) q(r[e], t, n);
		let a = e.parentRenderGroup, o = e;
		o.renderPipeId && !a.structureDidChange && a.updateRenderable(o);
	}
}
function Ae(e, t, n) {
	if (n & 1) {
		e.groupColor = ne(e.localColor, t.groupColor);
		let n = e.localAlpha * t.groupAlpha;
		n = n < 0 ? 0 : n > 1 ? 1 : n, e.groupAlpha = n, e.groupColorAlpha = e.groupColor + ((n * 255 | 0) << 24);
	}
	n & 2 && (e.groupBlendMode = e.localBlendMode === "inherit" ? t.groupBlendMode : e.localBlendMode), n & 4 && (e.globalDisplayStatus = e.localDisplayStatus & t.globalDisplayStatus), e._updateFlags = 0;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/validateRenderables.mjs
function je(e, t) {
	let { list: n } = e.childrenRenderablesToUpdate, r = !1;
	for (let i = 0; i < e.childrenRenderablesToUpdate.index; i++) {
		let e = n[i];
		if (r = t[e.renderPipeId].validateRenderable(e), r) break;
	}
	return e.structureDidChange = r, r;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/RenderGroupSystem.mjs
var Me = new m(), J = class {
	constructor(e) {
		this._renderer = e;
	}
	render({ container: e, transform: t }) {
		let n = e.parent, r = e.renderGroup.renderGroupParent;
		e.parent = null, e.renderGroup.renderGroupParent = null;
		let i = this._renderer, a = Me;
		t && (a.copyFrom(e.renderGroup.localTransform), e.renderGroup.localTransform.copyFrom(t));
		let o = i.renderPipes;
		this._updateCachedRenderGroups(e.renderGroup, null), this._updateRenderGroups(e.renderGroup), i.globalUniforms.start({
			worldTransformMatrix: t ? e.renderGroup.localTransform : e.renderGroup.worldTransform,
			worldColor: e.renderGroup.worldColorAlpha
		}), B(e.renderGroup, o), o.uniformBatch && o.uniformBatch.renderEnd(), t && e.renderGroup.localTransform.copyFrom(a), e.parent = n, e.renderGroup.renderGroupParent = r;
	}
	destroy() {
		this._renderer = null;
	}
	_updateCachedRenderGroups(e, t) {
		if (e._parentCacheAsTextureRenderGroup = t, e.isCachedAsTexture) {
			if (!e.textureNeedsUpdate) return;
			t = e;
		}
		for (let n = e.renderGroupChildren.length - 1; n >= 0; n--) this._updateCachedRenderGroups(e.renderGroupChildren[n], t);
		if (e.invalidateMatrices(), e.isCachedAsTexture) {
			if (e.textureNeedsUpdate) {
				let t = e.root.getLocalBounds(), n = this._renderer, r = e.textureOptions.resolution || n.view.resolution, i = e.textureOptions.antialias ?? n.view.antialias, a = e.textureOptions.scaleMode ?? "linear", o = e.texture;
				t.ceil(), e.texture && S.returnTexture(e.texture, !0);
				let s = S.getOptimalTexture(t.width, t.height, r, i);
				s._source.style = new f({ scaleMode: a }), e.texture = s, e._textureBounds ||= new u(), e._textureBounds.copyFrom(t), o !== e.texture && e.renderGroupParent && (e.renderGroupParent.structureDidChange = !0);
			}
		} else e.texture &&= (S.returnTexture(e.texture, !0), null);
	}
	_updateRenderGroups(e) {
		let t = this._renderer, n = t.renderPipes;
		if (e.runOnRender(t), e.instructionSet.renderPipes = n, e.structureDidChange ? G(e.childrenRenderablesToUpdate.list, 0) : je(e, n), K(e), e.structureDidChange ? (e.structureDidChange = !1, this._buildInstructions(e, t)) : this._updateRenderables(e), e.childrenRenderablesToUpdate.index = 0, t.renderPipes.batch.upload(e.instructionSet), !e.isCachedAsTexture || e.textureNeedsUpdate) for (let t = 0; t < e.renderGroupChildren.length; t++) this._updateRenderGroups(e.renderGroupChildren[t]);
	}
	_updateRenderables(e) {
		let { list: t, index: n } = e.childrenRenderablesToUpdate;
		for (let r = 0; r < n; r++) {
			let n = t[r];
			n.didViewUpdate && e.updateRenderable(n);
		}
		G(t, n);
	}
	_buildInstructions(e, t) {
		let n = e.root, r = e.instructionSet;
		r.reset();
		let i = t.renderPipes ? t : t.batch.renderer, a = i.renderPipes;
		a.batch.buildStart(r), a.blendMode.buildStart(), a.colorMask.buildStart(), n.sortableChildren && n.sortChildren(), n.collectRenderablesWithEffects(r, i, null), a.batch.buildEnd(r), a.blendMode.buildEnd(r);
	}
};
/** @ignore */
J.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "renderGroup"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/background/BackgroundSystem.mjs
var Ne = class e {
	constructor() {
		this.clearBeforeRender = !0, this._backgroundColor = new v(0), this.color = this._backgroundColor, this.alpha = 1;
	}
	/**
	* initiates the background system
	* @param options - the options for the background colors
	*/
	init(t) {
		t = {
			...e.defaultOptions,
			...t
		}, this.clearBeforeRender = t.clearBeforeRender, this.color = t.background || t.backgroundColor || this._backgroundColor, this.alpha = t.backgroundAlpha, this._backgroundColor.setAlpha(t.backgroundAlpha);
	}
	/** The background color to fill if not transparent */
	get color() {
		return this._backgroundColor;
	}
	set color(e) {
		v.shared.setValue(e).alpha < 1 && this._backgroundColor.alpha === 1 && h("Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application."), this._backgroundColor.setValue(e);
	}
	/** The background color alpha. Setting this to 0 will make the canvas transparent. */
	get alpha() {
		return this._backgroundColor.alpha;
	}
	set alpha(e) {
		this._backgroundColor.setAlpha(e);
	}
	/** The background color as an [R, G, B, A] array. */
	get colorRgba() {
		return this._backgroundColor.toArray();
	}
	/**
	* destroys the background system
	* @internal
	*/
	destroy() {}
};
/** default options used by the system */
Ne.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "background",
	priority: 0
}, Ne.defaultOptions = {
	/**
	* {@link WebGLOptions.backgroundAlpha}
	* @default 1
	*/
	backgroundAlpha: 1,
	/**
	* {@link WebGLOptions.backgroundColor}
	* @default 0x000000
	*/
	backgroundColor: 0,
	/**
	* {@link WebGLOptions.clearBeforeRender}
	* @default true
	*/
	clearBeforeRender: !0
};
var Pe = Ne, Fe = {
	png: "image/png",
	jpg: "image/jpeg",
	webp: "image/webp"
}, Ie = class e {
	/** @param renderer - The renderer this System works for. */
	constructor(e) {
		this._renderer = e;
	}
	_normalizeOptions(e, t = {}) {
		return e instanceof x || e instanceof d ? {
			target: e,
			...t
		} : {
			...t,
			...e
		};
	}
	/**
	* Creates an IImage from a display object or texture.
	* @param options - Options for creating the image, or the target to extract
	* @returns Promise that resolves with the generated IImage
	* @example
	* ```ts
	* // Basic usage with a sprite
	* const sprite = new Sprite(texture);
	* const image = await renderer.extract.image(sprite);
	* document.body.appendChild(image);
	*
	* // Advanced usage with options
	* const image = await renderer.extract.image({
	*     target: container,
	*     format: 'webp',
	*     quality: 0.8,
	*     frame: new Rectangle(0, 0, 100, 100),
	*     resolution: 2,
	*     clearColor: '#ff0000',
	*     antialias: true
	* });
	*
	* // Extract directly from a texture
	* const texture = Texture.from('myTexture.png');
	* const image = await renderer.extract.image(texture);
	* ```
	* @see {@link ExtractImageOptions} For detailed options
	* @see {@link ExtractSystem.base64} For base64 string output
	* @see {@link ExtractSystem.canvas} For canvas output
	* @see {@link ImageLike} For the image interface
	* @category rendering
	*/
	async image(e) {
		let t = _.get().createImage();
		return t.src = await this.base64(e), t;
	}
	/**
	* Converts the target into a base64 encoded string.
	*
	* This method works by first creating
	* a canvas using `Extract.canvas` and then converting it to a base64 string.
	* @param options - The options for creating the base64 string, or the target to extract
	* @returns Promise that resolves with the base64 encoded string
	* @example
	* ```ts
	* // Basic usage with a sprite
	* const sprite = new Sprite(texture);
	* const base64 = await renderer.extract.base64(sprite);
	* console.log(base64); // data:image/png;base64,...
	*
	* // Advanced usage with options
	* const base64 = await renderer.extract.base64({
	*     target: container,
	*     format: 'webp',
	*     quality: 0.8,
	*     frame: new Rectangle(0, 0, 100, 100),
	*     resolution: 2
	* });
	* ```
	* @throws Will throw an error if the platform doesn't support any of:
	* - ICanvas.toDataURL
	* - ICanvas.toBlob
	* - ICanvas.convertToBlob
	* @see {@link ExtractImageOptions} For detailed options
	* @see {@link ExtractSystem.canvas} For canvas output
	* @see {@link ExtractSystem.image} For HTMLImage output
	* @category rendering
	*/
	async base64(t) {
		t = this._normalizeOptions(t, e.defaultImageOptions);
		let { format: n, quality: r } = t, i = this.canvas(t);
		if (i.toBlob !== void 0) return new Promise((e, t) => {
			i.toBlob((n) => {
				if (!n) {
					t(/* @__PURE__ */ Error("ICanvas.toBlob failed!"));
					return;
				}
				let r = new FileReader();
				r.onload = () => e(r.result), r.onerror = t, r.readAsDataURL(n);
			}, Fe[n], r);
		});
		if (i.toDataURL !== void 0) return i.toDataURL(Fe[n], r);
		if (i.convertToBlob !== void 0) {
			let e = await i.convertToBlob({
				type: Fe[n],
				quality: r
			});
			return new Promise((t, n) => {
				let r = new FileReader();
				r.onload = () => t(r.result), r.onerror = n, r.readAsDataURL(e);
			});
		}
		throw Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
	}
	/**
	* Creates a Canvas element, renders the target to it and returns it.
	* This method is useful for creating static images or when you need direct canvas access.
	* @param options - The options for creating the canvas, or the target to extract
	* @returns A Canvas element with the texture rendered on
	* @example
	* ```ts
	* // Basic canvas extraction from a sprite
	* const sprite = new Sprite(texture);
	* const canvas = renderer.extract.canvas(sprite);
	* document.body.appendChild(canvas);
	*
	* // Extract with custom region
	* const canvas = renderer.extract.canvas({
	*     target: container,
	*     frame: new Rectangle(0, 0, 100, 100)
	* });
	*
	* // Extract with high resolution
	* const canvas = renderer.extract.canvas({
	*     target: sprite,
	*     resolution: 2,
	*     clearColor: '#ff0000'
	* });
	*
	* // Extract directly from a texture
	* const texture = Texture.from('myTexture.png');
	* const canvas = renderer.extract.canvas(texture);
	*
	* // Extract with anti-aliasing
	* const canvas = renderer.extract.canvas({
	*     target: graphics,
	*     antialias: true
	* });
	* ```
	* @see {@link ExtractOptions} For detailed options
	* @see {@link ExtractSystem.image} For HTMLImage output
	* @see {@link ExtractSystem.pixels} For raw pixel data
	* @category rendering
	*/
	canvas(e) {
		e = this._normalizeOptions(e);
		let t = e.target, n = this._renderer;
		if (t instanceof d) return n.texture.generateCanvas(t);
		let r = n.textureGenerator.generateTexture(e), i = n.texture.generateCanvas(r);
		return r.destroy(!0), i;
	}
	/**
	* Returns a one-dimensional array containing the pixel data of the entire texture in RGBA order,
	* with integer values between 0 and 255 (inclusive).
	* > [!NOE] The returned array is a flat Uint8Array where every 4 values represent RGBA
	* @param options - The options for extracting the image, or the target to extract
	* @returns One-dimensional Uint8Array containing the pixel data in RGBA format
	* @example
	* ```ts
	* // Basic pixel extraction
	* const sprite = new Sprite(texture);
	* const pixels = renderer.extract.pixels(sprite);
	* console.log(pixels[0], pixels[1], pixels[2], pixels[3]); // R,G,B,A values
	*
	* // Extract with custom region
	* const pixels = renderer.extract.pixels({
	*     target: sprite,
	*     frame: new Rectangle(0, 0, 100, 100)
	* });
	*
	* // Extract with high resolution
	* const pixels = renderer.extract.pixels({
	*     target: sprite,
	*     resolution: 2
	* });
	* ```
	* @see {@link ExtractOptions} For detailed options
	* @see {@link ExtractSystem.canvas} For canvas output
	* @see {@link ExtractSystem.image} For image output
	* @category rendering
	*/
	pixels(e) {
		e = this._normalizeOptions(e);
		let t = e.target, n = this._renderer, r = t instanceof d ? t : n.textureGenerator.generateTexture(e), i = n.texture.getPixels(r);
		return t instanceof x && r.destroy(!0), i;
	}
	/**
	* Creates a texture from a display object or existing texture.
	*
	* This is useful for creating
	* reusable textures from rendered content or making copies of existing textures.
	* > [!NOTE] The returned texture should be destroyed when no longer needed
	* @param options - The options for creating the texture, or the target to extract
	* @returns A new texture containing the extracted content
	* @example
	* ```ts
	* // Basic texture extraction from a sprite
	* const sprite = new Sprite(texture);
	* const extractedTexture = renderer.extract.texture(sprite);
	*
	* // Extract with custom region
	* const regionTexture = renderer.extract.texture({
	*     target: container,
	*     frame: new Rectangle(0, 0, 100, 100)
	* });
	*
	* // Extract with high resolution
	* const hiResTexture = renderer.extract.texture({
	*     target: sprite,
	*     resolution: 2,
	*     clearColor: '#ff0000'
	* });
	*
	* // Create a new sprite from extracted texture
	* const newSprite = new Sprite(
	*     renderer.extract.texture({
	*         target: graphics,
	*         antialias: true
	*     })
	* );
	*
	* // Clean up when done
	* extractedTexture.destroy(true);
	* ```
	* @see {@link ExtractOptions} For detailed options
	* @see {@link Texture} For texture management
	* @see {@link GenerateTextureSystem} For texture generation
	* @category rendering
	*/
	texture(e) {
		return e = this._normalizeOptions(e), e.target instanceof d ? e.target : this._renderer.textureGenerator.generateTexture(e);
	}
	/**
	* Extracts and downloads content from the renderer as an image file.
	* This is a convenient way to save screenshots or export rendered content.
	* > [!NOTE] The download will use PNG format regardless of the filename extension
	* @param options - The options for downloading and extracting the image, or the target to extract
	* @example
	* ```ts
	* // Basic download with default filename
	* const sprite = new Sprite(texture);
	* renderer.extract.download(sprite); // Downloads as 'image.png'
	*
	* // Download with custom filename
	* renderer.extract.download({
	*     target: sprite,
	*     filename: 'screenshot.png'
	* });
	*
	* // Download with custom region
	* renderer.extract.download({
	*     target: container,
	*     filename: 'region.png',
	*     frame: new Rectangle(0, 0, 100, 100)
	* });
	*
	* // Download with high resolution and background
	* renderer.extract.download({
	*     target: stage,
	*     filename: 'hd-screenshot.png',
	*     resolution: 2,
	*     clearColor: '#ff0000'
	* });
	*
	* // Download with anti-aliasing
	* renderer.extract.download({
	*     target: graphics,
	*     filename: 'smooth.png',
	*     antialias: true
	* });
	* ```
	* @see {@link ExtractDownloadOptions} For detailed options
	* @see {@link ExtractSystem.image} For creating images without download
	* @see {@link ExtractSystem.canvas} For canvas output
	* @category rendering
	*/
	download(e) {
		e = this._normalizeOptions(e);
		let t = this.canvas(e), n = document.createElement("a");
		n.download = e.filename ?? "image.png", n.href = t.toDataURL("image/png"), document.body.appendChild(n), n.click(), document.body.removeChild(n);
	}
	/**
	* Logs the target to the console as an image. This is a useful way to debug what's happening in the renderer.
	* The image will be displayed in the browser's console using CSS background images.
	* @param options - The options for logging the image, or the target to log
	* @param options.width - The width of the logged image preview in the console (in pixels)
	* @example
	* ```ts
	* // Basic usage
	* const sprite = new Sprite(texture);
	* renderer.extract.log(sprite);
	* ```
	* @see {@link ExtractSystem.canvas} For getting raw canvas output
	* @see {@link ExtractSystem.pixels} For raw pixel data
	* @category rendering
	* @advanced
	*/
	log(e) {
		let t = e.width ?? 200;
		e = this._normalizeOptions(e);
		let n = this.canvas(e), r = n.toDataURL();
		console.log(`[Pixi Texture] ${n.width}px ${n.height}px`);
		let i = [
			"font-size: 1px;",
			`padding: ${t}px 300px;`,
			`background: url(${r}) no-repeat;`,
			"background-size: contain;"
		].join(" ");
		console.log("%c ", i);
	}
	destroy() {
		this._renderer = null;
	}
};
/**
* Default options for image extraction.
* @example
* ```ts
* // Customize default options
* ExtractSystem.defaultImageOptions.format = 'webp';
* ExtractSystem.defaultImageOptions.quality = 0.8;
*
* // Use defaults
* const image = await renderer.extract.image(sprite);
* ```
*/
Ie.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "extract"
}, Ie.defaultImageOptions = {
	format: "png",
	quality: 1
};
var Le = Ie, Re = class e extends d {
	/**
	* Creates a RenderTexture. Pass `dynamic: true` in options to allow resizing after creation.
	* @param options - Options for the RenderTexture, including width, height, textureOptions, and dynamic.
	* @returns A new RenderTexture instance.
	* @example
	* const textureOptions = { defaultAnchor: { x: 0.5, y: 0.5 } };
	* const rt = RenderTexture.create({ width: 100, height: 100, dynamic: true, textureOptions });
	* rt.resize(500, 500);
	*/
	static create(t) {
		let { dynamic: n, textureOptions: r, ...i } = t;
		return new e({
			...r,
			source: new p(i),
			dynamic: n ?? !1
		});
	}
	/**
	* Resizes the render texture.
	* @param width - The new width of the render texture.
	* @param height - The new height of the render texture.
	* @param resolution - The new resolution of the render texture.
	* @returns This texture.
	*/
	resize(e, t, n) {
		return this.source.resize(e, t, n), this;
	}
}, ze = new n(), Be = new u(), Ve = [
	0,
	0,
	0,
	0
], He = class {
	constructor(e) {
		this._renderer = e;
	}
	/**
	* Creates a texture from a display object that can be used for creating sprites and other textures.
	* This is particularly useful for optimizing performance when a complex container needs to be reused.
	* @param options - Generate texture options or a container to convert to texture
	* @returns A new RenderTexture containing the rendered display object
	* @example
	* ```ts
	* // Basic usage with a container
	* const container = new Container();
	* container.addChild(
	*     new Graphics()
	*         .circle(0, 0, 50)
	*         .fill('red')
	* );
	*
	* const texture = renderer.textureGenerator.generateTexture(container);
	*
	* // Advanced usage with options
	* const texture = renderer.textureGenerator.generateTexture({
	*     target: container,
	*     frame: new Rectangle(0, 0, 100, 100), // Specific region
	*     resolution: 2,                        // High DPI
	*     clearColor: '#ff0000',               // Red background
	*     antialias: true                      // Smooth edges
	* });
	*
	* // Create a sprite from the generated texture
	* const sprite = new Sprite(texture);
	*
	* // Clean up when done
	* texture.destroy(true);
	* ```
	* @see {@link GenerateTextureOptions} For detailed texture generation options
	* @see {@link RenderTexture} For the type of texture created
	* @category rendering
	*/
	generateTexture(e) {
		e instanceof x && (e = {
			target: e,
			frame: void 0,
			textureSourceOptions: {},
			resolution: void 0
		});
		let t = e.resolution || this._renderer.resolution, n = e.antialias || this._renderer.view.antialias, r = e.target, i = e.clearColor;
		i = i ? Array.isArray(i) && i.length === 4 ? i : v.shared.setValue(i).toArray() : Ve;
		let a = e.frame?.copyTo(ze) || ee(r, Be).rectangle, o = e.defaultAnchor && { defaultAnchor: e.defaultAnchor };
		a.width = Math.max(a.width, 1 / t) | 0, a.height = Math.max(a.height, 1 / t) | 0;
		let s = Re.create({
			...e.textureSourceOptions,
			width: a.width,
			height: a.height,
			resolution: t,
			antialias: n,
			textureOptions: o
		}), c = m.shared.translate(-a.x, -a.y);
		return this._renderer.render({
			container: r,
			transform: c,
			target: s,
			clearColor: i
		}), s.source.updateMipmaps(), s;
	}
	destroy() {
		this._renderer = null;
	}
};
/** @ignore */
He.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "textureGenerator"
};
//#endregion
//#region node_modules/pixi.js/lib/utils/data/clean.mjs
function Ue(e) {
	let t = !1;
	for (let n in e) if (e[n] == null) {
		t = !0;
		break;
	}
	if (!t) return e;
	let n = /* @__PURE__ */ Object.create(null);
	for (let t in e) {
		let r = e[t];
		r && (n[t] = r);
	}
	return n;
}
function We(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n] == null ? t++ : e[n - t] = e[n];
	return e.length -= t, e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/GCSystem.mjs
var Ge = class e {
	/**
	* Creates a new GCSystem instance.
	* @param renderer - The renderer this garbage collection system works for
	*/
	constructor(e) {
		this._managedResources = [], this._managedResourceHashes = [], this._managedCollections = [], this._ready = !1, this._renderer = e;
	}
	/**
	* Initializes the garbage collection system with the provided options.
	* @param options - Configuration options
	*/
	init(t) {
		t = {
			...e.defaultOptions,
			...t
		}, this.maxUnusedTime = t.gcMaxUnusedTime, this._frequency = t.gcFrequency, this.enabled = t.gcActive, this.now = performance.now();
	}
	/**
	* Gets whether the garbage collection system is currently enabled.
	* @returns True if GC is enabled, false otherwise
	*/
	get enabled() {
		return !!this._handler;
	}
	/**
	* Enables or disables the garbage collection system.
	* When enabled, schedules periodic cleanup of resources.
	* When disabled, cancels all scheduled cleanups.
	*/
	set enabled(e) {
		this.enabled !== e && (e ? (this._handler = this._renderer.scheduler.repeat(() => {
			this._ready = !0;
		}, this._frequency, !1), this._collectionsHandler = this._renderer.scheduler.repeat(() => {
			for (let e of this._managedCollections) {
				let { context: t, collection: n, type: r } = e;
				t[n] = r === "hash" ? Ue(t[n]) : We(t[n]);
			}
		}, this._frequency)) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._collectionsHandler), this._handler = 0, this._collectionsHandler = 0));
	}
	/**
	* Called before rendering. Updates the current timestamp.
	* @param options - The render options
	* @param options.container - The container to render
	*/
	prerender({ container: e }) {
		this.now = performance.now(), e.renderGroup.gcTick = this._renderer.tick++, this._updateInstructionGCTick(e.renderGroup, e.renderGroup.gcTick);
	}
	/** Performs garbage collection after rendering. */
	postrender() {
		this._ready && this.enabled && (this.run(), this._ready = !1);
	}
	/**
	* Updates the GC tick counter for a render group and its children.
	* @param renderGroup - The render group to update
	* @param gcTick - The new tick value
	*/
	_updateInstructionGCTick(e, t) {
		e.instructionSet.gcTick = t, e.gcTick = t;
		for (let n of e.renderGroupChildren) this._updateInstructionGCTick(n, t);
	}
	/**
	* Registers a collection for garbage collection tracking.
	* @param context - The object containing the collection
	* @param collection - The property name on context that holds the collection
	* @param type - The type of collection to track ('hash' or 'array')
	*/
	addCollection(e, t, n) {
		this._managedCollections.push({
			context: e,
			collection: t,
			type: n
		});
	}
	/**
	* Registers a resource for garbage collection tracking.
	* @param resource - The resource to track
	* @param type - The type of resource to track
	*/
	addResource(e, t) {
		if (e._gcLastUsed !== -1) {
			e._gcLastUsed = this.now, e._onTouch?.(this.now);
			return;
		}
		e._gcData = {
			index: this._managedResources.length,
			type: t
		}, e._gcLastUsed = this.now, e._onTouch?.(this.now), e.once("unload", this.removeResource, this), this._managedResources.push(e);
	}
	/**
	* Removes a resource from garbage collection tracking.
	* Call this when manually destroying a resource.
	* @param resource - The resource to stop tracking
	*/
	removeResource(e) {
		let t = e._gcData;
		if (!t) return;
		let n = t.index, r = this._managedResources.length - 1;
		if (n !== r) {
			let e = this._managedResources[r];
			this._managedResources[n] = e, e._gcData.index = n;
		}
		this._managedResources.length--, e._gcData = null, e._gcLastUsed = -1;
	}
	/**
	* Registers a hash-based resource collection for garbage collection tracking.
	* Resources in the hash will be automatically tracked and cleaned up when unused.
	* @param context - The object containing the hash property
	* @param hash - The property name on context that holds the resource hash
	* @param type - The type of resources in the hash ('resource' or 'renderable')
	* @param priority - Processing priority (lower values are processed first)
	*/
	addResourceHash(e, t, n, r = 0) {
		this._managedResourceHashes.push({
			context: e,
			hash: t,
			type: n,
			priority: r
		}), this._managedResourceHashes.sort((e, t) => e.priority - t.priority);
	}
	/**
	* Performs garbage collection by cleaning up unused resources.
	* Removes resources that haven't been used for longer than maxUnusedTime.
	*/
	run() {
		let e = performance.now(), t = this._managedResourceHashes;
		for (let n of t) this.runOnHash(n, e);
		let n = 0;
		for (let t = 0; t < this._managedResources.length; t++) {
			let r = this._managedResources[t];
			n = this.runOnResource(r, e, n);
		}
		this._managedResources.length = n;
	}
	updateRenderableGCTick(e, t) {
		let n = e.renderGroup ?? e.parentRenderGroup, r = n?.instructionSet?.gcTick ?? -1;
		(n?.gcTick ?? 0) === r && (e._gcLastUsed = t, e._onTouch?.(t));
	}
	runOnResource(e, t, n) {
		let r = e._gcData;
		return r.type === "renderable" && this.updateRenderableGCTick(e, t), t - e._gcLastUsed < this.maxUnusedTime || !e.autoGarbageCollect ? (this._managedResources[n] = e, r.index = n, n++) : (e.unload(), e._gcData = null, e._gcLastUsed = -1, e.off("unload", this.removeResource, this)), n;
	}
	/**
	* Creates a clone of the hash, copying all non-null entries up to (but not including) the stop key.
	* @param hashValue - The original hash to clone from
	* @param stopKey - The key to stop at (exclusive)
	* @returns A new hash object with copied entries
	*/
	_createHashClone(e, t) {
		let n = /* @__PURE__ */ Object.create(null);
		for (let r in e) {
			if (r === t) break;
			e[r] !== null && (n[r] = e[r]);
		}
		return n;
	}
	runOnHash(e, t) {
		let { context: n, hash: r, type: i } = e, a = n[r], o = null, s = 0;
		for (let e in a) {
			let n = a[e];
			if (n === null) {
				s++, s === 1e4 && !o && (o = this._createHashClone(a, e));
				continue;
			}
			if (n._gcLastUsed === -1) {
				n._gcLastUsed = t, n._onTouch?.(t), o && (o[e] = n);
				continue;
			}
			if (i === "renderable" && this.updateRenderableGCTick(n, t), !(t - n._gcLastUsed < this.maxUnusedTime) && n.autoGarbageCollect) {
				if (i === "renderable") {
					let e = n, t = e.renderGroup ?? e.parentRenderGroup;
					t && (t.structureDidChange = !0);
				}
				n.unload(), n._gcData = null, n._gcLastUsed = -1, o || (s + 1 === 1e4 ? o = this._createHashClone(a, e) : (a[e] = null, s++));
			} else o && (o[e] = n);
		}
		o && (n[r] = o);
	}
	/** Cleans up the garbage collection system. Disables GC and removes all tracked resources. */
	destroy() {
		this.enabled = !1, this._managedResources.forEach((e) => {
			e.off("unload", this.removeResource, this);
		}), this._managedResources.length = 0, this._managedResourceHashes.length = 0, this._managedCollections.length = 0, this._renderer = null;
	}
};
/** Default options for the GCSystem */
Ge.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "gc",
	priority: 0
}, Ge.defaultOptions = {
	/** Enable/disable the garbage collector */
	gcActive: !0,
	/** Time in ms before an unused resource is collected (default 1 minute) */
	gcMaxUnusedTime: 6e4,
	/** How often to run garbage collection in ms (default 30 seconds) */
	gcFrequency: 3e4
};
var Ke = Ge, qe = class {
	constructor(e) {
		this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = e;
	}
	reset() {
		this._stackIndex = 0;
		for (let e = 0; e < this._activeUniforms.length; e++) this._uniformsPool.push(this._activeUniforms[e]);
		for (let e = 0; e < this._activeBindGroups.length; e++) this._bindGroupPool.push(this._activeBindGroups[e]);
		this._activeUniforms.length = 0, this._activeBindGroups.length = 0;
	}
	start(e) {
		this.reset(), this.push(e);
	}
	bind({ size: t, projectionMatrix: n, worldTransformMatrix: r, worldColor: i, offset: a }) {
		let o = this._renderer.renderTarget.renderTarget, s = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : {
			projectionData: o,
			worldTransformMatrix: new m(),
			worldColor: 4294967295,
			offset: new e()
		}, c = {
			projectionMatrix: n || this._renderer.renderTarget.projectionMatrix,
			resolution: t || o.size,
			worldTransformMatrix: r || s.worldTransformMatrix,
			worldColor: i || s.worldColor,
			offset: a || s.offset,
			bindGroup: null
		}, l = this._uniformsPool.pop() || this._createUniforms();
		this._activeUniforms.push(l);
		let u = l.uniforms;
		u.uProjectionMatrix = c.projectionMatrix, u.uResolution = c.resolution, u.uWorldTransformMatrix.copyFrom(c.worldTransformMatrix), u.uWorldTransformMatrix.tx -= c.offset.x, u.uWorldTransformMatrix.ty -= c.offset.y, we(c.worldColor, u.uWorldColorAlpha, 0), l.update();
		let d;
		this._renderer.renderPipes.uniformBatch ? d = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(l, !1) : (d = this._bindGroupPool.pop() || new se(), this._activeBindGroups.push(d), d.setResource(l, 0)), c.bindGroup = d, this._currentGlobalUniformData = c;
	}
	push(e) {
		this.bind(e), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData;
	}
	pop() {
		this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === C.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update();
	}
	get bindGroup() {
		return this._currentGlobalUniformData.bindGroup;
	}
	get globalUniformData() {
		return this._currentGlobalUniformData;
	}
	get uniformGroup() {
		return this._currentGlobalUniformData.bindGroup.resources[0];
	}
	_createUniforms() {
		return new le({
			uProjectionMatrix: {
				value: new m(),
				type: "mat3x3<f32>"
			},
			uWorldTransformMatrix: {
				value: new m(),
				type: "mat3x3<f32>"
			},
			uWorldColorAlpha: {
				value: /* @__PURE__ */ new Float32Array(4),
				type: "vec4<f32>"
			},
			uResolution: {
				value: [0, 0],
				type: "vec2<f32>"
			}
		}, { isStatic: !0 });
	}
	destroy() {
		this._renderer = null, this._globalUniformDataStack.length = 0, this._uniformsPool.length = 0, this._activeUniforms.length = 0, this._bindGroupPool.length = 0, this._activeBindGroups.length = 0, this._currentGlobalUniformData = null;
	}
};
/** @ignore */
qe.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "globalUniforms"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/SchedulerSystem.mjs
var Je = 1, Y = class {
	constructor() {
		/** a small off set to apply to the repeat schedules. This is just to make sure they run at slightly different times */
		this._tasks = [], this._offset = 0;
	}
	/** Initializes the scheduler system and starts the ticker. */
	init() {
		ie.system.add(this._update, this);
	}
	/**
	* Schedules a repeating task.
	* @param func - The function to execute.
	* @param duration - The interval duration in milliseconds.
	* @param useOffset - this will spread out tasks so that they do not all run at the same time
	* @returns The unique identifier for the scheduled task.
	*/
	repeat(e, t, n = !0) {
		let r = Je++, i = 0;
		return n && (this._offset += 1e3, i = this._offset), this._tasks.push({
			func: e,
			duration: t,
			start: performance.now(),
			offset: i,
			last: performance.now(),
			repeat: !0,
			id: r
		}), r;
	}
	/**
	* Cancels a scheduled task.
	* @param id - The unique identifier of the task to cancel.
	*/
	cancel(e) {
		for (let t = 0; t < this._tasks.length; t++) if (this._tasks[t].id === e) {
			this._tasks.splice(t, 1);
			return;
		}
	}
	/**
	* Updates and executes the scheduled tasks.
	* @private
	*/
	_update() {
		let e = performance.now();
		for (let t = 0; t < this._tasks.length; t++) {
			let n = this._tasks[t];
			if (e - n.offset - n.last >= n.duration) {
				let t = e - n.start;
				n.func(t), n.last = e;
			}
		}
	}
	/**
	* Destroys the scheduler system and removes all tasks.
	* @internal
	*/
	destroy() {
		ie.system.remove(this._update, this), this._tasks.length = 0;
	}
};
/** @ignore */
Y.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "scheduler",
	priority: 0
};
//#endregion
//#region node_modules/pixi.js/lib/utils/sayHello.mjs
var Ye = !1;
function Xe(e) {
	if (!Ye) {
		if (_.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
			let t = [
				`%c  %c  %c  %c  %c PixiJS %c v${A} (${e}) http://www.pixijs.com/

`,
				"background: #E72264; padding:5px 0;",
				"background: #6CA2EA; padding:5px 0;",
				"background: #B5D33D; padding:5px 0;",
				"background: #FED23F; padding:5px 0;",
				"color: #FFFFFF; background: #E72264; padding:5px 0;",
				"color: #E72264; background: #FFFFFF; padding:5px 0;"
			];
			globalThis.console.log(...t);
		} else globalThis.console && globalThis.console.log(`PixiJS ${A} - ${e} - http://www.pixijs.com/`);
		Ye = !0;
	}
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/startup/HelloSystem.mjs
var X = class {
	constructor(e) {
		this._renderer = e;
	}
	/**
	* It all starts here! This initiates every system, passing in the options for any system by name.
	* @param options - the config for the renderer and all its systems
	*/
	init(e) {
		if (e.hello) {
			let e = this._renderer.name;
			this._renderer.type === C.WEBGL && (e += ` ${this._renderer.context.webGLVersion}`), Xe(e);
		}
	}
};
/** The default options for the system. */
X.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "hello",
	priority: -2
}, X.defaultOptions = { 
/** {@link WebGLOptions.hello} */
hello: !1 };
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/texture/RenderableGCSystem.mjs
var Ze = class e {
	/**
	* Creates a new RenderableGCSystem instance.
	* @param renderer - The renderer this garbage collection system works for
	*/
	constructor(e) {
		this._renderer = e;
	}
	/**
	* Initializes the garbage collection system with the provided options.
	* @param options - Configuration options for the renderer
	*/
	init(t) {
		t = {
			...e.defaultOptions,
			...t
		}, this.maxUnusedTime = t.renderableGCMaxUnusedTime;
	}
	/**
	* Gets whether the garbage collection system is currently enabled.
	* @returns True if GC is enabled, false otherwise
	*/
	get enabled() {
		return s("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled;
	}
	/**
	* Enables or disables the garbage collection system.
	* When enabled, schedules periodic cleanup of resources.
	* When disabled, cancels all scheduled cleanups.
	*/
	set enabled(e) {
		s("8.15.0", "RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."), this._renderer.gc.enabled = e;
	}
	/**
	* Adds a hash table to be managed by the garbage collector.
	* @param context - The object containing the hash table
	* @param hash - The property name of the hash table
	*/
	addManagedHash(e, t) {
		s("8.15.0", "RenderableGCSystem.addManagedHash is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(e, t, "hash");
	}
	/**
	* Adds an array to be managed by the garbage collector.
	* @param context - The object containing the array
	* @param hash - The property name of the array
	*/
	addManagedArray(e, t) {
		s("8.15.0", "RenderableGCSystem.addManagedArray is deprecated, please use the GCSystem.addCollection instead."), this._renderer.gc.addCollection(e, t, "array");
	}
	/**
	* Starts tracking a renderable for garbage collection.
	* @param _renderable - The renderable to track
	* @deprecated since 8.15.0
	*/
	addRenderable(e) {
		s("8.15.0", "RenderableGCSystem.addRenderable is deprecated, please use the GCSystem instead."), this._renderer.gc.addResource(e, "renderable");
	}
	/**
	* Performs garbage collection by cleaning up unused renderables.
	* Removes renderables that haven't been used for longer than maxUnusedTime.
	*/
	run() {
		s("8.15.0", "RenderableGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run();
	}
	/** Cleans up the garbage collection system. Disables GC and removes all tracked resources. */
	destroy() {
		this._renderer = null;
	}
};
/**
* Default configuration options for the garbage collection system.
* These can be overridden when initializing the renderer.
* @deprecated since 8.15.0
*/
Ze.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "renderableGC",
	priority: 0
}, Ze.defaultOptions = {
	/** Enable/disable the garbage collector */
	renderableGCActive: !0,
	/** Time in ms before an unused resource is collected (default 1 minute) */
	renderableGCMaxUnusedTime: 6e4,
	/** How often to run garbage collection in ms (default 30 seconds) */
	renderableGCFrequency: 3e4
};
var Qe = Ze, $e = class e {
	/**
	* Frame count since started.
	* @readonly
	* @deprecated since 8.15.0
	*/
	get count() {
		return this._renderer.tick;
	}
	/**
	* Frame count since last garbage collection.
	* @readonly
	* @deprecated since 8.15.0
	*/
	get checkCount() {
		return this._checkCount;
	}
	set checkCount(e) {
		s("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._checkCount = e;
	}
	/**
	* Maximum idle frames before a texture is destroyed by garbage collection.
	* @see TextureGCSystem.defaultMaxIdle
	* @deprecated since 8.15.0
	*/
	get maxIdle() {
		return this._renderer.gc.maxUnusedTime / 1e3 * 60;
	}
	set maxIdle(e) {
		s("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.maxUnusedTime = e / 60 * 1e3;
	}
	/**
	* Frames between two garbage collections.
	* @see TextureGCSystem.defaultCheckCountMax
	* @deprecated since 8.15.0
	*/
	get checkCountMax() {
		return Math.floor(this._renderer.gc._frequency / 1e3);
	}
	set checkCountMax(e) {
		s("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead.");
	}
	/**
	* Current garbage collection mode.
	* @see TextureGCSystem.defaultMode
	* @deprecated since 8.15.0
	*/
	get active() {
		return this._renderer.gc.enabled;
	}
	set active(e) {
		s("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.enabled = e;
	}
	/** @param renderer - The renderer this System works for. */
	constructor(e) {
		this._renderer = e, this._checkCount = 0;
	}
	init(t) {
		t.textureGCActive !== e.defaultOptions.textureGCActive && (this.active = t.textureGCActive), t.textureGCMaxIdle !== e.defaultOptions.textureGCMaxIdle && (this.maxIdle = t.textureGCMaxIdle), t.textureGCCheckCountMax !== e.defaultOptions.textureGCCheckCountMax && (this.checkCountMax = t.textureGCCheckCountMax);
	}
	/**
	* Checks to see when the last time a texture was used.
	* If the texture has not been used for a specified amount of time, it will be removed from the GPU.
	* @deprecated since 8.15.0
	*/
	run() {
		s("8.15.0", "TextureGCSystem.run is deprecated, please use the GCSystem instead."), this._renderer.gc.run();
	}
	destroy() {
		this._renderer = null;
	}
};
/**
* Default options for the TextureGCSystem
* @deprecated since 8.15.0
*/
$e.extension = {
	type: [i.WebGLSystem, i.WebGPUSystem],
	name: "textureGC"
}, $e.defaultOptions = {
	/**
	* If set to true, this will enable the garbage collector on the GPU.
	* @default true
	*/
	textureGCActive: !0,
	/**
	* @deprecated since 8.3.0
	* @see {@link TextureGCSystemOptions.textureGCMaxIdle}
	*/
	textureGCAMaxIdle: null,
	/**
	* The maximum idle frames before a texture is destroyed by garbage collection.
	* @default 60 * 60
	*/
	textureGCMaxIdle: 3600,
	/**
	* Frames between two garbage collections.
	* @default 600
	*/
	textureGCCheckCountMax: 600
};
var et = $e, tt = class e {
	/**
	* @param options - Options for creating a render target, or a WebGPU-flavored descriptor.
	*/
	constructor(e = {}) {
		this.uid = r("renderTarget"), this.colorAttachments = [], this.dirtyId = 0, this.isRoot = !1, this._size = /* @__PURE__ */ new Float32Array(2), this._managedColorTextures = !1, this._depth = !1, this._stencil = !1, this._colorTextures = null;
		let t = "colorAttachments" in e ? e : this._normalizeOptions(e);
		if (this.isRoot = t.isRoot ?? !1, this.label = t.label, this.colorAttachments = t.colorAttachments, this.depthStencilAttachment = t.depthStencilAttachment, this.depthStencilAttachment) {
			let e = this.depthStencilAttachment.texture.format;
			this._depth ||= e.includes("depth"), this._stencil ||= e.includes("stencil");
		}
		if (this.colorAttachments.length === 0 && !this.depthStencilAttachment) throw Error("[RenderTarget] no color textures or depth textures were provided. Provide a depthStencilTexture or set depth/stencil to true when using colorTextures: 0.");
		if (this.colorAttachments.length > 0) {
			let e = this.colorTexture;
			this.resize(e.width, e.height, e._resolution);
		}
		this.sizeSource && this.sizeSource.on("resize", this.onSourceResize, this);
	}
	_normalizeOptions(t) {
		let n = {
			...e.defaultOptions,
			...t
		}, r = [], i;
		if (typeof n.colorTextures == "number") {
			if (n.colorTextures > 0) {
				this._managedColorTextures = !0;
				for (let e = 0; e < n.colorTextures; e++) r.push({
					texture: new p({
						width: n.width,
						height: n.height,
						resolution: n.resolution,
						antialias: n.antialias
					}),
					loadOp: "clear",
					storeOp: "store"
				});
			}
		} else n.colorTextures.forEach((e) => {
			r.push({
				texture: e.source,
				loadOp: "clear",
				storeOp: "store"
			});
		});
		let a = n.depthStencilTexture === !0;
		if (this._depth = !!(n.depth || a), this._stencil = !!(n.stencil || a), n.depthStencilTexture instanceof d || n.depthStencilTexture instanceof p) {
			if (n.isRoot) throw Error("[RenderTarget] cannot attach a depth-stencil texture to the screen — the canvas owns its own depth/stencil buffers. Render to a texture target instead.");
			i = { texture: n.depthStencilTexture.source };
		} else (a && !n.isRoot || (n.stencil || n.depth) && r.length === 0) && (i = this._createDepthStencilTexture(n.width, n.height, n.resolution));
		return {
			colorAttachments: r,
			depthStencilAttachment: i,
			isRoot: n.isRoot,
			label: n.label
		};
	}
	get size() {
		let e = this._size;
		return e[0] = this.pixelWidth, e[1] = this.pixelHeight, e;
	}
	get width() {
		return this.sizeSource.width;
	}
	get height() {
		return this.sizeSource.height;
	}
	get pixelWidth() {
		return this.sizeSource.pixelWidth;
	}
	get pixelHeight() {
		return this.sizeSource.pixelHeight;
	}
	get resolution() {
		return this.sizeSource._resolution;
	}
	/**
	* An array of textures that can be written to by the GPU - mostly this has one texture in Pixi, but you could
	* write to multiple if required! (eg deferred lighting).
	* This is a backwards-compatible getter that extracts the textures from `colorAttachments`.
	*/
	get colorTextures() {
		return this._colorTextures ||= this.colorAttachments.map((e) => e.texture), this._colorTextures;
	}
	/** The stencil and depth buffer will write to this texture in WebGPU. */
	get depthStencilTexture() {
		return this.depthStencilAttachment?.texture ?? null;
	}
	/** Whether this target provides a depth buffer — requested via options or implied by its attachment's format. */
	get depth() {
		return this._depth;
	}
	/** Whether this target provides a stencil buffer — requested via options or implied by its attachment's format. */
	get stencil() {
		return this._stencil;
	}
	get colorTexture() {
		return this.colorAttachments[0]?.texture;
	}
	/**
	* The texture that drives size, resolution, and resize events.
	* For standard targets this is `colorAttachments[0].texture`;
	* for depth-only targets it is `depthStencilAttachment.texture`.
	*/
	get sizeSource() {
		return this.colorAttachments[0]?.texture ?? this.depthStencilAttachment?.texture;
	}
	onSourceResize(e) {
		this.resize(e.width, e.height, e._resolution, !0);
	}
	/**
	* This will ensure a depthStencil texture is created for this render target.
	* Most likely called by the mask system to make sure we have stencil buffer added.
	* @internal
	*/
	ensureDepthStencilTexture() {
		this._createDepthStencilTexture(this.sizeSource.width, this.sizeSource.height, this.sizeSource._resolution), this._depth = !0, this._stencil = !0;
	}
	resize(e, t, n = this.resolution, r = !1) {
		if (this.dirtyId++, this.colorAttachments.forEach((i, a) => {
			r && a === 0 || i.texture.resize(e, t, n);
		}), this.depthStencilAttachment) {
			if (r && this.colorAttachments.length === 0) return;
			this.depthStencilAttachment.texture.resize(e, t, n);
		}
	}
	destroy() {
		(this.colorAttachments || this.depthStencilAttachment) && (this.sizeSource.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorAttachments.forEach((e) => {
			e.texture.destroy();
		}), this.depthStencilAttachment && (this.depthStencilAttachment.texture.destroy(), delete this.depthStencilAttachment), this.colorAttachments = null, this._colorTextures = null);
	}
	/**
	* The single recipe for internally-created depth-stencil textures.
	* @param width
	* @param height
	* @param resolution
	*/
	_createDepthStencilTexture(e, t, n) {
		return this.depthStencilAttachment ??= { texture: new p({
			width: e,
			height: t,
			resolution: n,
			format: "depth24plus-stencil8",
			autoGenerateMipmaps: !1,
			antialias: !1,
			mipLevelCount: 1
		}) }, this.depthStencilAttachment;
	}
};
/** The default options for a render target */
tt.defaultOptions = {
	/** the width of the RenderTarget */
	width: 0,
	/** the height of the RenderTarget */
	height: 0,
	/** the resolution of the RenderTarget */
	resolution: 1,
	/** an array of textures, or a number indicating how many color textures there should be */
	colorTextures: 1,
	/** should this render target have a stencil buffer? */
	stencil: !1,
	/** should this render target have a depth buffer? */
	depth: !1,
	/** should this render target be antialiased? */
	antialias: !1,
	/** is this a root element, true if this is gl context owners render target */
	isRoot: !1
};
var Z = tt, Q = /* @__PURE__ */ new Map();
l.register(Q);
function nt(e, t) {
	if (!Q.has(e)) {
		let n = new d({ source: new b({
			resource: e,
			...t
		}) }), r = () => {
			Q.get(e) === n && Q.delete(e);
		};
		n.once("destroy", r), n.source.once("destroy", r), Q.set(e, n);
	}
	return Q.get(e);
}
function rt(e) {
	return Q.has(e);
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/view/ViewSystem.mjs
var $ = class e {
	/**
	* Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
	* This is only supported for HTMLCanvasElement and will be ignored if the canvas is an OffscreenCanvas.
	* @type {boolean}
	*/
	get autoDensity() {
		return this.texture.source.autoDensity;
	}
	set autoDensity(e) {
		this.texture.source.autoDensity = e;
	}
	/** The resolution / device pixel ratio of the renderer. */
	get resolution() {
		return this.texture.source._resolution;
	}
	set resolution(e) {
		this.texture.source.resize(this.texture.source.width, this.texture.source.height, e);
	}
	/**
	* initiates the view system
	* @param options - the options for the view
	*/
	init(r) {
		r = {
			...e.defaultOptions,
			...r
		}, r.view && (s(t, "ViewSystem.view has been renamed to ViewSystem.canvas"), r.canvas = r.view), this.screen = new n(0, 0, r.width, r.height), this.canvas = r.canvas || _.get().createCanvas(), this.antialias = !!r.antialias, this.texture = nt(this.canvas, r), this.renderTarget = new Z({
			colorTextures: [this.texture],
			depth: !!r.depth,
			isRoot: !0
		}), this.texture.source.transparent = r.backgroundAlpha < 1, this.resolution = r.resolution;
	}
	/**
	* Resizes the screen and canvas to the specified dimensions.
	* @param desiredScreenWidth - The new width of the screen.
	* @param desiredScreenHeight - The new height of the screen.
	* @param resolution
	*/
	resize(e, t, n) {
		this.texture.source.resize(e, t, n), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height;
	}
	/**
	* Destroys this System and optionally removes the canvas from the dom.
	* @param {options | false} options - The options for destroying the view, or "false".
	* @example
	* viewSystem.destroy();
	* viewSystem.destroy(true);
	* viewSystem.destroy({ removeView: true });
	*/
	destroy(e = !1) {
		(typeof e == "boolean" ? e : e?.removeView) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas), this.texture.destroy();
	}
};
/** The default options for the view system. */
$.extension = {
	type: [
		i.WebGLSystem,
		i.WebGPUSystem,
		i.CanvasSystem
	],
	name: "view",
	priority: 0
}, $.defaultOptions = {
	/**
	* {@link WebGLOptions.width}
	* @default 800
	*/
	width: 800,
	/**
	* {@link WebGLOptions.height}
	* @default 600
	*/
	height: 600,
	/**
	* {@link WebGLOptions.autoDensity}
	* @default false
	*/
	autoDensity: !1,
	/**
	* {@link WebGLOptions.antialias}
	* @default false
	*/
	antialias: !1
};
var it = $, at = [
	Pe,
	qe,
	X,
	it,
	J,
	Ke,
	et,
	He,
	Le,
	j,
	Qe,
	Y
], ot = [
	W,
	F,
	H,
	V,
	I,
	R,
	L,
	z
];
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/calculateProjection.mjs
function st(e, t, n, r, i, a) {
	let o = a ? 1 : -1;
	return e.identity(), e.a = 1 / r * 2, e.d = o * (1 / i * 2), e.tx = -1 - t * e.a, e.ty = -o - n * e.d, e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/renderTarget/isRenderingToScreen.mjs
function ct(e) {
	if (e.colorAttachments.length === 0) return !1;
	let t = e.colorTexture.resource;
	return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement && document.body.contains(t);
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/renderTarget/RenderTargetSystem.mjs
var lt = class {
	constructor(e) {
		this.rootViewPort = new n(), this.viewport = new n(), this.onRenderTargetChange = new k("onRenderTargetChange"), this.projectionMatrix = new m(), this.defaultClearColor = [
			0,
			0,
			0,
			0
		], this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null), this._renderTargetStack = [], this._bindState = {
			target: null,
			frame: void 0,
			mipLevel: 0,
			layer: 0,
			flipY: !1
		}, this._bindFrame = new n(), this._renderer = e, e.gc.addCollection(this, "_gpuRenderTargetHash", "hash");
	}
	/** the current active render surface that the render target is created from */
	get renderSurface() {
		return this._bindState.target;
	}
	/** the current mip level being rendered to (for texture subresources) */
	get mipLevel() {
		return this._bindState.mipLevel;
	}
	/** the current array layer being rendered to (for array-backed targets) */
	get layer() {
		return this._bindState.layer;
	}
	/** called when dev wants to finish a render pass */
	finishRenderPass() {
		this.adaptor.finishRenderPass(this.renderTarget);
	}
	/**
	* called when the renderer starts to render a scene: resets the bind stack and binds the
	* root render surface
	* @param options - the {@link BindOptions} for the root binding
	*/
	renderStart(e) {
		this._renderTargetStack.length = 0, this.push(e), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = ct(this.rootRenderTarget), this.adaptor.prerender?.(this.rootRenderTarget);
	}
	postrender() {
		this.adaptor.postrender?.(this.rootRenderTarget);
	}
	bind(e, t = !0, n, r, i = 0, a = 0, o) {
		let c;
		"target" in e ? c = e : (s("8.20.0", "RenderTargetSystem.bind: positional arguments are deprecated, please use an options object instead: bind({ target, clear, clearColor, frame, mipLevel, layer, flipY })"), c = {
			target: e,
			clear: t,
			clearColor: n,
			frame: r,
			mipLevel: i,
			layer: a,
			flipY: o
		});
		let l = c.target;
		t = c.clear ?? !0, n = c.clearColor, i = (c.mipLevel ?? 0) | 0, a = (c.layer ?? 0) | 0, o = c.flipY, r = c.frame;
		let u = this.getRenderTarget(l), f = this.renderTarget !== u;
		this.renderTarget = u;
		let p = this.getGpuRenderTarget(u);
		(u.pixelWidth !== p.width || u.pixelHeight !== p.height) && (this.adaptor.resizeGpuRenderTarget(u), p.width = u.pixelWidth, p.height = u.pixelHeight);
		let m = u.colorAttachments[0]?.texture || u.depthStencilAttachment?.texture, h = this.viewport, g = m.arrayLayerCount || 1;
		if (a < 0 || a >= g) throw Error(`[RenderTargetSystem] layer ${a} is out of bounds (arrayLayerCount=${g}).`);
		let _ = this._bindState;
		_.target = l, _.frame = r ? this._bindFrame.copyFrom(r) : void 0, _.mipLevel = i, _.layer = a, _.flipY = o;
		let v = Math.max(m.pixelWidth >> i, 1), y = Math.max(m.pixelHeight >> i, 1);
		if (!r && l instanceof d && (r = l.frame), r) {
			let e = m._resolution, t = 1 << Math.max(i, 0), n = r.x * e + .5 | 0, a = r.y * e + .5 | 0, o = r.width * e + .5 | 0, s = r.height * e + .5 | 0, c = Math.floor(n / t), l = Math.floor(a / t), u = Math.ceil(o / t), d = Math.ceil(s / t);
			c < 0 && (u += c, c = 0), l < 0 && (d += l, l = 0), c = Math.min(c, v - 1), l = Math.min(l, y - 1), u = Math.min(u, v - c), d = Math.min(d, y - l), u = Math.max(u, 1), d = Math.max(d, 1), h.x = c, h.y = l, h.width = u, h.height = d;
		} else h.x = 0, h.y = 0, h.width = v, h.height = y;
		return u.flipY = o, st(this.projectionMatrix, 0, 0, h.width / m.resolution, h.height / m.resolution, !u.isRoot != !!u.flipY), this.adaptor.startRenderPass(u, t, n, h, i, a), f && this.onRenderTargetChange.emit(u), u;
	}
	/**
	* Captures the current binding as a {@link BindOptions} that can be passed back to
	* {@link RenderTargetSystem.bind} to restore it. The capture replays non-destructively:
	* its `clear` is `CLEAR.NONE`, so restoring never wipes the target.
	*
	* ```js
	* const saved = renderer.renderTarget.getBindState();
	*
	* renderer.renderTarget.bind({ target: scratchTexture, clear: true });
	* // ... draw ...
	* renderer.renderTarget.bind(saved);
	*
	* // or compose: the saved binding, but into mip 1
	* renderer.renderTarget.bind({ ...saved, mipLevel: 1 });
	* ```
	*
	* The capture is a snapshot owned by the caller — later binds cannot change it — and holds
	* `target` and `frame` as they were passed, so a Texture bound without an explicit frame
	* replays through its frame fallback. It stays valid for as long as its target does.
	* Pass `out` to reuse one object across captures; every field of it is overwritten.
	* @param out - an optional object to write the bind state into; allocated when omitted
	* @returns the captured bind state (`out` when provided)
	*/
	getBindState(e) {
		if (!this.renderTarget) throw Error("[RenderTargetSystem] getBindState is only valid while a render surface is bound");
		let t = this._bindState;
		return e ??= {}, e.target = t.target, e.clear = O.NONE, e.clearColor = void 0, t.frame ? e.frame ? e.frame.copyFrom(t.frame) : e.frame = t.frame.clone() : e.frame = void 0, e.mipLevel = t.mipLevel, e.layer = t.layer, e.flipY = !!t.flipY, e;
	}
	/**
	* The effective front-face orientation of the current bind — `true` when a front-facing triangle
	* ends up wound the opposite way on the surface (so the winding/cull has been inverted to compensate).
	*
	* This is the requested `flipY` combined with the backend's inherent orientation, not the raw request:
	*
	* ```text
	* frontFaceInverted = flipY XOR (isWebGL && !isRoot)
	* ```
	*
	* WebGL's non-root FBOs carry an inherent Y-flip vs the root (the classic render-texture flip), so the
	* same requested `flipY` lands with the opposite winding depending on `isRoot`. WebGPU has no such
	* inherent flip, so there it is simply `flipY`. This is exactly the winding inversion each backend bakes
	* at bind ({@link GlStateSystem} / {@link PipelineSystem}), exposed so consumers (e.g. 3D pipelines) can
	* read the resolved orientation instead of re-deriving it from `flipY`, `isRoot`, and a backend check of
	* their own.
	*
	* It is per-bind, not per-target: `flipY` is set on every `bind`/`renderStart` while `isRoot` is fixed on
	* the target, so this recomputes from whatever the last bind resolved.
	* @returns whether the current bind's front face is inverted
	*/
	get frontFaceInverted() {
		let e = this.renderTarget;
		if (!e) return !1;
		let t = this._renderer.type === C.WEBGL && !e.isRoot;
		return !!e.flipY !== t;
	}
	clear(e, t = O.ALL, n, r = this.mipLevel, i = this.layer) {
		t && (e &&= this.getRenderTarget(e), this.adaptor.clear(e || this.renderTarget, t, n, this.viewport, r, i));
	}
	contextChange() {
		this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
	}
	push(e, t = O.ALL, n, r, i = 0, a = 0, o) {
		let c;
		"target" in e ? c = e : (s("8.20.0", "RenderTargetSystem.push: positional arguments are deprecated, please use an options object instead: push({ target, clear, clearColor, frame, mipLevel, layer, flipY })"), c = {
			target: e,
			clear: t,
			clearColor: n,
			frame: r,
			mipLevel: i,
			layer: a,
			flipY: o
		});
		let l = this.bind(c);
		return this._renderTargetStack.push({
			target: c.target,
			clear: !1,
			clearColor: void 0,
			frame: c.frame ? c.frame.clone() : void 0,
			mipLevel: c.mipLevel,
			layer: c.layer,
			flipY: c.flipY
		}), l;
	}
	/**
	* Pops the current render target and restores the previous binding.
	* @returns the render target that was restored
	*/
	pop() {
		this._renderTargetStack.pop();
		let e = this._renderTargetStack[this._renderTargetStack.length - 1];
		if (!e) throw Error("[RenderTargetSystem] pop: no previous binding to restore (unbalanced pop)");
		return this.bind(e);
	}
	/**
	* Gets the render target from the provide render surface. Eg if its a texture,
	* it will return the render target for the texture.
	* If its a render target, it will return the same render target.
	* @param renderSurface - the render surface to get the render target for
	* @returns the render target for the render surface
	*/
	getRenderTarget(e) {
		return e.isTexture && (e = e.source), this._renderSurfaceToRenderTargetHash.get(e) ?? this._initRenderTarget(e);
	}
	/**
	* Copies a render surface to another texture.
	*
	* NOTE:
	* for sourceRenderSurfaceTexture, The render target must be something that is written too by the renderer
	*
	* The following is not valid:
	* @example
	* const canvas = document.createElement('canvas')
	* canvas.width = 200;
	* canvas.height = 200;
	*
	* const ctx = canvas2.getContext('2d')!
	* ctx.fillStyle = 'red'
	* ctx.fillRect(0, 0, 200, 200);
	*
	* const texture = RenderTexture.create({
	*   width: 200,
	*   height: 200,
	* })
	* const renderTarget = renderer.renderTarget.getRenderTarget(canvas2);
	*
	* renderer.renderTarget.copyToTexture(renderTarget,texture, {x:0,y:0},{width:200,height:200},{x:0,y:0});
	*
	* The best way to copy a canvas is to create a texture from it. Then render with that.
	*
	* Parsing in a RenderTarget canvas context (with a 2d context)
	* @param sourceRenderSurface - the render surface (render target, texture, or canvas) to copy from
	* @param {Texture} destinationTexture - the texture to copy to
	* @param {object} originSrc - the origin of the copy
	* @param {number} originSrc.x - the x origin of the copy
	* @param {number} originSrc.y - the y origin of the copy
	* @param {object} size - the size of the copy
	* @param {number} size.width - the width of the copy
	* @param {number} size.height - the height of the copy
	* @param {object} originDest - the destination origin (top left to paste from!)
	* @param {number} originDest.x - the x origin of the paste
	* @param {number} originDest.y - the y origin of the paste
	*/
	copyToTexture(e, t, n, r, i) {
		let a = this.getRenderTarget(e);
		n.x < 0 && (r.width += n.x, i.x -= n.x, n.x = 0), n.y < 0 && (r.height += n.y, i.y -= n.y, n.y = 0);
		let { pixelWidth: o, pixelHeight: s } = a;
		return r.width = Math.min(r.width, o - n.x), r.height = Math.min(r.height, s - n.y), this.adaptor.copyToTexture(a, t, n, r, i);
	}
	/**
	* Copies the depth attachment from one render target to another.
	* Both source and destination must have a depthStencilAttachment.
	*
	* **Important Note:** When using the copied depth buffer in a subsequent render pass,
	* you must ensure you do not clear the depth buffer again. If you need to clear the color
	* buffer of the destination render target, use `clear: CLEAR.COLOR` to preserve the copied depth data.
	* @example
	* ```js
	* renderer.renderTarget.copyDepthTexture(
	*   sourceRT, destRT, { x: 0, y: 0 }, { width: 200, height: 200 }, { x: 0, y: 0 }
	* );
	*
	* // In the subsequent render pass, clear ONLY the color buffer!
	* renderer.render({
	*   target: destRT,
	*   container: myMesh,
	*   clear: CLEAR.COLOR, // Preserves the copied depth
	*   clearColor: [0, 0, 0, 1]
	* });
	* ```
	* @param source - the render surface (render target, depth texture, or canvas) to copy depth from
	* @param destination - the depth/stencil texture to copy depth to
	* @param {object} originSrc - the origin of the copy
	* @param {number} originSrc.x - the x origin of the copy
	* @param {number} originSrc.y - the y origin of the copy
	* @param {object} size - the size of the copy
	* @param {number} size.width - the width of the copy
	* @param {number} size.height - the height of the copy
	* @param {object} originDest - the destination origin (top left to paste from!)
	* @param {number} originDest.x - the x origin of the paste
	* @param {number} originDest.y - the y origin of the paste
	*/
	copyDepthTexture(e, t, n, r, i = {
		x: 0,
		y: 0
	}) {
		let a = this.getRenderTarget(e);
		if (!a.depthStencilAttachment) {
			h("[RenderTargetSystem] copyDepthTexture: the source render target has no depth attachment to copy from");
			return;
		}
		let o = t.source;
		if (!o.format.includes("depth") && !o.format.includes("stencil")) {
			h(`[RenderTargetSystem] copyDepthTexture: the destination texture must have a depth/stencil format (got '${o.format}')`);
			return;
		}
		let s = n.x, c = n.y, l = i.x, u = i.y, d = r.width, f = r.height;
		s < 0 && (d += s, l -= s, s = 0), c < 0 && (f += c, u -= c, c = 0), d = Math.min(d, a.pixelWidth - s), f = Math.min(f, a.pixelHeight - c), d = Math.min(d, o.pixelWidth - l), f = Math.min(f, o.pixelHeight - u), !(d <= 0 || f <= 0) && this.adaptor.copyDepthTexture(a, t, {
			x: s,
			y: c
		}, {
			width: d,
			height: f
		}, {
			x: l,
			y: u
		});
	}
	/**
	* ensures that we have a depth stencil buffer available to render to
	* This is used by the mask system to make sure we have a stencil buffer.
	*/
	ensureDepthStencil() {
		if (!this.renderTarget.stencil) {
			if (this.renderTarget.depthStencilTexture) {
				h(`[RenderTargetSystem] a stencil mask is being used, but the render target's depthStencilTexture format '${this.renderTarget.depthStencilTexture.format}' has no stencil aspect, so masking cannot work here. Use a 'depth24plus-stencil8' texture instead.`);
				return;
			}
			this.renderTarget._depth = !0, this.renderTarget._stencil = !0, this.adaptor.startRenderPass(this.renderTarget, !1, null, this.viewport, 0, this.layer);
		}
	}
	/** nukes the render target system */
	destroy() {
		this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((e, t) => {
			e !== t && this._releaseRenderTarget(t, e);
		}), this._renderSurfaceToRenderTargetHash.clear(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
	}
	_initRenderTarget(e) {
		let t = null;
		if (b.test(e) && (e = nt(e).source), e instanceof Z) t = e;
		else if (e instanceof p) {
			let n = e.format;
			t = n.includes("depth") || n.includes("stencil") ? new Z({
				colorTextures: 0,
				depthStencilTexture: e
			}) : new Z({ colorTextures: [e] }), e.source instanceof b && (t.isRoot = !0), e.once("destroy", this._onRenderSurfaceDestroy, this);
		}
		return this._renderSurfaceToRenderTargetHash.set(e, t), t;
	}
	_onRenderSurfaceDestroy(e) {
		let t = this._renderSurfaceToRenderTargetHash.get(e);
		t && this._releaseRenderTarget(e, t);
	}
	/**
	* Tears down a render target that wraps a texture source, removing every reference the
	* system holds to it so neither the system's own teardown nor the source's `destroy`
	* event can destroy it a second time.
	* @param renderSurface - the texture source the render target wraps
	* @param renderTarget - the render target to release
	*/
	_releaseRenderTarget(e, t) {
		t.destroy(), this._renderSurfaceToRenderTargetHash.delete(e), e.off("destroy", this._onRenderSurfaceDestroy, this);
		let n = this._gpuRenderTargetHash[t.uid];
		n && (this._gpuRenderTargetHash[t.uid] = null, this.adaptor.destroyGpuRenderTarget(n));
	}
	getGpuRenderTarget(e) {
		return this._gpuRenderTargetHash[e.uid] || (this._gpuRenderTargetHash[e.uid] = this.adaptor.initGpuRenderTarget(e));
	}
	resetState() {
		this.renderTarget = null, this._bindState.target = null;
	}
};
//#endregion
export { pe as $, H as A, Ce as B, J as C, q as D, K as E, L as F, ye as G, M as H, I, A as J, j as K, F as L, B as M, z as N, G as O, R as P, me as Q, N as R, Pe as S, ke as T, xe as U, Se as V, be as W, k as X, _e as Y, O as Z, We as _, at as a, Re as b, rt as c, Qe as d, E as et, X as f, Ke as g, qe as h, ot as i, V as j, W as k, Z as l, Y as m, ct as n, it as o, Xe as p, ve as q, st as r, nt as s, lt as t, et as u, Ue as v, je as w, Le as x, He as y, we as z };
