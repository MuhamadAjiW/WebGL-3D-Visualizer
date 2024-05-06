import Vector3 from "../base-types/vector3";
import M4 from "../base-types/m4";
import { Quaternion } from "../base-types/quaternion";

class Object3D {
  private _position: Vector3 = new Vector3();
  private _rotation: Quaternion = new Quaternion();
  private _scale: Vector3 = new Vector3(1, 1, 1);
  private _localMatrix: M4 = M4.identity();
  private _worldMatrix: M4 = M4.identity();
  private _parent?: Object3D;
  private _children: Object3D[] = [];
  visible = true;

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

  // Public setter
  // Should update world matrix if parent changed
  set parent(parent) {
    if (this._parent !== parent) {
      this._parent = parent;
      this.computeWorldMatrix(false, true);
    }
  }

  computeLocalMatrix() {
    this._localMatrix = M4.TRS(this._position, this._rotation, this._scale);
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
}

export default Object3D;
