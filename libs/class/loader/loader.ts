import { z } from "zod";
import { CameraType } from "../camera-types";
import { Scene } from "@/libs/class/scene";
import Object3D from "@/libs/class/object3d";
import Camera from "@/libs/class/camera";
import { Mesh } from "@/libs/class/mesh";
import ObliqueCamera from "@/libs/class/oblique-camera";
import OrthographicCamera from "@/libs/class/orthographic-camera";
import PerspectiveCamera from "@/libs/class/perspective-camera";
import { BufferGeometry } from "@/libs/class/geometry/geometry";
import { ShaderMaterial } from "@/libs/class/material/shader-material";
import { BufferAttribute } from "@/libs/class/webgl/attribute";
import { Texture } from "@/libs/class/texture/texture";
import { BasicMaterial } from "@/libs/class/material/basic-material";
import { Color } from "@/libs/base-types/color";
import { PhongMaterial } from "@/libs/class/material/phong-material";
import Vector3 from "@/libs/base-types/vector3";
import { Quaternion } from "@/libs/base-types/quaternion";
import { BlockGeometry } from "../geometry/block-geometry";
import { GeometryType } from "../geometry/geometry-types";
import { CubeGeometry } from "../geometry/cube-geometry";
import { PlaneGeometry } from "../geometry/plane-geometry";
import { HollowBlockGeometry } from "../geometry/hollow-block-geometry";
import { HollowPlaneGeometry } from "../geometry/hollow-plane-geometry";
import {
  AnimationClip,
  AnimationPath,
  AnimationTRS,
} from "@/libs/base-types/animation";

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

const BufferAttributeSchema = z.object({
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

const ColorSchema = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  a: z.number(),
});

const AnimationTRSSchema = z.object({
  translation: z.array(z.number()).optional(),
  rotation: z.array(z.number()).optional(),
  scale: z.array(z.number()).optional(),
});

const AnimationPathSchema: z.ZodSchema<any> = z.lazy(() =>
  z.object({
    keyframe: AnimationTRSSchema.optional(),
    children: z
      .object({
        name: z.string(),
        child: ArrayIndex,
      })
      .optional(),
  })
);

