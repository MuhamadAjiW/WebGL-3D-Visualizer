import useRender from "@/hooks/useRender";
import { Mesh } from "@/libs/class/mesh";
import { AnimationControllerType } from "@/types/ui";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
  isReset: boolean;
  handleReset: Dispatch<SetStateAction<boolean>>;
  selectedComponent: Mesh | null; // change this later
  meshes: any;
  isControllerChange: boolean;
  animationController?: AnimationControllerType;
  setAnimationController?: Dispatch<SetStateAction<AnimationControllerType>>;
  className?: string
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  cameraType,
  distance,
  isReset,
  handleReset,
  selectedComponent,
  meshes,
  isControllerChange,
  animationController,
  setAnimationController,
  className
}: RenderedComponentProps) => {
  const canvasRef = useRender({
    cameraType,
    distance,
    isReset,
    handleReset,
    selectedComponent,
    meshes,
    isControllerChange,
    animationController,
    setAnimationController,
  });

  return <canvas id="webgl-canvas" className={`w-full h-full ${className}`} ref={canvasRef}/>;
};

export default RenderedComponent;
