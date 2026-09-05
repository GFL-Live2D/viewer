import { E as e, P as t, S as n, d as r, l as i, t as a } from "./adapter-DdgmR4Id.js";
//#region node_modules/pixi.js/lib/rendering/renderers/shared/utils/createIdFromString.mjs
var o = /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
function c(e, t) {
	let n = s[e];
	return n === void 0 && (o[t] === void 0 && (o[t] = 1), s[e] = n = o[t]++), n;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getTestContext.mjs
var l;
function u() {
	return (!l || l?.isContextLost()) && (l = a.get().createCanvas().getContext("webgl", {})), l;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/getMaxFragmentPrecision.mjs
var d;
function f() {
	if (!d) {
		d = "mediump";
		let e = u();
		e && e.getShaderPrecisionFormat && (d = e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision ? "highp" : "mediump");
	}
	return d;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/addProgramDefines.mjs
function p(e, t, n) {
	return t ? e : n ? (e = e.replace("out vec4 finalColor;", ""), `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${e}
        `) : `

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${e}
        `;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/ensurePrecision.mjs
function m(e, t, n) {
	let r = n ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
	if (e.substring(0, 9) !== "precision") {
		let i = n ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
		return i === "highp" && r !== "highp" && (i = "mediump"), `precision ${i} float;
${e}`;
	}
	return r !== "highp" && e.substring(0, 15) === "precision highp" ? e.replace("precision highp", "precision mediump") : e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/insertVersion.mjs
function h(e, t) {
	return t ? `#version 300 es
${e}` : e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/setProgramName.mjs
var g = {}, _ = {};
function v(e, { name: t = "pixi-program" }, n = !0) {
	t = t.replace(/\s+/g, "-"), t += n ? "-fragment" : "-vertex";
	let r = n ? g : _;
	return r[t] ? (r[t]++, t += `-${r[t]}`) : r[t] = 1, e.indexOf("#define SHADER_NAME") === -1 ? `${`#define SHADER_NAME ${t}`}
${e}` : e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/program/preprocessors/stripVersion.mjs
function y(e, t) {
	return t ? e.replace("#version 300 es", "") : e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gl/shader/GlProgram.mjs
var b = {
	stripVersion: y,
	ensurePrecision: m,
	addProgramDefines: p,
	setProgramName: v,
	insertVersion: h
}, x = /* @__PURE__ */ Object.create(null), S = class e {
	/**
	* Creates a shiny new GlProgram. Used by WebGL renderer.
	* @param options - The options for the program.
	*/
	constructor(t) {
		t = {
			...e.defaultOptions,
			...t
		};
		let n = t.fragment.indexOf("#version 300 es") !== -1, r = {
			stripVersion: n,
			ensurePrecision: {
				requestedFragmentPrecision: t.preferredFragmentPrecision,
				requestedVertexPrecision: t.preferredVertexPrecision,
				maxSupportedVertexPrecision: "highp",
				maxSupportedFragmentPrecision: f()
			},
			setProgramName: { name: t.name },
			addProgramDefines: n,
			insertVersion: n
		}, i = t.fragment, a = t.vertex;
		Object.keys(b).forEach((e) => {
			let t = r[e];
			i = b[e](i, t, !0), a = b[e](a, t, !1);
		}), this.fragment = i, this.vertex = a, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = c(`${this.vertex}:${this.fragment}`, "gl-program");
	}
	/** destroys the program */
	destroy() {
		this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null, x[this._cacheKey] = null;
	}
	/**
	* Helper function that creates a program for a given source.
	* It will check the program cache if the program has already been created.
	* If it has that one will be returned, if not a new one will be created and cached.
	* @param options - The options for the program.
	* @returns A program using the same source
	*/
	static from(t) {
		let n = `${t.vertex}:${t.fragment}`;
		return x[n] || (x[n] = new e(t), x[n]._cacheKey = n), x[n];
	}
};
/** The default options used by the program. */
S.defaultOptions = {
	preferredVertexPrecision: "highp",
	preferredFragmentPrecision: "mediump"
};
var C = S, w = {
	uint8x2: {
		size: 2,
		stride: 2,
		normalised: !1
	},
	uint8x4: {
		size: 4,
		stride: 4,
		normalised: !1
	},
	sint8x2: {
		size: 2,
		stride: 2,
		normalised: !1
	},
	sint8x4: {
		size: 4,
		stride: 4,
		normalised: !1
	},
	unorm8x2: {
		size: 2,
		stride: 2,
		normalised: !0
	},
	unorm8x4: {
		size: 4,
		stride: 4,
		normalised: !0
	},
	snorm8x2: {
		size: 2,
		stride: 2,
		normalised: !0
	},
	snorm8x4: {
		size: 4,
		stride: 4,
		normalised: !0
	},
	uint16x2: {
		size: 2,
		stride: 4,
		normalised: !1
	},
	uint16x4: {
		size: 4,
		stride: 8,
		normalised: !1
	},
	sint16x2: {
		size: 2,
		stride: 4,
		normalised: !1
	},
	sint16x4: {
		size: 4,
		stride: 8,
		normalised: !1
	},
	unorm16x2: {
		size: 2,
		stride: 4,
		normalised: !0
	},
	unorm16x4: {
		size: 4,
		stride: 8,
		normalised: !0
	},
	snorm16x2: {
		size: 2,
		stride: 4,
		normalised: !0
	},
	snorm16x4: {
		size: 4,
		stride: 8,
		normalised: !0
	},
	float16x2: {
		size: 2,
		stride: 4,
		normalised: !1
	},
	float16x4: {
		size: 4,
		stride: 8,
		normalised: !1
	},
	float32: {
		size: 1,
		stride: 4,
		normalised: !1
	},
	float32x2: {
		size: 2,
		stride: 8,
		normalised: !1
	},
	float32x3: {
		size: 3,
		stride: 12,
		normalised: !1
	},
	float32x4: {
		size: 4,
		stride: 16,
		normalised: !1
	},
	uint32: {
		size: 1,
		stride: 4,
		normalised: !1
	},
	uint32x2: {
		size: 2,
		stride: 8,
		normalised: !1
	},
	uint32x3: {
		size: 3,
		stride: 12,
		normalised: !1
	},
	uint32x4: {
		size: 4,
		stride: 16,
		normalised: !1
	},
	sint32: {
		size: 1,
		stride: 4,
		normalised: !1
	},
	sint32x2: {
		size: 2,
		stride: 8,
		normalised: !1
	},
	sint32x3: {
		size: 3,
		stride: 12,
		normalised: !1
	},
	sint32x4: {
		size: 4,
		stride: 16,
		normalised: !1
	}
};
function T(e) {
	return w[e] ?? w.float32;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/extractAttributesFromGpuProgram.mjs
var E = {
	f32: "float32",
	"vec2<f32>": "float32x2",
	"vec3<f32>": "float32x3",
	"vec4<f32>": "float32x4",
	vec2f: "float32x2",
	vec3f: "float32x3",
	vec4f: "float32x4",
	i32: "sint32",
	"vec2<i32>": "sint32x2",
	"vec3<i32>": "sint32x3",
	"vec4<i32>": "sint32x4",
	vec2i: "sint32x2",
	vec3i: "sint32x3",
	vec4i: "sint32x4",
	u32: "uint32",
	"vec2<u32>": "uint32x2",
	"vec3<u32>": "uint32x3",
	"vec4<u32>": "uint32x4",
	vec2u: "uint32x2",
	vec3u: "uint32x3",
	vec4u: "uint32x4",
	bool: "uint32",
	"vec2<bool>": "uint32x2",
	"vec3<bool>": "uint32x3",
	"vec4<bool>": "uint32x4"
}, D = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|\)|$)/g;
function O(e, t) {
	let n;
	for (; (n = D.exec(e)) !== null;) {
		let e = E[n[3]] ?? "float32";
		t[n[2]] = {
			location: parseInt(n[1], 10),
			format: e,
			stride: T(e).stride,
			offset: 0,
			instance: !1,
			start: 0
		};
	}
	D.lastIndex = 0;
}
function k(e) {
	return e.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}
function A({ source: e, entryPoint: t }) {
	let n = {}, r = k(e), i = r.indexOf(`fn ${t}(`);
	if (i === -1) return n;
	let a = r.indexOf("->", i);
	if (a === -1) return n;
	let o = r.substring(i, a);
	if (O(o, n), Object.keys(n).length === 0) {
		let e = o.match(/\(\s*\w+\s*:\s*(\w+)/);
		if (e) {
			let t = e[1], i = RegExp(`struct\\s+${t}\\s*\\{([^}]+)\\}`, "s"), a = r.match(i);
			a && O(a[1], n);
		}
	}
	return n;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/extractStructAndGroups.mjs
function j(e) {
	let t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, n = /@group\((\d+)\)/, r = /@binding\((\d+)\)/, i = /var(<[^>]+>)? (\w+)/, a = /:\s*([\w<>]+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, s = /(\w+)\s*:\s*([\w\<\>]+)/g, c = /struct\s+(\w+)/, l = e.match(t)?.map((e) => {
		let t = e.match(i), o = t?.[1] ?? "", s;
		return o === "<uniform>" ? s = "uniform" : o.startsWith("<storage") && (s = "storage"), {
			group: parseInt(e.match(n)[1], 10),
			binding: parseInt(e.match(r)[1], 10),
			name: t[2],
			accessMode: s,
			type: e.match(a)[1]
		};
	});
	return l ? {
		groups: l,
		structs: e.match(o)?.map((e) => {
			let t = e.match(c)[1], n = e.match(s).reduce((e, t) => {
				let [n, r] = t.split(":");
				return e[n.trim()] = r.trim(), e;
			}, {});
			return n ? {
				name: t,
				members: n
			} : null;
		}).filter(({ name: e }) => l.some((t) => t.type === e || t.type.includes(`<${e}>`))) ?? []
	} : {
		groups: [],
		structs: []
	};
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/shader/const.mjs
var M = /* @__PURE__ */ ((e) => (e[e.VERTEX = 1] = "VERTEX", e[e.FRAGMENT = 2] = "FRAGMENT", e[e.COMPUTE = 4] = "COMPUTE", e))(M || {});
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateGpuLayoutGroups.mjs
function N({ groups: e }) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t[r.group] || (t[r.group] = []), r.accessMode === "uniform" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			buffer: { type: "uniform" }
		}) : r.accessMode === "storage" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			buffer: { type: "read-only-storage" }
		}) : r.type === "sampler" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			sampler: { type: "filtering" }
		}) : r.type === "sampler_comparison" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			sampler: { type: "comparison" }
		}) : r.type === "texture_2d" || r.type.startsWith("texture_2d<") ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			texture: {
				sampleType: "float",
				viewDimension: "2d",
				multisampled: !1
			}
		}) : r.type === "texture_depth_2d" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			texture: {
				sampleType: "depth",
				viewDimension: "2d",
				multisampled: !1
			}
		}) : r.type === "texture_depth_2d_array" ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			texture: {
				sampleType: "depth",
				viewDimension: "2d-array",
				multisampled: !1
			}
		}) : r.type === "texture_2d_array" || r.type.startsWith("texture_2d_array<") ? t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			texture: {
				sampleType: "float",
				viewDimension: "2d-array",
				multisampled: !1
			}
		}) : (r.type === "texture_cube" || r.type.startsWith("texture_cube<")) && t[r.group].push({
			binding: r.binding,
			visibility: M.VERTEX | M.FRAGMENT,
			texture: {
				sampleType: "float",
				viewDimension: "cube",
				multisampled: !1
			}
		});
	}
	for (let e = 0; e < t.length; e++) t[e] || (t[e] = []);
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateLayoutHash.mjs
function P({ groups: e }) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t[r.group] || (t[r.group] = {}), t[r.group][r.name] = r.binding;
	}
	return t;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/removeStructAndGroupDuplicates.mjs
function F(e, t) {
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
	return {
		structs: [...e.structs, ...t.structs].filter((e) => !n.has(e.name) && (n.add(e.name), !0)),
		groups: [...e.groups, ...t.groups].filter((e) => {
			let t = `${e.name}-${e.binding}`;
			return !r.has(t) && (r.add(t), !0);
		})
	};
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/GpuProgram.mjs
var I = /* @__PURE__ */ Object.create(null), L = class e {
	/**
	* Create a new GpuProgram
	* @param options - The options for the gpu program
	*/
	constructor(e) {
		/** @internal */
		this._layoutKey = 0, this._attributeLocationsKey = 0;
		let { fragment: t, vertex: n, layout: r, gpuLayout: i, name: a } = e;
		if (this.name = a, this.fragment = t, this.vertex = n, t.source === n.source) {
			let e = j(t.source);
			this.structsAndGroups = e;
		} else {
			let e = j(n.source), r = j(t.source);
			this.structsAndGroups = F(e, r);
		}
		this.layout = r ?? P(this.structsAndGroups), this.gpuLayout = i ?? N(this.structsAndGroups), this.autoAssignGlobalUniforms = this.layout[0]?.globalUniforms !== void 0, this.autoAssignLocalUniforms = this.layout[1]?.localUniforms !== void 0, this._generateProgramKey();
	}
	_generateProgramKey() {
		let { vertex: e, fragment: t } = this, n = e.source + t.source + e.entryPoint + t.entryPoint;
		this._layoutKey = c(n, "program");
	}
	get attributeData() {
		return this._attributeData ??= A(this.vertex), this._attributeData;
	}
	/** destroys the program */
	destroy() {
		this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null, I[this._cacheKey] = null;
	}
	/**
	* Helper function that creates a program for a given source.
	* It will check the program cache if the program has already been created.
	* If it has that one will be returned, if not a new one will be created and cached.
	* @param options - The options for the program.
	* @returns A program using the same source
	*/
	static from(t) {
		let n = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
		return I[n] || (I[n] = new e(t), I[n]._cacheKey = n), I[n];
	}
}, R = [
	"f32",
	"i32",
	"u32",
	"vec2<f32>",
	"vec3<f32>",
	"vec4<f32>",
	"mat2x2<f32>",
	"mat3x3<f32>",
	"mat4x4<f32>",
	"mat3x2<f32>",
	"mat4x2<f32>",
	"mat2x3<f32>",
	"mat4x3<f32>",
	"mat2x4<f32>",
	"mat3x4<f32>",
	"vec2<i32>",
	"vec3<i32>",
	"vec4<i32>",
	"vec2<u32>",
	"vec3<u32>",
	"vec4<u32>"
], z = R.reduce((e, t) => (e[t] = !0, e), {});
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/shader/utils/getDefaultUniformValue.mjs
function B(e, t) {
	switch (e) {
		case "f32": return 0;
		case "vec2<f32>": return new Float32Array(2 * t);
		case "vec3<f32>": return new Float32Array(3 * t);
		case "vec4<f32>": return new Float32Array(4 * t);
		case "mat2x2<f32>": return new Float32Array([
			1,
			0,
			0,
			1
		]);
		case "mat3x3<f32>": return new Float32Array([
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		]);
		case "mat4x4<f32>": return new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
	}
	return null;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/shader/UniformGroup.mjs
var V = class n extends t {
	/**
	* Create a new Uniform group
	* @param uniformStructures - The structures of the uniform group
	* @param options - The optional parameters of this uniform group
	*/
	constructor(t, r) {
		super(), this._touched = 0, this.uid = e("uniform"), this._resourceType = "uniformGroup", this._resourceId = e("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, r = {
			...n.defaultOptions,
			...r
		}, this.uniformStructures = t;
		let i = {};
		for (let e in t) {
			let n = t[e];
			if (n.name = e, n.size = n.size ?? 1, !z[n.type]) {
				let e = n.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);
				if (e) {
					let [, t, r] = e;
					throw Error(`Uniform type ${n.type} is not supported. Use type: '${t}', size: ${r} instead.`);
				}
				throw Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${R.join(", ")}`);
			}
			n.value ??= B(n.type, n.size), i[e] = n.value;
		}
		this.uniforms = i, this._dirtyId = 1, this.ubo = r.ubo, this.isStatic = r.isStatic, this._signature = c(Object.keys(i).map((e) => `${e}-${t[e].type}`).join("-"), "uniform-group");
	}
	/**
	* an underlying buffer that will be uploaded to the GPU when using this UniformGroup.
	* It is created lazily by the renderer's ubo system on first use.
	*/
	get buffer() {
		return this._buffer;
	}
	set buffer(e) {
		this._buffer !== e && (this._buffer?.off("change", this.onBufferChange, this), this._buffer = e, e?.on("change", this.onBufferChange, this));
	}
	/**
	* The GC tracks this group's underlying buffer, not the group itself — a GC stamp on the
	* group (see BindGroup._touch) must land on the buffer, or the GC collects it while
	* cached bind groups still reference it.
	* @internal
	*/
	get _gcLastUsed() {
		return this._buffer?._gcLastUsed ?? -1;
	}
	set _gcLastUsed(e) {
		this._buffer && (this._buffer._gcLastUsed = e);
	}
	/**
	* Bind group keys are built from this group's _resourceId, not the buffer's — so when the
	* buffer re-keys (it resized, or the GC unloaded its GPU copy), this group must re-key too,
	* or cached GPUBindGroups keep referencing the destroyed GPU buffer.
	*/
	onBufferChange() {
		this._resourceId = e("resource"), this.emit("change", this);
	}
	/** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
	update() {
		this._dirtyId++;
	}
};
/**
* emits when the underlying buffer needs to be re-bound (it resized or was unloaded),
* letting cached bind groups know they must rebuild
* @event change
*/
/** The default options used by the uniform group. */
V.defaultOptions = {
	/** if true the UniformGroup is handled as an Uniform buffer object. */
	ubo: !1,
	/** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
	isStatic: !1
};
var H = V, U = class {
	/**
	* Create a new instance of the Bind Group.
	* @param resources - The resources that are bound together for use by a shader.
	*/
	constructor(e) {
		this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
		let t = 0;
		for (let n in e) {
			let r = e[n];
			this.setResource(r, t++);
		}
	}
	/**
	* A key used internally to match it up to a WebGPU BindGroup.
	* Lazily rebuilt from resource IDs when dirty.
	* @internal
	*/
	get _key() {
		if (this._dirty) {
			this._dirty = !1;
			let e = [], t = 0;
			for (let n in this.resources) e[t++] = this.resources[n] ? this.resources[n]._resourceId : -1;
			this._keyValue = e.join("|");
		}
		return this._keyValue;
	}
	/**
	* Set a resource at a given index. This function will
	* ensure that listeners will be removed from the current resource
	* and added to the new resource.
	* @param resource - The resource to set.
	* @param index - The index to set the resource at.
	*/
	setResource(e, t) {
		let n = this.resources[t];
		e !== n && (n && n.off?.("change", this.onResourceChange, this), e.on?.("change", this.onResourceChange, this), this.resources[t] = e, this._dirty = !0);
	}
	/**
	* Returns the resource at the current specified index.
	* @param index - The index of the resource to get.
	* @returns - The resource at the specified index.
	*/
	getResource(e) {
		return this.resources[e];
	}
	/**
	* Used internally to 'touch' each resource, to ensure that the GC
	* knows that all resources in this bind group are still being used.
	* @param now - The current time in milliseconds.
	* @param tick - The current tick.
	* @internal
	*/
	_touch(e, t) {
		let n = this.resources;
		for (let r in n) {
			let i = n[r];
			i && (i._gcLastUsed = e, i._touched = t);
		}
	}
	/** Destroys this bind group and removes all listeners. */
	destroy() {
		let e = this.resources;
		for (let t in e) e[t]?.off?.("change", this.onResourceChange, this);
		this.resources = null;
	}
	onResourceChange(e) {
		if (this._dirty = !0, e.destroyed) {
			let t = this.resources;
			for (let n in t) t[n] === e && (t[n] = null);
			i(`[BindGroup] a '${e._resourceType}' was destroyed while still bound to a shader. Remove it from the shader before destroying it.`);
		}
	}
}, W = /* @__PURE__ */ ((e) => (e[e.WEBGL = 1] = "WEBGL", e[e.WEBGPU = 2] = "WEBGPU", e[e.CANVAS = 4] = "CANVAS", e[e.BOTH = 3] = "BOTH", e))(W || {}), G = class e {
	/**
	* @param data - A dictionary of constants to set on the shader.
	* Keys should match the constant names in the WGSL shader.
	*/
	constructor(e) {
		this.data = { ...e };
		let t = Object.keys(e).sort().map((t) => `${t}:${e[t]}`).join("|");
		this.id = c(t, "shader-overrides");
	}
	/**
	* Creates a ShaderOverrides instance from a plain object or existing instance.
	* @param overrides - The overrides to convert.
	* @returns A ShaderOverrides instance.
	*/
	static from(t) {
		return t instanceof e ? t : new e(t);
	}
}, K = class n extends t {
	constructor(t) {
		/** @internal */
		super(), this.uid = e("shader"), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [], this._destroyed = !1;
		let { gpuProgram: n, glProgram: r, groups: a, resources: o, compatibleRenderers: s, groupMap: c, overrides: l } = t;
		this._overrides = l ? G.from(l) : null, this.gpuProgram = n, this.glProgram = r, s === void 0 && (s = 0, n && (s |= W.WEBGPU), r && (s |= W.WEBGL)), this.compatibleRenderers = s;
		let u = {};
		if (c) for (let e in c) for (let t in c[e]) {
			let n = c[e][t];
			u[n] = {
				group: e,
				binding: t,
				name: n
			};
		}
		if (!o && !a && (o = {}), o && a) throw Error("[Shader] Cannot have both resources and groups");
		if (!n && a && !c) throw Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
		if (n && a && !c) {
			let e = n.structsAndGroups.groups;
			c = {}, e.forEach((e) => {
				c[e.group] = c[e.group] || {}, c[e.group][e.binding] = e.name, u[e.name] = e;
			});
		} else if (o) {
			a = {}, c ||= {}, n && n.structsAndGroups.groups.forEach((e) => {
				c[e.group] = c[e.group] || {}, c[e.group][e.binding] = e.name, u[e.name] = e;
			});
			let e = 0;
			for (let t in o) u[t] || (n && !r && i(`[Shader] the resource '${t}' matches no binding in the WGSL source \u2014 is the name correct?`), a[99] || (a[99] = new U(), this._ownedBindGroups.push(a[99])), u[t] = {
				group: 99,
				binding: e,
				name: t
			}, c[99] = c[99] || {}, c[99][e] = t, e++);
			for (let e in o) {
				let t = e, n = o[e];
				!n.source && !n._resourceType && (n = new H(n));
				let r = u[t];
				r && (a[r.group] || (a[r.group] = new U(), this._ownedBindGroups.push(a[r.group])), a[r.group].setResource(n, r.binding));
			}
		}
		this.groups = a, this._uniformBindMap = c, this.resources = this._buildResourceAccessor(a, u);
	}
	/**
	* Sometimes a resource group will be provided later (for example global uniforms)
	* In such cases, this method can be used to let the shader know about the group.
	* @param name - the name of the resource group
	* @param groupIndex - the index of the group (should match the webGPU shader group location)
	* @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
	*/
	addResource(e, t, n) {
		var r, i;
		(r = this._uniformBindMap)[t] || (r[t] = {}), (i = this._uniformBindMap[t])[n] || (i[n] = e), this.groups[t] || (this.groups[t] = new U(), this._ownedBindGroups.push(this.groups[t]));
	}
	_buildResourceAccessor(e, t) {
		let n = {};
		for (let r in t) {
			let i = t[r];
			Object.defineProperty(n, i.name, {
				get() {
					return e[i.group].getResource(i.binding);
				},
				set(t) {
					e[i.group].setResource(t, i.binding);
				}
			});
		}
		return n;
	}
	/**
	* Use to destroy the shader when its not longer needed.
	* It will destroy the resources and remove listeners.
	* @param destroyPrograms - if the programs should be destroyed as well.
	* Make sure its not being used by other shaders!
	*/
	destroy(e = !1) {
		this._destroyed || (this._destroyed = !0, this.emit("destroy", this), e && (this.gpuProgram?.destroy(), this.glProgram?.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((e) => {
			e.destroy();
		}), this._ownedBindGroups = null, this.resources = null, this.groups = null, this._overrides = null);
	}
	static from(e) {
		let { gpu: t, gl: r, ...i } = e, a, o;
		return t && (a = L.from(t)), r && (o = C.from(r)), new n({
			gpuProgram: a,
			glProgram: o,
			...i
		});
	}
}, q = /* @__PURE__ */ ((e) => (e[e.MAP_READ = 1] = "MAP_READ", e[e.MAP_WRITE = 2] = "MAP_WRITE", e[e.COPY_SRC = 4] = "COPY_SRC", e[e.COPY_DST = 8] = "COPY_DST", e[e.INDEX = 16] = "INDEX", e[e.VERTEX = 32] = "VERTEX", e[e.UNIFORM = 64] = "UNIFORM", e[e.STORAGE = 128] = "STORAGE", e[e.INDIRECT = 256] = "INDIRECT", e[e.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", e[e.STATIC = 1024] = "STATIC", e))(q || {}), J = class extends t {
	/**
	* Creates a new Buffer with the given options
	* @param options - the options for the buffer
	*/
	constructor(t) {
		let { data: n, size: r } = t, { usage: i, label: a, shrinkToFit: o } = t;
		super(), this._gpuData = /* @__PURE__ */ Object.create(null), this._gcLastUsed = -1, this.autoGarbageCollect = !0, this.uid = e("buffer"), this._resourceType = "buffer", this._resourceId = e("resource"), this._touched = 0, this._updateID = 1, this._updateOffset = 0, this._dataInt32 = null, this.shrinkToFit = !0, this.destroyed = !1, n instanceof Array && (n = new Float32Array(n)), this._data = n, r ??= n?.byteLength;
		let s = !!n;
		this.descriptor = {
			size: r,
			usage: i,
			mappedAtCreation: s,
			label: a
		}, this.shrinkToFit = o ?? !0;
	}
	/** the data in the buffer */
	get data() {
		return this._data;
	}
	set data(e) {
		this.setDataWithSize(e, e.length, !0);
	}
	get dataInt32() {
		return this._dataInt32 ||= new Int32Array(this.data.buffer), this._dataInt32;
	}
	/** whether the buffer is static or not */
	get static() {
		return !!(this.descriptor.usage & q.STATIC);
	}
	set static(e) {
		e ? this.descriptor.usage |= q.STATIC : this.descriptor.usage &= ~q.STATIC;
	}
	/**
	* Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
	* If you only want to update a subset of the buffer, you can pass in the size of the data.
	* @param value - the data to set
	* @param size - the size of the data in bytes
	* @param syncGPU - should the buffer be updated on the GPU immediately?
	*/
	setDataWithSize(t, n, r) {
		if (this._updateID++, this._updateSize = n * t.BYTES_PER_ELEMENT, this._updateOffset = 0, this._data === t) {
			r && this.emit("update", this);
			return;
		}
		let i = this._data;
		if (this._data = t, this._dataInt32 = null, !i || i.length !== t.length) {
			!this.shrinkToFit && i && t.byteLength < i.byteLength ? r && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = e("resource"), this.emit("change", this));
			return;
		}
		r && this.emit("update", this);
	}
	/**
	* updates the buffer on the GPU to reflect the data in the buffer.
	* By default it will update the entire buffer. If you only want to update a subset of the buffer,
	* you can pass in the size of the buffer to update.
	* @param sizeInBytes - the new size of the buffer in bytes
	* @param offsetInBytes - the offset to start updating from
	*/
	update(e, t) {
		this._updateSize = e ?? this._updateSize, this._updateOffset = t || 0, this._updateID++, this.emit("update", this);
	}
	/** Unloads the buffer from the GPU */
	unload() {
		this.emit("unload", this);
		for (let e in this._gpuData) this._gpuData[e]?.destroy();
		this._gpuData = /* @__PURE__ */ Object.create(null), this.destroyed || (this._resourceId = e("resource"), this.emit("change", this));
	}
	/** Destroys the buffer */
	destroy() {
		this.destroyed = !0, this.unload(), this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
	}
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/ensureIsBuffer.mjs
function Y(e, t) {
	if (!(e instanceof J)) {
		let n = t ? q.INDEX : q.VERTEX;
		e instanceof Array && (t ? (e = new Uint32Array(e), n = q.INDEX | q.COPY_DST) : (e = new Float32Array(e), n = q.VERTEX | q.COPY_DST)), e = new J({
			data: e,
			label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
			usage: n
		});
	}
	return e;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/geometry/utils/getGeometryBounds.mjs
function X(e, t, n) {
	let r = e.getAttribute(t);
	if (!r) return n.minX = 0, n.minY = 0, n.maxX = 0, n.maxY = 0, n;
	let i = r.buffer.data, a = Infinity, o = Infinity, s = -Infinity, c = -Infinity, l = i.BYTES_PER_ELEMENT, u = (r.offset || 0) / l, d = (r.stride || 8) / l;
	for (let e = u; e < i.length; e += d) {
		let t = i[e], n = i[e + 1];
		t > s && (s = t), n > c && (c = n), t < a && (a = t), n < o && (o = n);
	}
	return n.minX = a, n.minY = o, n.maxX = s, n.maxY = c, n;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/shared/geometry/Geometry.mjs
function Z(e) {
	return (e instanceof J || Array.isArray(e) || e.BYTES_PER_ELEMENT) && (e = { buffer: e }), e.buffer = Y(e.buffer, !1), e;
}
var Q = class extends t {
	/**
	* Create a new instance of a geometry
	* @param options - The options for the geometry.
	*/
	constructor(t = {}) {
		super(), this._gpuData = /* @__PURE__ */ Object.create(null), this.autoGarbageCollect = !0, this._gcLastUsed = -1, this.uid = e("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new r(), this._boundsDirty = !0, this._vertexCount = 0, this._vertexCountDirty = !0;
		let { attributes: n, indexBuffer: i, topology: a } = t;
		if (this.buffers = [], this.attributes = {}, n) for (let e in n) this.addAttribute(e, n[e]);
		this.instanceCount = t.instanceCount ?? 1, i && this.addIndex(i), this.topology = a || "triangle-list";
	}
	onBufferUpdate() {
		this._boundsDirty = !0, this._vertexCountDirty = !0, this.emit("update", this);
	}
	/**
	* Returns the requested attribute.
	* @param id - The name of the attribute required
	* @returns - The attribute requested.
	*/
	getAttribute(e) {
		return this.attributes[e];
	}
	/**
	* Returns the index buffer
	* @returns - The index buffer.
	*/
	getIndex() {
		return this.indexBuffer;
	}
	/**
	* Returns the requested buffer.
	* @param id - The name of the buffer required.
	* @returns - The buffer requested.
	*/
	getBuffer(e) {
		return this.getAttribute(e).buffer;
	}
	/**
	* The number of vertices in this geometry, derived from the first non-instanced attribute.
	* The value is cached and only recalculated when the geometry's buffers or attributes change.
	*/
	get vertexCount() {
		if (!this._vertexCountDirty) return this._vertexCount;
		this._vertexCountDirty = !1;
		let e = this.attributes;
		for (let t in e) {
			let n = e[t];
			if (n.instance) continue;
			let r = n.buffer;
			return this._vertexCount = r.data.length / (n.stride / 4 || n.size), this._vertexCount;
		}
		return this._vertexCount = 0, 0;
	}
	/**
	* Used to figure out how many vertices there are in this geometry
	* @returns the number of vertices in the geometry
	* @deprecated since 8.20.0, use {@link Geometry.vertexCount} instead
	*/
	getSize() {
		return n("8.20.0", "Geometry.getSize is deprecated, please use Geometry.vertexCount instead."), this.vertexCount;
	}
	/**
	* Adds an attribute to the geometry.
	* @param name - The name of the attribute to add.
	* @param attributeOption - The attribute option to add.
	*/
	addAttribute(e, t) {
		let n = Z(t);
		this.buffers.indexOf(n.buffer) === -1 && (this.buffers.push(n.buffer), n.buffer.on("update", this.onBufferUpdate, this), n.buffer.on("change", this.onBufferUpdate, this)), this.attributes[e] = n, this._vertexCountDirty = !0;
	}
	/**
	* Adds an index buffer to the geometry.
	* @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
	*/
	addIndex(e) {
		this.indexBuffer = Y(e, !0), this.buffers.push(this.indexBuffer);
	}
	/** Returns the bounds of the geometry. */
	get bounds() {
		return this._boundsDirty ? (this._boundsDirty = !1, X(this, "aPosition", this._bounds)) : this._bounds;
	}
	/** Unloads the geometry from the GPU. */
	unload() {
		this.emit("unload", this);
		for (let e in this._gpuData) this._gpuData[e]?.destroy();
		this._gpuData = /* @__PURE__ */ Object.create(null);
	}
	/**
	* destroys the geometry.
	* @param destroyBuffers - destroy the buffers associated with this geometry
	*/
	destroy(e = !1) {
		this.emit("destroy", this), this.removeAllListeners(), e && this.buffers.forEach((e) => e.destroy()), this.unload(), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
	}
};
//#endregion
export { c as A, y as C, p as D, m as E, f as O, C as S, h as T, N as _, q as a, A as b, W as c, B as d, z as f, P as g, F as h, J as i, u as k, U as l, L as m, X as n, K as o, R as p, Y as r, G as s, Q as t, H as u, M as v, v as w, T as x, j as y };
