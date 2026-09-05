import { A as e, C as t, E as n, F as r, I as i, N as a, P as o, S as s, a as c, b as l, c as u, d, f, g as ee, h as p, i as te, j as ne, k as m, l as h, r as re, t as ie, u as ae } from "./adapter-DdgmR4Id.js";
//#region node_modules/pixi.js/lib/maths/point/ObservablePoint.mjs
var g = class e {
	/**
	* Creates a new `ObservablePoint`
	* @param observer - Observer to pass to listen for change events.
	* @param {number} [x=0] - position of the point on the x axis
	* @param {number} [y=0] - position of the point on the y axis
	*/
	constructor(e, t, n) {
		this._x = t || 0, this._y = n || 0, this._observer = e;
	}
	/**
	* Creates a clone of this point.
	* @example
	* ```ts
	* // Basic cloning
	* const point = new ObservablePoint(observer, 100, 200);
	* const copy = point.clone();
	*
	* // Clone with new observer
	* const newObserver = {
	*     _onUpdate: (p) => console.log(`Clone updated: (${p.x}, ${p.y})`)
	* };
	* const watched = point.clone(newObserver);
	*
	* // Verify independence
	* watched.set(300, 400); // Only triggers new observer
	* ```
	* @param observer - Optional observer to pass to the new observable point
	* @returns A copy of this observable point
	* @see {@link ObservablePoint.copyFrom} For copying into existing point
	* @see {@link Observer} For observer interface details
	*/
	clone(t) {
		return new e(t ?? this._observer, this._x, this._y);
	}
	/**
	* Sets the point to a new x and y position.
	*
	* If y is omitted, both x and y will be set to x.
	* @example
	* ```ts
	* // Basic position setting
	* const point = new ObservablePoint(observer);
	* point.set(100, 200);
	*
	* // Set both x and y to same value
	* point.set(50); // x=50, y=50
	* ```
	* @param x - Position on the x axis
	* @param y - Position on the y axis, defaults to x
	* @returns The point instance itself
	* @see {@link ObservablePoint.copyFrom} For copying from another point
	* @see {@link ObservablePoint.equals} For comparing positions
	*/
	set(e = 0, t = e) {
		return (this._x !== e || this._y !== t) && (this._x = e, this._y = t, this._observer._onUpdate(this)), this;
	}
	/**
	* Copies x and y from the given point into this point.
	* @example
	* ```ts
	* // Basic copying
	* const source = new ObservablePoint(observer, 100, 200);
	* const target = new ObservablePoint();
	* target.copyFrom(source);
	*
	* // Copy and chain operations
	* const point = new ObservablePoint()
	*     .copyFrom(source)
	*     .set(x + 50, y + 50);
	*
	* // Copy from any PointData
	* const data = { x: 10, y: 20 };
	* point.copyFrom(data);
	* ```
	* @param p - The point to copy from
	* @returns The point instance itself
	* @see {@link ObservablePoint.copyTo} For copying to another point
	* @see {@link ObservablePoint.clone} For creating new point copy
	*/
	copyFrom(e) {
		return (this._x !== e.x || this._y !== e.y) && (this._x = e.x, this._y = e.y, this._observer._onUpdate(this)), this;
	}
	/**
	* Copies this point's x and y into the given point.
	* @example
	* ```ts
	* // Basic copying
	* const source = new ObservablePoint(100, 200);
	* const target = new ObservablePoint();
	* source.copyTo(target);
	* ```
	* @param p - The point to copy to. Can be any type that is or extends `PointLike`
	* @returns The point (`p`) with values updated
	* @see {@link ObservablePoint.copyFrom} For copying from another point
	* @see {@link ObservablePoint.clone} For creating new point copy
	*/
	copyTo(e) {
		return e.set(this._x, this._y), e;
	}
	/**
	* Checks if another point is equal to this point.
	*
	* Compares x and y values using strict equality.
	* @example
	* ```ts
	* // Basic equality check
	* const p1 = new ObservablePoint(100, 200);
	* const p2 = new ObservablePoint(100, 200);
	* console.log(p1.equals(p2)); // true
	*
	* // Compare with PointData
	* const data = { x: 100, y: 200 };
	* console.log(p1.equals(data)); // true
	*
	* // Check different points
	* const p3 = new ObservablePoint(200, 300);
	* console.log(p1.equals(p3)); // false
	* ```
	* @param p - The point to check
	* @returns `true` if both `x` and `y` are equal
	* @see {@link ObservablePoint.copyFrom} For making points equal
	* @see {@link PointData} For point data interface
	*/
	equals(e) {
		return e.x === this._x && e.y === this._y;
	}
	toString() {
		return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
	}
	/**
	* Position of the observable point on the x axis.
	* Triggers observer callback when value changes.
	* @example
	* ```ts
	* // Basic x position
	* const point = new ObservablePoint(observer);
	* point.x = 100; // Triggers observer
	*
	* // Use in calculations
	* const width = rightPoint.x - leftPoint.x;
	* ```
	* @default 0
	*/
	get x() {
		return this._x;
	}
	set x(e) {
		this._x !== e && (this._x = e, this._observer._onUpdate(this));
	}
	/**
	* Position of the observable point on the y axis.
	* Triggers observer callback when value changes.
	* @example
	* ```ts
	* // Basic y position
	* const point = new ObservablePoint(observer);
	* point.y = 200; // Triggers observer
	*
	* // Use in calculations
	* const height = bottomPoint.y - topPoint.y;
	* ```
	* @default 0
	*/
	get y() {
		return this._y;
	}
	set y(e) {
		this._y !== e && (this._y = e, this._observer._onUpdate(this));
	}
};
//#endregion
//#region node_modules/pixi.js/lib/utils/data/updateQuadBounds.mjs
function oe(e, t, n) {
	let { width: r, height: i } = n.orig, a = n.trim;
	if (a) {
		let n = a.width, o = a.height;
		e.minX = a.x - t._x * r, e.maxX = e.minX + n, e.minY = a.y - t._y * i, e.maxY = e.minY + o;
	} else e.minX = -t._x * r, e.maxX = e.minX + r, e.minY = -t._y * i, e.maxY = e.minY + i;
}
//#endregion
//#region node_modules/pixi.js/lib/culling/cullingMixin.mjs
var se = {
	cullArea: null,
	cullable: !1,
	cullableChildren: !0
}, _ = {
	get isCachedAsTexture() {
		return !!this.renderGroup?.isCachedAsTexture;
	},
	cacheAsTexture(e) {
		typeof e == "boolean" && e === !1 ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(e === !0 ? {} : e));
	},
	updateCacheTexture() {
		this.renderGroup?.updateCacheTexture();
	},
	get cacheAsBitmap() {
		return this.isCachedAsTexture;
	},
	set cacheAsBitmap(e) {
		s("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead."), this.cacheAsTexture(e);
	}
};
//#endregion
//#region node_modules/pixi.js/lib/utils/data/removeItems.mjs
function v(e, t, n) {
	let r = e.length, i;
	if (t >= r || n === 0) return;
	n = t + n > r ? r - t : n;
	let a = r - n;
	for (i = t; i < a; ++i) e[i] = e[i + n];
	e.length = a;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/container-mixins/childrenHelperMixin.mjs
var y = {
	allowChildren: !0,
	removeChildren(e = 0, t) {
		let n = t ?? this.children.length, r = n - e, i = [];
		if (r > 0 && r <= n) {
			for (let t = n - 1; t >= e; t--) {
				let e = this.children[t];
				e && (i.push(e), e.parent = null);
			}
			v(this.children, e, n);
			let t = this.renderGroup || this.parentRenderGroup;
			t && t.removeChildren(i);
			for (let e = 0; e < i.length; ++e) {
				let t = i[e];
				t.parentRenderLayer?.detach(t), this.emit("childRemoved", t, this, e), i[e].emit("removed", this);
			}
			return i.length > 0 && this._didViewChangeTick++, i;
		}
		if (r === 0 && this.children.length === 0) return i;
		throw RangeError("removeChildren: numeric values are outside the acceptable range.");
	},
	removeChildAt(e) {
		let t = this.getChildAt(e);
		return this.removeChild(t);
	},
	getChildAt(e) {
		if (e < 0 || e >= this.children.length) throw Error(`getChildAt: Index (${e}) does not exist.`);
		return this.children[e];
	},
	setChildIndex(e, t) {
		if (t < 0 || t >= this.children.length) throw Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
		this.getChildIndex(e), this.addChildAt(e, t);
	},
	getChildIndex(e) {
		let t = this.children.indexOf(e);
		if (t === -1) throw Error("The supplied Container must be a child of the caller");
		return t;
	},
	addChildAt(e, n) {
		this.allowChildren || s(t, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
		let { children: r } = this;
		if (n < 0 || n > r.length) throw Error(`${e}addChildAt: The index ${n} supplied is out of bounds ${r.length}`);
		let i = e.parent === this;
		if (e.parent) {
			let t = e.parent.children.indexOf(e);
			if (i) {
				if (t === n) return e;
				e.parent.children.splice(t, 1);
			} else e.removeFromParent();
		}
		n === r.length ? r.push(e) : r.splice(n, 0, e);
		let a = this.renderGroup || this.parentRenderGroup;
		return this.sortableChildren && (this.sortDirty = !0), i ? (a && (a.structureDidChange = !0), e) : (e.parent = this, e.didChange = !0, e._updateFlags = 15, a && a.addChild(e), this.emit("childAdded", e, this, n), e.emit("added", this), e);
	},
	swapChildren(e, t) {
		if (e === t) return;
		let n = this.getChildIndex(e), r = this.getChildIndex(t);
		this.children[n] = t, this.children[r] = e;
		let i = this.renderGroup || this.parentRenderGroup;
		i && (i.structureDidChange = !0), this._didContainerChangeTick++;
	},
	removeFromParent() {
		this.parent?.removeChild(this);
	},
	reparentChild(...e) {
		return e.length === 1 ? this.reparentChildAt(e[0], this.children.length) : (e.forEach((e) => this.reparentChildAt(e, this.children.length)), e[0]);
	},
	reparentChildAt(e, t) {
		if (e.parent === this) return this.setChildIndex(e, t), e;
		let n = e.worldTransform.clone();
		e.removeFromParent(), this.addChildAt(e, t);
		let r = this.worldTransform.clone();
		return r.invert(), n.prepend(r), e.setFromMatrix(n), e;
	},
	replaceChild(e, t) {
		e.updateLocalTransform(), this.addChildAt(t, this.getChildIndex(e)), t.setFromMatrix(e.localTransform), t.updateLocalTransform(), this.removeChild(e);
	}
}, b = {
	collectRenderables(e, t, n) {
		this.parentRenderLayer && this.parentRenderLayer !== n || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(e, t, n) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, e) : this.collectRenderablesWithEffects(e, t, n));
	},
	collectRenderablesSimple(e, t, n) {
		let r = this.children, i = r.length;
		for (let a = 0; a < i; a++) r[a].collectRenderables(e, t, n);
	},
	collectRenderablesWithEffects(e, t, n) {
		let { renderPipes: r } = t;
		for (let t = 0; t < this.effects.length; t++) {
			let n = this.effects[t];
			r[n.pipe].push(n, this, e);
		}
		this.collectRenderablesSimple(e, t, n);
		for (let t = this.effects.length - 1; t >= 0; t--) {
			let n = this.effects[t];
			r[n.pipe].pop(n, this, e);
		}
	}
}, x = class {
	constructor() {
		/** the priority of this effect */
		this.pipe = "filter", this.priority = 1;
	}
	destroy() {
		for (let e = 0; e < this.filters.length; e++) this.filters[e].destroy();
		this.filters = null, this.filterArea = null;
	}
}, S = class {
	constructor() {
		this._effectClasses = [], this._tests = [], this._initialized = !1;
	}
	init() {
		this._initialized || (this._initialized = !0, this._effectClasses.forEach((e) => {
			this.add({
				test: e.test,
				maskClass: e
			});
		}));
	}
	add(e) {
		this._tests.push(e);
	}
	getMaskEffect(e) {
		this._initialized || this.init();
		for (let t = 0; t < this._tests.length; t++) {
			let n = this._tests[t];
			if (n.test(e)) return c.get(n.maskClass, e);
		}
		return e;
	}
	returnMaskEffect(e) {
		c.return(e);
	}
}, C = new S();
i.handleByList(r.MaskEffect, C._effectClasses);
//#endregion
//#region node_modules/pixi.js/lib/scene/container/container-mixins/effectsMixin.mjs
var w = {
	_maskEffect: null,
	_maskOptions: {
		inverse: !1,
		channel: "red"
	},
	_filterEffect: null,
	effects: [],
	_markStructureAsChanged() {
		let e = this.renderGroup || this.parentRenderGroup;
		e && (e.structureDidChange = !0);
	},
	addEffect(e) {
		this.effects.indexOf(e) === -1 && (this.effects.push(e), this.effects.sort((e, t) => e.priority - t.priority), this._markStructureAsChanged(), this._updateIsSimple());
	},
	removeEffect(e) {
		let t = this.effects.indexOf(e);
		t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
	},
	set mask(e) {
		let t = this._maskEffect;
		t?.mask !== e && (t && (this.removeEffect(t), C.returnMaskEffect(t), this._maskEffect = null), e != null && (this._maskEffect = C.getMaskEffect(e), this.addEffect(this._maskEffect)));
	},
	get mask() {
		return this._maskEffect?.mask;
	},
	setMask(e) {
		this._maskOptions = {
			...this._maskOptions,
			...e
		}, e.mask && (this.mask = e.mask), this._markStructureAsChanged();
	},
	set filters(e) {
		!Array.isArray(e) && e && (e = [e]);
		let t = this._filterEffect ||= new x();
		e = e;
		let n = e?.length > 0, r = n !== t.filters?.length > 0;
		e = Array.isArray(e) ? e.slice(0) : e, t.filters = Object.freeze(e), r && (n ? this.addEffect(t) : (this.removeEffect(t), t.filters = e ?? null));
	},
	get filters() {
		return this._filterEffect?.filters;
	},
	set filterArea(e) {
		this._filterEffect ||= new x(), this._filterEffect.filterArea = e;
	},
	get filterArea() {
		return this._filterEffect?.filterArea;
	}
}, T = {
	label: null,
	get name() {
		return s(t, "Container.name property has been removed, use Container.label instead"), this.label;
	},
	set name(e) {
		s(t, "Container.name property has been removed, use Container.label instead"), this.label = e;
	},
	getChildByName(e, t = !1) {
		return this.getChildByLabel(e, t);
	},
	getChildByLabel(e, t = !1) {
		let n = this.children;
		for (let t = 0; t < n.length; t++) {
			let r = n[t];
			if (r.label === e || e instanceof RegExp && e.test(r.label)) return r;
		}
		if (t) for (let t = 0; t < n.length; t++) {
			let r = n[t].getChildByLabel(e, !0);
			if (r) return r;
		}
		return null;
	},
	getChildrenByLabel(e, t = !1, n = []) {
		let r = this.children;
		for (let t = 0; t < r.length; t++) {
			let i = r[t];
			(i.label === e || e instanceof RegExp && e.test(i.label)) && n.push(i);
		}
		if (t) for (let t = 0; t < r.length; t++) r[t].getChildrenByLabel(e, !0, n);
		return n;
	}
}, E = c.getPool(m), D = c.getPool(d), ce = new m(), O = {
	getFastGlobalBounds(e, t) {
		t ||= new d(), t.clear(), this._getGlobalBoundsRecursive(!!e, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
		let n = this.renderGroup || this.parentRenderGroup;
		return t.applyMatrix(n.worldTransform), t;
	},
	_getGlobalBoundsRecursive(e, t, n) {
		let r = t;
		if (e && this.parentRenderLayer && this.parentRenderLayer !== n || this.localDisplayStatus !== 7 || !this.measurable) return;
		let i = !!this.effects.length;
		if ((this.renderGroup || i) && (r = D.get().clear()), this.boundsArea) t.addRect(this.boundsArea, this.worldTransform);
		else {
			if (this.renderPipeId) {
				let e = this.bounds;
				r.addFrame(e.minX, e.minY, e.maxX, e.maxY, this.groupTransform);
			}
			let t = this.children;
			for (let i = 0; i < t.length; i++) t[i]._getGlobalBoundsRecursive(e, r, n);
		}
		if (i) {
			let e = !1, n = this.renderGroup || this.parentRenderGroup;
			for (let t = 0; t < this.effects.length; t++) this.effects[t].addBounds && (e || (e = !0, r.applyMatrix(n.worldTransform)), this.effects[t].addBounds(r, !0));
			e && r.applyMatrix(n.worldTransform.copyTo(ce).invert()), t.addBounds(r), D.return(r);
		} else this.renderGroup && (t.addBounds(r, this.relativeGroupTransform), D.return(r));
	}
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/bounds/getGlobalBounds.mjs
function k(e, t, n) {
	n.clear();
	let r, i;
	return e.parent ? t ? r = e.parent.worldTransform : (i = E.get().identity(), r = j(e, i)) : r = m.IDENTITY, A(e, n, r, t), i && E.return(i), n.isValid || n.set(0, 0, 0, 0), n;
}
function A(e, t, n, r) {
	if (!e.visible || !e.measurable) return;
	let i;
	r ? i = e.worldTransform : (e.updateLocalTransform(), i = E.get(), i.appendFrom(e.localTransform, n));
	let a = t, o = !!e.effects.length;
	if (o && (t = D.get().clear()), e.boundsArea) t.addRect(e.boundsArea, i);
	else {
		let n = e.bounds;
		n && !n.isEmpty() && (t.matrix = i, t.addBounds(n));
		for (let n = 0; n < e.children.length; n++) A(e.children[n], t, i, r);
	}
	if (o) {
		for (let n = 0; n < e.effects.length; n++) e.effects[n].addBounds?.(t);
		a.addBounds(t, m.IDENTITY), D.return(t);
	}
	r || E.return(i);
}
function j(e, t) {
	let n = e.parent;
	return n && (j(n, t), n.updateLocalTransform(), t.append(n.localTransform)), t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/multiplyColors.mjs
var M = 16777215;
function N(e, t) {
	return e === M ? t : t === M ? e : te(e, t);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/container-mixins/getGlobalMixin.mjs
function P(e) {
	return ((e & 255) << 16) + (e & 65280) + (e >> 16 & 255);
}
var F = {
	getGlobalAlpha(e) {
		if (e) return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
		let t = this.alpha, n = this.parent;
		for (; n;) t *= n.alpha, n = n.parent;
		return t;
	},
	getGlobalTransform(e = new m(), t) {
		if (t) return e.copyFrom(this.worldTransform);
		this.updateLocalTransform();
		let n = j(this, E.get().identity());
		return e.appendFrom(this.localTransform, n), E.return(n), e;
	},
	getGlobalTint(e) {
		if (e) return this.renderGroup ? P(this.renderGroup.worldColor) : this.parentRenderGroup ? P(N(this.localColor, this.parentRenderGroup.worldColor)) : this.tint;
		let t = this.localColor, n = this.parent;
		for (; n;) t = N(t, n.localColor), n = n.parent;
		return P(t);
	}
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/bounds/getLocalBounds.mjs
function I(e, t, n) {
	return t.clear(), n ||= m.IDENTITY, L(e, t, n, e, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function L(e, t, n, r, i) {
	let a;
	if (i) a = E.get(), a = n.copyTo(a);
	else {
		if (!e.visible || !e.measurable) return;
		e.updateLocalTransform();
		let t = e.localTransform;
		a = E.get(), a.appendFrom(t, n);
	}
	let o = t, s = !!e.effects.length;
	if (s && (t = D.get().clear()), e.boundsArea) t.addRect(e.boundsArea, a);
	else {
		e.renderPipeId && (t.matrix = a, t.addBounds(e.bounds));
		let n = e.children;
		for (let e = 0; e < n.length; e++) L(n[e], t, a, r, !1);
	}
	if (s) {
		for (let n = 0; n < e.effects.length; n++) e.effects[n].addLocalBounds?.(t, r);
		o.addBounds(t, m.IDENTITY), D.return(t);
	}
	E.return(a);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/checkChildrenDidChange.mjs
function R(e, t) {
	let n = e.children;
	for (let e = 0; e < n.length; e++) {
		let r = n[e], i = r.uid, a = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, o = t.index;
		(t.data[o] !== i || t.data[o + 1] !== a) && (t.data[t.index] = i, t.data[t.index + 1] = a, t.didChange = !0), t.index = o + 2, r.children.length && R(r, t);
	}
	return t.didChange;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/container-mixins/measureMixin.mjs
var le = new m(), z = {
	_localBoundsCacheId: -1,
	_localBoundsCacheData: null,
	_setWidth(e, t) {
		let n = Math.sign(this.scale.x) || 1;
		t === 0 ? this.scale.x = n : this.scale.x = e / t * n;
	},
	_setHeight(e, t) {
		let n = Math.sign(this.scale.y) || 1;
		t === 0 ? this.scale.y = n : this.scale.y = e / t * n;
	},
	getLocalBounds() {
		this._localBoundsCacheData ||= {
			data: [],
			index: 1,
			didChange: !1,
			localBounds: new d()
		};
		let e = this._localBoundsCacheData;
		return e.index = 1, e.didChange = !1, e.data[0] !== this._didViewChangeTick && (e.didChange = !0, e.data[0] = this._didViewChangeTick), R(this, e), e.didChange && I(this, e.localBounds, le), e.localBounds;
	},
	getBounds(e, t) {
		return k(this, e, t || new d());
	}
}, B = {
	_onRender: null,
	set onRender(e) {
		let t = this.renderGroup || this.parentRenderGroup;
		if (!e) {
			this._onRender && t?.removeOnRender(this), this._onRender = null;
			return;
		}
		this._onRender || t?.addOnRender(this), this._onRender = e;
	},
	get onRender() {
		return this._onRender;
	}
}, V = {
	_zIndex: 0,
	sortDirty: !1,
	sortableChildren: !1,
	get zIndex() {
		return this._zIndex;
	},
	set zIndex(e) {
		this._zIndex !== e && (this._zIndex = e, this.depthOfChildModified());
	},
	depthOfChildModified() {
		this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
	},
	sortChildren() {
		this.sortDirty && (this.sortDirty = !1, this.children.sort(ue));
	}
};
function ue(e, t) {
	return e._zIndex - t._zIndex;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/container-mixins/toLocalGlobalMixin.mjs
var H = {
	getGlobalPosition(t = new e(), n = !1) {
		return this.parent ? this.parent.toGlobal(this._position, t, n) : (t.x = this._position.x, t.y = this._position.y), t;
	},
	toGlobal(e, t, n = !1) {
		let r = this.getGlobalTransform(E.get(), n);
		return t = r.apply(e, t), E.return(r), t;
	},
	toLocal(e, t, n, r) {
		t && (e = t.toGlobal(e, n, r));
		let i = this.getGlobalTransform(E.get(), r);
		return n = i.applyInverse(e, n), E.return(i), n;
	}
}, de = 0, U = class {
	/**
	* @param textureOptions - options that will be passed to BaseRenderTexture constructor
	* @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
	*/
	constructor(e) {
		this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = e || {}, this.enableFullScreen = !1, this.textureStyle = new ee(this.textureOptions);
	}
	/**
	* Creates texture with params that were specified in pool constructor.
	* @param pixelWidth - Width of texture in pixels.
	* @param pixelHeight - Height of texture in pixels.
	* @param antialias
	* @param autoGenerateMipmaps - Whether to automatically generate mipmaps for this texture
	*/
	createTexture(e, t, n, r) {
		let i = new p({
			...this.textureOptions,
			width: e,
			height: t,
			resolution: 1,
			antialias: n,
			autoGarbageCollect: !1,
			autoGenerateMipmaps: r
		});
		return new f({
			source: i,
			label: `texturePool_${de++}`
		});
	}
	/**
	* Gets a Power-of-Two render texture or fullScreen texture
	* @param frameWidth - The minimum width of the render texture.
	* @param frameHeight - The minimum height of the render texture.
	* @param resolution - The resolution of the render texture.
	* @param antialias
	* @param autoGenerateMipmaps - Whether to automatically generate mipmaps. Defaults to false.
	* @returns The new render texture.
	*/
	getOptimalTexture(e, t, n = 1, r, i = !1) {
		let a = Math.ceil(e * n - 1e-6), o = Math.ceil(t * n - 1e-6);
		a = l(a), o = l(o);
		let s = +!!r, c = +!!i, u = (a << 17) + (o << 2) + (c << 1) + s;
		this._texturePool[u] || (this._texturePool[u] = []);
		let d = this._texturePool[u].pop();
		return d ||= this.createTexture(a, o, r, i), d.source._resolution = n, d.source.width = a / n, d.source.height = o / n, d.source.pixelWidth = a, d.source.pixelHeight = o, d.frame.x = 0, d.frame.y = 0, d.frame.width = e, d.frame.height = t, d.updateUvs(), this._poolKeyHash[d.uid] = u, d;
	}
	/**
	* Gets a pooled texture matching the dimensions and resolution of the given texture.
	*
	* This is a convenience wrapper around {@link TexturePoolClass#getOptimalTexture|getOptimalTexture}
	* that copies width, height, and resolution from an existing texture. Useful when a filter needs
	* a temporary texture the same size as its input (e.g., for multi-pass blur).
	* @param texture - The texture whose dimensions to match.
	* @param antialias - Whether to use antialias on the pooled texture. Defaults to `false`.
	* @returns A pooled texture with power-of-two backing dimensions at the source resolution.
	*/
	getSameSizeTexture(e, t = !1) {
		let n = e.source;
		return this.getOptimalTexture(e.width, e.height, n._resolution, t);
	}
	/**
	* Returns a texture to the pool so it can be reused by future
	* {@link TexturePoolClass#getOptimalTexture|getOptimalTexture}
	* or {@link TexturePoolClass#getSameSizeTexture|getSameSizeTexture} calls.
	*
	* If you modified the texture's style after obtaining it (e.g., changed filtering or wrapping),
	* pass `resetStyle = true` to restore the pool's default {@link TexturePoolClass#textureStyle|textureStyle}.
	* This prevents style changes from leaking into subsequent consumers of the same pooled texture.
	* @param renderTexture - The texture to return to the pool.
	* @param resetStyle - When `true`, replaces the texture source's style with the pool default. Defaults to `false`.
	*/
	returnTexture(e, t = !1) {
		let n = this._poolKeyHash[e.uid];
		t && (e.source.style = this.textureStyle), this._texturePool[n].push(e);
	}
	/**
	* Clears the pool.
	* @param destroyTextures - Destroy all stored textures.
	*/
	clear(e) {
		if (e = e !== !1, e) for (let e in this._texturePool) {
			let t = this._texturePool[e];
			if (t) for (let e = 0; e < t.length; e++) t[e].destroy(!0);
		}
		this._texturePool = {};
	}
}, W = new U();
u.register(W);
//#endregion
//#region node_modules/pixi.js/lib/scene/container/RenderGroup.mjs
var G = class {
	constructor() {
		this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new m(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = {
			list: [],
			index: 0
		}, this.structureDidChange = !0, this.instructionSet = new re(), this._onRenderContainers = [], this.textureNeedsUpdate = !0, this.isCachedAsTexture = !1, this._matrixDirty = 7;
	}
	init(e) {
		this.root = e, e._onRender && this.addOnRender(e), e.didChange = !0;
		let t = e.children;
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			n._updateFlags = 15, this.addChild(n);
		}
	}
	enableCacheAsTexture(e = {}) {
		this.textureOptions = e, this.isCachedAsTexture = !0, this.textureNeedsUpdate = !0;
	}
	disableCacheAsTexture() {
		this.isCachedAsTexture = !1, this.texture &&= (W.returnTexture(this.texture, !0), null);
	}
	updateCacheTexture() {
		this.textureNeedsUpdate = !0;
		let e = this._parentCacheAsTextureRenderGroup;
		e && !e.textureNeedsUpdate && e.updateCacheTexture();
	}
	reset() {
		this.renderGroupChildren.length = 0;
		for (let e in this.childrenToUpdate) {
			let t = this.childrenToUpdate[e];
			t.list.fill(null), t.index = 0;
		}
		this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
	}
	get localTransform() {
		return this.root.localTransform;
	}
	addRenderGroupChild(e) {
		e.renderGroupParent && e.renderGroupParent._removeRenderGroupChild(e), e.renderGroupParent = this, this.renderGroupChildren.push(e);
	}
	_removeRenderGroupChild(e) {
		let t = this.renderGroupChildren.indexOf(e);
		t > -1 && this.renderGroupChildren.splice(t, 1), e.renderGroupParent = null;
	}
	addChild(e) {
		if (this.structureDidChange = !0, e.parentRenderGroup = this, e.updateTick = -1, e.relativeRenderGroupDepth = e.parent === this.root ? 1 : e.parent.relativeRenderGroupDepth + 1, e.didChange = !0, this.onChildUpdate(e), e.renderGroup) {
			this.addRenderGroupChild(e.renderGroup);
			return;
		}
		e._onRender && this.addOnRender(e);
		let t = e.children;
		for (let e = 0; e < t.length; e++) this.addChild(t[e]);
	}
	removeChild(e) {
		if (this.structureDidChange = !0, e._onRender && (e.renderGroup || this.removeOnRender(e)), e.parentRenderGroup = null, e.renderGroup) {
			this._removeRenderGroupChild(e.renderGroup);
			return;
		}
		let t = e.children;
		for (let e = 0; e < t.length; e++) this.removeChild(t[e]);
	}
	removeChildren(e) {
		for (let t = 0; t < e.length; t++) this.removeChild(e[t]);
	}
	onChildUpdate(e) {
		let t = this.childrenToUpdate[e.relativeRenderGroupDepth];
		t ||= this.childrenToUpdate[e.relativeRenderGroupDepth] = {
			index: 0,
			list: []
		}, t.list[t.index++] = e;
	}
	updateRenderable(e) {
		e.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[e.renderPipeId].updateRenderable(e), e.didViewUpdate = !1);
	}
	onChildViewUpdate(e) {
		this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = e;
	}
	get isRenderable() {
		return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
	}
	/**
	* adding a container to the onRender list will make sure the user function
	* passed in to the user defined 'onRender` callBack
	* @param container - the container to add to the onRender list
	*/
	addOnRender(e) {
		this._onRenderContainers.indexOf(e) === -1 && this._onRenderContainers.push(e);
	}
	removeOnRender(e) {
		let t = this._onRenderContainers.indexOf(e);
		t !== -1 && this._onRenderContainers.splice(t, 1);
	}
	runOnRender(e) {
		for (let t = 0; t < this._onRenderContainers.length; t++) this._onRenderContainers[t]._onRender(e);
	}
	destroy() {
		this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
	}
	getChildren(e = []) {
		let t = this.root.children;
		for (let n = 0; n < t.length; n++) this._getChildren(t[n], e);
		return e;
	}
	_getChildren(e, t = []) {
		if (t.push(e), e.renderGroup) return t;
		let n = e.children;
		for (let e = 0; e < n.length; e++) this._getChildren(n[e], t);
		return t;
	}
	invalidateMatrices() {
		this._matrixDirty = 7;
	}
	/**
	* Returns the inverse of the world transform matrix.
	* @returns {Matrix} The inverse of the world transform matrix.
	*/
	get inverseWorldTransform() {
		return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform ||= new m(), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
	}
	/**
	* Returns the inverse of the texture offset transform matrix.
	* @returns {Matrix} The inverse of the texture offset transform matrix.
	*/
	get textureOffsetInverseTransform() {
		return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform ||= new m(), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(-this._textureBounds.x, -this._textureBounds.y)) : this._textureOffsetInverseTransform;
	}
	/**
	* Returns the inverse of the parent texture transform matrix.
	* This is used to properly transform coordinates when rendering into cached textures.
	* @returns {Matrix} The inverse of the parent texture transform matrix.
	*/
	get inverseParentTextureTransform() {
		if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
		this._matrixDirty &= -5;
		let e = this._parentCacheAsTextureRenderGroup;
		return e ? (this._inverseParentTextureTransform ||= new m(), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(e.inverseWorldTransform).translate(-e._textureBounds.x, -e._textureBounds.y)) : this.worldTransform;
	}
	/**
	* Returns a matrix that transforms coordinates to the correct coordinate space of the texture being rendered to.
	* This is the texture offset inverse transform of the closest parent RenderGroup that is cached as a texture.
	* @returns {Matrix | null} The transform matrix for the cached texture coordinate space,
	* or null if no parent is cached as texture.
	*/
	get cacheToLocalTransform() {
		return this.isCachedAsTexture ? this.textureOffsetInverseTransform : this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
	}
};
//#endregion
//#region node_modules/pixi.js/lib/scene/container/utils/assignWithIgnore.mjs
function K(e, t, n = {}) {
	for (let r in t) !n[r] && t[r] !== void 0 && (e[r] = t[r]);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/container/Container.mjs
var q = new g(null), J = new g(null), Y = new g(null, 1, 1), X = new g(null), Z = class e extends o {
	constructor(e = {}) {
		super(), this.uid = n("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.parentRenderLayer = null, this.updateTick = -1, this.localTransform = new m(), this.relativeGroupTransform = new m(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new g(this, 0, 0), this._scale = Y, this._pivot = J, this._origin = X, this._skew = q, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], K(this, e, {
			children: !0,
			parent: !0,
			effects: !0
		}), e.children?.forEach((e) => this.addChild(e)), e.parent?.addChild(this);
	}
	/**
	* Mixes all enumerable properties and methods from a source object to Container.
	* @param source - The source of properties and methods to mix in.
	* @deprecated since 8.8.0
	*/
	static mixin(t) {
		s("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead."), i.mixin(e, t);
	}
	/**
	* We now use the _didContainerChangeTick and _didViewChangeTick to track changes
	* @deprecated since 8.2.6
	* @ignore
	*/
	set _didChangeId(e) {
		this._didViewChangeTick = e >> 12 & 4095, this._didContainerChangeTick = e & 4095;
	}
	/** @ignore */
	get _didChangeId() {
		return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
	}
	/**
	* Adds one or more children to the container.
	* The children will be rendered as part of this container's display list.
	* @example
	* ```ts
	* // Add a single child
	* container.addChild(sprite);
	*
	* // Add multiple children
	* container.addChild(background, player, foreground);
	*
	* // Add with type checking
	* const sprite = container.addChild<Sprite>(new Sprite(texture));
	* sprite.tint = 'red';
	* ```
	* @param children - The Container(s) to add to the container
	* @returns The first child that was added
	* @see {@link Container#removeChild} For removing children
	* @see {@link Container#addChildAt} For adding at specific index
	*/
	addChild(...e) {
		if (this.allowChildren || s(t, "addChild: Only Containers will be allowed to add children in v8.0.0"), e.length > 1) {
			for (let t = 0; t < e.length; t++) this.addChild(e[t]);
			return e[0];
		}
		let n = e[0], r = this.renderGroup || this.parentRenderGroup;
		return n.parent === this ? (this.children.splice(this.children.indexOf(n), 1), this.children.push(n), r && (r.structureDidChange = !0), n) : (n.parent && n.parent.removeChild(n), this.children.push(n), this.sortableChildren && (this.sortDirty = !0), n.parent = this, n.didChange = !0, n._updateFlags = 15, r && r.addChild(n), this.emit("childAdded", n, this, this.children.length - 1), n.emit("added", this), this._didViewChangeTick++, n._zIndex !== 0 && n.depthOfChildModified(), n);
	}
	/**
	* Removes one or more children from the container.
	* When removing multiple children, events will be triggered for each child in sequence.
	* @example
	* ```ts
	* // Remove a single child
	* const removed = container.removeChild(sprite);
	*
	* // Remove multiple children
	* const bg = container.removeChild(background, player, userInterface);
	*
	* // Remove with type checking
	* const sprite = container.removeChild<Sprite>(childSprite);
	* sprite.texture = newTexture;
	* ```
	* @param children - The Container(s) to remove
	* @returns The first child that was removed
	* @see {@link Container#addChild} For adding children
	* @see {@link Container#removeChildren} For removing multiple children
	*/
	removeChild(...e) {
		if (e.length > 1) {
			for (let t = 0; t < e.length; t++) this.removeChild(e[t]);
			return e[0];
		}
		let t = e[0], n = this.children.indexOf(t);
		return n > -1 && (this._didViewChangeTick++, this.children.splice(n, 1), this.renderGroup ? this.renderGroup.removeChild(t) : this.parentRenderGroup && this.parentRenderGroup.removeChild(t), t.parentRenderLayer && t.parentRenderLayer.detach(t), t.parent = null, this.emit("childRemoved", t, this, n), t.emit("removed", this)), t;
	}
	/** @ignore */
	_onUpdate(e) {
		e && e === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
	}
	set isRenderGroup(e) {
		!!this.renderGroup !== e && (e ? this.enableRenderGroup() : this.disableRenderGroup());
	}
	/**
	* Returns true if this container is a render group.
	* This means that it will be rendered as a separate pass, with its own set of instructions
	* @advanced
	*/
	get isRenderGroup() {
		return !!this.renderGroup;
	}
	/**
	* Calling this enables a render group for this container.
	* This means it will be rendered as a separate set of instructions.
	* The transform of the container will also be handled on the GPU rather than the CPU.
	* @advanced
	*/
	enableRenderGroup() {
		if (this.renderGroup) return;
		let e = this.parentRenderGroup;
		e?.removeChild(this), this.renderGroup = c.get(G, this), this.groupTransform = m.IDENTITY, e?.addChild(this), this._updateIsSimple();
	}
	/**
	* This will disable the render group for this container.
	* @advanced
	*/
	disableRenderGroup() {
		if (!this.renderGroup) return;
		let e = this.parentRenderGroup;
		e?.removeChild(this), c.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, e?.addChild(this), this._updateIsSimple();
	}
	/** @ignore */
	_updateIsSimple() {
		this.isSimple = !this.renderGroup && this.effects.length === 0;
	}
	/**
	* Current transform of the object based on world (parent) factors.
	*
	* This matrix represents the absolute transformation in the scene graph.
	* @example
	* ```ts
	* // Get world position
	* const worldPos = container.worldTransform;
	* console.log(`World position: (${worldPos.tx}, ${worldPos.ty})`);
	* ```
	* @readonly
	* @see {@link Container#localTransform} For local space transform
	*/
	get worldTransform() {
		return this._worldTransform ||= new m(), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
	}
	/**
	* The position of the container on the x axis relative to the local coordinates of the parent.
	*
	* An alias to position.x
	* @example
	* ```ts
	* // Basic position
	* container.x = 100;
	* ```
	*/
	get x() {
		return this._position.x;
	}
	set x(e) {
		this._position.x = e;
	}
	/**
	* The position of the container on the y axis relative to the local coordinates of the parent.
	*
	* An alias to position.y
	* @example
	* ```ts
	* // Basic position
	* container.y = 200;
	* ```
	*/
	get y() {
		return this._position.y;
	}
	set y(e) {
		this._position.y = e;
	}
	/**
	* The coordinate of the object relative to the local coordinates of the parent.
	* @example
	* ```ts
	* // Basic position setting
	* container.position.set(100, 200);
	* container.position.set(100); // Sets both x and y to 100
	* // Using point data
	* container.position = { x: 50, y: 75 };
	* ```
	* @since 4.0.0
	*/
	get position() {
		return this._position;
	}
	set position(e) {
		this._position.copyFrom(e);
	}
	/**
	* The rotation of the object in radians.
	*
	* > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
	* > rotation is in radians, angle is in degrees.
	* @example
	* ```ts
	* // Basic rotation
	* container.rotation = Math.PI / 4; // 45 degrees
	*
	* // Convert from degrees
	* const degrees = 45;
	* container.rotation = degrees * Math.PI / 180;
	*
	* // Rotate around center
	* container.pivot.set(container.width / 2, container.height / 2);
	* container.rotation = Math.PI; // 180 degrees
	*
	* // Rotate around center with origin
	* container.origin.set(container.width / 2, container.height / 2);
	* container.rotation = Math.PI; // 180 degrees
	* ```
	*/
	get rotation() {
		return this._rotation;
	}
	set rotation(e) {
		this._rotation !== e && (this._rotation = e, this._onUpdate(this._skew));
	}
	/**
	* The angle of the object in degrees.
	*
	* > [!NOTE] 'rotation' and 'angle' have the same effect on a display object;
	* > rotation is in radians, angle is in degrees.
	* @example
	* ```ts
	* // Basic angle rotation
	* sprite.angle = 45; // 45 degrees
	*
	* // Rotate around center
	* sprite.pivot.set(sprite.width / 2, sprite.height / 2);
	* sprite.angle = 180; // Half rotation
	*
	* // Rotate around center with origin
	* sprite.origin.set(sprite.width / 2, sprite.height / 2);
	* sprite.angle = 180; // Half rotation
	*
	* // Reset rotation
	* sprite.angle = 0;
	* ```
	*/
	get angle() {
		return this.rotation * a;
	}
	set angle(e) {
		this.rotation = e * ne;
	}
	/**
	* The center of rotation, scaling, and skewing for this display object in its local space.
	* The `position` is the projection of `pivot` in the parent's local space.
	*
	* By default, the pivot is the origin (0, 0).
	* @example
	* ```ts
	* // Rotate around center
	* container.pivot.set(container.width / 2, container.height / 2);
	* container.rotation = Math.PI; // Rotates around center
	* ```
	* @since 4.0.0
	*/
	get pivot() {
		return this._pivot === J && (this._pivot = new g(this, 0, 0)), this._pivot;
	}
	set pivot(e) {
		this._pivot === J && (this._pivot = new g(this, 0, 0), this._origin !== X && h("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof e == "number" ? this._pivot.set(e) : this._pivot.copyFrom(e);
	}
	/**
	* The skew factor for the object in radians. Skewing is a transformation that distorts
	* the object by rotating it differently at each point, creating a non-uniform shape.
	* @example
	* ```ts
	* // Basic skewing
	* container.skew.set(0.5, 0); // Skew horizontally
	* container.skew.set(0, 0.5); // Skew vertically
	*
	* // Skew with point data
	* container.skew = { x: 0.3, y: 0.3 }; // Diagonal skew
	*
	* // Reset skew
	* container.skew.set(0, 0);
	*
	* // Animate skew
	* app.ticker.add(() => {
	*     // Create wave effect
	*     container.skew.x = Math.sin(Date.now() / 1000) * 0.3;
	* });
	*
	* // Combine with rotation
	* container.rotation = Math.PI / 4; // 45 degrees
	* container.skew.set(0.2, 0.2); // Skew the rotated object
	* ```
	* @since 4.0.0
	* @type {ObservablePoint} Point-like object with x/y properties in radians
	* @default {x: 0, y: 0}
	*/
	get skew() {
		return this._skew === q && (this._skew = new g(this, 0, 0)), this._skew;
	}
	set skew(e) {
		this._skew === q && (this._skew = new g(this, 0, 0)), this._skew.copyFrom(e);
	}
	/**
	* The scale factors of this object along the local coordinate axes.
	*
	* The default scale is (1, 1).
	* @example
	* ```ts
	* // Basic scaling
	* container.scale.set(2, 2); // Scales to double size
	* container.scale.set(2); // Scales uniformly to double size
	* container.scale = 2; // Scales uniformly to double size
	* // Scale to a specific width and height
	* container.setSize(200, 100); // Sets width to 200 and height to 100
	* ```
	* @since 4.0.0
	*/
	get scale() {
		return this._scale === Y && (this._scale = new g(this, 1, 1)), this._scale;
	}
	set scale(e) {
		this._scale === Y && (this._scale = new g(this, 0, 0)), typeof e == "string" && (e = parseFloat(e)), typeof e == "number" ? this._scale.set(e) : this._scale.copyFrom(e);
	}
	/**
	* @experimental
	* The origin point around which the container rotates and scales without affecting its position.
	* Unlike pivot, changing the origin will not move the container's position.
	* @example
	* ```ts
	* // Rotate around center point
	* container.origin.set(container.width / 2, container.height / 2);
	* container.rotation = Math.PI; // Rotates around center
	*
	* // Reset origin
	* container.origin.set(0, 0);
	* ```
	*/
	get origin() {
		return this._origin === X && (this._origin = new g(this, 0, 0)), this._origin;
	}
	set origin(e) {
		this._origin === X && (this._origin = new g(this, 0, 0), this._pivot !== J && h("Setting both a pivot and origin on a Container is not recommended. This can lead to unexpected behavior if not handled carefully.")), typeof e == "number" ? this._origin.set(e) : this._origin.copyFrom(e);
	}
	/**
	* The width of the Container, setting this will actually modify the scale to achieve the value set.
	* > [!NOTE] Changing the width will adjust the scale.x property of the container while maintaining its aspect ratio.
	* > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
	* as it is more optimized by not recalculating the local bounds twice.
	* @example
	* ```ts
	* // Basic width setting
	* container.width = 100;
	* // Optimized width setting
	* container.setSize(100, 100);
	* ```
	*/
	get width() {
		return Math.abs(this.scale.x * this.getLocalBounds().width);
	}
	set width(e) {
		let t = this.getLocalBounds().width;
		this._setWidth(e, t);
	}
	/**
	* The height of the Container,
	* > [!NOTE] Changing the height will adjust the scale.y property of the container while maintaining its aspect ratio.
	* > [!NOTE] If you want to set both width and height at the same time, use {@link Container#setSize}
	* as it is more optimized by not recalculating the local bounds twice.
	* @example
	* ```ts
	* // Basic height setting
	* container.height = 200;
	* // Optimized height setting
	* container.setSize(100, 200);
	* ```
	*/
	get height() {
		return Math.abs(this.scale.y * this.getLocalBounds().height);
	}
	set height(e) {
		let t = this.getLocalBounds().height;
		this._setHeight(e, t);
	}
	/**
	* Retrieves the size of the container as a [Size]{@link Size} object.
	*
	* This is faster than get the width and height separately.
	* @example
	* ```ts
	* // Basic size retrieval
	* const size = container.getSize();
	* console.log(`Size: ${size.width}x${size.height}`);
	*
	* // Reuse existing size object
	* const reuseSize = { width: 0, height: 0 };
	* container.getSize(reuseSize);
	* ```
	* @param out - Optional object to store the size in.
	* @returns The size of the container.
	*/
	getSize(e) {
		e ||= {};
		let t = this.getLocalBounds();
		return e.width = Math.abs(this.scale.x * t.width), e.height = Math.abs(this.scale.y * t.height), e;
	}
	/**
	* Sets the size of the container to the specified width and height.
	* This is more efficient than setting width and height separately as it only recalculates bounds once.
	* @example
	* ```ts
	* // Basic size setting
	* container.setSize(100, 200);
	*
	* // Set uniform size
	* container.setSize(100); // Sets both width and height to 100
	* ```
	* @param value - This can be either a number or a [Size]{@link Size} object.
	* @param height - The height to set. Defaults to the value of `width` if not provided.
	*/
	setSize(e, t) {
		let n = this.getLocalBounds();
		typeof e == "object" ? (t = e.height ?? e.width, e = e.width) : t ??= e, e !== void 0 && this._setWidth(e, n.width), t !== void 0 && this._setHeight(t, n.height);
	}
	/** Called when the skew or the rotation changes. */
	_updateSkew() {
		let e = this._rotation, t = this._skew;
		this._cx = Math.cos(e + t._y), this._sx = Math.sin(e + t._y), this._cy = -Math.sin(e - t._x), this._sy = Math.cos(e - t._x);
	}
	/**
	* Updates the transform properties of the container.
	* Allows partial updates of transform properties for optimized manipulation.
	* @example
	* ```ts
	* // Basic transform update
	* container.updateTransform({
	*     x: 100,
	*     y: 200,
	*     rotation: Math.PI / 4
	* });
	*
	* // Scale and rotate around center
	* sprite.updateTransform({
	*     pivotX: sprite.width / 2,
	*     pivotY: sprite.height / 2,
	*     scaleX: 2,
	*     scaleY: 2,
	*     rotation: Math.PI
	* });
	*
	* // Update position only
	* button.updateTransform({
	*     x: button.x + 10, // Move right
	*     y: button.y      // Keep same y
	* });
	* ```
	* @param opts - Transform options to update
	* @param opts.x - The x position
	* @param opts.y - The y position
	* @param opts.scaleX - The x-axis scale factor
	* @param opts.scaleY - The y-axis scale factor
	* @param opts.rotation - The rotation in radians
	* @param opts.skewX - The x-axis skew factor
	* @param opts.skewY - The y-axis skew factor
	* @param opts.pivotX - The x-axis pivot point
	* @param opts.pivotY - The y-axis pivot point
	* @returns This container, for chaining
	* @see {@link Container#setFromMatrix} For matrix-based transforms
	* @see {@link Container#position} For direct position access
	*/
	updateTransform(e) {
		return this.position.set(typeof e.x == "number" ? e.x : this.position.x, typeof e.y == "number" ? e.y : this.position.y), this.scale.set(typeof e.scaleX == "number" ? e.scaleX : this.scale.x, typeof e.scaleY == "number" ? e.scaleY : this.scale.y), this.rotation = typeof e.rotation == "number" ? e.rotation : this.rotation, this.skew.set(typeof e.skewX == "number" ? e.skewX : this.skew.x, typeof e.skewY == "number" ? e.skewY : this.skew.y), this.pivot.set(typeof e.pivotX == "number" ? e.pivotX : this.pivot.x, typeof e.pivotY == "number" ? e.pivotY : this.pivot.y), this.origin.set(typeof e.originX == "number" ? e.originX : this.origin.x, typeof e.originY == "number" ? e.originY : this.origin.y), this;
	}
	/**
	* Updates the local transform properties by decomposing the given matrix.
	* Extracts position, scale, rotation, and skew from a transformation matrix.
	* @example
	* ```ts
	* // Basic matrix transform
	* const matrix = new Matrix()
	*     .translate(100, 100)
	*     .rotate(Math.PI / 4)
	*     .scale(2, 2);
	*
	* container.setFromMatrix(matrix);
	*
	* // Copy transform from another container
	* const source = new Container();
	* source.position.set(100, 100);
	* source.rotation = Math.PI / 2;
	*
	* target.setFromMatrix(source.localTransform);
	*
	* // Reset transform
	* container.setFromMatrix(Matrix.IDENTITY);
	* ```
	* @param matrix - The matrix to use for updating the transform
	* @see {@link Container#updateTransform} For property-based updates
	* @see {@link Matrix#decompose} For matrix decomposition details
	*/
	setFromMatrix(e) {
		e.decompose(this);
	}
	/** Updates the local transform. */
	updateLocalTransform() {
		let e = this._didContainerChangeTick;
		if (this._didLocalTransformChangeId === e) return;
		this._didLocalTransformChangeId = e;
		let t = this.localTransform, n = this._scale, r = this._pivot, i = this._origin, a = this._position, o = n._x, s = n._y, c = r._x, l = r._y, u = -i._x, d = -i._y;
		t.a = this._cx * o, t.b = this._sx * o, t.c = this._cy * s, t.d = this._sy * s, t.tx = a._x - (c * t.a + l * t.c) + (u * t.a + d * t.c) - u, t.ty = a._y - (c * t.b + l * t.d) + (u * t.b + d * t.d) - d;
	}
	set alpha(e) {
		e !== this.localAlpha && (this.localAlpha = e, this._updateFlags |= 1, this._onUpdate());
	}
	/**
	* The opacity of the object relative to its parent's opacity.
	* Value ranges from 0 (fully transparent) to 1 (fully opaque).
	* @example
	* ```ts
	* // Basic transparency
	* sprite.alpha = 0.5; // 50% opacity
	*
	* // Inherited opacity
	* container.alpha = 0.5;
	* const child = new Sprite(texture);
	* child.alpha = 0.5;
	* container.addChild(child);
	* // child's effective opacity is 0.25 (0.5 * 0.5)
	* ```
	* @default 1
	* @see {@link Container#visible} For toggling visibility
	* @see {@link Container#renderable} For render control
	*/
	get alpha() {
		return this.localAlpha;
	}
	set tint(e) {
		let t = ae.shared.setValue(e ?? 16777215).toBgrNumber();
		t !== this.localColor && (this.localColor = t, this._updateFlags |= 1, this._onUpdate());
	}
	/**
	* The tint applied to the sprite.
	*
	* This can be any valid {@link ColorSource}.
	* @example
	* ```ts
	* // Basic color tinting
	* container.tint = 0xff0000; // Red tint
	* container.tint = 'red';    // Same as above
	* container.tint = '#00ff00'; // Green
	* container.tint = 'rgb(0,0,255)'; // Blue
	*
	* // Remove tint
	* container.tint = 0xffffff; // White = no tint
	* container.tint = null;     // Also removes tint
	* ```
	* @default 0xFFFFFF
	* @see {@link Container#alpha} For transparency
	* @see {@link Container#visible} For visibility control
	*/
	get tint() {
		return P(this.localColor);
	}
	set blendMode(e) {
		this.localBlendMode !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 2, this.localBlendMode = e, this._onUpdate());
	}
	/**
	* The blend mode to be applied to the sprite. Controls how pixels are blended when rendering.
	*
	* Setting to 'normal' will reset to default blending.
	* > [!NOTE] More blend modes are available after importing the `pixi.js/advanced-blend-modes` sub-export.
	* @example
	* ```ts
	* // Basic blend modes
	* sprite.blendMode = 'add';        // Additive blending
	* sprite.blendMode = 'multiply';   // Multiply colors
	* sprite.blendMode = 'screen';     // Screen blend
	*
	* // Reset blend mode
	* sprite.blendMode = 'normal';     // Normal blending
	* ```
	* @default 'normal'
	* @see {@link Container#alpha} For transparency
	* @see {@link Container#tint} For color adjustments
	*/
	get blendMode() {
		return this.localBlendMode;
	}
	/**
	* The visibility of the object. If false the object will not be drawn,
	* and the transform will not be updated.
	* @example
	* ```ts
	* // Basic visibility toggle
	* sprite.visible = false; // Hide sprite
	* sprite.visible = true;  // Show sprite
	* ```
	* @default true
	* @see {@link Container#renderable} For render-only control
	* @see {@link Container#alpha} For transparency
	*/
	get visible() {
		return !!(this.localDisplayStatus & 2);
	}
	set visible(e) {
		let t = e ? 2 : 0;
		(this.localDisplayStatus & 2) !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 4, this.localDisplayStatus ^= 2, this._onUpdate(), this.emit("visibleChanged", e));
	}
	/** @ignore */
	get culled() {
		return !(this.localDisplayStatus & 4);
	}
	/** @ignore */
	set culled(e) {
		let t = e ? 0 : 4;
		(this.localDisplayStatus & 4) !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= 4, this.localDisplayStatus ^= 4, this._onUpdate());
	}
	/**
	* Controls whether this object can be rendered. If false the object will not be drawn,
	* but the transform will still be updated. This is different from visible, which skips
	* transform updates.
	* @example
	* ```ts
	* // Basic render control
	* sprite.renderable = false; // Skip rendering
	* sprite.renderable = true;  // Enable rendering
	* ```
	* @default true
	* @see {@link Container#visible} For skipping transform updates
	* @see {@link Container#alpha} For transparency
	*/
	get renderable() {
		return !!(this.localDisplayStatus & 1);
	}
	set renderable(e) {
		let t = +!!e;
		(this.localDisplayStatus & 1) !== t && (this._updateFlags |= 4, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
	}
	/**
	* Whether or not the object should be rendered.
	* @advanced
	*/
	get isRenderable() {
		return this.localDisplayStatus === 7 && this.groupAlpha > 0;
	}
	/**
	* Removes all internal references and listeners as well as removes children from the display list.
	* Do not use a Container after calling `destroy`.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @example
	* ```ts
	* container.destroy();
	* container.destroy(true);
	* container.destroy({ children: true });
	* container.destroy({ children: true, texture: true, textureSource: true });
	* ```
	*/
	destroy(e = !1) {
		if (this.destroyed) return;
		this.destroyed = !0;
		let t;
		if (this.children.length && (t = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._origin = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof e == "boolean" ? e : e?.children) && t) for (let n = 0; n < t.length; ++n) t[n].destroy(e);
		this.renderGroup?.destroy(), this.renderGroup = null;
	}
};
i.mixin(Z, y, O, H, B, z, w, T, V, se, _, F, b);
//#endregion
//#region node_modules/pixi.js/lib/scene/view/ViewContainer.mjs
var fe = class extends Z {
	constructor(e) {
		super(e), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this._bounds = new d(0, 1, 0, 0), this._boundsDirty = !0, this.autoGarbageCollect = e.autoGarbageCollect ?? !0;
	}
	/**
	* The local bounds of the view in its own coordinate space.
	* Bounds are automatically updated when the view's content changes.
	* @example
	* ```ts
	* // Get bounds dimensions
	* const bounds = view.bounds;
	* console.log(`Width: ${bounds.maxX - bounds.minX}`);
	* console.log(`Height: ${bounds.maxY - bounds.minY}`);
	* ```
	* @returns The rectangular bounds of the view
	* @see {@link Bounds} For bounds operations
	*/
	get bounds() {
		return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = !1, this._bounds) : this._bounds;
	}
	/**
	* Whether or not to round the x/y position of the sprite.
	* @example
	* ```ts
	* // Enable pixel rounding for crisp rendering
	* view.roundPixels = true;
	* ```
	* @default false
	*/
	get roundPixels() {
		return !!this._roundPixels;
	}
	set roundPixels(e) {
		this._roundPixels = +!!e;
	}
	/**
	* Checks if the object contains the given point in local coordinates.
	* Uses the view's bounds for hit testing.
	* @example
	* ```ts
	* // Basic point check
	* const localPoint = { x: 50, y: 25 };
	* const contains = view.containsPoint(localPoint);
	* console.log('Point is inside:', contains);
	* ```
	* @param point - The point to check in local coordinates
	* @returns True if the point is within the view's bounds
	* @see {@link ViewContainer#bounds} For the bounds used in hit testing
	* @see {@link Container#toLocal} For converting global coordinates to local
	*/
	containsPoint(e) {
		let t = this.bounds, { x: n, y: r } = e;
		return n >= t.minX && n <= t.maxX && r >= t.minY && r <= t.maxY;
	}
	/** @private */
	onViewUpdate() {
		if (this._didViewChangeTick++, this._boundsDirty = !0, this.didViewUpdate) return;
		this.didViewUpdate = !0;
		let e = this.renderGroup || this.parentRenderGroup;
		e && e.onChildViewUpdate(this);
	}
	/** Unloads the GPU data from the view. */
	unload() {
		this.emit("unload", this);
		for (let e in this._gpuData) this._gpuData[e]?.destroy();
		this._gpuData = /* @__PURE__ */ Object.create(null), this.onViewUpdate();
	}
	destroy(e) {
		this.unload(), super.destroy(e), this._bounds = null;
	}
	/**
	* Collects renderables for the view container.
	* @param instructionSet - The instruction set to collect renderables for.
	* @param renderer - The renderer to collect renderables for.
	* @param currentLayer - The current render layer.
	* @internal
	*/
	collectRenderablesSimple(e, t, n) {
		let { renderPipes: r } = t;
		r.blendMode.pushBlendMode(this, this.groupBlendMode, e);
		let i = r[this.renderPipeId];
		i?.addRenderable && i.addRenderable(this, e), this.didViewUpdate = !1;
		let a = this.children, o = a.length;
		for (let r = 0; r < o; r++) a[r].collectRenderables(e, t, n);
		r.blendMode.popBlendMode(e);
	}
}, pe = class e extends fe {
	/**
	* @param options - The options for creating the sprite.
	*/
	constructor(e = f.EMPTY) {
		e instanceof f && (e = { texture: e });
		let { texture: t = f.EMPTY, anchor: n, roundPixels: r, width: i, height: a, ...o } = e;
		super({
			label: "Sprite",
			...o
		}), this.renderPipeId = "sprite", this.batched = !0, this._visualBounds = {
			minX: 0,
			maxX: 1,
			minY: 0,
			maxY: 0
		}, this._anchor = new g({ _onUpdate: () => {
			this.onViewUpdate();
		} }), n ? this.anchor = n : t.defaultAnchor && (this.anchor = t.defaultAnchor), this.texture = t, this.allowChildren = !1, this.roundPixels = r ?? !1, i !== void 0 && (this.width = i), a !== void 0 && (this.height = a);
	}
	/**
	* Creates a new sprite based on a source texture, image, video, or canvas element.
	* This is a convenience method that automatically creates and manages textures.
	* @example
	* ```ts
	* // Create from path or URL
	* const sprite = Sprite.from('assets/image.png');
	*
	* // Create from existing texture
	* const sprite = Sprite.from(texture);
	*
	* // Create from canvas
	* const canvas = document.createElement('canvas');
	* const sprite = Sprite.from(canvas, true); // Skip caching new texture
	* ```
	* @param source - The source to create the sprite from. Can be a path to an image, a texture,
	* or any valid texture source (canvas, video, etc.)
	* @param skipCache - Whether to skip adding to the texture cache when creating a new texture
	* @returns A new sprite based on the source
	* @see {@link Texture.from} For texture creation details
	* @see {@link Assets} For asset loading and management
	*/
	static from(t, n = !1) {
		return t instanceof f ? new e(t) : new e(f.from(t, n));
	}
	set texture(e) {
		e ||= f.EMPTY;
		let t = this._texture;
		t !== e && (t && t.dynamic && t.off("update", this.onViewUpdate, this), e.dynamic && e.on("update", this.onViewUpdate, this), this._texture = e, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
	}
	/**
	* The texture that is displayed by the sprite. When changed, automatically updates
	* the sprite dimensions and manages texture event listeners.
	* @example
	* ```ts
	* // Create sprite with texture
	* const sprite = new Sprite({
	*     texture: Texture.from('sprite.png')
	* });
	*
	* // Update texture
	* sprite.texture = Texture.from('newSprite.png');
	*
	* // Use texture from spritesheet
	* const sheet = await Assets.load('spritesheet.json');
	* sprite.texture = sheet.textures['frame1.png'];
	*
	* // Reset to empty texture
	* sprite.texture = Texture.EMPTY;
	* ```
	* @see {@link Texture} For texture creation and management
	* @see {@link Assets} For asset loading
	*/
	get texture() {
		return this._texture;
	}
	/**
	* The bounds of the sprite, taking into account the texture's trim area.
	* @example
	* ```ts
	* const texture = new Texture({
	*     source: new TextureSource({ width: 300, height: 300 }),
	*     frame: new Rectangle(196, 66, 58, 56),
	*     trim: new Rectangle(4, 4, 58, 56),
	*     orig: new Rectangle(0, 0, 64, 64),
	*     rotate: 2,
	* });
	* const sprite = new Sprite(texture);
	* const visualBounds = sprite.visualBounds;
	* // console.log(visualBounds); // { minX: -4, maxX: 62, minY: -4, maxY: 60 }
	*/
	get visualBounds() {
		return oe(this._visualBounds, this._anchor, this._texture), this._visualBounds;
	}
	/**
	* @deprecated
	* @ignore
	*/
	get sourceBounds() {
		return s("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead."), this.visualBounds;
	}
	/** @private */
	updateBounds() {
		let e = this._anchor, t = this._texture, n = this._bounds, { width: r, height: i } = t.orig;
		n.minX = -e._x * r, n.maxX = n.minX + r, n.minY = -e._y * i, n.maxY = n.minY + i;
	}
	/**
	* Destroys this sprite renderable and optionally its texture.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @example
	* sprite.destroy();
	* sprite.destroy(true);
	* sprite.destroy({ texture: true, textureSource: true });
	*/
	destroy(e = !1) {
		if (super.destroy(e), typeof e == "boolean" ? e : e?.texture) {
			let t = typeof e == "boolean" ? e : e?.textureSource;
			this._texture.destroy(t);
		}
		this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null;
	}
	/**
	* The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
	* and passed to the constructor.
	*
	* - The default is `(0,0)`, this means the sprite's origin is the top left.
	* - Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
	* - Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
	*
	* If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
	* @example
	* ```ts
	* // Center the anchor point
	* sprite.anchor = 0.5; // Sets both x and y to 0.5
	* sprite.position.set(400, 300); // Sprite will be centered at this position
	*
	* // Set specific x/y anchor points
	* sprite.anchor = {
	*     x: 1, // Right edge
	*     y: 0  // Top edge
	* };
	*
	* // Using individual coordinates
	* sprite.anchor.set(0.5, 1); // Center-bottom
	*
	* // For rotation around center
	* sprite.anchor.set(0.5);
	* sprite.rotation = Math.PI / 4; // 45 degrees around center
	*
	* // For scaling from center
	* sprite.anchor.set(0.5);
	* sprite.scale.set(2); // Scales from center point
	* ```
	*/
	get anchor() {
		return this._anchor;
	}
	set anchor(e) {
		typeof e == "number" ? this._anchor.set(e) : this._anchor.copyFrom(e);
	}
	/**
	* The width of the sprite, setting this will actually modify the scale to achieve the value set.
	* @example
	* ```ts
	* // Set width directly
	* sprite.width = 200;
	* console.log(sprite.scale.x); // Scale adjusted to match width
	*
	* // Set width while preserving aspect ratio
	* const ratio = sprite.height / sprite.width;
	* sprite.width = 300;
	* sprite.height = 300 * ratio;
	*
	* // For better performance when setting both width and height
	* sprite.setSize(300, 400); // Avoids recalculating bounds twice
	*
	* // Reset to original texture size
	* sprite.width = sprite.texture.orig.width;
	* ```
	*/
	get width() {
		return Math.abs(this.scale.x) * this._texture.orig.width;
	}
	set width(e) {
		this._setWidth(e, this._texture.orig.width), this._width = e;
	}
	/**
	* The height of the sprite, setting this will actually modify the scale to achieve the value set.
	* @example
	* ```ts
	* // Set height directly
	* sprite.height = 150;
	* console.log(sprite.scale.y); // Scale adjusted to match height
	*
	* // Set height while preserving aspect ratio
	* const ratio = sprite.width / sprite.height;
	* sprite.height = 200;
	* sprite.width = 200 * ratio;
	*
	* // For better performance when setting both width and height
	* sprite.setSize(300, 400); // Avoids recalculating bounds twice
	*
	* // Reset to original texture size
	* sprite.height = sprite.texture.orig.height;
	* ```
	*/
	get height() {
		return Math.abs(this.scale.y) * this._texture.orig.height;
	}
	set height(e) {
		this._setHeight(e, this._texture.orig.height), this._height = e;
	}
	/**
	* Retrieves the size of the Sprite as a [Size]{@link Size} object based on the texture dimensions and scale.
	* This is faster than getting width and height separately as it only calculates the bounds once.
	* @example
	* ```ts
	* // Basic size retrieval
	* const sprite = new Sprite(Texture.from('sprite.png'));
	* const size = sprite.getSize();
	* console.log(`Size: ${size.width}x${size.height}`);
	*
	* // Reuse existing size object
	* const reuseSize = { width: 0, height: 0 };
	* sprite.getSize(reuseSize);
	* ```
	* @param out - Optional object to store the size in, to avoid allocating a new object
	* @returns The size of the Sprite
	* @see {@link Sprite#width} For getting just the width
	* @see {@link Sprite#height} For getting just the height
	* @see {@link Sprite#setSize} For setting both width and height
	*/
	getSize(e) {
		return e ||= {}, e.width = Math.abs(this.scale.x) * this._texture.orig.width, e.height = Math.abs(this.scale.y) * this._texture.orig.height, e;
	}
	/**
	* Sets the size of the Sprite to the specified width and height.
	* This is faster than setting width and height separately as it only recalculates bounds once.
	* @example
	* ```ts
	* // Basic size setting
	* const sprite = new Sprite(Texture.from('sprite.png'));
	* sprite.setSize(100, 200); // Width: 100, Height: 200
	*
	* // Set uniform size
	* sprite.setSize(100); // Sets both width and height to 100
	*
	* // Set size with object
	* sprite.setSize({
	*     width: 200,
	*     height: 300
	* });
	*
	* // Reset to texture size
	* sprite.setSize(
	*     sprite.texture.orig.width,
	*     sprite.texture.orig.height
	* );
	* ```
	* @param value - This can be either a number or a {@link Size} object
	* @param height - The height to set. Defaults to the value of `width` if not provided
	* @see {@link Sprite#width} For setting width only
	* @see {@link Sprite#height} For setting height only
	* @see {@link Sprite#texture} For the source dimensions
	*/
	setSize(e, t) {
		typeof e == "object" ? (t = e.height ?? e.width, e = e.width) : t ??= e, e !== void 0 && this._setWidth(e, this._texture.orig.width), t !== void 0 && this._setHeight(t, this._texture.orig.height);
	}
}, me = class extends p {
	constructor(e) {
		e.resource ||= ie.get().createCanvas(), e.width || (e.width = e.resource.width, e.autoDensity || (e.width /= e.resolution)), e.height || (e.height = e.resource.height, e.autoDensity || (e.height /= e.resolution)), super(e), this.uploadMethodId = "image", this.autoDensity = e.autoDensity, this.resizeCanvas(), this.transparent = !!e.transparent;
	}
	resizeCanvas() {
		this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
	}
	resize(e = this.width, t = this.height, n = this._resolution) {
		let r = super.resize(e, t, n);
		return r && this.resizeCanvas(), r;
	}
	static test(e) {
		return globalThis.HTMLCanvasElement && e instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && e instanceof OffscreenCanvas;
	}
	/**
	* Returns the 2D rendering context for the canvas.
	* Caches the context after creating it.
	* @returns The 2D rendering context of the canvas.
	*/
	get context2D() {
		return this._context2D ||= this.resource.getContext("2d");
	}
};
me.extension = r.TextureSource;
//#endregion
//#region node_modules/pixi.js/lib/ticker/const.mjs
var Q = /* @__PURE__ */ ((e) => (e[e.INTERACTION = 50] = "INTERACTION", e[e.HIGH = 25] = "HIGH", e[e.NORMAL = 0] = "NORMAL", e[e.LOW = -25] = "LOW", e[e.UTILITY = -50] = "UTILITY", e))(Q || {}), $ = class {
	/**
	* Constructor
	* @private
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @param priority - The priority for emitting
	* @param once - If the handler should fire once
	*/
	constructor(e, t = null, n = 0, r = !1) {
		this.next = null, this.previous = null, this._destroyed = !1, this._fn = e, this._context = t, this.priority = n, this._once = r;
	}
	/**
	* Simple compare function to figure out if a function and context match.
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @returns `true` if the listener match the arguments
	*/
	match(e, t = null) {
		return this._fn === e && this._context === t;
	}
	/**
	* Emit by calling the current function.
	* @param ticker - The ticker emitting.
	* @returns Next ticker
	*/
	emit(e) {
		this._fn && (this._context ? this._fn.call(this._context, e) : this._fn(e));
		let t = this.next;
		return this._once && this.destroy(!0), this._destroyed && (this.next = null), t;
	}
	/**
	* Connect to the list.
	* @param previous - Input node, previous listener
	*/
	connect(e) {
		this.previous = e, e.next && (e.next.previous = this), this.next = e.next, e.next = this;
	}
	/**
	* Destroy and don't use after this.
	* @param hard - `true` to remove the `next` reference, this
	*        is considered a hard destroy. Soft destroy maintains the next reference.
	* @returns The listener to redirect while emitting or removing.
	*/
	destroy(e = !1) {
		this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
		let t = this.next;
		return this.next = e ? null : t, this.previous = null, t;
	}
}, he = class e {
	constructor() {
		this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new $(null, null, Infinity), this.deltaMS = 1 / e.targetFPMS, this.elapsedMS = 1 / e.targetFPMS, this._tick = (e) => {
			this._requestId = null, this.started && (this.update(e), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
		};
	}
	/**
	* Conditionally requests a new animation frame.
	* If a frame has not already been requested, and if the internal
	* emitter has listeners, a new frame is requested.
	*/
	_requestIfNeeded() {
		this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
	}
	/** Conditionally cancels a pending animation frame. */
	_cancelIfNeeded() {
		this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
	}
	/**
	* Conditionally requests a new animation frame.
	* If the ticker has been started it checks if a frame has not already
	* been requested, and if the internal emitter has listeners. If these
	* conditions are met, a new frame is requested. If the ticker has not
	* been started, but autoStart is `true`, then the ticker starts now,
	* and continues with the previous conditions to request a new frame.
	*/
	_startIfPossible() {
		this.started ? this._requestIfNeeded() : this.autoStart && this.start();
	}
	/**
	* Register a handler for tick events.
	* @param fn - The listener function to add. Receives the Ticker instance as parameter
	* @param context - The context for the listener
	* @param priority - The priority of the listener
	* @example
	* ```ts
	* // Access time properties through the ticker parameter
	* ticker.add((ticker) => {
	*     // Use deltaTime (dimensionless scalar) for frame-independent animations
	*     sprite.rotation += 0.1 * ticker.deltaTime;
	*
	*     // Use deltaMS (milliseconds) for time-based calculations
	*     const progress = ticker.deltaMS / animationDuration;
	*
	*     // Use elapsedMS for raw timing measurements
	*     console.log(`Raw frame time: ${ticker.elapsedMS}ms`);
	* });
	* ```
	*/
	add(e, t, n = Q.NORMAL) {
		return this._addListener(new $(e, t, n));
	}
	/**
	* Add a handler for the tick event which is only executed once on the next frame.
	* @example
	* ```ts
	* // Basic one-time update
	* ticker.addOnce(() => {
	*     console.log('Runs next frame only');
	* });
	*
	* // With specific context
	* const game = {
	*     init(ticker) {
	*         this.loadResources();
	*         console.log('Game initialized');
	*     }
	* };
	* ticker.addOnce(game.init, game);
	*
	* // With priority
	* ticker.addOnce(
	*     () => {
	*         // High priority one-time setup
	*         physics.init();
	*     },
	*     undefined,
	*     UPDATE_PRIORITY.HIGH
	* );
	* ```
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @param priority - The priority for emitting (default: UPDATE_PRIORITY.NORMAL)
	* @returns This instance of a ticker
	* @see {@link Ticker#add} For continuous updates
	* @see {@link Ticker#remove} For removing handlers
	*/
	addOnce(e, t, n = Q.NORMAL) {
		return this._addListener(new $(e, t, n, !0));
	}
	/**
	* Internally adds the event handler so that it can be sorted by priority.
	* Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
	* before the rendering.
	* @private
	* @param listener - Current listener being added.
	* @returns This instance of a ticker
	*/
	_addListener(e) {
		let t = this._head.next, n = this._head;
		if (!t) e.connect(n);
		else {
			for (; t;) {
				if (e.priority > t.priority) {
					e.connect(n);
					break;
				}
				n = t, t = t.next;
			}
			e.previous || e.connect(n);
		}
		return this._startIfPossible(), this;
	}
	/**
	* Removes any handlers matching the function and context parameters.
	* If no handlers are left after removing, then it cancels the animation frame.
	* @example
	* ```ts
	* // Basic removal
	* const onTick = () => {
	*     sprite.rotation += 0.1;
	* };
	* ticker.add(onTick);
	* ticker.remove(onTick);
	*
	* // Remove with context
	* const game = {
	*     update(ticker) {
	*         this.physics.update(ticker.deltaTime);
	*     }
	* };
	* ticker.add(game.update, game);
	* ticker.remove(game.update, game);
	*
	* // Remove all matching handlers
	* // (if same function was added multiple times)
	* ticker.add(onTick);
	* ticker.add(onTick);
	* ticker.remove(onTick); // Removes all instances
	* ```
	* @param fn - The listener function to be removed
	* @param context - The listener context to be removed
	* @returns This instance of a ticker
	* @see {@link Ticker#add} For adding handlers
	* @see {@link Ticker#addOnce} For one-time handlers
	*/
	remove(e, t) {
		let n = this._head.next;
		for (; n;) n = n.match(e, t) ? n.destroy() : n.next;
		return this._head.next || this._cancelIfNeeded(), this;
	}
	/**
	* The number of listeners on this ticker, calculated by walking through linked list.
	* @example
	* ```ts
	* // Check number of active listeners
	* const ticker = new Ticker();
	* console.log(ticker.count); // 0
	*
	* // Add some listeners
	* ticker.add(() => {});
	* ticker.add(() => {});
	* console.log(ticker.count); // 2
	*
	* // Check after cleanup
	* ticker.destroy();
	* console.log(ticker.count); // 0
	* ```
	* @readonly
	* @see {@link Ticker#add} For adding listeners
	* @see {@link Ticker#remove} For removing listeners
	*/
	get count() {
		if (!this._head) return 0;
		let e = 0, t = this._head;
		for (; t = t.next;) e++;
		return e;
	}
	/**
	* Starts the ticker. If the ticker has listeners a new animation frame is requested at this point.
	* @example
	* ```ts
	* // Basic manual start
	* const ticker = new Ticker();
	* ticker.add(() => {
	*     // Animation code here
	* });
	* ticker.start();
	* ```
	* @see {@link Ticker#stop} For stopping the ticker
	* @see {@link Ticker#autoStart} For automatic starting
	* @see {@link Ticker#started} For checking ticker state
	*/
	start() {
		this.started || (this.started = !0, this._requestIfNeeded());
	}
	/**
	* Stops the ticker. If the ticker has requested an animation frame it is canceled at this point.
	* @example
	* ```ts
	* // Basic stop
	* const ticker = new Ticker();
	* ticker.stop();
	* ```
	* @see {@link Ticker#start} For starting the ticker
	* @see {@link Ticker#started} For checking ticker state
	* @see {@link Ticker#destroy} For cleaning up the ticker
	*/
	stop() {
		this.started && (this.started = !1, this._cancelIfNeeded());
	}
	/**
	* Destroy the ticker and don't use after this. Calling this method removes all references to internal events.
	* @example
	* ```ts
	* // Clean up with active listeners
	* const ticker = new Ticker();
	* ticker.add(() => {});
	* ticker.destroy(); // Removes all listeners
	* ```
	* @see {@link Ticker#stop} For stopping without destroying
	* @see {@link Ticker#remove} For removing specific listeners
	*/
	destroy() {
		if (!this._protected) {
			this.stop();
			let e = this._head.next;
			for (; e;) e = e.destroy(!0);
			this._head.destroy(), this._head = null;
		}
	}
	/**
	* Triggers an update.
	*
	* An update entails setting the
	* current {@link Ticker#elapsedMS|elapsedMS},
	* the current {@link Ticker#deltaTime|deltaTime},
	* invoking all listeners with current deltaTime,
	* and then finally setting {@link Ticker#lastTime|lastTime}
	* with the value of currentTime that was provided.
	*
	* This method will be called automatically by animation
	* frame callbacks if the ticker instance has been started
	* and listeners are added.
	* @example
	* ```ts
	* // Basic manual update
	* const ticker = new Ticker();
	* ticker.update(performance.now());
	* ```
	* @param currentTime - The current time of execution (defaults to performance.now())
	* @see {@link Ticker#deltaTime} For frame delta value
	* @see {@link Ticker#elapsedMS} For raw elapsed time
	*/
	update(t = performance.now()) {
		let n;
		if (t > this.lastTime) {
			if (n = this.elapsedMS = t - this.lastTime, n > this._maxElapsedMS && (n = this._maxElapsedMS), n *= this.speed, this._minElapsedMS) {
				let e = t - this._lastFrame | 0;
				if (e < this._minElapsedMS) return;
				this._lastFrame = t - e % this._minElapsedMS;
			}
			this.deltaMS = n, this.deltaTime = this.deltaMS * e.targetFPMS;
			let r = this._head, i = r.next;
			for (; i;) i = i.emit(this);
			r.next || this._cancelIfNeeded();
		} else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
		this.lastTime = t;
	}
	/**
	* The frames per second at which this ticker is running.
	* The default is approximately 60 in most modern browsers.
	* > [!NOTE] This does not factor in the value of
	* > {@link Ticker#speed|speed}, which is specific
	* > to scaling {@link Ticker#deltaTime|deltaTime}.
	* @example
	* ```ts
	* // Basic FPS monitoring
	* ticker.add(() => {
	*     console.log(`Current FPS: ${Math.round(ticker.FPS)}`);
	* });
	* ```
	* @readonly
	*/
	get FPS() {
		return 1e3 / this.elapsedMS;
	}
	/**
	* Manages the maximum amount of milliseconds allowed to
	* elapse between invoking {@link Ticker#update|update}.
	*
	* This value is used to cap {@link Ticker#deltaTime|deltaTime},
	* but does not effect the measured value of {@link Ticker#FPS|FPS}.
	*
	* When setting this property it is clamped to a value between
	* `0` and `Ticker.targetFPMS * 1000` (typically 60).
	*
	* If `maxFPS` is currently set (non-zero) and `minFPS` is set above it,
	* `maxFPS` is automatically raised to match. This keeps the two limits consistent.
	* @example
	* ```ts
	* // Set minimum acceptable frame rate
	* const ticker = new Ticker();
	* ticker.minFPS = 30; // Never go below 30 FPS
	*
	* // Use with maxFPS for frame rate clamping
	* ticker.minFPS = 30;
	* ticker.maxFPS = 60;
	*
	* // minFPS above maxFPS pushes maxFPS up
	* ticker.minFPS = 50; // maxFPS is raised to 50
	* ```
	* @default 10
	*/
	get minFPS() {
		return 1e3 / this._maxElapsedMS;
	}
	set minFPS(t) {
		let n = Math.min(Math.max(0, t) / 1e3, e.targetFPMS);
		this._maxElapsedMS = 1 / n, this._minElapsedMS && t > this.maxFPS && (this.maxFPS = t);
	}
	/**
	* Manages the minimum amount of milliseconds required to
	* elapse between invoking {@link Ticker#update|update}.
	*
	* This will effect the measured value of {@link Ticker#FPS|FPS}.
	*
	* If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
	* Otherwise it will be at least `minFPS`.
	*
	* If `maxFPS` is set below the current `minFPS`, `minFPS` is automatically lowered to match.
	* This keeps the two limits consistent.
	* @example
	* ```ts
	* // Cap the frame rate
	* const ticker = new Ticker();
	* ticker.maxFPS = 60; // Never go above 60 FPS
	*
	* // Use with minFPS for frame rate clamping
	* ticker.minFPS = 30;
	* ticker.maxFPS = 60;
	*
	* // maxFPS below minFPS pushes minFPS down
	* ticker.maxFPS = 20; // minFPS is now also 20
	* ```
	* @default 0
	*/
	get maxFPS() {
		return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
	}
	set maxFPS(e) {
		e === 0 ? this._minElapsedMS = 0 : (e < this.minFPS && (this.minFPS = e), this._minElapsedMS = 1 / (e / 1e3));
	}
	/**
	* The shared ticker instance used by {@link AnimatedSprite} and by
	* {@link VideoSource} to update animation frames / video textures.
	*
	* It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
	*
	* The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
	* Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
	* @example
	* import { Ticker } from 'pixi.js';
	*
	* const ticker = Ticker.shared;
	* // Set this to prevent starting this ticker when listeners are added.
	* // By default this is true only for the Ticker.shared instance.
	* ticker.autoStart = false;
	*
	* // FYI, call this to ensure the ticker is stopped. It should be stopped
	* // if you have not attempted to render anything yet.
	* ticker.stop();
	*
	* // Call this when you are ready for a running shared ticker.
	* ticker.start();
	* @example
	* import { autoDetectRenderer, Container } from 'pixi.js';
	*
	* // You may use the shared ticker to render...
	* const renderer = autoDetectRenderer();
	* const stage = new Container();
	* document.body.appendChild(renderer.view);
	* ticker.add((time) => renderer.render(stage));
	*
	* // Or you can just update it manually.
	* ticker.autoStart = false;
	* ticker.stop();
	* const animate = (time) => {
	*     ticker.update(time);
	*     renderer.render(stage);
	*     requestAnimationFrame(animate);
	* };
	* animate(performance.now());
	* @type {Ticker}
	* @readonly
	*/
	static get shared() {
		if (!e._shared) {
			let t = e._shared = new e();
			t.autoStart = !0, t._protected = !0;
		}
		return e._shared;
	}
	/**
	* The system ticker instance used by {@link PrepareBase} for core timing
	* functionality that shouldn't usually need to be paused, unlike the `shared`
	* ticker which drives visual animations and rendering which may want to be paused.
	*
	* The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
	* @type {Ticker}
	* @readonly
	* @advanced
	*/
	static get system() {
		if (!e._system) {
			let t = e._system = new e();
			t.autoStart = !0, t._protected = !0;
		}
		return e._system;
	}
};
/**
* Target frame rate in frames per millisecond.
* Used for converting deltaTime to a scalar time delta.
* @example
* ```ts
* // Default is 0.06 (60 FPS)
* console.log(Ticker.targetFPMS); // 0.06
*
* // Calculate target frame duration
* const frameDuration = 1 / Ticker.targetFPMS; // ≈ 16.67ms
*
* // Use in custom timing calculations
* const deltaTime = elapsedMS * Ticker.targetFPMS;
* ```
* @remarks
* - Default is 0.06 (equivalent to 60 FPS)
* - Used in deltaTime calculations
* - Affects all ticker instances
* @default 0.06
* @see {@link Ticker#deltaTime} For time scaling
* @see {@link Ticker#FPS} For actual frame rate
*/
he.targetFPMS = .06;
var ge = he;
//#endregion
export { x as A, O as C, w as D, T as E, se as F, oe as I, g as L, y as M, v as N, C as O, _ as P, j as S, E as T, I as _, pe as a, N as b, K as c, U as d, H as f, R as g, z as h, me as i, b as j, S as k, G as l, B as m, $ as n, fe as o, V as p, Q as r, Z as s, ge as t, W as u, P as v, D as w, k as x, F as y };
