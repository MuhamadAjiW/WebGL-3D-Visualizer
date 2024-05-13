// vector3.d.ts

declare class Vector3 {
  x: number;
  y: number;
  z: number;

  // Constructor
  /**
   * Creates a new Vector3 with default values or specified components.
   */
  constructor();
  /**
   * Creates a new Vector3 with the specified x, y, and z values.
   *
   * @param x - The x component.
   * @param y - The y component.
   * @param z - The z component.
   */
  constructor(x: number, y: number, z: number);
  /**
   * Creates a new Vector3 from an array of values.
   *
   * @param point - An array containing [x, y, z].
   */
  constructor(point: number[]);

  // Instance Methods
  /**
   * Returns the Vector3 components as an array.
   *
   * @returns An array [x, y, z].
   */
  public getVector(): [number, number, number];

  /**
   * Sets the Vector3 components.
   *
   * @param x - The x component.
   * @param y - The y component.
   * @param z - The z component.
   */
  public setVector(x: number, y: number, z: number): void;

  /**
   * Checks if this Vector3 is equal to another Vector3.
   *
   * @param v3 - The Vector3 to compare against.
   * @returns `true` if both vectors are equal, `false` otherwise.
   */
  public equals(v3: Vector3): boolean;

  /**
   * Returns the length (magnitude) of the vector.
   *
   * @returns The length of the vector.
   */
  public length(): number;

  /**
   * Adds another vector to this vector.
   *
   * @param v3 - The Vector3 to add.
   * @returns A new Vector3 representing the sum.
   */
  public add(v3: Vector3): Vector3;

  /**
   * Subtracts another vector from this vector.
   *
   * @param v3 - The Vector3 to subtract.
   * @returns A new Vector3 representing the difference.
   */
  public substract(v3: Vector3): Vector3;

  /**
   * Multiplies the vector by a scalar factor.
   *
   * @param factor - The scalar factor.
   * @returns A new Vector3 representing the scaled vector.
   */
  public mul(factor: number): Vector3;

  /**
   * Computes the cross product with another vector.
   *
   * @param v3 - The Vector3 to compute the cross product with.
   * @returns A new Vector3 representing the cross product.
   */
  public cross(v3: Vector3): Vector3;

  /**
   * Computes the dot product with another vector.
   *
   * @param v3 - The Vector3 to compute the dot product with.
   * @returns The dot product of both vectors.
   */
  public dot(v3: Vector3): number;

  /**
   * Returns a normalized version of the vector.
   *
   * @returns A new Vector3 that is the normalized version.
   */
  public normalize(): Vector3;

  /**
   * Multiplies the vector by a scalar factor.
   *
   * @param scalar - The scalar factor.
   * @returns A new Vector3 representing the scaled vector.
   */
  public multiplyScalar(scalar: number): Vector3;

  /**
   * Projects this vector onto another vector.
   *
   * @param v3 - The Vector3 to project onto.
   * @returns A new Vector3 representing the projected vector.
   */
  public projectOnto(v3: Vector3): Vector3;

  /**
   * Calculates the angle to another vector.
   *
   * @param v3 - The Vector3 to calculate the angle to.
   * @returns The angle in radians between both vectors.
   */
  public angleTo(v3: Vector3): number;

  /**
   * Scales this vector by another vector.
   *
   * @param v3 - The Vector3 to scale by.
   * @returns A new Vector3 representing the scaled vector.
   */
  public scale(v3: Vector3): Vector3;

  // Static Properties
  static readonly one: Vector3;
  static readonly zero: Vector3;
  static readonly up: Vector3;
  static readonly down: Vector3;
  static readonly forward: Vector3;
  static readonly back: Vector3;
  static readonly right: Vector3;
  static readonly left: Vector3;
}

export { Vector3 as default };
