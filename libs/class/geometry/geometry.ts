import Vector3 from "@/libs/base-types/vector3";
import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  // private _indices?: BufferAttribute;

  constructor() {
    this._attributes = {};
  }

  get attributes() {
    return this._attributes;
  }

  // get indices() {
  //   return this._indices;
  // }

  // setIndices(indices: BufferAttribute) {
  //   this._indices = indices;
  //   return this;
  // }

  // removeIndices() {
  //   this._indices = undefined;
  //   return this;
  // }

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

    // Triangles, might need to refactor if we implement it the other way
    if(position.length < position.size * 3){
      throw new Error("Geometry vertices is less than 3, needs at least 3 vertices to calculate the normal of a surface");
    }

    const increment = position.size * 3;
    for (let index = 0; index < position.length; index += increment) {
      const vertex1 = new Vector3(position.data[index], position.data[index + 1], position.data[index + 2]);
      const vertex2 = new Vector3(position.data[index + 3], position.data[index + 3 + 1], position.data[index + 3 + 2]);
      const vertex3 = new Vector3(position.data[index + 6], position.data[index + 6 + 1], position.data[index + 6 + 2]);
      
      const vector1 = vertex2.substract(vertex1);
      const vector2 = vertex3.substract(vertex1);

      const vectorN = vector1.cross(vector2);

      normal.set(index, vectorN.getVector());
      normal.set(index + 1, vectorN.getVector());
      normal.set(index + 2, vectorN.getVector());
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
