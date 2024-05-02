import { MathUtil } from "../util/math-util";
import { Vector3 } from "./vector3";

export class Quaternion{
  // Note: Angles should be in radiant, convert it beforehand

  // Attributes
  public w: number = 0;
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;
  
  // Constructor
  constructor(w: number=0, x: number=0, y: number=0, z: number=0){
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  // Set-getter
  public get(index: number): [number, number, number, number] {
    return [this.w, this.x, this.y, this.z]
  }

  public set(w: number, x: number, y: number, z: number): void {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  public setAttribute(key: string, value: number): void {
    switch (key) {
      case 'w':
        this.w = value;
        break;
      case 'x':
        this.x = value;
        break;
      case 'y':
        this.y = value;
        break;
      case 'z':
        this.z = value;
        break;
      default:
        throw new Error("Invalid Key");
    }
  }

  // Functions
  public magnitude(): number{
    return Math.sqrt(Math.pow(this.w,2) 
                    + Math.pow(this.x,2) 
                    + Math.pow(this.y,2) 
                    + Math.pow(this.z,2))
  }
  
  public normalized(): Quaternion{
    const mag: number = this.magnitude();
    return new Quaternion(this.w / mag
                  , this.x / mag
                  , this.y / mag
                  , this.z / mag);
  }

  public conjugate(): Quaternion{
    return new Quaternion(this.w
                  , -this.x
                  , -this.y
                  , -this.z);
  }
  
  public inverse(): Quaternion{
    const magSquared: number = Math.pow(this.magnitude(), 2);
    const conjugate = this.conjugate();
    return new Quaternion(conjugate.w / magSquared
                  , conjugate.x / magSquared
                  , conjugate.y / magSquared
                  , conjugate.z / magSquared);
  }

  public equals(q: Quaternion): boolean{
    return this.w == q.w 
        && this.x == q.x 
        && this.y == q.y 
        && this.z == q.z;
  }

  public multiply(q: Quaternion): Quaternion{
    return new Quaternion(
        this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
        this.w * q.x + this.x * q.w + this.z * q.y - this.y * q.z,
        this.w * q.y + this.y * q.w + this.x * q.z - this.z * q.x,
        this.w * q.z + this.z * q.w + this.y * q.x - this.x * q.y,
      );
  }

  public toString(): String{
    return `(${this.w},${this.x},${this.y},${this.z})`
  }
  
  // Static Functions
  public static readonly identity: Quaternion = new Quaternion(1,0,0,0);
  
  public static dot(q1: Quaternion, q2: Quaternion) : number {
    return (q1.w * q2.w) + (q1.x * q2.x) + (q1.y * q2.y) + (q1.z * q2.z);
  }

  public static multiply(q1: Quaternion, q2: Quaternion): Quaternion{
    return new Quaternion(
        q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
        q1.w * q2.x + q1.x * q2.w + q1.z * q2.y - q1.y * q2.z,
        q1.w * q2.y + q1.y * q2.w + q1.x * q2.z - q1.z * q2.x,
        q1.w * q2.z + q1.z * q2.w + q1.y * q2.x - q1.x * q2.y,
    );
  }

  public static normalize(q: Quaternion): Quaternion {
    return q.normalized();
  }

  public static conjugate(q: Quaternion): Quaternion {
    return q.conjugate();
  }

  public static inverse(q: Quaternion): Quaternion {
    return q.inverse();
  }
  
  public static angle(q1: Quaternion, q2: Quaternion) : number {
    const q1n = q1.normalized();
    const q2n = q2.normalized();

    const dot = Quaternion.dot(q1n, q2n);
      
    const cos = MathUtil.clamp(dot, -1, 1);

    return Math.acos(cos);
  }

  // TODO: Euler in one axis to Quaternion
  public static angleAxis(angle: number, axis: Vector3): Quaternion {
    const half = angle/2;
    const sinHalf = Math.sin(half);
    const cosHalf = Math.cos(half);
    return new Quaternion(cosHalf
                  , axis.x * sinHalf
                  , axis.y * sinHalf
                  , axis.z * sinHalf)
  }

  // TODO: Euler to Quaternion 
  public static Euler(v: Vector3): Quaternion {
    let q = Quaternion.identity;
    q = Quaternion.multiply(q, Quaternion.angleAxis(v.x, Vector3.right));
    q = Quaternion.multiply(q, Quaternion.angleAxis(v.y, Vector3.up));
    q = Quaternion.multiply(q, Quaternion.angleAxis(v.z, Vector3.forward));

    return q;
  }

  // TODO: Quaternion to Euler

  // Convert quaternion to a rotation matrix
  toRotationMatrix(): number[][] {
  const x = this.x,
    y = this.y,
    z = this.z,
    w = this.w;
    return [
      [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w],
      [2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w],
      [2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y],
    ];
  }

  toRotationMatrixAlternative(): number[][] {
    return [
      [
        this.w * this.w + this.x * this.x - this.y * this.y - this.z * this.z,
        2 * (this.x * this.y - this.w * this.z),
        2 * (this.x * this.z + this.w * this.y),
      ],
      [
        2 * (this.x * this.y + this.w * this.z),
        this.w * this.w - this.x * this.x + this.y * this.y - this.z * this.z,
        2 * (this.y * this.z - this.w * this.x),
      ],
      [
        2 * (this.x * this.z - this.w * this.y),
        2 * (this.y * this.z + this.w * this.x),
        this.w * this.w - this.x * this.x - this.y * this.y + this.z * this.z,
      ],
    ];
  }
}
