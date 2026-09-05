import { t as e } from "./adapter-DdgmR4Id.js";
//#region node_modules/pixi.js/lib/utils/path.mjs
function t(e) {
	if (typeof e != "string") throw TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function n(e) {
	return e.split("?")[0].split("#")[0];
}
function r(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function i(e, t, n) {
	return e.replace(new RegExp(r(t), "g"), n);
}
function a(e, t) {
	let n = "", r = 0, i = -1, a = 0, o = -1;
	for (let s = 0; s <= e.length; ++s) {
		if (s < e.length) o = e.charCodeAt(s);
		else if (o === 47) break;
		else o = 47;
		if (o === 47) {
			if (i !== s - 1 && a !== 1) {
				if (i !== s - 1 && a === 2) {
					if (n.length < 2 || r !== 2 || n.charCodeAt(n.length - 1) !== 46 || n.charCodeAt(n.length - 2) !== 46) {
						if (n.length > 2) {
							let e = n.lastIndexOf("/");
							if (e !== n.length - 1) {
								e === -1 ? (n = "", r = 0) : (n = n.slice(0, e), r = n.length - 1 - n.lastIndexOf("/")), i = s, a = 0;
								continue;
							}
						} else if (n.length === 2 || n.length === 1) {
							n = "", r = 0, i = s, a = 0;
							continue;
						}
					}
					t && (n.length > 0 ? n += "/.." : n = "..", r = 2);
				} else n.length > 0 ? n += `/${e.slice(i + 1, s)}` : n = e.slice(i + 1, s), r = s - i - 1;
			}
			i = s, a = 0;
		} else o === 46 && a !== -1 ? ++a : a = -1;
	}
	return n;
}
var o = {
	/**
	* Converts a path to posix format.
	* @param path - The path to convert to posix
	* @example
	* ```ts
	* // Convert a Windows path to POSIX format
	* path.toPosix('C:\\Users\\User\\Documents\\file.txt');
	* // -> 'C:/Users/User/Documents/file.txt'
	* ```
	*/
	toPosix(e) {
		return i(e, "\\", "/");
	},
	/**
	* Checks if the path is a URL e.g. http://, https://
	* @param path - The path to check
	* @example
	* ```ts
	* // Check if a path is a URL
	* path.isUrl('http://www.example.com');
	* // -> true
	* path.isUrl('C:/Users/User/Documents/file.txt');
	* // -> false
	* ```
	*/
	isUrl(e) {
		return /^https?:/.test(this.toPosix(e));
	},
	/**
	* Checks if the path is a data URL
	* @param path - The path to check
	* @example
	* ```ts
	* // Check if a path is a data URL
	* path.isDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
	* // -> true
	* ```
	*/
	isDataUrl(e) {
		return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(e);
	},
	/**
	* Checks if the path is a blob URL
	* @param path - The path to check
	* @example
	* ```ts
	* // Check if a path is a blob URL
	* path.isBlobUrl('blob:http://www.example.com/12345678-1234-1234-1234-123456789012');
	* // -> true
	* ```
	*/
	isBlobUrl(e) {
		return e.startsWith("blob:");
	},
	/**
	* Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
	* This will return true for windows file paths
	* @param path - The path to check
	* @example
	* ```ts
	* // Check if a path has a protocol
	* path.hasProtocol('http://www.example.com');
	* // -> true
	* path.hasProtocol('C:/Users/User/Documents/file.txt');
	* // -> true
	* ```
	*/
	hasProtocol(e) {
		return /^[^/:]+:/.test(this.toPosix(e));
	},
	/**
	* Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
	* @param path - The path to get the protocol from
	* @example
	* ```ts
	* // Get the protocol from a URL
	* path.getProtocol('http://www.example.com/path/to/resource');
	* // -> 'http://'
	* // Get the protocol from a file path
	* path.getProtocol('C:/Users/User/Documents/file.txt');
	* // -> 'C:/'
	* ```
	*/
	getProtocol(e) {
		t(e), e = this.toPosix(e);
		let n = /^file:\/\/\//.exec(e);
		if (n) return n[0];
		let r = /^[^/:]+:\/{0,2}/.exec(e);
		return r ? r[0] : "";
	},
	/**
	* Converts URL to an absolute path.
	* When loading from a Web Worker, we must use absolute paths.
	* If the URL is already absolute we return it as is
	* If it's not, we convert it
	* @param url - The URL to test
	* @param customBaseUrl - The base URL to use
	* @param customRootUrl - The root URL to use
	* @example
	* ```ts
	* // Convert a relative URL to an absolute path
	* path.toAbsolute('images/texture.png', 'http://example.com/assets/');
	* // -> 'http://example.com/assets/images/texture.png'
	* ```
	*/
	toAbsolute(r, i, a) {
		if (t(r), this.isDataUrl(r) || this.isBlobUrl(r)) return r;
		let s = n(this.toPosix(i ?? e.get().getBaseUrl())), c = n(this.toPosix(a ?? this.rootname(s)));
		return r = this.toPosix(r), r.startsWith("/") ? o.join(c, r.slice(1)) : this.isAbsolute(r) ? r : this.join(s, r);
	},
	/**
	* Normalizes the given path, resolving '..' and '.' segments
	* @param path - The path to normalize
	* @example
	* ```ts
	* // Normalize a path with relative segments
	* path.normalize('http://www.example.com/foo/bar/../baz');
	* // -> 'http://www.example.com/foo/baz'
	* // Normalize a file path with relative segments
	* path.normalize('C:\\Users\\User\\Documents\\..\\file.txt');
	* // -> 'C:/Users/User/file.txt'
	* ```
	*/
	normalize(e) {
		if (t(e), e.length === 0) return ".";
		if (this.isDataUrl(e) || this.isBlobUrl(e)) return e;
		e = this.toPosix(e);
		let n = "", r = e.startsWith("/");
		this.hasProtocol(e) && (n = this.rootname(e), e = e.slice(n.length));
		let i = e.endsWith("/");
		return e = a(e, !1), e.length > 0 && i && (e += "/"), r ? `/${e}` : n + e;
	},
	/**
	* Determines if path is an absolute path.
	* Absolute paths can be urls, data urls, or paths on disk
	* @param path - The path to test
	* @example
	* ```ts
	* // Check if a path is absolute
	* path.isAbsolute('http://www.example.com/foo/bar');
	* // -> true
	* path.isAbsolute('C:/Users/User/Documents/file.txt');
	* // -> true
	* ```
	*/
	isAbsolute(e) {
		return t(e), e = this.toPosix(e), this.hasProtocol(e) ? !0 : e.startsWith("/");
	},
	/**
	* Joins all given path segments together using the platform-specific separator as a delimiter,
	* then normalizes the resulting path
	* @param segments - The segments of the path to join
	* @example
	* ```ts
	* // Join multiple path segments
	* path.join('assets', 'images', 'sprite.png');
	* // -> 'assets/images/sprite.png'
	* // Join with relative segments
	* path.join('assets', 'images', '../textures', 'sprite.png');
	* // -> 'assets/textures/sprite.png'
	* ```
	*/
	join(...e) {
		if (e.length === 0) return ".";
		let n;
		for (let r = 0; r < e.length; ++r) {
			let i = e[r];
			if (t(i), i.length > 0) {
				if (n === void 0) n = i;
				else {
					let t = e[r - 1] ?? "";
					this.joinExtensions.includes(this.extname(t).toLowerCase()) ? n += `/../${i}` : n += `/${i}`;
				}
			}
		}
		return n === void 0 ? "." : this.normalize(n);
	},
	/**
	* Returns the directory name of a path
	* @param path - The path to parse
	* @example
	* ```ts
	* // Get the directory name of a path
	* path.dirname('http://www.example.com/foo/bar/baz.png');
	* // -> 'http://www.example.com/foo/bar'
	* // Get the directory name of a file path
	* path.dirname('C:/Users/User/Documents/file.txt');
	* // -> 'C:/Users/User/Documents'
	* ```
	*/
	dirname(e) {
		if (t(e), e.length === 0) return ".";
		e = this.toPosix(e);
		let n = e.charCodeAt(0), r = n === 47, i = -1, a = !0, o = this.getProtocol(e), s = e;
		e = e.slice(o.length);
		for (let t = e.length - 1; t >= 1; --t) if (n = e.charCodeAt(t), n === 47) {
			if (!a) {
				i = t;
				break;
			}
		} else a = !1;
		return i === -1 ? r ? "/" : this.isUrl(s) ? o + e : o : r && i === 1 ? "//" : o + e.slice(0, i);
	},
	/**
	* Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
	* @param path - The path to parse
	* @example
	* ```ts
	* // Get the root of a URL
	* path.rootname('http://www.example.com/foo/bar/baz.png');
	* // -> 'http://www.example.com/'
	* // Get the root of a file path
	* path.rootname('C:/Users/User/Documents/file.txt');
	* // -> 'C:/'
	* ```
	*/
	rootname(e) {
		t(e), e = this.toPosix(e);
		let n = "";
		if (n = e.startsWith("/") ? "/" : this.getProtocol(e), this.isUrl(e)) {
			let t = e.indexOf("/", n.length);
			n = t === -1 ? e : e.slice(0, t), n.endsWith("/") || (n += "/");
		}
		return n;
	},
	/**
	* Returns the last portion of a path
	* @param path - The path to test
	* @param ext - Optional extension to remove
	* @example
	* ```ts
	* // Get the basename of a URL
	* path.basename('http://www.example.com/foo/bar/baz.png');
	* // -> 'baz.png'
	* // Get the basename of a file path
	* path.basename('C:/Users/User/Documents/file.txt');
	* // -> 'file.txt'
	* ```
	*/
	basename(e, r) {
		t(e), r && t(r), e = n(this.toPosix(e));
		let i = 0, a = -1, o = !0, s;
		if (r !== void 0 && r.length > 0 && r.length <= e.length) {
			if (r.length === e.length && r === e) return "";
			let t = r.length - 1, n = -1;
			for (s = e.length - 1; s >= 0; --s) {
				let c = e.charCodeAt(s);
				if (c === 47) {
					if (!o) {
						i = s + 1;
						break;
					}
				} else n === -1 && (o = !1, n = s + 1), t >= 0 && (c === r.charCodeAt(t) ? --t === -1 && (a = s) : (t = -1, a = n));
			}
			return i === a ? a = n : a === -1 && (a = e.length), e.slice(i, a);
		}
		for (s = e.length - 1; s >= 0; --s) if (e.charCodeAt(s) === 47) {
			if (!o) {
				i = s + 1;
				break;
			}
		} else a === -1 && (o = !1, a = s + 1);
		return a === -1 ? "" : e.slice(i, a);
	},
	/**
	* Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
	* portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
	* the first character of the basename of path, an empty string is returned.
	* @param path - The path to parse
	* @example
	* ```ts
	* // Get the extension of a URL
	* path.extname('http://www.example.com/foo/bar/baz.png');
	* // -> '.png'
	* // Get the extension of a file path
	* path.extname('C:/Users/User/Documents/file.txt');
	* // -> '.txt'
	* ```
	*/
	extname(e) {
		t(e), e = n(this.toPosix(e));
		let r = -1, i = 0, a = -1, o = !0, s = 0;
		for (let t = e.length - 1; t >= 0; --t) {
			let n = e.charCodeAt(t);
			if (n === 47) {
				if (!o) {
					i = t + 1;
					break;
				}
				continue;
			}
			a === -1 && (o = !1, a = t + 1), n === 46 ? r === -1 ? r = t : s !== 1 && (s = 1) : r !== -1 && (s = -1);
		}
		return r === -1 || a === -1 || s === 0 || s === 1 && r === a - 1 && r === i + 1 ? "" : e.slice(r, a);
	},
	/**
	* Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
	* @param path - The path to parse
	* @example
	* ```ts
	* // Parse a URL
	* const parsed = path.parse('http://www.example.com/foo/bar/baz.png');
	* // -> {
	* //   root: 'http://www.example.com/',
	* //   dir: 'http://www.example.com/foo/bar',
	* //   base: 'baz.png',
	* //   ext: '.png',
	* //   name: 'baz'
	* // }
	* // Parse a file path
	* const parsedFile = path.parse('C:/Users/User/Documents/file.txt');
	* // -> {
	* //   root: 'C:/',
	* //   dir: 'C:/Users/User/Documents',
	* //   base: 'file.txt',
	* //   ext: '.txt',
	* //   name: 'file'
	* // }
	* ```
	*/
	parse(e) {
		t(e);
		let r = {
			root: "",
			dir: "",
			base: "",
			ext: "",
			name: ""
		};
		if (e.length === 0) return r;
		e = n(this.toPosix(e));
		let i = e.charCodeAt(0), a = this.isAbsolute(e), o;
		r.root = this.rootname(e), o = a || this.hasProtocol(e) ? 1 : 0;
		let s = -1, c = 0, l = -1, u = !0, d = e.length - 1, f = 0;
		for (; d >= o; --d) {
			if (i = e.charCodeAt(d), i === 47) {
				if (!u) {
					c = d + 1;
					break;
				}
				continue;
			}
			l === -1 && (u = !1, l = d + 1), i === 46 ? s === -1 ? s = d : f !== 1 && (f = 1) : s !== -1 && (f = -1);
		}
		return s === -1 || l === -1 || f === 0 || f === 1 && s === l - 1 && s === c + 1 ? l !== -1 && (r.base = r.name = c === 0 && a ? e.slice(1, l) : e.slice(c, l)) : (c === 0 && a ? (r.name = e.slice(1, s), r.base = e.slice(1, l)) : (r.name = e.slice(c, s), r.base = e.slice(c, l)), r.ext = e.slice(s, l)), r.dir = this.dirname(e), r;
	},
	sep: "/",
	delimiter: ":",
	joinExtensions: [".html"]
};
//#endregion
export { o as t };
