import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";

export class BlockGeometry extends BufferGeometry {
  width: number;
  height: number;
  length: number;

  constructor(width=1, height=1, length=1) {
    super();
    this.width = width;
    this.height = height;
    this.length = length;
    const halfWidth = width/2
    const halfHeight = height/2
    const halfLength = length/2

    const vertices = new Float32Array([
      // Front face
      -halfWidth, -halfHeight, halfLength,
      halfWidth,  -halfHeight, halfLength,
      -halfWidth, halfHeight, halfLength,
      
      halfWidth, halfHeight, halfLength,
      -halfWidth,  halfHeight, halfLength,
      halfWidth, -halfHeight, halfLength,
      
      // Bottom face
      -halfWidth, -halfHeight, -halfLength,
      halfWidth, -halfHeight,  -halfLength,
      -halfWidth, -halfHeight, halfLength,
      
      halfWidth, -halfHeight, halfLength,
      -halfWidth, -halfHeight,  halfLength,
      halfWidth, -halfHeight, -halfLength,

      // Top face
      -halfWidth, halfHeight, halfLength,
      halfWidth, halfHeight, halfLength,
      -halfWidth, halfHeight, -halfLength,

      halfWidth, halfHeight, -halfLength,
      -halfWidth, halfHeight, -halfLength,
      halfWidth, halfHeight, halfLength,

      // Back face
      halfWidth,  -halfHeight, -halfLength,
      -halfWidth, -halfHeight, -halfLength,
      halfWidth, halfHeight, -halfLength,
      
      -halfWidth, halfHeight, -halfLength,
      halfWidth,  halfHeight, -halfLength,
      -halfWidth, -halfHeight, -halfLength,

      // Left face
      -halfWidth,  -halfHeight, -halfLength,
      -halfWidth, -halfHeight, halfLength,
      -halfWidth, halfHeight, -halfLength,
      
      -halfWidth, halfHeight, halfLength,
      -halfWidth,  halfHeight, -halfLength,
      -halfWidth, -halfHeight, halfLength,

      // Right face
      halfWidth,  -halfHeight, halfLength,
      halfWidth, -halfHeight, -halfLength,
      halfWidth, halfHeight, halfLength,
      
      halfWidth, halfHeight, -halfLength,
      halfWidth, halfHeight, halfLength,
      halfWidth, -halfHeight, -halfLength,
    ]);

    const textureCoordinates = new Float32Array([
      // Front face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,
      
      // Bottom face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,

      // Top face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,

      // Back face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,

      // Left Face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,

      // Right Face
      0, 1,
      1, 1,
      0, 0,

      1, 0,
      0, 0,
      1, 1,
    ]);

    this.setAttribute(AttributeKeys.POSITION, new BufferAttribute(vertices, 3));
    this.setAttribute(AttributeKeys.TEXTURE_COORDS, new BufferAttribute(textureCoordinates, 2));
    this.calculateNormals();
  }
}
