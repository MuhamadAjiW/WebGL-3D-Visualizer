// quaternion.d.ts

import { MathUtil } from "../util/math-util";
import { Vector3 } from "./vector3";
import { Euler } from "./euler";

declare class Quaternion {
  // Attributes
  public w: number;
  public x: number;
  public y: number;
  public z: number;

  // Constructor
  /**
   * Creates a new Quaternion with default values or specified components.
   */
  constructor();
  /**
   * Creates a new Quaternion with specified values.
   *
   * @param w - The w component.
   * @param x - The x component.
   * @param y - The y component.
   * @param z - The z component.
   */
  constructor(w: number, x: number, y: number, z: number);
  /**
   * Creates a new Quaternion from an array of values.
   *
   * @param point - An array containing [w, x, y, z].
   */
  constructor(point: number[]);

  // Setters and Getters
  /**
   * Returns the Quaternion components as an array.
   *
   * @param index - An unused parameter to match a signature.
   * @returns An array [w, x, y, z].
   */
  public get(index: number): [number, number, number, number];

  /**
   * Sets the Quaternion components.
   *
   * @param w - The w component.
   * @param x - The x component.
   * @param y - The y component.
   * @param z - The z component.
   */
  public set(w: number, x: number, y: number, z: number): void;

  /**
   * Sets a single attribute of the Quaternion.
   *
   * @param key - The attribute name ('w', 'x', 'y', or 'z').
   * @param value - The value to set for the specified attribute.
   * @throws Error if the key is invalid.
   */
  public setAttribute(key: string, value: number): void;

  // Instance Methods
  /**
   * Calculates the magnitude of the Quaternion.
   *
   * @returns The magnitude of the Quaternion.
   */
  public magnitude(): number;

  /**
   * Returns a normalized version of the Quaternion.
   *
   * @returns A new Quaternion that is the normalized version.
   */
  public normalized(): Quaternion;

  /**
   * Returns the conjugate of the Quaternion.
   *
   * @returns A new Quaternion representing the conjugate.
   */
  public conjugate(): Quaternion;

  /**
   * Returns the inverse of the Quaternion.
   *
   * @returns A new Quaternion representing the inverse.
   */
  public inverse(): Quaternion;

  /**
   * Checks if this Quaternion is equal to another Quaternion.
   *
   * @param q - The Quaternion to compare against.
   * @returns `true` if both Quaternions are equal, `false` otherwise.
   */
  public equals(q: Quaternion): boolean;

  /**
   * Multiplies this Quaternion by another Quaternion.
   *
   * @param q - The Quaternion to multiply by.
   * @returns A new Quaternion representing the product.
   */
  public multiply(q: Quaternion): Quaternion;

  /**
   * Converts the Quaternion to a string representation.
   *
   * @returns A string representation of the Quaternion.
   */
  public toString(): string;

  /**
   * Converts the Quaternion to a 3x3 rotation matrix.
   *
   * @returns A 3x3 rotation matrix.
   */
  toRotationMatrix(): number[][];

  /**
   * An alternative method to convert the Quaternion to a 3x3 rotation matrix.
   *
   * @returns A 3x3 rotation matrix using an alternative algorithm.
   */
  toRotationMatrixAlternative(): number[][];

  // Static Methods
  /**
   * The identity Quaternion.
   */
  static readonly identity: Quaternion;

  /**
   * Calculates the dot product of two Quaternions.
   *
   * @param q1 - The first Quaternion.
   * @param q2 - The second Quaternion.
   * @returns The dot product of both Quaternions.
   */
  public static dot(q1: Quaternion, q2: Quaternion): number;

  /**
   * Multiplies two Quaternions together.
   *
   * @param q1 - The first Quaternion.
   * @param q2 - The second Quaternion.
   * @returns A new Quaternion representing the product.
   */
  public static multiply(q1: Quaternion, q2: Quaternion): Quaternion;

  /**
   * Returns a normalized version of the given Quaternion.
   *
   * @param q - The Quaternion to normalize.
   * @returns A new Quaternion that is the normalized version.
   */
  public static normalize(q: Quaternion): Quaternion;

  /**
   * Returns the conjugate of the given Quaternion.
   *
   * @param q - The Quaternion to conjugate.
   * @returns A new Quaternion that is the conjugate version.
   */
  public static conjugate(q: Quaternion): Quaternion;

  /**
   * Returns the inverse of the given Quaternion.
   *
   * @param q - The Quaternion to invert.
   * @returns A new Quaternion that is the inverse version.
   */
  public static inverse(q: Quaternion): Quaternion;

  /**
   * Calculates the angle between two Quaternions.
   *
   * @param q1 - The first Quaternion.
   * @param q2 - The second Quaternion.
   * @returns The angle in radians between both Quaternions.
   */
  public static angle(q1: Quaternion, q2: Quaternion): number;

  /**
   * Converts an Euler angle to a Quaternion.
   *
   * @param e - The Euler angle.
   * @returns A new Quaternion representing the Euler angle.
   */
  public static Euler(e: Euler): Quaternion;
}

export { Quaternion };
