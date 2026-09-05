import { A as e, C as t, D as n, E as r, F as i, I as a, P as o, S as s, _ as c, a as l, d as u, f as d, i as f, k as p, l as m, r as h, t as g, u as _, w as v } from "./adapter-DdgmR4Id.js";
import { r as y } from "./canvasUtils-5xQy9vIG.js";
import { t as b } from "./getTextureBatchBindGroup-Dp2huG94.js";
import { n as x, t as S } from "./GCManagedHash-EG4FSGJE.js";
//#region node_modules/earcut/src/earcut.js
/**
* A vertex in a circular doubly linked list representing a polygon ring.
* `prev`/`next` are always linked (set immediately after {@link createNode}), so they're typed
* non-null; `prevZ`/`nextZ` are the z-order list links and are null at the ends.
*
* @typedef {object} Node
* @property {number} i vertex index in the coordinates array
* @property {number} x vertex x coordinate
* @property {number} y vertex y coordinate
* @property {Node} prev previous vertex node in the polygon ring
* @property {Node} next next vertex node in the polygon ring
* @property {number} z z-order curve value; doubles as the owning block index during eliminateHoles
* @property {Node | null} prevZ previous node in z-order
* @property {Node | null} nextZ next node in z-order
*/
/** @type {Set<Node>} */
var C = /* @__PURE__ */ new Set(), w = !1;
/**
* Triangulate a polygon given as a flat array of vertex coordinates.
*
* @param {ArrayLike<number>} data flat array of vertex coordinates
* @param {ArrayLike<number> | null} [holeIndices] indices (in vertices, not coordinates) where each hole ring starts
* @param {number} [dim=2] number of coordinates per vertex in `data`
* @returns {number[]} triangles as triplets of vertex indices into `data`
* @example earcut([10,0, 0,50, 60,60, 70,10]); // [1,0,3, 3,2,1]
*/
function T(e, t, n = 2) {
	let r = t && t.length, i = r ? t[0] * n : e.length;
	C.size && C.clear();
	let a = E(e, 0, i, n, !0), o = [];
	if (!a || a.next === a.prev) return o;
	let s = 0, c = 0, l = 0;
	if (r && (a = P(e, t, a, n)), e.length > 80 * n) {
		s = e[0], c = e[1];
		let t = s, r = c;
		for (let a = n; a < i; a += n) {
			let n = e[a], i = e[a + 1];
			n < s && (s = n), i < c && (c = i), n > t && (t = n), i > r && (r = i);
		}
		l = Math.max(t - s, r - c), l = l === 0 ? 0 : 32767 / l;
	}
	return O(a, o, s, c, l), o;
}
/** @param {ArrayLike<number>} data @param {number} start @param {number} end @param {number} dim @param {boolean} clockwise @returns {Node | null} */
function E(e, t, n, r, i) {
	/** @type {Node | null} */
	let a = null;
	if (i === Oe(e, t, n, r) > 0) for (let i = t; i < n; i += r) a = Ee(i / r | 0, e[i], e[i + 1], a);
	else for (let i = n - r; i >= t; i -= r) a = Ee(i / r | 0, e[i], e[i + 1], a);
	return a && be(a, a.next) && (U(a), a = a.next), a;
}
/** @param {Node} start @param {Node} [end] @returns {Node} */
function D(e, t = e) {
	let n = t === e, r = e, i;
	do
		i = !1, r !== r.next && (C.size === 0 || !C.has(r)) && (be(r, r.next) || V(r.prev, r, r.next) === 0) ? ((n || r === t) && (t = r.prev), w = !0, U(r), r = r.prev, i = !0) : (n || r !== t) && (r = r.next, i = !n);
	while (i || r !== t);
	return t;
}
/** @param {Node} ear @param {number[]} triangles @param {number} minX @param {number} minY @param {number} invSize */
function O(e, t, n, r, i) {
	i && pe(e, n, r, i);
	let a = e, o = !1;
	for (; e.prev !== e.next;) {
		let s = e.prev, c = e.next;
		if (V(s, e, c) < 0 && (i ? A(e, n, r, i) : k(e))) {
			t.push(s.i, e.i, c.i), U(e), e = c, a = c;
			continue;
		}
		if (e = c, e === a) {
			if (w = !1, e = D(e), w) {
				a = e;
				continue;
			}
			if (!o) {
				e = j(e, t), a = e, o = !0;
				continue;
			}
			M(e, t, n, r, i);
			break;
		}
	}
}
/** @param {Node} ear @returns {boolean} */
function k(e) {
	let t = e.prev, n = e, r = e.next, i = t.x, a = n.x, o = r.x, s = t.y, c = n.y, l = r.y, u = Math.min(i, a, o), d = Math.min(s, c, l), f = Math.max(i, a, o), p = Math.max(s, c, l), m = r.next;
	for (; m !== t;) {
		if (m.x >= u && m.x <= f && m.y >= d && m.y <= p && (i !== m.x || s !== m.y) && ve(i, s, a, c, o, l, m.x, m.y) && V(m.prev, m, m.next) >= 0) return !1;
		m = m.next;
	}
	return !0;
}
/** @param {Node} ear @param {number} minX @param {number} minY @param {number} invSize @returns {boolean} */
function A(e, t, n, r) {
	let i = e.prev, a = e, o = e.next, s = i.x, c = a.x, l = o.x, u = i.y, d = a.y, f = o.y, p = Math.min(s, c, l), m = Math.min(u, d, f), h = Math.max(s, c, l), g = Math.max(u, d, f), _ = ge(p, m, t, n, r), v = ge(h, g, t, n, r), y = e.prevZ;
	for (; y && y.z >= _;) {
		if (y.x >= p && y.x <= h && y.y >= m && y.y <= g && y !== o && (s !== y.x || u !== y.y) && ve(s, u, c, d, l, f, y.x, y.y) && V(y.prev, y, y.next) >= 0) return !1;
		y = y.prevZ;
	}
	let b = e.nextZ;
	for (; b && b.z <= v;) {
		if (b.x >= p && b.x <= h && b.y >= m && b.y <= g && b !== o && (s !== b.x || u !== b.y) && ve(s, u, c, d, l, f, b.x, b.y) && V(b.prev, b, b.next) >= 0) return !1;
		b = b.nextZ;
	}
	return !0;
}
/** @param {Node} start @param {number[]} triangles @returns {Node} */
function j(e, t) {
	let n = e, r = !1;
	do {
		let i = n.prev, a = n.next.next;
		xe(i, n, n.next, a, !1) && H(i, a) && H(a, i) && (t.push(i.i, n.i, a.i), U(n), U(n.next), n = e = a, r = !0), n = n.next;
	} while (n !== e);
	return r ? D(n) : n;
}
/** @param {Node} start @param {number[]} triangles @param {number} minX @param {number} minY @param {number} invSize */
function M(e, t, n, r, i) {
	let a = e;
	do {
		let e = a.next.next;
		for (; e !== a.prev;) {
			if (a.i !== e.i && ye(a, e)) {
				let o = Te(a, e);
				a = D(a, a.next), o = D(o, o.next), O(a, t, n, r, i), O(o, t, n, r, i);
				return;
			}
			e = e.next;
		}
		a = a.next;
	} while (a !== e);
}
var N = !1;
/** @param {ArrayLike<number>} data @param {ArrayLike<number>} holeIndices @param {Node} outerNode @param {number} dim @returns {Node} */
function P(e, t, n, r) {
	let i = [];
	for (let n = 0, a = t.length; n < a; n++) {
		let o = E(e, t[n] * r, n < a - 1 ? t[n + 1] * r : e.length, r, !1);
		o === o.next && C.add(o), i.push(_e(o));
	}
	i.sort(F), ie(e.length / r, t.length), ae(n, n), N = !0;
	for (let e = 0; e < i.length; e++) n = I(i[e], n);
	return N = !1, D(n);
}
/** @param {Node} a @param {Node} b @returns {number} */
function F(e, t) {
	return e.x - t.x || e.y - t.y || (e.next.y - e.y) / (e.next.x - e.x) - (t.next.y - t.y) / (t.next.x - t.x);
}
/** @param {Node} hole @param {Node} outerNode @returns {Node} */
function I(e, t) {
	let n = le(e, t);
	if (!n) return t;
	let r = Te(n, e), i = r.next;
	return ae(n, i.next), D(r, r.next), D(n, n.next);
}
var ee = 16, L = /* @__PURE__ */ new Float64Array(), te = 0, ne = [], re = [];
/** @param {number} maxNodes @param {number} numHoles */
function ie(e, t) {
	let n = Math.ceil((e + 2 * t) / ee) + t + 2;
	L.length < n * 4 && (L = new Float64Array(n * 4)), te = 0;
}
/** @param {Node} head @param {Node} stop */
function ae(e, t) {
	let n = e;
	do {
		let e = te++;
		ne[e] = n;
		let r = Infinity, i = Infinity, a = -Infinity, o = -Infinity, s = 0;
		do {
			let t = n.next;
			n.z = e, n.x < r && (r = n.x), n.x > a && (a = n.x), n.y < i && (i = n.y), n.y > o && (o = n.y), t.x < r && (r = t.x), t.x > a && (a = t.x), t.y < i && (i = t.y), t.y > o && (o = t.y), n = t;
		} while (++s < ee && n !== t);
		re[e] = n;
		let c = e * 4;
		L[c] = r, L[c + 1] = i, L[c + 2] = a, L[c + 3] = o;
	} while (n !== t);
}
/** @param {Node} head @param {Node} tail */
function oe(e, t) {
	let n = e.z * 4;
	t.x < L[n] && (L[n] = t.x), t.y < L[n + 1] && (L[n + 1] = t.y), t.x > L[n + 2] && (L[n + 2] = t.x), t.y > L[n + 3] && (L[n + 3] = t.y);
}
/** @param {number} b @returns {Node} */
function se(e) {
	let t = re[e];
	for (; t.prev.next !== t;) t = t.next;
	return re[e] = t, t;
}
/** @param {number} b @returns {Node} */
function ce(e) {
	let t = ne[e];
	for (; t.prev.next !== t;) t = t.next;
	return ne[e] = t, t;
}
/** @param {Node} hole @param {Node} outerNode @returns {Node | null} */
function le(e, t) {
	let n = t, r = e.x, i = e.y, a = -Infinity, o;
	if (be(e, n)) return n;
	for (let t = 0, s = 0; t < te; t++, s += 4) {
		if (i < L[s + 1] || i > L[s + 3] || L[s] > r || L[s + 2] <= a) continue;
		let c = se(t);
		n = ce(t);
		do {
			if (n.prev.next === n) {
				if (be(e, n.next)) return n.next;
				if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
					let e = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
					if (e <= r && e > a && (a = e, o = n.x < n.next.x ? n : n.next, e === r)) return o;
				}
			}
			n = n.next;
		} while (n !== c);
	}
	if (!o) return null;
	let s = o.x, c = o.y, l = Math.min(i, c), u = Math.max(i, c), d = Infinity;
	for (let t = 0, f = 0; t < te; t++, f += 4) {
		if (L[f + 2] < s || L[f] > r || L[f + 3] < l || L[f + 1] > u) continue;
		let p = se(t);
		n = ce(t);
		do {
			if (n.prev.next === n && r >= n.x && n.x >= s && r !== n.x && ve(i < c ? r : a, i, s, c, i < c ? a : r, i, n.x, n.y)) {
				let t = Math.abs(i - n.y) / (r - n.x);
				(H(n, e) || n.y === i && n.next.y === i && n.next.x > r) && (t < d || t === d && (n.x > o.x || n.x === o.x && ue(o, n))) && (o = n, d = t);
			}
			n = n.next;
		} while (n !== p);
	}
	return o;
}
/** @param {Node} m @param {Node} p @returns {boolean} */
function ue(e, t) {
	return V(e.prev, e, t.prev) < 0 && V(t.next, e, e.next) < 0;
}
/** @type {Node[]} */
var R = [], z = [], B = /* @__PURE__ */ new Uint32Array(), de = /* @__PURE__ */ new Uint32Array(), fe = /* @__PURE__ */ new Uint32Array(256);
/** @param {Node} start @param {number} minX @param {number} minY @param {number} invSize */
function pe(e, t, n, r) {
	let i = e, a = 0;
	do
		i.z = ge(i.x, i.y, t, n, r), R[a++] = i, i = i.next;
	while (i !== e);
	me(a);
	/** @type {Node | null} */
	let o = null;
	for (let e = 0; e < a; e++) {
		let t = R[e];
		t.prevZ = o, o && (o.nextZ = t), o = t;
	}
	/** @type {Node} */ o.nextZ = null;
}
/** @param {number} n */
function me(e) {
	if (e <= 32) {
		for (let t = 1; t < e; t++) {
			let e = R[t], n = e.z, r = t - 1;
			for (; r >= 0 && R[r].z > n;) R[r + 1] = R[r], r--;
			R[r + 1] = e;
		}
		return;
	}
	B.length < e && (B = new Uint32Array(e), de = new Uint32Array(e), z = Array(e));
	for (let t = 0; t < e; t++) B[t] = R[t].z;
	he(e, R, B, z, de, 0), he(e, z, de, R, B, 8), he(e, R, B, z, de, 16), he(e, z, de, R, B, 24);
}
/** @param {number} n @param {Node[]} src @param {Uint32Array} srcZ @param {Node[]} dst @param {Uint32Array} dstZ @param {number} shift */
function he(e, t, n, r, i, a) {
	fe.fill(0);
	for (let t = 0; t < e; t++) fe[n[t] >>> a & 255]++;
	let o = 0;
	for (let e = 0; e < 256; e++) {
		let t = fe[e];
		fe[e] = o, o += t;
	}
	for (let o = 0; o < e; o++) {
		let e = n[o], s = fe[e >>> a & 255]++;
		r[s] = t[o], i[s] = e;
	}
}
/** @param {number} x @param {number} y @param {number} minX @param {number} minY @param {number} invSize @returns {number} */
function ge(e, t, n, r, i) {
	return e = (e - n) * i | 0, t = (t - r) * i | 0, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
}
/** @param {Node} start @returns {Node} */
function _e(e) {
	let t = e, n = e;
	do
		(t.x < n.x || t.x === n.x && t.y < n.y) && (n = t), t = t.next;
	while (t !== e);
	return n;
}
/** @param {number} ax @param {number} ay @param {number} bx @param {number} by @param {number} cx @param {number} cy @param {number} px @param {number} py @returns {boolean} */
function ve(e, t, n, r, i, a, o, s) {
	return (i - o) * (t - s) >= (e - o) * (a - s) && (e - o) * (r - s) >= (n - o) * (t - s) && (n - o) * (a - s) >= (i - o) * (r - s);
}
/** @param {Node} a @param {Node} b @returns {boolean} true when the diagonal is valid */
function ye(e, t) {
	let n = be(e, t) && V(e.prev, e, e.next) > 0 && V(t.prev, t, t.next) > 0;
	return e.next.i !== t.i && (n || H(e, t) && H(t, e) && (V(e.prev, e, t.prev) !== 0 || V(e, t.prev, t) !== 0)) && !Ce(e, t) && (n || we(e, t));
}
/** @param {Node} p @param {Node} q @param {Node} r @returns {number} */
function V(e, t, n) {
	return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
/** @param {Node} p1 @param {Node} p2 @returns {boolean} */
function be(e, t) {
	return e.x === t.x && e.y === t.y;
}
/** @param {Node} p1 @param {Node} q1 @param {Node} p2 @param {Node} q2 @param {boolean} [includeBoundary] @returns {boolean} */
function xe(e, t, n, r, i = !0) {
	let a = V(e, t, n), o = V(e, t, r), s = V(n, r, e), c = V(n, r, t);
	return (a > 0 && o < 0 || a < 0 && o > 0) && (s > 0 && c < 0 || s < 0 && c > 0) ? !0 : i ? !!(a === 0 && Se(e, n, t) || o === 0 && Se(e, r, t) || s === 0 && Se(n, e, r) || c === 0 && Se(n, t, r)) : !1;
}
/** @param {Node} p @param {Node} q @param {Node} r @returns {boolean} */
function Se(e, t, n) {
	return t.x <= Math.max(e.x, n.x) && t.x >= Math.min(e.x, n.x) && t.y <= Math.max(e.y, n.y) && t.y >= Math.min(e.y, n.y);
}
/** @param {Node} a @param {Node} b @returns {boolean} */
function Ce(e, t) {
	let n = Math.min(e.x, t.x), r = Math.max(e.x, t.x), i = Math.min(e.y, t.y), a = Math.max(e.y, t.y), o = e;
	do {
		let s = o.next;
		if (o.x > r && s.x > r || o.x < n && s.x < n || o.y > a && s.y > a || o.y < i && s.y < i) {
			o = s;
			continue;
		}
		if (o.i !== e.i && s.i !== e.i && o.i !== t.i && s.i !== t.i && xe(o, s, e, t)) return !0;
		o = s;
	} while (o !== e);
	return !1;
}
/** @param {Node} a @param {Node} b @returns {boolean} */
function H(e, t) {
	return V(e.prev, e, e.next) < 0 ? V(e, t, e.next) >= 0 && V(e, e.prev, t) >= 0 : V(e, t, e.prev) < 0 || V(e, e.next, t) < 0;
}
/** @param {Node} a @param {Node} b @returns {boolean} */
function we(e, t) {
	let n = e, r = !1, i = (e.x + t.x) / 2, a = (e.y + t.y) / 2;
	do {
		let e = n.next;
		n.y > a != e.y > a && i < (e.x - n.x) * (a - n.y) / (e.y - n.y) + n.x && (r = !r), n = e;
	} while (n !== e);
	return r;
}
/** @param {Node} a @param {Node} b @returns {Node} */
function Te(e, t) {
	let n = De(e.i, e.x, e.y), r = De(t.i, t.x, t.y), i = e.next, a = t.prev;
	return e.next = t, t.prev = e, n.next = i, i.prev = n, r.next = n, n.prev = r, a.next = r, r.prev = a, r;
}
/** @param {number} i @param {number} x @param {number} y @param {Node | null} last @returns {Node} */
function Ee(e, t, n, r) {
	let i = De(e, t, n);
	return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
}
/** @param {Node} p */
function U(e) {
	e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ), N && oe(e.prev, e.next);
}
/** @param {number} i @param {number} x @param {number} y @returns {Node} */
function De(e, t, n) {
	return {
		i: e,
		x: t,
		y: n,
		prev: null,
		next: null,
		z: 0,
		prevZ: null,
		nextZ: null
	};
}
/** @param {ArrayLike<number>} data @param {number} start @param {number} end @param {number} dim @returns {number} */
function Oe(e, t, n, r) {
	let i = 0;
	for (let a = t, o = n - r; a < n; a += r) i += (e[o] - e[a]) * (e[a + 1] + e[o + 1]), o = a;
	return i;
}
//#endregion
//#region node_modules/pixi.js/lib/utils/utils.mjs
var ke = T.default || T, Ae = {
	a: 7,
	c: 6,
	h: 1,
	l: 2,
	m: 2,
	q: 4,
	s: 4,
	t: 2,
	v: 1,
	z: 0
}, je = /([astvzqmhlc])([^astvzqmhlc]*)/gi, Me = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
/**
* Parse an SVG path `d` attribute string into an array of commands.
*
* Each command is a tuple of `[letter, ...args]`. Relative commands use
* lowercase letters; absolute commands use uppercase. An implicit `lineto`
* is inserted after the first coordinate pair of a `moveto` with extra args,
* per the SVG spec.
*
* @param path - The raw SVG path data string (e.g. `"M0,0 L10,10 Z"`).
* @returns Array of parsed commands.
* @throws {Error} if a command has fewer arguments than expected.
*/
function Ne(e) {
	let t = [];
	return e.replace(je, (e, n, r) => {
		let i = n.toLowerCase(), a = n, o = Pe(r);
		for (i === "m" && o.length > 2 && (t.push([a, ...o.splice(0, 2)]), i = "l", a = a === "m" ? "l" : "L");;) {
			if (o.length === Ae[i]) return t.push([a, ...o]), "";
			if (o.length < Ae[i]) throw Error("malformed path data");
			t.push([a, ...o.splice(0, Ae[i])]);
		}
	}), t;
}
/** Extract all numeric tokens from a raw argument string. */
function Pe(e) {
	let t = e.match(Me);
	return t ? t.map(Number) : [];
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGPath.mjs
function Fe(e, t) {
	let n = Ne(e), r = [], i = null, a = 0, o = 0;
	for (let e = 0; e < n.length; e++) {
		let s = n[e], c = s[0], l = s;
		switch (c) {
			case "M":
				a = l[1], o = l[2], t.moveTo(a, o);
				break;
			case "m":
				a += l[1], o += l[2], t.moveTo(a, o);
				break;
			case "H":
				a = l[1], t.lineTo(a, o);
				break;
			case "h":
				a += l[1], t.lineTo(a, o);
				break;
			case "V":
				o = l[1], t.lineTo(a, o);
				break;
			case "v":
				o += l[1], t.lineTo(a, o);
				break;
			case "L":
				a = l[1], o = l[2], t.lineTo(a, o);
				break;
			case "l":
				a += l[1], o += l[2], t.lineTo(a, o);
				break;
			case "C":
				a = l[5], o = l[6], t.bezierCurveTo(l[1], l[2], l[3], l[4], a, o);
				break;
			case "c":
				t.bezierCurveTo(a + l[1], o + l[2], a + l[3], o + l[4], a + l[5], o + l[6]), a += l[5], o += l[6];
				break;
			case "S":
				a = l[3], o = l[4], t.bezierCurveToShort(l[1], l[2], a, o);
				break;
			case "s":
				t.bezierCurveToShort(a + l[1], o + l[2], a + l[3], o + l[4]), a += l[3], o += l[4];
				break;
			case "Q":
				a = l[3], o = l[4], t.quadraticCurveTo(l[1], l[2], a, o);
				break;
			case "q":
				t.quadraticCurveTo(a + l[1], o + l[2], a + l[3], o + l[4]), a += l[3], o += l[4];
				break;
			case "T":
				a = l[1], o = l[2], t.quadraticCurveToShort(a, o);
				break;
			case "t":
				a += l[1], o += l[2], t.quadraticCurveToShort(a, o);
				break;
			case "A":
				a = l[6], o = l[7], t.arcToSvg(l[1], l[2], l[3], l[4], l[5], a, o);
				break;
			case "a":
				a += l[6], o += l[7], t.arcToSvg(l[1], l[2], l[3], l[4], l[5], a, o);
				break;
			case "Z":
			case "z":
				t.closePath(), r.length > 0 && (i = r.pop(), i ? (a = i.startX, o = i.startY) : (a = 0, o = 0)), i = null;
				break;
			default: m(`Unknown SVG path command: ${c}`);
		}
		c !== "Z" && c !== "z" && i === null && (i = {
			startX: a,
			startY: o
		}, r.push(i));
	}
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/maths/shapes/Circle.mjs
var Ie = class e {
	/**
	* @param x - The X coordinate of the center of this circle
	* @param y - The Y coordinate of the center of this circle
	* @param radius - The radius of the circle
	*/
	constructor(e = 0, t = 0, n = 0) {
		this.type = "circle", this.x = e, this.y = t, this.radius = n;
	}
	/**
	* Creates a clone of this Circle instance.
	* @example
	* ```ts
	* // Basic circle cloning
	* const original = new Circle(100, 100, 50);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.radius = 75;
	*
	* // Verify independence
	* console.log(original.radius); // 50
	* console.log(modified.radius); // 75
	* ```
	* @returns A copy of the Circle
	* @see {@link Circle.copyFrom} For copying into existing circle
	* @see {@link Circle.copyTo} For copying to another circle
	*/
	clone() {
		return new e(this.x, this.y, this.radius);
	}
	/**
	* Checks whether the x and y coordinates given are contained within this circle.
	*
	* Uses the distance formula to determine if a point is inside the circle's radius.
	*
	* Commonly used for hit testing in PixiJS events and graphics.
	* @example
	* ```ts
	* // Basic containment check
	* const circle = new Circle(100, 100, 50);
	* const isInside = circle.contains(120, 120);
	*
	* // Check mouse position
	* const circle = new Circle(0, 0, 100);
	* container.hitArea = circle;
	* container.on('pointermove', (e) => {
	*     // only called if pointer is within circle
	* });
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this Circle
	* @see {@link Circle.strokeContains} For checking stroke intersection
	* @see {@link Circle.getBounds} For getting bounding box
	*/
	contains(e, t) {
		if (this.radius <= 0) return !1;
		let n = this.radius * this.radius, r = this.x - e, i = this.y - t;
		return r *= r, i *= i, r + i <= n;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this circle including the stroke.
	* @example
	* ```ts
	* // Basic stroke check
	* const circle = new Circle(100, 100, 50);
	* const isOnStroke = circle.strokeContains(150, 100, 4); // 4px line width
	*
	* // Check with different alignments
	* const innerStroke = circle.strokeContains(150, 100, 4, 1);   // Inside
	* const centerStroke = circle.strokeContains(150, 100, 4, 0.5); // Centered
	* const outerStroke = circle.strokeContains(150, 100, 4, 0);   // Outside
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @param width - The width of the line to check
	* @param alignment - The alignment of the stroke, 0.5 by default
	* @returns Whether the x/y coordinates are within this Circle's stroke
	* @see {@link Circle.contains} For checking fill containment
	* @see {@link Circle.getBounds} For getting stroke bounds
	*/
	strokeContains(e, t, n, r = .5) {
		if (this.radius === 0) return !1;
		let i = this.x - e, a = this.y - t, o = this.radius, s = (1 - r) * n, c = Math.sqrt(i * i + a * a);
		return c <= o + s && c > o - (n - s);
	}
	/**
	* Returns the framing rectangle of the circle as a Rectangle object.
	* @example
	* ```ts
	* // Basic bounds calculation
	* const circle = new Circle(100, 100, 50);
	* const bounds = circle.getBounds();
	* // bounds: x=50, y=50, width=100, height=100
	*
	* // Reuse existing rectangle
	* const rect = new Rectangle();
	* circle.getBounds(rect);
	* ```
	* @param out - Optional Rectangle object to store the result
	* @returns The framing rectangle
	* @see {@link Rectangle} For rectangle properties
	* @see {@link Circle.contains} For point containment
	*/
	getBounds(e) {
		return e ||= new n(), e.x = this.x - this.radius, e.y = this.y - this.radius, e.width = this.radius * 2, e.height = this.radius * 2, e;
	}
	/**
	* Copies another circle to this one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Circle(100, 100, 50);
	* const target = new Circle();
	* target.copyFrom(source);
	* ```
	* @param circle - The circle to copy from
	* @returns Returns itself
	* @see {@link Circle.copyTo} For copying to another circle
	* @see {@link Circle.clone} For creating new circle copy
	*/
	copyFrom(e) {
		return this.x = e.x, this.y = e.y, this.radius = e.radius, this;
	}
	/**
	* Copies this circle to another one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Circle(100, 100, 50);
	* const target = new Circle();
	* source.copyTo(target);
	* ```
	* @param circle - The circle to copy to
	* @returns Returns given parameter
	* @see {@link Circle.copyFrom} For copying from another circle
	* @see {@link Circle.clone} For creating new circle copy
	*/
	copyTo(e) {
		return e.copyFrom(this), e;
	}
	toString() {
		return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
	}
}, Le = class e {
	/**
	* @param x - The X coordinate of the center of this ellipse
	* @param y - The Y coordinate of the center of this ellipse
	* @param halfWidth - The half width of this ellipse
	* @param halfHeight - The half height of this ellipse
	*/
	constructor(e = 0, t = 0, n = 0, r = 0) {
		this.type = "ellipse", this.x = e, this.y = t, this.halfWidth = n, this.halfHeight = r;
	}
	/**
	* Creates a clone of this Ellipse instance.
	* @example
	* ```ts
	* // Basic cloning
	* const original = new Ellipse(100, 100, 50, 25);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.halfWidth *= 2;
	* modified.halfHeight *= 2;
	*
	* // Verify independence
	* console.log(original.halfWidth);  // 50
	* console.log(modified.halfWidth);  // 100
	* ```
	* @returns A copy of the ellipse
	* @see {@link Ellipse.copyFrom} For copying into existing ellipse
	* @see {@link Ellipse.copyTo} For copying to another ellipse
	*/
	clone() {
		return new e(this.x, this.y, this.halfWidth, this.halfHeight);
	}
	/**
	* Checks whether the x and y coordinates given are contained within this ellipse.
	* Uses normalized coordinates and the ellipse equation to determine containment.
	* @example
	* ```ts
	* // Basic containment check
	* const ellipse = new Ellipse(100, 100, 50, 25);
	* const isInside = ellipse.contains(120, 110);
	* ```
	* @remarks
	* - Uses ellipse equation (x²/a² + y²/b² ≤ 1)
	* - Returns false if dimensions are 0 or negative
	* - Normalized to center (0,0) for calculation
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coords are within this ellipse
	* @see {@link Ellipse.strokeContains} For checking stroke intersection
	* @see {@link Ellipse.getBounds} For getting containing rectangle
	*/
	contains(e, t) {
		if (this.halfWidth <= 0 || this.halfHeight <= 0) return !1;
		let n = (e - this.x) / this.halfWidth, r = (t - this.y) / this.halfHeight;
		return n *= n, r *= r, n + r <= 1;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this ellipse including stroke.
	* @example
	* ```ts
	* // Basic stroke check
	* const ellipse = new Ellipse(100, 100, 50, 25);
	* const isOnStroke = ellipse.strokeContains(150, 100, 4); // 4px line width
	*
	* // Check with different alignments
	* const innerStroke = ellipse.strokeContains(150, 100, 4, 1);   // Inside
	* const centerStroke = ellipse.strokeContains(150, 100, 4, 0.5); // Centered
	* const outerStroke = ellipse.strokeContains(150, 100, 4, 0);   // Outside
	* ```
	* @remarks
	* - Uses normalized ellipse equations
	* - Considers stroke alignment
	* - Returns false if dimensions are 0
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @param strokeWidth - The width of the line to check
	* @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
	* @returns Whether the x/y coords are within this ellipse's stroke
	* @see {@link Ellipse.contains} For checking fill containment
	* @see {@link Ellipse.getBounds} For getting stroke bounds
	*/
	strokeContains(e, t, n, r = .5) {
		let { halfWidth: i, halfHeight: a } = this;
		if (i <= 0 || a <= 0) return !1;
		let o = n * (1 - r), s = n - o, c = i - s, l = a - s, u = i + o, d = a + o, f = e - this.x, p = t - this.y, m = f * f / (c * c) + p * p / (l * l), h = f * f / (u * u) + p * p / (d * d);
		return m > 1 && h <= 1;
	}
	/**
	* Returns the framing rectangle of the ellipse as a Rectangle object.
	* @example
	* ```ts
	* // Basic bounds calculation
	* const ellipse = new Ellipse(100, 100, 50, 25);
	* const bounds = ellipse.getBounds();
	* // bounds: x=50, y=75, width=100, height=50
	*
	* // Reuse existing rectangle
	* const rect = new Rectangle();
	* ellipse.getBounds(rect);
	* ```
	* @remarks
	* - Creates Rectangle if none provided
	* - Top-left is (x-halfWidth, y-halfHeight)
	* - Width is halfWidth * 2
	* - Height is halfHeight * 2
	* @param out - Optional Rectangle object to store the result
	* @returns The framing rectangle
	* @see {@link Rectangle} For rectangle properties
	* @see {@link Ellipse.contains} For checking if a point is inside
	*/
	getBounds(e) {
		return e ||= new n(), e.x = this.x - this.halfWidth, e.y = this.y - this.halfHeight, e.width = this.halfWidth * 2, e.height = this.halfHeight * 2, e;
	}
	/**
	* Copies another ellipse to this one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Ellipse(100, 100, 50, 25);
	* const target = new Ellipse();
	* target.copyFrom(source);
	* ```
	* @param ellipse - The ellipse to copy from
	* @returns Returns itself
	* @see {@link Ellipse.copyTo} For copying to another ellipse
	* @see {@link Ellipse.clone} For creating new ellipse copy
	*/
	copyFrom(e) {
		return this.x = e.x, this.y = e.y, this.halfWidth = e.halfWidth, this.halfHeight = e.halfHeight, this;
	}
	/**
	* Copies this ellipse to another one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Ellipse(100, 100, 50, 25);
	* const target = new Ellipse();
	* source.copyTo(target);
	* ```
	* @param ellipse - The ellipse to copy to
	* @returns Returns given parameter
	* @see {@link Ellipse.copyFrom} For copying from another ellipse
	* @see {@link Ellipse.clone} For creating new ellipse copy
	*/
	copyTo(e) {
		return e.copyFrom(this), e;
	}
	toString() {
		return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
	}
};
//#endregion
//#region node_modules/pixi.js/lib/maths/misc/getOrientationOfPoints.mjs
function Re(e) {
	let t = e.length;
	if (t < 6) return 1;
	let n = 0;
	for (let r = 0, i = e[t - 2], a = e[t - 1]; r < t; r += 2) {
		let t = e[r], o = e[r + 1];
		n += (t - i) * (o + a), i = t, a = o;
	}
	return n < 0 ? -1 : 1;
}
//#endregion
//#region node_modules/pixi.js/lib/maths/misc/squaredDistanceToLineSegment.mjs
function ze(e, t, n, r, i, a) {
	let o = e - n, s = t - r, c = i - n, l = a - r, u = o * c + s * l, d = c * c + l * l, f = -1;
	d !== 0 && (f = u / d);
	let p, m;
	f < 0 ? (p = n, m = r) : f > 1 ? (p = i, m = a) : (p = n + f * c, m = r + f * l);
	let h = e - p, g = t - m;
	return h * h + g * g;
}
//#endregion
//#region node_modules/pixi.js/lib/maths/shapes/Polygon.mjs
var Be, Ve, He = class e {
	/**
	* @param points - This can be an array of Points
	*  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
	*  the arguments passed can be all the points of the polygon e.g.
	*  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
	*  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
	*/
	constructor(...e) {
		/**
		* The type of the object, mainly used to avoid `instanceof` checks
		* @example
		* ```ts
		* // Check shape type
		* const shape = new Polygon([0, 0, 100, 0, 50, 100]);
		* console.log(shape.type); // 'polygon'
		*
		* // Use in type guards
		* if (shape.type === 'polygon') {
		*     // TypeScript knows this is a Polygon
		*     console.log(shape.points.length);
		* }
		* ```
		* @readonly
		* @default 'polygon'
		* @see {@link SHAPE_PRIMITIVE} For all shape types
		*/
		this.type = "polygon";
		let t = Array.isArray(e[0]) ? e[0] : e;
		if (typeof t[0] != "number") {
			let e = [];
			for (let n = 0, r = t.length; n < r; n++) e.push(t[n].x, t[n].y);
			t = e;
		}
		this.points = t, this.closePath = !0;
	}
	/**
	* Determines whether the polygon's points are arranged in a clockwise direction.
	* Uses the shoelace formula (surveyor's formula) to calculate the signed area.
	*
	* A positive area indicates clockwise winding, while negative indicates counter-clockwise.
	*
	* The formula sums up the cross products of adjacent vertices:
	* For each pair of adjacent points (x1,y1) and (x2,y2), we calculate (x1*y2 - x2*y1)
	* The final sum divided by 2 gives the signed area - positive for clockwise.
	* @example
	* ```ts
	* // Check polygon winding
	* const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
	* console.log(polygon.isClockwise()); // Check direction
	*
	* // Use in path construction
	* const hole = new Polygon([25, 25, 75, 25, 75, 75, 25, 75]);
	* if (hole.isClockwise() === shape.isClockwise()) {
	*     hole.points.reverse(); // Reverse for proper hole winding
	* }
	* ```
	* @returns `true` if the polygon's points are arranged clockwise, `false` if counter-clockwise
	*/
	isClockwise() {
		let e = 0, t = this.points, n = t.length;
		for (let r = 0; r < n; r += 2) {
			let i = t[r], a = t[r + 1], o = t[(r + 2) % n], s = t[(r + 3) % n];
			e += (o - i) * (s + a);
		}
		return e < 0;
	}
	/**
	* Checks if this polygon completely contains another polygon.
	* Used for detecting holes in shapes, like when parsing SVG paths.
	* @example
	* ```ts
	* // Basic containment check
	* const outerSquare = new Polygon([0,0, 100,0, 100,100, 0,100]); // A square
	* const innerSquare = new Polygon([25,25, 75,25, 75,75, 25,75]); // A smaller square inside
	*
	* outerSquare.containsPolygon(innerSquare); // Returns true
	* innerSquare.containsPolygon(outerSquare); // Returns false
	* ```
	* @remarks
	* - Uses bounds check for quick rejection
	* - Tests all points for containment
	* @param polygon - The polygon to test for containment
	* @returns True if this polygon completely contains the other polygon
	* @see {@link Polygon.contains} For single point testing
	* @see {@link Polygon.getBounds} For bounds calculation
	*/
	containsPolygon(e) {
		let t = this.getBounds(Be), n = e.getBounds(Ve);
		if (!t.containsRect(n)) return !1;
		let r = e.points;
		for (let e = 0; e < r.length; e += 2) {
			let t = r[e], n = r[e + 1];
			if (!this.contains(t, n)) return !1;
		}
		return !0;
	}
	/**
	* Creates a clone of this polygon.
	* @example
	* ```ts
	* // Basic cloning
	* const original = new Polygon([0, 0, 100, 0, 50, 100]);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.points[0] = 10; // Modify first x coordinate
	* ```
	* @returns A copy of the polygon
	* @see {@link Polygon.copyFrom} For copying into existing polygon
	* @see {@link Polygon.copyTo} For copying to another polygon
	*/
	clone() {
		let t = this.points.slice(), n = new e(t);
		return n.closePath = this.closePath, n;
	}
	/**
	* Checks whether the x and y coordinates passed to this function are contained within this polygon.
	* Uses raycasting algorithm for point-in-polygon testing.
	* @example
	* ```ts
	* // Basic containment check
	* const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
	* const isInside = polygon.contains(25, 25); // true
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this polygon
	* @see {@link Polygon.strokeContains} For checking stroke intersection
	* @see {@link Polygon.containsPolygon} For polygon-in-polygon testing
	*/
	contains(e, t) {
		let n = !1, r = this.points.length / 2;
		for (let i = 0, a = r - 1; i < r; a = i++) {
			let r = this.points[i * 2], o = this.points[i * 2 + 1], s = this.points[a * 2], c = this.points[a * 2 + 1];
			o > t != c > t && e < (s - r) * ((t - o) / (c - o)) + r && (n = !n);
		}
		return n;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this polygon including the stroke.
	* @example
	* ```ts
	* // Basic stroke check
	* const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
	* const isOnStroke = polygon.strokeContains(25, 25, 4); // 4px line width
	*
	* // Check with different alignments
	* const innerStroke = polygon.strokeContains(25, 25, 4, 1);   // Inside
	* const centerStroke = polygon.strokeContains(25, 25, 4, 0.5); // Centered
	* const outerStroke = polygon.strokeContains(25, 25, 4, 0);   // Outside
	* ```
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @param strokeWidth - The width of the line to check
	* @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
	* @returns Whether the x/y coordinates are within this polygon's stroke
	* @see {@link Polygon.contains} For checking fill containment
	* @see {@link Polygon.getBounds} For getting stroke bounds
	*/
	strokeContains(e, t, n, r = .5) {
		let { points: i } = this, a = n * (r === .5 ? r : (r - .5) * Re(i) + .5), o = n - a, s = a * a, c = o * o, l = i.length - (this.closePath ? 0 : 2);
		for (let n = 0; n < l; n += 2) {
			let r = i[n], a = i[n + 1], o = i[(n + 2) % i.length], l = i[(n + 3) % i.length];
			if (ze(e, t, r, a, o, l) <= (Math.sign((o - r) * (t - a) - (l - a) * (e - r)) < 0 ? s : c)) return !0;
		}
		return !1;
	}
	/**
	* Returns the framing rectangle of the polygon as a Rectangle object.
	* @example
	* ```ts
	* // Basic bounds calculation
	* const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
	* const bounds = polygon.getBounds();
	* // bounds: x=0, y=0, width=100, height=100
	*
	* // Reuse existing rectangle
	* const rect = new Rectangle();
	* polygon.getBounds(rect);
	* ```
	* @param out - Optional rectangle to store the result
	* @returns The framing rectangle
	* @see {@link Rectangle} For rectangle properties
	* @see {@link Polygon.contains} For checking if a point is inside
	*/
	getBounds(e) {
		e ||= new n();
		let t = this.points, r = Infinity, i = -Infinity, a = Infinity, o = -Infinity;
		for (let e = 0, n = t.length; e < n; e += 2) {
			let n = t[e], s = t[e + 1];
			r = n < r ? n : r, i = n > i ? n : i, a = s < a ? s : a, o = s > o ? s : o;
		}
		return e.x = r, e.width = i - r, e.y = a, e.height = o - a, e;
	}
	/**
	* Copies another polygon to this one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Polygon([0, 0, 100, 0, 50, 100]);
	* const target = new Polygon();
	* target.copyFrom(source);
	* ```
	* @param polygon - The polygon to copy from
	* @returns Returns itself
	* @see {@link Polygon.copyTo} For copying to another polygon
	* @see {@link Polygon.clone} For creating new polygon copy
	*/
	copyFrom(e) {
		return this.points = e.points.slice(), this.closePath = e.closePath, this;
	}
	/**
	* Copies this polygon to another one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new Polygon([0, 0, 100, 0, 50, 100]);
	* const target = new Polygon();
	* source.copyTo(target);
	* ```
	* @param polygon - The polygon to copy to
	* @returns Returns given parameter
	* @see {@link Polygon.copyFrom} For copying from another polygon
	* @see {@link Polygon.clone} For creating new polygon copy
	*/
	copyTo(e) {
		return e.copyFrom(this), e;
	}
	toString() {
		return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((e, t) => `${e}, ${t}`, "")}]`;
	}
	/**
	* Get the last X coordinate of the polygon.
	* @example
	* ```ts
	* // Basic coordinate access
	* const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
	* console.log(polygon.lastX); // 300
	* ```
	* @readonly
	* @returns The x-coordinate of the last vertex
	* @see {@link Polygon.lastY} For last Y coordinate
	* @see {@link Polygon.points} For raw points array
	*/
	get lastX() {
		return this.points[this.points.length - 2];
	}
	/**
	* Get the last Y coordinate of the polygon.
	* @example
	* ```ts
	* // Basic coordinate access
	* const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
	* console.log(polygon.lastY); // 400
	* ```
	* @readonly
	* @returns The y-coordinate of the last vertex
	* @see {@link Polygon.lastX} For last X coordinate
	* @see {@link Polygon.points} For raw points array
	*/
	get lastY() {
		return this.points[this.points.length - 1];
	}
	/**
	* Get the last X coordinate of the polygon.
	* @readonly
	* @deprecated since 8.11.0, use {@link Polygon.lastX} instead.
	*/
	get x() {
		return s("8.11.0", "Polygon.lastX is deprecated, please use Polygon.lastX instead."), this.points[this.points.length - 2];
	}
	/**
	* Get the last Y coordinate of the polygon.
	* @readonly
	* @deprecated since 8.11.0, use {@link Polygon.lastY} instead.
	*/
	get y() {
		return s("8.11.0", "Polygon.y is deprecated, please use Polygon.lastY instead."), this.points[this.points.length - 1];
	}
	/**
	* Get the first X coordinate of the polygon.
	* @example
	* ```ts
	* // Basic coordinate access
	* const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
	* console.log(polygon.x); // 0
	* ```
	* @readonly
	* @returns The x-coordinate of the first vertex
	* @see {@link Polygon.startY} For first Y coordinate
	* @see {@link Polygon.points} For raw points array
	*/
	get startX() {
		return this.points[0];
	}
	/**
	* Get the first Y coordinate of the polygon.
	* @example
	* ```ts
	* // Basic coordinate access
	* const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
	* console.log(polygon.y); // 0
	* ```
	* @readonly
	* @returns The y-coordinate of the first vertex
	* @see {@link Polygon.startX} For first X coordinate
	* @see {@link Polygon.points} For raw points array
	*/
	get startY() {
		return this.points[1];
	}
}, Ue = (e, t, n, r, i, a, o) => {
	let s = e - n, c = t - r, l = Math.sqrt(s * s + c * c);
	return l >= i - a && l <= i + o;
}, We = class e {
	/**
	* @param x - The X coordinate of the upper-left corner of the rounded rectangle
	* @param y - The Y coordinate of the upper-left corner of the rounded rectangle
	* @param width - The overall width of this rounded rectangle
	* @param height - The overall height of this rounded rectangle
	* @param radius - Controls the radius of the rounded corners
	*/
	constructor(e = 0, t = 0, n = 0, r = 0, i = 20) {
		this.type = "roundedRectangle", this.x = e, this.y = t, this.width = n, this.height = r, this.radius = i;
	}
	/**
	* Returns the framing rectangle of the rounded rectangle as a Rectangle object
	* @example
	* ```ts
	* // Basic bounds calculation
	* const rect = new RoundedRectangle(100, 100, 200, 150, 20);
	* const bounds = rect.getBounds();
	* // bounds: x=100, y=100, width=200, height=150
	*
	* // Reuse existing rectangle
	* const out = new Rectangle();
	* rect.getBounds(out);
	* ```
	* @remarks
	* - Rectangle matches outer dimensions
	* - Ignores corner radius
	* @param out - Optional rectangle to store the result
	* @returns The framing rectangle
	* @see {@link Rectangle} For rectangle properties
	* @see {@link RoundedRectangle.contains} For checking if a point is inside
	*/
	getBounds(e) {
		return e ||= new n(), e.x = this.x, e.y = this.y, e.width = this.width, e.height = this.height, e;
	}
	/**
	* Creates a clone of this Rounded Rectangle.
	* @example
	* ```ts
	* // Basic cloning
	* const original = new RoundedRectangle(100, 100, 200, 150, 20);
	* const copy = original.clone();
	*
	* // Clone and modify
	* const modified = original.clone();
	* modified.radius = 30;
	* modified.width *= 2;
	*
	* // Verify independence
	* console.log(original.radius);  // 20
	* console.log(modified.radius);  // 30
	* ```
	* @returns A copy of the rounded rectangle
	* @see {@link RoundedRectangle.copyFrom} For copying into existing rectangle
	* @see {@link RoundedRectangle.copyTo} For copying to another rectangle
	*/
	clone() {
		return new e(this.x, this.y, this.width, this.height, this.radius);
	}
	/**
	* Copies another rectangle to this one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new RoundedRectangle(100, 100, 200, 150, 20);
	* const target = new RoundedRectangle();
	* target.copyFrom(source);
	*
	* // Chain with other operations
	* const rect = new RoundedRectangle()
	*     .copyFrom(source)
	*     .getBounds(rect);
	* ```
	* @param rectangle - The rectangle to copy from
	* @returns Returns itself
	* @see {@link RoundedRectangle.copyTo} For copying to another rectangle
	* @see {@link RoundedRectangle.clone} For creating new rectangle copy
	*/
	copyFrom(e) {
		return this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height, this.radius = e.radius, this;
	}
	/**
	* Copies this rectangle to another one.
	* @example
	* ```ts
	* // Basic copying
	* const source = new RoundedRectangle(100, 100, 200, 150, 20);
	* const target = new RoundedRectangle();
	* source.copyTo(target);
	*
	* // Chain with other operations
	* const result = source
	*     .copyTo(new RoundedRectangle())
	*     .getBounds();
	* ```
	* @param rectangle - The rectangle to copy to
	* @returns Returns given parameter
	* @see {@link RoundedRectangle.copyFrom} For copying from another rectangle
	* @see {@link RoundedRectangle.clone} For creating new rectangle copy
	*/
	copyTo(e) {
		return e.copyFrom(this), e;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this Rounded Rectangle
	* @example
	* ```ts
	* // Basic containment check
	* const rect = new RoundedRectangle(100, 100, 200, 150, 20);
	* const isInside = rect.contains(150, 125); // true
	* // Check corner radius
	* const corner = rect.contains(100, 100); // false if within corner curve
	* ```
	* @remarks
	* - Returns false if width/height is 0 or negative
	* - Handles rounded corners with radius check
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this Rounded Rectangle
	* @see {@link RoundedRectangle.strokeContains} For checking stroke intersection
	* @see {@link RoundedRectangle.getBounds} For getting containing rectangle
	*/
	contains(e, t) {
		if (this.width <= 0 || this.height <= 0) return !1;
		if (e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height) {
			let n = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
			if (t >= this.y + n && t <= this.y + this.height - n || e >= this.x + n && e <= this.x + this.width - n) return !0;
			let r = e - (this.x + n), i = t - (this.y + n), a = n * n;
			if (r * r + i * i <= a || (r = e - (this.x + this.width - n), r * r + i * i <= a) || (i = t - (this.y + this.height - n), r * r + i * i <= a) || (r = e - (this.x + n), r * r + i * i <= a)) return !0;
		}
		return !1;
	}
	/**
	* Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
	* @example
	* ```ts
	* // Basic stroke check
	* const rect = new RoundedRectangle(100, 100, 200, 150, 20);
	* const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
	*
	* // Check with different alignments
	* const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
	* const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
	* const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
	* ```
	* @param pX - The X coordinate of the point to test
	* @param pY - The Y coordinate of the point to test
	* @param strokeWidth - The width of the line to check
	* @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
	* @returns Whether the x/y coordinates are within this rectangle's stroke
	* @see {@link RoundedRectangle.contains} For checking fill containment
	* @see {@link RoundedRectangle.getBounds} For getting stroke bounds
	*/
	strokeContains(e, t, n, r = .5) {
		let { x: i, y: a, width: o, height: s, radius: c } = this, l = n * (1 - r), u = n - l, d = i + c, f = a + c, p = o - c * 2, m = s - c * 2, h = i + o, g = a + s;
		return (e >= i - l && e <= i + u || e >= h - u && e <= h + l) && t >= f && t <= f + m || (t >= a - l && t <= a + u || t >= g - u && t <= g + l) && e >= d && e <= d + p || e < d && t < f && Ue(e, t, d, f, c, u, l) || e > h - c && t < f && Ue(e, t, h - c, f, c, u, l) || e > h - c && t > g - c && Ue(e, t, h - c, g - c, c, u, l) || e < d && t > g - c && Ue(e, t, d, g - c, c, u, l);
	}
	toString() {
		return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
	}
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/buildUvs.mjs
function Ge(e, t, n, r, i, a, o, s = null) {
	let c = 0;
	n *= t, i *= a;
	let l = s.a, u = s.b, d = s.c, f = s.d, p = s.tx, m = s.ty;
	for (; c < o;) {
		let o = e[n], s = e[n + 1];
		r[i] = l * o + d * s + p, r[i + 1] = u * o + f * s + m, i += a, n += t, c++;
	}
}
function Ke(e, t, n, r) {
	let i = 0;
	for (t *= n; i < r;) e[t] = 0, e[t + 1] = 0, t += n, i++;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/transformVertices.mjs
function qe(e, t, n, r, i) {
	let a = t.a, o = t.b, s = t.c, c = t.d, l = t.tx, u = t.ty;
	n ||= 0, r ||= 2, i ||= e.length / r - n;
	let d = n * r;
	for (let t = 0; t < i; t++) {
		let t = e[d], n = e[d + 1];
		e[d] = a * t + s * n + l, e[d + 1] = o * t + c * n + u, d += r;
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/BatchableGraphics.mjs
var Je = new p(), Ye = class {
	constructor() {
		this.packAsQuad = !1, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
	}
	get uvs() {
		return this.geometryData.uvs;
	}
	get positions() {
		return this.geometryData.vertices;
	}
	get indices() {
		return this.geometryData.indices;
	}
	get blendMode() {
		return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
	}
	get color() {
		let e = this.baseColor, t = e >> 16 | e & 65280 | (e & 255) << 16, n = this.renderable;
		return n ? f(t, n.groupColor) + (this.alpha * n.groupAlpha * 255 << 24) : t + (this.alpha * 255 << 24);
	}
	get transform() {
		return this.renderable?.groupTransform || Je;
	}
	copyTo(e) {
		e.indexOffset = this.indexOffset, e.indexSize = this.indexSize, e.attributeOffset = this.attributeOffset, e.attributeSize = this.attributeSize, e.baseColor = this.baseColor, e.alpha = this.alpha, e.texture = this.texture, e.geometryData = this.geometryData, e.topology = this.topology;
	}
	reset() {
		this.applyTransform = !0, this.renderable = null, this.topology = "triangle-list";
	}
	destroy() {
		this.renderable = null, this.texture = null, this.geometryData = null, this._batcher = null, this._batch = null;
	}
}, W = {
	extension: {
		type: i.ShapeBuilder,
		name: "circle"
	},
	build(e, t) {
		let n, r, i, a, o, s;
		if (e.type === "circle") {
			let t = e;
			if (o = s = t.radius, o <= 0) return !1;
			n = t.x, r = t.y, i = a = 0;
		} else if (e.type === "ellipse") {
			let t = e;
			if (o = t.halfWidth, s = t.halfHeight, o <= 0 || s <= 0) return !1;
			n = t.x, r = t.y, i = a = 0;
		} else {
			let t = e, c = t.width / 2, l = t.height / 2;
			n = t.x + c, r = t.y + l, o = s = Math.max(0, Math.min(t.radius, Math.min(c, l))), i = c - o, a = l - s;
		}
		if (i < 0 || a < 0) return !1;
		let c = Math.ceil(2.3 * Math.sqrt(o + s)), l = c * 8 + (i ? 4 : 0) + (a ? 4 : 0);
		if (l === 0) return !1;
		if (c === 0) return t[0] = t[6] = n + i, t[1] = t[3] = r + a, t[2] = t[4] = n - i, t[5] = t[7] = r - a, !0;
		let u = 0, d = c * 4 + (i ? 2 : 0) + 2, f = d, p = l, m = i + o, h = a, g = n + m, _ = n - m, v = r + h;
		if (t[u++] = g, t[u++] = v, t[--d] = v, t[--d] = _, a) {
			let e = r - h;
			t[f++] = _, t[f++] = e, t[--p] = e, t[--p] = g;
		}
		for (let e = 1; e < c; e++) {
			let l = Math.PI / 2 * (e / c), m = i + Math.cos(l) * o, h = a + Math.sin(l) * s, g = n + m, _ = n - m, v = r + h, y = r - h;
			t[u++] = g, t[u++] = v, t[--d] = v, t[--d] = _, t[f++] = _, t[f++] = y, t[--p] = y, t[--p] = g;
		}
		m = i, h = a + s, g = n + m, _ = n - m, v = r + h;
		let y = r - h;
		return t[u++] = g, t[u++] = v, t[--p] = y, t[--p] = g, i && (t[u++] = _, t[u++] = v, t[--p] = y, t[--p] = _), !0;
	},
	triangulate(e, t, n, r, i, a) {
		if (e.length === 0) return;
		let o = 0, s = 0;
		for (let t = 0; t < e.length; t += 2) o += e[t], s += e[t + 1];
		o /= e.length / 2, s /= e.length / 2;
		let c = r;
		t[c * n] = o, t[c * n + 1] = s;
		let l = c++;
		for (let r = 0; r < e.length; r += 2) t[c * n] = e[r], t[c * n + 1] = e[r + 1], r > 0 && (i[a++] = c, i[a++] = l, i[a++] = c - 1), c++;
		i[a++] = l + 1, i[a++] = l, i[a++] = c - 1;
	}
}, Xe = {
	...W,
	extension: {
		...W.extension,
		name: "ellipse"
	}
}, Ze = {
	...W,
	extension: {
		...W.extension,
		name: "roundedRectangle"
	}
}, Qe = 1e-4, $e = 1e-4;
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildLine.mjs
function et(e, t, n, r, i, a, o, s) {
	let c = e - n * i, l = t - r * i, u = e + n * a, d = t + r * a, f, p;
	o ? (f = r, p = -n) : (f = -r, p = n);
	let m = c + f, h = l + p, g = u + f, _ = d + p;
	return s.push(m, h), s.push(g, _), 2;
}
function G(e, t, n, r, i, a, o, s) {
	let c = n - e, l = r - t, u = Math.atan2(c, l), d = Math.atan2(i - e, a - t);
	s && u < d ? u += Math.PI * 2 : !s && u > d && (d += Math.PI * 2);
	let f = u, p = d - u, m = Math.abs(p), h = Math.sqrt(c * c + l * l), g = (15 * m * Math.sqrt(h) / Math.PI >> 0) + 1, _ = p / g;
	if (f += _, s) {
		o.push(e, t), o.push(n, r);
		for (let n = 1, r = f; n < g; n++, r += _) o.push(e, t), o.push(e + Math.sin(r) * h, t + Math.cos(r) * h);
		o.push(e, t), o.push(i, a);
	} else {
		o.push(n, r), o.push(e, t);
		for (let n = 1, r = f; n < g; n++, r += _) o.push(e + Math.sin(r) * h, t + Math.cos(r) * h), o.push(e, t);
		o.push(i, a), o.push(e, t);
	}
	return g * 2;
}
function tt(t, n, r, i, a, o) {
	let s = Qe;
	if (t.length === 0) return;
	let c = n, l = c.alignment;
	if (n.alignment !== .5) {
		let e = Re(t);
		r && (e *= -1), l = (l - .5) * e + .5;
	}
	let u = new e(t[0], t[1]), d = new e(t[t.length - 2], t[t.length - 1]), f = i, p = Math.abs(u.x - d.x) < s && Math.abs(u.y - d.y) < s;
	if (f) {
		t = t.slice(), p && (t.pop(), t.pop(), d.set(t[t.length - 2], t[t.length - 1]));
		let e = (u.x + d.x) * .5, n = (d.y + u.y) * .5;
		t.unshift(e, n), t.push(e, n);
	}
	let m = a, h = t.length / 2, g = t.length, _ = m.length / 2, v = c.width / 2, y = v * v, b = c.miterLimit * c.miterLimit, x = t[0], S = t[1], C = t[2], w = t[3], T = 0, E = 0, D = -(S - w), O = x - C, k = 0, A = 0, j = Math.sqrt(D * D + O * O);
	D /= j, O /= j, D *= v, O *= v;
	let M = l, N = (1 - M) * 2, P = M * 2;
	f || (c.cap === "round" ? g += G(x - D * (N - P) * .5, S - O * (N - P) * .5, x - D * N, S - O * N, x + D * P, S + O * P, m, !0) + 2 : c.cap === "square" && (g += et(x, S, D, O, N, P, !0, m))), m.push(x - D * N, S - O * N), m.push(x + D * P, S + O * P);
	for (let e = 1; e < h - 1; ++e) {
		x = t[(e - 1) * 2], S = t[(e - 1) * 2 + 1], C = t[e * 2], w = t[e * 2 + 1], T = t[(e + 1) * 2], E = t[(e + 1) * 2 + 1], D = -(S - w), O = x - C, j = Math.sqrt(D * D + O * O), D /= j, O /= j, D *= v, O *= v, k = -(w - E), A = C - T, j = Math.sqrt(k * k + A * A), k /= j, A /= j, k *= v, A *= v;
		let n = C - x, r = S - w, i = C - T, a = E - w, o = n * i + r * a, s = r * i - a * n, l = s < 0;
		if (Math.abs(s) < .001 * Math.abs(o)) {
			m.push(C - D * N, w - O * N), m.push(C + D * P, w + O * P), o >= 0 && (c.join === "round" ? g += G(C, w, C - D * N, w - O * N, C - k * N, w - A * N, m, !1) + 4 : g += 2, m.push(C - k * P, w - A * P), m.push(C + k * N, w + A * N));
			continue;
		}
		let u = (-D + x) * (-O + w) - (-D + C) * (-O + S), d = (-k + T) * (-A + w) - (-k + C) * (-A + E), f = (n * d - i * u) / s, p = (a * u - r * d) / s, h = (f - C) * (f - C) + (p - w) * (p - w), _ = C + (f - C) * N, M = w + (p - w) * N, F = C - (f - C) * P, I = w - (p - w) * P, ee = Math.min(n * n + r * r, i * i + a * a), L = l ? N : P;
		h <= ee + L * L * y ? c.join === "bevel" || h / y > b ? (l ? (m.push(_, M), m.push(C + D * P, w + O * P), m.push(_, M), m.push(C + k * P, w + A * P)) : (m.push(C - D * N, w - O * N), m.push(F, I), m.push(C - k * N, w - A * N), m.push(F, I)), g += 2) : c.join === "round" ? l ? (m.push(_, M), m.push(C + D * P, w + O * P), g += G(C, w, C + D * P, w + O * P, C + k * P, w + A * P, m, !0) + 4, m.push(_, M), m.push(C + k * P, w + A * P)) : (m.push(C - D * N, w - O * N), m.push(F, I), g += G(C, w, C - D * N, w - O * N, C - k * N, w - A * N, m, !1) + 4, m.push(C - k * N, w - A * N), m.push(F, I)) : (m.push(_, M), m.push(F, I)) : (m.push(C - D * N, w - O * N), m.push(C + D * P, w + O * P), c.join === "round" ? g += l ? G(C, w, C + D * P, w + O * P, C + k * P, w + A * P, m, !0) + 2 : G(C, w, C - D * N, w - O * N, C - k * N, w - A * N, m, !1) + 2 : c.join === "miter" && h / y <= b && (l ? (m.push(F, I), m.push(F, I)) : (m.push(_, M), m.push(_, M)), g += 2), m.push(C - k * N, w - A * N), m.push(C + k * P, w + A * P), g += 2);
	}
	x = t[(h - 2) * 2], S = t[(h - 2) * 2 + 1], C = t[(h - 1) * 2], w = t[(h - 1) * 2 + 1], D = -(S - w), O = x - C, j = Math.sqrt(D * D + O * O), D /= j, O /= j, D *= v, O *= v, m.push(C - D * N, w - O * N), m.push(C + D * P, w + O * P), f || (c.cap === "round" ? g += G(C - D * (N - P) * .5, w - O * (N - P) * .5, C - D * N, w - O * N, C + D * P, w + O * P, m, !1) + 2 : c.cap === "square" && (g += et(C, w, D, O, N, P, !1, m)));
	let F = $e * $e;
	for (let e = _; e < g + _ - 2; ++e) x = m[e * 2], S = m[e * 2 + 1], C = m[(e + 1) * 2], w = m[(e + 1) * 2 + 1], T = m[(e + 2) * 2], E = m[(e + 2) * 2 + 1], !(Math.abs(x * (w - E) + C * (E - S) + T * (S - w)) < F) && o.push(e, e + 1, e + 2);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildPixelLine.mjs
function nt(e, t, n, r) {
	let i = Qe;
	if (e.length === 0) return;
	let a = e[0], o = e[1], s = e[e.length - 2], c = e[e.length - 1], l = t || Math.abs(a - s) < i && Math.abs(o - c) < i, u = n, d = e.length / 2, f = u.length / 2;
	for (let t = 0; t < d; t++) u.push(e[t * 2]), u.push(e[t * 2 + 1]);
	for (let e = 0; e < d - 1; e++) r.push(f + e, f + e + 1);
	l && r.push(f + d - 1, f);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/utils/triangulateWithHoles.mjs
function rt(e, t, n, r, i, a, o) {
	let s = ke(e, t, 2);
	if (!s) return;
	for (let e = 0; e < s.length; e += 3) a[o++] = s[e] + i, a[o++] = s[e + 1] + i, a[o++] = s[e + 2] + i;
	let c = i * r;
	for (let t = 0; t < e.length; t += 2) n[c] = e[t], n[c + 1] = e[t + 1], c += r;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildPolygon.mjs
var it = [], at = {
	extension: {
		type: i.ShapeBuilder,
		name: "polygon"
	},
	build(e, t) {
		for (let n = 0; n < e.points.length; n++) t[n] = e.points[n];
		return !0;
	},
	triangulate(e, t, n, r, i, a) {
		rt(e, it, t, n, r, i, a);
	}
}, ot = {
	extension: {
		type: i.ShapeBuilder,
		name: "rectangle"
	},
	build(e, t) {
		let n = e, r = n.x, i = n.y, a = n.width, o = n.height;
		return a > 0 && o > 0 && (t[0] = r, t[1] = i, t[2] = r + a, t[3] = i, t[4] = r + a, t[5] = i + o, t[6] = r, t[7] = i + o, !0);
	},
	triangulate(e, t, n, r, i, a) {
		let o = 0;
		r *= n, t[r + o] = e[0], t[r + o + 1] = e[1], o += n, t[r + o] = e[2], t[r + o + 1] = e[3], o += n, t[r + o] = e[6], t[r + o + 1] = e[7], o += n, t[r + o] = e[4], t[r + o + 1] = e[5], o += n;
		let s = r / n;
		i[a++] = s, i[a++] = s + 1, i[a++] = s + 2, i[a++] = s + 1, i[a++] = s + 3, i[a++] = s + 2;
	}
}, st = {
	extension: {
		type: i.ShapeBuilder,
		name: "triangle"
	},
	build(e, t) {
		return t[0] = e.x, t[1] = e.y, t[2] = e.x2, t[3] = e.y2, t[4] = e.x3, t[5] = e.y3, !0;
	},
	triangulate(e, t, n, r, i, a) {
		let o = 0;
		r *= n, t[r + o] = e[0], t[r + o + 1] = e[1], o += n, t[r + o] = e[2], t[r + o + 1] = e[3], o += n, t[r + o] = e[4], t[r + o + 1] = e[5];
		let s = r / n;
		i[a++] = s, i[a++] = s + 1, i[a++] = s + 2;
	}
}, ct = [{
	offset: 0,
	color: "white"
}, {
	offset: 1,
	color: "black"
}], lt = class e {
	constructor(...t) {
		/** Array of color stops defining the gradient */
		this.uid = r("fillGradient"), this._tick = 0, this.type = "linear", this.colorStops = [];
		let n = ft(t);
		n = {
			...n.type === "radial" ? e.defaultRadialOptions : e.defaultLinearOptions,
			...c(n)
		}, this._textureSize = n.textureSize, this._wrapMode = n.wrapMode, n.type === "radial" ? (this.center = n.center, this.outerCenter = n.outerCenter ?? this.center, this.innerRadius = n.innerRadius, this.outerRadius = n.outerRadius, this.scale = n.scale, this.rotation = n.rotation) : (this.start = n.start, this.end = n.end), this.textureSpace = n.textureSpace, this.type = n.type, n.colorStops.forEach((e) => {
			this.addColorStop(e.offset, e.color);
		});
	}
	/**
	* Adds a color stop to the gradient
	* @param offset - Position of the stop (0-1)
	* @param color - Color of the stop
	* @returns This gradient instance for chaining
	*/
	addColorStop(e, t) {
		return this.colorStops.push({
			offset: e,
			color: _.shared.setValue(t).toHexa()
		}), this;
	}
	/**
	* Builds the internal texture and transform for the gradient.
	* Called automatically when the gradient is first used.
	* @internal
	*/
	buildLinearGradient() {
		if (this.texture) return;
		let { x: e, y: t } = this.start, { x: n, y: r } = this.end, i = n - e, a = r - t, o = i < 0 || a < 0;
		if (this._wrapMode === "clamp-to-edge") {
			if (i < 0) {
				let t = e;
				e = n, n = t, i *= -1;
			}
			if (a < 0) {
				let e = t;
				t = r, r = e, a *= -1;
			}
		}
		let s = this.colorStops.length ? this.colorStops : ct, c = this._textureSize, { canvas: l, context: u } = dt(c, 1), f = o ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
		ut(f, s), u.fillStyle = f, u.fillRect(0, 0, c, 1), this.texture = new d({ source: new y({
			resource: l,
			addressMode: this._wrapMode
		}) });
		let m = Math.sqrt(i * i + a * a), h = Math.atan2(a, i), g = new p();
		g.scale(m / c, 1), g.rotate(h), g.translate(e, t), this.textureSpace === "local" && g.scale(c, c), this.transform = g;
	}
	/**
	* Builds the internal texture and transform for the gradient.
	* Called automatically when the gradient is first used.
	* @internal
	*/
	buildGradient() {
		this.texture || this._tick++, this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
	}
	/**
	* Builds the internal texture and transform for the radial gradient.
	* Called automatically when the gradient is first used.
	* @internal
	*/
	buildRadialGradient() {
		if (this.texture) return;
		let e = this.colorStops.length ? this.colorStops : ct, t = this._textureSize, { canvas: n, context: r } = dt(t, t), { x: i, y: a } = this.center, { x: o, y: s } = this.outerCenter, c = this.innerRadius, l = this.outerRadius, u = o - l, f = s - l, m = t / (l * 2), h = (i - u) * m, g = (a - f) * m, _ = r.createRadialGradient(h, g, c * m, (o - u) * m, (s - f) * m, l * m);
		ut(_, e), r.fillStyle = e[e.length - 1].color, r.fillRect(0, 0, t, t), r.fillStyle = _, r.translate(h, g), r.rotate(this.rotation), r.scale(1, this.scale), r.translate(-h, -g), r.fillRect(0, 0, t, t), this.texture = new d({ source: new y({
			resource: n,
			addressMode: this._wrapMode
		}) });
		let v = new p();
		this.textureSpace === "local" ? v.scale(2 * l, 2 * l) : v.scale(1 / m, 1 / m), v.translate(u, f), this.transform = v;
	}
	/** Destroys the gradient, releasing resources. This will also destroy the internal texture. */
	destroy() {
		this.texture?.destroy(!0), this.texture = null, this.transform = null, this.colorStops = [], this.start = null, this.end = null, this.center = null, this.outerCenter = null;
	}
	/**
	* Returns a unique key for this gradient instance.
	* This key is used for caching and texture management.
	* @returns {string} Unique key for the gradient
	*/
	get styleKey() {
		return `fill-gradient-${this.uid}-${this._tick}`;
	}
};
/** Default options for creating a radial gradient fill */
lt.defaultLinearOptions = {
	start: {
		x: 0,
		y: 0
	},
	end: {
		x: 0,
		y: 1
	},
	colorStops: [],
	textureSpace: "local",
	type: "linear",
	textureSize: 256,
	wrapMode: "clamp-to-edge"
}, lt.defaultRadialOptions = {
	center: {
		x: .5,
		y: .5
	},
	innerRadius: 0,
	outerRadius: .5,
	colorStops: [],
	scale: 1,
	rotation: 0,
	textureSpace: "local",
	type: "radial",
	textureSize: 256,
	wrapMode: "clamp-to-edge"
};
var K = lt;
function ut(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		e.addColorStop(r.offset, r.color);
	}
}
function dt(e, t) {
	let n = g.get().createCanvas(e, t);
	return {
		canvas: n,
		context: n.getContext("2d")
	};
}
function ft(e) {
	let t = e[0] ?? {};
	return (typeof t == "number" || e[1]) && (s("8.5.2", "use options object instead"), t = {
		type: "linear",
		start: {
			x: e[0],
			y: e[1]
		},
		end: {
			x: e[2],
			y: e[3]
		},
		textureSpace: e[4],
		textureSize: e[5] ?? K.defaultLinearOptions.textureSize
	}), t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/utils/generateTextureFillMatrix.mjs
var pt = new p(), mt = new n(), ht = new p();
function gt(e, t, n, r) {
	let i = t.matrix ? e.copyFrom(t.matrix).invert() : e.identity();
	if (t.textureSpace === "local") {
		let e = n.getBounds(mt);
		t.width && e.pad(t.width);
		let { x: r, y: a } = e, o = 1 / e.width, s = 1 / e.height, c = -r * o, l = -a * s, u = i.a, d = i.b, f = i.c, p = i.d;
		i.a *= o, i.b *= o, i.c *= s, i.d *= s, i.tx = c * u + l * f + i.tx, i.ty = c * d + l * p + i.ty;
	} else if (t.texture.rotate) {
		let { uvs: e, orig: n } = t.texture;
		i.scale(1 / n.width, 1 / n.height), i.prepend(ht.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0));
	} else i.translate(t.texture.frame.x, t.texture.frame.y), i.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
	let a = t.texture.source.style;
	return !(t.fill instanceof K) && a.addressMode === "clamp-to-edge" && (a.addressMode = "repeat", a.update()), r && i.append(pt.copyFrom(r).invert()), i;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/utils/buildContextBatches.mjs
var q = {};
a.handleByMap(i.ShapeBuilder, q), a.add(ot, at, st, W, Xe, Ze);
var _t = new n(), vt = new p();
function yt(e, t) {
	let { geometryData: n, batches: r } = t;
	r.length = 0, n.indices.length = 0, n.vertices.length = 0, n.uvs.length = 0;
	for (let t = 0; t < e.instructions.length; t++) {
		let i = e.instructions[t];
		if (i.action === "texture") bt(i.data, r, n);
		else if (i.action === "fill" || i.action === "stroke") {
			let e = i.action === "stroke", t = i.data.path.shapePath, a = i.data.style, o = i.data.hole;
			e && o && xt(o.shapePath, a, !0, r, n), o && (t.shapePrimitives[t.shapePrimitives.length - 1].holes = o.shapePath.shapePrimitives), xt(t, a, e, r, n);
		}
	}
}
function bt(e, t, n) {
	let r = [], i = q.rectangle, a = _t;
	a.x = e.dx, a.y = e.dy, a.width = e.dw, a.height = e.dh;
	let o = e.transform;
	if (!i.build(a, r)) return;
	let { vertices: s, uvs: c, indices: u } = n, d = u.length, f = s.length / 2;
	o && qe(r, o), i.triangulate(r, s, 2, f, u, d);
	let p = e.image, m = p.uvs;
	c.push(m.x0, m.y0, m.x1, m.y1, m.x3, m.y3, m.x2, m.y2);
	let h = l.get(Ye);
	h.indexOffset = d, h.indexSize = u.length - d, h.attributeOffset = f, h.attributeSize = s.length / 2 - f, h.baseColor = e.style, h.alpha = e.alpha, h.texture = p, h.geometryData = n, t.push(h);
}
function xt(e, t, n, r, i) {
	let { vertices: a, uvs: o, indices: s } = i;
	e.shapePrimitives.forEach(({ shape: e, transform: c, holes: u }) => {
		let f = [], p = q[e.type];
		if (!p.build(e, f)) return;
		let m = s.length, h = a.length / 2, g = "triangle-list";
		if (c && qe(f, c), n) {
			let n = e.closePath ?? !0, r = t;
			r.pixelLine ? (nt(f, n, a, s), g = "line-list") : tt(f, r, !1, n, a, s);
		} else if (u) {
			let e = [], t = f.slice();
			St(u).forEach((n) => {
				e.push(t.length / 2), t.push(...n);
			}), rt(t, e, a, 2, h, s, m);
		} else p.triangulate(f, a, 2, h, s, m);
		let _ = o.length / 2, v = t.texture;
		if (v !== d.WHITE) {
			let n = gt(vt, t, e, c);
			Ge(a, 2, h, o, _, 2, a.length / 2 - h, n);
		} else Ke(o, _, 2, a.length / 2 - h);
		let y = l.get(Ye);
		y.indexOffset = m, y.indexSize = s.length - m, y.attributeOffset = h, y.attributeSize = a.length / 2 - h, y.baseColor = t.color, y.alpha = t.alpha, y.texture = v, y.geometryData = i, y.topology = g, r.push(y);
	});
}
function St(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n].shape, i = [];
		q[r.type].build(r, i) && t.push(i);
	}
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/GraphicsContextSystem.mjs
var Ct = class {
	constructor() {
		this.batches = [], this.geometryData = {
			vertices: [],
			uvs: [],
			indices: []
		};
	}
	reset() {
		this.batches && this.batches.forEach((e) => {
			l.return(e);
		}), this.graphicsData && l.return(this.graphicsData), this.isBatchable = !1, this.context = null, this.batches.length = 0, this.geometryData.indices.length = 0, this.geometryData.vertices.length = 0, this.geometryData.uvs.length = 0, this.graphicsData = null;
	}
	destroy() {
		this.reset(), this.batches = null, this.geometryData = null;
	}
}, wt = class {
	constructor() {
		this.instructions = new h();
	}
	init(e) {
		let t = e.maxTextures;
		this.batcher ? this.batcher._updateMaxTextures(t) : this.batcher = new x({ maxTextures: t }), this.instructions.reset();
	}
	/**
	* @deprecated since version 8.0.0
	* Use `batcher.geometry` instead.
	* @see {Batcher#geometry}
	*/
	get geometry() {
		return s(v, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
	}
	destroy() {
		this.batcher.destroy(), this.instructions.destroy(), this.batcher = null, this.instructions = null;
	}
}, Tt = class e {
	constructor(e) {
		this._renderer = e, this._managedContexts = new S({
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
		return e._gpuData[this._renderer.uid].graphicsData || this._initContextRenderData(e);
	}
	/**
	* Updates the GPU context for a given GraphicsContext.
	* If the context is dirty, it will rebuild the batches and geometry data.
	* @param context - The GraphicsContext to update.
	* @returns The updated GpuGraphicsContext.
	* @internal
	*/
	updateGpuContext(e) {
		let t = !!e._gpuData[this._renderer.uid], n = e._gpuData[this._renderer.uid] || this._initContext(e);
		if (e.dirty || !t) {
			t && n.reset(), yt(e, n);
			let r = e.batchMode;
			n.isBatchable = e.customShader || r === "no-batch" ? !1 : r !== "auto" || n.geometryData.vertices.length < 400, e.dirty = !1;
		}
		return n;
	}
	/**
	* Returns the GpuGraphicsContext for a given GraphicsContext.
	* If it does not exist, it will initialize a new one.
	* @param context - The GraphicsContext to get the GpuGraphicsContext for.
	* @returns The GpuGraphicsContext for the given GraphicsContext.
	* @internal
	*/
	getGpuContext(e) {
		return e._gpuData[this._renderer.uid] || this._initContext(e);
	}
	_initContextRenderData(e) {
		let t = l.get(wt, { maxTextures: this._renderer.limits.maxBatchableTextures }), n = e._gpuData[this._renderer.uid], { batches: r, geometryData: i } = n;
		n.graphicsData = t;
		let a = i.vertices.length, o = i.indices.length;
		for (let e = 0; e < r.length; e++) r[e].applyTransform = !1;
		let s = t.batcher;
		s.ensureAttributeBuffer(a), s.ensureIndexBuffer(o), s.begin();
		for (let e = 0; e < r.length; e++) {
			let t = r[e];
			s.add(t);
		}
		s.finish(t.instructions);
		let c = s.geometry;
		c.indexBuffer.setDataWithSize(s.indexBuffer, s.indexSize, !0), c.buffers[0].setDataWithSize(s.attributeBuffer.float32View, s.attributeSize, !0);
		let u = s.batches;
		for (let e = 0; e < u.length; e++) {
			let t = u[e];
			t.bindGroup = b(t.textures.textures, t.textures.count, this._renderer.limits.maxBatchableTextures);
		}
		return t;
	}
	_initContext(e) {
		let t = new Ct();
		return t.context = e, e._gpuData[this._renderer.uid] = t, this._managedContexts.add(e), t;
	}
	destroy() {
		this._managedContexts.destroy(), this._renderer = null;
	}
};
/** The default options for the GraphicsContextSystem. */
Tt.extension = {
	type: [i.WebGLSystem, i.WebGPUSystem],
	name: "graphicsContext"
}, Tt.defaultOptions = { 
/**
* A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
* @default 0.5
*/
bezierSmoothness: .5 };
var Et = Tt, Dt = 8, Ot = 1.1920929e-7, kt = 1;
function At(e, t, n, r, i, a, o, s, c, l) {
	let u = (kt - Math.min(.99, Math.max(0, l ?? Et.defaultOptions.bezierSmoothness))) / 1;
	return u *= u, jt(t, n, r, i, a, o, s, c, e, u), e;
}
function jt(e, t, n, r, i, a, o, s, c, l) {
	Mt(e, t, n, r, i, a, o, s, c, l, 0), c.push(o, s);
}
function Mt(e, t, n, r, i, a, o, s, c, l, u) {
	if (u > Dt) return;
	let d = (e + n) / 2, f = (t + r) / 2, p = (n + i) / 2, m = (r + a) / 2, h = (i + o) / 2, g = (a + s) / 2, _ = (d + p) / 2, v = (f + m) / 2, y = (p + h) / 2, b = (m + g) / 2, x = (_ + y) / 2, S = (v + b) / 2;
	if (u > 0) {
		let u = o - e, d = s - t, f = Math.abs((n - o) * d - (r - s) * u), p = Math.abs((i - o) * d - (a - s) * u);
		if (f > Ot && p > Ot) {
			if ((f + p) * (f + p) <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (f > Ot) {
			if (f * f <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (p > Ot) {
			if (p * p <= l * (u * u + d * d)) {
				c.push(x, S);
				return;
			}
		} else if (u = x - (e + o) / 2, d = S - (t + s) / 2, u * u + d * d <= l) {
			c.push(x, S);
			return;
		}
	}
	Mt(e, t, d, f, _, v, x, S, c, l, u + 1), Mt(x, S, y, b, h, g, o, s, c, l, u + 1);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildAdaptiveQuadratic.mjs
var Nt = 8, Pt = 1.1920929e-7, Ft = 1;
function It(e, t, n, r, i, a, o, s) {
	let c = (Ft - Math.min(.99, Math.max(0, s ?? Et.defaultOptions.bezierSmoothness))) / 1;
	return c *= c, Lt(t, n, r, i, a, o, e, c), e;
}
function Lt(e, t, n, r, i, a, o, s) {
	Rt(o, e, t, n, r, i, a, s, 0), o.push(i, a);
}
function Rt(e, t, n, r, i, a, o, s, c) {
	if (c > Nt) return;
	let l = (t + r) / 2, u = (n + i) / 2, d = (r + a) / 2, f = (i + o) / 2, p = (l + d) / 2, m = (u + f) / 2, h = a - t, g = o - n, _ = Math.abs((r - a) * g - (i - o) * h);
	if (_ > Pt) {
		if (_ * _ <= s * (h * h + g * g)) {
			e.push(p, m);
			return;
		}
	} else if (h = p - (t + a) / 2, g = m - (n + o) / 2, h * h + g * g <= s) {
		e.push(p, m);
		return;
	}
	Rt(e, t, n, l, u, p, m, s, c + 1), Rt(e, p, m, d, f, a, o, s, c + 1);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArc.mjs
function zt(e, t, n, r, i, a, o, s) {
	let c = Math.abs(i - a);
	(!o && i > a || o && a > i) && (c = 2 * Math.PI - c), s ||= Math.max(6, Math.floor(6 * r ** (1 / 3) * (c / Math.PI))), s = Math.max(s, 3);
	let l = c / s, u = i;
	l *= o ? -1 : 1;
	for (let i = 0; i < s + 1; i++) {
		let i = Math.cos(u), a = Math.sin(u), o = t + i * r, s = n + a * r;
		e.push(o, s), u += l;
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArcTo.mjs
function Bt(e, t, n, r, i, a) {
	let o = e[e.length - 2], s = e[e.length - 1] - n, c = o - t, l = i - n, u = r - t, d = Math.abs(s * u - c * l);
	if (d < 1e-8 || a === 0) {
		(e[e.length - 2] !== t || e[e.length - 1] !== n) && e.push(t, n);
		return;
	}
	let f = s * s + c * c, p = l * l + u * u, m = s * l + c * u, h = a * Math.sqrt(f) / d, g = a * Math.sqrt(p) / d, _ = h * m / f, v = g * m / p, y = h * u + g * c, b = h * l + g * s, x = c * (g + _), S = s * (g + _), C = u * (h + v), w = l * (h + v), T = Math.atan2(S - b, x - y), E = Math.atan2(w - b, C - y);
	zt(e, y + t, b + n, a, T, E, c * l > u * s);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/buildCommands/buildArcToSvg.mjs
var J = Math.PI * 2, Vt = {
	centerX: 0,
	centerY: 0,
	ang1: 0,
	ang2: 0
}, Ht = ({ x: e, y: t }, n, r, i, a, o, s, c) => {
	e *= n, t *= r;
	let l = i * e - a * t, u = a * e + i * t;
	return c.x = l + o, c.y = u + s, c;
};
function Ut(e, t) {
	let n = t === -1.5707963267948966 ? -.551915024494 : 4 / 3 * Math.tan(t / 4), r = t === 1.5707963267948966 ? .551915024494 : n, i = Math.cos(e), a = Math.sin(e), o = Math.cos(e + t), s = Math.sin(e + t);
	return [
		{
			x: i - a * r,
			y: a + i * r
		},
		{
			x: o + s * r,
			y: s - o * r
		},
		{
			x: o,
			y: s
		}
	];
}
var Wt = (e, t, n, r) => {
	let i = e * r - t * n < 0 ? -1 : 1, a = e * n + t * r;
	return a > 1 && (a = 1), a < -1 && (a = -1), i * Math.acos(a);
}, Gt = (e, t, n, r, i, a, o, s, c, l, u, d, f) => {
	let p = i ** 2, m = a ** 2, h = u ** 2, g = d ** 2, _ = p * m - p * g - m * h;
	_ < 0 && (_ = 0), _ /= p * g + m * h, _ = Math.sqrt(_) * (o === s ? -1 : 1);
	let v = _ * i / a * d, y = _ * -a / i * u, b = l * v - c * y + (e + n) / 2, x = c * v + l * y + (t + r) / 2, S = (u - v) / i, C = (d - y) / a, w = (-u - v) / i, T = (-d - y) / a, E = Wt(1, 0, S, C), D = Wt(S, C, w, T);
	s === 0 && D > 0 && (D -= J), s === 1 && D < 0 && (D += J), f.centerX = b, f.centerY = x, f.ang1 = E, f.ang2 = D;
};
function Kt(e, t, n, r, i, a, o, s = 0, c = 0, l = 0) {
	if (a === 0 || o === 0) return;
	let u = Math.sin(s * J / 360), d = Math.cos(s * J / 360), f = d * (t - r) / 2 + u * (n - i) / 2, p = -u * (t - r) / 2 + d * (n - i) / 2;
	if (f === 0 && p === 0) return;
	a = Math.abs(a), o = Math.abs(o);
	let m = f ** 2 / a ** 2 + p ** 2 / o ** 2;
	m > 1 && (a *= Math.sqrt(m), o *= Math.sqrt(m)), Gt(t, n, r, i, a, o, c, l, u, d, f, p, Vt);
	let { ang1: h, ang2: g } = Vt, { centerX: _, centerY: v } = Vt, y = Math.abs(g) / (J / 4);
	Math.abs(1 - y) < 1e-7 && (y = 1);
	let b = Math.max(Math.ceil(y), 1);
	g /= b;
	let x = e[e.length - 2], S = e[e.length - 1], C = {
		x: 0,
		y: 0
	};
	for (let t = 0; t < b; t++) {
		let t = Ut(h, g), { x: n, y: r } = Ht(t[0], a, o, d, u, _, v, C), { x: i, y: s } = Ht(t[1], a, o, d, u, _, v, C), { x: c, y: l } = Ht(t[2], a, o, d, u, _, v, C);
		At(e, x, S, n, r, i, s, c, l), x = c, S = l, h += g;
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/path/roundShape.mjs
function qt(e, t, n) {
	let r = (e, t) => {
		let n = t.x - e.x, r = t.y - e.y, i = Math.sqrt(n * n + r * r);
		return {
			len: i,
			nx: n / i,
			ny: r / i
		};
	}, i = (t, n) => {
		t === 0 ? e.moveTo(n.x, n.y) : e.lineTo(n.x, n.y);
	}, a = t[t.length - 1];
	for (let o = 0; o < t.length; o++) {
		let s = t[o % t.length], c = s.radius ?? n;
		if (c <= 0) {
			i(o, s), a = s;
			continue;
		}
		let l = t[(o + 1) % t.length], u = r(s, a), d = r(s, l);
		if (u.len < 1e-4 || d.len < 1e-4) {
			i(o, s), a = s;
			continue;
		}
		let f = Math.asin(u.nx * d.ny - u.ny * d.nx), p = 1, m = !1;
		u.nx * d.nx - u.ny * -d.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, p = -1, m = !0) : f > 0 && (p = -1, m = !0);
		let h = f / 2, g, _ = Math.abs(Math.cos(h) * c / Math.sin(h));
		_ > Math.min(u.len / 2, d.len / 2) ? (_ = Math.min(u.len / 2, d.len / 2), g = Math.abs(_ * Math.sin(h) / Math.cos(h))) : g = c;
		let v = s.x + d.nx * _ + -d.ny * g * p, y = s.y + d.ny * _ + d.nx * g * p, b = Math.atan2(u.ny, u.nx) + Math.PI / 2 * p, x = Math.atan2(d.ny, d.nx) - Math.PI / 2 * p;
		o === 0 && e.moveTo(v + Math.cos(b) * g, y + Math.sin(b) * g), e.arc(v, y, g, b, x, m), a = s;
	}
}
function Jt(e, t, n, r) {
	let i = (e, t) => Math.sqrt((e.x - t.x) ** 2 + (e.y - t.y) ** 2), a = (e, t, n) => ({
		x: e.x + (t.x - e.x) * n,
		y: e.y + (t.y - e.y) * n
	}), o = t.length;
	for (let s = 0; s < o; s++) {
		let c = t[(s + 1) % o], l = c.radius ?? n;
		if (l <= 0) {
			s === 0 ? e.moveTo(c.x, c.y) : e.lineTo(c.x, c.y);
			continue;
		}
		let u = t[s], d = t[(s + 2) % o], f = i(u, c), p;
		p = f < 1e-4 ? c : a(c, u, Math.min(f / 2, l) / f);
		let m = i(d, c), h;
		h = m < 1e-4 ? c : a(c, d, Math.min(m / 2, l) / m), s === 0 ? e.moveTo(p.x, p.y) : e.lineTo(p.x, p.y), e.quadraticCurveTo(c.x, c.y, h.x, h.y, r);
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/path/ShapePath.mjs
var Yt = new n(), Xt = class {
	constructor(e) {
		this.shapePrimitives = [], this._currentPoly = null, this._bounds = new u(), this._graphicsPath2D = e, this.signed = e.checkForHoles;
	}
	/**
	* Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
	* @param x - The x-coordinate for the starting point.
	* @param y - The y-coordinate for the starting point.
	* @returns The instance of the current object for chaining.
	*/
	moveTo(e, t) {
		return this.startPoly(e, t), this;
	}
	/**
	* Connects the current point to a new point with a straight line. This method updates the current path.
	* @param x - The x-coordinate of the new point to connect to.
	* @param y - The y-coordinate of the new point to connect to.
	* @returns The instance of the current object for chaining.
	*/
	lineTo(e, t) {
		this._ensurePoly();
		let n = this._currentPoly.points, r = n[n.length - 2], i = n[n.length - 1];
		return (r !== e || i !== t) && n.push(e, t), this;
	}
	/**
	* Adds an arc to the path. The arc is centered at (x, y)
	*  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
	* @param x - The x-coordinate of the arc's center.
	* @param y - The y-coordinate of the arc's center.
	* @param radius - The radius of the arc.
	* @param startAngle - The starting angle of the arc, in radians.
	* @param endAngle - The ending angle of the arc, in radians.
	* @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
	* @returns The instance of the current object for chaining.
	*/
	arc(e, t, n, r, i, a) {
		this._ensurePoly(!1);
		let o = this._currentPoly.points;
		return zt(o, e, t, n, r, i, a), this;
	}
	/**
	* Adds an arc to the path with the arc tangent to the line joining two specified points.
	* The arc radius is specified by `radius`.
	* @param x1 - The x-coordinate of the first point.
	* @param y1 - The y-coordinate of the first point.
	* @param x2 - The x-coordinate of the second point.
	* @param y2 - The y-coordinate of the second point.
	* @param radius - The radius of the arc.
	* @returns The instance of the current object for chaining.
	*/
	arcTo(e, t, n, r, i) {
		this._ensurePoly();
		let a = this._currentPoly.points;
		return Bt(a, e, t, n, r, i), this;
	}
	/**
	* Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
	* @param rx - The x-radius of the ellipse.
	* @param ry - The y-radius of the ellipse.
	* @param xAxisRotation - The rotation of the ellipse's x-axis relative
	* to the x-axis of the coordinate system, in degrees.
	* @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
	* @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
	* @param x - The x-coordinate of the arc's end point.
	* @param y - The y-coordinate of the arc's end point.
	* @returns The instance of the current object for chaining.
	*/
	arcToSvg(e, t, n, r, i, a, o) {
		let s = this._currentPoly.points;
		return Kt(s, this._currentPoly.lastX, this._currentPoly.lastY, a, o, e, t, n, r, i), this;
	}
	/**
	* Adds a cubic Bezier curve to the path.
	* It requires three points: the first two are control points and the third one is the end point.
	* The starting point is the last point in the current path.
	* @param cp1x - The x-coordinate of the first control point.
	* @param cp1y - The y-coordinate of the first control point.
	* @param cp2x - The x-coordinate of the second control point.
	* @param cp2y - The y-coordinate of the second control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothness - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	bezierCurveTo(e, t, n, r, i, a, o) {
		this._ensurePoly();
		let s = this._currentPoly;
		return At(this._currentPoly.points, s.lastX, s.lastY, e, t, n, r, i, a, o), this;
	}
	/**
	* Adds a quadratic curve to the path. It requires two points: the control point and the end point.
	* The starting point is the last point in the current path.
	* @param cp1x - The x-coordinate of the control point.
	* @param cp1y - The y-coordinate of the control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothing - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	quadraticCurveTo(e, t, n, r, i) {
		this._ensurePoly();
		let a = this._currentPoly;
		return It(this._currentPoly.points, a.lastX, a.lastY, e, t, n, r, i), this;
	}
	/**
	* Closes the current path by drawing a straight line back to the start.
	* If the shape is already closed or there are no points in the path, this method does nothing.
	* @returns The instance of the current object for chaining.
	*/
	closePath() {
		return this.endPoly(!0), this;
	}
	/**
	* Adds another path to the current path. This method allows for the combination of multiple paths into one.
	* @param path - The `GraphicsPath` object representing the path to add.
	* @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
	* @returns The instance of the current object for chaining.
	*/
	addPath(e, t) {
		this.endPoly(), t && !t.isIdentity() && (e = e.clone(!0), e.transform(t));
		let n = this.shapePrimitives, r = n.length;
		for (let t = 0; t < e.instructions.length; t++) {
			let n = e.instructions[t];
			this[n.action](...n.data);
		}
		if (e.checkForHoles && n.length - r > 1) {
			let e = null;
			for (let t = r; t < n.length; t++) {
				let r = n[t];
				if (r.shape.type === "polygon") {
					let i = r.shape, a = e?.shape;
					a && a.containsPolygon(i) ? (e.holes || (e.holes = []), e.holes.push(r), n.copyWithin(t, t + 1), n.length--, t--) : e = r;
				}
			}
		}
		return this;
	}
	/**
	* Finalizes the drawing of the current path. Optionally, it can close the path.
	* @param closePath - A boolean indicating whether to close the path after finishing. False by default.
	*/
	finish(e = !1) {
		this.endPoly(e);
	}
	/**
	* Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
	* @param x - The x-coordinate of the top-left corner of the rectangle.
	* @param y - The y-coordinate of the top-left corner of the rectangle.
	* @param w - The width of the rectangle.
	* @param h - The height of the rectangle.
	* @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
	* @returns The instance of the current object for chaining.
	*/
	rect(e, t, r, i, a) {
		return this.drawShape(new n(e, t, r, i), a), this;
	}
	/**
	* Draws a circle shape. This method adds a new circle path to the current drawing.
	* @param x - The x-coordinate of the center of the circle.
	* @param y - The y-coordinate of the center of the circle.
	* @param radius - The radius of the circle.
	* @param transform - An optional `Matrix` object to apply a transformation to the circle.
	* @returns The instance of the current object for chaining.
	*/
	circle(e, t, n, r) {
		return this.drawShape(new Ie(e, t, n), r), this;
	}
	/**
	* Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
	* @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
	* representing the x and y coordinates of the polygon's vertices, in sequence.
	* @param close - A boolean indicating whether to close the polygon path. True by default.
	* @param transform - An optional `Matrix` object to apply a transformation to the polygon.
	* @returns The instance of the current object for chaining.
	*/
	poly(e, t, n) {
		let r = new He(e);
		return r.closePath = t, this.drawShape(r, n), this;
	}
	/**
	* Draws a regular polygon with a specified number of sides. All sides and angles are equal.
	* @param x - The x-coordinate of the center of the polygon.
	* @param y - The y-coordinate of the center of the polygon.
	* @param radius - The radius of the circumscribed circle of the polygon.
	* @param sides - The number of sides of the polygon. Must be 3 or more.
	* @param rotation - The rotation angle of the polygon, in radians. Zero by default.
	* @param transform - An optional `Matrix` object to apply a transformation to the polygon.
	* @returns The instance of the current object for chaining.
	*/
	regularPoly(e, t, n, r, i = 0, a) {
		r = Math.max(r | 0, 3);
		let o = -1 * Math.PI / 2 + i, s = Math.PI * 2 / r, c = [];
		for (let i = 0; i < r; i++) {
			let r = o - i * s;
			c.push(e + n * Math.cos(r), t + n * Math.sin(r));
		}
		return this.poly(c, !0, a), this;
	}
	/**
	* Draws a polygon with rounded corners.
	* Similar to `regularPoly` but with the ability to round the corners of the polygon.
	* @param x - The x-coordinate of the center of the polygon.
	* @param y - The y-coordinate of the center of the polygon.
	* @param radius - The radius of the circumscribed circle of the polygon.
	* @param sides - The number of sides of the polygon. Must be 3 or more.
	* @param corner - The radius of the rounding of the corners.
	* @param rotation - The rotation angle of the polygon, in radians. Zero by default.
	* @param smoothness - Optional parameter to adjust the smoothness of the rounding.
	* @returns The instance of the current object for chaining.
	*/
	roundPoly(e, t, n, r, i, a = 0, o) {
		if (r = Math.max(r | 0, 3), i <= 0) return this.regularPoly(e, t, n, r, a);
		let s = n * Math.sin(Math.PI / r) - .001;
		i = Math.min(i, s);
		let c = -1 * Math.PI / 2 + a, l = Math.PI * 2 / r, u = (r - 2) * Math.PI / r / 2;
		for (let a = 0; a < r; a++) {
			let r = a * l + c, s = e + n * Math.cos(r), d = t + n * Math.sin(r), f = r + Math.PI + u, p = r - Math.PI - u, m = s + i * Math.cos(f), h = d + i * Math.sin(f), g = s + i * Math.cos(p), _ = d + i * Math.sin(p);
			a === 0 ? this.moveTo(m, h) : this.lineTo(m, h), this.quadraticCurveTo(s, d, g, _, o);
		}
		return this.closePath();
	}
	/**
	* Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
	* Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
	* @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
	* A minimum of 3 points is required.
	* @param radius - The default radius for the corners.
	* This radius is applied to all corners unless overridden in `points`.
	* @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
	*  method instead of an arc method. Defaults to false.
	* @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
	* Higher values make the curve smoother.
	* @returns The instance of the current object for chaining.
	*/
	roundShape(e, t, n = !1, r) {
		return e.length < 3 ? this : (n ? Jt(this, e, t, r) : qt(this, e, t), this.closePath());
	}
	/**
	* Draw Rectangle with fillet corners. This is much like rounded rectangle
	* however it support negative numbers as well for the corner radius.
	* @param x - Upper left corner of rect
	* @param y - Upper right corner of rect
	* @param width - Width of rect
	* @param height - Height of rect
	* @param fillet - accept negative or positive values
	*/
	filletRect(e, t, n, r, i) {
		if (i === 0) return this.rect(e, t, n, r);
		let a = Math.min(n, r) / 2, o = Math.min(a, Math.max(-a, i)), s = e + n, c = t + r, l = o < 0 ? -o : 0, u = Math.abs(o);
		return this.moveTo(e, t + u).arcTo(e + l, t + l, e + u, t, u).lineTo(s - u, t).arcTo(s - l, t + l, s, t + u, u).lineTo(s, c - u).arcTo(s - l, c - l, e + n - u, c, u).lineTo(e + u, c).arcTo(e + l, c - l, e, c - u, u).closePath();
	}
	/**
	* Draw Rectangle with chamfer corners. These are angled corners.
	* @param x - Upper left corner of rect
	* @param y - Upper right corner of rect
	* @param width - Width of rect
	* @param height - Height of rect
	* @param chamfer - non-zero real number, size of corner cutout
	* @param transform
	*/
	chamferRect(e, t, n, r, i, a) {
		if (i <= 0) return this.rect(e, t, n, r);
		let o = Math.min(i, Math.min(n, r) / 2), s = e + n, c = t + r, l = [
			e + o,
			t,
			s - o,
			t,
			s,
			t + o,
			s,
			c - o,
			s - o,
			c,
			e + o,
			c,
			e,
			c - o,
			e,
			t + o
		];
		for (let e = l.length - 1; e >= 2; e -= 2) l[e] === l[e - 2] && l[e - 1] === l[e - 3] && l.splice(e - 1, 2);
		return this.poly(l, !0, a);
	}
	/**
	* Draws an ellipse at the specified location and with the given x and y radii.
	* An optional transformation can be applied, allowing for rotation, scaling, and translation.
	* @param x - The x-coordinate of the center of the ellipse.
	* @param y - The y-coordinate of the center of the ellipse.
	* @param radiusX - The horizontal radius of the ellipse.
	* @param radiusY - The vertical radius of the ellipse.
	* @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
	* @returns The instance of the current object for chaining.
	*/
	ellipse(e, t, n, r, i) {
		return this.drawShape(new Le(e, t, n, r), i), this;
	}
	/**
	* Draws a rectangle with rounded corners.
	* The corner radius can be specified to determine how rounded the corners should be.
	* An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
	* @param x - The x-coordinate of the top-left corner of the rectangle.
	* @param y - The y-coordinate of the top-left corner of the rectangle.
	* @param w - The width of the rectangle.
	* @param h - The height of the rectangle.
	* @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
	* @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
	* @returns The instance of the current object for chaining.
	*/
	roundRect(e, t, n, r, i, a) {
		return this.drawShape(new We(e, t, n, r, i), a), this;
	}
	/**
	* Draws a given shape on the canvas.
	* This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
	* An optional transformation matrix can be applied to the shape, allowing for complex transformations.
	* @param shape - The shape to draw, defined as a `ShapePrimitive` object.
	* @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
	* scaling, and translations.
	* @returns The instance of the current object for chaining.
	*/
	drawShape(e, t) {
		return this.endPoly(), this.shapePrimitives.push({
			shape: e,
			transform: t
		}), this;
	}
	/**
	* Starts a new polygon path from the specified starting point.
	* This method initializes a new polygon or ends the current one if it exists.
	* @param x - The x-coordinate of the starting point of the new polygon.
	* @param y - The y-coordinate of the starting point of the new polygon.
	* @returns The instance of the current object for chaining.
	*/
	startPoly(e, t) {
		let n = this._currentPoly;
		return n && this.endPoly(), n = new He(), n.points.push(e, t), this._currentPoly = n, this;
	}
	/**
	* Ends the current polygon path. If `closePath` is set to true,
	* the path is closed by connecting the last point to the first one.
	* This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
	* @param closePath - A boolean indicating whether to close the polygon by connecting the last point
	*  back to the starting point. False by default.
	* @returns The instance of the current object for chaining.
	*/
	endPoly(e = !1) {
		let t = this._currentPoly;
		return t && t.points.length > 2 && (t.closePath = e, this.shapePrimitives.push({ shape: t })), this._currentPoly = null, this;
	}
	_ensurePoly(e = !0) {
		if (!this._currentPoly && (this._currentPoly = new He(), e)) {
			let e = this.shapePrimitives[this.shapePrimitives.length - 1];
			if (e) {
				let t = e.shape.x, n = e.shape.y;
				if (e.transform && !e.transform.isIdentity()) {
					let r = e.transform, i = t;
					t = r.a * t + r.c * n + r.tx, n = r.b * i + r.d * n + r.ty;
				}
				this._currentPoly.points.push(t, n);
			} else this._currentPoly.points.push(0, 0);
		}
	}
	/** Builds the path. */
	buildPath() {
		let e = this._graphicsPath2D;
		this.shapePrimitives.length = 0, this._currentPoly = null;
		for (let t = 0; t < e.instructions.length; t++) {
			let n = e.instructions[t];
			this[n.action](...n.data);
		}
		this.finish();
	}
	/** Gets the bounds of the path. */
	get bounds() {
		let e = this._bounds;
		e.clear();
		let t = this.shapePrimitives;
		for (let n = 0; n < t.length; n++) {
			let r = t[n], i = r.shape.getBounds(Yt);
			r.transform ? e.addRect(i, r.transform) : e.addRect(i);
		}
		return e;
	}
}, Y = class t {
	/**
	* Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
	* @param instructions - An SVG path string or an array of `PathInstruction` objects.
	* @param signed
	*/
	constructor(e, t = !1) {
		this.instructions = [], this.uid = r("graphicsPath"), this._dirty = !0, this.checkForHoles = t, typeof e == "string" ? Fe(e, this) : this.instructions = e?.slice() ?? [];
	}
	/**
	* Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
	* @returns The `ShapePath` instance associated with this `GraphicsPath`.
	*/
	get shapePath() {
		return this._shapePath ||= new Xt(this), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
	}
	/**
	* Adds another `GraphicsPath` to this path, optionally applying a transformation.
	* @param path - The `GraphicsPath` to add.
	* @param transform - An optional transformation to apply to the added path.
	* @returns The instance of the current object for chaining.
	*/
	addPath(e, t) {
		return e = e.clone(), this.instructions.push({
			action: "addPath",
			data: [e, t]
		}), this._dirty = !0, this;
	}
	arc(...e) {
		return this.instructions.push({
			action: "arc",
			data: e
		}), this._dirty = !0, this;
	}
	arcTo(...e) {
		return this.instructions.push({
			action: "arcTo",
			data: e
		}), this._dirty = !0, this;
	}
	arcToSvg(...e) {
		return this.instructions.push({
			action: "arcToSvg",
			data: e
		}), this._dirty = !0, this;
	}
	bezierCurveTo(...e) {
		return this.instructions.push({
			action: "bezierCurveTo",
			data: e
		}), this._dirty = !0, this;
	}
	/**
	* Adds a cubic Bezier curve to the path.
	* It requires two points: the second control point and the end point. The first control point is assumed to be
	* The starting point is the last point in the current path.
	* @param cp2x - The x-coordinate of the second control point.
	* @param cp2y - The y-coordinate of the second control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothness - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	bezierCurveToShort(t, n, r, i, a) {
		let o = this.instructions[this.instructions.length - 1], s = this.getLastPoint(e.shared), c = 0, l = 0;
		if (!o || o.action !== "bezierCurveTo") c = s.x, l = s.y;
		else {
			c = o.data[2], l = o.data[3];
			let e = s.x, t = s.y;
			c = e + (e - c), l = t + (t - l);
		}
		return this.instructions.push({
			action: "bezierCurveTo",
			data: [
				c,
				l,
				t,
				n,
				r,
				i,
				a
			]
		}), this._dirty = !0, this;
	}
	/**
	* Closes the current path by drawing a straight line back to the start.
	* If the shape is already closed or there are no points in the path, this method does nothing.
	* @returns The instance of the current object for chaining.
	*/
	closePath() {
		return this.instructions.push({
			action: "closePath",
			data: []
		}), this._dirty = !0, this;
	}
	ellipse(...e) {
		return this.instructions.push({
			action: "ellipse",
			data: e
		}), this._dirty = !0, this;
	}
	lineTo(...e) {
		return this.instructions.push({
			action: "lineTo",
			data: e
		}), this._dirty = !0, this;
	}
	moveTo(...e) {
		return this.instructions.push({
			action: "moveTo",
			data: e
		}), this;
	}
	quadraticCurveTo(...e) {
		return this.instructions.push({
			action: "quadraticCurveTo",
			data: e
		}), this._dirty = !0, this;
	}
	/**
	* Adds a quadratic curve to the path. It uses the previous point as the control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothness - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	quadraticCurveToShort(t, n, r) {
		let i = this.instructions[this.instructions.length - 1], a = this.getLastPoint(e.shared), o = 0, s = 0;
		if (!i || i.action !== "quadraticCurveTo") o = a.x, s = a.y;
		else {
			o = i.data[0], s = i.data[1];
			let e = a.x, t = a.y;
			o = e + (e - o), s = t + (t - s);
		}
		return this.instructions.push({
			action: "quadraticCurveTo",
			data: [
				o,
				s,
				t,
				n,
				r
			]
		}), this._dirty = !0, this;
	}
	/**
	* Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
	* @param x - The x-coordinate of the top-left corner of the rectangle.
	* @param y - The y-coordinate of the top-left corner of the rectangle.
	* @param w - The width of the rectangle.
	* @param h - The height of the rectangle.
	* @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
	* @returns The instance of the current object for chaining.
	*/
	rect(e, t, n, r, i) {
		return this.instructions.push({
			action: "rect",
			data: [
				e,
				t,
				n,
				r,
				i
			]
		}), this._dirty = !0, this;
	}
	/**
	* Draws a circle shape. This method adds a new circle path to the current drawing.
	* @param x - The x-coordinate of the center of the circle.
	* @param y - The y-coordinate of the center of the circle.
	* @param radius - The radius of the circle.
	* @param transform - An optional `Matrix` object to apply a transformation to the circle.
	* @returns The instance of the current object for chaining.
	*/
	circle(e, t, n, r) {
		return this.instructions.push({
			action: "circle",
			data: [
				e,
				t,
				n,
				r
			]
		}), this._dirty = !0, this;
	}
	roundRect(...e) {
		return this.instructions.push({
			action: "roundRect",
			data: e
		}), this._dirty = !0, this;
	}
	poly(...e) {
		return this.instructions.push({
			action: "poly",
			data: e
		}), this._dirty = !0, this;
	}
	regularPoly(...e) {
		return this.instructions.push({
			action: "regularPoly",
			data: e
		}), this._dirty = !0, this;
	}
	roundPoly(...e) {
		return this.instructions.push({
			action: "roundPoly",
			data: e
		}), this._dirty = !0, this;
	}
	roundShape(...e) {
		return this.instructions.push({
			action: "roundShape",
			data: e
		}), this._dirty = !0, this;
	}
	filletRect(...e) {
		return this.instructions.push({
			action: "filletRect",
			data: e
		}), this._dirty = !0, this;
	}
	chamferRect(...e) {
		return this.instructions.push({
			action: "chamferRect",
			data: e
		}), this._dirty = !0, this;
	}
	/**
	* Draws a star shape centered at a specified location. This method allows for the creation
	*  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
	* The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
	* An optional transformation can be applied to scale, rotate, or translate the star as needed.
	* @param x - The x-coordinate of the center of the star.
	* @param y - The y-coordinate of the center of the star.
	* @param points - The number of points of the star.
	* @param radius - The outer radius of the star (distance from the center to the outer points).
	* @param innerRadius - Optional. The inner radius of the star
	* (distance from the center to the inner points between the outer points).
	* If not provided, defaults to half of the `radius`.
	* @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
	* Defaults to 0, meaning one point is directly upward.
	* @param transform - An optional `Matrix` object to apply a transformation to the star.
	* This can include rotations, scaling, and translations.
	* @returns The instance of the current object for chaining further drawing commands.
	*/
	star(e, t, n, r, i, a, o) {
		i ||= r / 2;
		let s = -1 * Math.PI / 2 + a, c = n * 2, l = Math.PI * 2 / c, u = [];
		for (let n = 0; n < c; n++) {
			let a = n % 2 ? i : r, o = n * l + s;
			u.push(e + a * Math.cos(o), t + a * Math.sin(o));
		}
		return this.poly(u, !0, o), this;
	}
	/**
	* Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
	* A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
	* copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
	* do not affect the original `GraphicsPath` and vice versa.
	* @param deep - A boolean flag indicating whether the clone should be deep.
	* @returns A new `GraphicsPath` instance that is a clone of the current instance.
	*/
	clone(e = !1) {
		let n = new t();
		if (n.checkForHoles = this.checkForHoles, !e) n.instructions = this.instructions.slice();
		else for (let e = 0; e < this.instructions.length; e++) {
			let t = this.instructions[e];
			n.instructions.push({
				action: t.action,
				data: t.data.slice()
			});
		}
		return n;
	}
	clear() {
		return this.instructions.length = 0, this._dirty = !0, this;
	}
	/**
	* Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
	* This method enables the modification of the path's geometry according to the provided
	* transformation matrix, which can include translations, rotations, scaling, and skewing.
	*
	* Each drawing instruction in the path is updated to reflect the transformation,
	* ensuring the visual representation of the path is consistent with the applied matrix.
	*
	* Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
	* not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
	* allowing for fine-grained control over the path's appearance.
	* @param matrix - A `Matrix` object representing the transformation to apply.
	* @returns The instance of the current object for chaining further operations.
	*/
	transform(e) {
		if (e.isIdentity()) return this;
		let t = e.a, n = e.b, r = e.c, i = e.d, a = e.tx, o = e.ty, s = 0, c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, h = 0;
		for (let g = 0; g < this.instructions.length; g++) {
			let _ = this.instructions[g], v = _.data;
			switch (_.action) {
				case "moveTo":
				case "lineTo":
					s = v[0], c = v[1], v[0] = t * s + r * c + a, v[1] = n * s + i * c + o;
					break;
				case "bezierCurveTo":
					l = v[0], u = v[1], d = v[2], f = v[3], s = v[4], c = v[5], v[0] = t * l + r * u + a, v[1] = n * l + i * u + o, v[2] = t * d + r * f + a, v[3] = n * d + i * f + o, v[4] = t * s + r * c + a, v[5] = n * s + i * c + o;
					break;
				case "quadraticCurveTo":
					l = v[0], u = v[1], s = v[2], c = v[3], v[0] = t * l + r * u + a, v[1] = n * l + i * u + o, v[2] = t * s + r * c + a, v[3] = n * s + i * c + o;
					break;
				case "arcToSvg":
					s = v[5], c = v[6], p = v[0], h = v[1], v[0] = t * p + r * h, v[1] = n * p + i * h, v[5] = t * s + r * c + a, v[6] = n * s + i * c + o;
					break;
				case "circle":
					v[4] = X(v[3], e);
					break;
				case "rect":
					v[4] = X(v[4], e);
					break;
				case "ellipse":
					v[8] = X(v[8], e);
					break;
				case "roundRect":
					v[5] = X(v[5], e);
					break;
				case "addPath":
					v[0].transform(e);
					break;
				case "poly":
					v[2] = X(v[2], e);
					break;
				case "regularPoly":
				case "chamferRect":
					v[5] = X(v[5], e);
					break;
				case "closePath": break;
				default: m("unknown transform action", _.action);
			}
		}
		return this._dirty = !0, this;
	}
	get bounds() {
		return this.shapePath.bounds;
	}
	/**
	* Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
	* This method is useful for operations that depend on the path's current endpoint,
	* such as connecting subsequent shapes or paths. It supports various drawing instructions,
	* ensuring the last point's position is accurately determined regardless of the path's complexity.
	*
	* If the last instruction is a `closePath`, the method iterates backward through the instructions
	*  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
	* `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
	* the last point from the nested path.
	* @param out - A `Point` object where the last point's coordinates will be stored.
	* This object is modified directly to contain the result.
	* @returns The `Point` object containing the last point's coordinates.
	*/
	getLastPoint(e) {
		let t = this.instructions.length - 1, n = this.instructions[t];
		if (!n) return e.x = 0, e.y = 0, e;
		for (; n.action === "closePath";) {
			if (t--, t < 0) return e.x = 0, e.y = 0, e;
			n = this.instructions[t];
		}
		switch (n.action) {
			case "moveTo":
			case "lineTo":
				e.x = n.data[0], e.y = n.data[1];
				break;
			case "quadraticCurveTo":
				e.x = n.data[2], e.y = n.data[3];
				break;
			case "bezierCurveTo":
				e.x = n.data[4], e.y = n.data[5];
				break;
			case "arc":
			case "arcToSvg":
				e.x = n.data[5], e.y = n.data[6];
				break;
			case "addPath": n.data[0].getLastPoint(e);
		}
		return e;
	}
};
function X(e, t) {
	return e ? e.prepend(t) : t.clone();
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGFloatAttribute.mjs
function Z(e, t, n) {
	let r = e.getAttribute(t);
	return r ? Number(r) : n;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGDefinitions.mjs
function Zt(e, t) {
	let n = e.querySelectorAll("defs");
	for (let e = 0; e < n.length; e++) {
		let r = n[e];
		for (let e = 0; e < r.children.length; e++) {
			let n = r.children[e];
			switch (n.nodeName.toLowerCase()) {
				case "lineargradient":
					t.defs[n.id] = en(n);
					break;
				case "radialgradient": t.defs[n.id] = tn(n);
			}
		}
	}
}
function Q(e, t, n) {
	let r = e.getAttribute(t);
	if (r?.trim().endsWith("%")) {
		let e = Number(r.trim().slice(0, -1));
		return Number.isNaN(e) ? n : e / 100;
	}
	return Z(e, t, n);
}
function Qt(e) {
	return (e.getAttribute("gradientUnits") || "objectBoundingBox") === "objectBoundingBox" ? "local" : "global";
}
function $t(e) {
	let t = [];
	for (let n = 0; n < e.children.length; n++) {
		let r = e.children[n], i = Q(r, "offset", 0), a = _.shared.setValue(r.getAttribute("stop-color")).toNumber();
		t.push({
			offset: i,
			color: a
		});
	}
	return t;
}
function en(e) {
	let t = Q(e, "x1", 0), n = Q(e, "y1", 0), r = Q(e, "x2", 1), i = Q(e, "y2", 0);
	return new K({
		type: "linear",
		start: {
			x: t,
			y: n
		},
		end: {
			x: r,
			y: i
		},
		textureSpace: Qt(e),
		colorStops: $t(e)
	});
}
function tn(e) {
	let t = Q(e, "cx", .5), n = Q(e, "cy", .5), r = Q(e, "r", .5), i = Q(e, "fx", t), a = Q(e, "fy", n), o = Q(e, "fr", 0);
	return new K({
		type: "radial",
		center: {
			x: i,
			y: a
		},
		innerRadius: o,
		outerCenter: {
			x: t,
			y: n
		},
		outerRadius: r,
		textureSpace: Qt(e),
		colorStops: $t(e)
	});
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/extractSvgUrlId.mjs
function nn(e) {
	let t = e.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
	return t ? t[1] : "";
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/parseSVGStyle.mjs
var rn = {
	fill: {
		type: "paint",
		default: 0
	},
	"fill-opacity": {
		type: "number",
		default: 1
	},
	stroke: {
		type: "paint",
		default: 0
	},
	"stroke-width": {
		type: "number",
		default: 1
	},
	"stroke-opacity": {
		type: "number",
		default: 1
	},
	"stroke-linecap": {
		type: "string",
		default: "butt"
	},
	"stroke-linejoin": {
		type: "string",
		default: "miter"
	},
	"stroke-miterlimit": {
		type: "number",
		default: 10
	},
	"stroke-dasharray": {
		type: "string",
		default: "none"
	},
	"stroke-dashoffset": {
		type: "number",
		default: 0
	},
	opacity: {
		type: "number",
		default: 1
	}
};
function an(e, t) {
	let n = e.getAttribute("style"), r = {}, i = {}, a = {
		strokeStyle: r,
		fillStyle: i,
		useFill: !1,
		useStroke: !1
	};
	for (let n in rn) {
		let r = e.getAttribute(n);
		r && on(t, a, n, r.trim());
	}
	if (n) {
		let e = n.split(";");
		for (let n = 0; n < e.length; n++) {
			let [r, i] = e[n].trim().split(":");
			rn[r] && on(t, a, r, i.trim());
		}
	}
	return {
		strokeStyle: a.useStroke ? r : null,
		fillStyle: a.useFill ? i : null,
		useFill: a.useFill,
		useStroke: a.useStroke
	};
}
function on(e, t, n, r) {
	switch (n) {
		case "stroke":
			if (r !== "none") {
				if (r.startsWith("url(")) {
					let n = nn(r);
					t.strokeStyle.fill = e.defs[n];
				} else t.strokeStyle.color = _.shared.setValue(r).toNumber();
				t.useStroke = !0;
			}
			break;
		case "stroke-width":
			t.strokeStyle.width = Number(r);
			break;
		case "fill":
			if (r !== "none") {
				if (r.startsWith("url(")) {
					let n = nn(r);
					t.fillStyle.fill = e.defs[n];
				} else t.fillStyle.color = _.shared.setValue(r).toNumber();
				t.useFill = !0;
			}
			break;
		case "fill-opacity":
			t.fillStyle.alpha = Number(r);
			break;
		case "stroke-opacity":
			t.strokeStyle.alpha = Number(r);
			break;
		case "opacity": t.fillStyle.alpha = Number(r), t.strokeStyle.alpha = Number(r);
	}
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/fillOperations.mjs
function sn(e) {
	if (e.length <= 2) return !0;
	let t = e.map((e) => e.area).sort((e, t) => t - e), [n, r] = t, i = t[t.length - 1], a = n / r, o = r / i;
	return !(a > 3 && o < 2);
}
function cn(e, t = 0) {
	let n = e.instructions[t];
	if (!n || n.action !== "fill") throw Error(`Expected fill instruction at index ${t}, got ${n?.action || "undefined"}`);
	return n.data;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/utils/pathOperations.mjs
function ln(e) {
	return e.split(/(?=[Mm])/).filter((e) => e.trim().length > 0);
}
function un(e) {
	let t = e.match(/[-+]?[0-9]*\.?[0-9]+/g);
	if (!t || t.length < 4) return 0;
	let n = t.map(Number), r = [], i = [];
	for (let e = 0; e < n.length; e += 2) e + 1 < n.length && (r.push(n[e]), i.push(n[e + 1]));
	if (r.length === 0 || i.length === 0) return 0;
	let a = Math.min(...r), o = Math.max(...r), s = Math.min(...i), c = Math.max(...i);
	return (o - a) * (c - s);
}
function dn(e, t) {
	let n = new Y(e, !1);
	for (let e of n.instructions) t.instructions.push(e);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/svg/SVGParser.mjs
function fn(e, t) {
	if (typeof e == "string") {
		let t = document.createElement("div");
		t.innerHTML = e.trim(), e = t.querySelector("svg");
	}
	let n = {
		context: t,
		defs: {},
		path: new Y()
	};
	Zt(e, n);
	let r = e.children, { fillStyle: i, strokeStyle: a } = an(e, n);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		t.nodeName.toLowerCase() !== "defs" && pn(t, n, i, a);
	}
	return t;
}
function pn(e, t, n, r) {
	let i = e.children, { fillStyle: a, strokeStyle: o } = an(e, t);
	a && n ? n = {
		...n,
		...a
	} : a && (n = a), o && r ? r = {
		...r,
		...o
	} : o && (r = o);
	let s = !n && !r;
	s && (n = { color: 0 });
	let c, l, u, d, f, p, h, g, _, v, y, b, x, S, C, w, T;
	switch (e.nodeName.toLowerCase()) {
		case "path": {
			S = e.getAttribute("d");
			let i = e.getAttribute("fill-rule"), a = ln(S), o = i === "evenodd", s = a.length > 1;
			if (o && s) {
				let e = a.map((e) => ({
					path: e,
					area: un(e)
				}));
				if (e.sort((e, t) => t.area - e.area), a.length > 3 || !sn(e)) for (let i = 0; i < e.length; i++) {
					let a = e[i], o = i === 0;
					t.context.beginPath();
					let s = new Y(void 0, !0);
					dn(a.path, s), t.context.path(s), o ? (n && t.context.fill(n), r && t.context.stroke(r)) : t.context.cut();
				}
				else for (let i = 0; i < e.length; i++) {
					let a = e[i], o = i % 2 == 1;
					t.context.beginPath();
					let s = new Y(void 0, !0);
					dn(a.path, s), t.context.path(s), o ? t.context.cut() : (n && t.context.fill(n), r && t.context.stroke(r));
				}
			} else C = new Y(S, !i || i === "evenodd"), t.context.path(C), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		}
		case "circle":
			h = Z(e, "cx", 0), g = Z(e, "cy", 0), _ = Z(e, "r", 0), t.context.ellipse(h, g, _, _), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "rect":
			c = Z(e, "x", 0), l = Z(e, "y", 0), w = Z(e, "width", 0), T = Z(e, "height", 0), v = Z(e, "rx", 0), y = Z(e, "ry", 0), v || y ? t.context.roundRect(c, l, w, T, v || y) : t.context.rect(c, l, w, T), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "ellipse":
			h = Z(e, "cx", 0), g = Z(e, "cy", 0), v = Z(e, "rx", 0), y = Z(e, "ry", 0), t.context.beginPath(), t.context.ellipse(h, g, v, y), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "line":
			u = Z(e, "x1", 0), d = Z(e, "y1", 0), f = Z(e, "x2", 0), p = Z(e, "y2", 0), t.context.beginPath(), t.context.moveTo(u, d), t.context.lineTo(f, p), r && t.context.stroke(r);
			break;
		case "polygon":
			x = e.getAttribute("points"), b = x.match(/-?\d+/g).map((e) => parseInt(e, 10)), t.context.poly(b, !0), n && t.context.fill(n), r && t.context.stroke(r);
			break;
		case "polyline":
			x = e.getAttribute("points"), b = x.match(/-?\d+/g).map((e) => parseInt(e, 10)), t.context.poly(b, !1), r && t.context.stroke(r);
			break;
		case "g":
		case "svg": break;
		default: m(`[SVG parser] <${e.nodeName}> elements unsupported`);
	}
	s && (n = null);
	for (let e = 0; e < i.length; e++) pn(i[e], t, n, r);
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/fill/FillPattern.mjs
function mn(e) {
	return e.texture !== void 0;
}
var hn = {
	repeat: {
		addressModeU: "repeat",
		addressModeV: "repeat"
	},
	"repeat-x": {
		addressModeU: "repeat",
		addressModeV: "clamp-to-edge"
	},
	"repeat-y": {
		addressModeU: "clamp-to-edge",
		addressModeV: "repeat"
	},
	"no-repeat": {
		addressModeU: "clamp-to-edge",
		addressModeV: "clamp-to-edge"
	}
}, gn = class {
	constructor(e, t) {
		/** The transform matrix applied to the pattern */
		this.uid = r("fillPattern"), this._tick = 0, this.transform = new p();
		let n = mn(e) ? e : {
			texture: e,
			repetition: t
		};
		this.texture = n.texture, this.textureSpace = n.textureSpace ?? "global";
		let i = n.repetition;
		i && (this.texture.source.style.addressModeU = hn[i].addressModeU, this.texture.source.style.addressModeV = hn[i].addressModeV);
	}
	/**
	* Sets the transform for the pattern
	* @param transform - The transform matrix to apply to the pattern.
	* If not provided, the pattern will use the default transform.
	*/
	setTransform(e) {
		if (e) {
			if (this.transform.equals(e)) return;
			this.transform.copyFrom(e);
		} else {
			if (this.transform.isIdentity()) return;
			this.transform.identity();
		}
		this._tick++;
	}
	/** Internal texture used to render the gradient */
	get texture() {
		return this._texture;
	}
	set texture(e) {
		this._texture !== e && (this._texture = e, this._tick++);
	}
	/**
	* Returns a unique key for this instance.
	* This key is used for caching.
	* @returns {string} Unique key for the instance
	*/
	get styleKey() {
		return `fill-pattern-${this.uid}-${this._tick}`;
	}
	/** Destroys the fill pattern, releasing resources. This will also destroy the internal texture. */
	destroy() {
		this.texture.destroy(!0), this.texture = null;
	}
};
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/utils/convertFillInputToFillStyle.mjs
function _n(e) {
	return _.isColorLike(e);
}
function vn(e) {
	return e instanceof gn;
}
function yn(e) {
	return e instanceof K;
}
function bn(e) {
	return e instanceof d;
}
function xn(e, t, n) {
	let r = _.shared.setValue(t ?? 0);
	return e.color = r.toNumber(), e.alpha = r.alpha === 1 ? n.alpha : r.alpha, e.texture = d.WHITE, {
		...n,
		...e
	};
}
function Sn(e, t, n) {
	return e.texture = t, {
		...n,
		...e
	};
}
function Cn(e, t, n) {
	return e.fill = t, e.color = 16777215, e.texture = t.texture, e.matrix = t.transform, e.textureSpace = t.textureSpace, {
		...n,
		...e
	};
}
function wn(e, t, n) {
	return t.buildGradient(), e.fill = t, e.color = 16777215, e.texture = t.texture, e.matrix = t.transform, e.textureSpace = t.textureSpace, {
		...n,
		...e
	};
}
function Tn(e, t) {
	let n = {
		...t,
		...e
	}, r = _.shared.setValue(n.color);
	return n.alpha *= r.alpha, n.color = r.toNumber(), n;
}
function $(e, t) {
	if (e == null) return null;
	let n = {}, r = e;
	return _n(e) ? xn(n, e, t) : bn(e) ? Sn(n, e, t) : vn(e) ? Cn(n, e, t) : yn(e) ? wn(n, e, t) : r.fill && vn(r.fill) ? Cn(r, r.fill, t) : r.fill && yn(r.fill) ? wn(r, r.fill, t) : Tn(r, t);
}
function En(e, t) {
	let { width: n, alignment: r, miterLimit: i, cap: a, join: o, pixelLine: s, ...c } = t, l = $(e, c);
	return l ? {
		width: n,
		alignment: r,
		miterLimit: i,
		cap: a,
		join: o,
		pixelLine: s,
		...l
	} : null;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/utils/getMaxMiterRatio.mjs
function Dn(e, t) {
	let n = 1, r = e.shapePath.shapePrimitives;
	for (let e = 0; e < r.length; e++) {
		let i = r[e].shape;
		if (i.type !== "polygon") continue;
		let a = i.points, o = a.length;
		if (o < 6) continue;
		let s = i.closePath;
		for (let e = 0; e < o; e += 2) {
			if (!s && (e === 0 || e === o - 2)) continue;
			let r = (e - 2 + o) % o, i = (e + 2) % o, c = a[r], l = a[r + 1], u = a[e], d = a[e + 1], f = a[i], p = a[i + 1], m = c - u, h = l - d, g = f - u, _ = p - d, v = m * m + h * h, y = g * g + _ * _;
			if (v < 1e-12 || y < 1e-12) continue;
			let b = (m * g + h * _) / Math.sqrt(v * y);
			b < -1 ? b = -1 : b > 1 && (b = 1);
			let x = Math.sqrt((1 - b) * .5);
			if (x < 1e-6) continue;
			let S = Math.min(1 / x, t);
			S > n && (n = S);
		}
	}
	return n;
}
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/shared/GraphicsContext.mjs
var On = new e(), kn = new p(), An = class n extends o {
	constructor() {
		super(...arguments), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = r("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this.destroyed = !1, this._activePath = new Y(), this._transform = new p(), this._fillStyle = { ...n.defaultFillStyle }, this._strokeStyle = { ...n.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new u(), this._boundsDirty = !0;
	}
	/**
	* Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
	* including the current drawing state, transformations, styles, and instructions.
	* @returns A new GraphicsContext instance with the same properties and state as this one.
	*/
	clone() {
		let e = new n();
		return e.batchMode = this.batchMode, e.instructions = this.instructions.slice(), e._activePath = this._activePath.clone(), e._transform = this._transform.clone(), e._fillStyle = { ...this._fillStyle }, e._strokeStyle = { ...this._strokeStyle }, e._stateStack = this._stateStack.slice(), e._bounds = this._bounds.clone(), e._boundsDirty = !0, e;
	}
	/**
	* The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
	*/
	get fillStyle() {
		return this._fillStyle;
	}
	set fillStyle(e) {
		this._fillStyle = $(e, n.defaultFillStyle);
	}
	/**
	* The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
	*/
	get strokeStyle() {
		return this._strokeStyle;
	}
	set strokeStyle(e) {
		this._strokeStyle = En(e, n.defaultStrokeStyle);
	}
	/**
	* Sets the current fill style of the graphics context. The fill style can be a color, gradient,
	* pattern, or a more complex style defined by a FillStyle object.
	* @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
	*                or a FillStyle or ConvertedFillStyle object.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	setFillStyle(e) {
		return this._fillStyle = $(e, n.defaultFillStyle), this;
	}
	/**
	* Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
	* encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
	* @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
	*                or a StrokeStyle or ConvertedStrokeStyle object.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	setStrokeStyle(e) {
		return this._strokeStyle = $(e, n.defaultStrokeStyle), this;
	}
	texture(e, t, n, r, i, a) {
		return this.instructions.push({
			action: "texture",
			data: {
				image: e,
				dx: n || 0,
				dy: r || 0,
				dw: i || e.frame.width,
				dh: a || e.frame.height,
				transform: this._transform.clone(),
				alpha: this._fillStyle.alpha,
				style: t || t === 0 ? _.shared.setValue(t).toNumber() : 16777215
			}
		}), this.onUpdate(), this;
	}
	/**
	* Resets the current path. Any previous path and its commands are discarded and a new path is
	* started. This is typically called before beginning a new shape or series of drawing commands.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	beginPath() {
		return this._activePath = new Y(), this;
	}
	fill(e, r) {
		let i, a = this.instructions[this.instructions.length - 1];
		return i = this._tick === 0 && a?.action === "stroke" ? a.data.path : this._activePath.clone(), i ? (e != null && (r !== void 0 && typeof e == "number" && (s(t, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), e = {
			color: e,
			alpha: r
		}), this._fillStyle = $(e, n.defaultFillStyle)), this.instructions.push({
			action: "fill",
			data: {
				style: this.fillStyle,
				path: i
			}
		}), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
	}
	_initNextPathLocation() {
		let { x: t, y: n } = this._activePath.getLastPoint(e.shared);
		this._activePath.clear(), this._activePath.moveTo(t, n);
	}
	/**
	* Strokes the current path with the current stroke style. This method can take an optional
	* FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
	* @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	stroke(e) {
		let t, r = this.instructions[this.instructions.length - 1];
		return t = this._tick === 0 && r?.action === "fill" ? r.data.path : this._activePath.clone(), t ? (e != null && (this._strokeStyle = En(e, n.defaultStrokeStyle)), this.instructions.push({
			action: "stroke",
			data: {
				style: this.strokeStyle,
				path: t
			}
		}), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
	}
	/**
	* Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
	* subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
	* fail to cut correctly!
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	cut() {
		for (let e = 0; e < 2; e++) {
			let t = this.instructions[this.instructions.length - 1 - e], n = this._activePath.clone();
			if (t && (t.action === "stroke" || t.action === "fill")) {
				if (t.data.hole) t.data.hole.addPath(n);
				else {
					t.data.hole = n;
					break;
				}
			}
		}
		return this._initNextPathLocation(), this;
	}
	/**
	* Adds an arc to the current path, which is centered at (x, y) with the specified radius,
	* starting and ending angles, and direction.
	* @param x - The x-coordinate of the arc's center.
	* @param y - The y-coordinate of the arc's center.
	* @param radius - The arc's radius.
	* @param startAngle - The starting angle, in radians.
	* @param endAngle - The ending angle, in radians.
	* @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	arc(e, t, n, r, i, a) {
		this._tick++;
		let o = this._transform;
		return this._activePath.arc(o.a * e + o.c * t + o.tx, o.b * e + o.d * t + o.ty, n, r, i, a), this;
	}
	/**
	* Adds an arc to the current path with the given control points and radius, connected to the previous point
	* by a straight line if necessary.
	* @param x1 - The x-coordinate of the first control point.
	* @param y1 - The y-coordinate of the first control point.
	* @param x2 - The x-coordinate of the second control point.
	* @param y2 - The y-coordinate of the second control point.
	* @param radius - The arc's radius.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	arcTo(e, t, n, r, i) {
		this._tick++;
		let a = this._transform;
		return this._activePath.arcTo(a.a * e + a.c * t + a.tx, a.b * e + a.d * t + a.ty, a.a * n + a.c * r + a.tx, a.b * n + a.d * r + a.ty, i), this;
	}
	/**
	* Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
	* @param rx - The x-radius of the ellipse.
	* @param ry - The y-radius of the ellipse.
	* @param xAxisRotation - The rotation of the ellipse's x-axis relative
	* to the x-axis of the coordinate system, in degrees.
	* @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
	* @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
	* @param x - The x-coordinate of the arc's end point.
	* @param y - The y-coordinate of the arc's end point.
	* @returns The instance of the current object for chaining.
	*/
	arcToSvg(e, t, n, r, i, a, o) {
		this._tick++;
		let s = this._transform;
		return this._activePath.arcToSvg(e, t, n, r, i, s.a * a + s.c * o + s.tx, s.b * a + s.d * o + s.ty), this;
	}
	/**
	* Adds a cubic Bezier curve to the path.
	* It requires three points: the first two are control points and the third one is the end point.
	* The starting point is the last point in the current path.
	* @param cp1x - The x-coordinate of the first control point.
	* @param cp1y - The y-coordinate of the first control point.
	* @param cp2x - The x-coordinate of the second control point.
	* @param cp2y - The y-coordinate of the second control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothness - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	bezierCurveTo(e, t, n, r, i, a, o) {
		this._tick++;
		let s = this._transform;
		return this._activePath.bezierCurveTo(s.a * e + s.c * t + s.tx, s.b * e + s.d * t + s.ty, s.a * n + s.c * r + s.tx, s.b * n + s.d * r + s.ty, s.a * i + s.c * a + s.tx, s.b * i + s.d * a + s.ty, o), this;
	}
	/**
	* Closes the current path by drawing a straight line back to the start.
	* If the shape is already closed or there are no points in the path, this method does nothing.
	* @returns The instance of the current object for chaining.
	*/
	closePath() {
		return this._tick++, this._activePath?.closePath(), this;
	}
	/**
	* Draws an ellipse at the specified location and with the given x and y radii.
	* An optional transformation can be applied, allowing for rotation, scaling, and translation.
	* @param x - The x-coordinate of the center of the ellipse.
	* @param y - The y-coordinate of the center of the ellipse.
	* @param radiusX - The horizontal radius of the ellipse.
	* @param radiusY - The vertical radius of the ellipse.
	* @returns The instance of the current object for chaining.
	*/
	ellipse(e, t, n, r) {
		return this._tick++, this._activePath.ellipse(e, t, n, r, this._transform.clone()), this;
	}
	/**
	* Draws a circle shape. This method adds a new circle path to the current drawing.
	* @param x - The x-coordinate of the center of the circle.
	* @param y - The y-coordinate of the center of the circle.
	* @param radius - The radius of the circle.
	* @returns The instance of the current object for chaining.
	*/
	circle(e, t, n) {
		return this._tick++, this._activePath.circle(e, t, n, this._transform.clone()), this;
	}
	/**
	* Adds another `GraphicsPath` to this path, optionally applying a transformation.
	* @param path - The `GraphicsPath` to add.
	* @returns The instance of the current object for chaining.
	*/
	path(e) {
		return this._tick++, this._activePath.addPath(e, this._transform.clone()), this;
	}
	/**
	* Connects the current point to a new point with a straight line. This method updates the current path.
	* @param x - The x-coordinate of the new point to connect to.
	* @param y - The y-coordinate of the new point to connect to.
	* @returns The instance of the current object for chaining.
	*/
	lineTo(e, t) {
		this._tick++;
		let n = this._transform;
		return this._activePath.lineTo(n.a * e + n.c * t + n.tx, n.b * e + n.d * t + n.ty), this;
	}
	/**
	* Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
	* @param x - The x-coordinate for the starting point.
	* @param y - The y-coordinate for the starting point.
	* @returns The instance of the current object for chaining.
	*/
	moveTo(e, t) {
		this._tick++;
		let n = this._transform, r = this._activePath.instructions, i = n.a * e + n.c * t + n.tx, a = n.b * e + n.d * t + n.ty;
		return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = i, r[0].data[1] = a, this) : (this._activePath.moveTo(i, a), this);
	}
	/**
	* Adds a quadratic curve to the path. It requires two points: the control point and the end point.
	* The starting point is the last point in the current path.
	* @param cpx - The x-coordinate of the control point.
	* @param cpy - The y-coordinate of the control point.
	* @param x - The x-coordinate of the end point.
	* @param y - The y-coordinate of the end point.
	* @param smoothness - Optional parameter to adjust the smoothness of the curve.
	* @returns The instance of the current object for chaining.
	*/
	quadraticCurveTo(e, t, n, r, i) {
		this._tick++;
		let a = this._transform;
		return this._activePath.quadraticCurveTo(a.a * e + a.c * t + a.tx, a.b * e + a.d * t + a.ty, a.a * n + a.c * r + a.tx, a.b * n + a.d * r + a.ty, i), this;
	}
	/**
	* Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
	* @param x - The x-coordinate of the top-left corner of the rectangle.
	* @param y - The y-coordinate of the top-left corner of the rectangle.
	* @param w - The width of the rectangle.
	* @param h - The height of the rectangle.
	* @returns The instance of the current object for chaining.
	*/
	rect(e, t, n, r) {
		return this._tick++, this._activePath.rect(e, t, n, r, this._transform.clone()), this;
	}
	/**
	* Draws a rectangle with rounded corners.
	* The corner radius can be specified to determine how rounded the corners should be.
	* An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
	* @param x - The x-coordinate of the top-left corner of the rectangle.
	* @param y - The y-coordinate of the top-left corner of the rectangle.
	* @param w - The width of the rectangle.
	* @param h - The height of the rectangle.
	* @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
	* @returns The instance of the current object for chaining.
	*/
	roundRect(e, t, n, r, i) {
		return this._tick++, this._activePath.roundRect(e, t, n, r, i, this._transform.clone()), this;
	}
	/**
	* Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
	* which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
	* rotated, or translated as needed.
	* @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
	* representing the x and y coordinates, of the polygon's vertices, in sequence.
	* @param close - A boolean indicating whether to close the polygon path. True by default.
	*/
	poly(e, t) {
		return this._tick++, this._activePath.poly(e, t, this._transform.clone()), this;
	}
	/**
	* Draws a regular polygon with a specified number of sides. All sides and angles are equal.
	* @param x - The x-coordinate of the center of the polygon.
	* @param y - The y-coordinate of the center of the polygon.
	* @param radius - The radius of the circumscribed circle of the polygon.
	* @param sides - The number of sides of the polygon. Must be 3 or more.
	* @param rotation - The rotation angle of the polygon, in radians. Zero by default.
	* @param transform - An optional `Matrix` object to apply a transformation to the polygon.
	* @returns The instance of the current object for chaining.
	*/
	regularPoly(e, t, n, r, i = 0, a) {
		return this._tick++, this._activePath.regularPoly(e, t, n, r, i, a), this;
	}
	/**
	* Draws a polygon with rounded corners.
	* Similar to `regularPoly` but with the ability to round the corners of the polygon.
	* @param x - The x-coordinate of the center of the polygon.
	* @param y - The y-coordinate of the center of the polygon.
	* @param radius - The radius of the circumscribed circle of the polygon.
	* @param sides - The number of sides of the polygon. Must be 3 or more.
	* @param corner - The radius of the rounding of the corners.
	* @param rotation - The rotation angle of the polygon, in radians. Zero by default.
	* @returns The instance of the current object for chaining.
	*/
	roundPoly(e, t, n, r, i, a) {
		return this._tick++, this._activePath.roundPoly(e, t, n, r, i, a), this;
	}
	/**
	* Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
	* Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
	* @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
	* A minimum of 3 points is required.
	* @param radius - The default radius for the corners.
	* This radius is applied to all corners unless overridden in `points`.
	* @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
	*  method instead of an arc method. Defaults to false.
	* @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
	* Higher values make the curve smoother.
	* @returns The instance of the current object for chaining.
	*/
	roundShape(e, t, n, r) {
		return this._tick++, this._activePath.roundShape(e, t, n, r), this;
	}
	/**
	* Draw Rectangle with fillet corners. This is much like rounded rectangle
	* however it support negative numbers as well for the corner radius.
	* @param x - Upper left corner of rect
	* @param y - Upper right corner of rect
	* @param width - Width of rect
	* @param height - Height of rect
	* @param fillet - accept negative or positive values
	*/
	filletRect(e, t, n, r, i) {
		return this._tick++, this._activePath.filletRect(e, t, n, r, i), this;
	}
	/**
	* Draw Rectangle with chamfer corners. These are angled corners.
	* @param x - Upper left corner of rect
	* @param y - Upper right corner of rect
	* @param width - Width of rect
	* @param height - Height of rect
	* @param chamfer - non-zero real number, size of corner cutout
	* @param transform
	*/
	chamferRect(e, t, n, r, i, a) {
		return this._tick++, this._activePath.chamferRect(e, t, n, r, i, a), this;
	}
	/**
	* Draws a star shape centered at a specified location. This method allows for the creation
	*  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
	* The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
	* An optional transformation can be applied to scale, rotate, or translate the star as needed.
	* @param x - The x-coordinate of the center of the star.
	* @param y - The y-coordinate of the center of the star.
	* @param points - The number of points of the star.
	* @param radius - The outer radius of the star (distance from the center to the outer points).
	* @param innerRadius - Optional. The inner radius of the star
	* (distance from the center to the inner points between the outer points).
	* If not provided, defaults to half of the `radius`.
	* @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
	* Defaults to 0, meaning one point is directly upward.
	* @returns The instance of the current object for chaining further drawing commands.
	*/
	star(e, t, n, r, i = 0, a = 0) {
		return this._tick++, this._activePath.star(e, t, n, r, i, a, this._transform.clone()), this;
	}
	/**
	* Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
	* defined in SVG format to be drawn within the graphics context.
	* @param svg - The SVG string to be parsed and rendered.
	*/
	svg(e) {
		return this._tick++, fn(e, this), this;
	}
	/**
	* Restores the most recently saved graphics state by popping the top of the graphics state stack.
	* This includes transformations, fill styles, and stroke styles.
	*/
	restore() {
		let e = this._stateStack.pop();
		return e && (this._transform = e.transform, this._fillStyle = e.fillStyle, this._strokeStyle = e.strokeStyle), this;
	}
	/** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
	save() {
		return this._stateStack.push({
			transform: this._transform.clone(),
			fillStyle: { ...this._fillStyle },
			strokeStyle: { ...this._strokeStyle }
		}), this;
	}
	/**
	* Returns the current transformation matrix of the graphics context.
	* @returns The current transformation matrix.
	*/
	getTransform() {
		return this._transform;
	}
	/**
	* Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	resetTransform() {
		return this._transform.identity(), this;
	}
	/**
	* Applies a rotation transformation to the graphics context around the current origin.
	* @param angle - The angle of rotation in radians.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	rotate(e) {
		return this._transform.rotate(e), this;
	}
	/**
	* Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
	* @param x - The scale factor in the horizontal direction.
	* @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	scale(e, t = e) {
		return this._transform.scale(e, t), this;
	}
	setTransform(e, t, n, r, i, a) {
		return e instanceof p ? (this._transform.set(e.a, e.b, e.c, e.d, e.tx, e.ty), this) : (this._transform.set(e, t, n, r, i, a), this);
	}
	transform(e, t, n, r, i, a) {
		return e instanceof p ? (this._transform.append(e), this) : (kn.set(e, t, n, r, i, a), this._transform.append(kn), this);
	}
	/**
	* Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
	* @param x - The amount to translate in the horizontal direction.
	* @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	translate(e, t = e) {
		return this._transform.translate(e, t), this;
	}
	/**
	* Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
	* and optionally resetting transformations to the identity matrix.
	* @returns The instance of the current GraphicsContext for method chaining.
	*/
	clear() {
		return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
	}
	onUpdate() {
		this._boundsDirty = !0, this.dirty = !0, this.emit("update", this, 16);
	}
	/** The bounds of the graphic shape. */
	get bounds() {
		if (!this._boundsDirty) return this._bounds;
		this._boundsDirty = !1;
		let e = this._bounds;
		e.clear();
		for (let t = 0; t < this.instructions.length; t++) {
			let n = this.instructions[t], r = n.action;
			if (r === "fill") {
				let t = n.data;
				e.addBounds(t.path.bounds);
			} else if (r === "texture") {
				let t = n.data;
				e.addFrame(t.dx, t.dy, t.dx + t.dw, t.dy + t.dh, t.transform);
			}
			if (r === "stroke") {
				let t = n.data, r = t.style.alignment, i = t.style.width * (1 - r);
				t.style.join === "miter" && (i *= Dn(t.path, t.style.miterLimit));
				let a = t.path.bounds;
				e.addFrame(a.minX - i, a.minY - i, a.maxX + i, a.maxY + i);
			}
		}
		return e.isValid || e.set(0, 0, 0, 0), e;
	}
	/**
	* Check to see if a point is contained within this geometry.
	* @param point - Point to check if it's contained.
	* @returns {boolean} `true` if the point is contained within geometry.
	*/
	containsPoint(e) {
		if (!this.bounds.containsPoint(e.x, e.y)) return !1;
		let t = this.instructions, n = !1;
		for (let r = 0; r < t.length; r++) {
			let i = t[r], a = i.data, o = a.path;
			if (!i.action || !o) continue;
			let s = a.style, c = o.shapePath.shapePrimitives;
			for (let t = 0; t < c.length; t++) {
				let r = c[t].shape;
				if (!s || !r) continue;
				let o = c[t].transform, l = o ? o.applyInverse(e, On) : e;
				if (i.action === "fill") n = r.contains(l.x, l.y);
				else {
					let e = s;
					n = r.strokeContains(l.x, l.y, e.width, e.alignment);
				}
				let u = a.hole;
				if (u) {
					let e = u.shapePath?.shapePrimitives;
					if (e) for (let t = 0; t < e.length; t++) e[t].shape.contains(l.x, l.y) && (n = !1);
				}
				if (n) return !0;
			}
		}
		return n;
	}
	/** Unloads the GPU data from the graphics context. */
	unload() {
		this.emit("unload", this);
		for (let e in this._gpuData) this._gpuData[e]?.destroy();
		this._gpuData = /* @__PURE__ */ Object.create(null);
	}
	/**
	* Destroys the GraphicsData object.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @example
	* context.destroy();
	* context.destroy(true);
	* context.destroy({ texture: true, textureSource: true });
	*/
	destroy(e = !1) {
		if (!this.destroyed) {
			if (this.destroyed = !0, this._stateStack.length = 0, this._transform = null, this.unload(), this.emit("destroy", this), this.removeAllListeners(), typeof e == "boolean" ? e : e?.texture) {
				let t = typeof e == "boolean" ? e : e?.textureSource;
				this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(t)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(t));
			}
			this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
		}
	}
};
/** The default stroke style to use when none is provided. */
An.defaultFillStyle = {
	/** The color to use for the fill. */
	color: 16777215,
	/** The alpha value to use for the fill. */
	alpha: 1,
	/** The texture to use for the fill. */
	texture: d.WHITE,
	/** The matrix to apply. */
	matrix: null,
	/** The fill pattern to use. */
	fill: null,
	/** Whether coordinates are 'global' or 'local' */
	textureSpace: "local"
}, An.defaultStrokeStyle = {
	/** The width of the stroke. */
	width: 1,
	/** The color to use for the stroke. */
	color: 16777215,
	/** The alpha value to use for the stroke. */
	alpha: 1,
	/** The alignment of the stroke. */
	alignment: .5,
	/** The miter limit to use. */
	miterLimit: 10,
	/** The line cap style to use. */
	cap: "butt",
	/** The line join style to use. */
	join: "miter",
	/** The texture to use for the fill. */
	texture: d.WHITE,
	/** The matrix to apply. */
	matrix: null,
	/** The fill pattern to use. */
	fill: null,
	/** Whether coordinates are 'global' or 'local' */
	textureSpace: "local",
	/** If the stroke is a pixel line. */
	pixelLine: !1
};
var jn = An;
//#endregion
export { Ie as $, q as A, $e as B, zt as C, wt as D, Ct as E, at as F, qe as G, Xe as H, rt as I, We as J, Ke as K, nt as L, K as M, st as N, Et as O, ot as P, Le as Q, tt as R, Bt as S, At as T, Ze as U, W as V, Ye as W, ze as X, He as Y, Re as Z, Y as _, gn as a, Jt as b, un as c, cn as d, Fe as et, an as f, Z as g, Zt as h, En as i, gt as j, yt as k, ln as l, nn as m, Dn as n, fn as o, rn as p, Ge as q, $ as r, dn as s, jn as t, ke as tt, sn as u, Xt as v, It as w, Kt as x, qt as y, Qe as z };
