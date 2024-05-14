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
    var st = M4.ortho(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );

    var morth = new M4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
    ]);

    var theta = Math.atan2(this.left, this.near);
    var phi = Math.atan2(this.bottom, this.near);

    var h = new M4();
    h.matrix[0][0] = 1;
    h.matrix[1][1] = 1;
    h.matrix[2][2] = 1;
    h.matrix[3][3] = 1;
    h.matrix[0][2] = 1 / Math.tan(theta);
    h.matrix[1][2] = 1 / Math.tan(phi);

    this._projectionMatrix = M4.multiply(morth, M4.multiply(st, h));
  }

  setDistance(distance: number) {
    this.left *= distance;
    this.right *= distance;
    this.bottom *= distance;
    this.top *= distance;
    this.computeProjectionMatrix();
  }

}

export default ObliqueCamera;
