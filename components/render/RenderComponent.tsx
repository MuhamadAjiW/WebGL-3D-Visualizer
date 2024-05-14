import vertexShaderSource from "@/shaders/vertex-shader.vert?raw";
import fragmentShaderSource from "@/shaders/fragment-shader.frag?raw";
import { ProgramInfo } from "@/libs/base-types/webgl-program-info";
import { WebGLUtil as WebGLUtils } from "@/libs/util/webgl-util";
import { BufferAttribute } from "@/libs/class/webgl/attribute";
import { BufferUniform } from "@/libs/class/webgl/uniform";
import { PlaneGeometry } from "@/libs/class/geometry/plane-geometry";
import { Color } from "@/libs/base-types/color";
import { Scene } from "@/libs/class/scene";
import { Mesh } from "@/libs/class/mesh";
import { TextureLoader } from "@/libs/class/texture/texture-loader";
import { AttributeKeys, UniformKeys } from "@/libs/base-types/webgl-keys";
import { WebGLRenderer } from "@/libs/class/webgl-renderer";
import { PhongMaterial } from "@/libs/class/material/phong-material";
// import { BasicMaterial } from "./class/material/basic-material";
// Import kelas Camera
import Camera from "@/libs/class/camera";
import Vector3 from "@/libs/base-types/vector3";
import M4 from "@/libs/base-types/m4";
import PersepectiveCamera from "@/libs/class/persepective-camera";
import { MathUtil } from "@/libs/util/math-util";
import { useEffect, useRef } from "react";
import { CubeGeometry } from "@/libs/class/geometry/cube-geometry";
import ObliqueCamera from "@/libs/class/oblique-camera";
import OrthographicCamera from "@/libs/class/orthographic-camera";

interface RenderedComponentProps {
  cameraType: string;
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({ cameraType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const runWebGL = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
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
      const program = WebGLUtils.createProgram(
        gl,
        vertexShader,
        fragmentShader
      );

      const programInfo: ProgramInfo = {
        program: program,
        uniformSetters: WebGLUtils.createUniformSetters(gl, program),
        attributeSetters: WebGLUtils.createAttributeSetters(gl, program),
      };

      const renderer: WebGLRenderer = new WebGLRenderer(
        canvas,
        gl,
        { programInfo: "" },
        programInfo
      );

      let cameraInstance: ObliqueCamera | OrthographicCamera | PersepectiveCamera | null = null;
      switch (cameraType) {
        case "obliqueCamera":
          cameraInstance = ObliqueCamera.getInstance(
            0, 0, 0, 0, 0, 0
          )
          break
        case "orthographicCamera":
          cameraInstance = OrthographicCamera.getInstance(
            0, 0, 0, 0, 0, 0
          )
          break
        case "perspectiveCamera":
          cameraInstance = PersepectiveCamera.getInstance(
            gl.canvas.width / gl.canvas.height,
            MathUtil.DegreesToRad(30),
            1,
            2000
          )
          break
        default: 
          console.log(`Unknown camera type: ${cameraType}`)
          break
      }

      if(cameraInstance == null) return

      cameraInstance.position = new Vector3(0, 0, 0);
      console.log(M4.flatten(cameraInstance.viewProjectionMatrix));
      console.log(cameraInstance);

      // TODO: Delete, this is for testing purposes
      const dummyUniformsData = {
        // Camera
        u_projectionMatrix: new BufferUniform(
          new Float32Array(M4.flatten(cameraInstance.viewProjectionMatrix)),
          16,
          gl.FLOAT_MAT4
        ),
        // Node
        u_world: new BufferUniform(
          new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
          16,
          gl.FLOAT_MAT4
        ),
        // Light
        u_lightWorldPos: new BufferUniform(
          new Float32Array([1, 0, 0]),
          3,
          gl.FLOAT_VEC3
        ),
        // Camera
        u_viewInverse: new BufferUniform(
          new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
          16,
          gl.FLOAT_MAT4
        ),
        // Node
        u_worldInverseTranspose: new BufferUniform(
          new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
          16,
          gl.FLOAT_MAT4
        ),
        // Light
        u_lightColor: new BufferUniform(
          new Float32Array([1, 1, 1, 1]),
          4,
          gl.FLOAT_VEC4
        ),
      };

      gl.useProgram(program);

      const scene = new Scene();
      const geometry = new CubeGeometry(2);

      // const material = new BasicMaterial({color:new Color(0xff00ffff)});
      const texture = await TextureLoader.load("res/f-texture.png");
      const material = new PhongMaterial({
        ambient: new Color(0xa0a0a000),
        diffuse: texture,
        specular: new Color(0xffffffff),
        shinyness: 32,
        specularFactor: 0.5,
      });

      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      let degrees = 0;
      const inc = 1;
      function render() {
        degrees += inc;
        if (cameraInstance == null) return
        
        cameraInstance.setOrbitControl(degrees, degrees);
        dummyUniformsData.u_projectionMatrix.set(
          0,
          M4.flatten(cameraInstance.viewProjectionMatrix)
        );
        WebGLUtils.setUniforms(programInfo, dummyUniformsData);

        renderer.render(scene, null);
        requestAnimationFrame(render);
      }
      render();

      console.log("Done");
    };

    runWebGL();
  }, []);

  return <canvas id="webgl-canvas" className="w-full h-full" ref={canvasRef} />;
};

export default RenderedComponent;
