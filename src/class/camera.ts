import Object3d from "./object3d";
import M4 from "../base-types/m4";
import Vector3 from "../base-types/vector3";

class Camera extends Object3d {
    protected _projectionMatrix = M4.identity();
    private _invWorldMatrix = M4.identity();
    private _distance: number = 10;
    private _orbitNode: Object3d;

    constructor() {
        super();
        this._orbitNode = new Object3d();
        this.add(this._orbitNode);
        this.position = new Vector3(0, 0, -this._distance);
    }


    computeWorldMatrix() {
        super.computeWorldMatrix();
        this._invWorldMatrix = this.worldMatrix.inverse();
    }


    get viewProjectionMatrix() {
        this.computeWorldMatrix();
        return M4.multiply(this.projectionMatrix, this._invWorldMatrix);
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    computeProjectionMatrix() {
        throw new Error("Camera.computeProjectionMatrix() must be implemented in derived classes.");
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
