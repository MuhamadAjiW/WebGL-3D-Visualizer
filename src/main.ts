import './style.css'
import vertexShaderSource from "./shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "./shaders/fragment-shader.frag?raw";
import { ProgramInfo } from './types/webgl-program-info';
import { WebGLUtil } from './util/webgl-util';
import { createUniformSetters, setUniforms } from './types/webgl-setters-uniform';
import { createAttributeSetters, setAttributes } from './types/webgl-setters-attribute';
import { BufferAttribute } from './class/webgl/attribute';
import { BufferUniform } from './class/webgl/uniform';
import { PlaneGeometry } from './class/geometry/plane-geometry';
import { Color } from './types/color';
import { Scene } from './class/scene';
import { Mesh } from './class/mesh';
import { Texture } from './class/texture/texture';
import { TextureLoader } from './class/texture/texture-loader';
import { BasicMaterial } from './class/material/basic-material';
import { AttributeKeys } from './types/webgl-keys';


const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#webgl-canvas') as HTMLCanvasElement;
const gl: WebGLRenderingContext = canvas.getContext("webgl") as WebGLRenderingContext;
const vertexShader = WebGLUtil.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = WebGLUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = WebGLUtil.createProgram(gl, vertexShader, fragmentShader);

let programInfo: ProgramInfo = {
  program: program,
  uniformSetters: createUniformSetters(gl, program),
  attributeSetters: createAttributeSetters(gl, program)
}

function adjustCanvas(){
  const dw = window.innerWidth - 10;
  const dh = window.innerHeight - 10;
  if(canvas.width !== dw || canvas.height !== dh){
    canvas.width = dw;
    canvas.height = dh;
    gl.viewport(0, 0, dw, dh);
  }
}

adjustCanvas();
window.addEventListener('resize', adjustCanvas);

// TODO: Delete, this is for testing purposes
const dummyUniformsData = {
  u_projectionMatrix: new BufferUniform(
    new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]),
    1, gl.FLOAT_MAT4
  ),
  u_world: new BufferUniform(
    new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 1
    ]),
    1, gl.FLOAT_MAT4
  ),
  u_lightWorldPos: new BufferUniform(
    new Float32Array([
      1, 0, 0
    ]),
    1, gl.FLOAT_VEC3
  ),
  u_viewInverse: new BufferUniform(
    new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]),
    1, gl.FLOAT_MAT4
  ),
  u_worldInverseTranspose: new BufferUniform(
    new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]),
    1, gl.FLOAT_MAT4
  ),
  u_lightColor: new BufferUniform(
    new Float32Array([
      1, 1, 1, 1
    ]),
    1, gl.FLOAT_VEC4
  ),
  u_ambient: new BufferUniform(
    new Float32Array([
      1, 1, 1, 1
    ]),
    1, gl.FLOAT_VEC4
  ),
  u_texture: new BufferUniform(
    new Float32Array([
      1, 1, 1, 1
    ]),
    1, gl.FLOAT_VEC4
  ),
  u_specular: new BufferUniform(
    new Float32Array([
      1, 1, 1, 1
    ]),
    1, gl.FLOAT_VEC4
  ),
  u_shininess: 32.0,
  u_specularFactor: 0.5,
};



const dummyAttributesData = {
  a_position: new BufferAttribute(
    new Float32Array([
      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
    ]), 3
  ),
  a_normal: new BufferAttribute(
    new Float32Array([
      -0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, -0.5, 0,
      -0.5, 0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
    ]), 3,
    {dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0} 
  ),

  // Note: 0,0 is top left
  a_texcoord: new BufferAttribute(
    new Float32Array([
      0, 1,
      0, 0,
      1, 1,
      0, 0,
      1, 0,
      1, 1,
    ]), 2,
    {dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0} 
  ),
};


gl.useProgram(program);

const scene = new Scene();
const geometry = new PlaneGeometry(1, 1);

geometry.setAttribute(AttributeKeys.POSITION, dummyAttributesData.a_position);
geometry.setAttribute(AttributeKeys.TEXTURE_COORDS, dummyAttributesData.a_texcoord);
geometry.setAttribute(AttributeKeys.NORMAL, dummyAttributesData.a_normal);

const texture = await TextureLoader.load("res/f-texture.png");
const material = new BasicMaterial({texture: texture});
const mesh = new Mesh(geometry, material);

scene.add(mesh);

setUniforms(programInfo, dummyUniformsData);
WebGLUtil.compile(gl, programInfo, scene);
WebGLUtil.render(gl, programInfo, scene);


// const plane = new PlaneGeometry(1, 1);
// setAttributes(programInfo, plane.attributes);
// setUniforms(programInfo, dummyUniformsData);

// const image = new Image();
// image.src = "res/f-texture.png";
// image.onload = function() {
//   // Create a texture
//   var texture = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_2D, texture);
  
//   // Set the parameters so we can render any size image.
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//   // Fill the texture with a 1x1 blue pixel.
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
//   console.log("image loaded")

//   setAttributes(programInfo, dummyAttributesData);
//   setUniforms(programInfo, dummyUniformsData);
  
//   gl.drawArrays(gl.TRIANGLES, 0, 6);
// }



console.log("Done");