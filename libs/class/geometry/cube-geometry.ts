import { BlockGeometry } from "./block-geometry";

export class CubeGeometry extends BlockGeometry {
  type: number = 1;
  constructor(size = 1) {
    super(size, size, size);
  }
}
