import { z } from "zod";
import { CameraType } from "../camera-types";

const ArrayIndex = z.array(z.number().int());

const ArrayNumber = z.array(z.number());

const Matrix = z.array(z.array(z.number()));

const typedArraySchema = z.union([
  z.instanceof(Float32Array),
  z.instanceof(Uint8Array),
  z.instanceof(Uint16Array),
  z.instanceof(Uint32Array),
  z.instanceof(Int8Array),
  z.instanceof(Int16Array),
  z.instanceof(Int32Array),
]);

const BufferAttribute = z.object({
  _data: typedArraySchema,
  _size: z.number(),
  _dtype: z.number(),
});

const BufferUniform = z.object({
  name: z.string(),
  value: BufferAttribute,
});

// Convert enum values to a string array for Zod
const CameraTypeSchema = z.enum([
  CameraType[CameraType.OBLIQUE],
  CameraType[CameraType.ORTOGRAPHIC],
  CameraType[CameraType.PERSPECTIVE],
]);

const GLTFSchema = z.object({
  scene: ArrayIndex,
  nodes: z.array(
    z.object({
      translation: ArrayNumber,
      rotation: ArrayNumber,
      scale: ArrayNumber,
      // column major
      localMatrix: Matrix,
      worldMatrix: Matrix,
      children: ArrayIndex,
      visible: z.boolean(),
      name: z.string(),
      meshGeometry: ArrayIndex.optional(),
      meshMaterial: ArrayIndex.optional(),
      cameraProjectionMatrix: Matrix.optional(),
      cameraDistance: z.number().optional(),
      cameraAngleX: z.number().optional(),
      cameraAngleY: z.number().optional(),
      cameraMatrix: Matrix.optional(),
      // Scene gimana ya?
      cameraType: CameraTypeSchema,
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
      near: z.number().optional(),
      far: z.number().optional(),
      fovY: z.number().optional(),
      aspect: z.number().optional(),
    })
  ),
  geometries: z.array(
    z.object({
      attributes: z.record(BufferUniform),
      indices: BufferAttribute.optional(),
    })
  ),
  materials: z.array(
    z.object({
      id: z.string(),
      materialType: z.number(),
      uniforms: z.record(BufferUniform),
    })
  ),
});

export class Loader {}
