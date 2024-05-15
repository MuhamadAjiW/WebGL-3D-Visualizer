import M4 from "../base-types/m4";
import { AttributeKeys, UniformKeys } from "../base-types/webgl-keys";
import { ProgramInfo } from "../base-types/webgl-program-info";
import { WebGLUtil } from "../util/webgl-util";
import Camera from "./camera";
import { ShaderMaterial } from "./material/shader-material";
import { Mesh } from "./mesh";
import Object3D from "./object3d";
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
      material.loadTo(this);

      return materialStored;
    }

    return materialStored;
  }

  public render(scene: Object3D, camera: Camera) {
    // TODO: Only render when dirty
    // TODO: process node, camera, light
    scene.traverse(scene);

    if (scene instanceof Mesh) {
      //TODO: Optimize this call
      scene.computeWorldMatrix(false, false);

      this.createOrGetMaterial(scene.material);

      WebGLUtil.setAttributes(this.currentProgram, scene.geometry.attributes);
      WebGLUtil.setUniforms(this.currentProgram, scene.material.uniforms);

      WebGLUtil.setUniform(
        this.currentProgram,
        UniformKeys.PROJECTION_MATRIX,
        new BufferUniform(
          new Float32Array(M4.flatten(camera.projectionMatrix)),
          16,
          WebGLRenderingContext.FLOAT_MAT4
        )
      );
      WebGLUtil.setUniform(
        this.currentProgram,
        UniformKeys.VIEW_MATRIX,
        new BufferUniform(
          new Float32Array(M4.flatten(camera.computeViewMatrix())),
          16,
          WebGLRenderingContext.FLOAT_MAT4
        )
      );

      WebGLUtil.setUniform(
        this.currentProgram,
        UniformKeys.WORLD_MATRIX,
        new BufferUniform(
          new Float32Array(M4.flatten(scene.worldMatrix)),
          16,
          WebGLRenderingContext.FLOAT_MAT4
        )
      );
      WebGLUtil.setUniform(
        this.currentProgram,
        UniformKeys.NORMAL_MATRIX,
        new BufferUniform(
          new Float32Array(M4.flatten(scene.worldMatrix.inverse().transpose())),
          16,
          WebGLRenderingContext.FLOAT_MAT4
        )
      );

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
