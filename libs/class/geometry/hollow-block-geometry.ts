import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";
import { VertexBuilder } from "./vertex-builder";

export class HollowBlockGeometry extends BufferGeometry {
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
    const frameWidth = width / 8;
    const frameHeight = height / 8;
    const frameLength = length / 8;

    const vertices = new Float32Array([
      // Front face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        halfLength,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        width,
        frameHeight,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        halfLength,
        width,
        frameHeight,
        0,
        "yx"
      ),
      // Back Front face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength + frameLength,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        -halfLength + frameLength,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength + frameLength,
        width,
        frameHeight,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        -halfLength + frameLength,
        width,
        frameHeight,
        0,
        "yx"
      ),

      // Bottom face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        width,
        0,
        frameLength,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength + frameLength,
        width,
        0,
        frameLength,
        "xz"
      ),
      // Top Bottom face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        halfHeight - frameHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        halfLength,
        width,
        0,
        frameLength,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        -halfLength + frameLength,
        width,
        0,
        frameLength,
        "xz"
      ),

      // Top face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        halfHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight,
        halfLength,
        width,
        0,
        frameLength,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight,
        -halfLength + frameLength,
        width,
        0,
        frameLength,
        "zx"
      ),
      // Bottom Top Face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight + frameHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight + frameHeight,
        halfLength,
        frameWidth,
        0,
        length,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight + frameHeight,
        halfLength,
        width,
        0,
        frameLength,
        "zx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight + frameHeight,
        -halfLength + frameLength,
        width,
        0,
        frameLength,
        "zx"
      ),

      // Back face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        -halfLength,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength,
        width,
        frameHeight,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        -halfLength,
        width,
        frameHeight,
        0,
        "xy"
      ),
      // Front Back face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength - frameLength,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        halfLength - frameLength,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength - frameLength,
        width,
        frameHeight,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        halfLength - frameLength,
        width,
        frameHeight,
        0,
        "xy"
      ),

      // Left face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        0,
        height,
        frameLength,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -halfLength + frameLength,
        0,
        height,
        frameLength,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "yz"
      ),
      // Right Left face
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        halfLength,
        0,
        height,
        frameLength,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        -halfLength + frameLength,
        0,
        height,
        frameLength,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        halfHeight - frameHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "yz"
      ),

      // Right face
      ...VertexBuilder.generateRectangle(
        halfWidth,
        -halfHeight,
        halfLength,
        0,
        height,
        frameLength,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth,
        -halfHeight,
        -halfLength + frameLength,
        0,
        height,
        frameLength,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth,
        -halfHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth,
        halfHeight - frameHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "zy"
      ),
      // Left Right face
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        -halfHeight,
        halfLength,
        0,
        height,
        frameLength,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        -halfHeight,
        -halfLength + frameLength,
        0,
        height,
        frameLength,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        -halfHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "zy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        halfHeight - frameHeight,
        halfLength,
        0,
        frameHeight,
        length,
        "zy"
      ),
    ]);

    const textureCoordinates = new Float32Array([
      // Front face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      // Bottom face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      // Top face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      // Back face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      // Left Face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      // Right Face
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,

      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,
    ]);

    this.position = new BufferAttribute(vertices, 3);
    this.texCoords = new BufferAttribute(textureCoordinates, 2);
    this.calculateNormals();
  }
}
