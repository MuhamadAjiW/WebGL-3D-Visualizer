import { AttributeKeys } from "../types/webgl-keys";
import { setAttributes } from "../types/webgl-setters-attribute";
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

  // public render(): void{
  //   const gl: WebGLRenderingContext = WebGLCanvas.instance.gl;
  //   this.material.load();

  //   //TODO: Indices and what kind of drawArrays should I use? I have no idea
  //   setAttributes(WebGLCanvas.instance.programInfo, this.geometry.attributes);
  //   gl.drawArrays(
  //     gl.TRIANGLES, 
  //     0, 
  //     this.geometry.getAttribute(AttributeKeys.POSITION).length
  //   );
  // }
}
