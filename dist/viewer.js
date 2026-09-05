import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { A as t, I as n } from "./adapter-DdgmR4Id.js";
import { i as r, n as i, o as a, s as o, t as s } from "./lib-D_Ni3XdB.js";
import { a as c, s as l } from "./Ticker-CsadseLF.js";
import { p as u } from "./CanvasRenderer-CPc6d_4y.js";
//#region node_modules/svelte/src/constants.js
var d = Symbol(), f = Array.isArray, p = Array.prototype.indexOf, m = Array.prototype.includes;
Array.from;
var h = Object.getOwnPropertyDescriptor, g = Object.prototype, ee = Array.prototype, _ = Object.getPrototypeOf, te = () => {};
/** @param {Array<() => void>} arr */
function ne(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
/**
* TODO replace with Promise.withResolvers once supported widely enough
* @template [T=void]
*/
function re() {
	/** @type {(value: T) => void} */
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var v = 1024, y = 2048, b = 4096, ie = 16384, ae = 32768, oe = 1 << 25, se = 65536, ce = 1 << 19, x = 65536, le = 1 << 21, ue = 1 << 23, de = Symbol("$state"), fe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
globalThis.document?.contentType;
/**
* Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
* @returns {never}
*/
function pe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
/**
* Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
* @returns {never}
*/
function me() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
/**
* Cannot set prototype of `$state` object
* @returns {never}
*/
function he() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
/**
* Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
* @returns {never}
*/
function ge() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
/**
* Reading a derived belonging to a now-destroyed effect may result in stale values
*/
function _e() {
	console.warn("https://svelte.dev/e/derived_inert");
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
/** @import { Equals } from '#client' */
/** @type {Equals} */
function ve(e) {
	return e === this.v;
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */
/** @type {ComponentContext | null} */
var ye = null;
/** @param {ComponentContext | null} context */
function be(e) {
	ye = e;
}
/** @returns {boolean} */
function S() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
/** @type {Array<() => void>} */
var C = [];
function xe() {
	var e = C;
	C = [], ne(e);
}
/**
* @param {() => void} fn
*/
function Se(e) {
	if (C.length === 0 && !Ae) {
		var t = C;
		queueMicrotask(() => {
			t === C && xe();
		});
	}
	C.push(e);
}
/**
* @param {unknown} error
*/
function Ce(e) {
	var t = B;
	if (t === null) return L.f |= ue, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	we(e, t);
}
/**
* @param {unknown} error
* @param {Effect | null} effect
*/
function we(e, t) {
	for (; t !== null;) {
		if (t.f & 128) {
			if (!(t.f & 32768)) throw e;
			try {
				/** @type {Boundary} */ t.b.error(e);
				return;
			} catch (t) {
				e = t;
			}
		}
		t = t.parent;
	}
	throw e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
/** @import { Derived, Signal } from '#client' */
var Te = ~(y | b | v);
/**
* @param {Signal} signal
* @param {number} status
*/
function w(e, t) {
	e.f = e.f & Te | t;
}
/**
* Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
* @param {Derived} derived
*/
function Ee(e) {
	e.f & 512 || e.deps === null ? w(e, v) : w(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
/** @import { Derived, Effect, Value } from '#client' */
/**
* @param {Value[] | null} deps
*/
function De(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= x, De(
		/** @type {Derived} */
		t.deps
	));
}
/**
* @param {Effect} effect
* @param {Set<Effect>} dirty_effects
* @param {Set<Effect>} maybe_dirty_effects
*/
function Oe(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), De(e.deps), w(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
/**
* We set this to `true` when updating a store so that we correctly
* schedule effects if the update takes place inside a `$:` effect
*/
var T = /* @__PURE__ */ new Set(), E = null, D = null, ke = null, Ae = !1, je = !1, O = null, k = null, Me = 0, Ne = 1, Pe = class e {
	id = Ne++;
	/**
	* The current values of any signals that are updated in this batch.
	* Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
	* They keys of this map are identical to `this.#previous`
	* @type {Map<Value, [any, boolean]>}
	*/
	current = /* @__PURE__ */ new Map();
	/**
	* The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
	* They keys of this map are identical to `this.#current`
	* @type {Map<Value, any>}
	*/
	previous = /* @__PURE__ */ new Map();
	/**
	* When the batch is committed (and the DOM is updated), we need to remove old branches
	* and append new ones by calling the functions added inside (if/each/key/etc) blocks
	* @type {Set<(batch: Batch) => void>}
	*/
	#e = /* @__PURE__ */ new Set();
	/**
	* If a fork is discarded, we need to destroy any effects that are no longer needed
	* @type {Set<(batch: Batch) => void>}
	*/
	#t = /* @__PURE__ */ new Set();
	/**
	* Callbacks that should run only when a fork is committed.
	* @type {Set<(batch: Batch) => void>}
	*/
	#n = /* @__PURE__ */ new Set();
	/**
	* Async effects that are currently in flight
	* @type {Map<Effect, number>}
	*/
	#r = /* @__PURE__ */ new Map();
	/**
	* Async effects that are currently in flight, _not_ inside a pending boundary
	* @type {Map<Effect, number>}
	*/
	#i = /* @__PURE__ */ new Map();
	/**
	* A deferred that resolves when the batch is committed, used with `settled()`
	* TODO replace with Promise.withResolvers once supported widely enough
	* @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
	*/
	#a = null;
	/**
	* The root effects that need to be flushed
	* @type {Effect[]}
	*/
	#o = [];
	/**
	* Effects created while this batch was active.
	* @type {Effect[]}
	*/
	#s = [];
	/**
	* Deferred effects (which run after async work has completed) that are DIRTY
	* @type {Set<Effect>}
	*/
	#c = /* @__PURE__ */ new Set();
	/**
	* Deferred effects that are MAYBE_DIRTY
	* @type {Set<Effect>}
	*/
	#l = /* @__PURE__ */ new Set();
	/**
	* A map of branches that still exist, but will be destroyed when this batch
	* is committed — we skip over these during `process`.
	* The value contains child effects that were dirty/maybe_dirty before being reset,
	* so they can be rescheduled if the branch survives.
	* @type {Map<Effect, { d: Effect[], m: Effect[] }>}
	*/
	#u = /* @__PURE__ */ new Map();
	/**
	* Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
	* @type {Set<Effect>}
	*/
	#d = /* @__PURE__ */ new Set();
	is_fork = !1;
	#f = !1;
	/** @type {Set<Batch>} */
	#p = /* @__PURE__ */ new Set();
	#m() {
		return this.is_fork || this.#i.size > 0;
	}
	#h() {
		for (let n of this.#p) for (let r of n.#i.keys()) {
			for (var e = !1, t = r; t.parent !== null;) {
				if (this.#u.has(t)) {
					e = !0;
					break;
				}
				t = t.parent;
			}
			if (!e) return !0;
		}
		return !1;
	}
	/**
	* Add an effect to the #skipped_branches map and reset its children
	* @param {Effect} effect
	*/
	skip_effect(e) {
		this.#u.has(e) || this.#u.set(e, {
			d: [],
			m: []
		}), this.#d.delete(e);
	}
	/**
	* Remove an effect from the #skipped_branches map and reschedule
	* any tracked dirty/maybe_dirty child effects
	* @param {Effect} effect
	* @param {(e: Effect) => void} callback
	*/
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#u.get(e);
		if (n) {
			this.#u.delete(e);
			for (var r of n.d) w(r, y), t(r);
			for (r of n.m) w(r, b), t(r);
		}
		this.#d.add(e);
	}
	#g() {
		if (Me++ > 1e3 && (T.delete(this), Fe()), !this.#m()) {
			for (let e of this.#c) this.#l.delete(e), w(e, y), this.schedule(e);
			for (let e of this.#l) w(e, b), this.schedule(e);
		}
		let t = this.#o;
		this.#o = [], this.apply();
		/** @type {Effect[]} */
		var n = O = [], r = [], i = k = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw ze(e), t;
		}
		if (E = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (O = null, k = null, this.#m() || this.#h()) {
			this.#v(r), this.#v(n);
			for (let [e, t] of this.#u) Re(e, t);
		} else {
			this.#r.size === 0 && T.delete(this), this.#c.clear(), this.#l.clear();
			for (let e of this.#e) e(this);
			this.#e.clear(), Ie(r), Ie(n), this.#a?.resolve();
		}
		var o = E;
		if (this.#o.length > 0) {
			let e = o ??= this;
			e.#o.push(...this.#o.filter((t) => !e.#o.includes(t)));
		}
		o !== null && (T.add(o), o.#g());
	}
	/**
	* Traverse the effect tree, executing effects or stashing
	* them for later execution as appropriate
	* @param {Effect} root
	* @param {Effect[]} effects
	* @param {Effect[]} render_effects
	*/
	#_(e, t, n) {
		e.f ^= v;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#u.has(r)) && r.fn !== null) {
				a ? r.f ^= v : i & 4 ? t.push(r) : J(r) && (i & 16 && this.#l.add(r), X(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	/**
	* @param {Effect[]} effects
	*/
	#v(e) {
		for (var t = 0; t < e.length; t += 1) Oe(e[t], this.#c, this.#l);
	}
	/**
	* Associate a change to a given source with the current
	* batch, noting its previous and current values
	* @param {Value} source
	* @param {any} value
	* @param {boolean} [is_derived]
	*/
	capture(e, t, n = !1) {
		e.v !== d && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), D?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		E = this;
	}
	deactivate() {
		E = null, D = null;
	}
	flush() {
		try {
			je = !0, E = this, this.#g();
		} finally {
			Me = 0, ke = null, O = null, k = null, je = !1, E = null, D = null, j.clear();
		}
	}
	discard() {
		for (let e of this.#t) e(this);
		this.#t.clear(), this.#n.clear(), T.delete(this);
	}
	/**
	* @param {Effect} effect
	*/
	register_created_effect(e) {
		this.#s.push(e);
	}
	/**
	* @param {boolean} blocking
	* @param {Effect} effect
	*/
	increment(e, t) {
		let n = this.#r.get(t) ?? 0;
		if (this.#r.set(t, n + 1), e) {
			let e = this.#i.get(t) ?? 0;
			this.#i.set(t, e + 1);
		}
	}
	/**
	* @param {boolean} blocking
	* @param {Effect} effect
	* @param {boolean} skip - whether to skip updates (because this is triggered by a stale reaction)
	*/
	decrement(e, t, n) {
		let r = this.#r.get(t) ?? 0;
		if (r === 1 ? this.#r.delete(t) : this.#r.set(t, r - 1), e) {
			let e = this.#i.get(t) ?? 0;
			e === 1 ? this.#i.delete(t) : this.#i.set(t, e - 1);
		}
		this.#f || n || (this.#f = !0, Se(() => {
			this.#f = !1, this.flush();
		}));
	}
	/**
	* @param {Set<Effect>} dirty_effects
	* @param {Set<Effect>} maybe_dirty_effects
	*/
	transfer_effects(e, t) {
		for (let t of e) this.#c.add(t);
		for (let e of t) this.#l.add(e);
		e.clear(), t.clear();
	}
	/** @param {(batch: Batch) => void} fn */
	oncommit(e) {
		this.#e.add(e);
	}
	/** @param {(batch: Batch) => void} fn */
	ondiscard(e) {
		this.#t.add(e);
	}
	/** @param {(batch: Batch) => void} fn */
	on_fork_commit(e) {
		this.#n.add(e);
	}
	run_fork_commit_callbacks() {
		for (let e of this.#n) e(this);
		this.#n.clear();
	}
	settled() {
		return (this.#a ??= re()).promise;
	}
	static ensure() {
		if (E === null) {
			let t = E = new e();
			je || (T.add(E), Se(() => {
				E === t && t.flush();
			}));
		}
		return E;
	}
	apply() {
		D = null;
	}
	/**
	*
	* @param {Effect} effect
	*/
	schedule(e) {
		if (ke = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (O !== null && t === B && (L === null || !(L.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= v;
			}
		}
		this.#o.push(t);
	}
};
function Fe() {
	try {
		pe();
	} catch (e) {
		we(e, ke);
	}
}
/** @type {Set<Effect> | null} */
var A = null;
/**
* @param {Array<Effect>} effects
* @returns {void}
*/
function Ie(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && J(r) && (A = /* @__PURE__ */ new Set(), X(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && st(r), A?.size > 0)) {
				j.clear();
				for (let e of A) {
					if (e.f & 24576) continue;
					/** @type {Effect[]} */
					let t = [e], n = e.parent;
					for (; n !== null;) A.has(n) && (A.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || X(n);
					}
				}
				A.clear();
			}
		}
		A = null;
	}
}
/**
* @param {Effect} effect
* @returns {void}
*/
function Le(e) {
	/** @type {Batch} */ E.schedule(e);
}
/**
* Mark all the effects inside a skipped branch CLEAN, so that
* they can be correctly rescheduled later. Tracks dirty and maybe_dirty
* effects so they can be rescheduled if the branch survives.
* @param {Effect} effect
* @param {{ d: Effect[], m: Effect[] }} tracked
*/
function Re(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), w(e, v);
		for (var n = e.first; n !== null;) Re(n, t), n = n.next;
	}
}
/**
* Mark an entire effect tree clean following an error
* @param {Effect} effect
*/
function ze(e) {
	w(e, v);
	for (var t = e.first; t !== null;) ze(t), t = t.next;
}
se | ce;
/**
* @param {Derived} derived
* @returns {void}
*/
function Be(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) at(t[n]);
	}
}
/**
* @template T
* @param {Derived} derived
* @returns {T}
*/
function Ve(e) {
	var t, n = B, r = e.parent;
	if (!I && r !== null && r.f & 24576) return _e(), e.v;
	V(r);
	try {
		e.f &= ~x, Be(e), t = gt(e);
	} finally {
		V(n);
	}
	return t;
}
/**
* @param {Derived} derived
* @returns {void}
*/
function He(e) {
	var t = Ve(e);
	if (!e.equals(t) && (e.wv = mt(), (!E?.is_fork || e.deps === null) && (E === null ? e.v = t : E.capture(e, t, !0), e.deps === null))) {
		w(e, v);
		return;
	}
	I || (D === null ? Ee(e) : (tt() || E?.is_fork) && D.set(e, t));
}
/**
* @param {Derived} derived
*/
function Ue(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(fe), t.teardown = te, t.ac = null, Y(t, 0), rt(t));
}
/**
* @param {Derived} derived
*/
function We(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && X(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
/** @import { Derived, Effect, Source, Value } from '#client' */
/** @type {Set<any>} */
var Ge = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Map(), Ke = !1;
/**
* @template V
* @param {V} v
* @param {Error | null} [stack]
* @returns {Source<V>}
*/
function qe(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ve,
		rv: 0,
		wv: 0
	};
}
/**
* @template V
* @param {V} v
* @param {Error | null} [stack]
*/
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = qe(e, t);
	return ut(n), n;
}
/**
* @template V
* @param {Source<V>} source
* @param {V} value
* @param {boolean} [should_proxy]
* @returns {V}
*/
function N(e, t, n = !1) {
	return L !== null && (!R || L.f & 131072) && S() && L.f & 4325394 && (H === null || !m.call(H, e)) && ge(), Je(e, n ? P(t) : t, k);
}
/**
* @template V
* @param {Source<V>} source
* @param {V} value
* @param {Effect[] | null} [updated_during_traversal]
* @returns {V}
*/
function Je(e, t, n = null) {
	if (!e.equals(t)) {
		j.set(e, I ? t : e.v);
		var r = Pe.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Ve(t), D === null && Ee(t);
		}
		e.wv = mt(), Ze(e, y, n), S() && B !== null && B.f & 1024 && !(B.f & 96) && (G === null ? dt([e]) : G.push(e)), !r.is_fork && Ge.size > 0 && !Ke && Ye();
	}
	return t;
}
function Ye() {
	Ke = !1;
	for (let e of Ge) e.f & 1024 && w(e, b), J(e) && X(e);
	Ge.clear();
}
/**
* Silently (without using `get`) increment a source
* @param {Source<number>} source
*/
function Xe(e) {
	N(e, e.v + 1);
}
/**
* @param {Value} signal
* @param {number} status should be DIRTY or MAYBE_DIRTY
* @param {Effect[] | null} updated_during_traversal
* @returns {void}
*/
function Ze(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = S(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== B) {
			var l = (c & y) === 0;
			if (l && w(s, t), c & 2) {
				var u = s;
				D?.delete(u), c & 65536 || (c & 512 && (s.f |= x), Ze(u, b, n));
			} else if (l) {
				var d = s;
				c & 16 && A !== null && A.add(d), n === null ? Le(d) : n.push(d);
			}
		}
	}
}
/**
* @template T
* @param {T} value
* @returns {T}
*/
function P(e) {
	if (typeof e != "object" || !e || de in e) return e;
	let t = _(e);
	if (t !== g && t !== ee) return e;
	/** @type {Map<any, Source<any>>} */
	var n = /* @__PURE__ */ new Map(), r = f(e), i = /* @__PURE__ */ M(0), a = null, o = q, s = (e) => {
		if (q === o) return e();
		var t = L, n = q;
		z(null), pt(o);
		var r = e();
		return z(t), pt(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ M(
		/** @type {any[]} */
		e.length,
		a
	)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && me();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ M(r.value, a);
				return n.set(t, e), e;
			}) : N(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ M(d, a));
					n.set(t, e), Xe(i);
				}
			} else N(r, d), Xe(i);
			return !0;
		},
		get(t, r, i) {
			if (r === de) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || h(t, r)?.writable) && (o = s(() => /* @__PURE__ */ M(P(c ? t[r] : d), a)), n.set(r, o)), o !== void 0) {
				var l = Z(o);
				return l === d ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = Z(i));
			} else if (r === void 0) {
				var a = n.get(t), o = a?.v;
				if (a !== void 0 && o !== d) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === de) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== d || Reflect.has(e, t);
			return (r !== void 0 || B !== null && (!i || h(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ M(i ? P(e[t]) : d, a)), n.set(t, r)), Z(r) === d) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var f = o; f < l.v; f += 1) {
				var p = n.get(f + "");
				p === void 0 ? f in e && (p = s(() => /* @__PURE__ */ M(d, a)), n.set(f + "", p)) : N(p, d);
			}
			if (l === void 0) (!u || h(e, t)?.writable) && (l = s(() => /* @__PURE__ */ M(void 0, a)), N(l, P(o)), n.set(t, l));
			else {
				u = l.v !== d;
				var m = s(() => P(o));
				N(l, m);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var ee = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= ee.v && N(ee, _ + 1);
				}
				Xe(i);
			}
			return !0;
		},
		ownKeys(e) {
			Z(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== d;
			});
			for (var [r, a] of n) a.v !== d && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			he();
		}
	});
}
var Qe;
/**
* @template {Node} N
* @param {N} node
*/
/*@__NO_SIDE_EFFECTS__*/
function $e(e) {
	return Qe.call(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
/**
* @template T
* @param {() => T} fn
*/
function et(e) {
	var t = L, n = B;
	z(null), V(null);
	try {
		return e();
	} finally {
		z(t), V(n);
	}
}
/**
* Internal representation of `$effect.tracking()`
* @returns {boolean}
*/
function tt() {
	return L !== null && !R;
}
/**
* @param {Effect} effect
*/
function nt(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = I, n = L;
		lt(!0), z(null);
		try {
			t.call(null);
		} finally {
			lt(e), z(n);
		}
	}
}
/**
* @param {Effect} signal
* @param {boolean} remove_dom
* @returns {void}
*/
function rt(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && et(() => {
			e.abort(fe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : at(n, t), n = r;
	}
}
/**
* @param {Effect} signal
* @returns {void}
*/
function it(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || at(t), t = n;
	}
}
/**
* @param {Effect} effect
* @param {boolean} [remove_dom]
* @returns {void}
*/
function at(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (ot(e.nodes.start, e.nodes.end), n = !0), w(e, oe), rt(e, t && !n), Y(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	nt(e), e.f ^= oe, e.f |= ie;
	var i = e.parent;
	i !== null && i.first !== null && st(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
/**
*
* @param {TemplateNode | null} node
* @param {TemplateNode} end
*/
function ot(e, t) {
	for (; e !== null;) {
		/** @type {TemplateNode | null} */
		var n = e === t ? null : /* @__PURE__ */ $e(e);
		e.remove(), e = n;
	}
}
/**
* Detach an effect from the effect tree, freeing up memory and
* reducing the amount of work that happens on subsequent traversals
* @param {Effect} effect
*/
function st(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
/**
* @type {Set<Value> | null}
* @deprecated
*/
var ct = null, F = !1, I = !1;
/** @param {boolean} value */
function lt(e) {
	I = e;
}
/** @type {null | Reaction} */
var L = null, R = !1;
/** @param {null | Reaction} reaction */
function z(e) {
	L = e;
}
/** @type {null | Effect} */
var B = null;
/** @param {null | Effect} effect */
function V(e) {
	B = e;
}
/**
* When sources are created within a reaction, reading and writing
* them within that reaction should not cause a re-run
* @type {null | Source[]}
*/
var H = null;
/** @param {Value} value */
function ut(e) {
	L !== null && (H === null ? H = [e] : H.push(e));
}
/**
* The dependencies of the reaction that is currently being executed. In many cases,
* the dependencies are unchanged between runs, and so this will be `null` unless
* and until a new dependency is accessed — we track this via `skipped_deps`
* @type {null | Value[]}
*/
var U = null, W = 0, G = null;
/** @param {null | Source[]} value */
function dt(e) {
	G = e;
}
/**
* @type {number} Used by sources and deriveds for handling updates.
* Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
**/
var ft = 1, K = 0, q = K;
/** @param {number} value */
function pt(e) {
	q = e;
}
function mt() {
	return ++ft;
}
/**
* Determines whether a derived or effect is dirty.
* If it is MAYBE_DIRTY, will set the status to CLEAN
* @param {Reaction} reaction
* @returns {boolean}
*/
function J(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~x), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (J(a) && He(a), a.wv > e.wv) return !0;
		}
		t & 512 && D === null && w(e, v);
	}
	return !1;
}
/**
* @param {Value} signal
* @param {Effect} effect
* @param {boolean} [root]
*/
function ht(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(H !== null && m.call(H, e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ht(a, t, !1) : t === a && (n ? w(a, y) : a.f & 1024 && w(a, b), Le(a));
	}
}
/** @param {Reaction} reaction */
function gt(e) {
	var t = U, n = W, r = G, i = L, a = H, o = ye, s = R, c = q, l = e.f;
	U = null, W = 0, G = null, L = l & 96 ? null : e, H = null, be(e.ctx), R = !1, q = ++K, e.ac !== null && (et(() => {
		/** @type {AbortController} */ e.ac.abort(fe);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= ae;
		var f = e.deps, p = E?.is_fork;
		if (U !== null) {
			var m;
			if (p || Y(e, W), f !== null && W > 0) for (f.length = W + U.length, m = 0; m < U.length; m++) f[W + m] = U[m];
			else e.deps = f = U;
			if (tt() && e.f & 512) for (m = W; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && W < f.length && (Y(e, W), f.length = W);
		if (S() && G !== null && !R && f !== null && !(e.f & 6146)) for (m = 0; m < G.length; m++) ht(G[m], e);
		if (i !== null && i !== e) {
			if (K++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = K;
			if (t !== null) for (let e of t) e.rv = K;
			G !== null && (r === null ? r = G : r.push(...G));
		}
		return e.f & 8388608 && (e.f ^= ue), d;
	} catch (e) {
		return Ce(e);
	} finally {
		e.f ^= le, U = t, W = n, G = r, L = i, H = a, be(o), R = s, q = c;
	}
}
/**
* @template V
* @param {Reaction} signal
* @param {Value<V>} dependency
* @returns {void}
*/
function _t(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = p.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (U === null || !m.call(U, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512, a.f &= ~x), a.v !== d && Ee(a), Ue(a), Y(a, 0);
	}
}
/**
* @param {Reaction} signal
* @param {number} start_index
* @returns {void}
*/
function Y(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) _t(e, n[r]);
}
/**
* @param {Effect} effect
* @returns {void}
*/
function X(e) {
	var t = e.f;
	if (!(t & 16384)) {
		w(e, v);
		var n = B, r = F;
		B = e, F = !0;
		try {
			t & 16777232 ? it(e) : rt(e), nt(e);
			var i = gt(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ft;
		} finally {
			F = r, B = n;
		}
	}
}
/**
* @template V
* @param {Value<V>} signal
* @returns {V}
*/
function Z(e) {
	var t = !!(e.f & 2);
	if (ct?.add(e), L !== null && !R && !(B !== null && B.f & 16384) && (H === null || !m.call(H, e))) {
		var n = L.deps;
		if (L.f & 2097152) e.rv < K && (e.rv = K, U === null && n !== null && n[W] === e ? W++ : U === null ? U = [e] : U.push(e));
		else {
			(L.deps ??= []).push(e);
			var r = e.reactions;
			r === null ? e.reactions = [L] : m.call(r, L) || r.push(L);
		}
	}
	if (I && j.has(e)) return j.get(e);
	if (t) {
		var i = e;
		if (I) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || yt(i)) && (a = Ve(i)), j.set(i, a), a;
		}
		var o = !(i.f & 512) && !R && L !== null && (F || !!(L.f & 512)), s = (i.f & ae) === 0;
		J(i) && (o && (i.f |= 512), He(i)), o && !s && (We(i), vt(i));
	}
	if (D?.has(e)) return D.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
/**
* (Re)connect a disconnected derived, so that it is notified
* of changes in `mark_reactions`
* @param {Derived} derived
*/
function vt(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (We(t), vt(t));
}
/** @param {Derived} derived */
function yt(e) {
	if (e.v === d) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (j.has(t) || t.f & 2 && yt(t)) return !0;
	return !1;
}
globalThis?.window?.trustedTypes, [.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
/**
* Subset of delegated events which should be passive by default.
* These two are already passive via browser defaults on window, document and body.
* But since
* - we're delegating them
* - they happen often
* - they apply to mobile which is generally less performant
* we're marking them as passive by default for other elements, too.
*/
var bt = class {
	current;
	target;
	stiffness;
	damping;
	precision;
	last;
	constructor(e, t = {}) {
		this.current = e, this.target = e, this.last = e, this.stiffness = t.stiffness ?? .15, this.damping = t.damping ?? .8, this.precision = t.precision ?? .01;
	}
	set(e, t) {
		this.target = e, t?.instant && (this.current = e, this.last = e);
	}
	update(e = 1) {
		if (this.current === this.target && this.last === this.current) return;
		let t = Math.min(e, 2), n = this.target - this.current, r = (this.current - this.last) / (t || 1), i = (r + (this.stiffness * n - this.damping * r)) * t;
		this.last = this.current, Math.abs(i) < this.precision && Math.abs(n) < this.precision ? (this.current = this.target, this.last = this.target) : this.current += i;
	}
}, xt = {
	M950AMod_4302: { destroy: { y: 500 } },
	M950A_4302: { destroy: { y: 500 } },
	AKAlfa_4601: { normal: { y: 600 } },
	AUG_4802: { destroy: { y: 500 } },
	G36C_5201: { destroy: { y: 500 } },
	"56-1type_7706": {
		normal: { scale: 1.4 },
		destroy: {
			y: -400,
			scale: 1.2
		}
	},
	Stevens520_10407: {
		normal: {
			y: -150,
			scale: 1.4
		},
		destroy: {
			y: -150,
			scale: 1.4
		}
	},
	Saiga12_5402: { destroy: { y: 300 } },
	UMP45_584: {
		normal: { origin: !1 },
		destroy: { origin: !1 }
	},
	UMP45Mod_584: {
		normal: { origin: !1 },
		destroy: { origin: !1 }
	},
	G41_7406: { destroy: { scale: 1.6 } }
}, St = -20, Ct = 20, Q = 1.1, $ = (function(e) {
	return e.IDLE = "idle", e.LOADING = "loading", e.READY = "ready", e.ERROR = "error", e;
})({}), wt = class {
	app;
	model;
	canvas;
	bgSprite = null;
	bgUrl = null;
	modelUrl = null;
	highlightedPartId = null;
	paramOverrides = /* @__PURE__ */ new Map();
	applyOverrides;
	frozenEffects;
	GifSource;
	captionText = null;
	captionInsets = {
		left: 0,
		right: 0,
		bottom: 0
	};
	isCanvasCaptionSuppressed = !1;
	#e = /* @__PURE__ */ M(P({
		loading: $.IDLE,
		loadingStep: "Loading model data",
		error: null,
		caption: null,
		motionProgress: 0,
		showProgressBar: !1,
		isMotionPlaying: !1,
		motionGroups: [],
		currentMotionGroup: null,
		currentMotionIndex: 0,
		scaleMultiplier: 0,
		focusWeight: 3,
		showHitboxDebug: !1,
		loadedVoiceKeys: /* @__PURE__ */ new Set(),
		groupAudioState: {},
		isMoveMode: !1,
		isAlwaysFocus: !1,
		parameters: [],
		parts: [],
		highlightHoveredPart: !0,
		overriddenParams: [],
		isFrozen: !1,
		motionsPaused: !1,
		followParameterValues: !1,
		forceLipSync: !1,
		renderCaptionsOnCanvas: !1,
		useCustomInitialPositioning: !0
	}));
	get state() {
		return Z(this.#e);
	}
	set state(e) {
		N(this.#e, e, !0);
	}
	motionMap = {};
	voiceMap = {};
	normalVoiceMap = {};
	currentCharacterCode = "";
	currentVariant = "";
	assetBaseUrl = "/assets";
	fileToMotionId = {};
	motionMetadata = {};
	motionGroups = [];
	isDragging = !1;
	isForcedDrag = !1;
	dragStart = {
		x: 0,
		y: 0
	};
	modelStart = {
		x: 0,
		y: 0
	};
	baseScale = .1;
	defaultZoom = 1;
	zoomSpring;
	resizeObserver = null;
	gestureManager = null;
	pinchZoomEnabled = !0;
	directZoom = null;
	loadId = 0;
	cubism4Promise;
	hitAreaFrames;
	motionStartTime = 0;
	motionDuration = 0;
	currentAudio = null;
	audioPromiseCache = /* @__PURE__ */ new Map();
	audioProgressInterval = null;
	audioPlayPending = !1;
	initPromise;
	constructor(e) {
		this.canvas = e, this.app = new a(), this.zoomSpring = new bt(0, {
			stiffness: .1,
			damping: .8
		}), window.PIXI = s, this.cubism4Promise = this.initializeCubism4(), window.addEventListener("resize", this.handleResize), this.initPromise = this.initPixi(), this.initPromise.catch(() => {});
	}
	async initPixi() {
		let { Live2DPlugin: e } = await import("./cubism.es-Lk2wTqf4.js");
		n.add(e);
		let { GifSource: t } = await import("./init-CW7iBMOB.js");
		if (this.GifSource = t, !o()) throw Error("WebGL is unavailable, so this model cannot be rendered. Please enable WebGL in your browser and reload.");
		let r = window.devicePixelRatio || 1;
		await this.app.init({
			canvas: this.canvas,
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: r * 2,
			autoDensity: !0,
			antialias: !1,
			backgroundAlpha: 0,
			preference: "webgl"
		}), this.startRendering(), this.captionText = new i({
			text: "",
			style: {
				fontFamily: "Inter, system-ui, sans-serif",
				fontSize: 20,
				fill: 16777215,
				stroke: {
					color: 0,
					width: 4
				},
				align: "center",
				wordWrap: !0,
				wordWrapWidth: window.innerWidth * .8
			}
		}), this.captionText.anchor.set(.5, 1), this.captionText.visible = !1, this.app.stage.addChild(this.captionText), this.updateCaptionLayout();
	}
	async initializeCubism4() {
		try {
			let { configureCubismSDK: e } = await import("./cubism.es-Lk2wTqf4.js");
			e({ memorySizeMB: 128 });
		} catch (e) {
			throw e;
		}
	}
	handleResize = () => {
		if (!this.app.renderer) return;
		let e = window.innerWidth, t = window.innerHeight;
		(e !== this.app.renderer.width || t !== this.app.renderer.height) && (this.app.renderer.resize(e, t), this.updateCaptionLayout());
	};
	handleAutoFit = () => {
		this.app.renderer && this.model && (this.handleResize(), this.fitModelToScreen());
	};
	setAutoFitOnResize(e) {
		!e || this.resizeObserver || typeof ResizeObserver > "u" || (this.resizeObserver = new ResizeObserver(this.handleAutoFit), this.resizeObserver.observe(this.canvas));
	}
	updateCaptionLayout() {
		if (!this.captionText) return;
		let e = Math.max(0, this.app.screen.width - this.captionInsets.left - this.captionInsets.right);
		this.captionText.style.wordWrapWidth = e * .8, this.captionText.position.set(this.captionInsets.left + e / 2, this.app.screen.height - this.captionInsets.bottom - 40);
	}
	setCaptionInsets(e, t, n = 0) {
		this.captionInsets = {
			left: e,
			right: t,
			bottom: n
		}, this.updateCaptionLayout();
	}
	setCanvasCaptionSuppressed(e) {
		this.isCanvasCaptionSuppressed = e;
	}
	startRendering() {
		this.app.ticker.add((e) => {
			if (this.zoomSpring.update(e.deltaTime), this.model) {
				let e = Q ** +(this.directZoom === null ? this.zoomSpring.current : this.directZoom), t = this.baseScale * this.defaultZoom * e;
				this.model.scale.set(t, t);
			}
			if (this.captionText && (this.state.renderCaptionsOnCanvas && !this.isCanvasCaptionSuppressed && this.state.caption ? (this.captionText.text = this.state.caption.replace(/<>/g, " "), this.captionText.visible = !0) : this.captionText.visible = !1), this.state.isMotionPlaying) {
				let e = this.motionDuration, t = Date.now() - this.motionStartTime, n = Math.max(0, Math.min(t / (e * 1e3), 1));
				this.state.motionProgress = n, n >= 1 && (this.state.isMotionPlaying = !1, this.state.motionProgress = 0, this.state.caption = null);
			} else this.state.motionProgress = 0;
		});
	}
	async loadCharacter(e, t = "normal", n, r, i = !0, a = "/assets", o) {
		let s = ++this.loadId;
		this.state.loading === $.READY && (this.state.loading = $.IDLE);
		try {
			if (this.state.loadingStep = "Starting renderer", await this.initPromise, this.loadId !== s || (this.stopAudio(), this.state.loadingStep = "Preparing viewer", await this.cubism4Promise, this.loadId !== s)) return !1;
			this.state.loading = $.LOADING, this.state.error = null, this.state.motionGroups = [], i && this.resetZoom(), this.state.showProgressBar = !1, this.state.isMotionPlaying = !1, this.state.motionProgress = 0, this.state.caption = null, this.state.loadedVoiceKeys = /* @__PURE__ */ new Set(), this.state.groupAudioState = {}, this.motionStartTime = 0, this.motionDuration = 0, this.audioPromiseCache.forEach(async (e) => {
				try {
					let t = await e;
					URL.revokeObjectURL(t);
				} catch {}
			}), this.audioPromiseCache.clear();
			let c = e.directory || e.code;
			this.currentCharacterCode = e.code, this.assetBaseUrl = a;
			let l = `${`${a}/models/${c}/${t}`}/${c}.model3.json`;
			this.state.loadingStep = "Loading textures";
			let { Live2DModel: u } = await import("./cubism.es-Lk2wTqf4.js");
			if (this.loadId !== s) return !1;
			let d;
			try {
				d = await u.from(l, {
					autoHitTest: !1,
					autoFocus: !1,
					lipSyncGain: 1,
					lipSyncWeight: .4
				});
			} catch (e) {
				throw Error(`Failed to load Live2D model: ${e.message}`);
			}
			if (this.loadId !== s) return d.destroy({ children: !0 }), !1;
			this.state.loadingStep = "Loading animations", this.cleanupModel(), this.model = d, this.modelUrl = l, this.currentCharacterCode = e.code, this.currentVariant = t, this.extractDefaultZoom(), this.extractMotionGroupsFromModel();
			let f = this.model;
			if (!f) throw Error("Model not initialized during setup");
			let p = f.internalModel.motionManager, m = [];
			for (let e of this.motionGroups) {
				let t = p.definitions[e];
				if (t) {
					let n = Array.isArray(t) ? t : [t];
					for (let t = 0; t < n.length; t++) m.push(p.loadMotion(e, t).catch((n) => {
						throw Error(`Failed to load motion ${e}[${t}]: ${n.message}`);
					}));
				}
			}
			if (await Promise.all(m), this.loadId !== s) return !1;
			await Promise.all([
				this.extractMotionDurationsFromModel(),
				this.loadMotionData(e, n),
				this.loadVoiceData(String(e.id), r, o)
			]), this.preloadAllVoiceLines(), this.state.loadingStep = "Setting up", this.state.motionGroups = [...this.motionGroups];
			let h = this.motionGroups.length === 0 || this.motionGroups.length === 1 && this.motionGroups[0] === "Idle";
			return this.setForceLipSync(h || this.shouldBorrowNormalVoice()), this.app.stage.addChild(this.model), this.captionText && this.app.stage.addChild(this.captionText), this.fitModelToScreen(), this.setupInteraction(), this.setupGestureManager(), this.state.loadingStep = "", this.state.loading = $.READY, this.refreshParametersState(), this.refreshPartsState(), !0;
		} catch (e) {
			return this.loadId === s && (this.state.error = e.message, this.state.loading = $.ERROR), !1;
		}
	}
	extractDefaultZoom() {
		let e = this.model;
		if (!e) return;
		let t = e.internalModel;
		if (!t || !t.settings) throw Error("Model internal structure not ready for zoom extraction");
		let n = t.settings, r, i = n.json;
		if (i) {
			if (i.FileReferences && i.FileReferences.Layout) {
				let e = i.FileReferences.Layout;
				typeof e.Scale == "number" && (r = e.Scale);
			}
			r === void 0 && i.layout && (typeof i.layout.scale == "number" ? r = i.layout.scale : typeof i.layout.Scale == "number" && (r = i.layout.Scale));
		}
		if (r === void 0 && n.layout && (typeof n.layout.scale == "number" ? r = n.layout.scale : typeof n.layout.Scale == "number" && (r = n.layout.Scale)), typeof r != "number") throw Error("Layout.Scale not found in model metadata (raw JSON check failed)");
		this.defaultZoom = r;
	}
	extractMotionGroupsFromModel() {
		let e = this.model;
		if (!e) return;
		let t = e.internalModel;
		if (!t) throw Error("Model internal structure not ready");
		if (!t.motionManager || !t.motionManager.definitions) throw Error("Motion manager definitions not available");
		this.motionGroups = Object.keys(t.motionManager.definitions);
	}
	async extractMotionDurationsFromModel() {
		let e = this.model;
		if (!e) return;
		let t = e.internalModel;
		if (!t || !t.motionManager) throw Error("Motion manager not available on model");
		let n = t.motionManager;
		if (!n.motionGroups) throw Error("motionGroups not available on motion manager");
		for (let e of this.motionGroups) {
			let t = n.motionGroups[e];
			if (!t) throw Error(`No loaded motions found for group: ${e}`);
			if (t.length === 0) throw Error(`No motions loaded for group ${e}. motionGroups content: ${JSON.stringify(Object.keys(n.motionGroups || {}))}`);
			this.motionMetadata[e] = [];
			for (let n = 0; n < t.length; n++) {
				let r = t[n];
				if (!r) throw Error(`Motion ${e}[${n}] is ${r === null ? "null (failed to load)" : "undefined (not loaded)"}`);
				let i = r;
				if (!i._motionData || i._motionData.duration === void 0) throw Error(`Motion ${e}[${n}] has no _motionData.duration. Keys: ${Object.keys(r || {}).join(", ")}`);
				let a = i._motionData.duration;
				if (a <= 0) throw Error(`Invalid duration for ${e}[${n}]: ${a}`);
				this.motionMetadata[e].push({
					duration: a,
					fps: 30
				});
			}
		}
	}
	async loadMotionData(e, t) {
		if (!t) throw Error("Motion data not provided by server");
		if (Object.keys(t).length === 0) throw Error("Motion data is empty for model " + e.id);
		let n = t;
		this.motionMap = {}, this.fileToMotionId = {};
		for (let e of Object.values(n)) {
			let t = e;
			if (this.motionMap[t.id] = t, t.motion_name) {
				let e = t.motion_name.replace(".mtn", ".motion3.json");
				this.fileToMotionId[e] = t.id;
				let n = (t.motion_name.split("/").pop() || "").replace(".mtn", ".motion3.json");
				this.fileToMotionId[n] = t.id;
			}
		}
	}
	async loadVoiceData(e, t, n) {
		if (!t) throw Error("Voice data not provided by server for model " + e);
		if (typeof t != "object") throw Error("Invalid voice data structure: expected object, got " + typeof t);
		this.voiceMap = t, this.normalVoiceMap = typeof n == "object" && n ? n : {};
	}
	bgTransform = {
		x: 0,
		y: 0,
		scale: 1
	};
	async setBackground(e) {
		if (await this.initPromise, this.bgSprite &&= (this.app.stage.removeChild(this.bgSprite), this.bgSprite.destroy({ children: !0 }), null), this.bgUrl &&= (await r.unload(this.bgUrl).catch(() => {}), null), e) try {
			let t = await r.load(e), { GifSprite: n } = await import("./init-CW7iBMOB.js");
			this.bgSprite = this.GifSource && t instanceof this.GifSource ? new n({ source: t }) : new c(t), this.bgUrl = e, this.bgSprite.anchor.set(.5), this.applyBackgroundTransform(), this.app.stage.addChildAt(this.bgSprite, 0);
		} catch {}
	}
	updateBackground(e, t, n) {
		this.bgTransform = {
			x: e,
			y: t,
			scale: n
		}, this.applyBackgroundTransform();
	}
	applyBackgroundTransform() {
		if (!this.bgSprite) return;
		let e = this.app.screen.width, t = this.app.screen.height, n = e / 2, r = t / 2, { x: i, y: a, scale: o } = this.bgTransform;
		this.bgSprite.position.set(n + i, r + a), this.bgSprite.scale.set(o);
	}
	setupRepeatParameters(e) {
		e.internalModel.coreModel?.setOverrideFlagForModelParameterRepeat?.(!1);
	}
	setupInteraction() {
		let e = this.model;
		e && (e.eventMode = "static", e.automator.autoHitTest = !0, this.state.isAlwaysFocus ? (window.addEventListener("pointermove", this.handleGlobalPointerMove), window.addEventListener("touchmove", this.handleGlobalTouchMove, { passive: !1 })) : e.internalModel?.focusController && e.internalModel.focusController.focus(0, 0, !0), e.on("pointerdown", (e) => {}), e.on("pointerup", this.handleGlobalPointerUp), window.addEventListener("pointerup", this.handleGlobalPointerUp), this.state.isAlwaysFocus ? (window.removeEventListener("pointermove", this.handleGlobalPointerMove), window.addEventListener("pointermove", this.handleGlobalPointerMove), window.addEventListener("touchmove", this.handleGlobalTouchMove, { passive: !1 })) : e.internalModel.focusController.focus(0, 0, !0), e.on("hit", (e) => {
			this.state.showProgressBar || (this.state.showProgressBar = !0, this.state.isMotionPlaying = !0, this.motionStartTime = Date.now(), this.handleTap(e));
		}), this.setupRepeatParameters(e), e.internalModel.on("afterMotionUpdate", () => {
			this.state.showProgressBar && this.motionStartTime && Date.now() - this.motionStartTime >= this.motionDuration * 1e3 + 50 && (this.motionStartTime = 0, setTimeout(() => {
				this.state.showProgressBar = !1, this.state.isMotionPlaying = !1, this.state.motionProgress = 0;
			}, 50));
		}));
	}
	async setupGestureManager() {
		if (!(!this.model || typeof window > "u")) try {
			let t = (await import("./interact.min-9yt2yC36.js").then((t) => /* @__PURE__ */ e(t.default, 1))).default, n = !1, r = this.canvas, i = 0;
			t(r).gesturable({}).on("gesturestart", (e) => {
				if (!this.model || !this.state.isMoveMode || !this.pinchZoomEnabled) {
					e.preventDefault();
					return;
				}
				n = !0, i = this.getCurrentZoom();
			}).on("gesturemove", (e) => {
				if (!this.model || !this.state.isMoveMode || !this.pinchZoomEnabled || !n) return;
				let t = Q ** +i * e.scale, r = Math.log(t) / Math.log(Q), a = this.canvas.getBoundingClientRect();
				this.zoomAtPoint(r, e.clientX - a.left, e.clientY - a.top);
			}).on("gestureend", (e) => {
				n && (n = !1, i = 0, this.directZoom = null);
			}), this.gestureManager = { destroy: () => {} };
		} catch {}
	}
	findGroupsForHitArea(e) {
		let t = this.model;
		if (!t) return [];
		let n = t.internalModel.motionManager.definitions, r = this.currentVariant !== "normal", i = new Set(Object.values(this.motionMap).filter((t) => t.touch_area === e && !!t.is_hurt === r).map((e) => (e.motion_name.split("/").pop() || "").replace(".mtn", ".motion3.json")));
		if (i.size === 0) return [];
		let a = [];
		for (let [e, t] of Object.entries(n)) t.map((e) => e.File.split("/").pop() || "").some((e) => i.has(e)) && a.push(e);
		return a;
	}
	handleTap(e) {
		let t = this.model;
		if (e.length === 0 || !t) {
			this.stopAudioProgress();
			return;
		}
		let n = this.motionGroups.length === 0 || this.motionGroups.length === 1 && this.motionGroups[0] === "Idle", r = e.some((e) => this.findGroupsForHitArea(e).length > 0);
		if ((n || this.shouldBorrowNormalVoice()) && !r) {
			let e = this.getUnmappedVoicelines();
			if (e.length > 0) {
				let t = e[Math.floor(Math.random() * e.length)];
				this.playAudioOnly(t.motionId);
				return;
			}
		}
		let i = {};
		for (let n of e) {
			let e = this.findGroupsForHitArea(n);
			for (let n of e) {
				let e = t.internalModel.motionManager.definitions[n];
				if (!e || e.length === 0) continue;
				let r = e.map((e) => this.findMotionMetadata(e.File)?.probability ?? 1);
				i[n] = r.reduce((e, t) => e + t, 0) / r.length;
			}
		}
		let a = Object.keys(i);
		if (a.length === 0) {
			this.stopAudioProgress();
			return;
		}
		let o = Object.values(i).reduce((e, t) => e + t, 0), s = Math.random() * o, c = a[0];
		for (let e of a) if (s -= i[e], s <= 0) {
			c = e;
			break;
		}
		let l = t.internalModel.motionManager.definitions[c], u = 0, d = l.map((e, t) => {
			let n = e.File;
			return {
				index: t,
				prob: this.findMotionMetadata(n)?.probability ?? 1
			};
		}), f = d.reduce((e, t) => e + t.prob, 0), p = Math.random() * f;
		for (let e of d) if (p -= e.prob, p <= 0) {
			u = e.index;
			break;
		}
		this.state.currentMotionGroup = c, this.state.currentMotionIndex = u, this.motionDuration = this.getMotionDuration(c, u);
		let m, h = l[u];
		if (h && h.File) {
			let e = this.findMotionId(h.File);
			if (e !== void 0 && this.voiceMap[e]?.voice_key) {
				let t = this.voiceMap[e];
				this.state.caption = t.caption, m = this.getAudioUrl(t.char_code, t.voice_key);
			} else this.state.caption = null;
		}
		t.motion(c, u, 2, { loop: !1 }).then(() => {
			let e = this.resolveAudioDelay(h?.File);
			m && (async () => {
				e > 0 && await new Promise((t) => setTimeout(t, e * 1e3));
				try {
					this.currentAudio &&= (this.currentAudio.pause(), null);
					let e = await this.loadAudio(m), t = new Audio(e);
					this.currentAudio = t, t.volume = .5, await t.play(), t.onended = () => {
						this.currentAudio === t && (this.currentAudio = null);
					};
				} catch {}
			})();
		});
	}
	findMotionId(e) {
		if (this.fileToMotionId[e]) return this.fileToMotionId[e];
		let t = e.split("/").pop() || "";
		if (this.fileToMotionId[t]) return this.fileToMotionId[t];
		let n = e.replace(".mtn", ".motion3.json");
		if (this.fileToMotionId[n]) return this.fileToMotionId[n];
	}
	getAudioUrl(e, t) {
		let n = (e || this.currentCharacterCode.split("_")[0]).toUpperCase();
		return `${this.assetBaseUrl}/audio/${n}/${n}_${t}_JP.ogg`;
	}
	async loadAudio(e) {
		if (this.audioPromiseCache.has(e)) return this.audioPromiseCache.get(e);
		let t = (async () => {
			try {
				let t = await fetch(e);
				if (!t.ok) throw Error(`Failed to fetch audio: ${t.statusText}`);
				let n = await t.blob();
				return URL.createObjectURL(n);
			} catch (t) {
				let n = this.getFallbackAudioUrl(e);
				if (n && n !== e) try {
					let e = await fetch(n);
					if (!e.ok) throw Error(`Failed to fetch audio: ${e.statusText}`);
					let t = await e.blob();
					return URL.createObjectURL(t);
				} catch (t) {
					throw this.audioPromiseCache.delete(e), t;
				}
				throw this.audioPromiseCache.delete(e), t;
			}
		})();
		return this.audioPromiseCache.set(e, t), t;
	}
	getFallbackAudioUrl(e) {
		let t = e.match(/_([A-Z0-9_]+)_JP\.ogg$/i);
		if (!t) return e;
		let n = t[1], r = this.currentCharacterCode.split("_")[0].toUpperCase(), i;
		return i = r.toUpperCase().endsWith("MOD") ? r.slice(0, -3) : r + "MOD", `${this.assetBaseUrl}/audio/${i}/${i}_${n}_JP.ogg`;
	}
	async preloadAllVoiceLines() {
		let e = [];
		for (let t of Object.values(this.voiceMap)) if (t.voice_key) {
			let n = this.getAudioUrl(t.char_code, t.voice_key), r = t.voice_key;
			this.loadAudio(n).then(() => {
				this.state.loadedVoiceKeys.add(r), this.updateGroupAudioState(r);
			}).catch(() => {}), e.push(this.loadAudio(n).then(() => {}).catch(() => {}));
		}
		await Promise.allSettled(e);
	}
	updateGroupAudioState(e) {
		let t = this.model;
		if (t) for (let n of this.motionGroups) {
			let r = t.internalModel.motionManager.definitions[n];
			if (r) for (let t = 0; t < r.length; t++) {
				let i = `${n}:${t}`;
				if (this.state.groupAudioState[i]) continue;
				let a = r[t]?.File;
				if (!a) continue;
				let o = this.findMotionId(a);
				o && this.voiceMap[o]?.voice_key === e && (this.state.groupAudioState[i] = !0);
			}
		}
	}
	async playVoice(e) {
		if (this.stopAudio(), e) try {
			let t = this.getAudioUrl("", e), n = await this.loadAudio(t);
			this.currentAudio &&= (this.currentAudio.pause(), null);
			let r = new Audio(n);
			this.currentAudio = r;
			try {
				await r.play();
			} catch {}
			r.onended = () => {
				this.currentAudio === r && (this.currentAudio = null);
			};
		} catch {}
	}
	stopAudio() {
		this.currentAudio &&= (this.currentAudio.pause(), null), this.model?.stopSpeaking();
	}
	async playAudioOnly(e) {
		if (this.audioPlayPending) return;
		this.audioPlayPending = !0, this.state.showProgressBar = !0, this.state.isMotionPlaying = !0;
		let t = this.voiceMap[e] || this.normalVoiceMap[e];
		if (!t || !t.voice_key) {
			this.stopAudioProgress();
			return;
		}
		let n = this.model;
		if (!n) {
			this.stopAudioProgress();
			return;
		}
		try {
			let e = this.getAudioUrl(t.char_code, t.voice_key), r = await this.loadAudio(e);
			if (this.stopAudio(), !await n.speak(r, {
				volume: .5,
				onFinish: () => this.stopAudioProgress(),
				onError: (e) => {
					console.error("[Controller] Audio playback error:", e), this.stopAudioProgress();
				}
			})) {
				this.stopAudioProgress();
				return;
			}
			let i = n.internalModel?.motionManager?.currentAudio?.duration ?? 0;
			this.state.showProgressBar = !0, this.state.isMotionPlaying = !0, this.state.caption = t.caption, this.motionStartTime = Date.now(), this.motionDuration = i, this.audioProgressInterval !== null && clearInterval(this.audioProgressInterval), this.audioProgressInterval = window.setInterval(() => {
				let e = n.internalModel?.motionManager?.currentAudio;
				if (!e || !e.isPlaying) {
					this.stopAudioProgress();
					return;
				}
				let t = Date.now() - this.motionStartTime, r = i > 0 ? Math.min(t / (i * 1e3), 1) : 0;
				this.state.motionProgress = r, r >= 1 && this.stopAudioProgress();
			}, 100);
		} catch (e) {
			console.error("[Controller] Failed to play audio-only:", e), this.stopAudioProgress();
		}
	}
	stopAudioProgress() {
		this.audioPlayPending = !1, this.audioProgressInterval !== null && (clearInterval(this.audioProgressInterval), this.audioProgressInterval = null);
		let e = this.model?.internalModel?.motionManager;
		e && (e.currentAudio = null), this.state.showProgressBar = !1, this.state.isMotionPlaying = !1, this.state.motionProgress = 0, this.state.caption = null, this.motionStartTime = 0, this.motionDuration = 0;
	}
	shouldBorrowNormalVoice() {
		return this.currentVariant !== "normal" && !Object.values(this.voiceMap).some((e) => e && e.voice_key);
	}
	getUnmappedVoicelines() {
		let e = /* @__PURE__ */ new Map();
		for (let [t, n] of Object.entries(this.voiceMap)) {
			let r = Number(t), i = this.motionMap[r];
			n && n.voice_key && (i && i.motion_name && i.motion_name !== "motions/idle.mtn" && i.motion_name !== "motions/daiji.mtn" && i.motion_name !== "motions/daiji_idle_01.mtn" || e.has(n.voice_key) || e.set(n.voice_key, {
				motionId: r,
				voice_key: n.voice_key,
				caption: n.caption || n.voice_key
			}));
		}
		if (e.size === 0 && this.shouldBorrowNormalVoice()) for (let [t, n] of Object.entries(this.normalVoiceMap)) {
			let r = Number(t);
			n && n.voice_key && (e.has(n.voice_key) || e.set(n.voice_key, {
				motionId: r,
				voice_key: n.voice_key,
				caption: n.caption || n.voice_key
			}));
		}
		return Array.from(e.values());
	}
	findMotionMetadata(e) {
		let t = this.fileToMotionId[e] || this.fileToMotionId[e.split("/").pop() || ""];
		if (t) return this.motionMap[t];
	}
	resolveAudioDelay(e) {
		let t = e ? this.findMotionMetadata(e) : void 0;
		return t ? t.delay / 1e3 : 0;
	}
	getMotionGroups() {
		return this.motionGroups;
	}
	getMotionCountForGroup(e) {
		return this.motionMetadata[e]?.length ?? 0;
	}
	getMotionVariants(e) {
		let t = this.getMotionCountForGroup(e), n = this.model?.internalModel.motionManager.definitions?.[e], r = [];
		for (let i = 0; i < t; i++) r.push({
			index: i,
			label: this.getMotionLabel(e, i, n?.[i]?.File)
		});
		return r;
	}
	getMotionLabel(e, t, n) {
		let r = `${e} ${this.getMotionCountForGroup(e) > 1 ? t + 1 : ""}`;
		if (!n) return r;
		let i = this.findMotionMetadata(n);
		if (!i || !i.touch_area || i.touch_area === "0") return r;
		let a = i.touch_area.charAt(0).toUpperCase() + i.touch_area.slice(1), o = Object.values(this.motionMap).filter((e) => e.touch_area === i.touch_area && !!e.is_hurt == !!i.is_hurt).length, s = Object.values(this.motionMap).filter((e) => e.touch_area === i.touch_area && !!e.is_hurt == !!i.is_hurt).findIndex((e) => e.id === i.id);
		return `${a} ${o > 1 ? s + 1 : ""}`;
	}
	getMotionDuration(e, t) {
		let n = this.motionMetadata[e];
		if (!n || !n[t]) throw Error(`[Motion Duration] No metadata found for ${e}[${t}]`);
		let r = n[t].duration;
		if (r <= 0) throw Error(`[Motion Duration] Invalid duration for ${e}[${t}]: ${r}`);
		return r;
	}
	async playMotionWithAudio(e, t) {
		if (!this.model) return;
		let n = this.model.internalModel.motionManager.definitions[e];
		if (!n || !n[t]) return;
		let r = n[t];
		if (!r.File) return;
		let i = this.findMotionId(r.File), a;
		if (i !== void 0 && this.voiceMap[i]?.voice_key) {
			let e = this.voiceMap[i];
			this.state.caption = e.caption, a = this.getAudioUrl(e.char_code, e.voice_key);
		} else this.state.caption = null;
		let o = this.resolveAudioDelay(r.File);
		if (this.model?.internalModel && (this.model.internalModel.lipSync = this.state.forceLipSync), this.state.forceLipSync && a) {
			let n = await this.loadAudio(a);
			o > 0 && await new Promise((e) => setTimeout(e, o * 1e3)), await this.model.motion(e, t, 2, {
				sound: n,
				volume: .5,
				loop: !1
			});
		} else await this.model.motion(e, t, 2, { loop: !1 }), a && (async () => {
			try {
				let e = await this.loadAudio(a);
				o > 0 && await new Promise((e) => setTimeout(e, o * 1e3)), this.currentAudio &&= (this.currentAudio.pause(), null);
				let t = new Audio(e);
				this.currentAudio = t, t.volume = .5, await t.play(), t.onended = () => {
					this.currentAudio === t && (this.currentAudio = null);
				};
			} catch (e) {
				console.error("[Live2D] Error playing audio:", e);
			}
		})();
	}
	async playMotionGroup(e, t) {
		if (!this.model || this.state.showProgressBar) return;
		let n = t ?? 0;
		this.motionDuration = this.getMotionDuration(e, n), this.state.showProgressBar = !0, this.state.isMotionPlaying = !0, this.state.motionsPaused = !1, this.state.currentMotionGroup = e, this.state.currentMotionIndex = n, this.motionStartTime = Date.now(), await this.playMotionWithAudio(e, n);
	}
	setForceLipSync(e) {
		this.state.forceLipSync = e, this.model?.internalModel && (this.model.internalModel.lipSync = e);
	}
	setZoom(e, t) {
		this.state.scaleMultiplier = e, t?.hard ? (this.directZoom = e, this.zoomSpring.set(e, { instant: !0 })) : (this.directZoom = null, this.zoomSpring.set(e));
	}
	zoomAtPoint(e, t, n) {
		if (!this.model) {
			this.setZoom(e, { hard: !0 });
			return;
		}
		let r = Q ** +(e - this.getCurrentZoom());
		this.model.position.set(t + (this.model.position.x - t) * r, n + (this.model.position.y - n) * r), this.setZoom(e, { hard: !0 });
	}
	getCurrentZoom() {
		return this.directZoom ?? this.zoomSpring.current;
	}
	setPinchZoomEnabled(e) {
		this.pinchZoomEnabled = e;
	}
	resetZoom() {
		this.setZoom(0, { hard: !0 });
	}
	startDrag(e, t, n = !1) {
		this.model && (this.dragStart = {
			x: e,
			y: t
		}, this.modelStart = {
			x: this.model.position.x,
			y: this.model.position.y
		}, (n || this.state.isMoveMode) && (this.isDragging = !0, this.isForcedDrag = n));
	}
	handleDrag(e, t) {
		if (this.model) {
			if (this.isDragging && (this.state.isMoveMode || this.isForcedDrag)) {
				let n = e - this.dragStart.x, r = t - this.dragStart.y;
				this.model.position.set(this.modelStart.x + n, this.modelStart.y + r);
			} else this.processMove(e, t);
		}
	}
	endDrag() {
		this.isDragging = !1, this.isForcedDrag = !1;
	}
	async toggleHitboxDebug(e) {
		let t = this.model;
		if (t) {
			if (e && !this.hitAreaFrames) {
				let e = new l(), n = new u();
				e.addChild(n);
				let r = t.internalModel, a = Object.keys(r.hitAreas ?? {}), o = a.map((t) => {
					let n = new i({
						text: t,
						style: {
							fontSize: 24,
							fill: "#ffffff",
							stroke: {
								color: "#000000",
								width: 4
							}
						}
					});
					return e.addChild(n), n;
				}), s = () => {
					let i = new Set(t.hitTest(this.app.renderer.events.pointer.global.x, this.app.renderer.events.pointer.global.y)), s = e.worldTransform, c = 1 / Math.sqrt(s.a ** 2 + s.b ** 2), l = r.localTransform;
					n.clear(), a.forEach((e, t) => {
						let a = r.hitAreas[e], s = o[t];
						s.visible = i.has(e);
						let u = a.index;
						if (u < 0) {
							if (u = r.getDrawableIndex(a.id), u < 0) return;
							a.index = u;
						}
						let d = r.getDrawableBounds(u), f = d.x * l.a + l.tx, p = d.y * l.d + l.ty, m = d.width * l.a, h = d.height * l.d;
						n.setStrokeStyle({
							width: 4 * c,
							color: s.visible ? 2017330 : 14883354
						}).rect(f, p, m, h).stroke(), s.x = f + 4 * c, s.y = p + 4 * c, s.scale.set(c);
					});
				};
				this.app.ticker.add(s), e.__tickerCallback = s, this.hitAreaFrames = e, t.addChild(e);
			} else if (!e && this.hitAreaFrames) {
				let e = this.hitAreaFrames.__tickerCallback;
				e && this.app.ticker.remove(e);
				try {
					t.removeChild(this.hitAreaFrames);
				} catch {}
				this.hitAreaFrames.destroy({ children: !0 }), this.hitAreaFrames = void 0;
			}
		}
	}
	fitModelToScreen(e) {
		let t = this.model;
		if (!t) return;
		t.scale.set(1), t.anchor.set(.5, .5);
		let n = t.internalModel.width || t.width, r = t.internalModel.height || t.height;
		if (!n || !r) {
			this.baseScale = 1;
			return;
		}
		let i = this.canvas.clientWidth * 2, a = this.canvas.clientHeight * 2, o = i / n, s = a / r, c = Math.min(o, s) * .85, l = window.innerWidth / 2, u = window.innerHeight / 2;
		if (e && (l += e.x ?? 0, u += e.y ?? 0), this.state.useCustomInitialPositioning) try {
			let e = this.model.internalModel.coreModel.getModel().canvasinfo, t = e.CanvasOriginX, i = e.CanvasOriginY, a = xt[this.currentCharacterCode]?.[this.currentVariant];
			if (a && typeof a.scale == "number" && (c *= a.scale), a?.origin !== !1 && typeof t == "number" && typeof i == "number") {
				let e = (n / 2 - t) / 2, a = (r / 2 - i) / 2;
				a < 0 && (a = 0), l -= e * c, u -= a * c;
			}
			if (a && typeof a.y == "number") {
				let e = a.y * c;
				u -= e;
			}
		} catch {}
		t.position.set(l, u), this.baseScale = c * .5, this.defaultZoom = 1;
	}
	cleanup() {
		typeof window < "u" && (window.removeEventListener("resize", this.handleResize), window.removeEventListener("pointermove", this.handleGlobalPointerMove), window.removeEventListener("touchmove", this.handleGlobalTouchMove), window.removeEventListener("pointerup", this.handleGlobalPointerUp)), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.gestureManager &&= (this.gestureManager.destroy(), null), this.stopAudio(), this.cleanupModel();
		try {
			this.app.destroy(!1, { children: !0 });
		} catch {}
	}
	getAvailableParameters() {
		try {
			let e = (this.model?.internalModel?.coreModel)?.getModel?.();
			if (!e?.parameters) return [];
			let t = [], n = e.parameters.count;
			for (let r = 0; r < n; r++) {
				let n = e.parameters.values[r] === void 0 || e.parameters.minimumValues[r] === void 0 || e.parameters.maximumValues[r] === void 0;
				t.push({
					index: r,
					name: e.parameters.ids[r] || `Unknown_${r}`,
					value: e.parameters.values[r] ?? 0,
					min: e.parameters.minimumValues[r] ?? 0,
					max: e.parameters.maximumValues[r] ?? 0,
					default: e.parameters.defaultValues[r] ?? 0,
					missing: n
				});
			}
			return t;
		} catch {
			return [];
		}
	}
	logParameterValues() {
		return this.getAvailableParameters();
	}
	originalIdleGroup = null;
	stopAllMotions() {
		let e = this.model;
		if (!e?.internalModel?.motionManager) return;
		let t = e.internalModel.motionManager;
		typeof t.stopAllMotions == "function" && t.stopAllMotions();
	}
	pauseMotions() {
		let e = this.model;
		if (!e?.internalModel?.motionManager) return;
		let t = e.internalModel.motionManager;
		typeof t.stopAllMotions == "function" && t.stopAllMotions(), this.originalIdleGroup = t.groups.idle, t.groups.idle = null, this.state.showProgressBar = !1, this.state.motionProgress = 0, this.motionStartTime = 0, this.state.motionsPaused = !0;
	}
	resumeMotions() {
		let e = this.model;
		if (!e?.internalModel?.motionManager) return;
		let t = e.internalModel.motionManager;
		this.originalIdleGroup && (t.groups.idle = this.originalIdleGroup), this.state.motionsPaused = !1;
	}
	setParameterValue(e, t) {
		let n = this.model;
		if (n?.internalModel?.coreModel) try {
			let r = n.internalModel.coreModel, i = this.state.parameters.find((t) => t.name === e);
			if (!i) return;
			r.setParameterValueByIndex(i.index, t), n.update(0), i.value = t, this.paramOverrides.set(i.index, t), this.state.overriddenParams = [...this.paramOverrides.keys()], this.ensureOverrideHook();
		} catch {}
	}
	ensureOverrideHook() {
		let e = this.model;
		if (!e || this.applyOverrides) return;
		let t = e.internalModel.coreModel;
		this.applyOverrides = () => {
			for (let [e, n] of this.paramOverrides) t.setParameterValueByIndex?.(e, n);
		}, e.internalModel.on("beforeModelUpdate", this.applyOverrides);
	}
	removeOverrideHook() {
		this.applyOverrides &&= (this.model?.internalModel.off("beforeModelUpdate", this.applyOverrides), void 0);
	}
	/**
	* Release one parameter back to animation control
	*/
	releaseParameter(e) {
		this.paramOverrides.delete(e), this.state.overriddenParams = [...this.paramOverrides.keys()], this.paramOverrides.size === 0 && this.removeOverrideHook(), this.refreshParametersState();
	}
	/**
	* Release every pinned parameter
	*/
	releaseAllParameters() {
		this.paramOverrides.clear(), this.state.overriddenParams = [], this.removeOverrideHook(), this.refreshParametersState();
	}
	/**
	* Suspend the per-frame parameter writers while leaving the ticker running so edits still draw
	*/
	setFrozen(e) {
		let t = this.model?.internalModel;
		t && (e ? (this.pauseMotions(), this.frozenEffects = {
			breath: t.breath,
			physics: t.physics,
			pose: t.pose,
			eyeBlink: t.eyeBlink
		}, t.breath = void 0, t.physics = void 0, t.pose = void 0, t.eyeBlink = void 0, t.focusController?.focus(0, 0, !0)) : this.frozenEffects && (t.breath = this.frozenEffects.breath, t.physics = this.frozenEffects.physics, t.pose = this.frozenEffects.pose, t.eyeBlink = this.frozenEffects.eyeBlink, this.frozenEffects = void 0, this.resumeMotions()), this.state.isFrozen = e);
	}
	/**
	* Toggle move/drag mode
	*/
	setMoveMode(e) {
		this.state.isMoveMode = e;
	}
	/**
	* Check if currently dragging (for UI layer)
	*/
	get isCurrentlyDragging() {
		return this.isDragging;
	}
	/**
	* Refresh parameters state from model (used after manual parameter changes)
	*/
	refreshParametersState() {
		if (!this.model) return;
		let e = this.getAvailableParameters();
		this.state.parameters = e.map((e) => ({
			...e,
			value: this.paramOverrides.get(e.index) ?? e.value,
			missing: e.missing ?? !1
		}));
	}
	/**
	* Get available parts with current opacity values and update state
	*/
	refreshPartsState() {
		if (!this.model) return [];
		let e = this.model.internalModel.coreModel?.getModel?.();
		if (!e?.parts) return [];
		let t = [], n = e.parts.ids;
		for (let r = 0; r < n.length; r++) t.push({
			id: n[r],
			index: r,
			opacity: e.parts.opacities[r] ?? 1
		});
		return this.state.parts = t, t;
	}
	/**
	* Set part opacity by ID
	*/
	setPartOpacity(e, t) {
		if (!this.model) return;
		let n = this.model.internalModel.coreModel, r = this.state.parts.find((t) => t.id === e)?.index;
		r !== void 0 && (n.setPartOpacityByIndex?.(r, t), this.refreshPartsState());
	}
	/**
	* Reset all parts to full opacity
	*/
	resetPartOpacities() {
		this.model && this.state.parts.forEach((e) => {
			this.setPartOpacity(e.id, 1);
		});
	}
	/**
	* Tint one part with an additive screen colour so hovering its label reveals it on the model
	*/
	highlightPart(e) {
		if (!this.model || this.highlightedPartId === e) return;
		let t = this.model.internalModel.coreModel;
		if (!t?.setPartScreenColorByRGBA) return;
		let n = (e, n) => {
			let r = this.state.parts.find((t) => t.id === e)?.index;
			if (r === void 0) return;
			t.setOverrideColorForPartScreenColors?.(r, n);
			let i = +!!n;
			t.setPartScreenColorByRGBA(r, i, i, i, 1);
		};
		this.highlightedPartId && n(this.highlightedPartId, !1), e && n(e, !0), this.highlightedPartId = e;
	}
	/**
	* Drop the highlight without touching state the next model load rebuilds
	*/
	clearPartHighlight() {
		this.highlightPart(null);
	}
	/**
	* Enable/disable real-time parameter following
	*/
	setFollowParameters(e) {
		this.state.followParameterValues = e;
	}
	setFocusWeight(e) {
		this.state.focusWeight = e;
	}
	setAlwaysFocus(e) {
		this.state.isAlwaysFocus = e, this.model && (e ? window.addEventListener("pointermove", this.handleGlobalPointerMove) : (window.removeEventListener("pointermove", this.handleGlobalPointerMove), this.model.internalModel.focusController.focus(0, 0)));
	}
	handleGlobalPointerMove = (e) => {
		this.model && this.processMove(e.clientX, e.clientY);
	};
	cleanupModel() {
		if (this.hitAreaFrames) {
			try {
				this.model?.removeChild(this.hitAreaFrames);
			} catch {}
			this.hitAreaFrames = void 0;
		}
		if (this.removeOverrideHook(), this.paramOverrides.clear(), this.state.overriddenParams = [], this.frozenEffects = void 0, this.state.isFrozen = !1, this.state.motionsPaused = !1, this.model) {
			try {
				this.app.stage.removeChild(this.model);
			} catch {}
			try {
				this.model.destroy({ children: !0 });
			} catch {}
			this.model = void 0, this.modelUrl = null;
		}
		this.motionMap = {}, this.voiceMap = {}, this.fileToMotionId = {}, this.currentCharacterCode = "", this.highlightedPartId = null;
	}
	handleGlobalTouchMove = (e) => {
		if (this.model && e.touches.length > 0) {
			let t = e.touches[0];
			this.processMove(t.clientX, t.clientY);
		}
	};
	handleGlobalPointerUp = () => {
		this.model && !this.state.isAlwaysFocus && this.model.internalModel?.focusController && this.model.internalModel.focusController.focus(0, 0);
	};
	handleGlobalTouchEnd = () => {
		this.removeTouchListeners(), this.model && !this.state.isAlwaysFocus && !this.state.isMoveMode && this.model.internalModel.focusController.focus(0, 0);
	};
	removeTouchListeners() {
		typeof window < "u" && (window.removeEventListener("touchmove", this.handleGlobalTouchMove), window.removeEventListener("touchend", this.handleGlobalTouchEnd));
	}
	processMove(e, n) {
		if (!this.model || this.isDragging) return;
		let r = this.canvas.getBoundingClientRect(), i = e - r.left, a = n - r.top, o = new t(i, a), s = new t();
		this.model.toModelPosition(o, s);
		let c = this.model.internalModel, l = c.originalWidth, u = c.originalHeight, d = s.x / l * 2 - 1, f = s.y / u * 2 - 1, p = this.state.focusWeight, m = d * p, h = -f * p, g = Math.sqrt(m * m + h * h);
		g > 1 && (m /= g, h /= g), c.focusController.focus(m, h);
	}
};
//#endregion
export { wt as Live2DController, $ as ModelLoadingState, Ct as ZOOM_MAX, St as ZOOM_MIN };
