import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  public static materialType: number = 0;
  private static idAutoIncrement: number = 0;

  public diffuseColor: Color = Color.WHITE;
  public diffuseTexture: Texture;

  constructor(options?: {
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
  }) {
    super(BasicMaterial.materialType, {
      normalActive: options?.normalActive,
      normalTexture: options?.normalTexture,

      parallaxActive: options?.parallaxActive,
      parallaxTexture: options?.parallaxTexture,
      parallaxHeight: options?.parallaxHeight,

      displacementActive: options?.displacementActive,
      displacementTexture: options?.displacementTexture,
      displacementHeight: options?.displacementHeight,
    });
    this.diffuseColor = options?.diffuseColor || new Color(0xffffffff);
    this.diffuseTexture = options?.diffuseTexture || new Texture();
  }

  public loadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.load(renderer, 0);

    this.parallaxTexture.format = WebGLRenderingContext.LUMINANCE;
    this.parallaxTexture.load(renderer, 1);

    this.displacementTexture.format = WebGLRenderingContext.LUMINANCE;
    this.displacementTexture.load(renderer, 2);

    this.diffuseTexture.load(renderer, 3);
  }
  public unloadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.unregister(renderer);
    this.parallaxTexture.unregister(renderer);
    this.displacementTexture.unregister(renderer);
    this.diffuseTexture.unregister(renderer);
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_materialType: this.materialType,

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
      diffuseColor: material.color,
    });
  }
}
