import Vector3 from "../base-types/vector3";
import M4 from "../base-types/m4";
import { Quaternion } from "../base-types/quaternion";
import { Euler } from "../base-types/euler";

class Object3D {
  private _position: Vector3 = new Vector3();
  private _rotation: Quaternion | Euler = new Quaternion();
  private _scale: Vector3 = new Vector3(1, 1, 1);
  private _localMatrix: M4 = M4.identity();
  private _worldMatrix: M4 = M4.identity();
  private _parent?: Object3D;
  private _children: Object3D[] = [];
  visible = true;
  private _isDirty = false;

  // Public getter, prevent re-instance new object
  get position() {
    return this._position;
  }
  get rotation() {
    return this._rotation;
  }
  get scale() {
    return this._scale;
  }
  get parent() {
    return this._parent;
  }
  get localMatrix() {
    return this._localMatrix;
  }
  get worldMatrix() {
    return this._worldMatrix;
  }
  get children() {
    return this._children;
  }

  set position(position: Vector3) {
    this._position = position;
    this._isDirty = true;
  }

  set rotation(rotation: Quaternion | Euler) {
    this._rotation = rotation;
    this._isDirty = true;
  }

  set scale(scale: Vector3) {
    this._scale = scale;
    this._isDirty = true;
  }

  // Public setter
  // Should update world matrix if parent changed
  set parent(parent) {
    if (this._parent !== parent) {
      this._parent = parent;
      this.computeWorldMatrix(false, true);
    }
  }

  set position(value) {
    this._position = value;
    this.computeWorldMatrix(false, true);
  }

  computeLocalMatrix() {
    if (this._isDirty) {
      this._localMatrix = M4.TRS(this.position, this._rotation, this._scale);
      this._isDirty = false;
    }
  }

  computeWorldMatrix(updateParent = true, updateChildren = true) {
    // If updateParent, update world matrix of our ancestors
    // (.parent, .parent.parent, .parent.parent.parent, ...)
    if (updateParent && this.parent)
      this.parent.computeWorldMatrix(true, false);
    // Update this node
    this.computeLocalMatrix();
    if (this.parent) {
      this._worldMatrix = M4.mul(this.parent.worldMatrix, this._localMatrix);
    } else {
      this._worldMatrix = this._localMatrix.clone();
    }
    // If updateChildren, update our children
    // (.children, .children.children, .children.children.children, ...)
    if (updateChildren)
      for (let i = 0; i < this._children.length; i++)
        this._children[i].computeWorldMatrix(false, true);
  }

  /**
   * Tambah node sebagai child dari node ini.
   *
   * Jika node sudah memiliki parent, maka node akan
   * dilepas dari parentnya terlebih dahulu.
   */
  add(node: Object3D): Object3D {
    if (node.parent !== this) {
      node.removeFromParent();
      node.parent = this;
    }
    this.children.push(node);
    return this;
  }

  remove(node: Object3D) {
    // hapus node dari this.children (jangan lupa set node.parent = null)
    const index = this.children.indexOf(node, 0);
    if (index > -1) {
      this.children.splice(index, 1);
      node.parent = undefined;
    }
    return this;
  }

  removeFromParent() {
    if (this.parent) this.parent.remove(this);
    return this;
  }

  lookAt(target: any, up: Vector3 = Vector3.up) {
    let targetPosition: Vector3;

    // If the target is another Object3D, use its position; otherwise, assume it's a Vector3
    if (target instanceof Object3D) {
      targetPosition = target.position;
    } else if (target instanceof Vector3) {
      targetPosition = target;
    } else {
      throw new Error("Invalid target type: must be Object3D or Vector3");
    }

    // Use M4.lookAt to calculate the rotation matrix
    const lookAtMatrix = M4.lookAt(this.position, targetPosition, up);

    // Extract rotation as a quaternion from the matrix
    this._rotation = lookAtMatrix.toQuaternion();

    // update the world matrix to reflect this new local matrix
    this.computeWorldMatrix(false, true);
  }
}

export default Object3D;
