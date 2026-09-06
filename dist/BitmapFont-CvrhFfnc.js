import { n as e } from "./rolldown-runtime-B0aSnxlc.js";
import { C as t, D as n, E as r, O as i, P as a, S as o, f as s, g as c, k as l, l as u, t as d, u as f } from "./adapter-DdgmR4Id.js";
import { r as p, t as m } from "./canvasUtils-5xQy9vIG.js";
import { t as h } from "./Cache-NfeSQYWG.js";
import { M as g, a as _, i as v, r as y, t as b } from "./GraphicsContext-CcEzClzH.js";
import { t as x } from "./CanvasPool-D-H2NTfo.js";
//#region node_modules/tiny-lru/dist/tiny-lru.js
/**
* tiny-lru
*
* @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
* @license BSD-3-Clause
* @version 11.4.7
*/
/**
* A high-performance Least Recently Used (LRU) cache implementation with optional TTL support.
* Items are automatically evicted when the cache reaches its maximum size,
* removing the least recently used items first. All core operations (get, set, delete) are O(1).
*
* @class LRU
* @example
* // Create a cache with max 100 items
* const cache = new LRU(100);
* cache.set('key1', 'value1');
* console.log(cache.get('key1')); // 'value1'
*
* @example
* // Create a cache with TTL
* const cache = new LRU(100, 5000); // 5 second TTL
* cache.set('key1', 'value1');
* // After 5 seconds, key1 will be expired
*/
var S = class {
	/**
	* Creates a new LRU cache instance.
	* Note: Constructor does not validate parameters. Use lru() factory function for parameter validation.
	*
	* @constructor
	* @param {number} [max=0] - Maximum number of items to store. 0 means unlimited.
	* @param {number} [ttl=0] - Time to live in milliseconds. 0 means no expiration.
	* @param {boolean} [resetTtl=false] - Whether to reset TTL when accessing existing items via get().
	* @example
	* const cache = new LRU(1000, 60000, true); // 1000 items, 1 minute TTL, reset on access
	* @see {@link lru} For parameter validation
	* @since 1.0.0
	*/
	constructor(e = 0, t = 0, n = !1) {
		this.first = null, this.items = Object.create(null), this.last = null, this.max = e, this.resetTtl = n, this.size = 0, this.ttl = t;
	}
	/**
	* Removes all items from the cache.
	*
	* @method clear
	* @memberof LRU
	* @returns {LRU} The LRU instance for method chaining.
	* @example
	* cache.clear();
	* console.log(cache.size); // 0
	* @since 1.0.0
	*/
	clear() {
		return this.first = null, this.items = Object.create(null), this.last = null, this.size = 0, this;
	}
	/**
	* Removes an item from the cache by key.
	*
	* @method delete
	* @memberof LRU
	* @param {string} key - The key of the item to delete.
	* @returns {LRU} The LRU instance for method chaining.
	* @example
	* cache.set('key1', 'value1');
	* cache.delete('key1');
	* console.log(cache.has('key1')); // false
	* @see {@link LRU#has}
	* @see {@link LRU#clear}
	* @since 1.0.0
	*/
	delete(e) {
		if (this.has(e)) {
			let t = this.items[e];
			delete this.items[e], this.size--, t.prev !== null && (t.prev.next = t.next), t.next !== null && (t.next.prev = t.prev), this.first === t && (this.first = t.next), this.last === t && (this.last = t.prev);
		}
		return this;
	}
	/**
	* Returns an array of [key, value] pairs for the specified keys.
	* Order follows LRU order (least to most recently used).
	*
	* @method entries
	* @memberof LRU
	* @param {string[]} [keys=this.keys()] - Array of keys to get entries for. Defaults to all keys.
	* @returns {Array<Array<*>>} Array of [key, value] pairs in LRU order.
	* @example
	* cache.set('a', 1).set('b', 2);
	* console.log(cache.entries()); // [['a', 1], ['b', 2]]
	* console.log(cache.entries(['a'])); // [['a', 1]]
	* @see {@link LRU#keys}
	* @see {@link LRU#values}
	* @since 11.1.0
	*/
	entries(e = this.keys()) {
		let t = Array(e.length);
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			t[n] = [r, this.get(r)];
		}
		return t;
	}
	/**
	* Removes the least recently used item from the cache.
	*
	* @method evict
	* @memberof LRU
	* @param {boolean} [bypass=false] - Whether to force eviction even when cache is empty.
	* @returns {LRU} The LRU instance for method chaining.
	* @example
	* cache.set('old', 'value').set('new', 'value');
	* cache.evict(); // Removes 'old' item
	* @see {@link LRU#setWithEvicted}
	* @since 1.0.0
	*/
	evict(e = !1) {
		if (e || this.size > 0) {
			let e = this.first;
			delete this.items[e.key], --this.size === 0 ? (this.first = null, this.last = null) : (this.first = e.next, this.first.prev = null);
		}
		return this;
	}
	/**
	* Returns the expiration timestamp for a given key.
	*
	* @method expiresAt
	* @memberof LRU
	* @param {string} key - The key to check expiration for.
	* @returns {number|undefined} The expiration timestamp in milliseconds, or undefined if key doesn't exist.
	* @example
	* const cache = new LRU(100, 5000); // 5 second TTL
	* cache.set('key1', 'value1');
	* console.log(cache.expiresAt('key1')); // timestamp 5 seconds from now
	* @see {@link LRU#get}
	* @see {@link LRU#has}
	* @since 1.0.0
	*/
	expiresAt(e) {
		let t;
		return this.has(e) && (t = this.items[e].expiry), t;
	}
	/**
	* Retrieves a value from the cache by key. Updates the item's position to most recently used.
	*
	* @method get
	* @memberof LRU
	* @param {string} key - The key to retrieve.
	* @returns {*} The value associated with the key, or undefined if not found or expired.
	* @example
	* cache.set('key1', 'value1');
	* console.log(cache.get('key1')); // 'value1'
	* console.log(cache.get('nonexistent')); // undefined
	* @see {@link LRU#set}
	* @see {@link LRU#has}
	* @since 1.0.0
	*/
	get(e) {
		let t = this.items[e];
		if (t !== void 0) {
			if (this.ttl > 0 && t.expiry <= Date.now()) {
				this.delete(e);
				return;
			}
			return this.moveToEnd(t), t.value;
		}
	}
	/**
	* Checks if a key exists in the cache.
	*
	* @method has
	* @memberof LRU
	* @param {string} key - The key to check for.
	* @returns {boolean} True if the key exists, false otherwise.
	* @example
	* cache.set('key1', 'value1');
	* console.log(cache.has('key1')); // true
	* console.log(cache.has('nonexistent')); // false
	* @see {@link LRU#get}
	* @see {@link LRU#delete}
	* @since 9.0.0
	*/
	has(e) {
		return e in this.items;
	}
	/**
	* Efficiently moves an item to the end of the LRU list (most recently used position).
	* This is an internal optimization method that avoids the overhead of the full set() operation
	* when only LRU position needs to be updated.
	*
	* @method moveToEnd
	* @memberof LRU
	* @param {Object} item - The cache item with prev/next pointers to reposition.
	* @private
	* @since 11.3.5
	*/
	moveToEnd(e) {
		this.last !== e && (e.prev !== null && (e.prev.next = e.next), e.next !== null && (e.next.prev = e.prev), this.first === e && (this.first = e.next), e.prev = this.last, e.next = null, this.last !== null && (this.last.next = e), this.last = e, this.first === null && (this.first = e));
	}
	/**
	* Returns an array of all keys in the cache, ordered from least to most recently used.
	*
	* @method keys
	* @memberof LRU
	* @returns {string[]} Array of keys in LRU order.
	* @example
	* cache.set('a', 1).set('b', 2);
	* cache.get('a'); // Move 'a' to most recent
	* console.log(cache.keys()); // ['b', 'a']
	* @see {@link LRU#values}
	* @see {@link LRU#entries}
	* @since 9.0.0
	*/
	keys() {
		let e = Array(this.size), t = this.first, n = 0;
		for (; t !== null;) e[n++] = t.key, t = t.next;
		return e;
	}
	/**
	* Sets a value in the cache and returns any evicted item.
	*
	* @method setWithEvicted
	* @memberof LRU
	* @param {string} key - The key to set.
	* @param {*} value - The value to store.
	* @param {boolean} [resetTtl=this.resetTtl] - Whether to reset the TTL for this operation.
	* @returns {Object|null} The evicted item (if any) with shape {key, value, expiry, prev, next}, or null.
	* @example
	* const cache = new LRU(2);
	* cache.set('a', 1).set('b', 2);
	* const evicted = cache.setWithEvicted('c', 3); // evicted = {key: 'a', value: 1, ...}
	* @see {@link LRU#set}
	* @see {@link LRU#evict}
	* @since 11.3.0
	*/
	setWithEvicted(e, t, n = this.resetTtl) {
		let r = null;
		if (this.has(e)) this.set(e, t, !0, n);
		else {
			this.max > 0 && this.size === this.max && (r = { ...this.first }, this.evict(!0));
			let n = this.items[e] = {
				expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
				key: e,
				prev: this.last,
				next: null,
				value: t
			};
			++this.size === 1 ? this.first = n : this.last.next = n, this.last = n;
		}
		return r;
	}
	/**
	* Sets a value in the cache. Updates the item's position to most recently used.
	*
	* @method set
	* @memberof LRU
	* @param {string} key - The key to set.
	* @param {*} value - The value to store.
	* @param {boolean} [bypass=false] - Internal parameter for setWithEvicted method.
	* @param {boolean} [resetTtl=this.resetTtl] - Whether to reset the TTL for this operation.
	* @returns {LRU} The LRU instance for method chaining.
	* @example
	* cache.set('key1', 'value1')
	*      .set('key2', 'value2')
	*      .set('key3', 'value3');
	* @see {@link LRU#get}
	* @see {@link LRU#setWithEvicted}
	* @since 1.0.0
	*/
	set(e, t, n = !1, r = this.resetTtl) {
		let i = this.items[e];
		return n || i !== void 0 ? (i.value = t, n === !1 && r && (i.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl), this.moveToEnd(i)) : (this.max > 0 && this.size === this.max && this.evict(!0), i = this.items[e] = {
			expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
			key: e,
			prev: this.last,
			next: null,
			value: t
		}, ++this.size === 1 ? this.first = i : this.last.next = i, this.last = i), this;
	}
	/**
	* Returns an array of all values in the cache for the specified keys.
	* Order follows LRU order (least to most recently used).
	*
	* @method values
	* @memberof LRU
	* @param {string[]} [keys=this.keys()] - Array of keys to get values for. Defaults to all keys.
	* @returns {Array<*>} Array of values corresponding to the keys in LRU order.
	* @example
	* cache.set('a', 1).set('b', 2);
	* console.log(cache.values()); // [1, 2]
	* console.log(cache.values(['a'])); // [1]
	* @see {@link LRU#keys}
	* @see {@link LRU#entries}
	* @since 11.1.0
	*/
	values(e = this.keys()) {
		let t = Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = this.get(e[n]);
		return t;
	}
};
/**
* Factory function to create a new LRU cache instance with parameter validation.
*
* @function lru
* @param {number} [max=1000] - Maximum number of items to store. Must be >= 0. Use 0 for unlimited size.
* @param {number} [ttl=0] - Time to live in milliseconds. Must be >= 0. Use 0 for no expiration.
* @param {boolean} [resetTtl=false] - Whether to reset TTL when accessing existing items via get().
* @returns {LRU} A new LRU cache instance.
* @throws {TypeError} When parameters are invalid (negative numbers or wrong types).
* @example
* // Create cache with factory function
* const cache = lru(100, 5000, true);
* cache.set('key', 'value');
*
* @example
* // Error handling
* try {
*   const cache = lru(-1); // Invalid max
* } catch (error) {
*   console.error(error.message); // "Invalid max value"
* }
* @see {@link LRU}
* @since 1.0.0
*/
function C(e = 1e3, t = 0, n = !1) {
	if (isNaN(e) || e < 0) throw TypeError("Invalid max value");
	if (isNaN(t) || t < 0) throw TypeError("Invalid ttl value");
	if (typeof n != "boolean") throw TypeError("Invalid resetTtl value");
	return new S(e, t, n);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/utils/parseTaggedText.mjs
function w(e) {
	return !!e.tagStyles && Object.keys(e.tagStyles).length > 0;
}
function T(e) {
	return e.includes("<");
}
function E(e, t) {
	return e.clone().assign(t);
}
function D(e, t) {
	let n = [], r = t.tagStyles;
	if (!w(t) || !T(e)) return n.push({
		text: e,
		style: t
	}), n;
	let i = [t], a = [], o = "", s = 0;
	for (; s < e.length;) {
		let t = e[s];
		if (t === "<") {
			let c = e.indexOf(">", s);
			if (c === -1) {
				o += t, s++;
				continue;
			}
			let l = e.indexOf("<", s + 1);
			if (l !== -1 && l < c) {
				o += t, s++;
				continue;
			}
			let u = e.slice(s + 1, c);
			if (u.startsWith("/")) {
				let t = u.slice(1).trim();
				if (a.length > 0 && a[a.length - 1] === t) {
					o.length > 0 && (n.push({
						text: o,
						style: i[i.length - 1]
					}), o = ""), i.pop(), a.pop(), s = c + 1;
					continue;
				}
				o += e.slice(s, c + 1), s = c + 1;
				continue;
			}
			{
				let t = u.trim();
				if (r[t]) {
					o.length > 0 && (n.push({
						text: o,
						style: i[i.length - 1]
					}), o = "");
					let e = i[i.length - 1], l = E(e, r[t]);
					i.push(l), a.push(t), s = c + 1;
					continue;
				}
				o += e.slice(s, c + 1), s = c + 1;
				continue;
			}
		}
		o += t, s++;
	}
	return o.length > 0 && n.push({
		text: o,
		style: i[i.length - 1]
	}), n;
}
function ee(e, t) {
	return !w(t) || !T(e) ? e : D(e, t).map((e) => e.text).join("");
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/utils/textTokenization.mjs
var te = [10, 13], ne = new Set(te), re = [
	9,
	32,
	8192,
	8193,
	8194,
	8195,
	8196,
	8197,
	8198,
	8200,
	8201,
	8202,
	8287,
	12288
], ie = new Set(re), ae = [9, 32], O = new Set(ae), k = [
	45,
	8208,
	8211,
	8212,
	173
], oe = new Set(k), se = /(\r\n|\r|\n)/, ce = /(?:\r\n|\r|\n)/;
function A(e) {
	return typeof e == "string" && ne.has(e.charCodeAt(0));
}
function j(e, t) {
	return typeof e == "string" && ie.has(e.charCodeAt(0));
}
function M(e) {
	return typeof e == "string" && O.has(e.charCodeAt(0));
}
function N(e) {
	return typeof e == "string" && oe.has(e.charCodeAt(0));
}
function P(e) {
	return e === "normal" || e === "pre-line";
}
function F(e) {
	return e === "normal";
}
function I(e) {
	if (typeof e != "string") return "";
	let t = e.length - 1;
	for (; t >= 0 && j(e[t]);) t--;
	return t < e.length - 1 ? e.slice(0, t + 1) : e;
}
function L(e) {
	let t = [], n = [];
	if (typeof e != "string") return t;
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = e[r + 1];
		if (j(i, a) || A(i)) {
			n.length > 0 && (t.push(n.join("")), n.length = 0), i === "\r" && a === "\n" ? (t.push("\r\n"), r++) : t.push(i);
			continue;
		}
		n.push(i), N(i) && a && !j(a) && !A(a) && (t.push(n.join("")), n.length = 0);
	}
	return n.length > 0 && t.push(n.join("")), t;
}
function R(e, t, n, r) {
	let i = n(e), a = [];
	for (let n = 0; n < i.length; n++) {
		let o = i[n], s = o, c = 1;
		for (; i[n + c];) {
			let a = i[n + c];
			if (!r(s, a, e, n, t)) o += a, s = a, c++;
			else break;
		}
		n += c - 1, a.push(o);
	}
	return a;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/utils/measureTaggedText.mjs
var le = /\r\n|\r|\n/g;
function z(e, t, n, r, i, a, o, s, c) {
	let l = D(e, t);
	if (F(t.whiteSpace)) for (let e = 0; e < l.length; e++) {
		let t = l[e];
		l[e] = {
			text: t.text.replace(le, " "),
			style: t.style
		};
	}
	let u = [], d = [];
	for (let e of l) {
		let t = e.text.split(se);
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			r === "\r\n" || r === "\r" || r === "\n" ? (u.push(d), d = []) : r.length > 0 && d.push({
				text: r,
				style: e.style
			});
		}
	}
	(d.length > 0 || u.length === 0) && u.push(d);
	let f = n ? B(u, t, r, a, s, c) : u, p = [], m = [], h = [], g = [], _ = [], v = 0, y = t._fontString, b = o(y);
	b.fontSize === 0 && (b.fontSize = t.fontSize, b.ascent = t.fontSize);
	let x = "", S = !!t.dropShadow, C = t._stroke?.width || 0;
	for (let e of f) {
		let n = 0, a = b.ascent, s = b.descent, c = "";
		for (let t of e) {
			let e = t.style._fontString, l = o(e);
			e !== x && (r.font = e, x = e);
			let u = i(t.text, t.style.letterSpacing, r);
			n += u, a = Math.max(a, l.ascent), s = Math.max(s, l.descent), c += t.text;
			let d = t.style._stroke?.width || 0;
			d > C && (C = d), !S && t.style.dropShadow && (S = !0);
		}
		e.length === 0 && (a = b.ascent, s = b.descent), p.push(n), m.push(a), h.push(s), _.push(c);
		let l = t.lineHeight || a + s;
		g.push(l + t.leading), v = Math.max(v, n);
	}
	let w = C, T = v + w + (t.dropShadow ? t.dropShadow.distance : 0), E = 0;
	for (let e = 0; e < g.length; e++) E += g[e];
	return E = Math.max(E, g[0] + w), {
		width: T,
		height: E + (t.dropShadow ? t.dropShadow.distance : 0),
		lines: _,
		lineWidths: p,
		lineHeight: (t.lineHeight || b.fontSize) + t.leading,
		maxLineWidth: v,
		fontProperties: b,
		runsByLine: f,
		lineAscents: m,
		lineDescents: h,
		lineHeights: g,
		hasDropShadow: S
	};
}
function B(e, t, n, r, i, a) {
	let { letterSpacing: o, whiteSpace: s, wordWrapWidth: c, breakWords: l } = t, u = P(s), d = c + o, f = {}, p = "", m = (e, t) => {
		let i = `${e}|${t.styleKey}`, a = f[i];
		if (a === void 0) {
			let o = t._fontString;
			o !== p && (n.font = o, p = o), a = r(e, t.letterSpacing, n) + t.letterSpacing, f[i] = a;
		}
		return a;
	}, h = [];
	for (let t of e) {
		let e = V(t), n = h.length, r = (t) => {
			let n = 0, r = t;
			do {
				let { token: t, style: i } = e[r];
				n += m(t, i), r++;
			} while (r < e.length && e[r].continuesFromPrevious);
			return n;
		}, o = (t) => {
			let n = [], r = t;
			do
				n.push({
					token: e[r].token,
					style: e[r].style
				}), r++;
			while (r < e.length && e[r].continuesFromPrevious);
			return n;
		}, s = [], c = 0, f = !u, p = null, g = () => {
			p && p.text.length > 0 && s.push(p), p = null;
		}, _ = () => {
			if (g(), s.length > 0) {
				let e = s[s.length - 1];
				e.text = I(e.text), e.text.length === 0 && s.pop();
			}
			h.push(s), s = [], c = 0, f = !1;
		};
		for (let t = 0; t < e.length; t++) {
			let { token: n, style: v, continuesFromPrevious: y } = e[t], b = m(n, v);
			if (u) {
				let e = j(n), t = p?.text[p.text.length - 1] ?? s[s.length - 1]?.text.slice(-1) ?? "", r = t ? j(t) : !1;
				if (e && r) continue;
			}
			let x = !y, S = x ? r(t) : b;
			if (S > d && x) {
				if (c > 0 && _(), l) {
					let e = o(t);
					for (let t = 0; t < e.length; t++) {
						let n = e[t].token, r = e[t].style, o = R(n, l, a, i);
						for (let e of o) {
							let t = m(e, r);
							t + c > d && _(), !p || p.style !== r ? (g(), p = {
								text: e,
								style: r
							}) : p.text += e, c += t;
						}
					}
					t += e.length - 1;
				} else {
					let e = o(t);
					g(), h.push(e.map((e) => ({
						text: e.token,
						style: e.style
					}))), f = !1, t += e.length - 1;
				}
			} else if (S + c > d && x) {
				if (j(n)) {
					f = !1;
					continue;
				}
				_(), p = {
					text: n,
					style: v
				}, c = b;
			} else if (y && !l) !p || p.style !== v ? (g(), p = {
				text: n,
				style: v
			}) : p.text += n, c += b;
			else {
				let e = j(n);
				if (c === 0 && e && !f) continue;
				!p || p.style !== v ? (g(), p = {
					text: n,
					style: v
				}) : p.text += n, c += b;
			}
		}
		if (g(), s.length > 0) {
			let e = s[s.length - 1];
			e.text = I(e.text), e.text.length === 0 && s.pop();
		}
		(s.length > 0 || h.length === n) && h.push(s);
	}
	return h;
}
function V(e) {
	let t = [], n = !1;
	for (let r of e) {
		let e = L(r.text), i = !0;
		for (let a of e) {
			let e = j(a) || A(a), o = i && n && !e;
			t.push({
				token: a,
				style: r.style,
				continuesFromPrevious: o
			}), n = !e, i = !1;
		}
	}
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/utils/wordWrap.mjs
var ue = { willReadFrequently: !0 };
function H(e, t, n, r, i) {
	let a = n[e];
	return typeof a != "number" && (a = i(e, t, r) + t, n[e] = a), a;
}
function U(e, t, n, r, i, a, o) {
	let s = n.getContext("2d", ue);
	s.font = t._fontString;
	let c = 0, l = "", u = [], d = /* @__PURE__ */ Object.create(null), { letterSpacing: f, whiteSpace: p } = t, m = P(p), h = F(p), g = !m, _ = t.wordWrapWidth + f, v = L(e);
	for (let e = 0; e < v.length; e++) {
		let n = v[e];
		if (A(n)) {
			if (!h) {
				u.push(I(l)), g = !m, l = "", c = 0;
				continue;
			}
			n = " ";
		}
		if (m) {
			let e = j(n), t = j(l[l.length - 1]);
			if (e && t) continue;
		}
		let p = H(n, f, d, s, r);
		if (p > _) {
			if (l !== "" && (u.push(I(l)), l = "", c = 0), i(n, t.breakWords)) {
				let e = R(n, t.breakWords, o, a);
				for (let t of e) {
					let e = H(t, f, d, s, r);
					e + c > _ && (u.push(I(l)), g = !1, l = "", c = 0), l += t, c += e;
				}
			} else l.length > 0 && (u.push(I(l)), l = "", c = 0), u.push(I(n)), g = !1, l = "", c = 0;
		} else p + c > _ && (g = !1, u.push(I(l)), l = "", c = 0), (l.length > 0 || !j(n) || g) && (l += n, c += p);
	}
	let y = I(l);
	return y.length > 0 && u.push(y), u.join("\n");
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/CanvasTextMetrics.mjs
var de = { willReadFrequently: !0 }, W = class e {
	/**
	* Checking that we can use modern canvas 2D API.
	*
	* Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
	* @see CanvasTextMetrics.experimentalLetterSpacing
	* @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
	* @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
	*/
	static get experimentalLetterSpacingSupported() {
		let t = e._experimentalLetterSpacingSupported;
		if (t === void 0) {
			let n = d.get().getCanvasRenderingContext2D().prototype;
			t = e._experimentalLetterSpacingSupported = "letterSpacing" in n || "textLetterSpacing" in n;
		}
		return t;
	}
	/**
	* @param text - the text that was measured
	* @param style - the style that was measured
	* @param width - the measured width of the text
	* @param height - the measured height of the text
	* @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
	* @param lineWidths - an array of the line widths for each line matched to `lines`
	* @param lineHeight - the measured line height for this style
	* @param maxLineWidth - the maximum line width for all measured lines
	* @param fontProperties - the font properties object from TextMetrics.measureFont
	* @param taggedData - optional object containing tagged text specific data
	* @param taggedData.runsByLine - per-line style runs for tagged text
	* @param taggedData.lineAscents - per-line ascent values for tagged text
	* @param taggedData.lineDescents - per-line descent values for tagged text
	* @param taggedData.lineHeights - per-line height values for tagged text
	* @param taggedData.hasDropShadow - whether any run has a drop shadow
	*/
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.text = e, this.style = t, this.width = n, this.height = r, this.lines = i, this.lineWidths = a, this.lineHeight = o, this.maxLineWidth = s, this.fontProperties = c, l && (this.runsByLine = l.runsByLine, this.lineAscents = l.lineAscents, this.lineDescents = l.lineDescents, this.lineHeights = l.lineHeights, this.hasDropShadow = l.hasDropShadow);
	}
	/**
	* Measures the supplied string of text and returns a Rectangle.
	* @param text - The text to measure.
	* @param style - The text style to use for measuring
	* @param canvas - optional specification of the canvas to use for measuring.
	* @param wordWrap
	* @returns Measured width and height of the text.
	*/
	static measureText(t = " ", n, r = e._canvas, i = n.wordWrap) {
		let a = `${t}-${n.styleKey}-wordWrap-${i}`;
		if (e._measurementCache.has(a)) return e._measurementCache.get(a);
		if (w(n) && T(t)) {
			let r = z(t, n, i, e._context, e._measureText, e._measureTextAdvance, e.measureFont, e.canBreakChars, e.wordWrapSplit), o = new e(t, n, r.width, r.height, r.lines, r.lineWidths, r.lineHeight, r.maxLineWidth, r.fontProperties, {
				runsByLine: r.runsByLine,
				lineAscents: r.lineAscents,
				lineDescents: r.lineDescents,
				lineHeights: r.lineHeights,
				hasDropShadow: r.hasDropShadow
			});
			return e._measurementCache.set(a, o), o;
		}
		let o = n._fontString, s = e.measureFont(o);
		s.fontSize === 0 && (s.fontSize = n.fontSize, s.ascent = n.fontSize, s.descent = 0);
		let c = e._context;
		c.font = o;
		let l = (i ? e._wordWrap(t, n, r) : t).split(ce), u = Array(l.length), d = 0;
		for (let t = 0; t < l.length; t++) {
			let r = e._measureText(l[t], n.letterSpacing, c);
			u[t] = r, d = Math.max(d, r);
		}
		let f = n._stroke?.width ?? 0, p = n.lineHeight || s.fontSize, m = e._adjustWidthForStyle(d, n), h = Math.max(p, s.fontSize + f) + (l.length - 1) * (p + n.leading), g = e._adjustHeightForStyle(h, n), _ = new e(t, n, m, g, l, u, p + n.leading, d, s);
		return e._measurementCache.set(a, _), _;
	}
	/**
	* Adjusts the measured width to account for stroke and drop shadow.
	* @param baseWidth - The base content width
	* @param style - The text style
	* @returns The adjusted width
	*/
	static _adjustWidthForStyle(e, t) {
		let n = e + (t._stroke?.width || 0);
		return t.dropShadow && (n += t.dropShadow.distance), n;
	}
	/**
	* Adjusts the measured height to account for drop shadow.
	* @param baseHeight - The base content height
	* @param style - The text style
	* @returns The adjusted height
	*/
	static _adjustHeightForStyle(e, t) {
		let n = e;
		return t.dropShadow && (n += t.dropShadow.distance), n;
	}
	/**
	* Measures the rendered width of a string, accounting for letter spacing and using the provided context.
	* Returns the larger of the advance width and the bounding box width.
	* @param text - The text to measure
	* @param letterSpacing - Letter spacing in pixels
	* @param context - Canvas 2D context
	* @returns The measured width of the text with spacing
	* @internal
	*/
	static _measureText(t, n, r) {
		let { metricWidth: i, metrics: a, letterSpacingVal: o } = e._measureTextCore(t, n, r), s = -(a.actualBoundingBoxLeft ?? 0), c = (a.actualBoundingBoxRight ?? 0) - s;
		return a.width > 0 && (c += o), Math.max(i, c);
	}
	/**
	* Measures advance width only (no bounding box). Advance widths are additive,
	* making this suitable for word wrap line-fitting where per-token widths must sum correctly.
	* @param text - The text to measure
	* @param letterSpacing - Letter spacing in pixels
	* @param context - Canvas 2D context
	* @returns The advance width of the text
	* @internal
	*/
	static _measureTextAdvance(t, n, r) {
		return e._measureTextCore(t, n, r).metricWidth;
	}
	/**
	* Shared measurement core: sets up letter spacing on the context, calls
	* context.measureText, and adjusts the advance width for letter spacing.
	* @param text
	* @param letterSpacing
	* @param context
	* @internal
	*/
	static _measureTextCore(t, n, r) {
		let i = !1;
		e.experimentalLetterSpacingSupported && (e.experimentalLetterSpacing ? (r.letterSpacing = `${n}px`, r.textLetterSpacing = `${n}px`, i = !0) : (r.letterSpacing = "0px", r.textLetterSpacing = "0px"));
		let a = r.measureText(t), o = a.width, s = 0;
		return o > 0 && (s = i ? -n : (e.graphemeSegmenter(t).length - 1) * n, o += s), {
			metricWidth: o,
			metrics: a,
			letterSpacingVal: s
		};
	}
	/**
	* Applies newlines to a string to have it optimally fit into the horizontal
	* bounds set by the Text object's wordWrapWidth property.
	* @param text - String to apply word wrapping to
	* @param style - the style to use when wrapping
	* @param canvas - optional specification of the canvas to use for measuring.
	* @returns New string with new lines applied where required
	*/
	static _wordWrap(t, n, r = e._canvas) {
		return U(t, n, r, e._measureTextAdvance, e.canBreakWords, e.canBreakChars, e.wordWrapSplit);
	}
	/**
	* Determines if char is a breaking whitespace.
	*
	* It allows one to determine whether char should be a breaking whitespace
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param char - The character
	* @param [_nextChar] - The next character
	* @returns True if whitespace, False otherwise.
	*/
	static isBreakingSpace(e, t) {
		return j(e, t);
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to customise which words should break
	* Examples are if the token is CJK or numbers.
	* It must return a boolean.
	* @param _token - The token
	* @param breakWords - The style attr break words
	* @returns Whether to break word or not
	*/
	static canBreakWords(e, t) {
		return t;
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to determine whether a pair of characters
	* should be broken by newlines
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param _char - The character
	* @param _nextChar - The next character
	* @param _token - The token/word the characters are from
	* @param _index - The index in the token of the char
	* @param _breakWords - The style attr break words
	* @returns whether to break word or not
	*/
	static canBreakChars(e, t, n, r, i) {
		return !0;
	}
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It is called when a token (usually a word) has to be split into separate pieces
	* in order to determine the point to break a word.
	* It must return an array of characters.
	* @param token - The token to split
	* @returns The characters of the token
	* @see CanvasTextMetrics.graphemeSegmenter
	*/
	static wordWrapSplit(t) {
		return e.graphemeSegmenter(t);
	}
	/**
	* Calculates the ascent, descent and fontSize of a given font-style
	* @param font - String representing the style of the font
	* @returns Font properties object
	*/
	static measureFont(t) {
		if (e._fonts[t]) return e._fonts[t];
		let n = e._context;
		n.font = t;
		let r = n.measureText(e.METRICS_STRING + e.BASELINE_SYMBOL), i = r.actualBoundingBoxAscent ?? 0, a = r.actualBoundingBoxDescent ?? 0, o = {
			ascent: i,
			descent: a,
			fontSize: i + a
		};
		return e._fonts[t] = o, o;
	}
	/**
	* Clear font metrics in metrics cache.
	* @param {string} [font] - font name. If font name not set then clear cache for all fonts.
	*/
	static clearMetrics(t = "") {
		t ? delete e._fonts[t] : e._fonts = {};
	}
	/**
	* Cached canvas element for measuring text
	* TODO: this should be private, but isn't because of backward compat, will fix later.
	* @ignore
	*/
	static get _canvas() {
		if (!e.__canvas) {
			let t;
			try {
				let n = new OffscreenCanvas(0, 0);
				if (n.getContext("2d", de)?.measureText) return e.__canvas = n, n;
				t = d.get().createCanvas();
			} catch {
				t = d.get().createCanvas();
			}
			t.width = t.height = 10, e.__canvas = t;
		}
		return e.__canvas;
	}
	/**
	* TODO: this should be private, but isn't because of backward compat, will fix later.
	* @ignore
	*/
	static get _context() {
		return e.__context ||= e._canvas.getContext("2d", de), e.__context;
	}
};
/** Cache for measured text metrics */
W.METRICS_STRING = "|ÉqÅ", W.BASELINE_SYMBOL = "M", W.BASELINE_MULTIPLIER = 1.4, W.HEIGHT_MULTIPLIER = 2, W.graphemeSegmenter = (() => {
	if (typeof Intl?.Segmenter == "function") {
		let e = new Intl.Segmenter();
		return (t) => {
			let n = e.segment(t), r = [], i = 0;
			for (let e of n) r[i++] = e.segment;
			return r;
		};
	}
	return (e) => [...e];
})(), W.experimentalLetterSpacing = !1, W._fonts = {}, W._measurementCache = C(1e3);
var G = W, fe = [
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui"
];
function K(e) {
	let t = typeof e.fontSize == "number" ? `${e.fontSize}px` : e.fontSize, n = e.fontFamily;
	Array.isArray(e.fontFamily) || (n = e.fontFamily.split(","));
	for (let e = n.length - 1; e >= 0; e--) {
		let t = n[e].trim();
		!/([\"\'])[^\'\"]+\1/.test(t) && !fe.includes(t) && (t = `"${t}"`), n[e] = t;
	}
	return `${e.fontStyle} ${e.fontVariant} ${e.fontWeight} ${t} ${n.join(",")}`;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/canvas/utils/getCanvasFillStyle.mjs
var pe = 1e5;
function q(e, t, n, r = 0, i = 0, a = 0) {
	if (e.texture === s.WHITE && !e.fill) return f.shared.setValue(e.color).setAlpha(e.alpha ?? 1).toHexa();
	if (!e.fill) {
		let n = t.createPattern(e.texture.source.resource, "repeat"), r = e.matrix.copyTo(l.shared);
		return r.scale(e.texture.source.pixelWidth, e.texture.source.pixelHeight), n.setTransform(r), n;
	}
	if (e.fill instanceof _) {
		let n = e.fill, r = t.createPattern(n.texture.source.resource, "repeat");
		return m.applyPatternTransform(r, n.transform, !1), r;
	}
	if (e.fill instanceof g) {
		let o = e.fill, s = o.type === "linear", c = o.textureSpace === "local", l = 1, u = 1;
		c && n && (l = n.width + r, u = n.height + r);
		let d, p = !1;
		if (s) {
			let { start: e, end: n } = o;
			d = t.createLinearGradient(e.x * l + i, e.y * u + a, n.x * l + i, n.y * u + a), p = Math.abs(n.x - e.x) < Math.abs((n.y - e.y) * .1);
		} else {
			let { center: e, innerRadius: n, outerCenter: r, outerRadius: s } = o;
			d = t.createRadialGradient(e.x * l + i, e.y * u + a, n * l, r.x * l + i, r.y * u + a, s * l);
		}
		if (p && c && n) {
			let e = n.lineHeight / u;
			for (let t = 0; t < n.lines.length; t++) {
				let i = (t * n.lineHeight + r / 2) / u;
				o.colorStops.forEach((t) => {
					let n = i + t.offset * e;
					n = Math.max(0, Math.min(1, n)), d.addColorStop(Math.floor(n * pe) / pe, f.shared.setValue(t.color).toHex());
				});
			}
		} else o.colorStops.forEach((e) => {
			d.addColorStop(e.offset, f.shared.setValue(e.color).toHex());
		});
		return d;
	}
	return u("FillStyle not recognised", e), "red";
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text/TextStyle.mjs
var J = class e extends a {
	constructor(t = {}) {
		super(), this.uid = r("textStyle"), this._tick = 0, this._cachedFontString = null, me(t), t instanceof e && (t = t._toObject());
		let n = {
			...e.defaultTextStyle,
			...t
		};
		for (let e in n) {
			let t = e;
			this[t] = n[e];
		}
		this._tagStyles = t.tagStyles ?? void 0, this.update(), this._tick = 0;
	}
	/**
	* Alignment for multiline text, does not affect single line text.
	* @type {'left'|'center'|'right'|'justify'}
	*/
	get align() {
		return this._align;
	}
	set align(e) {
		this._align !== e && (this._align = e, this.update());
	}
	/** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
	get breakWords() {
		return this._breakWords;
	}
	set breakWords(e) {
		this._breakWords !== e && (this._breakWords = e, this.update());
	}
	/** Set a drop shadow for the text. */
	get dropShadow() {
		return this._dropShadow;
	}
	set dropShadow(t) {
		this._dropShadow !== t && (this._dropShadow = typeof t == "object" && t ? this._createProxy({
			...e.defaultDropShadow,
			...t
		}) : t ? this._createProxy({ ...e.defaultDropShadow }) : null, this.update());
	}
	/** The font family, can be a single font name, or a list of names where the first is the preferred font. */
	get fontFamily() {
		return this._fontFamily;
	}
	set fontFamily(e) {
		this._fontFamily !== e && (this._fontFamily = e, this.update());
	}
	/** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
	get fontSize() {
		return this._fontSize;
	}
	set fontSize(e) {
		this._fontSize !== e && (this._fontSize = typeof e == "string" ? parseInt(e, 10) : e, this.update());
	}
	/**
	* The font style.
	* @type {'normal'|'italic'|'oblique'}
	*/
	get fontStyle() {
		return this._fontStyle;
	}
	set fontStyle(e) {
		this._fontStyle !== e && (this._fontStyle = e.toLowerCase(), this.update());
	}
	/**
	* The font variant.
	* @type {'normal'|'small-caps'}
	*/
	get fontVariant() {
		return this._fontVariant;
	}
	set fontVariant(e) {
		this._fontVariant !== e && (this._fontVariant = e, this.update());
	}
	/**
	* The font weight.
	* @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
	*/
	get fontWeight() {
		return this._fontWeight;
	}
	set fontWeight(e) {
		this._fontWeight !== e && (this._fontWeight = e, this.update());
	}
	/** The space between lines. */
	get leading() {
		return this._leading;
	}
	set leading(e) {
		this._leading !== e && (this._leading = e, this.update());
	}
	/** The amount of spacing between letters, default is 0. */
	get letterSpacing() {
		return this._letterSpacing;
	}
	set letterSpacing(e) {
		this._letterSpacing !== e && (this._letterSpacing = e, this.update());
	}
	/** The line height, a number that represents the vertical space that a letter uses. */
	get lineHeight() {
		return this._lineHeight;
	}
	set lineHeight(e) {
		this._lineHeight !== e && (this._lineHeight = e, this.update());
	}
	/**
	* Occasionally some fonts are cropped. Adding some padding will prevent this from happening
	* by adding padding to all sides of the text.
	* > [!NOTE] This will NOT affect the positioning or bounds of the text.
	*/
	get padding() {
		return this._padding;
	}
	set padding(e) {
		this._padding !== e && (this._padding = e, this.update());
	}
	/**
	* An optional filter or array of filters to apply to the text, allowing for advanced visual effects.
	* These filters will be applied to the text as it is created, resulting in faster rendering for static text
	* compared to applying the filter directly to the text object (which would be applied at run time).
	* @default null
	*/
	get filters() {
		return this._filters;
	}
	set filters(e) {
		this._filters !== e && (this._filters = Object.freeze(e), this.update());
	}
	/**
	* Trim transparent borders from the text texture.
	* > [!IMPORTANT] PERFORMANCE WARNING:
	* > This is a costly operation as it requires scanning pixel alpha values.
	* > Avoid using `trim: true` for dynamic text, as it could significantly impact performance.
	*/
	get trim() {
		return this._trim;
	}
	set trim(e) {
		this._trim !== e && (this._trim = e, this.update());
	}
	/**
	* The baseline of the text that is rendered.
	* @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
	*/
	get textBaseline() {
		return this._textBaseline;
	}
	set textBaseline(e) {
		this._textBaseline !== e && (this._textBaseline = e, this.update());
	}
	/**
	* How newlines and spaces should be handled.
	* Default is 'pre' (preserve, preserve).
	*
	*  value       | New lines     |   Spaces
	*  ---         | ---           |   ---
	* 'normal'     | Collapse      |   Collapse
	* 'pre'        | Preserve      |   Preserve
	* 'pre-line'   | Preserve      |   Collapse
	* @type {'normal'|'pre'|'pre-line'}
	*/
	get whiteSpace() {
		return this._whiteSpace;
	}
	set whiteSpace(e) {
		this._whiteSpace !== e && (this._whiteSpace = e, this.update());
	}
	/** Indicates if word wrap should be used. */
	get wordWrap() {
		return this._wordWrap;
	}
	set wordWrap(e) {
		this._wordWrap !== e && (this._wordWrap = e, this.update());
	}
	/** The width at which text will wrap, it needs wordWrap to be set to true. */
	get wordWrapWidth() {
		return this._wordWrapWidth;
	}
	set wordWrapWidth(e) {
		this._wordWrapWidth !== e && (this._wordWrapWidth = e, this.update());
	}
	/**
	* The fill style that will be used to color the text.
	* This can be:
	* - A color string like 'red', '#00FF00', or 'rgba(255,0,0,0.5)'
	* - A hex number like 0xff0000 for red
	* - A FillStyle object with properties like { color: 0xff0000, alpha: 0.5 }
	* - A FillGradient for gradient fills
	* - A FillPattern for pattern/texture fills
	*
	* When using a FillGradient, vertical gradients (angle of 90 degrees) are applied per line of text,
	* while gradients at any other angle are spread across the entire text body as a whole.
	* @example
	* // Vertical gradient applied per line
	* const verticalGradient = new FillGradient(0, 0, 0, 1)
	*     .addColorStop(0, 0xff0000)
	*     .addColorStop(1, 0x0000ff);
	*
	* const text = new Text({
	*     text: 'Line 1\nLine 2',
	*     style: { fill: verticalGradient }
	* });
	*
	* To manage the gradient in a global scope, set the textureSpace property of the FillGradient to 'global'.
	* @type {string|number|FillStyle|FillGradient|FillPattern}
	*/
	get fill() {
		return this._originalFill;
	}
	set fill(e) {
		e !== this._originalFill && (this._originalFill = e, this._isFillStyle(e) && (this._originalFill = this._createProxy({
			...b.defaultFillStyle,
			...e
		}, () => {
			this._fill = y({ ...this._originalFill }, b.defaultFillStyle);
		})), this._fill = y(e === 0 ? "black" : e, b.defaultFillStyle), this.update());
	}
	/** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
	get stroke() {
		return this._originalStroke;
	}
	set stroke(e) {
		e !== this._originalStroke && (this._originalStroke = e, this._isFillStyle(e) && (this._originalStroke = this._createProxy({
			...b.defaultStrokeStyle,
			...e
		}, () => {
			this._stroke = v({ ...this._originalStroke }, b.defaultStrokeStyle);
		})), this._stroke = v(e, b.defaultStrokeStyle), this.update());
	}
	/**
	* Custom styles to apply to specific tags within the text.
	* Allows for rich text formatting using simple tag markup like `<red>text</red>`.
	*
	* Tags are only parsed when this property has entries. If `tagStyles` is undefined,
	* `<` characters in text are treated as literal.
	* @example
	* ```ts
	* const text = new Text({
	*     text: '<red>Red</red>, <blue>Blue</blue>',
	*     style: {
	*         fill: 'white',
	*         tagStyles: {
	*             red: { fill: 'red' },
	*             blue: { fill: 'blue' }
	*         }
	*     }
	* });
	* ```
	*/
	get tagStyles() {
		return this._tagStyles;
	}
	set tagStyles(e) {
		this._tagStyles !== e && (this._tagStyles = e ?? void 0, this.update());
	}
	update() {
		this._tick++, this._cachedFontString = null, this.emit("update", this);
	}
	/** Resets all properties to the default values */
	reset() {
		let t = e.defaultTextStyle;
		for (let e in t) this[e] = t[e];
	}
	/**
	* Assigns partial style options to this TextStyle instance.
	* Uses public setters to ensure proper value transformation.
	* @param values - Partial style options to assign
	* @returns This TextStyle instance for chaining
	*/
	assign(e) {
		for (let t in e) {
			let n = t;
			this[n] = e[t];
		}
		return this;
	}
	/**
	* Returns a unique key for this instance.
	* This key is used for caching.
	* @returns {string} Unique key for the instance
	*/
	get styleKey() {
		return `${this.uid}-${this._tick}`;
	}
	/**
	* Returns the CSS font string for this style, cached for performance.
	* @internal
	* @returns CSS font string
	*/
	get _fontString() {
		return this._cachedFontString === null && (this._cachedFontString = K(this)), this._cachedFontString;
	}
	/**
	* Returns an object with the same values as this TextStyle instance.
	* @returns Object with the same values as this TextStyle instance
	* @example
	* ```ts
	* const style = new TextStyle({
	*     fontSize: 24,
	*     fill: 0xff0000,
	*     stroke: { color: 0x0000ff, width: 2 }
	* });
	* const object = style.toObject();
	* console.log(object);
	* // { fontSize: 24, fill: 0xff0000, stroke: { color: 0x0000ff, width: 2 } }
	* ```
	*/
	_toObject() {
		return {
			align: this.align,
			breakWords: this.breakWords,
			dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
			fill: this._fill ? { ...this._fill } : void 0,
			fontFamily: this.fontFamily,
			fontSize: this.fontSize,
			fontStyle: this.fontStyle,
			fontVariant: this.fontVariant,
			fontWeight: this.fontWeight,
			leading: this.leading,
			letterSpacing: this.letterSpacing,
			lineHeight: this.lineHeight,
			padding: this.padding,
			stroke: this._stroke ? { ...this._stroke } : void 0,
			textBaseline: this.textBaseline,
			trim: this.trim,
			whiteSpace: this.whiteSpace,
			wordWrap: this.wordWrap,
			wordWrapWidth: this.wordWrapWidth,
			filters: this._filters ? [...this._filters] : void 0,
			tagStyles: this._tagStyles ? { ...this._tagStyles } : void 0
		};
	}
	/**
	* Creates a new TextStyle object with the same values as this one.
	* @returns New cloned TextStyle object
	*/
	clone() {
		return new e(this._toObject());
	}
	/**
	* Returns the final padding for the text style, taking into account any filters applied.
	* Used internally for correct measurements
	* @internal
	* @returns {number} The final padding for the text style.
	*/
	_getFinalPadding() {
		let e = 0;
		if (this._filters) for (let t = 0; t < this._filters.length; t++) e += this._filters[t].padding;
		return Math.max(this._padding, e);
	}
	/**
	* Destroys this text style.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @example
	* // Destroy the text style and its textures
	* textStyle.destroy({ texture: true, textureSource: true });
	* textStyle.destroy(true);
	*/
	destroy(e = !1) {
		if (this.removeAllListeners(), typeof e == "boolean" ? e : e?.texture) {
			let t = typeof e == "boolean" ? e : e?.textureSource;
			this._fill?.texture && this._fill.texture.destroy(t), this._originalFill?.texture && this._originalFill.texture.destroy(t), this._stroke?.texture && this._stroke.texture.destroy(t), this._originalStroke?.texture && this._originalStroke.texture.destroy(t);
		}
		this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
	}
	_createProxy(e, t) {
		return new Proxy(e, { set: (e, n, r) => e[n] === r || (e[n] = r, t?.(n, r), this.update(), !0) });
	}
	_isFillStyle(e) {
		return (e ?? null) !== null && !(f.isColorLike(e) || e instanceof g || e instanceof _);
	}
};
/**
* Default text style settings used when creating new text objects.
* These values serve as the base configuration and can be customized globally.
* @example
* ```ts
* // Customize default text style globally
* TextStyle.defaultTextStyle.fontSize = 16;
* TextStyle.defaultTextStyle.fill = 0x333333;
* TextStyle.defaultTextStyle.fontFamily = ['Arial', 'Helvetica', 'sans-serif'];
* ```
*/
J.defaultDropShadow = {
	alpha: 1,
	angle: Math.PI / 6,
	blur: 0,
	color: "black",
	distance: 5
}, J.defaultTextStyle = {
	align: "left",
	breakWords: !1,
	dropShadow: null,
	fill: "black",
	fontFamily: "Arial",
	fontSize: 26,
	fontStyle: "normal",
	fontVariant: "normal",
	fontWeight: "normal",
	leading: 0,
	letterSpacing: 0,
	lineHeight: 0,
	padding: 0,
	stroke: null,
	textBaseline: "alphabetic",
	trim: !1,
	whiteSpace: "pre",
	wordWrap: !1,
	wordWrapWidth: 100
};
var Y = J;
function me(e) {
	let n = e;
	if (typeof n.dropShadow == "boolean" && n.dropShadow) {
		let t = Y.defaultDropShadow;
		e.dropShadow = {
			alpha: n.dropShadowAlpha ?? t.alpha,
			angle: n.dropShadowAngle ?? t.angle,
			blur: n.dropShadowBlur ?? t.blur,
			color: n.dropShadowColor ?? t.color,
			distance: n.dropShadowDistance ?? t.distance
		};
	}
	if (n.strokeThickness !== void 0) {
		o(t, "strokeThickness is now a part of stroke");
		let r = n.stroke, i = {};
		if (f.isColorLike(r)) i.color = r;
		else if (r instanceof g || r instanceof _) i.fill = r;
		else if (Object.hasOwnProperty.call(r, "color") || Object.hasOwnProperty.call(r, "fill")) i = r;
		else throw Error("Invalid stroke value.");
		e.stroke = {
			...i,
			width: n.strokeThickness
		};
	}
	if (Array.isArray(n.fillGradientStops)) {
		if (o(t, "gradient fill is now a fill pattern: `new FillGradient(...)`"), !Array.isArray(n.fill) || n.fill.length === 0) throw Error("Invalid fill value. Expected an array of colors for gradient fill.");
		n.fill.length !== n.fillGradientStops.length && u("The number of fill colors must match the number of fill gradient stops.");
		let r = new g({
			start: {
				x: 0,
				y: 0
			},
			end: {
				x: 0,
				y: 1
			},
			textureSpace: "local"
		}), i = n.fillGradientStops.slice(), a = n.fill.map((e) => f.shared.setValue(e).toNumber());
		i.forEach((e, t) => {
			r.addColorStop(e, a[t]);
		}), e.fill = { fill: r };
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text-bitmap/AbstractBitmapFont.mjs
var X = class extends a {
	constructor() {
		super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = {
			fontSize: 0,
			ascent: 0,
			descent: 0
		}, this.baseLineOffset = 0, this.distanceField = {
			type: "none",
			range: 0
		}, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
	}
	/**
	* The name of the font face.
	* @deprecated since 8.0.0 Use `fontFamily` instead.
	*/
	get font() {
		return o(t, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
	}
	/**
	* The map of base page textures (i.e., sheets of glyphs).
	* @deprecated since 8.0.0 Use `pages` instead.
	*/
	get pageTextures() {
		return o(t, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
	}
	/**
	* The size of the font face in pixels.
	* @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
	*/
	get size() {
		return o(t, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
	}
	/**
	* The kind of distance field for this font or "none".
	* @deprecated since 8.0.0 Use `distanceField.type` instead.
	*/
	get distanceFieldRange() {
		return o(t, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
	}
	/**
	* The range of the distance field in pixels.
	* @deprecated since 8.0.0 Use `distanceField.range` instead.
	*/
	get distanceFieldType() {
		return o(t, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
	}
	destroy(e = !1) {
		this.emit("destroy", this), this.removeAllListeners();
		for (let e in this.chars) this.chars[e].texture?.destroy();
		this.chars = null, e && (this.pages.forEach((e) => e.texture.destroy(!0)), this.pages = null);
	}
}, he = class e extends X {
	/**
	* @param options - The options for the dynamic bitmap font.
	*/
	constructor(t) {
		super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentMaxCharHeight = 0, this._currentPageIndex = -1, this._skipKerning = !1;
		let n = {
			...e.defaultOptions,
			...t
		};
		this._textureSize = n.textureSize, this._mipmap = n.mipmap;
		let r = n.style.clone();
		n.overrideFill && (r._fill.color = 16777215, r._fill.alpha = 1, r._fill.texture = s.WHITE, r._fill.fill = null), this.applyFillAsTint = n.overrideFill;
		let i = r.fontSize;
		r.fontSize = this.baseMeasurementFontSize;
		let a = K(r);
		n.overrideSize ? (r._stroke && (r._stroke.width *= this.baseRenderedFontSize / i), r.dropShadow && (r.dropShadow.blur *= this.baseRenderedFontSize / i, r.dropShadow.distance *= this.baseRenderedFontSize / i)) : r.fontSize = this.baseRenderedFontSize = i, this._style = r, this._skipKerning = n.skipKerning ?? !1, this.resolution = n.resolution ?? 1, this._padding = n.padding ?? 4, n.textureStyle && (this._textureStyle = n.textureStyle instanceof c ? n.textureStyle : new c(n.textureStyle)), this.fontMetrics = G.measureFont(a), this.lineHeight = r.lineHeight || this.fontMetrics.fontSize || r.fontSize;
	}
	ensureCharacters(e) {
		let t = G.graphemeSegmenter(e).filter((e) => !this._currentChars.includes(e)).filter((e, t, n) => n.indexOf(e) === t);
		if (!t.length) return;
		this._currentChars = [...this._currentChars, ...t];
		let r;
		r = this._currentPageIndex === -1 ? this._nextPage() : this.pages[this._currentPageIndex];
		let { canvas: i, context: a } = r.canvasAndContext, o = r.texture.source, c = this._style, l = this._currentX, u = this._currentY, d = this._currentMaxCharHeight, f = this.baseRenderedFontSize / this.baseMeasurementFontSize, p = (c.dropShadow?.distance ?? 0) + (c._stroke?.width ?? 0), m = this._padding + p, h = !1, g = i.width / this.resolution, _ = i.height / this.resolution;
		for (let e = 0; e < t.length; e++) {
			let r = t[e], p = G.measureText(r, c, i, !1);
			p.lineHeight = p.height;
			let v = p.width * f, y = Math.ceil((c.fontStyle === "italic" ? 2 : 1) * v), b = p.height * f, x = y + m * 2, S = b + m * 2;
			if (h = !1, r !== "\n" && r !== "\r" && r !== "	" && r !== " " && (h = !0, d = Math.ceil(Math.max(S, d))), l + x > g && (u += d, d = S, l = 0, u + d > _)) {
				o.update();
				let e = this._nextPage();
				i = e.canvasAndContext.canvas, a = e.canvasAndContext.context, o = e.texture.source, l = 0, u = 0, d = 0;
			}
			let C = a.measureText(r).width / f;
			if (this.chars[r] = {
				id: r.codePointAt(0),
				xOffset: -(m / f),
				yOffset: -(m / f),
				xAdvance: C,
				kerning: {}
			}, h) {
				this._drawGlyph(a, p, l + m, u + m, f, c);
				let e = o.width * f, t = o.height * f, i = new n(l / e * o.width, u / t * o.height, x / e * o.width, S / t * o.height);
				this.chars[r].texture = new s({
					source: o,
					frame: i
				}), l += Math.ceil(x);
			}
		}
		o.update(), this._currentX = l, this._currentY = u, this._currentMaxCharHeight = d, this._skipKerning || this._applyKerning(t, a, f);
	}
	/**
	* @deprecated since 8.0.0
	* The map of base page textures (i.e., sheets of glyphs).
	*/
	get pageTextures() {
		return o(t, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
	}
	_applyKerning(e, t, n) {
		let r = this._measureCache;
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			for (let e = 0; e < this._currentChars.length; e++) {
				let i = this._currentChars[e], o = r[a];
				o ||= r[a] = t.measureText(a).width;
				let s = r[i];
				s ||= r[i] = t.measureText(i).width;
				let c = t.measureText(a + i).width, l = c - (o + s);
				l && this.chars[a] && (this.chars[a].kerning[i] = l / n), c = t.measureText(a + i).width, l = c - (o + s), l && this.chars[i] && (this.chars[i].kerning[a] = l / n);
			}
		}
	}
	_nextPage() {
		this._currentPageIndex++;
		let e = this.resolution, t = x.getOptimalCanvasAndContext(this._textureSize, this._textureSize, e);
		this._setupContext(t.context, this._style, e);
		let n = e * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new s({ source: new p({
			resource: t.canvas,
			resolution: n,
			alphaMode: "premultiply-alpha-on-upload",
			autoGenerateMipmaps: this._mipmap
		}) });
		this._textureStyle && (r.source.style = this._textureStyle);
		let i = {
			canvasAndContext: t,
			texture: r
		};
		return this.pages[this._currentPageIndex] = i, i;
	}
	_setupContext(e, t, n) {
		t.fontSize = this.baseRenderedFontSize, e.scale(n, n), e.font = K(t), t.fontSize = this.baseMeasurementFontSize, e.textBaseline = t.textBaseline;
		let r = t._stroke, i = r?.width ?? 0;
		if (r && (e.lineWidth = i, e.lineJoin = r.join, e.miterLimit = r.miterLimit, e.strokeStyle = q(r, e)), t._fill && (e.fillStyle = q(t._fill, e)), t.dropShadow) {
			let r = t.dropShadow, i = f.shared.setValue(r.color).toArray(), a = r.blur * n, o = r.distance * n;
			e.shadowColor = `rgba(${i[0] * 255},${i[1] * 255},${i[2] * 255},${r.alpha})`, e.shadowBlur = a, e.shadowOffsetX = Math.cos(r.angle) * o, e.shadowOffsetY = Math.sin(r.angle) * o;
		} else e.shadowColor = "black", e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0;
	}
	_drawGlyph(e, t, n, r, i, a) {
		let o = t.text, s = t.fontProperties, c = (a._stroke?.width ?? 0) * i, l = n + c / 2, u = r - c / 2, d = s.descent * i, f = t.lineHeight * i, p = !1;
		a.stroke && c && (p = !0, e.strokeText(o, l, u + f - d));
		let { shadowBlur: m, shadowOffsetX: h, shadowOffsetY: g } = e;
		a._fill && (p && (e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0), e.fillText(o, l, u + f - d)), p && (e.shadowBlur = m, e.shadowOffsetX = h, e.shadowOffsetY = g);
	}
	destroy() {
		super.destroy();
		for (let e = 0; e < this.pages.length; e++) {
			let { canvasAndContext: t, texture: n } = this.pages[e];
			x.returnCanvasAndContext(t), n.destroy(!0);
		}
		this.pages = null;
	}
};
he.defaultOptions = {
	textureSize: 512,
	style: new Y(),
	mipmap: !0
};
var Z = he;
//#endregion
//#region node_modules/pixi.js/lib/scene/text-bitmap/utils/getBitmapTextLayout.mjs
function ge(e, t, n, r) {
	let i = {
		width: 0,
		height: 0,
		offsetY: 0,
		scale: t.fontSize / n.baseMeasurementFontSize,
		lines: [{
			width: 0,
			charPositions: [],
			spaceWidth: 0,
			spacesIndex: [],
			chars: []
		}]
	};
	i.offsetY = n.baseLineOffset;
	let a = i.lines[0], o = null, s = !0, c = {
		spaceWord: !1,
		width: 0,
		start: 0,
		index: 0,
		positions: [],
		chars: []
	}, l = n.baseMeasurementFontSize / t.fontSize, u = t.letterSpacing * l, d = t.wordWrapWidth * l, f = t.lineHeight ? t.lineHeight * l : n.lineHeight, p = t.wordWrap && t.breakWords, m = P(t.whiteSpace), h = F(t.whiteSpace);
	if (m || h) {
		let t = [], n = m;
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (i === "\r" || i === "\n") {
				if (h) i === "\r" && e[r + 1] === "\n" && r++, i = " ";
				else {
					m && (n = !0), t.push(i);
					continue;
				}
			}
			if (j(i)) {
				if (m && M(i)) {
					if (n) continue;
					n = !0, t.push(" ");
				} else n = !1, t.push(i);
			} else n = !1, t.push(i);
		}
		e = t;
	}
	let g = (e) => {
		let t = a.width;
		for (let n = 0; n < c.index; n++) {
			let r = e.positions[n];
			a.chars.push(e.chars[n]), a.charPositions.push(r + t);
		}
		a.width += e.width, (c.index > 0 || !m) && (s = !1), c.width = 0, c.index = 0, c.chars.length = 0;
	}, _ = () => {
		let e = a.chars.length - 1;
		if (r) {
			let t = a.chars[e];
			for (; M(t);) a.width -= n.chars[t].xAdvance, a.spacesIndex.pop(), t = a.chars[--e];
		}
		i.width = Math.max(i.width, a.width), a = {
			width: 0,
			charPositions: [],
			chars: [],
			spaceWidth: 0,
			spacesIndex: []
		}, s = !0, i.lines.push(a), i.height += f;
	}, v = (e) => e - u > d;
	for (let r = 0; r < e.length + 1; r++) {
		let i, l = r === e.length;
		l || (i = e[r]);
		let d = n.chars[i];
		if (/(?:\s)/.test(i) || i === "\r" || i === "\n" || l) {
			if (!s && t.wordWrap && v(a.width + c.width) ? (_(), g(c), !l && d && a.charPositions.push(0)) : (c.start = a.width, g(c), !l && d && a.charPositions.push(0)), i === "\r" || i === "\n") _();
			else if (!l && d) {
				let e = d.xAdvance + (d.kerning?.[o] || 0) + u;
				a.width += e, a.spaceWidth = e, a.spacesIndex.push(a.charPositions.length), a.chars.push(i);
			}
		} else if (d) {
			let e = d.kerning?.[o] || 0, n = d.xAdvance + e + u;
			p && v(c.width + n) && (s || _(), g(c), _()), c.positions[c.index++] = c.width + e, c.chars.push(i), c.width += n, N(i) && (!s && t.wordWrap && v(a.width + c.width) && _(), g(c));
		}
		o = i;
	}
	return _(), t.align === "center" ? _e(i) : t.align === "right" ? ve(i) : t.align === "justify" && ye(i), i;
}
function _e(e) {
	for (let t = 0; t < e.lines.length; t++) {
		let n = e.lines[t], r = e.width / 2 - n.width / 2;
		for (let e = 0; e < n.charPositions.length; e++) n.charPositions[e] += r;
	}
}
function ve(e) {
	for (let t = 0; t < e.lines.length; t++) {
		let n = e.lines[t], r = e.width - n.width;
		for (let e = 0; e < n.charPositions.length; e++) n.charPositions[e] += r;
	}
}
function ye(e) {
	let t = e.width;
	for (let n = 0; n < e.lines.length - 2; n++) {
		let r = e.lines[n], i = 0, a = r.spacesIndex[i++], o = 0, s = r.spacesIndex.length, c = (t - r.width) / s;
		for (let e = 0; e < r.charPositions.length; e++) e === a && (a = r.spacesIndex[i++], o += c), r.charPositions[e] += o;
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text-bitmap/utils/resolveCharacters.mjs
function be(e) {
	if (e === "") return [];
	typeof e == "string" && (e = [e]);
	let t = [];
	for (let n = 0, r = e.length; n < r; n++) {
		let r = e[n];
		if (Array.isArray(r)) {
			if (r.length !== 2) throw Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
			if (r[0].length === 0 || r[1].length === 0) throw Error("[BitmapFont]: Invalid character delimiter.");
			let e = r[0].charCodeAt(0), n = r[1].charCodeAt(0);
			if (n < e) throw Error("[BitmapFont]: Invalid character range.");
			for (let r = e, i = n; r <= i; r++) t.push(String.fromCharCode(r));
		} else t.push(...Array.from(r));
	}
	if (t.length === 0) throw Error("[BitmapFont]: Empty set when resolving characters.");
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/text-bitmap/BitmapFontManager.mjs
var Q = 0, $ = new class {
	constructor() {
		/** Cache for measured text layouts to avoid recalculating them multiple times. */
		this.ALPHA = [
			["a", "z"],
			["A", "Z"],
			" "
		], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [
			["a", "z"],
			["A", "Z"],
			["0", "9"],
			" "
		], this.ASCII = [[" ", "~"]], this.defaultOptions = {
			chars: this.ALPHANUMERIC,
			resolution: 1,
			padding: 4,
			skipKerning: !1,
			textureStyle: null
		}, this.measureCache = C(1e3);
	}
	/**
	* Get a font for the specified text and style.
	* @param text - The text to get the font for
	* @param style - The style to use
	*/
	getFont(e, t) {
		let n = `${t.fontFamily}-bitmap`, r = !0;
		if (h.has(n)) {
			let t = h.get(n);
			return t.ensureCharacters?.(e), t;
		}
		if (t._fill.fill && !t._stroke ? (n += t._fill.fill.styleKey, r = !1) : (t._stroke || t.dropShadow) && (n = `${t.styleKey}-bitmap`, r = !1), n += `-${t.fontStyle}`, n += `-${t.fontVariant}`, n += `-${t.fontWeight}`, !h.has(n)) {
			let e = Object.create(t);
			e._lineHeight = 0;
			let i = new Z({
				style: e,
				overrideFill: r,
				overrideSize: !0,
				...this.defaultOptions
			});
			Q++, Q > 50 && u("BitmapText", `You have dynamically created ${Q} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), i.once("destroy", () => {
				Q--, h.remove(n);
			}), h.set(n, i);
		}
		let i = h.get(n);
		return i.ensureCharacters?.(e), i;
	}
	/**
	* Get the layout of a text for the specified style.
	* @param text - The text to get the layout for
	* @param style - The style to use
	* @param trimEnd - Whether to ignore whitespaces at the end of each line
	*/
	getLayout(e, t, n = !0) {
		let r = this.getFont(e, t), i = `${e}-${t.styleKey}-${n}`;
		if (this.measureCache.has(i)) return this.measureCache.get(i);
		let a = ge(G.graphemeSegmenter(e), t, r, n);
		return this.measureCache.set(i, a), a;
	}
	/**
	* Measure the text using the specified style.
	* @param text - The text to measure
	* @param style - The style to use
	* @param trimEnd - Whether to ignore whitespaces at the end of each line
	*/
	measureText(e, t, n = !0) {
		return this.getLayout(e, t, n);
	}
	install(...e) {
		let n = e[0];
		typeof n == "string" && (n = {
			name: n,
			style: e[1],
			chars: e[2]?.chars,
			resolution: e[2]?.resolution,
			padding: e[2]?.padding,
			skipKerning: e[2]?.skipKerning
		}, o(t, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
		let r = n?.name;
		if (!r) throw Error("[BitmapFontManager] Property `name` is required.");
		n = {
			...this.defaultOptions,
			...n
		};
		let i = n.style, a = i instanceof Y ? i : new Y(i), s = new Z({
			style: a,
			overrideFill: n.dynamicFill ?? this._canUseTintForStyle(a),
			skipKerning: n.skipKerning,
			padding: n.padding,
			resolution: n.resolution,
			overrideSize: !1,
			textureStyle: n.textureStyle
		}), c = be(n.chars);
		return s.ensureCharacters(c.join("")), h.set(`${r}-bitmap`, s), s.once("destroy", () => h.remove(`${r}-bitmap`)), s;
	}
	/**
	* Uninstalls a bitmap font from the cache.
	* @param {string} name - The name of the bitmap font to uninstall.
	*/
	uninstall(e) {
		let t = `${e}-bitmap`, n = h.get(t);
		n && n.destroy();
	}
	/**
	* Determines if a style can use tinting instead of baking colors into the bitmap.
	* Tinting is more efficient as it allows reusing the same bitmap with different colors.
	* @param style - The text style to evaluate
	* @returns true if the style can use tinting, false if colors must be baked in
	* @private
	*/
	_canUseTintForStyle(e) {
		return !e._stroke && (!e.dropShadow || e.dropShadow.color === 0) && !e._fill.fill && e._fill.color === 16777215;
	}
}(), xe = /* @__PURE__ */ e({ BitmapFont: () => Se }), Se = class extends X {
	constructor(e, t) {
		super();
		let { textures: r, data: a } = e;
		Object.keys(a.pages).forEach((e) => {
			let t = a.pages[parseInt(e, 10)], n = r[t.id];
			this.pages.push({ texture: n });
		}), Object.keys(a.chars).forEach((e) => {
			let t = a.chars[e], { frame: o, source: c, rotate: l } = r[t.page], u = i.transformRectCoords(t, o, l, new n()), d = new s({
				frame: u,
				orig: new n(0, 0, t.width, t.height),
				source: c,
				rotate: l
			});
			this.chars[e] = {
				id: e.codePointAt(0),
				xOffset: t.xOffset,
				yOffset: t.yOffset,
				xAdvance: t.xAdvance,
				kerning: t.kerning ?? {},
				texture: d
			};
		}), this.baseRenderedFontSize = a.fontSize, this.baseMeasurementFontSize = a.fontSize, this.fontMetrics = {
			ascent: 0,
			descent: 0,
			fontSize: a.fontSize
		}, this.baseLineOffset = a.baseLineOffset, this.lineHeight = a.lineHeight, this.fontFamily = a.fontFamily, this.distanceField = a.distanceField ?? {
			type: "none",
			range: 0
		}, this.url = t;
	}
	/** Destroys the BitmapFont object. */
	destroy() {
		super.destroy();
		for (let e = 0; e < this.pages.length; e++) {
			let { texture: t } = this.pages[e];
			t.destroy(!0);
		}
		this.pages = null;
	}
	/**
	* Generates and installs a bitmap font with the specified options.
	* The font will be cached and available for use in BitmapText objects.
	* @param options - Setup options for font generation
	* @returns Installed font instance
	* @example
	* ```ts
	* // Install a basic font
	* BitmapFont.install({
	*     name: 'Title',
	*     style: {
	*         fontFamily: 'Arial',
	*         fontSize: 32,
	*         fill: '#ffffff'
	*     }
	* });
	*
	* // Install with advanced options
	* BitmapFont.install({
	*     name: 'Custom',
	*     style: {
	*         fontFamily: 'Arial',
	*         fontSize: 24,
	*         fill: '#00ff00',
	*         stroke: { color: '#000000', width: 2 }
	*     },
	*     chars: [['a', 'z'], ['A', 'Z'], ['0', '9']],
	*     resolution: 2,
	*     padding: 4,
	*     textureStyle: {
	*         scaleMode: 'nearest'
	*     }
	* });
	* ```
	*/
	static install(e) {
		$.install(e);
	}
	/**
	* Uninstalls a bitmap font from the cache.
	* This frees up memory and resources associated with the font.
	* @param name - The name of the bitmap font to uninstall
	* @example
	* ```ts
	* // Remove a font when it's no longer needed
	* BitmapFont.uninstall('MyCustomFont');
	*
	* // Clear multiple fonts
	* ['Title', 'Heading', 'Body'].forEach(BitmapFont.uninstall);
	* ```
	*/
	static uninstall(e) {
		$.uninstall(e);
	}
};
//#endregion
export { j as A, ne as C, P as D, F as E, ee as F, T as I, w as L, A as M, L as N, R as O, I as P, D as R, te as S, se as T, ie as _, ge as a, ae as b, Y as c, G as d, U as f, re as g, B as h, be as i, M as j, N as k, q as l, V as m, xe as n, Z as o, z as p, $ as r, X as s, Se as t, K as u, k as v, ce as w, O as x, oe as y };
