import { Color } from "../../types/color";
import { Texture } from "../texture/texture";
import { TextureLoader } from "../texture/texture-loader";
import { ShaderMaterial } from "./shader-material";

export class BasicMaterial extends ShaderMaterial {
  constructor(options?: {
    color?: Color,
    texture?: Texture
  }){
    const savedTexture: Texture = options?.texture || TextureLoader.load();
    const color = options?.color || new Color(0xffffff);
    super(0, color, savedTexture);
  }

  // public load(){
  //   if(!this.texture.used) this.texture.use();
  //   const gl: WebGLRenderingContext = WebGLCanvas.instance.gl;
    
  //   gl.bindTexture(gl.TEXTURE_2D, this.texture.glTexture);
  //   const image: HTMLImageElement | null = this.texture.image;
  //   if(image){
  //     if(image.complete){
  //       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //     } else{
  //       image.onload = () => {
  //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //       }
  //     }
  //   } else{
  //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //       new Uint8Array(this.color.get()));
  //   }
  // }

  // TODO: Implement
  public toJson(): void {
    throw new Error("Method not implemented.");
  }
}