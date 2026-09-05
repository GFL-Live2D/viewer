import { t as e } from "./rolldown-runtime-B0aSnxlc.js";
import { F as t, I as n, f as r, t as i } from "./adapter-DdgmR4Id.js";
import { a, i as o, r as s, t as c } from "./Ticker-CsadseLF.js";
import { t as l } from "./path-Bujoe2Qb.js";
//#region node_modules/js-binary-schema-parser/lib/index.js
var u = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.loop = e.conditional = e.parse = void 0, e.parse = function e(t, n) {
		var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : r;
		if (Array.isArray(n)) n.forEach(function(n) {
			return e(t, n, r, i);
		});
		else if (typeof n == "function") n(t, r, i, e);
		else {
			var a = Object.keys(n)[0];
			Array.isArray(n[a]) ? (i[a] = {}, e(t, n[a], r, i[a])) : i[a] = n[a](t, r, i, e);
		}
		return r;
	}, e.conditional = function(e, t) {
		return function(n, r, i, a) {
			t(n, r, i) && a(n, e, r, i);
		};
	}, e.loop = function(e, t) {
		return function(n, r, i, a) {
			for (var o = [], s = n.pos; t(n, r, i);) {
				var c = {};
				if (a(n, e, r, c), n.pos === s) break;
				s = n.pos, o.push(c);
			}
			return o;
		};
	};
})), d = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.readBits = e.readArray = e.readUnsigned = e.readString = e.peekBytes = e.readBytes = e.peekByte = e.readByte = e.buildStream = void 0, e.buildStream = function(e) {
		return {
			data: e,
			pos: 0
		};
	};
	var t = function() {
		return function(e) {
			return e.data[e.pos++];
		};
	};
	e.readByte = t, e.peekByte = function() {
		var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
		return function(t) {
			return t.data[t.pos + e];
		};
	};
	var n = function(e) {
		return function(t) {
			return t.data.subarray(t.pos, t.pos += e);
		};
	};
	e.readBytes = n, e.peekBytes = function(e) {
		return function(t) {
			return t.data.subarray(t.pos, t.pos + e);
		};
	}, e.readString = function(e) {
		return function(t) {
			return Array.from(n(e)(t)).map(function(e) {
				return String.fromCharCode(e);
			}).join("");
		};
	}, e.readUnsigned = function(e) {
		return function(t) {
			var r = n(2)(t);
			return e ? (r[1] << 8) + r[0] : (r[0] << 8) + r[1];
		};
	}, e.readArray = function(e, t) {
		return function(r, i, a) {
			for (var o = typeof t == "function" ? t(r, i, a) : t, s = n(e), c = Array(o), l = 0; l < o; l++) c[l] = s(r);
			return c;
		};
	};
	var r = function(e, t, n) {
		for (var r = 0, i = 0; i < n; i++) r += e[t + i] && 2 ** (n - i - 1);
		return r;
	};
	e.readBits = function(e) {
		return function(n) {
			for (var i = t()(n), a = Array(8), o = 0; o < 8; o++) a[7 - o] = !!(i & 1 << o);
			return Object.keys(e).reduce(function(t, n) {
				var i = e[n];
				return t[n] = i.length ? r(a, i.index, i.length) : a[i.index], t;
			}, {});
		};
	};
})), f = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.default = void 0;
	var t = u(), n = d(), r = { blocks: function(e) {
		for (var t = 0, r = [], i = e.data.length, a = 0, o = (0, n.readByte)()(e); o !== t && o; o = (0, n.readByte)()(e)) {
			if (e.pos + o >= i) {
				var s = i - e.pos;
				r.push((0, n.readBytes)(s)(e)), a += s;
				break;
			}
			r.push((0, n.readBytes)(o)(e)), a += o;
		}
		for (var c = new Uint8Array(a), l = 0, u = 0; u < r.length; u++) c.set(r[u], l), l += r[u].length;
		return c;
	} }, i = (0, t.conditional)({ gce: [
		{ codes: (0, n.readBytes)(2) },
		{ byteSize: (0, n.readByte)() },
		{ extras: (0, n.readBits)({
			future: {
				index: 0,
				length: 3
			},
			disposal: {
				index: 3,
				length: 3
			},
			userInput: { index: 6 },
			transparentColorGiven: { index: 7 }
		}) },
		{ delay: (0, n.readUnsigned)(!0) },
		{ transparentColorIndex: (0, n.readByte)() },
		{ terminator: (0, n.readByte)() }
	] }, function(e) {
		var t = (0, n.peekBytes)(2)(e);
		return t[0] === 33 && t[1] === 249;
	}), a = (0, t.conditional)({ image: [
		{ code: (0, n.readByte)() },
		{ descriptor: [
			{ left: (0, n.readUnsigned)(!0) },
			{ top: (0, n.readUnsigned)(!0) },
			{ width: (0, n.readUnsigned)(!0) },
			{ height: (0, n.readUnsigned)(!0) },
			{ lct: (0, n.readBits)({
				exists: { index: 0 },
				interlaced: { index: 1 },
				sort: { index: 2 },
				future: {
					index: 3,
					length: 2
				},
				size: {
					index: 5,
					length: 3
				}
			}) }
		] },
		(0, t.conditional)({ lct: (0, n.readArray)(3, function(e, t, n) {
			return 2 ** (n.descriptor.lct.size + 1);
		}) }, function(e, t, n) {
			return n.descriptor.lct.exists;
		}),
		{ data: [{ minCodeSize: (0, n.readByte)() }, r] }
	] }, function(e) {
		return (0, n.peekByte)()(e) === 44;
	}), o = (0, t.conditional)({ text: [
		{ codes: (0, n.readBytes)(2) },
		{ blockSize: (0, n.readByte)() },
		{ preData: function(e, t, r) {
			return (0, n.readBytes)(r.text.blockSize)(e);
		} },
		r
	] }, function(e) {
		var t = (0, n.peekBytes)(2)(e);
		return t[0] === 33 && t[1] === 1;
	}), s = (0, t.conditional)({ application: [
		{ codes: (0, n.readBytes)(2) },
		{ blockSize: (0, n.readByte)() },
		{ id: function(e, t, r) {
			return (0, n.readString)(r.blockSize)(e);
		} },
		r
	] }, function(e) {
		var t = (0, n.peekBytes)(2)(e);
		return t[0] === 33 && t[1] === 255;
	}), c = (0, t.conditional)({ comment: [{ codes: (0, n.readBytes)(2) }, r] }, function(e) {
		var t = (0, n.peekBytes)(2)(e);
		return t[0] === 33 && t[1] === 254;
	});
	e.default = [
		{ header: [{ signature: (0, n.readString)(3) }, { version: (0, n.readString)(3) }] },
		{ lsd: [
			{ width: (0, n.readUnsigned)(!0) },
			{ height: (0, n.readUnsigned)(!0) },
			{ gct: (0, n.readBits)({
				exists: { index: 0 },
				resolution: {
					index: 1,
					length: 3
				},
				sort: { index: 4 },
				size: {
					index: 5,
					length: 3
				}
			}) },
			{ backgroundColorIndex: (0, n.readByte)() },
			{ pixelAspectRatio: (0, n.readByte)() }
		] },
		(0, t.conditional)({ gct: (0, n.readArray)(3, function(e, t) {
			return 2 ** (t.lsd.gct.size + 1);
		}) }, function(e, t) {
			return t.lsd.gct.exists;
		}),
		{ frames: (0, t.loop)([
			i,
			s,
			c,
			a,
			o
		], function(e) {
			var t = (0, n.peekByte)()(e);
			return t === 33 || t === 44;
		}) }
	];
})), p = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.deinterlace = void 0, e.deinterlace = function(e, t) {
		for (var n = Array(e.length), r = e.length / t, i = function(r, i) {
			var a = e.slice(i * t, (i + 1) * t);
			n.splice.apply(n, [r * t, t].concat(a));
		}, a = [
			0,
			4,
			2,
			1
		], o = [
			8,
			8,
			4,
			2
		], s = 0, c = 0; c < 4; c++) for (var l = a[c]; l < r; l += o[c]) i(l, s), s++;
		return n;
	};
})), m = /* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.lzw = void 0, e.lzw = function(e, t, n) {
		var r = 4096, i = -1, a = n, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S = Array(n), C = Array(r), w = Array(r), T = Array(r + 1);
		for (_ = e, s = 1 << _, u = s + 1, o = s + 2, f = i, l = _ + 1, c = (1 << l) - 1, m = 0; m < s; m++) C[m] = 0, w[m] = m;
		var g = p = v = y = x = b = 0, p, v, y, x, b;
		for (h = 0; h < a;) {
			if (y === 0) {
				if (p < l) {
					g += t[b] << p, p += 8, b++;
					continue;
				}
				if (m = g & c, g >>= l, p -= l, m > o || m == u) break;
				if (m == s) {
					l = _ + 1, c = (1 << l) - 1, o = s + 2, f = i;
					continue;
				}
				if (f == i) {
					T[y++] = w[m], f = m, v = m;
					continue;
				}
				for (d = m, m == o && (T[y++] = v, m = f); m > s;) T[y++] = w[m], m = C[m];
				v = w[m] & 255, T[y++] = v, o < r && (C[o] = f, w[o] = v, o++, (o & c) === 0 && o < r && (l++, c += o)), f = d;
			}
			y--, S[x++] = T[y], h++;
		}
		for (h = x; h < a; h++) S[h] = 0;
		return S;
	};
})), h = (/* @__PURE__ */ e(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.decompressFrames = e.decompressFrame = e.parseGIF = void 0;
	var t = o(f()), n = u(), r = d(), i = p(), a = m();
	function o(e) {
		return e && e.__esModule ? e : { default: e };
	}
	e.parseGIF = function(e) {
		var i = new Uint8Array(e);
		return (0, n.parse)((0, r.buildStream)(i), t.default);
	};
	var s = function(e) {
		for (var t = e.pixels.length, n = new Uint8ClampedArray(t * 4), r = 0; r < t; r++) {
			var i = r * 4, a = e.pixels[r], o = e.colorTable[a] || [
				0,
				0,
				0
			];
			n[i] = o[0], n[i + 1] = o[1], n[i + 2] = o[2], n[i + 3] = a === e.transparentIndex ? 0 : 255;
		}
		return n;
	}, c = function(e, t, n) {
		if (!e.image) {
			console.warn("gif frame does not have associated image.");
			return;
		}
		var r = e.image, o = r.descriptor.width * r.descriptor.height, c = (0, a.lzw)(r.data.minCodeSize, r.data.blocks, o);
		r.descriptor.lct.interlaced && (c = (0, i.deinterlace)(c, r.descriptor.width));
		var l = {
			pixels: c,
			dims: {
				top: e.image.descriptor.top,
				left: e.image.descriptor.left,
				width: e.image.descriptor.width,
				height: e.image.descriptor.height
			}
		};
		return l.colorTable = r.descriptor.lct && r.descriptor.lct.exists ? r.lct : t, e.gce && (l.delay = (e.gce.delay || 10) * 10, l.disposalType = e.gce.extras.disposal, e.gce.extras.transparentColorGiven && (l.transparentIndex = e.gce.transparentColorIndex)), n && (l.patch = s(l)), l;
	};
	e.decompressFrame = c, e.decompressFrames = function(e, t) {
		return e.frames.filter(function(e) {
			return e.image;
		}).map(function(n) {
			return c(n, e.gct, t);
		});
	};
})))(), g = class e {
	/**
	* @param frames - Array of GifFrame instances.
	*/
	constructor(e) {
		if (!e || !e.length) throw Error("Invalid frames");
		let [{ texture: { width: t, height: n } }] = e;
		this.width = t, this.height = n, this.frames = e, this.textures = this.frames.map((e) => e.texture), this.totalFrames = this.frames.length, this.duration = this.frames[this.totalFrames - 1].end;
	}
	/** Destroy animation data and don't use after this */
	destroy() {
		for (let e of this.textures) e.destroy(!0);
		for (let e of this.frames) e.texture = null;
		this.frames.length = 0, this.textures.length = 0, Object.assign(this, {
			frames: null,
			textures: null,
			width: 0,
			height: 0,
			duration: 0,
			totalFrames: 0
		});
	}
	/**
	* Create an animated GIF animation from a GIF image's ArrayBuffer. The easiest way to get
	* the buffer is to use Assets.
	* @example
	* import { GifSource, GifSprite } from 'pixi.js/gif';
	*
	* const buffer = await fetch('./file.gif').then(res => res.arrayBuffer());
	* const source = GifSource.from(buffer);
	* const sprite = new GifSprite(source);
	* @param buffer - GIF image arraybuffer from Assets.
	* @param options - Optional options to use when building from buffer.
	*/
	static from(t, n) {
		if (!t || t.byteLength === 0) throw Error("Invalid buffer");
		let a = (e) => {
			let t = null;
			for (let n of e.frames) t = n.gce ?? t, "image" in n && !("gce" in n) && (n.gce = t);
		}, s = (0, h.parseGIF)(t);
		a(s);
		let c = (0, h.decompressFrames)(s, !0), l = [], u = s.lsd.width, d = s.lsd.height, f = i.get().createCanvas(u, d), p = f.getContext("2d", { willReadFrequently: !0 }), m = i.get().createCanvas(), g = m.getContext("2d"), _ = 0, v = null, { fps: y = 30, ...b } = n ?? {}, x = 1e3 / y;
		for (let e = 0; e < c.length; e++) {
			let { disposalType: t = 2, delay: n = x, patch: a, dims: { width: s, height: f, left: h, top: y } } = c[e];
			m.width = s, m.height = f, g.clearRect(0, 0, s, f);
			let S = g.createImageData(s, f);
			S.data.set(a), g.putImageData(S, 0, 0), t === 3 && (v = p.getImageData(0, 0, u, d)), p.drawImage(m, h, y);
			let C = p.getImageData(0, 0, u, d);
			t === 2 ? p.clearRect(0, 0, u, d) : t === 3 && p.putImageData(v, 0, 0);
			let w = i.get().createCanvas(C.width, C.height);
			w.getContext("2d").putImageData(C, 0, 0), l.push({
				start: _,
				end: _ + n,
				texture: new r({ source: new o({
					resource: w,
					...b
				}) })
			}), _ += n;
		}
		return f.width = f.height = 0, m.width = m.height = 0, new e(l);
	}
}, _ = {
	extension: t.Asset,
	detection: {
		test: async () => !0,
		add: async (e) => [...e, "gif"],
		remove: async (e) => e.filter((e) => e !== "gif")
	},
	loader: {
		/** used for deprecation purposes */
		name: "gifLoader",
		id: "gif",
		test: (e) => l.extname(e) === ".gif" || e.startsWith("data:image/gif"),
		load: async (e, t) => {
			let n = await (await i.get().fetch(e)).arrayBuffer();
			return g.from(n, t?.data);
		},
		unload: async (e) => {
			e.destroy();
		}
	}
}, v = class e extends a {
	constructor(...t) {
		let n = t[0] instanceof g ? { source: t[0] } : t[0], { source: i, fps: a, loop: o, animationSpeed: s, autoPlay: c, autoUpdate: l, onComplete: u, onFrameChange: d, onLoop: f, ...p } = Object.assign({}, e.defaultOptions, n);
		super({
			texture: r.EMPTY,
			...p
		}), this.animationSpeed = 1, this.loop = !0, this.duration = 0, this.autoPlay = !0, this.dirty = !1, this._currentFrame = 0, this._autoUpdate = !1, this._isConnectedToTicker = !1, this._playing = !1, this._currentTime = 0, this.onRender = () => this._updateFrame(), this.texture = i.textures[0], this.duration = i.frames[i.frames.length - 1].end, this._source = i, this._playing = !1, this._currentTime = 0, this._isConnectedToTicker = !1, Object.assign(this, {
			fps: a,
			loop: o,
			animationSpeed: s,
			autoPlay: c,
			autoUpdate: l,
			onComplete: u,
			onFrameChange: d,
			onLoop: f
		}), this.currentFrame = 0, c && this.play();
	}
	/**
	* Stops the animation playback.
	* Halts at the current frame and disconnects from the ticker if auto-updating.
	* @example
	* ```ts
	* // Basic stop
	* const animation = new GifSprite({ source });
	* animation.stop();
	*
	* // Stop at specific frame
	* animation.currentFrame = 5;
	* animation.stop();
	*
	* // Stop and reset
	* animation.currentFrame = 0;
	* animation.stop();
	* ```
	* @remarks
	* - Does nothing if animation is already stopped
	* - Maintains current frame position
	* - Disconnects from shared ticker if auto-updating
	* - Can be resumed with play()
	* @see {@link GifSprite.play} For resuming playback
	* @see {@link GifSprite.currentFrame} For frame control
	*/
	stop() {
		this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (c.shared.remove(this.update, this), this._isConnectedToTicker = !1));
	}
	/**
	* Starts or resumes animation playback.
	* If animation is at the last frame and not looping, playback will restart from the beginning.
	* @example
	* ```ts
	* // Basic playback
	* const animation = new GifSprite({ source, autoPlay: false });
	* animation.play();
	*
	* // Play after stopping
	* animation.stop();
	* animation.play(); // Resumes from current frame
	*
	* // Play with auto-updating disabled
	* const animation = new GifSprite({
	*     source,
	*     autoPlay: false,
	*     autoUpdate: false
	* });
	* animation.play();
	* app.ticker.add((ticker) => {
	*     animation.update(ticker);
	* });
	* ```
	* @remarks
	* - Does nothing if animation is already playing
	* - Connects to shared ticker if autoUpdate is true
	* - Restarts from beginning if at last frame of non-looping animation
	* - Maintains current frame position otherwise
	* @see {@link GifSprite.stop} For stopping playback
	* @see {@link GifSprite.playing} For checking playback status
	* @see {@link GifSprite.autoUpdate} For controlling automatic updates
	*/
	play() {
		this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (c.shared.add(this.update, this, s.HIGH), this._isConnectedToTicker = !0), !this.loop && this.currentFrame === this._source.frames.length - 1 && (this._currentTime = 0));
	}
	/**
	* Gets the current progress of the animation as a value between 0 and 1.
	* Useful for tracking animation completion and implementing progress bars.
	* @example
	* ```ts
	* // Basic progress tracking
	* const animation = new GifSprite({ source });
	* console.log('Progress:', Math.round(animation.progress * 100) + '%');
	*
	* // Update progress bar
	* app.ticker.add(() => {
	*     progressBar.width = animation.progress * 200; // 200px total width
	* });
	*
	* // Check if animation is near end
	* if (animation.progress > 0.9) {
	*     console.log('Animation almost complete!');
	* }
	* ```
	* @remarks
	* - Returns 0 at start
	* - Returns 1 when complete
	* - Updates continuously during playback
	* - Based on currentTime and total duration
	* @readonly
	* @see {@link GifSprite.duration} For total animation length
	*/
	get progress() {
		return this._currentTime / this.duration;
	}
	/** `true` if the current animation is playing */
	get playing() {
		return this._playing;
	}
	/**
	* Updates the object transform for rendering.
	* This method is called automatically by the ticker if `autoUpdate` is enabled.
	* Only updates if the animation is currently playing.
	* > [!IMPORTANT] Call this manually when `autoUpdate` is set to `false` to control animation timing.
	* @param ticker - Ticker instance used to calculate frame timing
	* @example
	* ```ts
	* // Manual update with app ticker
	* const animation = new GifSprite({
	*     source,
	*     autoUpdate: false
	* });
	*
	* // Add to custom ticker
	* app.ticker.add(() => {
	*     animation.update(app.ticker);
	* });
	*
	* // Update with custom timing
	* const customTicker = new Ticker();
	* customTicker.add(() => {
	*     animation.update(customTicker);
	* });
	* ```
	* @see {@link GifSprite.autoUpdate} For automatic update control
	* @see {@link GifSprite.playing} For playback state
	* @see {@link Ticker} For timing system details
	*/
	update(e) {
		if (!this._playing) return;
		let t = this.animationSpeed * e.deltaTime / c.targetFPMS, n = this._currentTime + t, r = n % this.duration, i = this._source.frames.findIndex((e) => e.start <= r && e.end > r);
		n >= this.duration ? this.loop ? (this._currentTime = r, this._updateFrameIndex(i), this.onLoop?.()) : (this._currentTime = this.duration, this._updateFrameIndex(this.totalFrames - 1), this.onComplete?.(), this.stop()) : (this._currentTime = r, this._updateFrameIndex(i));
	}
	/** Redraw the current frame, is necessary for the animation to work when */
	_updateFrame() {
		this.dirty &&= (this.texture = this._source.frames[this._currentFrame].texture, !1);
	}
	/**
	* Whether to use {@link Ticker.shared} to auto update animation time.
	* Controls if the animation updates automatically using the shared ticker.
	* @example
	* ```ts
	* // Using auto-update (default)
	* const animation = new GifSprite({
	*     source,
	*     autoUpdate: true
	* });
	*
	* // Manual updates
	* const animation = new GifSprite({
	*     source,
	*     autoUpdate: false
	* });
	*
	* // Custom update loop
	* app.ticker.add(() => {
	*     animation.update(app.ticker);
	* });
	*
	* // Switch update modes at runtime
	* animation.autoUpdate = false; // Disconnect from shared ticker
	* animation.autoUpdate = true;  // Reconnect if playing
	* ```
	* @default true
	* @see {@link GifSprite.update} For manual updating
	* @see {@link Ticker.shared} For the shared ticker instance
	*/
	get autoUpdate() {
		return this._autoUpdate;
	}
	set autoUpdate(e) {
		e !== this._autoUpdate && (this._autoUpdate = e, !this._autoUpdate && this._isConnectedToTicker ? (c.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (c.shared.add(this.update, this), this._isConnectedToTicker = !0));
	}
	/**
	* Gets or sets the current frame number.
	* Controls which frame of the GIF animation is currently displayed.
	* @example
	* ```ts
	* // Get current frame
	* const animation = new GifSprite({ source });
	* console.log('Current frame:', animation.currentFrame);
	*
	* // Jump to specific frame
	* animation.currentFrame = 5;
	*
	* // Reset to first frame
	* animation.currentFrame = 0;
	*
	* // Get frame at specific progress
	* const frameAtProgress = Math.floor(animation.totalFrames * 0.5); // 50%
	* animation.currentFrame = frameAtProgress;
	* ```
	* @throws {Error} If frame index is out of range
	* @remarks
	* - Zero-based index (0 to totalFrames-1)
	* - Updates animation time to frame start
	* - Triggers frame change callback
	* - Marks sprite as dirty for redraw
	* @see {@link GifSprite.totalFrames} For frame count
	* @see {@link GifSprite.onFrameChange} For frame change events
	*/
	get currentFrame() {
		return this._currentFrame;
	}
	set currentFrame(e) {
		this._updateFrameIndex(e), this._currentTime = this._source.frames[e].start;
	}
	/**
	* The source GIF data containing frame textures and timing information.
	* This represents the underlying animation data used by the sprite.
	* @example
	* ```ts
	* // Access source data
	* const animation = new GifSprite({ source });
	* const frameCount = animation.source.totalFrames;
	* const frameTexture = animation.source.textures[0];
	*
	* // Share source between sprites
	* const clone = new GifSprite({
	*     source: animation.source,
	*     autoPlay: false
	* });
	*
	* // Check source properties
	* console.log('Total frames:', animation.source.totalFrames);
	* console.log('Frame timing:', animation.source.frames);
	* ```
	* @remarks
	* - Contains all frame textures
	* - Manages frame timing data
	* - Can be shared between sprites
	* - Destroyed with sprite if destroyData=true
	* @readonly
	* @see {@link GifSource} For source data implementation
	* @see {@link GifSprite.clone} For creating independent instances
	*/
	get source() {
		return this._source;
	}
	/**
	* Internally handle updating the frame index
	* @param value
	*/
	_updateFrameIndex(e) {
		if (e < 0 || e >= this.totalFrames) throw Error(`Frame index out of range, expecting 0 to ${this.totalFrames}, got ${e}`);
		this._currentFrame !== e && (this._currentFrame = e, this.dirty = !0, this.onFrameChange?.(e));
	}
	/**
	* Gets the total number of frames in the GIF animation.
	* @example
	* ```ts
	* // Get total frames
	* const animation = new GifSprite({ source });
	* console.log('Total frames:', animation.totalFrames);
	* ```
	* @readonly
	* @see {@link GifSprite.currentFrame} For current frame index
	* @see {@link GifSource.totalFrames} For source frame count
	*/
	get totalFrames() {
		return this._source.totalFrames;
	}
	/**
	* Destroy and don't use after this.
	* @param destroyData - Destroy the data, cannot be used again.
	* @example
	* ```ts
	* const animation = new GifSprite({ source });
	* // Do something with animation...
	* animation.destroy(true); // Destroy the animation and its source data
	*
	* // If you want to keep the source data for reuse, use:
	* animation.destroy(false); // Destroy the animation but keep source data
	* ```
	*/
	destroy(e = !1) {
		this.stop(), super.destroy(), e && this._source.destroy(), this._source = null, this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
	}
	/**
	* Creates an independent copy of this GifSprite instance.
	* Useful for creating multiple animations that share the same source data
	* but can be controlled independently.
	* > [!IMPORTANT]
	* > The cloned sprite will have its own playback state, so you can play,
	* > pause, or seek it without affecting the original sprite.
	* @example
	* ```ts
	* // Create original animation
	* const animation = new GifSprite({ source });
	*
	* // Create independent clone
	* const clone = animation.clone();
	* clone.play();  // Plays independently
	* animation.stop(); // Original stops, clone continues
	*
	* // Clone with modified properties
	* const halfSpeed = animation.clone();
	* halfSpeed.animationSpeed = 0.5;
	* ```
	* @returns {GifSprite} A new GifSprite instance with the same properties
	* @see {@link GifSprite.source} For shared source data
	* @see {@link GifSprite.destroy} For cleanup
	*/
	clone() {
		let t = new e({
			source: this._source,
			autoUpdate: this._autoUpdate,
			loop: this.loop,
			autoPlay: this.autoPlay,
			animationSpeed: this.animationSpeed,
			onComplete: this.onComplete,
			onFrameChange: this.onFrameChange,
			onLoop: this.onLoop
		});
		return t.dirty = !0, t;
	}
};
/**
* Default configuration options for GifSprite instances.
*
* These values are used when specific options are not provided to the constructor.
* Each property can be overridden by passing it in the options object.
* @example
* ```ts
* GifSprite.defaultOptions.fps = 24; // Change default FPS to 24
* GifSprite.defaultOptions.loop = false; // Disable looping by default
*
* const animation = new GifSprite(); // Will use these defaults
* ```
*/
v.defaultOptions = {
	fps: 30,
	loop: !0,
	animationSpeed: 1,
	autoPlay: !0,
	autoUpdate: !0,
	onComplete: null,
	onFrameChange: null,
	onLoop: null
};
var y = v;
//#endregion
//#region node_modules/pixi.js/lib/gif/init.mjs
n.add(_);
//#endregion
export { g as GifSource, y as GifSprite };
