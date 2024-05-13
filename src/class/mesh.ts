import { BufferGeometry } from "./geometry/geometry";
import { ShaderMaterial } from "./material/shader-material";
import Object3D from "./object3d";

export class Mesh extends Object3D {
  geometry: BufferGeometry
  material: ShaderMaterial

  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }

  // TODO: Implement
  public fromJson(json: string): Mesh {
    throw new Error("Method not implemented.");
  }
  public toJson(mesh: Mesh): string {
    throw new Error("Method not implemented.");
  }
}
