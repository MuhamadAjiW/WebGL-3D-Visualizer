import Vector3 from "@/libs/base-types/vector3";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  public position: BufferAttribute | undefined;
  public normal: BufferAttribute | undefined;
  public texCoords: BufferAttribute | undefined;

  calculateNormals(forceNewAttribute = false) {
    const position = this.position;
    if (!position) {
      return;
    }

    let normal = this.normal;
    if (forceNewAttribute || !normal) {
      normal = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    // Triangles, might need to refactor if we implement it the other way
    if (position.length < position.size * 3) {
      throw new Error(
        "Geometry vertices is less than 3, needs at least 3 vertices to calculate the normal of a surface"
      );
    }

    const length = position.length / position.size;
    for (let index = 0; index < position.length; index += 3) {
      const offset = index * position.size;

      const vertex1 = new Vector3(position.get(index));
      const vertex2 = new Vector3(position.get(index + 1));
      const vertex3 = new Vector3(position.get(index + 2));

      const vector1 = vertex2.substract(vertex1);
      const vector2 = vertex3.substract(vertex1);

      const vectorN = vector1.cross(vector2);

      normal.set(index, vectorN.getVector());
      normal.set(index + 1, vectorN.getVector());
      normal.set(index + 2, vectorN.getVector());
    }
    // Lakukan kalkulasi normal disini.

    this.normal = normal;
  }
}

export { BufferGeometry };
