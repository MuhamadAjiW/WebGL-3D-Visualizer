import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { UniformKeys } from "../../base-types/webgl-keys";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  public static materialType: number = 0;
  private static idAutoIncrement: number = 0;

  public color: Color;

  constructor(options?: { texture?: Texture; color?: Color }) {
    super(BasicMaterial.materialType, options?.texture);
    this.color = options?.color || new Color(0xffffffff);

    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);
    if (!materialType) {
      materialType = new BufferUniform(this.materialType, 0);
    }
    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  public loadTo(renderer: WebGLRenderer): void {
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
        new Uint8Array(Color.WHITE.get())
      );
    }

    WebGLUtil.setUniform(
      renderer.currentProgram,
      UniformKeys.DIFFUSE,
      new BufferUniform(
        new Float32Array(this.color.get()),
        4,
        WebGLRenderingContext.FLOAT_VEC4
      )
    );
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
