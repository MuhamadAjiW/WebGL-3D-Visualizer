import { AnimationClip } from "@/libs/base-types/animation";
import Vector3 from "@/libs/base-types/vector3";
import { ProgramInfo } from "@/libs/base-types/webgl-program-info";
import { AnimationEasingType } from "@/libs/class/animation/animation-easing";
import Camera from "@/libs/class/camera";
import Object3D from "@/libs/class/object3d";
import ObliqueCamera from "@/libs/class/oblique-camera";
import OrthographicCamera from "@/libs/class/orthographic-camera";
import PerspectiveCamera from "@/libs/class/perspective-camera";
import { WebGLRenderer } from "@/libs/class/webgl-renderer";
import { BufferUniform } from "@/libs/class/webgl/uniform";
import {
  AnimationControllerType,
  CameraControllerType,
  checkAnimationUpdate,
  checkCameraUpdate,
} from "@/libs/controllers";
import { MathUtil } from "@/libs/util/math-util";
import { WebGLUtil as WebGLUtils } from "@/libs/util/webgl-util";
import fragmentShaderSource from "@/shaders/fragment-shader.frag?raw";
import vertexShaderSource from "@/shaders/vertex-shader.vert?raw";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { AnimationRunner } from "../libs/class/animation/animation-runner";
import { Mesh } from "@/libs/class/mesh";
import { Color } from "@/libs/base-types/color";
import { PhongMaterial } from "@/libs/class/material/phong-material";
import { Scene } from "@/libs/class/scene";
import { TextureLoader } from "@/libs/class/texture/texture-loader";
import { BlockGeometry } from "@/libs/class/geometry/block-geometry";
import { Loader } from "@/libs/class/loader/loader";

interface HooksRenderProps {
  activeComponent: Object3D; // change this later
  isControllerChange: boolean;
  cameraController: CameraControllerType;
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>;
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
}

// TODO: Delete
// const testAnim: AnimationClip = {
//   name: "Test",
//   frames: [
//     // 0
//     {
//       keyframe: {},
//       children: {
//         Parent: {
//           keyframe: {
//             translation: [0, 0, 0],
//             rotation: [0, 0, 0],
//           },
//           children: {
//             Left: {
//               keyframe: {
//                 rotation: [0, 0, 0],
//               },
//             },
//           },
//         },
//       },
//     },
//     // 1
//     {
//       keyframe: {},
//       children: {
//         Parent: {
//           keyframe: {
//             translation: [-0.5, 0, 0],
//             rotation: [0, 0.5, 0],
//           },
//           children: {
//             Left: {
//               keyframe: {
//                 rotation: [2, 0, 0],
//               },
//             },
//           },
//         },
//       },
//     },
//     // 2
//     {
//       keyframe: {},
//       children: {
//         Parent: {
//           keyframe: {
//             translation: [0.5, 0, 0],
//             rotation: [0, 0.25, 0],
//           },
//           children: {
//             Left: {
//               keyframe: {
//                 rotation: [0, 1, 0],
//               },
//             },
//           },
//         },
//       },
//     },
//   ],
// };
const testAnim: AnimationClip = {
  name: "Test2",
  frames: [
    // 0
    {
      keyframe: {
        rotation: [0, 0, 0],
      },
      children: {},
    },
    // 1
    {
      keyframe: {
        rotation: [0, 1, 0],
      },
      children: {},
    },
    // 2
    {
      keyframe: {
        rotation: [0, 2, 0],
      },
      children: {},
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
  activeComponent,
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
  const animationRunnerRef = useRef<AnimationRunner | null>(null);
  const refreshRequest = useRef<number>(0);
  const refreshRequestDelay = 0.0;
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
    animationRunnerRef.current = new AnimationRunner(clip, scene);
    newAnimationControllerState.maxFrame = clip.frames.length;
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

      if (
        !activeComponentRef.current ||
        activeComponentRef.current != activeComponent
      ) {
        // rendererRef.current?.clean();
        activeComponentRef.current = activeComponent;
        setupAnimationRunner(testAnim, activeComponentRef.current!);
      }

      const canvas = canvasRef.current;
      const renderer = rendererRef.current as WebGLRenderer;
      const activeCamera = activeCameraRef.current as Camera;
      const animationRunner = animationRunnerRef.current as AnimationRunner;
      const scene = activeComponentRef.current as Object3D;

      if (animationController) {
        animationRunner.fps = animationController.fps;
        animationRunner.easing = animationController.easing;
      }

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
        updateCameraController(newCameraControllerState);
      }

      // Apply animation controls
      if (animationController && setAnimationController) {
        animationRunner.loop = animationController.playback;
        animationRunner.reverse = animationController.reverse;
        if (animationController.pause) {
          animationRunner.pause();
          newAnimationControllerState.pause = false;
        }
        if (animationController.play) {
          animationRunner.playAnimation();
          newAnimationControllerState.play = false;
        }
        if (animationController.manualUpdate) {
          animationRunner.setFrame(animationController.currentFrame - 1);
          newAnimationControllerState.manualUpdate = false;
        }
      }

      WebGLUtils.setUniforms(renderer.currentProgram, dummyUniformsData);

      function render() {
        if (!renderer) return;
        if (activeCameraRef.current == null) return;
        if (animationRunnerRef.current) {
          animationRunner.update();
          if (animationController && setAnimationController) {
            if (!animationController.manualUpdate) {
              newAnimationControllerState.currentFrame =
                animationRunner.CurrentFrame + 1;
            }
            updateAnimationController(newAnimationControllerState);
          }
        }

        activeCamera.setOrbitControl(dy, dx);

        activeComponentRef.current!.rotateOnWorldAxis(Vector3.right, 0.001);
        activeComponentRef.current!.rotateOnWorldAxis(Vector3.up, 0.001);

        renderer.render(activeComponentRef.current!, activeCamera);
        if (!stop) {
          requestAnimationFrame(render);
        }
      }
      render();
      // renderer.render(scene, cameraInstance);

      // console.log("Done");
    };

    runWebGL();
    return () => {
      stop = true;
    };
  }, [
    activeComponent,
    isControllerChange,
    cameraController.distance,
    cameraController.reset,
    cameraController.type,
    animationController?.currentFrame,
    animationController?.maxFrame,
    animationController?.pause,
    animationController?.play,
    animationController?.playback,
    animationController?.reverse,
  ]);

  return canvasRef;
};

export default useRender;
