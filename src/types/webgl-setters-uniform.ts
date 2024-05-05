import { BufferUniform } from "../class/webgl/uniform";
import { ProgramInfo } from "./webgl-program-info";
import { UniformSetterWebGLType } from "./webgl-types";

type UniformSingleDataType = BufferUniform | GLfloat | Float32Array | number[];
type UniformDataType = [UniformSingleDataType] | number[];
type UniformSetters = (...v: UniformDataType) => void;
type UniformMapSetters = {[key: string]: UniformSetters};

// The use of any here is due to the modifications done to the gl type
function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram): UniformMapSetters {
  function createUniformSetter(info: WebGLActiveInfo): UniformSetters {
    const loc = gl.getUniformLocation(program, info.name);
    const buf = gl.createBuffer();
    return (...values) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      const type = info.type as keyof typeof UniformSetterWebGLType;
      const v = values[0];
      
      // console.log(v);
      // console.log(info.name);
      // console.log(`${type}`);
      // console.log(`uniform${UniformSetterWebGLType[type]}`);

      if(v instanceof BufferUniform){
        if(v.isDirty){
          v.consume();

          if (typeof v.data === 'number'){
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
          } else{
            if (type >= WebGLRenderingContext.FLOAT_MAT2){
              (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, false, v.data);
            }
            else{
              (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v.data);
            }
          }
        }
      } 
      else{
        if (v instanceof Float32Array){
          if (type >= WebGLRenderingContext.FLOAT_MAT2){
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, false, v);
          }
          else{
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
          }
        } else if (typeof v === 'number'){
          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
        } else{
          if (type >= WebGLRenderingContext.FLOAT_MAT2){
              (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, false, v);
          }
          else{
              (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
          }
        }
      }
    }
  }

  const uniformSetters: any = {};
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; i ++){
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    uniformSetters[info.name] = createUniformSetter(info);
  }
  return uniformSetters;
}

function setUniform(programInfo: ProgramInfo, uniformName: string, ...data: UniformDataType) {
  const setters = programInfo.uniformSetters;
  if (uniformName in setters) {
    const shaderName = `${uniformName}`;
    setters[shaderName](...data);
  }
}
function setUniforms(
  programInfo: ProgramInfo,
  uniforms: {[uniformName: string]: UniformSingleDataType},
) {
  for (let uniformName in uniforms)
    setUniform(programInfo, uniformName, uniforms[uniformName]);
}

export type { UniformMapSetters };
export { setUniforms, setUniform, createUniformSetters };