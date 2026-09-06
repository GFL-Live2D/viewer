import { n as e } from "./rolldown-runtime-B0aSnxlc.js";
import { C as t, F as n, I as r, O as i, S as a, a as o, f as s, i as c, k as l, l as u, r as d, t as f, u as p } from "./adapter-DdgmR4Id.js";
import { i as m, o as h, v as g } from "./Ticker-CsadseLF.js";
import { n as _, t as v } from "./canvasUtils-5xQy9vIG.js";
import { c as y } from "./Geometry-CASa6bwq.js";
import { r as b } from "./Filter-DNPtpZTY.js";
import { A as x, I as S, L as C, N as w, Y as ee, a as T, j as E, k as te, t as ne, z as D } from "./RenderTargetSystem-D6chDflO.js";
import { A as O, M as k, O as re, R as A, W as ie, a as ae, j, t as M } from "./GraphicsContext-CcEzClzH.js";
import { t as N } from "./GCManagedHash-EG4FSGJE.js";
//#region node_modules/pixi.js/lib/scene/graphics/canvas/CanvasGraphicsContextSystem.mjs
var P = class {
	constructor() {
		/**
		* Whether this context can be batched.
		* @advanced
		*/
		this.isBatchable = !1;
	}
	/**
	* Reset cached canvas data.
	* @advanced
	*/
	reset() {
		this.isBatchable = !1, this.context = null, this.graphicsData &&= (this.graphicsData.destroy(), null);
	}
	/**
	* Destroy the cached data.
	* @advanced
	*/
	destroy() {
		this.reset();
	}
}, F = class {
	constructor() {
		/**
		* Instructions for canvas rendering.
		* @advanced
		*/
		this.instructions = new d();
	}
	/**
	* Initialize render data.
	* @advanced
	*/
	init() {
		this.instructions.reset();
	}
	/**
	* Destroy render data.
	* @advanced
	*/
	destroy() {
		this.instructions.destroy(), this.instructions = null;
	}
}, I = class e {
	constructor(e) {
		this._renderer = e, this._managedContexts = new N({
			renderer: e,
			type: "resource",
			name: "graphicsContext"
		});
	}
	/**
	* Runner init called, update the default options
	* @ignore
	*/
	init(t) {
		e.defaultOptions.bezierSmoothness = t?.bezierSmoothness ?? e.defaultOptions.bezierSmoothness;
	}
	/**
	* Returns the render data for a given GraphicsContext.
	* @param context - The GraphicsContext to get the render data for.
	* @internal
	*/
	getContextRenderData(e) {
		return this.getGpuContext(e).graphicsData || this._initContextRenderData(e);
	}
	/**
	* Updates the GPU context for a given GraphicsContext.
	* @param context - The GraphicsContext to update.
	* @returns The updated CanvasGraphicsContext.
	* @internal
	*/
	updateGpuContext(e) {
		let t = e._gpuData, n = !!t[this._renderer.uid], r = t[this._renderer.uid] || this._initContext(e);
		return (e.dirty || !n) && (n && r.reset(), r.isBatchable = !1, e.dirty = !1), r;
	}
	/**
	* Returns the CanvasGraphicsContext for a given GraphicsContext.
	* If it does not exist, it will initialize a new one.
	* @param context - The GraphicsContext to get the CanvasGraphicsContext for.
	* @returns The CanvasGraphicsContext for the given GraphicsContext.
	* @internal
	*/
	getGpuContext(e) {
		return e._gpuData[this._renderer.uid] || this._initContext(e);
	}
	_initContextRenderData(e) {
		let t = new F(), n = this.getGpuContext(e);
		return n.graphicsData = t, t.init(), t;
	}
	_initContext(e) {
		let t = new P();
		return t.context = e, e._gpuData[this._renderer.uid] = t, this._managedContexts.add(e), t;
	}
	destroy() {
		this._managedContexts.destroy(), this._renderer = null;
	}
};
/** The default options for the GraphicsContextSystem. */
I.extension = {
	type: [n.CanvasSystem],
	name: "graphicsContext"
}, I.defaultOptions = { 
/**
* A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
* @default 0.5
*/
bezierSmoothness: .5 };
var L = I, R = class {
	constructor(e, t) {
		this.state = b.for2d(), this.renderer = e, this._adaptor = t, this.renderer.runners.contextChange.add(this), this._managedGraphics = new N({
			renderer: e,
			type: "renderable",
			priority: -1,
			name: "graphics"
		});
	}
	contextChange() {
		this._adaptor.contextChange(this.renderer);
	}
	validateRenderable(e) {
		return !1;
	}
	addRenderable(e, t) {
		this._managedGraphics.add(e), this.renderer.renderPipes.batch.break(t), t.add(e);
	}
	updateRenderable(e) {}
	execute(e) {
		e.isRenderable && this._adaptor.execute(this, e);
	}
	destroy() {
		this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null;
	}
};
/** @ignore */
R.extension = {
	type: [n.CanvasPipes],
	name: "graphics"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/GraphicsPipe.mjs
var z = class {
	constructor() {
		this.batches = [], this.batched = !1;
	}
	destroy() {
		this.batches.forEach((e) => {
			o.return(e);
		}), this.batches.length = 0;
	}
}, B = class {
	constructor(e, t) {
		this.state = b.for2d(), this.renderer = e, this._adaptor = t, this.renderer.runners.contextChange.add(this), this._managedGraphics = new N({
			renderer: e,
			type: "renderable",
			priority: -1,
			name: "graphics"
		});
	}
	contextChange() {
		this._adaptor.contextChange(this.renderer);
	}
	validateRenderable(e) {
		let t = e.context, n = !!e._gpuData, r = this.renderer.graphicsContext.updateGpuContext(t);
		return !!(r.isBatchable || n !== r.isBatchable);
	}
	addRenderable(e, t) {
		let n = this.renderer.graphicsContext.updateGpuContext(e.context);
		e.didViewUpdate && this._rebuild(e), n.isBatchable ? this._addToBatcher(e, t) : (this.renderer.renderPipes.batch.break(t), t.add(e));
	}
	updateRenderable(e) {
		let t = this._getGpuDataForRenderable(e).batches;
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			n._batcher.updateElement(n);
		}
	}
	execute(e) {
		if (!e.isRenderable) return;
		let t = this.renderer, n = e.context;
		if (!t.graphicsContext.getGpuContext(n).batches.length) return;
		let r = n.customShader || this._adaptor.shader;
		this.state.blendMode = e.groupBlendMode;
		let i = r.resources.localUniforms.uniforms;
		i.uTransformMatrix = e.groupTransform, i.uRound = t._roundPixels | e._roundPixels, D(e.groupColorAlpha, i.uColor, 0), this._adaptor.execute(this, e);
	}
	_rebuild(e) {
		let t = this._getGpuDataForRenderable(e), n = this.renderer.graphicsContext.updateGpuContext(e.context);
		t.destroy(), n.isBatchable && this._updateBatchesForRenderable(e, t);
	}
	_addToBatcher(e, t) {
		let n = this.renderer.renderPipes.batch, r = this._getGpuDataForRenderable(e).batches;
		for (let e = 0; e < r.length; e++) {
			let i = r[e];
			n.addToBatch(i, t);
		}
	}
	_getGpuDataForRenderable(e) {
		return e._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(e);
	}
	_initGpuDataForRenderable(e) {
		let t = new z();
		return e._gpuData[this.renderer.uid] = t, this._managedGraphics.add(e), t;
	}
	_updateBatchesForRenderable(e, t) {
		let n = e.context, r = this.renderer.graphicsContext.getGpuContext(n), i = this.renderer._roundPixels | e._roundPixels;
		t.batches = r.batches.map((t) => {
			let n = o.get(ie);
			return t.copyTo(n), n.renderable = e, n.roundPixels = i, n;
		});
	}
	destroy() {
		this._managedGraphics.destroy(), this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
	}
};
B.extension = {
	type: [n.WebGLPipes, n.WebGPUPipes],
	name: "graphics"
}, r.add(R), r.add(B), r.add(L), r.add(re);
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/Graphics.mjs
var V = class e extends h {
	/**
	* Creates a new Graphics object.
	* @param options - Options for the Graphics.
	*/
	constructor(e) {
		e instanceof M && (e = { context: e });
		let { context: t, roundPixels: n, ...r } = e || {};
		super({
			label: "Graphics",
			...r
		}), this.renderPipeId = "graphics", t ? this.context = t : (this.context = this._ownedContext = new M(), this.context.autoGarbageCollect = this.autoGarbageCollect), this.didViewUpdate = !0, this.allowChildren = !1, this.roundPixels = n ?? !1;
	}
	set context(e) {
		e !== this._context && (this._context && (this._context.off("update", this.onViewUpdate, this), this._context.off("unload", this.unload, this)), this._context = e, this._context.on("update", this.onViewUpdate, this), this._context.on("unload", this.unload, this), this.onViewUpdate());
	}
	/**
	* The underlying graphics context used for drawing operations.
	* Controls how shapes and paths are rendered.
	* @example
	* ```ts
	* // Create a shared context
	* const sharedContext = new GraphicsContext();
	*
	* // Create graphics objects sharing the same context
	* const graphics1 = new Graphics();
	* const graphics2 = new Graphics();
	*
	* // Assign shared context
	* graphics1.context = sharedContext;
	* graphics2.context = sharedContext;
	*
	* // Both graphics will show the same shapes
	* sharedContext
	*     .rect(0, 0, 100, 100)
	*     .fill({ color: 0xff0000 });
	* ```
	* @see {@link GraphicsContext} For drawing operations
	* @see {@link GraphicsOptions} For context configuration
	*/
	get context() {
		return this._context;
	}
	/**
	* The local bounds of the graphics object.
	* Returns the boundaries after all graphical operations but before any transforms.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Draw a shape
	* graphics
	*     .rect(0, 0, 100, 100)
	*     .fill({ color: 0xff0000 });
	*
	* // Get bounds information
	* const bounds = graphics.bounds;
	* console.log(bounds.width);  // 100
	* console.log(bounds.height); // 100
	* ```
	* @readonly
	* @see {@link Bounds} For bounds operations
	* @see {@link Container#getBounds} For transformed bounds
	*/
	get bounds() {
		return this._context.bounds;
	}
	/**
	* Graphics objects do not need to update their bounds as the context handles this.
	* @private
	*/
	updateBounds() {}
	/**
	* Checks if the object contains the given point.
	* Returns true if the point lies within the Graphics object's rendered area.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Draw a shape
	* graphics
	*     .rect(0, 0, 100, 100)
	*     .fill({ color: 0xff0000 });
	*
	* // Check point intersection
	* if (graphics.containsPoint({ x: 50, y: 50 })) {
	*     console.log('Point is inside rectangle!');
	* }
	* ```
	* @param point - The point to check in local coordinates
	* @returns True if the point is inside the Graphics object
	* @see {@link Graphics#bounds} For bounding box checks
	* @see {@link PointData} For point data structure
	*/
	containsPoint(e) {
		return this._context.containsPoint(e);
	}
	/**
	* Destroys this graphics renderable and optionally its context.
	* @param options - Options parameter. A boolean will act as if all options
	*
	* If the context was created by this graphics and `destroy(false)` or `destroy()` is called
	* then the context will still be destroyed.
	*
	* If you want to explicitly not destroy this context that this graphics created,
	* then you should pass destroy({ context: false })
	*
	* If the context was passed in as an argument to the constructor then it will not be destroyed
	* @example
	* ```ts
	* // Destroy the graphics and its context
	* graphics.destroy();
	* graphics.destroy(true);
	* graphics.destroy({ context: true, texture: true, textureSource: true });
	* ```
	*/
	destroy(e) {
		this._ownedContext && !e ? this._ownedContext.destroy(e) : (e === !0 || e?.context === !0) && this._context.destroy(e), this._context?.off("update", this.onViewUpdate, this), this._context?.off("unload", this.unload, this), this._ownedContext = null, this._context = null, super.destroy(e);
	}
	/**
	* @param now - The current time in milliseconds.
	* @internal
	*/
	_onTouch(e) {
		this._gcLastUsed = e, this._context._gcLastUsed = e;
	}
	_callContextMethod(e, t) {
		return this.context[e](...t), this;
	}
	/**
	* Sets the current fill style of the graphics context.
	* The fill style can be a color, gradient, pattern, or a complex style object.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Basic color fill
	* graphics
	*     .setFillStyle({ color: 0xff0000 }) // Red fill
	*     .rect(0, 0, 100, 100)
	*     .fill();
	*
	* // Gradient fill
	* const gradient = new FillGradient({
	*    end: { x: 1, y: 0 },
	*    colorStops: [
	*         { offset: 0, color: 0xff0000 }, // Red at start
	*         { offset: 0.5, color: 0x00ff00 }, // Green at middle
	*         { offset: 1, color: 0x0000ff }, // Blue at end
	*    ],
	* });
	*
	* graphics
	*     .setFillStyle(gradient)
	*     .circle(100, 100, 50)
	*     .fill();
	*
	* // Pattern fill
	* const pattern = new FillPattern(texture);
	* graphics
	*     .setFillStyle({
	*         fill: pattern,
	*         alpha: 0.5
	*     })
	*     .rect(0, 0, 200, 200)
	*     .fill();
	* ```
	* @param {FillInput} args - The fill style to apply
	* @returns The Graphics instance for chaining
	* @see {@link FillStyle} For fill style options
	* @see {@link FillGradient} For gradient fills
	* @see {@link FillPattern} For pattern fills
	*/
	setFillStyle(...e) {
		return this._callContextMethod("setFillStyle", e);
	}
	/**
	* Sets the current stroke style of the graphics context.
	* Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Basic color stroke
	* graphics
	*     .setStrokeStyle({
	*         width: 2,
	*         color: 0x000000
	*     })
	*     .rect(0, 0, 100, 100)
	*     .stroke();
	*
	* // Complex stroke style
	* graphics
	*     .setStrokeStyle({
	*         width: 4,
	*         color: 0xff0000,
	*         alpha: 0.5,
	*         join: 'round',
	*         cap: 'round',
	*         alignment: 0.5
	*     })
	*     .circle(100, 100, 50)
	*     .stroke();
	*
	* // Gradient stroke
	* const gradient = new FillGradient({
	*    end: { x: 1, y: 0 },
	*    colorStops: [
	*         { offset: 0, color: 0xff0000 }, // Red at start
	*         { offset: 0.5, color: 0x00ff00 }, // Green at middle
	*         { offset: 1, color: 0x0000ff }, // Blue at end
	*    ],
	* });
	*
	* graphics
	*     .setStrokeStyle({
	*         width: 10,
	*         fill: gradient
	*     })
	*     .poly([0,0, 100,50, 0,100])
	*     .stroke();
	* ```
	* @param {StrokeInput} args - The stroke style to apply
	* @returns The Graphics instance for chaining
	* @see {@link StrokeStyle} For stroke style options
	* @see {@link FillGradient} For gradient strokes
	* @see {@link FillPattern} For pattern strokes
	*/
	setStrokeStyle(...e) {
		return this._callContextMethod("setStrokeStyle", e);
	}
	fill(...e) {
		return this._callContextMethod("fill", e);
	}
	/**
	* Strokes the current path with the current stroke style or specified style.
	* Outlines the shape using the stroke settings.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Stroke with direct color
	* graphics
	*     .circle(50, 50, 25)
	*     .stroke({
	*         width: 2,
	*         color: 0xff0000
	*     }); // 2px red stroke
	*
	* // Fill with texture
	* graphics
	*    .rect(0, 0, 100, 100)
	*    .stroke(myTexture); // Fill with texture
	*
	* // Stroke with gradient
	* const gradient = new FillGradient({
	*     end: { x: 1, y: 0 },
	*     colorStops: [
	*         { offset: 0, color: 0xff0000 },
	*         { offset: 0.5, color: 0x00ff00 },
	*         { offset: 1, color: 0x0000ff },
	*     ],
	* });
	*
	* graphics
	*     .rect(0, 0, 100, 100)
	*     .stroke({
	*         width: 4,
	*         fill: gradient,
	*         alignment: 0.5,
	*         join: 'round'
	*     });
	* ```
	* @param {StrokeStyle} args - Optional stroke style to apply. Can be:
	* - A stroke style object with width, color, etc.
	* - A gradient
	* - A pattern
	* If omitted, uses current stroke style.
	* @returns The Graphics instance for chaining
	* @see {@link StrokeStyle} For stroke style options
	* @see {@link FillGradient} For gradient strokes
	* @see {@link setStrokeStyle} For setting default stroke style
	*/
	stroke(...e) {
		return this._callContextMethod("stroke", e);
	}
	texture(...e) {
		return this._callContextMethod("texture", e);
	}
	/**
	* Resets the current path. Any previous path and its commands are discarded and a new path is
	* started. This is typically called before beginning a new shape or series of drawing commands.
	* @example
	* ```ts
	* const graphics = new Graphics();
	* graphics
	*     .circle(150, 150, 50)
	*     .fill({ color: 0x00ff00 })
	*     .beginPath() // Starts a new path
	*     .circle(250, 150, 50)
	*     .fill({ color: 0x0000ff });
	* ```
	* @returns The Graphics instance for chaining
	* @see {@link Graphics#moveTo} For starting a new subpath
	* @see {@link Graphics#closePath} For closing the current path
	*/
	beginPath() {
		return this._callContextMethod("beginPath", []);
	}
	/**
	* Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
	* subtracting a path from the previously drawn path.
	*
	* If a hole is not completely in a shape, it will fail to cut correctly.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Draw outer circle
	* graphics
	*     .circle(100, 100, 50)
	*     .fill({ color: 0xff0000 });
	*     .circle(100, 100, 25) // Inner circle
	*     .cut() // Cuts out the inner circle from the outer circle
	* ```
	*/
	cut() {
		return this._callContextMethod("cut", []);
	}
	arc(...e) {
		return this._callContextMethod("arc", e);
	}
	arcTo(...e) {
		return this._callContextMethod("arcTo", e);
	}
	arcToSvg(...e) {
		return this._callContextMethod("arcToSvg", e);
	}
	bezierCurveTo(...e) {
		return this._callContextMethod("bezierCurveTo", e);
	}
	/**
	* Closes the current path by drawing a straight line back to the start point.
	*
	* This is useful for completing shapes and ensuring they are properly closed for fills.
	* @example
	* ```ts
	* // Create a triangle with closed path
	* const graphics = new Graphics();
	* graphics
	*     .moveTo(50, 50)
	*     .lineTo(100, 100)
	*     .lineTo(0, 100)
	*     .closePath()
	* ```
	* @returns The Graphics instance for method chaining
	* @see {@link Graphics#beginPath} For starting a new path
	* @see {@link Graphics#fill} For filling closed paths
	* @see {@link Graphics#stroke} For stroking paths
	*/
	closePath() {
		return this._callContextMethod("closePath", []);
	}
	ellipse(...e) {
		return this._callContextMethod("ellipse", e);
	}
	circle(...e) {
		return this._callContextMethod("circle", e);
	}
	path(...e) {
		return this._callContextMethod("path", e);
	}
	lineTo(...e) {
		return this._callContextMethod("lineTo", e);
	}
	moveTo(...e) {
		return this._callContextMethod("moveTo", e);
	}
	quadraticCurveTo(...e) {
		return this._callContextMethod("quadraticCurveTo", e);
	}
	rect(...e) {
		return this._callContextMethod("rect", e);
	}
	roundRect(...e) {
		return this._callContextMethod("roundRect", e);
	}
	poly(...e) {
		return this._callContextMethod("poly", e);
	}
	regularPoly(...e) {
		return this._callContextMethod("regularPoly", e);
	}
	roundPoly(...e) {
		return this._callContextMethod("roundPoly", e);
	}
	roundShape(...e) {
		return this._callContextMethod("roundShape", e);
	}
	filletRect(...e) {
		return this._callContextMethod("filletRect", e);
	}
	chamferRect(...e) {
		return this._callContextMethod("chamferRect", e);
	}
	star(...e) {
		return this._callContextMethod("star", e);
	}
	svg(...e) {
		return this._callContextMethod("svg", e);
	}
	restore(...e) {
		return this._callContextMethod("restore", e);
	}
	/**
	* Saves the current graphics state onto a stack. The state includes:
	* - Current transformation matrix
	* - Current fill style
	* - Current stroke style
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Save state before complex operations
	* graphics.save();
	*
	* // Create transformed and styled shape
	* graphics
	*     .translateTransform(100, 100)
	*     .rotateTransform(Math.PI / 4)
	*     .setFillStyle({
	*         color: 0xff0000,
	*         alpha: 0.5
	*     })
	*     .rect(-25, -25, 50, 50)
	*     .fill();
	*
	* // Restore to original state
	* graphics.restore();
	*
	* // Continue drawing with previous state
	* graphics
	*     .circle(50, 50, 25)
	*     .fill();
	* ```
	* @returns The Graphics instance for method chaining
	* @see {@link Graphics#restore} For restoring the saved state
	* @see {@link Graphics#setTransform} For setting transformations
	*/
	save() {
		return this._callContextMethod("save", []);
	}
	/**
	* Returns the current transformation matrix of the graphics context.
	* This matrix represents all accumulated transformations including translate, scale, and rotate.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Apply some transformations
	* graphics
	*     .translateTransform(100, 100)
	*     .rotateTransform(Math.PI / 4);
	*
	* // Get the current transform matrix
	* const matrix = graphics.getTransform();
	* console.log(matrix.tx, matrix.ty); // 100, 100
	*
	* // Use the matrix for other operations
	* graphics
	*     .setTransform(matrix)
	*     .circle(0, 0, 50)
	*     .fill({ color: 0xff0000 });
	* ```
	* @returns The current transformation matrix.
	* @see {@link Graphics#setTransform} For setting the transform matrix
	* @see {@link Matrix} For matrix operations
	*/
	getTransform() {
		return this.context.getTransform();
	}
	/**
	* Resets the current transformation matrix to the identity matrix, effectively removing
	* any transformations (rotation, scaling, translation) previously applied.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Apply transformations
	* graphics
	*     .translateTransform(100, 100)
	*     .scaleTransform(2, 2)
	*     .circle(0, 0, 25)
	*     .fill({ color: 0xff0000 });
	* // Reset transform to default state
	* graphics
	*     .resetTransform()
	*     .circle(50, 50, 25) // Will draw at actual coordinates
	*     .fill({ color: 0x00ff00 });
	* ```
	* @returns The Graphics instance for method chaining
	* @see {@link Graphics#getTransform} For getting the current transform
	* @see {@link Graphics#setTransform} For setting a specific transform
	* @see {@link Graphics#save} For saving the current transform state
	* @see {@link Graphics#restore} For restoring a previous transform state
	*/
	resetTransform() {
		return this._callContextMethod("resetTransform", []);
	}
	rotateTransform(...e) {
		return this._callContextMethod("rotate", e);
	}
	scaleTransform(...e) {
		return this._callContextMethod("scale", e);
	}
	setTransform(...e) {
		return this._callContextMethod("setTransform", e);
	}
	transform(...e) {
		return this._callContextMethod("transform", e);
	}
	translateTransform(...e) {
		return this._callContextMethod("translate", e);
	}
	/**
	* Clears all drawing commands from the graphics context, effectively resetting it.
	* This includes clearing the current path, fill style, stroke style, and transformations.
	*
	* > [!NOTE] Graphics objects are not designed to be continuously cleared and redrawn.
	* > Instead, they are intended to be used for static or semi-static graphics that
	* > can be redrawn as needed. Frequent clearing and redrawing may lead to performance issues.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Draw some shapes
	* graphics
	*     .circle(100, 100, 50)
	*     .fill({ color: 0xff0000 })
	*     .rect(200, 100, 100, 50)
	*     .fill({ color: 0x00ff00 });
	*
	* // Clear all graphics
	* graphics.clear();
	*
	* // Start fresh with new shapes
	* graphics
	*     .circle(150, 150, 30)
	*     .fill({ color: 0x0000ff });
	* ```
	* @returns The Graphics instance for method chaining
	* @see {@link Graphics#beginPath} For starting a new path without clearing styles
	* @see {@link Graphics#save} For saving the current state
	* @see {@link Graphics#restore} For restoring a previous state
	*/
	clear() {
		return this._callContextMethod("clear", []);
	}
	/**
	* Gets or sets the current fill style for the graphics context. The fill style determines
	* how shapes are filled when using the fill() method.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Basic color fill
	* graphics.fillStyle = {
	*     color: 0xff0000,  // Red
	*     alpha: 1
	* };
	*
	* // Using gradients
	* const gradient = new FillGradient({
	*     end: { x: 0, y: 1 }, // Vertical gradient
	*     stops: [
	*         { offset: 0, color: 0xff0000, alpha: 1 }, // Start color
	*         { offset: 1, color: 0x0000ff, alpha: 1 }  // End color
	*     ]
	* });
	*
	* graphics.fillStyle = {
	*     fill: gradient,
	*     alpha: 0.8
	* };
	*
	* // Using patterns
	* graphics.fillStyle = {
	*     texture: myTexture,
	*     alpha: 1,
	*     matrix: new Matrix()
	*         .scale(0.5, 0.5)
	*         .rotate(Math.PI / 4)
	* };
	* ```
	* @type {ConvertedFillStyle}
	* @see {@link FillStyle} For all available fill style options
	* @see {@link FillGradient} For creating gradient fills
	* @see {@link Graphics#fill} For applying the fill to paths
	*/
	get fillStyle() {
		return this._context.fillStyle;
	}
	set fillStyle(e) {
		this._context.fillStyle = e;
	}
	/**
	* Gets or sets the current stroke style for the graphics context. The stroke style determines
	* how paths are outlined when using the stroke() method.
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Basic stroke style
	* graphics.strokeStyle = {
	*     width: 2,
	*     color: 0xff0000,
	*     alpha: 1
	* };
	*
	* // Using with gradients
	* const gradient = new FillGradient({
	*   end: { x: 0, y: 1 },
	*   stops: [
	*       { offset: 0, color: 0xff0000, alpha: 1 },
	*       { offset: 1, color: 0x0000ff, alpha: 1 }
	*   ]
	* });
	*
	* graphics.strokeStyle = {
	*     width: 4,
	*     fill: gradient,
	*     alignment: 0.5,
	*     join: 'round',
	*     cap: 'round'
	* };
	*
	* // Complex stroke settings
	* graphics.strokeStyle = {
	*     width: 6,
	*     color: 0x00ff00,
	*     alpha: 0.5,
	*     join: 'miter',
	*     miterLimit: 10,
	* };
	* ```
	* @see {@link StrokeStyle} For all available stroke style options
	* @see {@link Graphics#stroke} For applying the stroke to paths
	*/
	get strokeStyle() {
		return this._context.strokeStyle;
	}
	set strokeStyle(e) {
		this._context.strokeStyle = e;
	}
	/**
	* Creates a new Graphics object that copies the current graphics content.
	* The clone can either share the same context (shallow clone) or have its own independent
	* context (deep clone).
	* @example
	* ```ts
	* const graphics = new Graphics();
	*
	* // Create original graphics content
	* graphics
	*     .circle(100, 100, 50)
	*     .fill({ color: 0xff0000 });
	*
	* // Create a shallow clone (shared context)
	* const shallowClone = graphics.clone();
	*
	* // Changes to original affect the clone
	* graphics
	*     .circle(200, 100, 30)
	*     .fill({ color: 0x00ff00 });
	*
	* // Create a deep clone (independent context)
	* const deepClone = graphics.clone(true);
	*
	* // Modify deep clone independently
	* deepClone
	*     .translateTransform(100, 100)
	*     .circle(0, 0, 40)
	*     .fill({ color: 0x0000ff });
	* ```
	* @param deep - Whether to create a deep clone of the graphics object.
	*              If false (default), the context will be shared between objects.
	*              If true, creates an independent copy of the context.
	* @returns A new Graphics instance with either shared or copied context
	* @see {@link Graphics#context} For accessing the underlying graphics context
	* @see {@link GraphicsContext} For understanding the shared context behavior
	*/
	clone(t = !1) {
		return t ? new e(this._context.clone()) : (this._ownedContext = null, new e(this._context));
	}
	/**
	* @param width
	* @param color
	* @param alpha
	* @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
	*/
	lineStyle(e, n, r) {
		a(t, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
		let i = {};
		return e && (i.width = e), n && (i.color = n), r && (i.alpha = r), this.context.strokeStyle = i, this;
	}
	/**
	* @param color
	* @param alpha
	* @deprecated since 8.0.0 Use {@link Graphics#fill} instead
	*/
	beginFill(e, n) {
		a(t, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
		let r = {};
		return e !== void 0 && (r.color = e), n !== void 0 && (r.alpha = n), this.context.fillStyle = r, this;
	}
	/**
	* @deprecated since 8.0.0 Use {@link Graphics#fill} instead
	*/
	endFill() {
		a(t, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
		let e = this.context.strokeStyle;
		return (e.width !== M.defaultStrokeStyle.width || e.color !== M.defaultStrokeStyle.color || e.alpha !== M.defaultStrokeStyle.alpha) && this.context.stroke(), this;
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#circle} instead
	*/
	drawCircle(...e) {
		return a(t, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", e);
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
	*/
	drawEllipse(...e) {
		return a(t, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", e);
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#poly} instead
	*/
	drawPolygon(...e) {
		return a(t, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", e);
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#rect} instead
	*/
	drawRect(...e) {
		return a(t, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", e);
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
	*/
	drawRoundedRect(...e) {
		return a(t, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", e);
	}
	/**
	* @param {...any} args
	* @deprecated since 8.0.0 Use {@link Graphics#star} instead
	*/
	drawStar(...e) {
		return a(t, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", e);
	}
}, H = class e {
	static _getPatternRepeat(e, t) {
		let n = e && e !== "clamp-to-edge", r = t && t !== "clamp-to-edge";
		return n && r ? "repeat" : n ? "repeat-x" : r ? "repeat-y" : "no-repeat";
	}
	start(e, t, n) {}
	execute(t, n) {
		let r = n.elements;
		if (!r || !r.length) return;
		let a = t.renderer, o = a.canvasContext, s = o.activeContext;
		for (let t = 0; t < r.length; t++) {
			let l = r[t];
			if (!l.packAsQuad) continue;
			let u = l, d = u.texture, f = d ? v.getCanvasSource(d) : null;
			if (!f) continue;
			let p = d.source.style, m = o.smoothProperty, h = p.scaleMode !== "nearest";
			s[m] !== h && (s[m] = h), o.setBlendMode(n.blendMode);
			let _ = a.globalUniforms.globalUniformData?.worldColor ?? 4294967295, y = u.color, b = (_ >>> 24 & 255) / 255, x = (y >>> 24 & 255) / 255, S = a.filter?.alphaMultiplier ?? 1, C = b * x * S;
			if (C <= 0) continue;
			s.globalAlpha = C;
			let w = _ & 16777215, ee = y & 16777215, T = g(c(ee, w)), E = d.frame, te = p.addressModeU ?? p.addressMode, ne = p.addressModeV ?? p.addressMode, D = e._getPatternRepeat(te, ne), O = d.source._resolution ?? d.source.resolution ?? 1, k = u.renderable?.renderGroup?.isCachedAsTexture, re = E.x * O, A = E.y * O, ie = E.width * O, ae = E.height * O, j = u.bounds, M = a.renderTarget.renderTarget.isRoot, N = j.minX, P = j.minY, F = j.maxX - j.minX, I = j.maxY - j.minY, L = d.rotate, R = d.uvs, z = Math.min(R.x0, R.x1, R.x2, R.x3, R.y0, R.y1, R.y2, R.y3), B = Math.max(R.x0, R.x1, R.x2, R.x3, R.y0, R.y1, R.y2, R.y3), V = D !== "no-repeat" && (z < 0 || B > 1), H = L && (!!V || T === 16777215 && !L);
			H ? (e._tempPatternMatrix.copyFrom(u.transform), i.matrixAppendRotationInv(e._tempPatternMatrix, L, N, P, F, I), o.setContextTransform(e._tempPatternMatrix, u.roundPixels === 1, void 0, k && M)) : o.setContextTransform(u.transform, u.roundPixels === 1, void 0, k && M);
			let U = F, W = I, G = H ? 0 : N, K = H ? 0 : P;
			if (!H && u.roundPixels === 1 && (G |= 0, K |= 0), V) {
				let t = f, n = T !== 16777215 && !L, r = E.width <= d.source.width && E.height <= d.source.height;
				n && r && (t = v.getTintedCanvas({ texture: d }, T));
				let i = s.createPattern(t, D);
				if (!i) continue;
				let a = U, o = W;
				if (a === 0 || o === 0) continue;
				let c = 1 / a, l = 1 / o, u = (R.x1 - R.x0) * c, p = (R.y1 - R.y0) * c, m = (R.x3 - R.x0) * l, h = (R.y3 - R.y0) * l, g = R.x0 - u * G - m * K, _ = R.y0 - p * G - h * K, y = d.source.pixelWidth, b = d.source.pixelHeight;
				e._tempPatternMatrix.set(u * y, p * b, m * y, h * b, g * y, _ * b), v.applyPatternTransform(i, e._tempPatternMatrix), s.fillStyle = i, s.fillRect(G, K, U, W);
			} else {
				let e = T !== 16777215 || L ? v.getTintedCanvas({ texture: d }, T) : f, t = e !== f;
				s.drawImage(e, t ? 0 : re, t ? 0 : A, t ? e.width : ie, t ? e.height : ae, G, K, U, W);
			}
		}
	}
};
/** @ignore */
H._tempPatternMatrix = new l(), H.extension = {
	type: [n.CanvasPipesAdaptor],
	name: "batch"
};
var U = H, W = class {
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
	execute(e) {}
	destroy() {
		this._renderer = null, this._colorStack = null;
	}
};
/** @ignore */
W.extension = {
	type: [n.CanvasPipes],
	name: "colorMask"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/mask/stencil/CanvasStencilMaskPipe.mjs
function G(e, t, n, r, i, a) {
	a = Math.max(0, Math.min(a, Math.min(r, i) / 2)), e.moveTo(t + a, n), e.lineTo(t + r - a, n), e.quadraticCurveTo(t + r, n, t + r, n + a), e.lineTo(t + r, n + i - a), e.quadraticCurveTo(t + r, n + i, t + r - a, n + i), e.lineTo(t + a, n + i), e.quadraticCurveTo(t, n + i, t, n + i - a), e.lineTo(t, n + a), e.quadraticCurveTo(t, n, t + a, n);
}
function K(e, t) {
	switch (t.type) {
		case "rectangle": {
			let n = t;
			e.rect(n.x, n.y, n.width, n.height);
			break;
		}
		case "roundedRectangle": {
			let n = t;
			G(e, n.x, n.y, n.width, n.height, n.radius);
			break;
		}
		case "circle": {
			let n = t;
			e.moveTo(n.x + n.radius, n.y), e.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
			break;
		}
		case "ellipse": {
			let n = t;
			e.ellipse ? (e.moveTo(n.x + n.halfWidth, n.y), e.ellipse(n.x, n.y, n.halfWidth, n.halfHeight, 0, 0, Math.PI * 2)) : (e.save(), e.translate(n.x, n.y), e.scale(n.halfWidth, n.halfHeight), e.moveTo(1, 0), e.arc(0, 0, 1, 0, Math.PI * 2), e.restore());
			break;
		}
		case "triangle": {
			let n = t;
			e.moveTo(n.x, n.y), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3), e.closePath();
			break;
		}
		default: {
			let n = t, r = n.points;
			if (!r?.length) break;
			e.moveTo(r[0], r[1]);
			for (let t = 2; t < r.length; t += 2) e.lineTo(r[t], r[t + 1]);
			n.closePath && e.closePath();
			break;
		}
	}
}
function oe(e, t, n) {
	let r = [], i = [], a = [];
	if (!O[t.type]?.build(t, r)) return !1;
	let o = t.closePath ?? !0;
	A(r, n, !1, o, i, a);
	for (let t = 0; t < a.length; t += 3) {
		let n = a[t] * 2, r = a[t + 1] * 2, o = a[t + 2] * 2;
		e.moveTo(i[n], i[n + 1]), e.lineTo(i[r], i[r + 1]), e.lineTo(i[o], i[o + 1]), e.closePath();
	}
	return !0;
}
function se(e, t) {
	if (!t?.length) return !1;
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (!r?.shape) continue;
		let i = r.transform, a = i && !i.isIdentity();
		a && (e.save(), e.transform(i.a, i.b, i.c, i.d, i.tx, i.ty)), K(e, r.shape), a && e.restore();
	}
	return !0;
}
var q = class {
	constructor(e) {
		this._warnedMaskTypes = /* @__PURE__ */ new Set(), this._canvasMaskStack = [], this._renderer = e;
	}
	push(e, t, n) {
		this._renderer.renderPipes.batch.break(n), n.add({
			renderPipeId: "stencilMask",
			action: "pushMaskBegin",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
	}
	pop(e, t, n) {
		this._renderer.renderPipes.batch.break(n), n.add({
			renderPipeId: "stencilMask",
			action: "popMaskEnd",
			mask: e,
			inverse: t._maskOptions.inverse,
			canBundle: !1
		});
	}
	execute(e) {
		if (e.action !== "pushMaskBegin" && e.action !== "popMaskEnd") return;
		let t = this._renderer, n = t.canvasContext, r = n?.activeContext;
		if (!r) return;
		if (e.action === "popMaskEnd") {
			this._canvasMaskStack.pop() && r.restore();
			return;
		}
		e.inverse && this._warnOnce("inverse", "CanvasRenderer: inverse masks are not supported on Canvas2D; ignoring inverse flag.");
		let i = e.mask.mask;
		if (!(i instanceof V)) {
			this._warnOnce("nonGraphics", "CanvasRenderer: only Graphics masks are supported in Canvas2D; skipping mask."), this._canvasMaskStack.push(!1);
			return;
		}
		let a = i, o = a.context?.instructions;
		if (!o?.length) {
			this._canvasMaskStack.push(!1);
			return;
		}
		r.save(), n.setContextTransform(a.groupTransform, (t._roundPixels | a._roundPixels) === 1), r.beginPath();
		let s = !1, c = !1;
		for (let e = 0; e < o.length; e++) {
			let t = o[e], n = t.action;
			if (n !== "fill" && n !== "stroke") continue;
			let i = t.data, a = i?.path?.shapePath;
			if (!a?.shapePrimitives?.length) continue;
			let l = n === "stroke", u = a.shapePrimitives;
			for (let e = 0; e < u.length; e++) {
				let t = u[e];
				if (!t?.shape) continue;
				let n = t.transform, a = n && !n.isIdentity();
				a && (r.save(), r.transform(n.a, n.b, n.c, n.d, n.tx, n.ty)), l && i.style ? s = oe(r, t.shape, i.style) || s : (K(r, t.shape), c = se(r, t.holes) || c, s = !0), a && r.restore();
			}
		}
		if (!s) {
			r.restore(), this._canvasMaskStack.push(!1);
			return;
		}
		c ? r.clip("evenodd") : r.clip(), this._canvasMaskStack.push(!0);
	}
	destroy() {
		this._renderer = null, this._warnedMaskTypes = null, this._canvasMaskStack = null;
	}
	_warnOnce(e, t) {
		this._warnedMaskTypes.has(e) || (this._warnedMaskTypes.add(e), u(t));
	}
};
q.extension = {
	type: [n.CanvasPipes],
	name: "stencilMask"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/utils/mapCanvasBlendModesToPixi.mjs
var J = "source-over";
function ce() {
	let e = _(), t = /* @__PURE__ */ Object.create(null);
	return t.inherit = J, t.none = J, t.normal = "source-over", t.add = "lighter", t.multiply = e ? "multiply" : J, t.screen = e ? "screen" : J, t.overlay = e ? "overlay" : J, t.darken = e ? "darken" : J, t.lighten = e ? "lighten" : J, t["color-dodge"] = e ? "color-dodge" : J, t["color-burn"] = e ? "color-burn" : J, t["hard-light"] = e ? "hard-light" : J, t["soft-light"] = e ? "soft-light" : J, t.difference = e ? "difference" : J, t.exclusion = e ? "exclusion" : J, t.saturation = e ? "saturation" : J, t.color = e ? "color" : J, t.luminosity = e ? "luminosity" : J, t["linear-burn"] = e ? "color-burn" : J, t["linear-dodge"] = e ? "color-dodge" : J, t["linear-light"] = e ? "hard-light" : J, t["pin-light"] = e ? "hard-light" : J, t["vivid-light"] = e ? "hard-light" : J, t["hard-mix"] = J, t.negation = e ? "difference" : J, t["normal-npm"] = t.normal, t["add-npm"] = t.add, t["screen-npm"] = t.screen, t.erase = "destination-out", t.subtract = J, t.divide = J, t.min = J, t.max = J, t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/CanvasContextSystem.mjs
var le = new l(), Y = class {
	/**
	* @param renderer - The owning CanvasRenderer.
	*/
	constructor(e) {
		this.activeResolution = 1, this.smoothProperty = "imageSmoothingEnabled", this.blendModes = ce(), this._activeBlendMode = "normal", this._projTransform = null, this._outerBlend = !1, this._warnedBlendModes = /* @__PURE__ */ new Set(), this._renderer = e;
	}
	resolutionChange(e) {
		this.activeResolution = e;
	}
	/** Initializes the root context and smoothing flag selection. */
	init() {
		let e = this._renderer.background.alpha < 1;
		if (this.rootContext = this._renderer.canvas.getContext("2d", { alpha: e }), this.activeContext = this.rootContext, this.activeResolution = this._renderer.resolution, !this.rootContext.imageSmoothingEnabled) {
			let e = this.rootContext;
			e.webkitImageSmoothingEnabled ? this.smoothProperty = "webkitImageSmoothingEnabled" : e.mozImageSmoothingEnabled ? this.smoothProperty = "mozImageSmoothingEnabled" : e.oImageSmoothingEnabled ? this.smoothProperty = "oImageSmoothingEnabled" : e.msImageSmoothingEnabled && (this.smoothProperty = "msImageSmoothingEnabled");
		}
	}
	/**
	* Sets the current transform on the active context.
	* @param transform - Transform to apply.
	* @param roundPixels - Whether to round translation to integers.
	* @param localResolution - Optional local resolution multiplier.
	* @param skipGlobalTransform - If true, skip applying the global world transform matrix.
	*/
	setContextTransform(e, t, n, r) {
		let i = r ? l.IDENTITY : this._renderer.globalUniforms.globalUniformData?.worldTransformMatrix || l.IDENTITY, a = le;
		a.copyFrom(i), a.append(e);
		let o = this._projTransform, s = this.activeResolution;
		if (n ||= s, o) {
			let e = l.shared;
			e.copyFrom(a), e.prepend(o), a = e;
		}
		t ? this.activeContext.setTransform(a.a * n, a.b * n, a.c * n, a.d * n, a.tx * s | 0, a.ty * s | 0) : this.activeContext.setTransform(a.a * n, a.b * n, a.c * n, a.d * n, a.tx * s, a.ty * s);
	}
	/**
	* Clears the current render target, optionally filling with a color.
	* @param clearColor - Color to fill after clearing.
	* @param alpha - Alpha override for the clear color.
	*/
	clear(e, t) {
		let n = this.activeContext, r = this._renderer;
		if (n.clearRect(0, 0, r.width, r.height), e) {
			let i = p.shared.setValue(e);
			n.globalAlpha = t ?? i.alpha, n.fillStyle = i.toHex(), n.fillRect(0, 0, r.width, r.height), n.globalAlpha = 1;
		}
	}
	/**
	* Sets the active blend mode.
	* @param blendMode - Pixi blend mode.
	*/
	setBlendMode(e) {
		if (this._activeBlendMode === e) return;
		this._activeBlendMode = e, this._outerBlend = !1;
		let t = this.blendModes[e];
		if (!t) {
			this._warnedBlendModes.has(e) || (console.warn(`CanvasRenderer: blend mode "${e}" is not supported in Canvas2D; falling back to "source-over".`), this._warnedBlendModes.add(e)), this.activeContext.globalCompositeOperation = "source-over";
			return;
		}
		this.activeContext.globalCompositeOperation = t;
	}
	/** Releases context references. */
	destroy() {
		this.rootContext = null, this.activeContext = null, this._warnedBlendModes.clear();
	}
};
/** @ignore */
Y.extension = {
	type: [n.CanvasSystem],
	name: "canvasContext"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/CanvasLimitsSystem.mjs
var X = class {
	constructor() {
		this.maxTextures = 16, this.maxBatchableTextures = 16, this.maxUniformBindings = 0;
	}
	init() {}
};
/** @ignore */
X.extension = {
	type: [n.CanvasSystem],
	name: "limits"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/canvas/CanvasGraphicsAdaptor.mjs
var ue = "#808080", Z = new l(), de = new l(), fe = new l(), Q = new l(), pe = new l();
function me(e, t, n) {
	e.beginPath();
	for (let r = 0; r < n.length; r += 3) {
		let i = n[r] * 2, a = n[r + 1] * 2, o = n[r + 2] * 2;
		e.moveTo(t[i], t[i + 1]), e.lineTo(t[a], t[a + 1]), e.lineTo(t[o], t[o + 1]), e.closePath();
	}
	e.fill();
}
function he(e) {
	return `#${(e & 16777215).toString(16).padStart(6, "0")}`;
}
function ge(e, t, n, r, i, a) {
	a = Math.max(0, Math.min(a, Math.min(r, i) / 2)), e.moveTo(t + a, n), e.lineTo(t + r - a, n), e.quadraticCurveTo(t + r, n, t + r, n + a), e.lineTo(t + r, n + i - a), e.quadraticCurveTo(t + r, n + i, t + r - a, n + i), e.lineTo(t + a, n + i), e.quadraticCurveTo(t, n + i, t, n + i - a), e.lineTo(t, n + a), e.quadraticCurveTo(t, n, t + a, n);
}
function $(e, t) {
	switch (t.type) {
		case "rectangle": {
			let n = t;
			e.rect(n.x, n.y, n.width, n.height);
			break;
		}
		case "roundedRectangle": {
			let n = t;
			ge(e, n.x, n.y, n.width, n.height, n.radius);
			break;
		}
		case "circle": {
			let n = t;
			e.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
			break;
		}
		case "ellipse": {
			let n = t;
			e.ellipse ? e.ellipse(n.x, n.y, n.halfWidth, n.halfHeight, 0, 0, Math.PI * 2) : (e.save(), e.translate(n.x, n.y), e.scale(n.halfWidth, n.halfHeight), e.arc(0, 0, 1, 0, Math.PI * 2), e.restore());
			break;
		}
		case "triangle": {
			let n = t;
			e.moveTo(n.x, n.y), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3), e.closePath();
			break;
		}
		default: {
			let n = t, r = n.points;
			if (!r?.length) break;
			e.moveTo(r[0], r[1]);
			for (let t = 2; t < r.length; t += 2) e.lineTo(r[t], r[t + 1]);
			n.closePath && e.closePath();
			break;
		}
	}
}
function _e(e, t) {
	if (!t?.length) return !1;
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (!r?.shape) continue;
		let i = r.transform, a = i && !i.isIdentity();
		a && (e.save(), e.transform(i.a, i.b, i.c, i.d, i.tx, i.ty)), $(e, r.shape), a && e.restore();
	}
	return !0;
}
function ve(e, t, n, r) {
	let i = e.fill;
	if (i instanceof k) {
		i.buildGradient();
		let a = i.texture;
		if (a) {
			let o = v.getTintedPattern(a, t), s = n ? Q.copyFrom(n).scale(a.source.pixelWidth, a.source.pixelHeight) : Q.copyFrom(i.transform);
			return r && !e.textureSpace && s.append(r), v.applyPatternTransform(o, s), o;
		}
	}
	if (i instanceof ae) {
		let e = v.getTintedPattern(i.texture, t);
		return v.applyPatternTransform(e, i.transform, !1), e;
	}
	let a = e.texture;
	if (a && a !== s.WHITE) {
		if (!a.source.resource) return ue;
		let r = v.getTintedPattern(a, t), i = e.matrix;
		if (n) {
			let { resolution: e } = a.source;
			if (i = Q.copyFrom(n), a.rotate) {
				let { uvs: t, orig: n } = a;
				i.prepend(pe.set(t.x1 - t.x0, t.y1 - t.y0, t.x3 - t.x0, t.y3 - t.y0, t.x0, t.y0).invert()).scale(n.width * e, n.height * e);
			} else i.scale(a.source.pixelWidth, a.source.pixelHeight).translate(-a.frame.x * e, -a.frame.y * e);
		}
		return v.applyPatternTransform(r, i), r;
	}
	return he(t);
}
var ye = class {
	constructor() {
		this.shader = null;
	}
	contextChange(e) {}
	execute(e, t) {
		let n = e.renderer, r = n.canvasContext, a = r.activeContext, o = t.groupTransform, l = n.globalUniforms.globalUniformData?.worldColor ?? 4294967295, u = t.groupColorAlpha, d = (l >>> 24 & 255) / 255, f = (u >>> 24 & 255) / 255, p = n.filter?.alphaMultiplier ?? 1, m = d * f * p;
		if (m <= 0) return;
		let h = l & 16777215, _ = u & 16777215, y = g(c(_, h)), b = n._roundPixels | t._roundPixels;
		a.save(), r.setContextTransform(o, b === 1), r.setBlendMode(t.groupBlendMode);
		let x = t.context.instructions;
		for (let e = 0; e < x.length; e++) {
			let t = x[e];
			if (t.action === "texture") {
				let e = t.data, n = e.image, s = n ? v.getCanvasSource(n) : null;
				if (!s) continue;
				let l = e.alpha * m;
				if (l <= 0) continue;
				let u = c(e.style, y);
				a.globalAlpha = l;
				let d = s;
				u !== 16777215 && (d = v.getTintedCanvas({ texture: n }, u));
				let f = n.frame, p = n.source._resolution ?? n.source.resolution ?? 1, h = f.x * p, g = f.y * p, _ = f.width * p, x = f.height * p;
				d !== s && (h = 0, g = 0);
				let S = e.transform, C = S && !S.isIdentity(), w = n.rotate;
				C || w ? (Z.copyFrom(o), C && Z.append(S), w && i.matrixAppendRotationInv(Z, w, e.dx, e.dy, e.dw, e.dh), r.setContextTransform(Z, b === 1)) : r.setContextTransform(o, b === 1), a.drawImage(d, h, g, d === s ? _ : d.width, d === s ? x : d.height, w ? 0 : e.dx, w ? 0 : e.dy, e.dw, e.dh), (C || w) && r.setContextTransform(o, b === 1);
				continue;
			}
			let n = t.data, l = n?.path?.shapePath;
			if (!l?.shapePrimitives?.length) continue;
			let u = n.style, d = c(u.color, y), f = u.alpha * m;
			if (f <= 0) continue;
			let p = t.action === "stroke";
			if (a.globalAlpha = f, p) {
				let e = u;
				a.lineWidth = e.width, a.lineCap = e.cap, a.lineJoin = e.join, a.miterLimit = e.miterLimit;
			}
			let h = l.shapePrimitives;
			if (!p && n.hole?.shapePath?.shapePrimitives?.length) {
				let e = h[h.length - 1];
				e.holes = n.hole.shapePath.shapePrimitives;
			}
			for (let e = 0; e < h.length; e++) {
				let t = h[e];
				if (!t?.shape) continue;
				let n = t.transform, r = n && !n.isIdentity(), i = u.texture && u.texture !== s.WHITE, c = u.textureSpace === "global" ? n : null, l = ve(u, d, i ? j(de, u, t.shape, c) : null, r ? fe.copyFrom(o).append(n) : o);
				if (r && (a.save(), a.transform(n.a, n.b, n.c, n.d, n.tx, n.ty)), p) {
					let e = u;
					if (e.alignment !== .5 && !e.pixelLine) {
						let n = [], r = [], i = [];
						if (O[t.shape.type]?.build(t.shape, n)) {
							let o = t.shape.closePath ?? !0;
							A(n, e, !1, o, r, i), a.fillStyle = l, me(a, r, i);
						} else a.strokeStyle = l, a.beginPath(), $(a, t.shape), a.stroke();
					} else a.strokeStyle = l, a.beginPath(), $(a, t.shape), a.stroke();
				} else a.fillStyle = l, a.beginPath(), $(a, t.shape), _e(a, t.holes) ? a.fill("evenodd") : a.fill();
				r && a.restore();
			}
		}
		a.restore();
	}
	destroy() {
		this.shader = null;
	}
};
/** @ignore */
ye.extension = {
	type: [n.CanvasPipesAdaptor],
	name: "graphics"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/renderTarget/CanvasRenderTargetAdaptor.mjs
var be = class {
	/**
	* Initializes the adaptor.
	* @param renderer - Canvas renderer instance.
	* @param renderTargetSystem - The render target system.
	* @advanced
	*/
	init(e, t) {
		this._renderer = e, this._renderTargetSystem = t;
	}
	/**
	* Creates a GPU render target for canvas.
	* @param renderTarget - Render target to initialize.
	* @advanced
	*/
	initGpuRenderTarget(e) {
		let t = e.colorTexture, { canvas: n, context: r } = this._ensureCanvas(t);
		return {
			canvas: n,
			context: r,
			width: n.width,
			height: n.height
		};
	}
	/**
	* Resizes the backing canvas for a render target.
	* @param renderTarget - Render target to resize.
	* @advanced
	*/
	resizeGpuRenderTarget(e) {
		let t = e.colorTexture, { canvas: n } = this._ensureCanvas(t);
		n.width = e.pixelWidth, n.height = e.pixelHeight;
	}
	/**
	* Starts a render pass on the canvas target.
	* @param renderTarget - Target to render to.
	* @param clear - Clear mode.
	* @param clearColor - Optional clear color.
	* @param viewport - Optional viewport.
	* @advanced
	*/
	startRenderPass(e, t, n, r) {
		let i = this._renderTargetSystem.getGpuRenderTarget(e);
		this._renderer.canvasContext.activeContext = i.context, this._renderer.canvasContext.activeResolution = e.resolution, t && this.clear(e, t, n, r);
	}
	/**
	* Clears the render target.
	* @param renderTarget - Target to clear.
	* @param _clear - Clear mode (unused).
	* @param clearColor - Optional clear color.
	* @param viewport - Optional viewport rectangle.
	* @advanced
	*/
	clear(e, t, n, r) {
		let i = this._renderTargetSystem.getGpuRenderTarget(e).context, a = r || {
			x: 0,
			y: 0,
			width: e.pixelWidth,
			height: e.pixelHeight
		};
		if (i.setTransform(1, 0, 0, 1, 0, 0), i.clearRect(a.x, a.y, a.width, a.height), n) {
			let e = p.shared.setValue(n);
			e.alpha > 0 && (i.globalAlpha = e.alpha, i.fillStyle = e.toHex(), i.fillRect(a.x, a.y, a.width, a.height), i.globalAlpha = 1);
		}
	}
	/**
	* Finishes the render pass (no-op for canvas).
	* @advanced
	*/
	finishRenderPass() {}
	/**
	* Copies a render target into a texture source.
	* @param {RenderTarget} sourceRenderSurfaceTexture - Source render target.
	* @param {Texture} destinationTexture - Destination texture.
	* @param {object} originSrc - Source origin.
	* @param {number} originSrc.x - Source x origin.
	* @param {number} originSrc.y - Source y origin.
	* @param {object} size - Copy size.
	* @param {number} size.width - Copy width.
	* @param {number} size.height - Copy height.
	* @param {object} [originDest] - Destination origin.
	* @param {number} originDest.x - Destination x origin.
	* @param {number} originDest.y - Destination y origin.
	* @advanced
	*/
	copyToTexture(e, t, n, r, i) {
		let a = this._renderTargetSystem.getGpuRenderTarget(e).canvas, o = t.source, { context: s } = this._ensureCanvas(o), c = i?.x ?? 0, l = i?.y ?? 0;
		return s.drawImage(a, n.x, n.y, r.width, r.height, c, l, r.width, r.height), o.update(), t;
	}
	/**
	* Copies the depth attachment of a render target into a texture (not supported in canvas).
	* @param _source - Source render target.
	* @param _destination - Destination depth/stencil texture.
	* @param _originSrc - Source origin of the copy.
	* @param _originSrc.x
	* @param _originSrc.y
	* @param _size - Size of the copy.
	* @param _size.width
	* @param _size.height
	* @param _originDest - Destination origin of the copy.
	* @param _originDest.x
	* @param _originDest.y
	* @advanced
	*/
	copyDepthTexture(e, t, n, r, i) {
		u("[CanvasRenderTargetAdaptor] copyDepthTexture is not supported in the canvas renderer");
	}
	/**
	* Destroys a GPU render target (no-op for canvas).
	* @param _gpuRenderTarget - Target to destroy.
	* @advanced
	*/
	destroyGpuRenderTarget(e) {}
	_ensureCanvas(e) {
		let t = e.resource;
		(!t || !m.test(t)) && (t = f.get().createCanvas(e.pixelWidth, e.pixelHeight), e.resource = t), (t.width !== e.pixelWidth || t.height !== e.pixelHeight) && (t.width = e.pixelWidth, t.height = e.pixelHeight);
		let n = t.getContext("2d");
		return {
			canvas: t,
			context: n
		};
	}
}, xe = class extends ne {
	constructor(e) {
		super(e), this.adaptor = new be(), this.adaptor.init(e, this);
	}
};
/** @ignore */
xe.extension = {
	type: [n.CanvasSystem],
	name: "renderTarget"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/texture/CanvasTextureSystem.mjs
var Se = class {
	/**
	* @param renderer - The owning CanvasRenderer.
	*/
	constructor(e) {}
	/** Initializes the system (no-op for canvas). */
	init() {}
	/**
	* Initializes a texture source (no-op for canvas).
	* @param _source - Texture source.
	*/
	initSource(e) {}
	/**
	* Creates a canvas containing the texture's frame.
	* @param texture - Texture to render.
	*/
	generateCanvas(e) {
		let t = f.get().createCanvas(), n = t.getContext("2d"), r = v.getCanvasSource(e);
		if (!r) return t;
		let i = e.frame, a = e.source._resolution ?? e.source.resolution ?? 1, o = i.x * a, s = i.y * a, c = i.width * a, l = i.height * a;
		return t.width = Math.ceil(c), t.height = Math.ceil(l), n.drawImage(r, o, s, c, l, 0, 0, c, l), t;
	}
	/**
	* Reads pixel data from a texture.
	* @param texture - Texture to read.
	*/
	getPixels(e) {
		let t = this.generateCanvas(e);
		return {
			pixels: t.getContext("2d", { willReadFrequently: !0 }).getImageData(0, 0, t.width, t.height).data,
			width: t.width,
			height: t.height
		};
	}
	/** Destroys the system (no-op for canvas). */
	destroy() {}
};
/** @ignore */
Se.extension = {
	type: [n.CanvasSystem],
	name: "texture"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/canvas/CanvasRenderer.mjs
var Ce = /* @__PURE__ */ e({ CanvasRenderer: () => Ae }), we = [
	...T,
	Y,
	X,
	Se,
	xe
], Te = [
	te,
	C,
	x,
	E,
	S,
	q,
	W,
	w
], Ee = [U, ye], De = [], Oe = [], ke = [];
r.handleByNamedList(n.CanvasSystem, De), r.handleByNamedList(n.CanvasPipes, Oe), r.handleByNamedList(n.CanvasPipesAdaptor, ke), r.add(...we, ...Te, ...Ee);
var Ae = class extends ee {
	constructor() {
		let e = {
			name: "canvas",
			type: y.CANVAS,
			systems: De,
			renderPipes: Oe,
			renderPipeAdaptors: ke
		};
		super(e);
	}
};
//#endregion
export { L as _, be as a, Y as c, W as d, U as f, R as g, B as h, xe as i, ce as l, z as m, Ce as n, ye as o, V as p, Se as r, X as s, Ae as t, q as u };
