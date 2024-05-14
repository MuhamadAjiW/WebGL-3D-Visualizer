import Camera from "./camera";
import M4 from "../base-types/m4";

class OrthographicCamera extends Camera {
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
    this._projectionMatrix = M4.ortho(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  }

  setDistance(value: number) {
    const zoomFactor = value / this.distance;
    this.left *= zoomFactor;
    this.right *= zoomFactor;
    this.bottom *= zoomFactor;
    this.top *= zoomFactor;
    this.distance = value;
    this.computeProjectionMatrix();
  }
}

export default OrthographicCamera;
