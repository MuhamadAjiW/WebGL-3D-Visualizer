import Object3d from "./object3d";
import M4 from "../base-types/m4";
import Vector3 from "../base-types/vector3";
import { MathUtil } from "../util/math-util";

class Camera extends Object3d {
  protected _projectionMatrix = M4.identity();

  public distance: number = 3;
  public angleX: number = 0;
  public angleY: number = 0;
  public cameraMatrix = M4.identity();

  constructor() {
    super();
    this.position = new Vector3(0, 0, -this.distance);
  }

  radToDeg(r: number) {
    return (r * 180) / Math.PI;
  }

  degToRad(d: number) {
    return (d * Math.PI) / 180;
  }

  computeCameraMatrix() {
    var rotationY = M4.yRotation(MathUtil.DegreesToRad(this.angleY));
    var rotationX = M4.xRotation(MathUtil.DegreesToRad(this.angleX));
    var translationMatrix = M4.translation3d(new Vector3(0, 0, this.distance));
    this.cameraMatrix = M4.multiply(
      M4.multiply(rotationX, rotationY),
      translationMatrix
    );
  }

  computeViewMatrix() {
    this.computeCameraMatrix();
    return this.cameraMatrix.inverse();
  }

  // computeWorldMatrix() {
  //     super.computeWorldMatrix();
  //     this._invWorldMatrix = this.worldMatrix.inverse();
  // }

  computeProjectionMatrix() {
    throw new Error(
      "Camera.computeProjectionMatrix() must be implemented in derived classes."
    );
  }

  get viewProjectionMatrix() {
    return M4.multiply(this.projectionMatrix, this.computeViewMatrix());
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }

  get getDistance() {
    return this.distance;
  }

  setDistance(value: number) {
    this.distance = value;
    this.position = new Vector3(0, 0, -this.distance);
    this.computeCameraMatrix();
  }

  setOrbitControl(angleX: number, angleY: number): void {
    this.angleX = angleX;
    this.angleY = angleY;
    this.computeCameraMatrix();
  }
}

export default Camera;
