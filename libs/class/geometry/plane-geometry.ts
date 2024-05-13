import { AttributeKeys } from "../../base-types/webgl-keys";
import { BufferAttribute } from "../webgl/attribute";
import { BufferGeometry } from "./geometry";

export class PlaneGeometry extends BufferGeometry {
  width: number;
  height: number;

  constructor(width = 1, height = 1) {
    super();
    this.width = width;
    this.height = height;
    const hw = width / 2,
      hh = height / 2;

    const vertices = new Float32Array([
      -hw,
      -hh,
      0,
      hw,
      -hh,
      0,
      hw,
      hh,
      0,
      -hw,
      hh,
      0,
      -hw,
      -hh,
      0,
      hw,
      hh,
      0,
    ]);
    this.setAttribute(AttributeKeys.POSITION, new BufferAttribute(vertices, 3));
    this.calculateNormals();
  }
}
