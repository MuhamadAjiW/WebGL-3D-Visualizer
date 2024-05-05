import { Color } from "../../types/color";
import { UniformKeys } from "../../types/webgl-keys";
import { Texture } from "../texture/texture";
import { TextureLoader } from "../texture/texture-loader";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  constructor(options?: {
    color?: Color,
    texture?: Texture
  }){
    const savedTexture: Texture = options?.texture || TextureLoader.create();
    const color = options?.color || new Color(0xffffff);
    super(0, color, savedTexture);
  }

  public activate(): void {
    this.isActive = true;
   
    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);

    if(!materialType) {
      materialType = new BufferUniform(this.materialType, 1);
    }
    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  // TODO: Implement
  public toJson(): void {
    throw new Error("Method not implemented.");
  }
}