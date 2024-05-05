import { BufferGeometry } from "./geometry/geometry";
import { ShaderMaterial } from "./material/shader-material";
import Node from "./node";

export class Mesh extends Node {
  geometry: BufferGeometry
  material: ShaderMaterial

  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}
