import { BlockGeometry } from "./block-geometry";

export class CubeGeometry extends BlockGeometry {
  constructor(size = 1) {
    super(size, size, size);
  }
}
