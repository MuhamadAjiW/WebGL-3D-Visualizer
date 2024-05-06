import { BufferUniform } from "../webgl/uniform";

export abstract class ShaderMaterial {
  // TODO: Review this note, might be a better way to improve it
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.

  // This is internal and really should not be changed outside of texture or texture loader
  public id: string;  
  public materialType: number = 0;
  private _uniforms: {[name: string]: BufferUniform};
  
  constructor(materialType: number){
    this._uniforms = {};
    this.id = this.generateId();
    this.materialType = materialType;
  }

  get uniforms() {
    return this._uniforms;
  }

  setUniform(name: string, uniform: BufferUniform) {
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

  protected abstract generateId(): string;
  public abstract loadTo(gl: WebGLRenderingContext): void;
  public abstract toJson() : void;
  public abstract fromJson() : void;
}