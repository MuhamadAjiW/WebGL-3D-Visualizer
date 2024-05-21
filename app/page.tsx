"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";
import TreeView from "@/components/ui/TreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import Controller from "@/components/ui/Controller";
import { useEffect, useState } from "react";
import CameraController from "@/components/camera/CameraController";
import { SelectChangeEvent } from "@mui/material";
import { convertGLTFToTreeView, findMeshById } from "@/libs/helper";
import { Loader } from "@/libs/class/loader/loader";
import { Scene } from "@/libs/class/scene";
import { Mesh } from "@/libs/class/mesh";
import Vector3 from "@/libs/base-types/vector3";
import { Quaternion } from "@/libs/base-types/quaternion";
import { Euler } from "@/libs/base-types/euler";
import { AnimationController } from "@/types/ui";

export default function Home() {
  const [data, setData] = useState<Scene | null>(null);

  const fetchData = async () => {
    const response = await fetch("/scene.json");
    const data = await response.json();

    const loader: Loader = new Loader();
    setData(loader.loadFromJson(JSON.stringify(data)));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const GLTFTree = {
    id: `scene-${data?.name}`,
    name: data?.name,
    children: data?.children,
  };

  const treeItems: TreeViewBaseItem[] = [convertGLTFToTreeView(GLTFTree)];

  const [isComponentExpanded, setIsComponentExpanded] = useState<boolean>(true);
  const [isCameraExpanded, setIsCameraExpanded] = useState<boolean>(true);
  const [camera, setCamera] = useState<string>("perspectiveCamera");
  const [distance, setDistance] = useState<number>(3);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [component, setComponent] = useState<Mesh | null>(null);
  const [isControllerChange, setIsControllerChange] = useState<boolean>(false);
  const [animationController, setAnimationController] = useState<AnimationController>({
    play: false,
    pause: false,
    reverse: false,
    playback: false
  })

  const handleAnimationController = (controller: string) => {
    if (controller === "play") {
      setAnimationController(prevState => ({
        ...prevState,
        play: !animationController.play,
      }));
    } else if (controller === "pause") {
      setAnimationController(prevState => ({
        ...prevState,
        pause: !animationController.pause,
      }));
    } else if (controller === "reverse") {
      setAnimationController(prevState => ({
        ...prevState,
        reverse: !animationController.reverse,
      }));
    } else if (controller === "playback") {
      setAnimationController(prevState => ({
        ...prevState,
        playback: !animationController.playback,
      }));
    }
    setIsControllerChange(!isControllerChange);
  }

  const handleSubmitController = (values: any) => {
    console.log(values);
    console.log(component?.rotation);

    const position = new Vector3(
      values.position.x,
      values.position.y,
      values.position.z
    );
    const rotation = new Quaternion(
      values.rotation.w,
      values.rotation.x,
      values.rotation.y,
      values.rotation.z
    );
    const scale = new Vector3(values.scale.x, values.scale.y, values.scale.z);

    console.log(position, rotation, scale);

    if (component) {
      component.position = position;
      component.rotation = rotation;
      component.scale = scale;
      setComponent(component);
      setIsControllerChange(!isControllerChange);
    } else {
      setComponent(null);
    }

    console.log(component);
  };

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

  if (!data) return <div>Loading...</div>;

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
            meshes={data.children}
            isControllerChange={isControllerChange}
            animationController={animationController}
            setAnimationController={setAnimationController}
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
              handleClick={() => {handleAnimationController("play")}}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {handleAnimationController("pause")}}
              text="Pause"
              className="bg-white text-black px-4"
            />
            <Button
              id="reverse-button"
              handleClick={() => {handleAnimationController("reverse")}}
              text="Reverse"
              className="bg-white text-black px-4"
            />
            <Button
              id="auto-replay-button"
              handleClick={() => {handleAnimationController("playback")}}
              text="Auto Replay"
              className="bg-white text-black px-4"
            />
          </div>
          <div className="bg-white flex-grow">
            <RenderComponent
              cameraType={camera}
              distance={distance}
              isReset={isReset}
              handleReset={setIsReset}
              selectedComponent={component}
              meshes={data.children}
              isControllerChange={isControllerChange}
              animationController={animationController}
              setAnimationController={setAnimationController}
            />
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
            handleSubmit={handleSubmitController}
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
