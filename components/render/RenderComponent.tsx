import useRender from "@/hooks/useRender";
import { AnimationClip } from "@/libs/base-types/animation";
import Vector3 from "@/libs/base-types/vector3";
import Object3D from "@/libs/class/object3d";
import { AnimationControllerType, CameraControllerType } from "@/libs/controllers";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  activeComponent: Object3D; // change this later
  isControllerChange: boolean;
  cameraController: CameraControllerType
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
  activeAnimationClip?: AnimationClip;
  lightPos?: Vector3;
  className?: string
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  activeComponent,
  isControllerChange,
  setCameraController,
  animationController,
  setAnimationController,
  cameraController,
  activeAnimationClip,
  lightPos,
  className
}: RenderedComponentProps) => {
  const canvasRef = useRender({
    activeComponent,
    isControllerChange,
    cameraController,
    setCameraController,
    animationController,
    setAnimationController,
    activeAnimationClip,
    lightPos
  });

  return <canvas id="webgl-canvas" className={`w-full h-full ${className}`} ref={canvasRef}/>;
};

export default RenderedComponent;
