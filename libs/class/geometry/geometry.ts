import Vector3 from "@/libs/base-types/vector3";
import { BufferAttribute } from "../webgl/attribute";

class BufferGeometry {
  public type: number = 0;
  public position: BufferAttribute | undefined;
  public normal: BufferAttribute | undefined;
  public texCoords: BufferAttribute | undefined;
  public tangent: BufferAttribute | undefined;
  public bitangent: BufferAttribute | undefined;
  public width: number = 0;
  public height: number = 0;
  public length: number = 0;
  public smoothShade: boolean = false;

  calculateNormals(forceNewAttribute = false) {
    if (!this.smoothShade) {
      this.calculateNormalsFlat(forceNewAttribute);
    } else {
      console.log("Calculating Smooth shading normals");
      this.calculateNormalsSmooth(forceNewAttribute);
    }
  }

  calculateNormalsFlat(forceNewAttribute = false) {
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

    for (let index = 0; index < position.count; index += 3) {
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

    this.normal = normal;
  }

  calculateNormalsSmooth(forceNewAttribute = false) {
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

    this.calculateNormalsFlat();

    const vertices: Map<number, number[]> = new Map<number, number[]>();
    const vertexList: Vector3[] = [];
    const getIdx = (vector: Vector3) => {
      for (let i = 0; i < vertexList.length; i++) {
        const element = vertexList[i];
        if (element.equals(vector)) {
          return i;
        }
      }
      return -1;
    };

    for (let index = 0; index < position.count; index += 1) {
      const vertex = new Vector3(position.get(index));
      let idx = getIdx(vertex);
      if (idx == -1) {
        idx = vertexList.length;
        vertexList.push(vertex);
      }

      if (!vertices.has(idx)) {
        vertices.set(idx, []);
      }

      // console.log(idx);
      // console.log(vertices);
      // console.log(vertices.get(idx));

      vertices.get(idx)!.push(index);
    }

    vertices.forEach((val, key) => {
      let sum = new Vector3();

      val.forEach((vertNormal) => {
        sum.add(new Vector3(this.normal!.get(vertNormal)));
      });

      sum = sum.multiplyScalar(1 / sum.length());

      val.forEach((vertNormal) => {
        this.normal!.set(vertNormal, sum.getVector());
      });
    });
  }

  // Note: Calculate normal before calculate tangent
  calculateTangents(forceNewAttribute = false) {
    const position = this.position;
    const texCoords = this.texCoords;
    if (!position || !texCoords) {
      return;
    }

    let tangent = this.tangent;
    if (forceNewAttribute || !tangent) {
      tangent = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    let bitangent = this.bitangent;
    if (forceNewAttribute || !bitangent) {
      bitangent = new BufferAttribute(
        new Float32Array(position.length),
        position.size
      );
    }

    for (let index = 0; index < position.count; index += 3) {
      const vertex1 = new Vector3(position.get(index));
      const vertex2 = new Vector3(position.get(index + 1));
      const vertex3 = new Vector3(position.get(index + 2));
      const uv1 = new Vector3([...texCoords.get(index), 0]);
      const uv2 = new Vector3([...texCoords.get(index + 1), 0]);
      const uv3 = new Vector3([...texCoords.get(index + 2), 0]);

      const edge1 = vertex2.substract(vertex1);
      const edge2 = vertex3.substract(vertex1);
      const deltaUV1 = uv2.substract(uv1);
      const deltaUV2 = uv3.substract(uv1);

      const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);
      const tangent1 = new Vector3();
      tangent1.x = f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x);
      tangent1.y = f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y);
      tangent1.z = f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z);

      const bitangent1 = new Vector3();
      bitangent1.x = f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x);
      bitangent1.y = f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y);
      bitangent1.z = f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z);

      tangent.set(index, tangent1.getVector());
      tangent.set(index + 1, tangent1.getVector());
      tangent.set(index + 2, tangent1.getVector());

      bitangent.set(index, bitangent1.getVector());
      bitangent.set(index + 1, bitangent1.getVector());
      bitangent.set(index + 2, bitangent1.getVector());
    }

    this.tangent = tangent;
    this.bitangent = bitangent;
  }
}

export { BufferGeometry };
