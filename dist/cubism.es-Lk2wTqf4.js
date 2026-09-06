import { A as e, F as t, P as n, d as r, f as i, k as a, t as o } from "./adapter-DdgmR4Id.js";
import { a as s, i as c, r as l } from "./lib-D_Ni3XdB.js";
import { L as u, i as d, s as f, t as p } from "./Ticker-CsadseLF.js";
import { t as m } from "./WebGLRenderer-BFqvqzP4.js";
//#region node_modules/untitled-pixi-live2d-engine/dist/cubism.es.js
var h = Object.defineProperty, g = Object.defineProperties, _ = Object.getOwnPropertyDescriptors, v = Object.getOwnPropertySymbols, ee = Object.prototype.hasOwnProperty, te = Object.prototype.propertyIsEnumerable, y = Math.pow, ne = (e, t, n) => t in e ? h(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, re = (e, t) => {
	for (var n in t ||= {}) ee.call(t, n) && ne(e, n, t[n]);
	if (v) for (var n of v(t)) te.call(t, n) && ne(e, n, t[n]);
	return e;
}, ie = (e, t) => g(e, _(t)), b = (e, t, n) => ne(e, typeof t == "symbol" ? t : t + "", n), x = (e, t, n) => new Promise((r, i) => {
	var a = (e) => {
		try {
			s(n.next(e));
		} catch (e) {
			i(e);
		}
	}, o = (e) => {
		try {
			s(n.throw(e));
		} catch (e) {
			i(e);
		}
	}, s = (e) => e.done ? r(e.value) : Promise.resolve(e.value).then(a, o);
	s((n = n.apply(e, t)).next());
}), ae = class e {
	/**
	* 引数付きコンストラクタ
	* @param iniitalCapacity 初期化後のキャパシティ。データサイズは_capacity * sizeof(T)
	* @param zeroClear trueなら初期化時に確保した領域を0で埋める
	*/
	constructor(e = 0) {
		e < 1 ? (this._ptr = [], this._capacity = 0, this._size = 0) : (this._ptr = Array(e), this._capacity = e, this._size = 0);
	}
	/**
	* インデックスで指定した要素を返す
	*/
	at(e) {
		return this._ptr[e];
	}
	/**
	* 要素をセット
	* @param index 要素をセットするインデックス
	* @param value セットする要素
	*/
	set(e, t) {
		this._ptr[e] = t;
	}
	/**
	* コンテナを取得する
	*/
	get(e = 0) {
		let t = [];
		for (let n = e; n < this._size; n++) t.push(this._ptr[n]);
		return t;
	}
	/**
	* pushBack処理、コンテナに新たな要素を追加する
	* @param value PushBack処理で追加する値
	*/
	pushBack(t) {
		this._size >= this._capacity && this.prepareCapacity(this._capacity == 0 ? e.DefaultSize : this._capacity * 2), this._ptr[this._size++] = t;
	}
	/**
	* コンテナの全要素を解放する
	*/
	clear() {
		this._ptr.length = 0, this._size = 0;
	}
	/**
	* コンテナの要素数を返す
	* @return コンテナの要素数
	*/
	getSize() {
		return this._size;
	}
	/**
	* コンテナの全要素に対して代入処理を行う
	* @param newSize 代入処理後のサイズ
	* @param value 要素に代入する値
	*/
	assign(e, t) {
		this._size < e && this.prepareCapacity(e);
		for (let n = 0; n < e; n++) this._ptr[n] = t;
		this._size = e;
	}
	/**
	* サイズ変更
	*/
	resize(e, t = null) {
		this.updateSize(e, t, !0);
	}
	/**
	* サイズ変更
	*/
	updateSize(e, t = null, n = !0) {
		if (this._size < e) {
			if (this.prepareCapacity(e), n) for (let n = this._size; n < e; n++) typeof t == "function" ? this._ptr[n] = JSON.parse(JSON.stringify(new t())) : this._ptr[n] = t;
			else for (let n = this._size; n < e; n++) this._ptr[n] = t;
		} else {
			let t = this._size - e;
			this._ptr.splice(this._size - t, t);
		}
		this._size = e;
	}
	/**
	* コンテナにコンテナ要素を挿入する
	* @param position 挿入する位置
	* @param begin 挿入するコンテナの開始位置
	* @param end 挿入するコンテナの終端位置
	*/
	insert(e, t, n) {
		let r = e._index, i = t._index, a = n._index, o = a - i;
		this.prepareCapacity(this._size + o);
		let s = this._size - r;
		if (s > 0) for (let e = 0; e < s; e++) this._ptr.splice(r + e, 0, null);
		for (let e = i; e < a; e++, r++) this._ptr[r] = t._vector._ptr[e];
		this._size += o;
	}
	/**
	* コンテナからインデックスで指定した要素を削除する
	* @param index インデックス値
	* @return true 削除実行
	* @return false 削除範囲外
	*/
	remove(e) {
		return e < 0 || this._size <= e ? !1 : (this._ptr.splice(e, 1), --this._size, !0);
	}
	/**
	* コンテナから要素を削除して他の要素をシフトする
	* @param ite 削除する要素
	*/
	erase(e) {
		let t = e._index;
		return t < 0 || this._size <= t ? e : (this._ptr.splice(t, 1), --this._size, new oe(this, t));
	}
	/**
	* コンテナのキャパシティを確保する
	* @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない.
	*/
	prepareCapacity(e) {
		e > this._capacity && (this._capacity == 0 ? (this._ptr = Array(e), this._capacity = e) : (this._ptr.length = e, this._capacity = e));
	}
	/**
	* コンテナの先頭要素を返す
	*/
	begin() {
		return this._size == 0 ? this.end() : new oe(this, 0);
	}
	/**
	* コンテナの終端要素を返す
	*/
	end() {
		return new oe(this, this._size);
	}
	getOffset(t) {
		let n = new e();
		return n._ptr = this.get(t), n._size = this.get(t).length, n._capacity = this.get(t).length, n;
	}
};
ae.DefaultSize = 10;
var S = ae, oe = class e {
	/**
	* コンストラクタ
	*/
	constructor(e, t) {
		this._vector = e ?? null, this._index = t ?? 0;
	}
	/**
	* 代入
	*/
	set(e) {
		return this._index = e._index, this._vector = e._vector, this;
	}
	/**
	* 前置き++演算
	*/
	preIncrement() {
		return ++this._index, this;
	}
	/**
	* 前置き--演算
	*/
	preDecrement() {
		return --this._index, this;
	}
	/**
	* 後置き++演算子
	*/
	increment() {
		return new e(this._vector, this._index++);
	}
	/**
	* 後置き--演算子
	*/
	decrement() {
		return new e(this._vector, this._index--);
	}
	/**
	* ptr
	*/
	ptr() {
		return this._vector._ptr[this._index];
	}
	/**
	* =演算子のオーバーロード
	*/
	substitution(e) {
		return this._index = e._index, this._vector = e._vector, this;
	}
	/**
	* !=演算子のオーバーロード
	*/
	notEqual(e) {
		return this._index != e._index || this._vector != e._vector;
	}
}, se;
((e) => {
	e.csmVector = S, e.iterator = oe;
})(se ||= {});
var C = class {
	/**
	* 文字列を後方に追加する
	*
	* @param c 追加する文字列
	* @return 更新された文字列
	*/
	append(e, t) {
		return this.s += t === void 0 ? e : e.substr(0, t), this;
	}
	/**
	* 文字サイズを拡張して文字を埋める
	* @param length    拡張する文字数
	* @param v         埋める文字
	* @return 更新された文字列
	*/
	expansion(e, t) {
		for (let n = 0; n < e; n++) this.append(t);
		return this;
	}
	/**
	* 文字列の長さをバイト数で取得する
	*/
	getBytes() {
		return encodeURIComponent(this.s).replace(/%../g, "x").length;
	}
	/**
	* 文字列の長さを返す
	*/
	getLength() {
		return this.s.length;
	}
	/**
	* 文字列比較 <
	* @param s 比較する文字列
	* @return true:    比較する文字列より小さい
	* @return false:   比較する文字列より大きい
	*/
	isLess(e) {
		return this.s < e.s;
	}
	/**
	* 文字列比較 >
	* @param s 比較する文字列
	* @return true:    比較する文字列より大きい
	* @return false:   比較する文字列より小さい
	*/
	isGreat(e) {
		return this.s > e.s;
	}
	/**
	* 文字列比較 ==
	* @param s 比較する文字列
	* @return true:    比較する文字列と等しい
	* @return false:   比較する文字列と異なる
	*/
	isEqual(e) {
		return this.s == e;
	}
	/**
	* 文字列が空かどうか
	* @return true: 空の文字列
	* @return false: 値が設定されている
	*/
	isEmpty() {
		return this.s.length == 0;
	}
	/**
	* 引数付きコンストラクタ
	*/
	constructor(e) {
		this.s = e;
	}
}, ce;
((e) => {
	e.csmString = C;
})(ce ||= {});
var le = class e {
	/**
	* 内部で使用するCubismIdクラス生成メソッド
	*
	* @param id ID文字列
	* @returns CubismId
	* @note 指定したID文字列からCubismIdを取得する際は
	*       CubismIdManager().getId(id)を使用してください
	*/
	static createIdInternal(t) {
		return new e(t);
	}
	/**
	* ID名を取得する
	*/
	getString() {
		return this._id;
	}
	/**
	* idを比較
	* @param c 比較するid
	* @return 同じならばtrue,異なっていればfalseを返す
	*/
	isEqual(t) {
		return typeof t == "string" ? this._id.isEqual(t) : t instanceof C ? this._id.isEqual(t.s) : t instanceof e && this._id.isEqual(t._id.s);
	}
	/**
	* idを比較
	* @param c 比較するid
	* @return 同じならばtrue,異なっていればfalseを返す
	*/
	isNotEqual(t) {
		return typeof t == "string" ? !this._id.isEqual(t) : t instanceof C ? !this._id.isEqual(t.s) : t instanceof e && !this._id.isEqual(t._id.s);
	}
	/**
	* プライベートコンストラクタ
	*
	* @note ユーザーによる生成は許可しません
	*/
	constructor(e) {
		if (typeof e == "string") {
			this._id = new C(e);
			return;
		}
		this._id = e;
	}
}, ue;
((e) => {
	e.CubismId = le;
})(ue ||= {});
var de = class {
	/**
	* コンストラクタ
	*/
	constructor() {
		this._ids = new S();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		for (let e = 0; e < this._ids.getSize(); ++e) this._ids.set(e, void 0);
		this._ids = null;
	}
	/**
	* ID名をリストから登録
	*
	* @param ids ID名リスト
	* @param count IDの個数
	*/
	registerIds(e) {
		for (let t = 0; t < e.length; t++) this.registerId(e[t]);
	}
	/**
	* ID名を登録
	*
	* @param id ID名
	*/
	registerId(e) {
		let t = null;
		if (typeof e == "string") {
			if ((t = this.findId(e)) != null) return t;
			t = le.createIdInternal(e), this._ids.pushBack(t);
		} else return this.registerId(e.s);
		return t;
	}
	/**
	* ID名からIDを取得する
	*
	* @param id ID名
	*/
	getId(e) {
		return this.registerId(e);
	}
	/**
	* ID名からIDの確認
	*
	* @return true 存在する
	* @return false 存在しない
	*/
	isExist(e) {
		return typeof e == "string" ? this.findId(e) != null : this.isExist(e.s);
	}
	/**
	* ID名からIDを検索する。
	*
	* @param id ID名
	* @return 登録されているID。なければNULL。
	*/
	findId(e) {
		for (let t = 0; t < this._ids.getSize(); ++t) if (this._ids.at(t).getString().isEqual(e)) return this._ids.at(t);
		return null;
	}
}, fe;
((e) => {
	e.CubismIdManager = de;
})(fe ||= {});
var pe = class e {
	/**
	* コンストラクタ
	*/
	constructor() {
		this._tr = /* @__PURE__ */ new Float32Array(16), this.loadIdentity();
	}
	/**
	* 受け取った２つの行列の乗算を行う。
	*
	* @param a 行列a
	* @param b 行列b
	* @return 乗算結果の行列
	*/
	static multiply(e, t, n) {
		let r = new Float32Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		]);
		for (let n = 0; n < 4; ++n) for (let i = 0; i < 4; ++i) for (let a = 0; a < 4; ++a) r[i + n * 4] += e[a + n * 4] * t[i + a * 4];
		for (let e = 0; e < 16; ++e) n[e] = r[e];
	}
	/**
	* 単位行列に初期化する
	*/
	loadIdentity() {
		let e = new Float32Array([
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
		this.setMatrix(e);
	}
	/**
	* 行列を設定
	*
	* @param tr 16個の浮動小数点数で表される4x4の行列
	*/
	setMatrix(e) {
		for (let t = 0; t < 16; ++t) this._tr[t] = e[t];
	}
	/**
	* 行列を浮動小数点数の配列で取得
	*
	* @return 16個の浮動小数点数で表される4x4の行列
	*/
	getArray() {
		return this._tr;
	}
	/**
	* X軸の拡大率を取得
	* @return X軸の拡大率
	*/
	getScaleX() {
		return this._tr[0];
	}
	/**
	* Y軸の拡大率を取得する
	*
	* @return Y軸の拡大率
	*/
	getScaleY() {
		return this._tr[5];
	}
	/**
	* X軸の移動量を取得
	* @return X軸の移動量
	*/
	getTranslateX() {
		return this._tr[12];
	}
	/**
	* Y軸の移動量を取得
	* @return Y軸の移動量
	*/
	getTranslateY() {
		return this._tr[13];
	}
	/**
	* X軸の値を現在の行列で計算
	*
	* @param src X軸の値
	* @return 現在の行列で計算されたX軸の値
	*/
	transformX(e) {
		return this._tr[0] * e + this._tr[12];
	}
	/**
	* Y軸の値を現在の行列で計算
	*
	* @param src Y軸の値
	* @return 現在の行列で計算されたY軸の値
	*/
	transformY(e) {
		return this._tr[5] * e + this._tr[13];
	}
	/**
	* X軸の値を現在の行列で逆計算
	*/
	invertTransformX(e) {
		return (e - this._tr[12]) / this._tr[0];
	}
	/**
	* Y軸の値を現在の行列で逆計算
	*/
	invertTransformY(e) {
		return (e - this._tr[13]) / this._tr[5];
	}
	/**
	* 現在の行列の位置を起点にして移動
	*
	* 現在の行列の位置を起点にして相対的に移動する。
	*
	* @param x X軸の移動量
	* @param y Y軸の移動量
	*/
	translateRelative(t, n) {
		let r = new Float32Array([
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
			t,
			n,
			0,
			1
		]);
		e.multiply(r, this._tr, this._tr);
	}
	/**
	* 現在の行列の位置を移動
	*
	* 現在の行列の位置を指定した位置へ移動する
	*
	* @param x X軸の移動量
	* @param y y軸の移動量
	*/
	translate(e, t) {
		this._tr[12] = e, this._tr[13] = t;
	}
	/**
	* 現在の行列のX軸の位置を指定した位置へ移動する
	*
	* @param x X軸の移動量
	*/
	translateX(e) {
		this._tr[12] = e;
	}
	/**
	* 現在の行列のY軸の位置を指定した位置へ移動する
	*
	* @param y Y軸の移動量
	*/
	translateY(e) {
		this._tr[13] = e;
	}
	/**
	* 現在の行列の拡大率を相対的に設定する
	*
	* @param x X軸の拡大率
	* @param y Y軸の拡大率
	*/
	scaleRelative(t, n) {
		let r = new Float32Array([
			t,
			0,
			0,
			0,
			0,
			n,
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
		e.multiply(r, this._tr, this._tr);
	}
	/**
	* 現在の行列の拡大率を指定した倍率に設定する
	*
	* @param x X軸の拡大率
	* @param y Y軸の拡大率
	*/
	scale(e, t) {
		this._tr[0] = e, this._tr[5] = t;
	}
	/**
	* 引数で与えられた行列にこの行列を乗算する。
	* (引数で与えられた行列) * (この行列)
	*
	* @note 関数名と実際の計算内容に乖離があるため、今後計算順が修正される可能性があります。
	* @param m 行列
	*/
	multiplyByMatrix(t) {
		e.multiply(t.getArray(), this._tr, this._tr);
	}
	/**
	* オブジェクトのコピーを生成する
	*/
	clone() {
		let t = new e();
		for (let e = 0; e < this._tr.length; e++) t._tr[e] = this._tr[e];
		return t;
	}
}, me;
((e) => {
	e.CubismMatrix44 = pe;
})(me ||= {});
var he = class {
	/**
	* コンストラクタ
	* @param x 左端X座標
	* @param y 上端Y座標
	* @param w 幅
	* @param h 高さ
	*/
	constructor(e, t, n, r) {
		this.x = e, this.y = t, this.width = n, this.height = r;
	}
	/**
	* 矩形中央のX座標を取得する
	*/
	getCenterX() {
		return this.x + .5 * this.width;
	}
	/**
	* 矩形中央のY座標を取得する
	*/
	getCenterY() {
		return this.y + .5 * this.height;
	}
	/**
	* 右側のX座標を取得する
	*/
	getRight() {
		return this.x + this.width;
	}
	/**
	* 下端のY座標を取得する
	*/
	getBottom() {
		return this.y + this.height;
	}
	/**
	* 矩形に値をセットする
	* @param r 矩形のインスタンス
	*/
	setRect(e) {
		this.x = e.x, this.y = e.y, this.width = e.width, this.height = e.height;
	}
	/**
	* 矩形中央を軸にして縦横を拡縮する
	* @param w 幅方向に拡縮する量
	* @param h 高さ方向に拡縮する量
	*/
	expand(e, t) {
		this.x -= e, this.y -= t, this.width += e * 2, this.height += t * 2;
	}
}, ge;
((e) => {
	e.csmRect = he;
})(ge ||= {});
var _e = class {
	/**
	* レンダラのインスタンスを生成して取得する
	*
	* @return レンダラのインスタンス
	*/
	static create() {
		return null;
	}
	/**
	* レンダラのインスタンスを解放する
	*/
	static delete(e) {}
	/**
	* レンダラの初期化処理を実行する
	* 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
	* @param model モデルのインスタンス
	*/
	initialize(e) {
		this._model = e;
	}
	/**
	* モデルを描画する
	*/
	drawModel() {
		this.getModel() != null && (this.saveProfile(), this.doDrawModel(), this.restoreProfile());
	}
	/**
	* Model-View-Projection 行列をセットする
	* 配列は複製されるので、元の配列は外で破棄して良い
	* @param matrix44 Model-View-Projection 行列
	*/
	setMvpMatrix(e) {
		this._mvpMatrix4x4.setMatrix(e.getArray());
	}
	/**
	* Model-View-Projection 行列を取得する
	* @return Model-View-Projection 行列
	*/
	getMvpMatrix() {
		return this._mvpMatrix4x4;
	}
	/**
	* モデルの色をセットする
	* 各色0.0~1.0の間で指定する（1.0が標準の状態）
	* @param red 赤チャンネルの値
	* @param green 緑チャンネルの値
	* @param blue 青チャンネルの値
	* @param alpha αチャンネルの値
	*/
	setModelColor(e, t, n, r) {
		e < 0 ? e = 0 : e > 1 && (e = 1), t < 0 ? t = 0 : t > 1 && (t = 1), n < 0 ? n = 0 : n > 1 && (n = 1), r < 0 ? r = 0 : r > 1 && (r = 1), this._modelColor.r = e, this._modelColor.g = t, this._modelColor.b = n, this._modelColor.a = r;
	}
	/**
	* モデルの色を取得する
	* 各色0.0~1.0の間で指定する(1.0が標準の状態)
	*
	* @return RGBAのカラー情報
	*/
	getModelColor() {
		return JSON.parse(JSON.stringify(this._modelColor));
	}
	/**
	* 透明度を考慮したモデルの色を計算する。
	*
	* @param opacity 透明度
	*
	* @return RGBAのカラー情報
	*/
	getModelColorWithOpacity(e) {
		let t = this.getModelColor();
		return t.a *= e, this.isPremultipliedAlpha() && (t.r *= t.a, t.g *= t.a, t.b *= t.a), t;
	}
	/**
	* 乗算済みαの有効・無効をセットする
	* 有効にするならtrue、無効にするならfalseをセットする
	*/
	setIsPremultipliedAlpha(e) {
		this._isPremultipliedAlpha = e;
	}
	/**
	* 乗算済みαの有効・無効を取得する
	* @return true 乗算済みのα有効
	* @return false 乗算済みのα無効
	*/
	isPremultipliedAlpha() {
		return this._isPremultipliedAlpha;
	}
	/**
	* カリング（片面描画）の有効・無効をセットする。
	* 有効にするならtrue、無効にするならfalseをセットする
	*/
	setIsCulling(e) {
		this._isCulling = e;
	}
	/**
	* カリング（片面描画）の有効・無効を取得する。
	* @return true カリング有効
	* @return false カリング無効
	*/
	isCulling() {
		return this._isCulling;
	}
	/**
	* テクスチャの異方性フィルタリングのパラメータをセットする
	* パラメータ値の影響度はレンダラの実装に依存する
	* @param n パラメータの値
	*/
	setAnisotropy(e) {
		this._anisotropy = e;
	}
	/**
	* テクスチャの異方性フィルタリングのパラメータをセットする
	* @return 異方性フィルタリングのパラメータ
	*/
	getAnisotropy() {
		return this._anisotropy;
	}
	/**
	* レンダリングするモデルを取得する
	* @return レンダリングするモデル
	*/
	getModel() {
		return this._model;
	}
	/**
	* マスク描画の方式を変更する。
	* falseの場合、マスクを1枚のテクスチャに分割してレンダリングする（デフォルト）
	* 高速だが、マスク個数の上限が36に限定され、質も荒くなる
	* trueの場合、パーツ描画の前にその都度必要なマスクを描き直す
	* レンダリング品質は高いが描画処理負荷は増す
	* @param high 高精細マスクに切り替えるか？
	*/
	useHighPrecisionMask(e) {
		this._useHighPrecisionMask = e;
	}
	/**
	* マスクの描画方式を取得する
	* @return true 高精細方式
	* @return false デフォルト
	*/
	isUsingHighPrecisionMask() {
		return this._useHighPrecisionMask;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		this._isCulling = !1, this._isPremultipliedAlpha = !1, this._anisotropy = 0, this._model = null, this._modelColor = new w(), this._useHighPrecisionMask = !1, this._mvpMatrix4x4 = new pe(), this._mvpMatrix4x4.loadIdentity();
	}
}, ve = /* @__PURE__ */ ((e) => (e[e.CubismBlendMode_Normal = 0] = "CubismBlendMode_Normal", e[e.CubismBlendMode_Additive = 1] = "CubismBlendMode_Additive", e[e.CubismBlendMode_Multiplicative = 2] = "CubismBlendMode_Multiplicative", e))(ve || {}), w = class {
	/**
	* コンストラクタ
	*/
	constructor(e = 1, t = 1, n = 1, r = 1) {
		this.r = e, this.g = t, this.b = n, this.a = r;
	}
}, ye = class {
	/**
	* 引数付きコンストラクタ
	*/
	constructor(e, t) {
		this._clippingIdList = e, this._clippingIdCount = t, this._allClippedDrawRect = new he(), this._layoutBounds = new he(), this._clippedDrawableIndexList = [], this._matrixForMask = new pe(), this._matrixForDraw = new pe(), this._bufferIndex = 0;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._layoutBounds != null && (this._layoutBounds = null), this._allClippedDrawRect != null && (this._allClippedDrawRect = null), this._clippedDrawableIndexList != null && (this._clippedDrawableIndexList = null);
	}
	/**
	* このマスクにクリップされる描画オブジェクトを追加する
	*
	* @param drawableIndex クリッピング対象に追加する描画オブジェクトのインデックス
	*/
	addClippedDrawable(e) {
		this._clippedDrawableIndexList.push(e);
	}
}, be;
((e) => {
	e.CubismBlendMode = ve, e.CubismRenderer = _e, e.CubismTextureColor = w;
})(be ||= {});
var xe = 0, Se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
	__proto__: null,
	CSM_LOG_LEVEL: xe,
	CSM_LOG_LEVEL_DEBUG: 1,
	CSM_LOG_LEVEL_ERROR: 4,
	CSM_LOG_LEVEL_INFO: 2,
	CSM_LOG_LEVEL_OFF: 5,
	CSM_LOG_LEVEL_VERBOSE: xe,
	CSM_LOG_LEVEL_WARNING: 3
}, Symbol.toStringTag, { value: "Module" })), Ce = (e, t, n) => {
	De.print(e, "[CSM]" + t, n);
}, we = (e, t, n) => {
	Ce(e, t + "\n", n);
}, T = (e) => {
	console.assert(e);
}, Te = (e, ...t) => {
	we(Ye.LogLevel_Debug, "[D]" + e, t);
}, Ee = (e, ...t) => {
	we(Ye.LogLevel_Info, "[I]" + e, t);
}, E = (e, ...t) => {
	we(Ye.LogLevel_Warning, "[W]" + e, t);
}, D = (e, ...t) => {
	we(Ye.LogLevel_Error, "[E]" + e, t);
}, De = class {
	/**
	* ログを出力する。第一引数にログレベルを設定する。
	* CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
	*
	* @param logLevel ログレベルの設定
	* @param format 書式付き文字列
	* @param args 可変長引数
	*/
	static print(e, t, n) {
		if (e < N.getLoggingLevel()) return;
		let r = N.coreLogFunction;
		r && r(t.replace(/\{(\d+)\}/g, (e, t) => n[t]));
	}
	/**
	* データから指定した長さだけダンプ出力する。
	* CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
	*
	* @param logLevel ログレベルの設定
	* @param data ダンプするデータ
	* @param length ダンプする長さ
	*/
	static dumpBytes(e, t, n) {
		for (let r = 0; r < n; r++) r % 16 == 0 && r > 0 ? this.print(e, "\n") : r % 8 == 0 && r > 0 && this.print(e, "  "), this.print(e, "{0} ", [t[r] & 255]);
		this.print(e, "\n");
	}
	/**
	* private コンストラクタ
	*/
	constructor() {}
}, Oe;
((e) => {
	e.CubismDebug = De;
})(Oe ||= {});
var ke = class {
	/**
	* コンストラクタ
	* @param key Keyとしてセットする値
	* @param value Valueとしてセットする値
	*/
	constructor(e, t) {
		this.first = e ?? null, this.second = t ?? null;
	}
}, Ae = class e {
	/**
	* 引数付きコンストラクタ
	* @param size 初期化時点で確保するサイズ
	*/
	constructor(e) {
		e == null || e < 1 ? (this._keyValues = [], this._dummyValue = null, this._size = 0) : (this._keyValues = Array(e), this._size = e);
	}
	/**
	* デストラクタ
	*/
	release() {
		this.clear();
	}
	/**
	* キーを追加する
	* @param key 新たに追加するキー
	*/
	appendKey(e) {
		let t = -1;
		for (let n = 0; n < this._size; n++) if (this._keyValues[n].first == e) {
			t = n;
			break;
		}
		if (t != -1) {
			E("The key `{0}` is already append.", e);
			return;
		}
		this.prepareCapacity(this._size + 1, !1), this._keyValues[this._size] = new ke(e), this._size += 1;
	}
	/**
	* 添字演算子[key]のオーバーロード(get)
	* @param key 添字から特定されるValue値
	*/
	getValue(e) {
		let t = -1;
		for (let n = 0; n < this._size; n++) if (this._keyValues[n].first == e) {
			t = n;
			break;
		}
		return t >= 0 ? this._keyValues[t].second : (this.appendKey(e), this._keyValues[this._size - 1].second);
	}
	/**
	* 添字演算子[key]のオーバーロード(set)
	* @param key 添字から特定されるValue値
	* @param value 代入するValue値
	*/
	setValue(e, t) {
		let n = -1;
		for (let t = 0; t < this._size; t++) if (this._keyValues[t].first == e) {
			n = t;
			break;
		}
		n >= 0 ? this._keyValues[n].second = t : (this.appendKey(e), this._keyValues[this._size - 1].second = t);
	}
	/**
	* 引数で渡したKeyを持つ要素が存在するか
	* @param key 存在を確認するkey
	* @return true 引数で渡したkeyを持つ要素が存在する
	* @return false 引数で渡したkeyを持つ要素が存在しない
	*/
	isExist(e) {
		for (let t = 0; t < this._size; t++) if (this._keyValues[t].first == e) return !0;
		return !1;
	}
	/**
	* keyValueのポインタを全て解放する
	*/
	clear() {
		this._keyValues = void 0, this._keyValues = null, this._keyValues = [], this._size = 0;
	}
	/**
	* コンテナのサイズを取得する
	*
	* @return コンテナのサイズ
	*/
	getSize() {
		return this._size;
	}
	/**
	* コンテナのキャパシティを確保する
	* @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない。
	* @param fitToSize trueなら指定したサイズに合わせる。falseならサイズを2倍確保しておく。
	*/
	prepareCapacity(t, n) {
		t > this._keyValues.length && (this._keyValues.length == 0 ? (!n && t < e.DefaultSize && (t = e.DefaultSize), this._keyValues.length = t) : (!n && t < this._keyValues.length * 2 && (t = this._keyValues.length * 2), this._keyValues.length = t));
	}
	/**
	* コンテナの先頭要素を返す
	*/
	begin() {
		return new je(this, 0);
	}
	/**
	* コンテナの終端要素を返す
	*/
	end() {
		return new je(this, this._size);
	}
	/**
	* コンテナから要素を削除する
	*
	* @param ite 削除する要素
	*/
	erase(e) {
		let t = e._index;
		return t < 0 || this._size <= t ? e : (this._keyValues.splice(t, 1), --this._size, new je(this, t));
	}
	/**
	* コンテナの値を32ビット符号付き整数型でダンプする
	*/
	dumpAsInt() {
		for (let e = 0; e < this._size; e++) Te("{0} ,", this._keyValues[e]), Te("\n");
	}
};
Ae.DefaultSize = 10;
var O = Ae, je = class e {
	/**
	* コンストラクタ
	*/
	constructor(e, t) {
		this._map = e ?? new O(), this._index = t ?? 0;
	}
	/**
	* =演算子のオーバーロード
	*/
	set(e) {
		return this._index = e._index, this._map = e._map, this;
	}
	/**
	* 前置き++演算子のオーバーロード
	*/
	preIncrement() {
		return ++this._index, this;
	}
	/**
	* 前置き--演算子のオーバーロード
	*/
	preDecrement() {
		return --this._index, this;
	}
	/**
	* 後置き++演算子のオーバーロード
	*/
	increment() {
		return new e(this._map, this._index++);
	}
	/**
	* 後置き--演算子のオーバーロード
	*/
	decrement() {
		let t = new e(this._map, this._index);
		return this._map = t._map, this._index = t._index, this;
	}
	/**
	* *演算子のオーバーロード
	*/
	ptr() {
		return this._map._keyValues[this._index];
	}
	/**
	* !=演算
	*/
	notEqual(e) {
		return this._index != e._index || this._map != e._map;
	}
}, Me;
((e) => {
	e.csmMap = O, e.csmPair = ke, e.iterator = je;
})(Me ||= {});
var Ne = class e {
	static parseJsonObject(t, n) {
		return Object.keys(t).forEach((r) => {
			if (typeof t[r] == "boolean") {
				let e = !!t[r];
				n.put(r, new j(e));
			} else if (typeof t[r] == "string") {
				let e = String(t[r]);
				n.put(r, new Le(e));
			} else if (typeof t[r] == "number") {
				let e = Number(t[r]);
				n.put(r, new Ie(e));
			} else t[r] instanceof Array ? n.put(r, e.parseJsonArray(t[r])) : t[r] instanceof Object ? n.put(r, e.parseJsonObject(t[r], new Ve())) : t[r] == null ? n.put(r, new ze()) : n.put(r, t[r]);
		}), n;
	}
	static parseJsonArray(e) {
		let t = new Be();
		return Object.keys(e).forEach((n) => {
			if (typeof Number(n) == "number") {
				if (typeof e[n] == "boolean") {
					let r = !!e[n];
					t.add(new j(r));
				} else if (typeof e[n] == "string") {
					let r = String(e[n]);
					t.add(new Le(r));
				} else if (typeof e[n] == "number") {
					let r = Number(e[n]);
					t.add(new Ie(r));
				} else e[n] instanceof Array ? t.add(this.parseJsonArray(e[n])) : e[n] instanceof Object ? t.add(this.parseJsonObject(e[n], new Ve())) : e[n] == null ? t.add(new ze()) : t.add(e[n]);
			} else if (e[n] instanceof Array) t.add(this.parseJsonArray(e[n]));
			else if (e[n] instanceof Object) t.add(this.parseJsonObject(e[n], new Ve()));
			else if (e[n] == null) t.add(new ze());
			else {
				let r = Array(e[n]);
				for (let e = 0; e < r.length; e++) t.add(r[e]);
			}
		}), t;
	}
}, Pe = "Error: type mismatch", Fe = "Error: index out of bounds", k = class e {
	/**
	* コンストラクタ
	*/
	constructor() {}
	/**
	* 要素を文字列型で返す(string)
	*/
	getRawString(e, t) {
		return this.getString(e, t);
	}
	/**
	* 要素を数値型で返す(number)
	*/
	toInt(e = 0) {
		return e;
	}
	/**
	* 要素を数値型で返す(number)
	*/
	toFloat(e = 0) {
		return e;
	}
	/**
	* 要素を真偽値で返す(boolean)
	*/
	toBoolean(e = !1) {
		return e;
	}
	/**
	* サイズを返す
	*/
	getSize() {
		return 0;
	}
	/**
	* 要素を配列で返す(Value[])
	*/
	getArray(e = null) {
		return e;
	}
	/**
	* 要素をコンテナで返す(array)
	*/
	getVector(e = new S()) {
		return e;
	}
	/**
	* 要素をマップで返す(csmMap<csmString, Value>)
	*/
	getMap(e) {
		return e;
	}
	/**
	* 添字演算子[index]
	*/
	getValueByIndex(t) {
		return e.errorValue.setErrorNotForClientCall(Pe);
	}
	/**
	* 添字演算子[string | csmString]
	*/
	getValueByString(t) {
		return e.nullValue.setErrorNotForClientCall(Pe);
	}
	/**
	* マップのキー一覧をコンテナで返す
	*
	* @return マップのキーの一覧
	*/
	getKeys() {
		return e.dummyKeys;
	}
	/**
	* Valueの種類がエラー値ならtrue
	*/
	isError() {
		return !1;
	}
	/**
	* Valueの種類がnullならtrue
	*/
	isNull() {
		return !1;
	}
	/**
	* Valueの種類が真偽値ならtrue
	*/
	isBool() {
		return !1;
	}
	/**
	* Valueの種類が数値型ならtrue
	*/
	isFloat() {
		return !1;
	}
	/**
	* Valueの種類が文字列ならtrue
	*/
	isString() {
		return !1;
	}
	/**
	* Valueの種類が配列ならtrue
	*/
	isArray() {
		return !1;
	}
	/**
	* Valueの種類がマップ型ならtrue
	*/
	isMap() {
		return !1;
	}
	equals(e) {
		return !1;
	}
	/**
	* Valueの値が静的ならtrue、静的なら解放しない
	*/
	isStatic() {
		return !1;
	}
	/**
	* Valueにエラー値をセットする
	*/
	setErrorNotForClientCall(e) {
		return Re.errorValue;
	}
	/**
	* 初期化用メソッド
	*/
	static staticInitializeNotForClientCall() {
		j.trueValue = new j(!0), j.falseValue = new j(!1), e.errorValue = new Re("ERROR", !0), e.nullValue = new ze(), e.dummyKeys = new S();
	}
	/**
	* リリース用メソッド
	*/
	static staticReleaseNotForClientCall() {
		j.trueValue = null, j.falseValue = null, e.errorValue = null, e.nullValue = null, e.dummyKeys = null;
	}
}, A = class e {
	/**
	* コンストラクタ
	*/
	constructor(e, t) {
		this._parseCallback = Ne.parseJsonObject, this._error = null, this._lineCount = 0, this._root = null, e != null && this.parseBytes(e, t, this._parseCallback);
	}
	/**
	* バイトデータから直接ロードしてパースする
	*
	* @param buffer バッファ
	* @param size バッファサイズ
	* @return CubismJsonクラスのインスタンス。失敗したらNULL
	*/
	static create(t, n) {
		let r = new e();
		return r.parseBytes(t, n, r._parseCallback) ? r : (e.delete(r), null);
	}
	/**
	* パースしたJSONオブジェクトの解放処理
	*
	* @param instance CubismJsonクラスのインスタンス
	*/
	static delete(e) {}
	/**
	* パースしたJSONのルート要素を返す
	*/
	getRoot() {
		return this._root;
	}
	/**
	*  UnicodeのバイナリをStringに変換
	*
	* @param buffer 変換するバイナリデータ
	* @return 変換後の文字列
	*/
	static arrayBufferToString(e) {
		let t = new Uint8Array(e), n = "";
		for (let e = 0, r = t.length; e < r; ++e) n += "%" + this.pad(t[e].toString(16));
		return n = decodeURIComponent(n), n;
	}
	/**
	* エンコード、パディング
	*/
	static pad(e) {
		return e.length < 2 ? "0" + e : e;
	}
	/**
	* JSONのパースを実行する
	* @param buffer    パース対象のデータバイト
	* @param size      データバイトのサイズ
	* return true : 成功
	* return false: 失敗
	*/
	parseBytes(t, n, r) {
		let i = [,], a = e.arrayBufferToString(t);
		if (this._root = r == null ? this.parseValue(a, n, 0, i) : r(JSON.parse(a), new Ve()), this._error) {
			let e = "\0";
			return e = "Json parse error : @line " + (this._lineCount + 1) + "\n", this._root = new Le(e), Ee("{0}", this._root.getRawString()), !1;
		}
		return this._root != null || (this._root = new Re(new C(this._error), !1), !1);
	}
	/**
	* パース時のエラー値を返す
	*/
	getParseError() {
		return this._error;
	}
	/**
	* ルート要素の次の要素がファイルの終端だったらtrueを返す
	*/
	checkEndOfFile() {
		return this._root.getArray()[1].equals("EOF");
	}
	/**
	* JSONエレメントからValue(float,String,Value*,Array,null,true,false)をパースする
	* エレメントの書式に応じて内部でParseString(), ParseObject(), ParseArray()を呼ぶ
	*
	* @param   buffer      JSONエレメントのバッファ
	* @param   length      パースする長さ
	* @param   begin       パースを開始する位置
	* @param   outEndPos   パース終了時の位置
	* @return      パースから取得したValueオブジェクト
	*/
	parseValue(e, t, n, r) {
		if (this._error) return null;
		let i = null, a = n, o;
		for (; a < t; a++) switch (e[a]) {
			case "-":
			case ".":
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": {
				let t = [,];
				return o = Ue(e.slice(a), t), r[0] = e.indexOf(t[0]), new Ie(o);
			}
			case "\"": return new Le(this.parseString(e, t, a + 1, r));
			case "[": return i = this.parseArray(e, t, a + 1, r), i;
			case "{": return i = this.parseObject(e, t, a + 1, r), i;
			case "n": return a + 3 < t ? (i = new ze(), r[0] = a + 4) : this._error = "parse null", i;
			case "t": return a + 3 < t ? (i = j.trueValue, r[0] = a + 4) : this._error = "parse true", i;
			case "f": return a + 4 < t ? (i = j.falseValue, r[0] = a + 5) : this._error = "illegal ',' position", i;
			case ",": return this._error = "illegal ',' position", null;
			case "]": return r[0] = a, null;
			case "\n": this._lineCount++;
		}
		return this._error = "illegal end of value", null;
	}
	/**
	* 次の「"」までの文字列をパースする。
	*
	* @param   string  ->  パース対象の文字列
	* @param   length  ->  パースする長さ
	* @param   begin   ->  パースを開始する位置
	* @param  outEndPos   ->  パース終了時の位置
	* @return      パースした文F字列要素
	*/
	parseString(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "string is null", null;
		let i = n, a, o, s = new C(""), c = n;
		for (; i < t; i++) switch (a = e[i], a) {
			case "\"": return r[0] = i + 1, s.append(e.slice(c), i - c), s.s;
			case "//": if (i++, i - 1 > c && s.append(e.slice(c), i - c), c = i + 1, i < t) switch (o = e[i], o) {
				case "\\":
					s.expansion(1, "\\");
					break;
				case "\"":
					s.expansion(1, "\"");
					break;
				case "/":
					s.expansion(1, "/");
					break;
				case "b":
					s.expansion(1, "\b");
					break;
				case "f":
					s.expansion(1, "\f");
					break;
				case "n":
					s.expansion(1, "\n");
					break;
				case "r":
					s.expansion(1, "\r");
					break;
				case "t":
					s.expansion(1, "	");
					break;
				case "u": this._error = "parse string/unicord escape not supported";
			}
			else this._error = "parse string/escape error";
		}
		return this._error = "parse string/illegal end", null;
	}
	/**
	* JSONのオブジェクトエレメントをパースしてValueオブジェクトを返す
	*
	* @param buffer    JSONエレメントのバッファ
	* @param length    パースする長さ
	* @param begin     パースを開始する位置
	* @param outEndPos パース終了時の位置
	* @return パースから取得したValueオブジェクト
	*/
	parseObject(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "buffer is null", null;
		let i = new Ve(), a = "", o = n, s = "", c = [,], l = !1;
		for (; o < t; o++) {
			FOR_LOOP: for (; o < t; o++) switch (s = e[o], s) {
				case "\"":
					if (a = this.parseString(e, t, o + 1, c), this._error) return null;
					o = c[0], l = !0;
					break FOR_LOOP;
				case "}": return r[0] = o + 1, i;
				case ":":
					this._error = "illegal ':' position";
					break;
				case "\n": this._lineCount++;
			}
			if (!l) return this._error = "key not found", null;
			l = !1;
			FOR_LOOP2: for (; o < t; o++) switch (s = e[o], s) {
				case ":":
					l = !0, o++;
					break FOR_LOOP2;
				case "}":
					this._error = "illegal '}' position";
					break;
				case "\n": this._lineCount++;
			}
			if (!l) return this._error = "':' not found", null;
			let n = this.parseValue(e, t, o, c);
			if (this._error) return null;
			o = c[0], i.put(a, n);
			FOR_LOOP3: for (; o < t; o++) switch (s = e[o], s) {
				case ",": break FOR_LOOP3;
				case "}": return r[0] = o + 1, i;
				case "\n": this._lineCount++;
			}
		}
		return this._error = "illegal end of perseObject", null;
	}
	/**
	* 次の「"」までの文字列をパースする。
	* @param buffer    JSONエレメントのバッファ
	* @param length    パースする長さ
	* @param begin     パースを開始する位置
	* @param outEndPos パース終了時の位置
	* @return パースから取得したValueオブジェクト
	*/
	parseArray(e, t, n, r) {
		if (this._error) return null;
		if (!e) return this._error = "buffer is null", null;
		let i = new Be(), a = n, o, s = [,];
		for (; a < t; a++) {
			let n = this.parseValue(e, t, a, s);
			if (this._error) return null;
			a = s[0], n && i.add(n);
			FOR_LOOP: for (; a < t; a++) switch (o = e[a], o) {
				case ",": break FOR_LOOP;
				case "]": return r[0] = a + 1, i;
				case "\n": ++this._lineCount;
			}
		}
		return i = void 0, this._error = "illegal end of parseObject", null;
	}
}, Ie = class extends k {
	/**
	* コンストラクタ
	*/
	constructor(e) {
		super(), this._value = e;
	}
	/**
	* Valueの種類が数値型ならtrue
	*/
	isFloat() {
		return !0;
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		return this._value = NaN, this._stringBuffer = "\0", this._stringBuffer;
	}
	/**
	* 要素を数値型で返す(number)
	*/
	toInt(e = 0) {
		return parseInt(this._value.toString());
	}
	/**
	* 要素を数値型で返す(number)
	*/
	toFloat(e = 0) {
		return this._value;
	}
	equals(e) {
		return typeof e == "number" && !Math.round(e) && e == this._value;
	}
}, j = class extends k {
	/**
	* Valueの種類が真偽値ならtrue
	*/
	isBool() {
		return !0;
	}
	/**
	* 要素を真偽値で返す(boolean)
	*/
	toBoolean(e = !1) {
		return this._boolValue;
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		return this._stringBuffer = this._boolValue ? "true" : "false", this._stringBuffer;
	}
	equals(e) {
		return typeof e == "boolean" && e == this._boolValue;
	}
	/**
	* Valueの値が静的ならtrue, 静的なら解放しない
	*/
	isStatic() {
		return !0;
	}
	/**
	* 引数付きコンストラクタ
	*/
	constructor(e) {
		super(), this._boolValue = e;
	}
}, Le = class extends k {
	constructor(e) {
		super(), typeof e == "string" && (this._stringBuffer = e), e instanceof C && (this._stringBuffer = e.s);
	}
	/**
	* Valueの種類が文字列ならtrue
	*/
	isString() {
		return !0;
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		return this._stringBuffer;
	}
	equals(e) {
		return typeof e == "string" ? this._stringBuffer == e : e instanceof C && this._stringBuffer == e.s;
	}
}, Re = class extends Le {
	/**
	* Valueの値が静的ならtrue、静的なら解放しない
	*/
	isStatic() {
		return this._isStatic;
	}
	/**
	* エラー情報をセットする
	*/
	setErrorNotForClientCall(e) {
		return this._stringBuffer = e, this;
	}
	/**
	* 引数付きコンストラクタ
	*/
	constructor(e, t) {
		super(e), this._isStatic = t;
	}
	/**
	* Valueの種類がエラー値ならtrue
	*/
	isError() {
		return !0;
	}
}, ze = class extends k {
	/**
	* Valueの種類がNULL値ならtrue
	*/
	isNull() {
		return !0;
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		return this._stringBuffer;
	}
	/**
	* Valueの値が静的ならtrue, 静的なら解放しない
	*/
	isStatic() {
		return !0;
	}
	/**
	* Valueにエラー値をセットする
	*/
	setErrorNotForClientCall(e) {
		return this._stringBuffer = e, Re.nullValue;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._stringBuffer = "NullValue";
	}
}, Be = class extends k {
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._array = new S();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		for (let e = this._array.begin(); e.notEqual(this._array.end()); e.preIncrement()) {
			let t = e.ptr();
			t && !t.isStatic() && (t = void 0, t = null);
		}
	}
	/**
	* Valueの種類が配列ならtrue
	*/
	isArray() {
		return !0;
	}
	/**
	* 添字演算子[index]
	*/
	getValueByIndex(e) {
		return e < 0 || this._array.getSize() <= e ? k.errorValue.setErrorNotForClientCall(Fe) : this._array.at(e) ?? k.nullValue;
	}
	/**
	* 添字演算子[string | csmString]
	*/
	getValueByString(e) {
		return k.errorValue.setErrorNotForClientCall(Pe);
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		let n = t + "[\n";
		for (let e = this._array.begin(); e.notEqual(this._array.end()); e.increment()) {
			let n = e.ptr();
			this._stringBuffer += t + "" + n.getString(t + " ") + "\n";
		}
		return this._stringBuffer = n + t + "]\n", this._stringBuffer;
	}
	/**
	* 配列要素を追加する
	* @param v 追加する要素
	*/
	add(e) {
		this._array.pushBack(e);
	}
	/**
	* 要素をコンテナで返す(csmVector<Value>)
	*/
	getVector(e = null) {
		return this._array;
	}
	/**
	* 要素の数を返す
	*/
	getSize() {
		return this._array.getSize();
	}
}, Ve = class extends k {
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._map = new O();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		let e = this._map.begin();
		for (; e.notEqual(this._map.end());) {
			let t = e.ptr().second;
			t && !t.isStatic() && (t = void 0, t = null), e.preIncrement();
		}
	}
	/**
	* Valueの値がMap型ならtrue
	*/
	isMap() {
		return !0;
	}
	/**
	* 添字演算子[string | csmString]
	*/
	getValueByString(e) {
		if (e instanceof C) return this._map.getValue(e.s) ?? k.nullValue;
		for (let t = this._map.begin(); t.notEqual(this._map.end()); t.preIncrement()) if (t.ptr().first == e) return t.ptr().second == null ? k.nullValue : t.ptr().second;
		return k.nullValue;
	}
	/**
	* 添字演算子[index]
	*/
	getValueByIndex(e) {
		return k.errorValue.setErrorNotForClientCall(Pe);
	}
	/**
	* 要素を文字列で返す(csmString型)
	*/
	getString(e, t) {
		this._stringBuffer = t + "{\n";
		let n = this._map.begin();
		for (; n.notEqual(this._map.end());) {
			let e = n.ptr().first, r = n.ptr().second;
			this._stringBuffer += t + " " + e + " : " + r.getString(t + "   ") + " \n", n.preIncrement();
		}
		return this._stringBuffer += t + "}\n", this._stringBuffer;
	}
	/**
	* 要素をMap型で返す
	*/
	getMap(e) {
		return this._map;
	}
	/**
	* Mapに要素を追加する
	*/
	put(e, t) {
		this._map.setValue(e, t);
	}
	/**
	* Mapからキーのリストを取得する
	*/
	getKeys() {
		if (!this._keys) {
			this._keys = new S();
			let e = this._map.begin();
			for (; e.notEqual(this._map.end());) {
				let t = e.ptr().first;
				this._keys.pushBack(t), e.preIncrement();
			}
		}
		return this._keys;
	}
	/**
	* Mapの要素数を取得する
	*/
	getSize() {
		return this._keys.getSize();
	}
}, He;
((e) => {
	e.CubismJson = A, e.JsonArray = Be, e.JsonBoolean = j, e.JsonError = Re, e.JsonFloat = Ie, e.JsonMap = Ve, e.JsonNullvalue = ze, e.JsonString = Le, e.Value = k;
})(He ||= {});
function Ue(e, t) {
	let n = 0;
	for (let t = 1;; t++) {
		let r = e.slice(t - 1, t);
		if (r == "e" || r == "-" || r == "E") continue;
		let i = e.substring(0, t), a = Number(i);
		if (isNaN(a)) break;
		n = t;
	}
	let r = parseFloat(e);
	return isNaN(r) && (r = NaN), t[0] = e.slice(n), r;
}
var M = !1, We = !1, Ge = null, Ke = null, qe = Object.freeze({
	vertexOffset: 0,
	vertexStep: 2
});
function Je(e) {
	e &&= void 0;
}
var N = class {
	/**
	* Cubism FrameworkのAPIを使用可能にする。
	*  APIを実行する前に必ずこの関数を実行すること。
	*  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
	*
	* @param    option      Optionクラスのインスタンス
	*
	* @return   準備処理が完了したらtrueが返ります。
	*/
	static startUp(e = null) {
		if (M) return Ee("CubismFramework.startUp() is already done."), M;
		if (Ge = e, Ge != null && Live2DCubismCore.Logging.csmSetLogFunction(Ge.logFunction), M = !0, M) {
			let e = Live2DCubismCore.Version.csmGetVersion(), t = (e & 4278190080) >> 24, n = (e & 16711680) >> 16, r = e & 65535, i = e;
			Ee("Live2D Cubism Core version: {0}.{1}.{2} ({3})", ("00" + t).slice(-2), ("00" + n).slice(-2), ("0000" + r).slice(-4), i);
		}
		return Ee("CubismFramework.startUp() is complete."), M;
	}
	/**
	* StartUp()で初期化したCubismFrameworkの各パラメータをクリアします。
	* Dispose()したCubismFrameworkを再利用する際に利用してください。
	*/
	static cleanUp() {
		M = !1, We = !1, Ge = null, Ke = null;
	}
	/**
	* Cubism Framework内のリソースを初期化してモデルを表示可能な状態にします。<br>
	*     再度Initialize()するには先にDispose()を実行する必要があります。
	*
	* @param memorySize 初期化時メモリ量 [byte(s)]
	*    複数モデル表示時などにモデルが更新されない際に使用してください。
	*    指定する際は必ず1024*1024*16 byte(16MB)以上の値を指定してください。
	*    それ以外はすべて1024*1024*16 byteに丸めます。
	*/
	static initialize(e = 0) {
		if (T(M), !M) {
			E("CubismFramework is not started.");
			return;
		}
		if (We) {
			E("CubismFramework.initialize() skipped, already initialized.");
			return;
		}
		k.staticInitializeNotForClientCall(), Ke = new de(), Live2DCubismCore.Memory.initializeAmountOfMemory(e), We = !0, Ee("CubismFramework.initialize() is complete.");
	}
	/**
	* Cubism Framework内の全てのリソースを解放します。
	*      ただし、外部で確保されたリソースについては解放しません。
	*      外部で適切に破棄する必要があります。
	*/
	static dispose() {
		if (T(M), !M) {
			E("CubismFramework is not started.");
			return;
		}
		if (!We) {
			E("CubismFramework.dispose() skipped, not initialized.");
			return;
		}
		k.staticReleaseNotForClientCall(), Ke.release(), Ke = null, _e.staticRelease(), We = !1, Ee("CubismFramework.dispose() is complete.");
	}
	/**
	* Cubism FrameworkのAPIを使用する準備が完了したかどうか
	* @return APIを使用する準備が完了していればtrueが返ります。
	*/
	static isStarted() {
		return M;
	}
	/**
	* Cubism Frameworkのリソース初期化がすでに行われているかどうか
	* @return リソース確保が完了していればtrueが返ります
	*/
	static isInitialized() {
		return We;
	}
	/**
	* Core APIにバインドしたログ関数を実行する
	*
	* @praram message ログメッセージ
	*/
	static coreLogFunction(e) {
		Live2DCubismCore.Logging.csmGetLogFunction() && Live2DCubismCore.Logging.csmGetLogFunction()(e);
	}
	/**
	* 現在のログ出力レベル設定の値を返す。
	*
	* @return  現在のログ出力レベル設定の値
	*/
	static getLoggingLevel() {
		return Ge == null ? 5 : Ge.loggingLevel;
	}
	/**
	* IDマネージャのインスタンスを取得する
	* @return CubismManagerクラスのインスタンス
	*/
	static getIdManager() {
		return Ke;
	}
	/**
	* 静的クラスとして使用する
	* インスタンス化させない
	*/
	constructor() {}
}, Ye = /* @__PURE__ */ ((e) => (e[e.LogLevel_Verbose = 0] = "LogLevel_Verbose", e[e.LogLevel_Debug = 1] = "LogLevel_Debug", e[e.LogLevel_Info = 2] = "LogLevel_Info", e[e.LogLevel_Warning = 3] = "LogLevel_Warning", e[e.LogLevel_Error = 4] = "LogLevel_Error", e[e.LogLevel_Off = 5] = "LogLevel_Off", e))(Ye || {}), Xe;
((e) => {
	e.Constant = qe, e.csmDelete = Je, e.CubismFramework = N;
})(Xe ||= {});
var Ze = 0, Qe = 1, P = {
	LOG_LEVEL_VERBOSE: Ze,
	LOG_LEVEL_WARNING: Qe,
	LOG_LEVEL_ERROR: 2,
	LOG_LEVEL_NONE: 999,
	/**
	* Global log level.
	* @default config.LOG_LEVEL_WARNING
	*/
	logLevel: Qe,
	/**
	* Enabling sound for motions.
	*/
	sound: !0,
	/**
	* fftSize for sound analyzer for lipsync.
	* Must be a power of 2 between 2^5 and 2^15, so one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768.
	* @default 512
	*/
	fftSize: 512,
	/**
	* Deferring motion and corresponding sound until both are loaded.
	*/
	motionSync: !0,
	/**
	* Default fading duration for motions without such value specified.
	*/
	motionFadingDuration: 500,
	/**
	* Default fading duration for idle motions without such value specified.
	*/
	idleMotionFadingDuration: 2e3,
	/**
	* Default fading duration for expressions without such value specified.
	*/
	expressionFadingDuration: 500,
	/**
	* If false, expression will be reset to default when playing non-idle motions.
	*/
	preserveExpressionOnMotion: !0,
	cubism: Se
}, F = {
	log(e, ...t) {
		P.logLevel <= P.LOG_LEVEL_VERBOSE && console.log(`[${e}]`, ...t);
	},
	warn(e, ...t) {
		P.logLevel <= P.LOG_LEVEL_WARNING && console.warn(`[${e}]`, ...t);
	},
	error(e, ...t) {
		P.logLevel <= P.LOG_LEVEL_ERROR && console.error(`[${e}]`, ...t);
	}
};
function $e(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
function et(e) {
	return e * 1024 * 1024;
}
function tt(e, t, n, r, i) {
	let a = t[r];
	a !== null && typeof a === e && (n[i] = a);
}
function nt(e, t, n, r, i) {
	let a = t[r];
	Array.isArray(a) && (n[i] = a.filter((t) => t !== null && typeof t === e));
}
function rt(e, t) {
	t.forEach((t) => {
		Object.getOwnPropertyNames(t.prototype).forEach((n) => {
			n !== "constructor" && Object.defineProperty(e.prototype, n, Object.getOwnPropertyDescriptor(t.prototype, n));
		});
	});
}
function it(e) {
	let t = e.lastIndexOf("/");
	return t != -1 && (e = e.slice(0, t)), t = e.lastIndexOf("/"), t !== -1 && (e = e.slice(t + 1)), e;
}
function at(e, t) {
	let n = e.indexOf(t);
	n !== -1 && e.splice(n, 1);
}
var ot = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
function st(e, t) {
	if (!t) return e;
	if (ot.test(t)) return t;
	if (t.startsWith("/")) return ot.test(e) ? new URL(t, e).toString() : t;
	if (ot.test(e)) return new URL(t, e).toString();
	let n = "http://example.com", r = e.startsWith("/") ? n + e : `${n}/${e}`, i = new URL(t, r), a = i.pathname + i.search + i.hash;
	return !e.startsWith("/") && a.startsWith("/") && (a = a.slice(1)), a;
}
var ct = class extends n {
	constructor(e, t) {
		super(), b(this, "expressionDataType", "json"), b(this, "tag"), b(this, "settings"), b(this, "expressions", []), b(this, "defaultExpression"), b(this, "currentExpression"), b(this, "reserveExpressionIndex", -1), b(this, "destroyed", !1), this.settings = e, this.tag = `ExpressionManager(${e.name})`;
	}
	/**
	* Should be called in the constructor of derived class.
	*/
	init() {
		this.defaultExpression = this.createDefaultExpression(), this.currentExpression = this.defaultExpression, this.stopAllExpressions();
	}
	/**
	* Creates the default expression instance used for resets.
	*/
	createDefaultExpression() {
		return this.createExpression({}, void 0);
	}
	/**
	* Loads an Expression. Errors in this method will not be thrown,
	* but be emitted with an "expressionLoadError" event.
	* @param index - Index of the expression in definitions.
	* @return Promise that resolves with the Expression, or with undefined if it can't be loaded.
	* @emits {@link ExpressionManagerEvents.expressionLoaded}
	* @emits {@link ExpressionManagerEvents.expressionLoadError}
	*/
	loadExpression(e) {
		return x(this, null, function* () {
			if (!this.definitions[e]) {
				F.warn(this.tag, `Undefined expression at [${e}]`);
				return;
			}
			if (this.expressions[e] === null) {
				F.warn(this.tag, `Cannot set expression at [${e}] because it's already failed in loading.`);
				return;
			}
			if (this.expressions[e]) return this.expressions[e];
			let t = yield this._loadExpression(e);
			return this.expressions[e] = t, t;
		});
	}
	/**
	* Loads the Expression. Will be implemented by Live2DFactory in order to avoid circular dependency.
	* @ignore
	*/
	_loadExpression(e) {
		throw Error("Not implemented.");
	}
	/**
	* Sets a random Expression that differs from current one.
	* @return Promise that resolves with true if succeeded, with false otherwise.
	*/
	setRandomExpression() {
		return x(this, null, function* () {
			if (this.definitions.length) {
				let e = [];
				for (let t = 0; t < this.definitions.length; t++) this.expressions[t] !== null && this.expressions[t] !== this.currentExpression && t !== this.reserveExpressionIndex && e.push(t);
				if (e.length) {
					let t = Math.floor(Math.random() * e.length);
					return this.setExpression(t);
				}
			}
			return !1;
		});
	}
	/**
	* Resets model's expression using {@link ExpressionManager#defaultExpression}.
	*/
	resetExpression() {
		this._setExpression(this.defaultExpression);
	}
	/**
	* Restores model's expression to {@link currentExpression}.
	*/
	restoreExpression() {
		this._setExpression(this.currentExpression);
	}
	/**
	* Sets an Expression.
	* @param index - Either the index, or the name of the expression.
	* @return Promise that resolves with true if succeeded, with false otherwise.
	*/
	setExpression(e) {
		return x(this, null, function* () {
			if (typeof e != "number" && (e = this.getExpressionIndex(e)), !(e > -1 && e < this.definitions.length) || e === this.expressions.indexOf(this.currentExpression)) return !1;
			this.reserveExpressionIndex = e;
			let t = yield this.loadExpression(e);
			return !t || this.reserveExpressionIndex !== e ? !1 : (this.reserveExpressionIndex = -1, this.currentExpression = t, this._setExpression(t), !0);
		});
	}
	/**
	* Updates parameters of the core model.
	* @return True if the parameters are actually updated.
	*/
	update(e, t) {
		return !this.isFinished() && this.updateParameters(e, t);
	}
	/**
	* Destroys the instance.
	* @emits {@link ExpressionManagerEvents.destroy}
	*/
	destroy() {
		this.destroyed = !0, this.emit("destroy");
		let e = this;
		e.definitions = void 0, e.expressions = void 0;
	}
}, lt = .01, ut = 40 / 7.5, dt = 1 / 150, ft = class {
	constructor() {
		/** Current velocity. */
		b(this, "targetX", 0), b(this, "targetY", 0), b(this, "x", 0), b(this, "y", 0), b(this, "vx", 0), b(this, "vy", 0);
	}
	/**
	* Sets the focus position.
	* @param x - X position in range `[-1, 1]`.
	* @param y - Y position in range `[-1, 1]`.
	* @param instant - Should the focus position be instantly applied.
	*/
	focus(e, t, n = !1) {
		this.targetX = $e(e, -1, 1), this.targetY = $e(t, -1, 1), n && (this.x = this.targetX, this.y = this.targetY);
	}
	/**
	* Updates the interpolation.
	* @param dt - Delta time in milliseconds.
	*/
	update(e) {
		let t = this.targetX - this.x, n = this.targetY - this.y;
		if (Math.abs(t) < lt && Math.abs(n) < lt) return;
		let r = Math.sqrt(y(t, 2) + y(n, 2)), i = ut / (1e3 / e), a = t / r * i - this.vx, o = n / r * i - this.vy, s = Math.sqrt(y(a, 2) + y(o, 2)), c = i * dt * e;
		s > c && (a *= c / s, o *= c / s), this.vx += a, this.vy += o;
		let l = Math.sqrt(y(this.vx, 2) + y(this.vy, 2)), u = .5 * (Math.sqrt(y(c, 2) + 8 * c * r) - c);
		l > u && (this.vx *= u / l, this.vy *= u / l), this.x += this.vx, this.y += this.vy;
	}
}, pt = class {
	/**
	* @param json - The settings JSON object.
	* @param json.url - The `url` field must be defined to specify the settings file's URL.
	*/
	constructor(e) {
		b(this, "json"), b(this, "name"), b(this, "url"), b(this, "pose"), b(this, "physics"), this.json = e, this.url = e.url, this.name = it(this.url);
	}
	/**
	* Ensures the model name is meaningful; falls back to the folder name when missing or placeholder.
	*/
	normalizeName() {
		(!this.name || this.name.toLowerCase() === "name") && (this.name = it(this.url));
	}
	/**
	* Picks the first non-empty, non-placeholder name from candidates and applies it.
	* Falls back to {@link normalizeName} when no candidate is usable.
	*/
	setModelName(...e) {
		for (let t of e) {
			let e = typeof t == "string" ? t.trim() : "";
			if (e && e.toLowerCase() !== "name") {
				this.name = e;
				return;
			}
		}
		this.normalizeName();
	}
	/**
	* Returns the file name without extension from a path.
	*/
	getFileStem(e) {
		return e ? e.split(/[/\\]/).filter(Boolean).pop()?.replace(/\.[^.]+$/, "") : void 0;
	}
	/**
	* Resolves a relative path using the {@link url}. This is used to resolve the resource files
	* defined in the settings.
	* @param path - Relative path.
	* @return Resolved path.
	*/
	resolveURL(e) {
		return st(this.url, e);
	}
	/**
	* Replaces the resource files by running each file through the `replacer`.
	* @param replacer - Invoked with two arguments: `(file, path)`, where `file` is the file definition,
	* and `path` is its property path in the ModelSettings instance. A string must be returned to be the replacement.
	*
	* ```js
	* modelSettings.replaceFiles((file, path) => {
	*     // file = "foo.moc", path = "moc"
	*     // file = "foo.png", path = "textures[0]"
	*     // file = "foo.mtn", path = "motions.idle[0].file"
	*     // file = "foo.motion3.json", path = "motions.idle[0].File"
	*
	*     return "bar/" + file;
	* });
	* ```
	*/
	replaceFiles(e) {
		this.moc = e(this.moc, "moc"), this.pose !== void 0 && (this.pose = e(this.pose, "pose")), this.physics !== void 0 && (this.physics = e(this.physics, "physics"));
		for (let t = 0; t < this.textures.length; t++) this.textures[t] = e(this.textures[t], `textures[${t}]`);
	}
	/**
	* Retrieves all resource files defined in the settings.
	* @return A flat array of the paths of all resource files.
	*
	* ```js
	* modelSettings.getDefinedFiles();
	* // returns: ["foo.moc", "foo.png", ...]
	* ```
	*/
	getDefinedFiles() {
		let e = [];
		return this.replaceFiles((t) => (e.push(t), t)), e;
	}
	/**
	* Validates that the files defined in the settings exist in given files. Each file will be
	* resolved by {@link resolveURL} before comparison.
	* @param files - A flat array of file paths.
	* @return All the files which are defined in the settings and also exist in given files,
	* *including the optional files*.
	* @throws Error if any *essential* file is defined in settings but not included in given files.
	*/
	validateFiles(e) {
		let t = (t, n) => {
			let r = this.resolveURL(t);
			if (!e.includes(r)) {
				if (n) throw Error(`File "${t}" is defined in settings, but doesn't exist in given files`);
				return !1;
			}
			return !0;
		};
		return [this.moc, ...this.textures].forEach((e) => t(e, !0)), this.getDefinedFiles().filter((e) => t(e, !1));
	}
}, I = /* @__PURE__ */ ((e) => (e[e.NONE = 0] = "NONE", e[e.IDLE = 1] = "IDLE", e[e.NORMAL = 2] = "NORMAL", e[e.FORCE = 3] = "FORCE", e))(I || {}), mt = class {
	constructor() {
		/**
		* Index of the reserved idle motion in its group.
		*/
		b(this, "tag"), b(this, "debug", !1), b(this, "currentPriority", 0), b(this, "reservePriority", 0), b(this, "currentGroup"), b(this, "currentIndex"), b(this, "reservedGroup"), b(this, "reservedIndex"), b(this, "reservedIdleGroup"), b(this, "reservedIdleIndex");
	}
	/**
	* Reserves the playback for a motion.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @param priority - The priority to be applied.
	* @return True if the reserving has succeeded.
	*/
	reserve(e, t, n) {
		if (n <= 0) return F.log(this.tag, "Cannot start a motion with MotionPriority.NONE."), !1;
		if (e === this.currentGroup && t === this.currentIndex) return F.log(this.tag, "Motion is already playing.", this.dump(e, t)), !1;
		if (e === this.reservedGroup && t === this.reservedIndex || e === this.reservedIdleGroup && t === this.reservedIdleIndex) return F.log(this.tag, "Motion is already reserved.", this.dump(e, t)), !1;
		if (n === 1) {
			if (this.currentPriority !== 0) return F.log(this.tag, "Cannot start idle motion because another motion is playing.", this.dump(e, t)), !1;
			if (this.reservedIdleGroup !== void 0) return F.log(this.tag, "Cannot start idle motion because another idle motion has reserved.", this.dump(e, t)), !1;
			this.setReservedIdle(e, t);
		} else {
			if (n < 3) {
				if (n <= this.currentPriority) return F.log(this.tag, "Cannot start motion because another motion is playing as an equivalent or higher priority.", this.dump(e, t)), !1;
				if (n <= this.reservePriority) return F.log(this.tag, "Cannot start motion because another motion has reserved as an equivalent or higher priority.", this.dump(e, t)), !1;
			}
			this.setReserved(e, t, n);
		}
		return !0;
	}
	/**
	* Requests the playback for a motion.
	* @param motion - The Motion, can be undefined.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @param priority - The priority to be applied.
	* @return True if the request has been approved, i.e. the motion is allowed to play.
	*/
	start(e, t, n, r) {
		if (r === 1) {
			if (this.setReservedIdle(void 0, void 0), this.currentPriority !== 0) return F.log(this.tag, "Cannot start idle motion because another motion is playing.", this.dump(t, n)), !1;
		} else {
			if (t !== this.reservedGroup || n !== this.reservedIndex) return F.log(this.tag, "Cannot start motion because another motion has taken the place.", this.dump(t, n)), !1;
			this.setReserved(void 0, void 0, 0);
		}
		return e ? (this.setCurrent(t, n, r), !0) : !1;
	}
	/**
	* Notifies the motion playback has finished.
	*/
	complete() {
		this.setCurrent(void 0, void 0, 0);
	}
	/**
	* Sets the current motion.
	*/
	setCurrent(e, t, n) {
		this.currentPriority = n, this.currentGroup = e, this.currentIndex = t;
	}
	/**
	* Sets the reserved motion.
	*/
	setReserved(e, t, n) {
		this.reservePriority = n, this.reservedGroup = e, this.reservedIndex = t;
	}
	/**
	* Sets the reserved idle motion.
	*/
	setReservedIdle(e, t) {
		this.reservedIdleGroup = e, this.reservedIdleIndex = t;
	}
	/**
	* Checks if a Motion is currently playing or has reserved.
	* @return True if active.
	*/
	isActive(e, t) {
		return e === this.currentGroup && t === this.currentIndex || e === this.reservedGroup && t === this.reservedIndex || e === this.reservedIdleGroup && t === this.reservedIdleIndex;
	}
	/**
	* Resets the state.
	*/
	reset() {
		this.setCurrent(void 0, void 0, 0), this.setReserved(void 0, void 0, 0), this.setReservedIdle(void 0, void 0);
	}
	/**
	* Checks if an idle motion should be requests to play.
	*/
	shouldRequestIdleMotion() {
		return this.currentGroup === void 0 && this.reservedIdleGroup === void 0;
	}
	/**
	* Checks if the model's expression should be overridden by the motion.
	*/
	shouldOverrideExpression() {
		return !P.preserveExpressionOnMotion && this.currentPriority > 1;
	}
	/**
	* Dumps the state for debugging.
	*/
	dump(e, t) {
		return this.debug ? `
<Requested> group = "${e}", index = ${t}
` + [
			"currentPriority",
			"reservePriority",
			"currentGroup",
			"currentIndex",
			"reservedGroup",
			"reservedIndex",
			"reservedIdleGroup",
			"reservedIdleIndex"
		].map((e) => "[" + e + "] " + this[e]).join("\n") : "";
	}
}, L = "SoundManager", ht = .5, gt = "live2d-sound-", _t = 0, vt, yt = /* @__PURE__ */ new WeakSet();
function bt(e) {
	if (!yt.has(e)) {
		try {
			e.disableAutoPause = !0;
		} catch (e) {
			F.warn(L, "Failed to disable @pixi/sound auto pause.", e);
		}
		yt.add(e);
	}
	return e;
}
function xt() {
	return typeof PIXI < "u" ? PIXI == null ? void 0 : PIXI.sound : void 0;
}
function St() {
	return x(this, null, function* () {
		let e = xt();
		return e ? bt(e) : (vt ??= import("./lib-D5HsAWgn.js").then(({ sound: e }) => bt(e)).catch((e) => (F.warn(L, "@pixi/sound is not available. Load pixi-sound.js before using motion sounds, speak(), or lip sync.", e), null)), vt);
	});
}
function Ct(e, t) {
	try {
		e.remove(t);
	} catch (e) {
		F.warn(L, `Failed to remove sound "${t}".`, e);
	}
}
function wt(e) {
	try {
		e.destroy();
	} catch (e) {
		F.warn(L, "Failed to destroy audio.", e);
	}
}
function Tt(e) {
	let t = e.media.buffer;
	if (t && typeof t == "object") return typeof t.getChannelData == "function" ? t : void 0;
}
var R = class {
	/**
	* Global volume that applies to all the sounds.
	*/
	static get volume() {
		return this._volume;
	}
	static set volume(e) {
		this._volume = (e > 1 ? 1 : e < 0 ? 0 : e) || 0, this.audios.forEach((e) => e.volume = this._volume);
	}
	/**
	* Creates an audio element and adds it to the {@link audios}.
	* @param file - URL of the sound file.
	* @param onError - Callback invoked when error occurs.
	* @return Created audio element.
	*/
	static add(e, t) {
		return x(this, null, function* () {
			let n = null, r;
			try {
				if (n = yield St(), !n) throw Error("@pixi/sound is not available");
				r = `${gt}${_t++}`;
				let t = n, i = r, a = yield new Promise((n, r) => {
					let a = t.add(i, {
						url: e,
						volume: this._volume,
						preload: !0,
						loaded: (t, i) => {
							if (t) {
								r(t);
								return;
							}
							let o = i ?? a;
							if (!o) {
								r(/* @__PURE__ */ Error(`Error: ${e} failed to load`));
								return;
							}
							if (!Tt(o)) {
								r(/* @__PURE__ */ Error(`Error: ${e} is not WebAudioMedia`));
								return;
							}
							n(o);
						}
					});
				});
				return this.aliases.set(a, {
					alias: i,
					library: t
				}), this.audios.push(a), a;
			} catch (i) {
				return n && r && Ct(n, r), F.warn(L, `Error occurred on "${e}"`, i), t?.(i), null;
			}
		});
	}
	/**
	* Plays the sound.
	* @param audio - An audio element.
	* @param onFinish - Callback invoked when the playback has finished.
	*/
	static play(e, t) {
		e.play({
			singleInstance: !0,
			complete: () => {
				t?.(), this.dispose(e);
			}
		});
	}
	static addAnalyzer(e, t) {
		let n = Tt(e);
		if (!n) {
			F.warn(L, "Cannot create audio analyzer because WebAudio media is unavailable.");
			return;
		}
		let r = t.createBufferSource();
		r.buffer = n;
		let i = t.createAnalyser();
		return i.fftSize = P.fftSize, i.minDecibels = -90, i.maxDecibels = -10, i.smoothingTimeConstant = .85, r.connect(i), r.start(0), this.analysers.push(i), i;
	}
	/**
	* Get volume for lip sync
	* @param analyser - An analyzer element.
	* @return Returns value to feed into lip sync
	*/
	static analyze(e) {
		if (!e) return parseFloat(Math.random().toFixed(1));
		let t = new Float32Array(e.fftSize);
		e.getFloatTimeDomainData(t);
		let n = 0;
		for (let e = 0; e < t.length; e++) n += y(t[e], 2);
		let r = Math.sqrt(n / t.length), i = 20 * Math.log10(r || y(10, -5)), a = Math.min(Math.max((i - e.minDecibels) / (e.maxDecibels - e.minDecibels), 0), 1);
		return parseFloat(a.toFixed(1));
	}
	/**
	* Disposes an audio element and removes it from {@link audios}.
	* @param audio - An audio element.
	*/
	static dispose(e) {
		try {
			e.pause();
		} catch (e) {
			F.warn(L, "Failed to pause audio.", e);
		}
		let t = this.aliases.get(e);
		t ? (Ct(t.library, t.alias), this.aliases.delete(e)) : wt(e), at(this.audios, e);
	}
	/**
	* Destroys all managed audios.
	*/
	static destroy() {
		for (let e = this.contexts.length - 1; e >= 0; e--) this.contexts[e]?.close().catch((e) => {
			F.warn(L, "Failed to close AudioContext.", e);
		});
		for (let e = this.audios.length - 1; e >= 0; e--) this.dispose(this.audios[e]);
	}
};
b(R, "audios", []), b(R, "analysers", []), b(R, "contexts", []), b(R, "aliases", /* @__PURE__ */ new WeakMap()), b(R, "_volume", ht);
var Et = class extends n {
	/**
	* Constructor for MotionManager.
	* @param parent - The parent InternalModel.
	*/
	constructor(e) {
		super(), b(this, "tag"), b(this, "settings"), b(this, "motionGroups", {}), b(this, "state", new mt()), b(this, "currentAudio"), b(this, "currentAnalyzer"), b(this, "currentContext"), b(this, "playing", !1), b(this, "destroyed", !1), b(this, "parent"), this.settings = e.settings, this.tag = `MotionManager(${this.settings.name})`, this.state.tag = this.tag, this.parent = e;
	}
	/**
	* Should be called in the constructor of derived class to initialize options and setup motions.
	* @param options - Initialization options for the manager.
	*/
	init(e) {
		e?.idleMotionGroup && (this.groups.idle = e.idleMotionGroup), this.setupMotions(e), this.stopAllMotions();
	}
	/**
	* Sets up motions from the definitions, and preloads them according to the preload strategy.
	* @param options - Options controlling which motions to preload.
	*/
	setupMotions(e) {
		if (!this.definitions) {
			F.warn(this.tag, "Motion definitions are not initialized.");
			return;
		}
		for (let e of Object.keys(this.definitions)) this.motionGroups[e] = [];
		let t;
		switch (e?.motionPreload) {
			case "NONE": return;
			case "ALL":
				t = Object.keys(this.definitions);
				break;
			default: t = [this.groups.idle];
		}
		for (let e of t) {
			let t = this.definitions[e];
			if (t) for (let n = 0; n < t.length; n++) this.loadMotion(e, n);
		}
	}
	/**
	* Loads a Motion in a motion group. Errors in this method will not be thrown,
	* but be emitted with a "motionLoadError" event.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @return Promise that resolves with the Motion, or with undefined if it can't be loaded.
	* @emits {@link MotionManagerEvents.motionLoaded}
	* @emits {@link MotionManagerEvents.motionLoadError}
	*/
	loadMotion(e, t) {
		return x(this, null, function* () {
			var n;
			if (this.destroyed || !this.getMotionDefinition(e, t)) return;
			let r = (n = this.motionGroups)[e] ?? (n[e] = []);
			if (r[t] === null) {
				F.warn(this.tag, `Cannot start motion at "${e}"[${t}] because it's already failed in loading.`);
				return;
			}
			if (r[t]) return r[t];
			let i = yield this._loadMotion(e, t);
			if (!this.destroyed) return r[t] = i ?? null, i;
		});
	}
	/**
	* Loads the Motion. Will be implemented by Live2DFactory in order to avoid circular dependency.
	* @ignore
	*/
	_loadMotion(e, t) {
		throw Error("Not implemented.");
	}
	/**
	* Initializes audio playback and sets up audio analysis for lipsync.
	* @param audio - The Sound to initialize.
	* @param volume - The playback volume (0-1).
	*/
	initializeAudio(e, t) {
		this.currentAudio = e, R.volume = t, this.currentContext = e.context.audioContext, this.currentAnalyzer = R.addAnalyzer(this.currentAudio, this.currentContext);
	}
	/**
	* Only play sound with lip sync.
	* @param sound - The audio url or base64 content.
	* @param volume - Volume of the sound (0-1).
	* @param expression - Expression to apply while playing sound.
	* @param resetExpression - Whether to reset the expression before and after playing sound (default: true).
	* @param crossOrigin - Cross origin setting.
	* @param onFinish - Callback when playback finishes.
	* @param onError - Callback when playback errors.
	* @returns Promise that resolves with true if the sound is playing, false otherwise.
	*/
	speak(e) {
		return x(this, arguments, function* (e, { volume: t = ht, expression: n, resetExpression: r = !0, onFinish: i, onError: a } = {}) {
			if (!P.sound) return !1;
			let o;
			if (this.currentAudio && this.currentAudio.isPlaying) return !1;
			let s, c = e && e.startsWith("data:");
			if (e && !c) {
				let t = document.createElement("a");
				t.href = e, e = t.href, s = e;
			} else s = "data:audio/";
			let l = e;
			if (l) try {
				if (o = yield R.add(l, (e, t = this) => {
					F.error(this.tag, "Error during audio playback:", e), a?.(e), r && n && t.expressionManager && t.expressionManager.resetExpression(), t.currentAudio = void 0;
				}), !o) return !1;
				this.initializeAudio(o, t);
			} catch (e) {
				return F.warn(this.tag, "Failed to create audio", s, e), !1;
			}
			if (o) {
				let e = !0;
				try {
					P.motionSync && R.play(o, () => {
						i?.(), r && n && this.expressionManager && this.expressionManager.resetExpression(), this.currentAudio = void 0;
					});
				} catch (t) {
					F.warn(this.tag, "Failed to play audio", o.url, t), e = !1;
				}
				if (!e) return !1;
			}
			return this.state.shouldOverrideExpression() && this.expressionManager && this.expressionManager.resetExpression(), n && this.expressionManager && (yield this.expressionManager.setExpression(n)), this.playing = !0, !0;
		});
	}
	/**
	* Starts a motion with the given priority.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @param priority - The priority to be applied. Default: NORMAL (2).
	* @param sound - The audio url or base64 content.
	* @param volume - Volume of the sound (0-1).
	* @param expression - Expression to apply while playing sound.
	* @param resetExpression - Whether to reset the expression before and after playing sound (default: true).
	* @param crossOrigin - Cross origin setting.
	* @param onFinish - Callback when playback finishes.
	* @param onError - Callback when playback errors.
	* @param ignoreParamIds - The ids to be ignored.
	* @param loop - Whether the motion should loop. Overrides Cubism 3/4/5 motion JSON loop metadata when specified.
	* @return Promise that resolves with true if the motion is successfully started, false otherwise.
	*/
	startMotion(e, t) {
		return x(this, arguments, function* (e, t, n = I.NORMAL, { sound: r = void 0, volume: i = ht, expression: a = void 0, resetExpression: o = !0, onFinish: s, onError: c, ignoreParamIds: l = [], loop: u = void 0 } = {}) {
			if (this.destroyed || !this.state.reserve(e, t, n) || this.currentAudio && this.currentAudio.isPlaying && n != I.FORCE) return !1;
			let d = this.getMotionDefinition(e, t);
			if (!d) return !1;
			this.currentAudio && R.dispose(this.currentAudio);
			let f, p, m = r && r.startsWith("data:");
			if (r && !m) {
				let e = document.createElement("a");
				e.href = r, r = e.href, p = r;
			} else p = this.getSoundFile(d), p &&= this.settings.resolveURL(p);
			let h = p;
			if (h) try {
				f = yield R.add(h, (e, t = this) => {
					F.error(this.tag, "Error during audio playback:", e), c?.(e), o && a && t.expressionManager && t.expressionManager.resetExpression(), t.currentAudio = void 0;
				}), f && this.initializeAudio(f, i);
			} catch (e) {
				F.warn(this.tag, "Failed to create audio", p, e);
			}
			let g = yield this.loadMotion(e, t);
			if (f && P.motionSync) try {
				R.play(f, (e = this) => {
					s?.(), o && a && e.expressionManager && e.expressionManager.resetExpression(), e.currentAudio = void 0;
				});
			} catch (e) {
				F.warn(this.tag, "Failed to play audio", f.url, e);
			}
			return this.state.start(g, e, t, n) ? (this.state.shouldOverrideExpression() && this.expressionManager && this.expressionManager.resetExpression(), F.log(this.tag, "Start motion:", this.getMotionName(d)), this.emit("motionStart", e, t, f), a && this.expressionManager && this.state.shouldOverrideExpression() && (yield this.expressionManager.setExpression(a)), this.playing = !0, g && this._startMotion(g, void 0, l, u), !0) : (f && (R.dispose(f), this.currentAudio = void 0), !1);
		});
	}
	/**
	* Starts a random Motion as given priority.
	* @param group - The motion group.
	* @param priority - The priority to be applied. Default: IDLE (1).
	* @param sound - The audio url or base64 content.
	* @param volume - Volume of the sound (0-1).
	* @param expression - Expression to apply while playing sound.
	* @param resetExpression - Whether to reset the expression before and after playing sound (default: true).
	* @param crossOrigin - Cross origin setting.
	* @param onFinish - Callback when playback finishes.
	* @param onError - Callback when playback errors.
	* @param loop - Whether the motion should loop. Overrides Cubism 3/4/5 motion JSON loop metadata when specified.
	* @return Promise that resolves with true if the motion is successfully started, false otherwise.
	*/
	startRandomMotion(e, t) {
		return x(this, arguments, function* (e, t, { sound: n, volume: r = ht, expression: i, resetExpression: a = !0, onFinish: o, onError: s, loop: c = void 0 } = {}) {
			if (this.destroyed) return !1;
			let l = this.definitions?.[e];
			if (l?.length) {
				let u = [], d = this.motionGroups[e] ?? [];
				for (let t = 0; t < l.length; t++) d[t] !== null && !this.state.isActive(e, t) && u.push(t);
				if (u.length) {
					let l = u[Math.floor(Math.random() * u.length)];
					return this.startMotion(e, l, t, {
						sound: n,
						volume: r,
						expression: i,
						resetExpression: a,
						onFinish: o,
						onError: s,
						loop: c
					});
				}
			}
			return !1;
		});
	}
	/**
	* Stops current audio playback and lipsync.
	*/
	stopSpeaking() {
		this.currentAudio &&= (R.dispose(this.currentAudio), void 0);
	}
	/**
	* Stops all playing motions as well as the sound.
	*/
	stopAllMotions() {
		this._stopAllMotions(), this.state.reset(), this.stopSpeaking();
	}
	/**
	* Updates parameters of the core model.
	* @param model - The core model.
	* @param now - Current time in milliseconds.
	* @return True if the parameters have been actually updated.
	*/
	update(e, t) {
		var n;
		return this.isFinished() && (this.playing && (this.playing = !1, this.emit("motionFinish")), this.state.shouldOverrideExpression() && ((n = this.expressionManager) == null || n.restoreExpression()), this.state.complete(), this.state.shouldRequestIdleMotion() && this.startRandomMotion(this.groups.idle, I.IDLE)), this.updateParameters(e, t);
	}
	/**
	* Move the mouth for lipsync.
	* @returns The current lipsync value.
	*/
	mouthSync() {
		return this.currentAnalyzer ? R.analyze(this.currentAnalyzer) : 0;
	}
	/**
	* Destroys the instance and releases all resources.
	* @emits {@link MotionManagerEvents.destroy}
	*/
	destroy() {
		var e;
		this.destroyed = !0, this.emit("destroy"), this.stopAllMotions(), (e = this.expressionManager) == null || e.destroy();
		let t = this;
		t.definitions = void 0, t.motionGroups = void 0;
	}
	/**
	* Loads a motion and applies the given expression with FORCE priority.
	* @param group - The motion group.
	* @param index - The motion index.
	* @param expression - Expression to apply (optional).
	* @returns The loaded motion, or null if not started.
	* @protected
	*/
	getMotionAndApplyExpression(e, t, n) {
		return x(this, null, function* () {
			if (this.destroyed || !this.state.reserve(e, t, I.FORCE)) return null;
			let r = this.getMotionDefinition(e, t);
			if (!r) return null;
			this.currentAudio && R.dispose(this.currentAudio);
			let i = yield this.loadMotion(e, t);
			return this.state.start(i, e, t, I.FORCE) ? (this.state.shouldOverrideExpression() && this.expressionManager && this.expressionManager.resetExpression(), F.log(this.tag, "Start motion:", this.getMotionName(r)), this.emit("motionStart", e, t, void 0), n && this.expressionManager && this.state.shouldOverrideExpression() && (yield this.expressionManager.setExpression(n)), i) : null;
		});
	}
	getMotionDefinition(e, t) {
		let n = this.definitions?.[e]?.[t];
		return n || F.warn(this.tag, `Undefined motion at "${e}"[${t}]`), n;
	}
};
function Dt(e, t) {
	e.a = t, e.b = 0, e.c = 0, e.d = t;
}
function Ot(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) typeof r == "number" && t.push([n, r]);
	return t;
}
function kt(e, t, n, r) {
	let i = re({
		width: 2,
		height: 2
	}, r), a = i.width ?? 2, o = i.height ?? 2;
	e.identity(), e.scale(a / 2, o / 2);
	let s = t * e.a, c = n * e.d, l = i.x !== void 0 && i.x - a / 2 || i.centerX !== void 0 && i.centerX || i.left !== void 0 && i.left - a / 2 || i.right !== void 0 && i.right + a / 2 || 0, u = i.y !== void 0 && i.y - o / 2 || i.centerY !== void 0 && i.centerY || i.top !== void 0 && i.top - o / 2 || i.bottom !== void 0 && i.bottom + o / 2 || 0;
	return e.translate(s * l, -c * u), {
		width: s,
		height: c
	};
}
function At(e, t) {
	return 2 * t * e.scale;
}
function jt(e) {
	return 2 * e.scale;
}
function Mt(e, t, n) {
	e.scale = n / (2 * t);
}
function Nt(e, t) {
	e.scale = t / 2;
}
function Pt(e, t) {
	e.x = t;
}
function Ft(e, t) {
	e.y = t;
}
function It(e, t, n) {
	Pt(e, n - At(e, t) / 2);
}
function Lt(e, t) {
	Ft(e, t - jt(e) / 2);
}
function Rt(e, t, n) {
	Pt(e, n - At(e, t));
}
function zt(e, t) {
	Ft(e, t - jt(e));
}
function Bt(e, t, n, r) {
	if (t <= 0 || n <= 0) return e.identity(), {
		width: 0,
		height: 0
	};
	let i = Ot(r), a = t / n, o = {
		scale: 1,
		x: 0,
		y: 0
	};
	for (let [e, t] of i) e === "width" ? Mt(o, a, t) : e === "height" && Nt(o, t);
	for (let [e, t] of i) e === "x" ? Pt(o, t) : e === "y" ? Ft(o, t) : e === "centerX" ? It(o, a, t) : e === "centerY" ? Lt(o, t) : e === "top" ? Ft(o, t) : e === "bottom" ? zt(o, t) : e === "left" ? Pt(o, t) : e === "right" && Rt(o, a, t);
	let s = n / 2, c = 2 * a / 2;
	return e.identity(), Dt(e, o.scale), e.tx = s * (o.x + c) - t * o.scale / 2, e.ty = s * (1 - o.y) - n * o.scale / 2, {
		width: t * o.scale,
		height: n * o.scale
	};
}
function Vt(e, t) {
	if (!Array.isArray(e)) return [];
	let n = [];
	for (let r of e) {
		if (!r || typeof r != "object") continue;
		let e = r, i = typeof e.id == "string" ? e.id : typeof e.Id == "string" ? e.Id : void 0, a = typeof e.name == "string" ? e.name : typeof e.Name == "string" ? e.Name : void 0;
		i && a && n.push({
			id: i,
			name: a,
			index: t(i)
		});
	}
	return n;
}
var Ht = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}, Ut = class extends n {
	constructor() {
		/**
		* Flags this instance has been destroyed.
		*/
		super(...arguments), b(this, "focusController", new ft()), b(this, "pose"), b(this, "physics"), b(this, "originalWidth", 0), b(this, "originalHeight", 0), b(this, "width", 0), b(this, "height", 0), b(this, "localTransform", new a()), b(this, "drawingMatrix", new a()), b(this, "hitAreas", {}), b(this, "textureFlipY", !1), b(this, "viewport", [
			0,
			0,
			0,
			0
		]), b(this, "destroyed", !1);
	}
	/**
	* Should be called in the constructor of derived class.
	*/
	init() {
		this.setupLayout(), this.setupHitAreas();
	}
	/**
	* Sets up the model's size and local transform by the model's layout.
	*/
	setupLayout() {
		let e = this, t = this.getSize();
		e.originalWidth = t[0], e.originalHeight = t[1];
		let n = kt(this.localTransform, this.originalWidth, this.originalHeight, this.getLayout());
		e.width = n.width, e.height = n.height;
	}
	/**
	* Sets up the hit areas by their definitions in settings.
	*/
	setupHitAreas() {
		let e = this.getHitAreaDefs();
		this.hitAreas = {};
		for (let t of e) t.name && (this.hitAreas[t.name] = t);
	}
	/**
	* Hit-test on the model.
	* @param x - Position in model canvas.
	* @param y - Position in model canvas.
	* @return The names of the *hit* hit areas. Can be empty if none is hit.
	*/
	hitTest(e, t) {
		return Object.keys(this.hitAreas).filter((n) => this.isHit(n, e, t));
	}
	/**
	* Hit-test for a single hit area.
	* @param hitAreaName - The hit area's name.
	* @param x - Position in model canvas.
	* @param y - Position in model canvas.
	* @return True if hit.
	*/
	isHit(e, t, n) {
		let r = this.hitAreas[e];
		if (!r) return !1;
		let i = r.index;
		if (i < 0) {
			if (!r.id || (i = this.getDrawableIndex(r.id), i < 0)) return !1;
			r.index = i;
		}
		let a = this.getDrawableBounds(i, Ht);
		return a.x <= t && t <= a.x + a.width && a.y <= n && n <= a.y + a.height;
	}
	/**
	* Gets a drawable's bounds.
	* @param index - Index of the drawable.
	* @param bounds - Object to store the output values.
	* @return The bounds in model canvas space.
	*/
	getDrawableBounds(e, t) {
		let n = this.getDrawableVertices(e), r = n[0], i = n[0], a = n[1], o = n[1];
		for (let e = 0; e < n.length; e += 2) {
			let t = n[e], s = n[e + 1];
			r = Math.min(t, r), i = Math.max(t, i), a = Math.min(s, a), o = Math.max(s, o);
		}
		return t ??= {}, t.x = r, t.y = a, t.width = i - r, t.height = o - a, t;
	}
	/**
	* Updates the model's transform.
	* @param transform - The world transform.
	*/
	updateTransform(e) {
		this.drawingMatrix.copyFrom(e).append(this.localTransform);
	}
	/**
	* Updates the model's parameters.
	* @param dt - Elapsed time in milliseconds from last frame.
	* @param _now - Current time in milliseconds.
	*/
	update(e, t) {
		this.focusController.update(e);
	}
	/**
	* Destroys the model and all related resources.
	* @emits {@link `InternalModelEvents.destroy` | destroy}
	*/
	destroy() {
		this.destroyed = !0, this.emit("destroy"), this.motionManager.destroy(), this.motionManager = void 0, this.parallelMotionManager.forEach((e) => e.destroy()), this.parallelMotionManager = [];
	}
	/**
	* Updates all active motions for the model and emits lifecycle events.
	*
	* This method coordinates the update cycle for both primary and parallel motion managers,
	* ensuring all animations are synchronized with the current timestamp. It emits events
	* before and after the update process, allowing external listeners to hook into the motion
	* lifecycle. The return value indicates whether any motion was actively updated during this cycle.
	*
	* @param {object} model - The model instance to apply motion updates to.
	* @param {number} now - The current timestamp (in milliseconds) used to calculate motion progress.
	* @returns {boolean} Returns `true` if any motion (primary or parallel) was updated; `false` otherwise.
	*
	* @emits beforeMotionUpdate - Triggered before any motion updates are processed.
	* @emits afterMotionUpdate - Triggered after all motion updates are completed.
	*
	*/
	updateMotions(e, t) {
		this.emit("beforeMotionUpdate");
		let n = this.motionManager.update(e, t), r = this.parallelMotionManager.map((n) => n.update(e, t)), i = n || r.reduce((e, t) => e || t, !1);
		return this.emit("afterMotionUpdate"), i;
	}
}, Wt = "XHRLoader", Gt = class extends Error {
	constructor(e, t, n, r = !1) {
		super(e), this.url = t, this.status = n, this.aborted = r;
	}
}, Kt = class e {
	/**
	* Creates a managed XHR.
	* @param target - If provided, the XHR will be canceled when receiving an "destroy" event from the target.
	* @param url - The URL.
	* @param type - The XHR response type.
	* @param onload - Load listener.
	* @param onerror - Error handler.
	*/
	static createXHR(t, n, r, i, a) {
		let o = new XMLHttpRequest();
		if (e.allXhrSet.add(o), t) {
			let n = e.xhrMap.get(t);
			n ? n.add(o) : (n = /* @__PURE__ */ new Set([o]), e.xhrMap.set(t, n));
		}
		return o.open("GET", n), o.responseType = r, o.onload = () => {
			var e;
			(o.status === 200 || o.status === 0) && o.response ? i(o.response) : (e = o.onerror) == null || e.call(o, new ProgressEvent("error"));
		}, o.onerror = () => {
			F.warn(Wt, `Failed to load resource as ${o.responseType} (Status ${o.status}): ${n}`), a(new Gt("Network error.", n, o.status));
		}, o.onabort = () => a(new Gt("Aborted.", n, o.status, !0)), o.onloadend = () => {
			var n;
			e.allXhrSet.delete(o), t && ((n = e.xhrMap.get(t)) == null || n.delete(o));
		}, o;
	}
	/**
	* Cancels all XHRs related to this target.
	*/
	static cancelXHRs() {
		var t;
		(t = e.xhrMap.get(this)) == null || t.forEach((t) => {
			t.abort(), e.allXhrSet.delete(t);
		}), e.xhrMap.delete(this);
	}
	/**
	* Release all XHRs.
	*/
	static release() {
		e.allXhrSet.forEach((e) => e.abort()), e.allXhrSet.clear(), e.xhrMap = /* @__PURE__ */ new WeakMap();
	}
};
/**
* Middleware for Live2DLoader.
*/
b(Kt, "xhrMap", /* @__PURE__ */ new WeakMap()), b(Kt, "allXhrSet", /* @__PURE__ */ new Set()), b(Kt, "loader", (e) => new Promise((t, n) => {
	let r = e.target, i = e.target && typeof Kt.cancelXHRs == "function" ? Kt.cancelXHRs.bind(e.target) : void 0, a = Kt.createXHR(e.target, e.settings ? e.settings.resolveURL(e.url) : e.url, e.type, (n) => {
		e.result = n, t();
	}, n);
	if (e.target && i && typeof r.listeners == "function" && typeof r.once == "function") {
		let e = r.listeners("destroy");
		(!Array.isArray(e) || !e.includes(i)) && r.once("destroy", i);
	}
	a.send();
}));
var qt = Kt;
function Jt(e, t) {
	let n = -1;
	return r(0);
	function r(i, a) {
		if (a) return Promise.reject(a);
		if (i <= n) return Promise.reject(/* @__PURE__ */ Error("next() called multiple times"));
		n = i;
		let o = e[i];
		if (!o) return Promise.resolve();
		try {
			return Promise.resolve(o(t, r.bind(null, i + 1)));
		} catch (e) {
			let t = e instanceof Error ? e : Error(String(e));
			return Promise.reject(t);
		}
	}
}
var Yt = class {
	/**
	* Loads a resource.
	* @return Promise that resolves with the loaded data in a format that's consistent with the specified `type`.
	*/
	static load(e) {
		return x(this, null, function* () {
			return yield Jt(this.middlewares, e), e.result;
		});
	}
};
b(Yt, "middlewares", [qt.loader]);
var Xt = class e extends pt {
	constructor(t) {
		if (super(t), b(this, "moc"), b(this, "textures"), b(this, "layout"), b(this, "hitAreas"), b(this, "initParams"), b(this, "initOpacities"), b(this, "expressions"), b(this, "motions", {}), !e.isValidJSON(t)) throw TypeError("Invalid JSON.");
		this.moc = t.model, nt("string", t, this, "textures", "textures"), this.copy(t);
	}
	/**
	* Checks if a JSON object is valid model settings.
	* @param json
	*/
	static isValidJSON(e) {
		if (!e || typeof e != "object") return !1;
		let t = Array.isArray(e.textures) ? e.textures.every((e) => typeof e == "string") : !1;
		return typeof e.model == "string" && t;
	}
	/**
	* Validates and copies *optional* properties from raw JSON.
	*/
	copy(e) {
		tt("string", e, this, "name", "name"), tt("string", e, this, "pose", "pose"), tt("string", e, this, "physics", "physics"), tt("object", e, this, "layout", "layout"), tt("object", e, this, "motions", "motions"), nt("object", e, this, "hit_areas", "hitAreas"), nt("object", e, this, "expressions", "expressions"), nt("object", e, this, "init_params", "initParams"), nt("object", e, this, "init_opacities", "initOpacities");
		let t = this.getFileStem(this.moc);
		this.setModelName(this.name, t);
	}
	replaceFiles(e) {
		super.replaceFiles(e);
		for (let [t, n] of Object.entries(this.motions)) for (let r = 0; r < n.length; r++) n[r].file = e(n[r].file, `motions.${t}[${r}].file`), n[r].sound !== void 0 && (n[r].sound = e(n[r].sound, `motions.${t}[${r}].sound`));
		if (this.expressions) for (let t = 0; t < this.expressions.length; t++) this.expressions[t].file = e(this.expressions[t].file, `expressions[${t}].file`);
	}
}, Zt = .5, Qt = 4096;
function $t({ lod: e, effectiveScale: t, textureWidth: n, textureHeight: r, lodScaleThreshold: i, lodTextureSizeThreshold: a, lodMaxLevel: o }) {
	if (en(e) !== "single-auto" || !Number.isFinite(t) || t <= 0) return;
	let s = Math.floor(n), c = Math.floor(r);
	if (s <= 1 || c <= 1 || t >= nn(i, Zt)) return;
	let l = nn(a, Qt);
	if (Math.max(s, c) < l) return;
	let u = Math.round(Math.log2(1 / t)), d = Math.max(1, Math.floor(Math.log2(Math.max(s, c)))), f = Math.min(d, rn(o, d)), p = an(Math.max(1, u), 1, f), m = y(2, p);
	return {
		level: p,
		width: Math.max(1, Math.round(s / m)),
		height: Math.max(1, Math.round(c / m))
	};
}
function en(e) {
	return e === !1 || e === "single-auto" ? e : "full";
}
function tn(e) {
	return e === "nearest" ? "nearest" : "linear";
}
function nn(e, t) {
	return e !== void 0 && Number.isFinite(e) && e > 0 ? e : t;
}
function rn(e, t) {
	return e !== void 0 && Number.isFinite(e) && e >= 1 ? Math.floor(e) : t;
}
function an(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function on(e, t = {}) {
	let n = s.config, r = n?.crossOrigin, i = n?.preferCreateImageBitmap, a = n?.preferWorkers;
	return t.crossOrigin !== void 0 && n && (n.crossOrigin = t.crossOrigin), t.preferCreateImageBitmap === !1 && n && (n.preferCreateImageBitmap = !1, n.preferWorkers = !1), c.load({
		src: e,
		data: { autoGenerateMipmaps: en(t.lod) === "full" }
	}).catch((e) => {
		throw e instanceof Error ? e : Error("Texture loading error", { cause: e });
	}).finally(() => {
		n && (n.crossOrigin = r ?? n.crossOrigin, t.preferCreateImageBitmap === !1 && (n.preferCreateImageBitmap = i ?? n.preferCreateImageBitmap, n.preferWorkers = a ?? n.preferWorkers));
	});
}
function sn() {}
var cn = "Live2DFactory", ln = (e, t) => x(null, null, function* () {
	if (typeof e.source == "string") {
		let t = yield Yt.load({
			url: e.source,
			type: "json",
			target: e.live2dModel
		});
		t.url = typeof t.url == "string" ? t.url : e.source, e.source = t, e.live2dModel.emit("settingsJSONLoaded", t);
	}
	return t();
}), un = (e, t) => x(null, null, function* () {
	if (e.source instanceof pt) return e.settings = e.source, t();
	if (typeof e.source == "object") {
		let n = V.findRuntime(e.source);
		if (n) {
			let r = n.createModelSettings(e.source);
			return e.settings = r, e.live2dModel.emit("settingsLoaded", r), t();
		}
	}
	let n = e.source && typeof e.source.url == "string" ? e.source.url : void 0, r = V.runtimes.map((e) => e.version).join(", ");
	if (V.runtimes.length === 0) throw TypeError([
		"Unknown settings format: no Live2D runtimes registered.",
		"Import a published runtime entry before loading models (e.g. \"<package>/cubism\" for Cubism 3/4/5, \"<package>/cubism-legacy\" for Cubism 2).",
		n ? `Settings URL: ${n}` : void 0
	].filter(Boolean).join("\n"));
	let i = (() => {
		try {
			return !e.source || typeof e.source != "object" || Array.isArray(e.source) ? void 0 : Object.keys(e.source).slice(0, 30).join(", ");
		} catch {
			return;
		}
	})();
	throw TypeError([
		"Unknown settings format: no matching runtime found for the loaded settings JSON.",
		r ? `Registered runtimes (versions): ${r}` : void 0,
		i ? `Settings JSON keys: ${i}` : void 0,
		n ? `Settings URL: ${n}` : void 0
	].filter(Boolean).join("\n"));
}), dn = (e, t) => {
	if (e.settings) {
		let n = V.findRuntime(e.settings);
		if (n) return n.ready().then(() => t());
	}
	return t();
}, fn = (e, t) => x(null, null, function* () {
	yield t();
	let n = e.internalModel;
	if (n) {
		let t = e.settings, r = V.findRuntime(t);
		if (r) {
			let i = [], a = t instanceof Xt ? "json" : "arraybuffer";
			t.pose && i.push(Yt.load({
				settings: t,
				url: t.pose,
				type: a,
				target: n
			}).then((t) => {
				n.pose = r.createPose(n.coreModel, t), e.live2dModel.emit("poseLoaded", n.pose);
			}).catch((t) => {
				e.live2dModel.emit("poseLoadError", t), F.warn(cn, "Failed to load pose.", t);
			})), t.physics && i.push(Yt.load({
				settings: t,
				url: t.physics,
				type: a,
				target: n
			}).then((t) => {
				n.physics = r.createPhysics(n.coreModel, t), e.live2dModel.emit("physicsLoaded", n.physics);
			}).catch((t) => {
				e.live2dModel.emit("physicsLoadError", t), F.warn(cn, "Failed to load physics.", t);
			})), i.length && (yield Promise.all(i));
		}
	}
}), pn = (e, t) => x(null, null, function* () {
	if (e.settings) {
		let n = e.live2dModel, r = re({ crossOrigin: e.options.crossOrigin }, e.options.textureOptions);
		e.settings instanceof Xt && (r.preferCreateImageBitmap = !1);
		let i = Promise.all(e.settings.textures.map((t) => on(e.settings.resolveURL(t), r)));
		if (i.catch(sn), yield t(), e.internalModel) n.internalModel = e.internalModel, n.emit("modelLoaded", e.internalModel);
		else throw TypeError("Missing internal model.");
		n.textures = yield i, n.emit("textureLoaded", n.textures);
	} else throw TypeError("Missing settings.");
}), mn = (e, t) => x(null, null, function* () {
	let n = e.settings;
	if (n instanceof pt) {
		let r = V.findRuntime(n);
		if (!r) throw TypeError("Unknown model settings.");
		let i = yield Yt.load({
			settings: n,
			url: n.moc,
			type: "arraybuffer",
			target: e.live2dModel
		});
		if (!r.isValidMoc(i)) throw Error("Invalid moc data");
		let a = r.createCoreModel(i);
		return e.internalModel = r.createInternalModel(a, n, e.options), t();
	}
	throw TypeError("Missing settings.");
}), z = class e {
	/**
	* Resolves the path of a resource file to the object URL.
	* @param settingsURL - Object URL of the settings file.
	* @param filePath - Resource file path.
	* @return Resolved object URL.
	*/
	static resolveURL(t, n) {
		let r = e.filesMap[t]?.[n];
		if (r === void 0) throw Error("Cannot find this file from uploaded files: " + n);
		return r;
	}
	/**
	* Consumes the files by storing their object URLs. Files not defined in the settings will be ignored.
	*/
	static upload(t, n) {
		let r = {};
		for (let e of n.getDefinedFiles()) {
			let i = decodeURI(st(n.url, e)), a = t.find((e) => e.webkitRelativePath === i);
			a && (r[e] = URL.createObjectURL(a));
		}
		e.filesMap[n._objectURL] = r;
	}
	/**
	* Creates a ModelSettings by given files.
	* @return Promise that resolves with the created ModelSettings.
	*/
	static createSettings(t) {
		return x(this, null, function* () {
			let n = t.find((e) => e.name.endsWith("model.json") || e.name.endsWith("model3.json"));
			if (!n) throw TypeError("Settings file not found");
			let r = yield e.readText(n), i = JSON.parse(r);
			i.url = n.webkitRelativePath;
			let a = V.findRuntime(i);
			if (!a) throw Error("Unknown settings JSON");
			let o = a.createModelSettings(i);
			return o._objectURL = URL.createObjectURL(n), o;
		});
	}
	/**
	* Reads a file as text in UTF-8.
	*/
	static readText(e) {
		return x(this, null, function* () {
			return new Promise((t, n) => {
				let r = new FileReader();
				r.onload = () => t(r.result), r.onerror = n, r.readAsText(e, "utf8");
			});
		});
	}
};
/**
* Middleware for Live2DFactory.
*/
b(z, "live2dFactory"), b(z, "filesMap", {}), b(z, "factory", (e, t) => x(null, null, function* () {
	if (Array.isArray(e.source) && e.source[0] instanceof File) {
		let t = e.source, n = t.settings;
		if (!n) n = yield z.createSettings(t);
		else if (!n._objectURL) throw Error("\"_objectURL\" must be specified in ModelSettings");
		n.validateFiles(t.map((e) => encodeURI(e.webkitRelativePath))), z.upload(t, n), n.resolveURL = function(e) {
			return z.resolveURL(this._objectURL, e);
		}, e.source = n, e.live2dModel.once("modelLoaded", (e) => {
			e.once("destroy", function() {
				let e = this.settings._objectURL;
				if (URL.revokeObjectURL(e), z.filesMap[e]) for (let t of Object.values(z.filesMap[e])) URL.revokeObjectURL(t);
				delete z.filesMap[e];
			});
		});
	}
	return t();
}));
var hn = z, B = class e {
	/**
	* Registers a Live2DRuntime.
	*/
	static registerRuntime(t) {
		e.runtimes.push(t), e.runtimes.sort((e, t) => t.version - e.version);
	}
	/**
	* Finds a runtime that matches given source.
	* @param source - Either a settings JSON object or a ModelSettings instance.
	* @return The Live2DRuntime, or undefined if not found.
	*/
	static findRuntime(t) {
		for (let n of e.runtimes) if (n.test(t)) return n;
	}
	/**
	* Sets up a Live2DModel, populating it with all defined resources.
	* @param live2dModel - The Live2DModel instance.
	* @param source - Can be one of: settings file URL, settings JSON object, ModelSettings instance.
	* @param options - Options for the process.
	* @return Promise that resolves when all resources have been loaded, rejects when error occurs.
	*/
	static setupLive2DModel(t, n, r) {
		return x(this, null, function* () {
			let i = new Promise((e) => t.once("textureLoaded", e)), a = new Promise((e) => t.once("modelLoaded", e)), o = Promise.all([i, a]).then(() => t.emit("ready"));
			yield Jt(e.live2DModelMiddlewares, {
				live2dModel: t,
				source: n,
				options: r || {}
			}), yield o, t.emit("load");
		});
	}
	/**
	* Loads a Motion and registers the task to {@link motionTasksMap}. The task will be automatically
	* canceled when its owner - the MotionManager instance - has been destroyed.
	* @param motionManager - MotionManager that owns this Motion.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @return Promise that resolves with the Motion, or with undefined if it can't be loaded.
	*/
	static loadMotion(t, n, r) {
		let i = (e) => t.emit("motionLoadError", n, r, e);
		try {
			let a = t.definitions[n]?.[r];
			if (!a) return Promise.resolve(void 0);
			t.once("destroy", () => e.releaseMotionTasks(t));
			let o = e.motionTasksMap.get(t);
			o || (o = {}, e.motionTasksMap.set(t, o));
			let s = o[n];
			s || (s = [], o[n] = s);
			let c = t.getMotionFile(a);
			return s[r] ?? (s[r] = Yt.load({
				url: c,
				settings: t.settings,
				type: t.motionDataType,
				target: t
			}).then((i) => {
				let o = e.motionTasksMap.get(t)?.[n];
				o && (o[r] = void 0);
				let s = i, c = t.createMotion(s, n, a);
				return t.emit("motionLoaded", n, r, c), c;
			}).catch((e) => {
				F.warn(t.tag, `Failed to load motion: ${c}
`, e), i(e);
			})), s[r];
		} catch (e) {
			F.warn(t.tag, `Failed to load motion at "${n}"[${r}]
`, e), i(e);
		}
		return Promise.resolve(void 0);
	}
	/**
	* Loads an Expression and registers the task to {@link expressionTasksMap}. The task will be automatically
	* canceled when its owner - the ExpressionManager instance - has been destroyed.
	* @param expressionManager - ExpressionManager that owns this Expression.
	* @param index - Index of the Expression.
	* @return Promise that resolves with the Expression, or with undefined if it can't be loaded.
	*/
	static loadExpression(t, n) {
		let r = (e) => t.emit("expressionLoadError", n, e);
		try {
			let i = t.definitions[n];
			if (!i) return Promise.resolve(void 0);
			t.once("destroy", () => e.releaseExpressionTasks(t));
			let a = e.expressionTasksMap.get(t);
			a || (a = [], e.expressionTasksMap.set(t, a));
			let o = t.getExpressionFile(i), s = t.expressionDataType ?? "json";
			return a[n] ?? (a[n] = Yt.load({
				url: o,
				settings: t.settings,
				type: s,
				target: t
			}).then((r) => {
				let a = e.expressionTasksMap.get(t);
				a && (a[n] = void 0);
				let o = r, s = t.createExpression(o, i);
				return t.emit("expressionLoaded", n, s), s;
			}).catch((e) => {
				F.warn(t.tag, `Failed to load expression: ${o}
`, e), r(e);
			})), a[n];
		} catch (e) {
			F.warn(t.tag, `Failed to load expression at [${n}]
`, e), r(e);
		}
		return Promise.resolve(void 0);
	}
	static releaseMotionTasks(t) {
		e.motionTasksMap.delete(t);
	}
	static releaseExpressionTasks(t) {
		e.expressionTasksMap.delete(t);
	}
};
/**
* Load tasks of each expression.
*/
b(B, "runtimes", []), b(B, "urlToJSON", ln), b(B, "jsonToSettings", un), b(B, "waitUntilReady", dn), b(B, "setupOptionals", fn), b(B, "setupEssentials", pn), b(B, "createInternalModel", mn), b(B, "live2DModelMiddlewares", [
	hn.factory,
	ln,
	un,
	dn,
	fn,
	pn,
	mn
]), b(B, "motionTasksMap", /* @__PURE__ */ new WeakMap()), b(B, "expressionTasksMap", /* @__PURE__ */ new WeakMap());
var V = B;
Et.prototype._loadMotion = function(e, t) {
	return V.loadMotion(this, e, t);
}, ct.prototype._loadExpression = function(e) {
	return V.loadExpression(this, e);
}, hn.live2dFactory = V;
var gn = class e {
	constructor(t, { autoUpdate: n = !0, autoHitTest: r = !0, autoFocus: i = !0, autoInteract: a, ticker: o } = {}) {
		b(this, "model"), b(this, "destroyed", !1), b(this, "_ticker"), b(this, "_autoUpdate", !1), b(this, "_autoHitTest", !1), b(this, "_autoFocus", !1), o ??= e.defaultTicker ?? (typeof PIXI < "u" ? PIXI.Ticker.shared : p.shared), a !== void 0 && (r = a, i = a, F.warn(t.tag, "options.autoInteract is deprecated since v0.5.0, use autoHitTest and autoFocus instead.")), this.model = t, this.ticker = o, this.autoUpdate = n, this.autoHitTest = r, this.autoFocus = i, (r || i) && (this.model.eventMode = "static");
	}
	get ticker() {
		return this._ticker;
	}
	set ticker(e) {
		var t, n;
		this._ticker && this._ticker.remove(vn, this), this._ticker = e, this._autoUpdate && ((t = this._ticker) == null || t.add(vn, this), (n = this._ticker) == null || n.start());
	}
	/**
	* @see {@link AutomatorOptions.autoUpdate}
	*/
	get autoUpdate() {
		return this._autoUpdate;
	}
	set autoUpdate(e) {
		var t;
		this.destroyed || (e ? this._ticker ? (this._ticker.add(vn, this), this._autoUpdate = !0) : F.warn(this.model.tag, "No Ticker to be used for automatic updates. Either set option.ticker when creating Live2DModel, or expose PIXI to global scope (window.PIXI = PIXI).") : ((t = this._ticker) == null || t.remove(vn, this), this._autoUpdate = !1));
	}
	/**
	* @see {@link AutomatorOptions.autoHitTest}
	*/
	get autoHitTest() {
		return this._autoHitTest;
	}
	set autoHitTest(e) {
		e !== this.autoHitTest && (e ? this.model.on("pointertap", yn, this) : this.model.off("pointertap", yn, this), this._autoHitTest = e);
	}
	/**
	* @see {@link AutomatorOptions.autoFocus}
	*/
	get autoFocus() {
		return this._autoFocus;
	}
	set autoFocus(e) {
		e !== this.autoFocus && (e ? (this.model.on("globalpointermove", bn, this), this.model.on("pointermove", bn, this)) : (this.model.off("globalpointermove", bn, this), this.model.off("pointermove", bn, this)), this._autoFocus = e);
	}
	/**
	* @see {@link AutomatorOptions.autoInteract}
	*/
	get autoInteract() {
		return this._autoHitTest && this._autoFocus;
	}
	set autoInteract(e) {
		this.autoHitTest = e, this.autoFocus = e;
	}
	onTickerUpdate() {
		let e = this.ticker.deltaMS;
		this.model.update(e);
	}
	onTap(e) {
		this.model.tap(e.global.x, e.global.y);
	}
	onPointerMove(e) {
		this.model.focus(e.global.x, e.global.y);
	}
	destroy() {
		this.autoFocus = !1, this.autoHitTest = !1, this.autoUpdate = !1, this.ticker = void 0, this.destroyed = !0;
	}
};
b(gn, "defaultTicker");
var _n = gn;
function vn() {
	this.onTickerUpdate();
}
function yn(e) {
	this.onTap(e);
}
function bn(e) {
	this.onPointerMove(e);
}
var xn = class extends l {}, H = new e(), Sn = new a(), Cn = new a(), wn = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}, Tn = new r(), En = !1, Dn = class {
	constructor(e) {
		this.renderer = e;
	}
	addPrepare(e, t) {
		var n, r;
		(r = (n = this.renderer.renderPipes.batch)?.break) == null || r.call(n, t), t.add({
			renderPipeId: "live2d",
			action: "prepare",
			canBundle: !1,
			prepare: e
		});
	}
	addRenderable(e, t) {
		var n, r;
		(r = (n = this.renderer.renderPipes.batch)?.break) == null || r.call(n, t), t.add(e);
	}
	execute(e) {
		if (!(e instanceof Nn)) {
			e.prepare();
			return;
		}
		let t = e;
		!t.visible || t.alpha <= 0 || t.renderLive2D(this.renderer);
	}
	updateRenderable() {}
	destroyRenderable() {}
	validateRenderable() {
		return !1;
	}
	destroy() {}
};
b(Dn, "extension", {
	type: [t.WebGLPipes],
	name: "live2d"
});
var On = Dn;
function kn(e) {
	let t = e;
	t.renderPipes.live2d || (En || (En = !0, console.warn("[untitled-pixi-live2d-engine] Lazy Live2D render pipe registration is deprecated. Register Live2DPlugin explicitly with `extensions.add(Live2DPlugin)` before creating the Pixi renderer.")), t.renderPipes.live2d = new Dn(e));
}
function An(e) {
	return Math.max(Math.hypot(e.a, e.b), Math.hypot(e.c, e.d));
}
function jn(e) {
	if (!e || typeof e != "object") return !1;
	let { width: t, height: n } = e;
	return typeof t == "number" && t > 0 && typeof n == "number" && n > 0;
}
function Mn(e, t, n, r, a) {
	let s = e.source.resource;
	if (!jn(s)) return;
	let c = o.get().createCanvas(n, r), l = c.getContext("2d");
	if (!l) return;
	try {
		l.clearRect(0, 0, n, r), l.imageSmoothingEnabled = a !== "nearest", "imageSmoothingQuality" in l && a !== "nearest" && (l.imageSmoothingQuality = "high"), l.drawImage(s, 0, 0, e.source.pixelWidth, e.source.pixelHeight, 0, 0, n, r);
	} catch {
		return;
	}
	let u = `${e.label ?? e.source.label ?? "Live2DTexture"} LOD ${t}`;
	return new i({
		label: u,
		source: new d({
			resource: c,
			width: n,
			height: r,
			resolution: 1,
			scaleMode: tn(a),
			autoGenerateMipmaps: !1,
			label: u
		})
	});
}
var Nn = class extends f {
	/**
	* Creates a new Live2DModel instance.
	* @param options - Options for Live2DModel and Automator.
	*/
	constructor(e) {
		super(), b(this, "renderPipeId", "live2d"), b(this, "tag", "Live2DModel(uninitialized)"), b(this, "internalModel"), b(this, "textures", []), b(this, "textureOptions"), b(this, "anchorMode"), b(this, "textureLODStates", []), b(this, "textureLODFailures", []), b(this, "transform", new xn()), b(this, "anchor"), b(this, "_bounds", new r()), b(this, "_boundsDirty", !0), b(this, "_boundsRetryAfterDraw", !1), b(this, "gl", null), b(this, "elapsedTime", 0), b(this, "deltaTime", 0), b(this, "automator"), b(this, "currentGlId", 0), b(this, "renderLive2D", (e) => {
			if (!(e instanceof m)) throw Error("Renderer is not supported");
			e.geometry.resetState(), e.shader.resetState(), e.texture.resetState();
			let t = !1;
			this.gl !== e.gl && (this.gl = e.gl, this.internalModel.updateWebGLContext(e.gl, this.generateUID()), t = !0);
			let { projectionMatrix: n, offset: r, worldTransformMatrix: i } = e.globalUniforms.globalUniformData, a = Cn.copyFrom(i).append(this.groupTransform), o = An(a) * e.resolution;
			for (let n = 0; n < this.textures.length; n++) {
				let r = this.textures[n], i = this.resolveTextureForRender(n, r, o);
				try {
					this.uploadTextureForRender(e, i, t);
				} catch {
					if (i === r) throw Error("Failed to upload Live2D texture.");
					let a = this.textureLODStates[n];
					a?.texture === i && (this.markTextureLODFailure(n, r, a.level), this.destroyTextureLODState(n)), i = r, this.uploadTextureForRender(e, i, t);
				}
				this.internalModel.bindTexture(n, e.texture.getGlSource(i.source).texture);
			}
			let s = e.renderTarget.viewport, c = e.renderTarget.renderTarget, l = s.y;
			c?.isRoot && (l = c.colorTexture.source.pixelHeight - s.height - s.y), this.internalModel.viewport = [
				s.x,
				l,
				s.width,
				s.height
			];
			let u = this.deltaTime;
			this.deltaTime = 0, u && this.internalModel.update(u, this.elapsedTime), a.tx -= r?.x ?? 0, a.ty -= r?.y ?? 0;
			let d = Sn.copyFrom(n).append(a);
			this.internalModel.updateTransform(d), this.internalModel.draw(e.gl), this._boundsRetryAfterDraw && this.updateDrawableBounds(!0), e.state.resetState(), e.texture.resetState();
			let f = e.renderTarget?.defaultClearColor, p = e.renderTarget?.adaptor?._clearColorCache;
			f && (e.gl.clearColor(f[0], f[1], f[2], f[3]), p && (p[0] = f[0], p[1] = f[1], p[2] = f[2], p[3] = f[3]));
		}), this.textureOptions = e?.textureOptions, this.anchorMode = e?.anchorMode ?? "canvas", this.anchor = new u({ _onUpdate: () => this.onAnchorChange() }, 0, 0), this.automator = new _n(this, e), this.once("modelLoaded", () => this.initializeOnModelLoad(e));
	}
	/** @internal */
	get isRenderable() {
		return !0;
	}
	/** @internal */
	get canBundle() {
		return !1;
	}
	/**
	* Creates a Live2DModel from given source.
	* @param source - Can be one of: settings file URL, settings JSON object, ModelSettings instance.
	* @param options - Options for the creation.
	* @return Promise that resolves with the Live2DModel.
	*/
	static from(e, t) {
		return x(this, null, function* () {
			let n = new this(t);
			return yield V.setupLive2DModel(n, e, t), n;
		});
	}
	/**
	* Synchronous version of `Live2DModel.from()`. This method immediately returns a Live2DModel instance,
	* whose resources have not been loaded. Therefore, this model can't be manipulated or rendered
	* until the "load" event has been emitted.
	*
	* ```js
	* // no `await` here as it's not a Promise
	* const model = Live2DModel.fromSync('shizuku.model.json');
	*
	* // these will cause errors!
	* // app.stage.addChild(model);
	* // model.motion('tap_body');
	*
	* model.once('load', () => {
	*     // now it's safe
	*     app.stage.addChild(model);
	*     model.motion('tap_body');
	* });
	* ```
	* @param source - Model source, can be a file path, JSON object, or ModelSettings instance.
	* @param options - Options for the model creation.
	* @returns The created Live2DModel instance.
	*/
	static fromSync(e, t) {
		let n = new this(t);
		return V.setupLive2DModel(n, e, t).then(() => (t?.onLoad)?.call(t)).catch((e) => (t?.onError)?.call(t, e)), n;
	}
	/**
	* Registers the class of `PIXI.Ticker` for auto updating.
	* @deprecated Use {@link Live2DModelOptions.ticker} instead.
	* @param tickerClass - The Ticker class to be registered.
	*/
	static registerTicker(e) {
		_n.defaultTicker = e.shared;
	}
	/** @internal */
	get bounds() {
		return this.internalModel ? (this._boundsDirty && this.updateDrawableBounds(), this._bounds) : (this._bounds.set(0, 0, 0, 0), this._bounds);
	}
	updateDrawableBounds(e = !1) {
		if (!this.internalModel) {
			this._bounds.set(0, 0, 0, 0), this._boundsDirty = !1;
			return;
		}
		let t = this.internalModel.getDrawableIDs();
		Tn.clear();
		for (let e = 0; e < t.length; e++) {
			let n = t[e], r = this.internalModel.getDrawableIndex(n);
			if (r < 0) continue;
			let i = this.internalModel.getDrawableBounds(r, wn);
			Number.isFinite(i.x) && Number.isFinite(i.y) && Number.isFinite(i.width) && Number.isFinite(i.height) && Tn.addFrame(i.x, i.y, i.x + i.width, i.y + i.height, a.IDENTITY);
		}
		if (this._bounds.clear(), Tn.isValid && Tn.isPositive) this._bounds.addFrame(Tn.minX, Tn.minY, Tn.maxX, Tn.maxY, this.internalModel.localTransform), this._boundsRetryAfterDraw = !1;
		else {
			let e = this.internalModel.originalWidth || this.internalModel.width, t = this.internalModel.originalHeight || this.internalModel.height;
			this._bounds.addFrame(0, 0, e, t, this.internalModel.localTransform), this._boundsRetryAfterDraw = !0;
		}
		this._boundsDirty = !1, this._didViewChangeTick++, e && this.anchorMode === "drawable" && this.onAnchorChange();
	}
	/**
	* Updates the model and its drawable bounds before Pixi calculates filter areas.
	* Filter pipes collect their framebuffer bounds before the Live2D render pipe runs,
	* so waiting until `renderLive2D()` is too late for animated vertices.
	*/
	prepareForRender() {
		if (!this.internalModel) return;
		let e = this.deltaTime;
		this.deltaTime = 0, e && this.internalModel.update(e, this.elapsedTime), this.updateDrawableBounds();
	}
	generateUID() {
		return ++this.currentGlId;
	}
	/**
	* Insert this model into Pixi's instruction set so zIndex ordering works with other objects.
	*/
	collectRenderables(e, t, n) {
		var r, i, a, o;
		if (this.parentRenderLayer && this.parentRenderLayer !== n || this.globalDisplayStatus < 7 || !this.includeInBuild) return;
		this.sortableChildren && this.sortChildren(), kn(t);
		let s = t.renderPipes, c = () => {
			s.live2d.addRenderable(this, e);
		}, l = () => {
			let r = this.children, i = r.length;
			for (let a = 0; a < i; a++) r[a].collectRenderables(e, t, n);
		}, u = this.effects;
		if (u) {
			u.length && s.live2d.addPrepare(() => this.prepareForRender(), e);
			for (let t = 0; t < u.length; t++) {
				let n = u[t], a = n.filters;
				if (a) for (let e of a) e && typeof e.resolution == "number" && e.resolution === 1 && (e.resolution = "inherit");
				(i = (r = s[n.pipe])?.push) == null || i.call(r, n, this, e);
			}
			c(), l();
			for (let t = u.length - 1; t >= 0; t--) {
				let n = u[t];
				(o = (a = s[n.pipe])?.pop) == null || o.call(a, n, this, e);
			}
		} else c(), l();
	}
	/**
	* A handler of the "modelLoaded" event, invoked when the internal model has been loaded.
	* @protected
	* @param _options - The options used for initialization.
	*/
	initializeOnModelLoad(e) {
		this.tag = `Live2DModel(${this.internalModel.settings.name})`, this.updateDrawableBounds(!0), this.anchorMode === "canvas" && this.onAnchorChange();
	}
	/**
	* A callback that observes {@link anchor}, invoked when the anchor's values have been changed.
	* @protected
	*/
	onAnchorChange() {
		if (this.internalModel && this.pivot) {
			if (this.anchorMode === "drawable") {
				let e = this.bounds;
				this.pivot.set(e.minX + this.anchor.x * e.width, e.minY + this.anchor.y * e.height);
			} else this.pivot.set(this.anchor.x * this.internalModel.width, this.anchor.y * this.internalModel.height);
		}
	}
	/**
	* Shorthand to start a motion.
	* @param group - The motion group.
	* @param [index] - Index in the motion group.
	* @param [priority=2] - The priority to be applied. (0: No priority, 1: IDLE, 2:NORMAL, 3:FORCE)
	* @param {Object} options - Additional options for motion.
	* @param [options.sound] - The audio url to file or base64 content.
	* @param [options.volume=0.5] - Volume of the sound (0-1).
	* @param [options.expression] - In case you want to mix up an expression while playing sound (bind with Model.expression()).
	* @param [options.resetExpression=true] - Reset the expression to default after the motion is finished.
	* @param [options.onFinish] - Callback function when speaking completes.
	* @param [options.onError] - Callback function when an error occurs.
	* @param [options.loop] - Whether the motion should loop. Overrides Cubism 3/4/5 motion JSON loop metadata when specified.
	* @return Promise that resolves with true if the motion is successfully started, with false otherwise.
	*/
	motion(e, t, n) {
		return x(this, arguments, function* (e, t, n, { sound: r = void 0, volume: i = ht, expression: a = void 0, resetExpression: o = !0, onFinish: s, onError: c, loop: l = void 0 } = {}) {
			return t === void 0 ? this.internalModel.motionManager.startRandomMotion(e, n, {
				sound: r,
				volume: i,
				expression: a,
				resetExpression: o,
				onFinish: s,
				onError: c,
				loop: l
			}) : this.internalModel.motionManager.startMotion(e, t, n, {
				sound: r,
				volume: i,
				expression: a,
				resetExpression: o,
				onFinish: s,
				onError: c,
				loop: l
			});
		});
	}
	motionLastFrame(e, t) {
		return x(this, arguments, function* (e, t, { expression: n = void 0 } = {}) {
			return this.internalModel.motionManager.motionLastFrame(e, t, { expression: n });
		});
	}
	/**
	* Shorthand to start multiple motions in parallel.
	* @param motionList - The motion list, each item includes:
	*  group: The motion group,
	*  index: Index in the motion group,
	*  priority: The priority to be applied. (0: No priority, 1: IDLE, 2:NORMAL, 3:FORCE) (default: 2)
	*  ignoreParamIds: The ids to be ignored,
	*  loop: Whether the motion should loop.
	* @return Promise that resolves with a list, indicates the motion is successfully started, with false otherwise.
	*/
	parallelMotion(e) {
		return x(this, null, function* () {
			this.internalModel.extendParallelMotionManager(e.length);
			let t = e.map((e, t) => this.internalModel.parallelMotionManager[t].startMotion(e.group, e.index, e.priority, {
				ignoreParamIds: e.ignoreParamIds,
				loop: e.loop
			})), n = [];
			for (let e of t) n.push(yield e);
			return n;
		});
	}
	/**
	* Shorthand to play the last frame of multiple motions in parallel and await their completion.
	*
	* This method initiates the final frame of each specified motion concurrently,
	* leveraging the internal parallel motion manager. Each motion's completion is awaited
	* sequentially, and the results are returned as an array of success flags.
	*
	* @async
	* @param {{group: string, index: number, priority?: MotionPriority}[]} motionList - Array of motions to execute.
	* @param {string} motionList.group - Motion group identifier (e.g., "idle", "walk").
	* @param {number} motionList.index - Index within the motion group.
	* @param {MotionPriority} [motionList.priority=2] - Motion priority (0: None, 1: IDLE, 2: NORMAL, 3: FORCE).
	* @returns {Promise<boolean[]>} Resolves with an array where each boolean indicates
	*                               whether the corresponding motion completed successfully.
	*/
	parallelLastFrame(e) {
		return x(this, null, function* () {
			this.internalModel.extendParallelMotionManager(e.length);
			let t = e.map((e, t) => this.internalModel.parallelMotionManager[t].playMotionLastFrame(e.group, e.index)), n = [];
			for (let e of t) n.push(yield e);
			return n;
		});
	}
	/**
	* Stops all playing motions as well as the sound.
	*/
	stopMotions() {
		return this.internalModel.motionManager.stopAllMotions();
	}
	/**
	* Shorthand to start speaking a sound with an expression.
	* @param sound - The audio url to file or base64 content.
	* @param {Object} options - Additional options for speaking.
	* @param [options.volume] - Volume of the sound (0-1).
	* @param [options.expression] - In case you want to mix up an expression while playing sound (bind with Model.expression()).
	* @param [options.resetExpression=true] - Reset the expression to default after the motion is finished.
	* @param [options.onFinish] - Callback function when speaking completes.
	* @param [options.onError] - Callback function when an error occurs.
	* @returns Promise that resolves with true if the sound is playing, false if it's not.
	*/
	speak(e, { volume: t = ht, expression: n, resetExpression: r = !0, onFinish: i, onError: a } = {}) {
		return this.internalModel.motionManager.speak(e, {
			volume: t,
			expression: n,
			resetExpression: r,
			onFinish: i,
			onError: a
		});
	}
	/**
	* Stop current audio playback and lipsync.
	*/
	stopSpeaking() {
		return this.internalModel.motionManager.stopSpeaking();
	}
	/**
	* Shorthand to set an expression.
	* @param id - Either the index, or the name of the expression. If not presented, a random expression will be set.
	* @return Promise that resolves with true if succeeded, with false otherwise.
	*/
	expression(e) {
		return this.internalModel.motionManager.expressionManager ? e === void 0 ? this.internalModel.motionManager.expressionManager.setRandomExpression() : this.internalModel.motionManager.expressionManager.setExpression(e) : Promise.resolve(!1);
	}
	/**
	* Updates the focus position. This will not cause the model to immediately look at the position,
	* instead the movement will be interpolated.
	* @param x - Position in world space.
	* @param y - Position in world space.
	* @param instant - Should the focus position be instantly applied.
	*/
	focus(e, t, n = !1) {
		H.x = e, H.y = t, this.toModelPosition(H, H, !0);
		let r = H.x / this.internalModel.originalWidth * 2 - 1, i = H.y / this.internalModel.originalHeight * 2 - 1, a = Math.atan2(i, r);
		this.internalModel.focusController.focus(Math.cos(a), -Math.sin(a), n);
	}
	/**
	* Tap on the model. This will perform a hit-testing, and emit a "hit" event
	* if at least one of the hit areas is hit.
	* @param x - Position in world space.
	* @param y - Position in world space.
	* @emits {@link Live2DModelEvents.hit}
	*/
	tap(e, t) {
		let n = this.hitTest(e, t);
		n.length && this.emit("hit", n);
	}
	/**
	* Hit-test on the model.
	* @param x - Position in world space.
	* @param y - Position in world space.
	* @return The names of the *hit* hit areas. Can be empty if none is hit.
	*/
	hitTest(e, t) {
		return H.x = e, H.y = t, this.toModelPosition(H, H), this.internalModel.hitTest(H.x, H.y);
	}
	/**
	* Calculates the position in the canvas of original, unscaled Live2D model.
	* @param position - A Point in world space.
	* @param result - A Point to store the new value. Defaults to a new Point.
	* @param skipUpdate - True to skip the update transform.
	* @return The Point in model canvas space.
	*/
	toModelPosition(e, t = e.clone(), n) {
		return n || this.updateLocalTransform(), this.toLocal(e, void 0, t, n), this.internalModel.localTransform.applyInverse(t, t), t;
	}
	/**
	* A method required by `PIXI.InteractionManager` to perform hit-testing.
	* @param point - A Point in local space.
	* @return True if the point is inside this model.
	*/
	containsPoint(e) {
		return this.bounds.containsPoint(e.x, e.y);
	}
	/** @override
	* Calculates the bounds of the Live2DModel for rendering and interaction purposes.
	*/
	_calculateBounds() {
		if (!this.internalModel) {
			this.getBounds().set(0, 0, 0, 0);
			return;
		}
		let e = this.bounds;
		this.getBounds().addFrame(e.minX, e.minY, e.maxX, e.maxY, this.transform.matrix);
	}
	/**
	* Updates the model. Note this method just updates the timer,
	* and the actual update will be done right before rendering the model.
	* @param dt - The elapsed time in milliseconds since last frame.
	*/
	update(e) {
		this.deltaTime += e, this.elapsedTime += e;
	}
	resolveTextureForRender(e, t, n) {
		let r = $t(ie(re({}, this.textureOptions), {
			effectiveScale: n,
			textureWidth: t.source.pixelWidth,
			textureHeight: t.source.pixelHeight
		}));
		if (!r) return t;
		let i = this.textureLODFailures[e];
		if (i?.source === t && i.levels.has(r.level)) return t;
		let a = this.textureLODStates[e];
		if (a?.source === t && a.level === r.level && !a.texture.destroyed) return a.texture;
		this.destroyTextureLODState(e);
		let o = Mn(t, r.level, r.width, r.height, this.textureOptions?.lodFilter);
		return o ? (this.textureLODStates[e] = {
			source: t,
			level: r.level,
			texture: o
		}, o) : (this.markTextureLODFailure(e, t, r.level), t);
	}
	markTextureLODFailure(e, t, n) {
		let r = this.textureLODFailures[e];
		r?.source !== t && (r = {
			source: t,
			levels: /* @__PURE__ */ new Set()
		}, this.textureLODFailures[e] = r), r.levels.add(n);
	}
	destroyTextureLODState(e) {
		let t = this.textureLODStates[e];
		t && (t.texture.destroy(!0), this.textureLODStates[e] = void 0);
	}
	destroyTextureLODStates() {
		for (let e = 0; e < this.textureLODStates.length; e++) this.destroyTextureLODState(e);
		this.textureLODFailures.length = 0;
	}
	uploadTextureForRender(e, t, n) {
		let r = !!t.source._gpuData[e.uid];
		(n || !r) && (e.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, this.internalModel.textureFlipY), e.texture.bind(t, 0));
	}
	/**
	* Destroys the model and all related resources. This takes the same options and also
	* behaves the same as `PIXI.Container#destroy`.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param [options.children=false] - if set to true, all the children will have their destroy
	*  method called as well. `options` will be passed on to those calls.
	* @param [options.texture=false] - Only used for child Sprites if `options.children` is set to true
	*  Should it destroy the texture of the child sprite
	* @param [options.baseTexture=false] - Only used for child Sprites if `options.children` is set to true
	*  Should it destroy the base texture of the child sprite
	*/
	destroy(e) {
		this.emit("destroy"), this.destroyTextureLODStates(), e?.texture && this.textures.forEach((t) => t.destroy(e.baseTexture)), this.automator.destroy(), this.internalModel.destroy(), super.destroy(e);
	}
};
if (typeof window > "u" || window.Live2DCubismCore === void 0) throw Error("Could not find Cubism runtime. This plugin requires live2dcubismcore.js to be loaded.");
var U = class e {
	/**
	* コンストラクタ
	*/
	constructor(e, t) {
		this.x = e, this.y = t, this.x = e ?? 0, this.y = t ?? 0;
	}
	/**
	* ベクトルの加算
	*
	* @param vector2 加算するベクトル値
	* @return 加算結果 ベクトル値
	*/
	add(t) {
		let n = new e(0, 0);
		return n.x = this.x + t.x, n.y = this.y + t.y, n;
	}
	/**
	* ベクトルの減算
	*
	* @param vector2 減算するベクトル値
	* @return 減算結果 ベクトル値
	*/
	substract(t) {
		let n = new e(0, 0);
		return n.x = this.x - t.x, n.y = this.y - t.y, n;
	}
	/**
	* ベクトルの乗算
	*
	* @param vector2 乗算するベクトル値
	* @return 乗算結果 ベクトル値
	*/
	multiply(t) {
		let n = new e(0, 0);
		return n.x = this.x * t.x, n.y = this.y * t.y, n;
	}
	/**
	* ベクトルの乗算(スカラー)
	*
	* @param scalar 乗算するスカラー値
	* @return 乗算結果 ベクトル値
	*/
	multiplyByScaler(t) {
		return this.multiply(new e(t, t));
	}
	/**
	* ベクトルの除算
	*
	* @param vector2 除算するベクトル値
	* @return 除算結果 ベクトル値
	*/
	division(t) {
		let n = new e(0, 0);
		return n.x = this.x / t.x, n.y = this.y / t.y, n;
	}
	/**
	* ベクトルの除算(スカラー)
	*
	* @param scalar 除算するスカラー値
	* @return 除算結果 ベクトル値
	*/
	divisionByScalar(t) {
		return this.division(new e(t, t));
	}
	/**
	* ベクトルの長さを取得する
	*
	* @return ベクトルの長さ
	*/
	getLength() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	/**
	* ベクトルの距離の取得
	*
	* @param a 点
	* @return ベクトルの距離
	*/
	getDistanceWith(e) {
		return Math.sqrt((this.x - e.x) * (this.x - e.x) + (this.y - e.y) * (this.y - e.y));
	}
	/**
	* ドット積の計算
	*
	* @param a 値
	* @return 結果
	*/
	dot(e) {
		return this.x * e.x + this.y * e.y;
	}
	/**
	* 正規化の適用
	*/
	normalize() {
		let e = (this.x * this.x + this.y * this.y) ** .5;
		this.x /= e, this.y /= e;
	}
	/**
	* 等しさの確認（等しいか？）
	*
	* 値が等しいか？
	*
	* @param rhs 確認する値
	* @return true 値は等しい
	* @return false 値は等しくない
	*/
	isEqual(e) {
		return this.x == e.x && this.y == e.y;
	}
	/**
	* 等しさの確認（等しくないか？）
	*
	* 値が等しくないか？
	*
	* @param rhs 確認する値
	* @return true 値は等しくない
	* @return false 値は等しい
	*/
	isNotEqual(e) {
		return !this.isEqual(e);
	}
}, Pn;
((e) => {
	e.CubismVector2 = U;
})(Pn ||= {});
var Fn = class e {
	/**
	* 第一引数の値を最小値と最大値の範囲に収めた値を返す
	*
	* @param value 収められる値
	* @param min   範囲の最小値
	* @param max   範囲の最大値
	* @return 最小値と最大値の範囲に収めた値
	*/
	static range(e, t, n) {
		return e < t ? e = t : e > n && (e = n), e;
	}
	/**
	* サイン関数の値を求める
	*
	* @param x 角度値（ラジアン）
	* @return サイン関数sin(x)の値
	*/
	static sin(e) {
		return Math.sin(e);
	}
	/**
	* コサイン関数の値を求める
	*
	* @param x 角度値(ラジアン)
	* @return コサイン関数cos(x)の値
	*/
	static cos(e) {
		return Math.cos(e);
	}
	/**
	* 値の絶対値を求める
	*
	* @param x 絶対値を求める値
	* @return 値の絶対値
	*/
	static abs(e) {
		return Math.abs(e);
	}
	/**
	* 平方根(ルート)を求める
	* @param x -> 平方根を求める値
	* @return 値の平方根
	*/
	static sqrt(e) {
		return Math.sqrt(e);
	}
	/**
	* 立方根を求める
	* @param x -> 立方根を求める値
	* @return 値の立方根
	*/
	static cbrt(e) {
		if (e === 0) return e;
		let t = e, n = t < 0;
		n && (t = -t);
		let r;
		return t === Infinity ? r = Infinity : (r = Math.exp(Math.log(t) / 3), r = (t / (r * r) + 2 * r) / 3), n ? -r : r;
	}
	/**
	* イージング処理されたサインを求める
	* フェードイン・アウト時のイージングに利用できる
	*
	* @param value イージングを行う値
	* @return イージング処理されたサイン値
	*/
	static getEasingSine(e) {
		return e < 0 ? 0 : e > 1 ? 1 : .5 - .5 * this.cos(e * Math.PI);
	}
	/**
	* 大きい方の値を返す
	*
	* @param left 左辺の値
	* @param right 右辺の値
	* @return 大きい方の値
	*/
	static max(e, t) {
		return e > t ? e : t;
	}
	/**
	* 小さい方の値を返す
	*
	* @param left  左辺の値
	* @param right 右辺の値
	* @return 小さい方の値
	*/
	static min(e, t) {
		return e > t ? t : e;
	}
	static clamp(e, t, n) {
		return e < t ? t : n < e ? n : e;
	}
	/**
	* 角度値をラジアン値に変換する
	*
	* @param degrees   角度値
	* @return 角度値から変換したラジアン値
	*/
	static degreesToRadian(e) {
		return e / 180 * Math.PI;
	}
	/**
	* ラジアン値を角度値に変換する
	*
	* @param radian    ラジアン値
	* @return ラジアン値から変換した角度値
	*/
	static radianToDegrees(e) {
		return e * 180 / Math.PI;
	}
	/**
	* ２つのベクトルからラジアン値を求める
	*
	* @param from  始点ベクトル
	* @param to    終点ベクトル
	* @return ラジアン値から求めた方向ベクトル
	*/
	static directionToRadian(e, t) {
		let n = Math.atan2(t.y, t.x) - Math.atan2(e.y, e.x);
		for (; n < -Math.PI;) n += Math.PI * 2;
		for (; n > Math.PI;) n -= Math.PI * 2;
		return n;
	}
	/**
	* ２つのベクトルから角度値を求める
	*
	* @param from  始点ベクトル
	* @param to    終点ベクトル
	* @return 角度値から求めた方向ベクトル
	*/
	static directionToDegrees(e, t) {
		let n = this.directionToRadian(e, t), r = this.radianToDegrees(n);
		return t.x - e.x > 0 && (r = -r), r;
	}
	/**
	* ラジアン値を方向ベクトルに変換する。
	*
	* @param totalAngle    ラジアン値
	* @return ラジアン値から変換した方向ベクトル
	*/
	static radianToDirection(e) {
		let t = new U();
		return t.x = this.sin(e), t.y = this.cos(e), t;
	}
	/**
	* 三次方程式の三次項の係数が0になったときに補欠的に二次方程式の解をもとめる。
	* a * x^2 + b * x + c = 0
	*
	* @param   a -> 二次項の係数値
	* @param   b -> 一次項の係数値
	* @param   c -> 定数項の値
	* @return  二次方程式の解
	*/
	static quadraticEquation(t, n, r) {
		return this.abs(t) < e.Epsilon ? this.abs(n) < e.Epsilon ? -r : -r / n : -(n + this.sqrt(n * n - 4 * t * r)) / (2 * t);
	}
	/**
	* カルダノの公式によってベジェのt値に該当する３次方程式の解を求める。
	* 重解になったときには0.0～1.0の値になる解を返す。
	*
	* a * x^3 + b * x^2 + c * x + d = 0
	*
	* @param   a -> 三次項の係数値
	* @param   b -> 二次項の係数値
	* @param   c -> 一次項の係数値
	* @param   d -> 定数項の値
	* @return  0.0～1.0の間にある解
	*/
	static cardanoAlgorithmForBezier(t, n, r, i) {
		if (this.abs(t) < e.Epsilon) return this.range(this.quadraticEquation(n, r, i), 0, 1);
		let a = n / t, o = r / t, s = i / t, c = (3 * o - a * a) / 3, l = c / 3, u = (2 * a * a * a - 9 * a * o + 27 * s) / 27, d = u / 2, f = d * d + l * l * l, p = .5, m = .51;
		if (f < 0) {
			let e = -c / 3, t = e * e * e, n = this.sqrt(t), r = -u / (2 * n), i = this.range(r, -1, 1), o = Math.acos(i), s = 2 * this.cbrt(n), l = s * this.cos(o / 3) - a / 3;
			if (this.abs(l - p) < m) return this.range(l, 0, 1);
			let d = s * this.cos((o + 2 * Math.PI) / 3) - a / 3;
			if (this.abs(d - p) < m) return this.range(d, 0, 1);
			let f = s * this.cos((o + 4 * Math.PI) / 3) - a / 3;
			return this.range(f, 0, 1);
		}
		if (f == 0) {
			let e;
			e = d < 0 ? this.cbrt(-d) : -this.cbrt(d);
			let t = 2 * e - a / 3;
			if (this.abs(t - p) < m) return this.range(t, 0, 1);
			let n = -e - a / 3;
			return this.range(n, 0, 1);
		}
		let h = this.sqrt(f), g = this.cbrt(h - d) - this.cbrt(h + d) - a / 3;
		return this.range(g, 0, 1);
	}
	/**
	* 浮動小数点の余りを求める。
	*
	* @param dividend 被除数（割られる値）
	* @param divisor 除数（割る値）
	* @returns 余り
	*/
	static mod(e, t) {
		if (!isFinite(e) || t === 0 || isNaN(e) || isNaN(t)) return console.warn(`divided: ${e}, divisor: ${t} mod() returns 'NaN'.`), NaN;
		let n = Math.abs(e), r = Math.abs(t), i = n - Math.floor(n / r) * r;
		return i *= Math.sign(e), i;
	}
	/**
	* コンストラクタ
	*/
	constructor() {}
};
Fn.Epsilon = 1e-5;
var W = Fn, In;
((e) => {
	e.CubismMath = W;
})(In ||= {});
var Ln = class {
	/**
	* コンストラクタ
	*/
	constructor() {
		this.setBeganMotionHandler = (e) => this._onBeganMotion = e, this.getBeganMotionHandler = () => this._onBeganMotion, this.setFinishedMotionHandler = (e) => this._onFinishedMotion = e, this.getFinishedMotionHandler = () => this._onFinishedMotion, this._fadeInSeconds = -1, this._fadeOutSeconds = -1, this._weight = 1, this._offsetSeconds = 0, this._isLoop = !1, this._isLoopFadeIn = !0, this._previousLoopState = this._isLoop, this._firedEventValues = new S();
	}
	/**
	* インスタンスの破棄
	*/
	static delete(e) {
		e.release(), e = null;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._weight = 0;
	}
	/**
	* モデルのパラメータ
	* @param model 対象のモデル
	* @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
	* @param userTimeSeconds デルタ時間の積算値[秒]
	*/
	updateParameters(e, t, n) {
		if (!t.isAvailable() || t.isFinished()) return;
		this.setupMotionQueueEntry(t, n);
		let r = this.updateFadeWeight(t, n);
		this.doUpdateParameters(e, n, r, t), t.getEndTime() > 0 && t.getEndTime() < n && t.setIsFinished(!0);
	}
	/**
	* @brief モデルの再生開始処理
	*
	* モーションの再生を開始するためのセットアップを行う。
	*
	* @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
	* @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
	*/
	setupMotionQueueEntry(e, t) {
		e == null || e.isStarted() || e.isAvailable() && (e.setIsStarted(!0), e.setStartTime(t - this._offsetSeconds), e.setFadeInStartTime(t), e.getEndTime() < 0 && this.adjustEndTime(e), e._motion._onBeganMotion && e._motion._onBeganMotion(e._motion));
	}
	/**
	* @brief モデルのウェイト更新
	*
	* モーションのウェイトを更新する。
	*
	* @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
	* @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
	*/
	updateFadeWeight(e, t) {
		e ?? De.print(Ye.LogLevel_Error, "motionQueueEntry is null.");
		let n = this._weight, r = this._fadeInSeconds == 0 ? 1 : W.getEasingSine((t - e.getFadeInStartTime()) / this._fadeInSeconds), i = this._fadeOutSeconds == 0 || e.getEndTime() < 0 ? 1 : W.getEasingSine((e.getEndTime() - t) / this._fadeOutSeconds);
		return n = n * r * i, e.setState(t, n), T(0 <= n && n <= 1), n;
	}
	/**
	* フェードインの時間を設定する
	* @param fadeInSeconds フェードインにかかる時間[秒]
	*/
	setFadeInTime(e) {
		this._fadeInSeconds = e;
	}
	/**
	* フェードアウトの時間を設定する
	* @param fadeOutSeconds フェードアウトにかかる時間[秒]
	*/
	setFadeOutTime(e) {
		this._fadeOutSeconds = e;
	}
	/**
	* フェードアウトにかかる時間の取得
	* @return フェードアウトにかかる時間[秒]
	*/
	getFadeOutTime() {
		return this._fadeOutSeconds;
	}
	/**
	* フェードインにかかる時間の取得
	* @return フェードインにかかる時間[秒]
	*/
	getFadeInTime() {
		return this._fadeInSeconds;
	}
	/**
	* モーション適用の重みの設定
	* @param weight 重み（0.0 - 1.0）
	*/
	setWeight(e) {
		this._weight = e;
	}
	/**
	* モーション適用の重みの取得
	* @return 重み（0.0 - 1.0）
	*/
	getWeight() {
		return this._weight;
	}
	/**
	* モーションの長さの取得
	* @return モーションの長さ[秒]
	*
	* @note ループの時は「-1」。
	*       ループでない場合は、オーバーライドする。
	*       正の値の時は取得される時間で終了する。
	*       「-1」の時は外部から停止命令がない限り終わらない処理となる。
	*/
	getDuration() {
		return -1;
	}
	/**
	* モーションのループ1回分の長さの取得
	* @return モーションのループ一回分の長さ[秒]
	*
	* @note ループしない場合は、getDuration()と同じ値を返す
	*       ループ一回分の長さが定義できない場合(プログラム的に動き続けるサブクラスなど)の場合は「-1」を返す
	*/
	getLoopDuration() {
		return -1;
	}
	/**
	* モーション再生の開始時刻の設定
	* @param offsetSeconds モーション再生の開始時刻[秒]
	*/
	setOffsetTime(e) {
		this._offsetSeconds = e;
	}
	/**
	* ループ情報の設定
	* @param loop ループ情報
	*/
	setLoop(e) {
		this._isLoop = e;
	}
	/**
	* ループ情報の取得
	* @return true ループする
	* @return false ループしない
	*/
	getLoop() {
		return this._isLoop;
	}
	/**
	* ループ時のフェードイン情報の設定
	* @param loopFadeIn  ループ時のフェードイン情報
	*/
	setLoopFadeIn(e) {
		this._isLoopFadeIn = e;
	}
	/**
	* ループ時のフェードイン情報の取得
	*
	* @return  true    する
	* @return  false   しない
	*/
	getLoopFadeIn() {
		return this._isLoopFadeIn;
	}
	/**
	* モデルのパラメータ更新
	*
	* イベント発火のチェック。
	* 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
	*
	* @param beforeCheckTimeSeconds 前回のイベントチェック時間[秒]
	* @param motionTimeSeconds 今回の再生時間[秒]
	*/
	getFiredEvent(e, t) {
		return this._firedEventValues;
	}
	/**
	* 透明度のカーブが存在するかどうかを確認する
	*
	* @returns true  -> キーが存在する
	*          false -> キーが存在しない
	*/
	isExistModelOpacity() {
		return !1;
	}
	/**
	* 透明度のカーブのインデックスを返す
	*
	* @returns success:透明度のカーブのインデックス
	*/
	getModelOpacityIndex() {
		return -1;
	}
	/**
	* 透明度のIdを返す
	*
	* @param index モーションカーブのインデックス
	* @returns success:透明度のId
	*/
	getModelOpacityId(e) {
		return null;
	}
	/**
	* 指定時間の透明度の値を返す
	*
	* @returns success:モーションの現在時間におけるOpacityの値
	*
	* @note  更新後の値を取るにはUpdateParameters() の後に呼び出す。
	*/
	getModelOpacityValue() {
		return 1;
	}
	/**
	* 終了時刻の調整
	* @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
	*/
	adjustEndTime(e) {
		let t = this.getDuration(), n = t <= 0 ? -1 : e.getStartTime() + t;
		e.setEndTime(n);
	}
}, Rn;
((e) => {
	e.ACubismMotion = Ln;
})(Rn ||= {});
var zn = "FadeInTime", Bn = "FadeOutTime", Vn = "Parameters", Hn = "Id", Un = "Value", Wn = "Blend", Gn = "Add", Kn = "Multiply", qn = "Overwrite", Jn = 1, Yn = class e extends Ln {
	/**
	* インスタンスを作成する。
	* @param buffer expファイルが読み込まれているバッファ
	* @param size バッファのサイズ
	* @return 作成されたインスタンス
	*/
	static create(t, n) {
		let r = new e();
		return r.parse(t, n), r;
	}
	/**
	* モデルのパラメータの更新の実行
	* @param model 対象のモデル
	* @param userTimeSeconds デルタ時間の積算値[秒]
	* @param weight モーションの重み
	* @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
	*/
	doUpdateParameters(e, t, n, r) {
		for (let t = 0; t < this._parameters.getSize(); ++t) {
			let r = this._parameters.at(t);
			switch (r.blendType) {
				case 0:
					e.addParameterValueById(r.parameterId, r.value, n);
					break;
				case 1:
					e.multiplyParameterValueById(r.parameterId, r.value, n);
					break;
				case 2: e.setParameterValueById(r.parameterId, r.value, n);
			}
		}
	}
	/**
	* @brief 表情によるモデルのパラメータの計算
	*
	* モデルの表情に関するパラメータを計算する。
	*
	* @param[in]   model                        対象のモデル
	* @param[in]   userTimeSeconds              デルタ時間の積算値[秒]
	* @param[in]   motionQueueEntry             CubismMotionQueueManagerで管理されているモーション
	* @param[in]   expressionParameterValues    モデルに適用する各パラメータの値
	* @param[in]   expressionIndex              表情のインデックス
	* @param[in]   fadeWeight                   表情のウェイト
	*/
	calculateExpressionParameters(t, n, r, i, a, o) {
		if (r != null && i != null && r.isAvailable()) {
			this._fadeWeight = this.updateFadeWeight(r, n);
			for (let n = 0; n < i.getSize(); ++n) {
				let r = i.at(n);
				if (r.parameterId == null) continue;
				let s = r.overwriteValue = t.getParameterValueById(r.parameterId), c = this.getExpressionParameters(), l = -1;
				for (let e = 0; e < c.getSize(); ++e) if (r.parameterId == c.at(e).parameterId) {
					l = e;
					break;
				}
				if (l < 0) {
					a == 0 ? (r.additiveValue = e.DefaultAdditiveValue, r.multiplyValue = e.DefaultMultiplyValue, r.overwriteValue = s) : (r.additiveValue = this.calculateValue(r.additiveValue, e.DefaultAdditiveValue, o), r.multiplyValue = this.calculateValue(r.multiplyValue, e.DefaultMultiplyValue, o), r.overwriteValue = this.calculateValue(r.overwriteValue, s, o));
					continue;
				}
				let u = c.at(l).value, d, f, p;
				switch (c.at(l).blendType) {
					case 0:
						d = u, f = e.DefaultMultiplyValue, p = s;
						break;
					case 1:
						d = e.DefaultAdditiveValue, f = u, p = s;
						break;
					case 2:
						d = e.DefaultAdditiveValue, f = e.DefaultMultiplyValue, p = u;
						break;
					default: return;
				}
				a == 0 ? (r.additiveValue = d, r.multiplyValue = f, r.overwriteValue = p) : (r.additiveValue = r.additiveValue * (1 - o) + d * o, r.multiplyValue = r.multiplyValue * (1 - o) + f * o, r.overwriteValue = r.overwriteValue * (1 - o) + p * o);
			}
		}
	}
	/**
	* @brief 表情が参照しているパラメータを取得
	*
	* 表情が参照しているパラメータを取得する
	*
	* @return 表情パラメータ
	*/
	getExpressionParameters() {
		return this._parameters;
	}
	/**
	* @brief 表情のフェードの値を取得
	*
	* 現在の表情のフェードのウェイト値を取得する
	*
	* @returns 表情のフェードのウェイト値
	*
	* @deprecated CubismExpressionMotion.fadeWeightが削除予定のため非推奨。
	* CubismExpressionMotionManager.getFadeWeight(index: number): number を使用してください。
	* @see CubismExpressionMotionManager#getFadeWeight(index: number)
	*/
	getFadeWeight() {
		return this._fadeWeight;
	}
	parse(e, t) {
		let n = A.create(e, t);
		if (!n) return;
		let r = n.getRoot();
		this.setFadeInTime(r.getValueByString(zn).toFloat(Jn)), this.setFadeOutTime(r.getValueByString(Bn).toFloat(Jn));
		let i = r.getValueByString(Vn).getSize();
		this._parameters.prepareCapacity(i);
		for (let e = 0; e < i; ++e) {
			let t = r.getValueByString(Vn).getValueByIndex(e), n = N.getIdManager().getId(t.getValueByString(Hn).getRawString()), i = t.getValueByString(Un).toFloat(), a;
			a = t.getValueByString(Wn).isNull() || t.getValueByString(Wn).getString() == Gn ? 0 : t.getValueByString(Wn).getString() == Kn ? 1 : t.getValueByString(Wn).getString() == qn ? 2 : 0;
			let o = new Qn();
			o.parameterId = n, o.blendType = a, o.value = i, this._parameters.pushBack(o);
		}
		A.delete(n);
	}
	/**
	* @brief ブレンド計算
	*
	* 入力された値でブレンド計算をする。
	*
	* @param source 現在の値
	* @param destination 適用する値
	* @param weight ウェイト
	* @returns 計算結果
	*/
	calculateValue(e, t, n) {
		return e * (1 - n) + t * n;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._parameters = new S(), this._fadeWeight = 0;
	}
};
Yn.DefaultAdditiveValue = 0, Yn.DefaultMultiplyValue = 1;
var Xn = Yn, Zn = /* @__PURE__ */ ((e) => (e[e.Additive = 0] = "Additive", e[e.Multiply = 1] = "Multiply", e[e.Overwrite = 2] = "Overwrite", e))(Zn || {}), Qn = class {}, $n;
((e) => {
	e.CubismExpressionMotion = Xn, e.ExpressionBlendType = Zn, e.ExpressionParameter = Qn;
})($n ||= {});
var er = class {
	/**
	* コンストラクタ
	*/
	constructor() {
		this._autoDelete = !1, this._motion = null, this._available = !0, this._finished = !1, this._started = !1, this._startTimeSeconds = -1, this._fadeInStartTimeSeconds = 0, this._endTimeSeconds = -1, this._stateTimeSeconds = 0, this._stateWeight = 0, this._lastEventCheckSeconds = 0, this._motionQueueEntryHandle = this, this._fadeOutSeconds = 0, this._isTriggeredFadeOut = !1;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._autoDelete && this._motion && Ln.delete(this._motion);
	}
	/**
	* フェードアウト時間と開始判定の設定
	* @param fadeOutSeconds フェードアウトにかかる時間[秒]
	*/
	setFadeOut(e) {
		this._fadeOutSeconds = e, this._isTriggeredFadeOut = !0;
	}
	/**
	* フェードアウトの開始
	* @param fadeOutSeconds フェードアウトにかかる時間[秒]
	* @param userTimeSeconds デルタ時間の積算値[秒]
	*/
	startFadeOut(e, t) {
		let n = t + e;
		this._isTriggeredFadeOut = !0, (this._endTimeSeconds < 0 || n < this._endTimeSeconds) && (this._endTimeSeconds = n);
	}
	/**
	* モーションの終了の確認
	*
	* @return true モーションが終了した
	* @return false 終了していない
	*/
	isFinished() {
		return this._finished;
	}
	/**
	* モーションの開始の確認
	* @return true モーションが開始した
	* @return false 開始していない
	*/
	isStarted() {
		return this._started;
	}
	/**
	* モーションの開始時刻の取得
	* @return モーションの開始時刻[秒]
	*/
	getStartTime() {
		return this._startTimeSeconds;
	}
	/**
	* フェードインの開始時刻の取得
	* @return フェードインの開始時刻[秒]
	*/
	getFadeInStartTime() {
		return this._fadeInStartTimeSeconds;
	}
	/**
	* フェードインの終了時刻の取得
	* @return フェードインの終了時刻の取得
	*/
	getEndTime() {
		return this._endTimeSeconds;
	}
	/**
	* モーションの開始時刻の設定
	* @param startTime モーションの開始時刻
	*/
	setStartTime(e) {
		this._startTimeSeconds = e;
	}
	/**
	* フェードインの開始時刻の設定
	* @param startTime フェードインの開始時刻[秒]
	*/
	setFadeInStartTime(e) {
		this._fadeInStartTimeSeconds = e;
	}
	/**
	* フェードインの終了時刻の設定
	* @param endTime フェードインの終了時刻[秒]
	*/
	setEndTime(e) {
		this._endTimeSeconds = e;
	}
	/**
	* モーションの終了の設定
	* @param f trueならモーションの終了
	*/
	setIsFinished(e) {
		this._finished = e;
	}
	/**
	* モーション開始の設定
	* @param f trueならモーションの開始
	*/
	setIsStarted(e) {
		this._started = e;
	}
	/**
	* モーションの有効性の確認
	* @return true モーションは有効
	* @return false モーションは無効
	*/
	isAvailable() {
		return this._available;
	}
	/**
	* モーションの有効性の設定
	* @param v trueならモーションは有効
	*/
	setIsAvailable(e) {
		this._available = e;
	}
	/**
	* モーションの状態の設定
	* @param timeSeconds 現在時刻[秒]
	* @param weight モーション尾重み
	*/
	setState(e, t) {
		this._stateTimeSeconds = e, this._stateWeight = t;
	}
	/**
	* モーションの現在時刻の取得
	* @return モーションの現在時刻[秒]
	*/
	getStateTime() {
		return this._stateTimeSeconds;
	}
	/**
	* モーションの重みの取得
	* @return モーションの重み
	*/
	getStateWeight() {
		return this._stateWeight;
	}
	/**
	* 最後にイベントの発火をチェックした時間を取得
	*
	* @return 最後にイベントの発火をチェックした時間[秒]
	*/
	getLastCheckEventSeconds() {
		return this._lastEventCheckSeconds;
	}
	/**
	* 最後にイベントをチェックした時間を設定
	* @param checkSeconds 最後にイベントをチェックした時間[秒]
	*/
	setLastCheckEventSeconds(e) {
		this._lastEventCheckSeconds = e;
	}
	/**
	* フェードアウト開始判定の取得
	* @return フェードアウト開始するかどうか
	*/
	isTriggeredFadeOut() {
		return this._isTriggeredFadeOut;
	}
	/**
	* フェードアウト時間の取得
	* @return フェードアウト時間[秒]
	*/
	getFadeOutSeconds() {
		return this._fadeOutSeconds;
	}
	/**
	* モーションの取得
	*
	* @return モーション
	*/
	getCubismMotion() {
		return this._motion;
	}
}, tr;
((e) => {
	e.CubismMotionQueueEntry = er;
})(tr ||= {});
var nr = class {
	/**
	* コンストラクタ
	*/
	constructor() {
		this._userTimeSeconds = 0, this._eventCallBack = null, this._eventCustomData = null, this._motions = new S();
	}
	/**
	* デストラクタ
	*/
	release() {
		for (let e = 0; e < this._motions.getSize(); ++e) this._motions.at(e) && (this._motions.at(e).release(), this._motions.set(e, null));
		this._motions = null;
	}
	/**
	* 指定したモーションの開始
	*
	* 指定したモーションを開始する。同じタイプのモーションが既にある場合は、既存のモーションに終了フラグを立て、フェードアウトを開始させる。
	*
	* @param   motion          開始するモーション
	* @param   autoDelete      再生が終了したモーションのインスタンスを削除するなら true
	* @param   userTimeSeconds Deprecated: デルタ時間の積算値[秒] 関数内で参照していないため使用は非推奨。
	* @return                      開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するIsFinished()の引数で使用する。開始できない時は「-1」
	*/
	startMotion(e, t, n) {
		if (e == null) return rr;
		let r = null;
		for (let e = 0; e < this._motions.getSize(); ++e) r = this._motions.at(e), r?.setFadeOut(r._motion.getFadeOutTime());
		return r = new er(), r._autoDelete = t, r._motion = e, this._motions.pushBack(r), r._motionQueueEntryHandle;
	}
	/**
	* 全てのモーションの終了の確認
	* @return true 全て終了している
	* @return false 終了していない
	*/
	isFinished() {
		for (let e = this._motions.begin(); e.notEqual(this._motions.end());) {
			let t = e.ptr();
			if (t == null) {
				e = this._motions.erase(e);
				continue;
			}
			if (t._motion == null) {
				t.release(), t = null, e = this._motions.erase(e);
				continue;
			}
			if (t.isFinished()) e.preIncrement();
			else return !1;
		}
		return !0;
	}
	/**
	* 指定したモーションの終了の確認
	* @param motionQueueEntryNumber モーションの識別番号
	* @return true 全て終了している
	* @return false 終了していない
	*/
	isFinishedByHandle(e) {
		for (let t = this._motions.begin(); t.notEqual(this._motions.end()); t.increment()) {
			let n = t.ptr();
			if (n != null && n._motionQueueEntryHandle == e && !n.isFinished()) return !1;
		}
		return !0;
	}
	/**
	* 全てのモーションを停止する
	*/
	stopAllMotions() {
		for (let e = this._motions.begin(); e.notEqual(this._motions.end());) {
			let t = e.ptr();
			if (t == null) {
				e = this._motions.erase(e);
				continue;
			}
			t.release(), t = null, e = this._motions.erase(e);
		}
	}
	/**
	* @brief CubismMotionQueueEntryの配列の取得
	*
	* CubismMotionQueueEntryの配列を取得する。
	*
	* @return  CubismMotionQueueEntryの配列へのポインタ
	* @retval  NULL   見つからなかった
	*/
	getCubismMotionQueueEntries() {
		return this._motions;
	}
	/**
	* 指定したCubismMotionQueueEntryの取得
	
	* @param   motionQueueEntryNumber  モーションの識別番号
	* @return  指定したCubismMotionQueueEntry
	* @return  null   見つからなかった
	*/
	getCubismMotionQueueEntry(e) {
		for (let t = this._motions.begin(); t.notEqual(this._motions.end()); t.preIncrement()) {
			let n = t.ptr();
			if (n != null && n._motionQueueEntryHandle == e) return n;
		}
		return null;
	}
	/**
	* イベントを受け取るCallbackの登録
	*
	* @param callback コールバック関数
	* @param customData コールバックに返されるデータ
	*/
	setEventCallback(e, t = null) {
		this._eventCallBack = e, this._eventCustomData = t;
	}
	/**
	* モーションを更新して、モデルにパラメータ値を反映する。
	*
	* @param   model   対象のモデル
	* @param   userTimeSeconds   デルタ時間の積算値[秒]
	* @return  true    モデルへパラメータ値の反映あり
	* @return  false   モデルへパラメータ値の反映なし(モーションの変化なし)
	*/
	doUpdateMotion(e, t) {
		let n = !1;
		for (let r = this._motions.begin(); r.notEqual(this._motions.end());) {
			let i = r.ptr();
			if (i == null) {
				r = this._motions.erase(r);
				continue;
			}
			let a = i._motion;
			if (a == null) {
				i.release(), i = null, r = this._motions.erase(r);
				continue;
			}
			a.updateParameters(e, i, t), n = !0;
			let o = a.getFiredEvent(i.getLastCheckEventSeconds() - i.getStartTime(), t - i.getStartTime());
			for (let e = 0; e < o.getSize(); ++e) this._eventCallBack(this, o.at(e), this._eventCustomData);
			i.setLastCheckEventSeconds(t), i.isFinished() ? (i.release(), i = null, r = this._motions.erase(r)) : (i.isTriggeredFadeOut() && i.startFadeOut(i.getFadeOutSeconds(), t), r.preIncrement());
		}
		return n;
	}
}, rr = -1, ir;
((e) => {
	e.CubismMotionQueueManager = nr, e.InvalidMotionQueueEntryHandleValue = rr;
})(ir ||= {});
var ar = class extends ct {
	constructor(e, t) {
		super(e, t), b(this, "expressionDataType", "arraybuffer"), b(this, "queueManager", new nr()), b(this, "definitions"), this.definitions = e.expressions?.filter((e) => !!e && typeof e.File == "string") ?? [], this.init();
	}
	isFinished() {
		return this.queueManager.isFinished();
	}
	getExpressionIndex(e) {
		return this.definitions.findIndex((t) => t.Name === e);
	}
	getExpressionFile(e) {
		return e.File;
	}
	createExpression(e, t) {
		return Xn.create(e, e.byteLength);
	}
	_setExpression(e) {
		return this.queueManager.startMotion(e, !1);
	}
	stopAllExpressions() {
		this.queueManager.stopAllMotions();
	}
	updateParameters(e, t) {
		return this.queueManager.doUpdateMotion(e, t);
	}
	createDefaultExpression() {
		let e = new TextEncoder().encode(JSON.stringify({
			FadeInTime: 0,
			FadeOutTime: 0,
			Parameters: []
		})).buffer;
		return Xn.create(e, e.byteLength);
	}
}, G = /* @__PURE__ */ ((e) => (e[e.CubismMotionCurveTarget_Model = 0] = "CubismMotionCurveTarget_Model", e[e.CubismMotionCurveTarget_Parameter = 1] = "CubismMotionCurveTarget_Parameter", e[e.CubismMotionCurveTarget_PartOpacity = 2] = "CubismMotionCurveTarget_PartOpacity", e))(G || {}), K = /* @__PURE__ */ ((e) => (e[e.CubismMotionSegmentType_Linear = 0] = "CubismMotionSegmentType_Linear", e[e.CubismMotionSegmentType_Bezier = 1] = "CubismMotionSegmentType_Bezier", e[e.CubismMotionSegmentType_Stepped = 2] = "CubismMotionSegmentType_Stepped", e[e.CubismMotionSegmentType_InverseStepped = 3] = "CubismMotionSegmentType_InverseStepped", e))(K || {}), or = class {
	constructor() {
		this.time = 0, this.value = 0;
	}
}, sr = class {
	/**
	* @brief コンストラクタ
	*
	* コンストラクタ。
	*/
	constructor() {
		this.evaluate = null, this.basePointIndex = 0, this.segmentType = 0;
	}
}, cr = class {
	constructor() {
		this.type = 0, this.segmentCount = 0, this.baseSegmentIndex = 0, this.fadeInTime = 0, this.fadeOutTime = 0;
	}
}, lr = class {
	constructor() {
		this.fireTime = 0;
	}
}, ur = class {
	constructor() {
		this.duration = 0, this.loop = !1, this.curveCount = 0, this.eventCount = 0, this.fps = 0, this.curves = new S(), this.segments = new S(), this.points = new S(), this.events = new S();
	}
}, dr;
((e) => {
	e.CubismMotionCurve = cr, e.CubismMotionCurveTarget = G, e.CubismMotionData = ur, e.CubismMotionEvent = lr, e.CubismMotionPoint = or, e.CubismMotionSegment = sr, e.CubismMotionSegmentType = K;
})(dr ||= {});
var q = "Meta", fr = "Duration", pr = "Loop", mr = "AreBeziersRestricted", hr = "CurveCount", gr = "Fps", _r = "TotalSegmentCount", vr = "TotalPointCount", J = "Curves", yr = "Target", br = "Id", xr = "FadeInTime", Sr = "FadeOutTime", Cr = "Segments", wr = "UserData", Tr = "UserDataCount", Er = "TotalUserDataSize", Dr = "Time", Or = "Value", kr = class {
	/**
	* コンストラクタ
	* @param buffer motion3.jsonが読み込まれているバッファ
	* @param size バッファのサイズ
	*/
	constructor(e, t) {
		this._json = A.create(e, t);
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		A.delete(this._json);
	}
	/**
	* モーションの長さを取得する
	* @return モーションの長さ[秒]
	*/
	getMotionDuration() {
		return this._json.getRoot().getValueByString(q).getValueByString(fr).toFloat();
	}
	/**
	* モーションのループ情報の取得
	* @return true ループする
	* @return false ループしない
	*/
	isMotionLoop() {
		return this._json.getRoot().getValueByString(q).getValueByString(pr).toBoolean();
	}
	/**
	*  motion3.jsonファイルの整合性チェック
	*
	* @return 正常なファイルの場合はtrueを返す。
	*/
	hasConsistency() {
		let e = !0;
		if (!this._json || !this._json.getRoot()) return !1;
		let t = this._json.getRoot().getValueByString(J).getVector().getSize(), n = 0, r = 0;
		for (let e = 0; e < t; ++e) for (let t = 0; t < this.getMotionCurveSegmentCount(e);) {
			switch (t == 0 && (r += 1, t += 2), this.getMotionCurveSegment(e, t)) {
				case K.CubismMotionSegmentType_Linear:
					r += 1, t += 3;
					break;
				case K.CubismMotionSegmentType_Bezier:
					r += 3, t += 7;
					break;
				case K.CubismMotionSegmentType_Stepped:
					r += 1, t += 3;
					break;
				case K.CubismMotionSegmentType_InverseStepped:
					r += 1, t += 3;
					break;
				default: T(0);
			}
			++n;
		}
		return t != this.getMotionCurveCount() && (E("The number of curves does not match the metadata."), e = !1), n != this.getMotionTotalSegmentCount() && (E("The number of segment does not match the metadata."), e = !1), r != this.getMotionTotalPointCount() && (E("The number of point does not match the metadata."), e = !1), e;
	}
	getEvaluationOptionFlag(e) {
		return e == 0 && this._json.getRoot().getValueByString(q).getValueByString(mr).toBoolean();
	}
	/**
	* モーションカーブの個数の取得
	* @return モーションカーブの個数
	*/
	getMotionCurveCount() {
		return this._json.getRoot().getValueByString(q).getValueByString(hr).toInt();
	}
	/**
	* モーションのフレームレートの取得
	* @return フレームレート[FPS]
	*/
	getMotionFps() {
		return this._json.getRoot().getValueByString(q).getValueByString(gr).toFloat();
	}
	/**
	* モーションのセグメントの総合計の取得
	* @return モーションのセグメントの取得
	*/
	getMotionTotalSegmentCount() {
		return this._json.getRoot().getValueByString(q).getValueByString(_r).toInt();
	}
	/**
	* モーションのカーブの制御店の総合計の取得
	* @return モーションのカーブの制御点の総合計
	*/
	getMotionTotalPointCount() {
		return this._json.getRoot().getValueByString(q).getValueByString(vr).toInt();
	}
	/**
	* モーションのフェードイン時間の存在
	* @return true 存在する
	* @return false 存在しない
	*/
	isExistMotionFadeInTime() {
		return !this._json.getRoot().getValueByString(q).getValueByString(xr).isNull();
	}
	/**
	* モーションのフェードアウト時間の存在
	* @return true 存在する
	* @return false 存在しない
	*/
	isExistMotionFadeOutTime() {
		return !this._json.getRoot().getValueByString(q).getValueByString(Sr).isNull();
	}
	/**
	* モーションのフェードイン時間の取得
	* @return フェードイン時間[秒]
	*/
	getMotionFadeInTime() {
		return this._json.getRoot().getValueByString(q).getValueByString(xr).toFloat();
	}
	/**
	* モーションのフェードアウト時間の取得
	* @return フェードアウト時間[秒]
	*/
	getMotionFadeOutTime() {
		return this._json.getRoot().getValueByString(q).getValueByString(Sr).toFloat();
	}
	/**
	* モーションのカーブの種類の取得
	* @param curveIndex カーブのインデックス
	* @return カーブの種類
	*/
	getMotionCurveTarget(e) {
		return this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(yr).getRawString();
	}
	/**
	* モーションのカーブのIDの取得
	* @param curveIndex カーブのインデックス
	* @return カーブのID
	*/
	getMotionCurveId(e) {
		return N.getIdManager().getId(this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(br).getRawString());
	}
	/**
	* モーションのカーブのフェードイン時間の存在
	* @param curveIndex カーブのインデックス
	* @return true 存在する
	* @return false 存在しない
	*/
	isExistMotionCurveFadeInTime(e) {
		return !this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(xr).isNull();
	}
	/**
	* モーションのカーブのフェードアウト時間の存在
	* @param curveIndex カーブのインデックス
	* @return true 存在する
	* @return false 存在しない
	*/
	isExistMotionCurveFadeOutTime(e) {
		return !this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(Sr).isNull();
	}
	/**
	* モーションのカーブのフェードイン時間の取得
	* @param curveIndex カーブのインデックス
	* @return フェードイン時間[秒]
	*/
	getMotionCurveFadeInTime(e) {
		return this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(xr).toFloat();
	}
	/**
	* モーションのカーブのフェードアウト時間の取得
	* @param curveIndex カーブのインデックス
	* @return フェードアウト時間[秒]
	*/
	getMotionCurveFadeOutTime(e) {
		return this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(Sr).toFloat();
	}
	/**
	* モーションのカーブのセグメントの個数を取得する
	* @param curveIndex カーブのインデックス
	* @return モーションのカーブのセグメントの個数
	*/
	getMotionCurveSegmentCount(e) {
		return this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(Cr).getVector().getSize();
	}
	/**
	* モーションのカーブのセグメントの値の取得
	* @param curveIndex カーブのインデックス
	* @param segmentIndex セグメントのインデックス
	* @return セグメントの値
	*/
	getMotionCurveSegment(e, t) {
		return this._json.getRoot().getValueByString(J).getValueByIndex(e).getValueByString(Cr).getValueByIndex(t).toFloat();
	}
	/**
	* イベントの個数の取得
	* @return イベントの個数
	*/
	getEventCount() {
		return this._json.getRoot().getValueByString(q).getValueByString(Tr).toInt();
	}
	/**
	*  イベントの総文字数の取得
	* @return イベントの総文字数
	*/
	getTotalEventValueSize() {
		return this._json.getRoot().getValueByString(q).getValueByString(Er).toInt();
	}
	/**
	* イベントの時間の取得
	* @param userDataIndex イベントのインデックス
	* @return イベントの時間[秒]
	*/
	getEventTime(e) {
		return this._json.getRoot().getValueByString(wr).getValueByIndex(e).getValueByString(Dr).toFloat();
	}
	/**
	* イベントの取得
	* @param userDataIndex イベントのインデックス
	* @return イベントの文字列
	*/
	getEventValue(e) {
		return new C(this._json.getRoot().getValueByString(wr).getValueByIndex(e).getValueByString(Or).getRawString());
	}
}, Ar = /* @__PURE__ */ ((e) => (e[e.EvaluationOptionFlag_AreBeziersRistricted = 0] = "EvaluationOptionFlag_AreBeziersRistricted", e))(Ar || {}), jr;
((e) => {
	e.CubismMotionJson = kr;
})(jr ||= {});
var Mr = "EyeBlink", Nr = "LipSync", Pr = "Model", Fr = "Parameter", Ir = "PartOpacity", Lr = "Opacity";
function Y(e, t, n) {
	let r = new or();
	return r.time = e.time + (t.time - e.time) * n, r.value = e.value + (t.value - e.value) * n, r;
}
function Rr(e, t) {
	let n = (t - e[0].time) / (e[1].time - e[0].time);
	return n < 0 && (n = 0), e[0].value + (e[1].value - e[0].value) * n;
}
function zr(e, t) {
	let n = (t - e[0].time) / (e[3].time - e[0].time);
	n < 0 && (n = 0);
	let r = Y(e[0], e[1], n), i = Y(e[1], e[2], n), a = Y(e[2], e[3], n);
	return Y(Y(r, i, n), Y(i, a, n), n).value;
}
function Br(e, t) {
	let n = t, r = e[0].time, i = e[3].time, a = e[1].time, o = e[2].time, s = i - 3 * o + 3 * a - r, c = 3 * o - 6 * a + 3 * r, l = 3 * a - 3 * r, u = r - n, d = W.cardanoAlgorithmForBezier(s, c, l, u), f = Y(e[0], e[1], d), p = Y(e[1], e[2], d), m = Y(e[2], e[3], d);
	return Y(Y(f, p, d), Y(p, m, d), d).value;
}
function Vr(e, t) {
	return e[0].value;
}
function Hr(e, t) {
	return e[1].value;
}
function Ur(e, t, n, r, i) {
	let a = e.curves.at(t), o = -1, s = a.baseSegmentIndex + a.segmentCount, c = 0;
	for (let t = a.baseSegmentIndex; t < s; ++t) if (c = e.segments.at(t).basePointIndex + (e.segments.at(t).segmentType == K.CubismMotionSegmentType_Bezier ? 3 : 1), e.points.at(c).time > n) {
		o = t;
		break;
	}
	if (o == -1) return r && n < i ? Wr(e, s - 1, e.segments.at(a.baseSegmentIndex).basePointIndex, c, n, i) : e.points.at(c).value;
	let l = e.segments.at(o);
	return l.evaluate(e.points.get(l.basePointIndex), n);
}
function Wr(e, t, n, r, i, a) {
	let o = [new or(), new or()];
	{
		let t = e.points.at(r);
		o[0].time = t.time, o[0].value = t.value;
	}
	{
		let t = e.points.at(n);
		o[1].time = a, o[1].value = t.value;
	}
	switch (e.segments.at(t).segmentType) {
		case K.CubismMotionSegmentType_Linear:
		case K.CubismMotionSegmentType_Bezier:
		default: return Rr(o, i);
		case K.CubismMotionSegmentType_Stepped: return Vr(o);
		case K.CubismMotionSegmentType_InverseStepped: return Hr(o);
	}
}
var Gr = class e extends Ln {
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._motionBehavior = 1, this._sourceFrameRate = 30, this._loopDurationSeconds = -1, this._isLoop = !1, this._isLoopFadeIn = !0, this._lastWeight = 0, this._motionData = null, this._modelCurveIdEyeBlink = null, this._modelCurveIdLipSync = null, this._modelCurveIdOpacity = null, this._eyeBlinkParameterIds = null, this._lipSyncParameterIds = null, this._modelOpacity = 1, this._debugMode = !1;
	}
	/**
	* インスタンスを作成する
	*
	* @param buffer motion3.jsonが読み込まれているバッファ
	* @param size バッファのサイズ
	* @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
	* @param onBeganMotionHandler モーション再生開始時に呼び出されるコールバック関数
	* @param shouldCheckMotionConsistency motion3.json整合性チェックするかどうか
	* @return 作成されたインスタンス
	*/
	static create(t, n, r, i, a = !1) {
		let o = new e();
		if (o.parse(t, n, a), o._motionData) o._sourceFrameRate = o._motionData.fps, o._loopDurationSeconds = o._motionData.duration, o._onFinishedMotion = r, o._onBeganMotion = i;
		else return Je(o), null;
		return o;
	}
	/**
	* モデルのパラメータの更新の実行
	* @param model             対象のモデル
	* @param userTimeSeconds   現在の時刻[秒]
	* @param fadeWeight        モーションの重み
	* @param motionQueueEntry  CubismMotionQueueManagerで管理されているモーション
	*/
	doUpdateParameters(e, t, n, r) {
		this._modelCurveIdEyeBlink ??= N.getIdManager().getId(Mr), this._modelCurveIdLipSync ??= N.getIdManager().getId(Nr), this._modelCurveIdOpacity ??= N.getIdManager().getId(Lr), this._motionBehavior === 1 && this._previousLoopState !== this._isLoop && (this.adjustEndTime(r), this._previousLoopState = this._isLoop);
		let i = t - r.getStartTime();
		i < 0 && (i = 0);
		let a = Number.MAX_VALUE, o = Number.MAX_VALUE, s = 0, c = 0;
		this._eyeBlinkParameterIds.getSize() > 64 && Te("too many eye blink targets : {0}", this._eyeBlinkParameterIds.getSize()), this._lipSyncParameterIds.getSize() > 64 && Te("too many lip sync targets : {0}", this._lipSyncParameterIds.getSize());
		let l = this._fadeInSeconds <= 0 ? 1 : W.getEasingSine((t - r.getFadeInStartTime()) / this._fadeInSeconds), u = this._fadeOutSeconds <= 0 || r.getEndTime() < 0 ? 1 : W.getEasingSine((r.getEndTime() - t) / this._fadeOutSeconds), d, f, p, m = i, h = this._motionData.duration, g = this._motionBehavior === 1 && this._isLoop;
		if (this._isLoop) for (this._motionBehavior === 1 && (h += 1 / this._motionData.fps); m > h;) m -= h;
		let _ = this._motionData.curves;
		for (f = 0; f < this._motionData.curveCount && _.at(f).type == G.CubismMotionCurveTarget_Model; ++f) d = Ur(this._motionData, f, m, g, h), _.at(f).id == this._modelCurveIdEyeBlink ? o = d : _.at(f).id == this._modelCurveIdLipSync ? a = d : _.at(f).id == this._modelCurveIdOpacity && (this._modelOpacity = d, e.setModelOapcity(this.getModelOpacityValue()));
		for (; f < this._motionData.curveCount && _.at(f).type == G.CubismMotionCurveTarget_Parameter; ++f) {
			if (p = e.getParameterIndex(_.at(f).id), p == -1) continue;
			let i = e.getParameterValueByIndex(p);
			if (d = Ur(this._motionData, f, m, g, h), o != Number.MAX_VALUE) {
				for (let e = 0; e < this._eyeBlinkParameterIds.getSize() && e < 64; ++e) if (this._eyeBlinkParameterIds.at(e) == _.at(f).id) {
					d *= o, c |= 1 << e;
					break;
				}
			}
			if (a != Number.MAX_VALUE) {
				for (let e = 0; e < this._lipSyncParameterIds.getSize() && e < 64; ++e) if (this._lipSyncParameterIds.at(e) == _.at(f).id) {
					d += a, s |= 1 << e;
					break;
				}
			}
			e.isRepeat(p) && (d = e.getParameterRepeatValue(p, d));
			let v;
			if (_.at(f).fadeInTime < 0 && _.at(f).fadeOutTime < 0) v = i + (d - i) * n;
			else {
				let e, n;
				e = _.at(f).fadeInTime < 0 ? l : _.at(f).fadeInTime == 0 ? 1 : W.getEasingSine((t - r.getFadeInStartTime()) / _.at(f).fadeInTime), n = _.at(f).fadeOutTime < 0 ? u : _.at(f).fadeOutTime == 0 || r.getEndTime() < 0 ? 1 : W.getEasingSine((r.getEndTime() - t) / _.at(f).fadeOutTime);
				let a = this._weight * e * n;
				v = i + (d - i) * a;
			}
			e.setParameterValueByIndex(p, v, 1);
		}
		if (o != Number.MAX_VALUE) for (let t = 0; t < this._eyeBlinkParameterIds.getSize() && t < 64; ++t) {
			let r = e.getParameterValueById(this._eyeBlinkParameterIds.at(t));
			if (c >> t & 1) continue;
			let i = r + (o - r) * n;
			e.setParameterValueById(this._eyeBlinkParameterIds.at(t), i);
		}
		if (a != Number.MAX_VALUE) for (let t = 0; t < this._lipSyncParameterIds.getSize() && t < 64; ++t) {
			let r = e.getParameterValueById(this._lipSyncParameterIds.at(t));
			if (s >> t & 1) continue;
			let i = r + (a - r) * n;
			e.setParameterValueById(this._lipSyncParameterIds.at(t), i);
		}
		for (; f < this._motionData.curveCount && _.at(f).type == G.CubismMotionCurveTarget_PartOpacity; ++f) p = e.getParameterIndex(_.at(f).id), p != -1 && (d = Ur(this._motionData, f, m, g, h), e.setParameterValueByIndex(p, d));
		i >= h && (this._isLoop ? this.updateForNextLoop(r, t, m) : (this._onFinishedMotion && this._onFinishedMotion(this), r.setIsFinished(!0))), this._lastWeight = n;
	}
	/**
	* ループ情報の設定
	* @param loop ループ情報
	*/
	setIsLoop(e) {
		E("setIsLoop() is a deprecated function. Please use setLoop()."), this._isLoop = e;
	}
	/**
	* ループ情報の取得
	* @return true ループする
	* @return false ループしない
	*/
	isLoop() {
		return E("isLoop() is a deprecated function. Please use getLoop()."), this._isLoop;
	}
	/**
	* ループ時のフェードイン情報の設定
	* @param loopFadeIn  ループ時のフェードイン情報
	*/
	setIsLoopFadeIn(e) {
		E("setIsLoopFadeIn() is a deprecated function. Please use setLoopFadeIn()."), this._isLoopFadeIn = e;
	}
	/**
	* ループ時のフェードイン情報の取得
	*
	* @return  true    する
	* @return  false   しない
	*/
	isLoopFadeIn() {
		return E("isLoopFadeIn() is a deprecated function. Please use getLoopFadeIn()."), this._isLoopFadeIn;
	}
	/**
	* Sets the version of the Motion Behavior.
	*
	* @param Specifies the version of the Motion Behavior.
	*/
	setMotionBehavior(e) {
		this._motionBehavior = e;
	}
	/**
	* Gets the version of the Motion Behavior.
	*
	* @return Returns the version of the Motion Behavior.
	*/
	getMotionBehavior() {
		return this._motionBehavior;
	}
	/**
	* モーションの長さを取得する。
	*
	* @return  モーションの長さ[秒]
	*/
	getDuration() {
		return this._isLoop ? -1 : this._loopDurationSeconds;
	}
	/**
	* モーションのループ時の長さを取得する。
	*
	* @return  モーションのループ時の長さ[秒]
	*/
	getLoopDuration() {
		return this._loopDurationSeconds;
	}
	/**
	* パラメータに対するフェードインの時間を設定する。
	*
	* @param parameterId     パラメータID
	* @param value           フェードインにかかる時間[秒]
	*/
	setParameterFadeInTime(e, t) {
		let n = this._motionData.curves;
		for (let r = 0; r < this._motionData.curveCount; ++r) if (e == n.at(r).id) {
			n.at(r).fadeInTime = t;
			return;
		}
	}
	/**
	* パラメータに対するフェードアウトの時間の設定
	* @param parameterId     パラメータID
	* @param value           フェードアウトにかかる時間[秒]
	*/
	setParameterFadeOutTime(e, t) {
		let n = this._motionData.curves;
		for (let r = 0; r < this._motionData.curveCount; ++r) if (e == n.at(r).id) {
			n.at(r).fadeOutTime = t;
			return;
		}
	}
	/**
	* パラメータに対するフェードインの時間の取得
	* @param    parameterId     パラメータID
	* @return   フェードインにかかる時間[秒]
	*/
	getParameterFadeInTime(e) {
		let t = this._motionData.curves;
		for (let n = 0; n < this._motionData.curveCount; ++n) if (e == t.at(n).id) return t.at(n).fadeInTime;
		return -1;
	}
	/**
	* パラメータに対するフェードアウトの時間を取得
	*
	* @param   parameterId     パラメータID
	* @return   フェードアウトにかかる時間[秒]
	*/
	getParameterFadeOutTime(e) {
		let t = this._motionData.curves;
		for (let n = 0; n < this._motionData.curveCount; ++n) if (e == t.at(n).id) return t.at(n).fadeOutTime;
		return -1;
	}
	/**
	* 自動エフェクトがかかっているパラメータIDリストの設定
	* @param eyeBlinkParameterIds    自動まばたきがかかっているパラメータIDのリスト
	* @param lipSyncParameterIds     リップシンクがかかっているパラメータIDのリスト
	*/
	setEffectIds(e, t) {
		this._eyeBlinkParameterIds = e, this._lipSyncParameterIds = t;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._motionData = void 0, this._motionData = null;
	}
	/**
	*
	* @param motionQueueEntry
	* @param userTimeSeconds
	* @param time
	*/
	updateForNextLoop(e, t, n) {
		switch (this._motionBehavior) {
			case 1:
			default:
				e.setStartTime(t - n), this._isLoopFadeIn && e.setFadeInStartTime(t - n), this._onFinishedMotion != null && this._onFinishedMotion(this);
				break;
			case 0: e.setStartTime(t), this._isLoopFadeIn && e.setFadeInStartTime(t);
		}
	}
	/**
	* motion3.jsonをパースする。
	*
	* @param motionJson  motion3.jsonが読み込まれているバッファ
	* @param size        バッファのサイズ
	* @param shouldCheckMotionConsistency motion3.json整合性チェックするかどうか
	*/
	parse(e, t, n = !1) {
		let r = new kr(e, t);
		if (!r) {
			r.release(), r = void 0;
			return;
		}
		if (n && !r.hasConsistency()) {
			r.release(), D("Inconsistent motion3.json.");
			return;
		}
		this._motionData = new ur(), this._motionData.duration = r.getMotionDuration(), this._motionData.loop = r.isMotionLoop(), this._motionData.curveCount = r.getMotionCurveCount(), this._motionData.fps = r.getMotionFps(), this._motionData.eventCount = r.getEventCount();
		let i = r.getEvaluationOptionFlag(Ar.EvaluationOptionFlag_AreBeziersRistricted);
		this._fadeInSeconds = r.isExistMotionFadeInTime() ? r.getMotionFadeInTime() < 0 ? 1 : r.getMotionFadeInTime() : 1, this._fadeOutSeconds = r.isExistMotionFadeOutTime() ? r.getMotionFadeOutTime() < 0 ? 1 : r.getMotionFadeOutTime() : 1, this._motionData.curves.updateSize(this._motionData.curveCount, cr, !0), this._motionData.segments.updateSize(r.getMotionTotalSegmentCount(), sr, !0), this._motionData.points.updateSize(r.getMotionTotalPointCount(), or, !0), this._motionData.events.updateSize(this._motionData.eventCount, lr, !0);
		let a = 0, o = 0;
		for (let e = 0; e < this._motionData.curveCount; ++e) {
			r.getMotionCurveTarget(e) == Pr ? this._motionData.curves.at(e).type = G.CubismMotionCurveTarget_Model : r.getMotionCurveTarget(e) == Fr ? this._motionData.curves.at(e).type = G.CubismMotionCurveTarget_Parameter : r.getMotionCurveTarget(e) == Ir ? this._motionData.curves.at(e).type = G.CubismMotionCurveTarget_PartOpacity : E("Warning : Unable to get segment type from Curve! The number of \"CurveCount\" may be incorrect!"), this._motionData.curves.at(e).id = r.getMotionCurveId(e), this._motionData.curves.at(e).baseSegmentIndex = o, this._motionData.curves.at(e).fadeInTime = r.isExistMotionCurveFadeInTime(e) ? r.getMotionCurveFadeInTime(e) : -1, this._motionData.curves.at(e).fadeOutTime = r.isExistMotionCurveFadeOutTime(e) ? r.getMotionCurveFadeOutTime(e) : -1;
			for (let t = 0; t < r.getMotionCurveSegmentCount(e);) {
				switch (t == 0 ? (this._motionData.segments.at(o).basePointIndex = a, this._motionData.points.at(a).time = r.getMotionCurveSegment(e, t), this._motionData.points.at(a).value = r.getMotionCurveSegment(e, t + 1), a += 1, t += 2) : this._motionData.segments.at(o).basePointIndex = a - 1, r.getMotionCurveSegment(e, t)) {
					case K.CubismMotionSegmentType_Linear:
						this._motionData.segments.at(o).segmentType = K.CubismMotionSegmentType_Linear, this._motionData.segments.at(o).evaluate = Rr, this._motionData.points.at(a).time = r.getMotionCurveSegment(e, t + 1), this._motionData.points.at(a).value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					case K.CubismMotionSegmentType_Bezier:
						this._motionData.segments.at(o).segmentType = K.CubismMotionSegmentType_Bezier, i ? this._motionData.segments.at(o).evaluate = zr : this._motionData.segments.at(o).evaluate = Br, this._motionData.points.at(a).time = r.getMotionCurveSegment(e, t + 1), this._motionData.points.at(a).value = r.getMotionCurveSegment(e, t + 2), this._motionData.points.at(a + 1).time = r.getMotionCurveSegment(e, t + 3), this._motionData.points.at(a + 1).value = r.getMotionCurveSegment(e, t + 4), this._motionData.points.at(a + 2).time = r.getMotionCurveSegment(e, t + 5), this._motionData.points.at(a + 2).value = r.getMotionCurveSegment(e, t + 6), a += 3, t += 7;
						break;
					case K.CubismMotionSegmentType_Stepped:
						this._motionData.segments.at(o).segmentType = K.CubismMotionSegmentType_Stepped, this._motionData.segments.at(o).evaluate = Vr, this._motionData.points.at(a).time = r.getMotionCurveSegment(e, t + 1), this._motionData.points.at(a).value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					case K.CubismMotionSegmentType_InverseStepped:
						this._motionData.segments.at(o).segmentType = K.CubismMotionSegmentType_InverseStepped, this._motionData.segments.at(o).evaluate = Hr, this._motionData.points.at(a).time = r.getMotionCurveSegment(e, t + 1), this._motionData.points.at(a).value = r.getMotionCurveSegment(e, t + 2), a += 1, t += 3;
						break;
					default: T(0);
				}
				++this._motionData.curves.at(e).segmentCount, ++o;
			}
		}
		for (let e = 0; e < r.getEventCount(); ++e) this._motionData.events.at(e).fireTime = r.getEventTime(e), this._motionData.events.at(e).value = r.getEventValue(e);
		r.release(), r = void 0, r = null;
	}
	/**
	* モデルのパラメータ更新
	*
	* イベント発火のチェック。
	* 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
	*
	* @param beforeCheckTimeSeconds   前回のイベントチェック時間[秒]
	* @param motionTimeSeconds        今回の再生時間[秒]
	*/
	getFiredEvent(e, t) {
		this._firedEventValues.updateSize(0);
		for (let n = 0; n < this._motionData.eventCount; ++n) this._motionData.events.at(n).fireTime > e && this._motionData.events.at(n).fireTime <= t && this._firedEventValues.pushBack(new C(this._motionData.events.at(n).value.s));
		return this._firedEventValues;
	}
	/**
	* 透明度のカーブが存在するかどうかを確認する
	*
	* @returns true  -> キーが存在する
	*          false -> キーが存在しない
	*/
	isExistModelOpacity() {
		for (let e = 0; e < this._motionData.curveCount; e++) {
			let t = this._motionData.curves.at(e);
			if (t.type == G.CubismMotionCurveTarget_Model && t.id.getString().s.localeCompare(Lr) == 0) return !0;
		}
		return !1;
	}
	/**
	* 透明度のカーブのインデックスを返す
	*
	* @returns success:透明度のカーブのインデックス
	*/
	getModelOpacityIndex() {
		if (this.isExistModelOpacity()) for (let e = 0; e < this._motionData.curveCount; e++) {
			let t = this._motionData.curves.at(e);
			if (t.type == G.CubismMotionCurveTarget_Model && t.id.getString().s.localeCompare(Lr) == 0) return e;
		}
		return -1;
	}
	/**
	* 透明度のIdを返す
	*
	* @param index モーションカーブのインデックス
	* @returns success:透明度のカーブのインデックス
	*/
	getModelOpacityId(e) {
		if (e != -1) {
			let t = this._motionData.curves.at(e);
			if (t.type == G.CubismMotionCurveTarget_Model && t.id.getString().s.localeCompare(Lr) == 0) return N.getIdManager().getId(t.id.getString().s);
		}
		return null;
	}
	/**
	* 現在時間の透明度の値を返す
	*
	* @returns success:モーションの当該時間におけるOpacityの値
	*/
	getModelOpacityValue() {
		return this._modelOpacity;
	}
	/**
	* デバッグ用フラグを設定する
	*
	* @param debugMode デバッグモードの有効・無効
	*/
	setDebugMode(e) {
		this._debugMode = e;
	}
}, Kr;
((e) => {
	e.CubismMotion = Gr;
})(Kr ||= {});
function qr(e, t, n) {
	let r = e.startMotion(n, !1), i = e.getCubismMotionQueueEntry(r);
	if (!i) return !1;
	i.setStartTime(0), i.setFadeInStartTime(0);
	let a = n.getDuration(), o = i.getStartTime() + a;
	return n.doUpdateParameters(t.coreModel, o, 1, i), i.setIsFinished(!0), !0;
}
var Jr = class extends Et {
	constructor(e) {
		super(e), b(this, "definitions"), b(this, "groups", { idle: "Idle" }), b(this, "motionDataType", "arraybuffer"), b(this, "queueManager", new nr()), b(this, "expressionManager"), b(this, "eyeBlinkIds"), b(this, "lipSyncIds", ["ParamMouthOpenY"]), this.definitions = e.settings.motions ?? {}, this.eyeBlinkIds = e.settings.getEyeBlinkParameters() || [];
		let t = e.settings.getLipSyncParameters();
		t?.length && (this.lipSyncIds = t), this.init(e.options);
	}
	init(e) {
		super.init(e), this.settings.expressions && (this.expressionManager = new ar(this.settings, e)), this.queueManager.setEventCallback((e, t) => {
			let n = typeof t == "string" ? t : typeof t == "number" ? String(t) : t && typeof t == "object" ? t.s : "undefined";
			this.emit("motion:" + n);
		});
	}
	isFinished() {
		return this.queueManager.isFinished();
	}
	_startMotion(e, t, n, r) {
		if (e.setFinishedMotionHandler(t), e.setLoop(r ?? e._motionData.loop), n && n.length > 0) {
			let t = e._motionData.curves, r = $r(t), i = Xr(t);
			for (let e = 0; e < i; e++) {
				let i = Zr(t, e);
				if (!i) continue;
				let a = Qr(i);
				(!a || !n.includes(a)) && ei(r, i);
			}
			e._motionData.curves = r, e._motionData.curveCount = Xr(r);
		}
		return this.queueManager.stopAllMotions(), this.queueManager.startMotion(e, !1);
	}
	_stopAllMotions() {
		this.queueManager.stopAllMotions();
	}
	createMotion(e, t, n) {
		let r = !!this.parent.options.checkMotionConsistency, i = Gr.create(e, e.byteLength, void 0, void 0, r), a = new kr(e, e.byteLength);
		i.setLoop(a.isMotionLoop());
		let o = (t === this.groups.idle ? P.idleMotionFadingDuration : P.motionFadingDuration) / 1e3;
		return a.getMotionFadeInTime() === void 0 && i.setFadeInTime(n.FadeInTime > 0 ? n.FadeInTime : o), a.getMotionFadeOutTime() === void 0 && i.setFadeOutTime(n.FadeOutTime > 0 ? n.FadeOutTime : o), i.setEffectIds(this.createIdVector(this.eyeBlinkIds), this.createIdVector(this.lipSyncIds)), i;
	}
	getMotionFile(e) {
		return e.File;
	}
	getMotionName(e) {
		return e.File;
	}
	getSoundFile(e) {
		return e.Sound;
	}
	updateParameters(e, t) {
		return this.queueManager.doUpdateMotion(e, t);
	}
	destroy() {
		super.destroy(), this.queueManager.release(), this.queueManager = void 0;
	}
	motionLastFrame(e, t) {
		return x(this, arguments, function* (e, t, { expression: n = void 0 } = {}) {
			let r = yield this.getMotionAndApplyExpression(e, t, n);
			return r ? (this.playing = !0, qr(this.queueManager, this.parent, r), this.playing = !1, !0) : !1;
		});
	}
	createIdVector(e) {
		let t = new S(), n = N.getIdManager();
		for (let r of e) t.pushBack(n.getId(r));
		return t;
	}
};
function Yr(e) {
	return typeof e.pushBack == "function";
}
function Xr(e) {
	return Yr(e) ? e.getSize() : e.length;
}
function Zr(e, t) {
	return Yr(e) ? e.at(t) : e[t];
}
function Qr(e) {
	if (!e || typeof e != "object") return;
	let t = e.id;
	if (typeof t == "string") return t;
	if (t && typeof t.getString == "function") return t.getString().s;
}
function $r(e) {
	return Yr(e) ? new S() : [];
}
function ei(e, t) {
	Yr(e) ? e.pushBack(t) : e.push(t);
}
var ti = class extends n {
	constructor(e) {
		super(), b(this, "tag"), b(this, "manager"), b(this, "settings"), b(this, "state", new mt()), b(this, "playing", !1), b(this, "destroyed", !1), b(this, "parent"), this.settings = e.settings, this.tag = `ParallelMotionManager(${this.settings.name})`, this.state.tag = this.tag, this.manager = e.motionManager, this.parent = e;
	}
	/**
	* Starts a motion as given priority.
	* @param group - The motion group.
	* @param index - Index in the motion group.
	* @param priority - The priority to be applied. default: 2 (NORMAL)
	* @param ignoreParamIds - The ids to be ignored.
	* @param loop - Whether the motion should loop. Overrides Cubism 3/4/5 motion JSON loop metadata when specified.
	* @return Promise that resolves with true if the motion is successfully started, with false otherwise.
	*/
	startMotion(e, t) {
		return x(this, arguments, function* (e, t, n = I.NORMAL, r = {}) {
			let { ignoreParamIds: i = [], loop: a } = Array.isArray(r) ? {
				ignoreParamIds: r,
				loop: void 0
			} : r;
			if (!this.state.reserve(e, t, n)) return !1;
			let o = this.manager.definitions[e]?.[t];
			if (!o) return !1;
			let s = yield this.manager.loadMotion(e, t);
			return this.state.start(s, e, t, n) ? (F.log(this.tag, "Start motion:", this.getMotionName(o)), this.emit("motionStart", e, t, void 0), this.playing = !0, this._startMotion(s, void 0, i, a), !0) : !1;
		});
	}
	/**
	* Starts a random Motion as given priority.
	* @param group - The motion group.
	* @param priority - The priority to be applied. (default: 1 `IDLE`)
	* @param loop - Whether the motion should loop. Overrides Cubism 3/4/5 motion JSON loop metadata when specified.
	* @return Promise that resolves with true if the motion is successfully started, with false otherwise.
	*/
	startRandomMotion(e, t) {
		return x(this, arguments, function* (e, t, { loop: n = void 0 } = {}) {
			let r = this.manager.definitions[e];
			if (r?.length) {
				let i = [], a = this.manager.motionGroups[e] ?? [];
				for (let t = 0; t < r.length; t++) a[t] !== null && !this.state.isActive(e, t) && i.push(t);
				if (i.length) {
					let r = i[Math.floor(Math.random() * i.length)];
					return this.startMotion(e, r, t, { loop: n });
				}
			}
			return !1;
		});
	}
	/**
	* Stops all playing motions as well as the sound.
	*/
	stopAllMotions() {
		this._stopAllMotions(), this.state.reset();
	}
	/**
	* Updates parameters of the core model.
	* @param model - The core model.
	* @param now - Current time in milliseconds.
	* @return True if the parameters have been actually updated.
	*/
	update(e, t) {
		return this.isFinished() && (this.playing && (this.playing = !1, this.emit("motionFinish")), this.state.complete()), this.updateParameters(e, t);
	}
	/**
	* Destroys the instance.
	* @emits {@link MotionManagerEvents.destroy}
	*/
	destroy() {
		this.destroyed = !0, this.emit("destroy"), this.stopAllMotions();
	}
}, ni = class extends ti {
	constructor(e) {
		super(e), b(this, "queueManager", new nr()), this.init();
	}
	init() {
		this.queueManager.setEventCallback((e, t) => {
			let n = typeof t == "string" ? t : typeof t == "number" ? String(t) : t && typeof t == "object" ? t.s : "undefined";
			this.emit("motion:" + n);
		});
	}
	isFinished() {
		return this.queueManager.isFinished();
	}
	_startMotion(e, t, n, r) {
		if (e.setFinishedMotionHandler(t), e.setLoop(r ?? e._motionData.loop), n && n.length > 0) {
			let t = e._motionData.curves, r = si(t), i = ii(t);
			for (let e = 0; e < i; e++) {
				let i = ai(t, e);
				if (!i) continue;
				let a = oi(i);
				(!a || !n.includes(a)) && ci(r, i);
			}
			e._motionData.curves = r, e._motionData.curveCount = ii(r);
		}
		return this.queueManager.stopAllMotions(), this.queueManager.startMotion(e, !1);
	}
	_stopAllMotions() {
		this.queueManager.stopAllMotions();
	}
	updateParameters(e, t) {
		return this.queueManager.doUpdateMotion(e, t);
	}
	getMotionName(e) {
		return e.File;
	}
	destroy() {
		super.destroy(), this.queueManager.release(), this.queueManager = void 0;
	}
	playMotionLastFrame(e, t) {
		return x(this, null, function* () {
			if (!this.state.reserve(e, t, I.FORCE)) return !1;
			let n = this.manager.definitions[e]?.[t];
			if (!n) return !1;
			let r = yield this.manager.loadMotion(e, t);
			return this.state.start(r, e, t, I.FORCE) ? (F.log(this.tag, "Start motion:", this.getMotionName(n)), this.emit("motionStart", e, t, void 0), this.playing = !0, this.queueManager.stopAllMotions(), qr(this.queueManager, this.parent, r) ? (this.playing = !1, !0) : (this.playing = !1, !1)) : !1;
		});
	}
};
function ri(e) {
	return typeof e.pushBack == "function";
}
function ii(e) {
	return ri(e) ? e.getSize() : e.length;
}
function ai(e, t) {
	return ri(e) ? e.at(t) : e[t];
}
function oi(e) {
	if (!e || typeof e != "object") return;
	let t = e.id;
	if (typeof t == "string") return t;
	if (t && typeof t.getString == "function") return t.getString().s;
}
function si(e) {
	return ri(e) ? new S() : [];
}
function ci(e, t) {
	ri(e) ? e.pushBack(t) : e.push(t);
}
var X = Object.freeze({
	HitAreaPrefix: "HitArea",
	HitAreaHead: "Head",
	HitAreaBody: "Body",
	PartsIdCore: "Parts01Core",
	PartsArmPrefix: "Parts01Arm_",
	PartsArmLPrefix: "Parts01ArmL_",
	PartsArmRPrefix: "Parts01ArmR_",
	ParamAngleX: "ParamAngleX",
	ParamAngleY: "ParamAngleY",
	ParamAngleZ: "ParamAngleZ",
	ParamEyeLOpen: "ParamEyeLOpen",
	ParamEyeLSmile: "ParamEyeLSmile",
	ParamEyeROpen: "ParamEyeROpen",
	ParamEyeRSmile: "ParamEyeRSmile",
	ParamEyeBallX: "ParamEyeBallX",
	ParamEyeBallY: "ParamEyeBallY",
	ParamEyeBallForm: "ParamEyeBallForm",
	ParamBrowLY: "ParamBrowLY",
	ParamBrowRY: "ParamBrowRY",
	ParamBrowLX: "ParamBrowLX",
	ParamBrowRX: "ParamBrowRX",
	ParamBrowLAngle: "ParamBrowLAngle",
	ParamBrowRAngle: "ParamBrowRAngle",
	ParamBrowLForm: "ParamBrowLForm",
	ParamBrowRForm: "ParamBrowRForm",
	ParamMouthForm: "ParamMouthForm",
	ParamMouthOpenY: "ParamMouthOpenY",
	ParamCheek: "ParamCheek",
	ParamBodyAngleX: "ParamBodyAngleX",
	ParamBodyAngleY: "ParamBodyAngleY",
	ParamBodyAngleZ: "ParamBodyAngleZ",
	ParamBreath: "ParamBreath",
	ParamArmLA: "ParamArmLA",
	ParamArmRA: "ParamArmRA",
	ParamArmLB: "ParamArmLB",
	ParamArmRB: "ParamArmRB",
	ParamHandL: "ParamHandL",
	ParamHandR: "ParamHandR",
	ParamHairFront: "ParamHairFront",
	ParamHairSide: "ParamHairSide",
	ParamHairBack: "ParamHairBack",
	ParamHairFluffy: "ParamHairFluffy",
	ParamShoulderY: "ParamShoulderY",
	ParamBustX: "ParamBustX",
	ParamBustY: "ParamBustY",
	ParamBaseX: "ParamBaseX",
	ParamBaseY: "ParamBaseY",
	ParamNONE: "NONE:"
}), li;
((e) => {
	e.HitAreaBody = X.HitAreaBody, e.HitAreaHead = X.HitAreaHead, e.HitAreaPrefix = X.HitAreaPrefix, e.ParamAngleX = X.ParamAngleX, e.ParamAngleY = X.ParamAngleY, e.ParamAngleZ = X.ParamAngleZ, e.ParamArmLA = X.ParamArmLA, e.ParamArmLB = X.ParamArmLB, e.ParamArmRA = X.ParamArmRA, e.ParamArmRB = X.ParamArmRB, e.ParamBaseX = X.ParamBaseX, e.ParamBaseY = X.ParamBaseY, e.ParamBodyAngleX = X.ParamBodyAngleX, e.ParamBodyAngleY = X.ParamBodyAngleY, e.ParamBodyAngleZ = X.ParamBodyAngleZ, e.ParamBreath = X.ParamBreath, e.ParamBrowLAngle = X.ParamBrowLAngle, e.ParamBrowLForm = X.ParamBrowLForm, e.ParamBrowLX = X.ParamBrowLX, e.ParamBrowLY = X.ParamBrowLY, e.ParamBrowRAngle = X.ParamBrowRAngle, e.ParamBrowRForm = X.ParamBrowRForm, e.ParamBrowRX = X.ParamBrowRX, e.ParamBrowRY = X.ParamBrowRY, e.ParamBustX = X.ParamBustX, e.ParamBustY = X.ParamBustY, e.ParamCheek = X.ParamCheek, e.ParamEyeBallForm = X.ParamEyeBallForm, e.ParamEyeBallX = X.ParamEyeBallX, e.ParamEyeBallY = X.ParamEyeBallY, e.ParamEyeLOpen = X.ParamEyeLOpen, e.ParamEyeLSmile = X.ParamEyeLSmile, e.ParamEyeROpen = X.ParamEyeROpen, e.ParamEyeRSmile = X.ParamEyeRSmile, e.ParamHairBack = X.ParamHairBack, e.ParamHairFluffy = X.ParamHairFluffy, e.ParamHairFront = X.ParamHairFront, e.ParamHairSide = X.ParamHairSide, e.ParamHandL = X.ParamHandL, e.ParamHandR = X.ParamHandR, e.ParamMouthForm = X.ParamMouthForm, e.ParamMouthOpenY = X.ParamMouthOpenY, e.ParamNONE = X.ParamNONE, e.ParamShoulderY = X.ParamShoulderY, e.PartsArmLPrefix = X.PartsArmLPrefix, e.PartsArmPrefix = X.PartsArmPrefix, e.PartsArmRPrefix = X.PartsArmRPrefix, e.PartsIdCore = X.PartsIdCore;
})(li ||= {});
var ui = class e {
	/**
	* インスタンスの作成
	*/
	static create() {
		return new e();
	}
	/**
	* インスタンスの破棄
	* @param instance 対象のCubismBreath
	*/
	static delete(e) {}
	/**
	* 呼吸のパラメータの紐づけ
	* @param breathParameters 呼吸を紐づけたいパラメータのリスト
	*/
	setParameters(e) {
		this._breathParameters = e;
	}
	/**
	* 呼吸に紐づいているパラメータの取得
	* @return 呼吸に紐づいているパラメータのリスト
	*/
	getParameters() {
		return this._breathParameters;
	}
	/**
	* モデルのパラメータの更新
	* @param model 対象のモデル
	* @param deltaTimeSeconds デルタ時間[秒]
	*/
	updateParameters(e, t) {
		this._currentTime += t;
		let n = this._currentTime * 2 * Math.PI;
		for (let t = 0; t < this._breathParameters.getSize(); ++t) {
			let r = this._breathParameters.at(t);
			e.addParameterValueById(r.parameterId, r.offset + r.peak * Math.sin(n / r.cycle), r.weight);
		}
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		this._currentTime = 0;
	}
}, di = class {
	/**
	* コンストラクタ
	* @param parameterId   呼吸をひもづけるパラメータID
	* @param offset        呼吸を正弦波としたときの、波のオフセット
	* @param peak          呼吸を正弦波としたときの、波の高さ
	* @param cycle         呼吸を正弦波としたときの、波の周期
	* @param weight        パラメータへの重み
	*/
	constructor(e, t, n, r, i) {
		this.parameterId = e ?? null, this.offset = t ?? 0, this.peak = n ?? 0, this.cycle = r ?? 0, this.weight = i ?? 0;
	}
}, fi;
((e) => {
	e.BreathParameterData = di, e.CubismBreath = ui;
})(fi ||= {});
var pi = class e {
	/**
	* インスタンスを作成する
	* @param modelSetting モデルの設定情報
	* @return 作成されたインスタンス
	* @note 引数がNULLの場合、パラメータIDが設定されていない空のインスタンスを作成する。
	*/
	static create(t = null) {
		return new e(t);
	}
	/**
	* インスタンスの破棄
	* @param eyeBlink 対象のCubismEyeBlink
	*/
	static delete(e) {}
	/**
	* まばたきの間隔の設定
	* @param blinkingInterval まばたきの間隔の時間[秒]
	*/
	setBlinkingInterval(e) {
		this._blinkingIntervalSeconds = e;
	}
	/**
	* まばたきのモーションの詳細設定
	* @param closing   まぶたを閉じる動作の所要時間[秒]
	* @param closed    まぶたを閉じている動作の所要時間[秒]
	* @param opening   まぶたを開く動作の所要時間[秒]
	*/
	setBlinkingSetting(e, t, n) {
		this._closingSeconds = e, this._closedSeconds = t, this._openingSeconds = n;
	}
	/**
	* まばたきさせるパラメータIDのリストの設定
	* @param parameterIds パラメータのIDのリスト
	*/
	setParameterIds(e) {
		this._parameterIds = e;
	}
	/**
	* まばたきさせるパラメータIDのリストの取得
	* @return パラメータIDのリスト
	*/
	getParameterIds() {
		return this._parameterIds;
	}
	/**
	* モデルのパラメータの更新
	* @param model 対象のモデル
	* @param deltaTimeSeconds デルタ時間[秒]
	*/
	updateParameters(t, n) {
		this._userTimeSeconds += n;
		let r, i = 0;
		switch (this._blinkingState) {
			case 2:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closingSeconds, i >= 1 && (i = 1, this._blinkingState = 3, this._stateStartTimeSeconds = this._userTimeSeconds), r = 1 - i;
				break;
			case 3:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closedSeconds, i >= 1 && (this._blinkingState = 4, this._stateStartTimeSeconds = this._userTimeSeconds), r = 0;
				break;
			case 4:
				i = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._openingSeconds, i >= 1 && (i = 1, this._blinkingState = 1, this._nextBlinkingTime = this.determinNextBlinkingTiming()), r = i;
				break;
			case 1:
				this._nextBlinkingTime < this._userTimeSeconds && (this._blinkingState = 2, this._stateStartTimeSeconds = this._userTimeSeconds), r = 1;
				break;
			default: this._blinkingState = 1, this._nextBlinkingTime = this.determinNextBlinkingTiming(), r = 1;
		}
		e.CloseIfZero || (r = -r);
		for (let e = 0; e < this._parameterIds.getSize(); ++e) t.setParameterValueById(this._parameterIds.at(e), r);
	}
	/**
	* コンストラクタ
	* @param modelSetting モデルの設定情報
	*/
	constructor(e) {
		if (this._blinkingState = 0, this._nextBlinkingTime = 0, this._stateStartTimeSeconds = 0, this._blinkingIntervalSeconds = 4, this._closingSeconds = .1, this._closedSeconds = .05, this._openingSeconds = .15, this._userTimeSeconds = 0, this._parameterIds = new S(), e != null) for (let t = 0; t < e.getEyeBlinkParameterCount(); ++t) this._parameterIds.pushBack(e.getEyeBlinkParameterId(t));
	}
	/**
	* 次の瞬きのタイミングの決定
	*
	* @return 次のまばたきを行う時刻[秒]
	*/
	determinNextBlinkingTiming() {
		let e = Math.random();
		return this._userTimeSeconds + e * (2 * this._blinkingIntervalSeconds - 1);
	}
};
pi.CloseIfZero = !0;
var mi = pi, hi = /* @__PURE__ */ ((e) => (e[e.EyeState_First = 0] = "EyeState_First", e[e.EyeState_Interval = 1] = "EyeState_Interval", e[e.EyeState_Closing = 2] = "EyeState_Closing", e[e.EyeState_Closed = 3] = "EyeState_Closed", e[e.EyeState_Opening = 4] = "EyeState_Opening", e))(hi || {}), gi;
((e) => {
	e.CubismEyeBlink = mi, e.EyeState = hi;
})(gi ||= {});
var _i = 4, vi = 36, yi = 32, bi = class {
	/**
	* コンストラクタ
	*/
	constructor(e) {
		this._renderTextureCount = 0, this._clippingMaskBufferSize = 256, this._clippingContextListForMask = new S(), this._clippingContextListForDraw = new S(), this._channelColors = new S(), this._tmpBoundsOnModel = new he(), this._tmpMatrix = new pe(), this._tmpMatrixForMask = new pe(), this._tmpMatrixForDraw = new pe(), this._clippingContexttConstructor = e;
		let t = new w();
		t.r = 1, t.g = 0, t.b = 0, t.a = 0, this._channelColors.pushBack(t), t = new w(), t.r = 0, t.g = 1, t.b = 0, t.a = 0, this._channelColors.pushBack(t), t = new w(), t.r = 0, t.g = 0, t.b = 1, t.a = 0, this._channelColors.pushBack(t), t = new w(), t.r = 0, t.g = 0, t.b = 0, t.a = 1, this._channelColors.pushBack(t);
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		for (let e = 0; e < this._clippingContextListForMask.getSize(); e++) this._clippingContextListForMask.at(e) && (this._clippingContextListForMask.at(e).release(), this._clippingContextListForMask.set(e, void 0)), this._clippingContextListForMask.set(e, null);
		this._clippingContextListForMask = null;
		for (let e = 0; e < this._clippingContextListForDraw.getSize(); e++) this._clippingContextListForDraw.set(e, null);
		this._clippingContextListForDraw = null;
		for (let e = 0; e < this._channelColors.getSize(); e++) this._channelColors.set(e, null);
		this._channelColors = null, this._clearedFrameBufferFlags != null && this._clearedFrameBufferFlags.clear(), this._clearedFrameBufferFlags = null;
	}
	/**
	* マネージャの初期化処理
	* クリッピングマスクを使う描画オブジェクトの登録を行う
	* @param model モデルのインスタンス
	* @param renderTextureCount バッファの生成数
	*/
	initialize(e, t) {
		t % 1 != 0 && (E("The number of render textures must be specified as an integer. The decimal point is rounded down and corrected to an integer."), t = ~~t), t < 1 && E("The number of render textures must be an integer greater than or equal to 1. Set the number of render textures to 1."), this._renderTextureCount = t < 1 ? 1 : t, this._clearedFrameBufferFlags = new S(this._renderTextureCount);
		for (let t = 0; t < e.getDrawableCount(); t++) {
			if (e.getDrawableMaskCounts()[t] <= 0) {
				this._clippingContextListForDraw.pushBack(null);
				continue;
			}
			let n = this.findSameClip(e.getDrawableMasks()[t], e.getDrawableMaskCounts()[t]);
			n ?? (n = new this._clippingContexttConstructor(this, e.getDrawableMasks()[t], e.getDrawableMaskCounts()[t]), this._clippingContextListForMask.pushBack(n)), n.addClippedDrawable(t), this._clippingContextListForDraw.pushBack(n);
		}
	}
	/**
	* 既にマスクを作っているかを確認
	* 作っている様であれば該当するクリッピングマスクのインスタンスを返す
	* 作っていなければNULLを返す
	* @param drawableMasks 描画オブジェクトをマスクする描画オブジェクトのリスト
	* @param drawableMaskCounts 描画オブジェクトをマスクする描画オブジェクトの数
	* @return 該当するクリッピングマスクが存在すればインスタンスを返し、なければNULLを返す
	*/
	findSameClip(e, t) {
		for (let n = 0; n < this._clippingContextListForMask.getSize(); n++) {
			let r = this._clippingContextListForMask.at(n), i = r._clippingIdCount;
			if (i != t) continue;
			let a = 0;
			for (let t = 0; t < i; t++) {
				let n = r._clippingIdList[t];
				for (let t = 0; t < i; t++) if (e[t] == n) {
					a++;
					break;
				}
			}
			if (a == i) return r;
		}
		return null;
	}
	/**
	* 高精細マスク処理用の行列を計算する
	* @param model モデルのインスタンス
	* @param isRightHanded 処理が右手系であるか
	*/
	setupMatrixForHighPrecision(e, t) {
		let n = 0;
		for (let t = 0; t < this._clippingContextListForMask.getSize(); t++) {
			let r = this._clippingContextListForMask.at(t);
			this.calcClippedDrawTotalBounds(e, r), r._isUsing && n++;
		}
		if (n > 0) {
			if (this.setupLayoutBounds(0), this._clearedFrameBufferFlags.getSize() != this._renderTextureCount) {
				this._clearedFrameBufferFlags.clear();
				for (let e = 0; e < this._renderTextureCount; e++) this._clearedFrameBufferFlags.pushBack(!1);
			} else for (let e = 0; e < this._renderTextureCount; e++) this._clearedFrameBufferFlags.set(e, !1);
			for (let n = 0; n < this._clippingContextListForMask.getSize(); n++) {
				let r = this._clippingContextListForMask.at(n), i = r._allClippedDrawRect, a = r._layoutBounds, o = .05, s = 0, c = 0, l = e.getPixelsPerUnit(), u = r.getClippingManager().getClippingMaskBufferSize(), d = a.width * u, f = a.height * u;
				this._tmpBoundsOnModel.setRect(i), this._tmpBoundsOnModel.width * l > d ? (this._tmpBoundsOnModel.expand(i.width * o, 0), s = a.width / this._tmpBoundsOnModel.width) : s = l / d, this._tmpBoundsOnModel.height * l > f ? (this._tmpBoundsOnModel.expand(0, i.height * o), c = a.height / this._tmpBoundsOnModel.height) : c = l / f, this.createMatrixForMask(t, a, s, c), r._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), r._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
			}
		}
	}
	/**
	* マスク作成・描画用の行列を作成する。
	* @param isRightHanded 座標を右手系として扱うかを指定
	* @param layoutBoundsOnTex01 マスクを収める領域
	* @param scaleX 描画オブジェクトの伸縮率
	* @param scaleY 描画オブジェクトの伸縮率
	*/
	createMatrixForMask(e, t, n, r) {
		this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(-1, -1), this._tmpMatrix.scaleRelative(2, 2), this._tmpMatrix.translateRelative(t.x, t.y), this._tmpMatrix.scaleRelative(n, r), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray()), this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(t.x, t.y * (e ? -1 : 1)), this._tmpMatrix.scaleRelative(n, r * (e ? -1 : 1)), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
	}
	/**
	* クリッピングコンテキストを配置するレイアウト
	* 指定された数のレンダーテクスチャを極力いっぱいに使ってマスクをレイアウトする
	* マスクグループの数が4以下ならRGBA各チャンネルに一つずつマスクを配置し、5以上6以下ならRGBAを2,2,1,1と配置する。
	*
	* @param usingClipCount 配置するクリッピングコンテキストの数
	*/
	setupLayoutBounds(e) {
		let t = this._renderTextureCount <= 1 ? vi : yi * this._renderTextureCount;
		if (e <= 0 || e > t) {
			e > t && D("not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}", e - t, this._renderTextureCount, e);
			for (let e = 0; e < this._clippingContextListForMask.getSize(); e++) {
				let t = this._clippingContextListForMask.at(e);
				t._layoutChannelIndex = 0, t._layoutBounds.x = 0, t._layoutBounds.y = 0, t._layoutBounds.width = 1, t._layoutBounds.height = 1, t._bufferIndex = 0;
			}
			return;
		}
		let n = this._renderTextureCount <= 1 ? 9 : 8, r = e / this._renderTextureCount, i = e % this._renderTextureCount;
		r = Math.ceil(r);
		let a = r / _i, o = r % _i;
		a = ~~a;
		let s = 0;
		for (let r = 0; r < this._renderTextureCount; r++) for (let c = 0; c < _i; c++) {
			let l = a + +(c < o), u = o + (a < 1 ? -1 : 0);
			if (c == u && i > 0 && (l -= r < i ? 0 : 1), l != 0) {
				if (l == 1) {
					let e = this._clippingContextListForMask.at(s++);
					e._layoutChannelIndex = c, e._layoutBounds.x = 0, e._layoutBounds.y = 0, e._layoutBounds.width = 1, e._layoutBounds.height = 1, e._bufferIndex = r;
				} else if (l == 2) for (let e = 0; e < l; e++) {
					let t = e % 2;
					t = ~~t;
					let n = this._clippingContextListForMask.at(s++);
					n._layoutChannelIndex = c, n._layoutBounds.x = t * .5, n._layoutBounds.y = 0, n._layoutBounds.width = .5, n._layoutBounds.height = 1, n._bufferIndex = r;
				}
				else if (l <= 4) for (let e = 0; e < l; e++) {
					let t = e % 2, n = e / 2;
					t = ~~t, n = ~~n;
					let i = this._clippingContextListForMask.at(s++);
					i._layoutChannelIndex = c, i._layoutBounds.x = t * .5, i._layoutBounds.y = n * .5, i._layoutBounds.width = .5, i._layoutBounds.height = .5, i._bufferIndex = r;
				}
				else if (l <= n) for (let e = 0; e < l; e++) {
					let t = e % 3, n = e / 3;
					t = ~~t, n = ~~n;
					let i = this._clippingContextListForMask.at(s++);
					i._layoutChannelIndex = c, i._layoutBounds.x = t / 3, i._layoutBounds.y = n / 3, i._layoutBounds.width = 1 / 3, i._layoutBounds.height = 1 / 3, i._bufferIndex = r;
				}
				else {
					D("not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}", e - t, this._renderTextureCount, e);
					for (let e = 0; e < l; e++) {
						let e = this._clippingContextListForMask.at(s++);
						e._layoutChannelIndex = 0, e._layoutBounds.x = 0, e._layoutBounds.y = 0, e._layoutBounds.width = 1, e._layoutBounds.height = 1, e._bufferIndex = 0;
					}
				}
			}
		}
	}
	/**
	* マスクされる描画オブジェクト群全体を囲む矩形（モデル座標系）を計算する
	* @param model モデルのインスタンス
	* @param clippingContext クリッピングマスクのコンテキスト
	*/
	calcClippedDrawTotalBounds(e, t) {
		let n = Number.MAX_VALUE, r = Number.MAX_VALUE, i = Number.MIN_VALUE, a = Number.MIN_VALUE, o = t._clippedDrawableIndexList.length;
		for (let s = 0; s < o; s++) {
			let o = t._clippedDrawableIndexList[s], c = e.getDrawableVertexCount(o), l = e.getDrawableVertices(o), u = Number.MAX_VALUE, d = Number.MAX_VALUE, f = -Number.MAX_VALUE, p = -Number.MAX_VALUE, m = c * qe.vertexStep;
			for (let e = qe.vertexOffset; e < m; e += qe.vertexStep) {
				let t = l[e], n = l[e + 1];
				t < u && (u = t), t > f && (f = t), n < d && (d = n), n > p && (p = n);
			}
			if (u != Number.MAX_VALUE) {
				if (u < n && (n = u), d < r && (r = d), f > i && (i = f), p > a && (a = p), n == Number.MAX_VALUE) t._allClippedDrawRect.x = 0, t._allClippedDrawRect.y = 0, t._allClippedDrawRect.width = 0, t._allClippedDrawRect.height = 0, t._isUsing = !1;
				else {
					t._isUsing = !0;
					let e = i - n, o = a - r;
					t._allClippedDrawRect.x = n, t._allClippedDrawRect.y = r, t._allClippedDrawRect.width = e, t._allClippedDrawRect.height = o;
				}
			}
		}
	}
	/**
	* 画面描画に使用するクリッピングマスクのリストを取得する
	* @return 画面描画に使用するクリッピングマスクのリスト
	*/
	getClippingContextListForDraw() {
		return this._clippingContextListForDraw;
	}
	/**
	* クリッピングマスクバッファのサイズを取得する
	* @return クリッピングマスクバッファのサイズ
	*/
	getClippingMaskBufferSize() {
		return this._clippingMaskBufferSize;
	}
	/**
	* このバッファのレンダーテクスチャの枚数を取得する
	* @return このバッファのレンダーテクスチャの枚数
	*/
	getRenderTextureCount() {
		return this._renderTextureCount;
	}
	/**
	* カラーチャンネル（RGBA）のフラグを取得する
	* @param channelNo カラーチャンネル（RGBA）の番号（0:R, 1:G, 2:B, 3:A）
	*/
	getChannelFlagAsColor(e) {
		return this._channelColors.at(e);
	}
	/**
	* クリッピングマスクバッファのサイズを設定する
	* @param size クリッピングマスクバッファのサイズ
	*/
	setClippingMaskBufferSize(e) {
		this._clippingMaskBufferSize = e;
	}
}, xi, Si = 10, Ci = class {
	/**
	* コンストラクタ
	*/
	constructor() {
		this._shaderSets = new S();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this.releaseShaderProgram();
	}
	/**
	* 描画用のシェーダプログラムの一連のセットアップを実行する
	* @param renderer レンダラー
	* @param model 描画対象のモデル
	* @param index 描画対象のメッシュのインデックス
	*/
	setupShaderProgramForDraw(e, t, n) {
		e.isPremultipliedAlpha() || D("NoPremultipliedAlpha is not allowed"), this._shaderSets.getSize() == 0 && this.generateShaders();
		let r, i, a, o, s = e.getClippingContextBufferForDraw() != null, c = t.getDrawableInvertedMaskBit(n), l = s ? c ? 2 : 1 : 0, u;
		switch (t.getDrawableBlendMode(n)) {
			case ve.CubismBlendMode_Normal:
			default:
				u = this._shaderSets.at(1 + l), r = this.gl.ONE, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ONE, o = this.gl.ONE_MINUS_SRC_ALPHA;
				break;
			case ve.CubismBlendMode_Additive:
				u = this._shaderSets.at(4 + l), r = this.gl.ONE, i = this.gl.ONE, a = this.gl.ZERO, o = this.gl.ONE;
				break;
			case ve.CubismBlendMode_Multiplicative: u = this._shaderSets.at(7 + l), r = this.gl.DST_COLOR, i = this.gl.ONE_MINUS_SRC_ALPHA, a = this.gl.ZERO, o = this.gl.ONE;
		}
		this.gl.useProgram(u.shaderProgram), e._bufferData.vertex ?? (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex);
		let d = t.getDrawableVertices(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, d, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.attributePositionLocation), this.gl.vertexAttribPointer(u.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let f = t.getDrawableVertexUvs(n);
		if (this.gl.bufferData(this.gl.ARRAY_BUFFER, f, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(u.attributeTexCoordLocation), this.gl.vertexAttribPointer(u.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0), s) {
			this.gl.activeTexture(this.gl.TEXTURE1);
			let t = e.getClippingContextBufferForDraw().getClippingManager().getColorBuffer().at(e.getClippingContextBufferForDraw()._bufferIndex);
			this.gl.bindTexture(this.gl.TEXTURE_2D, t), this.gl.uniform1i(u.samplerTexture1Location, 1), this.gl.uniformMatrix4fv(u.uniformClipMatrixLocation, !1, e.getClippingContextBufferForDraw()._matrixForDraw.getArray());
			let n = e.getClippingContextBufferForDraw()._layoutChannelIndex, r = e.getClippingContextBufferForDraw().getClippingManager().getChannelFlagAsColor(n);
			this.gl.uniform4f(u.uniformChannelFlagLocation, r.r, r.g, r.b, r.a);
		}
		let p = t.getDrawableTextureIndex(n), m = e.getBindedTextures().getValue(p);
		this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, m), this.gl.uniform1i(u.samplerTexture0Location, 0);
		let h = e.getMvpMatrix();
		this.gl.uniformMatrix4fv(u.uniformMatrixLocation, !1, h.getArray());
		let g = e.getModelColorWithOpacity(t.getDrawableOpacity(n)), _ = t.getMultiplyColor(n), v = t.getScreenColor(n);
		this.gl.uniform4f(u.uniformBaseColorLocation, g.r, g.g, g.b, g.a), this.gl.uniform4f(u.uniformMultiplyColorLocation, _.r, _.g, _.b, _.a), this.gl.uniform4f(u.uniformScreenColorLocation, v.r, v.g, v.b, v.a), e._bufferData.index ?? (e._bufferData.index = this.gl.createBuffer());
		let ee = t.getDrawableVertexIndices(n);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e._bufferData.index), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, ee, this.gl.DYNAMIC_DRAW), this.gl.blendFuncSeparate(r, i, a, o);
	}
	/**
	* マスク用のシェーダプログラムの一連のセットアップを実行する
	* @param renderer レンダラー
	* @param model 描画対象のモデル
	* @param index 描画対象のメッシュのインデックス
	*/
	setupShaderProgramForMask(e, t, n) {
		e.isPremultipliedAlpha() || D("NoPremultipliedAlpha is not allowed"), this._shaderSets.getSize() == 0 && this.generateShaders();
		let r = this._shaderSets.at(0);
		this.gl.useProgram(r.shaderProgram), e._bufferData.vertex ?? (e._bufferData.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.vertex);
		let i = t.getDrawableVertices(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, i, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(r.attributePositionLocation), this.gl.vertexAttribPointer(r.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let a = t.getDrawableTextureIndex(n), o = e.getBindedTextures().getValue(a);
		this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, o), this.gl.uniform1i(r.samplerTexture0Location, 0), e._bufferData.uv ?? (e._bufferData.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, e._bufferData.uv);
		let s = t.getDrawableVertexUvs(n);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, s, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(r.attributeTexCoordLocation), this.gl.vertexAttribPointer(r.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0), e.getClippingContextBufferForMask();
		let c = e.getClippingContextBufferForMask()._layoutChannelIndex, l = e.getClippingContextBufferForMask().getClippingManager().getChannelFlagAsColor(c);
		this.gl.uniform4f(r.uniformChannelFlagLocation, l.r, l.g, l.b, l.a), this.gl.uniformMatrix4fv(r.uniformClipMatrixLocation, !1, e.getClippingContextBufferForMask()._matrixForMask.getArray());
		let u = e.getClippingContextBufferForMask()._layoutBounds;
		this.gl.uniform4f(r.uniformBaseColorLocation, u.x * 2 - 1, u.y * 2 - 1, u.getRight() * 2 - 1, u.getBottom() * 2 - 1);
		let d = t.getMultiplyColor(n), f = t.getScreenColor(n);
		this.gl.uniform4f(r.uniformMultiplyColorLocation, d.r, d.g, d.b, d.a), this.gl.uniform4f(r.uniformScreenColorLocation, f.r, f.g, f.b, f.a);
		let p = this.gl.ZERO, m = this.gl.ONE_MINUS_SRC_COLOR, h = this.gl.ZERO, g = this.gl.ONE_MINUS_SRC_ALPHA;
		e._bufferData.index ?? (e._bufferData.index = this.gl.createBuffer());
		let _ = t.getDrawableVertexIndices(n);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, e._bufferData.index), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, _, this.gl.DYNAMIC_DRAW), this.gl.blendFuncSeparate(p, m, h, g);
	}
	/**
	* シェーダープログラムを解放する
	*/
	releaseShaderProgram() {
		for (let e = 0; e < this._shaderSets.getSize(); e++) this.gl.deleteProgram(this._shaderSets.at(e).shaderProgram), this._shaderSets.at(e).shaderProgram = 0, this._shaderSets.set(e, void 0), this._shaderSets.set(e, null);
	}
	/**
	* シェーダープログラムを初期化する
	* @param vertShaderSrc 頂点シェーダのソース
	* @param fragShaderSrc フラグメントシェーダのソース
	*/
	generateShaders() {
		for (let e = 0; e < Si; e++) this._shaderSets.pushBack(new Ti());
		this._shaderSets.at(0).shaderProgram = this.loadShaderProgram(Di, Oi), this._shaderSets.at(1).shaderProgram = this.loadShaderProgram(ki, ji), this._shaderSets.at(2).shaderProgram = this.loadShaderProgram(Ai, Mi), this._shaderSets.at(3).shaderProgram = this.loadShaderProgram(Ai, Ni), this._shaderSets.at(4).shaderProgram = this._shaderSets.at(1).shaderProgram, this._shaderSets.at(5).shaderProgram = this._shaderSets.at(2).shaderProgram, this._shaderSets.at(6).shaderProgram = this._shaderSets.at(3).shaderProgram, this._shaderSets.at(7).shaderProgram = this._shaderSets.at(1).shaderProgram, this._shaderSets.at(8).shaderProgram = this._shaderSets.at(2).shaderProgram, this._shaderSets.at(9).shaderProgram = this._shaderSets.at(3).shaderProgram, this._shaderSets.at(0).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, "a_position"), this._shaderSets.at(0).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, "a_texCoord"), this._shaderSets.at(0).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "s_texture0"), this._shaderSets.at(0).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "u_clipMatrix"), this._shaderSets.at(0).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "u_channelFlag"), this._shaderSets.at(0).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "u_baseColor"), this._shaderSets.at(0).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "u_multiplyColor"), this._shaderSets.at(0).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, "u_screenColor"), this._shaderSets.at(1).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, "a_position"), this._shaderSets.at(1).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, "a_texCoord"), this._shaderSets.at(1).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, "s_texture0"), this._shaderSets.at(1).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, "u_matrix"), this._shaderSets.at(1).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, "u_baseColor"), this._shaderSets.at(1).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, "u_multiplyColor"), this._shaderSets.at(1).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, "u_screenColor"), this._shaderSets.at(2).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, "a_position"), this._shaderSets.at(2).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, "a_texCoord"), this._shaderSets.at(2).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "s_texture0"), this._shaderSets.at(2).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "s_texture1"), this._shaderSets.at(2).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_matrix"), this._shaderSets.at(2).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_clipMatrix"), this._shaderSets.at(2).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_channelFlag"), this._shaderSets.at(2).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_baseColor"), this._shaderSets.at(2).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_multiplyColor"), this._shaderSets.at(2).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, "u_screenColor"), this._shaderSets.at(3).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, "a_position"), this._shaderSets.at(3).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, "a_texCoord"), this._shaderSets.at(3).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "s_texture0"), this._shaderSets.at(3).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "s_texture1"), this._shaderSets.at(3).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_matrix"), this._shaderSets.at(3).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_clipMatrix"), this._shaderSets.at(3).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_channelFlag"), this._shaderSets.at(3).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_baseColor"), this._shaderSets.at(3).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_multiplyColor"), this._shaderSets.at(3).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, "u_screenColor"), this._shaderSets.at(4).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, "a_position"), this._shaderSets.at(4).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, "a_texCoord"), this._shaderSets.at(4).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, "s_texture0"), this._shaderSets.at(4).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, "u_matrix"), this._shaderSets.at(4).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, "u_baseColor"), this._shaderSets.at(4).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, "u_multiplyColor"), this._shaderSets.at(4).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, "u_screenColor"), this._shaderSets.at(5).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, "a_position"), this._shaderSets.at(5).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, "a_texCoord"), this._shaderSets.at(5).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "s_texture0"), this._shaderSets.at(5).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "s_texture1"), this._shaderSets.at(5).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_matrix"), this._shaderSets.at(5).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_clipMatrix"), this._shaderSets.at(5).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_channelFlag"), this._shaderSets.at(5).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_baseColor"), this._shaderSets.at(5).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_multiplyColor"), this._shaderSets.at(5).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, "u_screenColor"), this._shaderSets.at(6).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, "a_position"), this._shaderSets.at(6).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, "a_texCoord"), this._shaderSets.at(6).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "s_texture0"), this._shaderSets.at(6).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "s_texture1"), this._shaderSets.at(6).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_matrix"), this._shaderSets.at(6).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_clipMatrix"), this._shaderSets.at(6).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_channelFlag"), this._shaderSets.at(6).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_baseColor"), this._shaderSets.at(6).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_multiplyColor"), this._shaderSets.at(6).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, "u_screenColor"), this._shaderSets.at(7).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, "a_position"), this._shaderSets.at(7).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, "a_texCoord"), this._shaderSets.at(7).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, "s_texture0"), this._shaderSets.at(7).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, "u_matrix"), this._shaderSets.at(7).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, "u_baseColor"), this._shaderSets.at(7).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, "u_multiplyColor"), this._shaderSets.at(7).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, "u_screenColor"), this._shaderSets.at(8).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, "a_position"), this._shaderSets.at(8).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, "a_texCoord"), this._shaderSets.at(8).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "s_texture0"), this._shaderSets.at(8).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "s_texture1"), this._shaderSets.at(8).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_matrix"), this._shaderSets.at(8).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_clipMatrix"), this._shaderSets.at(8).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_channelFlag"), this._shaderSets.at(8).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_baseColor"), this._shaderSets.at(8).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_multiplyColor"), this._shaderSets.at(8).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, "u_screenColor"), this._shaderSets.at(9).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, "a_position"), this._shaderSets.at(9).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, "a_texCoord"), this._shaderSets.at(9).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "s_texture0"), this._shaderSets.at(9).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "s_texture1"), this._shaderSets.at(9).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_matrix"), this._shaderSets.at(9).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_clipMatrix"), this._shaderSets.at(9).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_channelFlag"), this._shaderSets.at(9).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_baseColor"), this._shaderSets.at(9).uniformMultiplyColorLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_multiplyColor"), this._shaderSets.at(9).uniformScreenColorLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, "u_screenColor");
	}
	/**
	* シェーダプログラムをロードしてアドレスを返す
	* @param vertexShaderSource    頂点シェーダのソース
	* @param fragmentShaderSource  フラグメントシェーダのソース
	* @return シェーダプログラムのアドレス
	*/
	loadShaderProgram(e, t) {
		let n = this.gl.createProgram(), r = this.compileShaderSource(this.gl.VERTEX_SHADER, e);
		if (!r) return D("Vertex shader compile error!"), 0;
		let i = this.compileShaderSource(this.gl.FRAGMENT_SHADER, t);
		return i ? (this.gl.attachShader(n, r), this.gl.attachShader(n, i), this.gl.linkProgram(n), this.gl.getProgramParameter(n, this.gl.LINK_STATUS) ? (this.gl.deleteShader(r), this.gl.deleteShader(i), n) : (D("Failed to link program: {0}", n), this.gl.deleteShader(r), r = 0, this.gl.deleteShader(i), i = 0, n &&= (this.gl.deleteProgram(n), 0), 0)) : (D("Vertex shader compile error!"), 0);
	}
	/**
	* シェーダープログラムをコンパイルする
	* @param shaderType シェーダタイプ(Vertex/Fragment)
	* @param shaderSource シェーダソースコード
	*
	* @return コンパイルされたシェーダープログラム
	*/
	compileShaderSource(e, t) {
		let n = t, r = this.gl.createShader(e);
		return this.gl.shaderSource(r, n), this.gl.compileShader(r), !r && D("Shader compile log: {0} ", this.gl.getShaderInfoLog(r)), this.gl.getShaderParameter(r, this.gl.COMPILE_STATUS) ? r : (this.gl.deleteShader(r), null);
	}
	setGl(e) {
		this.gl = e;
	}
}, wi = class e {
	/**
	* インスタンスを取得する（シングルトン）
	* @return インスタンス
	*/
	static getInstance() {
		return xi ??= new e(), xi;
	}
	/**
	* インスタンスを開放する（シングルトン）
	*/
	static deleteInstance() {
		xi &&= (xi.release(), null);
	}
	/**
	* Privateなコンストラクタ
	*/
	constructor() {
		this._shaderMap = new O();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		for (let e = this._shaderMap.begin(); e.notEqual(this._shaderMap.end()); e.preIncrement()) e.ptr().second.release();
		this._shaderMap.clear();
	}
	/**
	* GLContextをキーにShaderを取得する
	* @param gl
	* @returns
	*/
	getShader(e) {
		return this._shaderMap.getValue(e);
	}
	/**
	* GLContextを登録する
	* @param gl
	*/
	setGlContext(e) {
		if (!this._shaderMap.isExist(e)) {
			let t = new Ci();
			t.setGl(e), this._shaderMap.setValue(e, t);
		}
	}
}, Ti = class {}, Ei = /* @__PURE__ */ ((e) => (e[e.ShaderNames_SetupMask = 0] = "ShaderNames_SetupMask", e[e.ShaderNames_NormalPremultipliedAlpha = 1] = "ShaderNames_NormalPremultipliedAlpha", e[e.ShaderNames_NormalMaskedPremultipliedAlpha = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha", e[e.ShaderNames_NomralMaskedInvertedPremultipliedAlpha = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha", e[e.ShaderNames_AddPremultipliedAlpha = 4] = "ShaderNames_AddPremultipliedAlpha", e[e.ShaderNames_AddMaskedPremultipliedAlpha = 5] = "ShaderNames_AddMaskedPremultipliedAlpha", e[e.ShaderNames_AddMaskedPremultipliedAlphaInverted = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted", e[e.ShaderNames_MultPremultipliedAlpha = 7] = "ShaderNames_MultPremultipliedAlpha", e[e.ShaderNames_MultMaskedPremultipliedAlpha = 8] = "ShaderNames_MultMaskedPremultipliedAlpha", e[e.ShaderNames_MultMaskedPremultipliedAlphaInverted = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted", e))(Ei || {}), Di = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_myPos;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_clipMatrix * a_position;   v_myPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}", Oi = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_myPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;void main(){   float isInside =        step(u_baseColor.x, v_myPos.x/v_myPos.w)       * step(u_baseColor.y, v_myPos.y/v_myPos.w)       * step(v_myPos.x/v_myPos.w, u_baseColor.z)       * step(v_myPos.y/v_myPos.w, u_baseColor.w);   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;}", ki = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;uniform mat4       u_matrix;void main(){   gl_Position = u_matrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}", Ai = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform mat4       u_matrix;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_matrix * a_position;   v_clipPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}", ji = "precision mediump float;varying vec2       v_texCoord;uniform vec4       u_baseColor;uniform sampler2D  s_texture0;uniform vec4       u_multiplyColor;uniform vec4       u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 color = texColor * u_baseColor;   gl_FragColor = vec4(color.rgb, color.a);}", Mi = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;uniform sampler2D  s_texture1;uniform vec4       u_multiplyColor;uniform vec4       u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 col_formask = texColor * u_baseColor;   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;   col_formask = col_formask * maskVal;   gl_FragColor = col_formask;}", Ni = "precision mediump float;varying vec2      v_texCoord;varying vec4      v_clipPos;uniform sampler2D s_texture0;uniform sampler2D s_texture1;uniform vec4      u_channelFlag;uniform vec4      u_baseColor;uniform vec4      u_multiplyColor;uniform vec4      u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 col_formask = texColor * u_baseColor;   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;   col_formask = col_formask * (1.0 - maskVal);   gl_FragColor = col_formask;}", Pi;
((e) => {
	e.CubismShaderSet = Ti, e.CubismShader_WebGL = Ci, e.CubismShaderManager_WebGL = wi, e.ShaderNames = Ei;
})(Pi ||= {});
var Z, Fi, Ii = class extends bi {
	/**
	* テンポラリのレンダーテクスチャのアドレスを取得する
	* FrameBufferObjectが存在しない場合、新しく生成する
	*
	* @return レンダーテクスチャの配列
	*/
	getMaskRenderTexture() {
		if (this._maskTexture && this._maskTexture.textures != null) this._maskTexture.frameNo = this._currentFrameNo;
		else {
			this._maskRenderTextures != null && this._maskRenderTextures.clear(), this._maskRenderTextures = new S(), this._maskColorBuffers != null && this._maskColorBuffers.clear(), this._maskColorBuffers = new S();
			let e = this._clippingMaskBufferSize;
			for (let t = 0; t < this._renderTextureCount; t++) this._maskColorBuffers.pushBack(this.gl.createTexture()), this.gl.bindTexture(this.gl.TEXTURE_2D, this._maskColorBuffers.at(t)), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, e, e, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.bindTexture(this.gl.TEXTURE_2D, null), this._maskRenderTextures.pushBack(this.gl.createFramebuffer()), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTextures.at(t)), this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._maskColorBuffers.at(t), 0);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, Fi), this._maskTexture = new Li(this._currentFrameNo, this._maskRenderTextures);
		}
		return this._maskTexture.textures;
	}
	/**
	* WebGLレンダリングコンテキストを設定する
	* @param gl WebGLレンダリングコンテキスト
	*/
	setGL(e) {
		this.gl = e;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		super(Ri);
	}
	/**
	* クリッピングコンテキストを作成する。モデル描画時に実行する。
	* @param model モデルのインスタンス
	* @param renderer レンダラのインスタンス
	*/
	setupClippingContext(e, t) {
		this._currentFrameNo++;
		let n = 0;
		for (let t = 0; t < this._clippingContextListForMask.getSize(); t++) {
			let r = this._clippingContextListForMask.at(t);
			this.calcClippedDrawTotalBounds(e, r), r._isUsing && n++;
		}
		if (n > 0) {
			this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize), this._currentMaskRenderTexture = this.getMaskRenderTexture().at(0), t.preDraw(), this.setupLayoutBounds(n), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture), this._clearedFrameBufferFlags.getSize() != this._renderTextureCount && (this._clearedFrameBufferFlags.clear(), this._clearedFrameBufferFlags = new S(this._renderTextureCount));
			for (let e = 0; e < this._clearedFrameBufferFlags.getSize(); e++) this._clearedFrameBufferFlags.set(e, !1);
			for (let n = 0; n < this._clippingContextListForMask.getSize(); n++) {
				let r = this._clippingContextListForMask.at(n), i = r._allClippedDrawRect, a = r._layoutBounds, o = .05, s = 0, c = 0, l = this.getMaskRenderTexture().at(r._bufferIndex);
				this._currentMaskRenderTexture != l && (this._currentMaskRenderTexture = l, t.preDraw(), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture)), this._tmpBoundsOnModel.setRect(i), this._tmpBoundsOnModel.expand(i.width * o, i.height * o), s = a.width / this._tmpBoundsOnModel.width, c = a.height / this._tmpBoundsOnModel.height, this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(-1, -1), this._tmpMatrix.scaleRelative(2, 2), this._tmpMatrix.translateRelative(a.x, a.y), this._tmpMatrix.scaleRelative(s, c), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray()), this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(a.x, a.y), this._tmpMatrix.scaleRelative(s, c), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray()), r._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), r._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
				let u = r._clippingIdCount;
				for (let n = 0; n < u; n++) {
					let i = r._clippingIdList[n];
					e.getDrawableDynamicFlagVertexPositionsDidChange(i) && (t.setIsCulling(e.getDrawableCulling(i) != 0), this._clearedFrameBufferFlags.at(r._bufferIndex) || (this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT), this._clearedFrameBufferFlags.set(r._bufferIndex, !0)), t.setClippingContextBufferForMask(r), t.drawMeshWebGL(e, i));
				}
			}
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, Fi), t.setClippingContextBufferForMask(null), this.gl.viewport(Z[0], Z[1], Z[2], Z[3]);
		}
	}
	/**
	* カラーバッファを取得する
	* @return カラーバッファ
	*/
	getColorBuffer() {
		return this._maskColorBuffers;
	}
	/**
	* マスクの合計数をカウント
	* @returns
	*/
	getClippingMaskCount() {
		return this._clippingContextListForMask.getSize();
	}
}, Li = class {
	/**
	* 引数付きコンストラクタ
	* @param frameNo レンダラーのフレーム番号
	* @param texture テクスチャのアドレス
	*/
	constructor(e, t) {
		this.frameNo = e, this.textures = t;
	}
}, Ri = class extends ye {
	/**
	* 引数付きコンストラクタ
	*/
	constructor(e, t, n) {
		super(t, n), this._owner = e;
	}
	/**
	* このマスクを管理するマネージャのインスタンスを取得する
	* @return クリッピングマネージャのインスタンス
	*/
	getClippingManager() {
		return this._owner;
	}
	setGl(e) {
		this._owner.setGL(e);
	}
}, zi = class {
	setGlEnable(e, t) {
		t ? this.gl.enable(e) : this.gl.disable(e);
	}
	setGlEnableVertexAttribArray(e, t) {
		t ? this.gl.enableVertexAttribArray(e) : this.gl.disableVertexAttribArray(e);
	}
	save() {
		if (this.gl == null) {
			D("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		this._lastArrayBufferBinding = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING), this._lastElementArrayBufferBinding = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING), this._lastProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM), this._lastActiveTexture = this.gl.getParameter(this.gl.ACTIVE_TEXTURE), this.gl.activeTexture(this.gl.TEXTURE1), this._lastTexture1Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D), this.gl.activeTexture(this.gl.TEXTURE0), this._lastTexture0Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D), this._lastVertexAttribArrayEnabled[0] = this.gl.getVertexAttrib(0, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[1] = this.gl.getVertexAttrib(1, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[2] = this.gl.getVertexAttrib(2, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastVertexAttribArrayEnabled[3] = this.gl.getVertexAttrib(3, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED), this._lastScissorTest = this.gl.isEnabled(this.gl.SCISSOR_TEST), this._lastStencilTest = this.gl.isEnabled(this.gl.STENCIL_TEST), this._lastDepthTest = this.gl.isEnabled(this.gl.DEPTH_TEST), this._lastCullFace = this.gl.isEnabled(this.gl.CULL_FACE), this._lastBlend = this.gl.isEnabled(this.gl.BLEND), this._lastFrontFace = this.gl.getParameter(this.gl.FRONT_FACE), this._lastColorMask = this.gl.getParameter(this.gl.COLOR_WRITEMASK), this._lastBlending[0] = this.gl.getParameter(this.gl.BLEND_SRC_RGB), this._lastBlending[1] = this.gl.getParameter(this.gl.BLEND_DST_RGB), this._lastBlending[2] = this.gl.getParameter(this.gl.BLEND_SRC_ALPHA), this._lastBlending[3] = this.gl.getParameter(this.gl.BLEND_DST_ALPHA), this._lastFBO = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING), this._lastViewport = this.gl.getParameter(this.gl.VIEWPORT);
	}
	restore() {
		if (this.gl == null) {
			D("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		this.gl.useProgram(this._lastProgram), this.setGlEnableVertexAttribArray(0, this._lastVertexAttribArrayEnabled[0]), this.setGlEnableVertexAttribArray(1, this._lastVertexAttribArrayEnabled[1]), this.setGlEnableVertexAttribArray(2, this._lastVertexAttribArrayEnabled[2]), this.setGlEnableVertexAttribArray(3, this._lastVertexAttribArrayEnabled[3]), this.setGlEnable(this.gl.SCISSOR_TEST, this._lastScissorTest), this.setGlEnable(this.gl.STENCIL_TEST, this._lastStencilTest), this.setGlEnable(this.gl.DEPTH_TEST, this._lastDepthTest), this.setGlEnable(this.gl.CULL_FACE, this._lastCullFace), this.setGlEnable(this.gl.BLEND, this._lastBlend), this.gl.frontFace(this._lastFrontFace), this.gl.colorMask(this._lastColorMask[0], this._lastColorMask[1], this._lastColorMask[2], this._lastColorMask[3]), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._lastArrayBufferBinding), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._lastElementArrayBufferBinding), this.gl.activeTexture(this.gl.TEXTURE1), this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture1Binding2D), this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture0Binding2D), this.gl.activeTexture(this._lastActiveTexture), this.gl.blendFuncSeparate(this._lastBlending[0], this._lastBlending[1], this._lastBlending[2], this._lastBlending[3]);
	}
	setGl(e) {
		this.gl = e;
	}
	constructor() {
		this._lastVertexAttribArrayEnabled = [
			,
			,
			,
			,
		], this._lastColorMask = [
			,
			,
			,
			,
		], this._lastBlending = [
			,
			,
			,
			,
		], this._lastViewport = [
			,
			,
			,
			,
		];
	}
}, Bi = class extends _e {
	/**
	* レンダラの初期化処理を実行する
	* 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
	*
	* @param model モデルのインスタンス
	* @param maskBufferCount バッファの生成数
	*/
	initialize(e, t = 1) {
		e.isUsingMasking() && (this._clippingManager = new Ii(), this._clippingManager.initialize(e, t)), this._sortedDrawableIndexList.resize(e.getDrawableCount(), 0), super.initialize(e);
	}
	/**
	* WebGLテクスチャのバインド処理
	* CubismRendererにテクスチャを設定し、CubismRenderer内でその画像を参照するためのIndex値を戻り値とする
	* @param modelTextureNo セットするモデルテクスチャの番号
	* @param glTextureNo WebGLテクスチャの番号
	*/
	bindTexture(e, t) {
		this._textures.setValue(e, t);
	}
	/**
	* WebGLにバインドされたテクスチャのリストを取得する
	* @return テクスチャのリスト
	*/
	getBindedTextures() {
		return this._textures;
	}
	/**
	* クリッピングマスクバッファのサイズを設定する
	* マスク用のFrameBufferを破棄、再作成する為処理コストは高い
	* @param size クリッピングマスクバッファのサイズ
	*/
	setClippingMaskBufferSize(e) {
		if (!this._model.isUsingMasking()) return;
		let t = this._clippingManager.getRenderTextureCount();
		this._clippingManager.release(), this._clippingManager = void 0, this._clippingManager = null, this._clippingManager = new Ii(), this._clippingManager.setClippingMaskBufferSize(e), this._clippingManager.initialize(this.getModel(), t);
	}
	/**
	* クリッピングマスクバッファのサイズを取得する
	* @return クリッピングマスクバッファのサイズ
	*/
	getClippingMaskBufferSize() {
		return this._model.isUsingMasking() ? this._clippingManager.getClippingMaskBufferSize() : -1;
	}
	/**
	* レンダーテクスチャの枚数を取得する
	* @return レンダーテクスチャの枚数
	*/
	getRenderTextureCount() {
		return this._model.isUsingMasking() ? this._clippingManager.getRenderTextureCount() : -1;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		super(), this._clippingContextBufferForMask = null, this._clippingContextBufferForDraw = null, this._rendererProfile = new zi(), this.firstDraw = !0, this._textures = new O(), this._sortedDrawableIndexList = new S(), this._bufferData = {
			vertex: WebGLBuffer = null,
			uv: WebGLBuffer = null,
			index: WebGLBuffer = null
		}, this._textures.prepareCapacity(32, !0);
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._clippingManager &&= (this._clippingManager.release(), this._clippingManager = void 0, null), this.gl != null && (this.gl.deleteBuffer(this._bufferData.vertex), this._bufferData.vertex = null, this.gl.deleteBuffer(this._bufferData.uv), this._bufferData.uv = null, this.gl.deleteBuffer(this._bufferData.index), this._bufferData.index = null, this._bufferData = null, this._textures = null);
	}
	/**
	* モデルを描画する実際の処理
	*/
	doDrawModel() {
		if (this.gl == null) {
			D("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
			return;
		}
		this._clippingManager != null && (this.preDraw(), this.isUsingHighPrecisionMask() ? this._clippingManager.setupMatrixForHighPrecision(this.getModel(), !1) : this._clippingManager.setupClippingContext(this.getModel(), this)), this.preDraw();
		let e = this.getModel().getDrawableCount(), t = this.getModel().getDrawableRenderOrders();
		for (let n = 0; n < e; ++n) {
			let e = t[n];
			this._sortedDrawableIndexList.set(e, n);
		}
		for (let t = 0; t < e; ++t) {
			let e = this._sortedDrawableIndexList.at(t);
			if (!this.getModel().getDrawableDynamicFlagIsVisible(e)) continue;
			let n = this._clippingManager == null ? null : this._clippingManager.getClippingContextListForDraw().at(e);
			if (n != null && this.isUsingHighPrecisionMask()) {
				n._isUsing && (this.gl.viewport(0, 0, this._clippingManager.getClippingMaskBufferSize(), this._clippingManager.getClippingMaskBufferSize()), this.preDraw(), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, n.getClippingManager().getMaskRenderTexture().at(n._bufferIndex)), this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT));
				{
					let e = n._clippingIdCount;
					for (let t = 0; t < e; t++) {
						let e = n._clippingIdList[t];
						this._model.getDrawableDynamicFlagVertexPositionsDidChange(e) && (this.setIsCulling(this._model.getDrawableCulling(e) != 0), this.setClippingContextBufferForMask(n), this.drawMeshWebGL(this._model, e));
					}
				}
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, Fi), this.setClippingContextBufferForMask(null), this.gl.viewport(Z[0], Z[1], Z[2], Z[3]), this.preDraw();
			}
			this.setClippingContextBufferForDraw(n), this.setIsCulling(this.getModel().getDrawableCulling(e)), this.drawMeshWebGL(this._model, e);
		}
	}
	/**
	* 描画オブジェクト（アートメッシュ）を描画する。
	* @param model 描画対象のモデル
	* @param index 描画対象のメッシュのインデックス
	*/
	drawMeshWebGL(e, t) {
		this.isCulling() ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE), this.gl.frontFace(this.gl.CCW), this.isGeneratingMask() ? wi.getInstance().getShader(this.gl).setupShaderProgramForMask(this, e, t) : wi.getInstance().getShader(this.gl).setupShaderProgramForDraw(this, e, t);
		{
			let n = e.getDrawableVertexIndexCount(t);
			this.gl.drawElements(this.gl.TRIANGLES, n, this.gl.UNSIGNED_SHORT, 0);
		}
		this.gl.useProgram(null), this.setClippingContextBufferForDraw(null), this.setClippingContextBufferForMask(null);
	}
	saveProfile() {
		this._rendererProfile.save();
	}
	restoreProfile() {
		this._rendererProfile.restore();
	}
	/**
	* レンダラが保持する静的なリソースを解放する
	* WebGLの静的なシェーダープログラムを解放する
	*/
	static doStaticRelease() {
		wi.deleteInstance();
	}
	/**
	* レンダーステートを設定する
	* @param fbo アプリケーション側で指定しているフレームバッファ
	* @param viewport ビューポート
	*/
	setRenderState(e, t) {
		Fi = e, Z = t;
	}
	/**
	* 描画開始時の追加処理
	* モデルを描画する前にクリッピングマスクに必要な処理を実装している
	*/
	preDraw() {
		if (this.firstDraw &&= !1, this.gl.disable(this.gl.SCISSOR_TEST), this.gl.disable(this.gl.STENCIL_TEST), this.gl.disable(this.gl.DEPTH_TEST), this.gl.frontFace(this.gl.CW), this.gl.enable(this.gl.BLEND), this.gl.colorMask(!0, !0, !0, !0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null), this.getAnisotropy() > 0 && this._extension) for (let e = 0; e < this._textures.getSize(); ++e) this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures.getValue(e)), this.gl.texParameterf(this.gl.TEXTURE_2D, this._extension.TEXTURE_MAX_ANISOTROPY_EXT, this.getAnisotropy());
	}
	/**
	* マスクテクスチャに描画するクリッピングコンテキストをセットする
	*/
	setClippingContextBufferForMask(e) {
		this._clippingContextBufferForMask = e;
	}
	/**
	* マスクテクスチャに描画するクリッピングコンテキストを取得する
	* @return マスクテクスチャに描画するクリッピングコンテキスト
	*/
	getClippingContextBufferForMask() {
		return this._clippingContextBufferForMask;
	}
	/**
	* 画面上に描画するクリッピングコンテキストをセットする
	*/
	setClippingContextBufferForDraw(e) {
		this._clippingContextBufferForDraw = e;
	}
	/**
	* 画面上に描画するクリッピングコンテキストを取得する
	* @return 画面上に描画するクリッピングコンテキスト
	*/
	getClippingContextBufferForDraw() {
		return this._clippingContextBufferForDraw;
	}
	/**
	* マスク生成時かを判定する
	* @returns 判定値
	*/
	isGeneratingMask() {
		return this.getClippingContextBufferForMask() != null;
	}
	/**
	* glの設定
	*/
	startUp(e) {
		this.gl = e, this._clippingManager && this._clippingManager.setGL(e), wi.getInstance().setGlContext(e), this._rendererProfile.setGl(e), this._extension = this.gl.getExtension("EXT_texture_filter_anisotropic") || this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
	}
};
_e.staticRelease = () => {
	Bi.doStaticRelease();
};
var Vi;
((e) => {
	e.CubismClippingContext = Ri, e.CubismClippingManager_WebGL = Ii, e.CubismRenderTextureResource = Li, e.CubismRenderer_WebGL = Bi;
})(Vi ||= {});
var Hi = new pe(), Ui = 36, Wi = 32, Gi = 16, Ki = 64, qi = 3, Ji = 4096, Yi = .5, Xi = 24, Zi = {
	CenterX: "centerX",
	centerX: "centerX",
	center_x: "centerX",
	CenterY: "centerY",
	centerY: "centerY",
	center_y: "centerY",
	X: "x",
	x: "x",
	Y: "y",
	y: "y",
	Width: "width",
	width: "width",
	Height: "height",
	height: "height",
	Top: "top",
	top: "top",
	Bottom: "bottom",
	bottom: "bottom",
	Left: "left",
	left: "left",
	Right: "right",
	right: "right"
};
function Qi(e) {
	if (!e.isUsingMasking()) return 1;
	let t = e.getDrawableMaskCounts(), n = e.getDrawableMasks(), r = /* @__PURE__ */ new Set();
	for (let i = 0; i < e.getDrawableCount(); i++) {
		let e = t[i];
		if (!e || e <= 0) continue;
		let a = Array.from(n[i] ?? []).slice(0, e).sort((e, t) => e - t).join(",");
		r.add(a);
	}
	let i = r.size;
	return i <= Ui ? 1 : Math.ceil(i / Wi);
}
function $i(e) {
	let t = e.getDrawableMaskCounts(), n = e.getDrawableMasks(), r = /* @__PURE__ */ new Set(), i = e.getDrawableCount(), a = 0, o = 0, s = 0, c = 0;
	for (let l = 0; l < i; l++) {
		let i = e.getDrawableVertexCount(l), u = t[l] ?? 0;
		if (c += i, u <= 0) continue;
		a++, s += i, o = Math.max(o, u);
		let d = Array.from(n[l] ?? []).slice(0, u).sort((e, t) => e - t).join(",");
		r.add(d);
	}
	return {
		maskedDrawableCount: a,
		uniqueMaskSetCount: r.size,
		maxMasksPerDrawable: o,
		maskedVertexCount: s,
		totalVertexCount: c
	};
}
function ea(e) {
	if (!e.isUsingMasking()) return !1;
	let t = $i(e), n = t.totalVertexCount > 0 ? t.maskedVertexCount / t.totalVertexCount : 0;
	return t.uniqueMaskSetCount > Gi || t.maskedDrawableCount > Ki || t.maxMasksPerDrawable >= qi || t.maskedVertexCount > Ji || n >= Yi && t.maskedDrawableCount > Xi;
}
function ta(e, t) {
	return typeof t == "boolean" ? t : ea(e);
}
var na = class extends Ut {
	constructor(e, t, n) {
		super(), b(this, "settings"), b(this, "options"), b(this, "coreModel"), b(this, "motionManager"), b(this, "parallelMotionManager"), b(this, "lipSync", !0), b(this, "breath", ui.create()), b(this, "eyeBlink"), b(this, "renderer", new Bi()), b(this, "idManager"), b(this, "idParamAngleX"), b(this, "idParamAngleY"), b(this, "idParamAngleZ"), b(this, "idParamEyeBallX"), b(this, "idParamEyeBallY"), b(this, "idParamBodyAngleX"), b(this, "idParamBreath"), b(this, "idParamMouthForm"), b(this, "pixelsPerUnit", 1), b(this, "modelTransform", new a()), this.coreModel = e, this.settings = t, this.options = Object.assign({}, {
			breathDepth: 1,
			lipSyncGain: 1.5,
			lipSyncWeight: .4
		}, n), this.idManager = N.getIdManager(), this.idParamAngleX = this.getIdSafe(X.ParamAngleX), this.idParamAngleY = this.getIdSafe(X.ParamAngleY), this.idParamAngleZ = this.getIdSafe(X.ParamAngleZ), this.idParamEyeBallX = this.getIdSafe(X.ParamEyeBallX), this.idParamEyeBallY = this.getIdSafe(X.ParamEyeBallY), this.idParamBodyAngleX = this.getIdSafe(X.ParamBodyAngleX), this.idParamBreath = this.getIdSafe(X.ParamBreath), this.idParamMouthForm = this.getIdSafe(X.ParamMouthForm), this.motionManager = new Jr(this), this.parallelMotionManager = [], this.init();
	}
	init() {
		var e;
		super.init();
		let t = this.settings.getEyeBlinkParameters();
		if (this.options.eyeBlink !== !1 && t.length) {
			let n = new S();
			for (let e of t) n.pushBack(this.idManager.getId(e));
			let r = mi.create();
			(e = r.setParameterIds) == null || e.call(r, n), this.eyeBlink = r;
		}
		let n = new S();
		n.pushBack(new di(this.idParamAngleX, 0, 15 * this.options.breathDepth, 6.5345, .5)), n.pushBack(new di(this.idParamAngleY, 0, 8 * this.options.breathDepth, 3.5345, .5)), n.pushBack(new di(this.idParamAngleZ, 0, 10 * this.options.breathDepth, 5.5345, .5)), n.pushBack(new di(this.idParamBodyAngleX, 0, 4 * this.options.breathDepth, 15.5345, .5)), n.pushBack(new di(this.idParamBreath, 0, .5, 3.2345, .5)), this.breath.setParameters(n), this.renderer.initialize(this.coreModel, Qi(this.coreModel)), this.renderer.useHighPrecisionMask(ta(this.coreModel, this.options.useHighPrecisionMask)), this.renderer.setIsPremultipliedAlpha(!0);
	}
	getIdSafe(e) {
		return this.idManager.getId(e ?? "");
	}
	getSize() {
		return [this.coreModel.getModel().canvasinfo.CanvasWidth, this.coreModel.getModel().canvasinfo.CanvasHeight];
	}
	getLayout() {
		let e = {}, t = this.settings.layout;
		if (t) for (let [n, r] of Object.entries(t)) {
			let t = Zi[n];
			t && typeof r == "number" && (e[t] = r);
		}
		return e;
	}
	setupLayout() {
		let e = this, t = this.getSize();
		e.originalWidth = t[0], e.originalHeight = t[1], e.pixelsPerUnit = this.coreModel.getModel().canvasinfo.PixelsPerUnit;
		let n = Bt(this.localTransform, this.originalWidth, this.originalHeight, this.getLayout());
		e.width = n.width, e.height = n.height, this.modelTransform.identity().scale(this.pixelsPerUnit, this.pixelsPerUnit).translate(this.originalWidth / 2, this.originalHeight / 2);
	}
	updateWebGLContext(e, t) {
		this.renderer.firstDraw = !0, this.renderer._bufferData = {
			vertex: null,
			uv: null,
			index: null
		}, this.renderer.startUp(e), this.renderer._clippingManager && (this.renderer._clippingManager._currentFrameNo = t), wi.getInstance().setGlContext(e);
	}
	bindTexture(e, t) {
		this.renderer.bindTexture(e, t);
	}
	getHitAreaDefs() {
		let e = this.settings.json;
		return Vt(this.settings.hitAreas ?? e.HitAreas ?? e.hitAreas ?? e.hit_areas, (e) => this.coreModel.getDrawableIndex(this.idManager.getId(e)));
	}
	getDrawableIDs() {
		let e = this.coreModel.getDrawableCount(), t = [];
		for (let n = 0; n < e; n++) t.push(this.coreModel.getDrawableId(n).getString().s);
		return t;
	}
	getDrawableIndex(e) {
		return this.coreModel.getDrawableIndex(this.idManager.getId(e));
	}
	getDrawableVertices(e) {
		if (typeof e == "string") {
			let t = e;
			if (e = this.getDrawableIndex(t), e === -1) throw TypeError("Unable to find drawable ID: " + t);
		}
		let t = this.coreModel.getDrawableVertices(e).slice();
		for (let e = 0; e < t.length; e += 2) t[e] = t[e] * this.pixelsPerUnit + this.originalWidth / 2, t[e + 1] = -t[e + 1] * this.pixelsPerUnit + this.originalHeight / 2;
		return t;
	}
	updateTransform(e) {
		this.drawingMatrix.copyFrom(this.modelTransform).prepend(this.localTransform).prepend(e);
	}
	update(e, t) {
		var n, r, i, a, o;
		super.update(e, t), e /= 1e3, t /= 1e3;
		let s = this.coreModel, c = this.updateMotions(s, t);
		if (s.saveParameters(), (n = this.motionManager.expressionManager) == null || n.update(s, t), c || (i = (r = this.eyeBlink)?.updateParameters) == null || i.call(r, s, e), this.updateFocus(), this.updateNaturalMovements(e * 1e3, t * 1e3), this.lipSync && this.motionManager.currentAudio) {
			let e = this.motionManager.mouthSync() * this.options.lipSyncGain;
			e **= 1.15, e = $e(e, e > 0 ? .1 : 0, 1), this.motionManager.lipSyncIds.forEach((t) => {
				s.addParameterValueById(this.getIdSafe(t), e, this.options.lipSyncWeight);
			});
		}
		(a = this.physics) == null || a.evaluate(s, e), (o = this.pose) == null || o.updateParameters(s, e), this.emit("beforeModelUpdate"), s.update(), s.loadParameters();
	}
	updateFocus() {
		this.coreModel.addParameterValueById(this.idParamEyeBallX, this.focusController.x), this.coreModel.addParameterValueById(this.idParamEyeBallY, this.focusController.y), this.coreModel.addParameterValueById(this.idParamAngleX, this.focusController.x * 30), this.coreModel.addParameterValueById(this.idParamAngleY, this.focusController.y * 30), this.coreModel.addParameterValueById(this.idParamAngleZ, this.focusController.x * this.focusController.y * -30), this.coreModel.addParameterValueById(this.idParamBodyAngleX, this.focusController.x * 10);
	}
	updateFacialEmotion(e) {
		this.coreModel.addParameterValueById(this.idParamMouthForm, e);
	}
	updateNaturalMovements(e, t) {
		var n;
		(n = this.breath) == null || n.updateParameters(this.coreModel, e / 1e3);
	}
	draw(e) {
		let t = this.drawingMatrix, n = Hi.getArray();
		n[0] = t.a, n[1] = t.b, n[4] = -t.c, n[5] = -t.d, n[12] = t.tx, n[13] = t.ty, this.renderer.setMvpMatrix(Hi);
		let r = e.getParameter(e.FRAMEBUFFER_BINDING), i = e.getParameter(e.CULL_FACE_MODE), a = n[0] * n[5] - n[1] * n[4];
		e.cullFace(a < 0 ? e.FRONT : e.BACK), this.renderer.setRenderState(r, this.viewport);
		try {
			this.renderer.drawModel();
		} finally {
			e.cullFace(i);
		}
	}
	extendParallelMotionManager(e) {
		for (; this.parallelMotionManager.length < e;) this.parallelMotionManager.push(new ni(this));
	}
	destroy() {
		super.destroy(), this.renderer.release(), this.coreModel.release(), this.renderer = void 0, this.coreModel = void 0;
	}
}, ra = class {}, ia;
((e) => {
	e.ICubismModelSetting = ra;
})(ia ||= {});
var aa = /* @__PURE__ */ ((e) => (e[e.FrequestNode_Groups = 0] = "FrequestNode_Groups", e[e.FrequestNode_Moc = 1] = "FrequestNode_Moc", e[e.FrequestNode_Motions = 2] = "FrequestNode_Motions", e[e.FrequestNode_Expressions = 3] = "FrequestNode_Expressions", e[e.FrequestNode_Textures = 4] = "FrequestNode_Textures", e[e.FrequestNode_Physics = 5] = "FrequestNode_Physics", e[e.FrequestNode_Pose = 6] = "FrequestNode_Pose", e[e.FrequestNode_HitAreas = 7] = "FrequestNode_HitAreas", e))(aa || {}), oa = class extends ra {
	/**
	* 引数付きコンストラクタ
	*
	* @param buffer    Model3Jsonをバイト配列として読み込んだデータバッファ
	* @param size      Model3Jsonのデータサイズ
	*/
	constructor(e, t) {
		super(), this.version = "Version", this.fileReferences = "FileReferences", this.groups = "Groups", this.layout = "Layout", this.hitAreas = "HitAreas", this.moc = "Moc", this.textures = "Textures", this.physics = "Physics", this.pose = "Pose", this.expressions = "Expressions", this.motions = "Motions", this.userData = "UserData", this.name = "Name", this.filePath = "File", this.id = "Id", this.ids = "Ids", this.target = "Target", this.idle = "Idle", this.tapBody = "TapBody", this.pinchIn = "PinchIn", this.pinchOut = "PinchOut", this.shake = "Shake", this.flickHead = "FlickHead", this.parameter = "Parameter", this.soundPath = "Sound", this.fadeInTime = "FadeInTime", this.fadeOutTime = "FadeOutTime", this.centerX = "CenterX", this.centerY = "CenterY", this.x = "X", this.y = "Y", this.width = "Width", this.height = "Height", this.lipSync = "LipSync", this.eyeBlink = "EyeBlink", this.initParameter = "init_param", this.initPartsVisible = "init_parts_visible", this.val = "val", this._json = A.create(e, t), this.getJson() && (this._jsonValue = new S(), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.groups)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.moc)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.motions)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.expressions)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.textures)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.physics)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.pose)), this._jsonValue.pushBack(this.getJson().getRoot().getValueByString(this.hitAreas)));
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		A.delete(this._json), this._jsonValue = null;
	}
	/**
	* CubismJsonオブジェクトを取得する
	*
	* @return CubismJson
	*/
	getJson() {
		return this._json;
	}
	/**
	* Mocファイルの名前を取得する
	* @return Mocファイルの名前
	*/
	getModelFileName() {
		return this.isExistModelFile() ? this._jsonValue.at(1).getRawString() : "";
	}
	/**
	* モデルが使用するテクスチャの数を取得する
	* テクスチャの数
	*/
	getTextureCount() {
		return this.isExistTextureFiles() ? this._jsonValue.at(4).getSize() : 0;
	}
	/**
	* テクスチャが配置されたディレクトリの名前を取得する
	* @return テクスチャが配置されたディレクトリの名前
	*/
	getTextureDirectory() {
		let e = this._jsonValue.at(4).getValueByIndex(0).getRawString().split("/"), t = e.length - 1, n = "";
		for (let r = 0; r < t; r++) n += e[r], r < t - 1 && (n += "/");
		return n;
	}
	/**
	* モデルが使用するテクスチャの名前を取得する
	* @param index 配列のインデックス値
	* @return テクスチャの名前
	*/
	getTextureFileName(e) {
		return this._jsonValue.at(4).getValueByIndex(e).getRawString();
	}
	/**
	* モデルに設定された当たり判定の数を取得する
	* @return モデルに設定された当たり判定の数
	*/
	getHitAreasCount() {
		return this.isExistHitAreas() ? this._jsonValue.at(7).getSize() : 0;
	}
	/**
	* 当たり判定に設定されたIDを取得する
	*
	* @param index 配列のindex
	* @return 当たり判定に設定されたID
	*/
	getHitAreaId(e) {
		return N.getIdManager().getId(this._jsonValue.at(7).getValueByIndex(e).getValueByString(this.id).getRawString());
	}
	/**
	* 当たり判定に設定された名前を取得する
	* @param index 配列のインデックス値
	* @return 当たり判定に設定された名前
	*/
	getHitAreaName(e) {
		return this._jsonValue.at(7).getValueByIndex(e).getValueByString(this.name).getRawString();
	}
	/**
	* 物理演算設定ファイルの名前を取得する
	* @return 物理演算設定ファイルの名前
	*/
	getPhysicsFileName() {
		return this.isExistPhysicsFile() ? this._jsonValue.at(5).getRawString() : "";
	}
	/**
	* パーツ切り替え設定ファイルの名前を取得する
	* @return パーツ切り替え設定ファイルの名前
	*/
	getPoseFileName() {
		return this.isExistPoseFile() ? this._jsonValue.at(6).getRawString() : "";
	}
	/**
	* 表情設定ファイルの数を取得する
	* @return 表情設定ファイルの数
	*/
	getExpressionCount() {
		return this.isExistExpressionFile() ? this._jsonValue.at(3).getSize() : 0;
	}
	/**
	* 表情設定ファイルを識別する名前（別名）を取得する
	* @param index 配列のインデックス値
	* @return 表情の名前
	*/
	getExpressionName(e) {
		return this._jsonValue.at(3).getValueByIndex(e).getValueByString(this.name).getRawString();
	}
	/**
	* 表情設定ファイルの名前を取得する
	* @param index 配列のインデックス値
	* @return 表情設定ファイルの名前
	*/
	getExpressionFileName(e) {
		return this._jsonValue.at(3).getValueByIndex(e).getValueByString(this.filePath).getRawString();
	}
	/**
	* モーショングループの数を取得する
	* @return モーショングループの数
	*/
	getMotionGroupCount() {
		return this.isExistMotionGroups() ? this._jsonValue.at(2).getKeys().getSize() : 0;
	}
	/**
	* モーショングループの名前を取得する
	* @param index 配列のインデックス値
	* @return モーショングループの名前
	*/
	getMotionGroupName(e) {
		return this.isExistMotionGroups() ? this._jsonValue.at(2).getKeys().at(e) : null;
	}
	/**
	* モーショングループに含まれるモーションの数を取得する
	* @param groupName モーショングループの名前
	* @return モーショングループの数
	*/
	getMotionCount(e) {
		return this.isExistMotionGroupName(e) ? this._jsonValue.at(2).getValueByString(e).getSize() : 0;
	}
	/**
	* グループ名とインデックス値からモーションファイル名を取得する
	* @param groupName モーショングループの名前
	* @param index     配列のインデックス値
	* @return モーションファイルの名前
	*/
	getMotionFileName(e, t) {
		return this.isExistMotionGroupName(e) ? this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.filePath).getRawString() : "";
	}
	/**
	* モーションに対応するサウンドファイルの名前を取得する
	* @param groupName モーショングループの名前
	* @param index 配列のインデックス値
	* @return サウンドファイルの名前
	*/
	getMotionSoundFileName(e, t) {
		return this.isExistMotionSoundFile(e, t) ? this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.soundPath).getRawString() : "";
	}
	/**
	* モーション開始時のフェードイン処理時間を取得する
	* @param groupName モーショングループの名前
	* @param index 配列のインデックス値
	* @return フェードイン処理時間[秒]
	*/
	getMotionFadeInTimeValue(e, t) {
		return this.isExistMotionFadeIn(e, t) ? this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.fadeInTime).toFloat() : -1;
	}
	/**
	* モーション終了時のフェードアウト処理時間を取得する
	* @param groupName モーショングループの名前
	* @param index 配列のインデックス値
	* @return フェードアウト処理時間[秒]
	*/
	getMotionFadeOutTimeValue(e, t) {
		return this.isExistMotionFadeOut(e, t) ? this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.fadeOutTime).toFloat() : -1;
	}
	/**
	* ユーザーデータのファイル名を取得する
	* @return ユーザーデータのファイル名
	*/
	getUserDataFile() {
		return this.isExistUserDataFile() ? this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.userData).getRawString() : "";
	}
	/**
	* レイアウト情報を取得する
	* @param outLayoutMap csmMapクラスのインスタンス
	* @return true レイアウト情報が存在する
	* @return false レイアウト情報が存在しない
	*/
	getLayoutMap(e) {
		let t = this.getJson().getRoot().getValueByString(this.layout).getMap();
		if (t == null) return !1;
		let n = !1;
		for (let r = t.begin(); r.notEqual(t.end()); r.preIncrement()) e.setValue(r.ptr().first, r.ptr().second.toFloat()), n = !0;
		return n;
	}
	/**
	* 目パチに関連付けられたパラメータの数を取得する
	* @return 目パチに関連付けられたパラメータの数
	*/
	getEyeBlinkParameterCount() {
		if (!this.isExistEyeBlinkParameters()) return 0;
		let e = 0;
		for (let t = 0; t < this._jsonValue.at(0).getSize(); t++) {
			let n = this._jsonValue.at(0).getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.eyeBlink) {
				e = n.getValueByString(this.ids).getVector().getSize();
				break;
			}
		}
		return e;
	}
	/**
	* 目パチに関連付けられたパラメータのIDを取得する
	* @param index 配列のインデックス値
	* @return パラメータID
	*/
	getEyeBlinkParameterId(e) {
		if (!this.isExistEyeBlinkParameters()) return null;
		for (let t = 0; t < this._jsonValue.at(0).getSize(); t++) {
			let n = this._jsonValue.at(0).getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.eyeBlink) return N.getIdManager().getId(n.getValueByString(this.ids).getValueByIndex(e).getRawString());
		}
		return null;
	}
	/**
	* リップシンクに関連付けられたパラメータの数を取得する
	* @return リップシンクに関連付けられたパラメータの数
	*/
	getLipSyncParameterCount() {
		if (!this.isExistLipSyncParameters()) return 0;
		let e = 0;
		for (let t = 0; t < this._jsonValue.at(0).getSize(); t++) {
			let n = this._jsonValue.at(0).getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.lipSync) {
				e = n.getValueByString(this.ids).getVector().getSize();
				break;
			}
		}
		return e;
	}
	/**
	* リップシンクに関連付けられたパラメータの数を取得する
	* @param index 配列のインデックス値
	* @return パラメータID
	*/
	getLipSyncParameterId(e) {
		if (!this.isExistLipSyncParameters()) return null;
		for (let t = 0; t < this._jsonValue.at(0).getSize(); t++) {
			let n = this._jsonValue.at(0).getValueByIndex(t);
			if (!(n.isNull() || n.isError()) && n.getValueByString(this.name).getRawString() == this.lipSync) return N.getIdManager().getId(n.getValueByString(this.ids).getValueByIndex(e).getRawString());
		}
		return null;
	}
	/**
	* モデルファイルのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistModelFile() {
		let e = this._jsonValue.at(1);
		return !e.isNull() && !e.isError();
	}
	/**
	* テクスチャファイルのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistTextureFiles() {
		let e = this._jsonValue.at(4);
		return !e.isNull() && !e.isError();
	}
	/**
	* 当たり判定のキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistHitAreas() {
		let e = this._jsonValue.at(7);
		return !e.isNull() && !e.isError();
	}
	/**
	* 物理演算ファイルのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistPhysicsFile() {
		let e = this._jsonValue.at(5);
		return !e.isNull() && !e.isError();
	}
	/**
	* ポーズ設定ファイルのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistPoseFile() {
		let e = this._jsonValue.at(6);
		return !e.isNull() && !e.isError();
	}
	/**
	* 表情設定ファイルのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistExpressionFile() {
		let e = this._jsonValue.at(3);
		return !e.isNull() && !e.isError();
	}
	/**
	* モーショングループのキーが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistMotionGroups() {
		let e = this._jsonValue.at(2);
		return !e.isNull() && !e.isError();
	}
	/**
	* 引数で指定したモーショングループのキーが存在するかどうかを確認する
	* @param groupName  グループ名
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistMotionGroupName(e) {
		let t = this._jsonValue.at(2).getValueByString(e);
		return !t.isNull() && !t.isError();
	}
	/**
	* 引数で指定したモーションに対応するサウンドファイルのキーが存在するかどうかを確認する
	* @param groupName  グループ名
	* @param index 配列のインデックス値
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistMotionSoundFile(e, t) {
		let n = this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.soundPath);
		return !n.isNull() && !n.isError();
	}
	/**
	* 引数で指定したモーションに対応するフェードイン時間のキーが存在するかどうかを確認する
	* @param groupName  グループ名
	* @param index 配列のインデックス値
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistMotionFadeIn(e, t) {
		let n = this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.fadeInTime);
		return !n.isNull() && !n.isError();
	}
	/**
	* 引数で指定したモーションに対応するフェードアウト時間のキーが存在するかどうかを確認する
	* @param groupName  グループ名
	* @param index 配列のインデックス値
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistMotionFadeOut(e, t) {
		let n = this._jsonValue.at(2).getValueByString(e).getValueByIndex(t).getValueByString(this.fadeOutTime);
		return !n.isNull() && !n.isError();
	}
	/**
	* UserDataのファイル名が存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistUserDataFile() {
		let e = this.getJson().getRoot().getValueByString(this.fileReferences).getValueByString(this.userData);
		return !e.isNull() && !e.isError();
	}
	/**
	* 目ぱちに対応付けられたパラメータが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistEyeBlinkParameters() {
		if (this._jsonValue.at(0).isNull() || this._jsonValue.at(0).isError()) return !1;
		for (let e = 0; e < this._jsonValue.at(0).getSize(); ++e) if (this._jsonValue.at(0).getValueByIndex(e).getValueByString(this.name).getRawString() == this.eyeBlink) return !0;
		return !1;
	}
	/**
	* リップシンクに対応付けられたパラメータが存在するかどうかを確認する
	* @return true キーが存在する
	* @return false キーが存在しない
	*/
	isExistLipSyncParameters() {
		if (this._jsonValue.at(0).isNull() || this._jsonValue.at(0).isError()) return !1;
		for (let e = 0; e < this._jsonValue.at(0).getSize(); ++e) if (this._jsonValue.at(0).getValueByIndex(e).getValueByString(this.name).getRawString() == this.lipSync) return !0;
		return !1;
	}
}, sa;
((e) => {
	e.CubismModelSettingJson = oa, e.FrequestNode = aa;
})(sa ||= {});
var ca = [X.ParamEyeLOpen, X.ParamEyeROpen], la = class e extends pt {
	constructor(t) {
		if (super(t), b(this, "moc"), b(this, "textures"), b(this, "layout"), b(this, "hitAreas"), b(this, "expressions"), b(this, "motions"), !e.isValidJSON(t)) throw TypeError("Invalid JSON.");
		let n = new TextEncoder().encode(JSON.stringify(t)).buffer;
		Object.assign(this, new oa(n, n.byteLength)), this.moc = t.FileReferences.Moc, this.textures = [...t.FileReferences.Textures], this.pose = t.FileReferences.Pose, this.physics = t.FileReferences.Physics, this.expressions = t.FileReferences.Expressions?.filter((e) => !!e && typeof e.File == "string"), this.motions = t.FileReferences.Motions ?? t.Motions, this.layout = t.Layout, this.hitAreas = t.HitAreas;
		let r = this.getFileStem(this.moc);
		this.setModelName(r, this.name);
	}
	static isValidJSON(e) {
		if (!e || typeof e != "object") return !1;
		let t = e.FileReferences;
		if (!t || typeof t != "object" || typeof t.Moc != "string") return !1;
		let n = t.Textures;
		if (!Array.isArray(n) || n.length === 0 || !n.every((e) => typeof e == "string")) return !1;
		let r = t.Expressions, i = (e) => !!e && typeof e.File == "string";
		return r === void 0 || !!Array.isArray(r) && !r.some((e) => !i(e));
	}
	replaceFiles(e) {
		if (super.replaceFiles(e), this.motions) for (let [t, n] of Object.entries(this.motions)) for (let r = 0; r < n.length; r++) {
			let i = n[r];
			i?.File && (i.File = e(i.File, `motions.${t}[${r}].File`), i.Sound &&= e(i.Sound, `motions.${t}[${r}].Sound`));
		}
		if (this.expressions) for (let t = 0; t < this.expressions.length; t++) {
			let n = this.expressions[t];
			n?.File && (n.File = e(n.File, `expressions[${t}].File`));
		}
	}
	getEyeBlinkParameters() {
		let e = [], t = this.getEyeBlinkParameterCount?.call(this) ?? 0;
		if (t > 0) for (let n = 0; n < t; n++) {
			let t = this.getEyeBlinkParameterId?.call(this, n);
			t?.getString && e.push(t.getString().s);
		}
		else {
			let t = !1, n = this.json.Groups;
			if (Array.isArray(n)) {
				for (let r of n) if (r?.Name === "EyeBlink" && (t = !0, Array.isArray(r.Ids))) for (let t of r.Ids) typeof t == "string" ? e.push(t) : t?.Id && e.push(t.Id);
			}
			if (t) return e;
		}
		return e.length ? e : [...ca];
	}
	getLipSyncParameters() {
		let e = [], t = this.getLipSyncParameterCount?.call(this) ?? 0;
		if (t > 0) for (let n = 0; n < t; n++) {
			let t = this.getLipSyncParameterId?.call(this, n);
			t?.getString && e.push(t.getString().s);
		}
		else if (Array.isArray(this.json.Groups)) {
			let t = this.json.Groups;
			for (let n of t) if (n?.Name === "LipSync" && Array.isArray(n.Ids)) for (let t of n.Ids) typeof t == "string" ? e.push(t) : t?.Id && e.push(t.Id);
		}
		return e;
	}
};
rt(la, [oa]);
var ua, da = 20, fa = 16;
function pa(e = {}) {
	e.memorySizeMB != null && (fa = e.memorySizeMB);
}
function ma() {
	return N.isStarted() ? Promise.resolve() : (ua ??= new Promise((e, t) => {
		function n() {
			try {
				ha(), e();
			} catch (e) {
				if (da--, da < 0) {
					t(Error("Failed to start up Cubism framework.", { cause: e }));
					return;
				}
				F.log("Cubism", "Startup failed, retrying 10ms later..."), setTimeout(n, 10);
			}
		}
		n();
	}), ua);
}
function ha(e, t) {
	let n = re({
		logFunction: console.log,
		loggingLevel: Ye.LogLevel_Verbose
	}, e), r = t ?? fa;
	N.startUp(n), N.initialize(et(r));
}
var ga = .001, _a = .5, va = "FadeInTime", ya = "Link", ba = "Groups", xa = "Id", Sa = class e {
	/**
	* インスタンスの作成
	* @param pose3json pose3.jsonのデータ
	* @param size pose3.jsonのデータのサイズ[byte]
	* @return 作成されたインスタンス
	*/
	static create(t, n) {
		let r = A.create(t, n);
		if (!r) return null;
		let i = new e(), a = r.getRoot();
		a.getValueByString(va).isNull() || (i._fadeTimeSeconds = a.getValueByString(va).toFloat(_a), i._fadeTimeSeconds < 0 && (i._fadeTimeSeconds = _a));
		let o = a.getValueByString(ba), s = o.getSize();
		for (let e = 0; e < s; ++e) {
			let t = o.getValueByIndex(e), n = t.getSize(), r = 0;
			for (let e = 0; e < n; ++e) {
				let n = t.getValueByIndex(e), a = new Ca();
				if (a.partId = N.getIdManager().getId(n.getValueByString(xa).getRawString()), !n.getValueByString(ya).isNull()) {
					let e = n.getValueByString(ya), t = e.getSize();
					for (let n = 0; n < t; ++n) {
						let t = new Ca();
						t.partId = N.getIdManager().getId(e.getValueByIndex(n).getString()), a.link.pushBack(t);
					}
				}
				i._partGroups.pushBack(a.clone()), ++r;
			}
			i._partGroupCounts.pushBack(r);
		}
		return A.delete(r), i;
	}
	/**
	* インスタンスを破棄する
	* @param pose 対象のCubismPose
	*/
	static delete(e) {}
	/**
	* モデルのパラメータの更新
	* @param model 対象のモデル
	* @param deltaTimeSeconds デルタ時間[秒]
	*/
	updateParameters(e, t) {
		e != this._lastModel && this.reset(e), this._lastModel = e, t < 0 && (t = 0);
		let n = 0;
		for (let r = 0; r < this._partGroupCounts.getSize(); r++) {
			let i = this._partGroupCounts.at(r);
			this.doFade(e, t, n, i), n += i;
		}
		this.copyPartOpacities(e);
	}
	/**
	* 表示を初期化
	* @param model 対象のモデル
	* @note 不透明度の初期値が0でないパラメータは、不透明度を１に設定する
	*/
	reset(e) {
		let t = 0;
		for (let n = 0; n < this._partGroupCounts.getSize(); ++n) {
			let r = this._partGroupCounts.at(n);
			for (let n = t; n < t + r; ++n) {
				this._partGroups.at(n).initialize(e);
				let r = this._partGroups.at(n).partIndex, i = this._partGroups.at(n).parameterIndex;
				if (!(r < 0)) {
					e.setPartOpacityByIndex(r, +(n == t)), e.setParameterValueByIndex(i, +(n == t));
					for (let t = 0; t < this._partGroups.at(n).link.getSize(); ++t) this._partGroups.at(n).link.at(t).initialize(e);
				}
			}
			t += r;
		}
	}
	/**
	* パーツの不透明度をコピー
	*
	* @param model 対象のモデル
	*/
	copyPartOpacities(e) {
		for (let t = 0; t < this._partGroups.getSize(); ++t) {
			let n = this._partGroups.at(t);
			if (n.link.getSize() == 0) continue;
			let r = this._partGroups.at(t).partIndex, i = e.getPartOpacityByIndex(r);
			for (let t = 0; t < n.link.getSize(); ++t) {
				let r = n.link.at(t).partIndex;
				r < 0 || e.setPartOpacityByIndex(r, i);
			}
		}
	}
	/**
	* パーツのフェード操作を行う。
	* @param model 対象のモデル
	* @param deltaTimeSeconds デルタ時間[秒]
	* @param beginIndex フェード操作を行うパーツグループの先頭インデックス
	* @param partGroupCount フェード操作を行うパーツグループの個数
	*/
	doFade(e, t, n, r) {
		let i = -1, a = 1, o = .5, s = .15;
		for (let o = n; o < n + r; ++o) {
			let n = this._partGroups.at(o).partIndex, r = this._partGroups.at(o).parameterIndex;
			if (e.getParameterValueByIndex(r) > ga) {
				if (i >= 0) break;
				if (i = o, this._fadeTimeSeconds == 0) {
					a = 1;
					continue;
				}
				a = e.getPartOpacityByIndex(n), a += t / this._fadeTimeSeconds, a > 1 && (a = 1);
			}
		}
		i < 0 && (i = 0, a = 1);
		for (let t = n; t < n + r; ++t) {
			let n = this._partGroups.at(t).partIndex;
			if (i == t) e.setPartOpacityByIndex(n, a);
			else {
				let t = e.getPartOpacityByIndex(n), r;
				r = a < o ? a * -.5 / o + 1 : (1 - a) * o / .5, (1 - r) * (1 - a) > s && (r = 1 - s / (1 - a)), t > r && (t = r), e.setPartOpacityByIndex(n, t);
			}
		}
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		this._fadeTimeSeconds = _a, this._lastModel = null, this._partGroups = new S(), this._partGroupCounts = new S();
	}
}, Ca = class e {
	/**
	* コンストラクタ
	*/
	constructor(e) {
		if (this.parameterIndex = 0, this.partIndex = 0, this.link = new S(), e != null) {
			this.partId = e.partId;
			for (let t = e.link.begin(); t.notEqual(e.link.end()); t.preIncrement()) this.link.pushBack(t.ptr().clone());
		}
	}
	/**
	* =演算子のオーバーロード
	*/
	assignment(e) {
		this.partId = e.partId;
		for (let t = e.link.begin(); t.notEqual(e.link.end()); t.preIncrement()) this.link.pushBack(t.ptr().clone());
		return this;
	}
	/**
	* 初期化
	* @param model 初期化に使用するモデル
	*/
	initialize(e) {
		this.parameterIndex = e.getParameterIndex(this.partId), this.partIndex = e.getPartIndex(this.partId), e.setParameterValueByIndex(this.parameterIndex, 1);
	}
	/**
	* オブジェクトのコピーを生成する
	*/
	clone() {
		let t = new e();
		t.partId = this.partId, t.parameterIndex = this.parameterIndex, t.partIndex = this.partIndex, t.link = new S();
		for (let e = this.link.begin(); e.notEqual(this.link.end()); e.increment()) t.link.pushBack(e.ptr().clone());
		return t;
	}
}, wa;
((e) => {
	e.CubismPose = Sa, e.PartData = Ca;
})(wa ||= {});
var Ta = class {
	/**
	* Constructor
	*
	* @param isOverridden whether to be overriden
	* @param isParameterRepeated override flag for settings
	*/
	constructor(e = !1, t = !1) {
		this.isOverridden = e, this.isParameterRepeated = t;
	}
}, Ea = class {
	constructor(e = !1, t = new w()) {
		this.isOverridden = e, this.color = t;
	}
	get isOverwritten() {
		return this.isOverridden;
	}
}, Da = class {
	constructor(e = !1, t = new w()) {
		this.isOverridden = e, this.color = t;
	}
	get isOverwritten() {
		return this.isOverridden;
	}
}, Oa = class {
	/**
	* コンストラクタ
	*
	* @param isOverridden
	* @param isCulling
	*/
	constructor(e = !1, t = !1) {
		this.isOverridden = e, this.isCulling = t;
	}
	get isOverwritten() {
		return this.isOverridden;
	}
}, ka = class {
	/**
	* モデルのパラメータの更新
	*/
	update() {
		this._model.update(), this._model.drawables.resetDynamicFlags();
	}
	/**
	* PixelsPerUnitを取得する
	* @returns PixelsPerUnit
	*/
	getPixelsPerUnit() {
		return this._model == null ? 0 : this._model.canvasinfo.PixelsPerUnit;
	}
	/**
	* キャンバスの幅を取得する
	*/
	getCanvasWidth() {
		return this._model == null ? 0 : this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit;
	}
	/**
	* キャンバスの高さを取得する
	*/
	getCanvasHeight() {
		return this._model == null ? 0 : this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit;
	}
	/**
	* パラメータを保存する
	*/
	saveParameters() {
		let e = this._model.parameters.count, t = this._savedParameters.getSize();
		for (let n = 0; n < e; ++n) n < t ? this._savedParameters.set(n, this._parameterValues[n]) : this._savedParameters.pushBack(this._parameterValues[n]);
	}
	/**
	* 乗算色を取得する
	* @param index Drawablesのインデックス
	* @returns 指定したdrawableの乗算色(RGBA)
	*/
	getMultiplyColor(e) {
		return this.getOverrideFlagForModelMultiplyColors() || this.getOverrideFlagForDrawableMultiplyColors(e) ? this._userMultiplyColors.at(e).color : this.getDrawableMultiplyColor(e);
	}
	/**
	* スクリーン色を取得する
	* @param index Drawablesのインデックス
	* @returns 指定したdrawableのスクリーン色(RGBA)
	*/
	getScreenColor(e) {
		return this.getOverrideFlagForModelScreenColors() || this.getOverrideFlagForDrawableScreenColors(e) ? this._userScreenColors.at(e).color : this.getDrawableScreenColor(e);
	}
	/**
	* 乗算色をセットする
	* @param index Drawablesのインデックス
	* @param color 設定する乗算色(CubismTextureColor)
	*/
	setMultiplyColorByTextureColor(e, t) {
		this.setMultiplyColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	/**
	* 乗算色をセットする
	* @param index Drawablesのインデックス
	* @param r 設定する乗算色のR値
	* @param g 設定する乗算色のG値
	* @param b 設定する乗算色のB値
	* @param a 設定する乗算色のA値
	*/
	setMultiplyColorByRGBA(e, t, n, r, i = 1) {
		this._userMultiplyColors.at(e).color.r = t, this._userMultiplyColors.at(e).color.g = n, this._userMultiplyColors.at(e).color.b = r, this._userMultiplyColors.at(e).color.a = i;
	}
	/**
	* スクリーン色をセットする
	* @param index Drawablesのインデックス
	* @param color 設定するスクリーン色(CubismTextureColor)
	*/
	setScreenColorByTextureColor(e, t) {
		this.setScreenColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	/**
	* スクリーン色をセットする
	* @param index Drawablesのインデックス
	* @param r 設定するスクリーン色のR値
	* @param g 設定するスクリーン色のG値
	* @param b 設定するスクリーン色のB値
	* @param a 設定するスクリーン色のA値
	*/
	setScreenColorByRGBA(e, t, n, r, i = 1) {
		this._userScreenColors.at(e).color.r = t, this._userScreenColors.at(e).color.g = n, this._userScreenColors.at(e).color.b = r, this._userScreenColors.at(e).color.a = i;
	}
	/**
	* partの乗算色を取得する
	* @param partIndex partのインデックス
	* @returns 指定したpartの乗算色
	*/
	getPartMultiplyColor(e) {
		return this._userPartMultiplyColors.at(e).color;
	}
	/**
	* partのスクリーン色を取得する
	* @param partIndex partのインデックス
	* @returns 指定したpartのスクリーン色
	*/
	getPartScreenColor(e) {
		return this._userPartScreenColors.at(e).color;
	}
	/**
	* partのOverrideColor setter関数
	* @param partIndex partのインデックス
	* @param r 設定する色のR値
	* @param g 設定する色のG値
	* @param b 設定する色のB値
	* @param a 設定する色のA値
	* @param partColors 設定するpartのカラーデータ配列
	* @param drawableColors partに関連するDrawableのカラーデータ配列
	*/
	setPartColor(e, t, n, r, i, a, o) {
		if (a.at(e).color.r = t, a.at(e).color.g = n, a.at(e).color.b = r, a.at(e).color.a = i, a.at(e).isOverridden) for (let a = 0; a < this._partChildDrawables.at(e).getSize(); ++a) {
			let s = this._partChildDrawables.at(e).at(a);
			o.at(s).color.r = t, o.at(s).color.g = n, o.at(s).color.b = r, o.at(s).color.a = i;
		}
	}
	/**
	* 乗算色をセットする
	* @param partIndex partのインデックス
	* @param color 設定する乗算色(CubismTextureColor)
	*/
	setPartMultiplyColorByTextureColor(e, t) {
		this.setPartMultiplyColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	/**
	* 乗算色をセットする
	* @param partIndex partのインデックス
	* @param r 設定する乗算色のR値
	* @param g 設定する乗算色のG値
	* @param b 設定する乗算色のB値
	* @param a 設定する乗算色のA値
	*/
	setPartMultiplyColorByRGBA(e, t, n, r, i) {
		this.setPartColor(e, t, n, r, i, this._userPartMultiplyColors, this._userMultiplyColors);
	}
	/**
	* スクリーン色をセットする
	* @param partIndex partのインデックス
	* @param color 設定するスクリーン色(CubismTextureColor)
	*/
	setPartScreenColorByTextureColor(e, t) {
		this.setPartScreenColorByRGBA(e, t.r, t.g, t.b, t.a);
	}
	/**
	* スクリーン色をセットする
	* @param partIndex partのインデックス
	* @param r 設定するスクリーン色のR値
	* @param g 設定するスクリーン色のG値
	* @param b 設定するスクリーン色のB値
	* @param a 設定するスクリーン色のA値
	*/
	setPartScreenColorByRGBA(e, t, n, r, i) {
		this.setPartColor(e, t, n, r, i, this._userPartScreenColors, this._userScreenColors);
	}
	/**
	* Checks whether parameter repetition is performed for the entire model.
	*
	* @return true if parameter repetition is performed for the entire model; otherwise returns false.
	*/
	getOverrideFlagForModelParameterRepeat() {
		return this._isOverriddenParameterRepeat;
	}
	/**
	* Sets whether parameter repetition is performed for the entire model.
	* Use true to perform parameter repetition for the entire model, or false to not perform it.
	*/
	setOverrideFlagForModelParameterRepeat(e) {
		this._isOverriddenParameterRepeat = e;
	}
	/**
	* Returns the flag indicating whether to override the parameter repeat.
	*
	* @param parameterIndex Parameter index
	*
	* @return true if the parameter repeat is overridden, false otherwise.
	*/
	getOverrideFlagForParameterRepeat(e) {
		return this._userParameterRepeatDataList.at(e).isOverridden;
	}
	/**
	* Sets the flag indicating whether to override the parameter repeat.
	*
	* @param parameterIndex Parameter index
	* @param value true if it is to be overridden; otherwise, false.
	*/
	setOverrideFlagForParameterRepeat(e, t) {
		this._userParameterRepeatDataList.at(e).isOverridden = t;
	}
	/**
	* Returns the repeat flag.
	*
	* @param parameterIndex Parameter index
	*
	* @return true if repeating, false otherwise.
	*/
	getRepeatFlagForParameterRepeat(e) {
		return this._userParameterRepeatDataList.at(e).isParameterRepeated;
	}
	/**
	* Sets the repeat flag.
	*
	* @param parameterIndex Parameter index
	* @param value true to enable repeating, false otherwise.
	*/
	setRepeatFlagForParameterRepeat(e, t) {
		this._userParameterRepeatDataList.at(e).isParameterRepeated = t;
	}
	/**
	* SDKから指定したモデルの乗算色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForModelMultiplyColors() に置き換え
	*
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverwriteFlagForModelMultiplyColors() {
		return E("getOverwriteFlagForModelMultiplyColors() is a deprecated function. Please use getOverrideFlagForModelMultiplyColors()."), this.getOverrideFlagForModelMultiplyColors();
	}
	/**
	* SDKから指定したモデルの乗算色を上書きするか
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverrideFlagForModelMultiplyColors() {
		return this._isOverriddenModelMultiplyColors;
	}
	/**
	* SDKから指定したモデルのスクリーン色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForModelScreenColors() に置き換え
	*
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverwriteFlagForModelScreenColors() {
		return E("getOverwriteFlagForModelScreenColors() is a deprecated function. Please use getOverrideFlagForModelScreenColors()."), this.getOverrideFlagForModelScreenColors();
	}
	/**
	* SDKから指定したモデルのスクリーン色を上書きするか
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverrideFlagForModelScreenColors() {
		return this._isOverriddenModelScreenColors;
	}
	/**
	* SDKから指定したモデルの乗算色を上書きするかセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForModelMultiplyColors(value: boolean) に置き換え
	*
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteFlagForModelMultiplyColors(e) {
		E("setOverwriteFlagForModelMultiplyColors(value: boolean) is a deprecated function. Please use setOverrideFlagForModelMultiplyColors(value: boolean)."), this.setOverrideFlagForModelMultiplyColors(e);
	}
	/**
	* SDKから指定したモデルの乗算色を上書きするかセットする
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideFlagForModelMultiplyColors(e) {
		this._isOverriddenModelMultiplyColors = e;
	}
	/**
	* SDKから指定したモデルのスクリーン色を上書きするかセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForModelScreenColors(value: boolean) に置き換え
	*
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteFlagForModelScreenColors(e) {
		E("setOverwriteFlagForModelScreenColors(value: boolean) is a deprecated function. Please use setOverrideFlagForModelScreenColors(value: boolean)."), this.setOverrideFlagForModelScreenColors(e);
	}
	/**
	* SDKから指定したモデルのスクリーン色を上書きするかセットする
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideFlagForModelScreenColors(e) {
		this._isOverriddenModelScreenColors = e;
	}
	/**
	* SDKから指定したDrawableIndexの乗算色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableMultiplyColors(drawableindex: number) に置き換え
	*
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverwriteFlagForDrawableMultiplyColors(e) {
		return E("getOverwriteFlagForDrawableMultiplyColors(drawableindex: number) is a deprecated function. Please use getOverrideFlagForDrawableMultiplyColors(drawableindex: number)."), this.getOverrideFlagForDrawableMultiplyColors(e);
	}
	/**
	* SDKから指定したDrawableIndexの乗算色を上書きするか
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverrideFlagForDrawableMultiplyColors(e) {
		return this._userMultiplyColors.at(e).isOverridden;
	}
	/**
	* SDKから指定したDrawableIndexのスクリーン色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableScreenColors(drawableindex: number) に置き換え
	*
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverwriteFlagForDrawableScreenColors(e) {
		return E("getOverwriteFlagForDrawableScreenColors(drawableindex: number) is a deprecated function. Please use getOverrideFlagForDrawableScreenColors(drawableindex: number)."), this.getOverrideFlagForDrawableScreenColors(e);
	}
	/**
	* SDKから指定したDrawableIndexのスクリーン色を上書きするか
	* @returns true -> SDKからの情報を優先する
	*          false -> モデルに設定されている色情報を使用
	*/
	getOverrideFlagForDrawableScreenColors(e) {
		return this._userScreenColors.at(e).isOverridden;
	}
	/**
	* SDKから指定したDrawableIndexの乗算色を上書きするかセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableMultiplyColors(drawableindex: number, value: boolean) に置き換え
	*
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteFlagForDrawableMultiplyColors(e, t) {
		E("setOverwriteFlagForDrawableMultiplyColors(drawableindex: number, value: boolean) is a deprecated function. Please use setOverrideFlagForDrawableMultiplyColors(drawableindex: number, value: boolean)."), this.setOverrideFlagForDrawableMultiplyColors(e, t);
	}
	/**
	* SDKから指定したDrawableIndexの乗算色を上書きするかセットする
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideFlagForDrawableMultiplyColors(e, t) {
		this._userMultiplyColors.at(e).isOverridden = t;
	}
	/**
	* SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableScreenColors(drawableindex: number, value: boolean) に置き換え
	*
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteFlagForDrawableScreenColors(e, t) {
		E("setOverwriteFlagForDrawableScreenColors(drawableindex: number, value: boolean) is a deprecated function. Please use setOverrideFlagForDrawableScreenColors(drawableindex: number, value: boolean)."), this.setOverrideFlagForDrawableScreenColors(e, t);
	}
	/**
	* SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideFlagForDrawableScreenColors(e, t) {
		this._userScreenColors.at(e).isOverridden = t;
	}
	/**
	* SDKからpartの乗算色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideColorForPartMultiplyColors(partIndex: number) に置き換え
	*
	* @param partIndex partのインデックス
	* @returns true    ->  SDKからの情報を優先する
	*          false   ->  モデルに設定されている色情報を使用
	*/
	getOverwriteColorForPartMultiplyColors(e) {
		return E("getOverwriteColorForPartMultiplyColors(partIndex: number) is a deprecated function. Please use getOverrideColorForPartMultiplyColors(partIndex: number)."), this.getOverrideColorForPartMultiplyColors(e);
	}
	/**
	* SDKからpartの乗算色を上書きするか
	* @param partIndex partのインデックス
	* @returns true    ->  SDKからの情報を優先する
	*          false   ->  モデルに設定されている色情報を使用
	*/
	getOverrideColorForPartMultiplyColors(e) {
		return this._userPartMultiplyColors.at(e).isOverridden;
	}
	/**
	* SDKからpartのスクリーン色を上書きするか
	*
	* @deprecated 名称変更のため非推奨 getOverrideColorForPartScreenColors(partIndex: number) に置き換え
	*
	* @param partIndex partのインデックス
	* @returns true    ->  SDKからの情報を優先する
	*          false   ->  モデルに設定されている色情報を使用
	*/
	getOverwriteColorForPartScreenColors(e) {
		return E("getOverwriteColorForPartScreenColors(partIndex: number) is a deprecated function. Please use getOverrideColorForPartScreenColors(partIndex: number)."), this.getOverrideColorForPartScreenColors(e);
	}
	/**
	* SDKからpartのスクリーン色を上書きするか
	* @param partIndex partのインデックス
	* @returns true    ->  SDKからの情報を優先する
	*          false   ->  モデルに設定されている色情報を使用
	*/
	getOverrideColorForPartScreenColors(e) {
		return this._userPartScreenColors.at(e).isOverridden;
	}
	/**
	* partのOverrideFlag setter関数
	*
	* @deprecated 名称変更のため非推奨 setOverrideColorForPartColors(
	* partIndex: number,
	* value: boolean,
	* partColors: csmVector<PartColorData>,
	* drawableColors: csmVector<DrawableColorData>) に置き換え
	*
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	* @param partColors 設定するpartのカラーデータ配列
	* @param drawableColors partに関連するDrawableのカラーデータ配列
	*/
	setOverwriteColorForPartColors(e, t, n, r) {
		E("setOverwriteColorForPartColors(partIndex: number, value: boolean, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>) is a deprecated function. Please use setOverrideColorForPartColors(partIndex: number, value: boolean, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>)."), this.setOverrideColorForPartColors(e, t, n, r);
	}
	/**
	* partのOverrideFlag setter関数
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	* @param partColors 設定するpartのカラーデータ配列
	* @param drawableColors partに関連するDrawableのカラーデータ配列
	*/
	setOverrideColorForPartColors(e, t, n, r) {
		n.at(e).isOverridden = t;
		for (let i = 0; i < this._partChildDrawables.at(e).getSize(); ++i) {
			let a = this._partChildDrawables.at(e).at(i);
			r.at(a).isOverridden = t, t && (r.at(a).color.r = n.at(e).color.r, r.at(a).color.g = n.at(e).color.g, r.at(a).color.b = n.at(e).color.b, r.at(a).color.a = n.at(e).color.a);
		}
	}
	/**
	* SDKからpartのスクリーン色を上書きするかをセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideColorForPartMultiplyColors(partIndex: number, value: boolean) に置き換え
	*
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteColorForPartMultiplyColors(e, t) {
		E("setOverwriteColorForPartMultiplyColors(partIndex: number, value: boolean) is a deprecated function. Please use setOverrideColorForPartMultiplyColors(partIndex: number, value: boolean)."), this.setOverrideColorForPartMultiplyColors(e, t);
	}
	/**
	* SDKからpartのスクリーン色を上書きするかをセットする
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideColorForPartMultiplyColors(e, t) {
		this._userPartMultiplyColors.at(e).isOverridden = t, this.setOverrideColorForPartColors(e, t, this._userPartMultiplyColors, this._userMultiplyColors);
	}
	/**
	* SDKからpartのスクリーン色を上書きするかをセットする
	*
	* @deprecated 名称変更のため非推奨 setOverrideColorForPartScreenColors(partIndex: number, value: boolean) に置き換え
	*
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverwriteColorForPartScreenColors(e, t) {
		E("setOverwriteColorForPartScreenColors(partIndex: number, value: boolean) is a deprecated function. Please use setOverrideColorForPartScreenColors(partIndex: number, value: boolean)."), this.setOverrideColorForPartScreenColors(e, t);
	}
	/**
	* SDKからpartのスクリーン色を上書きするかをセットする
	* @param partIndex partのインデックス
	* @param value true -> SDKからの情報を優先する
	*              false -> モデルに設定されている色情報を使用
	*/
	setOverrideColorForPartScreenColors(e, t) {
		this._userPartScreenColors.at(e).isOverridden = t, this.setOverrideColorForPartColors(e, t, this._userPartScreenColors, this._userScreenColors);
	}
	/**
	* Drawableのカリング情報を取得する。
	*
	* @param   drawableIndex   Drawableのインデックス
	* @return  Drawableのカリング情報
	*/
	getDrawableCulling(e) {
		if (this.getOverrideFlagForModelCullings() || this.getOverrideFlagForDrawableCullings(e)) return this._userCullings.at(e).isCulling;
		let t = this._model.drawables.constantFlags;
		return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(t[e]);
	}
	/**
	* Drawableのカリング情報を設定する。
	*
	* @param drawableIndex Drawableのインデックス
	* @param isCulling カリング情報
	*/
	setDrawableCulling(e, t) {
		this._userCullings.at(e).isCulling = t;
	}
	/**
	* SDKからモデル全体のカリング設定を上書きするか。
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForModelCullings() に置き換え
	*
	* @retval  true    ->  SDK上のカリング設定を使用
	* @retval  false   ->  モデルのカリング設定を使用
	*/
	getOverwriteFlagForModelCullings() {
		return E("getOverwriteFlagForModelCullings() is a deprecated function. Please use getOverrideFlagForModelCullings()."), this.getOverrideFlagForModelCullings();
	}
	/**
	* SDKからモデル全体のカリング設定を上書きするか。
	*
	* @retval  true    ->  SDK上のカリング設定を使用
	* @retval  false   ->  モデルのカリング設定を使用
	*/
	getOverrideFlagForModelCullings() {
		return this._isOverriddenCullings;
	}
	/**
	* SDKからモデル全体のカリング設定を上書きするかを設定する。
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForModelCullings(isOverriddenCullings: boolean) に置き換え
	*
	* @param isOveriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
	*/
	setOverwriteFlagForModelCullings(e) {
		E("setOverwriteFlagForModelCullings(isOverriddenCullings: boolean) is a deprecated function. Please use setOverrideFlagForModelCullings(isOverriddenCullings: boolean)."), this.setOverrideFlagForModelCullings(e);
	}
	/**
	* SDKからモデル全体のカリング設定を上書きするかを設定する。
	*
	* @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
	*/
	setOverrideFlagForModelCullings(e) {
		this._isOverriddenCullings = e;
	}
	/**
	*
	* @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableCullings(drawableIndex: number) に置き換え
	*
	* @param drawableIndex Drawableのインデックス
	* @retval  true    ->  SDK上のカリング設定を使用
	* @retval  false   ->  モデルのカリング設定を使用
	*/
	getOverwriteFlagForDrawableCullings(e) {
		return E("getOverwriteFlagForDrawableCullings(drawableIndex: number) is a deprecated function. Please use getOverrideFlagForDrawableCullings(drawableIndex: number)."), this.getOverrideFlagForDrawableCullings(e);
	}
	/**
	*
	* @param drawableIndex Drawableのインデックス
	* @retval  true    ->  SDK上のカリング設定を使用
	* @retval  false   ->  モデルのカリング設定を使用
	*/
	getOverrideFlagForDrawableCullings(e) {
		return this._userCullings.at(e).isOverridden;
	}
	/**
	*
	* @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: bolean) に置き換え
	*
	* @param drawableIndex Drawableのインデックス
	* @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
	*/
	setOverwriteFlagForDrawableCullings(e, t) {
		E("setOverwriteFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: boolean) is a deprecated function. Please use setOverrideFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: boolean)."), this.setOverrideFlagForDrawableCullings(e, t);
	}
	/**
	*
	* @param drawableIndex Drawableのインデックス
	* @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
	*/
	setOverrideFlagForDrawableCullings(e, t) {
		this._userCullings.at(e).isOverridden = t;
	}
	/**
	* モデルの不透明度を取得する
	*
	* @returns 不透明度の値
	*/
	getModelOapcity() {
		return this._modelOpacity;
	}
	/**
	* モデルの不透明度を設定する
	*
	* @param value 不透明度の値
	*/
	setModelOapcity(e) {
		this._modelOpacity = e;
	}
	/**
	* モデルを取得
	*/
	getModel() {
		return this._model;
	}
	/**
	* パーツのインデックスを取得
	* @param partId パーツのID
	* @return パーツのインデックス
	*/
	getPartIndex(e) {
		let t, n = this._model.parts.count;
		for (t = 0; t < n; ++t) if (e == this._partIds.at(t)) return t;
		return this._notExistPartId.isExist(e) ? this._notExistPartId.getValue(e) : (t = n + this._notExistPartId.getSize(), this._notExistPartId.setValue(e, t), this._notExistPartOpacities.appendKey(t), t);
	}
	/**
	* パーツのIDを取得する。
	*
	* @param partIndex 取得するパーツのインデックス
	* @return パーツのID
	*/
	getPartId(e) {
		let t = this._model.parts.ids[e];
		return N.getIdManager().getId(t);
	}
	/**
	* パーツの個数の取得
	* @return パーツの個数
	*/
	getPartCount() {
		return this._model.parts.count;
	}
	/**
	* パーツの親パーツインデックスのリストを取得
	*
	* @returns パーツの親パーツインデックスのリスト
	*/
	getPartParentPartIndices() {
		return this._model.parts.parentIndices;
	}
	/**
	* パーツの不透明度の設定(Index)
	* @param partIndex パーツのインデックス
	* @param opacity 不透明度
	*/
	setPartOpacityByIndex(e, t) {
		if (this._notExistPartOpacities.isExist(e)) {
			this._notExistPartOpacities.setValue(e, t);
			return;
		}
		T(0 <= e && e < this.getPartCount()), this._partOpacities[e] = t;
	}
	/**
	* パーツの不透明度の設定(Id)
	* @param partId パーツのID
	* @param opacity パーツの不透明度
	*/
	setPartOpacityById(e, t) {
		let n = this.getPartIndex(e);
		n < 0 || this.setPartOpacityByIndex(n, t);
	}
	/**
	* パーツの不透明度の取得(index)
	* @param partIndex パーツのインデックス
	* @return パーツの不透明度
	*/
	getPartOpacityByIndex(e) {
		return this._notExistPartOpacities.isExist(e) ? this._notExistPartOpacities.getValue(e) : (T(0 <= e && e < this.getPartCount()), this._partOpacities[e]);
	}
	/**
	* パーツの不透明度の取得(id)
	* @param partId パーツのＩｄ
	* @return パーツの不透明度
	*/
	getPartOpacityById(e) {
		let t = this.getPartIndex(e);
		return t < 0 ? 0 : this.getPartOpacityByIndex(t);
	}
	/**
	* パラメータのインデックスの取得
	* @param パラメータID
	* @return パラメータのインデックス
	*/
	getParameterIndex(e) {
		let t, n = this._model.parameters.count;
		for (t = 0; t < n; ++t) if (e == this._parameterIds.at(t)) return t;
		return this._notExistParameterId.isExist(e) ? this._notExistParameterId.getValue(e) : (t = this._model.parameters.count + this._notExistParameterId.getSize(), this._notExistParameterId.setValue(e, t), this._notExistParameterValues.appendKey(t), t);
	}
	/**
	* パラメータの個数の取得
	* @return パラメータの個数
	*/
	getParameterCount() {
		return this._model.parameters.count;
	}
	/**
	* パラメータの種類の取得
	* @param parameterIndex パラメータのインデックス
	* @return csmParameterType_Normal -> 通常のパラメータ
	*          csmParameterType_BlendShape -> ブレンドシェイプパラメータ
	*/
	getParameterType(e) {
		return this._model.parameters.types[e];
	}
	/**
	* パラメータの最大値の取得
	* @param parameterIndex パラメータのインデックス
	* @return パラメータの最大値
	*/
	getParameterMaximumValue(e) {
		return this._model.parameters.maximumValues[e];
	}
	/**
	* パラメータの最小値の取得
	* @param parameterIndex パラメータのインデックス
	* @return パラメータの最小値
	*/
	getParameterMinimumValue(e) {
		return this._model.parameters.minimumValues[e];
	}
	/**
	* パラメータのデフォルト値の取得
	* @param parameterIndex パラメータのインデックス
	* @return パラメータのデフォルト値
	*/
	getParameterDefaultValue(e) {
		return this._model.parameters.defaultValues[e];
	}
	/**
	* 指定したパラメータindexのIDを取得
	*
	* @param parameterIndex パラメータのインデックス
	* @returns パラメータID
	*/
	getParameterId(e) {
		return N.getIdManager().getId(this._model.parameters.ids[e]);
	}
	/**
	* パラメータの値の取得
	* @param parameterIndex    パラメータのインデックス
	* @return パラメータの値
	*/
	getParameterValueByIndex(e) {
		return this._notExistParameterValues.isExist(e) ? this._notExistParameterValues.getValue(e) : (T(0 <= e && e < this.getParameterCount()), this._parameterValues[e]);
	}
	/**
	* パラメータの値の取得
	* @param parameterId    パラメータのID
	* @return パラメータの値
	*/
	getParameterValueById(e) {
		let t = this.getParameterIndex(e);
		return this.getParameterValueByIndex(t);
	}
	/**
	* パラメータの値の設定
	* @param parameterIndex パラメータのインデックス
	* @param value パラメータの値
	* @param weight 重み
	*/
	setParameterValueByIndex(e, t, n = 1) {
		if (this._notExistParameterValues.isExist(e)) {
			this._notExistParameterValues.setValue(e, n == 1 ? t : this._notExistParameterValues.getValue(e) * (1 - n) + t * n);
			return;
		}
		T(0 <= e && e < this.getParameterCount()), t = this.isRepeat(e) ? this.getParameterRepeatValue(e, t) : this.getParameterClampValue(e, t), this._parameterValues[e] = n == 1 ? t : this._parameterValues[e] = this._parameterValues[e] * (1 - n) + t * n;
	}
	/**
	* パラメータの値の設定
	* @param parameterId パラメータのID
	* @param value パラメータの値
	* @param weight 重み
	*/
	setParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.setParameterValueByIndex(r, t, n);
	}
	/**
	* パラメータの値の加算(index)
	* @param parameterIndex パラメータインデックス
	* @param value 加算する値
	* @param weight 重み
	*/
	addParameterValueByIndex(e, t, n = 1) {
		this.setParameterValueByIndex(e, this.getParameterValueByIndex(e) + t * n);
	}
	/**
	* パラメータの値の加算(id)
	* @param parameterId パラメータＩＤ
	* @param value 加算する値
	* @param weight 重み
	*/
	addParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.addParameterValueByIndex(r, t, n);
	}
	/**
	* Gets whether the parameter has the repeat setting.
	*
	* @param parameterIndex Parameter index
	*
	* @return true if it is set, otherwise returns false.
	*/
	isRepeat(e) {
		if (this._notExistParameterValues.isExist(e)) return !1;
		T(0 <= e && e < this.getParameterCount());
		let t;
		return t = this._isOverriddenParameterRepeat || this._userParameterRepeatDataList.at(e).isOverridden ? this._userParameterRepeatDataList.at(e).isParameterRepeated : this._model.parameters.repeats[e] != 0, t;
	}
	/**
	* Returns the calculated result ensuring the value falls within the parameter's range.
	*
	* @param parameterIndex Parameter index
	* @param value Parameter value
	*
	* @return a value that falls within the parameter’s range. If the parameter does not exist, returns it as is.
	*/
	getParameterRepeatValue(e, t) {
		if (this._notExistParameterValues.isExist(e)) return t;
		T(0 <= e && e < this.getParameterCount());
		let n = this._model.parameters.maximumValues[e], r = this._model.parameters.minimumValues[e], i = n - r;
		if (n < t) {
			let e = W.mod(t - n, i);
			t = Number.isNaN(e) ? n : r + e;
		}
		if (t < r) {
			let e = W.mod(r - t, i);
			t = Number.isNaN(e) ? r : n - e;
		}
		return t;
	}
	/**
	* Returns the result of clamping the value to ensure it falls within the parameter's range.
	*
	* @param parameterIndex Parameter index
	* @param value Parameter value
	*
	* @return the clamped value. If the parameter does not exist, returns it as is.
	*/
	getParameterClampValue(e, t) {
		if (this._notExistParameterValues.isExist(e)) return t;
		T(0 <= e && e < this.getParameterCount());
		let n = this._model.parameters.maximumValues[e], r = this._model.parameters.minimumValues[e];
		return W.clamp(t, r, n);
	}
	/**
	* Returns the repeat of the parameter.
	*
	* @param parameterIndex Parameter index
	*
	* @return the raw data parameter repeat from the Cubism Core.
	*/
	getParameterRepeats(e) {
		return this._model.parameters.repeats[e] != 0;
	}
	/**
	* パラメータの値の乗算
	* @param parameterId パラメータのID
	* @param value 乗算する値
	* @param weight 重み
	*/
	multiplyParameterValueById(e, t, n = 1) {
		let r = this.getParameterIndex(e);
		this.multiplyParameterValueByIndex(r, t, n);
	}
	/**
	* パラメータの値の乗算
	* @param parameterIndex パラメータのインデックス
	* @param value 乗算する値
	* @param weight 重み
	*/
	multiplyParameterValueByIndex(e, t, n = 1) {
		this.setParameterValueByIndex(e, this.getParameterValueByIndex(e) * (1 + (t - 1) * n));
	}
	/**
	* Drawableのインデックスの取得
	* @param drawableId DrawableのID
	* @return Drawableのインデックス
	*/
	getDrawableIndex(e) {
		let t = this._model.drawables.count;
		for (let n = 0; n < t; ++n) if (this._drawableIds.at(n) == e) return n;
		return -1;
	}
	/**
	* Drawableの個数の取得
	* @return drawableの個数
	*/
	getDrawableCount() {
		return this._model.drawables.count;
	}
	/**
	* DrawableのIDを取得する
	* @param drawableIndex Drawableのインデックス
	* @return drawableのID
	*/
	getDrawableId(e) {
		let t = this._model.drawables.ids;
		return N.getIdManager().getId(t[e]);
	}
	/**
	* Drawableの描画順リストの取得
	* @return Drawableの描画順リスト
	*/
	getDrawableRenderOrders() {
		return this._model.drawables.renderOrders;
	}
	/**
	* @deprecated
	* 関数名が誤っていたため、代替となる getDrawableTextureIndex を追加し、この関数は非推奨となりました。
	*
	* Drawableのテクスチャインデックスリストの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableのテクスチャインデックスリスト
	*/
	getDrawableTextureIndices(e) {
		return this.getDrawableTextureIndex(e);
	}
	/**
	* Drawableのテクスチャインデックスの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableのテクスチャインデックス
	*/
	getDrawableTextureIndex(e) {
		return this._model.drawables.textureIndices[e];
	}
	/**
	* DrawableのVertexPositionsの変化情報の取得
	*
	* 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
	*
	* @param   drawableIndex   Drawableのインデックス
	* @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
	* @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
	*/
	getDrawableDynamicFlagVertexPositionsDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(t[e]);
	}
	/**
	* Drawableの頂点インデックスの個数の取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの頂点インデックスの個数
	*/
	getDrawableVertexIndexCount(e) {
		return this._model.drawables.indexCounts[e];
	}
	/**
	* Drawableの頂点の個数の取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの頂点の個数
	*/
	getDrawableVertexCount(e) {
		return this._model.drawables.vertexCounts[e];
	}
	/**
	* Drawableの頂点リストの取得
	* @param drawableIndex drawableのインデックス
	* @return drawableの頂点リスト
	*/
	getDrawableVertices(e) {
		return this.getDrawableVertexPositions(e);
	}
	/**
	* Drawableの頂点インデックスリストの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの頂点インデックスリスト
	*/
	getDrawableVertexIndices(e) {
		return this._model.drawables.indices[e];
	}
	/**
	* Drawableの頂点リストの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの頂点リスト
	*/
	getDrawableVertexPositions(e) {
		return this._model.drawables.vertexPositions[e];
	}
	/**
	* Drawableの頂点のUVリストの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの頂点UVリスト
	*/
	getDrawableVertexUvs(e) {
		return this._model.drawables.vertexUvs[e];
	}
	/**
	* Drawableの不透明度の取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの不透明度
	*/
	getDrawableOpacity(e) {
		return this._model.drawables.opacities[e];
	}
	/**
	* Drawableの乗算色の取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの乗算色(RGBA)
	* スクリーン色はRGBAで取得されるが、Aは必ず0
	*/
	getDrawableMultiplyColor(e) {
		let t = this._model.drawables.multiplyColors, n = e * 4, r = new w();
		return r.r = t[n], r.g = t[n + 1], r.b = t[n + 2], r.a = t[n + 3], r;
	}
	/**
	* Drawableのスクリーン色の取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableのスクリーン色(RGBA)
	* スクリーン色はRGBAで取得されるが、Aは必ず0
	*/
	getDrawableScreenColor(e) {
		let t = this._model.drawables.screenColors, n = e * 4, r = new w();
		return r.r = t[n], r.g = t[n + 1], r.b = t[n + 2], r.a = t[n + 3], r;
	}
	/**
	* Drawableの親パーツのインデックスの取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableの親パーツのインデックス
	*/
	getDrawableParentPartIndex(e) {
		return this._model.drawables.parentPartIndices[e];
	}
	/**
	* Drawableのブレンドモードを取得
	* @param drawableIndex Drawableのインデックス
	* @return drawableのブレンドモード
	*/
	getDrawableBlendMode(e) {
		let t = this._model.drawables.constantFlags;
		return Live2DCubismCore.Utils.hasBlendAdditiveBit(t[e]) ? ve.CubismBlendMode_Additive : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(t[e]) ? ve.CubismBlendMode_Multiplicative : ve.CubismBlendMode_Normal;
	}
	/**
	* Drawableのマスクの反転使用の取得
	*
	* Drawableのマスク使用時の反転設定を取得する。
	* マスクを使用しない場合は無視される。
	*
	* @param drawableIndex Drawableのインデックス
	* @return Drawableの反転設定
	*/
	getDrawableInvertedMaskBit(e) {
		let t = this._model.drawables.constantFlags;
		return Live2DCubismCore.Utils.hasIsInvertedMaskBit(t[e]);
	}
	/**
	* Drawableのクリッピングマスクリストの取得
	* @return Drawableのクリッピングマスクリスト
	*/
	getDrawableMasks() {
		return this._model.drawables.masks;
	}
	/**
	* Drawableのクリッピングマスクの個数リストの取得
	* @return Drawableのクリッピングマスクの個数リスト
	*/
	getDrawableMaskCounts() {
		return this._model.drawables.maskCounts;
	}
	/**
	* クリッピングマスクの使用状態
	*
	* @return true クリッピングマスクを使用している
	* @return false クリッピングマスクを使用していない
	*/
	isUsingMasking() {
		for (let e = 0; e < this._model.drawables.count; ++e) if (!(this._model.drawables.maskCounts[e] <= 0)) return !0;
		return !1;
	}
	/**
	* Drawableの表示情報を取得する
	*
	* @param drawableIndex Drawableのインデックス
	* @return true Drawableが表示
	* @return false Drawableが非表示
	*/
	getDrawableDynamicFlagIsVisible(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasIsVisibleBit(t[e]);
	}
	/**
	* DrawableのDrawOrderの変化情報の取得
	*
	* 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
	* drawOrderはartMesh上で指定する0から1000の情報
	* @param drawableIndex drawableのインデックス
	* @return true drawableの不透明度が直近のCubismModel.update関数で変化した
	* @return false drawableの不透明度が直近のCubismModel.update関数で変化している
	*/
	getDrawableDynamicFlagVisibilityDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(t[e]);
	}
	/**
	* Drawableの不透明度の変化情報の取得
	*
	* 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
	*
	* @param drawableIndex drawableのインデックス
	* @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
	* @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
	*/
	getDrawableDynamicFlagOpacityDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasOpacityDidChangeBit(t[e]);
	}
	/**
	* Drawableの描画順序の変化情報の取得
	*
	* 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
	*
	* @param drawableIndex Drawableのインデックス
	* @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
	* @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
	*/
	getDrawableDynamicFlagRenderOrderDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(t[e]);
	}
	/**
	* Drawableの乗算色・スクリーン色の変化情報の取得
	*
	* 直近のCubismModel.update関数でDrawableの乗算色・スクリーン色が変化したかを取得する。
	*
	* @param drawableIndex Drawableのインデックス
	* @return true Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化した
	* @return false Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化してない
	*/
	getDrawableDynamicFlagBlendColorDidChange(e) {
		let t = this._model.drawables.dynamicFlags;
		return Live2DCubismCore.Utils.hasBlendColorDidChangeBit(t[e]);
	}
	/**
	* 保存されたパラメータの読み込み
	*/
	loadParameters() {
		let e = this._model.parameters.count, t = this._savedParameters.getSize();
		e > t && (e = t);
		for (let t = 0; t < e; ++t) this._parameterValues[t] = this._savedParameters.at(t);
	}
	/**
	* 初期化する
	*/
	initialize() {
		T(this._model), this._parameterValues = this._model.parameters.values, this._partOpacities = this._model.parts.opacities, this._parameterMaximumValues = this._model.parameters.maximumValues, this._parameterMinimumValues = this._model.parameters.minimumValues;
		{
			let e = this._model.parameters.ids, t = this._model.parameters.count;
			this._parameterIds.prepareCapacity(t), this._userParameterRepeatDataList.prepareCapacity(t);
			for (let n = 0; n < t; ++n) this._parameterIds.pushBack(N.getIdManager().getId(e[n])), this._userParameterRepeatDataList.pushBack(new Ta(!1, !1));
		}
		let e = this._model.parts.count;
		{
			let t = this._model.parts.ids;
			this._partIds.prepareCapacity(e);
			for (let n = 0; n < e; ++n) this._partIds.pushBack(N.getIdManager().getId(t[n]));
			this._userPartMultiplyColors.prepareCapacity(e), this._userPartScreenColors.prepareCapacity(e), this._partChildDrawables.prepareCapacity(e);
		}
		{
			let t = this._model.drawables.ids, n = this._model.drawables.count;
			this._userMultiplyColors.prepareCapacity(n), this._userScreenColors.prepareCapacity(n), this._userCullings.prepareCapacity(n);
			let r = new Oa(!1, !1);
			for (let t = 0; t < e; ++t) {
				let e = new w(1, 1, 1, 1), r = new w(0, 0, 0, 1), i = new Da(!1, e), a = new Da(!1, r);
				this._userPartMultiplyColors.pushBack(i), this._userPartScreenColors.pushBack(a), this._partChildDrawables.pushBack(new S()), this._partChildDrawables.at(t).prepareCapacity(n);
			}
			for (let e = 0; e < n; ++e) {
				let n = new w(1, 1, 1, 1), i = new w(0, 0, 0, 1), a = new Ea(!1, n), o = new Ea(!1, i);
				this._drawableIds.pushBack(N.getIdManager().getId(t[e])), this._userMultiplyColors.pushBack(a), this._userScreenColors.pushBack(o), this._userCullings.pushBack(r);
				let s = this.getDrawableParentPartIndex(e);
				s >= 0 && this._partChildDrawables.at(s).pushBack(e);
			}
		}
	}
	/**
	* コンストラクタ
	* @param model モデル
	*/
	constructor(e) {
		this._model = e, this._parameterValues = null, this._parameterMaximumValues = null, this._parameterMinimumValues = null, this._partOpacities = null, this._savedParameters = new S(), this._parameterIds = new S(), this._drawableIds = new S(), this._partIds = new S(), this._isOverriddenParameterRepeat = !0, this._isOverriddenModelMultiplyColors = !1, this._isOverriddenModelScreenColors = !1, this._isOverriddenCullings = !1, this._modelOpacity = 1, this._userParameterRepeatDataList = new S(), this._userMultiplyColors = new S(), this._userScreenColors = new S(), this._userCullings = new S(), this._userPartMultiplyColors = new S(), this._userPartScreenColors = new S(), this._partChildDrawables = new S(), this._notExistPartId = new O(), this._notExistParameterId = new O(), this._notExistParameterValues = new O(), this._notExistPartOpacities = new O();
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._model.release(), this._model = null;
	}
}, Aa;
((e) => {
	e.CubismModel = ka;
})(Aa ||= {});
var ja = class e {
	/**
	* Mocデータの作成
	*/
	static create(t, n) {
		let r = null;
		if (n && !this.hasMocConsistency(t)) return D("Inconsistent MOC3."), r;
		let i = Live2DCubismCore.Moc.fromArrayBuffer(t);
		return i && (r = new e(i), r._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(i, t)), r;
	}
	/**
	* Mocデータを削除
	*
	* Mocデータを削除する
	*/
	static delete(e) {
		e._moc._release(), e._moc = null, e = null;
	}
	/**
	* モデルを作成する
	*
	* @return Mocデータから作成されたモデル
	*/
	createModel() {
		let e = null, t = Live2DCubismCore.Model.fromMoc(this._moc);
		return t && (e = new ka(t), e.initialize(), ++this._modelCount), e;
	}
	/**
	* モデルを削除する
	*/
	deleteModel(e) {
		e != null && (e.release(), e = null, --this._modelCount);
	}
	/**
	* コンストラクタ
	*/
	constructor(e) {
		this._moc = e, this._modelCount = 0, this._mocVersion = 0;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		T(this._modelCount == 0), this._moc._release(), this._moc = null;
	}
	/**
	* 最新の.moc3 Versionを取得
	*/
	getLatestMocVersion() {
		return Live2DCubismCore.Version.csmGetLatestMocVersion();
	}
	/**
	* 読み込んだモデルの.moc3 Versionを取得
	*/
	getMocVersion() {
		return this._mocVersion;
	}
	/**
	* .moc3 の整合性を検証する
	*/
	static hasMocConsistency(e) {
		return Live2DCubismCore.Moc.prototype.hasMocConsistency(e) === 1;
	}
}, Ma;
((e) => {
	e.CubismMoc = ja;
})(Ma ||= {});
var Na = /* @__PURE__ */ ((e) => (e[e.CubismPhysicsTargetType_Parameter = 0] = "CubismPhysicsTargetType_Parameter", e))(Na || {}), Pa = /* @__PURE__ */ ((e) => (e[e.CubismPhysicsSource_X = 0] = "CubismPhysicsSource_X", e[e.CubismPhysicsSource_Y = 1] = "CubismPhysicsSource_Y", e[e.CubismPhysicsSource_Angle = 2] = "CubismPhysicsSource_Angle", e))(Pa || {}), Fa = class {
	constructor() {
		this.gravity = new U(0, 0), this.wind = new U(0, 0);
	}
}, Ia = class {}, La = class {}, Ra = class {
	constructor() {
		this.initialPosition = new U(0, 0), this.position = new U(0, 0), this.lastPosition = new U(0, 0), this.lastGravity = new U(0, 0), this.force = new U(0, 0), this.velocity = new U(0, 0);
	}
}, za = class {
	constructor() {
		this.normalizationPosition = new La(), this.normalizationAngle = new La();
	}
}, Ba = class {
	constructor() {
		this.source = new Ia();
	}
}, Va = class {
	constructor() {
		this.destination = new Ia(), this.translationScale = new U(0, 0);
	}
}, Ha = class {
	constructor() {
		this.settings = new S(), this.inputs = new S(), this.outputs = new S(), this.particles = new S(), this.gravity = new U(0, 0), this.wind = new U(0, 0), this.fps = 0;
	}
}, Ua;
((e) => {
	e.CubismPhysicsInput = Ba, e.CubismPhysicsNormalization = La, e.CubismPhysicsOutput = Va, e.CubismPhysicsParameter = Ia, e.CubismPhysicsParticle = Ra, e.CubismPhysicsRig = Ha, e.CubismPhysicsSource = Pa, e.CubismPhysicsSubRig = za, e.CubismPhysicsTargetType = Na, e.PhysicsJsonEffectiveForces = Fa;
})(Ua ||= {});
var Wa = "Position", Ga = "X", Ka = "Y", qa = "Angle", Ja = "Type", Ya = "Id", Q = "Meta", Xa = "EffectiveForces", Za = "TotalInputCount", Qa = "TotalOutputCount", $a = "PhysicsSettingCount", eo = "Gravity", to = "Wind", no = "VertexCount", ro = "Fps", $ = "PhysicsSettings", io = "Normalization", ao = "Minimum", oo = "Maximum", so = "Default", co = "Reflect", lo = "Weight", uo = "Input", fo = "Source", po = "Output", mo = "Scale", ho = "VertexIndex", go = "Destination", _o = "Vertices", vo = "Mobility", yo = "Delay", bo = "Radius", xo = "Acceleration", So = class {
	/**
	* コンストラクタ
	* @param buffer physics3.jsonが読み込まれているバッファ
	* @param size バッファのサイズ
	*/
	constructor(e, t) {
		this._json = A.create(e, t);
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		A.delete(this._json);
	}
	/**
	* 重力の取得
	* @return 重力
	*/
	getGravity() {
		let e = new U(0, 0);
		return e.x = this._json.getRoot().getValueByString(Q).getValueByString(Xa).getValueByString(eo).getValueByString(Ga).toFloat(), e.y = this._json.getRoot().getValueByString(Q).getValueByString(Xa).getValueByString(eo).getValueByString(Ka).toFloat(), e;
	}
	/**
	* 風の取得
	* @return 風
	*/
	getWind() {
		let e = new U(0, 0);
		return e.x = this._json.getRoot().getValueByString(Q).getValueByString(Xa).getValueByString(to).getValueByString(Ga).toFloat(), e.y = this._json.getRoot().getValueByString(Q).getValueByString(Xa).getValueByString(to).getValueByString(Ka).toFloat(), e;
	}
	/**
	* 物理演算設定FPSの取得
	* @return 物理演算設定FPS
	*/
	getFps() {
		return this._json.getRoot().getValueByString(Q).getValueByString(ro).toFloat(0);
	}
	/**
	* 物理店の管理の個数の取得
	* @return 物理店の管理の個数
	*/
	getSubRigCount() {
		return this._json.getRoot().getValueByString(Q).getValueByString($a).toInt();
	}
	/**
	* 入力の総合計の取得
	* @return 入力の総合計
	*/
	getTotalInputCount() {
		return this._json.getRoot().getValueByString(Q).getValueByString(Za).toInt();
	}
	/**
	* 出力の総合計の取得
	* @return 出力の総合計
	*/
	getTotalOutputCount() {
		return this._json.getRoot().getValueByString(Q).getValueByString(Qa).toInt();
	}
	/**
	* 物理点の個数の取得
	* @return 物理点の個数
	*/
	getVertexCount() {
		return this._json.getRoot().getValueByString(Q).getValueByString(no).toInt();
	}
	/**
	* 正規化された位置の最小値の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 正規化された位置の最小値
	*/
	getNormalizationPositionMinimumValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(Wa).getValueByString(ao).toFloat();
	}
	/**
	* 正規化された位置の最大値の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 正規化された位置の最大値
	*/
	getNormalizationPositionMaximumValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(Wa).getValueByString(oo).toFloat();
	}
	/**
	* 正規化された位置のデフォルト値の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 正規化された位置のデフォルト値
	*/
	getNormalizationPositionDefaultValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(Wa).getValueByString(so).toFloat();
	}
	/**
	* 正規化された角度の最小値の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 正規化された角度の最小値
	*/
	getNormalizationAngleMinimumValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(qa).getValueByString(ao).toFloat();
	}
	/**
	* 正規化された角度の最大値の取得
	* @param physicsSettingIndex
	* @return 正規化された角度の最大値
	*/
	getNormalizationAngleMaximumValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(qa).getValueByString(oo).toFloat();
	}
	/**
	* 正規化された角度のデフォルト値の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 正規化された角度のデフォルト値
	*/
	getNormalizationAngleDefaultValue(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(io).getValueByString(qa).getValueByString(so).toFloat();
	}
	/**
	* 入力の個数の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 入力の個数
	*/
	getInputCount(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(uo).getVector().getSize();
	}
	/**
	* 入力の重みの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param inputIndex 入力のインデックス
	* @return 入力の重み
	*/
	getInputWeight(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(uo).getValueByIndex(t).getValueByString(lo).toFloat();
	}
	/**
	* 入力の反転の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param inputIndex 入力のインデックス
	* @return 入力の反転
	*/
	getInputReflect(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(uo).getValueByIndex(t).getValueByString(co).toBoolean();
	}
	/**
	* 入力の種類の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param inputIndex 入力のインデックス
	* @return 入力の種類
	*/
	getInputType(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(uo).getValueByIndex(t).getValueByString(Ja).getRawString();
	}
	/**
	* 入力元のIDの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param inputIndex 入力のインデックス
	* @return 入力元のID
	*/
	getInputSourceId(e, t) {
		return N.getIdManager().getId(this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(uo).getValueByIndex(t).getValueByString(fo).getValueByString(Ya).getRawString());
	}
	/**
	* 出力の個数の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @return 出力の個数
	*/
	getOutputCount(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getVector().getSize();
	}
	/**
	* 出力の物理点のインデックスの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力の物理点のインデックス
	*/
	getOutputVertexIndex(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(ho).toInt();
	}
	/**
	* 出力の角度のスケールを取得する
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力の角度のスケール
	*/
	getOutputAngleScale(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(mo).toFloat();
	}
	/**
	* 出力の重みの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力の重み
	*/
	getOutputWeight(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(lo).toFloat();
	}
	/**
	* 出力先のIDの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力先のID
	*/
	getOutputDestinationId(e, t) {
		return N.getIdManager().getId(this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(go).getValueByString(Ya).getRawString());
	}
	/**
	* 出力の種類の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力の種類
	*/
	getOutputType(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(Ja).getRawString();
	}
	/**
	* 出力の反転の取得
	* @param physicsSettingIndex 物理演算のインデックス
	* @param outputIndex 出力のインデックス
	* @return 出力の反転
	*/
	getOutputReflect(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(po).getValueByIndex(t).getValueByString(co).toBoolean();
	}
	/**
	* 物理点の個数の取得
	* @param physicsSettingIndex 物理演算男設定のインデックス
	* @return 物理点の個数
	*/
	getParticleCount(e) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getVector().getSize();
	}
	/**
	* 物理点の動きやすさの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param vertexIndex 物理点のインデックス
	* @return 物理点の動きやすさ
	*/
	getParticleMobility(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(vo).toFloat();
	}
	/**
	* 物理点の遅れの取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param vertexIndex 物理点のインデックス
	* @return 物理点の遅れ
	*/
	getParticleDelay(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(yo).toFloat();
	}
	/**
	* 物理点の加速度の取得
	* @param physicsSettingIndex 物理演算の設定
	* @param vertexIndex 物理点のインデックス
	* @return 物理点の加速度
	*/
	getParticleAcceleration(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(xo).toFloat();
	}
	/**
	* 物理点の距離の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param vertexIndex 物理点のインデックス
	* @return 物理点の距離
	*/
	getParticleRadius(e, t) {
		return this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(bo).toFloat();
	}
	/**
	* 物理点の位置の取得
	* @param physicsSettingIndex 物理演算の設定のインデックス
	* @param vertexInde 物理点のインデックス
	* @return 物理点の位置
	*/
	getParticlePosition(e, t) {
		let n = new U(0, 0);
		return n.x = this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(Wa).getValueByString(Ga).toFloat(), n.y = this._json.getRoot().getValueByString($).getValueByIndex(e).getValueByString(_o).getValueByIndex(t).getValueByString(Wa).getValueByString(Ka).toFloat(), n;
	}
}, Co;
((e) => {
	e.CubismPhysicsJson = So;
})(Co ||= {});
var wo = "X", To = "Y", Eo = "Angle", Do = 5, Oo = 100, ko = .001, Ao = 5, jo = class e {
	/**
	* インスタンスの作成
	* @param buffer    physics3.jsonが読み込まれているバッファ
	* @param size      バッファのサイズ
	* @return 作成されたインスタンス
	*/
	static create(t, n) {
		let r = new e();
		return r.parse(t, n), r._physicsRig.gravity.y = 0, r;
	}
	/**
	* インスタンスを破棄する
	* @param physics 破棄するインスタンス
	*/
	static delete(e) {
		e != null && (e.release(), e = null);
	}
	/**
	* physics3.jsonをパースする。
	* @param physicsJson physics3.jsonが読み込まれているバッファ
	* @param size バッファのサイズ
	*/
	parse(e, t) {
		this._physicsRig = new Ha();
		let n = new So(e, t);
		this._physicsRig.gravity = n.getGravity(), this._physicsRig.wind = n.getWind(), this._physicsRig.subRigCount = n.getSubRigCount(), this._physicsRig.fps = n.getFps(), this._physicsRig.settings.updateSize(this._physicsRig.subRigCount, za, !0), this._physicsRig.inputs.updateSize(n.getTotalInputCount(), Ba, !0), this._physicsRig.outputs.updateSize(n.getTotalOutputCount(), Va, !0), this._physicsRig.particles.updateSize(n.getVertexCount(), Ra, !0), this._currentRigOutputs.clear(), this._previousRigOutputs.clear();
		let r = 0, i = 0, a = 0;
		for (let e = 0; e < this._physicsRig.settings.getSize(); ++e) {
			this._physicsRig.settings.at(e).normalizationPosition.minimum = n.getNormalizationPositionMinimumValue(e), this._physicsRig.settings.at(e).normalizationPosition.maximum = n.getNormalizationPositionMaximumValue(e), this._physicsRig.settings.at(e).normalizationPosition.defalut = n.getNormalizationPositionDefaultValue(e), this._physicsRig.settings.at(e).normalizationAngle.minimum = n.getNormalizationAngleMinimumValue(e), this._physicsRig.settings.at(e).normalizationAngle.maximum = n.getNormalizationAngleMaximumValue(e), this._physicsRig.settings.at(e).normalizationAngle.defalut = n.getNormalizationAngleDefaultValue(e), this._physicsRig.settings.at(e).inputCount = n.getInputCount(e), this._physicsRig.settings.at(e).baseInputIndex = r;
			for (let t = 0; t < this._physicsRig.settings.at(e).inputCount; ++t) this._physicsRig.inputs.at(r + t).sourceParameterIndex = -1, this._physicsRig.inputs.at(r + t).weight = n.getInputWeight(e, t), this._physicsRig.inputs.at(r + t).reflect = n.getInputReflect(e, t), n.getInputType(e, t) == wo ? (this._physicsRig.inputs.at(r + t).type = Pa.CubismPhysicsSource_X, this._physicsRig.inputs.at(r + t).getNormalizedParameterValue = Fo) : n.getInputType(e, t) == To ? (this._physicsRig.inputs.at(r + t).type = Pa.CubismPhysicsSource_Y, this._physicsRig.inputs.at(r + t).getNormalizedParameterValue = Io) : n.getInputType(e, t) == Eo && (this._physicsRig.inputs.at(r + t).type = Pa.CubismPhysicsSource_Angle, this._physicsRig.inputs.at(r + t).getNormalizedParameterValue = Lo), this._physicsRig.inputs.at(r + t).source.targetType = Na.CubismPhysicsTargetType_Parameter, this._physicsRig.inputs.at(r + t).source.id = n.getInputSourceId(e, t);
			r += this._physicsRig.settings.at(e).inputCount, this._physicsRig.settings.at(e).outputCount = n.getOutputCount(e), this._physicsRig.settings.at(e).baseOutputIndex = i;
			let t = new No();
			t.outputs.resize(this._physicsRig.settings.at(e).outputCount);
			let o = new No();
			o.outputs.resize(this._physicsRig.settings.at(e).outputCount);
			for (let r = 0; r < this._physicsRig.settings.at(e).outputCount; ++r) t.outputs.set(r, 0), o.outputs.set(r, 0), this._physicsRig.outputs.at(i + r).destinationParameterIndex = -1, this._physicsRig.outputs.at(i + r).vertexIndex = n.getOutputVertexIndex(e, r), this._physicsRig.outputs.at(i + r).angleScale = n.getOutputAngleScale(e, r), this._physicsRig.outputs.at(i + r).weight = n.getOutputWeight(e, r), this._physicsRig.outputs.at(i + r).destination.targetType = Na.CubismPhysicsTargetType_Parameter, this._physicsRig.outputs.at(i + r).destination.id = n.getOutputDestinationId(e, r), n.getOutputType(e, r) == wo ? (this._physicsRig.outputs.at(i + r).type = Pa.CubismPhysicsSource_X, this._physicsRig.outputs.at(i + r).getValue = Ro, this._physicsRig.outputs.at(i + r).getScale = Uo) : n.getOutputType(e, r) == To ? (this._physicsRig.outputs.at(i + r).type = Pa.CubismPhysicsSource_Y, this._physicsRig.outputs.at(i + r).getValue = zo, this._physicsRig.outputs.at(i + r).getScale = Wo) : n.getOutputType(e, r) == Eo && (this._physicsRig.outputs.at(i + r).type = Pa.CubismPhysicsSource_Angle, this._physicsRig.outputs.at(i + r).getValue = Bo, this._physicsRig.outputs.at(i + r).getScale = Go), this._physicsRig.outputs.at(i + r).reflect = n.getOutputReflect(e, r);
			this._currentRigOutputs.pushBack(t), this._previousRigOutputs.pushBack(o), i += this._physicsRig.settings.at(e).outputCount, this._physicsRig.settings.at(e).particleCount = n.getParticleCount(e), this._physicsRig.settings.at(e).baseParticleIndex = a;
			for (let t = 0; t < this._physicsRig.settings.at(e).particleCount; ++t) this._physicsRig.particles.at(a + t).mobility = n.getParticleMobility(e, t), this._physicsRig.particles.at(a + t).delay = n.getParticleDelay(e, t), this._physicsRig.particles.at(a + t).acceleration = n.getParticleAcceleration(e, t), this._physicsRig.particles.at(a + t).radius = n.getParticleRadius(e, t), this._physicsRig.particles.at(a + t).position = n.getParticlePosition(e, t);
			a += this._physicsRig.settings.at(e).particleCount;
		}
		this.initialize(), n.release(), n = void 0, n = null;
	}
	/**
	* 現在のパラメータ値で物理演算が安定化する状態を演算する。
	* @param model 物理演算の結果を適用するモデル
	*/
	stabilization(e) {
		let t, n, r, i, a = new U(), o, s, c, l, u = e.getModel().parameters.values, d = e.getModel().parameters.maximumValues, f = e.getModel().parameters.minimumValues, p = e.getModel().parameters.defaultValues;
		(this._parameterCaches?.length ?? 0) < e.getParameterCount() && (this._parameterCaches = new Float32Array(e.getParameterCount())), (this._parameterInputCaches?.length ?? 0) < e.getParameterCount() && (this._parameterInputCaches = new Float32Array(e.getParameterCount()));
		for (let t = 0; t < e.getParameterCount(); ++t) this._parameterCaches[t] = u[t], this._parameterInputCaches[t] = u[t];
		for (let m = 0; m < this._physicsRig.subRigCount; ++m) {
			t = { angle: 0 }, a.x = 0, a.y = 0, o = this._physicsRig.settings.at(m), s = this._physicsRig.inputs.get(o.baseInputIndex), c = this._physicsRig.outputs.get(o.baseOutputIndex), l = this._physicsRig.particles.get(o.baseParticleIndex);
			for (let r = 0; r < o.inputCount; ++r) n = s[r].weight / Oo, s[r].sourceParameterIndex == -1 && (s[r].sourceParameterIndex = e.getParameterIndex(s[r].source.id)), s[r].getNormalizedParameterValue(a, t, u[s[r].sourceParameterIndex], f[s[r].sourceParameterIndex], d[s[r].sourceParameterIndex], p[s[r].sourceParameterIndex], o.normalizationPosition, o.normalizationAngle, s[r].reflect, n), this._parameterCaches[s[r].sourceParameterIndex] = u[s[r].sourceParameterIndex];
			r = W.degreesToRadian(-t.angle), a.x = a.x * W.cos(r) - a.y * W.sin(r), a.y = a.x * W.sin(r) + a.y * W.cos(r), qo(l, o.particleCount, a, t.angle, this._options.wind, ko * o.normalizationPosition.maximum);
			for (let t = 0; t < o.outputCount; ++t) {
				let n = c[t].vertexIndex;
				if (c[t].destinationParameterIndex == -1 && (c[t].destinationParameterIndex = e.getParameterIndex(c[t].destination.id)), n < 1 || n >= o.particleCount) continue;
				let r = new U();
				r = l[n].position.substract(l[n - 1].position), i = c[t].getValue(r, l, n, c[t].reflect, this._options.gravity), this._currentRigOutputs.at(m).outputs.set(t, i), this._previousRigOutputs.at(m).outputs.set(t, i);
				let a = c[t].destinationParameterIndex, s = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(u.subarray(a))) : u.slice(a);
				Jo(s, f[a], d[a], i, c[t]);
				for (let e = a, t = 0; e < this._parameterCaches.length; e++, t++) u[e] = this._parameterCaches[e] = s[t];
			}
		}
	}
	/**
	* 物理演算の評価
	*
	* Pendulum interpolation weights
	*
	* 振り子の計算結果は保存され、パラメータへの出力は保存された前回の結果で補間されます。
	* The result of the pendulum calculation is saved and
	* the output to the parameters is interpolated with the saved previous result of the pendulum calculation.
	*
	* 図で示すと[1]と[2]で補間されます。
	* The figure shows the interpolation between [1] and [2].
	*
	* 補間の重みは最新の振り子計算タイミングと次回のタイミングの間で見た現在時間で決定する。
	* The weight of the interpolation are determined by the current time seen between
	* the latest pendulum calculation timing and the next timing.
	*
	* 図で示すと[2]と[4]の間でみた(3)の位置の重みになる。
	* Figure shows the weight of position (3) as seen between [2] and [4].
	*
	* 解釈として振り子計算のタイミングと重み計算のタイミングがズレる。
	* As an interpretation, the pendulum calculation and weights are misaligned.
	*
	* physics3.jsonにFPS情報が存在しない場合は常に前の振り子状態で設定される。
	* If there is no FPS information in physics3.json, it is always set in the previous pendulum state.
	*
	* この仕様は補間範囲を逸脱したことが原因の震えたような見た目を回避を目的にしている。
	* The purpose of this specification is to avoid the quivering appearance caused by deviations from the interpolation range.
	*
	* ------------ time -------------->
	*
	*                 |+++++|------| <- weight
	* ==[1]====#=====[2]---(3)----(4)
	*          ^ output contents
	*
	* 1:_previousRigOutputs
	* 2:_currentRigOutputs
	* 3:_currentRemainTime (now rendering)
	* 4:next particles timing
	* @param model 物理演算の結果を適用するモデル
	* @param deltaTimeSeconds デルタ時間[秒]
	*/
	evaluate(e, t) {
		let n, r, i, a, o = new U(), s, c, l, u;
		if (0 >= t) return;
		let d = e.getModel().parameters.values, f = e.getModel().parameters.maximumValues, p = e.getModel().parameters.minimumValues, m = e.getModel().parameters.defaultValues, h;
		if (this._currentRemainTime += t, this._currentRemainTime > Ao && (this._currentRemainTime = 0), (this._parameterCaches?.length ?? 0) < e.getParameterCount() && (this._parameterCaches = new Float32Array(e.getParameterCount())), (this._parameterInputCaches?.length ?? 0) < e.getParameterCount()) {
			this._parameterInputCaches = new Float32Array(e.getParameterCount());
			for (let t = 0; t < e.getParameterCount(); ++t) this._parameterInputCaches[t] = d[t];
		}
		for (h = this._physicsRig.fps > 0 ? 1 / this._physicsRig.fps : t; this._currentRemainTime >= h;) {
			for (let e = 0; e < this._physicsRig.subRigCount; ++e) {
				s = this._physicsRig.settings.at(e), l = this._physicsRig.outputs.get(s.baseOutputIndex);
				for (let t = 0; t < s.outputCount; ++t) this._previousRigOutputs.at(e).outputs.set(t, this._currentRigOutputs.at(e).outputs.at(t));
			}
			let t = h / this._currentRemainTime;
			for (let n = 0; n < e.getParameterCount(); ++n) this._parameterCaches[n] = this._parameterInputCaches[n] * (1 - t) + d[n] * t, this._parameterInputCaches[n] = this._parameterCaches[n];
			for (let t = 0; t < this._physicsRig.subRigCount; ++t) {
				n = { angle: 0 }, o.x = 0, o.y = 0, s = this._physicsRig.settings.at(t), c = this._physicsRig.inputs.get(s.baseInputIndex), l = this._physicsRig.outputs.get(s.baseOutputIndex), u = this._physicsRig.particles.get(s.baseParticleIndex);
				for (let t = 0; t < s.inputCount; ++t) r = c[t].weight / Oo, c[t].sourceParameterIndex == -1 && (c[t].sourceParameterIndex = e.getParameterIndex(c[t].source.id)), c[t].getNormalizedParameterValue(o, n, this._parameterCaches[c[t].sourceParameterIndex], p[c[t].sourceParameterIndex], f[c[t].sourceParameterIndex], m[c[t].sourceParameterIndex], s.normalizationPosition, s.normalizationAngle, c[t].reflect, r);
				i = W.degreesToRadian(-n.angle), o.x = o.x * W.cos(i) - o.y * W.sin(i), o.y = o.x * W.sin(i) + o.y * W.cos(i), Ko(u, s.particleCount, o, n.angle, this._options.wind, ko * s.normalizationPosition.maximum, h, Do);
				for (let n = 0; n < s.outputCount; ++n) {
					let r = l[n].vertexIndex;
					if (l[n].destinationParameterIndex == -1 && (l[n].destinationParameterIndex = e.getParameterIndex(l[n].destination.id)), r < 1 || r >= s.particleCount) continue;
					let i = new U();
					i.x = u[r].position.x - u[r - 1].position.x, i.y = u[r].position.y - u[r - 1].position.y, a = l[n].getValue(i, u, r, l[n].reflect, this._options.gravity), this._currentRigOutputs.at(t).outputs.set(n, a);
					let o = l[n].destinationParameterIndex, c = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(this._parameterCaches.subarray(o))) : this._parameterCaches.slice(o);
					Jo(c, p[o], f[o], a, l[n]);
					for (let e = o, t = 0; e < this._parameterCaches.length; e++, t++) this._parameterCaches[e] = c[t];
				}
			}
			this._currentRemainTime -= h;
		}
		let g = this._currentRemainTime / h;
		this.interpolate(e, g);
	}
	/**
	* 物理演算結果の適用
	* 振り子演算の最新の結果と一つ前の結果から指定した重みで適用する。
	* @param model 物理演算の結果を適用するモデル
	* @param weight 最新結果の重み
	*/
	interpolate(e, t) {
		let n, r, i = e.getModel().parameters.values, a = e.getModel().parameters.maximumValues, o = e.getModel().parameters.minimumValues;
		for (let e = 0; e < this._physicsRig.subRigCount; ++e) {
			r = this._physicsRig.settings.at(e), n = this._physicsRig.outputs.get(r.baseOutputIndex);
			for (let s = 0; s < r.outputCount; ++s) {
				if (n[s].destinationParameterIndex == -1) continue;
				let r = n[s].destinationParameterIndex, c = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(i.subarray(r))) : i.slice(r);
				Jo(c, o[r], a[r], this._previousRigOutputs.at(e).outputs.at(s) * (1 - t) + this._currentRigOutputs.at(e).outputs.at(s) * t, n[s]);
				for (let e = r, t = 0; e < i.length; e++, t++) i[e] = c[t];
			}
		}
	}
	/**
	* オプションの設定
	* @param options オプション
	*/
	setOptions(e) {
		this._options = e;
	}
	/**
	* オプションの取得
	* @return オプション
	*/
	getOption() {
		return this._options;
	}
	/**
	* コンストラクタ
	*/
	constructor() {
		this._physicsRig = null, this._options = new Mo(), this._options.gravity.y = -1, this._options.gravity.x = 0, this._options.wind.x = 0, this._options.wind.y = 0, this._currentRigOutputs = new S(), this._previousRigOutputs = new S(), this._currentRemainTime = 0, this._parameterCaches = null, this._parameterInputCaches = null;
	}
	/**
	* デストラクタ相当の処理
	*/
	release() {
		this._physicsRig = void 0, this._physicsRig = null;
	}
	/**
	* 初期化する
	*/
	initialize() {
		let e, t, n;
		for (let r = 0; r < this._physicsRig.subRigCount; ++r) {
			t = this._physicsRig.settings.at(r), e = this._physicsRig.particles.get(t.baseParticleIndex), e[0].initialPosition = new U(0, 0), e[0].lastPosition = new U(e[0].initialPosition.x, e[0].initialPosition.y), e[0].lastGravity = new U(0, -1), e[0].lastGravity.y *= -1, e[0].velocity = new U(0, 0), e[0].force = new U(0, 0);
			for (let r = 1; r < t.particleCount; ++r) n = new U(0, 0), n.y = e[r].radius, e[r].initialPosition = new U(e[r - 1].initialPosition.x + n.x, e[r - 1].initialPosition.y + n.y), e[r].position = new U(e[r].initialPosition.x, e[r].initialPosition.y), e[r].lastPosition = new U(e[r].initialPosition.x, e[r].initialPosition.y), e[r].lastGravity = new U(0, -1), e[r].lastGravity.y *= -1, e[r].velocity = new U(0, 0), e[r].force = new U(0, 0);
		}
	}
}, Mo = class {
	constructor() {
		this.gravity = new U(0, 0), this.wind = new U(0, 0);
	}
}, No = class {
	constructor() {
		this.outputs = new S(0);
	}
};
function Po(e) {
	let t = 0;
	return e > 0 ? t = 1 : e < 0 && (t = -1), t;
}
function Fo(e, t, n, r, i, a, o, s, c, l) {
	e.x += Yo(n, r, i, a, o.minimum, o.maximum, o.defalut, c) * l;
}
function Io(e, t, n, r, i, a, o, s, c, l) {
	e.y += Yo(n, r, i, a, o.minimum, o.maximum, o.defalut, c) * l;
}
function Lo(e, t, n, r, i, a, o, s, c, l) {
	t.angle += Yo(n, r, i, a, s.minimum, s.maximum, s.defalut, c) * l;
}
function Ro(e, t, n, r, i) {
	let a = e.x;
	return r && (a *= -1), a;
}
function zo(e, t, n, r, i) {
	let a = e.y;
	return r && (a *= -1), a;
}
function Bo(e, t, n, r, i) {
	let a;
	return i = n >= 2 ? t[n - 1].position.substract(t[n - 2].position) : i.multiplyByScaler(-1), a = W.directionToRadian(i, e), r && (a *= -1), a;
}
function Vo(e, t) {
	let n = W.max(e, t), r = W.min(e, t);
	return W.abs(n - r);
}
function Ho(e, t) {
	return W.min(e, t) + Vo(e, t) / 2;
}
function Uo(e, t) {
	return JSON.parse(JSON.stringify(e.x));
}
function Wo(e, t) {
	return JSON.parse(JSON.stringify(e.y));
}
function Go(e, t) {
	return JSON.parse(JSON.stringify(t));
}
function Ko(e, t, n, r, i, a, o, s) {
	let c, l, u = new U(0, 0), d = new U(0, 0), f = new U(0, 0), p = new U(0, 0);
	e[0].position = new U(n.x, n.y);
	let m = W.degreesToRadian(r), h = W.radianToDirection(m);
	h.normalize();
	for (let n = 1; n < t; ++n) e[n].force = h.multiplyByScaler(e[n].acceleration).add(i), e[n].lastPosition = new U(e[n].position.x, e[n].position.y), c = e[n].delay * o * 30, u = e[n].position.substract(e[n - 1].position), l = W.directionToRadian(e[n].lastGravity, h) / s, u.x = W.cos(l) * u.x - u.y * W.sin(l), u.y = W.sin(l) * u.x + u.y * W.cos(l), e[n].position = e[n - 1].position.add(u), d = e[n].velocity.multiplyByScaler(c), f = e[n].force.multiplyByScaler(c).multiplyByScaler(c), e[n].position = e[n].position.add(d).add(f), p = e[n].position.substract(e[n - 1].position), p.normalize(), e[n].position = e[n - 1].position.add(p.multiplyByScaler(e[n].radius)), W.abs(e[n].position.x) < a && (e[n].position.x = 0), c != 0 && (e[n].velocity = e[n].position.substract(e[n].lastPosition), e[n].velocity = e[n].velocity.divisionByScalar(c), e[n].velocity = e[n].velocity.multiplyByScaler(e[n].mobility)), e[n].force = new U(0, 0), e[n].lastGravity = new U(h.x, h.y);
}
function qo(e, t, n, r, i, a) {
	let o = new U(0, 0);
	e[0].position = new U(n.x, n.y);
	let s = W.degreesToRadian(r), c = W.radianToDirection(s);
	c.normalize();
	for (let n = 1; n < t; ++n) e[n].force = c.multiplyByScaler(e[n].acceleration).add(i), e[n].lastPosition = new U(e[n].position.x, e[n].position.y), e[n].velocity = new U(0, 0), o = e[n].force, o.normalize(), o = o.multiplyByScaler(e[n].radius), e[n].position = e[n - 1].position.add(o), W.abs(e[n].position.x) < a && (e[n].position.x = 0), e[n].force = new U(0, 0), e[n].lastGravity = new U(c.x, c.y);
}
function Jo(e, t, n, r, i) {
	let a;
	a = r * i.getScale(i.translationScale, i.angleScale), a < t ? (a < i.valueBelowMinimum && (i.valueBelowMinimum = a), a = t) : a > n && (a > i.valueExceededMaximum && (i.valueExceededMaximum = a), a = n);
	let o = i.weight / Oo;
	o >= 1 || (a = e[0] * (1 - o) + a * o), e[0] = a;
}
function Yo(e, t, n, r, i, a, o, s) {
	let c = 0, l = W.max(n, t);
	l < e && (e = l);
	let u = W.min(n, t);
	u > e && (e = u);
	let d = W.min(i, a), f = W.max(i, a), p = o, m = Ho(u, l), h = e - m;
	switch (Po(h)) {
		case 1: {
			let e = f - p, t = l - m;
			t != 0 && (c = e / t * h, c += p);
			break;
		}
		case -1: {
			let e = d - p, t = u - m;
			t != 0 && (c = e / t * h, c += p);
			break;
		}
		case 0: c = p;
	}
	return s ? c : c * -1;
}
var Xo;
((e) => {
	e.CubismPhysics = jo, e.Options = Mo;
})(Xo ||= {}), V.registerRuntime({
	version: 4,
	ready: ma,
	test(e) {
		return e instanceof la || la.isValidJSON(e);
	},
	isValidMoc(e) {
		if (e.byteLength < 4) return !1;
		let t = new Int8Array(e, 0, 4);
		return String.fromCharCode(...t) === "MOC3";
	},
	createModelSettings(e) {
		return new la(e);
	},
	createCoreModel(e, t) {
		let n = ja.create(e, !!t?.checkMocConsistency);
		try {
			let e = n.createModel();
			return e.__moc = n, e;
		} catch (e) {
			try {
				n.release();
			} catch (e) {
				F.warn("CubismFactory", "Failed to release moc after core model creation failed.", e);
			}
			throw e;
		}
	},
	createInternalModel(e, t, n) {
		let r = new na(e, t, n), i = e;
		return i.__moc && (r.__moc = i.__moc, delete i.__moc, r.once("destroy", Zo)), r;
	},
	createPhysics(e, t) {
		if (!(t instanceof ArrayBuffer)) throw TypeError("Cubism physics data must be an ArrayBuffer.");
		return jo.create(t, t.byteLength);
	},
	createPose(e, t) {
		if (!(t instanceof ArrayBuffer)) throw TypeError("Cubism pose data must be an ArrayBuffer.");
		return Sa.create(t, t.byteLength);
	}
});
function Zo() {
	var e;
	(e = this.__moc) == null || e.release();
}
//#endregion
export { Nn as Live2DModel, On as Live2DPlugin, pa as configureCubismSDK };
