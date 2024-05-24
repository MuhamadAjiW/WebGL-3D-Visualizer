export const WebGLType = {
  UNSIGNED_BYTE: "UNSIGNED_BYTE",
  UNSIGNED_SHORT: "UNSIGNED_SHORT",
  UNSIGNED_INT: "UNSIGNED_INT",
  BYTE: "BYTE",
  SHORT: "SHORT",
  INT: "INT",
  INT_VEC2: "INT_VEC2",
  INT_VEC3: "INT_VEC3",
  INT_VEC4: "INT_VEC4",
  FLOAT: "FLOAT",
  FLOAT_MAT2: "FLOAT_MAT2",
  FLOAT_MAT3: "FLOAT_MAT3",
  FLOAT_MAT4: "FLOAT_MAT4",
  FLOAT_VEC2: "FLOAT_VEC2",
  FLOAT_VEC3: "FLOAT_VEC3",
  FLOAT_VEC4: "FLOAT_VEC4",
  BOOL: "BOOL",
  BOOL_VEC2: "BOOL_VEC2",
  BOOL_VEC3: "BOOL_VEC3",
  BOOL_VEC4: "BOOL_VEC4",
  SAMPLER_2D: "SAMPLER_2D",
  SAMPLER_CUBE: "SAMPLER_CUBE",
};

export const UniformSetterWebGLType = {
  [WebGLRenderingContext.FLOAT]: "1f",
  [WebGLRenderingContext.FLOAT_VEC2]: "2fv",
  [WebGLRenderingContext.FLOAT_VEC3]: "3fv",
  [WebGLRenderingContext.FLOAT_VEC4]: "4fv",
  [WebGLRenderingContext.INT]: "1i",
  [WebGLRenderingContext.INT_VEC2]: "2i",
  [WebGLRenderingContext.INT_VEC3]: "3i",
  [WebGLRenderingContext.INT_VEC4]: "4i",
  [WebGLRenderingContext.BOOL]: "1i",
  [WebGLRenderingContext.BOOL_VEC2]: "2i",
  [WebGLRenderingContext.BOOL_VEC3]: "3i",
  [WebGLRenderingContext.BOOL_VEC4]: "4i",
  [WebGLRenderingContext.FLOAT_MAT2]: "Matrix2fv",
  [WebGLRenderingContext.FLOAT_MAT3]: "Matrix3fv",
  [WebGLRenderingContext.FLOAT_MAT4]: "Matrix4fv",
  [WebGLRenderingContext.SAMPLER_2D]: "1i",
};

export type TypedArray =
  | Float32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array;
export class GLTexture {
  unit: number;
  webGLTexture: WebGLTexture;

  constructor(unit: number, webGLTexture: WebGLTexture) {
    this.unit = unit;
    this.webGLTexture = webGLTexture;
  }
}
