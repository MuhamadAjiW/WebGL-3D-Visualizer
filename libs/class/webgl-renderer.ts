import { AttributeKeys, UniformKeys } from "../base-types/webgl-keys";
import { ProgramInfo } from "../base-types/webgl-program-info";
import { WebGLUtil as WebGLUtils } from "../util/webgl-util";
import { ShaderMaterial } from "./material/shader-material";
import { Mesh } from "./mesh";
import Object3D from "./object3d";

export class WebGLRenderer {
  public canvas: HTMLCanvasElement;
  public gl: WebGLRenderingContext;
  public shaderCache: { programInfo: string };
  public currentProgram: ProgramInfo;
  private materials: Map<string, ShaderMaterial> = new Map<
    string,
    ShaderMaterial
  >();

  constructor(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    shaderCache: { programInfo: string },
    currentProgram: ProgramInfo
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.shaderCache = shaderCache;
    this.currentProgram = currentProgram;

    this.adjustCanvas();
    window.addEventListener("resize", this.adjustCanvas);
  }

  setViewport(x: number, y: number, width: number, height: number) {
    this.gl.viewport(x, y, width, height);
  }

  setProgramInfo(programInfo: ProgramInfo) {
    this.currentProgram = programInfo;
  }

  adjustCanvas() {
    const dw = window.innerWidth - 10;
    const dh = window.innerHeight - 10;
    if (
      this.canvas &&
      (this.canvas.width !== dw || this.canvas.height !== dh)
    ) {
      this.canvas.width = dw;
      this.canvas.height = dh;
      this.setViewport(0, 0, dw, dh);
    }
  }

  createOrGetMaterial(material: ShaderMaterial) {
    let materialStored = this.materials.get(material.id);

    if (!materialStored) {
      this.materials.set(material.id, material);
      material.loadTo(this.gl);

      return materialStored;
    }

    return materialStored;
  }

  public render(scene: Object3D, camera: any) {
    console.log("Rendering");

    // TODO: process node, camera, light
    scene.traverse(scene);

    if (scene instanceof Mesh) {
      this.createOrGetMaterial(scene.material);

      WebGLUtils.setAttributes(this.currentProgram, scene.geometry.attributes);
      WebGLUtils.setUniforms(this.currentProgram, scene.material.uniforms);

      // TODO: Use indices when drawing
      this.gl.drawArrays(
        this.gl.TRIANGLES,
        0,
        scene.geometry.getAttribute(AttributeKeys.POSITION).length
      );
    }

    scene.children.forEach((node) => {
      // TODO: Only if isdirty
      this.render(node, camera);
    });
  }
}
