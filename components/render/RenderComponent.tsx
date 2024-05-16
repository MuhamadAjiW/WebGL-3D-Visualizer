import useRender from "@/hooks/useRender";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
  isReset: boolean
  handleReset: Dispatch<SetStateAction<boolean>>
  selectedComponent: any // change this later
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  cameraType,
  distance,
  isReset,
  handleReset,
  selectedComponent,
}) => {
  const canvasRef = useRender({
    cameraType,
    distance,
    isReset,
    handleReset,
    selectedComponent
  });

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
