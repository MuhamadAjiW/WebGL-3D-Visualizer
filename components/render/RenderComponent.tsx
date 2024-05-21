import useRender from "@/hooks/useRender";
import { Mesh } from "@/libs/class/mesh";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
  isReset: boolean;
  handleReset: Dispatch<SetStateAction<boolean>>;
  selectedComponent: Mesh | null; // change this later
  meshes: any;
  isControllerChange: boolean;
  isAnimation?: boolean;
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  cameraType,
  distance,
  isReset,
  handleReset,
  selectedComponent,
  meshes,
  isControllerChange,
  isAnimation,
}: RenderedComponentProps) => {
  const canvasRef = useRender({
    cameraType,
    distance,
    isReset,
    handleReset,
    selectedComponent,
    meshes,
    isControllerChange,
    isAnimation
  });

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
