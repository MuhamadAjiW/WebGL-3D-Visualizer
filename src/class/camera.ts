import Object3d from "./object3d";
import M4 from "../base-types/m4";
import Vector3 from "../base-types/vector3";
import { MathUtil } from "../util/math-util";

class Camera extends Object3d {
    protected _projectionMatrix = M4.identity();
    private _invWorldMatrix = M4.identity();
    private _distance: number = 10;
    private _orbitNode: Object3d;
    public angle: number = 0;
    private _cameraMatrix = M4.identity();

    constructor() {
        super();
        this._orbitNode = new Object3d();
        this.add(this._orbitNode);
        this.position = new Vector3(0, 0, -this._distance);
    }

    radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    degToRad(d: number) {
        return d * Math.PI / 180;
    }

    computeCameraMatrix() {
        var matrix = M4.yRotation(MathUtil.DegreesToRad(this.angle));
        var translationMatrix = M4.translation3d(new Vector3(0,0,3));
        this._cameraMatrix = M4.multiply(matrix, translationMatrix);
    }

    computeViewMatrix() {
        this.computeCameraMatrix();
        return this._cameraMatrix.inverse();
    }

    computeWorldMatrix() {
        super.computeWorldMatrix();
        this._invWorldMatrix = this.worldMatrix.inverse();
    }

    computeProjectionMatrix() {
        throw new Error("Camera.computeProjectionMatrix() must be implemented in derived classes.");
    }

    get viewProjectionMatrix() {
        return M4.multiply(this.projectionMatrix, this.computeViewMatrix());
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    get distance() {
        return this._distance;
    }

    set distance(value: number) {
        this._distance = value;
        this.position = new Vector3(0, 0, -this._distance);
    }
}

export default Camera;
