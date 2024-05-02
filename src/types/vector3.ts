export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number);
  constructor(point: number[]);
  constructor(arg1: number | number[], arg2?: number, arg3?: number) {
    if (Array.isArray(arg1)) {
      if (arg1.length !== 3) {
        throw new Error('Point array must contain exactly three elements (x, y, z).');
      }
      this.x = arg1[0];
      this.y = arg1[1];
      this.z = arg1[2];
    } else {
      this.x = arg1;
      this.y = arg2 || 0;
      this.z = arg3 || 0;
    }
  }


  public getVector(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  public setVector(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public equals(v3: Vector3): boolean {
    return this.x === v3.x && this.y === v3.y && this.z === v3.z;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // VECTOR OPERATIONS
  public add(v3: Vector3) {
    return new Vector3(this.x + v3.x, this.y + v3.y, this.z + v3.z);
  }

  public substract(v3: Vector3) {
    return new Vector3(this.x - v3.x, this.y - v3.y, this.z - v3.z);
  }

  public mul(factor: number) {
    return new Vector3(this.x * factor, this.y * factor, this.z * factor);
  }

  // VECTOR METHODS
  public cross(v3: Vector3): Vector3 {
    return new Vector3(
      this.y * v3.z - this.z * v3.y,
      this.z * v3.x - this.x * v3.z,
      this.x * v3.y - this.y * v3.x
    );
  }

  public dot(v3: Vector3): number {
    return this.x * v3.x + this.y * v3.y + this.z * v3.z;
  }

  public normalize(): Vector3 {
    const length = this.length();
    return new Vector3(this.x / length, this.y / length, this.z / length);
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public projectOnto(v3: Vector3): Vector3 {
    const scalar = this.dot(v3) / Math.pow(v3.length(), 2);
    return v3.multiplyScalar(scalar);
  }

  public angleTo(v3: Vector3): number {
    const dotProduct = this.dot(v3);
    const lengthProduct = this.length() * v3.length();
    return Math.acos(dotProduct / lengthProduct);
  }

  public scale(v3: Vector3): Vector3 {
    return new Vector3(this.x * v3.x, this.y * v3.y, this.z * v3.z);
  }

  // STATIC
  public static readonly one: Vector3 = new Vector3(1,1,1);
  public static readonly zero: Vector3 = new Vector3(0,0,0);

  public static readonly up: Vector3 = new Vector3(0,1,0);
  public static readonly down: Vector3 = new Vector3(0,-1,0);

  public static readonly forward: Vector3 = new Vector3(0,0,1);
  public static readonly back: Vector3 = new Vector3(0,0,-1);
  
  public static readonly right: Vector3 = new Vector3(1,0,0);
  public static readonly left: Vector3 = new Vector3(-1,0,0);
}

export default Vector3;
