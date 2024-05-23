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
  public diffuseTexture: Texture;
  public specularTexture: Texture;

  constructor(options?: {
    diffuseTexture?: Texture;
    specularTexture?: Texture;
    ambient?: Color;
    diffuse?: Color;
    specular?: Color;
    shinyness?: number;
    normalTexture?: Texture;
    parallaxTexture?: Texture;
  }) {
    super(PhongMaterial.materialType, {
      normalTexture: options?.normalTexture,
      parallaxTexture: options?.parallaxTexture,
    });

    this.ambient = options?.ambient || new Color(0xffffffff);
    this.diffuse = options?.diffuse || new Color(0xffffffff);
    this.specular = options?.specular || new Color(0xffffffff);
    this.shininess = options?.shinyness || 1;

    this.diffuseTexture = options?.diffuseTexture || new Texture();
    this.specularTexture = options?.specularTexture || new Texture();
  }

  public loadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.load(renderer, 0);
    this.parallaxTexture.load(renderer, 1);
    this.diffuseTexture.load(renderer, 2);
    this.specularTexture.format = WebGLRenderingContext.LUMINANCE;
    this.specularTexture.load(renderer, 3);
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_textureNormal: this.normalTexture.glTexture,
      u_textureDiffuse: this.diffuseTexture.glTexture,
      u_textureSpecular: this.specularTexture.glTexture,
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
