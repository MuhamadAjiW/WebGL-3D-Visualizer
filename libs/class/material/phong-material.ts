import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { ShaderMaterial } from "./shader-material";

export class PhongMaterial extends ShaderMaterial {
  public static materialType: number = 1;
  private static idAutoIncrement: number = 0;

  public ambient: Color = Color.WHITE;
  public diffuse: Color = Color.WHITE;
  public specular: Color = Color.WHITE;
  public shininess: number = 1.0;

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
    this.shininess = options?.shinyness || 1;
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
        new Uint8Array(Color.WHITE.getNormalized())
      );
    }
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_ambient: this.ambient.getNormalized(),
      u_diffuse: this.diffuse.getNormalized(),
      u_specular: this.specular.getNormalized(),
      u_shininess: this.shininess,
      u_materialType: this.materialType,
    });
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
