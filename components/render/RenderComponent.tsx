import useRender from "@/hooks/useRender";
import { Dispatch, SetStateAction } from "react";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
  isReset: boolean
  handleReset: Dispatch<SetStateAction<boolean>>
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  cameraType,
  distance,
  isReset,
  handleReset
}) => {
  const canvasRef = useRender({
    cameraType,
    distance,
    isReset,
    handleReset
  });

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
