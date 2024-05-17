import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";
import { VertexBuilder } from "./vertex-builder";

export class BlockGeometry extends BufferGeometry {
  type: number = 0;
  width: number;
  height: number;
  length: number;

  constructor(width = 1, height = 1, length = 1) {
    super();
    this.width = width;
    this.height = height;
    this.length = length;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const halfLength = length / 2;

    const vertices = new Float32Array([
      // Front face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        width,
        height,
        length,
        "yx"
      ),

      // Bottom face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        width,
        height,
        length,
        "xz"
      ),

      // Top face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight,
        halfLength,
        width,
        height,
        length,
        "zx"
      ),

      // Back face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength,
        width,
        height,
        length,
        "xy"
      ),

      // Left face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        width,
        height,
        length,
        "yz"
      ),

      // Right face
      ...VertexBuilder.generateRectangle(
        halfWidth,
        -halfHeight,
        halfLength,
        width,
        height,
        length,
        "zy"
      ),
    ]);

    const textureCoordinates = new Float32Array([
      // Front face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,

      // Bottom face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,

      // Top face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,

      // Back face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,

      // Left Face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,

      // Right Face
      0, 1, 1, 1, 0, 0,

      1, 0, 0, 0, 1, 1,
    ]);

    this.position = new BufferAttribute(vertices, 3);
    this.texCoords = new BufferAttribute(textureCoordinates, 2);
    this.calculateNormals();
  }
}
