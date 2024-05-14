import useRender from "@/hooks/useRender";

interface RenderedComponentProps {
  cameraType: string;
  distance: number;
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({
  cameraType,
  distance,
}) => {
  const canvasRef = useRender({
    cameraType,
    distance,
  });

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
