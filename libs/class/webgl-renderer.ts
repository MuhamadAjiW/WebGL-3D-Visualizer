import M4 from "../base-types/m4";
import { ProgramInfo } from "../base-types/webgl-program-info";
import { WebGLUtil } from "../util/webgl-util";
import Camera from "./camera";
import { ShaderMaterial } from "./material/shader-material";
import { Mesh } from "./mesh";
import Object3D from "./object3d";
import { Scene } from "./scene";
import { BufferUniform } from "./webgl/uniform";

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

    // TODO: Review for hollow objects
    this.gl.enable(WebGLRenderingContext.CULL_FACE);
    this.gl.enable(WebGLRenderingContext.DEPTH_TEST);
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
      material.loadTexture(this);

      return materialStored;
    }

    return materialStored;
  }

  public renderNodes(node: Object3D) {
    // TODO: Only render when dirty
    // TODO: process node, camera, light

    if (node instanceof Mesh) {
      //TODO: Optimize this call
      node.computeWorldMatrix(false, false);

      this.createOrGetMaterial(node.material);

      WebGLUtil.setAttributes(this.currentProgram, {
        a_normal: node.geometry.normal,
        a_position: node.geometry.position,
        a_texCoord: node.geometry.texCoords,
      });
      WebGLUtil.setUniforms(this.currentProgram, {
        u_world: M4.flatten(node.worldMatrix),
        u_normalMat: M4.flatten(node.worldMatrix.inverse().transpose()),
        u_ambient: node.material.ambient.getNormalized(),
        u_diffuse: node.material.diffuse.getNormalized(),
        u_specular: node.material.specular.getNormalized(),
        u_shininess: node.material.shininess,
        u_materialType: node.material.materialType,
      });

      console.log(node.name);
      console.log(node);

      // TODO: Use indices when drawing
      this.gl.drawArrays(this.gl.TRIANGLES, 0, node.geometry.position!.length);
    }

    node.children.forEach((child) => {
      this.renderNodes(child);
    });
  }

  public render(scene: Scene, camera: Camera) {
    WebGLUtil.setUniforms(this.currentProgram, {
      u_projection: M4.flatten(camera.projectionMatrix),
      u_view: M4.flatten(camera.computeViewMatrix()),
    });

    scene.children.forEach((node) => {
      this.renderNodes(node);
    });
  }
}
