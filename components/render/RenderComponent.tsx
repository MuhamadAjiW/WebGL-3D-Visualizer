import useRender from "@/hooks/useRender";
import { Dispatch, SetStateAction } from "react";
import { AnimationControllerType, CameraControllerType } from "@/libs/controllers";
import Object3D from "@/libs/class/object3d";

interface RenderedComponentProps {
  activeComponent: Object3D; // change this later
  isControllerChange: boolean;
  cameraController: CameraControllerType
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
  className?: string
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  activeComponent,
  isControllerChange,
  setCameraController,
  animationController,
  setAnimationController,
  cameraController,
  className
}: RenderedComponentProps) => {
  const canvasRef = useRender({
    activeComponent,
    isControllerChange,
    cameraController,
    setCameraController,
    animationController,
    setAnimationController,
  });

  return <canvas id="webgl-canvas" className={`w-full h-full ${className}`} ref={canvasRef}/>;
};

export default RenderedComponent;
