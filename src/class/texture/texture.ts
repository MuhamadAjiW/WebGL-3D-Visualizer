export class Texture{
  // Note: After the initial use of a texture, its dimensions, format, and type cannot be changed.
  // Instead, call .dispose() on the texture and instantiate a new one.

  // This is internal and really should not be changed outside of texture or texture loader
  private static idAutoIncrement: number = 0;
  public readonly id: number;
  
  // TODO: Review whether this is necessary or not
  public glTexture: WebGLTexture | undefined;
  public used: boolean;
  
  public name: string="";
  public wrapS: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public wrapT: GLenum = WebGLRenderingContext.CLAMP_TO_EDGE;
  public magFilter: GLenum = WebGLRenderingContext.LINEAR;
  public minFilter: GLenum = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
  public format: GLenum = WebGLRenderingContext.RGBA;
  public image: HTMLImageElement | null = null;
  public repeatS: number = 1;
  public repeatT: number = 1;

  constructor(options?: {
    image?: HTMLImageElement, 
    wrapS?: GLenum, 
    wrapT?: GLenum
    magFilter?: GLenum
    minFilter?: GLenum
  }){
    this.used = false;

    this.id = Texture.idAutoIncrement++;
    this.wrapS = options?.wrapS || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.wrapT = options?.wrapT || WebGLRenderingContext.CLAMP_TO_EDGE;
    this.magFilter = options?.magFilter || WebGLRenderingContext.LINEAR;
    this.minFilter = options?.minFilter || WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
    this.image = options?.image || null
  }

  public setRepeatT(t: number) : Texture{
    if(this.used == true){
      console.error("Texture already been used");
      return this;
    }

    this.wrapT = WebGLRenderingContext.REPEAT;
    this.repeatT = t;
    return this;
  }

  public setRepeatS(s: number) : Texture{
    if(this.used == true){
      console.error("Texture already been used");
      return this;
    }

    this.wrapS = WebGLRenderingContext.REPEAT;
    this.repeatT = s;
    return this;
  }

  public setOptions(options: {
    image?: HTMLImageElement, 
    wrapS?: GLenum, 
    wrapT?: GLenum
    magFilter?: GLenum
    minFilter?: GLenum
  }) : Texture{
    if(this.used == true){
      console.error("Texture already been used");
      return this;
    }
    
    this.wrapS = options.wrapS || this.wrapS;
    this.wrapT = options.wrapT || this.wrapT;
    this.magFilter = options.magFilter || this.magFilter;
    this.minFilter = options.minFilter || this.minFilter;
    this.image = options.image || this.image
    return this;
  }

  // public use(): Texture {
  //   if(this.used == true){
  //     console.error("Texture already been used");
  //     return this;
  //   }

  //   this.used = true;

  //   let gl: WebGLRenderingContext = WebGLCanvas.instance.gl;
    
  //   gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    
  //   return this;
  // }

  // public dispose() {
  //   if(this.used) {
  //     let gl: WebGLRenderingContext = WebGLCanvas.instance.gl;
  //     gl.deleteTexture(this.glTexture);
  //   } else{
  //     console.error("Tried deleting an unused texture")
  //   }
  // }

  //TODO: Implement
  public toJson(){
      throw new Error("not Implemented");
  }
}

// Should be inside material instead

// import { Color } from "../../types/color";

// class BasicMaterial extends ShaderMaterial {
//   public color: Color;
//   public imagePath: string;

//   constructor(color: Color=new Color(0xffffff), imagePath?: string){
//     super(0)
//     this.color = color;
//     this.imagePath = imagePath || "";
//   }


//   public render(gl: WebGLRenderingContext){
//     const image = new Image();
//     image.src = this.imagePath;
//     image.onload = function() {
//       let texture = gl.createTexture();
//       gl.bindTexture(gl.TEXTURE_2D, texture);

//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//       if(image)
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
//         new Uint8Array([0, 0, 255, 255]));
//     }
//   }
// }