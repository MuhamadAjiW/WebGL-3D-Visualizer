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
    var phi = 0;
    var theta = 0;
    if (this.angleX == 0 || this.angleY == 0) {
      phi = 30;
      theta = 30;
    } else {
      phi = this.angleX;
      theta = this.angleY;
    }

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
