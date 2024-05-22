"use client";

import Button from "@/components/ui/Button";
import RenderComponent from "@/components/render/RenderComponent";
import TreeView from "@/components/ui/TreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import ComponentController from "@/components/ui/Controller";
import React, { useEffect, useState } from "react";
import CameraController from "@/components/camera/CameraController";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  SelectChangeEvent,
} from "@mui/material";
import { convertGLTFToTreeView, findMeshById } from "@/libs/helper";
import { Loader } from "@/libs/class/loader/loader";
import { Scene } from "@/libs/class/scene";
import { Mesh } from "@/libs/class/mesh";
import Vector3 from "@/libs/base-types/vector3";
import { Quaternion } from "@/libs/base-types/quaternion";
import { Euler } from "@/libs/base-types/euler";
import { AnimationControllerType, CameraControllerType, ComponentControllerType } from "@/types/ui";
import CustomSlider from "@/components/ui/slider";

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

  const [cameraController, setCameraController] = useState<CameraControllerType>({
    type: "orthographicCamera",
    distance: 1
  }) 
  const [componentController, setComponentController] = useState<ComponentControllerType>({
    position: new Vector3(),
    rotation: new Euler(),
    scale: new Vector3()
  }) 
  const [animationController, setAnimationController] =
    useState<AnimationControllerType>({
      play: false,
      pause: false,
      reverse: false,
      playback: false,
      currentFrame: 0,
      maxFrame: 0,
    });

  const { reverse, playback } = animationController;

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setAnimationController((prevState) => ({
        ...prevState,
        currentFrame: newValue
      }));
      // console.log("Slider value: ", newValue)
    }
  };

  const handleAnimationControllerButton = (controller: string) => {
    if (controller === "play") {
      setAnimationController((prevState) => ({
        ...prevState,
        play: true,
        pause: false,
      }));
    } else if (controller === "pause") {
      setAnimationController((prevState) => ({
        ...prevState,
        pause: true,
        play: false,
      }));
    }
  };

  const handleAnimationControllerCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAnimationController((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSubmitController = (values: any) => {
    // console.log(values);
    // console.log(component?.rotation);

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

    if (component) {
      component.position = position;
      component.rotation = rotation;
      component.scale = scale;
      setComponent(component);
      setIsControllerChange(!isControllerChange);
    } else {
      setComponent(null);
    }

    // console.log("This is Current Component", component);
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
      // console.log(itemId, selectedComponent);
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
          />
        </div>
      </div>
      <div className="w-1/4 flex flex-col border-x-2">
        <div className="h-1/3 border-b-2 py-5 px-7 flex flex-col">
          <div className="pb-6 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gray-900">Scene Graph</div>
            <div className="flex items-center justify-center gap-3">
              <Button
                id="load-button"
                handleClick={() => {}}
                text="Load"
                className="bg-white text-black px-4 rounded-sm"
              />
              <Button
                id="save-button"
                handleClick={() => {}}
                text="Save"
                className="bg-white text-black px-4 rounded-sm"
              />
            </div>
          </div>
          <div className="bg-gray-900 flex-grow overflow-y-auto p-5">
            <TreeView
              treeItems={treeItems}
              handleItemSelection={handleItemSelection}
            />
          </div>
        </div>
        <div className="py-5 px-7 flex flex-col h-2/3">
          <div className="">
            <div className="text-2xl font-bold bg-gray-900">Animation</div>
          </div>
          <div className="flex gap-5 items-strech w-full py-3 overflow-x-auto">
            <Button
              id="play-button"
              handleClick={() => {
                handleAnimationControllerButton("play");
              }}
              text="Play"
              className="bg-white text-black px-4"
            />
            <Button
              id="pause-button"
              handleClick={() => {
                handleAnimationControllerButton("pause");
              }}
              text="Pause"
              className="bg-white text-black px-4"
            />
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "silver",
                    },
                  }}
                  checked={reverse}
                  onChange={handleAnimationControllerCheckbox}
                  name="reverse"
                />
              }
              label="Reverse"
            ></FormControlLabel>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "silver",
                    },
                  }}
                  checked={playback}
                  onChange={handleAnimationControllerCheckbox}
                  name="playback"
                />
              }
              label="Auto Replay"
            ></FormControlLabel>
          </FormGroup>
          <div className="flex gap-5 py-4 items-center justify-between">
            <div>Frame</div>
            <CustomSlider
              aria-label="animation frame slider"
              value={animationController.currentFrame}
              min={1}
              max={animationController.maxFrame}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
            />
          </div>
          <div className="bg-white flex-grow relative">
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
          <ComponentController
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
