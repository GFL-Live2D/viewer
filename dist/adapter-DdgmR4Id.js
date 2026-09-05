import { r as e, t } from "./rolldown-runtime-B0aSnxlc.js";
//#region node_modules/pixi.js/lib/extensions/Extensions.mjs
var n = /* @__PURE__ */ ((e) => (e.Application = "application", e.WebGLPipes = "webgl-pipes", e.WebGLPipesAdaptor = "webgl-pipes-adaptor", e.WebGLSystem = "webgl-system", e.WebGPUPipes = "webgpu-pipes", e.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", e.WebGPUSystem = "webgpu-system", e.CanvasSystem = "canvas-system", e.CanvasPipesAdaptor = "canvas-pipes-adaptor", e.CanvasPipes = "canvas-pipes", e.Asset = "asset", e.LoadParser = "load-parser", e.ResolveParser = "resolve-parser", e.CacheParser = "cache-parser", e.DetectionParser = "detection-parser", e.MaskEffect = "mask-effect", e.BlendMode = "blend-mode", e.TextureSource = "texture-source", e.TextureUploaderWebGL = "texture-uploader-webgl", e.TextureUploaderWebGPU = "texture-uploader-webgpu", e.Environment = "environment", e.ShapeBuilder = "shape-builder", e.Batcher = "batcher", e))(n || {}), r = (e) => {
	if (typeof e == "function" || typeof e == "object" && e.extension) {
		if (!e.extension) throw Error("Extension class must have an extension object");
		e = {
			...typeof e.extension == "object" ? e.extension : { type: e.extension },
			ref: e
		};
	}
	if (typeof e == "object") e = { ...e };
	else throw Error("Invalid extension type");
	return typeof e.type == "string" && (e.type = [e.type]), e;
}, i = (e, t) => r(e).priority ?? t, a = {
	/** @ignore */
	_addHandlers: {},
	/** @ignore */
	_removeHandlers: {},
	/** @ignore */
	_queue: {},
	/**
	* Remove extensions from PixiJS.
	* @param extensions - Extensions to be removed. Can be:
	* - Extension class with static `extension` property
	* - Extension format object with `type` and `ref`
	* - Multiple extensions as separate arguments
	* @returns {extensions} this for chaining
	* @example
	* ```ts
	* // Remove a single extension
	* extensions.remove(MyRendererPlugin);
	*
	* // Remove multiple extensions
	* extensions.remove(
	*     MyRendererPlugin,
	*     MySystemPlugin
	* );
	* ```
	* @see {@link ExtensionType} For available extension types
	* @see {@link ExtensionFormat} For extension format details
	*/
	remove(...e) {
		return e.map(r).forEach((e) => {
			e.type.forEach((t) => this._removeHandlers[t]?.(e));
		}), this;
	},
	/**
	* Register new extensions with PixiJS. Extensions can be registered in multiple formats:
	* - As a class with a static `extension` property
	* - As an extension format object
	* - As multiple extensions passed as separate arguments
	* @param extensions - Extensions to add to PixiJS. Each can be:
	* - A class with static `extension` property
	* - An extension format object with `type` and `ref`
	* - Multiple extensions as separate arguments
	* @returns This extensions instance for chaining
	* @example
	* ```ts
	* // Register a simple extension
	* extensions.add(MyRendererPlugin);
	*
	* // Register multiple extensions
	* extensions.add(
	*     MyRendererPlugin,
	*     MySystemPlugin,
	* });
	* ```
	* @see {@link ExtensionType} For available extension types
	* @see {@link ExtensionFormat} For extension format details
	* @see {@link extensions.remove} For removing registered extensions
	*/
	add(...e) {
		return e.map(r).forEach((e) => {
			e.type.forEach((t) => {
				let n = this._addHandlers, r = this._queue;
				n[t] ? n[t]?.(e) : (r[t] = r[t] || [], r[t]?.push(e));
			});
		}), this;
	},
	/**
	* Internal method to handle extensions by name.
	* @param type - The extension type.
	* @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
	* @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
	* @returns this for chaining.
	* @internal
	* @ignore
	*/
	handle(e, t, n) {
		let r = this._addHandlers, i = this._removeHandlers;
		if (r[e] || i[e]) throw Error(`Extension type ${e} already has a handler`);
		r[e] = t, i[e] = n;
		let a = this._queue;
		return a[e] && (a[e]?.forEach((e) => t(e)), delete a[e]), this;
	},
	/**
	* Handle a type, but using a map by `name` property.
	* @param type - Type of extension to handle.
	* @param map - The object map of named extensions.
	* @returns this for chaining.
	* @ignore
	*/
	handleByMap(e, t) {
		return this.handle(e, (e) => {
			e.name && (t[e.name] = e.ref);
		}, (e) => {
			e.name && delete t[e.name];
		});
	},
	/**
	* Handle a type, but using a list of extensions with a `name` property.
	* @param type - Type of extension to handle.
	* @param map - The array of named extensions.
	* @param defaultPriority - Fallback priority if none is defined.
	* @returns this for chaining.
	* @ignore
	*/
	handleByNamedList(e, t, n = -1) {
		return this.handle(e, (e) => {
			t.findIndex((t) => t.name === e.name) >= 0 || (t.push({
				name: e.name,
				value: e.ref
			}), t.sort((e, t) => i(t.value, n) - i(e.value, n)));
		}, (e) => {
			let n = t.findIndex((t) => t.name === e.name);
			n !== -1 && t.splice(n, 1);
		});
	},
	/**
	* Handle a type, but using a list of extensions.
	* @param type - Type of extension to handle.
	* @param list - The list of extensions.
	* @param defaultPriority - The default priority to use if none is specified.
	* @returns this for chaining.
	* @ignore
	*/
	handleByList(e, t, n = -1) {
		return this.handle(e, (e) => {
			t.includes(e.ref) || (t.push(e.ref), t.sort((e, t) => i(t, n) - i(e, n)));
		}, (e) => {
			let n = t.indexOf(e.ref);
			n !== -1 && t.splice(n, 1);
		});
	},
	/**
	* Mixin the source object(s) properties into the target class's prototype.
	* Copies all property descriptors from source objects to the target's prototype.
	* @param Target - The target class to mix properties into
	* @param sources - One or more source objects containing properties to mix in
	* @example
	* ```ts
	* // Create a mixin with shared properties
	* const moveable = {
	*     x: 0,
	*     y: 0,
	*     move(x: number, y: number) {
	*         this.x += x;
	*         this.y += y;
	*     }
	* };
	*
	* // Create a mixin with computed properties
	* const scalable = {
	*     scale: 1,
	*     get scaled() {
	*         return this.scale > 1;
	*     }
	* };
	*
	* // Apply mixins to a class
	* extensions.mixin(Sprite, moveable, scalable);
	*
	* // Use mixed-in properties
	* const sprite = new Sprite();
	* sprite.move(10, 20);
	* console.log(sprite.x, sprite.y); // 10, 20
	* ```
	* @remarks
	* - Copies all properties including getters/setters
	* - Does not modify source objects
	* - Preserves property descriptors
	* @see {@link Object.defineProperties} For details on property descriptors
	* @see {@link Object.getOwnPropertyDescriptors} For details on property copying
	*/
	mixin(e, ...t) {
		for (let n of t) Object.defineProperties(e.prototype, Object.getOwnPropertyDescriptors(n));
	}
}, o = (/* @__PURE__ */ e((/* @__PURE__ */ t(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn === t && (!i || o.once) && (!n || o.context === n) && s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})))(), 1)).default, s = Math.PI * 2, c = 180 / Math.PI, l = Math.PI / 180, u = class e {
	/**
	* Creates a new `Point`
	* @param {number} [x=0] - position of the point on the x axis
	* @param {number} [y=0] - position of the point on the y axis
	*/
	constructor(e = 0, t = 0) {
		this.x = 0, this.y = 0, this.x = e, this.y = t;
	}
	/**
	* Creates a clone of this point, which is a new instance with the same `x` and `y` values.
	* @example
	* ```ts
	* // Basic point cloning
	* const original = new Point(100, 200);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.set(300, 400);
	*
	* // Verify independence
	* console.log(original); // Point(100, 200)
	* console.log(modified); // Point(300, 400)
	* ```
	* @remarks
	* - Creates new Point instance
	* - Deep copies x and y values
	* - Independent from original
	* - Useful for preserving values
	* @returns A clone of this point
	* @see {@link Point.copyFrom} For copying into existing point
	* @see {@link Point.copyTo} For copying to existing point
	*/
	clone() {
		return new e(this.x, this.y);
	}
	/**
	* Copies x and y from the given point into this point.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Point(100, 200);
	* const target = new Point();
	* target.copyFrom(source);
	*
	* // Copy and chain operations
	* const point = new Point()
	*     .copyFrom(source)
	*     .set(x + 50, y + 50);
	*
	* // Copy from any PointData
	* const data = { x: 10, y: 20 };
	* point.copyFrom(data);
	* ```
	* @param p - The point to copy from
	* @returns The point instance itself
	* @see {@link Point.copyTo} For copying to another point
	* @see {@link Point.clone} For creating new point copy
	*/
	copyFrom(e) {
		return this.set(e.x, e.y), this;
	}
	/**
	* Copies this point's x and y into the given point.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Point(100, 200);
	* const target = new Point();
	* source.copyTo(target);
	* ```
	* @param p - The point to copy to. Can be any type that is or extends `PointLike`
	* @returns The point (`p`) with values updated
	* @see {@link Point.copyFrom} For copying from another point
	* @see {@link Point.clone} For creating new point copy
	*/
	copyTo(e) {
		return e.set(this.x, this.y), e;
	}
	/**
	* Checks if another point is equal to this point.
	*
	* Compares x and y values using strict equality.
	* @example
	* ```ts
	* // Basic equality check
	* const p1 = new Point(100, 200);
	* const p2 = new Point(100, 200);
	* console.log(p1.equals(p2)); // true
	*
	* // Compare with PointData
	* const data = { x: 100, y: 200 };
	* console.log(p1.equals(data)); // true
	*
	* // Check different points
	* const p3 = new Point(200, 300);
	* console.log(p1.equals(p3)); // false
	* ```
	* @param p - The point to check
	* @returns `true` if both `x` and `y` are equal
	* @see {@link Point.copyFrom} For making points equal
	* @see {@link PointData} For point data interface
	*/
	equals(e) {
		return e.x === this.x && e.y === this.y;
	}
	/**
	* Sets the point to a new x and y position.
	*
	* If y is omitted, both x and y will be set to x.
	* @example
	* ```ts
	* // Basic position setting
	* const point = new Point();
	* point.set(100, 200);
	*
	* // Set both x and y to same value
	* point.set(50); // x=50, y=50
	*
	* // Chain with other operations
	* point
	*     .set(10, 20)
	*     .copyTo(otherPoint);
	* ```
	* @param x - Position on the x axis
	* @param y - Position on the y axis, defaults to x
	* @returns The point instance itself
	* @see {@link Point.copyFrom} For copying from another point
	* @see {@link Point.equals} For comparing positions
	*/
	set(e = 0, t = e) {
		return this.x = e, this.y = t, this;
	}
	toString() {
		return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
	}
	/**
	* A static Point object with `x` and `y` values of `0`.
	*
	* This shared instance is reset to zero values when accessed.
	*
	* > [!IMPORTANT] This point is shared and temporary. Do not store references to it.
	* @example
	* ```ts
	* // Use for temporary calculations
	* const tempPoint = Point.shared;
	* tempPoint.set(100, 200);
	* matrix.apply(tempPoint);
	*
	* // Will be reset to (0,0) on next access
	* const fresh = Point.shared; // x=0, y=0
	* ```
	* @readonly
	* @returns A fresh zeroed point for temporary use
	* @see {@link Point.constructor} For creating new points
	* @see {@link PointData} For basic point interface
	*/
	static get shared() {
		return d.x = 0, d.y = 0, d;
	}
}, d = new u(), f = class e {
	/**
	* @param a - x scale
	* @param b - y skew
	* @param c - x skew
	* @param d - y scale
	* @param tx - x translation
	* @param ty - y translation
	*/
	constructor(e = 1, t = 0, n = 0, r = 1, i = 0, a = 0) {
		this.array = null, this.a = e, this.b = t, this.c = n, this.d = r, this.tx = i, this.ty = a;
	}
	/**
	* Creates a Matrix object based on the given array.
	* Populates matrix components from a flat array in column-major order.
	*
	* > [!NOTE] Array mapping order:
	* > ```
	* > array[0] = a  (x scale)
	* > array[1] = b  (y skew)
	* > array[2] = tx (x translation)
	* > array[3] = c  (x skew)
	* > array[4] = d  (y scale)
	* > array[5] = ty (y translation)
	* > ```
	* @example
	* ```ts
	* // Create matrix from array
	* const matrix = new Matrix();
	* matrix.fromArray([
	*     2, 0,  100,  // a, b, tx
	*     0, 2,  100   // c, d, ty
	* ]);
	*
	* // Create matrix from typed array
	* const float32Array = new Float32Array([
	*     1, 0, 0,     // Scale x1, no skew
	*     0, 1, 0      // No skew, scale x1
	* ]);
	* matrix.fromArray(float32Array);
	* ```
	* @param array - The array to populate the matrix from
	* @see {@link Matrix.toArray} For converting matrix to array
	* @see {@link Matrix.set} For setting values directly
	*/
	fromArray(e) {
		this.a = e[0], this.b = e[1], this.c = e[3], this.d = e[4], this.tx = e[2], this.ty = e[5];
	}
	/**
	* Sets the matrix properties directly.
	* All matrix components can be set in one call.
	* @example
	* ```ts
	* // Set to identity matrix
	* matrix.set(1, 0, 0, 1, 0, 0);
	*
	* // Set to scale matrix
	* matrix.set(2, 0, 0, 2, 0, 0); // Scale 2x
	*
	* // Set to translation matrix
	* matrix.set(1, 0, 0, 1, 100, 50); // Move 100,50
	* ```
	* @param a - Scale on x axis
	* @param b - Shear on y axis
	* @param c - Shear on x axis
	* @param d - Scale on y axis
	* @param tx - Translation on x axis
	* @param ty - Translation on y axis
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.identity} For resetting to identity
	* @see {@link Matrix.fromArray} For setting from array
	*/
	set(e, t, n, r, i, a) {
		return this.a = e, this.b = t, this.c = n, this.d = r, this.tx = i, this.ty = a, this;
	}
	/**
	* Creates an array from the current Matrix object.
	*
	* > [!NOTE] The array format is:
	* > ```
	* > Non-transposed:
	* > [a, c, tx,
	* > b, d, ty,
	* > 0, 0, 1]
	* >
	* > Transposed:
	* > [a, b, 0,
	* > c, d, 0,
	* > tx,ty,1]
	* > ```
	* @example
	* ```ts
	* // Basic array conversion
	* const matrix = new Matrix(2, 0, 0, 2, 100, 100);
	* const array = matrix.toArray();
	*
	* // Using existing array
	* const float32Array = new Float32Array(9);
	* matrix.toArray(false, float32Array);
	*
	* // Get transposed array
	* const transposed = matrix.toArray(true);
	* ```
	* @param transpose - Whether to transpose the matrix
	* @param out - Optional Float32Array to store the result
	* @returns The array containing the matrix values
	* @see {@link Matrix.fromArray} For creating matrix from array
	* @see {@link Matrix.array} For cached array storage
	*/
	toArray(e, t) {
		this.array ||= /* @__PURE__ */ new Float32Array(9);
		let n = t || this.array;
		return e ? (n[0] = this.a, n[1] = this.b, n[2] = 0, n[3] = this.c, n[4] = this.d, n[5] = 0, n[6] = this.tx, n[7] = this.ty, n[8] = 1) : (n[0] = this.a, n[1] = this.c, n[2] = this.tx, n[3] = this.b, n[4] = this.d, n[5] = this.ty, n[6] = 0, n[7] = 0, n[8] = 1), n;
	}
	/**
	* Get a new position with the current transformation applied.
	*
	* Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
	* @example
	* ```ts
	* // Basic point transformation
	* const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
	* const point = new Point(10, 20);
	* const transformed = matrix.apply(point);
	*
	* // Reuse existing point
	* const output = new Point();
	* matrix.apply(point, output);
	* ```
	* @param pos - The origin point to transform
	* @param newPos - Optional point to store the result
	* @returns The transformed point
	* @see {@link Matrix.applyInverse} For inverse transformation
	* @see {@link Point} For point operations
	*/
	apply(e, t) {
		t ||= new u();
		let n = e.x, r = e.y;
		return t.x = this.a * n + this.c * r + this.tx, t.y = this.b * n + this.d * r + this.ty, t;
	}
	/**
	* Get a new position with the inverse of the current transformation applied.
	*
	* Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
	* @example
	* ```ts
	* // Basic inverse transformation
	* const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
	* const worldPoint = new Point(150, 100);
	* const localPoint = matrix.applyInverse(worldPoint);
	*
	* // Reuse existing point
	* const output = new Point();
	* matrix.applyInverse(worldPoint, output);
	*
	* // Convert mouse position to local space
	* const mousePoint = new Point(mouseX, mouseY);
	* const localMouse = matrix.applyInverse(mousePoint);
	* ```
	* @param pos - The origin point to inverse-transform
	* @param newPos - Optional point to store the result
	* @returns The inverse-transformed point
	* @see {@link Matrix.apply} For forward transformation
	* @see {@link Matrix.invert} For getting inverse matrix
	*/
	applyInverse(e, t) {
		t ||= new u();
		let n = this.a, r = this.b, i = this.c, a = this.d, o = this.tx, s = this.ty, c = 1 / (n * a + i * -r), l = e.x, d = e.y;
		return t.x = a * c * l + -i * c * d + (s * i - o * a) * c, t.y = n * c * d + -r * c * l + (-s * n + o * r) * c, t;
	}
	/**
	* Translates the matrix on the x and y axes.
	* Adds to the position values while preserving scale, rotation and skew.
	* @example
	* ```ts
	* // Basic translation
	* const matrix = new Matrix();
	* matrix.translate(100, 50); // Move right 100, down 50
	*
	* // Chain with other transformations
	* matrix
	*     .scale(2, 2)
	*     .translate(100, 0)
	*     .rotate(Math.PI / 4);
	* ```
	* @param x - How much to translate on the x axis
	* @param y - How much to translate on the y axis
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.set} For setting position directly
	* @see {@link Matrix.setTransform} For complete transform setup
	*/
	translate(e, t) {
		return this.tx += e, this.ty += t, this;
	}
	/**
	* Applies a scale transformation to the matrix.
	* Multiplies the scale values with existing matrix components.
	* @example
	* ```ts
	* // Basic scaling
	* const matrix = new Matrix();
	* matrix.scale(2, 3); // Scale 2x horizontally, 3x vertically
	*
	* // Chain with other transformations
	* matrix
	*     .translate(100, 100)
	*     .scale(2, 2)     // Scales after translation
	*     .rotate(Math.PI / 4);
	* ```
	* @param x - The amount to scale horizontally
	* @param y - The amount to scale vertically
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.setTransform} For setting scale directly
	* @see {@link Matrix.append} For combining transformations
	*/
	scale(e, t) {
		return this.a *= e, this.d *= t, this.c *= e, this.b *= t, this.tx *= e, this.ty *= t, this;
	}
	/**
	* Applies a rotation transformation to the matrix.
	*
	* Rotates around the origin (0,0) by the given angle in radians.
	* @example
	* ```ts
	* // Basic rotation
	* const matrix = new Matrix();
	* matrix.rotate(Math.PI / 4); // Rotate 45 degrees
	*
	* // Chain with other transformations
	* matrix
	*     .translate(100, 100) // Move to rotation center
	*     .rotate(Math.PI)     // Rotate 180 degrees
	*     .scale(2, 2);        // Scale after rotation
	*
	* // Common angles
	* matrix.rotate(Math.PI / 2);  // 90 degrees
	* matrix.rotate(Math.PI);      // 180 degrees
	* matrix.rotate(Math.PI * 2);  // 360 degrees
	* ```
	* @remarks
	* - Rotates around origin point (0,0)
	* - Affects position if translation was set
	* - Uses counter-clockwise rotation
	* - Order of operations matters when chaining
	* @param angle - The angle in radians
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.setTransform} For setting rotation directly
	* @see {@link Matrix.append} For combining transformations
	*/
	rotate(e) {
		let t = Math.cos(e), n = Math.sin(e), r = this.a, i = this.c, a = this.tx;
		return this.a = r * t - this.b * n, this.b = r * n + this.b * t, this.c = i * t - this.d * n, this.d = i * n + this.d * t, this.tx = a * t - this.ty * n, this.ty = a * n + this.ty * t, this;
	}
	/**
	* Appends the given Matrix to this Matrix.
	* Combines two matrices by multiplying them together: this = this * matrix
	* @example
	* ```ts
	* // Basic matrix combination
	* const matrix = new Matrix();
	* const other = new Matrix().translate(100, 0).rotate(Math.PI / 4);
	* matrix.append(other);
	* ```
	* @remarks
	* - Order matters: A.append(B) !== B.append(A)
	* - Modifies current matrix
	* - Preserves transformation order
	* - Commonly used for combining transforms
	* @param matrix - The matrix to append
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.prepend} For prepending transformations
	* @see {@link Matrix.appendFrom} For appending two external matrices
	*/
	append(e) {
		let t = this.a, n = this.b, r = this.c, i = this.d;
		return this.a = e.a * t + e.b * r, this.b = e.a * n + e.b * i, this.c = e.c * t + e.d * r, this.d = e.c * n + e.d * i, this.tx = e.tx * t + e.ty * r + this.tx, this.ty = e.tx * n + e.ty * i + this.ty, this;
	}
	/**
	* Appends two matrices and sets the result to this matrix.
	* Performs matrix multiplication: this = A * B
	* @example
	* ```ts
	* // Basic matrix multiplication
	* const result = new Matrix();
	* const matrixA = new Matrix().scale(2, 2);
	* const matrixB = new Matrix().rotate(Math.PI / 4);
	* result.appendFrom(matrixA, matrixB);
	* ```
	* @remarks
	* - Order matters: A * B !== B * A
	* - Creates a new transformation from two others
	* - More efficient than append() for multiple operations
	* - Does not modify input matrices
	* @param a - The first matrix to multiply
	* @param b - The second matrix to multiply
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.append} For single matrix combination
	* @see {@link Matrix.prepend} For reverse order multiplication
	*/
	appendFrom(e, t) {
		let n = e.a, r = e.b, i = e.c, a = e.d, o = e.tx, s = e.ty, c = t.a, l = t.b, u = t.c, d = t.d;
		return this.a = n * c + r * u, this.b = n * l + r * d, this.c = i * c + a * u, this.d = i * l + a * d, this.tx = o * c + s * u + t.tx, this.ty = o * l + s * d + t.ty, this;
	}
	/**
	* Sets the matrix based on all the available properties.
	* Combines position, scale, rotation, skew and pivot in a single operation.
	* @example
	* ```ts
	* // Basic transform setup
	* const matrix = new Matrix();
	* matrix.setTransform(
	*     100, 100,    // position
	*     0, 0,        // pivot
	*     2, 2,        // scale
	*     Math.PI / 4, // rotation (45 degrees)
	*     0, 0         // skew
	* );
	* ```
	* @remarks
	* - Updates all matrix components at once
	* - More efficient than separate transform calls
	* - Uses radians for rotation and skew
	* - Pivot affects rotation center
	* @param x - Position on the x axis
	* @param y - Position on the y axis
	* @param pivotX - Pivot on the x axis
	* @param pivotY - Pivot on the y axis
	* @param scaleX - Scale on the x axis
	* @param scaleY - Scale on the y axis
	* @param rotation - Rotation in radians
	* @param skewX - Skew on the x axis
	* @param skewY - Skew on the y axis
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.decompose} For extracting transform properties
	* @see {@link TransformableObject} For transform data structure
	*/
	setTransform(e, t, n, r, i, a, o, s, c) {
		return this.a = Math.cos(o + c) * i, this.b = Math.sin(o + c) * i, this.c = -Math.sin(o - s) * a, this.d = Math.cos(o - s) * a, this.tx = e - (n * this.a + r * this.c), this.ty = t - (n * this.b + r * this.d), this;
	}
	/**
	* Prepends the given Matrix to this Matrix.
	* Combines two matrices by multiplying them together: this = matrix * this
	* @example
	* ```ts
	* // Basic matrix prepend
	* const matrix = new Matrix().scale(2, 2);
	* const other = new Matrix().translate(100, 0);
	* matrix.prepend(other); // Translation happens before scaling
	* ```
	* @remarks
	* - Order matters: A.prepend(B) !== B.prepend(A)
	* - Modifies current matrix
	* - Reverses transformation order compared to append()
	* @param matrix - The matrix to prepend
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.append} For appending transformations
	* @see {@link Matrix.appendFrom} For combining external matrices
	*/
	prepend(e) {
		let t = this.tx;
		if (e.a !== 1 || e.b !== 0 || e.c !== 0 || e.d !== 1) {
			let t = this.a, n = this.c;
			this.a = t * e.a + this.b * e.c, this.b = t * e.b + this.b * e.d, this.c = n * e.a + this.d * e.c, this.d = n * e.b + this.d * e.d;
		}
		return this.tx = t * e.a + this.ty * e.c + e.tx, this.ty = t * e.b + this.ty * e.d + e.ty, this;
	}
	/**
	* Decomposes the matrix into its individual transform components.
	* Extracts position, scale, rotation and skew values from the matrix.
	* @example
	* ```ts
	* // Basic decomposition
	* const matrix = new Matrix()
	*     .translate(100, 100)
	*     .rotate(Math.PI / 4)
	*     .scale(2, 2);
	*
	* const transform = {
	*     position: new Point(),
	*     scale: new Point(),
	*     pivot: new Point(),
	*     skew: new Point(),
	*     rotation: 0
	* };
	*
	* matrix.decompose(transform);
	* console.log(transform.position); // Point(100, 100)
	* console.log(transform.rotation); // ~0.785 (PI/4)
	* console.log(transform.scale); // Point(2, 2)
	* ```
	* @remarks
	* - Handles combined transformations
	* - Accounts for pivot points
	* - Chooses between rotation/skew based on transform type
	* - Uses radians for rotation and skew
	* @param transform - The transform object to store the decomposed values
	* @returns The transform with the newly applied properties
	* @see {@link Matrix.setTransform} For composing from components
	* @see {@link TransformableObject} For transform structure
	*/
	decompose(e) {
		let t = this.a, n = this.b, r = this.c, i = this.d, a = e.pivot, o = -Math.atan2(-r, i), c = Math.atan2(n, t), l = Math.abs(o + c);
		return l < 1e-5 || Math.abs(s - l) < 1e-5 ? (e.rotation = c, e.skew.x = e.skew.y = 0) : (e.rotation = 0, e.skew.x = o, e.skew.y = c), e.scale.x = Math.sqrt(t * t + n * n), e.scale.y = Math.sqrt(r * r + i * i), e.position.x = this.tx + (a.x * t + a.y * r), e.position.y = this.ty + (a.x * n + a.y * i), e;
	}
	/**
	* Inverts this matrix.
	* Creates the matrix that when multiplied with this matrix results in an identity matrix.
	* @example
	* ```ts
	* // Basic matrix inversion
	* const matrix = new Matrix()
	*     .translate(100, 50)
	*     .scale(2, 2);
	*
	* matrix.invert(); // Now transforms in opposite direction
	*
	* // Verify inversion
	* const point = new Point(50, 50);
	* const transformed = matrix.apply(point);
	* const original = matrix.invert().apply(transformed);
	* // original ≈ point
	* ```
	* @remarks
	* - Modifies the current matrix
	* - Useful for reversing transformations
	* - Cannot invert matrices with zero determinant
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.identity} For resetting to identity
	* @see {@link Matrix.applyInverse} For inverse transformations
	*/
	invert() {
		let e = this.a, t = this.b, n = this.c, r = this.d, i = this.tx, a = e * r - t * n;
		return this.a = r / a, this.b = -t / a, this.c = -n / a, this.d = e / a, this.tx = (n * this.ty - r * i) / a, this.ty = -(e * this.ty - t * i) / a, this;
	}
	/**
	* Checks if this matrix is an identity matrix.
	*
	* An identity matrix has no transformations applied (default state).
	* @example
	* ```ts
	* // Check if matrix is identity
	* const matrix = new Matrix();
	* console.log(matrix.isIdentity()); // true
	*
	* // Check after transformations
	* matrix.translate(100, 0);
	* console.log(matrix.isIdentity()); // false
	*
	* // Reset and verify
	* matrix.identity();
	* console.log(matrix.isIdentity()); // true
	* ```
	* @remarks
	* - Verifies a = 1, d = 1 (no scale)
	* - Verifies b = 0, c = 0 (no skew)
	* - Verifies tx = 0, ty = 0 (no translation)
	* @returns True if matrix has no transformations
	* @see {@link Matrix.identity} For resetting to identity
	* @see {@link Matrix.IDENTITY} For constant identity matrix
	*/
	isIdentity() {
		return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
	}
	/**
	* Resets this Matrix to an identity (default) matrix.
	* Sets all components to their default values: scale=1, no skew, no translation.
	* @example
	* ```ts
	* // Reset transformed matrix
	* const matrix = new Matrix()
	*     .scale(2, 2)
	*     .rotate(Math.PI / 4);
	* matrix.identity(); // Back to default state
	*
	* // Chain after reset
	* matrix
	*     .identity()
	*     .translate(100, 100)
	*     .scale(2, 2);
	*
	* // Compare with identity constant
	* const isDefault = matrix.equals(Matrix.IDENTITY);
	* ```
	* @remarks
	* - Sets a=1, d=1 (default scale)
	* - Sets b=0, c=0 (no skew)
	* - Sets tx=0, ty=0 (no translation)
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.IDENTITY} For constant identity matrix
	* @see {@link Matrix.isIdentity} For checking identity state
	*/
	identity() {
		return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
	}
	/**
	* Creates a new Matrix object with the same values as this one.
	* @returns A copy of this matrix. Good for chaining method calls.
	*/
	clone() {
		let t = new e();
		return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
	}
	/**
	* Creates a new Matrix object with the same values as this one.
	* @param matrix
	* @example
	* ```ts
	* // Basic matrix cloning
	* const matrix = new Matrix()
	*     .translate(100, 100)
	*     .rotate(Math.PI / 4);
	* const copy = matrix.clone();
	*
	* // Clone and modify
	* const modified = matrix.clone()
	*     .scale(2, 2);
	*
	* // Compare matrices
	* console.log(matrix.equals(copy));     // true
	* console.log(matrix.equals(modified)); // false
	* ```
	* @returns A copy of this matrix. Good for chaining method calls.
	* @see {@link Matrix.copyTo} For copying to existing matrix
	* @see {@link Matrix.copyFrom} For copying from another matrix
	*/
	copyTo(e) {
		return e.a = this.a, e.b = this.b, e.c = this.c, e.d = this.d, e.tx = this.tx, e.ty = this.ty, e;
	}
	/**
	* Changes the values of the matrix to be the same as the ones in given matrix.
	* @example
	* ```ts
	* // Basic matrix copying
	* const source = new Matrix()
	*     .translate(100, 100)
	*     .rotate(Math.PI / 4);
	* const target = new Matrix();
	* target.copyFrom(source);
	* ```
	* @param matrix - The matrix to copy from
	* @returns This matrix. Good for chaining method calls.
	* @see {@link Matrix.clone} For creating new matrix copy
	* @see {@link Matrix.copyTo} For copying to another matrix
	*/
	copyFrom(e) {
		return this.a = e.a, this.b = e.b, this.c = e.c, this.d = e.d, this.tx = e.tx, this.ty = e.ty, this;
	}
	/**
	* Checks if this matrix equals another matrix.
	* Compares all components for exact equality.
	* @example
	* ```ts
	* // Basic equality check
	* const m1 = new Matrix();
	* const m2 = new Matrix();
	* console.log(m1.equals(m2)); // true
	*
	* // Compare transformed matrices
	* const transform = new Matrix()
	*     .translate(100, 100)
	* const clone = new Matrix()
	*     .scale(2, 2);
	* console.log(transform.equals(clone)); // false
	* ```
	* @param matrix - The matrix to compare to
	* @returns True if matrices are identical
	* @see {@link Matrix.copyFrom} For copying matrix values
	* @see {@link Matrix.isIdentity} For identity comparison
	*/
	equals(e) {
		return e.a === this.a && e.b === this.b && e.c === this.c && e.d === this.d && e.tx === this.tx && e.ty === this.ty;
	}
	toString() {
		return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
	}
	/**
	* A default (identity) matrix with no transformations applied.
	*
	* > [!IMPORTANT] This is a shared read-only object. Create a new Matrix if you need to modify it.
	* @example
	* ```ts
	* // Get identity matrix reference
	* const identity = Matrix.IDENTITY;
	* console.log(identity.isIdentity()); // true
	*
	* // Compare with identity
	* const matrix = new Matrix();
	* console.log(matrix.equals(Matrix.IDENTITY)); // true
	*
	* // Create new matrix instead of modifying IDENTITY
	* const transform = new Matrix()
	*     .copyFrom(Matrix.IDENTITY)
	*     .translate(100, 100);
	* ```
	* @readonly
	* @returns A read-only identity matrix
	* @see {@link Matrix.shared} For temporary calculations
	* @see {@link Matrix.identity} For resetting matrices
	*/
	static get IDENTITY() {
		return m.identity();
	}
	/**
	* A static Matrix that can be used to avoid creating new objects.
	* Will always ensure the matrix is reset to identity when requested.
	*
	* > [!IMPORTANT] This matrix is shared and temporary. Do not store references to it.
	* @example
	* ```ts
	* // Use for temporary calculations
	* const tempMatrix = Matrix.shared;
	* tempMatrix.translate(100, 100).rotate(Math.PI / 4);
	* const point = tempMatrix.apply({ x: 10, y: 20 });
	*
	* // Will be reset to identity on next access
	* const fresh = Matrix.shared; // Back to identity
	* ```
	* @remarks
	* - Always returns identity matrix
	* - Safe to modify temporarily
	* - Not safe to store references
	* - Useful for one-off calculations
	* @readonly
	* @returns A fresh identity matrix for temporary use
	* @see {@link Matrix.IDENTITY} For immutable identity matrix
	* @see {@link Matrix.identity} For resetting matrices
	*/
	static get shared() {
		return p.identity();
	}
}, p = new f(), m = new f(), h = [
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1
], g = [
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1
], _ = [
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1
], v = [
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1
], y = [], b = [], x = Math.sign;
function S() {
	for (let e = 0; e < 16; e++) {
		let t = [];
		y.push(t);
		for (let n = 0; n < 16; n++) {
			let r = x(h[e] * h[n] + _[e] * g[n]), i = x(g[e] * h[n] + v[e] * g[n]), a = x(h[e] * _[n] + _[e] * v[n]), o = x(g[e] * _[n] + v[e] * v[n]);
			for (let e = 0; e < 16; e++) if (h[e] === r && g[e] === i && _[e] === a && v[e] === o) {
				t.push(e);
				break;
			}
		}
	}
	for (let e = 0; e < 16; e++) {
		let t = new f();
		t.set(h[e], g[e], _[e], v[e], 0, 0), b.push(t);
	}
}
S();
var C = {
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 0°       | East      |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	E: 0,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 45°↻     | Southeast |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	SE: 1,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 90°↻     | South     |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	S: 2,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 135°↻    | Southwest |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	SW: 3,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 180°     | West      |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	W: 4,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -135°/225°↻ | Northwest    |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	NW: 5,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -90°/270°↻  | North        |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	N: 6,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -45°/315°↻  | Northeast    |
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	NE: 7,
	/**
	* Reflection about Y-axis.
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	MIRROR_VERTICAL: 8,
	/**
	* Reflection about the main diagonal.
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	MAIN_DIAGONAL: 10,
	/**
	* Reflection about X-axis.
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	MIRROR_HORIZONTAL: 12,
	/**
	* Reflection about reverse diagonal.
	* @group groupD8
	* @type {GD8Symmetry}
	*/
	REVERSE_DIAGONAL: 14,
	/**
	* @group groupD8
	* @param {GD8Symmetry} ind - sprite rotation angle.
	* @returns {GD8Symmetry} The X-component of the U-axis
	*    after rotating the axes.
	*/
	uX: (e) => h[e],
	/**
	* @group groupD8
	* @param {GD8Symmetry} ind - sprite rotation angle.
	* @returns {GD8Symmetry} The Y-component of the U-axis
	*    after rotating the axes.
	*/
	uY: (e) => g[e],
	/**
	* @group groupD8
	* @param {GD8Symmetry} ind - sprite rotation angle.
	* @returns {GD8Symmetry} The X-component of the V-axis
	*    after rotating the axes.
	*/
	vX: (e) => _[e],
	/**
	* @group groupD8
	* @param {GD8Symmetry} ind - sprite rotation angle.
	* @returns {GD8Symmetry} The Y-component of the V-axis
	*    after rotating the axes.
	*/
	vY: (e) => v[e],
	/**
	* @group groupD8
	* @param {GD8Symmetry} rotation - symmetry whose opposite
	*   is needed. Only rotations have opposite symmetries while
	*   reflections don't.
	* @returns {GD8Symmetry} The opposite symmetry of `rotation`
	*/
	inv: (e) => e & 8 ? e & 15 : -e & 7,
	/**
	* Composes the two D8 operations.
	*
	* Taking `^` as reflection:
	*
	* |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
	* |-------|-----|-----|-----|-----|------|-------|-------|-------|
	* | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
	* | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
	* | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
	* | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
	* | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
	* | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
	* | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
	* | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
	*
	* [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
	* @group groupD8
	* @param {GD8Symmetry} rotationSecond - Second operation, which
	*   is the row in the above cayley table.
	* @param {GD8Symmetry} rotationFirst - First operation, which
	*   is the column in the above cayley table.
	* @returns {GD8Symmetry} Composed operation
	*/
	add: (e, t) => y[e][t],
	/**
	* Reverse of `add`.
	* @group groupD8
	* @param {GD8Symmetry} rotationSecond - Second operation
	* @param {GD8Symmetry} rotationFirst - First operation
	* @returns {GD8Symmetry} Result
	*/
	sub: (e, t) => y[e][C.inv(t)],
	/**
	* Adds 180 degrees to rotation, which is a commutative
	* operation.
	* @group groupD8
	* @param {number} rotation - The number to rotate.
	* @returns {number} Rotated number
	*/
	rotate180: (e) => e ^ 4,
	/**
	* Checks if the rotation angle is vertical, i.e. south
	* or north. It doesn't work for reflections.
	* @group groupD8
	* @param {GD8Symmetry} rotation - The number to check.
	* @returns {boolean} Whether or not the direction is vertical
	*/
	isVertical: (e) => (e & 3) == 2,
	/**
	* Approximates the vector `V(dx,dy)` into one of the
	* eight directions provided by `groupD8`.
	* @group groupD8
	* @param {number} dx - X-component of the vector
	* @param {number} dy - Y-component of the vector
	* @returns {GD8Symmetry} Approximation of the vector into
	*  one of the eight symmetries.
	*/
	byDirection: (e, t) => Math.abs(e) * 2 <= Math.abs(t) ? t >= 0 ? C.S : C.N : Math.abs(t) * 2 <= Math.abs(e) ? e > 0 ? C.E : C.W : t > 0 ? e > 0 ? C.SE : C.SW : e > 0 ? C.NE : C.NW,
	/**
	* Helps sprite to compensate texture packer rotation.
	* @group groupD8
	* @param {Matrix} matrix - sprite world matrix
	* @param {GD8Symmetry} rotation - The rotation factor to use.
	* @param {number} tx - sprite anchoring
	* @param {number} ty - sprite anchoring
	* @param {number} dw - sprite width
	* @param {number} dh - sprite height
	*/
	matrixAppendRotationInv: (e, t, n = 0, r = 0, i = 0, a = 0) => {
		let o = b[C.inv(t)], s = o.a, c = o.b, l = o.c, u = o.d, d = n - Math.min(0, s * i, l * a, s * i + l * a), f = r - Math.min(0, c * i, u * a, c * i + u * a), p = e.a, m = e.b, h = e.c, g = e.d;
		e.a = s * p + c * h, e.b = s * m + c * g, e.c = l * p + u * h, e.d = l * m + u * g, e.tx = d * p + f * h + e.tx, e.ty = d * m + f * g + e.ty;
	},
	/**
	* Transforms rectangle coordinates based on texture packer rotation.
	* Used when texture atlas pages are rotated and coordinates need to be adjusted.
	* @group groupD8
	* @param {RectangleLike} rect - Rectangle with original coordinates to transform
	* @param {RectangleLike} sourceFrame - Source texture frame (includes offset and dimensions)
	* @param {GD8Symmetry} rotation - The groupD8 rotation value
	* @param {Rectangle} out - Rectangle to store the result
	* @returns {Rectangle} Transformed coordinates (includes source frame offset)
	*/
	transformRectCoords: (e, t, n, r) => {
		let { x: i, y: a, width: o, height: s } = e, { x: c, y: l, width: u, height: d } = t;
		return n === C.E ? (r.set(i + c, a + l, o, s), r) : n === C.S ? r.set(u - a - s + c, i + l, s, o) : n === C.W ? r.set(u - i - o + c, d - a - s + l, o, s) : n === C.N ? r.set(a + c, d - i - o + l, s, o) : r.set(i + c, a + l, o, s);
	}
}, w = [
	new u(),
	new u(),
	new u(),
	new u()
], T = class e {
	/**
	* @param x - The X coordinate of the upper-left corner of the rectangle
	* @param y - The Y coordinate of the upper-left corner of the rectangle
	* @param width - The overall width of the rectangle
	* @param height - The overall height of the rectangle
	*/
	constructor(e = 0, t = 0, n = 0, r = 0) {
		this.type = "rectangle", this.x = Number(e), this.y = Number(t), this.width = Number(n), this.height = Number(r);
	}
	/**
	* Returns the left edge (x-coordinate) of the rectangle.
	* @example
	* ```ts
	* // Get left edge position
	* const rect = new Rectangle(100, 100, 200, 150);
	* console.log(rect.left); // 100
	*
	* // Use in alignment calculations
	* sprite.x = rect.left + padding;
	*
	* // Compare positions
	* if (point.x > rect.left) {
	*     console.log('Point is right of rectangle');
	* }
	* ```
	* @readonly
	* @returns The x-coordinate of the left edge
	* @see {@link Rectangle.right} For right edge position
	* @see {@link Rectangle.x} For direct x-coordinate access
	*/
	get left() {
		return this.x;
	}
	/**
	* Returns the right edge (x + width) of the rectangle.
	* @example
	* ```ts
	* // Get right edge position
	* const rect = new Rectangle(100, 100, 200, 150);
	* console.log(rect.right); // 300
	*
	* // Align to right edge
	* sprite.x = rect.right - sprite.width;
	*
	* // Check boundaries
	* if (point.x < rect.right) {
	*     console.log('Point is inside right bound');
	* }
	* ```
	* @readonly
	* @returns The x-coordinate of the right edge
	* @see {@link Rectangle.left} For left edge position
	* @see {@link Rectangle.width} For width value
	*/
	get right() {
		return this.x + this.width;
	}
	/**
	* Returns the top edge (y-coordinate) of the rectangle.
	* @example
	* ```ts
	* // Get top edge position
	* const rect = new Rectangle(100, 100, 200, 150);
	* console.log(rect.top); // 100
	*
	* // Position above rectangle
	* sprite.y = rect.top - sprite.height;
	*
	* // Check vertical position
	* if (point.y > rect.top) {
	*     console.log('Point is below top edge');
	* }
	* ```
	* @readonly
	* @returns The y-coordinate of the top edge
	* @see {@link Rectangle.bottom} For bottom edge position
	* @see {@link Rectangle.y} For direct y-coordinate access
	*/
	get top() {
		return this.y;
	}
	/**
	* Returns the bottom edge (y + height) of the rectangle.
	* @example
	* ```ts
	* // Get bottom edge position
	* const rect = new Rectangle(100, 100, 200, 150);
	* console.log(rect.bottom); // 250
	*
	* // Stack below rectangle
	* sprite.y = rect.bottom + margin;
	*
	* // Check vertical bounds
	* if (point.y < rect.bottom) {
	*     console.log('Point is above bottom edge');
	* }
	* ```
	* @readonly
	* @returns The y-coordinate of the bottom edge
	* @see {@link Rectangle.top} For top edge position
	* @see {@link Rectangle.height} For height value
	*/
	get bottom() {
		return this.y + this.height;
	}
	/**
	* Determines whether the Rectangle is empty (has no area).
	* @example
	* ```ts
	* // Check zero dimensions
	* const rect = new Rectangle(100, 100, 0, 50);
	* console.log(rect.isEmpty()); // true
	* ```
	* @returns True if the rectangle has no area
	* @see {@link Rectangle.width} For width value
	* @see {@link Rectangle.height} For height value
	*/
	isEmpty() {
		return this.left === this.right || this.top === this.bottom;
	}
	/**
	* A constant empty rectangle. This is a new object every time the property is accessed.
	* @example
	* ```ts
	* // Get fresh empty rectangle
	* const empty = Rectangle.EMPTY;
	* console.log(empty.isEmpty()); // true
	* ```
	* @returns A new empty rectangle instance
	* @see {@link Rectangle.isEmpty} For empty state testing
	*/
	static get EMPTY() {
		return new e(0, 0, 0, 0);
	}
	/**
	* Creates a clone of this Rectangle
	* @example
	* ```ts
	* // Basic cloning
	* const original = new Rectangle(100, 100, 200, 150);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.width *= 2;
	* modified.height += 50;
	*
	* // Verify independence
	* console.log(original.width);  // 200
	* console.log(modified.width);  // 400
	* ```
	* @returns A copy of the rectangle
	* @see {@link Rectangle.copyFrom} For copying into existing rectangle
	* @see {@link Rectangle.copyTo} For copying to another rectangle
	*/
	clone() {
		return new e(this.x, this.y, this.width, this.height);
	}
	/**
	* Converts a Bounds object to a Rectangle object.
	* @example
	* ```ts
	* // Convert bounds to rectangle
	* const bounds = container.getBounds();
	* const rect = new Rectangle().copyFromBounds(bounds);
	* ```
	* @param bounds - The bounds to copy and convert to a rectangle
	* @returns Returns itself
	* @see {@link Bounds} For bounds object structure
	* @see {@link Rectangle.getBounds} For getting rectangle bounds
	*/
	copyFromBounds(e) {
		return this.x = e.minX, this.y = e.minY, this.width = e.maxX - e.minX, this.height = e.maxY - e.minY, this;
	}
	/**
	* Copies another rectangle to this one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Rectangle(100, 100, 200, 150);
	* const target = new Rectangle();
	* target.copyFrom(source);
	*
	* // Chain with other operations
	* const rect = new Rectangle()
	*     .copyFrom(source)
	*     .pad(10);
	* ```
	* @param rectangle - The rectangle to copy from
	* @returns Returns itself
	* @see {@link Rectangle.copyTo} For copying to another rectangle
	* @see {@link Rectangle.clone} For creating new rectangle copy
	*/
	copyFrom(e) {
		return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this;
	}
	/**
	* Copies this rectangle to another one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Rectangle(100, 100, 200, 150);
	* const target = new Rectangle();
	* source.copyTo(target);
	*
	* // Chain with other operations
	* const result = source
	*     .copyTo(new Rectangle())
	*     .getBounds();
	* ```
	* @param rectangle - The rectangle to copy to
	* @returns Returns given parameter
	* @see {@link Rectangle.copyFrom} For copying from another rectangle
	* @see {@link Rectangle.clone} For creating new rectangle copy
	*/
	copyTo(e) {
		return e.copyFrom(this), e;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this Rectangle
	* @example
	* ```ts
	* // Basic containment check
	* const rect = new Rectangle(100, 100, 200, 150);
	* const isInside = rect.contains(150, 125); // true
	* // Check edge cases
	* console.log(rect.contains(100, 100)); // true (on edge)
	* console.log(rect.contains(300, 250)); // false (outside)
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this Rectangle
	* @see {@link Rectangle.containsRect} For rectangle containment
	* @see {@link Rectangle.strokeContains} For checking stroke intersection
	*/
	contains(e, t) {
		return this.width <= 0 || this.height <= 0 ? !1 : e >= this.x && e < this.x + this.width && t >= this.y && t < this.y + this.height;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
	* @example
	* ```ts
	* // Basic stroke check
	* const rect = new Rectangle(100, 100, 200, 150);
	* const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
	*
	* // Check with different alignments
	* const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
	* const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
	* const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @param strokeWidth - The width of the line to check
	* @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
	* @returns Whether the x/y coordinates are within this rectangle's stroke
	* @see {@link Rectangle.contains} For checking fill containment
	* @see {@link Rectangle.getBounds} For getting stroke bounds
	*/
	strokeContains(e, t, n, r = .5) {
		let { width: i, height: a } = this;
		if (i <= 0 || a <= 0) return !1;
		let o = this.x, s = this.y, c = n * (1 - r), l = n - c, u = o - c, d = o + i + c, f = s - c, p = s + a + c, m = o + l, h = o + i - l, g = s + l, _ = s + a - l;
		return e >= u && e <= d && t >= f && t <= p && !(e > m && e < h && t > g && t < _);
	}
	/**
	* Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
	* Returns true only if the area of the intersection is >0, this means that Rectangles
	* sharing a side are not overlapping. Another side effect is that an arealess rectangle
	* (width or height equal to zero) can't intersect any other rectangle.
	* @param {Rectangle} other - The Rectangle to intersect with `this`.
	* @param {Matrix} transform - The transformation matrix of `other`.
	* @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
	*/
	/**
	* Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
	*
	* Returns true only if the area of the intersection is greater than 0.
	* This means that rectangles sharing only a side are not considered intersecting.
	* @example
	* ```ts
	* // Basic intersection check
	* const rect1 = new Rectangle(0, 0, 100, 100);
	* const rect2 = new Rectangle(50, 50, 100, 100);
	* console.log(rect1.intersects(rect2)); // true
	*
	* // With transformation matrix
	* const matrix = new Matrix();
	* matrix.rotate(Math.PI / 4); // 45 degrees
	* console.log(rect1.intersects(rect2, matrix)); // Checks with rotation
	*
	* // Edge cases
	* const zeroWidth = new Rectangle(0, 0, 0, 100);
	* console.log(rect1.intersects(zeroWidth)); // false (no area)
	* ```
	* @remarks
	* - Returns true only if intersection area is > 0
	* - Rectangles sharing only a side are not intersecting
	* - Zero-area rectangles cannot intersect anything
	* - Supports optional transformation matrix
	* @param other - The Rectangle to intersect with `this`
	* @param transform - Optional transformation matrix of `other`
	* @returns True if the transformed `other` Rectangle intersects with `this`
	* @see {@link Rectangle.containsRect} For containment testing
	* @see {@link Rectangle.contains} For point testing
	*/
	intersects(e, t) {
		if (!t) {
			let t = this.x < e.x ? e.x : this.x;
			if ((this.right > e.right ? e.right : this.right) <= t) return !1;
			let n = this.y < e.y ? e.y : this.y;
			return (this.bottom > e.bottom ? e.bottom : this.bottom) > n;
		}
		let n = this.left, r = this.right, i = this.top, a = this.bottom;
		if (r <= n || a <= i) return !1;
		let o = w[0].set(e.left, e.top), s = w[1].set(e.left, e.bottom), c = w[2].set(e.right, e.top), l = w[3].set(e.right, e.bottom);
		if (c.x <= o.x || s.y <= o.y) return !1;
		let u = Math.sign(t.a * t.d - t.b * t.c);
		if (u === 0 || (t.apply(o, o), t.apply(s, s), t.apply(c, c), t.apply(l, l), Math.max(o.x, s.x, c.x, l.x) <= n || Math.min(o.x, s.x, c.x, l.x) >= r || Math.max(o.y, s.y, c.y, l.y) <= i || Math.min(o.y, s.y, c.y, l.y) >= a)) return !1;
		let d = u * (s.y - o.y), f = u * (o.x - s.x), p = d * n + f * i, m = d * r + f * i, h = d * n + f * a, g = d * r + f * a;
		if (Math.max(p, m, h, g) <= d * o.x + f * o.y || Math.min(p, m, h, g) >= d * l.x + f * l.y) return !1;
		let _ = u * (o.y - c.y), v = u * (c.x - o.x), y = _ * n + v * i, b = _ * r + v * i, x = _ * n + v * a, S = _ * r + v * a;
		return !(Math.max(y, b, x, S) <= _ * o.x + v * o.y || Math.min(y, b, x, S) >= _ * l.x + v * l.y);
	}
	/**
	* Pads the rectangle making it grow in all directions.
	*
	* If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
	* @example
	* ```ts
	* // Basic padding
	* const rect = new Rectangle(100, 100, 200, 150);
	* rect.pad(10); // Adds 10px padding on all sides
	*
	* // Different horizontal and vertical padding
	* const uiRect = new Rectangle(0, 0, 100, 50);
	* uiRect.pad(20, 10); // 20px horizontal, 10px vertical
	* ```
	* @remarks
	* - Adjusts x/y by subtracting padding
	* - Increases width/height by padding * 2
	* - Common in UI layout calculations
	* - Chainable with other methods
	* @param paddingX - The horizontal padding amount
	* @param paddingY - The vertical padding amount
	* @returns Returns itself
	* @see {@link Rectangle.enlarge} For growing to include another rectangle
	* @see {@link Rectangle.fit} For shrinking to fit within another rectangle
	*/
	pad(e = 0, t = e) {
		return this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2, this;
	}
	/**
	* Fits this rectangle around the passed one.
	* @example
	* ```ts
	* // Basic fitting
	* const container = new Rectangle(0, 0, 100, 100);
	* const content = new Rectangle(25, 25, 200, 200);
	* content.fit(container); // Clips to container bounds
	* ```
	* @param rectangle - The rectangle to fit around
	* @returns Returns itself
	* @see {@link Rectangle.enlarge} For growing to include another rectangle
	* @see {@link Rectangle.pad} For adding padding around the rectangle
	*/
	fit(e) {
		let t = Math.max(this.x, e.x), n = Math.min(this.x + this.width, e.x + e.width), r = Math.max(this.y, e.y), i = Math.min(this.y + this.height, e.y + e.height);
		return this.x = t, this.width = Math.max(n - t, 0), this.y = r, this.height = Math.max(i - r, 0), this;
	}
	/**
	* Enlarges rectangle so that its corners lie on a grid defined by resolution.
	* @example
	* ```ts
	* // Basic grid alignment
	* const rect = new Rectangle(10.2, 10.6, 100.8, 100.4);
	* rect.ceil(); // Aligns to whole pixels
	*
	* // Custom resolution grid
	* const uiRect = new Rectangle(5.3, 5.7, 50.2, 50.8);
	* uiRect.ceil(0.5); // Aligns to half pixels
	*
	* // Use with precision value
	* const preciseRect = new Rectangle(20.001, 20.999, 100.001, 100.999);
	* preciseRect.ceil(1, 0.01); // Handles small decimal variations
	* ```
	* @param resolution - The grid size to align to (1 = whole pixels)
	* @param eps - Small number to prevent floating point errors
	* @returns Returns itself
	* @see {@link Rectangle.fit} For constraining to bounds
	* @see {@link Rectangle.enlarge} For growing dimensions
	*/
	ceil(e = 1, t = .001) {
		let n = Math.ceil((this.x + this.width - t) * e) / e, r = Math.ceil((this.y + this.height - t) * e) / e;
		return this.x = Math.floor((this.x + t) * e) / e, this.y = Math.floor((this.y + t) * e) / e, this.width = n - this.x, this.height = r - this.y, this;
	}
	/**
	* Scales the rectangle's dimensions and position by the specified factors.
	* @example
	* ```ts
	* const rect = new Rectangle(50, 50, 100, 100);
	*
	* // Scale uniformly
	* rect.scale(0.5, 0.5);
	* // rect is now: x=25, y=25, width=50, height=50
	*
	* // non-uniformly
	* rect.scale(0.5, 1);
	* // rect is now: x=25, y=50, width=50, height=100
	* ```
	* @param x - The factor by which to scale the horizontal properties (x, width).
	* @param y - The factor by which to scale the vertical properties (y, height).
	* @returns Returns itself
	*/
	scale(e, t = e) {
		return this.x *= e, this.y *= t, this.width *= e, this.height *= t, this;
	}
	/**
	* Enlarges this rectangle to include the passed rectangle.
	* @example
	* ```ts
	* // Basic enlargement
	* const rect = new Rectangle(50, 50, 100, 100);
	* const other = new Rectangle(0, 0, 200, 75);
	* rect.enlarge(other);
	* // rect is now: x=0, y=0, width=200, height=150
	*
	* // Use for bounding box calculation
	* const bounds = new Rectangle();
	* objects.forEach((obj) => {
	*     bounds.enlarge(obj.getBounds());
	* });
	* ```
	* @param rectangle - The rectangle to include
	* @returns Returns itself
	* @see {@link Rectangle.fit} For shrinking to fit within another rectangle
	* @see {@link Rectangle.pad} For adding padding around the rectangle
	*/
	enlarge(e) {
		let t = Math.min(this.x, e.x), n = Math.max(this.x + this.width, e.x + e.width), r = Math.min(this.y, e.y), i = Math.max(this.y + this.height, e.y + e.height);
		return this.x = t, this.width = n - t, this.y = r, this.height = i - r, this;
	}
	/**
	* Returns the framing rectangle of the rectangle as a Rectangle object
	* @example
	* ```ts
	* // Basic bounds retrieval
	* const rect = new Rectangle(100, 100, 200, 150);
	* const bounds = rect.getBounds();
	*
	* // Reuse existing rectangle
	* const out = new Rectangle();
	* rect.getBounds(out);
	* ```
	* @param out - Optional rectangle to store the result
	* @returns The framing rectangle
	* @see {@link Rectangle.copyFrom} For direct copying
	* @see {@link Rectangle.clone} For creating new copy
	*/
	getBounds(t) {
		return t ||= new e(), t.copyFrom(this), t;
	}
	/**
	* Determines whether another Rectangle is fully contained within this Rectangle.
	*
	* Rectangles that occupy the same space are considered to be containing each other.
	*
	* Rectangles without area (width or height equal to zero) can't contain anything,
	* not even other arealess rectangles.
	* @example
	* ```ts
	* // Check if one rectangle contains another
	* const container = new Rectangle(0, 0, 100, 100);
	* const inner = new Rectangle(25, 25, 50, 50);
	*
	* console.log(container.containsRect(inner)); // true
	*
	* // Check overlapping rectangles
	* const partial = new Rectangle(75, 75, 50, 50);
	* console.log(container.containsRect(partial)); // false
	*
	* // Zero-area rectangles can't contain anything
	* const empty = new Rectangle(0, 0, 0, 100);
	* console.log(empty.containsRect(inner)); // false
	* ```
	* @param other - The Rectangle to check for containment
	* @returns True if other is fully contained within this Rectangle
	* @see {@link Rectangle.contains} For point containment
	* @see {@link Rectangle.intersects} For overlap testing
	*/
	containsRect(e) {
		if (this.width <= 0 || this.height <= 0) return !1;
		let t = e.x, n = e.y, r = e.x + e.width, i = e.y + e.height;
		return t >= this.x && t < this.x + this.width && n >= this.y && n < this.y + this.height && r >= this.x && r <= this.x + this.width && i >= this.y && i <= this.y + this.height;
	}
	/**
	* Sets the position and dimensions of the rectangle.
	* @example
	* ```ts
	* // Basic usage
	* const rect = new Rectangle();
	* rect.set(100, 100, 200, 150);
	*
	* // Chain with other operations
	* const bounds = new Rectangle()
	*     .set(0, 0, 100, 100)
	*     .pad(10);
	* ```
	* @param x - The X coordinate of the upper-left corner of the rectangle
	* @param y - The Y coordinate of the upper-left corner of the rectangle
	* @param width - The overall width of the rectangle
	* @param height - The overall height of the rectangle
	* @returns Returns itself for method chaining
	* @see {@link Rectangle.copyFrom} For copying from another rectangle
	* @see {@link Rectangle.clone} For creating a new copy
	*/
	set(e, t, n, r) {
		return this.x = e, this.y = t, this.width = n, this.height = r, this;
	}
	toString() {
		return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
	}
}, E = { default: -1 };
function D(e = "default") {
	return E[e] === void 0 && (E[e] = -1), ++E[e];
}
function ee() {
	for (let e in E) delete E[e];
}
//#endregion
//#region node_modules/pixi.js/lib/utils/logging/deprecation.mjs
var te = /* @__PURE__ */ new Set(), O = "8.0.0", ne = "8.3.4", k = {
	quiet: !1,
	noColor: !1
}, A = ((e, t, n = 3) => {
	if (k.quiet || te.has(t)) return;
	let r = (/* @__PURE__ */ Error()).stack, i = `${t}
Deprecated since v${e}`, a = typeof console.groupCollapsed == "function" && !k.noColor;
	r === void 0 ? console.warn("PixiJS Deprecation Warning: ", i) : (r = r.split("\n").splice(n).join("\n"), a ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", i), console.warn(r), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", i), console.warn(r))), te.add(t);
});
Object.defineProperties(A, {
	quiet: {
		get: () => k.quiet,
		set: (e) => {
			k.quiet = e;
		},
		enumerable: !0,
		configurable: !1
	},
	noColor: {
		get: () => k.noColor,
		set: (e) => {
			k.noColor = e;
		},
		enumerable: !0,
		configurable: !1
	}
});
//#endregion
//#region node_modules/pixi.js/lib/utils/misc/NOOP.mjs
var j = () => {};
//#endregion
//#region node_modules/pixi.js/lib/maths/misc/pow2.mjs
function re(e) {
	return e += +(e === 0), --e, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e + 1;
}
function M(e) {
	return !(e & e - 1) && !!e;
}
function ie(e) {
	let t = (e > 65535) << 4;
	e >>>= t;
	let n = (e > 255) << 3;
	return e >>>= n, t |= n, n = (e > 15) << 2, e >>>= n, t |= n, n = (e > 3) << 1, e >>>= n, t |= n, t | e >> 1;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/definedProps.mjs
function N(e) {
	let t = {};
	for (let n in e) e[n] !== void 0 && (t[n] = e[n]);
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/texture/TextureStyle.mjs
var P = /* @__PURE__ */ Object.create(null);
function ae(e) {
	let t = P[e];
	return t === void 0 && (P[e] = D("resource")), t;
}
var oe = class e extends o {
	/**
	* @param options - options for the style
	*/
	constructor(t = {}) {
		super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = {
			...e.defaultOptions,
			...t
		}, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
	}
	set addressMode(e) {
		this.addressModeU = e, this.addressModeV = e, this.addressModeW = e;
	}
	/** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
	get addressMode() {
		return this.addressModeU;
	}
	set wrapMode(e) {
		A(O, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = e;
	}
	get wrapMode() {
		return this.addressMode;
	}
	set scaleMode(e) {
		this.magFilter = e, this.minFilter = e, this.mipmapFilter = e;
	}
	/** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
	get scaleMode() {
		return this.magFilter;
	}
	/** Specifies the maximum anisotropy value clamp used by the sampler. */
	set maxAnisotropy(e) {
		this._maxAnisotropy = Math.min(e, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
	}
	get maxAnisotropy() {
		return this._maxAnisotropy;
	}
	get _resourceId() {
		return this._sharedResourceId || this._generateResourceId();
	}
	update() {
		this._sharedResourceId = null, this.emit("change", this);
	}
	_generateResourceId() {
		let e = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
		return this._sharedResourceId = ae(e), this._resourceId;
	}
	/** Destroys the style */
	destroy() {
		this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
	}
};
/** default options for the style */
oe.defaultOptions = {
	addressMode: "clamp-to-edge",
	scaleMode: "linear"
};
var se = oe, ce = class e extends o {
	/**
	* @param options - options for creating a new TextureSource
	*/
	constructor(t = {}) {
		super(), this.options = t, this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.uid = D("textureSource"), this._resourceType = "textureSource", this._resourceId = D("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.viewDimension = "2d", this.arrayLayerCount = 1, this._ownsStyle = !1, this.antialias = !1, this.transient = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = {
			...e.defaultOptions,
			...t
		}, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, this.pixelWidth = t.width ? t.width * this._resolution : this.resource ? this.resourceWidth ?? 1 : 1, this.pixelHeight = t.height ? t.height * this._resolution : this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.viewDimension = t.viewDimension ?? t.dimensions, this.arrayLayerCount = t.arrayLayerCount, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.transient = t.transient ?? !1, this.alphaMode = t.alphaMode, this.style = new se(N(t)), this._ownsStyle = !0, this.destroyed = !1, this._refreshPOT();
	}
	/** returns itself */
	get source() {
		return this;
	}
	/** the style of the texture */
	get style() {
		return this._style;
	}
	set style(e) {
		this.style !== e && (this._ownsStyle = !1, this._style?.off("change", this._onStyleChange, this), this._style = e, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
	}
	/** Specifies the maximum anisotropy value clamp used by the sampler. */
	set maxAnisotropy(e) {
		this._style.maxAnisotropy = e;
	}
	get maxAnisotropy() {
		return this._style.maxAnisotropy;
	}
	/** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
	get addressMode() {
		return this._style.addressMode;
	}
	set addressMode(e) {
		this._style.addressMode = e;
	}
	/** setting this will set wrapModeU, wrapModeV and wrapModeW all at once! */
	get repeatMode() {
		return this._style.addressMode;
	}
	set repeatMode(e) {
		this._style.addressMode = e;
	}
	/** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
	get magFilter() {
		return this._style.magFilter;
	}
	set magFilter(e) {
		this._style.magFilter = e;
	}
	/** Specifies the sampling behavior when the sample footprint is larger than one texel. */
	get minFilter() {
		return this._style.minFilter;
	}
	set minFilter(e) {
		this._style.minFilter = e;
	}
	/** Specifies behavior for sampling between mipmap levels. */
	get mipmapFilter() {
		return this._style.mipmapFilter;
	}
	set mipmapFilter(e) {
		this._style.mipmapFilter = e;
	}
	/** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
	get lodMinClamp() {
		return this._style.lodMinClamp;
	}
	set lodMinClamp(e) {
		this._style.lodMinClamp = e;
	}
	/** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
	get lodMaxClamp() {
		return this._style.lodMaxClamp;
	}
	set lodMaxClamp(e) {
		this._style.lodMaxClamp = e;
	}
	_onStyleChange() {
		this.emit("styleChange", this);
	}
	/** call this if you have modified the texture outside of the constructor */
	update() {
		if (this.resource) {
			let e = this._resolution;
			if (this.resize(this.resourceWidth / e, this.resourceHeight / e)) return;
		}
		this.emit("update", this);
	}
	/** Destroys this texture source */
	destroy() {
		this.destroyed = !0, this.unload(), this.emit("destroy", this), this._style &&= (this._ownsStyle && this._style.destroy(), null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
	}
	/**
	* This will unload the Texture source from the GPU. This will free up the GPU memory
	* As soon as it is required fore rendering, it will be re-uploaded.
	*/
	unload() {
		this._resourceId = D("resource"), this.emit("change", this), this.emit("unload", this);
		for (let e in this._gpuData) this._gpuData[e]?.destroy?.();
		this._gpuData = /* @__PURE__ */ Object.create(null);
	}
	/** the width of the resource. This is the REAL pure number, not accounting resolution   */
	get resourceWidth() {
		let { resource: e } = this;
		return e.naturalWidth || e.videoWidth || e.displayWidth || e.width;
	}
	/** the height of the resource. This is the REAL pure number, not accounting resolution */
	get resourceHeight() {
		let { resource: e } = this;
		return e.naturalHeight || e.videoHeight || e.displayHeight || e.height;
	}
	/**
	* the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
	* but will the size of the texture when rendered.
	*
	* changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
	* density will have increased)
	*/
	get resolution() {
		return this._resolution;
	}
	set resolution(e) {
		this._resolution !== e && (this._resolution = e, this.width = this.pixelWidth / e, this.height = this.pixelHeight / e);
	}
	/**
	* Resize the texture, this is handy if you want to use the texture as a render texture
	* @param width - the new width of the texture
	* @param height - the new height of the texture
	* @param resolution - the new resolution of the texture
	* @returns - if the texture was resized
	*/
	resize(e, t, n) {
		n ||= this._resolution, e ||= this.width, t ||= this.height;
		let r = Math.round(e * n), i = Math.round(t * n);
		return this.width = r / n, this.height = i / n, this._resolution = n, this.pixelWidth === r && this.pixelHeight === i ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = i, this.emit("resize", this), this._resourceId = D("resource"), this.emit("change", this), !0);
	}
	/**
	* Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
	* This is only important for RenderTexture instances, as standard Texture instances will have their
	* mipmaps generated on upload. You should call this method after you make any change to the texture
	*
	* The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
	* We want you, the developer to specify when this action should happen.
	*
	* Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
	*/
	updateMipmaps() {
		this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
	}
	set wrapMode(e) {
		this._style.wrapMode = e;
	}
	get wrapMode() {
		return this._style.wrapMode;
	}
	set scaleMode(e) {
		this._style.scaleMode = e;
	}
	/** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
	get scaleMode() {
		return this._style.scaleMode;
	}
	/**
	* Refresh check for isPowerOfTwo texture based on size
	* @private
	*/
	_refreshPOT() {
		this.isPowerOfTwo = M(this.pixelWidth) && M(this.pixelHeight);
	}
	static test(e) {
		throw Error("Unimplemented");
	}
};
/** The default options used when creating a new TextureSource. override these to add your own defaults */
ce.defaultOptions = {
	resolution: 1,
	format: "bgra8unorm",
	alphaMode: "premultiply-alpha-on-upload",
	dimensions: "2d",
	viewDimension: "2d",
	arrayLayerCount: 1,
	mipLevelCount: 1,
	autoGenerateMipmaps: !1,
	sampleCount: 1,
	antialias: !1,
	autoGarbageCollect: !1
};
var F = ce, I = class extends F {
	constructor(e) {
		let t = e.resource || new Float32Array(e.width * e.height * 4), n = e.format;
		n ||= t instanceof Float32Array ? "rgba32float" : t instanceof Int32Array || t instanceof Uint32Array ? "rgba32uint" : t instanceof Int16Array || t instanceof Uint16Array ? "rgba16uint" : (t instanceof Int8Array, "bgra8unorm"), super({
			...e,
			resource: t,
			format: n
		}), this.uploadMethodId = "buffer";
	}
	static test(e) {
		return e instanceof Int8Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array;
	}
};
I.extension = n.TextureSource;
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/texture/TextureMatrix.mjs
var le = new f(), ue = class {
	/**
	* @param texture - observed texture
	* @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
	*/
	constructor(e, t) {
		this.mapCoord = new f(), this.uClampFrame = /* @__PURE__ */ new Float32Array(4), this.uClampOffset = /* @__PURE__ */ new Float32Array(2), this._updateID = 0, this.clampOffset = 0, this.clampMargin = t === void 0 ? e.width < 10 ? 0 : .5 : t, this.isSimple = !1, this.texture = e;
	}
	/** Texture property. */
	get texture() {
		return this._texture;
	}
	set texture(e) {
		this._texture !== e && (this._texture?.removeListener("update", this.update, this), this._texture = e, this._texture.addListener("update", this.update, this)), this.update();
	}
	/** Releases the observed texture, removing the `update` listener from it. */
	destroy() {
		this._texture?.removeListener("update", this.update, this), this._texture = null;
	}
	/**
	* Multiplies uvs array to transform
	* @param uvs - mesh uvs
	* @param [out=uvs] - output
	* @returns - output
	*/
	multiplyUvs(e, t) {
		t === void 0 && (t = e);
		let n = this.mapCoord;
		for (let r = 0; r < e.length; r += 2) {
			let i = e[r], a = e[r + 1];
			t[r] = i * n.a + a * n.c + n.tx, t[r + 1] = i * n.b + a * n.d + n.ty;
		}
		return t;
	}
	/**
	* Updates matrices if texture was changed
	* @returns - whether or not it was updated
	*/
	update() {
		let e = this._texture;
		this._updateID++;
		let t = e.uvs;
		this.mapCoord.set(t.x1 - t.x0, t.y1 - t.y0, t.x3 - t.x0, t.y3 - t.y0, t.x0, t.y0);
		let n = e.orig, r = e.trim;
		r && (le.set(n.width / r.width, 0, 0, n.height / r.height, -r.x / r.width, -r.y / r.height), this.mapCoord.append(le));
		let i = e.source, a = this.uClampFrame, o = this.clampMargin / i._resolution, s = this.clampOffset / i._resolution;
		return a[0] = (e.frame.x + o + s) / i.width, a[1] = (e.frame.y + o + s) / i.height, a[2] = (e.frame.x + e.frame.width - o + s) / i.width, a[3] = (e.frame.y + e.frame.height - o + s) / i.height, this.uClampOffset[0] = this.clampOffset / i.pixelWidth, this.uClampOffset[1] = this.clampOffset / i.pixelHeight, this.isSimple = e.frame.width === i.width && e.frame.height === i.height && e.rotate === 0, !0;
	}
}, L = class extends o {
	/**
	* @param {TextureOptions} options - Options for the texture
	*/
	constructor({ source: e, label: t, frame: n, orig: r, trim: i, defaultAnchor: a, defaultBorders: o, rotate: s, dynamic: c } = {}) {
		if (super(), this.uid = D("texture"), this.uvs = {
			x0: 0,
			y0: 0,
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0,
			x3: 0,
			y3: 0
		}, this.frame = new T(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = t, this.source = e?.source ?? new F(), this.noFrame = !n, n) this.frame.copyFrom(n);
		else {
			let { width: e, height: t } = this._source;
			this.frame.width = e, this.frame.height = t;
		}
		this.orig = r || this.frame, this.trim = i, this.rotate = s ?? 0, this.defaultAnchor = a, this.defaultBorders = o, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
	}
	set source(e) {
		this._source && this._source.off("resize", this.update, this), this._source = e, e.on("resize", this.update, this), this.emit("update", this);
	}
	/** the underlying source of the texture (equivalent of baseTexture in v7) */
	get source() {
		return this._source;
	}
	/** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
	get textureMatrix() {
		return this._textureMatrix ||= new ue(this), this._textureMatrix;
	}
	/** The width of the Texture in pixels. */
	get width() {
		return this.orig.width;
	}
	/** The height of the Texture in pixels. */
	get height() {
		return this.orig.height;
	}
	/** Call this function when you have modified the frame of this texture. */
	updateUvs() {
		let { uvs: e, frame: t } = this, { width: n, height: r } = this._source, i = t.x / n, a = t.y / r, o = t.width / n, s = t.height / r, c = this.rotate;
		if (c) {
			let t = o / 2, n = s / 2, r = i + t, l = a + n;
			c = C.add(c, C.NW), e.x0 = r + t * C.uX(c), e.y0 = l + n * C.uY(c), c = C.add(c, 2), e.x1 = r + t * C.uX(c), e.y1 = l + n * C.uY(c), c = C.add(c, 2), e.x2 = r + t * C.uX(c), e.y2 = l + n * C.uY(c), c = C.add(c, 2), e.x3 = r + t * C.uX(c), e.y3 = l + n * C.uY(c);
		} else e.x0 = i, e.y0 = a, e.x1 = i + o, e.y1 = a, e.x2 = i + o, e.y2 = a + s, e.x3 = i, e.y3 = a + s;
	}
	/**
	* Destroys this texture
	* @param destroySource - Destroy the source when the texture is destroyed.
	*/
	destroy(e = !1) {
		this._source && (this._source.off("resize", this.update, this), e && (this._source.destroy(), this._source = null)), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
	}
	/**
	* Call this if you have modified the `texture outside` of the constructor.
	*
	* If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
	*/
	update() {
		this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
	}
	/** @deprecated since 8.0.0 */
	get baseTexture() {
		return A(O, "Texture.baseTexture is now Texture.source"), this._source;
	}
};
L.EMPTY = new L({
	label: "EMPTY",
	source: new F({ label: "EMPTY" })
}), L.EMPTY.destroy = j, L.WHITE = new L({
	source: new I({
		resource: new Uint8Array([
			255,
			255,
			255,
			255
		]),
		width: 1,
		height: 1,
		alphaMode: "premultiply-alpha-on-upload",
		label: "WHITE"
	}),
	label: "WHITE"
}), L.WHITE.destroy = j;
//#endregion
//#region node_modules/pixi.js/lib/scene/container/bounds/Bounds.mjs
var de = new f(), fe = class e {
	/**
	* Creates a new Bounds object.
	* @param minX - The minimum X coordinate of the bounds.
	* @param minY - The minimum Y coordinate of the bounds.
	* @param maxX - The maximum X coordinate of the bounds.
	* @param maxY - The maximum Y coordinate of the bounds.
	*/
	constructor(e = Infinity, t = Infinity, n = -Infinity, r = -Infinity) {
		this.minX = Infinity, this.minY = Infinity, this.maxX = -Infinity, this.maxY = -Infinity, this.matrix = de, this.minX = e, this.minY = t, this.maxX = n, this.maxY = r;
	}
	/**
	* Checks if bounds are empty, meaning either width or height is zero or negative.
	* Empty bounds occur when min values exceed max values on either axis.
	* @example
	* ```ts
	* const bounds = new Bounds();
	*
	* // Check if newly created bounds are empty
	* console.log(bounds.isEmpty()); // true, default bounds are empty
	*
	* // Add frame and check again
	* bounds.addFrame(0, 0, 100, 100);
	* console.log(bounds.isEmpty()); // false, bounds now have area
	*
	* // Clear bounds
	* bounds.clear();
	* console.log(bounds.isEmpty()); // true, bounds are empty again
	* ```
	* @returns True if bounds are empty (have no area)
	* @see {@link Bounds#clear} For resetting bounds
	* @see {@link Bounds#isValid} For checking validity
	*/
	isEmpty() {
		return this.minX > this.maxX || this.minY > this.maxY;
	}
	/**
	* The bounding rectangle representation of these bounds.
	* Lazily creates and updates a Rectangle instance based on the current bounds.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	*
	* // Get rectangle representation
	* const rect = bounds.rectangle;
	* console.log(rect.x, rect.y, rect.width, rect.height);
	*
	* // Use for hit testing
	* if (bounds.rectangle.contains(mouseX, mouseY)) {
	*     console.log('Mouse is inside bounds!');
	* }
	* ```
	* @see {@link Rectangle} For rectangle methods
	* @see {@link Bounds.isEmpty} For bounds validation
	*/
	get rectangle() {
		this._rectangle ||= new T();
		let e = this._rectangle;
		return this.minX > this.maxX || this.minY > this.maxY ? (e.x = 0, e.y = 0, e.width = 0, e.height = 0) : e.copyFromBounds(this), e;
	}
	/**
	* Clears the bounds and resets all coordinates to their default values.
	* Resets the transformation matrix back to identity.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* console.log(bounds.isEmpty()); // false
	* // Clear the bounds
	* bounds.clear();
	* console.log(bounds.isEmpty()); // true
	* ```
	* @returns This bounds object for chaining
	*/
	clear() {
		return this.minX = Infinity, this.minY = Infinity, this.maxX = -Infinity, this.maxY = -Infinity, this.matrix = de, this;
	}
	/**
	* Sets the bounds directly using coordinate values.
	* Provides a way to set all bounds values at once.
	* @example
	* ```ts
	* const bounds = new Bounds();
	* bounds.set(0, 0, 100, 100);
	* ```
	* @param x0 - Left X coordinate of frame
	* @param y0 - Top Y coordinate of frame
	* @param x1 - Right X coordinate of frame
	* @param y1 - Bottom Y coordinate of frame
	* @see {@link Bounds#addFrame} For matrix-aware bounds setting
	* @see {@link Bounds#clear} For resetting bounds
	*/
	set(e, t, n, r) {
		this.minX = e, this.minY = t, this.maxX = n, this.maxY = r;
	}
	/**
	* Adds a rectangular frame to the bounds, optionally transformed by a matrix.
	* Updates the bounds to encompass the new frame coordinates.
	* @example
	* ```ts
	* const bounds = new Bounds();
	* bounds.addFrame(0, 0, 100, 100);
	*
	* // Add transformed frame
	* const matrix = new Matrix()
	*     .translate(50, 50)
	*     .rotate(Math.PI / 4);
	* bounds.addFrame(0, 0, 100, 100, matrix);
	* ```
	* @param x0 - Left X coordinate of frame
	* @param y0 - Top Y coordinate of frame
	* @param x1 - Right X coordinate of frame
	* @param y1 - Bottom Y coordinate of frame
	* @param matrix - Optional transformation matrix
	* @see {@link Bounds#addRect} For adding Rectangle objects
	* @see {@link Bounds#addBounds} For adding other Bounds
	*/
	addFrame(e, t, n, r, i) {
		i ||= this.matrix;
		let a = i.a, o = i.b, s = i.c, c = i.d, l = i.tx, u = i.ty, d = this.minX, f = this.minY, p = this.maxX, m = this.maxY, h = a * e + s * t + l, g = o * e + c * t + u;
		h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * n + s * t + l, g = o * n + c * t + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * e + s * r + l, g = o * e + c * r + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), h = a * n + s * r + l, g = o * n + c * r + u, h < d && (d = h), g < f && (f = g), h > p && (p = h), g > m && (m = g), this.minX = d, this.minY = f, this.maxX = p, this.maxY = m;
	}
	/**
	* Adds a rectangle to the bounds, optionally transformed by a matrix.
	* Updates the bounds to encompass the given rectangle.
	* @example
	* ```ts
	* const bounds = new Bounds();
	* // Add simple rectangle
	* const rect = new Rectangle(0, 0, 100, 100);
	* bounds.addRect(rect);
	*
	* // Add transformed rectangle
	* const matrix = new Matrix()
	*     .translate(50, 50)
	*     .rotate(Math.PI / 4);
	* bounds.addRect(rect, matrix);
	* ```
	* @param rect - The rectangle to be added
	* @param matrix - Optional transformation matrix
	* @see {@link Bounds#addFrame} For adding raw coordinates
	* @see {@link Bounds#addBounds} For adding other bounds
	*/
	addRect(e, t) {
		this.addFrame(e.x, e.y, e.x + e.width, e.y + e.height, t);
	}
	/**
	* Adds another bounds object to this one, optionally transformed by a matrix.
	* Expands the bounds to include the given bounds' area.
	* @example
	* ```ts
	* const bounds = new Bounds();
	*
	* // Add child bounds
	* const childBounds = sprite.getBounds();
	* bounds.addBounds(childBounds);
	*
	* // Add transformed bounds
	* const matrix = new Matrix()
	*     .scale(2, 2);
	* bounds.addBounds(childBounds, matrix);
	* ```
	* @param bounds - The bounds to be added
	* @param matrix - Optional transformation matrix
	* @see {@link Bounds#addFrame} For adding raw coordinates
	* @see {@link Bounds#addRect} For adding rectangles
	*/
	addBounds(e, t) {
		this.addFrame(e.minX, e.minY, e.maxX, e.maxY, t);
	}
	/**
	* Adds other Bounds as a mask, creating an intersection of the two bounds.
	* Only keeps the overlapping region between current bounds and mask bounds.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Create mask bounds
	* const mask = new Bounds();
	* mask.addFrame(50, 50, 150, 150);
	* // Apply mask - results in bounds of (50,50,100,100)
	* bounds.addBoundsMask(mask);
	* ```
	* @param mask - The Bounds to use as a mask
	* @see {@link Bounds#addBounds} For union operation
	* @see {@link Bounds#fit} For fitting to rectangle
	*/
	addBoundsMask(e) {
		this.minX = this.minX > e.minX ? this.minX : e.minX, this.minY = this.minY > e.minY ? this.minY : e.minY, this.maxX = this.maxX < e.maxX ? this.maxX : e.maxX, this.maxY = this.maxY < e.maxY ? this.maxY : e.maxY;
	}
	/**
	* Applies a transformation matrix to the bounds, updating its coordinates.
	* Transforms all corners of the bounds using the given matrix.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Apply translation
	* const translateMatrix = new Matrix()
	*     .translate(50, 50);
	* bounds.applyMatrix(translateMatrix);
	* ```
	* @param matrix - The matrix to apply to the bounds
	* @see {@link Matrix} For matrix operations
	* @see {@link Bounds#addFrame} For adding transformed frames
	*/
	applyMatrix(e) {
		let t = this.minX, n = this.minY, r = this.maxX, i = this.maxY, { a, b: o, c: s, d: c, tx: l, ty: u } = e, d = a * t + s * n + l, f = o * t + c * n + u;
		this.minX = d, this.minY = f, this.maxX = d, this.maxY = f, d = a * r + s * n + l, f = o * r + c * n + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = a * t + s * i + l, f = o * t + c * i + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY, d = a * r + s * i + l, f = o * r + c * i + u, this.minX = d < this.minX ? d : this.minX, this.minY = f < this.minY ? f : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = f > this.maxY ? f : this.maxY;
	}
	/**
	* Resizes the bounds object to fit within the given rectangle.
	* Clips the bounds if they extend beyond the rectangle's edges.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 200, 200);
	* // Fit within viewport
	* const viewport = new Rectangle(50, 50, 100, 100);
	* bounds.fit(viewport);
	* // bounds are now (50, 50, 150, 150)
	* ```
	* @param rect - The rectangle to fit within
	* @returns This bounds object for chaining
	* @see {@link Bounds#addBoundsMask} For intersection
	* @see {@link Bounds#pad} For expanding bounds
	*/
	fit(e) {
		return this.minX < e.left && (this.minX = e.left), this.maxX > e.right && (this.maxX = e.right), this.minY < e.top && (this.minY = e.top), this.maxY > e.bottom && (this.maxY = e.bottom), this;
	}
	/**
	* Resizes the bounds object to include the given bounds.
	* Similar to fit() but works with raw coordinate values instead of a Rectangle.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 200, 200);
	* // Fit to specific coordinates
	* bounds.fitBounds(50, 150, 50, 150);
	* // bounds are now (50, 50, 150, 150)
	* ```
	* @param left - The left value of the bounds
	* @param right - The right value of the bounds
	* @param top - The top value of the bounds
	* @param bottom - The bottom value of the bounds
	* @returns This bounds object for chaining
	* @see {@link Bounds#fit} For fitting to Rectangle
	* @see {@link Bounds#addBoundsMask} For intersection
	*/
	fitBounds(e, t, n, r) {
		return this.minX < e && (this.minX = e), this.maxX > t && (this.maxX = t), this.minY < n && (this.minY = n), this.maxY > r && (this.maxY = r), this;
	}
	/**
	* Pads bounds object, making it grow in all directions.
	* If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	*
	* // Add equal padding
	* bounds.pad(10);
	* // bounds are now (-10, -10, 110, 110)
	*
	* // Add different padding for x and y
	* bounds.pad(20, 10);
	* // bounds are now (-30, -20, 130, 120)
	* ```
	* @param paddingX - The horizontal padding amount
	* @param paddingY - The vertical padding amount
	* @returns This bounds object for chaining
	* @see {@link Bounds#fit} For constraining bounds
	* @see {@link Bounds#scale} For uniform scaling
	*/
	pad(e, t = e) {
		return this.minX -= e, this.maxX += e, this.minY -= t, this.maxY += t, this;
	}
	/**
	* Ceils the bounds by rounding up max values and rounding down min values.
	* Useful for pixel-perfect calculations and avoiding fractional pixels.
	* @example
	* ```ts
	* const bounds = new Bounds();
	* bounds.set(10.2, 10.9, 50.1, 50.8);
	*
	* // Round to whole pixels
	* bounds.ceil();
	* // bounds are now (10, 10, 51, 51)
	* ```
	* @returns This bounds object for chaining
	* @see {@link Bounds#scale} For size adjustments
	* @see {@link Bounds#fit} For constraining bounds
	*/
	ceil() {
		return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
	}
	/**
	* Creates a new Bounds instance with the same values.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	*
	* // Create a copy
	* const copy = bounds.clone();
	*
	* // Original and copy are independent
	* bounds.pad(10);
	* console.log(copy.width === bounds.width); // false
	* ```
	* @returns A new Bounds instance with the same values
	* @see {@link Bounds#copyFrom} For reusing existing bounds
	*/
	clone() {
		return new e(this.minX, this.minY, this.maxX, this.maxY);
	}
	/**
	* Scales the bounds by the given values, adjusting all edges proportionally.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	*
	* // Scale uniformly
	* bounds.scale(2);
	* // bounds are now (0, 0, 200, 200)
	*
	* // Scale non-uniformly
	* bounds.scale(0.5, 2);
	* // bounds are now (0, 0, 100, 400)
	* ```
	* @param x - The X value to scale by
	* @param y - The Y value to scale by (defaults to x)
	* @returns This bounds object for chaining
	* @see {@link Bounds#pad} For adding padding
	* @see {@link Bounds#fit} For constraining size
	*/
	scale(e, t = e) {
		return this.minX *= e, this.minY *= t, this.maxX *= e, this.maxY *= t, this;
	}
	/**
	* The x position of the bounds in local space.
	* Setting this value will move the bounds while maintaining its width.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Get x position
	* console.log(bounds.x); // 0
	*
	* // Move bounds horizontally
	* bounds.x = 50;
	* console.log(bounds.minX, bounds.maxX); // 50, 150
	*
	* // Width stays the same
	* console.log(bounds.width); // Still 100
	* ```
	*/
	get x() {
		return this.minX;
	}
	set x(e) {
		let t = this.maxX - this.minX;
		this.minX = e, this.maxX = e + t;
	}
	/**
	* The y position of the bounds in local space.
	* Setting this value will move the bounds while maintaining its height.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Get y position
	* console.log(bounds.y); // 0
	*
	* // Move bounds vertically
	* bounds.y = 50;
	* console.log(bounds.minY, bounds.maxY); // 50, 150
	*
	* // Height stays the same
	* console.log(bounds.height); // Still 100
	* ```
	*/
	get y() {
		return this.minY;
	}
	set y(e) {
		let t = this.maxY - this.minY;
		this.minY = e, this.maxY = e + t;
	}
	/**
	* The width value of the bounds.
	* Represents the distance between minX and maxX coordinates.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Get width
	* console.log(bounds.width); // 100
	* // Resize width
	* bounds.width = 200;
	* console.log(bounds.maxX - bounds.minX); // 200
	* ```
	*/
	get width() {
		return this.maxX - this.minX;
	}
	set width(e) {
		this.maxX = this.minX + e;
	}
	/**
	* The height value of the bounds.
	* Represents the distance between minY and maxY coordinates.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Get height
	* console.log(bounds.height); // 100
	* // Resize height
	* bounds.height = 150;
	* console.log(bounds.maxY - bounds.minY); // 150
	* ```
	*/
	get height() {
		return this.maxY - this.minY;
	}
	set height(e) {
		this.maxY = this.minY + e;
	}
	/**
	* The left edge coordinate of the bounds.
	* Alias for minX.
	* @example
	* ```ts
	* const bounds = new Bounds(50, 0, 150, 100);
	* console.log(bounds.left); // 50
	* console.log(bounds.left === bounds.minX); // true
	* ```
	* @readonly
	*/
	get left() {
		return this.minX;
	}
	/**
	* The right edge coordinate of the bounds.
	* Alias for maxX.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* console.log(bounds.right); // 100
	* console.log(bounds.right === bounds.maxX); // true
	* ```
	* @readonly
	*/
	get right() {
		return this.maxX;
	}
	/**
	* The top edge coordinate of the bounds.
	* Alias for minY.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 25, 100, 125);
	* console.log(bounds.top); // 25
	* console.log(bounds.top === bounds.minY); // true
	* ```
	* @readonly
	*/
	get top() {
		return this.minY;
	}
	/**
	* The bottom edge coordinate of the bounds.
	* Alias for maxY.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 200);
	* console.log(bounds.bottom); // 200
	* console.log(bounds.bottom === bounds.maxY); // true
	* ```
	* @readonly
	*/
	get bottom() {
		return this.maxY;
	}
	/**
	* Whether the bounds has positive width and height.
	* Checks if both dimensions are greater than zero.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Check if bounds are positive
	* console.log(bounds.isPositive); // true
	*
	* // Negative bounds
	* bounds.maxX = bounds.minX;
	* console.log(bounds.isPositive); // false, width is 0
	* ```
	* @readonly
	* @see {@link Bounds#isEmpty} For checking empty state
	* @see {@link Bounds#isValid} For checking validity
	*/
	get isPositive() {
		return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
	}
	/**
	* Whether the bounds has valid coordinates.
	* Checks if the bounds has been initialized with real values.
	* @example
	* ```ts
	* const bounds = new Bounds();
	* console.log(bounds.isValid); // false, default state
	*
	* // Set valid bounds
	* bounds.addFrame(0, 0, 100, 100);
	* console.log(bounds.isValid); // true
	* ```
	* @readonly
	* @see {@link Bounds#isEmpty} For checking empty state
	* @see {@link Bounds#isPositive} For checking dimensions
	*/
	get isValid() {
		return this.minX + this.minY !== Infinity;
	}
	/**
	* Adds vertices from a Float32Array to the bounds, optionally transformed by a matrix.
	* Used for efficiently updating bounds from raw vertex data.
	* @example
	* ```ts
	* const bounds = new Bounds();
	*
	* // Add vertices from geometry
	* const vertices = new Float32Array([
	*     0, 0,    // Vertex 1
	*     100, 0,  // Vertex 2
	*     100, 100 // Vertex 3
	* ]);
	* bounds.addVertexData(vertices, 0, 6);
	*
	* // Add transformed vertices
	* const matrix = new Matrix()
	*     .translate(50, 50)
	*     .rotate(Math.PI / 4);
	* bounds.addVertexData(vertices, 0, 6, matrix);
	*
	* // Add subset of vertices
	* bounds.addVertexData(vertices, 2, 4); // Only second vertex
	* ```
	* @param vertexData - The array of vertices to add
	* @param beginOffset - Starting index in the vertex array
	* @param endOffset - Ending index in the vertex array (excluded)
	* @param matrix - Optional transformation matrix
	* @see {@link Bounds#addFrame} For adding rectangular frames
	* @see {@link Matrix} For transformation details
	*/
	addVertexData(e, t, n, r) {
		let i = this.minX, a = this.minY, o = this.maxX, s = this.maxY;
		r ||= this.matrix;
		let c = r.a, l = r.b, u = r.c, d = r.d, f = r.tx, p = r.ty;
		for (let r = t; r < n; r += 2) {
			let t = e[r], n = e[r + 1], m = c * t + u * n + f, h = l * t + d * n + p;
			i = m < i ? m : i, a = h < a ? h : a, o = m > o ? m : o, s = h > s ? h : s;
		}
		this.minX = i, this.minY = a, this.maxX = o, this.maxY = s;
	}
	/**
	* Checks if a point is contained within the bounds.
	* Returns true if the point's coordinates fall within the bounds' area.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* // Basic point check
	* console.log(bounds.containsPoint(50, 50)); // true
	* console.log(bounds.containsPoint(150, 150)); // false
	*
	* // Check edges
	* console.log(bounds.containsPoint(0, 0));   // true, includes edges
	* console.log(bounds.containsPoint(100, 100)); // true, includes edges
	* ```
	* @param x - x coordinate to check
	* @param y - y coordinate to check
	* @returns True if the point is inside the bounds
	* @see {@link Bounds#isPositive} For valid bounds check
	* @see {@link Bounds#rectangle} For Rectangle representation
	*/
	containsPoint(e, t) {
		return this.minX <= e && this.minY <= t && this.maxX >= e && this.maxY >= t;
	}
	/**
	* Returns a string representation of the bounds.
	* Useful for debugging and logging bounds information.
	* @example
	* ```ts
	* const bounds = new Bounds(0, 0, 100, 100);
	* console.log(bounds.toString()); // "[pixi.js:Bounds minX=0 minY=0 maxX=100 maxY=100 width=100 height=100]"
	* ```
	* @returns A string describing the bounds
	* @see {@link Bounds#copyFrom} For copying bounds
	* @see {@link Bounds#clone} For creating a new instance
	*/
	toString() {
		return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
	}
	/**
	* Copies the bounds from another bounds object.
	* Useful for reusing bounds objects and avoiding allocations.
	* @example
	* ```ts
	* const sourceBounds = new Bounds(0, 0, 100, 100);
	* // Copy bounds
	* const targetBounds = new Bounds();
	* targetBounds.copyFrom(sourceBounds);
	* ```
	* @param bounds - The bounds to copy from
	* @returns This bounds object for chaining
	* @see {@link Bounds#clone} For creating new instances
	*/
	copyFrom(e) {
		return this.minX = e.minX, this.minY = e.minY, this.maxX = e.maxX, this.maxY = e.maxY, this;
	}
}, pe = {
	grad: .9,
	turn: 360,
	rad: 360 / (2 * Math.PI)
}, R = function(e) {
	return typeof e == "string" ? e.length > 0 : typeof e == "number";
}, z = function(e, t, n) {
	return t === void 0 && (t = 0), n === void 0 && (n = 10 ** t), Math.round(n * e) / n + 0;
}, B = function(e, t, n) {
	return t === void 0 && (t = 0), n === void 0 && (n = 1), e > n ? n : e > t ? e : t;
}, V = function(e) {
	return (e = isFinite(e) ? e % 360 : 0) > 0 ? e : e + 360;
}, me = function(e) {
	return {
		r: B(e.r, 0, 255),
		g: B(e.g, 0, 255),
		b: B(e.b, 0, 255),
		a: B(e.a)
	};
}, H = function(e) {
	return {
		r: z(e.r),
		g: z(e.g),
		b: z(e.b),
		a: z(e.a, 3)
	};
}, he = /^#([0-9a-f]{3,8})$/i, U = function(e) {
	var t = e.toString(16);
	return t.length < 2 ? "0" + t : t;
}, ge = function(e) {
	var t = e.r, n = e.g, r = e.b, i = e.a, a = Math.max(t, n, r), o = a - Math.min(t, n, r), s = o ? a === t ? (n - r) / o : a === n ? 2 + (r - t) / o : 4 + (t - n) / o : 0;
	return {
		h: 60 * (s < 0 ? s + 6 : s),
		s: a ? o / a * 100 : 0,
		v: a / 255 * 100,
		a: i
	};
}, _e = function(e) {
	var t = e.h, n = e.s, r = e.v, i = e.a;
	t = t / 360 * 6, n /= 100, r /= 100;
	var a = Math.floor(t), o = r * (1 - n), s = r * (1 - (t - a) * n), c = r * (1 - (1 - t + a) * n), l = a % 6;
	return {
		r: 255 * [
			r,
			s,
			o,
			o,
			c,
			r
		][l],
		g: 255 * [
			c,
			r,
			r,
			s,
			o,
			o
		][l],
		b: 255 * [
			o,
			o,
			c,
			r,
			r,
			s
		][l],
		a: i
	};
}, ve = function(e) {
	return {
		h: V(e.h),
		s: B(e.s, 0, 100),
		l: B(e.l, 0, 100),
		a: B(e.a)
	};
}, ye = function(e) {
	return {
		h: z(e.h),
		s: z(e.s),
		l: z(e.l),
		a: z(e.a, 3)
	};
}, be = function(e) {
	return _e((n = (t = e).s, {
		h: t.h,
		s: (n *= ((r = t.l) < 50 ? r : 100 - r) / 100) > 0 ? 2 * n / (r + n) * 100 : 0,
		v: r + n,
		a: t.a
	}));
	var t, n, r;
}, W = function(e) {
	return {
		h: (t = ge(e)).h,
		s: (i = (200 - (n = t.s)) * (r = t.v) / 100) > 0 && i < 200 ? n * r / 100 / (i <= 100 ? i : 200 - i) * 100 : 0,
		l: i / 2,
		a: t.a
	};
	var t, n, r, i;
}, xe = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Se = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ce = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, we = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, G = {
	string: [
		[function(e) {
			var t = he.exec(e);
			return t ? (e = t[1]).length <= 4 ? {
				r: parseInt(e[0] + e[0], 16),
				g: parseInt(e[1] + e[1], 16),
				b: parseInt(e[2] + e[2], 16),
				a: e.length === 4 ? z(parseInt(e[3] + e[3], 16) / 255, 2) : 1
			} : e.length === 6 || e.length === 8 ? {
				r: parseInt(e.substr(0, 2), 16),
				g: parseInt(e.substr(2, 2), 16),
				b: parseInt(e.substr(4, 2), 16),
				a: e.length === 8 ? z(parseInt(e.substr(6, 2), 16) / 255, 2) : 1
			} : null : null;
		}, "hex"],
		[function(e) {
			var t = Ce.exec(e) || we.exec(e);
			return t ? t[2] !== t[4] || t[4] !== t[6] ? null : me({
				r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
				g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
				b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
				a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
			}) : null;
		}, "rgb"],
		[function(e) {
			var t = xe.exec(e) || Se.exec(e);
			if (!t) return null;
			var n, r;
			return be(ve({
				h: (n = t[1], r = t[2], r === void 0 && (r = "deg"), Number(n) * (pe[r] || 1)),
				s: Number(t[3]),
				l: Number(t[4]),
				a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
			}));
		}, "hsl"]
	],
	object: [
		[function(e) {
			var t = e.r, n = e.g, r = e.b, i = e.a, a = i === void 0 ? 1 : i;
			return R(t) && R(n) && R(r) ? me({
				r: Number(t),
				g: Number(n),
				b: Number(r),
				a: Number(a)
			}) : null;
		}, "rgb"],
		[function(e) {
			var t = e.h, n = e.s, r = e.l, i = e.a, a = i === void 0 ? 1 : i;
			return !R(t) || !R(n) || !R(r) ? null : be(ve({
				h: Number(t),
				s: Number(n),
				l: Number(r),
				a: Number(a)
			}));
		}, "hsl"],
		[function(e) {
			var t = e.h, n = e.s, r = e.v, i = e.a, a = i === void 0 ? 1 : i;
			return !R(t) || !R(n) || !R(r) ? null : _e(function(e) {
				return {
					h: V(e.h),
					s: B(e.s, 0, 100),
					v: B(e.v, 0, 100),
					a: B(e.a)
				};
			}({
				h: Number(t),
				s: Number(n),
				v: Number(r),
				a: Number(a)
			}));
		}, "hsv"]
	]
}, Te = function(e, t) {
	for (var n = 0; n < t.length; n++) {
		var r = t[n][0](e);
		if (r) return [r, t[n][1]];
	}
	return [null, void 0];
}, Ee = function(e) {
	return typeof e == "string" ? Te(e.trim(), G.string) : typeof e == "object" && e ? Te(e, G.object) : [null, void 0];
}, K = function(e, t) {
	var n = W(e);
	return {
		h: n.h,
		s: B(n.s + 100 * t, 0, 100),
		l: n.l,
		a: n.a
	};
}, q = function(e) {
	return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3 / 255;
}, De = function(e, t) {
	var n = W(e);
	return {
		h: n.h,
		s: n.s,
		l: B(n.l + 100 * t, 0, 100),
		a: n.a
	};
}, J = function() {
	function e(e) {
		this.parsed = Ee(e)[0], this.rgba = this.parsed || {
			r: 0,
			g: 0,
			b: 0,
			a: 1
		};
	}
	return e.prototype.isValid = function() {
		return this.parsed !== null;
	}, e.prototype.brightness = function() {
		return z(q(this.rgba), 2);
	}, e.prototype.isDark = function() {
		return q(this.rgba) < .5;
	}, e.prototype.isLight = function() {
		return q(this.rgba) >= .5;
	}, e.prototype.toHex = function() {
		return e = H(this.rgba), t = e.r, n = e.g, r = e.b, a = (i = e.a) < 1 ? U(z(255 * i)) : "", "#" + U(t) + U(n) + U(r) + a;
		var e, t, n, r, i, a;
	}, e.prototype.toRgb = function() {
		return H(this.rgba);
	}, e.prototype.toRgbString = function() {
		return e = H(this.rgba), t = e.r, n = e.g, r = e.b, (i = e.a) < 1 ? "rgba(" + t + ", " + n + ", " + r + ", " + i + ")" : "rgb(" + t + ", " + n + ", " + r + ")";
		var e, t, n, r, i;
	}, e.prototype.toHsl = function() {
		return ye(W(this.rgba));
	}, e.prototype.toHslString = function() {
		return e = ye(W(this.rgba)), t = e.h, n = e.s, r = e.l, (i = e.a) < 1 ? "hsla(" + t + ", " + n + "%, " + r + "%, " + i + ")" : "hsl(" + t + ", " + n + "%, " + r + "%)";
		var e, t, n, r, i;
	}, e.prototype.toHsv = function() {
		return e = ge(this.rgba), {
			h: z(e.h),
			s: z(e.s),
			v: z(e.v),
			a: z(e.a, 3)
		};
		var e;
	}, e.prototype.invert = function() {
		return Y({
			r: 255 - (e = this.rgba).r,
			g: 255 - e.g,
			b: 255 - e.b,
			a: e.a
		});
		var e;
	}, e.prototype.saturate = function(e) {
		return e === void 0 && (e = .1), Y(K(this.rgba, e));
	}, e.prototype.desaturate = function(e) {
		return e === void 0 && (e = .1), Y(K(this.rgba, -e));
	}, e.prototype.grayscale = function() {
		return Y(K(this.rgba, -1));
	}, e.prototype.lighten = function(e) {
		return e === void 0 && (e = .1), Y(De(this.rgba, e));
	}, e.prototype.darken = function(e) {
		return e === void 0 && (e = .1), Y(De(this.rgba, -e));
	}, e.prototype.rotate = function(e) {
		return e === void 0 && (e = 15), this.hue(this.hue() + e);
	}, e.prototype.alpha = function(e) {
		return typeof e == "number" ? Y({
			r: (t = this.rgba).r,
			g: t.g,
			b: t.b,
			a: e
		}) : z(this.rgba.a, 3);
		var t;
	}, e.prototype.hue = function(e) {
		var t = W(this.rgba);
		return typeof e == "number" ? Y({
			h: e,
			s: t.s,
			l: t.l,
			a: t.a
		}) : z(t.h);
	}, e.prototype.isEqual = function(e) {
		return this.toHex() === Y(e).toHex();
	}, e;
}(), Y = function(e) {
	return e instanceof J ? e : new J(e);
}, Oe = [], ke = function(e) {
	e.forEach(function(e) {
		Oe.indexOf(e) < 0 && (e(J, G), Oe.push(e));
	});
};
//#endregion
//#region node_modules/@pixi/colord/plugins/names.mjs
function Ae(e, t) {
	var n = {
		white: "#ffffff",
		bisque: "#ffe4c4",
		blue: "#0000ff",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		azure: "#f0ffff",
		whitesmoke: "#f5f5f5",
		papayawhip: "#ffefd5",
		plum: "#dda0dd",
		blanchedalmond: "#ffebcd",
		black: "#000000",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gainsboro: "#dcdcdc",
		cornsilk: "#fff8dc",
		cornflowerblue: "#6495ed",
		burlywood: "#deb887",
		aquamarine: "#7fffd4",
		beige: "#f5f5dc",
		crimson: "#dc143c",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkkhaki: "#bdb76b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkgrey: "#a9a9a9",
		peachpuff: "#ffdab9",
		darkmagenta: "#8b008b",
		darkred: "#8b0000",
		darkorchid: "#9932cc",
		darkorange: "#ff8c00",
		darkslateblue: "#483d8b",
		gray: "#808080",
		darkslategray: "#2f4f4f",
		darkslategrey: "#2f4f4f",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		wheat: "#f5deb3",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		ghostwhite: "#f8f8ff",
		darkviolet: "#9400d3",
		magenta: "#ff00ff",
		green: "#008000",
		dodgerblue: "#1e90ff",
		grey: "#808080",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		blueviolet: "#8a2be2",
		forestgreen: "#228b22",
		lawngreen: "#7cfc00",
		indianred: "#cd5c5c",
		indigo: "#4b0082",
		fuchsia: "#ff00ff",
		brown: "#a52a2a",
		maroon: "#800000",
		mediumblue: "#0000cd",
		lightcoral: "#f08080",
		darkturquoise: "#00ced1",
		lightcyan: "#e0ffff",
		ivory: "#fffff0",
		lightyellow: "#ffffe0",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		linen: "#faf0e6",
		mediumaquamarine: "#66cdaa",
		lemonchiffon: "#fffacd",
		lime: "#00ff00",
		khaki: "#f0e68c",
		mediumseagreen: "#3cb371",
		limegreen: "#32cd32",
		mediumspringgreen: "#00fa9a",
		lightskyblue: "#87cefa",
		lightblue: "#add8e6",
		midnightblue: "#191970",
		lightpink: "#ffb6c1",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		mintcream: "#f5fffa",
		lightslategray: "#778899",
		lightslategrey: "#778899",
		navajowhite: "#ffdead",
		navy: "#000080",
		mediumvioletred: "#c71585",
		powderblue: "#b0e0e6",
		palegoldenrod: "#eee8aa",
		oldlace: "#fdf5e6",
		paleturquoise: "#afeeee",
		mediumturquoise: "#48d1cc",
		mediumorchid: "#ba55d3",
		rebeccapurple: "#663399",
		lightsteelblue: "#b0c4de",
		mediumslateblue: "#7b68ee",
		thistle: "#d8bfd8",
		tan: "#d2b48c",
		orchid: "#da70d6",
		mediumpurple: "#9370db",
		purple: "#800080",
		pink: "#ffc0cb",
		skyblue: "#87ceeb",
		springgreen: "#00ff7f",
		palegreen: "#98fb98",
		red: "#ff0000",
		yellow: "#ffff00",
		slateblue: "#6a5acd",
		lavenderblush: "#fff0f5",
		peru: "#cd853f",
		palevioletred: "#db7093",
		violet: "#ee82ee",
		teal: "#008080",
		slategray: "#708090",
		slategrey: "#708090",
		aliceblue: "#f0f8ff",
		darkseagreen: "#8fbc8f",
		darkolivegreen: "#556b2f",
		greenyellow: "#adff2f",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		tomato: "#ff6347",
		silver: "#c0c0c0",
		sienna: "#a0522d",
		lavender: "#e6e6fa",
		lightgreen: "#90ee90",
		orange: "#ffa500",
		orangered: "#ff4500",
		steelblue: "#4682b4",
		royalblue: "#4169e1",
		turquoise: "#40e0d0",
		yellowgreen: "#9acd32",
		salmon: "#fa8072",
		saddlebrown: "#8b4513",
		sandybrown: "#f4a460",
		rosybrown: "#bc8f8f",
		darksalmon: "#e9967a",
		lightgoldenrodyellow: "#fafad2",
		snow: "#fffafa",
		lightgrey: "#d3d3d3",
		lightgray: "#d3d3d3",
		dimgray: "#696969",
		dimgrey: "#696969",
		olivedrab: "#6b8e23",
		olive: "#808000"
	}, r = {};
	for (var i in n) r[n[i]] = i;
	var a = {};
	e.prototype.toName = function(t) {
		if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
		var i, o, s = r[this.toHex()];
		if (s) return s;
		if (t?.closest) {
			var c = this.toRgb(), l = 1 / 0, u = "black";
			if (!a.length) for (var d in n) a[d] = new e(n[d]).toRgb();
			for (var f in n) {
				var p = (i = c, o = a[f], (i.r - o.r) ** 2 + (i.g - o.g) ** 2 + (i.b - o.b) ** 2);
				p < l && (l = p, u = f);
			}
			return u;
		}
	}, t.string.push([function(t) {
		var r = t.toLowerCase(), i = r === "transparent" ? "#0000" : n[r];
		return i ? new e(i).toRgb() : null;
	}, "name"]);
}
//#endregion
//#region node_modules/pixi.js/lib/color/Color.mjs
ke([Ae]);
var X = class e {
	/**
	* @param {ColorSource} value - Optional value to use, if not provided, white is used.
	*/
	constructor(e = 16777215) {
		this._value = null, this._components = /* @__PURE__ */ new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = e;
	}
	/**
	* Get the red component of the color, normalized between 0 and 1.
	* @example
	* ```ts
	* const color = new Color('red');
	* console.log(color.red); // 1
	*
	* const green = new Color('#00ff00');
	* console.log(green.red); // 0
	* ```
	*/
	get red() {
		return this._components[0];
	}
	/**
	* Get the green component of the color, normalized between 0 and 1.
	* @example
	* ```ts
	* const color = new Color('lime');
	* console.log(color.green); // 1
	*
	* const red = new Color('#ff0000');
	* console.log(red.green); // 0
	* ```
	*/
	get green() {
		return this._components[1];
	}
	/**
	* Get the blue component of the color, normalized between 0 and 1.
	* @example
	* ```ts
	* const color = new Color('blue');
	* console.log(color.blue); // 1
	*
	* const yellow = new Color('#ffff00');
	* console.log(yellow.blue); // 0
	* ```
	*/
	get blue() {
		return this._components[2];
	}
	/**
	* Get the alpha component of the color, normalized between 0 and 1.
	* @example
	* ```ts
	* const color = new Color('red');
	* console.log(color.alpha); // 1 (fully opaque)
	*
	* const transparent = new Color('rgba(255, 0, 0, 0.5)');
	* console.log(transparent.alpha); // 0.5 (semi-transparent)
	* ```
	*/
	get alpha() {
		return this._components[3];
	}
	/**
	* Sets the color value and returns the instance for chaining.
	*
	* This is a chainable version of setting the `value` property.
	* @param value - The color to set. Accepts various formats:
	* - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
	* - RGB/RGBA values (arrays, objects)
	* - CSS color names
	* - HSL/HSLA values
	* - HSV/HSVA values
	* @returns The Color instance for chaining
	* @example
	* ```ts
	* // Basic usage
	* const color = new Color();
	* color.setValue('#ff0000')
	*     .setAlpha(0.5)
	*     .premultiply(0.8);
	*
	* // Different formats
	* color.setValue(0xff0000);          // Hex number
	* color.setValue('#ff0000');         // Hex string
	* color.setValue([1, 0, 0]);         // RGB array
	* color.setValue([1, 0, 0, 0.5]);    // RGBA array
	* color.setValue({ r: 1, g: 0, b: 0 }); // RGB object
	*
	* // Copy from another color
	* const red = new Color('red');
	* color.setValue(red);
	* ```
	* @throws {Error} If the color value is invalid or null
	* @see {@link Color.value} For the underlying value property
	*/
	setValue(e) {
		return this.value = e, this;
	}
	/**
	* The current color source. This property allows getting and setting the color value
	* while preserving the original format where possible.
	* @remarks
	* When setting:
	* - Setting to a `Color` instance copies its source and components
	* - Setting to other valid sources normalizes and stores the value
	* - Setting to `null` throws an Error
	* - The color remains unchanged if normalization fails
	*
	* When getting:
	* - Returns `null` if color was modified by {@link Color.multiply} or {@link Color.premultiply}
	* - Otherwise returns the original color source
	* @example
	* ```ts
	* // Setting different color formats
	* const color = new Color();
	*
	* color.value = 0xff0000;         // Hex number
	* color.value = '#ff0000';        // Hex string
	* color.value = [1, 0, 0];        // RGB array
	* color.value = [1, 0, 0, 0.5];   // RGBA array
	* color.value = { r: 1, g: 0, b: 0 }; // RGB object
	*
	* // Copying from another color
	* const red = new Color('red');
	* color.value = red;  // Copies red's components
	*
	* // Getting the value
	* console.log(color.value);  // Returns original format
	*
	* // After modifications
	* color.multiply([0.5, 0.5, 0.5]);
	* console.log(color.value);  // Returns null
	* ```
	* @throws {Error} When attempting to set `null`
	*/
	set value(t) {
		if (t instanceof e) this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
		else if (t === null) throw Error("Cannot set Color#value to null");
		else (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
	}
	get value() {
		return this._value;
	}
	/**
	* Copy a color source internally.
	* @param value - Color source
	*/
	_cloneSource(e) {
		return typeof e == "string" || typeof e == "number" || e instanceof Number || e === null ? e : Array.isArray(e) || ArrayBuffer.isView(e) ? e.slice(0) : typeof e == "object" && e ? { ...e } : e;
	}
	/**
	* Equality check for color sources.
	* @param value1 - First color source
	* @param value2 - Second color source
	* @returns `true` if the color sources are equal, `false` otherwise.
	*/
	_isSourceEqual(e, t) {
		let n = typeof e;
		if (n !== typeof t) return !1;
		if (n === "number" || n === "string" || e instanceof Number) return e === t;
		if (Array.isArray(e) && Array.isArray(t) || ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) return e.length === t.length && e.every((e, n) => e === t[n]);
		if (e !== null && t !== null) {
			let n = Object.keys(e), r = Object.keys(t);
			return n.length === r.length && n.every((n) => e[n] === t[n]);
		}
		return e === t;
	}
	/**
	* Convert to a RGBA color object with normalized components (0-1).
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Convert colors to RGBA objects
	* new Color('white').toRgba();     // returns { r: 1, g: 1, b: 1, a: 1 }
	* new Color('#ff0000').toRgba();   // returns { r: 1, g: 0, b: 0, a: 1 }
	*
	* // With transparency
	* new Color('rgba(255,0,0,0.5)').toRgba(); // returns { r: 1, g: 0, b: 0, a: 0.5 }
	* ```
	* @returns An RGBA object with normalized components
	*/
	toRgba() {
		let [e, t, n, r] = this._components;
		return {
			r: e,
			g: t,
			b: n,
			a: r
		};
	}
	/**
	* Convert to a RGB color object with normalized components (0-1).
	*
	* Alpha component is omitted in the output.
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Convert colors to RGB objects
	* new Color('white').toRgb();     // returns { r: 1, g: 1, b: 1 }
	* new Color('#ff0000').toRgb();   // returns { r: 1, g: 0, b: 0 }
	*
	* // Alpha is ignored
	* new Color('rgba(255,0,0,0.5)').toRgb(); // returns { r: 1, g: 0, b: 0 }
	* ```
	* @returns An RGB object with normalized components
	*/
	toRgb() {
		let [e, t, n] = this._components;
		return {
			r: e,
			g: t,
			b: n
		};
	}
	/**
	* Convert to a CSS-style rgba string representation.
	*
	* RGB components are scaled to 0-255 range, alpha remains 0-1.
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Convert colors to RGBA strings
	* new Color('white').toRgbaString();     // returns "rgba(255,255,255,1)"
	* new Color('#ff0000').toRgbaString();   // returns "rgba(255,0,0,1)"
	*
	* // With transparency
	* new Color([1, 0, 0, 0.5]).toRgbaString(); // returns "rgba(255,0,0,0.5)"
	* ```
	* @returns A CSS-compatible rgba string
	*/
	toRgbaString() {
		let [e, t, n] = this.toUint8RgbArray();
		return `rgba(${e},${t},${n},${this.alpha})`;
	}
	/**
	* Convert to an [R, G, B] array of clamped uint8 values (0 to 255).
	* @param {number[]|Uint8Array|Uint8ClampedArray} [out] - Optional output array. If not provided,
	* a cached array will be used and returned.
	* @returns Array containing RGB components as integers between 0-255
	* @example
	* ```ts
	* // Basic usage
	* new Color('white').toUint8RgbArray(); // returns [255, 255, 255]
	* new Color('#ff0000').toUint8RgbArray(); // returns [255, 0, 0]
	*
	* // Using custom output array
	* const rgb = new Uint8Array(3);
	* new Color('blue').toUint8RgbArray(rgb); // rgb is now [0, 0, 255]
	*
	* // Using different array types
	* new Color('red').toUint8RgbArray(new Uint8ClampedArray(3)); // [255, 0, 0]
	* new Color('red').toUint8RgbArray([]); // [255, 0, 0]
	* ```
	* @remarks
	* - Output values are always clamped between 0-255
	* - Alpha component is not included in output
	* - Reuses internal cache array if no output array provided
	*/
	toUint8RgbArray(e) {
		let [t, n, r] = this._components;
		return this._arrayRgb ||= [], e ||= this._arrayRgb, e[0] = Math.round(t * 255), e[1] = Math.round(n * 255), e[2] = Math.round(r * 255), e;
	}
	/**
	* Convert to an [R, G, B, A] array of normalized floats (numbers from 0.0 to 1.0).
	* @param {number[]|Float32Array} [out] - Optional output array. If not provided,
	* a cached array will be used and returned.
	* @returns Array containing RGBA components as floats between 0-1
	* @example
	* ```ts
	* // Basic usage
	* new Color('white').toArray();  // returns [1, 1, 1, 1]
	* new Color('red').toArray();    // returns [1, 0, 0, 1]
	*
	* // With alpha
	* new Color('rgba(255,0,0,0.5)').toArray(); // returns [1, 0, 0, 0.5]
	*
	* // Using custom output array
	* const rgba = new Float32Array(4);
	* new Color('blue').toArray(rgba); // rgba is now [0, 0, 1, 1]
	* ```
	* @remarks
	* - Output values are normalized between 0-1
	* - Includes alpha component as the fourth value
	* - Reuses internal cache array if no output array provided
	*/
	toArray(e) {
		this._arrayRgba ||= [], e ||= this._arrayRgba;
		let [t, n, r, i] = this._components;
		return e[0] = t, e[1] = n, e[2] = r, e[3] = i, e;
	}
	/**
	* Convert to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
	* @param {number[]|Float32Array} [out] - Optional output array. If not provided,
	* a cached array will be used and returned.
	* @returns Array containing RGB components as floats between 0-1
	* @example
	* ```ts
	* // Basic usage
	* new Color('white').toRgbArray(); // returns [1, 1, 1]
	* new Color('red').toRgbArray();   // returns [1, 0, 0]
	*
	* // Using custom output array
	* const rgb = new Float32Array(3);
	* new Color('blue').toRgbArray(rgb); // rgb is now [0, 0, 1]
	* ```
	* @remarks
	* - Output values are normalized between 0-1
	* - Alpha component is omitted from output
	* - Reuses internal cache array if no output array provided
	*/
	toRgbArray(e) {
		this._arrayRgb ||= [], e ||= this._arrayRgb;
		let [t, n, r] = this._components;
		return e[0] = t, e[1] = n, e[2] = r, e;
	}
	/**
	* Convert to a hexadecimal number.
	* @returns The color as a 24-bit RGB integer
	* @example
	* ```ts
	* // Basic usage
	* new Color('white').toNumber(); // returns 0xffffff
	* new Color('red').toNumber();   // returns 0xff0000
	*
	* // Store as hex
	* const color = new Color('blue');
	* const hex = color.toNumber(); // 0x0000ff
	* ```
	*/
	toNumber() {
		return this._int;
	}
	/**
	* Convert to a BGR number.
	*
	* Useful for platforms that expect colors in BGR format.
	* @returns The color as a 24-bit BGR integer
	* @example
	* ```ts
	* // Convert RGB to BGR
	* new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
	*
	* // Common use case: platform-specific color format
	* const color = new Color('orange');
	* const bgrColor = color.toBgrNumber(); // Color with swapped R/B channels
	* ```
	* @remarks
	* This swaps the red and blue channels compared to the normal RGB format:
	* - RGB 0xRRGGBB becomes BGR 0xBBGGRR
	*/
	toBgrNumber() {
		let [e, t, n] = this.toUint8RgbArray();
		return (n << 16) + (t << 8) + e;
	}
	/**
	* Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
	*
	* Useful for platforms that expect colors in little endian byte order.
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Convert RGB color to little endian format
	* new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
	*
	* // Common use cases:
	* const color = new Color('orange');
	* const leColor = color.toLittleEndianNumber(); // Swaps byte order for LE systems
	*
	* // Multiple conversions
	* const colors = {
	*     normal: 0xffcc99,
	*     littleEndian: new Color(0xffcc99).toLittleEndianNumber(), // 0x99ccff
	*     backToNormal: new Color(0x99ccff).toLittleEndianNumber()  // 0xffcc99
	* };
	* ```
	* @remarks
	* - Swaps R and B channels in the color value
	* - RGB 0xRRGGBB becomes 0xBBGGRR
	* - Useful for systems that use little endian byte order
	* - Can be used to convert back and forth between formats
	* @returns The color as a number in little endian format (BBGGRR)
	* @see {@link Color.toBgrNumber} For BGR format without byte swapping
	*/
	toLittleEndianNumber() {
		let e = this._int;
		return (e >> 16) + (e & 65280) + ((e & 255) << 16);
	}
	/**
	* Multiply with another color.
	*
	* This action is destructive and modifies the original color.
	* @param {ColorSource} value - The color to multiply by. Accepts any valid color format:
	* - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
	* - RGB/RGBA arrays ([1, 0, 0], [1, 0, 0, 1])
	* - Color objects ({ r: 1, g: 0, b: 0 })
	* - CSS color names ('red', 'blue')
	* @returns this - The Color instance for chaining
	* @example
	* ```ts
	* // Basic multiplication
	* const color = new Color('#ff0000');
	* color.multiply(0x808080); // 50% darker red
	*
	* // With transparency
	* color.multiply([1, 1, 1, 0.5]); // 50% transparent
	*
	* // Chain operations
	* color
	*     .multiply('#808080')
	*     .multiply({ r: 1, g: 1, b: 1, a: 0.5 });
	* ```
	* @remarks
	* - Multiplies each RGB component and alpha separately
	* - Values are clamped between 0-1
	* - Original color format is lost (value becomes null)
	* - Operation cannot be undone
	*/
	multiply(t) {
		let [n, r, i, a] = e._temp.setValue(t)._components;
		return this._components[0] *= n, this._components[1] *= r, this._components[2] *= i, this._components[3] *= a, this._refreshInt(), this._value = null, this;
	}
	/**
	* Converts color to a premultiplied alpha format.
	*
	* This action is destructive and modifies the original color.
	* @param alpha - The alpha value to multiply by (0-1)
	* @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
	* @returns {Color} The Color instance for chaining
	* @example
	* ```ts
	* // Basic premultiplication
	* const color = new Color('red');
	* color.premultiply(0.5); // 50% transparent red with premultiplied RGB
	*
	* // Alpha only (RGB unchanged)
	* color.premultiply(0.5, false); // 50% transparent, original RGB
	*
	* // Chain with other operations
	* color
	*     .multiply(0x808080)
	*     .premultiply(0.5)
	*     .toNumber();
	* ```
	* @remarks
	* - RGB channels are multiplied by alpha when applyToRGB is true
	* - Alpha is always set to the provided value
	* - Values are clamped between 0-1
	* - Original color format is lost (value becomes null)
	* - Operation cannot be undone
	*/
	premultiply(e, t = !0) {
		return t && (this._components[0] *= e, this._components[1] *= e, this._components[2] *= e), this._components[3] = e, this._refreshInt(), this._value = null, this;
	}
	/**
	* Returns the color as a 32-bit premultiplied alpha integer.
	*
	* Format: 0xAARRGGBB
	* @param {number} alpha - The alpha value to multiply by (0-1)
	* @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
	* @returns {number} The premultiplied color as a 32-bit integer
	* @example
	* ```ts
	* // Convert to premultiplied format
	* const color = new Color('red');
	*
	* // Full opacity (0xFFRRGGBB)
	* color.toPremultiplied(1.0); // 0xFFFF0000
	*
	* // 50% transparency with premultiplied RGB
	* color.toPremultiplied(0.5); // 0x7F7F0000
	*
	* // 50% transparency without RGB premultiplication
	* color.toPremultiplied(0.5, false); // 0x7FFF0000
	* ```
	* @remarks
	* - Returns full opacity (0xFF000000) when alpha is 1.0
	* - Returns 0 when alpha is 0.0 and applyToRGB is true
	* - RGB values are rounded during premultiplication
	*/
	toPremultiplied(e, t = !0) {
		if (e === 1) return (255 << 24) + this._int;
		if (e === 0) return t ? 0 : this._int;
		let n = this._int >> 16 & 255, r = this._int >> 8 & 255, i = this._int & 255;
		return t && (n = n * e + .5 | 0, r = r * e + .5 | 0, i = i * e + .5 | 0), (e * 255 << 24) + (n << 16) + (r << 8) + i;
	}
	/**
	* Convert to a hexadecimal string (6 characters).
	* @returns A CSS-compatible hex color string (e.g., "#ff0000")
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Basic colors
	* new Color('red').toHex();    // returns "#ff0000"
	* new Color('white').toHex();  // returns "#ffffff"
	* new Color('black').toHex();  // returns "#000000"
	*
	* // From different formats
	* new Color(0xff0000).toHex(); // returns "#ff0000"
	* new Color([1, 0, 0]).toHex(); // returns "#ff0000"
	* new Color({ r: 1, g: 0, b: 0 }).toHex(); // returns "#ff0000"
	* ```
	* @remarks
	* - Always returns a 6-character hex string
	* - Includes leading "#" character
	* - Alpha channel is ignored
	* - Values are rounded to nearest hex value
	*/
	toHex() {
		let e = this._int.toString(16);
		return `#${"000000".substring(0, 6 - e.length) + e}`;
	}
	/**
	* Convert to a hexadecimal string with alpha (8 characters).
	* @returns A CSS-compatible hex color string with alpha (e.g., "#ff0000ff")
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // Fully opaque colors
	* new Color('red').toHexa();   // returns "#ff0000ff"
	* new Color('white').toHexa(); // returns "#ffffffff"
	*
	* // With transparency
	* new Color('rgba(255, 0, 0, 0.5)').toHexa(); // returns "#ff00007f"
	* new Color([1, 0, 0, 0]).toHexa(); // returns "#ff000000"
	* ```
	* @remarks
	* - Returns an 8-character hex string
	* - Includes leading "#" character
	* - Alpha is encoded in last two characters
	* - Values are rounded to nearest hex value
	*/
	toHexa() {
		let e = Math.round(this._components[3] * 255).toString(16);
		return this.toHex() + "00".substring(0, 2 - e.length) + e;
	}
	/**
	* Set alpha (transparency) value while preserving color components.
	*
	* Provides a chainable interface for setting alpha.
	* @param alpha - Alpha value between 0 (fully transparent) and 1 (fully opaque)
	* @returns The Color instance for chaining
	* @example
	* ```ts
	* // Basic alpha setting
	* const color = new Color('red');
	* color.setAlpha(0.5);  // 50% transparent red
	*
	* // Chain with other operations
	* color
	*     .setValue('#ff0000')
	*     .setAlpha(0.8)    // 80% opaque
	*     .premultiply(0.5); // Further modify alpha
	*
	* // Reset to fully opaque
	* color.setAlpha(1);
	* ```
	* @remarks
	* - Alpha value is clamped between 0-1
	* - Can be chained with other color operations
	*/
	setAlpha(e) {
		return this._components[3] = this._clamp(e), this._value = null, this;
	}
	/**
	* Normalize the input value into rgba
	* @param value - Input value
	*/
	_normalize(t) {
		let n, r, i, a;
		if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
			let e = t;
			n = (e >> 16 & 255) / 255, r = (e >> 8 & 255) / 255, i = (e & 255) / 255, a = 1;
		} else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4) t = this._clamp(t), [n, r, i, a = 1] = t;
		else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4) t = this._clamp(t, 0, 255), [n, r, i, a = 255] = t, n /= 255, r /= 255, i /= 255, a /= 255;
		else if (typeof t == "string" || typeof t == "object") {
			if (typeof t == "string") {
				let n = e.HEX_PATTERN.exec(t);
				n && (t = `#${n[2]}`);
			}
			let o = Y(t);
			o.isValid() && ({r: n, g: r, b: i, a} = o.rgba, n /= 255, r /= 255, i /= 255);
		}
		if (n !== void 0) this._components[0] = n, this._components[1] = r, this._components[2] = i, this._components[3] = a, this._refreshInt();
		else throw Error(`Unable to convert color ${t}`);
	}
	/** Refresh the internal color rgb number */
	_refreshInt() {
		this._clamp(this._components);
		let [e, t, n] = this._components;
		this._int = (e * 255 << 16) + (t * 255 << 8) + (n * 255 | 0);
	}
	/**
	* Clamps values to a range. Will override original values
	* @param value - Value(s) to clamp
	* @param min - Minimum value
	* @param max - Maximum value
	*/
	_clamp(e, t = 0, n = 1) {
		return typeof e == "number" ? Math.min(Math.max(e, t), n) : (e.forEach((r, i) => {
			e[i] = Math.min(Math.max(r, t), n);
		}), e);
	}
	/**
	* Check if a value can be interpreted as a valid color format.
	* Supports all color formats that can be used with the Color class.
	* @param value - Value to check
	* @returns True if the value can be used as a color
	* @example
	* ```ts
	* import { Color } from 'pixi.js';
	*
	* // CSS colors and hex values
	* Color.isColorLike('red');          // true
	* Color.isColorLike('#ff0000');      // true
	* Color.isColorLike(0xff0000);       // true
	*
	* // Arrays (RGB/RGBA)
	* Color.isColorLike([1, 0, 0]);      // true
	* Color.isColorLike([1, 0, 0, 0.5]); // true
	*
	* // TypedArrays
	* Color.isColorLike(new Float32Array([1, 0, 0]));          // true
	* Color.isColorLike(new Uint8Array([255, 0, 0]));          // true
	* Color.isColorLike(new Uint8ClampedArray([255, 0, 0]));   // true
	*
	* // Object formats
	* Color.isColorLike({ r: 1, g: 0, b: 0 });            // true (RGB)
	* Color.isColorLike({ r: 1, g: 0, b: 0, a: 0.5 });    // true (RGBA)
	* Color.isColorLike({ h: 0, s: 100, l: 50 });         // true (HSL)
	* Color.isColorLike({ h: 0, s: 100, l: 50, a: 0.5 }); // true (HSLA)
	* Color.isColorLike({ h: 0, s: 100, v: 100 });        // true (HSV)
	* Color.isColorLike({ h: 0, s: 100, v: 100, a: 0.5 });// true (HSVA)
	*
	* // Color instances
	* Color.isColorLike(new Color('red')); // true
	*
	* // Invalid values
	* Color.isColorLike(null);           // false
	* Color.isColorLike(undefined);      // false
	* Color.isColorLike({});             // false
	* Color.isColorLike([]);             // false
	* Color.isColorLike('not-a-color');  // false
	* ```
	* @remarks
	* Checks for the following formats:
	* - Numbers (0x000000 to 0xffffff)
	* - CSS color strings
	* - RGB/RGBA arrays and objects
	* - HSL/HSLA objects
	* - HSV/HSVA objects
	* - TypedArrays (Float32Array, Uint8Array, Uint8ClampedArray)
	* - Color instances
	* @see {@link ColorSource} For supported color format types
	* @see {@link Color.setValue} For setting color values
	* @category utility
	*/
	static isColorLike(t) {
		return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof e || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
	}
};
/** Pattern for hex strings */
X.shared = new X(), X._temp = new X(), X.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
var je = X, Z = 0, Me = 500;
function Ne(...e) {
	Z !== Me && (Z++, Z === Me ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...e));
}
//#endregion
//#region node_modules/pixi.js/lib/utils/pool/GlobalResourceRegistry.mjs
var Pe = {
	/**
	* Set of registered pools and cleanable objects.
	* @private
	*/
	_registeredResources: /* @__PURE__ */ new Set(),
	/**
	* Registers a pool or cleanable object for cleanup.
	* @param {Cleanable} pool - The pool or object to register.
	*/
	register(e) {
		this._registeredResources.add(e);
	},
	/**
	* Unregisters a pool or cleanable object from cleanup.
	* @param {Cleanable} pool - The pool or object to unregister.
	*/
	unregister(e) {
		this._registeredResources.delete(e);
	},
	/** Clears all registered pools and cleanable objects. This will call clear() on each registered item. */
	release() {
		this._registeredResources.forEach((e) => e.clear());
	},
	/**
	* Gets the number of registered pools and cleanable objects.
	* @returns {number} The count of registered items.
	*/
	get registeredCount() {
		return this._registeredResources.size;
	},
	/**
	* Checks if a specific pool or cleanable object is registered.
	* @param {Cleanable} pool - The pool or object to check.
	* @returns {boolean} True if the item is registered, false otherwise.
	*/
	isRegistered(e) {
		return this._registeredResources.has(e);
	},
	/**
	* Removes all registrations without clearing the pools.
	* Useful if you want to reset the collector without affecting the pools.
	*/
	reset() {
		this._registeredResources.clear();
	}
}, Q = class {
	/**
	* Constructs a new Pool.
	* @param ClassType - The constructor of the items in the pool.
	* @param {number} [initialSize] - The initial size of the pool.
	*/
	constructor(e, t) {
		this._pool = [], this._count = 0, this._index = 0, this._classType = e, t && this.prepopulate(t);
	}
	/**
	* Prepopulates the pool with a given number of items.
	* @param total - The number of items to add to the pool.
	*/
	prepopulate(e) {
		for (let t = 0; t < e; t++) this._pool[this._index++] = new this._classType();
		this._count += e;
	}
	/**
	* Gets an item from the pool. Calls the item's `init` method if it exists.
	* If there are no items left in the pool, a new one will be created.
	* @param {I} [data] - Optional data to pass to the item's constructor.
	* @returns {T} The item from the pool.
	*/
	get(e) {
		let t;
		return this._index > 0 ? t = this._pool[--this._index] : (t = new this._classType(), this._count++), t.init?.(e), t;
	}
	/**
	* Returns an item to the pool. Calls the item's `reset` method if it exists.
	* @param {T} item - The item to return to the pool.
	*/
	return(e) {
		e.reset?.(), this._pool[this._index++] = e;
	}
	/**
	* Gets the number of items in the pool.
	* @readonly
	*/
	get totalSize() {
		return this._count;
	}
	/**
	* Gets the number of items in the pool that are free to use without needing to create more.
	* @readonly
	*/
	get totalFree() {
		return this._index;
	}
	/**
	* Gets the number of items in the pool that are currently in use.
	* @readonly
	*/
	get totalUsed() {
		return this._count - this._index;
	}
	/** clears the pool */
	clear() {
		if (this._pool.length > 0 && this._pool[0].destroy) for (let e = 0; e < this._index; e++) this._pool[e].destroy();
		this._pool.length = 0, this._count = 0, this._index = 0;
	}
}, Fe = class {
	constructor() {
		/**
		* A map to store the pools by their class type.
		* @private
		*/
		this._poolsByClass = /* @__PURE__ */ new Map();
	}
	/**
	* Prepopulates a specific pool with a given number of items.
	* @template T The type of items in the pool. Must extend PoolItem.
	* @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
	* @param {number} total - The number of items to add to the pool.
	*/
	prepopulate(e, t) {
		this.getPool(e).prepopulate(t);
	}
	/**
	* Gets an item from a specific pool.
	* @template T The type of items in the pool. Must extend PoolItem.
	* @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
	* @param {unknown} [data] - Optional data to pass to the item's constructor.
	* @returns {T} The item from the pool.
	*/
	get(e, t) {
		return this.getPool(e).get(t);
	}
	/**
	* Returns an item to its respective pool.
	* @param {PoolItem} item - The item to return to the pool.
	*/
	return(e) {
		this.getPool(e.constructor).return(e);
	}
	/**
	* Gets a specific pool based on the class type.
	* @template T The type of items in the pool. Must extend PoolItem.
	* @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
	* @returns {Pool<T>} The pool of the given class type.
	*/
	getPool(e) {
		return this._poolsByClass.has(e) || this._poolsByClass.set(e, new Q(e)), this._poolsByClass.get(e);
	}
	/** gets the usage stats of each pool in the system */
	stats() {
		let e = {};
		return this._poolsByClass.forEach((t) => {
			let n = e[t._classType.name] ? t._classType.name + t._classType.ID : t._classType.name;
			e[n] = {
				free: t.totalFree,
				used: t.totalUsed,
				size: t.totalSize
			};
		}), e;
	}
	/** Clears all pools in the group. This will reset all pools and free their resources. */
	clear() {
		this._poolsByClass.forEach((e) => e.clear()), this._poolsByClass.clear();
	}
}, Ie = new Fe();
Pe.register(Ie);
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/multiplyHexColors.mjs
function Le(e, t) {
	if (e === 16777215 || !t) return t;
	if (t === 16777215 || !e) return e;
	let n = e >> 16 & 255, r = e >> 8 & 255, i = e & 255, a = t >> 16 & 255, o = t >> 8 & 255, s = t & 255, c = n * a / 255 | 0, l = r * o / 255 | 0, u = i * s / 255 | 0;
	return (c << 16) + (l << 8) + u;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/instructions/InstructionSet.mjs
var Re = class {
	constructor() {
		/** used by the garbage collector to track when the instruction set was last used */
		this.uid = D("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
	}
	/** reset the instruction set so it can be reused set size back to 0 */
	reset() {
		this.instructionSize = 0;
	}
	/**
	* Destroy the instruction set, clearing the instructions and renderables.
	* @internal
	*/
	destroy() {
		this.instructions.length = 0, this.renderables.length = 0, this.renderPipes = null, this.gcTick = 0;
	}
	/**
	* Add an instruction to the set
	* @param instruction - add an instruction to the set
	*/
	add(e) {
		this.instructions[this.instructionSize++] = e;
	}
	/**
	* Log the instructions to the console (for debugging)
	* @internal
	*/
	log() {
		this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
	}
}, ze = {
	createCanvas: (e, t) => {
		let n = document.createElement("canvas");
		return n.width = e, n.height = t, n;
	},
	createImage: () => new Image(),
	getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
	getWebGLRenderingContext: () => WebGLRenderingContext,
	getNavigator: () => navigator,
	getBaseUrl: () => document.baseURI ?? window.location.href,
	getFontFaceSet: () => document.fonts,
	fetch: (e, t) => fetch(e, t),
	parseXML: (e) => new DOMParser().parseFromString(e, "text/xml")
}, $ = ze, Be = {
	/**
	* Returns the current adapter.
	* @returns {environment.Adapter} The current adapter.
	*/
	get() {
		return $;
	},
	/**
	* Sets the current adapter.
	* @param adapter - The new adapter.
	*/
	set(e) {
		$ = e;
	}
};
//#endregion
export { u as A, O as C, T as D, D as E, n as F, a as I, i as L, s as M, c as N, C as O, o as P, A as S, ee as T, N as _, Ie as a, re as b, Pe as c, fe as d, L as f, se as g, F as h, Le as i, l as j, f as k, Ne as l, I as m, ze as n, Fe as o, ue as p, Re as r, Q as s, Be as t, je as u, M as v, ne as w, j as x, ie as y };
