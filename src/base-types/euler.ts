import M4 from "./m4";
import { Quaternion } from "./quaternion";
import Vector3 from "./vector3";

export class Euler {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  order: string = "XYZ";

  constructor(x: number, y: number, z: number, order: string) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order.toUpperCase();
  }

  get isEuler(): boolean {
    return true;
  }

  copy(euler: Euler): this {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;

    return this;
  }

  clone(): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  equals(euler: Euler): boolean {
    return (
      this.x === euler.x &&
      this.y === euler.y &&
      this.z === euler.z &&
      this.order === this.order
    );
  }

  fromArray(array: Array<number | string>): this {
    this.x = array[0] as number;
    this.y = array[1] as number;
    this.z = array[2] as number;
    this.order = array.length > 3 ? (array[3] as string) : this.order;

    return this;
  }

  reorder(newOrder: string): this {
    this.order = newOrder;
    return this;
  }

  set(x: number, y: number, z: number, order?: string): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order ?? this.order;

    return this;
  }

  setFromRotationMatrix(m: M4, quadran: number, order?: string): this {
    // implementation of order will always XYZ if not needed to consider the order
    // quadran === 14 => quadran 1 and quadran 4
    // quadran === 23 => quadran 2 and quadran 3

    const matrix = m.matrix.map((row) => [...row]);
    const rotationMatix = matrix.slice(0, 3).map((row) => row.slice(0, 3));

    let theta1,
      theta2,
      psi1,
      psi2,
      phi1 = 0,
      phi2;

    if (rotationMatix[3][1] != -1 && rotationMatix[3][1] != 1) {
      theta1 = -Math.asin(rotationMatix[3][1]);
      theta2 = Math.PI - theta1;
      psi1 = Math.atan2(rotationMatix[3][2], rotationMatix[3][3]);
      psi2 = Math.atan2(-rotationMatix[3][2], -rotationMatix[3][3]);
      phi1 = Math.atan2(rotationMatix[2][1], Math.cos(theta1) * Math.cos(psi1));
      phi2 = Math.atan2(
        -rotationMatix[2][1],
        Math.cos(theta2) * Math.cos(psi2)
      );
    } else {
      if (rotationMatix[3][1] === -1) {
        theta1 = Math.PI / 2;
        psi1 = phi1 + Math.atan2(rotationMatix[1][2], rotationMatix[1][3]);
      } else {
        theta1 = -Math.PI / 2;
        psi1 = -phi1 + Math.atan2(-rotationMatix[1][2], -rotationMatix[1][3]);
      }
    }

    if (!theta2 && quadran === 14) {
      this.x = theta1
      this.y = psi1
      this.z = phi1
    } else {
      this.x = theta2!!
      this.y = psi2!!
      this.z = phi2!!
    }

    this.order = order ?? this.order

    return this;
  }

  setFromQuaternion(q: Quaternion, order?: string): this {
    // implementation of order will always XYZ if not needed to consider the order

    const sinr_cosp = 2 * (q.w * q.x + q.y * q.z)
    const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y)
    this.x = Math.atan2(sinr_cosp, cosr_cosp)

    const sinp = Math.sqrt(1 + 2 * (q.w * q.y - q.x * q.z))
    const cosp = Math.sqrt(1 - 2 * (q.w * q.y - q.x * q.z))
    this.y =  2 * Math.atan2(sinp, cosp) - Math.PI / 2

    const siny_cosp = 2 * (q.w * q.z + q.x * q.y)
    const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    this.z = Math.atan2(siny_cosp, cosy_cosp)

    this.order = order ?? this.order

    return this;
  }

  setFromVector3(vector: Vector3, order?: string): this {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    this.order = order ?? this.order;
    return this;
  }

  toArray(
    array: Array<number | string> = new Array<number | string>(4),
    offset: number = 0
  ): Array<number | string> {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.order;
    return array;
  }
}
