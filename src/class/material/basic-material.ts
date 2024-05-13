import { Color } from "../../base-types/color";
import { UniformKeys } from "../../base-types/webgl-keys";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  public static materialType: number = 0;
  private static idAutoIncrement: number = 0;

  public color: Color;

  constructor(options?: {
    color?: Color,
  }){
    super(BasicMaterial.materialType);
    this.color = options?.color || new Color(0xffffffff);

    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);
    if(!materialType) {
      materialType = new BufferUniform(this.materialType, 0);
    }
    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  public loadTo(gl: WebGLRenderingContext): void {
    let basicTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, basicTexture);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array(this.color.get()));
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
      color: material.color
    })
  }
}