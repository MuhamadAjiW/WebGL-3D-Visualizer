import M4 from "../base-types/m4";
import { ProgramInfo } from "../base-types/webgl-program-info";
import { WebGLUtil } from "../util/webgl-util";
import Camera from "./camera";
import { ShaderMaterial } from "./material/shader-material";
import { Mesh } from "./mesh";
import Object3D from "./object3d";
import { Scene } from "./scene";

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

    this.gl.enable(WebGLRenderingContext.CULL_FACE);
    this.gl.enable(WebGLRenderingContext.DEPTH_TEST);
  }

  clean() {
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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
      material.register(this);
      material.loadTexture(this);

      return materialStored;
    }

    if (materialStored.needsUpdate) {
      console.log("Refreshing materials");
      material.refreshTextures();
      materialStored.needsUpdate = false;
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

      node.load(this);
      node.material.loadUniform(this);

      // TODO: Use indices when drawing
      this.gl.drawArrays(this.gl.TRIANGLES, 0, node.geometry.position!.length);
    }

    node.children.forEach((child) => {
      if (!child.visible) return;
      this.renderNodes(child);
    });
  }

  public render(scene: Scene, camera: Camera) {
    this.clean();
    if (!scene.visible) {
      // console.log("Scene is not visible");
      return;
    }
    // console.log("Scene is visible");

    WebGLUtil.setUniforms(this.currentProgram, {
      u_projection: M4.flatten(camera.projectionMatrix),
      u_view: M4.flatten(camera.computeViewMatrix()),
      u_cameraPos: camera.position.getVector(),
    });

    if (scene instanceof Mesh) {
      //TODO: Optimize this call
      scene.computeWorldMatrix(false, false);

      this.createOrGetMaterial(scene.material);

      scene.load(this);
      scene.material.loadUniform(this);

      // TODO: Use indices when drawing
      this.gl.drawArrays(this.gl.TRIANGLES, 0, scene.geometry.position!.length);
    }

    scene.children.forEach((node) => {
      if (!node.visible) return;
      this.renderNodes(node);
    });
  }
}
