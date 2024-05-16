// object3d.d.ts

import Vector3 from "../base-types/vector3";
import M4 from "../base-types/m4";
import { Quaternion } from "../base-types/quaternion";
import { Euler } from "../base-types/euler";

declare class Object3D {
  private _position: Vector3;
  private _rotation: Quaternion;
  private _scale: Vector3;
  private _localMatrix: M4;
  private _worldMatrix: M4;
  private _parent?: Object3D;
  private _children: Object3D[];
  visible: boolean;
  private _isDirty: boolean;

  // Public getters and setters
  /**
   * Gets the position of the node.
   * @returns The position as a Vector3.
   */
  get position(): Vector3;

  /**
   * Sets the position of the node and marks it for recalculation.
   * @param value - The new position as a Vector3.
   */
  set position(value: Vector3): void;

  /**
   * Gets the rotation of the node.
   * @returns The rotation as a Quaternion or Euler.
   */
  get rotation(): Quaternion;

  /**
   * Sets the rotation of the node and marks it for recalculation.
   * @param rotation - The new rotation as a Quaternion or Euler.
   */
  set rotation(rotation: Quaternion): void;

  /**
   * Gets the scale of the node.
   * @returns The scale as a Vector3.
   */
  get scale(): Vector3;

  /**
   * Sets the scale of the node and marks it for recalculation.
   * @param scale - The new scale as a Vector3.
   */
  set scale(scale: Vector3): void;

  /**
   * Gets the parent node.
   * @returns The parent node as an Object3D, or undefined if this node has no parent.
   */
  get parent(): Object3D | undefined;

  /**
   * Sets the parent node and updates the world matrix if changed.
   * @param parent - The new parent node as an Object3D.
   */
  set parent(parent: Object3D): void;

  /**
   * Gets the local transformation matrix of the node.
   * @returns The local transformation matrix as an M4.
   */
  get localMatrix(): M4;

  /**
   * Gets the world transformation matrix of the node.
   * @returns The world transformation matrix as an M4.
   */
  get worldMatrix(): M4;

  /**
   * Gets the list of children nodes.
   * @returns An array of child nodes as Object3D instances.
   */
  get children(): Object3D[];

  // Public Methods
  /**
   * Adds a node as a child of this node.
   * Removes the node from its current parent if necessary.
   * @param node - The node to add as a child.
   * @returns This Object3D instance for chaining.
   */
  add(node: Object3D): Object3D;

  /**
   * Removes a node from the children of this node.
   * @param node - The node to remove.
   * @returns This Object3D instance for chaining.
   */
  remove(node: Object3D): Object3D;

  /**
   * Removes this node from its parent node.
   * @returns This Object3D instance for chaining.
   */
  removeFromParent(): Object3D;

  /**
   * Orients this node to face the target using the specified up direction.
   * @param target - The target to look at (either another Object3D or a Vector3).
   * @param up - The up direction (default is Vector3.up).
   */
  lookAt(target: any, up?: Vector3): void;

  /**
   * Converts a local vector to world coordinates.
   * @param vector - A Vector3 in the local coordinate space.
   * @returns A Vector3 in the world coordinate space.
   */
  localToWorld(vector: Vector3): Vector3;

  /**
   * Converts a world vector to local coordinates.
   * @param vector - A Vector3 in the world coordinate space.
   * @returns A Vector3 in the local coordinate space.
   */
  worldToLocal(vector: Vector3): Vector3;

  /**
   * Rotates the node around a world axis by a given angle.
   * @param axis - The world-space axis to rotate around (should be normalized).
   * @param angle - The angle in radians to rotate around the axis.
   * @returns This Object3D instance for chaining.
   */
  rotateOnWorldAxis(axis: Vector3, angle: number): this;

  /**
   * Deserializes a node from a JSON representation.
   */
  fromJSON(): void;

  /**
   * Serializes the node to a JSON representation.
   */
  toJSON(): void;

  /**
   * Computes the local transformation matrix based on the node's position, rotation, and scale.
   */
  computeLocalMatrix(): void;

  /**
   * Computes the world transformation matrix, optionally updating parent and child nodes.
   * @param updateParent - Whether to update the parent node.
   * @param updateChildren - Whether to update the child nodes.
   */
  computeWorldMatrix(updateParent?: boolean, updateChildren?: boolean): void;
}

export default Object3D;
