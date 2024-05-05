import { Color } from "../../types/color";
import { Texture } from "../texture/texture";
import { BufferUniform } from "../webgl/uniform";

export abstract class ShaderMaterial {
  // TODO: Review this note, might be a better way to improve it
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.

  // This is internal and really should not be changed outside of texture or texture loader
  private static idAutoIncrement: number = 0;
  public readonly id: number;
  
  public materialType: number = 0;
  public color: Color = new Color(0xffffff);
  public texture: Texture;
  public isActive: boolean = false;
  private _uniforms: {[name: string]: BufferUniform};
  
  constructor(materialType: number, color: Color, texture: Texture){
    this._uniforms = {};
    this.id = ShaderMaterial.idAutoIncrement++;
    this.materialType = materialType;
    this.color = color;
    this.texture = texture;
  }

  get uniforms() {
    return this._uniforms;
  }

  setUniform(name: string, uniform: BufferUniform) {
    console.log(name, uniform)
    this._uniforms[name] = uniform;
    return this;
  }


  getUniform(name: string) {
    return this._uniforms[name];
  }


  deleteUniform(name: string) {
    delete this._uniforms[name];
    return this;
  }

  public abstract activate(): void;
  public abstract toJson() : void;
}