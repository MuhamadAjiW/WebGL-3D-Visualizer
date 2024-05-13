import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";

export class CubeGeometry extends BufferGeometry {
  size: number;

  constructor(size=1) {
    super();
    this.size = size;
    const halfsize = size/2

    const vertices = new Float32Array([
      // Front face
      -halfsize, -halfsize, 0,
      -halfsize, halfsize, 0,
      halfsize,  -halfsize, 0,
      
      -halfsize,  halfsize, 0,
      halfsize, halfsize, 0,
      halfsize, -halfsize, 0
      
      // Right face
      // -halfsize, 0, -halfsize,
      // -halfsize, 0, halfsize,
      // halfsize, 0,  -halfsize,
      
      // -halfsize, 0,  halfsize,
      // halfsize, 0, halfsize,
      // halfsize, 0, -halfsize,
    ]);

    const textureCoordinates = new Float32Array([
      // Front face
      0, 1,
      0, 0,
      1, 1,

      0, 0,
      1, 0,
      1, 1,
      
      // Right face
      // 0, 1,
      // 0, 0,
      // 1, 1,

      // 0, 0,
      // 1, 0,
      // 1, 1,
      
    ]);

    this.setAttribute(AttributeKeys.POSITION, new BufferAttribute(vertices, 3));
    this.setAttribute(AttributeKeys.TEXTURE_COORDS, new BufferAttribute(textureCoordinates, 2));
    this.calculateNormals();
  }
}
