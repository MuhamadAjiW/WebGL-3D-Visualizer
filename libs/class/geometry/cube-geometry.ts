import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";
import { BlockGeometry } from "./block-geometry";

export class CubeGeometry extends BlockGeometry {
  constructor(size=1) {
    super(size, size, size);
  }
}