const GLTFSchema = z.object({
  scene: ArrayIndex,
  nodes: z.array(
    z.object({
      translation: ArrayNumber,
      rotation: ArrayNumber,
      scale: ArrayNumber,
      children: ArrayIndex,
      visible: z.boolean(),
      name: z.string(),
      cameraIndex: ArrayIndex.optional(), // cameras
      meshIndex: ArrayIndex.optional(), // meshes
    })
  ),
  cameras: z.array(
    z.object({
      // For camera
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
      position: BufferAttributeSchema.optional(),
      normal: BufferAttributeSchema.optional(),
      texCoords: BufferAttributeSchema.optional(),
      type: z.number().int(),
      width: z.number().optional(),
      height: z.number().optional(),
      length: z.number().optional(),
    })
  ),
  materials: z.array(
    z.object({
      id: z.string(),
      materialType: z.number(),
      // Shader material has textures? tapi disini kah?
      texture: ArrayIndex, // textures
      ambient: ColorSchema.optional(),
      diffuse: ColorSchema.optional(),
      specular: ColorSchema.optional(),
      shininess: z.number(),
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
  animations: z.array(
    z.object({
      name: z.string(),
      // animation path
      frames: z.array(ArrayIndex), // animationpaths
    })
  ),
  animationpaths: z.array(AnimationPathSchema),
});

export class Loader {
  private savedData: any = {};

  private nodeMap: Map<Object3D, number>;
  private cameraMap: Map<Camera, number>;
  private meshMap: Map<Mesh, number>;
  private geometryMap: Map<BufferGeometry, number>;
  private materialMap: Map<ShaderMaterial, number>;
  private textureMap: Map<Texture, number>;
  private animationPathMap: Map<AnimationPath, number>;
  private loadNodeMap: Map<number, Object3D>;
  private loadCameraMap: Map<number, Camera>;
  private loadMeshMap: Map<number, Mesh>;
  private loadGeometryMap: Map<number, BufferGeometry>;
  private loadMaterialMap: Map<number, ShaderMaterial>;
  private loadTextureMap: Map<number, Texture>;

  constructor() {
    this.nodeMap = new Map();
    this.cameraMap = new Map();
    this.meshMap = new Map();
    this.geometryMap = new Map();
    this.materialMap = new Map();
    this.textureMap = new Map();
    this.animationPathMap = new Map();
    this.loadNodeMap = new Map();
    this.loadCameraMap = new Map();
    this.loadMeshMap = new Map();
    this.loadGeometryMap = new Map();
    this.loadMaterialMap = new Map();
    this.loadTextureMap = new Map();
  }

  public save(scene: Scene, animationList: AnimationClip[] = []) {
    // traverse scene tree
    this.savedData = {
      scene: null,
      nodes: [],
      cameras: [],
      meshes: [],
      geometries: [],
      materials: [],
      textures: [],
      colors: [],
      animations: [],
      animationpaths: [],
    };

    this.savedData.scene = this.traverseNode(scene);

    // Save animation list
    if (animationList.length > 0) {
      for (let i = 0; i < animationList.length; i++) {
        this.saveAnimationClip(animationList[i]);
      }
    }

    // Now savedData contains the serialized scene data
    console.log(JSON.stringify(this.savedData));
  }

  // Recursive method to traverse and save a node
  private traverseNode(node: Object3D): number {
    if (this.nodeMap.has(node)) {
      // If node is already saved, return its index
      return this.nodeMap.get(node)!;
    }

    const nodeData = {
      translation: (node.position as Vector3).toJSON(),
      rotation: (node.rotation as Quaternion).toJSON(),
      scale: (node.scale as Vector3).toJSON(),
      children: [],
      visible: node.visible,
      name: node.name,
      cameraIndex: node instanceof Camera ? this.saveCamera(node) : undefined,
      meshIndex: node instanceof Mesh ? this.saveMesh(node) : undefined,
    };

    // Save the node data
    const nodeIndex = this.savedData.nodes.length;
    this.savedData.nodes.push(nodeData);
    this.nodeMap.set(node, nodeIndex);
    // TODO: NODE DATA POSITION MASIH HARDCODE

    // Traverse and save children nodes
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        const childIndex = this.traverseNode(child);
        (nodeData.children as number[]).push(childIndex);
      });
    }

    return nodeIndex;
  }

  public saveCamera(camera: Camera): number {
    if (this.cameraMap.has(camera)) {
      return this.cameraMap.get(camera)!;
    }

    const cameraData = {
      cameraType:
        camera instanceof ObliqueCamera
          ? "Oblique"
          : camera instanceof OrthographicCamera
          ? "Ortographic"
          : camera instanceof PerspectiveCamera
          ? "Perspective"
          : undefined,
      top:
        camera instanceof ObliqueCamera || camera instanceof OrthographicCamera
          ? camera.top
          : undefined,
      bottom:
        camera instanceof ObliqueCamera || camera instanceof OrthographicCamera
          ? camera.bottom
          : undefined,
      left:
        camera instanceof ObliqueCamera || camera instanceof OrthographicCamera
          ? camera.left
          : undefined,
      right:
        camera instanceof ObliqueCamera || camera instanceof OrthographicCamera
          ? camera.right
          : undefined,
      near:
        camera instanceof ObliqueCamera ||
        camera instanceof OrthographicCamera ||
        camera instanceof PerspectiveCamera
          ? camera.near
          : undefined,
      far:
        camera instanceof ObliqueCamera ||
        camera instanceof OrthographicCamera ||
        camera instanceof PerspectiveCamera
          ? camera.far
          : undefined,
      fovY: camera instanceof PerspectiveCamera ? camera.fovY : undefined,
      aspect: camera instanceof PerspectiveCamera ? camera.aspect : undefined,
    };

    // Save the camera data
    const cameraIndex = this.savedData.cameras.length;
    this.savedData.cameras.push(cameraData);
    this.cameraMap.set(camera, cameraIndex);

    return cameraIndex;
  }

  private saveMesh(mesh: Mesh): number {
    if (this.meshMap.has(mesh)) {
      return this.meshMap.get(mesh)!;
    }

    const meshData = {
      meshGeometry: this.saveGeometry(mesh.geometry),
      meshMaterial: this.saveMaterial(mesh.material),
    };

    const meshIndex = this.savedData.meshes.length;
    this.savedData.meshes.push(meshData);
    this.meshMap.set(mesh, meshIndex);

    return meshIndex;
  }

  private saveGeometry(geometry: BufferGeometry): number {
    if (this.geometryMap.has(geometry)) {
      return this.geometryMap.get(geometry)!;
    }

    const geometryData = {
      position: this.saveBufferAttribute(geometry.position as BufferAttribute),
      normal: this.saveBufferAttribute(geometry.normal as BufferAttribute),
      texCoords: this.saveBufferAttribute(
        geometry.texCoords as BufferAttribute
      ),
      type: geometry.type,
      width: geometry.width,
      height: geometry.height,
      length: geometry.length,
    };

    const geometryIndex = this.savedData.geometries.length;
    this.savedData.geometries.push(geometryData);
    this.geometryMap.set(geometry, geometryIndex);

    return geometryIndex;
  }

  private saveBufferAttribute(attribute: BufferAttribute): any {
    return {
      _data: attribute.data,
      _size: attribute.size,
      _dtype: attribute.dtype,
    };
  }

  private saveMaterial(material: any): number {
    if (this.materialMap.has(material)) {
      return this.materialMap.get(material)!;
    }

    const materialData = {
      id: material.id,
      materialType: material.materialType,
      texture: material.texture
        ? this.saveTexture(material.texture)
        : undefined,
      ambient: this.saveColor(material.ambient),
      diffuse: this.saveColor(material.diffuse),
      specular: this.saveColor(material.specular),
      shininess: material.shininess,
    };

    // Save the material data
    const materialIndex = this.savedData.materials.length;
    this.savedData.materials.push(materialData);
    this.materialMap.set(material, materialIndex);

    return materialIndex;
  }

  private saveTexture(texture: any): number {
    if (this.textureMap.has(texture)) {
      return this.textureMap.get(texture)!;
    }

    const textureData = {
      id: texture.id,
      isActive: texture.isActive,
      name: texture.name,
      wrapS: texture.wrapS,
      wrapT: texture.wrapT,
      magFilter: texture.magFilter,
      minFilter: texture.minFilter,
      format: texture.format,
      image: texture.image_path,
      repeatS: texture.repeatS,
      repeatT: texture.repeatT,
      generateMipmaps: texture.generateMipmaps,
    };

    const textureIndex = this.savedData.textures.length;
    this.savedData.textures.push(textureData);
    this.textureMap.set(texture, textureIndex);

    return textureIndex;
  }

  private saveColor(color: Color) {
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a,
    };
  }

  private saveAnimationClip(clip: AnimationClip) {
    const animationData = {
      name: clip.name,
      frames: this.saveAnimationPathList(clip.frames),
    };

    this.savedData.animations.push(animationData);
  }

  private saveAnimationPathList(pathList: AnimationPath[]) {
    // return a list of animation path indexes
    let ret = [];
    for (const path of pathList) {
      ret.push(this.saveAnimationPath(path));
    }
    return ret;
  }

  private saveAnimationPath(path: AnimationPath) {
    if (this.animationPathMap.has(path)) {
      return this.animationPathMap.get(path)!;
    }

    const animationPathData = {
      keyframe: path.keyframe ? this.saveTRS(path.keyframe) : null,
      children: path.children
        ? this.saveAnimationPathChild(path.children)
        : null,
    };

    // return index of animation path
    const animationIndex = this.savedData.animationpaths.length;
    this.savedData.animationpaths.push(animationPathData);
    this.animationPathMap.set(path, animationIndex);

    return animationIndex;
  }

  private saveTRS(keyframe: AnimationTRS) {
    return {
      translation: keyframe.translation,
      rotation: keyframe.rotation,
      scale: keyframe.scale,
    };
  }

  private saveAnimationPathChild(children: any) {
    const childData = {
      name: children.name,
      child: this.saveAnimationPath(children.child),
    };
    return childData;
  }

  public loadFromJson(jsonString: string): Scene {
    this.savedData = JSON.parse(jsonString);
    return this.load();
  }

  public load(): Scene {
    let scene: Scene = new Scene();
    this.loadNodeMap = new Map();
    this.loadCameraMap = new Map();
    this.loadMeshMap = new Map();
    this.loadGeometryMap = new Map();
    this.loadMaterialMap = new Map();
    this.loadTextureMap = new Map();

    // Reconstruct nodes
    this.savedData.nodes.forEach((nodeData: any, index: number) => {
      this.loadNodeMap.set(
        index,
        this.loadNode(nodeData, index == 0 ? true : false)
      );
    });

    this.savedData.nodes.forEach((nodeData: any, index: number) => {
      let node: Object3D = this.loadNodeMap.get(index)!;
      this.loadChildren(this.loadNodeMap.get(index)!, nodeData.children);
    });

    scene = this.loadNodeMap.get(this.savedData.scene)!;

    this.loadNodeMap.forEach((object: Object3D) => console.log(object));

    scene.computeWorldMatrix();

    // check valid
    const result = GLTFSchema.safeParse(this.savedData);
    if (result.success) {
      console.log("Validation successful:", result.data);
    } else {
      console.error("Validation failed:", result.error.errors);
    }
    return scene;
  }

  private loadNode(nodeData: any, isScene: boolean = false): Object3D {
    let node;
    // Load cameras and meshes
    if ("cameraIndex" in nodeData) {
      node = this.loadCamera(nodeData.cameraIndex);
    } else if ("meshIndex" in nodeData) {
      node = this.loadMesh(nodeData.meshIndex);
    } else if (isScene) {
      node = new Scene();
    } else {
      node = new Object3D();
    }

    node.position = new Vector3(...(JSON.parse(nodeData.translation) as []));
    node.rotation = new Quaternion(...(JSON.parse(nodeData.rotation) as []));
    node.scale = new Vector3(...(JSON.parse(nodeData.scale) as []));
    node.visible = nodeData.visible;
    node.name = nodeData.name;

    return node;
  }

  private loadChildren(node: Object3D, nodeDataChildren: any) {
    nodeDataChildren.forEach((index: number) => {
      let child = this.loadNodeMap.get(index)!;
      node.children.push(child);
      child.parent = node;
    });
  }

  private loadCamera(cameraIndex: number): Camera {
    if (this.loadCameraMap.has(cameraIndex)) {
      return this.loadCameraMap.get(cameraIndex)!;
    }

    const cameraData = this.savedData.cameras[cameraIndex];
    const cameraObject = {
      cameraType: cameraData.cameraType,
      top: cameraData.top,
      bottom: cameraData.bottom,
      left: cameraData.left,
      right: cameraData.right,
      near: cameraData.near,
      far: cameraData.far,
      fovY: cameraData.fovY,
      aspect: cameraData.aspect,
    };

    let camera: Camera;
    if (cameraObject.cameraType == CameraType.OBLIQUE) {
      camera = new ObliqueCamera(
        cameraObject.left,
        cameraObject.right,
        cameraObject.bottom,
        cameraObject.top,
        cameraObject.near,
        cameraObject.far
      );
    } else if (cameraObject.cameraType == CameraType.ORTOGRAPHIC) {
      camera = new OrthographicCamera(
        cameraObject.left,
        cameraObject.right,
        cameraObject.bottom,
        cameraObject.top,
        cameraObject.near,
        cameraObject.far
      );
    } else if (cameraObject.cameraType == CameraType.PERSPECTIVE) {
      camera = new PerspectiveCamera(
        cameraData.aspect,
        cameraData.fovY,
        cameraData.near,
        cameraData.far
      );
    } else {
      camera = new PerspectiveCamera(
        cameraData.aspect,
        cameraData.fovY,
        cameraData.near,
        cameraData.far
      );
    }

    this.loadCameraMap.set(cameraIndex, camera);
    return camera;
  }

  private loadMesh(meshIndex: number): Mesh {
    if (this.loadMeshMap.has(meshIndex)) {
      return this.loadMeshMap.get(meshIndex)!;
    }

    const meshData = this.savedData.meshes[meshIndex];
    const meshObject = {
      meshGeometry: this.loadGeometry(meshData.meshGeometry),
      meshMaterial: this.loadMaterial(meshData.meshMaterial),
    };

    let mesh = new Mesh(
      meshObject.meshGeometry as BufferGeometry,
      meshObject.meshMaterial as ShaderMaterial
    );

    this.loadMeshMap.set(meshIndex, mesh);
    return mesh;
  }

  private loadGeometry(geometryIndex: number): BufferGeometry {
    if (this.loadGeometryMap.has(geometryIndex)) {
      return this.loadGeometryMap.get(geometryIndex)!;
    }

    const geometryData = this.savedData.geometries[geometryIndex];
    let geometry;

    if (geometryData.type == 0) {
      geometry = new BlockGeometry(
        geometryData.width,
        geometryData.height,
        geometryData.length
      );
    } else if (geometryData.type == 1) {
      geometry = new CubeGeometry(geometryData.width);
    } else if (geometryData.type == 2) {
      geometry = new PlaneGeometry(geometryData.width, geometryData.height);
    } else if (geometryData.type == 3) {
      geometry = new HollowBlockGeometry(
        geometryData.width,
        geometryData.height,
        geometryData.length
      );
    } else if (geometryData.type == 4) {
      geometry = new HollowPlaneGeometry(
        geometryData.width,
        geometryData.height
      );
    } else {
      geometry = new BufferGeometry();
    }

    geometry.position = this.loadBufferAttribute(geometryData.position);
    geometry.normal = this.loadBufferAttribute(geometryData.normal);
    geometry.texCoords = this.loadBufferAttribute(geometryData.texCoords);

    this.loadGeometryMap.set(geometryIndex, geometry);
    return geometry;
  }

  private loadBufferAttribute(attributeData: any): BufferAttribute {
    return new BufferAttribute(
      new Float32Array(Object.values(attributeData._data)),
      attributeData._size,
      {
        dtype: attributeData._dtype,
      }
    );
  }

  private loadMaterial(materialIndex: number): ShaderMaterial {
    if (this.loadMaterialMap.has(materialIndex)) {
      return this.loadMaterialMap.get(materialIndex)!;
    }

    const materialData = this.savedData.materials[materialIndex];
    const materialObject = {
      id: materialData.id,
      materialType: materialData.materialType,
      texture: this.loadTexture(materialData.texture),
      ambient: this.loadColor(materialData.ambient),
      diffuse: this.loadColor(materialData.diffuse),
      specular: this.loadColor(materialData.specular),
      shininess: materialData.shininess,
    };

    let material: ShaderMaterial;

    if (materialObject.materialType == 0) {
      material = new BasicMaterial({
        texture: materialObject.texture,
        color: materialObject.diffuse,
      });
    } else {
      material = new PhongMaterial({
        texture: materialObject.texture,
        ambient: materialObject.ambient,
        diffuse: materialObject.diffuse,
        specular: materialObject.specular,
        shinyness: materialObject.shininess,
      });
    }

    this.loadMaterialMap.set(materialIndex, material);
    return material;
  }

  private loadTexture(textureIndex: number): Texture {
    if (this.loadTextureMap.has(textureIndex)) {
      return this.loadTextureMap.get(textureIndex)!;
    }

    const textureData = this.savedData.textures[textureIndex];
    const textureObject = {
      id: textureData.id,
      isActive: textureData.isActive,
      name: textureData.name,
      wrapS: textureData.wrapS,
      wrapT: textureData.wrapT,
      magFilter: textureData.magFilter,
      minFilter: textureData.minFilter,
      format: textureData.format,
      image_path: textureData.image_path,
      repeatS: textureData.repeatS,
      repeatT: textureData.repeatT,
      generateMipmaps: textureData.generateMipmaps,
    };

    const texture = new Texture({
      image: new Image(),
      wrapS: textureObject.wrapS,
      wrapT: textureObject.wrapT,
      magFilter: textureObject.magFilter,
      minFilter: textureObject.minFilter,
      format: textureObject.format,
      repeatS: textureObject.repeatS,
      repeatT: textureObject.repeatT,
      generateMipmaps: textureObject.generateMipmaps,
    });
    texture.name = textureObject.name;
    texture.isActive = textureObject.isActive;
    texture.image_path = textureObject.image_path;
    texture.image.src = textureObject.image_path;

    this.loadTextureMap.set(textureIndex, texture);
    return texture;
  }

  private loadColor(color: any): Color {
    return new Color(color.r, color.g, color.b, color.a);
  }

  public validateSceneData(sceneData: any) {
    return GLTFSchema.safeParse(sceneData);
  }
}
