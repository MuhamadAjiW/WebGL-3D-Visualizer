"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";
import TreeView from "@/components/ui/TreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import Controller from "@/components/ui/Controller";
import { useState } from "react";
import CameraController from "@/components/camera/CameraController";
import { SelectChangeEvent } from "@mui/material";
import { NodeSchema, SceneSchema } from "@/types/ui";
import { convertGLTFToTreeView, convertLoadToTree, findMeshById } from "@/libs/helper";

export default function Home() {
  // load dummy data
  const dummyData = {
    scene: 0,
    nodes: [
      {
        translation: [1, 0, 1],
        rotation: [1, 1, 0],
        scale: [1, 1, 1],
        localMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        worldMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        children: [1, 2],
        visible: true,
        name: "Node 1",
        cameraIndex: 0,
        meshIndex: 0,
      },
      {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        localMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        worldMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        children: [],
        visible: true,
        name: "Node 2",
        cameraIndex: 0,
        meshIndex: 0,
      },
      {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        localMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        worldMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        children: [],
        visible: true,
        name: "Node 3",
        cameraIndex: 0,
        meshIndex: 0,
      },
      {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        localMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        worldMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        children: [],
        visible: true,
        name: "Node 4",
        cameraIndex: 0,
        meshIndex: 0,
      },
    ],
    cameras: [
      {
        type: "perspective",
        cameraProjectionMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        cameraDistance: 10,
        cameraAngleX: 0,
        cameraAngleY: 0,
        cameraMatrix: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
        cameraType: "perspectiveCamera",
        top: 1,
        bottom: -1,
        left: -1,
        right: 1,
        near: 1,
        far: 2000,
        fovY: 45,
        aspect: 30,
      },
    ],
    meshes: [
      {
        meshGeometry: 0,
        meshMaterial: 0,
      },
    ],
    geometries: [
      {
        attributes: { position: [0, 0, 0], normal: [0, 0, 1] },
        geometryType: 0,
        width: 1,
        height: 1,
        length: 1,
      },
    ],
    materials: [
      {
        id: "Material 1",
        materialType: 0,
        uniforms: { color: [1, 1, 1] },
        textures: [0],
        color: [1, 1, 1],
        ambient: [0.2, 0.2, 0.2],
        diffuse: 0,
        specular: 0,
        shinyness: 30,
        specularFactor: 1,
      },
    ],
    textures: [
      {
        id: 0,
        glTexture: null,
        isActive: true,
        name: "Texture 1",
        wrapS: 10497,
        wrapT: 10497,
        magFilter: 9729,
        minFilter: 9987,
        format: 6408,
        image: "image.jpg",
        repeatS: 1,
        repeatT: 1,
        generateMipmaps: true,
      },
    ],
    colors: [[1, 1, 1]],
    animations: [
      {
        name: "Animation 1",
        frames: [0],
      },
    ],
    animationpaths: [
      {
        name: "AnimationPath 1",
        keys: [
          {
            time: 0,
            value: [0, 0, 0],
          },
        ],
      },
    ],
  };

  const nodesData = dummyData.nodes;
  const cameraData = dummyData.cameras;
  const meshes = dummyData.meshes;
  const geometries = dummyData.geometries;
  const materials = dummyData.materials;
  const textures = dummyData.textures;
  const animations = dummyData.animations;
  const animationPath = dummyData.animationpaths;

  let indexDict: { [key: number]: boolean } = {};

  nodesData.forEach((node, index) => {
    indexDict[index] = true;
  });

  let nodeTree = nodesData
    .map((_, index) => convertLoadToTree(indexDict, nodesData, index))
    .filter((node) => node !== undefined);

  const GLTFTree = {
    id: `scene-${dummyData.scene}`,
    name: `Scene ${dummyData.scene}`,
    children: nodeTree
  };

  const treeItems: TreeViewBaseItem[] = [convertGLTFToTreeView(GLTFTree)];

  const [isComponentExpanded, setIsComponentExpanded] = useState<boolean>(true);
  const [isCameraExpanded, setIsCameraExpanded] = useState<boolean>(true);
  const [camera, setCamera] = useState<string>(cameraData[0].type);
  const [distance, setDistance] = useState<number>(3);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [component, setComponent] = useState<any>(null); // change this too

  const handleComponentExpanded = () => {
    setIsComponentExpanded(!isComponentExpanded);
  };

  const handleCameraExpanded = () => {
    setIsCameraExpanded(!isCameraExpanded);
  };

  const handleCameraChange = (event: SelectChangeEvent) => {
    setCamera(event.target.value);
  };

  const handleDistanceChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDistance(+event.target.value);
  };

  const handleResetChange = () => {
    setIsReset(true);
    setDistance(3);
  };

  const handleItemSelection = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      if (!GLTFTree.children) return;
      const selectedComponent = findMeshById(GLTFTree.children, itemId);
      setComponent(selectedComponent);
      console.log(itemId, selectedComponent);
    } else {
      setComponent(null);
    }
  };

  return (
    <div className="flex w-full h-screen bg-main-black text-white">
      <div className="w-1/2 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className=" text-2xl font-bold bg-gray-900">Camera View</div>
        </div>
        <div className="bg-white text-black flex-grow">
          <RenderComponent
            cameraType={camera}
            distance={distance}
            isReset={isReset}
            handleReset={setIsReset}
            selectedComponent={component}
          />
        </div>
      </div>
      <div className="w-1/4 flex flex-col border-x-2">
        <div className="h-1/2 border-b-2 py-5 px-7 flex flex-col">
          <div className="pb-6">
            <div className="text-2xl font-bold bg-gray-900">Scene Graph</div>
          </div>
          <div className="bg-gray-900 flex-grow overflow-y-auto p-5">
            <TreeView
              treeItems={treeItems}
              handleItemSelection={handleItemSelection}
            />
          </div>
        </div>
        <div className="py-5 px-7 flex flex-col h-1/2">
          <div className="">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
          </div>
          <div className="flex gap-5 items-strech w-full py-3 overflow-x-auto">
            <Button
              id="play-button"
              handleClick={() => {}}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {}}
              text="Pause"
              className="bg-white text-black px-4"
            />
            <Button
              id="reverse-button"
              handleClick={() => {}}
              text="Reverse"
              className="bg-white text-black px-4"
            />
            <Button
              id="auto-replay-button"
              handleClick={() => {}}
              text="Auto Replay"
              className="bg-white text-black px-4"
            />
          </div>
          <div className="bg-gray-900 flex-grow">
            This is the place for animation
          </div>
        </div>
      </div>
      <div className="w-1/4 py-5 px-7 flex flex-col">
        <div className="pb-6">
          <div className="text-2xl font-bold bg-gray-900">Inspector</div>
        </div>
        <div className="bg-gray-900 flex-grow p-5">
          <Controller
            id="component-controller"
            isExpanded={isComponentExpanded}
            handleClick={handleComponentExpanded}
            title="Component Controller"
            component={component!!}
          />
          <CameraController
            id="camera-controller"
            isExpanded={isCameraExpanded}
            handleClick={handleCameraExpanded}
            title="Camera Controller"
            camera={camera}
            handleCameraChange={handleCameraChange}
            distance={distance}
            handleDistanceChange={handleDistanceChange}
            handleResetChange={handleResetChange}
          />
        </div>
      </div>
    </div>
  );
}
