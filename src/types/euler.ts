import M4 from "./m4";
import Vector3 from "./vector3";

class Euler {
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

  setFromRotationMatrix(m: M4, order?: string): this {
    return this;
  }

  setFromQuaternion(q: Quaternion, order?: string): this {
    return this;
  }

  setFromVector3(vector: Vector3, order?: string): this {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    this.order = order ?? this.order
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

  applyEuler(target: Quaternion| Vector3| M4) {

  }
}
