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
  meshes: any;
  isControllerChange: boolean
}

const useRender = ({
  cameraType,
  distance,
  isReset,
  handleReset,
  selectedComponent,
  meshes,
  isControllerChange
}: HooksRenderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("this is scene", meshes);
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

      const meshConverter = (mesh: any) => {
        // change the param type later
        const geometry = mesh.geometry;
        const material = mesh.material;
        const meshComp = new Mesh(geometry, material);

        meshComp.name = mesh.name
        meshComp.position = mesh.position
        meshComp.rotation = mesh.rotation
        meshComp.scale = mesh.scale

        scene.add(meshComp);

        for (let child of mesh.children) {
          meshConverter(child)
        }
      };

      if (selectedComponent) {
        meshConverter(selectedComponent)
      } else {
        for (let mesh of meshes) {
          meshConverter(mesh)
        }
      }

      // const geometry = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry1 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry2 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry3 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry4 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry5 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry6 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry7 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry8 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry9 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry10 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry11 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry12 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry13 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry14 = new HollowBlockGeometry(0.05, 0.3, 1);
      // const geometry15 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry16 = new HollowBlockGeometry(0.05, 0.5, 1);
      // const geometry17 = new HollowBlockGeometry(0.05, 0.5, 1);

      // const geometryh = new BlockGeometry(0.25, 0.5, 0.25);
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

      // const mesh = new Mesh(geometry, material);
      // const mesh1 = new Mesh(geometry1, material);
      // const mesh2 = new Mesh(geometry2, material);
      // const mesh3 = new Mesh(geometry3, material);
      // const mesh4 = new Mesh(geometry4, material);
      // const mesh5 = new Mesh(geometry5, material);
      // const mesh6 = new Mesh(geometry6, material);
      // const mesh7 = new Mesh(geometry7, material);
      // const mesh8 = new Mesh(geometry8, material);
      // const mesh9 = new Mesh(geometry9, material);
      // const mesh10 = new Mesh(geometry10, material);
      // const mesh11 = new Mesh(geometry11, material);
      // const mesh12 = new Mesh(geometry12, material);
      // const mesh13 = new Mesh(geometry13, material);
      // const mesh14 = new Mesh(geometry14, material);
      // const mesh15 = new Mesh(geometry15, material);
      // const mesh16 = new Mesh(geometry16, material);
      // const mesh17 = new Mesh(geometry17, material);
      // mesh.name = "Parent";

      // mesh.name = "Piece 1";
      // mesh1.name = "Piece 2";
      // mesh2.name = "Piece 3";
      // mesh3.name = "Piece 4";
      // mesh4.name = "Piece 5";
      // mesh5.name = "Piece 6";
      // mesh6.name = "Piece 7";
      // mesh7.name = "Piece 8";
      // mesh8.name = "Piece 9";
      // mesh9.name = "Piece 10";
      // mesh10.name = "Piece 11";
      // mesh11.name = "Piece 12";
      // mesh12.name = "Piece 13";
      // mesh13.name = "Piece 14";
      // mesh14.name = "Piece 15";
      // mesh15.name = "Piece 16";
      // mesh16.name = "Piece 17";
      // mesh17.name = "Piece 18";

      // mesh.position = new Vector3(0.21, 0, 0);
      // mesh1.position = new Vector3(0.21, 0, 0);
      // mesh2.position = new Vector3(0.21, 0, 0);
      // mesh3.position = new Vector3(0.42, 0, 0);
      // mesh4.position = new Vector3(0.31, 0.19, 0);
      // mesh5.position = new Vector3(0.31, -0.19, 0);
      // mesh6.position = new Vector3(0, 0, 0);
      // mesh7.position = new Vector3(0.11, 0.19, 0);
      // mesh8.position = new Vector3(0.11, -0.19, 0);
      // mesh9.position = new Vector3(-0.21, 0, 0);
      // mesh10.position = new Vector3(-0.21, 0, 0);
      // mesh11.position = new Vector3(-0.21, 0, 0);
      // mesh12.position = new Vector3(-0.42, 0, 0);
      // mesh13.position = new Vector3(-0.31, 0.19, 0);
      // mesh14.position = new Vector3(-0.31, -0.19, 0);
      // mesh15.position = new Vector3(0, 0, 0);
      // mesh16.position = new Vector3(-0.11, 0.19, 0);
      // mesh17.position = new Vector3(-0.11, -0.19, 0);

      // mesh.rotateOnWorldAxis(Vector3.forward, 1);
      // mesh2.rotateOnWorldAxis(Vector3.back, 1);
      // mesh4.rotateOnWorldAxis(Vector3.forward, 1);
      // mesh5.rotateOnWorldAxis(Vector3.back, 1);
      // mesh7.rotateOnWorldAxis(Vector3.forward, 1);
      // mesh8.rotateOnWorldAxis(Vector3.back, 1);
      // mesh9.rotateOnWorldAxis(Vector3.back, 1);
      // mesh11.rotateOnWorldAxis(Vector3.forward, 1);
      // mesh13.rotateOnWorldAxis(Vector3.back, 1);
      // mesh14.rotateOnWorldAxis(Vector3.forward, 1);
      // mesh16.rotateOnWorldAxis(Vector3.back, 1);
      // mesh17.rotateOnWorldAxis(Vector3.forward, 1);
      // meshl.name = "Left";
      // meshr.name = "Right";
      // if (selectedComponent) {
      //   mesh.position = new Vector3(
      //     selectedComponent.position.x,
      //     selectedComponent.position.y,
      //     selectedComponent.position.z
      //   );

      // mesh.rotation = Quaternion.Euler(
      //   new Euler(
      //     selectedComponent.rotation.x,
      //     selectedComponent.rotation.y,
      //     selectedComponent.rotation.z,
      //     "XYZ"
      //   )
      // );
      // }
      // meshl.position = new Vector3(-0.25, 0, 0);
      // meshr.position = new Vector3(0.25, 0, 0);

      // scene.add(mesh);
      // scene.add(mesh1);
      // scene.add(mesh2);
      // scene.add(mesh3);
      // scene.add(mesh4);
      // scene.add(mesh5);
      // scene.add(mesh6);
      // scene.add(mesh7);
      // scene.add(mesh8);
      // scene.add(mesh9);
      // scene.add(mesh10);
      // scene.add(mesh11);
      // scene.add(mesh12);
      // scene.add(mesh13);
      // scene.add(mesh14);
      // scene.add(mesh15);
      // scene.add(mesh16);
      // scene.add(mesh17);

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

      // const testAnim: AnimationClip = {
      //   name: "Fox Walking",
      //   frames: [
      //     // 0
      //     {
      //       keyframe: {
      //         translation: [0, 0, 0],
      //         rotation: [0, 0, 0],
      //       },
      //       children: {
      //         Left: {
      //           keyframe: {
      //             rotation: [0, 0, 0],
      //           },
      //         },
      //       },
      //     },
      //     // 1
      //     {
      //       keyframe: {
      //         translation: [-0.5, 0, 0],
      //         rotation: [0, 0.5, 0],
      //       },
      //       children: {
      //         Left: {
      //           keyframe: {
      //             rotation: [2, 0, 0],
      //           },
      //         },
      //       },
      //     },
      //   ],
      // };
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

      //   console.log("Done");
    };

    runWebGL();
    return () => {
      stop = true;
    };
  }, [cameraType, distance, isReset, selectedComponent, meshes, isControllerChange]);

  return canvasRef;
};

export default useRender;
