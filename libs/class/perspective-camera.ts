import Camera from "./camera";
import M4 from "../base-types/m4";

class PerspectiveCamera extends Camera {
  fovY: number;
  aspect: number;
  near: number;
  far: number;

  private static instance: PerspectiveCamera;

  constructor(aspect: number, fovY: number, near: number, far: number) {
    super();
    this.fovY = fovY;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
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

  public static getInstance(
    fovY: number,
    aspect: number,
    near: number,
    far: number
  ): PerspectiveCamera {
    if (!PerspectiveCamera.instance) {
      PerspectiveCamera.instance = new PerspectiveCamera(
        fovY,
        aspect,
        near,
        far
      );
    }

    return PerspectiveCamera.instance;
  }
}

export default PerspectiveCamera;
