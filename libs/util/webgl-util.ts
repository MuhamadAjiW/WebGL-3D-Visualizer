import { ProgramInfo } from "../base-types/webgl-program-info";
import { BufferUniform } from "../class/webgl/uniform";
import { BufferAttribute } from "../class/webgl/attribute";
import { GLTexture, UniformSetterWebGLType } from "../base-types/webgl-types";

export type UniformSingleDataType =
  | BufferUniform
  | GLfloat
  | GLTexture
  | Float32Array
  | Boolean
  | number[];
export type UniformDataType = [UniformSingleDataType] | number[];
export type UniformSetters = (...v: UniformDataType) => void;
export type UniformMapSetters = { [key: string]: UniformSetters };

export type AttributeSingleDataType = BufferAttribute | Float32Array | number[];
export type AttributeDataType = [AttributeSingleDataType] | number[];
export type AttributeSetters = (...v: AttributeDataType) => void;
export type AttributeMapSetters = { [key: string]: AttributeSetters };

export type ShaderUniforms = {
  // World information
  u_projection?: UniformSingleDataType;
  u_view?: UniformSingleDataType;
  u_world?: UniformSingleDataType;
  u_normalMat?: UniformSingleDataType;
  u_lightPos?: UniformSingleDataType;
  u_cameraPos?: UniformSingleDataType;

  // Material information
  u_materialType?: UniformSingleDataType;

  u_ambientColor?: UniformSingleDataType;

  u_diffuseColor?: UniformSingleDataType;
  u_diffuseTexture?: UniformSingleDataType;

  u_specularColor?: UniformSingleDataType;
  u_specularTexture?: UniformSingleDataType;
  u_shininess?: UniformSingleDataType;

  u_normalActive?: UniformSingleDataType;
  u_normalTexture?: UniformSingleDataType;

  u_parallaxActive?: UniformSingleDataType;
  u_parallaxTexture?: UniformSingleDataType;
  u_parallaxHeight?: UniformSingleDataType;

  u_displacementActive?: UniformSingleDataType;
  u_displacementTexture?: UniformSingleDataType;
  u_displacementHeight?: UniformSingleDataType;
};
export type ShaderAttributes = {
  a_position?: AttributeSingleDataType;
  a_normal?: AttributeSingleDataType;
  a_texCoord?: AttributeSingleDataType;
  a_tangent?: AttributeSingleDataType;
  a_bitangent?: AttributeSingleDataType;
};

export class WebGLUtil {
  public static createShader(
    gl: WebGLRenderingContext,
    shaderType: GLenum,
    source: string
  ): WebGLShader {
    var shader: WebGLShader = gl.createShader(shaderType) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      gl.deleteShader(shader);
      throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  public static createProgram(
    gl: WebGLRenderingContext,
    fragmentShader: WebGLShader,
    vertexShader: WebGLShader
  ): WebGLProgram {
    var program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      gl.deleteProgram(program);
      throw "program failed to link:" + gl.getProgramInfoLog(program);
    }

    return program;
  }

  // UNIFORM SETTERS
  public static createUniformSetters(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): UniformMapSetters {
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

        if (v instanceof BufferUniform) {
          if (v.data instanceof GLTexture) {
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](
              loc,
              v.data.unit
            );
            gl.activeTexture(gl.TEXTURE0 + v.data.unit);
            gl.bindTexture(gl.TEXTURE_2D, v.data.webGLTexture);
            return;
          }

          if (typeof v.data === "number") {
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v.data);
            return;
          }

          if (type >= WebGLRenderingContext.FLOAT_MAT2) {
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](
              loc,
              false,
              v.data
            );
            return;
          }

          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v.data);
          return;
        }

        if (v instanceof GLTexture) {
          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v.unit);
          gl.activeTexture(gl.TEXTURE0 + v.unit);
          gl.bindTexture(gl.TEXTURE_2D, v.webGLTexture);
          return;
        }

        if (v instanceof Float32Array) {
          if (type >= WebGLRenderingContext.FLOAT_MAT2) {
            (gl as any)[`uniform${UniformSetterWebGLType[type]}`](
              loc,
              false,
              v
            );
            return;
          }
          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
          return;
        }

        if (typeof v === "number") {
          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
          return;
        }

        if (type >= WebGLRenderingContext.FLOAT_MAT2) {
          (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, false, v);
          return;
        }
        (gl as any)[`uniform${UniformSetterWebGLType[type]}`](loc, v);
        return;
      };
    }

    const uniformSetters: any = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniformSetters[info.name] = createUniformSetter(info);
    }
    return uniformSetters;
  }

  public static setUniform(
    programInfo: ProgramInfo,
    uniformName: keyof ShaderUniforms,
    ...data: UniformDataType
  ) {
    const setters = programInfo.uniformSetters;

    if (uniformName in setters) {
      const shaderName = `${uniformName}`;
      setters[shaderName](...data);
    }
  }
  public static setUniforms(
    programInfo: ProgramInfo,
    uniforms: ShaderUniforms
  ) {
    for (let uniformName in uniforms) {
      const key = uniformName as keyof ShaderUniforms;
      if (uniforms[uniformName as keyof ShaderUniforms] != undefined) {
        this.setUniform(programInfo, key, uniforms[key]!);
      }
    }
  }

  // ATTRIBUTE SETTERS
  public static createAttributeSetters(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): AttributeMapSetters {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
      // console.log(info.name);

      // Initialization Time
      const loc = gl.getAttribLocation(program, info.name);
      const buf = gl.createBuffer();
      return (...values) => {
        // Render Time (saat memanggil setAttributes() pada render loop)
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        const v = values[0];

        if (v instanceof BufferAttribute) {
          // Data Changed Time (note that buffer is already binded)
          // v.consume();
          gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);

          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(
            loc,
            v.size,
            v.dtype,
            v.normalize,
            v.stride,
            v.offset
          );
        } else {
          // Apparently this is for disabling, easily misunderstood
          gl.disableVertexAttribArray(loc);
          if (v instanceof Float32Array) {
            (gl as any)[`vertexAttrib${v.length}fv`](loc, v);
          } else {
            (gl as any)[`vertexAttrib${values.length}f`](loc, ...values);
          }
        }
      };
    }

    const attribSetters: any = {};
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
      const info = gl.getActiveAttrib(program, i);
      if (!info) continue;
      attribSetters[info.name] = createAttributeSetter(info);
    }
    return attribSetters;
  }

  public static setAttribute(
    programInfo: ProgramInfo,
    attributeName: keyof ShaderAttributes,
    ...data: AttributeDataType
  ) {
    const setters = programInfo.attributeSetters;
    if (attributeName in setters) {
      setters[attributeName](...data);
    }
  }
  public static setAttributes(
    programInfo: ProgramInfo,
    attributes: ShaderAttributes
  ) {
    for (let attributeName in attributes) {
      const key = attributeName as keyof ShaderAttributes;
      if (attributes[attributeName as keyof ShaderAttributes] != undefined) {
        this.setAttribute(programInfo, key, attributes[key]!);
      }
    }
  }
}
