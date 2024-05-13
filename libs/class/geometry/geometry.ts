import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor() {
    this._attributes = {};
  }

  get attributes() {
    return this._attributes;
  }

  get indices() {
    return this._indices;
  }

  setIndices(indices: BufferAttribute) {
    this._indices = indices;
    return this;
  }

  removeIndices() {
    this._indices = undefined;
    return this;
  }

  setAttribute(name: string, attribute: BufferAttribute) {
    this._attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string) {
    return this._attributes[name];
  }

  deleteAttribute(name: string) {
    delete this._attributes[name];
    return this;
  }

  calculateNormals(forceNewAttribute = false) {
    const position = this.getAttribute(AttributeKeys.POSITION);
    if (!position) {
      return;
    }

    let normal = this.getAttribute(AttributeKeys.NORMAL);
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    // Lakukan kalkulasi normal disini.

    this.setAttribute(AttributeKeys.NORMAL, normal);
  }


  // TODO: Implement
  public toJson(): void {
    throw new Error("Method not implemented.");
  }
  public fromJson(): void {
    throw new Error("Method not implemented.");
  }
}

export { BufferGeometry };
