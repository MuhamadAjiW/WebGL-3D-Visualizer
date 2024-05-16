import { Color } from "@/libs/base-types/color";
import { Texture } from "../texture/texture";
import { WebGLRenderer } from "../webgl-renderer";
import { BufferUniform } from "../webgl/uniform";
import { BasicMaterial } from "./basic-material";
import { PhongMaterial } from "./phong-material";

export abstract class ShaderMaterial {
  // TODO: Review this note, might be a better way to improve it
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.

  // This is internal and really should not be changed outside of texture or texture loader
  public id: string;
  public materialType: number = 0;
  public texture: Texture | undefined = undefined;

  constructor(materialType: number, texture?: Texture) {
    this.id = this.generateId();
    this.materialType = materialType;
    this.texture = texture;
  }
  protected abstract generateId(): string;
  public abstract loadTexture(renderer: WebGLRenderer): void;
  public abstract loadUniform(renderer: WebGLRenderer): void;
  public abstract toJson(): string;

  // public static fromJson(json: string) : ShaderMaterial{
  //   const material = JSON.parse(json);
  //   switch (material.materialType) {
  //     case 0:
  //       return BasicMaterial.fromJson(json);

  //     case 1:
  //       return PhongMaterial.fromJson(json);

  //     default:
  //       throw new Error("Invalid material type index method not implemented");
  //   }
  // };
}
