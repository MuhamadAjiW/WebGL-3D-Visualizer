import React, { Dispatch, SetStateAction, useState } from "react";
import vertexShaderSource from "@/shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "@/shaders/fragment-shader.frag?raw";
import { ProgramInfo } from "@/libs/base-types/webgl-program-info";
import { WebGLUtil as WebGLUtils } from "@/libs/util/webgl-util";
import { BufferAttribute } from "@/libs/class/webgl/attribute";
import { BufferUniform } from "@/libs/class/webgl/uniform";
import { PlaneGeometry } from "@/libs/class/geometry/plane-geometry";
import { Color } from "@/libs/base-types/color";
import { Scene } from "@/libs/class/scene";
import { Mesh } from "@/libs/class/mesh";
import { TextureLoader } from "@/libs/class/texture/texture-loader";
import { AttributeKeys, UniformKeys } from "@/libs/base-types/webgl-keys";
import { WebGLRenderer } from "@/libs/class/webgl-renderer";
import { PhongMaterial } from "@/libs/class/material/phong-material";
// import { BasicMaterial } from "./class/material/basic-material";
// Import kelas Camera
import Camera from "@/libs/class/camera";
import Vector3 from "@/libs/base-types/vector3";
import M4 from "@/libs/base-types/m4";
import PersepectiveCamera from "@/libs/class/persepective-camera";
import { MathUtil } from "@/libs/util/math-util";
import { useEffect, useRef } from "react";
import { CubeGeometry } from "@/libs/class/geometry/cube-geometry";
import ObliqueCamera from "@/libs/class/oblique-camera";
import OrthographicCamera from "@/libs/class/orthographic-camera";
import { BlockGeometry } from "@/libs/class/geometry/block-geometry";
import { BasicMaterial } from "@/libs/class/material/basic-material";

interface HooksRenderProps {
  cameraType: string;
  distance: number;
  isReset: boolean;
  handleReset: Dispatch<SetStateAction<boolean>>;
}

const useRender = ({
  cameraType,
  distance,
  isReset,
  handleReset,
}: HooksRenderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isMouseClick = false;
    const runWebGL = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const gl = canvas.getContext("webgl");
      if (!gl) {
        console.error(
          "Failed to get WebGL context. Your browser or machine may not support it."
        );
        return;
      }
      const vertexShader = WebGLUtils.createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      );
      const fragmentShader = WebGLUtils.createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );
      const program = WebGLUtils.createProgram(
        gl,
        vertexShader,
        fragmentShader
      );

      const programInfo: ProgramInfo = {
        program: program,
        uniformSetters: WebGLUtils.createUniformSetters(gl, program),
        attributeSetters: WebGLUtils.createAttributeSetters(gl, program),
      };

      const renderer: WebGLRenderer = new WebGLRenderer(
        canvas,
        gl,
        { programInfo: "" },
        programInfo
      );

      let cameraInstance:
        | ObliqueCamera
        | OrthographicCamera
        | PersepectiveCamera
        | null = null;
      switch (cameraType) {
        case "obliqueCamera":
          cameraInstance = ObliqueCamera.getInstance(-1, 1, -1, 1, 0.1, 100);
          break;
        case "orthographicCamera":
          cameraInstance = OrthographicCamera.getInstance(
            -1,
            1,
            -1,
            1,
            0.1,
            100
          );
          break;
        case "perspectiveCamera":
          cameraInstance = PersepectiveCamera.getInstance(
            gl.canvas.width / gl.canvas.height,
            MathUtil.DegreesToRad(30),
            1,
            2000
          );
          break;
        default:
          console.log(`Unknown camera type: ${cameraType}`);
          break;
      }

      if (cameraInstance == null) return;

      cameraInstance.position = new Vector3(0, 0, 0);
      // console.log(M4.flatten(cameraInstance.viewProjectionMatrix));
      // console.log(cameraInstance);

      // TODO: Delete, this is for testing purposes
      const dummyUniformsData = {
        // Light
        u_lightPos: new BufferUniform(
          new Float32Array([0, 0, 1]),
          3,
          gl.FLOAT_VEC3
        ),
      };

      gl.useProgram(program);

      const scene = new Scene();

      const geometry = new BlockGeometry(0.5, 0.5, 1);
      const texture = await TextureLoader.load("res/f-texture.png");
      // const material = new BasicMaterial({
      //   color: new Color(0x010101ff),
      //   texture,
      // });
      const material = new PhongMaterial({
        texture: texture,
        ambient: new Color(0x0),
        diffuse: new Color(0x010101ff),
        specular: new Color(0x010101ff),
        shinyness: 32,
      });

      const mesh = new Mesh(geometry, material);
      mesh.position = new Vector3(1, 0, 0);
      scene.add(mesh);

      let dx = 0;
      let dy = 0;

      canvas.addEventListener("mousedown", () => {
        isMouseClick = true;
      });

      canvas.addEventListener("mouseup", () => {
        isMouseClick = false;
      });

      canvas.addEventListener("mousemove", (event) => {
        if (!isMouseClick) return;

        const rect = canvas.getBoundingClientRect();

        dx = event.clientX - rect.left;
        dy = event.clientY - rect.top;
      });

      if (isReset) {
        dx = 0;
        dy = 0;
        handleReset(false);
      }

      // scene.computeWorldMatrix(true, true);
      // console.log(mesh.geometry.attributes.a_normal);

      WebGLUtils.setUniforms(programInfo, dummyUniformsData);
      function render() {
        if (cameraInstance == null) return;

        cameraInstance.setOrbitControl(dy, dx);
        cameraInstance.setDistance(distance);
        // mesh.rotation.y += 1;

        renderer.render(scene, cameraInstance);
        requestAnimationFrame(render);
      }
      render();

      // const location = renderer.gl.getAttribLocation(renderer.currentProgram.program, AttributeKeys.TEXTURE_COORDS);
      // console.log("Texture coords:");
      // console.log(renderer.gl.getActiveAttrib(renderer.currentProgram.program, location));

      console.log("Done");
    };

    runWebGL();
  }, [cameraType, distance, isReset]);

  return canvasRef;
};

export default useRender;
