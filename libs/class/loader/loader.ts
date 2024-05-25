import { boolean, z } from "zod";
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
import { TextureLoader } from "../texture/texture-loader";

const ArrayIndex = z.array(z.number().int());

const ArrayNumber = z.array(z.number());

const Matrix = z.array(z.array(z.number()));

// const typedArraySchema = z.union([
//   z.instanceof(Float32Array),
//   z.instanceof(Uint8Array),
//   z.instanceof(Uint16Array),
//   z.instanceof(Uint32Array),
//   z.instanceof(Int8Array),
//   z.instanceof(Int16Array),
//   z.instanceof(Int32Array),
// ]);

const BufferAttributeSchema = z.object({
  _data: z.record(z.string(), z.number()),
  _size: z.number(),
  _dtype: z.number(),
});

// const BufferUniform = z.object({
//   data: z.union([typedArraySchema, z.number()]),
//   size: z.number(),
//   dtype: z.number(),
// });

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
      .record(
        z.object({
          id: z.string(),
          children: AnimationPathSchema,
        })
      )
      .optional(),
  })
);

const GLTFSchema = z.object({
  scene: z.number().int(),
  nodes: z.array(
    z.object({
      translation: ArrayNumber,
      rotation: ArrayNumber,
      scale: ArrayNumber,
      children: ArrayIndex,
      visible: z.boolean(),
      name: z.string(),
      cameraIndex: z.number().int().optional(), // cameras
      meshIndex: z.number().int().optional(), // meshes
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
      meshGeometry: z.number().int().optional(), // geometries
      meshMaterial: z.number().int().optional(), //materials
    })
  ),
  geometries: z.array(
    z.object({
      position: BufferAttributeSchema,
      texCoords: BufferAttributeSchema.optional(),
      smoothShade: z.boolean(),
      type: z.number().int(),
    })
  ),
  materials: z.array(
    z.object({
      id: z.string(),
      materialType: z.number(),
      normalTexture: z.number().int(), // textures
      parallaxTexture: z.number().int(), // textures
      diffuseTexture: z.number().int(), // textures
      specularTexture: z.number().int(), // textures
      ambient: ColorSchema.optional(),
      diffuse: ColorSchema.optional(),
      specular: ColorSchema.optional(),
      shininess: z.number(),
      useNormalTex: z.boolean(),
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
      frames: z.array(AnimationPathSchema), // animationpaths
    })
  ),
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
  private loadAnimationPathMap: Map<number, AnimationPath>;

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
    this.loadAnimationPathMap = new Map();
  }

  public save(scene: Scene) {
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

    const result = GLTFSchema.safeParse(this.savedData);
    if (result.success) {
      // console.log("Validation successful:", result.data);
    } else {
      console.error("Validation failed:", result.error.errors);
    }

    // Now savedData contains the serialized scene data
    return JSON.stringify(this.savedData, null, 2);
  }

  public saveAnimation(animationList: AnimationClip[]) {
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

    if (animationList.length > 0) {
      for (let i = 0; i < animationList.length; i++) {
        this.saveAnimationClip(animationList[i]);
      }
    }
    const result = GLTFSchema.safeParse(this.savedData);
    if (result.success) {
      // console.log("Validation successful:", result.data);
    } else {
      console.error("Validation failed:", result.error.errors);
    }

    // Now savedData contains the serialized scene data
    console.log(JSON.stringify(this.savedData, null, 2));
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
      texCoords: this.saveBufferAttribute(
        geometry.texCoords as BufferAttribute
      ),
      smoothShade: geometry.smoothShade,
      type: geometry.type,
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
      normalTexture: material.normalTexture
        ? this.saveTexture(material.normalTexture)
        : undefined,
      parallaxTexture: material.parallaxTexture
        ? this.saveTexture(material.parallaxTexture)
        : undefined,
      diffuseTexture: material.diffuseTexture
        ? this.saveTexture(material.diffuseTexture)
        : undefined,
      specularTexture: material.specularTexture
        ? this.saveTexture(material.specularTexture)
        : undefined,
      ambient: this.saveColor(material.ambient),
      diffuse: this.saveColor(material.diffuse),
      specular: this.saveColor(material.specular),
      shininess: material.shininess,
      useNormalTex: material.useNormalTex,
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
    // return a list of animation paths
    let ret = [];
    for (const path of pathList) {
      ret.push(this.saveAnimationPath(path));
    }
    return ret;
  }

  private saveAnimationPath(path: AnimationPath): any {
    const animationPathData: {
      id: string;
      keyframe?: {
        translation?: [number, number, number];
        rotation?: [number, number, number];
        scale?: [number, number, number];
      };
      children?: { [childName: string]: any };
    } = { id: this.generateUniqueId() };

    if (path.keyframe) {
      animationPathData.keyframe = this.saveTRS(path.keyframe);
    }

    if (path.children) {
      const childrenData: { [childName: string]: any } = {};
      for (const [childName, childPath] of Object.entries(path.children)) {
        childrenData[childName] = this.saveAnimationPath(childPath);
      }
      animationPathData.children = childrenData;
    }

    return animationPathData;
  }

  private generateUniqueId(): string {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  private saveTRS(keyframe: AnimationTRS) {
    return {
      ...(keyframe.translation && { translation: keyframe.translation }),
      ...(keyframe.rotation && { rotation: keyframe.rotation }),
      ...(keyframe.scale && { scale: keyframe.scale }),
    };
  }

  public async loadFromJson(jsonString: string): Promise<{
    scene: Scene;
  }> {
    this.savedData = JSON.parse(jsonString);

    let scene = await this.loadScene();

    // check valid
    const result = GLTFSchema.safeParse(this.savedData);
    if (result.success) {
      // console.log("Validation successful:", result.data);
    } else {
      console.error("Validation failed:", result.error.errors);
    }
    return {
      scene: scene,
    };
  }

  public loadAnimation(jsonString: string): AnimationClip[] {
    this.savedData = JSON.parse(jsonString);
    let animationClip = this.loadAnimationClip();
    const result = GLTFSchema.safeParse(this.savedData);
    if (result.success) {
      console.log("Validation successful:", result.data);
    } else {
      console.error("Validation failed:", result.error.errors);
    }
    return animationClip;
  }

  public async loadScene(): Promise<Scene> {
    let scene: Scene = new Scene();
    this.loadNodeMap = new Map();
    this.loadCameraMap = new Map();
    this.loadMeshMap = new Map();
    this.loadGeometryMap = new Map();
    this.loadMaterialMap = new Map();
    this.loadTextureMap = new Map();

    // Reconstruct nodes
    for (const [index, nodeData] of this.savedData.nodes.entries()) {
      const node: Object3D = await this.loadNode(
        nodeData,
        index == 0 ? true : false
      );
      this.loadNodeMap.set(index, node);
    }

    this.savedData.nodes.forEach((nodeData: any, index: number) => {
      let node: Object3D = this.loadNodeMap.get(index)!;
      this.loadChildren(node, nodeData.children);
    });

    scene = this.loadNodeMap.get(this.savedData.scene)!;

    // this.loadNodeMap.forEach((object: Object3D) => console.log(object));

    scene.computeWorldMatrix();

    return scene;
  }

  private async loadNode(
    nodeData: any,
    isScene: boolean = false
  ): Promise<Object3D> {
    let node;

    // Load cameras and meshes
    if ("cameraIndex" in nodeData) {
      node = this.loadCamera(nodeData.cameraIndex);
    } else if ("meshIndex" in nodeData) {
      node = await this.loadMesh(nodeData.meshIndex);
    } else if (isScene) {
      node = new Scene();
    } else {
      node = new Object3D();
    }

    node.position = new Vector3(nodeData.translation);
    node.rotation = new Quaternion(nodeData.rotation);
    node.scale = new Vector3(nodeData.scale);
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

  private async loadMesh(meshIndex: number): Promise<Mesh> {
    if (this.loadMeshMap.has(meshIndex)) {
      return this.loadMeshMap.get(meshIndex)!;
    }

    const meshData = this.savedData.meshes[meshIndex];
    const meshObject = {
      meshGeometry: this.loadGeometry(meshData.meshGeometry),
      meshMaterial: await this.loadMaterial(meshData.meshMaterial),
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

    geometry = new BufferGeometry();

    geometry.position = this.loadBufferAttribute(geometryData.position);
    geometry.texCoords = this.loadBufferAttribute(geometryData.texCoords);
    geometry.smoothShade = geometryData.smoothShade;

    geometry.calculateNormals();
    geometry.calculateTangents();

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

  private async loadMaterial(materialIndex: number): Promise<ShaderMaterial> {
    if (this.loadMaterialMap.has(materialIndex)) {
      return this.loadMaterialMap.get(materialIndex)!;
    }

    const materialData = this.savedData.materials[materialIndex];
    const materialObject = {
      id: materialData.id,
      materialType: materialData.materialType,
      normalTexture: await this.loadTexture(materialData.normalTexture),
      parallaxTexture: await this.loadTexture(materialData.parallaxTexture),
      diffuseTexture: await this.loadTexture(materialData.diffuseTexture),
      specularTexture: await this.loadTexture(materialData.specularTexture),
      ambient: this.loadColor(materialData.ambient),
      diffuse: this.loadColor(materialData.diffuse),
      specular: this.loadColor(materialData.specular),
      shininess: materialData.shininess,
      useNormalTex: materialData.useNormalTex,
    };

    let material: ShaderMaterial;

    if (materialObject.materialType == 0) {
      material = new BasicMaterial({
        normalTexture: materialObject.normalTexture,
        parallaxTexture: materialObject.parallaxTexture,
        diffuseTexture: materialObject.diffuseTexture,
        diffuseColor: materialObject.diffuse,
        useNormalTex: materialObject.useNormalTex,
      });
    } else {
      material = new PhongMaterial({
        normalTexture: materialObject.normalTexture,
        parallaxTexture: materialObject.parallaxTexture,
        diffuseTexture: materialObject.diffuseTexture,
        specularTexture: materialObject.specularTexture,
        ambient: materialObject.ambient,
        diffuse: materialObject.diffuse,
        specular: materialObject.specular,
        shinyness: materialObject.shininess,
        useNormalTex: materialObject.useNormalTex,
      });
    }

    this.loadMaterialMap.set(materialIndex, material);
    return material;
  }

  private async loadTexture(textureIndex: number): Promise<Texture> {
    if (this.loadTextureMap.has(textureIndex)) {
      return this.loadTextureMap.get(textureIndex)!;
    }

    const textureData = this.savedData.textures[textureIndex];
    console.log(textureData);
    const textureObject = {
      id: textureData.id,
      isActive: textureData.isActive,
      name: textureData.name,
      wrapS: textureData.wrapS,
      wrapT: textureData.wrapT,
      magFilter: textureData.magFilter,
      minFilter: textureData.minFilter,
      format: textureData.format,
      image: textureData.image,
      repeatS: textureData.repeatS,
      repeatT: textureData.repeatT,
      generateMipmaps: textureData.generateMipmaps,
    };

    let texture: Texture;

    texture = await TextureLoader.load(textureObject.image);
    texture.wrapS = textureObject.wrapS;
    texture.name = textureObject.name;
    texture.wrapS = textureObject.wrapS;
    texture.wrapT = textureObject.wrapT;
    texture.magFilter = textureObject.magFilter;
    texture.minFilter = textureObject.minFilter;
    texture.format = textureObject.format;
    texture.repeatS = textureObject.repeatS;
    texture.repeatT = textureObject.repeatT;
    texture.generateMipmaps = textureObject.generateMipmaps;

    this.loadTextureMap.set(textureIndex, texture);
    return texture;
  }

  private loadColor(color: any): Color {
    return new Color(color.r, color.g, color.b, color.a);
  }

  private loadAnimationClip(): AnimationClip[] {
    let animationClipList: AnimationClip[] = [];

    if (this.savedData.animations.length > 0) {
      this.savedData.animations.forEach((animationData: any) => {
        let animationClip: AnimationClip = {
          name: animationData.name,
          frames: this.loadAnimationPathList(animationData.frames),
        };
        animationClipList.push(animationClip);
      });
    }

    return animationClipList;
  }

  private loadAnimationPathList(animationPathDataList: any[]): AnimationPath[] {
    return animationPathDataList.map((pathData) =>
      this.loadAnimationPath(pathData)
    );
  }

  private loadAnimationPath(pathData: any): AnimationPath {
    const animationPath: AnimationPath = { id: pathData.id };

    if (pathData.keyframe) {
      let animationTRS: AnimationTRS = {
        ...(pathData.keyframe.translation && {
          translation: pathData.keyframe.translation,
        }),
        ...(pathData.keyframe.rotation && {
          rotation: pathData.keyframe.rotation,
        }),
        ...(pathData.keyframe.scale && { scale: pathData.keyframe.scale }),
      };
      animationPath.keyframe = animationTRS;
    }

    if (pathData.children) {
      let children: { [childName: string]: AnimationPath } = {};
      for (const [childName, childPathData] of Object.entries(
        pathData.children
      )) {
        children[childName] = this.loadAnimationPath(childPathData);
      }
      animationPath.children = children;
    }

    return animationPath;
  }

  public validateSceneData(sceneData: any) {
    return GLTFSchema.safeParse(sceneData);
  }
}
