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
import Object3D from "@/libs/class/object3d";
import {
  AnimationControllerType,
  CameraControllerType,
  checkAnimationUpdate,
  checkCameraUpdate,
} from "@/types/controllers/controllers";

interface HooksRenderProps {
  selectedComponent: any; // change this later
  meshes: any;
  isControllerChange: boolean;
  cameraController: CameraControllerType;
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>;
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
}

// TODO: Delete
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
    // 2
    {
      keyframe: {
        translation: [0.5, 0, 0],
        rotation: [0, 0.25, 0],
      },
      children: {
        Left: {
          keyframe: {
            rotation: [0, 1, 0],
          },
        },
      },
    },
  ],
};
//
const dummyUniformsData = {
  // Light
  u_lightPos: new BufferUniform(
    new Float32Array([0, 0, 1]),
    3,
    WebGLRenderingContext.FLOAT_VEC3
  ),
};

const useRender = ({
  selectedComponent,
  meshes,
  isControllerChange,
  cameraController,
  setCameraController,
  animationController,
  setAnimationController,
}: HooksRenderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const activeCameraRef = useRef<Camera | null>(null);
  const activeCameraTypeRef = useRef<String | null>(null);
  const activeComponentRef = useRef<Object3D | null>(null);
  const selectedComponentRef = useRef<any | null>(null);
  const animationRunnerRef = useRef<AnimationRunner | null>(null);
  const refreshRequest = useRef<number>(0);
  const refreshRequestDelay = 0.05;
  let newAnimationControllerState: AnimationControllerType;
  let newCameraControllerState: CameraControllerType;

  function updateAnimationController(
    newControllerState: AnimationControllerType
  ) {
    if (!animationController) return;

    if (
      !checkAnimationUpdate(newControllerState, animationController) ||
      new Date().getTime() - (refreshRequest.current + refreshRequestDelay) < 0
    )
      return;

    refreshRequest.current = new Date().getTime();
    setAnimationController!(newControllerState);
  }

  function updateCameraController(newControllerState: CameraControllerType) {
    if (
      !checkCameraUpdate(newControllerState, cameraController) ||
      new Date().getTime() - (refreshRequest.current + refreshRequestDelay) < 0
    )
      return;

    refreshRequest.current = new Date().getTime();
    setCameraController!(newControllerState);
  }

  function setupRenderer() {
    // console.log("Setting up renderer");

    const canvas = canvasRef.current;
    if (!canvas) return;
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
    const program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader);

    const programInfo: ProgramInfo = {
      program: program,
      uniformSetters: WebGLUtils.createUniformSetters(gl, program),
      attributeSetters: WebGLUtils.createAttributeSetters(gl, program),
    };

    rendererRef.current = new WebGLRenderer(
      canvas,
      gl,
      { programInfo: "" },
      programInfo
    );

    gl.useProgram(program);
  }

  function setupCamera(type: String) {
    if (!rendererRef.current) return;
    activeCameraTypeRef.current = type;
    const oldCopy = activeCameraRef.current;

    switch (type) {
      case "obliqueCamera":
        activeCameraRef.current = new ObliqueCamera(-1, 1, -1, 1, 0.1, 100);
        break;
      case "orthographicCamera":
        activeCameraRef.current = new OrthographicCamera(
          -1,
          1,
          -1,
          1,
          0.1,
          100
        );
        break;
      case "perspectiveCamera":
        activeCameraRef.current = new PerspectiveCamera(
          rendererRef.current.canvas.width / rendererRef.current.canvas.height,
          MathUtil.DegreesToRad(30),
          1,
          2000
        );
        break;
      default:
        console.error(`Unknown camera type: ${type}`);
        break;
    }

    if (activeCameraRef == null) return;
    activeCameraRef.current!.position = new Vector3(0, 0, 0);
  }

  function setupAnimationRunner(clip: AnimationClip, scene: Object3D) {
    if (!animationController || !setAnimationController) {
      return;
    }
    // console.log("Setting up Animation Runner");
    animationRunnerRef.current = new AnimationRunner(clip, scene, {
      fps: 1,
      easing: AnimationEasingType.EASE_IN_OUT_BOUNCE,
    });
    newAnimationControllerState.maxFrame = clip.frames.length;
  }

  function setupComponent(selectedComponent: any) {
    selectedComponentRef.current = selectedComponent;
    activeComponentRef.current = new Scene();

    const meshConverter = async (mesh: any) => {
      // change the param type later
      const geometry = mesh.geometry;
      const material = await mesh.material;
      const meshComp = new Mesh(geometry, material);

      meshComp.name = mesh.name;
      meshComp.position = mesh.position;
      meshComp.rotation = mesh.rotation;
      meshComp.scale = mesh.scale;

      activeComponentRef.current!.add(meshComp);

      for (let child of mesh.children) {
        meshConverter(child);
      }
    };

    if (selectedComponent) {
      meshConverter(selectedComponent);
    } else {
      for (let mesh of meshes) {
        meshConverter(mesh);
      }
    }
  }

  useEffect(() => {
    // console.log("this is scene", meshes);
    // console.log("this is selected component", selectedComponent);
    let isMouseClick = false;
    let stop = false;

    if (animationController) {
      newAnimationControllerState = { ...animationController };
    }
    newCameraControllerState = { ...cameraController };

    const runWebGL = async () => {
      // Setup refs if not already
      if (!canvasRef.current) {
        return;
      }

      if (!rendererRef.current) {
        setupRenderer();
      }
      if (
        cameraController.type != activeCameraTypeRef.current ||
        !activeCameraRef.current
      ) {
        setupCamera(cameraController.type);
      }

      if (selectedComponent || !activeComponentRef.current) {
        setupComponent(selectedComponent);
        setupAnimationRunner(testAnim, activeComponentRef.current!);
      }

      const canvas = canvasRef.current;
      const renderer = rendererRef.current as WebGLRenderer;
      const activeCamera = activeCameraRef.current as Camera;
      const animationRunner = animationRunnerRef.current as AnimationRunner;
      const scene = activeComponentRef.current as Object3D;

      // Apply camera controls
      activeCamera.setDistance(cameraController.distance);
      let dx = 0;
      let dy = 0;

      canvas.addEventListener("mousedown", () => {
        isMouseClick = true;
        canvas.addEventListener("mouseup", () => {
          isMouseClick = false;
        });
      });

      canvas.addEventListener("mousemove", (event) => {
        if (!isMouseClick) return;

        const rect = canvas.getBoundingClientRect();

        dx = event.clientX - rect.left;
        dy = event.clientY - rect.top;
      });

      if (cameraController.reset) {
        dx = 0;
        dy = 0;
        newCameraControllerState.reset = false;
      }

      // Apply animation controls
      // console.log("animationController:", animationController);
      if (animationController && setAnimationController) {
        // console.log("this is reverse", animationController.reverse)
        animationRunner.loop = animationController.playback;
        animationRunner.reverse = animationController.reverse;
        if (animationController.pause) {
          animationRunner.pause();
          newAnimationControllerState.pause = false;
        }
        if (animationController.play) {
          console.log("Playing");
          animationRunner.playAnimation();
          newAnimationControllerState.play = false;
        }
      }

      // console.log("This is animation scene", animationController);

      WebGLUtils.setUniforms(renderer.currentProgram, dummyUniformsData);

      function render() {
        if (!renderer) return;
        if (activeCameraRef.current == null) return;
        if (animationRunnerRef.current) {
          animationRunner.update();
          if (animationController && setAnimationController) {
            newAnimationControllerState.currentFrame =
              animationRunner.CurrentFrame + 1;
            updateAnimationController(newAnimationControllerState);
          }
        }

        activeCamera.setOrbitControl(dy, dx);

        // mesh.rotateOnWorldAxis(Vector3.right, 0.01);
        // mesh.rotateOnWorldAxis(Vector3.up, 0.01);

        renderer.render(scene, activeCamera);
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
  }, [
    selectedComponent,
    meshes,
    isControllerChange,
    cameraController,
    setCameraController,
    animationController,
    setAnimationController,
  ]);

  return canvasRef;
};

export default useRender;
