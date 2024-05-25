import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { ShaderMaterial } from "./shader-material";

export class PhongMaterial extends ShaderMaterial {
  public static materialType: number = 1;
  private static idAutoIncrement: number = 0;

  public ambientColor: Color = Color.WHITE;

  public diffuseColor: Color = Color.WHITE;
  public diffuseTexture: Texture;

  public specularColor: Color = Color.WHITE;
  public specularTexture: Texture;
  public shininess: number = 1.0;

  constructor(options?: {
    ambientColor?: Color;

    diffuseColor?: Color;
    diffuseTexture?: Texture;

    normalActive?: boolean;
    normalTexture?: Texture;

    parallaxActive?: boolean;
    parallaxTexture?: Texture;
    parallaxHeight?: number;

    displacementActive?: boolean;
    displacementTexture?: Texture;
    displacementHeight?: number;

    specularColor?: Color;
    specularTexture?: Texture;
    shinyness?: number;
  }) {
    super(PhongMaterial.materialType, {
      normalActive: options?.normalActive,
      normalTexture: options?.normalTexture,

      parallaxActive: options?.parallaxActive,
      parallaxTexture: options?.parallaxTexture,
      parallaxHeight: options?.parallaxHeight,

      displacementActive: options?.displacementActive,
      displacementTexture: options?.displacementTexture,
      displacementHeight: options?.displacementHeight,
    });

    this.ambientColor = options?.ambientColor || new Color(0xffffffff);
    this.diffuseColor = options?.diffuseColor || new Color(0xffffffff);
    this.specularColor = options?.specularColor || new Color(0xffffffff);
    this.shininess = options?.shinyness || 1;

    this.diffuseTexture = options?.diffuseTexture || new Texture();
    this.specularTexture = options?.specularTexture || new Texture();
  }

  public loadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.load(renderer, 0);

    this.parallaxTexture.format = WebGLRenderingContext.LUMINANCE;
    this.parallaxTexture.load(renderer, 1);

    this.displacementTexture.format = WebGLRenderingContext.LUMINANCE;
    this.displacementTexture.load(renderer, 2);

    this.diffuseTexture.load(renderer, 3);

    this.specularTexture.format = WebGLRenderingContext.LUMINANCE;
    this.specularTexture.load(renderer, 4);
  }
  public unloadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.unregister(renderer);
    this.parallaxTexture.unregister(renderer);
    this.displacementTexture.unregister(renderer);
    this.diffuseTexture.unregister(renderer);
    this.specularTexture.unregister(renderer);
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_materialType: this.materialType,

      u_ambientColor: this.ambientColor.getNormalized(),

      u_diffuseColor: this.diffuseColor.getNormalized(),
      u_diffuseTexture: this.diffuseTexture.get(renderer),

      u_normalActive: this.normalActive,
      u_normalTexture: this.normalTexture.get(renderer),

      u_parallaxActive: this.parallaxActive,
      u_parallaxTexture: this.parallaxTexture.get(renderer),
      u_parallaxHeight: this.parallaxHeight,

      u_displacementActive: this.displacementActive,
      u_displacementTexture: this.displacementTexture.get(renderer),
      u_displacementHeight: this.displacementHeight,

      u_specularTexture: this.specularTexture.get(renderer),
      u_specularColor: this.specularColor.getNormalized(),
      u_shininess: this.shininess,
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
      ambientColor: Color.fromJson(material.ambient),
      diffuseColor:
        Color.fromJson(material.diffuse) || Texture.fromJson(material.diffuse),
      specularColor:
        Color.fromJson(material.specular) ||
        Texture.fromJson(material.specular),
      shinyness: material.shinyness,
    });
  }
}
