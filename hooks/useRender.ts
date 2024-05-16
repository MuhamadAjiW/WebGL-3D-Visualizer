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
import { WebGLRenderer } from "@/libs/class/webgl-renderer";
import { PhongMaterial } from "@/libs/class/material/phong-material";
// import { BasicMaterial } from "./class/material/basic-material";
// Import kelas Camera
import Camera from "@/libs/class/camera";
import Vector3 from "@/libs/base-types/vector3";
import M4 from "@/libs/base-types/m4";
import { MathUtil } from "@/libs/util/math-util";
import { useEffect, useRef } from "react";
import { CubeGeometry } from "@/libs/class/geometry/cube-geometry";
import ObliqueCamera from "@/libs/class/oblique-camera";
import OrthographicCamera from "@/libs/class/orthographic-camera";
import { BlockGeometry } from "@/libs/class/geometry/block-geometry";
import { BasicMaterial } from "@/libs/class/material/basic-material";
import { HollowBlockGeometry } from "@/libs/class/geometry/hollow-block-geometry";
import PerspectiveCamera from "@/libs/class/perspective-camera";
import { AnimationClip } from "@/libs/base-types/animation";
import { AnimationRunner } from "../libs/class/animation/animation-runner";
import { AnimationEasingType } from "@/libs/class/animation/animation-easing";
import { Loader } from "@/libs/class/loader/loader";
import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";

interface HooksRenderProps {
  cameraType: string;
  distance: number;
  isReset: boolean;
  handleReset: Dispatch<SetStateAction<boolean>>;
  selectedComponent: any; // change this later
}

const useRender = ({
  cameraType,
  distance,
  isReset,
  handleReset,
  selectedComponent,
}: HooksRenderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("this is selected component", selectedComponent);
    let isMouseClick = false;
    let stop = false;
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
        | PerspectiveCamera
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
          cameraInstance = PerspectiveCamera.getInstance(
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

      const geometry = new BlockGeometry(0.5, 1, 0.5);
      const geometryh = new BlockGeometry(0.25, 0.5, 0.25);
      const texture = await TextureLoader.load("res/f-texture.png");
      // const material = new BasicMaterial({
      //   color: new Color(0x010101ff),
      //   texture,
      // });
      const material = new PhongMaterial({
        texture: texture,
        ambient: new Color(0x818181ff),
        diffuse: new Color(0xffffffff),
        specular: new Color(0xffffffff),
        shinyness: 32,
      });

      const mesh = new Mesh(geometry, material);
      const meshl = new Mesh(geometryh, material);
      const meshr = new Mesh(geometryh, material);
      mesh.name = "Parent";
      meshl.name = "Left";
      meshr.name = "Right";
      if (selectedComponent) {
        mesh.position = new Vector3(
          selectedComponent.position.x,
          selectedComponent.position.y,
          selectedComponent.position.z
        );

        mesh.rotation = Quaternion.Euler(
          new Euler(
            selectedComponent.rotation.x,
            selectedComponent.rotation.y,
            selectedComponent.rotation.z,
            "XYZ"
          )
        );
      }
      meshl.position = new Vector3(-0.25, 0, 0);
      meshr.position = new Vector3(0.25, 0, 0);

      scene.add(mesh);

      mesh.add(meshl);
      mesh.add(meshr);
      console.log(scene);
      console.log(mesh);
      console.log(meshl);
      console.log(meshr);

      // const fetchData = async () => {
      //   const response = await fetch("/scene.json");
      //   const data = await response.json();
      //   console.log(data);

      //   const loader: Loader = new Loader();
      //   return loader.loadFromJson(JSON.stringify(data));
      // };
      // const scene = await fetchData();
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

      const testAnim: AnimationClip = {
        name: "Fox Walking",
        frames: [
          // 0
          {
            keyframe: {
              translation: [0, 0, 0],
              rotation: [0, 0, 0],
            },
            children: {
              Left: {
                keyframe: {
                  rotation: [0, 0, 0],
                },
              },
            },
          },
          // 1
          {
            keyframe: {
              translation: [-0.5, 0, 0],
              rotation: [0, 0.5, 0],
            },
            children: {
              Left: {
                keyframe: {
                  rotation: [2, 0, 0],
                },
              },
            },
          },
        ],
      };
      // const animationRunner: AnimationRunner = new AnimationRunner(
      //   testAnim,
      //   mesh,
      //   {
      //     fpkey: 144,
      //     easing: AnimationEasingType.EASE_IN_SINE,
      //     loop: false,
      //     reverse: false,
      //   }
      // );
      // animationRunner.playAnimation();

      WebGLUtils.setUniforms(programInfo, dummyUniformsData);
      function render() {
        if (cameraInstance == null) return;

        // animationRunner.update();
        cameraInstance.setOrbitControl(dy, dx);
        cameraInstance.setDistance(distance);

        // mesh.rotateOnWorldAxis(Vector3.right, 0.01);
        // mesh.rotateOnWorldAxis(Vector3.up, 0.01);

        renderer.render(scene, cameraInstance);
        if (!stop) {
          requestAnimationFrame(render);
        }
      }
      render();

      console.log("Done");
    };

    runWebGL();
    return () => {
      stop = true;
    };
  }, [cameraType, distance, isReset, selectedComponent]);

  return canvasRef;
};

export default useRender;
