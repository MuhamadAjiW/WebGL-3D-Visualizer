import Camera from "./camera";
import M4 from "../base-types/m4";

class PersepectiveCamera extends Camera {
  fovY: number;
  aspect: number;
  near: number;
  far: number;

  private static instance: PersepectiveCamera;

  constructor(aspect: number, fovY: number, near: number, far: number) {
    super();
    this.fovY = fovY;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.computeProjectionMatrix();
  }

  public static getInstance(
    aspect: number,
    fovY: number,
    near: number,
    far: number
  ): PersepectiveCamera {
    if (!PersepectiveCamera.instance) {
      PersepectiveCamera.instance = new PersepectiveCamera(
        aspect,
        fovY,
        near,
        far
      );
    }

    return PersepectiveCamera.instance;
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
