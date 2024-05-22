import useRender from "@/hooks/useRender";
import { Mesh } from "@/libs/class/mesh";
import { AnimationController } from "@/types/ui";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
  isReset: boolean;
  handleReset: Dispatch<SetStateAction<boolean>>;
  selectedComponent: Mesh | null; // change this later
  meshes: any;
  isControllerChange: boolean;
  animationController: AnimationController;
  setAnimationController: Dispatch<SetStateAction<AnimationController>>;
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

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
