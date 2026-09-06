import { F as e, I as t, P as n, t as r } from "./adapter-DdgmR4Id.js";
import "./lib-D_Ni3XdB.js";
import { t as i } from "./Ticker-CsadseLF.js";
import { v as a } from "./FilterSystem-CvO_BC_v.js";
import { t as o } from "./path-Bujoe2Qb.js";
//#region node_modules/@pixi/sound/lib/instance.mjs
var s;
function c(e) {
	return s = e, e;
}
function l() {
	return s;
}
//#endregion
//#region node_modules/@pixi/sound/lib/filters/Filter.mjs
var u = class {
	/**
	* @param {AudioNode} destination - The audio node to use as the destination for the input AudioNode
	* @param {AudioNode} [source] - Optional output node, defaults to destination node. This is useful
	*        when creating filters which contains multiple AudioNode elements chained together.
	*/
	constructor(e, t) {
		this.init(e, t);
	}
	/** Reinitialize */
	init(e, t) {
		this.destination = e, this.source = t || e;
	}
	/**
	* Connect to the destination.
	* @param {AudioNode} destination - The destination node to connect the output to
	*/
	connect(e) {
		this.source?.connect(e);
	}
	/** Completely disconnect filter from destination and source nodes. */
	disconnect() {
		this.source?.disconnect();
	}
	/** Destroy the filter and don't use after this. */
	destroy() {
		this.disconnect(), this.destination = null, this.source = null;
	}
}, d = class {
	/**
	* Dezippering is removed in the future Web Audio API, instead
	* we use the `setValueAtTime` method, however, this is not available
	* in all environments (e.g., Android webview), so we fallback to the `value` setter.
	* @param param - AudioNode parameter object
	* @param value - Value to set
	* @return The value set
	*/
	static setParamValue(e, t) {
		if (e.setValueAtTime) {
			let n = l().context;
			e.setValueAtTime(t, n.audioContext.currentTime);
		} else e.value = t;
		return t;
	}
}, f = class extends u {
	/**
	* @param f32 - Default gain for 32 Hz
	* @param f64 - Default gain for 64 Hz
	* @param f125 - Default gain for 125 Hz
	* @param f250 - Default gain for 250 Hz
	* @param f500 - Default gain for 500 Hz
	* @param f1k - Default gain for 1000 Hz
	* @param f2k - Default gain for 2000 Hz
	* @param f4k - Default gain for 4000 Hz
	* @param f8k - Default gain for 8000 Hz
	* @param f16k - Default gain for 16000 Hz
	*/
	constructor(e = 0, t = 0, n = 0, r = 0, i = 0, a = 0, o = 0, s = 0, c = 0, u = 0) {
		let p = [], m = [
			{
				f: f.F32,
				type: "lowshelf",
				gain: e
			},
			{
				f: f.F64,
				type: "peaking",
				gain: t
			},
			{
				f: f.F125,
				type: "peaking",
				gain: n
			},
			{
				f: f.F250,
				type: "peaking",
				gain: r
			},
			{
				f: f.F500,
				type: "peaking",
				gain: i
			},
			{
				f: f.F1K,
				type: "peaking",
				gain: a
			},
			{
				f: f.F2K,
				type: "peaking",
				gain: o
			},
			{
				f: f.F4K,
				type: "peaking",
				gain: s
			},
			{
				f: f.F8K,
				type: "peaking",
				gain: c
			},
			{
				f: f.F16K,
				type: "highshelf",
				gain: u
			}
		];
		l().useLegacy || (p = m.map((e) => {
			let t = l().context.audioContext.createBiquadFilter();
			return t.type = e.type, d.setParamValue(t.Q, 1), t.frequency.value = e.f, d.setParamValue(t.gain, e.gain), t;
		})), super(p[0], p[p.length - 1]), this.bands = p, this.bandsMap = {};
		for (let e = 0; e < this.bands.length; e++) {
			let t = this.bands[e];
			e > 0 && this.bands[e - 1].connect(t), this.bandsMap[t.frequency.value] = t;
		}
	}
	/**
	* Set gain on a specific frequency.
	* @param frequency - The frequency, see EqualizerFilter.F* for bands
	* @param gain - Recommended -40 to 40.
	*/
	setGain(e, t = 0) {
		if (!this.bandsMap[e]) throw Error(`No band found for frequency ${e}`);
		d.setParamValue(this.bandsMap[e].gain, t);
	}
	/**
	* Get gain amount on a specific frequency.
	* @return The amount of gain set.
	*/
	getGain(e) {
		if (!this.bandsMap[e]) throw Error(`No band found for frequency ${e}`);
		return this.bandsMap[e].gain.value;
	}
	/**
	* Gain at 32 Hz frequencey.
	* @default 0
	*/
	set f32(e) {
		this.setGain(f.F32, e);
	}
	get f32() {
		return this.getGain(f.F32);
	}
	/**
	* Gain at 64 Hz frequencey.
	* @default 0
	*/
	set f64(e) {
		this.setGain(f.F64, e);
	}
	get f64() {
		return this.getGain(f.F64);
	}
	/**
	* Gain at 125 Hz frequencey.
	* @default 0
	*/
	set f125(e) {
		this.setGain(f.F125, e);
	}
	get f125() {
		return this.getGain(f.F125);
	}
	/**
	* Gain at 250 Hz frequencey.
	* @default 0
	*/
	set f250(e) {
		this.setGain(f.F250, e);
	}
	get f250() {
		return this.getGain(f.F250);
	}
	/**
	* Gain at 500 Hz frequencey.
	* @default 0
	*/
	set f500(e) {
		this.setGain(f.F500, e);
	}
	get f500() {
		return this.getGain(f.F500);
	}
	/**
	* Gain at 1 KHz frequencey.
	* @default 0
	*/
	set f1k(e) {
		this.setGain(f.F1K, e);
	}
	get f1k() {
		return this.getGain(f.F1K);
	}
	/**
	* Gain at 2 KHz frequencey.
	* @default 0
	*/
	set f2k(e) {
		this.setGain(f.F2K, e);
	}
	get f2k() {
		return this.getGain(f.F2K);
	}
	/**
	* Gain at 4 KHz frequencey.
	* @default 0
	*/
	set f4k(e) {
		this.setGain(f.F4K, e);
	}
	get f4k() {
		return this.getGain(f.F4K);
	}
	/**
	* Gain at 8 KHz frequencey.
	* @default 0
	*/
	set f8k(e) {
		this.setGain(f.F8K, e);
	}
	get f8k() {
		return this.getGain(f.F8K);
	}
	/**
	* Gain at 16 KHz frequencey.
	* @default 0
	*/
	set f16k(e) {
		this.setGain(f.F16K, e);
	}
	get f16k() {
		return this.getGain(f.F16K);
	}
	/** Reset all frequency bands to have gain of 0 */
	reset() {
		this.bands.forEach((e) => {
			d.setParamValue(e.gain, 0);
		});
	}
	destroy() {
		this.bands.forEach((e) => {
			e.disconnect();
		}), this.bands = null, this.bandsMap = null;
	}
}, p = f;
/**
* Band at 16000 Hz
* @readonly
*/
p.F32 = 32, p.F64 = 64, p.F125 = 125, p.F250 = 250, p.F500 = 500, p.F1K = 1e3, p.F2K = 2e3, p.F4K = 4e3, p.F8K = 8e3, p.F16K = 16e3;
//#endregion
//#region node_modules/@pixi/sound/lib/htmlaudio/HTMLAudioContext.mjs
var m = class extends n {
	constructor() {
		/** Current paused status */
		super(...arguments), this.speed = 1, this.muted = !1, this.volume = 1, this.paused = !1;
	}
	/** Internal trigger when volume, mute or speed changes */
	refresh() {
		this.emit("refresh");
	}
	/** Internal trigger paused changes */
	refreshPaused() {
		this.emit("refreshPaused");
	}
	/**
	* HTML Audio does not support filters, this is non-functional API.
	*/
	get filters() {
		return console.warn("HTML Audio does not support filters"), null;
	}
	set filters(e) {
		console.warn("HTML Audio does not support filters");
	}
	/**
	* HTML Audio does not support `audioContext`
	* @readonly
	* @type {AudioContext}
	*/
	get audioContext() {
		return console.warn("HTML Audio does not support audioContext"), null;
	}
	/**
	* Toggles the muted state.
	* @return The current muted state.
	*/
	toggleMute() {
		return this.muted = !this.muted, this.refresh(), this.muted;
	}
	/**
	* Toggles the paused state.
	* @return The current paused state.
	*/
	togglePause() {
		return this.paused = !this.paused, this.refreshPaused(), this.paused;
	}
	/** Destroy and don't use after this */
	destroy() {
		this.removeAllListeners();
	}
}, h = 0, g = class extends n {
	/** @param parent - Parent element */
	constructor(e) {
		super(), this.id = h++, this.init(e);
	}
	/**
	* Set a property by name, this makes it easy to chain values
	* @param name - Name of the property to set
	* @param value - Value to set property to
	*/
	set(e, t) {
		if (this[e] === void 0) throw Error(`Property with name ${e} does not exist.`);
		switch (e) {
			case "speed":
				this.speed = t;
				break;
			case "volume":
				this.volume = t;
				break;
			case "paused":
				this.paused = t;
				break;
			case "loop":
				this.loop = t;
				break;
			case "muted": this.muted = t;
		}
		return this;
	}
	/** The current playback progress from 0 to 1. */
	get progress() {
		let { currentTime: e } = this._source;
		return e / this._duration;
	}
	/** Pauses the sound. */
	get paused() {
		return this._paused;
	}
	set paused(e) {
		this._paused = e, this.refreshPaused();
	}
	/**
	* Reference: http://stackoverflow.com/a/40370077
	* @private
	*/
	_onPlay() {
		this._playing = !0;
	}
	/**
	* Reference: http://stackoverflow.com/a/40370077
	* @private
	*/
	_onPause() {
		this._playing = !1;
	}
	/**
	* Initialize the instance.
	* @param {htmlaudio.HTMLAudioMedia} media - Same as constructor
	*/
	init(e) {
		this._playing = !1, this._duration = e.source.duration;
		let t = this._source = e.source.cloneNode(!1);
		t.src = e.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), e.context.on("refresh", this.refresh, this), e.context.on("refreshPaused", this.refreshPaused, this), this._media = e;
	}
	/**
	* Stop the sound playing
	* @private
	*/
	_internalStop() {
		this._source && this._playing && (this._source.onended = null, this._source.pause());
	}
	/** Stop the sound playing */
	stop() {
		this._internalStop(), this._source && this.emit("stop");
	}
	/** Set the instance speed from 0 to 1 */
	get speed() {
		return this._speed;
	}
	set speed(e) {
		this._speed = e, this.refresh();
	}
	/** Get the set the volume for this instance from 0 to 1 */
	get volume() {
		return this._volume;
	}
	set volume(e) {
		this._volume = e, this.refresh();
	}
	/** If the sound instance should loop playback */
	get loop() {
		return this._loop;
	}
	set loop(e) {
		this._loop = e, this.refresh();
	}
	/** `true` if the sound is muted */
	get muted() {
		return this._muted;
	}
	set muted(e) {
		this._muted = e, this.refresh();
	}
	/**
	* HTML Audio does not support filters, this is non-functional API.
	*/
	get filters() {
		return console.warn("HTML Audio does not support filters"), null;
	}
	set filters(e) {
		console.warn("HTML Audio does not support filters");
	}
	/** Call whenever the loop, speed or volume changes */
	refresh() {
		let e = this._media.context, t = this._media.parent;
		this._source.loop = this._loop || t.loop;
		let n = e.volume * +!e.muted, r = t.volume * +!t.muted, i = this._volume * +!this._muted;
		this._source.volume = i * n * r, this._source.playbackRate = this._speed * e.speed * t.speed;
	}
	/** Handle changes in paused state, either globally or sound or instance */
	refreshPaused() {
		let e = this._media.context, t = this._media.parent, n = this._paused || t.paused || e.paused;
		n !== this._pausedReal && (this._pausedReal = n, n ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
			start: this._source.currentTime,
			end: this._end,
			volume: this._volume,
			speed: this._speed,
			loop: this._loop
		})), this.emit("pause", n));
	}
	/** Start playing the sound/ */
	play(e) {
		let { start: t, end: n, speed: r, loop: a, volume: o, muted: s } = e;
		n && console.assert(n > t, "End time is before start time"), this._speed = r, this._volume = o, this._loop = !!a, this._muted = s, this.refresh(), this.loop && n !== null && (console.warn("Looping not support when specifying an \"end\" time"), this.loop = !1), this._start = t, this._end = n || this._duration, this._start = Math.max(0, this._start - g.PADDING), this._end = Math.min(this._end + g.PADDING, this._duration), this._source.onloadedmetadata = () => {
			this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), i.shared.add(this._onUpdate, this));
		}, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
	}
	/**
	* Handle time update on sound.
	* @private
	*/
	_onUpdate() {
		this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
	}
	/**
	* Callback when completed.
	* @private
	*/
	_onComplete() {
		i.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
	}
	/** Don't use after this. */
	destroy() {
		i.shared.remove(this._onUpdate, this), this.removeAllListeners();
		let e = this._source;
		e && (e.onended = null, e.onplay = null, e.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media &&= (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), null);
	}
	/**
	* To string method for instance.
	* @return The string representation of instance.
	*/
	toString() {
		return `[HTMLAudioInstance id=${this.id}]`;
	}
}, _ = g;
/** Extra padding, in seconds, to deal with low-latecy of HTMLAudio. */
_.PADDING = .1;
//#endregion
//#region node_modules/@pixi/sound/lib/htmlaudio/HTMLAudioMedia.mjs
var v = class extends n {
	init(e) {
		this.parent = e, this._source = e.options.source || new Audio(), e.url && (this._source.src = e.url);
	}
	create() {
		return new _(this);
	}
	/**
	* If the audio media is playable (ready).
	* @readonly
	*/
	get isPlayable() {
		return !!this._source && this._source.readyState === 4;
	}
	/**
	* THe duration of the media in seconds.
	* @readonly
	*/
	get duration() {
		return this._source.duration;
	}
	/**
	* Reference to the context.
	* @readonly
	*/
	get context() {
		return this.parent.context;
	}
	/** The collection of filters, does not apply to HTML Audio. */
	get filters() {
		return null;
	}
	set filters(e) {
		console.warn("HTML Audio does not support filters");
	}
	destroy() {
		this.removeAllListeners(), this.parent = null, this._source &&= (this._source.src = "", this._source.load(), null);
	}
	/**
	* Get the audio source element.
	* @type {HTMLAudioElement}
	* @readonly
	*/
	get source() {
		return this._source;
	}
	load(e) {
		let t = this._source, n = this.parent;
		if (t.readyState === 4) {
			n.isLoaded = !0;
			let t = n.autoPlayStart();
			e && setTimeout(() => {
				e(null, n, t);
			}, 0);
			return;
		}
		if (!n.url) {
			e(/* @__PURE__ */ Error("sound.url or sound.source must be set"));
			return;
		}
		t.src = n.url;
		let r = () => {
			o(), n.isLoaded = !0;
			let t = n.autoPlayStart();
			e && e(null, n, t);
		}, i = () => {
			o(), e && e(/* @__PURE__ */ Error("Sound loading has been aborted"));
		}, a = () => {
			o();
			let n = `Failed to load audio element (code: ${t.error.code})`;
			e ? e(Error(n)) : console.error(n);
		}, o = () => {
			t.removeEventListener("canplaythrough", r), t.removeEventListener("load", r), t.removeEventListener("abort", i), t.removeEventListener("error", a);
		};
		t.addEventListener("canplaythrough", r, !1), t.addEventListener("load", r, !1), t.addEventListener("abort", i, !1), t.addEventListener("error", a, !1), t.load();
	}
}, y = class {
	/**
	* @param parent - The parent sound
	* @param options - Data associated with object.
	*/
	constructor(e, t) {
		this.parent = e, Object.assign(this, t), this.duration = this.end - this.start, console.assert(this.duration > 0, "End time must be after start time");
	}
	/**
	* Play the sound sprite.
	* @param {Function} [complete] - Function call when complete
	* @return Sound instance being played.
	*/
	play(e) {
		return this.parent.play({
			complete: e,
			speed: this.speed || this.parent.speed,
			end: this.end,
			start: this.start,
			loop: this.loop
		});
	}
	/** Destroy and don't use after this */
	destroy() {
		this.parent = null;
	}
}, b = [
	"ogg",
	"oga",
	"opus",
	"m4a",
	"mp3",
	"mpeg",
	"wav",
	"aiff",
	"wma",
	"mid",
	"caf"
], x = ["audio/mpeg", "audio/ogg"], S = {};
function C(e) {
	let t = {
		m4a: "audio/mp4",
		oga: "audio/ogg",
		opus: "audio/ogg; codecs=\"opus\"",
		caf: "audio/x-caf; codecs=\"opus\"",
		...e || {}
	}, n = document.createElement("audio"), r = {}, i = /^no$/;
	b.forEach((e) => {
		let a = n.canPlayType(`audio/${e}`).replace(i, ""), o = t[e] ? n.canPlayType(t[e]).replace(i, "") : "";
		r[e] = !!a || !!o;
	}), Object.assign(S, r);
}
C();
//#endregion
//#region node_modules/@pixi/sound/lib/webaudio/WebAudioInstance.mjs
var w = 0, T = class extends n {
	constructor(e) {
		super(), this.id = w++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(e);
	}
	/**
	* Set a property by name, this makes it easy to chain values
	* @param name - Name of the property to set.
	* @param value - Value to set property to.
	*/
	set(e, t) {
		if (this[e] === void 0) throw Error(`Property with name ${e} does not exist.`);
		switch (e) {
			case "speed":
				this.speed = t;
				break;
			case "volume":
				this.volume = t;
				break;
			case "muted":
				this.muted = t;
				break;
			case "loop":
				this.loop = t;
				break;
			case "paused": this.paused = t;
		}
		return this;
	}
	/** Stops the instance, don't use after this. */
	stop() {
		this._source && (this._internalStop(), this.emit("stop"));
	}
	/** Set the instance speed from 0 to 1 */
	get speed() {
		return this._speed;
	}
	set speed(e) {
		this._speed = e, this.refresh(), this._update(!0);
	}
	/** Get the set the volume for this instance from 0 to 1 */
	get volume() {
		return this._volume;
	}
	set volume(e) {
		this._volume = e, this.refresh();
	}
	/** `true` if the sound is muted */
	get muted() {
		return this._muted;
	}
	set muted(e) {
		this._muted = e, this.refresh();
	}
	/** If the sound instance should loop playback */
	get loop() {
		return this._loop;
	}
	set loop(e) {
		this._loop = e, this.refresh();
	}
	/** The collection of filters. */
	get filters() {
		return this._filters;
	}
	set filters(e) {
		this._filters && (this._filters?.filter((e) => e).forEach((e) => e.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = e?.length ? e.slice(0) : null, this.refresh();
	}
	/** Refresh loop, volume and speed based on changes to parent */
	refresh() {
		if (!this._source) return;
		let e = this._media.context, t = this._media.parent;
		this._source.loop = this._loop || t.loop;
		let n = e.volume * +!e.muted, r = t.volume * +!t.muted, i = this._volume * +!this._muted;
		d.setParamValue(this._gain.gain, i * r * n), d.setParamValue(this._source.playbackRate, this._speed * t.speed * e.speed), this.applyFilters();
	}
	/** Connect filters nodes to audio context */
	applyFilters() {
		if (this._filters?.length) {
			this._source.disconnect();
			let e = this._source;
			this._filters.forEach((t) => {
				e.connect(t.destination), e = t;
			}), e.connect(this._gain);
		}
	}
	/** Handle changes in paused state, either globally or sound or instance */
	refreshPaused() {
		let e = this._media.context, t = this._media.parent, n = this._paused || t.paused || e.paused;
		n !== this._pausedReal && (this._pausedReal = n, n ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
			start: this._elapsed % this._duration,
			end: this._end,
			speed: this._speed,
			loop: this._loop,
			volume: this._volume
		})), this.emit("pause", n));
	}
	/**
	* Plays the sound.
	* @param options - Play options.
	*/
	play(e) {
		let { start: t, end: n, speed: r, loop: i, volume: a, muted: o, filters: s } = e;
		n && console.assert(n > t, "End time is before start time"), this._paused = !1;
		let { source: c, gain: l } = this._media.nodes.cloneBufferSource();
		this._source = c, this._gain = l, this._speed = r, this._volume = a, this._loop = !!i, this._muted = o, this._filters = s, this.refresh();
		let u = this._source.buffer.duration;
		this._duration = u, this._end = n, this._lastUpdate = this._now(), this._elapsed = t, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = n, this._source.loopStart = t, this._source.start(0, t)) : n ? this._source.start(0, t, n - t) : this._source.start(0, t), this.emit("start"), this._update(!0), this.enableTicker(!0);
	}
	/** Start the update progress. */
	enableTicker(e) {
		i.shared.remove(this._updateListener, this), e && i.shared.add(this._updateListener, this);
	}
	/** The current playback progress from 0 to 1. */
	get progress() {
		return this._progress;
	}
	/** Pauses the sound. */
	get paused() {
		return this._paused;
	}
	set paused(e) {
		this._paused = e, this.refreshPaused();
	}
	/** Don't use after this. */
	destroy() {
		this.removeAllListeners(), this._internalStop(), this._gain &&= (this._gain.disconnect(), null), this._media &&= (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), null), this._filters?.forEach((e) => e.disconnect()), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = !1, this._elapsed = 0, this._duration = 0, this._paused = !1, this._muted = !1, this._pausedReal = !1;
	}
	/**
	* To string method for instance.
	* @return The string representation of instance.
	*/
	toString() {
		return `[WebAudioInstance id=${this.id}]`;
	}
	/**
	* Get the current time in seconds.
	* @return Seconds since start of context
	*/
	_now() {
		return this._media.context.audioContext.currentTime;
	}
	/** Callback for update listener */
	_updateListener() {
		this._update();
	}
	/** Internal update the progress. */
	_update(e = !1) {
		if (this._source) {
			let t = this._now(), n = t - this._lastUpdate;
			if (n > 0 || e) {
				let e = this._source.playbackRate.value;
				this._elapsed += n * e, this._lastUpdate = t;
				let r = this._duration, i;
				if (this._source.loopStart) {
					let e = this._source.loopEnd - this._source.loopStart;
					i = (this._source.loopStart + this._elapsed % e) / r;
				} else i = this._elapsed % r / r;
				this._progress = i, this.emit("progress", this._progress, r);
			}
		}
	}
	/** Initializes the instance. */
	init(e) {
		this._media = e, e.context.events.on("refresh", this.refresh, this), e.context.events.on("refreshPaused", this.refreshPaused, this);
	}
	/** Stops the instance. */
	_internalStop() {
		if (this._source) {
			this.enableTicker(!1), this._source.onended = null, this._source.stop(0), this._source.disconnect();
			try {
				this._source.buffer = null;
			} catch (e) {
				console.warn("Failed to set AudioBufferSourceNode.buffer to null:", e);
			}
			this._source = null;
		}
	}
	/** Callback when completed. */
	_onComplete() {
		if (this._source) {
			this.enableTicker(!1), this._source.onended = null, this._source.disconnect();
			try {
				this._source.buffer = null;
			} catch (e) {
				console.warn("Failed to set AudioBufferSourceNode.buffer to null:", e);
			}
		}
		this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
	}
}, E = class {
	/**
	* @param input - The source audio node
	* @param output - The output audio node
	*/
	constructor(e, t) {
		this._output = t, this._input = e;
	}
	/** The destination output audio node */
	get destination() {
		return this._input;
	}
	/** The collection of filters. */
	get filters() {
		return this._filters;
	}
	set filters(e) {
		if (this._filters && (this._filters.forEach((e) => {
			e && e.disconnect();
		}), this._filters = null, this._input.connect(this._output)), e && e.length) {
			this._filters = e.slice(0), this._input.disconnect();
			let t = null;
			e.forEach((e) => {
				t === null ? this._input.connect(e.destination) : t.connect(e.destination), t = e;
			}), t.connect(this._output);
		}
	}
	/** Cleans up. */
	destroy() {
		this.filters = null, this._input = null, this._output = null;
	}
}, D = class extends E {
	/**
	* @param context - The audio context.
	*/
	constructor(e) {
		let t = e.audioContext, n = t.createBufferSource(), r = t.createGain(), i = t.createAnalyser();
		n.connect(i), i.connect(r), r.connect(e.destination), super(i, r), this.context = e, this.bufferSource = n, this.gain = r, this.analyser = i;
	}
	/**
	* Get the script processor node.
	* @readonly
	*/
	get script() {
		return this._script || (this._script = this.context.audioContext.createScriptProcessor(D.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
	}
	/** Cleans up. */
	destroy() {
		super.destroy(), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
	}
	/**
	* Clones the bufferSource. Used just before playing a sound.
	* @returns {SourceClone} The clone AudioBufferSourceNode.
	*/
	cloneBufferSource() {
		let e = this.bufferSource, t = this.context.audioContext.createBufferSource();
		t.buffer = e.buffer, d.setParamValue(t.playbackRate, e.playbackRate.value), t.loop = e.loop;
		let n = this.context.audioContext.createGain();
		return t.connect(n), n.connect(this.destination), {
			source: t,
			gain: n
		};
	}
	/**
	* Get buffer size of `ScriptProcessorNode`.
	* @readonly
	*/
	get bufferSize() {
		return this.script.bufferSize;
	}
}, O = D;
/**
* The buffer size for script processor, default is `0` which auto-detects. If you plan to use
* script node on iOS, you'll need to provide a non-zero amount.
* @default 0
*/
O.BUFFER_SIZE = 0;
//#endregion
//#region node_modules/@pixi/sound/lib/webaudio/WebAudioMedia.mjs
var k = class {
	/**
	* Re-initialize without constructing.
	* @param parent - - Instance of parent Sound container
	*/
	init(e) {
		this.parent = e, this._nodes = new O(this.context), this._source = this._nodes.bufferSource, this.source = e.options.source;
	}
	/** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
	destroy() {
		this.parent = null, this._nodes.destroy(), this._nodes = null;
		try {
			this._source.buffer = null;
		} catch (e) {
			console.warn("Failed to set AudioBufferSourceNode.buffer to null:", e);
		}
		this._source = null, this.source = null;
	}
	create() {
		return new T(this);
	}
	get context() {
		return this.parent.context;
	}
	get isPlayable() {
		return !!this._source && !!this._source.buffer;
	}
	get filters() {
		return this._nodes.filters;
	}
	set filters(e) {
		this._nodes.filters = e;
	}
	get duration() {
		return console.assert(this.isPlayable, "Sound not yet playable, no duration"), this._source.buffer.duration;
	}
	/** Gets and sets the buffer. */
	get buffer() {
		return this._source.buffer;
	}
	set buffer(e) {
		this._source.buffer = e;
	}
	/** Get the current chained nodes object */
	get nodes() {
		return this._nodes;
	}
	load(e) {
		this.source ? this._decode(this.source, e) : this.parent.url ? this._loadUrl(e) : e ? e(/* @__PURE__ */ Error("sound.url or sound.source must be set")) : console.error("sound.url or sound.source must be set");
	}
	/** Loads a sound using XHMLHttpRequest object. */
	async _loadUrl(e) {
		let t = this.parent.url, n = await r.get().fetch(t);
		this._decode(await n.arrayBuffer(), e);
	}
	/**
	* Decodes the array buffer.
	* @param arrayBuffer - From load.
	* @param {Function} callback - Callback optional
	*/
	_decode(e, t) {
		let n = (e, n) => {
			if (e) t && t(e);
			else {
				this.parent.isLoaded = !0, this.buffer = n;
				let e = this.parent.autoPlayStart();
				t && t(null, this.parent, e);
			}
		};
		e instanceof AudioBuffer ? n(null, e) : this.parent.context.decode(e, n);
	}
}, A = class {
	/**
	* Create a new sound instance from source.
	* @param source - Either the path or url to the source file.
	*        or the object of options to use.
	* @return Created sound instance.
	*/
	static from(e) {
		let t = {};
		return typeof e == "string" ? t.url = e : e instanceof ArrayBuffer || e instanceof AudioBuffer || e instanceof HTMLAudioElement ? t.source = e : Array.isArray(e) ? t.url = e : t = e, t = {
			autoPlay: !1,
			singleInstance: !1,
			url: null,
			source: null,
			preload: !1,
			volume: 1,
			speed: 1,
			complete: null,
			loaded: null,
			loop: !1,
			...t
		}, Object.freeze(t), new A(l().useLegacy ? new v() : new k(), t);
	}
	/**
	* Use `Sound.from`
	* @ignore
	*/
	constructor(e, t) {
		this.media = e, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
		let n = t.complete;
		this._autoPlayOptions = n ? { complete: n } : null, this.isLoaded = !1, this._preloadQueue = null, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = Array.isArray(t.url) ? this.preferUrl(t.url) : t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded);
	}
	/**
	* Internal help for resolving which file to use if there are multiple provide
	* this is especially helpful for working with bundlers (non Assets loading).
	*/
	preferUrl(e) {
		let [t] = e.map((e) => ({
			url: e,
			ext: o.extname(e).slice(1)
		})).filter(({ ext: e }) => S[e]).sort((e, t) => b.indexOf(e.ext) - b.indexOf(t.ext));
		if (!t) throw Error("No supported file type found");
		return t.url;
	}
	/** Instance of the media context. */
	get context() {
		return l().context;
	}
	/** Stops all the instances of this sound from playing. */
	pause() {
		return this.isPlaying = !1, this.paused = !0, this;
	}
	/** Resuming all the instances of this sound from playing */
	resume() {
		return this.isPlaying = this._instances.length > 0, this.paused = !1, this;
	}
	/** Stops all the instances of this sound from playing. */
	get paused() {
		return this._paused;
	}
	set paused(e) {
		this._paused = e, this.refreshPaused();
	}
	/** The playback rate. */
	get speed() {
		return this._speed;
	}
	set speed(e) {
		this._speed = e, this.refresh();
	}
	/** Set the filters. Only supported with WebAudio. */
	get filters() {
		return this.media.filters;
	}
	set filters(e) {
		this.media.filters = e;
	}
	/**
	* @ignore
	*/
	addSprites(e, t) {
		if (typeof e == "object") {
			let t = {};
			for (let n in e) t[n] = this.addSprites(n, e[n]);
			return t;
		}
		console.assert(!this._sprites[e], `Alias ${e} is already taken`);
		let n = new y(this, t);
		return this._sprites[e] = n, n;
	}
	/** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
	destroy() {
		this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
	}
	/**
	* Remove a sound sprite.
	* @param alias - The unique name of the sound sprite, if alias is omitted, removes all sprites.
	*/
	removeSprites(e) {
		if (e) {
			let t = this._sprites[e];
			t !== void 0 && (t.destroy(), delete this._sprites[e]);
		} else for (let e in this._sprites) this.removeSprites(e);
		return this;
	}
	/** If the current sound is playable (loaded). */
	get isPlayable() {
		return this.isLoaded && this.media && this.media.isPlayable;
	}
	/** Stops all the instances of this sound from playing. */
	stop() {
		if (!this.isPlayable) return this.autoPlay = !1, this._autoPlayOptions = null, this;
		this.isPlaying = !1;
		for (let e = this._instances.length - 1; e >= 0; e--) this._instances[e].stop();
		return this;
	}
	play(e, t) {
		let n;
		if (typeof e == "string" ? n = {
			sprite: e,
			loop: this.loop,
			complete: t
		} : typeof e == "function" ? (n = {}, n.complete = e) : n = e, n = {
			complete: null,
			loaded: null,
			sprite: null,
			end: null,
			start: 0,
			volume: 1,
			speed: 1,
			muted: !1,
			loop: !1,
			...n || {}
		}, n.sprite) {
			let e = n.sprite;
			console.assert(!!this._sprites[e], `Alias ${e} is not available`);
			let t = this._sprites[e];
			n.start = t.start + (n.start || 0), n.end = t.end, n.speed = t.speed || 1, n.loop = t.loop || n.loop, delete n.sprite;
		}
		if (n.offset && (n.start = n.offset), !this.isLoaded) return this._preloadQueue ? new Promise((e) => {
			this._preloadQueue.push(() => {
				e(this.play(n));
			});
		}) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = n, new Promise((e, t) => {
			this._preload((r, i, a) => {
				this._preloadQueue.forEach((e) => e()), this._preloadQueue = null, r ? t(r) : (n.loaded && n.loaded(r, i, a), e(a));
			});
		}));
		(this.singleInstance || n.singleInstance) && this._removeInstances();
		let r = this._createInstance();
		return this._instances.push(r), this.isPlaying = !0, r.once("end", () => {
			n.complete && n.complete(this), this._onComplete(r);
		}), r.once("stop", () => {
			this._onComplete(r);
		}), r.play(n), r;
	}
	/** Internal only, speed, loop, volume change occured. */
	refresh() {
		let e = this._instances.length;
		for (let t = 0; t < e; t++) this._instances[t].refresh();
	}
	/** Handle changes in paused state. Internal only. */
	refreshPaused() {
		let e = this._instances.length;
		for (let t = 0; t < e; t++) this._instances[t].refreshPaused();
	}
	/** Gets and sets the volume. */
	get volume() {
		return this._volume;
	}
	set volume(e) {
		this._volume = e, this.refresh();
	}
	/** Gets and sets the muted flag. */
	get muted() {
		return this._muted;
	}
	set muted(e) {
		this._muted = e, this.refresh();
	}
	/** Gets and sets the looping. */
	get loop() {
		return this._loop;
	}
	set loop(e) {
		this._loop = e, this.refresh();
	}
	/** Starts the preloading of sound. */
	_preload(e) {
		this.media.load(e);
	}
	/** Gets the list of instances that are currently being played of this sound. */
	get instances() {
		return this._instances;
	}
	/** Get the map of sprites. */
	get sprites() {
		return this._sprites;
	}
	/** Get the duration of the audio in seconds. */
	get duration() {
		return this.media.duration;
	}
	/** Auto play the first instance. */
	autoPlayStart() {
		let e;
		return this.autoPlay && (e = this.play(this._autoPlayOptions)), e;
	}
	/** Removes all instances. */
	_removeInstances() {
		for (let e = this._instances.length - 1; e >= 0; e--) this._poolInstance(this._instances[e]);
		this._instances.length = 0;
	}
	/**
	* Sound instance completed.
	* @param instance
	*/
	_onComplete(e) {
		if (this._instances) {
			let t = this._instances.indexOf(e);
			t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0;
		}
		this._poolInstance(e);
	}
	/** Create a new instance. */
	_createInstance() {
		if (A._pool.length > 0) {
			let e = A._pool.pop();
			return e.init(this.media), e;
		}
		return this.media.create();
	}
	/**
	* Destroy/recycling the instance object.
	* @param instance - Instance to recycle
	*/
	_poolInstance(e) {
		e.destroy(), A._pool.indexOf(e) < 0 && A._pool.push(e);
	}
}, j = A;
/** Pool of instances */
j._pool = [];
//#endregion
//#region node_modules/@pixi/sound/lib/webaudio/WebAudioContext.mjs
var M = class e extends E {
	constructor() {
		let t = window, r = new e.AudioContext(), i = r.createDynamicsCompressor(), a = r.createAnalyser();
		a.connect(i), i.connect(r.destination), super(a, i), this.autoPause = !0, this._ctx = r, this._offlineCtx = new e.OfflineAudioContext(1, 2, t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, r.sampleRate)) : 44100), this.compressor = i, this.analyser = a, this.events = new n(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = r.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
	}
	/** Handle mobile WebAudio context resume */
	onFocus() {
		if (!this.autoPause) return;
		let e = this._ctx.state;
		(e === "suspended" || e === "interrupted" || !this._locked) && (this.paused = this._pausedOnBlur, this.refreshPaused());
	}
	/** Handle mobile WebAudio context suspend */
	onBlur() {
		this.autoPause && (this._locked || (this._pausedOnBlur = this._paused, this.paused = !0, this.refreshPaused()));
	}
	/**
	* Try to unlock audio on iOS. This is triggered from either WebAudio plugin setup (which will work if inside of
	* a `mousedown` or `touchend` event stack), or the first document touchend/mousedown event. If it fails (touchend
	* will fail if the user presses for too long, indicating a scroll event instead of a click event.
	*
	* Note that earlier versions of iOS supported `touchstart` for this, but iOS9 removed this functionality. Adding
	* a `touchstart` event to support older platforms may preclude a `mousedown` even from getting fired on iOS9, so we
	* stick with `mousedown` and `touchend`.
	*/
	_unlock() {
		this._locked && (this.playEmptySound(), this._ctx.state === "running" && (document.removeEventListener("mousedown", this._unlock, !0), document.removeEventListener("touchend", this._unlock, !0), document.removeEventListener("touchstart", this._unlock, !0), this._locked = !1));
	}
	/**
	* Plays an empty sound in the web audio context.  This is used to enable web audio on iOS devices, as they
	* require the first sound to be played inside of a user initiated event (touch/click).
	*/
	playEmptySound() {
		let e = this._ctx.createBufferSource();
		e.buffer = this._ctx.createBuffer(1, 1, 22050), e.connect(this._ctx.destination), e.start(0, 0, 0), e.context.state === "suspended" && e.context.resume();
	}
	/**
	* Get AudioContext class, if not supported returns `null`
	* @type {AudioContext}
	* @readonly
	*/
	static get AudioContext() {
		let e = window;
		return e.AudioContext || e.webkitAudioContext || null;
	}
	/**
	* Get OfflineAudioContext class, if not supported returns `null`
	* @type {OfflineAudioContext}
	* @readonly
	*/
	static get OfflineAudioContext() {
		let e = window;
		return e.OfflineAudioContext || e.webkitOfflineAudioContext || null;
	}
	/** Destroy this context. */
	destroy() {
		super.destroy();
		let e = this._ctx;
		e.close !== void 0 && e.close(), globalThis.removeEventListener("focus", this.onFocus), globalThis.removeEventListener("blur", this.onBlur), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
	}
	/**
	* The WebAudio API AudioContext object.
	* @readonly
	* @type {AudioContext}
	*/
	get audioContext() {
		return this._ctx;
	}
	/**
	* The WebAudio API OfflineAudioContext object.
	* @readonly
	* @type {OfflineAudioContext}
	*/
	get offlineContext() {
		return this._offlineCtx;
	}
	/**
	* Pauses all sounds, even though we handle this at the instance
	* level, we'll also pause the audioContext so that the
	* time used to compute progress isn't messed up.
	* @default false
	*/
	set paused(e) {
		e && this._ctx.state === "running" ? this._ctx.suspend() : !e && this._ctx.state === "suspended" && this._ctx.resume(), this._paused = e;
	}
	get paused() {
		return this._paused;
	}
	/** Emit event when muted, volume or speed changes */
	refresh() {
		this.events.emit("refresh");
	}
	/** Emit event when muted, volume or speed changes */
	refreshPaused() {
		this.events.emit("refreshPaused");
	}
	/**
	* Toggles the muted state.
	* @return The current muted state.
	*/
	toggleMute() {
		return this.muted = !this.muted, this.refresh(), this.muted;
	}
	/**
	* Toggles the paused state.
	* @return The current muted state.
	*/
	togglePause() {
		return this.paused = !this.paused, this.refreshPaused(), this._paused;
	}
	/**
	* Decode the audio data
	* @param arrayBuffer - Buffer from loader
	* @param callback - When completed, error and audioBuffer are parameters.
	*/
	decode(e, t) {
		let n = (e) => {
			t(Error(e?.message || "Unable to decode file"));
		}, r = this._offlineCtx.decodeAudioData(e, (e) => {
			t(null, e);
		}, n);
		r && r.catch(n);
	}
}, N = class {
	constructor() {
		this.init();
	}
	/**
	* Re-initialize the sound library, this will
	* recreate the AudioContext. If there's a hardware-failure
	* call `close` and then `init`.
	* @return Sound instance
	*/
	init() {
		return this.supported && (this._webAudioContext = new M()), this._htmlAudioContext = new m(), this._sounds = {}, this.useLegacy = !this.supported, this;
	}
	/**
	* The global context to use.
	* @readonly
	*/
	get context() {
		return this._context;
	}
	/**
	* Apply filters to all sounds. Can be useful
	* for setting global planning or global effects.
	* **Only supported with WebAudio.**
	* @example
	* import { sound, filters } from '@pixi/sound';
	* // Adds a filter to pan all output left
	* sound.filtersAll = [
	*     new filters.StereoFilter(-1)
	* ];
	*/
	get filtersAll() {
		return this.useLegacy ? [] : this._context.filters;
	}
	set filtersAll(e) {
		this.useLegacy || (this._context.filters = e);
	}
	/**
	* `true` if WebAudio is supported on the current browser.
	*/
	get supported() {
		return M.AudioContext !== null;
	}
	/**
	* @ignore
	*/
	add(e, t) {
		if (typeof e == "object") {
			let n = {};
			for (let r in e) {
				let i = this._getOptions(e[r], t);
				n[r] = this.add(r, i);
			}
			return n;
		}
		if (console.assert(!this._sounds[e], `Sound with alias ${e} already exists.`), t instanceof j) return this._sounds[e] = t, t;
		let n = this._getOptions(t), r = j.from(n);
		return this._sounds[e] = r, r;
	}
	/**
	* Internal methods for getting the options object
	* @private
	* @param source - The source options
	* @param overrides - Override default options
	* @return The construction options
	*/
	_getOptions(e, t) {
		let n;
		return n = typeof e == "string" || Array.isArray(e) ? { url: e } : e instanceof ArrayBuffer || e instanceof AudioBuffer || e instanceof HTMLAudioElement ? { source: e } : e, n = {
			...n,
			...t || {}
		}, n;
	}
	/**
	* Do not use WebAudio, force the use of legacy. This **must** be called before loading any files.
	*/
	get useLegacy() {
		return this._useLegacy;
	}
	set useLegacy(e) {
		this._useLegacy = e, this._context = !e && this.supported ? this._webAudioContext : this._htmlAudioContext;
	}
	/**
	* This disables auto-pause all playback when the window blurs (WebAudio only).
	* This is helpful to keep from playing sounds when the user switches tabs.
	* However, if you're running content within an iframe, this may be undesirable
	* and you should disable (set to `true`) this behavior.
	* @default false
	*/
	get disableAutoPause() {
		return !this._webAudioContext.autoPause;
	}
	set disableAutoPause(e) {
		this._webAudioContext.autoPause = !e;
	}
	/**
	* Removes a sound by alias.
	* @param alias - The sound alias reference.
	* @return Instance for chaining.
	*/
	remove(e) {
		return this.exists(e, !0), this._sounds[e].destroy(), delete this._sounds[e], this;
	}
	/**
	* Set the global volume for all sounds. To set per-sound volume see {@link SoundLibrary#volume}.
	*/
	get volumeAll() {
		return this._context.volume;
	}
	set volumeAll(e) {
		this._context.volume = e, this._context.refresh();
	}
	/**
	* Set the global speed for all sounds. To set per-sound speed see {@link SoundLibrary#speed}.
	*/
	get speedAll() {
		return this._context.speed;
	}
	set speedAll(e) {
		this._context.speed = e, this._context.refresh();
	}
	/**
	* Toggle paused property for all sounds.
	* @return `true` if all sounds are paused.
	*/
	togglePauseAll() {
		return this._context.togglePause();
	}
	/**
	* Pauses any playing sounds.
	* @return Instance for chaining.
	*/
	pauseAll() {
		return this._context.paused = !0, this._context.refreshPaused(), this;
	}
	/**
	* Resumes any sounds.
	* @return Instance for chaining.
	*/
	resumeAll() {
		return this._context.paused = !1, this._context.refreshPaused(), this;
	}
	/**
	* Toggle muted property for all sounds.
	* @return `true` if all sounds are muted.
	*/
	toggleMuteAll() {
		return this._context.toggleMute();
	}
	/**
	* Mutes all playing sounds.
	* @return Instance for chaining.
	*/
	muteAll() {
		return this._context.muted = !0, this._context.refresh(), this;
	}
	/**
	* Unmutes all playing sounds.
	* @return Instance for chaining.
	*/
	unmuteAll() {
		return this._context.muted = !1, this._context.refresh(), this;
	}
	/**
	* Stops and removes all sounds. They cannot be used after this.
	* @return Instance for chaining.
	*/
	removeAll() {
		for (let e in this._sounds) this._sounds[e].destroy(), delete this._sounds[e];
		return this;
	}
	/**
	* Stops all sounds.
	* @return Instance for chaining.
	*/
	stopAll() {
		for (let e in this._sounds) this._sounds[e].stop();
		return this;
	}
	/**
	* Checks if a sound by alias exists.
	* @param alias - Check for alias.
	* @param assert - Whether enable console.assert.
	* @return true if the sound exists.
	*/
	exists(e, t = !1) {
		let n = !!this._sounds[e];
		return t && console.assert(n, `No sound matching alias '${e}'.`), n;
	}
	/**
	* Convenience function to check to see if any sound is playing.
	* @returns `true` if any sound is currently playing.
	*/
	isPlaying() {
		for (let e in this._sounds) if (this._sounds[e].isPlaying) return !0;
		return !1;
	}
	/**
	* Find a sound by alias.
	* @param alias - The sound alias reference.
	* @return Sound object.
	*/
	find(e) {
		return this.exists(e, !0), this._sounds[e];
	}
	/**
	* Plays a sound.
	* @method play
	* @instance
	* @param {string} alias - The sound alias reference.
	* @param {string} sprite - The alias of the sprite to play.
	* @return {IMediaInstance|null} The sound instance, this cannot be reused
	*         after it is done playing. Returns `null` if the sound has not yet loaded.
	*/
	/**
	* Plays a sound.
	* @param alias - The sound alias reference.
	* @param {PlayOptions|Function} options - The options or callback when done.
	* @return The sound instance,
	*        this cannot be reused after it is done playing. Returns a Promise if the sound
	*        has not yet loaded.
	*/
	play(e, t) {
		return this.find(e).play(t);
	}
	/**
	* Stops a sound.
	* @param alias - The sound alias reference.
	* @return Sound object.
	*/
	stop(e) {
		return this.find(e).stop();
	}
	/**
	* Pauses a sound.
	* @param alias - The sound alias reference.
	* @return Sound object.
	*/
	pause(e) {
		return this.find(e).pause();
	}
	/**
	* Resumes a sound.
	* @param alias - The sound alias reference.
	* @return Instance for chaining.
	*/
	resume(e) {
		return this.find(e).resume();
	}
	/**
	* Get or set the volume for a sound.
	* @param alias - The sound alias reference.
	* @param volume - Optional current volume to set.
	* @return The current volume.
	*/
	volume(e, t) {
		let n = this.find(e);
		return t !== void 0 && (n.volume = t), n.volume;
	}
	/**
	* Get or set the speed for a sound.
	* @param alias - The sound alias reference.
	* @param speed - Optional current speed to set.
	* @return The current speed.
	*/
	speed(e, t) {
		let n = this.find(e);
		return t !== void 0 && (n.speed = t), n.speed;
	}
	/**
	* Get the length of a sound in seconds.
	* @param alias - The sound alias reference.
	* @return The current duration in seconds.
	*/
	duration(e) {
		return this.find(e).duration;
	}
	/**
	* Closes the sound library. This will release/destroy
	* the AudioContext(s). Can be used safely if you want to
	* initialize the sound library later. Use `init` method.
	*/
	close() {
		return this.removeAll(), this._sounds = null, this._webAudioContext &&= (this._webAudioContext.destroy(), null), this._htmlAudioContext &&= (this._htmlAudioContext.destroy(), null), this._context = null, this;
	}
}, P = (e) => {
	let t = e.src, n = e?.alias?.[0];
	return (!n || e.src === n) && (n = o.basename(t, o.extname(t))), n;
}, F = {
	extension: e.Asset,
	detection: {
		test: async () => !0,
		add: async (e) => [...e, ...b.filter((e) => S[e])],
		remove: async (e) => e.filter((t) => e.includes(t))
	},
	loader: {
		name: "sound",
		extension: {
			type: [e.LoadParser],
			priority: a.High
		},
		/** Should we attempt to load this file? */
		test(e) {
			return !!S[o.extname(e).slice(1)] || x.some((t) => e.startsWith(`data:${t}`));
		},
		/** Load the sound file, this is mostly handled by Sound.from() */
		async load(e, t) {
			let n = await new Promise((n, r) => j.from({
				...t.data,
				url: e,
				preload: !0,
				loaded(e, i) {
					e ? r(e) : n(i), t.data?.loaded?.(e, i);
				}
			}));
			return l().add(P(t), n), n;
		},
		/** Remove the sound from the library */
		async unload(e, t) {
			l().remove(P(t));
		}
	}
};
t.add(F);
//#endregion
//#region node_modules/@pixi/sound/lib/index.mjs
var I = c(new N());
//#endregion
export { I as sound };
