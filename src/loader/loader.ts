import { z } from "zod";
import { CameraType } from "../../libs/class/camera-types";
import { Scene } from "@/libs/class/scene";

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
  data: z.union([typedArraySchema, z.number()]),
  size: z.number(),
  dtype: z.number(),
});

// Convert enum values to a string array for Zod
const CameraTypeSchema = z.enum([
  CameraType[CameraType.OBLIQUE],
  CameraType[CameraType.ORTOGRAPHIC],
  CameraType[CameraType.PERSPECTIVE],
]);

const Color = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  a: z.number(),
});

const AnimationTRS = z.object({
  translation: z.array(z.number()).optional(),
  rotation: z.array(z.number()).optional(),
  scale: z.array(z.number()).optional(),
});

const AnimationPath: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    keyframe: AnimationTRS.optional(),
    children: z.record(AnimationPath).optional(),
  })
);

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
      cameraIndex: ArrayIndex.optional(), // cameras
      meshIndex: ArrayIndex.optional(), // meshes
    })
  ),
  cameras: z.array(
    z.object({
      type: z.string(),
      // For camera
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
  meshes: z.array(
    z.object({
      // For mesh
      meshGeometry: ArrayIndex.optional(), // geometries
      meshMaterial: ArrayIndex.optional(), //materials
    })
  ),
  geometries: z.array(
    z.object({
      position: BufferAttribute.optional(),
      normal: BufferAttribute.optional(),
      texCoords: BufferAttribute.optional(),
    })
  ),
  materials: z.array(
    z.object({
      id: z.string(),
      materialType: z.number(),
      // Shader material has textures? tapi disini kah?
      texture: z.array(ArrayIndex), // textures
      ambient: Color.optional(),
      // Colors || Textures
      diffuse: ArrayIndex.optional(),
      specular: ArrayIndex.optional(),
      shininess: z.number().optional(),
    })
  ),
  textures: z.array(
    z.object({
      id: z.number().int(),
      // How?
      isActive: z.boolean(),
      name: z.string(),
      wrapS: z.number(),
      wrapT: z.number(),
      magFilter: z.number(),
      minFilter: z.number(),
      format: z.number(),
      // image uri
      image: z.string(),
      repeatS: z.number(),
      repeatT: z.number(),
      generateMipmaps: z.boolean(),
    })
  ),
  colors: z.array(Color),
  animations: z.array(
    z.object({
      name: z.string(),
      // animation path
      frames: z.array(ArrayIndex), // animationpaths
    })
  ),
  animationpaths: z.array(AnimationPath),
});

export class Loader {
  public save(scene: Scene) {
    // traverse scene tree
  }

  public load(): Scene {
    return new Scene();
  }
}
