import useRender from "@/hooks/useRender";
import { Mesh } from "@/libs/class/mesh";
import { Dispatch, SetStateAction } from "react";
import CameraController from '@/components/camera/CameraController';
import { AnimationControllerType, CameraControllerType } from "@/types/controllers/controllers";

interface RenderedComponentProps {
  selectedComponent: Mesh | null; // change this later
  meshes: any;
  isControllerChange: boolean;
  cameraController: CameraControllerType
  setCameraController: Dispatch<SetStateAction<CameraControllerType>>
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
  className?: string
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  selectedComponent,
  meshes,
  isControllerChange,
  setCameraController,
  animationController,
  setAnimationController,
  cameraController,
  className
}: RenderedComponentProps) => {
  const canvasRef = useRender({
    selectedComponent,
    meshes,
    isControllerChange,
    cameraController,
    setCameraController,
    animationController,
    setAnimationController,
  });

  return <canvas id="webgl-canvas" className={`w-full h-full ${className}`} ref={canvasRef}/>;
};

export default RenderedComponent;
