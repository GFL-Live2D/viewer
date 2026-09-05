import { S as e, m as t, o as n } from "./Geometry-CASa6bwq.js";
//#region node_modules/pixi.js/lib/rendering/renderers/shared/state/State.mjs
var r = {
	normal: 0,
	add: 1,
	multiply: 2,
	screen: 3,
	overlay: 4,
	erase: 5,
	"normal-npm": 6,
	"add-npm": 7,
	"screen-npm": 8,
	min: 9,
	max: 10
}, i = {
	BLEND: 0,
	OFFSET: 1,
	CULLING: 2,
	DEPTH_TEST: 3,
	WINDING: 4,
	DEPTH_MASK: 5
}, { BLEND: a, OFFSET: o, CULLING: s, DEPTH_TEST: c, WINDING: l, DEPTH_MASK: u } = i, d = class e {
	constructor() {
		this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
	}
	/**
	* Activates blending of the computed fragment color values.
	* @default true
	*/
	get blend() {
		return !!(this.data & 1 << a);
	}
	set blend(e) {
		!!(this.data & 1 << a) !== e && (this.data ^= 1 << a);
	}
	/**
	* Activates adding an offset to depth values of polygon's fragments
	* @default false
	*/
	get offsets() {
		return !!(this.data & 1 << o);
	}
	set offsets(e) {
		!!(this.data & 1 << o) !== e && (this.data ^= 1 << o);
	}
	/** The culling settings for this state none - No culling back - Back face culling front - Front face culling */
	set cullMode(e) {
		if (e === "none") {
			this.culling = !1;
			return;
		}
		this.culling = !0, this.clockwiseFrontFace = e === "front";
	}
	get cullMode() {
		return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
	}
	/**
	* Activates culling of polygons.
	* @default false
	*/
	get culling() {
		return !!(this.data & 1 << s);
	}
	set culling(e) {
		!!(this.data & 1 << s) !== e && (this.data ^= 1 << s);
	}
	/**
	* Activates depth comparisons and updates to the depth buffer.
	* @default false
	*/
	get depthTest() {
		return !!(this.data & 1 << c);
	}
	set depthTest(e) {
		!!(this.data & 1 << c) !== e && (this.data ^= 1 << c);
	}
	/**
	* Enables or disables writing to the depth buffer.
	* @default true
	*/
	get depthMask() {
		return !!(this.data & 1 << u);
	}
	set depthMask(e) {
		!!(this.data & 1 << u) !== e && (this.data ^= 1 << u);
	}
	/**
	* Specifies whether or not front or back-facing polygons can be culled.
	* @default false
	*/
	get clockwiseFrontFace() {
		return !!(this.data & 1 << l);
	}
	set clockwiseFrontFace(e) {
		!!(this.data & 1 << l) !== e && (this.data ^= 1 << l);
	}
	/**
	* The blend mode to be applied when this state is set. Apply a value of `normal` to reset the blend mode.
	* Setting this mode to anything other than NO_BLEND will automatically switch blending on.
	* @default 'normal'
	*/
	get blendMode() {
		return this._blendMode;
	}
	set blendMode(e) {
		this.blend = e !== "none", this._blendMode = e, this._blendModeId = r[e] || 0;
	}
	/**
	* The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
	* @default 0
	*/
	get polygonOffset() {
		return this._polygonOffset;
	}
	set polygonOffset(e) {
		this.offsets = !!e, this._polygonOffset = e;
	}
	toString() {
		return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
	}
	/**
	* A quickly getting an instance of a State that is configured for 2d rendering.
	* @returns a new State with values set for 2d rendering
	*/
	static for2d() {
		let t = new e();
		return t.depthTest = !1, t.depthMask = !1, t.blend = !0, t;
	}
};
d.default2d = d.for2d();
var f = d, p = class r extends n {
	/**
	* @param options - The optional parameters of this filter.
	*/
	constructor(e) {
		e = {
			...r.defaultOptions,
			...e
		}, super(e), this.enabled = !0, this._state = f.for2d(), this.blendMode = e.blendMode, this.padding = e.padding, this.antialias = typeof e.antialias == "boolean" ? e.antialias ? "on" : "off" : e.antialias, this.resolution = e.resolution, this.blendRequired = e.blendRequired, this.clipToViewport = e.clipToViewport, this.addResource("uTexture", 0, 1), e.blendRequired && this.addResource("uBackTexture", 0, 3);
	}
	/**
	* Applies the filter
	* @param filterManager - The renderer to retrieve the filter from
	* @param input - The input render target.
	* @param output - The target to output to.
	* @param clearMode - Should the output be cleared before rendering to it
	*/
	apply(e, t, n, r) {
		e.applyFilter(this, t, n, r);
	}
	/**
	* Get the blend mode of the filter.
	* @default "normal"
	*/
	get blendMode() {
		return this._state.blendMode;
	}
	/** Sets the blend mode of the filter. */
	set blendMode(e) {
		this._state.blendMode = e;
	}
	/**
	* A short hand function to create a filter based of a vertex and fragment shader src.
	* @param options
	* @returns A shiny new PixiJS filter!
	*/
	static from(n) {
		let { gpu: i, gl: a, ...o } = n, s, c;
		return i && (s = t.from(i)), a && (c = e.from(a)), new r({
			gpuProgram: s,
			glProgram: c,
			...o
		});
	}
};
/** The default filter settings */
p.defaultOptions = {
	blendMode: "normal",
	resolution: 1,
	padding: 0,
	antialias: "off",
	blendRequired: !1,
	clipToViewport: !0
};
var m = p;
//#endregion
export { i as n, f as r, m as t };
