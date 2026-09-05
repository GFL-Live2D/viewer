import { A as e, F as t, P as n, l as r } from "./adapter-DdgmR4Id.js";
import { N as i, r as a, t as o } from "./Ticker-CsadseLF.js";
//#region node_modules/pixi.js/lib/dom/CanvasObserver.mjs
var s = class {
	constructor(e) {
		/** A cached value of the last transform applied to the DOM element. */
		this._lastTransform = "", this._observer = null, this._tickerAttached = !1, this.updateTranslation = () => {
			if (!this._canvas) return;
			let e = this._canvas.getBoundingClientRect(), t = this._canvas.width, n = this._canvas.height, r = e.width / t * this._renderer.resolution, i = e.height / n * this._renderer.resolution, a = `translate(${e.left}px, ${e.top}px) scale(${r}, ${i})`;
			a !== this._lastTransform && (this._domElement.style.transform = a, this._lastTransform = a);
		}, this._domElement = e.domElement, this._renderer = e.renderer, !(globalThis.OffscreenCanvas && this._renderer.canvas instanceof OffscreenCanvas) && (this._canvas = this._renderer.canvas, this._attachObserver());
	}
	/** The canvas element that this CanvasObserver is associated with. */
	get canvas() {
		return this._canvas;
	}
	/** Attaches the DOM element to the canvas parent if it is not already attached. */
	ensureAttached() {
		!this._domElement.parentNode && this._canvas.parentNode && (this._canvas.parentNode.appendChild(this._domElement), this.updateTranslation());
	}
	/** Sets up a ResizeObserver if available. This ensures that the DOM element is kept in sync with the canvas size . */
	_attachObserver() {
		"ResizeObserver" in globalThis ? (this._observer &&= (this._observer.disconnect(), null), this._observer = new ResizeObserver((e) => {
			for (let t of e) {
				if (t.target !== this._canvas) continue;
				let e = this.canvas.width, n = this.canvas.height, r = t.contentRect.width / e * this._renderer.resolution, i = t.contentRect.height / n * this._renderer.resolution;
				(this._lastScaleX !== r || this._lastScaleY !== i) && (this.updateTranslation(), this._lastScaleX = r, this._lastScaleY = i);
			}
		}), this._observer.observe(this._canvas)) : this._tickerAttached || o.shared.add(this.updateTranslation, this, a.HIGH);
	}
	/** Destroys the CanvasObserver instance, cleaning up observers and Ticker. */
	destroy() {
		this._observer ? (this._observer.disconnect(), this._observer = null) : this._tickerAttached && o.shared.remove(this.updateTranslation), this._domElement = null, this._renderer = null, this._canvas = null, this._tickerAttached = !1, this._lastTransform = "", this._lastScaleX = null, this._lastScaleY = null;
	}
}, c = class t {
	/**
	* @param manager - The event boundary which manages this event. Propagation can only occur
	*  within the boundary's jurisdiction.
	*/
	constructor(n) {
		this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = t.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new e(), this.page = new e(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = n;
	}
	/** @readonly */
	get layerX() {
		return this.layer.x;
	}
	/** @readonly */
	get layerY() {
		return this.layer.y;
	}
	/** @readonly */
	get pageX() {
		return this.page.x;
	}
	/** @readonly */
	get pageY() {
		return this.page.y;
	}
	/**
	* Fallback for the deprecated `InteractionEvent.data`.
	* @deprecated since 7.0.0
	*/
	get data() {
		return this;
	}
	/**
	* The propagation path for this event. Alias for {@link EventBoundary.propagationPath}.
	* @advanced
	*/
	composedPath() {
		return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
	}
	/**
	* Unimplemented method included for implementing the DOM interface `Event`. It will throw an `Error`.
	* @deprecated
	* @ignore
	* @param _type
	* @param _bubbles
	* @param _cancelable
	*/
	initEvent(e, t, n) {
		throw Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
	}
	/**
	* Unimplemented method included for implementing the DOM interface `UIEvent`. It will throw an `Error`.
	* @ignore
	* @deprecated
	* @param _typeArg
	* @param _bubblesArg
	* @param _cancelableArg
	* @param _viewArg
	* @param _detailArg
	*/
	initUIEvent(e, t, n, r, i) {
		throw Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
	}
	/**
	* Prevent default behavior of both PixiJS and the user agent.
	* @example
	* ```ts
	* sprite.on('click', (event) => {
	*     // Prevent both browser's default click behavior
	*     // and PixiJS's default handling
	*     event.preventDefault();
	*
	*     // Custom handling
	*     customClickHandler();
	* });
	* ```
	* @remarks
	* - Only works if the native event is cancelable
	* - Does not stop event propagation
	*/
	preventDefault() {
		this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
	}
	/**
	* Stop this event from propagating to any additional listeners, including those
	* on the current target and any following targets in the propagation path.
	* @example
	* ```ts
	* container.on('pointerdown', (event) => {
	*     // Stop all further event handling
	*     event.stopImmediatePropagation();
	*
	*     // These handlers won't be called:
	*     // - Other pointerdown listeners on this container
	*     // - Any pointerdown listeners on parent containers
	* });
	* ```
	* @remarks
	* - Immediately stops all event propagation
	* - Prevents other listeners on same target from being called
	* - More aggressive than stopPropagation()
	*/
	stopImmediatePropagation() {
		this.propagationImmediatelyStopped = !0;
	}
	/**
	* Stop this event from propagating to the next target in the propagation path.
	* The rest of the listeners on the current target will still be notified.
	* @example
	* ```ts
	* child.on('pointermove', (event) => {
	*     // Handle event on child
	*     updateChild();
	*
	*     // Prevent parent handlers from being called
	*     event.stopPropagation();
	* });
	*
	* // This won't be called if child handles the event
	* parent.on('pointermove', (event) => {
	*     updateParent();
	* });
	* ```
	* @remarks
	* - Stops event bubbling to parent containers
	* - Does not prevent other listeners on same target
	* - Less aggressive than stopImmediatePropagation()
	*/
	stopPropagation() {
		this.propagationStopped = !0;
	}
}, l = /iPhone/i, u = /iPod/i, d = /iPad/i, f = /\biOS-universal(?:.+)Mac\b/i, p = /\bAndroid(?:.+)Mobile\b/i, m = /Android/i, h = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, g = /Silk/i, _ = /Windows Phone/i, v = /\bWindows(?:.+)ARM\b/i, y = /BlackBerry/i, b = /BB10/i, x = /Opera Mini/i, S = /\b(CriOS|Chrome)(?:.+)Mobile/i, C = /Mobile(?:.+)Firefox\b/i, w = function(e) {
	return e !== void 0 && e.platform === "MacIntel" && typeof e.maxTouchPoints == "number" && e.maxTouchPoints > 1 && typeof MSStream > "u";
};
function T(e) {
	return function(t) {
		return t.test(e);
	};
}
function E(e) {
	var t = {
		userAgent: "",
		platform: "",
		maxTouchPoints: 0
	};
	!e && typeof navigator < "u" ? t = {
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		maxTouchPoints: navigator.maxTouchPoints || 0
	} : typeof e == "string" ? t.userAgent = e : e && e.userAgent && (t = {
		userAgent: e.userAgent,
		platform: e.platform,
		maxTouchPoints: e.maxTouchPoints || 0
	});
	var n = t.userAgent, r = n.split("[FBAN");
	r[1] !== void 0 && (n = r[0]), r = n.split("Twitter"), r[1] !== void 0 && (n = r[0]);
	var i = T(n), a = {
		apple: {
			phone: i(l) && !i(_),
			ipod: i(u),
			tablet: !i(l) && (i(d) || w(t)) && !i(_),
			universal: i(f),
			device: (i(l) || i(u) || i(d) || i(f) || w(t)) && !i(_)
		},
		amazon: {
			phone: i(h),
			tablet: !i(h) && i(g),
			device: i(h) || i(g)
		},
		android: {
			phone: !i(_) && i(h) || !i(_) && i(p),
			tablet: !i(_) && !i(h) && !i(p) && (i(g) || i(m)),
			device: !i(_) && (i(h) || i(g) || i(p) || i(m)) || i(/\bokhttp\b/i)
		},
		windows: {
			phone: i(_),
			tablet: i(v),
			device: i(_) || i(v)
		},
		other: {
			blackberry: i(y),
			blackberry10: i(b),
			opera: i(x),
			firefox: i(C),
			chrome: i(S),
			device: i(y) || i(b) || i(x) || i(C) || i(S)
		},
		any: !1,
		phone: !1,
		tablet: !1
	};
	return a.any = a.apple.device || a.android.device || a.windows.device || a.other.device, a.phone = a.apple.phone || a.android.phone || a.windows.phone, a.tablet = a.apple.tablet || a.android.tablet || a.windows.tablet, a;
}
//#endregion
//#region node_modules/pixi.js/lib/utils/browser/isMobile.mjs
var D = (E.default ?? E)(globalThis.navigator), O = 9, k = 100, A = 0, j = 0, M = 2, N = 1, P = -1e3, F = -1e3, I = 2, L = class e {
	/**
	* @param {WebGLRenderer|WebGPURenderer} renderer - A reference to the current renderer
	*/
	constructor(e, t = D) {
		this._mobileInfo = t, this.debug = !1, this._activateOnTab = !0, this._deactivateOnMouseMove = !0, this._isActive = !1, this._isMobileAccessibility = !1, this._div = null, this._pools = {}, this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._isRunningTests = !1, this._boundOnKeyDown = this._onKeyDown.bind(this), this._boundOnMouseMove = this._onMouseMove.bind(this), this._hookDiv = null, (t.tablet || t.phone) && this._createTouchHook(), this._renderer = e;
	}
	/**
	* Value of `true` if accessibility is currently active and accessibility layers are showing.
	* @type {boolean}
	* @readonly
	*/
	get isActive() {
		return this._isActive;
	}
	/**
	* Value of `true` if accessibility is enabled for touch devices.
	* @type {boolean}
	* @readonly
	*/
	get isMobileAccessibility() {
		return this._isMobileAccessibility;
	}
	/**
	* Button element for handling touch hooks.
	* @readonly
	*/
	get hookDiv() {
		return this._hookDiv;
	}
	/**
	* The DOM element that will sit over the PixiJS element. This is where the div overlays will go.
	* @readonly
	*/
	get div() {
		return this._div;
	}
	/**
	* Creates the touch hooks.
	* @private
	*/
	_createTouchHook() {
		let e = document.createElement("button");
		e.style.width = `${N}px`, e.style.height = `${N}px`, e.style.position = "absolute", e.style.top = `${P}px`, e.style.left = `${F}px`, e.style.zIndex = I.toString(), e.style.backgroundColor = "#FF0000", e.title = "select to enable accessibility for this content", e.addEventListener("focus", () => {
			this._isMobileAccessibility = !0, this._activate(), this._destroyTouchHook();
		}), document.body.appendChild(e), this._hookDiv = e;
	}
	/**
	* Destroys the touch hooks.
	* @private
	*/
	_destroyTouchHook() {
		this._hookDiv &&= (document.body.removeChild(this._hookDiv), null);
	}
	/**
	* Activating will cause the Accessibility layer to be shown.
	* This is called when a user presses the tab key.
	* @private
	*/
	_activate() {
		if (this._isActive) return;
		this._isActive = !0, this._div || (this._div = document.createElement("div"), this._div.style.position = "absolute", this._div.style.top = `${A}px`, this._div.style.left = `${j}px`, this._div.style.pointerEvents = "none", this._div.style.zIndex = M.toString(), this._canvasObserver = new s({
			domElement: this._div,
			renderer: this._renderer
		})), this._activateOnTab && globalThis.addEventListener("keydown", this._boundOnKeyDown, !1), this._deactivateOnMouseMove && globalThis.document.addEventListener("mousemove", this._boundOnMouseMove, !0);
		let e = this._renderer.view.canvas;
		if (e.parentNode) this._canvasObserver.ensureAttached(), this._initAccessibilitySetup();
		else {
			let t = new MutationObserver(() => {
				e.parentNode && (t.disconnect(), this._canvasObserver.ensureAttached(), this._initAccessibilitySetup());
			});
			t.observe(document.body, {
				childList: !0,
				subtree: !0
			});
		}
	}
	_initAccessibilitySetup() {
		this._renderer.runners.postrender.add(this), this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered);
	}
	/**
	* Deactivates the accessibility system. Removes listeners and accessibility elements.
	* @private
	*/
	_deactivate() {
		if (this._isActive && !this._isMobileAccessibility) {
			this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._activateOnTab && globalThis.addEventListener("keydown", this._boundOnKeyDown, !1), this._renderer.runners.postrender.remove(this);
			for (let e of this._children) e._accessibleDiv?.parentNode && (e._accessibleDiv.parentNode.removeChild(e._accessibleDiv), e._accessibleDiv = null), e._accessibleActive = !1;
			for (let e in this._pools) this._pools[e].forEach((e) => {
				e.parentNode && e.parentNode.removeChild(e);
			}), delete this._pools[e];
			this._div?.parentNode && this._div.parentNode.removeChild(this._div), this._pools = {}, this._children = [];
		}
	}
	/**
	* This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
	* @private
	* @param {Container} container - The Container to check.
	*/
	_updateAccessibleObjects(e) {
		if (!e.visible || !e.accessibleChildren) return;
		e.accessible && (e._accessibleActive || this._addChild(e), e._renderId = this._renderId);
		let t = e.children;
		if (t) for (let e = 0; e < t.length; e++) this._updateAccessibleObjects(t[e]);
	}
	/**
	* Runner init called, view is available at this point.
	* @ignore
	*/
	init(t) {
		let n = { accessibilityOptions: {
			...e.defaultOptions,
			...t?.accessibilityOptions || {}
		} };
		this.debug = n.accessibilityOptions.debug, this._activateOnTab = n.accessibilityOptions.activateOnTab, this._deactivateOnMouseMove = n.accessibilityOptions.deactivateOnMouseMove, n.accessibilityOptions.enabledByDefault && this._activate(), this._renderer.runners.postrender.remove(this);
	}
	/**
	* Updates the accessibility layer during rendering.
	* - Removes divs for containers no longer in the scene
	* - Updates the position and dimensions of the root div
	* - Updates positions of active accessibility divs
	* Only fires while the accessibility system is active.
	* @ignore
	*/
	postrender() {
		let e = performance.now();
		if (this._mobileInfo.android.device && e < this._androidUpdateCount || (this._androidUpdateCount = e + this._androidUpdateFrequency, (!this._renderer.renderingToScreen || !this._renderer.view.canvas) && !this._isRunningTests)) return;
		let t = /* @__PURE__ */ new Set();
		if (this._renderer.lastObjectRendered) {
			this._updateAccessibleObjects(this._renderer.lastObjectRendered);
			for (let e of this._children) e._renderId === this._renderId && t.add(this._children.indexOf(e));
		}
		for (let e = this._children.length - 1; e >= 0; e--) {
			let n = this._children[e];
			t.has(e) || (n._accessibleDiv && n._accessibleDiv.parentNode && (n._accessibleDiv.parentNode.removeChild(n._accessibleDiv), this._getPool(n.accessibleType).push(n._accessibleDiv), n._accessibleDiv = null), n._accessibleActive = !1, i(this._children, e, 1));
		}
		this._renderer.renderingToScreen && this._canvasObserver.ensureAttached();
		for (let e = 0; e < this._children.length; e++) {
			let t = this._children[e];
			if (!t._accessibleActive || !t._accessibleDiv) continue;
			let n = t._accessibleDiv, r = t.hitArea || t.getBounds().rectangle;
			if (t.hitArea) {
				let e = t.worldTransform;
				n.style.left = `${e.tx + r.x * e.a}px`, n.style.top = `${e.ty + r.y * e.d}px`, n.style.width = `${r.width * e.a}px`, n.style.height = `${r.height * e.d}px`;
			} else this._capHitArea(r), n.style.left = `${r.x}px`, n.style.top = `${r.y}px`, n.style.width = `${r.width}px`, n.style.height = `${r.height}px`;
		}
		this._renderId++;
	}
	/**
	* private function that will visually add the information to the
	* accessibility div
	* @param {HTMLElement} div -
	*/
	_updateDebugHTML(e) {
		e.innerHTML = `type: ${e.type}</br> title : ${e.title}</br> tabIndex: ${e.tabIndex}`;
	}
	/**
	* Adjust the hit area based on the bounds of a display object
	* @param {Rectangle} hitArea - Bounds of the child
	*/
	_capHitArea(e) {
		e.x < 0 && (e.width += e.x, e.x = 0), e.y < 0 && (e.height += e.y, e.y = 0);
		let { width: t, height: n } = this._renderer;
		e.x + e.width > t && (e.width = t - e.x), e.y + e.height > n && (e.height = n - e.y);
	}
	/**
	* Creates or reuses a div element for a Container and adds it to the accessibility layer.
	* Sets up ARIA attributes, event listeners, and positioning based on the container's properties.
	* @private
	* @param {Container} container - The child to make accessible.
	*/
	_addChild(e) {
		let t = this._getPool(e.accessibleType).pop();
		t ? (t.innerHTML = "", t.removeAttribute("title"), t.removeAttribute("aria-label"), t.tabIndex = 0) : (e.accessibleType === "button" ? t = document.createElement("button") : (t = document.createElement(e.accessibleType), t.style.cssText = "\n                        color: transparent;\n                        pointer-events: none;\n                        padding: 0;\n                        margin: 0;\n                        border: 0;\n                        outline: 0;\n                        background: transparent;\n                        box-sizing: border-box;\n                        user-select: none;\n                        -webkit-user-select: none;\n                        -moz-user-select: none;\n                        -ms-user-select: none;\n                    ", e.accessibleText && (t.innerText = e.accessibleText)), t.style.width = `${k}px`, t.style.height = `${k}px`, t.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", t.style.position = "absolute", t.style.zIndex = M.toString(), t.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? t.setAttribute("aria-live", "off") : t.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? t.setAttribute("aria-relevant", "additions") : t.setAttribute("aria-relevant", "text"), t.addEventListener("click", this._onClick.bind(this)), t.addEventListener("focus", this._onFocus.bind(this)), t.addEventListener("focusout", this._onFocusOut.bind(this))), t.style.pointerEvents = e.accessiblePointerEvents, t.type = e.accessibleType, e.accessibleTitle && e.accessibleTitle !== null ? t.title = e.accessibleTitle : (!e.accessibleHint || e.accessibleHint === null) && (t.title = `container ${e.tabIndex}`), e.accessibleHint && e.accessibleHint !== null && t.setAttribute("aria-label", e.accessibleHint), e.interactive ? t.tabIndex = e.tabIndex : t.tabIndex = 0, this.debug && this._updateDebugHTML(t), e._accessibleActive = !0, e._accessibleDiv = t, t.container = e, this._children.push(e), this._div.appendChild(e._accessibleDiv);
	}
	/**
	* Dispatch events with the EventSystem.
	* @param e
	* @param type
	* @private
	*/
	_dispatchEvent(e, t) {
		let { container: n } = e.target, r = this._renderer.events.rootBoundary, i = Object.assign(new c(r), { target: n });
		r.rootTarget = this._renderer.lastObjectRendered, t.forEach((e) => r.dispatchEvent(i, e));
	}
	/**
	* Maps the div button press to pixi's EventSystem (click)
	* @private
	* @param {MouseEvent} e - The click event.
	*/
	_onClick(e) {
		this._dispatchEvent(e, [
			"click",
			"pointertap",
			"tap"
		]);
	}
	/**
	* Maps the div focus events to pixi's EventSystem (mouseover)
	* @private
	* @param {FocusEvent} e - The focus event.
	*/
	_onFocus(e) {
		e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(e, ["mouseover"]);
	}
	/**
	* Maps the div focus events to pixi's EventSystem (mouseout)
	* @private
	* @param {FocusEvent} e - The focusout event.
	*/
	_onFocusOut(e) {
		e.target.getAttribute("aria-live") || e.target.setAttribute("aria-live", "polite"), this._dispatchEvent(e, ["mouseout"]);
	}
	/**
	* Is called when a key is pressed
	* @private
	* @param {KeyboardEvent} e - The keydown event.
	*/
	_onKeyDown(e) {
		e.keyCode === O && this._activateOnTab && this._activate();
	}
	/**
	* Is called when the mouse moves across the renderer element
	* @private
	* @param {MouseEvent} e - The mouse event.
	*/
	_onMouseMove(e) {
		(e.movementX !== 0 || e.movementY !== 0) && this._deactivate();
	}
	/**
	* Destroys the accessibility system. Removes all elements and listeners.
	* > [!IMPORTANT] This is typically called automatically when the {@link Application} is destroyed.
	* > A typically user should not need to call this method directly.
	*/
	destroy() {
		this._deactivate(), this._destroyTouchHook(), this._canvasObserver?.destroy(), this._canvasObserver = null, this._div = null, this._pools = null, this._children = null, this._renderer = null, this._hookDiv = null, globalThis.removeEventListener("keydown", this._boundOnKeyDown), this._boundOnKeyDown = null, globalThis.document.removeEventListener("mousemove", this._boundOnMouseMove, !0), this._boundOnMouseMove = null;
	}
	/**
	* Enables or disables the accessibility system.
	* @param enabled - Whether to enable or disable accessibility.
	* @example
	* ```js
	* app.renderer.accessibility.setAccessibilityEnabled(true); // Enable accessibility
	* app.renderer.accessibility.setAccessibilityEnabled(false); // Disable accessibility
	* ```
	*/
	setAccessibilityEnabled(e) {
		e ? this._activate() : this._deactivate();
	}
	_getPool(e) {
		return this._pools[e] || (this._pools[e] = []), this._pools[e];
	}
};
/**
* The default options used by the system.
* You can set these before initializing the {@link Application} to change the default behavior.
* @example
* ```js
* import { AccessibilitySystem } from 'pixi.js';
*
* AccessibilitySystem.defaultOptions.enabledByDefault = true;
*
* const app = new Application()
* app.init()
* ```
*/
L.extension = {
	type: [t.WebGLSystem, t.WebGPUSystem],
	name: "accessibility"
}, L.defaultOptions = {
	/**
	* Whether to enable accessibility features on initialization
	* @default false
	*/
	enabledByDefault: !1,
	/**
	* Whether to visually show the accessibility divs for debugging
	* @default false
	*/
	debug: !1,
	/**
	* Whether to activate accessibility when tab key is pressed
	* @default true
	*/
	activateOnTab: !0,
	/**
	* Whether to deactivate accessibility when mouse moves
	* @default true
	*/
	deactivateOnMouseMove: !0
};
var R = L, z = {
	accessible: !1,
	accessibleTitle: null,
	accessibleHint: null,
	tabIndex: 0,
	accessibleType: "button",
	accessibleText: null,
	accessiblePointerEvents: "auto",
	accessibleChildren: !0,
	_accessibleActive: !1,
	_accessibleDiv: null,
	_renderId: -1
}, B = class {
	/**
	* Constructor for the DOMPipe class.
	* @param renderer - The renderer instance that this DOMPipe will be associated with.
	*/
	constructor(e) {
		this._attachedDomElements = [], this._renderer = e, this._renderer.runners.postrender.add(this), this._renderer.runners.init.add(this), this._domElement = document.createElement("div"), this._domElement.style.position = "absolute", this._domElement.style.top = "0", this._domElement.style.left = "0", this._domElement.style.pointerEvents = "none", this._domElement.style.zIndex = "1000";
	}
	/** Initializes the DOMPipe, setting up the main DOM element and adding it to the document body. */
	init() {
		this._canvasObserver = new s({
			domElement: this._domElement,
			renderer: this._renderer
		});
	}
	/**
	* Adds a renderable DOM container to the list of attached elements.
	* @param domContainer - The DOM container to be added.
	* @param _instructionSet - The instruction set (unused).
	*/
	addRenderable(e, t) {
		this._attachedDomElements.includes(e) || this._attachedDomElements.push(e);
	}
	/**
	* Updates a renderable DOM container.
	* @param _domContainer - The DOM container to be updated (unused).
	*/
	updateRenderable(e) {}
	/**
	* Validates a renderable DOM container.
	* @param _domContainer - The DOM container to be validated (unused).
	* @returns Always returns true as validation is not required.
	*/
	validateRenderable(e) {
		return !0;
	}
	/** Handles the post-rendering process, ensuring DOM elements are correctly positioned and visible. */
	postrender() {
		let e = this._attachedDomElements;
		if (e.length === 0) {
			this._domElement.remove();
			return;
		}
		this._canvasObserver.ensureAttached();
		for (let t = 0; t < e.length; t++) {
			let n = e[t], r = n.element;
			if (!n.parent || n.globalDisplayStatus < 7) r?.remove(), e.splice(t, 1), t--;
			else {
				this._domElement.contains(r) || (r.style.position = "absolute", r.style.pointerEvents = "auto", this._domElement.appendChild(r));
				let e = n.worldTransform, t = n._anchor, i = n.width * t.x, a = n.height * t.y;
				r.style.transformOrigin = `${i}px ${a}px`, r.style.transform = `matrix(${e.a}, ${e.b}, ${e.c}, ${e.d}, ${e.tx - i}, ${e.ty - a})`, r.style.opacity = n.groupAlpha.toString();
			}
		}
	}
	/** Destroys the DOMPipe, removing all attached DOM elements and cleaning up resources. */
	destroy() {
		this._renderer.runners.postrender.remove(this);
		for (let e = 0; e < this._attachedDomElements.length; e++) this._attachedDomElements[e].element?.remove();
		this._attachedDomElements.length = 0, this._domElement.remove(), this._canvasObserver.destroy(), this._renderer = null;
	}
};
/**
* Static property defining the extension type and name for the DOMPipe.
* This is used to register the DOMPipe with different rendering pipelines.
*/
B.extension = {
	type: [
		t.WebGLPipes,
		t.WebGPUPipes,
		t.CanvasPipes
	],
	name: "dom"
};
var V = new class {
	constructor() {
		this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
	}
	/**
	* Initializes the event ticker.
	* @param events - The event system.
	*/
	init(e) {
		this.removeTickerListener(), this.events = e, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
	}
	/** Whether to pause the update checks or not. */
	get pauseUpdate() {
		return this._pauseUpdate;
	}
	set pauseUpdate(e) {
		this._pauseUpdate = e;
	}
	/** Adds the ticker listener. */
	addTickerListener() {
		!this._tickerAdded && this.domElement && (o.system.add(this._tickerUpdate, this, a.INTERACTION), this._tickerAdded = !0);
	}
	/** Removes the ticker listener. */
	removeTickerListener() {
		this._tickerAdded &&= (o.system.remove(this._tickerUpdate, this), !1);
	}
	/** Sets flag to not fire extra events when the user has already moved there mouse */
	pointerMoved() {
		this._didMove = !0;
	}
	/** Updates the state of interactive objects. */
	_update() {
		if (!this.domElement || this._pauseUpdate) return;
		if (this._didMove) {
			this._didMove = !1;
			return;
		}
		let e = this.events._rootPointerEvent;
		this.events.supportsTouchEvents && e.pointerType === "touch" || globalThis.document.dispatchEvent(this.events.supportsPointerEvents ? new PointerEvent("pointermove", {
			clientX: e.clientX,
			clientY: e.clientY,
			pointerType: e.pointerType,
			pointerId: e.pointerId
		}) : new MouseEvent("mousemove", {
			clientX: e.clientX,
			clientY: e.clientY
		}));
	}
	/**
	* Updates the state of interactive objects if at least {@link interactionFrequency}
	* milliseconds have passed since the last invocation.
	*
	* Invoked by a throttled ticker update from {@link Ticker.system}.
	* @param ticker - The throttled ticker.
	*/
	_tickerUpdate(e) {
		this._deltaTime += e.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update());
	}
	/** Destroys the event ticker. */
	destroy() {
		this.removeTickerListener(), this.events = null, this.domElement = null, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
	}
}(), H = class extends c {
	constructor() {
		/**
		* The pointer coordinates in the renderer's {@link AbstractRenderer.screen screen}. This has slightly
		* different semantics than native PointerEvent screenX/screenY.
		*/
		super(...arguments), this.client = new e(), this.movement = new e(), this.offset = new e(), this.global = new e(), this.screen = new e();
	}
	/** @readonly */
	get clientX() {
		return this.client.x;
	}
	/** @readonly */
	get clientY() {
		return this.client.y;
	}
	/**
	* Alias for {@link FederatedMouseEvent.clientX this.clientX}.
	* @readonly
	*/
	get x() {
		return this.clientX;
	}
	/**
	* Alias for {@link FederatedMouseEvent.clientY this.clientY}.
	* @readonly
	*/
	get y() {
		return this.clientY;
	}
	/** @readonly */
	get movementX() {
		return this.movement.x;
	}
	/** @readonly */
	get movementY() {
		return this.movement.y;
	}
	/** @readonly */
	get offsetX() {
		return this.offset.x;
	}
	/** @readonly */
	get offsetY() {
		return this.offset.y;
	}
	/** @readonly */
	get globalX() {
		return this.global.x;
	}
	/** @readonly */
	get globalY() {
		return this.global.y;
	}
	/**
	* The pointer coordinates in the renderer's screen. Alias for `screen.x`.
	* @readonly
	*/
	get screenX() {
		return this.screen.x;
	}
	/**
	* The pointer coordinates in the renderer's screen. Alias for `screen.y`.
	* @readonly
	*/
	get screenY() {
		return this.screen.y;
	}
	/**
	* Converts global coordinates into container-local coordinates.
	*
	* This method transforms coordinates from world space to a container's local space,
	* useful for precise positioning and hit testing.
	* @param container - The Container to get local coordinates for
	* @param point - Optional Point object to store the result. If not provided, a new Point will be created
	* @param globalPos - Optional custom global coordinates. If not provided, the event's global position is used
	* @returns The local coordinates as a Point object
	* @example
	* ```ts
	* // Basic usage - get local coordinates relative to a container
	* sprite.on('pointermove', (event: FederatedMouseEvent) => {
	*     // Get position relative to the sprite
	*     const localPos = event.getLocalPosition(sprite);
	*     console.log('Local position:', localPos.x, localPos.y);
	* });
	* // Using custom global coordinates
	* const customGlobal = new Point(100, 100);
	* sprite.on('pointermove', (event: FederatedMouseEvent) => {
	*     // Transform custom coordinates
	*     const localPos = event.getLocalPosition(sprite, undefined, customGlobal);
	*     console.log('Custom local position:', localPos.x, localPos.y);
	* });
	* ```
	* @see {@link Container.worldTransform} For the transformation matrix
	* @see {@link Point} For the point class used to store coordinates
	*/
	getLocalPosition(e, t, n) {
		return e.worldTransform.applyInverse(n || this.global, t);
	}
	/**
	* Whether the modifier key was pressed when this event natively occurred.
	* @param key - The modifier key.
	*/
	getModifierState(e) {
		return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(e);
	}
	/**
	* Not supported.
	* @param _typeArg
	* @param _canBubbleArg
	* @param _cancelableArg
	* @param _viewArg
	* @param _detailArg
	* @param _screenXArg
	* @param _screenYArg
	* @param _clientXArg
	* @param _clientYArg
	* @param _ctrlKeyArg
	* @param _altKeyArg
	* @param _shiftKeyArg
	* @param _metaKeyArg
	* @param _buttonArg
	* @param _relatedTargetArg
	* @deprecated since 7.0.0
	* @ignore
	*/
	initMouseEvent(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
		throw Error("Method not implemented.");
	}
}, U = class extends H {
	constructor() {
		/**
		* A unique identifier for the pointing device generating the event, that persists across events.
		* @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/persistentDeviceId
		*/
		super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1, this.persistentDeviceId = 0;
	}
	/**
	* Only included for completeness for now
	* @ignore
	*/
	getCoalescedEvents() {
		return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
	}
	/**
	* Only included for completeness for now
	* @ignore
	*/
	getPredictedEvents() {
		throw Error("getPredictedEvents is not supported!");
	}
}, W = class extends H {
	constructor() {
		/**
		* Units specified in pages.
		* @ignore
		*/
		super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
	}
};
/**
* Units specified in pages.
* @ignore
*/
W.DOM_DELTA_PIXEL = 0, W.DOM_DELTA_LINE = 1, W.DOM_DELTA_PAGE = 2;
//#endregion
//#region node_modules/pixi.js/lib/events/EventBoundary.mjs
var G = 2048, K = new e(), q = new e(), J = class {
	/**
	* @param rootTarget - The holder of the event boundary.
	*/
	constructor(e) {
		this.dispatch = new n(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = { trackingData: {} }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = e, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
	}
	/**
	* Adds an event mapping for the event `type` handled by `fn`.
	*
	* Event mappings can be used to implement additional or custom events. They take an event
	* coming from the upstream scene (or directly from the {@link EventSystem}) and dispatch new downstream events
	* generally trickling down and bubbling up to {@link EventBoundary.rootTarget this.rootTarget}.
	*
	* To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
	* instead.
	* @param type - The type of upstream event to map.
	* @param fn - The mapping method. The context of this function must be bound manually, if desired.
	*/
	addEventMapping(e, t) {
		this.mappingTable[e] || (this.mappingTable[e] = []), this.mappingTable[e].push({
			fn: t,
			priority: 0
		}), this.mappingTable[e].sort((e, t) => e.priority - t.priority);
	}
	/**
	* Dispatches the given event
	* @param e - The event to dispatch.
	* @param type - The type of event to dispatch. Defaults to `e.type`.
	*/
	dispatchEvent(e, t) {
		e.propagationStopped = !1, e.propagationImmediatelyStopped = !1, this.propagate(e, t), this.dispatch.emit(t || e.type, e);
	}
	/**
	* Maps the given upstream event through the event boundary and propagates it downstream.
	* @param e - The event to map.
	*/
	mapEvent(e) {
		if (!this.rootTarget) return;
		let t = this.mappingTable[e.type];
		if (t) for (let n = 0, r = t.length; n < r; n++) t[n].fn(e);
		else r(`[EventBoundary]: Event mapping not defined for ${e.type}`);
	}
	/**
	* Finds the Container that is the target of a event at the given coordinates.
	*
	* The passed (x,y) coordinates are in the world space above this event boundary.
	* @param x - The x coordinate of the event.
	* @param y - The y coordinate of the event.
	*/
	hitTest(e, t) {
		V.pauseUpdate = !0;
		let n = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", r = this[n](this.rootTarget, this.rootTarget.eventMode, K.set(e, t), this.hitTestFn, this.hitPruneFn);
		return r && r[0];
	}
	/**
	* Propagate the passed event from from {@link EventBoundary.rootTarget this.rootTarget} to its
	* target `e.target`.
	* @param e - The event to propagate.
	* @param type - The type of event to propagate. Defaults to `e.type`.
	*/
	propagate(e, t) {
		if (!e.target) return;
		let n = e.composedPath();
		e.eventPhase = e.CAPTURING_PHASE;
		for (let r = 0, i = n.length - 1; r < i; r++) if (e.currentTarget = n[r], this.notifyTarget(e, t), e.propagationStopped || e.propagationImmediatelyStopped) return;
		if (e.eventPhase = e.AT_TARGET, e.currentTarget = e.target, this.notifyTarget(e, t), !(e.propagationStopped || e.propagationImmediatelyStopped)) {
			e.eventPhase = e.BUBBLING_PHASE;
			for (let r = n.length - 2; r >= 0; r--) if (e.currentTarget = n[r], this.notifyTarget(e, t), e.propagationStopped || e.propagationImmediatelyStopped) return;
		}
	}
	/**
	* Emits the event `e` to all interactive containers. The event is propagated in the bubbling phase always.
	*
	* This is used in the `globalpointermove` event.
	* @param e - The emitted event.
	* @param type - The listeners to notify.
	* @param targets - The targets to notify.
	*/
	all(e, t, n = this._allInteractiveElements) {
		if (n.length === 0) return;
		e.eventPhase = e.BUBBLING_PHASE;
		let r = Array.isArray(t) ? t : [t];
		for (let t = n.length - 1; t >= 0; t--) r.forEach((r) => {
			e.currentTarget = n[t], this.notifyTarget(e, r);
		});
	}
	/**
	* Finds the propagation path from {@link EventBoundary.rootTarget rootTarget} to the passed
	* `target`. The last element in the path is `target`.
	* @param target - The target to find the propagation path to.
	*/
	propagationPath(e) {
		let t = [e];
		for (let n = 0; n < G && e !== this.rootTarget && e.parent; n++) {
			if (!e.parent) throw Error("Cannot find propagation path to disconnected target");
			t.push(e.parent), e = e.parent;
		}
		return t.reverse(), t;
	}
	hitTestMoveRecursive(e, t, n, r, i, a = !1) {
		let o = !1;
		if (this._interactivePrune(e)) return null;
		if ((e.eventMode === "dynamic" || t === "dynamic") && (V.pauseUpdate = !1), e.interactiveChildren && e.children) {
			let s = e.children;
			for (let c = s.length - 1; c >= 0; c--) {
				let l = s[c], u = this.hitTestMoveRecursive(l, this._isInteractive(t) ? t : l.eventMode, n, r, i, a || i(e, n));
				if (u) {
					if (u.length > 0 && !u[u.length - 1].parent) continue;
					let t = e.isInteractive();
					(u.length > 0 || t) && (t && this._allInteractiveElements.push(e), u.push(e)), this._hitElements.length === 0 && (this._hitElements = u), o = !0;
				}
			}
		}
		let s = this._isInteractive(t), c = e.isInteractive();
		return c && c && this._allInteractiveElements.push(e), a || this._hitElements.length > 0 ? null : o ? this._hitElements : s && !i(e, n) && r(e, n) ? c ? [e] : [] : null;
	}
	/**
	* Recursive implementation for {@link EventBoundary.hitTest hitTest}.
	* @param currentTarget - The Container that is to be hit tested.
	* @param eventMode - The event mode for the `currentTarget` or one of its parents.
	* @param location - The location that is being tested for overlap.
	* @param testFn - Callback that determines whether the target passes hit testing. This callback
	*  can assume that `pruneFn` failed to prune the container.
	* @param pruneFn - Callback that determiness whether the target and all of its children
	*  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
	*  of the scene graph.
	* @returns An array holding the hit testing target and all its ancestors in order. The first element
	*  is the target itself and the last is {@link EventBoundary.rootTarget rootTarget}. This is the opposite
	*  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
	*/
	hitTestRecursive(e, t, n, r, i) {
		if (this._interactivePrune(e) || i(e, n)) return null;
		if ((e.eventMode === "dynamic" || t === "dynamic") && (V.pauseUpdate = !1), e.interactiveChildren && e.children) {
			let a = e.children, o = n;
			for (let n = a.length - 1; n >= 0; n--) {
				let s = a[n], c = this.hitTestRecursive(s, this._isInteractive(t) ? t : s.eventMode, o, r, i);
				if (c) {
					if (c.length > 0 && !c[c.length - 1].parent) continue;
					let t = e.isInteractive();
					return (c.length > 0 || t) && c.push(e), c;
				}
			}
		}
		let a = this._isInteractive(t), o = e.isInteractive();
		return a && r(e, n) ? o ? [e] : [] : null;
	}
	_isInteractive(e) {
		return e === "static" || e === "dynamic";
	}
	_interactivePrune(e) {
		return !e || !e.visible || !e.renderable || !e.measurable || e.eventMode === "none" || e.eventMode === "passive" && !e.interactiveChildren;
	}
	/**
	* Checks whether the container or any of its children cannot pass the hit test at all.
	*
	* {@link EventBoundary}'s implementation uses the {@link Container.hitArea hitArea}
	* and {@link Container._maskEffect} for pruning.
	* @param container - The container to prune.
	* @param location - The location to test for overlap.
	*/
	hitPruneFn(e, t) {
		if (e.hitArea && (e.worldTransform.applyInverse(t, q), !e.hitArea.contains(q.x, q.y))) return !0;
		if (e.effects && e.effects.length) for (let n = 0; n < e.effects.length; n++) {
			let r = e.effects[n];
			if (r.containsPoint && !r.containsPoint(t, this.hitTestFn)) return !0;
		}
		return !1;
	}
	/**
	* Checks whether the container passes hit testing for the given location.
	* @param container - The container to test.
	* @param location - The location to test for overlap.
	* @returns - Whether `container` passes hit testing for `location`.
	*/
	hitTestFn(e, t) {
		return e.hitArea ? !0 : e?.containsPoint ? (e.worldTransform.applyInverse(t, q), e.containsPoint(q)) : !1;
	}
	/**
	* Notify all the listeners to the event's `currentTarget`.
	*
	* If the `currentTarget` contains the property `on<type>`, then it is called here,
	* simulating the behavior from version 6.x and prior.
	* @param e - The event passed to the target.
	* @param type - The type of event to notify. Defaults to `e.type`.
	*/
	notifyTarget(e, t) {
		if (!e.currentTarget.isInteractive()) return;
		t ??= e.type;
		let n = `on${t}`;
		e.currentTarget[n]?.(e);
		let r = e.eventPhase === e.CAPTURING_PHASE || e.eventPhase === e.AT_TARGET ? `${t}capture` : t;
		this._notifyListeners(e, r), e.eventPhase === e.AT_TARGET && this._notifyListeners(e, t);
	}
	/**
	* Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
	*
	* `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
	* @param from - The upstream `pointerdown` event.
	*/
	mapPointerDown(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		let t = this.createPointerEvent(e);
		if (this.dispatchEvent(t, "pointerdown"), t.pointerType === "touch") this.dispatchEvent(t, "touchstart");
		else if (t.pointerType === "mouse" || t.pointerType === "pen") {
			let e = t.button === 2;
			this.dispatchEvent(t, e ? "rightdown" : "mousedown");
		}
		let n = this.trackingData(e.pointerId);
		n.pressTargetsByButton[e.button] = t.composedPath(), this.freeEvent(t);
	}
	/**
	* Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
	*
	* The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
	* `mousemove`, and `touchmove` events are fired as well for specific pointer types.
	* @param from - The upstream `pointermove` event.
	*/
	mapPointerMove(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
		let t = this.createPointerEvent(e);
		this._isPointerMoveEvent = !1;
		let n = t.pointerType === "mouse" || t.pointerType === "pen", i = this.trackingData(e.pointerId), a = this.findMountedTarget(i.overTargets);
		if (i.overTargets?.length > 0 && a !== t.target) {
			let r = e.type === "mousemove" ? "mouseout" : "pointerout", i = this.createPointerEvent(e, r, a);
			if (this.dispatchEvent(i, "pointerout"), n && this.dispatchEvent(i, "mouseout"), !t.composedPath().includes(a)) {
				let r = this.createPointerEvent(e, "pointerleave", a);
				for (r.eventPhase = r.AT_TARGET; r.target && !t.composedPath().includes(r.target);) r.currentTarget = r.target, this.notifyTarget(r), n && this.notifyTarget(r, "mouseleave"), r.target = r.target.parent;
				this.freeEvent(r);
			}
			this.freeEvent(i);
		}
		if (a !== t.target) {
			let r = e.type === "mousemove" ? "mouseover" : "pointerover", i = this.clonePointerEvent(t, r);
			this.dispatchEvent(i, "pointerover"), n && this.dispatchEvent(i, "mouseover");
			let o = a?.parent;
			for (; o && o !== this.rootTarget.parent && o !== t.target;) o = o.parent;
			if (!o || o === this.rootTarget.parent) {
				let e = this.clonePointerEvent(t, "pointerenter");
				for (e.eventPhase = e.AT_TARGET; e.target && e.target !== a && e.target !== this.rootTarget.parent;) e.currentTarget = e.target, this.notifyTarget(e), n && this.notifyTarget(e, "mouseenter"), e.target = e.target.parent;
				this.freeEvent(e);
			}
			this.freeEvent(i);
		}
		let o = [], s = this.enableGlobalMoveEvents ?? !0;
		this.moveOnAll ? o.push("pointermove") : this.dispatchEvent(t, "pointermove"), s && o.push("globalpointermove"), t.pointerType === "touch" && (this.moveOnAll ? o.splice(1, 0, "touchmove") : this.dispatchEvent(t, "touchmove"), s && o.push("globaltouchmove")), n && (this.moveOnAll ? o.splice(1, 0, "mousemove") : this.dispatchEvent(t, "mousemove"), s && o.push("globalmousemove"), this.cursor = t.target?.cursor), o.length > 0 && this.all(t, o), this._allInteractiveElements.length = 0, this._hitElements.length = 0, i.overTargets = t.composedPath(), this.freeEvent(t);
	}
	/**
	* Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
	*
	* The tracking data for the specific pointer gets a new `overTarget`.
	* @param from - The upstream `pointerover` event.
	*/
	mapPointerOver(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		let t = this.trackingData(e.pointerId), n = this.createPointerEvent(e), i = n.pointerType === "mouse" || n.pointerType === "pen";
		this.dispatchEvent(n, "pointerover"), i && this.dispatchEvent(n, "mouseover"), n.pointerType === "mouse" && (this.cursor = n.target?.cursor);
		let a = this.clonePointerEvent(n, "pointerenter");
		for (a.eventPhase = a.AT_TARGET; a.target && a.target !== this.rootTarget.parent;) a.currentTarget = a.target, this.notifyTarget(a), i && this.notifyTarget(a, "mouseenter"), a.target = a.target.parent;
		t.overTargets = n.composedPath(), this.freeEvent(n), this.freeEvent(a);
	}
	/**
	* Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
	*
	* The tracking data for the specific pointer is cleared of a `overTarget`.
	* @param from - The upstream `pointerout` event.
	*/
	mapPointerOut(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		let t = this.trackingData(e.pointerId);
		if (t.overTargets) {
			let n = e.pointerType === "mouse" || e.pointerType === "pen", r = this.findMountedTarget(t.overTargets), i = this.createPointerEvent(e, "pointerout", r);
			this.dispatchEvent(i), n && this.dispatchEvent(i, "mouseout");
			let a = this.createPointerEvent(e, "pointerleave", r);
			for (a.eventPhase = a.AT_TARGET; a.target && a.target !== this.rootTarget.parent;) a.currentTarget = a.target, this.notifyTarget(a), n && this.notifyTarget(a, "mouseleave"), a.target = a.target.parent;
			t.overTargets = null, this.freeEvent(i), this.freeEvent(a);
		}
		this.cursor = null;
	}
	/**
	* Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
	* and `click`/`rightclick`/`pointertap` events, in that order.
	*
	* The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
	* ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
	* `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
	* specific pointer types.
	* @param from - The upstream `pointerup` event.
	*/
	mapPointerUp(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		let t = performance.now(), n = this.createPointerEvent(e);
		if (this.dispatchEvent(n, "pointerup"), n.pointerType === "touch") this.dispatchEvent(n, "touchend");
		else if (n.pointerType === "mouse" || n.pointerType === "pen") {
			let e = n.button === 2;
			this.dispatchEvent(n, e ? "rightup" : "mouseup");
		}
		let i = this.trackingData(e.pointerId), a = this.findMountedTarget(i.pressTargetsByButton[e.button]), o = a;
		if (a && !n.composedPath().includes(a)) {
			let t = a;
			for (; t && !n.composedPath().includes(t);) {
				if (n.currentTarget = t, this.notifyTarget(n, "pointerupoutside"), n.pointerType === "touch") this.notifyTarget(n, "touchendoutside");
				else if (n.pointerType === "mouse" || n.pointerType === "pen") {
					let e = n.button === 2;
					this.notifyTarget(n, e ? "rightupoutside" : "mouseupoutside");
				}
				t = t.parent;
			}
			delete i.pressTargetsByButton[e.button], o = t;
		}
		if (o) {
			let r = this.clonePointerEvent(n, "click");
			r.target = o, r.path = null, i.clicksByButton[e.button] || (i.clicksByButton[e.button] = {
				clickCount: 0,
				target: r.target,
				timeStamp: t
			});
			let a = i.clicksByButton[e.button];
			if (a.target === r.target && t - a.timeStamp < 200 ? ++a.clickCount : a.clickCount = 1, a.target = r.target, a.timeStamp = t, r.detail = a.clickCount, r.pointerType === "mouse") {
				let e = r.button === 2;
				this.dispatchEvent(r, e ? "rightclick" : "click");
			} else r.pointerType === "touch" && this.dispatchEvent(r, "tap");
			this.dispatchEvent(r, "pointertap"), this.freeEvent(r);
		}
		this.freeEvent(n);
	}
	/**
	* Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
	* `pointerdown` target to `rootTarget`.
	*
	* (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
	* `{@link EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
	*
	* `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
	* types. The tracking data for the specific pointer is cleared of a `pressTarget`.
	* @param from - The upstream `pointerupoutside` event.
	*/
	mapPointerUpOutside(e) {
		if (!(e instanceof U)) {
			r("EventBoundary cannot map a non-pointer event as a pointer event");
			return;
		}
		let t = this.trackingData(e.pointerId), n = this.findMountedTarget(t.pressTargetsByButton[e.button]), i = this.createPointerEvent(e);
		if (n) {
			let r = n;
			for (; r;) i.currentTarget = r, this.notifyTarget(i, "pointerupoutside"), i.pointerType === "touch" ? this.notifyTarget(i, "touchendoutside") : (i.pointerType === "mouse" || i.pointerType === "pen") && this.notifyTarget(i, i.button === 2 ? "rightupoutside" : "mouseupoutside"), r = r.parent;
			delete t.pressTargetsByButton[e.button];
		}
		this.freeEvent(i);
	}
	/**
	* Maps the upstream `wheel` event to a downstream `wheel` event.
	* @param from - The upstream `wheel` event.
	*/
	mapWheel(e) {
		if (!(e instanceof W)) {
			r("EventBoundary cannot map a non-wheel event as a wheel event");
			return;
		}
		let t = this.createWheelEvent(e);
		this.dispatchEvent(t), this.freeEvent(t);
	}
	/**
	* Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
	*
	* This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
	* or `pointerover` target was unmounted from the scene graph.
	* @param propagationPath - The propagation path was valid in the past.
	* @returns - The most specific event-target still mounted at the same location in the scene graph.
	*/
	findMountedTarget(e) {
		if (!e) return null;
		let t = e[0];
		for (let n = 1; n < e.length && e[n].parent === t; n++) t = e[n];
		return t;
	}
	/**
	* Creates an event whose `originalEvent` is `from`, with an optional `type` and `target` override.
	*
	* The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
	* @param from - The `originalEvent` for the returned event.
	* @param [type=from.type] - The type of the returned event.
	* @param target - The target of the returned event.
	*/
	createPointerEvent(e, t, n) {
		let r = this.allocateEvent(U);
		return this.copyPointerData(e, r), this.copyMouseData(e, r), this.copyData(e, r), r.nativeEvent = e.nativeEvent, r.originalEvent = e, r.target = n ?? this.hitTest(r.global.x, r.global.y) ?? this._hitElements[0], typeof t == "string" && (r.type = t), r;
	}
	/**
	* Creates a wheel event whose `originalEvent` is `from`.
	*
	* The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
	* @param from - The upstream wheel event.
	*/
	createWheelEvent(e) {
		let t = this.allocateEvent(W);
		return this.copyWheelData(e, t), this.copyMouseData(e, t), this.copyData(e, t), t.nativeEvent = e.nativeEvent, t.originalEvent = e, t.target = this.hitTest(t.global.x, t.global.y), t;
	}
	/**
	* Clones the event `from`, with an optional `type` override.
	*
	* The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
	* @param from - The event to clone.
	* @param [type=from.type] - The type of the returned event.
	*/
	clonePointerEvent(e, t) {
		let n = this.allocateEvent(U);
		return n.nativeEvent = e.nativeEvent, n.originalEvent = e.originalEvent, this.copyPointerData(e, n), this.copyMouseData(e, n), this.copyData(e, n), n.target = e.target, n.path = e.composedPath().slice(), n.type = t ?? n.type, n;
	}
	/**
	* Copies wheel {@link FederatedWheelEvent} data from `from` into `to`.
	*
	* The following properties are copied:
	* + deltaMode
	* + deltaX
	* + deltaY
	* + deltaZ
	* @param from - The event to copy data from.
	* @param to - The event to copy data into.
	*/
	copyWheelData(e, t) {
		t.deltaMode = e.deltaMode, t.deltaX = e.deltaX, t.deltaY = e.deltaY, t.deltaZ = e.deltaZ;
	}
	/**
	* Copies pointer {@link FederatedPointerEvent} data from `from` into `to`.
	*
	* The following properties are copied:
	* + pointerId
	* + width
	* + height
	* + isPrimary
	* + pointerType
	* + pressure
	* + tangentialPressure
	* + tiltX
	* + tiltY
	* @param from - The event to copy data from.
	* @param to - The event to copy data into.
	*/
	copyPointerData(e, t) {
		e instanceof U && t instanceof U && (t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, t.persistentDeviceId = e.persistentDeviceId);
	}
	/**
	* Copies mouse {@link FederatedMouseEvent} data from `from` to `to`.
	*
	* The following properties are copied:
	* + altKey
	* + button
	* + buttons
	* + clientX
	* + clientY
	* + metaKey
	* + movementX
	* + movementY
	* + pageX
	* + pageY
	* + x
	* + y
	* + screen
	* + shiftKey
	* + global
	* @param from - The event to copy data from.
	* @param to - The event to copy data into.
	*/
	copyMouseData(e, t) {
		e instanceof H && t instanceof H && (t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.copyFrom(e.client), t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.copyFrom(e.movement), t.screen.copyFrom(e.screen), t.shiftKey = e.shiftKey, t.global.copyFrom(e.global));
	}
	/**
	* Copies base {@link FederatedEvent} data from `from` into `to`.
	*
	* The following properties are copied:
	* + isTrusted
	* + srcElement
	* + timeStamp
	* + type
	* @param from - The event to copy data from.
	* @param to - The event to copy data into.
	*/
	copyData(e, t) {
		t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.detail = e.detail, t.view = e.view, t.which = e.which, t.layer.copyFrom(e.layer), t.page.copyFrom(e.page);
	}
	/**
	* @param id - The pointer ID.
	* @returns The tracking data stored for the given pointer. If no data exists, a blank
	*  state will be created.
	*/
	trackingData(e) {
		return this.mappingState.trackingData[e] || (this.mappingState.trackingData[e] = {
			pressTargetsByButton: {},
			clicksByButton: {},
			overTarget: null
		}), this.mappingState.trackingData[e];
	}
	/**
	* Allocate a specific type of event from {@link EventBoundary#eventPool this.eventPool}.
	*
	* This allocation is constructor-agnostic, as long as it only takes one argument - this event
	* boundary.
	* @param constructor - The event's constructor.
	* @returns An event of the given type.
	*/
	allocateEvent(e) {
		this.eventPool.has(e) || this.eventPool.set(e, []);
		let t = this.eventPool.get(e).pop() || new e(this);
		return t.eventPhase = t.NONE, t.currentTarget = null, t.defaultPrevented = !1, t.path = null, t.target = null, t;
	}
	/**
	* Frees the event and puts it back into the event pool.
	*
	* It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
	*
	* It is also advised that events not allocated from {@link EventBoundary#allocateEvent this.allocateEvent}
	* not be freed. This is because of the possibility that the same event is freed twice, which can cause
	* it to be allocated twice & result in overwriting.
	* @param event - The event to be freed.
	* @throws Error if the event is managed by another event boundary.
	*/
	freeEvent(e) {
		if (e.manager !== this) throw Error("It is illegal to free an event not managed by this EventBoundary!");
		let t = e.constructor;
		this.eventPool.has(t) || this.eventPool.set(t, []), this.eventPool.get(t).push(e);
	}
	/**
	* Similar to {@link EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
	* is set on the event.
	* @param e - The event to call each listener with.
	* @param type - The event key.
	*/
	_notifyListeners(e, t) {
		let n = e.currentTarget._events[t];
		if (n) {
			if ("fn" in n) n.once && e.currentTarget.removeListener(t, n.fn, void 0, !0), n.fn.call(n.context, e);
			else for (let r = 0, i = n.length; r < i && !e.propagationImmediatelyStopped; r++) n[r].once && e.currentTarget.removeListener(t, n[r].fn, void 0, !0), n[r].fn.call(n[r].context, e);
		}
	}
}, Y = 1, X = {
	touchstart: "pointerdown",
	touchend: "pointerup",
	touchendoutside: "pointerupoutside",
	touchmove: "pointermove",
	touchcancel: "pointercancel"
}, Z = class e {
	/**
	* @param {Renderer} renderer
	*/
	constructor(t) {
		this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new J(null), V.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new U(null), this._rootWheelEvent = new W(null), this.cursorStyles = {
			default: "inherit",
			pointer: "pointer"
		}, this.features = new Proxy({ ...e.defaultEventFeatures }, { set: (e, t, n) => (t === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = n), e[t] = n, !0) }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
	}
	/**
	* The default interaction mode for all display objects.
	* @see Container.eventMode
	* @type {EventMode}
	* @readonly
	* @since 7.2.0
	*/
	static get defaultEventMode() {
		return this._defaultEventMode;
	}
	/**
	* Runner init called, view is available at this point.
	* @ignore
	*/
	init(t) {
		let { canvas: n, resolution: r } = this.renderer;
		this.setTargetElement(n), this.resolution = r, e._defaultEventMode = t.eventMode ?? "passive", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
	}
	/**
	* Handle changing resolution.
	* @ignore
	*/
	resolutionChange(e) {
		this.resolution = e;
	}
	/** Destroys all event listeners and detaches the renderer. */
	destroy() {
		V.destroy(), this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
	}
	/**
	* Sets the current cursor mode, handling any callbacks or CSS style changes.
	* The cursor can be a CSS cursor string, a custom callback function, or a key from the cursorStyles dictionary.
	* @param mode - Cursor mode to set. Can be:
	* - A CSS cursor string (e.g., 'pointer', 'grab')
	* - A key from the cursorStyles dictionary
	* - null/undefined to reset to default
	* @example
	* ```ts
	* // Using predefined cursor styles
	* app.renderer.events.setCursor('pointer');    // Set standard pointer cursor
	* app.renderer.events.setCursor('grab');       // Set grab cursor
	* app.renderer.events.setCursor(null);         // Reset to default
	*
	* // Using custom cursor styles
	* app.renderer.events.cursorStyles.custom = 'url("cursor.png"), auto';
	* app.renderer.events.setCursor('custom');     // Apply custom cursor
	*
	* // Using callback-based cursor
	* app.renderer.events.cursorStyles.dynamic = (mode) => {
	*     document.body.style.cursor = mode === 'hover' ? 'pointer' : 'default';
	* };
	* app.renderer.events.setCursor('dynamic');    // Trigger cursor callback
	* ```
	* @remarks
	* - Has no effect on OffscreenCanvas except for callback-based cursors
	* - Caches current cursor to avoid unnecessary DOM updates
	* - Supports CSS cursor values, style objects, and callback functions
	* @see {@link EventSystem.cursorStyles} For defining custom cursor styles
	* @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} MDN Cursor Reference
	*/
	setCursor(e) {
		e ||= "default";
		let t = !0;
		if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (t = !1), this._currentCursor === e) return;
		this._currentCursor = e;
		let n = this.cursorStyles[e];
		if (n) switch (typeof n) {
			case "string":
				t && (this.domElement.style.cursor = n);
				break;
			case "function":
				n(e);
				break;
			case "object": t && Object.assign(this.domElement.style, n);
		}
		else t && typeof e == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, e) && (this.domElement.style.cursor = e);
	}
	/**
	* The global pointer event instance containing the most recent pointer state.
	* This is useful for accessing pointer information without listening to events.
	* @example
	* ```ts
	* // Access current pointer position at any time
	* const eventSystem = app.renderer.events;
	* const pointer = eventSystem.pointer;
	*
	* // Get global coordinates
	* console.log('Position:', pointer.global.x, pointer.global.y);
	*
	* // Check button state
	* console.log('Buttons pressed:', pointer.buttons);
	*
	* // Get pointer type and pressure
	* console.log('Type:', pointer.pointerType);
	* console.log('Pressure:', pointer.pressure);
	* ```
	* @readonly
	* @since 7.2.0
	* @see {@link FederatedPointerEvent} For all available pointer properties
	*/
	get pointer() {
		return this._rootPointerEvent;
	}
	/**
	* Event handler for pointer down events on {@link EventSystem#domElement this.domElement}.
	* @param nativeEvent - The native mouse/pointer/touch event.
	*/
	_onPointerDown(e) {
		if (!this.features.click) return;
		this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
		let t = this._normalizeToPointerData(e);
		this.autoPreventDefault && t[0].isNormalized && (e.cancelable || !("cancelable" in e)) && e.preventDefault();
		for (let e = 0, n = t.length; e < n; e++) {
			let n = t[e], r = this._bootstrapEvent(this._rootPointerEvent, n);
			this.rootBoundary.mapEvent(r);
		}
		this.setCursor(this.rootBoundary.cursor);
	}
	/**
	* Event handler for pointer move events on on {@link EventSystem#domElement this.domElement}.
	* @param nativeEvent - The native mouse/pointer/touch events.
	*/
	_onPointerMove(e) {
		if (!this.features.move) return;
		this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, V.pointerMoved();
		let t = this._normalizeToPointerData(e);
		for (let e = 0, n = t.length; e < n; e++) {
			let n = this._bootstrapEvent(this._rootPointerEvent, t[e]);
			this.rootBoundary.mapEvent(n);
		}
		this.setCursor(this.rootBoundary.cursor);
	}
	/**
	* Event handler for pointer up events on {@link EventSystem#domElement this.domElement}.
	* @param nativeEvent - The native mouse/pointer/touch event.
	*/
	_onPointerUp(e) {
		if (!this.features.click) return;
		this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
		let t = e.target;
		e.composedPath && e.composedPath().length > 0 && (t = e.composedPath()[0]);
		let n = t === this.domElement ? "" : "outside", r = this._normalizeToPointerData(e);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = this._bootstrapEvent(this._rootPointerEvent, r[e]);
			t.type += n, this.rootBoundary.mapEvent(t);
		}
		this.setCursor(this.rootBoundary.cursor);
	}
	/**
	* Event handler for pointer over & out events on {@link EventSystem#domElement this.domElement}.
	* @param nativeEvent - The native mouse/pointer/touch event.
	*/
	_onPointerOverOut(e) {
		if (!this.features.click) return;
		this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
		let t = this._normalizeToPointerData(e);
		for (let e = 0, n = t.length; e < n; e++) {
			let n = this._bootstrapEvent(this._rootPointerEvent, t[e]);
			this.rootBoundary.mapEvent(n);
		}
		this.setCursor(this.rootBoundary.cursor);
	}
	/**
	* Passive handler for `wheel` events on {@link EventSystem.domElement this.domElement}.
	* @param nativeEvent - The native wheel event.
	*/
	onWheel(e) {
		if (!this.features.wheel) return;
		let t = this.normalizeWheelEvent(e);
		this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(t);
	}
	/**
	* Sets the {@link EventSystem#domElement domElement} and binds event listeners.
	* This method manages the DOM event bindings for the event system, allowing you to
	* change or remove the target element that receives input events.
	* > [!IMPORTANT] This will default to the canvas element of the renderer, so you
	* > should not need to call this unless you are using a custom element.
	* @param element - The new DOM element to bind events to, or null to remove all event bindings
	* @example
	* ```ts
	* // Set a new canvas element as the target
	* const canvas = document.createElement('canvas');
	* app.renderer.events.setTargetElement(canvas);
	*
	* // Remove all event bindings
	* app.renderer.events.setTargetElement(null);
	*
	* // Switch to a different canvas
	* const newCanvas = document.querySelector('#game-canvas');
	* app.renderer.events.setTargetElement(newCanvas);
	* ```
	* @remarks
	* - Automatically removes event listeners from previous element
	* - Required for the event system to function
	* - Safe to call multiple times
	* @see {@link EventSystem#domElement} The current DOM element
	* @see {@link EventsTicker} For the ticker system that tracks pointer movement
	*/
	setTargetElement(e) {
		this._removeEvents(), this.domElement = e, V.domElement = e, this._addEvents();
	}
	/** Register event listeners on {@link Renderer#domElement this.domElement}. */
	_addEvents() {
		if (this._eventsAdded || !this.domElement) return;
		V.addTickerListener();
		let e = this.domElement.style;
		e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "none", e.msTouchAction = "none") : this.supportsPointerEvents && (e.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
			passive: !0,
			capture: !0
		}), this._eventsAdded = !0;
	}
	/** Unregister event listeners on {@link EventSystem#domElement this.domElement}. */
	_removeEvents() {
		if (!this._eventsAdded || !this.domElement) return;
		V.removeTickerListener();
		let e = this.domElement.style;
		e && (globalThis.navigator.msPointerEnabled ? (e.msContentZooming = "", e.msTouchAction = "") : this.supportsPointerEvents && (e.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this._eventsAdded = !1;
	}
	/**
	* Maps coordinates from DOM/screen space into PixiJS normalized coordinates.
	* This takes into account the current scale, position, and resolution of the DOM element.
	* @param point - The point to store the mapped coordinates in
	* @param x - The x coordinate in DOM/client space
	* @param y - The y coordinate in DOM/client space
	* @example
	* ```ts
	* // Map mouse coordinates to PixiJS space
	* const point = new Point();
	* app.renderer.events.mapPositionToPoint(
	*     point,
	*     event.clientX,
	*     event.clientY
	* );
	* console.log('Mapped position:', point.x, point.y);
	*
	* // Using with pointer events
	* sprite.on('pointermove', (event) => {
	*     // event.global already contains mapped coordinates
	*     console.log('Global:', event.global.x, event.global.y);
	*
	*     // Map to local coordinates
	*     const local = event.getLocalPosition(sprite);
	*     console.log('Local:', local.x, local.y);
	* });
	* ```
	* @remarks
	* - Accounts for element scaling and positioning
	* - Adjusts for device pixel ratio/resolution
	*/
	mapPositionToPoint(e, t, n) {
		let r = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
			x: 0,
			y: 0,
			width: this.domElement.width,
			height: this.domElement.height,
			left: 0,
			top: 0
		}, i = 1 / this.resolution;
		e.x = (t - r.left) * (this.domElement.width / r.width) * i, e.y = (n - r.top) * (this.domElement.height / r.height) * i;
	}
	/**
	* Ensures that the original event object contains all data that a regular pointer event would have
	* @param event - The original event data from a touch or mouse event
	* @returns An array containing a single normalized pointer event, in the case of a pointer
	*  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
	*/
	_normalizeToPointerData(e) {
		let t = [];
		if (this.supportsTouchEvents && e instanceof TouchEvent) for (let n = 0, r = e.changedTouches.length; n < r; n++) {
			let r = e.changedTouches[n];
			r.button === void 0 && (r.button = 0), r.buttons === void 0 && (r.buttons = 1), r.isPrimary === void 0 && (r.isPrimary = e.touches.length === 1 && e.type === "touchstart"), r.width === void 0 && (r.width = r.radiusX || 1), r.height === void 0 && (r.height = r.radiusY || 1), r.tiltX === void 0 && (r.tiltX = 0), r.tiltY === void 0 && (r.tiltY = 0), r.pointerType === void 0 && (r.pointerType = "touch"), r.pointerId === void 0 && (r.pointerId = r.identifier || 0), r.pressure === void 0 && (r.pressure = r.force || .5), r.twist === void 0 && (r.twist = 0), r.tangentialPressure === void 0 && (r.tangentialPressure = 0), r.layerX === void 0 && (r.layerX = r.offsetX = r.clientX), r.layerY === void 0 && (r.layerY = r.offsetY = r.clientY), r.isNormalized = !0, r.type = e.type, r.altKey ??= e.altKey, r.ctrlKey ??= e.ctrlKey, r.metaKey ??= e.metaKey, r.shiftKey ??= e.shiftKey, t.push(r);
		}
		else if (!globalThis.MouseEvent || e instanceof MouseEvent && (!this.supportsPointerEvents || !(e instanceof globalThis.PointerEvent))) {
			let n = e;
			n.isPrimary === void 0 && (n.isPrimary = !0), n.width === void 0 && (n.width = 1), n.height === void 0 && (n.height = 1), n.tiltX === void 0 && (n.tiltX = 0), n.tiltY === void 0 && (n.tiltY = 0), n.pointerType === void 0 && (n.pointerType = "mouse"), n.pointerId === void 0 && (n.pointerId = Y), n.pressure === void 0 && (n.pressure = .5), n.twist === void 0 && (n.twist = 0), n.tangentialPressure === void 0 && (n.tangentialPressure = 0), n.isNormalized = !0, t.push(n);
		} else t.push(e);
		return t;
	}
	/**
	* Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
	*
	* The returned {@link FederatedWheelEvent} is a shared instance. It will not persist across
	* multiple native wheel events.
	* @param nativeEvent - The native wheel event that occurred on the canvas.
	* @returns A federated wheel event.
	*/
	normalizeWheelEvent(e) {
		let t = this._rootWheelEvent;
		return this._transferMouseData(t, e), t.deltaX = e.deltaX, t.deltaY = e.deltaY, t.deltaZ = e.deltaZ, t.deltaMode = e.deltaMode, this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.nativeEvent = e, t.type = e.type, t;
	}
	/**
	* Normalizes the `nativeEvent` into a federateed {@link FederatedPointerEvent}.
	* @param event
	* @param nativeEvent
	*/
	_bootstrapEvent(e, t) {
		return e.originalEvent = null, e.nativeEvent = t, e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist, this._transferMouseData(e, t), this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.isTrusted = t.isTrusted, e.type === "pointerleave" && (e.type = "pointerout"), e.type.startsWith("mouse") && (e.type = e.type.replace("mouse", "pointer")), e.type.startsWith("touch") && (e.type = X[e.type] || e.type), e;
	}
	/**
	* Transfers base & mouse event data from the `nativeEvent` to the federated event.
	* @param event
	* @param nativeEvent
	*/
	_transferMouseData(e, t) {
		e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.x = t.clientX, e.client.y = t.clientY, e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.x = t.movementX, e.movement.y = t.movementY, e.page.x = t.pageX, e.page.y = t.pageY, e.relatedTarget = null, e.shiftKey = t.shiftKey;
	}
};
/**
* The event features that are enabled by the EventSystem
* @since 7.2.0
* @example
* ```ts
* import { EventSystem, EventSystemFeatures } from 'pixi.js';
* // Access the default event features
* EventSystem.defaultEventFeatures = {
*     // Enable pointer movement events
*     move: true,
*     // Enable global pointer move events
*     globalMove: true,
*     // Enable click events
*     click: true,
*     // Enable wheel events
*     wheel: true,
* };
* ```
*/
Z.extension = {
	name: "events",
	type: [
		t.WebGLSystem,
		t.CanvasSystem,
		t.WebGPUSystem
	],
	priority: -1
}, Z.defaultEventFeatures = {
	/** Enables pointer events associated with pointer movement. */
	move: !0,
	/** Enables global pointer move events. */
	globalMove: !0,
	/** Enables pointer events associated with clicking. */
	click: !0,
	/** Enables wheel events. */
	wheel: !0
};
var Q = Z, $ = {
	onclick: null,
	onmousedown: null,
	onmouseenter: null,
	onmouseleave: null,
	onmousemove: null,
	onglobalmousemove: null,
	onmouseout: null,
	onmouseover: null,
	onmouseup: null,
	onmouseupoutside: null,
	onpointercancel: null,
	onpointerdown: null,
	onpointerenter: null,
	onpointerleave: null,
	onpointermove: null,
	onglobalpointermove: null,
	onpointerout: null,
	onpointerover: null,
	onpointertap: null,
	onpointerup: null,
	onpointerupoutside: null,
	onrightclick: null,
	onrightdown: null,
	onrightup: null,
	onrightupoutside: null,
	ontap: null,
	ontouchcancel: null,
	ontouchend: null,
	ontouchendoutside: null,
	ontouchmove: null,
	onglobaltouchmove: null,
	ontouchstart: null,
	onwheel: null,
	get interactive() {
		return this.eventMode === "dynamic" || this.eventMode === "static";
	},
	set interactive(e) {
		this.eventMode = e ? "static" : "passive";
	},
	_internalEventMode: void 0,
	get eventMode() {
		return this._internalEventMode ?? Q.defaultEventMode;
	},
	set eventMode(e) {
		this._internalEventMode = e;
	},
	isInteractive() {
		return this.eventMode === "static" || this.eventMode === "dynamic";
	},
	interactiveChildren: !0,
	hitArea: null,
	addEventListener(e, t, n) {
		let r = typeof n == "boolean" && n || typeof n == "object" && n.capture, i = typeof n == "object" ? n.signal : void 0, a = typeof n == "object" && n.once === !0, o = typeof t == "function" ? void 0 : t;
		e = r ? `${e}capture` : e;
		let s = typeof t == "function" ? t : t.handleEvent, c = this;
		i && i.addEventListener("abort", () => {
			c.off(e, s, o);
		}), a ? c.once(e, s, o) : c.on(e, s, o);
	},
	removeEventListener(e, t, n) {
		let r = typeof n == "boolean" && n || typeof n == "object" && n.capture, i = typeof t == "function" ? void 0 : t;
		e = r ? `${e}capture` : e, t = typeof t == "function" ? t : t.handleEvent, this.off(e, t, i);
	},
	dispatchEvent(e) {
		if (!(e instanceof c)) throw Error("Container cannot propagate events outside of the Federated Events API");
		return e.defaultPrevented = !1, e.path = null, e.target = this, e.manager.dispatchEvent(e), !e.defaultPrevented;
	}
};
//#endregion
export { U as a, B as c, D as d, c as f, W as i, z as l, Q as n, H as o, s as p, J as r, V as s, $ as t, R as u };
