import { Color } from "../../types/color";
import { UniformKeys } from "../../types/webgl-keys";
import { Texture } from "../texture/texture";
import { TextureLoader } from "../texture/texture-loader";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

class PhongMaterial extends ShaderMaterial {
  public shinyness: number = 1;
  public specularFactor: number = 1;
  
  constructor(options?: {
    color?: Color,
    shinyness?: number, 
    specularFactor?: number,
    texture?: Texture
  }){
    const savedTexture: Texture = options?.texture || TextureLoader.create();
    const color = options?.color || new Color(0xffffff);
    super(1, color, savedTexture);
    
    this.color = color;
    this.shinyness = options?.shinyness || 1;
    this.specularFactor = options?.specularFactor || 1;
  }

  public activate(): void {
    this.isActive = true;
   
    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);
    if(!materialType) {
      materialType = new BufferUniform(this.materialType, 1);
    }

    // TODO: Specular value?
    // let specular = this.getUniform(UniformKeys.SPECULAR);
    // if(!specular) {
    //   specular = new BufferUniform(this.materialType, 1);
    // }

    let specularFactor = this.getUniform(UniformKeys.SPECULAR_FACTOR);
    if(!specularFactor) {
      specularFactor = new BufferUniform(this.specularFactor, 1);
    }

    let shinyness = this.getUniform(UniformKeys.SHINYNESS);
    if(!shinyness) {
      shinyness = new BufferUniform(this.shinyness, 1);
    }

    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  // TODO: Implement
  public toJson(): void {
    throw new Error("Method not implemented.");
  }
}