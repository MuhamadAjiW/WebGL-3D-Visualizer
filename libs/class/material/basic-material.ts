import { WebGLUtil } from "@/libs/util/webgl-util";
import { Color } from "../../base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  public static materialType: number = 0;
  private static idAutoIncrement: number = 0;

  public diffuse: Color = Color.WHITE;
  public diffuseTexture: Texture;

  constructor(options?: {
    texture?: Texture;
    color?: Color;
    normalTexture?: Texture;
    parallaxTexture?: Texture;
  }) {
    super(BasicMaterial.materialType, {
      normalTexture: options?.normalTexture,
      parallaxTexture: options?.parallaxTexture,
    });

    this.diffuse = options?.color || new Color(0xffffffff);
    this.diffuseTexture = options?.texture || new Texture();
  }

  public loadTexture(renderer: WebGLRenderer): void {
    this.normalTexture.load(renderer, 0);
    this.parallaxTexture.load(renderer, 1);
    this.diffuseTexture.load(renderer, 2);
  }

  public loadUniform(renderer: WebGLRenderer): void {
    WebGLUtil.setUniforms(renderer.currentProgram, {
      u_textureDiffuse: this.diffuseTexture.glTexture,
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
