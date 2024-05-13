// euler.d.ts

import M4 from "./m4";
import { Quaternion } from "./quaternion";
import Vector3 from "./vector3";

declare class Euler {
  x: number;
  y: number;
  z: number;
  order: string;

  // Constructor
  /**
   * Creates a new Euler angle object.
   *
   * @param x - The x (pitch) angle in radians.
   * @param y - The y (yaw) angle in radians.
   * @param z - The z (roll) angle in radians.
   * @param order - The order of rotations, e.g., "XYZ".
   */
  constructor(x: number, y: number, z: number, order: string);

  // Instance Properties
  /**
   * Indicates that this is an Euler object.
   */
  get isEuler(): boolean;

  // Instance Methods
  /**
   * Copies the values from another Euler angle object.
   *
   * @param euler - The Euler object to copy from.
   * @returns This Euler object.
   */
  copy(euler: Euler): this;

  /**
   * Creates a clone of this Euler angle object.
   *
   * @returns A new Euler object that is a copy of this one.
   */
  clone(): Euler;

  /**
   * Checks if this Euler angle object is equal to another.
   *
   * @param euler - The Euler object to compare against.
   * @returns `true` if both Euler objects are equal, `false` otherwise.
   */
  equals(euler: Euler): boolean;

  /**
   * Sets the Euler angles from an array.
   *
   * @param array - An array containing [x, y, z, order].
   * @returns This Euler object.
   */
  fromArray(array: Array<number | string>): this;

  /**
   * Changes the order of rotations.
   *
   * @param newOrder - The new rotation order.
   * @returns This Euler object.
   */
  reorder(newOrder: string): this;

  /**
   * Sets the Euler angles and optionally the rotation order.
   *
   * @param x - The x (pitch) angle in radians.
   * @param y - The y (yaw) angle in radians.
   * @param z - The z (roll) angle in radians.
   * @param order - (Optional) The rotation order.
   * @returns This Euler object.
   */
  set(x: number, y: number, z: number, order?: string): this;

  /**
   * Sets the Euler angles from a rotation matrix.
   *
   * @param m - An M4 rotation matrix.
   * @param quadran - The quadrant selection value.
   * @param order - (Optional) The rotation order.
   * @returns This Euler object.
   */
  setFromRotationMatrix(m: M4, quadran: number, order?: string): this;

  /**
   * Sets the Euler angles from a quaternion.
   *
   * @param q - A quaternion object.
   * @param order - (Optional) The rotation order.
   * @returns This Euler object.
   */
  setFromQuaternion(q: Quaternion, order?: string): this;

  /**
   * Sets the Euler angles from a vector.
   *
   * @param vector - A Vector3 object representing the angles.
   * @param order - (Optional) The rotation order.
   * @returns This Euler object.
   */
  setFromVector3(vector: Vector3, order?: string): this;

  /**
   * Converts the Euler angles to an array.
   *
   * @param array - An optional array to fill with the angles.
   * @param offset - An optional offset index in the array.
   * @returns An array containing [x, y, z, order].
   */
  toArray(
    array?: Array<number | string>,
    offset?: number
  ): Array<number | string>;
}

export { Euler };
