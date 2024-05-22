import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";
import { VertexBuilder } from "./vertex-builder";

export class HollowPlaneGeometry extends BufferGeometry {
  type: number = 4; // Unique identifier for this geometry type
  width: number;
  height: number;

  constructor(width = 1, height = 1) {
    super();
    this.width = width;
    this.height = height;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const frameWidth = width / 8;
    const frameHeight = height / 8;

    // console.log(halfWidth);
    // console.log(halfHeight);
    // console.log(frameWidth);
    // console.log(frameHeight);

    const vertices = new Float32Array([
      // Outer frame - front face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        0,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        0,
        frameWidth,
        height,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        0,
        width,
        frameHeight,
        0,
        "yx"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        0,
        width,
        frameHeight,
        0,
        "yx"
      ),

      // Back Face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -0.1,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight,
        -0.1,
        frameWidth,
        height,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        -0.1,
        width,
        frameHeight,
        0,
        "xy"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight - frameHeight,
        -0.1,
        width,
        frameHeight,
        0,
        "xy"
      ),

      // Left face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        0,
        0.1,
        height,
        0.1,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        -halfHeight,
        -0.1,
        0.1,
        height,
        -0.1,
        "yz"
      ),

      // Right face
      ...VertexBuilder.generateRectangle(
        halfWidth,
        halfHeight,
        0,
        0.1,
        -height,
        0.1,
        "yz"
      ),
      ...VertexBuilder.generateRectangle(
        halfWidth - frameWidth,
        -halfHeight + height - frameHeight,
        -0.1,
        0.1,
        -height + 2 * frameHeight,
        -0.1,
        "yz"
      ),

      // Top face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        halfHeight,
        -0.1,
        width,
        1,
        -0.1,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth + frameWidth,
        halfHeight - frameHeight,
        0,
        width - 2 * frameWidth,
        0.1,
        0.1,
        "xz"
      ),

      // Bottom face
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight,
        0,
        width,
        0.1,
        0.1,
        "xz"
      ),
      ...VertexBuilder.generateRectangle(
        -halfWidth,
        -halfHeight + frameHeight,
        -0.1,
        width,
        1,
        -0.1,
        "xz"
      ),
    ]);

    const textureCoordinates = new Float32Array([
      0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0,
      1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1,
      1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1,
      1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1,
      0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0,
      1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1,
      0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0,
      0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0,
      0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1,
    ]);

    this.position = new BufferAttribute(vertices, 3);
    this.texCoords = new BufferAttribute(textureCoordinates, 2);
    this.calculateNormals();
  }
}
