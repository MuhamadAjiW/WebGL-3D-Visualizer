import { Color } from "../../base-types/color";
import { UniformKeys } from "../../base-types/webgl-keys";
import { Texture } from "../texture/texture";
import { BufferUniform } from "../webgl/uniform";
import { ShaderMaterial } from "./shader-material";

export class PhongMaterial extends ShaderMaterial {
  public static materialType: number = 1;
  private static idAutoIncrement: number = 0;
  
  private _ambient: Color = new Color(0xffffff);
  private _diffuse: Color | Texture = new Color(0xffffff);
  public _specular: Color | Texture = new Color(0xffffff);
  private _shinyness: number = 1;
  private _specularFactor: number = 1;
  
  constructor(options?: {
    ambient?: Color,
    diffuse?: Color | Texture
    specular?: Color | Texture
    shinyness?: number, 
    specularFactor?: number,
  }){
    super(PhongMaterial.materialType);

    this.ambient = options?.ambient || new Color(0xffffffff);
    this.diffuse = options?.diffuse || new Color(0xffffffff);
    this.specular = options?.specular || new Color(0xffffffff);
    this.shinyness = options?.shinyness || 1;
    this.specularFactor = options?.specularFactor || 1;

    let materialType = this.getUniform(UniformKeys.MATERIAL_TYPE);
    if(!materialType) {
      materialType = new BufferUniform(this.materialType, 1, WebGLRenderingContext.FLOAT);
    }
    this.setUniform(UniformKeys.MATERIAL_TYPE, materialType);
  }

  get ambient(): Color {
    return this._ambient;
  }

  set ambient(ambient: Color) {
    const colors = ambient.get();
    this._ambient = new Color(colors[0]/255 , colors[1]/255, colors[2]/255, colors[3]/255);

    let u_ambient = this.getUniform(UniformKeys.AMBIENT);
    if(!u_ambient) {
      u_ambient = new BufferUniform(new Float32Array(this._ambient.get()), 4, WebGLRenderingContext.FLOAT_VEC4);
    }
    this.setUniform(UniformKeys.AMBIENT, u_ambient);
  }

  get diffuse(): Color | Texture {
    return this._diffuse;
  }

  set diffuse(diffuse: Color | Texture) {
    this._diffuse = diffuse;
  }

  get specular(): Color | Texture {
    return this._specular;
  }

  set specular(specular: Color | Texture) {
    this._specular = specular;
  }

  get specularFactor(): number{
    return this._specularFactor;
  }

  set specularFactor(specularFactor: number) {
    this._specularFactor = specularFactor;

    let u_specularFactor = this.getUniform(UniformKeys.SPECULAR_FACTOR);
    if(!u_specularFactor) {
      u_specularFactor = new BufferUniform(specularFactor, 1, WebGLRenderingContext.FLOAT);
    }
    this.setUniform(UniformKeys.SPECULAR_FACTOR, u_specularFactor);
  }

  get shinyness(): number{
    return this._shinyness;
  }

  set shinyness(shinyness: number) {
    this._shinyness = shinyness;

    let u_shinyness = this.getUniform(UniformKeys.SHINYNESS);
    if(!u_shinyness) {
      u_shinyness = new BufferUniform(shinyness, 1, WebGLRenderingContext.FLOAT);
    }
    this.setUniform(UniformKeys.SHINYNESS, u_shinyness);
  }

  public loadTo(gl: WebGLRenderingContext): void {
    let diffuse = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, diffuse);

    if(this.diffuse instanceof Texture){
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.diffuse.wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.diffuse.wrapT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.diffuse.minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.diffuse.magFilter);
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this.diffuse.image);
    } else{
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array(this.diffuse.get()));
    }

    let specular = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, specular);

    if(this.specular instanceof Texture){
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.specular.wrapS);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.specular.wrapT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.specular.minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.specular.magFilter);
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, this.specular.image);
    } else{
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array(this.specular.get()));
    }
  }

  protected override generateId(): string {
    return "phong_" + PhongMaterial.idAutoIncrement++;
  }

  // TODO: Implement
  public toJson(): void {
    throw new Error("Method not implemented.");
  }
  public fromJson(): void {
    throw new Error("Method not implemented.");
  }
}