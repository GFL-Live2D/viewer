import { E as e, F as t, S as n, c as r, l as i } from "./adapter-DdgmR4Id.js";
import { S as a, a as o, i as s, k as c, m as l, o as u, t as d, u as f } from "./Geometry-CASa6bwq.js";
//#region node_modules/pixi.js/lib/utils/data/ViewableBuffer.mjs
var p = class {
	constructor(e) {
		this.rawBinaryData = typeof e == "number" ? new ArrayBuffer(e) : e instanceof Uint8Array ? e.buffer : e, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
	}
	/** View on the raw binary data as a `Int8Array`. */
	get int8View() {
		return this._int8View ||= new Int8Array(this.rawBinaryData), this._int8View;
	}
	/** View on the raw binary data as a `Uint8Array`. */
	get uint8View() {
		return this._uint8View ||= new Uint8Array(this.rawBinaryData), this._uint8View;
	}
	/**  View on the raw binary data as a `Int16Array`. */
	get int16View() {
		return this._int16View ||= new Int16Array(this.rawBinaryData), this._int16View;
	}
	/** View on the raw binary data as a `Int32Array`. */
	get int32View() {
		return this._int32View ||= new Int32Array(this.rawBinaryData), this._int32View;
	}
	/** View on the raw binary data as a `Float64Array`. */
	get float64View() {
		return this._float64Array ||= new Float64Array(this.rawBinaryData), this._float64Array;
	}
	/** View on the raw binary data as a `BigUint64Array`. */
	get bigUint64View() {
		return this._bigUint64Array ||= new BigUint64Array(this.rawBinaryData), this._bigUint64Array;
	}
	/**
	* Returns the view of the given type.
	* @param type - One of `int8`, `uint8`, `int16`,
	*    `uint16`, `int32`, `uint32`, and `float32`.
	* @returns - typed array of given type
	*/
	view(e) {
		return this[`${e}View`];
	}
	/** Destroys all buffer references. Do not use after calling this. */
	destroy() {
		this.rawBinaryData = null, this.uint32View = null, this.float32View = null, this.uint16View = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._int32View = null, this._float64Array = null, this._bigUint64Array = null;
	}
	/**
	* Returns the size of the given type in bytes.
	* @param type - One of `int8`, `uint8`, `int16`,
	*   `uint16`, `int32`, `uint32`, and `float32`.
	* @returns - size of the type in bytes
	*/
	static sizeOf(e) {
		switch (e) {
			case "int8":
			case "uint8": return 1;
			case "int16":
			case "uint16": return 2;
			case "int32":
			case "uint32":
			case "float32": return 4;
			default: throw Error(`${e} isn't a valid view type`);
		}
	}
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/buffer/utils/fastCopy.mjs
function m(e, t, n, r) {
	if (n ??= 0, r ??= Math.min(e.byteLength - n, t.byteLength), !(n & 7) && !(r & 7)) {
		let i = r / 8;
		new Float64Array(t, 0, i).set(new Float64Array(e, n, i));
	} else if (!(n & 3) && !(r & 3)) {
		let i = r / 4;
		new Float32Array(t, 0, i).set(new Float32Array(e, n, i));
	} else new Uint8Array(t).set(new Uint8Array(e, n, r));
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/state/const.mjs
var h = {
	normal: "normal-npm",
	add: "add-npm",
	screen: "screen-npm"
}, g = /* @__PURE__ */ ((e) => (e[e.DISABLED = 0] = "DISABLED", e[e.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", e[e.MASK_ACTIVE = 2] = "MASK_ACTIVE", e[e.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", e[e.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", e[e.NONE = 5] = "NONE", e))(g || {});
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/state/getAdjustedBlendModeBlend.mjs
function _(e, t) {
	return t.alphaMode === "no-premultiply-alpha" && h[e] || e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/batcher/gl/utils/checkMaxIfStatementsInShader.mjs
var v = [
	"precision mediump float;",
	"void main(void){",
	"float test = 0.1;",
	"%forloop%",
	"gl_FragColor = vec4(0.0);",
	"}"
].join("\n");
function y(e) {
	let t = "";
	for (let n = 0; n < e; ++n) n > 0 && (t += "\nelse "), n < e - 1 && (t += `if(test == ${n}.0){}`);
	return t;
}
function b(e, t) {
	if (e === 0) throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
	let n = t.createShader(t.FRAGMENT_SHADER);
	try {
		for (;;) {
			let r = v.replace(/%forloop%/gi, y(e));
			if (t.shaderSource(n, r), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) e = e / 2 | 0;
			else break;
		}
	} finally {
		t.deleteShader(n);
	}
	return e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/batcher/gl/utils/maxRecommendedTextures.mjs
var x = null;
function ee() {
	if (x) return x;
	let e = c();
	return x = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), x = b(x, e), e.getExtension("WEBGL_lose_context")?.loseContext(), x;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/batcher/shared/BatchTextureArray.mjs
var S = class {
	constructor() {
		this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
	}
	/** Clear the textures and their locations. */
	clear() {
		for (let e = 0; e < this.count; e++) {
			let t = this.textures[e];
			this.textures[e] = null, this.ids[t.uid] = null;
		}
		this.count = 0;
	}
}, C = class {
	constructor() {
		this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new S(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = !0;
	}
	destroy() {
		this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null, this.elements = null;
	}
}, w = [], T = 0;
r.register({ clear: () => {
	if (w.length > 0) for (let e of w) e && e.destroy();
	w.length = 0, T = 0;
} });
function E() {
	return T > 0 ? w[--T] : new C();
}
function D(e) {
	e.elements = null, w[T++] = e;
}
var O = 0, k = class t {
	constructor(r) {
		this.uid = e("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], r = {
			...t.defaultOptions,
			...r
		}, r.maxTextures || (n("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), r.maxTextures = ee());
		let { maxTextures: i, attributesInitialSize: a, indicesInitialSize: o } = r;
		this.attributeBuffer = new p(a * 4), this.indexBuffer = new Uint16Array(o), this.maxTextures = i;
	}
	begin() {
		this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
		for (let e = 0; e < this.batchIndex; e++) D(this.batches[e]);
		this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
	}
	add(e) {
		this._elements[this.elementSize++] = e, e._indexStart = this.indexSize, e._attributeStart = this.attributeSize, e._batcher = this, this.indexSize += e.indexSize, this.attributeSize += e.attributeSize * this.vertexSize;
	}
	checkAndUpdateTexture(e, t) {
		let n = e._batch.textures.ids[t._source.uid];
		return !n && n !== 0 ? !1 : (e._textureId = n, e.texture = t, !0);
	}
	updateElement(e) {
		this.dirty = !0;
		let t = this.attributeBuffer;
		e.packAsQuad ? this.packQuadAttributes(e, t.float32View, t.uint32View, e._attributeStart, e._textureId) : this.packAttributes(e, t.float32View, t.uint32View, e._attributeStart, e._textureId);
	}
	/**
	* breaks the batcher. This happens when a batch gets too big,
	* or we need to switch to a different type of rendering (a filter for example)
	* @param instructionSet
	*/
	break(e) {
		let t = this._elements;
		if (!t[this.elementStart]) return;
		let n = E(), r = n.textures;
		r.clear();
		let i = t[this.elementStart], a = _(i.blendMode, i.texture._source), o = i.topology;
		this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
		let s = this.attributeBuffer.float32View, c = this.attributeBuffer.uint32View, l = this.indexBuffer, u = this._batchIndexSize, d = this._batchIndexStart, f = "startBatch", p = [], m = this.maxTextures;
		for (let i = this.elementStart; i < this.elementSize; ++i) {
			let h = t[i];
			t[i] = null;
			let g = h.texture._source, v = _(h.blendMode, g), y = a !== v || o !== h.topology;
			if (g._batchTick === O && !y) {
				h._textureId = g._textureBindLocation, u += h.indexSize, h.packAsQuad ? (this.packQuadAttributes(h, s, c, h._attributeStart, h._textureId), this.packQuadIndex(l, h._indexStart, h._attributeStart / this.vertexSize)) : (this.packAttributes(h, s, c, h._attributeStart, h._textureId), this.packIndex(h, l, h._indexStart, h._attributeStart / this.vertexSize)), h._batch = n, p.push(h);
				continue;
			}
			g._batchTick = O, (r.count >= m || y) && (this._finishBatch(n, d, u - d, r, a, o, e, f, p), f = "renderBatch", d = u, a = v, o = h.topology, n = E(), r = n.textures, r.clear(), p = [], ++O), h._textureId = g._textureBindLocation = r.count, r.ids[g.uid] = r.count, r.textures[r.count++] = g, h._batch = n, p.push(h), u += h.indexSize, h.packAsQuad ? (this.packQuadAttributes(h, s, c, h._attributeStart, h._textureId), this.packQuadIndex(l, h._indexStart, h._attributeStart / this.vertexSize)) : (this.packAttributes(h, s, c, h._attributeStart, h._textureId), this.packIndex(h, l, h._indexStart, h._attributeStart / this.vertexSize));
		}
		r.count > 0 && (this._finishBatch(n, d, u - d, r, a, o, e, f, p), d = u, ++O), this.elementStart = this.elementSize, this._batchIndexStart = d, this._batchIndexSize = u;
	}
	_finishBatch(e, t, n, r, i, a, o, s, c) {
		e.gpuBindGroup = null, e.bindGroup = null, e.action = s, e.batcher = this, e.textures = r, e.blendMode = i, e.topology = a, e.start = t, e.size = n, e.elements = c, ++O, this.batches[this.batchIndex++] = e, o.add(e);
	}
	finish(e) {
		this.break(e);
	}
	/**
	* Resizes the attribute buffer to the given size (1 = 1 float32)
	* @param size - the size in vertices to ensure (not bytes!)
	*/
	ensureAttributeBuffer(e) {
		e * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(e * 4);
	}
	/**
	* Resizes the index buffer to the given size (1 = 1 float32)
	* @param size - the size in vertices to ensure (not bytes!)
	*/
	ensureIndexBuffer(e) {
		e <= this.indexBuffer.length || this._resizeIndexBuffer(e);
	}
	_resizeAttributeBuffer(e) {
		let t = new p(Math.max(e, this.attributeBuffer.size * 2));
		m(this.attributeBuffer.rawBinaryData, t.rawBinaryData), this.attributeBuffer = t;
	}
	_resizeIndexBuffer(e) {
		let t = this.indexBuffer, n = Math.max(e, t.length * 1.5);
		n += n % 2;
		let r = n > 65535 ? new Uint32Array(n) : new Uint16Array(n);
		if (r.BYTES_PER_ELEMENT !== t.BYTES_PER_ELEMENT) for (let e = 0; e < t.length; e++) r[e] = t[e];
		else m(t.buffer, r.buffer);
		this.indexBuffer = r;
	}
	packQuadIndex(e, t, n) {
		e[t] = n + 0, e[t + 1] = n + 1, e[t + 2] = n + 2, e[t + 3] = n + 0, e[t + 4] = n + 2, e[t + 5] = n + 3;
	}
	packIndex(e, t, n, r) {
		let i = e.indices, a = e.indexSize, o = e.indexOffset, s = e.attributeOffset;
		for (let e = 0; e < a; e++) t[n++] = r + i[e + o] - s;
	}
	/**
	* Destroys the batch and its resources.
	* @param options - destruction options
	* @param options.shader - whether to destroy the associated shader
	*/
	destroy(e = {}) {
		if (this.batches !== null) {
			for (let e = 0; e < this.batchIndex; e++) D(this.batches[e]);
			this.batches = null, this.geometry.destroy(!0), this.geometry = null, e.shader && (this.shader?.destroy(), this.shader = null);
			for (let e = 0; e < this._elements.length; e++) this._elements[e] && (this._elements[e]._batch = null);
			this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
		}
	}
};
k.defaultOptions = {
	maxTextures: null,
	attributesInitialSize: 4,
	indicesInitialSize: 6
};
var te = k, ne = /* @__PURE__ */ new Float32Array(1), re = /* @__PURE__ */ new Uint32Array(1), ie = class extends d {
	constructor() {
		let e = new s({
			data: ne,
			label: "attribute-batch-buffer",
			usage: o.VERTEX | o.COPY_DST,
			shrinkToFit: !1
		}), t = new s({
			data: re,
			label: "index-batch-buffer",
			usage: o.INDEX | o.COPY_DST,
			shrinkToFit: !1
		});
		super({
			attributes: {
				aPosition: {
					buffer: e,
					format: "float32x2",
					stride: 24,
					offset: 0
				},
				aUV: {
					buffer: e,
					format: "float32x2",
					stride: 24,
					offset: 8
				},
				aColor: {
					buffer: e,
					format: "unorm8x4",
					stride: 24,
					offset: 16
				},
				aTextureIdAndRound: {
					buffer: e,
					format: "uint16x2",
					stride: 24,
					offset: 20
				}
			},
			indexBuffer: t
		});
	}
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/addBits.mjs
function A(e, t, n) {
	if (e) for (let r in e) {
		let a = t[r.toLocaleLowerCase()];
		if (a) {
			let t = e[r];
			r === "header" && (t = t.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), n && a.push(`//----${n}----//`), a.push(t);
		} else i(`${r} placement hook does not exist in shader`);
	}
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileHooks.mjs
var ae = /\{\{(.*?)\}\}/g;
function j(e) {
	let t = {};
	return (e.match(ae)?.map((e) => e.replace(/[{()}]/g, "")) ?? []).forEach((e) => {
		t[e] = [];
	}), t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileInputs.mjs
function M(e, t) {
	let n, r = /@in\s+([^;]+);/g;
	for (; (n = r.exec(e)) !== null;) t.push(n[1]);
}
function N(e, t, n = !1) {
	let r = [];
	M(t, r), e.forEach((e) => {
		e.header && M(e.header, r);
	});
	let i = r;
	n && i.sort();
	let a = i.map((e, t) => `       @location(${t}) ${e},`).join("\n"), o = t.replace(/@in\s+[^;]+;\s*/g, "");
	return o = o.replace("{{in}}", `
${a}
`), o;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/compileOutputs.mjs
function P(e, t) {
	let n, r = /@out\s+([^;]+);/g;
	for (; (n = r.exec(e)) !== null;) t.push(n[1]);
}
function oe(e) {
	let t = /\b(\w+)\s*:/g.exec(e);
	return t ? t[1] : "";
}
function se(e) {
	return e.replace(/@.*?\s+/g, "");
}
function F(e, t) {
	let n = [];
	P(t, n), e.forEach((e) => {
		e.header && P(e.header, n);
	});
	let r = 0, i = n.sort().map((e) => e.indexOf("builtin") > -1 ? e : `@location(${r++}) ${e}`).join(",\n"), a = n.sort().map((e) => `       var ${se(e)};`).join("\n"), o = `return VSOutput(
            ${n.sort().map((e) => ` ${oe(e)}`).join(",\n")});`, s = t.replace(/@out\s+[^;]+;\s*/g, "");
	return s = s.replace("{{struct}}", `
${i}
`), s = s.replace("{{start}}", `
${a}
`), s = s.replace("{{return}}", `
${o}
`), s;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/utils/injectBits.mjs
function I(e, t) {
	let n = e;
	for (let e in t) {
		let r = t[e];
		n = r.join("\n").length ? n.replace(`{{${e}}}`, `//-----${e} START-----//
${r.join("\n")}
//----${e} FINISH----//`) : n.replace(`{{${e}}}`, "");
	}
	return n;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compiler/compileHighShader.mjs
var L = /* @__PURE__ */ Object.create(null), R = /* @__PURE__ */ new Map(), ce = 0;
function z({ template: e, bits: t }) {
	let n = V(e, t);
	if (L[n]) return L[n];
	let { vertex: r, fragment: i } = le(e, t);
	return L[n] = H(r, i, t), L[n];
}
function B({ template: e, bits: t }) {
	let n = V(e, t);
	return L[n] || (L[n] = H(e.vertex, e.fragment, t)), L[n];
}
function le(e, t) {
	let n = t.map((e) => e.vertex).filter((e) => !!e), r = t.map((e) => e.fragment).filter((e) => !!e), i = N(n, e.vertex, !0);
	i = F(n, i);
	let a = N(r, e.fragment, !0);
	return {
		vertex: i,
		fragment: a
	};
}
function V(e, t) {
	return t.map((e) => (R.has(e) || R.set(e, ce++), R.get(e))).sort((e, t) => e - t).join("-") + e.vertex + e.fragment;
}
function H(e, t, n) {
	let r = j(e), i = j(t);
	return n.forEach((e) => {
		A(e.vertex, r, e.name), A(e.fragment, i, e.name);
	}), {
		vertex: I(e, r),
		fragment: I(t, i)
	};
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/defaultProgramTemplate.mjs
var U = "\n    @in aPosition: vec2<f32>;\n    @in aUV: vec2<f32>;\n\n    @out @builtin(position) vPosition: vec4<f32>;\n    @out vUV : vec2<f32>;\n    @out vColor : vec4<f32>;\n\n    {{header}}\n\n    struct VSOutput {\n        {{struct}}\n    };\n\n    @vertex\n    fn main( {{in}} ) -> VSOutput {\n\n        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;\n        var modelMatrix = mat3x3<f32>(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        var position = aPosition;\n        var uv = aUV;\n\n        {{start}}\n\n        vColor = vec4<f32>(1., 1., 1., 1.);\n\n        {{main}}\n\n        vUV = uv;\n\n        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);\n\n        vColor *= globalUniforms.uWorldColorAlpha;\n\n        {{end}}\n\n        {{return}}\n    };\n", W = "\n    @in vUV : vec2<f32>;\n    @in vColor : vec4<f32>;\n\n    {{header}}\n\n    @fragment\n    fn main(\n        {{in}}\n      ) -> @location(0) vec4<f32> {\n\n        {{start}}\n\n        var outColor:vec4<f32>;\n\n        {{main}}\n\n        var finalColor:vec4<f32> = outColor * vColor;\n\n        {{end}}\n\n        return finalColor;\n      };\n", G = "\n    in vec2 aPosition;\n    in vec2 aUV;\n\n    out vec4 vColor;\n    out vec2 vUV;\n\n    {{header}}\n\n    void main(void){\n\n        mat3 worldTransformMatrix = uWorldTransformMatrix;\n        mat3 modelMatrix = mat3(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        vec2 position = aPosition;\n        vec2 uv = aUV;\n\n        {{start}}\n\n        vColor = vec4(1.);\n\n        {{main}}\n\n        vUV = uv;\n\n        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n\n        vColor *= uWorldColorAlpha;\n\n        {{end}}\n    }\n", ue = "\n\n    in vec4 vColor;\n    in vec2 vUV;\n\n    out vec4 finalColor;\n\n    {{header}}\n\n    void main(void) {\n\n        {{start}}\n\n        vec4 outColor;\n\n        {{main}}\n\n        finalColor = outColor * vColor;\n\n        {{end}}\n    }\n", K = {
	name: "global-uniforms-bit",
	vertex: { header: "\n        struct GlobalUniforms {\n            uProjectionMatrix:mat3x3<f32>,\n            uWorldTransformMatrix:mat3x3<f32>,\n            uWorldColorAlpha: vec4<f32>,\n            uResolution: vec2<f32>,\n        }\n\n        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;\n        " }
}, de = {
	name: "global-uniforms-ubo-bit",
	vertex: { header: "\n          uniform globalUniforms {\n            mat3 uProjectionMatrix;\n            mat3 uWorldTransformMatrix;\n            vec4 uWorldColorAlpha;\n            vec2 uResolution;\n          };\n        " }
}, q = {
	name: "global-uniforms-bit",
	vertex: { header: "\n          uniform mat3 uProjectionMatrix;\n          uniform mat3 uWorldTransformMatrix;\n          uniform vec4 uWorldColorAlpha;\n          uniform vec2 uResolution;\n        " }
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/compileHighShaderToProgram.mjs
function J({ bits: e, name: t }) {
	let n = z({
		template: {
			fragment: W,
			vertex: U
		},
		bits: [K, ...e]
	});
	return l.from({
		name: t,
		vertex: {
			source: n.vertex,
			entryPoint: "main"
		},
		fragment: {
			source: n.fragment,
			entryPoint: "main"
		}
	});
}
function fe({ bits: e, name: t }) {
	return new a({
		name: t,
		...B({
			template: {
				vertex: G,
				fragment: ue
			},
			bits: [q, ...e]
		})
	});
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/shader-bits/colorBit.mjs
var pe = {
	name: "color-bit",
	vertex: {
		header: "\n            @in aColor: vec4<f32>;\n        ",
		main: "\n            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);\n        "
	}
}, me = {
	name: "color-bit",
	vertex: {
		header: "\n            in vec4 aColor;\n        ",
		main: "\n            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);\n        "
	}
}, Y = {};
function he(e) {
	let t = [];
	if (e === 1) t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
	else {
		let n = 0;
		for (let r = 0; r < e; r++) t.push(`@group(1) @binding(${n++}) var textureSource${r + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${n++}) var textureSampler${r + 1}: sampler;`);
	}
	return t.join("\n");
}
function ge(e) {
	let t = [];
	if (e === 1) t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
	else {
		t.push("switch vTextureId {");
		for (let n = 0; n < e; n++) n === e - 1 ? t.push("  default:{") : t.push(`  case ${n}:{`), t.push(`      outColor = textureSampleGrad(textureSource${n + 1}, textureSampler${n + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
		t.push("}");
	}
	return t.join("\n");
}
function _e(e) {
	return Y[e] || (Y[e] = {
		name: "texture-batch-bit",
		vertex: {
			header: "\n                @in aTextureIdAndRound: vec2<u32>;\n                @out @interpolate(flat) vTextureId : u32;\n            ",
			main: "\n                vTextureId = aTextureIdAndRound.y;\n            ",
			end: "\n                if(aTextureIdAndRound.x == 1)\n                {\n                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);\n                }\n            "
		},
		fragment: {
			header: `
                @in @interpolate(flat) vTextureId: u32;

                ${he(e)}
            `,
			main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${ge(e)}
            `
		}
	}), Y[e];
}
var X = {};
function ve(e) {
	let t = [];
	for (let n = 0; n < e; n++) n > 0 && t.push("else"), n < e - 1 && t.push(`if(vTextureId < ${n}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${n}], vUV);`), t.push("}");
	return t.join("\n");
}
function ye(e) {
	return X[e] || (X[e] = {
		name: "texture-batch-bit",
		vertex: {
			header: "\n                in vec2 aTextureIdAndRound;\n                out float vTextureId;\n\n            ",
			main: "\n                vTextureId = aTextureIdAndRound.y;\n            ",
			end: "\n                if(aTextureIdAndRound.x == 1.)\n                {\n                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);\n                }\n            "
		},
		fragment: {
			header: `
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,
			main: `

                ${ve(e)}
            `
		}
	}), X[e];
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/high-shader/shader-bits/roundPixelsBit.mjs
var be = {
	name: "round-pixels-bit",
	vertex: { header: "\n            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>\n            {\n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        " }
}, xe = {
	name: "round-pixels-bit",
	vertex: { header: "\n            vec2 roundPixels(vec2 position, vec2 targetSize)\n            {\n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        " }
}, Se = {};
function Z(e) {
	let t = Se[e];
	if (t) return t;
	let n = new Int32Array(e);
	for (let t = 0; t < e; t++) n[t] = t;
	return t = Se[e] = new f({ uTextures: {
		value: n,
		type: "i32",
		size: e
	} }, { isStatic: !0 }), t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/batcher/shared/DefaultShader.mjs
var Q = class extends u {
	constructor(e) {
		let t = fe({
			name: "batch",
			bits: [
				me,
				ye(e),
				xe
			]
		}), n = J({
			name: "batch",
			bits: [
				pe,
				_e(e),
				be
			]
		});
		super({
			glProgram: t,
			gpuProgram: n,
			resources: { batchSamplers: Z(e) }
		}), this.maxTextures = e;
	}
}, $ = null, Ce = class e extends te {
	constructor(t) {
		super(t), this.geometry = new ie(), this.name = e.extension.name, this.vertexSize = 6, $ ??= new Q(t.maxTextures), this.shader = $;
	}
	/**
	* Packs the attributes of a DefaultBatchableMeshElement into the provided views.
	* @param element - The DefaultBatchableMeshElement to pack.
	* @param float32View - The Float32Array view to pack into.
	* @param uint32View - The Uint32Array view to pack into.
	* @param index - The starting index in the views.
	* @param textureId - The texture ID to use.
	*/
	packAttributes(e, t, n, r, i) {
		let a = i << 16 | e.roundPixels & 65535, o = e.transform, s = o.a, c = o.b, l = o.c, u = o.d, d = o.tx, f = o.ty, { positions: p, uvs: m } = e, h = e.color, g = e.attributeOffset, _ = g + e.attributeSize;
		for (let e = g; e < _; e++) {
			let i = e * 2, o = p[i], g = p[i + 1];
			t[r++] = s * o + l * g + d, t[r++] = u * g + c * o + f, t[r++] = m[i], t[r++] = m[i + 1], n[r++] = h, n[r++] = a;
		}
	}
	/**
	* Packs the attributes of a DefaultBatchableQuadElement into the provided views.
	* @param element - The DefaultBatchableQuadElement to pack.
	* @param float32View - The Float32Array view to pack into.
	* @param uint32View - The Uint32Array view to pack into.
	* @param index - The starting index in the views.
	* @param textureId - The texture ID to use.
	*/
	packQuadAttributes(e, t, n, r, i) {
		let a = e.texture, o = e.transform, s = o.a, c = o.b, l = o.c, u = o.d, d = o.tx, f = o.ty, p = e.bounds, m = p.maxX, h = p.minX, g = p.maxY, _ = p.minY, v = a.uvs, y = e.color, b = i << 16 | e.roundPixels & 65535;
		t[r + 0] = s * h + l * _ + d, t[r + 1] = u * _ + c * h + f, t[r + 2] = v.x0, t[r + 3] = v.y0, n[r + 4] = y, n[r + 5] = b, t[r + 6] = s * m + l * _ + d, t[r + 7] = u * _ + c * m + f, t[r + 8] = v.x1, t[r + 9] = v.y1, n[r + 10] = y, n[r + 11] = b, t[r + 12] = s * m + l * g + d, t[r + 13] = u * g + c * m + f, t[r + 14] = v.x2, t[r + 15] = v.y2, n[r + 16] = y, n[r + 17] = b, t[r + 18] = s * h + l * g + d, t[r + 19] = u * g + c * h + f, t[r + 20] = v.x3, t[r + 21] = v.y3, n[r + 22] = y, n[r + 23] = b;
	}
	/**
	* Updates the maximum number of textures that can be used in the shader.
	* @param maxTextures - The maximum number of textures that can be used in the shader.
	* @internal
	*/
	_updateMaxTextures(e) {
		this.shader.maxTextures !== e && ($ = new Q(e), this.shader = $);
	}
	destroy() {
		this.shader = null, super.destroy();
	}
};
/** @ignore */
Ce.extension = {
	type: [t.Batcher],
	name: "default"
};
var we = Ce, Te = class {
	constructor(e) {
		this.items = /* @__PURE__ */ Object.create(null);
		let { renderer: t, type: n, onUnload: r, priority: i, name: a } = e;
		this._renderer = t, t.gc.addResourceHash(this, "items", n, i ?? 0), this._onUnload = r, this.name = a;
	}
	/**
	* Add an item to the hash. No-op if already added.
	* @param item
	* @returns true if the item was added, false if it was already in the hash
	*/
	add(e) {
		return !this.items[e.uid] && (this.items[e.uid] = e, e.once("unload", this.remove, this), e._gcLastUsed = this._renderer.gc.now, !0);
	}
	remove(e, ...t) {
		if (!this.items[e.uid]) return;
		let n = e._gpuData[this._renderer.uid];
		n && (this._onUnload?.(e, ...t), n.destroy(), e._gpuData[this._renderer.uid] = null, this.items[e.uid] = null);
	}
	removeAll(...e) {
		Object.values(this.items).forEach((t) => t && this.remove(t, ...e));
	}
	destroy(...e) {
		this.removeAll(...e), this.items = /* @__PURE__ */ Object.create(null), this._renderer = null, this._onUnload = null;
	}
};
//#endregion
export { S as A, F as C, ie as D, A as E, g as F, m as I, p as L, b as M, _ as N, C as O, h as P, I as S, j as T, ue as _, be as a, z as b, ye as c, fe as d, J as f, W as g, de as h, Z as i, ee as j, te as k, pe as l, q as m, we as n, xe as o, K as p, Q as r, _e as s, Te as t, me as u, U as v, N as w, B as x, G as y };
