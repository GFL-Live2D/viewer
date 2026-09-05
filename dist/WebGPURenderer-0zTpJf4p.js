import { n as e } from "./rolldown-runtime-B0aSnxlc.js";
import { F as t, I as n, f as r, h as i, k as a, l as o, t as s } from "./adapter-DdgmR4Id.js";
import { i as c } from "./Ticker-CsadseLF.js";
import { A as l, a as u, c as d, i as f, l as p, o as m, s as ee, u as h } from "./Geometry-CASa6bwq.js";
import { r as te } from "./Filter-DNPtpZTY.js";
import { Y as ne, Z as g, a as re, i as ie, t as ae } from "./RenderTargetSystem-D6chDflO.js";
import { t as _ } from "./getTextureBatchBindGroup-Dp2huG94.js";
import { F as v, I as oe, a as y, f as b, l as se, s as ce, t as le } from "./GCManagedHash-EG4FSGJE.js";
import { t as ue } from "./CanvasPool-D-H2NTfo.js";
import { c as de, d as fe, i as pe, l as me, o as he, p as ge, r as _e, s as ve, t as ye } from "./BufferResource-DHeIKYZu.js";
//#region node_modules/pixi.js/lib/rendering/batcher/gpu/GpuBatchAdaptor.mjs
var x = te.for2d(), S = class {
	start(e, t, n) {
		let r = e.renderer, i = r.encoder, a = n.gpuProgram;
		this._shader = n, this._geometry = t, i.setGeometry(t, a), x.blendMode = "normal", r.pipeline.getPipeline(t, a, x, void 0, n._overrides);
		let o = r.globalUniforms.bindGroup;
		i.resetBindGroup(1), i.setBindGroup(0, o, a);
	}
	execute(e, t) {
		let n = this._shader.gpuProgram, r = e.renderer, i = r.encoder;
		if (!t.bindGroup) {
			let e = t.textures;
			t.bindGroup = _(e.textures, e.count, r.limits.maxBatchableTextures);
		}
		x.blendMode = t.blendMode;
		let a = r.bindGroup.getBindGroup(t.bindGroup, n, 1), o = r.pipeline.getPipeline(this._geometry, n, x, t.topology, this._shader._overrides);
		t.bindGroup._touch(r.gc.now, r.tick), i.setPipeline(o), i.renderPassEncoder.setBindGroup(1, a), i.renderPassEncoder.drawIndexed(t.size, 1, t.start);
	}
};
/** @ignore */
S.extension = {
	type: [t.WebGPUPipesAdaptor],
	name: "batch"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/BindGroupSystem.mjs
var C = class {
	constructor(e) {
		this._hash = /* @__PURE__ */ Object.create(null), this._renderer = e;
	}
	contextChange(e) {
		this._gpu = e;
	}
	getBindGroup(e, t, n) {
		let r = `${e._key}:${t._layoutKey << 4 | n}`;
		return this._hash[r] || this._createBindGroup(r, e, t, n);
	}
	_createBindGroup(e, t, n, r) {
		let i = this._gpu.device, a = n.layout[r], o = [], s = this._renderer;
		for (let e in a) {
			let n = t.resources[e] ?? t.resources[a[e]];
			if (!n || n.destroyed) throw Error(`[BindGroup] the resource bound as '${e}' was destroyed while a shader still uses it. Remove it from the shader before destroying it.`);
			let r;
			if (n._resourceType === "uniformGroup") {
				let e = n;
				s.ubo.updateUniformGroup(e);
				let t = e.buffer;
				r = {
					buffer: s.buffer.getGPUBuffer(t),
					offset: 0,
					size: t.descriptor.size
				};
			} else if (n._resourceType === "buffer") {
				let e = n;
				r = {
					buffer: s.buffer.getGPUBuffer(e),
					offset: 0,
					size: e.descriptor.size
				};
			} else if (n._resourceType === "bufferResource") {
				let e = n;
				r = {
					buffer: s.buffer.getGPUBuffer(e.buffer),
					offset: e.offset,
					size: e.size ?? e.buffer.descriptor.size
				};
			} else if (n._resourceType === "textureSampler") {
				let e = n;
				r = s.texture.getGpuSampler(e);
			} else if (n._resourceType === "textureSource") {
				let e = n;
				r = s.texture.getTextureView(e);
			} else if (n._resourceType === "textureView") {
				let e = n;
				r = s.texture.getTextureView(e.source, e.viewDescriptor);
			}
			o.push({
				binding: a[e],
				resource: r
			});
		}
		let c = s.shader.getProgramData(n).bindGroups[r], l = i.createBindGroup({
			layout: c,
			entries: o
		});
		return this._hash[e] = l, l;
	}
	destroy() {
		this._hash = null, this._renderer = null;
	}
};
/** @ignore */
C.extension = {
	type: [t.WebGPUSystem],
	name: "bindGroup"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/buffer/GpuBufferSystem.mjs
var be = class {
	constructor(e) {
		this.gpuBuffer = e;
	}
	destroy() {
		this.gpuBuffer.destroy(), this.gpuBuffer = null;
	}
}, w = class {
	constructor(e) {
		this._renderer = e, this._managedBuffers = new le({
			renderer: e,
			type: "resource",
			onUnload: this.onBufferUnload.bind(this),
			name: "gpuBuffer"
		});
	}
	contextChange(e) {
		this._gpu = e;
	}
	getGPUBuffer(e) {
		return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid]?.gpuBuffer || this.createGPUBuffer(e);
	}
	updateBuffer(e) {
		let t = this.getGPUBuffer(e), n = e.data;
		return e._updateID && n && (e._updateID = 0, this._gpu.device.queue.writeBuffer(t, e._updateOffset, n.buffer, n.byteOffset + e._updateOffset, (e._updateSize || n.byteLength) + 3 & -4)), t;
	}
	/** dispose all WebGL resources of all managed buffers */
	destroyAll() {
		this._managedBuffers.removeAll();
	}
	onBufferUnload(e) {
		e.off("update", this.updateBuffer, this), e.off("change", this.onBufferChange, this);
	}
	createGPUBuffer(e) {
		let t = this._gpu.device.createBuffer(e.descriptor);
		return e._updateID = 0, e.data && (oe(e.data.buffer, t.getMappedRange(), e.data.byteOffset, e.data.byteLength), t.unmap()), e._gpuData[this._renderer.uid] = new be(t), this._managedBuffers.add(e) && (e.on("update", this.updateBuffer, this), e.on("change", this.onBufferChange, this)), t;
	}
	onBufferChange(e) {
		this._managedBuffers.remove(e), e._updateID = 0, this.createGPUBuffer(e);
	}
	destroy() {
		this._managedBuffers.destroy(), this._renderer = null, this._gpu = null;
	}
};
/** @ignore */
w.extension = {
	type: [t.WebGPUSystem],
	name: "buffer"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/buffer/UboBatch.mjs
var T = class {
	constructor({ minUniformOffsetAlignment: e }) {
		this._minUniformOffsetAlignment = 256, this.byteIndex = 0, this._minUniformOffsetAlignment = e, this.data = /* @__PURE__ */ new Float32Array(65535);
	}
	clear() {
		this.byteIndex = 0;
	}
	addEmptyGroup(e) {
		if (e > this._minUniformOffsetAlignment / 4) throw Error(`UniformBufferBatch: array is too large: ${e * 4}`);
		let t = this.byteIndex, n = t + e * 4;
		if (n = Math.ceil(n / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment, n > this.data.length * 4) throw Error("UniformBufferBatch: ubo batch got too big");
		return this.byteIndex = n, t;
	}
	addGroup(e) {
		let t = this.addEmptyGroup(e.length);
		for (let n = 0; n < e.length; n++) this.data[t / 4 + n] = e[n];
		return t;
	}
	destroy() {
		this.data = null;
	}
}, E = class {
	constructor(e) {
		this._colorMaskCache = 15, this._renderer = e;
	}
	setMask(e) {
		this._colorMaskCache !== e && (this._colorMaskCache = e, this._renderer.pipeline.setColorMask(e));
	}
	destroy() {
		this._renderer = null, this._colorMaskCache = null;
	}
};
/** @ignore */
E.extension = {
	type: [t.WebGPUSystem],
	name: "colorMask"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuDeviceSystem.mjs
var D = class {
	/**
	* @param {WebGPURenderer} renderer - The renderer this System works for.
	*/
	constructor(e) {
		this._renderer = e;
	}
	async init(e) {
		return this._initPromise ||= (e.gpu ? Promise.resolve(e.gpu) : this._createDeviceAndAdaptor(e)).then((e) => {
			this.gpu = e, this.extensions = { transientAttachment: typeof GPUTextureUsage.TRANSIENT_ATTACHMENT == "number" }, this._renderer.runners.contextChange.emit(this.gpu);
		}), this._initPromise;
	}
	/**
	* Handle the context change event
	* @param gpu
	*/
	contextChange(e) {
		this._renderer.gpu = e;
	}
	/**
	* Helper class to create a WebGL Context
	* @param {object} options - An options object that gets passed in to the canvas element containing the
	*    context attributes
	* @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
	* @returns {WebGLRenderingContext} the WebGL context
	*/
	async _createDeviceAndAdaptor(e) {
		let t = await s.get().getNavigator().gpu.requestAdapter({
			powerPreference: e.powerPreference,
			forceFallbackAdapter: e.forceFallbackAdapter
		});
		if (!t) throw Error("WebGPU not supported. No GPU adapter was returned by navigator.gpu.requestAdapter().");
		let n = [
			"texture-compression-bc",
			"texture-compression-astc",
			"texture-compression-etc2",
			"indirect-first-instance"
		].filter((e) => t.features.has(e));
		return {
			adapter: t,
			device: await t.requestDevice({
				requiredFeatures: n,
				requiredLimits: {
					maxSampledTexturesPerShaderStage: t.limits.maxSampledTexturesPerShaderStage,
					maxSamplersPerShaderStage: t.limits.maxSamplersPerShaderStage
				}
			})
		};
	}
	destroy() {
		this.gpu = null, this.extensions = null, this._renderer = null;
	}
};
/** The default options for the GpuDeviceSystem. */
D.extension = {
	type: [t.WebGPUSystem],
	name: "device"
}, D.defaultOptions = {
	/**
	* {@link WebGPUOptions.powerPreference}
	* @default default
	*/
	powerPreference: void 0,
	/**
	* Force the use of the fallback adapter
	* @default false
	*/
	forceFallbackAdapter: !1
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuEncoderSystem.mjs
var O = class {
	constructor(e) {
		this._boundBindGroup = /* @__PURE__ */ Object.create(null), this._boundVertexBuffer = /* @__PURE__ */ Object.create(null), this._renderer = e;
		for (let e = 0; e < 16; e++) this._boundBindGroup[e] = {
			bindGroup: null,
			program: null,
			key: null
		};
	}
	renderStart() {
		this.commandFinished = new Promise((e) => {
			this._resolveCommandFinished = e;
		}), this.commandEncoder = this._renderer.gpu.device.createCommandEncoder();
	}
	beginRenderPass(e) {
		this.endRenderPass(), this._clearCache(), this._passEncoder = this.commandEncoder.beginRenderPass(e.descriptor), this.renderPassEncoder = this._passEncoder;
	}
	endRenderPass() {
		this._passEncoder && this._passEncoder.end(), this.renderPassEncoder = null, this._passEncoder = null;
	}
	/**
	* Begins recording a render bundle. While recording, all draw commands are captured into a
	* {@link GPURenderBundleEncoder} instead of the active render pass. The current render pass
	* encoder is saved and restored when {@link endBundle} is called.
	*
	* Render bundles allow pre-recording of draw commands that can be replayed multiple times
	* via {@link executeBundle}, reducing CPU overhead for repeated draw sequences.
	* @throws If a render bundle is already being recorded.
	*/
	beginBundle() {
		if (this._passEncoder !== this.renderPassEncoder) throw Error("Cannot begin a new render bundle while one is already being recorded.");
		this._clearCache();
		let e = this._renderer.pipeline.getBundleDescriptor();
		this.renderPassEncoder = this._gpu.device.createRenderBundleEncoder(e);
	}
	/**
	* Finishes recording the current render bundle and restores the previous render pass encoder.
	* @returns The recorded {@link GPURenderBundle} ready to be executed via {@link executeBundle}.
	*/
	endBundle() {
		let e = this.renderPassEncoder;
		if (!e || !("finish" in e)) throw Error("endBundle called without an active render bundle.");
		let t = e.finish();
		return this.renderPassEncoder = this._passEncoder, this._clearCache(), t;
	}
	/**
	* Replays a previously recorded render bundle on the current render pass.
	* The bound state cache is cleared since the bundle may set its own pipeline, bind groups, and buffers.
	* @param bundle - The render bundle to execute.
	*/
	executeBundle(e) {
		this._clearCache(), this._passEncoder.executeBundles([e]);
	}
	setViewport(e) {
		this._passEncoder.setViewport(e.x, e.y, e.width, e.height, 0, 1);
	}
	/**
	* Sets the stencil reference value for subsequent draws. This is a pass-level command, so it
	* always targets the real render pass — not a bundle encoder, which cannot set stencil state.
	* @param stencilReference - The stencil reference value to use.
	*/
	setStencilReference(e) {
		this._passEncoder.setStencilReference(e);
	}
	setPipelineFromGeometryProgramAndState(e, t, n, r, i) {
		let a = this._renderer.pipeline.getPipeline(e, t, n, r, i);
		this.setPipeline(a);
	}
	setPipeline(e) {
		this._boundPipeline !== e && (this._boundPipeline = e, this.renderPassEncoder.setPipeline(e));
	}
	_setVertexBuffer(e, t) {
		this._boundVertexBuffer[e] !== t && (this._boundVertexBuffer[e] = t, this.renderPassEncoder.setVertexBuffer(e, this._renderer.buffer.updateBuffer(t)));
	}
	_setIndexBuffer(e) {
		if (this._boundIndexBuffer === e) return;
		this._boundIndexBuffer = e;
		let t = e.data.BYTES_PER_ELEMENT === 2 ? "uint16" : "uint32";
		this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(e), t);
	}
	resetBindGroup(e) {
		let t = this._boundBindGroup[e];
		t.bindGroup = null, t.program = null, t.key = null;
	}
	setBindGroup(e, t, n) {
		let r = this._boundBindGroup[e];
		if (r.bindGroup === t && r.program === n && r.key === t._key) return;
		r.bindGroup = t, r.program = n, r.key = t._key, t._touch(this._renderer.gc.now, this._renderer.tick);
		let i = this._renderer.bindGroup.getBindGroup(t, n, e);
		this.renderPassEncoder.setBindGroup(e, i);
	}
	setGeometry(e, t) {
		let n = this._renderer.pipeline.getBufferNamesToBind(e, t);
		for (let t in n) this._setVertexBuffer(parseInt(t, 10), e.attributes[n[t]].buffer);
		e.indexBuffer && this._setIndexBuffer(e.indexBuffer);
	}
	_setShaderBindGroups(e, t) {
		let n = e.gpuProgram;
		for (let r in e.groups) {
			if (!n.layout[r]) continue;
			let i = e.groups[r];
			t || this._syncBindGroup(i), this.setBindGroup(r, i, n);
		}
	}
	_syncBindGroup(e) {
		for (let t in e.resources) {
			let n = e.resources[t];
			n && n.isUniformGroup && this._renderer.ubo.updateUniformGroup(n);
		}
	}
	draw(e) {
		let { geometry: t, shader: n, state: r, topology: i, size: a, start: o, baseVertex: s, instanceCount: c, skipSync: l, firstInstance: u } = e;
		this.setPipelineFromGeometryProgramAndState(t, n.gpuProgram, r, i, n._overrides), this.setGeometry(t, n.gpuProgram), this._setShaderBindGroups(n, l), t.indexBuffer ? this.renderPassEncoder.drawIndexed(a || t.indexBuffer.data.length, c ?? t.instanceCount, o || 0, s || 0, u || 0) : this.renderPassEncoder.draw(a || t.vertexCount, c ?? t.instanceCount, o || 0, u || 0);
	}
	/**
	* Sets up the pipeline, geometry, and bind groups then issues an indirect draw call.
	* Uses `drawIndexedIndirect` when the geometry has an index buffer, otherwise `drawIndirect`.
	* Draw parameters (vertex count, instance count, etc.) are read from the indirect buffer on the GPU.
	* @param options - The draw options.
	* @param options.geometry - The geometry to draw.
	* @param options.shader - The shader to use.
	* @param options.state - Optional render state (blending, depth, etc.).
	* @param options.topology - Optional primitive topology override.
	* @param options.skipSync - If true, skips syncing uniform groups to their GPU buffers.
	* @param options.indirectBuffer - The GPU buffer containing the indirect draw parameters.
	* @param options.indirectOffset - Byte offset into the indirect buffer.
	*/
	drawIndirect(e) {
		let { geometry: t, shader: n, state: r, topology: i, skipSync: a, indirectBuffer: o, indirectOffset: s } = e;
		this.setPipelineFromGeometryProgramAndState(t, n.gpuProgram, r, i, n._overrides), this.setGeometry(t, n.gpuProgram), this._setShaderBindGroups(n, a), t.indexBuffer ? this.renderPassEncoder.drawIndexedIndirect(o, s) : this.renderPassEncoder.drawIndirect(o, s);
	}
	finishRenderPass() {
		this._passEncoder &&= (this._passEncoder.end(), this.renderPassEncoder = null, null);
	}
	postrender() {
		this.finishRenderPass(), this._gpu.device.queue.submit([this.commandEncoder.finish()]), this._resolveCommandFinished(), this.commandEncoder = null;
	}
	_clearCache() {
		for (let e = 0; e < 16; e++) {
			let t = this._boundBindGroup[e];
			t.bindGroup = null, t.program = null, t.key = null, this._boundVertexBuffer[e] = null;
		}
		this._boundIndexBuffer = null, this._boundPipeline = null;
	}
	destroy() {
		this._renderer = null, this._gpu = null, this._boundBindGroup = null, this._boundVertexBuffer = null, this._boundIndexBuffer = null, this._boundPipeline = null, this.renderPassEncoder = null, this._passEncoder = null;
	}
	contextChange(e) {
		this._gpu = e;
	}
};
/** @ignore */
O.extension = {
	type: [t.WebGPUSystem],
	name: "encoder",
	priority: 1
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuLimitsSystem.mjs
var k = class {
	constructor(e) {
		this.supportsOverrideConstants = !1, this._renderer = e;
	}
	contextChange() {
		let e = this._renderer.device.gpu.device;
		this.maxTextures = Math.min(e.limits.maxSampledTexturesPerShaderStage, e.limits.maxSamplersPerShaderStage), this.maxBatchableTextures = this.maxTextures, this._detectOverrideConstantsSupport(e);
	}
	_detectOverrideConstantsSupport(e) {
		e.pushErrorScope("validation");
		let t = e.createShaderModule({ code: "override TEST_VALUE: f32 = 0.0;\n@compute @workgroup_size(1) fn main() {}" });
		e.createComputePipeline({
			layout: "auto",
			compute: {
				module: t,
				entryPoint: "main",
				constants: { TEST_VALUE: 1 }
			}
		}), e.popErrorScope().then((e) => {
			this.supportsOverrideConstants = !e;
		});
	}
	destroy() {}
};
/** @ignore */
k.extension = {
	type: [t.WebGPUSystem],
	name: "limits"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuStencilSystem.mjs
var A = class {
	constructor(e) {
		this._renderTargetStencilState = /* @__PURE__ */ Object.create(null), this._renderer = e, e.renderTarget.onRenderTargetChange.add(this);
	}
	onRenderTargetChange(e) {
		let t = this._renderTargetStencilState[e.uid];
		t ||= this._renderTargetStencilState[e.uid] = {
			stencilMode: v.DISABLED,
			stencilReference: 0
		}, this._activeRenderTarget = e, this.setStencilMode(t.stencilMode, t.stencilReference);
	}
	setStencilMode(e, t) {
		let n = this._renderTargetStencilState[this._activeRenderTarget.uid];
		n.stencilMode = e, n.stencilReference = t;
		let r = this._renderer;
		r.pipeline.setStencilMode(e), r.encoder.setStencilReference(t);
	}
	destroy() {
		this._renderer.renderTarget.onRenderTargetChange.remove(this), this._renderer = null, this._activeRenderTarget = null, this._renderTargetStencilState = null;
	}
};
/** @ignore */
A.extension = {
	type: [t.WebGPUSystem],
	name: "stencil"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboElementsWGSL.mjs
var j = {
	i32: {
		align: 4,
		size: 4
	},
	u32: {
		align: 4,
		size: 4
	},
	f32: {
		align: 4,
		size: 4
	},
	f16: {
		align: 2,
		size: 2
	},
	"vec2<i32>": {
		align: 8,
		size: 8
	},
	"vec2<u32>": {
		align: 8,
		size: 8
	},
	"vec2<f32>": {
		align: 8,
		size: 8
	},
	"vec2<f16>": {
		align: 4,
		size: 4
	},
	"vec3<i32>": {
		align: 16,
		size: 12
	},
	"vec3<u32>": {
		align: 16,
		size: 12
	},
	"vec3<f32>": {
		align: 16,
		size: 12
	},
	"vec3<f16>": {
		align: 8,
		size: 6
	},
	"vec4<i32>": {
		align: 16,
		size: 16
	},
	"vec4<u32>": {
		align: 16,
		size: 16
	},
	"vec4<f32>": {
		align: 16,
		size: 16
	},
	"vec4<f16>": {
		align: 8,
		size: 8
	},
	"mat2x2<f32>": {
		align: 8,
		size: 16
	},
	"mat2x2<f16>": {
		align: 4,
		size: 8
	},
	"mat3x2<f32>": {
		align: 8,
		size: 24
	},
	"mat3x2<f16>": {
		align: 4,
		size: 12
	},
	"mat4x2<f32>": {
		align: 8,
		size: 32
	},
	"mat4x2<f16>": {
		align: 4,
		size: 16
	},
	"mat2x3<f32>": {
		align: 16,
		size: 32
	},
	"mat2x3<f16>": {
		align: 8,
		size: 16
	},
	"mat3x3<f32>": {
		align: 16,
		size: 48
	},
	"mat3x3<f16>": {
		align: 8,
		size: 24
	},
	"mat4x3<f32>": {
		align: 16,
		size: 64
	},
	"mat4x3<f16>": {
		align: 8,
		size: 32
	},
	"mat2x4<f32>": {
		align: 16,
		size: 32
	},
	"mat2x4<f16>": {
		align: 8,
		size: 16
	},
	"mat3x4<f32>": {
		align: 16,
		size: 48
	},
	"mat3x4<f16>": {
		align: 8,
		size: 24
	},
	"mat4x4<f32>": {
		align: 16,
		size: 64
	},
	"mat4x4<f16>": {
		align: 8,
		size: 32
	}
};
function xe(e) {
	let t = e.map((e) => ({
		data: e,
		offset: 0,
		size: 0
	})), n = 0;
	for (let e = 0; e < t.length; e++) {
		let r = t[e], i = j[r.data.type].size, a = j[r.data.type].align;
		if (!j[r.data.type]) throw Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${r.data.type}`);
		r.data.size > 1 && (i = Math.max(i, a) * r.data.size), n = Math.ceil(n / a) * a, r.size = i, r.offset = n, n += i;
	}
	return n = Math.ceil(n / 16) * 16, {
		uboElements: t,
		size: n
	};
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/generateArraySyncWGSL.mjs
function Se(e, t) {
	let { size: n, align: r } = j[e.data.type], i = (r - n) / 4, a = e.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
	return `
         v = uv.${e.data.name};
         ${t === 0 ? "" : `offset += ${t};`}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${e.data.size * (n / 4)}; i++)
         {
             for(var j = 0; j < ${n / 4}; j++)
             {
                 ${a}[arrayOffset++] = v[t++];
             }
             ${i === 0 ? "" : `arrayOffset += ${i};`}
         }
     `;
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/utils/createUboSyncFunctionWGSL.mjs
function Ce(e) {
	return pe(e, _e, Se);
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuUboSystem.mjs
var M = class extends he {
	constructor() {
		super({
			createUboElements: xe,
			generateUboSync: Ce
		});
	}
};
/** @ignore */
M.extension = {
	type: [t.WebGPUSystem],
	name: "ubo"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/GpuUniformBatchPipe.mjs
var N = 128, P = class {
	constructor(e) {
		this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._buffers = [], this._bindGroups = [], this._bufferResources = [], this._renderer = e, this._batchBuffer = new T({ minUniformOffsetAlignment: N });
		let t = 256 / N;
		for (let e = 0; e < t; e++) {
			let t = u.UNIFORM | u.COPY_DST;
			e === 0 && (t |= u.COPY_SRC), this._buffers.push(new f({
				data: this._batchBuffer.data,
				usage: t
			}));
		}
	}
	renderEnd() {
		this._uploadBindGroups(), this._resetBindGroups();
	}
	_resetBindGroups() {
		this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._batchBuffer.clear();
	}
	getUniformBindGroup(e, t) {
		if (!t && this._bindGroupHash[e.uid]) return this._bindGroupHash[e.uid];
		this._renderer.ubo.ensureUniformGroup(e);
		let n = e.buffer.data, r = this._batchBuffer.addEmptyGroup(n.length);
		return this._renderer.ubo.syncUniformGroup(e, this._batchBuffer.data, r / 4), this._bindGroupHash[e.uid] = this._getBindGroup(r / N), this._bindGroupHash[e.uid];
	}
	getUboResource(e) {
		this._renderer.ubo.updateUniformGroup(e);
		let t = e.buffer.data, n = this._batchBuffer.addGroup(t);
		return this._getBufferResource(n / N);
	}
	getArrayBindGroup(e) {
		let t = this._batchBuffer.addGroup(e);
		return this._getBindGroup(t / N);
	}
	getArrayBufferResource(e) {
		let t = this._batchBuffer.addGroup(e) / N;
		return this._getBufferResource(t);
	}
	_getBufferResource(e) {
		if (!this._bufferResources[e]) {
			let t = this._buffers[e % 2];
			this._bufferResources[e] = new ye({
				buffer: t,
				offset: (e / 2 | 0) * 256,
				size: N
			});
		}
		return this._bufferResources[e];
	}
	_getBindGroup(e) {
		if (!this._bindGroups[e]) {
			let t = new p({ 0: this._getBufferResource(e) });
			this._bindGroups[e] = t;
		}
		return this._bindGroups[e];
	}
	_uploadBindGroups() {
		let e = this._renderer.buffer, t = this._buffers[0];
		t.update(this._batchBuffer.byteIndex), e.updateBuffer(t);
		let n = this._renderer.gpu.device.createCommandEncoder();
		for (let r = 1; r < this._buffers.length; r++) {
			let i = this._buffers[r];
			n.copyBufferToBuffer(e.getGPUBuffer(t), N, e.getGPUBuffer(i), 0, this._batchBuffer.byteIndex);
		}
		this._renderer.gpu.device.queue.submit([n.finish()]);
	}
	destroy() {
		for (let e = 0; e < this._bindGroups.length; e++) this._bindGroups[e]?.destroy();
		this._bindGroups = null, this._bindGroupHash = null;
		for (let e = 0; e < this._buffers.length; e++) this._buffers[e].destroy();
		this._buffers = null;
		for (let e = 0; e < this._bufferResources.length; e++) this._bufferResources[e].destroy();
		this._bufferResources = null, this._batchBuffer.destroy(), this._renderer = null;
	}
};
/** @ignore */
P.extension = {
	type: [t.WebGPUPipes],
	name: "uniformBatch"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/pipeline/PipelineSystem.mjs
var F = {
	"point-list": 0,
	"line-list": 1,
	"line-strip": 2,
	"triangle-list": 3,
	"triangle-strip": 4
}, we = new ee({}), Te = {
	"depth24plus-stencil8": {
		depth: !0,
		stencil: !0,
		index: 1
	},
	depth24plus: {
		depth: !0,
		stencil: !1,
		index: 2
	},
	depth32float: {
		depth: !0,
		stencil: !1,
		index: 3
	},
	"depth32float-stencil8": {
		depth: !0,
		stencil: !0,
		index: 4
	},
	depth16unorm: {
		depth: !0,
		stencil: !1,
		index: 5
	},
	stencil8: {
		depth: !1,
		stencil: !0,
		index: 6
	}
}, I = {
	depth: !1,
	stencil: !1,
	index: 0
};
function L(e, t) {
	for (let [n, r] of Object.entries(t)) {
		let t = RegExp(`override\\s+${n}\\s*:\\s*(\\w+)\\s*(?:=[^;]*)?;`);
		e = e.replace(t, (e, t) => {
			let i;
			return i = t === "u32" ? `${Math.trunc(r)}u` : t === "i32" ? `${Math.trunc(r)}` : Number.isInteger(r) ? `${r}.0` : `${r}`, `const ${n}: ${t} = ${i};`;
		});
	}
	return e;
}
function R(e, t, n, r, i, a) {
	return e * 35184372088832 + t * 536870912 + a * 16384 + (n << 8) + (r << 3) + i;
}
var z = /* @__PURE__ */ Object.create(null), Ee = 0;
function B(e) {
	let t = z[e];
	return t === void 0 && (t = z[e] = Ee++), t;
}
function De(e, t, n, r, i, a, o, s) {
	return s << 20 | a << 16 | i << 13 | n << 9 | e << 6 | o << 5 | r << 1 | t;
}
var V = class {
	constructor(e) {
		this._moduleCache = /* @__PURE__ */ Object.create(null), this._bufferLayoutsCache = /* @__PURE__ */ Object.create(null), this._bindingNamesCache = /* @__PURE__ */ Object.create(null), this._pipeCache = /* @__PURE__ */ new Map(), this._pipeStateCaches = /* @__PURE__ */ Object.create(null), this._colorMask = 15, this._multisampleCount = 1, this._colorTargetCount = 1, this._colorFormat = "bgra8unorm", this._colorFormatId = B("bgra8unorm"), this._depthStencilFormat = "depth24plus-stencil8", this._depthStencilFormatData = I, this._depthReadOnly = !1, this._invertFrontFace = !1, this._renderer = e;
	}
	contextChange(e) {
		this._gpu = e, this.setStencilMode(v.DISABLED), this._updatePipeHash();
	}
	setMultisampleCount(e) {
		this._multisampleCount !== e && (this._multisampleCount = e, this._updatePipeHash());
	}
	setRenderTarget(e) {
		let t = e.colorAttachments[0]?.texture;
		this._multisampleCount = t?.source.antialias ? 4 : 1, this._colorTargetCount = e.colorAttachments.length, this._colorFormat = t?.format ?? "bgra8unorm", this._colorFormatId = B(this._colorFormat), this._depthStencilFormat = e.depthStencilAttachment?.texture.format, this._depthStencilFormatData = Te[this._depthStencilFormat] || I, this._depthReadOnly = e.depthStencilAttachment?.depthReadOnly ?? !1, this._invertFrontFace = !!e.flipY, this._updatePipeHash();
	}
	setColorMask(e) {
		this._colorMask !== e && (this._colorMask = e, this._updatePipeHash());
	}
	setStencilMode(e) {
		this._stencilMode !== e && (this._stencilMode = e, this._stencilState = ve[e], this._updatePipeHash());
	}
	/**
	* Builds a {@link GPURenderBundleEncoderDescriptor} that matches the current render target
	* configuration (color formats, sample count, and depth/stencil format).
	* Used by {@link GpuEncoderSystem.beginBundle} to create a compatible render bundle encoder.
	* @returns A descriptor for creating a GPURenderBundleEncoder.
	*/
	getBundleDescriptor() {
		let e = [];
		for (let t = 0; t < this._colorTargetCount; t++) e.push(this._colorFormat);
		let t = {
			colorFormats: e,
			sampleCount: this._multisampleCount
		};
		return (this._depthStencilFormatData.depth || this._depthStencilFormatData.stencil) && (t.depthStencilFormat = this._depthStencilFormat), t;
	}
	setPipeline(e, t, n, r) {
		let i = this.getPipeline(e, t, n);
		r.setPipeline(i);
	}
	/**
	* Generates a key for the pipeline.advanced usage only.
	* @param geometry - The geometry to get the key for
	* @param program - The program to get the key for
	* @param state - The state to get the key for
	* @param topology - The topology to get the key for
	* @param overrides - The overrides to get the key for
	* @returns The key for the pipeline
	*/
	getPipelineKey(e, t, n, r, i) {
		return e._layoutKey || (de(e, t.attributeData), this._generateBufferKey(e)), R(e._layoutKey, t._layoutKey, n.data, n._blendModeId, F[r], i.id);
	}
	getPipeline(e, t, n, r, i) {
		e._layoutKey || (de(e, t.attributeData), this._generateBufferKey(e)), r ||= e.topology, i ||= we;
		let a = R(e._layoutKey, t._layoutKey, n.data, n._blendModeId, F[r], i.id), o = this._pipeCache.get(a);
		return o || (o = this._createPipeline(e, t, n, r, i), this._pipeCache.set(a, o)), o;
	}
	_createPipeline(e, t, n, r, i) {
		let a = this._gpu.device, o = this._createVertexBufferLayouts(e, t), s = this._renderer.state.getColorTargets(n, this._colorTargetCount, this._colorFormat), c = this._stencilMode === v.RENDERING_MASK_ADD ? 0 : this._colorMask;
		for (let e = 0; e < s.length; e++) s[e].writeMask = c;
		let l = this._renderer.shader.getProgramData(t).pipeline, u = Object.keys(i.data).length > 0, d = t.vertex.source, f = t.fragment.source, p;
		u && (this._renderer.limits.supportsOverrideConstants ? p = i.data : (d = L(d, i.data), f = L(f, i.data)));
		let m = {
			vertex: {
				module: this._getModule(d),
				entryPoint: t.vertex.entryPoint,
				constants: p,
				buffers: o
			},
			fragment: {
				module: this._getModule(f),
				entryPoint: t.fragment.entryPoint,
				targets: s,
				constants: p
			},
			primitive: {
				topology: r,
				cullMode: n.culling ? "back" : "none",
				frontFace: n.clockwiseFrontFace === this._invertFrontFace ? "ccw" : "cw"
			},
			layout: l,
			multisample: { count: this._multisampleCount },
			label: t.name ? `PIXI Pipeline (${t.name})` : "PIXI Pipeline"
		};
		if (this._depthStencilFormatData.depth || this._depthStencilFormatData.stencil) {
			let e = this._depthStencilFormatData;
			m.depthStencil = {
				...this._stencilState,
				format: this._depthStencilFormat,
				depthWriteEnabled: e.depth ? n.depthMask && !this._depthReadOnly : !1,
				depthCompare: e.depth && n.depthTest ? "less" : "always"
			};
		}
		return a.createRenderPipeline(m);
	}
	_getModule(e) {
		return this._moduleCache[e] || this._createModule(e);
	}
	_createModule(e) {
		let t = this._gpu.device;
		return this._moduleCache[e] = t.createShaderModule({ code: e }), this._moduleCache[e];
	}
	/**
	* Generates and caches a numeric layout key on the geometry based on its sorted attribute
	* descriptors (offset, format, stride, instancing). Geometries with identical attribute
	* layouts share the same key, enabling pipeline reuse.
	* @param geometry - The geometry to generate a layout key for.
	*/
	_generateBufferKey(e) {
		let t = [], n = 0, r = Object.keys(e.attributes).sort();
		for (let i = 0; i < r.length; i++) {
			let a = e.attributes[r[i]];
			t[n++] = a.offset, t[n++] = a.format, t[n++] = a.stride, t[n++] = a.instance;
		}
		let i = t.join("|");
		return e._layoutKey = l(i, "geometry"), e._layoutKey;
	}
	_generateAttributeLocationsKey(e) {
		let t = [], n = 0, r = Object.keys(e.attributeData).sort();
		for (let i = 0; i < r.length; i++) {
			let a = e.attributeData[r[i]];
			t[n++] = a.location;
		}
		let i = t.join("|");
		return e._attributeLocationsKey = l(i, "programAttributes"), e._attributeLocationsKey;
	}
	/**
	* Returns a hash of buffer names mapped to bind locations.
	* This is used to bind the correct buffer to the correct location in the shader.
	* @param geometry - The geometry where to get the buffer names
	* @param program - The program where to get the buffer names
	* @returns An object of buffer names mapped to the bind location.
	*/
	getBufferNamesToBind(e, t) {
		let n = e._layoutKey << 16 | t._attributeLocationsKey;
		if (this._bindingNamesCache[n]) return this._bindingNamesCache[n];
		let r = this._createVertexBufferLayouts(e, t), i = /* @__PURE__ */ Object.create(null), a = t.attributeData;
		for (let e = 0; e < r.length; e++) {
			let t = Object.values(r[e].attributes)[0].shaderLocation;
			for (let n in a) if (a[n].location === t) {
				i[e] = n;
				break;
			}
		}
		return this._bindingNamesCache[n] = i, i;
	}
	_createVertexBufferLayouts(e, t) {
		t._attributeLocationsKey || this._generateAttributeLocationsKey(t);
		let n = e._layoutKey << 16 | t._attributeLocationsKey;
		if (this._bufferLayoutsCache[n]) return this._bufferLayoutsCache[n];
		let r = [];
		return e.buffers.forEach((n) => {
			let i = {
				arrayStride: 0,
				stepMode: "vertex",
				attributes: []
			}, a = i.attributes;
			for (let r in t.attributeData) {
				let s = e.attributes[r];
				(s.divisor ?? 1) !== 1 && o(`Attribute ${r} has an invalid divisor value of '${s.divisor}'. WebGPU only supports a divisor value of 1`), s.buffer === n && (i.arrayStride = s.stride, i.stepMode = s.instance ? "instance" : "vertex", a.push({
					shaderLocation: t.attributeData[r].location,
					offset: s.offset,
					format: s.format
				}));
			}
			a.length && r.push(i);
		}), this._bufferLayoutsCache[n] = r, r;
	}
	_updatePipeHash() {
		var e;
		let t = De(this._stencilMode, this._multisampleCount === 1 ? 0 : 1, this._colorMask, this._colorTargetCount, this._depthStencilFormatData.index, this._colorFormatId, +!!this._depthReadOnly, +!!this._invertFrontFace);
		this._pipeCache = (e = this._pipeStateCaches)[t] ?? (e[t] = /* @__PURE__ */ new Map());
	}
	destroy() {
		this._bufferLayoutsCache = null, this._pipeCache = null, this._gpu = null, this._renderer = null, this._bindingNamesCache = null, this._pipeStateCaches = null, this._moduleCache = null;
	}
};
/** @ignore */
V.extension = {
	type: [t.WebGPUSystem],
	name: "pipeline"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/renderTarget/GpuRenderTarget.mjs
var H = class {
	constructor() {
		this.contexts = [], this.msaaTextures = [], this.msaaSamples = 1;
	}
}, Oe = {
	bgra8unorm: !0,
	rgba8unorm: !0,
	rgba16float: !0
};
function ke(e) {
	if (Oe[e]) return e;
	let t = navigator.gpu.getPreferredCanvasFormat();
	return o(`[WebGPU] CanvasSource format '${e}' is not a valid GPUCanvasContext format. Falling back to '${t}'. Allowed formats are: bgra8unorm, rgba8unorm, rgba16float.`), t;
}
var Ae = class {
	constructor() {
		/**
		* The render target the currently open render pass is rendering to (plus the subresource it is
		* bound to). Used to make {@link startRenderPass} idempotent: binding the same target/mip/layer
		* again with no clear reuses the open pass instead of tearing it down and beginning a new one.
		* Reset to `null` whenever the pass is closed ({@link finishRenderPass}).
		*/
		this._activePass = null;
	}
	init(e, t) {
		this._renderer = e, this._renderTargetSystem = t;
	}
	copyToTexture(e, t, n, r, i) {
		let a = this._renderer;
		this.finishRenderPass();
		let o = this._getGpuColorTexture(e), s = a.texture.getGpuSource(t.source);
		return a.encoder.commandEncoder.copyTextureToTexture({
			texture: o,
			origin: n
		}, {
			texture: s,
			origin: i
		}, r), t;
	}
	copyDepthTexture(e, t, n, r, i) {
		let a = this._renderer;
		this.finishRenderPass();
		let o = e.depthStencilAttachment.texture, s = a.texture.getGpuSource(o), c = a.texture.getGpuSource(t.source), l = a.encoder.commandEncoder === null, u = l ? a.gpu.device.createCommandEncoder() : a.encoder.commandEncoder;
		u.copyTextureToTexture({
			texture: s,
			origin: n
		}, {
			texture: c,
			origin: i
		}, {
			width: r.width,
			height: r.height
		}), l && a.gpu.device.queue.submit([u.finish()]);
	}
	startRenderPass(e, t = !0, n, r, i = 0, a = 0) {
		let o = this._renderTargetSystem.getGpuRenderTarget(e);
		if (a !== 0 && o.msaaTextures?.length) throw Error("[RenderTargetSystem] Rendering to array layers is not supported with MSAA render targets.");
		if (i > 0 && o.msaaTextures?.length) throw Error("[RenderTargetSystem] Rendering to mip levels is not supported with MSAA render targets.");
		let s = t;
		typeof s == "boolean" && (s = s ? g.ALL : g.NONE), (e.stencil || e.depth) && !e.depthStencilAttachment && e.ensureDepthStencilTexture();
		let c = !!e.depthStencilAttachment, l = this._activePass;
		if (l !== null && l.renderTarget === e && l.mipLevel === i && l.layer === a && l.depthStencil === c && this._renderer.encoder.renderPassEncoder !== null && s === g.NONE) {
			this._renderer.encoder.setViewport(r);
			return;
		}
		o.descriptor = this.getDescriptor(e, t, n, i, a), this._renderer.pipeline.setRenderTarget(e), this._renderer.encoder.beginRenderPass(o), this._renderer.encoder.setViewport(r), this._activePass = {
			renderTarget: e,
			mipLevel: i,
			layer: a,
			depthStencil: c
		};
	}
	finishRenderPass() {
		this._renderer.encoder.endRenderPass(), this._activePass = null;
	}
	/**
	* returns the gpu texture for the first color texture in the render target
	* mainly used by the filter manager to get copy the texture for blending
	* @param renderTarget
	* @returns a gpu texture
	*/
	_getGpuColorTexture(e) {
		if (e.colorAttachments.length === 0) throw Error("[GpuRenderTargetAdaptor] cannot get gpu color texture from a depth-only render target");
		let t = e.colorAttachments[0].texture;
		return t instanceof c && t._gpuContext ? t._gpuContext.getCurrentTexture() : this._renderer.texture.getGpuSource(t);
	}
	getDescriptor(e, t, n, r = 0, i = 0) {
		typeof t == "boolean" && (t = t ? g.ALL : g.NONE);
		let a = this._renderTargetSystem, o = a.getGpuRenderTarget(e), s = e.colorAttachments.map((e, s) => {
			let l = e.texture, u = l instanceof c ? l._gpuContext : null, d, f;
			if (u) {
				if (i !== 0) throw Error("[RenderTargetSystem] Rendering to array layers is not supported for canvas targets.");
				d = u.getCurrentTexture().createView(e.viewDescriptor);
			} else d = this._renderer.texture.getTextureRenderTargetView(e.texture, r, i, e.viewDescriptor);
			let p = !1;
			o.msaaTextures[s] && (f = d, d = this._renderer.texture.getTextureView(o.msaaTextures[s]), p = o.msaaTextures[s].transient);
			let m = e.loadOp;
			t !== void 0 && (m = t & g.COLOR ? "clear" : "load"), n ??= a.defaultClearColor;
			let ee = e.storeOp ?? "store", h = {
				view: d,
				resolveTarget: f,
				storeOp: p ? "discard" : ee,
				loadOp: m
			};
			m === "clear" && (n ??= e.clearValue ?? a.defaultClearColor, h.clearValue = n);
			for (let t in e) t !== "texture" && t !== "viewDescriptor" && t !== "clearValue" && t !== "loadOp" && t !== "storeOp" && (h[t] = e[t]);
			return h;
		}), l;
		if (e.depthStencilAttachment) {
			o.msaa && (e.depthStencilAttachment.texture.sampleCount = 4), e.depthStencilAttachment.texture.transient = !!o.msaaTextures[0]?.transient;
			let n = e.depthStencilAttachment, a = n.texture.format.includes("stencil"), s = n.texture.format.includes("depth"), c = n.texture.transient ? "discard" : "store";
			l = { view: this._renderer.texture.getTextureRenderTargetView(n.texture, r, i, n.viewDescriptor) };
			let u = n.depthReadOnly ?? !1, d = n.stencilReadOnly ?? u;
			a && !d ? (l.stencilLoadOp = t & g.STENCIL ? "clear" : n.stencilLoadOp ?? "load", l.stencilStoreOp = n.stencilStoreOp ?? c, l.stencilLoadOp === "clear" && (l.stencilClearValue = n.stencilClearValue ?? 0)) : a && d && (l.stencilReadOnly = !0), s && !u ? (l.depthLoadOp = t & g.DEPTH ? "clear" : n.depthLoadOp ?? "load", l.depthStoreOp = n.depthStoreOp ?? c, l.depthLoadOp === "clear" && (l.depthClearValue = n.depthClearValue ?? 1)) : s && u && (l.depthReadOnly = !0);
			for (let e in n) e !== "texture" && e !== "viewDescriptor" && e !== "stencilLoadOp" && e !== "stencilStoreOp" && e !== "stencilClearValue" && e !== "stencilReadOnly" && e !== "depthLoadOp" && e !== "depthStoreOp" && e !== "depthClearValue" && e !== "depthReadOnly" && (l[e] = n[e]);
		}
		return {
			colorAttachments: s,
			depthStencilAttachment: l,
			label: e.label
		};
	}
	clear(e, t = !0, n, r, i = 0, a = 0) {
		if (!t) return;
		let { gpu: o, encoder: s } = this._renderer, c = o.device;
		if (s.commandEncoder === null) {
			let o = c.createCommandEncoder(), s = this.getDescriptor(e, t, n, i, a), l = o.beginRenderPass(s);
			l.setViewport(r.x, r.y, r.width, r.height, 0, 1), l.end();
			let u = o.finish();
			c.queue.submit([u]);
		} else this.startRenderPass(e, t, n, r, i, a);
	}
	initGpuRenderTarget(e) {
		e.isRoot = !0;
		let t = new H();
		return e.colorAttachments.forEach((e, n) => {
			let r = e.texture;
			if (r instanceof c) {
				if (!r._gpuContext) {
					let e = r.resource.getContext("webgpu"), t = r.transparent ? "premultiplied" : "opaque", n = ke(r.format);
					try {
						e.configure({
							device: this._renderer.gpu.device,
							usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
							format: n,
							alphaMode: t,
							...n === "rgba16float" ? { toneMapping: { mode: "extended" } } : {}
						});
					} catch (e) {
						console.error(e);
					}
					r._gpuContext = e;
				}
				t.contexts[n] = r._gpuContext;
			}
			if (t.msaa = r.source.antialias, r.antialias) {
				let e = new i({
					width: 0,
					height: 0,
					sampleCount: 4,
					transient: r.transient,
					arrayLayerCount: r.arrayLayerCount,
					format: r.format
				});
				t.msaaTextures[n] = e;
			}
		}), t.msaa && (t.msaaSamples = 4, e.depthStencilAttachment && (e.depthStencilAttachment.texture.sampleCount = 4, e.depthStencilAttachment.texture.transient = !!t.msaaTextures[0]?.transient)), t;
	}
	destroyGpuRenderTarget(e) {
		e.contexts.forEach((e) => {
			e.unconfigure();
		}), e.msaaTextures.forEach((e) => {
			e.destroy();
		}), e.msaaTextures.length = 0, e.contexts.length = 0;
	}
	ensureDepthStencilTexture(e) {
		let t = this._renderTargetSystem.getGpuRenderTarget(e);
		e.depthStencilAttachment && t.msaa && (e.depthStencilAttachment.texture.sampleCount = 4);
	}
	resizeGpuRenderTarget(e) {
		let t = this._renderTargetSystem.getGpuRenderTarget(e);
		t.width = e.width, t.height = e.height, t.msaa && e.colorAttachments.forEach((e, n) => {
			let r = e.texture;
			t.msaaTextures[n]?.resize(r.width, r.height, r._resolution);
		});
	}
}, U = class extends ae {
	constructor(e) {
		super(e), this.adaptor = new Ae(), this.adaptor.init(e, this);
	}
};
/** @ignore */
U.extension = {
	type: [t.WebGPUSystem],
	name: "renderTarget"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/shader/GpuShaderSystem.mjs
var W = class {
	constructor() {
		this._gpuProgramData = /* @__PURE__ */ Object.create(null);
	}
	contextChange(e) {
		this._gpu = e;
	}
	getProgramData(e) {
		return this._gpuProgramData[e._layoutKey] || this._createGPUProgramData(e);
	}
	_createGPUProgramData(e) {
		let t = this._gpu.device, n = e.gpuLayout.map((e) => t.createBindGroupLayout({ entries: e })), r = { bindGroupLayouts: n };
		return this._gpuProgramData[e._layoutKey] = {
			bindGroups: n,
			pipeline: t.createPipelineLayout(r)
		}, this._gpuProgramData[e._layoutKey];
	}
	destroy() {
		this._gpu = null, this._gpuProgramData = null;
	}
};
/** @ignore */
W.extension = {
	type: [t.WebGPUSystem],
	name: "shader"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/state/GpuBlendModesToPixi.mjs
var G = {};
G.normal = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	}
}, G.add = {
	alpha: {
		srcFactor: "src-alpha",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "add"
	}
}, G.multiply = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "dst",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	}
}, G.screen = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one-minus-src",
		operation: "add"
	}
}, G.overlay = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one-minus-src",
		operation: "add"
	}
}, G.none = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "zero",
		dstFactor: "zero",
		operation: "add"
	}
}, G["normal-npm"] = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "src-alpha",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	}
}, G["add-npm"] = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "add"
	},
	color: {
		srcFactor: "src-alpha",
		dstFactor: "one",
		operation: "add"
	}
}, G["screen-npm"] = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "src-alpha",
		dstFactor: "one-minus-src",
		operation: "add"
	}
}, G.erase = {
	alpha: {
		srcFactor: "zero",
		dstFactor: "one-minus-src-alpha",
		operation: "add"
	},
	color: {
		srcFactor: "zero",
		dstFactor: "one-minus-src",
		operation: "add"
	}
}, G.min = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "min"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "min"
	}
}, G.max = {
	alpha: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "max"
	},
	color: {
		srcFactor: "one",
		dstFactor: "one",
		operation: "max"
	}
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/state/GpuStateSystem.mjs
var K = class {
	constructor() {
		this.defaultState = new te(), this.defaultState.blend = !0;
	}
	contextChange(e) {
		this.gpu = e;
	}
	/**
	* Gets the blend mode data for the current state
	* @param state - The state to get the blend mode from
	* @param count - The number of color targets to create
	* @param format - The texture format of the color attachments (assumed uniform across attachments)
	*/
	getColorTargets(e, t, n) {
		let r = e.blend ? G[e.blendMode] || G.normal : void 0, i = [];
		for (let e = 0; e < t; e++) i[e] = {
			format: n,
			writeMask: 0,
			blend: r
		};
		return i;
	}
	destroy() {
		this.gpu = null;
	}
};
/** @ignore */
K.extension = {
	type: [t.WebGPUSystem],
	name: "state"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadBufferImageResource.mjs
var je = {
	type: "image",
	upload(e, t, n, r = 0) {
		let i = e.resource, a = (e.pixelWidth | 0) * (e.pixelHeight | 0), o = i.byteLength / a;
		n.device.queue.writeTexture({
			texture: t,
			origin: {
				x: 0,
				y: 0,
				z: r
			}
		}, i, {
			offset: 0,
			rowsPerImage: e.pixelHeight,
			bytesPerRow: e.pixelWidth * o
		}, {
			width: e.pixelWidth,
			height: e.pixelHeight,
			depthOrArrayLayers: 1
		});
	}
}, q = {
	"bc1-rgba-unorm": {
		blockBytes: 8,
		blockWidth: 4,
		blockHeight: 4
	},
	"bc2-rgba-unorm": {
		blockBytes: 16,
		blockWidth: 4,
		blockHeight: 4
	},
	"bc3-rgba-unorm": {
		blockBytes: 16,
		blockWidth: 4,
		blockHeight: 4
	},
	"bc7-rgba-unorm": {
		blockBytes: 16,
		blockWidth: 4,
		blockHeight: 4
	},
	"etc1-rgb-unorm": {
		blockBytes: 8,
		blockWidth: 4,
		blockHeight: 4
	},
	"etc2-rgba8unorm": {
		blockBytes: 16,
		blockWidth: 4,
		blockHeight: 4
	},
	"astc-4x4-unorm": {
		blockBytes: 16,
		blockWidth: 4,
		blockHeight: 4
	}
}, Me = {
	blockBytes: 4,
	blockWidth: 1,
	blockHeight: 1
}, Ne = {
	type: "compressed",
	upload(e, t, n, r = 0) {
		let i = e.pixelWidth, a = e.pixelHeight, o = q[e.format] || Me;
		for (let s = 0; s < e.resource.length; s++) {
			let c = e.resource[s], l = Math.ceil(i / o.blockWidth) * o.blockBytes;
			n.device.queue.writeTexture({
				texture: t,
				mipLevel: s,
				origin: {
					x: 0,
					y: 0,
					z: r
				}
			}, c, {
				offset: 0,
				bytesPerRow: l
			}, {
				width: Math.ceil(i / o.blockWidth) * o.blockWidth,
				height: Math.ceil(a / o.blockHeight) * o.blockHeight,
				depthOrArrayLayers: 1
			}), i = Math.max(i >> 1, 1), a = Math.max(a >> 1, 1);
		}
	}
}, Pe = [
	"right",
	"left",
	"top",
	"bottom",
	"front",
	"back"
];
function Fe(e) {
	return {
		type: "cube",
		upload(t, n, r) {
			let i = t.faces;
			for (let t = 0; t < Pe.length; t++) {
				let a = i[Pe[t]];
				(e[a.uploadMethodId] || e.image).upload(a, n, r, t);
			}
		}
	};
}
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/texture/uploaders/gpuUploadImageSource.mjs
var J = {
	type: "image",
	upload(e, t, n, r = 0) {
		let i = e.resource;
		if (!i) return;
		if (globalThis.HTMLImageElement && i instanceof HTMLImageElement) {
			let t = s.get().createCanvas(i.width, i.height);
			t.getContext("2d").drawImage(i, 0, 0, i.width, i.height), e.resource = t, o("ImageSource: Image element passed, converting to canvas and replacing resource.");
		}
		let a = Math.min(t.width, e.resourceWidth || e.pixelWidth), c = Math.min(t.height, e.resourceHeight || e.pixelHeight), l = e.alphaMode === "premultiply-alpha-on-upload";
		n.device.queue.copyExternalImageToTexture({ source: i }, {
			texture: t,
			origin: {
				x: 0,
				y: 0,
				z: r
			},
			premultipliedAlpha: l
		}, {
			width: a,
			height: c
		});
	}
}, Ie = {
	type: "video",
	upload(e, t, n, r) {
		J.upload(e, t, n, r);
	}
}, Le = class {
	constructor(e) {
		this.device = e, this.sampler = e.createSampler({ minFilter: "linear" }), this.pipelines = {};
	}
	_getMipmapPipeline(e) {
		let t = this.pipelines[e];
		return t || (this.mipmapShaderModule ||= this.device.createShaderModule({ code: "\n                        var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(\n                        vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));\n\n                        struct VertexOutput {\n                        @builtin(position) position : vec4<f32>,\n                        @location(0) texCoord : vec2<f32>,\n                        };\n\n                        @vertex\n                        fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {\n                        var output : VertexOutput;\n                        output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);\n                        output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);\n                        return output;\n                        }\n\n                        @group(0) @binding(0) var imgSampler : sampler;\n                        @group(0) @binding(1) var img : texture_2d<f32>;\n\n                        @fragment\n                        fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {\n                        return textureSample(img, imgSampler, texCoord);\n                        }\n                    " }), t = this.device.createRenderPipeline({
			layout: "auto",
			vertex: {
				module: this.mipmapShaderModule,
				entryPoint: "vertexMain"
			},
			fragment: {
				module: this.mipmapShaderModule,
				entryPoint: "fragmentMain",
				targets: [{ format: e }]
			}
		}), this.pipelines[e] = t), t;
	}
	/**
	* Generates mipmaps for the given GPUTexture from the data in level 0.
	* @param {module:External.GPUTexture} texture - Texture to generate mipmaps for.
	* @returns {module:External.GPUTexture} - The originally passed texture
	*/
	generateMipmap(e) {
		let t = this._getMipmapPipeline(e.format);
		if (e.dimension === "3d" || e.dimension === "1d") throw Error("Generating mipmaps for non-2d textures is currently unsupported!");
		let n = e, r = e.depthOrArrayLayers || 1, i = e.usage & GPUTextureUsage.RENDER_ATTACHMENT;
		if (!i) {
			let t = {
				size: {
					width: Math.ceil(e.width / 2),
					height: Math.ceil(e.height / 2),
					depthOrArrayLayers: r
				},
				format: e.format,
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
				mipLevelCount: e.mipLevelCount - 1
			};
			n = this.device.createTexture(t);
		}
		let a = this.device.createCommandEncoder({}), o = t.getBindGroupLayout(0);
		for (let s = 0; s < r; ++s) {
			let r = e.createView({
				baseMipLevel: 0,
				mipLevelCount: 1,
				dimension: "2d",
				baseArrayLayer: s,
				arrayLayerCount: 1
			}), c = +!!i;
			for (let i = 1; i < e.mipLevelCount; ++i) {
				let e = n.createView({
					baseMipLevel: c++,
					mipLevelCount: 1,
					dimension: "2d",
					baseArrayLayer: s,
					arrayLayerCount: 1
				}), i = a.beginRenderPass({ colorAttachments: [{
					view: e,
					storeOp: "store",
					loadOp: "clear",
					clearValue: {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}
				}] }), l = this.device.createBindGroup({
					layout: o,
					entries: [{
						binding: 0,
						resource: this.sampler
					}, {
						binding: 1,
						resource: r
					}]
				});
				i.setPipeline(t), i.setBindGroup(0, l), i.draw(3, 1, 0, 0), i.end(), r = e;
			}
		}
		if (!i) {
			let t = {
				width: Math.ceil(e.width / 2),
				height: Math.ceil(e.height / 2),
				depthOrArrayLayers: r
			};
			for (let r = 1; r < e.mipLevelCount; ++r) a.copyTextureToTexture({
				texture: n,
				mipLevel: r - 1
			}, {
				texture: e,
				mipLevel: r
			}, t), t.width = Math.ceil(t.width / 2), t.height = Math.ceil(t.height / 2);
		}
		return this.device.queue.submit([a.finish()]), i || n.destroy(), e;
	}
}, Re = class {
	constructor(e) {
		this.textureView = null, this.textureViews = /* @__PURE__ */ Object.create(null), this.gpuTexture = e;
	}
	/** Destroys this GPU data instance. */
	destroy() {
		this.gpuTexture.destroy(), this.textureView = null, this.textureViews = null, this.gpuTexture = null;
	}
};
function ze(e) {
	return `${e.format || ""}.${e.dimension || ""}.${e.aspect || ""}.${e.baseMipLevel || 0}.${e.mipLevelCount || ""}.${e.baseArrayLayer || 0}.${e.arrayLayerCount || ""}`;
}
var Y = class e {
	constructor(t) {
		this._gpuSamplers = /* @__PURE__ */ Object.create(null), this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._renderer = t, t.gc.addCollection(this, "_bindGroupHash", "hash"), this._managedTextures = new le({
			renderer: t,
			type: "resource",
			onUnload: this.onSourceUnload.bind(this),
			name: "gpuTextureSource"
		});
		let n = {
			image: J,
			buffer: je,
			video: Ie,
			compressed: Ne,
			...e.uploadExtensions
		};
		this._uploads = {
			...n,
			cube: Fe(n)
		};
	}
	/**
	* @deprecated since 8.15.0
	*/
	get managedTextures() {
		return Object.values(this._managedTextures.items);
	}
	contextChange(e) {
		this._gpu = e;
	}
	/**
	* Initializes a texture source, if it has already been initialized nothing will happen.
	* @param source - The texture source to initialize.
	* @returns The initialized texture source.
	*/
	initSource(e) {
		return e._gpuData[this._renderer.uid]?.gpuTexture || this._initSource(e);
	}
	_initSource(e) {
		if (e.autoGenerateMipmaps) {
			let t = Math.max(e.pixelWidth, e.pixelHeight);
			e.mipLevelCount = Math.floor(Math.log2(t)) + 1;
		}
		let t;
		e.sampleCount > 1 ? (t = GPUTextureUsage.RENDER_ATTACHMENT, e.transient && this._renderer.device.extensions.transientAttachment && (t |= GPUTextureUsage.TRANSIENT_ATTACHMENT)) : (t = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, e.uploadMethodId !== "compressed" && (t |= GPUTextureUsage.RENDER_ATTACHMENT, t |= GPUTextureUsage.COPY_SRC));
		let n = q[e.format] || {
			blockBytes: 4,
			blockWidth: 1,
			blockHeight: 1
		}, r = Math.ceil(e.pixelWidth / n.blockWidth) * n.blockWidth, i = Math.ceil(e.pixelHeight / n.blockHeight) * n.blockHeight, a = {
			label: e.label,
			size: {
				width: r,
				height: i,
				depthOrArrayLayers: e.arrayLayerCount
			},
			format: e.format,
			sampleCount: e.sampleCount,
			mipLevelCount: e.mipLevelCount,
			dimension: e.dimension,
			usage: t
		}, o = this._gpu.device.createTexture(a);
		return e._gpuData[this._renderer.uid] = new Re(o), this._managedTextures.add(e) && (e.on("update", this.onSourceUpdate, this), e.on("resize", this.onSourceResize, this), e.on("updateMipmaps", this.onUpdateMipmaps, this)), this.onSourceUpdate(e), o;
	}
	onSourceUpdate(e) {
		let t = this.getGpuSource(e);
		t && (this._uploads[e.uploadMethodId] && this._uploads[e.uploadMethodId].upload(e, t, this._gpu), e.autoGenerateMipmaps && e.mipLevelCount > 1 && this.onUpdateMipmaps(e));
	}
	onUpdateMipmaps(e) {
		this._mipmapGenerator ||= new Le(this._gpu.device);
		let t = this.getGpuSource(e);
		this._mipmapGenerator.generateMipmap(t);
	}
	onSourceUnload(e) {
		e.off("update", this.onSourceUpdate, this), e.off("resize", this.onSourceResize, this), e.off("updateMipmaps", this.onUpdateMipmaps, this);
	}
	onSourceResize(e) {
		e._gcLastUsed = this._renderer.gc.now;
		let t = e._gpuData[this._renderer.uid], n = t?.gpuTexture;
		n ? (n.width !== e.pixelWidth || n.height !== e.pixelHeight) && (t.destroy(), this._bindGroupHash[e.uid] = null, e._gpuData[this._renderer.uid] = null, this.initSource(e)) : this.initSource(e);
	}
	_initSampler(e) {
		return this._gpuSamplers[e._resourceId] = this._gpu.device.createSampler(e), this._gpuSamplers[e._resourceId];
	}
	getGpuSampler(e) {
		return this._gpuSamplers[e._resourceId] || this._initSampler(e);
	}
	getGpuSource(e) {
		return e._gcLastUsed = this._renderer.gc.now, e._gpuData[this._renderer.uid]?.gpuTexture || this.initSource(e);
	}
	/**
	* this returns s bind group for a specific texture, the bind group contains
	* - the texture source
	* - the texture style
	* - the texture matrix
	* This is cached so the bind group should only be created once per texture
	* @param texture - the texture you want the bindgroup for
	* @returns the bind group for the texture
	*/
	getTextureBindGroup(e) {
		return this._bindGroupHash[e.uid] || this._createTextureBindGroup(e);
	}
	_createTextureBindGroup(e) {
		let t = e.source;
		return this._bindGroupHash[e.uid] = new p({
			0: t,
			1: t.style,
			2: new h({ uTextureMatrix: {
				type: "mat3x3<f32>",
				value: e.textureMatrix.mapCoord
			} })
		}), this._bindGroupHash[e.uid];
	}
	getTextureView(e, t) {
		var n;
		let r = e.source;
		r._gcLastUsed = this._renderer.gc.now;
		let i = r._gpuData[this._renderer.uid];
		i ||= (this.initSource(r), r._gpuData[this._renderer.uid]);
		let a = t ? ze(t) : 0;
		return (n = i.textureViews)[a] || (n[a] = i.gpuTexture.createView({
			dimension: r.viewDimension,
			...t
		})), i.textureViews[a];
	}
	getTextureRenderTargetView(e, t = 0, n = 0, r) {
		var i;
		let a = e.source;
		a._gcLastUsed = this._renderer.gc.now;
		let o = a._gpuData[this._renderer.uid];
		o ||= (this.initSource(a), a._gpuData[this._renderer.uid]);
		let s = n * (a.mipLevelCount || 1) + t + 1;
		return r && (s = `${s}.${ze(r)}`), (i = o.textureViews)[s] || (i[s] = o.gpuTexture.createView({
			dimension: "2d",
			baseMipLevel: t,
			mipLevelCount: 1,
			baseArrayLayer: n,
			arrayLayerCount: 1,
			...r
		})), o.textureViews[s];
	}
	generateCanvas(e) {
		let t = this._renderer, n = t.gpu.device.createCommandEncoder(), r = s.get().createCanvas();
		r.width = e.source.pixelWidth, r.height = e.source.pixelHeight;
		let i = r.getContext("webgpu");
		return i.configure({
			device: t.gpu.device,
			usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
			format: s.get().getNavigator().gpu.getPreferredCanvasFormat(),
			alphaMode: "premultiplied"
		}), n.copyTextureToTexture({
			texture: t.texture.getGpuSource(e.source),
			origin: {
				x: 0,
				y: 0
			}
		}, { texture: i.getCurrentTexture() }, {
			width: r.width,
			height: r.height
		}), t.gpu.device.queue.submit([n.finish()]), r;
	}
	getPixels(e) {
		let t = this.generateCanvas(e), n = ue.getOptimalCanvasAndContext(t.width, t.height), r = n.context;
		r.drawImage(t, 0, 0);
		let { width: i, height: a } = t, o = r.getImageData(0, 0, i, a), s = new Uint8ClampedArray(o.data.buffer);
		return ue.returnCanvasAndContext(n), {
			pixels: s,
			width: i,
			height: a
		};
	}
	destroy() {
		this._managedTextures.destroy();
		for (let e of Object.keys(this._bindGroupHash)) {
			let t = Number(e);
			this._bindGroupHash[t]?.destroy();
		}
		this._renderer = null, this._gpu = null, this._mipmapGenerator = null, this._gpuSamplers = null, this._bindGroupHash = null;
	}
};
/**
* Optional uploaders registered via {@link ExtensionType.TextureUploaderWebGPU}. Each entry is
* merged into {@link _uploads} at construction time, so import order matters: register the
* extension before creating the renderer.
* @internal
*/
Y.extension = {
	type: [t.WebGPUSystem],
	name: "texture"
}, Y.uploadExtensions = /* @__PURE__ */ Object.create(null);
var X = Y;
n.handleByMap(t.TextureUploaderWebGPU, X.uploadExtensions);
//#endregion
//#region node_modules/pixi.js/lib/scene/graphics/gpu/GpuGraphicsAdaptor.mjs
var Z = class {
	constructor() {
		this._maxTextures = 0;
	}
	contextChange(e) {
		let t = new h({
			uTransformMatrix: {
				value: new a(),
				type: "mat3x3<f32>"
			},
			uColor: {
				value: new Float32Array([
					1,
					1,
					1,
					1
				]),
				type: "vec4<f32>"
			},
			uRound: {
				value: 0,
				type: "f32"
			}
		});
		this._maxTextures = e.limits.maxBatchableTextures;
		let n = b({
			name: "graphics",
			bits: [
				se,
				ce(this._maxTextures),
				ge,
				y
			]
		});
		this.shader = new m({
			gpuProgram: n,
			resources: { localUniforms: t }
		});
	}
	execute(e, t) {
		let n = t.context, r = n.customShader || this.shader, i = e.renderer, { batcher: a, instructions: o } = i.graphicsContext.getContextRenderData(n), s = i.encoder;
		s.setGeometry(a.geometry, r.gpuProgram);
		let c = i.globalUniforms.bindGroup;
		s.setBindGroup(0, c, r.gpuProgram);
		let l = i.renderPipes.uniformBatch.getUniformBindGroup(r.resources.localUniforms, !0);
		s.setBindGroup(2, l, r.gpuProgram);
		let u = o.instructions, d = null;
		for (let t = 0; t < o.instructionSize; t++) {
			let n = u[t];
			if (n.topology !== d && (d = n.topology, s.setPipelineFromGeometryProgramAndState(a.geometry, r.gpuProgram, e.state, n.topology, r._overrides)), r.groups[1] = n.bindGroup, !n.gpuBindGroup) {
				let e = n.textures;
				n.bindGroup = _(e.textures, e.count, this._maxTextures), n.gpuBindGroup = i.bindGroup.getBindGroup(n.bindGroup, r.gpuProgram, 1);
			}
			s.setBindGroup(1, n.bindGroup, r.gpuProgram), s.renderPassEncoder.drawIndexed(n.size, 1, n.start);
		}
	}
	destroy() {
		this.shader.destroy(!0), this.shader = null;
	}
};
/** @ignore */
Z.extension = {
	type: [t.WebGPUPipesAdaptor],
	name: "graphics"
};
//#endregion
//#region node_modules/pixi.js/lib/scene/mesh/gpu/GpuMeshAdapter.mjs
var Q = class {
	init() {
		let e = b({
			name: "mesh",
			bits: [
				fe,
				me,
				y
			]
		});
		this._shader = new m({
			gpuProgram: e,
			resources: {
				uTexture: r.EMPTY._source,
				uSampler: r.EMPTY._source.style,
				textureUniforms: { uTextureMatrix: {
					type: "mat3x3<f32>",
					value: new a()
				} }
			}
		});
	}
	execute(e, t) {
		let n = e.renderer, r = t._shader;
		if (!r) r = this._shader, r.groups[2] = n.texture.getTextureBindGroup(t.texture);
		else if (!r.gpuProgram) {
			o("Mesh shader has no gpuProgram", t.shader);
			return;
		}
		let i = r.gpuProgram;
		if (i.autoAssignGlobalUniforms && (r.groups[0] = n.globalUniforms.bindGroup), i.autoAssignLocalUniforms) {
			let t = e.localUniforms;
			r.groups[1] = n.renderPipes.uniformBatch.getUniformBindGroup(t, !0);
		}
		n.encoder.draw({
			geometry: t._geometry,
			shader: r,
			state: t.state
		});
	}
	destroy() {
		this._shader.destroy(!0), this._shader = null;
	}
};
/** @ignore */
Q.extension = {
	type: [t.WebGPUPipesAdaptor],
	name: "mesh"
};
//#endregion
//#region node_modules/pixi.js/lib/rendering/renderers/gpu/WebGPURenderer.mjs
var Be = /* @__PURE__ */ e({ WebGPURenderer: () => $ }), Ve = [
	...re,
	M,
	O,
	D,
	k,
	w,
	X,
	U,
	W,
	K,
	V,
	E,
	A,
	C
], He = [...ie, P], Ue = [
	S,
	Q,
	Z
], We = [], Ge = [], Ke = [];
n.handleByNamedList(t.WebGPUSystem, We), n.handleByNamedList(t.WebGPUPipes, Ge), n.handleByNamedList(t.WebGPUPipesAdaptor, Ke), n.add(...Ve, ...He, ...Ue);
var $ = class extends ne {
	constructor() {
		let e = {
			name: "webgpu",
			type: d.WEBGPU,
			systems: We,
			renderPipes: Ge,
			renderPipeAdaptors: Ke
		};
		super(e);
	}
};
//#endregion
export { O as A, M as C, xe as D, j as E, w as F, C as I, S as L, E as M, T as N, A as O, be as P, P as S, Se as T, U as _, Re as a, V as b, Ie as c, q as d, Ne as f, W as g, G as h, Z as i, D as j, k, J as l, K as m, Be as n, X as o, je as p, Q as r, Le as s, $ as t, Fe as u, Ae as v, Ce as w, L as x, H as y };
