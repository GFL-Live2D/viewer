import { b as e, c as t, t as n } from "./adapter-DdgmR4Id.js";
//#region node_modules/pixi.js/lib/rendering/renderers/shared/texture/CanvasPool.mjs
var r = class {
	constructor(e) {
		this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = e || {}, this.enableFullScreen = !1;
	}
	/**
	* Creates texture with params that were specified in pool constructor.
	* @param pixelWidth - Width of texture in pixels.
	* @param pixelHeight - Height of texture in pixels.
	*/
	_createCanvasAndContext(e, t) {
		let r = n.get().createCanvas();
		return r.width = e, r.height = t, {
			canvas: r,
			context: r.getContext("2d")
		};
	}
	/**
	* Gets a Power-of-Two render texture or fullScreen texture
	* @param minWidth - The minimum width of the render texture.
	* @param minHeight - The minimum height of the render texture.
	* @param resolution - The resolution of the render texture.
	* @returns The new render texture.
	*/
	getOptimalCanvasAndContext(t, n, r = 1) {
		t = Math.ceil(t * r - 1e-6), n = Math.ceil(n * r - 1e-6), t = e(t), n = e(n);
		let i = (t << 17) + (n << 1);
		this._canvasPool[i] || (this._canvasPool[i] = []);
		let a = this._canvasPool[i].pop();
		return a ||= this._createCanvasAndContext(t, n), a;
	}
	/**
	* Place a render texture back into the pool.
	* @param canvasAndContext
	*/
	returnCanvasAndContext(e) {
		let { width: t, height: n } = e.canvas, r = (t << 17) + (n << 1);
		e.context.resetTransform(), e.context.clearRect(0, 0, t, n), this._canvasPool[r].push(e);
	}
	clear() {
		this._canvasPool = {};
	}
}, i = new r();
t.register(i);
//#endregion
export { r as n, i as t };
