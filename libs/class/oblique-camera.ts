import Camera from "./camera";
import M4 from "../base-types/m4";

class ObliqueCamera extends Camera {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;

  constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    super();
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    const phi = 30;
    const theta = 30;

    const ortho = M4.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far);
    const shearMatrix = new M4([
      [1,0,0,0],
      [0,1,0,0],
      [-1/Math.tan(phi), -1/Math.tan(theta), 1, 0],
      [0,0,0,1]
    ])

    this._projectionMatrix = M4.multiply(ortho, shearMatrix);
  }

  setDistance(distance: number) {
    this.left = -distance;
    this.right = distance;
    this.bottom = -distance;
    this.top = distance;
    this.computeProjectionMatrix();
  }
}

export default ObliqueCamera;
