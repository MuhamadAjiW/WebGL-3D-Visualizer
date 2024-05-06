import Object3d from "./object3d";
import M4 from "../base-types/m4";

class Camera extends Object3d {
    protected _projectionMatrix = M4.identity();
    private _invWorldMatrix = M4.identity();


    computeWorldMatrix() {
        super.computeWorldMatrix();
        this._invWorldMatrix = this.worldMatrix.inverse();
    }


    get viewProjectionMatrix() {
        this.computeWorldMatrix();
        return M4.multiply(this.projectionMatrix, this._invWorldMatrix);
        // return this.projectionMatrix.premul(this._invWorldMatrix);
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    computeProjectionMatrix() {
        throw new Error("Camera.computeProjectionMatrix() must be implemented in derived classes.");
    }
}

export default Camera;
