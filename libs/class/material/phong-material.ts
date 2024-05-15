import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { UniformKeys } from "../../base-types/webgl-keys";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class PhongMaterial extends ShaderMaterial {
  public static materialType: number = 1;
  private static idAutoIncrement: number = 0;

  private _ambient: Color = new Color(0xffffff);
  private _diffuse: Color = new Color(0xffffff);
  public _specular: Color = new Color(0xffffff);
  private _shinyness: number = 1;

  constructor(options?: {
    texture?: Texture;
    ambient?: Color;
    diffuse?: Color;
    specular?: Color;
    shinyness?: number;
  }) {
    super(PhongMaterial.materialType, options?.texture);

    this.ambient = options?.ambient || new Color(0xffffffff);
    this.diffuse = options?.diffuse || new Color(0xffffffff);
    this.specular = options?.specular || new Color(0xffffffff);
    this.shinyness = options?.shinyness || 1;

    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);
    if (!materialType) {
      materialType = new BufferUniform(
        this.materialType,
        1,
        WebGLRenderingContext.FLOAT
      );
    }
    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  get ambient(): Color {
    return this._ambient;
  }

  set ambient(ambient: Color) {
    this._ambient = ambient;
  }

  get diffuse(): Color {
    return this._diffuse;
  }

  set diffuse(diffuse: Color) {
    this._diffuse = diffuse;
  }

  get specular(): Color {
    return this._specular;
  }

  set specular(specular: Color) {
    this._specular = specular;
  }

  get shinyness(): number {
    return this._shinyness;
  }

  set shinyness(shinyness: number) {
    this._shinyness = shinyness;

    let u_shinyness = this.getUniform(UniformKeys.SHINYNESS);
    if (!u_shinyness) {
      u_shinyness = new BufferUniform(
        shinyness,
        1,
        WebGLRenderingContext.FLOAT
      );
    }
    this.setUniform(UniformKeys.SHINYNESS, u_shinyness);
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
        new Uint8Array(Color.WHITE.getNormalized())
      );
    }

    WebGLUtil.setUniform(
      renderer.currentProgram,
      UniformKeys.AMBIENT,
      new BufferUniform(
        new Float32Array(this.ambient.getNormalized()),
        4,
        WebGLRenderingContext.FLOAT_VEC4
      )
    );
    WebGLUtil.setUniform(
      renderer.currentProgram,
      UniformKeys.DIFFUSE,
      new BufferUniform(
        new Float32Array(this.diffuse.getNormalized()),
        4,
        WebGLRenderingContext.FLOAT_VEC4
      )
    );
    WebGLUtil.setUniform(
      renderer.currentProgram,
      UniformKeys.SPECULAR,
      new BufferUniform(
        new Float32Array(this.specular.getNormalized()),
        4,
        WebGLRenderingContext.FLOAT_VEC4
      )
    );
  }

  protected override generateId(): string {
    return "phong_" + PhongMaterial.idAutoIncrement++;
  }

  // TODO: Implement
  public toJson(): string {
    throw new Error("Method not implemented.");
  }
  public static fromJson(json: string): ShaderMaterial {
    const material = JSON.parse(json);
    return new PhongMaterial({
      ambient: Color.fromJson(material.ambient),
      diffuse:
        Color.fromJson(material.diffuse) || Texture.fromJson(material.diffuse),
      specular:
        Color.fromJson(material.specular) ||
        Texture.fromJson(material.specular),
      shinyness: material.shinyness,
    });
  }
}
