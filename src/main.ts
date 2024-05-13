import "./style.css";
import vertexShaderSource from "./shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "./shaders/fragment-shader.frag?raw";
import { ProgramInfo } from './base-types/webgl-program-info';
import { WebGLUtil as WebGLUtils } from './util/webgl-util';
import { BufferAttribute } from './class/webgl/attribute';
import { BufferUniform } from './class/webgl/uniform';
import { PlaneGeometry } from './class/geometry/plane-geometry';
import { Color } from './base-types/color';
import { Scene } from './class/scene';
import { Mesh } from './class/mesh';
import { TextureLoader } from './class/texture/texture-loader';
import { AttributeKeys, UniformKeys } from './base-types/webgl-keys';
import { WebGLRenderer } from "./class/webgl-renderer";
import { PhongMaterial } from "./class/material/phong-material";
// import { BasicMaterial } from "./class/material/basic-material";

const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#webgl-canvas') as HTMLCanvasElement;
const gl: WebGLRenderingContext = canvas.getContext("webgl") as WebGLRenderingContext;
const vertexShader = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader);

const programInfo: ProgramInfo = {
  program: program,
  uniformSetters: WebGLUtils.createUniformSetters(gl, program),
  attributeSetters: WebGLUtils.createAttributeSetters(gl, program)
}

const renderer: WebGLRenderer = new WebGLRenderer(canvas, gl, { programInfo: ""}, programInfo);

// Import kelas Camera
import Camera from "./class/camera";
import Vector3 from "./base-types/vector3";
import M4 from "./base-types/m4";
import PersepectiveCamera from "./class/persepective-camera";
import { MathUtil } from "./util/math-util";

const camera = new PersepectiveCamera(gl.canvas.width / gl.canvas.height, MathUtil.DegreesToRad(30), 1, 2000);
camera.position = new Vector3(0, 0, 0);
camera.angle = 70;
console.log(M4.flatten(camera.viewProjectionMatrix));
console.log(camera);

// TODO: Delete, this is for testing purposes
const dummyUniformsData = {
  // Camera
  u_projectionMatrix: new BufferUniform(
    new Float32Array(M4.flatten(camera.viewProjectionMatrix)),
    1,
    gl.FLOAT_MAT4
  ),
  // Node
  u_world: new BufferUniform(
    new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]),
    1, gl.FLOAT_MAT4
  ),
  // Light
  u_lightWorldPos: new BufferUniform(
    new Float32Array([1, 0, 0]),
    1,
    gl.FLOAT_VEC3
  ),
  // Camera
  u_viewInverse: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  // Node
  u_worldInverseTranspose: new BufferUniform(
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    1,
    gl.FLOAT_MAT4
  ),
  // Light
  u_lightColor: new BufferUniform(
    new Float32Array([1, 1, 1, 1]),
    1,
    gl.FLOAT_VEC4
  ),
};

const dummyAttributesData = {
  // Geometry
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
  // Geometry
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
  // Geometry
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

// const material = new BasicMaterial({color:new Color(0xff00ffff)});
const texture = await TextureLoader.load("res/f-texture.png");
const material = new PhongMaterial({
  ambient: new Color(0xa0a0a000),
  diffuse: texture,
  specular: new Color(0xffffffff),
  shinyness: 32,
  specularFactor: 0.5
});

const mesh = new Mesh(geometry, material);
scene.add(mesh);

WebGLUtils.setUniforms(programInfo, dummyUniformsData);
renderer.render(scene, null);

// Snippet to log uniform/attribute within webgl
// const loc = gl.getUniformLocation(programInfo.program, UniformKeys.SPECULAR);
// const uniform = gl.getUniform(programInfo.program, loc!);
// console.log(uniform)

console.log("Done");
