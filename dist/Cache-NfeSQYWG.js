import { l as e } from "./adapter-DdgmR4Id.js";
//#region node_modules/pixi.js/lib/assets/utils/convertToList.mjs
var t = (e, t, n = !1) => (Array.isArray(e) || (e = [e]), t ? e.map((e) => typeof e == "string" || n ? t(e) : e) : e), n = new class {
	constructor() {
		this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
	}
	/** Clear all entries. */
	reset() {
		this._cacheMap.clear(), this._cache.clear();
	}
	/**
	* Check if the key exists
	* @param key - The key to check
	*/
	has(e) {
		return this._cache.has(e);
	}
	/**
	* Fetch entry by key
	* @param key - The key of the entry to get
	*/
	get(t) {
		let n = this._cache.get(t);
		return n || e(`[Assets] Asset id ${t} was not found in the Cache`), n;
	}
	/**
	* Set a value by key or keys name
	* @param key - The key or keys to set
	* @param value - The value to store in the cache or from which cacheable assets will be derived.
	*/
	set(n, r) {
		let i = t(n), a;
		for (let e = 0; e < this.parsers.length; e++) {
			let t = this.parsers[e];
			if (t.test(r)) {
				a = t.getCacheableAssets(i, r);
				break;
			}
		}
		let o = new Map(Object.entries(a || {}));
		a || i.forEach((e) => {
			o.set(e, r);
		});
		let s = [...o.keys()], c = {
			cacheKeys: s,
			keys: i
		};
		i.forEach((e) => {
			this._cacheMap.set(e, c);
		}), s.forEach((t) => {
			let n = a ? a[t] : r;
			this._cache.has(t) && this._cache.get(t) !== n && e("[Cache] already has key:", t), this._cache.set(t, o.get(t));
		});
	}
	/**
	* Remove entry by key
	*
	* This function will also remove any associated alias from the cache also.
	* @param key - The key of the entry to remove
	*/
	remove(t) {
		if (!this._cacheMap.has(t)) {
			e(`[Assets] Asset id ${t} was not found in the Cache`);
			return;
		}
		let n = this._cacheMap.get(t);
		n.cacheKeys.forEach((e) => {
			this._cache.delete(e);
		}), n.keys.forEach((e) => {
			this._cacheMap.delete(e);
		});
	}
	/**
	* All loader parsers registered
	* @advanced
	*/
	get parsers() {
		return this._parsers;
	}
}();
//#endregion
export { t as n, n as t };
