import './style.css'
import vertexShaderSource from "./shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "./shaders/fragment-shader.frag?raw";
import { ProgramInfo } from './types/webgl-program-info';
import { WebGLUtil } from './util/webgl-util';
import { createUniformSetters, setUniforms } from './types/webgl-setters-uniform';
import { createAttributeSetters, setAttributes } from './types/webgl-setters-attribute';
import { BufferAttribute } from './class/geometry';

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#webgl-canvas') as HTMLCanvasElement;
const gl: WebGLRenderingContext = canvas.getContext("webgl") as WebGLRenderingContext;

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

// // TODO: Delete, this is for testing purposes
const vertexShader = WebGLUtil.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = WebGLUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = WebGLUtil.createProgram(gl, vertexShader, fragmentShader);

let programInfo: ProgramInfo = {
  program: program,
  uniformSetters: createUniformSetters(gl, program),
  attributeSetters: createAttributeSetters(gl, program)
}

const dummyUniformsData = {
  u_projectionMatrix: new Float32Array(16),
  u_lightWorldPos: [1.0, 2.0, 3.0],
  u_world: new Float32Array(16),
  u_viewInverse: new Float32Array(16),
  u_worldInverseTranspose: new Float32Array(16),
  u_lightColor: [1.0, 1.0, 1.0, 1.0],
  u_ambient: [0.2, 0.2, 0.2, 1.0],
  u_diffuse: [0.5, 0.5, 0.5, 1.0],
  u_specular: [1.0, 1.0, 1.0, 1.0],
  u_shininess: 32.0,
  u_specularFactor: 0.5,
};

var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
]
const dummyAttributesData = {
  a_position: new BufferAttribute(
    new Float32Array(positions), 2, 
    {dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0} 
  ),
  a_normal: [
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ],
  a_texcoord: [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
  ],
};

setUniforms(programInfo, dummyUniformsData);
setAttributes(programInfo, dummyAttributesData);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

console.log(dummyUniformsData.u_world)
console.log(dummyUniformsData.u_projectionMatrix)
console.log(dummyAttributesData.a_position)

console.log("Finished");