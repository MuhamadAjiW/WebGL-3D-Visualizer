import Camera from "./camera";
import M4 from "../base-types/m4";

class PersepectiveCamera extends Camera {
    fovY: number
    aspect: number
    near: number
    far: number


    constructor(aspect: number, fovY: number, near: number, far: number) {
        super();
        this.fovY = fovY; this.aspect = aspect;
        this.near = near; this.far = far;
        this.computeProjectionMatrix();
    }

    computeProjectionMatrix() {
        this._projectionMatrix = M4.perspective(
            this.fovY,
            this.aspect,
            this.near,
            this.far
        );
    }
}

export default PersepectiveCamera;
