import { ACESFilmicToneMapping as e, AnimationClip as t, AnimationMixer as n, BackSide as r, Bone as i, Box3 as a, BoxGeometry as o, BufferAttribute as s, BufferGeometry as c, ClampToEdgeWrapping as l, Color as u, ColorManagement as d, Controls as f, DirectionalLight as p, DoubleSide as m, FileLoader as h, FrontSide as g, Group as _, ImageBitmapLoader as ee, InstancedBufferAttribute as te, InstancedMesh as ne, InterleavedBuffer as re, InterleavedBufferAttribute as ie, Interpolant as ae, InterpolateDiscrete as oe, InterpolateLinear as se, Line as ce, LineBasicMaterial as le, LineLoop as ue, LineSegments as de, LinearFilter as v, LinearMipmapLinearFilter as fe, LinearMipmapNearestFilter as pe, LinearSRGBColorSpace as y, Loader as me, LoaderUtils as b, MOUSE as x, Material as S, MathUtils as he, Matrix4 as C, Mesh as w, MeshBasicMaterial as T, MeshLambertMaterial as ge, MeshPhongMaterial as _e, MeshPhysicalMaterial as E, MeshStandardMaterial as D, MirroredRepeatWrapping as ve, NearestFilter as ye, NearestMipmapLinearFilter as be, NearestMipmapNearestFilter as xe, NumberKeyframeTrack as Se, Object3D as Ce, OrthographicCamera as we, PMREMGenerator as Te, PerspectiveCamera as Ee, Plane as De, PointLight as Oe, Points as ke, PointsMaterial as Ae, PropertyBinding as je, Quaternion as O, QuaternionKeyframeTrack as Me, Ray as Ne, RepeatWrapping as k, SRGBColorSpace as A, Scene as Pe, Skeleton as Fe, SkinnedMesh as Ie, Sphere as Le, Spherical as Re, SpotLight as ze, TOUCH as j, Texture as Be, TextureLoader as Ve, Timer as He, TriangleFanDrawMode as M, TriangleStripDrawMode as Ue, TrianglesDrawMode as We, Vector2 as N, Vector3 as P, VectorKeyframeTrack as Ge, WebGLRenderer as Ke } from "three";
//#region node_modules/three/examples/jsm/controls/OrbitControls.js
var qe = { type: "change" }, F = { type: "start" }, Je = { type: "end" }, I = new Ne(), Ye = new De(), Xe = Math.cos(70 * he.DEG2RAD), L = new P(), R = 2 * Math.PI, z = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
}, B = 1e-6, Ze = class extends f {
	constructor(e, t = null) {
		super(e, t), this.state = z.NONE, this.target = new P(), this.cursor = new P(), this.minDistance = 0, this.maxDistance = Infinity, this.minZoom = 0, this.maxZoom = Infinity, this.minTargetRadius = 0, this.maxTargetRadius = Infinity, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -Infinity, this.maxAzimuthAngle = Infinity, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = {
			LEFT: "ArrowLeft",
			UP: "ArrowUp",
			RIGHT: "ArrowRight",
			BOTTOM: "ArrowDown"
		}, this.mouseButtons = {
			LEFT: x.ROTATE,
			MIDDLE: x.DOLLY,
			RIGHT: x.PAN
		}, this.touches = {
			ONE: j.ROTATE,
			TWO: j.DOLLY_PAN
		}, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._cursorStyle = "auto", this._domElementKeyEvents = null, this._lastPosition = new P(), this._lastQuaternion = new O(), this._lastTargetPosition = new P(), this._quat = new O().setFromUnitVectors(e.up, new P(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Re(), this._sphericalDelta = new Re(), this._scale = 1, this._panOffset = new P(), this._rotateStart = new N(), this._rotateEnd = new N(), this._rotateDelta = new N(), this._panStart = new N(), this._panEnd = new N(), this._panDelta = new N(), this._dollyStart = new N(), this._dollyEnd = new N(), this._dollyDelta = new N(), this._dollyDirection = new P(), this._mouse = new N(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = $e.bind(this), this._onPointerDown = Qe.bind(this), this._onPointerUp = et.bind(this), this._onContextMenu = st.bind(this), this._onMouseWheel = rt.bind(this), this._onKeyDown = it.bind(this), this._onTouchStart = at.bind(this), this._onTouchMove = ot.bind(this), this._onMouseDown = tt.bind(this), this._onMouseMove = nt.bind(this), this._interceptControlDown = ct.bind(this), this._interceptControlUp = lt.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
	}
	set cursorStyle(e) {
		this._cursorStyle = e, e === "grab" ? this.domElement.style.cursor = "grab" : this.domElement.style.cursor = "auto";
	}
	get cursorStyle() {
		return this._cursorStyle;
	}
	connect(e) {
		super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, {
			passive: !0,
			capture: !0
		}), this.domElement.style.touchAction = "none";
	}
	disconnect() {
		this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "";
	}
	dispose() {
		this.disconnect();
	}
	getPolarAngle() {
		return this._spherical.phi;
	}
	getAzimuthalAngle() {
		return this._spherical.theta;
	}
	getDistance() {
		return this.object.position.distanceTo(this.target);
	}
	listenToKeyEvents(e) {
		e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
	}
	stopListenToKeyEvents() {
		this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
	}
	saveState() {
		this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
	}
	reset() {
		this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(qe), this.update(), this.state = z.NONE;
	}
	pan(e, t) {
		this._pan(e, t), this.update();
	}
	dollyIn(e) {
		this._dollyIn(e), this.update();
	}
	dollyOut(e) {
		this._dollyOut(e), this.update();
	}
	rotateLeft(e) {
		this._rotateLeft(e), this.update();
	}
	rotateUp(e) {
		this._rotateUp(e), this.update();
	}
	update(e = null) {
		let t = this.object.position;
		L.copy(t).sub(this.target), L.applyQuaternion(this._quat), this._spherical.setFromVector3(L), this.autoRotate && this.state === z.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
		let n = this.minAzimuthAngle, r = this.maxAzimuthAngle;
		isFinite(n) && isFinite(r) && (n < -Math.PI ? n += R : n > Math.PI && (n -= R), r < -Math.PI ? r += R : r > Math.PI && (r -= R), n <= r ? this._spherical.theta = Math.max(n, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + r) / 2 ? Math.max(n, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
		let i = !1;
		if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
		else {
			let e = this._spherical.radius;
			this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = e != this._spherical.radius;
		}
		if (L.setFromSpherical(this._spherical), L.applyQuaternion(this._quatInverse), t.copy(this.target).add(L), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
			let e = null;
			if (this.object.isPerspectiveCamera) {
				let t = L.length();
				e = this._clampDistance(t * this._scale);
				let n = t - e;
				this.object.position.addScaledVector(this._dollyDirection, n), this.object.updateMatrixWorld(), i = !!n;
			} else if (this.object.isOrthographicCamera) {
				let t = new P(this._mouse.x, this._mouse.y, 0);
				t.unproject(this.object);
				let n = this.object.zoom;
				this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = n !== this.object.zoom;
				let r = new P(this._mouse.x, this._mouse.y, 0);
				r.unproject(this.object), this.object.position.sub(r).add(t), this.object.updateMatrixWorld(), e = L.length();
			} else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
			e !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position) : (I.origin.copy(this.object.position), I.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(I.direction)) < Xe ? this.object.lookAt(this.target) : (Ye.setFromNormalAndCoplanarPoint(this.object.up, this.target), I.intersectPlane(Ye, this.target))));
		} else if (this.object.isOrthographicCamera) {
			let e = this.object.zoom;
			this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), e !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
		}
		return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > B || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > B || this._lastTargetPosition.distanceToSquared(this.target) > B ? (this.dispatchEvent(qe), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
	}
	_getAutoRotationAngle(e) {
		return e === null ? R / 60 / 60 * this.autoRotateSpeed : R / 60 * this.autoRotateSpeed * e;
	}
	_getZoomScale(e) {
		let t = Math.abs(e * .01);
		return .95 ** (this.zoomSpeed * t);
	}
	_rotateLeft(e) {
		this._sphericalDelta.theta -= e;
	}
	_rotateUp(e) {
		this._sphericalDelta.phi -= e;
	}
	_panLeft(e, t) {
		L.setFromMatrixColumn(t, 0), L.multiplyScalar(-e), this._panOffset.add(L);
	}
	_panUp(e, t) {
		this.screenSpacePanning === !0 ? L.setFromMatrixColumn(t, 1) : (L.setFromMatrixColumn(t, 0), L.crossVectors(this.object.up, L)), L.multiplyScalar(e), this._panOffset.add(L);
	}
	_pan(e, t) {
		let n = this.domElement;
		if (this.object.isPerspectiveCamera) {
			let r = this.object.position;
			L.copy(r).sub(this.target);
			let i = L.length();
			i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * i / n.clientHeight, this.object.matrix), this._panUp(2 * t * i / n.clientHeight, this.object.matrix);
		} else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
	}
	_dollyOut(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_dollyIn(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_updateZoomParameters(e, t) {
		if (!this.zoomToCursor) return;
		this._performCursorZoom = !0;
		let n = this.domElement.getBoundingClientRect(), r = e - n.left, i = t - n.top, a = n.width, o = n.height;
		this._mouse.x = r / a * 2 - 1, this._mouse.y = -(i / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
	}
	_clampDistance(e) {
		return Math.max(this.minDistance, Math.min(this.maxDistance, e));
	}
	_handleMouseDownRotate(e) {
		this._rotateStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownDolly(e) {
		this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownPan(e) {
		this._panStart.set(e.clientX, e.clientY);
	}
	_handleMouseMoveRotate(e) {
		this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(R * this._rotateDelta.x / t.clientHeight), this._rotateUp(R * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
	}
	_handleMouseMoveDolly(e) {
		this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
	}
	_handleMouseMovePan(e) {
		this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
	}
	_handleMouseWheel(e) {
		this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
	}
	_handleKeyDown(e) {
		let t = !1;
		switch (e.code) {
			case this.keys.UP:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(R * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = !0;
				break;
			case this.keys.BOTTOM:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-R * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = !0;
				break;
			case this.keys.LEFT:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(R * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = !0;
				break;
			case this.keys.RIGHT:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-R * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = !0;
				break;
		}
		t && (e.preventDefault(), this.update());
	}
	_handleTouchStartRotate(e) {
		if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateStart.set(n, r);
		}
	}
	_handleTouchStartPan(e) {
		if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panStart.set(n, r);
		}
	}
	_handleTouchStartDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyStart.set(0, i);
	}
	_handleTouchStartDollyPan(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
	}
	_handleTouchStartDollyRotate(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
	}
	_handleTouchMoveRotate(e) {
		if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateEnd.set(n, r);
		}
		this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(R * this._rotateDelta.x / t.clientHeight), this._rotateUp(R * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
	}
	_handleTouchMovePan(e) {
		if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panEnd.set(n, r);
		}
		this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
	}
	_handleTouchMoveDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyEnd.set(0, i), this._dollyDelta.set(0, (this._dollyEnd.y / this._dollyStart.y) ** +this.zoomSpeed), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
		let a = (e.pageX + t.x) * .5, o = (e.pageY + t.y) * .5;
		this._updateZoomParameters(a, o);
	}
	_handleTouchMoveDollyPan(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
	}
	_handleTouchMoveDollyRotate(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
	}
	_addPointer(e) {
		this._pointers.push(e.pointerId);
	}
	_removePointer(e) {
		delete this._pointerPositions[e.pointerId];
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) {
			this._pointers.splice(t, 1);
			return;
		}
	}
	_isTrackingPointer(e) {
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return !0;
		return !1;
	}
	_trackPointer(e) {
		let t = this._pointerPositions[e.pointerId];
		t === void 0 && (t = new N(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
	}
	_getSecondPointerPosition(e) {
		let t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
		return this._pointerPositions[t];
	}
	_customWheelEvent(e) {
		let t = e.deltaMode, n = {
			clientX: e.clientX,
			clientY: e.clientY,
			deltaY: e.deltaY
		};
		switch (t) {
			case 1:
				n.deltaY *= 16;
				break;
			case 2:
				n.deltaY *= 100;
				break;
		}
		return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
	}
};
function Qe(e) {
	this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(e.pointerId), this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(e) && (this._addPointer(e), e.pointerType === "touch" ? this._onTouchStart(e) : this._onMouseDown(e), this._cursorStyle === "grab" && (this.domElement.style.cursor = "grabbing")));
}
function $e(e) {
	this.enabled !== !1 && (e.pointerType === "touch" ? this._onTouchMove(e) : this._onMouseMove(e));
}
function et(e) {
	switch (this._removePointer(e), this._pointers.length) {
		case 0:
			this.domElement.releasePointerCapture(e.pointerId), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(Je), this.state = z.NONE, this._cursorStyle === "grab" && (this.domElement.style.cursor = "grab");
			break;
		case 1:
			let t = this._pointers[0], n = this._pointerPositions[t];
			this._onTouchStart({
				pointerId: t,
				pageX: n.x,
				pageY: n.y
			});
			break;
	}
}
function tt(e) {
	let t;
	switch (e.button) {
		case 0:
			t = this.mouseButtons.LEFT;
			break;
		case 1:
			t = this.mouseButtons.MIDDLE;
			break;
		case 2:
			t = this.mouseButtons.RIGHT;
			break;
		default: t = -1;
	}
	switch (t) {
		case x.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseDownDolly(e), this.state = z.DOLLY;
			break;
		case x.ROTATE:
			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(e), this.state = z.PAN;
			} else {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(e), this.state = z.ROTATE;
			}
			break;
		case x.PAN:
			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(e), this.state = z.ROTATE;
			} else {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(e), this.state = z.PAN;
			}
			break;
		default: this.state = z.NONE;
	}
	this.state !== z.NONE && this.dispatchEvent(F);
}
function nt(e) {
	switch (this.state) {
		case z.ROTATE:
			if (this.enableRotate === !1) return;
			this._handleMouseMoveRotate(e);
			break;
		case z.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseMoveDolly(e);
			break;
		case z.PAN:
			if (this.enablePan === !1) return;
			this._handleMouseMovePan(e);
			break;
	}
}
function rt(e) {
	this.enabled === !1 || this.enableZoom === !1 || this.state !== z.NONE || (e.preventDefault(), this.dispatchEvent(F), this._handleMouseWheel(this._customWheelEvent(e)), this.dispatchEvent(Je));
}
function it(e) {
	this.enabled !== !1 && this._handleKeyDown(e);
}
function at(e) {
	switch (this._trackPointer(e), this._pointers.length) {
		case 1:
			switch (this.touches.ONE) {
				case j.ROTATE:
					if (this.enableRotate === !1) return;
					this._handleTouchStartRotate(e), this.state = z.TOUCH_ROTATE;
					break;
				case j.PAN:
					if (this.enablePan === !1) return;
					this._handleTouchStartPan(e), this.state = z.TOUCH_PAN;
					break;
				default: this.state = z.NONE;
			}
			break;
		case 2:
			switch (this.touches.TWO) {
				case j.DOLLY_PAN:
					if (this.enableZoom === !1 && this.enablePan === !1) return;
					this._handleTouchStartDollyPan(e), this.state = z.TOUCH_DOLLY_PAN;
					break;
				case j.DOLLY_ROTATE:
					if (this.enableZoom === !1 && this.enableRotate === !1) return;
					this._handleTouchStartDollyRotate(e), this.state = z.TOUCH_DOLLY_ROTATE;
					break;
				default: this.state = z.NONE;
			}
			break;
		default: this.state = z.NONE;
	}
	this.state !== z.NONE && this.dispatchEvent(F);
}
function ot(e) {
	switch (this._trackPointer(e), this.state) {
		case z.TOUCH_ROTATE:
			if (this.enableRotate === !1) return;
			this._handleTouchMoveRotate(e), this.update();
			break;
		case z.TOUCH_PAN:
			if (this.enablePan === !1) return;
			this._handleTouchMovePan(e), this.update();
			break;
		case z.TOUCH_DOLLY_PAN:
			if (this.enableZoom === !1 && this.enablePan === !1) return;
			this._handleTouchMoveDollyPan(e), this.update();
			break;
		case z.TOUCH_DOLLY_ROTATE:
			if (this.enableZoom === !1 && this.enableRotate === !1) return;
			this._handleTouchMoveDollyRotate(e), this.update();
			break;
		default: this.state = z.NONE;
	}
}
function st(e) {
	this.enabled !== !1 && e.preventDefault();
}
function ct(e) {
	e.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
function lt(e) {
	e.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
//#endregion
//#region src/core/renderer.ts
function V(e) {
	let t = e.parentElement;
	return {
		width: t ? t.clientWidth : window.innerWidth,
		height: t ? t.clientHeight : window.innerHeight
	};
}
function ut() {
	return new Pe();
}
function dt(e) {
	let { width: t, height: n } = V(e), r = new Ee(75, t / n, .1, 1e4);
	return r.position.set(0, 1.6, 1), r;
}
function ft(t) {
	let { width: n, height: r } = V(t), i = new Ke({
		canvas: t,
		antialias: !0,
		alpha: !0
	});
	return i.setSize(n, r), i.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)), i.outputColorSpace = A, i.toneMapping = e, i.toneMappingExposure = 1, i;
}
function pt(e, t, n) {
	let { width: r, height: i } = V(n);
	e.aspect = r / i, e.updateProjectionMatrix(), t.setSize(r, i);
}
//#endregion
//#region src/core/controls.ts
function mt(e, t) {
	let n = new Ze(e, t.domElement);
	return n.enableDamping = !0, n.target.set(0, 1.4, 0), n.update(), n;
}
//#endregion
//#region node_modules/three/examples/jsm/environments/RoomEnvironment.js
var ht = class extends Pe {
	constructor() {
		super(), this.name = "RoomEnvironment", this.position.y = -3.5;
		let e = new o();
		e.deleteAttribute("uv");
		let t = new D({ side: r }), n = new D(), i = new Oe(16777215, 900, 28, 2);
		i.position.set(.418, 16.199, .3), this.add(i);
		let a = new w(e, t);
		a.position.set(-.757, 13.219, .717), a.scale.set(31.713, 28.305, 28.591), this.add(a);
		let s = new ne(e, n, 6), c = new Ce();
		c.position.set(-10.906, 2.009, 1.846), c.rotation.set(0, -.195, 0), c.scale.set(2.328, 7.905, 4.651), c.updateMatrix(), s.setMatrixAt(0, c.matrix), c.position.set(-5.607, -.754, -.758), c.rotation.set(0, .994, 0), c.scale.set(1.97, 1.534, 3.955), c.updateMatrix(), s.setMatrixAt(1, c.matrix), c.position.set(6.167, .857, 7.803), c.rotation.set(0, .561, 0), c.scale.set(3.927, 6.285, 3.687), c.updateMatrix(), s.setMatrixAt(2, c.matrix), c.position.set(-2.017, .018, 6.124), c.rotation.set(0, .333, 0), c.scale.set(2.002, 4.566, 2.064), c.updateMatrix(), s.setMatrixAt(3, c.matrix), c.position.set(2.291, -.756, -2.621), c.rotation.set(0, -.286, 0), c.scale.set(1.546, 1.552, 1.496), c.updateMatrix(), s.setMatrixAt(4, c.matrix), c.position.set(-2.193, -.369, -5.547), c.rotation.set(0, .516, 0), c.scale.set(3.875, 3.487, 2.986), c.updateMatrix(), s.setMatrixAt(5, c.matrix), this.add(s);
		let l = new w(e, H(50));
		l.position.set(-16.116, 14.37, 8.208), l.scale.set(.1, 2.428, 2.739), this.add(l);
		let u = new w(e, H(50));
		u.position.set(-16.109, 18.021, -8.207), u.scale.set(.1, 2.425, 2.751), this.add(u);
		let d = new w(e, H(17));
		d.position.set(14.904, 12.198, -1.832), d.scale.set(.15, 4.265, 6.331), this.add(d);
		let f = new w(e, H(43));
		f.position.set(-.462, 8.89, 14.52), f.scale.set(4.38, 5.441, .088), this.add(f);
		let p = new w(e, H(20));
		p.position.set(3.235, 11.486, -12.541), p.scale.set(2.5, 2, .1), this.add(p);
		let m = new w(e, H(100));
		m.position.set(0, 20, 0), m.scale.set(1, .1, 1), this.add(m);
	}
	dispose() {
		let e = /* @__PURE__ */ new Set();
		this.traverse((t) => {
			t.isMesh && (e.add(t.geometry), e.add(t.material));
		});
		for (let t of e) t.dispose();
	}
};
function H(e) {
	return new ge({
		color: 0,
		emissive: 16777215,
		emissiveIntensity: e
	});
}
//#endregion
//#region src/world/light.ts
function gt(e, t) {
	let n = new Te(t), r = new ht(), i = n.fromScene(r, .04).texture;
	return e.environment = i, {
		pmrem: n,
		envMap: i
	};
}
function _t(e, t) {
	e.environment &&= (e.environment.dispose(), null), t.pmrem.dispose();
}
//#endregion
//#region node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function vt(e, t) {
	if (t === We) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === M || t === Ue) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === M) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
		let a = e.clone();
		return a.setIndex(i), a.clearGroups(), a;
	} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
