import "./style.css";
import vertexShaderSource from "./shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "./shaders/fragment-shader.frag?raw";
import { ProgramInfo } from "./base-types/webgl-program-info";
import { WebGLUtil } from "./util/webgl-util";
import {
  createUniformSetters,
  setUniforms,
} from "./base-types/webgl-setters-uniform";
import {
  createAttributeSetters,
  setAttributes,
} from "./base-types/webgl-setters-attribute";
import { BufferAttribute } from "./class/geometry";
import { BufferUniform } from "./class/uniform";

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>(
  "#webgl-canvas"
) as HTMLCanvasElement;
const gl: WebGLRenderingContext = canvas.getContext(
  "webgl"
) as WebGLRenderingContext;

function adjustCanvas() {
  const dw = window.innerWidth - 10;
  const dh = window.innerHeight - 10;
  if (canvas.width !== dw || canvas.height !== dh) {
    canvas.width = dw;
    canvas.height = dh;
    gl.viewport(0, 0, dw, dh);
  }
}

adjustCanvas();
window.addEventListener("resize", adjustCanvas);

const vertexShader = WebGLUtil.createShader(
  gl,
  gl.VERTEX_SHADER,
  vertexShaderSource
);
const fragmentShader = WebGLUtil.createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);
const program = WebGLUtil.createProgram(gl, vertexShader, fragmentShader);

let programInfo: ProgramInfo = {
  program: program,
  uniformSetters: createUniformSetters(gl, program),
  attributeSetters: createAttributeSetters(gl, program),
};

// TODO: Delete, this is for testing purposes
const dummyUniformsData = {
  u_projectionMatrix: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  u_world: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  u_lightWorldPos: new BufferUniform(
    new Float32Array([1, 0, 0]),
    1,
    gl.FLOAT_VEC3
  ),
  u_viewInverse: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  u_worldInverseTranspose: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  u_lightColor: new BufferUniform(
    new Float32Array([1, 1, 1, 1]),
    1,
    gl.FLOAT_VEC4
  ),
  u_ambient: new BufferUniform(
    new Float32Array([1, 1, 1, 1]),
    1,
    gl.FLOAT_VEC4
  ),
  u_diffuse: new BufferUniform(
    new Float32Array([1, 1, 1, 1]),
    1,
    gl.FLOAT_VEC4
  ),
  u_specular: new BufferUniform(
    new Float32Array([1, 1, 1, 1]),
    1,
    gl.FLOAT_VEC4
  ),
  u_shininess: 32.0,
  u_specularFactor: 0.5,
};

const dummyAttributesData = {
  a_position: new BufferAttribute(
    new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0.5, 1, 0, 1, 0.5, 1, 0, 1]),
    4,
    { dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0 }
  ),
  a_normal: new BufferAttribute(
    new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0.5, 1, 0, 1, 0.5, 1, 0, 1]),
    4,
    { dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0 }
  ),
  a_texcoord: new BufferAttribute(
    new Float32Array([0, 0, 0, 1, 1, 0, 0, 1, 0.5, 1, 0, 1, 0.5, 1, 0, 1]),
    4,
    { dtype: gl.FLOAT, normalize: false, stride: 0, offset: 0 }
  ),
};

gl.useProgram(program);
setAttributes(programInfo, dummyAttributesData);
setUniforms(programInfo, dummyUniformsData);

gl.drawArrays(gl.TRIANGLES, 0, 3);

console.log("Done");
