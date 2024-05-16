import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  public static materialType: number = 0;
  private static idAutoIncrement: number = 0;

  public diffuse: Color = Color.WHITE;

  constructor(options?: { texture?: Texture; color?: Color }) {
    super(BasicMaterial.materialType, options?.texture);
    this.diffuse = options?.color || new Color(0xffffffff);
  }

  public loadTexture(renderer: WebGLRenderer): void {
    let loadedTexture = renderer.gl.createTexture();
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, loadedTexture);

    if (this.texture?.image != null) {
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_WRAP_S,
        this.texture.wrapS
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_WRAP_T,
        this.texture.wrapT
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_MIN_FILTER,
        this.texture.minFilter
      );
      renderer.gl.texParameteri(
        renderer.gl.TEXTURE_2D,
        renderer.gl.TEXTURE_MAG_FILTER,
        this.texture.magFilter
      );

      renderer.gl.texImage2D(
        renderer.gl.TEXTURE_2D,
        0,
        renderer.gl.RGBA,
        renderer.gl.RGBA,
        renderer.gl.UNSIGNED_BYTE,
        this.texture?.image
      );
    } else {
      renderer.gl.texImage2D(
        renderer.gl.TEXTURE_2D,
        0,
        renderer.gl.RGBA,
        1,
        1,
        0,
        renderer.gl.RGBA,
        renderer.gl.UNSIGNED_BYTE,
        new Uint8Array(Color.BLACK.get())
      );
    }
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_diffuse: this.diffuse.getNormalized(),
      u_materialType: this.materialType,
    });
  }

  protected override generateId(): string {
    return "basic_" + BasicMaterial.idAutoIncrement++;
  }

  // TODO: Implement
  public toJson(): string {
    throw new Error("Method not implemented.");
  }
  public static fromJson(json: string): BasicMaterial {
    const material = JSON.parse(json);
    return new BasicMaterial({
      color: material.color,
    });
  }
}
