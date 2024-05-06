import { AttributeMapSetters } from "./webgl-setters-attribute";
import { UniformMapSetters } from "./webgl-setters-uniform";

type ProgramInfo = {
  program: WebGLProgram,
  uniformSetters: UniformMapSetters,
  attributeSetters: AttributeMapSetters,
};

export type { ProgramInfo };
