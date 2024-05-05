import { Color } from "../../types/color";
import { Texture } from "../texture/texture";

export abstract class ShaderMaterial {
  public materialType: number = 0;
  public color: Color = new Color(0xffffff);
  public texture: Texture;
  
  constructor(materialType: number, color: Color, texture: Texture){
    this.materialType = materialType;
    this.color = color;
    this.texture = texture;
  }

  public abstract toJson() : void;
}