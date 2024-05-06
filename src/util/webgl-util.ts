import { Mesh } from "../class/mesh";
import Node from "../class/object3d";
import { Texture } from "../class/texture/texture";
import { AttributeKeys, UniformKeys } from "../base-types/webgl-keys";
import { ProgramInfo } from "../base-types/webgl-program-info";
import { setAttributes } from "../base-types/webgl-setters-attribute";
import { ShaderMaterial } from "../class/material/shader-material";
import { setUniforms } from "../base-types/webgl-setters-uniform";
import { BufferUniform } from "../class/webgl/uniform";
import { BufferAttribute } from "../class/webgl/attribute";
import Object3D from "../class/object3d";

export class WebGLUtil{
  public static createShader(gl: WebGLRenderingContext, shaderType: GLenum, source: string): WebGLShader{
    var shader: WebGLShader = gl.createShader(shaderType) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success){
      gl.deleteShader(shader);
      throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  public static createProgram(gl: WebGLRenderingContext, fragmentShader: WebGLShader, vertexShader: WebGLShader): WebGLProgram{
    var program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!success) {
      gl.deleteProgram(program);
      throw "program failed to link:" + gl.getProgramInfoLog (program);
    }

    return program;
  }

  // TODO: make this async;
  public static compile(gl: WebGLRenderingContext, programInfo: ProgramInfo, scene: Object3D){
    // TODO: process node, camera, light
    scene.traverse(scene);

    if(scene instanceof Mesh) {
      const material: ShaderMaterial = scene.material;
      const texture: Texture = scene.material.texture;
      
      if(!texture.isActive) {
        texture.activate();
        texture.glTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture.wrapT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.magFilter);
      }

      if(!material.isActive){
        material.activate();
        gl.bindTexture(gl.TEXTURE_2D, texture.glTexture);
        
        const image: HTMLImageElement | null = texture.image;
        
        if(image){
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        } else{
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(scene.material.color.get()));
        }
      }


    }

    scene.children.forEach(node => {
      // TODO: Only if isdirty
      this.compile(gl, programInfo, node);
    });
  }

  public static render(gl: WebGLRenderingContext, programInfo: ProgramInfo, scene: Object3D){
    // TODO: process node, camera, light
    scene.traverse(scene);

    if(scene instanceof Mesh){
      setAttributes(programInfo, scene.geometry.attributes);
      setUniforms(programInfo, scene.material.uniforms);

      // Use indices when drawing
      gl.drawArrays(
        gl.TRIANGLES, 
        0, 
        scene.geometry.getAttribute(AttributeKeys.POSITION).length
      );
    }

    scene.children.forEach(node => {
      // TODO: Only if isdirty
      this.render(gl, programInfo, node);
    });
  }

  //TODO: Review whether this is necessary or not
  public static clean(gl: WebGLRenderingContext, scene: Object3D){

  }
}