//#endregion
//#region node_modules/three/examples/jsm/utils/SkeletonUtils.js
function yt(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return bt(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function bt(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) bt(e.children[r], t.children[r], n);
}
//#endregion
//#region node_modules/three/examples/jsm/loaders/GLTFLoader.js
var xt = class extends me {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new Et(e);
		}), this.register(function(e) {
			return new Dt(e);
		}), this.register(function(e) {
			return new It(e);
		}), this.register(function(e) {
			return new Lt(e);
		}), this.register(function(e) {
			return new Rt(e);
		}), this.register(function(e) {
			return new kt(e);
		}), this.register(function(e) {
			return new At(e);
		}), this.register(function(e) {
			return new jt(e);
		}), this.register(function(e) {
			return new Mt(e);
		}), this.register(function(e) {
			return new Tt(e);
		}), this.register(function(e) {
			return new Nt(e);
		}), this.register(function(e) {
			return new Ot(e);
		}), this.register(function(e) {
			return new Ft(e);
		}), this.register(function(e) {
			return new Pt(e);
		}), this.register(function(e) {
			return new Ct(e);
		}), this.register(function(e) {
			return new zt(e, W.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new zt(e, W.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Bt(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = b.extractUrlBase(e);
			a = b.resolveURL(t, this.path);
		} else a = b.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new h(this.manager);
		s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
			try {
				i.parse(n, a, function(n) {
					t(n), i.manager.itemEnd(e);
				}, o);
			} catch (e) {
				o(e);
			}
		}, n, o);
	}
	setDRACOLoader(e) {
		return this.dracoLoader = e, this;
	}
	setKTX2Loader(e) {
		return this.ktx2Loader = e, this;
	}
	setMeshoptDecoder(e) {
		return this.meshoptDecoder = e, this;
	}
	register(e) {
		return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
	}
	unregister(e) {
		return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
	}
	parse(e, t, n, r) {
		let i, a = {}, o = {}, s = new TextDecoder();
		if (typeof e == "string") i = JSON.parse(e);
		else if (e instanceof ArrayBuffer) if (s.decode(new Uint8Array(e, 0, 4)) === Vt) {
			try {
				a[W.KHR_BINARY_GLTF] = new Ut(e);
			} catch (e) {
				r && r(e);
				return;
			}
			i = JSON.parse(a[W.KHR_BINARY_GLTF].content);
		} else i = JSON.parse(s.decode(e));
		else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new cn(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		c.fileLoader.setRequestHeader(this.requestHeader);
		for (let e = 0; e < this.pluginCallbacks.length; e++) {
			let t = this.pluginCallbacks[e](c);
			t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
		}
		if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
			let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
			switch (t) {
				case W.KHR_MATERIALS_UNLIT:
					a[t] = new wt();
					break;
				case W.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new Wt(i, this.dracoLoader);
					break;
				case W.KHR_TEXTURE_TRANSFORM:
					a[t] = new Gt();
					break;
				case W.KHR_MESH_QUANTIZATION:
					a[t] = new Kt();
					break;
				default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
			}
		}
		c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
	}
	parseAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.parse(e, t, r, i);
		});
	}
};
function St() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function U(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var W = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, Ct = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_LIGHTS_PUNCTUAL, this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		let e = this.parser, t = this.parser.json.nodes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
		}
	}
	_loadLight(e) {
		let t = this.parser, n = "light:" + e, r = t.cache.get(n);
		if (r) return r;
		let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new u(16777215);
		a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], y);
		let c = a.range === void 0 ? 0 : a.range;
		switch (a.type) {
			case "directional":
				o = new p(s), o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			case "point":
				o = new Oe(s), o.distance = c;
				break;
			case "spot":
				o = new ze(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
		}
		return o.position.set(0, 0, 0), $(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
	}
	getDependency(e, t) {
		if (e === "light") return this._loadLight(t);
	}
	createNodeAttachment(e) {
		let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
		return i === void 0 ? null : this._loadLight(i).then(function(e) {
			return n._getNodeRef(t.cache, i, e);
		});
	}
}, wt = class {
	constructor() {
		this.name = W.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return T;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new u(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], y), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, A));
		}
		return Promise.all(r);
	}
}, Tt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, Et = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new N(e, e);
		}
		return Promise.all(r);
	}
}, Dt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, Ot = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, kt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new u(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], y);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, A)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, At = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, jt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new u().setRGB(i[0], i[1], i[2], y), Promise.all(r);
	}
}, Mt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		return n === null ? Promise.resolve() : (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3), Promise.resolve());
	}
}, Nt = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new u().setRGB(i[0], i[1], i[2], y), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, A)), Promise.all(r);
	}
}, Pt = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, Ft = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return U(this.parser, e, this.name) === null ? null : E;
	}
	extendMaterialParams(e, t) {
		let n = U(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, It = class {
	constructor(e) {
		this.parser = e, this.name = W.KHR_TEXTURE_BASISU;
	}
	loadTexture(e) {
		let t = this.parser, n = t.json, r = n.textures[e];
		if (!r.extensions || !r.extensions[this.name]) return null;
		let i = r.extensions[this.name], a = t.options.ktx2Loader;
		if (!a) {
			if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			return null;
		}
		return t.loadTextureImage(e, i.source, a);
	}
}, Lt = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_TEXTURE_WEBP;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, Rt = class {
	constructor(e) {
		this.parser = e, this.name = W.EXT_TEXTURE_AVIF;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, zt = class {
	constructor(e, t) {
		this.name = t, this.parser = e;
	}
	loadBufferView(e) {
		let t = this.parser.json, n = t.bufferViews[e];
		if (n.extensions && n.extensions[this.name]) {
			let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
			if (!i || !i.supported) {
				if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				return null;
			}
			return r.then(function(t) {
				let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
				return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
					return e.buffer;
				}) : i.ready.then(function() {
					let t = new ArrayBuffer(a * o);
					return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
				});
			});
		} else return null;
	}
}, Bt = class {
	constructor(e) {
		this.name = W.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== K.TRIANGLES && e.mode !== K.TRIANGLE_STRIP && e.mode !== K.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new C(), n = new P(), a = new O(), s = new P(1, 1, 1), c = new ne(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				for (let t in o) if (t === "_COLOR_0") {
					let e = o[t];
					c.instanceColor = new te(e.array, e.itemSize, e.normalized);
				} else t !== "TRANSLATION" && t !== "ROTATION" && t !== "SCALE" && e.geometry.setAttribute(t, o[t]);
				Ce.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, Vt = "glTF", G = 12, Ht = {
	JSON: 1313821514,
	BIN: 5130562
}, Ut = class {
	constructor(e) {
		this.name = W.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, G), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== Vt) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - G, i = new DataView(e, G), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === Ht.JSON) {
				let r = new Uint8Array(e, G + a, t);
				this.content = n.decode(r);
			} else if (r === Ht.BIN) {
				let n = G + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, Wt = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = W.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Y[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Y[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = q[i.componentType].name, s[r] = i.normalized === !0;
			}
		}
		return t.getDependency("bufferView", i).then(function(e) {
			return new Promise(function(t, n) {
				r.decodeDracoFile(e, function(e) {
					for (let t in e.attributes) {
						let n = e.attributes[t], r = s[t];
						r !== void 0 && (n.normalized = r);
					}
					t(e);
				}, o, c, y, n);
			});
		});
	}
}, Gt = class {
	constructor() {
		this.name = W.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 ? e : (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0, e);
	}
}, Kt = class {
	constructor() {
		this.name = W.KHR_MESH_QUANTIZATION;
	}
}, qt = class extends ae {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
		for (let e = 0; e !== r; e++) t[e] = n[i + e];
		return t;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, ee = g - d + u;
		for (let e = 0; e !== o; e++) {
			let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
			i[e] = _ * t + ee * n + h * r + g * c;
		}
		return i;
	}
}, Jt = new O(), Yt = class extends qt {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return Jt.fromArray(i).normalize().toArray(i), i;
	}
}, K = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
}, q = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, Xt = {
	9728: ye,
	9729: v,
	9984: xe,
	9985: pe,
	9986: be,
	9987: fe
}, Zt = {
	33071: l,
	33648: ve,
	10497: k
}, J = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Y = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
}, X = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Qt = {
	CUBICSPLINE: void 0,
	LINEAR: se,
	STEP: oe
}, Z = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function $t(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new D({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: g
	})), e.DefaultMaterial;
}
function Q(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function $(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function en(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function tn(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function nn(e) {
	let t, n = e.extensions && e.extensions[W.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + rn(n.attributes) : e.indices + ":" + rn(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + rn(e.targets[n]);
	return t;
}
function rn(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function an(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function on(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var sn = new C(), cn = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new St(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
			refs: {},
			uses: {}
		}, this.cameraCache = {
			refs: {},
			uses: {}
		}, this.lightCache = {
			refs: {},
			uses: {}
		}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
		let n = !1, r = -1, i = !1, a = -1;
		if (typeof navigator < "u" && navigator.userAgent !== void 0) {
			let e = navigator.userAgent;
			n = /^((?!chrome|android).)*safari/i.test(e) === !0;
			let t = e.match(/Version\/(\d+)/);
			r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? this.textureLoader = new Ve(this.options.manager) : this.textureLoader = new ee(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new h(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
	}
	setExtensions(e) {
		this.extensions = e;
	}
	setPlugins(e) {
		this.plugins = e;
	}
	parse(e, t) {
		let n = this, r = this.json, i = this.extensions;
		this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
			return e._markDefs && e._markDefs();
		}), Promise.all(this._invokeAll(function(e) {
			return e.beforeRoot && e.beforeRoot();
		})).then(function() {
			return Promise.all([
				n.getDependencies("scene"),
				n.getDependencies("animation"),
				n.getDependencies("camera")
			]);
		}).then(function(t) {
			let a = {
				scene: t[0][r.scene || 0],
				scenes: t[0],
				animations: t[1],
				cameras: t[2],
				asset: r.asset,
				parser: n,
				userData: {}
			};
			return Q(i, a, r), $(a, r), Promise.all(n._invokeAll(function(e) {
				return e.afterRoot && e.afterRoot(a);
			})).then(function() {
				for (let e of a.scenes) e.updateMatrixWorld();
				e(a);
			});
		}).catch(t);
	}
	_markDefs() {
		let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n].joints;
			for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
		}
		for (let t = 0, r = e.length; t < r; t++) {
			let r = e[t];
			r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
		}
	}
	_addNodeRef(e, t) {
		t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
	}
	_getNodeRef(e, t, n) {
		if (e.refs[t] <= 1) return n;
		let r = n.clone(), i = (e, t) => {
			let n = this.associations.get(e);
			n != null && this.associations.set(t, n);
			for (let [n, r] of e.children.entries()) i(r, t.children[n]);
		};
		return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
	}
	_invokeOne(e) {
		let t = Object.values(this.plugins);
		t.push(this);
		for (let n = 0; n < t.length; n++) {
			let r = e(t[n]);
			if (r) return r;
		}
		return null;
	}
	_invokeAll(e) {
		let t = Object.values(this.plugins);
		t.unshift(this);
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = e(t[r]);
			i && n.push(i);
		}
		return n;
	}
	getDependency(e, t) {
		let n = e + ":" + t, r = this.cache.get(n);
		if (!r) {
			switch (e) {
				case "scene":
					r = this.loadScene(t);
					break;
				case "node":
					r = this._invokeOne(function(e) {
						return e.loadNode && e.loadNode(t);
					});
					break;
				case "mesh":
					r = this._invokeOne(function(e) {
						return e.loadMesh && e.loadMesh(t);
					});
					break;
				case "accessor":
					r = this.loadAccessor(t);
					break;
				case "bufferView":
					r = this._invokeOne(function(e) {
						return e.loadBufferView && e.loadBufferView(t);
					});
					break;
				case "buffer":
					r = this.loadBuffer(t);
					break;
				case "material":
					r = this._invokeOne(function(e) {
						return e.loadMaterial && e.loadMaterial(t);
					});
					break;
				case "texture":
					r = this._invokeOne(function(e) {
						return e.loadTexture && e.loadTexture(t);
					});
					break;
				case "skin":
					r = this.loadSkin(t);
					break;
				case "animation":
					r = this._invokeOne(function(e) {
						return e.loadAnimation && e.loadAnimation(t);
					});
					break;
				case "camera":
					r = this.loadCamera(t);
					break;
				default:
					if (r = this._invokeOne(function(n) {
						return n != this && n.getDependency && n.getDependency(e, t);
					}), !r) throw Error("Unknown type: " + e);
					break;
			}
			this.cache.add(n, r);
		}
		return r;
	}
	getDependencies(e) {
		let t = this.cache.get(e);
		if (!t) {
			let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
			t = Promise.all(r.map(function(t, r) {
				return n.getDependency(e, r);
			})), this.cache.add(e, t);
		}
		return t;
	}
	loadBuffer(e) {
		let t = this.json.buffers[e], n = this.fileLoader;
		if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[W.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(b.resolveURL(t.uri, r.path), e, void 0, function() {
				i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
			});
		});
	}
	loadBufferView(e) {
		let t = this.json.bufferViews[e];
		return this.getDependency("buffer", t.buffer).then(function(e) {
			let n = t.byteLength || 0, r = t.byteOffset || 0;
			return e.slice(r, r + n);
		});
	}
	loadAccessor(e) {
		let t = this, n = this.json, r = this.json.accessors[e];
		if (r.bufferView === void 0 && r.sparse === void 0) {
			let e = J[r.type], t = q[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new s(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = J[r.type], o = q[r.componentType], c = o.BYTES_PER_ELEMENT, l = c * a, u = r.byteOffset || 0, d = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, f = r.normalized === !0, p, m;
			if (d && d !== l) {
				let e = Math.floor(u / d), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, s = t.cache.get(n);
				s || (p = new o(i, e * d, r.count * d / c), s = new re(p, d / c), t.cache.add(n, s)), m = new ie(s, a, u % d / c, f);
			} else p = i === null ? new o(r.count * a) : new o(i, u, r.count * a), m = new s(p, a, f);
			if (r.sparse !== void 0) {
				let t = J.SCALAR, n = q[r.sparse.indices.componentType], c = r.sparse.indices.byteOffset || 0, l = r.sparse.values.byteOffset || 0, u = new n(e[1], c, r.sparse.count * t), d = new o(e[2], l, r.sparse.count * a);
				i !== null && (m = new s(m.array.slice(), m.itemSize, m.normalized)), m.normalized = !1;
				for (let e = 0, t = u.length; e < t; e++) {
					let t = u[e];
					if (m.setX(t, d[e * a]), a >= 2 && m.setY(t, d[e * a + 1]), a >= 3 && m.setZ(t, d[e * a + 2]), a >= 4 && m.setW(t, d[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				m.normalized = f;
			}
			return m;
		});
	}
	loadTexture(e) {
		let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
		if (i.uri) {
			let e = n.manager.getHandler(i.uri);
			e !== null && (a = e);
		}
		return this.loadTextureImage(e, r, a);
	}
	loadTextureImage(e, t, n) {
		let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
		if (this.textureCache[s]) return this.textureCache[s];
		let c = this.loadImageSource(t, n).then(function(t) {
			t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
			let n = (i.samplers || {})[a.sampler] || {};
			return t.magFilter = Xt[n.magFilter] || v, t.minFilter = Xt[n.minFilter] || fe, t.wrapS = Zt[n.wrapS] || k, t.wrapT = Zt[n.wrapT] || k, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== ye && t.minFilter !== v, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
		if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
			c = !0;
			let t = new Blob([e], { type: a.mimeType });
			return s = o.createObjectURL(t), s;
		});
		else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let l = Promise.resolve(s).then(function(e) {
			return new Promise(function(n, r) {
				let a = n;
				t.isImageBitmapLoader === !0 && (a = function(e) {
					let t = new Be(e);
					t.needsUpdate = !0, n(t);
				}), t.load(b.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), $(e, a), e.userData.mimeType = a.mimeType || on(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[W.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[W.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[W.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new Ae(), S.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new le(), S.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
		}
		if (r || i || a) {
			let e = "ClonedMaterial:" + n.uuid + ":";
			r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
			let t = this.cache.get(e);
			t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
		}
		e.material = n;
	}
	getMaterialType() {
		return D;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[W.KHR_MATERIALS_UNLIT]) {
			let e = r[W.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new u(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], y), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, A)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = m);
		let l = i.alphaMode || Z.OPAQUE;
		if (l === Z.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Z.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== T && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new N(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== T && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== T) {
			let e = i.emissiveFactor;
			o.emissive = new u().setRGB(e[0], e[1], e[2], y);
		}
		return i.emissiveTexture !== void 0 && a !== T && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, A)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), $(n, i), t.associations.set(n, { materials: e }), i.extensions && Q(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = je.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[W.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return un(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = nn(o), l = r[s];
			if (l) a.push(l.promise);
			else {
				let e;
				e = o.extensions && o.extensions[W.KHR_DRACO_MESH_COMPRESSION] ? i(o) : un(new c(), o, t), r[s] = {
					primitive: o,
					promise: e
				}, a.push(e);
			}
		}
		return Promise.all(a);
	}
	loadMesh(e) {
		let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e].material === void 0 ? $t(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === K.TRIANGLES || u.mode === K.TRIANGLE_STRIP || u.mode === K.TRIANGLE_FAN || u.mode === void 0) d = i.isSkinnedMesh === !0 ? new Ie(l, f) : new w(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights(), u.mode === K.TRIANGLE_STRIP ? d.geometry = vt(d.geometry, Ue) : u.mode === K.TRIANGLE_FAN && (d.geometry = vt(d.geometry, M));
				else if (u.mode === K.LINES) d = new de(l, f);
				else if (u.mode === K.LINE_STRIP) d = new ce(l, f);
				else if (u.mode === K.LINE_LOOP) d = new ue(l, f);
				else if (u.mode === K.POINTS) d = new ke(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && tn(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), $(d, i), u.extensions && Q(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && Q(r, c[0], i), c[0];
			let l = new _();
			i.extensions && Q(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) {
			console.warn("THREE.GLTFLoader: Missing camera parameters.");
			return;
		}
		return n.type === "perspective" ? t = new Ee(he.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new we(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), $(t, n), Promise.resolve(t);
	}
	loadSkin(e) {
		let t = this.json.skins[e], n = [];
		for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
		return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
			let n = e.pop(), r = e, i = [], a = [];
			for (let e = 0, o = r.length; e < o; e++) {
				let o = r[e];
				if (o) {
					i.push(o);
					let t = new C();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new Fe(i, a);
		});
	}
	loadAnimation(e) {
		let n = this.json, r = this, i = n.animations[e], a = i.name ? i.name : "animation_" + e, o = [], s = [], c = [], l = [], u = [];
		for (let e = 0, t = i.channels.length; e < t; e++) {
			let t = i.channels[e], n = i.samplers[t.sampler], r = t.target, a = r.node, d = i.parameters === void 0 ? n.input : i.parameters[n.input], f = i.parameters === void 0 ? n.output : i.parameters[n.output];
			r.node !== void 0 && (o.push(this.getDependency("node", a)), s.push(this.getDependency("accessor", d)), c.push(this.getDependency("accessor", f)), l.push(n), u.push(r));
		}
		return Promise.all([
			Promise.all(o),
			Promise.all(s),
			Promise.all(c),
			Promise.all(l),
			Promise.all(u)
		]).then(function(e) {
			let n = e[0], o = e[1], s = e[2], c = e[3], l = e[4], u = [];
			for (let e = 0, t = n.length; e < t; e++) {
				let t = n[e], i = o[e], a = s[e], d = c[e], f = l[e];
				if (t === void 0) continue;
				t.updateMatrix && t.updateMatrix();
				let p = r._createAnimationTracks(t, i, a, d, f);
				if (p) for (let e = 0; e < p.length; e++) u.push(p[e]);
			}
			let d = new t(a, void 0, u);
			return $(d, i), d;
		});
	}
	createNodeMesh(e) {
		let t = this.json, n = this, r = t.nodes[e];
		return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
			let t = n._getNodeRef(n.meshCache, r.mesh, e);
			return r.weights !== void 0 && t.traverse(function(e) {
				if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
			}), t;
		});
	}
	loadNode(e) {
		let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
		for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
		let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
		return Promise.all([
			i,
			Promise.all(a),
			s
		]).then(function(e) {
			let t = e[0], n = e[1], r = e[2];
			r !== null && t.traverse(function(e) {
				e.isSkinnedMesh && e.bind(r, sn);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new P().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let a = t.nodes[e], o = a.name ? r.createUniqueName(a.name) : "", s = [], c = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return c && s.push(c), a.camera !== void 0 && s.push(r.getDependency("camera", a.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, a.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			s.push(e);
		}), this.nodeCache[e] = Promise.all(s).then(function(t) {
			let s;
			if (s = a.isBone === !0 ? new i() : t.length > 1 ? new _() : t.length === 1 ? t[0] : new Ce(), s !== t[0]) for (let e = 0, n = t.length; e < n; e++) s.add(t[e]);
			if (a.name && (s.userData.name = a.name, s.name = o), $(s, a), a.extensions && Q(n, s, a), a.matrix !== void 0) {
				let e = new C();
				e.fromArray(a.matrix), s.applyMatrix4(e);
			} else a.translation !== void 0 && s.position.fromArray(a.translation), a.rotation !== void 0 && s.quaternion.fromArray(a.rotation), a.scale !== void 0 && s.scale.fromArray(a.scale);
			if (!r.associations.has(s)) r.associations.set(s, {});
			else if (a.mesh !== void 0 && r.meshCache.refs[a.mesh] > 1) {
				let e = r.associations.get(s);
				r.associations.set(s, { ...e });
			}
			return r.associations.get(s).nodes = e, s;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new _();
		n.name && (i.name = r.createUniqueName(n.name)), $(i, n), n.extensions && Q(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(yt(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof S || e instanceof Be) && t.set(e, n);
				return e.traverse((e) => {
					let n = r.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(i), i;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		X[i.path] === X.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (X[i.path]) {
			case X.weights:
				l = Se;
				break;
			case X.rotation:
				l = Me;
				break;
			case X.translation:
			case X.scale:
				l = Ge;
				break;
			default:
				switch (n.itemSize) {
					case 1:
						l = Se;
						break;
					default:
						l = Ge;
						break;
				}
				break;
		}
		let u = r.interpolation === void 0 ? se : Qt[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + X[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = an(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof Me ? Yt : qt)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function ln(e, t, n) {
	let r = t.attributes, i = new a();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new P(t[0], t[1], t[2]), new P(a[0], a[1], a[2])), e.normalized) {
				let t = an(q[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let o = t.targets;
	if (o !== void 0) {
		let e = new P(), t = new P();
		for (let r = 0, i = o.length; r < i; r++) {
			let i = o[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = an(q[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let s = new Le();
	i.getCenter(s.center), s.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = s;
}
function un(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Y[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return d.workingColorSpace !== y && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${d.workingColorSpace}" not supported.`), $(e, t), ln(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : en(e, t.targets, n);
	});
}
//#endregion
//#region src/characters/materials.ts
function dn(e) {
	if (!(e instanceof w)) return;
	let t = (e) => {
		let t = (e.name || "").toLowerCase();
		(t.includes("hair") || t.includes("eyelash")) && (e instanceof D || e instanceof E || e instanceof _e) && (e.transparent = !1, e.alphaTest = .15, e.side = m, e.depthWrite = !0);
	};
	Array.isArray(e.material) ? e.material.forEach(t) : e.material && t(e.material);
}
//#endregion
//#region src/characters/loader.ts
var fn = new xt();
function pn(e, t) {
	return new Promise((r, i) => {
		fn.load(e, (e) => {
			let i = e.scene;
			e.animations.forEach((e) => {
				e.tracks = e.tracks.filter((e) => !e.name.includes("morphTargetInfluences"));
			});
			let a = null, o = 0, s = !1;
			i.traverse((e) => {
				if (!(e instanceof w) || (dn(e), s || !e.morphTargetInfluences)) return;
				let t = e.name.toLowerCase();
				if (t.includes("eye") || t.includes("tear") || t.includes("occlusion")) return;
				let n = Object.keys(e.morphTargetDictionary ?? {}).length;
				if (t.includes("body") || t.includes("head")) {
					a = e, s = !0;
					return;
				}
				n > o && (a = e, o = n);
			});
			let c = null;
			if (a) {
				let e = a;
				c = {
					mesh: e,
					influences: e.morphTargetInfluences,
					dictionary: e.morphTargetDictionary ?? {}
				};
			}
			let l = new n(i), u = {}, d = e.animations;
			d.length > 0 ? (console.log(`Total animations found: ${d.length}`), d.forEach((e) => {
				let t = l.clipAction(e);
				t.setEffectiveWeight(1), t.enabled = !0, u[e.name] = t;
			})) : console.warn("No animations found in the provided clips."), t.add(i), r({
				object: i,
				mixer: l,
				actions: u,
				morphTargets: c
			});
		}, (e) => {
			e.total && console.log((e.loaded / e.total * 100).toFixed(2) + "% loaded");
		}, (e) => {
			console.error("GLB load error:", e), i(e);
		});
	});
}
function mn(e) {
	Object.values(e).forEach((e) => {
		if (typeof e == "object" && e && "isTexture" in e && e.isTexture) {
			let t = e;
			typeof t.dispose == "function" && t.dispose();
		}
	}), e.dispose();
}
function hn(e) {
	e instanceof w && (e.geometry?.dispose(), Array.isArray(e.material) ? e.material.forEach(mn) : e.material && mn(e.material));
}
function gn(e, t, n) {
	t && (t.stopAllAction(), n && Object.values(n).forEach((n) => {
		t.uncacheAction(n.getClip(), e);
	}), t.uncacheRoot(e)), e.traverse(hn), e.parent?.remove(e);
}
//#endregion
//#region src/characters/animationController.ts
function _n({ actions: e, mixer: t, lipSync: n, audioLipSync: r }) {
	let i = null, a = !1;
	function o(t, n = i) {
		a || (n && e[n] && e[n].fadeOut(.25), t && e[t] && e[t].reset().fadeIn(.25).play(), i = t);
	}
	function s(e) {
		a || e === i || o(e);
	}
	function c() {
		a || (t && t.stopAllAction(), n && n.stop(), r && r.stop(), i = null);
	}
	function l(e) {
		a || t && (t.timeScale = e);
	}
	function u() {
		return i;
	}
	function d() {
		a || (a = !0, c(), i = null);
	}
	let f = Object.keys(e);
	return f.length > 0 && o(f.includes("Idle") ? "Idle" : f[0], null), {
		switchAction: s,
		stopAll: c,
		setTimeScale: l,
		getCurrentAction: u,
		dispose: d
	};
}
//#endregion
//#region src/library/lipsyncEN.ts
var vn = {
	sil: {},
	PP: {
		Mouth_Press_L: .35,
		Mouth_Press_R: .35,
		Mouth_Close: .25,
		Jaw_Open: .08,
		Mouth_Down_Lower_L: .02,
		Mouth_Down_Lower_R: .02
	},
	FF: {
		Mouth_Shrug_Upper: .35,
		Mouth_Up_Upper_L: .2,
		Mouth_Up_Upper_R: .2,
		Mouth_Funnel_Up_L: .15,
		Mouth_Funnel_Up_R: .15,
		Jaw_Open: .12,
		Mouth_Down_Lower_L: .08,
		Mouth_Down_Lower_R: .08
	},
	TH: {
		Mouth_Shrug_Upper: .25,
		Mouth_Up_Upper_L: .12,
		Mouth_Up_Upper_R: .12,
		Jaw_Open: .22,
		Mouth_Down_Lower_L: .1,
		Mouth_Down_Lower_R: .1,
		Mouth_Shrug_Lower: .08
	},
	DD: {
		Jaw_Open: .3,
		Mouth_Shrug_Upper: .18,
		Mouth_Shrug_Lower: .12,
		Mouth_Down_Lower_L: .14,
		Mouth_Down_Lower_R: .14,
		Mouth_Up_Upper_L: .08,
		Mouth_Up_Upper_R: .08
	},
	kk: {
		Jaw_Open: .38,
		Mouth_Shrug_Upper: .22,
		Mouth_Shrug_Lower: .18,
		Mouth_Down_Lower_L: .18,
		Mouth_Down_Lower_R: .18,
		Mouth_Up_Upper_L: .1,
		Mouth_Up_Upper_R: .1
	},
	CH: {
		Mouth_Pucker_Up_L: .3,
		Mouth_Pucker_Up_R: .3,
		Mouth_Pucker_Down_L: .28,
		Mouth_Pucker_Down_R: .28,
		Mouth_Funnel_Up_L: .18,
		Mouth_Funnel_Up_R: .18,
		Mouth_Funnel_Down_L: .18,
		Mouth_Funnel_Down_R: .18,
		Jaw_Open: .22,
		Mouth_Down_Lower_L: .1,
		Mouth_Down_Lower_R: .1
	},
	SS: {
		Mouth_Smile_L: .25,
		Mouth_Smile_R: .25,
		Mouth_Stretch_L: .2,
		Mouth_Stretch_R: .2,
		Jaw_Open: .15,
		Mouth_Down_Lower_L: .08,
		Mouth_Down_Lower_R: .08,
		Mouth_Close: .08
	},
	nn: {
		Mouth_Close: .25,
		Jaw_Open: .08,
		Mouth_Down_Lower_L: .04,
		Mouth_Down_Lower_R: .04,
		Mouth_Shrug_Lower: .06
	},
	RR: {
		Mouth_Pucker_Up_L: .3,
		Mouth_Pucker_Up_R: .3,
		Mouth_Pucker_Down_L: .28,
		Mouth_Pucker_Down_R: .28,
		Jaw_Open: .22,
		Mouth_Down_Lower_L: .12,
		Mouth_Down_Lower_R: .12,
		Mouth_Shrug_Lower: .08
	},
	aa: {
		Jaw_Open: .65,
		Mouth_Shrug_Upper: .3,
		Mouth_Shrug_Lower: .25,
		Mouth_Down_Lower_L: .32,
		Mouth_Down_Lower_R: .32,
		Mouth_Up_Upper_L: .18,
		Mouth_Up_Upper_R: .18,
		Mouth_Funnel_Up_L: .12,
		Mouth_Funnel_Up_R: .12,
		Mouth_Funnel_Down_L: .12,
		Mouth_Funnel_Down_R: .12
	},
	E: {
		Jaw_Open: .42,
		Mouth_Smile_L: .35,
		Mouth_Smile_R: .35,
		Mouth_Stretch_L: .18,
		Mouth_Stretch_R: .18,
		Mouth_Shrug_Upper: .22,
		Mouth_Shrug_Lower: .18,
		Mouth_Down_Lower_L: .2,
		Mouth_Down_Lower_R: .2,
		Mouth_Up_Upper_L: .12,
		Mouth_Up_Upper_R: .12
	},
	ih: {
		Jaw_Open: .3,
		Mouth_Smile_L: .18,
		Mouth_Smile_R: .18,
		Mouth_Shrug_Upper: .12,
		Mouth_Shrug_Lower: .1,
		Mouth_Down_Lower_L: .12,
		Mouth_Down_Lower_R: .12,
		Mouth_Up_Upper_L: .06,
		Mouth_Up_Upper_R: .06
	},
	oh: {
		Jaw_Open: .5,
		Mouth_Pucker_Up_L: .25,
		Mouth_Pucker_Up_R: .25,
		Mouth_Pucker_Down_L: .22,
		Mouth_Pucker_Down_R: .22,
		Mouth_Funnel_Up_L: .3,
		Mouth_Funnel_Up_R: .3,
		Mouth_Funnel_Down_L: .3,
		Mouth_Funnel_Down_R: .3,
		Mouth_Shrug_Upper: .18,
		Mouth_Shrug_Lower: .15,
		Mouth_Down_Lower_L: .22,
		Mouth_Down_Lower_R: .22
	},
	ou: {
		Jaw_Open: .28,
		Mouth_Pucker_Up_L: .45,
		Mouth_Pucker_Up_R: .45,
		Mouth_Pucker_Down_L: .42,
		Mouth_Pucker_Down_R: .42,
		Mouth_Funnel_Up_L: .18,
		Mouth_Funnel_Up_R: .18,
		Mouth_Funnel_Down_L: .18,
		Mouth_Funnel_Down_R: .18,
		Mouth_Down_Lower_L: .12,
		Mouth_Down_Lower_R: .12
	},
	uu: {
		Jaw_Open: .2,
		Mouth_Pucker_Up_L: .4,
		Mouth_Pucker_Up_R: .4,
		Mouth_Pucker_Down_L: .38,
		Mouth_Pucker_Down_R: .38,
		Mouth_Funnel_Up_L: .12,
		Mouth_Funnel_Up_R: .12,
		Mouth_Funnel_Down_L: .12,
		Mouth_Funnel_Down_R: .12,
		Mouth_Down_Lower_L: .08,
		Mouth_Down_Lower_R: .08
	}
}, yn = {
	sh: "CH",
	ch: "CH",
	th: "TH",
	ph: "FF",
	wh: "ou",
	ng: "nn",
	gh: "sil",
	ck: "kk",
	qu: "kk"
}, bn = {
	p: "PP",
	b: "PP",
	m: "PP",
	f: "FF",
	v: "FF",
	t: "DD",
	d: "DD",
	n: "DD",
	l: "DD",
	k: "kk",
	g: "kk",
	c: "kk",
	q: "kk",
	x: "kk",
	s: "SS",
	z: "SS",
	r: "RR",
	w: "ou",
	y: "ih",
	h: "sil",
	j: "CH",
	a: "aa",
	e: "E",
	i: "ih",
	o: "oh",
	u: "uu",
	" ": "sil",
	",": "sil",
	".": "sil",
	"!": "sil",
	"?": "sil",
	"-": "sil"
}, xn = {
	".": 388,
	"!": 380,
	"?": 380,
	",": 180,
	";": 220,
	":": 180,
	"-": 120
};
function Sn(e, t = 130) {
	let n = 60 / t / 5 * 1e3, r = e.toLowerCase(), i = [], a = 0, o = 0;
	for (; o < r.length;) {
		let e = r.slice(o, o + 2), t, s, c;
		if (yn[e]) t = yn[e], s = 2, c = n * s;
		else {
			let e = r[o];
			s = 1, e in xn ? (t = "sil", c = xn[e]) : e === " " ? (t = "sil", c = Math.min(n, 60)) : (t = bn[e] ?? "sil", c = n);
		}
		t !== "sil" && [
			"aa",
			"E",
			"oh",
			"ou"
		].includes(t) && (c *= 1.3);
		let l = i[i.length - 1];
		l && l.viseme === t && t !== "sil" ? l.duration += c : l && l.viseme === "sil" && t === "sil" ? l.duration = Math.max(l.duration, c) : i.push({
			time: a,
			viseme: t,
			duration: c
		}), a += c, o += s;
	}
	return i;
}
var Cn = class {
	mesh;
	influences;
	dictionary;
	blendSpeed;
	restBlendSpeed;
	idleBreath;
	globalScale;
	_active = !1;
	_events = [];
	_startTime = 0;
	_currentTargets = {};
	_breathPhase = 0;
	_eventIndex = 0;
	_available;
	_allDrivenMorphs;
	_rest = {};
	constructor(e, t = {}) {
		if (!e) throw Error("[LipSync] morphTargets is required.");
		this.mesh = e.mesh, this.influences = e.influences, this.dictionary = e.dictionary, this.blendSpeed = t.blendSpeed ?? 15, this.restBlendSpeed = t.restBlendSpeed ?? 12, this.idleBreath = t.idleBreath ?? !0, this.globalScale = t.globalScale ?? 1, this._available = new Set(Object.keys(this.dictionary)), this._allDrivenMorphs = /* @__PURE__ */ new Set(), Object.values(vn).forEach((e) => {
			Object.keys(e).forEach((e) => this._allDrivenMorphs.add(e));
		}), this._allDrivenMorphs.forEach((e) => {
			this._rest[e] = 0;
		});
	}
	play(e) {
		this._events = e.slice().sort((e, t) => e.time - t.time), this._startTime = performance.now(), this._eventIndex = 0, this._active = !0;
	}
	speakText(e, t = 130) {
		this.play(Sn(e, t));
	}
	startAt(e, t, n = null, r = 130) {
		let i = Sn(t, r);
		if (n !== null && n > 0) {
			let e = i.reduce((e, t) => Math.max(e, t.time + t.duration), 0);
			if (e > 0) {
				let t = n / e;
				i = i.map((e) => ({
					viseme: e.viseme,
					time: e.time * t,
					duration: e.duration * t
				}));
			}
		}
		this._events = i.slice().sort((e, t) => e.time - t.time), this._startTime = e, this._eventIndex = 0, this._active = !0;
	}
	stop() {
		this._active = !1, this._events = [], this._eventIndex = 0, this._currentTargets = { ...this._rest };
	}
	get isPlaying() {
		return this._active;
	}
	get totalDuration() {
		if (!this._events.length) return 0;
		let e = this._events[this._events.length - 1];
		return e.time + e.duration;
	}
	update(e) {
		let t = performance.now() - this._startTime;
		if (this._active) {
			let e = this._getCurrentEvent(t);
			if (e) this._currentTargets = e.viseme === "sil" ? { ...this._rest } : this._buildTargets(e.viseme);
			else if (t > this.totalDuration) this._active = !1, this._currentTargets = { ...this._rest };
			else {
				let e = this._getNextEvent(t);
				(e ? e.time - t : Infinity) > 80 && (this._currentTargets = { ...this._rest });
			}
		} else this._currentTargets = { ...this._rest };
		this._applyMorphs(e), this.idleBreath && !this._active && this._applyIdleBreath(e);
	}
	_getCurrentEvent(e) {
		let t = this._events;
		if (!t.length) return null;
		for (this._eventIndex > 0 && e < t[this._eventIndex].time && this._eventIndex--; this._eventIndex < t.length - 1 && e >= t[this._eventIndex].time + t[this._eventIndex].duration;) this._eventIndex++;
		let n = t[this._eventIndex];
		return e >= n.time && e < n.time + n.duration ? n : null;
	}
	_getNextEvent(e) {
		let t = this._events[this._eventIndex + 1];
		return t && t.time > e ? t : null;
	}
	_buildTargets(e) {
		let t = vn[e] ?? {}, n = { ...this._rest };
		return Object.entries(t).forEach(([e, t]) => {
			this._available.has(e) && (n[e] = Math.min(1, t * this.globalScale));
		}), n;
	}
	_applyMorphs(e) {
		let t = this.dictionary;
		Object.entries(this._currentTargets).forEach(([n, r]) => {
			let i = t[n];
			if (i === void 0) return;
			let a = this.influences[i], o = r < .01 ? this.restBlendSpeed : this.blendSpeed, s = Math.min(e, .033), c = a + (r - a) * (1 - Math.exp(-o * s));
			Math.abs(r - c) < .001 && (c = r), this.influences[i] = Math.max(0, Math.min(1, c));
		});
	}
	_applyIdleBreath(e) {
		this._breathPhase += e * .75;
		let t = Math.max(0, Math.sin(this._breathPhase) * .012), n = (e, n) => {
			let r = this.dictionary[e];
			r !== void 0 && (this.influences[r] = t * n);
		};
		n("Mouth_Drop_Lower", .5), n("Mouth_Drop_Upper", .3), n("Mouth_Down_Lower_L", .2), n("Mouth_Down_Lower_R", .2), n("Mouth_Shrug_Lower", .25), n("Jaw_Open", .15);
	}
}, wn = class {
	_morph;
	smoothing;
	gain;
	blendSpeed;
	restBlendSpeed;
	_ctx = null;
	_analyser = null;
	_dataArray = null;
	_source = null;
	_running = !1;
	constructor(e, t = {}) {
		this._morph = e, this.smoothing = t.smoothing ?? .6, this.gain = t.gain ?? 2.5, this.blendSpeed = t.blendSpeed ?? 20, this.restBlendSpeed = t.restBlendSpeed ?? 15;
	}
	async fromAudioElement(e) {
		await this._initCtx(), this._source = this._ctx.createMediaElementSource(e), this._source.connect(this._analyser), this._analyser.connect(this._ctx.destination);
	}
	async fromMicrophone() {
		await this._initCtx();
		let e = await navigator.mediaDevices.getUserMedia({ audio: !0 });
		this._source = this._ctx.createMediaStreamSource(e), this._source.connect(this._analyser);
	}
	async _initCtx() {
		if (this._source) {
			try {
				this._source.disconnect();
			} catch {}
			this._source = null;
		}
		if (this._analyser) {
			try {
				this._analyser.disconnect();
			} catch {}
			this._analyser = null;
		}
		this._ctx ||= new (window.AudioContext || window.webkitAudioContext)(), this._ctx.state === "suspended" && await this._ctx.resume(), this._analyser = this._ctx.createAnalyser(), this._analyser.fftSize = 256, this._analyser.smoothingTimeConstant = this.smoothing, this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
	}
	start() {
		this._running = !0;
	}
	stop() {
		if (this._running = !1, this._morph) {
			let e = this._morph.dictionary, t = this._morph.influences;
			[
				"Jaw_Open",
				"Mouth_Shrug_Upper",
				"Mouth_Shrug_Lower",
				"Mouth_Down_Lower_L",
				"Mouth_Down_Lower_R",
				"Mouth_Up_Upper_L",
				"Mouth_Up_Upper_R",
				"Mouth_Funnel_Up_L",
				"Mouth_Funnel_Up_R",
				"Mouth_Funnel_Down_L",
				"Mouth_Funnel_Down_R",
				"Mouth_Pucker_Up_L",
				"Mouth_Pucker_Up_R",
				"Mouth_Pucker_Down_L",
				"Mouth_Pucker_Down_R",
				"Mouth_Smile_L",
				"Mouth_Smile_R",
				"Mouth_Stretch_L",
				"Mouth_Stretch_R",
				"Mouth_Close"
			].forEach((n) => {
				let r = e[n];
				r !== void 0 && (t[r] = 0);
			});
		}
	}
	dispose() {
		this._running = !1;
		try {
			this._source?.disconnect();
		} catch {}
		try {
			this._analyser?.disconnect();
		} catch {}
		this._ctx && this._ctx.state !== "closed" && this._ctx.close().catch(() => {}), this._ctx = null, this._analyser = null, this._source = null, this._dataArray = null;
	}
	update(e) {
		if (!this._analyser || !this._running || !this._dataArray) {
			this._applyAudioShapes(e, 0, 0, 0, 0);
			return;
		}
		this._analyser.getByteFrequencyData(this._dataArray);
		let t = this._analyser.frequencyBinCount, n = 0, r = 0, i = 0, a = 0;
		for (let e = 1; e < t; e++) {
			let t = this._dataArray[e] / 255;
			a += t, e <= 12 ? n += t : e <= 35 ? r += t : e <= 80 && (i += t);
		}
		let o = a / (t - 1) * this.gain, s = n / 12 * this.gain, c = r / 23 * this.gain, l = i / 45 * this.gain;
		this._applyAudioShapes(e, o, s, c, l);
	}
	_applyAudioShapes(e, t, n, r, i) {
		let a = this._morph.dictionary, o = this._morph.influences, s = {
			Jaw_Open: 0,
			Mouth_Shrug_Upper: 0,
			Mouth_Shrug_Lower: 0,
			Mouth_Down_Lower_L: 0,
			Mouth_Down_Lower_R: 0,
			Mouth_Up_Upper_L: 0,
			Mouth_Up_Upper_R: 0,
			Mouth_Funnel_Up_L: 0,
			Mouth_Funnel_Up_R: 0,
			Mouth_Funnel_Down_L: 0,
			Mouth_Funnel_Down_R: 0,
			Mouth_Pucker_Up_L: 0,
			Mouth_Pucker_Up_R: 0,
			Mouth_Pucker_Down_L: 0,
			Mouth_Pucker_Down_R: 0,
			Mouth_Smile_L: 0,
			Mouth_Smile_R: 0,
			Mouth_Stretch_L: 0,
			Mouth_Stretch_R: 0,
			Mouth_Close: 0
		};
		if (t > .05) {
			let e = (e, t) => Math.min(t, Math.max(0, e)), a = e(t * .6, 1), o = n + r + i + .001, c = n / o, l = r / o, u = i / o;
			s.Jaw_Open = e(a * .45, .45), s.Mouth_Shrug_Upper = e(a * .3, .3), s.Mouth_Shrug_Lower = e(a * .25, .25), s.Mouth_Up_Upper_L = e(a * .15, .15), s.Mouth_Up_Upper_R = e(a * .15, .15), s.Mouth_Funnel_Up_L = e(a * .2, .2), s.Mouth_Funnel_Up_R = e(a * .2, .2), s.Mouth_Funnel_Down_L = e(a * .18, .18), s.Mouth_Funnel_Down_R = e(a * .18, .18);
			let d = e(n * c * 1.5, .4);
			s.Jaw_Open = e(s.Jaw_Open + d * .3, .75), s.Mouth_Down_Lower_L = e(d * .3, .3), s.Mouth_Down_Lower_R = e(d * .3, .3), s.Mouth_Shrug_Upper = e(s.Mouth_Shrug_Upper + d * .15, .4), s.Mouth_Up_Upper_L = e(s.Mouth_Up_Upper_L + d * .1, .2), s.Mouth_Up_Upper_R = e(s.Mouth_Up_Upper_R + d * .1, .2), s.Mouth_Close = e(s.Mouth_Close - d * .3, .3);
			let f = e(r * l * 1.5, .35);
			s.Mouth_Smile_L = e(f * .4, .35), s.Mouth_Smile_R = e(f * .4, .35), s.Mouth_Stretch_L = e(f * .2, .2), s.Mouth_Stretch_R = e(f * .2, .2);
			let p = e(i * u * 1.5, .35);
			s.Mouth_Pucker_Up_L = e(p * .4, .4), s.Mouth_Pucker_Up_R = e(p * .4, .4), s.Mouth_Pucker_Down_L = e(p * .35, .35), s.Mouth_Pucker_Down_R = e(p * .35, .35), s.Mouth_Shrug_Upper = e(s.Mouth_Shrug_Upper + p * .2, .4);
			let m = p * u;
			s.Jaw_Open = e(s.Jaw_Open - m * .2, .75), s.Mouth_Close = e(m * .25, .3);
		}
		let c = t < .05 ? this.restBlendSpeed : this.blendSpeed;
		Object.entries(s).forEach(([t, n]) => {
			let r = a[t];
			if (r === void 0) return;
			let i = o[r], s = i + (n - i) * (1 - Math.exp(-c * e));
			Math.abs(n - s) < .001 && (s = n), o[r] = Math.max(0, Math.min(1, s));
		});
	}
}, Tn = class {
	audioCtx = null;
	audio = null;
	audioUrl = null;
	lipSync = null;
	controller = null;
	ttsHandler = null;
	playStartTime = 0;
	lastDriftCorrection = 0;
	listeners = null;
	constructor() {
		this.initAudioContext();
	}
	setRefs(e, t, n) {
		this.lipSync = e, this.controller = t, this.ttsHandler = n;
	}
	initAudioContext() {
		if (!this.audioCtx && (this.audioCtx = new AudioContext(), this.audioCtx.state === "suspended")) {
			let e = () => {
				this.audioCtx?.resume(), window.removeEventListener("click", e), window.removeEventListener("touchstart", e);
			};
			window.addEventListener("click", e), window.addEventListener("touchstart", e);
		}
	}
	cleanup() {
		this.audio &&= (this.listeners &&= (this.audio.removeEventListener("playing", this.listeners.playing), this.audio.removeEventListener("ended", this.listeners.ended), null), this.audio.pause(), null), this.audioUrl &&= (URL.revokeObjectURL(this.audioUrl), null);
	}
	dispose() {
		this.cleanup(), this.audioCtx && this.audioCtx.state !== "closed" && this.audioCtx.close().catch(() => {}), this.audioCtx = null, this.lipSync = null, this.controller = null, this.ttsHandler = null;
	}
	async speakTTS(e) {
		if (!this.ttsHandler) {
			console.warn("[AudioManager] No TTS endpoint configured");
			return;
		}
		return new Promise((t) => {
			(async () => {
				if (!this.lipSync) return t();
				this.cleanup(), this.lipSync.stop();
				try {
					let n = await (await this.ttsHandler(e)).blob(), r = URL.createObjectURL(n);
					this.audioUrl = r, await this.playWithTextSync(r, e, t);
				} catch (e) {
					console.error("[AudioManager] TTS fetch failed:", e), t();
				}
			})();
		});
	}
	speakLocal(e, t) {
		return new Promise((n) => {
			(async () => {
				if (!this.lipSync) return n();
				this.cleanup(), this.lipSync.stop(), await this.playWithTextSync(e, t, n);
			})();
		});
	}
	async playWithTextSync(e, t, n) {
		let r = new Audio(e);
		r.preload = "auto", this.audioCtx?.state === "suspended" && await this.audioCtx.resume(), await new Promise((e) => {
			let t = !1, n = null, i = () => {
				t || (t = !0, n !== null && (clearTimeout(n), n = null), e());
			};
			r.addEventListener("canplaythrough", i, { once: !0 }), r.addEventListener("loadedmetadata", () => {
				n = setTimeout(i, 3e3);
			}, { once: !0 }), r.load();
		});
		let i = isFinite(r.duration) && r.duration > 0 ? r.duration * 1e3 : null, a = () => {
			let e = r.currentTime * 1e3, n = performance.now() - e;
			this.playStartTime = n, this.lipSync.startAt(n, t, i);
		}, o = () => {
			this.controller?.switchAction("Idle"), this.lipSync.stop(), this.cleanup(), n();
		};
		this.listeners = {
			playing: a,
			ended: o
		}, r.addEventListener("playing", a, { once: !0 }), r.addEventListener("ended", o, { once: !0 });
		try {
			this.controller?.switchAction("Talk"), this.audio = r, await r.play();
		} catch (e) {
			console.error("[AudioManager] Play failed:", e), this.controller?.switchAction("Idle"), this.cleanup(), n();
		}
	}
	applyDriftCorrection() {
		if (!this.audio || !this.lipSync?.isPlaying) return;
		let e = performance.now(), t = e - this.playStartTime, n = t < 2e3 ? 33 : 100;
		if (e - this.lastDriftCorrection < n) return;
		this.lastDriftCorrection = e;
		let r = e - this.lipSync._startTime - this.audio.currentTime * 1e3;
		if (Math.abs(r) > 20) {
			let e = t < 2e3 ? .3 : .15;
			this.lipSync._startTime += r * e;
		}
	}
	suspendAudio() {
		this.audioCtx?.state === "running" && this.audioCtx.suspend().catch(() => {});
	}
	resumeAudio() {
		this.audioCtx?.state === "suspended" && this.audioCtx.resume().catch(() => {});
	}
	forceResync() {
		if (!this.audio || !this.lipSync) return;
		let e = this.audio.currentTime * 1e3;
		this.lipSync._startTime = performance.now() - e;
	}
};
//#endregion
//#region src/service/tts.ts
function En(e) {
	return e ? typeof e == "function" ? e : (t) => fetch(e, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text: t })
	}) : null;
}
//#endregion
//#region src/core/avatarController.ts
var Dn = class {
	canvas;
	scene;
	camera;
	renderer;
	controls;
	lightSetup;
	audioManager;
	timer;
	options;
	character = null;
	animCtrl = null;
	lipSync = null;
	audioLipSync = null;
	rafId = 0;
	isVisible = !0;
	isDisposed = !1;
	constructor(e, t = {}) {
		if (this.canvas = e, this.options = t, this.scene = ut(), this.camera = dt(e), t.cameraPosition) {
			let [e, n, r] = t.cameraPosition;
			this.camera.position.set(e, n, r);
		}
		this.renderer = ft(e), this.controls = mt(this.camera, this.renderer), this.lightSetup = gt(this.scene, this.renderer), this.audioManager = new Tn(), this.timer = new He(), this.timer.connect(document), window.addEventListener("resize", this.onResizeBound), document.addEventListener("visibilitychange", this.onVisibilityBound), this.animate();
	}
	async loadModel(e) {
		if (this.animCtrl?.dispose(), this.animCtrl = null, this.lipSync = null, this.audioLipSync = null, this.character &&= (gn(this.character.object, this.character.mixer, this.character.actions), null), this.character = await pn(e, this.scene), !this.character.morphTargets) {
			console.error("[AvatarController] No morph targets found on model");
			return;
		}
		let { object: t } = this.character;
		if (this.options.modelScale !== void 0 && t.scale.setScalar(this.options.modelScale), this.options.modelPosition !== void 0) {
			let [e, n, r] = this.options.modelPosition;
			t.position.set(e, n, r);
		}
		this.lipSync = new Cn(this.character.morphTargets, {
			blendSpeed: 15.5,
			restBlendSpeed: 14,
			idleBreath: !0
		}), this.audioLipSync = new wn(this.character.morphTargets, { gain: 3.5 }), this.animCtrl = _n({
			actions: this.character.actions,
			mixer: this.character.mixer,
			lipSync: this.lipSync,
			audioLipSync: this.audioLipSync
		}), this.audioManager.setRefs(this.lipSync, this.animCtrl, En(this.options.ttsEndpoint));
	}
	async speak(e) {
		await this.audioManager.speakTTS(e);
	}
	async speakLocal(e, t) {
		await this.audioManager.speakLocal(e, t);
	}
	setControlsEnabled(e) {
		this.controls.enabled = e;
	}
	getDevData() {
		return {
			actions: this.character?.actions ?? {},
			controller: this.animCtrl,
			morphTargets: this.character?.morphTargets ?? null
		};
	}
	animate = () => {
		if (this.isDisposed || !this.isVisible) return;
		this.rafId = requestAnimationFrame(this.animate), this.timer.update();
		let e = this.timer.getDelta();
		e > .05 && (e = .016), this.character && this.character.mixer.update(e), this.audioLipSync?._running ? this.audioLipSync.update(e) : this.lipSync?.isPlaying && this.lipSync.update(e), this.lipSync?.isPlaying && this.audioManager.applyDriftCorrection(), this.controls.enabled && this.controls.update(), this.renderer.render(this.scene, this.camera);
	};
	onResizeBound = () => pt(this.camera, this.renderer, this.canvas);
	onVisibilityBound = () => {
		this.isVisible = !document.hidden, this.isVisible ? (this.audioManager.resumeAudio(), this.timer.update(), this.audioManager.forceResync(), this.animate()) : (cancelAnimationFrame(this.rafId), this.audioManager.suspendAudio());
	};
	dispose() {
		this.isDisposed = !0, cancelAnimationFrame(this.rafId), window.removeEventListener("resize", this.onResizeBound), document.removeEventListener("visibilitychange", this.onVisibilityBound), this.audioManager.dispose(), this.animCtrl?.dispose(), this.audioLipSync?.dispose(), this.audioLipSync = null, this.lipSync = null, this.character &&= (gn(this.character.object, this.character.mixer, this.character.actions), null), _t(this.scene, this.lightSetup), this.controls.dispose(), this.renderer.dispose();
	}
};
//#endregion
//#region src/ui/speakButton.ts
function On(e, t) {
	let n = document.createElement("div");
	n.className = "speak-minimal-wrapper";
	let r = document.createElement("button");
	return r.className = "speak-minimal-btn", r.title = "Click to speak", r.innerHTML = "\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n      <path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\" />\n      <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\" />\n      <line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"22\" />\n    </svg>\n  ", r.addEventListener("click", async () => {
		if (!r.classList.contains("playing")) {
			r.classList.add("playing");
			try {
				await t();
			} finally {
				r.classList.remove("playing");
			}
		}
	}), n.appendChild(r), e.appendChild(n), r;
}
//#endregion
//#region src/index.ts
async function kn(e, t) {
	let n = new Dn(e, {
		ttsEndpoint: t.ttsEndpoint,
		modelScale: t.modelScale,
		modelPosition: t.modelPosition,
		cameraPosition: t.cameraPosition
	});
	await n.loadModel(t.modelUrl);
	let r = async () => {
		t.audioUrl && t.script ? await n.speakLocal(t.audioUrl, t.script) : t.script && await n.speak(t.script);
	}, i = t.event || "click", a = null;
	return t.element ? (a = t.element, a.addEventListener(i, r)) : t.button !== !1 && On(e.parentElement || document.body, r), {
		controller: n,
		destroy: () => {
			a &&= (a.removeEventListener(i, r), null), n.dispose();
		}
	};
}
//#endregion
export { kn as createAvatarScene };
