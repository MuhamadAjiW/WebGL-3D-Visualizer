import { AttributeMapSetters, UniformMapSetters } from "../util/webgl-util";

type ProgramInfo = {
  program: WebGLProgram;
  uniformSetters: UniformMapSetters;
  attributeSetters: AttributeMapSetters;
};

export type { ProgramInfo };
