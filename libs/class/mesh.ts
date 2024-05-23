import M4 from "../base-types/m4";
import { WebGLUtil } from "../util/webgl-util";
import { BufferGeometry } from "./geometry/geometry";
import { ShaderMaterial } from "./material/shader-material";
import Object3D from "./object3d";
import { WebGLRenderer } from "./webgl-renderer";

export class Mesh extends Object3D {
  geometry: BufferGeometry;
  material: ShaderMaterial;

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

  load(renderer: WebGLRenderer) {
    WebGLUtil.setAttributes(renderer.currentProgram, {
      a_normal: this.geometry.normal,
      a_position: this.geometry.position,
      a_texCoord: this.geometry.texCoords,
      a_tangent: this.geometry.tangent,
      a_bitangent: this.geometry.bitangent,
    });
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_world: M4.flatten(this.worldMatrix),
      u_normalMat: M4.flatten(this.worldMatrix.inverse().transpose()),
    });
  }
}
